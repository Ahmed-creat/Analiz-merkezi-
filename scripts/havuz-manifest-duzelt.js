#!/usr/bin/env node
/* ============================================================
   HAVUZ MANİFESTİ DÜZELTİCİ (scripts/havuz-manifest-duzelt.js)
   ------------------------------------------------------------
   SORUN: site/content/soru_havuzlari/index.json içindeki 152
   havuzun 60+ tanesinde `baslik` alanı YOK (Kimya, Coğrafya,
   Türk Dili ve Edebiyatı). Uygulama konu başlığıyla havuz
   eşleştirmesi yaptığı için bu derslerde "Kısa Kontrol"
   düğmesi hiç çıkmıyordu.

   ÇÖZÜM: baslik alanı topic_key'in konu kısmından türetilir.
     "Türk Dili ve Edebiyatı > Destan" → baslik: "Destan"
   Mevcut (doğru) baslik değerleri KORUNUR. Betik idempotenttir.

   Kullanım: node scripts/havuz-manifest-duzelt.js [--kontrol]
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const MANIFEST = path.join(KOK, "site", "content", "soru_havuzlari", "index.json");

function konuKismi(topicKey) {
  const tk = String(topicKey || "");
  const p = tk.indexOf(" > ");
  return p >= 0 ? tk.slice(p + 3) : tk;
}

function main() {
  const kontrol = process.argv.includes("--kontrol");
  const m = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const havuzlar = Array.isArray(m.havuzlar) ? m.havuzlar : [];
  let eklenen = 0, korunan = 0, eksik = [];

  for (const h of havuzlar) {
    const dogru = konuKismi(h.topic_key);
    if (!dogru) { eksik.push(h.konu_id); continue; }
    if (h.baslik && String(h.baslik).trim()) { korunan++; continue; }
    if (!kontrol) h.baslik = dogru;
    eklenen++;
  }

  if (eksik.length) {
    console.error("topic_key'i okunamayan havuz:", eksik.join(", "));
    process.exit(1);
  }

  if (!kontrol) {
    fs.writeFileSync(MANIFEST, JSON.stringify(m, null, 2) + "\n", "utf8");
  }
  console.log("havuz: " + havuzlar.length + " · baslik eklenen: " + eklenen + " · korunan: " + korunan + (kontrol ? " (kontrol modu, yazılmadı)" : ""));
}

main();
