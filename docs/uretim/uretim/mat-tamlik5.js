#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — TAMAMLIK · 5. DEMET (u03_k03 kalan düzeltmeleri,
   u04_k01 fonksiyonlar, u03_k02 bölünebilme)
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/mat-tamlik5.js
   ============================================================ */
"use strict";

const K = "mat_10_";

module.exports = [
  {
    konu_id: K + "u03_k03",
    onlar: [
      { soru_id: K + "u03_k03_o01", on: "Üçe bölümde rakam toplamı kuralı nedir?" },
      { soru_id: K + "u03_k03_o03", on: "Dörde bölümde son iki basamak kuralı nedir?" },
      { soru_id: K + "u03_k03_o13", on: "Rakam toplamını 9'a bölerek kalan bulma nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u03_k03_o01",
        secenekler: ["Yalnız son basamağına bakılır", "Rakam toplamının 3'e bölüm kalanına bakılır", "Son iki basamağına bakılır", "Sayı doğrudan 3'e bölünür"],
        dogru_index: 1
      },
      {
        soru_id: K + "u03_k03_o03",
        secenekler: ["Rakamlar toplamına", "Son iki basamağın 4'e bölüm kalanına bakılır", "Yalnız son basamağa bakılır", "Yalnız son üç basamağa bakılır"],
        dogru_index: 1
      }
    ]
  }
];
