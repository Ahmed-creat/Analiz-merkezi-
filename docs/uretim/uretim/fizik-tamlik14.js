#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — TAMAMLIK · 14. DEMET (u04_k05, u04_k06)
   Su dalgalarında yansıma-kırılma; rezonans ve deprem kavramları.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/fizik-tamlik14.js
   ============================================================ */
"use strict";

const K = "fizik_10_";

module.exports = [
  {
    konu_id: K + "u04_k05",
    onlar: [
      { soru_id: K + "u04_k05_o03", on: "Gelme açısının tanımı nedir?" },
      { soru_id: K + "u04_k05_o04", on: "17 m kuralının anlamı nedir?" },
      { soru_id: K + "u04_k05_o06", on: "Süratin ortam derinliğiyle azalması ne demektir?" },
      { soru_id: K + "u04_k05_o07", on: "Normale yaklaşmanın nedeni nedir?" },
      { soru_id: K + "u04_k05_o08", on: "Kırılmada frekansın korunması ne demektir?" },
      { soru_id: K + "u04_k05_o10", on: "Yansımada ilerleme yönünün değişmesi ne demektir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u04_k05_o06",
        metin: "Derinliği 40 cm olan havuzdan derinliği 10 cm olan kısma geçen su dalgasının yayılma sürati nasıl değişir?"
      }
    ]
  },
  {
    konu_id: K + "u04_k06",
    onlar: [
      { soru_id: K + "u04_k06_o03", on: "Rezonansın yapıya zarar vermesinin nedeni nedir?" },
      { soru_id: K + "u04_k06_o04", on: "Sismik dalgaların tanımı nedir?" },
      { soru_id: K + "u04_k06_o05", on: "Fay hattının tanımı nedir?" },
      { soru_id: K + "u04_k06_o07", on: "Merkez üssünün tanımı nedir?" },
      { soru_id: K + "u04_k06_o09", on: "Değiştirilmiş Mercalli ölçeğinin ölçtüğü nedir?" },
      { soru_id: K + "u04_k06_o10", on: "Şiddeti belirleyen etmenler nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u04_k06_o01",
        secenekler: ["Genliğin sürekli azalıp sönmesi", "Doğal frekansa eşit dış etkiyle genliğin büyümesi", "Frekansın tamamen sıfırlanması", "Dalganın engelden geri yansıması"],
        dogru_index: 1
      },
      {
        soru_id: K + "u04_k06_o04",
        metin: "Deprem sırasında yer kabuğunda yayılan 2 tür dalgaya verilen ortak ad nedir?"
      },
      {
        soru_id: K + "u04_k06_o07",
        metin: "Bir depremde kırılma yerin 10 km derinliğinde gerçekleşmiştir. Merkez üssü ile odak noktası arasındaki ilişki nedir?",
        secenekler: ["Depremin magnitüd değeri", "Odağın yüzeydeki en yakın noktası", "Fay hattının uzunluğu", "Sismografın bulunduğu yer"],
        dogru_index: 1
      },
      {
        soru_id: K + "u04_k06_o09",
        secenekler: ["Ohm direnç ölçeği", "Değiştirilmiş Mercalli ölçeği", "Hertz frekans ölçeği", "Newton kuvvet ölçeği"],
        dogru_index: 1
      },
      {
        soru_id: K + "u04_k06_o10",
        secenekler: ["Yalnızca deprem büyüklüğü", "Yalnızca fayın uzunluğu", "Yalnızca depremin saati", "Odak uzaklığı, zemin ve yapı dayanıklılığı"],
        dogru_index: 3
      }
    ]
  }
];
