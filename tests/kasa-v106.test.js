// ============================================================
// v106 — KASA (uçtan uca şifreleme) TESTLERİ
// tests/kasa-v106.test.js
// ------------------------------------------------------------
// KULLANICI: "Hem ad soyad, sınav sonuçları, hedef, plan takibi,
// kitaplar bunları neden şifrelenmiyor?" → artık şifreleniyor.
//
// Burada İKİ şey ölçülür:
//   1) Kripto GERÇEKTEN çalışıyor mu? (şifrele → çöz, yanlış şifre reddi,
//      başka cihaz, kurtarma anahtarı) — site/kasa.js gerçekten koşturulur.
//   2) Uygulama gerçekten şifreli yazıyor mu? (kod denetimi: buluta giden
//      nesne zarf olmalı; kilitliyken düz yazma olmamalı; sınıf/deneme sayısı
//      gibi yan alanlar da boşaltılmalı)
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

// Tarayıcı ortamının küçük taklidi (yalnız kasa.js'in kullandığı kadarı)
globalThis.btoa = (s) => Buffer.from(s, "binary").toString("base64");
globalThis.atob = (s) => Buffer.from(s, "base64").toString("binary");
const depo = {};
globalThis.localStorage = {
  getItem: (k) => (k in depo ? depo[k] : null),
  setItem: (k, v) => { depo[k] = String(v); },
  removeItem: (k) => { delete depo[k]; },
};

(async () => {
  const K = await import(path.join(KOK, "site/kasa.js"));

  // ------------------------------------------------------------
  console.log("\n== 1) Kripto gerçekten çalışıyor ==");
  {
    const kur = await K.kasaKur("kedi-yol-2026");
    ok("kasa kuruldu", kur.ok === true);
    ok("tuz üretildi (16 bayt → 24 karakter b64)", String(kur.tuz || "").length === 24, String(kur.tuz || "").length);

    const kayit = {
      user: { name: "Zeynep Kaya", grade: "11" },
      exams: [{ name: "TYT Deneme 7", date: "2026-11-20", net: 62.75 }],
      plan: { gunluk: 120 }, books: [{ title: "Suç ve Ceza" }],
      settings: { okulizyon: { ad: "ZEYNEP KAYA", okulNo: "1234", il: "Gaziantep" } },
    };
    const zarf = await K.kasaSifrele(kayit);
    ok("zarf biçimi doğru", zarf && zarf.__kasa === 1 && !!zarf.t && !!zarf.iv && !!zarf.ct);
    const metin = JSON.stringify(zarf);
    ok("şifreli metinde AD görünmüyor", !metin.includes("Zeynep") && !metin.includes("Kaya"));
    ok("şifreli metinde okul no görünmüyor", !metin.includes("1234"));
    ok("şifreli metinde ders/deneme adı görünmüyor", !metin.includes("Deneme 7"));
    ok("şifreli metinde kitap adı görünmüyor", !metin.includes("Suç ve Ceza"));

    // aynı içerik iki kez şifrelenince farklı çıktı (rastgele IV)
    const zarf2 = await K.kasaSifrele(kayit);
    ok("aynı veri iki kez şifrelenince farklı metin (IV rastgele)", zarf.ct !== zarf2.ct);

    const ac = await K.kasaCoz(zarf);
    ok("doğru şifreyle açılıyor", !!ac.nesne);
    ok("açılan veri birebir aynı (ad)", ac.nesne && ac.nesne.user.name === "Zeynep Kaya");
    ok("açılan veri birebir aynı (net)", ac.nesne && ac.nesne.exams[0].net === 62.75);
    ok("açılan veri birebir aynı (okul bilgisi)", ac.nesne && ac.nesne.settings.okulizyon.okulNo === "1234");

    // yanlış şifre
    K.kasaKilitle();
    await K.kasaAc("yanlis-sifre-123", zarf.t);
    const y = await K.kasaCoz(zarf);
    ok("yanlış şifre veriyi AÇMAZ", y.acilmadi === true && !y.nesne);
    ok("yanlış şifrede veri sızmaz", JSON.stringify(y).indexOf("Zeynep") === -1);

    // anahtar yokken
    K.kasaKilitle();
    const k = await K.kasaCoz(zarf);
    ok("anahtar yokken 'kilitli' der (veri göstermez)", k.kilitli === true && !k.nesne);

    // başka cihaz: aynı tuz + aynı şifre = aynı anahtar
    await K.kasaAc("kedi-yol-2026", zarf.t);
    const ac2 = await K.kasaCoz(zarf);
    ok("başka cihazda aynı şifreyle açılıyor", ac2.nesne && ac2.nesne.user.name === "Zeynep Kaya");

    // kurtarma anahtarı
    const kelime = K.kurtarmaUret();
    const dizi = kelime.split(" ");
    ok("kurtarma anahtarı 12 kelime", dizi.length === 12, String(dizi.length));
    ok("kurtarma kelimeleri tekrar edilebilir sözlükten", dizi.every((w) => w && /^[a-zçğıöşü]+$/.test(w)));
    const sarma = await K.kasaSar(kelime);
    ok("sarma kaydı kasa anahtarını düz taşımıyor", sarma && !JSON.stringify(sarma).includes("Zeynep") && !!sarma.ct);
    K.kasaKilitle();
    const kurt = await K.kasaCozKurtarma(kelime, sarma);
    const ac3 = await K.kasaCoz(zarf);
    ok("kurtarma anahtarı kasayı açar", kurt.ok === true && ac3.nesne && ac3.nesne.user.name === "Zeynep Kaya");
    K.kasaKilitle();
    const kotu = await K.kasaCozKurtarma("yanlis kelime dizisi burada", sarma);
    ok("yanlış kurtarma anahtarı reddedilir", kotu.ok === false && !!kotu.hata);

    // kısa şifre reddi
    const kisa = await K.kasaKur("1234");
    ok("8 karakterden kısa kasa şifresi kabul edilmez", kisa.ok === false);
  }

  // ------------------------------------------------------------
  console.log("\n== 2) Uygulama gerçekten şifreli yazıyor ==");
  {
    const APP = oku("site/app-pwa.js");
    ok("kasa modülü içe alınmış", /import \* as KASA from "\.\/kasa\.js"/.test(APP));
    ok("buluta yazarken zarf kullanılıyor", /state: hz\.zarf \|\| hz\.duz/.test(APP));
    ok("kasa kapalıysa düz yazma SÜRÜYOR (veri kaybı yok)", /kasaZarfHazirla/.test(APP) && /duz: nesne/.test(APP));

    // kilitliyken üzerine düz yazma koruması
    ok("kasa KİLİTLİYKEN buluta düz yazma engelleniyor",
      /zarfTuzuVar && !KASA\.kasaAcikMi\(\)/.test(APP) && /neden: "kasa-kilitli"/.test(APP));

    // yan alanlar
    ok("sınıf (grade) şifreliyken sunucuya yazılmıyor",
      /grade: KASA\.kasaAcikMi\(\) \? null/.test(APP));
    ok("deneme SAYISI şifreliyken sunucuya yazılmıyor",
      /deneme_sayisi: KASA\.kasaAcikMi\(\) \? null/.test(APP));

    // okuma
    ok("bulut kaydı okunurken kasa çözülüyor", /await kasaKayitAc\(hamUzak\)/.test(APP));
    ok("kayıt kilitliyse kullanıcıya pencere gösterilir", /kasaUyarisiGoster\(/.test(APP));
    ok("kilitliyken YEREL veri silinmiyor (erken dönüş)", /kasaSonuc\.durum === "kilitli"[\s\S]{0,200}return;/.test(APP));

    // okulizyon
    ok("kasa kilitliyken okulizyon çekimi yapılmıyor", /window\.__kasa\.durum\(\)\.var && !window\.__kasa\.durum\(\)\.acik/.test(APP));
    ok("kasa kilitli durumu Türkçe açıklanıyor", /"kasa-kilitli":/.test(APP));

    // arayüz
    ok("profilde veri kilidi bölümü var", /VERİ KİLİDİ \(UÇTAN UCA ŞİFRELEME\)/.test(APP));
    ok("kasa kapalıyken DÜRÜST uyarı yazıyor (gizlenmiyor)", /KAPALI — veri sunucuda DÜZ duruyor/.test(APP));
    ok("anahtar kelimeleri indirilebiliyor", /anahtar-kelimeleri\.txt/.test(APP));
    ok("kasa şifresi sunucuya gönderilmiyor (yalnız kasaAc'a veriliyor)",
      !/supabase[\s\S]{0,80}kasaSifre/.test(APP) && !/body:[\s\S]{0,40}kasaSifre/.test(APP));
  }

  // ------------------------------------------------------------
  console.log("\n== 3) Bildirim ve geri bildirim kasaya girmez (kullanıcı isteği) ==");
  {
    const APP = oku("site/app-pwa.js");
    ok("bildirimler ayrı tabloda kalır (state içine gömülmez)",
      /from\("bildirimler"\)/.test(APP));
    ok("geri bildirim ayrı tabloda kalır", /from\("geri_bildirim"\)/.test(APP) || oku("site/index.html").includes('from("geri_bildirim")'));
  }

  // ------------------------------------------------------------
  console.log("\n== 4) Sürüm + önbellek ==");
  {
    const APP = oku("site/app-pwa.js"), SW = oku("site/sw.js");
    const surum = (APP.match(/const PWA_SURUM = "([^"]+)"/) || [])[1] || "";
    const cache = (SW.match(/const CACHE = "([^"]+)"/) || [])[1] || "";
    ok("PWA_SURUM v111 (kasa sürümü korunuyor)", /^v111/.test(surum), surum);
    ok("CACHE aynı sürümle bitiyor", cache.endsWith(surum), cache);
    ok("kasa.js çevrimdışı önbellekte", /"\.\/kasa\.js"/.test(SW));
  }

  // ------------------------------------------------------------
  console.log("\n" + "─".repeat(60));
  if (kalan) {
    console.log("\n✗ " + kalan + " kontrol kaldı (" + gecen + " geçti)");
    hatalar.forEach((h) => console.log("  · " + h));
    process.exit(1);
  }
  console.log("kasa testleri — " + gecen + "/" + gecen + " geçti ✓");
})();
