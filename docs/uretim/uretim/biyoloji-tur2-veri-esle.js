#!/usr/bin/env node
/* ============================================================
   BİYOLOJİ 10 · 2. TUR — kazanım/konu indekslerini kitaba bağlar
   ------------------------------------------------------------
   Bu turda 19 havuz (1.1–1.10, 2.1–2.9) ders kitabından sıfırdan
   yazıldı. Ağaç kitabın içindekiler düzeyine çekildiği için her
   havuz kendi MEB çıktısıyla 1:1 eşlenir (19 konu ↔ 19 çıktı).

   Güncellenen dosyalar:
     · site/content/konu_esleme.json               (19 biyoloji havuzu)
     · site/content/mufredat/kazanim_konu_10.json   (19 biyoloji konusu)
     · site/okz-meb.js                             METIN biyoloji kayıtları
     · site/konu-anahtar.js                        anahtar sözcük kuralları
     · tests/*.test.js                             havuz sayısı

   Kullanım: node docs/uretim/uretim/biyoloji-tur2-veri-esle.js [--kontrol]
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
const havuzlar = fs.readdirSync(HAVUZ_DIR).filter(f => /^biyo_10_u\d+_k\d+\.json$/.test(f)).sort();
const canli = new Map();
for (const f of havuzlar) {
  const p = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, f), "utf8"));
  canli.set(p.konu_id, p);
}
if (canli.size !== 19) { bildir("✗ canlı havuz sayısı 19 değil: " + canli.size); hata++; }

/* ---- Çıktı → havuz (kitabın bölümleri, 1:1) ---- */
const KOD_HAVUZ = {
  "BİY.10.1.1": ["biyo_10_u01_k01"],
  "BİY.10.1.2": ["biyo_10_u01_k02"],
  "BİY.10.1.3": ["biyo_10_u01_k03"],
  "BİY.10.1.4": ["biyo_10_u01_k04"],
  "BİY.10.1.5": ["biyo_10_u01_k05"],
  "BİY.10.1.6": ["biyo_10_u01_k06"],
  "BİY.10.1.7": ["biyo_10_u01_k07"],
  "BİY.10.1.8": ["biyo_10_u01_k08"],
  "BİY.10.1.9": ["biyo_10_u01_k09"],
  "BİY.10.1.10": ["biyo_10_u01_k10"],
  "BİY.10.2.1": ["biyo_10_u02_k01"],
  "BİY.10.2.2": ["biyo_10_u02_k02"],
  "BİY.10.2.3": ["biyo_10_u02_k03"],
  "BİY.10.2.4": ["biyo_10_u02_k04"],
  "BİY.10.2.5": ["biyo_10_u02_k05"],
  "BİY.10.2.6": ["biyo_10_u02_k06"],
  "BİY.10.2.7": ["biyo_10_u02_k07"],
  "BİY.10.2.8": ["biyo_10_u02_k08"],
  "BİY.10.2.9": ["biyo_10_u02_k09"]
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
  biyo_10_u01_k01: "Kitabın 1.1 bölümü canlılık için enerjinin gerekliliğini, ATP'nin yapısını ve enerji aktarımındaki rolünü verir (s.16-20); BİY.10.1.1.",
  biyo_10_u01_k02: "Kitabın 1.2 bölümü fotosentez reaksiyonlarını bilimsel model üzerinden açıklar (s.21-26); BİY.10.1.2.",
  biyo_10_u01_k03: "Kitabın 1.3 bölümü fotosentezde kullanılan ve üretilen maddeleri deney düzenekleriyle verir (s.27-31); BİY.10.1.3.",
  biyo_10_u01_k04: "Kitabın 1.4 bölümü kemosentezi kemosentetik canlı örnekleriyle açıklar (s.32-36); BİY.10.1.4.",
  biyo_10_u01_k05: "Kitabın 1.5 bölümü canlılarda sindirim çeşitlerini ve yapılarını sınıflandırır (s.37-39); BİY.10.1.5.",
  biyo_10_u01_k06: "Kitabın 1.6 bölümü insanda sindirim, emilim ve taşıma süreçlerini verir (s.40-47); BİY.10.1.6.",
  biyo_10_u01_k07: "Kitabın 1.7 bölümü hücresel solunum reaksiyonlarını model üzerinden açıklar (s.48-55); BİY.10.1.7.",
  biyo_10_u01_k08: "Kitabın 1.8 bölümü besinlerin solunuma katılma yollarını ve farklı besin gruplarının enerji eldesini karşılaştırır (s.57-62); BİY.10.1.8.",
  biyo_10_u01_k09: "Kitabın 1.9 bölümü fermantasyonu deneylerle (hamur, yoğurt) verir (s.63-66); BİY.10.1.9.",
  biyo_10_u01_k10: "Kitabın 1.10 bölümü besinlerden elde edilen enerjinin metabolik süreçlere katkısını verir (s.67-70); BİY.10.1.10.",
  biyo_10_u02_k01: "Kitabın 2.1 bölümü ekosistemin canlı ve cansız bileşenlerini hiyerarşi içinde verir (s.100-106); BİY.10.2.1.",
  biyo_10_u02_k02: "Kitabın 2.2 bölümü komünite ve popülasyondaki etkileşimleri (rekabet, av-avcı, simbiyoz, süksesyon) verir (s.107-121); BİY.10.2.2.",
  biyo_10_u02_k03: "Kitabın 2.3 bölümü besin zinciri/ağı, enerji piramidi ve biyolojik birikimi verir (s.123-131); BİY.10.2.3.",
  biyo_10_u02_k04: "Kitabın 2.4 bölümü su, karbon ve azot döngülerini model üzerinden verir (s.132-138); BİY.10.2.4.",
  biyo_10_u02_k05: "Kitabın 2.5 bölümü ekolojik sürdürülebilirliğin önemini net sıfır ve sıfır enerjili bina örnekleriyle verir (s.139-141); BİY.10.2.5.",
  biyo_10_u02_k06: "Kitabın 2.6 bölümü sürdürülebilirliği kısıtlayan durumları (habitat kaybı, kirlilik türleri) verir (s.143-152); BİY.10.2.6.",
  biyo_10_u02_k07: "Kitabın 2.7 bölümü ekolojik, karbon ve su ayak izini küçültme yollarını verir (s.155-157); BİY.10.2.7.",
  biyo_10_u02_k08: "Kitabın 2.8 bölümü doğal kaynak ve biyoçeşitlilik koruma çalışmalarını (tür, alan, alan dışı) verir (s.160-166); BİY.10.2.8.",
  biyo_10_u02_k09: "Kitabın 2.9 bölümü atık yönetimini ve bertaraf yöntemlerini verir (s.168-174); BİY.10.2.9."
};

/* ---- 0) Ortak: kazanım cümlesi ---- */
const MEVCUT_METIN = (() => {
  const m = new Map();
  try {
    const K = JSON.parse(fs.readFileSync(KAZANIM, "utf8"));
    for (const r of (K.metin_esleme || [])) {
      if (r.ders !== "Biyoloji") continue;
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

const tema = id => Number(String(id).match(/^biyo_10_u0(\d)_/)[1]);
let HAVUZ_SAYISI = 0;
const biyoMu = k => /^biyo_10_u\d+_k\d+$/.test(String(k.konu_id));

/* ---- 1) konu_esleme.json ---- */
try {
  const E = JSON.parse(fs.readFileSync(ESLEME, "utf8"));
  const hav = Array.isArray(E.havuzlar) ? E.havuzlar : [];
  const digerleri = hav.filter(h => !biyoMu(h));
  const yeni = [];
  for (const [id, p] of canli) {
    const beceriler = [...new Set((p.sorular || []).map(s => s.alt_beceri).filter(Boolean))];
    yeni.push({
      konu_id: id,
      ders: "Biyoloji",
      topic_key: p.topic_key || "Biyoloji > " + p.baslik,
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
  bildir("✔ konu_esleme.json: " + yeni.length + " biyoloji havuzu · toplam " + hepsi.length);
} catch (e) { bildir("✗ konu_esleme.json: " + e.message); hata++; }

/* ---- 2) kazanim_konu_10.json ---- */
try {
  const K = JSON.parse(fs.readFileSync(KAZANIM, "utf8"));
  K.konular = Array.isArray(K.konular) ? K.konular : [];
  const ilkYer = K.konular.findIndex(biyoMu);
  if (ilkYer < 0) throw new Error("biyoloji kaydı yok");

  const duzen = Object.keys(KUNYE)
    .map(id => ({ id, kodlar: KUNYE[id] }))
    .sort((a, b) => a.id.localeCompare(b.id, "tr"));

  const kayitlar = duzen.map(({ id, kodlar }) => {
    const p = canli.get(id);
    const kodlarSirali = kodlar.slice().sort((a, b) => Number(a.split(".").pop()) - Number(b.split(".").pop()));
    return {
      konu_id: id,
      ders: "Biyoloji",
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

  /* 19 konu ↔ 19 çıktı: her konu tam bir kod taşımalı */
  const kodlar19 = new Set();
  for (const k of kayitlar) {
    if ((k.kodlar || []).length !== 1) { bildir("✗ tek kod taşımayan konu: " + k.konu_id); hata++; }
    for (const c of (k.kodlar || [])) kodlar19.add(c);
  }
  if (kodlar19.size !== 19) { bildir("✗ kapsanan çıktı sayısı 19 değil: " + kodlar19.size); hata++; }
  for (const id of canli.keys()) if (!KUNYE[id]) { bildir("✗ kazanımsız havuz: " + id); hata++; }

  const kalan = K.konular.filter(k => !biyoMu(k));
  K.konular = [...kalan.slice(0, ilkYer), ...kayitlar, ...kalan.slice(ilkYer)];

  /* metin_esleme */
  const ME = Array.isArray(K.metin_esleme) ? K.metin_esleme : [];
  const ilkMetin = ME.findIndex(m => m.ders === "Biyoloji");
  const digerleri = ME.filter(m => m.ders !== "Biyoloji");
  const yeniME = [];
  for (const kod of Object.keys(KOD_HAVUZ)) {
    const metin = kazanimCumlesi(kod);
    for (const id of KOD_HAVUZ[kod]) {
      const p = canli.get(id);
      const konu = p ? p.baslik : id;
      yeniME.push({
        ders: "Biyoloji",
        metin,
        norm: sadeKok(metin),
        konu_id: id,
        konu,
        topic_key: "Biyoloji > " + konu,
        kodlar: [kod],
        kod_guven: "kesin",
        konu_guven: KOD_HAVUZ[kod].length > 1 ? "coklu" : "kesin"
      });
    }
  }
  const yerMetin = ilkMetin < 0 ? digerleri.length : ilkMetin;
  K.metin_esleme = [...digerleri.slice(0, yerMetin), ...yeniME, ...digerleri.slice(yerMetin)];

  /* Özet */
  const biyo = K.konular.filter(k => k.ders === "Biyoloji");
  const biyoMetin = K.metin_esleme.filter(m => m.ders === "Biyoloji");
  const tekKonu = (m) => new Set(K.metin_esleme.filter(x => x.norm === m.norm).map(x => x.konu_id)).size;
  if (K.ozet && typeof K.ozet === "object") {
    K.ozet.konu = K.konular.length;
    K.ozet.eslesen_konu = K.konular.filter(k => (k.kodlar || []).length > 0).length;
    K.ozet.metin = K.metin_esleme.length;
    K.ozet.metin_tek_konu = K.metin_esleme.filter(m => tekKonu(m) === 1).length;
    K.ozet.metin_kodlu = K.metin_esleme.filter(m => (m.kodlar || []).length > 0).length;
    K.ozet.oneri_konu = K.konular.filter(k => k.guven === "orta").length;
    K.ozet.eslesmeyen_konu = K.konular.filter(k => k.guven === "yok").length;
    if (K.ozet.ders_bazli && K.ozet.ders_bazli.Biyoloji) {
      K.ozet.ders_bazli.Biyoloji = {
        konu: biyo.length,
        cikti: 19,
        kesin: biyo.filter(k => k.guven === "kesin").length,
        yapisal: biyo.filter(k => k.guven === "yapisal").length,
        orta: biyo.filter(k => k.guven === "orta").length,
        yok: biyo.filter(k => k.guven === "yok").length,
        metin: biyoMetin.length,
        metin_tek_konu: biyoMetin.filter(m => tekKonu(m) === 1).length,
        metin_kodlu: biyoMetin.filter(m => (m.kodlar || []).length > 0).length
      };
    }
  }
  kaydet(KAZANIM, JSON.stringify(K, null, 1) + "\n");
  bildir("✔ kazanim_konu_10.json: " + kayitlar.length + " biyoloji konusu · " +
    yeniME.length + " metin kaydı · konu toplam " + K.konular.length);
} catch (e) { bildir("✗ kazanim: " + e.message); hata++; }

/* ---- 3) okz-meb.js METIN ---- */
try {
  let s = fs.readFileSync(OKZ_JS, "utf8");
  const on = s.indexOf("var METIN = [");
  const son = s.indexOf("];", on);
  if (on < 0 || son < 0) throw new Error("METIN dizisi bulunamadı");
  const metin = JSON.parse(s.slice(on + "var METIN = ".length, son + 1));
  const digerleri = metin.filter(m => m.ders !== "Biyoloji");
  const biyo = [];
  for (const kod of Object.keys(KOD_HAVUZ)) {
    const cumle = kazanimCumlesi(kod);
    for (const id of KOD_HAVUZ[kod]) {
      const p = canli.get(id);
      const konu = p ? p.baslik : id;
      biyo.push({
        ders: "Biyoloji",
        norm: sadeKok(cumle),
        metin: cumle,
        konu_id: id,
        konu,
        topic_key: "Biyoloji > " + konu,
        kodlar: [kod],
        konu_guven: KOD_HAVUZ[kod].length > 1 ? "coklu" : "kesin",
        kod_guven: "kesin"
      });
    }
  }
  const ilk = metin.findIndex(m => m.ders === "Biyoloji");
  const yer = ilk < 0 ? digerleri.length : ilk;
  const yeni = [...digerleri.slice(0, yer), ...biyo, ...digerleri.slice(yer)];
  s = s.slice(0, on + "var METIN = ".length) + JSON.stringify(yeni) + s.slice(son + 1);
  kaydet(OKZ_JS, s);
  bildir("✔ okz-meb.js: METIN " + biyo.length + " biyoloji kaydı kitabın başlıklarına bağlandı");
} catch (e) { bildir("✗ okz-meb.js: " + e.message); hata++; }

/* ---- 4) konu-anahtar.js ---- */
try {
  let s = fs.readFileSync(ANAHTAR, "utf8");
  /* Özel → genel sıralı; ilk eşleşen kazanır. */
  const KURALLAR = [
    ["2.7 Ekolojik Ayak İzinin Küçültülmesi", /ekolojik ayak izi|karbon ayak izi|su ayak izi|ayak izini kucult/],
    ["2.9 Atık Yönetimi", /atik yonetimi|bertaraf|kompost|biyometanizasyon/],
    ["2.8 Doğal Kaynakların ve Biyoçeşitliliğin Korunması", /biyocesitliligin korunmasi|dogal kaynaklarin korunmasi|koruma.*onlem|tohum bankasi/],
    ["2.6 Ekolojik Sürdürülebilirliği Kısıtlayan Durumlar", /kisitlayan|habitat kaybi|otrofikasyon|asit yagmuru|ozon tabakasi/],
    ["2.5 Ekolojik Sürdürülebilirliğin Önemi", /ekolojik surdurulebilirligin onem|surdurulebilirligin onemini/],
    ["2.4 Madde Döngüleri", /azot dongusu|karbon dongusu|su dongusu|madde dongu/],
    ["2.3 Ekosistemdeki Madde ve Enerji Akışı", /enerji akisi|enerji piramidi|besin zinciri|besin agi|trofik|biyolojik birikim/],
    ["2.2 Komünitelerde ve Popülasyonlarda Görülen Etkileşimler ve Değişimler", /komunite|populasyon|rekabet|simbiyoz|parazit|mutualizm|sukse/],
    ["2.1 Ekosistemin Bileşenleri", /ekosistemin.*bilesen|ekosistem.*cansiz|cansiz.*bilesen/],
    ["1.10 Enerji-Metabolizma İlişkisi", /metabolik surec|metabolizma/],
    ["1.8 Besinlerin Solunuma Katılma Yolları", /farkli besin gruplari|besin gruplarindan enerji/],
    ["1.9 Fermantasyon", /fermantasyon|etil alkol|laktik asit/],
    ["1.7 Hücresel Solunum", /hucresel solunum|hucre solunumu|oksijenli solunum|oksijensiz solunum/],
    ["1.6 İnsanda Sindirim", /insanda.*sindirim|emilim/],
    ["1.5 Sindirim", /sindirim cesit|sindirim yapi|sindirim.*siniflandir/],
    ["1.4 Işık Enerjisi Kullanılmadan Besin Sentezi (Kemosentez)", /kemosentez/],
    ["1.3 Fotosentezde Kullanılan ve Üretilen Maddeler", /fotosentezde kullanilan|uretilen maddeler|fotosentez.*deney/],
    ["1.2 Işık Enerjisi Kullanılarak Besin Sentezi (Fotosentez)", /fotosentez/],
    ["1.1 Canlılık İçin Enerjinin Önemi", /enerjinin gereklilig|canlilik icin enerji|atp/]
  ];

  /* Eski biyoloji bloklarını (satır bazlı) at, yenisini Biyoloji çapasına yaz */
  const satirlar = s.split("\n");
  const kalanSatir = [];
  let atla = false;
  for (const satir of satirlar) {
    if (/^\s*\{ ders: \["biyoloji"\]/.test(satir)) { atla = true; continue; }
    if (atla) {
      if (/desen:/.test(satir)) { atla = false; continue; }
      if (/^\s*$/.test(satir)) { atla = false; continue; }
      atla = false;
    }
    kalanSatir.push(satir);
  }
  s = kalanSatir.join("\n");

  const capa = "\n    // ---- Biyoloji ----";
  if (!s.includes(capa)) throw new Error("Biyoloji çapası yok");
  const blok = KURALLAR.map(([konu, desen]) =>
    '    { ders: ["biyoloji"], konu: ' + JSON.stringify(konu) + ',\n      desen: ' + desen.toString() + ' },').join("\n");
  s = s.replace(capa, capa + "\n" + blok);
  kaydet(ANAHTAR, s);
  bildir("✔ konu-anahtar.js: " + KURALLAR.length + " biyoloji kuralı yazıldı");
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
