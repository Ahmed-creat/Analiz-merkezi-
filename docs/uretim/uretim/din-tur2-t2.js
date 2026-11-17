#!/usr/bin/env node
/* ============================================================
   DİN KÜLTÜRÜ 10 · TUR-2 · 2. ÜNİTE — kitaptan sıfırdan havuzlar
   ------------------------------------------------------------
   Kaynak: MEB Din Kültürü 10 (2025) — din.json (kitap-kaynak).
   Basılı sayfa = PDF sayfası − 1.

     2.1 Allah'ın Varlığının Delilleri          s.45-55  (12 soru)
     2.2 Allah'ı İsim ve Sıfatlarıyla Tanımak   s.57-67  (15 soru)

   Zip kaynaklı eski sürümler `arsiv/soru_havuzlari/din/zip-*`.

   Kullanım: node docs/uretim/uretim/din-tur2-t2.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Din Kültürü";
const DOSYA = "din-10.pdf (MEB, 2025)";
const kaynak = s => "Din Kültürü 10 ders kitabı, s." + s;
const TEMA = 2;
const TEMA_ADI = "Allah'ı Tanımak";

/* --------------------------------------------- 2.1 */
yazKonu({
  konu_id: "din_10_u02_k01",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "2.1 Allah'ın Varlığının Delilleri",
  kazanim: "Allah'ın varlığının delillerini sınıflandırarak açıklar.",
  kaynak: kaynak("45-55"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Allah'ın varlığının delillerini sınıflandırır ve delilin işlevini açıklar.",
    "Delilleri ayet, hadis ve örneklerle ilişkilendirerek yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Allah'ın varlığını ispatlamak amacıyla ortaya konulan deliller hangi seçenekte birlikte verilmiştir?",
      secenekler: [
        "Kozmolojik, teleolojik, ontolojik ve dinî tecrübe delilleri",
        "Fıkhi, kelami, tasavvufi ve ahlaki deliller",
        "Duyusal, deneysel, tarihsel ve toplumsal deliller",
        "Bilimsel, sanatsal, teknik ve felsefi deliller"
      ],
      cozum: "Kitapta deliller kozmolojik, teleolojik, ontolojik ve dinî tecrübe delilleri olarak sınıflandırılır.",
      fc: ["Allah'ın varlığının delilleri hangileridir?", "Kozmolojik, teleolojik, ontolojik ve dinî tecrübe delilleri."]
    },
    {
      bi: 0,
      metin: "Evrenin hareket etmesi ve bir başlangıcının bulunması gibi konulardan yola çıkan delil hangisidir?",
      secenekler: ["Kozmolojik delil", "Teleolojik delil", "Ontolojik delil", "Dinî tecrübe delili"],
      cozum: "Kozmolojik delil, evrenin hareketi ve başlangıcı üzerinden Allah'ın varlığını kanıtlamaya çalışır.",
      fc: ["Kozmolojik delil nedir?", "Evrenin hareketi ve başlangıcından yola çıkan delil."]
    },
    {
      bi: 0,
      metin: "Evrendeki düzen, ölçü ve amaçlılığı hareket noktası kabul eden delil hangisidir?",
      secenekler: ["Teleolojik delil", "Kozmolojik delil", "Ontolojik delil", "Dinî tecrübe delili"],
      cozum: "Teleolojik delil, varlığı amaçlılık ve nizam yönüyle açıklar.",
      fc: ["Teleolojik delil nedir?", "Evrendeki düzen ve amaçlılıktan hareket eden delil."]
    },
    {
      bi: 0,
      metin: "İnsan zihninde bulunan mükemmel varlık düşüncesinden hareket eden delil hangisidir?",
      secenekler: ["Ontolojik delil", "Teleolojik delil", "Kozmolojik delil", "Dinî tecrübe delili"],
      cozum: "Ontolojik delil, ekmel varlık düşüncesinden yola çıkarak Allah'ın varlığını temellendirir.",
      fc: ["Ontolojik delil nedir?", "İnsandaki mükemmel varlık düşüncesinden hareket eden delil."]
    },
    {
      bi: 0,
      metin: "İnancın akli temellere ve sağlam delillere dayandırılmasının birey açısından sonucu hangisidir?",
      secenekler: [
        "İnanç dünyasının güçlenmesi ve davranış tutarlılığı",
        "İbadetlerin sayısının artması",
        "Toplumsal statünün yükselmesi",
        "Bilimsel çalışmaların hızlanması"
      ],
      cozum: "Bilgiye dayalı inanç, davranış tutarlılığı ve inanç-ibadet-ahlak bütünlüğü sağlar.",
      fc: ["Delile dayalı inancın katkısı nedir?", "İnanç dünyasını güçlendirmesi, davranış tutarlılığı sağlaması."]
    },
    {
      bi: 0,
      metin: "Hudus deliline göre âlemin sonradan meydana geldiğini gösteren durum hangisidir?",
      secenekler: [
        "Âlemde sürekli değişim yaşanması",
        "Âlemin sonsuz olması",
        "Varlıkların birbirine benzemesi",
        "İnsanın âlemi gözlemlemesi"
      ],
      cozum: "Her değişen sonradan meydana geldiği için âlem de bir yaratıcıya muhtaçtır.",
      fc: ["Hudus delili nedir?", "Âlemin değişime uğradığı, dolayısıyla sonradan yaratıldığı düşüncesine dayanan delil."]
    },
    {
      bi: 1,
      metin: "\"Her hareket edenin bir hareket ettiricisi vardır.\" önermesi hangi delil içinde yer alır?",
      secenekler: ["Kozmolojik delil", "Ontolojik delil", "Teleolojik delil", "Dinî tecrübe delili"],
      cozum: "Hareketten hareket ettiriciye ulaşan çıkarım kozmolojik delilin kanıtlarındandır.",
      fc: ["Hareket ettirici kanıtı hangi delile aittir?", "Kozmolojik delil."]
    },
    {
      bi: 1,
      metin: "\"Şüphesiz biz her şeyi bir ölçüye göre yarattık.\" ayeti hangi delile örnek gösterilir?",
      secenekler: ["Teleolojik delil", "Kozmolojik delil", "Ontolojik delil", "Dinî tecrübe delili"],
      cozum: "Ayet evrendeki ölçü ve düzene işaret ettiği için teleolojik delile örnektir.",
      fc: ["Ölçü ve düzen ayetleri hangi delile örnektir?", "Teleolojik delil."]
    },
    {
      bi: 1,
      metin: "Güneş'in Dünya'yı ısıtmak ve aydınlatmak üzere yaratılmış olması hangi delille ilişkilidir?",
      secenekler: ["Teleolojik delil", "Ontolojik delil", "Kozmolojik delil", "Dinî tecrübe delili"],
      cozum: "Varlıkların bir amaca yönelik yaratılması teleolojik delilin konusudur.",
      fc: ["Varlıklardaki amaçlılık hangi delile işaret eder?", "Teleolojik delil."]
    },
    {
      bi: 1,
      metin: "Dinî tecrübe delilini diğer delillerden ayıran özellik hangisidir?",
      secenekler: [
        "Bireysel manevi yaşantıya dayanması",
        "Evrenin başlangıcını konu alması",
        "Zihinsel bir kavramdan yola çıkması",
        "Evrendeki düzeni açıklaması"
      ],
      cozum: "Dinî tecrübe bireysel yaşantıya dayanır ve başkasına aynı biçimde aktarılamaz.",
      fc: ["Dinî tecrübe delili nedir?", "İnanma duygusu ve manevi deneyimlerden hareket eden delil."]
    },
    {
      bi: 1,
      metin: "Hz. İbrahim'in gök cisimlerini gözlemleyerek \"Batanları sevmem.\" sonucuna ulaşması hangi yönteme dayanır?",
      secenekler: [
        "Gözleme dayalı akıl yürütme",
        "Vahye doğrudan başvurma",
        "Toplumsal gelenekleri izleme",
        "Duyuları tümüyle reddetme"
      ],
      cozum: "Hz. İbrahim, gözlemlediği gök cisimlerinin batmasından hareketle akıl yürütmüştür.",
      fc: ["Hz. İbrahim'in delillendirme yöntemi nedir?", "Gözleme dayalı akıl yürütme."]
    },
    {
      bi: 1,
      metin: "İnançla ilgili iddiaların kanıtla desteklenmesi gerektiğine işaret eden ayet hangisidir?",
      secenekler: [
        "\"Eğer doğru söyleyenler iseniz kesin delilinizi getirin.\"",
        "\"Üstlerindeki göğe bakmazlar mı?\"",
        "\"Şüphesiz biz her şeyi bir ölçüye göre yarattık.\"",
        "\"Gözler O'nu idrak edemez.\""
      ],
      cozum: "Ayet, inanç konusundaki iddiaların delille temellendirilmesini ister.",
      fc: ["İnanç ile delil arasındaki ilişki nedir?", "İnanç iddialarının kanıtla desteklenmesi gerekir; ayet kesin delil ister."]
    }
  ]
});

/* --------------------------------------------- 2.2 */
yazKonu({
  konu_id: "din_10_u02_k02",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "2.2 Allah'ı İsim ve Sıfatlarıyla Tanımak",
  kazanim: "Allah'ın isim ve sıfatlarını sınıflandırarak açıklar.",
  kaynak: kaynak("57-67"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Allah'ın isimlerini gruplandırır ve anlamlarını açıklar.",
    "İsim-sıfat ilişkisini ve isimlerin davranışlara yansımasını yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Allah'a ait güzel isimleri ifade etmek için kullanılan kavram hangisidir?",
      secenekler: ["Esmayıhüsna", "Marifetullah", "Tevhit", "Tenzih"],
      cozum: "Esmayıhüsna, Allah'ın zatını, sıfatlarını ve fiillerini tanımlayan güzel isimlerdir.",
      fc: ["Esmayıhüsna nedir?", "Allah'ın zat, sıfat ve fiillerini tanımlayan güzel isimleri."]
    },
    {
      bi: 0,
      metin: "Allah'ın isimleri kitapta hangi üç başlık altında incelenir?",
      secenekler: [
        "Zatıyla, kâinatla ve insanla ilgili isimleri",
        "Evvel, Baki ve Samed isimleri",
        "Zatî, sübûtî ve fiilî isimleri",
        "Celal, cemal ve kemal isimleri"
      ],
      cozum: "İsimler; zatıyla, kâinatla ve insanla ilgili olmak üzere üç grupta ele alınır.",
      fc: ["Allah'ın isimleri kaç grupta incelenir?", "Zatıyla, kâinatla ve insanla ilgili olmak üzere üç."]
    },
    {
      bi: 0,
      metin: "Yalnızca Allah'ta bulunan, başka varlıklarda görülmeyen özellikleri ifade eden isim grubu hangisidir?",
      secenekler: [
        "Zatıyla ilgili isimler",
        "Kâinatla ilgili isimler",
        "İnsanla ilgili isimler",
        "Fiillerle ilgili isimler"
      ],
      cozum: "Evvel ve Baki gibi isimler yalnızca Allah'a özgü olan zatî özellikleri ifade eder.",
      fc: ["Zatıyla ilgili isimler nedir?", "Yalnızca Allah'ta bulunan özellikleri ifade eden isimler."]
    },
    {
      bi: 0,
      metin: "Allah'ın varlığının başlangıcı olmadığını ifade eden isim hangisidir?",
      secenekler: ["Evvel", "Baki", "Samed", "Kebir"],
      cozum: "Evvel, varlığının başlangıcı bulunmayan anlamına gelir.",
      fc: ["Evvel ne demektir?", "Varlığının başlangıcı olmayan."]
    },
    {
      bi: 0,
      metin: "Allah'ın ölümsüz olduğunu, yok oluşun O'nun için söz konusu olmadığını ifade eden isim hangisidir?",
      secenekler: ["Baki", "Evvel", "Hay", "Aziz"],
      cozum: "Baki, ölümsüz ve kalıcı olan anlamına gelir.",
      fc: ["Baki ne demektir?", "Ölümsüz, yok oluşun söz konusu olmadığı."]
    },
    {
      bi: 0,
      metin: "Varlıklara şekil ve suret veren anlamına gelen isim hangisidir?",
      secenekler: ["Musavvir", "Bâri", "Fâtır", "Melik"],
      cozum: "Musavvir, varlıklara biçim veren demektir.",
      fc: ["Musavvir ne demektir?", "Varlıklara şekil ve suret veren."]
    },
    {
      bi: 0,
      metin: "Örneksiz yaratan anlamına gelen isim hangisidir?",
      secenekler: ["Bâri", "Fâtır", "Halık", "Rezzak"],
      cozum: "Bâri, örneksiz yaratan anlamına gelir.",
      fc: ["Bâri ne demektir?", "Örneksiz yaratan."]
    },
    {
      bi: 0,
      metin: "Yoktan yaratan anlamına gelen isim hangisidir?",
      secenekler: ["Fâtır", "Bâri", "Musavvir", "Rahman"],
      cozum: "Fâtır, yoktan yaratan demektir.",
      fc: ["Fâtır ne demektir?", "Yoktan yaratan."]
    },
    {
      bi: 1,
      metin: "Kullarına tövbe yollarını gösteren ve tövbelerini kabul eden anlamına gelen isim hangisidir?",
      secenekler: ["Tevvab", "Şekur", "Afüv", "Vedud"],
      cozum: "Tevvab, tövbeleri kabul eden anlamına gelir.",
      fc: ["Tevvab ne demektir?", "Kullarına tövbe yollarını gösteren ve tövbelerini kabul eden."]
    },
    {
      bi: 1,
      metin: "Küçük amellere büyük karşılıklar veren anlamına gelen isim hangisidir?",
      secenekler: ["Şekur", "Tevvab", "Kerim", "Cemil"],
      cozum: "Şekur ismi, şükrün karşılığını bol bol veren anlamına gelir.",
      fc: ["Şekur ne demektir?", "Küçük amellere büyük karşılıklar veren."]
    },
    {
      bi: 1,
      metin: "Allah'ın \"gören\" anlamındaki Basir ismi hangi sıfatından kaynaklanır?",
      secenekler: ["Basar", "İlim", "İrade", "Kudret"],
      cozum: "Görme sıfatı olmayan bir varlığın \"gören\" diye nitelendirilmesi mümkün değildir.",
      fc: ["Basir ne demektir?", "Gören; basar (görme) sıfatından kaynaklanan isim."]
    },
    {
      bi: 1,
      metin: "Allah'ın Hay ismi hangi sıfatlarla ilişkilidir?",
      secenekler: [
        "Kudret, tekvin ve ilim",
        "Beka, semi ve kelam",
        "İrade, basar ve kudret",
        "İlim, semi ve beka"
      ],
      cozum: "Hayat vermek için kudret, tekvin ve ilim sıfatları gerekir.",
      fc: ["Hay ne demektir?", "Diri; kudret, tekvin ve ilim sıfatlarıyla ilişkili isim."]
    },
    {
      bi: 1,
      metin: "Hz. Peygamber'in \"Allah güzeldir, güzelliği sever.\" hadisi hangi ismi öne çıkarır?",
      secenekler: ["Cemil", "Kerim", "Aziz", "Vedud"],
      cozum: "Cemil, güzel anlamına gelir; kâinattaki güzellikler bu ismin yansımasıdır.",
      fc: ["Cemil ne demektir?", "Güzel; güzelliğin kaynağı olan."]
    },
    {
      bi: 1,
      metin: "Bir kimsenin çevresini ve doğayı temiz tutması hangi ismin yansımasıdır?",
      secenekler: ["Kuddüs", "Adl", "Hakim", "Kerim"],
      cozum: "Kitapta temizliğe dikkat eden kimsenin Kuddüs ismini yansıttığı belirtilir.",
      fc: ["Kuddüs ne demektir?", "Her türlü eksiklikten uzak, temiz olan."]
    },
    {
      bi: 1,
      metin: "Varlıkları Allah'ın isimlerinin tecellisi olarak görmenin insana yüklediği sorumluluk hangisidir?",
      secenekler: [
        "Varlıklarla merhamete dayalı ilişki kurmak",
        "Varlıkları yalnızca araç olarak görmek",
        "Varlıklara karşı kayıtsız kalmak",
        "Varlıkları sınırsızca tüketmek"
      ],
      cozum: "Tüm varlıklar isimlerin tecellisi olduğu için onlara merhametle yaklaşmak beklenir.",
      fc: ["Varlıklar niçin değerlidir?", "Allah'ın isimlerinin tecellisi oldukları için."]
    }
  ]
});

console.log("din tur-2 (2. ünite): 2 havuz yazıldı");
