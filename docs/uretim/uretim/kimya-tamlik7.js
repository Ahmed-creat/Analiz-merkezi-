#!/usr/bin/env node
/* ============================================================
   KİMYA 10 — TAMAMLIK · 7. DEMET (u02_k04, u02_k05)
   Derişim birimleri ve çözünürlük havuzları.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/kimya-tamlik7.js
   ============================================================ */
"use strict";

const K = "kimya_10_";

module.exports = [
  {
    konu_id: K + "u02_k04",
    onlar: [
      { soru_id: K + "u02_k04_o02", on: "ppm'in mg/L karşılığı nedir?" },
      { soru_id: K + "u02_k04_o04", on: "Molarite nasıl hesaplanır?" },
      { soru_id: K + "u02_k04_o05", on: "Molariteden mol sayısı nasıl bulunur?" },
      { soru_id: K + "u02_k04_o06", on: "ppm derişimi nasıl hesaplanır?" },
      { soru_id: K + "u02_k04_o07", on: "Hacim ve mg bilgisinden ppm nasıl bulunur?" },
      { soru_id: K + "u02_k04_o08", on: "Seyreltme hesabında M1V1 = M2V2 bağıntısı nedir?" },
      { soru_id: K + "u02_k04_o09", on: "Seyreltmede yeni derişim nasıl bulunur?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u02_k04_o02",
        secenekler: [
          "Bir litre çözeltideki mol sayısını",
          "Çözeltinin yoğunluğunu",
          "Çözünenin kütlece yüzdesini",
          "Bir litre çözeltide mg cinsinden çözünen kütlesi"
        ],
        dogru_index: 3
      },
      {
        soru_id: K + "u02_k04_o04",
        secenekler: ["0,125 mol/L", "0,25 mol/L", "2 mol/L", "4 mol/L"],
        dogru_index: 1
      }
    ]
  },
  {
    konu_id: K + "u02_k05",
    onlar: [
      { soru_id: K + "u02_k05_o03", on: "Çözünürlüğü belirleyen madde özelliği nedir?" },
      { soru_id: K + "u02_k05_o04", on: "Çözünürlük değerinden çözünen miktarı nasıl bulunur?" },
      { soru_id: K + "u02_k05_o05", on: "Doymuş çözeltiden çözünürlük nasıl bulunur?" },
      { soru_id: K + "u02_k05_o06", on: "Yavaş soğutmanın kristal boyutuna etkisi nedir?" },
      { soru_id: K + "u02_k05_o07", on: "Doymamış çözeltinin çözünürlük eğrisindeki yeri nedir?" },
      { soru_id: K + "u02_k05_o09", on: "Çözünürlüğün g/100 g çözücü ile ifadesinin anlamı nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u02_k05_o01",
        secenekler: [
          "Çözeltinin kaynama noktası değeri",
          "100 g çözücüde çözünen maksimum madde miktarı",
          "Çözücünün buhar basıncı değeri",
          "Çözünenin mol sayısı değeri"
        ],
        dogru_index: 1
      },
      {
        soru_id: K + "u02_k05_o09",
        secenekler: ["Mol sayısı / litre", "Miligram / litre", "Gram / mililitre", "Gram çözünen / 100 g çözücü"],
        dogru_index: 3,
        fc: [
          "Çözünürlüğün g/100 g çözücü ile ifadesinin anlamı nedir?",
          "100 g çözücüde çözünen maddenin gram cinsinden miktarı."
        ]
      }
    ]
  }
];
