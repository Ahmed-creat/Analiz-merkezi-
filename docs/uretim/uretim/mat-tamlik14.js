#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — TAMAMLIK · 14. DEMET (şık dağılımı düzeltmeleri)
   Beş havuzda doğru şık oranı %35'in altına çekiliyor.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/mat-tamlik14.js
   ============================================================ */
"use strict";

const K = "mat_10_";

module.exports = [
  {
    konu_id: K + "u02_k01",
    duzeltmeler: [
      { soru_id: K + "u02_k01_o06", secenekler: ["%60", "%40", "%24", "%16"], dogru_index: 0 },
      { soru_id: K + "u02_k01_o14", secenekler: ["%45", "%20", "%15", "%25"], dogru_index: 3 }
    ]
  },
  {
    konu_id: K + "u02_k02",
    duzeltmeler: [
      { soru_id: K + "u02_k02_o06", secenekler: ["Rastgele ölçüm hatası", "Örneklemin büyük olması", "Yüzdelerin toplamının 100 olması", "Sistematik olarak gerçek değerden sapma"], dogru_index: 3 }
    ]
  },
  {
    konu_id: K + "u03_k01",
    duzeltmeler: [
      { soru_id: K + "u03_k01_o09", secenekler: ["Asal tanımı 1'den büyük sayıları kapsar", "Tek sayı olduğu için", "Çift sayı olduğu için", "Böleni olmadığı için"], dogru_index: 0 }
    ]
  },
  {
    konu_id: K + "u03_k03",
    duzeltmeler: [
      { soru_id: K + "u03_k03_o06", secenekler: ["2", "1", "0", "14"], dogru_index: 0 }
    ]
  },
  {
    konu_id: K + "u05_k02",
    duzeltmeler: [
      { soru_id: K + "u05_k02_o09", secenekler: ["8,75", "70", "8,3666", "8,375"], dogru_index: 3 }
    ]
  }
];
