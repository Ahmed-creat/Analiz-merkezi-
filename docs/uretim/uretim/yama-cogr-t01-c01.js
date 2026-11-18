#!/usr/bin/env node
/* ============================================================
   YAMA · cogr_10_t01_c01 (Coğrafyanın Doğası) 4. soru
   ------------------------------------------------------------
   Neden? Kapsam denetimi: "coğrafi bakış" kazanımında gölün
   oluşum türünü (alüvyon set gölü / akarsu biriktirmesi) sormak
   konu dışıdır — öğrencinin bu ayrıntıyı bilmesi beklenmez.
   Kitapta geçse bile kazanım "temel kavramlarla ilişkilendirme"dir.

   Yerine: aynı örnek olay (Marmara Gölü'nün küçülmesi) üzerinden
   kitabın anahtar kavramlarından (coğrafi bakış, dağılış, değişim,
   hareket, konum, mekân, zaman — s.16) "değişim" kavramı sorulur.

   Kullanım: node docs/uretim/uretim/yama-cogr-t01-c01.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const DOSYA = path.join(
  __dirname,
  "../../../site/content/soru_havuzlari/cogr_10_t01_c01.json"
);

const SORU = {
  alt_beceri: "Örnek olay, olgu ve/veya mekânın yakın ve uzak çevresiyle olan ilişkilerini çözümler.",
  metin:
    "Marmara Gölü'nün yıllar içinde alan kaybederek giderek küçülmesi, coğrafyanın hangi temel kavramıyla açıklanır?",
  secenekler: ["Konum", "Dağılış", "Değişim", "Hareket"],
  dogru_index: 2,
  cozum:
    "Göl alanının zaman içinde azalması, mekânda gerçekleşen dönüşümü gösterir; bu nedenle coğrafyanın \"değişim\" kavramıyla ilişkilendirilir. Konum, dağılış ve hareket kavramları olayın yıllara bağlı dönüşümünü açıklamaz."
};

const KART = {
  front: "Coğrafyada değişim kavramı ne demektir?",
  back:
    "Coğrafi olay ve olguların zaman içinde farklılaşmasını, yani mekânda yaşanan dönüşümü ifade eder."
};

const havuz = JSON.parse(fs.readFileSync(DOSYA, "utf8"));
const i = havuz.sorular.findIndex(q => q.soru_id === "cogr_10_t01_c01_o04");
if (i < 0) throw new Error("cogr_10_t01_c01_o04 bulunamadı");

const q = havuz.sorular[i];
q.alt_beceri = SORU.alt_beceri;
q.metin = SORU.metin;
q.secenekler = SORU.secenekler.slice();
q.dogru_index = SORU.dogru_index;
q.cozum = SORU.cozum;
q.flashcard = { front: KART.front, back: KART.back };

const kart = havuz.flashcards.find(f => f.id === "cogr_10_t01_c01_o04:flashcard");
if (!kart) throw new Error("o04 kartı bulunamadı");
kart.front = KART.front;
kart.back = KART.back;

fs.writeFileSync(DOSYA, JSON.stringify(havuz, null, 2) + "\n");
console.log("yama tamam: cogr_10_t01_c01 soru 4 + kart 4");
