#!/usr/bin/env node
/* ============================================================
   KİMYA 10 — TAMAMLIK · 6. DEMET (u02_k02, u02_k03)
   Çözünebilirlik ve çözünme sınıflandırması havuzları.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/kimya-tamlik6.js
   ============================================================ */
"use strict";

const K = "kimya_10_";

module.exports = [
  {
    konu_id: K + "u02_k02",
    onlar: [
      { soru_id: K + "u02_k02_o02", on: "Polar ve hidrofilik yapının çözünürlüğe etkisi nedir?" },
      { soru_id: K + "u02_k02_o05", on: "İyon-dipol etkileşiminin çözünmedeki işlevi nedir?" },
      { soru_id: K + "u02_k02_o06", on: "Polar ve apolar maddelerin karışmama nedeni nedir?" },
      { soru_id: K + "u02_k02_o07", on: "Alkolün -OH ucunun sudaki işlevi nedir?" },
      { soru_id: K + "u02_k02_o08", on: "Benzer benzeri çözer kuralına uyan çift nedir?" },
      { soru_id: K + "u02_k02_o09", on: "İyon-dipol etkileşiminin tanımı nedir?" },
      { soru_id: K + "u02_k02_o10", on: "Hidrofobik vitaminlerin vücuttaki davranışı nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u02_k02_o04",
        secenekler: ["Su (polar)", "Tuzlu su", "Karbon tetraklorür", "Asitli su"],
        dogru_index: 2
      },
      {
        soru_id: K + "u02_k02_o06",
        secenekler: [
          "Yağ sudan ağır olduğu için",
          "Su polar, yağ apolar olduğu için",
          "Su kaynadığı için",
          "Yağ iyonik olduğu için"
        ],
        dogru_index: 1
      },
      {
        soru_id: K + "u02_k02_o07",
        metin: "Bir alkol molekülünün -OH ucu, su molekülünün 2 kısmi yüküyle hidrojen bağı kuruyor ve bu bağ çözünmeyi kolaylaştırıyor. Alkolün suda iyi çözünmesinin nedeni nedir?",
        secenekler: [
          "Polar ve apolar kısım bulunması",
          "Apolar olması",
          "İyonik olması",
          "Yoğunluğunun büyük olması"
        ],
        dogru_index: 0
      },
      {
        soru_id: K + "u02_k02_o09",
        metin: "Bir tuz kristali suda iyonlarına ayrışıyor; suyun 2 kısmi ucu iyonları çekiyor. Bu çözünmeyi sağlayan temel etkileşim nedir?"
      }
    ]
  },
  {
    konu_id: K + "u02_k03",
    onlar: [
      { soru_id: K + "u02_k03_o01", on: "İyonik çözünmenin tanımı nedir?" },
      { soru_id: K + "u02_k03_o02", on: "Moleküler çözünmenin tanımı nedir?" },
      { soru_id: K + "u02_k03_o03", on: "Elektrolitlerin tanımı nedir?" },
      { soru_id: K + "u02_k03_o04", on: "İyonik çözünmenin denklemi nedir?" },
      { soru_id: K + "u02_k03_o06", on: "İyonik çözünmede su moleküllerinin işlevi nedir?" },
      { soru_id: K + "u02_k03_o07", on: "Hidratasyonun iyonlara kazandırdığı nedir?" },
      { soru_id: K + "u02_k03_o10", on: "Çözünme türlerinin sınıflandırılması nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u02_k03_o05",
        fc: [
          "Kimyasal çözünmeyi fiziksel çözünmeden ayıran ölçüt nedir?",
          "Çözünme sırasında yeni bir kimyasal tür oluşup oluşmaması; Na'nın suda H2 çıkarması buna örnektir."
        ],
        secenekler: [
          "Şekerin suda çözünmesi",
          "Tuzun suda iyonlaşması",
          "Alkolün suda çözünmesi",
          "Sodyumun suda H2 çıkararak çözünmesi"
        ],
        dogru_index: 3
      },
      {
        soru_id: K + "u02_k03_o06",
        secenekler: ["Moleküller iyonlarına ayrışır", "İyonlar suyun kısmi uçlarınca çekilir", "Su buharlaşıp kaybolur", "Çökelek dibe çöker"],
        dogru_index: 1
      }
    ]
  }
];
