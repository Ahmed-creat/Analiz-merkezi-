#!/usr/bin/env node
/* ============================================================
   AYNI GÜN TEK 5 SORULUK TEST — tests/v78-tek-gorev.test.js   (G-07)
   ------------------------------------------------------------
   KULLANICI: "kısa kontrolü çalışma adımına ekledik. Yani gerek kalmadı
   değil mi?"  → HAYIR, iki ayrı şey vardı:
     · Kısa Kontrol  = 5. ADIM (çalışma yol haritasında, precheck_due)
     · Öğrenme Testi = BKT'nin 3. gün kuyruğu (learning_test_due)
   İkisi de AYNI havuzdan 5 soru ve ikisi de +3 güne kurulduğu için aynı konu
   aynı gün İKİ görev üretiyordu.

   KURAL (tek yön): kısa kontrol öncelikli — konu bugün kısa kontrol
   listesindeyse öğrenme testi görevi yazılmaz (kendi günü gelince çıkar).

   Bu test index.html'deki GERÇEK görev bloğunu koşturur.
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const HTML = fs.readFileSync(path.join(__dirname, "..", "site", "index.html"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) gecen++; else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }

// ---- görev bloğunu kes: "const kisa = ..." → öğrenme testi if bloğunun sonu ----
const BAS = HTML.indexOf("  const kisa = Object.keys(bkt)");
const OGR = HTML.indexOf("  const ogr = Object.keys(bkt)", BAS);
if (BAS < 0 || OGR < 0) throw new Error("görev bloğu bulunamadı");
// ogr if bloğunun kapanışı: "  }" satırı (blok 4 boşluk girintili)
let i = HTML.indexOf("  if (ogr.length) {", OGR);
let d = 0, son = i;
for (; son < HTML.length; son++) {
  if (HTML[son] === "{") d++;
  else if (HTML[son] === "}") { d--; if (!d) break; }
}
const BLOK = HTML.slice(BAS, son + 1);

function kur(bkt) {
  const liste = [];
  const ctx = {
    console, Object, Array, String, Number, Math, JSON,
    bkt, liste,
    splitKey: (k) => { const p = String(k).split(" > "); return { lesson: p[0], topic: p[1] || "" }; },
    icon: (n) => "[" + n + "]"
  };
  vm.runInNewContext(BLOK, ctx);
  return liste;
}

const KONU = "Matematik > Türev";

console.log("\n== 1) Aynı konu hem kısa kontrol hem öğrenme testi due → TEK görev ==");
{
  const bkt = {
    [KONU]: { precheck: true, poolId: "mat_10_turev", kisaKontrol: { acik: true }, ogrenmeTesti: true }
  };
  const liste = kur(bkt);
  ok("tek görev üretildi", liste.length === 1, JSON.stringify(liste.map(x => x.id)));
  ok("görev KISA KONTROL (öncelikli yön)", liste[0] && liste[0].id === "kisa", liste[0] && liste[0].id);
  ok("aynı konu ikinci kez (öğrenme testi) yazılmadı", !liste.some(x => x.id === "ogrenmetesti"));
}

console.log("\n== 2) Kısa kontrol kapalıysa öğrenme testi görevi çıkar ==");
{
  const bkt = {
    [KONU]: { precheck: true, poolId: "p1", kisaKontrol: { acik: false }, ogrenmeTesti: true }
  };
  const liste = kur(bkt);
  ok("öğrenme testi görevi var", liste.some(x => x.id === "ogrenmetesti"), JSON.stringify(liste.map(x => x.id)));
  ok("kısa kontrol görevi YOK (zamanı gelmemiş)", !liste.some(x => x.id === "kisa"));
}

console.log("\n== 3) Farklı konular → iki görev (biri diğerini engellemez) ==");
{
  const bkt = {
    [KONU]: { precheck: true, poolId: "p1", kisaKontrol: { acik: true }, ogrenmeTesti: true },
    "Fizik > Vektörler": { precheck: false, poolId: "p2", kisaKontrol: { acik: true }, ogrenmeTesti: true }
  };
  const liste = kur(bkt);
  ok("2 görev var", liste.length === 2, JSON.stringify(liste.map(x => x.id)));
  ok("fizik öğrenme testi çıktı", liste.some(x => x.id === "ogrenmetesti" && x.hedef === "Fizik > Vektörler"),
    JSON.stringify(liste.map(x => x.hedef)));
}

console.log("\n== 4) Havuzu olmayan konu hiç görev üretmez (9. sınıf) ==");
{
  const bkt = {
    "Tarih > İlk Türk Devletleri": { precheck: true, poolId: null, kisaKontrol: { acik: true }, ogrenmeTesti: true }
  };
  const liste = kur(bkt);
  ok("görev yok", liste.length === 0, JSON.stringify(liste.map(x => x.id)));
}

console.log("\n== 5) Kaynak: dışlama kuralı yazılı (tek yön) ==");
{
  ok("ogr filtresi kisa listesini dışlıyor", /const ogr = Object\.keys\(bkt\)\.filter\(k => bkt\[k\]\.ogrenmeTesti && bkt\[k\]\.poolId && kisa\.indexOf\(k\) < 0\)/.test(HTML));
  ok("kural yorumu kodda (G-07)", /G-07 — AYNI GÜN İKİ 5 SORULUK TEST ÇIKMAZ/.test(HTML));
}

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("tek görev — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("tek görev — " + gecen + "/" + gecen + " geçti ✓");
