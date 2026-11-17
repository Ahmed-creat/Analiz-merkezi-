#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — 3. TUR EK SORULAR · 2. DEMET
   ------------------------------------------------------------
   Plan hedefi ile havuz sayısı arasındaki farkı kapatır.
   Kaynak: Matematik 10 ders kitabı (MEB, 2025)

     mat_10_u04_k02  4.2 karesel fonksiyonlar        s.197-223  10 → 24
     mat_10_u04_k04  4.4 rasyonel fonksiyonlar       s.243-263  10 → 24
     mat_10_u04_k06  4.6 denklem/eşitsizlik prob.    s.284-305  10 → 20
     mat_10_u05_k01  5.1 sayma stratejileri          s.313-338  10 → 20

   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/matematik-tur3-ek2.js
   ============================================================ */
"use strict";

module.exports = [
  {
    /* ---------- 4.2 KARESEL FONKSİYONLAR ---------- */
    konu_id: "mat_10_u04_k02",
    kaynak: "Matematik 10 ders kitabı, s.197-223",
    items: [
      {
        bi: 0,
        metin: "f(x) = x² + 8x + 7 fonksiyonunun simetri ekseni aşağıdakilerden hangisidir?",
        secenekler: ["x = −4", "x = 4", "x = −8", "x = 8"],
        cozum: "Simetri ekseni tepe noktasının apsisidir: x = −b / 2a = −8 / 2 = −4 (s.199-204).",
        fc: ["Karesel fonksiyonun simetri ekseni hangi bağıntıyla bulunur?", "x = −b / 2a; bu değer tepe noktasının apsisidir."]
      },
      {
        bi: 0,
        metin: "f(x) = 2x² − 12x + 5 fonksiyonunun tepe noktasının apsisi kaçtır?",
        secenekler: ["3", "−3", "6", "12"],
        cozum: "Tepe noktasının apsisi x = −b / 2a = 12 / 4 = 3 bulunur (s.199-204).",
        fc: ["f(x) = ax² + bx + c fonksiyonunda tepe noktasının apsis formülü nedir?", "x = −b / 2a."]
      },
      {
        bi: 0,
        metin: "f(x) = −x² + 6x − 5 fonksiyonunun tepe noktası aşağıdakilerden hangisidir?",
        secenekler: ["(3, 4)", "(3, −4)", "(−3, 4)", "(6, 4)"],
        cozum: "Apsis x = −6 / (2·(−1)) = 3; f(3) = −9 + 18 − 5 = 4 olduğundan tepe noktası (3, 4) olur (s.199-206).",
        fc: ["Tepe noktasının ordinatı nasıl hesaplanır?", "Bulunan apsis değeri fonksiyonda yerine yazılır: ordinat = f(−b/2a)."]
      },
      {
        bi: 0,
        metin: "f(x) = x² − 2x + m fonksiyonunun tepe noktası y = 3 doğrusu üzerinde ise m kaçtır?",
        secenekler: ["4", "2", "3", "5"],
        cozum: "Apsis x = 1, f(1) = 1 − 2 + m = m − 1 olur. Tepe noktası y = 3 üzerinde olduğundan m − 1 = 3 → m = 4 (s.204-210).",
        fc: ["Tepe noktasının y = k doğrusu üzerinde olması ne demektedir?", "Tepe noktasının ordinatının k olması: f(−b/2a) = k."]
      },
      {
        bi: 1,
        metin: "f(x) = x² + 4x + 5 fonksiyonunun görüntü kümesi aşağıdakilerden hangisidir?",
        secenekler: ["[1, ∞)", "(1, ∞)", "[5, ∞)", "[−4, ∞)"],
        cozum: "Tepe noktası (−2, 1) ve a = 1 > 0 olduğundan fonksiyon en az 1 değerini alır: görüntü kümesi [1, ∞) (s.206-212).",
        fc: ["Karesel fonksiyonun görüntü kümesi tepe noktasından nasıl bulunur?", "a > 0 ise [f(tepe), ∞), a < 0 ise (−∞, f(tepe)]."]
      },
      {
        bi: 1,
        metin: "f(x) = −2x² + 8x − 1 fonksiyonunun alabileceği en büyük değer kaçtır?",
        secenekler: ["7", "1", "−1", "8"],
        cozum: "Apsis x = −8 / (2·(−2)) = 2; f(2) = −8 + 16 − 1 = 7. a < 0 olduğu için bu değer en büyük değerdir (s.206-212).",
        fc: ["Karesel fonksiyonda en büyük değer hangi durumda tepe noktasında oluşur?", "a < 0 iken; parabol aşağı açıldığı için tepe noktası maksimumdur."]
      },
      {
        bi: 1,
        metin: "f(x) = x² − 6x + 8 fonksiyonu hangi aralıkta azalan bir fonksiyondur?",
        secenekler: ["(−∞, 3)", "(3, ∞)", "(2, 4)", "ℝ"],
        cozum: "Tepe noktasının apsisi 3 ve a > 0 olduğundan fonksiyon (−∞, 3) aralığında azalan, (3, ∞) aralığında artandır (s.208-214).",
        fc: ["a > 0 olan karesel fonksiyon hangi aralıkta azalandır?", "Tepe noktasının solunda: (−∞, −b/2a)."]
      },
      {
        bi: 1,
        metin: "f(x) = x² − 4 fonksiyonunun değerleri hangi aralıkta negatiftir?",
        secenekler: ["(−2, 2)", "(−∞, −2)", "(2, ∞)", "(0, 4)"],
        cozum: "Kökler −2 ve 2’dir; a > 0 olduğundan parabol kökler arasında x ekseninin altındadır: (−2, 2) (s.210-216).",
        fc: ["Kökleri −2 ve 2 olan, a > 0 olan parabol hangi aralıkta negatiftir?", "Kökler arasında: (−2, 2)."]
      },
      {
        bi: 1,
        metin: "f(x) = (x − 2)² + 3 biçiminde verilen parabolün tepe noktası aşağıdakilerden hangisidir?",
        secenekler: ["(2, 3)", "(−2, 3)", "(2, −3)", "(3, 2)"],
        cozum: "f(x) = (x − r)² + k biçiminde tepe noktası (r, k) olur; burada (2, 3) elde edilir (s.212-218).",
        fc: ["f(x) = (x − r)² + k biçimindeki parabolün tepe noktası nedir?", "(r, k)."]
      },
      {
        bi: 1,
        metin: "Yerden atılan bir topun yüksekliği h(t) = −5t² + 20t bağıntısıyla veriliyor (h metre, t saniye). Top en fazla kaç metre yükselir?",
        secenekler: ["20 m", "10 m", "40 m", "25 m"],
        cozum: "Tepe noktasının apsisi t = −20 / (2·(−5)) = 2 saniye; h(2) = −20 + 40 = 20 m (s.206-214).",
        fc: ["Yükseklik bağıntısı karesel olan bir hareketin maksimum yüksekliği nasıl bulunur?", "Bağıntının tepe noktasının ordinatı hesaplanır."]
      },
      {
        bi: 1,
        metin: "f(x) = ax² + bx + c parabolünün tepe noktası x ekseni üzerinde ise diskriminantı için hangisi doğrudur?",
        secenekler: ["Δ = 0", "Δ > 0", "Δ < 0", "Δ’nın işareti tepe noktasına bağlı değildir"],
        cozum: "Tepe noktası x ekseni üzerindeyse parabol x eksenine teğettir; bu durumda denklemin çift katlı tek kökü vardır, yani Δ = 0 (s.210-216).",
        fc: ["Parabol x eksenine teğetse diskriminant kaçtır?", "Δ = 0; denklemin çift katlı tek kökü vardır."]
      },
      {
        bi: 1,
        metin: "f(x) = x² + bx + 9 parabolü x eksenine teğet ise b’nin alabileceği pozitif değer kaçtır?",
        secenekler: ["6", "3", "9", "12"],
        cozum: "Teğetlik için Δ = b² − 4·1·9 = 0 → b² = 36; pozitif değer b = 6 olur (s.210-216).",
        fc: ["x eksenine teğet parabolde katsayılar arasındaki ilişki nedir?", "b² − 4ac = 0, yani Δ = 0."]
      },
      {
        bi: 1,
        metin: "f(x) = x² − 2x − 3 fonksiyonunun y eksenini kestiği nokta hangisidir?",
        secenekler: ["(0, −3)", "(0, 3)", "(−3, 0)", "(1, −4)"],
        cozum: "y ekseni üzerinde x = 0’dır: f(0) = −3, kesişim noktası (0, −3) (s.200-206).",
        fc: ["Bir fonksiyonun y eksenini kestiği nokta nasıl bulunur?", "x = 0 yazılır; nokta (0, f(0)) olur."]
      },
      {
        bi: 1,
        metin: "Tepe noktası (1, −4) olan ve baş katsayısı 1 olan parabolün denklemi hangisidir?",
        secenekler: ["f(x) = (x − 1)² − 4", "f(x) = (x + 1)² − 4", "f(x) = (x − 1)² + 4", "f(x) = (x − 4)² + 1"],
        cozum: "Tepe noktası (r, k) olan ve a = 1 olan parabol f(x) = (x − r)² + k biçimindedir: f(x) = (x − 1)² − 4 (s.212-218).",
        fc: ["Tepe noktası (r, k) ve baş katsayısı a olan parabolün denklemi nedir?", "f(x) = a(x − r)² + k."]
      }
    ]
  },
  {
    /* ---------- 4.4 RASYONEL FONKSİYONLAR ---------- */
    konu_id: "mat_10_u04_k04",
    kaynak: "Matematik 10 ders kitabı, s.243-263",
    items: [
      {
        bi: 0,
        metin: "f(x) = 3 / (x + 1) fonksiyonunun tanım kümesi aşağıdakilerden hangisidir?",
        secenekler: ["ℝ − {−1}", "ℝ − {1}", "ℝ − {3}", "ℝ"],
        cozum: "Payda sıfır olamaz: x + 1 ≠ 0 → x ≠ −1; tanım kümesi ℝ − {−1} olur (s.243-248).",
        fc: ["Rasyonel fonksiyonun tanım kümesi nasıl bulunur?", "Paydayı sıfır yapan değerler tanım kümesinden çıkarılır."]
      },
      {
        bi: 0,
        metin: "f(x) = (2x − 6) / (x + 4) fonksiyonunun tanım kümesi aşağıdakilerden hangisidir?",
        secenekler: ["ℝ − {−4}", "ℝ − {3}", "ℝ − {−3}", "ℝ − {4}"],
        cozum: "Paydayı sıfır yapan değer x = −4’tür; payın sıfırı (x = 3) tanım kümesini kısıtlamaz (s.243-248).",
        fc: ["Rasyonel fonksiyonda payın sıfırı tanım kümesini kısıtlar mı?", "Kısıtlamaz; yalnızca paydayı sıfır yapan değerler dışarıda bırakılır."]
      },
      {
        bi: 0,
        metin: "f(x) = 1 / x² fonksiyonunun tanım kümesi aşağıdakilerden hangisidir?",
        secenekler: ["ℝ − {0}", "[0, ∞)", "(0, ∞)", "ℝ"],
        cozum: "x² = 0 yalnızca x = 0 için sağlanır; bu değer dışındaki tüm gerçek sayılar tanım kümesindedir (s.243-250).",
        fc: ["1/x² fonksiyonunun tanım kümesi nedir?", "ℝ − {0}."]
      },
      {
        bi: 0,
        metin: "f(x) = 5 / (x² − 9) fonksiyonunun tanım kümesi aşağıdakilerden hangisidir?",
        secenekler: ["ℝ − {−3, 3}", "ℝ − {3}", "ℝ − {−9, 9}", "ℝ − {9}"],
        cozum: "x² − 9 = 0 → x = −3 veya x = 3; iki değer de tanım kümesinden çıkarılır (s.243-250).",
        fc: ["Paydası x² − 9 olan fonksiyonun tanım kümesi nedir?", "ℝ − {−3, 3}."]
      },
      {
        bi: 1,
        metin: "f(x) = 1 / (x − 2) + 3 fonksiyonunun yatay asimptotu aşağıdakilerden hangisidir?",
        secenekler: ["y = 3", "y = 2", "y = 0", "x = 2"],
        cozum: "Fonksiyon f(x) = 1/(x − 2) + k biçiminde olduğundan yatay asimptot y = k = 3’tür (s.252-258).",
        fc: ["f(x) = 1/(x − r) + k fonksiyonunun yatay asimptotu nedir?", "y = k doğrusu."]
      },
      {
        bi: 1,
        metin: "f(x) = 2 / x fonksiyonunun görüntü kümesi aşağıdakilerden hangisidir?",
        secenekler: ["ℝ − {0}", "[0, ∞)", "ℝ", "(0, ∞)"],
        cozum: "Hiçbir x değeri için 2/x sıfır olamaz; bunun dışındaki her gerçek değer alınabilir: ℝ − {0} (s.248-252).",
        fc: ["k/x biçimindeki fonksiyonun görüntü kümesi nedir?", "ℝ − {0}; fonksiyon hiçbir zaman sıfır değerini almaz."]
      },
      {
        bi: 1,
        metin: "f(x) = 1 / x fonksiyonunun değeri x sonsuza büyürken hangi sayıya yaklaşır?",
        secenekler: ["0", "1", "Sonsuz", "−1"],
        cozum: "x büyüdükçe 1/x küçülür ve sıfıra yaklaşır; bu nedenle yatay asimptot y = 0’dır (s.252-258).",
        fc: ["1/x fonksiyonu x sonsuza giderken neye yaklaşır?", "Sıfıra; yatay asimptot y = 0’dır."]
      },
      {
        bi: 1,
        metin: "f(x) = 1 / (x − 1) fonksiyonunun düşey asimptotu aşağıdakilerden hangisidir?",
        secenekler: ["x = 1", "x = 0", "y = 1", "y = 0"],
        cozum: "Paydayı sıfır yapan değer düşey asimptottur: x − 1 = 0 → x = 1 (s.252-258).",
        fc: ["Rasyonel fonksiyonun düşey asimptotu nasıl bulunur?", "Paydayı sıfır yapan x değeri düşey asimptottur."]
      },
      {
        bi: 1,
        metin: "f(x) = −1 / x fonksiyonunun işareti için hangisi doğrudur?",
        secenekler: [
          "x < 0 iken pozitif, x > 0 iken negatiftir.",
          "x < 0 iken negatif, x > 0 iken pozitiftir.",
          "Her iki aralıkta da pozitiftir.",
          "Her iki aralıkta da negatiftir."
        ],
        cozum: "Payda x ile −1 çarpımı incelenir: x negatifken bölüm pozitif, x pozitifken bölüm negatiftir (s.246-252).",
        fc: ["f(x) = −1/x fonksiyonunun işareti aralıklara göre nasıldır?", "x negatifken pozitif, x pozitifken negatiftir."]
      },
      {
        bi: 1,
        metin: "f(x) = 1 / x + 2 fonksiyonunun x = 2 için değeri kaçtır?",
        secenekler: ["2,5", "0,5", "3", "1"],
        cozum: "x yerine 2 yazılır: 1/2 + 2 = 0,5 + 2 = 2,5 (s.244-248).",
        fc: ["Rasyonel fonksiyonda bir noktadaki değer nasıl hesaplanır?", "x yerine ilgili değer yazılıp işlem yapılır."]
      },
      {
        bi: 1,
        metin: "Bir su deposunun kalan su miktarı V(t) = 600 / (t + 2) litre bağıntısıyla modellenmektedir (t dakika). t arttıkça kalan su miktarı nasıl değişir?",
        secenekler: [
          "Azalır ve sıfıra yaklaşır.",
          "Artar ve sonsuza yaklaşır.",
          "Sabit kalır.",
          "Önce artar, sonra azalır."
        ],
        cozum: "Payda büyüdükçe bölüm küçülür; kalan su miktarı azalarak sıfıra yaklaşır, yatay asimptot V = 0’dır (s.252-260).",
        fc: ["V(t) = k/(t + c) biçimindeki bir modelde t büyürken miktar nasıl değişir?", "Azalır ve sıfıra yaklaşır."]
      },
      {
        bi: 1,
        metin: "f(x) = (x + 3) / (x − 1) fonksiyonunun x = 3 için değeri kaçtır?",
        secenekler: ["3", "1,5", "2", "6"],
        cozum: "x = 3 yazılır: (3 + 3) / (3 − 1) = 6 / 2 = 3 (s.244-248).",
        fc: ["Paydası sıfır olmayan bir noktada rasyonel fonksiyonun değeri nasıl bulunur?", "Pay ve paydada x yerine değer yazılıp bölme yapılır."]
      },
      {
        bi: 1,
        metin: "f(x) = k / x fonksiyonunun değeri (1, 4) noktasından geçiyorsa k kaçtır?",
        secenekler: ["4", "1", "0,25", "8"],
        cozum: "Nokta fonksiyonu sağlar: f(1) = k / 1 = 4 → k = 4 (s.244-250).",
        fc: ["Bir noktanın fonksiyon üzerinde olması ne anlama gelir?", "Noktanın koordinatları fonksiyon denklemini sağlar: f(x) = y."]
      },
      {
        bi: 1,
        metin: "f(x) = 1 / x fonksiyonu için f(a) = 3 ise a kaçtır?",
        secenekler: ["1/3", "3", "−1/3", "1"],
        cozum: "1 / a = 3 eşitliğinden a = 1/3 bulunur (s.244-248).",
        fc: ["f(x) = 1/x için f(a) = c ise a nedir?", "a = 1/c."]
      }
    ]
  },
  {
    /* ---------- 4.6 DENKLEM / EŞİTSİZLİK PROBLEMLERİ ---------- */
    konu_id: "mat_10_u04_k06",
    kaynak: "Matematik 10 ders kitabı, s.284-305",
    items: [
      {
        bi: 0,
        metin: "Bir bahçenin çevresi 40 metredir. Kısa kenarı x, uzun kenarı x + 4 metre olduğuna göre çevreyi veren denklem hangisidir?",
        secenekler: ["2x + 2(x + 4) = 40", "x + (x + 4) = 40", "4x = 40", "x(x + 4) = 40"],
        cozum: "Dikdörtgenin çevresi iki kısa ve iki uzun kenarın toplamıdır: 2x + 2(x + 4) = 40 (s.284-290).",
        fc: ["Dikdörtgenin çevre formülü nedir?", "Çevre = 2·(kısa kenar) + 2·(uzun kenar) = 2(a + b)."]
      },
      {
        bi: 0,
        metin: "Fiyatı 80 TL olan bir ürüne %x indirim yapıldıktan sonra 60 TL ödenmiştir. Bu durumu veren denklem hangisidir?",
        secenekler: ["80·(1 − x/100) = 60", "80 − x = 60", "80·x = 60", "80 + x/100 = 60"],
        cozum: "İndirimden sonraki fiyat 80·(1 − x/100) olur; ödenen tutar 60 TL olduğundan 80·(1 − x/100) = 60 denklemi kurulur (s.290-296).",
        fc: ["%x indirimden sonra fiyat hangi çarpanla hesaplanır?", "Fiyat · (1 − x/100)."]
      },
      {
        bi: 0,
        metin: "Dikdörtgen biçimindeki bir levhanın alanı 24 cm²’dir. Kısa kenarı x cm, uzun kenarı x + 2 cm olduğuna göre alanı veren denklem hangisidir?",
        secenekler: ["x(x + 2) = 24", "2(x + x + 2) = 24", "x + (x + 2) = 24", "x² + 2 = 24"],
        cozum: "Dikdörtgenin alanı kenar uzunluklarının çarpımıdır: x·(x + 2) = 24 (s.284-290).",
        fc: ["Dikdörtgenin alan formülü nedir?", "Alan = kısa kenar · uzun kenar."]
      },
      {
        bi: 0,
        metin: "Sabit 60 km/sa hızla t saatte 240 km yol alan bir aracın hareketini veren denklem hangisidir?",
        secenekler: ["60·t = 240", "60 + t = 240", "t/60 = 240", "240·t = 60"],
        cozum: "Yol = hız · zaman bağıntısından 60·t = 240 denklemi elde edilir (s.290-296).",
        fc: ["Yol, hız ve zaman arasındaki bağıntı nedir?", "Yol = hız · zaman."]
      },
      {
        bi: 1,
        metin: "Bir sayının karesinin 9 fazlası 25’e eşittir. Sayı pozitif olduğuna göre sayı kaçtır?",
        secenekler: ["4", "5", "3", "8"],
        cozum: "Denklem x² + 9 = 25 → x² = 16; pozitif çözüm x = 4’tür (s.296-300).",
        fc: ["x² = 16 denkleminin çözümleri nelerdir?", "x = 4 ve x = −4."]
      },
      {
        bi: 1,
        metin: "Yerden atılan bir topun yüksekliği h(t) = −5t² + 10t bağıntısıyla veriliyor (h metre, t saniye). Top hangi t değerinde yere düşer (t > 0)?",
        secenekler: ["2", "1", "5", "10"],
        cozum: "Yere düşme anında h(t) = 0’dır: −5t² + 10t = 0 → 5t(2 − t) = 0; t > 0 için t = 2 saniye (s.296-302).",
        fc: ["Yükseklik bağıntısında yere düşme anı nasıl bulunur?", "Yükseklik sıfıra eşitlenir ve denklem çözülür."]
      },
      {
        bi: 1,
        metin: "Bir atölyede günlük maliyet C(x) = x² − 20x + 120 bağıntısıyla veriliyor (TL cinsinden, x üretim miktarı). Maliyetin en düşük olduğu üretim miktarı kaçtır?",
        secenekler: ["10", "20", "5", "0"],
        cozum: "C karesel fonksiyonunun tepe noktası apsisindedir: x = 20 / 2 = 10; maliyet bu üretim miktarında en küçüktür (s.300-305).",
        fc: ["Karesel maliyet fonksiyonunda en düşük maliyet nerede oluşur?", "Tepe noktasının apsisinde; a > 0 olduğu için tepe minimumdur."]
      },
      {
        bi: 1,
        metin: "√(x − 1) = 3 denkleminin çözümü kaçtır?",
        secenekler: ["10", "8", "9", "4"],
        cozum: "Her iki tarafın karesi alınır: x − 1 = 9 → x = 10; sağlama yapıldığında √9 = 3 olduğu görülür (s.284-292).",
        fc: ["Karekök içeren denklem hangi adımla çözülür?", "Her iki tarafın karesi alınır, sonra çözüm sağlaması yapılır."]
      },
      {
        bi: 1,
        metin: "1 / (x − 2) = 4 denkleminin çözümü kaçtır?",
        secenekler: ["9/4", "4", "1/4", "3"],
        cozum: "İçler dışlar çarpımıyla 4(x − 2) = 1 → 4x − 8 = 1 → x = 9/4 olur (s.292-298).",
        fc: ["1/(x − r) = c denklemi nasıl çözülür?", "İçler dışlar çarpımı yapılarak x yalnız bırakılır."]
      },
      {
        bi: 1,
        metin: "x² − 2x − 8 ≥ 0 eşitsizliğinin çözüm kümesi aşağıdakilerden hangisidir?",
        secenekler: [
          "(−∞, −2] ∪ [4, ∞)",
          "[−2, 4]",
          "(−∞, −4] ∪ [2, ∞)",
          "ℝ"
        ],
        cozum: "x² − 2x − 8 = (x − 4)(x + 2) kökleri −2 ve 4’tür; a > 0 olduğundan işaret köklerin dışında pozitiftir: (−∞, −2] ∪ [4, ∞) (s.300-305).",
        fc: ["Kökleri −2 ve 4, baş katsayısı pozitif olan eşitsizlik hangi aralıkta sağlanır?", "Köklerin dışında: (−∞, −2] ∪ [4, ∞)."]
      }
    ]
  },
  {
    /* ---------- 5.1 SAYMA STRATEJİLERİ ---------- */
    konu_id: "mat_10_u05_k01",
    kaynak: "Matematik 10 ders kitabı, s.313-338",
    items: [
      {
        bi: 0,
        metin: "Bir menüde 3 çeşit çorba ve 4 çeşit ana yemek vardır. Yalnızca bir çorba veya yalnızca bir ana yemek seçecek bir kişi kaç farklı seçim yapabilir?",
        secenekler: ["7", "12", "3", "4"],
        cozum: "Seçimler birbirini dışladığı için toplama yoluyla sayma kullanılır: 3 + 4 = 7 (s.313-318).",
        fc: ["“Veya” bağlacıyla birbirini dışlayan seçimlerde hangi sayma yolu kullanılır?", "Toplama yoluyla sayma; durum sayıları toplanır."]
      },
      {
        bi: 0,
        metin: "Aynı menüde bir çorba ile bir ana yemekten oluşan bir menü kaç farklı biçimde seçilebilir?",
        secenekler: ["12", "7", "3", "4"],
        cozum: "İki seçim birlikte yapıldığı için çarpma yoluyla sayma kullanılır: 3 · 4 = 12 (s.318-324).",
        fc: ["Birlikte yapılan ardışık seçimlerde hangi sayma yolu kullanılır?", "Çarpma yoluyla sayma; durum sayıları çarpılır."]
      },
      {
        bi: 0,
        metin: "Birbirini dışlayan seçeneklerin sayısı bulunurken aşağıdaki yollardan hangisi kullanılır?",
        secenekler: [
          "Durum sayıları toplanır.",
          "Durum sayıları çarpılır.",
          "Yalnızca en büyük durum sayısı alınır.",
          "Durum sayıları ikiye bölünür."
        ],
        cozum: "Aynı anda gerçekleşemeyen seçeneklerde toplama yoluyla sayma uygulanır (s.313-318).",
        fc: ["Toplama yoluyla sayma hangi durumda kullanılır?", "Seçenekler birbirini dışlıyorsa, yani aynı anda gerçekleşemiyorsa."]
      },
      {
        bi: 1,
        metin: "4 farklı matematik kitabı ve 5 farklı fizik kitabı arasından bir matematik ve bir fizik kitabı kaç farklı biçimde seçilebilir?",
        secenekler: ["20", "9", "5", "4"],
        cozum: "Birlikte yapılan iki seçim olduğu için çarpma yoluyla sayma: 4 · 5 = 20 (s.318-324).",
        fc: ["İki farklı gruptan birer eleman seçimi kaç yolla yapılır?", "Grup büyüklüklerinin çarpımı kadar."]
      },
      {
        bi: 1,
        metin: "Bir kafede 2 çeşit ekmek, 3 çeşit peynir ve 4 çeşit sebze vardır. Bir sandviç bir ekmek, bir peynir ve bir sebze ile yapılacaksa kaç farklı sandviç oluşturulabilir?",
        secenekler: ["24", "9", "12", "6"],
        cozum: "Üç bağımsız seçim çarpma yoluyla sayılır: 2 · 3 · 4 = 24 (s.318-326).",
        fc: ["Üç aşamalı bir seçimde toplam durum sayısı nasıl bulunur?", "Her aşamadaki durum sayısı çarpılır."]
      },
      {
        bi: 1,
        metin: "Bir sınıfta 8 kız ve 10 erkek öğrenci vardır. Sınıf temsilcisi bir kız veya bir erkek öğrenci arasından seçilecekse kaç farklı seçim yapılabilir?",
        secenekler: ["18", "80", "8", "10"],
        cozum: "Temsilci ya kız ya erkek olacağından seçimler birbirini dışlar: 8 + 10 = 18 (s.313-318).",
        fc: ["İki ayrı gruptan yalnızca bir eleman seçilecekse kaç yol vardır?", "Grup büyüklüklerinin toplamı kadar."]
      },
      {
        bi: 1,
        metin: "Bir binada 5 giriş kapısı ve 3 çıkış kapısı vardır. Bir kişi bir girişten girip bir çıkıştan çıkacaksa kaç farklı giriş-çıkış yolu seçebilir?",
        secenekler: ["15", "8", "5", "3"],
        cozum: "Giriş ve çıkış seçimleri birlikte yapıldığı için çarpma yoluyla sayma: 5 · 3 = 15 (s.318-324).",
        fc: ["Giriş ve çıkış seçenekleri birlikte değerlendirildiğinde hangi sayma yolu kullanılır?", "Çarpma yoluyla sayma."]
      },
      {
        bi: 1,
        metin: "Dört haneli bir şifrenin her hanesi 0 ile 9 arasındaki rakamlardan oluşmakta ve rakamlar tekrar edebilmektedir. Kaç farklı şifre oluşturulabilir?",
        secenekler: ["10 000", "1 000", "100 000", "40"],
        cozum: "Her hane için 10 seçenek vardır ve haneler bağımsızdır: 10 · 10 · 10 · 10 = 10 000 (s.324-330).",
        fc: ["Her hanesi 10 seçenekli 4 haneli şifrede kaç durum vardır?", "10⁴ = 10 000."]
      },
      {
        bi: 1,
        metin: "3 farklı renkte kalem ve 2 farklı defter arasından bir kalem veya bir defter seçimi kaç farklı biçimde yapılabilir?",
        secenekler: ["5", "6", "3", "2"],
        cozum: "Seçim ya kalem ya defter olacağı için toplama yoluyla sayma: 3 + 2 = 5 (s.313-318).",
        fc: ["“Biri veya diğeri” biçimindeki seçimlerde hangi işlem yapılır?", "Durum sayıları toplanır."]
      },
      {
        bi: 1,
        metin: "Beş soruluk bir sınavda her soru doğru veya yanlış olarak işaretlenecektir. Kaç farklı cevap anahtarı oluşturulabilir?",
        secenekler: ["32", "10", "25", "5"],
        cozum: "Her soru için 2 seçenek vardır ve sorular bağımsızdır: 2⁵ = 32 (s.324-330).",
        fc: ["Her biri 2 seçenekli 5 soruda kaç farklı anahtar vardır?", "2⁵ = 32."]
      }
    ]
  }
];
