/* ============================================================
   İÇE AKTAR DÜĞMESİ — BİRLEŞTİRME MODU TESTİ
   ------------------------------------------------------------
   Kullanıcı "Verileri İçe Aktar" düğmesini basacak. Varsayılan
   davranış TAM DURUM DEĞİŞİMİDİR (mergeDeep(freshState(), data)) ve
   konu takibi/hafıza/BKT/profil silinir.

   _mod = "deneme-birlestir" olan dosyada düğme yalnız sınav ekler.
   Bu test importData'yı index.html'den çıkarıp sahte bir DOM'da
   çalıştırır ve ne silindiğini/eklendiğini ölçer.

   Çalıştır: node tests/deneme-import-butonu.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const KOK = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(KOK, "site/index.html"), "utf8");
const VERI = JSON.parse(fs.readFileSync(path.join(KOK, "site/veri/9-sinif-denemeler.json"), "utf8"));

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false;
}

/* ---- index.html'den importData fonksiyonunu çıkar ---- */
function fonksiyonCikar(ad) {
  const i = HTML.indexOf("function " + ad + "(");
  if (i < 0) throw new Error(ad + " bulunamadı");
  let d = 0, j = HTML.indexOf("{", i);
  const bas = j;
  for (; j < HTML.length; j++) {
    if (HTML[j] === "{") d++;
    else if (HTML[j] === "}") { d--; if (d === 0) break; }
  }
  return HTML.slice(i, j + 1);
}
const IMPORT_KOD = fonksiyonCikar("importData");

/* ---- sahte ortam ---- */
function ortam(kur) {
  const toastlar = [];
  let kaydedildi = 0;
  /* sahte localStorage: sınıf arşivleri (analizmerkezi_v6_g9 / _g10) */
  const depo = Object.assign({}, kur.depo || {});
  const localStorage = {
    getItem: (k) => (k in depo ? depo[k] : null),
    setItem: (k, v) => { depo[k] = String(v); },
    removeItem: (k) => { delete depo[k]; }
  };
  const ctx = {
    console,
    JSON,
    String,
    Array,
    Object,
    Number,
    Math,
    Date,
    FileReader: function () {
      const self = this;
      this.readAsText = function () {
        self.result = kur.dosyaMetni;
        setTimeout(() => self.onload && self.onload(), 0);
      };
    },
    setTimeout,
    state: JSON.parse(JSON.stringify(kur.state)),
    freshState: () => ({
      user: { name: "", grade: "9", joined: null },
      streak: { count: 0 },
      exams: [], questions: [], books: [], topics: {}, memory: {},
      notifications: [], badges: {},
      plan: { targetDate: null },
      settings: {},
      bkt_state: {}, bkt_processed_records: {}, soru_havuzu_gosterim_logu: [],
      mini_test_kuyrugu: [], mini_test_sessions: {},
      taxonomy_migration_done: false,
      dailyTasks: { study: false, read: false, solve: false, date: null }
    }),
    mergeDeep: function (base, extra) {
      const out = Array.isArray(base) ? [] : {};
      Object.keys(base).forEach(k => { out[k] = base[k]; });
      Object.keys(extra || {}).forEach(k => {
        if (extra[k] && typeof extra[k] === "object" && !Array.isArray(extra[k]) &&
            base[k] && typeof base[k] === "object" && !Array.isArray(base[k]))
          out[k] = ctx.mergeDeep(base[k], extra[k]);
        else out[k] = extra[k];
      });
      return out;
    },
    saveState: () => { kaydedildi++; },
    updateUserUI: () => {},
    navigate: () => {},
    renderExamChart: () => {},
    toast: (m, t) => toastlar.push({ m, t }),
    currentPage: "exams",
    localStorage,
    window: {}
  };
  ctx.window = { AnalizBKT: { processNewRecords: () => { ctx.bktCalisti = (ctx.bktCalisti || 0) + 1; } } };
  vm.createContext(ctx);
  vm.runInContext(IMPORT_KOD, ctx, { filename: "importData" });
  return { ctx, toastlar, kaydetSayisi: () => kaydedildi, depo };
}

/* Mevcut kullanıcı verisi: konu takibi, hafıza, BKT, profil dolu */
const MEVCUT = {
  user: { name: "Ahmed", grade: "9", joined: "2025-09-01" },
  streak: { count: 12 },
  exams: [{ id: "eski-1", name: "Eski Deneme", date: "2025-09-15", lessons: {}, errorLogs: [], total: 120, net: 70 }],
  topics: { "Matematik > Üslü Sayılar": { step: 3, completedAt: "2025-10-01" } },
  memory: { "Matematik > Üslü Sayılar": { lastReview: "2025-10-02", reviewCount: 2 } },
  bkt_state: { "Matematik > Üslü Sayılar": { L: 0.42, gozlem_sayisi: 9 } },
  bkt_processed_records: { "record:deneme:eski-1:error:0": true },
  questions: [], books: [], badges: {}, notifications: [],
  plan: { targetDate: "2026-06-20", targetNet: 90 },
  dailyTasks: { study: true, read: false, solve: true, date: "2026-11-17" }
};

function calistir(dosya) {
  const { ctx, toastlar, kaydetSayisi } = ortam({ state: MEVCUT, dosyaMetni: JSON.stringify(dosya) });
  const input = { files: [{ name: "x.json" }], value: "secili" };
  ctx.importData(input);
  return new Promise(res => setTimeout(() => res({ ctx, toastlar, kaydetSayisi, input }), 10));
}

(async () => {
  // ---------- 1) üretilen dosya: birleştirme modu ----------
  console.log("== 1) Dosya birleştirme modunda mı ==");
  ok("_mod doğru", VERI._mod === "deneme-birlestir", String(VERI._mod));
  ok("7 sınav taşıyor", VERI.state.exams.length === 7);

  const r1 = await calistir(VERI);

  // ---------- 2) hiçbir şey silinmedi ----------
  console.log("\n== 2) Mevcut veri korundu ==");
  const s = r1.ctx.state;
  ok("profil adı korundu", s.user.name === "Ahmed", String(s.user.name));
  ok("sınıf korundu", s.user.grade === "9");
  ok("seri korundu", s.streak && s.streak.count === 12, String(s.streak && s.streak.count));
  ok("konu takibi korundu", !!(s.topics && s.topics["Matematik > Üslü Sayılar"]));
  ok("hafıza korundu", !!(s.memory && s.memory["Matematik > Üslü Sayılar"]));
  ok("BKT durumu korundu", s.bkt_state["Matematik > Üslü Sayılar"].L === 0.42);
  ok("BKT işlem defteri korundu", !!s.bkt_processed_records["record:deneme:eski-1:error:0"]);
  ok("plan korundu", s.plan.targetDate === "2026-06-20");
  ok("günlük görev korundu", s.dailyTasks.study === true);

  // ---------- 3) sınavlar eklendi ----------
  console.log("\n== 3) Sınavlar eklendi ==");
  ok("8 sınav (1 eski + 7 yeni)", s.exams.length === 8, String(s.exams.length));
  ok("eski sınav duruyor", s.exams.some(e => e.id === "eski-1"));
  ok("7 yeni sınav geldi", s.exams.filter(e => String(e.id).startsWith("pdf9-")).length === 7);
  ok("tarihe göre sıralı", s.exams.every((e, i, a) => i === 0 || String(a[i - 1].date) <= String(e.date)));
  ok("kaydedildi", r1.kaydetSayisi() > 0);
  ok("BKT tetiklendi", (r1.ctx.bktCalisti || 0) > 0);
  ok("başarı bildirimi", r1.toastlar.some(t => /deneme eklendi/.test(t.m)), JSON.stringify(r1.toastlar));

  // ---------- 4) ikinci kez: mükerrer yok ----------
  console.log("\n== 4) Tekrar yükleme mükerrer eklemiyor ==");
  const r2 = await calistir(VERI);
  // r2 kendi ortamında MEVCUT ile başlıyor (temiz), yine 7 eklemeli
  ok("temiz ortamda 7 ekler", r2.ctx.state.exams.length === 8, String(r2.ctx.state.exams.length));

  const iki = await (async () => {
    const { ctx, toastlar } = ortam({ state: MEVCUT, dosyaMetni: JSON.stringify(VERI) });
    const input = { files: [{}], value: "" };
    ctx.importData(input);
    await new Promise(r => setTimeout(r, 10));
    input.files = [{}]; input.value = "secili";
    ctx.importData(input);
    await new Promise(r => setTimeout(r, 10));
    return { state: ctx.state, toastlar };
  })();
  ok("ikinci yüklemede sınav sayısı 8", iki.state.exams.length === 8, String(iki.state.exams.length));
  ok("'zaten vardı' bildirimi", iki.toastlar.some(t => /zaten vardı|Yeni deneme yok/.test(t.m)),
    iki.toastlar.map(t => t.m).join(" | "));

  // ---------- 4b) BAŞKA SINIF: 10. sınıf hesabında 9. sınıf dosyası ----------
  // KULLANICI: "istediğim öğrencinin içe aktarma jsonunu düzgün şekilde
  // yapmadın." Eski kod bu denemeleri SAYIP ATIYORDU (ne cari hesaba ne
  // arşive yazıyordu) → içe aktarma sonuçsuz kalıyordu.
  console.log("\n== 4b) 10. sınıf hesabında 9. sınıf dosyası arşive yazılır ==");
  const onuncu = JSON.parse(JSON.stringify(MEVCUT));
  onuncu.user.grade = "10";
  const { ctx: c5, toastlar: t5, depo: d5 } = ortam({ state: onuncu, dosyaMetni: JSON.stringify(VERI) });
  c5.importData({ files: [{}], value: "" });
  await new Promise(r => setTimeout(r, 10));
  ok("cari hesaba HİÇ deneme eklenmedi", c5.state.exams.length === 1, String(c5.state.exams.length));
  ok("9. sınıf arşivi oluştu", !!d5["analizmerkezi_v6_g9"], Object.keys(d5).join(","));
  const ars9 = JSON.parse(d5["analizmerkezi_v6_g9"] || "{}");
  ok("arşivde 7 deneme var", (ars9.exams || []).length === 7, String((ars9.exams || []).length));
  ok("arşiv sınıfı 9", String(ars9.user && ars9.user.grade) === "9", String(ars9.user && ars9.user.grade));
  ok("denemeler grade=9 taşıyor", (ars9.exams || []).every(e => String(e.grade) === "9"));
  ok("tarihe göre sıralı", (ars9.exams || []).every((e, i, a) => i === 0 || String(a[i - 1].date) <= String(e.date)));
  ok("bildirim arşivi söylüyor", t5.some(t => /9\. sınıf hesabına 7/.test(t.m)), t5.map(t => t.m).join(" | "));
  ok("cari hesabın konu takibi bozulmadı", !!(c5.state.topics && c5.state.topics["Matematik > Üslü Sayılar"]));
  // ikinci kez: mükerrer yok
  const input5 = { files: [{}], value: "" };
  c5.importData(input5);
  await new Promise(r => setTimeout(r, 10));
  ok("tekrar yükleme arşive mükerrer eklemiyor",
    (JSON.parse(d5["analizmerkezi_v6_g9"]).exams || []).length === 7,
    String((JSON.parse(d5["analizmerkezi_v6_g9"]).exams || []).length));

  // ---------- 5) normal yedek dosyası hâlâ tam değişim ----------
  console.log("\n== 5) _mod'suz dosya eski davranışta ==");
  const yedek = {
    user: { name: "Zeynep", grade: "9", joined: "2026-01-01" },
    exams: [{ id: "y1", name: "Yedek Deneme", date: "2026-01-05", lessons: {}, errorLogs: [], total: 120, net: 80 }],
    topics: {}
  };
  const r3 = await calistir(yedek);
  ok("ad değişti (yedek geri yükleme)", r3.ctx.state.user.name === "Zeynep", r3.ctx.state.user.name);
  ok("eski sınav silindi", r3.ctx.state.exams.length === 1, String(r3.ctx.state.exams.length));
  ok("konu takibi sıfırlandı", Object.keys(r3.ctx.state.topics || {}).length === 0);

  // ---------- 6) bozuk dosya ----------
  console.log("\n== 6) Bozuk dosya reddedilir ==");
  const { ctx: c4, toastlar: t4 } = ortam({ state: MEVCUT, dosyaMetni: JSON.stringify({ a: 1 }) });
  c4.importData({ files: [{}], value: "" });
  await new Promise(r => setTimeout(r, 10));
  ok("hata bildirimi", t4.some(t => /okunamadı/.test(t.m)), JSON.stringify(t4));
  ok("durum bozulmadı", c4.state.exams.length === 1);

  console.log("\n" + "-".repeat(52));
  if (kalan === 0) {
    console.log(`İÇE AKTAR DÜĞMESİ: ${gecen}/${gecen} geçti ✅`);
    console.log("Birleştirme modu veriyi silmiyor; normal yedek yolu değişmedi.");
    process.exit(0);
  } else {
    console.log(`GEÇEN ${gecen} · KALAN ${kalan} ❌`);
    hatalar.forEach(h => console.log("  • " + h));
    process.exit(1);
  }
})();
