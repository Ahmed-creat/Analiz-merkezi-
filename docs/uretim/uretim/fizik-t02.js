#!/usr/bin/env node
/* ============================================================
   FİZİK 10 · 1.1 + 2. ÜNİTE — kitaptan sıfırdan havuzlar
   ------------------------------------------------------------
   Kaynak: MEB Fizik 10 (2025), `kitap-kaynak` dalındaki fizik.json.
   Kitabın basılı sayfa numaraları kullanılır.

     1.1  Sabit Hızlı Hareket                       s.16-32
     2.1  A) Kuvvet-Yer Değiştirme Grafiği
          Kullanılarak İş Kavramının Tanımlanması   s.110-126
     2.1  B) İş, Enerji ve Güç Kavramları
          Arasındaki İlişki                         s.127-142
     2.2  Enerji Biçimleri                          s.143-153
     2.3  Mekanik Enerji                            s.154-170
     2.4  Enerji Kaynakları                         s.171-186

   Kullanım: node docs/uretim/uretim/fizik-t02.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Fizik";
const DOSYA = "fizik-10.pdf (MEB, 2025)";
const kaynak = s => "Fizik 10 ders kitabı, s." + s;

/* ------------------------------------------------------- 1.1 */
yazKonu({
  konu_id: "fizik_10_u01_k01",
  ders: DERS, tema: 1, tema_adi: "Kuvvet ve Hareket",
  baslik: "1.1 Sabit Hızlı Hareket",
  kazanim: "Sabit hızlı hareketi kavram olarak açıklar; konum, hız ve zaman ilişkilerini kullanır.",
  kaynak: kaynak("16-32"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Sabit hızlı hareketi ve ilgili kavramları açıklar.",
    "Sabit hızlı harekette hesap ve grafik yorumu yapar."
  ],
  items: [
    {
      bi: 0,
      metin: "Sabit süratli hareket nasıl tanımlanır?",
      secenekler: ["Eşit zaman aralıklarında eşit yol alma", "Eşit zaman aralıklarında artan yol alma", "Yönü sürekli değişen hareket", "Durmakta olan cismin hâli"],
      cozum: "Kitapta sabit sürat, bir cismin eşit zaman aralıklarında eşit yollar alması olarak tanımlanır (s.20).",
      fc: ["Sabit süratli hareketin tanımı nedir?", "Eşit zaman aralıklarında eşit yol alma."],
      gorsel: { tip: "sema", kutular: ["Eşit zaman aralıkları", "Eşit yol", "Sabit süratli hareket"], oklar: true },
    },
    {
      bi: 0,
      metin: "Sabit sürat ile sabit hız arasındaki fark nedir?",
      secenekler: ["Sabit hız yönü de kapsar", "Sabit sürat yönü de kapsar", "İkisi tamamen aynıdır", "Sabit hız skaler bir büyüklüktür"],
      cozum: "Kitaba göre sabit sürat yalnız büyüklüğü, sabit hız ise büyüklük ve yönü birlikte ifade eder (s.20).",
      fc: ["Sabit hız ile sabit sürat arasındaki fark nedir?", "Sabit hız yönü de kapsar; sürat skalerdir."],
      gorsel: { tip: "tablo", basliklar: ["Büyüklük", "Yön bilgisi"], satirlar: [["Sürat", "Yok"], ["Hız", "Var"]] },
    },
    {
      bi: 0,
      metin: "Sabit hızlı hareket eden bir cismin ivmesi kaçtır?",
      secenekler: ["0 m/s²", "Sabit ve sıfırdan farklı", "Sürekli artan", "Sürekli azalan"],
      cozum: "Hızın büyüklüğü ve yönü değişmediği için ivme sıfırdır (s.20).",
      fc: ["Sabit hızlı harekette ivme kaçtır?", "Sıfır."],
      gorsel: { tip: "grafik", xEkseni: "t (s)", yEkseni: "v (m/s)", seriler: [{ ad: "v", noktalar: [[0, 6], [2, 6], [4, 6]] }], izgara: true },
    },
    {
      bi: 0,
      metin: "Sabit hızlı hareketin konum-zaman grafiği nasıldır?",
      secenekler: ["Sabit eğimli bir doğru", "Parabol", "Yatay eksene paralel doğru", "Azalan bir eğri"],
      cozum: "Eşit zaman aralıklarında eşit yer değiştirme olduğundan x-t grafiği sabit eğimli doğrudur (s.21, s.30).",
      fc: ["Sabit hızlı harekette x-t grafiği nasıldır?", "Sabit eğimli doğru."],
      gorsel: { tip: "grafik", xEkseni: "t (s)", yEkseni: "x (m)", seriler: [{ ad: "x", noktalar: [[0, 0], [2, 10], [4, 20]] }], izgara: true },
    },
    {
      bi: 0,
      metin: "Hız-zaman grafiği zaman eksenine paralel olan cisim için hangisi doğrudur?",
      secenekler: ["Sabit hızlı hareket yapar", "Düzgün hızlanır", "Düzgün yavaşlar", "Durmaktadır"],
      cozum: "Hız değişmediği için cisim sabit hızlı hareket eder (s.20-21).",
      fc: ["c-t grafiği yatay olan cisim nasıl hareket eder?", "Sabit hızlı hareket eder."],
      gorsel: { tip: "grafik", xEkseni: "t (s)", yEkseni: "v (m/s)", seriler: [{ ad: "v", noktalar: [[0, 3], [4, 3]] }], izgara: true },
    },
    {
      bi: 1,
      metin: "Üretim bandındaki ürün birinci bantta 12 m'lik yolu 4 s'de alıyor. Hızının büyüklüğü kaç m/s'dir?",
      secenekler: ["3", "4", "12", "48"],
      cozum: "v = Δx/Δt = 12/4 = 3 m/s (kitaptaki bant örneği, s.21).",
      fc: ["12 m'yi 4 s'de alan ürünün hızı kaç m/s'dir?", "3 m/s"],
      gorsel: { tip: "tablo", basliklar: ["Yol (m)", "Süre (s)"], satirlar: [["12", "4"]] },
    },
    {
      bi: 1,
      metin: "Hız-zaman grafiği şekildeki gibi olan cisim 0-8 s aralığında kaç metre yer değiştirir?",
      secenekler: ["−48 m", "48 m", "−6 m", "−24 m"],
      cozum: "Grafikte hız 8 s boyunca −6 m/s sabittir. Yer değiştirme, grafiğin altındaki alandır: Δx = (−6)·8 = −48 m (s.21-22).",
      fc: ["v-t grafiğinde alan neyi verir?", "Yer değiştirmeyi."],
      gorsel: { tip: "grafik", xEkseni: "t (s)", yEkseni: "v (m/s)", seriler: [{ ad: "v", noktalar: [[0, -6], [4, -6], [8, -6]] }], izgara: true },
    },
    {
      bi: 1,
      metin: "Hastane içi taşıma robotu 720 m'lik koridoru 90 s'de geçiyor. Ortalama sürati kaç m/s'dir?",
      secenekler: ["8", "9", "0,125", "80"],
      cozum: "Ortalama sürat = toplam yol / toplam süre = 720/90 = 8 m/s (s.24).",
      fc: ["Ortalama sürat nasıl bulunur?", "Toplam yol / toplam süre."],
      gorsel: { tip: "tablo", basliklar: ["Yol (m)", "Süre (s)"], satirlar: [["720", "90"]] },
    },
    {
      bi: 1,
      metin: "Arasındaki uzaklık 480 m olan K ve L noktalarından 5 m/s ve 7 m/s süratlerle birbirine doğru hareket eden iki scooter kaç s sonra karşılaşır?",
      secenekler: ["40 s", "24 s", "60 s", "96 s"],
      cozum: "Yaklaşma hızı 5 + 7 = 12 m/s; 480/12 = 40 s (kitaptaki 1.4. soru, s.29).",
      fc: ["Karşılıklı yaklaşan cisimlerde karşılaşma süresi nasıl bulunur?", "Uzaklık / (hızların toplamı)."],
      gorsel: { tip: "sema", kutular: ["K · 5 m/s →", "← 7 m/s · L", "480 m"], oklar: true },
    },
    {
      bi: 1,
      metin: "Koşu bandında 120 s boyunca 3 m/s, sonraki 120 s boyunca 6 m/s hızla koşan sporcunun ortalama sürati kaç m/s'dir?",
      secenekler: ["4,5", "4", "5", "6"],
      cozum: "Yol = 3·120 + 6·120 = 1080 m; süre = 240 s; ortalama sürat = 1080/240 = 4,5 m/s (s.29).",
      fc: ["İki farklı hızla eşit süre hareket eden cismin ortalama sürati nasıl bulunur?", "Toplam yol / toplam süre."],
      gorsel: { tip: "grafik", xEkseni: "t (s)", yEkseni: "v (m/s)", seriler: [{ ad: "v", noktalar: [[0, 3], [120, 3], [120, 6], [240, 6]] }], izgara: true },
    }
  ]
});

/* ---------------------------------------------------- 2.1.1 */
yazKonu({
  konu_id: "fizik_10_u02_k01",
  ders: DERS, tema: 2, tema_adi: "Enerji",
  baslik: "2.1.1 Kuvvet-Yer Değiştirme Grafiği Kullanılarak İş Kavramının Tanımlanması",
  kazanim: "İş kavramını kuvvet-yer değiştirme grafiğinden yararlanarak açıklar.",
  kaynak: kaynak("110-126"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "İş kavramını, birimini ve koşullarını açıklar.",
    "Kuvvet-yer değiştirme grafiğinden işi hesaplar ve yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Fiziksel anlamda iş nasıl tanımlanır?",
      secenekler: ["Kuvvet ile kuvvet doğrultusundaki yer değiştirmenin çarpımı", "Kuvvet ile zamanın çarpımı", "Kütle ile hızın çarpımı", "Kuvvetin hıza oranı"],
      cozum: "Kitapta iş, bir cisme uygulanan kuvvet ile cismin kuvvet doğrultusundaki yer değiştirmesinin çarpımı olarak tanımlanır: W = F·Δx (s.116).",
      fc: ["İşin matematiksel modeli nedir?", "W = F·Δx"]
    },
    {
      bi: 0,
      metin: "İşin SI'daki birimi nedir?",
      secenekler: ["Joule", "Newton", "Watt", "Pascal"],
      cozum: "İşin birimi N·m olup joule (J) olarak adlandırılır (s.116).",
      fc: ["İşin birimi nedir?", "Joule (J) = N·m"]
    },
    {
      bi: 0,
      metin: "1 N·m kaç joule'e eşittir?",
      secenekler: ["1", "10", "0,5", "9,8"],
      cozum: "1 N büyüklüğünde kuvvetle 1 m yer değiştirmede 1 J iş yapılır: 1 N·m = 1 J (s.116).",
      fc: ["1 N·m kaç joule'dür?", "1 J"]
    },
    {
      bi: 0,
      metin: "İş nasıl bir büyüklüktür?",
      secenekler: ["Skaler", "Vektörel", "Türetilmemiş", "Birimsiz"],
      cozum: "Kitapta işin skaler bir büyüklük olduğu ve W ile gösterildiği belirtilir (s.116).",
      fc: ["İş skaler mi vektörel mi?", "Skaler."]
    },
    {
      bi: 0,
      metin: "Kuvvet uygulanan cisim kuvvet doğrultusunda yer değiştirmezse yapılan iş kaç joule'dür?",
      secenekler: ["Sıfır", "Kuvvete eşit", "Sonsuz", "Negatif"],
      cozum: "İş için kuvvet doğrultusunda yer değiştirme gerekir; yer değiştirme yoksa iş sıfırdır (s.116).",
      fc: ["Yer değiştirme yoksa iş kaçtır?", "Sıfır."]
    },
    {
      bi: 1,
      metin: "Bir cisme 20 N'luk kuvvet, kuvvet doğrultusunda 3 m boyunca etki ediyor. Yapılan iş kaç J'dür?",
      secenekler: ["60", "20", "23", "6,7"],
      cozum: "W = F·Δx = 20·3 = 60 J (s.116'daki model).",
      fc: ["20 N kuvvet 3 m yol boyunca kaç J iş yapar?", "60 J"]
    },
    {
      bi: 1,
      metin: "Kuvvet-yer değiştirme grafiğinde grafik doğrusu ile yatay eksen arasında kalan alan neyi verir?",
      secenekler: ["Yapılan işi", "Gücü", "İvmeyi", "Kütleyi"],
      cozum: "Kitapta yapılan işin F-x grafiğinin altında kalan alandan bulunduğu belirtilir (s.117).",
      fc: ["F-x grafiğinde alan neyi verir?", "Yapılan işi."]
    },
    {
      bi: 1,
      metin: "Sabit 40 N'luk kuvvet, cisim 10 m yer değiştirirken etki ediyor. Grafikteki dikdörtgenin alanı kaç J'dür?",
      secenekler: ["400", "40", "4", "200"],
      cozum: "Alan = 40 N · 10 m = 400 J (s.117'deki alan yöntemi).",
      fc: ["40 N ve 10 m için grafik alanı kaç J'dür?", "400 J"]
    },
    {
      bi: 1,
      metin: "Cismin yer değiştirmesine ters yönde etki eden sürtünme kuvvetinin yaptığı iş için hangisi doğrudur?",
      secenekler: ["Negatiftir", "Pozitiftir", "Sıfırdır", "Belirsizdir"],
      cozum: "Ters yönde etki eden kuvvet negatif iş yapar; sürtünme buna örnektir (s.117-118).",
      fc: ["Sürtünme kuvvetinin yaptığı iş neden negatiftir?", "Yer değiştirmeye ters yönde etki eder."]
    },
    {
      bi: 1,
      metin: "Bir kuvvetin yaptığı iş, cismin izlediği yolun şekline göre nasıldır?",
      secenekler: ["Yolun şekline bağlı değildir", "Uzun yolda daha büyüktür", "Kısa yolda daha büyüktür", "Her yolda sıfırdır"],
      cozum: "Kitapta kuvvetin yaptığı işin yolun şeklinden bağımsız olduğu, üç farklı yolda da işin eşit çıktığı gösterilir (s.118).",
      fc: ["İş yolun şekline bağlı mıdır?", "Bağlı değildir."]
    }
  ]
});

/* ---------------------------------------------------- 2.1.2 */
yazKonu({
  konu_id: "fizik_10_u02_k05",
  ders: DERS, tema: 2, tema_adi: "Enerji",
  baslik: "2.1.2 İş, Enerji ve Güç Kavramları Arasındaki İlişki",
  kazanim: "İş, enerji ve güç kavramları arasındaki ilişkiyi kullanarak hesaplama yapar.",
  kaynak: kaynak("127-142"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "İş, enerji ve güç arasındaki ilişkiyi açıklar.",
    "İş ve güç hesaplamalarını yapar."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir cisim üzerinde net kuvvetin yaptığı iş neye eşittir?",
      secenekler: ["Cismin enerji değişimine", "Cismin momentumuna", "Cismin kütlesine", "Cismin ivmesine"],
      cozum: "Kitapta pozitif işin cismin kazandığı enerjiye, negatif işin kaybettiği enerjiye eşit olduğu belirtilir (s.133).",
      fc: ["Net kuvvetin yaptığı iş neye eşittir?", "Enerji değişimine."]
    },
    {
      bi: 0,
      metin: "Güç nasıl tanımlanır?",
      secenekler: ["Birim zamanda yapılan iş", "Birim yolda yapılan iş", "Kuvvet ile zamanın çarpımı", "Enerji ile sürenin çarpımı"],
      cozum: "Kitapta güç, birim zamanda yapılan iş olarak tanımlanır: P = W/t (s.135).",
      fc: ["Gücün matematiksel modeli nedir?", "P = W/t"]
    },
    {
      bi: 0,
      metin: "Gücün SI'daki birimi nedir?",
      secenekler: ["Watt", "Joule", "Newton", "Joule·saniye"],
      cozum: "Güç birimi joule/saniye olup watt (W) olarak adlandırılır (s.135).",
      fc: ["Gücün birimi nedir?", "Watt (W) = J/s"]
    },
    {
      bi: 0,
      metin: "1 kW kaç watt'a eşittir?",
      secenekler: ["1000", "100", "10", "3600"],
      cozum: "1 kW = 1000 W'dır; araç ruhsatındaki 62,5 kW = 62.500 W (s.134-135).",
      fc: ["1 kW kaç watt'tır?", "1000 W"]
    },
    {
      bi: 0,
      metin: "Pozitif iş yapılan bir cisim için hangisi doğrudur?",
      secenekler: ["Enerjisi artar", "Enerjisi azalır", "Enerjisi değişmez", "Durmak zorundadır"],
      cozum: "Kitaba göre pozitif iş cismin kazandığı enerjiyi ifade eder (s.133).",
      fc: ["Pozitif iş cismin enerjisini nasıl etkiler?", "Artırır."]
    },
    {
      bi: 1,
      metin: "Bir kişi 60 s'de 7200 J'lük iş yapıyor. Gücü kaç W'dır?",
      secenekler: ["120", "720", "60", "432"],
      cozum: "P = W/t = 7200/60 = 120 W (kitaptaki Kaan örneği, s.135).",
      fc: ["60 s'de 7200 J iş yapan kişinin gücü kaç W'dır?", "120 W"]
    },
    {
      bi: 1,
      metin: "Motor gücü 62,5 kW olan bir aracın 1 s'de harcadığı enerji kaç J'dür?",
      secenekler: ["62.500", "6.250", "62,5", "625.000"],
      cozum: "P = 62,5 kW = 62.500 W; 1 s'de 62.500 J enerji harcanır (ruhsat örneği, s.134).",
      fc: ["62,5 kW gücündeki motor 1 s'de kaç J harcar?", "62.500 J"]
    },
    {
      bi: 1,
      metin: "5 tonluk yükü 3 m yükseğe 20 s'de kaldıran çatal kaldıracın gücü kaç kW'tır? (g = 10 m/s², sürtünme ihmal)",
      secenekler: ["7,5", "75", "0,75", "15"],
      cozum: "W = m·g·h = 5000·10·3 = 150.000 J; P = 150.000/20 = 7500 W = 7,5 kW (kitaptaki 2.4. soru, s.135).",
      fc: ["5 tonu 3 m'ye 20 s'de kaldıran aracın gücü kaç kW'tır?", "7,5 kW"]
    },
    {
      bi: 1,
      metin: "2 m yer değiştiren koliye 14 N itme kuvveti ve 6 N sürtünme kuvveti etki ediyor. Net kuvvetin yaptığı iş kaç J'dür?",
      secenekler: ["16", "28", "12", "40"],
      cozum: "W_net = (14 − 6)·2 = 16 J; itmenin işi 28 J, sürtünmenin işi −12 J'dür (s.136).",
      fc: ["14 N itme ve 6 N sürtünme ile 2 m'de net iş kaç J'dür?", "16 J"]
    },
    {
      bi: 1,
      metin: "Gücü 80 W olan motor, 10 kg'lık yükü 10 s'de kaç m yükseğe çıkarır? (g = 10 m/s², sürtünme ihmal)",
      secenekler: ["8", "10", "80", "0,8"],
      cozum: "W = P·t = 80·10 = 800 J; h = W/(m·g) = 800/100 = 8 m (kitaptaki 2.5. soru, s.136).",
      fc: ["80 W motor 10 kg yükü 10 s'de kaç m'ye çıkarır?", "8 m"]
    }
  ]
});

/* ------------------------------------------------------- 2.2 */
yazKonu({
  konu_id: "fizik_10_u02_k02",
  ders: DERS, tema: 2, tema_adi: "Enerji",
  baslik: "2.2 Enerji Biçimleri",
  kazanim: "Enerji biçimlerini tanır ve enerji dönüşümlerini açıklar.",
  kaynak: kaynak("143-153"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Enerji biçimlerini tanır ve ayırt eder.",
    "Günlük hayattaki enerji dönüşümlerini açıklar."
  ],
  items: [
    {
      bi: 0,
      metin: "Pil ve aküde depolanan enerji hangi biçimdedir?",
      secenekler: ["Kimyasal enerji", "Nükleer enerji", "Mekanik enerji", "Işık enerjisi"],
      cozum: "Kitapta pil ve akülere depolanan enerjinin kimyasal enerji olduğu belirtilir (s.146).",
      fc: ["Pilde hangi enerji depolanır?", "Kimyasal enerji."]
    },
    {
      bi: 0,
      metin: "Atom çekirdeklerinin birleşmesi veya bölünmesiyle açığa çıkan enerji hangisidir?",
      secenekler: ["Nükleer enerji", "Kimyasal enerji", "Ses enerjisi", "Esneklik potansiyel enerjisi"],
      cozum: "Nükleer enerji atom çekirdeğinden elde edilir; Güneş'te hafif çekirdekler birleşir, santrallerde ağır çekirdekler bölünür (s.146).",
      fc: ["Nükleer enerji nereden elde edilir?", "Atom çekirdeğinden."]
    },
    {
      bi: 0,
      metin: "Işığın enerjiyi taşıyan parçacıklarına ne denir?",
      secenekler: ["Foton", "Elektron", "Proton", "Nötron"],
      cozum: "Kitaba göre ışık enerjisi foton adı verilen parçacıklarla taşınır (s.147).",
      fc: ["Işık enerjisini taşıyan parçacık nedir?", "Foton."]
    },
    {
      bi: 0,
      metin: "Bir cismin hareketinden ve konumundan dolayı sahip olduğu enerji hangisidir?",
      secenekler: ["Mekanik enerji", "Kimyasal enerji", "Nükleer enerji", "Işık enerjisi"],
      cozum: "Mekanik enerji, kinetik ve potansiyel enerjilerin toplamıdır (s.145).",
      fc: ["Mekanik enerji hangi enerjilerden oluşur?", "Kinetik + potansiyel."]
    },
    {
      bi: 0,
      metin: "İnsan gözünün algılayabildiği ışık, elektromanyetik spektrumda hangi dalga boyu aralığındadır?",
      secenekler: ["300-700 nanometre", "3-7 nanometre", "3000-7000 nanometre", "30-70 nanometre"],
      cozum: "Kitapta 300-700 nanometre aralığındaki dalgaların insan gözüyle algılandığı yazılıdır (s.147).",
      fc: ["Görünür ışığın dalga boyu aralığı nedir?", "300-700 nm"]
    },
    {
      bi: 1,
      metin: "Vantilatörde elektrik enerjisi öncelikle hangi enerji biçimine dönüşür?",
      secenekler: ["Mekanik (hareket) enerjisi", "Kimyasal enerji", "Nükleer enerji", "Potansiyel enerji"],
      cozum: "Vantilatör havayı hareket ettirdiği için elektrik enerjisi mekanik enerjiye dönüşür (s.145).",
      fc: ["Vantilatörde hangi dönüşüm olur?", "Elektrik → mekanik (hareket)."]
    },
    {
      bi: 1,
      metin: "El fenerinde pilin kimyasal enerjisi hangi enerji biçimine dönüşerek ortamı aydınlatır?",
      secenekler: ["Işık enerjisi", "Ses enerjisi", "Nükleer enerji", "Esneklik enerjisi"],
      cozum: "Kitapta el fenerindeki kimyasal enerjinin ışık enerjisine dönüştüğü örneği verilir (s.146).",
      fc: ["El fenerinde kimyasal enerji neye dönüşür?", "Işık enerjisine."]
    },
    {
      bi: 1,
      metin: "Hidroelektrik santralde yüksekten düşen suyun türbini döndürmesi sırasında hangi enerji oluşur?",
      secenekler: ["Kinetik (mekanik) enerji", "Kimyasal enerji", "Nükleer enerji", "Işık enerjisi"],
      cozum: "Suyun potansiyel enerjisi hareketiyle kinetik enerjiye dönüşür ve türbin döner (s.145).",
      fc: ["Barajda suyun potansiyel enerjisi neye dönüşür?", "Kinetik enerjiye."]
    },
    {
      bi: 1,
      metin: "Barajda biriken suyun sahip olduğu enerji hangisidir?",
      secenekler: ["Yer çekimi potansiyel enerjisi", "Kinetik enerji", "Kimyasal enerji", "Ses enerjisi"],
      cozum: "Yükseklikte duran su konumu nedeniyle potansiyel enerjiye sahiptir (s.145, s.158).",
      fc: ["Barajdaki su hangi enerjiye sahiptir?", "Potansiyel enerji."]
    },
    {
      bi: 1,
      metin: "Uzun süre çalışan vantilatörde kaybolan enerji ağırlıklı olarak hangi biçime dönüşür?",
      secenekler: ["Isı", "Nükleer enerji", "Kimyasal enerji", "Işık enerjisi"],
      cozum: "Kitapta sürtünmeler nedeniyle enerjinin bir kısmının ısıya dönüştüğü belirtilir (s.149).",
      fc: ["Cihazlarda kayıp enerji hangi biçime dönüşür?", "Isıya."]
    }
  ]
});

/* ------------------------------------------------------- 2.3 */
yazKonu({
  konu_id: "fizik_10_u02_k03",
  ders: DERS, tema: 2, tema_adi: "Enerji",
  baslik: "2.3 Mekanik Enerji",
  kazanim: "Kinetik ve potansiyel enerjiyi hesaplar; mekanik enerjinin korunumunu açıklar.",
  kaynak: kaynak("154-170"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Mekanik enerjinin bileşenlerini ve korunumunu açıklar.",
    "Kinetik ve potansiyel enerji hesaplar."
  ],
  items: [
    {
      bi: 0,
      metin: "Mekanik enerji hangi iki enerjinin toplamıdır?",
      secenekler: ["Kinetik ve potansiyel enerji", "Kimyasal ve ısı enerjisi", "Nükleer ve ışık enerjisi", "Ses ve elektrik enerjisi"],
      cozum: "Kitapta mekanik enerji EM = EK + EP olarak verilir (s.158).",
      fc: ["Mekanik enerjinin modeli nedir?", "EM = EK + EP"]
    },
    {
      bi: 0,
      metin: "Yer çekimi potansiyel enerjisi hangi modelle hesaplanır?",
      secenekler: ["EP = m·g·h", "EP = ½·m·v²", "EP = m·v", "EP = F/t"],
      cozum: "Kitapta EP = m·g·h modeli verilir (s.158, s.170).",
      fc: ["Potansiyel enerji modeli nedir?", "EP = m·g·h"]
    },
    {
      bi: 0,
      metin: "Kinetik enerji hangi modelle hesaplanır?",
      secenekler: ["EK = ½·m·v²", "EK = m·g·h", "EK = m·v", "EK = F·Δx"],
      cozum: "Kitapta kinetik enerji EK = ½·m·v² olarak verilir (s.168).",
      fc: ["Kinetik enerji modeli nedir?", "EK = ½·m·v²"]
    },
    {
      bi: 0,
      metin: "İş ile kinetik enerji arasındaki ilişki nedir?",
      secenekler: ["Net kuvvetin işi kinetik enerji değişimine eşittir", "İş kinetik enerjinin yarısıdır", "İkisi bağımsızdır", "İş kinetik enerjiyle çarpılır"],
      cozum: "İş-kinetik enerji teoremine göre W_net = ΔEK'dir (s.164).",
      fc: ["İş-kinetik enerji teoremi ne der?", "W_net = ΔEK"]
    },
    {
      bi: 0,
      metin: "Sürtünmesiz ortamda düşen cismin mekanik enerjisi nasıl değişir?",
      secenekler: ["Değişmez, korunur", "Sürekli artar", "Sürekli azalır", "Sıfır olur"],
      cozum: "Enerji kaybı olmadığından potansiyel enerji kinetiğe dönüşür, toplam sabit kalır (s.168-169).",
      fc: ["Sürtünmesiz düşmede mekanik enerji korunur mu?", "Evet, korunur."]
    },
    {
      bi: 1,
      metin: "4 kg kütleli cismin yerden 5 m yükseklikteki potansiyel enerjisi kaç J'dür? (g = 10 m/s²)",
      secenekler: ["200", "20", "100", "50"],
      cozum: "EP = m·g·h = 4·10·5 = 200 J (kitaptaki koli örneği, s.168).",
      fc: ["4 kg, 5 m yükseklikte kaç J potansiyel enerji vardır?", "200 J"]
    },
    {
      bi: 1,
      metin: "2 kg kütleli cisim 10 m/s hızla hareket ediyor. Kinetik enerjisi kaç J'dür?",
      secenekler: ["100", "20", "200", "10"],
      cozum: "EK = ½·m·v² = ½·2·100 = 100 J (s.168'deki model).",
      fc: ["2 kg, 10 m/s için kinetik enerji kaç J'dür?", "100 J"]
    },
    {
      bi: 1,
      metin: "Sürtünmesiz ortamda 5 m yükseklikten serbest bırakılan 4 kg'lık cismin yere çarpma hızı kaç m/s'dir? (g = 10 m/s²)",
      secenekler: ["10", "5", "20", "50"],
      cozum: "m·g·h = ½·m·v² → 4·10·5 = ½·4·v² → v² = 100 → v = 10 m/s (s.168).",
      fc: ["5 m'den düşen cismin hızı kaç m/s'dir? (g=10)", "10 m/s"]
    },
    {
      bi: 1,
      metin: "Sürtünmeli yüzeyde kayan cismin mekanik enerjisi için hangisi doğrudur?",
      secenekler: ["Bir kısmı ısıya dönüştüğü için azalır", "Korunur", "Artar", "Değişmez ve ısı oluşmaz"],
      cozum: "Sürtünme kuvveti negatif iş yapar; mekanik enerjinin bir kısmı ısıya dönüşür (s.168).",
      fc: ["Sürtünmeli harekette mekanik enerji neden azalır?", "Bir kısmı ısıya dönüşür."]
    },
    {
      bi: 1,
      metin: "Yayın denge konumundan uzaklaştırılmasıyla yayda depolanan enerji hangisidir?",
      secenekler: ["Esneklik potansiyel enerjisi", "Kinetik enerji", "Kimyasal enerji", "Nükleer enerji"],
      cozum: "Esnek cisimlerin sıkıştırılması veya gerilmesiyle esneklik potansiyel enerjisi depolanır (s.162-163).",
      fc: ["Gerilmiş yayda hangi enerji depolanır?", "Esneklik potansiyel enerjisi."]
    }
  ]
});

/* ------------------------------------------------------- 2.4 */
yazKonu({
  konu_id: "fizik_10_u02_k04",
  ders: DERS, tema: 2, tema_adi: "Enerji",
  baslik: "2.4 Enerji Kaynakları",
  kazanim: "Enerji kaynaklarını sınıflandırır; sürdürülebilirlik ve verim açısından karşılaştırır.",
  kaynak: kaynak("171-186"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Enerji kaynaklarını yenilenebilirlik ölçütüne göre sınıflandırır.",
    "Kaynakların çevresel etkisini ve verimini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Aşağıdakilerden hangisi yenilenemeyen bir enerji kaynağıdır?",
      secenekler: ["Kömür", "Güneş", "Rüzgâr", "Jeotermal"],
      cozum: "Kömür, fosil (mineral) yakıt olup tükenme hızı oluşum hızından çok fazladır (s.172-173).",
      fc: ["Kömür yenilenebilir mi?", "Hayır, yenilenemeyen fosil yakıttır."]
    },
    {
      bi: 0,
      metin: "Aşağıdakilerden hangisi yenilenebilir bir enerji kaynağıdır?",
      secenekler: ["Rüzgâr", "Doğal gaz", "Petrol", "Kömür"],
      cozum: "Rüzgâr sürekli devam eden doğal süreçlerden elde edilen yenilenebilir kaynaktır (s.172).",
      fc: ["Rüzgâr yenilenebilir mi?", "Evet."]
    },
    {
      bi: 0,
      metin: "Sürdürülebilir enerji nasıl tanımlanır?",
      secenekler: ["Doğanın dengesini koruyan, yenilenebilen kaynaklardan elde edilen enerji", "En pahalı kaynaktan üretilen enerji", "Yalnız fosil yakıtlardan elde edilen enerji", "Depolanamayan enerji"],
      cozum: "Kitapta sürdürülebilir enerji, doğanın dengesini koruyan ve yenilenebilen kaynaklardan elde edilen enerji olarak tanımlanır (s.172).",
      fc: ["Sürdürülebilir enerji nedir?", "Doğaya zarar vermeyen, yenilenebilen kaynaklardan elde edilen enerji."]
    },
    {
      bi: 0,
      metin: "Nükleer enerji neden yenilenemeyen kaynaklar arasında sayılır?",
      secenekler: ["Yakıtı olan uranyum tükenmektedir", "Sera gazı saldığı için", "Depolanamadığı için", "Su tükettiği için"],
      cozum: "Kitapta yenilenemeyen kaynaklar fosil yakıtlar ve nükleer enerji olarak verilir; nükleer yakıt rezervi sınırlıdır (s.172-174).",
      fc: ["Nükleer enerji neden yenilenemez sayılır?", "Uranyum rezervi tükeniyor."]
    },
    {
      bi: 0,
      metin: "Enerji sınıfı etiketinde en yüksek verim hangi harfle gösterilir?",
      secenekler: ["A", "G", "E", "C"],
      cozum: "Kitaba göre en yüksek verim A harfiyle gösterilir; G'ye gidildikçe verim azalır (s.183).",
      fc: ["Enerji etiketinde en verimli sınıf hangisidir?", "A sınıfı."]
    },
    {
      bi: 1,
      metin: "Kitaba göre 1 kg uranyumdan elde edilebilen elektrik enerjisi yaklaşık kaç kWh'tir?",
      secenekler: ["50.000", "4,5", "3", "500"],
      cozum: "Kitapta 1 kg kömürden 3 kWh, 1 kg petrolden 4,5 kWh, 1 kg uranyumdan 50.000 kWh elektrik elde edildiği yazılıdır (s.174).",
      fc: ["1 kg uranyumdan kaç kWh elektrik elde edilir?", "Yaklaşık 50.000 kWh"]
    },
    {
      bi: 1,
      metin: "1 kg petrol ve 1 kg kömürden elde edilen elektrik enerjisi sırasıyla kaç kWh'tir?",
      secenekler: ["4,5 ve 3", "3 ve 4,5", "50 ve 45", "45 ve 30"],
      cozum: "Kitapta 1 kg kömürden 3 kWh, 1 kg petrolden 4,5 kWh elektrik elde edildiği belirtilir (s.174).",
      fc: ["1 kg petrol ve 1 kg kömür kaç kWh verir?", "4,5 kWh ve 3 kWh"]
    },
    {
      bi: 1,
      metin: "Nükleer santrallerin havayı en az kirleten santraller arasında sayılmasının nedeni nedir?",
      secenekler: ["İşletmede sera gazı emisyonu oluşturmaması", "Kömür kullanmaları", "Hiç atık üretmemeleri", "Su tüketmemeleri"],
      cozum: "Kitapta nükleer santrallerin işletim sırasında sera gazı emisyonuna neden olmadığı, radyoaktif atıkların denetimli saklanmasının önemli olduğu belirtilir (s.174).",
      fc: ["Nükleer santral sera gazı salar mı?", "İşletmede salmaz; radyoaktif atık sorunu vardır."]
    },
    {
      bi: 1,
      metin: "Güneş ışığını doğrudan elektrik enerjisine dönüştüren sistemlere ne denir?",
      secenekler: ["Fotovoltaik sistem", "Jeneratör", "Türbin", "Reaktör"],
      cozum: "Güneş panelleri fotovoltaik sistem olarak adlandırılır (s.176).",
      fc: ["Güneş paneli sisteminin adı nedir?", "Fotovoltaik sistem."]
    },
    {
      bi: 1,
      metin: "2023 verilerine göre Türkiye'de elektrik üretiminin yaklaşık yüzde kaçı fosil yakıtlardan sağlanmıştır?",
      secenekler: ["%57,7", "%27,5", "%75,7", "%5,7"],
      cozum: "Enerji ve Tabii Kaynaklar Bakanlığının 2023 verilerine göre bu oran %57,7'dir (s.173).",
      fc: ["2023'te Türkiye elektriğinin yüzde kaçı fosil yakıttan?", "%57,7"]
    }
  ]
});
