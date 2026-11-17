#!/usr/bin/env node
/* ============================================================
   KİMYA 10 — TAMAMLIK · 10. DEMET (u03_k01, u03_k02)
   Yeşil kimya/ölçek ve atmosfer sorunları havuzları.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/kimya-tamlik10.js
   ============================================================ */
"use strict";

const K = "kimya_10_";

module.exports = [
  {
    konu_id: K + "u03_k01",
    onlar: [
      { soru_id: K + "u03_k01_o03", on: "Atom ekonomisinin ölçtüğü oran nedir?" },
      { soru_id: K + "u03_k01_o04", on: "Su ayak izinin tanımı nedir?" },
      { soru_id: K + "u03_k01_o06", on: "Atom ekonomisinin %100 olması ne demektir?" },
      { soru_id: K + "u03_k01_o08", on: "Sürdürülebilir deney tasarımının ölçütü nedir?" },
      { soru_id: K + "u03_k01_o09", on: "Ölçeğin kimyasal gözleme etkisi nedir?" },
      { soru_id: K + "u03_k01_o10", on: "Yeşil kimyanın tercih ettiği tasarım nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u03_k01_o03",
        secenekler: [
          "Giren atomların ürüne geçme oranını",
          "Tepkimenin hızını",
          "Kullanılan su miktarını",
          "Deneyin süresini"
        ],
        dogru_index: 0
      },
      {
        soru_id: K + "u03_k01_o04",
        secenekler: [
          "Suyun sertlik derecesini",
          "Sudaki iyon derişimini",
          "Bir ürün için harcanan toplam su miktarını",
          "Buharlaşma hızının değerini"
        ],
        dogru_index: 2
      },
      {
        soru_id: K + "u03_k01_o06",
        secenekler: ["Hiç ürün oluşmaz", "Tüm atomlar ürüne geçer", "Yan ürün çoktur", "Tepkime gerçekleşmez"],
        dogru_index: 1
      },
      {
        soru_id: K + "u03_k01_o07",
        metin: "Bir deneyde araştırmacı sıcaklığı 20 °C'den 40 °C'ye çıkarıp çözünme süresini ölçüyor. Bu deneyde bağımlı değişken nedir?",
        fc: [
          "Bağımsız ve bağımlı değişken arasındaki fark nedir?",
          "Bağımsız değişkeni araştırmacı değiştirir; bağımlı değişken buna bağlı olarak ölçülür."
        ]
      },
      {
        soru_id: K + "u03_k01_o08",
        metin: "Bir deneyde 5 farklı kimyasal yerine 1 kimyasalla aynı sonuç alınıyor. Sürdürülebilirlik açısından bu tasarımın önceliği nedir?",
        dogru_index: 1,
        secenekler: [
          "Daha çok kimyasal tüketmek",
          "Kimyasal ve su tüketimini azaltmak",
          "Deney süresini uzatmak",
          "Atığı doğrudan doğaya bırakmak"
        ]
      },
      {
        soru_id: K + "u03_k01_o10",
        secenekler: [
          "Bol çözücü kullanan tasarım",
          "Atığı lavaboya döken tasarım",
          "Tek kullanımlık bol malzemeli tasarım",
          "Az çözücü kullanan, atığı geri kazanılan tasarım"
        ],
        dogru_index: 3
      }
    ]
  },
  {
    konu_id: K + "u03_k02",
    onlar: [
      { soru_id: K + "u03_k02_o01", on: "Ozon tabakasının UV ışınları üzerindeki etkisi nedir?" },
      { soru_id: K + "u03_k02_o02", on: "CFC ve azot oksitlerin ozona etkisi nedir?" },
      { soru_id: K + "u03_k02_o04", on: "Asit yağmuru oluşturan gazların formülü nedir?" },
      { soru_id: K + "u03_k02_o05", on: "Klor içeren moleküllerin ozonla etkileşimi nedir?" },
      { soru_id: K + "u03_k02_o06", on: "Kutup girdabının ozon azalımındaki rolü nedir?" },
      { soru_id: K + "u03_k02_o08", on: "Tüketimi azaltmanın küresel sorunlara etkisi nedir?" },
      { soru_id: K + "u03_k02_o09", on: "Fosil yakıt yanmasının atmosfere etkisi nedir?" },
      { soru_id: K + "u03_k02_o10", on: "Asit yağmurunun toprak pH'ına etkisi nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u03_k02_o01",
        metin: "Güneş'ten gelen UV ışınlarının %90'ı yeryüzüne ulaşmıyor. Bu korumayı sağlayan stratosferdeki ozonun işlevi nedir?",
        secenekler: ["Atmosferi ısıtmak", "UV ışınlarını soğurmak", "Oksijen üretmek", "Azotu parçalamak"],
        dogru_index: 1
      },
      {
        soru_id: K + "u03_k02_o02",
        secenekler: ["Yalnız su buharı", "Yalnız oksijen", "Yalnız helyum", "CFC ve azot oksitler"],
        dogru_index: 3
      },
      {
        soru_id: K + "u03_k02_o03",
        fc: [
          "Sera etkisinde başlıca rol oynayan gaz nedir?",
          "CO2 (CH4 gibi gazlar da sera etkisi yapar)."
        ]
      },
      {
        soru_id: K + "u03_k02_o05",
        metin: "Orman yangınlarından çıkan duman, klor içeren molekülleri harekete geçiriyor ve 2 gün içinde ozon incelmesi ölçülüyor. Bunun nedeni nedir?",
        secenekler: ["Ozonu artırması", "Atmosferi soğutması", "Oksijeni yok etmesi", "Ozon tabakasını inceltmesi"],
        dogru_index: 3
      },
      {
        soru_id: K + "u03_k02_o06",
        metin: "Antarktika üzerinde kışın −80 °C'ye varan soğuma oluyor ve ozon azalıyor. Bu azalımın nedeni nedir?",
        secenekler: [
          "Güneş ışınlarının artması",
          "Buz parçacıklarının kloru etkinleştirmesi",
          "Oksijen oranının yükselmesi",
          "Deniz seviyesinin düşmesi"
        ],
        dogru_index: 1
      },
      {
        soru_id: K + "u03_k02_o07",
        metin: "Atmosferde sera gazları biriktikçe tutulan ısı artıyor; son 100 yılda ortalama sıcaklık yaklaşık 1 °C yükseldi. Bu artışın temel sonucu nedir?"
      },
      {
        soru_id: K + "u03_k02_o10",
        secenekler: [
          "Ozon miktarını artırması",
          "Havayı temizleyici etkisi",
          "Deniz seviyesini düşürmesi",
          "Toprak ve suyun pH'ını düşürmesi"
        ],
        dogru_index: 3
      }
    ]
  }
];
