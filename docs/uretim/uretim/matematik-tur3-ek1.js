#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — 3. TUR EK SORULAR · 1. DEMET
   ------------------------------------------------------------
   Plan hedefi ile havuz sayısı arasındaki farkı kapatır.
   Kaynak: Matematik 10 ders kitabı (MEB, 2025)

     mat_10_u02_k01  2.1 iki kategorik değişken      s.96-127   10 → 16
     mat_10_u03_k02  3.2 EBOB-EKOK                   s.149-160  10 → 14
     mat_10_u03_k03  3.3 bölünebilme / kalan         s.161-173  10 → 14
     mat_10_u04_k03  4.3 karekök fonksiyonlar        s.224-242  10 → 12

   Not: soru köklerinde "tablo/grafik/şekil" geçen kalıplardan
   kaçınıldı (görsel zorunluluğu doğuruyor).

   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/matematik-tur3-ek1.js
   ============================================================ */
"use strict";

module.exports = [
  {
    /* ---------- 2.1 İKİ KATEGORİK DEĞİŞKEN ---------- */
    konu_id: "mat_10_u02_k01",
    kaynak: "Matematik 10 ders kitabı, s.96-127",
    items: [
      {
        bi: 0,
        metin: "Bir araştırmacı öğrencilerin cinsiyeti ile en çok sevdiği spor dalı arasında ilişki olup olmadığını incelemektedir. Bu araştırmanın iki kategorik değişkeni hangileridir?",
        secenekler: [
          "Cinsiyet ve en çok sevilen spor dalı",
          "Yaş ve boy uzunluğu",
          "Sınav puanı ve devamsızlık süresi",
          "Kütle ve günlük adım sayısı"
        ],
        cozum: "Kategorik değişkenler sayıyla ölçülmeyen, gruplara ayıran değişkenlerdir. Cinsiyet (kız/erkek) ve sevilen spor dalı (futbol, yüzme…) bu tanıma uyar (s.96-99).",
        fc: ["Kategorik değişken nedir?", "Sayıyla ölçülmeyen, birimleri gruplara ayıran değişken (cinsiyet, spor dalı, ulaşım biçimi gibi)."]
      },
      {
        bi: 0,
        metin: "Aşağıdaki araştırma sorularından hangisi iki kategorik değişken arasındaki ilişkiyi inceler?",
        secenekler: [
          "Öğrencilerin sınıf düzeyi ile okula ulaşım biçimi arasında ilişki var mıdır?",
          "Öğrencilerin günlük çalışma süresi ile sınav puanı arasında ilişki var mıdır?",
          "Bireylerin boy uzunluğu ile kütlesi arasında ilişki var mıdır?",
          "Bir aracın hızı ile yolculuk süresi arasında ilişki var mıdır?"
        ],
        cozum: "Sınıf düzeyi ve ulaşım biçimi kategorik (sınıflandırmalı) değişkenlerdir. Diğer seçeneklerdeki süre, puan, boy, kütle ve hız nicel değişkenlerdir (s.96-100).",
        fc: ["İki kategorik değişkenli araştırma sorusunun ayırt edici özelliği nedir?", "İncelenen iki değişkenin de gruplara ayıran (nicel olmayan) değişkenler olması."]
      },
      {
        bi: 1,
        metin: "Bir araştırmada 300 kişinin 120’si kentte, 180’i köyde yaşamaktadır. Kentte yaşayanların 60’ı düzenli spor yapıyor. Kentte yaşayanlar içinde spor yapanların yüzdesi kaçtır?",
        secenekler: ["%50", "%20", "%33", "%60"],
        cozum: "Satır yüzdesi, ilgili grubun kendi toplamına bölünmesiyle bulunur: 60 / 120 = 0,50 → %50 (s.104-108).",
        fc: ["İki kategorik değişkenli veride satır yüzdesi nasıl hesaplanır?", "Grubun ilgili gözlem sayısı, o grubun satır toplamına bölünür ve 100 ile çarpılır."]
      },
      {
        bi: 1,
        metin: "Aynı araştırmada köyde yaşayan 180 kişinin 45’i düzenli spor yapıyor. Köyde yaşayanlar içinde spor yapanların yüzdesi kaçtır?",
        secenekler: ["%25", "%45", "%20", "%15"],
        cozum: "Köy satırının kendi toplamı 180’dir: 45 / 180 = 0,25 → %25 (s.104-108).",
        fc: ["Satır yüzdelerinde payda olarak hangi sayı kullanılır?", "İncelenen grubun kendi satır toplamı."]
      },
      {
        bi: 1,
        metin: "Kentte spor yapma yüzdesi %50, köyde %25 bulunmuştur. Bu iki kategorik değişken için en uygun yorum hangisidir?",
        secenekler: [
          "Yaşanılan yer ile düzenli spor yapma arasında bir ilişki olabilir.",
          "İki değişken arasında kesin bir neden-sonuç bağı kurulmuştur.",
          "Spor yapma oranı iki grupta eşittir.",
          "Veriler iki kategorik değişken içermemektedir."
        ],
        cozum: "Grup yüzdeleri belirgin biçimde farklı olduğunda ilişki olabileceği söylenir; ancak gözleme dayalı veriler neden-sonuç kanıtı vermez (s.110-116).",
        fc: ["İki kategorik değişkende yüzdeler arasında büyük fark varsa ne söylenir?", "Değişkenler arasında ilişki olabileceği söylenir; neden-sonuç iddiası kurulamaz."]
      },
      {
        bi: 1,
        metin: "Bir araştırmada iki gruptaki birim sayısı da 10’un altında kalmıştır. Yüzde karşılaştırması yapmak için en uygun davranış hangisidir?",
        secenekler: [
          "Daha büyük bir örneklemle veri toplayıp analizi yenilemek",
          "Küçük sayıları yuvarlayarak yüzdeleri eşitlemek",
          "Yalnızca en yüksek yüzdeyi raporlamak",
          "İki değişkeni tek değişkene indirgemek"
        ],
        cozum: "Az sayıda birimde tek bir gözlem yüzdeleri büyük ölçüde değiştirir. Güvenilir yorum için örneklem büyütülür (s.117-122).",
        fc: ["Gözlem sayısı çok azken yüzde yorumu neden güvenilir değildir?", "Tek bir birim bile yüzdeyi büyük ölçüde değiştirir; bu yüzden örneklem büyütülmelidir."]
      }
    ]
  },
  {
    /* ---------- 3.2 EBOB - EKOK ---------- */
    konu_id: "mat_10_u03_k02",
    kaynak: "Matematik 10 ders kitabı, s.149-160",
    items: [
      {
        bi: 0,
        metin: "En büyük ortak böleni 1 olan iki doğal sayıya ne ad verilir?",
        secenekler: ["Aralarında asal sayılar", "Eşit sayılar", "Bileşik sayılar", "Çift sayılar"],
        cozum: "1’den başka ortak böleni olmayan, yani EBOB’u 1 olan sayılara aralarında asal sayılar denir (s.149-152).",
        fc: ["Aralarında asal sayıların EBOB’u kaçtır?", "1."]
      },
      {
        bi: 1,
        metin: "36 ve 60 sayılarının en büyük ortak böleni (EBOB) kaçtır?",
        secenekler: ["12", "6", "18", "24"],
        cozum: "36 = 2²·3², 60 = 2²·3·5 olduğundan ortak asal çarpanların en küçük üslüleri alınır: 2²·3 = 12 (s.152-156).",
        fc: ["Asal çarpanlara ayırarak EBOB nasıl bulunur?", "Ortak asal çarpanların en küçük üslü kuvvetleri çarpılır."]
      },
      {
        bi: 1,
        metin: "15 ve 20 sayılarının en küçük ortak katı (EKOK) kaçtır?",
        secenekler: ["60", "30", "45", "300"],
        cozum: "15 = 3·5, 20 = 2²·5 olduğundan tüm asal çarpanların en büyük üslüleri alınır: 2²·3·5 = 60 (s.156-159).",
        fc: ["Asal çarpanlara ayırarak EKOK nasıl bulunur?", "Tüm asal çarpanların en büyük üslü kuvvetleri çarpılır."]
      },
      {
        bi: 1,
        metin: "Kenar uzunlukları 36 cm ve 60 cm olan dikdörtgen biçimindeki bir masa yüzeyi, eşit ve en büyük kare fayanslarla boşluksuz kaplanacaktır. Bir fayansın kenar uzunluğu kaç santimetredir?",
        secenekler: ["12 cm", "6 cm", "18 cm", "24 cm"],
        cozum: "Her iki kenarı da tam bölen en büyük uzunluk EBOB’dur: EBOB(36, 60) = 12 cm (s.152-156).",
        fc: ["Bir dikdörtgen eşit karelere ayrılırken kenar uzunluğu hangi kavramla bulunur?", "Kısa ve uzun kenarın EBOB’u ile."]
      }
    ]
  },
  {
    /* ---------- 3.3 BÖLÜNEBİLME VE KALAN ---------- */
    konu_id: "mat_10_u03_k03",
    kaynak: "Matematik 10 ders kitabı, s.161-173",
    items: [
      {
        bi: 0,
        metin: "Bir doğal sayının 6 ile tam bölünebilmesi için hangi iki sayı ile tam bölünmesi yeterlidir?",
        secenekler: ["2 ve 3", "3 ve 4", "2 ve 5", "4 ve 9"],
        cozum: "6 = 2·3 ve 2 ile 3 aralarında asal olduğundan sayının hem 2 hem 3 ile tam bölünmesi 6 ile bölünmesini garanti eder (s.161-165).",
        fc: ["Bir sayının 6 ile bölünebilmesi için hangi iki koşul gerekir?", "2 ile ve 3 ile tam bölünmesi (2 ile 3 aralarında asal)."]
      },
      {
        bi: 0,
        metin: "Bir doğal sayının 10 ile bölümünden kalan hangi basamağındaki rakama eşittir?",
        secenekler: [
          "Birler basamağındaki rakama",
          "Onlar basamağındaki rakama",
          "Rakamlarının toplamına",
          "Son iki basamağının oluşturduğu sayıya"
        ],
        cozum: "10’un katları birler basamağı 0 olan sayılardır; kalan doğrudan birler basamağındaki rakamdır (s.162-164).",
        fc: ["10 ile bölümünden kalan neye eşittir?", "Sayının birler basamağındaki rakama."]
      },
      {
        bi: 1,
        metin: "2345 sayısının 9 ile bölümünden kalan kaçtır?",
        secenekler: ["5", "4", "3", "6"],
        cozum: "Rakamlar toplamı 2+3+4+5 = 14, 14’ün 9 ile bölümünden kalan 5’tir; sayının 9 ile bölümünden kalan da 5 olur (s.165-169).",
        fc: ["9 ile bölümünden kalan nasıl bulunur?", "Rakamlar toplamının 9 ile bölümünden kalanına bakılır."]
      },
      {
        bi: 1,
        metin: "Bir x doğal sayısının 3 ile bölümünden kalan 2, 4 ile bölümünden kalan 3’tür. x’in 12 ile bölümünden kalan kaçtır?",
        secenekler: ["11", "5", "7", "9"],
        cozum: "x ≡ 2 (mod 3) ve x ≡ 3 (mod 4) koşullarını sağlayan en küçük sayı 11’dir; 3 ile 4 aralarında asal olduğundan kalan 12’ye göre 11’dir (s.169-173).",
        fc: ["İki ayrı bölümden kalan biliniyorsa birleşik kalan nasıl bulunur?", "Koşulları sağlayan en küçük sayı bulunur; bölenler aralarında asalsa kalan EKOK’a göre tektir."]
      }
    ]
  },
  {
    /* ---------- 4.3 KAREKÖK FONKSİYONLAR ---------- */
    konu_id: "mat_10_u04_k03",
    kaynak: "Matematik 10 ders kitabı, s.224-242",
    items: [
      {
        bi: 1,
        metin: "f(x) = √(x + 4) fonksiyonunun tanım kümesi aşağıdakilerden hangisidir?",
        secenekler: ["[−4, ∞)", "[4, ∞)", "(0, ∞)", "ℝ"],
        cozum: "Karekök içi negatif olamaz: x + 4 ≥ 0 → x ≥ −4, yani tanım kümesi [−4, ∞) olur (s.228-232).",
        fc: ["Karekök fonksiyonunda tanım kümesi nasıl bulunur?", "Kök içindeki ifade sıfırdan büyük veya sıfıra eşit alınır ve eşitsizlik çözülür."]
      },
      {
        bi: 1,
        metin: "f(x) = −√x fonksiyonunun görüntü kümesi aşağıdakilerden hangisidir?",
        secenekler: ["(−∞, 0]", "[0, ∞)", "ℝ", "[0, 1]"],
        cozum: "√x ≥ 0 olduğundan −√x ≤ 0 olur; görüntü kümesi (−∞, 0] biçimindedir (s.232-238).",
        fc: ["f(x) = −√x fonksiyonunun görüntü kümesi nedir?", "(−∞, 0]; karekök alınan ifade negatif işaretle çarpıldığı için değerler sıfır veya negatiftir."]
      }
    ],
    duzeltmeler: [
      {
        soru_id: "mat_10_u04_k03_o05",
        metin: "f(x) = √x fonksiyonu için f(16) değeri kaçtır?",
        cozum: "Fonksiyonda x yerine 16 yazılır: f(16) = √16 = 4 bulunur (s.226).",
        fc: ["Karekök fonksiyonunda bir girdinin görüntüsü nasıl hesaplanır?", "Girdinin karekökü alınır; örneğin f(16) = √16 = 4."]
      },
      {
        soru_id: "mat_10_u04_k03_o09",
        cozum: "Fonksiyonun sıfırı f(x) = 0 eşitliğini sağlayan x değeridir: √x = 0 ise x = 0 olur (s.226)."
      }
    ]
  }
];
