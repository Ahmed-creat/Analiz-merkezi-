#!/usr/bin/env node
/* ============================================================
   COĞRAFYA 10 · 6. ÜNİTE (AFETLER VE SÜRDÜRÜLEBİLİR ÇEVRE)
   ------------------------------------------------------------
   Kaynak: MEB Coğrafya 10 (2025) — cografya.json.
   Basılı sayfa = PDF sayfası − 1.

     6.1 Afetlerle Mücadelede İyi Uygulama Örnekleri   s.171-179
     6.2 Afetlere Karşı Dirençli Yaşam Alanları         s.180-184
     6.3 Afetlerden Korunma                             s.185-189
     6.4 Afet Bilinci                                   s.190-192

   Kullanım: node docs/uretim/uretim/cografya-t6.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Coğrafya";
const DOSYA = "cografya-10.pdf (MEB, 2025)";
const kaynak = s => "Coğrafya 10 ders kitabı, s." + s;

/* ------------------------------------------------------- 6.1 */
yazKonu({
  konu_id: "cogr_10_u06_k01",
  ders: DERS, tema: 6, tema_adi: "Afetler ve Sürdürülebilir Çevre",
  baslik: "6.1 Afetlerle Mücadelede İyi Uygulama Örnekleri",
  kazanim: "Afetlerle mücadelede iyi uygulama örneklerini sorgular.",
  kaynak: kaynak("171-179"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Afet türlerini ve bölgesel dağılışını açıklar.",
    "Afetlere yönelik iyi uygulama örneklerini ve tedbirleri çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "Deprem, tsunami ve kasırga gibi gerçekleşmesi önlenemeyen afetlerde hangi tür önlemler ön plana çıkar?",
      secenekler: [
        "Zararı en aza indirmeye yönelik önlemler",
        "Afetin oluşumunu tümüyle engelleyen önlemler",
        "Yalnızca afet sonrası yardım çalışmaları",
        "Afet bölgesinin boşaltılıp terk edilmesi"
      ],
      cozum: "Gerçekleşmesi önlenemeyecek afetlerde erken uyarı sistemleri, yıkımı azaltacak mimari tarz ve yer seçimi gibi zararı en aza indirmeye yönelik önlemler ön plandadır (s.171).",
      fc: ["Zarar azaltma nedir?", "Önlenemeyen afetlerde can ve mal kaybını en aza indirmeye yönelik çalışma."]
    },
    {
      bi: 0,
      metin: "Su baskını, heyelan, orman yangını ve kuraklık gibi afetlerde hangi önlemler ağırlık kazanır?",
      secenekler: [
        "Afetin gerçekleşmesini önlemeye yönelik önlemler",
        "Yalnızca sigorta uygulamaları",
        "Afet sonrası hasar tespiti",
        "Nüfusun bölgeye yerleştirilmesi"
      ],
      cozum: "Su baskını, heyelan, orman yangını, kuraklık ve salgında afetin gerçekleşmesini önlemeye yönelik tedbirler ön plandadır (s.171).",
      fc: ["Afeti önleme nedir?", "Dere ıslahı, istinat duvarı, yangın uyarı sistemi gibi oluşumu engelleyen tedbir."]
    },
    {
      bi: 0,
      metin: "Dünyada afetlerin bölgesel dağılışı dikkate alındığında Güneydoğu Asya'da hangi afetler öne çıkar?",
      secenekler: [
        "Deprem, tsunami ve volkanik püskürmeler",
        "Kuraklık ve çölleşme",
        "Kasırga ve hortum",
        "Çığ ve don olayları"
      ],
      cozum: "Güneydoğu Asya'da deprem, tsunami ve volkanik püskürmeler; Orta Amerika'da kasırgalar, Kuzey Afrika'da kuraklık daha çok görülür (s.171).",
      fc: ["Afetlerin bölgesel dağılışı nedir?", "Afet türlerinin coğrafi koşullara bağlı olarak bölgelere göre farklılaşması."]
    },
    {
      bi: 0,
      metin: "2023'te ABD'nin Oklahoma eyaletinde saatteki hızı 200-210 km'yi bulan kasırgada hangi tedbirlerle zarar azaltılmaya çalışılmaktadır?",
      secenekler: [
        "Erken uyarı, halkın tahliyesi ve yer altı sığınakları",
        "Akarsu yataklarının ıslahı",
        "Dik yamaçlara istinat duvarı yapılması",
        "Orman yangını uyarı sistemleri"
      ],
      cozum: "Kasırgalarda erken uyarı, halkın tahliye edilmesi ve yer altı sığınaklarının kullanılması zararları azaltmaya yönelik tedbirlerdir (s.172).",
      fc: ["Kasırgada zarar azaltma nedir?", "Erken uyarı, tahliye ve sığınaklarla can kaybının azaltılması."]
    },
    {
      bi: 0,
      metin: "2024'te Brezilya'nın Rio Grande do Sul eyaletinde yaşanan su baskınında 2 milyon 300 bin kişi etkilenmiştir. Bu afete karşı alınacak başlıca tedbir hangisidir?",
      secenekler: [
        "Akarsu yataklarının ve drenaj kanallarının önceden ıslah edilmesi",
        "Yer altı sığınaklarının inşa edilmesi",
        "Nükleer tesislerin taşınması",
        "Yamaçlara istinat duvarı yapılması"
      ],
      cozum: "Su baskınlarında akarsu yatakları ve drenaj kanallarının ıslahı, yataklara imarın yasaklanması, erken uyarı ve tahliye başlıca tedbirlerdir (s.172).",
      fc: ["Su baskınından korunma nedir?", "Akarsu yatağı ve drenaj ıslahı, imar yasağı, erken uyarı ve tahliye."]
    },
    {
      bi: 1,
      metin: "2022'de Brezilya'nın Petropolis kentinde şiddetli yağışların ardından yaşanan heyelanda 223 kişi hayatını kaybetmiştir. Bu afete karşı alınacak tedbir hangisidir?",
      secenekler: [
        "Dik yamaçlara sağlam istinat duvarları yapılması",
        "Kıyı yapılarının güçlendirilmesi",
        "Tsunami erken uyarı sisteminin kurulması",
        "Yer altı sığınaklarının açılması"
      ],
      cozum: "Heyelanda dik yamaçlara sağlam istinat duvarları yapılması ve risk altındaki yerleşmelerin güvenli alanlara taşınması temel tedbirlerdir (s.172).",
      fc: ["Heyelandan korunma nedir?", "İstinat duvarı yapımı ve riskli yerleşmelerin güvenli alana taşınması."]
    },
    {
      bi: 1,
      metin: "Japonya'da 2011'de magnitüdü 9,1 olan Töhoku depremi ve ardından oluşan tsunamide zararı azaltmaya yönelik hangi tedbir öne çıkar?",
      secenekler: [
        "Depreme dayanıklı mimari ve tsunami erken uyarı sisteminin kullanılması",
        "Yerleşmelerin kıyıya en yakın alanlara taşınması",
        "Orman alanlarının yerleşime açılması",
        "Dere yataklarının kapatılması"
      ],
      cozum: "Töhoku afetinde zararı azaltmaya yönelik tedbirler; deprem riski az ve zemini sağlam alanlara yerleşme, depreme dayanıklı mimari, tsunami erken uyarı sistemi ve halkın eğitilmesidir (s.173).",
      fc: ["Töhoku depremi nedir?", "2011'de Japonya açıklarında oluşan 9,1 büyüklüğündeki deprem ve ardından gelen tsunami."]
    },
    {
      bi: 1,
      metin: "Fukushima Daiichi Nükleer Santrali kazasına yönelik en önemli tedbir hangisidir?",
      secenekler: [
        "Nükleer tesislerin deprem riski düşük bölgelere kurulması",
        "Tesislerin kıyıya daha yakın inşa edilmesi",
        "Tsunami uyarı sistemlerinin kaldırılması",
        "Tesis çevresinde yerleşmenin yoğunlaştırılması"
      ],
      cozum: "Bu tür kazalara yönelik başlıca tedbirler; nükleer tesislerin deprem riski düşük bölgelere kurulması, tsunami erken uyarı sistemleri ve hızlı tahliyedir (s.173).",
      fc: ["Nükleer kaza riski nedir?", "Tesisin deprem riski düşük bölgeye kurulması, erken uyarı ve hızlı tahliye."]
    },
    {
      bi: 1,
      metin: "2021'de Muğla'da yaşanan orman yangınlarında yaklaşık 9 bin 52 hektar orman alanı zarar görmüştür. Orman yangınlarını önlemeye yönelik tedbir hangisidir?",
      secenekler: [
        "Yangın uyarı sistemleri kurulması ve hızlı müdahale ekipleri oluşturulması",
        "Yangın riski oluşturan faaliyetlerin serbest bırakılması",
        "Orman alanlarının imara açılması",
        "Yamaçlarda istinat duvarı yapılması"
      ],
      cozum: "Orman yangınlarını önlemeye yönelik başlıca tedbirler; yangın uyarı sistemleri kurulması, hızlı müdahale ekipleri oluşturulması ve yangın riski oluşturan faaliyetlerin yasaklanmasıdır (s.173).",
      fc: ["Orman yangını önlemi nedir?", "Uyarı sistemi, hızlı müdahale ekibi ve riskli faaliyet yasağı."]
    },
    {
      bi: 1,
      metin: "Gaziantep Büyükşehir Belediyesinin geliştirdiği risk haritası uygulamasının özgün değeri hangisidir?",
      secenekler: [
        "Tüm olayların mahalle bazında işlendiği CBS tabanlı sistemin Türkiye'de ilk kez uygulanması",
        "Yalnızca deprem riskini gösteren kâğıt haritalar hazırlanması",
        "Afet sonrası yardımların dağıtılmasının planlanması",
        "Yalnızca orman yangınları için kullanılması"
      ],
      cozum: "Gaziantep'te tüm olaylar ilçe ve mahalle bazlı olarak haritaya işlenmekte; sistem Türkiye'de ilk kez uygulanmakta ve 30.000'e yakın olayın girişi yapılmıştır (s.175).",
      fc: ["Afet risk haritası nedir?", "Olayların mahalle bazında işlendiği, önleyici tedbire temel olan harita."]
    }
  ]
});

/* ------------------------------------------------------- 6.2 */
yazKonu({
  konu_id: "cogr_10_u06_k02",
  ders: DERS, tema: 6, tema_adi: "Afetler ve Sürdürülebilir Çevre",
  baslik: "6.2 Afetlere Karşı Dirençli Yaşam Alanları",
  kazanim: "Afete dirençli yaşam alanlarının coğrafi koşullarını çözümler.",
  kaynak: kaynak("180-184"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Direnç ve dirençli şehir kavramlarını açıklar.",
    "Afete dirençli yaşam alanı ölçütlerini tsunami örnekleri üzerinden çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "İnsanların ve kentlerin işlevlerini gereği gibi yerine getirebilmeleri için gereksinim duydukları alana ne ad verilir?",
      secenekler: [
        "Yaşam alanı",
        "Yerleşme tipi",
        "Fonksiyon",
        "Mekânsal veri"
      ],
      cozum: "İnsanların ve kentlerin yaşamlarını sürdürebilmeleri ve işlevlerini yerine getirebilmeleri için gereksinim duydukları alana yaşam alanı denir (s.180).",
      fc: ["Yaşam alanı nedir?", "İnsanların ve kentlerin işlevlerini sürdürebilmek için gereksinim duyduğu alan."]
    },
    {
      bi: 0,
      metin: "Şehirlerin çevresel risklerle mücadele edebilme kapasitesine ne ad verilir?",
      secenekler: [
        "Direnç",
        "Risk",
        "Tehlike",
        "Kırılganlık"
      ],
      cozum: "Direnç, şehirlerin çevresel risklerle mücadele edebilme kapasitesidir; dirençli şehirler olası afetlere karşı hazır olan şehirlerdir (s.180).",
      fc: ["Kentsel direnç nedir?", "Şehrin riskler karşısında işlevini sürdürme ve toparlanma kapasitesi."]
    },
    {
      bi: 0,
      metin: "Ekonomik Kalkınma ve İşbirliği Örgütünün (OECD) dirençli şehir çalışmalarında pilot olarak seçtiği iller arasında hangisi yer alır?",
      secenekler: [
        "Antalya ve Bursa",
        "Adana ve Mersin",
        "Trabzon ve Rize",
        "Konya ve Kayseri"
      ],
      cozum: "OECD'nin dirençlilik pilot illeri arasında Lizbon, Kyoto, Kobe, Antalya, Bursa, Tampere ve Oslo bulunur (s.180).",
      fc: ["Dirençli Şehirler Raporu nedir?", "OECD'nin pilot şehir çalışmaları sonucu 2016'da hazırladığı rapor."]
    },
    {
      bi: 0,
      metin: "Bir yapının şok ve stres karşısında işlevini sürdürme gücü hangi kavramla adlandırılır?",
      secenekler: [
        "Sağlamlık",
        "Esneklik",
        "Yedeklilik",
        "Kapsayıcılık"
      ],
      cozum: "Sağlamlık, bir yapının şok ve stres karşısında işlevini sürdürme gücü olarak tanımlanır (s.180).",
      fc: ["Sağlamlık nedir?", "Yapının şok ve stres altında işlevini sürdürme gücü."]
    },
    {
      bi: 0,
      metin: "Öngörülemeyen yıkıcı bir olay karşısında acil durum kaynağının devreye alınması hangi direnç özelliğidir?",
      secenekler: [
        "Yedeklilik",
        "Sağlamlık",
        "Uyum sağlama",
        "Esneklik"
      ],
      cozum: "Yedeklilik, öngörülemeyen yıkıcı bir afet karşısında boşta tutulan kapasitenin hizmet sağlayıcı olarak devreye alınmasıdır (s.180).",
      fc: ["Yedeklilik nedir?", "Afet anında devreye alınan alternatif kapasite ve kaynak."]
    },
    {
      bi: 1,
      metin: "Türkiye'de tsunami konusunda ulusal uyarı merkezi olarak tanımlanan kurum hangisidir?",
      secenekler: [
        "Kandilli Rasathanesi ve Deprem Araştırma Enstitüsü",
        "Meteoroloji Genel Müdürlüğü ve AFAD",
        "Türkiye İstatistik Kurumu ve TÜBİTAK",
        "Tapu ve Kadastro Genel Müdürlüğü"
      ],
      cozum: "KRDAE, 2006 yılında UNESCO Hükûmetlerarası Oşinografi Komisyonu'nun alt organı tarafından Ulusal Tsunami Uyarı Merkezi olarak tanımlanmıştır (s.182).",
      fc: ["Ulusal Tsunami Uyarı Merkezi nedir?", "Tsunamiyi izleyip uyarı üreten, KRDAE bünyesindeki merkez."]
    },
    {
      bi: 1,
      metin: "Türkiye'de tsunami baskın haritalarının entegre edildiği web tabanlı sistem hangisidir?",
      secenekler: [
        "Afet Risk Azaltma Sistemi (ARAS)",
        "Türkiye Afet Müdahale Planı (TAMP)",
        "Ulusal Sulak Alan Komitesi",
        "Afet Yönetim ve Karar Destek Sistemi (AYDES)"
      ],
      cozum: "Türkiye'de belirlenmiş tsunami tahmin noktaları için oluşturulan baskın haritaları web tabanlı Afet Risk Azaltma Sistemi'ne (ARAS) entegre edilmiştir (s.182).",
      fc: ["Tsunami baskın haritası nedir?", "Tsunaminin hangi alanı ne yükseklikte etkileyeceğini gösteren harita."]
    },
    {
      bi: 1,
      metin: "Japonya'da 2011 tsunamisinden sonra erken uyarı sistemi hangi düzeye getirilmiştir?",
      secenekler: [
        "10 dakikadan az zamanda gerçek zamanlı uyarı verebilen düzeye",
        "Bir saat içinde uyarı verebilen düzeye",
        "Yalnızca günlük rapor verebilen düzeye",
        "Uyarı veremeyen düzeye"
      ],
      cozum: "Sayısal modelleme çalışmalarıyla tsunami erken uyarı sistemi 10 dakikadan az zamanda gerçek zamanlı uyarı verebilir hâle getirilmiştir (s.183).",
      fc: ["Erken uyarı süresi nedir?", "Tsunaminin kıyıya ulaşmasından önce kalan uyarı zamanı."]
    },
    {
      bi: 1,
      metin: "Japonya'da afet bilincini canlı tutmak için hasarlı binaların yıkılmayıp yerinde bırakılması ve müzeler kurulması hangi amaca yöneliktir?",
      secenekler: [
        "Toplumsal farkındalık oluşturup geçmiş afetlerin unutulmamasını sağlamak",
        "Turizm gelirlerini artırmak",
        "Yeni yerleşim alanları kazanmak",
        "Deprem riskini tamamen ortadan kaldırmak"
      ],
      cozum: "Bu uygulamalar, insanların geçmiş afetleri unutmamasını, afetlerle yaşamayı öğrenmesini ve gelecek nesillere afetin boyutunun aktarılmasını amaçlar (s.183).",
      fc: ["Afet farkındalığı nedir?", "Geçmiş afetlerin unutulmaması için yürütülen bilinçlendirme çalışmaları."]
    },
    {
      bi: 1,
      metin: "Türkiye ve Japonya'nın coğrafi özellikleri karşılaştırıldığında iki ülke için de geçerli olan özellik hangisidir?",
      secenekler: [
        "Orta kuşakta bulunmaları ve genç jeolojik yapıya sahip olmaları",
        "Ada ülkesi olmaları ve okyanusa kıyılarının bulunması",
        "Okyanusa kıyısı olmaları ve muson ikliminin görülmesi",
        "Muson iklimi görülmesi ve ada ülkesi olmaları"
      ],
      cozum: "Türkiye ve Japonya orta kuşakta yer alır, denize kıyısı vardır ve jeolojik açıdan genç yapılıdır; ada ve okyanus kıyısı olma özelliği Japonya'ya aittir (s.181).",
      fc: ["Ortak konum özelliği nedir?", "Orta kuşakta bulunma ve genç jeolojik yapıya sahip olma."]
    }
  ]
});

/* ------------------------------------------------------- 6.3 */
yazKonu({
  konu_id: "cogr_10_u06_k03",
  ders: DERS, tema: 6, tema_adi: "Afetler ve Sürdürülebilir Çevre",
  baslik: "6.3 Afetlerden Korunma",
  kazanim: "Mekânın özelliklerine göre afetlerden korunma uygulamalarına karar verir.",
  kaynak: kaynak("185-189"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Afet yönetiminin aşamalarını ve risk azaltma adımlarını açıklar.",
    "Fiziksel-yapısal ve yapısal olmayan korunma önlemlerini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "Afet yönetimi çalışmalarının en önemli kısmı hangi döneme yönelik çalışmalardır?",
      secenekler: [
        "Afet öncesi risk ve zarar azaltma",
        "Afet sonrası iyileştirme",
        "Afet esnasında müdahale",
        "Afet sonrası hasar tespiti"
      ],
      cozum: "Afet yönetimi çalışmalarının en önemli kısmı afet öncesi risk ve zarar azaltmaya yönelik çalışmalardır (s.185).",
      fc: ["Afet öncesi risk azaltma nedir?", "Tehlikeyi ve zararı önceden azaltmaya yönelik planlı çalışmalar."]
    },
    {
      bi: 0,
      metin: "Bir bölgede potansiyel tehlike ve risklerin belirlenmesinde aşağıdakilerden hangisi belirleyici değildir?",
      secenekler: [
        "Bölgedeki okuryazar oranı",
        "Bölgenin jeolojik yapısı",
        "Yerleşmelerin konumu ve imar planı",
        "Binaların yapısal özellikleri"
      ],
      cozum: "Afet risk durumu; coğrafi konum, yer şekilleri, jeolojik yapı, iklim, bitki örtüsü, yerleşme konumu, imar planı ve binaların yapısına göre belirlenir (s.185).",
      fc: ["Tehlike ve risk belirleme nedir?", "Bölgenin doğal ve beşerî özelliklerine bakarak olası afet riskini saptama."]
    },
    {
      bi: 0,
      metin: "Japonya'daki J-Alert Ulusal Erken Uyarı Sistemi ile Hindistan'daki Su Baskını Erken Uyarı Sistemi (FLEWS) hangi amaçla kurulmuştur?",
      secenekler: [
        "Afeti önceden tespit edip kurumları ve vatandaşları hızla haberdar etmek",
        "Afet sonrası hasar tespiti yapmak",
        "Binaların yapısal güçlendirmesini yapmak",
        "Yerleşmeleri başka bölgelere taşımak"
      ],
      cozum: "Erken uyarı sistemleri, afeti önceden tespit edip bölgedeki kurum, kuruluş ve vatandaşları en kısa sürede haberdar ederek zararı azaltmayı amaçlar (s.185).",
      fc: ["Erken uyarı sistemi nedir?", "Afeti önceden saptayıp ilgilileri hızla uyaran sistem."]
    },
    {
      bi: 0,
      metin: "Pasifik Erken Uyarı Sistemi hangi afetlere karşı kurulmuştur?",
      secenekler: [
        "Tsunami ve büyük depremler",
        "Kuraklık ve çölleşme",
        "Orman yangınları",
        "Salgın hastalıklar"
      ],
      cozum: "Büyük Okyanus kıyısındaki 26 ülke tsunami ve büyük depremler için Okyanus Tabanı Sismik Uyarı Sistemi ile Pasifik Erken Uyarı Sistemini kurmuştur (s.185).",
      fc: ["Uluslararası erken uyarı iş birliği nedir?", "Birden çok ülkenin ortak sistemle afet uyarısı üretmesi."]
    },
    {
      bi: 0,
      metin: "Su baskını riski olan yerleşmelerde alınacak fiziksel zarar azaltma önlemi hangisidir?",
      secenekler: [
        "Yatakta bina yapımının önlenmesi ve drenaj altyapısı",
        "Yamaçlara sağlam istinat duvarları yapılması",
        "Mevcut binaların güçlendirilmesi ve dönüşümü",
        "Büyük eşyaların duvarlara sabitlenmesi"
      ],
      cozum: "Su baskını riski olan yerleşmelerde akarsu yataklarında bina yapımını önleme, su drenajına yönelik altyapı ve yatak ıslahı önlemleri alınır (s.186).",
      fc: ["Fiziksel zarar azaltma nedir?", "Yapı ve altyapı düzenlemeleriyle afet zararını azaltma."]
    },
    {
      bi: 1,
      metin: "Deprem riski altındaki yerleşmelerde zemini sağlam alanların imara açılması neden önemlidir?",
      secenekler: [
        "Sağlam zemin deprem dalgalarının etkisini ve yıkılma ihtimalini azaltır",
        "Sağlam zemin yapı maliyetini sıfırlar",
        "Sağlam zeminde deprem hiç oluşmaz",
        "Sağlam zemin yağış miktarını artırır"
      ],
      cozum: "Zemini sağlam alanlar deprem dalgalarının etkisini ve binaların yıkılma ihtimalini azaltır; bu nedenle bu alanların imara açılması sağlanır (s.186).",
      fc: ["Zemin sağlamlığı nedir?", "Deprem dalgasını daha az ileten, yapıyı ayakta tutan yer özelliği."]
    },
    {
      bi: 1,
      metin: "Deprem riski altında olup başka bölgeye taşınamayan yerleşmelerde hangi yapısal çalışma yapılır?",
      secenekler: [
        "Mevcut binaların güçlendirilmesi ve kentsel dönüşüm uygulanması",
        "Binaların yıkılıp yerine ahşap baraka yapılması",
        "Akarsu yataklarının ıslah edilmesi",
        "Yamaçlara istinat duvarı yapılması"
      ],
      cozum: "Taşınamayan yerleşmelerde yeni binaların depreme dayanıklı yapılması, dayanıksızların güçlendirilmesi ve kentsel dönüşüm uygulanması yoluna gidilir (s.186).",
      fc: ["Kentsel dönüşüm nedir?", "Riskli yapıların yıkılıp depreme dayanıklı yapılar yapılması."]
    },
    {
      bi: 1,
      metin: "Binaların içindeki büyük, yüksek, ağır ve tekerlekli eşyaların depremde oluşturduğu tehlikeye ne ad verilir?",
      secenekler: [
        "Yapısal olmayan risk",
        "Yapısal risk",
        "Zemin riski",
        "İkincil tehlike"
      ],
      cozum: "Yer değiştirme eğilimi olan eşya ve raf malzemelerinden kaynaklanan tehlike ve risklere yapısal olmayan riskler denir (s.187).",
      fc: ["Yapısal olmayan risk nedir?", "Eşya ve donatı kaynaklı, depremde devrilme ve düşmeyle zarar veren tehlike."]
    },
    {
      bi: 1,
      metin: "Yapısal olmayan riskleri azaltmak için alınabilecek basit tedbir hangisidir?",
      secenekler: [
        "Büyük eşyaların duvarlara sağlam şekilde sabitlenmesi",
        "Yatakların pencerelerin önüne konulması",
        "Raflarda ağır ve sert cisimlerin bulundurulması",
        "Eşyaların oda ortasına serbestçe yerleştirilmesi"
      ],
      cozum: "Büyük eşyaların duvarlara sabitlenmesi, raflarda ağır cisim bulundurulmaması ve yatakların pencere önüne konulmaması yapısal olmayan riskleri azaltır (s.187).",
      fc: ["Eşya sabitleme nedir?", "Devrilme riski olan eşyanın duvara bağlanarak zararının önlenmesi."]
    },
    {
      bi: 1,
      metin: "Bir bölgede afetlerden korunma uygulamalarındaki temel belirleyici etken hangisidir?",
      secenekler: [
        "Mekânın coğrafi özellikleri",
        "Ülkenin para birimi",
        "Nüfusun yaş ortalaması",
        "Yerleşmenin adı"
      ],
      cozum: "Afetlerden korunma uygulamalarındaki temel belirleyici etken mekânın özellikleridir; coğrafi özellikler, mimari durum ve bina yapısı bunlar arasındadır (s.187).",
      fc: ["Mekâna göre önlem nedir?", "Yerel coğrafi koşullara uygun korunma yönteminin seçilmesi."]
    }
  ]
});

/* ------------------------------------------------------- 6.4 */
yazKonu({
  konu_id: "cogr_10_u06_k04",
  ders: DERS, tema: 6, tema_adi: "Afetler ve Sürdürülebilir Çevre",
  baslik: "6.4 Afet Bilinci",
  kazanim: "Afetlerden korunma amacı ile afet bilinci oluşturmanın faydalarını yansıtır.",
  kaynak: kaynak("190-192"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Afet bilincinin kapsamını ve bileşenlerini açıklar.",
    "Afet bilinci ile afete hazırlık arasındaki ilişkiyi çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "Bireylerin ve toplumun afet risklerini en aza indirmeye yönelik bilişsel, duyuşsal ve psikomotor bilgi ve becerilere ilişkin farkındalık düzeyine ne ad verilir?",
      secenekler: [
        "Afet bilinci",
        "Afet riski",
        "Afet yönetimi",
        "Direnç"
      ],
      cozum: "Afet bilinci, birey ve toplumun afet risklerini azaltmaya yönelik bilişsel, duyuşsal ve psikomotor bilgi ve becerilere ilişkin farkındalık düzeyidir (s.190).",
      fc: ["Afet bilinci nedir?", "Afet risklerini azaltmaya yönelik bilgi ve becerilerdeki farkındalık düzeyi."]
    },
    {
      bi: 0,
      metin: "Afet bilinci hangi kültürün bir parçası olarak tanımlanmaktadır?",
      secenekler: [
        "Güvenli yaşam kültürünün",
        "Tüketim kültürünün",
        "Göçebe yaşam kültürünün",
        "Tarım kültürünün"
      ],
      cozum: "Afet bilinci; afet öncesi, esnası ve sonrasındaki süreçleri kapsadığı için güvenli yaşam kültürünün bir parçasıdır (s.190).",
      fc: ["Güvenli yaşam kültürü nedir?", "Riskleri gözeterek karar vermeyi alışkanlığa dönüştüren yaşam biçimi."]
    },
    {
      bi: 0,
      metin: "Birleşmiş Milletler Afetlerin Azaltılması Uluslararası Stratejisi'ne (UNISDR) göre afetlere hazırlık kavramı neyi ifade eder?",
      secenekler: [
        "Tehlikeli olayların sonuçlarıyla baş etme bilgi ve kapasitesini",
        "Yalnızca afet sonrası yardım dağıtımını ve tazminatı",
        "Yalnızca binaların yıkılıp yeniden yapılmasını",
        "Afet bölgesinin tümüyle terk edilmesini"
      ],
      cozum: "UNISDR afetlere hazırlığı; hükümetler, kuruluşlar, topluluklar ve bireylerin tehlikeli olayların sonuçlarını tahmin etme, müdahale etme ve kurtulma kapasitesi olarak tanımlar (s.190).",
      fc: ["Afetlere hazırlık nedir?", "Tehlikeli olayların sonuçlarıyla baş etmek için geliştirilen bilgi ve kapasite."]
    },
    {
      bi: 0,
      metin: "Afet hazırlığı sürecinde yer alan unsurlar arasında hangisi bulunur?",
      secenekler: [
        "Afet risklerinin analizi ve erken uyarı sistemlerinin geliştirilmesi",
        "Yalnızca afet sonrası tazminat ödemeleri",
        "Yalnızca yeni yerleşim alanlarının açılması",
        "Yalnızca turizm yatırımları"
      ],
      cozum: "Afet hazırlığında risk analizi, erken uyarı sistemleri, acil durum planlaması, malzeme stoklanması, koordinasyon, tahliye, bilgilendirme, eğitim ve tatbikat yer alır (s.190).",
      fc: ["Afet hazırlığı unsurları nedir?", "Risk analizi, erken uyarı, acil durum planı, stok, eğitim ve tatbikat."]
    },
    {
      bi: 0,
      metin: "Afet bilinci kazanmış bir toplumun afet esnasındaki davranışı hangisidir?",
      secenekler: [
        "Hayat kurtarma ve dayanışma süreçlerinde koordineli hareket etmesi",
        "Bilgi kaynaklarını kapatması",
        "Yardım çağrılarını görmezden gelmesi",
        "Afet bölgesine plansız şekilde akın etmesi"
      ],
      cozum: "Afet bilinci kazanmış toplum; hayat kurtarma, dayanışma, maddi kayıpların azaltılması ve iletişim ağının güçlendirilmesi gibi süreçlerde daha koordine hareket eder (s.190).",
      fc: ["Dayanışma kültürü nedir?", "Afet anında karşılıklı yardıma dayanan toplumsal davranış."]
    },
    {
      bi: 1,
      metin: "Afet bilincinin oluşum sürecinin önemli adımları arasında hangisi yer alır?",
      secenekler: [
        "Afet eğitimi, acil durum planları ve afet çantası hazırlama",
        "Yalnızca afet sonrası hasar tespiti",
        "Yalnızca kentsel dönüşüm projeleri",
        "Yalnızca sigorta poliçesi düzenlenmesi"
      ],
      cozum: "Afet eğitimi, farkındalık kazandırma, acil durum planları, iletişim stratejileri, afet çantası hazırlama ve toplumsal katılım afet bilincinin oluşum adımlarıdır (s.190).",
      fc: ["Afet eğitimi nedir?", "Afet öncesi, anı ve sonrasına ilişkin bilgi ve davranış kazandırma süreci."]
    },
    {
      bi: 1,
      metin: "Afet bilinci ile afete hazırlık arasındaki ilişki hangisiyle açıklanır?",
      secenekler: [
        "Hazırlık uygulamaları doğru biçimde birleştirildiğinde toplumda afet bilinci kazanılır",
        "Afet bilinci hazırlık çalışmalarını gereksiz kılar",
        "Hazırlık yalnızca kurumların işidir, bilinci etkilemez",
        "Afet bilinci yalnızca afet sonrasında oluşur"
      ],
      cozum: "Afete hazırlık doğru uygulamalarla birleştirildiğinde toplumlarda afet bilincinin kazanılması sağlanır; iki kavram birbirini besler (s.190).",
      fc: ["Hazırlık ve bilinç ilişkisi nedir?", "Hazırlık uygulamaları bilinci, bilinç de hazırlığın sürdürülmesini besler."]
    },
    {
      bi: 1,
      metin: "Afet bilincinin toplumsal faydası hangisidir?",
      secenekler: [
        "Afet anında can kaybının azalması ve maddi kayıpların düşmesi",
        "Afet sayısının tamamen sıfırlanması",
        "Yerleşmelerin kırsala taşınması",
        "Afet riskinin ortadan kalkması"
      ],
      cozum: "Afet bilinci; hayat kurtarma, dayanışmanın sağlanması ve maddi kayıpların azaltılması gibi süreçlerde koordinasyon sağlayarak zararı azaltır (s.190).",
      fc: ["Afet bilinci ile zarar arasındaki ilişki nedir?", "Bilinç düzeyi arttıkça can ve mal kaybı azalır."]
    },
    {
      bi: 1,
      metin: "Okulda afet bilinci ve dirençli yaşam alanı oluşturmak için yürütülen sosyal farkındalık çalışmasının adımları arasında hangisi yer alır?",
      secenekler: [
        "Öğrenci topluluğu kurup seminer ve afet/acil durum eylem planı hazırlamak",
        "Yalnızca afet sonrası yardım toplamak",
        "Yalnızca ders kitaplarını değiştirmek",
        "Afet bölgesine gezi düzenlemek"
      ],
      cozum: "Çalışma; öğrenci topluluğu kurma, amaç belirleme, görev dağılımı yapma, seminer planlama ve afet/acil durum eylem planı hazırlama adımlarını içerir (s.191).",
      fc: ["Afet eylem planı nedir?", "Afet öncesi, anı ve sonrasında yapılacakları sıralayan plan."]
    },
    {
      bi: 1,
      metin: "Afet bilincine sahip bireylerin afetlerle mücadeledeki yeri hangisiyle ifade edilir?",
      secenekler: [
        "Afetlerden korunmanın ve zararların azaltılmasının en önemli unsuru olmaları",
        "Yalnızca kurtarma ekiplerini beklemesi",
        "Afet riskini artıran davranışlar sergilemesi",
        "Yalnızca kurumların kararlarını izlemesi"
      ],
      cozum: "Afet bilincine sahip bireyler, afetlerden korunmanın ve afetlerden gelebilecek zararların azaltılmasının en önemli unsurudur (s.190).",
      fc: ["Bireyin afetteki rolü nedir?", "Bilinçli davranışla kendi ve çevresinin güvenliğini sağlaması."]
    }
  ]
});
