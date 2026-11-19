/* ============================================================
   v94 — MAZMUN: GAZEL DEĞİL, SÖZ SANATLARI → ŞİİRDE AHENK
   ------------------------------------------------------------
   KULLANICI (19 Kasım):
     "O gazele bağladığın mazmun içeren kazanım varya aslında söz
      sanatları ile ilgiliymiş. Sen bu kazanımı şiirde ahenk e bağla."

   KAZANIM (Okulizyon, canlı):
     "Şiirdeki mazmun, imge ve edebî sanatları belirleyerek bunların
      anlama katkısını değerlendirir."

   NE DEĞİŞTİ?
     v92'de bu cümle "Saf Şiir"den kurtarılıp "Gazel"e bağlanmıştı
     (mazmun divan şiirinin kalıplaşmış imge dünyası diye).
     Kullanıcı düzeltmesi: kazanım gazelin BİÇİM bilgisi (matla/makta/
     aruz) değil, SÖZ SANATLARI bilgisidir. 10. sınıf konu listesinde
     bunu karşılayan konu Şiirde Ahenk'tir.
       • mazmun: Gazel → Şiirde Ahenk (veri + sözlük + kural tablosu)
       • terim sayısı DEĞİŞMEDİ: 92 (terim taşındı, uydurulmadı)
       • gazel kendi terimleriyle ayrışmaya devam eder (gazel/matla/makta)
       • Saf Şiir kuralı korunur; "imge" hâlâ hiçbir konuya zorlanmaz

   Çalıştır: node tests/v94-mazmun-soz-sanatlari.test.js
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
const AHENK = "Şiirde Ahenk (Ölçü, Uyak, Redif, Aliterasyon, Asonans)";
const VAKA = "Şiirdeki mazmun, imge ve edebî sanatları belirleyerek bunların anlama katkısını değerlendirir.";

const KA = require(path.join(KOK, "site/konu-anahtar.js"));
const OKZTDE = require(path.join(KOK, "site/okz-tde.js"));
const VERI = require(path.join(KOK, "site/okz-tde-veri.js"));
const TDED = R("site/content/mufredat/tde_kazanim_10.json");
const KE = R("site/content/konu_esleme.json");
const APP = oku("site/app-pwa.js");
const konu = (ad) => TDED.konular.find((k) => k.konu === ad);

/* ------------------------------------------------------------ */
console.log("\n== 1) Veri: mazmun Gazel'den çıktı, Ahenk'e girdi ==");
{
  const gazel = (konu("Gazel") || {}).ayirt_edici_terimler || [];
  const ahenk = (konu(AHENK) || {}).ayirt_edici_terimler || [];
  ok("Gazel terimleri mazmun İÇERMİYOR", gazel.indexOf("mazmun") < 0, gazel.join(","));
  ok("Gazel biçim terimleri korunuyor", gazel.join(",") === "gazel,matla,makta", gazel.join(","));
  ok("Ahenk terimlerinde mazmun var", ahenk.indexOf("mazmun") >= 0, ahenk.join(","));
  ok("Ahenk'in kendi terimleri korunuyor",
    ["ahenk", "uyak", "redif", "aliterasyon", "asonans", "kafiye", "ölçü", "durak", "aruz", "ritim"]
      .every((t) => ahenk.indexOf(t) >= 0));
  ok("sözlük: mazmun → Şiirde Ahenk", TDED.sozluk["mazmun"] === AHENK, String(TDED.sozluk["mazmun"]));
  ok("sözlük: terim sayısı 92 (taşındı, uydurulmadı)", Object.keys(TDED.sozluk).length === 92,
    String(Object.keys(TDED.sozluk).length));
  ok("özet terim sayısı 92", TDED.ozet.terim === 92, String(TDED.ozet.terim));
  ok("30 konu korunuyor", TDED.konular.length === 30, String(TDED.konular.length));
  ok("Saf Şiir terimleri değişmedi (v92 kazanımı)",
    ((konu("Saf Şiir") || {}).ayirt_edici_terimler || []).join(",") === "saf şiir,öz şiir,simgecilik,sembolizm");
  ok("imge hiçbir konuya zorlanmıyor", TDED.sozluk["imge"] === undefined);
}

console.log("\n== 2) Tarayıcı sözlüğü ve arama indeksi senkron ==");
{
  ok("okz-tde-veri: mazmun → Şiirde Ahenk", VERI.sozluk["mazmun"] === AHENK);
  ok("okz-tde-veri sözlüğü JSON ile aynı",
    JSON.stringify(Object.entries(VERI.sozluk).sort()) === JSON.stringify(Object.entries(TDED.sozluk).sort()));
  const havuz = (id) => KE.havuzlar.find((h) => h.konu_id === id) || {};
  const gazelMetin = havuz("edebiyat_10_u02_k01").metin || "";
  const ahenkMetin = havuz("edebiyat_10_u03_k06").metin || "";
  ok("konu_esleme: Gazel metninde mazmun YOK", !/mazmun/.test(gazelMetin), gazelMetin);
  ok("konu_esleme: Ahenk metninde mazmun var", /mazmun/.test(ahenkMetin), ahenkMetin);
  ok("konu_esleme: Ahenk metni hâlâ kazanım cümlesini taşıyor",
    /ahengi sağlayan özellikleri/.test(ahenkMetin));
}

console.log("\n== 3) Eşleme: vaka kazanımı Şiirde Ahenk ==");
{
  const k = KA.esle(VAKA, TDE);
  ok("konu-anahtar: vaka → Şiirde Ahenk", k && k.konu === AHENK, k ? k.konu : "yok");
  ok("konu-anahtar: vaka Saf Şiir DEĞİL", !k || k.konu !== "Saf Şiir");
  ok("konu-anahtar: vaka Gazel DEĞİL", !k || k.konu !== "Gazel");

  ok("konu-anahtar: gazel cümlesi hâlâ Gazel",
    (KA.esle("Gazelin matla beytini açıklar.", TDE) || {}).konu === "Gazel");
  ok("konu-anahtar: matla → Gazel",
    (KA.esle("Beytin ilk beytine matla denir.", TDE) || {}).konu === "Gazel");
  ok("konu-anahtar: saf şiir + mazmun → Saf Şiir (özel kural önce)",
    (KA.esle("Saf şiirde imge ve mazmunu çözümler.", TDE) || {}).konu === "Saf Şiir");
  ok("konu-anahtar: 'söz sanatı' geçen cümle → Şiirde Ahenk",
    (KA.esle("Şiirdeki söz sanatlarını belirler.", TDE) || {}).konu === AHENK);
  ok("konu-anahtar: 'edebî sanat' geçen cümle → Şiirde Ahenk",
    (KA.esle("Metindeki edebî sanatları belirler.", TDE) || {}).konu === AHENK);
  ok("konu-anahtar: yalnız imge geçen cümle bir konuya ZORLANMIYOR",
    (KA.esle("Şiirde imgeleri belirler.", TDE) || {}).konu !== AHENK);

  const kurallar = KA.KURALLAR.map((r) => r.konu);
  ok("Gazel kuralı duruyor", kurallar.indexOf("Gazel") >= 0);
  ok("Saf Şiir kuralı Gazel'den önce (v92 korunur)",
    kurallar.indexOf("Saf Şiir") < kurallar.indexOf("Gazel"));

  const soz = OKZTDE.sozlukEsle(VAKA);
  ok("okz-tde 1. aşama (sözlük): vaka → Şiirde Ahenk", soz && soz.konu === AHENK, soz ? soz.konu + " (" + soz.terim + ")" : "yok");
  const e = OKZTDE.esle(VAKA);
  ok("okz-tde esle: vaka → Şiirde Ahenk", e && e.konu === AHENK, e ? e.konu : "yok");
  ok("okz-tde esle: 'matla' hâlâ Gazel",
    (OKZTDE.esle("Metindeki gazelin matla beytini bulur.") || {}).konu === "Gazel");
}

console.log("\n== 4) Uygulama: bayat 'Gazel' önbelleği kendiliğinden düzelir ==");
{
  const i = APP.indexOf("function okzDersKanonik(ders)");
  const j = APP.indexOf("// Hata kaydını uygulamanın diline çevir", i);
  ok("eşleme bloğu bulundu", i > 0 && j > i);
  const BLOK = APP.slice(i, j);

  globalThis.window = globalThis;
  globalThis.OKZTDE = OKZTDE;
  globalThis.KA = KA;
  globalThis.OKZK_IDX = null;
  globalThis.okzStore = () => ({});
  globalThis.okzBilinenDersler = () => [TDE];
  new Function(BLOK + "\nglobalThis.__okzKonuBul = okzKonuBul;\nglobalThis.__cacheBul = okzCacheBul;\nglobalThis.__cacheYaz = okzCacheYaz;")(globalThis);

  /* canlı veride bugün duran hâl: kural katmanı bu cümleyi Gazel'e yazmıştı */
  globalThis.__cacheYaz(TDE, VAKA, "Gazel", "kural", 0.9, {});
  ok("bayat satır gerçekten yazıldı (Gazel)", (globalThis.__cacheBul(TDE, VAKA) || {}).konu === "Gazel");
  const r = globalThis.__okzKonuBul(TDE, VAKA);
  ok("uygulama: vaka artık Şiirde Ahenk", r && r.konu === AHENK, r ? r.konu + "/" + r.kaynak : "yok");
  ok("önbellek tazelendi (Gazel kalmadı)",
    (globalThis.__cacheBul(TDE, VAKA) || {}).konu === AHENK,
    (globalThis.__cacheBul(TDE, VAKA) || {}).konu);

  /* elle/LLM kararı ezilmez */
  const ELLE = "Metindeki mazmunu gazel bağlamında yorumlar.";
  globalThis.__cacheYaz(TDE, ELLE, "Gazel", "elle", 1, {});
  ok("elle eşleme korunur (öğrenci kararı)", (globalThis.__okzKonuBul(TDE, ELLE) || {}).konu === "Gazel");

  /* açılışta onarım: mevcut deneme kayıtlarının konusu yeniden yazılır */
  ok("açılışta konu onarımı duruyor", /function okzKonulariOnar\(/.test(APP));
}

console.log("\n== 5) Sunucu: bayat önbellek satırını silen migration ==");
{
  const dosya = "supabase/migrations/0012_mazmun_siirde_ahenk.sql";
  const yol = path.join(KOK, dosya);
  ok("migration dosyası var", fs.existsSync(yol));
  const SQL = fs.existsSync(yol) ? fs.readFileSync(yol, "utf8") : "";
  ok("kazanim_konu_cache temizleniyor", /delete\s+from\s+public\.kazanim_konu_cache/i.test(SQL));
  ok("yalnız mazmun kazanımının satırı gidiyor", /metin_norm\s+like\s+'%mazmun%'/i.test(SQL));
  ok("yalnız otomatik (kural) satır siliniyor", /kaynak\s*=\s*'kural'/i.test(SQL));
  ok("öğrenci verisine dokunulmuyor", !/update\s+public\.app_states|delete\s+from\s+public\.app_states/i.test(SQL));
}

console.log("\n== 6) Sürüm damgası ==");
{
  const SW = oku("site/sw.js");
  ok("PWA sürümü v94+", /const PWA_SURUM = "v9[4-9]/.test(APP), (APP.match(/const PWA_SURUM = "[^"]+"/) || [])[0]);
  ok("service worker cache v94+", /v9[4-9][a-z]?-[a-z-]+/.test(SW), (SW.match(/const CACHE = "[^"]+"/) || [])[0]);
}

console.log("\n" + "─".repeat(64));
if (hata.length) {
  console.log("v94 mazmun → Şiirde Ahenk — " + gecen + " geçti, " + hata.length + " kaldı");
  hata.forEach((h) => console.log("   ✗ " + h));
  process.exit(1);
} else {
  console.log("v94 mazmun → Şiirde Ahenk — " + gecen + "/" + gecen + " geçti");
}
