#!/usr/bin/env node
/* ============================================================
   KİMYA 10 — TAMAMLIK · 12. DEMET (kart arka yüzü netliği)
   Üç kartta ön yüz soruya dönüşürken arka yüz eksik/tekrarlı
   kalmıştı; soruyu tam karşılayan tanımlarla değiştirildi.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/kimya-tamlik12.js
   ============================================================ */
"use strict";

const K = "kimya_10_";

module.exports = [
  {
    konu_id: K + "u01_k07",
    duzeltmeler: [
      {
        soru_id: K + "u01_k07_o06",
        fc: [
          "Tanecik boyutu ile tanecikler arası boşluk arasındaki ilişki nedir?",
          "Gazlarda tanecikler arası boşluklar tanecik boyutuna göre çok büyüktür; bu yüzden gazlar sıkıştırılabilir."
        ]
      }
    ]
  },
  {
    konu_id: K + "u02_k01",
    duzeltmeler: [
      {
        soru_id: K + "u02_k01_o04",
        fc: [
          "Çözücü tanecikleri arası etkileşimlerin kopmasının sonucu nedir?",
          "Çözücüde, çözünen taneciklerin yerleşebileceği boşluklar oluşur."
        ]
      }
    ]
  },
  {
    konu_id: K + "u02_k02",
    duzeltmeler: [
      {
        soru_id: K + "u02_k02_o08",
        fc: [
          "Benzer benzeri çözer kuralına uyan çift nedir?",
          "Su ve şeker: ikisi de polar yapıda olduğu için birbiri içinde çözünür."
        ]
      }
    ]
  }
];
