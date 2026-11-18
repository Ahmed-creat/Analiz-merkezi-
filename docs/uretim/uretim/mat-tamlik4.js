#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — TAMAMLIK · 4. DEMET (u06_k02, u03_k03)
   Doğrunun analitik incelenmesi ve bölünebilmede kalan bulma.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/mat-tamlik4.js
   ============================================================ */
"use strict";

const K = "mat_10_";

module.exports = [
  {
    konu_id: K + "u06_k02",
    onlar: [
      { soru_id: K + "u06_k02_o02", on: "Paralel doğrularda eğimler arasındaki ilişki nedir?" },
      { soru_id: K + "u06_k02_o03", on: "Dik doğrularda eğim çarpımının değeri nedir?" },
      { soru_id: K + "u06_k02_o04", on: "İki noktadan eğim hesabının uygulanışı nedir?" },
      { soru_id: K + "u06_k02_o06", on: "Paralel doğruya geçerken eğim ne olur?" },
      { soru_id: K + "u06_k02_o07", on: "Dik doğruya geçerken eğim ne olur?" },
      { soru_id: K + "u06_k02_o08", on: "Yatay doğrunun eğiminin değeri nedir?" },
      { soru_id: K + "u06_k02_o09", on: "Düşey doğrunun eğimi için geçerli olan nedir?" },
      { soru_id: K + "u06_k02_o10", on: "Dik eğimin hesabı nedir?" }
    ]
  },
  {
    konu_id: K + "u03_k03",
    onlar: [
      { soru_id: K + "u03_k03_o02", on: "5 ile bölümden kalanı belirleyen nedir?" },
      { soru_id: K + "u03_k03_o05", on: "Rakamlar toplamıyla 9 kalanı nedir?" },
      { soru_id: K + "u03_k03_o06", on: "3 kalanının rakam toplamıyla bulunuşu nedir?" },
      { soru_id: K + "u03_k03_o07", on: "9 ile bölümde kalanın kuralı nedir?" },
      { soru_id: K + "u03_k03_o08", on: "Son iki basamağın 4 ile ilişkisi nedir?" },
      { soru_id: K + "u03_k03_o09", on: "Birleşik kalandan alt kalana geçişin kuralı nedir?" },
      { soru_id: K + "u03_k03_o10", on: "Rakamları toplamı 9'un katı olma kuralı nedir?" },
      { soru_id: K + "u03_k03_o12", on: "10 ile bölümde kalanın eşit olduğu basamak nedir?" }
    ]
  }
];
