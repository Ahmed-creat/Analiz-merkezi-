#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — TAMAMLIK · 10. DEMET (u02_k01, u02_k02)
   İki kategorik değişkenli veri ve araştırma değerlendirme.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/mat-tamlik10.js
   ============================================================ */
"use strict";

const K = "mat_10_";

module.exports = [
  {
    konu_id: K + "u02_k01",
    onlar: [
      { soru_id: K + "u02_k01_o04", on: "Kategorik veri görselleştirmesinde uygun araç nedir?" },
      { soru_id: K + "u02_k01_o05", on: "Araştırma sorusunun ölçülebilirlik koşulu nedir?" },
      { soru_id: K + "u02_k01_o06", on: "Yüzde hesabının oranı nedir?" },
      { soru_id: K + "u02_k01_o08", on: "Temsil gücü düşük örneklemin sonucu nedir?" },
      { soru_id: K + "u02_k01_o09", on: "İlişkiden nedensellik çıkarma sınırı nedir?" },
      { soru_id: K + "u02_k01_o10", on: "Satır yüzdelerinin benzerliği ne demektir?" },
      { soru_id: K + "u02_k01_o14", on: "Satır yüzdesinde paydanın değeri nedir?" },
      { soru_id: K + "u02_k01_o15", on: "Yüzdeler arasındaki büyük farkın anlamı nedir?" },
      { soru_id: K + "u02_k01_o16", on: "Az gözlemde yüzde yorumunun sakıncası nedir?" }
    ]
  },
  {
    konu_id: K + "u02_k02",
    onlar: [
      { soru_id: K + "u02_k02_o03", on: "Küçük örneklemin sakıncası nedir?" },
      { soru_id: K + "u02_k02_o04", on: "Kırpılmış eksenin yarattığı yanılgı nedir?" },
      { soru_id: K + "u02_k02_o05", on: "Anket sonuçlarının farklılaşma nedeni nedir?" },
      { soru_id: K + "u02_k02_o07", on: "Kaynağın güvenilirliğini belirleyen ölçüt nedir?" },
      { soru_id: K + "u02_k02_o08", on: "Yorum farkının kaynağı nedir?" },
      { soru_id: K + "u02_k02_o09", on: "Araştırma raporunda bulunması gereken nedir?" },
      { soru_id: K + "u02_k02_o10", on: "Yorumun çürütülmesinde izlenecek yol nedir?" }
    ]
  }
];
