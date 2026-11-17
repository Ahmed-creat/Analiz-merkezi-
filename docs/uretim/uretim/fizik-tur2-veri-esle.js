#!/usr/bin/env node
/* ============================================================
   FİZİK 10 · 2. TUR — kazanım/konu indekslerini yeni alt konulara bağlar
   ------------------------------------------------------------
   Bu turda ağaç 25 konuya çıktı (2.1 → 2.1.1/2.1.2, 4.6 → 4.6.1/4.6.2)
   ve 18 havuz kitaptan yeniden yazıldı. Türetilmiş indeksler buna
   göre güncellenmeli:

     · scripts/meb-kazanim-uret.js  ELLE tablosu (yeniden üretim aynı kalsın)
     · site/content/mufredat/kazanim_konu_10.json
     · site/content/konu_esleme.json
     · site/okz-meb.js  METIN başlıkları
     · site/konu-anahtar.js  anahtar sözcük kuralları

   Kazanım kararı (2026 programı):
     2.1.1 → FİZ.10.2.1  (kuvvet-yer değiştirme grafiğinden iş)
     2.1.2 → FİZ.10.2.2  (iş, enerji ve güç ilişkisi)
     4.6.1 → FİZ.10.4.6  (rezonans/deprem kavramları)
     4.6.2 → FİZ.10.4.6  (depremle ilgili model oluşturma aynı çıktı içinde)

   Kullanım: node docs/uretim/uretim/fizik-tur2-veri-esle.js [--kontrol]
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const KONTROL = process.argv.includes("--kontrol");
let hata = 0;
const bildir = m => console.log(m);
const kaydet = (y, v) => { if (!KONTROL) fs.writeFileSync(y, v, "utf8"); };

const HAVUZ_DIR = path.join(KOK, "site", "content", "soru_havuzlari");
const ESLEME = path.join(KOK, "site", "content", "konu_esleme.json");
const KAZANIM = path.join(KOK, "site", "content", "mufredat", "kazanim_konu_10.json");
const OKZ_JS = path.join(KOK, "site", "okz-meb.js");
const URETICI = path.join(KOK, "scripts", "meb-kazanim-uret.js");
const ANAHTAR = path.join(KOK, "site", "konu-anahtar.js");

/* Bölünen / yeni konuların kazanım künyesi */
const YENI = [
  {
    konu_id: "fizik_10_u02_k01",
    konu: "2.1.1 Kuvvet-Yer Değiştirme Grafiği Kullanılarak İş Kavramının Tanımlanması",
    tema: 2,
    kodlar: ["FİZ.10.2.1"],
    alt: "A) Kuvvet-Yer Değiştirme Grafiği Kullanılarak İş Kavramının Tanımlanması",
    gerekce: "Kitabın 2.1-A alt başlığı iş kavramını F-x grafiği üzerinden kurar; 2026 programındaki iş çıktısı FİZ.10.2.1'dir."
  },
  {
    konu_id: "fizik_10_u02_k05",
    konu: "2.1.2 İş, Enerji ve Güç Kavramları Arasındaki İlişki",
    tema: 2,
    kodlar: ["FİZ.10.2.2"],
    alt: "B) İş, Enerji ve Güç Kavramları Arasındaki İlişki",
    gerekce: "Kitabın 2.1-B alt başlığı iş-enerji-güç ilişkisini ve güç hesabını kurar; karşılığı FİZ.10.2.2'dir."
  },
  {
    konu_id: "fizik_10_u04_k06",
    konu: "4.6.1 Rezonans ve Depremle İlgili Kavramlar",
    tema: 4,
    kodlar: ["FİZ.10.4.6"],
    alt: "A) Rezonans ve Depremle İlgili Kavramlar",
    gerekce: "Kitabın 4.6-A alt başlığı rezonans ile depremin odak/merkez üssü/büyüklük/şiddet kavramlarını verir; FİZ.10.4.6 kapsamındadır."
  },
  {
    konu_id: "fizik_10_u04_k07",
    konu: "4.6.2 Depremle İlgili Bilimsel Model Oluşturabilme",
    tema: 4,
    kodlar: ["FİZ.10.4.6"],
    alt: "B) Depremle İlgili Bilimsel Model Oluşturabilme",
    gerekce: "Sismograf ve sismik izolatör modelleri aynı çıktının (FİZ.10.4.6) model oluşturma boyutudur."
  }
];

const havuzlar = fs.readdirSync(HAVUZ_DIR).filter(f => /^fizik_10_u\d+_k\d+\.json$/.test(f)).sort();
const canli = new Map();
for (const f of havuzlar) {
  const p = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, f), "utf8"));
  canli.set(p.konu_id, p);
}

/* ---- 1) Üretici betikteki ELLE tablosu ---- */
try {
  let s = fs.readFileSync(URETICI, "utf8");
  const eskiK01 = '  fizik_10_u02_k01: { kodlar: ["FİZ.10.2.1", "FİZ.10.2.2"], gerekce: "Konu iş-enerji-güç bütününü kapsıyor; 2026\'da iş grafiği (10.2.1) ve iş-enerji-güç çıkarımı (10.2.2) ayrı çıktı." },\n';
  const yeniSatirlar = YENI.map(y =>
    "  " + y.konu_id + ": { kodlar: " + JSON.stringify(y.kodlar) + ", gerekce: " + JSON.stringify(y.gerekce) + " },\n").join("");
  if (s.includes("  fizik_10_u02_k05:")) {
    bildir("= üretici ELLE tablosu güncel");
  } else if (s.includes(eskiK01)) {
    s = s.replace(eskiK01, yeniSatirlar);
    kaydet(URETICI, s);
    bildir("✔ üretici ELLE tablosu: 2.1 → 2.1.1/2.1.2, 4.6 → 4.6.1/4.6.2");
  } else {
    bildir("✗ üretici ELLE tablosunda 2.1 satırı bulunamadı");
    hata++;
  }
} catch (e) { bildir("✗ üretici: " + e.message); hata++; }

/* ---- 2) konu_esleme.json ---- */
try {
  const E = JSON.parse(fs.readFileSync(ESLEME, "utf8"));
  const hav = Array.isArray(E.havuzlar) ? E.havuzlar : [];
  let eklenen = 0, duzeltilen = 0;
  for (const [id, p] of canli) {
    const y = YENI.find(x => x.konu_id === id);
    const konu = p.baslik;
    const kayit = {
      konu_id: id,
      ders: "Fizik",
      topic_key: p.topic_key || "Fizik > " + konu,
      konu,
      soru: (p.sorular || []).length,
      metin: konu + (y ? " · " + y.alt + " · " + konu : " · " + konu)
    };
    const yer = hav.findIndex(h => h.konu_id === id);
    if (yer < 0) { hav.push(kayit); eklenen++; }
    else if (hav[yer].konu !== konu || hav[yer].topic_key !== kayit.topic_key || hav[yer].soru !== kayit.soru) {
      hav[yer] = { ...hav[yer], ...kayit };
      duzeltilen++;
    }
  }
  hav.sort((a, b) => String(a.konu_id).localeCompare(String(b.konu_id), "tr"));
  E.havuzlar = hav;
  E.havuz_sayisi = hav.length;
  kaydet(ESLEME, JSON.stringify(E, null, 1) + "\n");
  bildir("✔ konu_esleme.json: +" + eklenen + " yeni · " + duzeltilen + " düzeltildi · toplam " + hav.length);
} catch (e) { bildir("✗ konu_esleme.json: " + e.message); hata++; }

/* ---- 3) kazanim_konu_10.json ---- */
try {
  const K = JSON.parse(fs.readFileSync(KAZANIM, "utf8"));
  K.konular = Array.isArray(K.konular) ? K.konular : [];
  for (const y of YENI) {
    const kayit = {
      konu_id: y.konu_id, ders: "Fizik", konu: y.konu, tema: y.tema,
      kodlar: y.kodlar, guven: y.kodlar.length ? "kesin" : "yok",
      yontem: "elle-dogrulama", skor: 0, uyari: "", gerekce: y.gerekce,
      kazanim_metinleri: 0, metin_kodlari: []
    };
    const yer = K.konular.findIndex(k => k.konu_id === y.konu_id);
    if (yer >= 0) K.konular[yer] = { ...K.konular[yer], ...kayit };
    else K.konular.push(kayit);
  }
  K.konular.sort((a, b) => String(a.konu_id).localeCompare(String(b.konu_id), "tr"));
  /* metin_esleme: başlığı değişen konuların kayıtları */
  let degisen = 0;
  for (const m of (K.metin_esleme || [])) {
    const y = YENI.find(x => x.konu_id === m.konu_id);
    if (!y) continue;
    if (m.konu !== y.konu || m.topic_key !== "Fizik > " + y.konu) {
      m.konu = y.konu;
      m.topic_key = "Fizik > " + y.konu;
      m.kodlar = y.kodlar.slice();
      m.kod_guven = y.kodlar.length ? "yapisal" : "yok";
      degisen++;
    }
  }
  if (K.ozet && typeof K.ozet === "object") {
    K.ozet.konu = K.konular.length;
    K.ozet.metin = (K.metin_esleme || []).length;
    K.ozet.eslesen_konu = K.konular.filter(k => (k.kodlar || []).length > 0).length;
    if (K.ozet.ders_bazli && K.ozet.ders_bazli.Fizik) K.ozet.ders_bazli.Fizik.konu = K.konular.filter(k => k.ders === "Fizik").length;
  }
  kaydet(KAZANIM, JSON.stringify(K, null, 1) + "\n");
  bildir("✔ kazanim_konu_10.json: " + degisen + " metin kaydı başlık düzeltmesi · konu " + K.konular.length);
} catch (e) { bildir("✗ kazanim: " + e.message); hata++; }

/* ---- 4) okz-meb.js METIN başlıkları ---- */
try {
  let s = fs.readFileSync(OKZ_JS, "utf8");
  let n = 0;
  for (const y of YENI) {
    const eskiBasliklar = {
      fizik_10_u02_k01: "2.1 İş, Enerji ve Güç",
      fizik_10_u04_k06: "4.6 Rezonans ve Deprem"
    }[y.konu_id];
    if (!eskiBasliklar) continue;
    const eski = '"konu_id":"' + y.konu_id + '","konu":"' + eskiBasliklar + '","topic_key":"Fizik > ' + eskiBasliklar + '"';
    const yeni = '"konu_id":"' + y.konu_id + '","konu":"' + y.konu + '","topic_key":"Fizik > ' + y.konu + '"';
    if (s.includes(yeni)) continue;
    if (!s.includes(eski)) { bildir("✗ okz-meb.js: " + y.konu_id + " kaydı bulunamadı"); hata++; continue; }
    s = s.split(eski).join(yeni);
    n++;
  }
  kaydet(OKZ_JS, s);
  bildir("✔ okz-meb.js: " + n + " METIN başlığı yeni alt konuya bağlandı");
} catch (e) { bildir("✗ okz-meb.js: " + e.message); hata++; }

/* ---- 5) konu-anahtar.js ---- */
try {
  let s = fs.readFileSync(ANAHTAR, "utf8");
  const eski =
    '    { ders: ["fizik"], konu: "2.1 İş, Enerji ve Güç", desen: /is.*enerji.*guc|enerji.*guc|guc.*is/ },\n';
  const yeni =
    '    { ders: ["fizik"], konu: "2.1.2 İş, Enerji ve Güç Kavramları Arasındaki İlişki",\n' +
    '      desen: /guc|is.*enerji.*guc|enerji.*guc/ },\n' +
    '    { ders: ["fizik"], konu: "2.1.1 Kuvvet-Yer Değiştirme Grafiği Kullanılarak İş Kavramının Tanımlanması",\n' +
    '      desen: /is kavrami|kuvvet.*yer degistirme|f.?x grafigi|grafik.*alan/ },\n';
  if (s.includes('konu: "2.1.2 İş, Enerji ve Güç')) {
    bildir("= konu-anahtar.js 2.1 kuralları güncel");
  } else if (s.includes(eski)) {
    s = s.replace(eski, yeni);
    /* 4.6 için kural yoksa ekle */
    if (!s.includes('konu: "4.6.1')) {
      const capa = '    // ---- Kimya ----';
      const kural =
        '    { ders: ["fizik"], konu: "4.6.1 Rezonans ve Depremle İlgili Kavramlar",\n' +
        '      desen: /rezonans|deprem|odak noktasi|merkez ussu|fay hatti|sismik/ },\n' +
        '    { ders: ["fizik"], konu: "4.6.2 Depremle İlgili Bilimsel Model Oluşturabilme",\n' +
        '      desen: /sismograf|sismogram|sismolog|sismik izolator/ },\n\n';
      s = s.replace(capa, kural + capa);
    }
    kaydet(ANAHTAR, s);
    bildir("✔ konu-anahtar.js: 2.1 ve 4.6 alt konu kuralları eklendi");
  } else {
    bildir("✗ konu-anahtar.js: 2.1 kuralı bulunamadı");
    hata++;
  }
} catch (e) { bildir("✗ konu-anahtar.js: " + e.message); hata++; }

bildir(hata ? "SONUÇ: " + hata + " hata" : "SONUÇ: tamam");
process.exitCode = hata ? 1 : 0;
