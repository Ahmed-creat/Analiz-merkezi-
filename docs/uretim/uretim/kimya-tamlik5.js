#!/usr/bin/env node
/* ============================================================
   KİMYA 10 — TAMAMLIK · 5. DEMET (u01_k09, u02_k01)
   Graham yasası ve çözünme süreci havuzları.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/kimya-tamlik5.js
   ============================================================ */
"use strict";

const K = "kimya_10_";

module.exports = [
  {
    konu_id: K + "u01_k09",
    onlar: [
      { soru_id: K + "u01_k09_o04", on: "Graham Yasası'nda hız oranı nasıl hesaplanır?" },
      { soru_id: K + "u01_k09_o05", on: "Hız oranının mol kütleleriyle ilişkisi nedir?" },
      { soru_id: K + "u01_k09_o07", on: "Difüzyonun tanımı nedir?" },
      { soru_id: K + "u01_k09_o08", on: "Efüzyonun teknolojideki kullanım alanları nedir?" },
      { soru_id: K + "u01_k09_o09", on: "Mol kütlesinin yayılma hızına etkisi nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u01_k09_o01",
        secenekler: [
          "Gazın küçük bir delikten kaçması",
          "Gaz moleküllerinin birbiriyle yavaşça karışması",
          "Gazın sıvılaşması",
          "Gazın kabı ısıtması"
        ],
        dogru_index: 1
      },
      {
        soru_id: K + "u01_k09_o08",
        secenekler: ["Buzdolabının soğutması", "Sabun üretimi", "Kütle spektrometrisi", "Cam üfleme"],
        dogru_index: 2
      }
    ]
  },
  {
    konu_id: K + "u02_k01",
    onlar: [
      { soru_id: K + "u02_k01_o03", on: "Çözünürlüğün farmakolojideki önemi nedir?" },
      { soru_id: K + "u02_k01_o04", on: "Çözücü tanecikleri arası etkileşimlerin kopmasının sonucu nedir?" },
      { soru_id: K + "u02_k01_o07", on: "Karıştırma ve yüzey alanının çözünme hızına etkisi nedir?" },
      { soru_id: K + "u02_k01_o08", on: "Çözeltideki tanecik dağılımının özelliği nedir?" },
      { soru_id: K + "u02_k01_o09", on: "Kristalden ayrılma enerjisinin kaynağı nedir?" },
      { soru_id: K + "u02_k01_o10", on: "Yüzey alanı ile çözünme hızı arasındaki ilişki nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u02_k01_o01",
        secenekler: [
          "İki: ısıtma ve karıştırma",
          "Üç: kristalden çıkma, boşluk oluşumu, yerleşme",
          "Dört: erime, kaynama, soğuma, süzme",
          "Tek: çözünenin çözücüye eklenmesi"
        ],
        dogru_index: 1
      },
      {
        soru_id: K + "u02_k01_o02",
        metin: "Bir şeker kristali suya atıldığında ilk 2 saniyede yüzeyinden tanecikler ayrılıyor. Çözünme sürecinin bu ilk aşamasında ne olur?"
      },
      {
        soru_id: K + "u02_k01_o05",
        metin: "Çözünme sırasında çözünen ile çözücü tanecikleri arasında yeni etkileşimler oluşuyor; 2 maddenin karışması kabın sıcaklığını değiştirebiliyor. Bu etkileşimlerin enerji açısından sonucu nedir?"
      },
      {
        soru_id: K + "u02_k01_o04",
        secenekler: ["Suyun kaynamaya başlaması", "Şekerin eriyip yok olması", "Su molekülleri arası bağların kopması", "Basıncın sıfıra düşmesi"],
        dogru_index: 2
      },
      {
        soru_id: K + "u02_k01_o05",
        secenekler: ["Kütle yok olur", "Tanecik sayısı azalır", "Çözelti her zaman ısınır", "Enerji açığa çıkar ya da alınır"],
        dogru_index: 3
      },
      {
        soru_id: K + "u02_k01_o06",
        secenekler: ["Efüzyon", "Hidratasyon", "Difüzyon", "Nötralleşme"],
        dogru_index: 1
      },
      {
        soru_id: K + "u02_k01_o09",
        secenekler: ["Yalnız kaptan", "Çözücü etkileşimleri ve ortamdan", "Taneciklerin kütlesinden", "Havadan"],
        dogru_index: 1
      }
    ]
  }
];
