#!/usr/bin/env node
/* ============================================================
   KAPSAM DENETLEYİCİSİ (docs/uretim/araclar/kapsam-denetle.js)
   ------------------------------------------------------------
   Ne yapar?
     Her havuzun sorularını, kendi ders kitabının İLGİLİ SAYFA
     ARALIĞI ile karşılaştırır ve "öğrencinin bilmesi beklenmeyen"
     (konu dışı) bilgi isteyen soruları işaretler.

   Neden gerekli?
     Yapısal denetim (havuz-denetle) bir sorunun sorulabilir
     olduğunu söyler; ama cevabın KAZANIMIN KAPSAMI içinde kalıp
     kalmadığını söylemez. Örnek: "coğrafi bakış" kazanımında
     "alüvyon set gölü" ayrıntısı istenmesi — konu bu değildir.

   Nasıl ölçer?
     · Kitap metni JSON'ları: docs/uretim/.kitap-metin/<slug>.json
     · Havuzun kaynak alanından sayfa aralığı okunur (s.49-69).
     · Sayfa numarası kitaptan kitaba 1 kayabildiği için aralık
       3 sayfa payla genişletilir.
     · Kelimeler 4 harflik kök önekine indirgenir (Türkçe ek ve ses
       değişimlerine dayanıklı olsun diye), Türkçe harfler ASCII'ye katlanır.
     · S1 (ağır): kelime kitabın HİÇBİR yerinde yok → uydurma /
       ders dışı bilgi olma ihtimali yüksek.
     · S2 (orta): kelime kitapta var ama bu ünitenin sayfalarında
       yok → başka üniteden sızma / kapsam kayması.

   Kullanım:
     node docs/uretim/araclar/kapsam-denetle.js
     node docs/uretim/araclar/kapsam-denetle.js --ders Coğrafya
     node docs/uretim/araclar/kapsam-denetle.js --yaz   # rapor dosyası
     node docs/uretim/araclar/kapsam-denetle.js --liste # S1 bulgularını
                                                        # soru metniyle dök

   Not: Araç sözcük düzeyinde ipucu verir; "bu soru kazanımın kapsamında mı"
   kararı kazanım metniyle karşılaştırılarak verilir (SORU-URETIM-TALIMATI §7.1).
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "../../..");
const HAVUZ_DIR = path.join(KOK, "site/content/soru_havuzlari");
const KITAP_DIR = path.join(KOK, "docs/uretim/.kitap-metin");
const RAPOR = path.join(KOK, "docs/uretim/KAPSAM-DENETLEME.md");

const DERS_SLUG = {
  "Fizik": "fizik",
  "Kimya": "kimya",
  "Biyoloji": "biyoloji",
  "Matematik": "matematik",
  "Coğrafya": "cografya",
  "Tarih": "tarih",
  "Felsefe": "felsefe",
  "Din Kültürü": "din",
  "Türk Dili ve Edebiyatı": "edebiyat"
};

/* Soru kökünde/şıkta sık geçen, içerik taşımayan kelimeler. */
const DURAKLI = new Set(
  ("hangisi hangisidir hangileri aşağıdaki aşağıdakilerden aşağıda verilen verilmiştir " +
   "nedir değildir olarak olan olduğu olduğunu bunun şuna göre göre hangi hangisinin " +
   "için ile gibi kadar daha en çok birlikte üzere arasında arasındaki sırasıyla " +
   "ifadesi ifadeleri cümlesi cümlelerinden bilgi bilgiler bilgiye durum durumu " +
   "soru soruda metin metinde metne tablo tabloda tablodaki şekil şekilde grafik " +
   "örnek örnekte örnek olay olgu olguya mekan mekân mekânı kavram kavramı kavramlar " +
   "temel yapı yapısı süreç süreci amaç amacı sonuç sonucu etki etkisi özellik özelliği " +
   "ilişki ilişkisi ilişkileri çıkarım yorum değerlendirme karşılaştırma sınıflandırma " +
   "açıklar açıklayınız belirler belirleyiniz söyler söylenir gösterir gösterirler " +
   "aittir yapar yapılır bulunur bulunur bu şu o bir iki üç dört beş altı yedi sekiz " +
   "dokuz on yıl yılı yıllar yılları yılda ay gün saat metre kilometre hektar " +
   "olduğuna olduklarına neden niçin nasıl nerede hangisinde hangisine hangisini " +
   "aşağıdakiler aşağıdakine yukarıdaki yukarıda").split(/\s+/)
);

const args = process.argv.slice(2);
const dersArg = args.includes("--ders") ? args[args.indexOf("--ders") + 1] : null;
const YAZ = args.includes("--yaz");
const LISTE = args.includes("--liste");   /* S1 bulgularını soru metniyle dök */

/* ---------------- kitap metinleri ---------------- */
const kitaplar = new Map();
function kitap(slug) {
  if (!slug) return null;
  if (kitaplar.has(slug)) return kitaplar.get(slug);
  const p = path.join(KITAP_DIR, slug + ".json");
  let k = null;
  if (fs.existsSync(p)) {
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    k = {
      sayfalar: j.sayfalar || [],
      ondekler: new Set(),
      ondekTam: new Set()
    };
    /* tüm kitabın 4 harflik kök önekleri */
    for (const s of k.sayfalar) kelimeleriEkle(k.ondekler, s.metin || "");
  }
  kitaplar.set(slug, k);
  return k;
}

function katla(s) {
  return String(s || "")
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/â/g, "a")
    .replace(/î/g, "i")
    .replace(/û/g, "u")
    .replace(/[^a-z0-9]/g, "");
}

function sadeless(s) {
  return String(s || "").toLocaleLowerCase("tr").replace(/[^a-zçğıöşü]/g, "");
}

function kelimeler(metin) {
  return String(metin || "")
    .split(/[^0-9A-Za-zÇĞİÖŞÜçğıöşü]+/)
    .filter(Boolean);
}

/* 4 harflik kök öneği: Türkçe ek ve ses değişimlerine karşı dayanıklı */
function ondekEkle(set, w) {
  const n = katla(w);
  if (n.length < 4) return;
  set.add(n.slice(0, 4));
}

function kelimeleriEkle(set, metin) {
  for (const w of kelimeler(metin)) ondekEkle(set, w);
}

/* sayfa aralığını kaynak metninden oku: "s.49-69" / "s. 12-33" */
function aralik(kaynak) {
  const m = /s\.\s*(\d+)\s*[-–]\s*(\d+)/i.exec(String(kaynak || ""));
  if (m) return [Number(m[1]), Number(m[2])];
  const t = /s\.\s*(\d+)/i.exec(String(kaynak || ""));
  if (t) return [Number(t[1]), Number(t[1])];
  return null;
}

/* havuz dosyaları */
const dosyalar = fs.readdirSync(HAVUZ_DIR).filter(f => f.endsWith(".json") && f !== "index.json");

let incelenen = 0, s1li = 0, s2li = 0;
const satirlar = [];
const ozet = [];

for (const dosya of dosyalar) {
  const havuz = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, dosya), "utf8"));
  if (dersArg && !String(havuz.ders || "").toLocaleLowerCase("tr").includes(dersArg.toLocaleLowerCase("tr"))) continue;
  const slug = DERS_SLUG[havuz.ders];
  const k = kitap(slug);
  if (!k) continue;
  const ar = aralik(havuz.kaynak);
  if (!ar) continue;

  /* sayfa aralığı + 3 sayfa pay, iki olası numaralandırma kayması */
  const uniteler = [ar, [ar[0] + 1, ar[1] + 1]];
  const uniteOndek = new Set();
  for (const [a, b] of uniteler) {
    for (let s = a - 3; s <= b + 3; s++) {
      const p = k.sayfalar.find(x => x.s === s);
      if (!p) continue;
      kelimeleriEkle(uniteOndek, p.metin || "");
    }
  }

  let havuzS1 = 0, havuzS2 = 0;
  const detay = [];
  havuz.sorular.forEach((q, i) => {
    const parcalar = [
      { yer: "kök", metin: q.metin || "" },
      { yer: "doğru", metin: q.secenekler[q.dogru_index] || "" },
      { yer: "çözüm", metin: q.cozum || "" }
    ];
    const bulgular = [];
    for (const p of parcalar) {
      const gorulen = new Set();
      for (const w of kelimeler(p.metin)) {
        const s = katla(w);
        if (s.length < 5 || /^\d+$/.test(s) || DURAKLI.has(sadeless(w))) continue;
        const ondek = s.slice(0, 4);
        if (uniteOndek.has(ondek)) continue;
        if (gorulen.has(ondek)) continue;
        gorulen.add(ondek);
        const kitapta = k.ondekler.has(ondek);
        bulgular.push({ kelime: s, yer: p.yer, seviye: kitapta ? 2 : 1 });
      }
    }
    if (!bulgular.length) return;
    const s1 = bulgular.filter(b => b.seviye === 1);
    const s2 = bulgular.filter(b => b.seviye === 2);
    if (s1.length) havuzS1++;
    if (s2.length) havuzS2++;
    detay.push({ no: i + 1, s1, s2, metin: q.metin, cevap: q.secenekler[q.dogru_index] });
  });

  incelenen += havuz.sorular.length;
  s1li += havuzS1;
  s2li += havuzS2;
  ozet.push({ dosya, s1: havuzS1, s2: havuzS2, toplam: havuz.sorular.length });

  if (detay.length) {
    satirlar.push("\n### " + havuz.konu_id + "  ·  " + havuz.ders + "  ·  " + havuz.kaynak);
    for (const d of detay) {
      const s1 = [...new Set(d.s1.map(b => b.kelime + "(" + b.yer + ")"))].slice(0, 8);
      const s2 = [...new Set(d.s2.map(b => b.kelime + "(" + b.yer + ")"))].slice(0, 8);
      const parca = [];
      if (s1.length) parca.push("**S1** " + s1.join(", "));
      if (s2.length) parca.push("S2 " + s2.join(", "));
      satirlar.push("- soru " + d.no + ": " + parca.join(" | "));
      if (LISTE && d.s1.length) {
        console.log("\n[" + havuz.konu_id + " #" + d.no + "] " + [...new Set(d.s1.map(b => b.kelime))].join(", "));
        console.log("  KÖK  : " + String(d.metin).slice(0, 200));
        console.log("  CEVAP: " + String(d.cevap).slice(0, 160));
      }
    }
  }
}

const toplamS1 = ozet.reduce((a, o) => a + o.s1, 0);
const toplamS2 = ozet.reduce((a, o) => a + o.s2, 0);

console.log("kapsam denetimi");
console.log("  havuz      : " + ozet.length);
console.log("  soru       : " + incelenen);
console.log("  S1 (kitapta hiç geçmeyen kelime) : " + toplamS1 + " soru");
console.log("  S2 (kitapta var, bu ünitede yok) : " + toplamS2 + " soru");

if (YAZ) {
  const md = [
    "# Kapsam Denetimi (konu dışı bilgi taraması)",
    "",
    "> `node docs/uretim/araclar/kapsam-denetle.js --yaz` ile üretilir — **elle düzenlenmez**.",
    "> Amaç: sorunun cevabının, kazanımın kapsamı içinde kalıp kalmadığını görmek.",
    "> S1 = kelime kitabın hiçbir yerinde yok (en riskli). S2 = kitapta var ama bu ünitede yok.",
    "",
    "| havuz | soru | S1 | S2 |",
    "| --- | --- | --- | --- |"
  ];
  for (const o of ozet.sort((a, b) => b.s1 - a.s1 || b.s2 - a.s2)) {
    if (!o.s1 && !o.s2) continue;
    md.push("| " + o.dosya.replace(".json", "") + " | " + o.toplam + " | " + o.s1 + " | " + o.s2 + " |");
  }
  md.push("", "## Ayrıntı", ...satirlar);
  fs.writeFileSync(RAPOR, md.join("\n") + "\n", "utf8");
  console.log("yazıldı: docs/uretim/KAPSAM-DENETLEME.md");
}
