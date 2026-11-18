#!/usr/bin/env node
/* ============================================================
   v88 — "SİLDİĞİM GERİ GELMESİN" + "KAYDET'TE EKRAN KAPANSIN"
   ------------------------------------------------------------
   KULLANICI (18 Kas):
     1) "Okulizyon sorunu devam ediyor. Bir kere çekildi. Sonra tüm
         verileri sildim çıkış yaptım tekrar girdim ve bir deneme
         geri geldi. Şunu çöz."
     2) "Bilgileri kaydet dedikten sonra ekran kapanmıyor ya kullanıcı
         deneme çekildiği o an göremiyor; uygulama içi bildirim o
         kartın arkasında kalıyor."

   Kanıtlananlar:
     1) Sıfırlama → otomatik çekim DURUR (kendiliğinden geri getirmez)
     2) "Şimdi dene" → durdurma kalkar, her şey yeniden çekilir
     3) Çıkış/giriş: cihaz damgası buluttan yeni ise eski kopya YÜKLENMEZ
     4) Sıfırlama buluta HEMEN yazılır (1,5 sn beklemeye bırakılmaz)
     5) "Bilgileri Kaydet" → pencere kapanır, çekim görünür olur
     6) Uygulama içi bildirim (toast) pencerelerin ÜSTÜNDE çizilir
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) gecen++; else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }

function dilim(bas, son) {
  const i = APP.indexOf(bas);
  if (i < 0) return "";
  const j = son ? APP.indexOf(son, i) : APP.length;
  return APP.slice(i, j > i ? j : APP.length);
}

// ---------------------------------------------------------------
console.log("\n== 1) Sıfırlama kararı: cihaz damgası buluttan yeni mi? ==");
{
  const kaynak = dilim("function okzSifirlamaGecerli(", "\n}");
  ok("okzSifirlamaGecerli tanımlı", kaynak.length > 0);
  const fn = new Function(kaynak + "\n}\nreturn okzSifirlamaGecerli;")();
  ok("damga yoksa geri yükleme normal (false)", fn(0, 1795000000000) === false);
  ok("damga buluttan YENİ → eski kopya yüklenmez", fn(1795000100000, 1795000000000) === true);
  ok("bulut damgadan yeni → geri yükleme yapılır", fn(1795000000000, 1795000100000) === false);
  ok("bulut zamanı okunamazsa ve damga varsa → koru", fn(1795000000000, 0) === true);
  ok("bozuk damga (−1) korumaz", fn(-1, 0) === false);
}

// ---------------------------------------------------------------
console.log("\n== 2) Sıfırlama: otomatik çekim durur + buluta hemen yazılır ==");
{
  const htmlDilim = (bas, son) => { const i = HTML.indexOf(bas); if (i < 0) return ""; const j = son ? HTML.indexOf(son, i) : HTML.length; return HTML.slice(i, j > i ? j : HTML.length); };
  const er = htmlDilim("function executeReset(type) {", "function exportData()");
  ok("executeReset bulundu", er.length > 0);
  ok("otomatikDurdu işareti konur", /otomatikDurdu:\s*true/.test(er));
  ok("sifirlandiAt zamanı yazılır", /sifirlandiAt:\s*Date\.now\(\)/.test(er));
  ok("cihaz damgası işaretlenir", /__okzSifirlamaIsaretle/.test(er));
  ok("buluta HEMEN yazılır (debounce beklenmez)", /__supabaseSenkronizeEt/.test(er));
  ok("yalnız veri silmede (all|exams) çalışır", /type === "all" \|\| type === "exams"/.test(er));
  ok("kullanıcıya çıkış yolu söylenir", /Okulizyon'dan yeniden çekmek istersen/.test(er));
}

// ---------------------------------------------------------------
console.log("\n== 3) Otomatik çekim durur, kullanıcı isteyince çalışır ==");
{
  const kc = dilim("async function okzKuyrukCek(zorla) {", "  okzCekSuruyor = true;");
  ok("elle / giris çağrı türleri ayrıldı", /const elle = \(zorla === true \|\| zorla === "elle"\)/.test(kc) && /const giris = \(zorla === "giris"\)/.test(kc));
  ok("durdu ise OTOMATİK çekim yapılmaz", /if \(!elle && st0\.otomatikDurdu\)/.test(kc));
  ok("durdu mesajı kullanıcıya yolu gösterir", /«Şimdi dene»ye bas/.test(kc));
  ok("girişte hız sınırı atlanır", /!elle && !giris && st0\.sonDeneme/.test(kc));

  const sunucu = dilim("async function okzSunucuCek() {", "async function okzSunucuCek" === "" ? "" : "\n  const yetki =");
  ok("Şimdi dene durdurmayı kaldırır", /st\.otomatikDurdu = false;/.test(sunucu));
  ok("Şimdi dene cihaz damgasını siler", /__okzSifirlamaTemizle/.test(sunucu));

  ok("giriş yolu 'giris' modunu kullanır", /okzKuyrukCek\("giris"\)/.test(APP));
  ok("açılış/profil otomatik yolu 'false' kullanır", /okzKuyrukCek\(false\)/.test(APP));
}

// ---------------------------------------------------------------
console.log("\n== 4) Çıkış→giriş: buluttaki eski kopya geri gelmez ==");
{
  ok("giriş geri yüklemesi damgayı SORAR", /okzSifirlamaGecerli\(okzSifirlamaDamgasi\(user\.id\), uzakMs\)/.test(APP));
  ok("damga geçerliyse denemeler boşaltılır", /if \(okzSifirlamaGecerli[\s\S]{0,260}state\.exams = \[\];/.test(APP));
  ok("bulut hemen boş durumla ezilir", /if \(okzSifirlamaGecerli[\s\S]{0,700}bulutaYaz\(true\)/.test(APP));
  ok("otomatikDurdu buluttan da geri yüklenir", /if \(okzSifirlamaGecerli[\s\S]{0,400}otomatikDurdu: true/.test(APP));
  ok("kullanıcıya bilgi verilir", /buluttaki eski kayıt geri yüklenmedi/.test(APP));
  ok("damga hesap bazlı (am_sifirlandi_<uid>)", /"am_sifirlandi_" \+ String\(uid/.test(APP));
}

// ---------------------------------------------------------------
console.log("\n== 5) Denemelerim: silinmiş veri kartı + tek dokunuşla geri çekme ==");
{
  ok("kart sayfada çiziliyor", /id="okz-sifirlandi-kart"/.test(HTML));
  ok("kart yalnız durdurma + boş Denemelerim'de", /okzDurdu && !\(state\.exams \|\| \[\]\)\.length/.test(HTML));
  ok("düğme gerçek bir eyleme bağlı", /data-act="okzSimdiCek"/.test(HTML) && /a === "okzSimdiCek"/.test(APP));
  ok("metin 'kendi kendine geri getirmez' diyor", /kendi kendine geri getirmez/.test(HTML));
}

// ---------------------------------------------------------------
console.log("\n== 6) 'Bilgileri Kaydet' → pencere kapanır, çekim görünür ==");
{
  const sb = dilim("function okzSaveBilgi() {", "/* Bulut yazımını BEKLE");
  ok("okzSaveBilgi bulundu", sb.length > 0);
  const iKapat = sb.indexOf("closeProfileModal()");
  const iCek = sb.indexOf("okzSunucuCek()");
  ok("kaydet → profil penceresi KAPANIR", iKapat > 0);
  ok("kapatma çekimden ÖNCE", iKapat > 0 && iCek > iKapat, "kapat:" + iKapat + " çekim:" + iCek);
  ok("toast kapanıştan sonra (görünür)", sb.indexOf('toast("Kaydedildi') > iKapat);
  ok("kod eksikse pencere açık kalır", /if \(kodEksik\)[\s\S]{0,400}return;/.test(sb));
}

// ---------------------------------------------------------------
console.log("\n== 7) Uygulama içi bildirim pencerelerin ÜSTÜNDE ==");
{
  const toastZ = Number((/#toast-container \{[^}]*z-index:\s*(\d+)/.exec(HTML) || [])[1] || 0);
  const modallar = [];
  (HTML + APP).replace(/z-index:\s*(\d{4,5})/g, (m, z) => { modallar.push(Number(z)); return m; });
  const enUstModal = Math.max.apply(null, modallar.filter(z => z !== toastZ));
  ok("toast z-index okunuyor", toastZ > 0, String(toastZ));
  ok("toast en üstteki pencereden YUKARIDA", toastZ > enUstModal, "toast:" + toastZ + " modal:" + enUstModal);
}

// ---------------------------------------------------------------
console.log("\n== 8) Çekim bitince ekran tazelenir ==");
{
  ok("Denemelerim/profil çekim sonunda yenilenir", /currentPage === "exams"[\s\S]{0,120}navigate\("exams"\)/.test(APP));
}

console.log("\n" + "─".repeat(58));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("v88 — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("v88 sıfırlama/görünürlük — " + gecen + "/" + gecen + " geçti ✓");
