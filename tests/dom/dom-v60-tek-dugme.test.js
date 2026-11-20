/* v60 — KULLANICI GERİ BİLDİRİMLERİNİN KANITI
   ------------------------------------------------------------
   1) "bir tane kart düğmesi 2 tane de tekrar et düğmesi var neden?"
      → Bilgi Bankası konu panelinde TEK tekrar düğmesi.
   2) "zamanı gelmemişse erken tekrar yazsın, zamanı geldiğinde
      tekrar ettim yazsın ve tıklayınca kart açılsın."
      → Etiket tekrar gününe göre değişir; ikisi de kart turu açar.
   3) "5 soruluk kısa kontrol zaten 5. adımdı, orada çözdükten
      sonra neden geri geliyor?"
      → completeTopic artık precheck_due'yu bugüne çekmiyor; aynı gün
        çözülen kontrol için bekleyen kartı çizilmiyor.
   4) "Uygulamaya her girildiğinde test bildirimi geliyor."
      → Açılışta otomatik test yok; işaret silinmiyor.
   5) Sunucu: cihaz göstermediyse hatırlatma tekrar denenir.
*/
"use strict";
const fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const BKT = fs.readFileSync(path.join(KOK, "site", "bkt-engine.js"), "utf8");
const KART = fs.readFileSync(path.join(KOK, "site", "kart.js"), "utf8");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const PUSH = fs.readFileSync(path.join(KOK, "site", "push-bildirim.js"), "utf8");
const SQL = fs.readFileSync(path.join(KOK, "supabase", "migrations", "0003_webpush_telafi.sql"), "utf8");

let gecen = 0; const hata = [];
const ok = (ad, kosul, ek) => {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { hata.push(ad + (ek ? " → " + ek : "")); console.log("  ✗ " + ad + (ek ? "  → " + ek : "")); }
};

console.log("\n== 1) Konu panelinde TEK tekrar düğmesi ==");
const doneBas = HTML.indexOf("    if (done) {");
const doneSon = HTML.indexOf("    } else {", doneBas);
const doneBlok = HTML.slice(doneBas, doneSon);
ok("tek düğme değişkeni tanımlı", /const tekrarDugme =/.test(doneBlok));
ok("panelde tekrar düğmesi basılıyor", /tekrarDugme \+/.test(doneBlok));
ok("eski üçlü KALMADI: kartBasla", doneBlok.indexOf('data-act="kartBasla"') < 0);
ok("eski üçlü KALMADI: reviewTopic", doneBlok.indexOf('data-act="reviewTopic"') < 0);
ok("eski üçlü KALMADI: earlyReview", doneBlok.indexOf('data-act="earlyReview"') < 0);
ok("tek düğme yeni eyleme bağlı", doneBlok.indexOf('data-act="tekrarKart"') >= 0);
ok("sıfırla düğmesi korunuyor", doneBlok.indexOf('data-act="resetTopic"') >= 0);

console.log("\n== 2) Etiket güne göre, davranış tek: kart açılır ==");
ok("tekrar günü ölçülüyor", /nr\.date && parseDay\(nr\.date\) <= parseDay\(todayStr\(\)\)/.test(doneBlok));
ok("zamanı gelmişse 'Tekrar Ettim'", /tekrarZamani \? " Tekrar Ettim" : " Erken Tekrar"/.test(doneBlok));
ok("yeşil/mavi stil ayrımı var", /tekrarZamani \? "btn-success" : "btn-primary"/.test(doneBlok));
ok("tek işleyici tekrarKartBasla", /case "tekrarKart": tekrarKartBasla\(/.test(HTML));
ok("her durumda kart turu açılır", /K\.ac\(topicKey, \{ tekrar: true, erken: erken \}\)/.test(HTML));
ok("kart yoksa konu kilitlenmez", /if \(r && r\.ok\) return;\s*\n\s*yaz\(false\);/.test(HTML));
ok("kart turu bitince ekran tazelenir",
  /currentPage === "knowledge"[\s\S]{0,160}renderKnowledge/.test(HTML));

console.log("\n== 3) 5. adım (kısa kontrol) geri gelmiyor ==");
ok("completeTopic artık koşulsuz bugüne çekmiyor",
  /if \(entry\.son_kisa_kontrol\)[\s\S]{0,260}addDays\(entry\.son_kisa_kontrol, aralik\)/.test(BKT));
ok("geçtiyse KISA_ARALIK_GUN, kaldıysa 1 gün",
  /entry\.son_kisa_kontrol_gecti === false \? 1 : KISA_ARALIK_GUN/.test(BKT));
// v78 (G-10) — KULLANICI: "Kısa kontrolü çalışma adımına ekledik. Yani gerek
// kalmadı değil mi?" 5. adım aynı işi yaptığı için tamamlanmış konudaki büyük
// "seni bekliyor" kartı KALDIRILDI. v60'taki "aynı gün çizilmesin" korumaları
// artık gereksiz: çizilecek kart yok. Yerine geri gelmeme garantisi 5. adımda.
ok("mükerrer bekleyen kart kaldırıldı (G-10)", HTML.indexOf("kisa kontrol seni bekliyor") < 0);
ok("aynı gün koruması kodda iz bırakmadı", HTML.indexOf("kisaBugun") < 0 && HTML.indexOf("kisaYapildi") < 0);
ok("5. adım bir kez yapıldıysa TAMAMLANDI kalır", /const kisaBitti = !!bktKayitAdim\.son_kisa_kontrol;/.test(HTML));
ok("5. adım düğmesi yalnız hiç yapılmadıysa çizilir", /else if \(adimBitti && kontrolHavuz\)/.test(HTML));

console.log("\n== 4) Açılışta test bildirimi YOK ==");
ok("otomatik() test göndermiyor", !/await testBirKez\(\)/.test(PUSH.split("async function otomatik")[1] || ""));
ok("açılış temizliği test işaretini silmiyor",
  !/indexOf\("am_push_test_gonderildi"\) === 0/.test(APP));
ok("izin ilk verildiğinde bir kez test (kanal kanıtı) korunuyor",
  /if \(r && r\.ok\) \{\s*\n\s*const t = await testBirKez\(\);/.test(PUSH));
ok("sürüm damgası güncel (v60+)", (function () {
  const m = (APP.match(/PWA_SURUM = "v(\d+)[a-z]?-/) || [])[1];
  return Number(m) >= 60;
})());

console.log("\n== 5) Sunucu: cihaz beyanına kadar tekrar ==");
ok("cihaz onayı aranıyor", /t\.gosterildi is true/.test(SQL) && /t\.baslik = hat_baslik/.test(SQL));
ok("abonelik son 4 hanesiyle eşleşiyor", /right\(p\.endpoint, 4\) = t\.abonelik/.test(SQL));
ok("vardiya başına en fazla 4 deneme", /deneme >= 4/.test(SQL));
ok("deneme anahtarı yazılıyor", /':try:' \|\| \(deneme \+ 1\)/.test(SQL));
// v61 — 5400 → 9000 (2,5 saat): cihaz uyandığında mesaj hâlâ yaşıyor.
ok("TTL 150 dk (birikme yok, uyanınca yaşar)", /'ttl', '9000'/.test(SQL));
ok("tek kanal korunuyor (push-tani)", /functions\/v1\/push-tani/.test(SQL));

console.log("\n────────────────────────────────────────────────────────");
if (!hata.length) console.log("v60 tek düğme testi — " + gecen + "/" + gecen + " geçti ✓");
else { console.log("v60 tek düğme testi — " + gecen + " geçti, " + hata.length + " kaldı"); hata.forEach(h => console.log("   · " + h)); }
process.exit(hata.length ? 1 : 0);
