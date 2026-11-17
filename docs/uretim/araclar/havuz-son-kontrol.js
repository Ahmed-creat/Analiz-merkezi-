#!/usr/bin/env node
/* ============================================================
   HAVUZ SON KONTROL — tüm dersler, tüm dosyalar
   ------------------------------------------------------------
   docs/uretim/araclar/havuz-denetle.js yalnız PLAN ŞEMALI
   (_tNN_cNN) havuzları denetler; geçiş döneminde yaşayan eski
   şemalı (_uNN_kNN) konu havuzları o denetimin dışında kalır.
   Bu araç 313 dosyanın TAMAMINI tek geçişte tarar:

     1) yapı        : sorular/flashcards dizileri, soru = kart sayısı
     2) soru düzeyi : kök ve çözüm uzunluğu, 4 şık, boş şık,
                      dogru_index aralığı
     3) mükerrer    : soru_id, soru metni, topic_key
     4) kart önü    : kart önü ile soru kökü aynı olmamalı
                      (kart tanım/formül, soru senaryo sorar)
     5) şık dengesi : doğru şık aşırı uzunsa uyarı (kopya riski)
     6) ağaç        : topic_key, konular.js 10. sınıf ağacında var mı
     7) kapsam      : ağaç konularından hangisi havuzsuz

   Kullanım:
     node docs/uretim/araclar/havuz-son-kontrol.js
     node docs/uretim/araclar/havuz-son-kontrol.js --ayrinti
   Çıkış kodu: hata > 0 ise 1.
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const HAVUZ_DIR = path.join(KOK, "site", "content", "soru_havuzlari");
const MANIFEST = path.join(HAVUZ_DIR, "index.json");
const AYRINTI = process.argv.includes("--ayrinti");

const { KONULAR } = require(path.join(KOK, "konular.js"));

const DERS_ONEK = {
  biyo: "Biyoloji", biyoloji: "Biyoloji",
  cogr: "Coğrafya", cografya: "Coğrafya",
  din: "Din Kültürü",
  edebiyat: "Türk Dili ve Edebiyatı",
  fel: "Felsefe", felsefe: "Felsefe",
  fiz: "Fizik", fizik: "Fizik",
  kim: "Kimya", kimya: "Kimya",
  mat: "Matematik", matematik: "Matematik",
  tar: "Tarih", tarih: "Tarih"
};

const hatalar = [];
const uyarilar = [];

const sadeles = s => String(s == null ? "" : s)
  .toLocaleLowerCase("tr")
  .replace(/[^\p{L}\p{N} ]/gu, " ")
  .replace(/\s+/g, " ")
  .trim();

/* "X nedir?" / "X hangisidir?" gibi kalıpları atarak kökü indirger;
   kart önü ile soru kökünün aynı kavramı sorması burada yakalanır. */
const cekirdek = s => sadeles(s)
  .replace(/\b(nedir|ne demektir|kimdir|hangisidir|hangisi|nasil|neye|ne)\b/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : { havuzlar: [] };
const indexKey = new Map((manifest.havuzlar || []).map(h => [String(h.konu_id), String(h.topic_key || "")]));

const dosyalar = fs.readdirSync(HAVUZ_DIR)
  .filter(f => f.endsWith(".json") && f !== "index.json")
  .sort();

const agac = {};
for (const ders of Object.keys(KONULAR["10"])) {
  agac[ders] = new Set(KONULAR["10"][ders].map(k => ders + " > " + k));
}

let soruToplam = 0, kartToplam = 0, eskiSema = 0, yeniSema = 0;
const soruIdleri = new Map();
const soruMetinleri = new Map();
const topicSahibi = new Map();
const sikDagilimi = {};
const kapsanan = new Set();

for (const dosya of dosyalar) {
  let pool;
  try {
    pool = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, dosya), "utf8"));
  } catch (e) {
    hatalar.push(dosya + ": geçersiz JSON (" + e.message + ")");
    continue;
  }
  const konuId = String(pool.konu_id || dosya.replace(/\.json$/, ""));
  if (/_10_u\d+_k\d+$/.test(konuId)) eskiSema++; else yeniSema++;

  const S = Array.isArray(pool.sorular) ? pool.sorular : [];
  const K = Array.isArray(pool.flashcards) ? pool.flashcards : [];
  soruToplam += S.length;
  kartToplam += K.length;

  if (!S.length) hatalar.push(dosya + ": soru yok");
  if (S.length !== K.length) hatalar.push(dosya + ": soru " + S.length + " ≠ kart " + K.length);

  /* --- ders alanı --- */
  const onek = DERS_ONEK[String(dosya).split("_")[0]];
  if (onek && pool.ders && pool.ders !== onek) {
    uyarilar.push(dosya + ": ders alanı '" + pool.ders + "' ama dosya öneki " + onek);
  }

  /* --- topic_key --- */
  const tk = indexKey.get(konuId) || String(pool.topic_key || "");
  if (tk) {
    if (topicSahibi.has(tk)) hatalar.push("mükerrer topic_key: " + tk + " → " + topicSahibi.get(tk) + " & " + dosya);
    else topicSahibi.set(tk, dosya);
    const ders = tk.split(" > ")[0];
    if (agac[ders] && agac[ders].has(tk)) kapsanan.add(tk);
    else if (pool.topic_key) uyarilar.push(dosya + ": topic_key ağaçta yok → " + tk);
  } else {
    uyarilar.push(dosya + ": topic_key yok");
  }
  if (pool.topic_key && indexKey.has(konuId) && String(pool.topic_key) !== indexKey.get(konuId)) {
    uyarilar.push(dosya + ": dosyadaki topic_key indeksten farklı → " + pool.topic_key);
  }

  /* --- sorular --- */
  S.forEach((q, i) => {
    if (!q) { hatalar.push(dosya + " s" + (i + 1) + ": boş kayıt"); return; }
    const etiket = dosya + " s" + (i + 1);
    const metin = String(q.metin || "").trim();
    if (metin.length < 25) hatalar.push(etiket + ": kök kısa (" + metin.length + ") → " + JSON.stringify(metin));
    if (!metin) hatalar.push(etiket + ": kök yok");

    const sec = q.secenekler || q.secenek || [];
    if (sec.length !== 4) hatalar.push(etiket + ": şık sayısı " + sec.length);
    if (sec.some(x => !String(x == null ? "" : x).trim())) hatalar.push(etiket + ": boş şık");
    const di = q.dogru_index;
    if (!Number.isInteger(di) || di < 0 || di > 3) hatalar.push(etiket + ": dogru_index geçersiz → " + di);
    sikDagilimi[di] = (sikDagilimi[di] || 0) + 1;

    /* doğru şık aşırı uzunsa: cevap metinden okunabilir */
    if (Number.isInteger(di) && sec[di] && sec.length === 4) {
      const uz = sec.map(x => String(x || "").length);
      const ort = uz.reduce((a, b) => a + b, 0) / 4;
      if (uz[di] > ort * 1.7 && uz[di] - Math.max(...uz.filter((_, j) => j !== di)) > 12) {
        uyarilar.push(etiket + ": doğru şık belirgin uzun (" + uz[di] + " / ort " + Math.round(ort) + ")");
      }
    }

    const cozum = String(q.cozum || "").trim();
    if (!cozum) hatalar.push(etiket + ": çözüm yok");
    else if (cozum.length < 30) hatalar.push(etiket + ": çözüm kısa (" + cozum.length + ") → " + JSON.stringify(cozum));

    const sid = q.soru_id || konuId + "#" + (i + 1);
    if (soruIdleri.has(sid)) hatalar.push("mükerrer soru_id: " + sid + " (" + dosya + ")");
    else soruIdleri.set(sid, dosya);

    const m = sadeles(metin);
    if (soruMetinleri.has(m)) hatalar.push("mükerrer soru metni: " + etiket + " ≡ " + soruMetinleri.get(m));
    else soruMetinleri.set(m, etiket);

    /* kart önü = kök ise kart soruyu tekrar eder, tanım vermez */
    const kart = K[i] || {};
    const on = String(kart.front || kart.on || kart.soru || "").trim();
    if (on && cekirdek(on) && cekirdek(on) === cekirdek(metin)) {
      hatalar.push(etiket + ": kart önü soru köküyle aynı → " + JSON.stringify(on));
    }
  });

  /* --- kartlar --- */
  K.forEach((k, i) => {
    if (!k) { hatalar.push(dosya + " kart" + (i + 1) + ": boş kayıt"); return; }
    const on = String(k.front || k.on || k.soru || "").trim();
    const arka = String(k.back || k.arka || k.cevap || "").trim();
    if (!on) hatalar.push(dosya + " kart" + (i + 1) + ": ön yüz yok");
    if (!arka) hatalar.push(dosya + " kart" + (i + 1) + ": arka yüz yok");
  });
}

/* --- kapsam --- */
const kapsamsiz = [];
for (const ders of Object.keys(agac)) {
  for (const key of agac[ders]) if (!kapsanan.has(key)) kapsamsiz.push(key);
}

console.log("havuz: " + dosyalar.length + " (" + yeniSema + " plan şeması · " + eskiSema + " eski şema)");
console.log("soru: " + soruToplam + " · kart: " + kartToplam);
console.log("doğru şık dağılımı: " + JSON.stringify(sikDagilimi));
console.log("ağaç kapsamı: " + kapsanan.size + "/" + (kapsanan.size + kapsamsiz.length));
console.log("hata: " + hatalar.length + " · uyarı: " + uyarilar.length);

const yaz = (baslik, liste) => {
  if (!liste.length) return;
  console.log("\n-- " + baslik + " (" + liste.length + ") --");
  const goster = AYRINTI ? liste : liste.slice(0, 30);
  goster.forEach(x => console.log("  " + x));
  if (goster.length < liste.length) console.log("  … +" + (liste.length - goster.length) + " (tamamı için --ayrinti)");
};

yaz("HATALAR", hatalar);
yaz("UYARILAR", uyarilar);

if (!kapsamsiz.length) console.log("\nhavuzsuz ağaç konusu yok.");
else {
  console.log("\nhavuzsuz ağaç konusu (" + kapsamsiz.length + ") — kabul edilen istisnalar: Paragraf");
  kapsamsiz.forEach(k => console.log("  · " + k));
}

process.exitCode = hatalar.length ? 1 : 0;
