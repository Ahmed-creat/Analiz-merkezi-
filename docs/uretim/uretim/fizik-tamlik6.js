#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — TAMAMLIK · 6. DEMET (u02_k03, u02_k04)
   Mekanik enerji ve enerji kaynakları havuzları.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/fizik-tamlik6.js
   ============================================================ */
"use strict";

const K = "fizik_10_";

module.exports = [
  {
    konu_id: K + "u02_k03",
    onlar: [
      { soru_id: K + "u02_k03_o03", on: "EK = ½·m·v² bağıntısının anlamı nedir?" },
      { soru_id: K + "u02_k03_o04", on: "İş-kinetik enerji teoreminin anlamı nedir?" },
      { soru_id: K + "u02_k03_o05", on: "Mekanik enerjinin korunum koşulu nedir?" },
      { soru_id: K + "u02_k03_o06", on: "Potansiyel enerji nasıl hesaplanır?" },
      { soru_id: K + "u02_k03_o07", on: "Kinetik enerji nasıl hesaplanır?" },
      { soru_id: K + "u02_k03_o08", on: "Yükseklikten düşen cismin hızı nasıl bulunur?" },
      { soru_id: K + "u02_k03_o09", on: "Sürtünmeli harekette mekanik enerjinin azalma nedeni nedir?" },
      { soru_id: K + "u02_k03_o10", on: "Gerilmiş yayda depolanan enerji nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u02_k03_o04",
        metin: "Bir cisme etki eden net kuvvet 12 J iş yapıyor ve cismin kinetik enerjisi 12 J artıyor. İş ile kinetik enerji arasındaki ilişki nedir?"
      },
      {
        soru_id: K + "u02_k03_o09",
        secenekler: ["Korunur ve sabit kalır", "Bir kısmı ısıya dönüşür", "Sürekli artar", "Değişmez ve ısı oluşmaz"],
        dogru_index: 1
      }
    ]
  },
  {
    konu_id: K + "u02_k04",
    onlar: [
      { soru_id: K + "u02_k04_o01", on: "Kömürün enerji kaynağı sınıfı nedir?" },
      { soru_id: K + "u02_k04_o02", on: "Rüzgârın enerji kaynağı sınıfı nedir?" },
      { soru_id: K + "u02_k04_o04", on: "Uranyumun yenilenemeyen kaynak sayılması ne demektir?" },
      { soru_id: K + "u02_k04_o05", on: "Enerji sınıfı etiketinde A harfinin anlamı nedir?" },
      { soru_id: K + "u02_k04_o06", on: "Yakıt türlerinin elektrik verimi karşılaştırması nedir?" },
      { soru_id: K + "u02_k04_o07", on: "Petrol ile kömürün kWh verimi arasındaki fark nedir?" },
      { soru_id: K + "u02_k04_o08", on: "Nükleer santrallerin emisyon durumu nedir?" },
      { soru_id: K + "u02_k04_o10", on: "Türkiye'de elektrik üretiminde fosil yakıtların payı nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u02_k04_o06",
        secenekler: ["4,5 kWh", "3 kWh", "50.000 kWh", "500 kWh"],
        dogru_index: 2
      },
      {
        soru_id: K + "u02_k04_o08",
        metin: "Nükleer santraller işletme sırasında sera gazı salmıyor ama radyoaktif atık üretiyor. Havayı en az kirleten santraller arasında sayılmalarının nedeni nedir?",
        secenekler: ["Kömür kullanmaları", "Hiç atık üretmemeleri", "Sera gazı emisyonu oluşturmaması", "Su tüketmemeleri"],
        dogru_index: 2
      },
      {
        soru_id: K + "u02_k04_o09",
        secenekler: ["Elektrik jeneratörü", "Fotovoltaik sistem", "Buhar türbini", "Nükleer reaktör"],
        dogru_index: 1
      }
    ]
  }
];
