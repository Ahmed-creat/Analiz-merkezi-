#!/usr/bin/env node
/* ============================================================
   COĞRAFYA 10 · 5. ÜNİTE (EKONOMİK FAALİYETLER VE ETKİLERİ)
   ------------------------------------------------------------
   Kaynak: MEB Coğrafya 10 (2025) — cografya.json.
   Basılı sayfa = PDF sayfası − 1.

     5.1 Ekonomik Faaliyetlerin Özellikleri              s.145-152
     5.2 Ekonomik Sektörler ve Gelişmişlik               s.153-156
     5.3 Türkiye Ekonomisinin Sektörel Dağılımı          s.157-159

   Kullanım: node docs/uretim/uretim/cografya-t5.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Coğrafya";
const DOSYA = "cografya-10.pdf (MEB, 2025)";
const kaynak = s => "Coğrafya 10 ders kitabı, s." + s;

/* ------------------------------------------------------- 5.1 */
yazKonu({
  konu_id: "cogr_10_u05_k01",
  ders: DERS, tema: 5, tema_adi: "Ekonomik Faaliyetler ve Etkileri",
  baslik: "5.1 Ekonomik Faaliyetlerin Özellikleri",
  kazanim: "Ekonomik faaliyetleri üretim özellikleri ölçütüne göre sınıflandırır.",
  kaynak: kaynak("145-152"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Ekonomik faaliyetleri sektörlerine göre sınıflandırır.",
    "Sektörlerin kapsamını ve dönüşümünü örneklerle açıklar."
  ],
  items: [
    {
      bi: 0,
      metin: "Doğrudan veya dolaylı olarak doğal ortamdan temin edilen temel maddelerin üretimini yapan sektör hangisidir?",
      secenekler: [
        "Birincil sektör",
        "İkincil sektör",
        "Üçüncül sektör",
        "Beşincil sektör"
      ],
      cozum: "Birincil sektördeki faaliyet kolları, doğal ortamdan temin edilen temel maddelerin (bitki, balık, maden) üretimini yapar (s.146).",
      fc: ["Birincil sektör nedir?", "Doğadan elde edilen temel maddelerin üretimini yapan sektör."]
    },
    {
      bi: 0,
      metin: "Aşağıdakilerden hangisi birincil sektörde yer alan ekonomik faaliyetlerdendir?",
      secenekler: [
        "Ormancılık",
        "İnşaat",
        "Finans",
        "Yazılım hizmetleri"
      ],
      cozum: "Birincil sektörde hayvancılık, tarım, balıkçılık, ormancılık ve madencilik yer alır (s.146).",
      fc: ["Birincil faaliyetler nedir?", "Hayvancılık, tarım, balıkçılık, ormancılık ve madencilik."]
    },
    {
      bi: 0,
      metin: "Birincil faaliyetlerle elde edilen ham maddenin işlenerek insanların kullanabileceği hâle dönüştürüldüğü sektör hangisidir?",
      secenekler: [
        "İkincil sektör",
        "Birincil sektör",
        "Dördüncül sektör",
        "Üçüncül sektör"
      ],
      cozum: "İkincil sektör, ham madde ya da yarı işlenmiş maddelerin işlenip kullanılabilir şekle dönüştürüldüğü faaliyetleri kapsar (s.147).",
      fc: ["İkincil sektör nedir?", "Ham maddenin işlenip kullanılabilir ürüne dönüştürüldüğü sektör."]
    },
    {
      bi: 0,
      metin: "İkincil sektörde yer alan başlıca ekonomik faaliyetler hangileridir?",
      secenekler: [
        "Sanayi, enerji üretimi ve inşaat",
        "Tarım, balıkçılık ve madencilik",
        "Ticaret, finans ve turizm",
        "Pazarlama, yazılım ve AR-GE"
      ],
      cozum: "İkincil sektörde sanayi (endüstri), enerji üretimi ve inşaat yer alır (s.147).",
      fc: ["Ham maddenin işlenmesi nedir?", "Girdinin fabrikada ürüne dönüştürülmesiyle değer kazanması."]
    },
    {
      bi: 0,
      metin: "Pamuğun ipliğe, ipliğin kumaşa, kumaşın konfeksiyon ürününe dönüştürülmesi hangi faaliyete örnektir?",
      secenekler: [
        "Sanayi",
        "Madencilik",
        "Ticaret",
        "Finans"
      ],
      cozum: "Ham maddenin aşamalı işlenerek ürüne dönüştürülmesi sanayi faaliyetidir; pamuktan konfeksiyona giden süreç bunun örneğidir (s.147).",
      fc: ["Sanayi nedir?", "Ham maddenin insan kullanımına elverişli ürüne dönüştürülmesi."]
    },
    {
      bi: 0,
      metin: "Akarsulardan hidroelektrik, sıcak su kaynaklarından jeotermal, uranyum ve toryumdan nükleer enerji elde edilmesi hangi faaliyet kolundadır?",
      secenekler: [
        "Enerji üretimi",
        "Madencilik",
        "İnşaat",
        "Ticaret"
      ],
      cozum: "Enerji üretimi; doğada bulunan kaynakların hidroelektrik, jeotermal, termik ve nükleer enerjiye dönüştürülmesini kapsar (s.147).",
      fc: ["Enerji üretimi nedir?", "Doğal kaynakların elektrik ve ısı enerjisine dönüştürülmesi."]
    },
    {
      bi: 1,
      metin: "Ticaret, eğitim, sağlık, finans, ulaşım, iletişim ve turizm gibi hizmetleri kapsayan sektör hangisidir?",
      secenekler: [
        "Üçüncül sektör",
        "Birincil sektör",
        "İkincil sektör",
        "Beşincil sektör"
      ],
      cozum: "Üçüncül sektör; ticaret, eğitim, sağlık, güvenlik, hukuk, finans, ulaşım, iletişim ve turizm hizmetlerini kapsar (s.148).",
      fc: ["Üçüncül sektör nedir?", "Hizmet üretimine dayanan; ticaret, eğitim, sağlık, finans ve turizmi kapsayan sektör."]
    },
    {
      bi: 1,
      metin: "Bilgi ve enformasyon işleme faaliyetlerini kapsayan, yazılım hizmetleri ile Coğrafi Bilgi Sistemlerinin (CBS) yer aldığı sektör hangisidir?",
      secenekler: [
        "Dördüncül sektör",
        "İkincil sektör",
        "Birincil sektör",
        "Üçüncül sektör"
      ],
      cozum: "Dördüncül sektör; bilgi ve veri işleme, yazılım, AR-GE danışmanlığı ve CBS gibi üretici odaklı hizmetleri kapsar (s.150).",
      fc: ["Dördüncül sektör nedir?", "Bilgi ve enformasyon işlemeye dayalı üretici hizmetleri."]
    },
    {
      bi: 1,
      metin: "Beşincil sektörün en önemli özelliği hangisidir?",
      secenekler: [
        "Geleceğe yönelik karar alıp topluma yön vermesi",
        "Doğadan ham madde üretmesi ve depolaması",
        "Ham maddeyi atölyelerde işleyip ürüne dönüştürmesi",
        "Yalnızca mevsimlik iş gücüne dayanması"
      ],
      cozum: "Beşincil sektörün en önemli özelliği geleceğe yönelik kararlar alması ve toplumun gelişimine yön vermesidir (s.150).",
      fc: ["Beşincil sektör nedir?", "Üst düzey karar verme ve yönlendirme faaliyetlerini kapsayan sektör."]
    },
    {
      bi: 1,
      metin: "Ekonomik faaliyetlerin sektörlere göre ilk sınıflandırılmasında üçüncül faaliyet olarak hangisi belirlenmiştir?",
      secenekler: [
        "Hizmet sektörü",
        "Tarım sektörü",
        "Sanayi sektörü",
        "Madencilik sektörü"
      ],
      cozum: "1940'lı yıllarda yapılan ilk sınıflandırmada birincil faaliyet tarım, ikincil faaliyet sanayi, üçüncül faaliyet hizmet sektörü olarak belirlenmiştir (s.145).",
      fc: ["Sektör sınıflandırması nedir?", "Ekonomik faaliyetlerin üretim özelliklerine göre sektörlere ayrılması."]
    },
    {
      bi: 1,
      metin: "Dünyada son 30 yılda yaşanan yapısal dönüşüm hangi yönde gerçekleşmiştir?",
      secenekler: [
        "Sanayiden hizmet sektörüne doğru",
        "Hizmetten tarıma doğru",
        "Tarımdan madenciliğe doğru",
        "Hizmetten sanayiye doğru"
      ],
      cozum: "Özellikle son 30 yılda sanayiden hizmet sektörüne doğru yapısal bir dönüşüm yaşanmış, hizmet alt kolları çoğalmıştır (s.145).",
      fc: ["Yapısal dönüşüm nedir?", "Ekonominin ağırlığının bir sektörden diğerine kayması."]
    }
  ]
});

/* ------------------------------------------------------- 5.2 */
yazKonu({
  konu_id: "cogr_10_u05_k02",
  ders: DERS, tema: 5, tema_adi: "Ekonomik Faaliyetler ve Etkileri",
  baslik: "5.2 Ekonomik Sektörler ve Gelişmişlik",
  kazanim: "Ekonomik sektörlerin dağılımını gösteren veriler üzerinden farklı gelişmişlik seviyesine sahip ülkeleri karşılaştırır.",
  kaynak: kaynak("153-156"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Çalışan nüfusun sektörel dağılımı ile gelişmişlik arasındaki ilişkiyi açıklar.",
    "Sektörlerin GSYİH içindeki payını yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Ekonomik açıdan gelişmiş ülkelerde çalışan nüfusun sektörlere dağılımı nasıldır?",
      secenekler: [
        "Birincil sektörde çalışanların yüzdesi düşük, ikincil ve üçüncülde yüksektir",
        "Birincil sektörde çalışanların yüzdesi yüksek, üçüncülde düşüktür",
        "Her üç sektörde çalışan yüzdesi eşittir",
        "Yalnızca birincil sektörde çalışan bulunur"
      ],
      cozum: "Gelişmişlik seviyesi yüksek ülkelerde birincil sektörde çalışanların yüzdesi düşük; ikincil ve üçüncül sektörlerde yüksektir (s.153).",
      fc: ["Gelişmiş ülkede sektörel dağılım nedir?", "Birincil sektör payı düşük, hizmet ve sanayi payı yüksek."]
    },
    {
      bi: 0,
      metin: "Ekonomik açıdan gelişmiş ülkelerin dış ticaret yapısı hangisidir?",
      secenekler: [
        "Genelde ham madde alıp işlenmiş madde satarlar",
        "Genelde işlenmiş madde alıp ham madde satarlar",
        "Yalnızca tarım ürünleri satarlar",
        "Dış ticaret yapmazlar"
      ],
      cozum: "Kişi başına düşen millî gelirin yüksek olduğu gelişmiş ülkeler genelde ham madde alır, işlenmiş maddeler satar (s.153).",
      fc: ["Dış ticaret yapısı nedir?", "Ülkenin aldığı ve sattığı ürünlerin işlenmişlik düzeyine göre biçimlenmesi."]
    },
    {
      bi: 0,
      metin: "Ekonomik açıdan az gelişmiş ülkelerde hangi özellik görülür?",
      secenekler: [
        "Nüfus artış hızının yüksek, kentli ve okuryazar yüzdesinin düşük olması",
        "Beklenen yaşam süresinin uzun olması",
        "Kişi başına enerji tüketiminin fazla olması",
        "Birincil sektörde çalışan yüzdesinin düşük olması"
      ],
      cozum: "Az gelişmiş ülkelerde nüfus artış hızı yüksek; beklenen yaşam süresi kısa, kentli nüfus ve okuryazar yüzdesi düşüktür (s.153).",
      fc: ["Az gelişmiş ülkenin özellikleri nedir?", "Birincil sektör ağırlıklı, gelir düşük, nüfus artışı yüksek."]
    },
    {
      bi: 0,
      metin: "Bir ülkenin coğrafi sınırları içinde belirli bir dönemde üretilen bütün mal ve hizmetlerin piyasa fiyatlarıyla değerlendirilmiş hâline ne ad verilir?",
      secenekler: [
        "Gayrisafi yurt içi hasıla",
        "Kişi başına millî gelir",
        "Dış ticaret dengesi",
        "Enflasyon oranı"
      ],
      cozum: "Ülke sınırları içinde üretilen tüm mal ve hizmetlerin piyasa fiyatlarıyla değerlendirilmiş hâli gayrisafi yurt içi hasıladır (s.153).",
      fc: ["Gayrisafi yurt içi hasıla nedir?", "Ülke sınırlarında üretilen tüm mal ve hizmetlerin piyasa değeri."]
    },
    {
      bi: 0,
      metin: "İstatistiki verilerde dördüncül ve beşincil sektörler hangi sektöre dâhil edilir?",
      secenekler: [
        "Üçüncül sektöre",
        "Birincil sektöre",
        "İkincil sektöre",
        "Hiçbir sektöre"
      ],
      cozum: "İstatistiki verilerde dördüncül ve beşincil sektördeki faaliyet kollarına ait veriler üçüncül sektöre dâhil edilmektedir (s.153).",
      fc: ["Sektör verilerinin sınıflanması nedir?", "Dördüncül ve beşincil faaliyetlerin istatistikte üçüncüle yazılması."]
    },
    {
      bi: 1,
      metin: "Birincil sektörün GSYİH içindeki payının genellikle düşük olmasının nedeni hangisidir?",
      secenekler: [
        "Birincil ürünlerin katma değerinin düşük olması",
        "Bu sektörde hiç çalışan bulunmaması",
        "Ürünlerin tamamının ihraç edilmesi",
        "Sektörün devlet tarafından yasaklanması"
      ],
      cozum: "Birincil sektörden elde edilen ürünlerin katma değeri düşük olduğundan bu sektörün GSYİH içindeki payı diğerlerine göre düşük kalır (s.153).",
      fc: ["Katma değer nedir?", "Bir ürünün işlenmesiyle ortaya çıkan değer artışı."]
    },
    {
      bi: 1,
      metin: "İtalya ve Zambiya karşılaştırıldığında Zambiya'da birincil sektörde çalışanların oranının %57,3 olması hangi çıkarımı destekler?",
      secenekler: [
        "Ülkenin ekonomik gelişmişlik düzeyinin düşük olduğunu",
        "Ülkede hizmet sektörünün baskın olduğunu",
        "Ülkede sanayi üretiminin en yüksek paya sahip olduğunu",
        "Ülkede işsizliğin sıfır olduğunu"
      ],
      cozum: "Zambiya'da birincil sektörde çalışanların oranı yüksek, üçüncülde düşüktür; bu dağılım az gelişmiş ülke örüntüsüdür (s.153).",
      fc: ["Sektörel dağılım ile gelişmişlik arasındaki ilişki nedir?", "Birincil payı yüksekse gelişmişlik düzeyi düşüktür."]
    },
    {
      bi: 1,
      metin: "Kanada'da üçüncül sektörde çalışanların oranının %79,5, Çad'da ise %21,2 olması neyi gösterir?",
      secenekler: [
        "Hizmet sektörünün gelişmiş ekonomilerde daha büyük pay aldığını",
        "Çad'da hizmet sektörünün Kanada'dan gelişmiş olduğunu",
        "Her iki ülkede sektörel yapının aynı olduğunu",
        "Kanada'da tarımın tek geçim kaynağı olduğunu"
      ],
      cozum: "Kanada'da hizmet sektörü ağırlıklı, Çad'da birincil sektör ağırlıklıdır; bu fark gelişmişlik düzeyindeki farkla uyumludur (s.154).",
      fc: ["Hizmet sektörünün payı nedir?", "Gelişmişlik arttıkça hizmet sektörünün payının artması."]
    },
    {
      bi: 1,
      metin: "Ülkelerin gelişmişlik seviyesi belirlenirken sektörlerin GSYİH yüzdesinin kullanılması neden yararlıdır?",
      secenekler: [
        "Sektörlerin ekonomiye katkısını ayrı bir boyutta göstermesi",
        "Nüfus miktarını doğrudan vermesi ve nüfus artışını ölçmesi",
        "İklim özelliklerini bölgelere göre yansıtması",
        "Yerleşme tiplerini nüfus ölçütüne göre sınıflandırması"
      ],
      cozum: "Sektörlerin GSYİH yüzdesi, katma değer üretimindeki ağırlığı göstererek gelişmişlik değerlendirmesine katkı sağlar (s.155-156).",
      fc: ["GSYİH yüzdesi nedir?", "Bir sektörün ülke hasılası içindeki katkı oranı."]
    },
    {
      bi: 1,
      metin: "Bir ülkenin gelişmişlik düzeyini belirlemede yalnızca çalışan nüfusun sektörel dağılımına bakmak neden yetersizdir?",
      secenekler: [
        "Gelişmişlik birçok göstergeyle birlikte değerlendirilmelidir",
        "Sektörel dağılım verileri hiçbir zaman ölçülemez",
        "Çalışan nüfus verileri güvenilir kabul edilmez",
        "Gelişmişlik yalnızca iklim koşullarıyla açıklanır"
      ],
      cozum: "Gelişmişlik; kişi başı gelir, sektörlerin GSYİH yüzdesi, yaşam süresi, okuryazarlık gibi göstergelerle birlikte değerlendirilir (s.153-156).",
      fc: ["Gelişmişlik göstergeleri nedir?", "Gelir, sektörel dağılım, GSYİH payı, eğitim ve sağlık verileri."]
    }
  ]
});

/* ------------------------------------------------------- 5.3 */
yazKonu({
  konu_id: "cogr_10_u05_k03",
  ders: DERS, tema: 5, tema_adi: "Ekonomik Faaliyetler ve Etkileri",
  baslik: "5.3 Türkiye Ekonomisinin Sektörel Dağılımı",
  kazanim: "Ekonomik sektörlerin Türkiye ekonomisindeki yeri ve önemini gösteren tablo, grafik ve diyagram hazırlar.",
  kaynak: kaynak("157-159"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Türkiye'de sektörlerin tarihsel dönüşümünü açıklar.",
    "Sektörel verilerden yararlanarak Türkiye ekonomisini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Türkiye'nin ilk ekonomi politikalarının şekillendiği kongre hangisidir?",
      secenekler: [
        "İzmir İktisat Kongresi",
        "Sivas Kongresi",
        "Erzurum Kongresi",
        "Lozan Konferansı"
      ],
      cozum: "Türkiye'nin ilk ekonomi politikaları 1923'te toplanan İzmir İktisat Kongresi'yle şekillenmiş ve liberal bir ekonomi modeli belirlenmiştir (s.157).",
      fc: ["İzmir İktisat Kongresi nedir?", "1923'te toplanarak Türkiye'nin ekonomi politikalarını belirleyen kongre."]
    },
    {
      bi: 0,
      metin: "1929 Dünya Ekonomik Bunalımı ve İkinci Dünya Savaşı, Türkiye'de hangi ekonomi politikasının uygulanmasına yol açmıştır?",
      secenekler: [
        "Devletçi politikalar",
        "Tamamen serbest ticaret",
        "Yalnızca tarıma dayalı planlama",
        "İhracat odaklı sanayileşme"
      ],
      cozum: "1929 bunalımı ve İkinci Dünya Savaşı, Türkiye'de ekonomik alanda devletçi politikaların uygulanmasına sebep olmuştur (s.157).",
      fc: ["Devletçi ekonomi nedir?", "Devletin yatırım ve üretimde belirleyici olduğu ekonomi politikası."]
    },
    {
      bi: 0,
      metin: "Türkiye ekonomisi hangi yıllardan itibaren ihracat odaklı yeni bir ekonomi modeline geçmiştir?",
      secenekler: [
        "1980'li yıllardan itibaren",
        "1923'ten itibaren",
        "1940'lı yıllardan itibaren",
        "2000'li yıllardan itibaren"
      ],
      cozum: "Türkiye ekonomisi 1980'li yıllardan itibaren ihracat odaklı yeni bir ekonomi modeline geçmiştir (s.157).",
      fc: ["İhracat odaklı model nedir?", "Üretimin dış satıma yönlendirildiği ekonomi modeli."]
    },
    {
      bi: 0,
      metin: "1990 yılında Türkiye'de çalışan nüfusun sektörlere dağılımı hangisidir?",
      secenekler: [
        "%46,8 birincil, %20,3 ikincil, %32,9 üçüncül",
        "%18,4 birincil, %26,7 ikincil, %54,9 üçüncül",
        "%14,8 birincil, %27,3 ikincil, %57,9 üçüncül",
        "%57,9 birincil, %27,3 ikincil, %14,8 üçüncül"
      ],
      cozum: "1990 yılında çalışan nüfusun %46,8'i birincil, %20,3'ü ikincil, %32,9'u üçüncül sektörde çalışmaktaydı (s.157).",
      fc: ["1990 sektörel dağılım nedir?", "Birincil %46,8, ikincil %20,3, üçüncül %32,9."]
    },
    {
      bi: 0,
      metin: "2018 yılında Türkiye'de çalışan nüfusun üçüncül sektördeki oranı ne olmuştur?",
      secenekler: [
        "%54,9",
        "%32,9",
        "%46,8",
        "%18,4"
      ],
      cozum: "2018 yılında çalışan nüfusun %18,4'ü birincil, %26,7'si ikincil ve %54,9'u üçüncül sektörde çalışmaktaydı (s.157).",
      fc: ["2018 sektörel dağılım nedir?", "Birincil %18,4, ikincil %26,7, üçüncül %54,9."]
    },
    {
      bi: 1,
      metin: "2024 verilerine göre Türkiye'de çalışan nüfusun birincil sektördeki oranı hangisidir?",
      secenekler: [
        "%14,8",
        "%27,3",
        "%57,9",
        "%46,8"
      ],
      cozum: "2024 verilerine göre çalışan nüfusun %14,8'i birincil, %27,3'ü ikincil ve %57,9'u üçüncül sektörde çalışmaktadır (s.157).",
      fc: ["2024 sektörel dağılım nedir?", "Birincil %14,8, ikincil %27,3, üçüncül %57,9."]
    },
    {
      bi: 1,
      metin: "1990'dan 2024'e Türkiye'de sektörel dağılımda görülen değişim hangisidir?",
      secenekler: [
        "Birincil sektörün payı azalırken üçüncül sektörün payı artmıştır",
        "Birincil sektörün payı artarken üçüncül sektörün payı azalmıştır",
        "Her iki sektörün payı da değişmemiştir",
        "İkincil sektör tamamen ortadan kalkmıştır"
      ],
      cozum: "1990'da birincil sektörün payı %46,8 iken 2024'te %14,8'e; üçüncül sektörün payı ise %32,9'dan %57,9'a yükselmiştir (s.157).",
      fc: ["Sektörel dönüşüm nedir?", "Birincil sektör payının azalıp hizmet sektörü payının artması."]
    },
    {
      bi: 1,
      metin: "Türkiye'de ekonomik sektörlerin istihdam ve hasıladaki yerini gösteren veriler hangi kurumdan temin edilir?",
      secenekler: [
        "Türkiye İstatistik Kurumu",
        "Meteoroloji Genel Müdürlüğü",
        "Afet ve Acil Durum Yönetimi Başkanlığı",
        "Tapu ve Kadastro Genel Müdürlüğü"
      ],
      cozum: "Sektörlerin istihdam ve gayrisafi yurt içi hasıladaki yerine ilişkin veriler TÜİK'in genel ağ adresinden sağlanır (s.157).",
      fc: ["TÜİK nedir?", "Türkiye'nin istatistik verilerini üreten kurumu."]
    },
    {
      bi: 1,
      metin: "Üçüncül sektörün payının artması Türkiye ekonomisi açısından hangi anlamı taşır?",
      secenekler: [
        "Hizmet üretiminin ve istihdamın bu alanda yoğunlaştığını",
        "Tarımsal üretimin tamamen sona erdiğini",
        "Sanayinin hiç gelişmediğini",
        "Yerli üretimin tümüyle durduğunu"
      ],
      cozum: "Üçüncül sektörün %57,9'a ulaşması hizmet faaliyetlerinin istihdamda ve ekonomide ağırlık kazandığını gösterir (s.157).",
      fc: ["Hizmet sektörünün ağırlığı nedir?", "İstihdamın ve katma değerin hizmet faaliyetlerinde yoğunlaşması."]
    },
    {
      bi: 1,
      metin: "Gündelik ihtiyaçlarda yerli ve millî ürünlerin tercih edilmesi Türkiye'de hangi sonucu doğurur?",
      secenekler: [
        "Üretim ve istihdamın artmasına katkı sağlar",
        "İhracatın tamamen durmasına yol açar",
        "Sektörel dağılımı değiştirmeden sabit tutar",
        "Tarım sektörünü tek başına büyütür"
      ],
      cozum: "Yerli üretimin tercih edilmesi, ekonomik sektörlerdeki istihdamı ve yurt içi hasılayı destekler (s.158).",
      fc: ["Yerli üretim tercihi nedir?", "Tüketimde yerli ürünleri seçerek ülke içi üretimi ve istihdamı desteklemek."]
    }
  ]
});
