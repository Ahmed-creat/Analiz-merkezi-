#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — TAMAMLIK · 3. DEMET (u01_k07, u01_k08)
   Yer çekimi ivmesi ve serbest düşme havuzları.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/fizik-tamlik3.js
   ============================================================ */
"use strict";

const K = "fizik_10_";

module.exports = [
  {
    konu_id: K + "u01_k07",
    onlar: [
      { soru_id: K + "u01_k07_o01", on: "g sembolü hangi büyüklüğü gösterir?" },
      { soru_id: K + "u01_k07_o04", on: "Yer çekimi ivmesinin vektörel olması ne demektir?" },
      { soru_id: K + "u01_k07_o06", on: "Düşme süresinin kütleden bağımsız olması ne demektir?" },
      { soru_id: K + "u01_k07_o07", on: "Serbest düşmede hız artışının kütleyle ilişkisi nedir?" },
      { soru_id: K + "u01_k07_o09", on: "Hava direncinin bulunmadığı ortamda düşmenin özelliği nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u01_k07_o02",
        metin: "Yer çekimi ivmesi g ≈ 9,8 m/s²'dir. Bu büyüklüğün SI'daki birimi nedir?"
      },
      {
        soru_id: K + "u01_k07_o05",
        fc: [
          "Serbest düşen cisimlerin ivmesinin büyüklüğü nedir?",
          "Yeryüzüne yakın yerlerde sabit kabul edilir (g ≈ 9,8 m/s²)."
        ]
      },
      {
        soru_id: K + "u01_k07_o06",
        fc: [
          "Düşme süresinin kütleden bağımsız olması ne demektir?",
          "Hava sürtünmesi ihmal edilirse farklı kütleli cisimler aynı sürede düşer."
        ]
      },
      {
        soru_id: K + "u01_k07_o08",
        metin: "Sürtünmenin ihmal edildiği ortamda 2 kg'lık cisim serbest bırakılıyor. Cisme etki eden net kuvvet nedir?"
      }
    ]
  },
  {
    konu_id: K + "u01_k08",
    onlar: [
      { soru_id: K + "u01_k08_o01", on: "t = √(2h/g) bağıntısının anlamı nedir?" },
      { soru_id: K + "u01_k08_o02", on: "Serbest düşmede yükseklik ile süre arasındaki ilişki nedir?" },
      { soru_id: K + "u01_k08_o03", on: "Serbest düşmede çarpma hızı nasıl bulunur?" },
      { soru_id: K + "u01_k08_o04", on: "v = g·t bağıntısının anlamı nedir?" },
      { soru_id: K + "u01_k08_o05", on: "Serbest düşmede alınan yol nasıl hesaplanır?" },
      { soru_id: K + "u01_k08_o06", on: "Serbest düşmede hızın büyüklüğü nasıl hesaplanır?" },
      { soru_id: K + "u01_k08_o07", on: "Serbest düşmede hızın zamanla doğrusal artmasının nedeni nedir?" },
      { soru_id: K + "u01_k08_o08", on: "Serbest düşmede ivmenin zamanla değişmemesi ne demektir?" },
      { soru_id: K + "u01_k08_o10", on: "Grafik ile eksen arasındaki alanın yorumu nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u01_k08_o10",
        secenekler: ["İvme değerini", "Kuvvet değerini", "Kütle değerini", "Yer değiştirmeyi"],
        dogru_index: 3
      }
    ]
  }
];
