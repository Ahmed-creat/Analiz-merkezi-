#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — TAMAMLIK · 9. DEMET (u03_k04)
   Dirençlerin bağlanması havuzu.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/fizik-tamlik9.js
   ============================================================ */
"use strict";

const K = "fizik_10_";

module.exports = [
  {
    konu_id: K + "u03_k04",
    onlar: [
      { soru_id: K + "u03_k04_o02", on: "Paralel kollarda gerilimin eşit olması ne demektir?" },
      { soru_id: K + "u03_k04_o03", on: "Seri devrede akımın her dirençte aynı olması ne demektir?" },
      { soru_id: K + "u03_k04_o04", on: "Ana kol akımı ile kol akımları arasındaki ilişki nedir?" },
      { soru_id: K + "u03_k04_o05", on: "Seri eşdeğer direncin her dirençten büyük olması ne demektir?" },
      { soru_id: K + "u03_k04_o06", on: "Seri bağlamada eşdeğer direnç nasıl hesaplanır?" },
      { soru_id: K + "u03_k04_o07", on: "Birden çok kolun tek dirence indirgenmesi nedir?" },
      { soru_id: K + "u03_k04_o08", on: "Seri devrede akımın bulunması için kullanılan oran nedir?" },
      { soru_id: K + "u03_k04_o09", on: "Kaynak gerilimi ile direnç gerilimlerinin ilişkisi nedir?" },
      { soru_id: K + "u03_k04_o10", on: "Paralel kolların akım paylaşımı nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u03_k04_o02",
        secenekler: ["Akım şiddeti", "Direnç değeri", "Harcanan güç", "Gerilim"],
        dogru_index: 3
      }
    ]
  }
];
