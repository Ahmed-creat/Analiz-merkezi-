#!/usr/bin/env node
/* 9. sınıf deneme dosyasını içe aktarma düğmesine hazırlar:
     1) tüm hata nedenlerini "konu eksikliği" yapar — metin UYGULAMADAN okunur
     2) "_mod": "deneme-birlestir" ekler → düğme tam durum değişimi yapmaz

   Neden uygulamadan okuyoruz: kanonik değer "KONUEKSİKLİĞİ" (eksik).
   "KONUEKSİZLİĞİ" (eksiz) yazılırsa REASON_WEIGHTS'ta karşılığı olmaz,
   ağırlık uygulanmaz ve kayıt "büyük hata" sayılmaz — sessiz bozulma.

   Kullanım: node scripts/deneme-ice-aktarma-hazirla.js */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const YOL = path.join(KOK, "site/veri/9-sinif-denemeler.json");
const HTML = fs.readFileSync(path.join(KOK, "site/index.html"), "utf8");
const BKT = fs.readFileSync(path.join(KOK, "site/bkt-engine.js"), "utf8");

/* Kanonik metni koddan çıkar: canonicalReason("KONU EKSİKLİĞİ") → ? */
const m = HTML.match(/"KONU EKSİKLİĞİ"\s*:\s*"([^"]+)"/);
if (!m) throw new Error("index.html → canonicalReason eşlemesi bulunamadı");
const KONU_EKSIKLIGI = m[1];

/* Aynı metin bkt-engine'de de tanınmalı (normalizeReason) */
if (!BKT.includes('"' + KONU_EKSIKLIGI + '"')) {
  throw new Error("bkt-engine bu nedeni tanımıyor: " + KONU_EKSIKLIGI);
}
/* Ağırlığı olmalı — yoksa motor kaydı hafif sayar */
const agirlik = new RegExp('"' + KONU_EKSIKLIGI + '"\\s*:\\s*([\\d.]+)');
const w = agirlik.exec(HTML);
if (!w) throw new Error("REASON_WEIGHTS'ta ağırlık yok: " + KONU_EKSIKLIGI);

console.log("kanonik neden:", KONU_EKSIKLIGI, "· ağırlık:", w[1]);

const veri = JSON.parse(fs.readFileSync(YOL, "utf8"));
let degisen = 0;
for (const ex of veri.state.exams || []) {
  for (const log of ex.errorLogs || []) {
    if (log.type !== KONU_EKSIKLIGI) { log.type = KONU_EKSIKLIGI; degisen++; }
  }
}

const yeni = {
  _mod: "deneme-birlestir",
  _okumaNotu:
    "9. sınıf deneme dökümü (7 sınav). \"Verileri İçe Aktar\" düğmesiyle açılabilir: " +
    "_mod=deneme-birlestir olduğu için uygulama TAM DURUM DEĞİŞİMİ yapmaz, " +
    "yalnız bu sınavları listeye ekler. Konu takibi, hafıza, profil ve BKT korunur.",
  _uyari:
    "Tüm hata nedenleri \"" + KONU_EKSIKLIGI + "\" (konu eksikliği, ağırlık 1,5) olarak " +
    "işaretlidir. Yanlış/boş ayrımı lessons[ders].w ve .e alanlarında korunur; " +
    "errorLogs içinde ikisi de aynı nedenle yazılır.",
  _surum: veri._surum,
  _kaynak: veri._kaynak,
  _tutarsizliklar: veri._tutarsizliklar,
  _sayilar: veri._sayilar,
  state: veri.state
};

fs.writeFileSync(YOL, JSON.stringify(yeni, null, 1), "utf8");

const neden = {};
yeni.state.exams.forEach(ex => ex.errorLogs.forEach(l => { neden[l.type] = (neden[l.type] || 0) + 1; }));
console.log("değiştirilen neden:", degisen);
console.log("neden dağılımı:", JSON.stringify(neden));
console.log("_mod:", yeni._mod, "· sınav:", yeni.state.exams.length);
