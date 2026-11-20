#!/usr/bin/env node
/* ============================================================
   SW ÖNBELLEK LİSTESİ EŞİTLE
   ------------------------------------------------------------
   site/sw.js içindeki `./content/soru_havuzlari/...` satırlarını
   canlı havuz dosyalarıyla birebir eşitler (sıralı). Arşive taşınan
   havuzların önbellek satırları böylece düşer, yeni havuzlar eklenir.

   CACHE adına DOKUNMAZ (sürüm bandı korunur).

   v77 (G-01) — ARAÇ HATASI DÜZELTİLDİ.
   Eski kod ekleme yerini FİLTRELEMEDEN SONRA arıyordu:

     const kalanSatirlar = satirlar.filter(s => !desen.test(s));
     const eklemeYeri = kalanSatirlar.findIndex(s => s === satirlar[ilk]);
     //                                          ^ aranan satır filtreden
     //                                            düştüğü için DAİMA -1
     const cikti = kalanSatirlar.slice(0, -1).concat(...);

   `slice(0, -1)` son elemanı kırpıp havuz bloğunu dosyanın SONUNA
   ekliyordu: `ASSETS` kapanışı yukarıda kalıyor, sw.js
   `SyntaxError: Unexpected end of input` veriyor ve service worker
   hiç kurulmuyordu (teslim edilmiş P0). Artık blok, eski havuz
   satırlarının YERİNE tek parça olarak konur ve yazımdan sonra
   `node --check` kapısı çalışır; kapı düşerse dosya YEDEKTEN geri
   yazılır (yarım dosya bırakılmaz).

   Kullanım: node docs/uretim/araclar/sw-precache-esitle.js [--kuru]
   Test için yol geçersiz kılma: AM_SW / AM_HAVUZ ortam değişkenleri.
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const KOK = path.resolve(__dirname, "../../..");
const SW = process.env.AM_SW ? path.resolve(process.env.AM_SW) : path.join(KOK, "site/sw.js");
const HAVUZ = process.env.AM_HAVUZ ? path.resolve(process.env.AM_HAVUZ) : path.join(KOK, "site/content/soru_havuzlari");
const kuru = process.argv.includes("--kuru");

const dosyalar = fs.readdirSync(HAVUZ)
  .filter(a => a.endsWith(".json"))
  .sort((a, b) => a.localeCompare(b, "tr"));
if (!dosyalar.length) throw new Error("havuz klasörü boş: " + HAVUZ);
if (new Set(dosyalar).size !== dosyalar.length) throw new Error("havuz dosya listesinde mükerrer var");
/* Dizi geleneği: son elemanın sonunda virgül OLMAZ. */
const yeniSatirlar = dosyalar.map((a, i) =>
  '  "./content/soru_havuzlari/' + a + '"' + (i === dosyalar.length - 1 ? "" : ","));

const metin = fs.readFileSync(SW, "utf8");
const satirlar = metin.split("\n");
/* SON ELEMAN virgülsüz olabilir — desen virgülü İSTEĞE BAĞLI kabul eder.
   (Eski desen virgülü zorunlu tuttuğu için dosyanın son havuz satırı
   eşleşmiyor, listede MÜKERRER satır kalıyordu.) */
const desen = /^\s*"\.\/content\/soru_havuzlari\/[^"]+"\,?$/;
const ilk = satirlar.findIndex(s => desen.test(s));
if (ilk < 0) throw new Error("sw.js içinde havuz satırı bulunamadı");

const eskiSatirlar = satirlar.filter(s => desen.test(s));
/* Havuz satırları yeni listeyle DEĞİŞTİRİLİR: ilk eski satırın yerine blok
   konur, kalan eski satırlar düşer. Satırlar bitişik olmasa bile (bölünmüş
   liste) sonuç tek, sıralı bir bloktur — araç idempotent kalır. */
const cikti = [];
for (let i = 0; i < satirlar.length; i++) {
  if (i === ilk) cikti.push(...yeniSatirlar);
  if (desen.test(satirlar[i])) continue;
  cikti.push(satirlar[i]);
}

const eskiAdet = eskiSatirlar.length;
const yeniMetin = cikti.join("\n");
console.log("sw.js havuz satırı:", eskiAdet, "→", yeniSatirlar.length,
  "· toplam satır:", satirlar.length, "→", cikti.length);

if (kuru) {
  console.log("(kuru çalışma — dosya yazılmadı)");
  process.exit(0);
}

fs.writeFileSync(SW, yeniMetin, "utf8");

/* KAPI: yazımdan SONRA sözdizimi + liste bütünlüğü. Bozuksa dosyayı geri al. */
function geriAl(neden) {
  fs.writeFileSync(SW, metin, "utf8");
  throw new Error("sw.js yazıldıktan sonra kapı DÜŞTÜ — dosya geri alındı.\n" + neden);
}
try {
  execFileSync(process.execPath, ["--check", SW], { stdio: "pipe" });
} catch (hata) {
  geriAl(String((hata && hata.stderr) || (hata && hata.message) || hata).trim());
}
const yazilan = fs.readFileSync(SW, "utf8");
const kapali = yazilan.match(/const ASSETS = \[([\s\S]*?)\];/);
if (!kapali) geriAl("ASSETS dizisi kapanmıyor");
const listede = (kapali[1].match(/soru_havuzlari\//g) || []).length;
if (listede !== yeniSatirlar.length) geriAl("ASSETS havuz satırı: " + listede + " · beklenen: " + yeniSatirlar.length);
console.log("yazıldı: site/sw.js · sözdizimi kapısı: geçti · ASSETS havuz satırı:", listede);
