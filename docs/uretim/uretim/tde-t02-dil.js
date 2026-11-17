#!/usr/bin/env node
/* ============================================================
   TDE · 2. TEMA — DİL BİLGİSİ konu havuzları
   ------------------------------------------------------------
   Kaynak: 10. sınıf TDE ders notları (Mustafa Çiftçi)
     edebiyat_10_u02_k05  Zamir (Adıl)             s.92-98
     edebiyat_10_u02_k06  Edat (İlgeç)             s.99-103
     edebiyat_10_u02_k07  Bağlaç                   s.104-107
     edebiyat_10_u02_k08  Ünlem                    s.108
     edebiyat_10_u02_k09  Anlamına Göre Cümleler   s.68-70
   Kullanım: node docs/uretim/uretim/tde-t02-dil.js
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

/* ---------------- 5) ZAMİR (ADIL) ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u02_k05",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Zamir (Adıl)",
  kazanim:
    "Zamirleri tür, yapı ve işlev bakımından çözümleyebilme.",
  kaynak: kaynak("92-98"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Sözcük hâlindeki zamirleri türlerine göre sınıflandırır.",
    "Ek hâlindeki zamirleri (ilgi, iyelik) ayırt eder.",
    "Zamirleri yapı bakımından çözümler ve benzer türlerden ayırır."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Bir konuşmada \"Ben yarın seninle geleceğim.\" denildiğinde konuşan kişi kendi adı yerine \"ben\", karşısındakinin adı yerine \"sen\" sözcüğünü kullanmıştır. Bu iki sözcük hangi zamir türüne girer?",
      secenekler: ["Kişi zamiri", "İşaret zamiri", "Belgisiz zamir", "Soru zamiri"],
      cozum:
        "Kişi adları yerine kullanılan ben, sen, o, biz, siz, onlar kişi (şahıs) zamiridir.",
      fc: [
        "Kişi zamiri nedir?",
        "Kişi adları yerine kullanılan zamirdir: ben, sen, o, biz, siz, onlar."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir metinde geçen \"herkes, kimse, bazıları, başkası\" sözcükleri, hangi adın yerini tuttukları tam olarak belli olmayan sözcüklerdir. Bu sözcükler hangi zamir türüdür?",
      secenekler: ["Belgisiz zamir", "Kişi zamiri", "Dönüşlülük zamiri", "İlgi zamiri"],
      cozum:
        "Hangi adın yerini tuttuğu tam olarak belli olmayan zamirler belgisiz zamirdir; herkes, kimse, biri, çoğu, başkası gibi.",
      fc: [
        "Belgisiz zamir nedir?",
        "Hangi adın yerini tuttuğu tam olarak belli olmayan zamirdir: herkes, kimse, biri, çoğu."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Böylesini görmedim.\" cümlesinde \"böylesini\" sözcüğü, bir adı belirtmeden o adın yerini tutmaktadır. Bu sözcük hangi görevde kullanılmıştır?",
      secenekler: ["İşaret zamiri", "İşaret sıfatı", "Soru zamiri", "Belgisiz zamir"],
      cozum:
        "Adın yerini tutan \"böylesi\" işaret zamiridir. \"Böyle ferman etti\" örneğinde ise bir durumu belirttiği için durum zarfı olur.",
      fc: [
        "İşaret zamiri nedir?",
        "Varlıkları işaret yoluyla karşılayan, adın yerini tutan zamirdir: bu, şu, o, böylesi."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Olaydan sonra hiçbiri beni aramadı.\" cümlesinde \"hiçbiri\" sözcüğü tek başına bir adın yerini tutmaktadır; \"hiçbir şeyden çekmedi\" örneğinde ise bir adı niteler. İlk cümledeki görevi hangisidir?",
      secenekler: ["Belgisiz zamir", "Belgisiz sıfat", "İyelik zamiri", "Kişi zamiri"],
      cozum:
        "İyelik eki almış \"hiçbiri\" adın yerini tuttuğu için belgisiz zamirdir; eki almadığında bir adla tamlama kurup sıfat olur (hiçbir şey).",
      fc: [
        "Belgisiz sözcüğün zamir olma koşulu nedir?",
        "Adın yerini tuttuğunda zamir, bir adı nitelediğinde sıfat olur: hiçbiri (zamir) – hiçbir şey (sıfat)."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Bu yaz hangisine gideceksiniz?\" cümlesinde soru yoluyla bir adın yerini tutan bir sözcük kullanılmıştır. Bu sözcüğün görevi hangisidir?",
      secenekler: ["Soru zamiri", "Soru sıfatı", "Soru zarfı", "Belgisiz zamir"],
      cozum:
        "Soru yoluyla adın yerini tutan sözcükler soru zamiridir: hangisi, neleri, kimi. Bir adı nitelediğinde soru sıfatı (ne tür müzik), \"niçin\" anlamıyla kullanıldığında soru zarfı olur.",
      fc: [
        "Soru zamiri nedir?",
        "Soru yoluyla adın yerini tutan zamirdir: kim, ne, hangisi, neleri."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Bu işin tamamını ben kendim yaptım.\" cümlesinde \"kendim\" sözcüğü, işi yapan kişiyi pekiştirmek için kullanılmıştır. Bu sözcük hangi zamirdir?",
      secenekler: ["Dönüşlülük zamiri", "Kişi zamiri", "İşaret zamiri", "İlgi zamiri"],
      cozum:
        "Dönüşlülük zamiri \"kendi\" sözcüğüdür; iyelik eki alarak kendim, kendin, kendileri biçimlerine girer ve pekiştirmeli özne kurar.",
      fc: [
        "Dönüşlülük zamiri nedir?",
        "\"Kendi\" sözcüğüdür; iyelik eki alarak kendim, kendin, kendileri biçimlerine girer."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Bizimki bugün yine sinirliydi.\" cümlesinde \"-ki\" eki, belirtili isim tamlamasında tamlanan durumundaki adın yerini tutmuştur. Bu ekin görevi hangisidir?",
      secenekler: ["İlgi zamiri", "İyelik zamiri", "Yapım eki", "Durum eki"],
      cozum:
        "Adların yerini tutan \"-ki\" eki ilgi zamiridir ve tamlayana bitişik yazılır: bizimki, sizinki, benimki.",
      fc: [
        "İlgi zamiri nedir?",
        "Adların yerini tutan \"-ki\" ekidir; tamlayana bitişik yazılır: bizimki, sizinki."
      ]
    },
    {
      bi: 2,
      metin:
        "Bir öğrenci \"(Onun) Bilgisayarı benim bilgisayarımdan hızlıydı.\" cümlesindeki eki iyelik eki sayarken, \"Bilgisayarı kullanmayı hiç öğrenemedi.\" cümlesindeki eki belirtme hâl eki saymıştır. Öğrenci bu ayrımı hangi ölçüte dayandırmıştır?",
      secenekler: [
        "Ekin bulunduğu ada \"onun\" getirilip anlam kontrol edilmesine",
        "Ekin ünlüyle mi ünsüzle mi başladığına",
        "Sözcüğün cümledeki yerine",
        "Ekin çokluk eki alıp almamasına"
      ],
      cozum:
        "3. tekil iyelik eki ile belirtme hâl eki karıştırılmamalıdır: ekin alındığı ada \"onun, onların\" getirilir; anlam bozulmuyorsa iyelik, bozuluyorsa hâl ekidir.",
      fc: [
        "İyelik eki ile belirtme hâl ekinin ayrımı nedir?",
        "Ekin bulunduğu ada \"onun, onların\" getirilir; anlam bozulmuyorsa iyelik, bozuluyorsa hâl ekidir."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Öteki beriki, şundan bundan, falan filan, herhangi biri\" gibi birden fazla sözcüğün değişik yollarla öbekleşmesiyle kurulan zamirler hangi yapıdadır?",
      secenekler: ["Öbekleşmiş zamir", "Basit zamir", "Birleşik zamir", "Ek hâlinde zamir"],
      cozum:
        "Birden fazla sözcüğün öbekleşmesiyle kurulan zamirler öbekleşmiş zamirdir. Tek kelimeden oluşanlar basit, hiçbiri ve birçoğu gibi bitişik yazılanlar birleşiktir.",
      fc: [
        "Öbekleşmiş zamir nedir?",
        "Birden fazla sözcüğün öbekleşmesiyle kurulan zamirdir: öteki beriki, falan filan."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir metinde \"ben, sen, o\" sözcükleri yerine \"beni, bana, bende, benden\" biçimleri kullanılmıştır. Bu kullanım zamirlerin hangi özelliğini gösterir?",
      secenekler: [
        "İsim çekim eklerini alabilmeleri",
        "Yalnız tamlayan olabilmeleri",
        "Cümlede yüklem olamamaları",
        "Yapım eki alamamaları"
      ],
      cozum:
        "Zamirler geçici olarak ismin yerini tuttuğu için isim çekim eklerini alabilir: beni, bana, bende, benden; onlar, bunlar; bendim, odur.",
      fc: [
        "Zamirlerin çekim özelliği nedir?",
        "İsmin yerini geçici tuttuğu için isim çekim eklerini alabilir: beni, bana, onlar, bendim."
      ]
    }
  ]
});

/* ---------------- 6) EDAT (İLGEÇ) ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u02_k06",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Edat (İlgeç)",
  kazanim:
    "Edatların anlam ilgilerini, çok görevli sözcüklerden ayrımını ve edat gruplarının işlevini çözümleyebilme.",
  kaynak: kaynak("99-103"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Edatların cümleye kattığı anlam ilgilerini belirler.",
    "Edat olarak da bağlaç olarak da kullanılan sözcükleri ayırt eder.",
    "Edat gruplarının cümledeki görevini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin:
        "\"ev için, adam gibi, masa kadar\" öbeklerinde yer alan sözcükler tek başına anlam taşımaz; kendinden önceki sözcükle öbekleşerek görev kazanır. Bu sözcüklerin türü hangisidir?",
      secenekler: ["Edat", "Bağlaç", "Ünlem", "Zarf"],
      cozum:
        "Tek başına anlamı ve görevi olmayan, kendinden önceki sözcükle öbekleşerek anlam kazanan sözcükler edattır (ilgeç).",
      fc: [
        "Edat nedir?",
        "Tek başına anlamı olmayan, kendinden önceki sözcükle öbekleşerek anlam kazanan sözcüktür."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Bu iş olacak gibi.\" cümlesinde \"gibi\" edatı bir olasılık bildirmektedir. \"Balıklar nar gibi kızardı.\" cümlesinde ise aynı edat hangi anlamı katar?",
      secenekler: ["Benzerlik", "Eşitlik", "Olasılık", "Tezlik"],
      cozum:
        "\"Gibi\" edatı benzerlik, eşitlik, tezlik ve olasılık anlamları katar; \"nar gibi kızardı\" benzerlik ilgisidir.",
      fc: [
        "\"Gibi\" edatının kattığı anlamlar nedir?",
        "Benzerlik, eşitlik, tezlik ve olasılık anlamlarıdır."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Kardeşimle ben size geliyoruz.\" cümlesindeki \"-le\" yerine \"ve\" getirilebildiği hâlde, \"Kapıyı anahtarla açmış.\" cümlesinde getirilememektedir. Buna göre ilk cümledeki \"-le\" hangi görevdedir?",
      secenekler: ["Bağlaç", "Edat", "Zarf", "Ünlem"],
      cozum:
        "\"İle\"nin yerine \"ve\" getirilebiliyorsa bağlaç, getirilemiyorsa edattır. \"Kardeşimle ben\" = \"kardeşim ve ben\" olduğu için bağlaçtır.",
      fc: [
        "\"İle\" edatı ile bağlacın ayrımı nedir?",
        "Yerine \"ve\" getirilebiliyorsa bağlaç, getirilemiyorsa edattır."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Piknik yapmak için deniz kenarına gittiler.\" cümlesinde \"için\" edatı, eylemin hangi amaçla yapıldığını bildirmektedir. Aynı edat \"Diyet ve spor yaptığı için çok kilo verdi.\" cümlesinde hangi anlamı katar?",
      secenekler: ["Neden-sonuç", "Amaç-sonuç", "Özgülük", "Aitlik"],
      cozum:
        "\"İçin\" edatı amaç-sonuç, neden-sonuç, özgülük, aitlik gibi anlamlar katar; \"yaptığı için\" neden-sonuç ilgisidir.",
      fc: [
        "\"İçin\" edatının kattığı anlamlar nedir?",
        "Amaç-sonuç, neden-sonuç, özgülük ve aitlik anlamlarıdır."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Gece yarısına kadar ders çalıştık.\" cümlesinde \"kadar\" edatı eylemin bitiş zamanını göstermektedir. \"O da senin kadar iyi birisi.\" cümlesinde aynı edat hangi anlamı katar?",
      secenekler: ["Eşitlik", "Zaman", "Karşıtlık", "Yönelme"],
      cozum:
        "\"Kadar\" edatı zaman, yönelme, ölçü, eşitlik, karşıtlık ve karşılaştırma anlamları katar; \"senin kadar iyi\" eşitlik ilgisidir.",
      fc: [
        "\"Kadar\" edatının kattığı anlamlar nedir?",
        "Zaman, yönelme, ölçü, eşitlik, karşıtlık ve karşılaştırma anlamlarıdır."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Yasak olmasına rağmen sigara içiyorlardı.\" cümlesinde iki yargı arasında aykırılık kurulmuştur. Bu ilgiyi kuran edat hangisidir?",
      secenekler: ["rağmen", "kadar", "göre", "üzere"],
      cozum:
        "\"Karşın, rağmen\" edatları karşıtlık ve aykırılık ilgisi kurar; \"üzere\" amaç ve koşul, \"göre\" karşılaştırma bildirir.",
      fc: [
        "\"Rağmen\" edatının işlevi nedir?",
        "Karşıtlık ve aykırılık ilgisi kurmaktır: yasak olmasına rağmen içiyorlardı."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Akşama doğru oradan ayrıldık.\" cümlesinde \"doğru\" sözcüğü bir zaman yaklaşıklığı bildirmiştir. \"Doğru sözden zarar gelmez.\" cümlesinde ise aynı sözcük hangi görevdedir?",
      secenekler: ["Sıfat", "Edat", "İsim", "Zarf"],
      cozum:
        "\"Doğru\" sözcüğü edat, isim, sıfat ve zarf olarak kullanılabilir; \"doğru söz\" örneğinde adı nitelediği için sıfattır.",
      fc: [
        "\"Doğru\" sözcüğünün edat görevi nedir?",
        "Yer ve zaman bakımından yönelme, yaklaşıklık bildirmesidir: akşama doğru, bize doğru."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Dev gibi adam güreşi kaybetti.\" cümlesinde edat, kendinden önceki sözcükle bir grup kurmuş ve bu grup adı nitelemiştir. Bu tür yapılar hangi adla anılır?",
      secenekler: ["Edat grubu", "İsim tamlaması", "Sıfat tamlaması", "Fiil grubu"],
      cozum:
        "Edatların isim ve zamirlerle kurduğu gruplara edat grubu denir; bu grup cümlede sıfat, zarf gibi farklı görevler üstlenebilir.",
      fc: [
        "Edat grubu nedir?",
        "Edatın isim ya da zamirle kurduğu gruptur: ev için, adam gibi, masa kadar."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Roman değil hikâye okuyorum.\" cümlesinde \"değil\" sözcüğü iki unsuru birbirine bağlamıştır. Bu cümlede \"değil\" hangi görevdedir?",
      secenekler: ["Bağlaç", "Edat", "Zarf", "Ünlem"],
      cozum:
        "\"Değil\" olumsuzluk edatıdır; farklı unsurları birbirine bağladığında ise bağlaç olur: \"Roman değil hikâye\".",
      fc: [
        "\"Değil\" edatının işlevi nedir?",
        "Olumsuzluk anlamı katmaktır; farklı unsurları bağlarsa bağlaç olur."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Onun gibisini bir daha bulamazsın.\" cümlesinde \"gibi\" edatı iyelik eki almış ve artık tek başına bir varlığı karşılar duruma gelmiştir. Bu kullanımda sözcük hangi görevdedir?",
      secenekler: ["İsim", "Edat", "Sıfat", "Zarf"],
      cozum:
        "Edatlar iyelik eki aldığında ad gibi görev üstlenir: \"onun gibisini\" örneğinde sözcük isim görevindedir.",
      fc: [
        "Edatların iyelik eki alması ne olur?",
        "Edat ad gibi görev üstlenir; \"onun gibisini bulamazsın\" örneğinde isim olur."
      ]
    }
  ]
});

/* ---------------- 7) BAĞLAÇ ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u02_k07",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Bağlaç",
  kazanim:
    "Bağlaçların bağladığı unsurları, kurduğu anlam ilgilerini ve yazım özelliklerini çözümleyebilme.",
  kaynak: kaynak("104-107"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Bağlaçların bağladığı sözcük, öbek ve cümleleri belirler.",
    "Bağlaçların kurduğu anlam ilgilerini (karşıtlık, koşul, olumsuzluk) ayırt eder.",
    "Bağlaç ile edat görevindeki sözcükleri yazım ve anlam bakımından ayırır."
  ],
  items: [
    {
      bi: 0,
      metin:
        "\"Küçük odanın ve mutfağın penceresi açık kaldı.\" cümlesinde \"ve\" sözcüğü eş görevli iki unsuru birbirine bağlamıştır. Bu sözcüğün türü hangisidir?",
      secenekler: ["Bağlaç", "Edat", "Ünlem", "Zarf"],
      cozum:
        "Eş görevli sözcükleri, söz öbeklerini ve cümleleri birbirine bağlayan sözcükler bağlaçtır.",
      fc: [
        "Bağlaç nedir?",
        "Eş görevli sözcükleri, söz öbeklerini ve cümleleri bağlayan sözcüktür."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Sen de mi geliyorsun?\" cümlesinde \"de\" kendinden önceki sözcükten ayrı yazılmıştır; \"Pasta da kısır da çok güzel olmuş.\" cümlesinde de aynı yazım görülür. Bu yazım özelliği hangi sözcüğe aittir?",
      secenekler: ["Bağlaç olan \"de\"", "Hâl eki olan \"-de\"", "Yapım eki \"-de\"", "Edat olan \"değil\""],
      cozum:
        "Bağlaç olan \"de\" kendinden önceki sözcükten ayrı yazılır; bulunma hâl eki olan \"-de\" ise bitişik yazılır.",
      fc: [
        "Bağlaç olan \"de\"nin yazımı nedir?",
        "Kendinden önceki sözcükten ayrı yazılır: sen de, pasta da."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Onu tanımıyorum ki.\" ve \"Öyle sanıyorum ki artık gelmeyecek.\" cümlelerinde \"ki\" kendinden önceki ve sonraki sözcüklerden ayrı yazılmıştır. Bu kullanım hangi sözcüğe aittir?",
      secenekler: ["Bağlaç olan \"ki\"", "İlgi zamiri \"-ki\"", "Sıfat yapan \"-ki\"", "Yapım eki \"-ki\""],
      cozum:
        "Bağlaç olan \"ki\" ayrı yazılır; ilgi zamiri ve sıfat yapan \"-ki\" ise sözcüğe bitişik yazılır.",
      fc: [
        "Bağlaç olan \"ki\"nin yazımı nedir?",
        "Kendinden önceki ve sonraki sözcükten ayrı yazılır: sanıyorum ki, tanımıyorum ki."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Sinemaya gidebilirsin ama eve erken döneceksin.\" cümlesinde \"ama\" bağlacı karşıtlık değil, bir şart bildirmektedir. Buna göre bağlaç cümleye hangi anlamı katmıştır?",
      secenekler: ["Koşul", "Pekiştirme", "Karşıtlık", "Neden"],
      cozum:
        "\"Ama, fakat, lakin\" karşıt anlamlı cümleleri bağlar; ayrıca koşul ve pekiştirme anlamı da katabilir. Bu cümlede koşul anlamı vardır.",
      fc: [
        "\"Ama, fakat, lakin\" bağlaçlarının işlevi nedir?",
        "Karşıt anlamlı cümleleri bağlar; koşul ve pekiştirme anlamı da katar."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Geziye yalnız bizim sınıf katıldı.\" cümlesinde \"yalnız\" sözcüğü \"sadece\" anlamındadır. \"Onunla konuşurum yalnız sen de benimle geleceksin.\" cümlesinde ise karşıtlık bildirir. İlk cümledeki görev hangisidir?",
      secenekler: ["Edat", "Bağlaç", "Zarf", "Ünlem"],
      cozum:
        "\"Yalnız\" sözcüğü \"bir tek, sadece\" anlamında edat; \"ama, fakat\" anlamında bağlaçtır. \"Ancak\" için de aynı ölçüt geçerlidir.",
      fc: [
        "\"Yalnız\" sözcüğünün edat ve bağlaç olarak ayrımı nedir?",
        "\"Sadece, bir tek\" anlamındaysa edat; \"ama, fakat\" anlamındaysa bağlaçtır."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Yağmur yağıyor, evim ise çok uzakta.\" cümlesinde \"ise\" iki yargı arasında karşıtlık kurmuştur. \"Çocuk başarılıysa sınıfını geçer.\" cümlesinde ise aynı sözcük ek-fiilin şart çekimindedir. İlk cümledeki görev hangisidir?",
      secenekler: ["Bağlaç", "Ek-fiilin şartı", "Edat", "Zarf"],
      cozum:
        "Karşılaştırma ve karşıtlık kurmak üzere kullanılan \"ise\" bağlaçtır; \"başarılıysa\" örneğinde ek-fiilin şart çekimi söz konusudur.",
      fc: [
        "\"İse\" bağlacının işlevi nedir?",
        "Karşılaştırma ilgisi kurar ve karşıtlığı güçlendirir."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Beni ne arıyor ne soruyor.\" cümlesinde \"ne ... ne\" bağlacı iki eylemi birbirine bağlamış ve cümleye olumsuzluk katmıştır. Bu bağlaçla kurulan cümlelerde hangi anlam ortaya çıkar?",
      secenekler: [
        "Karşılaştırılan iki unsurun hiçbiri gerçekleşmez",
        "Karşılaştırılan iki unsurun ikisi de gerçekleşir",
        "Yalnızca birinci unsur gerçekleşir",
        "İki unsur arasında bir seçim yapılır"
      ],
      cozum:
        "\"Ne ... ne\" cümleyi anlamca olumsuz yapar ve karşılaştırılan iki unsurun hiçbiri anlamını verir.",
      fc: [
        "\"Ne ... ne\" bağlacının anlamı nedir?",
        "Cümleyi olumsuz yapar; karşılaştırılan iki unsurun hiçbiri anlamını verir."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Hem ucuz hem kaliteli bir ürün aldık.\" cümlesinde bağlaç iki unsuru birlikte karşılamaktadır. Bu bağlacın cümleye kattığı anlam hangisidir?",
      secenekler: ["İkisi de geçerli", "İkisi de geçersiz", "Yalnız biri geçerli", "İkisi arasında orta değer"],
      cozum:
        "\"Hem ... hem\" bağlacı karşılaştırılan iki unsurun hepsi anlamını verir; \"ne ... ne\" ise hiçbiri anlamını verir.",
      fc: [
        "\"Hem ... hem\" bağlacının anlamı nedir?",
        "Karşılaştırılan iki unsurun ikisinin de geçerli olduğunu bildirir."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Ya bu deveyi güdeceksin ya bu diyardan gideceksin.\" cümlesinde bağlaç iki seçenek sunmaktadır. Bu bağlacın işlevi hangisidir?",
      secenekler: [
        "Sunulan seçeneklerden birini ifade etmek",
        "Seçeneklerin tümünü geçerli kılmak",
        "Seçeneklerin hiçbirini geçersiz kılmak",
        "İki karşıt sıfatın ortasını vermek"
      ],
      cozum:
        "\"Ya ... ya\" bağlacı karşılaştırılan unsurlardan birini ifade etmek için kullanılır.",
      fc: [
        "\"Ya ... ya\" bağlacının anlamı nedir?",
        "Karşılaştırılan unsurlardan yalnızca birini ifade eder."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Dün okula gelemedim, zira çok hastaydım.\" cümlesinde bağlaç, önceki yargının gerekçesini bildirmiştir. \"Kısacası, yani, demek ki, öyleyse\" bağlaçları ise başka bir işlev görür. İlk cümledeki bağlacın kurduğu ilgi hangisidir?",
      secenekler: ["Gerekçe", "Özetleme", "Karşılaştırma", "Koşul"],
      cozum:
        "\"Zira, çünkü\" gerekçe bildirir; \"kısacası, yani, demek ki, öyleyse\" bağlaçları ise özetleme işlevi görür.",
      fc: [
        "Özetleme bağlaçları nedir?",
        "Kısacası, yani, demek ki, öyleyse, o hâlde gibi sözleri toparlayan bağlaçlardır."
      ]
    }
  ]
});

/* ---------------- 8) ÜNLEM ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u02_k08",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Ünlem",
  kazanim:
    "Ünlemleri türleri ve cümledeki işlevleri bakımından çözümleyebilme.",
  kaynak: kaynak("108"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Ünlemleri asıl, ünlem gibi kullanılan ve yansıma ünlemler olarak sınıflandırır.",
    "Ünlemlerin yansıttığı duyguları belirler.",
    "Ünlem cümlesini diğer cümle türlerinden ayırt eder."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Bir olay karşısında duyulan korku, sevinç, üzüntü ve şaşkınlık \"Ah!\", \"Vah vah!\", \"Aman!\" gibi sözcüklerle dile getirilir. Bu sözcüklerin türü hangisidir?",
      secenekler: ["Ünlem", "Edat", "Bağlaç", "Zarf"],
      cozum:
        "Bir olay ya da durum karşısında beliren korku, sevinç, üzüntü, şaşkınlık gibi duyguları yansıtan sözcükler ünlemdir.",
      fc: [
        "Ünlem nedir?",
        "Bir olay karşısında beliren korku, sevinç, üzüntü, şaşkınlık gibi duyguları yansıtan sözcüktür."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Hişt, haydi, ey, hey, ah, aman, vah vah, of, oh\" sözcükleri başka hiçbir görevde kullanılmaz, yalnızca duygu bildirir. Bu sözcükler hangi grupta yer alır?",
      secenekler: ["Asıl ünlemler", "Ünlem gibi kullanılan sözcükler", "Yansıma ünlemleri", "Ünlem cümleleri"],
      cozum:
        "Her zaman ünlem olan, başka bir görevi bulunmayan sözcükler asıl ünlemlerdir.",
      fc: [
        "Asıl ünlem nedir?",
        "Her zaman ünlem olan, başka görevi bulunmayan ünlemlerdir: hişt, haydi, ey, ah."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Ordular, ilk hedefiniz Akdeniz'dir, ileri!\" cümlesinde \"ileri\" sözcüğü aslında bir yön bildirir; ancak vurgu nedeniyle duygu değeri kazanmıştır. Bu kullanım hangi gruba girer?",
      secenekler: [
        "Ünlem gibi kullanılan sözcükler",
        "Asıl ünlemler",
        "Yansıma ünlemleri",
        "Ünlem cümlesi"
      ],
      cozum:
        "Ünlem olmadığı hâlde vurgu gereği ünlem değeri kazanan sözcükler \"ünlem gibi kullanılan sözcükler\" grubundadır.",
      fc: [
        "Ünlem gibi kullanılan sözcükler nedir?",
        "Ünlem olmadığı hâlde vurguyla ünlem değeri kazanan sözcüklerdir: ileri!, dikkatli ol!"
      ]
    },
    {
      bi: 1,
      metin:
        "\"Tak tak!\", \"Çat!\" ve \"Deh küheylan!\" örneklerinde olduğu gibi doğadaki seslerin taklidiyle kurulan ünlemler hangi gruptadır?",
      secenekler: ["Yansıma ünlemleri", "Asıl ünlemler", "Ünlem gibi kullanılan sözcükler", "Soru ünlemleri"],
      cozum:
        "Yansıma sözcüklerle oluşan ünlemlere yansıma ünlemleri denir.",
      fc: [
        "Yansıma ünlem nedir?",
        "Yansıma sözcüklerle oluşan ünlemlerdir: tak tak, çat, deh küheylan."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Aman efendim, bu ne güzel tesadüf!\" ve \"Sakın ha, kimseye söyleme!\" cümlelerinde ünlem yer almaktadır. İçinde ünlem bulunan bu cümleler hangi adla anılır?",
      secenekler: ["Ünlem cümlesi", "Soru cümlesi", "Emir cümlesi", "Koşul cümlesi"],
      cozum:
        "İçinde ünlemlerin yer aldığı cümleler ünlem cümlesidir.",
      fc: [
        "Ünlem cümlesi nedir?",
        "İçinde ünlemlerin yer aldığı cümledir: Aman efendim, bu ne güzel tesadüf!"
      ]
    },
    {
      bi: 2,
      metin:
        "\"Vah vah, ne kadar üzüldüm!\" cümlesindeki ünlem hangi duyguyu yansıtmaktadır?",
      secenekler: ["Üzüntü", "Sevinç", "Şaşkınlık", "Korku"],
      cozum:
        "\"Vah vah\" ünlemi üzüntü bildirir; asıl ünlemler yansıttıkları duyguya göre değerlendirilir.",
      fc: [
        "Ünlemlerin işlevi nedir?",
        "Korku, sevinç, üzüntü, şaşkınlık gibi duyguları yansıtmaktır."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Yaşasın, sınavı kazandım!\" cümlesinde kullanılan ünlem hangi duyguyu öne çıkarır?",
      secenekler: ["Sevinç", "Üzüntü", "Öfke", "Korku"],
      cozum:
        "\"Yaşasın\" ünlemi sevinç duygusunu yansıtır; ünlemler tek başına duygu belirtir.",
      fc: [
        "Sevinç bildiren ünlemler nedir?",
        "Yaşasın, oh, heyecan gibi sevinç duygusunu yansıtan ünlemlerdir."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Dikkatli ol!\" cümlesi tek bir sözcükten oluşmasına karşın güçlü bir uyarı ve duygu taşır. Bu cümlede \"dikkatli ol\" hangi değeri kazanmıştır?",
      secenekler: ["Ünlem değeri", "Edat değeri", "Bağlaç değeri", "Sıfat değeri"],
      cozum:
        "Bazı sözcük ve cümleler ünlem olmadıkları hâlde vurgu gereği ünlem değeri kazanabilir: Dikkatli ol!",
      fc: [
        "Ünlem değeri kazanma nedir?",
        "Ünlem olmayan bir sözcüğün vurguyla ünlem görevi üstlenmesidir: Dikkatli ol!"
      ]
    },
    {
      bi: 2,
      metin:
        "Bir metinde \"Tak tak!\" sesiyle kapı vurulduğu anlatılmış, ardından \"Ah, yine mi!\" denilmiştir. Bu iki kullanımdan ilki hangi ünlem grubunda değerlendirilir?",
      secenekler: ["Yansıma ünlemi", "Asıl ünlem", "Ünlem gibi kullanılan sözcük", "Ünlem cümlesi"],
      cozum:
        "\"Tak tak\" doğadaki bir sesin taklididir; yansıma sözcüklerle oluşan ünlemler yansıma ünlemleridir.",
      fc: [
        "Yansıma ünlemlerinin kaynağı nedir?",
        "Doğadaki seslerin taklididir: tak tak, çat, pat."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir öğrenci \"aman, of, ey\" sözcüklerini cümlede bağlaç olarak kullanmak istemiştir. Bu girişim neden başarısızdır?",
      secenekler: [
        "Bu sözcükler yalnızca ünlem görevinde kullanılır",
        "Bu sözcükler yalnızca edat olarak kullanılır",
        "Bu sözcükler cümlede hiç yer almaz",
        "Bu sözcükler yalnızca soru sorar"
      ],
      cozum:
        "Asıl ünlemler her zaman ünlemdir ve başka bir görevi bulunmaz; bu yüzden bağlaç olarak kullanılamaz.",
      fc: [
        "Asıl ünlemlerin ortak özelliği nedir?",
        "Yalnızca ünlem görevinde kullanılmaları ve başka görevlerinin bulunmamasıdır."
      ]
    }
  ]
});

/* ---------------- 9) ANLAMINA GÖRE CÜMLELER ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u02_k09",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Anlamına Göre Cümleler",
  kazanim:
    "Cümleleri taşıdıkları anlam ilgilerine göre sınıflandırabilme.",
  kaynak: kaynak("68-70"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Neden-sonuç, amaç-sonuç ve koşul-sonuç cümlelerini ayırt eder.",
    "Açıklama ve karşılaştırma ilişkili cümleleri çözümler.",
    "Yakınma ve tasarı cümlelerini belirler."
  ],
  items: [
    {
      bi: 0,
      metin:
        "\"Hasta olduğum için okula gelemedim.\" cümlesinde yükleme \"neden gelemedin?\" sorusu sorulduğunda cevap alınmaktadır. Bu cümle hangi anlam ilişkisini taşır?",
      secenekler: ["Neden-sonuç", "Amaç-sonuç", "Koşul-sonuç", "Karşılaştırma"],
      cozum:
        "Bir eylemin hangi gerekçeyle yapıldığını bildiren ve \"niçin, neden\" sorusuna cevap veren cümleler neden-sonuç ilişkilidir.",
      fc: [
        "Neden-sonuç cümlesi nedir?",
        "Eylemin hangi gerekçeyle yapıldığını bildiren; \"neden?\" sorusuna cevap veren cümledir."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Sınavı kazanmak için çok çalışmış.\" cümlesine \"hangi amaçla çalışmış?\" sorusu sorulduğunda cevap alınmaktadır. Bu cümle hangi ilişkiyi taşır?",
      secenekler: ["Amaç-sonuç", "Neden-sonuç", "Açıklama", "Tasarı"],
      cozum:
        "Eylemin hangi amaca bağlı olarak gerçekleştiğini bildiren cümleler amaç-sonuç ilişkilidir; \"için, diye, üzere\" edatları kullanılır.",
      fc: [
        "Amaç-sonuç cümlesi nedir?",
        "Eylemin hangi amaca bağlı yapıldığını bildiren; \"hangi amaçla?\" sorusuna cevap veren cümledir."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir öğrenci \"Sınavı kazanmak için çalıştı.\" cümlesini neden-sonuç sanmıştır; oysa bu cümle amaç-sonuçtur. Bu karışıklığı önlemek için hangi yol izlenmelidir?",
      secenekler: [
        "Önce \"hangi amaçla?\" sorusunu sormak",
        "Önce \"neden?\" sorusunu sormak",
        "Cümledeki ekleri saymak",
        "Yüklemin türüne bakmak"
      ],
      cozum:
        "Amaç-sonuç cümleleri \"neden?\" sorusuna da cevap verebildiği için karıştırılır; önce mutlaka \"hangi amaçla?\" sorusu sorulmalıdır.",
      fc: [
        "Amaç-sonuç ile neden-sonuç ayrımı nedir?",
        "Önce \"hangi amaçla?\" sorusu sorulur; cevap alınıyorsa amaç-sonuçtur."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Ödevini yaparsan oyun oynayabilirsin.\" cümlesinde bir eylemin gerçekleşmesi başka bir eyleme bağlanmıştır. Bu cümlede hangi anlam ilişkisi vardır?",
      secenekler: ["Koşul-sonuç", "Neden-sonuç", "Amaç-sonuç", "Yakınma"],
      cozum:
        "Bir olayın gerçekleşmesinin başka bir olaya bağlı olduğunu bildiren cümleler koşul-sonuç ilişkilidir; koşul anlamı \"-se\" ekiyle sağlanır.",
      fc: [
        "Koşul-sonuç cümlesi nedir?",
        "Bir olayın gerçekleşmesinin başka bir olaya bağlı olduğunu bildiren cümledir."
      ]
    },
    {
      bi: 2,
      metin:
        "Türkçede koşul anlamı yalnızca \"-se\" ekiyle sağlanmaz; \"ise, -ince, -dikçe, ama, üzere, yeter ki\" gibi sözlerle de kurulabilir. Aşağıdakilerden hangisi bu sözlerden biri değildir?",
      secenekler: ["çünkü", "yeter ki", "-dikçe", "üzere"],
      cozum:
        "\"Çünkü\" gerekçe bildiren bir bağlaçtır; koşul anlamı \"-se, ise, -ince, -dikçe, mi, ama, üzere, yeter ki\" ile sağlanır.",
      fc: [
        "Koşul anlamını sağlayan sözler nedir?",
        "-se, ise, -ince, -dikçe, mi, ama, üzere, yeter ki gibi sözlerdir."
      ]
    },
    {
      bi: 0,
      metin:
        "\"İzmir'i seviyorum çünkü en güzel yıllarım orada geçti.\" cümlesinde önce sonuç, sonra neden belirtilmiştir. Bu cümle hangi ilişkiyi taşır?",
      secenekler: ["Açıklama", "Neden-sonuç", "Koşul-sonuç", "Karşılaştırma"],
      cozum:
        "Neden-sonuç ilişkisinin tersi olan, önce sonucun sonra nedenin verildiği cümleler açıklama ilişkilidir; \"çünkü, demek ki, öyleyse\" bağlaçları kullanılır.",
      fc: [
        "Açıklama ilişkili cümle nedir?",
        "Önce sonucun, sonra nedenin belirtildiği cümledir: çünkü, demek ki, öyleyse."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Kışın Sivas, İstanbul'dan daha soğuktur.\" cümlesinde iki yerin sıcaklığı karşılaştırılmaktadır. Bu cümlede hangi sözcük karşılaştırma ilgisi kurmuştur?",
      secenekler: ["daha", "çünkü", "ise", "üzere"],
      cozum:
        "Karşılaştırma ilgisi \"gibi, kadar, en, daha, çok, göre, fazla\" gibi sözcüklerle kurulur.",
      fc: [
        "Karşılaştırma cümlesi nedir?",
        "Birden fazla varlık, kavram ya da durumun karşılaştırıldığı cümledir."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Gittiğinden beri hiç aramadı.\" ve \"İnsanlar hâlâ uğradıkları haksızlıklara ses çıkarmıyor.\" cümlelerinde bir durumdan duyulan rahatsızlık dile getirilmiştir. Bu cümleler hangi grupta yer alır?",
      secenekler: ["Yakınma cümleleri", "Tasarı cümleleri", "Koşul cümleleri", "Açıklama cümleleri"],
      cozum:
        "Bir durumdan duyulan rahatsızlığı ifade eden cümleler yakınma (şikâyet) cümleleridir.",
      fc: [
        "Yakınma cümlesi nedir?",
        "Bir durumdan duyulan rahatsızlığı ifade eden cümledir: gittiğinden beri hiç aramadı."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Önümüzdeki ay tatile çıkmayı düşünüyorum.\" cümlesinde gelecekte yapılması planlanan bir iş anlatılmıştır. Bu cümle hangi gruptadır?",
      secenekler: ["Tasarı cümlesi", "Yakınma cümlesi", "Koşul cümlesi", "Neden-sonuç cümlesi"],
      cozum:
        "Gelecekte yapılması planlanan işlerin belirtildiği cümleler tasarı cümleleridir.",
      fc: [
        "Tasarı cümlesi nedir?",
        "Gelecekte yapılması planlanan işlerin belirtildiği cümledir."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Çiçekleri gece sula; daha çabuk büyür.\" cümlesinde iki yargı noktalı virgülle ayrılmış, birinci yargı ikincinin nedeni olmuştur. Bu kullanıma verilen ad hangisidir?",
      secenekler: ["Gerekçe", "Tasarı", "Yakınma", "Karşılaştırma"],
      cozum:
        "İki bağımsız cümleyle kurulan neden-sonuç ilişkisine gerekçe denir; sebep ve sonuç cümlelerinin yerleri değiştirilebilir.",
      fc: [
        "Gerekçe nedir?",
        "Bağımsız iki cümleyle kurulan neden-sonuç ilişkisidir: Çiçekleri gece sula; daha çabuk büyür."
      ]
    }
  ]
});
