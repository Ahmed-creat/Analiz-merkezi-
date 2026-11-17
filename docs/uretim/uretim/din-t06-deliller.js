#!/usr/bin/env node
/* ============================================================
   Din Kültürü 10 · 2. ÜNİTE — ALLAH'I TANIMAK / 2.1 alt başlıkları
   ------------------------------------------------------------
   Ders kitabı içindekileri 2.1'i dört alt başlığa ayırır:
     2.1.1 Kozmolojik Delil
     2.1.2 Teleolojik Delil
     2.1.3 Ontolojik Delil
     2.1.4 Dinî Tecrübe Delili
   Bunlar "2.1 Allah'ın Varlığının Delilleri" havuzundan ayrı
   konulardır; uygulamada ayrı Kısa Kontrol açılabilmesi için her
   biri kendi havuzunu alır.

   Kaynak: MEB Din Kültürü ve Ahlak Bilgisi 10 ders kitabı (2025),
   s. 46-56.
   Kullanım: node docs/uretim/uretim/din-t06-deliller.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Din Kültürü";
const DOSYA = "2025-2026.10.Sinif.Din.Kulturu.Ve.Ahlak.Bigisi.Ders.Kitabi.-MEB.pdf";
const TEMA_ADI = "Allah'ı Tanımak";
const kaynak = s => "MEB Din Kültürü ve Ahlak Bilgisi 10 ders kitabı (2025), s." + s;

/* ------------------------------------------------------------ 2.1.1 */
yazKonu({
  konu_id: "din_10_u02_k05",
  ders: DERS,
  tema: 2,
  tema_adi: TEMA_ADI,
  baslik: "2.1.1 Kozmolojik Delil",
  kazanim: "Evrenin varlığından ve hareketinden hareketle bir yaratıcının varlığını temellendirir.",
  kaynak: kaynak("46-51"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Kozmolojik delilin dayandığı temel öncülü belirler.",
    "Evrenin sonradanlığı ile yaratıcı fikri arasındaki ilişkiyi açıklar."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Bir düşünür, evrende hareket eden her şeyin hareketini kendisinden almadığını, hareketi başlatan bir ilk hareket ettirici bulunması gerektiğini savunmuştur. Bu akıl yürütme hangi delile dayanır?",
      secenekler: ["Kozmolojik delil", "Ontolojik delil", "Dinî tecrübe delili", "Ahlaki delil"],
      cozum:
        "Hareketten ve evrenin oluşumundan yola çıkarak bir ilk neden arayan akıl yürütmeler kozmolojik delil kapsamındadır.",
      fc: ["Kozmolojik delil nedir?", "Evrenin varlığından, hareketinden ve sonradanlığından hareketle bir yaratıcının varlığını kanıtlamaya çalışan delildir."]
    },
    {
      bi: 0,
      metin:
        "Kozmolojik delilin temel öncülü hangisidir?",
      secenekler: [
        "Evrenin bir başlangıcı vardır ve her sonradan var olanın bir varlık sebebi bulunur",
        "İnsanda doğuştan yetkin varlık fikri vardır",
        "Evrende her şey bir amaca hizmet eder",
        "İnsan dua ettiğinde huzur bulur"
      ],
      cozum:
        "Kozmolojik delil, evrenin sonradan var olduğu ve her sonradan var olanın bir sebebi bulunduğu öncülüne dayanır; diğer seçenekler başka delillere aittir.",
      fc: ["Kozmolojik delilin öncülü nedir?", "Evren sonradan var olmuştur; her sonradan var olanın bir varlık sebebi vardır."]
    },
    {
      bi: 0,
      metin:
        "Kelam âlimlerinin \"âlem sonradan yaratılmıştır, her sonradan yaratılanın bir yaratıcısı vardır\" biçimindeki akıl yürütmesi hangi delilin en bilinen biçimidir?",
      secenekler: ["Hudûs delili (kozmolojik)", "Gaye ve nizam delili", "Ontolojik delil", "Dinî tecrübe delili"],
      cozum:
        "Hudûs delili, evrenin sonradan meydana geldiği öncülünden yaratıcıya ulaşır; kozmolojik delilin kelam geleneğindeki adıdır.",
      fc: ["Hudûs delili hangi delilin başka adıdır?", "Kozmolojik delilin; evrenin sonradan yaratıldığı öncülünden yola çıkar."]
    },
    {
      bi: 1,
      metin:
        "Bir metinde, evrenin kendi kendisini var etmesinin akıl dışı olduğu; var olmak için kendisinden önce gelen bir varlığa ihtiyaç duyduğu anlatılmaktadır. Bu açıklama kozmolojik delili nasıl destekler?",
      secenekler: [
        "Evrenin varlığını kendisinden açıklayamadığını, dolayısıyla bir yaratıcı gerektirdiğini gösterir",
        "Evrende her şeyin tesadüfen oluştuğunu kanıtlar",
        "İnsanın ahlaki sorumluluğunu ortaya koyar",
        "İbadetlerin farz olduğunu temellendirir"
      ],
      cozum:
        "Kozmolojik delil, evrenin varlığını kendi içinde açıklayamamasını onun bir yaratıcıya bağlı olduğunun kanıtı sayar.",
      fc: ["Kozmolojik delil evrenin hangi özelliğinden yararlanır?", "Varlığını kendisinden açıklayamamasından, yani sonradan var olmasından."]
    },
    {
      bi: 1,
      metin:
        "İslam düşüncesinde evrenin \"hâdis\" olduğu söylenir. Bu kavram aşağıdakilerden hangisini ifade eder?",
      secenekler: ["Sonradan var olan", "Ezelî olan", "Zorunlu varlık", "Yoktan var edilemeyen"],
      cozum:
        "Hâdis, varlığının başlangıcı olan, sonradan meydana gelmiş varlık demektir; evren bu nitelikte görülür.",
      fc: ["Hâdis ne demektir?", "Sonradan var olan, varlığının başlangıcı bulunan varlık."]
    },
    {
      bi: 1,
      metin:
        "Bir öğrenci, kozmolojik delili anlatırken \"evrenin hareketi kendi kendine başlamış olamaz\" cümlesini kurmuştur. Bu cümle delilin hangi aşamasına karşılık gelir?",
      secenekler: [
        "Hareketten hareket ettiriciye geçiş",
        "Evrenin amaçlı düzenini açıklama",
        "Zihindeki yetkin varlık fikrini çözümleme",
        "Dua ile huzur arasındaki bağı kurma"
      ],
      cozum:
        "Hareketin kendi kendine başlayamayacağı düşüncesi, hareket eden evrenden hareket ettiriciye ulaşan kozmolojik çıkarımın ilk aşamasıdır.",
      fc: ["Kozmolojik delilde hareketin rolü nedir?", "Hareket eden evrenden hareket ettirici bir varlığa ulaşmayı sağlar."]
    },
    {
      bi: 0,
      metin:
        "Aşağıdaki ifadelerden hangisi kozmolojik delilin kapsamı dışında kalır?",
      secenekler: [
        "Evrendeki uyumun bilinçli bir düzenleyiciye işaret etmesi",
        "Evrenin bir başlangıcı bulunması",
        "Her sonradan var olanın bir sebebi olması",
        "Hareket eden varlıkların bir ilk hareket ettiriciye ihtiyaç duyması"
      ],
      cozum:
        "Evrendeki uyum ve amaçlılık teleolojik (gaye ve nizam) delilin konusudur; diğerleri kozmolojik delilin öncülleridir.",
      fc: ["Kozmolojik delil ile teleolojik delil nasıl ayrılır?", "Kozmolojik delil varlık ve hareketten, teleolojik delil düzen ve amaçtan yola çıkar."]
    },
    {
      bi: 0,
      metin:
        "Bir konuşmacı, \"Evren yaratılmamış olsaydı, varlığını sürdürmek için kendisinden başka bir şeye ihtiyaç duymazdı; oysa her an bir desteğe muhtaçtır.\" demiştir. Konuşmacının kullandığı delil hangisidir?",
      secenekler: ["Kozmolojik delil", "Ontolojik delil", "Dinî tecrübe delili", "Tarihsel delil"],
      cozum:
        "Evrenin varlığını sürdürebilmek için başka bir varlığa muhtaç olması, kozmolojik delilin varlık ve sebep ilişkisine dayanan çıkarımıdır.",
      fc: ["Kozmolojik delilde \"sebep\" kavramı neyi anlatır?", "Sonradan var olan her şeyin varlığını bir başka varlığa borçlu olmasını."]
    },
    {
      bi: 1,
      metin:
        "Kozmolojik delilin sonunda ulaşılan varlık için aşağıdakilerden hangisi söylenir?",
      secenekler: [
        "Varlığı başka bir varlığa bağlı olmayan zorunlu varlıktır",
        "Evrenin bir parçasıdır",
        "Sonradan yaratılmış bir varlıktır",
        "Yalnızca insan zihninde bulunan bir fikirdir"
      ],
      cozum:
        "Delil, varlığı kendinden olan ve başka bir sebebe ihtiyaç duymayan zorunlu bir varlığa ulaşmayı amaçlar.",
      fc: ["Kozmolojik delilin ulaştığı varlık nasıl tanımlanır?", "Varlığı kendinden olan, sebebe ihtiyaç duymayan zorunlu varlık."]
    },
    {
      bi: 0,
      metin:
        "Kozmolojik delili reddeden bir kişinin öne sürebileceği itiraz hangisidir?",
      secenekler: [
        "Evrenin bir başlangıcı olmayabileceği",
        "İnsanda yetkin varlık fikrinin bulunmadığı",
        "Dua edenlerin huzur duymadığı",
        "Evrende hiçbir düzenin görülmediği"
      ],
      cozum:
        "Delilin ilk öncülü evrenin sonradan var olduğudur; bu öncülü tartışmak delile yönelik en temel itirazdır.",
      fc: ["Kozmolojik delile yöneltilen temel itiraz nedir?", "Evrenin bir başlangıcı olmayabileceği, yani ezelî olabileceği itirazı."]
    }
  ]
});

/* ------------------------------------------------------------ 2.1.2 */
yazKonu({
  konu_id: "din_10_u02_k06",
  ders: DERS,
  tema: 2,
  tema_adi: TEMA_ADI,
  baslik: "2.1.2 Teleolojik Delil",
  kazanim: "Evrendeki düzen ve amaçlılıktan hareketle yaratıcının varlığını temellendirir.",
  kaynak: kaynak("51-54"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Evrendeki düzen örneklerini delille ilişkilendirir.",
    "Gaye ve nizam kavramlarını ayırt eder."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Bir canlının organlarının birbirini tamamlayacak biçimde iş görmesi, hiçbir parçanın gereksiz olmaması dikkat çekmiştir. Bu gözlem hangi delile dayanak olur?",
      secenekler: ["Teleolojik delil", "Kozmolojik delil", "Ontolojik delil", "Dinî tecrübe delili"],
      cozum:
        "Evrendeki uyum ve amaçlılıktan bir düzenleyiciye ulaşan çıkarım teleolojik (gaye ve nizam) delildir.",
      fc: ["Teleolojik delil nedir?", "Evrendeki düzen ve amaçlılıktan hareketle bir düzenleyicinin varlığını temellendiren delildir."]
    },
    {
      bi: 0,
      metin: "Teleolojik delilin diğer adı hangisidir?",
      secenekler: ["Gaye ve nizam delili", "Hudûs delili", "İmkân delili", "Dinî tecrübe delili"],
      cozum:
        "Teleolojik delil, evrendeki gaye (amaç) ve nizam (düzen) üzerinde durduğu için gaye ve nizam delili olarak da adlandırılır.",
      fc: ["Teleolojik delil hangi adlarla da anılır?", "Gaye ve nizam delili."]
    },
    {
      bi: 1,
      metin:
        "Bir kuyumcunun atölyesinde düzenli bir işleyiş görülmesi, orada bir ustanın bulunduğunu düşündürür. Bu örnek hangi akıl yürütmeye benzer?",
      secenekler: [
        "Düzenden düzenleyiciye ulaşma",
        "Varlıktan yokluğa geçme",
        "Zihindeki fikirden varlığa geçme",
        "Duygudan bilgiye geçme"
      ],
      cozum:
        "Örnek, düzenin kendiliğinden oluşmadığı, bir düzenleyici gerektirdiği düşüncesine dayanır; teleolojik delilin mantığı budur.",
      fc: ["Teleolojik delilin akıl yürütme biçimi nedir?", "Düzenin varlığından, o düzeni kuran bir düzenleyicinin varlığına ulaşmak."]
    },
    {
      bi: 1,
      metin:
        "Evrendeki ölçülerin canlı yaşamına uygun olması (yerçekimi, atmosfer, su döngüsü gibi) hangi kavramla ifade edilir?",
      secenekler: ["İnce ayar", "Hudûs", "Ontolojik zorunluluk", "Tecrübe"],
      cozum:
        "Evrenin sabitlerinin canlı yaşamına elverişli olması ince ayar olarak adlandırılır ve teleolojik delilin dayanaklarındandır.",
      fc: ["İnce ayar ne demektir?", "Evrendeki ölçü ve sabitlerin canlı yaşamına elverişli biçimde düzenlenmiş olması."]
    },
    {
      bi: 0,
      metin:
        "Aşağıdakilerden hangisi teleolojik delile örnek oluşturmaz?",
      secenekler: [
        "Evrenin sonradan yaratılmış olması",
        "Arının peteği altıgen yapması",
        "Gözün görme işlevine uygun yapıda olması",
        "Su döngüsünün canlı yaşamını sürdürmesi"
      ],
      cozum:
        "Evrenin sonradan yaratılmış olması kozmolojik delilin öncülüdür; diğerleri düzen ve amaç örnekleridir.",
      fc: ["Teleolojik delil hangi tür kanıtlar kullanır?", "Doğadaki düzen, uyum ve amaçlılık örneklerini."]
    },
    {
      bi: 1,
      metin:
        "Bir öğrenci \"Doğadaki her şey rastlantıyla açıklanabilir.\" diyerek düzen örneklerini reddetmiştir. Bu itiraz hangi delili hedef alır?",
      secenekler: ["Teleolojik delili", "Ontolojik delili", "Dinî tecrübe delilini", "Ahlaki delili"],
      cozum:
        "Düzenin rastlantıyla açıklanabileceği iddiası, düzenden hareket eden teleolojik delile yönelik itirazdır.",
      fc: ["Teleolojik delile yöneltilen itiraz nedir?", "Düzenin rastlantı ve doğal seçilimle açıklanabileceği iddiası."]
    },
    {
      bi: 1,
      metin:
        "İnsan vücudundaki sistemlerin birbirini tamamlaması, \"amaçlılık\" fikrini destekler. Burada vurgulanan kavram hangisidir?",
      secenekler: ["Gaye", "Hudûs", "İmkân", "Vahiy"],
      cozum:
        "Gaye, varlıkların belirli bir amaca yönelik düzenlenmiş olmasıdır; organların işlevi bu fikri destekler.",
      fc: ["Gaye ne demektir?", "Bir varlığın belirli bir amaca yönelik olarak düzenlenmiş olması."]
    },
    {
      bi: 0,
      metin:
        "Teleolojik delilde \"nizam\" kavramı neyi anlatır?",
      secenekler: ["Evrendeki düzen ve uyum", "Evrenin sonradanlığı", "İnsanın sorumluluğu", "Duanın etkisi"],
      cozum:
        "Nizam, evrendeki düzen, ölçü ve uyumdur; delil bu düzenden bir düzenleyiciye ulaşır.",
      fc: ["Nizam ne demektir?", "Düzen, ölçü ve uyum; evrendeki düzenli işleyiş."]
    },
    {
      bi: 0,
      metin:
        "Bir bilim insanı, doğadaki karmaşık yapıların basit kurallarla açıklanabildiğini söylemiş; bir başkası bu kuralların neden var olduğunu sormuştur. İkinci bilim insanının sorusu hangi delile yaklaşır?",
      secenekler: ["Teleolojik delile", "Kozmolojik delile", "Ontolojik delile", "Tarihsel delile"],
      cozum:
        "Kuralların niçin var olduğunu, yani düzenin amacını sormak teleolojik delilin sorusudur.",
      fc: ["Teleolojik delil hangi soruyla başlar?", "\"Evrendeki düzen neden vardır, hangi amaca hizmet eder?\" sorusuyla."]
    },
    {
      bi: 1,
      metin:
        "Teleolojik delilin ulaştığı sonuç aşağıdakilerden hangisidir?",
      secenekler: [
        "Evrende bilinçli bir düzenleyicinin varlığı",
        "Evrenin ezelî olduğu",
        "İnsanın bilgi edinemediği",
        "İbadetlerin toplumsal faydası"
      ],
      cozum:
        "Delil, düzen ve amaçlılıktan hareketle evreni düzenleyen bilinçli bir varlığın bulunduğu sonucuna ulaşır.",
      fc: ["Teleolojik delilin sonucu nedir?", "Evrende bilinçli bir düzenleyicinin bulunduğu sonucu."]
    }
  ]
});

/* ------------------------------------------------------------ 2.1.3 */
yazKonu({
  konu_id: "din_10_u02_k07",
  ders: DERS,
  tema: 2,
  tema_adi: TEMA_ADI,
  baslik: "2.1.3 Ontolojik Delil",
  kazanim: "Zihindeki yetkin varlık fikrinden hareketle yaratıcının varlığını temellendirir.",
  kaynak: kaynak("54-55"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Ontolojik delilin mantığını açıklar.",
    "Delilin sınırlılığını değerlendirir."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Bir düşünür, insan zihninde kendisinden daha yetkini düşünülemeyen bir varlık fikri bulunduğunu, böyle bir varlığın yalnızca zihinde kalamayacağını savunmuştur. Bu akıl yürütme hangi delildir?",
      secenekler: ["Ontolojik delil", "Kozmolojik delil", "Teleolojik delil", "Dinî tecrübe delili"],
      cozum:
        "Yalnızca kavramdan, zihindeki yetkin varlık fikrinden hareket eden delil ontolojik delildir.",
      fc: ["Ontolojik delil nedir?", "Zihindeki en yetkin varlık fikrinden hareketle Allah'ın varlığını temellendiren delildir."]
    },
    {
      bi: 0,
      metin: "Ontolojik delil hangi alandan hareket eder?",
      secenekler: ["Kavram ve düşünceden", "Evrenin hareketinden", "Doğadaki düzenden", "Kişisel yaşantıdan"],
      cozum:
        "Delil, evrene veya deneyime bakmaz; doğrudan zihindeki kavramdan hareket eder.",
      fc: ["Ontolojik delilin hareket noktası nedir?", "Zihinde bulunan kavramlar, özellikle en yetkin varlık fikri."]
    },
    {
      bi: 1,
      metin:
        "\"En yetkin varlık yalnızca zihinde varsa eksik olur; oysa en yetkin varlık eksik düşünülemez.\" Bu çıkarımın dayanağı hangisidir?",
      secenekler: [
        "Yetkinlik kavramının varlığı zorunlu kılması",
        "Evrenin sonradan yaratılmış olması",
        "Doğadaki düzenin amaçlı olması",
        "Duanın insana huzur vermesi"
      ],
      cozum:
        "Ontolojik delil, en yetkin varlığın zorunlu olarak var olması gerektiği düşüncesine dayanır.",
      fc: ["Ontolojik delilin temel çıkarımı nedir?", "En yetkin varlık zorunlu olarak vardır; yokluğu düşünülemez."]
    },
    {
      bi: 1,
      metin:
        "Ontolojik delile yöneltilen en yaygın itiraz hangisidir?",
      secenekler: [
        "Zihinde bulunan bir fikrin varlığı kanıtlamaya yetmeyeceği",
        "Evrende düzen bulunmadığı",
        "Evrenin bir başlangıcı olmadığı",
        "İnsanın dua etmediği"
      ],
      cozum:
        "Delile yönelik temel itiraz, düşüncedeki bir kavramdan gerçek varlığa geçilemeyeceği itirazıdır.",
      fc: ["Ontolojik delile yöneltilen itiraz nedir?", "Zihindeki bir kavramdan gerçek varlığa geçilemeyeceği itirazı."]
    },
    {
      bi: 0,
      metin:
        "Aşağıdaki ifadelerden hangisi ontolojik delile aittir?",
      secenekler: [
        "Kendisinden daha yetkini düşünülemeyen varlık hem zihinde hem gerçekte vardır",
        "Her hareket edenin bir hareket ettiricisi vardır",
        "Evrende her şey bir amaca hizmet eder",
        "Dua eden kişi manevi huzur bulur"
      ],
      cozum:
        "Delilin temel önermesi, en yetkin varlığın zorunlu olarak gerçekte de bulunduğudur; diğerleri başka delillere aittir.",
      fc: ["Ontolojik delilin önermesi nedir?", "Kendisinden daha yetkini düşünülemeyen varlık zorunlu olarak vardır."]
    },
    {
      bi: 0,
      metin:
        "Bir öğrenci, ontolojik delili anlatırken \"Bu delil gözlem yapmaz.\" demiştir. Bu ifade neden doğrudur?",
      secenekler: [
        "Delil yalnızca kavram üzerinden akıl yürütür",
        "Delil doğadaki düzeni inceler",
        "Delil tarihî olayları inceler",
        "Delil anket sonuçlarına dayanır"
      ],
      cozum:
        "Ontolojik delil deney ve gözlem kullanmaz; kavramın çözümlenmesiyle sonuca ulaşır.",
      fc: ["Ontolojik delil gözlem kullanır mı?", "Hayır; yalnızca kavramlar üzerinden akıl yürütür."]
    },
    {
      bi: 1,
      metin:
        "Ontolojik delil ile teleolojik delil arasındaki temel fark hangisidir?",
      secenekler: [
        "Biri kavramdan, diğeri doğadaki düzenden hareket eder",
        "Biri inananlara, diğeri inanmayanlara hitap eder",
        "Biri yalnızca İslam'da, diğeri yalnızca Hristiyanlıkta görülür",
        "Biri ibadetleri, diğeri ahlakı konu alır"
      ],
      cozum:
        "Ontolojik delil zihinsel kavramdan, teleolojik delil evrendeki düzen ve amaçtan yola çıkar.",
      fc: ["Kavramdan hareket eden delil hangisidir?", "Ontolojik delil; düzenden hareket eden teleolojik delildir."]
    },
    {
      bi: 1,
      metin:
        "Bir düşünür ontolojik delili \"aklın kendi kavramlarıyla ulaştığı bir sonuç\" olarak tanımlamıştır. Bu tanım delilin hangi yönünü vurgular?",
      secenekler: [
        "Akla dayalı, deneyden bağımsız oluşunu",
        "Evreni incelediğini",
        "Duyularla doğrulandığını",
        "Toplumsal faydayı esas aldığını"
      ],
      cozum:
        "Delil, akıl yürütmeyle ve kavram çözümlemesiyle ilerler; duyu verilerine dayanmaz.",
      fc: ["Ontolojik delil niçin akılcı bir delildir?", "Deney ve gözlem yerine kavram ve akıl yürütmeye dayandığı için."]
    },
    {
      bi: 0,
      metin:
        "Aşağıdakilerden hangisi ontolojik delilin kullandığı kavramlardan biridir?",
      secenekler: ["Zorunlu varlık", "Hudûs", "İnce ayar", "Tecrübe"],
      cozum:
        "Zorunlu varlık, varlığı bir başkasına bağlı olmayan varlık anlamında ontolojik delilin temel kavramıdır.",
      fc: ["Zorunlu varlık ne demektir?", "Varlığı kendinden olan, yokluğu düşünülemeyen varlık."]
    },
    {
      bi: 1,
      metin:
        "Bir kişi \"Tanrı'yı düşünmek, O'nun var olduğunu düşünmek değildir.\" diyerek delili eleştirmiştir. Bu eleştirinin hedefi hangisidir?",
      secenekler: [
        "Kavramdan varlığa geçiş yapılması",
        "Evrendeki düzenin incelenmesi",
        "Tarihî tanıklıkların kullanılması",
        "Dua ve ibadetin önemsenmesi"
      ],
      cozum:
        "Eleştiri, zihinde canlandırılan bir kavramın gerçek varlığı garanti etmeyeceği noktasına yönelir.",
      fc: ["Ontolojik delilin tartışmalı noktası nedir?", "Zihindeki kavramdan gerçek varlığa geçiş yapılması."]
    }
  ]
});

/* ------------------------------------------------------------ 2.1.4 */
yazKonu({
  konu_id: "din_10_u02_k08",
  ders: DERS,
  tema: 2,
  tema_adi: TEMA_ADI,
  baslik: "2.1.4 Dinî Tecrübe Delili",
  kazanim: "İnananların kişisel dinî yaşantılarından hareketle yaratıcının varlığını temellendirir.",
  kaynak: kaynak("55-57"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Dinî tecrübenin delil olarak nasıl kullanıldığını açıklar.",
    "Dinî tecrübenin sınırlılığını değerlendirir."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Bir kişi, dua sırasında yaşadığı huzuru ve yaratıcıya yakınlık hissini inancının güçlenmesine gerekçe göstermiştir. Bu gerekçe hangi delile dayanır?",
      secenekler: ["Dinî tecrübe delili", "Ontolojik delil", "Kozmolojik delil", "Gaye ve nizam delili"],
      cozum:
        "Kişisel dinî yaşantıdan hareket eden gerekçeler dinî tecrübe delili kapsamındadır.",
      fc: ["Dinî tecrübe delili nedir?", "İnananın kişisel dinî yaşantısından hareketle yaratıcının varlığını temellendiren delildir."]
    },
    {
      bi: 0,
      metin: "Dinî tecrübe delili hangi tür kanıtı esas alır?",
      secenekler: ["Kişisel yaşantıyı", "Evrenin hareketini", "Doğadaki düzeni", "Zihindeki kavramı"],
      cozum:
        "Delil, bireyin yaşadığı manevi deneyimi kanıt olarak kullanır.",
      fc: ["Dinî tecrübe delilinin kanıtı nedir?", "Bireyin yaşadığı kişisel dinî deneyim."]
    },
    {
      bi: 1,
      metin:
        "Bir öğrenci, dinî tecrübenin başkasına bütünüyle aktarılamadığını söylemiştir. Bu durum delilin hangi özelliğini gösterir?",
      secenekler: [
        "Öznel bir deneyime dayandığını",
        "Evreni incelediğini",
        "Toplumsal olduğunu",
        "Deneysel olarak ölçülebildiğini"
      ],
      cozum:
        "Deneyimin aktarılmasındaki güçlük, onun kişiye özgü, öznel bir yaşantı olmasından kaynaklanır.",
      fc: ["Dinî tecrübenin öznel olması ne demektir?", "Yaşantının kişiye özgü olması, başkasına aynı biçimde aktarılamaması."]
    },
    {
      bi: 1,
      metin:
        "Dinî tecrübe deliline yöneltilen temel itiraz hangisidir?",
      secenekler: [
        "Kişisel yaşantının herkes için bağlayıcı kanıt olamayacağı",
        "Evrende düzenin bulunmadığı",
        "Evrenin bir başlangıcı olmadığı",
        "Kavramların hiçbir anlam taşımadığı"
      ],
      cozum:
        "Delile yönelik itiraz, öznel deneyimin başkaları için doğrulanabilir bir kanıt sayılamayacağı noktasındadır.",
      fc: ["Dinî tecrübe deliline yöneltilen itiraz nedir?", "Öznel yaşantının herkes için geçerli kanıt olamayacağı itirazı."]
    },
    {
      bi: 0,
      metin:
        "Dinî tecrübenin inananın davranışlarına etkisi aşağıdakilerden hangisiyle açıklanır?",
      secenekler: [
        "Yaşantının inancı güçlendirip davranışı yönlendirmesi",
        "Evrenin düzeninin bozulması",
        "Bilginin kaynağının değişmesi",
        "İbadetlerin azalması"
      ],
      cozum:
        "Yaşanan deneyim inancı pekiştirir, bu da davranışlarda kararlılık ve yönelim oluşturur.",
      fc: ["Dinî tecrübe davranışı nasıl etkiler?", "İnancı güçlendirerek davranışlara yön verir."]
    },
    {
      bi: 1,
      metin:
        "Aşağıdakilerden hangisi dinî tecrübe deliline örnek olamaz?",
      secenekler: [
        "Evrendeki dengelerin matematiksel olarak açıklanması",
        "Dua sırasında huzur duyulması",
        "Tövbe sonrası iç rahatlığı yaşanması",
        "İbadet sırasında manevi yakınlık hissedilmesi"
      ],
      cozum:
        "Evrendeki dengelerin matematiksel açıklaması doğadaki düzene ilişkindir; teleolojik delilin alanına girer.",
      fc: ["Dinî tecrübe delilinin alanı nedir?", "Bireyin manevi yaşantısı; doğa yasaları değil."]
    },
    {
      bi: 0,
      metin:
        "Dinî tecrübenin delil olarak kullanılmasında dikkat edilmesi gereken nokta hangisidir?",
      secenekler: [
        "Yaşantının dinin temel öğretileriyle çelişmemesi",
        "Yaşantının herkesçe aynı biçimde anlatılması",
        "Yaşantının ölçülebilir olması",
        "Yaşantının yalnızca bir kez yaşanması"
      ],
      cozum:
        "Kişisel deneyimler dinin temel ilkeleriyle uyumlu olmalı; aksi hâlde yanlış yorumlara açık olur.",
      fc: ["Dinî tecrübe nasıl değerlendirilmelidir?", "Dinin temel öğretileriyle uyumu gözetilerek."]
    },
    {
      bi: 0,
      metin:
        "\"İnanan için en güçlü kanıt kendi yaşadığıdır.\" sözü hangi delili anlatır?",
      secenekler: ["Dinî tecrübe delilini", "Ontolojik delili", "Kozmolojik delili", "Hudûs delilini"],
      cozum:
        "Kişinin kendi yaşantısını kanıt sayması dinî tecrübe delilinin temel yaklaşımıdır.",
      fc: ["Kendi yaşantısını kanıt sayan delil hangisidir?", "Dinî tecrübe delili."]
    },
    {
      bi: 1,
      metin:
        "Bir araştırmacı, dinî tecrübenin farklı kültürlerde benzer biçimlerde görüldüğünü tespit etmiştir. Bu tespit delili nasıl etkiler?",
      secenekler: [
        "Delilin evrenselliğine dair bir dayanak oluşturur",
        "Delili tamamen geçersiz kılar",
        "Delili kozmolojik delile dönüştürür",
        "Delilin konusunu değiştirir"
      ],
      cozum:
        "Benzer yaşantıların farklı kültürlerde görülmesi, deneyimin yaygınlığına dair bir destek olarak sunulur.",
      fc: ["Dinî tecrübenin yaygınlığı neyi gösterir?", "Benzer manevi yaşantıların farklı kültürlerde de görüldüğünü."]
    },
    {
      bi: 1,
      metin:
        "Dinî tecrübe delili ile ontolojik delilin ortak yönü hangisidir?",
      secenekler: [
        "İkisi de doğayı gözlemleyerek sonuca varmaz",
        "İkisi de evrenin hareketini inceler",
        "İkisi de tarihî belgeleri kullanır",
        "İkisi de deney sonuçlarına dayanır"
      ],
      cozum:
        "Ontolojik delil kavramdan, dinî tecrübe delili kişisel yaşantıdan hareket eder; ikisi de doğa gözlemine dayanmaz.",
      fc: ["Ontolojik ve dinî tecrübe delillerinin ortak yönü nedir?", "Doğa gözlemine dayanmamaları; kavram ve yaşantıdan hareket etmeleri."]
    }
  ]
});
