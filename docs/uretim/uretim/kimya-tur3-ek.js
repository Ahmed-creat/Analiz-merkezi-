#!/usr/bin/env node
/* ============================================================
   KİMYA 10 — 3. TUR EK SORULAR (hedef tamamlama)
   ------------------------------------------------------------
   Kaynak: Kimya 10 ders kitabı, 1. Tema "Etkileşim"
     s.87-88  gazların birimleri, kinetik moleküler teori
     s.89-91  Boyle, Charles, Gay Lussac yasaları

   Hedef: KİM.10.1.9 (Gazların özellikleri arasındaki ilişkileri
   bilimsel sorgulayabilme) plan hedefi 14 soru → havuzda 10 vardı.

   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/kimya-tur3-ek.js
   ============================================================ */
"use strict";

module.exports = [
  {
    konu_id: "kimya_10_u01_k06",
    kaynak: "Kimya 10 ders kitabı, s.77-93",
    items: [
      {
        bi: 1,
        metin: "Sabit sıcaklıkta 3 atm basınçta 5 L hacim kaplayan bir gazın basıncı 5 atm’ye çıkarılırsa hacmi kaç litre olur?",
        secenekler: ["3 L", "5 L", "2 L", "8 L"],
        cozum: "Boyle Yasası’na göre sabit sıcaklıkta P₁V₁ = P₂V₂ olur. 3 · 5 = 5 · V₂ eşitliğinden V₂ = 3 L bulunur (s.89).",
        fc: ["Sabit sıcaklıkta basınç 3 atm’den 5 atm’ye çıkarken 5 L hacimli gazın hacmi kaç litre olur?", "3 L (Boyle Yasası: P₁V₁ = P₂V₂)."]
      },
      {
        bi: 1,
        metin: "Sabit basınç altında 300 K sıcaklıkta 2 L hacim kaplayan bir gazın sıcaklığı 600 K’a çıkarılırsa hacmi kaç litre olur?",
        secenekler: ["4 L", "1 L", "2 L", "6 L"],
        cozum: "Charles Yasası’na göre sabit basınçta V₁ / T₁ = V₂ / T₂ olur. 2 / 300 = V₂ / 600 eşitliğinden V₂ = 4 L bulunur (s.90).",
        fc: ["Sabit basınçta 300 K’ta 2 L hacim kaplayan gaz 600 K’a ısıtılırsa hacmi kaç litre olur?", "4 L (Charles Yasası: hacim mutlak sıcaklıkla doğru orantılı)."]
      },
      {
        bi: 1,
        metin: "Sabit hacimli bir kapta 273 K sıcaklıkta 2 atm basınç yapan bir gazın sıcaklığı 546 K’a çıkarılırsa basıncı kaç atmosfer olur?",
        secenekler: ["4 atm", "1 atm", "2 atm", "6 atm"],
        cozum: "Gay Lussac Yasası’na göre sabit hacimde P₁ / T₁ = P₂ / T₂ olur. 2 / 273 = P₂ / 546 eşitliğinden P₂ = 4 atm bulunur (s.91).",
        fc: ["Sabit hacimli kapta 273 K’ta 2 atm basınç yapan gaz 546 K’a ısıtılırsa basıncı kaç atm olur?", "4 atm (Gay Lussac Yasası: basınç mutlak sıcaklıkla doğru orantılı)."]
      },
      {
        bi: 0,
        metin: "Gaz taneciklerinin kap çeperlerine çarpması sonucu oluşan nicelik aşağıdakilerden hangisidir?",
        secenekler: ["Basınç", "Hacim", "Mol sayısı", "Yoğunluk"],
        cozum: "Kinetik moleküler teoriye göre gaz tanecikleri her yöne hareket ederken kap çeperlerine çarpar; bu çarpma etkisi basınç olarak ölçülür (s.87).",
        fc: ["Gaz taneciklerinin kap çeperlerine çarpması hangi niceliği oluşturur?", "Basınç."]
      }
    ]
  }
];
