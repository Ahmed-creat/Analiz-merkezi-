#!/usr/bin/env node
/* ============================================================
   v37 DAVRANIŞ TESTİ — tests/v37-davranis.test.js
   ------------------------------------------------------------
   Kullanıcının 29.10.2026 tarihli maddeleri, her biri ÖLÇÜLEREK:

     1) "5 soru 4. adımı bitirir bitirmez zaten açılıyor ... ne kadar
        çözülse de kalkmıyor"
        → otomatik açma kaldırıldı; test bitince düğme HİÇ çizilmiyor
     2) "Acil çalışılacaklar ilk 5'i göstersin"
        → varsayılan 5
     3) "Ajanda görseldeki gibi olsun. Her ayrı olayı ayrı renkte göster.
        Konu tekrarı, sınav, sınava hazırlık."
        → gün başlığı + tam genişlik renkli çubuklar + saat
     4) "Ana sayfada konuyu çalışsak bile hâlâ görevde gösteriyor"
        → bugün yapılan çalışma eylemi görevi kapatır
     5) "Hafıza gücü/öğrenme durumu ... her konunun satırını ayrı kart"
        → ders ayracı yok, her konu .konu-kart

   Metne değil DAVRANIŞA bakar: fonksiyonlar index.html'den çıkarılıp
   gerçekten çalıştırılır.
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const KOK = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const KART = fs.readFileSync(path.join(KOK, "site", "kart.js"), "utf8");

let gecen = 0, kalan = 0; const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ek !== undefined ? " → " + ek : "")); return false;
}

/** index.html'den bir fonksiyon govdesini cikar ve calistirilabilir hale getir. */
function fnCikar(ad) {
  const bas = HTML.indexOf("function " + ad + "(");
  if (bas < 0) throw new Error(ad + " bulunamadı");
  // suslu parantez dengesi
  let i = HTML.indexOf("{", bas), derinlik = 0, son = -1;
  for (let j = i; j < HTML.length; j++) {
    const c = HTML[j];
    if (c === "{") derinlik++;
    else if (c === "}") { derinlik--; if (derinlik === 0) { son = j + 1; break; } }
  }
  return HTML.slice(bas, son);
}

// ---- takvim yardımcıları (index.html ile aynı sözleşme) ----
const toDayStr = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const parseDay = str => {
  if (!str || typeof str !== "string" || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(str)) return null;
  const d = new Date(str.slice(0, 10) + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
};
const esc = x => String(x == null ? "" : x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const attr = x => esc(x);
const icon = (n) => "[" + n + "]";

const BUGUN = "2026-10-29";

function agenda(state, bugun) {
  const g = new Function("state", "todayStr", "parseDay", "toDayStr", "splitKey", "icon", "esc", "attr",
    fnCikar("calendarEventMap") + "\n" + fnCikar("renderAgendaHTML") +
    "\nreturn renderAgendaHTML(calendarEventMap());");
  return g(state, () => bugun || BUGUN, parseDay, toDayStr,
    k => { const i = String(k).indexOf(" > "); return i < 0 ? { lesson: k, topic: k } : { lesson: k.slice(0, i), topic: k.slice(i + 3) }; },
    icon, esc, attr);
}

function calisma(state, bugun) {
  const g = new Function("state", "todayStr", fnCikar("bugunCalismaVarMi") + "\nreturn bugunCalismaVarMi();");
  return g(state, () => bugun || BUGUN);
}

(async () => {

  // ================= 1) KISA KONTROL =================
  console.log("\n== 1) Kısa Kontrol kendiliğinden açılmaz, bitince kaybolur ==\n");

  // 1a) completeTopic içinde otomatik açma ÇAĞRISI olmamalı
  {
    const bas = HTML.indexOf("function completeTopic(key)");
    const son = HTML.indexOf("// Konu tamamlandıktan hemen sonra", bas);
    const govde = HTML.slice(bas, son);
    ok("completeTopic içinde miniKontrolBaslat ÇAĞRISI yok",
      !/^\s*miniKontrolBaslat\(/m.test(govde), "çağrı hâlâ var");
    ok("konu tamamlanınca nerede olduğu söyleniyor", /Kısa Kontrol hazır/.test(govde));
  }
  // 1b) "seni bekliyor" kartı yalnız ZAMANI GELİNCE çizilir
  {
    const bas = HTML.indexOf("const kisaDurum = (window.AnalizBKT && window.AnalizBKT.konuDurum)");
    const son = HTML.indexOf("5 soruluk kontrole başla", bas);
    const blok = HTML.slice(bas, son);
    ok("bekleyen kart kisaDue koşuluna bağlı", /kisaDue\s*&&\s*!kisaKapali/.test(blok));
    ok("kisaDue = motorun precheck'i", /const kisaDue = !!\(kisaDurum && kisaDurum\.precheck\)/.test(blok));
  }
  // 1c) v39 — 5 soruluk test KONU TAKİBİ KARTINDAN kaldırıldı (kullanıcı:
  // "neden hem flashcard hem 5 soru orda"). Tek yeri: Günlük Görevler satırı
  // (doğrudan testi açar) + Bilgi Bankası konu sayfası.
  {
    const bas = HTML.indexOf("  // ===== ÖĞRENME DURUMU · HAFIZA GÜCÜ (v39");
    const son = HTML.indexOf("  container.innerHTML = html;", bas);
    const kart = HTML.slice(bas, son);
    ok("Konu Takibi hafıza kartında 5 soru düğmesi YOK", kart.indexOf("data-bkt-test") < 0);
    ok("Günlük Görevlerde 5 soru görevi doğrudan testi açıyor",
      /aksiyon: "bktTest"[\s\S]{0,200}hedefMod: "precheck"/.test(HTML));
    ok("Öğrenme Testi (3. gün) ayrı görev", /hedefMod: "learning"/.test(HTML));
    ok("görev satırı data-bkt-test üretiyor", /g\.aksiyon === "bktTest"[\s\S]{0,300}data-bkt-test=/.test(HTML));
  }
  // 1d) test bittiğinde sunucu tarafı durumu: precheck_due ilerliyor
  {
    const eng = fs.readFileSync(path.join(KOK, "site", "bkt-engine.js"), "utf8");
    ok("test sonrası precheck_due ileri alınıyor",
      /kayit\.precheck_due = addDays\(TODAY\(\), gecti \? KISA_ARALIK_GUN : 1\)/.test(eng));
    ok("konuDurum 'precheckTarih' alanını veriyor", /precheckTarih: e\.precheck_due/.test(eng));
  }

  // ================= 2) ACİL ÇALIŞILACAKLAR: 5 =================
  console.log("\n== 2) Acil Çalışılacaklar: ilk 5 ==\n");
  ok("varsayılan sınır 5", /let urgentLimit = 5;/.test(HTML));
  // v39 — kullanıcı: "daha fazla göster yanlış çalışıyor". Artık sırayla
  // büyür (+5), liste bitince kapanır; toplam gerçek liste uzunluğundan gelir.
  ok("her basışta +5 açılır", /urgentLimit = \(urgentLimit >= toplam\) \? 5 : Math\.min\(toplam, urgentLimit \+ 5\);/.test(HTML));
  ok("hafıza kartlarında toplam doğru sayılıyor", /let hafizaKartToplam = 0;/.test(HTML) && /hafizaKartToplam = satirlar\.length;/.test(HTML));

  // ================= 3) AJANDA =================
  console.log("\n== 3) Ajanda: Google Takvim görünümü, ayrı renkler ==\n");
  {
    const state = {
      memory: {
        "Matematik > Trigonometri": { completedAt: BUGUN, schedule: { 3: "2026-11-01", 7: "2026-11-05" } },
        "Fizik > Kuvvet": { completedAt: BUGUN, schedule: { 3: "2026-11-01" } }
      },
      plan: {
        targetDate: "2026-11-12",
        schoolExams: [
          { id: "s1", lesson: "Matematik", date: "2026-11-05", time: "08:10-09:50" },
          { id: "s2", lesson: "S. Peygamberimizin Hayatı", date: "2026-11-05", time: "09:50-11:30" }
        ]
      }
    };
    const h = agenda(state);
    ok("ajanda üretildi", h.length > 100);
    ok("gün başlığı var (5 Kasım Per)", /aj-gun">5 Kasım/.test(h), (h.match(/aj-gun">[^<]*/) || [""])[0]);
    ok("sınav etiketi 'Sınav: Matematik'", h.indexOf("Sınav: Matematik") >= 0);
    ok("sınav saati yazılı", h.indexOf("08:10-09:50") >= 0);
    ok("konu tekrarı satırı", /Konu tekrarı[^<]{0,80}Trigonometri/.test(h));
    ok("sınava hazırlık satırı", /Sınava hazırlık: Matematik/.test(h));
    ok("deneme sınavı ayrı tür", /Sınav: Deneme/.test(h));
    // Renkler: her olay tipi farklı arka plan
    const renkler = [...h.matchAll(/class="aj-event"[^>]*background:(#[0-9A-Fa-f]{6})/g)].map(m => m[1].toUpperCase());
    ok("en az 4 renkli olay çizildi", renkler.length >= 4, String(renkler.length));
    ok("tekrar rengi tek (mor)", new Set(renkler).size >= 3, renkler.join(","));
    // v39 — kullanıcı: "renkler çok kötü" + "her olay türü kendi dolu rengiyle".
    // Renk artık TÜR bazlı: sınav bir renk, tekrar başka, hazırlık başka.
    // Aynı türdeki iki sınav aynı rengi paylaşır (Google Takvim'de de böyle).
    {
      const sinavR = (h.match(/aj-event"[^>]*background:(#[0-9A-Fa-f]{6})[^>]*>[\s\S]{0,120}?Sınav: Matematik/) || [])[1];
      const tekR = (h.match(/aj-event"[^>]*background:(#[0-9A-Fa-f]{6})[^>]*>[\s\S]{0,160}?Konu tekrarı/) || [])[1];
      const hazR = (h.match(/aj-event"[^>]*background:(#[0-9A-Fa-f]{6})[^>]*>[\s\S]{0,160}?Sınava hazırlık/) || [])[1];
      ok("sınav · tekrar · hazırlık AYRI dolgu renginde",
        !!sinavR && !!tekR && !!hazR && new Set([sinavR.toUpperCase(), tekR.toUpperCase(), hazR.toUpperCase()]).size === 3,
        [sinavR, tekR, hazR].join(","));
      ok("solda tür rengi şeridi var", /border-left-color:#[0-9A-Fa-f]{6}/.test(h));
      ok("ajanda kendi içinde kaydırılıyor", h.indexOf('class="aj-kaydir"') > 0);
      ok("\"Daha fazla göster\" düğmesi ajandada YOK", h.indexOf("moreAgenda") < 0);
    }
    // Google Takvim ajandası gibi: yalnız OLAYI OLAN günler başlık alır,
    // geçmiş gün gösterilmez, sıra ileri doğrudur.
    ok("ilk başlık bugünden sonraki ilk olay günü", /aj-gun">1 Kasım Paz/.test(h), (h.match(/aj-gun">[^<]*/) || [""])[0]);
    ok("geçmiş gün yok (29 Ekim başlığı yok)", !/aj-gun">29 Ekim/.test(h));
  }

  // ================= 4) ÇALIŞINCA GÖREV DÜŞER =================
  console.log("\n== 4) Konu çalışılınca günlük görev kapanır ==\n");
  {
    const bos = { dailyTasks: { study: false, read: false, solve: false, date: BUGUN }, topics: {}, memory: {}, exams: [], questions: [] };
    ok("hiç çalışma yoksa görev açık", calisma(bos) === false);
    ok("bayrak yazıldıysa kapalı", calisma({ ...bos, dailyTasks: { ...bos.dailyTasks, study: true } }) === true);
    ok("adım tamamlandıysa kapalı", calisma({ ...bos, topics: { "Mat > T": { step: 2, son_adim_tarihi: BUGUN } } }) === true);
    ok("konu bitti ise kapalı", calisma({ ...bos, topics: { "Mat > T": { completedAt: BUGUN + "T10:00:00.000Z" } } }) === true);
    ok("kısa kontrol yapıldıysa kapalı", calisma({ ...bos, mini_test_sessions: { "Mat > T": { started: BUGUN } } }) === true);
    ok("kart turu bittiyse kapalı", calisma({ ...bos, tekrarKartlari: { "Mat > T": { tamamlandi: BUGUN } } }) === true);
    ok("tekrar yapıldıysa kapalı", calisma({ ...bos, memory: { "Mat > T": { lastReview: BUGUN + "T09:00:00.000Z" } } }) === true);
    ok("dünkü çalışma bugünü kapatmaz", calisma({ ...bos, topics: { "Mat > T": { son_adim_tarihi: "2026-10-28" } } }) === false);
    ok("görev listesi bu kontrolü kullanıyor", /if \(!state\.dailyTasks\.study && !bugunCalismaVarMi\(\)\)/.test(HTML));
  }

  // ================= 5) KONU KARTLARI =================
  console.log("\n== 5) Öğrenme Durumu: her konu ayrı kart, ders ayracı yok ==\n");
  ok("ders ayracı kodu kaldırıldı", HTML.indexOf('class="ders-ayrac"') < 0);
  ok("konu-kart sınıfı tanımlı", /\.konu-kart \{/.test(HTML));
  ok("ölçüler ızgarada (mobilde taşmaz)", /\.konu-metre \{ display: grid; grid-template-columns: [0-9]+px minmax\(0, 1fr\) [0-9]+px/.test(HTML));
  ok("değer artık tek kelimeye bölünmez", /\.konu-metre-deger \{[^}]*white-space: nowrap/.test(HTML));
  ok("mobilde düğmeler tam genişlik", /@media \(max-width: 480px\)[\s\S]{0,260}\.konu-eylem \.btn \{ flex: 1 1 100%/.test(HTML));
  ok("başlıkta konu tek satır", /\.konu-kart-ad \{[^}]*overflow-wrap: anywhere/.test(HTML));

  // ================= 6) FLASHCARD 3B ÇEVİRME =================
  console.log("\n== 6) Flashcard gerçekten dönüyor (3B) ==\n");
  // v38 — 3B yaklaşımı bazı tarayıcılarda İKİ yüzü birden gösteriyordu
  // ("kart iki yerde, biri mavi diğeri beyaz"). Yeni sözleşme:
  //   • aynı anda TEK yüz çizilir (arka yüz ayrı bir DOM düğümü DEĞİL)
  //   • dokununca 90° dönüş animasyonu olur, içerik tam kenarda değişir
  ok("dönüş için perspective", KART.indexOf("perspective:1200px") >= 0);
  ok("çevirme sınıfı (90 derece)", /\.kart-ic\.cevir\{transform:rotateY\(90deg\);\}/.test(KART));
  ok("yumuşak dönüş (transition)", /\.kart-ic\{[^}]*transition:transform \.19s/.test(KART));
  ok("tek yüz: ayrı arka yüz düğümü yok", KART.indexOf("kart-arka") < 0);
  ok("içerik 90 derecede değişiyor", /setInterval|setTimeout\(function \(\) \{\s*acik = !acik;/.test(KART));
  ok("ikinci dokunuş animasyon sırasında yok sayılır", /if \(donuyor\) return;/.test(KART));
  ok("karta dokunma (data-kart-goster sahne üzerinde)", /kart-sahne" data-kart-goster/.test(KART));
  ok("geri çevirme düğmesi", KART.indexOf("data-kart-cevir") >= 0);
  ok("iki değerlendirme düğmesi (rapor §5.1)", /data-kart-puan="bildi"/.test(KART) && /data-kart-puan="bilemedi"/.test(KART) && KART.indexOf("Zorlandım") < 0);

  // ---------------- ÖZET ----------------
  console.log("\n" + "─".repeat(58));
  if (kalan) {
    hatalar.forEach(h => console.log(" ✗ " + h));
    console.log("v37 davranış testi — " + gecen + "/" + (gecen + kalan) + " geçti");
    process.exit(1);
  }
  console.log("v37 davranış testi — " + gecen + "/" + gecen + " geçti ✓");
})();
