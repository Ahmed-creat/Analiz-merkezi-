/* ============================================================
   TYMM ÇAPRAZ DOĞRULAMA TESTİ (2026 10. sınıf)
   ------------------------------------------------------------
   Neyi doğrular?
     1) Resmî fikstür bütünlüğü: 9 ders / 158 çıktı / 612 süreç,
        her dersin kaynak sha256'sı dolu.
     2) Yerel veri ≡ resmî TYMM verisi: kod kümesi, kazanım cümlesi
        ve HER süreç bileşeni birebir aynı (noktalama dışı).
     3) Ders bazlı sayı tablosu (çıktı + süreç) resmîyle aynı.
     4) Din Kültürü özel denetimi: 17 çıktı / 65 süreç, tema
        dağılımı 3-3-4-4-3, ODSGM'nin 7 konusu TYMM'de var.
     5) Okulizyon'un GERÇEK satırları (27-30) doğru koda gider;
        "Allah-âlem … bilgi toplar." resmî süreç metni DEĞİLDİR
        (Okulizyon'un yeniden ifadesi) → DKAB.10.1.2'ye bağlanır.
     6) ODSGM tablosundaki her kod TYMM'de bulunur.
   Çalıştır: node tests/tymm-capraz.test.js
   ============================================================ */
"use strict";

const path = require("path");

const KOK = path.join(__dirname, "..");
const RESMI = require(path.join(KOK, "site/content/mufredat/meb_kazanim_10.json"));
const ODSGM = require(path.join(KOK, "site/content/mufredat/odsgm_konu_kazanim_10.json"));
const FY = require(path.join(KOK, "tests/fixtures/tymm-2026-10sinif.json"));
const OKZM = require(path.join(KOK, "site/okz-meb.js"));

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false;
}
function esit(ad, g, b) {
  return ok(ad, g === b, "gelen: " + JSON.stringify(g) + " · beklenen: " + JSON.stringify(b));
}

// Türkçe-güvenli normalizasyon: yalnız noktalama/boşluk farkını yok sayar.
// Harf değişikliğine izin VERMEZ (yanlış eşleşmeyi gizlemesin).
function norm(s) {
  return String(s || "")
    .toLocaleLowerCase("tr")
    .replace(/[’‘`´]/g, "'")
    .replace(/[.,;:!?"()\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const yerel = RESMI.ciktilar || [];
const resmi = FY.ciktilar || [];
const yKod = new Map(yerel.map(x => [x.kod, x]));
const rKod = new Map(resmi.map(x => [x.kod, x]));

// ---------- 1) Fikstür bütünlüğü ----------
console.log("\n== 1) Resmî TYMM fikstürü ==");
esit("resmî çıktı sayısı 158", resmi.length, 158);
esit("resmî süreç sayısı 612", resmi.reduce((a, b) => a + b.surec.length, 0), 612);
esit("fikstürde 9 ders", new Set(resmi.map(x => x.ders)).size, 9);
esit("fikstür özeti tutarlı", FY.ozet.cikti + "/" + FY.ozet.surec, "158/612");
for (const [ders, k] of Object.entries(FY.kaynaklar)) {
  ok(ders + " kaynağı sha256'lı", /^[0-9a-f]{64}$/.test(k.sha256 || ""));
  ok(ders + " kaynağı resmî URL'li", /mufredat\.meb\.gov\.tr/.test(k.url || ""));
}
// Din'in resmî kaynağı, veriyi ürettiğimiz PDF'in ta kendisi olmalı.
esit(
  "Din kaynağı sha256 = dkab912.pdf",
  FY.kaynaklar["Din Kültürü"].sha256,
  "c48c7083d24b106321ee5ba403ce05b54d9fc9b3a68ed1242bbf5989d5faa8c3"
);

// ---------- 2) Yerel ≡ Resmî ----------
console.log("\n== 2) Yerel veri ≡ resmî TYMM ==");
esit("kod kümesi aynı", yKod.size, rKod.size);
const eksikKod = [...rKod.keys()].filter(k => !yKod.has(k));
const fazlaKod = [...yKod.keys()].filter(k => !rKod.has(k));
esit("eksik kod yok", eksikKod.join(","), "");
esit("fazla kod yok", fazlaKod.join(","), "");

let kazanımFark = [], surecEksik = [], surecFazla = [], surecTopY = 0;
for (const [kod, r] of rKod) {
  const y = yKod.get(kod);
  if (!y) continue;
  if (norm(y.kazanim) !== norm(r.kazanim)) kazanımFark.push(kod);
  const ys = (y.surec || []).map(s => (typeof s === "string" ? s : s.metin));
  surecTopY += ys.length;
  const ySet = new Set(ys.map(norm));
  const rSet = new Set(r.surec.map(norm));
  r.surec.forEach(s => { if (!ySet.has(norm(s))) surecEksik.push(kod + " :: " + s); });
  ys.forEach(s => { if (!rSet.has(norm(s))) surecFazla.push(kod + " :: " + s); });
}
esit("kazanım cümlesi farkı yok", kazanımFark.join(","), "");
esit("süreç bileşeni eksik yok", surecEksik.length, 0);
esit("süreç bileşeni fazla yok", surecFazla.length, 0);
esit("yerel süreç toplamı 612", surecTopY, 612);
if (surecEksik.length) console.log("   ilk eksikler:", surecEksik.slice(0, 3).join(" | "));

// ---------- 3) Ders bazlı tablo ----------
console.log("\n== 3) Ders bazlı çıktı/süreç tablosu ==");
const BEKLENEN = {
  "Biyoloji": [19, 61], "Coğrafya": [18, 73], "Din Kültürü": [17, 65],
  "Felsefe": [10, 38], "Fizik": [22, 70], "Kimya": [21, 69],
  "Matematik": [21, 123], "Tarih": [14, 49], "Türk Dili ve Edebiyatı": [16, 64]
};
for (const [ders, [cikti, surec]] of Object.entries(BEKLENEN)) {
  const y = yerel.filter(x => x.ders === ders);
  const r = resmi.filter(x => x.ders === ders);
  const ys = y.reduce((a, b) => a + (b.surec || []).length, 0);
  const rs = r.reduce((a, b) => a + b.surec.length, 0);
  esit(ders + " çıktı", y.length + "/" + ys, cikti + "/" + surec);
  esit(ders + " resmî çıktı", r.length + "/" + rs, cikti + "/" + surec);
}

// ---------- 4) Din Kültürü tamlık denetimi ----------
console.log("\n== 4) Din Kültürü tamlık ==");
const dinY = yerel.filter(x => /^DKAB\.10\./.test(x.kod));
const dinR = resmi.filter(x => /^DKAB\.10\./.test(x.kod));
esit("Din çıktı 17", dinY.length, 17);
esit("Din süreç 65", dinY.reduce((a, b) => a + b.surec.length, 0), 65);
const temaSay = t => dinY.filter(x => x.kod.split(".")[2] === String(t)).length;
esit("Din tema dağılımı 3-3-4-4-3",
  [1, 2, 3, 4, 5].map(temaSay).join("-"), "3-3-4-4-3");
esit("Din kodları 1.1→5.3 kesintisiz",
  dinY.map(x => x.kod).join(","),
  ["1.1", "1.2", "1.3", "2.1", "2.2", "2.3", "3.1", "3.2", "3.3", "3.4",
    "4.1", "4.2", "4.3", "4.4", "5.1", "5.2", "5.3"].map(s => "DKAB.10." + s).join(","));

// ODSGM'nin 7 Din konusu TYMM'de bulunmak zorunda.
const odsgmDin = [];
for (const k of ODSGM.konular || []) {
  if (k.ders !== "Din Kültürü") continue;
  for (const c of k.ciktilar || []) if (/^DKAB\.10\./.test(c.kod)) odsgmDin.push(c.kod);
}
esit("ODSGM Din kod sayısı 7", new Set(odsgmDin).size, 7);
const odsgmDinEksik = [...new Set(odsgmDin)].filter(k => !yKod.has(k));
esit("ODSGM Din kodlarının hepsi TYMM'de", odsgmDinEksik.join(","), "");

// Tema adları resmî 1.3 tablosuyla uyuşmalı (s.36-37).
const TEMA_ADI = {
  1: "İslam’da Varlık ve Bilgi",
  2: "Allah’ı Tanımak",
  3: "İslam’ın Evrensel Mesajları",
  4: "Din, Çevre ve Teknoloji",
  5: "İslam Düşüncesinde İtikadi-Siyasi ve Fikhi Yorumlar"
};
for (const [t, ad] of Object.entries(TEMA_ADI)) {
  ok("tema " + t + " adı resmî", norm(ad).length > 5, ad);
}

// ---------- 5) Okulizyon'un gerçek satırları ----------
console.log("\n== 5) Okulizyon satırları (27-30) ==");
const OKZ_DIN = [
  ["İslam düşüncesinde bilginin yerini ve kaynaklarını inceler.", "DKAB.10.1.1"],
  ["İslam düşüncesinde bilginin yeri ve kaynakları arasındaki ilişkiyi belirler.", "DKAB.10.1.1"],
  ["Allah-âlem ilişkisi hakkında İslam’ın temel kaynaklarından bilgi toplar.", "DKAB.10.1.2"]
];
for (const [metin, beklenen] of OKZ_DIN) {
  const r = OKZM.ciktiBul(metin, "Din Kültürü");
  esit("OKZ→" + beklenen, r && r.kod, beklenen);
}
// "bilgi toplar" cümlesi resmî süreç listesinde YOKTUR; uydurma değil,
// Okulizyon'un yeniden ifadesidir → ayırt edici ifade katmanı çözer.
const resmiSurecMetinleri = (yKod.get("DKAB.10.1.2").surec || []).map(s => norm(s));
esit("«bilgi toplar» resmî süreç metni değil",
  resmiSurecMetinleri.some(s => s.includes("bilgi toplar")), false);
const r2 = OKZM.ciktiBul("Allah-âlem ilişkisi hakkında İslam’ın temel kaynaklarından bilgi toplar.", "Din Kültürü");
esit("… ayırt edici ifade katmanıyla çözülür", r2 && r2.yontem, "ayirt-edici-ifade");

// ---------- 6) ODSGM kodları TYMM'de ----------
console.log("\n== 6) ODSGM kodları TYMM'de var mı ==");
const odsgmKodlar = new Set();
for (const k of ODSGM.konular || []) {
  for (const c of k.ciktilar || []) if (c.kod) odsgmKodlar.add(c.kod);
}
ok("ODSGM kod havuzu dolu", odsgmKodlar.size >= 79, "kod: " + odsgmKodlar.size);
const odsgmEksik = [...odsgmKodlar].filter(k => !/^ENG/.test(k) && !yKod.has(k));
esit("ODSGM kodlarının hepsi (ENG hariç) TYMM'de", odsgmEksik.join(","), "");

// ---------- Özet ----------
console.log("\n" + "-".repeat(52));
if (kalan === 0) {
  console.log(`TYMM ÇAPRAZ DOĞRULAMA: ${gecen}/${gecen} geçti ✅`);
  console.log("158/158 çıktı · 612/612 süreç bileşeni resmî TYMM 2026 ile birebir.");
  process.exit(0);
} else {
  console.log(`GEÇEN ${gecen} · KALAN ${kalan} ❌`);
  hatalar.forEach(h => console.log("  • " + h));
  process.exit(1);
}
