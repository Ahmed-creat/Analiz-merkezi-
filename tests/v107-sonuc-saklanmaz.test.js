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
  ok("cron şifreli kaydı ATLIYOR (yanlış 'bilgi-yok' yazmıyor)",
    /if \(!kimlikGecerli\(sKim\)\) \{[\s\S]{0,320}kasa-sifreli/.test(FN));
  ok("v107 gerekçesi kodda yazılı", /v107/.test(FN) && /SAKLANMAZ|saklanmaz/.test(FN));
  /* Kasa açıkken sunucu şifreli kaydı okuyamaz → kimlik İSTEKTEN gelir. */
  ok("kimlik istekten kabul ediliyor (kasa açık yolu)", /kimlikGecerli\(istekKimlik\) \? \{ \.\.\.istekKimlik \}/.test(FN));
  ok("kimlik yalnız istek süresince: DB'ye ad yazılmıyor", !/kimlik\s*:\s*isOK|ad:\s*kim\.ad[\s\S]{0,60}bagYaz\(/.test(FN));
  ok("kendi bağı varsa kimlik bağdan da tamamlanabiliyor", /const bag = mevcut \|\| await bagOku\(userId\);/.test(FN));
  ok("kimlik yoksa kullanıcıya ne yapacağı yazılıyor", /Profil → Okulizyon bölümünden ad soyad, okul no ve okulu seçip kaydet/.test(FN));
}

// ------------------------------------------------------------
console.log("\n== 2) İSTEMCİ: sonuç çekim yanıtından geliyor (DB'den değil) ==");
{
  const sunucuCek = APP.slice(APP.indexOf("async function okzSunucuCek()"), APP.indexOf("// Çekim sonucunu kullanıcıya görünür kıl"));
  ok("yanıttaki exams el ile alınıyor", /if \(Array\.isArray\(c\.exams\) && c\.exams\.length\) sunucuExams = c\.exams;/.test(sunucuCek));
  ok("okzKuyrukCek'e taşınıyor", /return okzKuyrukCek\(true, sunucuExams\);/.test(sunucuCek));
  ok("kasa açıkken kimlik istekte gönderiliyor", /const acik = !!\(window\.__kasa && window\.__kasa\.durum\(\)\.acik\);/.test(sunucuCek) && /body: JSON\.stringify\(\{ mod: "ben", sifre: OKZ_SIFRE_BELLEK \|\| undefined, kimlik \}\)/.test(sunucuCek));
  ok("kasa kapalıyken kimlik GÖNDERİLMİYOR", /if \(acik && o\.ad && o\.okulNo && o\.kurumkodu\)/.test(sunucuCek));
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
console.log("\n== 3) ZORUNLU İLK KURULUM (v108) ==");
{
  const kurulum = APP.slice(APP.indexOf("const KURULUM_TAM_KEY"), APP.indexOf("async function kasaAcTiklandi()"));
  ok("zorunlu kurulum işareti tanımlı", /const KURULUM_TAM_KEY = "am_kurulum_tam_v1";/.test(APP));
  ok("eski 3 gün erteleme KALDIRILDI", !/am-yon-sonra/.test(APP) && !/function kasaYonErtele/.test(APP));
  ok("yalnız girişli kullanıcıya çıkar", /typeof currentUser === "undefined" \|\| !currentUser\) return false;/.test(kurulum));
  ok("kilit zaten açıksa çıkmaz", /if \(KASA\.kasaAcikMi\(\)\) return false;/.test(kurulum));
  ok("giriş sonrası zorunlu akış tetikleniyor", /setTimeout\(function \(\) \{ try \{ kurulumAkisi\(\); \} catch \(e\) \{\} \}, 600\);/.test(APP));
  ok("kayıttan HEMEN sonra panel açılıyor", /const \{ data, error \} = await sb\.auth\.signUp[\s\S]{0,400}kurulumAkisi\(\)/.test(APP));
  ok("tek panel üç adım", /id="kur-adim1"/.test(kurulum) && /id="kur-adim2"/.test(kurulum) && /id="kur-adim3"/.test(kurulum));
  ok("bilgi paneli ad soyad · okul no · sınıf", /id="kur-ad"/.test(kurulum) && /id="kur-okulno"/.test(kurulum) && /id="kur-sinif"/.test(kurulum));
  ok("bilgi paneli il · ilçe · okul (Okulizyon listeleri)", /kurSecimHtml\("kur-il"/.test(kurulum) && /kurSecimHtml\("kur-ilce"/.test(kurulum) && /kurSecimHtml\("kur-okul"/.test(kurulum));
  ok("adım 1 boş geçilemiyor", /Ad soyadını yaz\./.test(kurulum) && /Okul numaranı yaz\./.test(kurulum) && /İl, ilçe ve okulunu yaz/.test(kurulum));
  ok("adım 2 şifre ≥6 + tekrar", /s1\.length < 6/.test(kurulum) && /İki şifre aynı değil/.test(kurulum));
  ok("adım 2 kilidi gerçekten kuruyor", /const r = await kasaKurVeAnahtar\(s1\);/.test(kurulum));
  ok("adım 3: 12 kelime + indirme", /kur-kelimeler/.test(kurulum) && /anahtar-kelimeleri\.txt/.test(kurulum));
  ok("adım 3 onaysız bitmiyor", /kur-onay/.test(kurulum) && /Önce «kâğıda yazdım» kutusunu işaretle/.test(kurulum));
  ok("panelde kapatma (çarpı) düğmesi yok", !/id="kur-kapat"/.test(kurulum) && !/kurulum[\s\S]{0,200}?Çarpı/.test(kurulum));
  ok("şifre kaybı uyarısı yazılı", /kurtarılamaz — sunucu açamaz/.test(kurulum));
  ok("kurulum sonrası eski erteleme kalıntısı siliniyor", /localStorage\.removeItem\("am_kasa_yon_v1"\)/.test(APP));
}

// ------------------------------------------------------------
console.log("\n== 3b) İLK AÇILIŞTA GİRİŞ/KAYIT EKRANI (v108) ==");
{
  ok("oturum yoksa giriş ekranı kendiliğinden açılıyor", /if \(!s\) authZorunluAc\(\);/.test(APP));
  ok("zorunlu kipte çarpı gizleniyor", /kapat\.style\.display = "none";/.test(APP) && /__amAuthZorunlu = true/.test(APP));
  ok("zorunlu kipte arka plana tıklama kapatmıyor", /e\.target === m && !window\.__amAuthZorunlu/.test(APP));
  ok("kullanıcıya neden açıldığı yazılı", /Devam etmek için giriş yap ya da yeni kayıt oluştur/.test(APP));
  ok("e-posta + şifre kaydı duruyor", /sb\.auth\.signUp\(\{ email: email, password: pass \}\)/.test(APP));
}

// ------------------------------------------------------------
console.log("\n== 3c) KULLANICI METİNLERİ: 'kasa' JARGONU YOK ==");
{
  /* "kasa" YALNIZ kullanıcıya görünen cümlelerde aranır; am-kasa-yeni gibi
     kimlikler tireyle ayrıldığı için dışarıda kalır. */
  const jargon = [];
  // Yalnız CÜMLE İÇİNDE geçen "kasa" jargonu: kelime sınırlı + büyük/küçük harf.
  const kural = /(^|[^-\w.])[Kk]asa(\s|y|ı|i|n|c|d|\b)/;
  // Geliştirici yorumları taranmaz (kullanıcı görmez).
  const APP_YORUMSUZ = APP.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");
  (APP_YORUMSUZ.match(/toast\(\s*"[^"]*"|'[^']{10,}'|>[^<>{}]{8,}</g) || []).forEach((t) => {
    if (!kural.test(t)) return;
    if (/\.js|am[-_]kasa|__kasa|kasaKur|KASA_/.test(t)) return;
    jargon.push(t);
  });
  ok("görünen metinlerde 'kasa' geçmiyor", jargon.length === 0, jargon.slice(0, 3).join(" | "));
  ok("yeni terimler: 'giriş şifresi' + 'bilgilerini tamamla'", /Giriş şifresi/.test(APP) && /Bilgilerini tamamla/.test(APP));
  ok("12 kelime artık 'anahtar'", /12 kelimelik anahtarın/.test(APP));
}

// ------------------------------------------------------------
console.log("\n== 4) KURULUMUN TEK YOLU + DÜRÜST DURUM ==");
{
  const kur = APP.slice(APP.indexOf("async function kasaKurVeAnahtar(sifre)"), APP.indexOf("/* ---------- v108 İLK KURULUM"));
  ok("kasaKurVeAnahtar: kur + kurtarma + sarma tek yerde",
    /const r = await window\.__kasa\.kur\(sifre\);/.test(kur) &&
    /window\.__kasa\.kurtarmaUret\(\)/.test(kur) &&
    /kasaSarmayiStateeYaz\(sarma\)/.test(kur));
  ok("6 karakterden kısa şifre reddediliyor", /sifre\.length < 6/.test(kur));
  ok("profildeki düğme de aynı yolu kullanıyor", /const r = await kasaKurVeAnahtar\(sifre\);/.test(APP));
  /* v125 — metin sadeleşti (kullanıcı: teknik cümle istemiyorum) ama
     DÜRÜSTLÜK aynı: kilit yoksa kırmızı çerçevede açıkça yazar. */
  ok("kasa bölümü kurulmamışsa KIRMIZI uyarı yazıyor", /KAPALI — verilerin şifreli değil/.test(APP));
  ok("çekim başında da uyarı veriliyor (sessiz geçilmiyor)", /Kilit kurulu değil: sınav sonuçların sunucuda düz metin duruyor/.test(APP));
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
  ok("PWA_SURUM güncel (v114+)", /^v1[0-9][0-9]/.test(surum), surum);
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
