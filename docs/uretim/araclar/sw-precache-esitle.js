#!/usr/bin/env node
/* ============================================================
   SW ÖNBELLEK LİSTESİ EŞİTLE
   ------------------------------------------------------------
   site/sw.js içindeki `./content/soru_havuzlari/...` satırlarını
   canlı havuz dosyalarıyla birebir eşitler (sıralı). Arşive taşınan
   havuzların önbellek satırları böylece düşer, yeni havuzlar eklenir.

   CACHE adına DOKUNMAZ (v69 bandı korunur).

   Kullanım: node docs/uretim/araclar/sw-precache-esitle.js [--kuru]
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.resolve(__dirname, "../../..");
const SW = path.join(KOK, "site/sw.js");
const HAVUZ = path.join(KOK, "site/content/soru_havuzlari");
const kuru = process.argv.includes("--kuru");

const dosyalar = fs.readdirSync(HAVUZ)
  .filter(a => a.endsWith(".json"))
  .sort((a, b) => a.localeCompare(b, "tr"));
const yeniSatirlar = dosyalar.map(a => '  "./content/soru_havuzlari/' + a + '",');

const metin = fs.readFileSync(SW, "utf8");
const satirlar = metin.split("\n");
const desen = /^\s*"\.\/content\/soru_havuzlari\/[^"]+",$/;
const ilk = satirlar.findIndex(s => desen.test(s));
if (ilk < 0) throw new Error("sw.js içinde havuz satırı bulunamadı");

/* arşivlenen havuzlar listede bitişik değilse (alfabetik blok) yine de
   tüm havuz satırlarını tek blok hâlinde ilk satırın yerine koyarız. */
const kalanSatirlar = satirlar.filter(s => !desen.test(s));
const eklemeYeri = kalanSatirlar.findIndex(s => s === satirlar[ilk]);
const cikti = kalanSatirlar.slice(0, eklemeYeri).concat(yeniSatirlar, kalanSatirlar.slice(eklemeYeri));

const eskiAdet = satirlar.filter(s => desen.test(s)).length;
console.log("sw.js havuz satırı:", eskiAdet, "→", yeniSatirlar.length,
  "· toplam ASSETS satırı:", cikti.length);
if (!kuru) fs.writeFileSync(SW, cikti.join("\n"), "utf8");
console.log(kuru ? "(kuru çalışma)" : "yazıldı: site/sw.js");
