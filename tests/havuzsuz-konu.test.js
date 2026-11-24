#!/usr/bin/env node
/* ============================================================
   HAVUZU OLMAYAN KONU — DAVRANIŞ TESTİ (tests/havuzsuz-konu.test.js)
   ------------------------------------------------------------
   Kullanıcı (v76): "Havuz yok ise direkt kart veya soru düğmesi
   olmasın, açılmasın. ... kart açılıyor ve soru havuzu yok diyor
   böyle olunca o kart kapatılmıyor."

   KANITLANANLAR (kod metni aranmaz, motor çalıştırılır):
     1) __havuzVarMi manifest yüklenmeden null döner (düğme gizlenmez)
     2) manifest yüklendikten sonra havuzsuz konu için false,
        havuzlu konu için true döner
     3) Havuzsuz konuda kısa kontrol (openMiniTest) penceresi AÇILMAZ
     4) Kartı olmayan konuda kart penceresi HİÇ AÇILMAZ ve
        AmKart.ac() {ok:false} döner — ekranda kilitli pencere kalmaz
     5) index.html'de "soru havuzu yok" metni KALMADI; 9. sınıf
        ağacında "YAKINDA" rozeti var

   Çalıştır: node tests/havuzsuz-konu.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const KOK = path.join(__dirname, "..");
const BKT_KAYNAK = fs.readFileSync(path.join(KOK, "site", "bkt-engine.js"), "utf8");
const KART_KAYNAK = fs.readFileSync(path.join(KOK, "site", "kart.js"), "utf8");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) { gecen++; return true; } kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false; }
function esit(ad, gelen, beklenen) {
  return ok(ad, JSON.stringify(gelen) === JSON.stringify(beklenen),
    "gelen: " + JSON.stringify(gelen) + " · beklenen: " + JSON.stringify(beklenen));
}

// ------------------------------------------------------------
// SAHTE DOM (motorun gerçekten dokunduğu kadar)
// ------------------------------------------------------------
function eleman(id) {
  const el = {
    id: id || "", style: { cssText: "", display: "" }, className: "", dataset: {},
    _html: "", children: [], removed: false,
    get innerHTML() { return this._html; },
    set innerHTML(v) { this._html = String(v); },
    appendChild(c) { this.children.push(c); return c; },
    remove() { this.removed = true; },
    querySelector() { return { textContent: "", value: "", style: {} }; },
    querySelectorAll() { return []; },
    addEventListener() {}, setAttribute() {}, removeAttribute() {}, focus() {},
    closest() { return null; }
  };
  return el;
}

function ortamKur(secenek) {
  const ayar = secenek || {};
  const elemanlar = {};
  const body = eleman("body");
  const dinleyiciler = { click: [], change: [], keydown: [] };
  const toasts = [];

  const head = eleman("head");
  const document = {
    readyState: "complete",
    body: body,
    head: head,
    getElementById(id) { return elemanlar[id] || null; },
    createElement() { return eleman(); },
    querySelectorAll() { return []; },
    addEventListener(tur, fn) { if (dinleyiciler[tur]) dinleyiciler[tur].push(fn); },
    removeEventListener() {}
  };
  const gercekAppend = body.appendChild.bind(body);
  body.appendChild = function (c) { if (c && c.id) elemanlar[c.id] = c; return gercekAppend(c); };
  head.appendChild = function (c) { if (c && c.id) elemanlar[c.id] = c; return c; };

  const durum = {
    user: { name: "TEST", grade: ayar.sinif || "9" },
    exams: [], questions: [], topics: {},
    bkt_state: ayar.bkt_state || {},
    bkt_processed_records: {},
    flashcards: { cards: [], sessions: {}, lastSoftDrop: {} },
    tekrarKartlari: {},
    mini_test_kuyrugu: [], mini_test_sessions: {},
    soru_havuzu_gosterim_logu: [],
    settings: {}
  };

  const havuzlar = ayar.havuzlar || {};
  const fetch = function (url) {
    const u = decodeURIComponent(String(url));
    if (u.indexOf("index.json") >= 0) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ havuzlar: ayar.manifest || [] }) });
    }
    const m = u.match(/soru_havuzlari\/([^/?]+)\.json/);
    const id = m ? m[1] : "";
    if (id && havuzlar[id]) return Promise.resolve({ ok: true, json: () => Promise.resolve(havuzlar[id]) });
    return Promise.resolve({ ok: false, json: () => Promise.resolve(null) });
  };

  const sandbox = {
    console: { log() {}, warn() {}, error() {} },
    setTimeout, clearTimeout, setInterval, clearInterval,
    Date, Math, JSON, Object, Array, Number, String, Boolean,
    Promise, Set, Map, RegExp, Error, isNaN, parseInt, parseFloat,
    encodeURIComponent, decodeURIComponent,
    document, state: durum, currentPage: "knowledge",
    localStorage: { getItem() { return null; }, setItem() {} },
    saveState() {}, toast(m) { toasts.push(String(m)); }, navigate() {},
    addNotification() {}, daysLeftToExam: () => 30, todayStr: () => "2026-11-17",
    calculatePriority: () => 1, getMemoryStrength: () => 50,
    lucide: { createIcons() {} }, fetch,
    GV: { html: () => "", dogrula: () => [] }
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  return { sandbox, document, elemanlar, toasts, dinleyiciler, durum };
}

// ------------------------------------------------------------
// VERİ
// ------------------------------------------------------------
const HAVUZ = {
  konu_id: "mat_10_u01_k01",
  sinif: 10,
  ders: "Matematik",
  baslik: "1.1 Dik Üçgende Trigonometrik Oranlar",
  topic_key: "Matematik > 1.1 Dik Üçgende Trigonometrik Oranlar",
  sorular: Array.from({ length: 10 }, (_, i) => ({
    soru_id: "mat_10_u01_k01_o" + String(i + 1).padStart(2, "0"),
    alt_beceri: "test",
    metin: "Soru " + (i + 1),
    secenekler: ["A", "B", "C", "D"],
    dogru_index: 1,
    cozum: "Çözüm " + (i + 1),
    zorluk: "deneme",
    flashcard: { front: "Kart " + (i + 1) + " ön", back: "Kart " + (i + 1) + " arka" }
  }))
};
const MANIFEST = [{
  konu_id: HAVUZ.konu_id, ders: HAVUZ.ders, sinif: 10,
  topic_key: HAVUZ.topic_key, baslik: HAVUZ.baslik, soru_sayisi: 10
}];

// ============================================================
console.log("\n== 1) __havuzVarMi üç durumlu ==");
(async () => {
  const o = ortamKur({ sinif: "10", manifest: MANIFEST, havuzlar: { [HAVUZ.konu_id]: HAVUZ } });
  vm.runInContext(BKT_KAYNAK, o.sandbox);

  ok("__havuzVarMi tanımlı", typeof o.sandbox.__havuzVarMi === "function");
  // manifest henüz yüklenmedi → karar verilemez
  esit("manifest yüklenmeden → null (bilinmiyor)", o.sandbox.__havuzVarMi("Matematik > 9.9 Olmayan Konu"), null);

  const A = o.sandbox.AnalizBKT;
  await A.loadPoolManifest();
  esit("havuzu olan konu → true", o.sandbox.__havuzVarMi(HAVUZ.topic_key), true);
  esit("havuzu olmayan konu → false", o.sandbox.__havuzVarMi("Matematik > 9.9 Olmayan Konu"), false);
  // 9. sınıf konusu 10. sınıf havuzuna bağlanmaz → false
  esit("9. sınıf 'Yazım Kuralları' → false (sınıf kilidi)",
    o.sandbox.__havuzVarMi("Türk Dili ve Edebiyatı > Yazım Kuralları"), false);

  // v76 — SINIF KİLİDİ TÜM YOLLARDA: 9. sınıf öğrencisi, 10. sınıf havuzuyla
  // BİREBİR aynı konu adını görse bile havuz "var" sayılmaz (eskiden ilk iki
  // kural sınıf kilidini atlıyordu → 9. sınıfta düğme çiziliyordu).
  const o9 = ortamKur({ sinif: "9", manifest: MANIFEST, havuzlar: { [HAVUZ.konu_id]: HAVUZ } });
  vm.runInContext(BKT_KAYNAK, o9.sandbox);
  await o9.sandbox.AnalizBKT.loadPoolManifest();
  esit("9. sınıf + birebir aynı konu adı → false", o9.sandbox.__havuzVarMi(HAVUZ.topic_key), false);
  const kd9 = o9.sandbox.AnalizBKT.konuDurum(HAVUZ.topic_key) || {};
  esit("9. sınıf resolvePoolId → null", kd9.poolId || null, null);

  // ----------------------------------------------------------
  console.log("\n== 2) Havuzsuz konuda kısa kontrol AÇILMAZ ==");
  const o2 = ortamKur({ manifest: MANIFEST, havuzlar: { [HAVUZ.konu_id]: HAVUZ } });
  vm.runInContext(BKT_KAYNAK, o2.sandbox);
  await o2.sandbox.AnalizBKT.loadPoolManifest();
  o2.sandbox.AnalizBKT.openMiniTest("Matematik > 9.9 Olmayan Konu", null, { mode: "learning" });
  await new Promise(r => setTimeout(r, 20));
  ok("test penceresi açılmadı", !o2.elemanlar["bkt-test-modal"],
    Object.keys(o2.elemanlar).join(","));
  ok("kullanıcıya 'başka konunun sorusu gösterilmez' uyarısı", o2.toasts.some(t => /havuz/.test(t)),
    o2.toasts.join(" | "));

  // ----------------------------------------------------------
  console.log("\n== 3) Kartı olmayan konuda kart penceresi AÇILMAZ ==");
  const o3 = ortamKur({ manifest: MANIFEST, havuzlar: { [HAVUZ.konu_id]: HAVUZ } });
  o3.sandbox.AnalizBKT = { konuDurum: () => null };      // havuz yok
  vm.runInContext(KART_KAYNAK, o3.sandbox);
  const K = o3.sandbox.AmKart;
  ok("AmKart yüklendi", !!K && typeof K.ac === "function");
  const r = await K.ac("Türk Dili ve Edebiyatı > Paragraf", { tekrar: true });
  esit("ac() → ok:false, kartSayisi:0", { ok: r && r.ok, kartSayisi: r && r.kartSayisi },
    { ok: false, kartSayisi: 0 });
  ok("kart penceresi DOM'a EKLENMEDİ (kilitli pencere yok)", !o3.elemanlar["kart-modal"],
    Object.keys(o3.elemanlar).join(","));

  // kartı olan konuda pencere açılır ve kapatma düğmesi vardır
  const o4 = ortamKur({ manifest: MANIFEST, havuzlar: { [HAVUZ.konu_id]: HAVUZ } });
  o4.sandbox.AnalizBKT = { konuDurum: () => ({ poolId: HAVUZ.konu_id }), loadPool: () => Promise.resolve(HAVUZ) };
  vm.runInContext(KART_KAYNAK, o4.sandbox);
  const r4 = await o4.sandbox.AmKart.ac(HAVUZ.topic_key, { tekrar: true });
  ok("kartı olan konuda pencere açıldı", !!(r4 && r4.ok), JSON.stringify(r4));
  const modal4 = o4.elemanlar["kart-modal"];
  ok("pencere DOM'a eklendi", !!modal4);
  const kutu4 = modal4 && modal4.children && modal4.children[0];
  ok("kapatma düğmesi çizildi (×)", !!(kutu4 && /data-kart-kapat/.test(kutu4.innerHTML || "")),
    kutu4 ? String(kutu4.innerHTML).slice(0, 80) : "kutu yok");

  // ----------------------------------------------------------
  console.log("\n== 4) Ekran metinleri ve ağaç rozeti ==");
  // Yalnız YORUMLARI ayıkla: kullanıcıya giden metin HTML dizelerinde kalır.
  const GORUNUR = HTML.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
  ok("'soru havuzu yok' metni KALMADI", GORUNUR.indexOf("soru havuzu yok") < 0,
    (GORUNUR.match(/.{0,60}soru havuzu yok.{0,60}/) || [""])[0]);
  ok("'5. adım atlanır' metni KALMADI", GORUNUR.indexOf("5. adım atlanır") < 0,
    (GORUNUR.match(/.{0,60}5\. adım atlanır.{0,60}/) || [""])[0]);
  ok("'Bu konudan 5 soru çöz' düğmesi havuz şartına bağlı",
    /konuHavuzuVar\(topicKey\) !== false/.test(GORUNUR));
  ok("'5 soruluk kontrole başla' düğmesi havuz şartına bağlı",
    /adimBitti && kontrolHavuz/.test(HTML));
  ok("yol haritası '4 adım' yazabiliyor", HTML.indexOf('(besAdim ? "5" : "4")') >= 0);
  ok("9. sınıf için YAKINDA rozeti var", HTML.indexOf("YAKINDA") >= 0);
  ok("rozet yalnız 9. sınıfta", /String\(state\.user\.grade \|\| "9"\) === "9"/.test(HTML));
  ok("soru düğmesi havuz şartına bağlı", /konuHavuzuVar\(topicKey\) !== false/.test(HTML));
  ok("kart düğmesi havuz/kart şartına bağlı", /const kartVar = /.test(HTML));

  console.log("\n" + "─".repeat(56));
  if (kalan) {
    hatalar.forEach(h => console.log(" ✗ " + h));
    console.log("havuzsuz konu testi — " + gecen + " geçti, " + kalan + " kaldı ✗");
    process.exit(1);
  }
  console.log("havuzsuz konu testi — " + gecen + "/" + gecen + " geçti ✓");
})().catch(e => {
  console.error("TEST ÇÖKTÜ:", e && e.stack || e);
  process.exit(1);
});
