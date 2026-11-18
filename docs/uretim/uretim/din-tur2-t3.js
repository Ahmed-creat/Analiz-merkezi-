#!/usr/bin/env node
/* ============================================================
   DİN KÜLTÜRÜ 10 · TUR-2 · 3. ÜNİTE — kitaptan sıfırdan havuzlar
   ------------------------------------------------------------
   Kaynak: MEB Din Kültürü 10 (2025) — din.json (kitap-kaynak).
   Basılı sayfa = PDF sayfası − 1.

     3.1 İslam'ın Tevhit İlkesi        s.81-84   (12 soru)
     3.2 İslam'da Adalet ve Eşitlik    s.85-89   (15 soru)
     3.3 İslam ve Barış                s.95-101  (14 soru)

   Zip kaynaklı eski sürümler `arsiv/soru_havuzlari/din/zip-*`.

   Kullanım: node docs/uretim/uretim/din-tur2-t3.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Din Kültürü";
const DOSYA = "din-10.pdf (MEB, 2025)";
const kaynak = s => "Din Kültürü 10 ders kitabı, s." + s;
const TEMA = 3;
const TEMA_ADI = "İslam'ın Evrensel Mesajları";

/* --------------------------------------------- 3.1 */
yazKonu({
  konu_id: "din_10_u03_k01",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "3.1 İslam'ın Tevhit İlkesi",
  kazanim: "İslam'ın tevhit ilkesini ve bu ilkenin hayata yansımalarını açıklar.",
  kaynak: kaynak("81-84"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Tevhit ilkesini, boyutlarını ve şirk kavramını açıklar.",
    "Tevhidin bireysel ve toplumsal hayata yansımalarını yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Tevhit kavramının sözlük anlamı hangisidir?",
      secenekler: [
        "Birlemek, bir kılmak, bir şeyin bir ve tek olduğuna hükmetmek",
        "Bir varlığı başka varlıklara denk tutmak",
        "İbadetleri topluca yerine getirmek",
        "İnancı ataların yoluna göre sürdürmek"
      ],
      cozum: "Tevhit, sözlükte birlemek ve bir şeyin tek olduğuna hükmetmek anlamlarına gelir.",
      fc: ["Tevhit nedir?", "Birlemek; Allah'ın bir olduğunu bilmek ve O'na ortak koşmamak."]
    },
    {
      bi: 0,
      metin: "Allah'a inanmakla birlikte başka varlıkları da ilah olarak kabul etme anlamına gelen kavram hangisidir?",
      secenekler: ["Şirk", "Tevhit", "Tenzih", "Tevbe"],
      cozum: "Şirk, Allah'a eş ve ortak koşmak demektir; tevhidin zıddıdır.",
      fc: ["Şirk nedir?", "Allah'a başka bir varlığı denk görmek, ortak koşmak."]
    },
    {
      bi: 0,
      metin: "Tevhit ilkesinin üç boyutu hangi seçenekte doğru verilmiştir?",
      secenekler: [
        "Allah'ı tek Rab kabul etmek; ibadeti yalnız O'na yapmak; isim ve sıfatların yalnız O'na özgü olduğunu kabul etmek",
        "Namaz kılmak; oruç tutmak; zekât vermek ve hacca gitmek",
        "İman etmek; tövbe etmek; dua etmek ve sadaka vermek",
        "Bilmek; sevmek; korkmak ve tevekkül etmek"
      ],
      cozum: "Tevhidin boyutları Rabliği kabul, ibadeti Allah'a has kılmak ve isim-sıfatların O'na özgülüğünü kabul etmektir.",
      fc: ["Tevhit ilkesinin boyutları nedir?", "Tek Rab kabul etmek, ibadeti yalnız O'na yapmak, isim ve sıfatların yalnız O'na ait olduğunu kabul etmek."]
    },
    {
      bi: 0,
      metin: "\"De ki: O, Allah'tır, bir tektir.\" ifadesiyle başlayan sure hangisidir?",
      secenekler: ["İhlas suresi", "Fatiha suresi", "Nas suresi", "Kevser suresi"],
      cozum: "İhlas suresi, Allah'ın birliğini ve eşsizliğini ifade eder.",
      fc: ["İhlas suresi neyi ifade eder?", "Allah'ın birliğini ve hiçbir şeyin O'na denk olmadığını."]
    },
    {
      bi: 0,
      metin: "Bütün peygamberlerin ortak mesajı hangisidir?",
      secenekler: ["Tevhit", "Cihat", "Zühd", "Hac"],
      cozum: "Peygamberlerin tamamı Allah'ın birliği inancını tebliğ etmiştir.",
      fc: ["Tevhit inancı kimler tarafından tebliğ edilmiştir?", "Bütün peygamberler tarafından."]
    },
    {
      bi: 0,
      metin: "Nisa suresi 116. ayete göre Allah'ın bağışlamayacağı günah hangisidir?",
      secenekler: [
        "Kendisine ortak koşulması",
        "İbadetlerin geciktirilmesi",
        "Orucun bozulması",
        "Yeminin yerine getirilmemesi"
      ],
      cozum: "Ayet, şirk dışındaki günahların bağışlanabileceğini, şirkin ise bağışlanmayacağını bildirir.",
      fc: ["Hangi günah bağışlanmaz?", "Şirk; Allah'a ortak koşmak."]
    },
    {
      bi: 1,
      metin: "İslam mimarisindeki geometrik desenler ve hat sanatı hangi inancın sembolü olarak değerlendirilir?",
      secenekler: [
        "Allah'ın birliği inancının",
        "Ahiret inancının",
        "Melek inancının",
        "Kader inancının"
      ],
      cozum: "Kitapta desen ve hat örnekleri Allah'ın birliğini sembolize eden eserler olarak sunulur.",
      fc: ["Geometrik desenler neyi sembolize eder?", "Allah'ın birliğini."]
    },
    {
      bi: 1,
      metin: "\"Çoklukta birlik, birlikte çokluk\" ifadesi hangi durumu anlatır?",
      secenekler: [
        "Evrendeki çeşitliliğin bir uyum içinde olmasını",
        "Toplumların birbirinden kopmasını",
        "İbadetlerin çeşitlenmesini",
        "Mezheplerin ortaya çıkışını"
      ],
      cozum: "Tevhit inancı, birlik ve çokluğu bir arada ele alır; çeşitlilik uyum içindedir.",
      fc: ["\"Çoklukta birlik\" neyi anlatır?", "Evrendeki çeşitliliğin bir uyum içinde olmasını."]
    },
    {
      bi: 1,
      metin: "Tevhit inancının bireyi koruduğu olumsuz durum hangisidir?",
      secenekler: [
        "Şirk ve bölünmüşlük",
        "Yoksulluk ve hastalık",
        "Cehalet ve tembellik",
        "Göç ve savaş"
      ],
      cozum: "Tevhit, insanı şirk gibi yanlış inançlardan ve parçalanmışlıktan korur.",
      fc: ["Tevhit inancı bireyi neden korur?", "Şirk, bölünmüşlük ve parçalanmışlıktan."]
    },
    {
      bi: 1,
      metin: "Toplumsal hayatta tevhit inancının karşılığı hangisidir?",
      secenekler: ["Birlik", "Rekabet", "Hiyerarşi", "Yalıtım"],
      cozum: "Kitapta tevhidin toplumsal karşılığının birlik olduğu belirtilir.",
      fc: ["Tevhidin toplumsal karşılığı nedir?", "Birlik bilinci."]
    },
    {
      bi: 1,
      metin: "Toplumda gerçek birliğin sağlanması hangi koşullara bağlanmıştır?",
      secenekler: [
        "Sosyal adaletin sağlanması ve ahlaki değerlere sahip olunması",
        "Ekonomik büyümenin hızlanması ve yatırımların artması",
        "Nüfusun artması ve şehirlerin genişlemesi",
        "Tarım üretiminin artması ve ticaretin canlanması"
      ],
      cozum: "Birlik bilinci, sosyal adalet ve ahlaki değerlere bağlıdır.",
      fc: ["Toplumsal birlik neye bağlıdır?", "Sosyal adalet ve ahlaki değerlere."]
    },
    {
      bi: 1,
      metin: "Allah'ın birliğinin sembolü sayılan ve O'nun adının ilk harfi olan harf hangisidir?",
      secenekler: ["Elif", "Be", "Cim", "Vav"],
      cozum: "Elif, Allah'ın adının ilk harfi ve birliğinin sembolü olarak önemlidir.",
      fc: ["Elif harfi niçin önemlidir?", "Allah'ın adının ilk harfi ve birliğinin sembolü olması nedeniyle."]
    }
  ]
});

/* --------------------------------------------- 3.2 */
yazKonu({
  konu_id: "din_10_u03_k02",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "3.2 İslam'da Adalet ve Eşitlik",
  kazanim: "İslam'ın adalet ve eşitlik anlayışını ilkeleriyle açıklar.",
  kaynak: kaynak("85-89"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Adaletin tanımını, alanlarını ve ilkelerini açıklar.",
    "Adalet ilkelerini örnek durumlarla ilişkilendirir."
  ],
  items: [
    {
      bi: 0,
      metin: "Adaletin tanımları arasında hangisi yer alır?",
      secenekler: [
        "Hak sahibine hakkını vermek",
        "Herkesi aynı sonuca ulaştırmak",
        "Cezaları kaldırmak",
        "Anlaşmaları yenilemek"
      ],
      cozum: "Adalet; doğruluk, eşitlik, hakkı gözetme ve hak sahibine hakkını verme anlamlarına gelir.",
      fc: ["Adalet nedir?", "Doğruluk, eşitlik ve hak sahibine hakkını verme."]
    },
    {
      bi: 0,
      metin: "\"Adalet, her şeyi layık olduğu yere koymaktır.\" sözü hangi esere aittir?",
      secenekler: ["Mesnevî", "Divan-ı Hikmet", "Mukaddime", "Kelile ve Dimne"],
      cozum: "Söz, Mevlânâ'nın Mesnevî'sinde yer alır.",
      fc: ["Mesnevî'de adalet nasıl tanımlanır?", "Her şeyi layık olduğu yere koymak olarak."]
    },
    {
      bi: 0,
      metin: "Ekonomik alanda adaletin karşılığı hangisidir?",
      secenekler: [
        "Ölçü ve tartıyı doğru kullanmak",
        "Kazancı artırmak için fiyat yükseltmek",
        "Ticareti sınırlandırmak",
        "Borçlanmayı yasaklamak"
      ],
      cozum: "Ekonomik alanda adalet, ölçü ve tartıda doğruluğu gerektirir.",
      fc: ["Ekonomik alanda adalet nedir?", "Ölçü ve tartıyı doğru kullanmak."]
    },
    {
      bi: 0,
      metin: "Hz. Peygamber'in peygamberlik öncesinde haksızlıklarla mücadele etmek üzere katıldığı topluluk hangisidir?",
      secenekler: ["Hilfülfudul", "Dârünnedve", "Suffe", "Mele-i a'lâ"],
      cozum: "Hilfülfudul, haksızlıklara karşı kurulan bir topluluktur.",
      fc: ["Hilfülfudul nedir?", "Haksızlıklarla mücadele için kurulan topluluk."]
    },
    {
      bi: 0,
      metin: "Allah'ın her varlığa yaratılışına uygun imkân ve kabiliyet bahşetmesini ifade eden ismi hangisidir?",
      secenekler: ["Adl", "Melik", "Rezzak", "Kuddüs"],
      cozum: "Adl ismi, Allah'ın adil olmasını ve herkese hakkını vermesini ifade eder.",
      fc: ["Adl ismi ne demektir?", "Allah'ın adil olması; her varlığa hakkını ve kabiliyetini vermesi."]
    },
    {
      bi: 0,
      metin: "Enam suresi 160. ayete göre bir iyiliğin karşılığı nedir?",
      secenekler: [
        "On katı",
        "Yarısı",
        "Aynısı",
        "Yüz katı"
      ],
      cozum: "Ayet, iyiliğe on kat karşılık verileceğini, kötülüğün ise misliyle cezalandırılacağını bildirir.",
      fc: ["İyiliğin karşılığı kaç kattır?", "On katı (Enam suresi 160. ayet)."]
    },
    {
      bi: 0,
      metin: "İnsanların eşit doğduğu gerçeğinden hareketle herkese aynı hakların tanınmasını ifade eden adalet ilkesi hangisidir?",
      secenekler: ["Eşitlik", "Liyakat", "Şeffaflık", "Emanet"],
      cozum: "Eşitlik ilkesi, kanun ve uygulamaların ayrımcı olmamasını gerektirir.",
      fc: ["Eşitlik ilkesi nedir?", "Herkesin aynı haklara sahip olması, ayrımcılık yapılmaması."]
    },
    {
      bi: 0,
      metin: "Kararların sonuçlarından sorumlu olmayı ifade eden adalet ilkesi hangisidir?",
      secenekler: ["Hesap verebilirlik", "Ahde vefa", "Hakkaniyet", "Tarafsızlık"],
      cozum: "Hesap verebilirlik, alınan kararların sonuçlarından sorumlu olmayı gerektirir.",
      fc: ["Hesap verebilirlik nedir?", "Alınan kararların ve sonuçlarının sorumluluğunu üstlenmek."]
    },
    {
      bi: 1,
      metin: "Dil, ırk, cinsiyet ve mezhep gibi nedenlerle ayrım yapılmamasını ifade eden ilke hangisidir?",
      secenekler: ["Tarafsızlık", "Liyakat", "Emanet", "Dürüstlük"],
      cozum: "Tarafsızlık, hiçbir kişiye veya zümreye ayrıcalık tanınmamasını ifade eder.",
      fc: ["Tarafsızlık nedir?", "Ayrım yapılmaması, hiçbir kişiye ayrıcalık tanınmaması."]
    },
    {
      bi: 1,
      metin: "Bir sürecin açıklık, dürüstlük ve denetlenebilirlik ilkeleriyle yürütülmesini sağlayan ilke hangisidir?",
      secenekler: ["Şeffaflık", "Ahde vefa", "Hakkaniyet", "Eşitlik"],
      cozum: "Şeffaflık, adalet algısını güçlendirir ve denetlenebilirliği sağlar.",
      fc: ["Şeffaflık nedir?", "Açıklık, dürüstlük ve denetlenebilirlik ilkesi."]
    },
    {
      bi: 1,
      metin: "Görevi başarıyla yapabilme yetisine göre yetki verilmesini öngören ilke hangisidir?",
      secenekler: ["Liyakat", "Eşitlik", "Emanet", "Tarafsızlık"],
      cozum: "Liyakat, yeterlilik ilkesidir; görevler ehil kişilere verilmelidir.",
      fc: ["Liyakat nedir?", "Yeterlilik; görevi başarıyla yapabilme yetisine göre yetki verilmesi."]
    },
    {
      bi: 1,
      metin: "Rüşvet almamak ve adaleti olumsuz etkileyecek davranışlardan uzak durmak hangi ilkeyle ilgilidir?",
      secenekler: ["Emanet", "Liyakat", "Şeffaflık", "Eşitlik"],
      cozum: "Devletin makamları da emanettir; rüşvet emanet ilkesine aykırıdır.",
      fc: ["Emanet ilkesi nedir?", "Korunması istenen maddi ve manevi değerlere sahip çıkmak."]
    },
    {
      bi: 1,
      metin: "Gerçeği söylemek ve ahlaki değerlere uygun davranmak hangi ilkenin gereğidir?",
      secenekler: ["Dürüstlük", "Ahde vefa", "Hakkaniyet", "Tarafsızlık"],
      cozum: "Dürüstlük, adaletin sağlanması ve sürdürülmesi için hayati önemdedir.",
      fc: ["Dürüstlük nedir?", "Gerçeği söylemek, doğru davranmak ve ahlaki değerlere uymak."]
    },
    {
      bi: 1,
      metin: "Ödül ve sorumluluk paylaşımında bireysel farklılıkları gözeterek hakkı olana razı olma durumu hangisidir?",
      secenekler: ["Hakkaniyet", "Eşitlik", "Şeffaflık", "Emanet"],
      cozum: "Hakkaniyet, her olayın kendi özelliklerine göre değerlendirilmesini sağlar.",
      fc: ["Hakkaniyet nedir?", "Bireysel farklılıkları gözeterek hakkı olana razı olma durumu."]
    },
    {
      bi: 1,
      metin: "Nisa suresi 58. ayette Müslümanlara verilen iki emir hangisidir?",
      secenekler: [
        "Emanetleri ehline vermek ve adaletle hükmetmek",
        "Zekât vermek ve oruç tutmak",
        "Ticareti sürdürmek ve borcu ödemek",
        "Barış yapmak ve anlaşma imzalamak"
      ],
      cozum: "Ayet, emanetlerin ehline verilmesini ve adaletle hükmedilmesini emreder.",
      fc: ["Nisa suresi 58. ayetin emirleri nedir?", "Emanetleri ehline vermek ve adaletle hükmetmek."]
    }
  ]
});

/* --------------------------------------------- 3.3 */
yazKonu({
  konu_id: "din_10_u03_k03",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "3.3 İslam ve Barış",
  kazanim: "İslam'ın barışa verdiği önemi ve barışın hayata katkısını açıklar.",
  kaynak: kaynak("95-101"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "İslam kavramının barışla ilişkisini ve barış ilkelerini açıklar.",
    "Barışın bireysel ve toplumsal hayata katkısını yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "İslam kavramının kökü hangi anlamlara gelir?",
      secenekler: [
        "Kurtuluşa erme, güven ve emniyette olma, barış yapma",
        "Savaşma, fethetme ve hükmetme",
        "Öğrenme, öğretme ve yazma",
        "Ticaret yapma, kazanma ve biriktirme"
      ],
      cozum: "İslam, s-l-m kökünden gelir; kurtuluş, güven, esenlik ve barış anlamlarını taşır.",
      fc: ["İslam ne demektir?", "Kurtuluşa erme, güven ve emniyette olma, barış yapma."]
    },
    {
      bi: 0,
      metin: "Barış ve esenlik sahibi olan, kurtuluşa erdiren anlamına gelen Allah ismi hangisidir?",
      secenekler: ["Selam", "Samed", "Sabur", "Şekur"],
      cozum: "Selam, Allah'ın isimlerinden olup barış ve esenlik sahibi demektir.",
      fc: ["Selam ismi ne demektir?", "Barış ve esenlik sahibi olan, kurtuluşa erdiren."]
    },
    {
      bi: 0,
      metin: "Medine'de farklı inanç gruplarının birlikte yaşamasını düzenleyen antlaşma hangisidir?",
      secenekler: ["Medine Vesikası", "Hudeybiye Antlaşması", "Akabe Biatı", "Ficâr Antlaşması"],
      cozum: "Medine Vesikası, birlikte yaşama modelinin esaslarını belirlemiştir.",
      fc: ["Medine Vesikası nedir?", "Medine'de farklı dinî ve etnik gruplar arasında birlikte yaşamayı düzenleyen antlaşma."]
    },
    {
      bi: 0,
      metin: "Müslümanın can, akıl, nesil, din ve mal emniyetini sağlamaya çalışması hangi değerle ilişkilidir?",
      secenekler: ["Barış", "Cesaret", "Cömertlik", "Sabır"],
      cozum: "İslam, yeryüzünde huzur ve güvenin, temel emniyetlerin sağlanmasını ister.",
      fc: ["Barışın gerektirdiği emniyetler hangileridir?", "Can, akıl, nesil, din ve mal emniyeti."]
    },
    {
      bi: 0,
      metin: "\"Ey iman edenler! Hep birden İslam'a (barışa) girin.\" ayeti hangi surededir?",
      secenekler: ["Bakara suresi", "Nisa suresi", "Maide suresi", "Enfal suresi"],
      cozum: "Ayet, Bakara suresi 208. ayette yer alır ve barışa bütünüyle girmeyi emreder.",
      fc: ["Barışa girmeyi emreden ayet hangi surededir?", "Bakara suresi."]
    },
    {
      bi: 0,
      metin: "Müslümanın kendisiyle ve çevresiyle barışık olması hangi yolla elde edilir?",
      secenekler: [
        "İslam'ın emir ve yasaklarına uymakla",
        "Toplumdan uzaklaşmakla",
        "Servet biriktirmekle",
        "Tartışmalara girmemekle"
      ],
      cozum: "Emir ve yasaklara uyan kişi iç huzura kavuşur ve bu huzuru çevresine taşır.",
      fc: ["Barışıklık nasıl elde edilir?", "İslam'ın emir ve yasaklarına uymakla."]
    },
    {
      bi: 0,
      metin: "İslam'a göre imanın en üstün şubesi hangisidir?",
      secenekler: [
        "\"La ilahe illallah\" sözü",
        "Hacca gitmek",
        "Sadaka vermek",
        "Kur'an okumak"
      ],
      cozum: "Hadiste imanın en üstün şubesinin \"La ilahe illallah\" sözü olduğu bildirilir.",
      fc: ["İmanın en üstün şubesi nedir?", "\"La ilahe illallah\" sözü."]
    },
    {
      bi: 1,
      metin: "Barış ve adaletin hâkim olduğu dönemlerde toplumda hangi gelişme beklenir?",
      secenekler: [
        "Bilim, felsefe, edebiyat ve sanatın gelişmesi",
        "Göç hareketlerinin durması ve nüfusun sabit kalması",
        "Ticaretin sona ermesi ve pazarların kapanması",
        "Nüfusun azalması ve şehirlerin boşalması"
      ],
      cozum: "Kitapta barış dönemlerinde şehirlerin imar edildiği, bilim ve sanatın geliştiği belirtilir.",
      fc: ["Barış ortamının topluma katkısı nedir?", "İmar, bilim, felsefe, edebiyat ve sanatın gelişmesi."]
    },
    {
      bi: 1,
      metin: "Savaşların toplumsal sonucu hangisidir?",
      secenekler: [
        "Medeniyetlerin yıkılması ve merhamet duygusunun zayıflaması",
        "Adaletin güçlenmesi ve toplumsal güvenin artması",
        "Bilimsel gelişmenin hızlanması ve refahın çoğalması",
        "Sınırların genişlemesi ve ticaretin canlanması"
      ],
      cozum: "Savaşlar medeniyetleri yıkar; merhamet, hak ve adalet duygusunu zayıflatır.",
      fc: ["Savaşın yıkıcı sonucu nedir?", "Medeniyetlerin yıkılması, merhamet ve adalet duygusunun yok olması."]
    },
    {
      bi: 1,
      metin: "Hz. Peygamber'in Medine'de farklı grupların liderleriyle bir araya gelmesinin amacı hangisidir?",
      secenekler: [
        "Herkesin güven içinde yaşayabileceği adil bir ortam oluşturmak",
        "Ticaret yollarını denetim altına almak ve vergi toplamak",
        "Yeni bir ordu kurarak sınırları genişletmek",
        "Vergi düzenini belirleyip hazineyi güçlendirmek"
      ],
      cozum: "Amaç, kan davaları ve çatışmalar yerine adil ve güvenli bir birlikte yaşama ortamı kurmaktır.",
      fc: ["Medine'de birlikte yaşama modelinin amacı nedir?", "Güven içinde yaşanacak adil bir ortam oluşturmak."]
    },
    {
      bi: 1,
      metin: "İslam'ın barış ilkesi bireyin hangi özelliğini geliştirir?",
      secenekler: [
        "İnsanlara huzur ve güven vermesini",
        "Rekabette öne geçmesini",
        "Servetini artırmasını",
        "Toplumsal statüsünü yükseltmesini"
      ],
      cozum: "Müslüman, insanlara huzur ve güven veren kimsedir.",
      fc: ["Müslümanın çevresine yansıttığı nedir?", "Huzur ve güven."]
    },
    {
      bi: 1,
      metin: "Barışın korunması için hak sahibine hakkının verilmesi hangi değerle doğrudan ilişkilidir?",
      secenekler: ["Adalet", "Cömertlik", "Tevekkül", "Zühd"],
      cozum: "Barış, adaletin sağlanmasıyla sürdürülebilir.",
      fc: ["Barışın sürdürülmesi hangi değere bağlıdır?", "Adalete."]
    },
    {
      bi: 1,
      metin: "İslam'ın barışa verdiği önemi gösteren uygulama hangisidir?",
      secenekler: [
        "Farklı inanç gruplarıyla antlaşma yapılması",
        "Toplulukların ayrı mahallelerde yaşatılması",
        "Ticaretin geçici süreyle durdurulması",
        "Silahlanmanın hızla artırılması"
      ],
      cozum: "Medine Vesikası, farklı inanç gruplarıyla yapılan antlaşmaya örnektir.",
      fc: ["İslam'ın barışa verdiği önemin örneği nedir?", "Farklı inanç gruplarıyla yapılan Medine Vesikası."]
    },
    {
      bi: 1,
      metin: "\"Son sözü 'La ilahe illallah' olan kimse cennete girer.\" hadisi hangi konuyla ilişkilidir?",
      secenekler: [
        "Tevhidin son nefese kadar korunması",
        "Ticaret ahlakı",
        "Aile hayatı",
        "Çevre bilinci"
      ],
      cozum: "Hadis, tevhit inancının hayatın sonuna kadar korunmasına işaret eder.",
      fc: ["Son sözü tevhit olan kimse için ne buyrulmuştur?", "Cennete gireceği bildirilmiştir."]
    }
  ]
});

console.log("din tur-2 (3. ünite): 3 havuz yazıldı");
