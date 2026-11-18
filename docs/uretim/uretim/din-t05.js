#!/usr/bin/env node
/* Din Kültürü ve Ahlak Bilgisi 10 · Tema 5 (İslam düşüncesinde itikadi-siyasi ve
   fıkhi yorumlar) havuzları.
   Kaynak: MEB Din Kültürü ve Ahlak Bilgisi 10 ders kitabı (2025). */
"use strict";

const { yaz, konuBasligiYaz } = require("../yazicilar/yaz.js");

const KAYNAK = "MEB Din Kültürü ve Ahlak Bilgisi 10 ders kitabı (2025)";

/* ---------------------------------------------------------------- 5.1 */
yaz("din_10_t05_c01", KAYNAK + ", s.144-149", [
  {
    si: 0,
    metin: "Din ile dinî yorum arasındaki temel fark hangisidir?",
    secenekler: [
      "Din tektir ve vahye dayanır; yorum birden fazla olabilir ve insan görüşüne dayanır",
      "Din bölgeseldir; yorum ise evrenseldir",
      "Din değişebilir; yorum ise hiç değişmez",
      "Din yalnızca kabul edenleri bağlar; yorum herkesi bağlar"
    ],
    dogru: 0,
    cozum: "Din tektir, evrenseldir, vahye dayanır ve hükümleri değişmez; dinî yorum ise birden fazla olabilir, bölgeseldir, insan görüşüne dayanır ve değişebilir.",
    fc: ["Dinî yorumun tanımı nedir?", "İnsanların tarihsel süreçte dinî metinleri esas alarak ortaya koydukları görüş, düşünce ve uygulamalardır."]
  },
  {
    si: 0,
    metin: "Dinî yorum farklılıklarının ortaya çıkmasında insan kaynaklı sebepler hangileridir?",
    secenekler: [
      "Eğitim düzeyi, ilgi, kabiliyet, ihtiyaç ve beklentilerin farklı olması",
      "Vahyin sona ermesi ve peygamberlerin vefatı",
      "Coğrafi koşullar ve iklim",
      "Kur’an’ın belli bir dönemde indirilmesi"
    ],
    dogru: 0,
    cozum: "İnsanların eğitimi, bilgi düzeyi, ilgileri, kabiliyetleri, ihtiyaç ve beklentileri farklı olduğundan İslam’ı anlama ve yorumlamada çeşitli görüşler doğmuştur.",
    fc: ["İnsan kaynaklı sebebin tanımı nedir?", "Bireylerin eğitim, bilgi, ilgi ve ihtiyaçlarındaki farklılıklardan doğan yorum ayrılıklarıdır."]
  },
  {
    si: 0,
    metin: "Coğrafi ve kültürel sebeplerin dinî yoruma etkisine örnek olarak hangisi verilir?",
    secenekler: [
      "Endonezya’da Arap alfabesine harf eklenerek Câvî alfabesinin doğması",
      "Kur’an’ın 23 yılda indirilmesi",
      "Ayetlerin muhkem ve müteşabih olarak ayrılması",
      "Vahiy katiplerinin ayetleri kaydetmesi"
    ],
    dogru: 0,
    cozum: "İslam’ın farklı coğrafyalara yayılması, bölgesel kültürlerle etkileşime yol açmış; Endonezya’da Câvî alfabesi ve yerel mimari özellikleri taşıyan camiler ortaya çıkmıştır.",
    fc: ["Câvî alfabesinin ortaya çıkış nedeni nedir?", "Arap alfabesine Endonezya bölgesine özgü beş yeni harfin eklenmesidir."]
  },
  {
    si: 0,
    metin: "Hz. Peygamber döneminde büyük çapta yorum farklılığı görülmemesinin nedeni hangisidir?",
    secenekler: [
      "Ayetlerin iniş sebeplerinin bilinmesi ve anlaşılmayan konularda Peygambere sorulması",
      "Ayetlerin yalnızca yazıyla aktarılması",
      "Sahabilerin farklı bölgelere dağılmış olması",
      "Dinî metinlerin henüz tamamlanmamış olması"
    ],
    dogru: 0,
    cozum: "Vahyin ilk muhatapları ayetlerin iniş sebeplerini biliyor, anlamadıkları noktalarda Hz. Peygamber’e başvuruyordu; bu da yorum ayrılığını sınırlı tutuyordu.",
    fc: ["Vahyin ilk muhataplarının avantajı nedir?", "Ayetlerin iniş sebeplerini bilmeleri ve anlaşılmayan konuları Hz. Peygamber’e sormalarıdır."]
  },
  {
    si: 1,
    metin: "Sahabilerin vefatının dinî yorum farklılıklarıyla ilişkisi nasıl açıklanır?",
    secenekler: [
      "Ayetlerin iniş ortamını bilenler azaldıkça metinlerin yorumu öne çıkmıştır",
      "Sahabilerin vefatı Kur’an’ın değişmesine yol açmıştır",
      "Sahabilerin görüşleri bütünüyle unutulmuştur",
      "Yorum farklılıkları bu dönemde tamamen sona ermiştir"
    ],
    dogru: 0,
    cozum: "Hz. Peygamber’in ve sahabilerin vefatıyla Müslümanların elinde dinî metinler kalmış; yorum, metinler üzerinden yapıldığı için farklı anlayışlar ortaya çıkmıştır.",
    fc: ["Sahabi kavramının tanımı nedir?", "Hz. Peygamber’i görüp ona iman ederek Müslüman olarak yaşamış kişilerdir."]
  },
  {
    si: 1,
    metin: "Al-i İmran suresinin 7. ayetine göre ayetlerin muhkem ve müteşabih olarak ayrılması yorum farklılığını nasıl etkiler?",
    secenekler: [
      "Anlamı kapalı ayetlerin yorumlanması farklı anlayışlara kapı açar",
      "Bütün ayetlerin anlamı eşit ölçüde kapalı kalır",
      "Ayetlerin yorumlanması bütünüyle yasaklanır",
      "Muhkem ayetler hiç okunmaz"
    ],
    dogru: 0,
    cozum: "Muhkem ayetler anlamı açık ve yoruma gerek olmayan ayetlerdir; müteşabih ayetlerin anlamı ise herkesçe aynı biçimde kavranmadığından farklı yorumlara açılabilir.",
    fc: ["Muhkem ayetin tanımı nedir?", "Anlamı açık, yoruma gerek olmayan, okunduğunda anlaşılan ayetlerdir."]
  },
  {
    si: 1,
    metin: "Dinî metinlerin yaklaşık 23 yılda parça parça indirilmesi yorum farklılıklarına nasıl etki eder?",
    secenekler: [
      "Ayetlerin farklı olay ve ihtiyaçlara cevap vermesi, bağlamın önemini artırır",
      "Metnin bütünlüğü bozulduğu için yorum imkânsız hâle gelir",
      "Her ayetin anlamı birbirinin aynısı olur",
      "Ayetler arasında hiçbir ilişki kurulamaz"
    ],
    dogru: 0,
    cozum: "Ayetler kimi zaman sorulan bir soruya, kimi zaman bir ihtiyaca cevap olarak indirilmiştir; iniş bağlamını bilmek yorumu etkiler.",
    fc: ["Ayetlerin iniş sebebi ne demektir?", "Bir ayetin hangi olay, soru veya ihtiyaç üzerine indirildiğini belirten bağlamdır."]
  },
  {
    si: 2,
    metin: "Dinî yorum farklılıklarının sebeplerine bütüncül bakıldığında hangi sonuca ulaşılır?",
    secenekler: [
      "Sebepler tek başına değil, birbirini etkileyen bir bütün hâlinde işler",
      "Yalnızca coğrafya belirleyicidir",
      "Yalnızca insan faktörü belirleyicidir",
      "Sebepler arasında hiçbir ilişki yoktur"
    ],
    dogru: 0,
    cozum: "İnsan, metin ve coğrafya kaynaklı sebepler birbirini etkiler; yorum farklılığı bu etkileşimin sonucudur.",
    fc: ["Bütüncül bakışın anlamı nedir?", "Olayı tek bir sebebe indirgemeden, sebeplerin karşılıklı etkileşimini birlikte değerlendirmektir."]
  },
  {
    si: 2,
    metin: "Yorum farklılıklarını “din ayrılığı” olarak değerlendirmek neden yanlıştır?",
    secenekler: [
      "Yorumlar aynı dinin metinlerini anlama biçimleridir ve inanç esaslarında ortaktır",
      "Yorumlar dinin kendisinden bütünüyle bağımsızdır",
      "Her yorum ayrı bir peygambere dayanır",
      "Yorumlar yalnızca coğrafi bölgeyi ilgilendirir"
    ],
    dogru: 0,
    cozum: "Dinî yorum, dinin temel kaynaklarını anlama çabasıdır; yorumlar farklılaşsa da ortak inanç esasları korunur.",
    fc: ["Dinî yorumun sınırı nedir?", "Temel dinî kaynaklara ve inanç esaslarına bağlı kalmaktır."]
  },
  {
    si: 2,
    metin: "Bir öğrencinin farklı yorumları incelerken takınması gereken tutum hangisidir?",
    secenekler: [
      "Yorumları kaynaklarına ve gerekçelerine göre değerlendirmek",
      "Kendi görüşüne uymayan yorumları yok saymak",
      "Bütün yorumları aynı saymak",
      "Yorumları yalnızca kulaktan dolma bilgiyle öğrenmek"
    ],
    dogru: 0,
    cozum: "Farklı yorumlar incelenirken her birinin dayandığı kaynak ve gerekçeler dikkate alınmalı; önyargıyla değerlendirme yapılmamalıdır.",
    fc: ["Önyargının tanımı nedir?", "Bir konu hakkında yeterli bilgi edinmeden önceden oluşturulmuş yargıdır."]
  }
]);

/* ---------------------------------------------------------------- 5.2 */
yaz("din_10_t05_c02", KAYNAK + ", s.150-158", [
  {
    si: 0,
    metin: "İtikadi-siyasi mezhepler ile fıkhi mezheplerin doğuş kaynağı hangisidir?",
    secenekler: [
      "İlki inanç konularındaki, ikincisi ibadet ve hükümlerdeki yorum farklılıkları",
      "İlki ibadetlerdeki, ikincisi inanç konularındaki yorum farklılıkları",
      "İkisi de yalnızca siyasi olaylardan doğmuştur",
      "İkisi de coğrafi koşullardan doğmuştur"
    ],
    dogru: 0,
    cozum: "İtikadi-siyasi mezhepler inanç konularının ayrıntılarındaki yorum farklılıklarından; fıkhi mezhepler ise ibadetler ve dinî hükümlerdeki yorum farklılıklarından doğmuştur.",
    fc: ["Mezhep kavramının tanımı nedir?", "Dinî konuların anlaşılmasında ortaya çıkan ve sistemleşen yorum yollarıdır."]
  },
  {
    si: 0,
    metin: "Ehlisünnet bünyesindeki itikadi mezhepler hangileridir?",
    secenekler: ["Matüridilik ve Eşarilik", "Caferilik ve Zeydilik", "Hanefilik ve Şafiilik", "Mutezile ve Haricilik"],
    dogru: 0,
    cozum: "Ehlisünnet görüşüne bağlı itikadi mezhepler Matüridilik ve Eşariliktir; Hanefilik ve Şafiilik ise fıkhi mezheplerdir.",
    fc: ["Ehlisünnet kavramının anlamı nedir?", "Hz. Peygamber’in ve sahabilerin yolunu izleyen, sünnet etrafında birleşen çoğunluktur."]
  },
  {
    si: 0,
    metin: "Şia mezhebinin Ehlisünnet’ten ayrılan temel görüşü hangisidir?",
    secenekler: [
      "Halifeliğin Hz. Ali ve soyundan gelen imamlara ait olması",
      "Kur’an’ın yalnızca akılla yorumlanması",
      "İbadetlerin bütünüyle terk edilmesi",
      "Mezheplerin tamamen reddedilmesi"
    ],
    dogru: 0,
    cozum: "Şia, Hz. Peygamber’in vefatından sonra halifenin Hz. Ali olması gerektiğini savunur; ayrıca On İki İmam inancını benimser.",
    fc: ["On İki İmam inancının tanımı nedir?", "Hz. Ali’nin soyundan gelen imamların meşru liderler sayılması ve günah işlemeyeceğine inanılmasıdır."]
  },
  {
    si: 1,
    metin: "Eşarilik ile Matüridiliğin iman anlayışı arasındaki fark hangisidir?",
    secenekler: [
      "Eşarilik imanı kalp ile tasdik sayarken Matüridilik tasdik ve ikrarı birlikte esas alır",
      "Eşarilik imanı reddeder, Matüridilik kabul eder",
      "İkisi de imanı yalnızca dil ile ikrar sayar",
      "İkisi de imanın artıp eksileceğini savunur"
    ],
    dogru: 0,
    cozum: "Bilgi tablosuna göre Eşarilikte iman kalp ile tasdiktir; Matüridilikte ise iman kalp ile tasdik ve dil ile ikrardır.",
    fc: ["Tasdik kavramının tanımı nedir?", "Kalbin bir bilgiyi doğrulaması, onu gönülden kabul etmesidir."]
  },
  {
    si: 1,
    metin: "Hanefilik ile Malikiliğin hüküm çıkarma yöntemi arasındaki benzerlik hangisidir?",
    secenekler: [
      "İkisi de Kur’an ve sünneti temel kaynak kabul eder",
      "İkisi de yalnızca akla dayanır",
      "İkisi de yalnızca örfe dayanır",
      "İkisi de hadisleri bütünüyle dışlar"
    ],
    dogru: 0,
    cozum: "Bütün fıkhi mezhepler hükmü öncelikle Kur’an ve sünnetten çıkarır; kıyas, icma ve örf gibi ek ölçütlerde farklılaşır.",
    fc: ["Kıyas kavramının tanımı nedir?", "Hükmü açıkça belirtilmeyen bir konuyu, benzerliği olan bir başka konunun hükmüne göre değerlendirmektir."]
  },
  {
    si: 1,
    metin: "İmam Malik’in Medine halkının uygulamalarına özel önem vermesinin nedeni hangisidir?",
    secenekler: [
      "Medine halkının Hz. Peygamber’in gösterdiği doğrultuda yaşamış olması",
      "Medine’de hiç hadis bulunmaması ve sünnetin bilinmemesi",
      "Medine’nin başkent olması ve yönetim merkezi sayılması",
      "Medine’de yalnızca kıyas kullanılması ve içtihadın önemsenmemesi"
    ],
    dogru: 0,
    cozum: "Medine halkı Hz. Peygamber’in yaşadığı dönemde onun gösterdiği doğrultuda hayatını şekillendirmişti; İmam Malik bu uygulamayı önemli bir kaynak sayar.",
    fc: ["Malikiliğin temel eserinin adı nedir?", "el-Muvatta’dır; temel hadis kaynaklarından biridir."]
  },
  {
    si: 2,
    metin: "Bir fıkhi mezhebin görüşü, temel dinî bilgi kaynakları ölçüt alınarak incelenirken neye bakılır?",
    secenekler: [
      "Görüşün Kur’an ve sünnetle uyumu ve dayandığı gerekçeler",
      "Mezhebin mensuplarının sayısı ve yaygınlığı",
      "Kurucunun doğduğu şehir ve yaşadığı dönem",
      "Eserin basım yılı ve yayınevi bilgisi"
    ],
    dogru: 0,
    cozum: "İnceleme, görüşün temel kaynaklarla uyumuna ve ileri sürülen gerekçelerin sağlamlığına bakılarak yapılır; mensup sayısı ölçüt değildir.",
    fc: ["İctihadın tanımı nedir?", "Dinî bir hüküm konusunda, kaynaklara dayanarak çaba gösterip görüş ortaya koymaktır."]
  },
  {
    si: 2,
    metin: "Caferiliğin ortaya çıkışı ve yayıldığı bölgeler hangisinde birlikte verilmiştir?",
    secenekler: [
      "Cafer Sadık’ın görüşleri etrafında şekillenmiş; İran, Irak, Bahreyn ve Lübnan’da yayılmıştır",
      "Ahmed bin Hanbel’in görüşleri etrafında şekillenmiş; Bağdat’ta yayılmıştır",
      "Ebu Hanife’nin görüşleri etrafında şekillenmiş; Kufe’de yayılmıştır",
      "Muhammed bin İdris Şafii’nin görüşleri etrafında şekillenmiş; Mısır’da yayılmıştır"
    ],
    dogru: 0,
    cozum: "Caferilik, on iki imamın altıncısı Cafer Sadık’ın görüşleri etrafında şekillenmiş ve Şia’nın fıkıh alanındaki yorumu olarak bilinir.",
    fc: ["Cafer Sadık’ın mezhep tarihindeki yeri nedir?", "On iki imamın altıncısıdır; Caferilik mezhebi onun görüşleri etrafında şekillenmiştir."]
  },
  {
    si: 3,
    metin: "İtikadi-siyasi ve fıkhi yorumları karşılaştıran bir öğrenci hangi ortak noktayı belirleyebilir?",
    secenekler: [
      "Her ikisi de dinî metinleri anlama çabasından doğmuştur",
      "Her ikisi de aynı hükümleri verir",
      "Her ikisi de peygamberlerin sayısını tartışır",
      "Her ikisi de ibadetleri ortadan kaldırır"
    ],
    dogru: 0,
    cozum: "Mezhepler farklı alanlara yoğunlaşsa da temel kaynakları anlama ve yorumlama çabası ortaktır.",
    fc: ["Mezhepler arası ortak zemin nedir?", "Kur’an ve sünneti esas alan yorum geleneğidir."]
  },
  {
    si: 3,
    metin: "Bir konuşmacı “Mezhepler birbirini bütünüyle reddeder.” demiştir. Bu ifadenin eksik yönü hangisidir?",
    secenekler: [
      "Mezheplerin temel inanç ve ibadet konularında ortak yönlerinin bulunması",
      "Mezheplerin yalnızca coğrafyaya göre ayrılması",
      "Mezheplerin hiçbir kaynağa dayanmaması",
      "Mezheplerin sadece günümüzde ortaya çıkması"
    ],
    dogru: 0,
    cozum: "Mezhepler yorum ayrıntılarında farklılaşsa da temel inanç esasları ve ibadetlerin özünde ortaktır; bu nedenle birbirini bütünüyle reddettikleri söylenemez.",
    fc: ["Mezhepler arası farklılığın sınırı nedir?", "İnanç esasları değil, ayrıntılardaki yorum ve uygulama farklılıklarıdır."]
  }
]);

/* ---------------------------------------------------------------- 5.3 */
yaz("din_10_t05_c03", KAYNAK + ", s.159-163", [
  {
    si: 0,
    metin: "“Ey insanlar! Şüphe yok ki biz, sizi bir erkek ve bir dişiden yarattık…” ayeti hangi sure ve ayettir?",
    secenekler: ["Hucurat 13", "Nahl 90", "İsra 36", "Nisa 58"],
    dogru: 0,
    cozum: "Ayet Hucurat suresinin 13. ayetidir; insanların aynı kökten geldiğini ve üstünlüğün takvayla ölçüldüğünü bildirir.",
    fc: ["Hucurat suresi 13. ayetin konusu nedir?", "İnsanların bir erkek ve bir dişiden yaratılması, boylara ayrılış amacı ve üstünlüğün takva ile olmasıdır."]
  },
  {
    si: 0,
    metin: "Hucurat suresi 13. ayette insanların boylara ve kabilelere ayrılmasının amacı nasıl açıklanır?",
    secenekler: [
      "Birbirlerini tanımaları ve dayanışmaları için",
      "Birbirleriyle kavga etmeleri için",
      "Birbirlerini inkâr etmeleri için",
      "Üstünlük yarışı yapmaları için"
    ],
    dogru: 0,
    cozum: "Ayete göre boylar ve kabileler tanışmak, yardımlaşmak ve dayanışmak içindir; birbirini görmezden gelmek için değil.",
    fc: ["Ayetteki “tearüf” kavramının anlamı nedir?", "Birbirini tanıma, karşılıklı olarak bilme ve anlamadır."]
  },
  {
    si: 1,
    metin: "Ayette üstünlük ölçütü olarak belirtilen kavram hangisidir?",
    secenekler: ["Takva", "Soy", "Servet", "Cinsiyet"],
    dogru: 0,
    cozum: "Ayette Allah katında en değerli olanın O’na karşı gelmekten en çok sakınan, yani takva sahibi olan olduğu bildirilir.",
    fc: ["Ayetin üstünlük ölçütü nedir?", "Takvadır; Allah’a karşı sorumluluk bilinciyle hareket edip O’na karşı gelmekten sakınmaktır."]
  },
  {
    si: 1,
    metin: "Aynı ayetin bir mealinde “en değerli”, başka bir mealinde “en üstün” ifadesi kullanılmıştır. Bu durum mealden yararlanırken neyi gösterir?",
    secenekler: [
      "Meallerde kelime tercihi değişebildiği için anlamın bütününe bakmak gerektiğini",
      "Ayetin yalnızca tek bir mealinden okunmasının yeterli olduğunu",
      "Meal okumanın ayetin anlamını bozduğunu, bu yüzden okunmaması gerektiğini",
      "Ayetin anlamının yalnızca Arapça bilenlerce kavranabileceğini"
    ],
    dogru: 0,
    cozum: "Meallerde kelime tercihleri çevirmene göre değişebilir; bu nedenle ayetin mesajını anlamak için tek bir sözcüğe bağlı kalmak yerine anlamın bütününe ve farklı meallerdeki karşılıklarına bakmak gerekir.",
    fc: ["Kur’an meali okurken anlam bütününe bakmanın gerekçesi nedir?", "Meallerde kelime tercihleri değişebildiği için tek sözcüğe bağlı kalmak ayetin mesajını daraltabilir; anlam bütünü esas alınır."]
  },
  {
    si: 2,
    metin: "Hucurat suresi 13. ayette geçen konular hangi başlıklar altında sınıflandırılabilir?",
    secenekler: [
      "İnsanların ortak kökeni, tanışma amacı ve üstünlük ölçütü",
      "İbadetlerin vakitleri ve sayıları",
      "Ticaretin hükümleri ve ölçüleri",
      "Mirasın paylaşım esasları"
    ],
    dogru: 0,
    cozum: "Ayet üç konuyu birlikte ele alır: ortak köken, boyların tanışma amacı ve takvaya dayalı üstünlük ölçütü.",
    fc: ["Ayetin üç ana konusu nedir?", "Ortak köken, tanışma amacı ve takvaya dayalı üstünlüktür."]
  },
  {
    si: 2,
    metin: "Ayette üstünlük ölçütü olarak sayılanlar arasında hangisi yer almaz?",
    secenekler: ["Boy ve kabile farklılığı", "Cinsiyet farklılığı", "Dil ve ırk farklılığı", "Soy farklılığı"],
    dogru: 0,
    cozum: "Ayet, cinsiyet, dil, ırk ve soy gibi farklılıkları üstünlük vesilesi saymaz; üstünlüğü yalnız takvaya bağlar.",
    fc: ["Ayete göre üstünlük vesilesi olmayan nedir?", "Doğuştan gelen cinsiyet, dil, ırk ve soy gibi özelliklerdir."]
  },
  {
    si: 3,
    metin: "Ayetten hareketle “asabiyet” hakkında hangi çıkarım yapılabilir?",
    secenekler: [
      "Soy üstünlüğü iddiası ayetin ölçütüyle çelişir",
      "Asabiyet ayetin önerdiği bir tutumdur",
      "Asabiyet yalnızca ekonomik bir sorundur",
      "Asabiyet toplumsal barışı güçlendirir"
    ],
    dogru: 0,
    cozum: "Asabiyet, aynı soydan gelenlerin üstünlüğünü savunmaktır; ayet ise üstünlüğü takvaya bağladığı için bu anlayışla çelişir.",
    fc: ["Asabiyetin tanımı nedir?", "Aynı soydan gelenlerin diğerlerinden üstün olduğunu savunan tutumdur."]
  },
  {
    si: 3,
    metin: "Veda Hutbesi’ndeki “Beyazın siyaha üstünlüğü yoktur.” ifadesi ayetin hangi mesajını destekler?",
    secenekler: [
      "İnsanlar arasında doğuştan gelen farklılıkların üstünlük sayılmamasını",
      "Üstünlüğün yalnızca soy ile belirlenmesini",
      "İnsanların birbirinden uzak durmasını",
      "Kabile bağlarının koparılmasını"
    ],
    dogru: 0,
    cozum: "Veda Hutbesi, bütün insanların aynı atadan geldiğini ve üstünlüğün yalnız takvayla olduğunu bildirerek ayetin mesajını pekiştirir.",
    fc: ["Veda Hutbesi’nin ana mesajı nedir?", "İnsanların eşitliği ve üstünlüğün yalnız takva ile olduğudur."]
  },
  {
    si: 4,
    metin: "Hucurat suresi 13. ayetin mesajını kendi cümleleriyle ifade eden cümle hangisidir?",
    secenekler: [
      "“İnsanları soyuna göre değil, sorumluluk bilincine göre değerlendirmeliyim.”",
      "“Kendi kabilemi diğerlerinden üstün görmeliyim.”",
      "“Farklı dillerden insanlarla tanışmaktan kaçınmalıyım.”",
      "“İnsanlar arasındaki farklılıklar üstünlük yarışı içindir.”"
    ],
    dogru: 0,
    cozum: "Ayet, insanların ortak kökten geldiğini ve üstünlüğün takvada olduğunu bildirir; bu mesajı yansıtan cümle ilkidir.",
    fc: ["Ayetin günlük hayata yansıması nedir?", "İnsanlara soy, dil veya cinsiyet ayrımı yapmadan değer vermektir."]
  },
  {
    si: 4,
    metin: "Ayetin mesajını öğrenci panosuna taşıyan bir sınıfın hazırladığı başlık hangisi olabilir?",
    secenekler: [
      "“Tanışmak için farklıyız, üstünlük takvadadır.”",
      "“Soy üstünlüğü gerçektir.”",
      "“Kabileler birbirinden uzak durmalıdır.”",
      "“Dil farklılığı üstünlük sebebidir.”"
    ],
    dogru: 0,
    cozum: "Ayet farklılıkların tanışma amacı taşıdığını ve üstünlüğün takvada olduğunu bildirir; başlık bu iki vurguyu birleştirir.",
    fc: ["Ayetin başlık olarak özeti nedir?", "Farklılıklar tanışmak içindir; üstünlük takvadadır."]
  }
]);

/* Uygulama bu havuzu konu başlığıyla arar (bkz. yaz.js · konuBasligiYaz). */
konuBasligiYaz("din_10_t05_c03", "Din Kültürü > 5.3 Kur'an'dan Mesajlar");
