#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — TAMAMLIK · 3. DEMET (u06_k01, u04_k06)
   Koordinat geometrisi ve fonksiyonlarla problem çözümü.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/mat-tamlik3.js
   ============================================================ */
"use strict";

const K = "mat_10_";

module.exports = [
  {
    konu_id: K + "u06_k01",
    onlar: [
      { soru_id: K + "u06_k01_o02", on: "Uzaklık bağıntısıyla iki nokta arası nasıl hesaplanır?" },
      { soru_id: K + "u06_k01_o03", on: "Farklı bölgedeki iki noktanın uzaklık hesabı nasıl bulunur?" },
      { soru_id: K + "u06_k01_o06", on: "Orta nokta bağıntısının uygulanışı nedir?" },
      { soru_id: K + "u06_k01_o07", on: "İçten bölme oranının anlamı nedir?" },
      { soru_id: K + "u06_k01_o09", on: "Eşit uzaklık koşulundan x nasıl bulunur?" },
      { soru_id: K + "u06_k01_o10", on: "Ölçekli haritada gerçek uzunluk nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u06_k01_o07",
        metin: "Şekilde koordinat düzleminde A(−3, 6) noktasından sabit hızla 3 saatte B(7, −4) noktasına giden araç ile B'den A'ya 2 saatte giden araç aynı anda yola çıkıp C noktasında karşılaşıyor. C noktasının koordinatları hangisidir?"
      }
    ]
  },
  {
    konu_id: K + "u04_k06",
    onlar: [
      { soru_id: K + "u04_k06_o01", on: "En az ifadesinin gerektirdiği yapı nedir?" },
      { soru_id: K + "u04_k06_o02", on: "Karesel fonksiyonun köklerini veren çarpanlar nedir?" },
      { soru_id: K + "u04_k06_o03", on: "Pozitif olduğu aralığın bulunuşu nedir?" },
      { soru_id: K + "u04_k06_o04", on: "Sıfırdan küçük eşit olduğu küme nedir?" },
      { soru_id: K + "u04_k06_o05", on: "Kalan yakıt denkleminin modeli nedir?" },
      { soru_id: K + "u04_k06_o06", on: "Kalan yakıt eşitsizliğinin çözüm kuralı nedir?" },
      { soru_id: K + "u04_k06_o07", on: "√x = 6 tipi denklemin modeli nedir?" },
      { soru_id: K + "u04_k06_o08", on: "Rasyonel denklemin çözüm yolu nedir?" },
      { soru_id: K + "u04_k06_o09", on: "Tepe noktasının verdiği en büyük değer nedir?" },
      { soru_id: K + "u04_k06_o10", on: "İki kök arasındaki işaret kuralı nedir?" },
      { soru_id: K + "u04_k06_o12", on: "Yüzde indirimde fiyat çarpanı nedir?" },
      { soru_id: K + "u04_k06_o15", on: "x²=16 denkleminin çözüm kümesi nedir?" },
      { soru_id: K + "u04_k06_o17", on: "Karesel maliyetin en düşük olduğu nokta nedir?" },
      { soru_id: K + "u04_k06_o18", on: "Karekök alarak çözmenin kuralı nedir?" },
      { soru_id: K + "u04_k06_o19", on: "Rasyonel denklemde paydanın ters çevrilmesi nedir?" },
      { soru_id: K + "u04_k06_o20", on: "Dış aralıkta işaretin pozitif olması ne demektir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u04_k06_o04",
        secenekler: ["(−∞, 8] ∪ [12, ∞)", "(8, 12) aralığı", "[12, ∞) yarı açık aralığı", "Boş küme (çözüm yok)"],
        dogru_index: 0
      }
    ]
  }
];
