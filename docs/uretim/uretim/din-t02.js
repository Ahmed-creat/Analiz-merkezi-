#!/usr/bin/env node
/* Din Kültürü ve Ahlak Bilgisi 10 · Tema 2 (Allah’ı Tanımak) havuzları.
   Kaynak: MEB Din Kültürü ve Ahlak Bilgisi 10 ders kitabı (2025). */
"use strict";

const { yaz, konuBasligiYaz } = require("../yazicilar/yaz.js");

const KAYNAK = "MEB Din Kültürü ve Ahlak Bilgisi 10 ders kitabı (2025)";

/* ---------------------------------------------------------------- 2.1 */
yaz("din_10_t02_c01", KAYNAK + ", s.46-57", [
  {
    si: 0,
    metin: "İnsanın “Beni kim yarattı, niçin yaratıldım?” gibi sorular sormasının arkasındaki temel etken hangisidir?",
    secenekler: ["Fıtratındaki merak duygusu", "Toplumsal baskı", "Ekonomik ihtiyaçlar", "Eğitim zorunluluğu"],
    dogru: 0,
    cozum: "İnsan fıtratında bulunan merak duygusuyla çevresini inceler ve olayların arka planını öğrenmek ister; varoluş soruları da bu merakın ürünüdür.",
    fc: ["Fıtrat kavramının anlamı nedir?", "İnsanın doğuştan getirdiği, yaratılışından gelen temel özellik ve eğilimleridir."]
  },
  {
    si: 0,
    metin: "Allah’ın varlığı inancının insan hayatındaki işlevi hangisidir?",
    secenekler: [
      "Hayata yön vermesi ve davranışlara ölçü kazandırması",
      "Yalnızca ibadet vakitlerini belirlemesi",
      "Toplumsal kuralları ortadan kaldırması",
      "Bilimsel araştırmaları sınırlaması"
    ],
    dogru: 0,
    cozum: "Allah inancı insanın hayatına yön verir, sosyal ilişkilerini düzenler ve hayatı bir amaç için yaşamasını sağlar.",
    fc: ["İnancın delillerle temellendirilmesinin yararı nedir?", "İnanç dünyasını güçlendirir; inanç, ibadet ve ahlak bütünlüğü sağlar."]
  },
  {
    si: 0,
    metin: "Kur’an’ın “Eğer doğru söyleyenler iseniz kesin delilinizi getirin.” buyruğu hangi tutumu teşvik eder?",
    secenekler: [
      "İnançla ilgili iddiaların kanıtlarla desteklenmesini",
      "Delil aramanın gereksiz sayılmasını",
      "İnancın sorgulanmadan kabul edilmesini",
      "Her iddianın tartışmasız doğru sayılmasını"
    ],
    dogru: 0,
    cozum: "Ayet, inançla ilgili iddiaların kesin delillerle desteklenmesi gerektiğine işaret eder.",
    fc: ["Delil kavramının tanımı nedir?", "Bir iddiayı doğrulamak için ileri sürülen kanıt ve gerekçelerdir."]
  },
  {
    si: 1,
    metin: "“Evren hareket etmektedir; her hareket edenin bir hareket ettiricisi varsa evrenin de bir hareket ettiricisi vardır.” çıkarımı hangi delile dayanır?",
    secenekler: ["Kozmolojik delil", "Teleolojik delil", "Ontolojik delil", "Dinî tecrübe delili"],
    dogru: 0,
    cozum: "Evrenden, evrenin hareketinden ve başlangıcından yola çıkan deliller kozmolojik delil olarak adlandırılır.",
    fc: ["Kozmolojik delilin tanımı nedir?", "Allah’ın varlığını evrenin hareketi ve başlangıcı gibi konulardan yola çıkarak kanıtlamaya çalışan delildir."]
  },
  {
    si: 1,
    metin: "Hudus deliline göre evrenin bir yaratıcıya muhtaç olmasının gerekçesi hangisidir?",
    secenekler: [
      "Değişen her şeyin sonradan meydana gelmiş olması",
      "Evrenin başlangıcı ve sonu bulunmayan sonsuz bir bütün olması",
      "Evrendeki maddelerin bilinçli varlıklar olarak davranması",
      "İnsanın evreni gözlemleyerek ölçümler yapabilmesi"
    ],
    dogru: 0,
    cozum: "Hudus deliline göre âlem değişmektedir; her değişen sonradan meydana gelmiştir ve sonradan olan her şey kendisini var edecek bir yaratıcıya ihtiyaç duyar.",
    fc: ["Hudus delilinin tanımı nedir?", "Âlemin değiştiği, her değişenin sonradan olduğu ve bir yaratıcıya muhtaç bulunduğu öncülüne dayanan delildir."]
  },
  {
    si: 1,
    metin: "“Yaratılanlar Allah’ın varlığına işaret eder mi?” sorusunu inceleyen öğrencinin hangi kaynağa başvurması en uygundur?",
    secenekler: [
      "Ayetler, hadisler ve evrene ilişkin gözlemler",
      "Yalnızca sosyal medyada paylaşılan kişisel yorumlar",
      "Yalnızca kendi hayal gücüyle kurduğu varsayımlar",
      "Yalnızca konuyla ilgisiz edebî romanlar"
    ],
    dogru: 0,
    cozum: "Konu, Kur’an ve sünnetin yanında evren üzerinde yapılan gözlem ve akıl yürütmeyle incelenir; bu üçü birlikte sağlam bir zemin oluşturur.",
    fc: ["Güvenilir kaynağın tanımı nedir?", "Bilgiyi doğrulanabilir biçimde sunan, konusunda yetkin ve tutarlı kaynaktır."]
  },
  {
    si: 2,
    metin: "Teleolojik delil, evreni incelerken hangi olgudan hareket eder?",
    secenekler: [
      "Evrendeki düzen ve amaçlılık",
      "İnsanın zihnindeki mükemmel varlık düşüncesi",
      "Bireysel dinî yaşantı",
      "Evrenin hareket ediyor olması"
    ],
    dogru: 0,
    cozum: "Teleolojik delil, evrende gözlemlenen düzen ve amaçlılığın bir yaratıcının varlığına işaret ettiğini savunur.",
    fc: ["Gaye ve nizam delilinin tanımı nedir?", "Evrendeki düzen ve amaçlılıktan hareketle bir yaratıcının varlığını kanıtlamaya çalışan delildir."]
  },
  {
    si: 2,
    metin: "Ontolojik delilin diğer delillerden ayrılan yönü hangisidir?",
    secenekler: [
      "Gözlem ve deneyden bağımsız, zihinsel bir faaliyete dayanması",
      "Evrendeki düzen ve amaçlılığa dayanması ve gözlemi esas alması",
      "Bireysel manevi deneyimi ve yaşanmış hisleri esas alması",
      "Evrenin hareketinden ve başlangıcından yola çıkması"
    ],
    dogru: 0,
    cozum: "Ontolojik delil, insan zihnindeki ekmel varlık düşüncesinden hareket eder; gözlem ve deneyden bağımsız bir zihinsel faaliyetin ürünüdür.",
    fc: ["Ontolojik delilin tanımı nedir?", "Allah’ın varlığını insan zihnindeki ekmel (mükemmel) varlık düşüncesinden hareketle kanıtlamaya çalışan delildir."]
  },
  {
    si: 3,
    metin: "Gazali’nin şiir ve musiki zevki örneği hangi delilin sınırlılığını açıklar?",
    secenekler: [
      "Dinî tecrübe delilinin başkalarına aktarılamamasını",
      "Kozmolojik delilin gözleme dayanmasını",
      "Ontolojik delilin zihinsel olmasını",
      "Teleolojik delilin düzene dayanmasını"
    ],
    dogru: 0,
    cozum: "Gazali, yaşanan zevkin o zevke sahip olmayanlara anlatılamayacağını söyler; dinî tecrübe de benzer biçimde bireyseldir ve başkasına olduğu gibi aktarılamaz.",
    fc: ["Dinî tecrübe delilinin tanımı nedir?", "İnanma duygusu, yaratıcıyla iletişim ve manevi deneyimlerden hareketle Allah’ın varlığını kanıtlamaya çalışan delildir."]
  },
  {
    si: 3,
    metin: "Delillerin sınıflandırılmasından hareketle hangi çıkarım yapılabilir?",
    secenekler: [
      "Deliller farklı hareket noktalarından aynı sonuca varmayı amaçlar",
      "Bütün deliller birbirinin aynısı olan tek bir kanıtı kullanır",
      "Deliller birbirini bütünüyle çürüten karşıt görüşlerdir",
      "Deliller yalnızca duyu organlarıyla yapılan gözleme dayanır"
    ],
    dogru: 0,
    cozum: "Kozmolojik, teleolojik, ontolojik ve dinî tecrübe delilleri farklı yollardan hareket eder; hepsi Allah’ın varlığını temellendirmeyi amaçlar.",
    fc: ["Delillerin ortak amacı nedir?", "Allah’ın varlığını akli gerekçelerle temellendirip inancı sağlam delillere dayandırmaktır."]
  }
]);

/* ---------------------------------------------------------------- 2.2 */
yaz("din_10_t02_c02", KAYNAK + ", s.58-67", [
  {
    si: 0,
    metin: "Ayet ve hadislerde Allah’ın isim ve sıfatlarını tespit ederken hangi yöntem izlenir?",
    secenekler: [
      "Metindeki isim ve nitelikleri belirleyip anlamlarıyla eşleştirmek",
      "Yalnızca kendi kişisel yorumunu esas alıp metni göz ardı etmek",
      "İsimleri rastgele sıralayıp anlamlarını belirsiz bırakmak",
      "Sıfatları yok sayarak yalnızca isimleri listelemek"
    ],
    dogru: 0,
    cozum: "Tespit çalışmasında metinde geçen isim ve nitelikler belirlenir, ardından bunların anlamları ve birbirleriyle ilişkileri ortaya konur.",
    fc: ["Esmayıhüsna kavramının tanımı nedir?", "Allah’a ait güzel isimleri, O’nun zatını, sıfatlarını ve fiillerini en güzel biçimde tanımlayan isimlerdir."]
  },
  {
    si: 0,
    metin: "“Allah güzeldir, güzelliği sever.” hadisinde Allah’ın hangi ismi öne çıkar?",
    secenekler: ["Cemil", "Kerim", "Aziz", "Rezzak"],
    dogru: 0,
    cozum: "Cemil “güzel” anlamına gelir; kâinatta görülen maddi ve manevi güzellikler bu ismin yansımasıdır.",
    fc: ["Cemil isminin anlamı nedir?", "Güzel demektir; kâinattaki maddi ve manevi güzellikler bu ismin yansımasıdır."]
  },
  {
    si: 0,
    metin: "“Allah’ım sen affedicisin, affı seversin beni affet” duasında Allah’ın hangi ismi zikredilir?",
    secenekler: ["Afüv", "Vedud", "Kebir", "Semi"],
    dogru: 0,
    cozum: "Afüv, “affediciliği bol olan, hataları ve günahları tamamen silip bağışlayan” demektir.",
    fc: ["Afüv isminin anlamı nedir?", "Affediciliği bol olan, hataları ve günahları tamamen silip bağışlayandır."]
  },
  {
    si: 1,
    metin: "Allah’ın Basir ismi hangi sıfatla ilişkilidir?",
    secenekler: ["Basar", "Beka", "İlim", "Tekvin"],
    dogru: 0,
    cozum: "Basir ismi, “her şeyi görmesi” anlamındaki basar sıfatından kaynaklanır; görmesi olmayan bir varlık “gören” diye nitelenemez.",
    fc: ["Basar sıfatının anlamı nedir?", "Allah’ın her şeyi görmesidir."]
  },
  {
    si: 1,
    metin: "Hay isminin kudret, tekvin ve ilim sıfatlarıyla ilişkili olmasının gerekçesi hangisidir?",
    secenekler: [
      "Bu sıfatlar olmadan bir şeye hayat vermenin mümkün olmaması",
      "Hay isminin yalnızca insanlara ait olması",
      "Kudret sıfatının diğer sıfatları kapsaması",
      "Tekvin sıfatının anlamının bilinmemesi"
    ],
    dogru: 0,
    cozum: "Kudret, ilim ve yaratma sıfatları bulunmadan bir şeye hayat vermek mümkün olmadığı için Hay ismi bu sıfatlarla birlikte düşünülür.",
    fc: ["Hay isminin anlamı nedir?", "Allah’ın diri, canlı ve her an faaliyet hâlinde olmasını ifade eder."]
  },
  {
    si: 1,
    metin: "Allah’ın görmesi ile insanın görme yetisi arasındaki benzerlik nasıl açıklanır?",
    secenekler: [
      "Yalnızca isimlendirmede benzerlik vardır; mahiyetleri farklıdır",
      "İkisi de aynı sınırlar içinde çalışır ve aynı sonucu verir",
      "İnsanın görmesi kapsam bakımından Allah’ın görmesinden üstündür",
      "İkisi arasında hiçbir ilgi bulunmadığı için karşılaştırılamaz"
    ],
    dogru: 0,
    cozum: "Basar sıfatı ile insanın görme yetisi arasında sadece isim benzerliği vardır; Allah’ın görmesi yaratılmışların görmesine benzemez.",
    fc: ["Sübuti sıfatların tanımı nedir?", "Allah’ın hayat, ilim, irade ve kudret gibi niteliklerini ifade eden, ezelî ve ebedî sıfatlardır."]
  },
  {
    si: 2,
    metin: "Zatî sıfatlar ile sübuti sıfatlar arasındaki temel fark hangisidir?",
    secenekler: [
      "Zatî sıfatlar sadece Allah’a özgüdür; sübuti sıfatlarda ad benzerliği vardır",
      "Zatî sıfatlar sonradan meydana gelmiş olup yaratılmışlara ait niteliklerdir",
      "Sübuti sıfatlar yalnızca insanlara ait olup Allah için kullanılamaz",
      "İki grup arasında içerik ve kapsam bakımından hiçbir fark yoktur"
    ],
    dogru: 0,
    cozum: "Zatî sıfatlar yalnızca Allah’ta bulunur; sübuti sıfatlarda ise yaratılmışların nitelikleriyle yalnızca isim benzerliği vardır, mahiyet benzemez.",
    fc: ["Zatî sıfatların tanımı nedir?", "Sadece Allah’ta bulunan, yaratılmışlarda benzeri olmayan; vücut, kıdem ve beka gibi sıfatlardır."]
  },
  {
    si: 2,
    metin: "Vahdaniyet sıfatı hangi anlama gelir?",
    secenekler: [
      "Allah’ın zatında, sıfatlarında ve fiillerinde bir olması",
      "Allah’ın yaratılmışlara benzememesi",
      "Allah’ın varlığının sonunun olmaması",
      "Allah’ın her şeyi işitmesi"
    ],
    dogru: 0,
    cozum: "Vahdaniyet, Allah’ın zatında, sıfatlarında ve fiillerinde tek ve bir olması anlamına gelir.",
    fc: ["Tevhit inancının sıfatlardaki karşılığı nedir?", "Vahdaniyet sıfatıdır; Allah’ın zatında, sıfatlarında ve fiillerinde bir olmasıdır."]
  },
  {
    si: 3,
    metin: "Hastalık sebebiyle dua eden bir kişinin “Şafi” ismini zikretmesi hangi ilkeye uygundur?",
    secenekler: [
      "İsimlerin bağlama uygun seçilmesine",
      "İsimlerin rastgele kullanılmasına",
      "Duanın isimsiz yapılmasına",
      "İsimlerin yalnızca yazıyla anılmasına"
    ],
    dogru: 0,
    cozum: "Şafi “şifa veren” anlamına gelir; dua eden kişinin içinde bulunduğu duruma uygun isimle Allah’a yönelmesi bağlama uygun kullanımdır.",
    fc: ["Şafi isminin anlamı nedir?", "Şifa veren demektir; hastalık sebebiyle dua eden kişi bu isimle Allah’a yönelir."]
  },
  {
    si: 3,
    metin: "Bir öğrenci kompozisyonunda Allah’ın isimlerini kullanırken hangi tutum bağlama uygundur?",
    secenekler: [
      "Ele alınan konuya uygun isim ve sıfatları seçmesi",
      "Bütün isimleri sırasız biçimde art arda yazması",
      "İsimleri günlük konuşmada gelişigüzel kullanması",
      "İsimleri yalnızca sayı olarak belirtmesi"
    ],
    dogru: 0,
    cozum: "İsim ve sıfatlar, anlamlarına ve ele alınan konuya uygun biçimde kullanıldığında anlatım tutarlı ve isabetli olur.",
    fc: ["İsim ve sıfatların metinde kullanım ölçütü nedir?", "Ele alınan konu ve bağlamla uyumlu, anlamına uygun biçimde kullanılmasıdır."]
  }
]);

/* ---------------------------------------------------------------- 2.3 */
yaz("din_10_t02_c03", KAYNAK + ", s.69-72", [
  {
    si: 0,
    metin: "Haşr suresinin 22-24. ayetleri hangi konuyu ele alır?",
    secenekler: [
      "Allah’ın isim ve sıfatlarıyla tanıtılmasını",
      "Namazın farz kılınışını ve vakitlerini",
      "Orucun hükmünü ve bozan durumları",
      "Mirasın paylaşım esaslarını ve ölçülerini"
    ],
    dogru: 0,
    cozum: "Ayetler, Allah’ın en güzel isimlerini bildirir; O’nun gaybı ve şehadeti bildiğini, hiçbir şeyin O’na ortak olamayacağını açıklar.",
    fc: ["Haşr suresinde geçen isimlerin ortak özelliği nedir?", "Allah’a ait en güzel isimlerdir; hiçbir varlık O’na bu isimlerde ortak olamaz."]
  },
  {
    si: 0,
    metin: "“Gayb” ve “şehadet” kavramları Haşr suresinin 22. ayetinde nasıl yer alır?",
    secenekler: [
      "Allah’ın gaybı da şehadeti de bildiği bildirilir",
      "Gaybın hiçbir zaman bilinemeyeceği vurgulanır",
      "Şehadetin yalnızca insanlara ait olduğu söylenir",
      "İki kavram arasında hiçbir ilişki kurulmaz"
    ],
    dogru: 0,
    cozum: "Ayette Allah’ın gaybı ve şehadeti bilen olduğu bildirilir; yani gizli ve açık her şey O’nun bilgisi dâhilindedir.",
    fc: ["Gayb kavramının tanımı nedir?", "İnsanın bilgisi dışında kalan, duyu organlarıyla algılanamayan şeylerdir."]
  },
  {
    si: 1,
    metin: "Haşr suresinin 22-24. ayetlerinde geçen isimlerden biri aşağıdakilerden hangisidir?",
    secenekler: ["Müheymin", "Rezzak", "Şekur", "Tevvab"],
    dogru: 0,
    cozum: "Müheymin, “kâinatın bütün işlerini gözetip yöneten” anlamıyla Haşr suresinde geçen isimlerdendir.",
    fc: ["Kuddüs isminin anlamı nedir?", "Her türlü eksiklikten münezzeh olan, kusursuz ve eksiksiz olandır."]
  },
  {
    si: 1,
    metin: "“Melik” isminin Haşr suresindeki anlamı hangisidir?",
    secenekler: [
      "Egemenliğin mutlak sahibi",
      "Güven veren ve inananları emin kılan",
      "Bütün varlıkları örneksiz yaratıp var eden",
      "Varlıklara şekil ve suret veren"
    ],
    dogru: 0,
    cozum: "Melik, egemenliğin mutlak sahibi anlamına gelir; Allah kâinatı yaratıp kendi hâline bırakmamıştır.",
    fc: ["Mümin isminin anlamı nedir?", "Güven veren, vaadine güvenilen, inananları azabından emin kılandır."]
  },
  {
    si: 2,
    metin: "Haşr suresinde geçen isimlerden hangisi yaratmayla ilgili isimler arasında yer alır?",
    secenekler: ["Bâri", "Selam", "Mütekebbir", "Cebbar"],
    dogru: 0,
    cozum: "Bâri “bütün varlıkları örneksiz yaratan” demektir; Halık ve Musavvir ile birlikte yaratmayla ilgili isimlerdendir.",
    fc: ["Bâri isminin anlamı nedir?", "Bütün varlıkları bir model olmaksızın, örneksiz yaratan demektir."]
  },
  {
    si: 2,
    metin: "Haşr suresinde geçen isimler konularına göre nasıl sınıflandırılır?",
    secenekler: [
      "Yaratmayla, esenlik ve güvenle, yücelik ve azametle ilgili olanlar",
      "Yalnızca rızık ve ticaretle ilgili olanlar",
      "Yalnızca ibadet ve dua ile ilgili olanlar",
      "Yalnızca ahiret ve hesap ile ilgili olanlar"
    ],
    dogru: 0,
    cozum: "Surede Halık, Bâri, Musavvir yaratmayı; Selam, Mümin, Müheymin esenlik ve güveni; Aziz, Cebbar, Mütekebbir yücelik ve azameti ifade eder.",
    fc: ["Selam isminin anlamı nedir?", "Esenlik kaynağı, esenlik veren ve selamete çıkarandır."]
  },
  {
    si: 3,
    metin: "Haşr suresinin son ayetinde göklerde ve yerdeki varlıkların Allah’ı tespih etmesinden hangi çıkarım yapılır?",
    secenekler: [
      "Bütün varlıklar Allah’ın yüceliğini dile getirir",
      "Yalnızca insanlar Allah’ı anmakla yükümlüdür",
      "Varlıkların tespihi mecaz değildir, sözle olur",
      "Tespih yalnızca namaz içinde yapılır"
    ],
    dogru: 0,
    cozum: "Ayet, göklerde ve yerde bulunanların Allah’ı tespih ettiğini bildirir; bu, bütün varlıkların O’nun yüceliğine tanıklık ettiği anlamına gelir.",
    fc: ["Tespih kavramının tanımı nedir?", "Allah’ı kendisine uygun olmayan tüm nitelemelerden uzak görmek ve ibadet etmektir."]
  },
  {
    si: 3,
    metin: "Ayetlerdeki isimlerden hareketle “hiç kimse Allah’a ortak olamaz” sonucuna nasıl ulaşılır?",
    secenekler: [
      "En güzel isimlerin yalnız Allah’a ait olduğunun bildirilmesiyle",
      "İsimlerin sayısının sınırlı sayıda kalması ve az olması",
      "Ayetlerin kısa ve öz cümlelerle ifade edilmesi",
      "İsimlerin hiçbir sıfatla ilişkisinin bulunmaması"
    ],
    dogru: 0,
    cozum: "Ayetlerde en güzel isimlerin Allah’a ait olduğu bildirilir; dolayısıyla hiçbir varlık bu isimlerde O’na ortak değildir.",
    fc: ["Tevhit inancının tanımı nedir?", "Allah’ın varlığında, sıfatlarında ve fiillerinde bir olması, ortağının bulunmamasıdır."]
  },
  {
    si: 4,
    metin: "Haşr suresinin 22-24. ayetlerine göre Allah’ı tanımanın iki boyutu hangisidir?",
    secenekler: [
      "İsim ve sıfatları bütüncül tanımak, bunları yaşantıya yansıtmak",
      "Yalnızca isimleri sayı olarak ezberleyip unutmamak",
      "Yalnızca ibadetlerin sayısını ve vaktini öğrenmek",
      "Yalnızca ahiret hayatının aşamalarını bilmek"
    ],
    dogru: 0,
    cozum: "Ayetler Allah’ı isim ve sıfatlarıyla bütüncül tanımayı; ardından bu isimlerden hayata yansıtılabilecek olanları belirleyip yaşantıyı buna göre düzenlemeyi öğütler.",
    fc: ["İsim ve sıfatları öğrenmenin amacı nedir?", "Allah’ı bütüncül biçimde tanımak ve isimlerin gerektirdiği tutumları yaşantıya yansıtmaktır."]
  },
  {
    si: 4,
    metin: "Bir öğrenci Haşr suresinden çıkardığı mesajı ifade ederken hangi cümleyi kurmalıdır?",
    secenekler: [
      "“Allah’ın güzel isimleri yalnız O’na aittir; ben de bunlardan ders almalıyım.”",
      "“Allah’ın isimleri konusunda bilgi sahibi olmaya gerek yok.”",
      "“İsimlerin anlamları beni ilgilendirmez.”",
      "“Bu isimler yalnızca geçmiş toplumlar için geçerlidir.”"
    ],
    dogru: 0,
    cozum: "Ayetlerin mesajı, isimlerin yalnız Allah’a ait olduğunu kabul edip bunlardan kişisel ders çıkarmayı gerektirir.",
    fc: ["Ayetlerden çıkarılan mesajın ifade ölçütü nedir?", "Ayetin içeriğine bağlı, açık ve kendi cümleleriyle özgün biçimde ifade edilmiş olmasıdır."]
  }
]);

/* Uygulama bu havuzu konu başlığıyla arar (bkz. yaz.js · konuBasligiYaz). */
konuBasligiYaz("din_10_t02_c03", "Din Kültürü > 2.3 Kur'an'dan Mesajlar (Haşr 22-24)");
