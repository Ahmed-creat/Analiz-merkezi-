/* v63 — "PROFESYONEL UYGULAMA" KONTRATI
   ------------------------------------------------------------
   KULLANICI: "Bu profildeki bağlantıyı yenile neden var? Ben profesyonel
   uygulamalarda öyle bir şey olduğunu sanmıyorum."

   HAKLI. Onarım kullanıcıya iş olarak verilmez. Profesyonel uygulamada
   bağlantı kendini onarır. Bu yüzden profildeki
     • "Bağlantıyı yenile"
     • "Bildirim kanalını test et"
   düğmeleri kaldırıldı. Ölçüm ve onarım kodda AYNEN duruyor; yalnız
   kullanıcıya düğme olarak gösterilmiyor.

   KORUNAN OTOMATİK ONARIM YOLLARI (ölçülüyor):
     1. push-bildirim.js otomatik()  → açılışta abonelik yoksa kurar
     2. sw.js pushsubscriptionchange → tarayıcı aboneliği değiştirirse yeni ucu yazar
     3. push-tani 404/410            → ölü aboneliği pasife alır
     4. index.html focus             → sayfaya dönüşte tazeler
*/
"use strict";
const fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "..");
const oku = (p) => fs.readFileSync(path.join(KOK, p), "utf8");
const APP = oku("site/app-pwa.js");
const PUSH = oku("site/push-bildirim.js");
const HTML = oku("site/index.html");
const SW = oku("site/sw.js");
const TANI = oku("supabase/functions/push-tani/index.ts");

let gecen = 0; const hata = [];
const ok = (ad, kosul, ek) => {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { hata.push(ad); console.log("  ✗ " + ad + (ek ? "  → " + ek : "")); }
};

console.log("\n== 1) Profilde onarım düğmesi YOK ==");
ok("“Bağlantıyı yenile” metni hiçbir yerde yok",
  !APP.includes("Bağlantıyı yenile") && !HTML.includes("Bağlantıyı yenile") &&
  !PUSH.includes("Bağlantıyı yenile") && !SW.includes("Bağlantıyı yenile"));
ok("amBildirimOnar düğmesi basılmıyor", !/data-act="amBildirimOnar"/.test(APP));
ok("amKanalTesti düğmesi basılmıyor", !/data-act="amKanalTesti"/.test(APP));
ok("metinler kullanıcıyı düğmeye yönlendirmiyor",
  !/dokun\.?"/.test(APP) || !/yenile”ye dokun/.test(APP));

console.log("\n== 2) Durum satırı kalıyor (bilgi var, iş yok) ==");
ok("profilde bildirim durumu yazılıyor", /id="pwa-push-durum"/.test(APP));
ok("günde 2 hatırlatma saati yazılı", /Günde 2 hatırlatma: sabah 07:35 · akşam 19:30/.test(APP));
ok("cihaz aldı/almadı dürüstçe ayrılıyor", /cihaz aldı ✓/.test(APP) && /cihaza ulaştığına dair iz yok/.test(APP));

console.log("\n== 3) Onarım OTOMATİK (kullanıcıya iş yok) ==");
ok("açılışta abonelik kendiliğinden kuruluyor", /async function otomatik\(/.test(PUSH));
ok("oturum geç gelirse yeniden deniyor", /if \(otomatikDeneme\+\+ < \d+\) setTimeout\(otomatik/.test(PUSH));
ok("tarayıcı aboneliği değişirse sw yeni ucu yazıyor", /pushsubscriptionchange/.test(SW));
ok("ölü uç (404/410) sunucuda pasife alınıyor", /r\.status === 404 \|\| r\.status === 410/.test(TANI));
ok("sayfaya dönüşte tazeliyor", /window\.addEventListener\("focus"/.test(APP));

console.log("\n== 4) İzin verildiği an tek deneme bildirimi (abartısız metin) ==");
ok("kanal kanıtı bildirimi duruyor", /cihazBildirimTesti/.test(APP));
ok("“her sabah” yerine günde iki kez yazıyor", /Günde iki kez \(sabah ve akşam\)/.test(APP));

console.log("\n== 5) Sürüm damgası ==");
ok("uygulama sürümü v63", /PWA_SURUM = "v63-sade-profil"/.test(APP));

console.log("\n" + "─".repeat(56));
console.log("v63 sade-profil testi — " + gecen + " geçti, " + hata.length + " kaldı");
if (hata.length) { console.log("Kalanlar: " + hata.join(" | ")); process.exit(1); }
