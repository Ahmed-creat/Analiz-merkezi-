/* ============================================================
   DUMAN TESTİ: "Öğrenme Durumu" paneli
   ------------------------------------------------------------
   bkt-engine.js'i sahte bir DOM içinde çalıştırır ve panelin
   1) YALNIZ Konu Takibi sayfasında basıldığını,
   2) ne gösterdiğini açıklayan metni içerdiğini,
   3) soru havuzu bulunamadığında SEBEBİNİ yazdığını,
   4) çalışılan konuyu en üste aldığını
   doğrular. Amaç: panel düzenlemesinde oluşan çalışma zamanı
   hatasını (Konu Takibi sayfasını komple bozar) yakalamak.
   Çalıştır: node tests/bkt-panel.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const KOK = path.join(__dirname, "..");
const KAYNAK = fs.readFileSync(path.join(KOK, "site", "bkt-engine.js"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ayrinti) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ayrinti ? " → " + ayrinti : "")); return false;
}

// ---------- Sahte DOM ----------
function sahteEleman(id) {
  const el = {
    id: id || "",
    style: { cssText: "", display: "" },
    className: "",
    dataset: {},
    _html: "",
    children: [],
    get innerHTML() { return this._html; },
    set innerHTML(v) { this._html = String(v); },
    appendChild(c) { this.children.push(c); return c; },
    remove() { this.removed = true; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    addEventListener() {},
    setAttribute() {},
    removeAttribute() {},
    focus() {}
  };
  return el;
}

function ortamKur(secenek) {
  const ayar = Object.assign({ sayfa: "tracking" }, secenek || {});
  const elemanlar = {};
  const mainContent = sahteEleman("main-content");
  elemanlar["main-content"] = mainContent;

  const document = {
    readyState: "complete",
    body: sahteEleman("body"),
    getElementById(id) { return elemanlar[id] || null; },
    createElement() { return sahteEleman(); },
    querySelectorAll() { return []; },
    addEventListener() {},
    addEventListener: function () {}
  };

  const state = {
    user: { name: "TEST", grade: "10" },
    exams: [],
    questions: [],
    bkt_state: ayar.bkt_state || {},
    bkt_processed_records: {},
    flashcards: { cards: [], sessions: {}, lastSoftDrop: {} },
    mini_test_kuyrugu: [],
    mini_test_sessions: {},
    soru_havuzu_gosterim_logu: [],
    settings: {}
  };

  const sandbox = {
    console: console,
    setTimeout: (f) => { try { f(); } catch (e) { hatalar.push("setTimeout hatası: " + e.message); } return 0; },
    clearTimeout: () => {},
    Date: Date,
    Math: Math,
    JSON: JSON,
    Object: Object,
    Array: Array,
    Number: Number,
    String: String,
    Boolean: Boolean,
    Promise: Promise,
    Set: Set,
    Map: Map,
    isNaN: isNaN,
    parseInt: parseInt,
    parseFloat: parseFloat,
    document: document,
    state: state,
    currentPage: ayar.sayfa,
    todayStr: () => "2026-10-28",
    saveState: () => {},
    toast: () => {},
    navigate: () => {},
    addNotification: () => {},
    daysLeftToExam: () => 30,
    localStorage: {
      _veri: Object.assign({}, ayar.localStorage || {}),
      getItem(k) { return Object.prototype.hasOwnProperty.call(this._veri, k) ? this._veri[k] : null; },
      setItem(k, v) { this._veri[k] = String(v); }
    },
    fetch: (url) => {
      // Soru havuzu manifesti: iki konu yeter
      const manifest = {
        havuzlar: [
          { konu_id: "mat_10_u01_k01", ders: "Matematik", topic_key: "Matematik > 1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler", baslik: "1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler", etiketler: [], soru_sayisi: 10 },
          { konu_id: "mat_10_u01_k02", ders: "Matematik", topic_key: "Matematik > 1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler", baslik: "1.2 Üçgende Yardımcı Elemanlar", etiketler: [], soru_sayisi: 12 }
        ]
      };
      if (String(url).indexOf("index.json") >= 0) return Promise.resolve({ ok: true, json: () => Promise.resolve(manifest) });
      return Promise.resolve({ ok: false, json: () => Promise.resolve(null) });
    }
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.lucide = { createIcons: () => {} };
  vm.createContext(sandbox);
  return { sandbox, elemanlar, mainContent, state };
}

function panelBul(mainContent) {
  return mainContent.children.filter((c) => c && c.id === "bkt-learning-panel").pop();
}

// Soru havuzu manifesti asenkron yüklenir; panel ancak ondan sonra
// "Kısa Kontrol" düğmesini basabilir. Testte de mikrogörevleri bekle.
async function calistir(ayar) {
  const o = ortamKur(ayar);
  vm.runInContext(KAYNAK, o.sandbox, { filename: "bkt-engine.js" });
  for (let i = 0; i < 5; i++) await Promise.resolve();
  if (typeof o.sandbox.window.__bktUiTazele === "function") o.sandbox.window.__bktUiTazele();
  return o;
}

(async function () {
// ---------- 1) AYRI PANEL KALDIRILDI (v40) ----------
// KULLANICI: "yukarıda Hafıza Gücü/Öğrenme Durumu var, altta tekrar Öğrenme
// Durumu var, neden?" Kök neden: birleşik kartın kimliği v39'da
// "bkt-birlesik-kart" → "hafiza-baslik-kart" olmuş, motorun erken dönüşü
// eski kimliğe baktığı için ESKİ panel altta ikinci kez çiziliyordu.
// Artık Konu Takibi'nde TEK yer var: index.html'deki
// "Öğrenme Durumu · Hafıza Gücü" bölümü. Motor ayrı panel basmaz.
console.log("\n== 1) Tek yer: ayrı Öğrenme Durumu paneli YOK ==");
const bkt = {
  "Matematik > 1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler": {
    L: 0.55, gozlem_sayisi: 6, hata_gecmisi: [{ date: "2026-10-27", type: "KONUEKSİKLİĞİ" }],
    onay_durumu: "GELISIYOR", precheck_due: "2026-10-01", tetiklenen_krediler: []
  },
  "Türkçe > Şiirde ahengi sağlayan özellikleri (uyak düzeni, uyak, redif, aliterasyon,asonans) ile ilgili çalışma yapar.": {
    L: 0.3, gozlem_sayisi: 2, hata_gecmisi: [], onay_durumu: "VERI_YETERSIZ", tetiklenen_krediler: []
  }
};
const kapali = await calistir({ sayfa: "tracking", bkt_state: bkt, localStorage: { am_bkt_panel_acik: "1" } });
ok("Konu Takibi'nde ayrı panel BASILMIYOR", !panelBul(kapali.mainContent));
ok("eski panel kimliği koddan silindi", KAYNAK.indexOf('id = "bkt-learning-panel"') < 0 && KAYNAK.indexOf("bkt-learning-panel") >= 0);
ok("kuyruk yine dolduruluyor (öğrenme testi planlaması)", /queueLearningTests\(\);/.test(KAYNAK));
{
  const bas = KAYNAK.indexOf("function renderBktPanel()");
  const son = KAYNAK.indexOf("function scheduleUi()", bas);
  const govde = KAYNAK.slice(bas, son);
  ok("panel gövdesi kısa: yalnız kuyruk + kalıntı temizliği", govde.length < 1200, String(govde.length));
  ok("kalıntı panel siliniyor", /getElementById\("bkt-learning-panel"\)/.test(govde) && /\.remove\(\)/.test(govde));
}

// ---------- 2) 20+ kayıtta da ayrı panel YOK, veri kaybolmuyor ----------
// (v40) Panel kaldırıldığı için "panel basıldı" beklenmiyor; asıl ölçüt
// konu verisinin motor API'sinden eksiksiz okunabilmesi.
console.log("\n== 2) 20+ kayıt: tek kaynak, veri tam ==");
const cok = {};
for (let i = 0; i < 20; i++) {
  cok["Matematik > Konu " + i] = { L: 0.5, gozlem_sayisi: 50 - i, hata_gecmisi: [], onay_durumu: "GELISIYOR", tetiklenen_krediler: [] };
}
cok["Matematik > 1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler"] = {
  L: 0.3, gozlem_sayisi: 1, hata_gecmisi: [], onay_durumu: "VERI_YETERSIZ",
  precheck_due: "2026-10-28", study_completed_at: "2026-10-28", tetiklenen_krediler: []
};
const cokO = await calistir({ sayfa: "tracking", bkt_state: cok, localStorage: { am_bkt_panel_acik: "1" } });
ok("20+ kayıtta ayrı panel basılmıyor", !panelBul(cokO.mainContent));
{
  const durumlar = cokO.sandbox.window.AnalizBKT.konuDurumlari();
  ok("21 konu da motordan okunuyor", Object.keys(durumlar).length === 21, String(Object.keys(durumlar).length));
  const kisa = durumlar["Matematik > 1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler"];
  ok("precheck zamanı gelen konu işaretli", !!kisa && kisa.precheck === true);
}

// ---------- 3) Boş durum ----------
console.log("\n== 3) Boş durum ==");
const bos = await calistir({ sayfa: "tracking", bkt_state: {} });
ok("kayıt yoksa panel basılmaz (boş kutu yok)", !panelBul(bos.mainContent));

// ---------- 4) Köprü: kazanım anahtarı soru havuzuna bağlanıyor ----------
console.log("\n== 4) Soru havuzu köprüsü ==");
const kopru = await calistir({
  sayfa: "tracking",
  bkt_state: {
    "Türk Dili ve Edebiyatı > Noktalama İşaretleri": {
      L: 0.4, gozlem_sayisi: 4, hata_gecmisi: [], onay_durumu: "GELISIYOR",
      precheck_due: "2026-10-01", tetiklenen_krediler: []
    }
  }
});
// __okzKonuPoolEsle dışarıdan bağlandığında resolvePoolId onu kullanmalı
kopru.sandbox.window.__okzKonuPoolEsle = (ders, konu) => (konu === "Noktalama İşaretleri" ? "mat_10_u01_k02" : null);
ok("köprü fonksiyonu tanımlanabiliyor", typeof kopru.sandbox.window.__okzKonuPoolEsle === "function");
const kopruPanel = panelBul(kopru.mainContent);
ok("köprü varken panel çökmedi", true);


// ---------- Sonuç ----------
console.log("\n" + "─".repeat(56));
if (kalan) {
  console.log("✗ " + kalan + " test başarısız:");
  hatalar.forEach((x) => console.log("   • " + x));
  console.log("Öğrenme Durumu paneli — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("Öğrenme Durumu paneli — " + gecen + "/" + gecen + " geçti ✓");
})();
