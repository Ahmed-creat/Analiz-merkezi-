#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — 3. TUR ONARIM 2 (havuz denetimi hataları)
   ------------------------------------------------------------
   · kart önü sorunun kopyası → kart kavramı ters yönden soruyor
     (tanım → ad, oran → sonuç, formül → örnek),
   · soru kökü 30 karakterden kısa → kökler bağlam eklenerek
     genişletildi,
   · "tabloda/grafikte/haritada diyor ama görsel yok" → veriler
     kökün içine yazıldı, görsel atfı kaldırıldı,
   · "seçenekler birbirinin aynısı" → normalizasyonda çakışan
     sayılar (%29 / %2,9 · [0,30] / (0,30)) gerçekten farklı
     değerlerle değiştirildi,
   · "Hiçbiri" çeldiricisi §7.4 gereği kaldırıldı.

   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/matematik-tur3-onar2.js
   ============================================================ */
"use strict";

module.exports = [
  {
    konu_id: "mat_10_u01_k01",
    duzeltmeler: [
      {
        soru_id: "mat_10_u01_k01_o06",
        metin: "Trigonometrik oranlara göre sin30° değeri kaçtır?",
        fc: ["30°’lik açının karşısındaki kenar ile hipotenüs arasındaki ilişki nedir?", "Karşı kenar hipotenüsün yarısıdır; bu yüzden sin30° = 1/2."]
      },
      {
        soru_id: "mat_10_u01_k01_o10",
        secenekler: ["%17", "%58", "%14,6", "%29"],
        dogru_index: 3
      }
    ]
  },
  {
    konu_id: "mat_10_u01_k02",
    duzeltmeler: [
      {
        soru_id: "mat_10_u01_k02_o01",
        metin: "Bir üçgende kenarortay kavramı nasıl tanımlanır?",
        fc: ["Köşeyi karşı kenarın orta noktasına birleştiren doğru parçasına ne ad verilir?", "Kenarortay."]
      },
      {
        soru_id: "mat_10_u01_k02_o02",
        fc: ["Üçgenin kenarortayları hangi noktada kesişir?", "Ağırlık merkezinde (G) kesişir."]
      },
      {
        soru_id: "mat_10_u01_k02_o04",
        fc: ["Kenarortayın köşeye yakın parçası tüm kenarortayın kaçta kaçıdır?", "2/3’ü; kenara yakın parça 1/3’tür."]
      },
      {
        soru_id: "mat_10_u01_k02_o10",
        fc: ["Dış açıortay teoremi neyi söyler?", "Dış açıortay, karşı kenarın uzantısını komşu kenarlarla orantılı böler."]
      }
    ]
  },
  {
    konu_id: "mat_10_u01_k03",
    kartlar: [
      { soru_id: "mat_10_u01_k03_o05",
        fc: ["Benzerlik oranının karesi hangi oranı verir?", "Alanlar oranını verir; k = 2/3 ise alanlar oranı 4/9’dur."] },
      { soru_id: "mat_10_u01_k03_o08",
        fc: ["Benzer şekillerde alan oranı, kenar oranının kaçıncı kuvvetidir?", "İkinci kuvvetidir; kenarlar 3 katına çıkarsa alan 9 katına çıkar."] }
    ]
  },
  {
    konu_id: "mat_10_u02_k01",
    duzeltmeler: [
      {
        soru_id: "mat_10_u02_k01_o02",
        fc: ["Kontenjans (iki yönlü sıklık) tablosu neyin dağılımını gösterir?", "İki kategorik değişkenin birlikte gözlenme sıklıklarını."]
      },
      {
        soru_id: "mat_10_u02_k01_o03",
        metin: "İki yönlü sıklık tablosunda satır yüzdesi nasıl hesaplanır?"
      },
      {
        soru_id: "mat_10_u02_k01_o07",
        metin: "200 kişilik bir grupta 80 kişi futbol, 50 kişi tenis izlemeyi seçmiştir. Bu iki grup arasındaki fark kaç kişidir?",
        fc: ["İki grubun kişi sayısı farkı nasıl bulunur?", "Büyük sayıdan küçüğü çıkarılır: 80 − 50 = 30."]
      },
      {
        soru_id: "mat_10_u02_k01_o10",
        metin: "İki yönlü sıklık tablosunda tüm satır yüzdeleri her sütunda birbirine benziyorsa hangi sonuca varılır?",
        fc: ["Satır yüzdelerinin sütunlar arasında benzer olması neyi gösterir?", "İki kategorik değişken arasında belirgin bir ilişki olmadığını."]
      }
    ]
  },
  {
    konu_id: "mat_10_u02_k02",
    duzeltmeler: [
      {
        soru_id: "mat_10_u02_k02_o04",
        metin: "Dikey eksenin sıfırdan başlatılmaması, sütunların gösterdiği farkları nasıl etkiler?",
        fc: ["Eksenin kırpılması (sıfırdan başlamaması) hangi yanılgıya yol açar?", "Küçük farkların abartılı biçimde büyük görünmesine."]
      }
    ]
  },
  {
    konu_id: "mat_10_u03_k01",
    duzeltmeler: [
      {
        soru_id: "mat_10_u03_k01_o02",
        fc: ["Bir sayının pozitif bölen sayısı asal çarpanlarından nasıl bulunur?", "Asal çarpanların üsleri birer artırılıp çarpılır: 18 = 2·3² için (1+1)(2+1) = 6."]
      },
      {
        soru_id: "mat_10_u03_k01_o03",
        fc: ["Asal çarpanları 2²·3² olan sayının pozitif bölen sayısı kaçtır?", "3 · 3 = 9."]
      },
      {
        soru_id: "mat_10_u03_k01_o05",
        metin: "Matematikte asal sayı kavramı nasıl tanımlanır?",
        fc: ["Asal sayının kaç tane pozitif böleni vardır?", "İki tane: 1 ve kendisi."]
      }
    ]
  },
  {
    konu_id: "mat_10_u03_k03",
    kartlar: [
      { soru_id: "mat_10_u03_k03_o09",
        fc: ["175 = 12·14 + 7 yazımından 4’e bölüm kalanı nasıl çıkarılır?", "175 = 12k + 7 = 4(3k + 1) + 3 olduğundan kalan 3’tür."] }
    ]
  },
  {
    konu_id: "mat_10_u04_k01",
    duzeltmeler: [
      {
        soru_id: "mat_10_u04_k01_o05",
        secenekler: ["[0, 30]", "[0, 600]", "[0, 20]", "(0, 60)"],
        dogru_index: 0
      },
      {
        soru_id: "mat_10_u04_k01_o07",
        fc: ["Doğrusal fonksiyonların bire bir olmasının nedeni nedir?", "Her x için farklı bir y üretmeleri; grafikleri her yatay doğruyu tek noktada keser."]
      }
    ]
  },
  {
    konu_id: "mat_10_u04_k05",
    duzeltmeler: [
      {
        soru_id: "mat_10_u04_k05_o03",
        fc: ["Ters fonksiyonda tanım ve görüntü kümeleri nasıl yer değiştirir?", "f: tanım → görüntü ise f⁻¹: görüntü → tanım olur."]
      },
      {
        soru_id: "mat_10_u04_k05_o08",
        metin: "f(2) = 7 ise f⁻¹(7) değeri kaçtır?",
        fc: ["Ters fonksiyonun değeri nasıl hesaplanır?", "f(a) = b ise f⁻¹(b) = a olur; girdi ile çıktı yer değiştirir."]
      }
    ]
  },
  {
    konu_id: "mat_10_u05_k02",
    duzeltmeler: [
      {
        soru_id: "mat_10_u05_k02_o07",
        secenekler: ["Bazı (en az bir)", "Her", "Bütün", "Yalnızca bir"],
        dogru_index: 0
      }
    ]
  },
  {
    konu_id: "mat_10_u06_k01",
    duzeltmeler: [
      {
        soru_id: "mat_10_u06_k01_o04",
        metin: "Ölçekli bir krokide A ile B arası 10 birim, B ile C arası 13 birim gelmektedir. A ile B arası gerçekte 40 km ise B ile C arası kaç kilometredir?",
        fc: ["Ölçekli gösterimde gerçek uzunluk nasıl bulunur?", "Ölçülen uzunluk ölçek katsayısıyla çarpılır: 10 birim = 40 km ise k = 4."]
      }
    ]
  },
  {
    konu_id: "mat_10_u07_k01",
    duzeltmeler: [
      {
        soru_id: "mat_10_u07_k01_o06",
        fc: ["Koşullu olasılıkta örnek uzay nasıl değişir?", "Verilen koşula uyan durumlarla sınırlanır; tek sayılar {1, 3, 5} olur."]
      },
      {
        soru_id: "mat_10_u07_k01_o10",
        cozum: "Bağımsız olaylarda kesişimin olasılığı, olasılıkların çarpımına eşittir: P(A ∩ B) = 0,5 · 0,4 = 0,2."
      }
    ]
  },
  {
    konu_id: "mat_10_u07_k02",
    kartlar: [
      { soru_id: "mat_10_u07_k02_o09",
        fc: ["Koşullu olasılıkta paydaya hangi toplam yazılır?", "Koşulun gerçekleştiği grubun toplamı: hatalılar içinde mavi oranı 26/75."] },
      { soru_id: "mat_10_u07_k02_o10",
        fc: ["İki yönlü sıklık çizelgesinde satır toplamları neyi verir?", "Her kategorinin toplam sıklığını; hatalı ambalajların toplamı 75’tir."] }
    ]
  }
];
