#!/usr/bin/env node
/* ============================================================
   KİMYA 10 · 1. TEMA — kitaptan sıfırdan havuzlar
   ------------------------------------------------------------
   Kaynak: MEB Kimya 10 (2025) — `kitap-kaynak` dalındaki
   kimya.json. Basılı sayfa = PDF sayfası − 1.

     1.1.1 Kimyasal Tepkimelerin Oluşumu                 s.21-34
     1.1.2 Kimyasal Tepkime Türleri                      s.35-46
     1.1.3 Mol Kavramı                                   s.47-60
     1.1.4 ... Denklemlerinin Denkleştirilmesi           s.61-67
     1.1.5 Kimyasal (Stokiyometrik) Hesaplamalar         s.68-76
     1.2.1 Gazların Özellikleri ve Gaz Yasaları          s.77-93
     1.2.2 Gazların Kinetik Moleküler Teorisi            s.94-97
     1.2.3 İdeal Gaz Yasası                              s.98-105
     1.2.4 Graham Difüzyon ve Efüzyon Yasası             s.106-115

   Kullanım: node docs/uretim/uretim/kimya-t1.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Kimya";
const DOSYA = "kimya-10.pdf (MEB, 2025)";
const kaynak = s => "Kimya 10 ders kitabı, s." + s;

/* ---------------------------------------------------- 1.1.1 */
yazKonu({
  konu_id: "kimya_10_u01_k01",
  ders: DERS, tema: 1, tema_adi: "Etkileşim",
  baslik: "1.1.1 Kimyasal Tepkimelerin Oluşumu",
  kazanim: "Kimyasal değişimi gözlemlenebilir göstergeleriyle açıklar ve tepkime denklemini tepken-ürün ilişkisiyle yorumlar.",
  kaynak: kaynak("21-34"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Kimyasal değişimin göstergelerini ayırt eder.",
    "Tepkime denkleminde tepken, ürün ve katalizörü belirler."
  ],
  items: [
    {
      bi: 0,
      metin: "Kitaba göre kimyasal değişim nasıl tanımlanır?",
      secenekler: ["Maddelerin iç yapılarında ve bileşenlerinde meydana gelen değişim", "Yalnızca hâl değişimi", "Yalnızca sıcaklık değişimi", "Maddenin kütlesinin azalması"],
      cozum: "Kimyasal değişim, maddelerin iç yapıları ve bileşenlerinde meydana gelen değişimdir; madde kimliğini kaybeder, bağlar yeniden düzenlenir (s.25).",
      fc: ["Kimyasal değişim nedir?", "İç yapı ve bileşenlerin değişmesi; yeni madde oluşur."]
    },
    {
      bi: 0,
      metin: "Aşağıdakilerden hangisi kimyasal değişimin gözlemlenebilir göstergelerinden biri değildir?",
      secenekler: ["Kütlenin her zaman azalması", "Renk değişimi", "Gaz çıkışı", "Çökelme"],
      cozum: "Kitapta gösterge olarak renk, koku, gaz çıkışı, katı oluşumu, ışık, enerji, pH ve iletkenlik değişimi sayılır; kütle korunur (s.25-26).",
      fc: ["Kimyasal değişimin göstergeleri nelerdir?", "Renk, koku, gaz çıkışı, katı oluşumu, ışık, enerji, pH, iletkenlik."]
    },
    {
      bi: 0,
      metin: "Havai fişeklerde sodyum tuzları hangi rengi verir?",
      secenekler: ["Sarı", "Mavi", "Yeşil", "Kırmızı"],
      cozum: "Kitaba göre bakır mavi, baryum yeşil, sodyum sarı, stronsiyum kırmızı renk verir (s.21).",
      fc: ["Na⁺ tuzlarının alev rengi nedir?", "Sarı."]
    },
    {
      bi: 0,
      metin: "Bir tepkime denkleminde okun sol tarafında yer alan maddelere ne denir?",
      secenekler: ["Tepkenler", "Ürünler", "Katalizörler", "Çözücüler"],
      cozum: "Okun solundaki maddeler tepkenler (tepkimeye girenler), sağdakiler ürünlerdir (s.25).",
      fc: ["Okun solundaki maddelere ne denir?", "Tepkenler."]
    },
    {
      bi: 0,
      metin: "Tepkime denkleminde okun üzerinde yazılan ve tepkimeye girmeden hızlandıran maddeye ne denir?",
      secenekler: ["Katalizör", "Tepken", "Ürün", "Çökelek"],
      cozum: "Katalizör ok üzerinde gösterilir; tepkimede harcanmaz (s.25).",
      fc: ["Ok üzerindeki madde nedir?", "Katalizör."]
    },
    {
      bi: 1,
      metin: "CaCO3(k) + 2HCl(suda) → CaCl2(suda) + H2O(s) + CO2(g) denkleminde ürünler hangileridir?",
      secenekler: ["CaCl2, H2O ve CO2", "CaCO3 ve HCl", "Yalnız CO2", "Yalnız CaCl2"],
      cozum: "Okun sağındaki CaCl2, H2O ve CO2 ürünlerdir; CaCO3 ile HCl tepkenlerdir (s.25).",
      fc: ["CaCO3 + HCl tepkimesinin ürünleri nelerdir?", "CaCl2, H2O ve CO2."]
    },
    {
      bi: 1,
      metin: "Çift yönlü (geri dönebilen) tepkimeler denklemde hangi okla gösterilir?",
      secenekler: ["⇌", "→", "↑", "↓"],
      cozum: "Kitapta çift yönlü tepkimelerin tepkime oku ⇌ ile gösterildiği belirtilir (s.25).",
      fc: ["Kimyasal denklemde ⇌ sembolü neyi gösterir?", "Tepkimenin çift yönlü olduğunu."]
    },
    {
      bi: 1,
      metin: "Demir bir çivinin açık havada paslanması sırasında aşağıdakilerden hangisi gözlenir?",
      secenekler: ["Renk değişimi ve yeni katı oluşumu", "Yalnızca hâl değişimi", "Kütlenin tamamen yok olması", "Gaz çıkışıyla birlikte soğuma"],
      cozum: "Paslanmada yüzeyde kızıl-kahverengi yeni katı oluşur; renk değişimi ve katı oluşumu kimyasal değişim göstergesidir (s.25-26).",
      fc: ["Paslanmada hangi göstergeler görülür?", "Renk değişimi ve katı oluşumu."]
    },
    {
      bi: 1,
      metin: "Bir öğrenci 'Madde yandığında kütlesi azalır.' diyor. Kitaba göre doğru yorum hangisidir?",
      secenekler: ["Oluşan gazlar ortamdan uzaklaştığı için kütle azalmış görünür; toplam kütle korunur", "Kimyasal değişimde kütle her zaman azalır", "Yanma kimyasal değişim değildir", "Kütle korunumu yalnız fiziksel değişimde geçerlidir"],
      cozum: "Kitap, Lavoisier'in kütlenin korunumu çalışmalarına dayanarak kimyasal tepkimelerde toplam kütlenin korunduğunu vurgular (s.68).",
      fc: ["Yanmada kütle gerçekten azalır mı?", "Hayır; gaz ürünler uzaklaşır, toplam kütle korunur."]
    },
    {
      bi: 1,
      metin: "Kimyasal tepkimelerin tanecik düzeyinde modellenmesinde aşağıdakilerden hangisine dikkat edilmez?",
      secenekler: ["Taneciklerin renklerinin gerçek atom renkleri olmasına", "Tanecik sayılarının denkleme uygun olmasına", "Taneciklerin hareketinin gösterilmesine", "Bağların yeniden düzenlenmesine"],
      cozum: "Modelde tanecik sayısı, hareket ve bağların yeniden düzenlenmesi gösterilir; renkler temsilîdir (s.30-31).",
      fc: ["Tepkime modelinde neler gösterilir?", "Tanecik sayısı, hareket, bağların yeniden düzenlenmesi."]
    }
  ]
});

/* ---------------------------------------------------- 1.1.2 */
yazKonu({
  konu_id: "kimya_10_u01_k02",
  ders: DERS, tema: 1, tema_adi: "Etkileşim",
  baslik: "1.1.2 Kimyasal Tepkime Türleri",
  kazanim: "Çökelme, indirgenme-yükseltgenme ve asit-baz tepkimelerini ayırt eder, net iyon denklemini yazar.",
  kaynak: kaynak("35-46"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Tepkime türlerini örnekleriyle açıklar.",
    "Net iyon denklemini ve seyirci iyonları belirler."
  ],
  items: [
    {
      bi: 0,
      metin: "Kimyasal tepkimelerin türlere ayrılmasının temel yararı nedir?",
      secenekler: ["Hangi ürünün oluşacağının ve tepkimenin nasıl gerçekleşeceğinin tahmin edilebilmesi", "Tepkimeyi durdurmak", "Kütleyi artırmak", "Sıcaklığı sabitlemek"],
      cozum: "Kitaba göre sınıflandırma sayesinde hangi ürünün oluşacağı ve tepkimenin nasıl gerçekleşeceği tahmin edilebilir (s.35).",
      fc: ["Tepkimeleri sınıflandırmanın yararı nedir?", "Ürün ve sürecin tahmin edilebilmesi."]
    },
    {
      bi: 0,
      metin: "Bir atom elektron verirken diğeri elektron alıyorsa bu tepkime türü hangisidir?",
      secenekler: ["İndirgenme-yükseltgenme tepkimeleri", "Çökelme tepkimeleri", "Nötralleşme tepkimeleri", "Fiziksel değişim"],
      cozum: "Elektron alma eğilimi yüksek madde ile elektron verme eğilimi yüksek madde arasındaki elektron transferine dayanan tepkimeler indirgenme-yükseltgenme tepkimeleridir (s.41).",
      fc: ["Elektron transferine dayanan tepkime nedir?", "İndirgenme-yükseltgenme tepkimesi."]
    },
    {
      bi: 0,
      metin: "Sulu ortamda H⁺ ve OH⁻ iyonlarının birleşerek su oluşturduğu tepkimeye ne denir?",
      secenekler: ["Nötralleşme tepkimesi", "Çökelme tepkimesi", "Yanma tepkimesi", "Ayrışma tepkimesi"],
      cozum: "H⁺(suda) + OH⁻(suda) → H2O(s) net iyon denklemi nötralleşme tepkimesidir (s.44).",
      fc: ["H⁺ + OH⁻ → H2O hangi tepkimedir?", "Nötralleşme."]
    },
    {
      bi: 0,
      metin: "Tepkime denkleminde hem tepken hem ürün tarafında değişmeden yer alan iyonlara ne denir?",
      secenekler: ["Seyirci iyonlar", "Katalizör iyonlar", "Amfoter iyonlar", "Aktif iyonlar"],
      cozum: "Tuzu oluşturan ve çözeltide kalan iyonlar sadeleştirildiğinde geriye kalanlar seyirci iyonlardır (s.44).",
      fc: ["Seyirci iyon nedir?", "Denklemin iki tarafında değişmeden kalan iyon."]
    },
    {
      bi: 1,
      metin: "Gümüş nitrat çözeltisi, klor iyonu içeren bir çözeltiye eklendiğinde beyaz çökelek oluşur. Bu çökeleğin formülü hangisidir?",
      secenekler: ["AgCl", "AgNO3", "NaCl", "Ag2O"],
      cozum: "Kitapta klor iyonlarının gümüş iyonlarıyla birleşerek beyaz renkli gümüş klorür (AgCl) katısı çöktürdüğü belirtilir (s.41).",
      fc: ["AgNO3 + Cl⁻ tepkimesinde hangi çökelek oluşur?", "AgCl (beyaz)."]
    },
    {
      bi: 1,
      metin: "HCl(suda) + NaOH(suda) → NaCl(suda) + H2O(s) tepkimesinin net iyon denklemi hangisidir?",
      secenekler: ["H⁺(suda) + OH⁻(suda) → H2O(s)", "Na⁺ + Cl⁻ → NaCl", "HCl → H⁺ + Cl⁻", "Na⁺ + OH⁻ → NaOH"],
      cozum: "Na⁺ ve Cl⁻ seyirci iyonlardır; sadeleştirildiğinde H⁺ + OH⁻ → H2O kalır (s.44).",
      fc: ["HCl + NaOH net iyon denklemi nedir?", "H⁺ + OH⁻ → H2O"]
    },
    {
      bi: 1,
      metin: "Her asit-baz tepkimesi nötralleşme midir?",
      secenekler: ["Hayır; nötralleşme sulu ortamda gerçekleşir", "Evet, hepsi nötralleşmedir", "Yalnız gaz hâlinde nötralleşme olur", "Yalnız zayıf asitlerde nötralleşme olur"],
      cozum: "Kitaba göre her asit-baz tepkimesi nötralleşme değildir; nötralleşme tepkimeleri sulu ortamda gerçekleşir (ör. HCl(g) + NH3(g) → NH4Cl(k)) (s.44).",
      fc: ["Nötralleşmenin koşulu nedir?", "Sulu ortamda H⁺ ile OH⁻ birleşmesi."]
    },
    {
      bi: 1,
      metin: "Mg(k) + 2HCl(suda) → MgCl2(suda) + H2(g) tepkimesinde yükseltgenen madde hangisidir?",
      secenekler: ["Mg", "HCl", "MgCl2", "H2"],
      cozum: "Mg, Mg²⁺'ye dönüşerek elektron verir; elektron veren madde yükseltgenir (s.41-42).",
      fc: ["Mg + HCl tepkimesinde hangi madde yükseltgenir?", "Mg (elektron verir)."]
    },
    {
      bi: 1,
      metin: "Aşağıdaki tepkimelerden hangisi çökelme tepkimesidir?",
      secenekler: ["BaCl2(suda) + Na2SO4(suda) → BaSO4(k) + 2NaCl(suda)", "CH4 + 2O2 → CO2 + 2H2O", "H⁺ + OH⁻ → H2O", "CaCO3 → CaO + CO2"],
      cozum: "Suda çözünmeyen BaSO4 katısının oluşması çökelmedir (s.39-41).",
      fc: ["Çökelme tepkimesine örnek ver.", "BaCl2 + Na2SO4 → BaSO4(k) + 2NaCl"]
    },
    {
      bi: 1,
      metin: "Analitik kimya laboratuvarında çökelme tepkimeleri ne amaçla kullanılır?",
      secenekler: ["Çözeltideki iyonların varlığını belirlemek için", "Çözeltiyi ısıtmak için", "Gaz üretmek için", "Kütleyi ölçmek için"],
      cozum: "Kitaba göre çökelme sonucu oluşan katıdan yola çıkılarak çözeltideki iyonlar tespit edilir (s.41).",
      fc: ["Çökelme tepkimesi analitik kimyada neye yarar?", "İyon tespitine."]
    }
  ]
});

/* ---------------------------------------------------- 1.1.3 */
yazKonu({
  konu_id: "kimya_10_u01_k03",
  ders: DERS, tema: 1, tema_adi: "Etkileşim",
  baslik: "1.1.3 Mol Kavramı",
  kazanim: "Mol, kütle ve tanecik sayısı arasındaki ilişkiyi kullanarak hesaplama yapar.",
  kaynak: kaynak("47-60"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Avogadro sayısı ile mol ilişkisini açıklar.",
    "Mol-kütle ve mol-tanecik sayısı hesaplamalarını yapar."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir mol maddede kaç tanecik bulunur?",
      secenekler: ["6,02 · 10²³", "6,02 · 10²²", "1,00 · 10²³", "3,01 · 10²³"],
      cozum: "Bir mol, 6,02 · 10²³ tanecik içerir (Avogadro sayısı) (s.50-57).",
      fc: ["1 mol kaç taneciktir?", "6,02 · 10²³"]
    },
    {
      bi: 0,
      metin: "Mol sayısı, kütle ve mol kütlesi arasındaki bağıntı hangisidir?",
      secenekler: ["n = m / MA", "n = m · MA", "n = MA / m", "n = m + MA"],
      cozum: "Kitapta n = m / MA bağıntısı verilir; MA mol kütlesidir (s.57).",
      fc: ["Mol sayısı nasıl bulunur?", "n = m / MA"]
    },
    {
      bi: 0,
      metin: "Mol kavramının kimyada kullanılma nedeni nedir?",
      secenekler: ["Tanecikleri tek tek saymak yerine belirli sayıda tanecikle çalışmayı sağlaması", "Kütleyi ortadan kaldırması", "Sıcaklığı ölçmesi", "Hacmi sabitlemesi"],
      cozum: "Atomları tek tek saymak pratik olmadığından mol, madde miktarını belirli sayıda tanecikle ilişkilendirir (s.50-51, s.57).",
      fc: ["Mol neden kullanılır?", "Tanecikleri saymak yerine miktarı ifade etmek için."]
    },
    {
      bi: 1,
      metin: "126 g nitrik asit (HNO3) kaç moldür? (H:1, N:14, O:16)",
      secenekler: ["2", "1", "3", "4"],
      cozum: "MA = 1 + 14 + 3·16 = 63 g/mol; n = 126/63 = 2 mol (kitabın örneği, s.57).",
      fc: ["126 g HNO3 kaç moldür?", "2 mol"]
    },
    {
      bi: 1,
      metin: "12,04 · 10²³ tane atom içeren CH4 kaç moldür?",
      secenekler: ["2", "1", "4", "12"],
      cozum: "n = N/NA = 12,04·10²³ / 6,02·10²³ = 2 mol (s.57).",
      fc: ["12,04·10²³ tanecik kaç moldür?", "2 mol"]
    },
    {
      bi: 1,
      metin: "108 g gümüş (Ag) kaç moldür? (Ag: 108 g/mol)",
      secenekler: ["1", "2", "0,5", "108"],
      cozum: "n = 108/108 = 1 mol (kitaptaki 1 mol = 108 g Ag bilgisi, s.54).",
      fc: ["n = m/MA bağıntısındaki MA neyi gösterir?", "Mol kütlesini (g/mol)."]
    },
    {
      bi: 1,
      metin: "0,5 mol CO2 kaç gramdır? (C:12, O:16)",
      secenekler: ["22", "44", "11", "88"],
      cozum: "MA(CO2) = 12 + 32 = 44 g/mol; m = 0,5 · 44 = 22 g (s.57-59).",
      fc: ["Kütle mol sayısından nasıl bulunur?", "m = n·MA bağıntısıyla."]
    },
    {
      bi: 1,
      metin: "1 mol C ile 1 mol Cu için hangisi doğrudur?",
      secenekler: ["Aynı sayıda atom içerirler, kütleleri farklıdır", "Kütleleri eşittir", "Atom sayıları farklıdır", "İkisi de 12 g'dır"],
      cozum: "Kitaptaki temsilî görsele göre farklı elementlerin birer molleri aynı sayıda atom içerir; kütleleri mol kütlesine göre değişir (1 mol C = 12 g, 1 mol Cu = 63,5 g) (s.54).",
      fc: ["1 mol C ile 1 mol Cu'nun atom sayısı eşit mi?", "Evet; kütleleri farklıdır."]
    },
    {
      bi: 1,
      metin: "2 mol H2O kaç tane molekül içerir?",
      secenekler: ["12,04 · 10²³", "6,02 · 10²³", "3,01 · 10²³", "2 · 10²³"],
      cozum: "N = n · NA = 2 · 6,02·10²³ = 12,04·10²³ molekül (s.57-59).",
      fc: ["2 mol su kaç moleküldür?", "12,04 · 10²³"]
    },
    {
      bi: 1,
      metin: "36 g su kaç moldür? (H:1, O:16)",
      secenekler: ["2", "1", "18", "36"],
      cozum: "MA(H2O) = 18 g/mol; n = 36/18 = 2 mol (s.57).",
      fc: ["Mol sayısı kütleden nasıl bulunur?", "n = m/MA bağıntısıyla."]
    }
  ]
});

/* ---------------------------------------------------- 1.1.4 */
yazKonu({
  konu_id: "kimya_10_u01_k04",
  ders: DERS, tema: 1, tema_adi: "Etkileşim",
  baslik: "1.1.4 Kimyasal Tepkime Denklemlerinin Denkleştirilmesi",
  kazanim: "Kimyasal tepkime denklemlerini en küçük tam sayı katsayılarla denkleştirir.",
  kaynak: kaynak("61-67"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Denkleştirmede korunan nicelikleri açıklar.",
    "Verilen tepkime denklemini denkleştirir."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir kimyasal denklem denkleştirilirken hangi nicelik korunur?",
      secenekler: ["Her elementin atom sayısı", "Molekül sayısı", "Gaz hacmi", "Tanecik sayısı"],
      cozum: "Denkleştirmede her elementin atom sayısı iki tarafta eşitlenir; molekül ve tanecik sayısı korunmayabilir (s.64-65).",
      fc: ["Denkleştirmede ne korunur?", "Elementlerin atom sayısı."]
    },
    {
      bi: 0,
      metin: "Denklem katsayıları için hangisi esastır?",
      secenekler: ["En küçük tam sayılar olması", "En büyük sayılar olması", "Kesirli olması", "Sıfır olması"],
      cozum: "Kitapta denkleştirmenin en uygun ve en küçük tam sayılarla yapılması istenir (s.65).",
      fc: ["Katsayılar nasıl seçilir?", "En küçük tam sayılar."]
    },
    {
      bi: 0,
      metin: "Denkleştirilmiş bir denklemde katsayılar aynı zamanda neyi verir?",
      secenekler: ["Maddelerin mol oranlarını", "Sıcaklıklarını", "Yoğunluklarını", "Renklerini"],
      cozum: "Katsayılar tepken ve ürünlerin hangi oranlarda birleştiğini, yani mol oranlarını gösterir (s.64-65).",
      fc: ["Katsayılar neyi gösterir?", "Mol oranlarını."]
    },
    {
      bi: 1,
      metin: "H2 + O2 → H2O denkleminin denkleştirilmiş hâli hangisidir?",
      secenekler: ["2H2 + O2 → 2H2O", "H2 + O2 → H2O", "H2 + 2O2 → H2O", "4H2 + O2 → 2H2O"],
      cozum: "Solda 4 H ve 2 O, sağda 4 H ve 2 O olacak biçimde 2H2 + O2 → 2H2O yazılır (s.64-66).",
      fc: ["H2 + O2 → H2O nasıl denkleştirilir?", "2H2 + O2 → 2H2O"]
    },
    {
      bi: 1,
      metin: "Termit tepkimesi Fe2O3 + Al → Al2O3 + Fe için katsayılar hangisidir?",
      secenekler: ["1, 2, 1, 2", "1, 1, 1, 1", "2, 1, 2, 1", "1, 2, 2, 1"],
      cozum: "Fe2O3 + 2Al → Al2O3 + 2Fe; her iki tarafta 2 Fe, 2 Al ve 3 O vardır (s.65-66).",
      fc: ["Termit tepkimesi denklemi nedir?", "Fe2O3 + 2Al → Al2O3 + 2Fe"]
    },
    {
      bi: 1,
      metin: "Al + BaO → Al2O3 + Ba denkleminin katsayıları sırasıyla hangisidir?",
      secenekler: ["2, 3, 1, 3", "1, 1, 1, 1", "2, 1, 1, 3", "3, 2, 1, 2"],
      cozum: "2Al + 3BaO → Al2O3 + 3Ba; Al 2, Ba 3, O 3 eşitlenir (kitabın 5. adımı, s.70).",
      fc: ["2Al + 3BaO → ? denklemi nedir?", "2Al + 3BaO → Al2O3 + 3Ba"]
    },
    {
      bi: 1,
      metin: "CH4 + O2 → CO2 + H2O denkleminin katsayıları hangisidir?",
      secenekler: ["1, 2, 1, 2", "1, 1, 1, 1", "1, 2, 2, 1", "2, 2, 1, 2"],
      cozum: "CH4 + 2O2 → CO2 + 2H2O; C 1, H 4, O 4 eşitlenir (s.65-67).",
      fc: ["CH4 yanması denklemi nedir?", "CH4 + 2O2 → CO2 + 2H2O"]
    },
    {
      bi: 1,
      metin: "H2SO4 + KOH → K2SO4 + H2O denkleminin katsayıları hangisidir?",
      secenekler: ["1, 2, 1, 2", "1, 1, 1, 1", "2, 2, 1, 2", "1, 2, 2, 1"],
      cozum: "H2SO4 + 2KOH → K2SO4 + 2H2O; K, S ve O sayıları eşitlenir (s.66).",
      fc: ["H2SO4 + KOH denkleştirilmiş hâli nedir?", "H2SO4 + 2KOH → K2SO4 + 2H2O"]
    },
    {
      bi: 1,
      metin: "Denkleştirme yapılırken genellikle hangi element en sona bırakılır?",
      secenekler: ["Oksijen ve hidrojen", "Metaller", "Karbon", "Azot"],
      cozum: "Kitaptaki tartışmada denkleştirmenin daha az basamakla bitmesi için oksijen ve hidrojenin sona bırakılması önerilir (s.64).",
      fc: ["Denkleştirmenin ilk adımı nedir?", "En karmaşık formüllü bileşikteki elementten başlanır."]
    },
    {
      bi: 1,
      metin: "2H2 + O2 → 2H2O denkleminde 4 mol H2 ile kaç mol O2 tepkimeye girer?",
      secenekler: ["2", "1", "4", "8"],
      cozum: "Katsayı oranı H2:O2 = 2:1 olduğundan 4 mol H2 için 2 mol O2 gerekir (s.64-65).",
      fc: ["4 mol H2 için kaç mol O2 gerekir?", "2 mol"]
    }
  ]
});

/* ---------------------------------------------------- 1.1.5 */
yazKonu({
  konu_id: "kimya_10_u01_k05",
  ders: DERS, tema: 1, tema_adi: "Etkileşim",
  baslik: "1.1.5 Kimyasal (Stokiyometrik) Hesaplamalar",
  kazanim: "Denkleştirilmiş tepkime denklemini kullanarak madde miktarı, kütle ve tanecik sayısı hesaplar.",
  kaynak: kaynak("68-76"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Katsayı oranından mol hesaplar.",
    "Kütle ve verim hesaplamaları yapar."
  ],
  items: [
    {
      bi: 0,
      metin: "Kimyasal hesaplamalarda katsayıların anlamı nedir?",
      secenekler: ["Maddelerin mol sayıları oranı", "Kütleleri oranı", "Hacimleri oranı", "Yoğunlukları oranı"],
      cozum: "Kitaba göre katsayılar tepken ve ürünlerin mol oranlarını verir; hesaplamalar bu orana göre yapılır (s.69-70).",
      fc: ["Hesaplamada katsayılar neyi verir?", "Mol oranını."]
    },
    {
      bi: 0,
      metin: "Kitapta stokiyometri hangi günlük örnekle açıklanır?",
      secenekler: ["2 bisküvi + 1 lokum → lokumlu bisküvi", "1 ekmek + 1 peynir → sandviç", "2 kalem + 1 defter → okul çantası", "3 çay + 1 şeker → çay"],
      cozum: "Kitap, miktarların oranının sabit kalmasını lokumlu bisküvi (kıstırma) örneğiyle açıklar (s.68-69).",
      fc: ["Stokiyometri hangi örnekle anlatılır?", "2 bisküvi + 1 lokum → lokumlu bisküvi."]
    },
    {
      bi: 0,
      metin: "Kütlenin korunumu kanunu kimin çalışmalarına dayanır?",
      secenekler: ["Lavoisier", "Boyle", "Avogadro", "Graham"],
      cozum: "Kitapta Lavoisier'nin kütlenin korunumu kanunu ile ilgili çalışmaları anılır (s.68).",
      fc: ["Kütlenin korunumu kime aittir?", "Lavoisier."]
    },
    {
      bi: 1,
      metin: "2Al + 3BaO → Al2O3 + 3Ba tepkimesinde 2 mol Al2O3 elde edilirken kaç mol Al harcanır?",
      secenekler: ["4", "2", "3", "6"],
      cozum: "Katsayı oranı Al:Al2O3 = 2:1 olduğundan 2 mol Al2O3 için 4 mol Al gerekir (s.70).",
      fc: ["2 mol Al2O3 için kaç mol Al gerekir?", "4 mol"]
    },
    {
      bi: 1,
      metin: "Aynı tepkimede 2 mol Al2O3 elde edilirken harcanan Al kaç gramdır? (Al:27)",
      secenekler: ["108", "54", "27", "216"],
      cozum: "4 mol Al = 4·27 = 108 g (s.70).",
      fc: ["4 mol Al kaç gramdır?", "108 g"]
    },
    {
      bi: 1,
      metin: "2Al + 3Cl2 → 2AlCl3 tepkimesinde 2 mol Al tamamen tepkimeye girdiğinde kaç mol Cl2 harcanır?",
      secenekler: ["3", "2", "4", "1,5"],
      cozum: "Katsayı oranı Al:Cl2 = 2:3 → 2 mol Al için 3 mol Cl2 (s.70-72).",
      fc: ["2 mol Al için kaç mol Cl2 gerekir?", "3 mol"]
    },
    {
      bi: 1,
      metin: "2H2S + SO2 → 3S + 2H2O tepkimesinde 0,2 mol SO2 tepkimeye girerse kaç gram S oluşur? (S:32)",
      secenekler: ["19,2", "9,6", "6,4", "32"],
      cozum: "SO2 1 mol iken S 3 mol oluşur; 0,2 mol SO2 için 0,6 mol S = 0,6·32 = 19,2 g (kitabın 2. sorusu, s.74).",
      fc: ["0,2 mol SO2'den kaç g S oluşur?", "19,2 g"]
    },
    {
      bi: 1,
      metin: "Aynı tepkimede kuramsal olarak 19,2 g S oluşması gerekirken 9,6 g S elde edilmiştir. Tepkime verimi yüzde kaçtır?",
      secenekler: ["%50", "%100", "%25", "%75"],
      cozum: "Verim = gerçek/kuramsal = 9,6/19,2 = 0,5 → %50 (s.74).",
      fc: ["9,6 g / 19,2 g verim kaçtır?", "%50"]
    },
    {
      bi: 1,
      metin: "2H2SO4 + C12H22O11 → 12C + 13H2O + 2SO2 + O2 tepkimesinde 0,5 mol O2 oluştuğunda kaç mol sakkaroz harcanır?",
      secenekler: ["0,5", "1", "2", "13"],
      cozum: "Sakkaroz ile O2 katsayıları 1:1 olduğundan 0,5 mol sakkaroz harcanır (s.74).",
      fc: ["0,5 mol O2 için kaç mol sakkaroz?", "0,5 mol"]
    },
    {
      bi: 1,
      metin: "Aynı tepkimede 0,5 mol O2 oluştuğunda kaç gram su oluşur? (H:1, O:16)",
      secenekler: ["117", "13", "234", "58,5"],
      cozum: "13 mol H2O oluşur: 13·0,5 = 6,5 mol; MA(H2O) = 18 → 6,5·18 = 117 g (s.74).",
      fc: ["0,5 mol O2'den kaç g su oluşur?", "117 g"]
    }
  ]
});

/* ---------------------------------------------------- 1.2.1 */
yazKonu({
  konu_id: "kimya_10_u01_k06",
  ders: DERS, tema: 1, tema_adi: "Etkileşim",
  baslik: "1.2.1 Gazların Özellikleri ve Gaz Yasaları",
  kazanim: "Gazların özelliklerini açıklar; Boyle, Charles, Gay Lussac ve Avogadro yasalarını uygular.",
  kaynak: kaynak("77-93"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Gazların özelliklerini ve birimlerini açıklar.",
    "Gaz yasalarıyla hesaplama yapar."
  ],
  items: [
    {
      bi: 0,
      metin: "Deniz seviyesinde açık hava basıncı kaç atmosfer kabul edilir?",
      secenekler: ["1", "0,5", "76", "760"],
      cozum: "Kitaba göre deniz seviyesinde açık hava basıncı 1 atmosfer (atm) kabul edilir (s.81).",
      fc: ["1 atmosfer kaç mmHg'dir?", "76 cmHg = 760 mmHg."]
    },
    {
      bi: 0,
      metin: "Aşağıdaki eşitliklerden hangisi doğrudur?",
      secenekler: ["1 atm = 760 mmHg", "1 atm = 76 mmHg", "1 atm = 101 mmHg", "1 atm = 760 Pa"],
      cozum: "Kitaptaki dönüşüme göre 1 atm = 76 cmHg = 760 mmHg = 101 325 Pa = 760 torr (s.88).",
      fc: ["1 atm kaç mmHg'dir?", "760 mmHg"]
    },
    {
      bi: 0,
      metin: "Boyle Yasası'na göre sabit sıcaklıkta belirli miktar gazın basıncı ile hacmi nasıl değişir?",
      secenekler: ["Ters orantılıdır", "Doğru orantılıdır", "Değişmez", "Karesiyle orantılıdır"],
      cozum: "Sabit sıcaklıkta basınç ile hacim ters orantılıdır: PV = sabit, P1V1 = P2V2 (s.89).",
      fc: ["Boyle Yasası'nda P ile V nasıl değişir?", "Ters orantılı."]
    },
    {
      bi: 1,
      metin: "Sabit sıcaklıkta 4 L hacimde 2 atm basınç yapan gazın hacmi 1 L'ye düşürülürse basıncı kaç atm olur?",
      secenekler: ["8", "2", "4", "0,5"],
      cozum: "P1V1 = P2V2 → 2·4 = P2·1 → P2 = 8 atm (kitabın örneği, s.89).",
      fc: ["2 atm 4 L → 1 L'de kaç atm?", "8 atm"]
    },
    {
      bi: 1,
      metin: "Sabit hacimli kapta 27 °C'ta 1 atm basınç yapan gazın basıncını 3 atm yapmak için sıcaklık kaç °C olmalıdır?",
      secenekler: ["627", "900", "327", "300"],
      cozum: "T1 = 273 + 27 = 300 K; 1/300 = 3/T2 → T2 = 900 K → 900 − 273 = 627 °C (s.91).",
      fc: ["27 °C 1 atm → 3 atm kaç °C olur?", "627 °C (900 K)"]
    },
    {
      bi: 1,
      metin: "Sabit basınçta bir gazın hacmi sıcaklıkla nasıl değişir?",
      secenekler: ["Mutlak sıcaklıkla doğru orantılı artar", "Ters orantılı azalır", "Değişmez", "Sıcaklığın karesiyle orantılıdır"],
      cozum: "Charles Yasası'na göre sabit basınçta V/T = sabit, yani hacim mutlak sıcaklıkla doğru orantılıdır (s.90).",
      fc: ["Charles Yasası nedir?", "V/T = sabit"]
    },
    {
      bi: 1,
      metin: "Sabit sıcaklık ve basınçta gazın hacmi madde miktarıyla nasıl değişir?",
      secenekler: ["Mol sayısıyla doğru orantılıdır", "Mol sayısıyla ters orantılıdır", "Değişmez", "Mol sayısının kareköküyle orantılıdır"],
      cozum: "Avogadro Yasası'na göre V ∝ n; aynı koşullarda eşit hacimde eşit sayıda tanecik bulunur (s.92).",
      fc: ["Avogadro Yasası nedir?", "V ∝ n"]
    },
    {
      bi: 1,
      metin: "Sabit sıcaklıkta bir gazın basınç-hacim grafiğinde 4 atm'de hacim x, 6 atm'de hacim 2 L ise x kaç litredir?",
      secenekler: ["3", "2", "4", "12"],
      cozum: "4·x = 6·2 → x = 3 L (kitabın grafikli örneği, s.94).",
      fc: ["4 atm'de x, 6 atm'de 2 L ise x kaçtır?", "3 L"]
    },
    {
      bi: 1,
      metin: "Sabit sıcaklıkta 6 atm basınçta 2 L hacim kaplayan gazın hacmi 12 L olursa basıncı kaç atm olur?",
      secenekler: ["1", "2", "3", "6"],
      cozum: "P₁V₁ = P₂V₂ → 6·2 = y·12 → y = 1 atm (s.94).",
      fc: ["Sabit sıcaklıkta basınç ile hacim arasındaki ilişki nedir?", "Ters orantılıdır; P·V sabit kalır."]
    },
    {
      bi: 1,
      metin: "Gazlarla ilgili aşağıdakilerden hangisi yanlıştır?",
      secenekler: ["Gazlar bulundukları kabın yalnızca bir kısmını doldurur", "Gaz tanecikleri arasında büyük boşluklar vardır", "Gazlar sıkıştırılabilir", "Gazlar birbiri içinde yayılır"],
      cozum: "Gazlar bulundukları kabın hacmini tamamen doldurur ve şeklini alır (s.81).",
      fc: ["Gazlar kabın tamamını doldurur mu?", "Evet."]
    }
  ]
});

/* ---------------------------------------------------- 1.2.2 */
yazKonu({
  konu_id: "kimya_10_u01_k07",
  ders: DERS, tema: 1, tema_adi: "Etkileşim",
  baslik: "1.2.2 Gazların Kinetik Moleküler Teorisi",
  kazanim: "Gazların kinetik moleküler teori varsayımlarını ve gaz basıncının kökenini açıklar.",
  kaynak: kaynak("94-97"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Kinetik moleküler teorinin varsayımlarını açıklar.",
    "Gaz basıncı ve sıcaklığını tanecik düzeyinde yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Kinetik moleküler teoriye göre gaz tanecikleri nasıl hareket eder?",
      secenekler: ["Sürekli ve rastgele", "Duran hâlde", "Yalnız dikey yönde", "Kabın tabanında"],
      cozum: "Teoriye göre gaz tanecikleri sürekli ve rastgele hareket eder; çarpışana kadar doğrusal ilerler (s.94-95, s.107).",
      fc: ["Kinetik moleküler teorinin temel varsayımı nedir?", "Gaz tanecikleri sürekli ve rastgele hareket eder."]
    },
    {
      bi: 0,
      metin: "Kinetik moleküler teoriye göre gazların kap çeperine uyguladığı basıncın nedeni nedir?",
      secenekler: ["Taneciklerin kap çeperine çarpması", "Taneciklerin birbirine yapışması", "Kabın ısınması", "Taneciklerin durması"],
      cozum: "Gazlar bulundukları kabın çeperlerine çarparak kuvvet oluşturur; bu kuvvet gaz basıncıdır (s.81, s.95).",
      fc: ["Taneciklerin kap çeperine çarpması neyi oluşturur?", "Gaz basıncını."]
    },
    {
      bi: 0,
      metin: "Aynı sıcaklıktaki farklı ideal gazların ortalama kinetik enerjileri için hangisi doğrudur?",
      secenekler: ["Eşittir", "Mol kütlesi büyük olanda büyüktür", "Hacmi büyük olanda büyüktür", "Basınca bağlıdır"],
      cozum: "Ortalama kinetik enerji yalnız mutlak sıcaklığa bağlıdır; aynı sıcaklıkta tüm gazlarda eşittir (s.95-96).",
      fc: ["Aynı sıcaklıkta KE eşit mi?", "Evet, ortalama kinetik enerjiler eşittir."]
    },
    {
      bi: 1,
      metin: "Bir gaz ısıtıldığında taneciklerin hızı ve basıncı nasıl değişir?",
      secenekler: ["Hız artar, basınç artar", "Hız artar, basınç azalır", "Hız azalır, basınç artar", "İkisi de değişmez"],
      cozum: "Sıcaklık artınca taneciklerin ortalama hızı ve çepere çarpma sıklığı artar; sabit hacimde basınç yükselir (s.95-96).",
      fc: ["Isıtılan gazın basıncı neden artar?", "Tanecik hızı ve çarpma sayısı artar."]
    },
    {
      bi: 1,
      metin: "Aynı sıcaklıkta H2 ve O2 gazları için hangisi doğrudur?",
      secenekler: ["H2 molekülleri daha hızlıdır", "O2 molekülleri daha hızlıdır", "Hızları eşittir", "H2'nin kinetik enerjisi daha büyüktür"],
      cozum: "Ortalama kinetik enerjiler eşit olduğundan mol kütlesi küçük olan H2 daha hızlı hareket eder (s.96).",
      fc: ["H2 mi O2 mi daha hızlı?", "H2 (mol kütlesi küçük)."]
    },
    {
      bi: 1,
      metin: "Kinetik moleküler teoriye göre gaz tanecikleri arasındaki boşluklar için hangisi doğrudur?",
      secenekler: ["Tanecik boyutuna göre çok büyüktür", "Tanecik boyutuna eşittir", "Yok denecek kadar azdır", "Sıcaklıkla azalır"],
      cozum: "Gazlarda tanecikler arasındaki boşluklar tanecik boyutlarına göre çok büyüktür; bu yüzden gazlar sıkıştırılabilir (s.95).",
      fc: ["Gazlarda tanecikler arası boşluk nasıldır?", "Çok büyük."]
    },
    {
      bi: 1,
      metin: "Sıcak hava balonunun yükselmesinin nedeni nedir?",
      secenekler: ["Isınan havanın yoğunluğunun azalması", "Havanın kütlesinin artması", "Balonun içindeki taneciklerin durması", "Dış basıncın sıfır olması"],
      cozum: "Balondaki hava ısındıkça tanecikler arası mesafe artar, birim hacme düşen tanecik sayısı ve yoğunluk azalır; balon yükselir (s.98).",
      fc: ["Sıcaklık artınca gaz yoğunluğu nasıl değişir?", "Azalır; yoğunluğu küçülen hava yükselir."]
    },
    {
      bi: 1,
      metin: "Kapalı kaptaki gaz soğutulursa taneciklerin ortalama kinetik enerjisi nasıl değişir?",
      secenekler: ["Azalır", "Artar", "Değişmez", "Önce artar sonra azalır"],
      cozum: "Ortalama kinetik enerji mutlak sıcaklıkla doğru orantılı olduğundan soğutmada azalır (s.95-96).",
      fc: ["Soğuyan gazın KE'si ne olur?", "Azalır."]
    },
    {
      bi: 1,
      metin: "Bir gaz örneğinin mutlak sıcaklığı iki katına çıkarılırsa ortalama kinetik enerjisi kaç katına çıkar?",
      secenekler: ["2", "4", "1/2", "Değişmez"],
      cozum: "Ortalama kinetik enerji mutlak sıcaklıkla doğru orantılıdır; sıcaklık iki katına çıkarsa iki katına çıkar (s.95-96).",
      fc: ["Sıcaklık 2 katına çıkarsa KE kaç katına çıkar?", "2 katına."]
    },
    {
      bi: 1,
      metin: "Gazların sıkıştırılabilmesinin temel nedeni nedir?",
      secenekler: ["Tanecikler arasındaki büyük boşluklar", "Taneciklerin çok büyük olması", "Taneciklerin birbirine yapışması", "Gazların renksiz olması"],
      cozum: "Tanecikler arasındaki boşluklar büyük olduğundan basınçla tanecikler birbirine yaklaştırılabilir (s.95).",
      fc: ["Gazlar neden sıkıştırılabilir?", "Tanecikler arası boşluklar büyük olduğu için."]
    }
  ]
});

/* ---------------------------------------------------- 1.2.3 */
yazKonu({
  konu_id: "kimya_10_u01_k08",
  ders: DERS, tema: 1, tema_adi: "Etkileşim",
  baslik: "1.2.3 İdeal Gaz Yasası",
  kazanim: "İdeal gaz denklemini kullanarak basınç, hacim, sıcaklık ve mol sayısı hesaplar.",
  kaynak: kaynak("98-105"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "İdeal gaz denklemini ve sabitini açıklar.",
    "İdeal gaz denklemiyle nicelik hesaplar."
  ],
  items: [
    {
      bi: 0,
      metin: "İdeal gaz denklemi hangisidir?",
      secenekler: ["PV = nRT", "PV = nT", "P/V = nRT", "P + V = nRT"],
      cozum: "İdeal gaz denklemi PV = nRT'dir; R ideal gaz sabitidir (s.100-101).",
      fc: ["İdeal gaz denklemindeki semboller neyi gösterir?", "P basınç, V hacim, n mol, T sıcaklık, R gaz sabiti."]
    },
    {
      bi: 0,
      metin: "İdeal gaz denkleminde sıcaklık hangi birimle kullanılmalıdır?",
      secenekler: ["Kelvin (mutlak sıcaklık)", "Santigrat", "Fahrenhayt", "Fark etmez"],
      cozum: "Denklemde mutlak sıcaklık (K) kullanılır; °C kullanılamaz (s.101).",
      fc: ["İdeal gaz denkleminde sıcaklık birimi nedir?", "Kelvin."]
    },
    {
      bi: 0,
      metin: "İdeal gaz denkleminde basınç atm, hacim litre alınırsa gaz sabiti R yaklaşık kaçtır?",
      secenekler: ["0,0821 L·atm/(mol·K)", "8,314 L·atm/(mol·K)", "0,821 L·atm/(mol·K)", "22,4 L·atm/(mol·K)"],
      cozum: "R = PV/(nT) = 2·11,2/(1·273) ≈ 0,0821 L·atm/(mol·K) (s.100).",
      fc: ["R kaçtır?", "0,0821 L·atm/(mol·K)"]
    },
    {
      bi: 1,
      metin: "0 °C ve 1 atm'de 22,4 L hacim kaplayan C2H6 gazı kaç gramdır? (C:12, H:1)",
      secenekler: ["30", "22,4", "44", "15"],
      cozum: "0 °C, 1 atm'de 22,4 L = 1 mol; MA(C2H6) = 24 + 6 = 30 g/mol → 30 g (kitabın çalışma yaprağı, s.103).",
      fc: ["NŞA'da 22,4 L C2H6 kaç gramdır?", "30 g"]
    },
    {
      bi: 1,
      metin: "0 °C ve 1 atm'de 5,6 L hacim kaplayan He gazı kaç moldür?",
      secenekler: ["0,25", "0,5", "1", "4"],
      cozum: "22,4 L = 1 mol olduğundan 5,6 L = 0,25 mol (s.103).",
      fc: ["5,6 L He kaç moldür?", "0,25 mol"]
    },
    {
      bi: 1,
      metin: "Aynı koşullarda balon en fazla 67,2 L hacme dayanıyorsa ve içinde 0,25 mol He varsa en fazla kaç mol daha He eklenebilir?",
      secenekler: ["2,75", "3", "0,25", "2"],
      cozum: "67,2 L = 3 mol; 3 − 0,25 = 2,75 mol daha eklenebilir (s.103).",
      fc: ["67,2 L sınırında kaç mol daha eklenir?", "2,75 mol"]
    },
    {
      bi: 1,
      metin: "Yukarıdaki soruda eklenebilecek en fazla He kütlesi kaç gramdır? (He:4)",
      secenekler: ["11", "12", "3", "44"],
      cozum: "2,75 mol · 4 g/mol = 11 g (s.103).",
      fc: ["2,75 mol He kaç gramdır?", "11 g"]
    },
    {
      bi: 1,
      metin: "1 mol ideal gaz 273 K'de 11,2 L hacim kaplıyorsa basıncı kaç atm'dir? (R = 0,0821)",
      secenekler: ["2", "1", "0,5", "22,4"],
      cozum: "P = nRT/V = 1·0,0821·273/11,2 ≈ 2 atm (kitabın tablosu, s.100).",
      fc: ["1 mol, 273 K, 11,2 L → P kaç atm?", "2 atm"]
    },
    {
      bi: 1,
      metin: "İdeal gaz denklemine göre n ve V sabitken mutlak sıcaklık iki katına çıkarılırsa basınç nasıl değişir?",
      secenekler: ["İki katına çıkar", "Yarıya iner", "Değişmez", "Dört katına çıkar"],
      cozum: "PV = nRT'de n ve V sabitse P ∝ T; sıcaklık iki katına çıkarsa basınç iki katına çıkar (s.101).",
      fc: ["T 2 katına çıkarsa P ne olur?", "2 katına çıkar."]
    },
    {
      bi: 1,
      metin: "Aşağıdaki gazlardan hangisi ideal gaz davranışına en yakındır?",
      secenekler: ["Yüksek sıcaklık ve düşük basınçtaki gaz", "Düşük sıcaklık ve yüksek basınçtaki gaz", "Yoğunlaşmaya yakın gaz", "Çok yüksek basınçtaki gaz"],
      cozum: "Düşük basınç ve yüksek sıcaklıkta tanecikler arası etkileşimler önemsizleşir; gaz ideale yaklaşır (s.98-101).",
      fc: ["İdeal gaza hangi koşullarda yaklaşılır?", "Yüksek sıcaklık, düşük basınç."]
    }
  ]
});

/* ---------------------------------------------------- 1.2.4 */
yazKonu({
  konu_id: "kimya_10_u01_k09",
  ders: DERS, tema: 1, tema_adi: "Etkileşim",
  baslik: "1.2.4 Graham Difüzyon ve Efüzyon Yasası",
  kazanim: "Difüzyon ve efüzyonu ayırt eder; Graham Yasası ile yayılma hızlarını karşılaştırır.",
  kaynak: kaynak("106-115"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Difüzyon ve efüzyon kavramlarını açıklar.",
    "Graham Yasası ile hız oranı hesaplar."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir gazın başka gaz molekülleriyle kendiliğinden karışması hangi kavramla adlandırılır?",
      secenekler: ["Gaz moleküllerinin başka gaz molekülleriyle yavaş yavaş karışması", "Gazın küçük bir delikten kaçması", "Gazın sıvılaşması", "Gazın kabı ısıtması"],
      cozum: "Kitaba göre gaz moleküllerinin başka gaz molekülleriyle yavaş yavaş karışması difüzyondur (s.109-110).",
      fc: ["Difüzyon nedir?", "Gazların birbiri içinde yayılıp karışması."]
    },
    {
      bi: 0,
      metin: "Bir gazın küçük bir delikten dışarı kaçması hangi kavramla adlandırılır?",
      secenekler: ["Gazın küçük bir delikten dışarı kaçması", "Gazların karışması", "Gazın basıncının artması", "Gazın yoğunlaşması"],
      cozum: "Efüzyon, gazın küçük bir delikten kaçmasıdır (s.110).",
      fc: ["Efüzyon nedir?", "Gazın küçük delikten kaçışı."]
    },
    {
      bi: 0,
      metin: "Graham Yasası'na göre bir gazın yayılma hızı neye bağlıdır?",
      secenekler: ["Mol kütlesinin kareköküyle ters orantılıdır", "Mol kütlesiyle doğru orantılıdır", "Yalnız basınca bağlıdır", "Yalnız hacme bağlıdır"],
      cozum: "Graham Yasası'na göre aynı sıcaklıkta yayılma hızı mol kütlesinin kareköküyle ters orantılıdır: v1/v2 = √(M2/M1) (s.110-111).",
      fc: ["Graham Yasası bağıntısı nedir?", "v1/v2 = √(M2/M1)"]
    },
    {
      bi: 1,
      metin: "Aynı sıcaklıkta mol kütlesi 10 g/mol olan U gazı ile 90 g/mol olan V gazının yayılma hızları oranı (vU/vV) kaçtır?",
      secenekler: ["3", "9", "1/3", "√10"],
      cozum: "vU/vV = √(90/10) = √9 = 3 (kitabın sorusu, s.106).",
      fc: ["M=10 ve M=90 ise hız oranı kaçtır?", "3"]
    },
    {
      bi: 1,
      metin: "Aynı koşullarda H2 (2 g/mol) ve O2 (32 g/mol) gazlarının yayılma hızları oranı vH2/vO2 kaçtır?",
      secenekler: ["4", "16", "2", "8"],
      cozum: "vH2/vO2 = √(32/2) = √16 = 4 (s.110-111).",
      fc: ["H2/O2 hız oranı kaçtır?", "4"]
    },
    {
      bi: 1,
      metin: "Bir gazın sıcaklığı artırılırsa efüzyon hızı nasıl değişir?",
      secenekler: ["Artar", "Azalır", "Değişmez", "Önce azalır sonra artar"],
      cozum: "Sıcaklık artışı ortalama kinetik enerjiyi ve hızı artırdığından efüzyon hızı artar (s.108-111).",
      fc: ["Sıcaklık artınca efüzyon hızı ne olur?", "Artar."]
    },
    {
      bi: 1,
      metin: "Parfüm kokusunun odanın her tarafına yayılması hangi olaydır?",
      secenekler: ["Difüzyon", "Efüzyon", "Yoğunlaşma", "Süblimleşme"],
      cozum: "Kitapta parfüm örneği, moleküllerin yavaş yavaş karışması yani difüzyon için verilir (s.110).",
      fc: ["Parfüm kokusunun yayılması nedir?", "Difüzyon."]
    },
    {
      bi: 1,
      metin: "Efüzyonun aşağıdaki uygulamalardan hangisiyle ilişkisi vardır?",
      secenekler: ["Kütle spektrometrisinde iyonların ayrılması", "Buzdolabının soğutması", "Sabun üretimi", "Cam üfleme"],
      cozum: "Kitapta efüzyonun kütle spektrometrisi, vakum teknolojisi ve yarı iletken üretiminde kullanıldığı belirtilir (s.111-112).",
      fc: ["Efüzyon hangi teknolojide kullanılır?", "Kütle spektrometrisi, vakum, yarı iletken."]
    },
    {
      bi: 1,
      metin: "Aynı sıcaklıkta iki gazdan mol kütlesi küçük olanın yayılma hızı için hangisi doğrudur?",
      secenekler: ["Daha büyüktür", "Daha küçüktür", "Eşittir", "Basınca göre değişir"],
      cozum: "Hız mol kütlesinin kareköküyle ters orantılı olduğundan küçük mol kütleli gaz daha hızlı yayılır (s.110-111).",
      fc: ["Küçük mol kütleli gaz daha mı hızlı?", "Evet."]
    },
    {
      bi: 1,
      metin: "Bir gazın efüzyon hızı 4 katına çıkması için mol kütlesi nasıl değişmelidir?",
      secenekler: ["1/16'sına düşmeli", "4 katına çıkmalı", "1/4'üne düşmeli", "16 katına çıkmalı"],
      cozum: "v ∝ 1/√M olduğundan hız 4 katına çıkmak için √M 1/4'üne, M 1/16'sına düşmelidir (s.110-111).",
      fc: ["Hız 4 katına çıkarsa M ne olur?", "1/16'sına düşer."]
    }
  ]
});
