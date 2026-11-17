#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 · 2. TUR — kazanım/konu indekslerini kitaba bağlar
   ------------------------------------------------------------
   Bu turda 21 havuz kitaptan sıfırdan yazıldı ve ağaç, kitabın
   içindekiler düzeyine çekildi. Altı konu başlığı kitabın tam
   başlığıyla değişti:

     2.1 İstatistiksel Problemi Oluşturma…            → tam başlık
     2.2 İstatistiksel Sonuç veya Yorumları Tartışma  → tam başlık
     4.5 Fonksiyonların Ters Fonksiyonları            → tam başlık
     4.6 Denklem ve Eşitsizlikler İçeren Problemler…  → tam başlık
     6.1 İki Nokta Arasındaki Uzaklık…                → tam başlık
     6.2 Doğrunun Özellikleri ve Analitik İncelenmesi → tam başlık

   Ayrıca 4.2/4.3/4.4 konuları artık kitaptaki bölümlerinden
   yazıldığı için kazanım güveni "yapisal" → "kesin" olur.

   Güncellenen dosyalar:
     · scripts/meb-kazanim-uret.js  ELLE tablosu (betik ÇALIŞTIRILMAZ)
     · site/content/mufredat/kazanim_konu_10.json
     · site/content/konu_esleme.json
     · site/okz-meb.js  METIN başlıkları
     · site/konu-anahtar.js  anahtar sözcük kuralları

   Kullanım: node docs/uretim/uretim/matematik-tur2-veri-esle.js [--kontrol]
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

/* Canlı havuzlar */
const havuzlar = fs.readdirSync(HAVUZ_DIR).filter(f => /^mat_10_u\d+_k\d+\.json$/.test(f)).sort();
const canli = new Map();
for (const f of havuzlar) {
  const p = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, f), "utf8"));
  canli.set(p.konu_id, p);
}

/* Başlığı değişen konular: eski ad → yeni ad (canlı havuzdan) */
const ESKI_AD = {
  mat_10_u02_k01: "2.1 İstatistiksel Problemi Oluşturma, Veri Toplama, Analiz Etme ve Yorumlama",
  mat_10_u02_k02: "2.2 İstatistiksel Sonuç veya Yorumları Tartışma",
  mat_10_u04_k05: "4.5 Fonksiyonların Ters Fonksiyonları",
  mat_10_u04_k06: "4.6 Denklem ve Eşitsizlikler İçeren Problemlerin Çözümü",
  mat_10_u06_k01: "6.1 İki Nokta Arasındaki Uzaklık ve Bir Doğru Parçasını Belli Oranda Bölme",
  mat_10_u06_k02: "6.2 Doğrunun Özellikleri ve Analitik İncelenmesi"
};

/* Kazanım künyesi — kitabın bölümüne dayanan gerekçeler */
const KUNYE = {
  mat_10_u02_k01: {
    kodlar: ["MAT.10.2.1"],
    gerekce: "Kitabın 2.1. bölümü iki kategorik değişkenin ilişkililiğini içeren istatistiksel problemi oluşturma, veri toplama, analiz ve yorumlama sürecini verir (s.98-127); MAT.10.2.1 çıktısıdır."
  },
  mat_10_u02_k02: {
    kodlar: ["MAT.10.2.2"],
    gerekce: "Kitabın 2.2. bölümü başkalarının ürettiği iki kategorik değişkenli verilere dayalı sonuç/yorumları tartışmayı verir (s.128-132); MAT.10.2.2 çıktısıdır."
  },
  mat_10_u04_k02: {
    kodlar: ["MAT.10.4.2"],
    gerekce: "Kitabın 4.2. bölümü karesel fonksiyonun tepe noktası, simetri ekseni, işareti ve köklerini inceler (s.197-223); MAT.10.4.2 çıktısı doğrudan bu bölümdür."
  },
  mat_10_u04_k03: {
    kodlar: ["MAT.10.4.3"],
    gerekce: "Kitabın 4.3. bölümü karekök fonksiyonunun tanım/görüntü kümesi ve nitel özelliklerini verir (s.224-242); MAT.10.4.3 çıktısıdır."
  },
  mat_10_u04_k04: {
    kodlar: ["MAT.10.4.4"],
    gerekce: "Kitabın 4.4. bölümü rasyonel referans fonksiyonunu ve nitel özelliklerini verir (s.243-263); MAT.10.4.4 çıktısıdır."
  },
  mat_10_u04_k05: {
    kodlar: ["MAT.10.4.5"],
    gerekce: "Kitabın 4.5. bölümü referans fonksiyonlardan türetilen fonksiyonların terslerini verir (s.264-283); MAT.10.4.5 çıktısıdır."
  },
  mat_10_u04_k06: {
    kodlar: ["MAT.10.4.6"],
    gerekce: "Kitabın 4.6. bölümü fonksiyonlarla ifade edilebilen denklem ve eşitsizlik problemlerinin çözümünü verir (s.284-305); MAT.10.4.6 çıktısıdır."
  },
  mat_10_u06_k01: {
    kodlar: ["MAT.10.6.1"],
    gerekce: "Kitabın 6.1. bölümü iki nokta arasındaki uzaklık ile bir doğru parçasını belli oranda bölmeyi birlikte verir (s.359-371); MAT.10.6.1 çıktısıdır."
  },
  mat_10_u06_k02: {
    kodlar: ["MAT.10.6.2"],
    gerekce: "Kitabın 6.2. bölümü doğrunun eğimi, denklemi ve paralel/dik eğim ilişkilerini verir (s.372-384); MAT.10.6.2 çıktısıdır."
  }
};

const yeniAd = id => (canli.get(id) || {}).baslik || ESKI_AD[id];

/* ---- 1) Üretici betikteki ELLE tablosu ---- */
try {
  let s = fs.readFileSync(URETICI, "utf8");
  let eklenen = 0, yenilenen = 0;
  for (const id of Object.keys(KUNYE)) {
    const k = KUNYE[id];
    const satir = "  " + id + ": { kodlar: " + JSON.stringify(k.kodlar) + ", gerekce: " + JSON.stringify(k.gerekce) + " },\n";
    const mevcut = new RegExp("^  " + id + ": \\{[^\\n]*\\},\\n", "m");
    if (mevcut.test(s)) {
      const onceki = s.match(mevcut)[0];
      if (onceki === satir) continue;
      s = s.replace(mevcut, satir);
      yenilenen++;
    } else {
      /* ELLE tablosunun kapanışından önce ekle */
      const kapanis = s.indexOf("\n};", s.indexOf("const ELLE = {"));
      if (kapanis < 0) { bildir("✗ ELLE tablosu bulunamadı"); hata++; break; }
      s = s.slice(0, kapanis + 1) + satir + s.slice(kapanis + 1);
      eklenen++;
    }
  }
  if (eklenen || yenilenen) kaydet(URETICI, s);
  bildir("✔ meb-kazanim-uret.js ELLE tablosu: +" + eklenen + " yeni · " + yenilenen + " güncellendi (betik ÇALIŞTIRILMADI)");
} catch (e) { bildir("✗ üretici: " + e.message); hata++; }

/* Kazanım cümleleri — konu_esleme.json'daki "metin" alanı bu cümleyi
   korumalı; aksi hâlde otomatik konu önerisi (OKZK.esle) zayıflar. */
const KAZANIM_METIN = (() => {
  try {
    const K = JSON.parse(fs.readFileSync(KAZANIM, "utf8"));
    const m = new Map();
    for (const r of (K.metin_esleme || [])) {
      if (r.ders === "Matematik" && r.konu_id && !m.has(r.konu_id)) m.set(r.konu_id, r.metin);
    }
    return m;
  } catch (e) { return new Map(); }
})();

/* ---- 2) konu_esleme.json ---- */
try {
  const E = JSON.parse(fs.readFileSync(ESLEME, "utf8"));
  const hav = Array.isArray(E.havuzlar) ? E.havuzlar : [];
  let eklenen = 0, duzeltilen = 0;
  for (const [id, p] of canli) {
    const konu = p.baslik;
    const cumle = KAZANIM_METIN.get(id);
    const kayit = {
      konu_id: id,
      ders: "Matematik",
      topic_key: p.topic_key || "Matematik > " + konu,
      konu,
      soru: (p.sorular || []).length,
      metin: konu + " · " + konu + (cumle ? " · " + cumle : "")
    };
    const yer = hav.findIndex(h => h.konu_id === id);
    if (yer < 0) { hav.push(kayit); eklenen++; }
    else if (hav[yer].konu !== konu || hav[yer].topic_key !== kayit.topic_key || hav[yer].soru !== kayit.soru || hav[yer].metin !== kayit.metin) {
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
  let konuDuzeltme = 0;
  for (const k of K.konular) {
    if (k.ders !== "Matematik") continue;
    const p = canli.get(k.konu_id);
    if (!p) continue;
    const kk = KUNYE[k.konu_id];
    const yeni = {
      konu: p.baslik,
      kodlar: kk ? kk.kodlar : k.kodlar,
      guven: "kesin",
      yontem: "elle-dogrulama",
      skor: 0,
      uyari: "",
      gerekce: kk ? kk.gerekce : (k.gerekce || "Kitabın ilgili bölümü yeniden yazıldı; künye kitap sayfalarıyla doğrulandı.")
    };
    if (k.konu !== yeni.konu || k.guven !== "kesin" || k.yontem !== "elle-dogrulama") {
      Object.assign(k, yeni);
      konuDuzeltme++;
    }
  }
  let metinDuzeltme = 0;
  for (const m of (K.metin_esleme || [])) {
    if (m.ders !== "Matematik") continue;
    const p = canli.get(m.konu_id);
    if (!p) continue;
    const kk = KUNYE[m.konu_id];
    const yeniKonu = p.baslik;
    if (m.konu !== yeniKonu || m.topic_key !== "Matematik > " + yeniKonu || (kk && String(m.kodlar) !== String(kk.kodlar))) {
      m.konu = yeniKonu;
      m.topic_key = "Matematik > " + yeniKonu;
      if (kk) { m.kodlar = kk.kodlar.slice(); m.kod_guven = "kesin"; }
      m.konu_guven = "kesin";
      metinDuzeltme++;
    }
  }
  if (K.ozet && typeof K.ozet === "object") {
    K.ozet.konu = K.konular.length;
    K.ozet.metin = (K.metin_esleme || []).length;
    K.ozet.eslesen_konu = K.konular.filter(k => (k.kodlar || []).length > 0).length;
    const mat = K.konular.filter(k => k.ders === "Matematik");
    if (K.ozet.ders_bazli && K.ozet.ders_bazli.Matematik) {
      K.ozet.ders_bazli.Matematik.konu = mat.length;
      K.ozet.ders_bazli.Matematik.kesin = mat.filter(k => k.guven === "kesin").length;
      K.ozet.ders_bazli.Matematik.yapisal = mat.filter(k => k.guven === "yapisal").length;
    }
  }
  kaydet(KAZANIM, JSON.stringify(K, null, 1) + "\n");
  bildir("✔ kazanim_konu_10.json: " + konuDuzeltme + " konu · " + metinDuzeltme + " metin kaydı güncellendi");
} catch (e) { bildir("✗ kazanim: " + e.message); hata++; }

/* ---- 4) okz-meb.js METIN başlıkları ---- */
try {
  let s = fs.readFileSync(OKZ_JS, "utf8");
  let n = 0;
  for (const [id, eskiKonu] of Object.entries(ESKI_AD)) {
    const yeni = yeniAd(id);
    if (!yeni || yeni === eskiKonu) continue;
    const eskiPar = '"konu_id":"' + id + '","konu":"' + eskiKonu + '","topic_key":"Matematik > ' + eskiKonu + '"';
    const yeniPar = '"konu_id":"' + id + '","konu":"' + yeni + '","topic_key":"Matematik > ' + yeni + '"';
    if (s.includes(yeniPar)) continue;
    if (!s.includes(eskiPar)) { bildir("✗ okz-meb.js: " + id + " kaydı beklenen başlıkla bulunamadı"); hata++; continue; }
    s = s.split(eskiPar).join(yeniPar);
    n++;
  }
  kaydet(OKZ_JS, s);
  bildir("✔ okz-meb.js: " + n + " METIN başlığı kitabın başlığına bağlandı");
} catch (e) { bildir("✗ okz-meb.js: " + e.message); hata++; }

/* ---- 5) konu-anahtar.js ---- */
try {
  let s = fs.readFileSync(ANAHTAR, "utf8");
  let n = 0;
  for (const [id, eskiKonu] of Object.entries(ESKI_AD)) {
    const yeni = yeniAd(id);
    if (!yeni || yeni === eskiKonu) continue;
    const eski = 'konu: "' + eskiKonu + '"';
    if (s.includes('konu: "' + yeni + '"')) continue;
    if (!s.includes(eski)) continue;   /* bu konu için kural yoksa aşağıda eklenir */
    s = s.replace(eski, 'konu: "' + yeni + '"');
    n++;
  }
  /* Kuralı olmayan konular için yeni kurallar */
  const EKLENECEK = [
    ['2.1 İki Kategorik Değişkenin İlişkililiğini İçeren İstatistiksel Problemi Oluşturma, Veri Toplama, Analiz Etme ve Yorumlama',
      /kategorik degisken|iki yonlu tablo|kontenjans|istatistiksel arastirma/],
    ['2.2 Başkaları Tarafından Oluşturulan İki Kategorik Değişkenli Verilerin İlişkililiğine Dayalı İstatistiksel Sonuç veya Yorumları Tartışma',
      /istatistiksel sonuc|yorum.*tartis|yanlilik|orneklem/],
    ['4.1 Gerçek Sayılarda Tanımlı Fonksiyonların Nitel Özellikleri',
      /fonksiyonun nitel|bire bir|orten fonksiyon|artan.*azalan/],
    ['4.4 Gerçek Sayılarda Tanımlı Rasyonel Fonksiyonlar ve Nitel Özellikleri',
      /rasyonel fonksiyon|asimptot/],
    ['4.5 Doğrusal, Karesel, Karekök ve Rasyonel Referans Fonksiyonlar ile Bu Fonksiyonlardan Türetilebilen Fonksiyonların Ters Fonksiyonları',
      /ters fonksiyon|tersi fonksiyon/],
    ['4.6 Doğrusal, Karesel, Karekök, Rasyonel Referans Fonksiyonlar ve Bunlardan Türetilen Fonksiyonlarla İfade Edilebilen Denklem ve Eşitsizlikler İçeren Problemlerin Çözümü',
      /denklem.*esitsizlik|esitsizlik.*problem|modelle/],
    ['5.2 Cebirsel ve Fonksiyonel İşlemlerin Algoritmik Yapısı',
      /algoritma|akis semasi|sozde kod|mantik baglac|niceleyici|babil metodu/],
    ['6.1 Dik Koordinat Sisteminde İki Nokta Arasındaki Uzaklık ve Bir Doğru Parçasını Belli Oranda Bölme',
      /iki nokta arasindaki uzaklik|orta nokta|oranda bolme|disdan bolme/],
    ['6.2 Dik Koordinat Sisteminde Doğrunun Özellikleri ve Analitik İncelenmesi',
      /dogrunun egimi|egim|dogru denklemi|paralel.*dik/]
  ];
  const capa = "\n    // ---- Fizik ----";
  if (!s.includes(capa)) { bildir("✗ konu-anahtar.js: Fizik çapası yok"); hata++; }
  else {
    const eklenecek = EKLENECEK.filter(([konu]) => !s.includes('konu: "' + konu + '"'));
    if (eklenecek.length) {
      const blok = eklenecek.map(([konu, desen]) =>
        '    { ders: ["matematik"], konu: ' + JSON.stringify(konu).replace(/"/g, '"').replace(/^"|"$/g, '"') + ',\n      desen: ' + desen.toString() + ' },\n').join("");
      s = s.replace(capa, "\n" + blok.replace(/\n$/, "") + capa);
      n += eklenecek.length;
    }
  }
  kaydet(ANAHTAR, s);
  bildir("✔ konu-anahtar.js: " + n + " Matematik kuralı eklendi/güncellendi");
} catch (e) { bildir("✗ konu-anahtar.js: " + e.message); hata++; }

bildir(hata ? "SONUÇ: " + hata + " hata" : "SONUÇ: tamam");
process.exitCode = hata ? 1 : 0;
