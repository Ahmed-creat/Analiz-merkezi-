const assert = require("assert");
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "content", "soru_havuzlari");
const files = fs.readdirSync(dir).filter(name => name.endsWith(".json") && name !== "index.json");
assert.strictEqual(files.length, 152, "9 ders havuzunda 152 konu dosyası olmalı");

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

const manifest = JSON.parse(fs.readFileSync(path.join(dir, "index.json"), "utf8"));
assert.strictEqual(manifest.havuz_sayisi, 152);
assert.strictEqual(manifest.soru_sayisi, questions);
assert.strictEqual(manifest.flashcard_sayisi, questions);
console.log(`question-pools: ${files.length} havuz / ${questions} soru kontrolü başarılı`);
