#!/usr/bin/env node
/* ============================================================
   KONU EŞLEME İNDEKSİ ÜRETİCİ
   ------------------------------------------------------------
   Okulizyon sınav sonuçları, yanlış/boş soruların konusunu
   KAZANIM METNİ olarak verir:
     "Dik üçgende trigonometrik oranlar ve trigonometrik
      özdeşliklerle ilgili varsayımlarda bulunur."
   Uygulama ise KONU BAŞLIĞI kullanır:
     "1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler"

   Bu betik, eşleştirmeyi tarayıcıda yapabilmek için soru
   havuzlarından küçük bir arama indeksi üretir:
     site/content/konu_esleme.json

   Her havuz için arama metni =
     topic_key'in konu kısmı + baslik + etiketler + alt_beceriler
   (alt_beceri alanları da kazanım metni olduğu için en güçlü
    sinyal; "kazanım ↔ kazanım" karşılaştırması yapılır.)

   Kullanım:  node scripts/konu-esleme-uret.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const HAVUZ_DIR = path.join(KOK, "site", "content", "soru_havuzlari");
const MANIFEST = path.join(HAVUZ_DIR, "index.json");
const CIKTI = path.join(KOK, "site", "content", "konu_esleme.json");

function oku(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function uret() {
  const manifest = oku(MANIFEST);
  const havuzlar = Array.isArray(manifest.havuzlar) ? manifest.havuzlar : [];
  const kayitlar = [];
  let altBeceriSayisi = 0;

  for (const h of havuzlar) {
    const dosya = path.join(HAVUZ_DIR, h.dosya || h.konu_id + ".json");
    let pool = null;
    try {
      pool = oku(dosya);
    } catch (e) {
      console.warn("Havuz okunamadı:", h.konu_id, e.message);
      continue;
    }
    const alt = [];
    const gorulen = new Set();
    for (const q of pool.sorular || []) {
      const a = q && q.alt_beceri;
      if (!a || typeof a !== "string") continue;
      const k = a.trim();
      if (!k || gorulen.has(k)) continue;
      gorulen.add(k);
      alt.push(k);
    }
    altBeceriSayisi += alt.length;

    // "Ders > Konu" → konu kısmı (uygulamanın konu başlığı)
    const topicKey = String(h.topic_key || "");
    const parca = topicKey.split(" > ");
    const konu = parca.length > 1 ? parca.slice(1).join(" > ") : topicKey;

    kayitlar.push({
      konu_id: h.konu_id,
      ders: h.ders,
      topic_key: topicKey,
      konu: konu,
      soru: Number(h.soru_sayisi) || 0,
      // Arama metni (tek alan: tarayıcıda tek geçiş yeter)
      metin: [konu, h.baslik || "", ...(h.etiketler || []), ...alt]
        .filter(Boolean)
        .join(" · ")
    });
  }

  const veri = {
    surum: "2026-10-28",
    aciklama:
      "Okulizyon kazanım metinlerini uygulamanın konu başlıklarına eşlemek için arama indeksi. " +
      "scripts/konu-esleme-uret.js üretir; elle düzenlenmez.",
    havuz_sayisi: kayitlar.length,
    alt_beceri_sayisi: altBeceriSayisi,
    havuzlar: kayitlar
  };

  fs.writeFileSync(CIKTI, JSON.stringify(veri), "utf8");
  const boyut = (fs.statSync(CIKTI).size / 1024).toFixed(1);
  console.log(
    "konu_esleme.json yazıldı — " +
      kayitlar.length +
      " havuz, " +
      altBeceriSayisi +
      " alt beceri, " +
      boyut +
      " KB"
  );
  return veri;
}

if (require.main === module) uret();
module.exports = { uret, CIKTI };
