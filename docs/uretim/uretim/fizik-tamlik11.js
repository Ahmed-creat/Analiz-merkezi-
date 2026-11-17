#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — TAMAMLIK · 11. DEMET (u03_k07)
   Topraklamanın önemi havuzu.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/fizik-tamlik11.js
   ============================================================ */
"use strict";

const K = "fizik_10_";

module.exports = [
  {
    konu_id: K + "u03_k07",
    onlar: [
      { soru_id: K + "u03_k07_o02", on: "Topraklı sistemin can güvenliğine katkısı nedir?" },
      { soru_id: K + "u03_k07_o03", on: "Kaçak akımın tanımı nedir?" },
      { soru_id: K + "u03_k07_o05", on: "Topraklamanın işe yaradığı an nedir?" },
      { soru_id: K + "u03_k07_o06", on: "Gerilim ve vücut direncinden akım nasıl bulunur?" },
      { soru_id: K + "u03_k07_o07", on: "Sinir-kas sistemi üzerindeki akım etkisi nedir?" },
      { soru_id: K + "u03_k07_o08", on: "Toprak hattının kaçak anındaki işlevi nedir?" },
      { soru_id: K + "u03_k07_o09", on: "Islak ortamın tehlikeyi artırmasının nedeni nedir?" },
      { soru_id: K + "u03_k07_o04", on: "Kaçak anında gövdeye dokunan kişiyi bekleyen tehlike nedir?" },
      { soru_id: K + "u03_k07_o10", on: "Kaçak akımın toprağa akması ne demektir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u03_k07_o02",
        metin: "Bir iş yerinde makine gövdesinden kaçak akım oluştuğunda çalışanın çarpılmaması için topraklama hattı kurulmuştur. Topraklamanın temel amacı nedir?",
        secenekler: ["Devredeki akımı artırmak", "Enerji tasarrufu sağlamak", "Toprağın direncini ölçmek", "Kaçakta can ve mal güvenliğini korumak"],
        dogru_index: 3
      },
      {
        soru_id: K + "u03_k07_o03",
        secenekler: ["Akımın tamamen kesilmesi", "Akımın istenmeyen yola sapması", "Gerilimin ani düşmesi", "Toprak direncinin artması"],
        dogru_index: 1
      },
      {
        soru_id: K + "u03_k07_o07",
        metin: "Bir kişi yalnızca 30 mA'lik bir akımla bile kaslarını denetleyemez hâle gelebilir. Çok küçük akımların bile tehlikeli olmasının temel nedeni nedir?",
        secenekler: ["Vücudun gerilimi yükseltmesi", "İç direncin küçük olması ve sinir-kas etkisi", "Vücudun yalıtkan davranması", "Akımın sürekli yön değiştirmesi"],
        dogru_index: 1
      },
      {
        soru_id: K + "u03_k07_o09",
        secenekler: ["Şebeke gerilimi yükselir", "Islaklık vücut direncini düşürür", "Toprak direnci artar", "Kaçak akım azalır"],
        dogru_index: 1
      },
      {
        soru_id: K + "u03_k07_o10",
        secenekler: ["Gövdeden akım hiç geçmez", "Yalnız kıvılcım ve ışık oluşur", "Cihaz otomatik kapanır", "Akım kişi üzerinden toprağa akar"],
        dogru_index: 3
      }
    ]
  }
];
