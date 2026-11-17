/* ============================================================
   v73 — "METİN" KURALI: METİNDEN SÖZ EDEN CÜMLE → PARAGRAF
   ------------------------------------------------------------
   KULLANICI (27 Kasım 2026):
     "30 yeni konu ne? Ve eğer genellikle metinden bahsediyorsa
      paragrafa bağlanır."

   Okulizyon'da konuya bağlanamayan üç TDE cümlesi kalıyordu; üçü de
   doğrudan METNİ konu ediyor ve hiçbirinde tür/dönem/terim adı yok:
     · "Metni millî, manevi ve evrensel değerlerin aktarımı bağlamında
        değerlendirir."
     · "Metnin yapı unsurlarının metne olan katkısını değerlendirir."
     · "Yazarın metni yazma amacını belirler."

   Bu test ŞUNLARI kanıtlar:
     1) 2. aşamaya "metin" kuralı eklendi ve hedefi Paragraf
     2) Türkçe çekimler tanınıyor: metin · metni · metnin · metne · metinler
     3) Kural EN SONDA: tür adı geçen cümleyi ELE GEÇİRMEZ (sözlük kazanır)
     4) "metre" gibi alakasız kelime eşleşmez (uydurma yok)
     5) Veri dosyası JSON'dan birebir üretilmiş (elle düzenleme yok)
     6) Uçtan uca: gerçek Okulizyon cümleleri artık 37/37 dolu

   Çalıştır: node tests/dom/dom-v73-metin-paragraf.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const KOK = path.join(__dirname, "..", "..");
const oku = (p) => fs.readFileSync(path.join(KOK, p), "utf8");
const R = (p) => JSON.parse(oku(p));

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); return true; }
  kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); console.log("  ✗ " + ad + (ek ? " → " + ek : "")); return false;
}

const OKZTDE = require(path.join(KOK, "site/okz-tde.js"));
const VERI = require(path.join(KOK, "site/okz-tde-veri.js"));
const TDED = R("site/content/mufredat/tde_kazanim_10.json");
const TDE = "Türk Dili ve Edebiyatı";

/* ------------------------------------------------------------ */
console.log("\n== 1) Kural tanımlı ve hedefi Paragraf ==");
const KURAL = (VERI.genel.kurallar || []).find(r => r.ad === "metin");
ok("veri dosyasında 'metin' kuralı var", !!KURAL);
ok("hedefi Paragraf", KURAL && KURAL.hedef === "Paragraf", KURAL && KURAL.hedef);
ok("gerekçesi yazılı", !!(KURAL && KURAL.gerekce && KURAL.gerekce.length > 20));
ok("çalışma zamanı deseni var (site/okz-tde.js)",
  /"metin"\s*:\s*\/\(\^\| \)met\[in\]\[a-z\]\*\//.test(oku("site/okz-tde.js")));
ok("kural EN SONDA (tür adı geçen cümleyi ele geçirmez)",
  (VERI.genel.kurallar || []).slice(-1)[0].ad === "metin");

/* ------------------------------------------------------------ */
console.log("\n== 2) Türkçe çekimler tanınıyor ==");
const CEKIM = [
  ["Metni millî, manevi ve evrensel değerlerin aktarımı bağlamında değerlendirir.", "metni"],
  ["Metnin yapı unsurlarının metne olan katkısını değerlendirir.", "metnin/metne"],
  ["Yazarın metni yazma amacını belirler.", "metni"],
  ["Metinlerin ortak özelliklerini karşılaştırır.", "metinler"],
  ["Okuduğu metinde geçen deyimleri belirler.", "metinde"]
];
CEKIM.forEach(([cumle, etiket]) => {
  const r = OKZTDE.genelEsle(cumle);
  ok("'" + etiket + "' → Paragraf", !!(r && r.konu === "Paragraf"), r ? r.konu : "boş");
});

/* ------------------------------------------------------------ */
console.log("\n== 3) Uydurma yok: alakasız kelimeler eşleşmez ==");
[
  ["Metre cinsinden uzunluğu hesaplar.", "metre"],
  ["Metal yüzeylerin iletkenliğini ölçer.", "metal"],
  ["Metodolojik yaklaşımı açıklar.", "metodolojik"]
].forEach(([cumle, etiket]) => {
  ok("'" + etiket + "' → boş", OKZTDE.genelEsle(cumle) === null,
    JSON.stringify(OKZTDE.genelEsle(cumle)));
});

/* ------------------------------------------------------------ */
console.log("\n== 4) Tür adı geçen cümleyi sözlük kazanır ==");
const GAZEL = "Metindeki gazelin matla beytini bulur.";
const soz = OKZTDE.sozlukEsle(GAZEL);
ok("1. aşama (sözlük) Gazel diyor", !!(soz && soz.konu === "Gazel"), soz ? soz.konu : "boş");
ok("esle() sırayı korur (sözlük > genel)", (OKZTDE.esle(GAZEL) || {}).konu === "Gazel",
  (OKZTDE.esle(GAZEL) || {}).konu);
ok("3 boş cümle artık genel aşamada çözülüyor",
  ["Metni millî, manevi ve evrensel değerlerin aktarımı bağlamında değerlendirir.",
   "Metnin yapı unsurlarının metne olan katkısını değerlendirir.",
   "Yazarın metni yazma amacını belirler."].every(c => (OKZTDE.esle(c) || {}).konu === "Paragraf"));

/* ------------------------------------------------------------ */
console.log("\n== 5) Veri dosyası üreticiden birebir ==");
const { modulUret } = require(path.join(KOK, "scripts/tde-icerik-uret.js"));
ok("okz-tde-veri.js = modulUret(tde_kazanim_10.json)",
  modulUret(TDED) === oku("site/okz-tde-veri.js"), "elle düzenlenmiş olabilir");
ok("üretici kaynağında da kural var (scripts/tde-kazanim-uret.js)",
  /ad:\s*"metin"/.test(oku("scripts/tde-kazanim-uret.js")));

/* ------------------------------------------------------------ */
console.log("\n== 6) Uçtan uca: gerçek Okulizyon cümleleri ==");
let olcum = "";
try {
  olcum = execFileSync(process.execPath, [path.join(KOK, "scripts/okz-esleme-olcum.js"), "--json", "--sessiz"], {
    cwd: KOK, encoding: "utf8"
  });
} catch (e) { olcum = (e && e.stdout) || ""; }
let satirlar = [];
try { satirlar = JSON.parse(olcum); } catch (err) { satirlar = []; }
const dolu = satirlar.filter(s => s.konu);
ok("ölçüm koştu", satirlar.length > 0, "kayıt: " + satirlar.length);
ok("boş kalan cümle YOK", satirlar.length > 0 && dolu.length === satirlar.length,
  dolu.length + "/" + satirlar.length);
ok("3 METİN cümlesi Paragraf'a bağlandı",
  satirlar.filter(s => /^Metn|^Yazarın metni/.test(s.kazanim)).every(s => s.konu === "Paragraf"));

/* ------------------------------------------------------------ */
console.log("\n" + (kalan ? "v73 metin-paragraf — " + gecen + " geçti, " + kalan + " kaldı ✗" : "v73 metin-paragraf — " + gecen + "/" + gecen + " geçti ✓"));
if (kalan) { hatalar.forEach(h => console.log("   · " + h)); process.exitCode = 1; }
