/* v62 — "UYGULAMA KAPALIYKEN BİLDİRİM" KONTRATI
   ------------------------------------------------------------
   KULLANICI (haklı): "PWA'da bildirim gelmesi için uygulamanın açık
   olması gerekmez. Agent'ın söylediği genel olarak yanlış."

   DOĞRU MODEL:
     1. Kullanıcı bir kez abone olur (PushManager.subscribe).
     2. Sunucu (Supabase Cron + Edge Function) push servisine gönderir.
     3. Push servisi (Chrome'da FCM) CİHAZI uyandırır ve service worker'ı
        çalıştırır — sayfa/uygulama açık olmak ZORUNDA DEĞİL.
     4. Service worker "push" olayında showNotification çağırır.

   BURADA ÖLÇÜLEN: kodun hiçbir yerinde "görünür pencere var mı" kapısı
   olmadığı, yani bildirimin uygulama kapalıyken de gösterildiği.

   AYRICA: 16 Kas 07:35'te FCM 201 döndü ama service worker "push" satırı
   yazmadı → mesaj cihaza HİÇ inmedi (uygulama kapalı olduğu için değil,
   cihaz uykuda/bağlantısız olduğu ve TTL 90 dk dolduğu için).
   Bu yüzden TTL 6 saate çıkarıldı, Topic + Urgency: high eklendi.
*/
"use strict";
const fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "..");
const SW = fs.readFileSync(path.join(KOK, "site", "sw.js"), "utf8");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const TANI = fs.readFileSync(path.join(KOK, "supabase", "functions", "push-tani", "index.ts"), "utf8");
const SQL = fs.readFileSync(path.join(KOK, "supabase", "migrations", "0004_webpush_kapali_bildirim.sql"), "utf8");

let gecen = 0; const hata = [];
const ok = (ad, kosul, ek) => {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { hata.push(ad); console.log("  ✗ " + ad + (ek ? "  → " + ek : "")); }
};

console.log("\n== 1) Service worker, uygulama kapalıyken bildirimi GÖSTERİR ==");
ok("push olayı dinleniyor", /self\.addEventListener\("push"/.test(SW));
ok("push olayında showNotification çağrılıyor", /self\.registration\.showNotification\(secim\.title/.test(SW));
ok("GÖRÜNÜR PENCERE ŞARTI YOK (clients.matchAll kapısı yok)",
  !/push[\s\S]{0,400}clients\.matchAll[\s\S]{0,200}showNotification/.test(SW));
ok("waitUntil ile gösterim tamamlanıyor (SW erken kapanmaz)", /event\.waitUntil\(\(async \(\) =>/.test(SW));
ok("gösterim başarısızsa sade seçeneklerle tekrar denenir", /sadeSecenek/.test(SW));

console.log("\n== 2) 'Cihaza ulaştı mı' ölçümü (tahmin değil kayıt) ==");
ok("push ULAŞTI satırı yazılıyor", /asama: "push"/.test(SW));
ok("gösterim sonucu yazılıyor", /asama: "gosterim"/.test(SW));
ok("cihaz aboneliği son 4 hane ile eşleşiyor", /TESLIM_ABONE = a && a\.endpoint/.test(SW));

console.log("\n== 3) Kayıp mesaj: TTL + Topic + Urgency ==");
ok("göç 0004 var", SQL.indexOf("create or replace function public.webpush_tetikle") > 0);
ok("TTL 6 saat (uykudan sonra yaşar)", /'ttl', '21600'/.test(SQL));
ok("Urgency high gönderiliyor", /'urgency', 'high'/.test(SQL));
ok("Topic vardiya başına tek (yığılma yok)", /'topic', 'am-' \|\| to_char\(bugun/.test(SQL));
ok("push-tani varsayılan TTL 21600", /TTL: g\.ttl \? String\(g\.ttl\) : "21600"/.test(TANI));
ok("push-tani Urgency high", /Urgency: g\.urgency \? String\(g\.urgency\) : "high"/.test(TANI));
ok("push-tani Topic başlığı yazıyor", /if \(topic\) basliklar\.Topic = topic;/.test(TANI));
ok("ölü uç (404/410) pasife alınıyor", /r\.status === 404 \|\| r\.status === 410/.test(TANI));
ok("kuru çalıştırma: göndermeden başlıkları doğrular", /if \(g\.kuru === true\)/.test(TANI));

console.log("\n== 4) Mükerrer bildirim yok (yerel telafi + geç gelen push) ==");
ok("yerel telafi ize kaynak:yerel yazıyor", /kaynak: "yerel"/.test(HTML));
ok("sw 3 saat içinde aynı başlığı tekrar göstermiyor",
  /oncekiIz\.kaynak === "yerel"/.test(SW) && /3 \* 3600 \* 1000/.test(SW));
ok("tekrar olsa bile 'ulaştı' kaydı düşülüyor", /tekrar: yerelGosterildi/.test(SW));

console.log("\n== 5) Cihaz pil kısıtı uyarısı (Android) ==");
ok("uyarı metni var", /id="bildirim-uyku-notu"/.test(HTML));
ok("Derin uykudaki uygulamalar listesi anlatılıyor", /Derin uykudaki uygulamalar/.test(HTML));
ok("yalnız Android'de gösterilir", /Android\/i\.test\(navigator\.userAgent/.test(HTML));

console.log("\n== 6) Sürüm damgaları ==");
ok("sw önbellek v62+ (kapalı-bildirim katmanı)",
  Number((SW.match(/const CACHE = "analiz-merkezi-v-\d+-v(\d+)-/) || [])[1]) >= 62);
ok("uygulama sürümü v62+ (kapalı-bildirim katmanı)",
  Number((APP.match(/PWA_SURUM = "v(\d+)-/) || [])[1]) >= 62);

console.log("\n" + "─".repeat(56));
console.log("v62 kapalı-bildirim testi — " + gecen + " geçti, " + hata.length + " kaldı");
if (hata.length) { console.log("Kalanlar: " + hata.join(" | ")); process.exit(1); }
