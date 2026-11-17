#!/usr/bin/env node
/* ============================================================
   BİYOLOJİ 10 · 2. TEMA (EKOLOJİ) — kitaptan sıfırdan havuzlar
   ------------------------------------------------------------
   Kaynak: MEB Biyoloji 10 (2025) — `kitap-kaynak` dalındaki
   biyoloji.json. Basılı sayfa = PDF sayfası − 1.

     2.1 Ekosistemin Bileşenleri                    s.100-106
     2.2 Komüniteler ve Popülasyonlar               s.107-122
     2.3 Ekosistemdeki Madde ve Enerji Akışı        s.123-131
     2.4 Madde Döngüleri                            s.132-138
     2.5 Ekolojik Sürdürülebilirliğin Önemi         s.139-142
     2.6 Sürdürülebilirliği Kısıtlayan Durumlar     s.143-154
     2.7 Ekolojik Ayak İzinin Küçültülmesi          s.155-159
     2.8 Doğal Kaynakların ve Biyoçeşitliliğin Korunması s.160-167
     2.9 Atık Yönetimi                              s.168-174

   Kullanım: node docs/uretim/uretim/biyoloji-t2.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Biyoloji";
const DOSYA = "biyoloji-10.pdf (MEB, 2025)";
const kaynak = s => "Biyoloji 10 ders kitabı, s." + s;

/* ------------------------------------------------------- 2.1 */
yazKonu({
  konu_id: "biyo_10_u02_k01",
  ders: DERS, tema: 2, tema_adi: "Ekoloji",
  baslik: "2.1 Ekosistemin Bileşenleri",
  kazanim: "Ekosistemin cansız bileşenlerinin canlılar üzerindeki etkisini açıklar ve canlı bileşenleri işlevlerine göre sınıflandırır.",
  kaynak: kaynak("100-106"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Cansız bileşenlerin canlıların yaşamı üzerindeki etkisini açıklar.",
    "Canlı bileşenleri işlevlerine göre sınıflandırır."
  ],
  items: [
    {
      bi: 0,
      metin: "Gün uzunluğunun (fotoperiyot) değişmesi bitkilerde çiçeklenme ya da yaprak dökümüne, bazı hayvanlarda göçe yol açar. Bu durum hangi bileşenle açıklanır?",
      secenekler: [
        "Işık",
        "Toprağın pH değeri",
        "Toprağın humus miktarı",
        "Rüzgâr hızı"
      ],
      cozum: "Kitap, gün uzunluğuna bağlı çiçeklenme, yaprak dökümü, kış uykusu, göç ve yağ depolamayı ışığın canlılarla etkileşimine örnek verir (s.100, 103).",
      fc: ["Fotoperiyot nedir?", "Gün uzunluğunun mevsimlere göre değişimi."]
    },
    {
      bi: 0,
      metin: "Kaktüslerin 50 °C'nin üzerindeki sıcaklıklara dayanabilmesi hangi cansız bileşene uyum örneğidir?",
      secenekler: [
        "Sıcaklık",
        "Işığın dalga boyu",
        "Toprak pH'ı",
        "Su miktarı"
      ],
      cozum: "Sıcaklık canlıların biyolojik süreçlerini etkiler; kaktüsler çöl sıcaklıklarına uyum sağlamıştır (s.103).",
      fc: ["Sıcaklığın canlı üzerindeki etkisi nedir?", "Enzim ve proteinlerin çalışmasını belirler."]
    },
    {
      bi: 0,
      metin: "Su miktarı belirli bir seviyenin altına düştüğünde enzimlerin çalışamaması hangi sonucu doğurur?",
      secenekler: [
        "Canlıların yaşamsal olayları aksar, su sınırlayıcı olur",
        "Toprağın humus oranı belirgin biçimde artar",
        "Işığın şiddeti ve süresi kısalır",
        "Kemosentez hızı iki katına çıkar"
      ],
      cozum: "Su; madde taşınması, sindirim, fotosentez ve enzim çalışması için gereklidir; kurak ortamlarda sınırlayıcı bileşen hâline gelir (s.104).",
      fc: ["Kurak ortamda sınırlayıcı bileşen nedir?", "Su; enzimler yeterince çalışamaz."]
    },
    {
      bi: 0,
      metin: "Kanguru sıçanının su içmeden kuru tohumlarla uzun süre yaşayabilmesi hangi uyum örneğidir?",
      secenekler: [
        "Su kaybını azaltacak yapı ve davranış geliştirmesi",
        "Fotosentez yapabilmesi",
        "Topraktaki humusu parçalaması",
        "Havadan azot bağlaması"
      ],
      cozum: "Kurak ortam canlıları su kaybını azaltacak yapı ve özelliklerle uyum sağlar; sarı sabır yapraklarında su depolar, kanguru sıçanı kuru tohumla yaşar (s.104).",
      fc: ["Toprakta humus nedir?", "Mikroorganizmaların ayrıştırdığı organik kısım."]
    },
    {
      bi: 0,
      metin: "Toprağın inorganik kısmını oluşturan temel bileşen hangisidir?",
      secenekler: [
        "Mineraller",
        "Humus",
        "Çürüyen yapraklar",
        "Ayrıştırıcı bakteriler"
      ],
      cozum: "Toprağın organik kısmı humus ve çürüyen organik maddelerden, inorganik kısmı minerallerden oluşur (s.104).",
      fc: ["Ekosistemin cansız bileşenleri nedir?", "Işık, sıcaklık, su, pH ve toprak."]
    },
    {
      bi: 1,
      metin: "Kendi besinini fotosentez veya kemosentezle üreten canlılar ekosistemde hangi grupta yer alır?",
      secenekler: [
        "Üreticiler",
        "Tüketiciler",
        "Ayrıştırıcılar",
        "Parazitler"
      ],
      cozum: "Üreticiler ototrof organizmalardır; besin üretimi fotosentez veya kemosentezle gerçekleşir (s.105).",
      fc: ["Üretici nedir?", "Fotosentez veya kemosentezle besin üreten ototrof canlı."]
    },
    {
      bi: 1,
      metin: "Sucul ekosistemlerdeki üretici canlılar hangi grupta toplanır?",
      secenekler: [
        "Algler ve siyanobakteriler",
        "Mantarlar ve bakteriler",
        "Tilkiler ve dağ keçileri",
        "Solucanlar ve termitler"
      ],
      cozum: "Karasal ekosistemlerde bitkiler, sucul ekosistemlerde ise algler ve siyanobakteriler üreticidir (s.105).",
      fc: ["Karasal ekosistemin üreticileri nedir?", "Bitkiler; sucul ortamda alg ve siyanobakteriler."]
    },
    {
      bi: 1,
      metin: "Derin deniz dipleri ve bataklıklarda ışık bulunmadığı hâlde besin üreten canlılar hangileridir?",
      secenekler: [
        "Kemosentetik bakteriler ve arkeler",
        "Yeşil algler ve su bitkileri",
        "Karasal çiçekli bitkiler",
        "Şapkalı mantar türleri"
      ],
      cozum: "Bu ekosistemlerin üreticileri genellikle kemosentetik bakteriler ve arkelerdir; ışık olmadan inorganik maddelerin oksidasyonuyla besin üretirler (s.105).",
      fc: ["Tüketici nedir?", "Besinini dış ortamdan hazır alan heterotrof canlı."]
    },
    {
      bi: 1,
      metin: "Bir ormanda dökülen yapraklar ve hayvan atıkları 1-2 yıl içinde toprağa karışır. Bu dönüşümü sağlayan canlı grubunun işlevi nedir?",
      secenekler: [
        "Organik maddeleri inorganik maddelere dönüştürmek",
        "Işık enerjisini kimyasal enerjiye çevirmek",
        "Su döngüsünü başlatmak",
        "Atmosferdeki oksijeni tüketmek"
      ],
      cozum: "Ayrıştırıcılar, bitki ve hayvan atıklarını parçalayarak inorganik maddelere dönüştürür ve üreticilerin kullanacağı madde döngüsünü sağlar (s.106).",
      fc: ["Ayrıştırıcıların madde döngüsündeki rolü nedir?", "Organik maddeyi inorganiğe çevirip döngüyü kapatmak."]
    },
    {
      bi: 1,
      metin: "Bir ekosistemde ayrıştırıcılar tamamen ortadan kalkarsa ne beklenir?",
      secenekler: [
        "Organik madde ayrışamaz, üretici inorganik madde bulamaz; yaşam sona erer",
        "Üreticiler daha hızlı çoğalır ve biyokütle artar",
        "Su döngüsü hızlanır, yağışlar artar",
        "Yalnızca tüketici canlılar etkilenir"
      ],
      cozum: "Ayrıştırıcılar olmadığında organik maddeler ayrıştırılamaz, üreticiler inorganik maddeye ulaşamaz, yeni organik madde üretimi durur ve ekosistemde yaşam sona erer (s.106).",
      fc: ["Ekosistem nedir?", "Canlı toplulukları ve etkileşimde oldukları cansız çevre."]
    }
  ]
});

/* ------------------------------------------------------- 2.2 */
yazKonu({
  konu_id: "biyo_10_u02_k02",
  ders: DERS, tema: 2, tema_adi: "Ekoloji",
  baslik: "2.2 Komünitelerde ve Popülasyonlarda Görülen Etkileşimler ve Değişimler",
  kazanim: "Tür içi ve türler arası etkileşimleri ayırt eder, popülasyon büyüklüğünü etkileyen faktörleri ve süksesyonu açıklar.",
  kaynak: kaynak("107-122"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Simbiyotik ilişkileri (mutualizm, kommensalizm, amensalizm, parazitizm) örneklerle ayırt eder.",
    "Rekabeti, popülasyon büyüklüğünü etkileyen faktörleri ve süksesyonu açıklar."
  ],
  items: [
    {
      bi: 0,
      metin: "Remora balıkları köpek balığının yiyecek artıklarıyla beslenir ve onun hareketiyle yer değiştirir. Bu ilişki biçimi hangisidir?",
      secenekler: [
        "Kommensalizm",
        "Mutualizm",
        "Parazitizm",
        "Amensalizm"
      ],
      cozum: "Kommensalizmde türlerden biri fayda görürken diğeri ne fayda ne zarar görür; remora faydalanır, köpek balığı etkilenmez (s.115).",
      fc: ["Kommensalizm nedir?", "Biri fayda görürken diğerinin etkilenmediği birliktelik."]
    },
    {
      bi: 0,
      metin: "Ceviz ağacının salgıladığı madde kendisini etkilemezken altındaki otsu bitkilerin gelişimini engeller. Bu ilişki hangisidir?",
      secenekler: [
        "Amensalizm",
        "Mutualizm",
        "Kommensalizm",
        "Parazitizm"
      ],
      cozum: "Amensalizmde türlerden biri engellenir ya da yok edilir, diğeri etkilenmez; ceviz ağacı ile altındaki otsu bitkiler buna örnektir (s.116).",
      fc: ["Amensalizm nedir?", "Biri engellenirken diğerinin etkilenmediği ilişki."]
    },
    {
      bi: 0,
      metin: "Klorofili bulunduğu için fotosentez yapabilen, konaktan yalnızca su ve mineral alan ökse otu hangi grupta yer alır?",
      secenekler: [
        "Yarı parazit bitki",
        "Tam parazit bitki",
        "Ayrıştırıcı",
        "Üretici"
      ],
      cozum: "Yarı parazit bitkiler emeçleriyle konaktan yalnızca su ve mineral alır, klorofilleri olduğu için fotosentez yapar; ökse otu bu grubun örneğidir (s.116).",
      fc: ["Yarı parazit bitki nedir?", "Klorofili olan, konaktan yalnız su-mineral alan bitki."]
    },
    {
      bi: 0,
      metin: "Kloroplastı bulunmadığı için fotosentez yapamayan canavar otu hangi parazit grubundadır?",
      secenekler: [
        "Tam parazit bitki",
        "Yarı parazit bitki",
        "Dış parazit hayvan",
        "İç parazit hayvan"
      ],
      cozum: "Tam parazit bitkilerin kloroplastı yoktur; organik ve inorganik tüm maddeleri konaktan alır (s.116).",
      fc: ["Tam parazit bitki nedir?", "Kloroplastı olmayan, tüm maddeleri konaktan alan bitki."]
    },
    {
      bi: 0,
      metin: "Likende alg hücreleri organik molekül ve oksijeni mantar hiflerine verirken mantar da su ve mineral iletir. Bu birliktelik hangi kavramla açıklanır?",
      secenekler: [
        "Zorunlu mutualizm",
        "İsteğe bağlı mutualizm",
        "Kommensalizm",
        "Amensalizm"
      ],
      cozum: "Taraflardan birinin diğeri olmadan yaşayamadığı mutualizm zorunlu mutualizmdir; liken birliği bunun örneğidir (s.115).",
      fc: ["Zorunlu mutualizm nedir?", "Tarafların birbirine bağımlı olduğu mutualizm; örn. liken."]
    },
    {
      bi: 0,
      metin: "Baklagillerin köküne yerleşen Rhizobium bakterileri havanın azotunu bağlar, bitkiden organik besin alır. Bu ilişki hangisidir?",
      secenekler: [
        "Mutualizm",
        "Parazitizm",
        "Kommensalizm",
        "Rekabet"
      ],
      cozum: "Bu birliktelikte bitki azot ihtiyacını karşılar, bakteri organik besin alır; iki taraf da fayda gördüğü için mutualizmdir (s.114).",
      fc: ["Nodül nedir?", "Azot bağlayıcı bakterilerin kökte oluşturduğu yapı."]
    },
    {
      bi: 1,
      metin: "Gause, ekolojik nişleri örtüşen Paramecium aurelia ve P. caudatum türlerini aynı kültür ortamına koyduğunda hangi sonucu gözlemlemiştir?",
      secenekler: [
        "P. aurelia yaşamını sürdürmüş, P. caudatum yok olmuştur",
        "İki tür de aynı sayıda kalmıştır",
        "İki tür birbirini tamamlayarak yaşamıştır",
        "P. caudatum diğerini ortamdan çıkarmıştır"
      ],
      cozum: "P. aurelia daha hızlı ürediği ve sınırlı besini daha etkin kullandığı için yaşamını sürdürmüş, P. caudatum ortamdan yok olmuştur (s.113).",
      fc: ["Ekolojik niş nedir?", "Türün tüm faaliyetleri, ilişkileri ve ekosistemdeki işlevi."]
    },
    {
      bi: 1,
      metin: "Bir popülasyonda bir yıl içinde 40 doğum, 10 içe göç, 30 ölüm ve 5 dışa göç gerçekleşmiştir. Popülasyon büyüklüğü nasıl değişir?",
      secenekler: [
        "15 birey artar",
        "15 birey azalır",
        "Değişmez",
        "50 birey artar"
      ],
      cozum: "Değişme = (doğum + içe göç) − (ölüm + dışa göç) = (40 + 10) − (30 + 5) = 15; popülasyon büyür (s.120).",
      fc: ["Popülasyon büyüklüğü nasıl hesaplanır?", "(Doğum + içe göç) − (ölüm + dışa göç)."]
    },
    {
      bi: 1,
      metin: "Bir gölde 1 hektarlık alanda bulunabilecek maksimum sazan sayısını ifade eden kavram nedir?",
      secenekler: [
        "Taşıma kapasitesi",
        "Popülasyon yoğunluğu",
        "Çevre direnci",
        "Ekolojik niş"
      ],
      cozum: "Birim alanda bulunabilecek maksimum birey sayısına taşıma kapasitesi denir; buna yaklaşan popülasyonlarda çevre direnci artar (s.121).",
      fc: ["Çevre direnci nedir?", "Büyümeyi engelleyen biyotik ve abiyotik faktörlerin tümü."]
    },
    {
      bi: 1,
      metin: "Topraksız bir kaya yüzeyinde başlayan süksesyon sürecinde ilk yerleşen canlılar hangileridir?",
      secenekler: [
        "Likenler",
        "Büyük ağaçlar",
        "Çalılar",
        "Otsu bitkiler"
      ],
      cozum: "Kayalık ve taşlık yerlere uyum sağlamış likenler ilk yerleşir, toprak oluşumunu başlatır; sonra yosunlar, otsu bitkiler, çalılar ve ağaçlar gelir (s.118).",
      fc: ["Süksesyon nedir?", "Türlerin zaman içinde sıralı olarak birbirinin yerini alması."]
    },
    {
      bi: 1,
      metin: "Bir ormanda 1 km² alanda 45 sincap sayılmıştır. Bu değer popülasyonun hangi özelliğini verir?",
      secenekler: [
        "Yoğunluğunu",
        "Büyüklüğünü",
        "Taşıma kapasitesini",
        "Çevre direncini"
      ],
      cozum: "Birim alan ya da birim hacimde bulunan birey sayısı popülasyon yoğunluğunu verir; 1 km²'de 45 sincap yoğunluk ölçüsüdür (s.120).",
      fc: ["Popülasyon yoğunluğu nedir?", "Birim alan veya hacimdeki birey sayısı."]
    },
    {
      bi: 1,
      metin: "Bir göldeki sazan popülasyonuna başka bir gölden 30 birey katılmış, aynı yıl 25 birey ölmüştür. Bu veriler popülasyon büyüklüğünü nasıl etkiler?",
      secenekler: [
        "İçe göç 30, ölüm 25 olduğu için büyüklük 5 birey artar",
        "İçe göç 30, ölüm 25 olduğu için büyüklük 5 birey azalır",
        "İçe göç ve ölüm birbirini götürdüğü için değişmez",
        "Yalnızca dışa göç büyüklüğü etkilediği için değişmez"
      ],
      cozum: "Büyüklük değişimi (doğum + içe göç) − (ölüm + dışa göç) ile bulunur; doğum ve dışa göç yokken 30 − 25 = +5 olur (s.120).",
      fc: ["İçe göç nedir?", "Başka popülasyondan bireylerin popülasyona katılması."]
    }
  ]
});

/* ------------------------------------------------------- 2.3 */
yazKonu({
  konu_id: "biyo_10_u02_k03",
  ders: DERS, tema: 2, tema_adi: "Ekoloji",
  baslik: "2.3 Ekosistemdeki Madde ve Enerji Akışı",
  kazanim: "Besin zinciri ve ağında enerji akışını trofik basamaklarla açıklar, enerji piramidi ile biyolojik birikimi yorumlar.",
  kaynak: kaynak("123-131"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Besin zinciri ve besin ağında enerjinin akışını izler.",
    "Enerji piramidi ve biyolojik birikimi yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Üreticilerle beslenen otçul canlılar besin zincirinde hangi adla anılır?",
      secenekler: [
        "Birincil tüketici",
        "İkincil tüketici",
        "Üçüncül tüketici",
        "Ayrıştırıcı"
      ],
      cozum: "Üreticilerle beslenen otçullara birincil tüketici, otçullarla beslenen etçillere ikincil tüketici denir (s.129).",
      fc: ["Birincil tüketici nedir?", "Üreticilerle beslenen otçul canlı."]
    },
    {
      bi: 0,
      metin: "Bir trofik basamaktaki 100.000 J'lük enerjinin yaklaşık %10'u üst basamağa aktarıldığına göre birincil tüketiciye kaç joule geçer?",
      secenekler: [
        "10.000 J",
        "100.000 J",
        "1.000 J",
        "90.000 J"
      ],
      cozum: "%10 Yasası gereği enerjinin yaklaşık %10'u bir üst basamağa geçer; 100.000 J'nin %10'u 10.000 J'dir (s.130).",
      fc: ["%10 Yasası nedir?", "Enerjinin ancak %10'unun üst trofik basamağa geçmesi."]
    },
    {
      bi: 0,
      metin: "Bir trofik basamaktaki enerjinin geri kalan %90'ına ne olur?",
      secenekler: [
        "Canlılık faaliyetlerinde kullanılır, ısı olarak yayılır",
        "Ayrıştırıcıların dokusunda uzun süre depolanır kalır",
        "Üreticilere geri dönerek yeniden kullanılabilir hâle gelir",
        "Toprakta kimyasal bağ enerjisi olarak saklanır kalır"
      ],
      cozum: "Enerjinin yaklaşık %90'ı canlılık faaliyetlerinde kullanılır ve ısı olarak çevreye yayılır; bu nedenle akış tek yönlüdür (s.130).",
      fc: ["Enerjinin tek yönlü akması ne demektir?", "Çoğunun ısıya dönüşmesi; geri dönmez."]
    },
    {
      bi: 0,
      metin: "Birçok canlının birden fazla besin zincirinde yer almasıyla oluşan karmaşık beslenme yapısına ne ad verilir?",
      secenekler: [
        "Besin ağı",
        "Besin piramidi",
        "Trofik basamak",
        "Biyokütle"
      ],
      cozum: "Farklı besin zincirlerinin birbirine bağlanarak oluşturduğu karmaşık ve çok yönlü yapıya besin ağı denir (s.129).",
      fc: ["Besin ağı nedir?", "Besin zincirlerinin birbirine bağlanmasıyla oluşan yapı."]
    },
    {
      bi: 0,
      metin: "Ayrıştırıcılar besin piramidinin hangi basamağında bulunur?",
      secenekler: [
        "Tüm trofik basamaklarda",
        "Yalnızca birinci basamakta",
        "Yalnızca en üst basamakta",
        "Piramidin dışında"
      ],
      cozum: "Birinci basamakta üreticiler, ikincide otçullar, üçüncüde etçiller bulunur; ayrıştırıcılar ise tüm trofik basamaklarda yer alır (s.130).",
      fc: ["Biyokütle nedir?", "Popülasyonu oluşturan bireylerin toplam kütlesi."]
    },
    {
      bi: 1,
      metin: "Bir besin piramidinde bitki, çekirge, serçe ve atmaca yer alıyorsa biyolojik birikimin en fazla olması beklenen canlı hangisidir?",
      secenekler: [
        "Atmaca",
        "Bitki",
        "Çekirge",
        "Serçe"
      ],
      cozum: "Biyolojik birikim piramidin üst basamaklarına çıkıldıkça artar; en üstteki atmaca en fazla zehirli maddeyi biriktirir (s.131).",
      fc: ["Biyolojik birikim nedir?", "Zararlı maddelerin dokularda birikip zincirde artması."]
    },
    {
      bi: 1,
      metin: "Tarım ilacı DDT püskürtüldükten 20 yıl sonra bile toprakta ve canlı dokularında saptanmıştır. Bunun nedeni nedir?",
      secenekler: [
        "Kolay parçalanmaması ve canlı dokularında birikmesi",
        "Suda çözünüp hızla seyrelmesi",
        "Bitkiler tarafından besin olarak kullanılması",
        "Ayrıştırıcılar tarafından hızla yıkılması"
      ],
      cozum: "DDT çevrede yaklaşık 10 yıl kalabilir, fiziksel etkenlerle kolayca parçalanmaz ve dokularda birikir; bu yüzden 1980'lerden itibaren yasaklanmıştır (s.131).",
      fc: ["Kalıcı kirletici nedir?", "Doğada kolay parçalanmayan, dokuda biriken madde (DDT gibi)."]
    },
    {
      bi: 1,
      metin: "Besin zincirinde trofik basamak sayısı arttıkça enerji kaybı nasıl değişir?",
      secenekler: [
        "Artar",
        "Azalır",
        "Değişmez",
        "Önce artar, sonra sıfırlanır"
      ],
      cozum: "Her basamakta enerjinin yaklaşık %90'ı kaybedildiği için basamak sayısı arttıkça toplam enerji kaybı da artar (s.130).",
      fc: ["Trofik basamak nedir?", "Beslenme düzeyindeki her bir basamak."]
    },
    {
      bi: 1,
      metin: "Bir ekosistemde güneş enerjisi ilk olarak hangi canlılar tarafından kimyasal bağ enerjisine dönüştürülür?",
      secenekler: [
        "Üreticiler",
        "Birincil tüketiciler",
        "İkincil tüketiciler",
        "Ayrıştırıcılar"
      ],
      cozum: "Güneşten gelen ışık enerjisi fotosentezle üreticiler tarafından kimyasal enerjiye dönüştürülerek organik besinlerin yapısına aktarılır (s.128).",
      fc: ["Enerji piramidi nedir?", "Trofik basamaklar arasındaki enerji kaybını gösteren grafik."]
    },
    {
      bi: 1,
      metin: "Bir gölde su bitkileri → su piresi → küçük balık → büyük balık zincirinde büyük balığın dokusunda biriken madde miktarı için hangisi doğrudur?",
      secenekler: [
        "Zincirin en üstünde olduğu için en yüksektir",
        "En düşüktür çünkü büyük canlıdır",
        "Su bitkileriyle aynıdır",
        "Yalnızca suda çözünen maddeler birikir"
      ],
      cozum: "Biyolojik birikim yapan maddeler zincir boyunca aktarılır ve her basamakta yoğunluğu artar; en üstteki büyük balıkta en yüksek düzeye ulaşır (s.131).",
      fc: ["Enerji piramidinin daralmasının nedeni nedir?", "Her basamakta enerjinin %90'ının ısıya dönüşmesi."]
    }
  ]
});

/* ------------------------------------------------------- 2.4 */
yazKonu({
  konu_id: "biyo_10_u02_k04",
  ders: DERS, tema: 2, tema_adi: "Ekoloji",
  baslik: "2.4 Madde Döngüleri",
  kazanim: "Su, karbon ve azot döngülerinin basamaklarını açıklar; insan etkinliklerinin bu döngülere etkisini yorumlar.",
  kaynak: kaynak("132-138"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Su, karbon ve azot döngülerinin basamaklarını açıklar.",
    "İnsan etkinliklerinin madde döngülerine etkisini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Su döngüsü hangi temel olaylarla gerçekleşir?",
      secenekler: [
        "Buharlaşma, yoğuşma ve terleme",
        "Fotosentez ve solunum",
        "Nitrifikasyon ve denitrifikasyon",
        "Yanma ve ayrışma"
      ],
      cozum: "Su döngüsü buharlaşma, yoğuşma ve terleme gibi temel olaylarla gerçekleşir; yağışla yeryüzüne dönen suyun bir kısmı yer altı sularını oluşturur (s.136).",
      fc: ["Su döngüsü nedir?", "Suyun yeryüzü ile gökyüzü arasındaki dolanımı."]
    },
    {
      bi: 0,
      metin: "Canlıların terlemesi ve solunumu su döngüsüne nasıl katkı sağlar?",
      secenekler: [
        "Yapılarındaki suyun bir kısmını buhar olarak atmosfere verir",
        "Suyu yer altı sularına aktarır",
        "Suyu oksijen ve hidrojene ayırır",
        "Yağış oluşumunu durdurur"
      ],
      cozum: "Terleme ve solunum sonucunda canlıların yapısındaki suyun bir kısmı buhar hâlinde atmosfere verilir (s.138).",
      fc: ["Yoğuşma nedir?", "Su buharının soğuyup sıvı hâle geçmesi."]
    },
    {
      bi: 0,
      metin: "Karbon atmosferde hangi formda bulunur?",
      secenekler: [
        "Karbondioksit (CO2)",
        "Elementel karbon",
        "Amonyak",
        "Nitrat"
      ],
      cozum: "Karbon atmosferde CO2, suda CO2 ve bikarbonat, karada ise doğal gaz, petrol, kömür ve kireç taşı olarak bulunur (s.136).",
      fc: ["Karbon döngüsü nedir?", "Karbonun atmosfer, toprak, su ve canlılar arasında dolaşımı."]
    },
    {
      bi: 0,
      metin: "Yeryüzündeki kireç taşları binlerce yıl içinde aşınarak içlerindeki karbonu açığa çıkarır. Bu durum kireç taşlarının hangi özelliğini gösterir?",
      secenekler: [
        "Karbonu hapsetmek ve aşınmayla döngüye bırakmak",
        "Atmosferdeki azotu bağlamak",
        "Suyu buharlaştırmak",
        "Fosil yakıt oluşturmak"
      ],
      cozum: "Kireç taşları karbonu hapseder; zamanla aşınmalarıyla içlerindeki karbon açığa çıkarak döngüye katılır (s.136).",
      fc: ["Fosil yakıt nedir?", "Canlı atıklarının toprak altında uzun süre kalmasıyla oluşan yakıt."]
    },
    {
      bi: 0,
      metin: "Fotosentez karbon döngüsünde hangi basamağı oluşturur?",
      secenekler: [
        "Atmosferdeki CO2'nin organik bileşik yapısına katılmasını",
        "Organik karbonun CO2'ye dönüşmesini",
        "Azotun nitrata çevrilmesini",
        "Suyun yoğuşmasını"
      ],
      cozum: "Yeşil bitkiler ve fitoplanktonlar CO2'yi fotosentezde kullanır; böylece karbon organik bileşiklerin yapısına katılır (s.136).",
      fc: ["Karbonun atmosfere dönüş yolları nedir?", "Solunum, ayrışma ve yanma."]
    },
    {
      bi: 1,
      metin: "Atmosferde gaz hâlinde bulunan azot, havanın yaklaşık yüzde kaçını oluşturur?",
      secenekler: [
        "%78",
        "%21",
        "%50",
        "%0,03"
      ],
      cozum: "Atmosferde gaz hâlinde bulunan azot havanın yaklaşık %78'ini oluşturur (s.137).",
      fc: ["Azot döngüsü nedir?", "Azotun atmosfer, toprak, su ve canlılar arasında dolaşımı."]
    },
    {
      bi: 1,
      metin: "Bitkiler topraktan azotu hangi formlarda alabilir?",
      secenekler: [
        "Amonyum (NH4⁺) ve nitrat (NO3⁻)",
        "Azot gazı (N2) olarak doğrudan",
        "Nitrik asit olarak",
        "Amino asit olarak"
      ],
      cozum: "Bitkiler atmosferdeki azotu doğrudan kullanamaz; azotun amonyum ve nitrata çevrilmesi gerekir, bitkiler bu formları topraktan alır (s.137).",
      fc: ["Azot fiksasyonu nedir?", "Atmosferik azotun bitkilerin kullanabileceği forma çevrilmesi."]
    },
    {
      bi: 1,
      metin: "Amonyağın toprak bakterileri tarafından önce nitrite sonra nitrata dönüştürülmesine ne ad verilir?",
      secenekler: [
        "Nitrifikasyon",
        "Denitrifikasyon",
        "Azot fiksasyonu",
        "Ayrışma"
      ],
      cozum: "Amonyağın nitrite, ardından nitrata dönüşmesi nitrifikasyon olarak adlandırılır (s.137).",
      fc: ["Nitrifikasyon nedir?", "Amonyağın nitrit ve nitrata dönüşmesi."]
    },
    {
      bi: 1,
      metin: "Topraktaki nitrat ve nitrit tuzlarının bakterilerle azot gazına çevrilip atmosfere verilmesine ne denir?",
      secenekler: [
        "Denitrifikasyon",
        "Nitrifikasyon",
        "Azot fiksasyonu",
        "Kemosentez"
      ],
      cozum: "Azotun topraktan tekrar atmosfere geçmesini sağlayan bu olaya denitrifikasyon denir (s.137).",
      fc: ["Denitrifikasyon nedir?", "Nitratın azot gazına çevrilip atmosfere verilmesi."]
    },
    {
      bi: 1,
      metin: "Fosil yakıtların yakılması karbon döngüsünü nasıl etkiler?",
      secenekler: [
        "Atmosfere verilen CO2 miktarını artırır",
        "Karbonu kireç taşına dönüştürür",
        "Azot fiksasyonunu hızlandırır",
        "Fotosentezi durdurur"
      ],
      cozum: "Odun ve fosil yakıtların yanmasıyla karbondioksit atmosfere verilir; bu durum atmosferdeki CO2 miktarını artırır (s.136).",
      fc: ["Küresel ısınmanın karbon döngüsüyle ilişkisi nedir?", "Yanma sonucu CO2 artışı sera etkisini güçlendirir."]
    }
  ]
});

/* ------------------------------------------------------- 2.5 */
yazKonu({
  konu_id: "biyo_10_u02_k05",
  ders: DERS, tema: 2, tema_adi: "Ekoloji",
  baslik: "2.5 Ekolojik Sürdürülebilirliğin Önemi",
  kazanim: "Doğal kaynakların sürdürülebilir kullanımını ve ekolojik sürdürülebilirliğin önemini açıklar.",
  kaynak: kaynak("139-142"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Yenilenebilen ve yenilenemeyen kaynakları ayırt eder.",
    "Sürdürülebilirlik uygulamalarının çevreye katkısını yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Sürdürülebilirlik hangi amaca hizmet eder?",
      secenekler: [
        "Çevreyi ve geleceği koruyarak kaynakları dengeli kullanmaya",
        "Kaynakları en kısa sürede tüketmeye",
        "Yalnızca ekonomik büyümeyi artırmaya",
        "Üretimi tamamen durdurmaya"
      ],
      cozum: "Sürdürülebilirlik, çevreyi ve geleceği korumak amacıyla kaynakların dengeli kullanılmasını esas alır (s.139).",
      fc: ["Doğal kaynak nedir?", "Doğada bulunan, canlıların yararlandığı madde ve enerji."]
    },
    {
      bi: 0,
      metin: "Güneş enerjisi, rüzgâr ve ısı pompası hangi kaynak grubunda yer alır?",
      secenekler: [
        "Yenilenebilen kaynaklar",
        "Yenilenemeyen kaynaklar",
        "Fosil yakıtlar",
        "Maden kaynakları"
      ],
      cozum: "Sıfır enerjili binalar enerjisini güneş paneli, rüzgâr enerjisi ve ısı pompası gibi yenilenebilir kaynaklardan üretir (s.139).",
      fc: ["Yenilenebilen kaynak nedir?", "Kendini yenileyebilen, tükenmeyen doğal kaynak."]
    },
    {
      bi: 0,
      metin: "Kömür, petrol ve doğal gaz hangi kaynak grubundadır?",
      secenekler: [
        "Yenilenemeyen kaynaklar",
        "Yenilenebilen kaynaklar",
        "Sürekli yenilenen kaynaklar",
        "Biyolojik kaynaklar"
      ],
      cozum: "Fosil yakıtlar milyonlarca yılda oluştuğu için tüketildiğinde kısa sürede yenilenemez; yenilenemeyen kaynaklardır (s.140).",
      fc: ["Yenilenemeyen kaynak nedir?", "Tükendiğinde kısa sürede yenilenemeyen kaynak."]
    },
    {
      bi: 0,
      metin: "“Net sıfır” hedefi hangi uluslararası anlaşmayla konulmuştur?",
      secenekler: [
        "Paris Anlaşması",
        "Kyoto Protokolü",
        "Montreal Protokolü",
        "Ramsar Sözleşmesi"
      ],
      cozum: "Net sıfır, Dünya'nın ortalama sıcaklığındaki artışı sınırlamak için sera gazı salımını sıfıra indirme hedefidir ve Paris Anlaşması ile konulmuştur (s.139).",
      fc: ["Net sıfır nedir?", "Sera gazı salımını sıfıra indirme hedefi."]
    },
    {
      bi: 0,
      metin: "Bir konut yıl boyunca tükettiği enerji kadarını güneş paneli ve ısı pompasından üretiyor. Bu konut hangi yapı sınıfına girer?",
      secenekler: [
        "Yıl boyunca tükettiği kadar enerjiyi yenilenebilir kaynaklardan üretmesi",
        "Hiç enerji tüketmeden tamamen şebekeye bağımlı kalması",
        "Isınma ve elektrik için yalnızca fosil yakıt kullanması",
        "Enerjisinin tamamını dışarıdan satın alarak tüketmesi"
      ],
      cozum: "Sıfır enerjili binalar yıl boyunca en az tükettiği kadar enerjiyi yenilenebilir kaynaklardan üretir (s.139).",
      fc: ["Neredeyse sıfır enerjili bina nedir?", "Enerjisinin bir kısmını yenilenebilir kaynaktan üreten verimli bina."]
    },
    {
      bi: 1,
      metin: "Sıfır enerjili binalarda enerji tüketiminin azalması hangi sonucu doğurur?",
      secenekler: [
        "Fosil yakıt ihtiyacı ve sera gazı emisyonu azalır",
        "Sera gazı emisyonu artar",
        "Yenilenebilir kaynak kullanımı sona erer",
        "Enerji maliyeti yükselir"
      ],
      cozum: "Enerji tüketimindeki azalma fosil yakıtlara olan ihtiyacı ve sera gazı emisyonlarını azaltır (s.139).",
      fc: ["Sera gazı emisyonunun azaltılması ne demektir?", "Atmosfere salınan gaz miktarının düşürülmesi."]
    },
    {
      bi: 1,
      metin: "Net sıfır hedefine ulaşılması tarımsal üretimi nasıl etkiler?",
      secenekler: [
        "Daha sürdürülebilir çevreyle verimlilik artar",
        "Tarımsal verimlilik tamamen düşer",
        "Uzun ömürlü ürün yetiştirmek zorlaşır",
        "Tarım yalnızca sera koşullarında yapılır"
      ],
      cozum: "Net sıfır tedbirleriyle daha sürdürülebilir bir çevre sağlanır, tarımsal verimlilik artar ve uzun ömürlü ürünlerin yetiştirilmesi kolaylaşır (s.139).",
      fc: ["Net sıfır hedefinin çevresel yararı nedir?", "Hava kirliliği ve okyanus ısınmasının önlenmesi."]
    },
    {
      bi: 1,
      metin: "Okyanus sıcaklığındaki artışın engellenmesi neden önemlidir?",
      secenekler: [
        "Deniz canlılarının yaşamını tehlikeye atan faktörleri önler",
        "Denizlerdeki tuz oranını artırır",
        "Fotosentezi hızlandırarak oksijeni tüketir",
        "Balık göçlerini durdurur"
      ],
      cozum: "Okyanus sıcaklığındaki artış engellendiğinde deniz canlılarının yaşamını tehlikeye atan faktörlerin oluşumu önlenir (s.139).",
      fc: ["Küresel ısınmanın denizlere etkisi nedir?", "Su sıcaklığı artışı deniz canlılarını tehdit eder."]
    },
    {
      bi: 1,
      metin: "Bir okul, elektriğini çatıdaki güneş panellerinden karşılayıp kalan ihtiyacını rüzgâr türbiniyle tamamlıyor. Bu uygulamanın sürdürülebilirlik açısından en önemli katkısı hangisidir?",
      secenekler: [
        "Yenilenebilir kaynak kullanımını artırarak sera gazı salımını azaltması",
        "Fosil yakıt tüketimini artırması",
        "Enerji maliyetini tamamen sıfırlaması",
        "Yenilenemeyen kaynaklara bağımlılığı artırması"
      ],
      cozum: "Yenilenebilir kaynaklardan üretilen enerji fosil yakıt ihtiyacını ve sera gazı emisyonunu azaltır; ekolojik sürdürülebilirliğin temel uygulamalarındandır (s.139).",
      fc: ["Ekolojik sürdürülebilirliğin önemi nedir?", "Kaynakları geleceğe taşır, kirliliği azaltır."]
    },
    {
      bi: 1,
      metin: "Hava kirliliğinin önlenmesi insan sağlığı açısından neden önemlidir?",
      secenekler: [
        "İnsan sağlığını ciddi biçimde tehdit eden etkenleri ortadan kaldırır",
        "Yalnızca ormanlık alanlardaki bitki örtüsünü korur",
        "Solunum yolu hastalıklarının görülme sıklığını artırır",
        "Yer altı ve yer üstü su kaynaklarını daha çok kirletir"
      ],
      cozum: "Net sıfır hedefiyle insan sağlığını ciddi anlamda tehdit eden hava kirliliği önlenebilir (s.139).",
      fc: ["Çevre kirliliğinin canlılara etkisi nedir?", "Tüm canlılar için tehlike oluşturur."]
    }
  ]
});

/* ------------------------------------------------------- 2.6 */
yazKonu({
  konu_id: "biyo_10_u02_k06",
  ders: DERS, tema: 2, tema_adi: "Ekoloji",
  baslik: "2.6 Ekolojik Sürdürülebilirliği Kısıtlayan Durumlar",
  kazanim: "Ekolojik sürdürülebilirliği kısıtlayan çevre sorunlarının nedenlerini ve ekosistemlere etkilerini açıklar.",
  kaynak: kaynak("143-154"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Habitat kaybı ve kirlilik türlerinin nedenlerini açıklar.",
    "Çevre sorunlarının ekosistemlere etkisini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir canlının yaşamını sürdürebilmesi için gerekli yaşam alanlarının insan faaliyetleriyle tamamen yok olmasına ne denir?",
      secenekler: [
        "Habitat kaybı",
        "Habitat parçalanması",
        "Ötrofikasyon",
        "Biyoremediasyon"
      ],
      cozum: "Yaşam alanlarının tümüyle yok olması habitat kaybı, büyük ve sürekli alanların küçük parçalara ayrılması ise habitat parçalanmasıdır (s.146).",
      fc: ["Habitat kaybı nedir?", "Gerekli yaşam alanının insan etkisiyle yok olması."]
    },
    {
      bi: 0,
      metin: "Ozon tabakası atmosferde hangi aralıkta bulunur?",
      secenekler: [
        "Yer yüzeyinin 15-50 km yukarısında",
        "Yer yüzeyinin 1-5 km yukarısında",
        "Deniz seviyesinde",
        "Atmosferin 100 km üzerinde"
      ],
      cozum: "Atmosferdeki ozonun %90'ı stratosferin üst kısmında, yer yüzeyinin 15-50 km arasında bulunur (s.148).",
      fc: ["Ozon tabakası nedir?", "Stratosferde morötesi ışınları tutan O3 tabakası."]
    },
    {
      bi: 0,
      metin: "Ozon moleküllerinin parçalanmasına neden olan maddelerin başında hangisi gelir?",
      secenekler: [
        "Kloroflorokarbonlar (CFC)",
        "Karbondioksit gazı",
        "Metan gazı",
        "Amonyum iyonu"
      ],
      cozum: "Ozon moleküllerini parçalayan maddelerin başında CFC gelir; zararı fark edilince 1987'de Montreal Protokolü ile kullanımı yasaklanmıştır (s.148).",
      fc: ["Montreal Protokolü nedir?", "1987'de CFC kullanımını yasaklayan anlaşma."]
    },
    {
      bi: 0,
      metin: "Bir göle uzun yıllar boyunca arıtılmadan boşaltılan evsel atık ve gübreler suda alg patlamasına yol açmıştır. Bu süreci başlatan temel değişim hangisidir?",
      secenekler: [
        "Suda azot ve fosfor miktarının artması",
        "Suda oksijen miktarının artması",
        "Suyun sıcaklığının düşmesi",
        "Toprağın ağır metallerle kirlenmesi"
      ],
      cozum: "Kimyasal gübre ve atıkların suya karışması azot ve fosforu artırır; bu besinler alg ve su bitkilerinin kontrolsüz çoğalmasına yol açarak ötrofikasyonu başlatır (s.149).",
      fc: ["Alg patlaması nedir?", "Besin tuzları artınca alglerin kontrolsüz çoğalması."]
    },
    {
      bi: 0,
      metin: "Toprakta veya suda bulunan zararlı kirleticileri uzaklaştırmak için canlı organizmaların kullanıldığı yönteme ne ad verilir?",
      secenekler: [
        "Biyoremediasyon",
        "Ötrofikasyon",
        "Nitrifikasyon",
        "Fiksasyon"
      ],
      cozum: "Kirleticilerin bakteri, maya, bitki veya solucan gibi organizmalarla zararsız biçimlere dönüştürüldüğü yöntem biyoremediasyondur (s.150).",
      fc: ["Biyoremediasyon nedir?", "Kirleticilerin canlı organizmalarla zararsızlaştırılması."]
    },
    {
      bi: 1,
      metin: "Ötrofikasyon ilerleyen bir gölde çözünmüş oksijen neden hızla azalır?",
      secenekler: [
        "Ölen bitkilerin artırdığı organik maddeyi ayrıştıran bakteriler oksijen tüketir",
        "Algler suyu ısıtarak oksijeni buharlaştırır",
        "Göl suyu buharlaşarak çekilir",
        "Fotosentez tamamen durur ve oksijen üretilmez"
      ],
      cozum: "Işık kesildiği için dipteki bitkiler ölür, artan organik madde ayrıştırıcı bakterilerin faaliyetini hızlandırır ve bu süreçte çözünmüş oksijen tüketilir (s.149).",
      fc: ["Ötrofikasyonun canlılara etkisi nedir?", "Oksijen azalır, balıklar ve diğer canlılar ölür."]
    },
    {
      bi: 1,
      metin: "Asit yağmurları toprağa indiğinde hangi zincirle insan sağlığını etkiler?",
      secenekler: [
        "Topraktaki ağır metalleri çözerek suya ve besin zincirine taşır",
        "Toprağı verimlileştirip besin değerini artırır",
        "Yalnızca yapıların yüzeyinde kalır",
        "Topraktaki azotu gaz hâline dönüştürür"
      ],
      cozum: "Asit yağmurları topraktaki ağır metalleri göllere ve akarsulara taşır; metaller besin zincirine girip canlı dokularında birikerek sağlık sorunlarına yol açar (s.148).",
      fc: ["Asit yağmuru nedir?", "pH değeri 5,5'in altına inen asidik yağış."]
    },
    {
      bi: 1,
      metin: "Bir akarsu havzasında bitki örtüsü yok edildikten sonra taşınan toprak baraj gölünü doldurmuştur. Bu durumun ortaya çıkardığı sonuç hangisidir?",
      secenekler: [
        "Enerji üretimi ve içme suyu miktarı azalır",
        "Su kalitesi artar",
        "Biyoçeşitlilik çoğalır",
        "Tarım arazileri genişler"
      ],
      cozum: "Taşınan toprak baraj ve gölleri doldurur; enerji üretimi azalır, içme ve kullanma suyu miktarı düşer, sudaki biyoçeşitlilik azalır (s.152).",
      fc: ["Erozyon nedir?", "Bitki örtüsünden yoksun toprağın su ve rüzgârla taşınması."]
    },
    {
      bi: 1,
      metin: "Bir bölgedeki orman yangınlarının yaklaşık %97'si hangi dönemde görülür?",
      secenekler: [
        "Yaz aylarında",
        "Kış aylarında",
        "İlkbahar aylarında",
        "Sonbahar aylarında"
      ],
      cozum: "Ülkemizde orman yangınlarının yaklaşık %97'si yaz aylarında görülmektedir (s.152).",
      fc: ["Orman yangınının doğal sebebi nedir?", "Yıldırım, volkanik patlama veya metan patlaması."]
    },
    {
      bi: 1,
      metin: "Bir kıyı kentinde sanayi ve trafikten kaynaklanan sera gazı salımı hızla artmış, kentin ortalama sıcaklığı yükselmiştir. Bu durumun doğrudan sonucu hangisidir?",
      secenekler: [
        "Küresel ısınma ve buna bağlı iklim değişiklikleri",
        "Ozon tabakasının kalınlaşması",
        "Deniz seviyesinin düşmesi",
        "Erozyonun tamamen durması"
      ],
      cozum: "Sera gazlarının artması yeryüzüne yakın tabakaların yapay olarak ısınmasına, yani küresel ısınmaya ve iklim değişikliklerine yol açar (s.151).",
      fc: ["Sera etkisi nedir?", "Sera gazlarının enerjiyi tutarak atmosferi ısıtması."]
    }
  ]
});

/* ------------------------------------------------------- 2.7 */
yazKonu({
  konu_id: "biyo_10_u02_k07",
  ders: DERS, tema: 2, tema_adi: "Ekoloji",
  baslik: "2.7 Ekolojik Ayak İzinin Küçültülmesi",
  kazanim: "Ekolojik, karbon ve su ayak izi kavramlarını açıklar; ayak izini küçültme yollarını yorumlar.",
  kaynak: kaynak("155-159"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Ekolojik, karbon ve su ayak izini tanımlar.",
    "Ayak izini küçültmeye yönelik uygulamaları değerlendirir."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir öğrenci ulaşım, beslenme ve enerji kullanımını hesaplayarak doğal kaynak tüketimini ölçmüştür. Öğrencinin hesapladığı kavram hangisidir?",
      secenekler: [
        "Ekolojik ayak izi",
        "Taşıma kapasitesi",
        "Biyolojik birikim",
        "Karbon döngüsü"
      ],
      cozum: "Ekolojik ayak izi; kişi, topluluk veya ülkenin doğal kaynak tüketimini ve çevreye etkisini ölçer (s.155).",
      fc: ["Ekolojik ayak izi nedir?", "Doğal kaynak tüketimini ve çevre etkisini ölçen kavram."]
    },
    {
      bi: 0,
      metin: "Karbon ayak izinde en büyük paya sahip etmen hangisidir?",
      secenekler: [
        "Fosil yakıt kullanımı ve enerji tüketimi",
        "Yalnızca evsel su kullanımı",
        "Gıda ambalajlarının geri dönüşümü",
        "Orman alanlarının korunması"
      ],
      cozum: "Karbon ayak izinde en büyük pay fosil yakıt kullanımı, enerji tüketimi, sanayileşme, hayvancılık ve atık maddelerindir (s.155).",
      fc: ["Karbon ayak izi nedir?", "Etkinlikler sonucu salınan sera gazı miktarı."]
    },
    {
      bi: 0,
      metin: "Su ayak izi hangi niceliği ifade eder?",
      secenekler: [
        "Tüketilen veya kirlenen toplam tatlı su hacmini",
        "Bir bölgeye düşen yıllık yağış miktarını",
        "Suyun içindeki çözünmüş oksijen miktarını",
        "Yer altı suyunun derinliğini"
      ],
      cozum: "Su ayak izi, tüketim veya üretim aşamasında kullanılan, buharlaştırılan ve kirlenen toplam tatlı su hacmidir (s.155).",
      fc: ["Su ayak izi nedir?", "Kullanılan ve kirletilen toplam tatlı su hacmi."]
    },
    {
      bi: 0,
      metin: "Dünyada kişi başı yıllık ortalama su tüketimi yaklaşık ne kadardır?",
      secenekler: [
        "800 m³",
        "80 m³",
        "8.000 m³",
        "80.000 m³"
      ],
      cozum: "Dünyada kişi başı yıllık su tüketimi ortalama 800 m³ civarındadır (s.155).",
      fc: ["Su kıtlığının en önemli nedeni nedir?", "Su kaynaklarının sorumsuzca tüketilmesi."]
    },
    {
      bi: 0,
      metin: "Hayvansal üretim sonucu oluşan atıklar hangi yöntemle gübreye dönüştürülebilir?",
      secenekler: [
        "Kompostlama",
        "Yakma",
        "Denize boşaltma",
        "Buharlaştırma"
      ],
      cozum: "Hayvansal atıklar doğrudan, tarımsal üretim atıkları ise kompostlandıktan sonra gübre olarak kullanılabilir (s.156).",
      fc: ["Kompost nedir?", "Organik atıkların ayrıştırılarak gübreye dönüştürülmesi."]
    },
    {
      bi: 1,
      metin: "Bir fabrika gıda atıklarını biyogaz üretiminde kullanmaya başladıktan sonra fosil yakıt alımı azalmıştır. Bu uygulamanın ayak izine etkisi hangisidir?",
      secenekler: [
        "Atıkları enerjiye çevirerek fosil yakıt ihtiyacını azaltır",
        "Atık miktarını artırarak ayak izini büyütür",
        "Su tüketimini tamamen ortadan kaldırır",
        "Gıda üretimini durdurur"
      ],
      cozum: "Gıda atıklarından biyogaz ve biyoetanol üretimi hem atığı değerlendirir hem de fosil yakıt kullanımını azaltarak ayak izini küçültür (s.156).",
      fc: ["Biyogaz nedir?", "Organik atıkların çürütülmesiyle elde edilen yakıt."]
    },
    {
      bi: 1,
      metin: "Gıda taşımacılığında fosil yakıtlı araçlar yerine güneş panelinden şarj edilen elektrikli araçların kullanılması hangi ayak izini doğrudan küçültür?",
      secenekler: [
        "Karbon ayak izini",
        "Su ayak izini",
        "Toprak kirliliğini",
        "Radyoaktif kirliliği"
      ],
      cozum: "Taşımada fosil yakıt yerine yenilenebilir kaynaklardan üretilen elektrik kullanmak sera gazı salımını, dolayısıyla karbon ayak izini azaltır (s.156).",
      fc: ["Ayak izini küçültmenin temel yolu nedir?", "Fosil yakıt yerine yenilenebilir enerji kullanmak."]
    },
    {
      bi: 1,
      metin: "Gıda üretiminde oluşan atık suların arıtılarak tekrar kullanılması hangi sonucu doğurur?",
      secenekler: [
        "Tatlı su tüketimini azaltarak su ayak izini küçültür",
        "Tatlı su tüketimini artırarak su ayak izini büyütür",
        "Sera gazı salımını artırarak karbon ayak izini büyütür",
        "Gıda atıklarını çoğaltarak atık miktarını artırır"
      ],
      cozum: "Atık suyun arıtılıp yeniden kullanılması tüketilen tatlı su hacmini düşürür, yani su ayak izini küçültür (s.156).",
      fc: ["Atık su geri kazanımının yararı nedir?", "Tatlı su tüketimini azaltması."]
    },
    {
      bi: 1,
      metin: "Bir ailenin gıda ambalajı atıklarını ayrıştırıp geri dönüşüme vermesi neden ekolojik ayak izini küçültür?",
      secenekler: [
        "Yeni ham madde ihtiyacını ve atık miktarını azaltır",
        "Gıda tüketimini artırır",
        "Enerji tüketimini tamamen sıfırlar",
        "Suyun kirlenmesini hızlandırır"
      ],
      cozum: "Ambalaj atıklarının geri dönüştürülmesi hem atığın çevreye etkisini azaltır hem de değerli ham maddelerin kazanılmasını sağlar (s.155-156).",
      fc: ["Geri dönüşümün çevresel yararı nedir?", "Ham madde ihtiyacını ve atığı azaltması."]
    },
    {
      bi: 1,
      metin: "Günümüzde insanlığın kaynak ihtiyacı Dünya'nın sunduğu alanın yaklaşık yüzde kaçına ulaşmıştır?",
      secenekler: [
        "%160",
        "%60",
        "%16",
        "%100"
      ],
      cozum: "Bugün ihtiyaç duyulan kaynakları sağlamak ve atıkları yok etmek için gereken alan Dünya'nın yaklaşık %160'ı kadardır; yani doğanın sunduğundan fazlası tüketilmektedir (s.155).",
      fc: ["Ekolojik açık nedir?", "Doğanın sunduğundan fazlasının tüketilmesi."]
    }
  ]
});

/* ------------------------------------------------------- 2.8 */
yazKonu({
  konu_id: "biyo_10_u02_k08",
  ders: DERS, tema: 2, tema_adi: "Ekoloji",
  baslik: "2.8 Doğal Kaynakların ve Biyoçeşitliliğin Korunması",
  kazanim: "Biyoçeşitliliğin korunma nedenlerini açıklar, tür-alan ve alan dışı koruma çalışmalarını ayırt eder.",
  kaynak: kaynak("160-167"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Biyoçeşitliliğin korunma gerekçelerini açıklar.",
    "Tür, alan ve alan dışı koruma çalışmalarını ayırt eder."
  ],
  items: [
    {
      bi: 0,
      metin: "Biyoçeşitlilik hangi çeşitlilikleri birlikte ele alır?",
      secenekler: [
        "Genetik çeşitliliği ve ekosistem çeşitliliğini",
        "Yalnızca tür çeşitliliğini",
        "Yalnızca genetik çeşitliliği",
        "Yalnızca iklim çeşitliliğini"
      ],
      cozum: "Biyoçeşitlilik, tek hücrelilerden büyük organizmalara kadar tüm canlıların genetik çeşitliliklerini ve yaşadıkları ortamları (ekosistem çeşitliliği) birlikte ele alır (s.160).",
      fc: ["Biyoçeşitlilik nedir?", "Canlıların genetik ve ekosistem çeşitliliğinin bütünü."]
    },
    {
      bi: 0,
      metin: "Amik Gölü'nün tarım amacıyla kurutulması sonucunda Türkiye'de nesli tükenen canlı hangisidir?",
      secenekler: [
        "Yılanboyun kuşu",
        "Akdeniz foku",
        "Kelaynak",
        "Hatay dağ ceylanı"
      ],
      cozum: "Yılanboyun kuşu, Amik Gölü'nün tarım amacıyla kurutulması sonucunda Türkiye'de nesli tükenen canlılardandır (s.160).",
      fc: ["Habitat kaybının sonucu nedir?", "Türlerin neslinin tükenmesi."]
    },
    {
      bi: 0,
      metin: "Sulak alanların korunmasını amaçlayan uluslararası sözleşme hangisidir?",
      secenekler: [
        "Ramsar Sözleşmesi",
        "Bern Sözleşmesi",
        "Montreal Protokolü",
        "Paris Anlaşması"
      ],
      cozum: "Ramsar Sözleşmesi, su kuşları yaşama ortamı olarak uluslararası öneme sahip sulak alanların korunmasını amaçlar (s.164).",
      fc: ["Ramsar Sözleşmesi nedir?", "Sulak alanların korunmasını amaçlayan sözleşme."]
    },
    {
      bi: 0,
      metin: "Türlerin kendi habitatlarında korunması amacıyla yapılan çalışmalara ne ad verilir?",
      secenekler: [
        "Alan koruma (yerinde koruma)",
        "Alan dışı koruma",
        "Tür koruma",
        "Gen bankacılığı"
      ],
      cozum: "Millî park, tabiat koruma alanı, tabiat parkı, yaban hayatı geliştirme sahası ve sulak alanlarda yürütülen çalışmalar alan koruma (yerinde koruma) çalışmalarıdır (s.165).",
      fc: ["Yerinde koruma nedir?", "Türlerin kendi habitatında korunması."]
    },
    {
      bi: 0,
      metin: "Tohum bankaları, botanik bahçeleri ve arboretumlar hangi koruma grubunda yer alır?",
      secenekler: [
        "Alan dışı koruma",
        "Alan koruma",
        "Yerinde koruma",
        "Tür koruma"
      ],
      cozum: "Ağaç parkı (arboretum), botanik bahçe, gen bankası, arazi gen bankası ve tohum bankaları alan dışı koruma çalışmalarıdır (s.166).",
      fc: ["Alan dışı koruma nedir?", "Türlerin doğal alanı dışında korunması."]
    },
    {
      bi: 1,
      metin: "Kelaynakların korunması için Şanlıurfa-Birecik'te üreme istasyonu kurulması hangi koruma çalışmasına örnektir?",
      secenekler: [
        "Tür koruma çalışması",
        "Alan koruma çalışması",
        "Tohum bankacılığı",
        "Arazi gen bankacılığı"
      ],
      cozum: "Nesli tehlike altındaki kelaynaklar, kurulan üreme istasyonuyla koruma altına alınmıştır; bu bir tür koruma çalışmasıdır (s.165).",
      fc: ["Tür koruma çalışması nedir?", "Nesli tehlike altındaki türlerin korunması."]
    },
    {
      bi: 1,
      metin: "Türkiye'de deniz kaplumbağalarına ait kaç önemli üreme bölgesi bulunmaktadır?",
      secenekler: [
        "21",
        "12",
        "55",
        "3.339"
      ],
      cozum: "Türkiye'de deniz kaplumbağalarına ait 21 önemli üreme bölgesi bulunur; bu alanlar doğal sit statüsü kazandırılarak korunmuştur (s.165).",
      fc: ["Doğal sit alanı nedir?", "Koruma altına alınmış doğal değer taşıyan alan."]
    },
    {
      bi: 1,
      metin: "Ege Tarımsal Araştırma Enstitüsündeki Ulusal Tohum Gen Bankasında kaç türe ait tohum örneği korunmaktadır?",
      secenekler: [
        "3.339 türe ait 55.000'den fazla örnek",
        "3.339 türe ait 5.000 örnek",
        "21 türe ait 55.000 örnek",
        "55.000 türe ait 3.339 örnek"
      ],
      cozum: "Enstitü kapsamında 3.339 türe ait 55.000'den fazla tohum örneği korunmaktadır; Ankara'daki Türkiye Tohum Gen Bankasında ise 51.000 tohum bulunur (s.166).",
      fc: ["Tohum gen bankasının işlevi nedir?", "Bitki tohumlarını uzun süre saklayıp korumak."]
    },
    {
      bi: 1,
      metin: "Ülkemizin biyolojik zenginliğini tanımlamak için TÜBİTAK tarafından oluşturulan yapı hangisidir?",
      secenekler: [
        "Türkiye Bitkileri Veri Tabanı",
        "Ulusal Arazi Gen Bankası",
        "Türkiye Tohum Gen Bankası",
        "Atatürk Arboretumu"
      ],
      cozum: "TÜBİTAK tarafından Türkiye Bitkileri Veri Tabanı; 2007-2013 arasında gönüllü uzmanlarla Nuh'un Gemisi Ulusal Biyolojik Çeşitlilik Veri Tabanı oluşturulmuştur (s.164).",
      fc: ["Nuh'un Gemisi Veri Tabanı nedir?", "Ulusal biyolojik çeşitlilik veri tabanı."]
    },
    {
      bi: 1,
      metin: "Bir üniversitenin yerleşkesine hem yurt içinden hem yurt dışından bitki türleri getirilerek botanik bahçe kurulmuştur. Bu uygulamanın biyoçeşitlilik açısından işlevi hangisidir?",
      secenekler: [
        "Türleri doğal yaşam alanları dışında koruma altına alması",
        "Türlerin doğal ortamında korunmasını sağlaması",
        "Yalnızca odunsu bitkilerin kesilmesini önlemesi",
        "Nesli tükenmiş türleri yeniden oluşturması"
      ],
      cozum: "Botanik bahçeleri alan dışı koruma sağlar; hem ülkemizde yetişen hem dışarıdan gelen türlerin korunmasını mümkün kılar (s.166).",
      fc: ["Arboretum nedir?", "Ağırlıklı olarak ağaç ve odunsu bitkilerin yetiştirildiği ağaç parkı."]
    }
  ]
});

/* ------------------------------------------------------- 2.9 */
yazKonu({
  konu_id: "biyo_10_u02_k09",
  ders: DERS, tema: 2, tema_adi: "Ekoloji",
  baslik: "2.9 Atık Yönetimi",
  kazanim: "Atık yönetiminin aşamalarını ve bertaraf yöntemlerini açıklar; atık yönetiminin çevreye katkısını yorumlar.",
  kaynak: kaynak("168-174"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Atık yönetimi aşamalarını ve bertaraf yöntemlerini açıklar.",
    "Atık yönetimi uygulamalarının çevresel katkısını yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Atık yönetiminin ilk hedefi hangisidir?",
      secenekler: [
        "Atık oluşumunu önlemek ve kaynağında azaltmak",
        "Atıkları düzenli depolama sahasında toplamak",
        "Atıkları yakarak enerji üretmek",
        "Atıkları ihraç etmek"
      ],
      cozum: "Atık yönetimi öncelikle atığın oluşumunu önlemeyi ve kaynağında azaltılmasını hedefler; ardından yeniden kullanım, ayrıştırma, toplama ve geri kazanım gelir (s.171).",
      fc: ["Atık yönetimi nedir?", "Atığın önlenmesi, toplanması, geri kazanımı ve bertarafı süreçleri."]
    },
    {
      bi: 0,
      metin: "Organik atıkların kontrollü koşullarda humusa kadar biyolojik olarak ayrıştırılmasına ne denir?",
      secenekler: [
        "Kompostlaştırma",
        "Biyometanizasyon",
        "Yakma",
        "Bertaraf"
      ],
      cozum: "Kompostlaştırma, organik atıkların kontrollü şartlarda humus veya humus benzeri ürüne ayrıştırılmasıdır; oluşan ürüne kompost denir (s.173).",
      fc: ["Kompost nedir?", "Organik atıkların ayrışmasıyla oluşan humus benzeri ürün."]
    },
    {
      bi: 0,
      metin: "Organik artıkların oksijensiz ortamda parçalanarak biyogaza dönüştürülmesi işlemi hangisidir?",
      secenekler: [
        "Biyometanizasyon",
        "Kompostlaştırma",
        "Nitrifikasyon",
        "Biyoremediasyon"
      ],
      cozum: "Biyometanizasyonda organik artıklar oksijensiz ortamda parçalanarak metan ve karbondioksitten oluşan biyogaza dönüşür (s.173).",
      fc: ["Biyometanizasyon nedir?", "Organik atıkların oksijensiz ortamda biyogaza dönüşmesi."]
    },
    {
      bi: 0,
      metin: "Bir tesiste toplanan katı atıklar yakılarak hacmi küçültülmüş, açığa çıkan termal enerjiyle elektrik üretilmiştir. Bu yöntemin temel amacı hangisidir?",
      secenekler: [
        "Katı atıkların hacmini azaltmak",
        "Atıkları komposta çevirmek",
        "Biyogaz üretmek",
        "Atıkları toprağa gömmek"
      ],
      cozum: "Yakma yönteminin temel amacı katı atıkların hacmini azaltmaktır; açığa çıkan termal enerji buhar türbiniyle elektriğe dönüştürülür (s.173).",
      fc: ["Bertaraf nedir?", "Atıkların yok edilmesi, geri dönüştürülmesi ve uzaklaştırılması."]
    },
    {
      bi: 0,
      metin: "Düzenli depolama sahalarında sızıntı suyunun yer altı sularına karışmasını önlemek için ne yapılır?",
      secenekler: [
        "Atıklar serilip sıkıştırıldıktan sonra üstü örtülür",
        "Atıklar açık araziye rastgele boşaltılır",
        "Atıklar suyla karıştırılır",
        "Saha tamamen boş bırakılır"
      ],
      cozum: "Düzenli depolamada atıklar çevreye en az etki yapacak biçimde serilip sıkıştırılır ve üstü örtülür; böylece sızıntı suyunun yer altı suyuna karışması önlenir (s.174).",
      fc: ["Düzenli depolama nedir?", "Atıkların sıkıştırılıp örtülerek depolandığı saha."]
    },
    {
      bi: 1,
      metin: "Bir tesiste organik atıklar oksijensiz ortamda parçalanarak biyogaz elde edilmiş ve bu gaz ısıtmada kullanılmıştır. Bu uygulamanın sera gazı açısından katkısı hangisidir?",
      secenekler: [
        "Fosil yakıt kullanımını azaltarak sera gazını azaltır",
        "Metan salımını tamamen artırır",
        "Sera gazı oluşumunu hızlandırır",
        "Atıkların hacmini büyütür"
      ],
      cozum: "Biyogaz üretimi fosil yakıt kullanımını azalttığı için sera gazlarının azalmasına katkı sağlar; ayrıca organik gübre elde edilir (s.173).",
      fc: ["Biyogaz nedir?", "Metan ve karbondioksitten oluşan yanabilir gaz."]
    },
    {
      bi: 1,
      metin: "Kompostun toprağa verilmesi bitki verimini neden artırır?",
      secenekler: [
        "Mikroorganizma faaliyetini artırıp toprak özelliklerini iyileştirir",
        "Toprağın hacmini küçültür",
        "Topraktaki azotu gaz hâline dönüştürür",
        "Toprağı tamamen steril hâle getirir"
      ],
      cozum: "Kompost toprakta mikroorganizma faaliyetini artırarak fiziksel, kimyasal ve biyolojik özellikleri iyileştirir, verimi artırır (s.173).",
      fc: ["Humus nedir?", "Organik maddenin ayrışmasıyla oluşan koyu renkli toprak maddesi."]
    },
    {
      bi: 1,
      metin: "Düzensiz depolama sahalarının oluşturduğu riskler arasında hangisi yer alır?",
      secenekler: [
        "Yer altı ve yüzeysel suların kirlenmesi ve heyelan riski",
        "Biyoçeşitliliğin artması",
        "Sera gazı oluşumunun tamamen durması",
        "Toprağın humusça zenginleşmesi"
      ],
      cozum: "Düzensiz depolanan atıklar su kirliliği, hava ve görüntü kirliliği, zararlı organizma üremesi ve heyelan riski taşır (s.174).",
      fc: ["Düzensiz depolama nedir?", "Önlem alınmadan atıkların açık araziye boşaltılması."]
    },
    {
      bi: 1,
      metin: "Elektronik atıkların kütlece en büyük bölümünü hangi bileşen oluşturur?",
      secenekler: [
        "Metaller (%49)",
        "Plastik malzemeler (%33)",
        "Katot ışını tüpleri (%12)",
        "Cam (%6)"
      ],
      cozum: "E-atıkların kütlece %49'unu metaller, %33'ünü plastikler, %12'sini katot ışını tüpleri oluşturur (s.168).",
      fc: ["E-atık nedir?", "Ömrünü tamamlamış elektronik cihaz atığı."]
    },
    {
      bi: 1,
      metin: "Bir belediye Sıfır Atık Projesi kapsamında geri kazanım oranını 2021 yılında hangi düzeye yükseltmiştir?",
      secenekler: [
        "%27,2",
        "%13",
        "%49",
        "%74,7"
      ],
      cozum: "Sıfır Atık Projesi'yle Türkiye'de %13 olan geri kazanım oranı 2021 yılında %27,2'ye yükseltilmiştir (s.169).",
      fc: ["Sıfır Atık Projesi nedir?", "Atığı azaltmayı ve geri kazanımı hedefleyen atık yönetimi yaklaşımı."]
    }
  ]
});
