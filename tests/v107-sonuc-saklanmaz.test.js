/* ============================================================
   v107 — OKULİZYON SONUÇLARI VERİTABANINDA SAKLANMAZ + KASA KURULUM YÖNLENDİRMESİ
   tests/v107-sonuc-saklanmaz.test.js
   ------------------------------------------------------------
   KULLANICI (21 Kas): "Her şey tamam mı? Ben artık neleri okuyabilirim?
   Kullanıcı neyi nasıl kuracak, kurmazsa ne olur?"

   ÖLÇÜLEN (tahmin değil):
     1) Sunucu (okulizyon-cek) sınav sonuçlarını artık YAZMIYOR:
        yaz() çağrılarında exams/ham_ozet geçmiyor; sonuç yalnız yanıtta dönüyor.
     2) İstemci, sonucu veritabanından OKUMAYA çalışmıyor: çekim yanıtındaki
        exams okzKuyrukCek'e taşınıyor (yoksa v107 sonrası "sonuç yok" derdi).
     3) Kasa kurulmamışsa KURULUM YÖNLENDİRMESİ çıkıyor: adım adım, "sonra"
        3 gün erteler, kurulunca bir daha çıkmaz.
     4) Kasa durumu kullanıcıya DÜRÜST yazılıyor (kurulu değilse "düz duruyor").

   Çalıştır: node tests/v107-sonuc-saklanmaz.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.resolve(__dirname, "..");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const SW = fs.readFileSync(path.join(KOK, "site", "sw.js"), "utf8");
const FN = fs.readFileSync(path.join(KOK, "supabase/functions/okulizyon-cek/index.ts"), "utf8");
const MIG = fs.readFileSync(path.join(KOK, "supabase/migrations/0016_okz_duz_sonuc_temizle.sql"), "utf8");
const KASA = fs.readFileSync(path.join(KOK, "site", "kasa.js"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ayrinti) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { kalan++; hatalar.push(ad + (ayrinti ? " → " + ayrinti : "")); console.log("  ✗ " + ad + (ayrinti ? " → " + ayrinti : "")); }
}

// ------------------------------------------------------------
console.log("\n== 1) SUNUCU: sınav sonucu veritabanına YAZILMIYOR ==");
{
  // yaz() çağrılarının gövdesini topla (yalnız DURUM alanları geçmeli)
  const yazCagrilari = [...FN.matchAll(/await yaz\(\s*userId\s*,\s*\{([\s\S]*?)\}\s*\);/g)].map((m) => m[1]);
  ok("yaz() çağrıları bulundu", yazCagrilari.length >= 4, "bulunan: " + yazCagrilari.length);
  ok("hiçbir yaz() çağrısı exams göndermiyor",
    yazCagrilari.every((b) => !/\bexams\b/.test(b)),
    yazCagrilari.filter((b) => /\bexams\b/.test(b)).join(" | ").slice(0, 160));
  ok("yaz() ek alanlarını (alanlar) düz sonuçla dolduramaz",
    /async function yaz\(userId: string, alanlar: Record<string, unknown>\)/.test(FN));
  ok("ham_ozet hiçbir yazma/yanıt alanında geçmiyor (yalnız tarihsel yorum)",
    !/ham_ozet\s*:/.test(FN) && !/ham_ozet/.test(yazCagrilari.join(" ")));
  ok("sonuç YALNIZ yanıtta dönüyor", /return \{[\s\S]{0,260}exams: dolu\s*\}/.test(FN));
  ok("run (cron) çıktısı yalnız durum/sayı",
    /ozet\.push\(\{ user: s\.user_id, durum: r && r\.durum, sinav: r && r\.sinav, satir: r && r\.satir \}\)/.test(FN));
  ok("v107 gerekçesi kodda yazılı", /v107/.test(FN) && /SAKLANMAZ|saklanmaz/.test(FN));
}

// ------------------------------------------------------------
console.log("\n== 2) İSTEMCİ: sonuç çekim yanıtından geliyor (DB'den değil) ==");
{
  const sunucuCek = APP.slice(APP.indexOf("async function okzSunucuCek()"), APP.indexOf("// Çekim sonucunu kullanıcıya görünür kıl"));
  ok("yanıttaki exams el ile alınıyor", /if \(Array\.isArray\(c\.exams\) && c\.exams\.length\) sunucuExams = c\.exams;/.test(sunucuCek));
  ok("okzKuyrukCek'e taşınıyor", /return okzKuyrukCek\(true, sunucuExams\);/.test(sunucuCek));
  ok("kuyruk fonksiyonu ikinci parametreyi alıyor", /async function okzKuyrukCek\(zorla, sunucuExams\)/.test(APP));

  const kuyruk = APP.slice(APP.indexOf("async function okzKuyrukCek(zorla, sunucuExams)"), APP.indexOf("// Okul sitesinden gelen SINAV duyuruları"));
  ok("kaynak: önce yanıt, sonra tablo (geriye uyum)", /const kaynakExams = \(Array\.isArray\(sunucuExams\) && sunucuExams\.length\) \? sunucuExams : \(data\.exams \|\| \[\]\);/.test(kuyruk));
  ok("okzNormalize kaynakExams ile çalışıyor", /okzNormalize\(kaynakExams\)/.test(kuyruk));
  ok("tablo hâlâ SELECT ile okunuyor (durum için)", /\.select\("exams, pulled_at, durum, durum_mesaji"\)/.test(kuyruk));
  ok("‘sonuç yok’ dalı kullanıcıya ne yapacağını söylüyor", /«Şimdi dene» ile yeniden çekebilirsin/.test(kuyruk));
  ok("istemci bu tabloya YAZMIYOR (insert/upsert yok)",
    !/from\("okulizyon_kuyrugu"\)[\s\S]{0,120}?(insert|upsert|update|delete)\(/.test(APP));
}

// ------------------------------------------------------------
console.log("\n== 3) KASA KURULMAMIŞSA YÖNLENDİRME ==");
{
  const yon = APP.slice(APP.indexOf("const KASA_YON_KEY"), APP.indexOf("async function kasaAcTiklandi()"));
  ok("yönlendirme anahtarı var", /const KASA_YON_KEY = "am_kasa_yon_v1";/.test(APP));
  ok("3 gün erteleme", /const KASA_YON_GUN = 3;/.test(APP) && /kasaYonErtele\(KASA_YON_GUN\)/.test(yon));
  ok("yalnız girişli kullanıcıya çıkar", /typeof currentUser === "undefined" \|\| !currentUser\) return false;/.test(yon));
  ok("kasa kuruluysa çıkmaz", /if \(!KASA\.kasaVarMi\(\)\)/.test(yon));
  ok("günde en fazla bir kez gösterilir", /y\.goruldu && Date\.now\(\) - Number\(y\.goruldu\) < 86400000/.test(yon));
  ok("adımlar kullanıcıya yazılı (şifre ≥8 · kur · 12 kelime)",
    /En az 8 karakterlik bir <b>kasa şifresi<\/b>/.test(yon) && /12 kelimelik kurtarma anahtarını<\/b>/.test(yon));
  ok("kurmamanın bedeli açıkça yazılı", /sunucuda düz metin/.test(yon));
  ok("şifre+kurtarma kaybı uyarısı var", /kurtarılamaz — sunucu açamaz/.test(yon));
  ok("kurulum profildekiyle AYNI yolu kullanıyor", /const r = await kasaKurVeAnahtar\(sifre\);/.test(yon));
  ok("giriş sonrası 4 sn'de tetikleniyor", /setTimeout\(function \(\) \{ try \{ kasaYonlendirmeGoster\(\); \} catch \(e\) \{\} \}, 4000\);/.test(APP));
  ok("kapatınca bayrak düşüyor", /window\.__kasaYonPencereAcik = false; \};/.test(yon));
  ok("kurtarma anahtarı kurulumdan hemen sonra gösteriliyor", /kasaKurtarmaGoster\(r\.kelimeler\)/.test(yon));
}

// ------------------------------------------------------------
console.log("\n== 4) KURULUMUN TEK YOLU + DÜRÜST DURUM ==");
{
  const kur = APP.slice(APP.indexOf("async function kasaKurVeAnahtar(sifre)"), APP.indexOf("/* ---------- v107 KASA KURULUM YÖNLENDİRMESİ"));
  ok("kasaKurVeAnahtar: kur + kurtarma + sarma tek yerde",
    /const r = await window\.__kasa\.kur\(sifre\);/.test(kur) &&
    /window\.__kasa\.kurtarmaUret\(\)/.test(kur) &&
    /kasaSarmayiStateeYaz\(sarma\)/.test(kur));
  ok("8 karakterden kısa şifre reddediliyor", /sifre\.length < 8/.test(kur));
  ok("kurulum sonrası 'sonra' hatırlatması siliniyor", /localStorage\.removeItem\(KASA_YON_KEY\)/.test(kur));
  ok("profildeki düğme de aynı yolu kullanıyor", /const r = await kasaKurVeAnahtar\(sifre\);/.test(APP));
  ok("profil kasa bölümü kurulmamışsa KIRMIZI uyarı yazıyor", /KAPALI — veri sunucuda DÜZ duruyor/.test(APP));
  ok("çekim başında da uyarı veriliyor (sessiz geçilmiyor)", /Kasa kurulu değil: sınav sonuçların sunucuda düz metin duruyor/.test(APP));
  ok("kasa.js gerçek şifreleme yapıyor (AES-GCM + PBKDF2)", /AES-GCM/.test(KASA) && /PBKDF2/.test(KASA) && /310000/.test(KASA));
}

// ------------------------------------------------------------
console.log("\n== 5) DB MİGRASYONU: düz sonuç temizliği doğru sırada ==");
{
  ok("NOT NULL önce kaldırılıyor (23502 hatası tekrarlamaz)",
    MIG.indexOf("alter column exams drop not null") > 0 &&
    MIG.indexOf("alter column exams drop not null") < MIG.indexOf("update public.okulizyon_kuyrugu set exams = null"));
  ok("varsayılan da kaldırılıyor", /alter column exams drop default/.test(MIG));
  ok("ham_ozet kolonu düşürülüyor", /drop column if exists ham_ozet/.test(MIG));
  ok("istemci yazma yetkisi alınıyor", /revoke insert, update, delete/.test(MIG) && /from anon, authenticated/.test(MIG));
  ok("anon yetkisi tamamen alınıyor", /revoke all on public\.okulizyon_kuyrugu from anon/.test(MIG) ||
    /revoke insert, update, delete, truncate, references, trigger\s*\n\s*on public\.okulizyon_kuyrugu from anon, authenticated/.test(MIG));
  ok("kendi kendini denetleyen blok var", /raise exception 'v107: /.test(MIG));
  ok("tek politika: kendi satırını oku", /create policy okulizyon_kuyrugu_select_own/.test(MIG));
}

// ------------------------------------------------------------
console.log("\n== 6) Sürüm + önbellek ==");
{
  const surum = (APP.match(/const PWA_SURUM = "([^"]+)"/) || [])[1] || "";
  const cache = (SW.match(/const CACHE = "([^"]+)"/) || [])[1] || "";
  ok("PWA_SURUM v107", /^v107/.test(surum), surum);
  ok("CACHE aynı sürümle bitiyor", cache.endsWith(surum), cache);
}

// ------------------------------------------------------------
console.log("\n" + "─".repeat(60));
if (kalan) {
  console.log("\n✗ " + kalan + " kontrol kaldı (" + gecen + " geçti)");
  hatalar.forEach((h) => console.log("  · " + h));
  process.exit(1);
}
console.log("v107 testleri — " + gecen + "/" + gecen + " geçti ✓");
