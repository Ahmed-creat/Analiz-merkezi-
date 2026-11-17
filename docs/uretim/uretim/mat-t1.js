#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 · 1-2. TEMALAR — kitaptan sıfırdan havuzlar
   ------------------------------------------------------------
   Kaynak: MEB Matematik 10 (2025), `kitap-kaynak` dalındaki
   matematik.json. Basılı sayfa = PDF sayfası − 1.

     1.1 Dik Üçgende Trigonometrik Oranlar ve Özdeşlikler s.15-31
     1.2 Üçgende Yardımcı Elemanlar                        s.32-58
     1.3 Üçgende Alan                                      s.59-75
     1.4 Sinüs ve Kosinüs Teoremleri                       s.76-88
     2.1 İstatistiksel Problem Oluşturma/Veri/Analiz       s.96-127
     2.2 İstatistiksel Sonuç veya Yorumları Tartışma       s.128-132

   Kullanım: node docs/uretim/uretim/mat-t1.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Matematik";
const DOSYA = "matematik-10.pdf (MEB, 2025)";
const kaynak = s => "Matematik 10 ders kitabı, s." + s;

/* Sık kullanılan şekiller */
const dikUcgen = (a, b, c, aci) => ({
  tip: "ucgen", dik: "C", kenarlar: { a: a, b: b, c: c },
  aci: aci || "α", aciKose: "A", dikIsaret: true
});
const abc = (a, b, c, etiket) => ({
  tip: "geometri",
  noktalar: { A: [90, 30], B: [40, 250], C: [330, 250] },
  kenarlar: [
    { a: "B", b: "C", etiket: a },
    { a: "A", b: "C", etiket: b },
    { a: "A", b: "B", etiket: c }
  ],
  acilar: [{ kose: "A", a: "B", b: "C", etiket: etiket || "α" }]
});

/* ------------------------------------------------------- 1.1 */
yazKonu({
  konu_id: "mat_10_u01_k01",
  ders: DERS, tema: 1, tema_adi: "Geometrik Şekiller",
  baslik: "1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler",
  kazanim: "Dik üçgende trigonometrik oranları ve trigonometrik özdeşlikleri kullanır.",
  kaynak: kaynak("15-31"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Dik üçgende trigonometrik oranları tanımlar ve kullanır.",
    "Trigonometrik özdeşlikleri problem çözmede uygular."
  ],
  items: [
    {
      bi: 0,
      metin: "Dik kenar uzunlukları 7 birim ve 24 birim olan dik üçgende küçük dar açının karşısındaki kenar 7 birimdir. Bu açının sinüs değeri kaçtır?",
      secenekler: ["7/25", "24/25", "7/24", "25/7"],
      cozum: "Hipotenüs √(7² + 24²) = √625 = 25 birimdir. sinüs = karşı kenar / hipotenüs = 7/25 (s.18-20).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [70, 40], B: [40, 240], C: [310, 240] },
        kenarlar: [
          { a: "A", b: "B", etiket: "7" },
          { a: "B", b: "C", etiket: "24" },
          { a: "A", b: "C", etiket: "25" }
        ],
        acilar: [{ kose: "C", a: "A", b: "B", etiket: "α" }],
        dikler: ["B"]
      },
      fc: ["Dik üçgende sinüs nasıl bulunur?", "Karşı kenar / hipotenüs."]
    },
    {
      bi: 0,
      metin: "Aynı dik üçgende (kenarlar 7, 24, 25) α açısının kosinüs değeri kaçtır?",
      secenekler: ["24/25", "7/25", "7/24", "25/24"],
      cozum: "kosinüs = komşu kenar / hipotenüs = 24/25 (s.18-20).",
      gorsel: dikUcgen("7", "24", "25", "α"),
      fc: ["Dik üçgende kosinüs nasıl bulunur?", "Komşu kenar / hipotenüs."]
    },
    {
      bi: 0,
      metin: "Aynı dik üçgende α açısının tanjant değeri kaçtır?",
      secenekler: ["7/24", "24/7", "7/25", "24/25"],
      cozum: "tanjant = karşı kenar / komşu kenar = 7/24 (s.18-20).",
      gorsel: dikUcgen("7", "24", "25", "α"),
      fc: ["Dik üçgende tanjant nasıl bulunur?", "Karşı kenar / komşu kenar."]
    },
    {
      bi: 0,
      metin: "Bir dar açının sinüs ve kosinüs değerlerinin kareleri toplamı kaçtır?",
      secenekler: ["1", "0", "2", "Sinüsün iki katı"],
      cozum: "Pisagor teoreminden sin²x + cos²x = 1 özdeşliği elde edilir (s.21).",
      gorsel: dikUcgen("a", "b", "c", "x"),
      fc: ["sin²x + cos²x kaçtır?", "1"]
    },
    {
      bi: 0,
      metin: "Aynı dar açının tanjant ve kotanjant değerlerinin çarpımı kaçtır?",
      secenekler: ["1", "0", "sin²x", "cos²x"],
      cozum: "tanx · cotx = 1 özdeşliği s.21'deki genellemede verilir.",
      gorsel: dikUcgen("a", "b", "c", "x"),
      fc: ["tanx · cotx kaçtır?", "1"]
    },
    {
      bi: 1,
      metin: "sin30° değeri kaçtır?",
      secenekler: ["1/2", "√3/2", "√3/3", "1"],
      cozum: "Kitabın 30°-45°-60° tablosunda sin30° = 1/2'dir (s.23).",
      gorsel: {
        tip: "ucgen", dik: "C", kenarlar: { a: "1", b: "√3", c: "2" },
        aci: "30°", aciKose: "A", dikIsaret: true
      },
      fc: ["sin30° kaçtır?", "1/2"]
    },
    {
      bi: 1,
      metin: "sin60°, cos60° ve tan45° değerleri sırasıyla hangisidir?",
      secenekler: ["√3/2, 1/2, 1", "1/2, √3/2, √3", "√3/2, 1/2, √3", "1/2, 1/2, 1"],
      cozum: "Kitabın tablosuna göre sin60° = √3/2, cos60° = 1/2, tan45° = 1 (s.23).",
      gorsel: {
        tip: "tablo",
        basliklar: ["Açı", "sin", "cos", "tan"],
        satirlar: [["30°", "1/2", "√3/2", "√3/3"], ["45°", "√2/2", "√2/2", "1"], ["60°", "√3/2", "1/2", "√3"]]
      },
      fc: ["sin60°, cos60° ve tan45° kaçtır?", "√3/2, 1/2 ve 1"]
    },
    {
      bi: 1,
      metin: "Bir dar açının sinüsü, tümlerinin (90° − x) hangi trigonometrik oranına eşittir?",
      secenekler: ["Kosinüsüne", "Tanjantına", "Kotanjantına", "Sekantına"],
      cozum: "sinx = cos(90° − x) ve cosx = sin(90° − x) eşitlikleri s.21'deki genellemede yer alır.",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [60, 40], B: [60, 240], C: [300, 240] },
        kenarlar: [{ a: "A", b: "B", etiket: "a" }, { a: "B", b: "C", etiket: "b" }, { a: "A", b: "C", etiket: "c" }],
        acilar: [{ kose: "A", a: "B", b: "C", etiket: "x" }, { kose: "C", a: "A", b: "B", etiket: "90° − x" }],
        dikler: ["B"]
      },
      fc: ["sinx hangi orana eşittir?", "cos(90° − x)"]
    },
    {
      bi: 1,
      metin: "Zeminden 1,2 m yükseklikten kırılan direğin üst parçası zeminle 30° yapıyor. sin30° = 1/2 olduğuna göre direğin kırılmadan önceki uzunluğu kaç metredir?",
      secenekler: ["3,6", "2,4", "1,8", "4,8"],
      cozum: "sin30° = 1,2/AC = 1/2 → AC = 2,4 m. Direk = 1,2 + 2,4 = 3,6 m (kitabın 3. örneği, s.23).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [70, 40], B: [70, 240], C: [280, 240] },
        kenarlar: [{ a: "A", b: "B", etiket: "1,2" }, { a: "A", b: "C", etiket: "?" }, { a: "B", b: "C", etiket: "zemin" }],
        acilar: [{ kose: "C", a: "A", b: "B", etiket: "30°" }],
        dikler: ["B"]
      },
      fc: ["1,2 m ve 30° ile kırık direğin boyu kaç m'dir?", "3,6 m"]
    },
    {
      bi: 1,
      metin: "Eğim açısı 17° olan bir yolun eğim yüzdesi yaklaşık kaçtır? (tan17° ≈ 0,2924)",
      secenekler: ["%29", "%17", "%58", "%2,9"],
      cozum: "Eğim (%) = (yükseklik farkı / yatay uzaklık)·100 = tan17°·100 ≈ 29,24 → %29 (s.25).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [50, 250], B: [330, 250], C: [330, 120] },
        kenarlar: [{ a: "A", b: "B", etiket: "yatay" }, { a: "B", b: "C", etiket: "yükseklik" }, { a: "A", b: "C", etiket: "yol" }],
        acilar: [{ kose: "A", a: "B", b: "C", etiket: "17°" }],
        dikler: ["B"]
      },
      fc: ["Yolun eğim yüzdesi nasıl bulunur?", "(Yükseklik / yatay) · 100"]
    }
  ]
});

/* ------------------------------------------------------- 1.2 */
yazKonu({
  konu_id: "mat_10_u01_k02",
  ders: DERS, tema: 1, tema_adi: "Geometrik Şekiller",
  baslik: "1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler",
  kazanim: "Üçgende kenarortay, açıortay ve yükseklik ile bunların özelliklerini kullanır.",
  kaynak: kaynak("32-58"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Üçgenin yardımcı elemanlarını tanımlar.",
    "Açıortay ve kenarortay özelliklerini hesapta kullanır."
  ],
  items: [
    {
      bi: 0,
      metin: "Kenarortay nasıl tanımlanır?",
      secenekler: ["Bir köşeyi karşı kenarın orta noktasına birleştiren doğru parçası", "Bir köşeden karşı kenara çizilen dik doğru parçası", "Bir açıyı iki eşit parçaya bölen doğru parçası", "İki kenarı birleştiren doğru parçası"],
      cozum: "Kitapta kenarortay, bir köşeyi karşı kenarın orta noktasına birleştiren doğru parçası olarak tanımlanır (s.45).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [90, 30], B: [40, 250], C: [330, 250], D: [185, 250] },
        kenarlar: [{ a: "A", b: "B", etiket: "c" }, { a: "A", b: "C", etiket: "b" }, { a: "B", b: "C", etiket: "a" }],
        cizgiler: [{ a: "A", b: "D", etiket: "kenarortay", kesikli: false }]
      },
      fc: ["Kenarortay nedir?", "Köşeyi karşı kenarın orta noktasına birleştiren doğru parçası."]
    },
    {
      bi: 0,
      metin: "Bir üçgende kaç tane kenarortay vardır?",
      secenekler: ["3", "1", "2", "6"],
      cozum: "Her köşeden karşı kenarın orta noktasına bir kenarortay çizilir; üçgende üç kenarortay vardır (s.45-46).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [90, 30], B: [40, 250], C: [330, 250], D: [185, 250], E: [210, 140], F: [65, 140] },
        kenarlar: [{ a: "A", b: "B" }, { a: "A", b: "C" }, { a: "B", b: "C" }],
        cizgiler: [{ a: "A", b: "D", etiket: "1" }, { a: "C", b: "E", etiket: "2" }, { a: "B", b: "F", etiket: "3" }]
      },
      fc: ["Üçgende kaç kenarortay vardır?", "3"]
    },
    {
      bi: 0,
      metin: "Bir üçgende kenarortaylar hangi noktada kesişir?",
      secenekler: ["Ağırlık merkezinde", "Diklik merkezinde", "İç teğet çemberin merkezinde", "Çevrel çemberin merkezinde"],
      cozum: "Kenarortaylar tek noktada, ağırlık merkezinde kesişir (s.46).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [90, 30], B: [40, 250], C: [330, 250], D: [185, 250], E: [210, 140], G: [120, 175] },
        kenarlar: [{ a: "A", b: "B" }, { a: "A", b: "C" }, { a: "B", b: "C" }],
        cizgiler: [{ a: "A", b: "D", etiket: "kenarortay" }, { a: "C", b: "E", etiket: "kenarortay" }],
        not: "G: ağırlık merkezi"
      },
      fc: ["Kenarortaylar nerede kesişir?", "Ağırlık merkezinde."]
    },
    {
      bi: 0,
      metin: "Ağırlık merkezi, bir kenarortayı köşeden ve kenardan itibaren hangi oranda böler?",
      secenekler: ["Köşeden 2, kenardan 1", "Köşeden 1, kenardan 2", "Eşit olarak 1:1", "Köşeden 3, kenardan 1"],
      cozum: "Kitaba göre ağırlık merkezinin köşeye uzaklığı, kenara uzaklığının iki katıdır (2:1) (s.46-47).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [100, 30], B: [40, 250], C: [340, 250], D: [190, 250], G: [130, 177] },
        kenarlar: [{ a: "A", b: "B" }, { a: "A", b: "C" }, { a: "B", b: "C" }],
        cizgiler: [{ a: "A", b: "D", etiket: "2k + k" }],
        not: "|AG| = 2k, |GD| = k"
      },
      fc: ["Ağırlık merkezi kenarortayı hangi oranda böler?", "2:1 (köşeden 2, kenardan 1)."]
    },
    {
      bi: 0,
      metin: "Üçgende yükseklik nasıl tanımlanır?",
      secenekler: ["Bir köşeden karşı kenara veya uzantısına çizilen dik doğru parçası", "Köşeyi karşı kenarın orta noktasına birleştiren doğru parçası", "Açıyı iki eşit parçaya bölen doğru parçası", "Kenarların orta noktalarını birleştiren doğru parçası"],
      cozum: "Yükseklik, bir köşeden karşısındaki kenara ya da uzantısına dik olarak çizilen doğru parçasıdır (s.52).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [80, 40], B: [40, 250], C: [330, 250], H: [80, 250] },
        kenarlar: [{ a: "A", b: "B" }, { a: "A", b: "C" }, { a: "B", b: "C" }],
        cizgiler: [{ a: "A", b: "H", etiket: "h" }],
        dikler: ["H"]
      },
      fc: ["Yükseklik nedir?", "Köşeden karşı kenara çizilen dik doğru parçası."]
    },
    {
      bi: 0,
      metin: "Üçgende yüksekliklerin kesiştiği noktaya ne denir?",
      secenekler: ["Diklik merkezi", "Ağırlık merkezi", "İç açıortayların merkezi", "Çevrel merkez"],
      cozum: "Üç yüksekliğin kesiştiği nokta diklik merkezidir (s.53).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [90, 30], B: [40, 250], C: [330, 250], H: [90, 250] },
        kenarlar: [{ a: "A", b: "B" }, { a: "A", b: "C" }, { a: "B", b: "C" }],
        cizgiler: [{ a: "A", b: "H", etiket: "yükseklik" }],
        dikler: ["H"],
        not: "Diklik merkezi: yüksekliklerin kesişimi"
      },
      fc: ["Yükseklikler nerede kesişir?", "Diklik merkezinde."]
    },
    {
      bi: 1,
      metin: "ABC üçgeninde [AD] iç açıortaydır. |AB| = 6 cm, |AC| = 9 cm ve |BD| = 4 cm ise |DC| kaç cm'dir?",
      secenekler: ["6", "5", "4,5", "8"],
      cozum: "İç açıortay teoremine göre |BD|/|DC| = |AB|/|AC| → 4/|DC| = 6/9 → |DC| = 6 cm (s.34-35).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [110, 30], B: [40, 250], C: [340, 250], D: [150, 250] },
        kenarlar: [{ a: "A", b: "B", etiket: "6" }, { a: "A", b: "C", etiket: "9" }, { a: "B", b: "C", etiket: "4 + ?" }],
        cizgiler: [{ a: "A", b: "D", etiket: "açıortay" }],
        acilar: [{ kose: "A", a: "B", b: "D", etiket: "α" }, { kose: "A", a: "D", b: "C", etiket: "α" }]
      },
      fc: ["İç açıortay teoremi nedir?", "|BD|/|DC| = |AB|/|AC|"]
    },
    {
      bi: 1,
      metin: "Bir açının açıortayı üzerinde alınan herhangi bir noktanın açının kollarına olan uzaklıkları için hangisi doğrudur?",
      secenekler: ["Eşittir", "Kollardan birine daha yakındır", "Toplamları sabittir", "Çarpımları 1'dir"],
      cozum: "Açıortay üzerindeki nokta, açının kollarına eşit uzaklıktadır (s.38).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [60, 250], B: [330, 250], C: [250, 60], P: [160, 120], H1: [160, 250], H2: [205, 105] },
        kenarlar: [{ a: "A", b: "B" }, { a: "A", b: "C" }],
        cizgiler: [{ a: "A", b: "P", etiket: "açıortay" }, { a: "P", b: "H1", etiket: "d1", kesikli: true }, { a: "P", b: "H2", etiket: "d2", kesikli: true }],
        not: "d1 = d2"
      },
      fc: ["Açıortay üzerindeki nokta kollara ne kadar uzaktır?", "Eşit uzaklıkta."]
    },
    {
      bi: 1,
      metin: "Ağırlık merkezinin bir köşeye uzaklığı 8 cm ise aynı kenarortay üzerinde kenara olan uzaklığı kaç cm'dir?",
      secenekler: ["4", "8", "16", "2"],
      cozum: "|AG| = 2|GD| olduğundan 8 = 2·|GD| → |GD| = 4 cm (s.46-47).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [100, 30], B: [40, 250], C: [340, 250], D: [190, 250], G: [130, 177] },
        kenarlar: [{ a: "A", b: "B" }, { a: "A", b: "C" }, { a: "B", b: "C" }],
        cizgiler: [{ a: "A", b: "D", etiket: "8 + ?" }],
        not: "G ağırlık merkezi"
      },
      fc: ["|AG| = 8 ise |GD| kaçtır?", "4"]
    },
    {
      bi: 1,
      metin: "Bir üçgenin bir dış açısına ait açıortay, karşı kenarın uzantısını nasıl böler?",
      secenekler: ["Kenarlarla orantılı olarak", "Her zaman iki eşit parçaya", "Kenarların toplamı kadar", "Bölemez"],
      cozum: "Dış açıortay da karşı kenarın uzantısını diğer iki kenarın uzunluklarıyla orantılı biçimde böler (s.40-41).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [90, 40], B: [40, 240], C: [280, 240], D: [350, 240] },
        kenarlar: [{ a: "A", b: "B", etiket: "c" }, { a: "A", b: "C", etiket: "b" }, { a: "B", b: "D", etiket: "uzantı" }],
        cizgiler: [{ a: "A", b: "D", etiket: "dış açıortay", kesikli: true }]
      },
      fc: ["Dış açıortay kenar uzantısını nasıl böler?", "Kenarlarla orantılı."]
    }
  ]
});

/* ------------------------------------------------------- 1.3 */
yazKonu({
  konu_id: "mat_10_u01_k03",
  ders: DERS, tema: 1, tema_adi: "Geometrik Şekiller",
  baslik: "1.3 Üçgende Alan",
  kazanim: "Üçgenin alanını ve alanlar arasındaki oranları hesaplar.",
  kaynak: kaynak("59-75"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Üçgen alanını taban ve yükseklikle hesaplar.",
    "Alan oranlarını benzerlik ve yükseklikle ilişkilendirir."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir üçgenin alanı hangi bağıntıyla bulunur?",
      secenekler: ["(Taban × yükseklik) / 2", "Taban × yükseklik", "Taban + yükseklik", "(Taban + yükseklik) / 2"],
      cozum: "Kitapta üçgenin alanı, bir kenar ile o kenara ait yüksekliğin çarpımının yarısı olarak verilir (s.60-62).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [90, 40], B: [40, 250], C: [330, 250], H: [90, 250] },
        kenarlar: [{ a: "A", b: "B" }, { a: "A", b: "C" }, { a: "B", b: "C", etiket: "a" }],
        cizgiler: [{ a: "A", b: "H", etiket: "h" }],
        dikler: ["H"]
      },
      fc: ["Üçgen alanı nasıl bulunur?", "Taban × yükseklik / 2"]
    },
    {
      bi: 1,
      metin: "Taban uzunluğu 12 cm, bu tabana ait yüksekliği 5 cm olan üçgenin alanı kaç cm²'dir?",
      secenekler: ["30", "60", "17", "120"],
      cozum: "Alan = 12·5/2 = 30 cm² (s.62).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [85, 50], B: [40, 240], C: [320, 240], H: [85, 240] },
        kenarlar: [{ a: "A", b: "B" }, { a: "A", b: "C" }, { a: "B", b: "C", etiket: "12" }],
        cizgiler: [{ a: "A", b: "H", etiket: "5" }],
        dikler: ["H"]
      },
      fc: ["Taban 12, yükseklik 5 ise alan kaçtır?", "30 cm²"]
    },
    {
      bi: 0,
      metin: "Tabanı sabit tutulan bir üçgende yükseklik 2 katına çıkarılırsa alanı nasıl değişir?",
      secenekler: ["2 katına çıkar", "Yarıya iner", "Değişmez", "4 katına çıkar"],
      cozum: "Alan tabanla yüksekliğin çarpımıyla doğru orantılıdır; yükseklik 2 katına çıkarsa alan 2 katına çıkar (s.60-62).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [90, 60], B: [40, 240], C: [320, 240], A2: [90, 20], H: [90, 240] },
        kenarlar: [{ a: "A", b: "B" }, { a: "A", b: "C" }, { a: "B", b: "C", etiket: "a" }],
        cizgiler: [{ a: "A", b: "H", etiket: "h" }, { a: "A2", b: "H", etiket: "2h", kesikli: true }],
        dikler: ["H"]
      },
      fc: ["Yükseklik 2 katına çıkarsa alan ne olur?", "2 katına çıkar."]
    },
    {
      bi: 0,
      metin: "Paralel iki doğru arasında ortak tabana sahip üçgenlerin alanları için hangisi doğrudur?",
      secenekler: ["Eşittir", "Taban uzunluğuna bağlıdır", "Yükseklikle ters orantılıdır", "Her zaman sıfırdır"],
      cozum: "Taban ortak ve yükseklikler paralel doğrular arasında eşit olduğundan alanlar eşittir (s.65-67).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [40, 250], B: [300, 250], C: [90, 120], C2: [250, 120] },
        kenarlar: [{ a: "A", b: "B", etiket: "a" }],
        cizgiler: [{ a: "C", b: "C2", etiket: "d1 // d2", kesikli: true }, { a: "A", b: "C" }, { a: "B", b: "C" }, { a: "A", b: "C2", kesikli: true }, { a: "B", b: "C2", kesikli: true }],
        not: "ABC ve ABC₂ ortak tabanlı"
      },
      fc: ["Ortak tabanlı üçgenlerin alanları neden eşittir?", "Yükseklikleri eşit."]
    },
    {
      bi: 1,
      metin: "Benzerlik oranı 2/3 olan iki üçgenin alanları oranı kaçtır?",
      secenekler: ["4/9", "2/3", "8/27", "3/2"],
      cozum: "Benzer üçgenlerde alanlar oranı benzerlik oranının karesidir: (2/3)² = 4/9 (s.69-71).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [60, 240], B: [130, 240], C: [90, 180], D: [220, 240], E: [340, 240], F: [270, 130] },
        kenarlar: [{ a: "A", b: "B", etiket: "2k" }, { a: "D", b: "E", etiket: "3k" }],
        cizgiler: [{ a: "A", b: "C" }, { a: "B", b: "C" }, { a: "D", b: "F" }, { a: "E", b: "F" }],
        not: "Benzer üçgenler"
      },
      fc: ["Benzerlik oranı 2/3 ise alanlar oranı kaçtır?", "4/9"]
    },
    {
      bi: 1,
      metin: "İki kenarı 6 cm ve 8 cm, aralarındaki açı 30° olan üçgenin alanı kaç cm²'dir? (sin30° = 1/2)",
      secenekler: ["12", "24", "48", "6"],
      cozum: "Alan = ½·b·c·sinA = ½·6·8·(1/2) = 12 cm² (s.70-72).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [70, 60], B: [70, 240], C: [300, 180] },
        kenarlar: [{ a: "A", b: "B", etiket: "6" }, { a: "A", b: "C", etiket: "8" }, { a: "B", b: "C" }],
        acilar: [{ kose: "A", a: "B", b: "C", etiket: "30°" }]
      },
      fc: ["İki kenar ve arasındaki açıyla alan nasıl bulunur?", "½ · b · c · sinA"]
    },
    {
      bi: 1,
      metin: "Alanı 24 cm² olan üçgenin bir kenarı 8 cm ise bu kenara ait yükseklik kaç cm'dir?",
      secenekler: ["6", "3", "12", "48"],
      cozum: "24 = 8·h/2 → h = 6 cm (s.62).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [85, 50], B: [40, 240], C: [320, 240], H: [85, 240] },
        kenarlar: [{ a: "A", b: "B" }, { a: "A", b: "C" }, { a: "B", b: "C", etiket: "8" }],
        cizgiler: [{ a: "A", b: "H", etiket: "h" }],
        dikler: ["H"],
        not: "Alan = 24 cm²"
      },
      fc: ["Alan 24, taban 8 ise yükseklik kaçtır?", "6 cm"]
    },
    {
      bi: 1,
      metin: "Bir üçgenin kenarları 3 katına çıkarılırsa alanı kaç katına çıkar?",
      secenekler: ["9", "3", "6", "27"],
      cozum: "Alanlar oranı benzerlik oranının karesi olduğundan 3² = 9 katına çıkar (s.69).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [50, 240], B: [120, 240], C: [80, 190], D: [200, 240], E: [340, 240], F: [260, 90] },
        kenarlar: [{ a: "A", b: "B", etiket: "k" }, { a: "D", b: "E", etiket: "3k" }],
        cizgiler: [{ a: "A", b: "C" }, { a: "B", b: "C" }, { a: "D", b: "F" }, { a: "E", b: "F" }]
      },
      fc: ["Kenarlar 3 katına çıkarsa alan kaç katına çıkar?", "9"]
    },
    {
      bi: 1,
      metin: "Tabanları eşit iki üçgenin yükseklikleri 3 cm ve 5 cm ise alanları oranı kaçtır?",
      secenekler: ["3/5", "9/25", "5/3", "1/2"],
      cozum: "Tabanlar eşitse alanlar yüksekliklerle doğru orantılıdır: 3/5 (s.62).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [60, 200], B: [40, 250], C: [280, 250], D: [120, 140] },
        kenarlar: [{ a: "B", b: "C", etiket: "a" }],
        cizgiler: [{ a: "B", b: "A" }, { a: "C", b: "A" }, { a: "B", b: "D", kesikli: true }, { a: "C", b: "D", kesikli: true }],
        not: "Aynı taban, farklı yükseklik"
      },
      fc: ["Tabanlar eşitse alan oranı neye eşittir?", "Yükseklikler oranına."]
    },
    {
      bi: 1,
      metin: "Bir üçgenin alanı 36 cm², tabanı 9 cm ise yüksekliği kaç cm'dir?",
      secenekler: ["8", "4", "18", "72"],
      cozum: "36 = 9·h/2 → h = 8 cm (s.62).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [85, 40], B: [40, 240], C: [320, 240], H: [85, 240] },
        kenarlar: [{ a: "A", b: "B" }, { a: "A", b: "C" }, { a: "B", b: "C", etiket: "9" }],
        cizgiler: [{ a: "A", b: "H", etiket: "h" }],
        dikler: ["H"],
        not: "Alan = 36 cm²"
      },
      fc: ["Alan 36, taban 9 ise yükseklik kaçtır?", "8 cm"]
    }
  ]
});

/* ------------------------------------------------------- 1.4 */
yazKonu({
  konu_id: "mat_10_u01_k04",
  ders: DERS, tema: 1, tema_adi: "Geometrik Şekiller",
  baslik: "1.4 Sinüs ve Kosinüs Teoremleri",
  kazanim: "Sinüs ve kosinüs teoremlerini kullanarak üçgenin bilinmeyen kenar ve açılarını bulur.",
  kaynak: kaynak("76-88"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Sinüs teoremini kullanır.",
    "Kosinüs teoremini kullanır."
  ],
  items: [
    {
      bi: 0,
      metin: "Sinüs teoremi hangi eşitlikle ifade edilir?",
      secenekler: ["a/sinA = b/sinB = c/sinC", "a·sinA = b·sinB = c·sinC", "a² = b² + c²", "a/sinA = b·sinB"],
      cozum: "Kitapta sinüs teoremi a/sinA = b/sinB = c/sinC olarak verilir (s.80).",
      gorsel: abc("a", "b", "c", "A"),
      fc: ["Sinüs teoremi nedir?", "a/sinA = b/sinB = c/sinC"]
    },
    {
      bi: 0,
      metin: "Kosinüs teoremi hangi eşitlikle ifade edilir?",
      secenekler: ["a² = b² + c² − 2bc·cosA", "a² = b² + c² + 2bc·cosA", "a = b + c − 2bc·cosA", "a² = b² − c²"],
      cozum: "Kitapta kosinüs teoremi a² = b² + c² − 2bc·cosA olarak verilir (s.82-84).",
      gorsel: abc("a", "b", "c", "A"),
      fc: ["Kosinüs teoremi nedir?", "a² = b² + c² − 2bc·cosA"]
    },
    {
      bi: 0,
      metin: "Bir üçgende A açısı 90° ise kosinüs teoremi hangi bağıntıya dönüşür?",
      secenekler: ["a² = b² + c² (Pisagor)", "a² = b² − c²", "a = b + c", "a² = 2bc"],
      cozum: "cos90° = 0 olduğundan kosinüs teoremi Pisagor bağıntısına indirgenir (s.82).",
      gorsel: {
        tip: "ucgen", dik: "C", kenarlar: { a: "a", b: "b", c: "c" },
        aci: "90°", aciKose: "A", dikIsaret: true
      },
      fc: ["A = 90° iken kosinüs teoremi neye dönüşür?", "Pisagor bağıntısına."]
    },
    {
      bi: 1,
      metin: "ABC üçgeninde A açısı 30°, B açısı 60° ve a = 6 cm ise b kenarı kaç cm'dir?",
      secenekler: ["6√3", "3", "6", "12"],
      cozum: "a/sinA = b/sinB → 6/(1/2) = b/(√3/2) → 12 = 2b/√3 → b = 6√3 cm (s.80).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [100, 40], B: [40, 250], C: [330, 250] },
        kenarlar: [{ a: "A", b: "B", etiket: "c" }, { a: "A", b: "C", etiket: "b" }, { a: "B", b: "C", etiket: "6" }],
        acilar: [{ kose: "A", a: "B", b: "C", etiket: "30°" }, { kose: "B", a: "A", b: "C", etiket: "60°" }]
      },
      fc: ["A=30°, B=60°, a=6 ise b kaçtır?", "6√3"]
    },
    {
      bi: 1,
      metin: "İki kenarı 5 cm ve 7 cm, aralarındaki açı 60° olan üçgende üçüncü kenarın karesi kaçtır?",
      secenekler: ["39", "74", "109", "24"],
      cozum: "a² = 5² + 7² − 2·5·7·cos60° = 25 + 49 − 35 = 39 (s.82-84).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [70, 60], B: [70, 240], C: [300, 190] },
        kenarlar: [{ a: "A", b: "B", etiket: "5" }, { a: "A", b: "C", etiket: "7" }, { a: "B", b: "C", etiket: "a" }],
        acilar: [{ kose: "A", a: "B", b: "C", etiket: "60°" }]
      },
      fc: ["5, 7 ve 60° için a² kaçtır?", "39"]
    },
    {
      bi: 1,
      metin: "ABC üçgeninde BC = 48 birim, açılar B = 58°, C = 74°'dir. AB kenarı yaklaşık kaç birimdir? (sin58° ≈ 0,84, sin74° ≈ 0,96)",
      secenekler: ["42", "37", "48", "56"],
      cozum: "A = 180° − 58° − 74° = 48°. AB/sin58° = 48/sin48° → AB ≈ 48·0,84/0,96 = 42 birim (s.78).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [100, 35], B: [40, 250], C: [330, 250] },
        kenarlar: [{ a: "A", b: "B", etiket: "c" }, { a: "A", b: "C", etiket: "b" }, { a: "B", b: "C", etiket: "48" }],
        acilar: [{ kose: "B", a: "A", b: "C", etiket: "58°" }, { kose: "C", a: "A", b: "B", etiket: "74°" }]
      },
      fc: ["BC=48, B=58°, C=74° ise AB kaçtır?", "≈42"]
    },
    {
      bi: 1,
      metin: "KA = 60 mil, KB = 50√3 mil ve aralarındaki açı 30° ise AB uzunluğu kaç mildir?",
      secenekler: ["10√21", "10√3", "45", "20√21"],
      cozum: "AB² = 60² + (50√3)² − 2·60·50√3·cos30° = 3600 + 7500 − 9000 = 2100 → AB = 10√21 mil (kitabın 20. sorusu, s.84).",
      gorsel: {
        tip: "geometri",
        noktalar: { K: [70, 60], A: [70, 250], B: [300, 200] },
        kenarlar: [{ a: "K", b: "A", etiket: "60" }, { a: "K", b: "B", etiket: "50√3" }, { a: "A", b: "B", etiket: "?" }],
        acilar: [{ kose: "K", a: "A", b: "B", etiket: "30°" }]
      },
      fc: ["60, 50√3 ve 30° için AB kaçtır?", "10√21"]
    },
    {
      bi: 1,
      metin: "Kenar uzunlukları 7, 8 ve 5 birim olan üçgende 7 birimlik kenarın karşısındaki açının kosinüsü kaçtır?",
      secenekler: ["1/2", "−1/2", "3/5", "1/5"],
      cozum: "7² = 8² + 5² − 2·8·5·cosA → 49 = 89 − 80·cosA → cosA = 1/2 (s.82-84).",
      gorsel: abc("7", "5", "8", "A"),
      fc: ["Kenarlar 7, 8, 5 ise 7'nin karşısındaki açının kosinüsü kaçtır?", "1/2"]
    },
    {
      bi: 1,
      metin: "Sinüs teoremi hangi durumda doğrudan kullanılır?",
      secenekler: ["İki açı ve bir kenar bilindiğinde", "Yalnız üç kenar bilindiğinde", "Yalnız iki kenar bilindiğinde", "Hiçbir açı bilinmediğinde"],
      cozum: "Sinüs teoremi açı-kenar çiftlerinden yararlanır; iki açı ve bir kenarla diğer kenarlar bulunur (s.78-80).",
      gorsel: abc("a", "b", "c", "A"),
      fc: ["Sinüs teoremi ne zaman kullanılır?", "İki açı + bir kenar verildiğinde."]
    },
    {
      bi: 1,
      metin: "İki kenarı ve bu kenarlar arasındaki açısı bilinen bir üçgende üçüncü kenarı bulmak için hangi teorem kullanılır?",
      secenekler: ["Kosinüs teoremi", "Sinüs teoremi", "Açıortay teoremi", "Kenarortay teoremi"],
      cozum: "İki kenar ve aralarındaki açı verildiğinde üçüncü kenar kosinüs teoremiyle bulunur (s.82).",
      gorsel: {
        tip: "geometri",
        noktalar: { A: [70, 60], B: [70, 240], C: [300, 190] },
        kenarlar: [{ a: "A", b: "B", etiket: "b" }, { a: "A", b: "C", etiket: "c" }, { a: "B", b: "C", etiket: "a" }],
        acilar: [{ kose: "A", a: "B", b: "C", etiket: "A" }]
      },
      fc: ["İki kenar + aradaki açı → hangi teorem?", "Kosinüs teoremi."]
    }
  ]
});

/* ------------------------------------------------------- 2.1 */
yazKonu({
  konu_id: "mat_10_u02_k01",
  ders: DERS, tema: 2, tema_adi: "İstatistiksel Araştırma Süreci",
  baslik: "2.1 İki Kategorik Değişkenin İlişkililiğini İçeren İstatistiksel Problemi Oluşturma, Veri Toplama, Analiz Etme ve Yorumlama",
  kazanim: "İki kategorik değişkenin ilişkililiğine dayalı istatistiksel araştırma sürecini yürütür.",
  kaynak: kaynak("96-127"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "İki kategorik değişkenli araştırma sorusu kurar ve veriyi düzenler.",
    "İki yönlü tablodan yüzde ve ilişki yorumu yapar."
  ],
  items: [
    {
      bi: 0,
      metin: "Aşağıdakilerden hangisi iki kategorik değişkenli veri toplamayı gerektiren bir araştırma sorusudur?",
      secenekler: ["Öğrencilerin sınıf düzeyi ile ayakkabı bağcığı tercihi arasında ilişki var mıdır?", "Bir sınıfın matematik not ortalaması kaçtır?", "Bir aracın hızı kaç km/saattir?", "Bir odanın sıcaklığı kaç derecedir?"],
      cozum: "Kitapta iki kategorik değişkenli araştırmaya örnek olarak sınıf düzeyi ile bağcıklı/bağcıksız ayakkabı tercihi verilir (s.98).",
      fc: ["İki kategorik değişkenli soruya örnek nedir?", "Sınıf düzeyi ile ayakkabı tercihi ilişkisi."]
    },
    {
      bi: 0,
      metin: "İki kategorik değişkenli verilerin ilişkisini göstermek için en uygun tablo hangisidir?",
      secenekler: ["İki yönlü sıklık (kontenjans) tablosu", "Kutu grafiği", "Saçılım grafiği", "Histogram"],
      cozum: "İki kategorik değişkenin birlikte sıklıkları iki yönlü sıklık tablosunda gösterilir (s.100-102).",
      fc: ["İki kategorik değişken hangi tabloda gösterilir?", "İki yönlü sıklık tablosu."]
    },
    {
      bi: 0,
      metin: "İki yönlü tabloda bir satır yüzdesi nasıl hesaplanır?",
      secenekler: ["Hücre sıklığı satır toplamına bölünür", "Hücre sıklığı genel toplama bölünür", "Satır toplamı sütun toplamına bölünür", "Hücre sıklığı 100 ile çarpılır"],
      cozum: "Satır yüzdesi, hücredeki sıklığın o satırın toplamına oranıdır (s.101-104).",
      fc: ["Satır yüzdesi nasıl bulunur?", "Hücre / satır toplamı."]
    },
    {
      bi: 0,
      metin: "İki kategorik değişkenin ilişkisini görselleştirmek için hangisi uygundur?",
      secenekler: ["Gruplandırılmış sütun grafiği", "Serpilme (saçılım) grafiği", "Kutu grafiği", "Çizgi grafiği"],
      cozum: "Kitapta kategorik veriler için sütun grafiği ve ısı haritası gibi araçlar kullanılır (s.98-100).",
      fc: ["Kategorik veri için hangi grafik uygundur?", "Sütun grafiği."]
    },
    {
      bi: 0,
      metin: "İyi bir istatistiksel araştırma sorusunun özelliği nedir?",
      secenekler: ["İki değişken arasındaki ilişkiyi ölçebilir ve veriyle yanıtlanabilir olması", "Tek bir sayı sorması", "Yanıtının önceden bilinmesi", "Görüş bildirmesi"],
      cozum: "Araştırma sorusu, iki kategorik değişkenin ilişkililiğini ölçmeye yönelik ve veriyle yanıtlanabilir olmalıdır (s.100).",
      fc: ["Araştırma sorusu nasıl olmalıdır?", "Veriyle yanıtlanabilir, iki değişkenli."]
    },
    {
      bi: 1,
      metin: "Bir araştırmada 40 kişiden 24'ü A markasını tercih etmiştir. A markasını tercih edenlerin yüzdesi kaçtır?",
      secenekler: ["%60", "%40", "%24", "%16"],
      cozum: "24/40 = 0,60 → %60 (s.101-104'teki yüzde hesabı).",
      fc: ["40 kişide 24 kişi ise yüzde kaçtır?", "%60"]
    },
    {
      bi: 1,
      metin: "Bir tabloda 200 kişinin 80'i futbol, 50'si tenis izlemeyi seçmiştir. Bu iki grup arasındaki fark kaç kişidir?",
      secenekler: ["30", "130", "20", "150"],
      cozum: "80 − 50 = 30 kişi (s.100'deki sıklık tablosu okuma).",
      fc: ["80 ve 50 arasındaki fark kaçtır?", "30"]
    },
    {
      bi: 1,
      metin: "Araştırmacı yalnızca kendi okulundaki öğrencilere anket uygulayıp tüm Türkiye için sonuç çıkarmıştır. Bu durumda ortaya çıkan sorun nedir?",
      secenekler: ["Örneklem yanlılığı", "Hesaplama hatası", "Aşırı büyük örneklem", "Değişken sayısının azlığı"],
      cozum: "Tek bir okuldan alınan örneklem evreni temsil etmez; bu bir örneklem yanlılığıdır (s.98-100).",
      fc: ["Tek okuldan alınan örneklem neye yol açar?", "Örneklem yanlılığına."]
    },
    {
      bi: 1,
      metin: "İki kategorik değişken arasında ilişki bulunması durumunda hangi sonuç çıkarılamaz?",
      secenekler: ["Birinin diğerine neden olduğu", "Değişkenlerin birlikte değiştiği", "Satır yüzdelerinin farklı olduğu", "İlişkinin yönünün incelenebileceği"],
      cozum: "İlişki varlığı nedensellik göstermez; nedensellik için ek kanıt gerekir (s.128-129).",
      fc: ["İlişki varsa nedensellik var mıdır?", "Hayır."]
    },
    {
      bi: 1,
      metin: "İki yönlü tabloda tüm satır yüzdeleri her sütunda benzer çıkıyorsa ne söylenebilir?",
      secenekler: ["Değişkenler arasında güçlü bir ilişki görünmemektedir", "Değişkenler kesinlikle bağımlıdır", "Veri toplanmamıştır", "Örneklem sıfırdır"],
      cozum: "Koşullu yüzdeler değişmiyorsa iki kategorik değişken arasında belirgin ilişki yoktur (s.104-108).",
      fc: ["Satır yüzdeleri benzer ise ne denir?", "Belirgin ilişki yok."]
    }
  ]
});

/* ------------------------------------------------------- 2.2 */
yazKonu({
  konu_id: "mat_10_u02_k02",
  ders: DERS, tema: 2, tema_adi: "İstatistiksel Araştırma Süreci",
  baslik: "2.2 Başkaları Tarafından Oluşturulan İki Kategorik Değişkenli Verilerin İlişkililiğine Dayalı İstatistiksel Sonuç veya Yorumları Tartışma",
  kazanim: "Başkaları tarafından oluşturulan iki kategorik değişkenli verilere dayalı sonuç ve yorumları eleştirel biçimde değerlendirir.",
  kaynak: kaynak("128-132"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Veri kaynağı ve örneklemi değerlendirir.",
    "Yorumlardaki yanlılık ve hataları tartışır."
  ],
  items: [
    {
      bi: 0,
      metin: "Başkası tarafından yapılan bir istatistiksel araştırmanın sonuçlarını değerlendirirken ilk olarak neye bakılmalıdır?",
      secenekler: ["Verinin nasıl ve kimlerden toplandığına", "Sonucun uzunluğuna", "Grafiğin rengine", "Araştırmanın adına"],
      cozum: "Kitapta araştırma süreci; problem, veri toplama, analiz ve yorum aşamalarıyla birlikte değerlendirilir (s.128-129).",
      fc: ["Araştırma değerlendirirken ilk adım nedir?", "Veri toplama yöntemine bakmak."]
    },
    {
      bi: 0,
      metin: "Bir araştırma 'gece yemek yiyenler daha fazla kilo alır' sonucuna ulaşmıştır. Bu sonuç için en uygun eleştiri hangisidir?",
      secenekler: ["İlişki nedensellik göstermez; uyku, hareket gibi başka etkenler de olabilir", "Sonuç kesinlikle yanlıştır", "Örneklem çok büyüktür", "Değişkenler sayısal olmalıdır"],
      cozum: "Kitabın 5. örneğinde bu tür bir sonucun başka değişkenler göz ardı edilerek kurulduğu tartışılır (s.129).",
      fc: ["Gece yemek-kilo ilişkisinde eksik olan nedir?", "Nedensellik kanıtı ve diğer etkenler."]
    },
    {
      bi: 0,
      metin: "Çok küçük bir örneklemle yapılan araştırmanın sonucu için hangisi doğrudur?",
      secenekler: ["Evrene genellenmesi güvenilir değildir", "Kesin sonuçtur", "Yanlılık içermez", "Daha doğrudur"],
      cozum: "Örneklem büyüklüğü azaldıkça sonuçların evreni temsil gücü azalır (s.128-131).",
      fc: ["Küçük örneklem ne yapar?", "Genellenebilirliği azaltır."]
    },
    {
      bi: 0,
      metin: "Bir grafikte dikey eksenin sıfırdan başlatılmaması neye yol açar?",
      secenekler: ["Aradaki fark olduğundan büyük görünür", "Fark olduğundan küçük görünür", "Grafik geçersiz olur", "Veri değişir"],
      cozum: "Eksenin kırpılması farkları abartır; yanıltıcı görselleştirme yanlılık yaratır (s.130-131).",
      fc: ["Eksen sıfırdan başlamazsa ne olur?", "Farklar abartılı görünür."]
    },
    {
      bi: 1,
      metin: "İki anket şirketi aynı konuda farklı sonuç açıklamıştır. En olası neden hangisidir?",
      secenekler: ["Örneklem ve soru biçimlerinin farklı olması", "Matematiğin farklı olması", "Yüzdelerin toplanamaması", "Tabloların büyüklüğü"],
      cozum: "Kitapta anket sonuçları arasındaki farkın örneklem ve yöntem farkından kaynaklanabileceği tartışılır (s.129).",
      fc: ["Anket sonuçları neden farklı çıkar?", "Örneklem ve yöntem farkı."]
    },
    {
      bi: 1,
      metin: "İstatistikte yanlılık (bias) neyi ifade eder?",
      secenekler: ["Sistematik olarak gerçek değerden sapma", "Rastgele ölçüm hatası", "Örneklemin büyük olması", "Yüzdelerin toplamının 100 olması"],
      cozum: "Yanlılık, örneklem veya ölçme yönteminden kaynaklanan sistematik sapmadır (s.128-130).",
      fc: ["Yanlılık nedir?", "Sistematik sapma."]
    },
    {
      bi: 1,
      metin: "Güvenilir bir istatistiksel kaynağın özelliği hangisidir?",
      secenekler: ["Veri toplama yöntemini ve örneklemini açıklaması", "Yalnız sonucu vermesi", "Grafik kullanmaması", "Yüzdeleri yuvarlamaması"],
      cozum: "Kaynağın yöntemini ve örneklemini açıklaması, sonucun denetlenebilirliğini sağlar (s.128-130).",
      fc: ["Güvenilir kaynak neyi açıklar?", "Yöntem ve örneklem."]
    },
    {
      bi: 1,
      metin: "Aynı veri kümesinden iki farklı yorum yapılabilmesinin nedeni nedir?",
      secenekler: ["Yorumcuların farklı varsayımlar ve bağlamlar kullanması", "Verinin iki kez toplanması", "Matematiğin değişmesi", "Tabloların farklı olması"],
      cozum: "Yorum, verinin yanı sıra varsayım ve bağlama dayanır; bu yüzden tartışılması gerekir (s.130-132).",
      fc: ["Aynı veriden neden farklı yorum çıkar?", "Farklı varsayım ve bağlam."]
    },
    {
      bi: 1,
      metin: "Bir araştırma sonucu paylaşılırken hangisinin verilmesi gerekir?",
      secenekler: ["Örneklem, yöntem ve belirsizlik bilgisi", "Yalnız en çarpıcı sayı", "Yalnız grafik", "Yalnız sonuç cümlesi"],
      cozum: "Sonucun değerlendirilebilmesi için örneklem, yöntem ve hata/belirsizlik bilgisi gerekir (s.131-132).",
      fc: ["Sonuç paylaşılırken ne verilir?", "Örneklem, yöntem, belirsizlik."]
    },
    {
      bi: 1,
      metin: "Bir yorumu çürütmek için en uygun yol hangisidir?",
      secenekler: ["Yeni ve daha temsili veriyle aynı analizi yinelemek", "Yorumu yok saymak", "Grafiği büyütmek", "Örneklemi küçültmek"],
      cozum: "Bilimsel tartışmada yorum, yeni veri veya yeniden analizle sınanır (s.132).",
      fc: ["Bir yorum nasıl çürütülür?", "Yeni veriyle sınamak."]
    }
  ]
});
