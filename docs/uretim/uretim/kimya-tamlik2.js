#!/usr/bin/env node
/* ============================================================
   KİMYA 10 — TAMAMLIK · 2. DEMET (u01_k03, u01_k04)
   Mol ve denkleştirme havuzları: kart önleri kavram/formül
   kalıbına, uzun doğru şıklar dengelendi, tanım sorusu senaryolaştı.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/kimya-tamlik2.js
   ============================================================ */
"use strict";

const K = "kimya_10_";

module.exports = [
  {
    konu_id: K + "u01_k03",
    onlar: [
      { soru_id: K + "u01_k03_o01", on: "Avogadro sayısının değeri nedir?" },
      { soru_id: K + "u01_k03_o03", on: "Molün tanımı nedir?" },
      { soru_id: K + "u01_k03_o04", on: "Mol kütlesi (MA) nasıl hesaplanır?" },
      { soru_id: K + "u01_k03_o05", on: "n = N / NA bağıntısı hangi niceliği verir?" },
      { soru_id: K + "u01_k03_o06", on: "Mol kütlesinin birimi nedir?" },
      { soru_id: K + "u01_k03_o08", on: "Mol sayısı ile tanecik sayısı arasındaki ilişki nedir?" },
      { soru_id: K + "u01_k03_o09", on: "Tanecik sayısı nasıl hesaplanır?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u01_k03_o03",
        metin: "Bir öğrenci 10²³ tane atomu tek tek sayamayacağı için madde miktarını başka bir yolla ifade etmek istiyor. Mol kavramının bunu sağlayan yönü nedir?",
        secenekler: [
          "Tanecikleri saymadan miktar belirtmeyi sağlaması",
          "Kütleyi ortadan kaldırmayı amaçlaması",
          "Sıcaklığı doğrudan ölçmeyi sağlaması",
          "Hacmi sabit tutmayı sağlaması"
        ],
        dogru_index: 0
      },
      {
        soru_id: K + "u01_k03_o05",
        fc: [
          "n = N / NA bağıntısı hangi niceliği verir?",
          "Tanecik sayısı verilen örnekte mol sayısını verir."
        ]
      },
      {
        soru_id: K + "u01_k03_o06",
        fc: ["Mol kütlesinin birimi nedir?", "Gram/mol (g/mol)."]
      },
      {
        soru_id: K + "u01_k03_o08",
        fc: [
          "Mol sayısı ile tanecik sayısı arasındaki ilişki nedir?",
          "Aynı mol sayısındaki maddeler aynı sayıda tanecik içerir; kütleleri mol kütlesine göre değişir."
        ],
        secenekler: [
          "Kütleleri eşittir",
          "Atom sayıları farklıdır",
          "Atom sayıları eşit, kütleleri farklıdır",
          "İkisinin kütlesi de 12 g'dır"
        ],
        dogru_index: 2
      }
    ]
  },
  {
    konu_id: K + "u01_k04",
    onlar: [
      { soru_id: K + "u01_k04_o01", on: "Atom sayısının korunumu nedir?" },
      { soru_id: K + "u01_k04_o02", on: "Denklem katsayılarının seçim kuralı nedir?" },
      { soru_id: K + "u01_k04_o03", on: "Katsayıların mol oranıyla ilişkisi nedir?" },
      { soru_id: K + "u01_k04_o04", on: "Su oluşumunda H2 ile O2'nin birleşme oranı nedir?" },
      { soru_id: K + "u01_k04_o10", on: "Katsayı oranından mol oranı nasıl bulunur?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u01_k04_o09",
        secenekler: ["Metaller", "Oksijen ve hidrojen", "Karbon ve azot", "Soy gazlar"],
        dogru_index: 1
      }
    ]
  }
];
