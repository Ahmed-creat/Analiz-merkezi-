#!/usr/bin/env node
/* ============================================================
   TDE · 3. TEMA (DÜNDEN BUGÜNE) — anlatı türleri
   ------------------------------------------------------------
   Kaynak: 10. sınıf TDE ders notları (Mustafa Çiftçi)
     edebiyat_10_u03_k01  Destan           s.110-116
     edebiyat_10_u03_k02  Mesnevi          s.117-118
     edebiyat_10_u03_k03  Halk Hikâyesi    s.118-121
     edebiyat_10_u03_k04  Fabl             s.121-122
   Kullanım: node docs/uretim/uretim/tde-t03.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Türk Dili ve Edebiyatı";
const DOSYA = "10.Edebiyat.Ders.notlari.Yeni.Mufredat.pdf";
const TEMA = 3;
const TEMA_ADI = "Dünden Bugüne";

function kaynak(s) {
  return "10. sınıf TDE ders notları (Mustafa Çiftçi), s." + s;
}

/* ---------------- 1) DESTAN ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u03_k01",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Destan",
  kazanim:
    "Destanın oluşum evrelerini, Türk destanlarını ve destan motiflerini çözümleyebilme.",
  kaynak: kaynak("110-116"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Destanın tanımını, oluşum evrelerini ve türlerini belirler.",
    "Türk destanlarını dönemlerine ve milletlerine göre sınıflandırır.",
    "Destanlardaki motifleri ve tipleri çözümler."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Bir milletin hayatında büyük yankı uyandırmış bir kahramanın ya da tarih olayının, milletin hayal dünyasında ortak sembollerle zenginleştirilerek anlatıldığı uzun manzum hikâyelere ne ad verilir?",
      secenekler: ["Destan", "Masal", "Halk hikâyesi", "Mesnevi"],
      cozum:
        "Toplumu derinden sarsan olayların ve önemli kişilerin toplumun hayal dünyasında masallaştırılmasıyla oluşan uzun manzum hikâyeler destandır; Batı'da epope denir.",
      fc: [
        "Destan nedir?",
        "Bir milleti derinden etkileyen olayları ve kahramanları anlatan uzun manzum hikâyedir."
      ]
    },
    {
      bi: 0,
      metin:
        "Doğal destanlar üç evrede oluşur. Toplumu etkileyen olayların ağızdan ağıza, nesilden nesile dolaştığı döneme ne ad verilir?",
      secenekler: ["Yayılma evresi", "Oluş evresi", "Derleme evresi", "Yazıya geçiş evresi"],
      cozum:
        "Doğal destanın evreleri oluş, yayılma ve derlemedir. Sözlü dolaşım yayılma, bir ozan tarafından yazıya geçirilme derleme evresidir.",
      fc: [
        "Doğal destanın evreleri nedir?",
        "Oluş, yayılma ve derleme evreleridir."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir destanın metni, yüzyıllar sonra bir ozan tarafından derlenip yazıya aktarılmıştır. Bu işlem doğal destanın hangi evresine karşılık gelir?",
      secenekler: ["Derleme", "Oluş", "Yayılma", "Takti"],
      cozum:
        "Ağızdan ağıza dolaşan destanın bir ozan tarafından derlenerek yazıya aktarılması derleme evresidir.",
      fc: [
        "Derleme evresi nedir?",
        "Sözlü dolaşan destanın bir ozan tarafından yazıya geçirildiği evredir."
      ]
    },
    {
      bi: 0,
      metin:
        "Doğal destanların söyleyeni belli değildir ve metinleri yüzyıllar sonra kayda geçmiştir. Bu durum doğal destanların hangi özelliğini gösterir?",
      secenekler: [
        "Anonim olmaları",
        "Aruzla yazılmaları",
        "Yazarının bilinmesi",
        "Konularının günlük olması"
      ],
      cozum:
        "Doğal destanlar anonimdir ve yazıya sonradan geçirilmiştir; bu yönüyle yapma destanlardan ayrılır.",
      fc: [
        "Doğal destanın anonimlik özelliği nedir?",
        "Söyleyeni belli değildir; metin yüzyıllar sonra yazıya geçirilmiştir."
      ]
    },
    {
      bi: 1,
      metin:
        "Göktürklerin büyük bir yenilginin ardından Ergenekon adını verdikleri yere çekilip orada çoğaldıktan sonra demir dağı eritmeleri hangi destanda anlatılır?",
      secenekler: ["Ergenekon Destanı", "Şu Destanı", "Manas Destanı", "Türeyiş Destanı"],
      cozum:
        "Demir dağın eritilerek yol açılması Göktürk destanlarından Ergenekon Destanı'nın konusudur.",
      fc: [
        "Ergenekon Destanı nedir?",
        "Göktürk destanıdır; Ergenekon'dan demir dağı eriterek çıkışı anlatır."
      ]
    },
    {
      bi: 1,
      metin:
        "Oğuz Türklerinin Üçoklar ve Bozoklar olarak ikiye ayrılması hangi destanda yer alır?",
      secenekler: ["Oğuz Kağan Destanı", "Bozkurt Destanı", "Göç Destanı", "Atilla Destanı"],
      cozum:
        "Oğuz Kağan Destanı, Hun-Oğuz destanlarındandır ve Oğuz Türklerinin Üçoklar ile Bozoklar biçiminde ikiye ayrılmasını anlatır.",
      fc: [
        "Oğuz Kağan Destanı nedir?",
        "Hun-Oğuz destanıdır; Oğuzların Üçoklar ve Bozoklar olarak ayrılmasını anlatır."
      ]
    },
    {
      bi: 2,
      metin:
        "İslamiyet'ten sonraki Türk destanları arasında Kazak-Kırgız sahasına ait olan ve geniş bir coğrafyada yayılan destan hangisidir?",
      secenekler: ["Manas Destanı", "Cengiz Han Destanı", "Köroğlu Destanı", "Danişment Gazi Destanı"],
      cozum:
        "Manas, Kazak-Kırgız sahasının destanıdır. Cengiz Han Türk-Moğol, Köroğlu ve Danişment Gazi Selçuklu-Beylikler dönemine aittir.",
      fc: [
        "Manas Destanı nedir?",
        "Kazak-Kırgız sahasına ait İslamiyet sonrası Türk destanıdır."
      ]
    },
    {
      bi: 2,
      metin:
        "Destanlarda kurt, Türk'ün hayat ve savaş gücünün simgesidir; Oğuz Kağan Destanı'nda ışık içinden çıkarak orduya yol gösterir. Kurt motifinin destanlardaki adları hangisinde birlikte verilmiştir?",
      secenekler: ["Börte Çine ve Asena", "Bekay ve Öge", "Uluğ Türk ve Öge", "Kırat ve Aşkâr"],
      cozum:
        "Kurt destanlarda Börte Çine ve Asena adlarıyla sembolleşmiştir; Kırat ve Aşkâr at motifine bağlı adlardır.",
      fc: [
        "Kurt motifinin destanlardaki adları nedir?",
        "Börte Çine ve Asena'dır; kurt Türk'ün savaş gücünü simgeler."
      ]
    },
    {
      bi: 2,
      metin:
        "Destanlarda bir taş, millî birlik ve bütünlüğü, halkın mutluluğunu temsil eder; ülkeden çıkarıldığında kıtlık baş gösterir. Bu motif hangisidir?",
      secenekler: ["Yada taşı", "Ağaç motifi", "Kırklar motifi", "Mağara motifi"],
      cozum:
        "Yada taşı millî birlik ve bütünlüğü, halkın mutluluğunu ve devletin idealini temsil eder; ülkeden çıkarılınca birlik bozulur.",
      fc: [
        "Yada taşı motifi nedir?",
        "Millî birlik ve bütünlüğü, halkın mutluluğunu temsil eden destan motifidir."
      ]
    },
    {
      bi: 1,
      metin:
        "Destanlarda hakanların akıl danıştığı, yol gösteren güngörmüş yaşlılar vardır; Dede Korkut, Uluğ Türk, Öge ve Bekay bu kişilere örnektir. Bu kişiler hangi tipi oluşturur?",
      secenekler: ["Bilge tipi", "Kadın tipi", "Alp tipi", "Düşman tipi"],
      cozum:
        "Topluma manevi liderlik yapan, öğütleriyle yol gösteren bu kişiler bilge tipidir; ak sakallı ifadesiyle de anılırlar.",
      fc: [
        "Bilge tipi nedir?",
        "Destanlarda akıl danışılan, öğüt veren güngörmüş kişilerdir: Dede Korkut, Uluğ Türk."
      ]
    }
  ]
});

/* ---------------- 2) MESNEVİ ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u03_k02",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Mesnevi",
  kazanim:
    "Mesnevinin biçim özelliklerini, hamse geleneğini ve bölümlerini çözümleyebilme.",
  kaynak: kaynak("117-118"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Mesnevinin kafiye düzeni, beyit sayısı ve ölçü özelliklerini belirler.",
    "Hamse geleneğini ve bu geleneğe katkıları ayırt eder.",
    "Mesnevinin bölümlerini ve bu bölümlerin işlevini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Divan şiirinde uzun aşk hikâyeleri ve tarihî olaylar anlatılırken her beytin dizelerinin kendi arasında uyaklandığı biçim seçilmiştir. Bu biçimin kafiye düzeni hangisidir?",
      secenekler: ["aa, bb, cc, dd", "aa, ba, ca, da", "abab, cccb", "aaxa, aaaa"],
      cozum:
        "Mesnevide her beyit kendi arasında kafiyelidir: aa, bb, cc, dd. Kafiye bulma zorluğu şairleri uzun metinlerde bu biçime yöneltmiştir.",
      fc: [
        "Mesnevinin kafiye düzeni nedir?",
        "Her beyit kendi arasında kafiyelidir: aa, bb, cc, dd."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir mesnevinin binlerce beyitten oluştuğu görülmüş, gazel ve kasidedeki sınırların burada geçerli olmadığı anlaşılmıştır. Mesnevide beyit sayısı için ne söylenir?",
      secenekler: ["Sınırsızdır", "5-15 arasıdır", "33-99 arasıdır", "Dört beyittir"],
      cozum:
        "Mesnevide beyit sayısı sınırsızdır; bu yüzden roman ve hikâyenin yerini tutan uzun metinler mesneviyle yazılmıştır.",
      fc: [
        "Mesnevinin beyit sayısı nedir?",
        "Sınırsızdır; uzun konular bu biçimle anlatılır."
      ]
    },
    {
      bi: 1,
      metin:
        "Mesnevi, aruzun genellikle kısa kalıplarıyla yazılır. Şairleri uzun metinlerde bu biçime yönelten temel güçlük hangisidir?",
      secenekler: [
        "Diğer nazım şekillerinde kafiye bulma zorluğu",
        "Aruz kalıplarının sayıca azlığı",
        "Beyitlerin tek dize hâlinde yazılması",
        "Dörtlük sayısının sınırlı olması"
      ],
      cozum:
        "Diğer nazım şekillerinde her beyitte yeni kafiye bulma zorluğu, şairleri uzun metinlerde mesneviye yöneltmiştir.",
      fc: [
        "Mesnevinin tercih edilme nedeni nedir?",
        "Diğer şekillerde kafiye bulma zorluğudur; mesnevide her beyit kendi içinde kafiyelidir."
      ]
    },
    {
      bi: 0,
      metin:
        "Türk edebiyatında bilinen ilk mesnevi hangisidir?",
      secenekler: ["Kutadgu Bilig", "Harnâme", "Mantıku't-Tayr", "Kanuni Mersiyesi"],
      cozum:
        "Türk edebiyatında bilinen ilk mesnevi Kutadgu Bilig'dir; aruz ölçüsünün de ilk kullanıldığı eserdir.",
      fc: [
        "Kutadgu Bilig'in türü nedir?",
        "İlk mesnevidir; aruz ölçüsünün ilk kullanıldığı eserdir."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir şairin beş mesnevisinin bir araya gelmesiyle oluşan yapıt, divan edebiyatında ayrı bir saygınlık kazanmıştır. Bu yapıt hangi adla anılır?",
      secenekler: ["Hamse", "Divan", "Mecmua", "Tezkire"],
      cozum:
        "Beş mesnevinin bir araya gelmesiyle oluşan yapıt hamse, bu eserleri yazan şairler hamse şairi olarak anılır.",
      fc: [
        "Hamse nedir?",
        "Şairin beş mesnevisinin bir araya gelmesiyle oluşan yapıttır."
      ]
    },
    {
      bi: 1,
      metin:
        "Hamse türüne düzyazının girişi 17. yüzyılda olmuştur. Hamseye düzyazıyı sokan ilk yazar hangisidir?",
      secenekler: ["Nergisi", "Nevizade Atayi", "Taşlıcalı Yahya", "Nef'i"],
      cozum:
        "Nergisi, hamseye düzyazıyı sokan ilk yazardır; Taşlıcalı Yahya ve Nevizade Atayi'nin de hamseleri vardır.",
      fc: [
        "Hamseye düzyazının girişi nedir?",
        "17. yüzyılda Nergisi ile olmuştur; hamseye düzyazıyı sokan ilk yazardır."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir mesnevinin başında manzum ya da mensur biçimde yer alan ön söz bölümü hangisidir?",
      secenekler: ["Dibace", "Tevhid", "Hatime", "Sebeb-i telif"],
      cozum:
        "Mesnevinin ön sözü dibacedir; manzum veya mensur olabilir. Tevhid Allah'ın birliğinin, hatime bitişin anlatıldığı bölümdür.",
      fc: [
        "Dibace nedir?",
        "Mesnevinin ön sözüdür; manzum veya mensur olabilir."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir mesnevide şair, eserini hangi nedenle yazdığını ayrı bir bölümde açıklamıştır. Bu bölüm hangisidir?",
      secenekler: ["Sebeb-i telif", "Ağâz-ı dâstan", "Medhiye", "Miraciye"],
      cozum:
        "Mesnevinin yazılış nedeninin belirtildiği bölüm sebeb-i teliftir; ağâz-ı dâstan asıl konunun başladığı bölümdür.",
      fc: [
        "Sebeb-i telif nedir?",
        "Mesnevide eserin yazılış nedeninin belirtildiği bölümdür."
      ]
    },
    {
      bi: 2,
      metin:
        "Bir mesnevide asıl konunun başladığı bölüme geçilmiş, övgü ve dua bölümleri geride kalmıştır. Bu bölüm hangisidir?",
      secenekler: ["Ağâz-ı dâstan", "Hatime bölümü", "Dibace bölümü", "Naat bölümü"],
      cozum:
        "Mesnevinin asıl konusunun bulunduğu bölüm ağâz-ı dâstandır; hatime ise eserin bittiğini belirtir.",
      fc: [
        "Ağâz-ı dâstan nedir?",
        "Mesnevide asıl konunun başladığı bölümdür."
      ]
    },
    {
      bi: 2,
      metin:
        "Bir mesnevide dört halifenin övüldüğü bölüm ile eserin bittiğini bildiren bölüm farklıdır. Eserin bittiğini belirten bölüm hangisidir?",
      secenekler: ["Hatime", "Medh-i çihar-yâr-i güzîn", "Münacaat", "Medhiye"],
      cozum:
        "Hatime mesnevinin bittiğini belirten bölümdür; medh-i çihar-yâr-i güzînde dört halife övülür.",
      fc: [
        "Hatime nedir?",
        "Mesnevinin bittiğini belirten son bölümdür."
      ]
    }
  ]
});

/* ---------------- 3) HALK HİKÂYESİ ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u03_k03",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Halk Hikâyesi",
  kazanim:
    "Halk hikâyesinin anlatım özelliklerini, bölümlerini ve destandan ayrılan yönlerini çözümleyebilme.",
  kaynak: kaynak("118-121"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Halk hikâyesinin oluşum ortamını ve anlatım biçimini belirler.",
    "Halk hikâyesinin bölümlerini ve bu bölümlerin işlevini çözümler.",
    "Halk hikâyesini destan ve masaldan ayırt eder."
  ],
  items: [
    {
      bi: 0,
      metin:
        "16. asırdan itibaren âşıkların saz eşliğinde, nazım-nesir karışık bir ifadeyle dinleyicilere anlattığı, yer yer masal ve destan özellikleri taşıyan hikâyeler hangi türdür?",
      secenekler: ["Halk hikâyesi", "Destan türü", "Fabl türü", "Mesnevi türü"],
      cozum:
        "Âşıkların saz eşliğinde nazım-nesir karışık anlattığı, nesilden nesile aktarılan hikâyeler halk hikâyesidir.",
      fc: [
        "Halk hikâyesi nedir?",
        "Âşıkların saz eşliğinde nazım-nesir karışık anlattığı, anonim halk anlatısıdır."
      ]
    },
    {
      bi: 0,
      metin:
        "Türk edebiyatında halk hikâyelerinin ilk örneği kabul edilen eser hangisidir?",
      secenekler: ["Dede Korkut Hikâyeleri", "Köroğlu Destanı", "Harnâme", "Mantıku't-Tayr"],
      cozum:
        "Halk hikâyelerinin ilk örneği Dede Korkut Hikâyeleridir.",
      fc: [
        "Halk hikâyesinin ilk örneği nedir?",
        "Dede Korkut Hikâyeleridir."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir halk hikâyesinde anlatıcı, hikâyenin geçtiği yer ve zamanı, kahramanları ve ailelerini kalıplaşmış cümlelerle tanıtmıştır. Bu bölüm hangisidir?",
      secenekler: ["Döşeme", "Fasıl", "Efsane", "Sonuç ve dua"],
      cozum:
        "Manzum veya mensur kalıplaşmış bir giriş olan döşemede hikâyenin yeri, zamanı, kahramanları ve aileleri tanıtılır.",
      fc: [
        "Döşeme nedir?",
        "Halk hikâyesinde yer, zaman, kahraman ve ailelerin tanıtıldığı kalıplaşmış giriştir."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir âşık, hikâyeye başlamadan önce dinleyiciyi hazırlamak için divani söylemiş, ardından cinaslı bir türkü ve tekerleme okumuştur. Bu bölüm hangisidir?",
      secenekler: ["Fasıl", "Döşeme", "Efsane", "Hikâyenin asıl konusu"],
      cozum:
        "Halk hikâyesinin fasıl bölümünde âşık divani, cinaslı türkü ve olağanüstü konulu bir tekerleme söyler.",
      fc: [
        "Fasıl nedir?",
        "Âşığın divani, cinaslı türkü ve tekerleme söyleyerek dinleyiciyi hazırladığı bölümdür."
      ]
    },
    {
      bi: 2,
      metin:
        "Bir hikâyenin sonunda, vuslatın gerçekleşmediği durumlarda sevgililerin öbür dünyada kavuşacaklarına işaret edilmiştir. Bu bölüm hangisidir?",
      secenekler: ["Efsane", "Dua", "Fasıl", "Döşeme"],
      cozum:
        "Hikâye ile ilgisi olmayan efsane bölümünde, vuslatın gerçekleşmediği hikâyelerde öbür dünyada vuslat olacağına işaret edilir.",
      fc: [
        "Halk hikâyesinde efsane bölümü nedir?",
        "Vuslatın gerçekleşmediği hikâyelerde öbür dünyada vuslata işaret eden bölümdür."
      ]
    },
    {
      bi: 0,
      metin:
        "Halk hikâyelerinde anlatıcı geçmişe ve geleceğe vakıf, her şeyi bilen bir konumdadır. Bu anlatım özelliği hangisidir?",
      secenekler: ["İlahi bakış açısı", "Kahraman bakış açısı", "Gözlemci bakış açısı", "İç konuşma"],
      cozum:
        "Hikâyelerin çoğu ilahi bakış açısıyla anlatılır; anlatıcı tüm olanlara, geçmişe ve geleceğe vakıftır.",
      fc: [
        "İlahi bakış açısı nedir?",
        "Anlatıcının geçmişe ve geleceğe vakıf, her şeyi bilen konumda olmasıdır."
      ]
    },
    {
      bi: 1,
      metin:
        "Halk hikâyeleri destanlardan pek çok yönüyle ayrılır. Aşağıdakilerden hangisi bu ayrımın bir yönüdür?",
      secenekler: [
        "Tarihî bir vakanın olmasının şart olmaması",
        "Konuların tamamen olağanüstü olması",
        "Dilin ağır ve sanatlı olması",
        "Yazarının her zaman bilinmesi"
      ],
      cozum:
        "Halk hikâyelerinde tarihî bir vakanın olması şart değildir; nazım-nesir karışıktır, gerçekçiliğe daha çok yer verilir, aşk maceraları öne çıkar.",
      fc: [
        "Halk hikâyesinin destandan ayrılan yönleri nedir?",
        "Tarihî vaka şartı yoktur; nazım-nesir karışıktır, aşk maceraları öne çıkar."
      ]
    },
    {
      bi: 1,
      metin:
        "Aynı hikâyenin farklı yörelerde değişik biçimlerde anlatıldığı görülmüştür. Bu durumun temel nedeni hangisidir?",
      secenekler: [
        "Âşıkların kendi yorum ve üslubunu katması",
        "Hikâyelerin yazıyla yayılması",
        "Her hikâyenin tek anlatıcısı olması",
        "Hikâyelerin dili ağırlaştırması"
      ],
      cozum:
        "Âşıklar hikâyeyi anlatırken kendi yorumlarını, hayal güçlerini ve üsluplarını kattığı için aynı hikâyenin farklı varyantları ortaya çıkar.",
      fc: [
        "Halk hikâyesinde varyant nedir?",
        "Aynı hikâyenin âşıkların yorumuyla farklı yörelerde aldığı değişik biçimlerdir."
      ]
    },
    {
      bi: 2,
      metin:
        "Kahramanlık hikâyeleri içinde önemli bir yer tutan ve 13. yüzyıl Türk edebiyatında önemli örnekler veren tür hangisidir?",
      secenekler: ["Hz. Ali Cenknameleri", "Hamse geleneği", "Tezkire türü", "Şehrengiz türü"],
      cozum:
        "Hz. Ali Cenknameleri, Türk destan geleneğinin İslami devresinin ürünüdür ve 13. yüzyılda önemli örnekler vermiştir.",
      fc: [
        "Cenkname nedir?",
        "Hz. Ali'nin kahramanlıklarını anlatan, İslami dönem destan geleneğinin ürünü hikâyelerdir."
      ]
    },
    {
      bi: 2,
      metin:
        "Halk hikâyeleri anonim olduğu hâlde yazarı bilinen mesneviden ayrılır. Halk hikâyelerinin anonim sayılmasının nedeni hangisidir?",
      secenekler: [
        "Halkın ortak malı olmaları",
        "Tek bir âşık tarafından yazılmaları",
        "Saray çevresinde üretilmeleri",
        "Aruzla yazılmaları"
      ],
      cozum:
        "Halk hikâyeleri herhangi bir yazara değil halkın ortak malına ait olduğu için anonimdir ve dönemin zihniyetini yansıtır.",
      fc: [
        "Halk hikâyesinin anonimlik nedeni nedir?",
        "Halkın ortak malı olmalarıdır; tek bir yazarı yoktur."
      ]
    }
  ]
});

/* ---------------- 4) FABL ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u03_k04",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Fabl",
  kazanim:
    "Fablın yapı özelliklerini, plânını ve Türk edebiyatındaki örneklerini çözümleyebilme.",
  kaynak: kaynak("121-122"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Fablın tanımını, kahraman özelliklerini ve iletisini belirler.",
    "Fablın yapı unsurlarını ve plânını çözümler.",
    "Fablın Türk ve dünya edebiyatındaki örneklerini ayırt eder."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Bir metinde kahramanlar hayvanlardır; ancak bu hayvanlar insanlar gibi düşünüp konuşur ve insanlar arasındaki iyi-kötü çatışmaları onların arasında geçmiş gibi gösterilir. Bu tür hangisidir?",
      secenekler: ["Fabl", "Masal", "Destan", "Halk hikâyesi"],
      cozum:
        "İnsanlar arasındaki çatışmaların hayvan kahramanlara yakıştırıldığı, sonunda ahlak dersi verilen kısa anlatılar fabldır.",
      fc: [
        "Fabl nedir?",
        "Kahramanları hayvan olan, insan çatışmalarını yansıtan ve ders veren kısa anlatıdır."
      ]
    },
    {
      bi: 0,
      metin:
        "Fabllar manzum ya da nesir biçiminde yazılabilir. Ancak türün değişmeyen özelliği, metnin sonunda hangisinin bulunmasıdır?",
      secenekler: ["Ahlak dersi", "Dua bölümü", "Tekerleme", "Mahlas"],
      cozum:
        "Fablın sonunda her zaman bir ahlak dersi (kıssadan hisse) vardır; bu ders kısa, açık ve öykünün doğal sonucu gibi olmalıdır.",
      fc: [
        "Fablın verdiği ders nedir?",
        "Kıssadan hissedir; kısa, açık ve öykünün doğal sonucu gibi olmalıdır."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir fabl serim, düğüm ve çözümden sonra dersin verildiği bölümle tamamlanmıştır. Fabl plânının son bölümü hangisidir?",
      secenekler: ["Öğüt", "Serim", "Düğüm", "Çözüm"],
      cozum:
        "Fabl plânı serim, düğüm, çözüm ve öğüt bölümlerinden oluşur.",
      fc: [
        "Fabl plânı nedir?",
        "Serim, düğüm, çözüm ve öğüt bölümlerinden oluşur."
      ]
    },
    {
      bi: 1,
      metin:
        "Fablın kişiler, olay, yer ve zaman olmak üzere dört yapı unsuru bulunur. Bu unsurların tamamı hangi seçenekte verilmiştir?",
      secenekler: [
        "Kişiler, olay, yer, zaman",
        "Kişiler, tema, dil, üslup",
        "Olay, düğüm, çözüm, öğüt",
        "Yer, zaman, bakış açısı, tema"
      ],
      cozum:
        "Fablın dört yapı unsuru kişiler, olay, yer ve zamandır; serim-düğüm-çözüm-öğüt ise plânıdır.",
      fc: [
        "Fablın yapı unsurları nedir?",
        "Kişiler, olay, yer ve zaman olmak üzere dört unsurdur."
      ]
    },
    {
      bi: 0,
      metin:
        "Türk edebiyatında fabl türünün ilk örneği sayılan eser, bir mesnevi olan Harnâme'dir. Bu eser kime aittir?",
      secenekler: ["Şeyhi", "Şinasi", "Gülşehri", "Nergisi"],
      cozum:
        "Türk edebiyatında ilk fabl örneği Şeyhi'nin Harnâme adlı mesnevisidir.",
      fc: [
        "Türk edebiyatının ilk fabl örneği nedir?",
        "Şeyhi'nin Harnâme adlı mesnevisidir."
      ]
    },
    {
      bi: 1,
      metin:
        "Batılı anlamda ilk fabl örnekleri Türk edebiyatında bir çeviri eserle verilmiştir. Bu eser ve yazarı hangisinde birlikte verilmiştir?",
      secenekler: [
        "Tercüme-i Manzume – Şinasi",
        "Harnâme – Şeyhi",
        "Mantıku't-Tayr – Gülşehri",
        "Hamse – Nergisi"
      ],
      cozum:
        "Batılı anlamda ilk fabl örneklerini Şinasi, Tercüme-i Manzume adlı eseriyle vermiştir.",
      fc: [
        "Batılı anlamda ilk fabl örnekleri nedir?",
        "Şinasi'nin Tercüme-i Manzume adlı eseridir."
      ]
    },
    {
      bi: 1,
      metin:
        "Fabl türünün dünya edebiyatındaki en ünlü temsilcileri arasında Ezop, La Fontaine ve Beydeba sayılır. Buna göre fablın dünya edebiyatındaki ünlü yazarları hangisinde doğru verilmiştir?",
      secenekler: [
        "Ezop, La Fontaine, Beydeba",
        "Şinasi, Şeyhi, Gülşehri",
        "Nergisi, Nef'i, Baki",
        "Orwell, Thurber, Şeyhi"
      ],
      cozum:
        "Dünyanın en ünlü fabl yazarları Ezop, La Fontaine ve Beydeba'dır; Orwell ve Thurber çağdaş fabl yazarlarıdır.",
      fc: [
        "Dünyada fablın ünlü adları nedir?",
        "Ezop, La Fontaine ve Beydeba'dır."
      ]
    },
    {
      bi: 2,
      metin:
        "Gülşehri'nin Feridüddin Attar'dan çevirdiği ve fabl özelliği gösteren eserin aslı Farsçadır. Bu eser hangisidir?",
      secenekler: ["Mantıku't-Tayr", "Harnâme", "Kutadgu Bilig", "Tercüme-i Manzume"],
      cozum:
        "Gülşehri'nin Feridüddin Attar'dan çevirdiği Mantıku't-Tayr fabl özelliği gösteren bir eserdir; orijinali Farsçadır.",
      fc: [
        "Mantıku't-Tayr nedir?",
        "Gülşehri'nin Attar'dan çevirdiği, fabl özelliği gösteren Farsça asıllı eserdir."
      ]
    },
    {
      bi: 2,
      metin:
        "ABD'li James Thurber ve İngiliz George Orwell, fablın hangi dönemdeki temsilcileri olarak anılır?",
      secenekler: ["Çağdaş dönem", "Divan dönemi", "İslamiyet öncesi dönem", "Tanzimat dönemi"],
      cozum:
        "James Thurber ve George Orwell çağdaş fabl yazarlarıdır; türün çağdaş örneklerini vermişlerdir.",
      fc: [
        "Çağdaş fablın temsilcileri nedir?",
        "ABD'li James Thurber ve İngiliz George Orwell'dir."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir fablda kanaatkârlık, özveri ve yardımseverlik gibi davranışlar çocuklara kazandırılmak istenmiştir. Fablın bu işlevi hangi yönüyle ilgilidir?",
      secenekler: [
        "Öğretici olması",
        "Olağanüstü olması",
        "Nazım-nesir karışık olması",
        "Anonim olması"
      ],
      cozum:
        "Fabllar aracılığıyla olumlu davranışlar kazandırılır; bu yönüyle tür öğreticidir ve sonunda ahlak dersi verir.",
      fc: [
        "Fablın öğretici işlevi nedir?",
        "Olumlu davranışları kazandırması ve sonunda ahlak dersi vermesidir."
      ]
    }
  ]
});
