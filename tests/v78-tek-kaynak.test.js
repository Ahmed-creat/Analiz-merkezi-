#!/usr/bin/env node
/* ============================================================
   TEK KAYNAK — tests/v78-tek-kaynak.test.js  (G-15)
   ------------------------------------------------------------
   KULLANICI:
     "pwa-files eski olan değil mi, neden kalsın ki?"
     "PWA files dediğin gibi yap"  → kaldır (onay).
     "Eski ise arşivlenecek, yeni ise bağlanacak."

   DURUM: pwa-files/, site/'ın ESKİ kopyasıydı (Firebase Hosting günlerinden
   kalma app-pwa.js + build_pwa.py + functions/). Yayın artık Vercel:
   deploy/build.sh yalnız site/ klasörünü paketliyor. Kopya olduğu için
   4 içerik aracı aynı havuzu İKİ yere yazıyordu (site + pwa-files) — iki
   kopya ayrıştığında "havuz güncellendi ama uygulamada eski" hatası doğar.

   Kanıtlananlar:
     1) pwa-files dizini YOK (git'te de yok) — eski hâli commit geçmişinde
     2) Hiçbir araç/kod pwa-files yoluna yazmıyor (çift yazım bitti)
     3) Yayın tek kaynaktan: deploy/build.sh → site/
     4) Eski havuzlar arşivde duruyor (kayıp yok)
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) gecen++; else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }

function dosyalar(dir, liste = []) {
  for (const ad of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", "arsiv", "dist", "out", "build"].includes(ad.name)) continue;
    const p = path.join(dir, ad.name);
    if (ad.isDirectory()) dosyalar(p, liste);
    else if (/\.(js|sh|html|json|mjs)$/.test(ad.name)) liste.push(p);
  }
  return liste;
}

// ---------------------------------------------------------------
console.log("\n== 1) Eski kopya silindi ==");
{
  ok("pwa-files/ dizini yok", !fs.existsSync(path.join(KOK, "pwa-files")));
  ok("site/ duruyor (canlı kaynak)", fs.existsSync(path.join(KOK, "site", "app-pwa.js")));
  ok("canlı havuz dizini yerinde", fs.existsSync(path.join(KOK, "site", "content", "soru_havuzlari", "index.json")));
}

// ---------------------------------------------------------------
console.log("\n== 2) Çift yazım bitti: hiçbir kod pwa-files'a yazmıyor ==");
{
  const kalanlar = [];
  for (const f of dosyalar(KOK)) {
    if (f === __filename) continue;            // testin kendi kalıbı sayılmaz
    const s = fs.readFileSync(f, "utf8");
    /* Yalnız YOL olarak kullanım aranır; "pwa-files kaldırıldı" gibi
       açıklama yorumları serbest. */
    if (/path\.join\([^)]*["']pwa-files|writeFileSync\([^)]*pwa-files|readFileSync\([^)]*pwa-files/.test(s)) {
      kalanlar.push(path.relative(KOK, f));
    }
  }
  ok("hiçbir dosya pwa-files yolunu kullanmıyor", kalanlar.length === 0, kalanlar.join(", "));

  const araclar = ["beceri-dagit.js", "havuz-ekle.js", "havuz-kunye.js", "t2u-birlestir.js"];
  araclar.forEach(a => {
    const s = fs.readFileSync(path.join(KOK, "docs", "uretim", "araclar", a), "utf8");
    ok(a + " tek kaynağa yazıyor (site/content)", /const SITE = path\.join\(KOK, "site\/content\/soru_havuzlari"\)/.test(s) && !/const PWA =/.test(s));
  });
}

// ---------------------------------------------------------------
console.log("\n== 3) Yayın tek kaynaktan: deploy/build.sh → site/ ==");
{
  const b = fs.readFileSync(path.join(KOK, "deploy", "build.sh"), "utf8");
  ok("build.sh site/ klasörünü kopyalıyor", /cp -a "\$KAYNAK\/site\/\." out\//.test(b));
  ok("build.sh başka uygulama kaynağı kopyalamıyor", !/pwa-files/.test(b));
  ok("çıktı kontrolü var (app-pwa.js)", /test -f out\/app-pwa\.js/.test(b));
}

// ---------------------------------------------------------------
console.log("\n== 4) Arşiv: eski havuzlar kaybolmadı ==");
{
  const eski = path.join(KOK, "arsiv", "soru_havuzlari");
  ok("arşiv dizini duruyor", fs.existsSync(eski));
  ["eski-site", "eski-pwa"].forEach(d => {
    const p = path.join(eski, d);
    ok("arşiv/" + d + " duruyor", fs.existsSync(p),
      fs.existsSync(p) ? (fs.readdirSync(p).length + " dosya") : "yok");
  });
}

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("tek kaynak — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("tek kaynak — " + gecen + "/" + gecen + " geçti ✓");
