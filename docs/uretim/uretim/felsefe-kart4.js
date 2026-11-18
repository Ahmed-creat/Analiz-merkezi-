#!/usr/bin/env node
/* ============================================================
   FELSEFE 10 — KART ÖNLERİ · 4. DEMET (16 kart)
   Kalıp denetiminden geçen ama emir kipiyle yazılmış kalan
   kart önleri soru biçimine çevrilir (arka yüzler aynı kalır).
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/felsefe-kart4.js
   ============================================================ */
"use strict";

const K = "fel_10_";
const onlar = (konu_id, liste) => ({ konu_id, onlar: liste });

module.exports = [
  onlar(K + "u02_k01", [
    { soru_id: K + "u02_k01_o02", on: "İmge kavramının tanımı nedir?" },
    { soru_id: K + "u02_k01_o03", on: "Felsefede kavram ne demektir?" },
    { soru_id: K + "u02_k01_o06", on: "Kavram ile kelime arasındaki ilişki nedir?" }
  ]),
  onlar(K + "u02_k02", [
    { soru_id: K + "u02_k02_o01", on: "Mantığın tanımı nedir?" },
    { soru_id: K + "u02_k02_o14", on: "Kısır döngü, alakasız sonuç, niteliksel adam karalama ve “sen de” safsatalarının tanımı nedir?" }
  ]),
  onlar(K + "u03_k01", [
    { soru_id: K + "u03_k01_o05", on: "Bir varlığın özü nasıl tanımlanır?" },
    { soru_id: K + "u03_k01_o07", on: "Madde kavramının tanımı nedir?" },
    { soru_id: K + "u03_k01_o12", on: "Ontoloji ile metafizik arasındaki ilişki nedir?" }
  ]),
  onlar(K + "u04_k01", [
    { soru_id: K + "u04_k01_o07", on: "Platon'un bilgi ile sanı arasındaki ayrımı ve bilgi tanımı nedir?" }
  ]),
  onlar(K + "u05_k01", [
    { soru_id: K + "u05_k01_o01", on: "Ahlak kavramının tanımı nedir?" }
  ]),
  onlar(K + "u06_k01", [
    { soru_id: K + "u06_k01_o09", on: "Estetik deneyim ile estetik haz arasındaki ilişki nedir?" },
    { soru_id: K + "u06_k01_o15", on: "Sanat kavramının temel tanımı nedir?" }
  ]),
  onlar(K + "u06_k02", [
    { soru_id: K + "u06_k02_o04", on: "Croce'nin güzellik tanımı nedir?" },
    { soru_id: K + "u06_k02_o14", on: "Güzellik ile hakikat arasındaki ilişkiye dair görüşler nedir?" }
  ]),
  onlar(K + "u07_k01", [
    { soru_id: K + "u07_k01_o09", on: "Hak, özgürlük, eşitlik ve adalet arasındaki ilişki nedir?" }
  ]),
  onlar(K + "u09_k01", [
    { soru_id: K + "u09_k01_o08", on: "Kuram, yasa ve hipotez arasındaki ilişki nedir?" }
  ])
];
