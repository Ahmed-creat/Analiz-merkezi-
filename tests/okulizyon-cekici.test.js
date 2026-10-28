// Okulizyon çekicisinin (Supabase Edge Function) AYRIŞTIRICI testleri.
// Kaynak olarak doğrudan yayınlanan dosya okunur: supabase/functions/okulizyon-cek/index.ts
// Böylece test, canlıdaki kodun kendisini doğrular (kopya değil).
const fs = require("node:fs");
const path = require("node:path");
const { stripTypeScriptTypes } = require("node:module");

const KOK = path.resolve(__dirname, "..");
const DOSYA = path.join(KOK, "supabase/functions/okulizyon-cek/index.ts");

function yardimcilariYukle() {
  const kaynak = fs.readFileSync(DOSYA, "utf8");
  const bas = kaynak.indexOf("const TABAN");
  const son = kaynak.indexOf("async function giris");
  if (bas < 0 || son < 0) throw new Error("index.ts beklenen bölümleri bulunamadı");
  let dilim = kaynak.slice(bas, son);
  // Deno'ya özgü satırları çıkar (saf yardımcılar Deno'ya ihtiyaç duymaz)
  dilim = dilim.split("\n").filter((s) => !/Deno\.env\.get/.test(s)).join("\n");
  const js = stripTypeScriptTypes(dilim, { mode: "strip" });
  return new Function(js + "\nreturn { norm, esle, secenekler, tablolar, ayikla, baglantilar, metin, kucuk, sayi };")();
}

const H = yardimcilariYukle();
let gecen = 0, kalan = [];
const ok = (ad, kosul, ek) => { if (kosul) gecen++; else kalan.push(ad + (ek ? " → " + ek : "")); };

// ---- 1) Türkçe-duyarlı eşleştirme (canlı veriyle doğrulandı) ----
const ilceler = { ARABAN: "1139", "GAZIANTEP MERKEZ": "1335", "ŞAHİNBEY": "1841", İSLAHİYE: "1415" };
ok("ilçe: Şahinbey → 1841", H.esle(ilceler, "Şahinbey") === "1841", H.esle(ilceler, "Şahinbey"));
ok("ilçe: şahinbey (küçük harf)", H.esle(ilceler, "şahinbey") === "1841");
ok("ilçe: SAHINBEY (noktasız)", H.esle(ilceler, "SAHINBEY") === "1841");
ok("ilçe: olmayan ilçe → null", H.esle(ilceler, "Bilinmeyen") === null, H.esle(ilceler, "Bilinmeyen"));

const kurumlar = { "AKBUDAK İLKOKULU": "245915", "AKKENT ANADOLU LİSESİ": "751187", "AKKENT FEN BİLİMLERİ": "103448" };
ok("okul: AKKENT ANADOLU LİSESİ → 751187", H.esle(kurumlar, "AKKENT ANADOLU LİSESİ") === "751187", H.esle(kurumlar, "AKKENT ANADOLU LİSESİ"));
ok("okul: eski yazım 'Akken Anadolu Lisesi' → 751187", H.esle(kurumlar, "Akken Anadolu Lisesi") === "751187", H.esle(kurumlar, "Akken Anadolu Lisesi"));
ok("okul: AKKEN İLKOKULU yanlış eşleşmesin", H.esle(kurumlar, "AKKENT ORTAOKULU") === null, H.esle(kurumlar, "AKKENT ORTAOKULU"));

// ---- 2) <select> seçenek okuma (giriş sayfasındaki ilkodu listesi) ----
const secHtml = `<select name="ilkodu" id="ilkodu"><option value="">İl seçiniz</option>
<option value="27">GAZİANTEP</option><option value="34">İSTANBUL</option></select>`;
const secenek = H.secenekler(secHtml, "ilkodu");
ok("select: 2 il okundu", Object.keys(secenek).length === 2, JSON.stringify(Object.keys(secenek)));
ok("select: GAZİANTEP → 27", secenek["GAZİANTEP"] === "27");
ok("select: Gaziantep (başka harf) → 27", H.esle(secenek, "Gaziantep") === "27");

// ---- 3) Sonuç tablosu ayrıştırma (ders özeti + yanlış/boş sorular) ----
const sonucHtml = `
<div><table>
  <tr><th>Sınav</th><td>1. DENEME SINAVI</td></tr>
  <tr><th>Tarih</th><td>12.10.2026</td></tr>
</table></div>
<table>
  <thead><tr><th>Ders</th><th>Soru Sayısı</th><th>Doğru</th><th>Yanlış</th><th>Boş</th><th>Net</th></tr></thead>
  <tbody>
    <tr><td>MATEMATİK</td><td>20</td><td>12</td><td>3</td><td>5</td><td>11,25</td></tr>
    <tr><td>TÜRKÇE</td><td>20</td><td>15</td><td>2</td><td>3</td><td>14,50</td></tr>
    <tr><td>TOPLAM</td><td>40</td><td>27</td><td>5</td><td>8</td><td>25,75</td></tr>
  </tbody>
</table>
<table>
  <thead><tr><th>Soru</th><th>Ders</th><th>Konu / Kazanım</th><th>Durum</th></tr></thead>
  <tbody>
    <tr><td>7</td><td>MATEMATİK</td><td>Üslü Sayılar</td><td>Yanlış</td></tr>
    <tr><td>11</td><td>MATEMATİK</td><td>Köklü Sayılar</td><td>Boş</td></tr>
    <tr><td>3</td><td>TÜRKÇE</td><td>Paragraf</td><td>Doğru</td></tr>
  </tbody>
</table>`;
const sinav = H.ayikla(sonucHtml, "1. DENEME SINAVI", "2026-10-12");
ok("ayikla: 2 ders okundu", Object.keys(sinav.lessons).length === 2, JSON.stringify(Object.keys(sinav.lessons)));
ok("ayikla: MATEMATİK d/w/e", JSON.stringify(sinav.lessons["MATEMATİK"]) === JSON.stringify({ d: 12, w: 3, e: 5 }), JSON.stringify(sinav.lessons["MATEMATİK"]));
ok("ayikla: TOPLAM satırı derslere yazılmadı", !sinav.lessons["TOPLAM"]);
ok("ayikla: 2 hatalı soru (yanlış+boş)", sinav.rows.length === 2, JSON.stringify(sinav.rows));
ok("ayikla: yanlış → status w", sinav.rows[0].status === "w" && sinav.rows[0].topic === "Üslü Sayılar", JSON.stringify(sinav.rows[0]));
ok("ayikla: boş → status e", sinav.rows[1].status === "e" && sinav.rows[1].topic === "Köklü Sayılar", JSON.stringify(sinav.rows[1]));
ok("ayikla: doğru soru kuyruğa girmez", !sinav.rows.some((r) => r.topic === "Paragraf"));
ok("ayikla: ad + tarih korunur", sinav.name === "1. DENEME SINAVI" && sinav.date === "2026-10-12");

// ---- 4) Sonuç sayfasındaki sınav bağlantıları ----
const linkHtml = `
<a href="/app2/ogrenci/?pg=sinavsonuc&id=5">1. DENEME SINAVI</a> <span>12.10.2026</span>
<a href="/app2/ogrenci/?pg=sinavsonuc&id=6">TYT DENEME 2</a> <span>25.10.2026</span>
<a href="/app2/ogrenci/?pg=profil">Profilim</a>
<a href="javascript:void(0)">Deneme (boş link)</a>`;
const bag = H.baglantilar(linkHtml);
ok("baglantilar: 2 sınav linki", bag.length === 2, JSON.stringify(bag.map((b) => b.ad)));
ok("baglantilar: mutlak adres", bag.every((b) => b.href.startsWith("https://okulizyon.com/")), bag[0] && bag[0].href);
ok("baglantilar: tarih DD.MM.YYYY → YYYY-MM-DD", bag[0].tarih === "2026-10-12", bag[0].tarih);
ok("baglantilar: 'Profilim' ve javascript: atlanır", !bag.some((b) => /profil/i.test(b.ad)));

// ---- 5) Metin temizleme / sayı okuma ----
ok("metin: etiketler temizlenir", H.metin("<b>Doğru</b>&nbsp;12") === "Doğru 12", H.metin("<b>Doğru</b>&nbsp;12"));
ok("sayi: '1.234' → 1234", H.sayi("1.234") === 1234, H.sayi("1.234"));
ok("sayi: boş → 0", H.sayi("") === 0);

console.log(`\nOkulizyon çekici ayrıştırıcı testleri — ${gecen}/${gecen + kalan.length} geçti`);
if (kalan.length) {
  console.error("\nBAŞARISIZ:");
  kalan.forEach((k) => console.error(" ✗ " + k));
  process.exit(1);
}
console.log("✓ tümü geçti");
