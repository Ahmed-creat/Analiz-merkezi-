#!/usr/bin/env node
/* ============================================================
   COĞRAFYA 10 · 3. ÜNİTE (DOĞAL SİSTEMLER VE SÜREÇLER) — 3.1-3.2
   ------------------------------------------------------------
   Kaynak: MEB Coğrafya 10 (2025) — cografya.json.
   Basılı sayfa = PDF sayfası − 1.

     3.1 Tektonik Süreçler                                  s.49-69
     3.2 İklim ve Kayaç Yapısının Aşınma ve Çözünme
         Süreçlerine Etkisi                                 s.70-75

   Kullanım: node docs/uretim/uretim/cografya-t2.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Coğrafya";
const DOSYA = "cografya-10.pdf (MEB, 2025)";
const kaynak = s => "Coğrafya 10 ders kitabı, s." + s;

/* ------------------------------------------------------- 3.1 */
yazKonu({
  konu_id: "cogr_10_u03_k01",
  ders: DERS, tema: 3, tema_adi: "Doğal Sistemler ve Süreçler",
  baslik: "3.1 Tektonik Süreçler",
  kazanim: "Levha tektoniğinin yer şekillerinin oluşum ve dağılışı üzerindeki etkisini çözümler.",
  kaynak: kaynak("49-69"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Levha hareketlerini ve bu hareketlerin oluşturduğu yer şekillerini açıklar.",
    "Türkiye'nin tektonik yapısı ile deprem, volkanizma ve jeotermal alanları ilişkilendirir."
  ],
  items: [
    {
      bi: 0,
      metin: "Alfred Wegener'in 1915'te ortaya koyduğu kıtaların kayması kuramında temel kanıt olarak ne gösterilmiştir?",
      secenekler: [
        "Birbirinden çok uzak kıtaların sınırlarının yapboz parçaları gibi benzemesi",
        "Okyanus tabanlarındaki yayılma hızının ölçülmesi",
        "Deprem dalgalarının sismografla kaydedilmesi",
        "Volkanik küllerin kimyasal analizi"
      ],
      cozum: "Wegener, birbirinden çok uzakta bulunan kıtaların sınırlarının yapbozun parçaları gibi benzemesini kuramının temel kanıtı olarak göstermiştir (s.49).",
      fc: ["Kıtaların kayması kuramı nedir?", "Wegener'in kıtaların hareket ettiğini ileri sürdüğü, kıta sınırlarının benzerliğine dayanan kuram."]
    },
    {
      bi: 0,
      metin: "Kıtaların kayması kuramının ardından levha tektoniği kuramının geliştirilmesinde hangi araştırma etkili olmuştur?",
      secenekler: [
        "Okyanus tabanlarındaki yayılmanın incelenmesi",
        "Fosil türlerinin sınıflandırılması",
        "Akarsu rejimlerinin ölçülmesi",
        "Nüfus hareketlerinin haritalanması"
      ],
      cozum: "1960 sonrasında okyanus tabanlarındaki yayılmadan yola çıkılarak kıtaların neden ve nasıl hareket ettiğini açıklayan levha tektoniği kuramı geliştirilmiştir (s.49).",
      fc: ["Levha tektoniği kuramı nedir?", "Yer kabuğunun levhalardan oluştuğunu ve bu levhaların hareket ettiğini açıklayan kuram."]
    },
    {
      bi: 0,
      metin: "Levhaların yatay, dikey ve yanal hareketleri ile bu hareketlere bağlı oluşan süreçlerin tamamına verilen ad hangisidir?",
      secenekler: [
        "Tektonizma",
        "Orojenez",
        "Ayrışma",
        "Sedimantasyon"
      ],
      cozum: "Levhaların yatay, dikey ve yanal hareketleri ile bunlara bağlı süreçlerin tamamı tektonizma olarak adlandırılır (s.49).",
      fc: ["Tektonizma nedir?", "Levha hareketleri ile bu hareketlere bağlı oluşan süreçlerin tamamı."]
    },
    {
      bi: 0,
      metin: "Levhaların ters yönde uzaklaşmasıyla oluşan ve büyük depremlerin sık yaşandığı okyanus ortası sırtları hangi sürecin sonucudur?",
      secenekler: [
        "Ayrılma (uzaklaşma) hareketi",
        "Yaklaşma (çarpışma) hareketi",
        "Yanal kayma hareketi",
        "Dalma-batma hareketi"
      ],
      cozum: "Ayrılma ilerledikçe levha sınırına magma eklenir ve okyanus ortası sırtları oluşur; bu alanlar büyük depremlerin sık yaşandığı yerlerdir (s.51).",
      fc: ["Okyanus ortası sırtı nedir?", "Levhaların ayrıldığı sınır boyunca magma eklenmesiyle oluşan su altı yükseltisi."]
    },
    {
      bi: 0,
      metin: "Yaklaşan iki levhadan okyanusal kabuğun kıtasal kabuğun altına dalması sırasında oluşan derin okyanus çukurlarına ne ad verilir?",
      secenekler: [
        "Hendek",
        "Graben",
        "Kaldera",
        "Peneplen"
      ],
      cozum: "Dalma-batma zonu boyunca okyanus tabanında hendek adı verilen derin çukurlar oluşur (s.53).",
      fc: ["Hendek nedir?", "Yaklaşan levhalarda okyanusal kabuğun dalmasıyla oluşan derin okyanus çukuru."]
    },
    {
      bi: 0,
      metin: "Levhaların yaklaşması sırasında tortul tabakaların kıvrılıp yükselmesiyle meydana gelen dağ oluşumuna ne ad verilir?",
      secenekler: [
        "Orojenez",
        "Tektonizma",
        "Karstlaşma",
        "Ayrışma"
      ],
      cozum: "Tortul tabakaların kıvrılıp yükselmesiyle orojenez adı verilen dağ oluşumu gerçekleşir (s.53).",
      fc: ["Orojenez nedir?", "Tortul tabakaların kıvrılması veya kırılarak yükselmesiyle oluşan dağ oluşumu."]
    },
    {
      bi: 1,
      metin: "Yer kabuğunda depreme neden olan ilk hareketin başladığı odak noktasına verilen ad hangisidir?",
      secenekler: [
        "İç merkez",
        "Dış merkez",
        "Taban seviyesi",
        "Levha sınırı"
      ],
      cozum: "Depremde ilk hareketin başladığı odak noktası iç merkez, bunun yeryüzündeki karşılığı ise dış merkezdir (s.64).",
      fc: ["Dış merkez nedir?", "Deprem odağının yeryüzünde karşılık geldiği, sarsıntının en çok hissedildiği yer."]
    },
    {
      bi: 1,
      metin: "Akışkan bazaltik lavların yayılıp birikmesiyle oluşan yayvan şekilli volkan konilerine hangi örnek verilebilir?",
      secenekler: [
        "Hawaii Adaları'ndaki Mauna Loa",
        "İtalya'daki Vezüv Dağı",
        "Japonya'daki Fuji Dağı",
        "Meksika'daki Parikutin Konisi"
      ],
      cozum: "Mauna Loa ve Kilauea gibi Hawaii Adaları'ndaki volkanlar kalkan volkanlara örnektir (s.59).",
      fc: ["Kalkan volkan nedir?", "Akışkan bazaltik lavların yayılıp birikmesiyle oluşan yayvan konili volkan."]
    },
    {
      bi: 1,
      metin: "Magmanın kaya tabakaları arasındaki boşluklara sokulup katılaşmasıyla oluşan mantar görünümlü derinlik volkanizması oluşumu hangisidir?",
      secenekler: [
        "Lakolit",
        "Batolit",
        "Sill",
        "Dayk"
      ],
      cozum: "Kaya tabakaları arasındaki boşluklara sokulan magmanın mantar görünümlü oluşumu lakolittir (s.60).",
      fc: ["Lakolit nedir?", "Magmanın tabakalar arası boşluklara sokulup katılaşmasıyla oluşan mantar biçimli kütle."]
    },
    {
      bi: 1,
      metin: "Kuzey Anadolu Fay Sistemi boyunca oluşan çöküntü alanları hangi yer şekline örnektir?",
      secenekler: [
        "Graben",
        "Horst",
        "Antiklinal",
        "Senklinal"
      ],
      cozum: "Kuzey Anadolu Fay Sistemi boyunca graben özelliğinde çok sayıda çöküntü alanı bulunur; Adapazarı, Bolu, Düzce, Tosya, Niksar, Erzincan ve Iğdır ovaları bunlardandır (s.66).",
      fc: ["Graben nedir?", "Kırılan arazide çökerek oluşan çukurluk alan."]
    },
    {
      bi: 1,
      metin: "Batı Anadolu'da horst özelliğinde kırık dağları oluşmuştur. Aşağıdakilerden hangisi bu dağlardandır?",
      secenekler: [
        "Bozdağlar",
        "Erciyes Dağı",
        "Ağrı Dağı",
        "Süphan Dağı"
      ],
      cozum: "Batı Anadolu'da horst özelliğindeki kırık dağların başlıcaları Bozdağlar, Aydın Dağları ve Menteşe Dağları'dır (s.66).",
      fc: ["Horst nedir?", "Kırılan arazide yükselerek oluşan kırık dağ sırtı."]
    },
    {
      bi: 1,
      metin: "Türkiye'deki üç ana fay sisteminin bulunduğu bölgelerde jeotermal alanların geniş yer kaplaması hangisiyle açıklanır?",
      secenekler: [
        "Magmanın yer kabuğuna sokulduğu bölgelerde yer altı sularının ısınması",
        "Yağış miktarının bu bölgelerde çok yüksek olması",
        "Bu bölgelerde karstik arazilerin geniş yer tutması",
        "Akarsu debilerinin düşük olması"
      ],
      cozum: "Çarpışan levha sınırlarında magmanın yer kabuğuna sokulduğu bölgelerde yer altı suları ısınır ve jeotermal sıcak su kaynakları oluşur (s.53).",
      fc: ["Jeotermal kaynak nedir?", "Magmanın ısıttığı yer altı sularının yeryüzüne sıcak su olarak ulaşmasıdır."]
    }
  ]
});

/* ------------------------------------------------------- 3.2 */
yazKonu({
  konu_id: "cogr_10_u03_k02",
  ders: DERS, tema: 3, tema_adi: "Doğal Sistemler ve Süreçler",
  baslik: "3.2 İklim ve Kayaç Yapısının Aşınma ve Çözünme Süreçlerine Etkisi",
  kazanim: "İklim ve kayaç yapısının aşınma ve çözünme süreçlerine etkisini sorgular.",
  kaynak: kaynak("70-75"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Fiziksel ayrışma süreçlerini ve etkenlerini açıklar.",
    "İklim ve kayaç özelliklerinin kimyasal çözünme ve ayrışma hızına etkisini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "Kayaçların fiziksel ve kimyasal olarak ufalanması sürecine verilen ad hangisidir?",
      secenekler: [
        "Ayrışma",
        "Aşınma",
        "Taşınma",
        "Biriktirme"
      ],
      cozum: "Kayaçların fiziksel ve kimyasal olarak ufalanması sürecine ayrışma denir; bu süreç fiziksel ayrışma ve kimyasal çözünme ile gerçekleşir (s.70).",
      fc: ["Ayrışma nedir?", "Kayaçların fiziksel ve kimyasal olarak ufalanması sürecidir."]
    },
    {
      bi: 0,
      metin: "Kayaç bünyesine sızan suyun donarak hacmini artırmasıyla oluşan parçalanma hangi sürece örnektir?",
      secenekler: [
        "Fiziksel ayrışma",
        "Kimyasal çözünme",
        "Biyolojik ayrışma",
        "Orojenez"
      ],
      cozum: "Su donarken hacmi artar ve kayaçtaki çatlakları büyüterek fiziksel ayrışmaya (donma çatlaması) yol açar (s.70).",
      fc: ["Donma çatlaması nedir?", "Kayaç çatlaklarındaki suyun donup hacmini artırarak kayacı parçalamasıdır."]
    },
    {
      bi: 0,
      metin: "Kıyılarda tuzlu deniz sularının veya kurak bölgelerde tuzlu yer altı sularının kayaç gözeneklerine nüfuz etmesiyle oluşan ayrışma türü hangisidir?",
      secenekler: [
        "Tuz çatlatması",
        "Kavlama",
        "Karbonik asit çözünmesi",
        "Humus asidi etkisi"
      ],
      cozum: "Gözeneklerde biriken tuz kristalleri kayacı parçalar; bu olay tuz çatlatması olarak adlandırılan fiziksel ayrışmadır (s.70).",
      fc: ["Tuz çatlatması nedir?", "Gözeneklerde biriken tuz kristallerinin kayacı parçalamasıdır."]
    },
    {
      bi: 0,
      metin: "Üstündeki malzemenin aşınmasıyla kaya kütlesindeki yükün azalması, kayacın soğan kabuğu gibi plakalar hâlinde ayrılmasına yol açar. Bu olaya ne ad verilir?",
      secenekler: [
        "Kavlama",
        "Tuz çatlatması",
        "Karstlaşma",
        "Sedimantasyon"
      ],
      cozum: "Yük eksilmesi çatlaması sonucunda kayaç yüzeyinin plakalar hâlinde ayrılmasına kavlama denir (s.70).",
      fc: ["Kavlama nedir?", "Yük eksilmesiyle kayaç yüzeyinin soğan kabuğu gibi plakalar hâlinde ayrılması."]
    },
    {
      bi: 0,
      metin: "Bünyesinde kil bulunan kayaçlarda ıslanma ve kurumanın tekrarlanması hangi sonucu doğurur?",
      secenekler: [
        "Kil mineralleri genişleyip çatlakları büyüterek kayacı parçalar",
        "Kayaç tamamen çözünerek ortadan kalkar",
        "Kayaçta yeni mineraller oluşur",
        "Kayaç gözenekleri tuzla dolar"
      ],
      cozum: "Islanma-kuruma çatlamasında kil mineralleri ıslandığında genişleyerek çatlakları büyütür ve kayaç parçalanır (s.70).",
      fc: ["Islanma-kuruma çatlaması nedir?", "Killi kayaçlarda kilin genişleyip büzüşmesiyle oluşan fiziksel parçalanma."]
    },
    {
      bi: 1,
      metin: "Kimyasal çözünmenin gerçekleşmesini sağlayan en önemli etken hangisidir?",
      secenekler: [
        "Su",
        "Rüzgâr",
        "Yer çekimi",
        "Sıcaklık farkı"
      ],
      cozum: "Su, kimyasal çözünmeyi sağlayan en önemli etkendir; ortamdaki karbondioksit ve oksijen de süreci destekler (s.70).",
      fc: ["Kimyasal çözünmede suyun rolü nedir?", "Mineralleri çözerek yeni minerallerin oluşmasını sağlayan temel etkendir."]
    },
    {
      bi: 1,
      metin: "Yağmur sularına atmosferden ve topraktaki organik maddelerden karbondioksit katılması hangi sonucu doğurarak çözünmeyi hızlandırır?",
      secenekler: [
        "Suda karbonik asit oluşur ve kayaçları çözer",
        "Suyun donma noktası yükselir",
        "Kayaçların gözenekleri tuzla dolar",
        "Kayaç yüzeyi cilalanır"
      ],
      cozum: "Suda çözünen karbondioksit karbonik asit oluşturur; bu asit çeşitli kimyasal olaylara neden olarak kayaçların çözünmesini sağlar (s.70).",
      fc: ["Karbonik asit nedir?", "Karbondioksidin suda çözünmesiyle oluşan, kayaçları çözen zayıf asit."]
    },
    {
      bi: 1,
      metin: "Ayrışma süreçlerinin iklimle ilişkisi düşünüldüğünde hangi eşleştirme doğrudur?",
      secenekler: [
        "Sıcak ve nemli ortamda kimyasal çözünme hızlı, toprak kalın",
        "Sıcak ve nemli ortamda fiziksel ayrışma baskın, toprak ince",
        "Kurak ve soğuk ortamda kimyasal çözünme hızlı, toprak kalın",
        "Kurak ve soğuk ortamda ayrışma hiç gerçekleşmez"
      ],
      cozum: "Sıcak ve nemli ortamda kimyasal çözünme hızlanır, bitki örtüsü gürleşir ve toprak kalınlaşır; kurak-soğuk ortamda fiziksel ayrışma etkili, toprak incedir (s.72).",
      fc: ["İklim ile ayrışma türü arasındaki ilişki nedir?", "Nemli-sıcak iklimde kimyasal çözünme, kurak-soğuk iklimde fiziksel ayrışma baskındır."]
    },
    {
      bi: 1,
      metin: "Granit, gabro ve siyenit gibi iri kristalli derinlik kayaçlarının bulunduğu arazilerde hangi yer şekilleri görülür?",
      secenekler: [
        "Sivri tepeler, dik yamaçlar ve uçurumlar",
        "Geniş alüvyal ovalar",
        "Kumullar ve lös örtüleri",
        "Delta düzlükleri"
      ],
      cozum: "Bu kayaçlar ayrışmaya karşı dirençli olduğundan arazide sivri tepeler, dik yamaçlar, sırtlar ve uçurumlar görülür (s.72).",
      fc: ["Kayaç direnci ile yer şekli arasındaki ilişki nedir?", "Dirençli kayaçlar dik ve sivri şekiller, dirençsiz kayaçlar daha yuvarlak ve alçak şekiller oluşturur."]
    },
    {
      bi: 1,
      metin: "Magmatik ya da tortul kayaçların yüksek sıcaklık ve basınç altında fiziksel ve kimyasal değişime uğramasıyla hangi kayaç grubu oluşur?",
      secenekler: [
        "Başkalaşım kayaçları",
        "Tortul kayaçlar",
        "Volkanik kayaçlar",
        "Kimyasal tortul kayaçlar"
      ],
      cozum: "Levha hareketlerinin etkisiyle yüksek sıcaklık ve basınç altında değişime uğrayan kayaçlar başkalaşım kayaçlarını oluşturur (s.73).",
      fc: ["Kayaç döngüsü nedir?", "Kayaç türlerinin doğal yollarla birbirine ve magmaya dönüşmesiyle süren döngü."]
    }
  ]
});
