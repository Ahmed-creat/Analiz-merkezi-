#!/usr/bin/env node
/* ============================================================
   v87 — GÖREV HATIRLATMASI GERÇEKTEN GİDİYOR MU?
   ------------------------------------------------------------
   KULLANICI (18 Kas): "Bugün hiç bildirim gelmedi.
                        Son düzeltmeler neyi değiştirdi."
   ÖLÇÜM (canlı): 18 Kas 07:40 koşusu `bildirim-gonder`e mod:"tekil"
   diyordu; o fonksiyon v59'dan beri yalnız `saglik | test` kabul
   ediyor → HTTP 400 → görev hatırlatması HİÇ gönderilmedi.

   Bu test, düzeltmenin kalıcı olduğunu ölçer:
     1) Ölü yol (bildirim-gonder / mod:"tekil") kullanılmıyor
     2) Gönderim tek kanaldan: push-tani + x-bildirim-secret
     3) Yük biçimi sw.js'in beklediği gibi (title/body/url/kind)
     4) "Cihaz gösterdi" kanıtı push_teslim'den okunuyor (başlık birebir)
     5) Deneme sınırı 3 · sessiz saat 06:00–21:00 · TR günü
   Çalıştır: node tests/v87-gorev-bildirim.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const FN = fs.readFileSync(path.join(KOK, "supabase", "functions", "gorev-hatirlat", "index.ts"), "utf8");
const SW = fs.readFileSync(path.join(KOK, "site", "sw.js"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) gecen++; else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }

console.log("\n== 1) Ölü FCM yolu kaldırıldı ==");
{
  ok("bildirim-gonder çağrısı YOK", FN.indexOf("/functions/v1/bildirim-gonder") < 0);
  ok("mod:\"tekil\" YOK", !/mod:\s*"tekil"/.test(FN));
  ok("gönderim push-tani üzerinden", /\/functions\/v1\/push-tani/.test(FN));
  ok("push-tani'ye gizli anahtar veriliyor", /"x-bildirim-secret":\s*SECRET/.test(FN));
}

console.log("\n== 2) Yük biçimi (sw.js ile uyumlu) ==");
{
  ok("mesaj alanı JSON string", /mesaj:\s*yuk/.test(FN) && /JSON\.stringify\(\{\s*title:/.test(FN));
  ok("title başlık sabitinden", /title:\s*BASLIK/.test(FN));
  ok("body + url + kind var", /body:\s*metin/.test(FN) && /url:\s*"\.\/"/.test(FN) && /kind:\s*"tasks"/.test(FN));
  ok("abonelik_id / ttl / sifreli gönderiliyor",
    /abonelik_id:\s*s\.id/.test(FN) && /ttl:\s*TTL/.test(FN) && /sifreli:\s*"webpush"/.test(FN));
  ok("sw.js başlığı push_teslim'e yazıyor", /baslik:\s*String\(secim\.title/.test(SW));
  ok("sw.js aboneliği son 4 hane olarak yazıyor", /slice\(-4\)/.test(SW));
}

console.log("\n== 3) \"Cihaz gösterdi\" kanıtı (tekrar göndermeme) ==");
{
  ok("push_teslim gosterim sorgusu var", /push_teslim\?select=abonelik&asama=eq\.gosterim&gosterildi=is\.true/.test(FN));
  ok("başlık BİREBİR eşleşiyor", /baslik=eq\." \+ encodeURIComponent\(BASLIK\)/.test(FN));
  ok("son 4 hane eşleşmesi", /function son4\(/.test(FN) && /indexOf\(son4\(s\.endpoint\)\)/.test(FN));
  ok("gösterildiyse atlanıyor", /atlandi:\s*"cihaz gösterdi"/.test(FN));
}

console.log("\n== 4) Deneme sınırı ve sessiz saat ==");
{
  ok("günde en fazla 3 deneme", /const AZAMI_DENEME = 3;/.test(FN) && /deneme >= AZAMI_DENEME/.test(FN));
  ok("deneme anahtarı gün:gorev:try:N", /:gorev:try:/.test(FN));
  ok("çakışmada ikinci gönderim yok", /resolution=ignore-duplicates/.test(FN) && /başka koşu gönderdi/.test(FN));
  ok("sessiz saat 06–21", /trSaat < 6 \|\| trSaat >= 21/.test(FN));
  ok("zorla=1 atlar", /searchParams\.get\("zorla"\) === "1"/.test(FN));
  ok("TR günü UTC+3", /3 \* 3600 \* 1000/.test(FN));
  ok("TTL 90 dk (denemeler 2 saatte bir → mesaj birikmez)", /const TTL = "5400";/.test(FN));
}

console.log("\n== 5) Görev kuralı uygulamayla aynı ==");
{
  ok("dailyTasks bugüne bağlı", /dt\.date \|\| null/.test(FN) && /bugunGecerli/.test(FN));
  ok("konu çalış · kitap oku · soru çöz", /"konu çalış"/.test(FN) && /"kitap oku"/.test(FN) && /"soru çöz"/.test(FN));
  ok("adrese göre tekil gönderim (abonelik döngüsü)", /for \(const s of subs\)/.test(FN));
}

console.log("\n== 6) Güvenlik ==");
{
  ok("gizli anahtar zorunlu", /if \(!SECRET \|\| gelen !== SECRET\)/.test(FN));
  ok("servis anahtarı istemciye sızmıyor (yalnız fetch başlığında)", !/return json\(\{[^}]*SRV/.test(FN));
}

console.log("\n" + "─".repeat(58));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("v87 görev bildirimi — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("v87 görev bildirimi — " + gecen + "/" + gecen + " geçti ✓");
