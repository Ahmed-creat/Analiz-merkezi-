#!/usr/bin/env node
/* ============================================================
   TEK KISA KONTROL + ÖLÜ KOD NÖBETÇİSİ — tests/v78-olukod.test.js  (G-10)
   ------------------------------------------------------------
   KULLANICI (18 Kas):
     "Kısa kontrolü çalışma adımına ekledik. Yani gerek kalmadı değil mi?"
       → 5. adım varken tamamlanmış konudaki büyük "5 soruluk kısa kontrol
         seni bekliyor" kartı MÜKERRER.
     "Eğer uygulamadan kaldır dediysem ölü kodun bulunması senin hatan"
       → kaldırılan kuyrukla birlikte düğmesiz kalan eylemler de gider.

   Kanıtlananlar:
     1) Mükerrer büyük kart yok; 5 soruluk kontrol TEK yerden açılıyor
     2) Kuyrukla ölen okz eylemleri ne düğme ne işleyici olarak duruyor
     3) Defter sıfırlama (kurtarma yolu) DÜĞMEYLE erişilebilir — ölü değil
     4) Hiçbir data-act düğmesiz kalmıyor (site geneli ölü düğme nöbetçisi)
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const SITE = path.join(KOK, "site");
const APP = fs.readFileSync(path.join(SITE, "app-pwa.js"), "utf8");
const HTML = fs.readFileSync(path.join(SITE, "index.html"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) gecen++; else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }

// ---------------------------------------------------------------
console.log("\n== 1) Kısa kontrol TEK yol: 5. adım ==");
{
  ok("büyük 'seni bekliyor' kartı yok", HTML.indexOf("kısa kontrol seni bekliyor") < 0);
  ok("kartın kisaDue koşulu kalmadı", HTML.indexOf("kisaDue") < 0 && HTML.indexOf("kisaKapali") < 0);
  ok("'5 soruluk kontrole başla' tek yerde", (HTML.match(/5 soruluk kontrole başla/g) || []).length === 1,
    "adet: " + (HTML.match(/5 soruluk kontrole başla/g) || []).length);
  ok("kalan düğme 5. adımın içinde", /5\. ADIM[\s\S]{0,1400}5 soruluk kontrole başla/.test(HTML));
  ok("5. adım düğmesi precheck modunda", /data-bkt-test=[\s\S]{0,200}data-bkt-mode="precheck"/.test(HTML));
}

// ---------------------------------------------------------------
console.log("\n== 2) Kuyrukla ölen eylemler tamamen gitti ==");
{
  ok("okzYoksay fonksiyonu yok", !/function okzYoksay\(/.test(APP));
  ok("okzHepsiniYoksay fonksiyonu yok", !/function okzHepsiniYoksay\(/.test(APP));
  ok("okzYoksay işleyicisi yok", !/a === "okzYoksay"/.test(APP));
  ok("okzHepsiniYoksay işleyicisi yok", !/a === "okzHepsiniYoksay"/.test(APP));
  const dugmeler = (HTML + APP).match(/data-act="okz[A-Za-z]+"/g) || [];
  ok("hiçbir yerde okzYoksay düğmesi yok",
    !dugmeler.some(d => /okzYoksay|okzHepsiniYoksay/.test(d)), dugmeler.join(","));
}

// ---------------------------------------------------------------
console.log("\n== 3) Defter sıfırlama: kurtarma yolu erişilebilir ==");
{
  ok("okzDefterTemizle duruyor", /function okzDefterTemizle\(\)/.test(APP));
  ok("sıfırlama düğmesi modalda", /data-act="okzDefteriTemizle"/.test(APP));
  ok("düğmenin işleyicisi var", /a === "okzDefteriTemizle"/.test(APP));
  ok("işleyici defteri gerçekten siliyor", /a === "okzDefteriTemizle"[\s\S]{0,200}okzDefterTemizle\(\)/.test(APP));
  ok("modal yenileniyor (düğme kendi kendini kapatmıyor)", /a === "okzDefteriTemizle"[\s\S]{0,300}renderOkzModal\(\)/.test(APP));
}

// ---------------------------------------------------------------
console.log("\n== 4) Ölü düğme nöbetçisi: her data-act'ın işleyicisi var ==");
{
  /* Eşleme iki yerde: app-pwa.js `a === "..."`, index.html `case "..."`
     (delegasyon iki dosyada). data-act düğmeleri bu ikisinden birinde
     karşılanmıyorsa düğme ÖLÜDÜR. */
  const TUM = fs.readdirSync(SITE)
    .filter(f => /\.(js|html)$/.test(f))
    .map(f => fs.readFileSync(path.join(SITE, f), "utf8")).join("\n");
  const isleyici = new Set();
  (TUM.match(/a === "([A-Za-z0-9_]+)"/g) || []).forEach(m => isleyici.add(m.slice(7, -1)));
  (TUM.match(/case "([A-Za-z0-9_]+)":/g) || []).forEach(m => isleyici.add(m.slice(6, -2)));
  (TUM.match(/dataset\.act === "([A-Za-z0-9_]+)"/g) || []).forEach(m => isleyici.add(m.slice(17, -1)));
  const dugmeler = new Set();
  TUM.replace(/data-act="([A-Za-z0-9_]+)"/g, (m, g) => { dugmeler.add(g); return m; });

  /* Dinamik olarak başka dosyalarda (kart.js vb.) ya da başka bir switch
     bloğunda karşılananlar: işleyici kümesinde olmayan düğme = ÖLÜ DÜĞME. */
  const olu = [...dugmeler].filter(d => !isleyici.has(d));
  ok("düğmesi olup işleyicisi olmayan eylem yok", olu.length === 0, olu.join(", "));
}

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("tek kısa kontrol / ölü kod — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("tek kısa kontrol / ölü kod — " + gecen + "/" + gecen + " geçti ✓");
