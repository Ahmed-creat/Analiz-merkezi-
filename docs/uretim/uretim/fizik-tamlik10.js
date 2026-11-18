#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — TAMAMLIK · 10. DEMET (u03_k05, u03_k06)
   Üreteçlerin bağlanması ve elektrik güvenliği havuzları.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/fizik-tamlik10.js
   ============================================================ */
"use strict";

const K = "fizik_10_";

module.exports = [
  {
    konu_id: K + "u03_k05",
    onlar: [
      { soru_id: K + "u03_k05_o01", on: "Seri üreteçlerde gerilimlerin toplanması ne demektir?" },
      { soru_id: K + "u03_k05_o02", on: "Düz seri bağlamanın kutup kuralı nedir?" },
      { soru_id: K + "u03_k05_o03", on: "Özdeş üreteçlerin paralel bağlanmasının sağladığı avantaj nedir?" },
      { soru_id: K + "u03_k05_o04", on: "Paralel bağlı özdeş pillerde gerilimin değişmemesi ne demektir?" },
      { soru_id: K + "u03_k05_o06", on: "Düz seri bağlı üreteçlerin gerilim hesabı nedir?" },
      { soru_id: K + "u03_k05_o07", on: "Ters bağlı üreteçte toplam gerilim nedir?" },
      { soru_id: K + "u03_k05_o08", on: "İki özdeş pil seri bağlanınca gerilimin katlanması ne demektir?" },
      { soru_id: K + "u03_k05_o09", on: "Özdeş pillerin paralel bağlanmasında gerilim nedir?" },
      { soru_id: K + "u03_k05_o10", on: "Ters bağlı üretecin toplam gerilime etkisi nedir?" }
    ]
  },
  {
    konu_id: K + "u03_k06",
    onlar: [
      { soru_id: K + "u03_k06_o01", on: "Sigortanın görevi nedir?" },
      { soru_id: K + "u03_k06_o02", on: "Ev içi prizlerin bağlanma türü nedir?" },
      { soru_id: K + "u03_k06_o03", on: "Topraklı prizin sağladığı güvenlik nedir?" },
      { soru_id: K + "u03_k06_o04", on: "Cihazların etiket gerilimine uyulması ne demektir?" },
      { soru_id: K + "u03_k06_o05", on: "112'nin elektrik kazasındaki işlevi nedir?" },
      { soru_id: K + "u03_k06_o06", on: "Kurtarmada ilk kural nedir?" },
      { soru_id: K + "u03_k06_o07", on: "Yalıtkan malzeme kullanımının nedeni nedir?" },
      { soru_id: K + "u03_k06_o08", on: "Vücut direncinin azalmasının sonucu nedir?" },
      { soru_id: K + "u03_k06_o09", on: "Emniyet kapağının işlevi nedir?" },
      { soru_id: K + "u03_k06_o10", on: "Uyarı levhasının anlamı nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u03_k06_o03",
        metin: "Bir evde yalıtımı bozulan çamaşır makinesinin metal gövdesine dokunan kişi çarpılmamalıdır. Bunun için prizlerde bulunması gereken özellik nedir?"
      },
      {
        soru_id: K + "u03_k06_o07",
        secenekler: ["Metal çubukla kişiyi çekerek", "Yalıtkan malzemeyle temas kesilerek", "Islak bezle tutup çekerek", "Yardım gelmesi beklenerek"],
        dogru_index: 1
      },
      {
        soru_id: K + "u03_k06_o09",
        metin: "Küçük bir çocuk, prize takılı olmayan bir cihazın fişini çıkardıktan sonra prizdeki 2 deliğe tel sokmaya çalışıyor. Prizlere emniyet kapağı takılmasının amacı nedir?",
        secenekler: ["Prizdeki akımı artırmak", "Çocukların prize cisim sokmasını engellemek", "Prizdeki gerilimi düşürmek", "Prizdeki direnci azaltmak"],
        dogru_index: 1
      },
      {
        soru_id: K + "u03_k06_o10",
        metin: "Bir trafo binasının kapısına, üzerinde yıldırım simgesi olan sarı bir levha asılmış ve ziyaretçilerin girişi yasaklanmıştır. Elektrik uyarı levhalarının amacı nedir?"
      }
    ]
  }
];
