#!/usr/bin/env node
/* ============================================================
   KİMYA 10 — TAMAMLIK · 3. DEMET (u01_k05, u01_k06)
   Stokiyometri ve gaz yasaları havuzları.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/kimya-tamlik3.js
   ============================================================ */
"use strict";

const K = "kimya_10_";

module.exports = [
  {
    konu_id: K + "u01_k05",
    onlar: [
      { soru_id: K + "u01_k05_o01", on: "Stokiyometrik hesaplamada katsayıların işlevi nedir?" },
      { soru_id: K + "u01_k05_o03", on: "Lavoisier'nin kütlenin korunumu kanunu nedir?" },
      { soru_id: K + "u01_k05_o04", on: "Katsayı oranı ile mol oranı arasındaki ilişki nedir?" },
      { soru_id: K + "u01_k05_o05", on: "Mol kütlesi ile gram arasındaki ilişki nedir?" },
      { soru_id: K + "u01_k05_o06", on: "Tepkenlerin mol oranı nasıl bulunur?" },
      { soru_id: K + "u01_k05_o07", on: "Kuramsal ürün miktarı nasıl hesaplanır?" },
      { soru_id: K + "u01_k05_o08", on: "Yüzde verim nasıl hesaplanır?" },
      { soru_id: K + "u01_k05_o09", on: "Katsayıları eşit olan maddelerin mol sayıları arasındaki ilişki nedir?" },
      { soru_id: K + "u01_k05_o10", on: "Su oluşumunda mol sayısından kütle nasıl bulunur?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u01_k05_o01",
        metin: "Bir öğrenci, denklemdeki 2, 1 ve 2 katsayılarını kullanarak kaç mol ürün oluşacağını hesaplıyor. Katsayıların bu hesaplamadaki anlamı nedir?",
        secenekler: ["Kütleleri oranı", "Maddelerin mol sayıları oranı", "Hacimleri oranı", "Yoğunlukları oranı"],
        dogru_index: 1
      },
      {
        soru_id: K + "u01_k05_o02",
        fc: [
          "Stokiyometri nedir?",
          "Tepkimedeki maddelerin miktar oranlarını hesaplamayı sağlayan yöntemdir."
        ]
      },
      {
        soru_id: K + "u01_k05_o03",
        fc: [
          "Lavoisier'nin kütlenin korunumu kanunu nedir?",
          "Kimyasal tepkimede toplam kütle korunur; kütle yoktan var olmaz, vardan yok olmaz."
        ]
      },
      {
        soru_id: K + "u01_k05_o09",
        secenekler: ["0,25 mol", "0,5 mol", "1 mol", "13 mol"],
        dogru_index: 1
      }
    ]
  },
  {
    konu_id: K + "u01_k06",
    onlar: [
      { soru_id: K + "u01_k06_o01", on: "Atmosfer basıncının cmHg karşılığı nedir?" },
      { soru_id: K + "u01_k06_o02", on: "Basınç birimlerinin birbirine dönüşümü nedir?" },
      { soru_id: K + "u01_k06_o03", on: "Boyle Yasası'nın tanımı nedir?" },
      { soru_id: K + "u01_k06_o04", on: "Sabit sıcaklıkta basınç ile hacmin çarpımı ne olur?" },
      { soru_id: K + "u01_k06_o05", on: "Gay Lussac Yasası'nda basınç ile sıcaklık arasındaki ilişki nedir?" },
      { soru_id: K + "u01_k06_o08", on: "Ters orantı grafiğinde P·V çarpımının sabitliği ne demektir?" },
      { soru_id: K + "u01_k06_o10", on: "Gazların kabı tamamen doldurmasının nedeni nedir?" }
    ]
  }
];
