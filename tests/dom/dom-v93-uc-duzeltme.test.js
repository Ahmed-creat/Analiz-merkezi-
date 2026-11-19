#!/usr/bin/env node
/* ============================================================
   v93 — ÜÇ SAHA HATASI, GERÇEK UYGULAMA AÇILIŞINDA ÖLÇÜM
   ------------------------------------------------------------
   site/index.html jsdom içinde GERÇEKTEN çalıştırılır; kullanıcının
   bildirdiği üç durum birebir kurulur:

     1) "Aynı deneme bugün kendiliğinden 2. kez eklendi"
        → aynı sınav iki kez yazılmış state ile açılır; açılış onarımı
          iki kopyayı TEK kayda indirir ve nedeni işlenmiş satırlar korunur.

     2) "Bugün kaydolan kullanıcı ... felsefe yer almadığını söylüyor"
        → yeni hesap (grade 9) + Okulizyon denemesinde Felsefe 5 soru.
          Ders başarı grafiğinin verisi Felsefe'yi İÇERİR (eskiden
          LESSON_CONFIG'te olmadığı için sessizce düşüyordu).

     3) "kullanıcının görevi, acil konusu, tekrarı varsa kesin bildirim gelmeli"
        → bekleyen iş varken uygulama içi bildirim doğar; izin yoksa ana
          sayfada tek dokunuşluk uyarı çıkar.

   Çalıştır: node tests/dom/dom-v93-uc-duzeltme.test.js
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
let JSDOM, VirtualConsole;
try { ({ JSDOM, VirtualConsole } = require("jsdom")); }
catch (e) {
  console.log("DOM testi ATLANDI: jsdom kurulu değil (npm i -D jsdom)");
  process.exit(0);
}

const KOK = path.join(__dirname, "..", "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
// jsdom dış dosyaları yüklemez; üretimde <script src="okz-normalize.js"> ile
// gelen modülü pencereye biz veriyoruz (aynı dosya, aynı sürüm).
const OKZ = require(path.join(KOK, "site", "okz-normalize.js"));
const BUGUN = new Date().toISOString().slice(0, 10);

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); return true; }
  kalan++; hatalar.push(ad + (ek ? " → " + ek : ""));
  console.log("  ✗ " + ad + (ek ? " → " + ek : ""));
  return false;
}
const bekle = (ms) => new Promise(r => setTimeout(r, ms));

/* Kullanıcının canlı hesabı: 9. sınıf + iki kopya Okulizyon denemesi */
function durum(kopyali) {
  const dersler = { "Matematik": { d: 18, w: 4, e: 3 }, "Felsefe": { d: 4, w: 1, e: 0 } };
  const nedeniIslenmis = [{ qno: "1", lesson: "Matematik", topic: "Üçgende Alan", type: "KONUEKSİKLİĞİ", date: BUGUN }];
  const bosNedenler = [{ qno: "1", lesson: "Matematik", topic: "Üçgende Alan", type: "", date: BUGUN }];
  const ilk = { id: "mwmcn5hxleh22", name: "Okulizyon: 10.SINIF MAARİF İZLEME SINAVI 1", date: BUGUN,
    lessons: dersler, errorLogs: nedeniIslenmis, total: 35, net: 24,
    okulizyonUrl: "https://okulizyon.com/app2/ogrenci/?pg=yks&sid=AAAA" };
  const kopya = { id: "mwnu3b2u88ntv", name: "Okulizyon: 10.SINIF MAARİF İZLEME SINAVI 1", date: BUGUN,
    lessons: dersler, errorLogs: bosNedenler, total: 35, net: 24,
    okulizyonUrl: "https://okulizyon.com/app2/ogrenci/?pg=yks&sid=BBBB" };
  return {
    user: { name: "Yeni Öğrenci", grade: "9" },
    exams: kopyali ? [ilk, kopya] : [ilk],
    questions: [],
    settings: { greetedToday: BUGUN, notifPermission: "default", lastCoachDay: BUGUN },
    dailyTasks: { study: false, read: false, solve: false, date: BUGUN },
    notifications: []
  };
}

async function ac(state, ayar) {
  const o = ayar || {};
  const vc = new VirtualConsole();
  const hatalarJs = [];
  vc.on("jsdomError", e => { if (!/Not implemented/.test(String(e && e.message))) hatalarJs.push(String(e && e.message)); });
  const dom = new JSDOM(HTML, {
    url: "https://analiz-merkezi.vercel.app/",
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(w) {
      w.localStorage.setItem("analizmerkezi_v6", JSON.stringify(state));
      w.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}), text: () => Promise.resolve("") });
      w.matchMedia = w.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
      w.scrollTo = () => {};
      w.OKZ = OKZ;                       // üretimde klasik <script> ile gelir
      if (o.izin) {                      // jsdom'da izin durumu taklit edilir
        const N = function Notification() {};
        N.permission = o.izin;
        N.requestPermission = () => Promise.resolve(o.izin);
        w.Notification = N;
      }
    }
  });
  await new Promise(r => {
    if (dom.window.document.readyState === "complete") return r();
    dom.window.addEventListener("load", r);
  });
  await bekle(700);
  return { dom, w: dom.window, hatalarJs };
}

(async () => {
  // ---------------------------------------------------------
  console.log("\n== 1) Felsefe ders başarı grafiğinde VAR ==");
  {
    const { dom, w } = await ac(durum(false));
    const rates = JSON.parse(w.eval("JSON.stringify(getLessonSuccessRates())"));
    ok("Felsefe grafik verisinde", !!rates["Felsefe"], JSON.stringify(Object.keys(rates)));
    ok("Felsefe oranı gerçek veriden (%80)", rates["Felsefe"] && rates["Felsefe"].pct === 80,
      rates["Felsefe"] && String(rates["Felsefe"].pct));
    ok("Felsefe soru sayısı 5", rates["Felsefe"] && rates["Felsefe"].total === 5);
    ok("sabit 8 ders de listede (kimse kaybolmadı)",
      ["Matematik", "Fizik", "Kimya", "Biyoloji", "Tarih", "Coğrafya", "Din Kültürü", "Türk Dili ve Edebiyatı"]
        .every(k => k in rates));
    ok("veri yoksa oran null (uydurma yüzde yok)", rates["Kimya"] === null);
    ok("grafik ders listesinde Felsefe", JSON.parse(w.eval("JSON.stringify(grafikDersleri())")).indexOf("Felsefe") >= 0);
    ok("Felsefe'nin rengi var", typeof w.eval("lessonChartColor('Felsefe')") === "string");
    dom.window.close();
  }

  // ---------------------------------------------------------
  console.log("\n== 2) Mükerrer deneme tek kayda iniyor ==");
  {
    const { dom, w } = await ac(durum(true));
    // Uygulamanın kullandığı AYNI birleştirici (site/okz-normalize.js)
    const sonuc = JSON.parse(w.eval("JSON.stringify(window.OKZ.yinelenenleriBirlestir(state.exams))"));
    ok("tek deneme kaldı", sonuc.exams.length === 1, "adet: " + sonuc.exams.length);
    ok("bir kayıt birleştirildi", sonuc.birlestirilen === 1, String(sonuc.birlestirilen));
    ok("nedeni işlenmiş satır korundu",
      sonuc.exams[0] && sonuc.exams[0].errorLogs[0] && sonuc.exams[0].errorLogs[0].type === "KONUEKSİKLİĞİ",
      sonuc.exams[0] && JSON.stringify(sonuc.exams[0].errorLogs));
    ok("kalan kayıt eski id'sini korudu", sonuc.exams[0] && sonuc.exams[0].id === "mwmcn5hxleh22", sonuc.exams[0] && sonuc.exams[0].id);
    ok("tekrar çalıştırma idempotent", JSON.parse(w.eval("JSON.stringify(window.OKZ.yinelenenleriBirlestir(state.exams).exams)")).length === 1);
    ok("uygulama açılışta bu birleştirmeyi çağırıyor", /function pwaArayuzKur\(\)[\s\S]{0,900}okzTekrarlariBirlestir\(\)/.test(APP));
    ok("oturum açılınca da çağırıyor", /okzKonulariOnar\(sessiz\)[\s\S]{0,400}okzTekrarlariBirlestir\(\)/.test(APP));
    ok("her çekimden sonra da çağırıyor", /okzDenemeyeYaz\(ex, dersler\);[\s\S]{0,400}okzTekrarlariBirlestir\(\);/.test(APP));
    dom.window.close();
  }

  // ---------------------------------------------------------
  console.log("\n== 3) Bekleyen iş varsa bildirim GELİR ==");
  {
    const { dom, w } = await ac(durum(false));
    const isler = JSON.parse(w.eval("JSON.stringify(bekleyenIsler())"));
    ok("görev sayısı bulundu", isler.gorev > 0, JSON.stringify(isler));
    ok("acil konu bulundu", isler.acil > 0, JSON.stringify(isler));
    ok("acil konunun ADI var", (isler.acilAdlar || []).indexOf("Üçgende Alan") >= 0, JSON.stringify(isler.acilAdlar));
    const notif = JSON.parse(w.eval("JSON.stringify(state.notifications)"));
    const garanti = notif.filter(n => n.kind === "garanti");
    ok("bildirim üretildi", garanti.length === 1, "adet: " + garanti.length);
    ok("gövde görev/acil sayısını yazıyor", /görev/.test(garanti[0] && garanti[0].body) && /acil konu/.test(garanti[0] && garanti[0].body),
      garanti[0] && garanti[0].body);
    ok("en önce yapılacak konu adı var", /Üçgende Alan/.test(garanti[0] && garanti[0].body), garanti[0] && garanti[0].body);
    ok("ana sayfada bildirim izni uyarısı çıktı", w.eval("document.body.innerHTML.indexOf('Bekleyen işin var') >= 0"));
    ok("uyarı düğmesi gerçek izin akışına bağlı", w.eval("!!document.querySelector('[data-act=\"toggleNotifPermission\"]')"));
    dom.window.close();
  }

  // ---------------------------------------------------------
  console.log("\n== 4) Bildirim izni verilmişse uyarı ÇIKMAZ ==");
  {
    const { dom, w } = await ac(durum(false));
    // İzin durumunu sayfanın İÇİNDE değiştirip uygulamanın kendi fonksiyonunu
    // çağırıyoruz: "granted ise bant yok" kuralı gerçekten çalışıyor mu?
    const cikti = w.eval(`(function () {
      try { Object.defineProperty(window, "Notification", { configurable: true,
        value: Object.assign(function Notification() {}, { permission: "granted", requestPermission: function () { return Promise.resolve("granted"); } }) }); } catch (e) { return "TANIMSIZ"; }
      return bildirimIzniBandi();
    })()`);
    ok("izin açıkken bant ÜRETİLMİYOR", cikti === "", String(cikti).slice(0, 80));
    const red = w.eval(`(function () {
      try { Object.defineProperty(window, "Notification", { configurable: true,
        value: Object.assign(function Notification() {}, { permission: "denied", requestPermission: function () { return Promise.resolve("denied"); } }) }); } catch (e) { return "TANIMSIZ"; }
      return bildirimIzniBandi();
    })()`);
    ok("izin reddedilmişse yol gösteren bant var", /kilit simgesi|Bildirimler/i.test(String(red)), String(red).slice(0, 120));
    dom.window.close();
  }

  // ---------------------------------------------------------
  console.log("\n== 5) İş yoksa uydurma bildirim yok ==");
  {
    const s = durum(false);
    s.dailyTasks = { study: true, read: true, solve: true, date: BUGUN };
    s.exams = [];
    s.questions = [];
    s.notifications = [];
    const { dom, w } = await ac(s);
    const notif = JSON.parse(w.eval("JSON.stringify(state.notifications)")).filter(n => n.kind === "garanti");
    ok("bekleyen iş yokken 'garanti' bildirimi üretilmedi", notif.length === 0, "adet: " + notif.length);
    dom.window.close();
  }

  console.log("\n" + "─".repeat(56));
  console.log(`v93 DOM — ${gecen}/${gecen + kalan} geçti` + (kalan ? "" : " ✓"));
  if (kalan) { hatalar.forEach(h => console.log("  ✗ " + h)); process.exit(1); }
})();
