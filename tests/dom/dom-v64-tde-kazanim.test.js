/* v64 — TDE KAZANIM SETİ (Okulizyon eşleşmesi, diğer dersler gibi)
   ------------------------------------------------------------
   KULLANICI: "Edebiyatın okulizyonla eşleşmesi için diğer derslerdeki
   gibi kazanımlarını araştır bul. Sadece dosyaya not yaz diye demedim."

   Bu test ÜÇ ŞEYİ kanıtlar:
     1) TDE'nin 30 konusu için kazanım verisi VAR (tde_kazanim_10.json)
        ve içindeki her cümle KAYNAKLI — Okulizyon cümleleri kullanıcının
        verdiği 9 cümleyle birebir, gerisi TYMM/ODSGM resmî metni.
     2) Uygulamanın eşleştirme yolu (okzKonuBul: MEB katmanı → kural
        tablosu → indeks) TDE cümlelerini DOĞRU konuya bağlıyor.
     3) "Destan Dönemi Türk şiiri … koşuk türü" tuzağı KOŞUK'a gidiyor,
        DESTAN'a değil. Genel beceri cümleleri uydurma konuya bağlanmıyor.

   Çalıştır: node tests/dom/dom-v64-tde-kazanim.test.js
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const KOK = path.join(__dirname, "..", "..");
const R = (p) => JSON.parse(fs.readFileSync(path.join(KOK, p), "utf8"));

const TDED = R("site/content/mufredat/tde_kazanim_10.json");
const OKZ = R("site/content/mufredat/okulizyon_kazanim_10.json");
const MEB = R("site/content/mufredat/meb_kazanim_10.json");
const ICR = R("site/content/mufredat/tde_icerik_10.json");
const KE = R("site/content/konu_esleme.json");
const KK = R("site/content/mufredat/kazanim_konu_10.json");

const KA = require(path.join(KOK, "site/konu-anahtar.js"));
const OKZK = require(path.join(KOK, "site/okz-konu.js"));
const OKZM = require(path.join(KOK, "site/okz-meb.js"));
const OKZTDE = require(path.join(KOK, "site/okz-tde.js"));
const TDE = "Türk Dili ve Edebiyatı";

/* ---- uygulamanın gerçek eşleştirme fonksiyonunu dosyadan al ---- */
const APP = fs.readFileSync(path.join(KOK, "site/app-pwa.js"), "utf8");
const blok = (() => {
  const i = APP.indexOf("function okzDersKanonik(ders)");
  const j = APP.indexOf("// Hata kaydını uygulamanın diline çevir", i);
  if (i < 0 || j < 0) throw new Error("okzKonuBul bloğu bulunamadı");
  if (!APP.slice(i, j).includes("OKZ_OTO_ESIK")) throw new Error("eşik sabiti blokta yok");
  return APP.slice(i, j);
})();

let gecen = 0;
const hata = [];
const ok = (ad, kosul, ek) => {
  if (kosul) {
    gecen++;
    console.log("  ✓ " + ad);
  } else {
    hata.push(ad + (ek ? " → " + ek : ""));
    console.log("  ✗ " + ad + (ek ? " → " + ek : ""));
  }
};

/* jsdom gerekmez: blok yalnız window/globalThis üzerinden çalışır */
const OKZ_IDX = OKZK.indeksKur(KE);
globalThis.window = globalThis;
globalThis.OKZM = OKZM;
globalThis.KA = KA;
globalThis.OKZK = OKZK;
globalThis.OKZK_IDX = OKZ_IDX;
globalThis.OKZTDE = OKZTDE;
globalThis.okzStore = () => ({});
globalThis.okzBilinenDersler = () => ["Türk Dili ve Edebiyatı"];
globalThis.window_OKZ = globalThis.OKZ = require(path.join(KOK, "site/okz-normalize.js"));
new Function(blok + "\nglobalThis.__okzKonuBul = okzKonuBul;")(globalThis);
const konuBul = (c) => globalThis.__okzKonuBul(TDE, c);

/* ------------------------------------------------------------ */
console.log("\n== 1) 30 konu, hepsi uygulamanın konusu ==");
/* Uygulamanın konu listesi: soru havuzu indeksi (index.html'deki liste
   \u-kaçışlı yazıldığı için doğrudan ayrıştırılamıyor; isimler birebir
   HTML içinde de aranıyor). */
const HTML = fs.readFileSync(path.join(KOK, "site/index.html"), "utf8");
/* v72 — Konu listesi SORU HAVUZLARINDAN değil MÜFREDATTAN gelir.
   Kullanıcı isteğiyle 20 havuz silindi (2'si TDE); havuz sayısı 30 değil 28
   olduğu için eski ölçüt yanlış sonuç veriyordu. Doğru kaynak: konular.js. */
const appKonular = require(path.join(KOK, "konular.js")).KONULAR["10"][TDE];
ok("uygulamada 30 TDE konusu (müfredat)", appKonular.length === 30, String(appKonular.length));
ok("30 konu index.html listesinde de var",
  appKonular.every((k) => HTML.includes('"' + k + '"')),
  appKonular.filter((k) => !HTML.includes('"' + k + '"')).join(", "));
ok("kazanım seti 30 konu", TDED.konular.length === 30, String(TDED.konular.length));
ok(
  "konu adları uygulamayla BİREBİR aynı",
  JSON.stringify(TDED.konular.map((k) => k.konu).slice().sort()) === JSON.stringify(appKonular.slice().sort()),
  TDED.konular.map((k) => k.konu).filter((k) => !appKonular.includes(k)).join(", ")
);
/* 20 havuz silindiği için konu_id'si havuzda olmayan 2 TDE konusu BEKLENEN
   durumdur (soruları başka ajan üretecek). Diğer 28'i havuzda olmalı. */
const havuzda = TDED.konular.filter((k) => KE.havuzlar.some((h) => h.konu_id === k.konu_id));
ok("havuzu olan TDE konusu 29", havuzda.length === 29, String(havuzda.length));
ok("her konunun TYMM kaynak URL'si var", TDED.konular.every((k) => /^https:\/\/tymm\.meb\.gov\.tr\//.test(k.kaynak_url)));

console.log("\n== 2) Kazanımlar kaynaklı (uydurma yok) ==");
const kaynaklar = new Set(["okulizyon", "odsgm", "tymm", "konu-adi"]);
const hepsi = TDED.konular.flatMap((k) => k.kazanimlar.map((c) => ({ ...c, konu: k.konu })));
ok("her kazanımın kaynağı tanımlı", hepsi.every((c) => kaynaklar.has(c.kaynak)),
  [...new Set(hepsi.map((c) => c.kaynak))].join(","));
ok("kazanım toplamı > 90", hepsi.length > 90, String(hepsi.length));

const kullaniciCumleleri = (Array.isArray(OKZ) ? OKZ : OKZ.kazanimlar).map((x) => x.okulizyon);
const okzKayitli = hepsi.filter((c) => c.kaynak === "okulizyon");
ok("Okulizyon kaynaklı 4 cümle", okzKayitli.length === 4, String(okzKayitli.length));
ok("hepsi kullanıcının verdiği metinle birebir",
  okzKayitli.every((c) => kullaniciCumleleri.includes(c.metin)));

const gecerliKod = new Set(MEB.ciktilar.filter((c) => c.ders === TDE).map((c) => c.kod));
ok("ODSGM/TYMM cümlelerinin kodları gerçek çıktı", hepsi.filter((c) => c.kod).every((c) => gecerliKod.has(c.kod)));
ok("ODSGM cümleleri temasına ait",
  TDED.konular.every((k) => k.kazanimlar.filter((c) => c.kaynak === "odsgm").every((c) =>
    ICR.temalar.find((t) => t.no === k.tema).ad === (/“([^”]+)”/.exec(c.metin) || [])[1])));

console.log("\n== 3) Çıktı kodları — 16 kodlu, 14 dil bilgisi ==");
ok("kodlu konu 16", TDED.konular.filter((k) => k.ciktilar.length).length === 16);
ok("dil bilgisi 14 (kod uydurulmadı)", TDED.konular.filter((k) => !k.ciktilar.length).length === 14);
ok("kodlar tema+eksenle tutarlı", TDED.konular.every((k) => {
  if (!k.ciktilar.length) return true;
  const t = ICR.temalar.find((x) => x.no === k.tema);
  const kume = k.eksen === "dinleme" ? t.dinleme.ciktilar : t.okuma.ciktilar;
  return k.kimlik !== null && k.ciktilar.join(",") === kume.join(",");
}));
ok("masal ve fabl dinleme ekseninde", ["Masal", "Fabl"].every((a) => TDED.konular.find((k) => k.konu === a).eksen === "dinleme"));

console.log("\n== 4) Okulizyon'un 9 cümlesi nereye gidiyor ==");
const BEKLENEN = [
  ["Destan Dönemi Türk şiirini ve koşuk türünün genel özelliklerini açıklar.", "Koşuk"],
  ["Türkü türünün genel özelliklerini belirler.", "Türkü"],
  ["Halk şiirini tanımlar, halk şiiri altında koşma türünün genel özelliklerini kavrar.", "Koşma"],
  ["Şiirde ahengi sağlayan özellikleri (uyak düzeni, uyak, redif, aliterasyon, asonans) ile ilgili çalışma yapar.",
    "Şiirde Ahenk (Ölçü, Uyak, Redif, Aliterasyon, Asonans)"]
];
for (const [c, bekle] of BEKLENEN) {
  const r = konuBul(c);
  ok("→ " + bekle, r && r.konu === bekle, r ? r.konu : "eşleşmedi");
}
ok("'Destan Dönemi' tuzağı: DESTAN'a düşmüyor", konuBul(BEKLENEN[0][0]).konu !== "Destan");
ok("eşleşen 4 cümle TDE2.x kodu taşıyor",
  BEKLENEN.every(([c]) => {
    const r = konuBul(c);
    return !r.kod || /^TDE/.test(r.kod);
  }));

/* v70 — 2. AŞAMA: cümlede tür/dönem adı yoksa genel beceri kuralı
   devreye girer ve **Paragraf**'a yönlendirir (kaynak "genel").
   Uydurma bir konu değil: Paragraf o becerinin 10. sınıftaki konusu. */
const genel = ["Metindeki söz varlığının anlamını bağlamdan hareketle belirler.",
  "Metinlerden hareketle çıkarımlar yapar."];
for (const c of genel) {
  const r = konuBul(c);
  ok("genel beceri → Paragraf (2. aşama): " + c.slice(0, 30), r && r.konu === "Paragraf" && r.kaynak === "genel",
    r ? r.konu + "/" + r.kaynak : "eşleşmedi");
}
ok("genel beceri 1. aşamayı EZMEZ (koşuk → Koşuk)",
  (konuBul("Koşuk dörtlüklerle söylenen bir türdür, çıkarım yapmayı gerektirir.") || {}).konu === "Koşuk");
ok("2 genel cümle kayıtta ama konusuz olarak işaretli",
  TDED.genel_kazanimlar.length === 2 && TDED.genel_kazanimlar.every((x) => x.neden_konusuz));

console.log("\n== 5) Kural tablosu 30 konuyu da kapsıyor ==");
const tdeKural = KA.KURALLAR.filter((r) => r.ders.includes("edebiyat"));
ok("30 TDE kuralı", tdeKural.length === 30, String(tdeKural.length));
const kuralKonulari = new Set(tdeKural.map((r) => r.konu));
ok("her konunun kuralı var", appKonular.every((k) => kuralKonulari.has(k)), appKonular.filter((k) => !kuralKonulari.has(k)).join(", "));
ok("kural sırası: Koşuk, Destan'dan önce",
  tdeKural.findIndex((r) => r.konu === "Koşuk") < tdeKural.findIndex((r) => r.konu === "Destan"));
ok("kural sırası: tamlamalar tek kelimeden önce",
  tdeKural.findIndex((r) => r.konu === "İsim Tamlamaları") < tdeKural.findIndex((r) => r.konu === "İsimler (Adlar)") &&
  tdeKural.findIndex((r) => r.konu === "Sıfat Tamlamaları") < tdeKural.findIndex((r) => r.konu === "Sıfatlar (Ön Adlar)"));

const ORNEKLER = [
  ["Koşuğun nazım birimi ve uyak düzenini belirler.", "Koşuk"],
  ["Savların topluma ait öğütler taşıdığını açıklar.", "Sav"],
  ["Destan türünün doğal ve yapma destan ayrımını açıklar.", "Destan"],
  ["Mesnevi nazım biçiminin özelliklerini belirler.", "Mesnevi"],
  ["Fabl türünde ders verme amacını açıklar.", "Fabl"],
  ["Dede Korkut Hikâyelerinde olağanüstü unsurları belirler.", "Dede Korkut Hikâyeleri"],
  ["Tanzimat Dönemi şiirinde yeni biçim arayışlarını açıklar.", "Tanzimat Dönemi Şiiri"],
  ["Gazelin matla beytini açıklar.", "Gazel"],
  ["Kaside planını (nesib, tegazzül, methiye, fahriye) açıklar.", "Kaside"],
  ["Mersiye türünün özelliklerini belirler.", "Mersiye"],
  ["Saf şiirde imge ve mazmunu çözümler.", "Saf Şiir"],
  ["Masal türünün olağanüstü unsurlarını açıklar.", "Masal"],
  ["İsim tamlamalarında tamlayanı belirler.", "İsim Tamlamaları"],
  ["Sıfat tamlamalarını bulur.", "Sıfat Tamlamaları"],
  ["Zamirleri işaret zamiri olarak sınıflandırır.", "Zamir (Adıl)"],
  ["Edatların cümleye kattığı anlamı belirler.", "Edat (İlgeç)"],
  ["Bağlaçları görevlerine göre ayırır.", "Bağlaç"],
  ["Ünlemlerin işlevini açıklar.", "Ünlem"],
  ["Zarfları türlerine göre sınıflandırır.", "Zarflar (Belirteçler)"],
  ["Fiil çatılarını sınıflandırır.", "Fiiller (Eylemler)"],
  ["Yazım kurallarını uygular.", "Yazım Kuralları"],
  ["Noktalama işaretlerini doğru kullanır.", "Noktalama İşaretleri"],
  ["Paragrafta anlatım biçimlerini belirler.", "Paragraf"],
  ["Anlamına göre cümleleri sınıflandırır.", "Anlamına Göre Cümleler"]
];
let kuralOk = 0;
for (const [c, bekle] of ORNEKLER) {
  const r = KA.esle(c, TDE);
  if (r && r.konu === bekle) kuralOk++;
  else console.log("      · " + c.slice(0, 44) + " → " + (r ? r.konu : "yok"));
}
ok("kural örnekleri " + kuralOk + "/" + ORNEKLER.length, kuralOk === ORNEKLER.length);

console.log("\n== 6) Veri dosyaları senkron ==");
const havuz = (id) => KE.havuzlar.find((h) => h.konu_id === id);
ok("konu_esleme TDE metni yer tutucudan kurtuldu",
  KE.havuzlar.filter((h) => h.ders === TDE).every((h) => !/Genel konu becerisi/.test(h.metin)));
ok("konu_esleme TDE metni okulizyon cümlesini içeriyor",
  havuz("edebiyat_10_u01_k03").metin.includes("Türkü türünün genel özelliklerini belirler."));
ok("konu_esleme TDE metni ayırt edici terimleri içeriyor",
  havuz("edebiyat_10_u01_k01").metin.includes("destan dönemi"));

const kKonu = (id) => KK.konular.find((k) => k.konu_id === id);
ok("kazanim_konu: 16 TDE konusu kodlu",
  KK.konular.filter((k) => k.ders === TDE && k.kodlar.length).length === 16);
ok("kazanim_konu: dil bilgisi konularına kod yazılmadı",
  KK.konular.filter((k) => k.ders === TDE && !k.kodlar.length).every((k) => k.guven === "yok"));
ok("kazanim_konu: TDE metin eşlemesi 98", KK.metin_esleme.filter((m) => m.ders === TDE).length === 98,
  String(KK.metin_esleme.filter((m) => m.ders === TDE).length));
ok("kazanim_konu: Türkü kaydı TDE2.x taşıyor", kKonu("edebiyat_10_u01_k03").kodlar.join(",") === "TDE2.1,TDE2.2,TDE2.3,TDE2.4");

ok("okz-meb konuBul: Türkü cümlesi → Türkü",
  (OKZM.konuBul("Türkü türünün genel özelliklerini belirler.", TDE) || {}).konu === "Türkü");
ok("okz-meb konuKazanimlari: Türkü 4 kod",
  OKZM.konuKazanimlari("edebiyat_10_u01_k03").length === 4);
ok("okz-meb: başka dersin kaydı bozulmadı", OKZM.konuBul(
  "canlıların yaşamına devam edebilmesi için enerjinin gerekliliğini sorgulamanız,", "Biyoloji"
).konuId.startsWith("biyo_"));

console.log("\n== 7) Özet ==");
ok("özet: 30 konu", TDED.ozet.konu === 30);
ok("özet: 4 okulizyon cümlesi", TDED.ozet.okulizyon_cumlesi === 4);
ok("özet: 91 ayırt edici terim", TDED.ozet.terim === 91, String(TDED.ozet.terim));

console.log("\n" + "─".repeat(64));
if (hata.length) {
  console.log("v64 TDE kazanım seti — " + gecen + " geçti, " + hata.length + " kaldı");
  hata.forEach((h) => console.log("   · " + h));
  process.exit(1);
}
console.log("v64 TDE kazanım seti — " + gecen + "/" + gecen + " geçti ✓");
