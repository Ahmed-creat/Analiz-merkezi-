#!/usr/bin/env node
/* Felsefe 10 · Ünite 3-9 havuzları (Varlık, Bilgi, Ahlak, Estetik, Siyaset, Din, Bilim).
   Kaynak: MEB Felsefe 10 ders kitabı (2025). JSON sayfa = basılı sayfa + 1. */
"use strict";

const { yaz } = require("../yazicilar/yaz.js");

const KAYNAK = "MEB Felsefe 10 ders kitabı (2025)";

/* ---------------------------------------------------------------- 3. Varlık */
yaz("fel_10_t03_c01", KAYNAK + ", s.69-82", [
  {
    si: 0,
    metin: "MÖ 6. yüzyıldan itibaren varlığın temel özelliklerini, yapısını ve var olma biçimlerini inceleyen disiplinin adı nedir?",
    secenekler: ["Ontoloji", "Epistemoloji", "Aksiyoloji", "Estetik"],
    dogru: 0,
    cozum: "Varlığı ve var olma biçimlerini konu edinen disiplin ontoloji, yani varlık felsefesidir.",
    fc: ["Ontolojinin konusu nedir?", "Varlığın temel özelliklerini, yapısını ve var olma biçimlerini inceleyen disiplindir."]
  },
  {
    si: 0,
    metin: "Dış dünyadaki nesne ve olayların insan bilincinde beliren görünüşünü ifade eden kavram hangisidir?",
    secenekler: ["Fenomen", "İdea", "Töz", "Oluş"],
    dogru: 0,
    cozum: "Fenomen, dış dünyadaki nesne ve olayların insan bilincinde beliren görünüşüdür; idea ise düşünmeyle kavranan özdür.",
    fc: ["Fenomenin tanımı nedir?", "Dış dünyadaki nesne ve olayların insan bilincinde beliren görünüşüdür."]
  },
  {
    si: 1,
    metin: "Parmenides’in varlığı değişmez, bölünemez ve sonsuz saymasının arkasındaki gerekçe hangisidir?",
    secenekler: [
      "Yokluğun düşünülemez olması",
      "Duyuların bize yokluğu göstermesi",
      "Varlığın sürekli oluş içinde bulunması",
      "İdealar dünyasının ayrı olması"
    ],
    dogru: 0,
    cozum: "Parmenides’e göre yokluk düşünülemeyeceği için varlık başlangıçsız, sonsuz ve bölünemezdir; değişim de yokluğu gerektirir.",
    fc: ["Parmenides’in varlık anlayışı nedir?", "Varlığın bir, değişmez, sonsuz ve bölünemez olduğu görüşüdür."]
  },
  {
    si: 1,
    metin: "Gorgias’ın varlık hakkındaki görüşü hangi sonuca ulaşır?",
    secenekler: [
      "Varlık yoktur; olsa da bilinemez ve aktarılamaz",
      "Varlık vardır ve duyularla kesin olarak bilinir",
      "Varlık yalnızca Tanrı’dan taşan bir sudur",
      "Varlık ideası değişmez ve birdir"
    ],
    dogru: 0,
    cozum: "Gorgias üç aşamalı savıyla varlığın bulunmadığını, bulunsa bile bilinemeyeceğini ve bilinenin başkasına aktarılamayacağını öne sürer.",
    fc: ["Varlığın bilinemezliğini savunan sofistin üç aşamalı argümanının içeriği nedir?", "Varlık yoktur; olsa da bilinemez, bilinse de başkasına aktarılamaz."]
  },
  {
    si: 1,
    metin: "“Varlık var mıdır?” tartışması felsefe tarihinde hangi iki akımın doğmasına yol açmıştır?",
    secenekler: ["Nihilizm ve realizm", "İdealizm ve materyalizm", "Düalizm ve monizm", "Fenomenoloji ve oluş"],
    dogru: 0,
    cozum: "Varlığın var olup olmadığı tartışması nihilizm ve realizmi; varlığın ne olduğu tartışması ise idealizm, materyalizm gibi akımları doğurmuştur.",
    fc: ["Nihilizmin varlık görüşü nedir?", "Tözsel anlamda varlığın var olduğunu reddeden görüştür."]
  },
  {
    si: 2,
    metin: "Parmenides’in “düşünce ile varlık birdir” yargısını temellendirdiği öncül aşağıdakilerden hangisidir?",
    secenekler: [
      "Var olmayanın düşünülemeyeceği",
      "Düşüncenin duyulardan doğduğu",
      "Varlığın sürekli değiştiği",
      "İdeaların akılda doğuştan bulunduğu"
    ],
    dogru: 0,
    cozum: "Parmenides, var olmayanı düşünmenin imkânsız olduğu öncülünden hareketle düşünülen her şeyin bir varlık temeli olması gerektiği sonucuna varır.",
    fc: ["Parmenides’in temel öncülü nedir?", "Var olmayanın düşünülemeyeceği öncülüdür."]
  },
  {
    si: 2,
    metin: "Hegel’e göre tinin tez, antitez ve sentez süreciyle evreni meydana getirmesi hangi görüşün temelini oluşturur?",
    secenekler: [
      "Diyalektik idealizm",
      "Mekanik materyalizm",
      "Düalist töz anlayışı",
      "Fenomenolojik yöntem"
    ],
    dogru: 0,
    cozum: "Hegel, düşünsel nitelikli tinin çatışma yoluyla gelişerek evreni oluşturduğunu savunur; bu yaklaşım diyalektik idealizm olarak adlandırılır.",
    fc: ["Diyalektik idealizmin tanımı nedir?", "Tin’in tez-antitez-sentez süreciyle evreni oluşturduğunu savunan görüştür."]
  },
  {
    si: 2,
    metin: "İbni Sina’nın varlıkları zorunlu ve mümkün varlıklar olarak ayırması hangi sonuca dayanır?",
    secenekler: [
      "Mümkün varlıkların varlığı için zorunlu bir nedene ihtiyaç duymasına",
      "Bütün varlıkların ezelî ve ebedî olmasına",
      "Maddenin bilinçten önce gelmesine",
      "Varlığın sürekli oluş hâlinde bulunmasına"
    ],
    dogru: 0,
    cozum: "İbni Sina’ya göre değişen ve yok olan mümkün varlıkların var olabilmesi için varlığı kendinden olan zorunlu bir varlık gerekir.",
    fc: ["Zorunlu varlığın tanımı nedir?", "Varlığı kendinden olan, ezelî-ebedî ve bir olan varlıktır."]
  },
  {
    si: 3,
    metin: "Bir varlık felsefesi metninde “töz” kavramının farklı anlamlarda kullanılması hangi soruna yol açar?",
    secenekler: [
      "Kavram kayması ve çelişki doğurmasına",
      "Argümanın daha güçlü olmasına",
      "Metnin kısalmasına",
      "Sonucun kesinleşmesine"
    ],
    dogru: 0,
    cozum: "Aynı kavramın farklı anlamlarda kullanılması, öncüller arasındaki bağı koparır ve argümanı çelişkili hâle getirir.",
    fc: ["Kavram kaymasının tanımı nedir?", "Bir kavramın metin boyunca farklı anlamlarda kullanılmasıdır."]
  },
  {
    si: 3,
    metin: "Varlık felsefesi metinlerinde argümanların dayandığı öncülleri belirlemek ne sağlar?",
    secenekler: [
      "Savın gücünün ve sınırlarının değerlendirilmesini",
      "Metnin yazarının belirlenmesini",
      "Kavramların sayısının azalmasını",
      "Tartışmanın sona ermesini"
    ],
    dogru: 0,
    cozum: "Öncüller görünür olduğunda savın hangi kabuller üzerine kurulduğu anlaşılır ve argümanın sağlamlığı sınanabilir.",
    fc: ["Öncülleri belirlemenin yararı nedir?", "Savın hangi kabullere dayandığını görünür kılıp sağlamlığını sınamayı sağlar."]
  }
]);

/* ---------------------------------------------------------------- 4. Bilgi */
yaz("fel_10_t04_c01", KAYNAK + ", s.90-106", [
  {
    si: 0,
    metin: "17. yüzyıldan itibaren bilginin yapısını, kaynağını, sınırlarını ve doğruluk ölçütlerini inceleyen disiplinin adı nedir?",
    secenekler: ["Epistemoloji", "Ontoloji", "Aksiyoloji", "Teoloji"],
    dogru: 0,
    cozum: "Bilgiyi konu edinen ve bilginin imkânını, kaynağını, sınırlarını inceleyen disiplin epistemoloji, yani bilgi felsefesidir.",
    fc: ["Epistemolojinin konusu nedir?", "Bilginin yapısını, kaynağını, sınırlarını ve doğruluk ölçütlerini inceleyen disiplindir."]
  },
  {
    si: 0,
    metin: "Bilgiyi bilgi olmayandan ayıran temel ölçüt aşağıdakilerden hangisidir?",
    secenekler: [
      "Doğruluğunun kanıtlanabilmesi ve gerekçelendirilmesi",
      "İfade edilmesinin kolay olması",
      "Bir kişi tarafından savunulması",
      "Günlük yaşamda işe yaraması"
    ],
    dogru: 0,
    cozum: "Bilgi, doğruluğu kanıtlanabilen ve gerekçelendirilebilen bir düşünce ürünüdür; kişisel kanı ise bu ölçütleri karşılamaz.",
    fc: ["Bilginin tanımı nedir?", "Doğruluğu kanıtlanabilen ve gerekçelendirilebilen düşünce ürünüdür."]
  },
  {
    si: 1,
    metin: "Şüphecilere göre kesin bilgiye ulaşmanın imkânsız olmasının gerekçesi hangisidir?",
    secenekler: [
      "Duyusal algıların yanıltıcı olabilmesi",
      "Akıl yürütmenin hiç kullanılmaması",
      "Bilginin doğuştan gelmesi",
      "Varlığın bütünüyle yok sayılması"
    ],
    dogru: 0,
    cozum: "Duyular farklı zamanlarda çelişkili bilgiler verebildiği için şüpheciler kesin ve herkesçe kabul edilebilir bilgiye ulaşılamayacağını savunur.",
    fc: ["Şüpheciliğin tanımı nedir?", "Kesin ve herkesçe kabul edilebilecek bilgilere ulaşmanın mümkün olmadığını savunan görüştür."]
  },
  {
    si: 1,
    metin: "Descartes’ın şüpheciliğini septiklerin yaklaşımından ayıran temel fark hangisidir?",
    secenekler: [
      "Şüpheyi kesin bilgiye ulaşmak için araç olarak kullanması",
      "Bütün bilgileri doğuştan kabul etmesi",
      "Duyuları tek bilgi kaynağı sayması",
      "Bilgi arayışından tümüyle vazgeçmesi"
    ],
    dogru: 0,
    cozum: "Descartes her şeyden şüphe ederek sarsılmaz bir başlangıç noktası arar; şüphe onun için amaç değil yöntemdir.",
    fc: ["Metodik şüpheciliğin tanımı nedir?", "Kesin bilgiye ulaşmak için şüpheyi araç olarak kullanan yaklaşımdır."]
  },
  {
    si: 1,
    metin: "Rasyonalizm ile empirizmin bilginin kaynağı konusundaki temel ayrımı hangisidir?",
    secenekler: [
      "Biri aklı, diğeri deneyi kaynak sayar",
      "Biri sezgiyi, diğeri vahyi kaynak sayar",
      "İkisi de duyuları tek kaynak sayar",
      "İkisi de bilgiyi reddeder"
    ],
    dogru: 0,
    cozum: "Rasyonalizm bilginin kaynağını akıl, empirizm ise duyu deneyi ve gözlem olarak kabul eder.",
    fc: ["Empirizmin tanımı nedir?", "Bilginin kaynağının deney ve gözlem olduğunu savunan görüştür."]
  },
  {
    si: 2,
    metin: "17-18. yüzyıl İngiliz felsefesinde savunulan empirizme göre bilginin kaynağı nedir?",
    secenekler: ["Duyu deneyi ve gözlem", "Doğuştan gelen ideler", "Sezgisel kavrayış", "Vahiy ve kutsal metin"],
    dogru: 0,
    cozum: "Empirizm, zihnin doğuşta boş olduğunu ve bilginin duyu deneyi ile gözlemden geldiğini savunur.",
    fc: ["Empirizmin bilgi kaynağı nedir?", "Duyu deneyi ve gözlemdir."]
  },
  {
    si: 2,
    metin: "Kant’ın 18. yüzyılda geliştirdiği kritisizme göre bilgi nasıl oluşur?",
    secenekler: [
      "Deneyin sağladığı malzemenin aklın kalıplarıyla işlenmesiyle",
      "Yalnızca akıl yürütmeyle, deneye hiç başvurmadan",
      "Yalnızca duyularla, aklın hiç katkısı olmadan",
      "Sezgiyle doğrudan kavranarak"
    ],
    dogru: 0,
    cozum: "Kritisizmde bilgi, deneyden gelen içerik ile aklın düzenleyici formlarının birlikte çalışmasıyla ortaya çıkar.",
    fc: ["Kritisizmin tanımı nedir?", "Bilgide hem deneyin hem aklın rolü olduğunu savunan görüştür."]
  },
  {
    si: 2,
    metin: "Descartes’ın “Düşünüyorum, öyleyse varım.” çıkarımı hangi bilgi türüne örnektir?",
    secenekler: [
      "Apaçık ve kesin bilgi",
      "Deneysel bilgi",
      "Sanıya dayalı bilgi",
      "Sezgisel ama yanıltıcı bilgi"
    ],
    dogru: 0,
    cozum: "Descartes bu çıkarımı, şüphe edilemeyecek apaçık bir bilgi olarak görür ve felsefesini onun üzerine kurar.",
    fc: ["Apaçık bilginin tanımı nedir?", "Açık ve seçik, kendisinden şüphe edilemeyecek kesin bilgidir."]
  },
  {
    si: 3,
    metin: "Doğruluk ölçütlerinden biri, önermelerin birbiriyle çelişmemesini esas alır. Bu ölçütün sınırlılığı hangisidir?",
    secenekler: [
      "Kendi içinde tutarlı ama yanlış sistemleri doğru sayabilmesi",
      "Hiçbir sistemde uygulanamaması",
      "Yalnızca deneyle çalışması",
      "Önermeler arası bağı hiç aramaması"
    ],
    dogru: 0,
    cozum: "Bir önermeler bütünü kendi içinde çelişkisiz olabilir; ancak bu, bütünün gerçekliğe uyduğu anlamına gelmez.",
    fc: ["Tutarlılık ölçütünün tanımı nedir?", "Önermelerin birbirleriyle çelişmemesi ve aralarında mantıksal bağ bulunmasıdır."]
  },
  {
    si: 3,
    metin: "Bir metinde “sanı” ile “bilgi” ayrımının belirsizleşmesi hangi sonucu doğurur?",
    secenekler: [
      "Gerekçelendirme ölçütünün kaybolması",
      "Bilginin daha güvenilir olması",
      "Duyuların öneminin artması",
      "Şüphenin tamamen ortadan kalkması"
    ],
    dogru: 0,
    cozum: "Sanı kişisel kanıya, bilgi ise gerekçelendirmeye dayanır; ayrım kaybolunca hangi yargının gerekçeli olduğu anlaşılmaz.",
    fc: ["Sanının tanımı nedir?", "Gerekçelendirilmemiş, kişisel kanıya dayalı yargıdır."]
  }
]);

/* ---------------------------------------------------------------- 5. Ahlak */
yaz("fel_10_t05_c01", KAYNAK + ", s.113-126", [
  {
    si: 0,
    metin: "İnsanların toplumsal davranışlarını düzenleyen yazısız kurallar toplamına ne ad verilir?",
    secenekler: ["Ahlak", "Hukuk", "Görgü", "Estetik"],
    dogru: 0,
    cozum: "Ahlak, insanların toplumsal davranışlarını düzenleyen ve iyiye yönlendirmeyi amaçlayan yazısız kurallar bütünüdür.",
    fc: ["Ahlakın tanımı nedir?", "İnsanların toplumsal davranışlarını düzenleyen yazısız kurallar toplamıdır."]
  },
  {
    si: 0,
    metin: "Antik Çağ’dan bu yana ahlakı felsefi açıdan inceleyen, ahlaki yargıların ölçütlerini araştıran disiplin hangisidir?",
    secenekler: ["Etik", "Estetik", "Ontoloji", "Teoloji"],
    dogru: 0,
    cozum: "Ahlak felsefesi, diğer adıyla etik; ahlakın ne olduğunu, ahlaki davranışın ölçütlerini ve temelini felsefi biçimde inceler.",
    fc: ["Etik nedir?", "Ahlakı ve ahlaki yargıların ölçütlerini felsefi açıdan inceleyen disiplindir."]
  },
  {
    si: 1,
    metin: "Sokrates, Platon ve Aristoteles’in iyi anlayışında temel ölçüt hangisidir?",
    secenekler: [
      "İnsana mutluluk vermesi ve bunun bilgiye dayanması",
      "İnsana haz vermesi",
      "Topluma en çok faydayı sağlaması",
      "Ödev bilinciyle yapılması"
    ],
    dogru: 0,
    cozum: "Bu filozoflar iyiyi mutlulukla, mutluluğu da bilgiyle ilişkilendirir; ahlakın temelinde bilgiyi görürler.",
    fc: ["Sokrates’in ahlak anlayışının temeli nedir?", "Mutluluğun bilgiye dayandığı, bilerek kötülük yapılamayacağı görüşüdür."]
  },
  {
    si: 1,
    metin: "Evrensel ahlak yasasının varlığını reddeden görüş hangi gerekçeye dayanır?",
    secenekler: [
      "Ahlaki değerlerin topluma, insana ve zamana göre değişmesi",
      "Bütün toplumların aynı değerleri paylaşması",
      "Ahlakın yalnızca hukukla düzenlenmesi",
      "İnsanın hiçbir zaman değer üretmemesi"
    ],
    dogru: 0,
    cozum: "Ahlaki değerlerin toplumdan topluma ve dönemden döneme değiştiği gözlemi, evrensel bir ahlak yasasının imkânını tartışmalı kılar.",
    fc: ["Ahlaki göreliliğin tanımı nedir?", "Ahlaki değerlerin topluma, insana ve zamana göre değiştiğini savunan görüştür."]
  },
  {
    si: 1,
    metin: "Kant’a göre bir eylemin ahlaki değeri neye bağlıdır?",
    secenekler: [
      "Ödev bilinciyle, çıkar gözetmeden yapılmasına",
      "Sonucunda haz sağlamasına",
      "Topluma fayda getirmesine",
      "Toplumun onaylamasına"
    ],
    dogru: 0,
    cozum: "Kant için ahlaki değer eylemin sonucunda değil, ödevden dolayı yapılmasında aranır.",
    fc: ["Kant’ın ahlak ölçütü nedir?", "Eylemin çıkar gözetmeden, ödev bilinciyle yapılmasıdır."]
  },
  {
    si: 2,
    metin: "Determinist görüşün özgürlük-sorumluluk tartışmasındaki etkisi hangisidir?",
    secenekler: [
      "Eylemler belirlenmişse sorumluluğun nasıl kurulacağını tartışmalı kılması",
      "İnsanın eylemlerinden hiç sorumlu tutulmamasını sağlaması",
      "Özgürlüğün koşulsuz kabul edilmesini getirmesi",
      "Ahlakın bütünüyle gereksiz sayılması"
    ],
    dogru: 0,
    cozum: "Determinizm eylemleri nedenlere bağladığı için, insanın yaptığından sorumlu tutulup tutulamayacağı ayrıca gerekçelendirilmek zorundadır.",
    fc: ["Determinizmin tanımı nedir?", "Bütün olay ve eylemlerin önceki nedenlerce belirlendiğini savunan görüştür."]
  },
  {
    si: 2,
    metin: "19. yüzyılda geliştirilen faydacılığın ahlaki ölçütü nedir?",
    secenekler: [
      "En çok kişiye en çok fayda sağlayan eylem",
      "Yalnızca bireyin kendi çıkarına hizmet eden eylem",
      "Haz veren her türlü davranış",
      "Ödev bilinciyle yapılan eylem"
    ],
    dogru: 0,
    cozum: "Faydacılık, bir eylemin ahlaki değerini toplumun toplam faydasını artırma gücüne bağlar.",
    fc: ["Faydacılığın tanımı nedir?", "İnsana ve topluma fayda sağlayan eylemi iyi sayan ahlak görüşüdür."]
  },
  {
    si: 2,
    metin: "Hazcı ahlak anlayışına yöneltilen temel eleştiri aşağıdakilerden hangisidir?",
    secenekler: [
      "Haz veren her eylemin iyi sayılamayacağı",
      "Hazzın hiçbir zaman yaşanmadığı",
      "Hazcılığın bilgiyi temel alması",
      "Hazcılığın ödeve aşırı vurgu yapması"
    ],
    dogru: 0,
    cozum: "Kısa vadeli haz veren bazı eylemler uzun vadede zarar verebildiği için haz, ahlaki iyinin tek ölçütü olamaz.",
    fc: ["Hazcılığın tanımı nedir?", "İnsana haz veren şeylerin iyi olduğunu savunan ahlak görüşüdür."]
  },
  {
    si: 3,
    metin: "Bir ahlak metninde “iyi” kavramının hem sonuç hem niyet anlamında kullanılması hangi soruna yol açar?",
    secenekler: [
      "Kavram kayması ve yargının belirsizleşmesi",
      "Argümanın kanıtlanması",
      "Ahlaki ölçütün kesinleşmesi",
      "Metnin kısalması"
    ],
    dogru: 0,
    cozum: "Aynı kavramın iki farklı anlamda kullanılması, yargının hangi ölçüte dayandığını belirsizleştirir ve akıl yürütmeyi zayıflatır.",
    fc: ["Ahlak metninde kavram kaymasının sonucu nedir?", "Yargının hangi ölçüte dayandığının belirsizleşmesidir."]
  },
  {
    si: 3,
    metin: "Ahlak metinlerinde filozofların argümanlarını karşılaştırmak ne kazandırır?",
    secenekler: [
      "Görüşlerin dayandığı gerekçelerin ayırt edilmesini",
      "Bütün filozofların aynı sonuca varmasını",
      "Ahlakın hukuka dönüşmesini",
      "Kavramların ortadan kalkmasını"
    ],
    dogru: 0,
    cozum: "Karşılaştırma, aynı sonuca farklı gerekçelerle varılabildiğini gösterir ve görüşlerin güçlü-zayıf yönlerini değerlendirmeyi sağlar.",
    fc: ["Karşılaştırmalı okumanın yararı nedir?", "Görüşlerin dayandığı gerekçeleri ve güçlü-zayıf yönleri ayırt etmeyi sağlar."]
  }
]);

/* ---------------------------------------------------------------- 6. Estetik */
yaz("fel_10_t06_c01", KAYNAK + ", s.133-146", [
  {
    si: 0,
    metin: "Güzellik kavramını ve bu kavramın insan üzerindeki etkilerini inceleyen felsefe disiplini hangisidir?",
    secenekler: ["Estetik", "Etik", "Ontoloji", "Epistemoloji"],
    dogru: 0,
    cozum: "Estetik, güzelliği ve estetik deneyimin insan üzerindeki etkilerini inceleyen felsefe disiplinidir.",
    fc: ["Estetiğin konusu nedir?", "Güzellik kavramı ve estetik deneyimin insan üzerindeki etkileridir."]
  },
  {
    si: 0,
    metin: "Bir nesneye çıkar gözetmeksizin yalnızca estetik bir bakış açısıyla yaklaşmaya ne ad verilir?",
    secenekler: ["Estetik tavır", "Estetik haz", "Estetik yargı", "Estetik değer"],
    dogru: 0,
    cozum: "Estetik tavır, nesneye yarar veya çıkar gözetmeden yalnızca güzellik açısından yaklaşma tutumudur.",
    fc: ["Estetik tavrın tanımı nedir?", "Nesneye çıkar gözetmeksizin yalnızca estetik bakışla yaklaşma tutumudur."]
  },
  {
    si: 1,
    metin: "Bir öğrenci, bir heykelin güzelliğini “parçaların uyumu ve ölçülü olması” diye açıklayan filozofun ölçütlerini araştırıyor. Bu filozofa göre güzel olan hangi ölçütlerle belirlenir?",
    secenekler: [
      "Düzen, oran ve sınırlılığa uygunluk",
      "Karşılık beklemeksizin hoşa gitme",
      "Mutluluk veren ifade olma",
      "Doğanın birebir kopyalanması"
    ],
    dogru: 0,
    cozum: "Aristoteles güzeli düzen, oran ve sınırlılık ölçütlerine uygun olan biçiminde tanımlar.",
    fc: ["Aristoteles’in güzellik tanımı nedir?", "Düzen, oran ve sınırlılık ölçütlerine uygun olandır."]
  },
  {
    si: 1,
    metin: "Kant’a göre güzel, hangi özelliğiyle tanımlanır?",
    secenekler: [
      "Karşılık beklemeksizin hoşa giden",
      "Yalnızca ölçü ve oranla belirlenen",
      "Toplumsal fayda sağlayan",
      "Duyuları doyuran"
    ],
    dogru: 0,
    cozum: "Kant güzeli, herhangi bir çıkar veya karşılık gözetmeksizin hoşa giden olarak tanımlar.",
    fc: ["Kant’ın güzellik tanımı nedir?", "Karşılık beklemeksizin hoşa gidendir."]
  },
  {
    si: 1,
    metin: "Ortak estetik yargıların imkânı tartışması hangi soruya odaklanır?",
    secenekler: [
      "Farklı kişilerin aynı estetik yargıya varıp varamayacağına",
      "Sanat eserlerinin kaça satılacağına",
      "Sanatçının hangi teknikle çalıştığına",
      "Müzelerin nasıl kurulduğuna"
    ],
    dogru: 0,
    cozum: "Tartışma, estetik yargıların öznel mi olduğu yoksa herkes için geçerli bir ortak zemin bulunup bulunmadığı sorusuna dayanır.",
    fc: ["Ortak estetik yargının tanımı nedir?", "Farklı kişilerin aynı estetik nesne hakkında benzer yargıya varmasıdır."]
  },
  {
    si: 2,
    metin: "Sanatı taklit olarak gören görüş ile ifade olarak gören görüş arasındaki temel ayrım hangisidir?",
    secenekler: [
      "Doğayı yansıtma ile iç dünyayı aktarma arasındaki fark",
      "Eserin fiyatı ile ünü arasındaki fark",
      "Sanatçının yaşı ile tekniği arasındaki fark",
      "Müze ile atölye arasındaki fark"
    ],
    dogru: 0,
    cozum: "Taklit görüşü sanatı doğanın yansıtılması, ifade görüşü ise duygu ve düşüncelerin dışa vurulması olarak açıklar.",
    fc: ["Sanatta taklit görüşünün tanımı nedir?", "Sanatı, doğanın veya gerçekliğin yansıtılması olarak gören görüştür."]
  },
  {
    si: 2,
    metin: "Sanat felsefesinde, estetik bir nesneyle kurulan deneyim sırasında duyulan hoşnutluk ve tatmin duygusu hangi kavramla ifade edilir?",
    secenekler: ["Estetik haz", "Estetik tavır", "Estetik özne", "Estetik değer"],
    dogru: 0,
    cozum: "Estetik haz, estetik deneyim sırasında duyulan hoşnutluk ve tatmin duygusudur; estetik tavır ise yaklaşma biçimidir.",
    fc: ["Estetik hazzın tanımı nedir?", "Estetik deneyim sırasında duyulan hoşnutluk ve tatmin duygusudur."]
  },
  {
    si: 2,
    metin: "Bir sanat eserinin değerini yalnızca öznenin beğenisine bağlayan yaklaşımın sınırlılığı hangisidir?",
    secenekler: [
      "Ortak bir değerlendirme ölçütü kurulamaması",
      "Eserin teknik özelliklerinin öne çıkması",
      "Sanatçının kimliğinin belirlenmesi",
      "Eserin tarihinin aydınlatılması"
    ],
    dogru: 0,
    cozum: "Değer tamamen kişisel beğeniye indirgendiğinde, iki farklı yargı arasında hangisinin geçerli olduğunu belirleyecek ölçüt kalmaz.",
    fc: ["Estetik özneliğin tanımı nedir?", "Estetik yargının kişinin beğenisine dayandığını savunan görüştür."]
  },
  {
    si: 3,
    metin: "Estetik metinlerde “güzel” kavramının filozoflarca farklı tanımlanması hangi sorunu doğurur?",
    secenekler: [
      "Ortak ölçüt kurmayı güçleştirmesi",
      "Sanatın bütünüyle yok olması",
      "Estetiğin bilim olması",
      "Yargıların kesinleşmesi"
    ],
    dogru: 0,
    cozum: "Tanımlar farklı ölçütlere dayandığı için filozofların güzellik yargıları karşılaştırılırken kavramların eşleştirilmesi gerekir.",
    fc: ["Estetikte tanım çokluğunun sonucu nedir?", "Güzelliğe ilişkin ortak ölçüt kurmanın güçleşmesidir."]
  },
  {
    si: 3,
    metin: "Sanat felsefesi metinlerindeki estetik yargı örneklerini incelemek ne sağlar?",
    secenekler: [
      "Yargılardaki öznel ve nesnel öğelerin ayırt edilmesini",
      "Bütün eserlerin aynı sayılmasını",
      "Sanatçıların sayısının belirlenmesini",
      "Estetik hazzın ortadan kalkmasını"
    ],
    dogru: 0,
    cozum: "Örnek yargılar karşılaştırıldığında hangi öğenin kişisel beğeniye, hangisinin eserin özelliklerine dayandığı görülür.",
    fc: ["Estetik yargıda nesnel öğe nedir?", "Eserin kendi yapısına, uyum ve oran gibi ölçütlere dayanan öğedir."]
  }
]);

/* ---------------------------------------------------------------- 7. Siyaset */
yaz("fel_10_t07_c01", KAYNAK + ", s.154-166", [
  {
    si: 0,
    metin: "Siyaset felsefesinin temel problemleri ağırlıklı olarak hangi kavram etrafında şekillenir?",
    secenekler: ["Devlet", "Sanat", "Bilgi", "Evren"],
    dogru: 0,
    cozum: "Siyaset felsefesinde devletin kökeni, iktidarın kaynağı ve ideal düzen tartışmaları devlet kavramı etrafında toplanır.",
    fc: ["Siyaset felsefesinin konusu nedir?", "Devlet, iktidar, meşruiyet, adalet ve ideal düzen gibi konuları inceleyen disiplindir."]
  },
  {
    si: 0,
    metin: "Yönetme yetkisinin ilahi bir güç tarafından verildiğine dayanan meşruiyet anlayışı hangisidir?",
    secenekler: ["Teokrasi", "Aristokrasi", "Monarşi", "Demokrasi"],
    dogru: 0,
    cozum: "Teokraside yönetici, ilahi iradeyi uygulamakla yükümlü sayılır ve iktidarın meşruiyeti Tanrı iradesine dayandırılır.",
    fc: ["Teokrasinin tanımı nedir?", "Yönetme yetkisinin ilahi bir güçten geldiğine inanılan yönetim biçimidir."]
  },
  {
    si: 1,
    metin: "Aristoteles, insanın doğası gereği topluluk içinde yaşadığını söyleyerek devletin kaynağını açıklar. Bu yaklaşımın dayanağı hangisidir?",
    secenekler: [
      "İnsanın doğası gereği topluluk içinde yaşaması",
      "İnsanların sözleşmeyle bir araya gelmesi",
      "Devletin yalnızca savaşla kurulması",
      "Yöneticilerin soylu aileden gelmesi"
    ],
    dogru: 0,
    cozum: "Bu yaklaşıma göre insan doğal olarak toplumsal bir varlıktır; devlet de bu doğal eğilimin zorunlu bir sonucudur.",
    fc: ["Doğal devlet yaklaşımının tanımı nedir?", "Devletin insan doğasından doğan zorunlu bir kurum olduğunu savunan görüştür."]
  },
  {
    si: 1,
    metin: "Hobbes, Locke ve Rousseau devletin insanların karşılıklı anlaşmasıyla doğduğunu savunur. Bu yaklaşımın temel savı hangisidir?",
    secenekler: [
      "Devletin insanların karşılıklı anlaşmasıyla kurulduğu",
      "Devletin Tanrı tarafından kurulduğu",
      "Devletin aileden doğal olarak doğduğu",
      "Devletin ortadan kaldırılamayacağı"
    ],
    dogru: 0,
    cozum: "Yapay devlet yaklaşımı, insanların güvenlik ve düzen için kendi iradeleriyle bir sözleşme kurduğunu öne sürer.",
    fc: ["Yapay devlet yaklaşımının tanımı nedir?", "Devletin insanların anlaşmasıyla kurulan yapay bir kurum olduğunu savunan görüştür."]
  },
  {
    si: 1,
    metin: "Ütopya ile distopya arasındaki temel fark hangisidir?",
    secenekler: [
      "Biri ideal düzeni, diğeri baskı ve korku düzenini betimler",
      "Biri gerçek, diğeri tarihî bir yeri anlatır",
      "İkisi de aynı toplumu anlatır",
      "Biri yalnızca şiirle yazılır"
    ],
    dogru: 0,
    cozum: "Ütopya gerçekleşmesi istenen ideal düzeni hayal ederken distopya adaletsizlik, baskı ve özgürlük kısıtlaması üzerine kurulu düzeni anlatır.",
    fc: ["Distopyanın tanımı nedir?", "Baskı, adaletsizlik ve özgürlük kısıtlaması üzerine kurulu düzeni betimleyen eserdir."]
  },
  {
    si: 2,
    metin: "Aristoteles’e göre yönetimin seçkinlere bırakılması gerektiği görüşü hangi gerekçeye dayanır?",
    secenekler: [
      "Yönetimin bilgi ve deneyim gerektiren ciddi bir iş olması",
      "Halkın yönetimden hiç etkilenmemesi",
      "Soyluluğun tek erdem sayılması",
      "Yönetimin kura ile belirlenmesi"
    ],
    dogru: 0,
    cozum: "Aristoteles yönetimi herkese bırakılamayacak kadar ciddi bir iş sayar; bilgi sahibi seçkinlerin yönetmesi gerektiğini savunur.",
    fc: ["Aristokrasinin tanımı nedir?", "Yönetme yetkisinin seçkin bir gruba ait olduğu yönetim biçimidir."]
  },
  {
    si: 2,
    metin: "İktidarın kaynağı konusunda tanrı temelli ve insan temelli yaklaşımların ayrımı hangisidir?",
    secenekler: [
      "Meşruiyetin ilahi iradeye ya da insan iradesine dayanması",
      "Yönetimin tek kişide ya da kurulda olması",
      "Devletin küçük ya da büyük olması",
      "Ordunun güçlü ya da zayıf olması"
    ],
    dogru: 0,
    cozum: "Tanrı temelli yaklaşım iktidarın meşruiyetini ilahi iradeye, insan temelli yaklaşım ise halkın iradesi veya sözleşmeye dayandırır.",
    fc: ["İktidarın meşruiyeti nedir?", "Yönetme yetkisinin hangi gerekçeyle haklı sayıldığıdır."]
  },
  {
    si: 2,
    metin: "Ütopyaların siyaset felsefesindeki işlevi hangisidir?",
    secenekler: [
      "Var olan düzeni eleştirip ideal düzeni tartışmaya açması",
      "Devleti ortadan kaldırması",
      "Tarihî olayları belgelemesi",
      "Ekonomik verileri hesaplaması"
    ],
    dogru: 0,
    cozum: "Ütopyalar olmayan bir düzeni betimleyerek mevcut düzenin eksiklerini görünür kılar ve ideal düzen tartışmasını başlatır.",
    fc: ["Ütopyanın tanımı nedir?", "Gerçekleşmesi mümkün olmayan, ideal toplumsal düzeni betimleyen hayalî tasarımdır."]
  },
  {
    si: 3,
    metin: "Bir siyaset metninde “özgürlük” kavramının hem bireysel hem toplumsal anlamda kullanılması hangi güçlüğe yol açar?",
    secenekler: [
      "Kavram kayması ve yargının belirsizleşmesi",
      "Argümanın daha kolay kanıtlanması",
      "Metnin tarihî değerinin artması",
      "Devletin tanımsız kalması"
    ],
    dogru: 0,
    cozum: "Bireysel ve toplumsal özgürlük farklı içeriklere sahiptir; aynı sözcükle karşılanınca hangi anlamın kastedildiği belirsizleşir.",
    fc: ["Siyasi özgürlüğün tanımı nedir?", "Bireyin ya da toplumun iradesini dış baskı olmadan kullanabilmesidir."]
  },
  {
    si: 3,
    metin: "Siyaset felsefesi metinlerindeki argümanları değerlendirirken hangi ölçüt esas alınır?",
    secenekler: [
      "Tutarlılık ve kanıtlarla desteklenme",
      "Yazarın ünü ve siyasi görüşü",
      "Metnin uzunluğu",
      "Argümanın çoğunluk tarafından benimsenmesi"
    ],
    dogru: 0,
    cozum: "Bir siyaset argümanı, öncüllerinin tutarlılığı ve kanıtlarla desteklenmesi ölçüsünde değerlendirilir; yazarın kimliği belirleyici değildir.",
    fc: ["Argüman değerlendirmesinin ölçütü nedir?", "Tutarlılık ve kanıtlarla desteklenme durumudur."]
  }
]);

/* ---------------------------------------------------------------- 8. Din */
yaz("fel_10_t08_c01", KAYNAK + ", s.173-184", [
  {
    si: 0,
    metin: "Dinî konuları akla ve gerekçeye dayalı biçimde inceleyen, 20. yüzyılda ayrı bir disiplin olarak gelişen felsefe dalının adı nedir?",
    secenekler: ["Din felsefesi", "Teoloji", "Ontoloji", "Epistemoloji"],
    dogru: 0,
    cozum: "Din felsefesi, dinî kavram ve problemleri belirli bir dinin öğretilerine bağlı kalmadan akla dayalı gerekçelerle inceler.",
    fc: ["Din felsefesinin konusu nedir?", "Dinî kavramları, problemleri ve argümanları akla dayalı biçimde incelemektir."]
  },
  {
    si: 0,
    metin: "Dinî konuları belirli bir dinin öğretileri ışığında değerlendiren disiplin hangisidir?",
    secenekler: ["Teoloji", "Din felsefesi", "Fenomenoloji", "Aksiyoloji"],
    dogru: 0,
    cozum: "Teoloji, dinî konuları belli bir inancın verilerine dayanarak açıklarken din felsefesi akla dayalı eleştirel inceleme yapar.",
    fc: ["Teolojinin tanımı nedir?", "Dinî konuları belirli bir dinin öğretileri ışığında inceleyen disiplindir."]
  },
  {
    si: 1,
    metin: "Kozmolojik argümanın dayandığı temel öncül hangisidir?",
    secenekler: [
      "Evrendeki her şeyin bir nedeni olduğu ve bir ilk nedene ulaşılması gerektiği",
      "Evrende kusursuz bir düzen bulunduğu",
      "Tanrı’nın mükemmel bir varlık olarak tanımlandığı",
      "Evrendeki kötülüklerin Tanrı ile çeliştiği"
    ],
    dogru: 0,
    cozum: "Kozmolojik argüman nedenler zincirinin sonsuza gidemeyeceği düşüncesinden hareketle kendi kendisinin nedeni olan bir ilk nedenin varlığını savunur.",
    fc: ["Nedenler zincirinden ilk nedene ulaşmayı amaçlayan kanıtın adı nedir?", "Kozmolojik argümandır; evrendeki nedensellikten yola çıkar."]
  },
  {
    si: 1,
    metin: "Teleolojik argüman hangi gözleme dayanır?",
    secenekler: [
      "Evrende var olan kusursuz uyum ve düzen",
      "Evrenin sonsuz sayıda nedene sahip olması",
      "İnsanın ölümden sonra yaşayacağı",
      "Tanrı’nın tanımından varlığının çıkması"
    ],
    dogru: 0,
    cozum: "Teleolojik (erek) argüman, evrendeki düzenin tesadüfle açıklanamayacağını, bunun bir tasarımcı gerektirdiğini öne sürer.",
    fc: ["Teleolojik argümanın tanımı nedir?", "Evrendeki düzen ve uyumdan hareketle bir tasarımcının varlığını kanıtlamaya çalışan argümandır."]
  },
  {
    si: 1,
    metin: "Ontolojik argümanın dayandığı öncül hangisidir?",
    secenekler: [
      "Mükemmel bir varlığın var olmamasının imkânsız olması",
      "Evrende kötülüğün bulunması",
      "Her olayın bir nedeni olması",
      "Evrenin bir başlangıcının bulunması"
    ],
    dogru: 0,
    cozum: "Ontolojik argüman, Tanrı’yı mükemmel varlık olarak tanımlayıp mükemmelliğin var olmayı gerektirdiği öncülüne dayanır.",
    fc: ["Mükemmel varlık tanımından yola çıkan kanıtın adı nedir?", "Ontolojik argümandır; Tanrı’nın tanımından varlığını çıkarır."]
  },
  {
    si: 2,
    metin: "Kötülük problemi hangi ikileme dayanır?",
    secenekler: [
      "Tanrı’nın her şeye kadir ve mutlak iyi olması ile kötülüğün varlığı",
      "Evrenin sonsuz olması ile zamanın başlangıcı",
      "Ruhun ölümsüz olması ile bedenin ölümlü olması",
      "İmanın bilgiden üstün olması"
    ],
    dogru: 0,
    cozum: "Kötülük problemi, Tanrı’nın gücü ve iyiliği ile evrendeki kötülüklerin birlikte bulunmasının çelişkili görünmesine dayanır.",
    fc: ["Kötülük probleminin tanımı nedir?", "Evrendeki kötülüklerin, her şeye kadir ve iyi bir Tanrı inancıyla bağdaşmaması sorunudur."]
  },
  {
    si: 2,
    metin: "Kötülük problemine verilen “kötülük, iyiliğin bilinmesi için gereklidir” yanıtı hangi güçlüğü taşır?",
    secenekler: [
      "Aşırı ve gereksiz görünen kötülükleri açıklamakta yetersiz kalması",
      "Tanrı’nın varlığını bütünüyle kanıtlaması",
      "Evrenin sonsuz olduğunu göstermesi",
      "Ruhun ölümsüzlüğünü çürütmesi"
    ],
    dogru: 0,
    cozum: "İyiliği tanımak için ölçülü kötülük gerekli görülse de savaş, salgın gibi aşırı kötülüklerin aynı gerekçeyle açıklanması zordur.",
    fc: ["Teodisenin tanımı nedir?", "Kötülüğün varlığını Tanrı inancıyla uzlaştırmaya çalışan açıklamadır."]
  },
  {
    si: 2,
    metin: "Ruhun ölümsüzlüğü problemi hangi konularla birlikte ele alınır?",
    secenekler: [
      "Beden-ruh ilişkisi, ölüm sonrası yaşam ve ahlaki sorumluluk",
      "Evrenin genişlemesi ve kara delikler",
      "Devletin kökeni ve iktidarın meşruiyeti",
      "Sanatta güzellik ve estetik yargı"
    ],
    dogru: 0,
    cozum: "Ruhun ölümsüzlüğü tartışması, ruhun ne olduğu, bedenle ilişkisi ve eylemlerin sorumluluğunun sürekliliği sorularıyla birlikte yürütülür.",
    fc: ["Ruhun ölümsüzlüğü probleminin tanımı nedir?", "Ruhun ölümden sonra varlığını sürdürüp sürdürmediği sorusudur."]
  },
  {
    si: 3,
    metin: "Bir din felsefesi metninde kanıtlamaların inanç öğretilerine dayanması hangi sınırlılığı doğurur?",
    secenekler: [
      "Kanıtın inanmayan için ikna edici olmaması",
      "Kanıtın herkesçe zorunlu sayılması",
      "Argümanın deneyle doğrulanması",
      "Metnin bilimsel olması"
    ],
    dogru: 0,
    cozum: "Kanıt öncüllerini inanç öğretilerinden aldığında, bu öncülleri paylaşmayan bir okur için bağlayıcı bir gerekçe sunmaz.",
    fc: ["İnanca dayalı kanıtın sınırlılığı nedir?", "Öncüllerini paylaşmayanlar için ikna edici olmamasıdır."]
  },
  {
    si: 3,
    metin: "Din felsefesi metinlerinde “iman” ve “bilgi” kavramlarının karıştırılması hangi sonucu doğurur?",
    secenekler: [
      "Kanıt ile inancın ayrımının yitirilmesi",
      "Tanrı kanıtlarının güçlenmesi",
      "Evrenin sonluluğunun kanıtlanması",
      "Teolojinin felsefeye dönüşmesi"
    ],
    dogru: 0,
    cozum: "İman, kanıt gerektirmeyen bağlanma; bilgi ise gerekçelendirme ister. Ayrım kaybolunca hangi savın kanıtlandığı belirsizleşir.",
    fc: ["İmanın tanımı nedir?", "Bir düşünceye veya Tanrı’nın varlığına duyulan derin güven ve bağlılıktır."]
  }
]);

/* ---------------------------------------------------------------- 9. Bilim */
yaz("fel_10_t09_c01", KAYNAK + ", s.189-205", [
  {
    si: 0,
    metin: "20. yüzyılda bilimi konu edinen; bilimin ne olduğunu, yöntemini ve değerini sorgulayan felsefe disiplininin adı nedir?",
    secenekler: ["Bilim felsefesi", "Bilim tarihi", "Epistemoloji", "Ontoloji"],
    dogru: 0,
    cozum: "Bilim felsefesi, bilimi bir bütün olarak konu edinir; bilimsel bilginin özelliklerini, yöntemini ve sınırlarını sorgular.",
    fc: ["Bilim felsefesinin konusu nedir?", "Bilimin ne olduğu, yöntemi ve bilimsel bilginin özellikleridir."]
  },
  {
    si: 0,
    metin: "Bir alanda belirli bir dönemde geçerli olan genel kabul hangi kavramla ifade edilir?",
    secenekler: ["Paradigma", "Hipotez", "Yasa", "Kuram"],
    dogru: 0,
    cozum: "Kuhn’un kullandığı paradigma kavramı, bir alanda belirli bir dönemde geçerli olan genel kabul ve model anlamına gelir.",
    fc: ["Paradigmanın tanımı nedir?", "Bir alanda belirli bir dönemde geçerli olan genel kabuldür."]
  },
  {
    si: 1,
    metin: "Bilimsel yöntemin ilk aşaması aşağıdakilerden hangisidir?",
    secenekler: [
      "Konuyla ilgili veri toplamak için gözlem yapmak",
      "Sonuçları istatistikle sınamak",
      "Kuramı ders kitaplarına yazmak",
      "Yasayı uluslararası kurullara onaylatmak"
    ],
    dogru: 0,
    cozum: "Bilimsel yöntemde önce konuyla ilgili gözlem yapılıp veri toplanır; ardından hipotez kurulur ve deneylerle sınanır.",
    fc: ["Bilimsel yöntemin tanımı nedir?", "Bilimsel bilgiye ulaşmak için gözlem, hipotez ve deney aşamalarını izleyen yoldur."]
  },
  {
    si: 1,
    metin: "Kuhn’a göre olağan bilim döneminin sona ermesine yol açan gelişme hangisidir?",
    secenekler: [
      "Paradigmanın ortaya çıkan sorulara cevap verememesi",
      "Bilim insanlarının sayısının azalması",
      "Deney araçlarının yasaklanması",
      "Yeni bir üniversitenin kurulması"
    ],
    dogru: 0,
    cozum: "Kuhn’a göre paradigma sorulara yanıt veremez hâle gelince bunalım başlar ve olağanüstü bilim dönemiyle yeni paradigma arayışı doğar.",
    fc: ["Olağan bilim döneminin tanımı nedir?", "Belirli bir paradigmanın kabul edildiği ve soruların onunla yanıtlandığı dönemdir."]
  },
  {
    si: 1,
    metin: "Carnap’a göre bilim aşağıdakilerden hangisiyle tanımlanır?",
    secenekler: [
      "Bilim insanlarının çalışmaları sonucunda ortaya çıkan nesnel bilgiler toplamı",
      "Bilim insanının kişisel sezgilerinin ürünü",
      "Paradigmalar arasında gidip gelen bir etkinlik",
      "Yanlışlanana kadar geçici olarak doğru sayılan önermeler"
    ],
    dogru: 0,
    cozum: "Carnap bilimi, bilimsel çalışmaların ürünü olan nesnel bilgi birikimi olarak görür ve bilimin sürekli ilerlediğini kabul eder.",
    fc: ["Carnap’ın bilim anlayışı nedir?", "Bilimi nesnel bilgiler toplamı olarak gören ve ilerlemeyi esas alan anlayıştır."]
  },
  {
    si: 2,
    metin: "Popper’a göre bir önermenin bilimsel sayılmasının ölçütü hangisidir?",
    secenekler: [
      "Yanlışlanabilir olması",
      "Herkes tarafından kabul edilmesi",
      "Deneyle tümüyle doğrulanması",
      "Uzun süre değişmeden kalması"
    ],
    dogru: 0,
    cozum: "Popper bilimselliğin ölçütünü yanlışlanabilirlik olarak belirler; bir önerme sınanmaya açık değilse bilimsel sayılmaz.",
    fc: ["Yanlışlanabilirliğin tanımı nedir?", "Bir önermenin gözlem veya deneyle çürütülebilir olmasıdır."]
  },
  {
    si: 2,
    metin: "Popper’ın doğrulama yerine yanlışlamayı önermesinin gerekçesi hangisidir?",
    secenekler: [
      "“Bütün kuğular beyazdır” gibi tümel önermelerin tümüyle doğrulanamaması",
      "Gözlemin bilimde hiç kullanılmaması ve deney aracı sayılmaması",
      "Bilimin tarihsel bir süreç içinde paradigmaya bağlı gelişmesi",
      "Deneylerin her zaman kesin sonuç vermemesi ve yetersiz kalması"
    ],
    dogru: 0,
    cozum: "Tümel önermeleri doğrulamak için evrendeki tüm durumları gözlemek imkânsızdır; ancak tek bir aykırı örnek önermeyi yanlışlar.",
    fc: ["Popper’ın eleştirdiği görüş nedir?", "Bilimsel bilginin deney ve gözlemle tümüyle doğrulanabileceği görüşüdür."]
  },
  {
    si: 2,
    metin: "Kuhn’a göre bilimsel ilerleme nasıl gerçekleşir?",
    secenekler: [
      "Bir paradigmadan diğerine geçilerek",
      "Aynı paradigma içinde birikerek",
      "Deneylerin tamamen durdurulmasıyla",
      "Bilim insanlarının görüşlerinin oylanmasıyla"
    ],
    dogru: 0,
    cozum: "Kuhn bilimi doğrusal bir birikim değil, paradigma değişimleriyle ilerleyen bir süreç olarak görür.",
    fc: ["Kuhn’un bilim anlayışı nedir?", "Bilimin paradigma değişimleriyle ilerlediğini savunan görüştür."]
  },
  {
    si: 3,
    metin: "Bir bilim felsefesi metninde doğrulama ile yanlışlamanın karıştırılması hangi sonuca yol açar?",
    secenekler: [
      "Bir kuramın bilimselliğinin yanlış değerlendirilmesine",
      "Bilimsel yöntemin kısalmasına",
      "Gözlemlerin gereksiz sayılmasına",
      "Kuramın kesin olarak kanıtlanmasına"
    ],
    dogru: 0,
    cozum: "Doğrulama, önermeyi destekleyen kanıt aramak; yanlışlama ise çürütücü durum aramaktır. Karıştırılınca bir kuramın bilimsel statüsü yanlış belirlenir.",
    fc: ["Doğrulamanın tanımı nedir?", "Bir önermeyi destekleyen gözlem ve deney kanıtlarının aranmasıdır."]
  },
  {
    si: 3,
    metin: "Astroloji gibi alanların bilim sayılıp sayılmadığı tartışmasında Popper’a göre belirleyici ölçüt hangisidir?",
    secenekler: [
      "İleri sürdüğü yargıların sınanabilir olup olmaması",
      "Çok sayıda kişi tarafından izlenmesi",
      "Uzun bir geçmişinin bulunması",
      "Yazılı metinlerle aktarılması"
    ],
    dogru: 0,
    cozum: "Popper’a göre bir alanın bilimselliği, yanlışlanabilecek öngörüler üretmesine bağlıdır; her duruma uyarlanabilen yargılar bu ölçütü karşılamaz.",
    fc: ["Bilimsellik ölçütü nedir?", "İleri sürülen yargıların sınanabilir ve yanlışlanabilir olmasıdır."]
  }
]);
