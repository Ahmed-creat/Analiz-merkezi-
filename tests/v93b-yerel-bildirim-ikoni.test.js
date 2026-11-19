#!/usr/bin/env node
/* ============================================================
   v93b — YEREL BİLDİRİM İKONU (19 Kas 21:14)
   ------------------------------------------------------------
   KULLANICI:
     "Şu an 3dk önce 'Bugün seni bekleyenler' adlı bir bildirim geldi ve bunda
      neden hâlâ ikon sorunu var. 'Akşam: bugün seni bekleyenler' adlı 17 dk
      önce gelen bildirimde ikon sorunu yok ama."

   ÖLÇÜM (canlı `push_teslim`, 21:11):
     20:58 → asama=push  → baslik="Akşam: bugün seni bekleyenler" → gosterildi:true
     21:11 → YALNIZ asama=sw-acildi (push satırı YOK)
   Yani 21:11'deki bildirim SUNUCUDAN GİTMEDİ: uygulamanın kendisi gösterdi
   (bildirimGarantisi → addNotification → yerelSistemBildirimi).

   KÖK NEDEN:
     • Push yolu  (sw.js · bildirimSecenekleri) → icon: bildirim-bos.png,
       badge: bildirim-rozet.png  → büyük görsel BOŞ, üst bar tek renkli.
     • Yerel yol  (index.html)                 → icon: icon-192.png,
       badge: icon-192.png        → büyük görselde koyu uygulama ikonu.
   Aynı kullanıcı iki bildirimi farklı gördü; fark buydu.

   DÜZELTME:
     Yerel yollar da push ile AYNI görselleri kullanır. Ayrıca yerel bildirimin
     başlığı sunucudaki vardiya başlığıyla eşitlendi: "aynı başlık 6 saat
     içinde gösterildiyse tekrar gösterme" kapısı böylece tutar (kullanıcı aynı
     içeriği 20:58 push + 21:11 yerel olarak iki kez aldı).
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const SW = fs.readFileSync(path.join(KOK, "site", "sw.js"), "utf8");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); return true; }
  kalan++; hatalar.push(ad + (ek ? " → " + ek : ""));
  console.log("  ✗ " + ad + (ek ? " → " + ek : ""));
  return false;
}

console.log("\n== 1) Yerel bildirim görselleri push ile AYNI ==");
{
  ok("boş büyük görsel sabiti var", /const BILDIRIM_GORSEL = "\.\/icons\/bildirim-bos\.png";/.test(HTML));
  ok("tek renkli rozet sabiti var", /const BILDIRIM_ROZET = "\.\/icons\/bildirim-rozet\.png";/.test(HTML));
  ok("yerelSistemBildirimi boş görsel + rozet kullanıyor",
    /function yerelSistemBildirimi\(n, simdi\)[\s\S]{0,1600}icon: BILDIRIM_GORSEL, badge: BILDIRIM_ROZET/.test(HTML));
  ok("hatırlatma telafisi de aynı görselleri kullanıyor",
    /function hatirlatmaTelafisi\(\)[\s\S]{0,2600}icon: BILDIRIM_GORSEL, badge: BILDIRIM_ROZET/.test(HTML));
  ok("notifyBrowser de aynı görselleri kullanıyor",
    /new Notification\(title, \{ body: body, icon: BILDIRIM_GORSEL, badge: BILDIRIM_ROZET \}\)/.test(HTML));
  ok("index.html'de UYGULAMA İKONU bildirim görseli olarak KALMADI",
    !/icon: "\.\/icons\/icon-192\.png"/.test(HTML));
  ok("push yolu değişmedi (sw.js boş görsel + rozet)",
    /const icon = n\.icon \|\| data\.icon \|\| BOS_GORSEL;/.test(SW) &&
    /const badge = n\.badge \|\| data\.badge \|\| ROZET_URL;/.test(SW));
  ok("app-pwa.js test bildirimi de aynı görsellerde",
    /icon: "\.\/icons\/bildirim-bos\.png", badge: "\.\/icons\/bildirim-rozet\.png"/.test(APP));
}

console.log("\n== 2) Görsel dosyaları gerçekten var ve servis çalışanı önbelleğinde ==");
{
  const bos = path.join(KOK, "site", "icons", "bildirim-bos.png");
  const rozet = path.join(KOK, "site", "icons", "bildirim-rozet.png");
  ok("bildirim-bos.png var", fs.existsSync(bos));
  ok("bildirim-rozet.png var", fs.existsSync(rozet));
  ok("boş görsel gerçekten küçük (koyu kare değil)", fs.existsSync(bos) && fs.statSync(bos).size < 2000,
    fs.existsSync(bos) ? fs.statSync(bos).size + " bayt" : "");
  ok("rozet offline için önbellek listesinde",
    /"\.\/icons\/bildirim-rozet\.png"/.test(SW) && /"\.\/icons\/bildirim-bos\.png"/.test(SW));
}

console.log("\n== 3) Aynı içerik iki kez gösterilmiyor (başlık vardiyaya bağlı) ==");
{
  ok("başlık vardiyaya göre seçiliyor",
    /const baslik = new Date\(\)\.getHours\(\) < 14 \? "Bugün seni bekleyenler" : "Akşam: bugün seni bekleyenler";/.test(HTML));
  ok("akşam başlığı sunucudakiyle aynı",
    /Akşam: bugün seni bekleyenler/.test(HTML) &&
    /'Akşam: bugün seni bekleyenler'/.test(fs.readFileSync(path.join(KOK, "supabase", "migrations", "0010_bildirim_garantisi.sql"), "utf8")));
  ok("yerel gösterim 'aynı başlık 6 saat' kapısını kullanıyor",
    /const ayni = iz && iz\.baslik && iz\.baslik === String\(n\.title \|\| ""\) &&[\s\S]{0,120}6 \* 3600 \* 1000/.test(HTML));
  ok("bildirim türü için ikon eşlemesi var", /garanti: "bell-ring"/.test(HTML));
}

console.log("\n== 4) Gece sessizliği (sunucu 21–06 susuyor, uygulama da sussun) ==");
{
  ok("sessizSaatMi yardımcısı var", /function sessizSaatMi\(d\) \{/.test(HTML));
  ok("06:00–20:59 dışında sistem bildirimi gösterilmiyor",
    /function yerelSistemBildirimi\(n, simdi\)[\s\S]{0,600}if \(sessizSaatMi\(simdi\)\) return;/.test(HTML));
  ok("uygulama içi kayıt silinmiyor (bildirim listede kalır)",
    /yerelSistemBildirimi\(n\);\s*\/\/ v56/.test(HTML));
  const SQL10 = fs.readFileSync(path.join(KOK, "supabase", "migrations", "0010_bildirim_garantisi.sql"), "utf8");
  ok("hatırlatma telafisi de gece susuyor",
    /const vardiya = telafiVardiyasi\(d\);\s*\n\s*if \(!vardiya\) return;\s*\n[\s\S]{0,160}if \(sessizSaatMi\(d\)\) return;/.test(HTML));
  ok("sunucu da aynı pencereyi kullanıyor", /saat < 6 or saat >= 21/.test(SQL10));
}

console.log("\n== 5) Sürüm damgası (kullanıcı yeni sürümü görsün) ==");
{
  ok("PWA sürümü v93b+", /const PWA_SURUM = "v93[b-z]?-[a-z-]+";/.test(APP), (APP.match(/PWA_SURUM = "([^"]+)"/)||[])[1]);
  ok("service worker cache v93b+", /v93[b-z]?-[a-z-]+/.test(SW), (SW.match(/const CACHE = "([^"]+)"/)||[])[1]);
}

console.log("\n" + "─".repeat(58));
if (kalan) {
  console.log("✗ " + kalan + " test başarısız:");
  hatalar.forEach(h => console.log("   • " + h));
  console.log("v93b ikon — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("v93b ikon — " + gecen + "/" + gecen + " geçti ✓");
