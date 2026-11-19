/* v70 — 3 AŞAMALI KAZANIM EŞLEŞTİRME + ÖĞRENEN SÖZLÜK
   ------------------------------------------------------------
   KULLANICI: "Okulizyon kazanım havuzu yayınevi serbest metni; 3 aşamalı
   bir mimari kur: (1) konu adı/anahtar kelime, (2) genel beceri fallback
   (Paragraf/Anlam), (3) vektör/LLM + kazanim_konu_cache öğrenen sözlük.
   Tekrar gelen cümle LLM'e sorulmadan DB'den gelsin."

   Bu test ŞUNLARI kanıtlar:
     1) site/okz-tde.js gerçekten üç aşamalı: sözlük / genel beceri / vektör
     2) Aşamalar birbirini EZMEZ (sıra: 1 → 2 → 3) ve uydurma konu yok
     3) Uygulamanın okzKonuBul'u aşamaları doğru sırada çağırır + önbelleğe yazar
     4) kazanim_konu_cache: migration 0005 (tablo, RLS, politika) + uygulama kodu
     5) tde_kazanim_10.json eksiksiz: 30 konu · sayfa · kavram · madde · ilişki
     6) site/okz-tde-veri.js JSON ile senkron (elle düzenlenmiş kopya yok)

   Çalıştır: node tests/dom/dom-v70-uc-asama.test.js
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const KOK = path.join(__dirname, "..", "..");
const oku = (p) => fs.readFileSync(path.join(KOK, p), "utf8");
const R = (p) => JSON.parse(oku(p));

let gecen = 0;
const hata = [];
const ok = (ad, kosul, ek) => {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { hata.push(ad + (ek ? " → " + ek : "")); console.log("  ✗ " + ad + (ek ? " → " + ek : "")); }
};

const TDE = "Türk Dili ve Edebiyatı";
const OKZTDE = require(path.join(KOK, "site/okz-tde.js"));
const VERI = require(path.join(KOK, "site/okz-tde-veri.js"));
const TDED = R("site/content/mufredat/tde_kazanim_10.json");
const KE = R("site/content/konu_esleme.json");
const APP = oku("site/app-pwa.js");
const SW = oku("site/sw.js");
const HTML = oku("site/index.html");
const MIG = oku("supabase/migrations/0005_kazanim_konu_cache.sql");

/* ------------------------------------------------------------ */
console.log("\n== 1) Üç aşama gerçekten ayrı ==");
ok("1. aşama: sözlük 92 terim", Object.keys(VERI.sozluk).length === 92, String(Object.keys(VERI.sozluk).length));
ok("1. aşama: 'kavuştak' → Türkü", (OKZTDE.sozlukEsle("Kavuştakların türküdeki işlevini açıklar.") || {}).konu === "Türkü");
ok("1. aşama: 'matla' → Gazel", (OKZTDE.sozlukEsle("Beytin ilk beytine matla denir.") || {}).konu === "Gazel");
ok("1. aşama: Türkçe ek tanınır (koşuğun → Koşuk)",
  (OKZTDE.sozlukEsle("Koşuğun nazım birimini belirler.") || {}).konu === "Koşuk");
ok("1. aşama: yumuşama (ahengi → Şiirde Ahenk)",
  /Ahenk/.test((OKZTDE.sozlukEsle("Şiirde ahengi sağlayan ögeleri sıralar.") || {}).konu || ""));
ok("2. aşama: çıkarım → Paragraf", (OKZTDE.genelEsle("Metinlerden hareketle çıkarımlar yapar.") || {}).konu === "Paragraf");
ok("2. aşama: ana düşünce → Paragraf", (OKZTDE.genelEsle("Metnin ana düşüncesini belirler.") || {}).konu === "Paragraf");
ok("2. aşama: söz varlığı → Paragraf",
  (OKZTDE.genelEsle("Metindeki söz varlığının anlamını bağlamdan hareketle belirler.") || {}).konu === "Paragraf");
ok("2. aşama: anlatım biçimleri → Paragraf",
  (OKZTDE.genelEsle("Metinde kullanılan anlatım biçimlerini belirler.") || {}).konu === "Paragraf");
const vek = OKZTDE.vektorEsle("Beyitlerden oluşan uzun anlatılarda olay örgüsünü inceler.");
ok("3. aşama: vektör Mesnevi'yi buluyor", vek && vek.konu === "Mesnevi", vek ? vek.konu + " " + vek.skor : "yok");
ok("3. aşama güven etiketi", vek && vek.guven === "vektor");
ok("aşama numaraları 1/2/3", (OKZTDE.sozlukEsle("Kavuştak nedir?").asama === 1) &&
  (OKZTDE.genelEsle("Çıkarım yapar.").asama === 2) && (vek.asama === 3));

console.log("\n== 2) Sıra: 1 → 2 → 3, uydurma yok ==");
const sira = (c) => (OKZTDE.esle(c) || {}).asama;
ok("sözlük genel beceriyi ezer (koşuk + çıkarım)",
  sira("Koşuk dörtlüklerle söylenir; metinden çıkarım yapılır.") === 1);
ok("genel beceri vektörden önce gelir",
  sira("Metnin ana düşüncesini ve konusunu belirler.") === 2);
ok("alakasız cümle eşleşmez (uydurma yok)", OKZTDE.esle("Kuantum dolanıklık deneyini tasarlar.") === null);
ok("başka ders cümlesi eşleşmez", OKZTDE.esle("Fotosentez hızına etki eden faktörleri açıklar.") === null);
ok("'çatışma' Çatı/Fiiller'e gitmiyor", (OKZTDE.esle("Metindeki çatışmayı belirler.") || {}).konu !== "Fiiller (Eylemler)");
ok("'savaş' Sav'a gitmiyor", (OKZTDE.esle("Savaş döneminde yazılan eserleri sınıflandırır.") || {}).konu !== "Sav");
ok("ilişki haritası dolu: 30 konu", OKZTDE.konular().length === 30 && OKZTDE.iliski("Koşuk").length > 0);

console.log("\n== 3) Uygulama: okzKonuBul aşamaları çağırıyor ==");
const i = APP.indexOf("function okzDersKanonik(ders)");
const j = APP.indexOf("// Hata kaydını uygulamanın diline çevir", i);
ok("eşleme bloğu bulundu", i > 0 && j > i);
const BLOK = APP.slice(i, j);
const pSoz = BLOK.indexOf("OKZTDE.sozlukEsle");
const pGen = BLOK.indexOf("OKZTDE.genelEsle");
const pVek = BLOK.indexOf("OKZTDE.vektorEsle");
ok("blokta 1./2./3. aşama çağrısı var", pSoz > 0 && pGen > 0 && pVek > 0);
ok("aşama sırası kodda: sözlük → genel → vektör", pSoz < pGen && pGen < pVek);
ok("aşama yedeği yalnız TDE'de çalışır", /function okzTdeYedek[\s\S]{0,200}okzTdeMi\(kanon\)/.test(BLOK));
ok("önce önbellek, sonra kural", BLOK.indexOf("okzCacheBul(kanon, kazanim)") < BLOK.indexOf("window.KA.esle"));
ok("her aşama önbelleğe yazıyor",
  /okzCacheYaz\(kanon, kazanim, soz\.konu, "kural"/.test(BLOK) &&
  /okzCacheYaz\(kanon, kazanim, g\.konu, "genel"/.test(BLOK) &&
  /okzCacheYaz\(kanon, kazanim, v\.konu, "vektor"/.test(BLOK));

/* gerçek blok, gerçek modüller */
globalThis.window = globalThis;
globalThis.OKZTDE = OKZTDE;
/* konu_esleme indeksi yüklenmemiş gibi: 1→2→3 aşama yolu sınanır */
globalThis.OKZK_IDX = null;
globalThis.okzStore = () => ({});
globalThis.okzBilinenDersler = () => [TDE];
new Function(BLOK + "\nglobalThis.__okzKonuBul = okzKonuBul;\nglobalThis.__cacheBul = okzCacheBul;\nglobalThis.__cacheYaz = okzCacheYaz;")(globalThis);
const bul = (c) => globalThis.__okzKonuBul(TDE, c);

console.log("\n== 4) Öğrenen sözlük (cache) davranışı ==");
const C1 = "Kavuştakların türküdeki işlevini açıklar.";
const ilk = bul(C1);
ok("ilk çözüm 1. aşamadan", ilk && ilk.kaynak === "sozluk", ilk ? ilk.kaynak : "yok");
ok("çözüm önbelleğe yazıldı", !!globalThis.__cacheBul(TDE, C1));
const ikinci = bul(C1);
ok("ikinci çözüm DB/bellek önbelleğinden", ikinci && ikinci.kaynak === "cache", ikinci ? ikinci.kaynak : "yok");
ok("önbellek konuyu koruyor", ikinci && ikinci.konu === "Türkü");
ok("önbellek anahtarı ders + normalize cümle",
  !!globalThis.__cacheBul(TDE, "  KAVUŞTAKLARIN türküdeki işlevini açıklar.  "));
ok("başka derste aynı cümle önbellekten gelmiyor", !globalThis.__cacheBul("Biyoloji", C1));
ok("güven düşük kayıt daha güvenilir kaydı ezmiyor",
  (function () {
    const c = "Masallarda tekerleme kullanılır.";
    bul(c); // kural
    globalThis.__cacheYaz(TDE, c, "Destan", "genel", 0.45, {});
    return (globalThis.__cacheBul(TDE, c) || {}).konu === "Masal";
  })());
ok("oturum yokken sessiz çalışıyor (sb undefined)", (function () {
  try { globalThis.__cacheYaz(TDE, "Deneme cümlesi buraya.", "Koşuk", "kural", 0.9, {}); return true; } catch (e) { return false; }
})());
ok("2. aşama kaydı 'genel' güveniyle yazılıyor",
  (function () {
    const c = "Metindeki söz varlığının anlamını bağlamdan hareketle belirler.";
    bul(c);
    const e = globalThis.__cacheBul(TDE, c) || {};
    return e.asama === 2 && e.guven === 0.45;
  })());

console.log("\n== 5) Supabase: kazanim_konu_cache ==");
ok("migration 0005 dosyası var", MIG.length > 500);
ok("tablo (ders, metin_norm) anahtarlı", /primary key \(ders, metin_norm\)/.test(MIG));
ok("RLS açık", /alter table public\.kazanim_konu_cache enable row level security/.test(MIG));
ok("okuma: giriş yapmış herkes", /kazanim_konu_cache_select_all[\s\S]{0,160}using \(true\)/.test(MIG));
ok("ekleme: yalnız kendi adına", /insert_own[\s\S]{0,160}auth\.uid\(\) = olusturan/.test(MIG));
ok("kaynak kısıtı kural/genel/vektor/elle/llm", /kazanim_konu_cache_kaynak_chk[\s\S]{0,120}\('kural', 'genel', 'vektor', 'elle', 'llm'\)/.test(MIG));
ok("güncelleme zamanı tetikleyicisi", /kazanim_konu_cache_dokun_trg/.test(MIG));
ok("uygulama tabloya upsert ediyor", /from\("kazanim_konu_cache"\)\.upsert/.test(APP) && /onConflict: "ders,metin_norm"/.test(APP));
ok("uygulama tablodan yüklüyor", /from\("kazanim_konu_cache"\)\s*\.select/.test(APP));
ok("girişte önbellek yükleniyor", /okzCacheYukle\(\)/.test(APP));
ok("çıkışta önbellek temizleniyor", /OKZ_CACHE = Object\.create\(null\)/.test(APP));

console.log("\n== 6) tde_kazanim_10.json eksiksiz ==");
const konular = TDED.konular;
ok("30 konu", konular.length === 30);
ok("her konuda pdf_sayfa alanı", konular.every((k) => Array.isArray(k.pdf_sayfa)));
ok("her konuda bölüm", konular.every((k) => !!k.bolum));
ok("her konuda en az 5 anahtar kavram", konular.every((k) => k.anahtar_kavramlar.length >= 5));
ok("her konuda içerik nesnesi", konular.every((k) => k.icerik && Array.isArray(k.icerik.ozellikler)));
const dolu = konular.filter((k) => k.icerik.madde > 0);
ok("28 konu PDF'ten maddeli", dolu.length === 28, String(dolu.length));
ok("maddesi olmayan 2 konu not_'lu", konular.filter((k) => !k.icerik.madde).every((k) => !!k.not_),
  konular.filter((k) => !k.icerik.madde && !k.not_).map((k) => k.konu).join(", "));
const idler = new Set(konular.map((k) => k.konu_id));
ok("her ilişki hedefi gerçek konu", konular.every((k) => k.iliskili_konular.every((r) => idler.has(r.konu_id))));
ok("ilişki sayısı 108", TDED.iliski_ozet.iliski === 108, String(TDED.iliski_ozet.iliski));
ok("her konunun en az 2 ilişkisi var", konular.every((k) => k.iliskili_konular.length >= 2));
ok("ilişki türleri tanımlı", konular.every((k) => k.iliskili_konular.every((r) => !!r.tur && !!r.neden)));
ok("her konuya en az bir 'neden' yazılmış", konular.every((k) => k.iliskili_konular.every((r) => r.neden.length > 15)));
ok("madde toplamı 1000+", TDED.iliski_ozet.madde > 1000, String(TDED.iliski_ozet.madde));
ok("PDF künyesi kayıtlı", /10 Edebiyat Ders notları/.test(TDED.kaynak_pdf.dosya) && TDED.kaynak_pdf.sayfa === 149);

console.log("\n== 7) Tarayıcı veri modülü JSON ile senkron ==");
const { modulUret, raporUret } = require(path.join(KOK, "scripts/tde-icerik-uret.js"));
ok("okz-tde-veri.js birebir üretilmiş", modulUret(TDED) === oku("site/okz-tde-veri.js"),
  "scripts/tde-icerik-uret.js yeniden çalıştırılmalı");
ok("ilişki raporu (docs) birebir üretilmiş", raporUret(TDED) === oku("docs/uretim/TDE-MUFREDAT-ILISKILERI.md"),
  "scripts/tde-icerik-uret.js yeniden çalıştırılmalı");
/* v72 — KULLANICI: "İlişkili konu kartını kaldır."
   Kart artık ÇİZİLMİYOR. Veri ve modül yerinde kalır (Okulizyon eşleştirmesi
   aynı dosyaları kullanıyor); yalnız konu detayındaki kart kaldırıldı. */
ok("Bilgi Bankası ilişkili konular kartı KALDIRILDI",
  !/OKZTDE\.iliski\(p\.topic\)/.test(HTML) && /İlişkili konular" kartı KALDIRILDI/.test(HTML));
ok("ilişki verisi silinmedi (30 konu, 108 ilişki)",
  (TDED.konular || []).length === 30 &&
  (TDED.konular || []).reduce((a, k) => a + (k.iliskili_konular || []).length, 0) === 108);
ok("index.html modülleri yüklüyor",
  HTML.indexOf('<script src="okz-tde-veri.js"></script>') > 0 && HTML.indexOf('<script src="okz-tde.js"></script>') > 0);
ok("service worker modülleri önbelleğe alıyor",
  SW.indexOf('"./okz-tde-veri.js"') > 0 && SW.indexOf('"./okz-tde.js"') > 0);
// Tarih damgası sabit değil: her sürüm yükseltmesinde kırılmasın (v78).
ok("SW sürümü PWA_SURUM ile aynı", (function () {
  const m = (APP.match(/const PWA_SURUM = "([^"]+)"/) || [])[1];
  return !!m && new RegExp("analiz-merkezi-v-[0-9]+-" + m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(SW);
})());
/* v72 — havuz sayısı 30 değil 28 (2 Elle yazılmış havuz silindi).
   Doğru kaynak: müfredat (konular.js). */
ok("uygulama konu listesiyle aynı 30 konu",
  JSON.stringify(VERI.konular.map((k) => k.konu).slice().sort()) ===
  JSON.stringify(require(path.join(KOK, "konular.js")).KONULAR["10"][TDE].slice().sort()));

console.log("\n" + "─".repeat(64));
if (hata.length) {
  console.log("v70 üç aşama — " + gecen + " geçti, " + hata.length + " kaldı");
  hata.forEach((h) => console.log("   · " + h));
  process.exit(1);
}
console.log("v70 üç aşama — " + gecen + "/" + gecen + " geçti ✓");
