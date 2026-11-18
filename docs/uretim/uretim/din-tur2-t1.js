#!/usr/bin/env node
/* ============================================================
   DİN KÜLTÜRÜ 10 · TUR-2 · 1. ÜNİTE — kitaptan sıfırdan havuzlar
   ------------------------------------------------------------
   Kaynak: MEB Din Kültürü 10 (2025) — `kitap-kaynak` dalındaki
   din.json. Basılı sayfa = PDF sayfası − 1.

     1.1.1 İslam'da Bilginin Yeri                    s.13-17
     1.1.2 İslam'da Bilgi Kaynakları                 s.18-21
     1.2   Allah-Âlem İlişkisi                       s.23-27

   Bu üç havuz daha önce "10. Sınıf din json.zip" kaynaklıydı;
   zip sürümleri `arsiv/soru_havuzlari/din/zip-*` altına taşındı.

   Kullanım: node docs/uretim/uretim/din-tur2-t1.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Din Kültürü";
const DOSYA = "din-10.pdf (MEB, 2025)";
const kaynak = s => "Din Kültürü 10 ders kitabı, s." + s;
const TEMA = 1;
const TEMA_ADI = "İslam'da Varlık ve Bilgi";

/* --------------------------------------------- 1.1.1 */
yazKonu({
  konu_id: "din_10_u01_k01",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "1.1.1 İslam'da Bilginin Yeri",
  kazanim: "İslam düşüncesinde bilginin yerini ve ilmin önemini açıklar.",
  kaynak: kaynak("13-17"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "İslam'da bilgi ve ilmin yerini, ilim öğrenmenin dinî hükmünü açıklar.",
    "İslam düşüncesinde ilmin kurumsallaşmasını ve bilgi disiplinlerini ilişkilendirir."
  ],
  items: [
    {
      bi: 0,
      metin: "İslam düşüncesinde bilgi, kaynak eserlerde genellikle hangi kavramla ifade edilir?",
      secenekler: ["İlim", "Fıkıh", "Kelam", "Tasavvuf"],
      cozum: "İslam literatüründe bilgi, çoğunlukla ilim kavramıyla karşılanır.",
      fc: ["İlim nedir?", "İslam düşüncesinde bilgiyi karşılayan kavram."]
    },
    {
      bi: 0,
      metin: "İlim sahibi olan, bilen kişiye verilen ad hangisidir?",
      secenekler: ["Âlim", "Fakih", "Müfessir", "Mütekellim"],
      cozum: "İlimle meşgul olan ve bilen kişiye âlim denir.",
      fc: ["Âlim nedir?", "İlim sahibi, bilen kişi."]
    },
    {
      bi: 0,
      metin: "Hz. Peygamber'in ilim öğrenmenin önemini vurguladığı sözü hangisidir?",
      secenekler: [
        "İlim öğrenmek kadın ve erkek her Müslüman'a farzdır.",
        "Namaz dinin direğidir.",
        "Temizlik imanın yarısıdır.",
        "Komşusu açken tok yatan bizden değildir."
      ],
      cozum: "Hadiste ilim öğrenmek kadın erkek ayrımı yapılmadan farz olarak bildirilmiştir.",
      fc: ["İlim öğrenmenin hükmü nedir?", "Kadın ve erkek her Müslüman'a farzdır."]
    },
    {
      bi: 0,
      metin: "Bedir Savaşı sonrasında okuma yazma bilen esirlerin serbest bırakılma şartı nedir?",
      secenekler: [
        "On Müslüman'a okuma yazma öğretmeleri",
        "On Müslüman'a silah eğitimi vermeleri",
        "Mescid-i Nebevi'nin inşasında çalışmaları",
        "Bir yıl boyunca vergi ödemeleri"
      ],
      cozum: "Esirler, on Müslüman'a okuma yazma öğretmeleri karşılığında serbest bırakılmıştır.",
      fc: ["Bedir esirlerine getirilen şart nedir?", "On Müslüman'a okuma yazma öğretmeleri."]
    },
    {
      bi: 0,
      metin: "Hz. Peygamber'in ilim öğretimi için Mescid-i Nebevi'nin yanında oluşturduğu yer hangisidir?",
      secenekler: ["Suffe", "Dârül Erkam", "Beytü'l-Hikme", "Nizamiye Medresesi"],
      cozum: "Suffe, mescidin bitişiğinde ilim öğretilen yer olarak İslam eğitiminin ilk örneklerindendir.",
      fc: ["Suffe nedir?", "Mescid-i Nebevi yanında ilim öğretilen yer."]
    },
    {
      bi: 1,
      metin: "Kur'an-ı Kerim'i açıklama ve yorumlama ile ilgilenen bilgi disiplini hangisidir?",
      secenekler: ["Tefsir", "Hadis", "Kelam", "Fıkıh"],
      cozum: "Tefsir, Kur'an ayetlerini açıklamayı ve yorumlamayı konu edinir.",
      fc: ["Tefsir nedir?", "Kur'an'ı açıklama ve yorumlama disiplini."]
    },
    {
      bi: 1,
      metin: "Hz. Peygamber'in söz ve davranışlarını inceleyen bilgi disiplini hangisidir?",
      secenekler: ["Hadis", "Tefsir", "Kelam", "Tasavvuf"],
      cozum: "Hadis ilmi, Hz. Peygamber'in söz, fiil ve takrirlerini inceler.",
      fc: ["Hadis nedir?", "Hz. Peygamber'in söz ve davranışlarını inceleyen disiplin."]
    },
    {
      bi: 1,
      metin: "İnanç esaslarını akıl yürütmelerle savunmayı konu edinen bilgi disiplini hangisidir?",
      secenekler: ["Kelam", "Fıkıh", "Hadis", "Felsefe"],
      cozum: "Kelam, inanç konularını akıl ve nakil çerçevesinde ele alır.",
      fc: ["Kelam nedir?", "İnanç esaslarını akıl yürütmeyle ele alan disiplin."]
    },
    {
      bi: 1,
      metin: "İbadet ve günlük hayata ilişkin dinî hükümleri inceleyen bilgi disiplini hangisidir?",
      secenekler: ["Fıkıh", "Kelam", "Tefsir", "Tasavvuf"],
      cozum: "Fıkıh, ibadet ve muamelata dair hükümleri konu edinir.",
      fc: ["Fıkıh nedir?", "İbadet ve günlük hayata dair dinî hükümleri inceleyen disiplin."]
    },
    {
      bi: 1,
      metin: "Uluğ Bey'in Semerkant'ta kurduğu ve otuz yıl faaliyet gösteren ilim kurumu hangisidir?",
      secenekler: [
        "Semerkant Rasathanesi",
        "Beytü'l-Hikme",
        "Süleymaniye Medresesi",
        "Nizamiye Medresesi"
      ],
      cozum: "Semerkant Rasathanesi, Uluğ Bey'in astronomi çalışmalarının merkezi olmuştur.",
      fc: ["Semerkant Rasathanesi nedir?", "Uluğ Bey'in kurduğu, otuz yıl faaliyet gösteren astronomi kurumu."]
    },
    {
      bi: 1,
      metin: "Tasavvuf disiplini hangi konuyu merkeze alır?",
      secenekler: [
        "İnsanın iç dünyasını ve manevi olgunlaşmayı",
        "İbadetlere ilişkin hükümleri",
        "Ayetlerin iniş sebeplerini",
        "İnanç esaslarının delillerini"
      ],
      cozum: "Tasavvuf, dinin ahlak ve manevi boyutunu öne çıkarır.",
      fc: ["Tasavvuf nedir?", "İnsanın iç dünyasını ve manevi olgunlaşmayı konu edinen disiplin."]
    },
    {
      bi: 0,
      metin: "Bağdat'ta kurulan ve sistemli medrese geleneğinin öncüsü sayılan kurum hangisidir?",
      secenekler: ["Nizamiye Medresesi", "Suffe", "Beytü'l-Hikme", "Semerkant Rasathanesi"],
      cozum: "Nizamiye Medresesi, medrese geleneğinin kurumsallaşmasında öncü olmuştur.",
      fc: ["Nizamiye Medresesi nedir?", "Bağdat'ta kurulan, sistemli medrese geleneğinin öncüsü."]
    },
    {
      bi: 0,
      metin: "“Hiç bilenlerle bilmeyenler bir olur mu?” ifadesi hangi kaynakta yer alır?",
      secenekler: ["Kur'an-ı Kerim", "Hadis külliyatı", "Fıkıh kitapları", "Kelam eserleri"],
      cozum: "İfade, Zümer suresi 9. ayette bilginin değerini vurgular.",
      fc: ["Bilginin değeri hangi ilkeyle vurgulanır?", "Bilenlerle bilmeyenlerin bir tutulmaması (Zümer suresi 9. ayet)."]
    }
  ]
});

/* --------------------------------------------- 1.1.2 */
yazKonu({
  konu_id: "din_10_u01_k02",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "1.1.2 İslam'da Bilgi Kaynakları",
  kazanim: "İslam düşüncesinde bilgi edinme yollarını ve bilgi türlerini sınıflandırır.",
  kaynak: kaynak("18-21"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "İslam'da bilginin kaynaklarını sınıflandırır.",
    "Bilgi türlerini ayırt eder ve duyuların sınırlılığını örneklendirir."
  ],
  items: [
    {
      bi: 0,
      metin: "İslam inancına göre dinî bilginin temel kaynağı hangisidir?",
      secenekler: [
        "Kur'an-ı Kerim ve sünnet",
        "Gelenek ve görenek",
        "Duyular ve deney",
        "Sezgi ve rüya"
      ],
      cozum: "Dinî bilginin kaynağı Kur'an-ı Kerim ve sünnettir.",
      fc: ["Dinî bilginin kaynağı nedir?", "Kur'an-ı Kerim ve sünnet."]
    },
    {
      bi: 0,
      metin: "Yalan üzerinde birleşmeleri mümkün olmayan bir topluluğun aktardığı haber hangisidir?",
      secenekler: ["Mütevatir haber", "Öznel bilgi", "Sezgisel bilgi", "Gündelik bilgi"],
      cozum: "Mütevatir haber, kalabalık bir topluluğun aktarması nedeniyle kesin bilgi ifade eder.",
      fc: ["Mütevatir haber nedir?", "Yalan üzerinde birleşmesi mümkün olmayan topluluğun aktardığı haber."]
    },
    {
      bi: 0,
      metin: "Ortamın kötülüğünden etkilenmeyen, doğru karar vermeyi sağlayan akıl hangisidir?",
      secenekler: ["Selim akıl", "Nazarî akıl", "Amelî akıl", "Fıtrî zekâ"],
      cozum: "Selim akıl, sağlıklı işleyen ve doğru hüküm veren akıldır.",
      fc: ["Selim akıl nedir?", "Ortamdan etkilenmeyen, doğru karar veren akıl."]
    },
    {
      bi: 0,
      metin: "Temel özelliğini yitirmemiş, sağlıklı işleyen duyulara verilen ad hangisidir?",
      secenekler: ["Salim duyular", "Öznel duyular", "Tecrübi duyular", "Sezgisel duyular"],
      cozum: "Salim duyular, sağlıklı ve görevini yerine getiren duyu organlarıdır.",
      fc: ["Salim duyular nedir?", "Sağlıklı ve temel özelliğini yitirmemiş duyular."]
    },
    {
      bi: 0,
      metin: "Suya batırılan kalemin kırılmış gibi görünmesi aşağıdakilerden hangisine örnektir?",
      secenekler: [
        "Duyuların yanıltıcı olabilmesine",
        "Aklın yetersiz kalmasına",
        "Haberin güvenilmezliğine",
        "Vahyin sınırlı olmasına"
      ],
      cozum: "Duyular bazı durumlarda nesneyi olduğundan farklı algılayabilir.",
      fc: ["Duyuların sınırlılığına örnek nedir?", "Suya batırılan kalemin kırılmış görünmesi."]
    },
    {
      bi: 1,
      metin: "Sezgi, rüya, keşif ve ilham hangi bilgi kaynakları grubunda yer alır?",
      secenekler: [
        "Öznel bilgi kaynakları",
        "Nesnel bilgi kaynakları",
        "Dinî bilgi kaynakları",
        "Bilimsel bilgi kaynakları"
      ],
      cozum: "Bu yollar kişiden kişiye değiştiği için öznel bilgi kaynakları sayılır.",
      fc: ["Öznel bilgi nedir?", "Sezgi, rüya, keşif ve ilhamla elde edilen, kişiden kişiye değişen bilgi."]
    },
    {
      bi: 1,
      metin: "Günlük hayatta tecrübe edilerek elde edilen bilgi türü hangisidir?",
      secenekler: ["Gündelik bilgi", "Teknik bilgi", "Sanatsal bilgi", "Felsefi bilgi"],
      cozum: "Gündelik bilgi, tecrübe yoluyla ve sistematik olmayan öğrenmeyle elde edilir.",
      fc: ["Gündelik bilgi nedir?", "Günlük hayatta tecrübe edilerek elde edilen bilgi."]
    },
    {
      bi: 1,
      metin: "İnsanlığın doğadan faydalanarak elde ettiği ve teknolojik ürünlerin dayandığı bilgi türü hangisidir?",
      secenekler: ["Teknik bilgi", "Gündelik bilgi", "Bilimsel bilgi", "Dinî bilgi"],
      cozum: "Teknik bilgi, somut varlık alanına ait olup icatların temelini oluşturur.",
      fc: ["Teknik bilgi nedir?", "Doğadan faydalanarak elde edilen, teknolojinin dayandığı bilgi."]
    },
    {
      bi: 1,
      metin: "Deney ve gözlem yoluyla elde edilen, evrensel nitelikli ve zamanla değişebilen bilgi türü hangisidir?",
      secenekler: ["Bilimsel bilgi", "Dinî bilgi", "Sanatsal bilgi", "Gündelik bilgi"],
      cozum: "Bilimsel bilgi nesnellik ve test edilebilirlik özellikleri taşır, yeni keşiflerle değişebilir.",
      fc: ["Bilimsel bilgi nedir?", "Deney ve gözlemle elde edilen, evrensel ve değişebilen bilgi."]
    },
    {
      bi: 1,
      metin: "İnsanın duyularıyla algılayamadığı bazı varlıkları akıl yoluyla kavraması hangi bilgi türüyle ilişkilidir?",
      secenekler: ["Felsefi bilgi", "Gündelik bilgi", "Teknik bilgi", "Sanatsal bilgi"],
      cozum: "Felsefi bilgi, akıl ve mantık çerçevesinde sorgulama yoluyla elde edilir.",
      fc: ["Felsefi bilgi nedir?", "Akıl ve mantık çerçevesinde sorgulamayla elde edilen bilgi."]
    },
    {
      bi: 0,
      metin: "Sadık haber kapsamında değerlendirilen bilgi kaynağı hangisidir?",
      secenekler: [
        "Hz. Peygamber'den aktarılan hadisler",
        "Sohbet sırasında duyulan söylentiler",
        "Sezgiyle ulaşılan kanaatler",
        "Rüyalarda görülen hadiseler"
      ],
      cozum: "Vahiy ve sahih sünnet, doğruluğu kesin haber kaynaklarıdır.",
      fc: ["Sadık haber nedir?", "Doğruluğu kesin olan, vahiy ve sahih sünnete dayanan haber."]
    },
    {
      bi: 0,
      metin: "Aşağıdakilerden hangisi İslam'da bilginin nesnel kaynakları arasında yer almaz?",
      secenekler: ["İlham", "Vahiy", "Selim akıl", "Salim duyular"],
      cozum: "İlham, kişiye özgü olduğu için öznel bilgi kaynakları arasında yer alır.",
      fc: ["Öznel bilgi kaynaklarına örnek nedir?", "İlham, sezgi, rüya ve keşif."]
    },
    {
      bi: 1,
      metin: "Bir ressamın duygularını tabloya aktarması hangi bilgi türüne örnektir?",
      secenekler: ["Sanatsal bilgi", "Teknik bilgi", "Gündelik bilgi", "Bilimsel bilgi"],
      cozum: "Sanatsal bilgi özneldir ve duygulara hitap eder.",
      fc: ["Sanatsal bilgi nedir?", "Duygulara hitap eden, öznel ve farklı araçlarla ifade edilebilen bilgi."]
    }
  ]
});

/* --------------------------------------------- 1.2 */
yazKonu({
  konu_id: "din_10_u01_k03",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "1.2 Allah-Âlem İlişkisi",
  kazanim: "Allah-âlem ilişkisini ve insanın âlemdeki konumunu açıklar.",
  kaynak: kaynak("23-27"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Âlem kavramını, şehadet ve gayb âlemini açıklar.",
    "İnsanın âlemdeki konumunu ve sorumluluğunu yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Akıl ve duyu organlarıyla bilinebilen veya varlığı düşünülebilen, Allah dışındaki bütün varlıkları ifade eden kavram hangisidir?",
      secenekler: ["Âlem", "Şehadet", "Gayb", "Mahlûk"],
      cozum: "Âlem, Allah'ın dışındaki bütün varlıkları kapsayan kavramdır.",
      fc: ["Âlem nedir?", "Allah dışındaki bütün varlıkları ifade eden kavram."]
    },
    {
      bi: 0,
      metin: "İnsanın duyular yoluyla algılayabildiği varlıklardan oluşan bölüm hangisidir?",
      secenekler: ["Şehadet âlemi", "Gayb âlemi", "Melekût âlemi", "Berzah âlemi"],
      cozum: "Duyularla algılanabilen varlıklar şehadet âlemini oluşturur.",
      fc: ["Şehadet âlemi nedir?", "Duyularla algılanabilen varlıkların oluşturduğu bölüm."]
    },
    {
      bi: 0,
      metin: "Akıl ve duyular yoluyla algılanamayan varlıkların oluşturduğu bölüm hangisidir?",
      secenekler: ["Gayb âlemi", "Şehadet âlemi", "Bezm-i elest", "Dâr-ı dünya"],
      cozum: "Duyularla algılanamayan varlık alanı gayb âlemi olarak adlandırılır.",
      fc: ["Gayb âlemi nedir?", "Duyularla algılanamayan varlıkların oluşturduğu bölüm."]
    },
    {
      bi: 0,
      metin: "Allah'ın her şeyin yaratıcısı olduğunu ifade eden ismi hangisidir?",
      secenekler: ["el-Halık", "el-Alîm", "er-Rezzâk", "el-Basîr"],
      cozum: "el-Halık, yaratan anlamına gelir ve Allah'ın yaratıcılığını ifade eder.",
      fc: ["el-Halık ne demektir?", "Yaratan; Allah'ın her şeyin yaratıcısı olması."]
    },
    {
      bi: 0,
      metin: "İslam düşüncesine göre âlemin varlığını sürdürmesi hangi gerçeğe bağlıdır?",
      secenekler: [
        "Allah'ın yaratmasının devam etmesine",
        "Âlemin kendi kendine yeterli olmasına",
        "Varlıkların birbirini yaratmasına",
        "İnsanın âlemi yönetmesine"
      ],
      cozum: "Âlem var olmak ve varlığını sürdürmek için Allah'a muhtaçtır.",
      fc: ["Yaratmanın sürekliliği nedir?", "Allah'ın yaratmasının devam etmesi; âlemin varlığını sürdürmesi."]
    },
    {
      bi: 1,
      metin: "İslam inancına göre insanın âlemdeki konumu hangi sorumlulukla ilişkilidir?",
      secenekler: [
        "Allah'ın halifesi olma sorumluluğu",
        "Âlemin tek sahibi olma yetkisi",
        "Doğa olaylarını belirleme görevi",
        "Varlıkları yaratma görevi"
      ],
      cozum: "İnsan, yeryüzünü imar etmek ve emanetleri korumakla sorumlu bir halifedir.",
      fc: ["İnsanın âlemdeki konumu nedir?", "Allah'ın halifesi olma sorumluluğu."]
    },
    {
      bi: 1,
      metin: "\"Ben cinleri ve insanları ancak bana kulluk etsinler diye yarattım.\" ayetine göre insanın yaratılış amacı nedir?",
      secenekler: [
        "Allah'a kulluk etmek",
        "Yeryüzünde servet biriktirmek",
        "Varlıkları yönetmek",
        "Doğayı dönüştürmek"
      ],
      cozum: "Ayet, insanın yaratılış amacını Allah'a kulluk olarak bildirir.",
      fc: ["İnsanın yaratılış amacı nedir?", "Allah'a kulluk etmek."]
    },
    {
      bi: 1,
      metin: "İnsanın kendisine verilen nimetler karşısındaki sorumluluğu hangisidir?",
      secenekler: [
        "Nimetleri Allah'ın rızasına uygun kullanmak",
        "Nimetleri kendi mülkü saymak",
        "Nimetleri sınırsız tüketmek",
        "Nimetleri biriktirip saklamak"
      ],
      cozum: "Nimetler Allah'ın mülkü olup emanet olarak rızaya uygun kullanılmalıdır.",
      fc: ["Emanet bilinci nedir?", "Nimetleri Allah'ın mülkü bilip rızasına uygun kullanmak."]
    },
    {
      bi: 1,
      metin: "Allah-âlem ilişkisi hangi ilmin konuları arasında yer alır?",
      secenekler: ["Kelam", "Fıkıh", "Tefsir", "Hadis"],
      cozum: "Allah'ın varlığı ve âlemle ilişkisi kelam ilminin konularındandır.",
      fc: ["Kelam ilminin konularından biri nedir?", "Allah-âlem ilişkisi."]
    },
    {
      bi: 1,
      metin: "İnsanın davranışlarında serbest bırakılmasının sonucu hangisidir?",
      secenekler: [
        "Tercihlerinden sorumlu tutulması",
        "Yalnız ibadetlerinden sorumlu tutulması",
        "Amellerinin karşılığını dünyada alması",
        "Sorumluluğunun meleklere ait olması"
      ],
      cozum: "İnsan iradesini kullanmakta serbest bırakılmış, bu nedenle tercihlerinden sorumlu tutulmuştur.",
      fc: ["İnsanın sorumluluğunun kaynağı nedir?", "İradesini serbestçe kullanması."]
    },
    {
      bi: 0,
      metin: "“Âlemlerin Rabbi” tabiri hangi ilişkiye işaret eder?",
      secenekler: [
        "Allah'ın bütün varlıkların Rabbi olmasına",
        "İnsanın âlemi yönetmesine",
        "Varlıkların kendi kendine var olmasına",
        "Âlemin Allah'ın bir parçası olmasına"
      ],
      cozum: "Tabir, Allah'ın yarattığı bütün varlıklar üzerindeki Rabliğini ifade eder.",
      fc: ["Rab kavramı neyi ifade eder?", "Yaratan, besleyen ve yöneten; âlemlerin Rabbi olan Allah."]
    },
    {
      bi: 1,
      metin: "İnsanın yeryüzünde halife olması hangi görevleri kapsar?",
      secenekler: [
        "Yeryüzünü imar etmek, adaleti sağlamak ve emanetleri korumak",
        "Servet toplayıp toplum üzerinde hüküm kurmak",
        "Doğa olaylarının yönünü değiştirmek",
        "Varlıkları yaratıp onlara şekil vermek"
      ],
      cozum: "Halifelik, imar, adalet ve emaneti koruma sorumluluğunu içerir.",
      fc: ["Halifelik nedir?", "İnsanın yeryüzünü imar etme, adaleti sağlama ve emaneti koruma sorumluluğu."]
    },
    {
      bi: 1,
      metin: "İslam düşüncesine göre varlıkların Allah'ı tespih etmesi neyi gösterir?",
      secenekler: [
        "Bütün varlıkların Allah ile ilişki içinde olduğunu",
        "Varlıkların irade sahibi olduğunu",
        "Âlemin Allah'tan bağımsız olduğunu",
        "İnsanın varlıklardan üstün olmadığını"
      ],
      cozum: "Tespih, varlıkların Allah ile kesintisiz ilişkisini dile getirir.",
      fc: ["Tespih nedir?", "Varlıkların Allah'ı anması ve O'nunla kesintisiz ilişki içinde olması."]
    }
  ]
});

console.log("din tur-2 (1. ünite): 3 havuz yazıldı");
