#!/usr/bin/env node
/* ============================================================
   TDE · 2. TEMA — DİVAN ŞİİRİ VE SAF ŞİİR konu havuzları
   ------------------------------------------------------------
   Kaynak: 10. sınıf TDE ders notları (Mustafa Çiftçi)
     edebiyat_10_u02_k01  Gazel        s.74-75
     edebiyat_10_u02_k02  Kaside       s.75-77
     edebiyat_10_u02_k03  Mersiye      s.79
     edebiyat_10_u02_k04  Saf (Öz) Şiir s.79-85
   Kullanım: node docs/uretim/uretim/tde-t02.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Türk Dili ve Edebiyatı";
const DOSYA = "10.Edebiyat.Ders.notlari.Yeni.Mufredat.pdf";
const TEMA = 2;
const TEMA_ADI = "Divan Şiiri ve Saf Şiir";

function kaynak(s) {
  return "10. sınıf TDE ders notları (Mustafa Çiftçi), s." + s;
}

/* ---------------- 1) GAZEL ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u02_k01",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Gazel",
  kazanim:
    "Gazelin biçim özelliklerini, kavramlarını ve konularına göre türlerini çözümleyebilme.",
  kaynak: kaynak("74-75"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Gazelin beyit, kafiye ve beyit sayısı özelliklerini belirler.",
    "Matla, makta, beytül gazel gibi gazel kavramlarını ayırt eder.",
    "Gazeli konusuna göre âşıkane, rindane, hakimane ve şûhâne olarak sınıflandırır."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Bir divan şairinin gazelini inceleyen öğrenci, önce şiirin beyit sayısını sayarak eserin türün sınırları içinde olup olmadığını kontrol eder. Gazelde beyit sayısı hangi aralıktadır?",
      secenekler: ["5-15 beyit", "3-5 beyit", "15-25 beyit", "33-99 beyit"],
      cozum:
        "Gazelin beyit sayısı 5-15 arasındadır. 33-99 beyit kasidenin, 3-5 bent şarkının ölçüsüdür.",
      fc: [
        "Gazelin beyit sayısı nedir?",
        "Genellikle 5-15 beyit arasındadır."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir gazelin ilk beyti kendi arasında kafiyelidir ve şiirin girişini oluşturur; sonraki beyitlerin ikinci dizeleri bu beyitle kafiyelenir. Bu beyde verilen ad hangisidir?",
      secenekler: ["Matla", "Makta", "Hüsn-i makta", "Beytül gazel"],
      cozum:
        "Gazelin ilk beytine matla denir. Son beyit makta, son beyitten önceki beyit hüsn-i makta, en güzel beyit beytül gazeldir.",
      fc: [
        "Matla nedir?",
        "Gazel ve kasidede ilk beyittir; kendi arasında kafiyelidir."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir gazelin son beytinde şair kendi mahlasını anmıştır. Bu beyit, şiirin son beyti olması dolayısıyla hangi adla anılır?",
      secenekler: ["Makta", "Matla", "Hüsn-i matla", "Tegazzül"],
      cozum:
        "Gazelin son beytine makta denir ve şairin mahlası bu beyitte yer alır. Kasidede mahlasın bulunduğu beyit ise taç beyit adını alır.",
      fc: [
        "Makta nedir?",
        "Gazel ve kasidede son beyittir; gazelde şairin mahlası bu beyittedir."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir gazel okumasında, beyitler arasında en çok beğenilen ve şairin ustalığını gösteren beyit ayrıca adlandırılır. Bu beyde verilen ad hangisidir?",
      secenekler: ["Beytül gazel", "Hüsn-i matla", "Hüsn-i makta", "Matla"],
      cozum:
        "Gazelin en güzel beytine beytül gazel (şah beyit) denir. Hüsn-i matla ikinci beyit, hüsn-i makta sondan bir önceki beyittir.",
      fc: [
        "Beytül gazel nedir?",
        "Gazelin en güzel beytidir; şah beyit de denir."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir gazelde ilk beyit kendi içinde, sonraki beyitlerin yalnızca ikinci dizeleri ilk beyitle kafiyelidir. Bu kafiye düzeni hangisidir?",
      secenekler: ["aa, ba, ca, da", "abab, cccb, dddb", "aaxa, aaaa", "aa, bb, cc, dd"],
      cozum:
        "Gazelde kafiye şeması aa, ba, ca, da biçimindedir. abab-cccb şarkının, aaxa tuyuğun düzenidir.",
      fc: [
        "Gazelin kafiye düzeni nedir?",
        "aa, ba, ca, da biçimindedir; ilk beyit kendi içinde kafiyelidir."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir gazelin bütün beyitlerinde aynı konu işlenmiş, şiir boyunca anlam birliği korunmuştur. Bu gazel hangi adla anılır?",
      secenekler: ["Yek-ahenk gazel", "Yek-avaz gazel", "Hüsn-i matla", "Şah beyit"],
      cozum:
        "Bütün beyitlerinde aynı konunun işlendiği, anlam birliği bulunan gazel yek-ahenktir. Yek-avaz ise beyitleri aynı güzellikte olan gazeldir.",
      fc: [
        "Yek-ahenk gazel nedir?",
        "Bütün beyitlerinde aynı konunun işlendiği, anlam birliği olan gazeldir."
      ]
    },
    {
      bi: 2,
      metin:
        "Başka bir gazelde beyitler konu bakımından farklıdır; ancak beyitlerin tamamı aynı güzellik düzeyindedir. Bu gazel hangi adla anılır?",
      secenekler: ["Yek-avaz gazel", "Yek-ahenk gazel", "Müstezat", "Şarkı"],
      cozum:
        "Bütün beyitleri aynı güzelliğe sahip gazeller yek-avaz adını alır. Konu birliği aranmaz; ölçüt güzellik düzeyinin eşitliğidir.",
      fc: [
        "Yek-avaz gazel nedir?",
        "Bütün beyitleri aynı güzelliğe sahip olan gazeldir."
      ]
    },
    {
      bi: 2,
      metin:
        "Divan şiirinde gazellerin başlığı yoktur; bir gazel redifindeki sözcükle ya da ilk mısrasıyla anılır. Buna göre gazellerin adlandırılmasında ne esas alınır?",
      secenekler: [
        "Redifiyle ya da ilk mısrasıyla",
        "Şairin mahlasıyla",
        "Beyit sayısının adıyla",
        "Bestelendiği makamla"
      ],
      cozum:
        "Gazellerin başlığı bulunmadığı için adlandırma rediflerine göre ya da ilk mısralarına göre yapılır.",
      fc: [
        "Gazellerin adlandırılma biçimi nasıldır?",
        "Başlıkları yoktur; rediflerine göre ya da ilk mısralarına göre adlandırılır."
      ]
    },
    {
      bi: 2,
      metin:
        "Bir gazelde aşkın verdiği acı, hasret ve içli duygular dile getirilmiştir; bu türün en iyi örneği Fuzuli'nin gazelleridir. Gazel konusuna göre hangi adı alır?",
      secenekler: ["Âşıkane gazel", "Rindane gazel", "Hakimane gazel", "Şûhâne gazel"],
      cozum:
        "Aşka ilişkin acı ve mutluluk gibi içli duyguları işleyen gazeller âşıkane gazeldir; Fuzuli bu türün en iyi örneğidir.",
      fc: [
        "Âşıkane gazel nedir?",
        "Aşka ilişkin acı, hasret ve mutluluk gibi içli duyguları işleyen gazeldir; Fuzuli."
      ]
    },
    {
      bi: 2,
      metin:
        "İçki, yaşamı boş verme ve yaşamdan zevk alma konularında yazılan gazellerin en iyi örneği Baki'nin gazelleridir. Bu gazel türü hangisidir?",
      secenekler: ["Rindane gazel", "Âşıkane gazel", "Hikemî gazel", "Şûhâne gazel"],
      cozum:
        "İçki ve yaşamdan zevk alma konularını işleyen gazeller rindanedir; Baki örnek gösterilir. Öğretici ve sosyal konulu gazeller hikemî, sevgilinin güzelliğini anlatanlar şûhânedir.",
      fc: [
        "Rindane gazel nedir?",
        "İçki, yaşamı boş verme ve zevk alma konularını işleyen gazeldir; Baki."
      ]
    }
  ]
});

/* ---------------- 2) KASİDE ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u02_k02",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Kaside",
  kazanim:
    "Kasidenin bölümlerini, biçim özelliklerini ve konularına göre aldığı adları çözümleyebilme.",
  kaynak: kaynak("75-77"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Kasidenin beyit sayısı, matla, taç beyit gibi biçim özelliklerini belirler.",
    "Nesip, girizgâh, methiye, tegazzül, fahriye ve dua bölümlerini ayırt eder.",
    "Kasideyi konusuna göre tevhit, naat, cülûsiye gibi adlarla sınıflandırır."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Bir divan şairi, devrin ileri gelen bir devlet adamını övmek için uzun bir şiir yazmıştır; türün temel amacı övmek ve yermektir. Bu nazım biçimi hangisidir?",
      secenekler: ["Kaside", "Gazel", "Mesnevi", "Mersiye"],
      cozum:
        "Birini övmek ya da yermek amacıyla yazılan, genellikle din ve devlet adamlarına sunulan uzun divan şiiri kasidedir.",
      fc: [
        "Kaside nedir?",
        "Birini övmek ya da yermek amacıyla yazılan uzun divan edebiyatı nazım biçimidir."
      ]
    },
    {
      bi: 0,
      metin:
        "Kasidenin beyit sayısı gazelden belirgin biçimde fazladır; bu yüzden kaside uzun soluklu bir tür sayılır. Kaside en az ve en çok kaç beyitten oluşur?",
      secenekler: ["33-99 beyit", "5-15 beyit", "15-25 beyit", "3-5 beyit"],
      cozum:
        "Kaside en az 33, en çok 99 beyitten oluşur. 33'ten az, 99'dan çok yazılan kasideler de vardır.",
      fc: [
        "Kasidenin beyit sayısı nedir?",
        "En az 33, en çok 99 beyittir; bu sınırların dışına çıkan örnekler de görülür."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir kasidede sunulan kişinin övüldüğü bölüm, abartılı anlatımı ve ağır diliyle öne çıkar; kasidenin en uzun ve en sanatlı bölümüdür. Bu bölüm hangisidir?",
      secenekler: ["Methiye", "Girizgâh", "Tegazzül", "Nesip"],
      cozum:
        "Kasidenin sunulduğu kişinin övüldüğü bölüm methiyedir; şiir yönü zayıf, dili ağır ve anlatımı abartılıdır.",
      fc: [
        "Methiye bölümü nedir?",
        "Kasidede övülen kişinin anlatıldığı, en uzun ve en sanatlı bölümdür."
      ]
    },
    {
      bi: 1,
      metin:
        "Kasidede betimlemeden övgüye geçileceğini haber veren, basamak görevi yapan ve 1-2 beyitten oluşan bölüm hangisidir?",
      secenekler: ["Girizgâh", "Methiye", "Fahriye", "Dua"],
      cozum:
        "Nesip bölümünden methiyeye geçişte söylenen, övgüye başlanacağını bildiren beyitler girizgâhtır ve 1-2 beyittir.",
      fc: [
        "Girizgâh nedir?",
        "Kasidede nesipten methiyeye geçişi sağlayan, 1-2 beyitlik basamak bölümüdür."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir şair, kaside içinde monotonluğu kırmak için aynı ölçü ve uyakla gazel söylemiştir. Her kasidede bulunmayan bu bölüm hangisidir?",
      secenekler: ["Tegazzül", "Fahriye", "Girizgâh", "Teşbib"],
      cozum:
        "Kaside içinde gazel söyleme anlamına gelen bölüm tegazzüldür; bütün kasidelerde bulunmaz.",
      fc: [
        "Tegazzül nedir?",
        "Kaside içinde aynı ölçü ve uyakla gazel söylenen, her kasidede bulunmayan bölümdür."
      ]
    },
    {
      bi: 1,
      metin:
        "Kasidenin altıncı bölümünde şair kendi başarısını ve sanatını anlatır. Bu bölüm hangisidir?",
      secenekler: ["Fahriye", "Methiye", "Dua", "Nesip"],
      cozum:
        "Şairin kendini övdüğü bölüm fahriyedir; methiyede ise sunulan kişi övülür.",
      fc: [
        "Fahriye bölümü nedir?",
        "Kasidede şairin kendini övdüğü bölümdür."
      ]
    },
    {
      bi: 2,
      metin:
        "Bir kasidenin son bölümünde şair, övdüğü kişinin uzun ömürlü ve talihli olması için dileklerde bulunur. Bu bölüm hangisidir?",
      secenekler: ["Dua", "Fahriye", "Tegazzül", "Methiye"],
      cozum:
        "Kasidenin son bölümü duadır ve birkaç beyitten oluşur; şairin mahlasının geçtiği taç beyit de bu bölümde bulunur.",
      fc: [
        "Dua bölümü nedir?",
        "Kasidenin son bölümüdür; övülen kişi için iyi dilekler söylenir, taç beyit buradadır."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir kasidenin ilk bölümünde 15-20 beyit boyunca kış mevsimi betimlenmiştir. Mevsim betimlemesi içerdiği için bu bölüm hangi adı alır?",
      secenekler: ["Teşbib", "Girizgâh", "Fahriye", "Tegazzül"],
      cozum:
        "Kasidenin ilk bölümü nesiptir; bu bölüm mevsim betimlemesi içerdiğinde teşbib adını alır.",
      fc: [
        "Teşbib nedir?",
        "Kasidenin ilk bölümü olan nesbin mevsim betimlemesi içeren biçimidir."
      ]
    },
    {
      bi: 2,
      metin:
        "Bir şair, Peygamber'i övmek amacıyla kaside yazmıştır. Bu kaside konusuna göre hangi adı alır?",
      secenekler: ["Naat", "Tevhit", "Münacat", "Cülûsiye"],
      cozum:
        "Peygamber'i övmek için yazılan kasideler naat, Allah'ın birliğini anlatanlar tevhit, dua amacıyla yazılanlar münacattır.",
      fc: [
        "Naat nedir?",
        "Peygamber'i övmek amacıyla yazılan kasidedir."
      ]
    },
    {
      bi: 2,
      metin:
        "Bir padişahın tahta geçişi dolayısıyla kaside yazılmıştır. Bu kaside konusuna göre hangi adı alır?",
      secenekler: ["Cülûsiye", "Şehrengiz", "Hicviye", "Fahriye"],
      cozum:
        "Padişahın tahta geçişi için yazılan kaside cülûsiyedir. Şehrengiz bir şehrin güzelliklerini, hicviye eleştiriyi konu alır.",
      fc: [
        "Cülûsiye nedir?",
        "Padişahın tahta geçişi dolayısıyla yazılan kasidedir."
      ]
    }
  ]
});

/* ---------------- 3) MERSİYE ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u02_k03",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Mersiye",
  kazanim:
    "Mersiyenin tanımını, dönemlerdeki karşılıklarını ve önemli örneklerini çözümleyebilme.",
  kaynak: kaynak("79"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Mersiyeyi tanımı ve yazılış amacı bakımından belirler.",
    "Ölüm temasının İslamiyet öncesi ve halk edebiyatındaki karşılıklarını eşleştirir.",
    "Mersiyenin önemli şairlerini ve örnek eserlerini ayırt eder."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Bir divan şairi, ölen bir devlet büyüğünün ardından duyduğu üzüntüyü ve yas duygularını dile getiren bir şiir yazmıştır. Bu nazım türü hangisidir?",
      secenekler: ["Mersiye", "Kaside", "Gazel", "Mesnevi"],
      cozum:
        "Ölen kişilerin ardından söylenen yas şiirlerine mersiye denir; divan edebiyatında bir nazım türüdür.",
      fc: [
        "Mersiye nedir?",
        "Ölen kişilerin ardından söylenen yas şiirleridir."
      ]
    },
    {
      bi: 0,
      metin:
        "İslamiyet öncesi Türk edebiyatında ölümün ardından duyulan acıyı anlatan şiirlere ayrı bir ad verilmiştir. Bu ad hangisidir?",
      secenekler: ["Sagu", "Sav", "Koşuk", "Ağıt"],
      cozum:
        "İslamiyet öncesi edebiyatta yas şiirlerinin adı sagudur; sav atasözü niteliğindeki sözlerdir, koşuk ise av ve toy şiiridir.",
      fc: [
        "Sagu nedir?",
        "İslamiyet öncesi Türk edebiyatında ölümün ardından söylenen yas şiirleridir."
      ]
    },
    {
      bi: 0,
      metin:
        "Halk edebiyatında ölen bir kişinin ardından yakılan yas şiirleri ayrı bir adla anılır. Bu ad hangisidir?",
      secenekler: ["Ağıt", "Sagu", "Mani", "Türkü"],
      cozum:
        "Halk edebiyatında ölümün ardından yakılan yas şiirlerine ağıt denir; divan edebiyatındaki karşılığı mersiyedir.",
      fc: [
        "Ağıt nedir?",
        "Halk edebiyatında ölen kişinin ardından yakılan yas şiirleridir."
      ]
    },
    {
      bi: 1,
      metin:
        "Mersiyeler, yas duygusunun uzun ve ağır anlatımına elverişli nazım şekilleriyle yazılır. Mersiyede hangi nazım şekilleri kullanılır?",
      secenekler: [
        "Terkib-i bend ve kaside",
        "Gazel ve şarkı",
        "Tuyuğ ve rubai",
        "Mesnevi ve sone"
      ],
      cozum:
        "Mersiyeler genellikle terkib-i bend ve kaside nazım şekilleriyle yazılır.",
      fc: [
        "Mersiyede kullanılan nazım şekilleri nedir?",
        "Genellikle terkib-i bend ve kaside nazım şekilleridir."
      ]
    },
    {
      bi: 1,
      metin:
        "Germiyan Beyi Süleyman Şah 1387'de öldüğünde ardından bir yas şiiri yazılmış; bu şiir Anadolu Türk edebiyatında türünün ilk örneği kabul edilmiştir. Bu şiir hangi olay üzerine yazılmıştır?",
      secenekler: [
        "Bir beyin ölümü",
        "Bir padişahın tahta çıkışı",
        "Bir şehrin güzelliği",
        "Bir seferin zaferi"
      ],
      cozum:
        "Germiyan Beyi Süleyman Şah'ın ölümü üzerine Ahmedi'nin yazdığı mersiye, Anadolu Türk edebiyatında ilk mersiye örneği kabul edilir.",
      fc: [
        "Anadolu'da ilk mersiye örneği nedir?",
        "Ahmedi'nin Germiyan Beyi Süleyman Şah için yazdığı mersiyedir."
      ]
    },
    {
      bi: 1,
      metin:
        "Edebiyatımızda önemli bir yer tutan 'Kanuni Mersiyesi' Kanuni Sultan Süleyman'ın ölümü üzerine yazılmıştır. Bu eser kime aittir?",
      secenekler: ["Baki", "Ahmedi", "Nef'i", "Fuzuli"],
      cozum:
        "Baki'nin Kanuni için yazdığı 'Kanuni Mersiyesi' edebiyatımızda önemli bir yer tutar.",
      fc: [
        "Baki'nin ünlü mersiyesi nedir?",
        "Kanuni Mersiyesi'dir; Kanuni Sultan Süleyman'ın ölümü üzerine yazmıştır."
      ]
    },
    {
      bi: 2,
      metin:
        "Kanuni Sultan Süleyman'ın oğlu Şehzade Mustafa'nın hazin ölümü üzerine bir mersiye yazılmış ve bu şiir edebiyatımızda meşhur olmuştur. Bu şiir hangisidir?",
      secenekler: [
        "Taşlıcalı Yahya'nın mersiyesi",
        "Kanuni Mersiyesi",
        "Mersiye-yi Gürbe",
        "Süleyman Şah mersiyesi"
      ],
      cozum:
        "Şehzade Mustafa'nın ölümü için Taşlıcalı Yahya'nın yazdığı mersiye meşhurdur. Kanuni Mersiyesi babası için Baki'nin yazdığı eserdir.",
      fc: [
        "Şehzade Mustafa mersiyesi nedir?",
        "Taşlıcalı Yahya'nın Şehzade Mustafa'nın ölümü üzerine yazdığı mersiyedir."
      ]
    },
    {
      bi: 1,
      metin:
        "16. yüzyıl şairi Meâlî'nin 'Mersiye-yi Gürbe' adlı manzumesi, dünya edebiyatında türünün en güzel örneklerinden sayılır. Bu eser hangi varlık için yazılmıştır?",
      secenekler: ["Ölen kedisi", "Ölen oğlu", "Ölen padişah", "Ölen atı"],
      cozum:
        "Mersiye-yi Gürbe 'kedi mersiyesi' anlamına gelir; şair ölen kedisinin özelliklerini mübalağalı bir üslupla anlatmıştır.",
      fc: [
        "Mersiye-yi Gürbe nedir?",
        "Meâlî'nin ölen kedisi için yazdığı mersiyedir; kedi mersiyesi diye de anılır."
      ]
    },
    {
      bi: 2,
      metin:
        "Bir şiirin işlediği konuya göre aldığı ad 'nazım türü' olarak tanımlanır. Bu tanıma göre mersiye hangi kavramla nitelendirilir?",
      secenekler: ["Nazım türü", "Nazım biçimi", "Ölçü kalıbı", "Kafiye düzeni"],
      cozum:
        "Konuya göre belirlenen ad nazım türüdür; mersiye ölüm konusunu işlediği için nazım türüdür. Kaside ve gazel ise nazım biçimidir.",
      fc: [
        "Nazım türü nedir?",
        "Bir şiirin işlediği konuya göre aldığı addır; mersiye, naat, tevhit gibi."
      ]
    },
    {
      bi: 2,
      metin:
        "Ölüm teması, Türk edebiyatının farklı dönemlerinde farklı adlarla karşılanmıştır. Buna göre doğru eşleştirme hangisidir?",
      secenekler: [
        "Sagu – ağıt – mersiye",
        "Koşuk – türkü – gazel",
        "Sav – mani – kaside",
        "Destan – koşma – şarkı"
      ],
      cozum:
        "Ölüm teması İslamiyet öncesinde sagu, halk edebiyatında ağıt, divan edebiyatında mersiye adını alır.",
      fc: [
        "Ölüm temasının dönemlere göre adları nedir?",
        "İslamiyet öncesi sagu, halk edebiyatı ağıt, divan edebiyatı mersiye."
      ]
    }
  ]
});

/* ---------------- 4) SAF (ÖZ) ŞİİR ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u02_k04",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Saf (Öz) Şiir Anlayışı",
  kazanim:
    "Saf (öz) şiir anlayışının ilkelerini, temsilcilerini ve şiir diline ilişkin kavramları çözümleyebilme.",
  kaynak: kaynak("79-85"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Saf şiir anlayışının temel ilkelerini ve sanat tavrını belirler.",
    "Anlayışın mimarlarını ve sürdürücülerini ayırt eder.",
    "İmge, çağrışım ve sembol kavramlarını şiir üzerinde çözümler."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Millî Edebiyat yıllarında bir şair, halkın sorunlarını anlatmak yerine yalnızca sanat değeri yüksek şiir yazmayı amaçlamıştır. Bu anlayışın benimsediği ilke hangisidir?",
      secenekler: [
        "Sanat için sanat",
        "Sanat toplum içindir",
        "Sanat ahlak içindir",
        "Sanat devlet içindir"
      ],
      cozum:
        "Saf (öz) şiir anlayışında öğreticilik ve toplumsallık reddedilmiş, 'sanat için sanat' ilkesi benimsenmiştir.",
      fc: [
        "Saf şiirin temel ilkesi nedir?",
        "'Sanat için sanat' ilkesidir; şiir hiçbir şeyin aracı olmamalıdır."
      ]
    },
    {
      bi: 0,
      metin:
        "Saf şiirde şiirin tek amacı iyi şiir yazmaktır; bu yüzden şiirden bilgi ve ders çıkarma beklenmez. Bu anlayışta öğreticilik ve toplumsallık nasıl değerlendirilir?",
      secenekler: [
        "Reddedilir",
        "Ön planda tutulur",
        "Yalnız tarih şiirlerinde istenir",
        "Şiirin tek amacı sayılır"
      ],
      cozum:
        "Saf şiirde öğreticilik ve toplumsallık reddedilir; estetik tavır ön plandadır.",
      fc: [
        "Saf şiirde öğreticiliğin yeri nedir?",
        "Reddedilir; şiir öğretmeyi değil estetik haz vermeyi amaçlar."
      ]
    },
    {
      bi: 0,
      metin:
        "Saf şiirde şair, kelimelere yeni anlamlar yükler ve anlamı her okurun kendisinin sezmesini bekler. Bu anlayışta şiirin anlatımı nasıl nitelendirilir?",
      secenekler: [
        "İmgelerle yüklü ve kapalı",
        "Yalın ve açık",
        "Öğretici ve düz",
        "Söylevci ve coşkulu"
      ],
      cozum:
        "Saf şiir duyulmak ve hissedilmek için yazıldığından imgelerle yüklü, kapalı bir anlatıma sahiptir.",
      fc: [
        "Saf şiirin anlatım özelliği nedir?",
        "İmgelerle yüklü ve kapalı bir anlatımdır; anlam okurda tamamlanır."
      ]
    },
    {
      bi: 0,
      metin:
        "Modern Türk şiirinde saf şiir anlayışının öncüleri iki şair olarak gösterilir. Bu şairler hangisinde birlikte verilmiştir?",
      secenekler: [
        "Yahya Kemal – Ahmet Haşim",
        "Mehmet Akif – Tevfik Fikret",
        "Necip Fazıl – Nazım Hikmet",
        "Cahit Sıtkı – Orhan Veli"
      ],
      cozum:
        "Modern Türk şiirinde saf şiir anlayışının mimarları Yahya Kemal Beyatlı ve Ahmet Haşim'dir.",
      fc: [
        "Saf şiir anlayışının iki mimarı nedir?",
        "Yahya Kemal Beyatlı ve Ahmet Haşim'dir."
      ]
    },
    {
      bi: 1,
      metin:
        "Ahmet Haşim, şiirin düzyazıya çevrilemeyeceğini savunarak anlam kapalılığını temellendirmiştir. Haşim'in şiir tarifi hangisidir?",
      secenekler: [
        "Nesre çevrilme olanağı bulunmayan nazım",
        "Topluma yol gösteren bir söylev",
        "Heceyle yazılan bir halk şiiri",
        "Öğretici bir düzyazı türü"
      ],
      cozum:
        "Ahmet Haşim şiiri 'nesre çevrilme olanağı bulunmayan nazım' olarak tarif eder ve 'sanat için sanat' anlayışıyla yazar.",
      fc: [
        "Ahmet Haşim'in şiir tarifi nedir?",
        "'Nesre çevrilme olanağı bulunmayan nazım'dır."
      ]
    },
    {
      bi: 1,
      metin:
        "Ahmet Haşim'e göre şiir, söz ile musiki arasında bir yerde durur; ancak bu ikisinden birine daha yakındır. Haşim şiiri hangisine yakın görür?",
      secenekler: ["Musikiye", "Söze", "Resme", "Felsefeye"],
      cozum:
        "Ahmet Haşim'e göre şiir, musiki ile söz arasında, sözden ziyade musikiye yakındır.",
      fc: [
        "Ahmet Haşim'e göre şiirin yakın olduğu sanat nedir?",
        "Musiki ile söz arasında, sözden ziyade musikiye yakındır."
      ]
    },
    {
      bi: 1,
      metin:
        "Yahya Kemal, Batı'da gördüğü bir akımdan etkilenmiş; divan şiiri anlayışıyla modern söyleyişi birleştirerek sentez kurmuştur. Bu akım hangisidir?",
      secenekler: ["Parnasizm", "Sembolizm", "Realizm", "Natüralizm"],
      cozum:
        "Yahya Kemal parnasizmden etkilenmiş, divan şiiri anlayışıyla modern şiirin söyleyiş özelliklerini birleştirerek neo-klasik bir şiir geliştirmiştir.",
      fc: [
        "Yahya Kemal'in etkilendiği Batı akımı nedir?",
        "Parnasizmdir; divan şiiriyle modern söyleyişi birleştirmiştir."
      ]
    },
    {
      bi: 1,
      metin:
        "Ahmet Haşim'in şiirlerinde çöl, göl, akşam, gurbet ve daüssıla gibi imgeler sıkça yinelenir. Bu imgeler şiirde hangi yönüyle öne çıkar?",
      secenekler: [
        "Bireysel temaları yansıtmaları",
        "Toplumsal sorunları anlatmaları",
        "Öğretici bilgi vermeleri",
        "Tarihî olayları sıralamaları"
      ],
      cozum:
        "Haşim bu imgeler etrafında toplumsallıktan uzak, bireysel temaları öne çıkarır.",
      fc: [
        "Ahmet Haşim'in imgelerinin taşıdığı tema nedir?",
        "Toplumsallıktan uzak bireysel temaları; çöl, göl, akşam, gurbet, daüssıla."
      ]
    },
    {
      bi: 2,
      metin:
        "Günlük dildeki sembollerin anlamı toplumsal anlaşmayla önceden belirlenmiştir. Edebî sembolleri günlük sembollerden ayıran özellik hangisidir?",
      secenekler: [
        "Değişik yorumlara açık olmaları",
        "Tek anlam taşımaları",
        "Herkesçe aynı anlaşılmaları",
        "Önceden kararlaştırılmaları"
      ],
      cozum:
        "Edebî sembollerin anlamı önceden kararlaştırılmamıştır; görecelidir ve değişik yorumlara açıktır.",
      fc: [
        "Edebî sembol nedir?",
        "Anlamı önceden kararlaştırılmamış, göreceli ve değişik yorumlara açık semboldür."
      ]
    },
    {
      bi: 2,
      metin:
        "Bir şair, dış dünyada gördüğü manzarayı zihninde kendi duygu ve düşünceleriyle birleştirip yeni bir benzetmeyle anlatmıştır. Bu anlatım hangi kavramla adlandırılır?",
      secenekler: ["İmge", "Çağrışım", "Sembol", "Tema"],
      cozum:
        "Kişinin dış dünyada gördüğü şeyleri zihninde duygu ve düşünceleriyle bağdaştırıp temsil etmesi imgedir; imge özneldir.",
      fc: [
        "İmge nedir?",
        "Dış dünyada görülenlerin zihinde duygu ve düşüncelerle bağdaştırılıp temsil edilmesidir."
      ]
    }
  ]
});
