#!/usr/bin/env node
/* ============================================================
   BİYOLOJİ 10 · 1. TEMA (ENERJİ) — kitaptan sıfırdan havuzlar
   ------------------------------------------------------------
   Kaynak: MEB Biyoloji 10 (2025) — `kitap-kaynak` dalındaki
   biyoloji.json. Basılı sayfa = PDF sayfası − 1.

     1.1 Canlılık İçin Enerjinin Önemi              s.16-20
     1.2 Işık Enerjisi Kullanılarak Besin Sentezi    s.21-31
     1.3 Fotosentezde Kullanılan/Üretilen Maddeler   s.32-36
     1.4 Kemosentez                                  s.37-39
     1.5 Sindirim                                    s.40-47
     1.6 İnsanda Sindirim                            s.48-56
     1.7 Hücresel Solunum                            s.57-62
     1.8 Besinlerin Solunuma Katılma Yolları         s.63-66
     1.9 Fermantasyon                                s.67-70
     1.10 Enerji-Metabolizma İlişkisi                s.71-75

   Kullanım: node docs/uretim/uretim/biyoloji-t1.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Biyoloji";
const DOSYA = "biyoloji-10.pdf (MEB, 2025)";
const kaynak = s => "Biyoloji 10 ders kitabı, s." + s;

/* ------------------------------------------------------- 1.1 */
yazKonu({
  konu_id: "biyo_10_u01_k01",
  ders: DERS, tema: 1, tema_adi: "Enerji",
  baslik: "1.1 Canlılık İçin Enerjinin Önemi",
  kazanim: "Canlıların yaşamını sürdürebilmesi için enerjinin gerekliliğini sorgular ve ATP'nin yapısını enerji aktarımındaki işleviyle ilişkilendirir.",
  kaynak: kaynak("16-20"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Canlıların yaşamını sürdürmesinde enerjinin rolünü sorgular.",
    "ATP'nin yapısını ve enerji aktarımındaki işlevini açıklar."
  ],
  items: [
    {
      bi: 0,
      metin: "Kış uykusuna yatan bir kirpi, kış boyunca besin bulamadığı hâlde vücut sıcaklığını nasıl dengede tutar?",
      secenekler: [
        "Vücudunda depoladığı besinleri yıkayarak enerji elde etmesiyle",
        "Ortam sıcaklığını kendi çabasıyla yükseltmesiyle",
        "Su kaybını tamamen durdurmasıyla",
        "Kaslarını sürekli kasıp ısı üretmesiyle"
      ],
      cozum: "Kış uykusuna yatan canlılar uykuda harcayacak besini vücutlarında depolar; bu besinlerden elde edilen enerjiyle vücut sıcaklıklarını dengede tutup hayatta kalır (s.16).",
      fc: ["Kış uykusunun enerji açısından işlevi nedir?", "Depolanan besinler yıkılarak vücut sıcaklığı dengede tutulur."]
    },
    {
      bi: 0,
      metin: "Bir çocuğun koşması, bir karıncanın tohum taşıması ve bir kuşun uçması gibi 3 farklı olayın ortak yönü nedir?",
      secenekler: [
        "Enerji harcanarak gerçekleşmeleri",
        "Yalnızca sinir iletimiyle açıklanmaları",
        "Ortam sıcaklığına bağlı olmaları",
        "Işık enerjisiyle başlamaları"
      ],
      cozum: "Kitap bu örnekleri enerji kullanımına kanıt olarak verir; enerji iş yapabilme yeteneği ya da bir değişikliğe neden olma kapasitesidir (s.18).",
      fc: ["Enerjinin kitaptaki tanımı nedir?", "İş yapabilme yeteneği ya da değişikliğe neden olma kapasitesi."]
    },
    {
      bi: 0,
      metin: "Yeşil bir bitkide güneş enerjisi, fotosentez sonucunda hangi enerji formuna dönüşerek depolanır?",
      secenekler: [
        "Organik besinlerin bağlarındaki kimyasal enerjiye",
        "Hücredeki elektrik enerjisine",
        "Çekirdekteki nükleer enerjiye",
        "Ses enerjisine"
      ],
      cozum: "Fotosentez yapan bitkilerde ışık enerjisi, besinlerin yapısındaki bağlarda depolanan kimyasal enerjiye dönüştürülür (s.18).",
      fc: ["Fotosentezin enerji açısından işlevi nedir?", "Işık enerjisini besin bağlarındaki kimyasal enerjiye dönüştürmek."]
    },
    {
      bi: 0,
      metin: "Kitap, şarj edilen elektrikli otomobil örneğiyle enerjinin hangi özelliğini vurgular?",
      secenekler: [
        "Depolanabildiğini ve bir formdan diğerine dönüşebildiğini",
        "Yalnızca canlılarda bulunduğunu",
        "Her zaman ısıya dönüştüğünü",
        "Kullanıldıkça yok olduğunu"
      ],
      cozum: "Batarya şarj edildiğinde sürüş için gerekli enerji depolanır; enerji yok olmaz, bir formdan başka bir forma aktarılır veya dönüştürülür (s.18).",
      fc: ["Enerjinin korunumu ilkesi nedir?", "Enerji yok olmaz; form değiştirir, aktarılır veya dönüşür."]
    },
    {
      bi: 0,
      metin: "ATP üç fosfat grubu taşıyan bir nükleotittir. Bu yapıdaki fosfat bağlarının hidrolizi hücreye ne kazandırır?",
      secenekler: [
        "Metabolik faaliyetlerde kullanılacak serbest enerji",
        "Yeni bir riboz şekeri",
        "Hücre zarının geçirgenliği",
        "DNA'nın iki katına çıkması"
      ],
      cozum: "Fosfat grupları arasındaki bağlar hidroliz edildiğinde bir ATP'den ADP, inorganik fosfat ve serbest enerji açığa çıkar (s.19).",
      fc: ["ATP'nin hidroliz ürünleri nedir?", "ADP, inorganik fosfat (Pi) ve serbest enerji."]
    },
    {
      bi: 1,
      metin: "ATP molekülünün yapısında aşağıdaki bileşenlerden hangisi bulunmaz?",
      secenekler: [
        "Guanin bazı",
        "Adenin bazı",
        "Riboz şekeri",
        "Üç fosfat grubu"
      ],
      cozum: "ATP; azotlu organik baz olan adenin, bir riboz şekeri ve üç fosfat grubundan oluşur; guanin bu yapıda yer almaz (s.18).",
      fc: ["ATP'nin yapısındaki üç bileşen nedir?", "Adenin bazı, riboz şekeri ve üç fosfat grubu."]
    },
    {
      bi: 1,
      metin: "ATP ile RNA'daki adenin nükleotidi karşılaştırıldığında ATP'de kaç fosfat grubu bulunur?",
      secenekler: [
        "Üç",
        "Bir",
        "İki",
        "Dört"
      ],
      cozum: "ATP, yapı olarak RNA'daki adenin nükleotidine benzer; farkı bir yerine üç fosfat grubu bulundurmasıdır (s.19).",
      fc: ["ATP'yi RNA adenin nükleotidinden ayıran fark nedir?", "Bir değil üç fosfat grubu taşıması."]
    },
    {
      bi: 1,
      metin: "Bir hücrede adenozin monofosfata (AMP) bir fosfat grubu eklendiğinde hangi molekül oluşur?",
      secenekler: [
        "Adenozin difosfat (ADP)",
        "Adenozin trifosfat (ATP)",
        "Adenozin",
        "Adenin"
      ],
      cozum: "AMP'ye bir fosfat bağlanması ile ADP, ADP'ye bir fosfat bağlanması ile ATP oluşur (s.19).",
      fc: ["AMP'ye bir fosfat eklenince oluşan molekül nedir?", "ADP; bir fosfat daha eklenirse ATP."]
    },
    {
      bi: 1,
      metin: "Bir hücrede ADP molekülüne enerji ve inorganik fosfat eklendiğinde hangi madde açığa çıkar?",
      secenekler: [
        "Su",
        "Karbondioksit",
        "Oksijen",
        "Amonyak"
      ],
      cozum: "ADP + Pi + Enerji → ATP + H2O denklemi gereği fosforilasyon sırasında su açığa çıkar (s.19).",
      fc: ["Fosforilasyon nedir?", "ADP'ye enerji ve Pi eklenerek ATP sentezlenmesi; su açığa çıkar."]
    },
    {
      bi: 1,
      metin: "Kas hücresinde ATP'nin fosfat bağları koparak enerji açığa çıkar. Bu olay hangi kavramla ifade edilir?",
      secenekler: [
        "Defosforilasyon",
        "Fosforilasyon",
        "Ekzergonik sentez",
        "Endergonik hidroliz"
      ],
      cozum: "ATP'nin su ile hidroliz edilerek yapısından bir fosfatın koparılması ve enerji açığa çıkması defosforilasyon olarak adlandırılır (s.19).",
      fc: ["Defosforilasyon nedir?", "ATP'nin hidroliziyle bir fosfat kopması ve enerji açığa çıkması."]
    }
  ]
});

/* ------------------------------------------------------- 1.2 */
yazKonu({
  konu_id: "biyo_10_u01_k02",
  ders: DERS, tema: 1, tema_adi: "Enerji",
  baslik: "1.2 Işık Enerjisi Kullanılarak Besin Sentezi (Fotosentez)",
  kazanim: "Fotosentezin ışığa bağlı ve ışıktan bağımsız evrelerini ilişkilendirerek açıklar, fotosentez hızını etkileyen çevresel faktörleri yorumlar.",
  kaynak: kaynak("21-31"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Fotosentezin ışığa bağlı ve ışıktan bağımsız evrelerini model üzerinden açıklar.",
    "Fotosentez hızına etki eden çevresel faktörleri kanıta dayalı olarak yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Işığa bağlı evrede klorofilin kaybettiği elektronların yerini hangi kaynak doldurur?",
      secenekler: [
        "Suyun fotoliziyle açığa çıkan elektronlar",
        "NADPH molekülünün hidrojenleri",
        "Karbondioksitin parçalanmasıyla açığa çıkan elektronlar",
        "ETS'de taşınan oksijen molekülleri"
      ],
      cozum: "Uyarılan klorofil elektron kaybeder; kaybettiği elektronların yerine suyun fotolizi ile açığa çıkan elektronlar gelir ve böylece elektron açığı kapanır (s.25).",
      fc: ["Fotolizin ışığa bağlı evredeki işlevi nedir?", "Klorofilin kaybettiği elektronları yerine koymak."]
    },
    {
      bi: 0,
      metin: "Işığa bağlı evrede üretilen hangi iki molekül Calvin döngüsünde organik madde sentezi için kullanılır?",
      secenekler: [
        "ATP ve NADPH",
        "ADP ve NADP⁺",
        "Glikoz ve oksijen",
        "PGAL ve nişasta"
      ],
      cozum: "Işığa bağlı evrede üretilen temel moleküller ATP ve NADPH'tır; bunlar ışıktan bağımsız evrede CO2 ile birlikte organik bileşenlerin sentezinde görev alır (s.26).",
      fc: ["Işığa bağlı evrenin iki ürünü nedir?", "ATP ve NADPH."]
    },
    {
      bi: 0,
      metin: "Suyun fotolizi sırasında bir su molekülü ışık enerjisiyle parçalandığında hangi üç bileşen açığa çıkar?",
      secenekler: [
        "Elektron, hidrojen iyonu ve oksijen",
        "Elektron, karbondioksit ve su",
        "Hidrojen iyonu, glikoz ve ATP",
        "Oksijen, NADPH ve PGAL"
      ],
      cozum: "Fotoliz, su moleküllerinin ışık enerjisiyle elektronlar (e⁻), hidrojen iyonları (H⁺) ve oksijen (O₂) olarak ayrılmasıdır (s.25).",
      fc: ["Fotoliz nedir?", "Suyun ışıkla e⁻, H⁺ ve O₂ olarak ayrılması."]
    },
    {
      bi: 0,
      metin: "Calvin döngüsünde CO2 ile birleşerek 3 karbonlu PGAL'in oluşmasını sağlayan hidrojenler hangi molekülden gelir?",
      secenekler: [
        "NADPH",
        "ATP",
        "FAD",
        "Klorofil"
      ],
      cozum: "Işığa bağlı evreden gelen ATP'nin defosforilasyonuyla açığa çıkan enerji kullanılarak NADPH'ın hidrojenleri ve CO2 birleştirilir, PGAL sentezlenir (s.26).",
      fc: ["NADPH'ın Calvin döngüsündeki işlevi nedir?", "CO2 ile birleşecek hidrojenleri taşımak."]
    },
    {
      bi: 0,
      metin: "Bir bitkinin kloroplast stromasında gerçekleşen evrede aşağıdakilerden hangisi doğrudan görev almaz?",
      secenekler: [
        "Klorofil pigmenti",
        "Calvin döngüsü enzimleri",
        "Karbondioksit",
        "ATP"
      ],
      cozum: "Işıktan bağımsız evre enzimlerin kontrolünde gerçekleşir; bu evrede klorofil ve ETS elemanları görev almaz, CO2 ve ATP tüketilir (s.26).",
      fc: ["Calvin döngüsü nedir?", "Stromada enzimlerle yürüyen, CO2'den organik madde üreten evre."]
    },
    {
      bi: 1,
      metin: "Bir serada ışık şiddeti sürekli artırıldığında fotosentez hızı nasıl değişir?",
      secenekler: [
        "Belirli bir düzeye kadar artar, sonra sabit kalır",
        "Işık şiddetiyle aynı oranda sürekli artar",
        "Işık şiddeti arttıkça sürekli azalır",
        "Değişmez, ışık şiddetinden etkilenmez"
      ],
      cozum: "Işık şiddeti arttıkça fotosentez hızlanır; ancak diğer faktörler sabit kaldığından belirli bir seviyeden sonra fotosentez sabit hızla devam eder (s.28).",
      fc: ["Minimum kuralı nedir?", "Fotosentez hızını, miktarı en az olan faktör belirler."]
    },
    {
      bi: 1,
      metin: "Klorofil; mor, mavi ve kırmızı dalga boylu ışığı güçlü soğurur. Buna göre hangi ışıkta fotosentez en düşük hızdadır?",
      secenekler: [
        "Yeşil ışıkta",
        "Mavi ışıkta",
        "Kırmızı ışıkta",
        "Mor ışıkta"
      ],
      cozum: "Klorofil yeşil ışığı çok az soğurduğu için fotosentez yeşil ışıkta en düşük hızda gerçekleşir (s.28).",
      fc: ["Klorofilin soğurduğu ışık ile yaprak rengi arasındaki ilişki nedir?", "Soğurulmayan yeşil ışık yansıtıldığı için yaprak yeşil görünür."]
    },
    {
      bi: 1,
      metin: "Engelmann 1883'te ipliksi alg ile oksijenli solunum yapan bakterileri kullanarak hangi sonuca ulaşmıştır?",
      secenekler: [
        "Bakteriler mor, mavi ve kırmızı ışık bölgelerinde daha çok kümelenir",
        "Bakteriler yalnızca yeşil ışık bölgesinde kümelenir",
        "Tüm dalga boylarında oksijen çıkışı eşittir",
        "Algler ışıktan bağımsız evrede oksijen üretir"
      ],
      cozum: "Bakterilerin mor, mavi ve kırmızı ışığın düştüğü bölgelerde kümelenmesi, klorofilin bu dalga boylarını çok soğurduğunu ve fotosentezin oralarda hızlı olduğunu kanıtlar (s.29).",
      fc: ["Engelmann deneyinin sonucu nedir?", "Klorofilin mor, mavi ve kırmızı ışığı çok soğurduğu kanıtlanmıştır."]
    },
    {
      bi: 1,
      metin: "Sıcaklık 35 °C'nin üzerine çıktığında fotosentez hızının düşmesinin temel nedeni nedir?",
      secenekler: [
        "Fotosentez enzimlerinin yapısının bozulması",
        "Klorofilin tamamen yok olması",
        "Suyun fotolizinin hızlanması",
        "CO2'nin atmosfere kaçması"
      ],
      cozum: "Fotosentez reaksiyonlarının çoğu enzimlerle yürür; 35 °C üstünde enzim yapısı bozulduğu için fotosentez yavaşlar ya da durur (s.30).",
      fc: ["Optimum sıcaklık nedir?", "Enzimlerin en iyi çalıştığı sıcaklık; fotosentezde yaklaşık 33 °C."]
    },
    {
      bi: 1,
      metin: "Deney ortamına NaOH veya KOH gibi CO2 tutucu bir madde konulduğunda fotosentez hızı nasıl etkilenir?",
      secenekler: [
        "CO2 ortamdan çekildiği için hız düşer",
        "CO2 arttığı için hız yükselir",
        "Enzimler denatüre olduğu için durur",
        "Yalnızca ışığa bağlı evre hızlanır"
      ],
      cozum: "NaOH, KOH, Ca(OH)2 ve Ba(OH)2 CO2 ile tepkimeye girerek ortamdan çeker; CO2 azalınca fotosentez hızı düşer (s.29).",
      fc: ["CO2 tutucusu nedir?", "CO2 ile tepkimeye girip ortamdan çeken bileşik (NaOH, KOH)."]
    }
  ]
});

/* ------------------------------------------------------- 1.3 */
yazKonu({
  konu_id: "biyo_10_u01_k03",
  ders: DERS, tema: 1, tema_adi: "Enerji",
  baslik: "1.3 Fotosentezde Kullanılan ve Üretilen Maddeler",
  kazanim: "Fotosentez denklemini kullanılan ve üretilen maddeler açısından çözümler, bilim tarihindeki deneyleri fotosentez bilgisine katkılarıyla karşılaştırır.",
  kaynak: kaynak("32-36"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Fotosentez denkleminde kullanılan ve üretilen maddeleri izler.",
    "Fotosentezle ilgili bilimsel çalışmaların bilime katkısını değerlendirir."
  ],
  items: [
    {
      bi: 0,
      metin: "Sadeleştirilmiş fotosentez denklemi 6CO2 + 6H2O → C6H12O6 + 6O2 olduğuna göre 6 molekül CO2 ile kaç molekül su tüketilir?",
      secenekler: [
        "6",
        "12",
        "3",
        "18"
      ],
      cozum: "Denklem sadeleştirildiğinde 6CO2 + 6H2O → C6H12O6 + 6O2 elde edilir; yani her 6 CO2 için 6 H2O tüketilir (s.35).",
      fc: ["Fotosentezin sadeleşmiş denklemi nedir?", "6CO2 + 6H2O → C6H12O6 + 6O2 (ışık ve klorofille)."]
    },
    {
      bi: 0,
      metin: "Sadeleştirilmemiş denklemde eşitliğin her iki tarafında da H2O bulunması neyi gösterir?",
      secenekler: [
        "Suyun hem tüketildiğini hem de üretildiğini",
        "Suyun tepkimeye girmediğini",
        "Suyun yalnızca üretildiğini",
        "Suyun katalizör olduğunu"
      ],
      cozum: "6CO2 + 12H2O → C6H12O6 + 6O2 + 6H2O denkleminde su iki yanda da yer alır; bu, suyun hem tüketilip hem üretildiğini gösterir (s.35).",
      fc: ["Fotosentezde suyun iki yönlü rolü nedir?", "Hem tüketilir hem de üretilir."]
    },
    {
      bi: 0,
      metin: "Mor kükürt bakterilerinde fotosentez denkleminde su yerine hangi hidrojen kaynağı kullanılır?",
      secenekler: [
        "Hidrojen sülfür (H2S)",
        "Metan (CH4)",
        "Amonyak (NH3)",
        "Karbonik asit (H2CO3)"
      ],
      cozum: "Bitkiler ve bazı bakteriler H2O'yu kullanırken mor kükürt bakterileri hidrojen sülfürü (H2S) hidrojen kaynağı olarak kullanır (s.35).",
      fc: ["Fotosentezde hidrojen kaynağı nedir?", "Bitkilerde H2O, mor kükürt bakterilerinde H2S."]
    },
    {
      bi: 0,
      metin: "6CO2 + 12H2S → C6H12O6 + 12S + 6H2O denkleminde kükürt hangi biçimde ortaya çıkar?",
      secenekler: [
        "Elementel kükürt olarak açığa çıkar",
        "Sülfat iyonu olarak çözünür",
        "Kükürt dioksit gazı olarak atmosfere verilir",
        "Sülfürik aside dönüşür"
      ],
      cozum: "Mor kükürt bakterilerinde H2S'ten gelen kükürt elementel hâlde (12S) açığa çıkar; oksijen yerine bu yan ürün oluşur (s.35).",
      fc: ["Mor kükürt bakterilerinde yan ürün nedir?", "Suyun yerini S alır; elementel kükürt açığa çıkar."]
    },
    {
      bi: 0,
      metin: "Bilim insanları ağır oksijen izotopu kullanarak fotosentezde açığa çıkan oksijenin kaynağını hangi molekül olarak belirlemiştir?",
      secenekler: [
        "Su",
        "Karbondioksit",
        "Glikoz",
        "Klorofil"
      ],
      cozum: "Ağır oksijen izotopuyla yapılan çalışmalar, açığa çıkan oksijenin kökeninin CO2 değil H2O olduğunu kanıtlamıştır (s.35).",
      fc: ["Fotosentezde oksijenin kaynağı nedir?", "Su; ağır oksijen izotopu bunu kanıtlar."]
    },
    {
      bi: 1,
      metin: "Helmont beş yıl boyunca söğüt fidanını sulamış; fidanın kütlesi artarken toprağın kütlesi neredeyse değişmemiştir. Helmont bu sonuçtan hangi çıkarımı yapmıştır?",
      secenekler: [
        "Bitkideki kütle artışının sudan kaynaklandığını",
        "Kütle artışının topraktaki minerallerden olduğunu",
        "Bitkinin havadan karbon aldığını",
        "Toprağın kütlesinin azaldığını"
      ],
      cozum: "Helmont 80 kg kuru toprağı beş yıl sonra 79,9 kg, fidanı ise 2,5 kg'dan 75 kg olarak ölçmüş ve kütle artışını suya bağlamıştır; karbonun rolü sonraki çalışmalarla anlaşılmıştır (s.33).",
      fc: ["Helmont deneyinin sonucu nedir?", "Bitki kütle artışının sudan kaynaklandığı sonucuna varmıştır."]
    },
    {
      bi: 1,
      metin: "Priestley, kapalı kavanozdaki mum ve farenin yanına canlı bir bitki koyduğunda mumun yanmaya devam ettiğini ve farenin yaşadığını görmüştür. Bu deney neyi göstermiştir?",
      secenekler: [
        "Bitkilerin kirlenen havayı temizlediğini",
        "Farenin oksijen ürettiğini",
        "Mumun karbondioksit ürettiğini",
        "Bitkilerin karanlıkta oksijen tükettiğini"
      ],
      cozum: "Priestley bu deneyle bitkilerin havaya oksijen verdiğini gözlemleyen ilk kişi olmuş ve kirlenen havanın bitkilerce temizlendiğini ifade etmiştir (s.33).",
      fc: ["Priestley'nin fotosentez bilimine katkısı nedir?", "Bitkilerin havaya oksijen verdiğini ilk kez gözlemlemesi."]
    },
    {
      bi: 1,
      metin: "Ingenhousz'ın 1779'daki deneylerinde su bitkilerinin yalnızca ışık varken hava baloncukları çıkardığı görülmüştür. Bu gözlem hangi sonuca götürmüştür?",
      secenekler: [
        "Fotosentez için güneş ışığının gerekli olduğuna",
        "Bitkilerin yalnızca köklerinin fotosentez yaptığına",
        "Baloncukların karbondioksit olduğuna",
        "Fotosentezin gece de sürdüğüne"
      ],
      cozum: "Ingenhousz baloncuklardaki gazın oksijen olduğunu, bitkilerin karanlıkta CO2 çıkardığını belirlemiş; fotosentez için güneş ışığının gerektiğini ve yalnızca yeşil kısımların fotosentez yaptığını ortaya koymuştur (s.34).",
      fc: ["Ingenhousz'ın katkısı nedir?", "Işığın zorunluluğu; yalnız yeşil kısımlar fotosentez yapar."]
    },
    {
      bi: 1,
      metin: "Robert Hill'in 2H2O → O2 + 4H⁺ + 4e⁻ denklemi fotosentezde hangi bilgiyi kanıtlamıştır?",
      secenekler: [
        "Oksijenin ışığa bağlı evrede sudan oluştuğunu",
        "Oksijenin karbondioksitten oluştuğunu",
        "Glikozun ışığa bağlı evrede sentezlendiğini",
        "Klorofilin azot içerdiğini"
      ],
      cozum: "Hill, ışık ve su bulunduğunda izole kloroplastların CO2 olmadan O2 üretebildiğini göstermiş; O2'nin kökeninin CO2 değil H2O olduğunu kanıtlamıştır (s.34).",
      fc: ["Hill reaksiyonu nedir?", "2H2O → O2 + 4H⁺ + 4e⁻; O2'nin kaynağı sudur."]
    },
    {
      bi: 1,
      metin: "Melvin Calvin ve arkadaşlarının 1946'da başlayan çalışmaları hangi sürecin aydınlatılmasını sağlamıştır?",
      secenekler: [
        "Atmosferik karbondioksidin organik bileşiklere dönüşmesinin",
        "Klorofilin kimyasal yapısının",
        "Suyun fotolizinin ilk kez gözlenmesinin",
        "Kükürt bakterilerinde hidrojen kaynağının"
      ],
      cozum: "Calvin ve ekibi ışıktan bağımsız evre tepkimelerini çalışarak karbon metabolizmasını açıklamış, 1961'de Nobel Ödülü almıştır (s.34).",
      fc: ["Calvin'in Nobel aldığı çalışma nedir?", "Işıktan bağımsız evrede karbon metabolizmasının açıklanması."]
    }
  ]
});

/* ------------------------------------------------------- 1.4 */
yazKonu({
  konu_id: "biyo_10_u01_k04",
  ders: DERS, tema: 1, tema_adi: "Enerji",
  baslik: "1.4 Işık Enerjisi Kullanılmadan Besin Sentezi (Kemosentez)",
  kazanim: "Kemosentezi fotosentezden ayıran enerji kaynağını açıklar ve kemoototrofların ekosistemdeki üretici rolünü yorumlar.",
  kaynak: kaynak("37-39"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Kemosentez ile fotosentezi enerji kaynağı bakımından karşılaştırır.",
    "Ekstrem ortamlarda kemosentez yapan canlıların ekosistemdeki yerini açıklar."
  ],
  items: [
    {
      bi: 0,
      metin: "Hidrotermal bacaların çevresinde güneş ışığı hiç ulaşmadığı hâlde besin üretilir. Bu canlılar enerjiyi nereden sağlar?",
      secenekler: [
        "İnorganik maddelerin oksidasyonundan",
        "Suyun fotolizinden",
        "Ortamdaki ısıyı doğrudan ATP'ye çevirerek",
        "Organik maddeleri parçalayarak"
      ],
      cozum: "Kemosentezde hidrojen sülfür, amonyak, nitrit, demir gibi inorganik maddelerin oksidasyonuyla açığa çıkan kimyasal enerji kullanılır (s.39).",
      fc: ["Kemosentez nedir?", "İnorganik maddelerin oksidasyonuyla elde edilen enerjiyle organik madde sentezi."]
    },
    {
      bi: 0,
      metin: "Kemosentezin temel basamağı olan oksidasyon, kimyasal olarak nasıl tanımlanır?",
      secenekler: [
        "Bir atom veya molekülden elektron ayrılması",
        "Bir moleküle oksijen atomu eklenmesi",
        "Bir molekülden su çıkarılması",
        "Elektronların moleküle eklenmesi"
      ],
      cozum: "Kitap oksidasyonu, bir atom veya molekülden elektron ayrılmasını sağlayan kimyasal reaksiyon olarak tanımlar (s.39).",
      fc: ["Oksidasyon nedir?", "Atom veya molekülden elektron ayrılması."]
    },
    {
      bi: 0,
      metin: "Kemosentez yapan bir bakteride aşağıdaki maddelerden hangisi oksitlenen inorganik madde olarak kullanılmaz?",
      secenekler: [
        "Glikoz",
        "Hidrojen sülfür",
        "Amonyak",
        "Demir (Fe²⁺)"
      ],
      cozum: "Kemosentezde H2S, H2, NH3, NO2, Fe²⁺ ve S gibi inorganik maddeler oksitlenir; glikoz organik bir üründür (s.39).",
      fc: ["Kemoototrofun enerji kaynağı nedir?", "İnorganik maddelerin oksidasyonu."]
    },
    {
      bi: 0,
      metin: "Kemosentezde ATP, karbondioksiti hangi kaynaktan gelen hidrojenlerle birleştirir?",
      secenekler: [
        "Oksitlenen inorganik maddelerden",
        "Fotosentezde üretilen NADPH'tan",
        "Klorofilden kopan elektronlardan",
        "Suyun fotolizinden açığa çıkan H⁺'tan"
      ],
      cozum: "Kemosentezde ATP, CO2 ile çeşitli kaynaklardan elde edilen hidrojenleri birleştirerek organik molekülleri üretir; bu hidrojenler inorganik maddelerin oksidasyonundan sağlanır (s.39).",
      fc: ["Kemosentezde hidrojen kaynağı nedir?", "Oksitlenen inorganik maddeler."]
    },
    {
      bi: 0,
      metin: "Kemoototrof bir bakteri 24 saat boyunca organik madde sentezleyebilir. Bu canlının ışığa ihtiyaç duymamasının nedeni nedir?",
      secenekler: [
        "Klorofil taşımadıkları ve ışığa bağımlı olmadıkları için",
        "Geceleri klorofil sentezledikleri için",
        "Gece sıcaklığı düştüğü için",
        "Gündüz CO2 bulamadıkları için"
      ],
      cozum: "Kemoototroflar klorofil bulundurmadıkları için ışık enerjisi kullanmaz; bu nedenle besin üretimi gece gündüz fark etmeksizin sürer (s.39).",
      fc: ["Kemoototrof nedir?", "Kemosentezle besin üreten, klorofil taşımayan canlı."]
    },
    {
      bi: 1,
      metin: "Hidrotermal bacaların 1977'de keşfedildiği Büyük Okyanus tabanında hangi canlılara rastlanır?",
      secenekler: [
        "Karides, yengeç, midye ve denizyıldızı",
        "Yalnızca tek hücreli algler ve siyanobakteriler",
        "Yalnızca mercan resifleri ve süngerler",
        "Tatlı su balıkları ve su bitkileri"
      ],
      cozum: "Bacaların etrafında kemosentez yapan bakterilerle beslenen karides, yengeç, midye ve denizyıldızı gibi canlılar yaşar (s.37).",
      fc: ["Hidrotermal baca nedir?", "Okyanus tabanında sıcak su ve gaz fışkırtan kaynak."]
    },
    {
      bi: 1,
      metin: "Hidrotermal bacaların iç kısmındaki sıcaklık ile ağız kısmındaki sıcaklık yaklaşık kaç derecedir?",
      secenekler: [
        "İçte 350-400 °C, ağızda yaklaşık 150 °C",
        "İçte 150 °C, ağızda 350-400 °C",
        "İçte 100 °C, ağızda 50 °C",
        "İçte 40 °C, ağızda 20 °C"
      ],
      cozum: "Bacaların iç kısmı 350-400 °C, ağız kısmı yaklaşık 150 °C sıcaklığa sahiptir ve okyanuslardaki ısı transferinde rol oynar (s.37).",
      fc: ["Hidrotermal bacaların okyanustaki işlevi nedir?", "Isı transferinde rol oynar; kemosentetik bakterilere ortam sağlar."]
    },
    {
      bi: 1,
      metin: "Kemoototrofların ekosistemdeki işlevi hangi ifadeyle açıklanır?",
      secenekler: [
        "Üretici olup enerji akışının başlangıcını oluştururlar",
        "Ayrıştırıcı olup organik maddeyi inorganiğe çevirirler",
        "Tüketici olup yalnızca otçullarla beslenirler",
        "Parazit olup konak canlıdan besin alırlar"
      ],
      cozum: "Kemoototroflar bulundukları ekosistemin üretici organizmalarıdır; ürettikleri besinler ekosistemin enerji akışının başlangıcıdır (s.39).",
      fc: ["Üretici organizmanın ekosistemdeki işlevi nedir?", "Enerji akışını başlatmak; organik madde üretmek."]
    },
    {
      bi: 1,
      metin: "Çöplüklerde yaşayan ve metan üreten arkeler hangi ortam koşullarında etkindir?",
      secenekler: [
        "Oksijensiz (anaerobik) ortamlarda",
        "Işığın bol olduğu ortamlarda",
        "Yalnızca tuzlu sularda",
        "Yalnızca yüksek oksijenli sularda"
      ],
      cozum: "Okyanus ve bataklık diplerindeki oksijensiz çamur, çöplükler ve lağım çamuru işleme kazanları bu prokaryotların yaygın bulunduğu ortamlardır (s.38).",
      fc: ["Metan gazının özellikleri nedir?", "Renksiz, kokusuz ve patlayıcı bir gaz."]
    },
    {
      bi: 1,
      metin: "Fotosentez ile kemosentez karşılaştırıldığında hangi ifade doğrudur?",
      secenekler: [
        "Fotosentezde enerji ışıktan, kemosentezde inorganik maddelerin oksidasyonundan sağlanır",
        "Her iki besin sentezinde de klorofil zorunlu pigmenttir",
        "Kemosentez yalnızca bitki hücrelerinde görülür",
        "Fotosentez ışıktan bağımsız evrede gerçekleşir"
      ],
      cozum: "Ototroflar enerji kaynağına göre ayrılır: fotosentetik ototroflar ışıktan, kemosentetik ototroflar inorganik maddelerin oksidasyonundan enerji sağlar (s.39).",
      fc: ["Kemosentezin fotosentezden temel farkı nedir?", "Enerji ışıktan değil kimyasal oksidasyondan gelir."]
    }
  ]
});

/* ------------------------------------------------------- 1.5 */
yazKonu({
  konu_id: "biyo_10_u01_k05",
  ders: DERS, tema: 1, tema_adi: "Enerji",
  baslik: "1.5 Sindirim",
  kazanim: "Sindirim çeşitlerini örneklerle sınıflandırır, omurgalılarda beslenme tipine bağlı sindirim yapısı adaptasyonlarını karşılaştırır.",
  kaynak: kaynak("40-47"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Mekanik, kimyasal, hücre içi ve hücre dışı sindirimi ayırt eder.",
    "Omurgalılarda beslenme tipine bağlı sindirim yapısı farklarını açıklar."
  ],
  items: [
    {
      bi: 0,
      metin: "Aşağıdaki olaylardan hangisi mekanik sindirime örnek olarak gösterilemez?",
      secenekler: [
        "Midede proteinlerin amino asitlere ayrılması",
        "Dişlerle besinlerin çiğnenmesi",
        "Mide kaslarının besinleri ezmesi",
        "Yağların safrayla küçük damlacıklara ayrılması"
      ],
      cozum: "Mekanik sindirim besinlerin fiziksel olarak küçültülmesidir ve enzim kullanılmaz; proteinlerin amino asitlere ayrılması hidrolizle olan kimyasal sindirimdir (s.44).",
      fc: ["Mekanik sindirim nedir?", "Besinlerin enzim kullanılmadan fiziksel olarak küçültülmesi."]
    },
    {
      bi: 0,
      metin: "Kimyasal sindirim sonucunda yağlar hangi yapı taşlarına parçalanır?",
      secenekler: [
        "Gliserol ve yağ asitleri",
        "Monosakkaritler",
        "Amino asitler",
        "Glikoz ve nişasta"
      ],
      cozum: "Kimyasal sindirimde karbohidratlar monosakkaritlere, yağlar gliserol ve yağ asitlerine, proteinler amino asitlere ayrılır (s.44).",
      fc: ["Kimyasal sindirimde yağ ne olur?", "Gliserol ve yağ asitlerine ayrılır."]
    },
    {
      bi: 0,
      metin: "Bir besin molekülünün kimyasal sindirime uğrayabilmesi için hücrede hangi iki şey gereklidir?",
      secenekler: [
        "Su ve enzim",
        "ATP ve klorofil",
        "Oksijen ve safra",
        "Mukus ve HCl"
      ],
      cozum: "Kimyasal sindirim, büyük moleküllerin hidrolizle yapı taşlarına ayrışmasıdır; hidroliz için su ve enzimler gereklidir (s.44).",
      fc: ["Kimyasal sindirim nedir?", "Büyük moleküllerin su ve enzimle hidrolize uğraması."]
    },
    {
      bi: 0,
      metin: "İnsan akyuvarının bir bakteriyi yalancı ayakla alıp sindirmesi hangi sindirim biçimine örnektir?",
      secenekler: [
        "Hücre içi sindirim",
        "Hücre dışı sindirim",
        "Mekanik sindirim",
        "Hücreler arası sindirim"
      ],
      cozum: "Besin endositozla koful içine alınır, koful lizozomla birleşir; akyuvarların mikroorganizmaları yok etmesi hücre içi sindirimdir (s.44).",
      fc: ["Hücre içi sindirim nedir?", "Besinin koful içine alınıp lizozom enzimleriyle parçalanması."]
    },
    {
      bi: 0,
      metin: "Hücre içi sindirimde besini taşıyan koful, enzimleri sağlamak için hangi organelle birleşir?",
      secenekler: [
        "Lizozom",
        "Ribozom",
        "Mitokondri",
        "Golgi aygıtı"
      ],
      cozum: "Endositozla oluşan koful lizozomla birleşir; lizozomdaki enzimler besinleri yapı taşlarına kadar parçalar (s.44).",
      fc: ["Hücre dışı sindirim nedir?", "Enzimlerin hücre dışına salgılanıp besinin dışarıda parçalanması."]
    },
    {
      bi: 1,
      metin: "İneğin dört bölmeli midesinde selülozu sindiren enzimleri kim üretir?",
      secenekler: [
        "İşkembe ve börkenekte yaşayan mikroorganizmalar",
        "Karaciğerin ürettiği safra",
        "Şirdenin kendi hücreleri",
        "İnce bağırsaktaki villuslar"
      ],
      cozum: "Çiğnenmiş besinler işkembe ve börkenekte depolanır; bu bölümlerdeki mikroorganizmaların enzimleri selülozu sindirir (s.46).",
      fc: ["Geviş getirme nedir?", "Börkenekten ağza getirilip yeniden çiğnenen besinin yutulması."]
    },
    {
      bi: 1,
      metin: "Bir inekte besinler şirdene geçmeden önce kırkbayırda işlenir. Bu bölümde besine ne olur?",
      secenekler: [
        "Besinlerdeki suyun büyük kısmını uzaklaştırmak",
        "Selülozu ilk kez parçalamak",
        "Besinleri ağza geri göndermek",
        "Safra salgılamak"
      ],
      cozum: "Kırkbayırda besinlerdeki suyun büyük bir kısmı uzaklaştırılır; sindirim şirdende kendi enzimlerle sürer (s.46).",
      fc: ["Kırkbayırın işlevi nedir?", "Besindeki suyun büyük kısmını uzaklaştırmak."]
    },
    {
      bi: 1,
      metin: "Kuşlarda besinlerin mekanik olarak öğütüldüğü yapı hangisidir?",
      secenekler: [
        "Taşlık",
        "Kursak",
        "Kloak",
        "Şirden"
      ],
      cozum: "Gaga ile alınan besin yemek borusundan kursağa gelip yumuşatılır; midede kimyasal sindirim başlar, taşlıkta mekanik öğütme olur (s.45).",
      fc: ["Kloak nedir?", "Sindirim, üreme ve boşaltımın açıldığı ortak açıklık."]
    },
    {
      bi: 1,
      metin: "Tavşanın bağırsağı, boyutuna göre tilkininkinden belirgin biçimde uzundur. Bu farkın nedeni bitkisel besinlerin sindirimidir.",
      secenekler: [
        "Selüloz sindirimi zor olduğu ve geniş emilim yüzeyi gerektiği için",
        "Etçillerin gün içinde çok daha fazla su içmesi",
        "Otçulların midelerinde asit üretmemesi",
        "Etçillerin kesici dişlerden yoksun olması"
      ],
      cozum: "Bitkisel besinler selüloz içerdiğinden sindirimi ete göre daha zordur; uzun kanal sindirime zaman ve emilime daha geniş yüzey kazandırır (s.47).",
      fc: ["Otçul sindirim kanalının uzunluğunun işlevi nedir?", "Selüloz sindirimine zaman ve emilime yüzey kazandırmak."]
    },
    {
      bi: 1,
      metin: "At, tavşan ve eşek gibi geviş getirmeyen otçullarda selüloz hangi yapıda sindirilir?",
      secenekler: [
        "Kör bağırsakta yaşayan mikroorganizmalar tarafından",
        "Dört bölmeli midenin işkembesinde",
        "Taşlıkta mekanik olarak",
        "Karaciğerde safra ile"
      ],
      cozum: "Geviş getirmeyen otçulların midesi tek bölmelidir; kör bağırsaklarında selüloz sindiren mikroorganizmalar bulunur (s.46).",
      fc: ["Yetişkin bir insanda diş sayısı nedir?", "32 diş; her yanda 4 kesici, 2 köpek, 4 azı, 6 büyük azı."]
    }
  ]
});

/* ------------------------------------------------------- 1.6 */
yazKonu({
  konu_id: "biyo_10_u01_k06",
  ders: DERS, tema: 1, tema_adi: "Enerji",
  baslik: "1.6 İnsanda Sindirim",
  kazanim: "İnsanda sindirim kanalı ile yardımcı organların işlevlerini ilişkilendirir, emilim ve taşınma süreçlerini yapısal adaptasyonlarla açıklar.",
  kaynak: kaynak("48-56"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Sindirim kanalı ve yardımcı organların sindirimdeki işlevlerini ayırt eder.",
    "İnce ve kalın bağırsaktaki emilim ile taşınma süreçlerini açıklar."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir dilim ekmek yenildiğinde nişastanın kimyasal sindirimi ilk olarak hangi organda başlar?",
      secenekler: [
        "Ağız",
        "Mide",
        "İnce bağırsak",
        "Kalın bağırsak"
      ],
      cozum: "Karbohidratların kimyasal sindirimi ağızda salgılanan tükürükle başlar; tükürük enzimi nişasta ve glikojeni maltoza parçalar (s.51).",
      fc: ["Tükürük enziminin işlevi nedir?", "Nişasta ve glikojeni maltoza parçalamak."]
    },
    {
      bi: 0,
      metin: "Mide öz suyundaki HCl, proteinlerin sindiriminde hangi işlevi görür?",
      secenekler: [
        "pH'ı düşürüp proteinleri denatüre eder",
        "Proteinleri doğrudan amino asitlere ayırır",
        "Yağları küçük damlacıklara böler",
        "Karbonhidratları maltoza çevirir"
      ],
      cozum: "HCl ortamın pH değerini düşürür ve proteinlerin üç boyutlu yapısını bozarak denatüre eder; denatüre proteinler enzimin etkisine açık hâle gelir (s.51).",
      fc: ["Mide öz suyunun içeriği nedir?", "HCl, sindirim enzimi ve mukus."]
    },
    {
      bi: 0,
      metin: "Yağların sindirimi ince bağırsakta hangi salgının etkisiyle başlar?",
      secenekler: [
        "Karaciğerde üretilen safra sıvısının",
        "Pankreasın bikarbonatının",
        "Mide öz suyunun HCl'sinin",
        "Tükürükteki karbohidrat enziminin"
      ],
      cozum: "Karaciğerde üretilip safra kesesinde depolanan safra ince bağırsağa dökülür; yağları küçük damlacıklara ayırarak enzimlerin etki yüzeyini artırır (s.50, 52).",
      fc: ["Safranın yağ sindirimindeki işlevi nedir?", "Yağları küçük damlacıklara ayırıp yüzeyi artırmak."]
    },
    {
      bi: 0,
      metin: "Safra sıvısının bileşimi dikkate alındığında hangi ifade doğrudur?",
      secenekler: [
        "Safrada sindirim enzimi bulunmaz; yağda çözünen vitaminlerin emilimini kolaylaştırır",
        "Safra proteinleri amino asitlere ayıran enzimler içerir",
        "Safra yalnızca midede salgılanır",
        "Safra nişastayı doğrudan glikoza çevirir"
      ],
      cozum: "Safra su, bikarbonat, safra tuzları, kolesterol, yağ asitleri ve bilirubin içerir; sindirim enzimi bulunmaz, A-D-E-K vitaminlerinin emilimini kolaylaştırır (s.51).",
      fc: ["Safranın bileşimi nedir?", "Su, bikarbonat, safra tuzları, kolesterol ve bilirubin; enzim yok."]
    },
    {
      bi: 0,
      metin: "Mide, yüksek asit ve sindirim enzimlerine rağmen kendi iç duvarının sindirilmesini nasıl engeller?",
      secenekler: [
        "İç duvarı kaplayan hücrelerin salgıladığı mukusla",
        "İç duvarını keratinle kaplayarak",
        "Asit salgısını tamamen durdurarak",
        "Enzimleri bağırsağa göndererek"
      ],
      cozum: "Midenin iç duvarını kaplayan hücrelerin salgıladığı mukus, mide iç duvarının sindirilmesini engeller (s.52).",
      fc: ["Mukusun midedeki işlevi nedir?", "Mide iç duvarını asit ve enzimlerden korumak."]
    },
    {
      bi: 1,
      metin: "İnce bağırsağın kıvrım, villus ve mikrovillusları sayesinde yüzey alanı yaklaşık hangi değere ulaşır?",
      secenekler: [
        "200-300 m²",
        "2-3 m²",
        "20-30 m²",
        "2000-3000 m²"
      ],
      cozum: "Bağırsak iç yüzeyindeki kıvrımlar, villus ve mikrovilluslar yüzey alanını büyük ölçüde artırır; alan yaklaşık 200-300 m²'ye ulaşır (s.53).",
      fc: ["Villus nedir?", "İnce bağırsak iç yüzeyindeki parmak şeklinde çıkıntılar."]
    },
    {
      bi: 1,
      metin: "İnce bağırsak epitel hücrelerinin bağırsak boşluğuna bakan yüzündeki fırça şeklindeki uzantılara ne ad verilir?",
      secenekler: [
        "Mikrovillus",
        "Şilomikron",
        "Villus",
        "Kılcal damar"
      ],
      cozum: "Villusları oluşturan her hücrenin bağırsak boşluğuna bakan kısmındaki sitoplazmik uzantılara mikrovillus denir (s.53).",
      fc: ["Mikrovillus nedir?", "Villus hücresinin boşluğa bakan sitoplazmik uzantıları."]
    },
    {
      bi: 1,
      metin: "Yağ asidi ve gliserol, bağırsak epitel hücrelerinde trigliserite dönüştürüldükten sonra hangi yolla taşınır?",
      secenekler: [
        "Şilomikron oluşturarak lenf kılcallarıyla",
        "Doğrudan kılcal kan damarlarıyla",
        "Mideye geri gönderilerek",
        "Kalın bağırsaktan ozmozla"
      ],
      cozum: "Trigliseritler protein ve kolesterolle kaplanarak şilomikronu oluşturur; şilomikronlar önce lenf kılcallarına, sonra kan dolaşımına katılır (s.54).",
      fc: ["Şilomikron nedir?", "Trigliseritin protein ve kolesterolle kaplanmış taşınma biçimi."]
    },
    {
      bi: 1,
      metin: "Kalın bağırsakta gerçekleşen olaylarla ilgili hangi ifade doğrudur?",
      secenekler: [
        "Su geri emilir ve B ile K vitaminleri sentezlenip emilir",
        "Proteinlerin sindirimi tamamlanır",
        "Yağlar safrayla parçalanır",
        "Villuslarda glikoz kana geçer"
      ],
      cozum: "Kalın bağırsakta sindirim gerçekleşmez; suyun büyük kısmı emilir, bakteriler B ve K vitamini sentezler ve bu vitaminler burada emilir (s.50, 54).",
      fc: ["Kalın bağırsağın işlevi nedir?", "Su ve mineral emmek; B, K vitamini sentezlemek."]
    },
    {
      bi: 1,
      metin: "İnce bağırsaktan kana geçen besin maddeleri vücuda dağılmadan önce ilk olarak hangi organa gider?",
      secenekler: [
        "Karaciğer",
        "Kalp",
        "Böbrek",
        "Akciğer"
      ],
      cozum: "Bağırsak kılcallarına emilen besinler kanla önce karaciğere gider; burada değişikliğe uğrar, toksinler dönüştürülür, sonra kalbe ve vücuda dağılır (s.54).",
      fc: ["Karaciğerin sindirim sistemindeki işlevi nedir?", "Safra üretmek, toksinleri zararsızlaştırmak, kan şekerini düzenlemek."]
    }
  ]
});

/* ------------------------------------------------------- 1.7 */
yazKonu({
  konu_id: "biyo_10_u01_k07",
  ders: DERS, tema: 1, tema_adi: "Enerji",
  baslik: "1.7 Hücresel Solunum",
  kazanim: "Oksijenli solunumun evrelerini yer, ürün ve ATP kazancı bakımından model üzerinden açıklar.",
  kaynak: kaynak("57-62"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Oksijenli solunumun evrelerini gerçekleştiği yapı ve ürünleriyle açıklar.",
    "Evrelerdeki ATP, NADH ve FADH2 kazançlarını karşılaştırır."
  ],
  items: [
    {
      bi: 0,
      metin: "Hücresel solunum ile nefes alıp verme arasındaki temel fark hangi ifadeyle açıklanır?",
      secenekler: [
        "Nefes alma gaz değişimi, hücresel solunum hücrede besin parçalanmasıdır",
        "Nefes alma yalnızca bitkilerde görülür",
        "Hücresel solunum akciğerlerde gerçekleşir",
        "İkisi de aynı olayın farklı adlarıdır"
      ],
      cozum: "Nefes alıp verme solunum organlarındaki gaz değişimidir; hücresel solunum ise organik besinlerin hücre içinde parçalanarak enerji elde edilmesidir (s.58).",
      fc: ["Hücresel solunum nedir?", "Organik besinlerin hücre içinde parçalanıp enerji elde edilmesi."]
    },
    {
      bi: 0,
      metin: "Glikoliz tepkimeleri hücrenin hangi bölümünde gerçekleşir?",
      secenekler: [
        "Sitoplazmada",
        "Mitokondri matriksinde",
        "Mitokondrinin kristasında",
        "Çekirdekte"
      ],
      cozum: "Glikoliz, glikozun enzimlerin kontrolünde sitoplazmada 2 piruvata kadar parçalandığı tepkime dizisidir (s.59).",
      fc: ["Glikoliz nedir?", "Glikozun sitoplazmada 2 piruvata parçalanması."]
    },
    {
      bi: 0,
      metin: "Bir glikoz molekülünün glikolizinde 2 ATP harcanıp 4 ATP sentezlendiğine göre net ATP kazancı kaçtır?",
      secenekler: [
        "2",
        "4",
        "6",
        "0"
      ],
      cozum: "Glikolizde başlangıçta 2 ATP harcanır, sonra 4 ATP sentezlenir; net kazanç 2 ATP'dir ve 2 NADH oluşur (s.60).",
      fc: ["Glikolizin net ATP kazancı nedir?", "2 ATP; ayrıca 2 NADH oluşur."]
    },
    {
      bi: 0,
      metin: "Glikolizle oluşan piruvat mitokondriye girdiğinde hangi bileşiğe dönüşür?",
      secenekler: [
        "Asetil-CoA",
        "Glikoz",
        "Laktik asit",
        "Sitrik asit"
      ],
      cozum: "Her piruvat, bir molekül CO2 çıkışı ve NADH oluşumuyla Krebs döngüsünü başlatacak 2 karbonlu Asetil-CoA'ya dönüşür (s.60).",
      fc: ["Piruvat oksidasyonu nedir?", "Piruvatın CO2 çıkışıyla Asetil-CoA'ya dönüşmesi."]
    },
    {
      bi: 0,
      metin: "Krebs döngüsü ökaryot hücrede hangi bölümde gerçekleşir?",
      secenekler: [
        "Mitokondri matriksinde",
        "Sitoplazmada",
        "Kloroplast stromasında",
        "Golgi keseciklerinde"
      ],
      cozum: "Krebs döngüsü mitokondrinin matriksinde gerçekleşir; tepkimeleri 1937'de Hans Krebs açıklamıştır (s.60).",
      fc: ["Krebs döngüsü nedir?", "Asetil-CoA'nın CO2, NADH, FADH2 ve ATP ürettiği döngü."]
    },
    {
      bi: 1,
      metin: "Bir glikoz molekülü için Krebs döngüsü kaç kez gerçekleşir ve döngüde kaç CO2 açığa çıkar?",
      secenekler: [
        "2 kez, 4 CO2",
        "1 kez, 2 CO2",
        "2 kez, 2 CO2",
        "3 kez, 6 CO2"
      ],
      cozum: "Glikozdan 2 Asetil-CoA oluştuğu için döngü iki kez işler; her döngüde 2 CO2 çıkar, toplam 4 CO2 ile 6 NADH, 2 FADH2 ve 2 ATP üretilir (s.61).",
      fc: ["Krebs döngüsünün ürünleri nedir?", "4 CO2, 6 NADH, 2 FADH2 ve 2 ATP (glikoz başına)."]
    },
    {
      bi: 1,
      metin: "Elektron taşıma sistemi ökaryot hücrede hangi yapıda yer alır?",
      secenekler: [
        "Mitokondrinin krista adı verilen kıvrımlı iç zarında",
        "Mitokondri matriksinin sıvısında",
        "Sitoplazmadaki ribozomlarda",
        "Çekirdek zarının gözeneklerinde"
      ],
      cozum: "ETS evresi ökaryotlarda mitokondrinin kristalarında, prokaryotlarda hücre zarının iç yüzeyinde gerçekleşir (s.61).",
      fc: ["ETS nedir?", "Elektronların taşınarak ATP üretildiği zar üzerindeki taşıyıcı dizisi."]
    },
    {
      bi: 1,
      metin: "ETS'de elektronların son alıcısı oksijen olduğunda hangi ürün oluşur?",
      secenekler: [
        "Su",
        "Karbondioksit",
        "Piruvat",
        "Asetil-CoA"
      ],
      cozum: "Oksijen, enerjisi düşmüş elektronları alarak bir çift protonla birleşir ve su oluşur; bu sayede elektron akışı ve ATP sentezi sürer (s.61).",
      fc: ["ETS'de oksijenin görevi nedir?", "Son elektron alıcısı olmak; protonlarla birleşip su oluşturmak."]
    },
    {
      bi: 1,
      metin: "Bir glikozun oksijenli solunumla parçalanmasında kazanılan ATP'nin büyük kısmı hangi evrede üretilir?",
      secenekler: [
        "ETS evresinde",
        "Glikolizde",
        "Piruvat oksidasyonunda",
        "Krebs döngüsünde"
      ],
      cozum: "ATP'lerin büyük bir kısmı ETS evresinde üretilir; enerjinin geri kalanı ısı olarak ortama yayılır (s.61).",
      fc: ["Oksijenli solunumda ATP veriminin en yüksek olduğu yer nedir?", "Mitokondrinin kristalarındaki ETS evresi."]
    },
    {
      bi: 1,
      metin: "Sadeleştirilmiş oksijenli solunum denklemi C6H12O6 + 6O2 → 6CO2 + 6H2O + ATP + ısı olduğuna göre bir glikoz için kaç oksijen tüketilir?",
      secenekler: [
        "6",
        "12",
        "3",
        "2"
      ],
      cozum: "Denklemde 1 glikoz için 6 O2 tüketilir; sadeleştirilmemiş biçimde 6 H2O da tepkimeye girer ve 12 H2O oluşur (s.59).",
      fc: ["Oksijenli solunumun genel denklemi nedir?", "C6H12O6 + 6O2 → 6CO2 + 6H2O + ATP + ısı."]
    }
  ]
});

/* ------------------------------------------------------- 1.8 */
yazKonu({
  konu_id: "biyo_10_u01_k08",
  ders: DERS, tema: 1, tema_adi: "Enerji",
  baslik: "1.8 Besinlerin Solunuma Katılma Yolları",
  kazanim: "Karbohidrat, yağ ve proteinlerin oksijenli solunuma katıldığı basamakları karbon iskeletleri bakımından karşılaştırır.",
  kaynak: kaynak("63-66"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Besin gruplarının solunuma katıldığı basamakları belirler.",
    "Karbon sayısının katılım basamağını belirlemedeki rolünü açıklar."
  ],
  items: [
    {
      bi: 0,
      metin: "Karbohidratların yapı taşı olan glikoz, oksijenli solunum tepkimelerine hangi evreden girer?",
      secenekler: [
        "Glikolizden",
        "Krebs döngüsünden",
        "ETS evresinden",
        "Piruvat oksidasyonundan"
      ],
      cozum: "Glikoz glikoliz evresinden solunuma girerek piruvata kadar parçalanır; sonra piruvat Asetil-CoA'ya dönüşür (s.66).",
      fc: ["Glikozun solunuma girdiği evre nedir?", "Glikoliz."]
    },
    {
      bi: 0,
      metin: "Yağların sindirim ürünü olan yağ asitleri solunum tepkimelerine hangi basamaktan katılır?",
      secenekler: [
        "Asetil-CoA'ya dönüştükten sonra Krebs döngüsünden",
        "Doğrudan glikoliz evresinden, glikoz gibi",
        "Doğrudan ETS evresinden, oksijen gibi",
        "Glikolizin ara basamaklarından, gliserol gibi"
      ],
      cozum: "Yağ asitleri Asetil-CoA'ya dönüştürüldükten sonra Krebs döngüsüne girer; gliserol ise glikolizin ara basamaklarından katılır (s.66).",
      fc: ["Yağ asitlerinin solunuma katılma yeri nedir?", "Asetil-CoA üzerinden Krebs döngüsü."]
    },
    {
      bi: 0,
      metin: "Yağların diğer sindirim ürünü olan 3 karbonlu gliserol hangi basamaktan solunuma katılır?",
      secenekler: [
        "Glikolizin ara basamaklarından",
        "Doğrudan Krebs döngüsünden",
        "Doğrudan ETS evresinden",
        "Piruvat oksidasyonundan"
      ],
      cozum: "Gliserol (3C) glikolizin ara basamaklarından tepkimeye girer; yağ asitleri ise Asetil-CoA üzerinden Krebs'e katılır (s.66).",
      fc: ["Gliserolün solunuma katılma yeri nedir?", "Glikolizin ara basamakları."]
    },
    {
      bi: 0,
      metin: "3 karbonlu bir amino asit, amino grubu uzaklaştırıldıktan sonra solunum tepkimelerine hangi basamaktan katılır?",
      secenekler: [
        "Piruvattan",
        "Asetil-CoA'dan",
        "Krebs döngüsünden",
        "Glikolizin ilk basamağından"
      ],
      cozum: "Amino asitlerde önce amino grubu uzaklaştırılır; 2 karbonlular Asetil-CoA'dan, 3 karbonlular piruvattan, 4 ve daha fazla karbonlular Krebs'ten katılır (s.66).",
      fc: ["Amino asitlerin solunuma katılım kuralı nedir?", "C sayısı: 2→Asetil-CoA, 3→piruvat, 4+→Krebs."]
    },
    {
      bi: 0,
      metin: "4 ve daha fazla karbonlu amino asitler solunum tepkimelerine hangi basamaktan girer?",
      secenekler: [
        "Krebs döngüsünden",
        "Piruvattan",
        "Asetil-CoA'dan",
        "ETS evresinden"
      ],
      cozum: "4 ve daha fazla karbonlu amino asitler Krebs döngüsünden tepkimeye girer; 2 karbonlular Asetil-CoA'dan, 3 karbonlular piruvattan katılır (s.66).",
      fc: ["Asetil-CoA nedir?", "Piruvattan oluşan 2 karbonlu bileşik; Krebs'i başlatır."]
    },
    {
      bi: 1,
      metin: "Proteinlerden enerji elde edilirken amino asitlerin yapısındaki azot, solunum tepkimelerine katılmadan önce ne olur?",
      secenekler: [
        "Amino grubu uzaklaştırılır ve azotlu atık oluşur",
        "Azot ATP'ye aktarılır",
        "Azot glikozun yapısına katılır",
        "Azot ETS'de elektron alıcısı olur"
      ],
      cozum: "Amino asitler solunuma katılmadan önce amino grubu uzaklaştırılır; bu nedenle amino asit yıkımında azot içeren atık maddeler de oluşur (s.66).",
      fc: ["Protein yıkımının diğer besinlerden farkı nedir?", "Ek olarak azot içeren atık maddeler oluşur."]
    },
    {
      bi: 1,
      metin: "Karbohidrat, yağ ve proteinlerin solunum sonucunda ortak olarak açığa çıkardığı ürünler hangileridir?",
      secenekler: [
        "CO2, H2O, ATP ve ısı",
        "Yalnızca CO2 ve ATP",
        "Glikoz, ATP ve oksijen",
        "Azotlu atık, ATP ve ısı"
      ],
      cozum: "Üç besin grubunda da CO2, H2O, ATP ve ısı açığa çıkar; azotlu atık yalnızca amino asitlerin yıkımında eklenir (s.66).",
      fc: ["Hücresel solunumun ortak ürünleri nedir?", "CO2, H2O, ATP ve ısı."]
    },
    {
      bi: 1,
      metin: "Bir öğünde alınan glikoz, yağ asidi ve amino asit aynı solunum yolunu izlemez. Bu farklılığın kaynağı, moleküllerin karbon iskeletlerinin farklı olmasıdır.",
      secenekler: [
        "Kimyasal yapılarındaki karbon iskeletlerinin farklı olması",
        "Sindirim enzimlerinin yetersizliği",
        "Hücrelerin farklı organellerde solunum yapması",
        "Besinlerin enerji değerlerinin eşit olması"
      ],
      cozum: "Besin gruplarının kimyasal yapılarındaki, özellikle karbon iskeletlerindeki farklılıklar nedeniyle her besin türü solunumun farklı basamağına katılır (s.65).",
      fc: ["Karbon iskeleti ile katılım basamağı arasındaki ilişki nedir?", "İskeletin karbon sayısı basamağı belirler."]
    },
    {
      bi: 1,
      metin: "Kahvaltıda tereyağı ve yumurta tüketen bir kişide yağ asitleri ile amino asitlerin solunuma katılımı karşılaştırıldığında hangisi doğrudur?",
      secenekler: [
        "Yağ asidi Asetil-CoA'dan, 2 karbonlu amino asit de Asetil-CoA'dan katılır",
        "Her ikisi de doğrudan ETS'ye girer",
        "Yağ asidi glikolizden, amino asit Krebs'ten girer",
        "Her ikisi de piruvattan katılır"
      ],
      cozum: "Yağ asitleri Asetil-CoA'ya dönüşüp Krebs'e girer; 2 karbonlu amino asitler de Asetil-CoA'dan katıldığı için bu iki besin aynı basamağı paylaşabilir (s.66).",
      fc: ["Yağ asidinin katılım basamağı nedir?", "Asetil-CoA; 2 karbonlu amino asitlerle aynı basamak."]
    },
    {
      bi: 1,
      metin: "Bir sporcunun uzun süre aç kaldıktan sonra enerji elde etmek için önce yağ depolarını kullanması hangi sıra ile açıklanır?",
      secenekler: [
        "Yağ asidi → Asetil-CoA → Krebs → ETS",
        "Gliserol → Krebs → glikoliz → ETS",
        "Yağ asidi → piruvat → glikoliz → ETS",
        "Yağ asidi → ETS → Krebs → Asetil-CoA"
      ],
      cozum: "Yağ asitleri önce Asetil-CoA'ya dönüştürülür, Krebs döngüsüne girer, NADH ve FADH2 ETS'ye aktarılarak ATP üretilir (s.66).",
      fc: ["Yağ asidinin enerji yolculuğu nedir?", "Asetil-CoA → Krebs döngüsü → ETS."]
    }
  ]
});

/* ------------------------------------------------------- 1.9 */
yazKonu({
  konu_id: "biyo_10_u01_k09",
  ders: DERS, tema: 1, tema_adi: "Enerji",
  baslik: "1.9 Fermantasyon",
  kazanim: "Fermantasyon çeşitlerini son ürünlerine göre karşılaştırır, fermantasyonun endüstri ve insan sağlığındaki yerini örneklendirir.",
  kaynak: kaynak("67-70"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Etil alkol ve laktik asit fermantasyonunu son ürünleriyle karşılaştırır.",
    "Fermantasyonun endüstri ve insan sağlığındaki yerini örneklendirir."
  ],
  items: [
    {
      bi: 0,
      metin: "Fermantasyon tepkimeleri hücrenin neresinde ve hangi koşulda gerçekleşir?",
      secenekler: [
        "Sitoplazmada, oksijen ve ETS kullanılmadan",
        "Mitokondride, oksijen varlığında",
        "Kloroplastta, ışık varlığında",
        "ETS'de, oksijen son alıcıyken"
      ],
      cozum: "Fermantasyon, ökaryot ve prokaryot hücrelerin sitoplazmasında oksijen ve ETS kullanılmadan monosakkaritlerin parçalanmasıyla gerçekleşir (s.69).",
      fc: ["Fermantasyonun temel koşulu nedir?", "Oksijen ve ETS kullanılmadan, sitoplazmada gerçekleşmesi."]
    },
    {
      bi: 0,
      metin: "Fermantasyonda glikolizde oluşan 2 NADH'nin hidrojenleri başka moleküllere aktarılır. Bu aktarımın amacı nedir?",
      secenekler: [
        "NAD⁺ yenileyerek glikolizin sürmesini sağlamak",
        "ATP sayısını iki katına çıkarmak",
        "Oksijen üretmek",
        "Karbondioksiti parçalamak"
      ],
      cozum: "2 NADH'deki hidrojenler organik ya da inorganik maddelere aktarılır ve NAD⁺ yeniden oluşur; böylece glikoliz ve ATP üretimi devam eder (s.69).",
      fc: ["NAD⁺ yenilenmesinin amacı nedir?", "Oksijensiz koşulda glikolizin sürmesini sağlamak."]
    },
    {
      bi: 0,
      metin: "Etil alkol fermantasyonunun ilk basamağında piruvata ne olur?",
      secenekler: [
        "Karbondioksit uzaklaşır ve asetaldehit oluşur",
        "Su eklenerek laktik aside dönüşür",
        "Doğrudan etil alkole indirgenir",
        "Asetil-CoA'ya çevrilir"
      ],
      cozum: "İlk basamakta piruvattan CO2 uzaklaştırılır ve iki karbonlu asetaldehit oluşur; ikinci basamakta asetaldehit NADH ile etil alkole indirgenir (s.69).",
      fc: ["Asetaldehit nedir?", "Piruvattan CO2 çıkışıyla oluşan 2 karbonlu ara ürün."]
    },
    {
      bi: 0,
      metin: "Etil alkol fermantasyonunda asetaldehit hangi molekülün hidrojenleriyle etil alkole indirgenir?",
      secenekler: [
        "NADH",
        "FADH2",
        "ATP",
        "NADPH"
      ],
      cozum: "İkinci basamakta asetaldehit NADH ile etil alkole indirgenir; böylece glikoliz için gerekli NAD⁺ yenilenir (s.69).",
      fc: ["Fermantasyon çeşitlerinin adlandırılma ölçütü nedir?", "Oluşan son ürün çeşidi."]
    },
    {
      bi: 0,
      metin: "Hangi fermantasyon çeşidinde karbondioksit çıkışı görülmez?",
      secenekler: [
        "Laktik asit fermantasyonunda",
        "Etil alkol fermantasyonunda",
        "Her ikisinde de görülür",
        "Yalnızca mayalarda"
      ],
      cozum: "Laktik asit fermantasyonunda piruvat doğrudan laktik aside dönüşür ve CO2 çıkışı görülmez; etil alkol fermantasyonunda CO2 açığa çıkar (s.70).",
      fc: ["Laktik asit fermantasyonu nedir?", "Piruvatın NADH hidrojenleriyle laktik aside dönüşmesi; CO2 yok."]
    },
    {
      bi: 1,
      metin: "Maya ile mayalanan hamur 1 saat sonra belirgin biçimde kabarır. Bu kabarmanın nedeni nedir?",
      secenekler: [
        "Maya mantarlarının etil alkol fermantasyonunda ürettiği CO2 gazı",
        "Hamurdaki suyun fırın sıcaklığıyla buharlaşması",
        "Hamurda laktik asidin birikmesi ve pH'ı düşürmesi",
        "Nişastanın glikoza kadar hidroliz edilmesi"
      ],
      cozum: "Ekmek yapımında etil alkol fermantasyonu yapan maya mantarları kullanılır; açığa çıkan CO2 hamurun kabarmasını sağlar (s.69).",
      fc: ["Maya mantarının hamurdaki etkisi nedir?", "Etil alkol fermantasyonu; CO2 hamuru kabartır."]
    },
    {
      bi: 1,
      metin: "Peynir, yoğurt ve turşu üretiminde endüstriyel olarak hangi fermantasyon kullanılır?",
      secenekler: [
        "Laktik asit fermantasyonu",
        "Etil alkol fermantasyonu",
        "Oksijenli solunum",
        "Kemosentez"
      ],
      cozum: "Laktik asit fermantasyonu bazı bakteri ve mantarlarda görülür; endüstride peynir, yoğurt ve turşu üretiminde kullanılır (s.70).",
      fc: ["Laktik asit fermantasyonunun endüstrideki yeri nedir?", "Peynir, yoğurt ve turşu üretimi."]
    },
    {
      bi: 1,
      metin: "Yoğun bir koşunun ilk 30 saniyesinde çizgili kaslarda laktik asit fermantasyonu devreye girer. Bunun nedeni nedir?",
      secenekler: [
        "Glikoz yıkım hızının, kasın kandan oksijen alma hızını aşması",
        "Kasta mitokondri bulunmaması",
        "Kas hücrelerinin oksijeni zehirli bulması",
        "Kanda glikoz bulunmaması"
      ],
      cozum: "Yoğun aktivitenin başında glikoz yıkım hızı oksijen alma hızını aşar; bu koşulda oksijenli solunumla birlikte laktik asit fermantasyonu da ATP üretir (s.70).",
      fc: ["Kaslarda laktik asit birikmesinin nedeni nedir?", "Oksijen yetişmediğinde piruvatın laktik aside dönmesi."]
    },
    {
      bi: 1,
      metin: "Yetişkin bir memelinin hangi hücreleri oksijenli solunum yerine sürekli laktik asit fermantasyonu yapar?",
      secenekler: [
        "Olgun alyuvar hücreleri",
        "Çizgili kas hücreleri",
        "Karaciğer hücreleri",
        "Sinir hücreleri"
      ],
      cozum: "Laktik asit fermantasyonu bazı bakterilerde, bazı mantarlarda, memelilerin olgun alyuvar hücrelerinde ve omurgalıların çizgili kas hücrelerinde görülür (s.70).",
      fc: ["Olgun alyuvarın enerji elde etme yolu nedir?", "Laktik asit fermantasyonu; mitokondri taşımaz."]
    },
    {
      bi: 1,
      metin: "Yoğurt, kefir, kımız, peynir ve kurut gibi 5 ürünün ortak özelliği nedir?",
      secenekler: [
        "Fermantasyonla üretilen süt ürünleri olmaları",
        "Yalnızca etil alkol içermeleri",
        "Işıkla üretilmeleri",
        "Sindirilemeyen selüloz içermeleri"
      ],
      cozum: "Bu ürünler fermente süt ürünleridir; probiyotik özellikleriyle bağırsak sağlığını ve bağışıklığı destekleyebilirler (s.67).",
      fc: ["Probiyotik nedir?", "Bağırsak sağlığını destekleyen yararlı mikroorganizma içeriği."]
    }
  ]
});

/* ------------------------------------------------------- 1.10 */
yazKonu({
  konu_id: "biyo_10_u01_k10",
  ders: DERS, tema: 1, tema_adi: "Enerji",
  baslik: "1.10 Enerji-Metabolizma İlişkisi",
  kazanim: "Metabolik tepkimeleri anabolizma ve katabolizma olarak sınıflandırır, besinlerin enerji değerlerini enerji dengesiyle ilişkilendirir.",
  kaynak: kaynak("71-74"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Metabolik tepkimeleri anabolizma ve katabolizma olarak ayırt eder.",
    "Besinlerin enerji değerlerini karşılaştırarak enerji dengesini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Bitkinin fotosentezle karbohidrat, protein ve vitamin sentezlemesi hangi metabolik tepkime türüne örnektir?",
      secenekler: [
        "Anabolizma",
        "Katabolizma",
        "Fermantasyon",
        "Oksidasyon"
      ],
      cozum: "Basit moleküllerin birleştirilerek daha karmaşık moleküllerin sentezlendiği yapım tepkimelerine anabolizma denir; fotosentez bunun örneğidir (s.74).",
      fc: ["Anabolizma nedir?", "Basit moleküllerden karmaşık molekül sentezleyen yapım tepkimeleri."]
    },
    {
      bi: 0,
      metin: "Sindirim ve solunum olayları hangi metabolik tepkime grubunda yer alır?",
      secenekler: [
        "Katabolizma",
        "Anabolizma",
        "Fosforilasyon",
        "Kemosentez"
      ],
      cozum: "Büyük moleküllerden daha küçük moleküllerin oluşturulduğu yıkım tepkimelerine katabolizma denir; sindirim ve solunum katabolik tepkimelerdir (s.74).",
      fc: ["Katabolizma nedir?", "Büyük moleküllerin küçük moleküllere yıkıldığı tepkimeler."]
    },
    {
      bi: 0,
      metin: "Bir hücrede gerçekleşen tüm kimyasal reaksiyonların oluşturduğu bütüne ne ad verilir?",
      secenekler: [
        "Metabolizma",
        "Homeostazi",
        "Fotoliz",
        "Difüzyon"
      ],
      cozum: "Metabolizma, canlı organizmalarda yaşamın sürdürülebilmesi için gerçekleşen kimyasal reaksiyonların bütünüdür (s.74).",
      fc: ["Metabolizma nedir?", "Yaşamı sürdüren kimyasal reaksiyonların bütünü."]
    },
    {
      bi: 0,
      metin: "Hücresel solunumda yağların karbohidratlara göre 2 kat daha fazla ATP üretmesinin nedeni nedir?",
      secenekler: [
        "Yağların bol miktarda C-H bağı içermesi ve daha fazla oksijen kullanması",
        "Yağların sindirilmeden kana geçmesi",
        "Yağların daha az karbon içermesi",
        "Yağların mitokondriye girmemesi"
      ],
      cozum: "Yağlar bol C-H bağı içerir; karbohidratların oksijen içeriği daha yüksek, C-H bağları daha azdır; bu yüzden yağlar daha fazla O2 ile 2 kat fazla ATP üretir (s.74).",
      fc: ["Yağların kimyasal üstünlüğü nedir?", "Bol C-H bağı; daha fazla O2 ile 2 kat ATP."]
    },
    {
      bi: 0,
      metin: "Bir gram karbohidrat ile bir gram proteinin oksijenli solunumla sağladığı enerji miktarı kaç kcal'dir?",
      secenekler: [
        "4,0 kcal",
        "9,0 kcal",
        "16,7 kcal",
        "37,7 kcal"
      ],
      cozum: "Karbohidrat ve proteinlerin 1 gramı 4,0 kcal/g (16,7 kJ/g), yağların 1 gramı ise 9,0 kcal/g (37,7 kJ/g) enerji sağlar (s.74).",
      fc: ["Karbohidrat ve proteinin enerji değeri nedir?", "4,0 kcal/g (16,7 kJ/g)."]
    },
    {
      bi: 1,
      metin: "Bir gram yağın oksijenli solunumla sağladığı enerji miktarı kaç kcal'dir?",
      secenekler: [
        "9,0 kcal",
        "4,0 kcal",
        "16,7 kcal",
        "2,0 kcal"
      ],
      cozum: "Yağların 1 gramı 9,0 kcal/g (37,7 kJ/g) enerji verir; bu değer karbohidrat ve proteinin iki katından fazladır (s.74).",
      fc: ["Yağların enerji değeri nedir?", "9,0 kcal/g (37,7 kJ/g)."]
    },
    {
      bi: 1,
      metin: "Bir kilokalori kaç kaloriye eşittir?",
      secenekler: [
        "1.000 kalori",
        "100 kalori",
        "10 kalori",
        "0,239 kalori"
      ],
      cozum: "Bir kilokalori (kcal) 1.000 kaloridir; bir kalori, 1 gram suyun sıcaklığını 1 °C artırmak için gereken ısıdır (s.74).",
      fc: ["Kalori nedir?", "1 g suyun sıcaklığını 1 °C artıran ısı miktarı."]
    },
    {
      bi: 1,
      metin: "Sağlığı bozacak ölçüde vücutta aşırı yağ birikmesi hangi kavramla ifade edilir?",
      secenekler: [
        "Obezite",
        "Anabolizma",
        "Katabolizma",
        "Açlık"
      ],
      cozum: "Obezite, sağlığı bozacak ölçüde vücutta aşırı yağ birikmesidir; aşırı yağlı, tuzlu ve şekerli besinler ile fiziksel aktivite yetersizliği başlıca nedenlerdir (s.72).",
      fc: ["Obezite nedir?", "Sağlığı bozacak ölçüde aşırı yağ birikmesi."]
    },
    {
      bi: 1,
      metin: "Günlük alınan enerji harcanandan sürekli fazla olduğunda uzun vadede hangi sonuç beklenir?",
      secenekler: [
        "Vücutta yağ birikimi artar ve obezite riski yükselir",
        "Kas kütlesi hızla artar ve güçlenir",
        "Metabolizma tamamen durur ve ısı üretilmez",
        "Besinlerin enerji değeri kalıcı olarak düşer"
      ],
      cozum: "Obeziteyi önlemek için alınan günlük enerjinin harcanandan fazla olmaması gerekir; aşırı alım diyabet, inme, kalp damar hastalıkları gibi sorunlara yol açar (s.72).",
      fc: ["Enerji dengesi ne demektir?", "Alınan enerji ile harcanan enerjinin eşitlenmesi."]
    },
    {
      bi: 1,
      metin: "Uzun uzay yolculuklarında astronotların metabolizma hızının %75 azaltılması hangi amaca hizmet eder?",
      secenekler: [
        "Besin, oksijen ve yaşam alanı gereksinimini azaltmaya",
        "Kas kütlesini artırmaya",
        "Beyin aktivitesini hızlandırmaya",
        "Vücut sıcaklığını yükseltmeye"
      ],
      cozum: "Metabolizma hızı azalınca enerji ve oksijen tüketimi düşer; astronotlar daha küçük bir modülde ve daha az besinle yolculuğu tamamlayabilir (s.71).",
      fc: ["Kış uykusunun fizyolojik etkisi nedir?", "Kalp atışı ve solunum yavaşlar, vücut sıcaklığı düşer."]
    }
  ]
});
