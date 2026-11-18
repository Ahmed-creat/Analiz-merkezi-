#!/usr/bin/env node
/* ============================================================
   9. SINIF KAPSAMI + "YAKINDA" ROZETİ — tests/v78-9sinif.test.js   (G-14)
   ------------------------------------------------------------
   KULLANICI KARARI (2026-11-18):
     "9. sınıflarda havuz olmayacak, kısa kontrol veya kart da gözükmeyecek.
      10. sınıfta olduğu gibi çalışacak."  +  "Yakında rozeti kalksın."

   Kanıtlananlar:
     1) site/index.html içinde "YAKINDA" rozeti HİÇ çizilmiyor
     2) 9. sınıfta kart/5. adım KAPISI kapalı (kartGosterilir → false)
     3) 10. sınıfta havuzu olan konuda kapı AÇIK, havuzsuzda kapalı
     4) 9. sınıf konusu 4 adımla çalışır (ROADMAP_STEPS 4) ve havuz istemez
   (Paragraf istisnası G-04'te: tests/konu-havuz-kapsam.test.js)
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const html = fs.readFileSync(path.join(__dirname, "..", "site", "index.html"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) gecen++; else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }

function kes(ad) {
  const bas = html.indexOf("function " + ad + "(");
  if (bas < 0) throw new Error("fonksiyon yok: " + ad);
  const ac = html.indexOf("{", bas);
  let d = 0;
  for (let i = ac; i < html.length; i++) {
    if (html[i] === "{") d++;
    else if (html[i] === "}") { d--; if (!d) return html.slice(bas, i + 1); }
  }
  throw new Error("kapanmadı: " + ad);
}

// ---------------------------------------------------------------
console.log("\n== 1) YAKINDA rozeti kalktı ==");
{
  ok("kaynakta YAKINDA rozeti metni yok", !/YAKINDA<\/span>/.test(html) && !/>YAKINDA</.test(html));
  ok("yakinda değişkeni boş", /const yakinda = "";/.test(html));
  ok("konuYakinda değişkeni boş", /const konuYakinda = "";/.test(html));
}

// ---------------------------------------------------------------
console.log("\n== 2-3) kartGosterilir kapısı ==");
{
  const KAYNAK = [kes("konuHavuzuVar"), kes("kartGosterilir")].join("\n\n");

  function kur(sinif, havuzVar, kartSayi) {
    const state = { user: { grade: sinif } };
    const ctx = {
      state, console, String, Number, Object, Array, Math, JSON,
      window: { __havuzVarMi: () => havuzVar },
      kartDurumHizli: () => ({ sayi: kartSayi || 0 })
    };
    vm.runInNewContext(KAYNAK, ctx);
    return ctx;
  }

  ok("9. sınıf + havuz YOK → kart yok", kur("9", false, 0).kartGosterilir("Ders > Konu") === false);
  ok("9. sınıf + kişisel kart VAR → yine kart yok (kullanıcı kararı)",
    kur("9", false, 5).kartGosterilir("Ders > Konu") === false);
  ok("10. sınıf + havuz VAR → kart var", kur("10", true, 0).kartGosterilir("Ders > Konu") === true);
  ok("10. sınıf + kişisel kart VAR → kart var", kur("10", false, 3).kartGosterilir("Ders > Konu") === true);
  ok("10. sınıf + havuz da kart da YOK → kart yok", kur("10", false, 0).kartGosterilir("Ders > Konu") === false);
  ok("manifest yüklenmedi (null) + 10. sınıf → kart YOK (uydurma yok)",
    kur("10", null, 0).kartGosterilir("Ders > Konu") === false);
}

// ---------------------------------------------------------------
console.log("\n== 4) 9. sınıf 4 adımla çalışıyor (adım tanımı değişmedi) ==");
{
  const b = html.indexOf("const ROADMAP_STEPS = [");
  const cur = Function(html.slice(b, html.indexOf("\n];", b) + 3) + "; return ROADMAP_STEPS;")();
  ok("çalışma adımı 4 (5. adım kısa kontrol, havuzsuzda çizilmez)", cur.length === 4, String(cur.length));
  ok("5. adım yalnız havuz varsa çiziliyor (besAdim)",
    /const besAdim = havuzDurum === true \|\| \(havuzDurum === null && !!kontrolHavuz\)/.test(html));
  ok("9. sınıf konusu için hafıza/tekrar akışı özel dallanmıyor (10. sınıfla aynı)",
    !/grade[^\n]{0,20}9[^\n]{0,40}(scheduleReviews|markReviewed)/.test(html));
}

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("9. sınıf kapsamı — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("9. sınıf kapsamı — " + gecen + "/" + gecen + " geçti ✓");
