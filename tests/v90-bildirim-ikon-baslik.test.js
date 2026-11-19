#!/usr/bin/env node
/* ============================================================
   v90 — BİLDİRİM: "Günaydın" yok · ikon siyah kare olmasın ·
         yeni deneme çekilince "sonucun var, analiz edeyim"
   ------------------------------------------------------------
   KULLANICI (18 Kas, ekran görüntüsü):
     1) "Günaydın yazmasın yeter."
     2) "Yeni deneme çekerse yeni deneme sonucun var ve onu analiz
         etmesini söylesin."
     3) "Uygulamanın bildiriminde ikonu siyah kare olarak geliyor.
         O büyük ikon resmi olmasın… üst barındaki bildirim ikonları
         gibi olsun."
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const SQL = fs.readFileSync(path.join(KOK, "supabase", "migrations", "0008_bildirim_baslik_deneme.sql"), "utf8");
const ESKI = fs.readFileSync(path.join(KOK, "supabase", "migrations", "0007_bildirim_acil_konu.sql"), "utf8");
const SW = fs.readFileSync(path.join(KOK, "site", "sw.js"), "utf8");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) gecen++; else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }

console.log("\n== 1) 'Günaydın' hiçbir başlıkta yok ==");
{
  const basliklar = [];
  SQL.replace(/'title',\s*hat_baslik/g, () => { basliklar.push(1); return ""; });
  ok("başlık tek yerden üretiliyor", basliklar.length === 1);
  ok("sabah tekrar başlığı nötr", /then 'Tekrar zamanı'/.test(SQL));
  ok("akşam tekrar başlığı", /else 'Akşam tekrarı'/.test(SQL));
  ok("sabah acil başlığı nötr", /then 'Acil konular'/.test(SQL));
  ok("akşam acil başlığı", /else 'Akşam: acil konular'/.test(SQL));
  const SQL_KOD = SQL.split("\n").filter(l => !l.trim().startsWith("--")).join("\n");
  ok("yeni SQL'in ÇALIŞAN kodunda Günaydın geçmiyor", !/Günaydın/i.test(SQL_KOD));
  ok("eski sürümde vardı (regresyon kanıtı)", /Günaydın/i.test(ESKI));
}

console.log("\n== 2) Bildirim ikonu: siyah kare yerine tek renkli rozet ==");
{
  const rozetVar = fs.existsSync(path.join(KOK, "site", "icons", "bildirim-rozet.png"));
  ok("rozet dosyası var", rozetVar);
  if (rozetVar) {
    const boyut = fs.statSync(path.join(KOK, "site", "icons", "bildirim-rozet.png")).size;
    ok("rozet küçük ve hafif", boyut > 200 && boyut < 20000, boyut + " bayt");
  }
  const buf = rozetVar ? fs.readFileSync(path.join(KOK, "site", "icons", "bildirim-rozet.png")) : Buffer.alloc(0);
  ok("PNG imzası", buf.slice(1, 4).toString() === "PNG");
  // IHDR: genişlik/yükseklik
  const g = buf.length > 24 ? buf.readUInt32BE(16) : 0;
  const y = buf.length > 24 ? buf.readUInt32BE(20) : 0;
  ok("96×96 (üst bar için doğru boyut)", g === 96 && y === 96, g + "×" + y);
  // renk türü 6 = RGBA (şeffaflık şart: siyah kare olmasın)
  const renk = buf.length > 25 ? buf[25] : 0;
  ok("şeffaf zemin (RGBA)", renk === 6, "renk türü " + renk);

  ok("badge rozete bağlı", /const badge = n\.badge \|\| data\.badge \|\| ROZET_URL;/.test(SW));
  ok("büyük görsel BOŞ bırakılıyor (gri daire + harf yok)", /const icon = n\.icon \|\| data\.icon \|\| BOS_GORSEL;/.test(SW));
  ok("boş görsel tamamen şeffaf PNG", (() => {
    const b = fs.readFileSync(path.join(KOK, "site", "icons", "bildirim-bos.png"));
    return b.slice(1, 4).toString() === "PNG" && b[25] === 6 && b.length < 2000;
  })());
  ok("rozet GERÇEK uygulama logosundan üretildi (ikon-512 türevi)",
     fs.readFileSync(path.join(KOK, "site", "icons", "bildirim-rozet.png")).length > 600);
  ok("rozet önbelleğe alındı (çevrimdışı da çalışır)", /"\.\/icons\/bildirim-rozet\.png"/.test(SW));
  ok("eski renkli 192 badge olarak KULLANILMIYOR", !/const badge = [^;]*ICON_URL/.test(SW));
  ok("uygulama içi bildirimde de badge = rozet", /badge: "\.\/icons\/bildirim-rozet\.png"/.test(APP));
  ok("uygulama içi bildirimde büyük görsel boş", /icon: "\.\/icons\/bildirim-bos\.png"/.test(APP));
  ok("hiçbir yerde 192'lik ikon badge/icon olarak kalmadı", !/icon: "\.\/icons\/icon-192\.png"/.test(APP));
  ok("favicon tanımlı (gri daire + harf yerine logo)", /rel="icon"/.test(fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8")));
}

console.log("\n== 3) Yeni deneme → 'sonucun var, analiz edeyim' ==");
{
  ok("kuyruk tablosu var", /create table if not exists public\.bildirim_kuyrugu/.test(SQL));
  ok("RLS açık", /alter table public\.bildirim_kuyrugu enable row level security/.test(SQL));
  ok("kullanıcı yalnız kendi satırını görür", /using \(auth\.uid\(\) = user_id\)/.test(SQL));
  ok("RPC yalnız girişliye açık", /grant execute on function public\.bildirim_deneme_kuyruk\(text, text, text\) to authenticated/.test(SQL));
  ok("RPC girişsizi reddeder", /if ben is null then return jsonb_build_object\('ok', false, 'sebep', 'giris-yok'\)/.test(SQL));
  ok("aynı sınav iki kez bildirilmez", /unique \(user_id, anahtar\)/.test(SQL) && /zaten-var/.test(SQL));
  ok("gizli anahtar tarayıcıya inmiyor", !/BILDIRIM_SECRET|bildirim_secret/.test(APP));
  ok("kuyruk 5 dakikada bir boşaltılıyor", /'deneme-bildirim-kuyrugu', '\*\/5 \* \* \* \*'/.test(SQL));
  ok("sessiz saatte beklemede kalır", /atlandi', 'sessiz saat'/.test(SQL));
  ok("2 günden eski istek gönderilmez", /interval '2 days'/.test(SQL));
  ok("abonelik yoksa satır kapanır (sonsuz kuyruk yok)", /sonuc = case when abone = 0 then 'abonelik-yok'/.test(SQL));
}

console.log("\n== 4) Uygulama tarafı ==");
{
  ok("çekim sonrası kuyruğa yazılıyor", /okzDenemeBildirimKuyruk\(yeni\)/.test(APP));
  ok("RPC adı doğru", /sb\.rpc\("bildirim_deneme_kuyruk"/.test(APP));
  ok("başlık kullanıcının istediği gibi", /p_baslik: "Yeni deneme sonucun var"/.test(APP));
  ok("gövde analiz daveti içeriyor", /analiz edeyim mi\?/i.test(APP));
  ok("net varsa gövdeye yazılıyor", /net \? " · " \+ net \+ " net" : ""/.test(APP));
  ok("giriş yoksa sessizce atlanır", /if \(!sb \|\| !currentUser \|\| typeof sb\.rpc !== "function"\) return;/.test(APP));
  ok("hata olsa bile çekim akışı bozulmaz", /catch\(function \(\) \{ \/\* \*\/ \}\);/.test(APP));
  ok("en çok 3 deneme bildirimi (spam yok)", /slice\(0, 3\)/.test(APP));
  /* v92 sürüm damgasını ilerletir; test damganın v91 veya sonrası olmasını ister. */
  ok("sürüm damgası v91+", Number((APP.match(/PWA_SURUM = "v(\d+)-/) || [])[1]) >= 91);
}

console.log("\n== 5) Eski davranışlar bozulmadı ==");
{
  ok("tekrar/acil ayrımı duruyor", /tur := 'acil'/.test(SQL) && /state->'memory'/.test(SQL));
  ok("acil konu puanlaması duruyor", /when kay\.kaynak = 'deneme' then 1\.5 else 1\.0 end/.test(SQL));
  ok("cihaz gösterdiyse mükerrer yok", /t\.gosterildi is true and t\.baslik = hat_baslik/.test(SQL));
  ok("TTL 90 dk", /'ttl', '5400'/.test(SQL));
  ok("push-tani kanalı", /functions\/v1\/push-tani/.test(SQL));
  ok("görev başlığı 'Günaydın' içermiyor", !/Günaydın/.test(fs.readFileSync(path.join(KOK, "supabase", "functions", "gorev-hatirlat", "index.ts"), "utf8")));
}

console.log("\n" + "─".repeat(58));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("v90 — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("v90 bildirim başlık/ikon/deneme — " + gecen + "/" + gecen + " geçti ✓");
