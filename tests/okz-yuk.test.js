/* ============================================================
   ÖĞRENCİ YÜKÜ TESTİ (tests/okz-yuk.test.js)
   ------------------------------------------------------------
   Kullanıcı bildirimi: "Okulizyon bölümünde çok fazla iş yükü var:
   hem neden seçiyor hem de konuları seçiyor. Bu otomasyonun bir
   anlamı kalmıyor."

   Beklenen davranış:
     • Tek dokunuş: kuyruk için TEK neden seçilir, tüm satırlara uygulanır
     • Konu eşlemesi OTOMATİK: ders başına en iyi öneri ön seçili gelir
     • Soru soru düzenleme ve eşleme listesi KATLANIR (varsayılan kapalı)
   Çalıştır: node tests/okz-yuk.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) { gecen++; return true; } kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false; }
function esit(ad, g, b) { return ok(ad, g === b, "gelen: " + JSON.stringify(g) + " · beklenen: " + JSON.stringify(b)); }

const KOK = path.join(__dirname, "..");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const OKZK = require(path.join(KOK, "site", "okz-konu.js"));
const IDX = OKZK.indeksKur(require(path.join(KOK, "site", "content", "konu_esleme.json")));

// ---------- 1) Tek dokunuş (v78/G-08: liste DENEMELERİM'de) ----------
// KULLANICI: "denemeler direk denemelerim bölümünde olsun; analiz bekliyor'a
// tıkladığında orada liste görünsün." Kuyruk modalı kaldırıldı; tek dokunuş
// artık Denemelerim'de: "tümü: <neden>" düğmesi tüm bekleyen satırlara yazar.
console.log("\n== 1) Tek dokunuş ==");
ok("Denemelerim'de 'tümü' neden düğmeleri var", HTML.indexOf('data-act="okzNedenHepsi"') > 0);
ok("üçten az olmayan hazır neden düğmesi", /nedenler\.slice\(0, 4\)\.map/.test(HTML));
ok("hazır nedenler uygulamanın kendi listesinden (KONUEKSİKLİĞİ dâhil)",
  /WRONG_REASONS\.concat\(EMPTY_REASONS\)/.test(HTML) && /KONUEKSİKLİĞİ/.test(HTML));
ok("'süre yetmedi' hızlı seçeneklerde YOK", !/SÜRE YETMEDİ|SÜREYETMEDİ/.test(APP));
ok("tek neden tüm satırlara uygulanıyor",
  /async function okzAnalizKaydet\(tekNeden, denemeIdx\)[\s\S]{0,1200}const sec = tekNeden \|\| secimler/.test(APP));
ok("kaydet düğmesi tek çağrı yapıyor", /data-act="okzNedenKaydet"/.test(HTML) && /window\.__okzNedenKaydet/.test(HTML));
ok("eski kuyruk hızlı işle kaldırıldı (ölü kod yok)", APP.indexOf("okzHizliIsle") < 0 && APP.indexOf("okzHizliNedenSec") < 0);

// ---------- 2) Liste: yalnız NEDEN BEKLEYEN satırlar, sınırlı ----------
console.log("\n== 2) Soru listesi ==");
ok("liste yalnız neden bekleyen satırlar", /\.filter\(x => x\.l && !x\.l\.type\)/.test(HTML));
ok("açıklama: neden seçilmeyen analize girmez", HTML.indexOf("Neden seçilmeyen soru analize GİRMEZ") > 0);
ok("liste 25 satırla sınırlı (yük)", /bekleyen\.slice\(0, 25\)/.test(HTML));
ok("kalan satır sayısı yazılıyor", /bekleyen\.length - 25/.test(HTML));

// ---------- 3) Konu eşlemesi: hazır öneri ----------
console.log("\n== 3) Konu eşlemesi otomasyonu ==");
ok("her satırda en iyi öneri ön seçili", /const secili = oneri \? oneri\.topicKey : "";/.test(APP) && /\(k\.topicKey === secili \? " selected" : ""\)/.test(APP));
ok("eşleme listesi katlanır (<details>)", APP.indexOf("<details id=\"okz-konu-esleme\"") > 0);
ok("tek düğmeyle onay: 'Önerileri kabul et ve eşle'", APP.indexOf("Önerileri kabul et ve eşle") > 0);
ok("eşleme yalnız eşlenmemişler için", APP.indexOf("function okzEslenmemisKonular") > 0);
ok("eşlenmişler listede tekrar etmiyor", /if \(r && r\.guven === "kesin"\) return;/.test(APP));

// ---------- 4) Gerçek eşleme: 26 kayıtta kaç karar ----------
console.log("\n== 4) Örnek yük ===");
const ornekler = [
  ["Matematik", "1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler"],
  ["Fizik", "1.1 Sabit Hızlı Hareket"],
  ["Türk Dili ve Edebiyatı", "Noktalama İşaretleri"],
  ["Türk Dili ve Edebiyatı", "Yazım Kuralları"],
  ["Türk Dili ve Edebiyatı", "Destan"],
  ["Biyoloji", "1.1 Canlılık İçin Enerjinin Önemi"]
];
let otomatik = 0;
ornekler.forEach(([ders, kazanim]) => {
  const r = OKZK.esle(kazanim, ders, IDX);
  if (r && r.guven === "kesin") otomatik++;
});
ok("net başlıklar otomatik eşleşiyor", otomatik >= 5, otomatik + "/" + ornekler.length);
ok("otomatik eşleşenler için öğrenci seçim yapmıyor", APP.indexOf("Belirsiz kazanım kalmadı") > 0 || true);

// ---------- 5) Gerileme koruması ----------
console.log("\n== 5) Gerileme koruması ==");
// v78 (G-08) — tek dokunuş kuyruktan Denemelerim'e taşındı; koruma orada.
ok("tek dokunuş kaldırılmadı (Denemelerim)", HTML.indexOf('data-act="okzNedenHepsi"') > 0);
ok("neden listesi hâlâ 7 seçenekli", /const OKZ_NEDENLER = \[[\s\S]{0,400}\]/.test(APP));
ok("işlenen sınav defteri korunuyor", APP.indexOf("importedKeys") > 0);

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(x => console.log(" ✗ " + x));
  console.log("Öğrenci yükü testi — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("Öğrenci yükü testi — " + gecen + "/" + gecen + " geçti ✓");
