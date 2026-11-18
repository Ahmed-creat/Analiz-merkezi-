#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — TAMAMLIK · 6. DEMET (u04_k01, u03_k02)
   Fonksiyonların nitel özellikleri; EBOB-EKOK.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/mat-tamlik6.js
   ============================================================ */
"use strict";

const K = "mat_10_";

module.exports = [
  {
    konu_id: K + "u04_k01",
    onlar: [
      { soru_id: K + "u04_k01_o02", on: "Her görüntünün tek bir ön görüntüsü olması ne demektir?" },
      { soru_id: K + "u04_k01_o03", on: "Değer kümesinin tamamen kullanılması ne demektir?" },
      { soru_id: K + "u04_k01_o04", on: "x büyüdükçe değerin büyümesi ne demektir?" },
      { soru_id: K + "u04_k01_o06", on: "Görüntü kümesinin sınırları nedir?" },
      { soru_id: K + "u04_k01_o08", on: "Karesel fonksiyonun bire birlik koşulunu sağlamama nedeni nedir?" },
      { soru_id: K + "u04_k01_o09", on: "Doğrusal fonksiyonun sıfırının hesabı nedir?" },
      { soru_id: K + "u04_k01_o10", on: "Sabit fonksiyonun grafiğinin biçimi nasıldır?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u04_k01_o10",
        secenekler: ["Her x için farklı değerler alır", "Fonksiyon bire birdir", "Tanım kümesi boştur", "Her x için aynı değeri alır"],
        dogru_index: 3
      }
    ]
  },
  {
    konu_id: K + "u03_k02",
    onlar: [
      { soru_id: K + "u03_k02_o03", on: "Ortak bölenlerin en büyüğünün değeri nedir?" },
      { soru_id: K + "u03_k02_o04", on: "Ortak katların en küçüğünün değeri nedir?" },
      { soru_id: K + "u03_k02_o05", on: "Ortak çarpanların kesişiminin verdiği değer nedir?" },
      { soru_id: K + "u03_k02_o06", on: "İki sayının ortak katı nasıl bulunur?" },
      { soru_id: K + "u03_k02_o07", on: "EBOB ile EKOK çarpımının eşiti nedir?" },
      { soru_id: K + "u03_k02_o08", on: "İki sayı için EBOB ve EKOK birlikte nasıl bulunur?" },
      { soru_id: K + "u03_k02_o09", on: "En büyük eşit parça uzunluğunun kavramı nedir?" },
      { soru_id: K + "u03_k02_o10", on: "Birlikte çalma anının hesabı nedir?" },
      { soru_id: K + "u03_k02_o11", on: "Aralarında asallığın EBOB'a etkisi nedir?" },
      { soru_id: K + "u03_k02_o14", on: "Kare fayans kenarının kavramı nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u03_k02_o01",
        metin: "12 ve 18 sayılarını da kalansız bölen en büyük sayı 6'dır. En büyük ortak bölen (EBOB) nedir?",
        secenekler: ["Verilen sayıların en büyüğü", "Sayıları bölen en büyük doğal sayı", "Sayıların birbiriyle çarpımı", "Sayıların birbiriyle toplamı"],
        dogru_index: 1
      },
      {
        soru_id: K + "u03_k02_o02",
        metin: "6 ve 8 sayılarının ortak katları 24, 48, 72 diye sürer. En küçük ortak kat (EKOK) nedir?"
      }
    ]
  }
];
