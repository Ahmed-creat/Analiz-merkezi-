/* ============================================================
   v125 — PROFİL AYARLARIN İÇİNDE + SADELEŞTİRME SÖZLEŞMESİ
   tests/v125-profil-ayarlar.test.js
   ------------------------------------------------------------
   KULLANICI (6 madde):
     1) "görevler neden sabit yani değişiyordu"  → cevap arayüzde yazılı
     2) "ayarlardaki uygulamayı tanı bölümünü kaldır" → düğme ve olay yok
     3) "silme işlemleri direk hem cihaz hem bulut için olsun" → tek iş
     4) "Okulizyon çekimi otomatik olmuyor mu? Neden kilidi açmak gereksin ki
         ... WhatsApp'ta olduğu gibi hep şifreli kalır, neden açıp kapatsın ki"
        → çekimden önce sessiz açma; "Kilitle" düğmesi YOK
     5) "Bunun gibi cümleler olmayacak demedim mi? ... sadece şifreli olduğunu
         kimsenin görmediğini yaz" → teknik anlatım yok, WhatsApp benzetmesi
     6) "profil bölümünü ayarlara taşı. Profilde hesap, bilgiler, veri bölümleri
         olsun" → ayrı tam ekran pencere YOK; Ayarlar'da üç bölüm

   Bu test DAVRANIŞI değil SÖZLEŞMEYİ ölçer: kaldırılan şey geri gelirse kırılır.
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const oku = (p) => fs.readFileSync(path.join(KOK, p), "utf8");
const APP = oku("site/app-pwa.js");
const HTML = oku("site/index.html");
const KASA = oku("site/kasa.js");
/* Kullanıcıya GİDEN metin: kod yorumları çıkarılır (yorumda geçmesi serbest). */
const APP_METIN = APP.replace(/\/\*[\s\S]*?\*\//g, "").split("\n").filter((s) => !/^\s*\/\//.test(s)).join("\n");

let gecen = 0;
const hatalar = [];
function ok(ad, kosul, ayrinti) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { hatalar.push(ad + (ayrinti ? " → " + ayrinti : "")); console.log("  ✗ " + ad + (ayrinti ? " → " + ayrinti : "")); }
}

// ------------------------------------------------------------
console.log("\n== 1) Görev listesi = bildirimin görevleri ==");
{
  /* v126 — KULLANICI: "Görevlerde bildirim geliyor ya bunun görevleri diye
     onlar yer alacak." Bildirimdeki üç sayı (görev · tekrar · acil) ile
     listedeki işler AYNI kaynaktan gelmeli. */
  ok("saçma 'değişen kısım / sabit kalan kısım' paragrafı SİLİNDİ",
    !/Değişen kısım/.test(HTML) && !/Sabit kalan kısım/.test(HTML));
  ok("'günün işi · çekirdek' uydurma rozet ayrımı SİLİNDİ",
    !/günün işi/.test(HTML) && !/cekirdekKalan/.test(HTML));
  ok("bildirimdeki 'tekrar' sayısı listede KONU KONU karşılanıyor",
    /tekrarlar\.forEach\(\(r, i\) =>/.test(HTML) && /baslik: "Tekrar: " \+ r\.topic/.test(HTML));
  ok("bildirimdeki 'acil konu' sayısı listede KONU KONU karşılanıyor",
    /acilKonular\.forEach\(\(p, i\) =>/.test(HTML) && /baslik: "Acil: "/.test(HTML));
  ok("acil kaynağı bildirimle AYNI fonksiyon (calculatePriority), kırpma yok",
    /acilKonular = calculatePriority\(\) \|\| \[\]/.test(HTML) &&
    !/acilKonular[^\n]*slice/.test(HTML));
  ok("tekrar kaynağı bildirimle AYNI alan (ms.rows due)", /const tekrarlar = ms\.rows\.filter\(r => r\.due\)/.test(HTML));
  ok("bildirim sayıları listeden sayılıyor (tek kaynak)",
    /liste = gunlukGorevler\(\) \|\| \[\]/.test(HTML) && /b\.toplam = b\.gorev \+ b\.tekrar \+ b\.acil/.test(HTML) &&
    !/b\.gorev = \(gunlukGorevler\(\) \|\| \[\]\)\.length/.test(HTML));
  ok("rozet yalnız SAYI söylüyor", /gorevler\.length \+ " iş bekliyor"/.test(HTML));
}

// ------------------------------------------------------------
console.log("\n== 2) 'Uygulamayı Tanı' ayarlardan KALDIRILDI ==");
{
  ok("düğme HTML'de yok", !/Uygulamayı Tanı/.test(HTML));
  ok("data-act=\"tanitimAc\" hiçbir yerde yok", !/data-act="tanitimAc"/.test(HTML) && !/data-act="tanitimAc"/.test(APP));
  ok("olay işleyicisi de kaldırıldı (ölü yol yok)", !/case "tanitimAc"/.test(HTML));
  ok("ilk açılış tanıtımı SÜRÜYOR (kaldırılan düğme değil)", /tanitimGoster\(false\)/.test(HTML));
  ok("kılavuz düğmesi KALDI", /data-act="openHelp"/.test(HTML));
}

// ------------------------------------------------------------
console.log("\n== 3) Silme: cihaz + bulut TEK iş ==");
{
  ok("onay metni iki kapsamı birlikte söylüyor", /Bu işlem <b>cihazdaki ve buluttaki<\/b> kopyayı birlikte siler\./.test(HTML));
  ok("onay metni SABİT (her türde aynı kapsam)", /const kapsam = "Bu işlem/.test(HTML));
  ok("bulut yazımı BEKLENİYOR (sonuç kullanıcıya söylenir)", /Promise\.resolve\(yaz\)\.then/.test(HTML));
  ok("bulut başarısızsa sessiz kalmıyor", /Buluta yazılamadı — bağlantı gelince tekrar dene/.test(HTML));
  ok("bulut başarılıysa tek cümle: 'cihaz ve bulut birlikte'", /cihaz ve bulut birlikte\./.test(HTML));
  ok("giriş yoksa dürüst: bulut kopyası yok", /giriş yapılmadığı için bulut kopyası yok/.test(HTML));
  ok("arayüzde 'ayrı ayrı' iş yok (tek açıklama)", /Silme işlemleri <b>cihazı ve bulutu birlikte<\/b> kapsar; ayrı seçim yok\./.test(HTML));
  ok("tüm veri düğmesi kapsamı adında yazıyor", /Tüm Verileri Sıfırla \(cihaz \+ bulut\)/.test(HTML));
}

// ------------------------------------------------------------
console.log("\n== 4) Okulizyon çekimi kilide TAKILMIYOR ==");
{
  ok("çekimden önce sessiz açma deneniyor", /sessiz = await kasaCihazdanSessizAc\(\)/.test(APP));
  ok("sessiz açma başarısızsa tek pencere (yeni cihaz)", /Bu cihazda anahtar yok — bir kez giriş şifreni yaz/.test(APP));
  ok("eski 'önce kilidi aç' zorunluluğu kalktı", !/Okulizyon çekimi için Profil → bölümünden kilidi aç/.test(APP));
  /* KULLANICI: "neden açıp kapatsın ki" → aç/kapa düğmesi ARAYÜZDE YOK. */
  ok("'Kilitle' düğmesi arayüzden kaldırıldı", !/data-act="kasaKilitle"/.test(APP));
  ok("anahtar cihazda kalıcı (bir kez açılır)", /async function cihezdanAc\(\)/.test(KASA) && /extractable: false|false, \["encrypt", "decrypt"\]|generateKey\(\s*\{ name: "AES-GCM", length: 256 \}, false/.test(KASA));
  ok("sayfa yenilenince şifre sorulmuyor (cihazdan açma)", /cihezdanAc\(\).*return true|if \(_anahtar\) return true/.test(KASA));
  ok("anahtar yalnız çıkışta/hesap silmede gidiyor", /doSignOut[\s\S]{0,1500}KASA\.kasaKilitle\(\)/.test(APP));
  ok("durum açıklaması Ayarlar'ı gösteriyor", /Ayarlar → VERİ bölümünden bir kez giriş şifreni yaz/.test(APP));
}

// ------------------------------------------------------------
console.log("\n== 5) Sade dil: WhatsApp benzetmesi, teknik cümle yok ==");
{
  ok("WhatsApp benzetmesi kullanıcı metninde var", /WhatsApp/.test(APP_METIN));
  ok("'kimse okuyamaz' güven cümlesi var", /kimse okuyamaz/.test(APP_METIN));
  ok("'bu cihazda şifrelenir ... sunucu' teknik anlatımı YOK", !/bu cihazda şifrelenir/.test(APP_METIN) && !/sunucu yalnız anlamsız harf görür/.test(APP_METIN));
  ok("'Şifren sunucuya hiç gitmez' cümlesi YOK", !/sunucuya hiç gitmez/.test(APP_METIN));
  ok("'anahtar türetmek için kullanılır' cümlesi YOK", !/anahtar türetmek için kullanılır/.test(APP_METIN));
  ok("DÜRÜST durum korunuyor: kilit yoksa kırmızı çerçevede yazar", /KAPALI — verilerin şifreli değil/.test(APP));
  ok("kilitli durum da dürüst", /KİLİTLİ — bu cihazda açılması gerekiyor/.test(APP));
  ok("WhatsApp 'yeni telefonda bir kez' benzetmesi", /WhatsApp da yeni bir telefonda bir kez anahtar ister/.test(APP));
  ok("kurulum paneli de sade: 'WhatsApp gibi'", /WhatsApp gibi/.test(APP));
}

// ------------------------------------------------------------
console.log("\n== 6) Profil AYARLARIN içinde: HESAP · BİLGİLER · VERİ ==");
{
  ok("profil için üç bölüm kabı var", /data-profil-grup="hesap"/.test(HTML) && /data-profil-grup="bilgiler"/.test(HTML) && /data-profil-grup="veri"/.test(HTML));
  ok("HESAP içerik kabı", /id="profil-hesap-icerik"/.test(HTML));
  ok("BİLGİLER içerik kabı", /id="profil-bilgiler-icerik"/.test(HTML));
  ok("VERİ içerik kabı", /id="profil-veri-icerik"/.test(HTML));
  ok("üçü de tek fonksiyondan yazılıyor", /function profilBolumlerineYaz\(\)/.test(APP));
  ok("Ayarlar açılınca bölümler tazeleniyor", /if \(window\.__profilTaze\) window\.__profilTaze\(\)/.test(HTML));
  /* Kök neden: iki ayrı yer (profil penceresi + ayarlar) aynı bilgiyi tutuyordu. */
  ok("ayrı tam ekran profil penceresi AÇILMIYOR", !/m\.style\.display = "flex"/.test(APP.slice(APP.indexOf("function openProfileModal"), APP.indexOf("function closeProfileModal") + 200)));
  ok("profil aç → Ayarlar açılıyor", /function openProfileModal\(\)[\s\S]{0,900}openSettings\(\)/.test(APP));
  ok("Hesap silme + bize ulaş HESAP bölümünde (KVKK m.7 / m.13 KORUNDU)", /data-act="hesapSil"/.test(APP) && /data-act="iletisim"/.test(APP));
  ok("Okulizyon kimliği BİLGİLER bölümünde", /okzSecim\("il"/.test(APP) && /profil-bilgiler-icerik/.test(APP));
  ok("veri kilidi VERİ bölümünde", /profil-veri-icerik/.test(APP) && /data-act="kasaKur"/.test(APP));
  ok("anahtar kelimeleri indirme KORUNDU", /anahtar-kelimeleri\.txt/.test(APP));
}

// ------------------------------------------------------------
console.log("\n== 7) Sürüm damgası ==");
{
  const surum = (APP.match(/const PWA_SURUM = "([^"]+)"/) || [])[1] || "";
  const swSite = oku("site/sw.js");
  const swKok = oku("sw.js");
  ok("PWA_SURUM v125+", /^v12[5-9]/.test(surum), surum);
  ok("site/sw.js aynı damgayı taşıyor", swSite.includes(surum));
  ok("kök sw.js aynı damgayı taşıyor", swKok.includes(surum));
}

// ------------------------------------------------------------
console.log("\n" + "─".repeat(60));
if (hatalar.length) {
  console.log("\n✗ " + hatalar.length + " kontrol kaldı (" + gecen + " geçti)");
  hatalar.forEach((h) => console.log("  · " + h));
  process.exit(1);
}
console.log("v125 profil/ayarlar testleri — " + gecen + "/" + gecen + " geçti ✓");
