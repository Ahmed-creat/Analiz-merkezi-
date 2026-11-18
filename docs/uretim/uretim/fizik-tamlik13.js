#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — TAMAMLIK · 13. DEMET (u04_k03, u04_k04)
   Yayılma süratini etkileyen etmenler ve periyodik hareketler.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/fizik-tamlik13.js
   ============================================================ */
"use strict";

const K = "fizik_10_";

module.exports = [
  {
    konu_id: K + "u04_k03",
    onlar: [
      { soru_id: K + "u04_k03_o01", on: "Su dalgasında derinliğin sürate etkisi nedir?" },
      { soru_id: K + "u04_k03_o02", on: "Katı ortamın ses hızına etkisi nedir?" },
      { soru_id: K + "u04_k03_o03", on: "Süratin ortam özelliklerine bağlı olması ne demektir?" },
      { soru_id: K + "u04_k03_o05", on: "Süratin frekanstan bağımsız olması ne demektir?" },
      { soru_id: K + "u04_k03_o06", on: "Derin ortamdan sığ ortama geçişte süratin azalmasının nedeni nedir?" },
      { soru_id: K + "u04_k03_o08", on: "Frekansın ortamlar arasında korunması ne demektir?" },
      { soru_id: K + "u04_k03_o09", on: "Yay gerginliğinin dalga süratine etkisi nedir?" },
      { soru_id: K + "u04_k03_o10", on: "Derinlik farkının sürate yansıması nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u04_k03_o06",
        metin: "Derinliği 20 cm olan ortamdan derinliği 5 cm olan ortama geçen su dalgasının sürati nasıl değişir?"
      },
      {
        soru_id: K + "u04_k03_o03",
        metin: "Aynı kaynaktan çıkan 2 dalga farklı ortamlara girince süratleri değişir. Bir dalganın yayılma süratini belirleyen temel etmen nedir?"
      }
    ]
  },
  {
    konu_id: K + "u04_k04",
    onlar: [
      { soru_id: K + "u04_k04_o01", on: "Düzenli tekrarın tanımı nedir?" },
      { soru_id: K + "u04_k04_o03", on: "Sarkaç periyodunun kütleden bağımsız olması ne demektir?" },
      { soru_id: K + "u04_k04_o04", on: "Yay sarkacı periyodunu belirleyen nicelikler nedir?" },
      { soru_id: K + "u04_k04_o05", on: "Küçük açı sınırının değeri nedir?" },
      { soru_id: K + "u04_k04_o06", on: "Periyodun ip uzunluğuyla artması ne demektir?" },
      { soru_id: K + "u04_k04_o07", on: "Kütle artışının periyoda etkisi nedir?" },
      { soru_id: K + "u04_k04_o08", on: "İp kısalmasının periyoda etkisi nedir?" },
      { soru_id: K + "u04_k04_o09", on: "Yay sarkacında periyodu büyüten etken nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u04_k04_o01",
        secenekler: ["Sabit hızlı doğrusal hareket", "Düzenli aralıklarla tekrarlanan hareket", "Tek yönlü hızlanan hareket", "Hiç hareket etmeyen duran hâl"],
        dogru_index: 1
      }
    ]
  }
];
