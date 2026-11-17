#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 · 5-6-7. TEMALAR — kitaptan sıfırdan havuzlar
   ------------------------------------------------------------
     5.1 Sayma Stratejileri                        s.313-338
     5.2 Cebirsel ve Fonksiyonel İşlemlerin
         Algoritmik Yapısı                         s.339-351
     6.1 Dik Koordinat Sisteminde İki Nokta
         Arasındaki Uzaklık ve Bir Doğru Parçasını
         Belli Oranda Bölme                        s.359-371
     6.2 Dik Koordinat Sisteminde Doğrunun
         Özellikleri ve Analitik İncelenmesi       s.372-384
     7.1 Koşullu Olasılık, Bağımlı ve
         Bağımsız Olaylar                          s.393-403
     7.2 Bayes Teoremi                             s.404-408
   Kullanım: node docs/uretim/uretim/mat-t3.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Matematik";
const DOSYA = "matematik-10.pdf (MEB, 2025)";
const kaynak = s => "Matematik 10 ders kitabı, s." + s;

/* ------------------------------------------------------- 5.1 */
yazKonu({
  konu_id: "mat_10_u05_k01",
  ders: DERS, tema: 5, tema_adi: "Sayma, Algoritma ve Bilişim",
  baslik: "5.1 Sayma Stratejileri",
  kazanim: "Toplama ve çarpma yoluyla sayma stratejilerini kullanarak problem çözer.",
  kaynak: kaynak("313-338"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Toplama ve çarpma yoluyla saymayı ayırt eder.",
    "Sayma problemlerini çözer."
  ],
  items: [
    {
      bi: 0,
      metin: "Ayrık durumların sayısını bulurken 'veya' bağlacı hangi sayma yöntemini gerektirir?",
      secenekler: ["Toplama yoluyla sayma", "Çarpma yoluyla sayma", "Ters fonksiyon", "Kosinüs teoremi"],
      cozum: "Ayrık seçeneklerden biri 'veya' ile seçilecekse seçenek sayıları toplanır (s.315-318).",
      fc: ["'veya' hangi saymayı gerektirir?", "Toplama yoluyla sayma."]
    },
    {
      bi: 0,
      metin: "'Önce ... sonra ...' biçimindeki ardışık seçimlerde hangi yöntem kullanılır?",
      secenekler: ["Çarpma yoluyla sayma", "Toplama yoluyla sayma", "Olasılık", "Ortalama"],
      cozum: "Ardışık adımlarda seçenek sayıları çarpılır (s.319-322).",
      fc: ["Ardışık seçimlerde hangi yöntem?", "Çarpma."]
    },
    {
      bi: 0,
      metin: "Okulun 3. sınıfında 12, 4. sınıfında 15 öğrenci temsilci seçilecektir. Bu iki sınıftan yalnızca biri temsilci seçecekse kaç farklı seçim yapılabilir?",
      secenekler: ["27", "180", "15", "12"],
      cozum: "Ayrık durumlar olduğundan 12 + 15 = 27 farklı seçim (s.315-318).",
      fc: ["12 veya 15 arasından seçim kaç yol?", "27"]
    },
    {
      bi: 1,
      metin: "Bir kitap bağışı kampanyasında 4 farklı roman, 3 farklı şiir kitabı vardır. Romanlardan veya şiir kitaplarından bir tane bağışlamak isteyen biri kaç farklı seçim yapabilir?",
      secenekler: ["7", "12", "4", "3"],
      cozum: "4 + 3 = 7 (kitabın 'Eylül kitap bağışı' etkinliğinin mantığı, s.315-318).",
      fc: ["4 roman veya 3 şiir → kaç seçim?", "7"]
    },
    {
      bi: 1,
      metin: "3 farklı tişört ve 4 farklı pantolondan bir tişört ile bir pantolon seçimi kaç farklı biçimde yapılabilir?",
      secenekler: ["12", "7", "3", "4"],
      cozum: "3 · 4 = 12 (s.319-322).",
      fc: ["3 tişört + 4 pantolon → kaç kombinasyon?", "12"]
    },
    {
      bi: 1,
      metin: "0, 1, 2, 3, 4 rakamları kullanılarak rakamları farklı üç basamaklı kaç sayı yazılabilir?",
      secenekler: ["48", "60", "45", "100"],
      cozum: "Yüzler basamağı 4 seçenek (0 olamaz), onlar 4, birler 3 → 4·4·3 = 48 (s.319-323).",
      fc: ["0-4 ile farklı rakamlı üç basamaklı kaç sayı?", "48"]
    },
    {
      bi: 1,
      metin: "4 farklı harfle (A, B, C, D) üç harfli, harfleri tekrarsız kaç farklı şifre oluşturulabilir?",
      secenekler: ["24", "12", "64", "4"],
      cozum: "4·3·2 = 24 farklı şifre (kitabın bisiklet şifresi sorusunun yapısı, s.319-322).",
      fc: ["4 harften üç harfli tekrarsız şifre kaç tane?", "24"]
    },
    {
      bi: 1,
      metin: "Bir sınıfta 10 erkek, 12 kız vardır. Sınıftan bir başkan veya bir başkan yardımcısı (yalnızca biri) seçilecekse kaç farklı seçim yapılabilir?",
      secenekler: ["22", "120", "44", "12"],
      cozum: "10 + 12 = 22 (s.315-318).",
      fc: ["10 erkek veya 12 kızdan biri seçilecekse kaç yol?", "22"]
    },
    {
      bi: 1,
      metin: "ASCII kodlamada 8 bit ile kaç farklı karakter gösterilebilir?",
      secenekler: ["256", "128", "64", "8"],
      cozum: "2⁸ = 256 karakter (kitaptaki ASCII örneği, s.322).",
      fc: ["8 bit ile kaç karakter gösterilir?", "256"]
    },
    {
      bi: 1,
      metin: "ASCII kodlamada 7 bit ile kaç farklı karakter gösterilebilir?",
      secenekler: ["128", "256", "64", "7"],
      cozum: "2⁷ = 128 karakter (s.322).",
      fc: ["7 bit ile kaç karakter?", "128"]
    }
  ]
});

/* ------------------------------------------------------- 5.2 */
yazKonu({
  konu_id: "mat_10_u05_k02",
  ders: DERS, tema: 5, tema_adi: "Sayma, Algoritma ve Bilişim",
  baslik: "5.2 Cebirsel ve Fonksiyonel İşlemlerin Algoritmik Yapısı",
  kazanim: "Cebirsel ve fonksiyonel işlemleri algoritmik yapı içinde planlar; mantık bağlaçlarını ve niceleyicileri kullanır.",
  kaynak: kaynak("339-351"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Algoritma, akış şeması ve algoritmik doğal dili tanır.",
    "Mantık bağlaçları ve niceleyicilerle koşul ifade eder."
  ],
  items: [
    {
      bi: 0,
      metin: "Kitaba göre algoritmik yapının problem çözmedeki temel işlevi nedir?",
      secenekler: ["Çözüm adımlarını belirli bir sıraya koyup süreci hızlandırması", "Sonucu tahmin etmesi", "Yalnızca sayıları sıralaması", "Problemi ortadan kaldırması"],
      cozum: "Kitaba göre algoritmik yapı, çözüm adımlarını belirli bir sıraya göre düzenler; süreç hızlanır ve daha verimli olur (s.339).",
      gorsel: {
        tip: "tablo",
        basliklar: ["Akış şeması ögesi", "İşlevi"],
        satirlar: [["BAŞLA", "Algoritmanın başlangıcı"], ["VERİ GİRİŞİ", "Değerlerin alınması"], ["KOŞUL", "Karar noktası"], ["İŞLEM", "Hesaplama"], ["SONUÇ YAZDIR", "Çıktı"], ["BİTİR", "Son"]]
      },
      fc: ["Algoritma ne sağlar?", "Adımları sıraya koyar, hız ve verim sağlar."]
    },
    {
      bi: 0,
      metin: "Algoritmanın işleyişi kitaba göre hangi biçimlerde ifade edilebilir?",
      secenekler: ["Algoritmik doğal dil, sözde kod ve akış şeması", "Yalnızca denklem", "Yalnızca tablo", "Yalnızca grafik"],
      cozum: "Kitap algoritmanın işleyişini algoritmik doğal dil, sözde kod ve akış şeması ile ifade eder (s.344-348).",
      fc: ["Algoritma hangi biçimlerde gösterilir?", "Algoritmik doğal dil, sözde kod, akış şeması."]
    },
    {
      bi: 0,
      metin: "Koşulun 've' bağlacıyla ifade edilmesi ne anlama gelir?",
      secenekler: ["Koşulların her ikisinin birlikte sağlanması", "Koşullardan en az birinin sağlanması", "Koşulların hiçbirinin sağlanmaması", "Koşulların sırayla sağlanması"],
      cozum: "Kitapta 've' bağlacı, iki koşulun birlikte gerçekleşmesini gerektirir (s.341).",
      fc: ["'ve' bağlacı neyi gerektirir?", "Her iki koşulun birlikte sağlanmasını."]
    },
    {
      bi: 0,
      metin: "Koşulun 'veya' bağlacıyla ifade edilmesi ne anlama gelir?",
      secenekler: ["Koşullardan en az birinin sağlanması", "Koşulların ikisinin birden sağlanması", "Koşulların hiçbirinin sağlanmaması", "Koşulların eşit olması"],
      cozum: "'veya' bağlacı, koşullardan en az birinin sağlanması durumunda doğrudur (s.341).",
      fc: ["'veya' bağlacı neyi gerektirir?", "En az birinin sağlanmasını."]
    },
    {
      bi: 0,
      metin: "Kitabın başarı belgesi tablosuna göre teşekkür belgesi alabilmek için dönem sonu ağırlıklı not ortalaması hangi aralıkta olmalıdır?",
      secenekler: ["70 ile 84,99 arasında", "85 ve üzeri", "70'ten küçük", "60 ile 70 arasında"],
      cozum: "Tablo 1 ve Tablo 2'ye göre ortalama 70 ile 84,99 arasında ise teşekkür belgesi alınır (s.341).",
      gorsel: {
        tip: "tablo",
        basliklar: ["Öğrenci", "Ortalama", "Devamsızlık (gün)", "Belge"],
        satirlar: [["Betül", "90", "0", "Takdir"], ["Ömer", "68", "0", "—"], ["Serkan", "75", "0", "Teşekkür"], ["Handan", "86", "0", "Takdir"]]
      },
      fc: ["Teşekkür belgesi için ortalama aralığı nedir?", "70 – 84,99"]
    },
    {
      bi: 0,
      metin: "Algoritmada 'ise' bağlacının işlevi nedir?",
      secenekler: ["Koşul sağlandığında belirtilen işlemin yapılmasını sağlar", "İki koşulu birleştirir", "Döngüyü başlatır", "Sonucu yazdırır"],
      cozum: "Kitaba göre 'ise' bağlacı, koşulun karşılanması durumunda belirtilen işlemin gerçekleştirilmesini sağlar (s.342).",
      fc: ["'ise' bağlacı ne yapar?", "Koşul sağlanırsa işlemi yaptırır."]
    },
    {
      bi: 0,
      metin: "'Bazı öğrencilerin dönem sonu ağırlıklı not ortalaması 85'ten büyüktür.' ifadesinde kullanılan niceleyici hangisidir?",
      secenekler: ["Bazı (en az bir)", "Her", "Hiçbiri", "Yalnızca bir"],
      cozum: "Kitaptaki Tablo 2'de bu ifade 'bazı' niceleyicisiyle kurulur; niceleyiciler algoritmada koşulun hangi öğrenciler için geçerli olduğunu belirtir (s.341).",
      fc: ["'Bazı' niceleyicisi neyi belirtir?", "En az bir öğrenci için geçerli olduğunu."]
    },
    {
      bi: 1,
      metin: "Kitabın 9. Sıra Sizde etkinliğinde 1'den 10'a kadar olan tam sayıların toplamını bulan algoritma çalıştırıldığında 'Toplam' değişkeni kaç olur?",
      secenekler: ["55", "45", "10", "100"],
      cozum: "1 + 2 + ... + 10 = 55; algoritma sayaç 10'a ulaşana kadar toplama yapar (s.344).",
      fc: ["1'den 10'a kadar toplam kaçtır?", "55"]
    },
    {
      bi: 1,
      metin: "Babil metoduyla √70 hesaplanırken başlangıç tahmini x₀ = 8 alınırsa ilk adımdaki x₁ değeri kaçtır?",
      secenekler: ["8,375", "8,75", "70", "8,3666"],
      cozum: "x₁ = ½·(8 + 70/8) = ½·(8 + 8,75) = 8,375 (kitabın 17. örneği, s.346).",
      fc: ["√70 için x₀=8 ise x₁ kaçtır?", "8,375"]
    },
    {
      bi: 1,
      metin: "Aynı hesapta ikinci tekrarda (x₂) elde edilen değer yaklaşık kaçtır ve bu neyi gösterir?",
      secenekler: ["8,3666 — tekrarlar gerçek değere yaklaşır", "8,375 — değer değişmez", "8,5 — değer büyür", "7,9 — değer küçülür"],
      cozum: "x₂ ≈ 8,3666 bulunur; tekrarlama gerçek kök değerine yaklaşmayı sağlar (s.346).",
      fc: ["Babil metodunda tekrar ne işe yarar?", "Gerçek değere yaklaştırır."]
    }
  ]
});

/* ------------------------------------------------------- 6.1 */
yazKonu({
  konu_id: "mat_10_u06_k01",
  ders: DERS, tema: 6, tema_adi: "Analitik İnceleme",
  baslik: "6.1 Dik Koordinat Sisteminde İki Nokta Arasındaki Uzaklık ve Bir Doğru Parçasını Belli Oranda Bölme",
  kazanim: "İki nokta arasındaki uzaklığı hesaplar; bir doğru parçasını belli oranda bölen noktayı bulur.",
  kaynak: kaynak("359-371"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "İki nokta arasındaki uzaklığı hesaplar.",
    "Doğru parçasını içten/dıştan bölen noktayı bulur."
  ],
  items: [
    {
      bi: 0,
      metin: "A(x₁, y₁) ve B(x₂, y₂) noktaları arasındaki uzaklık hangi bağıntıyla bulunur?",
      secenekler: ["√((x₂ − x₁)² + (y₂ − y₁)²)", "(x₂ − x₁) + (y₂ − y₁)", "√((x₂ + x₁)² + (y₂ + y₁)²)", "|x₂ − x₁|"],
      cozum: "İki nokta arasındaki uzaklık, kenarları koordinat farkları olan dik üçgende Pisagor bağıntısıyla bulunur (s.359-362).",
      fc: ["İki nokta arası uzaklık formülü nedir?", "√(Δx² + Δy²)"]
    },
    {
      bi: 1,
      metin: "A(1, 2) ve B(4, 6) noktaları arasındaki uzaklık kaç birimdir?",
      secenekler: ["5", "7", "6", "4"],
      cozum: "√((4−1)² + (6−2)²) = √(9+16) = 5 (s.359-362).",
      fc: ["A(1,2), B(4,6) uzaklığı kaçtır?", "5"]
    },
    {
      bi: 1,
      metin: "A(5, 5) ve B(−3, −1) noktaları arasındaki uzaklık kaç birimdir?",
      secenekler: ["10", "8", "6", "12"],
      cozum: "√((−3−5)² + (−1−5)²) = √(64+36) = 10 birim (kitabın harita örneği, s.362).",
      fc: ["A(5,5), B(−3,−1) uzaklığı kaç birim?", "10"]
    },
    {
      bi: 1,
      metin: "Bir haritada A ile B arası 10 birim, B ile C arası 13 birim ölçülüyor. A ile B arası gerçekte 40 km ise B ile C arası gerçekte kaç km'dir?",
      secenekler: ["52", "48", "36", "60"],
      cozum: "Ölçek 40/10 = 4 km/birim; |BC| = √((9−(−3))² + (−6−(−1))²) = 13 birim → 13·4 = 52 km (kitabın harita sorusu, s.362).",
      fc: ["10 birim = 40 km ise 13 birim kaç km'dir?", "52 km"]
    },
    {
      bi: 0,
      metin: "Uç noktaları K(x₁, y₁) ve L(x₂, y₂) olan [KL] doğru parçasının orta noktasının koordinatları hangisidir?",
      secenekler: ["((x₁ + x₂)/2, (y₁ + y₂)/2)", "((x₂ − x₁)/2, (y₂ − y₁)/2)", "(x₁·x₂, y₁·y₂)", "((x₁ + y₁)/2, (x₂ + y₂)/2)"],
      cozum: "Orta nokta, uç noktaların koordinatlarının aritmetik ortalamasıdır (s.367-368).",
      fc: ["Orta nokta koordinatları nedir?", "Uçların ortalaması."]
    },
    {
      bi: 1,
      metin: "A(−3, 6) ve B(7, −4) noktaları veriliyor. [AB]'nin orta noktası hangisidir?",
      secenekler: ["(2, 1)", "(5, 1)", "(2, −1)", "(−5, 5)"],
      cozum: "((−3+7)/2, (6−4)/2) = (2, 1) (s.367-368).",
      fc: ["A(−3,6), B(7,−4) orta noktası nedir?", "(2, 1)"]
    },
    {
      bi: 1,
      metin: "A(−3, 6) noktasından sabit hızla 3 saatte B(7, −4) noktasına giden araç ile B'den A'ya 2 saatte giden araç aynı anda yola çıkıp C noktasında karşılaşıyor. C noktasının koordinatları hangisidir?",
      secenekler: ["(1, 2)", "(2, 1)", "(3, 0)", "(5, −2)"],
      cozum: "Hızlar 5k ve 7,5k oranında; karşılaşma anında alınan yollar 2:3 oranındadır. C, [AB]'yi A'dan 2:3 oranında böler: C = (3·(−3) + 2·7)/5, (3·6 + 2·(−4))/5 = (1, 2) (kitabın 5. sorusu, s.367).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [70, 70], B: [300, 220], C: [160, 130] },
        kenarlar: [{ a: "A", b: "B", etiket: "3 saat / 2 saat" }],
        not: "C, [AB] üzerinde karşılaşma noktası"
      },
      fc: ["Karşılaşma noktası [AB]'yi hangi oranda böler?", "2:3"]
    },
    {
      bi: 1,
      metin: "A(−4, 6) ve B(1, 1) noktaları için [AB] doğru parçası |AB|/|BC| = 5/7 olacak biçimde dıştan bölünüyor. C noktasının koordinatları hangisidir?",
      secenekler: ["(8, −6)", "(−6, 8)", "(6, −8)", "(8, 6)"],
      cozum: "Dıştan bölmede (1−(−4))/(x−1) = 5/7 → x = 8; (1−6)/(y−1) = 5/7 → y = −6 → C(8, −6) (kitabın örneği, s.369).",
      fc: ["Dıştan bölmede C noktası nasıl bulunur?", "Oran bağıntısıyla: C(8, −6)"]
    },
    {
      bi: 1,
      metin: "A(6, 3) ve B(13, 4) noktalarındaki Ayten ile Berke, x ekseni üzerindeki C(x, 0) noktasına eşit hızlarla aynı anda ulaşıyor. Buna göre x kaçtır?",
      secenekler: ["10", "9", "12", "8"],
      cozum: "|AC| = |BC| → (x−6)² + 9 = (x−13)² + 16 → 14x = 140 → x = 10 (kitabın 2. Sıra Sizde sorusu, s.365).",
      fc: ["|AC| = |BC| ise x kaçtır?", "10"]
    },
    {
      bi: 1,
      metin: "Aynı soruda haritanın ölçeği 1:10 000 ve birim santimetredir. Ayten ile Berke'nin toplamda yürüdükleri yol kaç metredir?",
      secenekler: ["1000", "100", "500", "2000"],
      cozum: "|AC| = √(16+9) = 5 cm, |BC| = √(9+16) = 5 cm; toplam 10 cm → 10·10 000 = 100 000 cm = 1000 m (s.365).",
      fc: ["5 + 5 cm, 1:10 000 ölçekte kaç metredir?", "1000 m"]
    }
  ]
});

/* ------------------------------------------------------- 6.2 */
yazKonu({
  konu_id: "mat_10_u06_k02",
  ders: DERS, tema: 6, tema_adi: "Analitik İnceleme",
  baslik: "6.2 Dik Koordinat Sisteminde Doğrunun Özellikleri ve Analitik İncelenmesi",
  kazanim: "Doğrunun eğimini ve denklemini bulur; paralel ve dik doğruların eğim ilişkisini kullanır.",
  kaynak: kaynak("372-384"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Doğrunun eğimini hesaplar.",
    "Doğru denklemini yazar, eğim ilişkilerini kullanır."
  ],
  items: [
    {
      bi: 0,
      metin: "A(x₁, y₁) ve B(x₂, y₂) noktalarından geçen doğrunun eğimi hangi bağıntıyla bulunur?",
      secenekler: ["(y₂ − y₁)/(x₂ − x₁)", "(x₂ − x₁)/(y₂ − y₁)", "(y₂ + y₁)/(x₂ + x₁)", "y₂ − y₁"],
      cozum: "Eğim, dikey değişimin yatay değişime oranıdır (s.372-375).",
      fc: ["İki noktadan eğim nasıl bulunur?", "(y₂−y₁)/(x₂−x₁)"]
    },
    {
      bi: 0,
      metin: "Birbirine paralel iki doğrunun eğimleri için hangisi doğrudur?",
      secenekler: ["Eşittir", "Çarpımları −1'dir", "Toplamları 0'dır", "Biri diğerinin iki katıdır"],
      cozum: "Paralel doğruların eğimleri eşittir (s.376-380).",
      fc: ["Paralel doğruların eğimleri nasıldır?", "Eşittir."]
    },
    {
      bi: 0,
      metin: "Birbirine dik iki doğrunun eğimleri için hangisi doğrudur?",
      secenekler: ["Çarpımları −1'dir", "Eşittir", "Toplamları 1'dir", "Biri sıfırdır"],
      cozum: "Dik doğruların eğimleri çarpımı −1'dir (m₁·m₂ = −1) (s.380-382).",
      fc: ["Dik doğruların eğim çarpımı kaçtır?", "−1"]
    },
    {
      bi: 1,
      metin: "A(1, 2) ve B(4, 8) noktalarından geçen doğrunun eğimi kaçtır?",
      secenekler: ["2", "1/2", "−2", "6"],
      cozum: "(8 − 2)/(4 − 1) = 6/3 = 2 (s.372-375).",
      fc: ["A(1,2), B(4,8) eğimi kaçtır?", "2"]
    },
    {
      bi: 1,
      metin: "Eğimi 3 olan ve (0, −2) noktasından geçen doğrunun denklemi hangisidir?",
      secenekler: ["y = 3x − 2", "y = 3x + 2", "y = −2x + 3", "y = 2x − 3"],
      cozum: "y = mx + n → −2 = 3·0 + n → n = −2 → y = 3x − 2 (s.375-378).",
      fc: ["Eğim 3, (0,−2) → denklem nedir?", "y = 3x − 2"]
    },
    {
      bi: 1,
      metin: "y = 2x + 5 doğrusuna paralel olan doğrunun eğimi kaçtır?",
      secenekler: ["2", "−1/2", "5", "1/2"],
      cozum: "Paralel doğruların eğimleri eşit olduğundan eğim 2'dir (s.376-380).",
      fc: ["y=2x+5'e paralel doğrunun eğimi kaçtır?", "2"]
    },
    {
      bi: 1,
      metin: "y = 2x + 5 doğrusuna dik olan doğrunun eğimi kaçtır?",
      secenekler: ["−1/2", "2", "1/2", "−2"],
      cozum: "m₁·m₂ = −1 → 2·m₂ = −1 → m₂ = −1/2 (s.380-382).",
      fc: ["y=2x+5'e dik doğrunun eğimi kaçtır?", "−1/2"]
    },
    {
      bi: 1,
      metin: "(2, 3) ve (5, 3) noktalarından geçen doğrunun eğimi kaçtır?",
      secenekler: ["0", "3", "Tanımsız", "1"],
      cozum: "(3 − 3)/(5 − 2) = 0; doğru x eksenine paraleldir (s.372-375).",
      fc: ["(2,3) ve (5,3) eğimi kaçtır?", "0"]
    },
    {
      bi: 1,
      metin: "x = 4 doğrusunun eğimi için hangisi doğrudur?",
      secenekler: ["Tanımsızdır", "0'dır", "1'dir", "4'tür"],
      cozum: "Düşey doğrularda yatay değişim sıfırdır; eğim tanımsızdır (s.374-376).",
      fc: ["x = 4 doğrusunun eğimi kaçtır?", "Tanımsız."]
    },
    {
      bi: 1,
      metin: "Eğimi −1/3 olan doğruya dik olan doğrunun eğimi kaçtır?",
      secenekler: ["3", "−3", "1/3", "−1/3"],
      cozum: "m₁·m₂ = −1 → (−1/3)·m₂ = −1 → m₂ = 3 (s.380-382).",
      fc: ["Eğim −1/3'e dik eğim kaçtır?", "3"]
    }
  ]
});

/* ------------------------------------------------------- 7.1 */
yazKonu({
  konu_id: "mat_10_u07_k01",
  ders: DERS, tema: 7, tema_adi: "Veriden Olasılığa",
  baslik: "7.1 Koşullu Olasılık, Bağımlı ve Bağımsız Olaylar",
  kazanim: "Koşullu olasılığı hesaplar; olayların bağımlı ya da bağımsız olduğunu belirler.",
  kaynak: kaynak("393-403"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Koşullu olasılık kavramını açıklar ve hesaplar.",
    "Bağımlı ve bağımsız olayları ayırt eder."
  ],
  items: [
    {
      bi: 0,
      metin: "Koşullu olasılık P(A|B) neyi ifade eder?",
      secenekler: ["B olayı gerçekleştiğinde A olayının olasılığını", "A ve B'nin birlikte olasılığını", "A'nın tümleyeninin olasılığını", "B'nin A'dan bağımsız olasılığını"],
      cozum: "P(A|B), B olayı gerçekleştiği bilindiğinde A olayının olasılığıdır (s.394-396).",
      fc: ["P(A|B) ne demektir?", "B verildiğinde A'nın olasılığı."]
    },
    {
      bi: 0,
      metin: "P(A|B) hangi bağıntıyla hesaplanır? (P(B) > 0)",
      secenekler: ["P(A ∩ B)/P(B)", "P(A)·P(B)", "P(A ∪ B)/P(A)", "P(B)/P(A)"],
      cozum: "Koşullu olasılık, kesişimin B'nin olasılığına oranıdır (s.396).",
      fc: ["Koşullu olasılık formülü nedir?", "P(A∩B)/P(B)"]
    },
    {
      bi: 0,
      metin: "Bir torbadan top çekilip geri konmadan ikinci top çekildiğinde olaylar için hangisi doğrudur?",
      secenekler: ["Bağımlıdır, ikinci çekiliş ilkinden etkilenir", "Bağımsızdır, etkilenmez", "Her zaman 1/2 olur", "Tanımsız olur"],
      cozum: "Geri konmadan çekilişte örnek uzay değişir; olaylar bağımlıdır (s.394-397).",
      fc: ["Geri konmadan çekilişte olasılık değişir mi?", "Evet, bağımlı olur."]
    },
    {
      bi: 1,
      metin: "İçinde 5 beyaz, 3 siyah top olan torbadan geri konmadan iki top çekiliyor. İlk topun beyaz olduğu bilindiğinde ikincisinin de beyaz olma olasılığı kaçtır?",
      secenekler: ["4/7", "5/8", "4/8", "3/7"],
      cozum: "İlk beyaz çekildikten sonra 4 beyaz, 7 top kalır → 4/7 (s.394-397).",
      fc: ["İlk beyaz çekildiyse ikinci beyaz olasılığı kaçtır?", "4/7"]
    },
    {
      bi: 1,
      metin: "İki kez para atılıyor. En az birinin yazı olduğu bilindiğinde ikisinin de yazı olma olasılığı kaçtır?",
      secenekler: ["1/3", "1/4", "1/2", "2/3"],
      cozum: "En az bir yazı: {YY, YT, TY}; bunlardan YY → 1/3 (s.396-397).",
      fc: ["En az bir yazı bilindiğinde iki yazı olasılığı kaçtır?", "1/3"]
    },
    {
      bi: 1,
      metin: "Bir zar atılıyor. Gelen sayının tek olduğu bilindiğinde sayının 3'ten büyük olma olasılığı kaçtır?",
      secenekler: ["1/3", "2/3", "1/2", "1/6"],
      cozum: "Tek sayılar {1, 3, 5}; 3'ten büyük olan {5} → 1/3 (s.396-399).",
      fc: ["Tek bilindiğinde 3'ten büyük olma olasılığı kaçtır?", "1/3"]
    },
    {
      bi: 1,
      metin: "Bir fırıncı günde 200 buğday, 300 çavdar ekmeği üretiyor. Buğdayın 1/4'ünü, çavdarın 2/5'ini B marketine gönderiyor. Seçilen bir ekmeğin B marketine gideceği bilindiğine göre buğday ekmeği olma olasılığı kaçtır?",
      secenekler: ["5/17", "1/4", "2/5", "50/300"],
      cozum: "B'ye giden buğday 200·1/4 = 50, çavdar 300·2/5 = 120, toplam 170 → 50/170 = 5/17 (kitabın 3. örneği, s.396).",
      gorsel: {
        tip: "tablo",
        basliklar: ["Market", "Buğday", "Çavdar", "Toplam"],
        satirlar: [["B", "50", "120", "170"], ["A", "150", "180", "330"]]
      },
      fc: ["Fırıncı örneğinde P(buğday|B) kaçtır?", "5/17"]
    },
    {
      bi: 1,
      metin: "P(A ∩ B) = 0,12 ve P(B) = 0,4 ise P(A|B) kaçtır?",
      secenekler: ["0,3", "0,48", "0,12", "0,4"],
      cozum: "P(A|B) = 0,12/0,4 = 0,3 (s.396).",
      fc: ["P(A∩B)=0,12, P(B)=0,4 → P(A|B) kaçtır?", "0,3"]
    },
    {
      bi: 0,
      metin: "Bağımsız iki olay için P(A ∩ B) hangisine eşittir?",
      secenekler: ["P(A)·P(B)", "P(A) + P(B)", "P(A|B)", "P(A) − P(B)"],
      cozum: "Bağımsız olaylarda kesişimin olasılığı olasılıkların çarpımıdır; ayrıca P(A|B) = P(A) olur (s.404-406).",
      fc: ["Bağımsız olaylarda P(A∩B) kaçtır?", "P(A)·P(B)"]
    },
    {
      bi: 1,
      metin: "P(A) = 0,5 ve P(B) = 0,4 olan bağımsız olaylar için P(A ∩ B) kaçtır?",
      secenekler: ["0,2", "0,9", "0,1", "0,45"],
      cozum: "0,5·0,4 = 0,2 (s.404).",
      fc: ["Bağımsız A ve B için kesişim olasılığı kaçtır?", "0,2"]
    }
  ]
});

/* ------------------------------------------------------- 7.2 */
yazKonu({
  konu_id: "mat_10_u07_k02",
  ders: DERS, tema: 7, tema_adi: "Veriden Olasılığa",
  baslik: "7.2 Bayes Teoremi",
  kazanim: "Mevcut olasılıkları yeni verilerle güncelleyerek Bayes teoremiyle koşullu olasılık hesaplar.",
  kaynak: kaynak("404-408"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Bayes teoreminin mantığını açıklar.",
    "Bayes tipi problemlerde istenen koşullu olasılığı hesaplar."
  ],
  items: [
    {
      bi: 0,
      metin: "Bayes teoreminin temel mantığı nedir?",
      secenekler: ["Bir olayın olasılığını yeni verilerle güncellemek", "Olasılıkları toplamak", "Örneklem sayısını büyütmek", "Olayları bağımsız saymak"],
      cozum: "Kitaba göre Bayes teoremi, mevcut bilgiye dayalı olasılığın yeni verilerle güncellenmesini sağlar (s.404-406).",
      fc: ["Bayes teoremi ne yapar?", "Olasılığı yeni veriyle günceller."]
    },
    {
      bi: 0,
      metin: "Bir hastalığın toplumda görülme oranı %10, hastalık varken testin pozitif çıkma oranı %90, hastalık yokken pozitif çıkma oranı %20'dir. Testi pozitif çıkan bir kişinin gerçekten hasta olma olasılığı kaçtır?",
      secenekler: ["1/3", "9/10", "1/5", "9/20"],
      cozum: "100x kişide 10x hasta → 9x pozitif; 90x sağlıklı → 18x pozitif. P(hasta|pozitif) = 9x/27x = 1/3 (çilek alerjisi örneği, s.406).",
      gorsel: {
        tip: "tablo",
        basliklar: ["", "Hasta", "Hasta değil", "Toplam"],
        satirlar: [["Test pozitif", "9x", "18x", "27x"], ["Test negatif", "x", "72x", "73x"]]
      },
      fc: ["Pozitif testte gerçekten hasta olma olasılığı kaçtır?", "1/3"]
    },
    {
      bi: 1,
      metin: "Aynı örnekte 100x kişi içinde testi pozitif çıkan toplam kişi sayısı kaçtır?",
      secenekler: ["27x", "9x", "18x", "10x"],
      cozum: "9x hasta + 18x sağlıklı = 27x kişinin testi pozitiftir (s.406).",
      fc: ["Toplam pozitif test sayısı kaçtır?", "27x"]
    },
    {
      bi: 1,
      metin: "Aynı örnekte testi pozitif çıkan sağlıklı kişi sayısı kaçtır?",
      secenekler: ["18x", "9x", "27x", "90x"],
      cozum: "90x sağlıklı kişinin %20'si → 18x kişide yanlış pozitif vardır (s.406).",
      fc: ["Yanlış pozitif sayısı kaçtır?", "18x"]
    },
    {
      bi: 1,
      metin: "Aynı örnekte hastalığı olup testi negatif çıkan kişi sayısı kaçtır?",
      secenekler: ["x", "9x", "10x", "18x"],
      cozum: "Hasta 10x kişinin %90'ı pozitifse geriye 1x kişi kalır (s.406).",
      fc: ["Yalancı negatif sayısı kaçtır?", "x"]
    },
    {
      bi: 1,
      metin: "Türkiye'de böbrek taşı görülme sıklığı %15'tir. İdrar tahlili taşı olan bireylerde 4/5, olmayan bireylerde 2/17 oranında pozitif sonuç veriyor. Testi pozitif çıkan birinin böbreğinde taş olma olasılığı kaçtır?",
      secenekler: ["6/11", "4/5", "3/20", "12/85"],
      cozum: "100 kişide 15 hasta → 15·4/5 = 12; 85 sağlıklı → 85·2/17 = 10; toplam 22 pozitif → 12/22 = 6/11 (kitabın 1. alıştırması, s.408).",
      gorsel: {
        tip: "tablo",
        basliklar: ["", "Taş var", "Taş yok", "Toplam"],
        satirlar: [["Pozitif", "12", "10", "22"], ["Negatif", "3", "75", "78"]]
      },
      fc: ["P(taş|pozitif) kaçtır?", "6/11"]
    },
    {
      bi: 1,
      metin: "Aynı böbrek taşı sorusunda 100 kişide testi pozitif çıkan toplam kişi sayısı kaçtır?",
      secenekler: ["22", "12", "10", "15"],
      cozum: "12 + 10 = 22 kişinin testi pozitiftir (s.408).",
      fc: ["Toplam pozitif kaç kişidir?", "22"]
    },
    {
      bi: 1,
      metin: "Bir ambalaj atölyesinde 200 beyaz, 300 kırmızı, 240 siyah ve 260 mavi ambalaj vardır. Beyaz ve kırmızıların %5'i, siyah ve mavilerin %10'u hatalıdır. Seçilen ambalajın hatalı olduğu bilindiğine göre kırmızı olma olasılığı kaçtır?",
      secenekler: ["1/5", "1/4", "15/300", "3/13"],
      cozum: "Hatalılar: 10 + 15 + 24 + 26 = 75; kırmızı hatalı 15 → 15/75 = 1/5 (kitabın 6. örneği, s.405).",
      fc: ["P(kırmızı|hatalı) kaçtır?", "1/5"]
    },
    {
      bi: 1,
      metin: "Aynı ambalaj verisinde hatalı bir ambalajın mavi olma olasılığı kaçtır?",
      secenekler: ["26/75", "26/260", "1/10", "26/1000"],
      cozum: "Mavi hatalı 260·0,10 = 26; toplam hatalı 75 → 26/75 (s.405).",
      fc: ["Hatalı ambalajın mavi olma olasılığı kaçtır?", "26/75"]
    },
    {
      bi: 1,
      metin: "Aynı ambalaj verisinde toplam hatalı ambalaj sayısı kaçtır?",
      secenekler: ["75", "65", "70", "95"],
      cozum: "200·0,05 = 10; 300·0,05 = 15; 240·0,10 = 24; 260·0,10 = 26 → 75 (s.405).",
      fc: ["Toplam hatalı ambalaj kaçtır?", "75"]
    }
  ]
});
