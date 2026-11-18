#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — TAMAMLIK · 7. DEMET (u03_k01, u03_k02)
   Basit elektrik devreleri ve elektrik akımı havuzları.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/fizik-tamlik7.js
   ============================================================ */
"use strict";

const K = "fizik_10_";

module.exports = [
  {
    konu_id: K + "u03_k01",
    onlar: [
      { soru_id: K + "u03_k01_o03", on: "Anahtarın devredeki işlevi nedir?" },
      { soru_id: K + "u03_k01_o04", on: "Tel direncinin bağlı olduğu nicelikler nedir?" },
      { soru_id: K + "u03_k01_o05", on: "Analojide pompanın temsil ettiği eleman nedir?" },
      { soru_id: K + "u03_k01_o09", on: "Analojide incelen borunun temsil ettiği büyüklük nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u03_k01_o01",
        metin: "Bir iletkenin uçları arasındaki gerilim 6 V, üzerinden geçen akım 2 A ise direnci 3 Ω'dur. Direncin SI'daki birimi nedir?"
      },
      {
        soru_id: K + "u03_k01_o10",
        metin: "Bir pilin uçları arasındaki gerilim 1,5 V'tur. Potansiyel farkın birimi nedir?"
      }
    ]
  },
  {
    konu_id: K + "u03_k02",
    onlar: [
      { soru_id: K + "u03_k02_o03", on: "Akım yönünün kabulü nedir?" },
      { soru_id: K + "u03_k02_o04", on: "Elektronun yükünün değeri nedir?" },
      { soru_id: K + "u03_k02_o06", on: "Akım şiddeti nasıl hesaplanır?" },
      { soru_id: K + "u03_k02_o07", on: "Elektron sayısından yük miktarı nasıl bulunur?" },
      { soru_id: K + "u03_k02_o08", on: "Yük miktarı nasıl hesaplanır?" },
      { soru_id: K + "u03_k02_o09", on: "Seri devrede akımın kesitten bağımsız olması ne demektir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u03_k02_o02",
        metin: "Bir iletkenin kesitinden 1 s'de 1 C yük geçiyorsa akım 1 A'dır. Elektrik yükünün birimi nedir?"
      }
    ]
  }
];
