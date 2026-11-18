#!/usr/bin/env node
/* ============================================================
   COĞRAFYA 10 · 1–2. ÜNİTE — kitaptan sıfırdan havuzlar
   ------------------------------------------------------------
   Kaynak: MEB Coğrafya 10 (2025) — `kitap-kaynak` dalındaki
   cografya.json. Basılı sayfa = PDF sayfası − 1.

     1.1 Coğrafi Bakış                                        s.15-24
     2.1 CBS ve Uzaktan Algılamanın Uygulama Alanları         s.31-36
     2.2 Mekânsal Verilerin Haritalara Aktarılması            s.37-40

   Kullanım: node docs/uretim/uretim/cografya-t1.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Coğrafya";
const DOSYA = "cografya-10.pdf (MEB, 2025)";
const kaynak = s => "Coğrafya 10 ders kitabı, s." + s;

/* ------------------------------------------------------- 1.1 */
yazKonu({
  konu_id: "cogr_10_u01_k01",
  ders: DERS, tema: 1, tema_adi: "Coğrafyanın Doğası",
  baslik: "1.1 Coğrafi Bakış",
  kazanim: "Örnek olay, olgu ve/veya mekânı coğrafyanın temel kavramları ile ilişkilendirir.",
  kaynak: kaynak("15-24"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Coğrafi bakışın tanımını, bileşenlerini ve ölçek boyutunu açıklar.",
    "Bir örnek olayı (Marmara Gölü) coğrafi bakışla çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "Coğrafi olay ve olguları mekânsal bağlamda ele alıp dağılım, neden ve sonuçlarını yerel, bölgesel ve küresel ölçekte değerlendiren bakış açısı hangisidir?",
      secenekler: [
        "Coğrafi bakış",
        "Tarihsel bakış",
        "Ekonomik bakış",
        "Hukuki bakış"
      ],
      cozum: "Coğrafi bakış; olay ve olguları mekânsal bağlamda ele almayı, dağılım-neden-sonuç ilişkilerini farklı ölçeklerde değerlendirmeyi gerektirir (s.17).",
      fc: ["Coğrafi bakış nedir?", "Olayları mekânsal bağlamda, ölçek boyutuyla değerlendiren bakış."]
    },
    {
      bi: 0,
      metin: "Coğrafi bakışın bileşenleri arasında hangisi yer alır?",
      secenekler: [
        "Mekânsal düşünme ve ölçek bilinci",
        "Yalnızca harita çizim teknikleri",
        "Yalnızca iklim verilerinin ölçülmesi",
        "Sadece nüfus sayımlarının yorumu"
      ],
      cozum: "Coğrafi bakış mekânsal düşünme, ölçek bilinci, yer ve mekân algısı, insan-çevre etkileşimi, coğrafi bağlantılar gibi bileşenlerden oluşur (s.17).",
      fc: ["Ölçek bilinci nedir?", "Bir olayı yerel, bölgesel ve küresel düzeylerde ayrı ayrı değerlendirebilme farkındalığı."]
    },
    {
      bi: 0,
      metin: "Coğrafi bakışın dünyayı anlamak için kullandığı soru örüntüsü hangisidir?",
      secenekler: [
        "Nerede, neden orada ve nasıl",
        "Ne zaman, kim, hangi amaçla",
        "Kaç kişi, kaç yıl, kaç lira",
        "Hangi renk, hangi şekil, hangi boyut"
      ],
      cozum: "Coğrafi bakış dünyayı 'nerede, neden orada ve nasıl' sorularıyla anlamaya çalışır; mekânı merkeze alır (s.17).",
      fc: ["Coğrafi bakışın temel soruları nedir?", "Nerede, neden orada ve nasıl."]
    },
    {
      bi: 0,
      metin: "Bir öğrenci mahallesindeki su baskınlarını araştırırken sokak eğimini, yağmur suyu kanallarını ve yapı yoğunluğunu birlikte değerlendirmiştir. Öğrencinin kullandığı yetkinlik hangisidir?",
      secenekler: [
        "Mekân okuryazarlığı",
        "Sayısal okuryazarlık",
        "Medya okuryazarlığı",
        "Finansal okuryazarlık"
      ],
      cozum: "Bileşenler, bireyin bir olay ya da olguyu anlama, çözümleme ve analiz etmesi için gerek duyduğu mekân okuryazarlığının temelini oluşturur (s.17).",
      fc: ["Mekân okuryazarlığı nedir?", "Coğrafi bakışın bileşenleriyle olayları anlama, çözümleme ve analiz etme yetkinliği."]
    },
    {
      bi: 0,
      metin: "1854'te Londra'nın Soho bölgesinde kolera salgınının kaynağının içme suyu kuyusu olarak belirlenmesi hangi yaklaşımın örneğidir?",
      secenekler: [
        "Coğrafi bakışla yapılan mekânsal analiz",
        "Yalnızca laboratuvar deneyi",
        "Tarihsel kronoloji sıralaması",
        "Ekonomik maliyet hesabı"
      ],
      cozum: "Salgının yaşandığı alanların doğal ve beşerî özelliklerinin irdelenmesi ve kaynağın mekânsal olarak tespiti coğrafi bakışın önemini gösterir (s.17).",
      fc: ["Coğrafi bakışın sağlık alanındaki katkısı nedir?", "Salgının mekânsal kaynağını belirleyip yayılımı durdurması."]
    },
    {
      bi: 1,
      metin: "Marmara Gölü'nün oluşum özelliği hangisidir?",
      secenekler: [
        "Gediz Nehri'nin taşıdığı alüvyonların birikmesiyle oluşan alüvyon set gölü",
        "Volkanik patlamayla oluşan krater gölü",
        "Buzul aşındırmasıyla oluşan sirk gölü",
        "Karstik çözünmeyle oluşan polye gölü"
      ],
      cozum: "Gediz Nehri'nin taşıdığı alüvyonların birikmesiyle Gediz Havzası içinde oluşan Marmara Gölü, alüvyon set gölüdür (s.18).",
      fc: ["Alüvyon set gölü nedir?", "Akarsuyun taşıdığı alüvyonların birikmesiyle oluşan göl."]
    },
    {
      bi: 1,
      metin: "Marmara Gölü'nün 2017 yılı su bütçesinin 2012'ye göre bozulmasında hangi değişim etkili olmuştur?",
      secenekler: [
        "Gölü besleyen su kaynaklarının azalması, sulama amaçlı çekilen suyun artması",
        "Gölü besleyen kaynakların artması, sulama suyunun azalması",
        "Yağışın ve buharlaşmanın aynı oranda değişmesi",
        "Gölden hiç su çekilmemesi"
      ],
      cozum: "2017'de gölü besleyen kaynak miktarı 2012'ye göre çok düşük kalmış, sulama amaçlı çekilen su ise artmıştır; su bütçesi 7,72'den −79,98'e düşmüştür (s.21).",
      fc: ["Su bütçesi nedir?", "Girdiler ile çıktılar arasındaki fark."]
    },
    {
      bi: 1,
      metin: "Marmara Gölü'nün alanı 1975'te 5.949 hektar iken 2018'de 3.464 hektara inmiştir. Bu veriler gölün alanında kaç hektarlık azalmayı gösterir?",
      secenekler: [
        "2.485 hektar",
        "1.485 hektar",
        "3.464 hektar",
        "5.949 hektar"
      ],
      cozum: "5.949 − 3.464 = 2.485 hektar azalma vardır (s.20).",
      fc: ["Göl alanı ile gölün su varlığı arasındaki ilişki nedir?", "Alanın küçülmesi beslenmenin azaldığını, hacmin düştüğünü gösterir."]
    },
    {
      bi: 1,
      metin: "Marmara Gölü'nün 2022 yılında tamamen kuruması göl çevresindeki hangi sosyoekonomik soruna yol açmıştır?",
      secenekler: [
        "Balıkçılığın zarar görmesi ve çekilme alanlarının paylaşımında toplumsal gerginlik",
        "Balıkçılık gelirlerinin hızla artması",
        "Göl çevresinde nüfusun tamamen boşalması",
        "Tarımsal üretimin tamamen durması ve göçün bitmesi"
      ],
      cozum: "Su kalitesinin düşmesi ve balık hastalıkları balıkçılığı olumsuz etkilemiş, çekilme alanlarının paylaşımı ise toplumsal gerginliğe neden olmuştur (s.21).",
      fc: ["Kurumanın balıkçılığa etkisi nedir?", "Su kalitesi düşer, balık hastalıkları artar, gelir azalır."]
    },
    {
      bi: 1,
      metin: "Marmara Gölü'nde yaşanan kurumanın önlenebilmesi için coğrafi bakışla hangi önlem önerilebilir?",
      secenekler: [
        "Gölü besleyen su kaynakları ile sulama amaçlı su çekimini birlikte planlamak",
        "Gölden sulama suyu çekimini artırmak",
        "Göl çevresindeki tarımsal faaliyeti yasaklamak",
        "Gölün çekilme alanlarını yerleşime açmak"
      ],
      cozum: "Sorun, besleyen kaynakların azalması ile çekilen suyun artmasından doğduğu için besleme ve kullanımın birlikte, sürdürülebilir biçimde planlanması gerekir (s.21-22).",
      fc: ["Sürdürülebilir su kullanımı nedir?", "Su kaynaklarının beslenme ile tüketim dengesi gözetilerek kullanılması."]
    }
  ]
});

/* ------------------------------------------------------- 2.1 */
yazKonu({
  konu_id: "cogr_10_u02_k01",
  ders: DERS, tema: 2, tema_adi: "Mekânsal Bilgi Teknolojileri",
  baslik: "2.1 CBS ve Uzaktan Algılamanın Uygulama Alanları",
  kazanim: "CBS ve uzaktan algılamaya yönelik uygulama alanlarını özetler.",
  kaynak: kaynak("31-36"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "CBS ve uzaktan algılamanın uygulama alanlarını örneklerle açıklar.",
    "AYDES'in bileşenlerini ve afet yönetimindeki işlevini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "CBS ve uzaktan algılama teknolojilerinin temel işlevi hangisidir?",
      secenekler: [
        "Mekânsal verilerden coğrafi bilgi toplamak, analiz etmek, görüntülemek ve kullanmak",
        "Yalnızca kâğıt haritaların basımını hızlandırmak",
        "Yalnızca nüfus sayım formlarını saklamak",
        "İklim olaylarını laboratuvarda deneyle üretmek"
      ],
      cozum: "Uzaktan algılama ve CBS, mekânsal verilerden elde edilen coğrafi bilgilerin toplanması, analizi, görüntülenmesi ve kullanılmasını sağlar (s.31).",
      fc: ["Coğrafi Bilgi Sistemleri nedir?", "Mekânsal veriyi toplayan, analiz eden, görüntüleyen ve kullanan teknoloji bütünü."]
    },
    {
      bi: 0,
      metin: "Ormansızlaşma ve çölleşme gibi çevresel tehditlerin belirlenmesi, CBS'nin hangi kullanım alanına girer?",
      secenekler: [
        "Çevresel analizler",
        "Tarım uygulamaları",
        "Kentsel büyüme izleme",
        "Su arzının planlanması"
      ],
      cozum: "Doğal kaynakların yönetimi, arazi kullanımı değişimlerinin izlenmesi, ormansızlaşma ve çölleşmenin belirlenmesi çevresel analizler başlığındadır (s.31).",
      fc: ["Çevresel analiz nedir?", "Arazi kullanımı değişimi ve çevresel tehditlerin CBS ile izlenip belirlenmesi."]
    },
    {
      bi: 0,
      metin: "Bitki örtüsü analizi, verimlilik değerlendirmesi ve tarımsal su kullanımının optimize edilmesi hangi alandaki uygulamalardır?",
      secenekler: [
        "Tarım uygulamaları",
        "Afet yönetimi",
        "Şehir yönetimi",
        "Çevre koruma"
      ],
      cozum: "Tarım alanlarının izlenmesi, bitki örtüsü analizi, verimlilik değerlendirmeleri ve sulama optimizasyonu tarım uygulamalarıdır (s.31).",
      fc: ["Tarımda CBS kullanımı nedir?", "Tarım alanlarının izlenmesi, verim ve sulama planlaması."]
    },
    {
      bi: 0,
      metin: "Kentsel büyümenin izlenmesi, altyapı yönetimi ve ulaşım planlaması CBS'nin hangi alanına örnektir?",
      secenekler: [
        "Şehir yönetimi",
        "Tarım uygulamaları",
        "Çevresel analizler",
        "Afet yönetimi"
      ],
      cozum: "Kentsel büyüme izleme, altyapı yönetimi ve ulaşım planlaması şehir yönetimi alanında değerlendirilir (s.31).",
      fc: ["Şehir yönetimi uygulamaları nedir?", "Kentsel büyümenin izlenmesi, altyapı ve ulaşımın CBS ile planlanması."]
    },
    {
      bi: 0,
      metin: "Su kalitesinin izlenmesi ve su kaynaklarının haritalanması hangi uygulama alanına yöneliktir?",
      secenekler: [
        "Su kaynakları yönetimi",
        "Habitat izleme",
        "Arazi kullanımı değişimi",
        "İklim modellemesi"
      ],
      cozum: "Su kalitesinin izlenmesi, su kaynaklarının haritalanması ve su arzının planlanması su kaynakları yönetimi uygulamalarıdır (s.31).",
      fc: ["Su kaynakları yönetimi nedir?", "Su kalitesinin izlenmesi, kaynakların haritalanması ve su arzının planlanması."]
    },
    {
      bi: 1,
      metin: "AYDES'in geliştirilmesinden sorumlu kurum hangisidir?",
      secenekler: [
        "Afet ve Acil Durum Yönetimi Başkanlığı (AFAD)",
        "Türkiye Bilimsel ve Teknolojik Araştırma Kurumu",
        "Meteoroloji Genel Müdürlüğü",
        "Tapu ve Kadastro Genel Müdürlüğü"
      ],
      cozum: "AYDES, T.C. İçişleri Bakanlığı Afet ve Acil Durum Yönetimi Başkanlığı (AFAD) tarafından geliştirilmiştir (s.32).",
      fc: ["Karar destek sistemi nedir?", "Afet ve acil durumlarda kaynakları yönetip karar süreçlerini destekleyen web tabanlı uygulama."]
    },
    {
      bi: 1,
      metin: "AYDES'in üç ana bileşeni hangileridir?",
      secenekler: [
        "Olay Komuta, Mekânsal Bilgi ve İyileştirme Sistemleri",
        "Harita Araçları, Coğrafi Analiz ve Rota Araçları",
        "Konum, Zaman ve Hareket kavramları",
        "Nokta, Çizgi ve Alan sembolleri"
      ],
      cozum: "AYDES; Olay Komuta Sistemi, Mekânsal Bilgi Sistemi ve İyileştirme Sistemi olarak üç ana bileşenden oluşur (s.32).",
      fc: ["AYDES nedir?", "AFAD'ın web tabanlı afet yönetim ve karar destek sistemi."]
    },
    {
      bi: 1,
      metin: "Bir afet anında olay bildirimlerinin ekiplere SMS ve e-posta ile iletilmesi AYDES'in hangi bileşeninin işidir?",
      secenekler: [
        "Olay Komuta Sistemi",
        "İyileştirme Sistemi",
        "Mekânsal Bilgi Sistemi",
        "Altlık harita servisi"
      ],
      cozum: "Olay Komuta Sistemi, afet anında bildirimlerin ekiplere iletilmesini ve hizmet gruplarının iletişimde kalmasını sağlar (s.33).",
      fc: ["Olay Komuta Sistemi'nin işlevi nedir?", "Afet ve acil durumlarda hazırlık, müdahale ve iletişimin yönetilmesini sağlar."]
    },
    {
      bi: 1,
      metin: "AYDES'in Mekânsal Bilgi Sistemi bileşeninin afet yönetimindeki işlevi hangisidir?",
      secenekler: [
        "Afet öncesi, esnası ve sonrasında mekânsal sorgu ve analizle hızlı karar verilmesini sağlamak",
        "Hasar tespitinden sonra hak sahipliğini belirlemek",
        "Sadece depremlerin büyüklüğünü ölçmek",
        "Ekiplerin telefon numaralarını arşivlemek"
      ],
      cozum: "Mekânsal Bilgi Sistemi, CBS teknolojileriyle mekânsal sorgu ve analiz yapılmasına ve hızlı karar verilmesine imkân tanır (s.34).",
      fc: ["Mekânsal Bilgi Sistemi nedir?", "Afet verisini CBS ile sorgulayıp analiz ederek karar desteği üreten bileşendir."]
    },
    {
      bi: 1,
      metin: "Hasar tespit, hak sahipliği ve yer seçimi gibi afet sonrası süreçler AYDES'in hangi bileşeninde yürütülür?",
      secenekler: [
        "İyileştirme Sistemi",
        "Olay Komuta Sistemi",
        "Mekânsal Bilgi Sistemi",
        "Altlık yönetim aracı"
      ],
      cozum: "İyileştirme Sistemi, afet sonrası iyileştirme çalışmalarının CBS destekli yürütülmesini ve bu süreçlerin aksamamasını hedefler (s.35).",
      fc: ["İyileştirme Sistemi nedir?", "Afet sonrası hasar tespiti ve hak sahipliği süreçlerini CBS destekli yürüten bileşendir."]
    }
  ]
});

/* ------------------------------------------------------- 2.2 */
yazKonu({
  konu_id: "cogr_10_u02_k02",
  ders: DERS, tema: 2, tema_adi: "Mekânsal Bilgi Teknolojileri",
  baslik: "2.2 Mekânsal Verilerin Haritalara Aktarılması",
  kazanim: "Mekânsal bilgi teknolojilerini kullanarak altlık haritalar üzerinde mekânsal veriler oluşturur.",
  kaynak: kaynak("37-40"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Mekânsal veri ile mekânsal olmayan veriyi ayırt eder.",
    "Mekânsal verileri nokta, çizgi ve alan sembolleriyle haritaya aktarır."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir özelliğin nerede olduğunu ifade eden veri türü hangisidir?",
      secenekler: [
        "Mekânsal veri",
        "Mekânsal olmayan veri",
        "Tanıtıcı veri",
        "Betimleyici veri"
      ],
      cozum: "Mekânsal veri, herhangi bir özelliğin konumunu (nerede olduğunu) ifade eder (s.37).",
      fc: ["Mekânsal veri nedir?", "Bir özelliğin konumunu, yani nerede bulunduğunu ifade eden veridir."]
    },
    {
      bi: 0,
      metin: "Bir okulun öğrenci sayısı, kuruluş yılı ve türü gibi bilgiler hangi veri grubuna girer?",
      secenekler: [
        "Mekânsal olmayan veri",
        "Mekânsal veri",
        "Vektör veri",
        "Konum verisi"
      ],
      cozum: "Mekânsal olmayan veri, belirli bir konuma sahip özellik hakkında tanıtıcı bilgileri ifade eder (s.37).",
      fc: ["Mekânsal olmayan veri nedir?", "Konumu verilmeyen, özelliği tanıtan bilgilerdir."]
    },
    {
      bi: 0,
      metin: "Mekânsal verilerin haritalarda gösteriminde kullanılan üç sembol hangisidir?",
      secenekler: [
        "Nokta, çizgi, alan",
        "Daire, kare, üçgen",
        "Renk, desen, gölge",
        "Başlık, lejant, ölçek"
      ],
      cozum: "Mekânsal verilerin haritalardaki gösteriminde nokta, çizgi ve alan olmak üzere üç sembol kullanılır (s.37).",
      fc: ["Haritada mekânsal veri sembolleri nedir?", "Nokta, çizgi ve alan."]
    },
    {
      bi: 1,
      metin: "Haritaya aktarılacak okul, ev ve lokanta gibi şekli ve sınırları küçük olan mekânsal veriler için hangi sembol kullanılır?",
      secenekler: [
        "Nokta",
        "Çizgi",
        "Alan",
        "Tarama"
      ],
      cozum: "Okul, ev, lokanta gibi şekli ve sınırları küçük olan mekânsal veriler nokta ile gösterilir (s.37).",
      fc: ["Nokta sembolü ne zaman kullanılır?", "Şekli ve sınırları küçük, alan kaplamayan veriler için."]
    },
    {
      bi: 1,
      metin: "Yol ve akarsu gibi mekânsal verilerin harita üzerinde gösteriminde hangi sembol kullanılır?",
      secenekler: [
        "Çizgi",
        "Nokta",
        "Alan",
        "Nokta kümesi"
      ],
      cozum: "Yol, akarsu gibi uzanan mekânsal veriler çizgi sembolüyle gösterilir (s.37).",
      fc: ["Çizgi sembolü ne zaman kullanılır?", "Uzunluğu olan, bir hat boyunca uzanan veriler için."]
    },
    {
      bi: 1,
      metin: "Göl ve orman gibi mekânsal verilerin harita üzerinde gösteriminde hangi sembol kullanılır?",
      secenekler: [
        "Alan",
        "Nokta",
        "Çizgi",
        "Ok işareti"
      ],
      cozum: "Göl, orman gibi yayılış alanı olan mekânsal veriler alan sembolüyle gösterilir (s.37).",
      fc: ["Alan sembolü ne zaman kullanılır?", "Yayılış alanı olan, sınırları belirli yüzeyler için."]
    },
    {
      bi: 1,
      metin: "Bir grup, yakın çevresine ait park alanlarını alan, ulaşım yollarını çizgi, iş yerlerini nokta sembolüyle işaretlemiştir. Bu işlem mekânsal bilgi teknolojileriyle harita oluşturma adımlarından hangisine karşılık gelir?",
      secenekler: [
        "Mekânsal verileri kullanılacak sembollere göre tasnif etme",
        "Haritanın amacını belirleme",
        "Haritayı diğer grupların çalışmalarıyla karşılaştırma",
        "Dijital harita uygulamalarını inceleme"
      ],
      cozum: "Verilerin nokta, çizgi ve alan sembollerine göre ayrılması tasnif adımıdır (s.37).",
      fc: ["Tasnif nedir?", "Mekânsal verilerin gösterilecekleri sembollere göre ayrılmasıdır."]
    },
    {
      bi: 1,
      metin: "Uydu görüntüsü altlığı üzerine park, konut ve yol verilerinin işlendiği bir çalışmada kullanılan veri türü hangisidir?",
      secenekler: [
        "Vektör veri",
        "Mekânsal olmayan veri",
        "Tanıtıcı veri",
        "Sayısal olmayan veri"
      ],
      cozum: "Uydu görüntüsü üzerine nokta, çizgi ve alan biçiminde eklenen veriler vektör veridir (s.38).",
      fc: ["Vektör veri nedir?", "Nokta, çizgi ve alan geometrisiyle tanımlanan sayısal veridir."]
    },
    {
      bi: 1,
      metin: "Harita oluşturma çalışmasında gözlemci olarak seçilen öğrencinin işlevi hangisidir?",
      secenekler: [
        "Kendi haritasını diğer grupların çalışmalarıyla karşılaştırıp güncellemeyi sağlamak",
        "Haritadaki tüm sembolleri rastgele değiştirmek",
        "Verileri toplamadan haritayı çizmek",
        "Grubun yerine kararı tek başına vermek"
      ],
      cozum: "Gözlemci aracılığıyla harita diğer grupların çalışmalarıyla karşılaştırılıp güncellenir (s.37).",
      fc: ["Gözlemcinin görevi nedir?", "Haritayı diğer çalışmalarla karşılaştırıp güncellemeyi sağlamak."]
    },
    {
      bi: 1,
      metin: "Harita oluşturmadan önce amaç belirlemenin gerekliliği hangisiyle açıklanır?",
      secenekler: [
        "Haritanın amacı hangi mekânsal verilerin toplanacağını ve nasıl gösterileceğini belirler",
        "Amaç belirlenmezse sembol sayısı artar",
        "Amaç yalnızca haritanın rengini belirler",
        "Amaç belirlemek ölçek seçimini gereksiz kılar"
      ],
      cozum: "Etkinlikte önce haritanın amacı belirlenmekte, ardından amaca uygun mekânsal veriler toplanıp sembollerle tasnif edilmektedir (s.37).",
      fc: ["Harita amacı ile veri seçimi arasındaki ilişki nedir?", "Amaç, hangi verinin toplanacağını ve gösterileceğini belirler."]
    },
    {
      bi: 0,
      metin: "Okul, ev ve lokanta gibi şekli ve sınırları küçük olan mekânsal verilerin gösteriminde hangi sembol kullanılır?",
      secenekler: ["Nokta", "Çizgi", "Alan", "Yüzey"],
      cozum: "Şekli ve sınırları küçük olan mekânsal veriler (okul, ev, lokanta) haritada nokta sembolüyle gösterilir (s.37).",
      fc: ["Nokta sembolü nedir?", "Şekli ve sınırları küçük mekânsal verilerin haritada gösterimi."]
    },
    {
      bi: 0,
      metin: "Akarsu ve yol gibi uzunluğu öne çıkan mekânsal verilerin gösteriminde hangi sembol kullanılır?",
      secenekler: ["Çizgi", "Nokta", "Alan", "Lejant"],
      cozum: "Yol ve akarsu gibi uzanan mekânsal veriler haritada çizgi sembolüyle gösterilir (s.37).",
      fc: ["Çizgi sembolü nedir?", "Yol ve akarsu gibi uzanan mekânsal verilerin gösterimi."]
    },
    {
      bi: 1,
      metin: "Bir öğrencinin adı, doğum yeri ve okuduğu bölüm gibi bilgiler mekânsal veri açısından nasıl adlandırılır?",
      secenekler: ["Mekânsal olmayan veri", "Mekânsal veri", "Vektör veri", "Raster veri"],
      cozum: "Konum bildirmeyen, bir özellik hakkında tanıtıcı bilgi veren veriler mekânsal olmayan veridir (s.37).",
      fc: ["Mekânsal olmayan veri nedir?", "Konum bildirmeyen, tanıtıcı bilgi veren veri."]
    },
    {
      bi: 1,
      metin: "Uydu görüntüsü üzerine nokta, çizgi ve alan olarak eklenen harita verilerine ne ad verilir?",
      secenekler: ["Vektör veri", "Raster veri", "Lejant", "Ölçek"],
      cozum: "Uydu görüntüsü üzerinde nokta, çizgi ve alan biçiminde tanımlanan veriler vektör veri olarak adlandırılır (s.38).",
      fc: ["Vektör veri nedir?", "Nokta, çizgi ve alan olarak tanımlanan harita verisi."]
    }
  ]
});
