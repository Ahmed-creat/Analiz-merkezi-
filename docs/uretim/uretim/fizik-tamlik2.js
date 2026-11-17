#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — TAMAMLIK · 2. DEMET (u01_k05, u01_k06)
   İvme ve sabit ivmeli hareket havuzları.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/fizik-tamlik2.js
   ============================================================ */
"use strict";

const K = "fizik_10_";

module.exports = [
  {
    konu_id: K + "u01_k05",
    onlar: [
      { soru_id: K + "u01_k05_o02", on: "a = Δv/Δt bağıntısının anlamı nedir?" },
      { soru_id: K + "u01_k05_o05", on: "Hız değişimi sıfırsa ivme ne olur?" },
      { soru_id: K + "u01_k05_o06", on: "Hız azalırken ivmenin işareti nedir?" },
      { soru_id: K + "u01_k05_o10", on: "İlk hız, ivme ve süre verildiğinde son hız nasıl hesaplanır?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u01_k05_o03",
        fc: ["İvmenin birimi nedir?", "m/s² (metre bölü saniye kare)."]
      },
      {
        soru_id: K + "u01_k05_o04",
        fc: [
          "Sabit ivmede son hız nasıl bulunur?",
          "v = v₀ + a·t bağıntısıyla; ilk hız sıfırsa v = a·t olur."
        ]
      },
      {
        soru_id: K + "u01_k05_o06",
        fc: [
          "Hız azalırken ivmenin işareti nedir?",
          "Negatiftir; ivme hareket yönüne zıttır."
        ]
      },
      {
        soru_id: K + "u01_k05_o10",
        fc: [
          "İlk hız, ivme ve süre verildiğinde son hız nasıl hesaplanır?",
          "v = v₀ + a·t bağıntısıyla; 10 + (−2)·3 = 4 m/s."
        ]
      }
    ]
  },
  {
    konu_id: K + "u01_k06",
    onlar: [
      { soru_id: K + "u01_k06_o01", on: "v = v₀ + a·t bağıntısının anlamı nedir?" },
      { soru_id: K + "u01_k06_o02", on: "x = v₀·t + ½·a·t² bağıntısının anlamı nedir?" },
      { soru_id: K + "u01_k06_o03", on: "İlk hız, ivme ve süreden son hız nasıl bulunur?" },
      { soru_id: K + "u01_k06_o04", on: "Sabit ivmede yer değiştirme nasıl hesaplanır?" },
      { soru_id: K + "u01_k06_o05", on: "Durgun hâlden hızlanan cisimde alınan yol nasıl bulunur?" },
      { soru_id: K + "u01_k06_o06", on: "Δx = ((v + v₀)/2)·t bağıntısının anlamı nedir?" },
      { soru_id: K + "u01_k06_o08", on: "Hız-zaman grafiğindeki alanların toplamı hangi niceliği verir?" },
      { soru_id: K + "u01_k06_o09", on: "Sabit ivmeli harekette x-t grafiğinin biçimi nasıldır?" },
      { soru_id: K + "u01_k06_o10", on: "İvme-zaman grafiğinin yatay olması ne demektir?" }
    ]
  }
];
