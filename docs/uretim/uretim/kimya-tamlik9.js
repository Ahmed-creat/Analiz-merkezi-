#!/usr/bin/env node
/* ============================================================
   KİMYA 10 — TAMAMLIK · 9. DEMET (u02_k08)
   Koligatif özellikler havuzu.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/kimya-tamlik9.js
   ============================================================ */
"use strict";

const K = "kimya_10_";

module.exports = [
  {
    konu_id: K + "u02_k08",
    onlar: [
      { soru_id: K + "u02_k08_o01", on: "Tanecik sayısının kaynama noktasına etkisi nedir?" },
      { soru_id: K + "u02_k08_o04", on: "Tuzlamanın buzlanmayı önleme nedeni nedir?" },
      { soru_id: K + "u02_k08_o05", on: "Antifrizin radyatördeki işlevi nedir?" },
      { soru_id: K + "u02_k08_o06", on: "İyonlaşmanın koligatif etkiye katkısı nedir?" },
      { soru_id: K + "u02_k08_o07", on: "Tuzlu suyun geç donmasının nedeni nedir?" },
      { soru_id: K + "u02_k08_o08", on: "Uçak kanadında alkol kullanımının işlevi nedir?" },
      { soru_id: K + "u02_k08_o09", on: "Çözünen taneciklerin buhar basıncını düşürmesinin kaynama noktasına etkisi nedir?" },
      { soru_id: K + "u02_k08_o10", on: "Koligatif etki ile tanecik sayısı arasındaki ilişki nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u02_k08_o02",
        fc: [
          "Koligatif özellikler nedir?",
          "Çözünen tanecik sayısına bağlı buhar basıncı düşmesi, kaynama noktası yükselmesi ve donma noktası alçalmasıdır."
        ],
        secenekler: ["Renk değişimi görülmesi", "Yoğunluğun artması", "Asitlik artışı", "Kaynama noktası yükselmesi"],
        dogru_index: 3
      },
      {
        soru_id: K + "u02_k08_o04",
        metin: "Kışın yollara tuz dökülüyor; −5 °C'de bile buzlanma azalıyor. Bunun nedeni nedir?",
        secenekler: ["Suyu kaynatmak", "Buhar basıncını artırmak", "Donma noktasını düşürmek", "Yolu temizlemek"],
        dogru_index: 2
      },
      {
        soru_id: K + "u02_k08_o05",
        metin: "Araç radyatörüne %50 antifriz konuyor. Bunun nedeni nedir?",
        secenekler: [
          "Yakıt tasarrufu sağlamak",
          "Rengi değiştirmek",
          "Basıncı artırmak",
          "Donmayı geciktirip kaynamayı önlemek"
        ],
        dogru_index: 3
      },
      {
        soru_id: K + "u02_k08_o06",
        secenekler: [
          "Şeker çözeltisinin olur",
          "NaCl çözeltisinin, çok tanecik oluşur",
          "İkisinde de eşit olur",
          "Önceden belirlenemez"
        ],
        dogru_index: 1
      },
      {
        soru_id: K + "u02_k08_o08",
        metin: "Hava 0 °C'nin altına düştüğünde uçak kanatlarına alkol püskürtülüyor. Bunun nedeni nedir?"
      }
    ]
  }
];
