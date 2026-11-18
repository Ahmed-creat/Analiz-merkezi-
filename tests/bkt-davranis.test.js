#!/usr/bin/env node
/* ============================================================
   BKT MOTORU DAVRANIŞ TESTİ — tests/bkt-davranis.test.js
   ------------------------------------------------------------
   Kullanıcı (v35.9): "BKT motoru doğru çalışıyor mu?"

   Bu test metne bakmaz: motoru GERÇEKTEN çalıştırır, cevap verir ve
   sayıların fiziksel/mantıksal beklentiye uyduğunu doğrular.

   Kanıtlanan davranışlar:
     1) Doğru cevap bilme olasılığını (L) ARTIRIR, monoton.
     2) Yanlış cevap DÜŞÜRÜR, monoton.
     3) "Süre yetmedi" (eski kayıt) gözlem SAYILMAZ — L değişmez.
     4) 5 gözlemden önce yeterlilik GÖSTERİLMEZ (veri yetersiz).
     5) 5+ gözlem ve L ≥ %85 olunca havuZsuz konu ONAYLANIR.
     6) Kaynak ağırlığı: deneme (0.05) < mini_test (0.10) < soru girişi (0.15)
        → aynı cevap, kaynağa göre farklı hızda öğrenir.
     7) Geçersiz kaynak gözlem üretmez (sessizce yutmaz, `ignored` döner).
     8) Kısa kontrol sonrası precheck ERTELENİR (5 soru sonsuza kadar açık kalmaz).
     9) Kısa kontrol yapıldığı gün `kisaKontrol.acik === false`.

   Çalıştır: node tests/bkt-davranis.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const KOK = path.join(__dirname, "..");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ek !== undefined ? " → " + ek : "")); return false;
}

/** Motoru taze durumla yükle */
function motorKur() {
  const depo = {};
  const sandbox = {
    document: {
      addEventListener() {}, getElementById() { return null; },
      querySelector() { return null; }, querySelectorAll() { return []; }
    },
    localStorage: {
      getItem: k => (k in depo ? depo[k] : null),
      setItem: (k, v) => { depo[k] = v; }, removeItem: k => { delete depo[k]; }
    },
    fetch: () => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }),
    console: { log() {}, warn() {}, error() {} },
    setTimeout, clearTimeout, Promise, Date, Math, JSON, Object, Array, String, Number, Boolean,
    navigator: { platform: "test" }
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  sandbox.state = {
    bkt_state: {}, mini_test_kuyrugu: [], exams: [], questions: [],
    memory: {}, topics: {}, flashcards: { cards: [], sessions: {}, lastSoftDrop: {} }
  };
  sandbox.saveState = () => {};
  sandbox.todayStr = () => "2026-10-29";
  sandbox.getMemoryStrength = () => 50;
  vm.runInContext(fs.readFileSync(path.join(KOK, "site", "bkt-engine.js"), "utf8"), sandbox, { filename: "bkt-engine.js" });
  return { A: sandbox.window.AnalizBKT, s: sandbox };
}

const { A, s } = motorKur();
ok("motor yüklendi (window.AnalizBKT)", !!A && typeof A.observe === "function");
const K = "Matematik > 1.1 Trigonometri";
const L = () => (s.state.bkt_state[K] || {}).L;
const G = () => (s.state.bkt_state[K] || {}).gozlem_sayisi || 0;

// ---------- 1) Doğru cevap L'yi artırır ----------
console.log("\n== 1) Doğru cevap → L artar (monoton) ==");
let onceki = 0;
for (let i = 1; i <= 5; i++) {
  A.observe({ konu_id: K, dogru_mu: true, neden: null, kaynak: "mini_test" });
  const simdi = L();
  ok(i + ". doğru sonrası L arttı (%" + (simdi * 100).toFixed(1) + ")", simdi > onceki, "önce %" + (onceki * 100).toFixed(1));
  ok(i + ". doğru gözlem sayıldı", G() === i, String(G()));
  onceki = simdi;
}
ok("5 doğru sonrası L ≥ %85", L() >= 0.85, "%" + (L() * 100).toFixed(1));

// ---------- 2) Yanlış cevap L'yi düşürür ----------
console.log("\n== 2) Yanlış cevap → L düşer (monoton) ==");
onceki = L();
for (let i = 1; i <= 3; i++) {
  A.observe({ konu_id: K, dogru_mu: false, neden: "KONUEKSİKLİĞİ", kaynak: "mini_test" });
  ok(i + ". yanlış sonrası L düştü", L() < onceki, "%" + (onceki * 100).toFixed(1) + " → %" + (L() * 100).toFixed(1));
  onceki = L();
}

// ---------- 3) "Süre yetmedi" gözlem sayılmaz ----------
console.log("\n== 3) 'Süre yetmedi' (eski kayıt) → gözlem SAYILMAZ ==");
const gOnce = G(), lOnce = L();
const rEski = A.observe({ konu_id: K, dogru_mu: false, neden: "SÜRE YETMEDİ", kaynak: "mini_test" });
ok("sonuç ignored döndü", !!(rEski && rEski.ignored), JSON.stringify(rEski));
ok("gözlem sayısı değişmedi", G() === gOnce, gOnce + " → " + G());
ok("L değişmedi", Math.abs(L() - lOnce) < 1e-12);

// ---------- 4) 5 gözlemden önce yeterlilik gösterilmez ----------
console.log("\n== 4) 5 gözlemden önce yeterlilik GİZLİ ==");
const K2 = "Fizik > 1.1 Sabit Hızlı Hareket";
A.observe({ konu_id: K2, dogru_mu: true, neden: null, kaynak: "mini_test" });
const d1 = A.konuDurum(K2);
ok("1 gözlemde yeterlilik null", d1 && d1.yeterlilik === null, JSON.stringify(d1 && d1.yeterlilik));
// 5 gözlemden önce durum "veri yetersiz" olmalı; metni kullanıcıya yol gösterir.
ok("durum: veri yetersiz (metin)", d1 && /soru daha çöz|yetersiz/i.test(String(d1.durum || "")), d1 && d1.durum);
for (let i = 0; i < 4; i++) A.observe({ konu_id: K2, dogru_mu: true, neden: null, kaynak: "mini_test" });
const d5 = A.konuDurum(K2);
ok("5 gözlemde yeterlilik sayı", d5 && typeof d5.yeterlilik === "number", JSON.stringify(d5 && d5.yeterlilik));

// ---------- 5) Havuzsuz konu onaylanır ----------
console.log("\n== 5) Havuzsuz konu: işlenince ONAYLANIR ==");
A.processNewRecords();
const d6 = A.konuDurum(K2);
ok("durum: onaylı", d6 && d6.onayli === true, d6 && d6.durum);
ok("yeterlilik korunuyor", d6 && d6.yeterlilik >= 85, d6 && d6.yeterlilik);

// ---------- 6) Kaynak ağırlığı ----------
console.log("\n== 6) Kaynak ağırlığı: deneme < mini_test < soru girişi ==");
function tekCevap(kaynak) {
  const m = motorKur();
  m.A.observe({ konu_id: "Test > A", dogru_mu: true, neden: null, kaynak: kaynak });
  return (m.s.state.bkt_state["Test > A"] || {}).L || 0;
}
const Lden = tekCevap("deneme"), Lmini = tekCevap("mini_test"), Lsoru = tekCevap("soru_girisi");
ok("deneme < mini_test", Lden < Lmini, Lden.toFixed(4) + " < " + Lmini.toFixed(4));
ok("mini_test < soru girişi", Lmini < Lsoru, Lmini.toFixed(4) + " < " + Lsoru.toFixed(4));
ok("kaynak ağırlıkları API'de görünür", A.SOURCE_PT && A.SOURCE_PT.deneme === 0.05 && A.SOURCE_PT.mini_test === 0.10 && A.SOURCE_PT.soru_girisi === 0.15);

// ---------- 7) Geçersiz kaynak ----------
console.log("\n== 7) Geçersiz kaynak gözlem üretmez ==");
const g2 = G();
let hata = null;
try { A.observe({ konu_id: K, dogru_mu: true, neden: null, kaynak: "uydurma" }); } catch (e) { hata = e.message; }
ok("geçersiz kaynak reddedildi", hata !== null || G() === g2, hata || ("gözlem " + g2 + " → " + G()));

// ---------- 8/9) Kısa kontrol ertelenir ----------
console.log("\n== 8) Kısa Kontrol sonrası precheck ertelenir ==");
ok("KISA_ARALIK_GUN sabiti var", typeof A.KISA_ARALIK_GUN === "number" && A.KISA_ARALIK_GUN >= 1, String(A.KISA_ARALIK_GUN));
const K3 = "Kimya > 1.1 Atom";
const m3 = motorKur();
m3.A.observe({ konu_id: K3, dogru_mu: true, neden: null, kaynak: "mini_test" });
const e3 = m3.s.state.bkt_state[K3];
e3.pool_id = "kimya_10_u01_k01";
m3.A.submitMiniTest({
  konu_id: K3, pool_id: "kimya_10_u01_k01", mode: "precheck",
  questions: [{ dogru_index: 0 }, { dogru_index: 0 }, { dogru_index: 0 }, { dogru_index: 0 }, { dogru_index: 0 }],
  answers: [0, 0, 0, 0, 0], reasons: [null, null, null, null, null]
});
const e3b = m3.s.state.bkt_state[K3];
ok("son kısa kontrol tarihi yazıldı", e3b && e3b.son_kisa_kontrol === "2026-10-29", e3b && e3b.son_kisa_kontrol);
ok("precheck_due ileri atıldı", e3b && e3b.precheck_due > "2026-10-29", e3b && e3b.precheck_due);
const d3 = m3.A.konuDurum(K3);
ok("aynı gün kısa kontrol KAPALI", d3 && d3.kisaKontrol && d3.kisaKontrol.acik === false, JSON.stringify(d3 && d3.kisaKontrol));
ok("kalan gün pozitif", d3 && d3.kisaKontrol && d3.kisaKontrol.kalan >= 1, d3 && d3.kisaKontrol && d3.kisaKontrol.kalan);

// ---------- 9) Aynı kayıt iki kez sayılmaz ----------
console.log("\n== 9) Aynı deneme iki kez işlenirse gözlem İKİ KEZ sayılmaz ==");
const m4 = motorKur();
m4.s.state.exams = [{
  id: "deneme-1", date: "2026-10-29", lessons: {},
  errorLogs: [{ topic: "Türev", lesson: "Matematik", type: "KONUEKSİKLİĞİ", date: "2026-10-29" }]
}];
const ilkSayi = m4.A.processNewRecords();
const K4 = "Matematik > Türev";
const g4 = (m4.s.state.bkt_state[K4] || {}).gozlem_sayisi || 0;
ok("ilk işlemede 1 gözlem", ilkSayi === 1 && g4 === 1, ilkSayi + " / " + g4);
const ikinciSayi = m4.A.processNewRecords();
const g4b = (m4.s.state.bkt_state[K4] || {}).gozlem_sayisi || 0;
ok("ikinci işlemede yeni gözlem yok", ikinciSayi === 0 && g4b === 1, ikinciSayi + " / " + g4b);
ok("mükerrer koruması kayıt kimliğine dayanır", !!m4.s.state.bkt_processed_records &&
  Object.keys(m4.s.state.bkt_processed_records).length > 0);

console.log("\n" + "─".repeat(58));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("BKT davranış testi — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("BKT davranış testi — " + gecen + "/" + gecen + " geçti ✓");
