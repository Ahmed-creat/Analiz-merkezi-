const assert = require("assert");
const fs = require("fs");
const vm = require("vm");
const { calculatePriority } = require("../bildirim-logic");

function loadBkt() {
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
    user: { name: "Retest", grade: "10" },
    bkt_state: {}, bkt_processed_records: {},
    flashcards: { cards: [], sessions: {}, lastSoftDrop: {} },
    memory: {}, exams: [], questions: [], topics: {}
  };
  vm.runInNewContext(fs.readFileSync(require.resolve("../bkt-engine.js"), "utf8"), context);
  return { BKT: context.window.AnalizBKT, state: context.state };
}

const { BKT, state } = loadBkt();
assert.strictEqual(BKT.normalizeReason("KONU EKSİKLİĞİ"), "KONUEKSİKLİĞİ");
assert.strictEqual(BKT.normalizeReason("ÇÖZÜM YOLUNU BULAMADIM"), "ÇÖZÜMYOLUNUBULAMADIM");
assert.strictEqual(BKT.observe({ konu_id: "D > T", dogru_mu: false, neden: "SÜREYETMEDİ", kaynak: "deneme" }).ignored, true);
assert(!state.bkt_state["D > T"] || state.bkt_state["D > T"].gozlem_sayisi === 0);
assert.strictEqual(BKT.validateParameters({ P_G: 0.9, P_S: 0.2 }), false);
assert.strictEqual(BKT.validateParameters(BKT.PARAM), true);

const nodes = ["a", "b"].map((id) => ({ konu_id: id, konu_adi: id, sinif: 9, ders: "D" }));
const cycle = BKT.validateGraphData({
  dugumler: nodes,
  kenarlar: [
    { kaynak_konu_id: "a", hedef_konu_id: "b", iliski_tipi: "SERT_ONKOSUL", agirlik: 0.9 },
    { kaynak_konu_id: "b", hedef_konu_id: "a", iliski_tipi: "SERT_ONKOSUL", agirlik: 0.8 }
  ]
});
assert.strictEqual(cycle.valid, false);
assert.strictEqual(cycle.edges.length, 1);
assert.strictEqual(cycle.disabled_edges.length, 1);
const dense = BKT.validateGraphData({
  dugumler: nodes,
  kenarlar: Array.from({ length: 5 }, (_, i) => ({ kaynak_konu_id: "a", hedef_konu_id: "b", iliski_tipi: "SERT_ONKOSUL", agirlik: 0.70 + i * 0.05 }))
});
assert.strictEqual(dense.edges.length, 4);
assert.strictEqual(dense.disabled_edges.length, 1);

const pool = { konu_id: "pool", sorular: Array.from({ length: 10 }, (_, i) => ({
  soru_id: "pool_o" + i, alt_beceri: "beceri" + (i % 5), metin: "Soru " + i,
  secenekler: ["A", "B", "C", "D"], dogru_index: 0, cozum: "Çözüm", zorluk: "deneme"
})) };
assert.strictEqual(BKT.validatePool(pool, "pool").valid, true);
const first = BKT.selectPoolQuestions(pool, "pool", 5, "2026-10-12").map((q) => q.soru_id);
const second = BKT.selectPoolQuestions(pool, "pool", 5, "2026-10-12").map((q) => q.soru_id);
assert.strictEqual(new Set(first).size, 5);
assert.strictEqual(new Set([...first, ...second]).size, 10);
assert.strictEqual(state.soru_havuzu_gosterim_logu.length, 10);

state.bkt_state.Topic = { L: 0.9, gozlem_sayisi: 5, onay_durumu: "ONAYLANDI", tetiklenen_krediler: [] };
state.flashcards.cards.push({ id: "card", topicKey: "Topic", due: "2026-10-12", S: 1, memory_bar: 1 });
for (let i = 0; i < 4; i++) BKT.flashcardReview("card", "Bildi");
assert(Math.abs(state.flashcards.cards[0].S - 6.5536) < 0.000001);
assert(Math.abs(BKT.memoryRecall(1.6, 3) - 0.1534) < 0.001);
assert.strictEqual(BKT.flashcardReview("card", "Zorlandım").rating, "Zorlandım");
assert.strictEqual(BKT.flashcardReview("card", "Bilemedi").rating, "Bilemedi");

const make = (type, count) => Array.from({ length: count }, () => ({ lesson: "Matematik", topic: "T", type }));
const priorityState = {
  memory: {}, exams: [{ errorLogs: [...make("Konuyu Bilmiyordum", 4), ...make("İşlem Hatası/Dikkatsizlik", 3), ...make("ANLAMADIM", 2)] }],
  questions: [{ errorLogs: make("Konuyu Bilmiyordum", 2) }]
};
assert.strictEqual(calculatePriority(priorityState, 0)[0][1], 10.5);
assert.strictEqual(calculatePriority(priorityState, 0.3)[0][1], 13.65);

console.log("fixes-retest: C2, D2, F2/F3/F4, G2/G4/G7/G9, E6/E10, I1 vector kontrolleri başarılı");
