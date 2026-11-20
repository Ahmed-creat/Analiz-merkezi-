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
/* v75 — ARŞİVDEKİ OKULİZYON CÜMLELERİ
   Eski havuzlar `alt_beceri` alanında Okulizyon'un BİREBİR kazanım
   cümlesini taşıyordu ("üçgenin bir kenarı ve o kenara ait yüksekliğinin
   değişimine bağlı olarak…"). Yeni (ders kitabından üretilmiş) havuzlarda
   bu alan kısa bir beceri cümlesi. Okulizyon'dan gelen metinle eşleşmeyi
   korumak için arşivdeki cümleler arama metnine eklenir.
   Dosya yoksa sessizce atlanır (arşiv kalıcı değil). */
const ARSIV_DIR = path.join(KOK, "arsiv", "soru_havuzlari", "eski-site");
/* Eski manifestin `etiketler` alanı Okulizyon'un kendi kazanım cümlelerini
   taşıyordu ("Türkü türünün genel özelliklerini belirler."). Yeni havuzlarda
   bu alan ders kitabı kazanımlarıyla doldu; Okulizyon eşleşmesi zayıflamasın
   diye eski etiketler konu bazında devralınır. */
const arsivEtiketleri = (() => {
  const harita = new Map();
  const yol = path.join(ARSIV_DIR, "index.json");
  if (!fs.existsSync(yol)) return harita;
  let d = null;
  try { d = JSON.parse(fs.readFileSync(yol, "utf8")); } catch (e) { return harita; }
  for (const h of (d.havuzlar || [])) {
    const et = (h.etiketler || []).map(x => String(x).trim()).filter(Boolean);
    if (!et.length) continue;
    for (const k of [String(h.konu_id || ""), String(h.topic_key || "")]) {
      if (k && !harita.has(k)) harita.set(k, et);
    }
  }
  return harita;
})();

const arsivCumleleri = (() => {
  const harita = new Map();           // anahtar → [cümle]
  if (!fs.existsSync(ARSIV_DIR)) return harita;
  for (const ad of fs.readdirSync(ARSIV_DIR)) {
    if (!ad.endsWith(".json") || ad === "index.json") continue;
    let d = null;
    try { d = JSON.parse(fs.readFileSync(path.join(ARSIV_DIR, ad), "utf8")); } catch (e) { continue; }
    if (!d || !Array.isArray(d.sorular)) continue;
    const cumleler = [];
    const gorulen = new Set();
    for (const q of d.sorular) {
      const a = q && q.alt_beceri;
      if (typeof a !== "string") continue;
      const t = a.trim();
      if (!t || gorulen.has(t)) continue;
      gorulen.add(t);
      cumleler.push(t);
    }
    if (!cumleler.length) continue;
    const anahtarlar = [String(d.konu_id || ""), String(d.topic_key || "")].filter(Boolean);
    for (const k of anahtarlar) {
      if (!harita.has(k)) harita.set(k, cumleler);
    }
  }
  return harita;
})();
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
    const kazanimlar = [];
    const gorulenK = new Set();
    for (const q of pool.sorular || []) {
      const a = q && q.alt_beceri;
      if (a && typeof a === "string") {
        const k = a.trim();
        if (k && !gorulen.has(k)) { gorulen.add(k); alt.push(k); }
      }
      // v75 — yeni havuzlar kazanım cümlesini SORU BAŞINA taşıyor.
      // Okulizyon da kazanım cümlesi gönderdiği için en güçlü sinyal bu:
      // "kazanım ↔ kazanım" karşılaştırması. Eski havuzlarda bu alan yoktu,
      // bu yüzden alt_beceri + etiketler kullanılıyordu; ikisi birlikte alınır.
      const kz = q && q.kazanim;
      if (kz && typeof kz === "string") {
        const k2 = kz.trim();
        if (k2 && !gorulenK.has(k2)) { gorulenK.add(k2); kazanimlar.push(k2); }
      }
    }
    if (!kazanimlar.length && typeof pool.kazanim === "string" && pool.kazanim.trim()) {
      kazanimlar.push(pool.kazanim.trim());
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
      metin: [konu, h.baslik || "", ...(h.etiketler || []), ...alt, ...kazanimlar,
        ...(arsivCumleleri.get(String(h.konu_id)) || arsivCumleleri.get(topicKey) || []),
        ...(arsivEtiketleri.get(String(h.konu_id)) || arsivEtiketleri.get(topicKey) || [])]
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
