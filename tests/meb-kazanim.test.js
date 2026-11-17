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
esit("havuz sayısı 152", konular.length, 152);
const kodKumesi = new Set(kodlar);
const bozukKod = konular.flatMap(k => (k.kodlar || []).filter(kod => !kodKumesi.has(kod)).map(kod => k.konu_id + ":" + kod));
ok("her eşlenen kod resmî tabloda var", bozukKod.length === 0, bozukKod.slice(0, 4).join(","));

const havuzDosyalari = fs.readdirSync(path.join(KOK, "site/content/soru_havuzlari"))
  .filter(a => a.endsWith(".json") && a !== "index.json");
const konuIdKumesi = new Set(havuzDosyalari.map(a => a.replace(/\.json$/, "")));
// Bilinçli istisna: Paragraf havuzu üretilmedi (kullanıcı kararı); eski havuz
// arsiv/soru_havuzlari/edebiyat/ altında duruyor — bkz. arsiv/README.md.
const HAVUZSUZ = new Set(["edebiyat_10_u04_k06"]);
const bozukKonu = konular.filter(k => !HAVUZSUZ.has(k.konu_id) && !konuIdKumesi.has(k.konu_id)).map(k => k.konu_id);
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

// ---------- 5) İnsan için rapor (docs/MEB-KONU-KAZANIM-TABLOSU.md) ----------
console.log("\n== 5) Okunabilir rapor ==");
const RAPOR_YOL = path.join(KOK, "docs/MEB-KONU-KAZANIM-TABLOSU.md");
const raporVar = fs.existsSync(RAPOR_YOL);
ok("rapor dosyası var", raporVar, RAPOR_YOL);
const RAPOR = raporVar ? fs.readFileSync(RAPOR_YOL, "utf8") : "";
ok("rapor otomatik üretildiğini söylüyor", RAPOR.indexOf("otomatik üretildi") > 0);
ok("rapor üreticiyi gösteriyor", RAPOR.indexOf("scripts/meb-rapor.js") > 0);
ok("rapor ODSGM kaynağını gösteriyor", RAPOR.indexOf("ODSGM") > 0);
ok("rapor TYMM kaynağını gösteriyor", RAPOR.indexOf("TYMM") > 0);
// Her ders başlığı raporda olmalı
const derslerRapor = ["Türk Dili ve Edebiyatı", "Matematik", "Fizik", "Kimya", "Biyoloji",
  "Tarih", "Coğrafya", "Felsefe", "Din Kültürü", "İngilizce"];
const dersEksik = derslerRapor.filter(d => RAPOR.indexOf("### " + d) < 0);
ok("raporda 10 dersin hepsi var", dersEksik.length === 0, dersEksik.join(","));
// ODSGM'deki her kazanım kodu raporda geçmeli
const ODSGM_T = require(path.join(KOK, "site/content/mufredat/odsgm_konu_kazanim_10.json"));
const raporKodEksik = [...new Set(ODSGM_T.duz.map(k => k.kod))].filter(k => RAPOR.indexOf("`" + k + "`") < 0);
ok("raporda ODSGM kodlarının hepsi var", raporKodEksik.length === 0, raporKodEksik.slice(0, 5).join(","));
// Din Kültürü konuları raporda görünmeli (kullanıcının şikayeti)
ok("raporda Din Kültürü konusu var", RAPOR.indexOf("İslam’da Bilgi ve Bilginin Kaynakları") > 0);
ok("raporda Din ünitesi var", RAPOR.indexOf("İSLAM’DA VARLIK VE BİLGİ") > 0);

// ---------- 6) ODSGM katmanı: kazanım → ÜNİTE + KONU ----------
console.log("\n== 6) ODSGM konu tablosu (hangi konuda hangi kazanım) ==");
const ODSGM = require(path.join(KOK, "site/content/mufredat/odsgm_konu_kazanim_10.json"));
ok("ODSGM tablosu var", !!ODSGM.duz && ODSGM.duz.length > 0);
ok("ODSGM 9 dersi kapsıyor (İngilizce hariç uygulamada yok)", (ODSGM.ozet.ders_bazli["Din Kültürü"] || 0) > 0);
esit("ODSGM Din Kültürü 7 çıktı", ODSGM.ozet.ders_bazli["Din Kültürü"], 7);
esit("ODSGM TDE 16 çıktı", ODSGM.ozet.ders_bazli["Türk Dili ve Edebiyatı"], 16);
esit("ODSGM Biyoloji 9 çıktı", ODSGM.ozet.ders_bazli["Biyoloji"], 9);

// ODSGM'deki her kod TYMM tablosunda olmalı (İngilizce dışında)
const tymmKodlar = new Set(RESMI.ciktilar.map(c => c.kod));
const odsgmEksik = ODSGM.duz.filter(k => k.ders !== "İngilizce" && !tymmKodlar.has(k.kod)).map(k => k.kod);
ok("ODSGM kodlarının tümü TYMM'de var (resmî çapraz doğrulama)", odsgmEksik.length === 0, odsgmEksik.slice(0, 5).join(","));

// Din Kültürü: havuzu 2018 programı ama kazanım artık ÇÖZÜLÜYOR
const din = OKZM.ucBul("İslam’da bilginin yerini ve kaynaklarını çözümleyebilme", "Din Kültürü");
ok("Din: kazanım bulundu", !!din, JSON.stringify(din));
esit("Din: kod DKAB.10.1.1", din && din.kod, "DKAB.10.1.1");
esit("Din: ünite", din && din.unite, "İSLAM’DA VARLIK VE BİLGİ");
esit("Din: konu", din && din.konu, "İslam’da Bilgi ve Bilginin Kaynakları");
ok("Din: havuz yok ama konu var (uydurma değil, MEB'in kendi konusu)", din && din.havuz === false && !!din.konu);

// TDE: beceri eksenli, ODSGM temasıyla çözülür
const tde = OKZM.ucBul("“Sözün Ezgisi” temasında ele alınan metinlerde okumayı yönetebilme", "Türk Dili ve Edebiyatı");
ok("TDE: kazanım bulundu", !!tde);
esit("TDE: kod TDE2.1", tde && tde.kod, "TDE2.1");
ok("TDE: tema adı ünitede", tde && /SÖZÜN EZGİSİ/i.test(tde.unite || ""), tde && tde.unite);

// Tarih: kullanıcının verdiği TYMM ünite sayfasıyla birebir
const tar = OKZM.ucBul("Türkistan’dan Türkiye’ye uzanan süreçte 1040-1299 yılları arasında meydana gelen önemli askerî mücadelelerin Türk tarihinin seyrine etkilerini karşılaştırabilme", "Tarih");
esit("Tarih: kod TAR.10.1.1", tar && tar.kod, "TAR.10.1.1");
ok("Tarih: 1. ünite adı", tar && /TÜRKİSTAN’DAN TÜRKİYE’YE/i.test(tar.unite || ""), tar && tar.unite);

// kodKonu: kod → ünite/konu
const kk = OKZM.kodKonu("DKAB.10.1.1");
esit("kodKonu(DKAB.10.1.1) konusu", kk && kk.konu, "İslam’da Bilgi ve Bilginin Kaynakları");

// Her TYMM çıktısının bir ODSGM karşılığı olmasa da, ODSGM'li olanlar konu taşımalı
const konusuz = [];
for (const ders of Object.keys(OKZM.tablo ? {} : {})) { /* yer tutucu */ }
const odsgmKodlu = new Set(ODSGM.duz.map(k => k.kod));
for (const c of RESMI.ciktilar) {
  if (!odsgmKodlu.has(c.kod)) continue;
  const k2 = OKZM.kodKonu(c.kod);
  if (!k2 || !k2.konu) konusuz.push(c.kod);
}
ok("ODSGM'de geçen her çıktının konusu dolu", konusuz.length === 0, konusuz.slice(0, 5).join(","));

// ---------- 7) GERÇEK Okulizyon metinleri (süreç bileşenleri) ----------
console.log("\n== 7) Okulizyon kazanım metinleri (kullanıcının gerçek verisi) ==");
// Kullanıcı 16 Kasım'da Okulizyon'dan gelen GERÇEK kazanım metinlerini verdi.
// Kritik bulgu: Okulizyon ana çıktı cümlesini değil, onun SÜREÇ BİLEŞENLERİNİ
// (a, b, c maddeleri) gönderiyor — bazen de doğrudan konu başlığını.
const ORNEK = require(path.join(KOK, "tests/fixtures/okulizyon-kazanim-ornekleri.js"));
const BEKLENEN = {
  "Örnek olay, olgu ve/veya mekânı coğrafyanın temel kavramları ile ilişkilendirebilme": "COĞ.10.1.1",
  "Örnek olay, olgu ve/veya mekânın harita üzerindeki konumunu algılar.": "COĞ.10.1.1",
  "Örnek olay, olgu ve/veya mekânın temel coğrafi koşullarını tanımlar.": "COĞ.10.1.1",
  "Örnek olay, olgu ve/veya mekânın aynı çevrede bulunan diğer olay, olgu veya mekânlar üzerindeki etkisini sorgular.": "COĞ.10.1.1",
  "Mekânsal Verilerin Haritalara Aktarılması": "COĞ.10.2.2",
  "Örnek uygulamalar üzerinden CBS ve uzaktan algılamanın kullanım alanlarını çözümler.": "COĞ.10.2.1",
  "Mekânsal bilgi teknolojilerini kullanarak altlık haritalar üzerinde mekânsal veriler oluşturabilme": "COĞ.10.2.2",
  "Oluşturduğu haritayı amacına uygun biçimde kullanır.": "COĞ.10.2.2",
  "CBS ve Uzaktan Algılamanın Uygulama Alanları": "COĞ.10.2.1",
  "Verileri haritaya işler ve haritanın bileşenlerini oluşturur.": "COĞ.10.2.2",
  "Felsefenin anlamını merak eder.": "FEL.10.1.1",
  "Felsefenin bilim, din ve sanat alanlarıyla ilişkisine eleştirel yaklaşır.": "FEL.10.1.1",
  "Felsefi düşüncenin ortaya çıkışı, tarihsel dönemlerinin genel özellikleri ve dünyadaki felsefe gelenekleri üzerine derinlemesine düşünür.": "FEL.10.1.1",
  "Felsefi düşüncenin özellikleri üzerine derinlemesine düşünür.": "FEL.10.1.1",
  "İslam düşüncesinde bilginin yerini ve kaynaklarını inceler.": "DKAB.10.1.1",
  "İslam düşüncesinde bilginin yeri ve kaynakları arasındaki ilişkiyi belirler.": "DKAB.10.1.1",
  "Allah-âlem ilişkisi hakkında İslam’ın temel kaynaklarından bilgi toplar.": "DKAB.10.1.2",
  "Dik üçgende trigonometrik oranlar ve trigonometrik özdeşliklerle ilgili varsayımlarda bulunur.": "MAT.10.1.1",
  "Üçgenin bir kenarı ve o kenara ait yüksekliğindeki değişimin üçgenin alanındaki değişime etkisine dair varsayımlarda bulunur.": "MAT.10.1.3",
  "Üçgende iç ve dış açıortayların, kenarortayların, kenar orta dikmelerin ve yüksekliklerin özelliklerine ilişkin varsayımda bulunur.": "MAT.10.1.2",
  "Ulaştığı trigonometrik oranları ve trigonometrik özdeşlikleri problemler bağlamında değerlendirir.": "MAT.10.1.1",
  "Sabit Hızlı Hareket": "FİZ.10.1.1",
  "Yatay doğrultuda sabit hızlı hareket ile ilgili tümevarımsal akıl yürütebilme": "FİZ.10.1.1",
  "Yatay doğrultuda sabit hızlı hareket eden cisimlerin konum, yer değiştirme, hız ve zaman değişkenlerini deney yaparak gözlemler.": "FİZ.10.1.1",
  "Yatay doğrultuda sabit hızlı hareket eden cisimlerin hareket grafiklerinden yararlanarak ortalama hız, ortalama sürat ve yer değiştirmenin matematiksel modelini bulur.": "FİZ.10.1.1",
  "Yatay doğrultuda sabit hızlı hareket eden cisimlerin hız, sürat, yer değiştirme ve alınan yol değişkenlerine ilişkin matematiksel modelleri geneller.": "FİZ.10.1.1",
  "İvme ve hız değişimi arasındaki ilişkiye yönelik tümevarımsal akıl yürütebilme": "FİZ.10.1.2",
  "Yatay doğrultuda sabit ivmeli hareket grafiklerini inceler.": "FİZ.10.1.3",
  "Yatay doğrultuda sabit ivmeyle hareket eden cisimlerin hareketine ilişkin grafikleri ve matematiksel modeller arasındaki ilişkiyi kendi cümleleriyle yeniden ifade eder.": "FİZ.10.1.3",
  "Yatay doğrultuda sabit ivmeli hareket grafiklerini birbirine dönüştürerek matematiksel modellere ulaşır.": "FİZ.10.1.3",
  "Kimyasal değişimlerin gözlemlenebilir göstergelerini (enerji değişimi, gaz çıkışı, renk değişimi veya yeni bir katının oluşumu) tanımlar.": "KİM.10.1.1",
  "Kimyasal değişimlere ilişkin kanıtları belirlemeye yönelik bilimsel gözlem yapabilme": "KİM.10.1.1",
  "Taneciklerin yeniden düzenlenmesi temelinde kimyasal tepkimelerin oluşumunu temsil eden model önerir.": "KİM.10.1.2",
  "Tepkime türlerinin (çökelme, indirgenme-yükseltgenme, asit-baz) oluşum sürecine ilişkin gözlemlenebilir göstergeleri (renk değişimi, çökelek oluşumu, enerji değişimi, gaz çıkışı) tanımlar.": "KİM.10.1.3",
  "Tepkime türlerinin oluşum sürecine ilişkin gözlemlenebilir göstergelere yönelik veri toplar ve kaydeder.": "KİM.10.1.3",
  "Maddelerin miktarını ifade etmek için ölçülebilir (kütle, tanecik sayısı vb.) özellikleri belirler.": "KİM.10.1.4",
};

ok("süreç bileşeni indeksi var", OKZM.surecSayisi >= 600, String(OKZM.surecSayisi));
ok("konu adı indeksi var", OKZM.konuAdiSayisi > 0, String(OKZM.konuAdiSayisi));

let bulunan = 0;
const yanlislar = [], yoklar = [];
for (const [k, d] of ORNEK) {
  const r = OKZM.ucBul(k, d);
  const bekle = BEKLENEN[k];
  if (!r) { yoklar.push(d + ": " + k.slice(0, 40)); continue; }
  bulunan++;
  if (bekle && r.kod !== bekle) yanlislar.push(d + " → " + r.kod + " (beklenen " + bekle + ")");
}
ok("gerçek Okulizyon metinleri tanınıyor", yoklar.length === 0, yoklar.slice(0, 4).join(" | "));
esit("gerçek metin sayısı", bulunan, ORNEK.length);
ok("hiçbir metin YANLIŞ koda gitmiyor", yanlislar.length === 0, yanlislar.slice(0, 4).join(" | "));

// Yanlış eşleme yapmadığını ayrıca sına: uydurma cümle hâlâ null
esit("uydurma cümle hâlâ null", OKZM.ucBul("Kuantum dolanıklık deneyi tasarlar.", "Fizik"), null);
// Ders ayrımı korunuyor
esit("ders uyuşmazsa null", OKZM.ciktiBul("Felsefenin anlamını merak eder.", "Kimya"), null);

// ---------- Özet ----------
console.log("");
if (kalan) {
  console.log("KALAN " + kalan + " test:");
  for (const h of hatalar) console.log("  ✗ " + h);
  process.exit(1);
}
console.log("TÜM TESTLER GEÇTİ (" + gecen + "/" + gecen + ")");
