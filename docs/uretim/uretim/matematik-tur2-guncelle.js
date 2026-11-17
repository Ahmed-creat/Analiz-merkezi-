#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — 2. TUR: ağaç, kayıt defteri, grafik, PWA
   ------------------------------------------------------------
   Ders kitabı (MEB, 2025) içindekiler düzeyi 21 konu:
     1. Tema Geometrik Şekiller        → 4 konu
     2. Tema İstatistiksel Araştırma   → 2 konu
     3. Tema Sayılar                   → 3 konu
     4. Tema Nicelikler ve Değişimler  → 6 konu
     5. Tema Sayma, Algoritma, Bilişim → 2 konu
     6. Tema Analitik İnceleme         → 2 konu
     7. Tema Veriden Olasılığa         → 2 konu

   Yaptığı:
     1) konular.js + pwa-files/functions/konular.js: yalnız
        "10": { ... } bölümündeki Matematik bloğunu 21 satırlık
        kitapla birebir listeyle değiştirir (9. sınıf ezilmez).
     2) Kayıt defteri (content/mufredat + site/content/mufredat):
        mat_10_* kayıtlarını canlı havuzlardan yeniden üretir.
     3) Her havuzun topic_key'ini ağaç başlığına eşitler.
     4) İlişki grafiği: eksik düğümleri ekler ve ön koşul
        zincirlerini kurar.
     5) PWA kopyalarını canlı havuzlarla eşitler, sw.js önbellek
        listesini 21 dosyaya tamamlar.

   Kullanım: node docs/uretim/uretim/matematik-tur2-guncelle.js [--kontrol]
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const KONTROL = process.argv.includes("--kontrol");
const HAVUZ_DIR = path.join(KOK, "site", "content", "soru_havuzlari");

let hata = 0;
const bildir = m => console.log(m);

/* Kitabın içindekiler sırası — 21 konu */
const AGAC = [
  "1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler",
  "1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler",
  "1.3 Üçgende Alan",
  "1.4 Sinüs ve Kosinüs Teoremleri",
  "2.1 İki Kategorik Değişkenin İlişkililiğini İçeren İstatistiksel Problemi Oluşturma, Veri Toplama, Analiz Etme ve Yorumlama",
  "2.2 Başkaları Tarafından Oluşturulan İki Kategorik Değişkenli Verilerin İlişkililiğine Dayalı İstatistiksel Sonuç veya Yorumları Tartışma",
  "3.1 Bir Doğal Sayı ile Asal Çarpanları ve Bölenleri Arasındaki İlişkiler",
  "3.2 En Büyük Ortak Bölen-En Küçük Ortak Kat",
  "3.3 Bölünebilme Özelliklerini Kullanarak Kalan Bulma",
  "4.1 Gerçek Sayılarda Tanımlı Fonksiyonların Nitel Özellikleri",
  "4.2 Gerçek Sayılarda Tanımlı Karesel Fonksiyonlar ve Nitel Özellikleri",
  "4.3 Gerçek Sayılarda Tanımlı Karekök Fonksiyonlar ve Nitel Özellikleri",
  "4.4 Gerçek Sayılarda Tanımlı Rasyonel Fonksiyonlar ve Nitel Özellikleri",
  "4.5 Doğrusal, Karesel, Karekök ve Rasyonel Referans Fonksiyonlar ile Bu Fonksiyonlardan Türetilebilen Fonksiyonların Ters Fonksiyonları",
  "4.6 Doğrusal, Karesel, Karekök, Rasyonel Referans Fonksiyonlar ve Bunlardan Türetilen Fonksiyonlarla İfade Edilebilen Denklem ve Eşitsizlikler İçeren Problemlerin Çözümü",
  "5.1 Sayma Stratejileri",
  "5.2 Cebirsel ve Fonksiyonel İşlemlerin Algoritmik Yapısı",
  "6.1 Dik Koordinat Sisteminde İki Nokta Arasındaki Uzaklık ve Bir Doğru Parçasını Belli Oranda Bölme",
  "6.2 Dik Koordinat Sisteminde Doğrunun Özellikleri ve Analitik İncelenmesi",
  "7.1 Koşullu Olasılık, Bağımlı ve Bağımsız Olaylar",
  "7.2 Bayes Teoremi"
];

/* ---- 1) konular.js (iki kopya) ---- */
for (const dosya of [path.join(KOK, "konular.js"), path.join(KOK, "pwa-files", "functions", "konular.js")]) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  let s = fs.readFileSync(dosya, "utf8");
  /* DİKKAT: konular.js içinde 9. ve 10. sınıf olmak üzere iki "Matematik"
     bloğu var. Yalnız "10" bölümündeki bloğu hedefle. */
  const on = s.indexOf('"10": {');
  if (on < 0) { bildir("✗ 10. sınıf bölümü yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const m = s.slice(on).match(/  "Matematik": \[\n([\s\S]*?)\n  \],/);
  if (!m) { bildir("✗ Matematik bloğu bulunamadı: " + path.relative(KOK, dosya)); hata++; continue; }
  m.index += on;
  const mevcut = m[1].split("\n").filter(x => x.trim().startsWith('"')).map(x => x.trim().replace(/^"|",?$/g, ""));
  const yeni = '  "Matematik": [\n' + AGAC.map(t => '   "' + t + '"').join(",\n") + "\n  ],";
  if (mevcut.length === AGAC.length && mevcut.every((t, i) => t === AGAC[i])) {
    bildir("= zaten güncel: " + path.relative(KOK, dosya));
    continue;
  }
  s = s.slice(0, m.index) + yeni + s.slice(m.index + m[0].length);
  if (!KONTROL) fs.writeFileSync(dosya, s, "utf8");
  bildir("✔ " + path.relative(KOK, dosya) + ": " + mevcut.length + " konu → " + AGAC.length + " konu");
}

/* ---- 2) Kayıt defteri ---- */
const numarasiz = t => String(t).replace(/^\d+(\.\d+)*\s*/, "").trim();
const havuzlar = fs.readdirSync(HAVUZ_DIR).filter(f => /^mat_10_u\d+_k\d+\.json$/.test(f)).sort();
const kayitlar = havuzlar.map(f => {
  const p = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, f), "utf8"));
  return { konu_id: p.konu_id, konu_adi: numarasiz(p.baslik), sinif: 10, ders: "Matematik" };
});

for (const dosya of [path.join(KOK, "content", "mufredat", "konu_kayit_defteri.json"),
                     path.join(KOK, "site", "content", "mufredat", "konu_kayit_defteri.json")]) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const d = JSON.parse(fs.readFileSync(dosya, "utf8"));
  if (!Array.isArray(d.records)) { bildir("✗ records yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const ilkYer = d.records.findIndex(r => /^mat_10_u\d+_k\d+$/.test(String(r.konu_id)));
  if (ilkYer < 0) { bildir("✗ matematik kaydı yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const kalan = d.records.filter(r => !/^mat_10_u\d+_k\d+$/.test(String(r.konu_id)));
  d.records = [...kalan.slice(0, ilkYer), ...kayitlar, ...kalan.slice(ilkYer)];
  if (!KONTROL) fs.writeFileSync(dosya, JSON.stringify(d, null, 2) + "\n", "utf8");
  bildir("✔ " + path.relative(KOK, dosya) + ": " + kayitlar.length + " matematik kaydı");
}

/* ---- 3) topic_key eşitle ---- */
let etiket = 0, eksik = 0;
for (const f of havuzlar) {
  const yol = path.join(HAVUZ_DIR, f);
  const p = JSON.parse(fs.readFileSync(yol, "utf8"));
  if (!AGAC.includes(p.baslik)) { bildir("✗ ağaçta yok: " + p.konu_id + " → " + p.baslik); eksik++; continue; }
  const anahtar = "Matematik > " + p.baslik;
  if (p.topic_key === anahtar) continue;
  p.topic_key = anahtar;
  if (!KONTROL) fs.writeFileSync(yol, JSON.stringify(p, null, 2) + "\n", "utf8");
  etiket++;
}
bildir("✔ topic_key eşitlendi: " + etiket + " havuz · ağaçta karşılığı olmayan: " + eksik);
if (eksik) hata += eksik;

/* ---- 4) İlişki grafiği ---- */
const UNITE = {
  "1": "1. Ünite: Geometrik Şekiller",
  "2": "2. Ünite: İstatistiksel Araştırma Süreci",
  "3": "3. Ünite: Sayılar",
  "4": "4. Ünite: Nicelikler ve Değişimler",
  "5": "5. Ünite: Sayma, Algoritma ve Bilişim",
  "6": "6. Ünite: Analitik İnceleme",
  "7": "7. Ünite: Veriden Olasılığa"
};
const ZINCIR = [
  ["mat_10_u01_k01", "mat_10_u01_k04", "Sinüs ve kosinüs değerleri dik üçgendeki oranlarla tanımlanmadan sinüs/kosinüs teoremleri kurulamaz."],
  ["mat_10_u01_k01", "mat_10_u01_k02", "Temel trigonometrik oranlar bilinmeden üçgende yardımcı elemanlarla yapılan hesap ve ispatlar izlenemez."],
  ["mat_10_u01_k02", "mat_10_u01_k03", "Üçgende yardımcı elemanlar (yükseklik, açıortay, kenarortay) tanınmadan alan bağıntıları ve alan oranları anlaşılamaz."],
  ["mat_10_u01_k03", "mat_10_u01_k04", "Üçgende alan bilgisi, sinüs teoremiyle alan hesabı ve üçgen çözümlemesinin ön koşuludur."],
  ["mat_10_u02_k01", "mat_10_u02_k02", "İki kategorik değişkenli veriyi toplayıp analiz etmeden başkalarının sonuçlarını eleştirel değerlendirmek mümkün değildir."],
  ["mat_10_u03_k01", "mat_10_u03_k02", "Asal çarpanlara ayırma bilinmeden EBOB-EKOK hesabı ve problemleri kurulamaz."],
  ["mat_10_u03_k02", "mat_10_u03_k03", "Bölen ve ortak bölen kavramı oturmadan bölünebilme özellikleriyle kalan bulma yorumlanamaz."],
  ["mat_10_u04_k01", "mat_10_u04_k02", "Fonksiyonun tanım/görüntü kümesi ve artan-azalanlık gibi nitel özellikleri bilinmeden karesel fonksiyonun davranışı incelenemez."],
  ["mat_10_u04_k02", "mat_10_u04_k06", "Karesel fonksiyonun tepe noktası ve işareti bilinmeden karesel denklem/eşitsizlik problemleri çözülemez."],
  ["mat_10_u04_k03", "mat_10_u04_k06", "Karekök fonksiyonunun tanım kümesi ve davranışı bilinmeden karekök içeren denklemler çözülemez."],
  ["mat_10_u04_k04", "mat_10_u04_k06", "Rasyonel fonksiyonun tanım kümesi ve asimptotları bilinmeden rasyonel denklem/eşitsizlikler çözülemez."],
  ["mat_10_u04_k01", "mat_10_u04_k05", "Bire birlik kavramı anlaşılmadan ters fonksiyonun varlığı ve hesabı kavranamaz."],
  ["mat_10_u05_k01", "mat_10_u05_k02", "Sayma stratejileri (toplama/çarpma yoluyla sayma) kavranmadan algoritmik yapıdaki adım ve döngü sayıları yorumlanamaz."],
  ["mat_10_u06_k01", "mat_10_u06_k02", "İki nokta arasındaki uzaklık ve bölme bağıntıları bilinmeden doğrunun eğimi ve denklemi anlamlandırılamaz."],
  ["mat_10_u05_k02", "mat_10_u07_k01", "Koşul, bağlaç ve niceleyici mantığı kurulmadan koşullu olasılık ifadeleri çözümlenemez."],
  ["mat_10_u07_k01", "mat_10_u07_k02", "Koşullu olasılık ve bağımsızlık kavramları bilinmeden Bayes teoremiyle olasılık güncellemesi yapılamaz."]
];

for (const dosya of [path.join(KOK, "content", "iliski_grafi.json"),
                     path.join(KOK, "pwa-files", "content", "iliski_grafi.json")]) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const g = JSON.parse(fs.readFileSync(dosya, "utf8"));
  const dugumler = g.dugumler || [];
  let eklenen = 0;
  for (const k of kayitlar) {
    if (dugumler.some(d => d.konu_id === k.konu_id)) continue;
    const unite = UNITE[k.konu_id.match(/^mat_10_u0(\d)_/)[1]];
    dugumler.push({ konu_id: k.konu_id, konu_adi: k.konu_adi, sinif: 10, ders: "Matematik", unite });
    eklenen++;
  }
  g.dugumler = dugumler;
  g.kenarlar = g.kenarlar || [];
  const var_ = new Set(g.kenarlar.map(k => k.kaynak_konu_id + "→" + k.hedef_konu_id + ":" + k.iliski_tipi));
  let kenar = 0;
  for (const [a, b, gerekce] of ZINCIR) {
    const anahtar = a + "→" + b + ":SERT_ONKOSUL";
    if (var_.has(anahtar)) continue;
    if (!dugumler.some(d => d.konu_id === a) || !dugumler.some(d => d.konu_id === b)) continue;
    g.kenarlar.push({ kaynak_konu_id: a, hedef_konu_id: b, iliski_tipi: "SERT_ONKOSUL", agirlik: 0.9, gerekce });
    var_.add(anahtar);
    kenar++;
  }
  if (!KONTROL) fs.writeFileSync(dosya, JSON.stringify(g, null, 2) + "\n", "utf8");
  bildir("✔ " + path.relative(KOK, dosya) + ": " + g.dugumler.length + " düğüm · " + g.kenarlar.length + " kenar (+" + eklenen + " düğüm, +" + kenar + " kenar)");
}

/* ---- 5) PWA kopyaları + sw.js ---- */
const PWA = path.join(KOK, "pwa-files", "content", "soru_havuzlari");
if (fs.existsSync(PWA)) {
  for (const f of havuzlar) {
    if (!KONTROL) fs.copyFileSync(path.join(HAVUZ_DIR, f), path.join(PWA, f));
  }
  bildir("✔ PWA kopyası: " + havuzlar.length + " matematik havuzu eşitlendi");
}

const SW = path.join(KOK, "sw.js");
if (fs.existsSync(SW)) {
  let s = fs.readFileSync(SW, "utf8");
  const satirlar = havuzlar.map(f => '  "./content/soru_havuzlari/' + f.replace(/\.json$/, "") + '.json",');
  const eksikSatir = satirlar.filter(l => !s.includes(l));
  if (eksikSatir.length) {
    const son = [...s.matchAll(/  "\.\/content\/soru_havuzlari\/mat_10_u\d+_k\d+\.json",\n/g)].pop();
    if (son) {
      const yer = son.index + son[0].length;
      s = s.slice(0, yer) + eksikSatir.join("\n") + "\n" + s.slice(yer);
      if (!KONTROL) fs.writeFileSync(SW, s, "utf8");
      bildir("✔ sw.js: " + eksikSatir.length + " havuz önbellek listesine eklendi");
    } else { bildir("✗ sw.js: matematik satırı bulunamadı"); hata++; }
  } else {
    bildir("= sw.js önbellek listesi tam (" + satirlar.length + " matematik havuzu)");
  }
}

bildir("canlı matematik havuzu: " + havuzlar.length + " · ağaç: " + AGAC.length + " konu");
bildir(hata ? "SONUÇ: " + hata + " hata" : "SONUÇ: tamam");
process.exitCode = hata ? 1 : 0;
