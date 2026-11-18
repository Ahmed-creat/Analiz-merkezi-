#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — TAMAMLIK · 5. DEMET (u02_k02, u02_k05)
   Enerji biçimleri ile iş-enerji-güç havuzları.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/fizik-tamlik5.js
   ============================================================ */
"use strict";

const K = "fizik_10_";

module.exports = [
  {
    konu_id: K + "u02_k02",
    onlar: [
      { soru_id: K + "u02_k02_o01", on: "Kimyasal enerjinin depolandığı araçlar nedir?" },
      { soru_id: K + "u02_k02_o02", on: "Nükleer enerjinin kaynağı nedir?" },
      { soru_id: K + "u02_k02_o03", on: "Fotonun tanımı nedir?" },
      { soru_id: K + "u02_k02_o04", on: "Mekanik enerjinin bileşenleri nedir?" },
      { soru_id: K + "u02_k02_o07", on: "Kimyasal enerjinin ışığa dönüşümüne örnek nedir?" },
      { soru_id: K + "u02_k02_o08", on: "Potansiyel enerjinin kinetik enerjiye dönüşümüne örnek nedir?" },
      { soru_id: K + "u02_k02_o09", on: "Yükseklikte duran suyun enerjisi nedir?" },
      { soru_id: K + "u02_k02_o10", on: "Kayıp enerjinin dönüştüğü biçim nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u02_k02_o06",
        fc: [
          "Vantilatördeki enerji dönüşümü nedir?",
          "Elektrik enerjisi mekanik (hareket) enerjisine dönüşür."
        ]
      }
    ]
  },
  {
    konu_id: K + "u02_k05",
    onlar: [
      { soru_id: K + "u02_k05_o01", on: "İş-enerji teoreminin anlamı nedir?" },
      { soru_id: K + "u02_k05_o04", on: "Kilowatt ile watt arasındaki ilişki nedir?" },
      { soru_id: K + "u02_k05_o05", on: "Pozitif işin cisim enerjisine etkisi nedir?" },
      { soru_id: K + "u02_k05_o07", on: "Güç ile enerji arasındaki ilişki nedir?" },
      { soru_id: K + "u02_k05_o08", on: "Kaldırma işinde güç nasıl hesaplanır?" },
      { soru_id: K + "u02_k05_o09", on: "Net iş nasıl hesaplanır?" },
      { soru_id: K + "u02_k05_o10", on: "Güç, kütle ve süre verildiğinde yükseklik nasıl bulunur?" }
    ]
  }
];
