#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — TAMAMLIK · 9. DEMET
   u04_k04 (kalan), u04_k05 (kalan), u07_k01, u07_k02
   Koşullu olasılık ve Bayes.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/mat-tamlik9.js
   ============================================================ */
"use strict";

const K = "mat_10_";

module.exports = [
  {
    konu_id: K + "u04_k04",
    onlar: [
      { soru_id: K + "u04_k04_o06", on: "Paydanın sıfırlandığı noktanın dışlanma gerekçesi nedir?" },
      { soru_id: K + "u04_k04_o07", on: "Paydayı sıfırlayan değerin asimptot olarak adı nedir?" },
      { soru_id: K + "u04_k04_o13", on: "Karesel paydalı fonksiyonun işaret kuralı nedir?" },
      { soru_id: K + "u04_k04_o14", on: "İki noktada tanımsız kalan fonksiyonun tanım aralığı nedir?" },
      { soru_id: K + "u04_k04_o15", on: "Düşey ötelemenin yatay asimptota etkisi nedir?" },
      { soru_id: K + "u04_k04_o16", on: "Sabit katsayılı ters orantının değer kümesi nedir?" }
    ]
  },
  {
    konu_id: K + "u04_k05",
    onlar: [
      { soru_id: K + "u04_k05_o02", on: "Bire birliğin ters fonksiyonla ilişkisi nedir?" }
    ]
  },
  {
    konu_id: K + "u07_k01",
    onlar: [
      { soru_id: K + "u07_k01_o03", on: "Geri konmadan çekilişte olayların bağımlılığı nedir?" },
      { soru_id: K + "u07_k01_o04", on: "Geri konmayan çekilişte olasılık nasıl hesaplanır?" },
      { soru_id: K + "u07_k01_o05", on: "Koşullu olasılıkta örnek uzayın daralması ne demektir?" },
      { soru_id: K + "u07_k01_o06", on: "Koşul verildiğinde örnek uzayın yeni hâli nedir?" },
      { soru_id: K + "u07_k01_o07", on: "Ağırlıklı oranla koşullu olasılık nasıl bulunur?" },
      { soru_id: K + "u07_k01_o08", on: "Kesişim ve B olasılığından koşullu sonuç nedir?" },
      { soru_id: K + "u07_k01_o09", on: "Bağımsız olaylarda kesişim kuralı nedir?" },
      { soru_id: K + "u07_k01_o10", on: "Bağımsız olaylarda çarpım kuralının sonucu nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u07_k01_o07",
        metin: "Şekildeki çizelgede görülen fırıncı günde 200 buğday, 300 çavdar ekmeği üretiyor. Buğdayın 1/4'ünü, çavdarın 2/5'ini B marketine gönderiyor. Seçilen bir ekmeğin B marketine gideceği bilindiğine göre buğday ekmeği olma olasılığı kaçtır?"
      },
      {
        soru_id: K + "u07_k01_o03",
        secenekler: ["Bağımlıdır, ikinci çekiliş etkilenir", "Bağımsızdır, hiç etkilenmez", "Her zaman 1/2 olur", "Olasılık tanımsız olur"],
        dogru_index: 0
      }
    ]
  },
  {
    konu_id: K + "u07_k02",
    onlar: [
      { soru_id: K + "u07_k02_o01", on: "Olasılığın yeni veriyle güncellenmesi ne demektir?" },
      { soru_id: K + "u07_k02_o02", on: "Test pozitifken hastalık olasılığı nasıl hesaplanır?" },
      { soru_id: K + "u07_k02_o03", on: "Pozitif çıkanların toplamı nedir?" },
      { soru_id: K + "u07_k02_o04", on: "Yanlış pozitiflerin sayısı nedir?" },
      { soru_id: K + "u07_k02_o05", on: "Yalancı negatiflerin sayısı nedir?" },
      { soru_id: K + "u07_k02_o06", on: "Taş olasılığının test sonrası değeri nedir?" },
      { soru_id: K + "u07_k02_o07", on: "Yüz kişide pozitif sayısı nedir?" },
      { soru_id: K + "u07_k02_o08", on: "Hatalılar içinde kırmızının payı nedir?" },
      { soru_id: K + "u07_k02_o09", on: "Koşullu olasılıkta paydanın içeriği nedir?" },
      { soru_id: K + "u07_k02_o10", on: "Sıklık çizelgesinde satır toplamlarının anlamı nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u07_k02_o01",
        metin: "Toplumda %1 görülen bir hastalıkta test sonucu öğrenilince olasılık yeniden hesaplanır. Bayes teoreminin temel mantığı nedir?"
      },
      {
        soru_id: K + "u07_k02_o02",
        metin: "Şekildeki olasılık ağacına göre bir hastalığın toplumda görülme oranı %10, hastalık varken testin pozitif çıkma oranı %90, hastalık yokken pozitif çıkma oranı %20'dir. Testi pozitif çıkan bir kişinin gerçekten hasta olma olasılığı kaçtır?"
      },
      {
        soru_id: K + "u07_k02_o06",
        metin: "Şekildeki olasılık ağacına göre Türkiye'de böbrek taşı görülme sıklığı %15'tir. İdrar tahlili taşı olan bireylerde 4/5, olmayan bireylerde 2/17 oranında pozitif sonuç veriyor. Testi pozitif çıkan birinin böbreğinde taş olma olasılığı kaçtır?"
      }
    ]
  }
];
