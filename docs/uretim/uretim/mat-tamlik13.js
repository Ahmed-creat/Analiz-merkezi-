#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — TAMAMLIK · 13. DEMET (u01_k03)
   Üçgende alan: kart önleri ve şekil atıfları.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/mat-tamlik13.js
   ============================================================ */
"use strict";

const K = "mat_10_";

module.exports = [
  {
    konu_id: K + "u01_k03",
    onlar: [
      { soru_id: K + "u01_k03_o02", on: "Üçgen alanının taban-yükseklik hesabı nedir?" },
      { soru_id: K + "u01_k03_o04", on: "Ortak tabana sahip üçgenlerde alan eşitliğinin nedeni nedir?" },
      { soru_id: K + "u01_k03_o05", on: "Benzerlik oranının karesinin karşılığı nedir?" },
      { soru_id: K + "u01_k03_o07", on: "Alandan yükseklik nasıl bulunur?" },
      { soru_id: K + "u01_k03_o08", on: "Alan oranı ile kenar oranı arasındaki ilişki nedir?" },
      { soru_id: K + "u01_k03_o09", on: "Eşit tabanlı üçgenlerde alan oranının eşiti nedir?" },
      { soru_id: K + "u01_k03_o10", on: "Yüksekliği alandan hesaplamanın yolu nedir?" }
    ],
    duzeltmeler: [
      { soru_id: K + "u01_k03_o01", metin: "Şekildeki üçgenin alanı hangi bağıntıyla bulunur?" },
      { soru_id: K + "u01_k03_o02", metin: "Şekildeki üçgende taban uzunluğu 12 cm, bu tabana ait yükseklik 5 cm ise alanı kaç cm²'dir?" },
      { soru_id: K + "u01_k03_o03", metin: "Şekildeki üçgende taban sabit tutulup yükseklik 2 katına çıkarılırsa alanı nasıl değişir?" },
      { soru_id: K + "u01_k03_o04", metin: "Şekilde paralel iki doğru arasında ortak tabana sahip üçgenlerin alanları için hangisi doğrudur?" },
      { soru_id: K + "u01_k03_o05", metin: "Şekildeki benzer iki üçgenin benzerlik oranı 2/3 ise alanları oranı kaçtır?" },
      { soru_id: K + "u01_k03_o06", metin: "Şekildeki üçgende iki kenar 6 cm ve 8 cm, aralarındaki açı 30° ise alanı kaç cm²'dir? (sin30° = 1/2)" },
      { soru_id: K + "u01_k03_o07", metin: "Şekildeki üçgenin alanı 24 cm², bir kenarı 8 cm ise bu kenara ait yükseklik kaç cm'dir?" },
      { soru_id: K + "u01_k03_o08", metin: "Şekildeki üçgenin kenarları 3 katına çıkarılırsa alanı kaç katına çıkar?" },
      { soru_id: K + "u01_k03_o09", metin: "Şekilde tabanları eşit iki üçgenin yükseklikleri 3 cm ve 5 cm ise alanları oranı kaçtır?" },
      { soru_id: K + "u01_k03_o10", metin: "Şekildeki üçgenin alanı 36 cm², tabanı 9 cm ise yüksekliği kaç cm'dir?" }
    ]
  }
];
