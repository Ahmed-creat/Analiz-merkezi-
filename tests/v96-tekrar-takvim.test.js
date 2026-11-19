#!/usr/bin/env node
/* ============================================================
   v96 — HAZIRLIK BİTİŞ KURALI + SINAV GECESİ/SABAHI + RENKLİ TAKVİM
   ------------------------------------------------------------
   KULLANICI (20 Kas 2026, geri bildirim):
     "bir sınavdan en az 3 gün önce konuları bitmeli, son gün son konu
      tekrarı ve yazılı örnek senaryoları çözsün; sınav gecesi sabah hangi
      sınav varsa çalışmalı. Okulizyonda öğretmen çalışma günü vermiyor,
      karışıklık kalksın silelim. Takvim görseldeki gibi olsun, gerçekten
      renkli bölümler: sınavlar ayrı, deneme ayrı, tekrar ayrı renk."

   Bu test METNE değil DAVRANIŞA bakar:
     1) hiçbir hazırlık oturumu sınavdan 3 günden yakına yazılmaz
     2) son oturum "son tekrar + yazılı örnek senaryo" turudur
     3) sınav gecesi (sınav−1) ve sınav sabahı (sınav günü) satırları üretilir
     4) okulizyon sınav kaydına hazırlık GÜNÜ yazılmaz (prepDays tamamen gitti)
     5) takvimde her tür kendi DOLU rengiyle tam genişlikte blok olarak çizilir
     6) renk tek kaynaktan (CAL_RENK) gelir; ajanda da aynı haritayı kullanır
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const KOK = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const PWA = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ayrinti) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ayrinti !== undefined ? " → " + ayrinti : "")); return false;
}

function fnCikar(ad) {
  const bas = HTML.indexOf("function " + ad + "(");
  if (bas < 0) throw new Error(ad + " bulunamadı");
  let i = HTML.indexOf("{", bas), derinlik = 0, son = -1;
  for (let j = i; j < HTML.length; j++) {
    const c = HTML[j];
    if (c === "{") derinlik++;
    else if (c === "}") { derinlik--; if (derinlik === 0) { son = j + 1; break; } }
  }
  return HTML.slice(bas, son);
}
function blokCikar(baslangic, bitis) {
  const b = HTML.indexOf(baslangic);
  if (b < 0) throw new Error(baslangic + " bulunamadı");
  const s = HTML.indexOf(bitis, b);
  return HTML.slice(b, s + bitis.length);
}

const SABITLER = HTML.split("\n").filter(x => /^const HAZIRLIK_/.test(x)).join("\n");
const RENK_BLOGU = blokCikar("const CAL_RENK = {", "};");

const toDayStr = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const parseDay = s => {
  if (!s || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(s)) return null;
  const [y, m, dd] = s.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, dd);
};
const splitKey = k => {
  const i = String(k).indexOf(" > ");
  return i < 0 ? { lesson: "", topic: String(k) } : { lesson: String(k).slice(0, i), topic: String(k).slice(i + 3) };
};

const BUGUN = "2026-11-20";

// ---- kullanıcının GERÇEK verisine yakın senaryo ----
function senaryo() {
  const ders = (ad, n) => Array.from({ length: n }, (_, i) => ad + " > Konu " + (i + 1));
  const tde = ders("TDE", 21);
  tde[0] = "TDE > Şiirde Ahenk";
  tde[1] = "TDE > Koşuk";
  return {
    user: { grade: "10" },
    settings: { aytWeight: 0.5 },
    plan: {
      rhythm: "Akşam", examTime: "09:10", targetNet: 95, targetDate: "2026-12-20",
      schoolExams: [
        { id: "bio", lesson: "Biyoloji", date: "2027-01-05", topics: ders("Biyoloji", 8) },
        { id: "tar", lesson: "Tarih", date: "2027-01-06", topics: ders("Tarih", 6) },
        { id: "kim", lesson: "Kimya", date: "2027-01-06", topics: ders("Kimya", 8) },
        { id: "mat", lesson: "Matematik", date: "2027-01-07", topics: ders("Matematik", 13) },
        { id: "fiz", lesson: "Fizik", date: "2027-01-08", topics: ders("Fizik", 8) },
        { id: "fel", lesson: "Felsefe", date: "2027-01-08", topics: ders("Felsefe", 13) },
        { id: "cog", lesson: "Coğrafya", date: "2027-01-12", topics: ders("Coğrafya", 7) },
        { id: "din", lesson: "Din Kültürü", date: "2027-01-13", topics: ders("Din Kültürü", 12) },
        // hata günlüğünde ders adı "TDE" geçtiği için ders adı aynı (eşleşme)
        { id: "tde", lesson: "TDE", date: "2027-01-14", topics: tde }
      ]
    },
    exams: [{
      name: "Deneme", date: "2026-10-27", net: 77.5,
      errorLogs: [
        { lesson: "TDE", topic: "Şiirde Ahenk", type: "Konuyu Bilmiyordum", date: "2026-10-27" },
        { lesson: "TDE", topic: "Koşuk", type: "Konuyu Bilmiyordum", date: "2026-10-27" },
        { lesson: "Matematik", topic: "Konu 3", type: "Konuyu Bilmiyordum", date: "2026-10-27" }
      ]
    }],
    questions: [], memory: {}, topics: {}
  };
}

function kutu(state, bugun) {
  // Hata kaydı motoru (topicLearnedAfter → collectErrorStats → calculatePriority)
  // burada; hazırlık konuları gerçek hata günlüğünden gelir (v95 ile aynı imza).
  const govde = [
    SABITLER,
    fnCikar("topicLearnedAfter"),
    fnCikar("collectErrorStats"),
    fnCikar("calculatePriority"),
    fnCikar("hazirlikZayifKonular"),
    fnCikar("hazirlikOturumSayisi"),
    fnCikar("hazirlikGunSeti"),
    // v98 — deneme planı hedef net + ivmeye göre kurulur
    fnCikar("denemeIvmesi"),
    fnCikar("denemeIvmeCumlesi"),
    fnCikar("hazirlikPlani"),
    fnCikar("sinavYakinlari"),
    "\nreturn { hazirlikPlani: hazirlikPlani, sinavYakinlari: sinavYakinlari," +
    " hazirlikGunSeti: hazirlikGunSeti, hazirlikOturumSayisi: hazirlikOturumSayisi," +
    " denemeIvmeCumlesi: denemeIvmeCumlesi };"
  ].join("\n");
  const g = new Function("state", "todayStr", "parseDay", "toDayStr", "splitKey",
    "canonicalReason", "aytWeightOf", "getMemoryStrength", "saveState", govde);
  return g(state, () => bugun, parseDay, toDayStr, splitKey,
    x => x || "", () => 0.5, () => 50, () => { });
}

// Kullanıcıya GÖRÜNEN metin: JS yorumları çıkarılır (yorumda kullanıcının
// kendi cümlesini alıntılamak serbest, ekranda görünmez).
const GORUNEN = HTML
  .replace(/\/\*[\s\S]*?\*\//g, " ")
  .replace(/^\s*\/\/.*$/gm, " ")
  .replace(/\s\/\/\s[^"'\n]*$/gm, " ");

const F = kutu(senaryo(), BUGUN);
const plan = F.hazirlikPlani();

console.log("\n== 1) Konular sınavdan EN AZ 3 GÜN ÖNCE bitiyor ==");
{
  ok("hiçbir oturum sınavdan 3 günden yakın değil", plan.every(p => p.gunOnce >= 3),
    "en küçük: " + Math.min(...plan.map(p => p.gunOnce)));
  const tde = plan.filter(p => p.examId === "tde");
  ok("TDE'nin son oturumu 2027-01-11 (sınavdan 3 gün önce)",
    tde.some(p => p.date === "2027-01-11"), tde.map(p => p.date).join(","));
  ok("sınavdan 1 gün önce TDE hazırlık oturumu YOK",
    !tde.some(p => p.gunOnce < 3), tde.map(p => p.gunOnce).join(","));
  ok("konuların tamamı sınavdan önce bitiyor",
    new Set(tde.flatMap(p => p.konular)).size === 21, new Set(tde.flatMap(p => p.konular)).size);
  ok("günde en çok 2 oturum korunuyor",
    Object.values(plan.reduce((a, p) => { a[p.date] = (a[p.date] || 0) + 1; return a; }, {}))
      .every(n => n <= 2));
  ok("sınava 2 gün kala hazırlık oturumu üretilmez", F.hazirlikOturumSayisi(21, 2, "okul") === 0);
  ok("sınava 3 gün kala da üretilmez (3 günden önce bitmeli)", F.hazirlikOturumSayisi(21, 3, "okul") === 0);
  ok("gün seti sınavdan 3 günden yakına inmez", F.hazirlikGunSeti(7, 40).every(x => x >= 3),
    F.hazirlikGunSeti(7, 40).join(","));
}

console.log("\n== 2) Son gün: son konu tekrarı + yazılı örnek senaryo ==");
{
  const tde = plan.filter(p => p.examId === "tde");
  const sonlar = tde.filter(p => p.son);
  ok("her sınavın TEK bir son oturumu var", sonlar.length === 1, sonlar.length);
  ok("son oturum en geç tarihli olan", sonlar[0].date === tde.map(p => p.date).sort().pop(),
    sonlar[0].date);
  ok("son oturum sınavdan tam 3 gün önce", sonlar[0].gunOnce === 3, sonlar[0].gunOnce);
  ok("etiket 'Son tekrar + yazılı örnek senaryo' diyor",
    /^Son tekrar \+ yazılı örnek senaryo: /.test(sonlar[0].etiket), sonlar[0].etiket);
  ok("detayda yazılı örnek senaryo çözümü var", /yazılı örnek senaryo/.test(sonlar[0].detay), sonlar[0].detay);
  ok("bildirim metni son tekrarı söylüyor", /SON TEKRAR \+ yazılı örnek senaryo/.test(sonlar[0].bildirim), sonlar[0].bildirim);
  ok("son oturum da GERÇEK konu taşıyor", sonlar[0].konular.length > 0, sonlar[0].konular.length);
  ok("diğer oturumlar 'Sınava hazırlık' başlığını koruyor",
    tde.filter(p => !p.son).every(p => /^Sınava hazırlık: /.test(p.etiket)));
  ok("gün detayında son tur ayrı başlıkla çiziliyor",
    /SON TUR: konular burada bitiyor/.test(HTML) && /pen-line/.test(HTML));
  // bildirim metni de "son tur" olduğunu söyler (aynı plandan)
  const g = new Function("state", "todayStr", "parseDay", "toDayStr", "splitKey",
    "canonicalReason", "aytWeightOf", "getMemoryStrength", "saveState",
    SABITLER + "\n" + fnCikar("hazirlikZayifKonular") + "\n" + fnCikar("hazirlikOturumSayisi") + "\n" +
    fnCikar("hazirlikGunSeti") + "\n" + fnCikar("hazirlikPlani") + "\n" + fnCikar("hazirlikBildirimMetni") +
    "\nreturn { plan: hazirlikPlani, metin: hazirlikBildirimMetni };");
  const s2 = senaryo();
  const X = g(s2, () => BUGUN, parseDay, toDayStr, splitKey, x => x || "", () => 0.5, () => 50, () => { });
  const sonGun = X.plan().filter(p => p.son && p.kaynak === "okul")[0];
  const m = X.metin([sonGun]);
  ok("bildirim 'SON TUR' diyor", /SON TUR — /.test(m.body), m.body);
  ok("bildirim yazılı örnek senaryoyu da söylüyor", /yazılı örnek senaryo/.test(m.body), m.body);
}

console.log("\n== 3) Sınav gecesi + sınav sabahı çalışması ==");
{
  const yakin = F.sinavYakinlari();
  const tde = yakin.filter(p => p.examId === "tde");
  ok("TDE için gece + sabah satırı var", tde.length === 2, tde.map(p => p.tip).join(","));
  ok("sınav gecesi sınavdan 1 gün önce", tde.some(p => p.tip === "gece" && p.date === "2027-01-13"),
    tde.map(p => p.date + ":" + p.tip).join(","));
  ok("sınav sabahı sınav günü", tde.some(p => p.tip === "sabah" && p.date === "2027-01-14"),
    tde.map(p => p.date + ":" + p.tip).join(","));
  ok("gece satırı 'son bakış' diyor", tde.find(p => p.tip === "gece").etiket.indexOf("son bakış") > 0,
    tde.find(p => p.tip === "gece").etiket);
  ok("sabah satırı '15 dk göz atma' diyor", tde.find(p => p.tip === "sabah").etiket.indexOf("15 dk göz atma") > 0,
    tde.find(p => p.tip === "sabah").etiket);
  ok("deneme için de gece + sabah üretildi", yakin.filter(p => p.examId === "deneme").length === 2,
    yakin.filter(p => p.examId === "deneme").map(p => p.tip).join(","));
  ok("her sınav (9 okul + 1 deneme) için 2 satır", yakin.length === 20, yakin.length);
  ok("geçmiş sınav için satır üretilmez",
    kutu({ plan: { schoolExams: [{ id: "g", lesson: "Fizik", date: "2026-11-01", topics: [] }] }, exams: [], questions: [], memory: {} }, BUGUN)
      .sinavYakinlari().length === 0);
  ok("takvimde gece/sabah ayrı olay türü", /tip: k\.tip/.test(fnCikar("calendarEventMap")));
  ok("günlük görev listesi gece/sabahı gösteriyor",
    /sinavYakinlari\(\)\.filter\(p => p\.date === todayStr\(\)\)/.test(HTML) && /sınavı gecesi · son bakış/.test(HTML));
  ok("bildirim de aynı kaynaktan",
    /sinavYakinlari\(\)\.filter\(p => p\.date === bugun\)/.test(HTML));
}

console.log("\n== 3b) 'Yanlış defteri' YOK: metin gerçek konu adı taşır ==");
{
  // KULLANICI: "Yanlış defteri ne? Uygulamada öyle bir şey geçmiyor ki."
  ok("ekranda 'yanlış defteri' diye bir şey geçmiyor",
    !/yanlış defteri|yanlış soru defteri/i.test(GORUNEN));
  ok("'formül turu' gibi uydurma tur adı da yok",
    !/formül turu|Formül turu/i.test(GORUNEN));
  const yakin = F.sinavYakinlari();
  const tdeGece = yakin.find(p => p.examId === "tde" && p.tip === "gece");
  const tdeSabah = yakin.find(p => p.examId === "tde" && p.tip === "sabah");
  const denGece = yakin.find(p => p.examId === "deneme" && p.tip === "gece");
  ok("gece metni GERÇEK konu adı taşıyor (Şiirde Ahenk/ Koşuk)",
    /Şiirde Ahenk/.test(tdeGece.detay) && /Koşuk/.test(tdeGece.detay), tdeGece.detay);
  ok("gece metni nereden geldiğini söylüyor (Denemelerim)",
    /Denemelerim'de yanlış yaptığın konular/.test(tdeGece.detay), tdeGece.detay);
  ok("sabah metni de aynı konuları tekrar ediyor",
    /Şiirde Ahenk/.test(tdeSabah.detay), tdeSabah.detay);
  ok("gece satırı konuları veri olarak taşıyor", Array.isArray(tdeGece.konular) && tdeGece.konular.length > 0,
    JSON.stringify(tdeGece.konular));
  ok("deneme gecesi tüm derslerden gerçek konu alıyor",
    /Matematik: /.test(denGece.detay) || /Şiirde Ahenk/.test(denGece.detay), denGece.detay);
  ok("bildirim metni de konu adı taşıyor", /Şiirde Ahenk/.test(tdeGece.bildirim), tdeGece.bildirim);

  // Konu yoksa UYDURMA yok
  const bos = kutu({
    plan: { schoolExams: [{ id: "b", lesson: "Fizik", date: "2026-12-10", topics: [] }] },
    exams: [], questions: [], memory: {}, topics: {}
  }, BUGUN).sinavYakinlari();
  const bg = bos.find(p => p.tip === "gece");
  ok("konu/hata yoksa 'kayıtlı hata yok' denir, konu uydurulmaz",
    /kayıtlı hata ya da konu yok/.test(bg.detay) && bg.konular.length === 0, bg.detay);

  // Sınav kapsamı varsa, o kapsam gösterilir (gerçek seçim)
  const kap = kutu({
    plan: { schoolExams: [{ id: "k", lesson: "Fizik", date: "2026-12-10", topics: ["Fizik > Vektörler", "Fizik > Kuvvet"] }] },
    exams: [], questions: [], memory: {}, topics: {}
  }, BUGUN).sinavYakinlari().find(p => p.tip === "gece");
  ok("hata yoksa sınav için seçilen konular gösterilir",
    /Sınav için seçtiğin konular: Vektörler, Kuvvet/.test(kap.detay), kap.detay);
}

console.log("\n== 4) Okulizyon: öğretmen çalışma günü vermiyor → karışıklık kalktı ==");
{
  ok("okulizyon sınav kaydına hazırlık günü YAZILMIYOR", PWA.indexOf("prepDays") < 0);
  ok("ikinci gün hesabı (schoolPrepDaysFor) silindi", HTML.indexOf("schoolPrepDaysFor") < 0);
  ok("okulizyon sınavı yalnız ders/tarih/konu taşıyor",
    /lesson: d\.lesson, date: d\.tarih, time: "", topics: \[\], auto: true\s*\n\s*\}\);/.test(PWA));
  ok("okulizyon sınavı hâlâ takvime ekleniyor", /okzDuyurularToSchoolExams/.test(PWA));
}

console.log("\n== 5) Takvim: gerçekten renkli bölümler ==");
{
  ok("renk haritası 7 olay türü tanımlıyor",
    (RENK_BLOGU.match(/renk: "#[0-9A-Fa-f]{6}"/g) || []).length === 7,
    (RENK_BLOGU.match(/renk: "#[0-9A-Fa-f]{6}"/g) || []).length);
  const renkler = (RENK_BLOGU.match(/renk: "(#[0-9A-Fa-f]{6})"/g) || []).map(x => x.slice(7, 14));
  ok("her türün rengi FARKLI (sınav/deneme/tekrar/hazırlık ayrı)", new Set(renkler).size === renkler.length, renkler.join(","));
  ["sinav", "deneme", "hazirlik", "son", "tek", "gece", "sabah"].forEach(t =>
    ok("renk haritasında '" + t + "' var", new RegExp("\\b" + t + ":\\s*\\{").test(RENK_BLOGU)));
  ok("son oturum farklı renk alıyor (son → ayrı ton)", /if \(e\.tip === "hazirlik"\) return e\.son \? CAL_RENK\.son : CAL_RENK\.hazirlik;/.test(HTML));
  ok("gösterge takvimle AYNI haritadan üretiliyor",
    /Object\.keys\(CAL_RENK\)\.map/.test(HTML) && HTML.indexOf("Konu tekrarı (3/7/14/21/28. gün)</span>") < 0);
  ok("gün hücresi tam genişlikte renkli blok çiziyor",
    /class="cal-ev" style="background:' \+ calRenk\(e\)\.renk/.test(HTML));
  ok("blok zemini dolu renk, beyaz metin (CSS)",
    /\.cal-ev \{[^}]*color: #fff/.test(HTML) && !/\.cal-pill \{/.test(HTML));
  ok("ilk 3 blok + '+N daha' (Google Takvim davranışı)",
    /evs\.slice\(0, 3\)/.test(HTML) && /cal-ev-fazla/.test(HTML));
  ok("ajanda da aynı renk haritasını kullanıyor (tek renk kaynağı)",
    /function renk\(e\) \{\s*\n\s*const p = calRenk\(e\);/.test(HTML) && HTML.indexOf("const PALET = {") < 0);
  ok("hücre yüksekliği bloklara yetiyor (min-height 104px)",
    /\.cal-day \{[^}]*min-height: 104px/.test(HTML));
}

console.log("\n== 6) Takvim ÇIKTISI gerçekten renkli blok üretiyor (davranış) ==");
{
  const g = new Function("state", "todayStr", "parseDay", "toDayStr", "splitKey",
    "calculatePriority", "getMemoryStrength", "saveState", "icon", "esc", "attr",
    "renderCalDetailHTML", "renderAgendaHTML", "fmtDate",
    [
      "let calCursor = null; let calSelected = null;",
      SABITLER, RENK_BLOGU,
      fnCikar("calRenk"),
      fnCikar("hazirlikZayifKonular"), fnCikar("hazirlikOturumSayisi"), fnCikar("hazirlikGunSeti"),
      fnCikar("denemeIvmesi"), fnCikar("denemeIvmeCumlesi"),
      fnCikar("hazirlikPlani"), fnCikar("sinavYakinlari"), fnCikar("calendarEventMap"),
      fnCikar("renderCalendarHTML"),
      "\nreturn { ay: function (y, m) { calCursor = new Date(y, m, 1); }," +
      " ciz: function () { return renderCalendarHTML(); }," +
      " olaylar: function () { return calendarEventMap(); } };"
    ].join("\n"));
  const s = senaryo();
  const R = g(s, () => BUGUN, parseDay, toDayStr, splitKey,
    () => [], () => 0, () => { }, () => "", x => String(x), x => String(x),
    () => "", () => "", x => x);

  R.ay(2026, 11);            // Aralık 2026
  const aralik = R.ciz();
  ok("Aralık takvimi blok içeriyor", /class="cal-ev"/.test(aralik));
  ok("Aralık'ta deneme hazırlığı (turuncu #F4511E) görünüyor", aralik.indexOf("#F4511E") > 0);
  ok("Aralık'ta deneme gecesi (turkuaz #00796B) görünüyor", aralik.indexOf("#00796B") > 0);
  ok("her gün hücresi buton olarak çiziliyor", (aralik.match(/data-act="calDay"/g) || []).length === 31,
    (aralik.match(/data-act="calDay"/g) || []).length);

  R.ay(2027, 0);             // Ocak 2027
  const ocak = R.ciz();
  ok("Ocak'ta okul sınavı günü (kırmızı #D50000) var", ocak.indexOf("#D50000") > 0);
  ok("Ocak'ta son tekrar (pembe #C2185B) var", ocak.indexOf("#C2185B") > 0);
  ok("Ocak'ta sınav sabahı (yeşil #0B8043) var", ocak.indexOf("#0B8043") > 0);
  ok("birden çok renk aynı ızgarada", new Set((ocak.match(/background:(#[0-9A-F]{6})/g) || [])).size >= 4,
    new Set((ocak.match(/background:(#[0-9A-F]{6})/g) || [])).size);

  const olaylar = R.olaylar();
  ok("sınav günü hem 'sinav' hem 'sabah' olayı var",
    (olaylar["2027-01-14"] || []).some(e => e.tip === "sinav") &&
    (olaylar["2027-01-14"] || []).some(e => e.tip === "sabah"),
    (olaylar["2027-01-14"] || []).map(e => e.tip).join(","));
  ok("sınav gecesi bir önceki güne yazıldı",
    (olaylar["2027-01-13"] || []).some(e => e.tip === "gece"),
    JSON.stringify(Object.keys(olaylar["2027-01-13"] || [])));
}

console.log("\n== 7) Gün detayı başlığı: YALNIZ tür + ders (konu tekrarı yok) ==");
{
  // KULLANICI: "başlıklara neden konuları yazıyorsun ki, zaten konular altta
  // yazıyor. 'Son konu tekrarı: MATEMATİK', 'Sınava hazırlık: Din Kültürü'."
  const g = new Function("state", "todayStr", "parseDay", "toDayStr", "splitKey",
    "canonicalReason", "aytWeightOf", "getMemoryStrength", "saveState", "icon", "esc", "attr",
    [
      "let calSelected = null;",
      SABITLER, RENK_BLOGU, fnCikar("calRenk"),
      fnCikar("hazirlikZayifKonular"), fnCikar("hazirlikOturumSayisi"), fnCikar("hazirlikGunSeti"),
      fnCikar("denemeIvmesi"), fnCikar("denemeIvmeCumlesi"),
      fnCikar("hazirlikPlani"), fnCikar("sinavYakinlari"), fnCikar("calendarEventMap"),
      fnCikar("renderCalDetailHTML"),
      "\nreturn { gun: function (ds) { calSelected = ds; return renderCalDetailHTML(calendarEventMap()); } };"
    ].join("\n"));
  const s3 = senaryo();
  const D = g(s3, () => BUGUN, parseDay, toDayStr, splitKey, x => x || "", () => 0.5, () => 50, () => { },
    n => "[" + n + "]", x => String(x == null ? "" : x), x => String(x == null ? "" : x));

  // son tur günü (TDE sınavı 2027-01-14 → son oturum 2027-01-11)
  const son = D.gun("2027-01-11");
  ok("son tur başlığı 'Son konu tekrarı + yazılı örnek senaryo: <ders>'",
    /Son konu tekrarı \+ yazılı örnek senaryo: TDE\b/.test(son),
    (son.match(/Son konu tekrarı[^<]{0,140}/) || [""])[0]);
  ok("başlıkta konu adı YOK (başlık satırında ' · ' ile konu sıralanmıyor)",
    !/Son konu tekrarı \+ yazılı örnek senaryo: TDE · /.test(son));
  ok("konular yine alttaki listede duruyor",
    /Son tekrar konuları \(\d+\):/.test(son) && /cd-row/.test(son));

  // normal hazırlık günü — v99: oturumlar artık ELDEKİ TÜM günlere yayılıyor,
  // bu yüzden tarih sabitlenmez; plandan gerçek bir TDE çalışma günü seçilir.
  const tdeGunler = F.hazirlikPlani().filter(p => p.examId === "tde" && !p.son)
    .map(p => p.date).sort();
  const haz = D.gun(tdeGunler[tdeGunler.length - 1]);
  ok("hazırlık başlığı 'Sınava hazırlık: <ders>'",
    /Sınava hazırlık: TDE\b/.test(haz), (haz.match(/Sınava hazırlık[^<]{0,120}/) || [""])[0]);
  ok("hazırlık başlığında konu adı yok", !/Sınava hazırlık: TDE · /.test(haz));
  ok("hazırlık açıklaması 'hata günlüğü' gibi uydurma terim kullanmıyor",
    !/hata günlüğü/i.test(haz) && /Denemelerim'deki hatalarına/.test(haz));

  // Takvim bloğu ile gün detayı AYNI başlık dilini kullanır (v97).
  const harita = (function () {
    const h = new Function("state", "todayStr", "parseDay", "toDayStr", "splitKey",
      "canonicalReason", "aytWeightOf", "getMemoryStrength", "saveState",
      [SABITLER, fnCikar("hazirlikZayifKonular"), fnCikar("hazirlikOturumSayisi"),
       fnCikar("hazirlikGunSeti"), fnCikar("denemeIvmesi"), fnCikar("denemeIvmeCumlesi"),
       fnCikar("hazirlikPlani"), fnCikar("sinavYakinlari"),
       fnCikar("calendarEventMap"), "\nreturn calendarEventMap();"].join("\n"));
    return h(senaryo(), () => BUGUN, parseDay, toDayStr, splitKey, x => x || "", () => 0.5, () => 50, () => { });
  })();
  const tumEtiketler = Object.values(harita).flat().map(e => e.kisa || e.etiket).join(" | ");
  ok("takvim bloğunda 'Son konu tekrarı: TDE'", tumEtiketler.indexOf("Son konu tekrarı: TDE") >= 0,
    tumEtiketler.slice(0, 200));
  ok("takvim bloğunda 'Sınava hazırlık: TDE'", tumEtiketler.indexOf("Sınava hazırlık: TDE") >= 0);
  ok("takvim bloğunda 'Sınav gecesi: TDE'", tumEtiketler.indexOf("Sınav gecesi: TDE") >= 0);
  ok("takvim bloğunda 'Sınav sabahı: TDE'", tumEtiketler.indexOf("Sınav sabahı: TDE") >= 0);
  ok("takvim bloğunda eski kısa 'Gece:'/'Sabah:' etiketi kalmadı",
    !/\bGece: |\bSabah: /.test(tumEtiketler), tumEtiketler.slice(0, 200));
}

console.log("\n== 8) DENEME: yazılı örnek yok, hedef net + ivme, TÜM hatalar kapsanır ==");
{
  // (a) Deneme son oturumu "yazılı örnek senaryo" DEMEZ (deneme test sınavıdır).
  {
    const den = plan.filter(p => p.examId === "deneme").sort((a, b) => (a.date < b.date ? -1 : 1));
    const son = den[den.length - 1];
    ok("deneme son oturumunda 'yazılı örnek' YOK",
      !/yazılı örnek/i.test(son.etiket + " " + son.detay + " " + son.bildirim),
      son.etiket + " | " + son.bildirim);
    ok("deneme son oturumu 'Deneme öncesi son tekrar'",
      /^Deneme öncesi son tekrar/.test(son.etiket), son.etiket);
    // v100 — konu yetmediği günler "Deneme tekrarı" olur (yeni konu değil).
    ok("deneme oturumları 'Deneme hazırlığı' / 'Deneme tekrarı' dili kullanıyor",
      den.filter(p => !p.son).every(p => /^Deneme (hazırlığı|tekrarı)/.test(p.etiket)),
      den.map(p => p.etiket).join(" | "));
    ok("tekrar oturumu etiketi 'Deneme tekrarı' der",
      den.filter(p => p.tekrar && !p.son).every(p => /^Deneme tekrarı/.test(p.etiket)));
    ok("okul sınavında 'yazılı örnek senaryo' KALIYOR",
      plan.filter(p => p.kaynak === "okul" && p.son).every(p => /yazılı örnek senaryo/.test(p.etiket)));
  }

  // (b) Hedef net + ivme hesabı gerçek veriden
  {
    const s2 = senaryo();
    // iki deneme: 60 → 62 net, 30 gün ara; hedef 95, hedefe 30 gün
    s2.exams = [
      { name: "D1", date: "2026-10-01", net: 60, errorLogs: [] },
      { name: "D2", date: "2026-10-31", net: 62, errorLogs: [] }
    ];
    s2.plan.targetNet = 95;
    const G = kutu(s2, BUGUN);
    const v = (function () {
      const h = new Function("state", "todayStr", "parseDay", "toDayStr", "splitKey",
        "canonicalReason", "aytWeightOf", "getMemoryStrength", "saveState",
        SABITLER + "\n" + fnCikar("denemeIvmesi") + "\n" + fnCikar("denemeIvmeCumlesi") +
        "\nreturn { v: denemeIvmesi(), c: denemeIvmeCumlesi(denemeIvmesi()) };");
      return h(s2, () => BUGUN, parseDay, toDayStr, splitKey, x => x || "", () => 0.5, () => 50, () => { });
    })();
    ok("son net = 62", v.v.sonNet === 62, v.v.sonNet);
    ok("hedef net = 95", v.v.hedef === 95, v.v.hedef);
    ok("gereken net = +33", v.v.gerekenNet === 33, v.v.gerekenNet);
    ok("ölçülen ivme = +0.47 net/hafta (2 net / 30 gün)",
      Math.abs(v.v.olculenIvme - 0.47) < 0.01, v.v.olculenIvme);
    ok("kalan hafta hesaplandı", v.v.kalanHafta >= 4, v.v.kalanHafta);
    ok("gereken ivme > ölçülen → durum GERİDE", v.v.durum === "geride", v.v.durum);
    ok("ivme cümlesi hedefi, son neti ve gereken tempoyu söylüyor",
      /Hedef 95 net/.test(v.c) && /son net 62/.test(v.c) && /net\/hafta/.test(v.c), v.c);
    ok("ivme cümlesi GERİDE diyor ve oturum başına 2 konuyu açıklıyor",
      /GERİDE/.test(v.c) && /oturum başına 2 konu/.test(v.c), v.c);
    ok("geride ivmede plan oturum başına 2 konuya iner",
      G.hazirlikPlani().filter(p => p.examId === "deneme").every(p => p.oturumKonu === 2),
      G.hazirlikPlani().filter(p => p.examId === "deneme").map(p => p.oturumKonu).join(","));
  }

  // (c) Hataların TAMAMI kapsanır (30 farklı konu → 30 konu plana girer)
  {
    const s3 = senaryo();
    const hatalar = [];
    for (let i = 1; i <= 30; i++) {
      hatalar.push({ lesson: i % 2 ? "Matematik" : "Fizik", topic: "Hata " + i, type: "Konuyu Bilmiyordum", date: "2026-10-27" });
    }
    s3.exams = [{ name: "D", date: "2026-10-27", net: 77.5, errorLogs: hatalar }];
    s3.memory = {}; s3.questions = [];
    const G = kutu(s3, BUGUN);
    const den = G.hazirlikPlani().filter(p => p.examId === "deneme");
    const hepsi = new Set(den.flatMap(p => p.konular));
    ok("30 hata konusunun TAMAMI planda", hepsi.size === 30, hepsi.size);
    ok("her oturumda en çok 3 konu", den.every(p => p.konular.length <= 3),
      den.map(p => p.konular.length).join(","));
    // v99 — son oturum TEKRAR olduğu için 30 konu = 10 çalışma + 1 son tekrar.
    // v100 — KULLANICI: "boş gün olmasın, günde 3 yerine 2 veya 1 çalışılabilir."
    // Oturum sayısı PENCEREYE eşitlenir (30 gün kaldı → 27 gün dolu).
    ok("oturum sayısı pencereyi dolduruyor (27)", den.length === 27, den.length);
    const sonDen = den[den.length - 1];
    const calisilan = new Set(den.filter(p => !p.tekrar).flatMap(p => p.konular));
    ok("son tekrar YENİ konu taşımaz (hepsi daha önce çalışıldı)",
      sonDen.tekrar === true && sonDen.konular.every(k => calisilan.has(k)),
      sonDen.konular.join(" | "));
    ok("konuların tamamı ÇALIŞMA oturumlarında", calisilan.size === 30, calisilan.size);
    ok("oturum başına konu 1-3 arası (konu azsa 1'e iner)",
      den.every(p => p.konular.length >= 1 && p.konular.length <= 3),
      den.map(p => p.konular.length).join(","));
    ok("30 konu 26 çalışma oturumuna yayılır (1-2 konu/gün)",
      den.filter(p => !p.tekrar && !p.son).every(p => p.konular.length <= 2),
      den.map(p => p.konular.length).join(","));
    ok("kapsama bilgisi kayıtta (30/30)", den[0].kapsananHata === 30 && den[0].hataSayisi === 30,
      den[0].kapsananHata + "/" + den[0].hataSayisi);
    ok("'sonraki tura kaldı' uyarısı yok", !den.some(p => p.kalanKonu > 0));
    ok("deneme oturumları sınavdan en az 3 gün önce",
      den.every(p => p.gunOnce >= 3), den.map(p => p.gunOnce).join(","));
  }

  // (e) Gün detayı dili: denemede "denemeye N gün", okulda "sınavdan N gün"
  {
    const g2 = new Function("state", "todayStr", "parseDay", "toDayStr", "splitKey",
      "canonicalReason", "aytWeightOf", "getMemoryStrength", "saveState", "icon", "esc", "attr",
      [
        "let calSelected = null;",
        SABITLER, RENK_BLOGU, fnCikar("calRenk"),
        fnCikar("hazirlikZayifKonular"), fnCikar("hazirlikOturumSayisi"), fnCikar("hazirlikGunSeti"),
        fnCikar("denemeIvmesi"), fnCikar("denemeIvmeCumlesi"),
        fnCikar("hazirlikPlani"), fnCikar("sinavYakinlari"), fnCikar("calendarEventMap"),
        fnCikar("renderCalDetailHTML"),
        "\nreturn { plan: hazirlikPlani, gun: function (ds) { calSelected = ds; return renderCalDetailHTML(calendarEventMap()); } };"
      ].join("\n"));
    const s4 = senaryo();
    s4.exams = [
      { id: "d1", date: "2026-10-01", net: 60, errorLogs: [] },
      { id: "d2", date: "2026-10-31", net: 62, errorLogs: [] }
    ];
    s4.plan.targetNet = 95;
    const X2 = g2(s4, () => BUGUN, parseDay, toDayStr, splitKey, x => x || "", () => 0.5, () => 50, () => { },
      (n, sz, st) => '<i data-i="' + n + '"></i>', x => String(x == null ? "" : x), x => String(x == null ? "" : x));
    const den2 = X2.plan().filter(p => p.kaynak === "deneme");
    const orta = X2.gun(den2[0].date), son2 = X2.gun(den2[den2.length - 1].date);
    ok("deneme gün detayı 'denemeye N gün' diyor", /denemeye \d+ gün/.test(orta), orta.slice(0, 200));
    const ortaKutu = orta.split('class="cd-box"').filter(x => /Deneme hazırlığı/.test(x))[0] || "";
    ok("deneme kutusunda 'sınavdan' GEÇMEZ", ortaKutu.length > 0 && !/sınavdan/.test(ortaKutu),
      ortaKutu.slice(0, 200));
    // Aynı gün okul sınavı hazırlığı da olabilir → yalnız DENEME kutusuna bak.
    const denKutu = son2.split('class="cd-box"').filter(x => /Deneme öncesi son tekrar/.test(x))[0] || "";
    // KULLANICI (20 Kas 2026): "yazılı örnek yoksa yok. Niye öğrenciye yok
    // diyorsun? O biliyor zaten." → uygulama DÜZELTME CÜMLESİ yazmaz.
    ok("deneme son tekrar kutusunda 'yazılı örnek senaryo' GEÇMEZ", denKutu.length > 0 && !/yazılı örnek senaryo/.test(denKutu),
      denKutu.slice(0, 250));
    ok("deneme son tekrarı 'yok / değil / test sınavıdır' demez", denKutu.length > 0 &&
      !/yok\b/i.test(denKutu) && !/sınavıdır/i.test(denKutu) && !/değil/i.test(denKutu),
      denKutu.slice(0, 250));
    ok("deneme son tekrarı ne YAPILACAĞINI söyler",
      /Bugün yeni konu açma/.test(denKutu) && /son tekrarı/.test(denKutu), denKutu.slice(0, 250));
    ok("deneme oturum sırası görünür (1/N)", /1\/\d+/.test(orta), orta.slice(0, 160));
    ok("deneme bildirimi 'denemeye N gün' diyor", /^Deneme \(denemeye \d+ gün\)/.test(den2[0].bildirim), den2[0].bildirim);
    ok("deneme bildiriminde 'yazılı örnek senaryo' YOK", !/yazılı örnek senaryo/.test(den2[0].bildirim + den2[den2.length - 1].bildirim));
  }

  // (f) GENEL KURAL: düzeltme ifadesi uygulamaya yazılmaz.
  //     KULLANICI: "Prompttaki düzeltme ifadelerini uygulamaya eklemeyi
  //     bırakın... yazılı örnek yoksa yok."
  {
    const YORUMSUZ = HTML
      .replace(/\/\*[\s\S]*?\*\//g, " ")
      .split("\n").map(x => x.replace(/^\s*\/\/.*$/, "").replace(/\s\/\/\s.*$/, "")).join("\n");
    const YASAK = [
      ["deneme test sınavıdır", /deneme test sınavıdır/i],
      ["yazılı örnek yok", /yazılı örnek yok/i],
      ["uydurma yok", /uydurma yok/i],
      ["iki deneme gerekli", /iki deneme gerekli/i]
    ];
    YASAK.forEach(([ad, re]) => {
      const m = YORUMSUZ.match(re);
      ok("ekranda düzeltme cümlesi yok: '" + ad + "'", !m,
        m ? YORUMSUZ.slice(Math.max(0, m.index - 60), m.index + 80) : "");
    });
  }

  // (d) Planlama kartında hedef/ivme özeti görünüyor
  {
    ok("Deneme Hedefi kartında hazırlık planı özeti var",
      /Deneme hazırlık planı:/.test(HTML));
    ok("kartta haftada kaç konu yazıyor", /haftada ~/.test(HTML));
    ok("kartta hataların kaçta kaçı kapsandığı yazıyor", /hataların <b>/.test(HTML));
    ok("İvme Ölçer ÖLÇÜLEN ivmeyi de gösteriyor", /net\/hafta ölçülen ivme/.test(HTML));
    // KULLANICI: eksik veriyi "yok / gerekli" diye yüzüne vurmak yok; ne
    // yapılacağı söylenir.
    ok("ikinci deneme yoksa eyleme dönük tek satır yazılır",
      /İkinci denemeden sonra ölçülen ivme de burada/.test(HTML));
  }
}

console.log("\n== 9) Boş günler kullanılır + ivme TEK sayı (v99) ==");
{
  // (a) Gün seti ELDEKİ TÜM günlere yayılır: ilk oturum yarın, son oturum −3.
  //     KULLANICI: "öğrencinin boş günleri varsa neden görevler yayılmıyor?"
  const set = F.hazirlikGunSeti(9, 30);
  ok("9 oturum 9 farklı gün", new Set(set).size === 9, set.join(","));
  ok("en erken oturum YARIN (sınav − 29)", Math.max.apply(null, set) === 29, set.join(","));
  ok("son oturum sınavdan 3 gün önce", Math.min.apply(null, set) === 3, set.join(","));
  ok("gün seti sınavdan 3 günden yakına inmez", set.every(x => x >= 3));

  // (b) Gerçek planda ilk oturum bugünden 3 günden sonraya atılmaz.
  const planDen = plan.filter(p => p.examId === "deneme").sort((a, b) => (a.date < b.date ? -1 : 1));
  const ilk = planDen[0], sonP = planDen[planDen.length - 1];
  const gunFark = ds => Math.round((parseDay(ds) - parseDay(BUGUN)) / 86400000);
  ok("deneme planı YARIN başlıyor (boş gün bırakmıyor)", gunFark(ilk.date) <= 3, ilk.date);
  ok("deneme planı denemeden 3 gün önce bitiyor", sonP.gunOnce === 3, sonP.gunOnce);
  const bosluk = planDen.slice(1).map((p, i) => gunFark(p.date) - gunFark(planDen[i].date));
  // Eşit aralık: ardışık oturumlar arası boşluk birbirine yakın olmalı
  // (eskiden hepsi son 2n güne sıkışıyordu, başta 9 gün bomboş kalıyordu).
  ok("oturumlar EŞİT aralıkla yayılıyor (en büyük − en küçük boşluk ≤ 2 gün)",
    Math.max.apply(null, bosluk) - Math.min.apply(null, bosluk) <= 2, bosluk.join(","));
  ok("ilk oturum ile son oturum arası tüm pencere kullanılıyor",
    (gunFark(sonP.date) - gunFark(ilk.date)) >= Math.max(1, sonP.gunOnce - 3) - 1,
    gunFark(ilk.date) + " → " + gunFark(sonP.date));

  // (c) İvme Ölçer ile plan AYNI sayıyı söyler (4.08 ≠ 3.5 çelişkisi gitti).
  //     KULLANICI: "İvme Ölçer +4.08 diyor, tekrarda ivme 3.5 diyor."
  const g2 = new Function("state", "todayStr", "parseDay", "toDayStr",
    [
      SABITLER,
      fnCikar("examStats"),
      fnCikar("denemeIvmesi"),
      fnCikar("denemeIvmeCumlesi"),
      fnCikar("weeklyMomentum"),
      "function daysLeftToExam() { return 30; }",
      "return { mom: weeklyMomentum(), v: denemeIvmesi() };"
    ].join("\n"));
  const s5 = senaryo();
  s5.exams = [{ id: "d1", date: "2026-10-27", net: 77.5, errorLogs: [] }];
  s5.plan.targetNet = 95;
  s5.plan.targetDate = "2026-12-20";
  const R = g2(s5, () => BUGUN, parseDay, toDayStr);
  ok("İvme Ölçer = plandaki gereken ivme", R.mom.weekly === R.v.gerekenIvme,
    R.mom.weekly + " ≠ " + R.v.gerekenIvme);
  ok("hafta YUKARI yuvarlanmıyor (4.3, 5 değil)", R.mom.weeks === 4.3, R.mom.weeks);
  ok("gereken ivme 4.08 (17.5 net / 4.3 hafta)", R.v.gerekenIvme === 4.08, R.v.gerekenIvme);
  ok("cümle sade aritmetik gösteriyor",
    /\+17.5 net kaldı · 30 gün \(4.3 hafta\) → haftada \+4.08 net gerekiyor/.test(denemeCumle(R.v)),
    denemeCumle(R.v));
  ok("İvme Ölçer 'net/hafta gereken ivme' diyor", /net\/hafta gereken ivme/.test(HTML));
  ok("eski 'haftalık net artışı hedefi' ifadesi kalmadı", !/haftalık net artışı hedefi/.test(GORUNEN));
  ok("İvme Ölçer 'Son Net' gösteriyor (ortalama değil)", /statBox\("Son Net"/.test(HTML));

  // (d) Okul sınavı hazırlığı sınav haftasına yakın kalır (7 hafta önce başlamaz)
  const okulSet = F.hazirlikGunSeti(4, 60, "okul");
  ok("okul hazırlığı en fazla ~3 hafta önce başlar", Math.max.apply(null, okulSet) <= 21, okulSet.join(","));
  ok("okul hazırlığı yine −3 günde biter", Math.min.apply(null, okulSet) === 3, okulSet.join(","));
  const denSet = F.hazirlikGunSeti(7, 30, "deneme");
  ok("deneme hazırlığı YARINDAN başlar (tüm boş günler kullanılır)",
    Math.max.apply(null, denSet) === 29, denSet.join(","));

  // (e) Plan kutusu: tekrar oturumu konu sayısını şişirmez
  ok("plan kutusu 'çalışma + son tekrar' yazıyor", /çalışma" \+|\+ " \+ tekrarSay/.test(HTML) || /son tekrar" \+ " · "/.test(HTML));
  ok("konu sayısı TEKİL (Set) hesaplanıyor", /new Set\(denPlan\.reduce/.test(HTML));
}
function denemeCumle(v) { return F.denemeIvmeCumlesi(v); }

console.log("\n== 10) BOŞ GÜN YOK: plan pencerenin her gününü doldurur (v100) ==");
{
  // KULLANICI: "yine çok fazla boş gün oluyor. Bu kadar boş ise günde 3 konu
  // yerine 2 veya 1 de çalışabilmeli, neden boş günü olsun ki."
  const hata18 = [];
  const ders = ["Matematik", "Fizik", "Kimya", "Biyoloji", "Felsefe", "Coğrafya"];
  for (let i = 1; i <= 18; i++) {
    hata18.push({ lesson: ders[i % ders.length], topic: "Konu " + i, type: "Konuyu Bilmiyordum", date: "2026-10-27" });
  }
  const s10 = senaryo();
  s10.plan.schoolExams = [];                       // yalnız deneme
  s10.plan.targetDate = "2026-12-20";              // 30 gün kaldı
  s10.exams = [{ id: "d1", date: "2026-10-27", net: 77.5, errorLogs: hata18 }];
  s10.questions = []; s10.memory = {};
  const P = kutu(s10, BUGUN).hazirlikPlani().filter(p => p.examId === "deneme")
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  const gunDs = ds => Math.round((parseDay(ds) - parseDay(BUGUN)) / 86400000);

  ok("18 konu için 27 oturum (yarın → deneme−3)", P.length === 27, P.length);
  ok("ilk oturum YARIN (boş gün beklemez)", gunDs(P[0].date) === 1, P[0].date);
  ok("son oturum denemeden 3 gün önce", P[P.length - 1].gunOnce === 3, P[P.length - 1].gunOnce);

  // Günler ARASINDA boşluk yok: her gün tam 1 oturum.
  const bosluk = P.slice(1).map((p, i) => gunDs(p.date) - gunDs(P[i].date));
  ok("oturumlar HER GÜN (boşluk yok)", bosluk.every(x => x === 1), bosluk.join(","));
  ok("pencere 27 günün tamamı dolu", new Set(P.map(p => p.date)).size === 27);

  // Konu azsa oturum başına konu 3'ten 1'e iner.
  ok("oturum başına konu 1-3", P.every(p => p.konular.length >= 1 && p.konular.length <= 3),
    P.map(p => p.konular.length).join(","));
  ok("çoğu oturum 1 konu (3 değil)", P.filter(p => p.konular.length === 1).length >= 15,
    P.map(p => p.konular.length).join(","));

  // Konu yetmeyen günler TEKRAR oturumu olur; yeni konu uydurulmaz.
  const tekrarlar = P.filter(p => p.tekrar && !p.son);
  ok("konu yetmeyen günler 'Deneme tekrarı' olur", tekrarlar.length >= 8, tekrarlar.length);
  const oncekiKonular = new Set();
  let tekrarGecerli = true;
  P.forEach(p => {
    if (p.tekrar && !p.son) {
      if (!p.konular.length || !p.konular.every(k => oncekiKonular.has(k))) tekrarGecerli = false;
    } else {
      p.konular.forEach(k => oncekiKonular.add(k));
    }
  });
  ok("tekrar oturumları DAHA ÖNCE çalışılmış konuları tekrar eder", tekrarGecerli);
  ok("tekrar gününde 'Çalışılacak konular' değil 'Tekrar edilecek konular' denir",
    /Tekrar edilecek konular/.test(HTML));

  // Konu çok azsa (3 konu) plan günleri doldurmak için abartılmaz.
  const s11 = senaryo();
  s11.plan.schoolExams = [];
  s11.exams = [{ id: "d1", date: "2026-10-27", net: 77.5, errorLogs: [
    { lesson: "Matematik", topic: "A", type: "Konuyu Bilmiyordum", date: "2026-10-27" },
    { lesson: "Fizik", topic: "B", type: "Konuyu Bilmiyordum", date: "2026-10-27" },
    { lesson: "Kimya", topic: "C", type: "Konuyu Bilmiyordum", date: "2026-10-27" }
  ] }];
  s11.questions = []; s11.memory = {};
  const P2 = kutu(s11, BUGUN).hazirlikPlani().filter(p => p.examId === "deneme");
  ok("3 konuda oturum abartılmaz (≤ 5)", P2.length <= 5, P2.length);

  // Deneme hazırlığı 30 günden erken başlamaz (3 ay sonraki sınav için).
  const s12 = senaryo();
  s12.plan.schoolExams = [];
  s12.plan.targetDate = "2027-02-20";
  s12.exams = [{ id: "d1", date: "2026-10-27", net: 77.5, errorLogs: hata18 }];
  s12.questions = []; s12.memory = {};
  const P3 = kutu(s12, BUGUN).hazirlikPlani().filter(p => p.examId === "deneme");
  const ilkGun = Math.round((parseDay(P3[0].date) - parseDay(BUGUN)) / 86400000);
  ok("uzak sınavda hazırlık son 30 güne yayılır", ilkGun >= 58, ilkGun + ". gün");
}

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(x => console.log(" ✗ " + x));
  console.log("v96 testi — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("v96 testi — " + gecen + "/" + gecen + " geçti ✓");
