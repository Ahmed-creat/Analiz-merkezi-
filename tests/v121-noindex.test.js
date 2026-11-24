// ============================================================
// v121 — ARAMA MOTORLARINA KAPALI (noindex) TESTLERİ
// tests/v121-noindex.test.js
// ------------------------------------------------------------
// KULLANICI: "site Google arama sonuçlarında olmasın,
//             sadece adresi girince [açılsın]"
//
// Üç katman birlikte ölçülür — biri eksikse sonuç alınmaz:
//   1) HTML <meta name="robots" content="noindex"> — index + gizlilik
//   2) HTTP başlığı X-Robots-Tag — HTML'i olmayan dosyalar için
//   3) robots.txt — taramaya İZİN verir (noindex'in okunabilmesi için)
//
// ÖNEMLİ TUZAK: robots.txt "Disallow: /" yazsaydık Google sayfayı
// tarayamaz, noindex'i göremez, sonuçlardan çıkaramazdı. Bu test o
// hatanın geri gelmesini engeller.
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

console.log("\n== 1) HTML: noindex etiketi ==");
{
  const INDEX = oku("site/index.html");
  const GIZLILIK = oku("site/gizlilik.html");

  const robotsMeta = (html) => {
    const m = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
    return m ? m[1].toLowerCase() : "";
  };

  const i = robotsMeta(INDEX);
  ok("index.html robots meta VAR", !!i, "bulunamadı");
  ok("index.html NOINDEX", /\bnoindex\b/.test(i), i);
  ok("index.html NOFOLLOW", /\bnofollow\b/.test(i), i);
  ok("index.html NOARCHIVE (önbellek kopyası çıkmasın)", /\bnoarchive\b/.test(i), i);

  const g = robotsMeta(GIZLILIK);
  ok("gizlilik.html robots meta VAR", !!g, "bulunamadı");
  ok("gizlilik.html artık NOINDEX (eskiden index,follow idi)", /\bnoindex\b/.test(g) && !/\bindex,/.test(g), g);

  ok("hiçbir HTML'de 'index,follow' KALMADI",
    !/content=["']index,\s*follow["']/i.test(INDEX) && !/content=["']index,\s*follow["']/i.test(GIZLILIK));

  ok("googlebot için ayrı etiket (Google özel davranmaz)",
    /name=["']googlebot["']\s+content=["'][^"']*noindex/i.test(INDEX));
}

console.log("\n== 2) HTTP başlığı: X-Robots-Tag ==");
{
  const v = JSON.parse(oku("deploy/vercel.json"));
  const catchAll = (v.headers || []).find((h) => h.source === "/(.*)");
  ok("vercel.json catch-all kaydı var", !!catchAll);
  const basliklar = (catchAll && catchAll.headers) || [];
  const xr = basliklar.find((h) => h.key === "X-Robots-Tag");
  ok("X-Robots-Tag başlığı EKLENDİ", !!xr, JSON.stringify(basliklar.map((h) => h.key)));
  ok("başlık değeri noindex içeriyor", !!xr && /\bnoindex\b/.test(xr.value), xr && xr.value);
  ok("mevcut güvenlik başlıkları KORUNDU (silinmedi)",
    basliklar.some((h) => h.key === "X-Content-Type-Options") &&
    basliklar.some((h) => h.key === "Referrer-Policy"));
}

console.log("\n== 3) robots.txt: doğru yönlendirme ==");
{
  const R = oku("site/robots.txt");
  ok("site/robots.txt VAR (build onu out/ köküne kopyalar)", !!R);

  /* Kritik tuzak: genel Disallow her şeyi engeller → noindex okunamaz. */
  const genelBlok = R.split(/^User-agent:\s*\*\s*$/m)[1] || "";
  const genelSatirlar = genelBlok.split(/^User-agent:/m)[0];
  ok("User-agent: * altında 'Disallow: /' YOK (noindex okunabilsin)",
    !/^\s*Disallow:\s*\/\s*$/m.test(genelSatirlar), genelSatirlar.trim().slice(0, 80));
  ok("User-agent: * altında taramaya izin var",
    /^\s*Allow:\s*\/\s*$/m.test(genelSatirlar), genelSatirlar.trim().slice(0, 80));

  ok("yapay zekâ botları engelli (GPTBot)", /User-agent:\s*GPTBot[\s\S]{0,40}Disallow:\s*\//.test(R));
  ok("yapay zekâ botları engelli (ClaudeBot)", /User-agent:\s*ClaudeBot[\s\S]{0,40}Disallow:\s*\//.test(R));
}

console.log("\n== 4) Uygulama arama motoruna bağlı kalmıyor ==");
{
  /* noindex sadece ARAMA SONUÇLARINI etkiler; adresi giren girer.
     Bu yüzden giriş/uygulama mantığında hiçbir engel olmamalı. */
  const APP = oku("site/app-pwa.js");
  /* DİKKAT: PWA_SURUM "v121-noindex" adında 'noindex' geçiyor; sürüm
     satırını çıkarıp geri kalan koda bakıyoruz. */
  const kod = APP.split("\n").filter((l) => !/^const PWA_SURUM/.test(l)).join("\n");
  ok("uygulamada noindex/referrer kapısı YOK (adres giren girer)",
    !/noindex/i.test(kod) && !/document\.referrer[\s\S]{0,60}redirect/i.test(kod));
  ok("build betiği robots.txt'i dışlamıyor (site/ kopyalanıyor)",
    /cp -a\s+"?\$KAYNAK\/site\/\."?\s+out\//.test(oku("deploy/build.sh")));
}

console.log("\n== 5) Sürüm + önbellek ==");
{
  const APP = oku("site/app-pwa.js"), SW = oku("site/sw.js");
  const surum = (APP.match(/const PWA_SURUM = "([^"]+)"/) || [])[1] || "";
  const cache = (SW.match(/const CACHE = "([^"]+)"/) || [])[1] || "";
  /* Sürüm numarası İLERLER (v123, v124...). Kilitlenen şey noindex'in
     v121'den itibaren KALICI olması; sürüm adını sabitlemiyoruz. */
  ok("PWA_SURUM v121 veya sonrası", /^v1(2[1-9]|[3-9][0-9])/.test(surum), surum);
  ok("CACHE aynı sürümle bitiyor", cache.endsWith(surum), cache);
}

console.log("\n" + "─".repeat(60));
if (kalan) {
  console.log("\n✗ " + kalan + " kontrol kaldı (" + gecen + " geçti)");
  hatalar.forEach((h) => console.log("  · " + h));
  process.exit(1);
}
console.log("v121 noindex testleri — " + gecen + "/" + gecen + " geçti ✓");
