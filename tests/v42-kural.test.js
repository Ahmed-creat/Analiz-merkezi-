#!/usr/bin/env node
/* ============================================================
   v42 KURALLARI (tests/v42-kural.test.js)
   ------------------------------------------------------------
   Kullanıcının üç isteği ölçülür:

   1) "Her açılışta başlayalım tuşu gelmesin."
      → Açılış ekranı ("Başla") yalnız İLK açılışta; sonraki
        açılışlarda kendiliğinden kapanır (localStorage işareti).

   2) "Tekrar zamanı gelmişse kırmızı renk + kart zorunlu; çalışma
      zamanı gelmediyse kart olmaz."
      → reviewTopic: erken tekrar KART AÇMAZ; zamanı gelen tekrar
        kart turu açar. Liste de tek kurala bağlı (birlesik-kart
        testi ayrıca ölçüyor).

   3) "Okulizyon bilgileri sabit olmasın; şehir, ilçe, okullar
      Okulizyon'daki gibi seçilebilsin."
      → Profilde il/ilçe/okul seçimleri okulizyon-liste edge
        fonksiyonundan gelir; sabit Gaziantep/Şahinbey/okul listesi
        KALMADI. Seçilen kodlar (ilkodu/ilcekodu/kurumkodu) saklanır.
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const LISTE = fs.readFileSync(path.join(KOK, "supabase", "functions", "okulizyon-liste", "index.ts"), "utf8");
const CEK = fs.readFileSync(path.join(KOK, "supabase", "functions", "okulizyon-cek", "index.ts"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) { gecen++; return true; } kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false; }

console.log("\n== 1) Açılış ekranı yalnız İLK açılışta ==");
ok("ilk açılış işareti tanımlı", HTML.indexOf('"am_giris_yapildi"') > 0);
ok("splashKapat yardımcısı var", HTML.indexOf("function splashKapat(") > 0);
ok("splashIlkAcilisMi yardımcısı var", HTML.indexOf("function splashIlkAcilisMi(") > 0);
ok("açılışta ilk değilse splash kendiliğinden kapanır",
  /if \(!splashIlkAcilisMi\(\)\) \{[\s\S]{0,120}?splashKapat\(\);/.test(HTML));
ok("Başla'ya basınca işaret yazılır",
  /case "enterApp"[\s\S]{0,400}?localStorage\.setItem\("am_giris_yapildi", "1"\)/.test(HTML));

console.log("\n== 2) Tekrar kuralı: zamanı gelen kart, gelmeyen serbest ==");
const rtBas = HTML.indexOf("function reviewTopic(");
const rt = HTML.slice(rtBas, rtBas + 2200);
ok("reviewTopic bulundu", rtBas > 0);
ok("erken tekrarda KART AÇILMAZ", /if \(erken\) \{[\s\S]{0,200}?markReviewed/.test(rt) && /if \(erken\) \{[\s\S]{0,400}?return;/.test(rt));
ok("zamanı gelen tekrar GERÇEK kart listesine bakar", rt.indexOf("K.kartlar(topicKey)") > 0);
ok("kart varsa tur açılır", rt.indexOf("K.ac(topicKey") > 0);
ok("kart yoksa konu kilitlenmez", rt.indexOf("markReviewed(topicKey, false)") > 0);
ok("kırmızı + zorunlu düğme metni listede", HTML.indexOf("Tekrar Ettim · kartlar zorunlu") > 0);
ok("günü gelmeyen konuda Erken Tekrar", HTML.indexOf('data-act="earlyReview"') > 0);

console.log("\n== 3) Okulizyon il/ilçe/okul listeleri SABİT DEĞİL ==");
ok("sabit ilçe dizisi (ILCELER) KALMADI", APP.indexOf("const ILCELER = [") < 0);
ok("sabit il listesi KALMADI", APP.indexOf('sel("il", "İL", ["Gaziantep"])') < 0);
ok("sabit okul adı KALMADI", APP.indexOf('["AKKENT ANADOLU LİSESİ"]') < 0);
ok("okzSecim() seçim üreticisi var", APP.indexOf("function okzSecim(") > 0);
ok("il/ilçe/okul seçimleri canlı listeden", APP.indexOf('okzSecim("il", "İL"') > 0 && APP.indexOf('okzSecim("ilce", "İLÇE"') > 0 && APP.indexOf('okzSecim("okulAdi", "OKUL"') > 0);
ok("liste sunucudan çekiliyor", APP.indexOf("/functions/v1/okulizyon-liste") > 0);
ok("İL değişince İLÇE tazelenir", /okz-il[\s\S]{0,400}?okzListeTazele\("ilce"/.test(APP));
ok("İLÇE değişince OKUL tazelenir", /okz-ilce[\s\S]{0,400}?okzListeTazele\("okul"/.test(APP));
ok("seçilen KODLAR saklanıyor", APP.indexOf("ilkodu: kod(\"il\")") > 0 && APP.indexOf("ilcekodu: kod(\"ilce\")") > 0 && APP.indexOf("kurumkodu: kod(\"okulAdi\")") > 0);
ok("excel benzeri isim tahmini yerine kod kullanılıyor", CEK.indexOf("if (kimlik.ilcekodu) ilcekodu") > 0);

console.log("\n== 4) okulizyon-liste fonksiyonu ==");
ok("mod il/ilce/okul destekleniyor", LISTE.indexOf('["il", "ilce", "okul"]') > 0);
ok("il listesi giriş sayfasından", LISTE.indexOf('secenekler(html, "ilkodu")') > 0);
ok("ilçe ucu /ajax/ilceler.php", LISTE.indexOf("/ajax/ilceler.php?ilkodu=") > 0);
ok("okul ucu /ajax/kurumlar.php", LISTE.indexOf("/ajax/kurumlar.php?ilcekodu=") > 0);
ok("7 günlük önbellek var", LISTE.indexOf("okulizyon_liste") > 0);
ok("CORS açık (tarayıcı çağırabilsin)", LISTE.indexOf("Access-Control-Allow-Origin") > 0);

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(x => console.log(" ✗ " + x));
  console.log("v42 kural testi — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("v42 kural testi — " + gecen + "/" + gecen + " geçti ✓");
