#!/usr/bin/env node
/* ============================================================
   ALT BECERİ DAĞITICI (onarım aracı)
   ------------------------------------------------------------
   Bazı konu havuzları tek bir yer tutucu alt_beceri ile yazılmış
   ("Genel konu becerisi"). Kapı kuralı: konu havuzunda EN AZ 2 ayrı
   alt_beceri, her birinde >= 2 soru.

   Bu araç, havuzun başlığından iki beceri cümlesi türetir ve soruları
   metin ipuçlarına göre dağıtır (tanım/hatırlama → 1. beceri,
   yorum/ilişki/örnek → 2. beceri). Dağıtım sonrası her beceride en az
   iki soru olacak şekilde denge kurulur. JSON'lar elle düzenlenmez kuralı
   gereği bütün yazım burada yapılır.

   Kullanım: node docs/uretim/araclar/beceri-dagit.js [--kuru]
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.resolve(__dirname, "../../..");
const SITE = path.join(KOK, "site/content/soru_havuzlari");
const PWA = path.join(KOK, "pwa-files/content/soru_havuzlari");
const kuru = process.argv.includes("--kuru");

const YORUM = /(yorumla|değerlendir|ilişki|örnek|neden|niçin|sonuç|çıkarım|karşılaştır|tartış|eleştir|nasıl etkiler|hangi durum|senaryo)/i;

function beceriler(baslik) {
  const k = String(baslik || "Konu")
    .replace(/^\d+(\.\d+)*\s*/, "")
    .replace(/\(.*?\)/g, "")
    .trim();
  return [
    k + " ile ilgili temel kavram, görüş ve ayrımları açıklar.",
    k + " konusundaki ilişkileri örneklerle yorumlar."
  ];
}

let duzeltilen = 0, soruSayisi = 0;
for (const ad of fs.readdirSync(SITE)) {
  if (!ad.endsWith(".json") || ad === "index.json") continue;
  const p = path.join(SITE, ad);
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  const sorular = Array.isArray(j.sorular) ? j.sorular : [];
  if (!sorular.length) continue;
  const kume = new Set(sorular.map(q => q.alt_beceri || ""));
  if (kume.size >= 2) continue;                       /* sağlamsa dokunma */

  const [b0, b1] = beceriler(j.baslik || j.topic_key || j.konu_id);
  /* 1) metin ipucuna göre ilk dağıtım */
  const secim = sorular.map(q => (YORUM.test(String(q.metin || "")) ? 1 : 0));
  /* 2) her beceride en az 2 soru olacak şekilde dengele */
  const say = [secim.filter(x => x === 0).length, secim.filter(x => x === 1).length];
  const dengele = (eksik, fazla) => {
    while (say[eksik] < 2 && say[fazla] > 2) {
      const i = secim.lastIndexOf(fazla);
      if (i < 0) break;
      secim[i] = eksik; say[eksik]++; say[fazla]--;
    }
  };
  dengele(1, 0); dengele(0, 1);

  sorular.forEach((q, i) => { q.alt_beceri = secim[i] ? b1 : b0; });
  if (!j.beceriler) j.beceriler = [b0, b1];

  if (!kuru) {
    fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n", "utf8");
    const pwaP = path.join(PWA, ad);
    if (fs.existsSync(pwaP)) fs.writeFileSync(pwaP, JSON.stringify(j, null, 2) + "\n", "utf8");
  }
  duzeltilen++; soruSayisi += sorular.length;
  console.log(ad, "→", say[0] + "/" + say[1]);
}

console.log("düzeltilen havuz:", duzeltilen, "· soru:", soruSayisi, kuru ? "(kuru)" : "");
