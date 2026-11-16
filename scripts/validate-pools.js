#!/usr/bin/env node
/* Soru havuzu şema/etiket doğrulayıcı — şartname Bölüm 4.2. */
const fs = require("fs");
const path = require("path");

const dir = path.join(process.cwd(), "content", "soru_havuzlari");
if (!fs.existsSync(dir)) {
  console.log("Soru havuzu dizini yok; havuzsuz bozulmuş mod geçerli.");
  process.exit(0);
}
const files = fs.readdirSync(dir).filter(f => f.endsWith(".json") && f !== "index.json");
if (!files.length) {
  console.log("Soru havuzu bulunamadı; havuzsuz bozulmuş mod geçerli.");
  process.exit(0);
}
let failed = false;
for (const file of files) {
  const full = path.join(dir, file);
  let pool;
  try { pool = JSON.parse(fs.readFileSync(full, "utf8")); }
  catch (e) { console.error(`${file}: geçersiz JSON`); failed = true; continue; }
  const errors = [];
  const questions = Array.isArray(pool.sorular) ? pool.sorular : [];
  if (!pool.konu_id) errors.push("konu_id zorunlu");
  if (questions.length < 10) errors.push("en az 10 soru gerekli");
  const skills = new Map();
  questions.forEach((q, i) => {
    if (!q || !q.soru_id || !q.alt_beceri || !q.metin) errors.push(`soru ${i + 1}: soru_id/alt_beceri/metin zorunlu`);
    if (!Array.isArray(q.secenekler) || q.secenekler.length !== 4 || !Number.isInteger(q.dogru_index) || q.dogru_index < 0 || q.dogru_index > 3) errors.push(`soru ${i + 1}: dört seçenek ve doğru_index zorunlu`);
    if (!q.cozum || !String(q.cozum).trim()) errors.push(`soru ${i + 1}: cozum zorunlu`);
    if (q.zorluk !== "deneme") errors.push(`soru ${i + 1}: zorluk deneme olmalı`);
    if (q.alt_beceri) skills.set(q.alt_beceri, (skills.get(q.alt_beceri) || 0) + 1);
  });
  for (const [skill, count] of skills) if (count < 2) errors.push(`${skill}: alt beceri başına en az 2 soru gerekli`);
  if (errors.length) { failed = true; console.error(`${file}:`); errors.forEach(e => console.error(`  - ${e}`)); }
  else console.log(`${file}: geçerli (${questions.length} soru)`);
}
process.exit(failed ? 1 : 0);
