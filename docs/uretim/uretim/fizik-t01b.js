#!/usr/bin/env node
/* ============================================================
   FİZİK 10 · 1. ÜNİTE — kitaptaki ALT KONULARA göre yeni havuzlar
   ------------------------------------------------------------
   KAYNAK: MEB Fizik 10 ders kitabı (2025). Metin, `kitap-kaynak`
   dalındaki fizik.json dosyasından okundu (353 sayfa, kitabın
   kendi sayfa numaraları kullanıldı).

   Kitabın 1. ünite yapısı (içindekiler, s.7):
     1.1. Sabit Hızlı Hareket                              s.16
     1.2. Bir Boyutta Sabit İvmeli Hareket                 s.33
        A) İvme ve Hız Değişimi Arasındaki İlişki          s.33
        B) Yatay Doğrultuda Sabit İvmeyle Hareket Eden
           Cisimlerin Hareketi                             s.43
     1.3. Serbest Düşme                                    s.60
        A) Düşey Doğrultuda Cisimlerin Sahip Olduğu İvme   s.60
        B) Serbest Düşme Hareketi                          s.67
     1.4. İki Boyutta Sabit İvmeli Hareket                 s.78

   Bu dosya 1.2.1, 1.2.2, 1.3.1, 1.3.2 ve 1.4 havuzlarını üretir.
   1.1 havuzu ayrı dosyada; 1.2, 1.3 ve 1.4'ün ESKİ tek konulu
   havuzları arşive taşınır (silinmez).

   Kullanım: node docs/uretim/uretim/fizik-t01b.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Fizik";
const DOSYA = "fizik-10.pdf (MEB, 2025)";
const TEMA_ADI = "Kuvvet ve Hareket";
const kaynak = s => "Fizik 10 ders kitabı, s." + s;

/* ------------------------------------------------ 1.2.1 İVME */
yazKonu({
  konu_id: "fizik_10_u01_k05",
  ders: DERS,
  tema: 1,
  tema_adi: TEMA_ADI,
  baslik: "1.2.1 İvme ve Hız Değişimi Arasındaki İlişki",
  kazanim: "İvme ile hız değişimi arasındaki ilişkiyi açıklar.",
  kaynak: kaynak("33-42"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Hız değişimi ve ivmeyi matematiksel modelle hesaplar.",
    "İvmenin yönünü ve işaretini hareket türüne göre yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir hareketlinin hız değişimi hangi modelle hesaplanır?",
      secenekler: ["Δv = v₂ − v₁", "Δv = v₁ − v₂", "Δv = v₂ · v₁", "Δv = v₂ / v₁"],
      cozum: "Kitapta hız değişimi Δv = v_son − v_ilk modeliyle verilir (s.34).",
      fc: ["Hız değişiminin modeli nedir?", "Δv = v_son − v_ilk"]
    },
    {
      bi: 0,
      metin: "İvme hangi matematiksel modelle ifade edilir?",
      secenekler: ["a = Δv / Δt", "a = Δt / Δv", "a = Δv · Δt", "a = Δv + Δt"],
      cozum: "Kitapta ivme, hız değişiminin zamana oranı olarak a = Δv/Δt modeliyle verilir (s.36).",
      fc: ["İvmenin matematiksel modeli nedir?", "a = Δv/Δt"]
    },
    {
      bi: 0,
      metin: "Her 1 s'de hızı 5 m/s artan bir aracın ivmesinin büyüklüğü kaç m/s²'dir?",
      secenekler: ["5", "1", "0,2", "10"],
      cozum: "Kitaptaki örnekte her 1 s'de 5 m/s hızlanan aracın ivmesi 5 m/s² bulunur (s.36).",
      fc: ["Her saniye 5 m/s hızlanan aracın ivmesi kaçtır?", "5 m/s²"]
    },
    {
      bi: 0,
      metin: "Durmakta olan bir metro 4 m/s² büyüklüğünde sabit ivmeyle hızlanıyor. Metro 6. s'de kaç m/s hıza ulaşır?",
      secenekler: ["24 m/s", "10 m/s", "18 m/s", "30 m/s"],
      cozum: "Her saniye 4 m/s artan hız 6 s'de 24 m/s olur; kitaptaki çözümde v = 4 · 6 = 24 m/s bulunur (s.36).",
      fc: ["4 m/s² ivmeyle 6 s'de ulaşılan hız kaçtır?", "24 m/s"]
    },
    {
      bi: 0,
      metin: "Hız-zaman tablosu 0, 6, 12, 18, 18, 12 m/s olan bir teslimat motosikletinin (3-4) s aralığındaki ivmesi kaç m/s²'dir?",
      secenekler: ["0", "6", "−6", "18"],
      cozum: "Kitaptaki çözümde hız değişmediği için a = (18 − 18)/1 = 0 bulunur (s.37).",
      fc: ["Hızı değişmeyen aracın ivmesi kaçtır?", "Sıfır."]
    },
    {
      bi: 0,
      metin: "Aynı aracın (4-5) s aralığındaki ivmesi kaç m/s²'dir? (Hız 18 m/s'den 12 m/s'ye düşüyor.)",
      secenekler: ["−6", "6", "−12", "0"],
      cozum: "a = (12 − 18)/1 = −6 m/s²; hız azaldığı için ivme negatiftir (s.37).",
      fc: ["Hızı 18'den 12'ye düşen aracın ivmesi kaçtır?", "−6 m/s²"]
    },
    {
      bi: 1,
      metin: "Cisme hareket yönüyle aynı doğrultuda kuvvet uygulandığında ivme için hangisi doğrudur?",
      secenekler: ["Yönü hareket yönüyle aynı, işareti pozitif", "Yönü hareket yönüne zıt, işareti negatif", "Büyüklüğü sıfırdır", "Yönü değişmez, işareti negatiftir"],
      cozum: "Kitapta hız artarken ivmenin yönünün hareket yönüyle aynı ve pozitif olduğu belirtilir (s.36).",
      fc: ["Hızlanan cisimde ivmenin işareti nedir?", "Pozitif (hareket yönüyle aynı)."]
    },
    {
      bi: 1,
      metin: "Hareket yönüne ters yönde kuvvet uygulanan cisim için hangisi doğrudur?",
      secenekler: ["Hızı azalır, ivmesi negatiftir", "Hızı artar, ivmesi pozitiftir", "Hızı sabit kalır", "İvmesi sıfırdır"],
      cozum: "Kitapta ters yönde kuvvette hızın azaldığı, ivmenin hareket yönüne zıt ve negatif olduğu yazılıdır (s.36).",
      fc: ["Yavaşlayan cisimde ivmenin işareti nedir?", "Negatif (hareket yönüne zıt)."]
    },
    {
      bi: 1,
      metin: "Bir aracın ivmesinin büyüklüğünün sabit olması ne anlama gelir?",
      secenekler: ["Eşit zaman aralıklarında hızı eşit miktarda değişir", "Hızı hiç değişmez", "Hızı giderek daha çok artar", "Yer değiştirmesi sabittir"],
      cozum: "Kitaba göre hız eşit zaman aralıklarında aynı büyüklükte artıyor ya da azalıyorsa ivme sabittir (s.36).",
      fc: ["Sabit ivme ne demektir?", "Eşit zaman aralıklarında eşit hız değişimi."]
    },
    {
      bi: 1,
      metin: "İlk hızı 10 m/s, ivmesi −2 m/s² olan bir araç 3 s sonra kaç m/s hıza sahip olur?",
      secenekler: ["4 m/s", "16 m/s", "6 m/s", "−6 m/s"],
      cozum: "Kitaptaki 1.9. soruda L aracı için son hız 10 + (−2)·3 = 4 m/s bulunur (s.40).",
      fc: ["10 m/s hızla giden araç −2 m/s² ile 3 s'de kaç m/s olur?", "4 m/s"]
    }
  ]
});

/* --------------------------------------- 1.2.2 YATAY DOĞRULTUDA */
yazKonu({
  konu_id: "fizik_10_u01_k06",
  ders: DERS,
  tema: 1,
  tema_adi: TEMA_ADI,
  baslik: "1.2.2 Yatay Doğrultuda Sabit İvmeyle Hareket Eden Cisimlerin Hareketi",
  kazanim: "Yatay doğrultuda sabit ivmeli hareketin modellerini ve grafiklerini kullanır.",
  kaynak: kaynak("43-59"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Yatay doğrultuda sabit ivmeli hareketin modellerini kullanarak hesap yapar.",
    "Hareket grafiklerini çizer ve yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "İlk hızı v₀ olan, sabit a ivmesiyle hızlanan cismin hızı hangi modelle bulunur?",
      secenekler: ["v = v₀ + a·t", "v = v₀ · a · t", "v = v₀ − t/a", "v = a·t / v₀"],
      cozum: "Kitapta c-t grafiğinin eğiminden v = v₀ + a·t modeli elde edilir (s.51).",
      fc: ["Sabit ivmeli harekette hız modeli nedir?", "v = v₀ + a·t"]
    },
    {
      bi: 0,
      metin: "Sabit ivmeli harekette yer değiştirme büyüklüğü hangi modelle bulunur?",
      secenekler: ["x = v₀·t + ½·a·t²", "x = v₀·t − a·t", "x = a·t²", "x = ½·v₀·t²"],
      cozum: "Kitapta x = v₀·t + ½·a·t² modeli verilir (s.51).",
      fc: ["Yer değiştirme modeli nedir?", "x = v₀·t + ½·a·t²"]
    },
    {
      bi: 0,
      metin: "İlk hızı 2 m/s olan araç 4 m/s² sabit ivmeyle hızlanıyor. Aracın 5. s'deki hızı kaç m/s'dir?",
      secenekler: ["22 m/s", "20 m/s", "18 m/s", "6 m/s"],
      cozum: "v = v₀ + a·t = 2 + 4·5 = 22 m/s (s.49'daki değerlendirme sorusu).",
      fc: ["v₀=2, a=4 m/s², t=5 s ise hız kaçtır?", "22 m/s"]
    },
    {
      bi: 0,
      metin: "Aynı aracın ilk 5 s'deki yer değiştirmesi kaç m'dir? (v₀ = 2 m/s, a = 4 m/s²)",
      secenekler: ["60 m", "50 m", "22 m", "110 m"],
      cozum: "x = 2·5 + ½·4·5² = 10 + 50 = 60 m (s.49'daki değerlendirme sorusu).",
      fc: ["v₀=2, a=4 m/s², 5 s'de yer değiştirme kaçtır?", "60 m"]
    },
    {
      bi: 0,
      metin: "Durgun hâlden 2 m/s² ivmeyle 10 s hızlanan araç kaç m yol alır?",
      secenekler: ["100 m", "20 m", "200 m", "50 m"],
      cozum: "x = ½·a·t² = ½·2·100 = 100 m (s.50'deki değerlendirme sorusu).",
      fc: ["Durgun hâlden 2 m/s² ile 10 s'de alınan yol kaçtır?", "100 m"]
    },
    {
      bi: 0,
      metin: "Ortalama hızdan yararlanarak yer değiştirme hangi modelle bulunur?",
      secenekler: ["Δx = (v + v₀)/2 · t", "Δx = (v − v₀)/2 · t", "Δx = (v · v₀)/2", "Δx = v/t"],
      cozum: "Kitapta Δx = ((v + v₀)/2)·t modeli verilir (s.51).",
      fc: ["Ortalama hızla yer değiştirme modeli nedir?", "Δx = (v + v₀)/2 · t"]
    },
    {
      bi: 1,
      metin: "Hız-zaman grafiğinin eğimi neyi verir?",
      secenekler: ["İvmeyi", "Yer değiştirmeyi", "Ortalama hızı", "Kuvveti"],
      cozum: "Kitapta c-t grafiğinin eğiminden ivmenin hesaplandığı gösterilir (s.51).",
      fc: ["c-t grafiğinin eğimi neyi verir?", "İvmeyi."]
    },
    {
      bi: 1,
      metin: "Kitaptaki koşucu örneğinde c-t grafiğinin altında kalan alanlar 12 m, 36 m ve 60 m bulunmuştur. Toplam yer değiştirme kaç m'dir?",
      secenekler: ["108 m", "96 m", "72 m", "48 m"],
      cozum: "12 + 36 + 60 = 108 m; kitapta koşucunun toplam yer değiştirmesi 108 m'dir (s.52).",
      fc: ["12+36+60 m yer değiştirmelerin toplamı kaçtır?", "108 m"]
    },
    {
      bi: 1,
      metin: "Durgun hâlden harekete geçen cismin konum-zaman (x-t) grafiği nasıldır?",
      secenekler: ["Parabol", "Doğru", "Yatay doğru", "Çember"],
      cozum: "Hız düzgün arttığı için x-t grafiği parabol biçimindedir (s.50, Grafik 1.3).",
      fc: ["Sabit ivmeli harekette x-t grafiği nasıldır?", "Parabol."]
    },
    {
      bi: 1,
      metin: "Sabit ivmeli hareketin ivme-zaman (a-t) grafiği nasıldır?",
      secenekler: ["Yatay eksene paralel doğru", "Orijinden geçen doğru", "Parabol", "Azalan eğri"],
      cozum: "İvme sabit olduğundan a-t grafiği yatay eksene paralel bir doğrudur (s.50, Grafik 1.3).",
      fc: ["Sabit ivmede a-t grafiği nasıldır?", "Yatay eksene paralel doğru."]
    }
  ]
});

/* --------------------------------------------- 1.3.1 YER ÇEKİMİ */
yazKonu({
  konu_id: "fizik_10_u01_k07",
  ders: DERS,
  tema: 1,
  tema_adi: TEMA_ADI,
  baslik: "1.3.1 Düşey Doğrultuda Cisimlerin Sahip Olduğu İvme",
  kazanim: "Yer çekimi ivmesini ve serbest düşmede kütle-ivme ilişkisini açıklar.",
  kaynak: kaynak("60-66"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Yer çekimi ivmesini ve yönünü açıklar.",
    "Serbest düşmede kütle-ivme ilişkisini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Yer çekimi ivmesi hangi sembolle gösterilir?",
      secenekler: ["g", "a", "F", "m"],
      cozum: "Kitapta yer çekimi ivmesi g sembolüyle gösterilir (s.62).",
      fc: ["Yer çekimi ivmesinin sembolü nedir?", "g"]
    },
    {
      bi: 0,
      metin: "Yer çekimi ivmesinin SI'daki birimi nedir?",
      secenekler: ["m/s²", "N", "kg·m/s", "m/s"],
      cozum: "İvmenin birimi m/s² olduğundan yer çekimi ivmesinin birimi de m/s²dir (s.62).",
      fc: ["Yer çekimi ivmesinin birimi nedir?", "m/s²"]
    },
    {
      bi: 0,
      metin: "Yer çekimi kuvvetinin yönü neye doğrudur?",
      secenekler: ["Dünya'nın merkezine", "Dünya yüzeyine paralel", "Güneş'e", "Kuzey Kutbu'na"],
      cozum: "Kitapta yer çekimi kuvvetinin yönünün Dünya'nın merkezine doğru olduğu belirtilir (s.62).",
      fc: ["Yer çekimi kuvvetinin yönü nedir?", "Dünya'nın merkezine doğru."]
    },
    {
      bi: 0,
      metin: "Yer çekimi ivmesi nasıl bir büyüklüktür?",
      secenekler: ["Vektörel", "Skaler", "Birimsiz", "Türetilmemiş"],
      cozum: "Yer çekimi ivmesi yönü de olan vektörel bir büyüklüktür (s.62-63).",
      fc: ["Yer çekimi ivmesi skaler mi vektörel mi?", "Vektörel."]
    },
    {
      bi: 0,
      metin: "Yeryüzüne yakın yerlerde serbest düşen cisimlerin ivmesi için hangisi doğrudur?",
      secenekler: ["Sabit kabul edilir", "Sürekli artar", "Sürekli azalır", "Kütleyle değişir"],
      cozum: "Kitapta yeryüzüne yakın yerlerde yer çekimi ivmesinin sabit kabul edildiği yazılıdır (s.63).",
      fc: ["Yeryüzüne yakın yerde g nasıl kabul edilir?", "Sabit."]
    },
    {
      bi: 1,
      metin: "Hava sürtünmesinin ihmal edildiği ortamda aynı yükseklikten bırakılan farklı kütleli cisimler için hangisi doğrudur?",
      secenekler: ["Aynı anda yere düşerler", "Ağır olan önce düşer", "Hafif olan önce düşer", "Hacmi büyük olan önce düşer"],
      cozum: "Sürtünme ihmal edildiğinde cisimler aynı yer çekimi ivmesiyle hareket ettiği için aynı anda düşer (s.63, s.65).",
      fc: ["Havasız ortamda ağır ve hafif cisim aynı anda düşer mi?", "Evet; ivme kütleden bağımsızdır."]
    },
    {
      bi: 1,
      metin: "Bilim merkezinde pinpon topu, tenis topu ve demir bilye aynı yükseklikten serbest bırakılıyor. Hava sürtünmesi ihmal edilirse eşit zaman aralıklarında hızları için hangisi doğrudur?",
      secenekler: ["Eşit miktarda artar", "Kütleyle orantılı artar", "Kütleyle ters orantılı artar", "Yalnız demir bilyenin hızı artar"],
      cozum: "Kitaptaki tablo ve yorum: cisimler eşit zaman aralıklarında eşit hıza sahip olur (s.64-65).",
      fc: ["Serbest düşmede hız artışı kütleye bağlı mıdır?", "Değildir; eşit zaman aralıklarında eşit hız kazanılır."]
    },
    {
      bi: 1,
      metin: "Sürtünmenin ihmal edildiği ortamda serbest düşen bir cisme etki eden net kuvvet nedir?",
      secenekler: ["Cismin ağırlığı", "Hava direnci", "Yüzey tepki kuvveti", "Net kuvvet sıfırdır"],
      cozum: "Kitapta serbest düşme hareketinin yalnızca yer çekimi kuvvetinin etkisiyle gerçekleştiği belirtilir (s.63).",
      fc: ["Serbest düşen cisme etki eden net kuvvet nedir?", "Cismin ağırlığı (yer çekimi kuvveti)."]
    },
    {
      bi: 1,
      metin: "Ay'ın atmosferi çok ince olduğundan astronotlar tüy ile çekici aynı yükseklikten serbest bırakmıştır. Bu deneyde hangisi gözlenmiştir?",
      secenekler: ["İkisinin aynı anda yüzeye düşmesi", "Çekicin önce düşmesi", "Tüyün önce düşmesi", "İkisinin havada asılı kalması"],
      cozum: "Ay'da hava direnci oluşturacak atmosfer olmadığı için tüy ve çekiç aynı anda düşer (s.65).",
      fc: ["Ay'da tüy ve çekiç neden aynı anda düşer?", "Hava direnci yok; ivme her iki cisimde de aynıdır."]
    },
    {
      bi: 1,
      metin: "İlk hızı sıfır olarak serbest bırakılan cisim, eşit zaman aralıklarında sırasıyla hangi oranda yol alır?",
      secenekler: ["1 : 3 : 5", "1 : 2 : 3", "1 : 4 : 9", "1 : 1 : 1"],
      cozum: "Kitaptaki tabloda ardışık eşit zaman aralıklarında alınan yollar h, 3h, 5h bulunur (s.64-65).",
      fc: ["Serbest düşmede ardışık eşit sürelerde alınan yolların oranı nedir?", "1 : 3 : 5"]
    }
  ]
});

/* ------------------------------------- 1.3.2 SERBEST DÜŞME HAREKETİ */
yazKonu({
  konu_id: "fizik_10_u01_k08",
  ders: DERS,
  tema: 1,
  tema_adi: TEMA_ADI,
  baslik: "1.3.2 Serbest Düşme Hareketi",
  kazanim: "Serbest düşme hareketini matematiksel modellerle hesaplar ve grafiklerini yorumlar.",
  kaynak: kaynak("67-77"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Serbest düşme hareketini matematiksel modellerle hesaplar.",
    "Serbest düşme hareketinin grafiklerini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "İlk hızı sıfır olan bir cisim h yüksekliğinden serbest bırakılıyor. Düşme süresi hangi modelle hesaplanır?",
      secenekler: ["t = √(2h/g)", "t = h/g", "t = g·h", "t = √(h/2g)"],
      cozum: "h = ½·g·t² modelinden t = √(2h/g) elde edilir (s.71, s.81).",
      fc: ["Serbest düşmede süre modeli nedir?", "t = √(2h/g)"]
    },
    {
      bi: 0,
      metin: "Yerden 20 m yükseklikteki kattan ilk hızı sıfır olarak bırakılan top yere kaç saniyede çarpar? (g = 10 m/s²)",
      secenekler: ["2 s", "1 s", "4 s", "20 s"],
      cozum: "20 = ½·10·t² → t² = 4 → t = 2 s (kitaptaki Feryal örneği, s.70).",
      fc: ["20 m'den bırakılan top kaç s'de düşer? (g=10)", "2 s"]
    },
    {
      bi: 0,
      metin: "Aynı topun yere çarpma hızı kaç m/s olur? (g = 10 m/s²)",
      secenekler: ["20 m/s", "10 m/s", "40 m/s", "2 m/s"],
      cozum: "v = g·t = 10·2 = 20 m/s (kitaptaki Feryal örneği, s.70).",
      fc: ["2 s düşen cismin çarpma hızı kaçtır? (g=10)", "20 m/s"]
    },
    {
      bi: 0,
      metin: "İlk hızı sıfır olan serbest düşmede hızın büyüklüğü hangi modelle bulunur?",
      secenekler: ["v = g·t", "v = g/t", "v = h/t", "v = 2·g·t"],
      cozum: "İlk hız sıfır olduğunda hızın büyüklüğü v = g·t modeliyle bulunur (s.71).",
      fc: ["Serbest düşmede hız modeli nedir?", "v = g·t"]
    },
    {
      bi: 0,
      metin: "Kuyuya düşen taşın suya çarpma sesi 2,3 s sonra duyulmuştur. Hava sürtünmesi ve sesin gecikmesi ihmal edilirse kuyunun derinliği yaklaşık kaç m'dir? (g = 10 m/s²)",
      secenekler: ["26,5 m", "23 m", "11,5 m", "46 m"],
      cozum: "h = ½·10·(2,3)² = 5 · 5,29 ≈ 26,5 m (kitaptaki 1.18. soru, s.66).",
      fc: ["2,3 s'de düşen taşın aldığı yol yaklaşık kaç m'dir?", "Yaklaşık 26,5 m"]
    },
    {
      bi: 0,
      metin: "Aynı taşın suya çarptığı andaki hızının büyüklüğü yaklaşık kaç m/s'dir? (g = 10 m/s²)",
      secenekler: ["23 m/s", "2,3 m/s", "46 m/s", "10 m/s"],
      cozum: "v = g·t = 10 · 2,3 = 23 m/s (kitaptaki 1.18. soru, s.66).",
      fc: ["2,3 s düşen taşın hızı kaç m/s'dir?", "23 m/s"]
    },
    {
      bi: 1,
      metin: "İlk hızı sıfır olan serbest düşme hareketinin hız-zaman grafiği nasıldır?",
      secenekler: ["Orijinden geçen artan doğru", "Yatay eksene paralel doğru", "Azalan doğru", "Parabol"],
      cozum: "Hız düzgün arttığı için grafik orijinden geçen eğimli bir doğrudur (s.71, Grafik 1.6).",
      fc: ["Serbest düşmede c-t grafiği nasıldır?", "Orijinden geçen artan doğru."]
    },
    {
      bi: 1,
      metin: "Serbest düşen cismin ivme-zaman grafiği nasıldır?",
      secenekler: ["Yatay eksene paralel doğru", "Orijinden geçen doğru", "Parabol", "Azalan eğri"],
      cozum: "İvme sabit ve g büyüklüğünde olduğundan grafik yatay eksene paralel bir doğrudur (s.71, Grafik 1.6c).",
      fc: ["Serbest düşmede a-t grafiği nasıldır?", "Yatay eksene paralel doğru."]
    },
    {
      bi: 1,
      metin: "Yukarı doğru atılan bir cisim için hangisi doğrudur?",
      secenekler: ["Tepe noktasında hızı sıfırdır", "Tepe noktasında ivmesi sıfırdır", "Tepe noktasında ivmesi yön değiştirir", "Hızı sabit kalır"],
      cozum: "Cisim tepe noktasında bir an durur (hız sıfır) ama ivmesi yine g'dir (s.72, Grafik 1.8).",
      fc: ["Yukarı atılan cisim tepe noktasında ne olur?", "Hızı sıfır olur; ivmesi yine g'dir."]
    },
    {
      bi: 1,
      metin: "Hareketlinin hız-zaman grafiğinin altında kalan alan neyi verir?",
      secenekler: ["Yer değiştirmeyi", "İvmeyi", "Kuvveti", "Kütleyi"],
      cozum: "Kitapta c-t grafiği ile eksen arasında kalan alanın yer değiştirmeyi verdiği kullanılır (s.50, s.73).",
      fc: ["c-t grafiğinde alan neyi verir?", "Yer değiştirmeyi."]
    }
  ]
});

/* -------------------------------------- 1.4 İKİ BOYUTTA HAREKET */
yazKonu({
  konu_id: "fizik_10_u01_k09",
  ders: DERS,
  tema: 1,
  tema_adi: TEMA_ADI,
  baslik: "1.4 İki Boyutta Sabit İvmeli Hareket",
  kazanim: "İki boyutta sabit ivmeli hareketin bileşenlerini çözümler; yatay ve eğik atışı hesaplar.",
  kaynak: kaynak("78-94"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Yatay atış hareketinde bileşenleri ve süreyi hesaplar.",
    "Eğik atış hareketinde hız, süre ve menzili yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Sürtünmenin ihmal edildiği ortamda yatay olarak atılan cismin yatay hız bileşeni için hangisi doğrudur?",
      secenekler: ["Değişmez", "Sürekli artar", "Sürekli azalır", "Sıfır olur"],
      cozum: "Yatay doğrultuda kuvvet olmadığından cisim yatay hızıyla düzgün doğrusal hareket eder (s.81-82).",
      fc: ["Yatay atışta yatay hız neden sabit kalır?", "Yatay doğrultuda net kuvvet yoktur."]
    },
    {
      bi: 0,
      metin: "Yatay olarak atılan bir cismin yere düşme süresi neye bağlıdır?",
      secenekler: ["Yalnız atıldığı yüksekliğe", "Yalnız yatay hızına", "Kütlesine", "Yatay hızına ve kütlesine"],
      cozum: "Düşey hareket serbest düşmedir; süre h = ½·g·t² ile yüksekliğe bağlıdır (s.82).",
      fc: ["Yatay atışta uçuş süresini ne belirler?", "Atıldığı yükseklik."]
    },
    {
      bi: 0,
      metin: "45 m yükseklikten yatay olarak atılan bir cisim yere kaç saniyede çarpar? (g = 10 m/s²)",
      secenekler: ["3 s", "2 s", "4,5 s", "9 s"],
      cozum: "45 = ½·10·t² → t² = 9 → t = 3 s (s.82'deki model).",
      fc: ["45 m'den yatay atılan cisim kaç s'de düşer?", "3 s (yüksekliğe bağlıdır)."]
    },
    {
      bi: 0,
      metin: "Yatay atışta menzil (yatayda alınan en uzak mesafe) hangi modelle hesaplanır?",
      secenekler: ["x = v₀·t", "x = ½·g·t²", "x = g·t", "x = v₀/t"],
      cozum: "Kitapta menzil x_menzil = v₀·t modeliyle verilir (s.82).",
      fc: ["Yatay atışta menzil modeli nedir?", "x = v₀·t"]
    },
    {
      bi: 0,
      metin: "Yatay hızı 30 m/s, düşey hızı 40 m/s olan cismin bileşke hızının büyüklüğü kaç m/s'dir?",
      secenekler: ["50", "35", "70", "10"],
      cozum: "Bileşke hız v = √(30² + 40²) = 50 m/s bulunur (s.82'deki bileşke hız modeli).",
      fc: ["Bileşke hız nasıl bulunur?", "v = √(vx² + vy²)"]
    },
    {
      bi: 0,
      metin: "Yatay atılan cismin yörüngesi nasıldır?",
      secenekler: ["Parabol", "Doğru", "Çember", "Elips"],
      cozum: "Yatay hız sabit, düşey hareket ivmeli olduğundan yörünge paraboldür (s.82).",
      fc: ["Yatay atışın yörünge şekli nedir?", "Parabol."]
    },
    {
      bi: 1,
      metin: "Yatayla θ açı yapan A vektörünün yatay bileşeni hangi bağıntıyla bulunur?",
      secenekler: ["A·cosθ", "A·sinθ", "A·tanθ", "A/cosθ"],
      cozum: "Kitapta bileşenler Ax = A·cosθ, Ay = A·sinθ olarak verilir (s.81).",
      fc: ["Bir vektörün yatay bileşeni nedir?", "A·cosθ"]
    },
    {
      bi: 1,
      metin: "Eğik atışta cismin havada kalma (uçuş) süresi hangi modelle bulunur?",
      secenekler: ["2·v₀y/g", "v₀y/g", "v₀x/g", "√(2h/g)"],
      cozum: "Çıkış süresi v₀y/g, iniş süresi de aynı olduğundan uçuş süresi 2·v₀y/g'dir (s.87).",
      fc: ["Eğik atışta uçuş süresi modeli nedir?", "t = 2·v₀y/g"]
    },
    {
      bi: 1,
      metin: "Eğik atışta cisim tepe noktasına ulaştığında düşey hızı için hangisi doğrudur?",
      secenekler: ["Sıfır olur", "v₀y'ye eşit olur", "Yatay hızına eşit olur", "En büyük değerini alır"],
      cozum: "Maksimum yükseklikte düşey hız sıfır olur; yatay hız v₀x olarak devam eder (s.87).",
      fc: ["Eğik atışta tepe noktasında düşey hız kaçtır?", "Sıfır."]
    },
    {
      bi: 1,
      metin: "Aynı yükseklikten biri serbest bırakılan, diğeri yatay olarak atılan iki cisim için hangisi doğrudur?",
      secenekler: ["Aynı anda yere düşerler", "Yatay atılan önce düşer", "Serbest bırakılan önce düşer", "Yere çarpma hızları eşittir"],
      cozum: "İki cisim de düşeyde aynı serbest düşme hareketini yapar; yatay atılanın bileşke çarpma hızı daha büyüktür (s.82-83).",
      fc: ["Yatay atılan cisim neden diğeriyle aynı anda düşer?", "Düşey hareketleri aynıdır (serbest düşme)."]
    }
  ]
});
