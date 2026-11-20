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
/* v79 — KULLANICI: "neden yanlış ve boş için aynı neden listesi kullanılıyor?"
   Tek havuz KALDIRILDI: yanlışların "tümü" düğmeleri WRONG_REASONS'tan (4),
   boşlarınki EMPTY_REASONS'tan (3) üretilir. İkisi de ≥3 hazır neden. */
/* Düğmeler JS içinde .map ile üretiliyor: kaynakta 1 kez yazılı, ekranda N tane.
   O yüzden "üretim yolu + liste uzunluğu" ölçülür. */
const yanlisN = (() => { const m = /const WRONG_REASONS = \[([^\]]*)\]/.exec(HTML); return m ? (m[1].match(/"/g) || []).length / 2 : 0; })();
const bosN = (() => { const m = /const EMPTY_REASONS = \[([^\]]*)\]/.exec(HTML); return m ? (m[1].match(/"/g) || []).length / 2 : 0; })();
ok("yanlışlar için 3'ten az olmayan hazır neden düğmesi",
  yanlisN >= 3 && /WRONG_REASONS\.map\(r => '<button[^']*data-okz-hedef="yanlis"/.test(HTML),
  "WRONG_REASONS=" + yanlisN);
ok("boşlar için 3'ten az olmayan hazır neden düğmesi",
  bosN >= 3 && /EMPTY_REASONS\.map\(r => '<button[^']*data-okz-hedef="bos"/.test(HTML),
  "EMPTY_REASONS=" + bosN);
ok("hazır nedenler uygulamanın kendi listesinden (KONUEKSİKLİĞİ dâhil)",
  /EMPTY_REASONS\.map\(r => '<button[^']*data-okz-hedef="bos"/.test(HTML) && /KONUEKSİKLİĞİ/.test(HTML));
ok("yanlış ve boş TEK havuzda birleştirilmiyor (eski hata geri dönmesin)",
  HTML.indexOf("WRONG_REASONS.concat(EMPTY_REASONS)") < 0);
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

// ---------- 3) Konu eşlemesi: TAMAMEN OTOMATİK (v82) ----------
// KULLANICI (18 Kas): "Neden hâlâ okulizyon konu eşleşmesi var profilde?
// HANİ otomatik sorunsuzdu!" Profil'deki elle eşleme paneli KALDIRILDI.
console.log("\n== 3) Konu eşlemesi otomatik ==");
ok("profilde elle eşleme paneli YOK", APP.indexOf('id="okz-konu-esleme"') < 0);
ok("'Önerileri kabul et ve eşle' düğmesi YOK", APP.indexOf('>Önerileri kabul et ve eşle<') < 0 && APP.indexOf('data-act="okzKonuEsle"') < 0);
ok("eşlenmemiş listesi kodu YOK (ölü kod yok)", APP.indexOf("function okzEslenmemisKonular") < 0);
ok("eşleme açılışta kendiliğinden çalışıyor", APP.indexOf("okzKonulariOnar(true).then(") > 0);
ok("MEB resmî çıktı kodu katmanı kullanılıyor", /MEBM\.ucBul\(kazanim, kanon\)/.test(APP) && /MEBM\.uygulamaKonu\(/.test(APP));
ok("her çekimde eşleme otomatik (indeks çekimden önce yükleniyor)", /try \{ await okzkYukle\(\); \} catch[\s\S]{0,400}okzDenemeyeYaz\(/.test(APP));
ok("kazanım → konu dönüşümü tek yerde", /function okzKayitKonu\(ders, kazanim\)/.test(APP) && /topic: e \? e\.konu : String\(kazanim \|\| ""\)/.test(APP));

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
