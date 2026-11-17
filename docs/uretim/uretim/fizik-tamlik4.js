#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — TAMAMLIK · 4. DEMET (u01_k09, u02_k01)
   İki boyutta hareket ve iş kavramı havuzları.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/fizik-tamlik4.js
   ============================================================ */
"use strict";

const K = "fizik_10_";

module.exports = [
  {
    konu_id: K + "u01_k09",
    onlar: [
      { soru_id: K + "u01_k09_o01", on: "Yatay doğrultuda net kuvvet bulunmamasının sonucu nedir?" },
      { soru_id: K + "u01_k09_o02", on: "Uçuş süresi ile yükseklik arasındaki ilişki nedir?" },
      { soru_id: K + "u01_k09_o03", on: "Yatay atışta düşme süresi nasıl hesaplanır?" },
      { soru_id: K + "u01_k09_o08", on: "t = 2·v₀y/g bağıntısının anlamı nedir?" },
      { soru_id: K + "u01_k09_o09", on: "Tepe noktasında düşey hızın sıfır olmasının nedeni nedir?" },
      { soru_id: K + "u01_k09_o10", on: "Yatay atılan ve serbest bırakılan cisimlerin aynı anda düşmesinin nedeni nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u01_k09_o02",
        fc: [
          "Uçuş süresi ile yükseklik arasındaki ilişki nedir?",
          "Süre yalnız atıldığı yüksekliğe bağlıdır: h = ½·g·t²."
        ]
      },
      {
        soru_id: K + "u01_k09_o09",
        fc: [
          "Tepe noktasında düşey hızın sıfır olmasının nedeni nedir?",
          "Düşey hız azalarak sıfırlanır; cisim o anda yalnız yatay hızla ilerler."
        ]
      }
    ]
  },
  {
    konu_id: K + "u02_k01",
    onlar: [
      { soru_id: K + "u02_k01_o04", on: "İşin skaler bir büyüklük olması ne demektir?" },
      { soru_id: K + "u02_k01_o05", on: "Yer değiştirme yokken işin değeri nedir?" },
      { soru_id: K + "u02_k01_o06", on: "İş nasıl hesaplanır?" },
      { soru_id: K + "u02_k01_o07", on: "İşin F-x grafiğinden okunma yolu nedir?" },
      { soru_id: K + "u02_k01_o08", on: "F-x grafiğinin altındaki alan ile iş arasındaki ilişki nedir?" },
      { soru_id: K + "u02_k01_o09", on: "Sürtünmenin yaptığı işin işareti nedir?" },
      { soru_id: K + "u02_k01_o10", on: "İşin yolun şekline bağlı olmaması ne demektir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u02_k01_o02",
        metin: "SI birim sisteminde işin birimine hangi ad verilir?"
      },
      {
        soru_id: K + "u02_k01_o01",
        secenekler: [
          "Kuvvet ile zamanın çarpımı",
          "Kuvvet ile yer değiştirmenin çarpımı",
          "Kütle ile hızın çarpımı",
          "Kuvvetin hıza oranı"
        ],
        dogru_index: 1
      }
    ]
  }
];
