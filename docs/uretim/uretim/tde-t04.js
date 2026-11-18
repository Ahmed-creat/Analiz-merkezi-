#!/usr/bin/env node
/* ============================================================
   TDE · 4. TEMA (NESİLLERİN MİRASI)
   ------------------------------------------------------------
   Kaynak: 10. sınıf TDE ders notları (Mustafa Çiftçi)
     edebiyat_10_u04_k01  Dede Korkut Hikâyeleri   s.131-132
     edebiyat_10_u04_k02  Tanzimat Şiiri          s.133
     edebiyat_10_u04_k03  Fiiller (Eylemler)      s.134-147
   Kullanım: node docs/uretim/uretim/tde-t04.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Türk Dili ve Edebiyatı";
const DOSYA = "10.Edebiyat.Ders.notlari.Yeni.Mufredat.pdf";
const TEMA = 4;
const TEMA_ADI = "Nesillerin Mirası";

function kaynak(s) {
  return "10. sınıf TDE ders notları (Mustafa Çiftçi), s." + s;
}

/* ---------------- 1) DEDE KORKUT HİKÂYELERİ ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u04_k01",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Dede Korkut Hikâyeleri",
  kazanim:
    "Dede Korkut Hikâyelerinin edebiyatımızdaki yerini, nüshalarını ve içerik özelliklerini çözümleyebilme.",
  kaynak: kaynak("131-132"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Eserin edebiyat tarihindeki yerini ve yazıya geçirilme sürecini belirler.",
    "Eserin nüshalarını ve bu nüshaların özelliklerini ayırt eder.",
    "Hikâyelerin konu, dil ve didaktik özelliklerini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Destansı Oğuz hikâyelerinin toplandığı eserin asıl adı \"Kitab-ı Dedem Korkut Ala Lisan-ı Taife-i Oğuzan\"dır. Bu ad hangi anlama gelir?",
      secenekler: [
        "Oğuzların diliyle Dede Korkut Kitabı",
        "Dede Korkut'un Oğuz boyları",
        "Oğuzname derlemesi",
        "Türkmen hikâyeleri"
      ],
      cozum:
        "Eserin asıl adı \"Oğuzların Diliyle Dede Korkut Kitabı\" anlamına gelir; hikâyeler destansı Oğuz anlatılarıdır.",
      fc: [
        "Dede Korkut Kitabı'nın asıl adı nedir?",
        "Kitab-ı Dedem Korkut Ala Lisan-ı Taife-i Oğuzan'dır; Oğuzların diliyle Dede Korkut Kitabı."
      ]
    },
    {
      bi: 0,
      metin:
        "Dede Korkut Hikâyeleri, Türk edebiyatında iki dönem arasındaki geçişin en önemli ürünü sayılır. Bu geçiş hangi iki dönem arasındadır?",
      secenekler: [
        "Destan döneminden halk hikâyeciliğine",
        "Divan edebiyatından Tanzimat'a",
        "İslamiyet öncesinden divan şiirine",
        "Halk hikâyeciliğinden romana"
      ],
      cozum:
        "Dede Korkut Hikâyeleri, destan döneminden halk hikâyeciliğine geçiş döneminin en önemli ürünüdür.",
      fc: [
        "Dede Korkut Hikâyelerinin edebiyattaki yeri nedir?",
        "Destan döneminden halk hikâyeciliğine geçişin en önemli ürünüdür."
      ]
    },
    {
      bi: 1,
      metin:
        "Eserin 15. yüzyılda yazıya geçirildiği, Akkoyunlu Devleti'nin çökmeye başladığı dönemde kayda alındığı tahmin edilmektedir. Eserin söyleyeni için ne söylenir?",
      secenekler: [
        "Anonim bir eserdir",
        "Tek yazarlı bir eserdir",
        "Saray şairinin eseridir",
        "Tanzimat yazarının eseridir"
      ],
      cozum:
        "Dede Korkut Hikâyeleri anonim bir eserdir; eserde adı geçen Dede Korkut meçhul bir halk ozanıdır.",
      fc: [
        "Dede Korkut Hikâyelerinin anonimlik durumu nedir?",
        "Anonim bir eserdir; Dede Korkut meçhul bir halk ozanıdır."
      ]
    },
    {
      bi: 1,
      metin:
        "Eserin bilinen beş nüshası vardır ve bunlardan biri 2019'da İran'ın Günbed şehrinde bulunmuştur. Bu nüshada kaç hikâye yer alır?",
      secenekler: ["13 hikâye", "12 hikâye", "6 hikâye", "11 yaprak"],
      cozum:
        "Günbed (Türkistan) nüshasında 13 hikâye bulunur. Dresden nüshasında 1 ön söz ve 12 hikâye, Vatikan nüshasında 6 hikâye vardır.",
      fc: [
        "Günbed (Türkistan) nüshası nedir?",
        "2019'da İran'da bulunan, 13 hikâye içeren nüshadır."
      ]
    },
    {
      bi: 2,
      metin:
        "Eserin Dresden Kitaplığında bulunan nüshasında bir ön söz ile birlikte kaç hikâye yer alır?",
      secenekler: ["12 hikâye", "13 hikâye", "6 hikâye", "9 hikâye"],
      cozum:
        "Almanya Dresden Kitaplığındaki nüshada 1 ön söz ve 12 hikâye bulunur; eserin en tam nüshası olarak bilinir.",
      fc: [
        "Dresden nüshası nedir?",
        "Almanya'da bulunan, 1 ön söz ile 12 hikâye içeren nüshadır."
      ]
    },
    {
      bi: 0,
      metin:
        "Eserde nazım ile nesir iç içedir; olağanüstü olaylarla gerçeğe uygun olaylar birlikte yer alır. Bu durum eserin hangi yönünü gösterir?",
      secenekler: [
        "Geçiş dönemi ürünü olduğunu",
        "Tamamen masal olduğunu",
        "Divan şiiri etkisinde yazıldığını",
        "Yakın dönemde yazıldığını"
      ],
      cozum:
        "Nazım-nesir karışıklığı ve olağanüstü ile gerçek olayların iç içeliği, eserin destandan halk hikâyeciliğine geçiş dönemi ürünü olmasından kaynaklanır.",
      fc: [
        "Dede Korkut'ta nazım ve nesir ilişkisi nedir?",
        "Nazım ile nesir iç içedir; olağanüstü ve gerçek olaylar birlikte yer alır."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Bütün Türk edebiyatını terazinin bir gözüne, Dede Korkut Kitabı'nı da diğer gözüne koysanız Dede Korkut ağır basar.\" sözü kime aittir?",
      secenekler: ["Mehmet Fuat Köprülü", "Namık Kemal", "Şinasi", "Ziya Paşa"],
      cozum:
        "Bu söz, eserin Türk edebiyatı tarihindeki önemini anlatmak için Mehmet Fuat Köprülü'ye aittir.",
      fc: [
        "Köprülü'nün Dede Korkut sözü nedir?",
        "'Bütün Türk edebiyatını terazinin bir gözüne, Dede Korkut Kitabı'nı da diğer gözüne koysanız Dede Korkut ağır basar.' sözüdür."
      ]
    },
    {
      bi: 2,
      metin:
        "Hikâyelerde pek çok öğüt bulunur; bu yönüyle eser okuyucuya yol gösterir. Bu özellik eserin hangi niteliğini gösterir?",
      secenekler: ["Didaktik", "Lirik", "Epik", "Pastoral"],
      cozum:
        "Öğütlerin çokluğu eseri didaktik kılar; hikâyelerde aileye, kadına, çocuk terbiyesine önem verilir.",
      fc: [
        "Dede Korkut Hikâyelerinin didaktik yönü nedir?",
        "İçindeki öğütlerle okuyucuya yol göstermesidir."
      ]
    },
    {
      bi: 1,
      metin:
        "Hikâyelerde aşk, yiğitlik gösterisi, kahramanlık ve boylar arasındaki savaş konu edilir. Hikâyelerde en önemli meziyet olarak hangisi öne çıkar?",
      secenekler: ["Kahramanlık", "Zenginlik", "Kurnazlık", "Ticaret"],
      cozum:
        "Hikâyelerde en önemli meziyet kahramanlıktır; konular aşk, yiğitlik ve boylar arası savaştır.",
      fc: [
        "Dede Korkut'ta en önemli meziyet nedir?",
        "Kahramanlıktır; konular aşk, yiğitlik ve boylar arası savaştır."
      ]
    },
    {
      bi: 2,
      metin:
        "Hikâyelerde aileye, çoğalmaya, kadına ve çocuk terbiyesine büyük önem verilir; ön sözde kadın tipleri çizilir. Ön sözde kaç ayrı kadın tipi çizilmiştir?",
      secenekler: ["Dört", "İki", "Üç", "Beş"],
      cozum:
        "Dede Korkut'un ön sözünde dört ayrı kadın tipi çizilir; eserde kadın ailenin en önemli unsuru olarak vurgulanır.",
      fc: [
        "Dede Korkut'un ön sözünde çizilen tipler nedir?",
        "Dört ayrı kadın tipidir."
      ]
    }
  ]
});

/* ---------------- 2) TANZİMAT ŞİİRİ ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u04_k02",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Tanzimat Dönemi Şiiri",
  kazanim:
    "Tanzimat şiirinin iki dönemini sanat anlayışı, dil ve içerik bakımından karşılaştırabilme.",
  kaynak: kaynak("133"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Tanzimat I. dönem şiirinin sanat anlayışını ve getirdiği kavramları belirler.",
    "Tanzimat II. dönem şiirinin sanat anlayışını ve konularını çözümler.",
    "İki dönemi dil, biçim ve içerik bakımından karşılaştırır."
  ],
  items: [
    {
      bi: 0,
      metin:
        "1860-1876 yılları arasındaki dönemde sanatçılar edebiyatı halkı eğitmede bir araç saymıştır. Bu dönemin benimsediği anlayış hangisidir?",
      secenekler: [
        "Sanat toplum içindir",
        "Sanat için sanat",
        "Sanat devlet içindir",
        "Sanat ahlak içindir"
      ],
      cozum:
        "Tanzimat I. dönemde \"sanat toplum içindir\" anlayışı benimsenmiş, edebiyat halkı eğitmenin aracı sayılmıştır.",
      fc: [
        "Tanzimat I. dönemin sanat anlayışı nedir?",
        "\"Sanat toplum içindir\" anlayışıdır; edebiyat halkı eğitme aracıdır."
      ]
    },
    {
      bi: 0,
      metin:
        "Tanzimat I. döneminde edebiyata hak, adalet, millet, halk, vatan, özgürlük ve eşitlik gibi kavramlar girmiştir. Bu kavramların girmesi hangi yönüyle açıklanır?",
      secenekler: [
        "İlk kez bu dönemde kullanılmaları",
        "Divan şiirinden alınmaları",
        "Halk hikâyelerinde görülmeleri",
        "Tanzimat II. dönemde doğmaları"
      ],
      cozum:
        "Bu kavramlar Tanzimat I. dönemde edebiyatta ilk kez kullanılmış; şiirin içeriği divan şiirinden farklılaşmıştır.",
      fc: [
        "Tanzimat I. dönemde edebiyata giren yeni kavramlar nedir?",
        "Hak, adalet, millet, halk, vatan, özgürlük ve eşitlik gibi kavramlardır."
      ]
    },
    {
      bi: 1,
      metin:
        "Tanzimat I. döneminde gazel, kaside, murabba, terkib-i bend gibi divan nazım şekilleri kullanılmıştır. Buna karşın şiirde ne değişmiştir?",
      secenekler: ["İçerik (öz)", "Ölçü", "Nazım birimi", "Kafiye düzeni"],
      cozum:
        "Biçim korunmuş, gazel ve kaside gibi şekiller kullanılmış; ancak şiirin içeriği (özü) değişmiştir.",
      fc: [
        "Tanzimat I. dönemde biçim ve içerik ilişkisi nedir?",
        "Divan nazım şekilleri korunmuş, içerik değişmiştir."
      ]
    },
    {
      bi: 1,
      metin:
        "Tanzimat I. döneminde Fransız edebiyatı örnek alınmış; Şinasi klasisizmden, Namık Kemal romantizmden etkilenmiştir. Dönemin önemli şairleri hangisinde birlikte verilmiştir?",
      secenekler: [
        "Şinasi, Namık Kemal, Ziya Paşa",
        "Tevfik Fikret, Cenap Şahabettin, Halit Ziya",
        "Yahya Kemal, Ahmet Haşim, Necip Fazıl",
        "Şeyhi, Nergisi, Nef'i"
      ],
      cozum:
        "Tanzimat I. dönemin önemli şairleri İbrahim Şinasi, Namık Kemal ve Ziya Paşa'dır.",
      fc: [
        "Tanzimat I. dönemin şair kadrosu nedir?",
        "İbrahim Şinasi, Namık Kemal ve Ziya Paşa'dır."
      ]
    },
    {
      bi: 0,
      metin:
        "1876-1896 yılları arasındaki dönemde \"toplum için sanat\" anlayışı terk edilmiştir. Bu dönemde hangi anlayış benimsenmiştir?",
      secenekler: [
        "Sanat için sanat",
        "Sanat toplum içindir",
        "Sanat eğitim içindir",
        "Sanat din içindir"
      ],
      cozum:
        "Tanzimat II. dönemde \"toplum için sanat\" terk edilmiş, \"sanat için sanat\" anlayışı benimsenmiştir.",
      fc: [
        "Tanzimat II. dönemin sanat anlayışı nedir?",
        "\"Sanat için sanat\" anlayışıdır."
      ]
    },
    {
      bi: 1,
      metin:
        "Tanzimat II. döneminde eserlerde dil ağırlaşmış, sanatlı söyleyişe önem verilmiştir. Bu dönemde şiirin konusu da genişletilmiştir. Buna göre hangi ilke benimsenmiştir?",
      secenekler: [
        "Güzel olan her şey şiire konu olabilir",
        "Yalnızca vatan konuları işlenir",
        "Yalnızca dinî konular işlenir",
        "Şiir yalnızca eğitim için yazılır"
      ],
      cozum:
        "Tanzimat II. dönemde \"güzel olan her şey\"in şiire konu olabileceği kabul edilmiş, şiirin konusu genişletilmiştir.",
      fc: [
        "Tanzimat II. dönemde şiirin konusu nedir?",
        "\"Güzel olan her şey\" şiire konu olabilir; konu genişlemiştir."
      ]
    },
    {
      bi: 2,
      metin:
        "Tanzimat II. döneminde ölüm, tabiat, karamsarlık, aşk ve özlem gibi konular işlenmiş; bireysel duygulanmalar ağırlık kazanmıştır. Bu dönemin başlangıç ve bitiş yılları hangisidir?",
      secenekler: ["1876-1896", "1860-1876", "1896-1908", "1908-1923"],
      cozum:
        "Tanzimat II. dönemi 1876'da II. Abdülhamit'in tahta çıkışıyla başlar ve 1896'ya kadar sürer; 1860-1876 I. dönemdir.",
      fc: [
        "Tanzimat II. döneminin yılları nedir?",
        "1876-1896 yıllarıdır."
      ]
    },
    {
      bi: 2,
      metin:
        "Tanzimat I. döneminde dilde sadeleşme fikri savunulmuş, ancak tam başarı sağlanamamıştır. Buna göre I. dönemde hangi iki anlayış birlikte görülür?",
      secenekler: [
        "Sadeleşme isteği ile eski dili sürdürme",
        "Sanat için sanat ile bireysellik",
        "Hece ölçüsü ile serbest ölçü",
        "Halk hikâyesi ile roman"
      ],
      cozum:
        "I. dönemde dilde sadeleşme savunulmuş; ancak bu tam olarak başarılamamış, eski dil etkisini sürdürmüştür.",
      fc: [
        "Tanzimat I. dönemde dil konusu nedir?",
        "Dilde sadeleşme savunulmuş, ancak tam başarı sağlanamamıştır."
      ]
    },
    {
      bi: 1,
      metin:
        "Tanzimat I. döneminde genellikle aruz ölçüsü kullanılmış, ancak başka bir ölçü de denenmiştir. Denenen bu ölçü hangisidir?",
      secenekler: ["Hece ölçüsü", "Serbest ölçü", "Mani tipi ölçü", "Durak ölçüsü"],
      cozum:
        "I. dönemde genelde aruz ölçüsü kullanılmış, hece ölçüsü de denenmiştir.",
      fc: [
        "Tanzimat I. dönemde kullanılan ölçüler nedir?",
        "Genellikle aruz, deneme olarak hece ölçüsü kullanılmıştır."
      ]
    },
    {
      bi: 0,
      metin:
        "Tanzimat sanatçıları edebiyatın yanında başka bir alanla da ilgilenmiştir. Bu dönem sanatçılarının edebiyat dışındaki ilgi alanı hangisidir?",
      secenekler: ["Siyaset", "Tıp", "Mimarlık", "Tarım"],
      cozum:
        "Tanzimat sanatçıları edebiyatın yanında siyasetle de ilgilenmiş; dönem, edebiyat ve siyasetin iç içe geçtiği bir dönem olmuştur.",
      fc: [
        "Tanzimat döneminde edebiyat dışında öne çıkan alan nedir?",
        "Siyasettir; sanatçılar edebiyatın yanında siyasetle de ilgilenmiştir."
      ]
    }
  ]
});

/* ---------------- 3) FİİLLER (EYLEMLER) ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u04_k03",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Fiiller (Eylemler)",
  kazanim:
    "Fiilleri anlam, kip, kişi ve yapı bakımından çözümleyebilme.",
  kaynak: kaynak("134-147"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Fiilleri anlam özelliklerine göre sınıflandırır.",
    "Haber ve dilek kiplerini, kişi eklerini çözümler.",
    "Basit, türemiş ve birleşik fiilleri ayırt eder."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Bir sözcüğün fiil olup olmadığını anlamak için yalın hâline \"-mek, -mak\" ekleri getirilir. Buna göre hangi sözcük fiildir?",
      secenekler: ["koş-", "koşu", "koşucu", "koşturma"],
      cozum:
        "Yalın hâline \"-mek, -mak\" getirilebilen sözcük fiildir: koş-mak. Koşu, koşucu ve koşturma ad soylu sözcüklerdir.",
      fc: [
        "Fiil nedir?",
        "İş, oluş, kılış, durum ve hareket bildiren sözcüktür; \"-mek/-mak\" alabilir."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Yaz-, oku-, kes-, sil-\" fiilleri öznenin iradesiyle yapılan ve bir nesneyi etkileyen eylemlerdir. Bu fiiller hangi anlam özelliğindedir?",
      secenekler: ["Kılış fiili", "Durum fiili", "Oluş fiili", "Birleşik fiil"],
      cozum:
        "Nesne alan, yani geçişli olan ve öznenin iradesiyle bir nesneyi etkileyen fiiller kılış fiilidir.",
      fc: [
        "Kılış fiili nedir?",
        "Öznenin iradesiyle yapılan, nesne alan (geçişli) fiildir: yaz-, kes-, sil-."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Uyu-, ağla-, gül-, otur-\" fiilleri bir nesne almadan bir durumun sürekliliğini ya da durağanlığını anlatır. Bu fiiller hangi gruptadır?",
      secenekler: ["Durum fiili", "Kılış fiili", "Oluş fiili", "Tezlik fiili"],
      cozum:
        "Nesne almayan, içinde bulunulan durumu açıklayan ve süreklilik bildiren fiiller durum fiilidir.",
      fc: [
        "Durum fiili nedir?",
        "Nesne almayan, bir durumun sürekliliğini ya da durağanlığını anlatan fiildir: uyu-, gül-."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Yaprak sarardı, hava ısındı, çiçek büyüdü.\" cümlelerinde eylemler öznenin iradesi dışında, kendiliğinden gerçekleşmiştir. Bu fiiller hangi anlam özelliğindedir?",
      secenekler: ["Oluş fiili", "Kılış fiili", "Durum fiili", "Sürerlik fiili"],
      cozum:
        "Kendiliğinden, öznenin iradesi dışında gerçekleşen ve bir değişimi anlatan fiiller oluş fiilidir.",
      fc: [
        "Oluş fiili nedir?",
        "Öznenin iradesi dışında, kendiliğinden gerçekleşen değişimi anlatan fiildir: sarar-, büyü-."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Kaç-tı-m\" çekiminde görülen \"-tı\" eki, geçmişte yapılan işin kişi tarafından görüldüğünü bildirir. Bu kip hangisidir?",
      secenekler: [
        "Görülen geçmiş zaman",
        "Öğrenilen geçmiş zaman",
        "Şimdiki zaman",
        "Geniş zaman"
      ],
      cozum:
        "Görülen geçmiş zaman \"-di, -dı, -du, -dü, -tı, -ti\" ekleriyle yapılır ve işin kişi tarafından görüldüğünü bildirir; \"-mış\" öğrenilen geçmiş zamandır.",
      fc: [
        "Görülen geçmiş zaman nedir?",
        "\"-di\" ekiyle yapılan, işin kişi tarafından görüldüğünü bildiren kiptir."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Geziyorum, gelmekteyim, yağmakta\" çekimlerinde işin söyleniş anıyla aynı zamanda gerçekleştiği görülür. Bu kip hangisidir?",
      secenekler: ["Şimdiki zaman", "Gelecek zaman", "Geniş zaman", "İstek kipi"],
      cozum:
        "\"-yor, -mekte, -makta\" ekleriyle yapılan şimdiki zaman, iş ile anlatışın aynı zamanda olduğunu bildirir.",
      fc: [
        "Şimdiki zaman nedir?",
        "\"-yor, -mekte, -makta\" ekleriyle yapılan, işin şu anda gerçekleştiğini bildiren kiptir."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Görür\" çekiminin olumsuzu \"görmez\"dir; burada zaman eki ortadan kalkmıştır. Bu durum hangi kiple ilgilidir?",
      secenekler: ["Geniş zaman", "Şimdiki zaman", "Görülen geçmiş zaman", "Gereklilik kipi"],
      cozum:
        "Geniş zaman \"-r, -er, -ır\" ekiyle yapılır; olumsuzu \"-mez, -maz\" ile kurulur ve zaman eki ortadan kalkar.",
      fc: [
        "Geniş zamanın olumsuzu nedir?",
        "\"-mez, -maz\" ekleriyle kurulur: görür – görmez."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Düşünmeliyiz, yürümelisiniz, olmalı\" çekimleri gerekme ve ihtimal anlamı taşır. Bu çekimler hangi kipte yapılmıştır?",
      secenekler: ["Gereklilik kipi", "İstek kipi", "Şart kipi", "Emir kipi"],
      cozum:
        "\"-meli, -malı\" ekiyle kurulan gereklilik kipi gerekme ve ihtimal anlamı katar; \"-se, -sa\" şart, \"-e, -a\" istek kipidir.",
      fc: [
        "Gereklilik kipi nedir?",
        "\"-meli, -malı\" ekiyle kurulan, gerekme ve ihtimal anlamı katan kiptir."
      ]
    },
    {
      bi: 0,
      metin:
        "Emir kipinin sabit bir eki yoktur ve her şahısta çekimi bulunmaz. Emir kipinde hangi kişilerin çekimi yoktur?",
      secenekler: [
        "1. tekil ve 1. çoğul kişilerin",
        "2. tekil ve 2. çoğul kişilerin",
        "3. tekil ve 3. çoğul kişilerin",
        "Yalnızca 3. tekil kişinin"
      ],
      cozum:
        "Emir kipinde 1. tekil ve 1. çoğul kişilerin çekimi yoktur: gel, gel-in(iz), gel-sin, gel-sinler.",
      fc: [
        "Emir kipinin kişi çekimi nedir?",
        "Birinci tekil ve birinci çoğul kişilerin çekimi yoktur."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Git-miş-ti-n\" ve \"Gid-ecek-miş-iz\" çekimlerinde iki kip eki bulunur; ikinci kip eki aslında ek-fiildir. Bu fiiller hangi gruptadır?",
      secenekler: [
        "Birleşik zamanlı fiiller",
        "Basit zamanlı fiiller",
        "Türemiş fiiller",
        "Anlamca kaynaşmış fiiller"
      ],
      cozum:
        "İki kip eki alan fiiller birleşik zamanlıdır: hikâye (-di), rivayet (-miş), şart (-se). Emir kipinin birleşik zamanı yoktur.",
      fc: [
        "Birleşik zamanlı fiil nedir?",
        "İki kip eki alan fiildir: hikâye, rivayet ve şart birleşik zamanları vardır."
      ]
    }
  ]
});
