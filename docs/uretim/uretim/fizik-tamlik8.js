#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — TAMAMLIK · 8. DEMET (u03_k03)
   Ohm Yasası havuzu.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/fizik-tamlik8.js
   ============================================================ */
"use strict";

const K = "fizik_10_";

module.exports = [
  {
    konu_id: K + "u03_k03",
    onlar: [
      { soru_id: K + "u03_k03_o02", on: "V = I·R bağıntısının anlamı nedir?" },
      { soru_id: K + "u03_k03_o06", on: "Verilen gerilim ve dirençten akım nasıl hesaplanır?" },
      { soru_id: K + "u03_k03_o07", on: "Akım ile direnç çarpımının karşılığı nedir?" },
      { soru_id: K + "u03_k03_o08", on: "Gerilim ve akımdan direnç nasıl bulunur?" },
      { soru_id: K + "u03_k03_o10", on: "Potansiyel farkın bağıntısı nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u03_k03_o05",
        metin: "Bir iletkenin direnci 4 Ω'da sabit tutulup gerilim 4 V'tan 8 V'a çıkarıldığında akım 1 A'dan 2 A'ya çıkıyor. Akım ile potansiyel fark arasındaki ilişki nedir?"
      }
    ]
  }
];
