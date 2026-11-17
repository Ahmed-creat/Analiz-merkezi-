#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — TAMAMLIK · 15. DEMET (u04_k07)
   Depremle ilgili bilimsel model oluşturabilme havuzu.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/fizik-tamlik15.js
   ============================================================ */
"use strict";

const K = "fizik_10_";

module.exports = [
  {
    konu_id: K + "u04_k07",
    onlar: [
      { soru_id: K + "u04_k07_o03", on: "Sismogramın tanımı nedir?" },
      { soru_id: K + "u04_k07_o04", on: "Sismologun tanımı nedir?" },
      { soru_id: K + "u04_k07_o05", on: "Basit sismografın bileşenleri nedir?" },
      { soru_id: K + "u04_k07_o06", on: "Dolaylı ölçümün gerekliliği ne demektir?" },
      { soru_id: K + "u04_k07_o07", on: "Yapıyı sarsıntıdan ayırmanın yararı nedir?" },
      { soru_id: K + "u04_k07_o08", on: "Göl tabanı zeminin etkisi nedir?" },
      { soru_id: K + "u04_k07_o09", on: "Rezonans çakışmasının önlenmesi ne demektir?" },
      { soru_id: K + "u04_k07_o10", on: "Sismik izolatörlü yapıların risk azaltmadaki yeri nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u04_k07_o05",
        secenekler: ["Mıknatıs ve pil düzeneği", "Ayna ve mercek sistemi", "Türbin ve jeneratör", "Yay, ağırlıklı çubuk ve kalem"],
        dogru_index: 3
      },
      {
        soru_id: K + "u04_k07_o06",
        metin: "Depremler yılın her günü, yerin 10 km'lerce altında gerçekleşir. Depremlerin doğrudan ölçülememesinin nedeni nedir?"
      },
      {
        soru_id: K + "u04_k07_o07",
        metin: "Yüksek katlı bir hastane, temeline yerleştirilen 4 sismik izolatörle depreme hazırlanmıştır. Sismik izolatörlerin işlevi nedir?",
        secenekler: ["Şebeke akımını kesmek", "Yapıyı depremin etkisinden korumak", "Dışarıdaki sesi yalıtmak", "Gelen ışığı yansıtmak"],
        dogru_index: 1
      },
      {
        soru_id: K + "u04_k07_o09",
        secenekler: ["Bina daha hafif olsun diye", "Frekanslar çakışırsa rezonans yıkım yapar", "Maliyeti artırmak için", "Dış seslerin yalıtımı için"],
        dogru_index: 1
      }
    ]
  }
];
