const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// YAYINLANAN dosya: site/bkt-engine.js (kök kopya eskiydi, testi yanıltıyordu)
const code = fs.readFileSync(require.resolve("../site/bkt-engine.js"), "utf8");
const context = {
  console,
  Date,
  Set,
  Math,
  JSON,
  Promise,
  encodeURIComponent,
  window: {},
  document: { readyState: "loading", addEventListener() {} }
};
context.state = {
  user: { name: "Test", grade: "9" },
  bkt_state: {},
  bkt_processed_records: {},
  flashcards: { cards: [], sessions: {}, lastSoftDrop: {} },
  memory: {},
  exams: [],
  questions: [],
  topics: {}
};
vm.runInNewContext(code, context, { filename: "bkt-engine.js" });
const BKT = context.window.AnalizBKT;
assert(BKT, "AnalizBKT API yüklenmeli");
assert.strictEqual(BKT.PARAM.P_L0, 0.12);
assert.strictEqual(BKT.SOURCE_PT.deneme, 0.05);

let result = BKT.observe({ konu_id: "Ders > Konu", dogru_mu: false, neden: "KONU EKSİKLİĞİ", kaynak: "deneme" });
assert.strictEqual(result.ignored, false);
assert.strictEqual(context.state.bkt_state["Ders > Konu"].gozlem_sayisi, 1);
assert.strictEqual(BKT.observe({ konu_id: "Ders > Konu", dogru_mu: false, neden: "SÜRE YETMEDİ", kaynak: "deneme" }).ignored, true);
assert.strictEqual(BKT.observe({ konu_id: "Ders > Konu", dogru_mu: false, neden: "Kodlama/Kitapçık Hatası", kaynak: "deneme" }).ignored, true);
for (let i = 0; i < 4; i++) BKT.observe({ konu_id: "Ders > Konu", dogru_mu: true, kaynak: "soru_girisi" });
assert.strictEqual(context.state.bkt_state["Ders > Konu"].gozlem_sayisi, 5);
assert(context.state.bkt_state["Ders > Konu"].L >= 0.01 && context.state.bkt_state["Ders > Konu"].L <= 0.99);
assert.strictEqual(BKT.statusFor(context.state.bkt_state["Ders > Konu"]), "OGRENIYOR");

const validGraph = BKT.validateGraphData({
  dugumler: [
    { konu_id: "a", konu_adi: "A", sinif: 9, ders: "D" },
    { konu_id: "b", konu_adi: "B", sinif: 10, ders: "D" }
  ],
  kenarlar: [{ kaynak_konu_id: "a", hedef_konu_id: "b", iliski_tipi: "SERT_ONKOSUL", agirlik: 0.9, gerekce: "temel" }]
});
assert.strictEqual(validGraph.valid, true);
const cycle = BKT.validateGraphData({
  dugumler: [
    { konu_id: "a", konu_adi: "A", sinif: 9, ders: "D" },
    { konu_id: "b", konu_adi: "B", sinif: 9, ders: "D" }
  ],
  kenarlar: [
    { kaynak_konu_id: "a", hedef_konu_id: "b", iliski_tipi: "SERT_ONKOSUL", agirlik: 0.9 },
    { kaynak_konu_id: "b", hedef_konu_id: "a", iliski_tipi: "SERT_ONKOSUL", agirlik: 0.9 }
  ]
});
assert.strictEqual(cycle.valid, false);
assert(validGraph.edges[0].ileri_bagimlilik === false || validGraph.edges[0].ileri_bagimlilik === undefined);

const pool = { konu_id: "p", sorular: Array.from({ length: 10 }, (_, i) => ({
  soru_id: "p_s" + i, alt_beceri: "beceri" + (i % 5), metin: "Soru", secenekler: ["A", "B", "C", "D"], dogru_index: 0, cozum: "Çözüm", zorluk: "deneme"
})) };
assert.strictEqual(BKT.validatePool(pool, "p").valid, true);
console.log("bkt-engine: tüm kontroller başarılı");

// ---- SAYFAYA GERÇEKTEN BAĞLI MI? ----
// 2026-10-28: motor dosyası site/ altında duruyordu ama index.html onu HİÇ
// yüklemiyordu → havuz/Kısa Kontrol akışının bir kısmı sessizce ölüydü.
// Ayrıca bu test eskiden KÖKTEKİ eski kopyayı (bkt-engine.js) sınıyordu;
// yayınlanan dosya site/bkt-engine.js olduğu için test artık ONU okur.
{
  const html = fs.readFileSync(path.join(__dirname, "..", "site", "index.html"), "utf8");
  const sw = fs.readFileSync(path.join(__dirname, "..", "site", "sw.js"), "utf8");
  const motor = fs.readFileSync(path.join(__dirname, "..", "site", "bkt-engine.js"), "utf8");

  assert.ok(/<script[^>]+src="bkt-engine\.js"/.test(html), "index.html bkt-engine.js'i yüklemeli");
  assert.ok(/"\.\/bkt-engine\.js"/.test(sw), "sw.js ASSETS'te bkt-engine.js olmalı");
  assert.ok(/window\.AnalizBKT\s*=/.test(motor), "motor window.AnalizBKT kurmalı");

  // Motora bağımlı olduğu KÜRESEL yardımcılar sayfada tanımlı olmalı
  for (const ad of ["toast", "saveState", "getMemoryStrength", "daysLeftToExam", "calculatePriority", "todayStr"]) {
    assert.ok(new RegExp("function\\s+" + ad + "\\s*\\(").test(html), "index.html " + ad + "() tanımlı olmalı");
  }

  // Yükleme sırası: motor kendi yardımcılarından SONRA gelmeli
  const yer = html.indexOf('src="bkt-engine.js"');
  for (const once of ["havuz-bul.js", "gorsel.js", "video-cozum.js"]) {
    const y = html.indexOf('src="' + once + '"');
    assert.ok(y >= 0 && y < yer, "bkt-engine.js, " + once + " sonrasında gelmeli");
  }
  console.log("bağlantı nöbetçisi: tüm kontroller geçti");
}
