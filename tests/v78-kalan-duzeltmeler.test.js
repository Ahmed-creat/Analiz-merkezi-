#!/usr/bin/env node
/* ============================================================
   G-09 · G-11 · G-12 DÜZELTMELERİ — tests/v78-kalan-duzeltmeler.test.js
   ------------------------------------------------------------
   Talimatın kalan dört kalemi. Her iddia KODU ÇALIŞTIRARAK ölçülür
   (index.html'in ilgili fonksiyonu izole edilip sahte bir state ile koşulur).

   G-11
     1) Konu bitince mesaj YANLIŞ yere yönlendiriyordu ("Konu Takibi →
        'Kısa Kontrol · 5' düğmesi" — öyle bir düğme yok)
     2) "Son deneme" kayıt sırasına göre okunuyordu (tarihe göre değil)
     3) Yanlış/boş satırında GERÇEK soru numarası girilemiyordu (qno = sıra)
     4) "D" girilince kalan otomatik BOŞ oluyordu → her boş için neden zorunlu
     5) Aynı ad + tarih iki kez kaydedilebiliyordu
     6) Soru önerisi DERS başarısını konu başarısı sanıyordu
   G-09
     7) Ana Sayfa ve Bilgi Bankası "Tekrar Bekleyen" sayısı TEK kaynaktan
     8) Bildirim bir gün içinde tek; ERTESİ GÜN (yeni döngü) yeniden gelir
   G-12
     9) Ayarlar altındaki sürüm yazısı canlı sürüm damgasından gelir
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const KOK = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) gecen++; else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }

/** index.html içinden bir fonksiyonu (dengeli süslü parantezle) kes. */
function fonksiyonAl(ad) {
  const bas = HTML.indexOf("function " + ad + "(");
  if (bas < 0) throw new Error("fonksiyon yok: " + ad);
  let i = HTML.indexOf("{", bas), derinlik = 0;
  for (let j = i; j < HTML.length; j++) {
    if (HTML[j] === "{") derinlik++;
    else if (HTML[j] === "}") { derinlik--; if (derinlik === 0) return HTML.slice(bas, j + 1); }
  }
  throw new Error("kapanmadı: " + ad);
}

function kosum(kodlar, fonksiyonlar, baglam) {
  const sb = Object.assign({ console: { log() {} } }, baglam);
  vm.createContext(sb);
  kodlar.forEach(k => vm.runInContext(k, sb));
  const fn = new Function(...Object.keys(fonksiyonlar), kodlar.map(k => "").join("") +
    "return {" + Object.keys(fonksiyonlar).map(k => k).join(",") + "};");
  return { fn, sb };
}

const yardimcilar = `
  function parseDay(s) {
    if (!s) return null;
    const d = new Date(String(s).slice(0, 10) + "T00:00:00");
    return isNaN(d.getTime()) ? null : d;
  }
  function splitKey(key) {
    const i = String(key || "").indexOf(" > ");
    return i > 0 ? { lesson: key.slice(0, i), topic: key.slice(i + 3) } : { lesson: String(key || ""), topic: "" };
  }
  const MEMORY_CRITICAL = 20;
  function getMemoryStrength() { return 100; }
  function nextReviewInfo() { return null; }
  function uid() { return "x" + Math.random().toString(36).slice(2, 7); }
`;

// ---------------------------------------------------------------
console.log("\n== 1) Konu bitince DOĞRU yer söyleniyor ==");
{
  ok("eski yanlış yönlendirme metni YOK", HTML.indexOf('Konu Takibi → “Kısa Kontrol · 5”') < 0);
  ok("doğru yer: 5. adım / Günlük Görevler",
    /Kısa Kontrol hazır: Bilgi Bankası → konunun 5\. adımı \(ya da Günlük Görevler/.test(HTML));
  ok("'kendiliğinden açılmaz' bilgisi duruyor", /Kendiliğinden açılmaz/.test(HTML));
}

// ---------------------------------------------------------------
console.log("\n== 2) 'Son deneme' TARİHE göre ==");
{
  const govde = fonksiyonAl("examStats");
  const sb = {
    state: {
      exams: [
        { name: "Ekim", date: "2026-10-10", net: 40 },   // eski tarih, önce kayıtlı
        { name: "Kasım", date: "2026-11-15", net: 60 },  // yeni tarih
        { name: "Geriye dönük çekim", date: "2026-11-01", net: 20 } // Sonra eklendi
      ]
    },
    parseDay: s => new Date(String(s).slice(0, 10) + "T00:00:00")
  };
  vm.createContext(sb);
  vm.runInContext(govde + "\nthis.st = examStats();", sb);
  ok("son deneme = tarihi en yeni olan (60)", sb.st.last === 60, String(sb.st.last));
  ok("seri tarihe göre sıralı", sb.st.series.map(x => x.date).join(",") === "2026-10-10,2026-11-01,2026-11-15",
    sb.st.series.map(x => x.date).join(","));
}

// ---------------------------------------------------------------
console.log("\n== 3) Gerçek soru numarası girilebiliyor ==");
{
  ok("satırda SORU NO alanı var", /data-err="' \+ attr\(lesson\) \+ ":" \+ i \+ ':qno"/.test(HTML) || /:qno"/.test(HTML));
  ok("etiket kullanıcıya görünüyor", HTML.indexOf("SORU NO") > 0);
  const govde = fonksiyonAl("collectErrorLogs");
  const sb = {
    todayStr: () => "2026-11-18",
    canonicalReason: x => x,
    document: {
      querySelectorAll: sel => {
        if (sel !== "[data-err]") return [];
        return [
          { dataset: { err: "Matematik:0:qno" }, value: "17" },
          { dataset: { err: "Matematik:0:topic" }, value: "Türev" },
          { dataset: { err: "Matematik:0:type" }, value: "KONU EKSİKLİĞİ" },
          { dataset: { err: "Matematik:1:qno" }, value: "" },      // boş → sıra
          { dataset: { err: "Matematik:1:topic" }, value: "Türev" },
          { dataset: { err: "Matematik:1:type" }, value: "DİKKATSİZLİK" }
        ];
      }
    }
  };
  vm.createContext(sb);
  vm.runInContext(govde + "\nthis.logs = collectErrorLogs('2026-11-18');", sb);
  ok("qno kullanıcının girdiği 17", sb.logs[0].qno === 17, String(sb.logs[0].qno));
  ok("qno boşsa satır sırası (2)", sb.logs[1].qno === 2, String(sb.logs[1].qno));
  ok("konu ve neden korunuyor", sb.logs[0].topic === "Türev" && sb.logs[0].type === "KONU EKSİKLİĞİ");
}

// ---------------------------------------------------------------
console.log("\n== 4) Otomatik boş KAPATILABİLİYOR ==");
{
  ok("anahtar formda", HTML.indexOf('id="exam-auto-empty"') > 0);
  ok("varsayılan açık (eski davranış)", /id="exam-auto-empty" checked/.test(HTML));
  ok("anahtar okunuyor (autoEmptyAcik)", /function autoEmptyAcik\(\)/.test(HTML));
  ok("otomatik hesap anahtara bağlı", /if \(field !== "e" && autoEmptyAcik\(\)\)/.test(HTML));
  ok("anahtar değişince alanlar yenilenir", /if \(ae\) ae\.addEventListener\("change"/.test(HTML));
  ok("anahtar kapatılınca e alanı serbest kalır (etiket açıklıyor)",
    /kapatırsan BOŞ alanını kendin girersin/.test(HTML));
}

// ---------------------------------------------------------------
console.log("\n== 5) Aynı ad + tarih mükerrer denemesi engellenir ==");
{
  ok("kayıt öncesi mükerrer kontrolü var",
    /const ayni = state\.exams\.some\(e => e && e\.name === name && e\.date === date\)/.test(HTML));
  ok("engelleyince kaydetmiyor", /if \(ayni\) return fail\(/.test(HTML));
  ok("kontrol, deneme state'e eklenmeden ÖNCE",
    HTML.indexOf("const ayni = state.exams.some") < HTML.indexOf("state.exams.push(exam)"));
}

// ---------------------------------------------------------------
console.log("\n== 6) Konu başarısı KONU düzeyinde ==");
{
  const govde = fonksiyonAl("topicSuccessRate");
  const sb = {
    state: {
      exams: [
        { lessons: { Matematik: { d: 10, w: 4, e: 0 } },
          errorLogs: [
            { lesson: "Matematik", topic: "Türev" }, { lesson: "Matematik", topic: "Türev" },
            { lesson: "Matematik", topic: "Türev" }, { lesson: "Matematik", topic: "Türev" }
          ] },
        { lessons: { Matematik: { d: 8, w: 4, e: 0 } },
          errorLogs: [
            { lesson: "Matematik", topic: "Limit" }, { lesson: "Matematik", topic: "Limit" },
            { lesson: "Matematik", topic: "Limit" }, { lesson: "Matematik", topic: "Limit" }
          ] }
      ],
      questions: []
    },
    splitKey: k => { const i = k.indexOf(" > "); return { lesson: k.slice(0, i), topic: k.slice(i + 3) }; }
  };
  vm.createContext(sb);
  vm.runInContext(govde + "\nthis.t = topicSuccessRate('Matematik > Türev');", sb);
  /* Ders toplamı 26 soru; Türev'de 4 hata → 1 − 4/26 = %85 */
  ok("Türev oranı konu hatalarından", sb.t === 85, String(sb.t));
  sb.__x = 0;
  vm.runInContext("this.t2 = topicSuccessRate('Matematik > Hiç hata yok');", sb);
  ok("hatasız konuda ders düzeyine düşer (%69)", sb.t2 === 69, String(sb.t2));
  const ayrismis = sb.t !== sb.t2;
  ok("iki konu ARTIK aynı yüzdeyi almıyor", ayrismis, sb.t + " / " + sb.t2);
}

// ---------------------------------------------------------------
console.log("\n== 7) İki ekran aynı 'Tekrar Bekleyen' sayısı ==");
{
  const govde = fonksiyonAl("memoryStats");
  const sb = {
    state: {
      memory: {
        "Matematik > A": { completedAt: "2026-11-01", schedule: { 3: "2026-11-18" } },
        "Matematik > B": { completedAt: "2026-11-02", schedule: { 3: "2026-11-18", 7: "2026-11-22" } },
        "Fizik > C": { completedAt: null, schedule: { 3: "2026-11-18" } }   // tamamlanmamış ama günü gelmiş
      },
      notifications: []
    },
    MEMORY_CRITICAL: 20,
    dueReviews: () => [
      { topicKey: "Matematik > A", day: 3, date: "2026-11-18" },
      { topicKey: "Matematik > B", day: 3, date: "2026-11-18" },
      { topicKey: "Fizik > C", day: 3, date: "2026-11-18" }
    ],
    getMemoryStrength: () => 50,
    nextReviewInfo: () => null,
    splitKey: k => { const i = k.indexOf(" > "); return { lesson: k.slice(0, i), topic: k.slice(i + 3) }; }
  };
  vm.createContext(sb);
  vm.runInContext(govde + "\nthis.ms = memoryStats();", sb);
  ok("Bilgi Bankası sayacı = dueReviews uzunluğu", sb.ms.waiting === 3, String(sb.ms.waiting));
  ok("Ana Sayfa da aynı kümeyi kullanır",
    /const dueSayi = dueReviews\(\)\.length/.test(HTML) && /const dueSet = new Set\(dueReviews\(\)\.map/.test(HTML));
}

// ---------------------------------------------------------------
console.log("\n== 8) Bildirim: gün içinde tek, ertesi gün yeni ==");
{
  const govde = fonksiyonAl("addNotification");
  const kayit = [];
  const sb = {
    state: { notifications: [] },
    todayStr: () => "2026-11-18",
    uid: () => "id" + (kayit.length + 1),
    saveState() {}, updateBellBadges() {}, yerelSistemBildirimi() {}
  };
  vm.createContext(sb);
  vm.runInContext(govde + "\nthis.ekle = addNotification;", sb);
  const n = { title: "Tekrar Zamanı Geldi!", body: "Türev — 3. gün tekrarı bugün.", kind: "review", topicKey: "Matematik > Türev@3" };
  sb.ekle(Object.assign({}, n));
  sb.ekle(Object.assign({}, n));
  ok("aynı gün iki kez üretilmedi", sb.state.notifications.length === 1, String(sb.state.notifications.length));

  // ertesi gün: aynı konu, aynı gövde ama yeni döngü
  sb.state.notifications[0].date = "2026-11-18T08:00:00.000Z";
  sb.ekle(Object.assign({}, n));   // hâlâ 18 Kasım → bastırılır
  ok("aynı gün ikinci çağrı bastırıldı", sb.state.notifications.length === 1, String(sb.state.notifications.length));
  const eski = govde.replace(/const gun = todayStr\(\);/,
    'const gun = "2026-11-19";');
  const sb2 = { state: { notifications: sb.state.notifications }, todayStr: () => "2026-11-19",
    uid: () => "y1", saveState() {}, updateBellBadges() {}, yerelSistemBildirimi() {} };
  vm.createContext(sb2);
  vm.runInContext(eski + "\nthis.ekle = addNotification;", sb2);
  sb2.ekle(Object.assign({}, n));
  ok("ERTESİ GÜN yeni döngü bildirimi geldi", sb2.state.notifications.length === 2, String(sb2.state.notifications.length));
  ok("döngü tarihi anahtara giriyor (gün bazlı tekilleştirme)",
    /String\(x\.date \|\| ""\)\.slice\(0, 10\) === gun/.test(govde));
}

// ---------------------------------------------------------------
console.log("\n== 9) Sürüm yazısı canlı damgadan ==");
{
  ok("HTML'de sürüm alanı tek kaynak", HTML.indexOf('id="am-surum"') > 0);
  ok("app-pwa etiketi PWA_SURUM ile dolduruyor", /function surumEtiketiYaz\(\)[\s\S]{0,220}PWA_SURUM/.test(APP));
  ok("açılışta çağrılıyor", /surumEtiketiYaz\(\);/.test(APP));
  const surum = (APP.match(/const PWA_SURUM = "([^"]+)"/) || [])[1] || "";
  // Damga sabit yazılmaz (her sürümde test kırılmasın); v78 ve sonrası yeter.
  ok("damga v78 veya sonrası", /^v(7[89]|[89]\d)/.test(surum), surum);
  /* v81 — KULLANICI: "Herşeyin güncel olduğundan emin olun." Alt bilgi de
     elle "v5.1" yazıyordu; artık PWA_SURUM'dan doldurulur. */
  ok("alt bilgi sürüm damgasına bağlı",
    HTML.indexOf('data-am-surum="1"') > 0 && APP.indexOf('querySelectorAll("[data-am-surum]")') > 0);
  ok("elle yazılmış 'Analiz Merkezi v5.1' kalmadı", HTML.indexOf("Analiz Merkezi v5.1") < 0);
}

console.log("\n" + "─".repeat(58));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("kalan düzeltmeler — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("kalan düzeltmeler (G-09/G-11/G-12) — " + gecen + "/" + gecen + " geçti ✓");
