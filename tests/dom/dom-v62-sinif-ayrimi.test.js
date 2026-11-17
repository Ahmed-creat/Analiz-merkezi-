/* v62 — DENEME ↔ SINIF AYRIMI
   ------------------------------------------------------------
   KULLANICI: "10. sınıfta bir deneme var. Ayarlardan 9. sınıfa geçince
   10. sınıftaki denemeyi 'bu sınıfta yok' diye YENİ DENEME zannediyor."

   Kök neden: deneme kaydında hangi sınıfa ait olduğu YAZMIYORDU.
   Sınıf değişince aynı deneme yeni sayılıyor, tekrar ekleniyor ve
   BKT motoru kayıtları yeniden işliyordu.

   Bu test kaynak kodu okur (tarayıcı yok):
     1) Her deneme `grade` taşır (kaydetme + içe aktarma)
     2) İçe aktarmada mükerrer kontrolü DİĞER SINIFIN arşivine karşı da yapılır
     3) Başka sınıfa ait deneme bu hesaba YAZILMAZ, kullanıcıya söylenir
     4) Listede başka sınıfın denemesi ETİKETLENİR
     5) Veri dosyasındaki sınavlar grade taşır
   Çalıştır: node tests/dom/dom-v62-sinif-ayrimi.test.js
   ============================================================ */
"use strict";
const fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const VERI = JSON.parse(fs.readFileSync(path.join(KOK, "site", "veri", "9-sinif-denemeler.json"), "utf8"));

let gecen = 0; const hata = [];
const ok = (ad, kosul, ek) => { if (kosul) { gecen++; console.log("  ✓ " + ad); } else { hata.push(ad + (ek ? " → " + ek : "")); console.log("  ✗ " + ad + (ek ? " → " + ek : "")); } };

console.log("\n== 1) Deneme kaydı sınıfını taşıyor ==");
ok("saveExam grade yazıyor", /grade: String\(state\.user\.grade \|\| "9"\),/.test(HTML));
ok("grade, id ile birlikte tek satırda", /const exam = \{ id: uid\(\), name: name, date: date, grade: String\(state\.user\.grade \|\| "9"\),/.test(HTML));

console.log("\n== 2) İçe aktarma diğer sınıfın arşivine bakar ==");
ok("arşiv okuyucu var", /const arsiv = \(g\) => \{/.test(HTML));
ok("arşiv anahtarı sınıf bazlı", /"analizmerkezi_v6_g" \+ g/.test(HTML));
ok("mükerrer anahtarı sınıf içeriyor", /const anahtar = \(e\) => e\.grade \+ "\|" \+ e\.name/.test(HTML));
ok("diğer sınıflar taranıyor", /const digerSiniflar = \["9", "10"\]\.filter\(g => g !== buSinif\)/.test(HTML));
ok("arşivdeki denemeler mükerrer kümesine giriyor", /digerSiniflar\.forEach\(x => x\.s\.exams\.forEach/.test(HTML));

console.log("\n== 3) Başka sınıfın denemesi bu hesaba yazılmaz ==");
ok("sınıf farkı kontrol ediliyor", /if \(sinif !== buSinif\) \{ baskaSinif\+\+; return; \}/.test(HTML));
ok("kullanıcıya bildiriliyor", /baskaSinif \+ " başka sınıfa ait/.test(HTML));
ok("uyarı tonu kullanılıyor", /\(baskaSinif \? "warning" : "info"\)/.test(HTML));

console.log("\n== 4) Listede yabancı sınıf etiketlenir ==");
ok("exSinif hesaplanıyor", /const exSinif = String\(ex\.grade \|\| state\.user\.grade \|\| "9"\)/.test(HTML));
ok("yabancı bayrağı var", /const yabanci = exSinif !== String\(state\.user\.grade \|\| "9"\)/.test(HTML));
ok("rozet basılıyor", /yabanci \? ' <span class="badge"/.test(HTML));

console.log("\n== 5) Veri dosyası ==");
const sinavlar = VERI.state.exams || [];
ok("7 sınav", sinavlar.length === 7, String(sinavlar.length));
ok("hepsi grade taşıyor", sinavlar.every(e => String(e.grade) === "9"),
  sinavlar.filter(e => String(e.grade) !== "9").map(e => e.id).join(", "));
ok("state.user.grade = 9", String(VERI.state.user.grade) === "9", String(VERI.state.user.grade));

console.log("\n" + "─".repeat(56));
if (hata.length) { console.log("v62 sınıf ayrımı — " + gecen + " geçti, " + hata.length + " kaldı"); hata.forEach(h => console.log("   · " + h)); process.exit(1); }
console.log("v62 sınıf ayrımı — " + gecen + "/" + gecen + " geçti ✓");
