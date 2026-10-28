/* ============================================================
   OKULİZYON KAZANIM → KONU BAŞLIĞI EŞLEME TESTLERİ
   Çalıştır: node tests/okz-konu.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const OKZK = require("../site/okz-konu.js");
const OKZ = require("../site/okz-normalize.js");

const KOK = path.join(__dirname, "..");
const INDEKS_VERISI = JSON.parse(fs.readFileSync(path.join(KOK, "site", "content", "konu_esleme.json"), "utf8"));
const indeks = OKZK.indeksKur(INDEKS_VERISI);

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ayrinti) {
  if (kosul) { gecen++; return true; }
  kalan++;
  hatalar.push(ad + (ayrinti ? " → " + ayrinti : ""));
  return false;
}
function esit(ad, gelen, beklenen) {
  return ok(ad, gelen === beklenen, "gelen: " + JSON.stringify(gelen) + " · beklenen: " + JSON.stringify(beklenen));
}
function kume(ad, gelen, beklenen) {
  const g = new Set(gelen), b = new Set(beklenen);
  const ayni = g.size === b.size && [...b].every((x) => g.has(x));
  return ok(ad, ayni, "gelen: " + JSON.stringify([...g]) + " · beklenen: " + JSON.stringify([...b]));
}

const BILINEN = ["Türk Dili ve Edebiyatı", "Tarih", "Coğrafya", "Felsefe", "Din Kültürü", "Matematik", "Fizik", "Kimya", "Biyoloji"];

// ---------- 1) Metin sadeleştirme ----------
console.log("\n== 1) Türkçe metin sadeleştirme ==");
esit("sade: büyük/küçük harf + noktalama", OKZK.sade("Dik Üçgende Trigonometrik Oranlar, 2024!"), "dik ucgende trigonometrik oranlar 2024");
esit("sade: ı/İ/I tek harfe iner", OKZK.sade("IŞIK İZLEME ısı"), "isik izleme isi");
ok("toke: durakli kelimeler atılır", !OKZK.toke("ve ile bir için olan").length);
ok("toke: anlamlı kelime kalır", OKZK.toke("Dik üçgende trigonometrik oranlar").includes("ucgende"), JSON.stringify(OKZK.toke("Dik üçgende trigonometrik oranlar")));
ok("ayniKelime: ek farkı tolere edilir", OKZK.ayniKelime("turkunun", "turku"));
ok("ayniKelime: alakasız kelime eşleşmez", !OKZK.ayniKelime("matematik", "fizik"));
esit("numarasiz: başlık numarası atılır", OKZK.numarasiz("1.1.3 mol kavrami"), "mol kavrami");

// ---------- 2) İndeks ----------
console.log("\n== 2) İndeks ==");
esit("indeks: 154 havuz", indeks.N, 154);
esit("indeks: sürüm aktarılır", indeks.surum, INDEKS_VERISI.surum);
const matKonulari = OKZK.konular("Matematik", indeks);
ok("konular: Matematik listelenir", matKonulari.length >= 20, String(matKonulari.length));
esit("konular: ilk konu 1.1", matKonulari[0].konu, "1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler");
ok("konular: her kayıtta topic_key var", matKonulari.every((k) => k.topicKey.indexOf("Matematik > ") === 0));

// ---------- 3) KESİN eşleşme (otomatik uygulanabilir) ----------
console.log("\n== 3) KESİN eşleşmeler ==");
const kesinBeklenen = [
  ["Türkçe", "Noktalama İşaretleri", "Noktalama İşaretleri"],
  ["Türkçe", "Yazım Kuralları", "Yazım Kuralları"],
  ["Türkçe", "Türkü türünün genel özelliklerini belirler.", "Türkü"],
  ["Türkçe", "Halk şiirini tanımlar ,halk şiiri altında koşma türünün genel özelliklerini kavrar.", "Koşma"],
  ["Fizik", "Yatay doğrultuda sabit hızlı hareket eden cisimlerin hız, sürat, yer değiştirme ve alınan yol değişkenlerine ilişkin matematiksel modelleri geneller.", "1.1 Sabit Hızlı Hareket"],
  ["Fizik", "Yatay doğrultuda sabit hızlı hareket ile ilgili tümevarımsal akıl yürütebilme", "1.1 Sabit Hızlı Hareket"]
];
for (const [ders, kazanim, beklenen] of kesinBeklenen) {
  const kanon = OKZ.kanonik(ders, BILINEN);
  const r = OKZK.esle(kazanim, kanon, indeks);
  esit("kesin: " + kazanim.slice(0, 40), r.konu, beklenen);
  esit("kesin güven: " + kazanim.slice(0, 30), r.guven, "kesin");
  ok("kesin: topic_key dersle başlar", r.topicKey.indexOf(kanon + " > ") === 0, r.topicKey);
}

// ---------- 4) ÖNERİ (otomatik UYGULANMAZ) ----------
console.log("\n== 4) ÖNERİ seviyesi ==");
const oneriTestleri = [
  ["Matematik-1", "Dik üçgende trigonometrik oranlar ve trigonometrik özdeşliklerle ilgili varsayımlarda bulunur.", "1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler"],
  ["Matematik-1", "Üçgenin bir kenarı ve o kenara ait yüksekliğindeki değişimin üçgenin alanındaki değişime etkisine dair varsayımlarda bulunur.", "1.3 Üçgende Alan"],
  ["Tarih-1", "Türkistan’dan Türkiye’ye uzanan süreçte Türklerde devlet ve ordu teşkilatında meydana gelen değişim ve sürekliliği sağlayan unsurları inceler.", "1.2 Türkistan'dan Türkiye'ye Türklerde Devlet ve Ordu Teşkilatları"]
];
for (const [ders, kazanim, beklenen] of oneriTestleri) {
  const kanon = OKZ.kanonik(ders, BILINEN);
  const r = OKZK.esle(kazanim, kanon, indeks);
  esit("öneri: " + kazanim.slice(0, 40), r.konu, beklenen);
  esit("öneri güven (otomatik değil): " + kazanim.slice(0, 30), r.guven, "oneri");
  ok("öneri: skor 0-1 arası", r.skor > 0 && r.skor <= 1, String(r.skor));
}
const zayif = OKZK.esle("Metinlerden hareketle çıkarımlar yapar.", "Türk Dili ve Edebiyatı", indeks);
esit("zayıf örtüşme 'yok' döner", zayif.guven, "yok");

// ---------- 5) Yanlış eşleşme yapmama ----------
console.log("\n== 5) Güvenlik: uydurma eşleşme yok ==");
const alakasiz = OKZK.esle("Bu tamamen alakasız bir cümledir zebra kuşkonmaz", "Matematik", indeks);
esit("alakasız metin eşleşmez", alakasiz.guven, "yok");
esit("alakasız metinde konu boş", alakasiz.konu, "");
const bosMetin = OKZK.esle("", "Matematik", indeks);
esit("boş metin eşleşmez", bosMetin.guven, "yok");
esit("boş metin nedeni", bosMetin.neden, "bos");
esit("indeks yoksa çökmeden döner", OKZK.esle("Noktalama İşaretleri", "Türk Dili ve Edebiyatı", null).guven, "yok");
// Ders uyuşmazsa başka dersin konusuna atlamamalı
const yanlisDers = OKZK.esle("Noktalama İşaretleri", "Matematik", indeks);
ok("başka dersin konusuna atlamaz", yanlisDers.topicKey.indexOf("Matematik > ") === 0, yanlisDers.topicKey);

// ---------- 6) adaylar() — arayüz listesi ----------
console.log("\n== 6) Aday listesi (arayüz) ==");
const ad = OKZK.adaylar("Üçgende iç ve dış açıortayların, kenarortayların, kenar orta dikmelerin ve yüksekliklerin özelliklerine ilişkin varsayımda bulunur.", "Matematik", indeks, 3);
esit("adaylar: 3 sonuç", ad.length, 3);
ok("adaylar: hepsi Matematik", ad.every((x) => x.topicKey.indexOf("Matematik > ") === 0));
ok("adaylar: skora göre azalan", ad[0].skor >= ad[1].skor && ad[1].skor >= ad[2].skor);
const adKesin = OKZK.adaylar("Yazım Kuralları", "Türk Dili ve Edebiyatı", indeks, 3);
ok("adaylar: kesin eşleşme ilk sırada", adKesin[0].kesin === true && adKesin[0].konu === "Yazım Kuralları");

// ---------- 7) Gerçek kullanıcı verisi (26 BKT anahtarı) ----------
console.log("\n== 7) Gerçek veri: konu anahtarları ==");
const GERCEK = [
  ["Türkçe", "Yazım Kuralları"], ["Türkçe", "Noktalama İşaretleri"], ["Türkçe", "İki Cümleyi Birleştirme"],
  ["Türkçe", "Yazarın metni yazma amacını belirler."], ["Türkçe", "Metinlerden hareketle çıkarımlar yapar."],
  ["Türkçe", "Metnin yardımcı düşüncelerini belirler."], ["Türkçe", "Türkü türünün genel özelliklerini belirler."],
  ["Matematik", "1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler"],
  ["Felsefe", "Felsefenin bilim, din ve sanat alanlarıyla ilişkisine eleştirel yaklaşır."],
  ["Coğrafya-1", "Örnek olay, olgu ve/veya mekânın temel coğrafi koşullarını tanımlar."],
  ["Coğrafya-1", "Örnek olay, olgu ve/veya mekânın aynı çevrede bulunan diğer olay, olgu veya mekânlar üzerindeki etkisini sorgular."],
  ["Fizik", "Yatay doğrultuda sabit hızlı hareket ile ilgili tümevarımsal akıl yürütebilme"],
  ["Türkçe", "Metni millî, manevi ve evrensel değerlerin aktarımı bağlamında değerlendirir."],
  ["Kimya", "Kimyasal değişimlere ilişkin kanıtları belirlemeye yönelik bilimsel gözlem yapabilme"],
  ["Tarih-1", "Türk tarihinin seyrini değiştiren önemli askerî mücadelelerin özelliklerini belirler."],
  ["Türkçe", "Halk şiirini tanımlar ,halk şiiri altında koşma türünün genel özelliklerini kavrar."],
  ["Matematik-1", "Dik üçgende trigonometrik oranlar ve trigonometrik özdeşliklerle ilgili varsayımlarda bulunur."],
  ["Kimya", "Maddelerin miktarını ifade etmek için ölçülebilir (kütle, tanecik sayısı vb.) özellikleri belirler."],
  ["Fizik", "Yatay doğrultuda sabit ivmeli hareket grafiklerini birbirine dönüştürerek matematiksel modellere ulaşır."],
  ["Türkçe", "Şiirde ahengi sağlayan özellikleri (uyak düzeni, uyak, redif, aliterasyon,asonans) ile ilgili çalışma yapar."],
  ["Tarih-1", "Türk tarihinin seyrini değiştiren önemli askerî mücadelelerin etkilerini benzerlik ve farklılıklar açısından listeler."],
  ["Matematik-1", "Üçgenin bir kenarı ve o kenara ait yüksekliğindeki değişimin üçgenin alanındaki değişime etkisine dair varsayımlarda bulunur."],
  ["Matematik-1", "Üçgende iç ve dış açıortayların, kenarortayların, kenar orta dikmelerin ve yüksekliklerin özelliklerine ilişkin varsayımda bulunur."],
  ["Fizik", "Yatay doğrultuda sabit hızlı hareket eden cisimlerin hız, sürat, yer değiştirme ve alınan yol değişkenlerine ilişkin matematiksel modelleri geneller."],
  ["Tarih-1", "Türkistan’dan Türkiye’ye uzanan süreçte Türklerde devlet ve ordu teşkilatında meydana gelen değişim ve sürekliliği sağlayan unsurları inceler."],
  ["Fizik", "Yatay doğrultuda sabit ivmeyle hareket eden cisimlerin hareketine ilişkin grafikleri ve matematiksel modeller arasındaki ilişkiyi kendi cümleleriyle yeniden ifade eder."]
];
// Ders adları kanonikleşmeli: "Türkçe"/"Matematik-1"/"Tarih-1"/"Coğrafya-1" → uygulamanın adı
const kanonikBeklenen = { "Türkçe": "Türk Dili ve Edebiyatı", "Matematik-1": "Matematik", "Tarih-1": "Tarih", "Coğrafya-1": "Coğrafya" };
let kesinSayi = 0;
for (const [ders, metin] of GERCEK) {
  const kanon = OKZ.kanonik(ders, BILINEN);
  esit("kanonik ders: " + ders, kanon, kanonikBeklenen[ders] || ders);
  const r = OKZK.esle(metin, kanon, indeks);
  if (r.guven === "kesin") {
    kesinSayi++;
    ok("gerçek kesin: ders tutarlı (" + metin.slice(0, 25) + ")", r.topicKey.indexOf(kanon + " > ") === 0, r.topicKey);
  }
}
ok("gerçek veride en az 6 kesin eşleşme", kesinSayi >= 6, "kesin: " + kesinSayi);
ok("gerçek veride her kayıt bir güven seviyesi alır", GERCEK.every(([d, m]) => ["kesin", "oneri", "yok"].includes(OKZK.esle(m, OKZ.kanonik(d, BILINEN), indeks).guven)));

// ---------- 8) Eşleme eski kaydı gerçekten birleştirir mi? ----------
console.log("\n== 8) Birleşme mantığı ==");
const eskiAnahtar = "Türkçe > Yazım Kuralları";
const r = OKZK.esle("Yazım Kuralları", OKZ.kanonik("Türkçe", BILINEN), indeks);
const yeniAnahtar = OKZ.kanonik("Türkçe", BILINEN) + " > " + r.konu;
esit("eski kazanım anahtarı", eskiAnahtar, "Türkçe > Yazım Kuralları");
esit("yeni konu anahtarı", yeniAnahtar, "Türk Dili ve Edebiyatı > Yazım Kuralları");
ok("anahtarlar farklı (gerçekten birleşir)", eskiAnahtar !== yeniAnahtar);
ok("soru havuzu bu anahtarla bulunur", INDEKS_VERISI.havuzlar.some((h) => h.topic_key === yeniAnahtar));

// ---------- 9) İdempotentlik ----------
console.log("\n== 9) Tekrar çalıştırma ==");
const bir = OKZK.esle("Noktalama İşaretleri", "Türk Dili ve Edebiyatı", indeks);
const iki = OKZK.esle(bir.konu, "Türk Dili ve Edebiyatı", indeks);
esit("eşlenmiş konu tekrar eşlenince aynı kalır", iki.konu, bir.konu);
esit("eşlenmiş konu hâlâ kesin", iki.guven, "kesin");

// ---------- Sonuç ----------
console.log("\n" + "─".repeat(56));
if (kalan) {
  console.log("✗ " + kalan + " test başarısız:");
  hatalar.forEach((h) => console.log("   • " + h));
  console.log("Okulizyon konu eşleme testleri — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
} else {
  console.log("Okulizyon konu eşleme testleri — " + gecen + "/" + gecen + " geçti ✓");
}
