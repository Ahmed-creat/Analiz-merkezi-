#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — TAMAMLIK · 12. DEMET (u04_k01, u04_k02)
   Dalgaların temel kavramları ve sınıflandırılması.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/fizik-tamlik12.js
   ============================================================ */
"use strict";

const K = "fizik_10_";

module.exports = [
  {
    konu_id: K + "u04_k01",
    onlar: [
      { soru_id: K + "u04_k01_o03", on: "λ sembolünün birimi nedir?" },
      { soru_id: K + "u04_k01_o05", on: "f = 1/T bağıntısının anlamı nedir?" },
      { soru_id: K + "u04_k01_o06", on: "Sürat ve frekanstan dalga boyu nasıl bulunur?" },
      { soru_id: K + "u04_k01_o07", on: "Dalga süratinin bağıntısı nedir?" },
      { soru_id: K + "u04_k01_o08", on: "Periyot, dalga boyu ve süratten nasıl bulunur?" },
      { soru_id: K + "u04_k01_o09", on: "Genliğin taşınan enerjiyle ilişkisi nedir?" },
      { soru_id: K + "u04_k01_o10", on: "Süratin dalga boyuyla doğru orantılı olması ne demektir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u04_k01_o05",
        metin: "Bir hareket 0,25 s'de bir tekrarlanıyorsa frekansı 4 Hz'tir. Periyot ile frekans arasındaki ilişki nedir?"
      },
      {
        soru_id: K + "u04_k01_o08",
        secenekler: ["5 s", "80 s", "0,2 s", "4 s"],
        dogru_index: 2
      }
    ]
  },
  {
    konu_id: K + "u04_k02",
    onlar: [
      { soru_id: K + "u04_k02_o01", on: "Dalga sınıflandırmasının enerji ölçütü nedir?" },
      { soru_id: K + "u04_k02_o02", on: "Maddesel ortamın gerekliliği ne demektir?" },
      { soru_id: K + "u04_k02_o03", on: "Işığın dalga sınıfı nedir?" },
      { soru_id: K + "u04_k02_o04", on: "Enine ve boyuna ayrımının ölçütü nedir?" },
      { soru_id: K + "u04_k02_o05", on: "Enine dalgada titreşim ile yayılmanın ilişkisi nedir?" },
      { soru_id: K + "u04_k02_o06", on: "Sesin dalga sınıfı nedir?" },
      { soru_id: K + "u04_k02_o07", on: "Deprem dalgalarının yayılma biçimi nedir?" },
      { soru_id: K + "u04_k02_o08", on: "Elektromanyetik dalgaların ortam gerektirmemesi ne demektir?" },
      { soru_id: K + "u04_k02_o09", on: "Su dalgasının sınıfı nedir?" },
      { soru_id: K + "u04_k02_o10", on: "Dik titreşimli yay dalgasının türü nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u04_k02_o02",
        metin: "Ses, su ve yay dalgaları gibi 3 örnek ortak bir özellik taşır. Mekanik dalgaların ortak özelliği nedir?"
      }
    ]
  }
];
