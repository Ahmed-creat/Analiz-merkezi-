/* v61 — ÜÇ KULLANICI GERİ BİLDİRİMİNİN KANITI
   ------------------------------------------------------------
   1) "Tableti açınca tekrar bildirimi gelmedi, sadece uygulamaya
      girince test bildirimi geliyor."
      → Açılışta TEST değil, o günün GERÇEK hatırlatması telafi edilir
        (günde/vardiyada bir kez, push zaten gösterdiyse mükerrer değil).
   2) "Kitabın sayfa sayısından fazla sayfa girilebiliyor."
      → Kalan sayfadan fazlası reddedilir; geçmiş + okunan sayfa tutarlı.
   3) "Önemli tuşlar vb mavi olmamalı." (depodaki renk dokümanları:
      mavi bir TÜR rengi — kısa kontrol — eylem rengi değil)
      v62 DÜZELTMESİ — KULLANICI: "tuşları niye siyah yaptın? ... durumuna
      göre ya yeşil ya kırmızı olacak." Mürekkep de yanlıştı.
      → Eylem yüzeyi DURUM RENGİ: olumlu eylem YEŞİL, yıkıcı eylem KIRMIZI.
        Mavi ve siyah eylem rengi olarak KULLANILMAZ.
   4) Aynı cihaz için mükerrer abonelik üretilmez (6 aktif uç vakası).
*/
"use strict";
const fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const PUSH = fs.readFileSync(path.join(KOK, "site", "push-bildirim.js"), "utf8");
const TANI = fs.readFileSync(path.join(KOK, "supabase", "functions", "push-tani", "index.ts"), "utf8");
const SQL = fs.readFileSync(path.join(KOK, "supabase", "migrations", "0003_webpush_telafi.sql"), "utf8");

let gecen = 0; const hata = [];
const ok = (ad, kosul, ek) => {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { hata.push(ad); console.log("  ✗ " + ad + (ek ? "  → " + ek : "")); }
};

console.log("\n== 1) Açılışta GERÇEK hatırlatma telafisi ==");
ok("telafi fonksiyonu var", /function hatirlatmaTelafisi\(\)/.test(HTML));
ok("yalnız tekrarı gelmiş konu varsa çalışır", /const due = \(typeof dueReviews === "function"\) \? dueReviews\(\) : \[\]/.test(HTML));
ok("gün + vardiya başına tek kez", /am_telafi_/.test(HTML) && /localStorage\.getItem\(anahtar\)/.test(HTML));
ok("push zaten gösterdiyse mükerrer göstermez", /iz\.baslik === baslik/.test(HTML));
ok("başlık cron ile aynı (sabah/akşam)", /Günaydın! Tekrar Zamanı/.test(HTML) && /Akşam tekrarı seni bekliyor/.test(HTML));
ok("içerik gerçek konu listesi (test değil)", /konunun tekrarı bugün: /.test(HTML));
ok("açılışta bağlandı", /hatirlatmaTelafisi\(\);/.test(HTML));

console.log("\n== 2) Kitap: kalan sayfadan fazlası girilemez ==");
ok("kalan hesaplanıyor", /const kalan = Math\.max\(0, Number\(b\.pages\) - Number\(b\.read \|\| 0\)\)/.test(HTML));
ok("kalan 0 ise reddedilir", /if \(kalan === 0\) return toast/.test(HTML));
ok("fazlası reddedilir", /if \(pages > kalan\) return toast/.test(HTML));
ok("okunan sayfa kırpılmıyor, toplanıyor", /b\.read = Number\(b\.read \|\| 0\) \+ pages;/.test(HTML));
ok("geçmişe girilen değer = kabul edilen değer", /b\.history\.push\(\{ date: todayStr\(\), pages: pages, minutes: minutes \}\)/.test(HTML));
ok("giriş alanında max var", /max="' \+ \(b\.pages - b\.read\) \+ '"/.test(HTML));
ok("kitap eklerken tam sayı sınırı", /Number\.isInteger\(pages\)/.test(HTML) && /pages > 10000/.test(HTML));

console.log("\n== 3) Eylem tuşları TEMA renginde (v72) ==");
/* v72 — KULLANICI: "Tuşların rengi uygulamanın temasına uygun değil."
   Önceki kural (yeşil) kullanıcı tarafından geri alındı: uygulamanın
   markası Royal Blue; eylem tuşu tema gradyanını kullanır.
   Yeşil/kırmızı yalnız ANLAM taşıyan yerlerde (btn-success / btn-danger). */
const actionBg = [...HTML.matchAll(/--action-bg:\s*([^;]+);/g)].map(m => m[1].trim());
ok("eylem yüzeyi tanımlı", actionBg.length >= 2, actionBg.length + " tanım");
ok("eylem yüzeyi tema gradyanı (var(--brand-gradient))",
  actionBg.every(b => /var\(--brand-gradient\)/.test(b)), actionBg.join(" | "));

const HEX = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const siyahMi = (hex) => { const [r, g, b] = HEX(hex); return r < 70 && g < 70 && b < 80; };

// Marka gradyanı siyah olmamalı (eski v63 tuşu siyahtı).
const brand = (HTML.match(/--brand-gradient:\s*([^;]+);/) || [])[1] || "";
const brandRenkler = [...brand.matchAll(/#[0-9A-Fa-f]{6}/g)].map(m => m[0]);
ok("marka gradyanı tanımlı", brandRenkler.length >= 2, brand);
ok("marka rengi siyah değil", brandRenkler.every(r => !siyahMi(r)), brandRenkler.join(","));
ok("btn-primary eylem rengini kullanıyor", /\.btn-primary \{ background: var\(--action-bg\)/.test(HTML));

/* Yıkıcı eylemler KIRMIZI olmalı (durumuna göre yeşil ya da kırmızı). */
const yikici = [...HTML.matchAll(/<button class="([^"]*)" data-act="confirmReset"/g)].map(m => m[1]);
ok("yıkıcı düğmeler var", yikici.length >= 4, yikici.length + " düğme");
ok("yıkıcı düğmeler KIRMIZI (btn-danger)", yikici.every(c => c.includes("btn-danger")), yikici.join(" | "));
ok("kırmızı düğme semantik hatayı kullanıyor", /\.btn-danger \{ background: var\(--semantic-error\)/.test(HTML));
ok("yeşil düğme semantik başarıyı kullanıyor", /\.btn-success \{ background: var\(--semantic-success\)/.test(HTML));

console.log("\n== 4) Mükerrer abonelik üretilmez + ölü uç temizlenir ==");
ok("kurulan VAPID anahtarı cihazda saklanıyor", PUSH.indexOf('"am_vapid_kurulan"') > 0);
ok("anahtar okunamazsa abonelik KORUNUR", /anahtarAyni = kayitli === kullanilacak;/.test(PUSH));
ok("kurulumdan sonra damgalanıyor", /localStorage\.setItem\(VAPID_KURULAN_ANAHTAR, kullanilacak\)/.test(PUSH));
ok("push-tani 404/410'da aboneliği kapatıyor", /r\.status === 404 \|\| r\.status === 410/.test(TANI) && /aktif: false/.test(TANI));
ok("TTL 150 dk (2,5 saat) — uyanınca mesaj yaşar", /'ttl', '9000'/.test(SQL));

console.log("\n────────────────────────────────────────────────────────");
if (!hata.length) console.log("v61 testi — " + gecen + "/" + gecen + " geçti ✓");
else { console.log("v61 testi — " + gecen + " geçti, " + hata.length + " kaldı"); hata.forEach(h => console.log("   · " + h)); }
process.exit(hata.length ? 1 : 0);
