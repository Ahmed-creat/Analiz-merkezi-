#!/usr/bin/env node
/* ============================================================
   KAYNAK SÖZDİZİMİ + TEK MOTOR NÖBETÇİSİ
   (tests/kaynak-sozdizimi.test.js)
   ------------------------------------------------------------
   NEDEN VAR? v35.6'da index.html içine konan BKT motoru blok
   fazladan bir ")" yüzünden HİÇ ÇALIŞMADI (tarayıcı bloğu komple
   atar). O sürümdeki testler yalnız metin aradığı için %100
   "geçti" göründü. Bu test dosyası o hatayı yakalar:

     1) index.html içindeki HER inline <script> gerçekten derleniyor mu?
     2) Sayfaya yüklenen HER .js dosyası derleniyor mu?
     3) Motor TEK mi? (index.html içinde ikinci bir motor kopyası yok)
     4) Kısa Kontrol metni 5 soru mu? ("3 soru" kalıntısı yok)

   Çalıştır: node tests/kaynak-sozdizimi.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");

const KOK = path.join(__dirname, "..");
const SITE = path.join(KOK, "site");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ayrinti) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ayrinti ? " → " + ayrinti : "")); return false;
}

const HTML = fs.readFileSync(path.join(SITE, "index.html"), "utf8");
const ENGINE = fs.readFileSync(path.join(SITE, "bkt-engine.js"), "utf8");

// ---------- 1) index.html inline scriptleri ----------
console.log("\n== 1) index.html inline <script> blokları ==");
const inlineRe = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;
let m, sayac = 0;
while ((m = inlineRe.exec(HTML))) {
  sayac++;
  const satir = HTML.slice(0, m.index).split("\n").length;
  let hata = null;
  try { new vm.Script(m[2], { filename: "index.html:satır " + satir }); }
  catch (e) { hata = e.message; }
  ok("inline script #" + sayac + " (satır ~" + satir + ") derleniyor", !hata, hata);
}
ok("en az iki inline script var", sayac >= 2, "bulunan: " + sayac);

// ---------- 2) sayfaya yüklenen her .js ----------
console.log("\n== 2) index.html'in yüklediği .js dosyaları ==");
const srcRe = /<script([^>]*)\bsrc="([^"]+)"([^>]*)>/g;
const dosyalar = [];
while ((m = srcRe.exec(HTML))) {
  const etiket = (m[1] || "") + " " + (m[3] || "");
  const src = m[2];
  if (/^(https?:)?\/\//.test(src)) continue;      // CDN
  dosyalar.push({ src: src, modul: /type\s*=\s*"module"/.test(etiket) });
}
ok("sayfa en az 5 yerel script yüklüyor", dosyalar.length >= 5, "bulunan: " + dosyalar.length);
dosyalar.forEach(function (d) {
  const yol = path.join(SITE, d.src);
  if (!fs.existsSync(yol)) { ok(d.src + " mevcut", false); return; }
  const kod = fs.readFileSync(yol, "utf8");
  let hata = null;
  if (d.modul) {
    // ES modülü: vm.Script parse edemez; node --check geçici .mjs üzerinde
    const gecici = path.join(os.tmpdir(), "am-sozdizimi-" + path.basename(d.src) + ".mjs");
    fs.writeFileSync(gecici, kod);
    try { execFileSync(process.execPath, ["--check", gecici], { stdio: "pipe" }); }
    catch (e) { hata = String(e.stderr || e.message).split("\n").slice(0, 3).join(" "); }
    finally { try { fs.unlinkSync(gecici); } catch (_) {} }
  } else {
    try { new vm.Script(kod, { filename: d.src }); } catch (e) { hata = e.message; }
  }
  ok(d.src + " (" + (d.modul ? "modül" : "klasik") + ") derleniyor", !hata, hata);
});

// ---------- 3) TEK MOTOR ----------
console.log("\n== 3) Tek motor nöbetçisi ==");
ok("index.html motoru yüklüyor", /<script[^>]*src="bkt-engine\.js"/.test(HTML));
ok("motor dosyası window.AnalizBKT kuruyor", /window\.AnalizBKT\s*=/.test(ENGINE));
ok("index.html içinde İKİNCİ motor kopyası yok", HTML.indexOf("window.AnalizBKT =") < 0);
ok("index.html içinde eski 'Öğrenme Testi' modalı yok", HTML.indexOf("data-bkt-submit-test") < 0);
ok("motor sw.js ASSETS'te", /"\.\/bkt-engine\.js"/.test(fs.readFileSync(path.join(SITE, "sw.js"), "utf8")));

// ---------- 4) KISA KONTROL = 5 SORU ----------
console.log("\n== 4) Kısa Kontrol 5 soru ==");
ok("motor MINI_SORU = 5", /const MINI_SORU = 5;/.test(ENGINE));
ok("motorda '3 soru' kalıntısı YOK", ENGINE.indexOf("3 soru") < 0);
ok("motorda 'Kısa Kontrol — ' + MINI_SORU + ' soru'", /Kısa Kontrol — ' \+ MINI_SORU \+ ' soru/.test(ENGINE));
// v35.9 — Bilgi Bankası'nda iki yerde "5 soru" vardı; tek yer kaldı.
// Konu Takibi'ndeki düğme "Kısa Kontrol · 5", Bilgi Bankası'ndaki kart
// "5 soruluk kontrole başla" yazar.
ok("index.html'de Kısa Kontrol düğmesi (tek biçim)", HTML.indexOf("Kısa Kontrol · ") >= 0 || HTML.indexOf("5 soruluk kontrole başla") >= 0);
// precheck modunda sayı 3'e düşmemeli
ok("precheck için ayrı sayı YOK", !/precheck\s*\?\s*3/.test(ENGINE));

// ---------- 5) TEK TEK GÖSTERİM + OTOMATİK KAPANMA YOK ----------
console.log("\n== 5) Sihirbaz + kapanmayan sonuç ==");
ok("cizMiniSoru (tek soru ekranı) var", ENGINE.indexOf("function cizMiniSoru(modal)") > 0);
ok("ileri/geri düğmeleri var", ENGINE.indexOf("data-bkt-next") > 0 && ENGINE.indexOf("data-bkt-prev") > 0);
ok("sonuç otomatik kapanmıyor", !/setTimeout\(\s*closeMiniTest/.test(ENGINE));
ok("sonuçta 'Kapat' düğmesi var", ENGINE.indexOf("Kapat</button>") > 0);

// ---------- 6) HAVUZ EŞLEME KESİN ----------
console.log("\n== 6) Havuz eşleme yalnız birebir ==");
ok("havuzEsle tanımlı", ENGINE.indexOf("function havuzEsle(topicKey, havuzlar)") > 0);
ok("HB.bul (benzerlik) kullanılmıyor", !/HB\.bul/.test(ENGINE));
ok("__okzKonuPoolEsle (tahmini eşleme) kullanılmıyor", !/__okzKonuPoolEsle/.test(ENGINE));
ok("ders geneli fallback YOK", !/sameLesson/.test(ENGINE) && !/aynı dersin havuzuna düş/.test(ENGINE));

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(x => console.log(" ✗ " + x));
  console.log("Kaynak sözdizimi nöbetçisi — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("Kaynak sözdizimi nöbetçisi — " + gecen + "/" + gecen + " geçti ✓");
