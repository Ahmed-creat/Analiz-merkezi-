#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 · 3-4. TEMALAR — kitaptan sıfırdan havuzlar
   ------------------------------------------------------------
     3.1 Asal Çarpanlar ve Bölenler                 s.143-148
     3.2 EBOB-EKOK                                  s.149-160
     3.3 Bölünebilme Özellikleriyle Kalan Bulma     s.161-173
     4.1 Fonksiyonların Nitel Özellikleri           s.182-196
     4.2 Karesel Fonksiyonlar                       s.197-223
     4.3 Karekök Fonksiyonlar                       s.224-242
     4.4 Rasyonel Fonksiyonlar                      s.243-263
     4.5 Ters Fonksiyonlar                          s.264-283
     4.6 Denklem/Eşitsizlik Problemleri             s.284-305
   Kullanım: node docs/uretim/uretim/mat-t2.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Matematik";
const DOSYA = "matematik-10.pdf (MEB, 2025)";
const kaynak = s => "Matematik 10 ders kitabı, s." + s;

/* ------------------------------------------------------- 3.1 */
yazKonu({
  konu_id: "mat_10_u03_k01",
  ders: DERS, tema: 3, tema_adi: "Sayılar",
  baslik: "3.1 Bir Doğal Sayı ile Asal Çarpanları ve Bölenleri Arasındaki İlişkiler",
  kazanim: "Bir doğal sayının asal çarpanları ile pozitif bölen sayısı arasındaki ilişkiyi kullanır.",
  kaynak: kaynak("143-148"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Asal çarpanlara ayırmayı yapar.",
    "Pozitif bölen sayısını hesaplar."
  ],
  items: [
    {
      bi: 0,
      metin: "60 sayısının asal çarpanlara ayrılmış hâli hangisidir?",
      secenekler: ["2² · 3 · 5", "2 · 3 · 5", "2² · 15", "3 · 4 · 5"],
      cozum: "60 = 2·2·3·5 = 2²·3·5 (s.143-144).",
      fc: ["60'ın asal çarpanları nedir?", "2² · 3 · 5"]
    },
    {
      bi: 0,
      metin: "18 sayısının pozitif tam bölen sayısı kaçtır?",
      secenekler: ["6", "4", "3", "9"],
      cozum: "18 = 2·3² olduğundan bölen sayısı (1+1)·(2+1) = 6'dır (kitaptaki tablo, s.144).",
      fc: ["18'in pozitif bölen sayısı kaçtır?", "6"]
    },
    {
      bi: 0,
      metin: "36 sayısının pozitif tam bölen sayısı kaçtır?",
      secenekler: ["9", "6", "12", "8"],
      cozum: "36 = 2²·3² → (2+1)·(2+1) = 9 bölen (s.144).",
      fc: ["36'nın pozitif bölen sayısı kaçtır?", "9"]
    },
    {
      bi: 0,
      metin: "2³ · 3² biçiminde yazılan sayının pozitif bölen sayısı kaçtır?",
      secenekler: ["12", "6", "10", "8"],
      cozum: "(3+1)·(2+1) = 12 (s.144'teki genelleme).",
      fc: ["2³·3² sayısının bölen sayısı kaçtır?", "12"]
    },
    {
      bi: 0,
      metin: "Asal sayı nasıl tanımlanır?",
      secenekler: ["1 ve kendisinden başka pozitif böleni olmayan 1'den büyük doğal sayı", "Tek olan her doğal sayı", "Yalnız 2'ye bölünen sayı", "1 dahil tüm sayılar"],
      cozum: "Asal sayı, 1 ve kendisinden başka pozitif tam böleni olmayan, 1'den büyük doğal sayıdır (s.143).",
      fc: ["Asal sayı nedir?", "1 ve kendinden başka böleni olmayan, 1'den büyük sayı."]
    },
    {
      bi: 1,
      metin: "72 sayısının pozitif tam bölen sayısı kaçtır?",
      secenekler: ["12", "10", "8", "16"],
      cozum: "72 = 2³·3² → (3+1)·(2+1) = 12 bölen (s.144-145).",
      fc: ["72'nin bölen sayısı kaçtır?", "12"]
    },
    {
      bi: 1,
      metin: "48 sayısının pozitif tam bölen sayısı kaçtır?",
      secenekler: ["10", "8", "12", "6"],
      cozum: "48 = 2⁴·3 → (4+1)·(1+1) = 10 bölen (s.144).",
      fc: ["48'in bölen sayısı kaçtır?", "10"]
    },
    {
      bi: 1,
      metin: "25 sayısının pozitif bölenleri hangileridir?",
      secenekler: ["1, 5, 25", "1, 25", "1, 5, 10, 25", "5, 25"],
      cozum: "25 = 5² olduğundan bölenleri 1, 5 ve 25'tir (kitaptaki tablo, s.144).",
      fc: ["25'in bölenleri nelerdir?", "1, 5, 25"]
    },
    {
      bi: 1,
      metin: "1 sayısı neden asal sayı değildir?",
      secenekler: ["Asal tanımı 1'den büyük sayıları kapsar", "Tek sayı olduğu için", "Çift sayı olduğu için", "Böleni olmadığı için"],
      cozum: "Asal sayı tanımı 1'den büyük doğal sayılarla sınırlıdır (s.143).",
      fc: ["1 asal mıdır?", "Hayır."]
    },
    {
      bi: 1,
      metin: "Bir sayının asal çarpanlarına ayrılmış hâli 2²·5³ ise pozitif bölen sayısı kaçtır?",
      secenekler: ["12", "10", "6", "25"],
      cozum: "(2+1)·(3+1) = 12 (s.144'teki genelleme).",
      fc: ["2²·5³ sayısının bölen sayısı kaçtır?", "12"]
    }
  ]
});

/* ------------------------------------------------------- 3.2 */
yazKonu({
  konu_id: "mat_10_u03_k02",
  ders: DERS, tema: 3, tema_adi: "Sayılar",
  baslik: "3.2 En Büyük Ortak Bölen-En Küçük Ortak Kat",
  kazanim: "İki veya daha fazla doğal sayının EBOB ve EKOK'unu bulur, problem çözer.",
  kaynak: kaynak("149-160"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "EBOB ve EKOK kavramlarını açıklar.",
    "EBOB-EKOK problemlerini çözer."
  ],
  items: [
    {
      bi: 0,
      metin: "En büyük ortak bölen (EBOB) nedir?",
      secenekler: ["Verilen sayıların hepsini bölen en büyük doğal sayı", "Verilen sayıların en büyüğü", "Sayıların çarpımı", "Sayıların toplamı"],
      cozum: "EBOB, sayıların ortak bölenlerinin en büyüğüdür; asal çarpanlarda ortak olanların en küçük kuvvetleri alınır (s.151-153).",
      fc: ["EBOB nedir?", "Ortak bölenlerin en büyüğü."]
    },
    {
      bi: 0,
      metin: "En küçük ortak kat (EKOK) nedir?",
      secenekler: ["Verilen sayıların ortak katlarının en küçüğü", "Sayıların çarpımı", "Ortak bölenlerin en büyüğü", "Sayıların toplamı"],
      cozum: "EKOK, ortak katların en küçüğüdür; asal çarpanlarda tüm çarpanların en büyük kuvvetleri alınır (s.151-153).",
      fc: ["EKOK nedir?", "Ortak katların en küçüğü."]
    },
    {
      bi: 1,
      metin: "12 ve 18 sayılarının EBOB'u kaçtır?",
      secenekler: ["6", "3", "2", "36"],
      cozum: "12 = 2²·3, 18 = 2·3² → ortak en küçük kuvvetler: 2·3 = 6 (s.151-153).",
      fc: ["EBOB(12, 18) kaçtır?", "6"]
    },
    {
      bi: 1,
      metin: "12 ve 18 sayılarının EKOK'u kaçtır?",
      secenekler: ["36", "6", "216", "18"],
      cozum: "12 = 2²·3, 18 = 2·3² → EKOK = 2²·3² = 36 (s.151-153).",
      fc: ["EKOK(12, 18) kaçtır?", "36"]
    },
    {
      bi: 1,
      metin: "24 ve 36 sayılarının EBOB'u kaçtır?",
      secenekler: ["12", "6", "72", "24"],
      cozum: "24 = 2³·3, 36 = 2²·3² → EBOB = 2²·3 = 12 (s.153).",
      fc: ["EBOB(24, 36) kaçtır?", "12"]
    },
    {
      bi: 1,
      metin: "6 ve 8 sayılarının EKOK'u kaçtır?",
      secenekler: ["24", "48", "2", "12"],
      cozum: "6 = 2·3, 8 = 2³ → EKOK = 2³·3 = 24 (kitaptaki örnek, s.153).",
      fc: ["EKOK(6, 8) kaçtır?", "24"]
    },
    {
      bi: 1,
      metin: "İki sayının EBOB'u 6, EKOK'u 36 ise bu sayıların çarpımı kaçtır?",
      secenekler: ["216", "42", "180", "36"],
      cozum: "İki sayı için EBOB·EKOK = sayıların çarpımı → 6·36 = 216 (s.153-155).",
      fc: ["EBOB·EKOK neye eşittir?", "Sayıların çarpımına."]
    },
    {
      bi: 1,
      metin: "8 ve 12 sayılarının EBOB ve EKOK'u sırasıyla hangisidir?",
      secenekler: ["4 ve 24", "2 ve 48", "24 ve 4", "4 ve 48"],
      cozum: "8 = 2³, 12 = 2²·3 → EBOB = 4, EKOK = 24 (s.153).",
      fc: ["8 ve 12 için EBOB, EKOK kaçtır?", "4 ve 24"]
    },
    {
      bi: 1,
      metin: "Uzunlukları 24 m ve 36 m olan iki tomruk eşit ve en büyük uzunlukta parçalara ayrılacaktır. Her parça kaç metre olur?",
      secenekler: ["12", "6", "8", "4"],
      cozum: "Parça uzunluğu EBOB(24, 36) = 12 m'dir (kitaptaki tomruk sorusu, s.153).",
      fc: ["24 ve 36'yı eşit en büyük parçalara ayıran uzunluk kaçtır?", "12"]
    },
    {
      bi: 1,
      metin: "İki zilden biri 6 dakikada, diğeri 8 dakikada bir çalıyor. Birlikte çaldıktan kaç dakika sonra tekrar birlikte çalarlar?",
      secenekler: ["24", "14", "48", "12"],
      cozum: "EKOK(6, 8) = 24 dakika (s.153-156'daki EKOK uygulaması).",
      fc: ["6 ve 8 dakikalık ziller ne zaman birlikte çalar?", "24 dakika sonra."]
    }
  ]
});

/* ------------------------------------------------------- 3.3 */
yazKonu({
  konu_id: "mat_10_u03_k03",
  ders: DERS, tema: 3, tema_adi: "Sayılar",
  baslik: "3.3 Bölünebilme Özelliklerini Kullanarak Kalan Bulma",
  kazanim: "Bölünebilme özelliklerini kullanarak bir doğal sayının bölümünden kalanı bulur.",
  kaynak: kaynak("161-173"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Bölünebilme kurallarını açıklar.",
    "Bölümden kalanı kuralla hesaplar."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir doğal sayının 3 ile bölümünden kalan nasıl bulunur?",
      secenekler: ["Rakamları toplamının 3 ile bölümünden kalanına bakılır", "Son basamağına bakılır", "Son iki basamağına bakılır", "Sayı 3'e bölünür"],
      cozum: "Kitapta 3 ile bölümünden kalanın, rakamlar toplamının 3 ile bölümünden kalanına eşit olduğu belirtilir (s.165-166).",
      fc: ["3 ile kalan nasıl bulunur?", "Rakamlar toplamının 3'e bölümünden kalan."]
    },
    {
      bi: 0,
      metin: "Bir doğal sayının 5 ile bölümünden kalan neye bağlıdır?",
      secenekler: ["Son basamağındaki rakama", "Rakamlar toplamına", "Son iki basamağına", "Basamak sayısına"],
      cozum: "5 ile bölümünden kalan, son basamağın 5'e bölümünden kalanına eşittir (s.163).",
      fc: ["5 ile kalan neye bağlıdır?", "Son basamağa."]
    },
    {
      bi: 0,
      metin: "Bir doğal sayının 4 ile bölümünden kalan nasıl bulunur?",
      secenekler: ["Son iki basamağındaki sayının 4 ile bölümünden kalanına bakılır", "Rakamlar toplamına", "Son basamağa", "Son üç basamağa"],
      cozum: "4 ile bölünebilme son iki basamağa bağlıdır (s.163-164).",
      fc: ["4 ile kalan nasıl bulunur?", "Son iki basamağa bakılır."]
    },
    {
      bi: 0,
      metin: "Bir doğal sayının 8 ile bölümünden kalan neye göre bulunur?",
      secenekler: ["Son üç basamağına", "Son iki basamağına", "Rakamlar toplamına", "İlk basamağına"],
      cozum: "8 ile bölünebilme son üç basamakla belirlenir (s.163).",
      fc: ["8 ile kalan nasıl bulunur?", "Son üç basamağa bakılır."]
    },
    {
      bi: 1,
      metin: "252 sayısının 9 ile bölümünden kalan kaçtır?",
      secenekler: ["0", "9", "2", "4"],
      cozum: "2+5+2 = 9 ve 9 sayısı 9'a tam bölünür → kalan 0 (kitabın doğrulama örneği, s.166).",
      fc: ["252'nin 9 ile kalanı kaçtır?", "0"]
    },
    {
      bi: 1,
      metin: "1472 sayısının 3 ile bölümünden kalan kaçtır?",
      secenekler: ["2", "1", "0", "14"],
      cozum: "1+4+7+2 = 14, 14'ün 3'e bölümünden kalan 2'dir (kitabın örneği, s.166).",
      fc: ["1472'nin 3 ile kalanı kaçtır?", "2"]
    },
    {
      bi: 1,
      metin: "1234 sayısının 9 ile bölümünden kalan kaçtır?",
      secenekler: ["1", "4", "6", "0"],
      cozum: "1+2+3+4 = 10, 10'un 9'a bölümünden kalan 1'dir (s.165-166).",
      fc: ["1234'ün 9 ile kalanı kaçtır?", "1"]
    },
    {
      bi: 1,
      metin: "864 sayısının 4 ile bölümünden kalan kaçtır?",
      secenekler: ["0", "2", "4", "1"],
      cozum: "Son iki basamak 64'tür ve 64 sayısı 4'e tam bölünür → kalan 0 (s.163-164).",
      fc: ["864'ün 4 ile kalanı kaçtır?", "0"]
    },
    {
      bi: 1,
      metin: "175'in 12'ye bölümünden kalan 7 ise 175'in 4 ile bölümünden kalanı kaçtır?",
      secenekler: ["3", "7", "1", "0"],
      cozum: "Kitaptaki çıkarıma göre kalan, 7'nin 4'e bölümünden kalana eşittir: 7 = 4·1 + 3 → kalan 3 (s.169).",
      fc: ["175'in 12'ye kalanı 7 ise 4'e kalanı kaçtır?", "3"]
    },
    {
      bi: 1,
      metin: "Aşağıdaki sayılardan hangisi 9 ile tam bölünür?",
      secenekler: ["531", "412", "725", "634"],
      cozum: "531 → 5+3+1 = 9 olduğundan 9'a tam bölünür; diğerlerinin rakam toplamı 7, 14 ve 13'tür (s.165-166).",
      fc: ["531 neden 9'a bölünür?", "Rakamları toplamı 9."]
    }
  ]
});

/* ------------------------------------------------------- 4.1 */
yazKonu({
  konu_id: "mat_10_u04_k01",
  ders: DERS, tema: 4, tema_adi: "Nicelikler ve Değişimler",
  baslik: "4.1 Gerçek Sayılarda Tanımlı Fonksiyonların Nitel Özellikleri",
  kazanim: "Fonksiyonun tanım kümesi, görüntü kümesi, işareti, artan-azalanlığı ve bire birliği gibi nitel özelliklerini inceler.",
  kaynak: kaynak("182-196"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Fonksiyonun temel nitel özelliklerini tanımlar.",
    "Verilen fonksiyonun nitel özelliklerini belirler."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir ilişkinin fonksiyon olması için hangi koşul gerekir?",
      secenekler: ["Tanım kümesindeki her elemanın yalnızca bir görüntüsü olmalı", "Her elemanın iki görüntüsü olmalı", "Görüntü kümesi boş olmalı", "Tanım kümesi sonlu olmalı"],
      cozum: "Kitaba göre tanım kümesindeki her bir gerçek sayının değer kümesinde yalnızca bir karşılığı vardır (s.186).",
      fc: ["Fonksiyon olma şartı nedir?", "Her x için tek bir görüntü."]
    },
    {
      bi: 0,
      metin: "Bire bir fonksiyon nasıl tanımlanır?",
      secenekler: ["Farklı x değerleri için farklı görüntüler veren fonksiyon", "Her x için aynı görüntüyü veren fonksiyon", "Tanım kümesi boş olan fonksiyon", "Görüntü kümesi boş olan fonksiyon"],
      cozum: "Farklı x'ler için f(x) değerleri de farklıysa fonksiyon bire birdir (s.186, s.226).",
      fc: ["Bire bir fonksiyon nedir?", "Farklı x'ler farklı görüntü verir."]
    },
    {
      bi: 0,
      metin: "Örten fonksiyon neyi ifade eder?",
      secenekler: ["Görüntü kümesinin değer kümesine eşit olması", "Tanım kümesinin boş olması", "Fonksiyonun sabit olması", "Grafiğin doğru olması"],
      cozum: "Değer kümesindeki her eleman bir görüntü ise fonksiyon örtendir (s.186, s.199).",
      fc: ["Örten fonksiyon nedir?", "Görüntü kümesi = değer kümesi."]
    },
    {
      bi: 0,
      metin: "Artan fonksiyon nasıl tanımlanır?",
      secenekler: ["x arttıkça f(x) de artan fonksiyon", "x arttıkça f(x) azalan fonksiyon", "Her x için aynı değeri veren fonksiyon", "Tanımsız noktaları olan fonksiyon"],
      cozum: "Tanım aralığında x₁ < x₂ iken f(x₁) < f(x₂) ise fonksiyon artandır (s.186-190).",
      fc: ["Artan fonksiyon nedir?", "x artarken f(x) artar."]
    },
    {
      bi: 1,
      metin: "Deposunda 600 litre yakıt bulunan tankerden dakikada 20 litre yakıt akmaktadır. Kalan yakıt miktarını veren fonksiyonun tanım kümesi hangisidir?",
      secenekler: ["[0, 30]", "[0, 600]", "[0, 20]", "(0, 30)"],
      cozum: "600/20 = 30 dakikada boşalır; zaman 0 ile 30 arasındadır (s.183).",
      fc: ["600 L, 20 L/dk → tanım kümesi nedir?", "[0, 30]"]
    },
    {
      bi: 1,
      metin: "Aynı tankerde kalan yakıt miktarının görüntü kümesi hangisidir?",
      secenekler: ["[0, 600]", "[0, 30]", "[20, 600]", "[600, ∞)"],
      cozum: "Yakıt 600 litreden 0 litreye kadar azalır; görüntü kümesi [0, 600] olur (s.183).",
      fc: ["Kalan yakıtın görüntü kümesi nedir?", "[0, 600]"]
    },
    {
      bi: 1,
      metin: "f(x) = 2x + 1 fonksiyonu bire bir midir?",
      secenekler: ["Evet, bire birdir", "Hayır, bire bir değildir", "Yalnız pozitif x'lerde bire birdir", "Belirlenemez"],
      cozum: "Doğrusal fonksiyonun eğimi sıfırdan farklı olduğundan farklı x'ler farklı değerler verir (s.186-190).",
      fc: ["f(x) = 2x + 1 bire bir mi?", "Evet."]
    },
    {
      bi: 1,
      metin: "f: R → R, f(x) = x² fonksiyonu bire bir midir?",
      secenekler: ["Hayır, çünkü f(−2) = f(2)", "Evet, çünkü artandır", "Evet, çünkü tanım kümesi R'dir", "Belirlenemez"],
      cozum: "f(−2) = f(2) = 4 olduğundan farklı x'ler aynı görüntüyü verir; fonksiyon bire bir değildir (s.199).",
      fc: ["x² neden bire bir değildir?", "f(−2) = f(2)"]
    },
    {
      bi: 1,
      metin: "f(x) = 3x − 6 fonksiyonunun sıfırı kaçtır?",
      secenekler: ["2", "−2", "6", "3"],
      cozum: "3x − 6 = 0 → x = 2 (s.187-190'daki sıfır incelemesi).",
      fc: ["f(x)=3x−6'nın sıfırı kaçtır?", "2"]
    },
    {
      bi: 1,
      metin: "Sabit fonksiyon için hangisi doğrudur?",
      secenekler: ["Tanım kümesindeki her x için aynı değeri alır", "Her x için farklı değer alır", "Bire birdir", "Tanım kümesi boştur"],
      cozum: "Sabit fonksiyonda f(x) = c olduğundan tüm görüntüler aynıdır (s.187-190).",
      fc: ["Sabit fonksiyonun grafiği nasıldır?", "Yatay doğru."]
    }
  ]
});

/* ------------------------------------------------------- 4.2 */
yazKonu({
  konu_id: "mat_10_u04_k02",
  ders: DERS, tema: 4, tema_adi: "Nicelikler ve Değişimler",
  baslik: "4.2 Gerçek Sayılarda Tanımlı Karesel Fonksiyonlar ve Nitel Özellikleri",
  kazanim: "Karesel fonksiyonun grafiğini çizer; tepe noktası, simetri ekseni ve işaretini inceler.",
  kaynak: kaynak("197-223"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Karesel fonksiyonun tepe noktasını ve simetri eksenini bulur.",
    "Karesel fonksiyonun nitel özelliklerini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "f(x) = ax² + bx + c (a ≠ 0) fonksiyonunun grafiği hangi eğridir?",
      secenekler: ["Parabol", "Doğru", "Çember", "Hiperbol"],
      cozum: "Karesel fonksiyonun grafiği paraboldür (s.197-199).",
      fc: ["Karesel fonksiyonun grafiği nedir?", "Parabol."]
    },
    {
      bi: 0,
      metin: "f(x) = ax² + bx + c parabolünün tepe noktasının apsisi hangi bağıntıyla bulunur?",
      secenekler: ["x = −b/(2a)", "x = b/(2a)", "x = −c/a", "x = a/b"],
      cozum: "Tepe noktasının apsisi x = −b/(2a), simetri ekseni de bu doğrudur (s.199-205).",
      fc: ["Tepe noktasının apsisi nedir?", "−b/(2a)"]
    },
    {
      bi: 0,
      metin: "a < 0 olduğunda parabolün kolları hangi yöne bakar?",
      secenekler: ["Aşağıya", "Yukarıya", "Sola", "Sağa"],
      cozum: "a > 0 ise kollar yukarı, a < 0 ise aşağı bakar (s.199-203).",
      fc: ["a < 0 ise kollar ne yapar?", "Aşağı bakar."]
    },
    {
      bi: 0,
      metin: "Karesel fonksiyonun diskriminantı sıfırdan büyükse ne söylenebilir?",
      secenekler: ["Grafik x eksenini iki farklı noktada keser", "Grafik x eksenine teğettir", "Grafik x eksenini kesmez", "Fonksiyon doğrusaldır"],
      cozum: "Δ > 0 ise iki farklı gerçek kök, yani x eksenini iki noktada kesme vardır (s.205-210).",
      fc: ["Δ > 0 ne demektir?", "İki farklı kök."]
    },
    {
      bi: 1,
      metin: "f(x) = x² − 4x + 3 fonksiyonunun tepe noktası hangisidir?",
      secenekler: ["(2, −1)", "(−2, −1)", "(2, 3)", "(4, 3)"],
      cozum: "x = −b/(2a) = 4/2 = 2; f(2) = 4 − 8 + 3 = −1 → tepe (2, −1) (s.199-205).",
      fc: ["x²−4x+3'ün tepesi nedir?", "(2, −1)"]
    },
    {
      bi: 1,
      metin: "f: [−3, 2] → R, f(x) = x² fonksiyonunun görüntü kümesi hangisidir?",
      secenekler: ["[0, 9]", "[0, 4]", "[−3, 2]", "[4, 9]"],
      cozum: "Kitabın 6. örneğinde görüntü kümesi [0, 9] bulunur (s.199).",
      fc: ["f(x)=x², [−3,2] görüntü kümesi nedir?", "[0, 9]"]
    },
    {
      bi: 1,
      metin: "Aynı fonksiyonda maksimum değer hangi noktada ve kaçtır?",
      secenekler: ["x = −3'te 9", "x = 2'de 4", "x = 0'da 0", "x = 3'te 9"],
      cozum: "Tanım aralığının sol ucunda f(−3) = 9 en büyük değerdir (s.199).",
      fc: ["[−3,2] aralığında x² en büyük değeri nerede alır?", "x = −3'te 9"]
    },
    {
      bi: 1,
      metin: "f(x) = x² − 6x + 5 fonksiyonunun minimum değeri kaçtır?",
      secenekler: ["−4", "5", "−3", "0"],
      cozum: "Tepe apsisi x = 3; f(3) = 9 − 18 + 5 = −4 (s.199-205).",
      fc: ["x²−6x+5'in minimum değeri kaçtır?", "−4"]
    },
    {
      bi: 1,
      metin: "f(x) = −x² + 20x − 96 fonksiyonunun tepe noktası hangisidir?",
      secenekler: ["(10, 4)", "(10, −96)", "(20, 4)", "(8, 0)"],
      cozum: "x = −20/(2·(−1)) = 10; f(10) = −100 + 200 − 96 = 4 (kitabın örneği, s.287).",
      fc: ["−x²+20x−96'nın tepesi nedir?", "(10, 4)"]
    },
    {
      bi: 1,
      metin: "f(x) = x² − 5x + 6 fonksiyonunun sıfırları hangileridir?",
      secenekler: ["2 ve 3", "−2 ve −3", "1 ve 6", "0 ve 6"],
      cozum: "x² − 5x + 6 = (x − 2)(x − 3) → kökler 2 ve 3 (s.205-210).",
      fc: ["x²−5x+6'nın kökleri nedir?", "2 ve 3"]
    }
  ]
});

/* ------------------------------------------------------- 4.3 */
yazKonu({
  konu_id: "mat_10_u04_k03",
  ders: DERS, tema: 4, tema_adi: "Nicelikler ve Değişimler",
  baslik: "4.3 Gerçek Sayılarda Tanımlı Karekök Fonksiyonlar ve Nitel Özellikleri",
  kazanim: "Karekök fonksiyonunun tanım kümesini, görüntü kümesini ve nitel özelliklerini inceler.",
  kaynak: kaynak("224-242"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Karekök fonksiyonunun tanım ve görüntü kümesini belirler.",
    "Karekök fonksiyonunun grafiğini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "f(x) = √x fonksiyonunun tanım kümesi hangisidir?",
      secenekler: ["[0, ∞)", "R", "(−∞, 0]", "R − {0}"],
      cozum: "Karekökün içi negatif olamaz; tanım kümesi [0, ∞) olur (s.224-226).",
      fc: ["√x'in tanım kümesi nedir?", "[0, ∞)"]
    },
    {
      bi: 0,
      metin: "f(x) = √x fonksiyonunun görüntü kümesi hangisidir?",
      secenekler: ["[0, ∞)", "R", "(−∞, 0]", "[1, ∞)"],
      cozum: "Karekök değeri negatif olamaz; görüntü kümesi [0, ∞) olur (s.226).",
      fc: ["√x'in görüntü kümesi nedir?", "[0, ∞)"]
    },
    {
      bi: 0,
      metin: "f(x) = √x fonksiyonu tanım kümesinde nasıl davranır?",
      secenekler: ["Artandır", "Azalandır", "Sabittir", "Önce artar sonra azalır"],
      cozum: "x arttıkça √x de artar; fonksiyon artandır (s.226).",
      fc: ["√x artan mı azalan mı?", "Artan."]
    },
    {
      bi: 0,
      metin: "f(x) = √x fonksiyonu bire bir midir?",
      secenekler: ["Evet", "Hayır", "Yalnız x > 1 için", "Belirlenemez"],
      cozum: "Kitabın 11. örneğinde tanım aralığındaki farklı x'lerin farklı görüntüler verdiği, yani fonksiyonun bire bir olduğu gösterilir (s.226).",
      fc: ["√x bire bir mi?", "Evet."]
    },
    {
      bi: 1,
      metin: "f(x) = √x için f(16) kaçtır?",
      secenekler: ["4", "8", "16", "2"],
      cozum: "√16 = 4 (s.226).",
      fc: ["f(16) kaçtır? (f(x)=√x)", "4"]
    },
    {
      bi: 1,
      metin: "f: [0, 20] → R, f(x) = √x fonksiyonunun maksimum değeri kaçtır?",
      secenekler: ["√20", "20", "10", "√10"],
      cozum: "Artan fonksiyon olduğundan en büyük değer x = 20'de √20'dir (kitabın 11. örneği, s.226).",
      fc: ["[0,20] aralığında √x'in en büyük değeri nedir?", "√20"]
    },
    {
      bi: 1,
      metin: "Aynı fonksiyonun minimum değeri kaçtır?",
      secenekler: ["0", "1", "√20", "−20"],
      cozum: "x = 0'da √0 = 0 en küçük değerdir (s.226).",
      fc: ["[0,20] aralığında √x'in en küçük değeri kaçtır?", "0"]
    },
    {
      bi: 1,
      metin: "f(x) = √(x − 3) fonksiyonunun tanım kümesi hangisidir?",
      secenekler: ["[3, ∞)", "[0, ∞)", "(−3, ∞)", "R"],
      cozum: "x − 3 ≥ 0 → x ≥ 3 olduğundan tanım kümesi [3, ∞) (s.228-232).",
      fc: ["√(x−3) tanım kümesi nedir?", "x ≥ 3"]
    },
    {
      bi: 1,
      metin: "f(x) = √x fonksiyonunun sıfırı hangi noktadadır?",
      secenekler: ["x = 0", "x = 1", "x = −1", "Sıfırı yoktur"],
      cozum: "√x = 0 → x = 0 (s.226).",
      fc: ["√x'in sıfırı nerededir?", "x = 0"]
    },
    {
      bi: 1,
      metin: "√x = 5 eşitliğini sağlayan x değeri kaçtır?",
      secenekler: ["25", "5", "10", "√5"],
      cozum: "İki tarafın karesi alınırsa x = 25 olur (s.236-240).",
      fc: ["√x = 5 ise x kaçtır?", "25"]
    }
  ]
});

/* ------------------------------------------------------- 4.4 */
yazKonu({
  konu_id: "mat_10_u04_k04",
  ders: DERS, tema: 4, tema_adi: "Nicelikler ve Değişimler",
  baslik: "4.4 Gerçek Sayılarda Tanımlı Rasyonel Fonksiyonlar ve Nitel Özellikleri",
  kazanim: "Rasyonel referans fonksiyonunun tanım kümesi, görüntü kümesi ve davranışını inceler.",
  kaynak: kaynak("243-263"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Rasyonel fonksiyonun tanım ve görüntü kümesini belirler.",
    "Rasyonel fonksiyonun grafiğini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "f(x) = 1/x rasyonel referans fonksiyonunun tanım kümesi hangisidir?",
      secenekler: ["R − {0}", "R", "[0, ∞)", "(−∞, 0]"],
      cozum: "x = 0'da payda sıfır olduğundan fonksiyon tanımsızdır; tanım kümesi R − {0}'dır (s.245).",
      fc: ["1/x'in tanım kümesi nedir?", "R − {0}"]
    },
    {
      bi: 0,
      metin: "f(x) = 1/x fonksiyonunun görüntü kümesi hangisidir?",
      secenekler: ["R − {0}", "R", "[0, ∞)", "(−∞, 0]"],
      cozum: "1/x hiçbir zaman 0 değerini almaz; görüntü kümesi R − {0}'dır (s.245).",
      fc: ["1/x'in görüntü kümesi nedir?", "R − {0}"]
    },
    {
      bi: 0,
      metin: "f(x) = 1/x fonksiyonunun sıfırı için hangisi doğrudur?",
      secenekler: ["Sıfırı yoktur", "Sıfırı x = 0'dadır", "Sıfırı x = 1'dedir", "İki sıfırı vardır"],
      cozum: "1/x = 0 denkleminin çözümü yoktur; fonksiyon x eksenini kesmez (s.245).",
      fc: ["1/x'in sıfırı var mı?", "Yok."]
    },
    {
      bi: 0,
      metin: "f(x) = 1/x fonksiyonunun (−∞, 0) ve (0, ∞) aralıklarındaki davranışı nasıldır?",
      secenekler: ["Her iki aralıkta azalan", "Her iki aralıkta artan", "Birinde artan, birinde azalan", "Sabit"],
      cozum: "Kitaba göre 1/x fonksiyonu (−∞, 0) ve (0, +∞) aralıklarının her birinde azalandır (s.245).",
      fc: ["1/x artan mı azalan mı?", "Her iki aralıkta azalan."]
    },
    {
      bi: 1,
      metin: "f(x) = 1/x için f(4) kaçtır?",
      secenekler: ["1/4", "4", "−4", "0"],
      cozum: "f(4) = 1/4 (s.245).",
      fc: ["f(4) kaçtır? (f(x)=1/x)", "1/4"]
    },
    {
      bi: 1,
      metin: "f(x) = 1/(x − 2) fonksiyonunun tanım kümesi hangisidir?",
      secenekler: ["R − {2}", "R − {−2}", "[2, ∞)", "R"],
      cozum: "x − 2 = 0 → x = 2 dışında tüm gerçek sayılar tanım kümesindedir (s.246-252).",
      fc: ["1/(x−2) tanım kümesi nedir?", "R − {2}"]
    },
    {
      bi: 1,
      metin: "f(x) = 1/(x − 2) fonksiyonunun düşey asimptotu hangisidir?",
      secenekler: ["x = 2", "y = 2", "x = 0", "y = 0"],
      cozum: "Paydayı sıfır yapan x = 2 doğrusu düşey asimptottur (s.248-252).",
      fc: ["1/(x−2)'nin düşey asimptotu nedir?", "x = 2"]
    },
    {
      bi: 1,
      metin: "f(x) = 1/x fonksiyonunun yatay asimptotu hangisidir?",
      secenekler: ["y = 0", "x = 0", "y = 1", "x = 1"],
      cozum: "x büyüdükçe 1/x sıfıra yaklaşır; yatay asimptot y = 0 (x ekseni) olur (s.245-250).",
      fc: ["1/x'in yatay asimptotu nedir?", "y = 0"]
    },
    {
      bi: 1,
      metin: "f(x) = 1/x için f(−4) kaçtır?",
      secenekler: ["−1/4", "1/4", "−4", "4"],
      cozum: "f(−4) = 1/(−4) = −1/4 (s.245).",
      fc: ["f(−4) kaçtır? (f(x)=1/x)", "−1/4"]
    },
    {
      bi: 1,
      metin: "f(x) = (x + 1)/(x − 3) fonksiyonunun tanım kümesi hangisidir?",
      secenekler: ["R − {3}", "R − {−1}", "R", "R − {1}"],
      cozum: "Paydayı sıfır yapan x = 3 değeri tanım kümesinden çıkarılır (s.246-252).",
      fc: ["(x+1)/(x−3) tanım kümesi nedir?", "R − {3}"]
    }
  ]
});

/* ------------------------------------------------------- 4.5 */
yazKonu({
  konu_id: "mat_10_u04_k05",
  ders: DERS, tema: 4, tema_adi: "Nicelikler ve Değişimler",
  baslik: "4.5 Doğrusal, Karesel, Karekök ve Rasyonel Referans Fonksiyonlar ile Bu Fonksiyonlardan Türetilebilen Fonksiyonların Ters Fonksiyonları",
  kazanim: "Bir fonksiyonun tersini bulur ve ters fonksiyonun grafiğini yorumlar.",
  kaynak: kaynak("264-283"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Ters fonksiyon kavramını açıklar.",
    "Verilen fonksiyonun tersini bulur."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir fonksiyonun tersinin grafiği, fonksiyonun grafiğine göre nasıl konumlanır?",
      secenekler: ["y = x doğrusuna göre simetriktir", "x eksenine göre simetriktir", "y eksenine göre simetriktir", "Orijine göre simetriktir"],
      cozum: "Fonksiyon ve tersinin grafikleri y = x doğrusuna göre simetriktir (s.266-270).",
      fc: ["Ters fonksiyonun grafiği neye göre simetriktir?", "y = x doğrusuna göre."]
    },
    {
      bi: 0,
      metin: "Bir fonksiyonun tersinin de fonksiyon olması için fonksiyonun hangi özelliği taşıması gerekir?",
      secenekler: ["Bire bir olması", "Sabit olması", "Artan olması", "Tanım kümesinin R olması"],
      cozum: "Ters ilişkinin fonksiyon olabilmesi için her görüntünün tek bir ön görüntüsü, yani fonksiyonun bire bir olması gerekir (s.264-269).",
      fc: ["Tersi fonksiyon olması için ne gerekir?", "Bire birlik."]
    },
    {
      bi: 0,
      metin: "Ters fonksiyonun tanım kümesi neye eşittir?",
      secenekler: ["Fonksiyonun görüntü kümesine", "Fonksiyonun tanım kümesine", "R'ye", "Boş kümeye"],
      cozum: "Ters fonksiyonda tanım ve görüntü kümeleri yer değiştirir (s.264-269).",
      fc: ["Tersin tanım kümesi neye eşittir?", "Fonksiyonun görüntü kümesine."]
    },
    {
      bi: 1,
      metin: "f(x) = 4x fonksiyonunun tersi hangisidir?",
      secenekler: ["f⁻¹(x) = x/4", "f⁻¹(x) = 4x", "f⁻¹(x) = x + 4", "f⁻¹(x) = −4x"],
      cozum: "y = 4x → x = y/4 → f⁻¹(x) = x/4 (kitaptaki tablo, s.266).",
      fc: ["4x'in tersi nedir?", "x/4"]
    },
    {
      bi: 1,
      metin: "h(x) = x − 2 fonksiyonunun tersi hangisidir?",
      secenekler: ["h⁻¹(x) = x + 2", "h⁻¹(x) = x − 2", "h⁻¹(x) = 2x", "h⁻¹(x) = −x − 2"],
      cozum: "y = x − 2 → x = y + 2 → h⁻¹(x) = x + 2 (s.266).",
      fc: ["x−2'nin tersi nedir?", "x+2"]
    },
    {
      bi: 1,
      metin: "f(x) = x fonksiyonunun tersi hangisidir?",
      secenekler: ["Kendisi", "−x", "1/x", "x²"],
      cozum: "f(x) = x fonksiyonu kendi tersidir (s.266).",
      fc: ["f(x)=x'in tersi nedir?", "Kendisi."]
    },
    {
      bi: 1,
      metin: "f(x) = 2x + 3 fonksiyonunun tersi hangisidir?",
      secenekler: ["(x − 3)/2", "2x − 3", "(x + 3)/2", "x/2 + 3"],
      cozum: "y = 2x + 3 → x = (y − 3)/2 → f⁻¹(x) = (x − 3)/2 (s.266-270).",
      fc: ["2x+3'ün tersi nedir?", "(x−3)/2"]
    },
    {
      bi: 1,
      metin: "f(2) = 7 ise f⁻¹(7) kaçtır?",
      secenekler: ["2", "7", "9", "5"],
      cozum: "Ters fonksiyonda girdi ile çıktı yer değiştirir: f⁻¹(7) = 2 (s.264-269).",
      fc: ["f(2)=7 ise f⁻¹(7) kaçtır?", "2"]
    },
    {
      bi: 1,
      metin: "f: [0, ∞) → [0, ∞), f(x) = x² fonksiyonunun tersi hangisidir?",
      secenekler: ["√x", "x²", "1/x", "−x²"],
      cozum: "Tanım kümesi [0, ∞) ile sınırlandığında x² bire birdir ve tersi √x olur (s.270-278).",
      fc: ["x²'nin [0,∞) üzerindeki tersi nedir?", "√x"]
    },
    {
      bi: 1,
      metin: "f(x) = x³ fonksiyonunun tersi hangisidir?",
      secenekler: ["∛x", "x²", "1/x³", "3x"],
      cozum: "y = x³ → x = ∛y olduğundan ters fonksiyon ∛x'tir (s.270-278).",
      fc: ["x³'ün tersi nedir?", "∛x"]
    }
  ]
});

/* ------------------------------------------------------- 4.6 */
yazKonu({
  konu_id: "mat_10_u04_k06",
  ders: DERS, tema: 4, tema_adi: "Nicelikler ve Değişimler",
  baslik: "4.6 Doğrusal, Karesel, Karekök, Rasyonel Referans Fonksiyonlar ve Bunlardan Türetilen Fonksiyonlarla İfade Edilebilen Denklem ve Eşitsizlikler İçeren Problemlerin Çözümü",
  kazanim: "Gerçek yaşam problemlerini fonksiyonlarla modelleyip denklem ve eşitsizlik çözer.",
  kaynak: kaynak("284-305"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Problemi fonksiyonla modeller.",
    "Denklem ve eşitsizlikleri çözerek yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir problemde 'en az', 'en çok' gibi ifadeler hangi matematiksel yapıyı gerektirir?",
      secenekler: ["Eşitsizlik", "Denklem", "Fonksiyonun tersi", "Türev"],
      cozum: "En az/en çok ifadeleri eşitsizliklerle modellenir; 'eşit' ifadeleri denklem verir (s.284-287).",
      fc: ["'En az' ifadesi neyi gerektirir?", "Eşitsizliği."]
    },
    {
      bi: 0,
      metin: "f(x) = −x² + 20x − 96 fonksiyonunun kökleri hangileridir?",
      secenekler: ["8 ve 12", "−8 ve −12", "4 ve 24", "6 ve 16"],
      cozum: "−(x² − 20x + 96) = −(x − 8)(x − 12) → kökler 8 ve 12 (kitabın örneği, s.287).",
      fc: ["−x²+20x−96'nın kökleri nedir?", "8 ve 12"]
    },
    {
      bi: 0,
      metin: "Aynı fonksiyon için f(x) > 0 eşitsizliğinin çözüm aralığı hangisidir?",
      secenekler: ["(8, 12)", "(−∞, 8) ∪ (12, ∞)", "[8, 12]", "R"],
      cozum: "Kollar aşağı baktığından fonksiyon kökler arasında pozitiftir: (8, 12) (s.287).",
      fc: ["−x²+20x−96 > 0 nerede sağlanır?", "8 < x < 12"]
    },
    {
      bi: 0,
      metin: "Aynı fonksiyon için f(x) ≤ 0 eşitsizliğinin çözüm kümesi hangisidir?",
      secenekler: ["(−∞, 8] ∪ [12, ∞)", "(8, 12)", "[8, 12]", "Boş küme"],
      cozum: "Kökler dışında fonksiyon negatif veya sıfırdır: (−∞, 8] ∪ [12, ∞) (s.287).",
      fc: ["−x²+20x−96 ≤ 0 nerede sağlanır?", "x ≤ 8 veya x ≥ 12"]
    },
    {
      bi: 1,
      metin: "600 litre yakıtı olan tankerden dakikada 20 litre akıyor. Kalan yakıt 200 litre olduğunda kaç dakika geçmiştir?",
      secenekler: ["20", "10", "30", "40"],
      cozum: "600 − 20t = 200 → 20t = 400 → t = 20 dakika (s.183, s.285).",
      fc: ["600−20t=200 ise t kaçtır?", "20"]
    },
    {
      bi: 1,
      metin: "Aynı tankerde kalan yakıtın 400 litreden fazla olması için kaç dakika geçmelidir?",
      secenekler: ["t < 10", "t > 10", "t = 10", "t > 20"],
      cozum: "600 − 20t > 400 → 20t < 200 → t < 10 dakika (s.285-287).",
      fc: ["600−20t>400 ise t ne olmalıdır?", "t < 10"]
    },
    {
      bi: 1,
      metin: "√x = 6 denkleminin çözümü kaçtır?",
      secenekler: ["36", "6", "12", "3"],
      cozum: "Her iki tarafın karesi: x = 36 (s.290-296).",
      fc: ["√x = 6 ise x kaçtır?", "36"]
    },
    {
      bi: 1,
      metin: "1/x = 5 denkleminin çözümü kaçtır?",
      secenekler: ["0,2", "5", "1/5 · 5", "−5"],
      cozum: "İçler dışlar çarpımı: 1 = 5x → x = 1/5 = 0,2 (s.296-300).",
      fc: ["1/x = 5 ise x kaçtır?", "0,2"]
    },
    {
      bi: 1,
      metin: "f(x) = −x² + 20x − 96 fonksiyonunun en büyük değeri kaçtır?",
      secenekler: ["4", "10", "96", "20"],
      cozum: "Tepe noktası x = 10'da f(10) = 4'tür (s.287).",
      fc: ["−x²+20x−96'nın en büyük değeri kaçtır?", "4"]
    },
    {
      bi: 1,
      metin: "x² − 4 < 0 eşitsizliğinin çözüm aralığı hangisidir?",
      secenekler: ["(−2, 2)", "(−∞, −2) ∪ (2, ∞)", "[−2, 2]", "(0, 4)"],
      cozum: "x² − 4 = (x − 2)(x + 2) kökleri −2 ve 2; kollar yukarı olduğundan arada negatiftir: (−2, 2) (s.287-292).",
      fc: ["x²−4<0 nerede sağlanır?", "−2 < x < 2"]
    }
  ]
});
