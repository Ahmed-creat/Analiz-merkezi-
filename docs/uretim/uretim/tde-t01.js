#!/usr/bin/env node
/* ============================================================
   TDE · 1. TEMA (SÖZÜN EZGİSİ) — konu ağacı havuzları
   ------------------------------------------------------------
   Kaynak: 10. sınıf TDE ders notları (Mustafa Çiftçi, 149 s.)
           "10.Edebiyat.Ders.notlari.Yeni.Mufredat.pdf"
   Konular uygulamanın Bilgi Bankası müfredat ağacından alınır
   (konular.js → "Türk Dili ve Edebiyatı" 10).

   Bu dosya ilk beş konuyu üretir:
     edebiyat_10_u01_k01  Koşuk   (s.11-12)
     edebiyat_10_u01_k02  Sav     (s.12)
     edebiyat_10_u01_k03  Türkü   (s.14-15)
     edebiyat_10_u01_k04  Koşma   (s.17-18)
     edebiyat_10_u01_k05  Masal   (s.19-21)

   Kullanım: node docs/uretim/uretim/tde-t01.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Türk Dili ve Edebiyatı";
const DOSYA = "10.Edebiyat.Ders.notlari.Yeni.Mufredat.pdf";
const TEMA = 1;
const TEMA_ADI = "Sözün Ezgisi";

function kaynak(s) {
  return "10. sınıf TDE ders notları (Mustafa Çiftçi), s." + s;
}

/* ---------------- 1) KOŞUK ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u01_k01",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Koşuk",
  kazanim:
    "Koşuğun İslamiyet öncesi sözlü dönemdeki yerini, biçim özelliklerini ve benzer türlerle ilişkisini çözümleyebilme.",
  kaynak: kaynak("11-12"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Koşuğun oluştuğu sözlü dönemi ve söylenme ortamını belirler.",
    "Koşuğun biçim, ölçü ve dil özelliklerini çözümler.",
    "Koşuğu koşma ve gazel gibi benzer türlerle karşılaştırır."
  ],
  items: [
    {
      bi: 0,
      metin:
        "İslamiyet öncesi dönemde sığır adı verilen sürek avlarının ardından toy ve şölen denilen toplu ziyafetler düzenlenir, bu ziyafetlerde kopuz eşliğinde şiirler söylenirdi. Bu ortamlarda söylenen şiir türü hangisidir?",
      secenekler: ["Koşuk", "Sagu", "Sav", "Destan"],
      cozum:
        "Konu anlatımında koşuk, avlardan sonra eğlence amacıyla yapılan toplu ziyafetlerde, sığır avlarında ve toy/şölen denilen ziyafetlerde söylenen şiir olarak tanımlanır. Sagu ölüm, sav ise atasözü niteliğindedir.",
      fc: [
        "Koşuğun söylenme ortamı nedir?",
        "Sığır adı verilen sürek avlarında ve toy ya da şölen denilen ziyafetlerde söylenirdi."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir araştırmacı, İslamiyet öncesi sözlü dönem ürünlerinin günümüze ulaşmasını sağlayan kaynağı incelerken koşuk örneklerine ulaşmak istemektedir. Araştırmacının başvurması gereken eser hangisidir?",
      secenekler: [
        "Divanü Lügati't Türk",
        "Kutadgu Bilig",
        "Divan-ı Hikmet",
        "Atabetü'l-Hakayık"
      ],
      cozum:
        "Konu anlatımında sözlü dönem ürünlerinin günümüze ulaşmasını sağlayan en önemli eserin, Türk dilinin ilk sözlüğü olan Divanü Lügati't Türk olduğu belirtilir; koşukların ilk örnekleri de bu eserdedir.",
      fc: [
        "Koşukların ilk örneklerinin bulunduğu eser nedir?",
        "Kaşgarlı Mahmut'un Divanü Lügati't Türk adlı eserinde."
      ]
    },
    {
      bi: 1,
      metin:
        "Koşukta nazım birimi ve ölçü bakımından hangisi geçerlidir?",
      secenekler: [
        "Dörtlük ve hece ölçüsü",
        "Beyit ve aruz ölçüsü",
        "Bent ve aruz ölçüsü",
        "Dize ve serbest ölçü"
      ],
      cozum:
        "Koşuk hece ölçüsüyle söylenir ve nazım birimi dörtlüktür. Beyit–aruz birlikteliği divan şiirinin, bent ise türkü ve şarkının özelliğidir.",
      fc: [
        "Koşuğun nazım birimi ve ölçüsü nedir?",
        "Nazım birimi dörtlük, ölçüsü hece ölçüsüdür."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir koşuk metninde dizelerin uyaklanışı incelendiğinde ilk üç dizenin kendi aralarında, dördüncü dizenin ise sonraki dörtlüğe bağlandığı görülür. Bu metnin uyak düzeni hangisidir?",
      secenekler: ["aaab, cccb", "abab, cccb", "aabb, ccdd", "abba, cddc"],
      cozum:
        "Koşukta uyak düzeni aaab, cccb biçimindedir. abab, cccb koşmanın uyak düzenidir; aabb ve abba düzenleri bu türde kullanılmaz.",
      fc: [
        "Koşuğun uyak düzeni nedir?",
        "aaab, cccb, dddb… biçiminde; yani ilk üç dize kendi arasında uyaklı, dördüncü dize ortak uyaklıdır."
      ]
    },
    {
      bi: 1,
      metin:
        "Koşuklarda kullanılan kelimelerin saf Türkçe olması, bu şiirlerin hangi özelliğini gösterir?",
      secenekler: [
        "Yabancı etkilere kapalı bir dönemde oluştuğunu",
        "Aruz ölçüsünün henüz bilinmediğini",
        "Şiirlerin yazıya geçirildiğini",
        "Konuların tamamen dinî olduğunu"
      ],
      cozum:
        "Konu anlatımında kelimelerin saf Türkçe olması, dönemin yabancı etkilere kapalı olmasına bağlanır. Koşuklarda aruz değil hece ölçüsü kullanılır ve ürünler sözlüdür.",
      fc: [
        "Koşuklarda dilin saf Türkçe olmasının nedeni nedir?",
        "Sözlü dönemin yabancı etkilere kapalı olması, bu yüzden kelimelerin saf Türkçe kalmasıdır."
      ]
    },
    {
      bi: 1,
      metin:
        "Ozan, kam, baksı ve şaman gibi kişiler koşukları kopuz adı verilen enstrüman eşliğinde söylerdi. Bu durum koşuğun hangi yönünü gösterir?",
      secenekler: [
        "Müzikle birlikte icra edilen sözlü bir tür olduğunu",
        "Yalnızca saray çevresinde üretildiğini",
        "Yazılı kültürün ürünü olduğunu",
        "Konularının yalnızca savaş olduğunu"
      ],
      cozum:
        "Kopuz eşliğinde söylenmesi, koşuğun ezgiyle birlikte icra edilen sözlü bir tür olduğunu gösterir; koşuklar saray çevresiyle sınırlı değildir ve yazılı değildir.",
      fc: [
        "Koşukların icra biçimi nedir?",
        "Ozan, kam, baksı, şaman gibi kişilerce kopuz eşliğinde, sözlü olarak icra edilir."
      ]
    },
    {
      bi: 2,
      metin:
        "Koşuğun halk edebiyatındaki ve divan edebiyatındaki karşılığı hangisinde birlikte ve doğru verilmiştir?",
      secenekler: ["Koşma – Gazel", "Gazel – Koşma", "Mani – Kaside", "Türkü – Mesnevi"],
      cozum:
        "Konu anlatımına göre koşuk, içerik olarak halk edebiyatında koşmaya, divan edebiyatında gazele benzer; bu yüzden karşılıkları koşma ve gazeldir.",
      fc: [
        "Koşuğa karşılık gelen türler nedir?",
        "Halk edebiyatında koşma, divan edebiyatında gazeldir."
      ]
    },
    {
      bi: 2,
      metin:
        "İslamiyet öncesi koşuk ile İslamiyet sonrası koşma arasındaki ilişki için hangisi söylenebilir?",
      secenekler: [
        "Koşuk, koşmanın İslamiyet öncesindeki karşılığıdır.",
        "Koşma, koşuğun divan edebiyatındaki karşılığıdır.",
        "İki tür de aruz ölçüsüyle yazılır.",
        "İki tür de ölüm konusunu işler."
      ],
      cozum:
        "Konu anlatımında koşmanın İslamiyet öncesi Türk edebiyatındaki adının koşuk, divan edebiyatındaki karşılığının ise gazel olduğu belirtilir.",
      fc: [
        "Koşuğun İslamiyet sonrasındaki devamı nedir?",
        "Koşuk, İslamiyet öncesi dönemde koşmanın taşıdığı işlevi üstlenen nazım biçimidir."
      ]
    },
    {
      bi: 2,
      metin:
        "Bir öğrenci koşuk, sagu ve sav türlerini karşılaştırmaktadır. Bu üç tür içinde yalnızca koşuğa özgü olan özellik hangisidir?",
      secenekler: [
        "Aşk, doğa ve sevinç konularını işlemesi",
        "Dörtlükler hâlinde söylenmesi",
        "Hece ölçüsüyle yazılmış olması",
        "Sözlü dönemde ortaya çıkması"
      ],
      cozum:
        "Dörtlük, hece ölçüsü ve sözlü dönem özellikleri sagu ile koşukta ortaktır; sav ise kısa özlü sözdür. Sevinç, aşk, yiğitlik ve doğa konuları koşuğa özgüdür.",
      fc: [
        "Koşuğu sagu ve savdan ayıran konu özelliği nedir?",
        "Aşk, hasret, yiğitlik ve doğa sevgisi gibi dünyevi, coşkulu konuları işlemesidir."
      ]
    },
    {
      bi: 0,
      metin:
        "Koşukların ilk örneklerinin yer aldığı eser ile bu eserin yazarı hangisinde birlikte verilmiştir?",
      secenekler: [
        "Divanü Lügati't Türk – Kaşgarlı Mahmut",
        "Kutadgu Bilig – Yusuf Has Hacip",
        "Divan-ı Hikmet – Ahmed Yesevi",
        "Atabetü'l-Hakayık – Edip Ahmet Yükneki"
      ],
      cozum:
        "Konu anlatımında koşukların ilk örneklerine Kaşgarlı Mahmut'un yazdığı Divanü Lügati't Türk'te rastlandığı belirtilir.",
      fc: [
        "Koşukların ilk örneklerinin kaynağı nedir?",
        "Kaşgarlı Mahmut, Divanü Lügati't Türk adlı eserinde koşukların ilk örneklerini kaydetmiştir."
      ]
    }
  ]
});

/* ---------------- 2) SAV ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u01_k02",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Sav",
  kazanim:
    "Savın sözlü dönemdeki yerini, anlamını ve divan edebiyatındaki karşılığını çözümleyebilme.",
  kaynak: kaynak("12"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Savın tanımını ve sözlü dönemdeki yerini belirler.",
    "Sav örneklerinin anlamını çözümler.",
    "Savı divan edebiyatındaki karşılığıyla ilişkilendirir."
  ],
  items: [
    {
      bi: 0,
      metin:
        "İslamiyet öncesi sözlü dönemde yaşam deneyimlerini kısa ve özlü biçimde aktaran, günümüzdeki atasözlerinin karşılığı olan sözler hangi adla anılır?",
      secenekler: ["Sav", "Koşuk", "Sagu", "Destan"],
      cozum:
        "Konu anlatımında sav, İslamiyet öncesi sözlü dönemde günümüzdeki atasözlerinin karşılığı olan kısa, özlü sözler olarak tanımlanır.",
      fc: [
        "Sav nedir?",
        "İslamiyet öncesi sözlü dönemde yaşam deneyimlerini aktaran, atasözü niteliğindeki kısa ve özlü sözlerdir."
      ]
    },
    {
      bi: 0,
      metin:
        "Sav türünün İslamiyet öncesi sözlü dönemde ortaya çıkması, aşağıdakilerden hangisiyle doğrudan ilişkilidir?",
      secenekler: [
        "Dönemde yazının kullanılmıyor olmasıyla",
        "Aruz ölçüsünün yaygın olmasıyla",
        "Saray edebiyatının gelişmiş olmasıyla",
        "Divan edebiyatının etkisiyle"
      ],
      cozum:
        "Konu anlatımında bu dönemde yazının henüz kullanılmadığı, eserlerin sözlü olarak kuşaktan kuşağa aktarıldığı belirtilir. Sav bu sözlü ortamın ürünüdür.",
      fc: [
        "Savların sözlü dönem ürünü olmasının nedeni nedir?",
        "Dönemde yazı henüz kullanılmadığı için deneyimler sözlü olarak, kulaktan kulağa aktarılıyordu."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir öğrenci, savların hangi işlevi yerine getirdiğini araştırmaktadır. Savların temel işlevi hangisidir?",
      secenekler: [
        "Yaşam deneyimlerini sonraki kuşaklara aktarmak",
        "Ölen kişinin iyiliklerini anlatmak",
        "Av sonrası eğlenceyi düzenlemek",
        "Kahramanlık olaylarını destanlaştırmak"
      ],
      cozum:
        "Savlar yaşam deneyimlerini aktarır. Ölen kişinin iyiliklerini anlatmak saguya, av sonrası eğlence koşuğa aittir.",
      fc: [
        "Savların işlevi nedir?",
        "Toplumun yaşam deneyimlerini kısa ve özlü biçimde sonraki kuşaklara aktarmaktır."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Tag taga kavuşmaz, kişi kişige kavuşur.\" savının günümüz Türkçesindeki karşılığı hangisidir?",
      secenekler: [
        "Dağ dağa kavuşmaz, insan insana kavuşur.",
        "Kanı kanla yıkamazlar.",
        "Aç ne yemez, tok ne demez.",
        "Birler bin olur, damla damla göl olur."
      ],
      cozum:
        "Konu anlatımında bu savın karşılığı \"Dağ dağa kavuşmaz, insan insana kavuşur.\" biçiminde verilir; insanların yeniden karşılaşabileceğini anlatır.",
      fc: [
        "İnsanların yeniden karşılaşabileceğini anlatan savın anlamı nedir?",
        "\"Tag taga kavuşmaz, kişi kişige kavuşur.\" yani dağ dağa kavuşmaz, insan insana kavuşur."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Birin birin ming bolur, tama tama göl bolur.\" savı hangi deneyimi aktarır?",
      secenekler: [
        "Küçük katkıların birikerek büyük sonuç doğurduğunu",
        "İntikamın yeni kötülükler ürettiğini",
        "Tembelliğin yük getirdiğini",
        "Zenginin tok, yoksulun aç olduğunu"
      ],
      cozum:
        "\"Birler bin olur, damla damla göl olur.\" anlamına gelen sav, küçük ve sürekli katkıların birikerek büyük sonuçlar oluşturduğunu anlatır.",
      fc: [
        "Birikimin gücünü anlatan savın anlamı nedir?",
        "\"Birin birin ming bolur, tama tama göl bolur.\" yani birler bin olur, damla damla göl olur."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir öğrenci, tembellik üzerine söylenmiş bir savı yorumlarken \"kolay işler bile o kişiye ağır gelir\" sonucuna ulaşmıştır. Öğrencinin yorumunu destekleyen sav hangisidir?",
      secenekler: [
        "Ermegüke bulıt yük bolır.",
        "Tag taga kavuşmaz, kişi kişige kavuşur.",
        "Kanıg kan bile yumas.",
        "Aç ne yimes, tok ne times."
      ],
      cozum:
        "Konu anlatımında Ermegüke bulıt yük bolır savının karşılığı \"Tembele bulut yük olur.\" biçiminde verilir; yani tembel kişi için kolay işler bile yük hâline gelir.",
      fc: [
        "\"Tembele bulut yük olur.\" sözünün sav olarak karşılığı nedir?",
        "\"Ermegüke bulıt yük bolır.\" savının karşılığıdır."
      ]
    },
    {
      bi: 2,
      metin:
        "Savlar divan edebiyatında hangi adla anılmıştır?",
      secenekler: ["Darb-ı mesel", "Mahlas", "Tapşırma", "Hicviye"],
      cozum:
        "Konu anlatımına göre sav, divan edebiyatında darb-ı mesel adını alır. Mahlas ve tapşırma şairin takma adı, hicviye ise yergi türüdür.",
      fc: [
        "Savın divan edebiyatındaki adı nedir?",
        "Darb-ı meseldir."
      ]
    },
    {
      bi: 2,
      metin:
        "Bir öğrenci sav ile atasözünü karşılaştırırken hangi ortak özelliği vurgulamalıdır?",
      secenekler: [
        "Kalıplaşmış, öğüt veren kısa sözler olmaları",
        "Dörtlüklerle söylenmeleri",
        "Hece ölçüsüyle yazılmaları",
        "Ölüm temasını işlemeleri"
      ],
      cozum:
        "Sav, günümüzdeki atasözünün karşılığıdır; ikisi de kalıplaşmış, kısa, öğüt veren ve deneyim aktaran sözlerdir. Dörtlük ve hece ölçüsü koşuk ile saguya aittir.",
      fc: [
        "Sav ile atasözü arasındaki ilişki nedir?",
        "Sav, İslamiyet öncesi dönemin atasözüdür; ikisi de kalıplaşmış ve öğüt veren kısa sözlerdir."
      ]
    },
    {
      bi: 0,
      metin:
        "Sav örneklerinden \"Kanıg kan bile yumas.\" sözü hangi anlayışı yansıtır?",
      secenekler: [
        "Kötülüğün kötülükle giderilemeyeceğini",
        "Kan bağının her şeyden üstün olduğunu",
        "Savaşın kaçınılmaz olduğunu",
        "Gücün hile ile yenilebileceğini"
      ],
      cozum:
        "\"Kanı kanla yıkamazlar.\" anlamındaki bu sav, kötülüğe kötülükle karşılık verilerek sorunun çözülemeyeceğini anlatır.",
      fc: [
        "\"Kanı kanla yıkamazlar.\" sözünün anlamı nedir?",
        "Kötülüğün kötülükle ortadan kaldırılamayacağını, intikamın sorunu çözmediğini anlatır."
      ]
    },
    {
      bi: 1,
      metin:
        "Savların kısa ve özlü olması hangi işlevi kolaylaştırır?",
      secenekler: [
        "Akılda kalıp kuşaktan kuşağa aktarılmasını",
        "Aruz kalıplarına uydurulmasını",
        "Yazıya geçirilerek saklanmasını",
        "Dörtlükler hâlinde söylenmesini"
      ],
      cozum:
        "Sözlü kültürde aktarım, sözün kısa ve kalıplaşmış olmasıyla kolaylaşır. Savlarda aruz, dörtlük veya yazılı saklama söz konusu değildir.",
      fc: [
        "Sav biçiminin sözlü kültürdeki işlevi nedir?",
        "Kolayca akılda kalmasını ve sözlü kültürde kuşaktan kuşağa aktarılmasını sağlar."
      ]
    }
  ]
});

/* ---------------- 3) TÜRKÜ ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u01_k03",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Türkü",
  kazanim:
    "Türkünün bölümlerini, ölçü ve uyak özelliklerini, benzer türlerle ilişkisini çözümleyebilme.",
  kaynak: kaynak("14-15"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Türkünün bent ve kavuştak bölümlerini belirler.",
    "Türkünün ölçü, uyak ve ezgi özelliklerini çözümler.",
    "Türküyü şarkı ve koşma gibi türlerle karşılaştırır."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Türkü, kendine özgü bir ezgiyle söylenen bir nazım biçimidir. Bu tanıma göre türküyü öteki halk şiiri biçimlerinden ayıran en belirgin özellik hangisidir?",
      secenekler: ["Ezgiye bağlı olması", "Aruzla yazılması", "Beyitlerle kurulması", "Ölüm konusunu işlemesi"],
      cozum:
        "Türkünün en belirgin özelliği melodisidir; kendine özgü bir ezgiyle söylenir. Aruz ve beyit divan şiirinin, ölüm konusu sagu ile ağıtın özelliğidir.",
      fc: [
        "Türkünün en belirgin özelliği nedir?",
        "Kendine özgü bir ezgiyle, yani melodisiyle söylenmesidir."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir türküde asıl sözlerin bulunduğu ve her bendin sonunda tekrarlanan bölümler bulunmaktadır. Asıl sözlerin bulunduğu bölüme ne ad verilir?",
      secenekler: ["Bent", "Kavuştak", "Döşeme", "Tapşırma"],
      cozum:
        "Asıl sözlerin bulunduğu bölüme bent denir. Her bendin sonunda tekrarlanan bölüm kavuştak (nakarat, bağlama) adını alır; döşeme masalda, tapşırma koşmada görülür.",
      fc: [
        "Bent nedir?",
        "Bent denir."
      ]
    },
    {
      bi: 0,
      metin:
        "Türkülerde her bendin sonunda aynen tekrarlanan bölüm hangi adlarla anılır?",
      secenekler: [
        "Kavuştak ve bağlama",
        "Serim ve düğüm",
        "Mahlas ve tapşırma",
        "Döşeme ve dilek"
      ],
      cozum:
        "Her bendin sonunda tekrarlanan bölüme kavuştak ya da bağlama (nakarat) denir. Serim, düğüm ve dilek masal planı bölümleridir.",
      fc: [
        "Kavuştak ve bağlama ne demektir?",
        "Kavuştak ya da bağlama (nakarat) denir."
      ]
    },
    {
      bi: 0,
      metin:
        "Nakaratlı türkülerin yapısı incelendiğinde bentler ile kavuştakların dizilişi hangisine uygundur?",
      secenekler: [
        "Üçer mısralık bentten sonra iki mısralık kavuştak",
        "İki mısralık bentten sonra dört mısralık kavuştak",
        "Beş mısralık bentten sonra tek mısralık kavuştak",
        "Tek mısralık bentten sonra üç mısralık kavuştak"
      ],
      cozum:
        "Konu anlatımına göre nakaratlı türkülerde üçer mısralık bölümden sonra iki mısradan oluşan nakaratlar gelir; bentler ve kavuştaklar kendi aralarında kafiyelidir.",
      fc: [
        "Nakaratlı türkünün kuruluş biçimi nasıldır?",
        "Üçer mısralık bentlerden sonra iki mısralık kavuştaklar gelir; bentler ve kavuştaklar kendi aralarında kafiyelidir."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir türkü derlemesinde ölçüler incelenmiş; eserlerde 7'li, 8'li ve daha çok 11'li kalıpların kullanıldığı görülmüştür. Bu durum türkünün hangi özelliğini gösterir?",
      secenekler: [
        "Hece ölçüsüyle söylendiğini",
        "Aruzun değişik kalıplarıyla yazıldığını",
        "Serbest ölçüyle oluşturulduğunu",
        "Beyitlerle kurulduğunu"
      ],
      cozum:
        "7'li, 8'li ve 11'li kalıplar hece ölçüsünün kalıplarıdır. Türküler aruzla değil hece ölçüsüyle söylenir.",
      fc: [
        "Türkülerde kullanılan ölçü nedir?",
        "Hece ölçüsü kullanılır; 7'li, 8'li ve daha çok 11'li kalıplar yaygındır."
      ]
    },
    {
      bi: 1,
      metin:
        "Türkülerin kafiye örgüsü için verilen örneklerden biri hangisidir?",
      secenekler: ["aaab cccb dddb", "abab cccb dddb", "aabb ccdd eeff", "abba cddc effe"],
      cozum:
        "Türkülerde kafiye örgüsü genelde aaab cccb dddb biçimindedir. abab cccb dddb koşmanın uyak düzenidir.",
      fc: [
        "Türkünün kafiye örgüsünün biçimi nasıldır?",
        "Genelde aaab cccb dddb ya da aaa bb ccc bb ddd bb biçimindedir."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir yörede türkü söylemek için \"türkü yakmak\" ifadesi kullanılmaktadır. Bu ifade türkünün hangi yönüyle ilgilidir?",
      secenekler: [
        "Ezgiyle söylenmesi ve yakılması geleneği",
        "Yazıya geçirilmesi",
        "Aruzla ölçülmesi",
        "Konusunun yalnızca ölüm olması"
      ],
      cozum:
        "Konu anlatımında türkü söylemeye \"türkü yakmak\" da dendiği belirtilir; bu, türkünün ezgiyle söylenen ve belirli bir olay üzerine yakılan bir tür olduğunu gösterir.",
      fc: [
        "\"Türkü yakmak\" ne demektir?",
        "Türkü söylemek, türküyü ezgisiyle icra etmek anlamına gelir."
      ]
    },
    {
      bi: 2,
      metin:
        "Türkü ile divan edebiyatının şarkı türü karşılaştırıldığında hangi ayrım öne çıkar?",
      secenekler: [
        "Türküler heceyle, şarkılar aruzla yazılır.",
        "Türküler aruzla, şarkılar heceyle yazılır.",
        "Her iki tür de beyitlerle kurulur.",
        "Her iki tür de yalnızca ölüm konusunu işler."
      ],
      cozum:
        "Konu anlatımında türkülerin şarkıya benzediği ancak şarkıların aruzla yazıldığı belirtilir; türküler ise hece ölçüsüyle söylenir.",
      fc: [
        "Türkü ile şarkı arasındaki ölçü farkı nedir?",
        "Türkü hece ölçüsüyle söylenir, şarkı ise aruzla yazılır."
      ]
    },
    {
      bi: 2,
      metin:
        "Konu anlatımında türkülerin şekil özellikleri bakımından hangi türe benzediği belirtilir?",
      secenekler: ["Koşma", "Mesnevi", "Gazel", "Kaside"],
      cozum:
        "Türküler şekil özellikleri bakımından koşmaya benzer; divan edebiyatındaki karşılığı ise şarkıdır.",
      fc: [
        "Koşma ile türkünün şekil yakınlığı nedir?",
        "Koşmaya benzer; divan edebiyatındaki karşılığı şarkıdır."
      ]
    },
    {
      bi: 2,
      metin:
        "Bir öğrenci derlediği türkülerin adlarını incelerken \"Kızılırmak Türküsü\" gibi adların yanında yöre adlarıyla anılan türküler de görmüştür. Konu anlatımına göre türkülerin ad almasında hangisi etkilidir?",
      secenekler: [
        "Derleyenlerin ya da yörelerin adı",
        "Şairin mahlası ve tapşırma geleneği",
        "Kullanılan aruz kalıbının adı",
        "Bent ve kavuştak sayısı"
      ],
      cozum:
        "Türküler, düzenleyicilerinin, derleyicilerinin veya ait oldukları bölgelerin adına göre ad alır. Mahlas ve tapşırma âşık şiirinin özelliğidir.",
      fc: [
        "Türkülerin ad alma biçimi nedir?",
        "Düzenleyicisinin, derleyicisinin ya da ait olduğu bölgenin adına göre ad alır."
      ]
    }
  ]
});

/* ---------------- 4) KOŞMA ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u01_k04",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Koşma",
  kazanim:
    "Koşmanın biçim özelliklerini, konularına göre türlerini ve benzer türlerle ilişkisini çözümleyebilme.",
  kaynak: kaynak("17-18"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Koşmanın biçim ve söyleyiş özelliklerini belirler.",
    "Koşmayı konularına göre sınıflandırır.",
    "Koşmayı koşuk, gazel ve ağıtla ilişkilendirir."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Halk edebiyatında en yaygın kullanılan nazım şekli olan, saz eşliğinde kendine özgü bir ezgiyle okunan tür hangisidir?",
      secenekler: ["Koşma", "Mani", "Semai", "Destan"],
      cozum:
        "Konu anlatımında koşmanın halk edebiyatının en yaygın kullanılan nazım şekli olduğu ve saz eşliğinde kendine özgü bir ezgiyle okunduğu belirtilir.",
      fc: [
        "Halk edebiyatının en yaygın nazım şekli nedir?",
        "Koşmadır."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir koşma metninde dörtlük sayısı sayılmış ve dizelerin 11'li hece kalıbıyla kurulduğu görülmüştür. Konu anlatımına göre koşmada dörtlük sayısı kaç arasında değişir?",
      secenekler: ["3-5", "2-4", "4-8", "6-10"],
      cozum:
        "Koşma 11'li hece ölçüsüyle söylenir, nazım birimi dörtlüktür ve dörtlük sayısı 3-5 arasında değişir.",
      fc: [
        "Koşmanın dörtlük sayısı nedir?",
        "Genellikle 3 ile 5 dörtlük arasında değişir."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir koşmanın uyak düzeni incelendiğinde birinci dörtlüğün çapraz, sonraki dörtlüklerin ise ortak uyakla bağlandığı görülür. Bu metnin uyak düzeni hangisidir?",
      secenekler: ["abab, cccb, dddb", "aaab, cccb, dddb", "aabb, ccdd, eeff", "abba, cddc, effe"],
      cozum:
        "Koşmanın uyak düzeni abab, cccb, dddb ya da abcb, dddb, eeeb gibi biçimlerde olabilir. aaab, cccb koşuğun uyak düzenidir.",
      fc: [
        "Koşmanın uyak düzeni nedir?",
        "abab, cccb, dddb ya da abcb, dddb, eeeb biçiminde olabilir; genelde yarım kafiye kullanılır."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir âşık, koşmanın son dörtlüğünde kendi takma adını söylemiştir. Konu anlatımına göre bu uygulamaya ne ad verilir?",
      secenekler: ["Tapşırma", "Mahlas", "Döşeme", "Kavuştak"],
      cozum:
        "Âşığın koşmanın son dörtlüğünde takma adını söylemesine tapşırma denir; divan şiirinde aynı uygulama mahlas adını alır.",
      fc: [
        "Tapşırma nedir?",
        "Tapşırma denir; divan şiirindeki karşılığı mahlastır."
      ]
    },
    {
      bi: 0,
      metin:
        "Koşmanın halka hitap etmesi, dil ve anlatım bakımından hangi sonucu doğurmuştur?",
      secenekler: [
        "Dilin sade, anlatımın yalın ve içten olmasını",
        "Aruzun yoğun biçimde kullanılmasını",
        "Arapça ve Farsça tamlamalarla süslenmesini",
        "Yalnızca saray çevresinde okunmasını"
      ],
      cozum:
        "Konu anlatımında koşmanın halka hitap ettiği için dilinin sade, anlatımının yalın ve içten olduğu belirtilir.",
      fc: [
        "Koşmanın dil ve anlatım özelliği nedir?",
        "Halka hitap ettiği için sade, anlatımı yalın ve içtendir."
      ]
    },
    {
      bi: 1,
      metin:
        "Aşk, hasret, ayrılık ve doğa sevgisi gibi lirik konuları işleyen koşma türü hangisidir?",
      secenekler: ["Güzelleme", "Taşlama", "Koçaklama", "Ağıt"],
      cozum:
        "Güzelleme, aşk, hasret, ayrılık ve doğa sevgisi gibi lirik konuları işleyen koşma türüdür; Karacaoğlan'ın güzellemeleri ünlüdür.",
      fc: [
        "Güzelleme nedir?",
        "Aşk, hasret, ayrılık ve doğa sevgisi gibi lirik konuları işleyen koşma türüdür."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir koşmada toplumun bozuk yönleri eleştirilmekte, bir kişi yergiyle anlatılmaktadır. Bu koşma türü ve divan edebiyatındaki karşılığı hangisinde birlikte verilmiştir?",
      secenekler: [
        "Taşlama – Hicviye",
        "Güzelleme – Methiye",
        "Koçaklama – Kaside",
        "Ağıt – Mersiye"
      ],
      cozum:
        "Bir kimseyi yermek veya toplumun bozuk yönlerini eleştirmek amacıyla yazılan koşmalara taşlama denir; divan edebiyatındaki karşılığı hicviyedir.",
      fc: [
        "Taşlamanın divan edebiyatındaki karşılığı nedir?",
        "Hicviyedir; günümüz edebiyatındaki karşılığı yergi, Batı edebiyatındaki karşılığı satirdir."
      ]
    },
    {
      bi: 1,
      metin:
        "Coşkun ve yiğitçe bir üslupla savaş ve dövüşleri anlatan koşma türü hangisidir?",
      secenekler: ["Koçaklama", "Taşlama", "Güzelleme", "Ağıt"],
      cozum:
        "Savaş ve dövüşleri coşkun, yiğitçe bir üslupla anlatan koşmalara koçaklama denir; Köroğlu, Dadaloğlu ve Kayıkçı Kul Mustafa bu türde tanınır.",
      fc: [
        "Koçaklama nedir?",
        "Savaş ve dövüşleri coşkun, yiğitçe bir üslupla anlatan koşma türüdür."
      ]
    },
    {
      bi: 2,
      metin:
        "Bir kişinin ölümünden duyulan acının belli bir ezgiyle anlatıldığı, hem anonim halk edebiyatında hem âşık edebiyatında görülen tür hangisidir?",
      secenekler: ["Ağıt", "Güzelleme", "Sav", "Türkü"],
      cozum:
        "Ağıt, bir kişinin ölümünden duyulan acıyı belli bir ezgiyle anlatan türdür; İslamiyet öncesinde sagu, divan edebiyatında mersiye karşılığıdır.",
      fc: [
        "Ağıdın karşılık geldiği türler nedir?",
        "İslamiyet öncesi Türk edebiyatında sagu, divan edebiyatında mersiye karşılığıdır."
      ]
    },
    {
      bi: 2,
      metin:
        "Koşmanın divan edebiyatındaki karşılığı olarak ders notunda hangi tür gösterilir?",
      secenekler: ["Gazel", "Kaside", "Mersiye", "Mesnevi"],
      cozum:
        "Konu anlatımında koşmanın İslamiyet öncesi adının koşuk, divan edebiyatındaki karşılığının ise gazel olduğu belirtilir.",
      fc: [
        "Koşmanın divan şiirindeki eşdeğeri nedir?",
        "Gazeldir; İslamiyet öncesindeki adı ise koşuktur."
      ]
    }
  ]
});

/* ---------------- 5) MASAL ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u01_k05",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Masal",
  kazanim:
    "Masalın temel özelliklerini, plan bölümlerini ve kaynak eserlerini çözümleyebilme.",
  kaynak: kaynak("19-21"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Masalın tanımını ve temel özelliklerini belirler.",
    "Masalın bölümlerini ve kalıplaşmış sözlerini çözümler.",
    "Masalı kaynak eserler ve kahramanlar üzerinden yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Halkın yarattığı, ağızdan ağza ve kuşaktan kuşağa aktarılan, olağanüstü kişilerin başından geçen olağandışı olayları anlatan kısa hikâyelere ne ad verilir?",
      secenekler: ["Masal", "Halk hikâyesi", "Fabl", "Efsane"],
      cozum:
        "Konu anlatımında masal, halkın yarattığı ve olağanüstü kişilerin başından geçen olağandışı olayları anlatan kısa hikâyeler olarak tanımlanır.",
      fc: [
        "Masal nedir?",
        "Halkın yarattığı, ağızdan ağza aktarılan, olağanüstü kişi ve olayları anlatan kısa hikâyelerdir."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir masalda olayların geçtiği yer ve zamanın belirsiz olduğu, kişilerin olağanüstü nitelikler taşıdığı görülür. Konu anlatımına göre masallarda yer ve zaman için hangisi söylenebilir?",
      secenekler: [
        "Yer ve zaman belli değildir.",
        "Yer ve zaman gerçek adlarıyla verilir.",
        "Yalnızca zaman bellidir.",
        "Yer bellidir, zaman belirsizdir."
      ],
      cozum:
        "Masallarda olaylar tamamen hayal ürünüdür; yer ve zaman belli değildir.",
      fc: [
        "Masallarda yer ve zamanın durumu nedir?",
        "Belli değildir; olaylar hayal ürünüdür ve belirsiz bir yerde, belirsiz bir zamanda geçer."
      ]
    },
    {
      bi: 0,
      metin:
        "Masalların çoğu \"bir varmış, bir yokmuş\" ya da \"evvel zaman içinde, kalbur saman içinde\" gibi sözlerle başlar. Konu anlatımına göre masalların olayları hangi zamanla anlatılır?",
      secenekler: [
        "-miş'li geçmiş zamanla",
        "Geniş zamanla",
        "Şimdiki zamanla",
        "Gelecek zamanla"
      ],
      cozum:
        "Konu anlatımında masallarda olayların -miş'li geçmiş zaman kullanılarak anlatıldığı belirtilir; bu, anlatılanın duyulmuş bir olay gibi sunulmasını sağlar.",
      fc: [
        "Masallarda kullanılan zaman nedir?",
        "-miş'li geçmiş zaman kullanılır."
      ]
    },
    {
      bi: 0,
      metin:
        "Masallarda iyiler ödüllendirilir, kötüler cezalandırılır; milli ve dinî motiflere hemen hemen hiç yer verilmez. Bu özellik masalın hangi yönünü gösterir?",
      secenekler: [
        "Evrensel ve didaktik bir tür olduğunu",
        "Tarihî bir belge olduğunu",
        "Yalnızca çocuklara seslendiğini",
        "Aruzla yazıldığını"
      ],
      cozum:
        "Milli ve dinî motiflere yer verilmemesi masalı evrensel kılar; iyilerin ödüllendirilmesi ise türün didaktik (öğretici) niteliğini gösterir.",
      fc: [
        "Masalın evrensel olmasının nedeni nedir?",
        "Milli ve dinî motiflere hemen hemen hiç yer verilmemesi, konuların evrensel olmasıdır."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir masal, \"Evvel zaman içinde, kalbur saman içinde…\" sözleriyle başlamış ve bu bölümle dinleyicinin ilgisi çekilmiştir. Masal planında bu bölüm hangisidir?",
      secenekler: ["Döşeme", "Serim", "Düğüm", "Çözüm"],
      cozum:
        "Dinleyicinin ilgisini çekme amacı taşıyan, kalıplaşmış sözlerle kurulan tekerleme bölümü döşemedir. Serimde kişiler tanıtılır.",
      fc: [
        "Masalda dinleyicinin ilgisini çeken tekerleme bölümü nedir?",
        "Döşeme denir; \"Evvel zaman içinde, kalbur saman içinde…\" gibi kalıplaşmış sözlerle başlar."
      ]
    },
    {
      bi: 1,
      metin:
        "Masal planındaki bölümlerden hangisinde iyiler ile kötüler belirginleşir, olaylar gelişir ve merak duygusu yoğunlaşır?",
      secenekler: ["Düğüm", "Döşeme", "Çözüm", "Dilek"],
      cozum:
        "Düğüm bölümünde olaylar gelişir, çatışma ortaya konur, iyiler ve kötüler belirginleşir; merak duygusu yoğunlaşarak çözüme yönelir.",
      fc: [
        "Düğüm bölümü nedir?",
        "Düğüm bölümüdür; olaylar gelişir, iyiler ve kötüler belirginleşir."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir masalda kötülerin cezalandırıldığı, iyilerin kazandığı ve çatışmanın sona erdiği bölüm hangisidir?",
      secenekler: ["Çözüm", "Serim", "Döşeme", "Düğüm"],
      cozum:
        "Çözüm bölümünde düğümde belirginleşen çatışma, iyilerin kazanması ve kötülerin cezalandırılmasıyla çözülür.",
      fc: [
        "Çözüm bölümü nedir?",
        "Çözüm bölümüdür; iyiler kazanır, kötüler cezalandırılır."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir masal, \"Onlar ermiş muradına, biz çıkalım kerevetine\" sözüyle sona ermiştir. Masal planında bu bölüm hangisidir?",
      secenekler: ["Dilek", "Çözüm", "Düğüm", "Serim"],
      cozum:
        "Masal, iyi dilek bildiren kalıplaşmış sözlerle son bulur; bu bölüm dilektir. Çözüm ise çatışmanın sona erdiği bölümdür.",
      fc: [
        "Masalın iyi dileklerle biten bölümü nedir?",
        "Dilek denir; \"Onlar ermiş muradına, biz çıkalım kerevetine\" gibi kalıplaşmış sözlerle kurulur."
      ]
    },
    {
      bi: 2,
      metin:
        "Türklerde masal özelliği gösteren ilk eser olarak ders notunda hangi eser gösterilir?",
      secenekler: [
        "Kalyanamkara ve Papamkara",
        "Billur Köşk Masalları",
        "Kelile ve Dimne",
        "Binbir Gece Masalları"
      ],
      cozum:
        "Konu anlatımına göre Uygur Dönemi eserlerinden Kalyanamkara ve Papamkara, Türklerde masal özelliği gösteren ilk eserdir. Billur Köşk ise en eski masal kitabımızdır.",
      fc: [
        "Papamkara hikâyesinin edebiyatımızdaki yeri nedir?",
        "Uygur Dönemi eserlerinden Kalyanamkara ve Papamkara'dır."
      ]
    },
    {
      bi: 2,
      metin:
        "Masallarda yer alan kahramanlardan Keloğlan'ın temsil ettiği değer, ders notuna göre hangisidir?",
      secenekler: [
        "Şans ve zekâ",
        "Zulüm ve baskı",
        "Kıskançlık",
        "Kötülük"
      ],
      cozum:
        "Keloğlan, en önemli Türk masal kahramanı olarak şans ve zekâyı temsil eder. Üvey anne zulmü, üvey kız kardeş kıskançlığı, köse kötülüğü simgeler.",
      fc: [
        "Keloğlan karakterinin simgesi nedir?",
        "Şansı ve zekâyı temsil eder; en önemli Türk masal kahramanıdır."
      ]
    }
  ]
});
