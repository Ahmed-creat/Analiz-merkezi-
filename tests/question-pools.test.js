const assert = require("assert");
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "site", "content", "soru_havuzlari");
const files = fs.readdirSync(dir).filter(name => name.endsWith(".json") && name !== "index.json");
// Sayılar sabit değil, MANİFESTTEN türetilir: yeni havuz eklendiğinde
// (soru üretim ajanının çıktısı) test kırılmaz, tutarlılık korunur.
const manifest = JSON.parse(fs.readFileSync(path.join(dir, "index.json"), "utf8"));
assert.strictEqual(files.length, manifest.havuz_sayisi, "manifest havuz_sayisi dosya sayısıyla aynı olmalı");
assert(manifest.havuz_sayisi > 0, "manifest boş olmamalı");

let questions = 0;
for (const file of files) {
  const pool = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  assert(pool.konu_id, `${file}: konu_id eksik`);
  assert(Array.isArray(pool.sorular) && pool.sorular.length >= 10, `${file}: soru sayısı eksik`);
  for (const question of pool.sorular) {
    assert(question.soru_id && question.alt_beceri && question.metin, `${file}: soru alanı eksik`);
    assert(Array.isArray(question.secenekler) && question.secenekler.length === 4, `${file}: dört seçenek gerekli`);
    assert(Number.isInteger(question.dogru_index) && question.dogru_index >= 0 && question.dogru_index < 4, `${file}: doğru cevap eksik`);
    assert(question.cozum && question.zorluk === "deneme", `${file}: çözüm/zorluk eksik`);
  }
  questions += pool.sorular.length;
}

assert.strictEqual(manifest.soru_sayisi, questions, "manifest soru_sayisi toplamla aynı olmalı");
let flashcards = 0;
for (const file of files) {
  const pool = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  flashcards += Array.isArray(pool.flashcards) ? pool.flashcards.length : 0;
}
assert.strictEqual(manifest.flashcard_sayisi, flashcards, "manifest flashcard_sayisi toplamla aynı olmalı");
console.log(`question-pools: ${files.length} havuz / ${questions} soru kontrolü başarılı`);
