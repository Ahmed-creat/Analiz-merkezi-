#!/usr/bin/env node
/* ============================================================
   TEKRAR MERDİVENİ — tests/tekrar-merdiveni.test.js   (G-02)
   ------------------------------------------------------------
   site/index.html içindeki GERÇEK hafıza motoru kodunu vm ile yükler
   (kopya fonksiyon yok; kaynak dosya doğrudan ölçülür).

   KÖK NEDEN: `scheduleReviews` takvimi her çağrıda BUGÜNDEN kuruyordu;
   her tekrar "1. gün" basamağını yarına attığı için konu her gün
   "TEKRAR BUGÜN" oluyordu. Artık konu `mem.step` taşır ve yalnız kalan
   basamaklar kurulur.

   Kanıtlananlar:
     1) tamamlanınca schedule = 1,3,7,14,28
     2) 1. tekrar sonrası kalan = 3,7,14,28 · sıradaki gün = 3
     3) 2. tekrar sonrası kalan = 7,14,28
     4) merdiven bitince bakım basamağı (28 gün) — takvim boş kalmaz
     5) dueReviews konu başına TEK satır (en eski gecikmiş basamak)
     6) eski kayıt göçü (step yok → reviewCount)
     7) ERKEN TEKRAR KARARI A: step ARTMAZ (her gün erken tıklama
        merdiveni atlatamaz)
     8) __kartTamamla da aynı kuralı uygular
     9) ardışık 4 tekrarda sıradaki gün: 3 → 7 → 14 → 28
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

/* AM_HTML: gerileme karşılaştırması için başka bir index.html sürümü ölçülebilir. */
const HTML = process.env.AM_HTML || path.join(__dirname, "..", "site", "index.html");
const kod = fs.readFileSync(HTML, "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) gecen++; else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }

// ---------------------------------------------------------------
// KAYNAKTAN KESİT: süslü parantez sayarak fonksiyon gövdesi
// ---------------------------------------------------------------
function fonksiyonKes(ad) {
  const bas = kod.indexOf("function " + ad + "(");
  if (bas < 0) throw new Error("fonksiyon bulunamadı: " + ad);
  const ac = kod.indexOf("{", bas);
  let derinlik = 0;
  for (let i = ac; i < kod.length; i++) {
    const c = kod[i];
    if (c === "{") derinlik++;
    else if (c === "}") { derinlik--; if (!derinlik) return kod.slice(bas, i + 1); }
  }
  throw new Error("gövde kapanmadı: " + ad);
}
function kartTamamlaKes() {
  const bas = kod.indexOf("window.__kartTamamla = function");
  if (bas < 0) throw new Error("__kartTamamla bulunamadı");
  const ac = kod.indexOf("{", bas);
  let derinlik = 0;
  for (let i = ac; i < kod.length; i++) {
    const c = kod[i];
    if (c === "{") derinlik++;
    else if (c === "}") { derinlik--; if (!derinlik) return kod.slice(bas, i + 2); }
  }
  throw new Error("__kartTamamla gövdesi kapanmadı");
}
function sabitKes(ad) {
  const m = kod.match(new RegExp("const " + ad + " = [^;]+;"));
  if (!m) throw new Error("sabit bulunamadı: " + ad);
  return m[0];
}

const KAYNAK = [
  sabitKes("REVIEW_DAYS"),
  sabitKes("REVIEW_BAKIM_GUN"),
  sabitKes("MEMORY_BASE_DECAY"),
  sabitKes("MEMORY_DECAY_SLOWDOWN"),
  sabitKes("MEMORY_DECAY_FLOOR"),
  fonksiyonKes("toDayStr"),
  fonksiyonKes("tekrarAdimi"),
  fonksiyonKes("idealReviewInterval"),
  fonksiyonKes("scheduleReviews"),
  fonksiyonKes("nextReviewInfo"),
  fonksiyonKes("dueReviews"),
  fonksiyonKes("memoryDecayRate"),
  fonksiyonKes("markReviewed"),
  kartTamamlaKes()
].join("\n\n");

// ---------------------------------------------------------------
// HARNESS
// ---------------------------------------------------------------
function p2(n) { return String(n).padStart(2, "0"); }
function gunStr(d) { return d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate()); }
function bugun() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
function gunEkle(n) { const d = bugun(); d.setDate(d.getDate() + n); return gunStr(d); }

function kur(baslangicMem, bugunSabit) {
  const simdi = bugunSabit ? new Date(bugunSabit + "T10:00:00") : new Date();
  const state = { memory: baslangicMem || {}, plan: {} };
  const bildirimler = [];
  const kayitlar = { save: 0, rozet: 0 };
  const context = {
    state,
    console,
    Date,
    Math,
    JSON,
    Object,
    Number,
    String,
    Array,
    isFinite,
    window: {},
    document: {},
    currentPage: "tracking",
    MEMORY_CRITICAL: 20,
    saveState() { kayitlar.save++; },
    evaluateBadges() { kayitlar.rozet++; },
    addNotification(n) { bildirimler.push(n); },
    splitKey(k) { const p = String(k).split(" > "); return { lesson: p[0], topic: p[1] || "" }; },
    parseDay(s) {
      if (!s) return null;
      const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (!m) return null;
      const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      d.setHours(0, 0, 0, 0);
      return isNaN(d.getTime()) ? null : d;
    },
    todayStr() { return gunStr(simdi); },
    daysLeftToExam() { return null; },   // sınav tarihi yok → saf merdiven
    clamp(v, a, b) { return Math.min(b, Math.max(a, v)); },
    addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
  };
  vm.runInNewContext(KAYNAK, context);
  return { state, context, bildirimler, kayitlar, simdi };
}

const K = "Matematik > Türev";
function yeniKonu(step) {
  const m = { lastReview: null, reviewCount: 0, completedAt: new Date().toISOString(), schedule: {} };
  if (step !== undefined) m.step = step;
  return { [K]: m };
}

// ---------------------------------------------------------------
console.log("\n== 1) Tamamlanınca tam merdiven ==");
{
  const h = kur(yeniKonu(0));
  h.context.scheduleReviews(K);
  const mem = h.state.memory[K];
  const gunler = Object.keys(mem.schedule);
  ok("schedule = 1,3,7,14,28", gunler.join(",") === "1,3,7,14,28", gunler.join(","));
  ok("1. gün tarihi = yarın", mem.schedule[1] === gunEkle(1), mem.schedule[1]);
  ok("28. gün tarihi = 28 gün sonra", mem.schedule[28] === gunEkle(28), mem.schedule[28]);
  ok("nextReviewInfo().day = 1", h.context.nextReviewInfo(K).day === 1);
  ok("saveState çağrıldı", h.kayitlar.save > 0);
}

// ---------------------------------------------------------------
console.log("\n== 2-3) Tekrarlar merdiveni İLERLETİYOR (bugüne sıfırlamıyor) ==");
{
  const h = kur(yeniKonu(0));
  h.context.scheduleReviews(K);
  const mem = h.state.memory[K];

  h.context.markReviewed(K, false);                       // 1. tekrar
  ok("1. tekrar sonrası step = 1", mem.step === 1, String(mem.step));
  ok("kalan basamaklar 3,7,14,28", Object.keys(mem.schedule).join(",") === "3,7,14,28",
    Object.keys(mem.schedule).join(","));
  ok("sıradaki gün 3 (1 değil)", h.context.nextReviewInfo(K).day === 3, String(h.context.nextReviewInfo(K).day));
  ok("sıradaki tarih bugün DEĞİL", mem.schedule[3] > gunEkle(0) && mem.schedule[3] === gunEkle(3), mem.schedule[3]);

  h.context.markReviewed(K, false);                       // 2. tekrar
  ok("2. tekrar sonrası step = 2", mem.step === 2, String(mem.step));
  ok("kalan basamaklar 7,14,28", Object.keys(mem.schedule).join(",") === "7,14,28",
    Object.keys(mem.schedule).join(","));
  ok("dueReviews boş (bugün/geçmiş basamak yok)", h.context.dueReviews().length === 0,
    JSON.stringify(h.context.dueReviews()));
}

// ---------------------------------------------------------------
console.log("\n== 4) Merdiven bitince BAKIM basamağı ==");
{
  const h = kur(yeniKonu(0));
  const mem = h.state.memory[K];
  h.context.scheduleReviews(K);
  for (let i = 1; i <= 5; i++) h.context.markReviewed(K, false);
  ok("step 5'te kilitleniyor", mem.step === 5, String(mem.step));
  ok("bakım takvimi {28: +28 gün}", Object.keys(mem.schedule).join(",") === "28",
    Object.keys(mem.schedule).join(","));
  ok("bakım tarihi = bugün+28", mem.schedule[28] === gunEkle(28), mem.schedule[28]);
  ok("nextReviewInfo() null DEĞİL (Bilgi Bankası 'Sıradaki: —' göstermez)",
    !!h.context.nextReviewInfo(K));
  h.context.markReviewed(K, false);
  ok("bakım tekrarından sonra step 5 kalır", mem.step === 5, String(mem.step));
  ok("bakım yeniden kurulur", mem.schedule[28] === gunEkle(28), mem.schedule[28]);
}

// ---------------------------------------------------------------
console.log("\n== 5) dueReviews: konu başına TEK satır ==");
{
  const m = {};
  m[K] = { lastReview: null, reviewCount: 0, completedAt: "2026-01-01", schedule: {
    1: gunEkle(-5), 3: gunEkle(-2), 7: gunEkle(0), 14: gunEkle(9), 28: gunEkle(23)
  } };
  m["Fizik > Vektörler"] = { lastReview: null, reviewCount: 0, completedAt: "2026-01-01",
    schedule: { 1: gunEkle(3), 3: gunEkle(5) } };
  m["Kimya > Mol"] = { lastReview: null, reviewCount: 0, completedAt: "2026-01-01",
    schedule: { 3: gunEkle(-4) } };
  const h = kur(m);
  const list = h.context.dueReviews();
  ok("konu başına 1 satır (2 konu due → 2 satır)", list.length === 2, JSON.stringify(list));
  const tde = list.filter(x => x.topicKey === K);
  ok("aynı konu 3 kez sayılmıyor", tde.length === 1, String(tde.length));
  ok("EN ESKİ gecikmiş basamak dönüyor (1. gün)", tde[0] && tde[0].day === 1, tde[0] && String(tde[0].day));
  ok("satırda topicKey + date var", !!(tde[0] && tde[0].topicKey && tde[0].date));
  ok("en eski gecikmiş önce (sıralı)", list[0].date <= list[1].date);
}

// ---------------------------------------------------------------
console.log("\n== 6) Eski kayıt göçü (step yok → reviewCount) ==");
{
  const h = kur({ [K]: { lastReview: null, reviewCount: 2, completedAt: "2026-01-01", schedule: {} } });
  const mem = h.state.memory[K];
  h.context.scheduleReviews(K);
  ok("reviewCount=2 → kalan 7,14,28", Object.keys(mem.schedule).join(",") === "7,14,28",
    Object.keys(mem.schedule).join(","));
  h.context.markReviewed(K, false);
  ok("tekrar sonrası step = 3", mem.step === 3, String(mem.step));
  ok("kalan 14,28", Object.keys(mem.schedule).join(",") === "14,28", Object.keys(mem.schedule).join(","));
}

// ---------------------------------------------------------------
console.log("\n== 7) ERKEN TEKRAR KARARI A: step artmaz ==");
{
  const h = kur(yeniKonu(0));
  const mem = h.state.memory[K];
  h.context.scheduleReviews(K);
  h.context.markReviewed(K, false);       // step 1
  mem.lastReview = "2020-01-01T00:00:00.000Z";   // eski tarih → güncelleme ölçülebilsin
  const oncekiSon = mem.lastReview;
  for (let i = 0; i < 5; i++) h.context.markReviewed(K, true);   // 5 kez erken tekrar
  ok("5 erken tekrardan sonra step HÂLÂ 1 (merdiven atlanmıyor)", mem.step === 1, String(mem.step));
  ok("kalan basamaklar korunuyor (3,7,14,28)", Object.keys(mem.schedule).join(",") === "3,7,14,28",
    Object.keys(mem.schedule).join(","));
  ok("lastReview yine de güncellendi", mem.lastReview !== oncekiSon);
  ok("sıradaki gün 3'te kalıyor", h.context.nextReviewInfo(K).day === 3, String(h.context.nextReviewInfo(K).day));
}

// ---------------------------------------------------------------
console.log("\n== 8) __kartTamamla aynı kuralı uyguluyor ==");
{
  const h = kur(yeniKonu(0));
  const mem = h.state.memory[K];
  h.context.scheduleReviews(K);
  h.context.window.__kartTamamla(K, false);
  ok("kart turu (günü geldi) step'i artırdı", mem.step === 1, String(mem.step));
  h.context.window.__kartTamamla(K, true);
  ok("kart turu (erken) step'i artırmadı", mem.step === 1, String(mem.step));
  ok("kart turu bildirimi üretildi", h.bildirimler.length === 2, String(h.bildirimler.length));
  ok("erken bildirimi ayrı başlık", h.bildirimler[1] && /Erken Tekrar/.test(h.bildirimler[1].title));
}

// ---------------------------------------------------------------
console.log("\n== 9) KABUL: ardışık 4 tekrarda 3 → 7 → 14 → 28 ==");
{
  const h = kur(yeniKonu(0));
  h.context.scheduleReviews(K);
  const sira = [];
  for (let i = 0; i < 4; i++) {
    h.context.markReviewed(K, false);
    const nr = h.context.nextReviewInfo(K);
    sira.push(nr ? nr.day : null);
  }
  ok("sıradaki günler 3,7,14,28", sira.join(",") === "3,7,14,28", sira.join(","));
}

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("tekrar merdiveni — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("tekrar merdiveni — " + gecen + "/" + gecen + " geçti ✓");
