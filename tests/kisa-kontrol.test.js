#!/usr/bin/env node
/* ============================================================
   KISA KONTROL — DAVRANIŞ TESTİ  (tests/kisa-kontrol.test.js)
   ------------------------------------------------------------
   Neyi KANITLIYOR? (kod metni aramak değil, motoru çalıştırmak)

     1) Kısa Kontrol = 5 soru (precheck modunda da 3 değil)
     2) Sorular TEK TEK gösterilir (ekranda aynı anda tek soru)
     3) Sorular YALNIZ o konunun havuzundan gelir:
        • eski sürümden kalmış YANLIŞ pool_id yok sayılır
        • benzer adlı başka konunun havuzuna DÜŞÜLMEZ
        • havuz yoksa test AÇILMAZ (başka konunun sorusu gösterilmez)
     4) Sonuç ekranı KENDİLİĞİNDEN kapanmaz (1.3 sn hatası geri gelmesin)

   Çalıştır: node tests/kisa-kontrol.test.js
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
function esit(ad, gelen, beklenen) {
  return ok(ad, JSON.stringify(gelen) === JSON.stringify(beklenen), "gelen: " + JSON.stringify(gelen) + " · beklenen: " + JSON.stringify(beklenen));
}
const bekle = (ms) => new Promise(r => setTimeout(r, ms || 0));

// ------------------------------------------------------------
// SAHTE DOM — motorun gerçekten dokunduğu kadar
// ------------------------------------------------------------
function sahteEleman(id) {
  const el = {
    id: id || "",
    style: { cssText: "", display: "" },
    className: "",
    dataset: {},
    _html: "",
    children: [],
    removed: false,
    get innerHTML() { return this._html; },
    set innerHTML(v) { this._html = String(v); },
    appendChild(c) { this.children.push(c); return c; },
    remove() { this.removed = true; },
    querySelector(sel) {
      // Neden seçimi ekranındaki <select> gerçek DOM'da yok; kullanıcı
      // "Konu eksiği" seçmiş gibi davran.
      if (String(sel).indexOf("data-bkt-reason") >= 0) return { value: "KONUEKSİKLİĞİ", textContent: "" };
      return { textContent: "", value: "", style: {} };
    },
    querySelectorAll() { return []; },
    addEventListener() {},
    setAttribute() {},
    removeAttribute() {},
    focus() {},
    closest() { return null; }
  };
  return el;
}

function ortamKur(secenek) {
  const ayar = secenek || {};
  const elemanlar = {};
  const mainContent = sahteEleman("main-content");
  elemanlar["main-content"] = mainContent;
  const body = sahteEleman("body");
  const dinleyiciler = { click: [], change: [] };
  const toasts = [];

  const document = {
    readyState: "complete",
    body: body,
    getElementById(id) { return elemanlar[id] || null; },
    createElement() { return sahteEleman(); },
    querySelectorAll() { return []; },
    addEventListener(tur, fn) { if (dinleyiciler[tur]) dinleyiciler[tur].push(fn); }
  };
  // body.appendChild → getElementById bulabilsin
  const gercekAppend = body.appendChild.bind(body);
  body.appendChild = function (c) { if (c && c.id) elemanlar[c.id] = c; return gercekAppend(c); };

  const durum = {
    user: { name: "TEST ÖĞRENCİ", grade: "10" },
    exams: [],
    questions: [],
    topics: {},
    bkt_state: ayar.bkt_state || {},
    bkt_processed_records: {},
    flashcards: { cards: [], sessions: {}, lastSoftDrop: {} },
    mini_test_kuyrugu: [],
    mini_testSessions: {},
    mini_test_sessions: {},
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
    console: { log: console.log, warn() {}, error() {} },
    setTimeout, clearTimeout, setInterval, clearInterval,
    Date, Math, JSON, Object, Array, Number, String, Boolean,
    Promise, Set, Map, RegExp, Error, isNaN, parseInt, parseFloat,
    encodeURIComponent, decodeURIComponent,
    document, state: durum,
    currentPage: "tracking",
    localStorage: {
      _v: Object.assign({}, ayar.localStorage || {}),
      getItem(k) { return Object.prototype.hasOwnProperty.call(this._v, k) ? this._v[k] : null; },
      setItem(k, v) { this._v[k] = String(v); }
    },
    saveState() {},
    toast(msg) { toasts.push(String(msg)); },
    navigate() {},
    addNotification() {},
    daysLeftToExam: () => 30,
    todayStr: () => "2026-10-28",
    calculatePriority: () => 1,
    getMemoryStrength: () => 50,
    lucide: { createIcons() {} },
    fetch
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  // Görsel motoru: gerçek SVG üretmek yerine işaretli bir <svg>
  sandbox.GV = {
    html: (g) => '<svg data-test-gorsel="' + (g && g.tip ? g.tip : "?") + '"></svg>',
    dogrula: () => []
  };
  vm.createContext(sandbox);
  return { sandbox, document, elemanlar, mainContent, toasts, dinleyiciler, durum };
}

function tikla(ortam, secici) {
  const hedef = {
    dataset: {},
    closest(sel) { return sel === secici ? hedef : null; }
  };
  ortam.dinleyiciler.click.forEach(fn => fn({ target: hedef }));
  return hedef;
}
function degistir(ortam, deger) {
  const hedef = { value: String(deger), matches: (sel) => String(sel).indexOf("data-bkt-secim") >= 0 };
  ortam.dinleyiciler.change.forEach(fn => fn({ target: hedef }));
}
function dugme(ortam, selector, dataset) {
  const hedef = {
    dataset: dataset || {},
    closest(sel) { return sel === selector ? hedef : null; }
  };
  ortam.dinleyiciler.click.forEach(fn => fn({ target: hedef }));
  return hedef;
}

// ------------------------------------------------------------
// VERİ
// ------------------------------------------------------------
function havuzOlustur(prefix, adet, gorselli) {
  const sorular = [];
  for (let i = 0; i < adet; i++) {
    sorular.push({
      soru_id: prefix + "_o" + (i + 1),
      alt_beceri: prefix + " beceri",
      metin: prefix + " soru metni " + (i + 1),
      secenekler: ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği"],
      dogru_index: 1,                       // hep B → biz hep A işaretleyince yanlış olur
      cozum: prefix + " çözüm " + (i + 1),
      zorluk: "deneme",
      gorsel: gorselli && i === 0 ? { tip: "ucgen", kenarlar: { a: 1, b: 2 } } : undefined
    });
  }
  return {
    konu_id: prefix,
    ders: "Matematik",
    baslik: prefix + " başlık",
    topic_key: "Matematik > " + prefix,
    sorular: sorular,
    flashcards: []
  };
}

const POOL_A = havuzOlustur("mat_10_u01_k01", 12, true);
const POOL_B = havuzOlustur("mat_10_u01_k02", 12, false);
POOL_A.topic_key = "Matematik > 1.1 Trigonometri";
POOL_B.topic_key = "Matematik > 1.2 Yardımcı Elemanlar";

const MANIFEST = [
  { konu_id: "mat_10_u01_k01", ders: "Matematik", topic_key: "Matematik > 1.1 Trigonometri", baslik: "1.1 Trigonometri", etiketler: ["Yardımcı Elemanlar"], soru_sayisi: 12 },
  { konu_id: "mat_10_u01_k02", ders: "Matematik", topic_key: "Matematik > 1.2 Yardımcı Elemanlar", baslik: "1.2 Yardımcı Elemanlar", etiketler: ["Trigonometri"], soru_sayisi: 12 }
];

const KONU_A = "Matematik > 1.1 Trigonometri";
const KONU_B = "Matematik > 1.2 Yardımcı Elemanlar";
const KONU_C = "Matematik > 9.9 Var Olmayan Konu";       // havuzu yok
const KONU_D = "Matematik > Trigonometri Konusu";        // kelime benzeri, AYRI konu

function bkt(kayit) {
  return Object.assign({ L: 0.5, gozlem_sayisi: 6, hata_gecmisi: [], onay_durumu: "GELISIYOR", precheck_due: "2026-10-01", tetiklenen_krediler: [] }, kayit || {});
}

(async function () {
  // ==========================================================
  // 1) BİREBİR EŞLEME + 5 SORU + TEK SORU EKRANI
  // ==========================================================
  console.log("\n== 1) Kısa Kontrol: 5 soru, tek tek, yalnız bu konunun havuzu ==");
  const o1 = ortamKur({
    manifest: MANIFEST,
    havuzlar: { mat_10_u01_k01: POOL_A, mat_10_u01_k02: POOL_B },
    bkt_state: { [KONU_A]: bkt({ pool_id: "mat_10_u01_k01" }) }
  });
  vm.runInContext(KAYNAK, o1.sandbox, { filename: "bkt-engine.js" });
  await bekle(30);

  dugme(o1, "[data-bkt-test]", { bktTest: KONU_A, bktPool: "mat_10_u01_k01", bktMode: "precheck" });
  await bekle(30);
  const modal = o1.elemanlar["bkt-test-modal"];
  ok("test modalı açıldı", !!modal);
  if (modal) {
    esit("Kısa Kontrol 5 soru seçti (3 değil)", (modal._bktQuestions || []).length, 5);
    ok("tüm sorular bu konunun havuzundan", (modal._bktQuestions || []).every(q => q.soru_id.indexOf("mat_10_u01_k01") === 0));
    ok("başlık Kısa Kontrol", modal.innerHTML.indexOf("Kısa Kontrol") >= 0);
    ok("sıra göstergesi: Soru 1 / 5", modal.innerHTML.indexOf("Soru 1 / 5") >= 0);
    // Ekranda AYNI ANDA tek soru olmalı: 4 seçenek = tek soru (5 soru olsaydı 20)
    const secim = (modal.innerHTML.match(/data-bkt-secim/g) || []).length;
    esit("ekranda tek soru (4 seçenek)", secim, 4);
    ok("ileri düğmesi var", modal.innerHTML.indexOf("data-bkt-next") >= 0);
    ok("sonraki sorunun metni ekranda YOK", modal.innerHTML.indexOf("soru metni 2") < 0);
    ok("görselli soruda <svg> basıldı", modal.innerHTML.indexOf("<svg") >= 0);

    // --- cevapsız ilerlemeye izin verilmez ---
    dugme(o1, "[data-bkt-next]");
    await bekle(10);
    esit("cevapsız ilerlemek engellendi (1. soruda kalır)", modal._bktIdx, 0);
    ok("1. soru hâlâ ekranda", modal.innerHTML.indexOf("Soru 1 / 5") >= 0);
  }

  // --- cevap verip ilerle ---
  degistir(o1, 0);
  await bekle(5);
  dugme(o1, "[data-bkt-next]");
  await bekle(10);
  esit("2. soruya geçti", modal._bktIdx, 1);
  ok("ekranda Soru 2 / 5", modal.innerHTML.indexOf("Soru 2 / 5") >= 0);
  const secim2 = (modal.innerHTML.match(/data-bkt-secim/g) || []).length;
  esit("2. soruda da tek soru gösterildi", secim2, 4);
  ok("geri düğmesi 2. soruda var", modal.innerHTML.indexOf("data-bkt-prev") >= 0);

  // ==========================================================
  // 2) SONUÇ EKRANI KAPANMIYOR (1.3 sn hatası geri gelmesin)
  // ==========================================================
  console.log("\n== 2) Test bitişi: sonuç ekranı açık kalır ==");
  for (let i = 1; i < 5; i++) {
    degistir(o1, 0);
    await bekle(5);
    dugme(o1, "[data-bkt-next]");
    await bekle(10);
  }
  await bekle(20);
  ok("neden seçimi ekranı geldi (5 yanlış)", modal.innerHTML.indexOf("data-bkt-reason") >= 0);
  dugme(o1, "[data-bkt-finalize-test]");
  await bekle(20);
  ok("sonuç ekranı basıldı", modal.innerHTML.indexOf("Kısa Kontrol sonucu") >= 0, modal.innerHTML.slice(0, 120));
  ok("5 sorunun tamamı sonuçta listelendi", (modal.innerHTML.match(/\. Yanlış/g) || []).length === 5);
  await bekle(1500); // eski hata: setTimeout(closeMiniTest, 1300)
  ok("sonuç ekranı 1.5 sn sonra HÂLÂ AÇIK", modal.removed !== true && !!o1.elemanlar["bkt-test-modal"]);
  ok("kapat düğmesi var", modal.innerHTML.indexOf("data-bkt-close-test") >= 0);

  // ==========================================================
  // 3) ESKİ YANLIŞ pool_id YOK SAYILIR (B konusu)
  // ==========================================================
  console.log("\n== 3) Kayıtta yanlış havuz varsa doğrusu kullanılır ==");
  const o2 = ortamKur({
    manifest: MANIFEST,
    havuzlar: { mat_10_u01_k01: POOL_A, mat_10_u01_k02: POOL_B },
    bkt_state: { [KONU_B]: bkt({ pool_id: "mat_10_u01_k01" }) }   // ESKİ SÜRÜMÜN yanlış kaydı
  });
  vm.runInContext(KAYNAK, o2.sandbox, { filename: "bkt-engine.js" });
  await bekle(30);
  dugme(o2, "[data-bkt-test]", { bktTest: KONU_B, bktPool: "mat_10_u01_k01", bktMode: "precheck" });
  await bekle(30);
  const modal2 = o2.elemanlar["bkt-test-modal"];
  ok("B konusu için test açıldı", !!modal2);
  if (modal2) {
    ok("sorular B havuzundan (yanlış A kaydı yok sayıldı)",
      (modal2._bktQuestions || []).length > 0 && (modal2._bktQuestions || []).every(q => q.soru_id.indexOf("mat_10_u01_k02") === 0),
      (modal2._bktQuestions || []).map(q => q.soru_id).join(","));
    esit("yine 5 soru", (modal2._bktQuestions || []).length, 5);
  }

  // ==========================================================
  // 4) HAVUZU OLMAYAN KONU → TEST AÇILMAZ (başka konuya düşmez)
  // ==========================================================
  console.log("\n== 4) Havuz yoksa test açılmaz, başka konunun sorusu gelmez ==");
  const o3 = ortamKur({
    manifest: MANIFEST,
    havuzlar: { mat_10_u01_k01: POOL_A, mat_10_u01_k02: POOL_B },
    bkt_state: { [KONU_C]: bkt({ pool_id: "mat_10_u01_k01" }) }
  });
  vm.runInContext(KAYNAK, o3.sandbox, { filename: "bkt-engine.js" });
  await bekle(30);
  dugme(o3, "[data-bkt-test]", { bktTest: KONU_C, bktPool: "mat_10_u01_k01", bktMode: "precheck" });
  await bekle(40);
  ok("C konusu (havuzu yok) için modal AÇILMADI", !o3.elemanlar["bkt-test-modal"]);
  ok("sebep söylendi (toast)", o3.toasts.some(t => /havuzu bulunamadı/i.test(t)), o3.toasts.join(" | "));

  // Benzer adlı konu: "Matematik > Trigonometri" ≠ "Matematik > 1.1 Trigonometri"
  const o4 = ortamKur({ manifest: MANIFEST, havuzlar: { mat_10_u01_k01: POOL_A }, bkt_state: {} });
  vm.runInContext(KAYNAK, o4.sandbox, { filename: "bkt-engine.js" });
  await bekle(30);
  dugme(o4, "[data-bkt-test]", { bktTest: KONU_D, bktPool: "mat_10_u01_k01", bktMode: "precheck" });
  await bekle(40);
  ok("benzer adlı başka konuya DÜŞÜLMEDİ", !o4.elemanlar["bkt-test-modal"]);

  // ==========================================================
  // 5) SAF EŞLEME FONKSİYONU (havuzEsle)
  // ==========================================================
  console.log("\n== 5) havuzEsle: yalnız birebir ==");
  const API = o1.sandbox.window.AnalizBKT;
  ok("AnalizBKT API var", !!API);
  if (API && typeof API.havuzEsle === "function") {
    const e = (k) => { const h = API.havuzEsle(k, MANIFEST); return h ? h.konu_id : null; };
    esit("birebir topic_key", e("Matematik > 1.1 Trigonometri"), "mat_10_u01_k01");
    // Numara farkı BAŞKA konudur (gerçek veride 9. sınıf "1.4 ..." 10. sınıfın
    // "1.3 ..." havuzunu açıyordu) → eşleşmez.
    esit("sadece numara farkı → eşleşmez", e("Matematik > Trigonometri"), null);
    // Kelime benzerliği / kısmi başlık → ASLA eşleşmez (kullanıcı şikâyeti)
    esit("benzer ad (ayrı konu) → null", e("Matematik > Trigonometri Konusu"), null);
    esit("etiket/kısmi kelime eşleşmesi → null", e("Matematik > Elemanlar"), null);
    esit("boş anahtar → null", e(""), null);
    esit('"undefined" → null', e("undefined"), null);
    esit("başka dersin aynı başlığı → null", e("Fizik > 1.1 Trigonometri"), null);
    esit("5 sorudan fazlası seçilmez", API.MINI_SORU, 5);
  } else {
    ok("havuzEsle dışa açık", false);
  }

  // ==========================================================
  // 6) PANEL DÜĞMESİ 5 SORU DİYOR
  // ==========================================================
  console.log("\n== 6) Panel düğmesi ==");
  const o5 = ortamKur({
    manifest: MANIFEST,
    havuzlar: { mat_10_u01_k01: POOL_A },
    bkt_state: { [KONU_A]: bkt({ pool_id: "mat_10_u01_k01" }) },
    localStorage: { am_bkt_panel_acik: "1" }
  });
  vm.runInContext(KAYNAK, o5.sandbox, { filename: "bkt-engine.js" });
  await bekle(30);
  if (typeof o5.sandbox.window.__bktUiTazele === "function") o5.sandbox.window.__bktUiTazele();
  await bekle(150);
  const panel = o5.mainContent.children.filter(c => c && c.id === "bkt-learning-panel").pop();
  ok("panel basıldı", !!panel);
  if (panel) {
    ok("panelde 'Kısa Kontrol — 5 soru' yazıyor", panel.innerHTML.indexOf("Kısa Kontrol — 5 soru") >= 0, panel.innerHTML.slice(0, 200));
    ok("panelde '3 soru' YOK", panel.innerHTML.indexOf("3 soru") < 0);
  }

  // ==========================================================
  // 7) GERÇEK VERİ: müfredattaki her konu için eşleşen havuz DOĞRU mu?
  // ==========================================================
  console.log("\n== 7) Gerçek manifest + gerçek müfredat ==");
  const manifestYolu = path.join(KOK, "site", "content", "soru_havuzlari", "index.json");
  const GERCEK = JSON.parse(fs.readFileSync(manifestYolu, "utf8")).havuzlar || [];
  ok("gerçek manifest okundu (" + GERCEK.length + " havuz)", GERCEK.length > 150);

  // 7a) Her havuz kendi topic_key'i ile AYNI KONUYA dönmeli.
  // (Manifestte bir topic_key iki havuzda geçiyor: "Din Kültürü > 4.3 Medine
  //  Dönemi" → din_10_u04_k03 + din_10_u05_k01. İkisi de aynı konu olduğu
  //  için hangisinin seçildiği konu doğruluğunu bozmaz; ilk kayıt seçilir.)
  let kendine = 0;
  GERCEK.forEach(h => {
    const bulunan = API.havuzEsle(h.topic_key, GERCEK);
    if (bulunan && String(bulunan.topic_key) === String(h.topic_key)) kendine++;
  });
  esit("her havuz kendi konusunu buluyor", kendine, GERCEK.length);

  // 7b) Bilinen yanlış eşleşme (9. sınıf 1.4 → 10. sınıf 1.3) artık OLMAMALI
  const yanlisKonu = "Din Kültürü > 1.4 Kur'an'dan Mesajlar (Ünite 1)";
  esit("sınıf/ünite numarası farklı konuya havuz BAĞLANMIYOR", API.havuzEsle(yanlisKonu, GERCEK), null);

  // 7c) Müfredattaki her konu: eşleşme varsa BİREBİR olmalı
  const html = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
  const cur = (function () {
    const i = html.indexOf("const CURRICULUM = {");
    if (i < 0) return null;
    let d = 0, j = i + "const CURRICULUM = ".length, bas = j, son = -1, tirnak = null;
    for (; j < html.length; j++) {
      const c = html[j];
      if (tirnak) { if (c === "\\") { j++; continue; } if (c === tirnak) tirnak = null; continue; }
      if (c === '"' || c === "'" || c === "`") { tirnak = c; continue; }
      if (c === "{") d++;
      else if (c === "}") { d--; if (d === 0) { son = j + 1; break; } }
    }
    const kutu = {};
    vm.createContext(kutu);
    vm.runInContext("k = " + html.slice(bas, son), kutu);
    return kutu.k;
  })();
  ok("müfredat okundu", !!cur);
  let konuSayisi = 0, eslesen = 0, hataliEslesme = 0;
  const hataliOrnek = [];
  if (cur) {
    const sade = (x) => String(x == null ? "" : x).toLocaleLowerCase("tr-TR")
      .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ç/g, "c")
      .replace(/ö/g, "o").replace(/ü/g, "u").replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u")
      .replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
    Object.keys(cur).forEach(sinif => {
      Object.keys(cur[sinif] || {}).forEach(dersAdi => {
        (cur[sinif][dersAdi] || []).forEach(konu => {
          konuSayisi++;
          const key = dersAdi + " > " + konu;
          const h = API.havuzEsle(key, GERCEK);
          if (!h) return;
          eslesen++;
          const ayniTopic = String(h.topic_key) === key;
          const ayniBaslik = sade(h.baslik) === sade(konu);
          if (!ayniTopic && !ayniBaslik) {
            hataliEslesme++;
            if (hataliOrnek.length < 5) hataliOrnek.push(key + " → " + h.konu_id);
          }
        });
      });
    });
  }
  ok("müfredat tarandı (" + konuSayisi + " konu, " + eslesen + " eşleşme)", konuSayisi > 200);
  esit("YANLIŞ konuya bağlanan havuz sayısı", hataliEslesme, 0);
  if (hataliOrnek.length) hataliOrnek.forEach(x => console.log("   ! " + x));

  // ==========================================================
  console.log("\n" + "─".repeat(56));
  if (kalan) {
    hatalar.forEach(x => console.log(" ✗ " + x));
    console.log("Kısa kontrol davranış testi — " + gecen + "/" + (gecen + kalan) + " geçti");
    process.exit(1);
  }
  console.log("Kısa kontrol davranış testi — " + gecen + "/" + gecen + " geçti ✓");
})();
