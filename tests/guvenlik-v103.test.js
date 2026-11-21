// ============================================================
// v103 — GÜVENLİK TESTLERİ (tests/guvenlik-v103.test.js)
// ------------------------------------------------------------
// KULLANICI (31 Ekim 2026, sade dil): "Uygulamada bazı veri ve güvenlik
// sorunları var. Kullanıcıların bilgilerini ben görmemem gerekiyor. RLS vb
// her şey kullanılıyor mu?" → "Önce açıkları kapat."
//
// Bu dosya kod ve göç dosyalarını denetler. Veritabanının CANLI durumu
// ayrıca SQL ile ölçüldü (aşağıdaki "canlı ölçüm" notlarına bakınız);
// burada amaç, düzeltmelerin ileride sessizce GERİ GELMEMESİ.
// ============================================================
const fs = require("fs");
const path = require("path");

const KOK = path.resolve(__dirname, "..");
const oku = (p) => fs.readFileSync(path.join(KOK, p), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ayrinti) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { kalan++; hatalar.push(ad + (ayrinti ? " → " + ayrinti : "")); console.log("  ✗ " + ad + (ayrinti ? " → " + ayrinti : "")); }
}

const MIG = oku("supabase/migrations/0014_guvenlik_sertlestirme.sql");
const APP = oku("site/app-pwa.js");
const SW = oku("site/sw.js");
const CEK = oku("supabase/functions/okulizyon-cek/index.ts");

// ------------------------------------------------------------
console.log("\n== 1) RLS'in durdurmadığı tablo yetkileri (TRUNCATE) ==");
{
  // Canlı ölçüm (31 Ekim): has_table_privilege('anon','app_states','TRUNCATE')
  // = true idi → tek istekle tüm öğrenci verisi silinebiliyordu.
  ok("göç dosyası var", MIG.length > 500);
  ok("anon+authenticated'dan TRUNCATE alınıyor",
    /revoke\s+truncate,\s*references,\s*trigger\s+on\s+all\s+tables\s+in\s+schema\s+public\s+from\s+anon,\s*authenticated/i.test(MIG));
  ok("REFERENCES ve TRIGGER da alınıyor (RLS durdurmaz)",
    /truncate,\s*references,\s*trigger/i.test(MIG));
  ok("gelecekteki tablolar için varsayılan da kapatılıyor",
    /alter\s+default\s+privileges[\s\S]{0,120}revoke\s+truncate/i.test(MIG));
  ok("kendi kendini denetleyen blok var (sessiz başarısızlık yok)",
    /if\s+n_truncate\s*>\s*0\s+then\s+raise\s+exception/i.test(MIG));
}

// ------------------------------------------------------------
console.log("\n== 2) Cron fonksiyonları istemciye kapalı ==");
{
  const fonksiyonlar = [
    "bildirim_tekrar_tetikle", "bildirim_kuyruk_tetikle", "bildirim_cron_tetikle",
    "webpush_tetikle", "gorev_cron_tetikle", "okulizyon_cron_tetikle"
  ];
  fonksiyonlar.forEach(function (f) {
    ok(f + " → public/anon/authenticated'dan alınıyor",
      new RegExp("revoke all on function public\\." + f + "\\(\\) from public, anon, authenticated", "i").test(MIG));
    ok(f + " → yalnız service_role çalıştırabilir",
      new RegExp("grant execute on function public\\." + f + "\\(\\) to service_role", "i").test(MIG));
  });
  // Canlı ölçüm: bildirim_deneme_kuyruk anon'da true idi (0008 kararı geri gelmişti)
  ok("bildirim_deneme_kuyruk: yalnız GİRİŞLİ kullanıcı",
    /revoke all on function public\.bildirim_deneme_kuyruk\(text, text, text\) from public, anon/i.test(MIG) &&
    /grant execute on function public\.bildirim_deneme_kuyruk\(text, text, text\) to authenticated, service_role/i.test(MIG));
  ok("tetikleyici fonksiyonu istemci çağıramaz",
    /revoke all on function public\.bildirim_log_ayna\(\) from public, anon, authenticated/i.test(MIG));
}

// ------------------------------------------------------------
console.log("\n== 3) push_teslim: sızıntı kapandı, işlev düzeldi ==");
{
  ok("eski 'herkes okur' politikası düşürülüyor",
    /drop policy if exists "sw_select" on public\.push_teslim/i.test(MIG));
  ok("eski sınırsız UPDATE politikası düşürülüyor (kullanılmıyordu)",
    /drop policy if exists "sw_update" on public\.push_teslim/i.test(MIG));
  ok("anon okuma son 10 dakikayla sınırlı",
    /push_teslim_sw_son10dk[\s\S]{0,160}interval '10 minutes'/i.test(MIG));
  ok("anon yalnız EKLEME yapabilir (UPDATE/DELETE yok)",
    /push_teslim_sw_ekle[\s\S]{0,120}for insert/i.test(MIG) &&
    /revoke delete, update, references, trigger, truncate on public\.push_teslim from anon, authenticated/i.test(MIG));
  ok("girişli kullanıcı kendi cihaz ölçümünü okuyabilir (işlev geri geldi)",
    /push_teslim_cihaz_okur[\s\S]{0,80}for select to authenticated/i.test(MIG));
  ok("30 günden eski teşhis satırları siliniyor",
    /delete from public\.push_teslim where created_at < \(now\(\) - interval '30 days'\)/i.test(MIG));
}

// ------------------------------------------------------------
console.log("\n== 4) Okulizyon şifresi HİÇ saklanmıyor ==");
{
  ok("şifre state'e yazılmıyor (buluta gitmez)",
    !/settings\.okulizyon\.sifre\s*=\s*sifreEl/.test(APP));
  ok("state'teki şifre alanı siliniyor",
    /delete state\.settings\.okulizyon\.sifre/.test(APP));
  ok("şifre yalnız bellekte tutuluyor",
    /let OKZ_SIFRE_BELLEK = ""/.test(APP));
  ok("çekim bitince bellekten de siliniyor (finally)",
    /finally\s*\{[\s\S]{0,200}OKZ_SIFRE_BELLEK = ""/.test(APP));
  ok("şifre kutusu kayıtlı değerle DOLMUYOR (value=\"\")",
    /id="okz-sifre" type="password" autocomplete="off" value=""/.test(APP));
  ok("kullanıcıya 'saklanmaz' yazılı",
    /KAYDEDİLMEZ|saklanmaz/i.test(APP));
  ok("şifre yalnız o isteğin gövdesinde sunucuya gider",
    /mod: "ben", sifre: OKZ_SIFRE_BELLEK/.test(APP));
  ok("sunucu şifreyi DB'ye yazmıyor, bellek kopyasında kullanıyor",
    /ivediSifre[\s\S]{0,400}kopya\.settings\.okulizyon = Object\.assign/.test(CEK) &&
    !/app_states[\s\S]{0,200}ivediSifre[\s\S]{0,200}PATCH/i.test(CEK));
}

// ------------------------------------------------------------
console.log("\n== 5) E-posta doğrulaması zorunlu (bağlamanın temeli) ==");
{
  ok("okulizyon-cek doğrulanmamış e-postayı reddediyor",
    /email_confirmed_at[\s\S]{0,160}eposta-dogrulanmadi/.test(CEK));
  ok("ret 403 ile ve Türkçe mesajla",
    /mesaj: "E-postandaki onay bağlantısına tıkla/.test(CEK));
  ok("istemci bu durumu Türkçe açıklıyor",
    /"eposta-dogrulanmadi": "E-postandaki onay bağlantısına tıkla/.test(APP));
  ok("kayıt ekranı 'onay bağlantısı' adımını söylüyor",
    /onay bağlantısı gönderdik/i.test(APP));
}

// ------------------------------------------------------------
console.log("\n== 6) Şifre kuralı tek yerden ==");
{
  ok("tek kural fonksiyonu var", /function sifreKurali\(p\)/.test(APP));
  ok("en az 8 karakter", /s\.length < 8[\s\S]{0,80}en az 8 karakter/i.test(APP));
  ok("harf + rakam zorunlu", /\[0-9\]/.test(APP.split("function sifreKurali")[1].slice(0, 400)));
  ok("kayıtta kullanılıyor", /const sifreHata = sifreKurali\(pass\)/.test(APP));
  ok("şifre yenilemede de kullanılıyor", /const kural = sifreKurali\(yeni\)/.test(APP));
  ok("eski 6 karakter kuralı kalmadı", !/pass\.length < 6/.test(APP));
  ok("AUTH_ERR'de yinelenen anahtar yok", (function () {
    const b = APP.slice(APP.indexOf("const AUTH_ERR"), APP.indexOf("function authMsg"));
    const ks = [...b.matchAll(/^\s*"([^"]+)":/gm)].map(m => m[1]);
    return ks.length === new Set(ks).size;
  })());
}

// ------------------------------------------------------------
console.log("\n== 7) Sürüm damgası + önbellek uyumu ==");
{
  const surum = (APP.match(/const PWA_SURUM = "([^"]+)"/) || [])[1] || "";
  const cache = (SW.match(/const CACHE = "([^"]+)"/) || [])[1] || "";
  ok("PWA_SURUM v105", /^v105/.test(surum), surum);
  ok("CACHE aynı sürümle bitiyor", cache.endsWith(surum), cache);
}

// ------------------------------------------------------------
console.log("\n== 8) Regresyon yok: mevcut korumalar yerinde ==");
{
  const POL = oku("supabase/migrations/0001_analiz_merkezi_supabase_schema.sql");
  ok("app_states RLS politikaları hâlâ kullanıcıya bağlı",
    /auth\.uid\(\)\s*=\s*user_id/.test(POL));
  ok("göç app_states'e dokunmuyor (veri korunur)",
    !/drop table if exists public\.app_states\b(?!_)/i.test(MIG));
  ok("yalnız amaçsız YEDEK tablo düşürülüyor",
    /drop table if exists public\.app_states_yedek_20261029/i.test(MIG));
  ok("cron işleri postgres rolüyle çalışır → REVOKE onları bozmaz",
    /username = postgres/i.test(MIG) || /cron\.job işleri "postgres"/i.test(MIG));
}

// ------------------------------------------------------------
console.log("\n== 9) Okulizyon kimlik bağı: bir okul no = tek hesap ==");
{
  const KIM = oku("supabase/migrations/0015_okulizyon_kimlik.sql");

  ok("kimlik tablosu var", /create table if not exists public\.okulizyon_kimlik/.test(KIM));
  ok("kullanıcıya bağlı (hesap silinince kayıt da gider)",
    /user_id\s+uuid primary key references auth\.users\(id\) on delete cascade/.test(KIM));
  ok("TEKİL indeks: aynı okul + no iki hesaba bağlanamaz",
    /create unique index[\s\S]{0,140}\(kurumkodu, okul_no\)[\s\S]{0,80}where durum = 'aktif'/.test(KIM));
  ok("RLS açık", /alter table public\.okulizyon_kimlik enable row level security/.test(KIM));
  ok("kullanıcı yalnız KENDİ satırını okur",
    /for select to authenticated using \(auth\.uid\(\) = user_id\)/.test(KIM));
  ok("anon erişimi tamamen kapalı",
    /revoke all on public\.okulizyon_kimlik from anon, authenticated/.test(KIM));
  ok("istemci YAZAMAZ (yalnız sunucu bağlar)",
    !/grant (insert|update|delete|all) on public\.okulizyon_kimlik to authenticated/.test(KIM) &&
    /grant all on public\.okulizyon_kimlik to service_role/.test(KIM));
  ok("düz ad saklanmaz (yalnız özet)", /ad_ozet/.test(KIM) && !/\bad\s+text/.test(KIM));

  // --- Sunucu tarafı akış ---
  ok("çekimden ÖNCE sahiplik sorgusu yapılıyor",
    /const sahip = await bagSahibi\(/.test(CEK) &&
    CEK.indexOf("bagSahibi(") < CEK.indexOf("const k = new Kavanoz()"));
  ok("başka hesaba bağlıysa çekim YAPILMAZ (kimlik-cakisma)",
    /if \(sahip && sahip !== userId\)[\s\S]{0,320}return \{ durum: "kimlik-cakisma", mesaj: m \}/.test(CEK));
  ok("kurum kodu yoksa bağ kurulmaz", /if \(!kim\.kurumkodu\)/.test(CEK));
  ok("hesap farklı numaraya geçemez (önce bağ kaldırılmalı)",
    /mevcut\.kurumkodu !== String\(kim\.kurumkodu\)/.test(CEK));
  ok("eşzamanlı bağlanmada unique ihlali yakalanıyor",
    /23505|duplicate/i.test(CEK));
  ok("ad yalnız SHA-256 özetiyle gönderiliyor",
    /crypto\.subtle\.digest\("SHA-256"/.test(CEK) && /adOzet\(ad\)/.test(CEK));
  ok("istemci çakışmayı Türkçe anlatıyor",
    /"kimlik-cakisma": "Bu okul numarası başka bir hesaba bağlı/.test(APP));

  /* v105 — KULLANICI: "Nasıl yanlış hesap bağlayacak ki?"
     Bağ, Okulizyon girişi AÇILDIKTAN sonra yazılmalı. Giriş başarısızsa bağ
     oluşmamalı; yoksa yanlış ad/numara giren biri o numarayı kilitler ve
     gerçek öğrenci kendi numarasına bağlanamaz. */
  ok("bağ, giriş denemesinden SONRA yazılıyor (giriş başarısı = sahiplik kanıtı)",
    !/if \(!mevcut\) \{\s*const b = await bagYaz/.test(
      CEK.slice(CEK.indexOf("const mevcut = await bagOku"), CEK.indexOf("const k = new Kavanoz()"))) &&
    CEK.indexOf("const k = new Kavanoz(), r: any = await giris(kim, k)") <
      CEK.indexOf("const b = await bagYaz(userId"));
  ok("giriş başarısızsa erken dönüş var (bağ yazılmaz)",
    /if \(r\.durum !== "oturum"\)[\s\S]{0,600}return \{ durum: r\.durum/.test(CEK));
  ok("bağ yazımı giriş bloğunun İÇİNDE (return'den sonra, kapanıştan önce)",
    /if \(r\.durum !== "oturum"\)[\s\S]{0,900}if \(!mevcut\) \{\s*const b = await bagYaz/.test(CEK));
}

// ------------------------------------------------------------
console.log("\n" + "─".repeat(60));
if (kalan) {
  console.log("\n✗ " + kalan + " kontrol kaldı (" + gecen + " geçti)");
  hatalar.forEach(h => console.log("  · " + h));
  process.exit(1);
}
console.log("güvenlik testleri — " + gecen + "/" + gecen + " geçti ✓");
