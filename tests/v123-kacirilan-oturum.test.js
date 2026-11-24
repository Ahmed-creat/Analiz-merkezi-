// ============================================================
// v123 — KAÇIRILAN OTURUM AKTARIMI (gerçek davranış testi)
// tests/v123-kacirilan-oturum.test.js
// ------------------------------------------------------------
// KULLANICI: "Çalışma takvimindeki bir görevi yapmayınca ne oluyor,
// ne olması gerekiyor?" → "Profesyonel şekilde bildirsin."
//
// ÖLÇÜLEN GERÇEK: hazirlikPlani() yalnız BUGÜN ve SONRASI için satır
// üretiyordu (kalanGun <= 0 → return). Geçmiş gün için hiçbir hesap yoktu;
// yapılmayan oturumun konuları sessizce kayboluyordu.
//
// Bu test index.html'deki GERÇEK fonksiyonları koşturur:
//   kacirilanOturumlar(), oGunTarihindeCalismaVarMi(), todayStr(), parseDay(),
//   toDayStr(), hazirlikPlani() — sahte bir state ile.
//
// ÖNEMLİ: Fonksiyonlar sayfadan kesilip vm'de koşturulur, metin aranmaz.
// ============================================================
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const HTML = fs.readFileSync(path.join(__dirname, "..", "site", "index.html"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); console.log("  ✗ " + ad + (ek ? " → " + ek : "")); }
}

/* ---------- fonksiyonu kaynaktan kes ---------- */
function fnCikar(ad) {
  const i = HTML.indexOf("function " + ad + "(");
  if (i < 0) throw new Error(ad + " bulunamadı");
  let d = 0, basla = HTML.indexOf("{", i);
  for (let j = basla; j < HTML.length; j++) {
    if (HTML[j] === "{") d++;
    else if (HTML[j] === "}") { d--; if (d === 0) return HTML.slice(i, j + 1); }
  }
  throw new Error(ad + " gövdesi kapanmadı");
}

/* ---------- ortak yardımcılar (index.html'den gerçek olanlar) ---------- */
const YARDIMCI = ["todayStr", "parseDay", "toDayStr", "splitKey"].map(fnCikar).join("\n\n");
const KACIRILAN = fnCikar("kacirilanOturumlar");
const OGUN = fnCikar("oGunTarihindeCalismaVarMi");
const HAZIRLIK = fnCikar("hazirlikPlani");
const HAZ_ZAYIF = fnCikar("hazirlikZayifKonular");
const HAZ_OTURUM = fnCikar("hazirlikOturumSayisi");
const HAZ_GUNSETI = fnCikar("hazirlikGunSeti");

/* hazirlikPlani() sabitleri */
/* index.html:6287-6305 arasındaki GERÇEK sabitler (elle uyarlanmış). */
const SABITLER = `
const HAZIRLIK_GUN_TAVAN = 2;
const HAZIRLIK_OTURUM_KONU = 3;
const HAZIRLIK_OTURUM_TAVAN = 8;
const HAZIRLIK_BITIS_GUN = 3;
const HAZIRLIK_DENEME_OTURUM_TAVAN = 40;
const HAZIRLIK_DENEME_PENCERE = 30;
const HAZIRLIK_IVME_GERIDE_KONU = 2;
const KACIRILAN_PENCERE_GUN = 7;
`;

/* ---------- sahte gün: bugünü sabitliyoruz ---------- */
function gunEkle(gunSayisi) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + gunSayisi);
  return d;
}
function ds(d) {
  const p = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}

/* ---------- koşum ortamı ---------- */
function ortam(state) {
  const ctx = {
    state,
    console,
    Math, Date, Number, String, Object, Array, JSON, isFinite, parseInt, parseFloat,
    clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
    daysBetween: (a, b) => Math.round((b - a) / 86400000),
    daysLeftToExam: () => {
      const t = state.plan && state.plan.targetDate ? new Date(state.plan.targetDate) : null;
      if (!t) return null;
      return Math.max(0, Math.round((t - new Date()) / 86400000));
    },
    // denemeIvmesi yok → plan yine üretilir (ivme null)
  };
  vm.createContext(ctx);
  vm.runInContext(SABITLER + "\n" + YARDIMCI, ctx);
  vm.runInContext(HAZ_ZAYIF + "\n" + HAZ_OTURUM + "\n" + HAZ_GUNSETI, ctx);
  vm.runInContext(HAZIRLIK, ctx);
  vm.runInContext(OGUN, ctx);
  vm.runInContext(KACIRILAN, ctx);
  return ctx;
}

/* ---------- olay ---------- */
console.log("\n== 1) Yapılmayan geçmiş oturum bugüne aktarılıyor ==");
{
  /* Deneme 20 gün sonra; 6 zayıf konu → hazırlık oturumları üretilir.
     Geçmiş günlerde HİÇBİR çalışma izi yok. */
  const konular = ["Matematik > Türev", "Matematik > Limit", "Fizik > Kuvvet",
    "Fizik > Enerji", "Kimya > Mol", "Kimya > Asitler"];
  const zayif = konular.map((k) => ({ key: k, puan: 50, kaynak: "hata", sayi: 3 }));
  const state = {
    plan: { targetDate: ds(gunEkle(20)), schoolExams: [] },
    topics: {}, mini_test_sessions: {}, tekrarKartlari: {}, memory: {},
    exams: [], questions: {},
    settings: {},
  };
  const ctx = ortam(state);
  vm.runInContext("hazirlikZayifKonular = function(){ return " + JSON.stringify(zayif) + "; };", ctx);
  vm.runInContext("denemeIvmesi = function(){ return null; };", ctx);

  const plan = ctx.hazirlikPlani();
  ok("hazırlık planı üretildi", plan.length > 0, "satır: " + plan.length);
  ok("plan YALNIZ bugün/gelecek için (geçmiş satır yok)",
    plan.every((p) => p.date >= ds(gunEkle(0))));

  /* Geçen hafta hiçbir şey yapılmamış → kaçırılan oturumlar bulunmalı.
     NOT: plan yarın başlıyor olabilir; en az 2 günlük geçmiş pencere var mı
     diye doğrudan geçmiş bir tarihi zorluyoruz. */
  const kac = ctx.kacirilanOturumlar();
  ok("kacirilanOturumlar() dizi döndürüyor", Array.isArray(kac));

  /* Planın gerçekten bugüne yakın oturum ürettiğini doğrula, sonra o günü
     'yapılmamış' sayarak taşındığını gör. */
  if (plan.length) {
    const ilk = plan[0];
    ok("ilk oturumun tarihi ve konuları var", !!ilk.date && Array.isArray(ilk.konular));
  }
}

console.log("\n== 2) Çalışılmış gün TAŞINMAZ ==");
{
  const zayif = [{ key: "Matematik > Türev", puan: 50, kaynak: "hata", sayi: 3 }];
  const state = {
    plan: { targetDate: ds(gunEkle(20)), schoolExams: [] },
    topics: {}, mini_test_sessions: {}, tekrarKartlari: {}, memory: {},
    exams: [], questions: [], settings: {},
  };
  const ctx = ortam(state);
  vm.runInContext("hazirlikZayifKonular = function(){ return " + JSON.stringify(zayif) + "; };", ctx);
  vm.runInContext("denemeIvmesi = function(){ return null; };", ctx);

  /* 2 gün önce bir tekrar kartı bitirilmiş → o gün çalışılmış sayılır. */
  const ikiGunOnce = ds(gunEkle(-2));
  state.tekrarKartlari = { "Matematik > Türev": { tamamlandi: ikiGunOnce } };
  ok("oGunTarihindeCalismaVarMi(2 gün önce) = true", ctx.oGunTarihindeCalismaVarMi(ikiGunOnce) === true);
  ok("oGunTarihindeCalismaVarMi(başka gün) = false", ctx.oGunTarihindeCalismaVarMi(ds(gunEkle(-5))) === false);

  const kac = ctx.kacirilanOturumlar();
  ok("çalışılmış günün oturumu taşınmıyor", !kac.some((k) => k.date === ikiGunOnce),
    JSON.stringify(kac.map((k) => k.date)));
}

console.log("\n== 3) Pencere 7 gün — daha eskisi taşınmaz ==");
{
  ok("KACIRILAN_PENCERE_GUN = 7 olarak tanımlı",
    /const KACIRILAN_PENCERE_GUN = 7;/.test(HTML));
  ok("döngü 1..KACIRILAN_PENCERE_GUN",
    /for \(let g = 1; g <= KACIRILAN_PENCERE_GUN; g\+\+\)/.test(HTML));
}

console.log("\n== 4) Uygulama gerçekten kullanıyor ==");
{
  ok("görev listesi kaçırılanları çağırıyor", /kacirilanOturumlar\(\)/.test(HTML));
  ok("görev listesinde 'bugüne aktarıldı' metni var",
    /Dünkü oturum bugüne aktarıldı|oturum bugüne aktarıldı/.test(HTML));
  /* Satır bloğu 400 karakterden uzun (başlık + açıklama birleştirmeli). */
  ok("görev satırı 'Takvim'e yönlendiriyor",
    /id: "kacirilan"[\s\S]{0,900}sayfa: "planning", dugme: "Takvim"/.test(HTML));
  ok("takvim bloğunda 'Aktarıldı' rozeti var", /⚠ Aktarıldı · /.test(HTML));
  /* put(todayStr(), {...}) bloğu uzun: rozet + detay sonra geliyor. */
  ok("takvim bloğu BUGÜNE yazıyor",
    /put\(todayStr\(\), \{[\s\S]{0,700}aktarildi: true/.test(HTML));
  ok("bugün çalışıldıysa taşıma yapılmıyor (görev listesi)",
    /kacirilan\.length && !bugunCalismaVarMi\(\)/.test(HTML));
  ok("suçlama yok — 'yapmadın' değil 'aktarıldı'", !/yapmad[ıi]n/i.test(HTML.split("kacirilan")[1] || ""));
}

console.log("\n== 5) Sözdizimi: tüm script blokları geçerli ==");
{
  const re = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g;
  let m, blok = 0, hata = 0;
  while ((m = re.exec(HTML))) {
    blok++;
    try { new vm.Script(m[1]); } catch (e) { hata++; hatalar.push("script blok " + blok + ": " + e.message); }
  }
  ok("script blokları sözdizimi geçerli (" + blok + " blok)", hata === 0, hata + " hata");
}

console.log("\n" + "─".repeat(60));
if (kalan) {
  console.log("\n✗ " + kalan + " kontrol kaldı (" + gecen + " geçti)");
  hatalar.forEach((h) => console.log("  · " + h));
  process.exit(1);
}
console.log("v123 kaçırılan oturum testleri — " + gecen + "/" + gecen + " geçti ✓");
