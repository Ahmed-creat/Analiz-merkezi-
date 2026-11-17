#!/usr/bin/env node
/* ============================================================
   FİZİK 10 · 1. ÜNİTE — kazanım/konu indekslerini alt konulara bağlar
   ------------------------------------------------------------
   Fizik 10 ağacının 1. ünitesi ders kitabındaki A)/B) alt başlıklarına
   göre bölündü (bkz. fizik-konulari-guncelle.js). Bu bölünme, türetilmiş
   üç indekse yansıtılmalı; yoksa uygulama eski başlığı arar ve konu
   bulamaz:

     · site/content/mufredat/kazanim_konu_10.json   (konular + metin_esleme)
     · site/content/konu_esleme.json                (havuz başına konu)
     · site/okz-meb.js                              (tarayıcı kazanım katmanı)

   Eşleme kararı (kazanım metnine göre):
     "ivme ve hız değişimi arasındaki ilişki…"            → 1.2.1
     "yatay doğrultuda sabit ivmeli hareket grafikleri…"  → 1.2.2
     "serbest düşmeye yönelik matematiksel hesaplamalar"  → 1.3.2
     "iki boyutta sabit ivmeli hareket…"                  → 1.4
   (1.3.1 ve 1.2.2 içeriğinin bir kısmı 2026 programında 11. sınıfa
    taşındığı için kod yazılmaz — meb-kazanim-uret.js ELLE tablosu.)

   Kullanım:
     node docs/uretim/uretim/fizik-veri-esle.js --kontrol
     node docs/uretim/uretim/fizik-veri-esle.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const KONTROL = process.argv.includes("--kontrol");
let hata = 0;
const bildir = m => console.log(m);

const HAVUZ_DIR = path.join(KOK, "site", "content", "soru_havuzlari");
const ESLEME = path.join(KOK, "site", "content", "konu_esleme.json");
const KAZANIM = path.join(KOK, "site", "content", "mufredat", "kazanim_konu_10.json");
const OKZ_JS = path.join(KOK, "site", "okz-meb.js");
const URETICI = path.join(KOK, "scripts", "meb-kazanim-uret.js");
const ANAHTAR = path.join(KOK, "site", "konu-anahtar.js");

const kaydet = (yol, veri) => {
  if (!KONTROL) fs.writeFileSync(yol, veri, "utf8");
};

/* Yeni havuzların kitap künyesi (başlık + kitaptaki alt başlık) */
const YENI = [
  {
    konu_id: "fizik_10_u01_k05",
    konu: "1.2.1 İvme ve Hız Değişimi Arasındaki İlişki",
    tema: 1,
    alt: "A) İvme ve Hız Değişimi Arasındaki İlişki",
    kodlar: ["FİZ.10.1.2"],
    gerekce: "2026 programı tema 1: sabit ivmeli harekette ivme-hız değişimi ilişkisi çıktısı (FİZ.10.1.2)."
  },
  {
    konu_id: "fizik_10_u01_k06",
    konu: "1.2.2 Yatay Doğrultuda Sabit İvmeyle Hareket Eden Cisimlerin Hareketi",
    tema: 1,
    alt: "B) Yatay Doğrultuda Sabit İvmeyle Hareket Eden Cisimlerin Hareketi",
    kodlar: ["FİZ.10.1.2"],
    gerekce: "Yatay doğrultudaki hareket grafikleri ve matematiksel modelleri FİZ.10.1.2 çıktısının kapsamındadır."
  },
  {
    konu_id: "fizik_10_u01_k07",
    konu: "1.3.1 Düşey Doğrultuda Cisimlerin Sahip Olduğu İvme",
    tema: 1,
    alt: "A) Düşey Doğrultuda Cisimlerin Sahip Olduğu İvme",
    kodlar: [],
    gerekce: "Serbest düşme/yer çekimi ivmesi 2026 programında 11. sınıfa taşındı (FİZ.11.1.1, FİZ.11.1.2); 10. sınıfta karşılığı yok."
  },
  {
    konu_id: "fizik_10_u01_k08",
    konu: "1.3.2 Serbest Düşme Hareketi",
    tema: 1,
    alt: "B) Serbest Düşme Hareketi",
    kodlar: [],
    gerekce: "Serbest düşmenin matematiksel modelleri 2026 programında 11. sınıfta (FİZ.11.1.1, FİZ.11.1.2); 10. sınıfta karşılığı yok."
  },
  {
    konu_id: "fizik_10_u01_k09",
    konu: "1.4 İki Boyutta Sabit İvmeli Hareket",
    tema: 1,
    alt: "1.4 İki Boyutta Sabit İvmeli Hareket",
    kodlar: ["FİZ.10.1.3"],
    gerekce: "İki boyutta sabit ivmeli hareketin modelleri ve grafiksel dönüşümleri FİZ.10.1.3 çıktısına bağlandı."
  }
];

/* 1) Üretici betikteki ELLE tablosu (yeniden üretim aynı sonucu versin) */
try {
  let s = fs.readFileSync(URETICI, "utf8");
  const eskiSatirlar = [
    '  fizik_10_u01_k02: { kodlar: ["FİZ.10.1.2"], gerekce: "2026 programı tema 1: sabit ivmeli hareketin ivme-hız ilişkisi çıktısı." },\n',
    '  fizik_10_u01_k04: { kodlar: ["FİZ.10.1.3"], gerekce: "2026 programında \'iki boyutta sabit ivmeli hareket\' yerine yatay doğrultuda sabit ivmeli hareket grafikleri çıktısı (FİZ.10.1.3)." },\n',
    '  fizik_10_u01_k03: { kodlar: [], gerekce: "Serbest düşme 2026 programında 11. sınıfa taşındı (FİZ.11.1.1, FİZ.11.1.2); 10. sınıfta karşılığı yok." },\n'
  ];
  const yeniSatirlar = YENI.map(y =>
    '  ' + y.konu_id + ': { kodlar: ' + JSON.stringify(y.kodlar) + ', gerekce: ' +
    JSON.stringify(y.gerekce) + ' },\n').join("");
  if (s.includes(yeniSatirlar)) {
    bildir("= üretici ELLE tablosu güncel");
  } else {
    const hepsi = eskiSatirlar.every(x => s.includes(x));
    if (!hepsi) {
      bildir("✗ üretici ELLE tablosunda eski satırlar bulunamadı");
      hata++;
    } else {
      for (const eski of eskiSatirlar) s = s.replace(eski, "");
      s = s.replace("const ELLE = {\n", "const ELLE = {\n" + yeniSatirlar);
      kaydet(URETICI, s);
      bildir("✔ üretici ELLE tablosu: 3 eski kimlik → 5 alt konu");
    }
  }
} catch (e) {
  bildir("✗ üretici güncellenemedi: " + e.message);
  hata++;
}

/* 2) konu_esleme.json — havuz başına konu */
try {
  const E = JSON.parse(fs.readFileSync(ESLEME, "utf8"));
  const havuzlar = Array.isArray(E.havuzlar) ? E.havuzlar : [];
  let eklenen = 0;
  for (const y of YENI) {
    const yol = path.join(HAVUZ_DIR, y.konu_id + ".json");
    if (!fs.existsSync(yol)) { bildir("✗ havuz yok: " + y.konu_id); hata++; continue; }
    const pool = JSON.parse(fs.readFileSync(yol, "utf8"));
    const kayit = {
      konu_id: y.konu_id,
      ders: "Fizik",
      topic_key: "Fizik > " + y.konu,
      konu: y.konu,
      soru: (pool.sorular || []).length,
      metin: y.konu + " · " + y.alt + " · " + y.konu
    };
    const yer = havuzlar.findIndex(h => h.konu_id === y.konu_id);
    if (yer >= 0) havuzlar[yer] = kayit;
    else { havuzlar.push(kayit); eklenen++; }
  }
  havuzlar.sort((a, b) => String(a.konu_id).localeCompare(String(b.konu_id), "tr"));
  E.havuzlar = havuzlar;
  E.havuz_sayisi = havuzlar.length;
  kaydet(ESLEME, JSON.stringify(E, null, 1) + "\n");
  bildir("✔ konu_esleme.json: " + eklenen + " yeni havuz · toplam " + havuzlar.length);
} catch (e) {
  bildir("✗ konu_esleme.json: " + e.message);
  hata++;
}

/* 3) kazanim_konu_10.json — konular + metin_esleme */
try {
  const K = JSON.parse(fs.readFileSync(KAZANIM, "utf8"));
  K.konular = Array.isArray(K.konular) ? K.konular : [];
  let eklenen = 0;
  for (const y of YENI) {
    const kayit = {
      konu_id: y.konu_id,
      ders: "Fizik",
      konu: y.konu,
      tema: y.tema,
      kodlar: y.kodlar,
      guven: y.kodlar.length ? "yapisal" : "yok",
      yontem: "elle-dogrulama",
      skor: 0,
      uyari: "",
      gerekce: y.gerekce,
      kazanim_metinleri: 0,
      metin_kodlari: []
    };
    const yer = K.konular.findIndex(k => k.konu_id === y.konu_id);
    if (yer >= 0) K.konular[yer] = kayit;
    else { K.konular.push(kayit); eklenen++; }
  }
  K.konular.sort((a, b) => String(a.konu_id).localeCompare(String(b.konu_id), "tr"));

  /* metin eşlemesi: eski başlığı taşıyan kayıtlar yeni konuya bağlanır */
  const METIN_ESLEME = [
    ["ivme ve hız değişimi arasındaki ilişkiyi yorumlayabilmeniz", "fizik_10_u01_k05"],
    ["yatay doğrultuda sabit ivmeli hareket grafiklerinden elde edilen matematiksel modelleri", "fizik_10_u01_k06"],
    ["serbest düşmeye yönelik matematiksel hesaplamaları", "fizik_10_u01_k08"],
    ["iki boyutta sabit ivmeli harekete yönelik problem durumlarına", "fizik_10_u01_k09"]
  ];
  let degisen = 0;
  for (const m of (K.metin_esleme || [])) {
    for (const [parca, yeniId] of METIN_ESLEME) {
      if (String(m.metin || "").includes(parca)) {
        const y = YENI.find(x => x.konu_id === yeniId);
        if (m.konu_id !== y.konu_id || m.konu !== y.konu) {
          m.konu_id = y.konu_id;
          m.konu = y.konu;
          m.topic_key = "Fizik > " + y.konu;
          m.kodlar = y.kodlar.slice();
          m.kod_guven = y.kodlar.length ? "yapisal" : "yok";
          degisen++;
        }
      }
    }
  }

  if (K.ozet && typeof K.ozet === "object") {
    K.ozet.konu = K.konular.length;
    K.ozet.eslesen_konu = K.konular.filter(k => (k.kodlar || []).length > 0).length;
    if (K.ozet.ders_bazli && K.ozet.ders_bazli.Fizik) {
      const f = K.konular.filter(k => k.ders === "Fizik");
      K.ozet.ders_bazli.Fizik.konu = f.length;
    }
  }
  kaydet(KAZANIM, JSON.stringify(K, null, 1) + "\n");
  bildir("✔ kazanim_konu_10.json: " + eklenen + " yeni konu · " + degisen + " metin eşlemesi düzeltildi · konu " + K.konular.length);
} catch (e) {
  bildir("✗ kazanim_konu_10.json: " + e.message);
  hata++;
}

/* 4) okz-meb.js — tarayıcı katmanındaki METIN tablosu (üretilmiş dosya;
      burada yalnız 4 kaydın konu kimliği/başlığı düzeltilir) */
try {
  let s = fs.readFileSync(OKZ_JS, "utf8");
  let degisen = 0;
  const ESKI = {
    fizik_10_u01_k02: [
      ["ivme ve hız değişimi arasındaki ilişkiyi yorumlayabilmeniz", "fizik_10_u01_k05"],
      ["yatay doğrultuda sabit ivmeli hareket grafiklerinden elde edilen", "fizik_10_u01_k06"]
    ],
    fizik_10_u01_k03: [["serbest düşmeye yönelik matematiksel hesaplamaları", "fizik_10_u01_k08"]],
    fizik_10_u01_k04: [["iki boyutta sabit ivmeli harekete yönelik problem", "fizik_10_u01_k09"]]
  };
  for (const [eskiId, esler] of Object.entries(ESKI)) {
    for (const [parca, yeniId] of esler) {
      const y = YENI.find(x => x.konu_id === yeniId);
      const eskiParca =
        '"konu_id":"' + eskiId + '","konu":"' +
        (eskiId === "fizik_10_u01_k02" ? "1.2 Bir Boyutta Sabit İvmeli Hareket" :
          eskiId === "fizik_10_u01_k03" ? "1.3 Serbest Düşme" : "1.4 İki Boyutta Sabit İvmeli Hareket") +
        '","topic_key":"Fizik > ' +
        (eskiId === "fizik_10_u01_k02" ? "1.2 Bir Boyutta Sabit İvmeli Hareket" :
          eskiId === "fizik_10_u01_k03" ? "1.3 Serbest Düşme" : "1.4 İki Boyutta Sabit İvmeli Hareket") + '"';
      const yeniParca =
        '"konu_id":"' + y.konu_id + '","konu":"' + y.konu + '","topic_key":"Fizik > ' + y.konu + '"';
      /* yalnız ilgili metnin bulunduğu kaydı değiştir */
      const yer = s.indexOf(parca);
      if (yer < 0) continue;
      const son = s.indexOf("},{", yer);
      const dilim = s.slice(yer, son < 0 ? s.length : son);
      if (dilim.includes(eskiParca)) {
        s = s.slice(0, yer) + dilim.replace(eskiParca, yeniParca) + s.slice(yer + dilim.length);
        degisen++;
      }
    }
  }
  kaydet(OKZ_JS, s);
  bildir("✔ okz-meb.js: " + degisen + " metin kaydı yeni konuya bağlandı" + (degisen === 4 ? "" : " (beklenen 4)"));
  if (degisen !== 4 && degisen !== 0) hata++;
} catch (e) {
  bildir("✗ okz-meb.js: " + e.message);
  hata++;
}

/* 5) site/konu-anahtar.js — anahtar sözcük kuralları */
try {
  let s = fs.readFileSync(ANAHTAR, "utf8");
  const eski =
    '    { ders: ["fizik"], konu: "1.2 Bir Boyutta Sabit İvmeli Hareket",\n' +
    '      desen: /sabit ivme|ivmeli hareket|ivme zaman|ivme.*grafik|grafik.*ivme/ },\n' +
    '    { ders: ["fizik"], konu: "1.1 Sabit Hızlı Hareket",\n' +
    '      desen: /sabit hizli hareket|sabit hizla|sabit suratle|sabit hiz.*grafik/ },\n' +
    '    { ders: ["fizik"], konu: "1.3 Serbest Düşme", desen: /serbest dusme/ },\n';
  const yeni =
    '    { ders: ["fizik"], konu: "1.2.2 Yatay Doğrultuda Sabit İvmeyle Hareket Eden Cisimlerin Hareketi",\n' +
    '      desen: /yatay dogrultuda sabit ivme|ivme zaman|ivme.*grafik|grafik.*ivme|sabit ivme.*grafik/ },\n' +
    '    { ders: ["fizik"], konu: "1.2.1 İvme ve Hız Değişimi Arasındaki İlişki",\n' +
    '      desen: /sabit ivme|ivmeli hareket|ivme ve hiz degisimi|hiz degisimi/ },\n' +
    '    { ders: ["fizik"], konu: "1.1 Sabit Hızlı Hareket",\n' +
    '      desen: /sabit hizli hareket|sabit hizla|sabit suratle|sabit hiz.*grafik/ },\n' +
    '    { ders: ["fizik"], konu: "1.3.2 Serbest Düşme Hareketi",\n' +
    '      desen: /serbest dusme.*hesap|serbest dusme hareketi|serbest dusmeye yonelik/ },\n' +
    '    { ders: ["fizik"], konu: "1.3.1 Düşey Doğrultuda Cisimlerin Sahip Olduğu İvme",\n' +
    '      desen: /serbest dusme|yer cekimi ivmesi|dusey dogrultuda/ },\n';
  if (s.includes(yeni)) {
    bildir("= konu-anahtar.js kuralları güncel");
  } else if (s.includes(eski)) {
    s = s.replace(eski, yeni);
    kaydet(ANAHTAR, s);
    bildir("✔ konu-anahtar.js: fizik 1.2/1.3 kuralları alt konulara ayrıldı");
  } else {
    bildir("✗ konu-anahtar.js: fizik kural bloğu bulunamadı");
    hata++;
  }
} catch (e) {
  bildir("✗ konu-anahtar.js: " + e.message);
  hata++;
}

bildir(hata ? "SONUÇ: " + hata + " hata" : "SONUÇ: tamam");
process.exitCode = hata ? 1 : 0;

/* 6) metin_esleme boşluklarını okz-meb.js METIN tablosundan tamamla
      (arsiv-kayit-temizle.js, arşive giden havuzun metin eşlemesini düşürür;
       yeni havuzların eşlemesi burada geri kurulur.) */
try {
  const okz = fs.readFileSync(OKZ_JS, "utf8");
  const METIN = JSON.parse(okz.match(/var METIN = (\[[\s\S]*?\]);/)[1]);
  const K = JSON.parse(fs.readFileSync(KAZANIM, "utf8"));
  K.metin_esleme = Array.isArray(K.metin_esleme) ? K.metin_esleme : [];
  const varOlan = new Set(K.metin_esleme.map(m => String(m.metin)));
  let eklenen = 0;
  for (const e of METIN) {
    if (!YENI.some(y => y.konu_id === e.konu_id)) continue;
    if (varOlan.has(String(e.metin))) continue;
    K.metin_esleme.push({
      ders: e.ders,
      metin: e.metin,
      norm: e.norm,
      konu_id: e.konu_id,
      konu: e.konu,
      topic_key: e.topic_key,
      kodlar: e.kodlar || [],
      kod_guven: e.kod_guven,
      konu_guven: e.konu_guven
    });
    varOlan.add(String(e.metin));
    eklenen++;
  }
  if (eklenen) {
    if (K.ozet && typeof K.ozet === "object") K.ozet.metin = K.metin_esleme.length;
    kaydet(KAZANIM, JSON.stringify(K, null, 1) + "\n");
  }
  bildir("✔ metin eşlemesi: " + eklenen + " kayıt eklendi · toplam " + K.metin_esleme.length);
} catch (e) {
  bildir("✗ metin eşlemesi tamamlanamadı: " + e.message);
  hata++;
}
