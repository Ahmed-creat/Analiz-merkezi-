#!/usr/bin/env node
/* ============================================================
   KİMYA 10 — TAMAMLIK · 8. DEMET (u02_k06, u02_k07)
   Çözünürlüğe etki eden faktörler ve çözelti sınıflandırması.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/kimya-tamlik8.js
   ============================================================ */
"use strict";

const K = "kimya_10_";

module.exports = [
  {
    konu_id: K + "u02_k06",
    onlar: [
      { soru_id: K + "u02_k06_o01", on: "Katıların çözünürlüğünün sıcaklıkla ilişkisi nedir?" },
      { soru_id: K + "u02_k06_o02", on: "Isınan suda çözünmüş oksijenin azalmasının nedeni nedir?" },
      { soru_id: K + "u02_k06_o03", on: "Basınç artışının gaz çözünürlüğüne etkisi nedir?" },
      { soru_id: K + "u02_k06_o04", on: "Soğuk suda çözünmüş oksijenin fazla olmasının sonucu nedir?" },
      { soru_id: K + "u02_k06_o05", on: "Basınç azalmasının gaz çözünürlüğüne etkisi nedir?" },
      { soru_id: K + "u02_k06_o06", on: "Sıcak suyun pancardaki şekeri çözme etkisi nedir?" },
      { soru_id: K + "u02_k06_o07", on: "Düşük sıcaklığın CO2 çözünürlüğüne etkisi nedir?" },
      { soru_id: K + "u02_k06_o08", on: "Basınç artışının kandaki azot çözünürlüğüne etkisi nedir?" },
      { soru_id: K + "u02_k06_o09", on: "Maddenin cinsinin çözünürlüğe etkisi nedir?" },
      { soru_id: K + "u02_k06_o10", on: "Aynı çözücüde farklı çözünürlüklerin nedeni nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u02_k06_o02",
        fc: [
          "Isınan suda çözünmüş oksijenin azalmasının nedeni nedir?",
          "Gazların çözünürlüğü sıcaklık arttıkça azalır."
        ]
      },
      {
        soru_id: K + "u02_k06_o04",
        metin: "Kuzey denizlerinde su sıcaklığı 4 °C civarındadır ve balıkçılık gelişmiştir. Bunun nedeni nedir?"
      },
      {
        soru_id: K + "u02_k06_o06",
        metin: "Şeker pancarından şeker elde edilirken 70 °C'lik sıcak su kullanılıyor. Bunun nedeni nedir?",
        secenekler: [
          "Suyun buharlaşıp kaybolması",
          "Sıcaklıkla şeker çözünürlüğünün artması",
          "Şekerin bozunup kararması",
          "Basıncın hızla artması"
        ],
        dogru_index: 1
      },
      {
        soru_id: K + "u02_k06_o07",
        metin: "Asitli içeceklerin üzerinde “4 °C'de içiniz.” yazıyor. Bunun nedeni nedir?"
      },
      {
        soru_id: K + "u02_k06_o08",
        metin: "Bir dalgıç 40 m derinliğe inerken normal hava yerine özel karışım kullanıyor. Bunun nedeni nedir?",
        secenekler: [
          "Oksijen oranının azalması",
          "Suyun çok sıcak olması",
          "Basınç artınca azotun kanda çözünmesi",
          "Havanın neminde kuruma"
        ],
        dogru_index: 2
      }
    ]
  },
  {
    konu_id: K + "u02_k07",
    onlar: [
      { soru_id: K + "u02_k07_o01", on: "Elektrolit çözeltilerde iletkenliğin kaynağı nedir?" },
      { soru_id: K + "u02_k07_o02", on: "Doymamış çözeltinin tanımı nedir?" },
      { soru_id: K + "u02_k07_o03", on: "Aşırı doymuş çözeltinin kararsızlığının nedeni nedir?" },
      { soru_id: K + "u02_k07_o04", on: "Elektrolit olmayan çözeltide iyon durumu nedir?" },
      { soru_id: K + "u02_k07_o05", on: "Doymuş çözeltide katısıyla denge ne demektir?" },
      { soru_id: K + "u02_k07_o07", on: "Sülfürik asidin iyonlaşmasının aküdeki işlevi nedir?" },
      { soru_id: K + "u02_k07_o08", on: "Doyma noktasına ulaşmanın yolları nedir?" },
      { soru_id: K + "u02_k07_o09", on: "İletkenliğin serbest iyonlara bağlılığı nedir?" },
      { soru_id: K + "u02_k07_o10", on: "İyonik ve moleküler çözünmenin iletkenliğe etkisi nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u02_k07_o03",
        secenekler: [
          "Kararsızdır, çökelme görülebilir",
          "Kararlıdır ve çökelme görülmez",
          "Elektrolit değildir",
          "Saf çözücüdür"
        ],
        dogru_index: 0
      },
      {
        soru_id: K + "u02_k07_o05",
        secenekler: ["Sürekli çökelme olur", "Elektrolit değildir", "Doymamıştır", "Katı miktarı değişmez"],
        dogru_index: 3
      },
      {
        soru_id: K + "u02_k07_o08",
        secenekler: [
          "Çözücü suyu artırarak",
          "Kabın basıncını düşürerek",
          "Çözünen ekleyip çözücüyü buharlaştırarak",
          "Kabı daha büyük seçerek"
        ],
        dogru_index: 2
      },
      {
        soru_id: K + "u02_k07_o09",
        metin: "Bir şeker çözeltisi 2 elektrot arasına konduğunda ampul yanmıyor. İletim görülmemesinin nedeni nedir?"
      }
    ]
  }
];
