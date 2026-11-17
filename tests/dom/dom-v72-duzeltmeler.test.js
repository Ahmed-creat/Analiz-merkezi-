/* ============================================================
   v72 — KULLANICI DÜZELTMELERİ (17 Kasım 2026)
   ------------------------------------------------------------
   Kullanıcının dört isteği tek tek kanıtlanır:
     1) "Kendin hangi derslerden soru ürettin onları sil."
        → elle yazılmış 20 havuz yok, kalan 152 havuz kullanıcı zip'i
     2) "İlişkili konu kartını kaldır."
        → konu detayında kart çizilmiyor, veri duruyor
     3) "Tuşların rengi uygulamanın temasına uygun değil."
        → eylem tuşu tema gradyanı (Royal Blue), siyah/yeşil değil
     4) Service worker: silinen dosyalar önbellek listesinde kalırsa
        install addAll ile komple düşer ve kullanıcı ESKİ sürümde kalır.
        → liste yalnız var olan dosyaları içerir, install tek tek ekler

   Çalıştır: node tests/dom/dom-v72-duzeltmeler.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..");
const HTML = fs.readFileSync(path.join(KOK, "site/index.html"), "utf8");
const SW = fs.readFileSync(path.join(KOK, "site/sw.js"), "utf8");
const APP = fs.readFileSync(path.join(KOK, "site/app-pwa.js"), "utf8");
const MANIFEST = require(path.join(KOK, "site/content/soru_havuzlari/index.json"));

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false;
}
function esit(ad, gelen, beklenen) {
  return ok(ad, gelen === beklenen, "gelen: " + JSON.stringify(gelen) + " · beklenen: " + JSON.stringify(beklenen));
}

/* ------------------------------------------------------------ */
console.log("\n== 1) Ajanın elle yazdığı sorular silindi ==");
const HAVUZLAR = MANIFEST.havuzlar || [];
esit("havuz sayısı 152", HAVUZLAR.length, 152);

const ELLE = ["biyo_10_u01_k08", "biyo_10_u02_k05", "biyo_10_u02_k06", "cogr_10_u04_k02",
  "cogr_10_u05_k02", "cogr_10_u05_k03", "cogr_10_u06_k02", "cogr_10_u06_k03",
  "cogr_10_u06_k04", "cogr_10_u07_k01", "din_10_u02_k03", "din_10_u02_k04",
  "din_10_u03_k04", "edebiyat_10_u03_k06", "edebiyat_10_u04_k06", "kimya_10_u02_k06",
  "kimya_10_u02_k07", "kimya_10_u02_k08", "tarih_10_u01_k04", "tarih_10_u02_k05"];
const kalanElle = ELLE.filter((id) => fs.existsSync(path.join(KOK, "site/content/soru_havuzlari", id + ".json")));
esit("elle yazılmış havuz dosyası kalmadı", kalanElle.length, 0);
ok("hiçbiri manifestte de yok", HAVUZLAR.every((h) => ELLE.indexOf(h.konu_id) < 0),
  HAVUZLAR.filter((h) => ELLE.indexOf(h.konu_id) >= 0).map((h) => h.konu_id).join(","));

/* Kullanıcının kendi zip'inden gelenler korundu: havuz dosyalarının
   kaynak_dosya alanı "10. Sınıf <ders> json.zip" olmalı. */
const HAVUZ_DIZIN = path.join(KOK, "site/content/soru_havuzlari");
const kaynaklar = fs.readdirSync(HAVUZ_DIZIN)
  .filter((a) => a.endsWith(".json") && a !== "index.json")
  .map((a) => JSON.parse(fs.readFileSync(path.join(HAVUZ_DIZIN, a), "utf8")).kaynak_dosya || "");
const zipKaynakli = kaynaklar.filter((k) => /\.zip$/.test(k)).length;
esit("her havuz kullanıcı zip'inden", zipKaynakli, kaynaklar.length);
ok("hiçbir havuzda 'elle yazıldı' damgası yok",
  !kaynaklar.some((k) => /elle yaz/i.test(k)), kaynaklar.filter((k) => /elle yaz/i.test(k)).join(","));

/* ------------------------------------------------------------ */
console.log("\n== 2) İlişkili konular kartı kaldırıldı ==");
ok("kart çizimi yok", HTML.indexOf("OKZTDE.iliski(p.topic)") < 0);
ok("kaldırma notu var", /İlişkili konular" kartı KALDIRILDI/.test(HTML));
ok("ilişki verisi silinmedi (modül yükleniyor)",
  HTML.indexOf('<script src="okz-tde.js"></script>') > 0 &&
  HTML.indexOf('<script src="okz-tde-veri.js"></script>') > 0);
const TDED = require(path.join(KOK, "site/content/mufredat/tde_kazanim_10.json"));
esit("ilişki kaydı 108", TDED.konular.reduce((a, k) => a + (k.iliskili_konular || []).length, 0), 108);

/* ------------------------------------------------------------ */
console.log("\n== 3) Eylem tuşları tema renginde ==");
const actionBg = [...HTML.matchAll(/--action-bg:\s*([^;]+);/g)].map((m) => m[1].trim());
ok("eylem yüzeyi en az 2 temada tanımlı", actionBg.length >= 2, String(actionBg.length));
ok("hepsi tema gradyanı", actionBg.every((b) => /var\(--brand-gradient\)/.test(b)), actionBg.join(" | "));
const brand = (HTML.match(/--brand-gradient:\s*([^;]+);/) || [])[1] || "";
ok("tema markası Royal Blue", /#2563EB/i.test(brand) && /#3B82F6/i.test(brand), brand);
const HEX = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const siyah = (h) => { const [r, g, b] = HEX(h); return r < 70 && g < 70 && b < 80; };
ok("siyah tuş kalmadı", ![...brand.matchAll(/#[0-9A-Fa-f]{6}/g)].some((m) => siyah(m[0])));
ok("eski yeşil eylem rengi kalmadı", !/--action-bg:\s*linear-gradient\([^)]*#(047857|0CCA93)/i.test(HTML));
ok("anlam taşıyan yeşil/kırmızı korundu",
  /\.btn-success \{ background: var\(--semantic-success\)/.test(HTML) &&
  /\.btn-danger \{ background: var\(--semantic-error\)/.test(HTML));

/* ------------------------------------------------------------ */
console.log("\n== 4) Service worker: eksik dosya kurulumu düşürmez ==");
const bas = SW.indexOf("const ASSETS = [");
const son = SW.indexOf("];", bas);
const liste = [...SW.slice(bas, son).matchAll(/"(\.\/[^"]+)"/g)].map((m) => m[1]);
ok("önbellek listesi dolu", liste.length > 100, String(liste.length));
const eksik = liste.filter((u) => !fs.existsSync(path.join(KOK, "site", u.slice(2).split("?")[0])));
esit("listede diskte olmayan dosya yok", eksik.length, 0, eksik.slice(0, 5).join(", "));
ok("install addAll kullanmıyor (tek 404 kurulumu düşürüyordu)",
  !/caches\.open\(CACHE\)\.then\(\(c\) => c\.addAll/.test(SW));
ok("install dosyaları tek tek ekliyor", /ASSETS\.map\(\(u\) =>\s*c\.add\(u\)\.catch/.test(SW));

/* ------------------------------------------------------------ */
console.log("\n== 5) Sürüm damgası ==");
const surum = (APP.match(/const PWA_SURUM = "([^"]+)"/) || [])[1] || "";
const cache = (SW.match(/const CACHE = "([^"]+)"/) || [])[1] || "";
/* v73 sürümü damgayı ilerletti; testin amacı damganın BOŞ ve eski
   kalmamasıdır — sabit sürüm adı değil. */
ok("sürüm damgası v72 veya sonrası", /^v7[2-9]-|^v[89]\d/.test(surum), surum);
ok("SW damgası sürümle aynı", cache.indexOf(surum) > 0, cache);

console.log("\n" + "─".repeat(56));
if (kalan === 0) {
  console.log(`v72 düzeltmeleri — ${gecen}/${gecen} geçti ✓`);
  process.exit(0);
}
console.log(`v72 düzeltmeleri — ${gecen} geçti, ${kalan} kaldı`);
hatalar.forEach((h) => console.log(" ✗ " + h));
process.exit(1);
