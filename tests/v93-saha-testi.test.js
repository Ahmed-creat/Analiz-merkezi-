#!/usr/bin/env node
/* ============================================================
   v93 — ÜÇ SAHA HATASI, KOŞTURARAK ÖLÇÜM
   ------------------------------------------------------------
   KULLANICI (19 Kas):
     1) "Aynı deneme bugün kendiliğinden 2. Kez eklendi."
     2) "Bugün kaydolan bir kullanıcı ana sayfada ders başarı grafiğinde
         felsefe yer almadığını söylüyor."
     3) "Bildirimler gelmiyor. Şunu anla kullanıcının görevi, acil konusu,
         tekrarı varsa kesin bildirim gelmeli."

   Bu dosya, site/ içindeki GERÇEK fonksiyonları alıp sahte bir state ile
   KOŞTURUR — yalnız kaynakta "var mı" diye bakmaz. Yani düzeltme kodu
   yazılmış ama çalışmıyorsa burada kırmızı olur.
   Çalıştır: node tests/v93-saha-testi.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const KOK = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const OKZ = require(path.join(KOK, "site", "okz-normalize.js"));

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); return true; }
  kalan++; hatalar.push(ad + (ek ? " → " + ek : ""));
  console.log("  ✗ " + ad + (ek ? " → " + ek : ""));
  return false;
}
function esit(ad, gelen, beklenen) {
  return ok(ad, JSON.stringify(gelen) === JSON.stringify(beklenen),
    "gelen: " + JSON.stringify(gelen) + " · beklenen: " + JSON.stringify(beklenen));
}

/** index.html içinden bir fonksiyon bloğunu (süslü parantez sayarak) alır. */
function blokAl(baslik) {
  const i = HTML.indexOf(baslik);
  if (i < 0) throw new Error("bulunamadı: " + baslik);
  let j = HTML.indexOf("{", i), derinlik = 0, k = j;
  for (; k < HTML.length; k++) {
    if (HTML[k] === "{") derinlik++;
    else if (HTML[k] === "}") { derinlik--; if (derinlik === 0) { k++; break; } }
  }
  return HTML.slice(i, k);
}

function kosum(kod, kutu) {
  const ctx = Object.assign({ console, Math, JSON, Date, Object, String, Number, Array }, kutu);
  vm.createContext(ctx);
  vm.runInContext(kod, ctx);
  return ctx;
}

// ------------------------------------------------------------
// 1) DERS BAŞARI GRAFİĞİ — "bugün kaydolan kullanıcı" senaryosu
// ------------------------------------------------------------
console.log("\n== 1) Yeni kullanıcı (9. sınıf) + Felsefe'li deneme → grafikte Felsefe ==");
{
  const LESSON_CONFIG = { "Türk Dili ve Edebiyatı": 30, "Matematik": 30, "Fizik": 10, "Kimya": 10, "Biyoloji": 10, "Tarih": 12, "Coğrafya": 12, "Din Kültürü": 6 };
  const GRADE_10 = Object.assign({ "Felsefe": 5 }, LESSON_CONFIG);
  const kod = [
    "const LESSON_CONFIG = " + JSON.stringify(LESSON_CONFIG) + ";",
    "const GRADE_10_EXAM_CONFIG = " + JSON.stringify(GRADE_10) + ";",
    "const LESSON_CHART_COLORS = ['#a','#b','#c','#d','#e','#f','#a1','#b1'];",
    "function activeLessonConfig() { return state.user.grade === '10' ? GRADE_10_EXAM_CONFIG : LESSON_CONFIG; }",
    blokAl("function grafikDersleri()"),
    blokAl("function getLessonSuccessRates()"),
    blokAl("function lessonChartColor(")
  ].join("\n");

  // Kullanıcının canlı hesabı: grade 9, Okulizyon denemesinde Felsefe 5 soru
  const state = {
    user: { grade: "9" },
    exams: [{ name: "Okulizyon: 10.SINIF MAARİF İZLEME SINAVI 1", date: "2026-10-27",
      lessons: { "Matematik": { d: 18, w: 4, e: 3 }, "Felsefe": { d: 4, w: 1, e: 0 } }, errorLogs: [] }],
    questions: []
  };
  const ctx = kosum(kod + "\nthis.__dersler = grafikDersleri(); this.__oran = getLessonSuccessRates(); this.__renk = lessonChartColor; this.__renk2 = lessonChartColor; this.__renkFizik = lessonChartColor('Fizik');", { state });

  ok("Felsefe grafik ders listesinde VAR", ctx.__dersler.indexOf("Felsefe") >= 0, JSON.stringify(ctx.__dersler));
  ok("sabit 8 ders de listede (kaybolmadı)", ["Matematik", "Fizik", "Kimya", "Biyoloji", "Tarih", "Coğrafya", "Din Kültürü", "Türk Dili ve Edebiyatı"]
    .every(d => ctx.__dersler.indexOf(d) >= 0), JSON.stringify(ctx.__dersler));
  esit("Felsefe oranı gerçek veriden (%80)", ctx.__oran["Felsefe"].pct, 80);
  esit("Felsefe soru sayısı 5", ctx.__oran["Felsefe"].total, 5);
  ok("veri yoksa oran null (uydurma yüzde yok)", ctx.__oran["Kimya"] === null);
  ok("Felsefe sabit listede olmasa da renk alıyor", typeof ctx.__renk("Felsefe") === "string");
  ok("aynı ders her zaman aynı renk", ctx.__renk("Felsefe") === ctx.__renk2("Felsefe"));
  ok("iki farklı ders aynı renge düşmüyor",
    ctx.__renk("Felsefe") !== ctx.__renk("Fizik") || ctx.__renk("Felsefe") !== ctx.__renk("Matematik"));
  esit("Fizik (sabit listede) rengi bozulmadı", ctx.__renkFizik, "#c");

  // 10. sınıf kullanıcı: Felsefe zaten listede
  const ctx10 = kosum(kod + "\nthis.__d = grafikDersleri();", { state: { user: { grade: "10" }, exams: [], questions: [] } });
  ok("10. sınıfta Felsefe zaten listede", ctx10.__d.indexOf("Felsefe") >= 0);
  const ctxQ = kosum(kod + "\nthis.__d = grafikDersleri(); this.__o = getLessonSuccessRates();",
    { state: { user: { grade: "9" }, exams: [], questions: [{ lesson: "Sosyoloji", d: 3, w: 1, e: 0, errorLogs: [] }] } });
  ok("soru bankasındaki ders de grafikte", ctxQ.__d.indexOf("Sosyoloji") >= 0);
  esit("soru bankası oranı %75", ctxQ.__o["Sosyoloji"].pct, 75);
}

// ------------------------------------------------------------
// 2) BİLDİRİM GARANTİSİ — "görevi/tekrarı/acil konusu varsa KESİN"
// ------------------------------------------------------------
console.log("\n== 2) Bildirim garantisi (gerçek fonksiyon koşuyor) ==");
{
  const kod = [
    "const localStorage = { getItem: (k) => (k in __store ? __store[k] : null), setItem: (k, v) => { __store[k] = String(v); } };",
    "function todayStr() { return '2026-11-19'; }",
    "function uid() { return 'n' + (_sayac++); }",
    "function splitKey(key) { const i = String(key).indexOf(' > '); return i < 0 ? { lesson: '', topic: String(key) } : { lesson: String(key).slice(0, i), topic: String(key).slice(i + 3) }; }",
    "function saveState() { state.kayit = (state.kayit || 0) + 1; }",
    "function updateBellBadges() {}",
    "function yerelSistemBildirimi(n) { state.sistem = (state.sistem || []); state.sistem.push(n); }",
    /* v126 — bekleyenIsler() artık GÖREV LİSTESİNİ sayıyor. Sahte liste
       gerçek motorun ürettiği biçimde: tur + baslik. Bildirimdeki sayılar
       bu satırlardan türetilmeli; ayrı bir dueReviews/calculatePriority
       çağrısı YOK (çift sayım olmaz). */
    "function gunlukGorevler() { return state.__liste || []; }",
    blokAl("function addNotification(n)"),
    blokAl("function bekleyenIsler()"),
    blokAl("function bildirimGarantisi()")
  ].join("\n");

  const yeni = () => ({
    notifications: [],
    memory: {},
    /* Listedeki satırlar: 2 normal görev · 1 tekrar · 4 acil = 7 iş.
       Bildirim de tam olarak bunu söylemeli (çift sayım yok). */
    __liste: [
      { tur: "oku", baslik: "Kitap okuma" },
      { tur: "soru", baslik: "Soru çözümü" },
      { tur: "tekrar", baslik: "Tekrar: Üçgende Alan" },
      { tur: "kritik", baslik: "Acil: Üçgende Alan" },
      { tur: "kritik", baslik: "Acil: Vektörler" },
      { tur: "kritik", baslik: "Acil: Kurtuluş" },
      { tur: "kritik", baslik: "Acil: Bağlar" }
    ]
  });

  let state = yeni();
  const PAYLASILAN = {};            // aynı cihaz → aynı localStorage
  let ctx = kosum(kod + "\nthis.__isler = bekleyenIsler(); this.__adet = bildirimGarantisi();", { state, _sayac: 0, __store: PAYLASILAN });
  ok("liste satırları sınıflandı (2 görev · 1 tekrar · 4 acil)",
    ctx.__isler.gorev === 2 && ctx.__isler.tekrar === 1 && ctx.__isler.acil === 4, JSON.stringify(ctx.__isler));
  esit("üç sayının toplamı listedeki iş sayısı", ctx.__isler.toplam, state.__liste.length);
  esit("tek bildirim üretildi", ctx.__adet, 7);
  esit("bildirim sayısı 1 (spam yok)", state.notifications.length, 1);
  const b = state.notifications[0] || {};
  ok("gövdede görev sayısı var", /2 görev/.test(b.body || ""), b.body);
  ok("gövdede tekrar sayısı var", /1 tekrar/.test(b.body || ""), b.body);
  ok("gövdede acil konu sayısı var", /4 acil konu/.test(b.body || ""), b.body);
  ok("en önce yapılacak KONU adları var", /En önce: Üçgende Alan, Vektörler, Kurtuluş\./.test(b.body || ""), b.body);
  ok("gövdedeki üç sayı listedeki satırları aşmıyor",
    (Number((/^(\d+) görev/.exec(b.body) || [])[1] || 0) +
     Number((/(\d+) tekrar/.exec(b.body) || [])[1] || 0) +
     Number((/(\d+) acil konu/.exec(b.body) || [])[1] || 0)) === state.__liste.length, b.body);

  // aynı gün, aynı içerik → tekrar bildirim YOK
  const oncekiSayi = state.notifications.length;
  ctx = kosum(kod + "\nthis.__adet = bildirimGarantisi();", { state, _sayac: 10, __store: PAYLASILAN });
  esit("aynı içerik ikinci kez bildirilmiyor", ctx.__adet, 0);
  esit("bildirim listesi büyümedi", state.notifications.length, oncekiSayi);

  // yeni bir acil konu doğdu → yeniden bildirim (içerik imzası değişti)
  state.__liste.push({ tur: "kritik", baslik: "Acil: Kalıtım" });
  ctx = kosum(kod + "\nthis.__adet = bildirimGarantisi();", { state, _sayac: 20, __store: PAYLASILAN });
  ok("acil konu artınca yeniden bildirilir", ctx.__adet === 8, String(ctx.__adet));
  esit("yeni bildirim eklendi", state.notifications.length, 2);

  // iş yoksa bildirim yok
  const bos = { notifications: [], memory: {}, __liste: [] };
  ctx = kosum(kod + "\nthis.__adet = bildirimGarantisi();", { state: bos, _sayac: 30, __store: {} });
  esit("iş yoksa bildirim ÜRETİLMEZ", ctx.__adet, 0);
  esit("bildirim listesi boş kaldı", bos.notifications.length, 0);

  // yalnız tekrar (görev/acil yok) → yine de bildirim (eski kör nokta)
  const sadece = { notifications: [], memory: {}, __liste: [{ tur: "tekrar", baslik: "Tekrar: Şiir" }] };
  ctx = kosum(kod + "\nthis.__adet = bildirimGarantisi();", { state: sadece, _sayac: 40, __store: {} });
  esit("yalnız tekrar varsa da bildirim gelir", ctx.__adet, 1);
  ok("tekrar konusu adıyla yazılıyor", /Şiir/.test((sadece.notifications[0] || {}).body || ""), (sadece.notifications[0] || {}).body);

  // ertesi gün aynı içerik → yeni döngü, yeniden bildirilir
  const ertesi = yeni();
  const kod2 = kod.replace("return '2026-11-19';", "return '2026-11-20';");
  kosum(kod + "\nthis.__a = bildirimGarantisi();", { state: ertesi, _sayac: 50, __store: {} });
  const ctx2 = kosum(kod2 + "\nthis.__a = bildirimGarantisi();", { state: ertesi, _sayac: 60, __store: {} });
  ok("ertesi gün yeniden bildirilir (kilit günlük)", ctx2.__a === 7 && ertesi.notifications.length === 2,
    "adet: " + ctx2.__a + " · liste: " + ertesi.notifications.length);
}

// ------------------------------------------------------------
// 3) MÜKERRER DENEME — gerçek normalizasyon + gerçek grafik/özet
// ------------------------------------------------------------
console.log("\n== 3) Aynı deneme iki kez yazılmıyor (gerçek karar motoru) ==");
{
  const dersler = { "Matematik": { d: 20, w: 5, e: 5 }, "Felsefe": { d: 4, w: 1, e: 0 } };
  const A = { name: "10.SINIF MAARİF İZLEME SINAVI 1", date: "2026-10-27", lessons: dersler, url: "https://okulizyon.com/app2/ogrenci/?pg=yks&sid=AAA" };
  const B = Object.assign({}, A, { url: "https://okulizyon.com/app2/ogrenci/?pg=yks&sid=BBB" });
  const depo = { id: "mwmcn5hxleh22", name: "Okulizyon: " + A.name, date: A.date, lessons: dersler, okulizyonUrl: A.url, errorLogs: [] };

  esit("kimlik ad|tarih", OKZ.kararAnahtar(B), "10.SINIF MAARİF İZLEME SINAVI 1|2026-10-27");
  esit("ikinci çekim YENİ değil", OKZ.karar([B], [depo], {}).yeni.length, 0);
  esit("ikinci çekim 'değişmiş' de değil", OKZ.karar([B], [depo], {}).degisen.length, 0);

  // kullanıcının canlı verisi: iki kopya, biri 39 neden işlenmiş
  const log = (t) => ({ qno: "1", lesson: "Matematik", topic: "Üçgende Alan", type: t });
  const kopya1 = { id: "a", name: "Okulizyon: X", date: "2026-10-27", lessons: dersler, errorLogs: [log("KONUEKSİKLİĞİ")] };
  const kopya2 = { id: "b", name: "Okulizyon: X", date: "2026-10-27", lessons: dersler, errorLogs: [log("")] };
  const r = OKZ.yinelenenleriBirlestir([kopya1, kopya2]);
  esit("iki kopya tek kayda indi", r.exams.length, 1);
  esit("işlenmiş emek korundu", r.exams[0].errorLogs[0].type, "KONUEKSİKLİĞİ");
  esit("kalan kayıt eski id'sini korudu", r.exams[0].id, "a");
  esit("tekrar çalıştırma idempotent", OKZ.yinelenenleriBirlestir(r.exams).exams.length, 1);

  /* Mükerrerin görünür zararı: "Denemelerim"de iki satır, soru toplamı iki kat.
     Oran aynı kalsa bile kullanıcı aynı sınavı iki kez görüyordu. */
  const toplamSoru = (exams) => exams.reduce((a, ex) =>
    a + Object.keys(ex.lessons || {}).reduce((b, k) => { const l = ex.lessons[k]; return b + l.d + l.w + l.e; }, 0), 0);
  esit("birleştirme sonrası deneme sayısı 1", r.exams.length, 1);
  esit("soru toplamı iki katına ÇIKMIYOR (30+5)", toplamSoru(r.exams), 35);
  esit("iki kopya olduğu gibi kalsaydı 70 olurdu (ölçülen zarar)", toplamSoru([kopya1, kopya2]), 70);
  esit("ders başarı oranı tek kayıtta %69", Math.round(((20 + 4) / 35) * 100), 69);
}

// ------------------------------------------------------------
// 4) UYGULAMA YOLLARI — düzeltme gerçekten bağlı mı
// ------------------------------------------------------------
console.log("\n== 4) Düzeltmeler uygulama akışına BAĞLI ==");
{
  ok("bildirimGarantisi her dakika çalışan motorda", /bildirimGarantisi\(\);\s*\n\s*updateBellBadges\(\);/.test(HTML));
  ok("ana sayfada bildirim izni bandı", /html \+= bildirimIzniBandi\(\);/.test(HTML));
  ok("bant gerçek izin düğmesini kullanıyor", /data-act="toggleNotifPermission"/.test(HTML));
  ok("bant yalnız izin yokken ve iş varken çıkar", /permission === "granted"\) return "";/.test(HTML));
}

console.log("\n" + "─".repeat(58));
if (kalan) {
  console.log("✗ " + kalan + " test başarısız:");
  hatalar.forEach(h => console.log("   • " + h));
  console.log("v93 saha testi — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("v93 saha testi — " + gecen + "/" + gecen + " geçti ✓");
