#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — 3. TUR ONARIM
   ------------------------------------------------------------
   Denetimin bildirdiği kusurlar:
     · aralık gösteriminde köşeli/yuvarlak parantez farkı
       "seçenekler birbirinin aynısı" sayılıyor → çeldiriciler
       gerçekten farklı aralıklarla değiştirildi,
     · 30 karakterden kısa soru kökleri ve 25 karakterden kısa
       çözümler genişletildi,
     · üç soruda kart önü sorunun kopyasıydı → kavram sorusuna çevrildi.

   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/matematik-tur3-onar.js
   ============================================================ */
"use strict";

module.exports = [
  {
    konu_id: "mat_10_u04_k02",
    duzeltmeler: [{
      soru_id: "mat_10_u04_k02_o15",
      secenekler: ["[1, ∞)", "[3, ∞)", "[5, ∞)", "[−4, ∞)"],
      dogru_index: 0
    }],
    kartlar: [{
      soru_id: "mat_10_u04_k02_o24",
      fc: ["a(x − r)² + k ifadesindeki r ve k neyi gösterir?", "Tepe noktasının koordinatlarını: tepe noktası (r, k)."]
    }]
  },
  {
    konu_id: "mat_10_u04_k04",
    duzeltmeler: [
      {
        soru_id: "mat_10_u04_k04_o05",
        metin: "f(x) = 1 / x fonksiyonunun x = 4 için değeri kaçtır?",
        cozum: "x yerine 4 yazılır: f(4) = 1/4 = 0,25 bulunur; payda sıfırdan farklı olduğu için değer tanımlıdır (s.245).",
        fc: ["Rasyonel fonksiyonda tanım kümesindeki bir noktanın değeri nasıl bulunur?", "x yerine o değer yazılır; örneğin f(4) = 1/4 = 0,25."]
      },
      {
        soru_id: "mat_10_u04_k04_o09",
        metin: "f(x) = 1 / x fonksiyonunun x = −4 için değeri kaçtır?",
        cozum: "x yerine −4 yazılır: f(−4) = 1/(−4) = −1/4; payda sıfırdan farklı olduğu için değer tanımlıdır (s.245).",
        fc: ["Rasyonel fonksiyonda negatif bir girdi nasıl sonuç verir?", "Bölümün işareti girdinin işaretine göre belirlenir: f(−4) = 1/(−4) = −1/4."]
      },
      {
        soru_id: "mat_10_u04_k04_o13",
        secenekler: [
          "İşareti x’in işaretiyle aynıdır.",
          "Her x için pozitiftir.",
          "Her x için negatiftir.",
          "İşareti x’in işaretiyle terstir."
        ],
        dogru_index: 3
      },
      {
        soru_id: "mat_10_u04_k04_o16",
        secenekler: ["[0, ∞)", "ℝ − {0}", "ℝ", "ℝ − {2}"],
        dogru_index: 1
      }
    ]
  },
  {
    konu_id: "mat_10_u04_k06",
    duzeltmeler: [
      {
        soru_id: "mat_10_u04_k06_o03",
        secenekler: ["(8, 12)", "(−∞, 8) ∪ (12, ∞)", "[8, 14]", "ℝ"],
        dogru_index: 0
      },
      {
        soru_id: "mat_10_u04_k06_o04",
        secenekler: ["(−∞, 8] ∪ [12, ∞)", "(8, 12)", "[12, ∞)", "Boş küme"],
        dogru_index: 0
      },
      {
        soru_id: "mat_10_u04_k06_o10",
        secenekler: ["(−∞, −2) ∪ (2, ∞)", "[−4, 4]", "(0, 4)", "(−2, 2)"],
        dogru_index: 3
      }
    ]
  },
  {
    konu_id: "mat_10_u05_k01",
    duzeltmeler: [{
      soru_id: "mat_10_u05_k01_o05",
      cozum: "Her tişört 4 farklı pantolonla eşleştiği için çarpma yoluyla sayma kullanılır: 3 · 4 = 12 (s.319-322)."
    }],
    kartlar: [{
      soru_id: "mat_10_u05_k01_o09",
      fc: ["n bit ile kaç farklı durum gösterilebilir?", "2ⁿ farklı durum; örneğin 8 bit ile 2⁸ = 256."]
    }]
  }
];
