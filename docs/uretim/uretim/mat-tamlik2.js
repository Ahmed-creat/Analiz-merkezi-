#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — TAMAMLIK · 2. DEMET (u05_k02, u01_k02)
   Algoritmik yapı ve üçgende yardımcı elemanlar.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/mat-tamlik2.js
   ============================================================ */
"use strict";

const K = "mat_10_";

module.exports = [
  {
    konu_id: K + "u05_k02",
    onlar: [
      { soru_id: K + "u05_k02_o01", on: "Algoritmanın adım sırasına katkısı nedir?" },
      { soru_id: K + "u05_k02_o02", on: "Algoritmanın gösterim araçları nedir?" },
      { soru_id: K + "u05_k02_o03", on: "Ve bağlacının koşul anlamı nedir?" },
      { soru_id: K + "u05_k02_o04", on: "Veya bağlacının koşul anlamı nedir?" },
      { soru_id: K + "u05_k02_o06", on: "Koşullu adımın tetiklenmesi ne demektir?" },
      { soru_id: K + "u05_k02_o07", on: "Bazı niceleyicisinin anlamı nedir?" },
      { soru_id: K + "u05_k02_o08", on: "Döngüyle toplam hesabının sonucu nedir?" },
      { soru_id: K + "u05_k02_o09", on: "Babil metodunda ilk adımın modeli nedir?" },
      { soru_id: K + "u05_k02_o10", on: "Tekrarlı yaklaşımın amacı nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u05_k02_o01",
        metin: "Şekildeki akış şemasında 5 adımlık bir çözüm yolu gösterilmiştir. Kitaba göre algoritmik yapının problem çözmedeki temel işlevi nedir?",
        secenekler: ["Sonucu önceden tahmin etmesi", "Adımları sıraya koyup süreci hızlandırması", "Yalnızca sayıları sıralaması", "Problemi ortadan kaldırması"],
        dogru_index: 1
      },
      {
        soru_id: K + "u05_k02_o02",
        secenekler: ["Yalnızca matematiksel denklem", "Doğal dil, sözde kod ve akış şeması", "Yalnızca sayı tablosu", "Yalnızca çizgi grafiği"],
        dogru_index: 1
      },
      {
        soru_id: K + "u05_k02_o05",
        metin: "Tabloda görüldüğü üzere teşekkür belgesi alabilmek için dönem sonu ağırlıklı not ortalaması hangi aralıkta olmalıdır?"
      },
      {
        soru_id: K + "u05_k02_o07",
        secenekler: ["Bazı (en az bir)", "Her biri (tümü)", "Bütün elemanlar", "Yalnızca bir tanesi"],
        dogru_index: 0
      },
      {
        soru_id: K + "u05_k02_o06",
        metin: "Bir algoritmada 'not 50'den büyükse geçti yaz' satırı bulunmaktadır. Algoritmada 'ise' bağlacının işlevi nedir?",
        secenekler: ["İki koşulu tek satırda birleştirir", "Koşul sağlanınca işlemi yaptırır", "Döngüyü baştan başlatır", "Sonucu ekrana yazdırır"],
        dogru_index: 1
      }
    ]
  },
  {
    konu_id: K + "u01_k02",
    onlar: [
      { soru_id: K + "u01_k02_o01", on: "Kenarortayın tanımı nedir?" },
      { soru_id: K + "u01_k02_o02", on: "Bir üçgendeki kenarortay sayısı nedir?" },
      { soru_id: K + "u01_k02_o03", on: "Kenarortayların kesişim noktasının adı nedir?" },
      { soru_id: K + "u01_k02_o04", on: "Ağırlık merkezinin kenarortayı bölme oranı nedir?" },
      { soru_id: K + "u01_k02_o05", on: "Yüksekliğin tanımı nedir?" },
      { soru_id: K + "u01_k02_o06", on: "Yüksekliklerin kesişim noktasının adı nedir?" },
      { soru_id: K + "u01_k02_o07", on: "İç açıortay teoreminin oranı nedir?" },
      { soru_id: K + "u01_k02_o08", on: "Açıortay üzerindeki noktanın kollara uzaklığı nedir?" },
      { soru_id: K + "u01_k02_o09", on: "Ağırlık merkezinin kenara uzaklık oranı nedir?" },
      { soru_id: K + "u01_k02_o10", on: "Dış açıortay teoreminin söylediği nedir?" }
    ],
    duzeltmeler: [
      { soru_id: K + "u01_k02_o01", metin: "Şekildeki üçgende kenarortay kavramı nasıl tanımlanır?" },
      { soru_id: K + "u01_k02_o02", metin: "Şekildeki üçgende kaç tane kenarortay vardır?" },
      { soru_id: K + "u01_k02_o03", metin: "Şekildeki üçgende kenarortaylar hangi noktada kesişir?" },
      { soru_id: K + "u01_k02_o04", metin: "Şekildeki üçgende ağırlık merkezi, bir kenarortayı köşeden ve kenardan itibaren hangi oranda böler?" },
      { soru_id: K + "u01_k02_o05", metin: "Şekildeki üçgende yükseklik nasıl tanımlanır?" },
      { soru_id: K + "u01_k02_o06", metin: "Şekildeki üçgende yüksekliklerin kesiştiği noktaya ne denir?" },
      { soru_id: K + "u01_k02_o07", metin: "Şekildeki ABC üçgeninde [AD] iç açıortaydır. |AB| = 6 cm, |AC| = 9 cm ve |BD| = 4 cm ise |DC| kaç cm'dir?" },
      { soru_id: K + "u01_k02_o08", metin: "Şekildeki açıda açıortay üzerinde alınan herhangi bir noktanın açının kollarına olan uzaklıkları için hangisi doğrudur?" },
      { soru_id: K + "u01_k02_o09", metin: "Şekildeki üçgende ağırlık merkezinin bir köşeye uzaklığı 8 cm ise aynı kenarortay üzerinde kenara olan uzaklığı kaç cm'dir?" },
      { soru_id: K + "u01_k02_o10", metin: "Şekildeki üçgende bir dış açıya ait açıortay, karşı kenarın uzantısını nasıl böler?" }
    ]
  }
];
