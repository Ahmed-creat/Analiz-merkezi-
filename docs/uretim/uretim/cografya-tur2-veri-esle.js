#!/usr/bin/env node
/* ============================================================
   COĞRAFYA 10 · 2. TUR — kazanım/konu indekslerini kitaba bağlar
   ------------------------------------------------------------
   Bu turda 18 havuz (1.1, 2.1-2.2, 3.1-3.5, 4.1-4.2, 5.1-5.3,
   6.1-6.4, 7.1) ders kitabından sıfırdan yazıldı. Ağaç kitabın
   içindekiler düzeyine çekildiği için her havuz kendi MEB çıktısıyla
   1:1 eşlenir (18 konu ↔ 18 çıktı).

   Güncellenen dosyalar:
     · site/content/konu_esleme.json               (18 coğrafya havuzu)
     · site/content/mufredat/kazanim_konu_10.json   (18 coğrafya konusu)
     · site/okz-meb.js                             METIN coğrafya kayıtları
     · site/konu-anahtar.js                        anahtar sözcük kuralları
     · tests/*.test.js                             havuz sayısı

   Kullanım: node docs/uretim/uretim/cografya-tur2-veri-esle.js [--kontrol]
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const KONTROL = process.argv.includes("--kontrol");
let hata = 0;
const bildir = m => console.log(m);
const kaydet = (y, v) => { if (!KONTROL) fs.writeFileSync(y, v, "utf8"); };

/* okz-meb.js arama anahtarı: sade + son kelimeden ek atma. */
const EKLER = ["yabilmeniz", "yebilmeniz", "abilmeniz", "ebilmeniz", "yabilmenizi", "yebilmenizi",
  "abilmenizi", "ebilmenizi", "yabilme", "yebilme", "abilme", "ebilme",
  "yabilmek", "yebilmek", "abilmek", "ebilmek", "maniz", "meniz", "malari", "meleri", "masi", "mesi"];
function sadeKok(s) {
  let t = String(s == null ? "" : s)
    .replace(/ı/g, "i").replace(/İ/g, "i").replace(/I/g, "i")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) return "";
  const k = t.split(" ");
  const son = k[k.length - 1];
  for (const ek of EKLER) {
    if (son.length > ek.length && son.slice(-ek.length) === ek && son.length - ek.length >= 3) {
      k[k.length - 1] = son.slice(0, son.length - ek.length);
      break;
    }
  }
  return k.join(" ");
}

const HAVUZ_DIR = path.join(KOK, "site", "content", "soru_havuzlari");
const ESLEME = path.join(KOK, "site", "content", "konu_esleme.json");
const KAZANIM = path.join(KOK, "site", "content", "mufredat", "kazanim_konu_10.json");
const MEB = path.join(KOK, "site", "content", "mufredat", "meb_kazanim_10.json");
const OKZ_JS = path.join(KOK, "site", "okz-meb.js");
const ANAHTAR = path.join(KOK, "site", "konu-anahtar.js");

/* Canlı havuzlar */
const havuzlar = fs.readdirSync(HAVUZ_DIR).filter(f => /^cogr_10_u\d+_k\d+\.json$/.test(f)).sort();
const canli = new Map();
for (const f of havuzlar) {
  const p = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, f), "utf8"));
  canli.set(p.konu_id, p);
}
if (canli.size !== 18) { bildir("✗ canlı havuz sayısı 18 değil: " + canli.size); hata++; }

/* ---- Çıktı → havuz (kitabın bölümleri, 1:1) ---- */
const KOD_HAVUZ = {
  "COĞ.10.1.1": ["cogr_10_u01_k01"],
  "COĞ.10.2.1": ["cogr_10_u02_k01"],
  "COĞ.10.2.2": ["cogr_10_u02_k02"],
  "COĞ.10.3.1": ["cogr_10_u03_k01"],
  "COĞ.10.3.2": ["cogr_10_u03_k02"],
  "COĞ.10.3.3": ["cogr_10_u03_k03"],
  "COĞ.10.3.4": ["cogr_10_u03_k04"],
  "COĞ.10.3.5": ["cogr_10_u03_k05"],
  "COĞ.10.4.1": ["cogr_10_u04_k01"],
  "COĞ.10.4.2": ["cogr_10_u04_k02"],
  "COĞ.10.5.1": ["cogr_10_u05_k01"],
  "COĞ.10.5.2": ["cogr_10_u05_k02"],
  "COĞ.10.5.3": ["cogr_10_u05_k03"],
  "COĞ.10.6.1": ["cogr_10_u06_k01"],
  "COĞ.10.6.2": ["cogr_10_u06_k02"],
  "COĞ.10.6.3": ["cogr_10_u06_k03"],
  "COĞ.10.6.4": ["cogr_10_u06_k04"],
  "COĞ.10.7.1": ["cogr_10_u07_k01"]
};

const KUNYE = {};
for (const [kod, yerler] of Object.entries(KOD_HAVUZ)) {
  for (const id of yerler) {
    KUNYE[id] = KUNYE[id] || [];
    KUNYE[id].push(kod);
  }
}

/* Kitap sayfalarına dayanan gerekçeler */
const GEREKCE = {
  cogr_10_u01_k01: "Kitabın 1.1 bölümü coğrafyanın konu, bölüm ve ilkelerini örnek olay/olgu üzerinden verir (s.15-24); COĞ.10.1.1.",
  cogr_10_u02_k01: "Kitabın 2.1 bölümü CBS ve uzaktan algılamanın uygulama alanlarını örneklerle verir (s.31-36); COĞ.10.2.1.",
  cogr_10_u02_k02: "Kitabın 2.2 bölümü vektör veri ve katman mantığıyla mekânsal verilerin haritalara aktarılmasını verir (s.37-40); COĞ.10.2.2.",
  cogr_10_u03_k01: "Kitabın 3.1 bölümü levha tektoniği, kıta oluşumu ve tektonik olayların yer şekillerine etkisini verir (s.49-69); COĞ.10.3.1.",
  cogr_10_u03_k02: "Kitabın 3.2 bölümü iklim ile kayaç yapısının aşınma ve çözünme süreçlerine etkisini verir (s.70-75); COĞ.10.3.2.",
  cogr_10_u03_k03: "Kitabın 3.3 bölümü aşınma, taşınma ve biriktirme süreçleriyle oluşan yer şekillerini verir (s.76-96); COĞ.10.3.3.",
  cogr_10_u03_k04: "Kitabın 3.4 bölümü yeryüzü şekillerini saha/sanal saha çalışmasıyla araştırma basamaklarını verir (s.97-98); COĞ.10.3.4.",
  cogr_10_u03_k05: "Kitabın 3.5 bölümü yakın çevredeki yer şekilleri ile beşerî faaliyetler arasındaki etkileşimi verir (s.99-107); COĞ.10.3.5.",
  cogr_10_u04_k01: "Kitabın 4.1 bölümü yerleşme yeri seçimi ve gelişiminde etkili coğrafi faktörleri verir (s.121-129); COĞ.10.4.1.",
  cogr_10_u04_k02: "Kitabın 4.2 bölümü yerleşmelerin fonksiyonlarına göre sınıflandırılmasını verir (s.130-135); COĞ.10.4.2.",
  cogr_10_u05_k01: "Kitabın 5.1 bölümü ekonomik faaliyetlerin sektörlere göre sınıflandırılmasını verir (s.145-152); COĞ.10.5.1.",
  cogr_10_u05_k02: "Kitabın 5.2 bölümü sektörel dağılım tablo ve grafikleri üzerinden ülkeleri karşılaştırır (s.153-156); COĞ.10.5.2.",
  cogr_10_u05_k03: "Kitabın 5.3 bölümü Türkiye ekonomisinin sektörel dağılımını verilerle verir (s.157-159); COĞ.10.5.3.",
  cogr_10_u06_k01: "Kitabın 6.1 bölümü afetlerle mücadelede iyi uygulama örneklerini verir (s.171-179); COĞ.10.6.1.",
  cogr_10_u06_k02: "Kitabın 6.2 bölümü afete dirençli yaşam alanlarının coğrafi koşullarını verir (s.180-184); COĞ.10.6.2.",
  cogr_10_u06_k03: "Kitabın 6.3 bölümü mekân özelliklerine göre korunma uygulamalarını verir (s.185-189); COĞ.10.6.3.",
  cogr_10_u06_k04: "Kitabın 6.4 bölümü afet bilinci oluşturmanın faydalarını verir (s.190-195); COĞ.10.6.4.",
  cogr_10_u07_k01: "Kitabın 7.1 bölümü Türk dünyasının ortak kültürel özelliklerini ve kültürel mirasını verir (s.203-221); COĞ.10.7.1."
};

/* ---- 0) Ortak: kazanım cümlesi (kitabın MEB çıktısı) ---- */
const CIKTI_METIN = (() => {
  const m = new Map();
  try {
    const M = JSON.parse(fs.readFileSync(MEB, "utf8"));
    for (const c of (M.ciktilar || [])) m.set(c.kod, c.kazanim);
  } catch (e) { }
  return m;
})();

/* "...sorgulayabilme" → "...sorgulayabilmeniz," (MEB kazanım dili) */
function kazanimCumlesi(kod) {
  const ham = CIKTI_METIN.get(kod);
  if (!ham) return "";
  let s = ham.charAt(0).toLocaleLowerCase("tr") + ham.slice(1);
  s = s.replace(/bilme$/, "bilmeniz,").replace(/bilme\.$/, "bilmeniz,");
  if (!/,$/.test(s)) s = s.replace(/\.$/, "") + ",";
  return s;
}

const tema = id => Number(String(id).match(/^cogr_10_u0(\d)_/)[1]);
let HAVUZ_SAYISI = 0;
const cogrMu = k => /^cogr_10_u\d+_k\d+$/.test(String(k.konu_id));

/* ---- 1) konu_esleme.json ---- */
try {
  const E = JSON.parse(fs.readFileSync(ESLEME, "utf8"));
  const hav = Array.isArray(E.havuzlar) ? E.havuzlar : [];
  const digerleri = hav.filter(h => !cogrMu(h));
  const yeni = [];
  for (const [id, p] of canli) {
    const beceriler = [...new Set((p.sorular || []).map(s => s.alt_beceri).filter(Boolean))];
    yeni.push({
      konu_id: id,
      ders: "Coğrafya",
      topic_key: p.topic_key || "Coğrafya > " + p.baslik,
      konu: p.baslik,
      soru: (p.sorular || []).length,
      metin: [p.baslik, p.baslik, ...beceriler].join(" · ")
    });
  }
  const hepsi = [...digerleri, ...yeni].sort((a, b) => String(a.konu_id).localeCompare(String(b.konu_id), "tr"));
  E.havuzlar = hepsi;
  E.havuz_sayisi = hepsi.length;
  HAVUZ_SAYISI = hepsi.length;
  kaydet(ESLEME, JSON.stringify(E, null, 1) + "\n");
  bildir("✔ konu_esleme.json: " + yeni.length + " coğrafya havuzu · toplam " + hepsi.length);
} catch (e) { bildir("✗ konu_esleme.json: " + e.message); hata++; }

/* ---- 2) kazanim_konu_10.json ---- */
try {
  const K = JSON.parse(fs.readFileSync(KAZANIM, "utf8"));
  K.konular = Array.isArray(K.konular) ? K.konular : [];
  const ilkYer = K.konular.findIndex(cogrMu);
  if (ilkYer < 0) throw new Error("coğrafya kaydı yok");

  const duzen = Object.keys(KUNYE)
    .map(id => ({ id, kodlar: KUNYE[id] }))
    .sort((a, b) => a.id.localeCompare(b.id, "tr"));

  const kayitlar = duzen.map(({ id, kodlar }) => {
    const p = canli.get(id);
    const kodlarSirali = kodlar.slice().sort((a, b) => Number(a.split(".").pop()) - Number(b.split(".").pop()));
    return {
      konu_id: id,
      ders: "Coğrafya",
      konu: p ? p.baslik : id,
      tema: tema(id),
      kodlar: kodlarSirali,
      guven: "kesin",
      yontem: "kitap-bolumu",
      skor: 1,
      uyari: "",
      gerekce: GEREKCE[id] || "",
      kazanim_metinleri: kodlarSirali.length,
      metin_kodlari: kodlarSirali.map(kod => ({ metin: kazanimCumlesi(kod).replace(/,$/, ""), kod, skor: 1 }))
    };
  });

  /* 18 konu ↔ 18 çıktı: her konu tam bir kod taşımalı */
  const kodlar18 = new Set();
  for (const k of kayitlar) {
    if ((k.kodlar || []).length !== 1) { bildir("✗ tek kod taşımayan konu: " + k.konu_id); hata++; }
    for (const c of (k.kodlar || [])) kodlar18.add(c);
  }
  if (kodlar18.size !== 18) { bildir("✗ kapsanan çıktı sayısı 18 değil: " + kodlar18.size); hata++; }
  for (const id of canli.keys()) if (!KUNYE[id]) { bildir("✗ kazanımsız havuz: " + id); hata++; }

  const kalan = K.konular.filter(k => !cogrMu(k));
  K.konular = [...kalan.slice(0, ilkYer), ...kayitlar, ...kalan.slice(ilkYer)];

  /* metin_esleme */
  const ME = Array.isArray(K.metin_esleme) ? K.metin_esleme : [];
  const ilkMetin = ME.findIndex(m => m.ders === "Coğrafya");
  const digerleri = ME.filter(m => m.ders !== "Coğrafya");
  const yeniME = [];
  for (const kod of Object.keys(KOD_HAVUZ)) {
    const metin = kazanimCumlesi(kod);
    for (const id of KOD_HAVUZ[kod]) {
      const p = canli.get(id);
      const konu = p ? p.baslik : id;
      yeniME.push({
        ders: "Coğrafya",
        metin,
        norm: sadeKok(metin),
        konu_id: id,
        konu,
        topic_key: "Coğrafya > " + konu,
        kodlar: [kod],
        kod_guven: "kesin",
        konu_guven: KOD_HAVUZ[kod].length > 1 ? "coklu" : "kesin"
      });
    }
  }
  const yerMetin = ilkMetin < 0 ? digerleri.length : ilkMetin;
  K.metin_esleme = [...digerleri.slice(0, yerMetin), ...yeniME, ...digerleri.slice(yerMetin)];

  /* Özet */
  const cogr = K.konular.filter(k => k.ders === "Coğrafya");
  const cogrMetin = K.metin_esleme.filter(m => m.ders === "Coğrafya");
  const tekKonu = (m) => new Set(K.metin_esleme.filter(x => x.norm === m.norm).map(x => x.konu_id)).size;
  if (K.ozet && typeof K.ozet === "object") {
    K.ozet.konu = K.konular.length;
    K.ozet.eslesen_konu = K.konular.filter(k => (k.kodlar || []).length > 0).length;
    K.ozet.metin = K.metin_esleme.length;
    K.ozet.metin_tek_konu = K.metin_esleme.filter(m => tekKonu(m) === 1).length;
    K.ozet.metin_kodlu = K.metin_esleme.filter(m => (m.kodlar || []).length > 0).length;
    K.ozet.oneri_konu = K.konular.filter(k => k.guven === "orta").length;
    K.ozet.eslesmeyen_konu = K.konular.filter(k => k.guven === "yok").length;
    if (K.ozet.ders_bazli && K.ozet.ders_bazli.Coğrafya) {
      K.ozet.ders_bazli.Coğrafya = {
        konu: cogr.length,
        cikti: 18,
        kesin: cogr.filter(k => k.guven === "kesin").length,
        yapisal: cogr.filter(k => k.guven === "yapisal").length,
        orta: cogr.filter(k => k.guven === "orta").length,
        yok: cogr.filter(k => k.guven === "yok").length,
        metin: cogrMetin.length,
        metin_tek_konu: cogrMetin.filter(m => tekKonu(m) === 1).length,
        metin_kodlu: cogrMetin.filter(m => (m.kodlar || []).length > 0).length
      };
    }
  }
  kaydet(KAZANIM, JSON.stringify(K, null, 1) + "\n");
  bildir("✔ kazanim_konu_10.json: " + kayitlar.length + " coğrafya konusu · " +
    yeniME.length + " metin kaydı · konu toplam " + K.konular.length);
} catch (e) { bildir("✗ kazanim: " + e.message); hata++; }

/* ---- 3) okz-meb.js METIN ---- */
try {
  let s = fs.readFileSync(OKZ_JS, "utf8");
  const on = s.indexOf("var METIN = [");
  const son = s.indexOf("];", on);
  if (on < 0 || son < 0) throw new Error("METIN dizisi bulunamadı");
  const metin = JSON.parse(s.slice(on + "var METIN = ".length, son + 1));
  const digerleri = metin.filter(m => m.ders !== "Coğrafya");
  const cogr = [];
  for (const kod of Object.keys(KOD_HAVUZ)) {
    const cumle = kazanimCumlesi(kod);
    for (const id of KOD_HAVUZ[kod]) {
      const p = canli.get(id);
      const konu = p ? p.baslik : id;
      cogr.push({
        ders: "Coğrafya",
        norm: sadeKok(cumle),
        metin: cumle,
        konu_id: id,
        konu,
        topic_key: "Coğrafya > " + konu,
        kodlar: [kod],
        konu_guven: KOD_HAVUZ[kod].length > 1 ? "coklu" : "kesin",
        kod_guven: "kesin"
      });
    }
  }
  const ilk = metin.findIndex(m => m.ders === "Coğrafya");
  const yer = ilk < 0 ? digerleri.length : ilk;
  const yeni = [...digerleri.slice(0, yer), ...cogr, ...digerleri.slice(yer)];
  s = s.slice(0, on + "var METIN = ".length) + JSON.stringify(yeni) + s.slice(son + 1);
  kaydet(OKZ_JS, s);
  bildir("✔ okz-meb.js: METIN " + cogr.length + " coğrafya kaydı kitabın başlıklarına bağlandı");
} catch (e) { bildir("✗ okz-meb.js: " + e.message); hata++; }

/* ---- 4) konu-anahtar.js ---- */
try {
  let s = fs.readFileSync(ANAHTAR, "utf8");
  /* Özel → genel sıralı; ilk eşleşen kazanır. */
  const KURALLAR = [
    ["7.1 Türk Kültürünün Mekânsal Özellikleri", /turk dunyasi|turk kultur|kulturel miras|turkistan|nevruz|hidirellez|ahi|yunus|destan/],
    ["6.4 Afet Bilinci", /afet bilinci|afet egitimi|tatbikat|afet cantasi|unisdr/],
    ["6.3 Afetlerden Korunma", /afetlerden korunma|yapisal olmayan risk|istinat|dere islah|kentsel donusum|guclendirme/],
    ["6.2 Afetlere Karşı Dirençli Yaşam Alanları", /direncli yasam|direnclilik|saglamlik|yedeklilik|kapsayicilik|risk haritasi/],
    ["6.1 Afetlerle Mücadelede İyi Uygulama Örnekleri", /afetle mucadele|iyi uygulama|erken uyari|tsunami|kasirga|heyelan|orman yangini/],
    ["5.3 Türkiye Ekonomisinin Sektörel Dağılımı", /turkiye ekonomisinin sektorel|turkiye.*sektorel dagilim|gsyih/],
    ["5.2 Ekonomik Sektörler ve Gelişmişlik", /sektorel dagilim|gelismislik|sektorlerin dagilimi/],
    ["5.1 Ekonomik Faaliyetlerin Özellikleri", /ekonomik faaliyet.*ozellik|ekonomik faaliyetleri.*siniflandir|besincil|dorduncu sektor/],
    ["4.2 Yerleşmelerin Fonksiyonları", /yerlesme.*fonksiyon|fonksiyon.*yerlesme|metropol|sehir.*fonksiyon/],
    ["4.1 Yerleşmelerin Kuruluşu ve Gelişimi", /yerlesme yeri|yerlesmenin kurulus|yerlesme.*gelisim|koy|kasaba/],
    ["3.5 Yeryüzü Şekilleri ile Beşerî Faaliyetler Arasındaki Etkileşim", /beser[iî] faaliyet|yer sekli.*etkilesim|yeryuzu sekli.*beser/],
    ["3.4 Yeryüzü Şekilleri ile İlgili Gözlem ve Saha Çalışması", /saha calismasi|g[oö]zlem|arazi calismasi/],
    ["3.3 Aşınma, Taşınma ve Biriktirme Süreçlerinin Yeryüzünün Şekillenmesine Etkisi", /asinim|birikim|tasinma|vadi|delta|karst|dolin|magara|moren|barkan/],
    ["3.2 İklim ve Kayaç Yapısının Aşınma ve Çözünme Süreçlerine Etkisi", /cozunme|kayac yapisi|fiziksel.*kimyasal.*ayris|ayrisma/],
    ["3.1 Tektonik Süreçler", /tektonik|fay hatti|levha hareket|orojenez|epirojenez|volkan/],
    ["2.2 Mekânsal Verilerin Haritalara Aktarılması", /vektor|katman|mekansal veri.*harita|altlik harita/],
    ["2.1 CBS ve Uzaktan Algılamanın Uygulama Alanları", /cbs|uzaktan algilama|cografi bilgi sistem/],
    ["1.1 Coğrafi Bakış", /ornek olay|olguyu|olgunun|mekanin|mekanlar|temel kavramlari ile iliskilendir|cografi bakis/]
  ];

  /* Eski coğrafya bloklarını (satır bazlı) at, yenisini Coğrafya çapasına yaz */
  const satirlar = s.split("\n");
  const kalanSatir = [];
  let atla = false;
  for (const satir of satirlar) {
    if (/^\s*\{ ders: \["cografya"\]/.test(satir)) { atla = true; continue; }
    if (atla) {
      if (/desen:/.test(satir)) { atla = false; continue; }
      if (/^\s*$/.test(satir)) { atla = false; continue; }
      atla = false;
    }
    kalanSatir.push(satir);
  }
  s = kalanSatir.join("\n");

  const capa = "\n    // ---- Coğrafya ----";
  if (!s.includes(capa)) throw new Error("Coğrafya çapası yok");
  const blok = KURALLAR.map(([konu, desen]) =>
    '    { ders: ["cografya"], konu: ' + JSON.stringify(konu) + ',\n      desen: ' + desen.toString() + ' },').join("\n");
  s = s.replace(capa, capa + "\n" + blok);
  kaydet(ANAHTAR, s);
  bildir("✔ konu-anahtar.js: " + KURALLAR.length + " coğrafya kuralı yazıldı");
} catch (e) { bildir("✗ konu-anahtar.js: " + e.message); hata++; }

/* ---- 5) Testlerdeki havuz sayısı ---- */
try {
  const havuzSayisi = HAVUZ_SAYISI || JSON.parse(fs.readFileSync(ESLEME, "utf8")).havuz_sayisi;
  const TESTLER = [
    [path.join(KOK, "tests", "okz-konu.test.js"), /esit\("indeks: \d+ havuz", indeks\.N, \d+\);/, 'esit("indeks: ' + havuzSayisi + ' havuz", indeks.N, ' + havuzSayisi + ");"],
    [path.join(KOK, "tests", "okz-konu-entegrasyon.test.js"), /idx\.N === \d+/, "idx.N === " + havuzSayisi],
    [path.join(KOK, "tests", "meb-kazanim.test.js"), /esit\("havuz sayısı \d+", konular\.length, \d+\);/, 'esit("havuz sayısı ' + havuzSayisi + '", konular.length, ' + havuzSayisi + ");"]
  ];
  for (const [dosya, desen, yeni] of TESTLER) {
    if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
    const s = fs.readFileSync(dosya, "utf8");
    if (!desen.test(s)) { bildir("✗ desen yok: " + path.relative(KOK, dosya)); hata++; continue; }
    const guncel = s.replace(desen, yeni);
    if (guncel !== s) kaydet(dosya, guncel);
    bildir("✔ " + path.relative(KOK, dosya) + ": havuz sayısı " + havuzSayisi);
  }
} catch (e) { bildir("✗ testler: " + e.message); hata++; }

bildir(hata ? "SONUÇ: " + hata + " hata" : "SONUÇ: tamam");
process.exitCode = hata ? 1 : 0;
