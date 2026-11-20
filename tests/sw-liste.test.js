#!/usr/bin/env node
/* ============================================================
   SW ÖNBELLEK LİSTESİ KAPISI — tests/sw-liste.test.js   (G-01)
   ------------------------------------------------------------
   Neyi KANITLIYOR?
     1) site/sw.js PARSE EDİLİYOR (P0: "Unexpected end of input" geri gelmesin)
     2) ASSETS içindeki havuz satırları diskteki dosyalarla BİREBİR
        (192 havuz + index.json = 193)
     3) Havuz satırı ASSETS bloğunun DIŞINDA kalmıyor
     4) docs/uretim/araclar/sw-precache-esitle.js
        • bloğu dosyanın SONUNA değil, eski satırların YERİNE koyuyor
        • son elemanın virgülsüz olması hâlinde MÜKERRER satır üretmiyor
        • ikinci çalıştırmada dosyayı BİREBİR aynı bırakıyor (idempotent)
        • yazım sonrası kendi sözdizimi kapısını çalıştırıyor

   Çalıştır: node tests/sw-liste.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const KOK = path.join(__dirname, "..");
const SW = path.join(KOK, "site", "sw.js");
const HAVUZ = path.join(KOK, "site", "content", "soru_havuzlari");
const ARAC = path.join(KOK, "docs", "uretim", "araclar", "sw-precache-esitle.js");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) { gecen++; } else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }

const swMetin = fs.readFileSync(SW, "utf8");

// ---------------------------------------------------------------
console.log("\n== 1) sw.js parse ediliyor (P0) ==");
{
  let hata = "";
  try { execFileSync(process.execPath, ["--check", SW], { stdio: "pipe" }); } catch (e) { hata = String(e.stderr || e.message); }
  ok("node --check site/sw.js sessiz", hata === "", hata.split("\n").slice(0, 3).join(" "));
  ok("ASSETS dizisi kapanıyor", /const ASSETS = \[[\s\S]*?\];/.test(swMetin));
  ok("dosya ASSETS'ten sonra kod içeriyor (blok sona eklenmemiş)", /const ASSETS = \[[\s\S]*?\];[\s\S]*self\.addEventListener/.test(swMetin));
}

// ---------------------------------------------------------------
console.log("\n== 2) ASSETS ↔ disk birebir ==");
{
  const m = swMetin.match(/const ASSETS = \[([\s\S]*?)\];/);
  ok("ASSETS bulundu", !!m);
  const satirlar = m[1].split("\n").map(s => s.trim()).filter(Boolean);
  const listede = satirlar.filter(s => s.includes("soru_havuzlari/"));
  const diskte = fs.readdirSync(HAVUZ).filter(a => a.endsWith(".json")).sort();

  ok("havuz satırı 193 (192 havuz + index.json)", listede.length === 193, String(listede.length));
  ok("diskteki json sayısı 193", diskte.length === 193, String(diskte.length));

  const yollar = listede.map(s => s.replace(/^"\.\//, "").replace(/"\,?$/, ""));
  ok("mükerrer satır yok", new Set(yollar).size === yollar.length,
    String(yollar.length - new Set(yollar).size) + " mükerrer");
  const eksik = diskte.filter(a => yollar.indexOf("content/soru_havuzlari/" + a) < 0);
  ok("diskteki her dosya listede", eksik.length === 0, eksik.slice(0, 3).join(", "));
  const yok = yollar.filter(y => !fs.existsSync(path.join(KOK, "site", y)));
  ok("listedeki her dosya diskte", yok.length === 0, yok.slice(0, 3).join(", "));
}

// ---------------------------------------------------------------
console.log("\n== 3) Havuz satırı ASSETS dışında kalmıyor ==");
{
  const desen = /^\s*"\.\/content\/soru_havuzlari\/[^"]+"\,?$/;
  const bas = swMetin.indexOf("const ASSETS = [");
  const son = swMetin.indexOf("];", bas);
  const disarida = swMetin.split("\n").filter((s, i) => {
    const yer = swMetin.split("\n").slice(0, i).join("\n").length;
    return desen.test(s) && (yer < bas || yer > son);
  });
  ok("ASSETS dışında havuz satırı yok", disarida.length === 0, disarida.slice(0, 2).join(" | "));
}

// ---------------------------------------------------------------
console.log("\n== 4) Araç: yerleşim + mükerrer + idempotent ==");
function aracCalistir(swYolu, havuzYolu) {
  return execFileSync(process.execPath, [ARAC], {
    stdio: "pipe",
    env: Object.assign({}, process.env, { AM_SW: swYolu, AM_HAVUZ: havuzYolu })
  }).toString();
}
function geciciKopya(icerik, dosyalar) {
  const dizin = fs.mkdtempSync(path.join(os.tmpdir(), "am-sw-"));
  const swYolu = path.join(dizin, "sw.js");
  fs.writeFileSync(swYolu, icerik, "utf8");
  const havuz = path.join(dizin, "havuz");
  fs.mkdirSync(havuz);
  dosyalar.forEach(a => fs.writeFileSync(path.join(havuz, a), "{}", "utf8"));
  return { dizin, swYolu, havuz };
}
{
  // (a) normal hâl: araç dosyayı DEĞİŞTİRMEMELİ
  const kopya = geciciKopya(swMetin, fs.readdirSync(HAVUZ).filter(a => a.endsWith(".json")));
  aracCalistir(kopya.swYolu, kopya.havuz);
  const birinci = fs.readFileSync(kopya.swYolu, "utf8");
  ok("hazır dosyada araç birebir aynı bırakıyor", birinci === swMetin,
    "satır farkı: " + (birinci.split("\n").length - swMetin.split("\n").length));
  aracCalistir(kopya.swYolu, kopya.havuz);
  ok("ikinci çalıştırma da birebir (idempotent)", fs.readFileSync(kopya.swYolu, "utf8") === swMetin);
  fs.rmSync(kopya.dizin, { recursive: true, force: true });
}
{
  // (b) REGRESYON: bir havuz satırı silinmiş → araç onu ASSETS'in İÇİNE eklemeli
  // (eski hata: dosyanın SONUNA ekliyordu → sw.js parse edilemiyordu)
  const satirlar = swMetin.split("\n");
  const eksikAd = fs.readdirSync(HAVUZ).filter(a => a.endsWith(".json")).sort()[0];
  const kirpik = satirlar.filter(s => s.indexOf("./content/soru_havuzlari/" + eksikAd) < 0).join("\n");
  ok("regresyon tohumu: satır gerçekten silindi", kirpik !== swMetin);
  const kopya = geciciKopya(kirpik, fs.readdirSync(HAVUZ).filter(a => a.endsWith(".json")));
  aracCalistir(kopya.swYolu, kopya.havuz);
  const cikti = fs.readFileSync(kopya.swYolu, "utf8");
  let parseHatasi = "";
  try { execFileSync(process.execPath, ["--check", kopya.swYolu], { stdio: "pipe" }); } catch (e) { parseHatasi = String(e.stderr || e.message); }
  ok("eksik satır sonrası dosya PARSE ediliyor", parseHatasi === "", parseHatasi.split("\n").slice(0, 2).join(" "));
  const m = cikti.match(/const ASSETS = \[([\s\S]*?)\];/);
  const iceride = m ? (m[1].match(/soru_havuzlari\//g) || []).length : 0;
  ok("eksik satır ASSETS İÇİNE eklendi (193)", iceride === 193, String(iceride));
  ok("ekleme dosya sonuna yapılmadı", /const ASSETS = \[[\s\S]*?\];[\s\S]*self\.addEventListener/.test(cikti));
  fs.rmSync(kopya.dizin, { recursive: true, force: true });
}
{
  // (c) REGRESYON: SON havuz satırı virgülsüz → mükerrer satır üretilmemeli
  const havuzDosyalari = fs.readdirSync(HAVUZ).filter(a => a.endsWith(".json")).sort();
  const son = havuzDosyalari[havuzDosyalari.length - 1];
  const metin = swMetin.replace('  "./content/soru_havuzlari/' + son + '"', '  "./content/soru_havuzlari/' + son + '"');
  const kopya = geciciKopya(metin, havuzDosyalari);
  aracCalistir(kopya.swYolu, kopya.havuz);
  const cikti = fs.readFileSync(kopya.swYolu, "utf8");
  const m = cikti.match(/const ASSETS = \[([\s\S]*?)\];/);
  const satirlar = m[1].split("\n").map(s => s.trim()).filter(Boolean).filter(s => s.includes("soru_havuzlari/"));
  ok("virgülsüz son satırda MÜKERRER yok", satirlar.length === 193, String(satirlar.length));
  ok("virgülsüz son satır dosya sonunda kalıyor",
    satirlar[satirlar.length - 1] === '"./content/soru_havuzlari/' + son + '"', satirlar[satirlar.length - 1]);
  fs.rmSync(kopya.dizin, { recursive: true, force: true });
}

// ---------------------------------------------------------------
console.log("\n== 5) Araçta yazım sonrası kapı var ==");
{
  const arac = fs.readFileSync(ARAC, "utf8");
  /* Yorumları ayıkla: hatanın ANLATILDIĞI yorum değil, KOD denetlenir. */
  const kod = arac.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  ok("yazımdan sonra node --check çalışıyor", /execFileSync\(process\.execPath, \["--check", SW\]/.test(arac));
  ok("kapı düşerse dosya geri alınıyor", /geriAl\(/.test(arac) && /fs\.writeFileSync\(SW, metin, "utf8"\)/.test(arac));
  ok("ASSETS satır sayısı da denetleniyor", /ASSETS havuz satırı/.test(arac));
  ok("ekleme yeri filtrelenmiş listede aranmıyor (eski hata yok)", !/kalanSatirlar/.test(kod));
  ok("ekleme yeri filtrelenmemiş `satirlar` üzerinde bulunuyor",
    /const ilk = satirlar\.findIndex\(s => desen\.test\(s\)\)/.test(kod));
  ok("blok `slice(0, -1)` ile sona eklenmiyor", !/slice\(0, -1\)/.test(kod));
}

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("sw liste kapısı — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("sw liste kapısı — " + gecen + "/" + gecen + " geçti ✓");
