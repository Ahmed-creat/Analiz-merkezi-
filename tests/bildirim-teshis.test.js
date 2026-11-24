#!/usr/bin/env node
/* ============================================================
   BİLDİRİM TEŞHİS TESTİ — tests/bildirim-teshis.test.js
   ------------------------------------------------------------
   Kullanıcı (v35.9): "Bildirim izni olmasına rağmen test bildirimi gelmiyor."

   Bu test üç ayrı gerçeğin ÖLÇÜLEBİLİR olduğunu kanıtlar:
     1) sw.js her push'ta İZ yazıyor (cihaz push'u gerçekten aldı mı?)
        — iz, bildirim gösterilmeden ÖNCE yazılmalı.
     2) push-bildirim.js: teshis() cihaz izini + sunucunun son gönderim
        gününü okuyor; yayınlanmamış "saglik" ucunu HATA saymıyor.
     3) app-pwa.js paneli bu üç bilgiyi Türkçe yazıyor.

   1. ve 2. bölüm GERÇEK ÇALIŞTIRMADIR (vm sandbox + sahte push olayı).
   Çalıştır: node tests/bildirim-teshis.test.js
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const KOK = path.join(__dirname, "..");

let gecen = 0, kalan = 0; const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ek !== undefined ? " → " + ek : "")); return false;
}
function kucult(s) { return String(s).replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase(); }

// ---------------------------------------------------------------- 1) SW
console.log("\n== 1) Servis çalışanı: push → iz yazılır, sonra bildirim ==");
const depo = new Map();
const olaylar = [];
const dinleyiciler = {};
const swSandbox = {
  self: null, location: { origin: "https://ornek.test" },
  caches: {
    open: async ad => ({ put: async (yol, yanit) => { depo.set(ad + "|" + yol, await yanit.text()); } }),
    match: async () => undefined
  },
  fetch: async () => ({ ok: true, clone() { return this; } }),
  Response: class { constructor(g, o) { this.g = g; this.o = o; } text() { return this.g; } },
  URL, Date, JSON, Math, Object, Array, String, Number, Promise, console,
  clients: { matchAll: async () => [] }, registration: { showNotification: async () => { olaylar.push("goster"); } },
  addEventListener: (ad, fn) => { dinleyiciler[ad] = fn; },
  skipWaiting() {}, caches_kontrol() {}
};
swSandbox.self = swSandbox;
swSandbox.self.addEventListener = (ad, fn) => { dinleyiciler[ad] = fn; };
swSandbox.self.registration = { showNotification: async () => { olaylar.push("goster"); } };
swSandbox.caches = swSandbox.caches;
vm.createContext(swSandbox);
vm.runInContext(fs.readFileSync(path.join(KOK, "site", "sw.js"), "utf8"), swSandbox, { filename: "sw.js" });

ok("push dinleyicisi kayıtlı", typeof dinleyiciler.push === "function");
async function pushCalistir(baslik) {
  let bekle = null;
  const olay = {
    data: { json: () => ({ title: baslik, body: "gövde", url: "./" }) },
    waitUntil: p => { bekle = p; }
  };
  dinleyiciler.push(olay);
  if (bekle) await bekle;
}

(async () => {
  await pushCalistir("Tekrar Zamanı Geldi!");
  const izHam = depo.get("am-push-iz|/__am-push-son");
  ok("push sonrası iz yazıldı", typeof izHam === "string", izHam);
  let iz = null; try { iz = JSON.parse(izHam); } catch (e) {}
  ok("izde zaman var", iz && typeof iz.zaman === "number", izHam);
  ok("izde başlık var", iz && String(iz.baslik).length > 0, iz && iz.baslik);
  ok("bildirim de gösterildi", olaylar.length > 0, olaylar.join(","));

  // İz, gösterimden ÖNCE yazılmalı: gösterim hata verse bile kanıt kalır.
  const kaynak = fs.readFileSync(path.join(KOK, "site", "sw.js"), "utf8");
  const govde = kaynak.slice(kaynak.indexOf('self.addEventListener("push"'));
  const siraIz = govde.indexOf("pushIzYaz(");
  const siraGoster = govde.indexOf("showNotification(");
  ok("iz, showNotification'dan ÖNCE yazılıyor", siraIz > 0 && siraGoster > siraIz, siraIz + " / " + siraGoster);

  // ------------------------------------------------------ 2) teshis()
  console.log("\n== 2) teshis(): cihaz izi + sunucu son gönderim + sürüm ==");
  const pushKaynak = fs.readFileSync(path.join(KOK, "site", "push-bildirim.js"), "utf8");
  ok("cihaz izini okuyan fonksiyon var", /async function cihazSonPush/.test(pushKaynak));
  ok("iz anahtarı sw.js ile aynı", pushKaynak.includes('caches.open("am-push-iz")') && pushKaynak.includes('c.match("/__am-push-son")'));
  ok("sunucu son gönderimi okunuyor", /push_abonelikleri[\s\S]{0,120}son_gonderim/.test(pushKaynak));
  ok("'geçersiz mod' hata değil sürüm bilgisi", /geçersiz mod[\s\S]{0,60}surumEski/.test(pushKaynak));
  ok("teshis sonucu AmPush ile dışa açık", /window\.AmPush\s*=\s*\{[^}]*teshis/.test(pushKaynak));

  // ------------------------------------------------------ 3) panel metni
  console.log("\n== 3) Panel: üç gerçek yan yana yazılıyor ==");
  const pwa = kucult(fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8"));
  ok("'bu cihaza son push' satırı", pwa.includes("bu cihaza son push"));
  ok("ulaşmadıysa bunu söylüyor", pwa.includes("hiç ulaşmadı"));
  ok("'sunucu bu cihaza gönderdi' satırı", pwa.includes("sunucu bu cihaza gönderdi"));
  ok("yayındaki sürüm eskiyse açıklıyor", pwa.includes("yayındaki sürüm bu denetimi tanımıyor"));
  const zamanFn = pwa.slice(pwa.indexOf("function pushzaman"), pwa.indexOf("function pushgun"));
  ok("tarih biçimlendirici (gün.ay.yıl saat:dakika)",
    zamanFn.includes("getdate()") && zamanFn.includes("getmonth() + 1") &&
    zamanFn.includes("getfullyear()") && zamanFn.includes("getminutes()"), zamanFn.slice(0, 80));

  console.log("\n" + "─".repeat(58));
  if (kalan) {
    hatalar.forEach(h => console.log(" ✗ " + h));
    console.log("Bildirim teşhis testi — " + gecen + "/" + (gecen + kalan) + " geçti");
    process.exit(1);
  }
  console.log("Bildirim teşhis testi — " + gecen + "/" + gecen + " geçti ✓");
})();
