#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — TAMAMLIK · 8. DEMET
   u04_k02 (kalan), u04_k03, u04_k04, u04_k05
   Karekök-rasyonel fonksiyonlar ve ters fonksiyon.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/mat-tamlik8.js
   ============================================================ */
"use strict";

const K = "mat_10_";

module.exports = [
  {
    konu_id: K + "u04_k02",
    onlar: [
      { soru_id: K + "u04_k02_o07", on: "Maksimumu veren sınır noktası nedir?" },
      { soru_id: K + "u04_k02_o11", on: "Simetri ekseninin bağıntısı nedir?" },
      { soru_id: K + "u04_k02_o12", on: "Tepe apsisinin genel formülü nedir?" },
      { soru_id: K + "u04_k02_o19", on: "Tepe biçimindeki parabolün köşe noktası nedir?" },
      { soru_id: K + "u04_k02_o23", on: "Sabit terimin y ekseni kesişimine etkisi nedir?" }
    ]
  },
  {
    konu_id: K + "u04_k03",
    onlar: [
      { soru_id: K + "u04_k03_o03", on: "√x fonksiyonunun monotonluk davranışı nedir?" },
      { soru_id: K + "u04_k03_o04", on: "√x'in bire birlik durumu nedir?" },
      { soru_id: K + "u04_k03_o07", on: "Aralığın sol ucunda karekök fonksiyonunun değeri nedir?" },
      { soru_id: K + "u04_k03_o09", on: "√x'in sıfırının koordinatı nedir?" },
      { soru_id: K + "u04_k03_o10", on: "Karekök denkleminin çözüm kuralı nedir?" },
      { soru_id: K + "u04_k03_o12", on: "Negatif işaretli karekök fonksiyonunun görüntü kümesi nedir?" }
    ],
    duzeltmeler: [
      { soru_id: K + "u04_k03_o01", metin: "f(x) = √x kuralıyla verilen fonksiyon hangi x değerlerinde tanımlıdır?" },
      { soru_id: K + "u04_k03_o02", metin: "f(x) = √x kuralında elde edilen değerler hangi aralığa düşer?" },
      { soru_id: K + "u04_k03_o08", metin: "f(x) = √(x − 3) kuralı hangi x değerlerinden başlayarak tanımlıdır?" },
      { soru_id: K + "u04_k03_o11", metin: "f(x) = √(x + 4) kuralı hangi aralıkta tanımlıdır?" },
      { soru_id: K + "u04_k03_o12", metin: "f(x) = −√x kuralında elde edilen değerler hangi aralığa düşer?" }
    ]
  },
  {
    konu_id: K + "u04_k04",
    onlar: [
      { soru_id: K + "u04_k04_o02", on: "Değerlerin hiç sıfır olmaması ne demektir?" },
      { soru_id: K + "u04_k04_o03", on: "Payı sıfır yapan değerin yokluğu ne demektir?" },
      { soru_id: K + "u04_k04_o04", on: "Hiperbol kollarının monotonluğu nedir?" },
      { soru_id: K + "u04_k04_o06", on: "Paydanın sıfırlandığı nokta neden dışlanır?" },
      { soru_id: K + "u04_k04_o07", on: "Paydayı sıfırlayan değerin grafikteki karşılığı nedir?" },
      { soru_id: K + "u04_k04_o08", on: "x büyürken değerin sıfıra yaklaşması ne demektir?" },
      { soru_id: K + "u04_k04_o09", on: "Negatif girdinin rasyonel fonksiyondaki sonucu nedir?" },
      { soru_id: K + "u04_k04_o10", on: "Tanım kümesinden çıkarılan değer nedir?" }
    ],
    duzeltmeler: [
      { soru_id: K + "u04_k04_o02", metin: "f(x) = 1/x kuralında elde edilen değerler hangi kümedir?" },
      { soru_id: K + "u04_k04_o13", metin: "f(x) = 1 / x² fonksiyonunun işareti için hangisi doğrudur?" },
      {
        soru_id: K + "u04_k04_o05",
        secenekler: ["4", "−4", "0'ın kendisi", "1/4"],
        dogru_index: 3
      }
    ]
  },
  {
    konu_id: K + "u04_k05",
    onlar: [
      { soru_id: K + "u04_k05_o01", on: "Ters fonksiyonun grafiğinin simetri ekseni nedir?" },
      { soru_id: K + "u04_k05_o02", on: "Bire birlik neden tersin koşuludur?" },
      { soru_id: K + "u04_k05_o03", on: "Tanım ve görüntü kümelerinin yer değiştirmesi ne demektir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u04_k05_o06",
        secenekler: ["−x ifadesi", "Kendisi", "1/x ifadesi", "x² ifadesi"],
        dogru_index: 1
      }
    ]
  }
];
