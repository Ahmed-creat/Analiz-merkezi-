#!/usr/bin/env node
/* ============================================================
   KİMYA 10 — TAMAMLIK · 1. DEMET (u01_k01, u01_k02)
   Kart önleri tanım/formül kalıbına, uzun doğru şıklar dengelendi,
   bir soru senaryo + sayı ile kavrama düzeyine çevrildi.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/kimya-tamlik1.js
   ============================================================ */
"use strict";

const K = "kimya_10_";

module.exports = [
  {
    konu_id: K + "u01_k01",
    onlar: [
      { soru_id: K + "u01_k01_o01", on: "Kimyasal değişimde yeni madde oluşumunun nedeni nedir?" },
      { soru_id: K + "u01_k01_o02", on: "Renk değişimi, gaz çıkışı ve çökelme neyin işaretidir?" },
      { soru_id: K + "u01_k01_o04", on: "Tepken kavramının tanımı nedir?" },
      { soru_id: K + "u01_k01_o06", on: "CaCO3 + 2HCl tepkimesinde oluşan ürünlerin formülü nedir?" },
      { soru_id: K + "u01_k01_o08", on: "Demirin paslanması hangi değişim türünün işaretidir?" },
      { soru_id: K + "u01_k01_o09", on: "Kütlenin korunumu yasasının gereği nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u01_k01_o01",
        secenekler: [
          "Yalnızca hâl değişimi görülmesi",
          "İç yapı ve bileşenlerin değişmesi",
          "Yalnızca sıcaklık değişimi yaşanması",
          "Maddenin kütlesinin azalması"
        ],
        dogru_index: 1
      },
      {
        soru_id: K + "u01_k01_o02",
        secenekler: ["Renk değişimi", "Gaz çıkışı", "Çökelme", "Kütlenin azalması"],
        dogru_index: 3
      }
    ]
  },
  {
    konu_id: K + "u01_k02",
    onlar: [
      { soru_id: K + "u01_k02_o01", on: "Tepkime türlerini bilmenin sağladığı kolaylık nedir?" },
      { soru_id: K + "u01_k02_o03", on: "Nötralleşme tepkimesinin net iyon denklemi nedir?" },
      { soru_id: K + "u01_k02_o05", on: "Gümüş iyonu ile klorür iyonunun oluşturduğu çökeleğin formülü nedir?" },
      { soru_id: K + "u01_k02_o06", on: "Seyirci iyonlar sadeleştirildiğinde kalan denklem nedir?" },
      { soru_id: K + "u01_k02_o09", on: "Suda çözünmeyen katı oluşumu hangi tepkime türünün işaretidir?" },
      { soru_id: K + "u01_k02_o10", on: "Çökelme tepkimesinin analitik kimyadaki işlevi nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u01_k02_o01",
        metin: "Bir öğrenci, girdiği maddelerden hangi ürünün oluşacağını önceden kestirmek için 3 farklı tepkimeyi türlere ayırıyor. Bu sınıflandırmanın temel yararı nedir?",
        secenekler: ["Tepkimeyi durdurmak", "Ürünün ve sürecin tahmin edilebilmesi", "Kütleyi artırmak", "Sıcaklığı sabitlemek"],
        dogru_index: 1
      },
      {
        soru_id: K + "u01_k02_o08",
        fc: [
          "Yükseltgenmenin tanımı nedir?",
          "Mg elektron vererek Mg²⁺'ye dönüşür; elektron veren madde yükseltgenir."
        ]
      },
      {
        soru_id: K + "u01_k02_o09",
        secenekler: ["CH4 + 2O2 → CO2 + 2H2O", "BaCl2 + Na2SO4 → BaSO4(k) + 2NaCl", "H⁺ + OH⁻ → H2O", "CaCO3 → CaO + CO2"],
        dogru_index: 1
      },
      {
        soru_id: K + "u01_k02_o10",
        secenekler: ["Çözeltiyi ısıtmak için", "Gaz üretmek için", "Kütleyi ölçmek için", "İyonların varlığını belirlemek için"],
        dogru_index: 3
      }
    ]
  }
];
