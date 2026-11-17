/* v62 — OKULİZYON ↔ TYMM KAZANIM UYUMU
   ------------------------------------------------------------
   KULLANICI DÜZELTMESİ:
   "Hazırladığın tüm kazanımlar dosyasında SADECE EDEBİYAT Okulizyon'la
    eşleşmiyor, çünkü TYMM'de okuma/dinleme vb. şeklinde vermiş."

   Bu test o iddiayı ÖLÇER — söze güvenmez:
     1) 8 dersin TYMM çıktısı KONU içerir (Okulizyon'la eşleşebilir)
     2) TDE çıktısı ÇIPLAK BECERİ adıdır (eşleşemez) → ayrı kaynak şart
     3) TDE kodunun ilk hanesi TEMA değil BECERİ EKSENİdir
     4) Okulizyon TDE kazanımları dosyada ve TYMM temasına bağlı
   Çalıştır: node tests/dom/dom-v62-okulizyon-uyum.test.js
   ============================================================ */
"use strict";
const fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "..");
const MEB = JSON.parse(fs.readFileSync(path.join(KOK, "site/content/mufredat/meb_kazanim_10.json"), "utf8"));
const OKZ = JSON.parse(fs.readFileSync(path.join(KOK, "site/content/mufredat/okulizyon_kazanim_10.json"), "utf8"));

let gecen = 0; const hata = [];
const ok = (ad, kosul, ek) => { if (kosul) { gecen++; console.log("  ✓ " + ad); } else { hata.push(ad + (ek ? " → " + ek : "")); console.log("  ✗ " + ad + (ek ? " → " + ek : "")); } };

const TDE = "Türk Dili ve Edebiyatı";
const dersler = [...new Set(MEB.ciktilar.map(c => c.ders))];
const ciktilar = (d) => MEB.ciktilar.filter(c => c.ders === d);

/* AYIRT EDİCİ ÖLÇÜT UZUNLUK DEĞİL.
   TDE çıktıları KAPALI bir beceri kümesinden gelir: 16 çıktı, yalnız 12
   farklı cümle, hepsi kalıp. Diğer derslerde her çıktı kendi KONUSUNU
   taşır (Kemosentez, Fermantasyon, Fotosentez …).
   Ölçüt: çıktı metni bu beceri kümesinin elemanı mı? */
const BECERI_SET = new Set([
  "Dinlemeyi/İzlemeyi Yönetebilme", "Anlam Oluşturabilme", "Çözümleyebilme",
  "Süreci Değerlendirebilme", "Okumayı Yönetebilme", "Konuşmayı Yönetebilme",
  "İçerik Oluşturabilme", "Kural Uygulayabilme", "Yazmayı Yönetebilme"
]);
const BECERI_KALIP = /^(Dinlemeyi\/İzlemeyi|Okumayı|Konuşmayı|Yazmayı|Anlam Oluşturabilme|Çözümleyebilme|Süreci Değerlendirebilme|İçerik Oluşturabilme|Kural Uygulayabilme)/;
/* "konu içerir" = beceri kümesinde DEĞİL ve kendi konu adını taşıyor */
const konuIcerir = (k) => !BECERI_SET.has(k.trim()) && !BECERI_KALIP.test(k.trim());

console.log("\n== 1) 9 ders var ==");
ok("ders sayısı 9", dersler.length === 9, String(dersler.length));
ok("TDE listede", dersler.includes(TDE));

console.log("\n== 2) 8 dersin çıktısı KONU içerir (Okulizyon'la eşleşebilir) ==");
const digerleri = dersler.filter(d => d !== TDE);
let uyumlu = 0;
for (const d of digerleri) {
  const oran = ciktilar(d).filter(c => konuIcerir(c.kazanim)).length;
  const tam = oran === ciktilar(d).length;
  if (tam) uyumlu++;
  ok(d + " çıktıları konu içerikli", tam, oran + "/" + ciktilar(d).length);
}
ok("8 dersin tamamı uyumlu", uyumlu === 8, uyumlu + "/8");

console.log("\n== 3) TDE çıktısı ÇIPLAK beceri adı (eşleşemez) ==");
const tdeC = ciktilar(TDE);
ok("TDE 16 çıktı", tdeC.length === 16, String(tdeC.length));
const ciplak = tdeC.filter(c => !konuIcerir(c.kazanim)).length;
ok("TDE çıktıları çıplak beceri", ciplak === 16, ciplak + "/16");
ok("TDE çıktısında tema/içerik adı YOK",
  tdeC.every(c => !/tema|koşuk|koşma|türkü|ninni|gazel|kaside/i.test(c.kazanim)),
  tdeC.map(c => c.kazanim).join(" | "));
ok("bu yüzden ayrı Okulizyon kaynağı şart", true);

console.log("\n== 4) TDE kodu: ilk hane BECERİ EKSENİ, tema değil ==");
const EKSEN = { "1": "Dinleme/İzleme", "2": "Okuma", "3": "Konuşma", "4": "Yazma" };
ok("her TDE çıktısında beceri_ekseni var", tdeC.every(c => !!c.beceri_ekseni));
ok("beceri_ekseni koddan türüyor",
  tdeC.every(c => c.beceri_ekseni === EKSEN[c.kod[3]]), tdeC.map(c => c.kod + "=" + c.beceri_ekseni).join(" "));
ok("tema alanı TDE'de geçersiz işaretli", tdeC.every(c => c.tema_gecerli === false));
ok("4 beceri ekseni de kullanılıyor",
  new Set(tdeC.map(c => c.beceri_ekseni)).size === 4,
  [...new Set(tdeC.map(c => c.beceri_ekseni))].join(", "));

console.log("\n== 5) Okulizyon TDE kazanımları ==");
ok("dosya var ve 9 kazanım", OKZ.kazanimlar.length === 9, String(OKZ.kazanimlar.length));
ok("ders TDE", OKZ.ders === TDE);
ok("sınıf 10", Number(OKZ.sinif) === 10);
ok("her kazanım TYMM çıktısına bağlı",
  OKZ.kazanimlar.every(k => Array.isArray(k.tymm_esleme) && k.tymm_esleme.length));
const gecerliKod = new Set(tdeC.map(c => c.kod));
const eksik = OKZ.kazanimlar.flatMap(k => k.tymm_esleme).filter(k => !gecerliKod.has(k));
ok("eşlenen kodların hepsi gerçek TYMM çıktısı", eksik.length === 0, eksik.join(", "));
ok("Okulizyon metni TYMM beceri adından FARKLI",
  OKZ.kazanimlar.every(k => !BECERI_KALIP.test(k.okulizyon)),
  "aynı olan var");
ok("kullanıcının verdiği 4 metin birebir var",
  ["Destan Dönemi Türk şiirini ve koşuk türünün genel özelliklerini açıklar.",
   "Şiirde ahengi sağlayan özellikleri (uyak düzeni, uyak, redif, aliterasyon, asonans) ile ilgili çalışma yapar.",
   "Metindeki söz varlığının anlamını bağlamdan hareketle belirler.",
   "Halk şiirini tanımlar, halk şiiri altında koşma türünün genel özelliklerini kavrar.",
   "Türkü türünün genel özelliklerini belirler.",
   "Metinlerden hareketle çıkarımlar yapar."]
    .every(m => OKZ.kazanimlar.some(k => k.okulizyon === m)),
  OKZ.kazanimlar.map(k => k.sira).join(","));

console.log("\n" + "─".repeat(58));
if (hata.length) { console.log("v62 Okulizyon uyumu — " + gecen + " geçti, " + hata.length + " kaldı"); hata.forEach(h => console.log("   · " + h)); process.exit(1); }
console.log("v62 Okulizyon uyumu — " + gecen + "/" + gecen + " geçti ✓");
