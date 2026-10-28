#!/usr/bin/env node
/* ============================================================
   BİLDİRİM: İZİN VERİLDİĞİ AN OTOMATİK TEST BİLDİRİMİ
   (tests/bildirim-otomatik.test.js)
   ------------------------------------------------------------
   Kullanıcı şikâyeti: "Test bildirimi gelmiyor."
   v35.7 kararı: Ayarlar'daki test düğmesi KALDIRILDI; izin
   verildiği anda deneme bildirimi otomatik gidiyor.

   Bu test bunu KOD ÇALIŞTIRARAK kanıtlar:
     1) izinIste() → abonelik + kayıt + TEK deneme bildirimi
     2) aynı cihazda ikinci kez GÖNDERİLMEZ (localStorage işareti)
     3) izin reddedilirse deneme bildirimi GÖNDERİLMEZ
     4) izin önceden verilmişse otomatik() bir kez gönderir
     5) Ayarlar'da test düğmesi/paneli YOK

   Çalıştır: node tests/bildirim-otomatik.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const KOK = path.join(__dirname, "..");
const KAYNAK = fs.readFileSync(path.join(KOK, "site", "push-bildirim.js"), "utf8");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ayrinti) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ayrinti ? " → " + ayrinti : "")); return false;
}
function esit(ad, gelen, beklenen) {
  return ok(ad, JSON.stringify(gelen) === JSON.stringify(beklenen), "gelen: " + JSON.stringify(gelen) + " · beklenen: " + JSON.stringify(beklenen));
}

function ortamKur(ayar) {
  const a = ayar || {};
  const cagrilar = [];
  const upsertler = [];
  const depo = Object.assign({}, a.localStorage || {});
  let abonelik = a.abonelik || null;
  const izin = { deger: a.izin || "default" };

  const aboneNesnesi = {
    endpoint: "https://fcm.googleapis.com/fcm/send/test-endpoint",
    toJSON() { return { endpoint: this.endpoint, keys: { p256dh: "BOrnek", auth: "OrnekAuth" } }; },
    options: {},
    unsubscribe: async () => { abonelik = null; }
  };

  const navigator = {
    platform: "test",
    serviceWorker: {
      ready: Promise.resolve({
        pushManager: {
          getSubscription: async () => abonelik,
          subscribe: async () => { abonelik = aboneNesnesi; return aboneNesnesi; }
        }
      })
    }
  };
  const Notification = {
    get permission() { return izin.deger; },
    requestPermission: async function () { izin.deger = a.izinSonucu || "granted"; return izin.deger; }
  };

  const fetch = async function (url, secenekler) {
    const u = String(url);
    const govde = secenekler && secenekler.body ? String(secenekler.body) : "";
    cagrilar.push({ url: u, govde: govde });
    if (u.indexOf("/functions/v1/bildirim-gonder") >= 0) {
      return { ok: true, status: 200, json: async () => ({ gonderilen: 1, sonuc: [{ metin: "gönderildi" }] }) };
    }
    if (u.indexOf("/rest/v1/push_abonelikleri") >= 0) {
      return { ok: true, status: 200, json: async () => ({}) };
    }
    return { ok: false, status: 404, json: async () => ({}) };
  };

  const sandbox = {
    console: { log: console.log, warn() {}, error() {} },
    atob, btoa, Uint8Array, Uint32Array, TextEncoder,
    Date, Math, JSON, Object, Array, Number, String, Boolean, Promise, Error,
    encodeURIComponent,
    navigator, Notification, fetch,
    PushManager: function () {},
    localStorage: {
      getItem(k) { return Object.prototype.hasOwnProperty.call(depo, k) ? depo[k] : null; },
      setItem(k, v) { depo[k] = String(v); },
      removeItem(k) { delete depo[k]; }
    },
    setTimeout: (fn, ms) => (ms >= 6000 ? 0 : setTimeout(fn, ms)),
    clearTimeout,
    currentUser: a.giris === false ? null : { id: "kullanici-1" },
    __amSession: async () => (a.giris === false ? null : { access_token: "jeton" }),
    __amSupabase: a.supabase === false ? null : {
      from() {
        return {
          upsert: async (satir) => { upsertler.push(satir); return { error: null }; },
          select: () => ({ eq() { return { eq() { return { maybeSingle: async () => ({ data: { id: "1" } }) }; } }; } }),
          delete: () => ({ eq() { return { eq: async () => ({ error: null }) }; } })
        };
      }
    },
    SUPABASE_CONFIG: { url: "https://ornek.supabase.co", key: "anon" }
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  return { sandbox, cagrilar, depo, upsertler };
}

const testGonderimleri = (c) => c.filter(x => x.url.indexOf("/functions/v1/bildirim-gonder") >= 0);
const modTest = (c) => testGonderimleri(c).filter(x => /"mod":"test"/.test(x.govde));

(async function () {
  // ---------- 1) izinIste → tek deneme bildirimi ----------
  console.log("\n== 1) İzin verilince otomatik test bildirimi ==");
  const o1 = ortamKur({ izin: "default", izinSonucu: "granted" });
  vm.runInNewContext(KAYNAK, o1.sandbox, { filename: "push-bildirim.js" });
  const AmPush = o1.sandbox.window.AmPush;
  ok("AmPush API kuruldu", !!AmPush);
  ok("testBirKez dışa açık", !!(AmPush && typeof AmPush.testBirKez === "function"));

  const r1 = await AmPush.izinIste();
  ok("izin + abonelik tamam", r1 && r1.ok === true, JSON.stringify(r1));
  esit("tam 1 deneme bildirimi gitti", modTest(o1.cagrilar).length, 1);
  ok("test sonucu sonuçta döndü", !!(r1 && r1.test && r1.test.ok), JSON.stringify(r1 && r1.test));
  esit("cihaz işareti yazıldı", o1.depo["am_push_test_gonderildi"], "1");
  ok("abonelik hesaba yazıldı (upsert veya REST)",
    o1.upsertler.length > 0 || o1.cagrilar.some(x => x.url.indexOf("push_abonelikleri") >= 0),
    "upsert: " + o1.upsertler.length);

  // ---------- 2) İkinci izin isteği → tekrar GÖNDERİLMEZ ----------
  console.log("\n== 2) Aynı cihazda tekrar gönderilmez ==");
  await AmPush.izinIste();
  esit("hâlâ 1 deneme bildirimi", modTest(o1.cagrilar).length, 1);
  const r2 = await AmPush.testBirKez();
  ok("ikinci çağrı atlandı", !!(r2 && r2.atlandi === true), JSON.stringify(r2));

  // ---------- 3) İzin reddedilirse gönderilmez ----------
  console.log("\n== 3) İzin reddi → deneme bildirimi YOK ==");
  const o2 = ortamKur({ izin: "default", izinSonucu: "denied" });
  vm.runInNewContext(KAYNAK, o2.sandbox, { filename: "push-bildirim.js" });
  const r3 = await o2.sandbox.window.AmPush.izinIste();
  ok("izin reddedildi olarak döndü", !(r3 && r3.ok === true), JSON.stringify(r3));
  esit("deneme bildirimi gönderilmedi", modTest(o2.cagrilar).length, 0);

  // ---------- 4) İzin önceden verilmişse otomatik() gönderir ----------
  console.log("\n== 4) İzin önceden verilmiş (eski kullanıcı) ==");
  const o3 = ortamKur({ izin: "granted" });
  vm.runInNewContext(KAYNAK, o3.sandbox, { filename: "push-bildirim.js" });
  await o3.sandbox.window.AmPush.otomatik();
  esit("bir kez deneme bildirimi gitti", modTest(o3.cagrilar).length, 1);
  await o3.sandbox.window.AmPush.otomatik();
  esit("ikinci otomatik çağrıda tekrar gitmedi", modTest(o3.cagrilar).length, 1);

  // İşaret zaten varsa hiç göndermez
  const o4 = ortamKur({ izin: "granted", localStorage: { am_push_test_gonderildi: "1" } });
  vm.runInNewContext(KAYNAK, o4.sandbox, { filename: "push-bildirim.js" });
  await o4.sandbox.window.AmPush.otomatik();
  esit("işaret varsa gönderim yok", modTest(o4.cagrilar).length, 0);

  // ---------- 5) Ayarlar: test düğmesi/paneli kaldırıldı ----------
  console.log("\n== 5) Ayarlar temiz ==");
  ok("'Test bildirimi gönder' düğmesi YOK", HTML.indexOf("Test bildirimi gönder") < 0);
  ok("data-act=\"bildirimTest\" YOK", HTML.indexOf('data-act="bildirimTest"') < 0);
  ok("bildirimTest() fonksiyonu YOK", HTML.indexOf("function bildirimTest(") < 0);
  ok("tanılama paneli (✓/✗ listesi) YOK", HTML.indexOf("function bildirimTeshisPaneli(") < 0);
  ok("izin düğmesi DURUYOR", HTML.indexOf('data-act="toggleNotifPermission"') >= 0);
  ok("izin verilince test gideceği yazılı", HTML.indexOf("deneme bildirimi") >= 0);

  console.log("\n" + "─".repeat(56));
  if (kalan) {
    hatalar.forEach(x => console.log(" ✗ " + x));
    console.log("Bildirim otomatik testi — " + gecen + "/" + (gecen + kalan) + " geçti");
    process.exit(1);
  }
  console.log("Bildirim otomatik testi — " + gecen + "/" + gecen + " geçti ✓");
})();
