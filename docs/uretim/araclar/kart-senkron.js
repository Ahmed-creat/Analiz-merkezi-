#!/usr/bin/env node
/* ============================================================
   KART SENKRON — flashcard 1:1 garantisi
   ------------------------------------------------------------
   Havuz düzeyindeki `flashcards` dizisini, soruların içindeki
   `flashcard` alanlarından YENİDEN üretir:
     id    = <soru_id>:flashcard
     front = q.flashcard.front
     back  = q.flashcard.back

   Kullanım:
     node docs/uretim/araclar/kart-senkron.js <dosya.json>        # sadece rapor
     node docs/uretim/araclar/kart-senkron.js <dosya.json> --yaz  # düzelt

   Çıkış kodu: eksik/boş kart varsa 1.
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const yaz = args.includes("--yaz");
const dosya = args.find(a => !a.startsWith("--"));
if (!dosya) {
  console.error("Kullanım: node docs/uretim/araclar/kart-senkron.js <dosya.json> [--yaz]");
  process.exit(2);
}
const tam = path.isAbsolute(dosya) ? dosya : path.join(process.cwd(), dosya);
const pool = JSON.parse(fs.readFileSync(tam, "utf8"));
const sorular = Array.isArray(pool.sorular) ? pool.sorular : [];

let eksik = 0;
const yeni = sorular.map((q, i) => {
  const fc = q && q.flashcard;
  if (!fc || !String(fc.front || "").trim() || !String(fc.back || "").trim()) {
    eksik++;
    console.log("  ✗ soru " + (i + 1) + " (" + ((q && q.soru_id) || "?") + "): flashcard eksik/boş");
    return null;
  }
  return { id: q.soru_id + ":flashcard", front: String(fc.front).trim(), back: String(fc.back).trim() };
}).filter(Boolean);

const eski = Array.isArray(pool.flashcards) ? pool.flashcards : [];
let fark = eski.length !== yeni.length;
if (!fark) {
  for (let i = 0; i < yeni.length; i++) {
    if (!eski[i] || eski[i].id !== yeni[i].id ||
        String(eski[i].front).trim() !== yeni[i].front ||
        String(eski[i].back).trim() !== yeni[i].back) { fark = true; break; }
  }
}

console.log(path.basename(tam) + ": soru " + sorular.length + " · kart(dizi) " + eski.length +
  " · üretilebilir kart " + yeni.length + (fark ? " → FARK VAR" : " → senkron"));

if (yaz && fark && !eksik) {
  pool.flashcards = yeni;
  fs.writeFileSync(tam, JSON.stringify(pool, null, 2) + "\n", "utf8");
  console.log("  ✔ yazıldı: flashcards yeniden üretildi (" + yeni.length + " kart)");
}
if (eksik) {
  console.log("  ✗ " + eksik + " soruda flashcard eksik — önce soruları tamamla (yazma yapılmadı)");
  process.exit(1);
}
