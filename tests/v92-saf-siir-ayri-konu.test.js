/* ============================================================
   v92 — SAF ŞİİR AYRI BİR KONUDUR (kullanıcı, 18 Kasım)
   ------------------------------------------------------------
   KULLANICI: "Uygulama normal şiir ile saf şiir karıştırıyor.
   Okulizyondan gelen kazanımı saf şiire bağlamış ama saf şiir
   değil. Bak sana ders notu vermiştim: orada saf şiirin neyle
   bağlantılı olduğunu bul, ona göre düzenle. Çünkü saf şiir ayrı
   bir konu."

   GERÇEK VAKA (canlı veri): Okulizyon'un
     "Şiirdeki mazmun, imge ve edebî sanatları belirleyerek bunların
      anlama katkısını değerlendirir."
   kazanımı 3 kullanıcıda da "Saf Şiir" konusuna yazılmıştı.

   DERS NOTU NE DİYOR?
   • Saf Şiir'in ilişkileri (TDE-MUFREDAT-ILISKILERI.md):
       Gazel — karşıtı ("saf şiir, gazelin kalıplaşmış mazmun
       dünyasına tepki olarak doğar")
       Şiirde Ahenk — ön koşul · Paragraf — aynı beceri
       Tanzimat Dönemi Şiiri — dönem
   • Yani "mazmun" divan şiirinin (gazel) terimidir; genel şiir
     bilgisi kazanımı Saf Şiir'e değil, gazel tarafına aittir.
   • Saf Şiir yalnızca adı/akımı geçen cümleye bağlanır
     (saf şiir · öz şiir · simgecilik · sembolizm).

   BU TEST NEYİ KANITLAR?
     1) Veri: Saf Şiir ayırt edici terimleri artık imge/mazmun/
        edebî sanat değil; mazmun Gazel'e bağlı.
     2) Arama indeksi (konu_esleme) ve tarayıcı sözlüğü
        (okz-tde-veri.js) veriyle senkron.
     3) Eşleme motoru (okz-tde.js) ve kural tablosu (konu-anahtar.js):
        vaka cümlesi → Gazel; "saf şiir" geçen cümle → Saf Şiir.
     4) Uygulama: bayat "kural" önbelleği yeni kuralı gölgelemez,
        elle/LLM kayıtlarına dokunulmaz.
     5) Supabase migration 0009 bayat satırı siler.
     6) Saf Şiir konusu SİLİNMEDİ (ayrı konu olarak duruyor).

   Çalıştır: node tests/v92-saf-siir-ayri-konu.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const oku = (p) => fs.readFileSync(path.join(KOK, p), "utf8");
const R = (p) => JSON.parse(oku(p));

let gecen = 0;
const hata = [];
const ok = (ad, kosul, ek) => {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { hata.push(ad + (ek ? " → " + ek : "")); console.log("  ✗ " + ad + (ek ? " → " + ek : "")); }
};

const TDE = "Türk Dili ve Edebiyatı";
const VAKA = "Şiirdeki mazmun, imge ve edebî sanatları belirleyerek bunların anlama katkısını değerlendirir.";
const SAF = "Saf şiirde imge ve mazmunu çözümler.";

const KA = require(path.join(KOK, "site/konu-anahtar.js"));
const OKZTDE = require(path.join(KOK, "site/okz-tde.js"));
const TDED = R("site/content/mufredat/tde_kazanim_10.json");
const KE = R("site/content/konu_esleme.json");
const APP = oku("site/app-pwa.js");

const konu = (ad) => TDED.konular.find((k) => k.konu === ad);

/* ------------------------------------------------------------ */
console.log("\n== 1) Veri: Saf Şiir'in ayırt edici terimleri ==");
{
  ok("Saf Şiir konusu duruyor (ayrı konu)", !!konu("Saf Şiir"));
  ok("30 konu korunuyor", TDED.konular.length === 30, String(TDED.konular.length));
  const saf = (konu("Saf Şiir") || {}).ayirt_edici_terimler || [];
  ok("Saf Şiir terimleri: saf şiir + akım adları",
    saf.join(",") === "saf şiir,öz şiir,simgecilik,sembolizm", saf.join(","));
  ok("Saf Şiir terimlerinde imge YOK", saf.indexOf("imge") < 0);
  ok("Saf Şiir terimlerinde mazmun YOK", saf.indexOf("mazmun") < 0);
  ok("Saf Şiir terimlerinde edebî sanat YOK", saf.indexOf("edebî sanat") < 0);
  const gazel = (konu("Gazel") || {}).ayirt_edici_terimler || [];
  ok("mazmun Gazel'e bağlandı", gazel.indexOf("mazmun") >= 0, gazel.join(","));
  ok("sözlük: mazmun → Gazel", TDED.sozluk["mazmun"] === "Gazel");
  ok("sözlük: imge hiçbir konuya zorlanmıyor", TDED.sozluk["imge"] === undefined);
  ok("sözlük: edebî sanat hiçbir konuya zorlanmıyor", TDED.sozluk["edebî sanat"] === undefined);
  ok("sözlük toplam 92 terim", Object.keys(TDED.sozluk).length === 92, String(Object.keys(TDED.sozluk).length));
  ok("kazanım kodları değişmedi (tema becerisi)", ((konu("Saf Şiir") || {}).ciktilar || []).join(",") === "TDE2.1,TDE2.2,TDE2.3,TDE2.4");
}

console.log("\n== 2) Arama indeksi ve tarayıcı sözlüğü senkron ==");
{
  const havuz = (id) => KE.havuzlar.find((h) => h.konu_id === id);
  const safMetin = (havuz("edebiyat_10_u02_k04") || {}).metin || "";
  const gazelMetin = (havuz("edebiyat_10_u02_k01") || {}).metin || "";
  ok("konu_esleme: Saf Şiir metninde imge yok", !/(^|[·\s])imge([·\s]|$)/.test(safMetin), safMetin);
  ok("konu_esleme: Saf Şiir metninde mazmun yok", !/mazmun/.test(safMetin), safMetin);
  ok("konu_esleme: Gazel metninde mazmun var", /mazmun/.test(gazelMetin), gazelMetin);
  ok("konu_esleme: Saf Şiir akım adlarını taşıyor", /simgecilik/.test(safMetin) && /sembolizm/.test(safMetin));
  const VERI = require(path.join(KOK, "site/okz-tde-veri.js"));
  ok("okz-tde-veri sözlüğü JSON ile aynı",
    JSON.stringify(Object.entries(VERI.sozluk).sort()) === JSON.stringify(Object.entries(TDED.sozluk).sort()));
  ok("okz-tde-veri: mazmun → Gazel", VERI.sozluk["mazmun"] === "Gazel");
}

console.log("\n== 3) Eşleme: vaka cümlesi Saf Şiir'e düşmüyor ==");
{
  const soz = OKZTDE.sozlukEsle(VAKA);
  ok("okz-tde 1. aşama: vaka → Gazel", soz && soz.konu === "Gazel", soz ? soz.konu + " (" + soz.terim + ")" : "yok");
  const esle = OKZTDE.esle(VAKA);
  ok("okz-tde esle: vaka Saf Şiir DEĞİL", esle && esle.konu !== "Saf Şiir", esle ? esle.konu : "yok");
  ok("okz-tde esle: vaka → Gazel", esle && esle.konu === "Gazel", esle ? esle.konu : "yok");
  ok("okz-tde: saf şiir geçen cümle hâlâ Saf Şiir", (OKZTDE.esle(SAF) || {}).konu === "Saf Şiir");
  ok("okz-tde: öz şiir → Saf Şiir", (OKZTDE.esle("Öz şiir anlayışını sürdüren şairleri sıralar.") || {}).konu === "Saf Şiir");
  ok("okz-tde: sembolizm → Saf Şiir", (OKZTDE.esle("Sembolizmin şiir diline etkisini açıklar.") || {}).konu === "Saf Şiir");
  ok("okz-tde konu listesinde Saf Şiir var", OKZTDE.konular().indexOf("Saf Şiir") >= 0);

  const k = KA.esle(VAKA, TDE);
  ok("konu-anahtar: vaka → Gazel", k && k.konu === "Gazel", k ? k.konu : "yok");
  ok("konu-anahtar: vaka Saf Şiir DEĞİL", !k || k.konu !== "Saf Şiir");
  ok("konu-anahtar: saf şiir + mazmun → Saf Şiir (özel kural önce)", (KA.esle(SAF, TDE) || {}).konu === "Saf Şiir");
  ok("konu-anahtar: yalnız imge geçen cümle Saf Şiir'e zorlanmıyor",
    (KA.esle("Şiirde imgeleri belirler.", TDE) || {}).konu !== "Saf Şiir");
  ok("konu-anahtar: Saf Şiir kuralı Gazel'den önce",
    KA.KURALLAR.findIndex((r) => r.konu === "Saf Şiir") < KA.KURALLAR.findIndex((r) => r.konu === "Gazel"));
  const kaynak = oku("scripts/tde-kazanim-uret.js");
  ok("üretici tablo: Saf Şiir terimlerinde imge/mazmun/edebî sanat yok",
    /edebiyat_10_u02_k04: \{ eksen: "okuma", ayirt: \["saf şiir", "öz şiir", "simgecilik", "sembolizm"\] \}/.test(kaynak));
  ok("üretici tablo: Gazel terimlerinde mazmun var",
    /edebiyat_10_u02_k01: \{ eksen: "okuma", ayirt: \["gazel", "matla", "makta", "mazmun"\] \}/.test(kaynak));
}

console.log("\n== 4) Bayat önbellek yeni kuralı gölgelemez ==");
{
  const i = APP.indexOf("function okzDersKanonik(ders)");
  const j = APP.indexOf("// Hata kaydını uygulamanın diline çevir", i);
  ok("eşleme bloğu bulundu", i > 0 && j > i);
  const BLOK = APP.slice(i, j);
  ok("bayat önbellek denetimi var", /function okzOnbellekEskidi\(/.test(BLOK));
  ok("yalnız 'kural' kaydı denetleniyor", /onbellek\.asilKaynak !== "kural"\) return false/.test(BLOK));
  ok("okzKonuBul denetimi çağırıyor", /okzOnbellekEskidi\(kanon, kazanim, onbellek\)/.test(BLOK));

  globalThis.window = globalThis;
  globalThis.OKZTDE = OKZTDE;
  globalThis.KA = KA;
  globalThis.OKZK_IDX = null;
  globalThis.okzStore = () => ({});
  globalThis.okzBilinenDersler = () => [TDE];
  new Function(BLOK + "\nglobalThis.__okzKonuBul = okzKonuBul;\nglobalThis.__cacheBul = okzCacheBul;\nglobalThis.__cacheYaz = okzCacheYaz;")(globalThis);
  const bul = (c) => globalThis.__okzKonuBul(TDE, c);

  /* canlı verideki hâli: kural katmanı bu cümleyi Saf Şiir'e yazmıştı */
  globalThis.__cacheYaz(TDE, VAKA, "Saf Şiir", "kural", 0.9, {});
  ok("bayat satır gerçekten yazıldı", (globalThis.__cacheBul(TDE, VAKA) || {}).konu === "Saf Şiir");
  const r = bul(VAKA);
  ok("uygulama: vaka artık Gazel", r && r.konu === "Gazel", r ? r.konu + "/" + r.kaynak : "yok");
  ok("önbellek tazelendi", (globalThis.__cacheBul(TDE, VAKA) || {}).konu === "Gazel");

  /* elle/LLM kararı ezilmez */
  const ELLE = "Metindeki mazmunu yorumlar.";
  globalThis.__cacheYaz(TDE, ELLE, "Saf Şiir", "elle", 1, {});
  ok("elle eşleme korunur (öğrenci kararı)", (bul(ELLE) || {}).konu === "Saf Şiir");

  /* yerel kural bulamazsa eski önbellek son çare olarak döner */
  const BOS = "Şiirde imgeleri belirler.";
  globalThis.__cacheYaz(TDE, BOS, "Saf Şiir", "kural", 0.9, {});
  const rb = bul(BOS);
  ok("yerel kural yoksa önbellek kaybolmaz", !!rb && rb.konu === "Saf Şiir", rb ? rb.konu + "/" + rb.kaynak : "yok");

  /* konu onarımı açılışta çalışıyor: eski kayıtlar kendiliğinden düzelir */
  ok("açılışta konu onarımı var", /function okzKonulariOnar\(/.test(APP) && /okzKonulariOnar\(/.test(APP));
}

console.log("\n== 5) Supabase: bayat satırı silen migration ==");
{
  const yol = path.join(KOK, "supabase/migrations/0009_saf_siir_kazanim_onarim.sql");
  ok("migration dosyası var", fs.existsSync(yol));
  const SQL = fs.existsSync(yol) ? fs.readFileSync(yol, "utf8") : "";
  ok("kazanim_konu_cache temizleniyor", /delete from public\.kazanim_konu_cache/i.test(SQL));
  ok("yalnız Saf Şiir'e yazılmış eski satır gidiyor",
    /where\s+konu\s*=\s*'Saf Şiir'/i.test(SQL) && /metin_norm\s+(not\s+)?like/i.test(SQL));
  ok("kullanıcı verisine dokunulmuyor", !/update\s+public\.app_states/i.test(SQL));
}

console.log("\n" + "─".repeat(64));
if (hata.length) {
  console.log("v92 Saf Şiir ayrı konu — " + gecen + " geçti, " + hata.length + " kaldı");
  hata.forEach((h) => console.log("   ✗ " + h));
  process.exit(1);
} else {
  console.log("v92 Saf Şiir ayrı konu — " + gecen + "/" + gecen + " geçti");
}
