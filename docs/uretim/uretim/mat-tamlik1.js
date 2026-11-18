#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — TAMAMLIK · 1. DEMET (u01_k04, u05_k01)
   Sinüs-kosinüs teoremleri ve sayma stratejileri.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/mat-tamlik1.js
   ============================================================ */
"use strict";

const K = "mat_10_";

module.exports = [
  {
    konu_id: K + "u01_k04",
    onlar: [
      { soru_id: K + "u01_k04_o02", on: "a² = b² + c² − 2bc·cosA bağıntısının adı nedir?" },
      { soru_id: K + "u01_k04_o03", on: "Dik açıda kosinüs teoreminin aldığı biçim nedir?" },
      { soru_id: K + "u01_k04_o04", on: "Sinüs teoreminde kenar nasıl hesaplanır?" },
      { soru_id: K + "u01_k04_o05", on: "Kosinüs teoremiyle üçüncü kenar nasıl hesaplanır?" },
      { soru_id: K + "u01_k04_o06", on: "İki açı ve bir kenardan diğer kenar nasıl bulunur?" },
      { soru_id: K + "u01_k04_o07", on: "Aradaki açıyla uzunluk hesabının modeli nedir?" },
      { soru_id: K + "u01_k04_o08", on: "Üç kenarı verilen üçgende açının kosinüsü nasıl bulunur?" },
      { soru_id: K + "u01_k04_o09", on: "Sinüs teoreminin kullanım koşulu nedir?" },
      { soru_id: K + "u01_k04_o10", on: "İki kenar ve aradaki açıyla üçüncü kenarın teoremi nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u01_k04_o01",
        metin: "Şekildeki ABC üçgeninde sinüs teoremi hangi eşitlikle ifade edilir?"
      },
      {
        soru_id: K + "u01_k04_o02",
        metin: "Şekildeki ABC üçgeninde kosinüs teoremi hangi eşitlikle ifade edilir?"
      },
      {
        soru_id: K + "u01_k04_o03",
        metin: "Şekildeki ABC dik üçgeninde A açısı 90° ise kosinüs teoremi hangi bağıntıya dönüşür?",
        secenekler: ["a² = b² + c²", "a² = b² − c²", "a = b + c", "a² = 2bc"],
        dogru_index: 0
      },
      {
        soru_id: K + "u01_k04_o04",
        metin: "Şekildeki ABC üçgeninde A açısı 30°, B açısı 60° ve a = 6 cm ise b kenarı kaç cm'dir?",
        secenekler: ["4 cm", "6 cm", "6√3 cm", "12 cm"],
        dogru_index: 2
      },
      {
        soru_id: K + "u01_k04_o05",
        metin: "Şekildeki üçgende iki kenar 5 cm ve 7 cm, aralarındaki açı 60° ise üçüncü kenarın karesi kaçtır?"
      },
      {
        soru_id: K + "u01_k04_o06",
        metin: "Şekildeki ABC üçgeninde BC = 48 birim, açılar B = 58°, C = 74°'dir. AB kenarı yaklaşık kaç birimdir? (sin58° ≈ 0,84, sin74° ≈ 0,96)"
      },
      {
        soru_id: K + "u01_k04_o07",
        metin: "Şekildeki KAB üçgeninde KA = 60 mil, KB = 50√3 mil ve aralarındaki açı 30° ise AB uzunluğu kaç mildir?"
      },
      {
        soru_id: K + "u01_k04_o08",
        metin: "Kenar uzunlukları şekilde verilen üçgende 7 birimlik kenarın karşısındaki açının kosinüsü kaçtır?"
      },
      {
        soru_id: K + "u01_k04_o09",
        metin: "Şekildeki ABC üçgeninde sinüs teoremi hangi durumda doğrudan kullanılır?"
      },
      {
        soru_id: K + "u01_k04_o10",
        metin: "Şekildeki üçgende iki kenar ve aralarındaki açı verilmiştir. Üçüncü kenarı bulmak için hangi teorem kullanılır?"
      }
    ]
  },
  {
    konu_id: K + "u05_k01",
    onlar: [
      { soru_id: K + "u05_k01_o01", on: "Toplama kuralını gerektiren bağlaç nedir?" },
      { soru_id: K + "u05_k01_o02", on: "Çarpma yoluyla saymanın temel kuralı nedir?" },
      { soru_id: K + "u05_k01_o03", on: "Toplama yoluyla saymanın işleyişi nedir?" },
      { soru_id: K + "u05_k01_o04", on: "Birbirini dışlayan gruplarda seçim sayısı nedir?" },
      { soru_id: K + "u05_k01_o05", on: "Birlikte yapılan iki seçimde durum sayısı nedir?" },
      { soru_id: K + "u05_k01_o06", on: "Rakamları farklı sayı yazımında durum sayısı nedir?" },
      { soru_id: K + "u05_k01_o07", on: "Tekrarsız dizilim sayısının modeli nedir?" },
      { soru_id: K + "u05_k01_o08", on: "Ayrık gruplardan tek seçim kuralı nedir?" },
      { soru_id: K + "u05_k01_o09", on: "Bit sayısı ile karakter sayısı arasındaki ilişki nedir?" },
      { soru_id: K + "u05_k01_o10", on: "Karakter sayısının 2ⁿ ile bulunması ne demektir?" },
      { soru_id: K + "u05_k01_o11", on: "Birbirini dışlayan seçimlerde sayma yolu nedir?" },
      { soru_id: K + "u05_k01_o12", on: "Menü oluştururken durum sayısı nasıl bulunur?" },
      { soru_id: K + "u05_k01_o13", on: "Toplama kuralının uygulama koşulu nedir?" },
      { soru_id: K + "u05_k01_o14", on: "İki gruptan birer eleman seçiminin modeli nedir?" },
      { soru_id: K + "u05_k01_o16", on: "Yalnızca bir eleman seçiminde toplam nedir?" },
      { soru_id: K + "u05_k01_o17", on: "Giriş-çıkış eşleşmelerinin sayısı nedir?" },
      { soru_id: K + "u05_k01_o18", on: "Tekrarlı şifrelerde durum sayısının modeli nedir?" },
      { soru_id: K + "u05_k01_o19", on: "Bir kalem veya bir defter seçiminde uygulanan işlem nedir?" },
      { soru_id: K + "u05_k01_o20", on: "Doğru-yanlış anahtar sayısının modeli nedir?" }
    ]
  }
];
