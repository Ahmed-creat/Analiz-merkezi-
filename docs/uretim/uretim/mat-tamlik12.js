#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — TAMAMLIK · 12. DEMET (u03_k01, u01_k01)
   Asal çarpanlar-bölen sayısı ve trigonometrik oranlar.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/mat-tamlik12.js
   ============================================================ */
"use strict";

const K = "mat_10_";

module.exports = [
  {
    konu_id: K + "u03_k01",
    onlar: [
      { soru_id: K + "u03_k01_o03", on: "Üslü çarpanlardan bölen sayısı nasıl bulunur?" },
      { soru_id: K + "u03_k01_o04", on: "Üslerin birer artırılıp çarpılması ne demektir?" },
      { soru_id: K + "u03_k01_o05", on: "Asal sayının bölen yapısı nedir?" },
      { soru_id: K + "u03_k01_o06", on: "72 için bölen sayısı hesabının sonucu nedir?" },
      { soru_id: K + "u03_k01_o07", on: "Bölenleri tek tek saymanın amacı nedir?" },
      { soru_id: K + "u03_k01_o08", on: "Tam kare sayının bölenlerinin özelliği nedir?" },
      { soru_id: K + "u03_k01_o09", on: "1'in asal sayılmama gerekçesi nedir?" },
      { soru_id: K + "u03_k01_o10", on: "İki asal çarpanlı sayıda bölen sayısı nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u03_k01_o05",
        secenekler: ["Tek olan her doğal sayı asaldır", "Yalnız 1 ve kendisine bölünen 1'den büyük sayı", "Yalnızca 2'ye bölünen sayılar", "1 dahil tüm doğal sayılar"],
        dogru_index: 1
      }
    ]
  },
  {
    konu_id: K + "u01_k01",
    onlar: [
      { soru_id: K + "u01_k01_o04", on: "Sinüs-kosinüs kareleri toplamının değeri nedir?" },
      { soru_id: K + "u01_k01_o05", on: "Tanjant ile kotanjantın çarpım değeri nedir?" },
      { soru_id: K + "u01_k01_o07", on: "Özel açıların oran değerleri nedir?" },
      { soru_id: K + "u01_k01_o08", on: "Sinüsün tümler açıdaki karşılığı nedir?" },
      { soru_id: K + "u01_k01_o09", on: "Kırık direk probleminde sinüsten yararlanma nedir?" }
    ],
    duzeltmeler: [
      { soru_id: K + "u01_k01_o01", metin: "Şekildeki dik üçgende dik kenar uzunlukları 7 birim ve 24 birim, küçük dar açının karşısındaki kenar 7 birimdir. Bu açının sinüs değeri kaçtır?" },
      { soru_id: K + "u01_k01_o02", metin: "Şekildeki aynı dik üçgende (kenarlar 7, 24, 25) α açısının kosinüs değeri kaçtır?" },
      { soru_id: K + "u01_k01_o03", metin: "Şekildeki aynı dik üçgende α açısının tanjant değeri kaçtır?" },
      { soru_id: K + "u01_k01_o04", metin: "Şekildeki dik üçgende bir dar açının sinüs ve kosinüs değerlerinin kareleri toplamı kaçtır?" },
      { soru_id: K + "u01_k01_o05", metin: "Şekildeki dik üçgende aynı dar açının tanjant ve kotanjant değerlerinin çarpımı kaçtır?" },
      { soru_id: K + "u01_k01_o06", metin: "Şekildeki trigonometrik oranlara göre sin30° değeri kaçtır?" },
      { soru_id: K + "u01_k01_o07", metin: "Şekildeki üçgene göre sin60°, cos60° ve tan45° değerleri sırasıyla hangisidir?" },
      { soru_id: K + "u01_k01_o08", metin: "Şekildeki dik üçgende bir dar açının sinüsü, tümlerinin (90° − x) hangi trigonometrik oranına eşittir?" },
      { soru_id: K + "u01_k01_o09", metin: "Şekildeki gibi zeminden 1,2 m yükseklikten kırılan direğin üst parçası zeminle 30° yapıyor. sin30° = 1/2 olduğuna göre direğin kırılmadan önceki uzunluğu kaç metredir?" },
      { soru_id: K + "u01_k01_o10", metin: "Şekildeki eğim açısı 17° olan bir yolun eğim yüzdesi yaklaşık kaçtır? (tan17° ≈ 0,2924)" }
    ]
  }
];
