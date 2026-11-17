#!/usr/bin/env node
/* ============================================================
   KİMYA 10 · 2. TUR — kazanım/konu indekslerini kitaba bağlar
   ------------------------------------------------------------
   Bu turda 19 havuz kitaptan sıfırdan yazıldı; ağaç kitabın
   içindekiler düzeyine çekildi. Yeni tur iki yazım hatasını
   düzeltir ("Eftizyon" → "Efüzyon", "Çözünürlğe" → "Çözünürlüğe")
   ve 5 yeni konu açar: 1.2.2 Kinetik Moleküler Teori,
   2.1.6, 2.1.7, 2.1.8, 3.1.1.

   Havuz ↔ çıktı eşlemesi (kitabın bölümlerine göre, 21 çıktı):
     1.1+1.2 → u01_k01   1.3 → u01_k02   1.4+1.5 → u01_k03
     1.6 → u01_k04       1.7 → u01_k05   1.8+1.9 → u01_k06
     1.9 → u01_k07 (kinetik teori, 1.9'u gaz yasalarıyla paylaşır)
     1.10 → u01_k08      1.11 → u01_k09
     2.1 → u02_k01       2.2 → u02_k02   2.3 → u02_k03
     2.7 → u02_k04 (molar derişim)      2.4 → u02_k05
     2.5 → u02_k06       2.6 → u02_k07   2.8 → u02_k08
     3.1 → u03_k01       3.2 → u03_k02

   Güncellenen dosyalar:
     · site/content/konu_esleme.json          (19 kimya havuzu)
     · site/content/mufredat/kazanim_konu_10.json (kimya kayıtları)
     · site/okz-meb.js                        METIN kimya kayıtları
     · site/konu-anahtar.js                   anahtar sözcük kuralları
     · tests/*.test.js                        havuz sayısı 156 → 161

   Kullanım: node docs/uretim/uretim/kimya-tur2-veri-esle.js [--kontrol]
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const KONTROL = process.argv.includes("--kontrol");
let hata = 0;
const bildir = m => console.log(m);
const kaydet = (y, v) => { if (!KONTROL) fs.writeFileSync(y, v, "utf8"); };

const OKZK = require(path.join(KOK, "site", "okz-konu.js"));

/* okz-meb.js arama anahtarı: sade + son kelimeden ek atma.
   METIN.norm alanı bu fonksiyonun çıktısı olmak zorunda, yoksa
   konuBul() havuzun kendi kazanım cümlesini bulamaz. */
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
const havuzlar = fs.readdirSync(HAVUZ_DIR).filter(f => /^kimya_10_u\d+_k\d+\.json$/.test(f)).sort();
const canli = new Map();
for (const f of havuzlar) {
  const p = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, f), "utf8"));
  canli.set(p.konu_id, p);
}

/* ---- Çıktı → havuz (kitabın bölümleri) ---- */
const KOD_HAVUZ = {
  "KİM.10.1.1": ["kimya_10_u01_k01"],
  "KİM.10.1.2": ["kimya_10_u01_k01"],
  "KİM.10.1.3": ["kimya_10_u01_k02"],
  "KİM.10.1.4": ["kimya_10_u01_k03"],
  "KİM.10.1.5": ["kimya_10_u01_k03"],
  "KİM.10.1.6": ["kimya_10_u01_k04"],
  "KİM.10.1.7": ["kimya_10_u01_k05"],
  "KİM.10.1.8": ["kimya_10_u01_k06"],
  "KİM.10.1.9": ["kimya_10_u01_k06", "kimya_10_u01_k07"],
  "KİM.10.1.10": ["kimya_10_u01_k08"],
  "KİM.10.1.11": ["kimya_10_u01_k09"],
  "KİM.10.2.1": ["kimya_10_u02_k01"],
  "KİM.10.2.2": ["kimya_10_u02_k02"],
  "KİM.10.2.3": ["kimya_10_u02_k03"],
  "KİM.10.2.7": ["kimya_10_u02_k04"],
  "KİM.10.2.4": ["kimya_10_u02_k05"],
  "KİM.10.2.5": ["kimya_10_u02_k06"],
  "KİM.10.2.6": ["kimya_10_u02_k07"],
  "KİM.10.2.8": ["kimya_10_u02_k08"],
  "KİM.10.3.1": ["kimya_10_u03_k01"],
  "KİM.10.3.2": ["kimya_10_u03_k02"]
};

/* Konu → çıktılar (birden çok kod taşıyan konular) */
const KUNYE = {};
for (const [kod, yerler] of Object.entries(KOD_HAVUZ)) {
  for (const id of yerler) {
    KUNYE[id] = KUNYE[id] || [];
    KUNYE[id].push(kod);
  }
}

/* Kitap sayfalarına dayanan gerekçeler */
const GEREKCE = {
  kimya_10_u01_k01: "Kitabın 1.1.1 bölümü kimyasal değişimin kanıtlarını ve tepkimenin oluşumunu tanecik modeliyle verir (s.21-34); KİM.10.1.1-1.2.",
  kimya_10_u01_k02: "Kitabın 1.1.2 bölümü yanma, asit-baz, çökelme ve redoks tepkimelerini gözlemlenebilir göstergelerle sınıflandırır (s.35-46); KİM.10.1.3.",
  kimya_10_u01_k03: "Kitabın 1.1.3 bölümü mol kavramını ve saf maddelerin ölçülebilir özellikleriyle (m, MA, N_A) ilişkisini verir (s.47-60); KİM.10.1.4-1.5.",
  kimya_10_u01_k04: "Kitabın 1.1.4 bölümü denklemlerdeki tanecik sayısı tutarsızlıklarını denkleştirmeyle giderir (s.61-67); KİM.10.1.6.",
  kimya_10_u01_k05: "Kitabın 1.1.5 bölümü mol oranlarıyla stokiyometrik hesaplamaları ve verim problemlerini verir (s.68-76); KİM.10.1.7.",
  kimya_10_u01_k06: "Kitabın 1.2.1 bölümü gazların ölçülebilir özelliklerini ve Boyle-Charles-Avogadro yasalarını verir (s.77-93); KİM.10.1.8-1.9.",
  kimya_10_u01_k07: "Kitabın 1.2.2 bölümü gazların özelliklerini kinetik moleküler teoriyle açıklar (s.94-97); KİM.10.1.9'un model ayağı.",
  kimya_10_u01_k08: "Kitabın 1.2.3 bölümü ideal gaz denklemini ve R sabitini tümevarımla kurar (s.98-105); KİM.10.1.10.",
  kimya_10_u01_k09: "Kitabın 1.2.4 bölümü gazların farklı ortamlarda yayılmasını (difüzyon-efüzyon) deney ve Graham yasasıyla verir (s.106-113); KİM.10.1.11.",
  kimya_10_u02_k01: "Kitabın 2.1.1 bölümü çözünme sürecini üç aşamada ve tanecik düzeyinde modeller (s.151-155); KİM.10.2.1.",
  kimya_10_u02_k02: "Kitabın 2.1.2 bölümü maddelerin birbiri içinde çözünebilirliğini polarite kanıtlarıyla açıklar (s.156-163); KİM.10.2.2.",
  kimya_10_u02_k03: "Kitabın 2.1.3 bölümü çözünmeyi iyonik/moleküler ve fiziksel/kimyasal olarak sınıflandırır (s.164-171); KİM.10.2.3.",
  kimya_10_u02_k04: "Kitabın 2.1.4 bölümü molarite, ppm ve seyreltme hesaplarını verir (s.172-178); KİM.10.2.7.",
  kimya_10_u02_k05: "Kitabın 2.1.5 bölümü çözünürlük kavramını 100 g çözücüde çözünen miktar olarak tanımlar (s.179-183); KİM.10.2.4.",
  kimya_10_u02_k06: "Kitabın 2.1.6 bölümü madde cinsi, sıcaklık ve basıncın çözünürlüğe etkisini kanıtlarla verir (s.184-191); KİM.10.2.5.",
  kimya_10_u02_k07: "Kitabın 2.1.7 bölümü çözeltileri elektrolitlik ve doygunluk bakımından sınıflandırır (s.192-201); KİM.10.2.6.",
  kimya_10_u02_k08: "Kitabın 2.1.8 bölümü tanecik sayısının kaynama/donma noktasına etkisini koligatif özelliklerle verir (s.202-210); KİM.10.2.8.",
  kimya_10_u03_k01: "Kitabın 3.1.1 bölümü makro/mikro ölçekli deneyleri atom ekonomisi ve su ayak iziyle karşılaştırır (s.238-246); KİM.10.3.1.",
  kimya_10_u03_k02: "Kitabın 3.1.2 bölümü atmosferdeki tepkimeleri (sera etkisi, asit yağmuru, ozon) küresel sorunlarla ilişkilendirir (s.247-255); KİM.10.3.2."
};

/* ---- 0) Ortak: metin sözlüğü (kod → kazanım cümlesi) ---- */
const MEVCUT_METIN = (() => {
  const m = new Map();
  try {
    const K = JSON.parse(fs.readFileSync(KAZANIM, "utf8"));
    for (const r of (K.metin_esleme || [])) {
      if (r.ders !== "Kimya") continue;
      for (const kod of (r.kodlar || [])) if (!m.has(kod)) m.set(kod, r.metin);
    }
  } catch (e) { /* aşağıda MEB'den tamamlanır */ }
  return m;
})();

const CIKTI_METIN = (() => {
  const m = new Map();
  try {
    const M = JSON.parse(fs.readFileSync(MEB, "utf8"));
    for (const c of (M.ciktilar || [])) m.set(c.kod, c.kazanim);
  } catch (e) { }
  return m;
})();

/* "...yapabilme" → "...yapabilmeniz," (MEB kazanım dili) */
function kazanimCumlesi(kod) {
  const var_ = MEVCUT_METIN.get(kod);
  if (var_) return var_.replace(/[,\s]+$/, "") + ",";
  const ham = CIKTI_METIN.get(kod);
  if (!ham) return "";
  let s = ham.charAt(0).toLocaleLowerCase("tr") + ham.slice(1);
  s = s.replace(/bilme$/, "bilmeniz,").replace(/bilme\.$/, "bilmeniz,");
  if (!/,$/.test(s)) s = s.replace(/\.$/, "") + ",";
  return s;
}

const tema = id => Number(String(id).match(/^kimya_10_u0(\d)_/)[1]);

/* ---- 1) konu_esleme.json ---- */
try {
  const E = JSON.parse(fs.readFileSync(ESLEME, "utf8"));
  const hav = Array.isArray(E.havuzlar) ? E.havuzlar : [];
  let eklenen = 0, duzeltilen = 0;
  for (const [id, p] of canli) {
    const beceriler = [...new Set((p.sorular || []).map(s => s.alt_beceri).filter(Boolean))];
    const kayit = {
      konu_id: id,
      ders: "Kimya",
      topic_key: p.topic_key || "Kimya > " + p.baslik,
      konu: p.baslik,
      soru: (p.sorular || []).length,
      metin: [p.baslik, p.baslik, ...beceriler].join(" · ")
    };
    const yer = hav.findIndex(h => h.konu_id === id);
    if (yer < 0) { hav.push(kayit); eklenen++; }
    else if (hav[yer].konu !== kayit.konu || hav[yer].topic_key !== kayit.topic_key ||
             hav[yer].soru !== kayit.soru || hav[yer].metin !== kayit.metin) {
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

/* ---- 2) kazanim_konu_10.json ---- */
try {
  const K = JSON.parse(fs.readFileSync(KAZANIM, "utf8"));
  K.konular = Array.isArray(K.konular) ? K.konular : [];
  const ilkYer = K.konular.findIndex(k => /^kimya_10_u\d+_k\d+$/.test(String(k.konu_id)));
  if (ilkYer < 0) throw new Error("kimya kaydı yok");

  /* Konu başına kod demeti: aynı konuya düşen kodlar tek kayıtta toplanır */
  const duzen = Object.keys(KUNYE)
    .map(id => ({ id, kodlar: KUNYE[id] }))
    .sort((a, b) => a.id.localeCompare(b.id, "tr"));

  const kayitlar = duzen.map(({ id, kodlar }) => {
    const p = canli.get(id);
    const kodlarSirali = kodlar.slice().sort((a, b) => {
      const na = Number(a.split(".").pop()), nb = Number(b.split(".").pop());
      return na - nb;
    });
    return {
      konu_id: id,
      ders: "Kimya",
      konu: p ? p.baslik : id,
      tema: tema(id),
      kodlar: kodlarSirali,
      guven: "kesin",
      yontem: "elle-dogrulama",
      skor: 0,
      uyari: "",
      gerekce: GEREKCE[id] || "",
      kazanim_metinleri: kodlarSirali.length,
      metin_kodlari: kodlarSirali.map(kod => ({ metin: kazanimCumlesi(kod).replace(/,$/, ""), kod, skor: 1 }))
    };
  });

  /* Eksik konu var mı? */
  const kapsanan = new Set(kayitlar.map(k => k.konu_id));
  for (const id of canli.keys()) if (!kapsanan.has(id)) { bildir("✗ kazanımsız havuz: " + id); hata++; }

  const kalan = K.konular.filter(k => !/^kimya_10_u\d+_k\d+$/.test(String(k.konu_id)));
  K.konular = [...kalan.slice(0, ilkYer), ...kayitlar, ...kalan.slice(ilkYer)];

  /* metin_esleme: kod taşıyan kimya kayıtlarını yeni konuya bağla */
  const ME = Array.isArray(K.metin_esleme) ? K.metin_esleme : [];
  const ilkMetin = ME.findIndex(m => m.ders === "Kimya");
  const digerleri = ME.filter(m => m.ders !== "Kimya");
  const yeniME = [];
  for (const kod of Object.keys(KOD_HAVUZ)) {
    const metin = kazanimCumlesi(kod);
    for (const id of KOD_HAVUZ[kod]) {
      const p = canli.get(id);
      const konu = p ? p.baslik : id;
      yeniME.push({
        ders: "Kimya",
        metin,
        norm: sadeKok(metin),
        konu_id: id,
        konu,
        topic_key: "Kimya > " + konu,
        kodlar: [kod],
        kod_guven: "kesin",
        konu_guven: KOD_HAVUZ[kod].length > 1 ? "coklu" : "kesin"
      });
    }
  }
  const yerMetin = ilkMetin < 0 ? digerleri.length : ilkMetin;
  K.metin_esleme = [...digerleri.slice(0, yerMetin), ...yeniME, ...digerleri.slice(yerMetin)];

  /* Özet */
  const kimya = K.konular.filter(k => k.ders === "Kimya");
  const kimyaMetin = K.metin_esleme.filter(m => m.ders === "Kimya");
  const tekKonu = (m) => new Set(kimyaMetin.filter(x => x.norm === m.norm).map(x => x.konu_id)).size;
  if (K.ozet && typeof K.ozet === "object") {
    K.ozet.konu = K.konular.length;
    K.ozet.eslesen_konu = K.konular.filter(k => (k.kodlar || []).length > 0).length;
    K.ozet.metin = K.metin_esleme.length;
    K.ozet.metin_tek_konu = K.metin_esleme.filter(m => tekKonu(m) === 1).length;
    K.ozet.metin_kodlu = K.metin_esleme.filter(m => (m.kodlar || []).length > 0).length;
    K.ozet.oneri_konu = K.konular.filter(k => k.guven === "orta").length;
    K.ozet.eslesmeyen_konu = K.konular.filter(k => k.guven === "yok").length;
    if (K.ozet.ders_bazli && K.ozet.ders_bazli.Kimya) {
      K.ozet.ders_bazli.Kimya = {
        konu: kimya.length,
        cikti: 21,
        kesin: kimya.filter(k => k.guven === "kesin").length,
        yapisal: kimya.filter(k => k.guven === "yapisal").length,
        orta: kimya.filter(k => k.guven === "orta").length,
        yok: kimya.filter(k => k.guven === "yok").length,
        metin: kimyaMetin.length,
        metin_tek_konu: kimyaMetin.filter(m => tekKonu(m) === 1).length,
        metin_kodlu: kimyaMetin.filter(m => (m.kodlar || []).length > 0).length
      };
    }
  }
  kaydet(KAZANIM, JSON.stringify(K, null, 1) + "\n");
  bildir("✔ kazanim_konu_10.json: " + kayitlar.length + " kimya konusu · " + yeniME.length +
    " metin kaydı · konu toplam " + K.konular.length);
} catch (e) { bildir("✗ kazanim: " + e.message); hata++; }

/* ---- 3) okz-meb.js METIN ---- */
try {
  let s = fs.readFileSync(OKZ_JS, "utf8");
  const on = s.indexOf("var METIN = [");
  const son = s.indexOf("];", on);
  if (on < 0 || son < 0) throw new Error("METIN dizisi bulunamadı");
  const metin = JSON.parse(s.slice(on + "var METIN = ".length, son + 1));
  const digerleri = metin.filter(m => m.ders !== "Kimya");
  const kimya = [];
  for (const kod of Object.keys(KOD_HAVUZ)) {
    const cumle = kazanimCumlesi(kod);
    for (const id of KOD_HAVUZ[kod]) {
      const p = canli.get(id);
      const konu = p ? p.baslik : id;
      kimya.push({
        ders: "Kimya",
        norm: sadeKok(cumle),
        metin: cumle,
        konu_id: id,
        konu,
        topic_key: "Kimya > " + konu,
        kodlar: [kod],
        konu_guven: KOD_HAVUZ[kod].length > 1 ? "coklu" : "kesin",
        kod_guven: "kesin"
      });
    }
  }
  /* Kimya kayıtlarını ilk kimya kaydının yerine yerleştir */
  const ilk = metin.findIndex(m => m.ders === "Kimya");
  const yer = ilk < 0 ? digerleri.length : ilk;
  const yeni = [...digerleri.slice(0, yer), ...kimya, ...digerleri.slice(yer)];
  s = s.slice(0, on + "var METIN = ".length) + JSON.stringify(yeni) + s.slice(son + 1);
  kaydet(OKZ_JS, s);
  bildir("✔ okz-meb.js: METIN " + kimya.length + " kimya kaydı kitabın başlıklarına bağlandı");
} catch (e) { bildir("✗ okz-meb.js: " + e.message); hata++; }

/* ---- 4) konu-anahtar.js ---- */
try {
  let s = fs.readFileSync(ANAHTAR, "utf8");
  let n = 0;
  /* Eski (hatalı) başlıklar */
  const DÜZELT = [
    ["1.2.4 Graham Difüzyon ve Eftizyon Yasası", "1.2.4 Graham Difüzyon ve Efüzyon Yasası"],
    ["2.1.6 Çözünürlğe Etki Eden Faktörler", "2.1.6 Çözünürlüğe Etki Eden Faktörler"]
  ];
  for (const [eski, yeni] of DÜZELT) {
    const eskiPar = 'konu: "' + eski + '"';
    if (s.includes('konu: "' + yeni + '"')) {
      if (s.includes(eskiPar)) { s = s.split(eskiPar).join('konu: "' + yeni + '"'); n++; }
      else continue;
    } else if (s.includes(eskiPar)) {
      s = s.split(eskiPar).join('konu: "' + yeni + '"');
      n++;
    }
  }
  /* Yeni konular için kurallar */
  const EKLENECEK = [
    ["1.1.1 Kimyasal Tepkimelerin Oluşumu", /kimyasal degisim|kanit|tepkime.*olusum|model olustur/],
    ["1.2.2 Gazların Kinetik Moleküler Teorisi", /kinetik molekuler|tanecik hizi|ortalama kinetik enerji/],
    ["1.2.3 İdeal Gaz Yasası", /ideal gaz|genel gaz denklem|r sabiti/],
    ["2.1.1 Çözünme Süreci", /cozunme sureci|hidratasyon|solvatasyon/],
    ["2.1.3 Çözünme Olayının Sınıflandırılması", /iyonik cozunme|molekuler cozunme|elektrolit olmayan/],
    ["2.1.6 Çözünürlüğe Etki Eden Faktörler", /cozunurluge etki|sicaklik.*cozunurluk|basinc.*cozunurluk/],
    ["2.1.7 Çözeltilerin Sınıflandırılması", /doymus|asiri doymus|doymamis|elektrolit cozelti/],
    ["2.1.8 Koligatif Özellikler", /koligatif|kaynama noktasi yuksel|donma noktasi dus|buhar basinci/],
    ["3.1.1 Makro ve Mikro Ölçekli Deneyler", /makro olcek|mikro olcek|atom ekonomisi|su ayak izi/],
    ["3.1.2 Atmosferdeki Tepkimeler ve Küresel Sorunlar", /sera etkisi|asit yagmur|ozon|kuresel isinma|cfc/]
  ];
  const capa = "\n    // ---- Biyoloji ----";
  if (!s.includes(capa)) { bildir("✗ konu-anahtar.js: Biyoloji çapası yok"); hata++; }
  else {
    const eklenecek = EKLENECEK.filter(([konu]) => !s.includes('konu: "' + konu + '"'));
    if (eklenecek.length) {
      const blok = eklenecek.map(([konu, desen]) =>
        '    { ders: ["kimya"], konu: ' + JSON.stringify(konu) + ',\n      desen: ' + desen.toString() + ' },\n').join("");
      s = s.replace(capa, "\n" + blok.replace(/\n$/, "") + capa);
      n += eklenecek.length;
    }
  }
  kaydet(ANAHTAR, s);
  bildir("✔ konu-anahtar.js: " + n + " Kimya kuralı eklendi/güncellendi");
} catch (e) { bildir("✗ konu-anahtar.js: " + e.message); hata++; }

/* ---- 5) Testlerdeki havuz sayısı ---- */
try {
  const havuzSayisi = JSON.parse(fs.readFileSync(ESLEME, "utf8")).havuz_sayisi;
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
