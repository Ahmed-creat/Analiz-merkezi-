/* ============================================================
   MEB KAZANIM KATMANI TESTLERİ
   ------------------------------------------------------------
   Neyi doğrular?
     1) Resmî tablo bütünlüğü: 9 ders / 158 çıktı, kod biçimi,
        ders başına resmî çıktı sayıları (MEB 2026).
     2) Eşleme dosyası tutarlılığı: her kod resmî tabloda var,
        her konu_id gerçek bir havuzda var, ders karışmıyor.
     3) Çalışma zamanı: OKZM.ciktiBul resmî cümlenin kodunu bulur;
        OKZM.konuBul havuz kazanım metnini doğru konuya bağlar;
        tanınmayan cümlede UYDURMAZ (null döner).
   Çalıştır: node tests/meb-kazanim.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const RESMI = require(path.join(KOK, "site/content/mufredat/meb_kazanim_10.json"));
const ESL = require(path.join(KOK, "site/content/mufredat/kazanim_konu_10.json"));
const OKZM = require(path.join(KOK, "site/okz-meb.js"));

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false;
}
function esit(ad, g, b) { return ok(ad, g === b, "gelen: " + JSON.stringify(g) + " · beklenen: " + JSON.stringify(b)); }

// MEB 2026 10. sınıf resmî çıktı sayıları (kaynak: mufredat.meb.gov.tr PDF'leri)
const RESMI_SAYI = {
  "Biyoloji": 19, "Coğrafya": 18, "Din Kültürü": 17, "Felsefe": 10, "Fizik": 22,
  "Kimya": 21, "Matematik": 21, "Tarih": 14, "Türk Dili ve Edebiyatı": 16
};

// ---------- 1) Resmî tablo ----------
console.log("\n== 1) Resmî MEB tablosu ==");
const ciktilar = RESMI.ciktilar || [];
esit("çıktı sayısı 158", ciktilar.length, 158);
esit("ders sayısı 9", new Set(ciktilar.map(c => c.ders)).size, 9);
for (const [ders, n] of Object.entries(RESMI_SAYI)) {
  esit(ders + " çıktı sayısı", ciktilar.filter(c => c.ders === ders).length, n);
}
ok("her çıktıda kod var", ciktilar.every(c => c.kod && String(c.kod).trim()));
ok("her çıktıda kazanım cümlesi var", ciktilar.every(c => c.kazanim && String(c.kazanim).trim().length > 5));
ok("her çıktıda tema numarası var", ciktilar.every(c => Number.isInteger(c.tema) && c.tema >= 1));
const kodlar = ciktilar.map(c => c.kod);
esit("kod tekrarı yok", new Set(kodlar).size, kodlar.length);
// TDE programı beceri eksenli ayrı kod düzeni kullanır (TDE1.1 … TDE4.4).
const kodBicim = k => /^[A-ZĞÜŞİÖÇ]+\d*\.\d+\.\d+\.\d+$/.test(k) || /^TDE\d+\.\d+$/.test(k);
ok("kod biçimi DERS.SINIF.TEMA.ÇIKTI", kodlar.every(kodBicim),
  kodlar.filter(k => !kodBicim(k)).slice(0, 4).join(","));
ok("10. sınıf kodu sınıf alanıyla uyumlu",
  ciktilar.filter(c => /^[A-ZĞÜŞİÖÇ]+\.(\d+)\./.test(c.kod)).every(c => Number(RegExp.$1) === c.sinif));
ok("her dersin kaynağı var", Object.keys(RESMI_SAYI).every(d => RESMI.kaynaklar && RESMI.kaynaklar[d] && RESMI.kaynaklar[d].pdf));
ok("Biyoloji kaynağı MEB PDF", /mufredat\.meb\.gov\.tr/.test(RESMI.kaynaklar["Biyoloji"].pdf));

// ---------- 2) Eşleme dosyası ----------
console.log("\n== 2) Konu eşleme dosyası ==");
const konular = ESL.konular || [];
esit("havuz sayısı 172", konular.length, 172);
const kodKumesi = new Set(kodlar);
const bozukKod = konular.flatMap(k => (k.kodlar || []).filter(kod => !kodKumesi.has(kod)).map(kod => k.konu_id + ":" + kod));
ok("her eşlenen kod resmî tabloda var", bozukKod.length === 0, bozukKod.slice(0, 4).join(","));

const havuzDosyalari = fs.readdirSync(path.join(KOK, "site/content/soru_havuzlari"))
  .filter(a => a.endsWith(".json") && a !== "index.json");
const konuIdKumesi = new Set(havuzDosyalari.map(a => a.replace(/\.json$/, "")));
const bozukKonu = konular.filter(k => !konuIdKumesi.has(k.konu_id)).map(k => k.konu_id);
ok("her konu_id gerçek bir havuz", bozukKonu.length === 0, bozukKonu.slice(0, 4).join(","));

const dersKarismasi = konular.flatMap(k => (k.kodlar || [])
  .filter(kod => !kod.startsWith({ "Biyoloji": "BİY", "Coğrafya": "COĞ", "Din Kültürü": "DKAB", "Felsefe": "FEL", "Fizik": "FİZ", "Kimya": "KİM", "Matematik": "MAT", "Tarih": "TAR", "Türk Dili ve Edebiyatı": "TDE" }[k.ders] || "@@"))
  .map(kod => k.konu_id + ":" + kod));
ok("ders dışı kod yok", dersKarismasi.length === 0, dersKarismasi.slice(0, 4).join(","));

const guvenler = new Set(konular.map(k => k.guven));
ok("güven değerleri tanımlı", Array.from(guvenler).every(g => ["kesin", "yapisal", "orta", "yok"].includes(g)), Array.from(guvenler).join(","));
ok("'yok' kayıtlarında kod yok", konular.filter(k => k.guven === "yok").every(k => (k.kodlar || []).length === 0));
ok("'kesin' kayıtlarda kod var", konular.filter(k => k.guven === "kesin").every(k => (k.kodlar || []).length > 0));

// Regresyon tabanı: otomatik eşleşen konu sayısı düşmemeli
const TABAN = { "Biyoloji": 11, "Coğrafya": 5, "Fizik": 9, "Kimya": 14, "Matematik": 18, "Tarih": 10 };
for (const [ders, n] of Object.entries(TABAN)) {
  const kesin = konular.filter(k => k.ders === ders && k.guven === "kesin").length;
  ok(ders + " kesin eşleşme tabanı (≥" + n + ")", kesin >= n, "gelen: " + kesin);
}
ok("Din Kültürü'nde zorlama eşleme yok",
  konular.filter(k => k.ders === "Din Kültürü").every(k => (k.kodlar || []).length === 0));
ok("TDE'de zorlama eşleme yok",
  konular.filter(k => k.ders === "Türk Dili ve Edebiyatı").every(k => (k.kodlar || []).length === 0));

// ---------- 3) Çalışma zamanı ----------
console.log("\n== 3) OKZM çalışma zamanı ==");
esit("modül sürümü veri sürümüyle aynı", OKZM.surum, RESMI.surum);
esit("modüldeki çıktı sayısı", OKZM.ciktiSayisi, ciktilar.length);
esit("modüldeki ders sayısı", OKZM.dersler.length, 9);

// TDE'de aynı beceri cümlesi birden çok kodda geçer (TDE1.2 = TDE2.2);
// bu yüzden kod değil CÜMLE karşılaştırılır.
let ciktiHatasi = [];
for (const c of ciktilar) {
  const r = OKZM.ciktiBul(c.kazanim, c.ders);
  if (!r) { ciktiHatasi.push(c.kod + "→null"); continue; }
  if (r.kazanim !== c.kazanim) ciktiHatasi.push(c.kod + "→" + r.kod);
}
ok("resmî cümlenin kodu bulunuyor (158/158)", ciktiHatasi.length === 0, ciktiHatasi.slice(0, 5).join(","));

const metinler = ESL.metin_esleme || [];
ok("kazanım metni eşlemesi dolu", metinler.length >= 100, "gelen: " + metinler.length);
let konuHatasi = [];
for (const e of metinler) {
  const r = OKZM.konuBul(e.metin, e.ders);
  if (e.konu_guven === "coklu") {
    if (r && r.konuId) konuHatasi.push("coklu-konu-yazildi:" + e.metin.slice(0, 30));
    continue;
  }
  if (!r || r.konuId !== e.konu_id) konuHatasi.push(e.konu_id + (r ? "→" + r.konuId : "→null"));
}
ok("havuz kazanım metni doğru konuya gidiyor", konuHatasi.length === 0, konuHatasi.slice(0, 5).join(","));

// Uydurma yok: tanınmayan cümle null döner
esit("tanınmayan kazanım → ciktiBul null", OKZM.ciktiBul("Kuantum dolanıklık deneyi tasarlar.", "Fizik"), null);
esit("tanınmayan kazanım → konuBul null", OKZM.konuBul("Kuantum dolanıklık deneyi tasarlar.", "Fizik"), null);
esit("boş metin → null", OKZM.konuBul("", "Biyoloji"), null);
esit("ders uyuşmazsa null", OKZM.konuBul("kemosentez hakkında bilgi toplamanız,", "Fizik"), null);

// Örnek uçtan uca
const ornek = OKZM.konuBul("fotosentez reaksiyonlarıyla ilgili bilimsel model oluşturmanız,", "Biyoloji");
esit("örnek: fotosentez modeli → biyo_10_u01_k02", ornek && ornek.konuId, "biyo_10_u01_k02");
ok("örnek: MEB kodu BİY.10.1.2", ornek && (ornek.kodlar || []).includes("BİY.10.1.2"), JSON.stringify(ornek && ornek.kodlar));
ok("örnek: topicKey dolu", !!(ornek && ornek.topicKey));
esit("konuKazanimlari kod döndürür", (OKZM.konuKazanimlari("biyo_10_u01_k01") || []).map(x => x.kod).join(","), "BİY.10.1.1");

// ---------- 4) Entegrasyon izleri ----------
console.log("\n== 4) Uygulama entegrasyonu ==");
const HTML = fs.readFileSync(path.join(KOK, "site/index.html"), "utf8");
const APP = fs.readFileSync(path.join(KOK, "site/app-pwa.js"), "utf8");
const SW = fs.readFileSync(path.join(KOK, "site/sw.js"), "utf8");
ok("index.html okz-meb.js yüklüyor", HTML.indexOf('<script src="okz-meb.js"></script>') > 0);
ok("service worker okz-meb.js önbelleğe alıyor", SW.indexOf('"./okz-meb.js"') > 0);
ok("okzKonuBul MEB katmanını çağırıyor", APP.indexOf("MEBM.konuBul(") > 0);
ok("MEB katmanı korumalı (OKZM yoksa çalışmaz)", APP.indexOf("typeof MEBM.konuBul === \"function\"") > 0);

// ---------- Özet ----------
console.log("");
if (kalan) {
  console.log("KALAN " + kalan + " test:");
  for (const h of hatalar) console.log("  ✗ " + h);
  process.exit(1);
}
console.log("TÜM TESTLER GEÇTİ (" + gecen + "/" + gecen + ")");
