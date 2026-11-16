#!/usr/bin/env node
/* ============================================================
   HAVUZ MANİFESTİ ÜRETİCİ
   ------------------------------------------------------------
   site/content/soru_havuzlari/*.json dosyalarından
   site/content/soru_havuzlari/index.json üretir.

   Neden gerekli?
     Uygulama havuzu bu manifest üzerinden bulur
     (site/bkt-engine.js → loadPoolManifest → havuzEsle).
     Elle bakımı yapılamaz: 158 havuza çıkınca kayıtlar
     birbirinden kopar.

   Ek olarak üretim planıyla çapraz kontrol yapar:
     - havuzun konu_id'si planda var mı
     - kod plandaki kodla aynı mı
     - hedef soru sayısına ulaşılmış mı
     - süreç bileşenlerinin hepsi alt_beceri olarak var mı

   Kullanım:
     node scripts/havuz-index-uret.js            # yalnız mevcut havuzlar
     node scripts/havuz-index-uret.js --plan     # planla çapraz kontrol
     node scripts/havuz-index-uret.js --kontrol  # yazma, sadece denetle
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const HAVUZ_DIR = path.join(KOK, "site", "content", "soru_havuzlari");
const MANIFEST = path.join(HAVUZ_DIR, "index.json");
const U = require("./uretim-veri.js");

const PLANLA = process.argv.includes("--plan");
const KONTROL = process.argv.includes("--kontrol");

function sade(s) {
  return String(s == null ? "" : s)
    .toLocaleLowerCase("tr")
    .replace(/[’‘`´]/g, "'")
    .replace(/^[a-eç]\s*\)\s*/i, "")
    .replace(/[.,;:!?"()\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* topic_key sözleşmesi (docs/uretim/SORU-URETIM-TALIMATI.md §5):
     "<Ders> > <tema>.<sıra> <resmî kazanım başlığı>"
   Resmî kod + resmî başlıktan türetilir; uydurma ad yok. */
function topicKey(kod, ders, kazanim) {
  const m = /^([A-ZİÇĞÖŞÜ]+)\.10\.(\d+)\.(\d+)$/.exec(String(kod || ""));
  if (m) return ders + " > " + m[2] + "." + m[3] + " " + String(kazanim || "").trim();
  const t = /^([A-ZİÇĞÖŞÜ]+)(\d+)\.(\d+)$/.exec(String(kod || ""));
  if (t) return ders + " > " + t[2] + "." + t[3] + " " + String(kazanim || "").trim();
  return ders + " > " + String(kazanim || "").trim();
}

const plan = PLANLA || KONTROL ? { ciktilar: U.plan } : null;
const planMap = plan ? new Map(plan.ciktilar.map(c => [c.konu_id, c])) : null;

/* Eski şema: <ders>_10_uNN_kNN (2018 ünite yapısı).
   Geçiş döneminde bu havuzlar silinmez; kayıtları KORUNUR.
   Yeni şema: <ders>_10_tNN_cNN (MEB 2026 koduyla birebir). */
const ESKI_SEMA = /_10_u\d+_k\d+$/;

/* Mevcut manifest: plan kaydı olmayan havuzların topic_key/baslik/
   etiketler değerleri buradan AYNEN korunur (veri kaybı olmasın). */
const eskiManifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};
const eskiKayit = new Map(
  (Array.isArray(eskiManifest.havuzlar) ? eskiManifest.havuzlar : []).map(h => [String(h.konu_id), h])
);

const dosyalar = fs.readdirSync(HAVUZ_DIR)
  .filter(f => f.endsWith(".json") && f !== "index.json")
  .sort();

const havuzlar = [];
const hatalar = [];
let soruToplam = 0, flashToplam = 0;

for (const dosya of dosyalar) {
  let pool;
  try {
    pool = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, dosya), "utf8"));
  } catch (e) {
    hatalar.push(dosya + ": geçersiz JSON");
    continue;
  }
  const konuId = String(pool.konu_id || "").trim();
  if (!konuId) { hatalar.push(dosya + ": konu_id yok"); continue; }
  if (dosya !== konuId + ".json") hatalar.push(dosya + ": ad konu_id ile uyuşmuyor");

  const sorular = Array.isArray(pool.sorular) ? pool.sorular : [];
  const flashcards = Array.isArray(pool.flashcards) ? pool.flashcards : [];
  soruToplam += sorular.length;
  flashToplam += flashcards.length;

  const altBeceriler = [...new Set(sorular.map(q => q && q.alt_beceri).filter(Boolean))];
  const p = planMap ? planMap.get(konuId) : null;
  const eski = eskiKayit.get(konuId) || null;

  let durum = "plansiz";
  if (planMap && !p) {
    // Eski şemadaki havuzlar geçiş döneminde MEŞRUDUR — hata değil.
    durum = ESKI_SEMA.test(konuId) ? "eski-sema" : "plansiz";
    if (durum === "plansiz") hatalar.push(dosya + ": konu_id planda yok ve eski şema değil (" + konuId + ")");
  } else if (p) {
    if (pool.kod && String(pool.kod) !== p.kod) hatalar.push(dosya + ": kod " + pool.kod + " ≠ plan " + p.kod);
    if (sorular.length < p.hedef_soru) hatalar.push(dosya + ": " + sorular.length + " soru < hedef " + p.hedef_soru);
    const varOlan = new Set(altBeceriler.map(sade));
    const eksikSurec = p.surec.filter(s => !varOlan.has(sade(s)));
    if (eksikSurec.length) hatalar.push(dosya + ": " + eksikSurec.length + " süreç bileşeni alt_beceri olarak yok");
    durum = sorular.length >= p.hedef_soru && !eksikSurec.length ? "tam" : "eksik";
  }

  havuzlar.push({
    konu_id: konuId,
    ders: pool.ders || (eski && eski.ders) || "",
    sinif: Number(pool.sinif) || 10,
    dosya,
    soru_sayisi: sorular.length,
    flashcard_sayisi: flashcards.length,
    etiketler: altBeceriler.slice(0, 6).length
      ? altBeceriler.slice(0, 6)
      : (eski && eski.etiketler) || [],
    baslik: (p ? p.kazanim : "") || (eski && eski.baslik) || altBeceriler[0] || "",
    topic_key: p
      ? topicKey(p.kod, p.ders, p.kazanim)
      : String((eski && eski.topic_key) || pool.topic_key || ""),
    kod: p ? p.kod : String(pool.kod || (eski && eski.kod) || ""),
    uretim_durumu: durum
  });
}

const eski = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};
const veri = {
  sinif: eski.sinif || 10,
  aciklama:
    "10. sınıf soru havuzu manifesti. scripts/havuz-index-uret.js üretir; elle düzenlenmez. " +
    "Uygulama havuzu bu dosyadan bulur (site/bkt-engine.js).",
  havuz_sayisi: havuzlar.length,
  soru_sayisi: soruToplam,
  flashcard_sayisi: flashToplam,
  kaynak_commit: eski.kaynak_commit || "",
  kaynak_arşiv_sayisi: eski.kaynak_arşiv_sayisi || 0,
  uretim_plani: planMap ? { yol: "docs/uretim/uretim-plani.json", cikti: planMap.size } : null,
  havuzlar
};

console.log("havuz: " + havuzlar.length + " · soru: " + soruToplam + " · flashcard: " + flashToplam);
if (planMap) {
  const kapsanan = new Set(havuzlar.map(h => h.konu_id));
  const eksik = plan.ciktilar.filter(c => !kapsanan.has(c.konu_id));
  console.log("plana göre kapsanan: " + (planMap.size - eksik.length) + "/" + planMap.size +
    " · eksik: " + eksik.length);
}
if (hatalar.length) {
  console.log("\n-- HATALAR (" + hatalar.length + ") --");
  hatalar.slice(0, 40).forEach(h => console.log("  ✗ " + h));
  if (hatalar.length > 40) console.log("  … +" + (hatalar.length - 40));
  if (KONTROL) process.exit(1);
}
if (KONTROL) {
  console.log("\n(kontrol modu: dosya yazılmadı)");
  process.exit(hatalar.length ? 1 : 0);
}
fs.writeFileSync(MANIFEST, JSON.stringify(veri, null, 1) + "\n", "utf8");
console.log("yazıldı: " + path.relative(KOK, MANIFEST));
if (hatalar.length) process.exit(1);
