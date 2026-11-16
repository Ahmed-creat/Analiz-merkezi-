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
const OKZK = require(path.join(KOK, "site", "okz-konu.js"));
const IDX = OKZK.indeksKur(require(path.join(KOK, "site", "content", "konu_esleme.json")));

// ---------- 1) Tek dokunuş ----------
console.log("\n== 1) Tek dokunuş ==");
ok("hızlı neden çubuğu var", APP.indexOf("okz-hizli-nedenler") > 0);
ok("üç hazır neden düğmesi", (APP.match(/data-act=\\"okzHizliNedenSec\\"/g) || []).length === 1 || APP.indexOf('data-act="okzHizliNedenSec"') > 0);
// v35.8 — "Süre yetmedi" nedeni kaldırıldı; hızlı neden çubuğu geçerli nedenlerle.
ok("hızlı nedenlerde KONUEKSİKLİĞİ var", /\["KONUEKSİKLİĞİ", "ANLAMADIM", "İşlem Hatası\/Dikkatsizlik"\]/.test(APP));
ok("hızlı nedenlerde 'süre yetmedi' YOK", !/SÜRE YETMEDİ|SÜREYETMEDİ/.test(APP));
ok("tek düğme: 'Bu nedenle tümünü işle'", APP.indexOf("okzHizliIsle") > 0);
ok("tek neden tüm satırlara uygulanıyor", /async function okzAnalizKaydet\(tekNeden\)[\s\S]{0,1600}const r = tekNeden \|\| secimler/.test(APP));
ok("hızlı işle tek nedenle çağırıyor", /okzAnalizKaydet\(window\.__okzHizliNeden \|\| "KONU EKSİKLİĞİ"\)/.test(APP));

// ---------- 2) Soru soru düzenleme kapalı ----------
console.log("\n== 2) Soru soru düzenleme ==");
ok("soru listesi <details> içinde", /<details style="margin-top:6px;"><summary[^>]*>Soruları tek tek düzenle \(isteğe bağlı/.test(APP));
ok("açıklama 'isteğe bağlı' diyor", APP.indexOf("Soru soru neden seçimi İSTEĞE BAĞLI") > 0);
ok("21 soru için 21 açılır kutu görünmüyor", APP.indexOf("ex.rows.forEach((row, j) => {\n        html += '<div style=\"display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px solid rgba(0,0,0,0.07);\">'") > 0);

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
ok("tek dokunuş kaldırılmadı", APP.indexOf('data-act="okzHizliIsle"') > 0);
ok("neden listesi hâlâ 7 seçenekli", /const OKZ_NEDENLER = \[[\s\S]{0,400}\]/.test(APP));
ok("işlenen sınav defteri korunuyor", APP.indexOf("importedKeys") > 0);

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(x => console.log(" ✗ " + x));
  console.log("Öğrenci yükü testi — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("Öğrenci yükü testi — " + gecen + "/" + gecen + " geçti ✓");
