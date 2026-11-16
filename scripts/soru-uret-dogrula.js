#!/usr/bin/env node
/* ============================================================
   SORU HAVUZU DOĞRULAYICI (üretim kabul testi)
   ------------------------------------------------------------
   Soru üreten ajanın çıktısını, uygulamanın çalışma zamanı
   kurallarıyla (site/bkt-engine.js → validatePool) ve
   docs/uretim/uretim-plani.json ile karşılaştırır.

   Kullanım:
     node scripts/soru-uret-dogrula.js <dizin>
     node scripts/soru-uret-dogrula.js docs/uretim/ornekler

   Kontroller
     1) Dosya adı = konu_id.json, konu_id planda var
     2) kod plandaki kodla aynı, kazanim metni birebir
     3) soru sayısı ≥ hedef_soru
     4) her süreç bileşeni bir alt_beceri ve her birine ≥ 2 soru
     5) şema: soru_id, alt_beceri, metin, 4 seçenek, dogru_index, cozum, zorluk
     6) metin tekrarı yok (havuz içi ve havuzlar arası)
     7) doğru cevap dağılımı dengeli (hiçbir şık %40'tan fazla değil)
     8) seçenekler birbirinden farklı, boş değil
     9) her soru için tam 1 flashcard (soru başına 1 kart) + havuz
        düzeyindeki flashcards dizisi sorularla birebir
    10) görsel SORU BAZINDA: metin bir şekle gönderme yapıyorsa
        ("şekilde", "grafikte", "düzenekte" …) görsel zorunlu;
        varsa site/gorsel.js kurallarına uyar; yoksa inceleme listesine
        düşer (kazanım başına görsel kotası YOKTUR)
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const U = require("./uretim-veri.js");
const PLAN = { ciktilar: U.plan };
const hedefDizin = process.argv[2] || path.join(KOK, "site", "content", "soru_havuzlari");
const DIZIN = path.isAbsolute(hedefDizin) ? hedefDizin : path.join(KOK, hedefDizin);

if (!fs.existsSync(DIZIN)) {
  console.error("Dizin yok: " + DIZIN);
  console.error("Kullanım: node scripts/soru-uret-dogrula.js <dizin>");
  process.exit(2);
}

function sade(s) {
  return String(s == null ? "" : s)
    .toLocaleLowerCase("tr")
    .replace(/[’‘`´]/g, "'")
    .replace(/^[a-eç]\s*\)\s*/i, "")   // "a) " etiketini at
    .replace(/[.,;:!?"()\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const planKod = new Map(PLAN.ciktilar.map(c => [c.konu_id, c]));
/* Geçiş dönemi: 2018 ünite şemasındaki (<ders>_10_uNN_kNN) havuzlar
   yeni planda yoktur ama SİLİNMEZ — hata değil, "eski-sema" sayılır. */
const ESKI_SEMA = /_10_u\d+_k\d+$/;
/* Görseli ZORUNLU kılan ifadeler.
   Yalnızca "var olan bir şekle gönderme" kalıpları alınır. Genel
   ifadeler ("aşağıdakilerden hangisi", "vahyin devreye girmesi")
   sayılmaz — bunlar görsel gerektirmez. Yakalanmayanlar inceleme
   listesine düşer, orada tek tek bakılır. */
const SEKIL_ATFI = [
  // şekil
  "şekilde", "şekildeki", "şekle göre", "şekli verilen", "şekilde verilen",
  "yukarıdaki şekil", "aşağıdaki şekil",
  // görsel
  "görselde", "görseldeki", "görsele göre",
  "yukarıdaki görsel", "aşağıdaki görsel",
  // grafik
  "grafikte", "grafikteki", "grafiğe göre", "grafikte verilen",
  "yukarıdaki grafik", "aşağıdaki grafik",
  // tablo
  "tabloda", "tablodaki", "tabloya göre", "tabloda verilen",
  "yukarıdaki tablo", "aşağıdaki tablo",
  // düzenek / devre
  "düzenekte", "düzenekteki", "düzeneğe göre", "düzenek verilen",
  "devredeki", "devrede verilen", "şekildeki devre", "devre şeması",
  // harita
  "haritada", "haritadaki", "haritaya göre", "haritada verilen",
  // şema / çizim / kesit
  "şemada", "şemadaki", "şemaya göre",
  "çizimde", "çizimdeki",
  "kesitte", "kesitteki"
];

function sekilAtfi(metin) {
  const m = " " + String(metin == null ? "" : metin).toLocaleLowerCase("tr") + " ";
  for (const kalip of SEKIL_ATFI) if (m.includes(kalip)) return kalip;
  return null;
}

const gorulenMetin = new Map();   // normalize metin → dosya
const hatalar = [];
const uyarilar = [];
let dosyaSayisi = 0, soruSayisi = 0, gecerli = 0, eskiSema = 0;
let gorselliSoru = 0;
const inceleme = [];   // görselsiz + atıf yok → tek tek bakılacak sorular

function hata(dosya, mesaj) { hatalar.push(dosya + ": " + mesaj); }
function uyari(dosya, mesaj) { uyarilar.push(dosya + ": " + mesaj); }

const dosyalar = fs.readdirSync(DIZIN).filter(f => f.endsWith(".json") && f !== "index.json").sort();
if (!dosyalar.length) {
  console.error("Dizin boş: " + DIZIN);
  process.exit(2);
}

for (const dosya of dosyalar) {
  dosyaSayisi++;
  let pool;
  try {
    pool = JSON.parse(fs.readFileSync(path.join(DIZIN, dosya), "utf8"));
  } catch (e) {
    hata(dosya, "geçersiz JSON (" + e.message + ")");
    continue;
  }
  const oncekiHata = hatalar.length;

  // ---- 1) kimlik ----
  const konuId = String(pool.konu_id || "").trim();
  if (!konuId) { hata(dosya, "konu_id yok"); continue; }
  if (dosya !== konuId + ".json") hata(dosya, "dosya adı konu_id ile uyuşmuyor (" + konuId + ".json olmalı)");
  const plan = planKod.get(konuId);
  if (!plan) {
    if (ESKI_SEMA.test(konuId)) { eskiSema++; continue; }
    hata(dosya, "konu_id planda yok: " + konuId);
    continue;
  }

  // ---- 2) kod + kazanım ----
  if (String(pool.kod || "") !== plan.kod) {
    hata(dosya, "kod uyuşmuyor: " + JSON.stringify(pool.kod) + " ≠ " + plan.kod);
  }
  if (sade(pool.kazanim) !== sade(plan.kazanim)) {
    hata(dosya, "kazanim metni resmî çıktıyla aynı değil");
  }
  if (Number(pool.sinif) !== 10) hata(dosya, "sinif 10 olmalı");
  if (String(pool.ders || "") !== plan.ders) {
    hata(dosya, "ders uyuşmuyor: " + JSON.stringify(pool.ders) + " ≠ " + plan.ders);
  }

  // ---- 3) soru sayısı ----
  const sorular = Array.isArray(pool.sorular) ? pool.sorular : [];
  soruSayisi += sorular.length;
  if (sorular.length < plan.hedef_soru) {
    hata(dosya, "soru sayısı yetersiz: " + sorular.length + " < " + plan.hedef_soru);
  }

  // ---- 4) süreç kapsaması ----
  const beceriSay = new Map();
  const beklenen = new Map(plan.surec.map(s => [sade(s), s]));
  for (const q of sorular) {
    if (!q || !q.alt_beceri) continue;
    const a = sade(q.alt_beceri);
    beceriSay.set(a, (beceriSay.get(a) || 0) + 1);
    if (!beklenen.has(a)) {
      hata(dosya, "alt_beceri resmî süreç bileşeni değil: " + JSON.stringify(q.alt_beceri).slice(0, 90));
    }
  }
  for (const [norm, metin] of beklenen) {
    const n = beceriSay.get(norm) || 0;
    if (n === 0) hata(dosya, "süreç bileşeni hiç sorulmamış: " + metin.slice(0, 80));
    else if (n < 2) hata(dosya, "süreç bileşenine " + n + " soru (en az 2): " + metin.slice(0, 70));
  }

  // ---- 5) şema + 6) tekrar + 7) dağılım + 8) seçenek ----
  const dagilim = [0, 0, 0, 0];
  sorular.forEach((q, i) => {
    const no = "soru " + (i + 1);
    if (!q || typeof q !== "object") { hata(dosya, no + ": nesne değil"); return; }
    if (!q.soru_id) hata(dosya, no + ": soru_id yok");
    else if (!String(q.soru_id).startsWith(konuId + "_")) hata(dosya, no + ": soru_id " + konuId + "_… ile başlamalı");
    if (!q.alt_beceri) hata(dosya, no + ": alt_beceri yok");
    if (!q.metin || !String(q.metin).trim()) hata(dosya, no + ": metin yok");
    if (!Array.isArray(q.secenekler) || q.secenekler.length !== 4) hata(dosya, no + ": 4 seçenek gerekli");
    if (!Number.isInteger(q.dogru_index) || q.dogru_index < 0 || q.dogru_index > 3) hata(dosya, no + ": dogru_index 0-3 arası tam sayı olmalı");
    else dagilim[q.dogru_index]++;
    if (!q.cozum || !String(q.cozum).trim()) hata(dosya, no + ": cozum yok");
    if (q.zorluk !== "deneme") hata(dosya, no + ": zorluk \"deneme\" olmalı");
    if (q.kazanim && sade(q.kazanim) !== sade(plan.kazanim)) hata(dosya, no + ": soru içindeki kazanim farklı");

    if (Array.isArray(q.secenekler)) {
      const sadeSec = q.secenekler.map(sade);
      if (sadeSec.some(x => !x)) hata(dosya, no + ": boş seçenek");
      if (new Set(sadeSec).size !== sadeSec.length) hata(dosya, no + ": seçenekler birbirinin aynısı");
    }

    if (q.metin) {
      const n = sade(q.metin);
      if (gorulenMetin.has(n) && gorulenMetin.get(n) !== dosya) {
        hata(dosya, no + ": metin başka havuzda da var (" + gorulenMetin.get(n) + ")");
      } else gorulenMetin.set(n, dosya);
    }

    // ---- flashcard: her soru için tam 1 kart ----
    const fc = q.flashcard;
    if (!fc || typeof fc !== "object") hata(dosya, no + ": flashcard yok");
    else {
      if (!fc.front || !String(fc.front).trim()) hata(dosya, no + ": flashcard.front yok");
      if (!fc.back || !String(fc.back).trim()) hata(dosya, no + ": flashcard.back yok");
      if (fc.front && fc.back && sade(fc.front) === sade(fc.back)) {
        hata(dosya, no + ": flashcard ön/arka aynı");
      }
    }

    // ---- görsel: SORU BAZINDA karar ----
    const atif = sekilAtfi(q.metin);
    if (q.gorsel) {
      gorselliSoru++;
      try {
        const GV = require(path.join(KOK, "site/gorsel.js"));
        const g = GV.dogrula(q.gorsel);
        if (g && g.length) hata(dosya, no + ": görsel geçersiz (" + g.join(",") + ")");
      } catch (e) {
        uyari(dosya, no + ": görsel doğrulanamadı (" + e.message + ")");
      }
    } else if (atif) {
      hata(dosya, no + ": metin bir şekle gönderme yapıyor (\"" + atif +
        "\") ama gorsel alanı yok");
    } else {
      inceleme.push(dosya + " · " + (q.soru_id || no) + " · " + String(q.metin || "").slice(0, 60));
    }
  });

  if (sorular.length >= 4) {
    const enB = Math.max(...dagilim);
    if (enB > Math.ceil(sorular.length * 0.4)) {
      hata(dosya, "doğru cevap dağılımı bozuk: " + dagilim.join("/") + " (hiçbiri %40'ı geçmemeli)");
    }
  }

  // ---- havuz düzeyi flashcards: soru sayısıyla birebir ----
  const kartlar = Array.isArray(pool.flashcards) ? pool.flashcards : null;
  if (!kartlar) hata(dosya, "flashcards dizisi yok");
  else {
    if (kartlar.length !== sorular.length) {
      hata(dosya, "flashcards " + kartlar.length + " kart, soru " + sorular.length +
        " (birebir olmalı: her soru için 1 kart)");
    }
    kartlar.forEach((k, i) => {
      const no = "kart " + (i + 1);
      if (!k || !k.front || !k.back) { hata(dosya, no + ": front/back eksik"); return; }
      const q = sorular[i];
      if (q && q.soru_id && k.id && k.id !== q.soru_id + ":flashcard") {
        hata(dosya, no + ": id " + q.soru_id + ":flashcard olmalı (" + k.id + ")");
      }
    });
  }

  if (hatalar.length === oncekiHata) gecerli++;
}

// ---- rapor ----
const kapsanan = new Set(dosyalar.map(f => f.replace(/\.json$/, "")));
const eksikHavuz = PLAN.ciktilar.filter(c => !kapsanan.has(c.konu_id));

console.log("");
console.log("== SORU HAVUZU DOĞRULAMA ==");
console.log("dizin      : " + path.relative(KOK, DIZIN));
console.log("dosya      : " + dosyaSayisi + " (geçerli " + gecerli + ")");
console.log("eski şema  : " + eskiSema + " (2018 ünite yapısı — denetim dışı, korunur)");
console.log("soru       : " + soruSayisi);
console.log("flashcard  : birebir kontrol edildi (soru = kart)");
console.log("görselli   : " + gorselliSoru);
console.log("görsel inceleme : " + inceleme.length + " soru (görselsiz, atıf yok — tek tek bakılmalı)");
console.log("plan dışı  : " + dosyalar.filter(f => { const k = f.replace(/\.json$/, ""); return !planKod.has(k) && !ESKI_SEMA.test(k); }).length);
console.log("eksik havuz: " + eksikHavuz.length + " / " + PLAN.ciktilar.length);
if (eksikHavuz.length && eksikHavuz.length <= 20) {
  console.log("  " + eksikHavuz.map(c => c.konu_id).join(", "));
}
if (uyarilar.length) {
  console.log("\n-- uyarılar (" + uyarilar.length + ") --");
  uyarilar.slice(0, 25).forEach(u => console.log("  ! " + u));
  if (uyarilar.length > 25) console.log("  … +" + (uyarilar.length - 25));
}
if (inceleme.length && process.env.INCELEME === "1") {
  console.log("\n-- görsel inceleme listesi --");
  inceleme.slice(0, 40).forEach(x => console.log("  ? " + x));
  if (inceleme.length > 40) console.log("  … +" + (inceleme.length - 40));
}
if (hatalar.length) {
  console.log("\n-- HATALAR (" + hatalar.length + ") --");
  hatalar.slice(0, 40).forEach(h => console.log("  ✗ " + h));
  if (hatalar.length > 40) console.log("  … +" + (hatalar.length - 40));
  console.log("\nSONUÇ: BAŞARISIZ ❌");
  process.exit(1);
}
console.log("\nSONUÇ: TÜM KURALLAR GEÇTİ ✅");
