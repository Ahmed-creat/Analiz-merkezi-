#!/usr/bin/env node
/* ============================================================
   KİMYA 10 — TAMAMLIK · 11. DEMET (şı dağılımı dengesi)
   Önceki düzeltmelerde doğru cevap bazı indekslerde birikti;
   seçenek sırası kaydırılarak dağılım %40 → %30'a çekildi.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/kimya-tamlik11.js
   ============================================================ */
"use strict";

const K = "kimya_10_";

module.exports = [
  {
    konu_id: K + "u02_k04",
    duzeltmeler: [
      { soru_id: K + "u02_k04_o09", secenekler: ["0,2", "0,5", "1", "5"], dogru_index: 0 }
    ]
  },
  {
    konu_id: K + "u02_k05",
    duzeltmeler: [
      { soru_id: K + "u02_k05_o05", secenekler: ["30", "70", "130", "3"], dogru_index: 0 }
    ]
  },
  {
    konu_id: K + "u03_k01",
    duzeltmeler: [
      {
        soru_id: K + "u03_k01_o09",
        secenekler: [
          "Gözlem benzer olur, tüketilen madde miktarı farklı olur",
          "Gözlem tamamen farklı olur",
          "Mikro ölçekte tepkime olmaz",
          "Makro ölçekte ürün oluşmaz"
        ],
        dogru_index: 0
      }
    ]
  }
];
