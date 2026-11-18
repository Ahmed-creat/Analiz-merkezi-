#!/usr/bin/env node
/* ============================================================
   ARŞİV KAYIT TEMİZLE — üretilen indekslerden arşivlenen havuzları düşür
   ------------------------------------------------------------
   Bir soru havuzu arşive taşındığında (arsiv/soru_havuzlari/...)
   ondan türetilmiş indekslerde izi kalır:
     · site/content/mufredat/kazanim_konu_10.json → konular[]
     · site/content/konu_esleme.json              → havuzlar[]
   Bu iz kalınca "her konu_id gerçek bir havuzda var" testi ve
   uygulamanın konu eşleme indeksi havuzsuz kayıtları gösterir.

   Bu betik, yaşayan havuz listesini (site/content/soru_havuzlari)
   esas alır ve iki indeksten yaşamayan konu_id'leri çıkarır.
   Yeniden üretim (meb-kazanim-uret / konu-esleme-uret) yapılmadan
   önce/sonra güvenle çalıştırılabilir; idempotenttir.

   Kullanım:
     node scripts/arsiv-kayit-temizle.js           # uygula
     node scripts/arsiv-kayit-temizle.js --kontrol # yalnız raporla
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const HAVUZ_DIR = path.join(KOK, "site", "content", "soru_havuzlari");
const KAZANIM = path.join(KOK, "site", "content", "mufredat", "kazanim_konu_10.json");
const ESLEME = path.join(KOK, "site", "content", "konu_esleme.json");
const KONTROL = process.argv.includes("--kontrol");

const canli = new Set(
  fs.readdirSync(HAVUZ_DIR)
    .filter(f => f.endsWith(".json") && f !== "index.json")
    .map(f => f.replace(/\.json$/, ""))
);

const yaz = (p, v) => {
  if (!KONTROL) fs.writeFileSync(p, JSON.stringify(v, null, 1) + "\n", "utf8");
};

let toplam = 0;

/* ---- 1) kazanim_konu_10.json ---- */
if (fs.existsSync(KAZANIM)) {
  const K = JSON.parse(fs.readFileSync(KAZANIM, "utf8"));
  const once = Array.isArray(K.konular) ? K.konular.length : 0;
  K.konular = (K.konular || []).filter(k => canli.has(String(k.konu_id)));
  const dusen = once - K.konular.length;

  /* metin eşlemesinde yaşamayan konu_id'lere verilen atıfları da kırp */
  let metinDusen = 0;
  if (Array.isArray(K.metin_esleme)) {
    const oncesi = K.metin_esleme.length;
    K.metin_esleme = K.metin_esleme.filter(m => {
      const id = m.konu_id || m.konu || "";
      if (!id) return true;
      if (canli.has(String(id))) return true;
      metinDusen++;
      return false;
    });
    if (K.metin_esleme.length === oncesi) metinDusen = 0;
  }

  if (K.ozet && typeof K.ozet === "object") {
    K.ozet.konu = K.konular.length;
    if (K.ozet.ders_bazli) {
      for (const ders of Object.keys(K.ozet.ders_bazli)) {
        const n = K.konular.filter(k => k.ders === ders).length;
        K.ozet.ders_bazli[ders].konu = n;
      }
    }
  }

  if (dusen || metinDusen) yaz(KAZANIM, K);
  console.log("kazanim_konu_10.json: " + dusen + " konu, " + metinDusen + " metin eşlemesi düşürüldü" +
    " (konu: " + K.konular.length + ")");
  toplam += dusen + metinDusen;
}

/* ---- 2) konu_esleme.json ---- */
if (fs.existsSync(ESLEME)) {
  const E = JSON.parse(fs.readFileSync(ESLEME, "utf8"));
  const once = Array.isArray(E.havuzlar) ? E.havuzlar.length : 0;
  E.havuzlar = (E.havuzlar || []).filter(h => canli.has(String(h.konu_id)));
  const dusen = once - E.havuzlar.length;
  if (dusen) {
    E.havuz_sayisi = E.havuzlar.length;
    yaz(ESLEME, E);
  }
  console.log("konu_esleme.json: " + dusen + " havuz düşürüldü (havuz: " + E.havuzlar.length + ")");
  toplam += dusen;
}

console.log((KONTROL ? "[kontrol] " : "") + "toplam düşürülen kayıt: " + toplam);
