#!/usr/bin/env node
/* FİZİK 10 — tam kapsamlı denetimin bulduğu 6 hata
   (plan köprüsünün eşlemediği u01_k06/k07/k08 havuzları) */
"use strict";

module.exports = [
  {
    konu_id: "fizik_10_u01_k06",
    kartlar: [
      { soru_id: "fizik_10_u01_k06_o07",
        fc: ["Bir hareketlinin ivmesi hız-zaman ilişkisinden nasıl bulunur?", "Hız-zaman grafiğinin eğimi ivmeyi verir."] },
      { soru_id: "fizik_10_u01_k06_o10",
        fc: ["a-t grafiğindeki yatay doğru neyi gösterir?", "İvmenin zamanla değişmediğini, yani sabit ivmeyi."] }
    ]
  },
  {
    konu_id: "fizik_10_u01_k07",
    duzeltmeler: [
      { soru_id: "fizik_10_u01_k07_o02",
        fc: ["m/s² hangi büyüklüğün birimidir?", "İvmenin; yer çekimi ivmesi g ≈ 9,8 m/s²."] },
      { soru_id: "fizik_10_u01_k07_o03",
        fc: ["Cisimlerin yere düşmesine yol açan kuvvetin yönü nedir?", "Dünya’nın merkezine doğru."] },
      { soru_id: "fizik_10_u01_k07_o08",
        fc: ["Ağırlık ile net kuvvet arasındaki ilişki nedir?", "Hava direnci ihmal edilirse serbest düşen cisme etki eden net kuvvet cismin ağırlığıdır."] }
    ]
  },
  {
    konu_id: "fizik_10_u01_k08",
    duzeltmeler: [
      { soru_id: "fizik_10_u01_k08_o06",
        secenekler: ["20 m/s", "23 m/s", "46 m/s", "10 m/s"],
        dogru_index: 1 }
    ]
  }
];
