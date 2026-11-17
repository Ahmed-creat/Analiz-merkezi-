#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — TAMAMLIK · 1. DEMET (u01_k01)
   Sabit hızlı hareket: kart önleri kavram/formül kalıbına çevrildi,
   metinlere görsel göndermesi eklendi, uzun doğru şık dengelendi.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/fizik-tamlik1.js
   ============================================================ */
"use strict";

const K = "fizik_10_";

module.exports = [
  {
    konu_id: K + "u01_k01",
    onlar: [
      { soru_id: K + "u01_k01_o01", on: "Eşit zaman aralıklarında eşit yol almanın anlamı nedir?" },
      { soru_id: K + "u01_k01_o02", on: "Skaler ve vektörel büyüklük ayrımı nedir?" },
      { soru_id: K + "u01_k01_o04", on: "Konum-zaman grafiğinin eğimi hangi niceliği verir?" },
      { soru_id: K + "u01_k01_o05", on: "Hız-zaman grafiği yatay olan hareketin türü nedir?" },
      { soru_id: K + "u01_k01_o06", on: "Sabit hızlı harekette hızın büyüklüğü nasıl hesaplanır?" },
      { soru_id: K + "u01_k01_o07", on: "Hız-zaman grafiğinin altındaki alan hangi niceliği verir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u01_k01_o01",
        metin: "Şekildeki gibi eşit zaman aralıklarında eşit yol alan bir cismin hareketi nasıl adlandırılır?"
      },
      {
        soru_id: K + "u01_k01_o02",
        metin: "Tablodaki 2 büyüklüğe göre sabit sürat ile sabit hız arasındaki fark nedir?"
      },
      {
        soru_id: K + "u01_k01_o03",
        metin: "Grafikte hız-zaman doğrusu yataydır. Bu cisim için ivme kaçtır?",
        fc: [
          "İvmenin tanımı nedir?",
          "Hızın birim zamandaki değişimidir; hız sabitse ivme sıfırdır."
        ]
      },
      {
        soru_id: K + "u01_k01_o04",
        metin: "Şekildeki konum-zaman grafiği sabit hızlı bir harekete aittir. Bu grafik nasıldır?",
        fc: [
          "Konum-zaman grafiğinin eğimi hangi niceliği verir?",
          "Hızı verir; sabit hızlı harekette eğim sabittir."
        ]
      },
      {
        soru_id: K + "u01_k01_o05",
        metin: "Grafikteki yatay hız-zaman doğrusuna sahip cisim için hangisi doğrudur?"
      },
      {
        soru_id: K + "u01_k01_o06",
        metin: "Üretim bandındaki ürün birinci bantta 12 m'lik yolu 4 s'de alıyor. Tablodaki verilere göre hızının büyüklüğü kaç m/s'dir?"
      },
      {
        soru_id: K + "u01_k01_o08",
        metin: "Hastane içi taşıma robotu, tablodaki verilere göre 720 m'lik koridoru 90 s'de geçiyor. Ortalama sürati kaç m/s'dir?"
      },
      {
        soru_id: K + "u01_k01_o09",
        metin: "Şekildeki gibi aralarındaki uzaklık 480 m olan K ve L noktalarından 5 m/s ve 7 m/s süratlerle birbirine doğru hareket eden iki scooter kaç s sonra karşılaşır?"
      },
      {
        soru_id: K + "u01_k01_o10",
        metin: "Hız-zaman grafiği şekilde verilen sporcu koşu bandında 120 s boyunca 3 m/s, sonraki 120 s boyunca 6 m/s hızla koşuyor. Ortalama sürati kaç m/s'dir?",
        secenekler: ["4 m/s", "5 m/s", "6 m/s", "4,5 m/s"],
        dogru_index: 3
      }
    ]
  }
];
