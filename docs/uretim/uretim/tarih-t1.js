#!/usr/bin/env node
/* ============================================================
   TARİH 10 · 1. ÜNİTE — TÜRKİSTAN'DAN TÜRKİYE'YE (1040-1299)
   ------------------------------------------------------------
   Kaynak: MEB Tarih 10 (2025) — .kitap-metin/tarih.json
   (319 PDF sayfası). Basılı sayfa = PDF sayfası − 1.

     1.1 Önemli Askerî Mücadelelerin Türk Tarihinin
         Seyrine Etkileri                          s.12-33

   Kullanım: node docs/uretim/uretim/tarih-t1.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Tarih";
const DOSYA = "tarih-10.pdf (MEB, 2025)";
const kaynak = s => "Tarih 10 ders kitabı, s." + s;

yazKonu({
  konu_id: "tar_10_u01_k01",
  ders: DERS, tema: 1, tema_adi: "Türkistan'dan Türkiye'ye (1040-1299)",
  baslik: "1.1 Önemli Askerî Mücadelelerin Türk Tarihinin Seyrine Etkileri",
  kazanim: "1040-1299 yılları arasında meydana gelen önemli askerî mücadelelerin Türk tarihinin seyrine etkilerini karşılaştırır.",
  kaynak: kaynak("12-33"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "1040-1299 arasındaki askerî mücadelelerin neden ve sonuçlarını açıklar.",
    "Mücadelelerin Türk tarihinin seyrine etkisini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "1040 yılında Gaznelilere karşı kazanılan ve Büyük Selçuklu Devleti'nin kurulmasıyla sonuçlanan savaş hangisidir?",
      secenekler: [
        "Dandanakan Savaşı",
        "Pasinler Savaşı",
        "Miryokefalon Savaşı",
        "Kösedağ Savaşı"
      ],
      cozum: "Tuğrul ve Çağrı Beylerin liderliğindeki Oğuzlar, 1040'ta Gaznelilere karşı Dandanakan Savaşı'nı kazanarak Büyük Selçuklu Devleti'ni kurdu; Cend şehri başkent yapıldı (s.13-14).",
      fc: ["Dandanakan Savaşı nedir?", "1040'ta Selçukluların Gaznelileri yenip devlet kurduğu meydan savaşı."]
    },
    {
      bi: 0,
      metin: "Dandanakan Savaşı'nın ardından toplanan Selçuklu beyleri yeni devletin ilk sultanı olarak kimi ilan etmiştir?",
      secenekler: [
        "Tuğrul Bey'i",
        "Alp Arslan'ı",
        "Selçuk Bey'i",
        "İbrahim Yınal'ı"
      ],
      cozum: "Savaşın son günü yapılan toplantıda Tuğrul Bey yeni devletin ilk sultanı ilan edildi ve civardaki hükümdarlara fetihnâmeler gönderildi (s.14).",
      fc: ["Fetihnâme nedir?", "Kazanılan zaferin hükümdarlara yazılı olarak bildirildiği mektup."]
    },
    {
      bi: 0,
      metin: "18 Eylül 1048'de Erzurum yakınlarında yapılan Pasinler Savaşı'nın Türk tarihi açısından önemi nedir?",
      secenekler: [
        "Selçukluların Doğu Roma ile yaptığı bilinen ilk savaş olması",
        "Anadolu'nun kapılarının Türklere açılması",
        "İstanbul'un ilk kez Türkler tarafından kuşatılması",
        "Türkiye Selçuklu Devleti'nin kurulması"
      ],
      cozum: "Pasinler Savaşı, Selçukluların Doğu Roma İmparatorluğu ile yaptığı bilinen ilk savaş olarak tarihe geçmiştir; savaş sonrası Bizans ile diplomatik ilişkiler kurulmuştur (s.14-15).",
      fc: ["Pasinler Savaşı nedir?", "1048'de Selçuklular ile Doğu Roma arasındaki ilk savaş."]
    },
    {
      bi: 0,
      metin: "Malazgirt Savaşı'nda Alp Arslan'ın bizzat uyguladığı, sahte geri çekilme üzerine kurulu Türk savaş yöntemine ne ad verilir?",
      secenekler: [
        "Turan taktiği",
        "Kılıç hakkı",
        "İstimalet",
        "Fetihnâme"
      ],
      cozum: "Turan taktiği (bozkır kapanı), sahte geri çekilme ile düşmanı çembere alma yöntemidir; Malazgirt'te başarıyla uygulanmıştır (s.16).",
      fc: ["Turan taktiği nedir?", "Sahte geri çekilmeyle düşmanı çevreleyip yok etmeye dayanan Türk savaş yöntemi."]
    },
    {
      bi: 0,
      metin: "Miryokefalon Zaferi kaynaklarda hangi adla anılmıştır?",
      secenekler: [
        "Devlet ve vatan koruyan zafer",
        "Anadolu'nun kapısını açan zafer",
        "İlk deniz zaferi",
        "Bozkır kapanı"
      ],
      cozum: "Miryokefalon Zaferi (1176), Malazgirt'le kurulan devletin ve vatanın korunmasını sağladığı için 'devlet ve vatan koruyan zafer' olarak anılmıştır (s.18).",
      fc: ["Miryokefalon Zaferi nedir?", "1176'da II. Kılıçarslan'ın Bizans'ı yenerek Anadolu'yu Türk yurdu olarak koruduğu zafer."]
    },
    {
      bi: 1,
      metin: "I. Haçlı Seferi'nin ardından Türkiye Selçuklu Devleti başkentini nereye taşımak zorunda kalmıştır?",
      secenekler: [
        "İznik'ten Konya'ya",
        "Konya'dan İznik'e",
        "Sivas'tan Kayseri'ye",
        "Ankara'dan Kütahya'ya"
      ],
      cozum: "Haçlıların ilk hedefi olan İznik'i kurtaramayan I. Kılıçarslan, başkenti Konya'ya taşımıştır (s.23).",
      fc: ["I. Haçlı Seferi nedir?", "1095-1099'da Anadolu üzerinden Kudüs'e yürüyen Batılı orduların seferi."]
    },
    {
      bi: 1,
      metin: "II. Haçlı Seferi'nin düzenlenmesine yol açan gelişme hangisidir?",
      secenekler: [
        "Urfa Kontluğu'na 1144'te İmadeddin Zengi'nin son vermesi",
        "Kudüs'ün 1099'da Haçlıların eline geçmesi",
        "İstanbul'un 1204'te yağmalanması",
        "Malazgirt'te Bizans ordusunun yenilmesi"
      ],
      cozum: "I. Haçlı Seferi sırasında kurulan Urfa Kontluğu'na 1144'te Musul Atabeyi İmadeddin Zengi son verince Avrupalılar II. Haçlı Seferi (1147-1148) hazırlığına başladı (s.23).",
      fc: ["II. Haçlı Seferi nedir?", "1147-1148'de Urfa'nın kaybı üzerine düzenlenen ve Anadolu'da yenilgiyle biten sefer."]
    },
    {
      bi: 1,
      metin: "III. Haçlı Seferi'ni sonuçları bakımından diğerlerinden ayıran özellik hangisidir?",
      secenekler: [
        "Kudüs'ün geri alınamaması",
        "Anadolu'nun tümüyle Haçlı egemenliğine girmesi",
        "Türkiye Selçuklu Devleti'nin yıkılması",
        "İstanbul'da Latin İmparatorluğu'nun kurulması"
      ],
      cozum: "III. Haçlı Seferi'nde Akka ele geçirilip kıyı hâkimiyeti güçlendiyse de Kudüs geri alınamamıştır (s.26).",
      fc: ["III. Haçlı Seferi nedir?", "1189-1192'de Kudüs'ü geri almak için düzenlenen, ancak hedefine ulaşamayan sefer."]
    },
    {
      bi: 1,
      metin: "Hıttin Muharebesi'ni kazanarak Kudüs'ü 1187'de Müslümanların eline geçiren hükümdar kimdir?",
      secenekler: [
        "Selahaddin Eyyubi",
        "Nureddin Zengi",
        "II. Kılıçarslan",
        "Baycu Noyan"
      ],
      cozum: "Eyyubi Devleti'nin kurucusu Selahaddin Eyyubi, Hıttin Muharebesi'ni kazandı; üç ay sonra Kudüs Haçlılardan geri alındı (1187) (s.25).",
      fc: ["Hıttin Muharebesi nedir?", "1187'de Selahaddin Eyyubi'nin Haçlıları yenip Kudüs'ü geri aldığı savaş."]
    },
    {
      bi: 1,
      metin: "1243'te Baycu Noyan komutasındaki Moğolların sahte ricat yöntemiyle kazandığı, Anadolu'yu Moğol tahakkümüne sokan savaş hangisidir?",
      secenekler: [
        "Kösedağ Savaşı",
        "Yassıçimen Savaşı",
        "Miryokefalon Savaşı",
        "Dandanakan Savaşı"
      ],
      cozum: "Kösedağ Savaşı'nda (1243) Moğollar sahte ricat uyguladı; bozgun sonrası Türkiye Selçuklu Devleti Moğol tahakkümüne girdi ve 1243-1308 arası bu baskıdan kurtulamadı (s.29).",
      fc: ["Kösedağ Savaşı nedir?", "1243'te Moğolların Selçuklu ordusunu bozguna uğrattığı savaş."]
    }
  ]
});

yazKonu({
  konu_id: "tar_10_u01_k02",
  ders: DERS, tema: 1, tema_adi: "Türkistan'dan Türkiye'ye (1040-1299)",
  baslik: "1.2 Türkistan'dan Türkiye'ye Türklerde Devlet ve Ordu Teşkilatları",
  kazanim: "Türkistan'dan Türkiye'ye uzanan süreçte Türklerde devlet ve ordu teşkilatında meydana gelen değişim ve sürekliliği yorumlar.",
  kaynak: kaynak("34-49"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Devlet teşkilatının İslam öncesi ve sonrası süreklilik ile değişimini açıklar.",
    "Devlet ve ordu kurumlarının işlevini kaynaklar üzerinden çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "İslamiyet öncesi Türk devletlerinde hükümdarlık yetkisinin Gök Tanrı tarafından verildiğine inanılan ilahi güce ne ad verilir?",
      secenekler: ["Kut", "Töre", "İl", "Berid"],
      cozum: "Kut anlayışına göre kağanlar devleti yönetme gücünü Gök Tanrı'dan alırdı; İslamiyet sonrası bu anlayış 'zillullah fi'l-arz' lakabına dönüştü (s.36).",
      fc: ["Kut nedir?", "Hükümdarlık yetkisinin Tanrı'dan geldiğine inanılan ilahi güç."]
    },
    {
      bi: 0,
      metin: "İslamiyet'in kabulünden sonra devlet anlamına gelen 'il' kelimesinin yerini hangi kavram almıştır?",
      secenekler: ["Mülk", "Töre", "Ülüş", "Yarlık"],
      cozum: "İslamiyet sonrası devlet yönetiminde töreyle birlikte şeri kurallar uygulanmaya başladı ve 'il' kelimesinin yerini 'mülk' kavramı aldı (s.36).",
      fc: ["Mülk nedir?", "İslamiyet sonrası Türk devletlerinde devlet yerine kullanılan kavram."]
    },
    {
      bi: 0,
      metin: "İslamiyet öncesinde devlet işlerinin görüşüldüğü kurultay, İslamiyet'in kabulünden sonra hangi adı almıştır?",
      secenekler: ["Divan", "Şura", "Meclis-i Mebusan", "Toy"],
      cozum: "Siyasi, askerî, hukuki ve mali işlerin karara bağlandığı kurultaylar İslamiyet sonrası divan adını aldı; en önemli karar organı Divan-ı A'lâ oldu (s.38).",
      fc: ["Divan-ı A'lâ nedir?", "Büyük Selçuklu ve Türkiye Selçuklu devletlerinde en yüksek karar organı."]
    },
    {
      bi: 0,
      metin: "Karahanlılar Dönemi'nde Meclis-i Âlî'nin başında bulunan ve Türkçe unvanı 'yuğruş' olan görevli kimdir?",
      secenekler: ["Vezir", "Hâce-i buzurg", "Kâdılkudât", "Hâcibü'l-hüccâb"],
      cozum: "Karahanlılarda Meclis-i Âlî, Türkçe unvanı yuğruş olan bir vezir tarafından yönetilirdi (s.38).",
      fc: ["Yuğruş nedir?", "Karahanlılarda Meclis-i Âlî'yi yöneten vezirin Türkçe unvanı."]
    },
    {
      bi: 0,
      metin: "Gazneliler Dönemi'nde kurulan Divan-ı Vezaretin başındaki görevlinin unvanı hangisidir?",
      secenekler: ["Hâce-i buzurg", "Subaşı", "Pervane", "Atabey"],
      cozum: "Gaznelilerde Divan-ı Vezaretin başında hâce-i buzurg (başvezir) adı verilen görevli bulunuyordu (s.38).",
      fc: ["Hâce-i buzurg nedir?", "Gazneli Devleti'nde divanın başındaki başvezir."]
    },
    {
      bi: 1,
      metin: "Onlu askerî sistemi ilk kez uygulayan ve orduyu bölüklere ayıran hükümdar hangi devlette hüküm sürmüştür?",
      secenekler: [
        "Asya Hun Devleti",
        "Göktürk Devleti",
        "Karahanlı Devleti",
        "Türkiye Selçuklu Devleti"
      ],
      cozum: "Onlu sistemi Asya Hun hükümdarı Mete Han (MÖ 209-174) oluşturmuştur; bu düzen sonraki Türk devletlerinde de sürdürülmüştür (s.44-45).",
      fc: ["Onlu sistem nedir?", "Ordunun on, yüz, bin kişilik birliklere ayrıldığı Türk askerî düzeni."]
    },
    {
      bi: 1,
      metin: "Savaş esirleri ve satın alınan kişilerden oluşturulan, maaşlı ve daimî olarak sarayda ve orduda görev yapan askerî sınıfa ne ad verilir?",
      secenekler: ["Gulam", "İkta", "Türkmen", "Hassa"],
      cozum: "Gulamlar; savaş esirleri arasından seçilen, parayla satın alınan (memlûk) veya hediye edilen kişilerden oluşan maaşlı askerî sınıftır; Karahanlılarda turgak ve yatgak adını almıştır (s.45).",
      fc: ["Gulam nedir?", "Esir veya satın alma yoluyla orduya katılan maaşlı daimî asker."]
    },
    {
      bi: 1,
      metin: "Büyük Selçuklu Devleti'nde ülke topraklarının vergi gelirinin, savaşa hazır asker yetiştirme koşuluyla görevlilere devredilmesine dayanan sistem hangisidir?",
      secenekler: ["İkta sistemi", "Gulam sistemi", "Atabeylik sistemi", "Berid teşkilatı"],
      cozum: "İkta sisteminde topraklar devlete aitti; ikta sahipleri savaşa hazır asker bulundurma ve bölge güvenliğini sağlama karşılığında bu toprakları işletebiliyordu (s.45).",
      fc: ["İkta sistemi nedir?", "Toprak gelirinin asker besleme karşılığı görevlilere bırakıldığı düzen."]
    },
    {
      bi: 1,
      metin: "Türk-İslam devletlerinde veraset sisteminin kesin kurallara bağlanmamış olmasının ortaya çıkardığı temel sorun hangisidir?",
      secenekler: [
        "Hanedan içi taht kavgaları ve merkezî otoritenin zayıflaması",
        "Ordunun onlu sisteme geçememesi",
        "Divan teşkilatının kaldırılması",
        "Ticaret yollarının denetiminin kaybedilmesi"
      ],
      cozum: "Devletin hanedanın ortak malı sayılması ve kut inancı nedeniyle bütün erkek üyelerin tahta eşit hak iddia etmesi, taht kavgalarına; bu da devletin zayıflamasına yol açabiliyordu (s.42).",
      fc: ["Veraset sistemi nedir?", "Tahta geçme düzeni; Türk-İslam devletlerinde hanedanın ortak hakkına dayanırdı."]
    },
    {
      bi: 1,
      metin: "Büyük Selçuklu Devleti'nde zulme uğrayanların ve memurlardan şikâyetçi olanların davalarına sultanın başkanlığında bakan yüksek mahkemeye ne ad verilir?",
      secenekler: ["Divan-ı Mezâlim", "Divan-ı İstîfâ", "Divan-ı Vezaret", "Meclis-i Âlî"],
      cozum: "Sultan, en büyük yargıç sıfatıyla adalet teşkilatının başındaydı; bu tür davalar Divan-ı Mezâlim adlı yüksek mahkemede görüşülürdü (s.42).",
      fc: ["Divan-ı Mezâlim nedir?", "Zulüm ve şikâyet davalarına bakan, sultanın başkanlık ettiği yüksek mahkeme."]
    }
  ]
});

yazKonu({
  konu_id: "tar_10_u01_k03",
  ders: DERS, tema: 1, tema_adi: "Türkistan'dan Türkiye'ye (1040-1299)",
  baslik: "1.3 Türklerde Sosyoekonomik Hayat ve Şehirleşme",
  kazanim: "Türkistan'dan Türkiye'ye uzanan süreçte Türklerin sosyoekonomik faaliyetleri ile yerleşme ve şehirleşme anlayışları arasındaki ilişkiyi sorgular.",
  kaynak: kaynak("50-65"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Tarım, ticaret ve zanaat gibi sosyoekonomik faaliyetleri açıklar.",
    "Ekonomik faaliyetlerin yerleşme ve şehirleşme anlayışına etkisini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "Selçuklu toplumunun temelini oluşturan kurum hangisidir?",
      secenekler: ["Aile", "Lonca", "Divan", "Vakıf"],
      cozum: "Selçuklu toplumu yönetenler ve yönetilenler olarak ikiye ayrılırdı; toplumun temelini aile kurumu oluştururdu (s.53).",
      fc: ["Selçuklu ailesi nedir?", "Toplumun temelini oluşturan, sevgi ve saygıya dayanan en küçük birim."]
    },
    {
      bi: 0,
      metin: "Selçuklu toplumu yerleşme durumuna göre hangi üç gruba ayrılırdı?",
      secenekler: [
        "Şehirliler, köylüler ve konargöçerler",
        "Beyler, tüccarlar ve zanaatkârlar",
        "Askerler, din adamları ve köylüler",
        "Tüccarlar, dihkanlar ve göçebeler"
      ],
      cozum: "Selçuklu toplumu yerleşme durumlarına göre şehirliler, köylüler ve konargöçerler şeklinde üçe ayrılırdı (s.54).",
      fc: ["Konargöçer nedir?", "Yılın bölümünde hayvancılık için yer değiştiren, yerleşik olmayan topluluk."]
    },
    {
      bi: 0,
      metin: "Selçuklularda tüccarlara tanınan ayrıcalık hangisidir?",
      secenekler: [
        "Dokunulmazlık ve mallarının tazmin edilmesi",
        "Vergiden tamamen muaf olmaları",
        "Orduda görev yapmamaları",
        "Şehir yönetiminde söz sahibi olmaları"
      ],
      cozum: "Tüccarlar toplumda büyük itibara sahipti ve dokunulmazlıkları vardı; mallar günümüzdeki sigortaya benzer biçimde korunur, zarar tazmin edilirdi (s.54).",
      fc: ["Tüccar güvencesi nedir?", "Ticari malın zarar görmesi hâlinde kaybın devletçe tazmin edilmesi."]
    },
    {
      bi: 0,
      metin: "Hükümdarın şahsına ait tarla, bağ, bahçe ve otlaklardan oluşan; geliri ihtiyat hazinesine aktarılan arazi türü hangisidir?",
      secenekler: ["Has arazi", "Öşrî arazi", "Haraci arazi", "Vakıf arazi"],
      cozum: "Has arazi hükümdarın şahsına ait topraklardır; aşar ve diğer vergileri savaş gibi olağanüstü durumlar için ihtiyat hazinesine aktarılırdı (s.55).",
      fc: ["Has arazi nedir?", "Hükümdarın şahsına ait toprak; geliri ihtiyat hazinesine gider."]
    },
    {
      bi: 0,
      metin: "Geliriyle cami, medrese, hastane ve kervansaray gibi yapıların inşa edildiği arazi türü hangisidir?",
      secenekler: ["Vakıf arazi", "İkta arazi", "Mülk arazi", "Haraci arazi"],
      cozum: "Miri arazilerin bir bölümü hayır işleri için ayrılırdı; bu topraklara vakıf arazi denir ve geliriyle cami, medrese, hastane, kervansaray yaptırılırdı (s.55).",
      fc: ["Vakıf arazi nedir?", "Geliri hayır kurumlarına ayrılan toprak."]
    },
    {
      bi: 0,
      metin: "Selçuklu sınırları içinde yaşayan gayrimüslimlerin topraklarına ve bu topraklardan alınan vergiye ne ad verilir?",
      secenekler: ["Haraci arazi ve haraç", "Öşrî arazi ve aşar", "Has arazi ve aşar", "İkta ve tımar"],
      cozum: "Gayrimüslimlerin elindeki topraklara haraci arazi, yaşama ve himaye karşılığı alınan vergiye haraç denirdi (s.55).",
      fc: ["Haraç nedir?", "Gayrimüslim topraklarından himaye karşılığı alınan vergi."]
    },
    {
      bi: 1,
      metin: "Orta Asya şehirlerinde surlarla çevrili asıl şehir çekirdeğine ne ad verilir?",
      secenekler: ["Şehristan", "Rabad", "Ribat", "Kurgan"],
      cozum: "Surlar ve tahkimatla korunan şehir çekirdeği şehristan; ticaret ve sanat faaliyetleriyle büyüyen kesim ise rabad (ribat) adını alırdı (s.57).",
      fc: ["Şehristan nedir?", "Orta Asya şehirlerinde surlarla çevrili iç kale ve asıl yerleşim çekirdeği."]
    },
    {
      bi: 1,
      metin: "Selçuklular Dönemi'nde Anadolu'da Ahi Evran öncülüğünde kurulan esnaf teşkilatı hangi yapı örnek alınarak oluşturulmuştur?",
      secenekler: [
        "Fütüvvet teşkilatı",
        "İkta sistemi",
        "Gulam sistemi",
        "Berid teşkilatı"
      ],
      cozum: "Ahilik, Abbasi Halifesi Nasır Lidinillah öncülüğünde ortaya çıkan fütüvvet teşkilatı örnek alınarak kurulmuştur (s.59).",
      fc: ["Fütüvvet teşkilatı nedir?", "Abbasi dünyasında esnaf ve gençleri bir araya getiren ahlak temelli yapı."]
    },
    {
      bi: 1,
      metin: "Kayseri yakınlarında kurulan, uluslararası fuar niteliği taşıyan ve ticaretin canlanmasında etkili olan merkez hangisidir?",
      secenekler: [
        "Yabanlu Panayırı",
        "Yassıçimen Ovası",
        "Aksaray Panayırı",
        "Sultanhanı"
      ],
      cozum: "Kayseri yakınlarındaki Yabanlu Panayırı uluslararası fuar niteliğindeydi; tüccarların faaliyetini kolaylaştıracak yaşam alanları oluşturulmuştu (s.59).",
      fc: ["Yabanlu Panayırı nedir?", "Kayseri yakınında kurulan uluslararası nitelikli ticaret fuarı."]
    },
    {
      bi: 1,
      metin: "Ticareti canlandırmak için alınan tedbirler arasında hangisi yer alır?",
      secenekler: [
        "Kervan yollarındaki konaklama yerlerinin onarılması ve tüccara vergi muafiyeti",
        "Yalnız kara ticaretinin yasaklanması ve panayırların kaldırılması",
        "Şehirlerin surlarla kapatılıp pazarların dışarı taşınması",
        "Ticaretin yalnız gayrimüslim tüccarlara bırakılması ve gümrüğün artırılması"
      ],
      cozum: "Selçuklular ticaret yolları üzerindeki konaklama mekânlarını tamir ettirdi, yeni köprüler yaptırdı ve tüccarlara vergi muafiyetleri getirdi; ayrıca köylülere araç gereç yardımı yapıldı (s.59).",
      fc: ["Kervansaray nedir?", "Ticaret yollarında tüccarların konakladığı, güvenliği sağlanan yapı."]
    }
  ]
});

yazKonu({
  konu_id: "tar_10_u01_k04",
  ders: DERS, tema: 1, tema_adi: "Türkistan'dan Türkiye'ye (1040-1299)",
  baslik: "1.4 Türk-İslam Medeniyetinde Bilim, Kültür, Eğitim ve Sanat",
  kazanim: "Türk-İslam medeniyetinde bilim, kültür, eğitim ve sanat alanlarında meydana gelen gelişmeleri Anadolu'nun Türkleşme ve İslamlaşma sürecine etkisi açısından değerlendirir.",
  kaynak: kaynak("66-107"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "XI-XIII. yüzyıllarda Türk-İslam medeniyetindeki bilim, eğitim ve sanat kurumlarını açıklar.",
    "Bu gelişmelerin Anadolu'nun Türkleşme ve İslamlaşma sürecine etkisini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "Abbasiler Dönemi'nde Bağdat'ta kurulan, saray kütüphanesini ve çeviri faaliyetlerini barındıran eğitim kurumuna ne ad verilir?",
      secenekler: ["Beytü'l Hikme", "Nizamiye", "Darüşşifa", "Kütta"],
      cozum: "Bağdat'taki Beytü'l Hikme, kütüphanesi ve çeviri faaliyetleriyle İslam dünyasının entelektüel birikimini zenginleştirdi (s.75).",
      fc: ["Beytü'l Hikme nedir?", "Bağdat'ta kütüphane ve çeviri merkezi olarak çalışan Abbası eğitim kurumu."]
    },
    {
      bi: 0,
      metin: "1066'da Bağdat'ta kurulan ve Anadolu'daki medreselere örnek olan eğitim kurumu hangisidir?",
      secenekler: ["Nizamiye Medresesi", "Sâhibiye Medresesi", "Mustansıriyye Medresesi", "İnce Minareli Medrese"],
      cozum: "1066'da Bağdat'ta kurulan Nizamiye Medresesi'nin müfredatı ve idari yapısı örnek alınarak Anadolu'da yeni medreseler açılmıştır (s.69, 72).",
      fc: ["Nizamiye Medresesi nedir?", "Bağdat'ta kurulan ve Anadolu medreselerine örnek olan medrese."]
    },
    {
      bi: 0,
      metin: "Medreselerde sabah dersleri ile öğleden sonraki dersler arasındaki temel fark hangisidir?",
      secenekler: [
        "Sabah dinî ilimler, öğleden sonra aklî bilimler okutulması",
        "Sabah kız öğrencilerin, öğleden sonra erkeklerin ders alması",
        "Sabah tatil, öğleden sonra eğitim yapılması",
        "Sabah yalnız ezber, öğleden sonra yalnız spor yapılması"
      ],
      cozum: "Sabah dersleri Kur'an tilaveti, Arapça, hadis, fıkıh gibi dinî ilimlerden; öğleden sonraki dersler mantık, kelam, matematik ve astronomi gibi aklî bilimlerden oluşurdu (s.76-77).",
      fc: ["Aklî ilimler nedir?", "Mantık, matematik, astronomi gibi akla dayalı bilimler."]
    },
    {
      bi: 0,
      metin: "1271'de Türkiye Selçuklu veziri Sâhib Ata tarafından Sivas'ta yaptırılan ve ağırlıklı olarak fıkıh dersi verilen medrese hangisidir?",
      secenekler: ["Sâhibiye Medresesi", "Nizamiye Medresesi", "Yağıbasan Medresesi", "Karatay Medresesi"],
      cozum: "Sâhibiye Medresesi (Gök Medrese) 1271'de Sâhib Ata tarafından yaptırılmış, giderleri vakıf bütçesinden karşılanmış ve ağırlıklı olarak fıkıh dersleri verilmiştir (s.72).",
      fc: ["Sâhibiye Medresesi nedir?", "Sivas'ta 1271'de yaptırılan, fıkıh eğitimi veren Selçuklu medresesi."]
    },
    {
      bi: 0,
      metin: "Anıt mezar özelliği taşıyan ve İslam dünyasında ilk kez Türkler tarafından inşa edilen yapı türü hangisidir?",
      secenekler: ["Kümbet", "Ribat", "Eyvan", "Bedesten"],
      cozum: "Kümbetler İslam dünyasında ilk kez Türkler tarafından inşa edilmiştir; bazı sanat tarihçilerine göre Türklerin çadır sanatı kümbetler aracılığıyla mimariye yansımıştır (s.80).",
      fc: ["Kümbet nedir?", "Anıt mezar özelliği taşıyan, Türk mimarisine özgü kule biçimli yapı."]
    },
    {
      bi: 1,
      metin: "XI-XIII. yüzyıllarda Batı'da eğitimin büyük ölçüde sınırlı kalmasının temel nedeni hangisidir?",
      secenekler: [
        "Eğitimin Latince verilmesi ve kilise öğretilerine bağlı olması",
        "Yazının henüz bulunmaması ve okulların kapatılmış olması",
        "Şehirlerin boşalması ve ticaretin tümüyle durması",
        "Matbaanın erken icat edilip kitapların yaygınlaşması"
      ],
      cozum: "Katedral ve manastır okullarında eğitim dili Latinceydi, okuma yazma bilen azdı ve bilimsel çalışmaların önündeki en büyük engel Katolik Kilisesi'nin öğretileriydi (s.69).",
      fc: ["Skolastik düşünce nedir?", "Kilise öğretilerine dayanan, sorgulamayı sınırlayan Orta Çağ düşünce sistemi."]
    },
    {
      bi: 1,
      metin: "Küçük kan dolaşımını ilk kez doğru biçimde açıklayan ve Galen'in görüşlerini düzelten hekim kimdir?",
      secenekler: ["İbn Nefis", "İbn Sina", "Biruni", "Cezeri"],
      cozum: "İbn Nefis, Galen'in kalpteki delik iddiasını reddederek kanın akciğerlere gidip temizlendikten sonra kalbe döndüğünü belirtmiştir; bu bulgu XVI. yüzyılda yeniden keşfedilmiştir (s.74).",
      fc: ["Küçük kan dolaşımı nedir?", "Kanın kalp ile akciğerler arasındaki dolaşımı."]
    },
    {
      bi: 1,
      metin: "Hidrolik mühendisliği ve otomasyon alanındaki icatlarıyla anılan Türk-İslam bilim insanı kimdir?",
      secenekler: ["Cezeri", "Biruni", "Harezmi", "İbn Nefis"],
      cozum: "Cezeri'nin hidrolik deneyleri ve icatları suyun mühendislikte verimli kullanımını göstermiş, sonraki mühendislere ilham vermiştir (s.68).",
      fc: ["Cezeri'nin alanı nedir?", "Su gücüyle çalışan otomatik makineler tasarlayan hidrolik mühendisliği."]
    },
    {
      bi: 1,
      metin: "Türkçeyi bir ilim ve irfan dili hâline getirmek için hikmetlerini Arapça ve Farsça yerine Türkçe yazan mutasavvıf kimdir?",
      secenekler: ["Hoca Ahmed Yesevi", "Mevlana Celaleddin Rumi", "İbnülarabi", "Sadreddin Konevi"],
      cozum: "Pîr-i Türkistan ünvanlı Hoca Ahmed Yesevi, Divan-ı Hikmet'teki şiirlerinde Türkçeyi kullanarak dilin ilim ve irfan dili olmasına katkı sağladı; Yesevi dervişleri bu düşünceyi Anadolu'ya taşıdı (s.86).",
      fc: ["Divan-ı Hikmet nedir?", "Hoca Ahmed Yesevi'nin Türkçe tasavvufi şiirlerini toplayan eseri."]
    },
    {
      bi: 1,
      metin: "1228-1229'da Mengücekliler tarafından inşa edilen, cami, darüşşifa ve türbeden oluşan külliye hangisidir?",
      secenekler: [
        "Divriği Ulu Cami ve Darüşşifası",
        "İnce Minareli Medrese",
        "Kubâdâbâd Sarayı",
        "Talhatan Baba Camisi"
      ],
      cozum: "Divriği Ulu Cami ve Darüşşifası Mengücekliler tarafından 1228-1229'da yapılmıştır; dört taç kapısından kuzeydekine motifleri cenneti tasvir ettiği için Cennet Kapısı denmiştir (s.82).",
      fc: ["Divriği Ulu Cami ve Darüşşifası nedir?", "Mengüceklilerin 1228-1229'da yaptırdığı, taş işçiliğiyle ünlü külliye."]
    }
  ]
});

yazKonu({
  konu_id: "tar_10_u02_k05",
  ders: DERS, tema: 2, tema_adi: "Beylikten Devlete Osmanlı (1299-1453)",
  baslik: "2.1 Osmanlı Devleti'nin Kuruluşuna Dair Görüşler",
  kazanim: "Osmanlı Devleti'nin kuruluşuna dair farklı görüşleri, bu görüşlerin dayandığı kaynaklar çerçevesinde değerlendirir.",
  kaynak: kaynak("110-121"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Kuruluşa dair görüşleri dayandıkları kaynaklar bakımından karşılaştırır.",
    "Kuruluş tartışmalarında tarihçi yorumunun etkisini değerlendirir."
  ],
  items: [
    {
      bi: 0,
      metin: "Kuruluş tartışmalarına dair görüş ayrılıklarının temel nedeni hangisidir?",
      secenekler: [
        "İlk döneme ait yeterli kaynak ve bilgi bulunmaması",
        "Osmanlı arşivlerinin yabancı ülkelere taşınması",
        "Döneme ait paraların günümüze ulaşmaması",
        "Kuruluş döneminin hiçbir kaynakta anılmaması"
      ],
      cozum: "Görüş ayrılıklarının temel nedeni Osmanlı'nın ilk dönemlerine ait yeterli kaynak ve bilginin bulunmamasıdır; ilk Osmanlı kronikleri Osman Bey zamanından yüz yıl sonra yazılmıştır (s.111).",
      fc: ["Kronik nedir?", "Olayları günü gününe anlatan tarihî metin, vakayiname."]
    },
    {
      bi: 0,
      metin: "Herbert Adams Gibbons'ın Osmanlı Devleti'nin kuruluşuna ilişkin tezinin dayanağı hangisidir?",
      secenekler: [
        "Ulu Çınar menkıbesi ve kroniklerdeki anlatımlar",
        "Osmanlı tapu kayıtları ve tahrir defterleri",
        "Bizans'ın resmî saray arşivi belgeleri",
        "Osman Gazi adına kesilen sikkeler"
      ],
      cozum: "Gibbons, farklı kroniklerde değişik anlatıldığı için güvenilir bulmadığı Ulu Çınar menkıbesini Neşri'den alıntılamış ve buradan Osman Bey'in sonradan Müslüman olduğu sonucunu çıkarmıştır (s.111).",
      fc: ["Ulu Çınar menkıbesi nedir?", "Osman Bey'in rüyasında bir çınar ağacından cihan hâkimiyetinin müjdelendiği anlatı."]
    },
    {
      bi: 0,
      metin: "Mehmet Fuat Köprülü, Gibbons'ın görüşlerine hangi gerekçeyle karşı çıkmaktadır?",
      secenekler: [
        "Osmanlı'nın Selçuklu ve Anadolu beyliklerinin devamı olduğunu, ayrı bir ırk bulunmadığını savunması",
        "Kuruluşun 1299 yerine 1453'te gerçekleştiğini düşünmesi",
        "Osmanlıların Moğol asıllı olduğunu kabul etmesi",
        "Kuruluş dönemi kaynaklarının yeterli olduğunu belirtmesi"
      ],
      cozum: "Köprülü, kuruluşun genel Türk tarihi çerçevesinde Anadolu Selçuklu tarihinin devamı olarak incelenmesi gerektiğini belirtir; ona göre hiçbir zaman bir Osmanlı ırkı var olmamıştır (s.112-113).",
      fc: ["Köprülü'nün kuruluş görüşü nedir?", "Osmanlı'nın Anadolu Selçuklu ve beylikler geleneğinin devamı olduğu görüşü."]
    },
    {
      bi: 0,
      metin: "Paul Wittek'in kuruluş tezi hangi kavram üzerine kuruludur?",
      secenekler: ["Gaza", "İkta", "İstimâlet", "Sürgün"],
      cozum: "Wittek'e göre Osmanlılar gaza geleneğinden gelen bir Türk boyuydu ve devletin kuruluşunun temel unsuru bu gelenekti; tezini Ahmedî'nin İskendername'sine dayandırmıştır (s.113).",
      fc: ["Gaza nedir?", "İslam dini uğruna gayrimüslimlere karşı yapılan kutsal savaş."]
    },
    {
      bi: 0,
      metin: "Halil İnalcık, Osmanlı Beyliği'nin ortaya çıkışını hangi gelişme ile birlikte açıklar?",
      secenekler: [
        "Türkmenlerin Anadolu'ya göçü ve gazi beyliklerin kuruluş süreci",
        "Bizans'ın Anadolu'yu kendi isteğiyle boşaltması",
        "Haçlı Seferleri'nin Anadolu'yu tümüyle boşaltması",
        "Moğolların Anadolu'dan tamamen çekilmesi"
      ],
      cozum: "İnalcık'a göre kuruluş, XIII. yüzyılın ikinci yarısında Orta Anadolu'daki gelişmeler ve Batı Anadolu'daki Bizans toprakları üzerinde gazi Türkmen beyliklerinin kuruluş süreciyle birlikte incelenmelidir (s.114).",
      fc: ["Türkmen nedir?", "Anadolu'ya göç eden Oğuz boylarına verilen ad."]
    },
    {
      bi: 0,
      metin: "Halil İnalcık'ın kuruluşu açıklarken vurguladığı Bizanslı kronik yazarı kimdir?",
      secenekler: ["George Pachymeres", "Herbert Adams Gibbons", "Friedrich Giese", "Neşri"],
      cozum: "İnalcık, Bizans kronik yazarı George Pachymeres ile Osmanlı âlimi Yahşi Fakih'i sıkça kaynak olarak kullanmıştır (s.114).",
      fc: ["Pachymeres'in Osman Gazi tanımı nedir?", "Bizans'a karşı savaşan bir boy beyi ve alp olarak tanımlaması."]
    },
    {
      bi: 1,
      metin: "Yahşi Fakih'in Menâkıbnâme-i Âl-i Osman adlı eserine göre Osman Bey bağımsızlığını nasıl ilan etmiştir?",
      secenekler: [
        "1299'da Karacahisar'da kendi adına hutbe okutup kadı atayarak",
        "Bursa'yı fethedip adına sikke kestirerek",
        "Bizans imparatorundan unvan alarak",
        "İznik'te bir divan toplayarak"
      ],
      cozum: "Yahşi Fakih'in eserine göre Osman Bey 1299'da Karacahisar'da kendi adına hutbe okutmuş, töresini uygulayacağını açıklamış ve bir kadı atamıştır (s.114).",
      fc: ["Hutbe nedir?", "Cuma ve bayram namazlarında okunan, hükümdar adına da anılabilen dua metni."]
    },
    {
      bi: 1,
      metin: "Kuruluş Dönemi'ne ilişkin menkıbelerin doğrudan tarihî gerçek sayılması hangi sonucu doğurur?",
      secenekler: [
        "Kurgusal bir tarih anlatımının ortaya çıkmasına yol açar",
        "Döneme ait kaynak ihtiyacını ortadan kaldırır",
        "Tarihçilerin yorum yapmasını engeller",
        "Belgelerin güvenilirliğini artırır"
      ],
      cozum: "Kroniklerde ve seyahatnamelerde anlatılan menkıbelerin gerçekmiş gibi kabul edilmesi, dönemle ilgili kurgusal bir tarih anlatımına neden olmuştur (s.111).",
      fc: ["Menkıbe nedir?", "Olağanüstü olaylar içeren, sözlü gelenekle aktarılan dinî veya kahramanlık hikâyesi."]
    },
    {
      bi: 1,
      metin: "Aynı kuruluş dönemi hakkında tarihçilerin farklı yorumlar üretmesi hangi yaklaşımla açıklanabilir?",
      secenekler: [
        "Tarihçinin kaynak seçimi ve yorumunun anlatıyı biçimlendirmesiyle",
        "Tarihî olayların her yüzyılda değişmesiyle",
        "Kaynakların tarihçiden bağımsız olarak yorumlanmasıyla",
        "Dönemin belgelerinin tümüyle yok olmasıyla"
      ],
      cozum: "Tarihçiler farklı kaynaklardan hareketle farklı çıkarımlar yapabilir; bu nedenle \"Tarih yoktur, tarihçi vardır.\" görüşü kuruluş tartışmalarında öne çıkar (s.110).",
      fc: ["Tarihçi yorumu nedir?", "Kaynakların seçilip anlamlandırılmasıyla oluşan tarihî açıklama."]
    },
    {
      bi: 1,
      metin: "Köprülü'nün Gibbons'a yönelttiği eleştiriler arasında hangisi yer alır?",
      secenekler: [
        "Osmanlı kuruluşunu tabiat üstü sebeplerle açıklaması",
        "Osmanlı kroniklerini hiç kullanmaması",
        "Bizans kaynaklarına hiç başvurmaması",
        "Kuruluşu Balkan fetihlerinden sonraya bırakması"
      ],
      cozum: "Köprülü, eski Osmanlı tarihçilerinin kuruluşu mucize gibi gösterme alışkanlığını eleştirir; modern tarihçiliğin de aynı ananeyi başka biçimde sürdürmesini doğru bulmaz (s.112).",
      fc: ["Silsilename nedir?", "Hanedanın soyunu kesintisiz ve menkıbevi biçimde gösteren liste."]
    }
  ]
});

yazKonu({
  konu_id: "tar_10_u02_k06",
  ders: DERS, tema: 2, tema_adi: "Beylikten Devlete Osmanlı (1299-1453)",
  baslik: "2.2 Beylikten Devlete Siyasi ve Askerî Gelişmeler",
  kazanim: "1299-1453 arasındaki siyasi ve askerî gelişmelerin Osmanlı Devleti'nin beylikten devlete geçiş sürecine etkisini değerlendirir.",
  kaynak: kaynak("122-139"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Siyasi ve askerî gelişmelerin beylikten devlete geçiş sürecine etkisini açıklar.",
    "Fetihlerin yönünü ve stratejisini kaynaklar üzerinden çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "1302'de Osman Gazi'nin Doğu Roma ordusuna karşı kazandığı ve beyliğe hanedan kurucusu karizması kazandıran savaş hangisidir?",
      secenekler: ["Koyunhisar Savaşı (Bapheus)", "Pelekanon Savaşı", "Çirmen Savaşı", "Sazlıdere Savaşı"],
      cozum: "Koyunhisar (Bapheus) Savaşı'nda bir imparatorluk ordusu yenilgiye uğratılmış, Osman Gazi bölgede karizmatik bir bey durumuna gelmiştir (s.124).",
      fc: ["Koyunhisar Savaşı nedir?", "1302'de Osman Gazi'nin Doğu Roma ordusunu yendiği, beyliğin öne çıktığı savaş."]
    },
    {
      bi: 0,
      metin: "Bursa'nın 6 Nisan 1326'da alınmasının Osmanlı Beyliği açısından önemi hangisidir?",
      secenekler: [
        "Beyliğin gerçek anlamda kuruluşunun tamamlanması ve başkent olması",
        "İlk donanmanın burada kurulması",
        "Rumeli'ye ilk geçişin buradan yapılması",
        "İlk divanın burada toplanması"
      ],
      cozum: "Bursa'nın fethi beyliğin gerçek anlamda kuruluşunu tamamlamış; Orhan Bey fetihten sonra para bastırarak bağımsızlığını göstermiştir (s.126).",
      fc: ["Bursa'nın fethinin önemi nedir?", "Beyliğin kuruluşunu tamamlayan ve başkent olan şehrin alınması."]
    },
    {
      bi: 0,
      metin: "1329'da Pelekanon'da Orhan Bey'in karşısına çıkan Doğu Roma imparatoru kimdir?",
      secenekler: ["III. Andronikos", "IV. Ioannes Kantakuzenos", "V. Ioannis Paleologos", "II. Manuel"],
      cozum: "Bizans imparatoru III. Andronikos, İznik ve İzmit'i kurtarmak için çıktığı seferde Pelekanon'da (Gebze dolayları) Orhan Bey'e yenilmiştir (s.126).",
      fc: ["Pelekanon Savaşı nedir?", "1329'da Orhan Bey ile Bizans imparatorunun ilk kez doğrudan karşılaştığı savaş."]
    },
    {
      bi: 0,
      metin: "1345'te Osmanlı hâkimiyetine alınan ilk Türk beyliği hangisidir?",
      secenekler: ["Karesioğulları", "Germiyanoğulları", "Hamidoğulları", "Candaroğulları"],
      cozum: "Karesioğulları, Osmanlı hâkimiyetine alınmış ilk Türk beyliğidir; denizcilik tecrübesi ve gazileri Rumeli fetihlerinde önemli avantaj sağlamıştır (s.127).",
      fc: ["Karesioğulları'nın katkısı nedir?", "Donanma ve denizcilik tecrübesinin Osmanlı'ya geçmesi."]
    },
    {
      bi: 0,
      metin: "Osmanlıların Rumeli'deki ilk üssü olarak kabul edilen yer hangisidir?",
      secenekler: ["Çimpe Kalesi", "Bolayır", "Gelibolu", "Edirne"],
      cozum: "1352'deki geçişte Kantakuzenos tarafından Süleyman Paşa'ya üs olarak Çimpe Kalesi verilmiş; Osmanlılar buradan Trakya içlerine akınlar düzenlemiştir (s.127-128).",
      fc: ["Çimpe Kalesi nedir?", "Rumeli'de Osmanlılara üs olarak verilen ilk kale."]
    },
    {
      bi: 1,
      metin: "Edirne'nin fethinin Osmanlı Devleti'ne sağladığı stratejik avantaj hangisidir?",
      secenekler: [
        "Balkanlar ve İstanbul'a yönelik iki cephenin oluşması",
        "Anadolu'daki beyliklerle sınırın kapanması",
        "Karadeniz ticaretinin tümüyle durması",
        "Donanmanın Akdeniz'e çıkmasının engellenmesi"
      ],
      cozum: "Edirne birüs haline getirilerek bir taraftan Balkanlar'a, diğer taraftan İstanbul'a yönelik iki cephe ortaya çıkmış; şehir 1365'te başkent olmuştur (s.128-129).",
      fc: ["Edirne'nin başkent olma tarihi nedir?", "Sarayın Bursa'dan Edirne'ye taşındığı 1365 yılı."]
    },
    {
      bi: 1,
      metin: "1371'de Meriç kıyısında Sırp ordusuna baskın yapılan savaş hangisidir?",
      secenekler: ["Çirmen Savaşı", "Sazlıdere Savaşı", "Niğbolu Savaşı", "I. Kosova Savaşı"],
      cozum: "Çirmen Savaşı'nda Sırp ordusu baskınla bozguna uğratılmış, birçok Doğu Roma, Sırp ve Bulgar feodal beyi Osmanlı'nın vasalı hâline gelmiştir (s.129-130).",
      fc: ["Vasal nedir?", "Bir devlete bağlılık ve vergi yükümlülüğü altına giren yerel yönetici."]
    },
    {
      bi: 1,
      metin: "I. Kosova Savaşı'nın (1389) Balkanlar açısından sonucu hangisidir?",
      secenekler: [
        "Sırpların son meydan okuyuşunun kırılması ve Bizans'ın Balkanlarla bağının kopması",
        "Macarların Balkanlardan tümüyle çekilip Tuna'nın güneyine inmemesi",
        "Osmanlı'nın Rumeli'deki tüm topraklarını beyliklere geri vermesi",
        "Bulgar Krallığı'nın yeniden kurulup Edirne'yi kuşatması"
      ],
      cozum: "I. Kosova Savaşı Sırpların Türklere son meydan okuyuşu olmuş, Bizans'ın Balkan ülkeleriyle bağlantısı kopmuş ve Bizans Anadolu'da sıkışan bir adacık durumuna gelmiştir (s.130).",
      fc: ["Kosova Polye nedir?", "I. Kosova Savaşı'nın yapıldığı, Karakuşlar Sahrası da denilen alan."]
    },
    {
      bi: 1,
      metin: "Ankara Savaşı'nda (1402) Osmanlı ordusunun dağılmasında etkili olan gelişme hangisidir?",
      secenekler: [
        "Kara Tatarların ve bir kısım askerin Timur'un saflarına geçmesi",
        "Osmanlı donanmasının savaşa katılmaması",
        "Sırp askerlerinin savaşın başında kaçması",
        "Yeniçerilerin savaş alanına geç ulaşması"
      ],
      cozum: "Sağ kanattaki Kara Tatarlar taraf değiştirerek Rumeli kuvvetlerine ok yağdırmış, bir kısım Türk askeri de Timur'un saflarına geçmiştir (s.132).",
      fc: ["Çubuk Ovası'nın önemi nedir?", "Ankara Savaşı'nın 28 Temmuz 1402'de yapıldığı yer."]
    },
    {
      bi: 1,
      metin: "Ankara Savaşı'ndan sonra yaşanan Fetret Devri hangi olayla sona ermiştir?",
      secenekler: [
        "1413'te I. Mehmet'in tahta çıkmasıyla",
        "1402'de Timur'un Anadolu'dan çekilmesiyle",
        "1444'te Edirne-Segedin Antlaşması'yla",
        "1448'de II. Kosova Savaşı'yla"
      ],
      cozum: "1402-1413 arasındaki taht mücadeleleri Fetret Devri olarak adlandırılmış, dönem 1413'te I. Mehmet'in tahta çıkmasıyla sona ermiştir (s.133).",
      fc: ["Fetret Devri nedir?", "Ankara Savaşı sonrası şehzadeler arası taht kavgalarıyla geçen 1402-1413 dönemi."]
    }
  ]
});

yazKonu({
  konu_id: "tar_10_u02_k07",
  ders: DERS, tema: 2, tema_adi: "Beylikten Devlete Osmanlı (1299-1453)",
  baslik: "2.3 Osmanlı Devleti'nde Ordu, Hukuk ve Toprak Sistemi",
  kazanim: "Beylikten devlete geçiş sürecinde Osmanlı ordu, toprak ve hukuk sistemlerinin işleyişini ve birbirleriyle ilişkisini çözümler.",
  kaynak: kaynak("140-155"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Ordu, toprak ve hukuk kurumlarının işleyişini açıklar.",
    "Tımar ve devşirme uygulamalarının merkezî otoriteye etkisini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "Osmanlı Devleti'nin ilk düzenli ve daimî askerî birlikleri hangileridir?",
      secenekler: ["Yaya ve müsellemler", "Yeniçeriler ve cebeciler", "Akıncılar ve azaplar", "Sipahi ve silahtarlar"],
      cozum: "Bursa'nın fethinden sonra oluşturulan yaya ve müsellemler, doğrudan padişaha bağlı hassa ordusunu oluşturan ilk düzenli birliklerdir (s.142-143).",
      fc: ["Müsellem nedir?", "İlk düzenli ordunun atlı askerine verilen ad."]
    },
    {
      bi: 0,
      metin: "Yeniçeri Ocağı hangi padişah döneminde, hangi yöntemle kurulmuştur?",
      secenekler: [
        "I. Murad Dönemi'nde pençik sistemiyle",
        "Orhan Bey Dönemi'nde devşirme sistemiyle",
        "I. Mehmet Dönemi'nde tımar sistemiyle",
        "II. Murad Dönemi'nde gulam sistemiyle"
      ],
      cozum: "I. Murad Hüdavendigâr, savaş esirlerinin beşte birinin devlete ait olması esasına dayanan pençik sistemiyle Yeniçeri Ocağı'nı kurmuştur (1363). Asker yetiştirmek üzere Gelibolu'da Acemi Ocağı açılmıştır (s.149).",
      fc: ["Pençik sistemi nedir?", "Savaş esirlerinin beşte birinin devlete ayrılarak asker yetiştirilmesi uygulaması."]
    },
    {
      bi: 0,
      metin: "Mülkiyeti devlete ait olup işleme hakkı şahıslara bırakılan arazi türü hangisidir?",
      secenekler: ["Mirî arazi", "Mülk arazi", "Vakıf arazi", "Yurtluk"],
      cozum: "Osmanlı toprak sisteminde araziler mirî, mülk ve vakıf olarak sınıflandırılırdı; mirî arazinin mülkiyeti devlete, işleme hakkı şahıslara aitti (s.144).",
      fc: ["Mirî arazi nedir?", "Mülkiyeti devlete, işleme hakkı şahıslara ait arazi."]
    },
    {
      bi: 0,
      metin: "Yıllık geliri 100.000 akçeden fazla olan ve vezirler, beylerbeyi gibi yüksek görevlilere verilen dirlik hangisidir?",
      secenekler: ["Has", "Zeamet", "Tımar", "Mukataa"],
      cozum: "Dirlikler yıllık gelirlerine göre has, zeamet ve tımar olarak üçe ayrılırdı; has, geliri 100.000 akçeden fazla olan ve yüksek devlet görevlilerine verilen dirliklerdir (s.145).",
      fc: ["Zeamet nedir?", "Yıllık geliri 20.000-100.000 akçe arasında olan dirlik."]
    },
    {
      bi: 0,
      metin: "Köylü ailelere bir çift öküzün işleyebileceği büyüklükte toprak tahsisine dayanan uygulama hangisidir?",
      secenekler: ["Çifthane sistemi", "Pençik sistemi", "Devşirme sistemi", "Mukataa sistemi"],
      cozum: "Tımar sisteminin temel unsuru olan çifthane uygulamasında köylü ailelere bir çift öküzün işleyebileceği arazi verilir, karşılığında çift resmi adlı vergi alınırdı (s.145).",
      fc: ["Çift resmi nedir?", "Köylünün işlediği toprak karşılığında ödediği vergi."]
    },
    {
      bi: 1,
      metin: "Devşirme sistemine geçilmesinin temel nedeni hangisidir?",
      secenekler: [
        "Ankara Savaşı sonrası fetihlerin durması ve asker sayısının azalması",
        "Tımarlı sipahilerin savaşa katılmak istememesi",
        "Donanmanın kaldırılması",
        "Yeniçerilerin maaşlarının artırılması"
      ],
      cozum: "Ankara Savaşı (1402) sonrasında Balkan fetihlerinin durması ve asker sayısının azalması nedeniyle pençik yöntemi yetersiz kalmış, devşirme sistemine geçilmiştir (s.149).",
      fc: ["Devşirme nedir?", "Gayrimüslim çocukların yeteneklerine göre devlet hizmetine alınıp yetiştirilmesi."]
    },
    {
      bi: 1,
      metin: "Tımarlı sipahinin yetiştirip savaşa götürmekle yükümlü olduğu zırhlı ve silahlı askere ne ad verilir?",
      secenekler: ["Cebelü", "Müsellem", "Azap", "Lağımcı"],
      cozum: "Has ve zeamet sahipleri her beş bin akçe, tımarlı sipahiler ise kılıç hakkı hariç her üç bin akçe için bir cebelü yetiştirmek zorundaydı (s.146).",
      fc: ["Cebelü nedir?", "Tımarlı sipahinin savaşa götürdüğü zırhlı asker."]
    },
    {
      bi: 1,
      metin: "Geçerli bir sebep olmadan toprağını üç yıl boyunca ekmeyen köylünün ödediği vergi hangisidir?",
      secenekler: ["Çiftbozan", "Çift resmi", "Öşür", "Cizye"],
      cozum: "Toprağı üç yıl ekmeyen reaya, bir defaya mahsus çiftbozan adlı vergiyi öderdi (s.145).",
      fc: ["Çiftbozan nedir?", "Toprağı üç yıl işlemeyen köylüden alınan ceza vergisi."]
    },
    {
      bi: 1,
      metin: "Osmanlı hukukunda örfi hukukun kaynağı hangisidir?",
      secenekler: [
        "Türk âdet ve gelenekleri ile fethedilen bölgelerin uygulamaları",
        "Yalnız Kur'an ve sünnetten çıkarılan dinî hükümler",
        "Bizans kanunnameleri ile kilise kararları",
        "Memlûk fıkıh kitaplarındaki içtihatlar"
      ],
      cozum: "Şeri hukuk kurallarını dinî esaslardan alırken örfi hukuk, Türkistan'dan beri süregelen âdet ve gelenekler ile fethedilen bölgelerdeki uygulamalardan oluşurdu (s.153).",
      fc: ["Örfi hukuk nedir?", "Âdet, gelenek ve idari ihtiyaçlara göre oluşan, şeri hukuka aykırı olmayan hukuk."]
    },
    {
      bi: 1,
      metin: "Osmanlı yargı teşkilatının başında bulunan, müderris ve kadıların tayininden sorumlu görevli kimdir?",
      secenekler: ["Kazasker", "Nişancı", "Defterdar", "Yeniçeri ağası"],
      cozum: "Dîvân-ı Hümâyunun asli üyesi olan kazasker (kadı asker), müderris ve kadıların tayininden sorumluydu ve divana gelen davaları karara bağlardı (s.153).",
      fc: ["Kadı nedir?", "Şeri ve örfi davalara bakan, şeriat mahkemesine başkanlık eden görevli."]
    }
  ]
});

yazKonu({
  konu_id: "tar_10_u02_k08",
  ders: DERS, tema: 2, tema_adi: "Beylikten Devlete Osmanlı (1299-1453)",
  baslik: "2.4 Osmanlı Devleti'nin İskân ve İstimalet Politikası",
  kazanim: "Osmanlı Devleti'nin fethedilen topraklarda kalıcı olmak için uyguladığı iskân ve istimâlet politikalarını çözümler.",
  kaynak: kaynak("156-171"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "İskân ve istimâlet politikalarının amaç ve yöntemlerini açıklar.",
    "Bu politikaların Rumeli'de kalıcılığa etkisini kaynaklar üzerinden çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "Osmanlı Devleti'nin bir bölgeyi Türkleştirmek, İslamlaştırmak ve şenlendirmek amacıyla uyguladığı yerleşim politikasına ne ad verilir?",
      secenekler: ["İskân", "İstimâlet", "Derbent", "Mukataa"],
      cozum: "İskân, Osmanlı Devleti'nin belli bir bölgeyi Türkleştirmek, İslamlaştırmak ve şenlendirmek amacıyla orada yaşayan yerleşik veya konargöçer grupları kendi isteği ya da devletin emriyle yerleştirmesidir (s.158).",
      fc: ["İskân nedir?", "Toplulukların yeni bölgelere yerleştirilmesi, yerleşime açılması."]
    },
    {
      bi: 0,
      metin: "Fethedilen bölgelerde gayrimüslimlerin gönlünü alarak devlete bağlılıklarını sağlamayı amaçlayan politikaya ne ad verilir?",
      secenekler: ["İstimâlet", "İskân", "Sürgün", "Tahrir"],
      cozum: "İstimâlet (gönül alma), gayrimüslimlere dinî serbestlik tanıyıp can ve mal güvenliklerini sağlayarak bölgede Osmanlı hâkimiyetini kalıcı kılmayı amaçlayan uzlaşmacı politikadır (s.162).",
      fc: ["İstimâlet nedir?", "Gayrimüslim halkın gönlünü alıp devlete bağlamayı amaçlayan uzlaşmacı politika."]
    },
    {
      bi: 0,
      metin: "Osmanlıların Rumeli'de ilk iskân faaliyetleri hangi gelişmeyle başlamıştır?",
      secenekler: [
        "Süleyman Paşa'nın Çimpe Kalesi'ne yerleşmesiyle (1352)",
        "Edirne'nin fethedilmesiyle (1361)",
        "Ankara Savaşı'nın ardından (1402)",
        "İstanbul'un fethedilmesiyle (1453)"
      ],
      cozum: "Rumeli'ye geçiş, Orhan Bey'in oğlu Süleyman Paşa'nın 1352'de Çimpe Kalesi'ne yerleşmesiyle başlamış; ardından Karesi bölgesindeki bazı aşiretler Rumeli'ye getirilerek yerleştirilmiştir (s.158).",
      fc: ["Çimpe Kalesi'nin iskân açısından önemi nedir?", "Süleyman Paşa'nın 1352'de buraya yerleşmesiyle Rumeli iskânlarının başlaması."]
    },
    {
      bi: 0,
      metin: "Tehlikeli geçit ve boğazlarda halkın can, mal ve namus güvenliğini sağlamak için inşa edilen küçük kalelere ne ad verilir?",
      secenekler: ["Derbent", "Ribat", "Karavul", "Palanka"],
      cozum: "Derbentler, özellikle dağlık alanlardaki geçit ve boğazlarda güvenliği sağlamak için inşa edilen küçük kalelerdir; çevrelerinde zamanla yerleşimler oluşmuştur (s.160).",
      fc: ["Derbent nedir?", "Geçit ve boğazlarda güvenliği sağlayan küçük kale ve çevresindeki yerleşim."]
    },
    {
      bi: 0,
      metin: "Osmanlı Devleti fethedilen şehirlerin halkına yönelik hangi uygulamayı benimsemiştir?",
      secenekler: [
        "Savaşla alınan şehir halkını göçürme, teslim olanlarca yerinde kalma hakkı tanıma",
        "Bütün şehir halklarını Anadolu'nun iç kesimlerine sürme",
        "Yalnız tüccarları şehirde bırakıp esnafı göçürme",
        "Şehirleri tümüyle boşaltıp yerlerine yalnız asker yerleştirme"
      ],
      cozum: "Savaş yoluyla teslim alınan şehirlerin halkı başka bölgelere gönderilmiş, savaş yapılmadan teslim alınan şehirlerde yaşayanlara yerlerinde kalma hakkı tanınmıştır (s.160).",
      fc: ["Teslim olmanın karşılığı nedir?", "Savaş yapılmadan teslim olan halkın yerinde kalma hakkı."]
    },
    {
      bi: 1,
      metin: "I. Bayezid'in Saruhan ilindeki göçerleri Filibe yöresine yerleştirme emri hangi gerekçeye dayanmaktadır?",
      secenekler: [
        "Göçerlerin tuz yasağına aykırı hareket etmesi",
        "Göçerlerin tımarlarını satması",
        "Filibe'de salgın hastalık çıkması",
        "Göçerlerin Müslüman olmaması"
      ],
      cozum: "Menemen Ovası'nda kışlayan göçebeler tuz yasağına aykırı davranınca I. Bayezid hepsinin Filibe yöresine yerleştirilmesi için sürgün emri vermiştir (s.160).",
      fc: ["Sürgün politikası nedir?", "Suç işleyen veya aykırı davranan grupların uzak bölgelere zorunlu yerleştirilmesi."]
    },
    {
      bi: 1,
      metin: "Rumeli'ye yerleştirilen ailelere tımar toprağı verilmesinin etkisi hangisidir?",
      secenekler: [
        "Anadolu'dan bölgeye göçün teşvik edilmesi ve toprağın işlenmesi",
        "Yerli halkın tümünün göç etmesi",
        "Bölgede tarımsal üretimin durması",
        "Tımarlı sipahilerin sayısının azalması"
      ],
      cozum: "Tımar toprağı verilmesi göçleri teşvik etmiş, bölge mamur hâle gelmiş ve toprak işlenmiştir; yollar boyunca kurulan köyler yeni seferlerde sevkiyatı kolaylaştırmıştır (s.161).",
      fc: ["İskânda tımarların işlevi nedir?", "Göçü teşvik ederek yeni yerleşimlerin kurulmasını ve üretimi sağlaması."]
    },
    {
      bi: 1,
      metin: "Rumeli'de iskân edilen ailelerin birbirine yakın bölgelerden getirilmesine dikkat edilmesinin nedeni hangisidir?",
      secenekler: [
        "Yeni bölgenin coğrafi ve ekonomik koşullarına uyumun kolaylaşması",
        "Nüfusun tek bir şehirde toplanmasının istenmesi",
        "Farklı dillerin yasaklanması",
        "Vergi toplamanın zorlaşması"
      ],
      cozum: "Benzer bölgelerden gelen ailelerin yeni yerleşim yerinin coğrafi ve ekonomik koşullarına uyum sağlaması kolaylaşmıştır (s.161).",
      fc: ["İskânda benzer yöre tercihi nedir?", "Getirilen ailelerin uyumunu kolaylaştırmak için aynı bölgeden seçilmesi."]
    },
    {
      bi: 1,
      metin: "İstimâlet politikasının gayrimüslim halka sağladığı imkânlar arasında hangisi yer alır?",
      secenekler: [
        "Dinî hayatta serbestlik ile can ve mal güvenliği",
        "Yalnız Müslüman olanların toprak sahibi olması",
        "Kilise ve manastırların yıktırılması",
        "Ağır vergilerin artırılarak halkın borçlandırılması"
      ],
      cozum: "İstimâlet yoluyla gayrimüslimlere dinî hayatlarında geniş serbestlik tanınmış, can ve mal güvenlikleri güvence altına alınmış, kiliseleri koruma altına alınmıştır (s.162).",
      fc: ["İstimâletin sonucu nedir?", "Balkanlarda devlet ve toplum düzeninin sağlanması."]
    },
    {
      bi: 1,
      metin: "Bazı tarihçilerin Balkanlar'ın XIV-XV. yüzyıllarda tümüyle Türkleştiği görüşüne karşı çıkmasının gerekçesi hangisidir?",
      secenekler: [
        "Göçlerin sınırlı kalması ve Hristiyan nüfusun ağırlığını koruması",
        "Osmanlıların Balkanlara hiç yerleşmemesi",
        "Tımar sisteminin hiç uygulanmaması",
        "Anadolu'dan hiç göç yaşanmaması"
      ],
      cozum: "Kaynaklara göre 1402'den sonra göçmen akımı durmuş, sultanlar yalnız önemli noktalara garnizon yerleştirmiş; Hristiyan nüfus ağırlığını korumuştur (s.161).",
      fc: ["İskânın sınırlılığı ne demektir?", "Göçlerin Balkanları tümüyle Türkleştirmeye yetmemesi."]
    }
  ]
});

yazKonu({
  konu_id: "tar_10_u02_k09",
  ders: DERS, tema: 2, tema_adi: "Beylikten Devlete Osmanlı (1299-1453)",
  baslik: "2.5 Osmanlı Devleti'nin İlim ve İrfan Geleneği",
  kazanim: "Osmanlı şehirlerindeki ilim ve irfan geleneğinin oluşumunda şehir, kurum ve şahsiyetlerin etkisini çözümler.",
  kaynak: kaynak("172-205"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Osmanlı şehirlerindeki ilim ve irfan kurumlarını açıklar.",
    "Şehir, vakıf ve eğitim kurumları arasındaki ilişkiyi çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "Osmanlı belgelerinde şehir kavramı hangi biçimde tanımlanmıştır?",
      secenekler: [
        "Cuma kılınır ve pazar kurulur yer",
        "Surlarla çevrili ve asker barındıran yer",
        "Yalnız tüccarların yaşadığı yer",
        "Medrese bulunan her yerleşim"
      ],
      cozum: "Osmanlı belgelerinde şehir, \"cuma kılınır ve pazar kurulur yer\" olarak tanımlanmıştır; bu nedenle merkezinde ulu cami ve pazar bulunurdu (s.175).",
      fc: ["Osmanlı'da şehir nedir?", "Cuma namazı kılınan ve pazar kurulan yerleşim."]
    },
    {
      bi: 0,
      metin: "Osmanlıların kale dışında kurdukları yeni iskân alanlarına ne ad verilir?",
      secenekler: ["Tahtakale", "Bedesten", "Derbent", "Hazire"],
      cozum: "Osmanlılar fethedilen şehirleri kale içinin dışında kalan ve tahtakale (tahte'l-kal'a) denilen yerlere yeni iskân alanları kurarak genişletmiştir (s.176).",
      fc: ["Tahtakale nedir?", "Kale dışında kurulan yeni yerleşim alanı."]
    },
    {
      bi: 0,
      metin: "Osmanlı şehirlerinin büyüyüp yerleşimin artmasında ve ilim merkezlerinin kurulmasında temel mekanizma hangisidir?",
      secenekler: ["Külliyeler", "Bedestenler", "Derbentler", "Tersaneler"],
      cozum: "Şehirleri büyütüp ilim merkezleri kurmanın temel mekanizmasını külliyeler oluşturmuştur; yeni yerleşim yerleri bu yapıların etrafında şekillenmiştir (s.176).",
      fc: ["Külliye nedir?", "Cami, medrese, imaret, hamam gibi yapıların bir arada bulunduğu topluluk."]
    },
    {
      bi: 0,
      metin: "İlk Osmanlı medresesi olarak kabul edilen kurum hangisidir?",
      secenekler: [
        "1331'de kurulan İznik Orhaniye Medresesi",
        "Bursa'daki Muradiye Medresesi",
        "Amasya'daki Haliliye Medresesi",
        "Konya'daki Sırçalı Medrese"
      ],
      cozum: "Orhan Gazi Dönemi'nde 1331'de kurulan İznik Orhaniye (İznik) Medresesi ilk Osmanlı medresesidir; ilk müderrisi Dâvûd-i Kayserî'dir (s.184).",
      fc: ["İznik Orhaniye Medresesi nedir?", "1331'de kurulan ilk Osmanlı medresesi."]
    },
    {
      bi: 0,
      metin: "İlk Osmanlı darüşşifası olarak kabul edilen yapı hangi külliye içinde yer alır?",
      secenekler: [
        "Yıldırım Külliyesi",
        "Muradiye Külliyesi",
        "Yeşil Külliye",
        "Orhan Bey Külliyesi"
      ],
      cozum: "1391-1395 arasında Yıldırım Bayezid'in himayesinde inşa edilen Yıldırım Külliyesi'ndeki darüşşifada hastalar tedavi edilmiş ve tıp eğitimi verilmiştir; burası ilk Osmanlı darüşşifasıdır (s.181).",
      fc: ["Darüşşifa nedir?", "Hastaların tedavi edildiği, tıp eğitimi verilen kurum."]
    },
    {
      bi: 1,
      metin: "Osmanlı şehirlerinde han ve bedestenlerle vakıf kurumları arasındaki ilişki hangisidir?",
      secenekler: [
        "Ticari yapıların gelirlerinin külliye ve camilere vakfedilmesi",
        "Vakıfların han ve bedestenleri yasaklaması",
        "Ticari yapıların yalnız devlet hazinesine gelir sağlaması",
        "Vakıfların çarşılardan hiç gelir almaması"
      ],
      cozum: "Bursa'daki Emir Hanı'nın Orhan Gazi Camisi'ne, İpek Hanı'nın Yeşil Cami'ye vakfedilmesi gibi uygulamalarla ticari yapıların geliri hayır kurumlarını beslemiştir (s.179).",
      fc: ["Vakıf geliri nedir?", "Hayır kurumlarının giderlerini karşılamak için bağlanan düzenli gelir."]
    },
    {
      bi: 1,
      metin: "Medreselerde Arapça ile ilgili ilimlere ne ad verilir?",
      secenekler: ["Âlet ilimleri", "Cüziyyat", "Akliyyat", "Nakliyyat"],
      cozum: "Arapça diğer ilimleri anlamanın anahtarı olduğu için Arapçayla ilgili ilimlere âlet ilimleri denirdi; ardından mantık, felsefe, hesap, hendese, tıp, astronomi gibi ilimler okunurdu (s.185).",
      fc: ["Âlet ilimleri nedir?", "Arapça grameri gibi diğer ilimleri öğrenmeye araç olan ilimler."]
    },
    {
      bi: 1,
      metin: "Tekke ve zaviyelerin Osmanlı şehir hayatındaki işlevi hangisidir?",
      secenekler: [
        "Yolculara ve ihtiyaç sahiplerine ücretsiz barınma ve yemek sağlamak",
        "Yalnızca savaş için asker yetiştirip orduya katmak",
        "Şehirdeki vergileri toplayıp defterlere kaydetmek",
        "Kale ve şehir surlarını onarıp nöbet tutmak"
      ],
      cozum: "Tekke ve zaviyeler ihtiyaç sahiplerine ve yolculara kapılarını açmış, vakıf gelirleriyle gelip geçenlerin yeme ve barınma ihtiyaçları ücretsiz karşılanmıştır (s.186-187).",
      fc: ["Zaviye nedir?", "Tekkenin küçüğü olan, yolcuların ücretsiz barındığı yapı."]
    },
    {
      bi: 1,
      metin: "Osmanlıların Mevlevilik ile kurduğu bağa örnek olarak hangisi gösterilir?",
      secenekler: [
        "Yıldırım Bayezid'in Mevlana soyundan Devlet Hatun ile evlenmesi",
        "Mevlana Türbesi'nin yıktırılması",
        "Konya'nın başkent yapılması",
        "Mevlevi dergâhlarının kapatılması"
      ],
      cozum: "Yıldırım Bayezid'in şehzadeliğinde Mevlana soyundan Devlet Hatun'la evlenmesi ve oğullarının çelebi ünvanını kullanması bu bağı güçlendirmiştir (s.187).",
      fc: ["Mevlevilik nedir?", "Mevlana'nın düşünceleri çevresinde Konya merkezli gelişen tasavvufi yol."]
    },
    {
      bi: 1,
      metin: "Kuruluş Dönemi'nde başlayan tercüme hareketinin zirveye ulaştığı dönem hangisidir?",
      secenekler: ["II. Murad Dönemi", "Orhan Bey Dönemi", "Yıldırım Bayezid Dönemi", "I. Mehmet Dönemi"],
      cozum: "İznik Medresesi'nin açılışından sonra başlayan Arapça ve Farsçadan Türkçeye tercüme hareketi II. Murad Dönemi'nde zirveye ulaşmıştır (s.185).",
      fc: ["Tercüme hareketi nedir?", "Arapça ve Farsça eserlerin Türkçeye kazandırılması süreci."]
    }
  ]
});

yazKonu({
  konu_id: "tar_10_u03_k10",
  ders: DERS, tema: 3, tema_adi: "Cihan Devleti Osmanlı (1453-1683)",
  baslik: "3.1 Osmanlı Devleti'nin Cihan Devleti Hâline Gelmesi",
  kazanim: "1453-1683 yılları arasındaki siyasi ve askerî gelişmelerin Osmanlı Devleti'ni cihan devleti hâline getirme sürecine etkisini değerlendirir.",
  kaynak: kaynak("208-234"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "1453-1683 arasındaki siyasi ve askerî gelişmeleri açıklar.",
    "Fetihlerin Osmanlı'nın cihan devleti konumuna etkisini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "İstanbul'un fethi hazırlıklarında Boğaz'ın en dar yerine inşa edilen Rumeli (Boğazkesen) Hisarı'nın amacı hangisidir?",
      secenekler: [
        "Boğazı kontrol altına alıp denizden gelecek yardımları engellemek",
        "Şehre karadan yapılacak taarruz için üs olmak",
        "Haliç'in girişini zincirle kapatmak",
        "Donanmayı karadan Haliç'e indirmek"
      ],
      cozum: "Anadolu Hisarı'nın karşısına Rumeli (Boğazkesen) Hisarı inşa edilerek İstanbul Boğazı kontrol altına alınmış ve Doğu Roma'ya deniz yoluyla gelebilecek yardımlar engellenmiştir (s.211).",
      fc: ["Boğazkesen Hisarı nedir?", "İstanbul'un fethi öncesi Boğaz kontrolü için yapılan hisar."]
    },
    {
      bi: 0,
      metin: "İstanbul'un 29 Mayıs 1453'te fethedilmesinin dünya tarihi açısından sonucu hangisidir?",
      secenekler: [
        "1123 yıllık Doğu Roma İmparatorluğu'nun ortadan kalkması",
        "Haçlı Seferleri'nin başlaması",
        "Bizans'ın başkentini İznik'e taşıması",
        "Ortodoks Kilisesi'nin kapatılması"
      ],
      cozum: "Fetihle 1123 yıllık Doğu Roma İmparatorluğu ortadan kalkmış, II. Mehmet İslam dünyasında Fatih ünvanıyla anılmıştır (s.218).",
      fc: ["Fatih ünvanı nedir?", "İstanbul'u fethedip Doğu Roma'yı yıkan II. Mehmet'e verilen ünvan."]
    },
    {
      bi: 0,
      metin: "1473'te Akkoyunlu Hükümdarı Uzun Hasan'a karşı kazanılan savaş hangisidir?",
      secenekler: ["Otlukbeli", "Çaldıran", "Mercidabık", "Niğbolu"],
      cozum: "Otlukbeli Savaşı'nda (1473) Akkoyunlu Devleti yenilgiye uğratılmış, Fırat'a kadar olan bölgeler Osmanlı hâkimiyetine girmiştir (s.216).",
      fc: ["Otlukbeli Savaşı nedir?", "1473'te Akkoyunlulara karşı kazanılan, Doğu Anadolu güvenliğini sağlayan savaş."]
    },
    {
      bi: 0,
      metin: "Kırım'ın 1475'te Osmanlı hâkimiyetine alınmasının stratejik önemi hangisidir?",
      secenekler: [
        "Karadeniz hâkimiyetinin pekişmesi ve kuzey sınırlarının korunması",
        "Akdeniz'de Venedik'e üstünlük sağlanması",
        "Haliç'in denetim altına alınması",
        "Mısır ticaret yollarının kapanması"
      ],
      cozum: "Kırım, Karadeniz hâkimiyeti için stratejik konumdaydı; kuzeyde savunma alanı oluşturarak imparatorluğun sınırlarını Ruslara ve Leh-Litvanyalılara karşı korumuştur (s.217).",
      fc: ["Kırım'ın Osmanlı için önemi nedir?", "Karadeniz hâkimiyeti ve kuzey sınırlarının güvenliği."]
    },
    {
      bi: 0,
      metin: "1514'te Safevi ordusunun yenilgiye uğratıldığı savaş hangisidir?",
      secenekler: ["Çaldıran", "Otlukbeli", "Ridaniye", "Mohaç"],
      cozum: "Çaldıran Savaşı'nda top ve tüfek kullanan Osmanlı ordusu, yalnız süvarilerden oluşan Safevi ordusunu bozguna uğratmıştır (s.221).",
      fc: ["Çaldıran Savaşı'nın sonucu nedir?", "Doğu Anadolu'nun Osmanlı'ya katılması ve Safevi tehdidinin kısmen kalkması."]
    },
    {
      bi: 0,
      metin: "Yavuz Sultan Selim'in Mısır seferi sonunda Mekke ve Medine'nin koruyuculuğunu ifade eden unvanı hangisidir?",
      secenekler: ["Hâdimü'l-Haremeyn", "Sultanü'l-berr ve'l-bahr", "Şehinşah", "Emîrü'l-ümerâ"],
      cozum: "Resmî belgelerde Yavuz Sultan Selim, Mekke ve Medine'nin koruyucusu (hizmetçisi) anlamında hâdimü'l-Haremeyn unvanıyla anılmıştır (s.221).",
      fc: ["Hâdimü'l-Haremeyn ne demektir?", "Mekke ve Medine'nin hizmetçisi, koruyucusu anlamında unvan."]
    },
    {
      bi: 1,
      metin: "1492'de İspanya'dan sürülen Yahudilerin Osmanlı ülkesine kabul edilmesi hangi değerin göstergesidir?",
      secenekler: [
        "Zulüm altındaki insanlara kucak açan hoşgörü ve adalet anlayışının",
        "Yalnız ticari kazanç hedefinin",
        "Askerî güç gösterisi yapılmasının",
        "Avrupa devletleriyle ittifak kurulmasının"
      ],
      cozum: "Osmanlılar yalnız Müslümanlara değil zulüm altındaki Yahudilere de yardım eli uzatmış, İstanbul ve Selanik gibi şehirlere yerleştirmiştir (s.219-220).",
      fc: ["1492 Yahudi göçü nedir?", "İspanya'dan sürülen Yahudilerin Osmanlı topraklarına kabul edilmesi."]
    },
    {
      bi: 1,
      metin: "Mohaç Savaşı (1526) sonrasında Osmanlı'nın Orta Avrupa'daki asıl rakibi hangi hanedan olmuştur?",
      secenekler: ["Habsburglar", "Capet Hanedanı", "Romanovlar", "Piast Hanedanı"],
      cozum: "Mohaç sonrasında Macarların yerini Habsburglar almış, Macaristan toprakları üzerinde Osmanlılarla Habsburglar arasında 150 yıl sürecek mücadele başlamıştır (s.224).",
      fc: ["Habsburg Hanedanı nedir?", "Kutsal Roma-Germen İmparatorluğu'nu yöneten Avusturya kökenli hanedan."]
    },
    {
      bi: 1,
      metin: "Preveze Deniz Savaşı'nın (1538) Osmanlı denizciliği açısından sonucu hangisidir?",
      secenekler: [
        "Akdeniz'de üstünlüğün Osmanlı'ya geçmesi",
        "Osmanlı donanmasının tümüyle yok olması",
        "Kıbrıs'ın Venedik'e bırakılması",
        "Karadeniz ticaretinin durması"
      ],
      cozum: "Preveze'de kazanılan zaferle Hristiyan dünyası Akdeniz'deki hâkimiyetini kaybetmiş, Osmanlılar tam anlamıyla deniz siyasetinin içine girmiştir (s.227).",
      fc: ["Preveze Deniz Savaşı nedir?", "1538'de Barbaros'un müttefik Haçlı donanmasını yendiği deniz savaşı."]
    },
    {
      bi: 1,
      metin: "Tabloda 1453-1683 yılları arasında imzalanan bazı antlaşmalar ve sonuçları verilmiştir. Bugünkü Türkiye-Irak sınırının temelini oluşturan antlaşma hangisidir?",
      secenekler: ["Kasr-ı Şirin", "Bucaş", "Ferhat Paşa", "Amasya"],
      gorsel: {
        tip: "tablo",
        basliklar: ["Antlaşma", "Yıl", "Sonuç"],
        satirlar: [
          ["Amasya", "1555", "İran sınırında geçici bir denge kuruldu"],
          ["Ferhat Paşa", "1590", "Doğuda en geniş sınırlara ulaşıldı"],
          ["Zitvatorok", "1606", "Avusturya ile eşit statüde antlaşma yapıldı"],
          ["Kasr-ı Şirin", "1639", "Doğu sınırı bugünkü Türkiye-Irak hattına oturdu"]
        ]
      },
      cozum: "Kasr-ı Şirin Antlaşması'yla Irak toprakları Bağdat dâhil Osmanlı'da kalmış, Revan ve Azerbaycan Safevilere bırakılmış; tablodaki bu sonuç doğu sınırının esasını oluşturmuştur (s.231).",
      fc: ["Kasr-ı Şirin Antlaşması nedir?", "1639'da Osmanlı-Safevi sınırını belirleyen antlaşma."]
    }
  ]
});

yazKonu({
  konu_id: "tar_10_u03_k11",
  ders: DERS, tema: 3, tema_adi: "Cihan Devleti Osmanlı (1453-1683)",
  baslik: "3.2 Osmanlı Devleti'nin Yönetim ve Ordu Yapısında Değişim",
  kazanim: "1453-1683 yılları arasında Osmanlı Devleti'nin yönetim ve ordu yapısında meydana gelen değişim ve sürekliliği değerlendirir.",
  kaynak: kaynak("235-256"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Merkez ve taşra yönetimi ile divanın işleyişini açıklar.",
    "Yönetim ve veraset uygulamalarındaki değişimin etkilerini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "Fatih Sultan Mehmet'in yönetim teşkilatını yeniden düzenlediği ve geleneksel uygulamaları yazılı hâle getirdiği düzenleme hangisidir?",
      secenekler: [
        "Fatih Kanunnamesi",
        "Tanzimat Fermanı",
        "Sened-i İttifak",
        "Kanun-i Esasi"
      ],
      cozum: "Fatih Kanunnamesi'yle yönetim teşkilatı yeniden organize edilip sağlamlaştırılmış, gelenekleşmiş uygulamalar değişiklik ve düzenlemelerle yazılı hâle getirilmiştir (s.240).",
      fc: ["Fatih Kanunnamesi nedir?", "Yönetim teşkilatı ve protokolü yazılı hâle getiren düzenleme."]
    },
    {
      bi: 0,
      metin: "Dîvân-ı Hümâyunda padişahın onayladığı belgelere tuğra çekme yetkisi hangi görevliye aittir?",
      secenekler: ["Nişancı", "Defterdar", "Kazasker", "Veziriazam"],
      cozum: "Nişancı, divanda kendisine sunulan ve padişahın onayladığı belgelerin altına padişahın tuğrasını çekerdi (s.247).",
      fc: ["Tuğra nedir?", "Padişahın adını ve unvanını içeren özgün imza/nişan."]
    },
    {
      bi: 0,
      metin: "Osmanlı Devleti'nde mali işlerin yürütülmesinden sorumlu divan üyesi hangisidir?",
      secenekler: ["Defterdar", "Nişancı", "Şeyhülislam", "Yeniçeri ağası"],
      cozum: "Defterdar mali işleri yürütürdü; Fatih Kanunnamesi'ne göre maliyede padişah adına emir yazma yetkisi defterdarlara verilmiştir (s.243, 247).",
      fc: ["Defterdar nedir?", "Devletin gelir ve giderlerini tutan maliye görevlisi."]
    },
    {
      bi: 0,
      metin: "Osmanlı Devleti'nde eğitim ve hukuk işlerini denetleyen divan üyesi hangisidir?",
      secenekler: ["Şeyhülislam", "Veziriazam", "Kaptan paşa", "Kazasker"],
      cozum: "Divanda şeyhülislam eğitim ve hukuk işleriyle ilgili yetkilere sahipti; kazaskerler ise yargısal konularda görev yapardı (s.236, 247).",
      fc: ["Şeyhülislam nedir?", "Dini ve hukuki konularda en yüksek yetkili görevli."]
    },
    {
      bi: 0,
      metin: "Şehzadelerin on bir-on iki yaşlarında sancak beyi olarak gönderildiği uygulamanın amacı hangisidir?",
      secenekler: [
        "Yönetim tecrübesi kazanmalarını sağlamak",
        "Askerlikten uzak durmalarını sağlamak",
        "Tahta çıkma haklarını kaldırmak",
        "Doğrudan veziriazam olmalarını sağlamak"
      ],
      cozum: "Şehzadeler merkezden ve birbirlerinden uzak şekilde, annelerinin ve lalalarının gözetiminde sancaklarda yönetim tecrübesi kazanırdı (s.242).",
      fc: ["Sancağa çıkma nedir?", "Şehzadelerin yönetim tecrübesi için sancaklara gönderilmesi."]
    },
    {
      bi: 1,
      metin: "Fatih Dönemi'nde veziriazamların güçlü Türk aileleri yerine kul sınıfından seçilmesinin temel amacı hangisidir?",
      secenekler: [
        "Merkezî otoriteyi güçlendirip padişaha bağlı bir bürokrasi kurmak",
        "Taşradaki Türkmen beylerini memnun etmek",
        "Divan toplantılarını kaldırmak",
        "Yeniçeri Ocağı'nı denetimden çıkarmak"
      ],
      cozum: "Fatih, devşirme kökenli kullarını valilerden vergi tahsildarlarına kadar her kademede görevlendirerek merkezî ve mutlak bir yönetim kurmuştur (s.241, 243).",
      fc: ["Kul sınıfı nedir?", "Devşirme yoluyla yetiştirilip devlet görevine getirilen sınıf."]
    },
    {
      bi: 1,
      metin: "Fatih Kanunnamesi'ndeki kardeş katli maddesinin dayanağı hangisidir?",
      secenekler: [
        "\"Nizam-ı âlem için\" devletin düzeninin korunması",
        "Tımarlı sipahilerin talebi",
        "Şeyhülislamın fetvası",
        "Yeniçerilerin ocak kanunu"
      ],
      cozum: "Kanunnamede yer alan \"Her kimesneye evladımdan saltanat müyesser ola, karındaşların nizam-ı âlem için katl itmek münasiptir.\" maddesi kardeş katlini yasallaştırmıştır (s.243).",
      fc: ["Nizam-ı âlem nedir?", "Devlet ve toplum düzeninin korunması anlayışı."]
    },
    {
      bi: 1,
      metin: "I. Ahmet Dönemi'nde uygulanmaya başlanan ekber ve erşed sistemi neyi ifade eder?",
      secenekler: [
        "Hanedanın en büyük ve en olgun üyesinin tahta çıkmasını",
        "Padişahın oğlunun tahta çıkmasını",
        "Yeniçerilerin padişah seçmesini",
        "Divanın padişahı belirlemesini"
      ],
      cozum: "Ekber ve erşed sistemi, en büyük şehzadenin tahta çıkması esasına dayanır; bu sistemle taht kavgaları azalmış ancak şehzadeler saray içinde dış dünyadan kopuk yaşamıştır (s.248).",
      fc: ["Ekber ve erşed nedir?", "Hanedanın en büyük ve olgun üyesinin tahta geçmesi kuralı."]
    },
    {
      bi: 1,
      metin: "Sancağa çıkma uygulamasının kaldırılmasının ortaya çıkardığı durum hangisidir?",
      secenekler: [
        "Şehzadelerin saray içinde dış dünyadan kopuk yaşadığı kafes sistemi",
        "Şehzadelerin divan üyesi olması",
        "Taht kavgalarının artarak sürmesi",
        "Şehzadelerin ordu komutanı olması"
      ],
      cozum: "Sancağa çıkma uygulamasının bitmesi ve ekberiyetin benimsenmesiyle kafes sistemi ortaya çıkmış, şehzadeler saray içinde dış dünyadan kopuk yaşamıştır (s.248).",
      fc: ["Kafes sistemi nedir?", "Şehzadelerin sarayda dış dünyadan kopuk tutulması uygulaması."]
    },
    {
      bi: 1,
      metin: "Cülus töreninde devlet adamlarının yeni sultana biat etmesinin işlevi hangisidir?",
      secenekler: [
        "Yeni padişahın meşruiyetinin kabul edilmesi",
        "Divanın kapatılması",
        "Şehzadelerin sancağa gönderilmesi",
        "Yeniçerilerin maaşlarının kesilmesi"
      ],
      cozum: "1421'den itibaren tahta çıkıştaki en önemli unsur, devlet ileri gelenlerinin yeni padişaha biat ederek onun meşruiyetini kabul etmesi olmuştur (s.242).",
      fc: ["Biat nedir?", "Yeni hükümdarın egemenliğini kabul edip bağlılık bildirme."]
    }
  ]
});

yazKonu({
  konu_id: "tar_10_u03_k12",
  ders: DERS, tema: 3, tema_adi: "Cihan Devleti Osmanlı (1453-1683)",
  baslik: "3.3 Avrupalıların Sömürgeci Politikaları",
  kazanim: "XV-XVIII. yüzyıllardaki coğrafi keşiflerin, sömürgeciliğin ve Avrupa'daki düşünsel dönüşümün dünya tarihine etkilerini değerlendirir.",
  kaynak: kaynak("257-269"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Keşif ve sömürgecilik faaliyetlerinin nedenlerini açıklar.",
    "Sömürgeciliğin ve düşünsel dönüşümün etkilerini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "Avrupalıları yeni ticaret yolları aramaya iten temel neden hangisidir?",
      secenekler: [
        "İpek ve Baharat yollarının Müslüman devletlerin kontrolünde olması",
        "Avrupa'da tarımın tamamen bitmesi",
        "Akdeniz limanlarının depremle yıkılması",
        "Kâğıt ve barutun Avrupa'da bilinmemesi"
      ],
      cozum: "Osmanlı ve diğer Müslüman devletlerin ticaret yollarını kontrol etmesi Avrupa'nın doğu ticaretini zorlaştırmış, maliyetleri artırmış ve yeni yol arayışına yol açmıştır (s.259).",
      fc: ["Baharat Yolu nedir?", "Doğu'dan Avrupa'ya baharat taşıyan tarihî ticaret güzergâhı."]
    },
    {
      bi: 0,
      metin: "1488'de Ümit Burnu'nu keşfederek Hindistan'a giden deniz yolu için önemli bir adım atan denizci kimdir?",
      secenekler: ["Bartolomeu Dias", "Vasco de Gama", "Kristof Kolomb", "Pedro Alvares Cabral"],
      cozum: "Bartolomeu Dias'ın 1488'de Ümit Burnu'nu keşfetmesi, Hindistan'a giden deniz yolu için dönüm noktası olmuştur (s.260).",
      fc: ["Ümit Burnu nedir?", "Afrika'nın güney ucundaki, Hindistan yolunu açan deniz geçidi."]
    },
    {
      bi: 0,
      metin: "1498'de Ümit Burnu'nu geçerek Hindistan'ın Kalikut Limanı'na ulaşan denizci kimdir?",
      secenekler: ["Vasco de Gama", "Bartolomeu Dias", "Ferdinand Magellan", "James Cook"],
      cozum: "Vasco de Gama'nın 1498'de Kalikut'a ulaşması Portekiz'in baharat ticaretinde ve sömürgecilik faaliyetlerinde güç kazanmasını sağlamıştır (s.260).",
      fc: ["Kalikut nedir?", "Hindistan'ın batı kıyısında, baharat ticaretinin önemli limanı."]
    },
    {
      bi: 0,
      metin: "İspanya'nın köle ticaretini Portekizli ve Hollandalı tüccarlara bırakırken kullandığı lisans sistemine ne ad verilir?",
      secenekler: ["Asiento", "Kapitülasyon", "Mukataa", "Encomienda"],
      cozum: "İspanyollar köle ticaretinin büyük bölümünü Portekizli ve Hollandalı tüccarlara devrederken asiento adı verilen bir sistemle bu tüccarlara lisans vermiştir (s.262).",
      fc: ["Asiento nedir?", "İspanya'nın köle ticareti için tüccarlara verdiği lisans."]
    },
    {
      bi: 0,
      metin: "Rönesans'ın doğduğu ve Medici ailesinin sanatçıları desteklediği İtalyan şehri hangisidir?",
      secenekler: ["Floransa", "Venedik", "Napoli", "Milano"],
      cozum: "Rönesans 15. yüzyılın başlarında Floransa'da başlamış; Medici ailesi Michelangelo, Leonardo da Vinci gibi sanatçıları desteklemiştir (s.265-266).",
      fc: ["Medici ailesi nedir?", "Floransa'da bankacılıkla zenginleşip sanatçıları destekleyen aile."]
    },
    {
      bi: 1,
      metin: "Kolomb'un keşiflerinin ardından Amerika'daki İnka ve Aztek uygarlıklarının yıkılmasının temel nedeni hangisidir?",
      secenekler: [
        "Altın ve gümüş kaynaklarının sömürülmesi amacıyla yapılan işgaller",
        "Bölgede yazının hiç kullanılmaması",
        "Yerli halkların göçebe olması",
        "Avrupalıların bölgeyi hiç tanımaması"
      ],
      cozum: "Kolomb'un Amerika'ya ulaşması sonrasında İnka ve Aztekler gibi büyük uygarlıklar yıkılmış, değerli madenlerin sömürülmesiyle İspanya Avrupa'nın en büyük ekonomik gücü hâline gelmiştir (s.261).",
      fc: ["Sömürgecilik nedir?", "Bir devletin başka toprakları işgal edip kaynaklarını kendi çıkarına kullanması."]
    },
    {
      bi: 1,
      metin: "Atlantik köle ticaretinde en fazla kölenin götürüldüğü bölge hangisidir?",
      secenekler: ["Brezilya", "Kuzey Amerika", "Küba", "Filipinler"],
      cozum: "Afrika'dan kaçırılan insanların yaklaşık %40'ı Portekiz sömürgesi Brezilya'ya götürülmüş, böylece Brezilya köle ticaretinin en büyük alıcısı olmuştur (s.263).",
      fc: ["Transatlantik köle ticareti nedir?", "Afrikalıların zorla Amerika kıtasına taşınıp köle olarak çalıştırılması."]
    },
    {
      bi: 1,
      metin: "Hümanizm akımının temel özelliği hangisidir?",
      secenekler: [
        "Hayatın merkezine toplum yerine insanı koyması",
        "Kilise öğretilerini tartışılmaz kabul etmesi",
        "Sanatta yalnız dinî konuların işlenmesini istemesi",
        "Ticaretin tümüyle yasaklanmasını savunması"
      ],
      cozum: "Hümanizm, değer ölçüsü olarak insanı temel alan, insanın her yönden gelişmesini savunan ve Rönesans'ı şekillendiren akımdır (s.264).",
      fc: ["Hümanizm nedir?", "İnsanı değer ölçüsü kabul eden düşünce akımı."]
    },
    {
      bi: 1,
      metin: "Gutenberg'in geliştirdiği matbaanın Avrupa'da yol açtığı sonuç hangisidir?",
      secenekler: [
        "Okuma eyleminin kilise mensuplarının dışına taşıp topluma yayılması",
        "El yazması kitapların değerinin artıp çoğalması",
        "Latincenin kiliselerde yasaklanması",
        "Üniversitelerin kapanıp eğitimin durması"
      ],
      cozum: "Matbaa sayesinde okuma eylemi kilise mensuplarının faaliyeti olmaktan çıkmış, özgür düşünce gelişmiş ve bilimsel araştırmalar çeşitlenmiştir (s.267).",
      fc: ["Matbaa nedir?", "Hareketli harflerle seri kitap basımını sağlayan buluş."]
    },
    {
      bi: 1,
      metin: "1517'de doksan beş maddelik bildiriyi yayımlayarak Reform hareketini başlatan kişi kimdir?",
      secenekler: ["Martin Luther", "Johannes Gutenberg", "Niccolo Machiavelli", "Galileo Galilei"],
      cozum: "Alman keşiş ve ilahiyatçı Martin Luther, Wittenberg Şatosu'ndaki kilisenin kapısına doksan beş maddelik bildiriyi asarak Reform hareketini başlatmıştır (s.268).",
      fc: ["Reform nedir?", "Katolik Kilisesi'nin uygulamalarına karşı başlayan yeniden düzenleme hareketi."]
    }
  ]
});

yazKonu({
  konu_id: "tar_10_u03_k13",
  ders: DERS, tema: 3, tema_adi: "Cihan Devleti Osmanlı (1453-1683)",
  baslik: "3.4 Osmanlı Devleti'nde İsyanlar",
  kazanim: "1453-1683 yılları arasında Osmanlı Devleti'nde yaşanan isyanların nedenlerini ve devlet yapısına etkilerini değerlendirir.",
  kaynak: kaynak("270-283"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "İsyanların nedenlerini ve türlerini açıklar.",
    "İsyanların merkezî otorite ve toplum düzenine etkisini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "Celâli İsyanları adı hangi olaydan hareketle kullanılmaya başlanmıştır?",
      secenekler: [
        "1519'da Tokat civarında isyan eden Bozoklu Şeyh Celâl'den",
        "1446'daki Buçuktepe Vakası'ndan",
        "1511'deki Şahkulu İsyanı'ndan",
        "1622'de Genç Osman'ın katlinden"
      ],
      cozum: "Yavuz Sultan Selim Dönemi'nde kendini mehdi ilan eden Bozoklu Şeyh Celâl'in 1519'da çıkardığı isyandan hareketle dönemin isyanlarına Celâli İsyanları adı verilmiştir (s.277).",
      fc: ["Celâli İsyanları nedir?", "XVI-XVII. yüzyıllarda Anadolu'da çıkan ayaklanmaların genel adı."]
    },
    {
      bi: 0,
      metin: "Osmanlı tarihindeki ilk yeniçeri isyanı hangisidir?",
      secenekler: ["Buçuktepe Vakası", "Beylerbeyi Vakası", "Çınar Vakası", "Şahkulu İsyanı"],
      cozum: "Osmanlı tarihindeki ilk yeniçeri isyanı 1446'da gerçekleşen Buçuktepe Vakası'dır; akçenin değerinin düşürülmesi huzursuzluğu artırmıştır (s.274).",
      fc: ["Buçuktepe Vakası nedir?", "1446'da yaşanan ilk yeniçeri isyanı."]
    },
    {
      bi: 0,
      metin: "Yeniçerilerin isyanlarını yemek kazanlarını devirerek başlatması hangi deyimle anılır?",
      secenekler: ["Kazan kaldırma", "Çift bozma", "Kafes usulü", "Beşik ulemalığı"],
      cozum: "Yeniçeriler isyanlarını yemek kazanlarını devirerek başlatmış, bu durum tarihte \"kazan kaldırma\" olarak adlandırılmıştır (s.274).",
      fc: ["Kazan kaldırma nedir?", "Yeniçerilerin kazan devirerek isyan başlatması."]
    },
    {
      bi: 0,
      metin: "Tabloda Osmanlı akçesinin gümüş içeriği ve kur değerinin yıllara göre değişimi verilmiştir. Akçenin değerli maden içeriğinin bu biçimde düşürülmesine ne ad verilir?",
      secenekler: ["Tağşiş", "İltizam", "Müsadere", "Mukataa"],
      gorsel: {
        tip: "tablo",
        basliklar: ["Yıl", "Gümüş içeriği (gr)", "Kur değeri (1 duka = akçe)"],
        satirlar: [
          ["1481", "0,77", "114,9"],
          ["1588", "0,38", "45,0"],
          ["1669", "0,23", "24,0"]
        ]
      },
      cozum: "Tablo 3.6'daki düşüş, devletin dolaşımdaki sikkeleri toplayıp içindeki değerli maden oranını azaltarak yeniden basmasının sonucudur; bu uygulamaya tağşiş denir ve III. Murad Dönemi'nde isyana yol açmıştır (s.273-275).",
      fc: ["Tağşiş nedir?", "Sikkenin içindeki değerli maden oranının düşürülmesi."]
    },
    {
      bi: 0,
      metin: "Vergi toplama işinin açık artırmayla belirlenen kişilere devredilmesine ne ad verilir?",
      secenekler: ["İltizam", "Tımar", "Çifthane", "Avarız"],
      cozum: "İltizam sisteminde devlet, vergi toplama işini mültezim adı verilen kişilere 1-3 yıllığına devrederdi (s.277).",
      fc: ["Mültezim nedir?", "Vergi toplama hakkını açık artırmayla alan kişi."]
    },
    {
      bi: 1,
      metin: "XVI. yüzyıl sonlarında tımarlı sipahilerin sayısının azalmasında etkili olan gelişme hangisidir?",
      secenekler: [
        "Ateşli silahlarla donatılmış ücretli askerlerin orduda kullanılması",
        "Tımar gelirlerinin sürekli artması",
        "Sipahilerin vergiden muaf tutulması",
        "Çifthane sisteminin kaldırılması"
      ],
      cozum: "Ateşli silahlara ve modern savaş taktiklerine uyum sağlayamayan tımarlı sipahiler yerlerini sekban, sarıca ve levent gibi ücretli askerlere bırakmıştır (s.276).",
      fc: ["Sekban nedir?", "Tımarlı sipahilerin yerini alan ücretli, ateşli silahlı asker."]
    },
    {
      bi: 1,
      metin: "1622'de yeniçerilerin ve sipahilerin birleşerek sarayı basması sonucunda hangi padişah katledilmiştir?",
      secenekler: ["II. Osman (Genç Osman)", "IV. Murad", "I. Mustafa", "III. Mehmet"],
      cozum: "Yeniçeri Ocağı'nı kaldırma ve başkenti Anadolu'ya taşıma planı duyulan Genç Osman, 1622'de sarayı basan isyancılar tarafından Yedikule zindanlarında katledilmiştir (s.275-276).",
      fc: ["Genç Osman'ın ıslahat planı nedir?", "Yeniçeri Ocağı'nı kaldırıp disiplinli bir ordu kurmak."]
    },
    {
      bi: 1,
      metin: "IV. Mehmet Dönemi'nde devlet görevlilerinin idam edilip teşhir edilmesiyle anılan olay hangisidir?",
      secenekler: ["Çınar Vakası", "Beylerbeyi Vakası", "Buçuktepe Vakası", "Vaka-i Vakvakiye Olayı'nın sonucu"],
      cozum: "Mali kriz ve düşük ayarlı akçe nedeniyle ayaklanan yeniçeri ve sipahiler otuz kişinin idamını istemiş, idam edilenlerin teşhir edilmesi nedeniyle olay Çınar Vakası olarak anılmıştır (s.276).",
      fc: ["Çınar Vakası nedir?", "IV. Mehmet Dönemi'nde isyancıların istediği idamların yapıldığı olay."]
    },
    {
      bi: 1,
      metin: "Celâli İsyanları sırasında köylülerin topraklarını terk ederek şehirlere göç etmesine ne ad verilir?",
      secenekler: ["Büyük Kaçgun", "Çift bozma", "Kazan kaldırma", "Sürgün"],
      cozum: "Tarım arazilerini terk eden köylü sınıfının şehirlere göç etmesiyle yaşanan geniş çaplı göç hareketine Büyük Kaçgun denmiştir (s.278).",
      fc: ["Büyük Kaçgun nedir?", "Celâli isyanları sırasında köylülerin şehirlere göç etmesi."]
    },
    {
      bi: 1,
      metin: "Medrese öğrencilerinin isyanlarına yol açan \"beşik ulemalığı\" uygulaması neyi ifade eder?",
      secenekler: [
        "İlmiye mensuplarının çocuklarının kadılık ve müderrislik kadrolarına atanmasını",
        "Medreselerde eğitimin tümüyle ücretsiz hâle getirilmesini",
        "Medrese öğrencilerinin sancaklara gönderilmesini",
        "Kadıların divan toplantılarına katılıp oy kullanmasını"
      ],
      cozum: "Beşik ulemalığı, ilmiye sınıfına mensup kişilerin erkek çocuklarının küçük yaşta kadılık, müftülük ve müderrislik kadrolarına atanmasıdır; bu durum suhte isyanlarının nedenleri arasındadır (s.279).",
      fc: ["Suhte isyanları nedir?", "Medrese öğrencilerinin eşkıyalığa varan ayaklanmaları."]
    }
  ]
});

yazKonu({
  konu_id: "tar_10_u03_k14",
  ders: DERS, tema: 3, tema_adi: "Cihan Devleti Osmanlı (1453-1683)",
  baslik: "3.5 Osmanlı Devleti'nde Bilim, Kültür, Eğitim ve Sanat",
  kazanim: "1453-1683 yılları arasında Osmanlı Devleti'nde bilim, kültür, eğitim ve sanat alanlarındaki gelişmeleri ve bunların ortak kültürel mirasa katkısını değerlendirir.",
  kaynak: kaynak("284-317"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Bilim, eğitim ve sanat kurumları ile önemli temsilcilerini açıklar.",
    "Osmanlı bilim ve sanat birikiminin kültürel mirasa etkisini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "Fatih Sultan Mehmet'in hocalığını yapan, tıp alanında eserler veren ve İstanbul'un fethinde manevi desteğiyle öne çıkan âlim kimdir?",
      secenekler: ["Akşemseddin", "Ali Kuşçu", "Sabuncuoğlu Şerefeddin", "Takıyyüddin er-Râsıd"],
      cozum: "Akşemseddin hem Fatih'in hocası hem de tıp alanında eser veren bir âlimdir; kuşatmanın sıkıntılı anlarında padişaha yazdığı mektuplarla manevi güç vermiştir (s.299-300).",
      fc: ["Akşemseddin'in alanı nedir?", "Tıp ve tasavvuf; Fatih'in hocalığını da yapmıştır."]
    },
    {
      bi: 0,
      metin: "1577'den itibaren Tophane sırtlarında kurduğu rasathanede gözlemler yapan müneccimbaşı kimdir?",
      secenekler: ["Takıyyüddin er-Râsıd", "Ali Kuşçu", "Kâtip Çelebi", "Matrakçı Nasuh"],
      cozum: "II. Selim tarafından müneccimbaşılığa tayin edilen Takıyyüddin er-Râsıd, Galata Kulesi'ndeki gözlemlerini 1577'den sonra Tophane sırtlarındaki rasathanede sürdürmüştür (s.290).",
      fc: ["Rasathane nedir?", "Gök gözlemleri yapılan, astronomi aletlerinin bulunduğu kurum."]
    },
    {
      bi: 0,
      metin: "Tabloda Osmanlı bilim ve sanat hayatından kişiler, eserleri ve alanlarıyla verilmiştir. Klasik Türk müziği alanında eser veren kişi hangisidir?",
      secenekler: ["Itri (Buhurizade Mustafa)", "Piri Reis", "Takıyyüddin er-Râsıd", "Akşemseddin"],
      gorsel: {
        tip: "tablo",
        basliklar: ["Kişi", "Eser", "Alan"],
        satirlar: [
          ["Piri Reis", "Kitab-ı Bahriye", "Denizcilik"],
          ["Takıyyüddin er-Râsıd", "Tophane rasathane gözlemleri", "Astronomi"],
          ["Itri", "Segâh Bayram Tekbiri", "Müzik"],
          ["Akşemseddin", "Tıp risaleleri", "Tıp"]
        ]
      },
      cozum: "Tabloda Segâh Bayram Tekbiri adlı eseriyle Itri klasik Türk müziği alanında yer alır; Piri Reis denizcilik, Takıyyüddin er-Râsıd astronomi, Akşemseddin ise tıp alanındadır (s.290, 301).",
      fc: ["Kitab-ı Bahriye nedir?", "Piri Reis'in Akdeniz liman ve kıyılarını anlatan eseri."]
    },
    {
      bi: 0,
      metin: "1462-1469 yılları arasında Fatih Sultan Mehmet tarafından yaptırılan ve akli-naklî bilimlerin birlikte okutulduğu medrese hangisidir?",
      secenekler: ["Sahn-ı Semân Medreseleri", "Süleymaniye Medreseleri", "İznik Orhaniye Medresesi", "Haliliye Medresesi"],
      cozum: "Sahn-ı Semân Medreselerinde akli ve naklî bilimler birlikte okutulmuş, Osmanlı yükseköğretim hayatında yeni bir dönem başlamıştır (s.292).",
      fc: ["Sahn-ı Semân nedir?", "Fatih'in kurduğu, akli ve nakli bilimler okutan yüksek medreseler."]
    },
    {
      bi: 0,
      metin: "Klasik Türk müziğinin kurucusu kabul edilen ve Segâh Bayram Tekbiri'ni besteleyen sanatçı kimdir?",
      secenekler: ["Itri (Buhurizade Mustafa)", "Nabi (Yusuf Nabi)", "Matrakçı Nasuh Bey", "Kâtip Çelebi (Mustafa)"],
      cozum: "Buhurizade Mustafa Efendi (Itri), klasik Türk müziğinin kurucusu kabul edilir; Segâh Bayram Tekbiri dünyanın dört bir yanında okunmaya devam etmektedir (s.286-287).",
      fc: ["Segâh Bayram Tekbiri nedir?", "Itri'nin bayram ve önemli günlerde okunan tekbir bestesi."]
    },
    {
      bi: 1,
      metin: "Fatih Dönemi'nde İstanbul'a getirilerek astronomi ve matematik çalışmalarına destek verilen âlim kimdir?",
      secenekler: ["Ali Kuşçu", "Akşemseddin", "Sabuncuoğlu Şerefeddin", "Nabi"],
      cozum: "Fatih, Semerkant'ta yetişen astronomi bilgini Ali Kuşçu'yu İstanbul'a getirterek ona geniş çalışma imkânları sunmuştur (s.217, 290).",
      fc: ["Ali Kuşçu'nun alanı nedir?", "Astronomi ve matematik çalışmaları."]
    },
    {
      bi: 1,
      metin: "1551-1557 yılları arasında Kanuni Sultan Süleyman tarafından yaptırılan ve medrese sisteminde önemli düzenlemelere konu olan kurum hangisidir?",
      secenekler: ["Süleymaniye Medreseleri", "Sahn-ı Semân Medreseleri", "Sırçalı Medrese", "Darulkurra"],
      cozum: "Süleymaniye Medreselerinin hizmete girmesiyle medrese sisteminde önemli düzenlemeler yapılmış; bu kurumlarda Osmanlı merkez ve taşra görevlileri yetiştirilmiştir (s.292).",
      fc: ["Süleymaniye Medreseleri nedir?", "Kanuni Dönemi'nde kurulan, medrese sistemini düzenleyen kurumlar."]
    },
    {
      bi: 1,
      metin: "Topkapı Sarayı'nda saray için çalışan sanatkârların bağlı olduğu teşkilata ne ad verilir?",
      secenekler: ["Ehl-i hiref", "Ehl-i zanaat", "Nakkaşhane", "Mehterhane"],
      cozum: "Saray için çalışan sanatkârlar, Topkapı Sarayı'nda ehl-i hiref adlı teşkilat bünyesinde faaliyetlerini yürütürdü (s.293).",
      fc: ["Ehl-i hiref nedir?", "Saray için çalışan sanatkârların bağlı olduğu teşkilat."]
    },
    {
      bi: 1,
      metin: "Osmanlı Devleti'nde resmî törenlerde, seferlerde ve savaş öncesinde icra edilen askerî müziğe ne ad verilir?",
      secenekler: ["Mehter", "Segâh", "Kâr", "Peşrev"],
      cozum: "Resmî törenlerde, bayramlarda, seferlerde ve savaş öncesinde yaygın olarak mehter icra edilir, müziğin eğitimi için mehterhaneler inşa edilirdi (s.293).",
      fc: ["Mehter nedir?", "Osmanlı'da resmî tören ve seferlerde çalınan askerî müzik."]
    },
    {
      bi: 1,
      metin: "Osmanlı bilim ve sanat birikiminin günümüz açısından önemi hangisinde doğru ifade edilmiştir?",
      secenekler: [
        "Osmanlı topraklarındaki ülkelerin ve Türkiye'nin ortak kültürel mirasını oluşturması",
        "Yalnız İstanbul'da yaşayan toplulukları ilgilendiren yerel bir birikim olması",
        "Yalnız askerî alandaki düzenlemelerle sınırlı kalması",
        "Dönemin saray çevresiyle sınırlı, halka ulaşmayan bir çaba olması"
      ],
      cozum: "Osmanlı Dönemi'nde bilim, kültür, eğitim ve sanat alanlarında yapılan faaliyetler, bugün Osmanlı topraklarında varlığını sürdüren ülkelerin ve Türkiye'nin ortak kültürel mirasıdır (s.287).",
      fc: ["Ortak kültürel miras nedir?", "Osmanlı coğrafyasındaki halkların birlikte ürettiği ve devraldığı kültürel birikim."]
    }
  ]
});
