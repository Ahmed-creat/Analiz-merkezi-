#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — TAMAMLIK · 16. DEMET (şık dağılımı düzeltmeleri)
   Dört havuzda doğru şıkkı 1. konumdan 0. konuma taşır (4/10 → 3/10).
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/fizik-tamlik16.js
   ============================================================ */
"use strict";

const K = "fizik_10_";

module.exports = [
  {
    konu_id: K + "u03_k06",
    duzeltmeler: [
      {
        soru_id: K + "u03_k06_o01",
        secenekler: ["Sigorta", "Voltmetre", "Anahtar", "Direnç"],
        dogru_index: 0
      }
    ]
  },
  {
    konu_id: K + "u03_k07",
    duzeltmeler: [
      {
        soru_id: K + "u03_k07_o09",
        secenekler: ["Islaklık vücut direncini düşürür", "Şebeke gerilimi yükselir", "Toprak direnci artar", "Kaçak akım azalır"],
        dogru_index: 0
      }
    ]
  },
  {
    konu_id: K + "u04_k06",
    duzeltmeler: [
      {
        soru_id: K + "u04_k06_o09",
        secenekler: ["Değiştirilmiş Mercalli ölçeği", "Ohm direnç ölçeği", "Hertz frekans ölçeği", "Newton kuvvet ölçeği"],
        dogru_index: 0
      }
    ]
  },
  {
    konu_id: K + "u04_k07",
    duzeltmeler: [
      {
        soru_id: K + "u04_k07_o07",
        secenekler: ["Yapıyı depremin etkisinden korumak", "Şebeke akımını kesmek", "Dışarıdaki sesi yalıtmak", "Gelen ışığı yansıtmak"],
        dogru_index: 0
      }
    ]
  }
];
