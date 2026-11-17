#!/usr/bin/env node
/* ============================================================
   KİMYA 10 — TAMAMLIK · 4. DEMET (u01_k07, u01_k08)
   Kinetik moleküler teori ve ideal gaz yasası havuzları.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/kimya-tamlik4.js
   ============================================================ */
"use strict";

const K = "kimya_10_";

module.exports = [
  {
    konu_id: K + "u01_k07",
    onlar: [
      { soru_id: K + "u01_k07_o02", on: "Gaz basıncının tanecik düzeyindeki nedeni nedir?" },
      { soru_id: K + "u01_k07_o03", on: "Ortalama kinetik enerjinin sıcaklıkla ilişkisi nedir?" },
      { soru_id: K + "u01_k07_o04", on: "Sıcaklık artışının gaz basıncına etkisi nedir?" },
      { soru_id: K + "u01_k07_o05", on: "Mol kütlesi ile tanecik hızı arasındaki ilişki nedir?" },
      { soru_id: K + "u01_k07_o06", on: "Tanecik boyutu ile tanecikler arası boşluk arasındaki ilişki nedir?" },
      { soru_id: K + "u01_k07_o07", on: "Gaz yoğunluğunun sıcaklıkla ilişkisi nedir?" },
      { soru_id: K + "u01_k07_o09", on: "Kinetik enerjinin mutlak sıcaklığa bağlılığı nedir?" },
      { soru_id: K + "u01_k07_o10", on: "Sıkıştırılabilirlik ile tanecikler arası boşluk arasındaki ilişki nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u01_k07_o02",
        metin: "Bir balonun içindeki 10²³ tanecik, kabın yüzeyine sürekli çarparak kuvvet oluşturuyor. Kinetik moleküler teoriye göre bu kuvvetin kaynağı nedir?"
      },
      {
        soru_id: K + "u01_k07_o07",
        metin: "Bir sıcak hava balonunun brülörü 3 dakika çalıştırılıyor ve balon yükseliyor. Bu yükselmenin nedeni nedir?"
      },
      {
        soru_id: K + "u01_k07_o10",
        metin: "Bir pistonla 1 L gaz 0,5 L'ye kolayca sıkıştırılabiliyor. Gazların sıkıştırılabilmesinin temel nedeni nedir?"
      }
    ]
  },
  {
    konu_id: K + "u01_k08",
    onlar: [
      { soru_id: K + "u01_k08_o02", on: "Mutlak sıcaklık ölçeğinin birimi nedir?" },
      { soru_id: K + "u01_k08_o03", on: "İdeal gaz sabitinin (R) değeri nedir?" },
      { soru_id: K + "u01_k08_o06", on: "Gaz hacmi ile mol sayısı arasındaki ilişki nedir?" },
      { soru_id: K + "u01_k08_o07", on: "Mol sayısından kütle nasıl bulunur?" },
      { soru_id: K + "u01_k08_o08", on: "İdeal gaz denkleminde basınç nasıl bulunur?" },
      { soru_id: K + "u01_k08_o10", on: "İdeal davranışa yaklaşma koşulları nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u01_k08_o02",
        secenekler: ["Santigrat", "Fahrenhayt", "Fark etmez", "Kelvin (K)"],
        dogru_index: 3
      },
      {
        soru_id: K + "u01_k08_o04",
        fc: [
          "Normal koşullarda 1 mol gazın hacmi nedir?",
          "22,4 L (0 °C ve 1 atm)."
        ]
      },
      {
        soru_id: K + "u01_k08_o05",
        secenekler: ["0,25 mol", "0,5 mol", "1 mol", "4 mol"],
        dogru_index: 0,
        fc: [
          "Normal koşullarda hacimden mol sayısı nasıl bulunur?",
          "Hacim 22,4 L/mol'e bölünür; 5,6 L ÷ 22,4 = 0,25 mol."
        ]
      },
      {
        soru_id: K + "u01_k08_o07",
        fc: ["Mol sayısından kütle nasıl bulunur?", "m = n · MA; 2,75 mol He için 2,75 · 4 = 11 g."]
      }
    ]
  }
];
