#!/usr/bin/env node
/* Tarih 10 · Tema 3 (Cihan Devleti Osmanlı, 1453-1683) havuzları.
   Kaynak: MEB Tarih 10 ders kitabı (2025). JSON sayfa = basılı sayfa + 1. */
"use strict";

const { yaz } = require("../yazicilar/yaz.js");

const KAYNAK = "MEB Tarih 10 ders kitabı (2025)";

/* ---------------------------------------------------------------- 3.1 */
yaz("tar_10_t03_c01", KAYNAK + ", s.208-234", [
  {
    si: 0,
    metin: "Fatih’in 1453’te İstanbul’u fethetmesi, Osmanlı’ya hangi stratejik üstünlüğü kazandırmıştır?",
    secenekler: [
      "İki kıta arasındaki boğaz geçişinin denetlenmesini",
      "Akdeniz’in tamamen Türk gölü olmasını",
      "Kırım’ın doğrudan ilhak edilmesini",
      "Safevi Devleti’nin yıkılmasını"
    ],
    dogru: 0,
    cozum: "İstanbul’un fethiyle Karadeniz ile Akdeniz arasındaki geçiş yolu Osmanlı denetimine girmiş, başkent taşınarak devletin merkezi güçlenmiştir.",
    fc: ["1453 fethinin stratejik sonucu nedir?", "Boğazlar üzerindeki denetim Osmanlı’ya geçmiş, başkent İstanbul olmuştur."]
  },
  {
    si: 0,
    metin: "1473 Otlukbeli Savaşı’nda yenilgiye uğratılan devlet aşağıdakilerden hangisidir?",
    secenekler: ["Akkoyunlular", "Safeviler", "Memlûklar", "Karamanoğulları"],
    dogru: 0,
    cozum: "Fatih, Akkoyunlu hükümdarı Uzun Hasan’ı Otlukbeli’nde yenerek Anadolu’daki rakip bir tehdidi kaldırmıştır.",
    fc: ["Otlukbeli Savaşı’nın sonucu nedir?", "Akkoyunlu tehdidi kırılmış ve Anadolu’da Osmanlı üstünlüğü pekişmiştir."]
  },
  {
    si: 0,
    metin: "1514 Çaldıran Savaşı’nın ardından Doğu Anadolu’da hangi gelişme yaşanmıştır?",
    secenekler: [
      "Diyarbakır başta olmak üzere birçok şehrin Osmanlı’ya geçmesi",
      "Safevilerin Bağdat’ı egemenliğine alması",
      "Memlûklerin Anadolu’ya girmesi",
      "Akkoyunluların yeniden kurulması"
    ],
    dogru: 0,
    cozum: "Çaldıran sonrası Diyarbakır ve çevresindeki birçok şehir Osmanlı idaresine geçmiş, Tebriz-Halep ipek yolu denetimi sağlanmıştır.",
    fc: ["Çaldıran Savaşı’nın tarafları nedir?", "Yavuz Sultan Selim’in Osmanlı ordusu ile Safevi Şah İsmail’in kuvvetleridir."]
  },
  {
    si: 0,
    metin: "Yavuz Sultan Selim’in 1516-1517 seferleri sonucunda ortadan kaldırılan devlet hangisidir?",
    secenekler: ["Memlûk Devleti", "Safevi Devleti", "Akkoyunlular", "Dulkadiroğulları"],
    dogru: 0,
    cozum: "Mercidabık (1516) ve Ridaniye (1517) savaşlarıyla Memlûk Devleti yıkılmış, Suriye, Mısır ve Hicaz Osmanlı’ya bağlanmıştır.",
    fc: ["Mercidabık ve Ridaniye savaşlarının yıktığı devletin adı nedir?", "Memlûk Devleti’ni ortadan kaldırmıştır."]
  },
  {
    si: 1,
    metin: "Tabloda 1453-1683 arasındaki dört gelişme ve Osmanlı’ya kazandırdıkları verilmiştir. Tabloya göre Akdeniz’de Osmanlı üstünlüğünü gösteren gelişme hangisidir?",
    secenekler: ["Preveze Deniz Savaşı", "Mohaç Muharebesi", "Otlukbeli Savaşı", "Çaldıran Savaşı"],
    dogru: 0,
    cozum: "Tabloda Akdeniz’de Osmanlı donanmasının üstünlük kurması Preveze Deniz Savaşı’nın sonucu olarak verilmiştir.",
    gorsel: {
      tip: "tablo",
      basliklar: ["Gelişme", "Yıl", "Kazanım"],
      satirlar: [
        ["Mohaç", "1526", "Orta Avrupa’da üstünlük sağlandı"],
        ["Preveze", "1538", "Akdeniz’de donanma üstünlüğü kuruldu"],
        ["Zigetvar", "1566", "Habsburg sınırında güvenlik sağlandı"],
        ["Zitvatorok", "1606", "Avusturya ile eşit statüde antlaşma yapıldı"]
      ]
    },
    fc: ["Preveze Deniz Savaşı’nın önemi nedir?", "Akdeniz’de Osmanlı donanmasının üstünlüğünü kanıtlayan zaferdir."]
  },
  {
    si: 1,
    metin: "Mohaç (1526) ve Zigetvar (1566) seferlerinin ortak amacı aşağıdakilerden hangisidir?",
    secenekler: [
      "Orta Avrupa’da Habsburg üstünlüğünü kırmak",
      "Akdeniz’de Venedik’i etkisizleştirmek",
      "Safevilerin Bağdat’ı almasını önlemek",
      "Memlûk topraklarını ele geçirmek"
    ],
    dogru: 0,
    cozum: "Her iki sefer de Macaristan üzerinden Habsburg etki alanını daraltmayı ve Orta Avrupa’daki Osmanlı konumunu güçlendirmeyi amaçlamıştır.",
    fc: ["Kanuni’nin Orta Avrupa politikasının hedefi nedir?", "Macaristan üzerinden Habsburg etkisini kırmak ve sınır güvenliğini sağlamaktır."]
  },
  {
    si: 1,
    metin: "Preveze (1538) ile İnebahtı (1571) deniz savaşlarının Osmanlı açısından temel farkı nedir?",
    secenekler: [
      "Biri büyük bir zafer, diğeri ağır bir yenilgidir",
      "İkisi de Osmanlı yenilgisiyle sonuçlanmıştır",
      "İkisi de Haçlı donanmasının zaferidir",
      "Biri Karadeniz’de, diğeri Ege’de yapılmıştır"
    ],
    dogru: 0,
    cozum: "Preveze’de müttefik Haçlı donanması yenilmiş, İnebahtı’da ise Osmanlı donanması büyük kayıp vermiştir.",
    fc: ["İnebahtı yenilgisinin sonucu nedir?", "Donanma büyük kayıp vermiş ancak kısa sürede yeniden inşa edilmiştir."]
  },
  {
    si: 2,
    metin: "İnebahtı yenilgisine karşın Osmanlı’nın Akdeniz’deki varlığını sürdürmesi aşağıdakilerden hangisiyle açıklanabilir?",
    secenekler: [
      "Tersanelerin ve gemi yapım kapasitesinin hızla harekete geçirilmesi",
      "Akdeniz ticaretinin tamamen durması",
      "Venedik’in Osmanlı’ya bağlanması",
      "İspanya donanmasının bölgeden çekilmesi"
    ],
    dogru: 0,
    cozum: "Osmanlı, kısa sürede yeni gemiler inşa ederek donanmasını yeniden kurmuş ve Akdeniz’deki üslerini korumuştur.",
    fc: ["Osmanlı donanmasının yeniden kurulmasını sağlayan nedir?", "Tersane kapasitesi ve gemi yapımında uzmanlaşmış kadroların varlığıdır."]
  },
  {
    si: 2,
    metin: "1683 II. Viyana Kuşatması’nın başarısızlığı Osmanlı’nın cihan devleti konumunu nasıl etkilemiştir?",
    secenekler: [
      "Avrupa’da savunmaya çekilmesine ve toprak kaybetmesine yol açmıştır",
      "Akdeniz’de yeni fetihler yapmasını sağlamıştır",
      "Safevi Devleti’ni yıkmasına imkân vermiştir",
      "Anadolu’da siyasi birliği bozmuştur"
    ],
    dogru: 0,
    cozum: "Kuşatma sonrası kurulan Kutsal İttifak karşısında Osmanlı savunmaya geçmiş, Karlofça ile ilk büyük toprak kayıpları yaşanmıştır.",
    fc: ["II. Viyana Kuşatması’nın sonucu nedir?", "Avrupa devletlerinin ittifakıyla Osmanlı savunmaya çekilmiş, toprak kayıpları başlamıştır."]
  },
  {
    si: 2,
    metin: "1453-1683 arasında Osmanlı’nın cihan devleti hâline gelmesini açıklayan bir araştırmacı hangi etkeni öne çıkarabilir?",
    secenekler: [
      "Merkezî ordu ve donanmanın sürekli geliştirilmesi",
      "Tımar sisteminin tamamen kaldırılması",
      "Avrupa’dan teknoloji alımının yasaklanması",
      "Deniz ticaretinin özel şirketlere bırakılması"
    ],
    dogru: 0,
    cozum: "Kapıkulu ocakları, donanma ve tersane yatırımları Osmanlı’nın üç kıtada askerî üstünlük kurmasında belirleyici olmuştur.",
    fc: ["Osmanlı’nın cihan devleti olmasında askerî etken nedir?", "Merkezî ordunun ve donanmanın sürekli güçlendirilmesidir."]
  }
]);

/* ---------------------------------------------------------------- 3.2 */
yaz("tar_10_t03_c02", KAYNAK + ", s.235-256", [
  {
    si: 0,
    metin: "Fatih Sultan Mehmet’in kanunnamesiyle devlet yönetiminde hangi değişim yaşanmıştır?",
    secenekler: [
      "Merkezî ve kurallı yönetimin kurumsallaşması",
      "Tımar sisteminin kaldırılması",
      "Divan-ı Hümayun’un lağvedilmesi",
      "Eyalet yönetiminin özerkleşmesi"
    ],
    dogru: 0,
    cozum: "Kanunname, devlet görevlilerinin yetkilerini ve saray düzenini yazılı kurallara bağlayarak merkezî yönetimi kurumsallaştırmıştır.",
    fc: ["Fatih Kanunnamesi’nin işlevi nedir?", "Devlet yönetimini ve saray düzenini yazılı kurallara bağlayarak merkezîleşmeyi sağlar."]
  },
  {
    si: 0,
    metin: "Divan-ı Hümayun toplantılarına padişahın katılmadan vezir-i azamın başkanlık etmesi hangi değişimin göstergesidir?",
    secenekler: [
      "Yürütme işlerinin sadrazama devredilmesinin",
      "Divanın tamamen kaldırılmasının",
      "Şehzadelerin yönetime katılmasının",
      "Tımar denetiminin kazaskere geçmesinin"
    ],
    dogru: 0,
    cozum: "Padişahın divandan çekilmesiyle vezir-i azam yürütmenin fiilî başı hâline gelmiş, bürokrasi ağırlık kazanmıştır.",
    fc: ["Vezir-i azamın konumu nedir?", "Divana başkanlık eden ve yürütme işlerini yürüten en yetkili devlet görevlisidir."]
  },
  {
    si: 0,
    metin: "Ekberiyet sisteminin uygulanmaya başlaması tahta geçişte hangi sonucu doğurmuştur?",
    secenekler: [
      "Hanedanın en büyük üyesinin tahta geçmesini",
      "Şehzadelerin sancaklara gönderilmesini",
      "Tahta geçişte savaşın zorunlu olmasını",
      "Devşirmelerin padişah olmasını"
    ],
    dogru: 0,
    cozum: "Ekberiyet, hanedanın en büyüğünün tahta geçmesi kuralına dayanır ve taht kavgalarını azaltmayı amaçlar.",
    fc: ["Ekberiyet sisteminin tanımı nedir?", "Hanedanın en büyük erkek üyesinin tahta geçmesi kuralıdır."]
  },
  {
    si: 1,
    metin: "Tabloda 1453-1683 arasında Osmanlı ordu yapısındaki değişim verilmiştir. Tabloya göre tımarlı sipahi sayısının azalması hangi sonucu doğurmuştur?",
    secenekler: [
      "Eyalet ordusunun zayıflaması",
      "Kapıkulu sayısının azalması",
      "Donanmanın kaldırılması",
      "Vergi gelirlerinin artması"
    ],
    dogru: 0,
    cozum: "Dirliklerin iltizama verilmesiyle sipahi sayısı düşmüş, taşradaki askerî güç zayıflayarak merkez ordusuna bağımlılık artmıştır.",
    gorsel: {
      tip: "tablo",
      basliklar: ["Dönem", "Tımarlı sipahi", "Kapıkulu"],
      satirlar: [
        ["1453 civarı", "Yüksek", "Sınırlı"],
        ["1520’ler", "Yüksek", "Artıyor"],
        ["1600’ler", "Azalıyor", "Hızla artıyor"],
        ["1683 civarı", "Düşük", "Bütçede ağır yük"]
      ]
    },
    fc: ["Tımarlı sipahi sayısının azalmasının etkisi nedir?", "Eyalet ordusu zayıflamış, merkezî ordunun yükü artmıştır."]
  },
  {
    si: 1,
    metin: "Kapıkulu asker sayısının sürekli artırılması Osmanlı bütçesine nasıl yansımıştır?",
    secenekler: [
      "Ulufe ödemelerinin artarak hazinenin zorlanmasına",
      "Vergilerin tamamen kaldırılmasına",
      "Tımar gelirlerinin çoğalmasına",
      "Savaş giderlerinin azalmasına"
    ],
    dogru: 0,
    cozum: "Üç ayda bir ulufe alan kapıkulu sayısı arttıkça hazineden yapılan maaş ödemeleri bütçeyi zorlamıştır.",
    fc: ["Kapıkulu sayısındaki artışın mali sonucu nedir?", "Ulufe ödemeleri çoğalmış ve hazine açıkları büyümüştür."]
  },
  {
    si: 1,
    metin: "İltizam usulünün yaygınlaşması tımar sistemini nasıl etkilemiştir?",
    secenekler: [
      "Dirliklerin mültezimlere verilmesiyle tımar düzeninin bozulmasına",
      "Sipahi sayısının artmasına",
      "Reayanın vergiden muaf tutulmasına",
      "Eyalet ordusunun güçlenmesine"
    ],
    dogru: 0,
    cozum: "Vergi toplama hakkının açık artırmayla mültezimlere verilmesi, dirlik düzenini çözmüş ve sipahi sayısını azaltmıştır.",
    fc: ["İltizam usulünün tanımı nedir?", "Devlete ait vergi gelirinin belirli bir bedel karşılığında mültezime devredilmesidir."]
  },
  {
    si: 2,
    metin: "Sarayın Birun ve Enderun olarak ayrılması yönetim açısından neyi gösterir?",
    secenekler: [
      "Devlet işleri ile saray eğitiminin ayrı alanlar sayıldığını",
      "Padişahın devlet işlerinden çekildiğini",
      "Divanın tamamen kaldırıldığını",
      "Sarayın halka açıldığını"
    ],
    dogru: 0,
    cozum: "Birun dış hizmet ve devlet işlerini, Enderun ise iç eğitim ve idari kadro yetiştirmeyi üstlenerek işlevsel ayrım oluşturmuştur.",
    fc: ["Enderunun işlevi nedir?", "Sarayın iç bölümünde devlet görevlisi yetiştiren eğitim birimidir."]
  },
  {
    si: 2,
    metin: "Padişah yetkilerinin kanunnamelerle düzenlenmesi hangi gelişmeye işaret eder?",
    secenekler: [
      "Keyfî uygulamalar yerine kurallı yönetime geçilmesine",
      "Şer’i hukukun yürürlükten kaldırılmasına",
      "Meşrutiyet düzenine geçilmesine",
      "Eyaletlerin bağımsızlaşmasına"
    ],
    dogru: 0,
    cozum: "Kanunnameler görevlilerin yetkilerini ve cezaları yazılı hâle getirerek yönetimde belirlilik sağlamıştır.",
    fc: ["Kanunnamenin hukuki işlevi nedir?", "Devlet düzenine ilişkin kuralları yazılı hâle getirerek belirlilik sağlar."]
  },
  {
    si: 2,
    metin: "Yeniçeri sayısının artması ve ocağa kanun dışı yollarla girişlerin çoğalması hangi sonucu doğurmuştur?",
    secenekler: [
      "Ocağın bozulması ve isyanların artması",
      "Ocağın kaldırılması",
      "Devşirme usulünün yaygınlaşması",
      "Tımar sisteminin güçlenmesi"
    ],
    dogru: 0,
    cozum: "Askerlik dışı işlerle uğraşan ve disiplini bozulan yeniçeriler, devlet yönetimine baskı kurarak isyanlarda etkili olmuştur.",
    fc: ["Yeniçeri Ocağı’nın bozulma nedeni nedir?", "Sayının artırılması ve ocağa kanunsuz girişlerin çoğalmasıdır."]
  },
  {
    si: 2,
    metin: "Divan-ı Hümayun’un öneminin azalması yönetimde hangi yapıyı öne çıkarmıştır?",
    secenekler: [
      "Sadrazamın konağında yürütülen Bâb-ı Âli bürokrasisini",
      "Eyalet divanlarında yürütülen taşra yönetimini",
      "Şehzadelerin gönderildiği sancak yönetimini",
      "Medreselerde toplanan ilmî meclisleri"
    ],
    dogru: 0,
    cozum: "İşlerin sadrazam konağında görülmeye başlamasıyla Bâb-ı Âli, devletin fiilî karar merkezi hâline gelmiştir.",
    fc: ["Bâb-ı Âli nedir?", "Sadrazamın konağında yürütülen ve devlet işlerinin görüldüğü yönetim merkezidir."]
  }
]);

/* ---------------------------------------------------------------- 3.3 */
yaz("tar_10_t03_c03", KAYNAK + ", s.257-269", [
  {
    si: 0,
    metin: "1487-1488’de Ümit Burnu’nu dolaşarak Afrika’nın güney ucuna ulaşan kâşif hangisidir?",
    secenekler: ["Bartolomeu Dias", "Vasco da Gama", "Kristof Kolomb", "Pedro Cabral"],
    dogru: 0,
    cozum: "Bartolomeu Dias, Ümit Burnu’nu dolaşarak Hint Okyanusu’na giden deniz yolunun varlığını kanıtlamıştır.",
    fc: ["Ümit Burnu’nu ilk dolaşan kâşifin adı nedir?", "Portekizli denizci Bartolomeu Dias’tır."]
  },
  {
    si: 0,
    metin: "1492’de Atlas Okyanusu’nu geçerek Amerika kıtasına ulaşan kâşif aşağıdakilerden hangisidir?",
    secenekler: ["Kristof Kolomb", "Bartolomeu Dias", "Ferdinand Magellan", "James Cook"],
    dogru: 0,
    cozum: "İspanya adına yola çıkan Kristof Kolomb 1492’de Atlas Okyanusu’nu geçerek Amerika kıtasına ulaşmıştır.",
    fc: ["Kolomb’un seferinin amacı nedir?", "Atlas Okyanusu üzerinden Asya’ya ulaşan yeni bir yol bulmaktır."]
  },
  {
    si: 1,
    metin: "15. yüzyılda baharatın Avrupa için taşıdığı ekonomik değerin yüksek olmasının nedeni nedir?",
    secenekler: [
      "Yükte hafif, pahada ağır ve uzun yola dayanıklı olması",
      "Avrupa’da hiç tüketilmemesi",
      "Yalnızca deniz yoluyla taşınabilmesi",
      "Üretiminin Avrupa’da yapılması"
    ],
    dogru: 0,
    cozum: "Baharat hafif, değerli ve bozulmaya dayanıklı olduğu için uzun mesafeli ticarette kârlı bir maldı; bu da Doğu yollarını değerli kılıyordu.",
    fc: ["Baharat ticaretinin ekonomik özelliği nedir?", "Az hacimle yüksek değer taşıması ve uzun taşımalara dayanıklı olmasıdır."]
  },
  {
    si: 1,
    metin: "Avrupa’da yaşanan altın kıtlığı coğrafi keşifleri nasıl etkilemiştir?",
    secenekler: [
      "Doğu’ya denizden ulaşma arayışını hızlandırmıştır",
      "Deniz ticaretini tamamen durdurmuştur",
      "Kâşiflerin yalnızca kuzeye yönelmesine yol açmıştır",
      "Baharat ticaretini sona erdirmiştir"
    ],
    dogru: 0,
    cozum: "Kıymetli maden sıkıntısı çeken Avrupa, Doğu’nun altın ve baharat kaynaklarına ulaşmak için yeni deniz yolları aramıştır.",
    fc: ["Coğrafi keşiflerin ekonomik nedeni nedir?", "Doğu’nun baharat ve kıymetli madenlerine doğrudan ulaşma isteğidir."]
  },
  {
    si: 1,
    metin: "XV. yüzyıla kadar Avrupalı denizcilerin yön bulma becerisinin gelişmesinde hangi birikim etkili olmuştur?",
    secenekler: [
      "Müslüman denizcilerin harita ve pusula bilgisi",
      "Kuzey Avrupa’daki kara ticareti",
      "Kilise okullarındaki dil eğitimi",
      "Feodal beylerin deniz seferleri"
    ],
    dogru: 0,
    cozum: "Pusula, astrolap ve harita bilgisini geliştiren Müslüman denizcilerin birikimi Avrupalı kâşiflerin açık deniz seferlerini mümkün kılmıştır.",
    fc: ["Açık deniz seferlerini mümkün kılan bilgi nedir?", "Pusula, harita ve yön bulma bilgisidir."]
  },
  {
    si: 2,
    metin: "Tabloda 1501-1850 arası Atlas Okyanusu köle ticaretinin ülkelere göre dağılımı verilmiştir. Tabloya göre en fazla insanı taşıyan ülke hangisidir?",
    secenekler: ["Portekiz", "İngiltere", "Fransa", "Hollanda"],
    dogru: 0,
    cozum: "Tablodaki toplam satırında Portekiz 5.848.265 kişiyle ilk sırada, İngiltere 3.259.440 kişiyle ikinci sıradadır.",
    gorsel: {
      tip: "tablo",
      basliklar: ["Ülke", "Taşınan insan (1501-1850)"],
      satirlar: [
        ["Portekiz", "5.848.265"],
        ["İngiltere", "3.259.440"],
        ["Fransa", "1.381.403"],
        ["Hollanda", "554.336"]
      ]
    },
    fc: ["Köle ticaretinin en büyük taşıyıcısı olan ülkenin adı nedir?", "Tabloya göre Portekiz, yaklaşık 5,8 milyon kişiyle ilk sıradadır."]
  },
  {
    si: 2,
    metin: "Sömürgeciliğin sömürülen toplumlar üzerinde bıraktığı ekonomik miras aşağıdakilerden hangisidir?",
    secenekler: [
      "Tek ürüne dayalı, dışa bağımlı ekonomiler",
      "Sanayisi gelişmiş bağımsız pazarlar",
      "Eşit gelir dağılımına dayalı düzenler",
      "Tamamen kendi kendine yeten üretim"
    ],
    dogru: 0,
    cozum: "Sömürge yönetimleri yerel ekonomileri ham madde üretimine yönlendirmiş, bu yapı bağımsızlık sonrası da sürmüştür.",
    fc: ["Sömürge ekonomisinin yapısı nedir?", "Ham madde üretimine dayalı, dış pazara bağımlı bir yapıdır."]
  },
  {
    si: 2,
    metin: "1501-1850 arasındaki Atlas Okyanusu köle ticaretinin günümüzde hâlâ tartışılmasının temel nedeni nedir?",
    secenekler: [
      "Toplumsal eşitsizlik ve ırkçılığın tarihsel kökenini oluşturması",
      "Köle ticaretinin çok kısa sürmesi",
      "Yalnızca bir ülkeyi ilgilendirmesi",
      "Belgelerinin hiç bulunmaması"
    ],
    dogru: 0,
    cozum: "Milyonlarca insanın zorla taşınması, demografik yapıyı ve toplumsal hiyerarşileri derinden etkilemiş; etkileri bugüne uzanmıştır.",
    fc: ["Köle ticaretinin uzun vadeli etkisi nedir?", "Toplumsal eşitsizlik ve ırk temelli ayrımcılığın tarihsel kökenlerini oluşturmasıdır."]
  },
  {
    si: 3,
    metin: "Köle ticaretinin XVI-XVIII. yüzyıllarda yasallaştırılması dönemin koşulları içinde nasıl açıklanabilir?",
    secenekler: [
      "Plantasyonlarda artan iş gücü ihtiyacının ucuz emekle karşılanmasıyla",
      "Avrupa’da nüfusun hızla artmasıyla",
      "Deniz ticaretinin tamamen sona ermesiyle",
      "Tarımın tamamen terk edilmesiyle"
    ],
    dogru: 0,
    cozum: "Şeker ve tütün plantasyonlarının büyümesi, sömürgeci devletleri zorla taşınan iş gücünü yasal düzenlemelerle kurumsallaştırmaya yöneltti.",
    fc: ["Köle ticaretinin hukukileşmesinin nedeni nedir?", "Plantasyon ekonomisinin ucuz ve zorunlu iş gücüne duyduğu ihtiyaçtır."]
  },
  {
    si: 3,
    metin: "Sömürgeci politikaları dönemin koşulları içinde değerlendirmeyi savunan bir tarihçi neye dikkat eder?",
    secenekler: [
      "Olayı kendi değer yargılarıyla değil, dönemin ekonomik ve siyasi bağlamıyla çözümlemeye",
      "Yalnızca günümüz hukukunu ve değerlerini ölçüt almaya",
      "Dönemin kaynaklarını bütünüyle yok sayıp görmezden gelmeye",
      "Yalnızca kâşiflerin anılarını tek başına yeterli saymaya"
    ],
    dogru: 0,
    cozum: "Dönemsel değerlendirme, olayı bugünün ölçütleriyle yargılamak yerine o dönemin ekonomik, siyasi ve toplumsal koşullarını esas alır.",
    fc: ["Dönemsel değerlendirme nedir?", "Olayı, gerçekleştiği dönemin koşulları içinde ele alıp anlamlandırmaktır."]
  }
]);

/* ---------------------------------------------------------------- 3.4 */
yaz("tar_10_t03_c04", KAYNAK + ", s.270-283", [
  {
    si: 0,
    metin: "III. Murad döneminde tağşiş uygulaması nedeniyle çıkan ve kapıkulu askerlerinin devlet üzerindeki baskısını gösteren isyan hangisidir?",
    secenekler: ["Beylerbeyi Vakası", "Şahkulu İsyanı", "Celali İsyanı", "Suhte İsyanı"],
    dogru: 0,
    cozum: "Sikkelerdeki değer düşürülmesine tepki olarak çıkan Beylerbeyi Vakası, yeniçerilerin siyasi baskısını açıkça ortaya koymuştur.",
    fc: ["Beylerbeyi Vakası’nın nedeni nedir?", "Tağşiş uygulamasıyla sikkenin değerinin düşürülmesidir."]
  },
  {
    si: 0,
    metin: "İsyanların nedenlerine ilişkin tarihçilerin farklı görüşler öne sürmesi neyi gösterir?",
    secenekler: [
      "Farklı kaynak ve bakış açılarıyla olayı yorumladıklarını",
      "İsyanların hiç yaşanmadığını",
      "Konunun belgelerle kanıtlanamadığını",
      "Tarihçilerin aynı kaynağı kullandığını"
    ],
    dogru: 0,
    cozum: "Tarihçiler aynı olayı farklı kaynaklara ve kuramsal yaklaşımlara dayanarak açıkladığı için nedenler konusunda görüş ayrılıkları doğar.",
    fc: ["Tarihçiler arasında görüş ayrılığının nedeni nedir?", "Farklı kaynakları ve farklı bakış açılarını kullanmaları nedeniyle."]
  },
  {
    si: 1,
    metin: "Celali İsyanları’nı bir tarihçinin ekonomik, bir diğerinin siyasi nedenle açıklaması nasıl yorumlanabilir?",
    secenekler: [
      "İnceledikleri kaynakların farklı yönleri öne çıkarmasıyla",
      "İsyanların iki farklı yüzyılda çıkmasıyla",
      "Kaynakların tümünün yanlış olmasıyla",
      "Olayın tek nedene indirgenebilmesiyle"
    ],
    dogru: 0,
    cozum: "Vergi kayıtlarına ağırlık veren araştırmacı ekonomik, saray belgelerine dayanan araştırmacı siyasi nedenleri öne çıkarır.",
    fc: ["Kaynak seçiminin araştırmaya etkisi nedir?", "Hangi kaynağa ağırlık verilirse o yöndeki nedenler öne çıkar."]
  },
  {
    si: 1,
    metin: "Şeyh Bedreddin İsyanı’nın nedenleri konusunda dönem kaynakları ile günümüz araştırmalarının vurgusu nasıl farklılaşır?",
    secenekler: [
      "Dönem kaynakları dinî-siyasi, yeni araştırmalar sosyoekonomik yönü öne çıkarır",
      "Her ikisi de yalnızca iklim koşullarını inceler",
      "Dönem kaynakları olayı hiç anlatmaz",
      "Günümüz araştırmaları belge kullanmaz"
    ],
    dogru: 0,
    cozum: "Çağdaş kaynaklar olayı inanç ve iktidar çerçevesinde anlatırken modern araştırmalar toprak düzeni ve vergi yükü gibi etkenleri inceler.",
    fc: ["Dönem kaynaklarının bakış açısı nedir?", "Olayı çoğunlukla dinî ve siyasi meşruiyet çerçevesinde değerlendirir."]
  },
  {
    si: 2,
    metin: "Tağşiş uygulamasının isyanlara yol açması, dönemin şartları içinde hangi çözümü gündeme getirir?",
    secenekler: [
      "Para değerinin korunması ve bütçe dengesinin sağlanması",
      "Yeniçeri sayısının daha da artırılması",
      "Vergilerin tamamen kaldırılması",
      "Tımar arazilerinin satılması"
    ],
    dogru: 0,
    cozum: "Sikke istikrarının bozulması esnaf ve askeri mağdur ettiği için gelir-gider dengesinin kurulması ve paranın korunması gerekirdi.",
    fc: ["Tağşiş nedir?", "Sikkedeki kıymetli maden oranının düşürülerek paranın değerinin azaltılmasıdır."]
  },
  {
    si: 2,
    metin: "Suhte isyanlarının önlenmesi için dönemin koşullarında hangi önlem düşünülebilir?",
    secenekler: [
      "Medrese kontenjanının ve mezunların geçim imkânlarının düzenlenmesi",
      "Bütün medreselerin kapatılıp eğitimin durdurulması",
      "Medrese öğrencilerinin zorunlu olarak orduya alınması",
      "Medreselere ayrılan vakıf gelirlerinin kaldırılması"
    ],
    dogru: 0,
    cozum: "Medreseden mezun olup iş bulamayan öğrencilerin geçim sıkıntısı isyanlara yol açtığı için kontenjan ve istihdam düzenlemesi çözüm olabilirdi.",
    fc: ["Suhtenin tanımı nedir?", "Medrese eğitimi gören ve geçim sıkıntısı çeken öğrencilere verilen addır."]
  },
  {
    si: 4,
    metin: "Grup çalışmasında tımarlı sipahi sayısının azalması ile Celali İsyanları arasındaki ilişki nasıl ifade edilebilir?",
    secenekler: [
      "İşsiz kalan sipahilerin isyan hareketlerine katılmasıyla",
      "Sipahilerin ticaretle uğraşmasıyla",
      "Tımar arazilerinin çoğalmasıyla",
      "Reayanın şehirlere göç etmesiyle"
    ],
    dogru: 0,
    cozum: "Dirliklerini kaybeden sipahiler geçim için eyaletlerdeki ayaklanmalara katılmış, isyanların askerî kadrosunu oluşturmuştur.",
    fc: ["Celali isyanlarının askerî kadrosunu oluşturan grup nedir?", "Dirliklerini kaybeden sipahiler ve işsiz kalan askerler oluşturur."]
  },
  {
    si: 3,
    metin: "İsyanların nedenlerine dair kendi görüşünü gözden geçiren bir öğrenci hangi tutumu benimsemelidir?",
    secenekler: [
      "Yeni kanıtlara açık olup tek nedene bağlanmamayı",
      "İlk öğrendiği görüşte ısrar etmeyi",
      "Görüşleri kanıt olmadan savunmayı",
      "Kaynakları seçmeden kullanmayı"
    ],
    dogru: 0,
    cozum: "Tarihsel yargı, yeni belge ve yorumlar karşısında yeniden gözden geçirilmeye açık olmalı ve tek nedene indirgenmemelidir.",
    fc: ["Tarihsel yargıyı gözden geçirmenin yolu nedir?", "Yeni kanıt ve yorumlarla karşılaştırılarak yeniden değerlendirilir."]
  },
  {
    si: 3,
    metin: "Bir isyanı yalnızca “dinî sapkınlık” olarak açıklayan yaklaşım nasıl değerlendirilmelidir?",
    secenekler: [
      "Ekonomik ve toplumsal koşulları göz ardı ettiği için eksik bulunmalıdır",
      "Tek başına yeterli ve kesin sayılmalıdır",
      "Belgelerle desteklenmesi gereksiz görülmelidir",
      "Bütün tarihçilerce kabul edilmelidir"
    ],
    dogru: 0,
    cozum: "İsyanların ardında vergi yükü, işsizlik ve toprak düzeni gibi etkenler bulunduğu için tek nedene dayalı açıklamalar yetersiz kalır.",
    fc: ["Tek nedenli açıklamanın sınırlılığı nedir?", "Olayın öteki ekonomik ve toplumsal koşullarını görünmez kılmasıdır."]
  },
  {
    si: 4,
    metin: "Grup çalışmasında isyanların nedenlerine ilişkin farklı görüşler birleştirilirken hangi ölçüt esas alınmalıdır?",
    secenekler: [
      "Görüşlerin kanıtlara ve gerekçelere dayandırılması",
      "En çok konuşanın görüşünün benimsenmesi",
      "Görüşlerin oylanarak seçilmesi",
      "Kaynak belirtilmeden uzlaşılması"
    ],
    dogru: 0,
    cozum: "Tarihsel tartışmada üstünlük, görüşün kanıtla desteklenmesi ve gerekçelendirilmesiyle belirlenir; çoğunluk oyu ölçüt değildir.",
    fc: ["Tarihsel tartışmada ölçüt nedir?", "Görüşün kanıtlarla desteklenmesi ve tutarlı gerekçelerle savunulmasıdır."]
  }
]);

/* ---------------------------------------------------------------- 3.5 */
yaz("tar_10_t03_c05", KAYNAK + ", s.284-304", [
  {
    si: 0,
    metin: "Saray için çalışan sanatkârların ehl-i hiref adlı teşkilat bünyesinde toplanması neyi gösterir?",
    secenekler: [
      "Sarayın sanat üretimini örgütleyip desteklediğini",
      "Sanatkârların saraydan uzak tutulduğunu",
      "Sanatın yalnızca halk arasında geliştiğini",
      "Sarayda yalnızca mimarlık yapıldığını"
    ],
    dogru: 0,
    cozum: "Ehl-i hiref, nakkaş, müzehhip ve kuyumcu gibi sanatkârları bir araya getirerek sarayın sanat üretimini düzenli biçimde desteklemiştir.",
    fc: ["Ehl-i hiref nedir?", "Saray için çalışan sanatkârları bir araya getiren teşkilattır."]
  },
  {
    si: 0,
    metin: "Osmanlı’da bilim insanlarının hükümdarlarca korunup eserlerinin tercüme edilmesi hangi birikimden yararlanıldığını gösterir?",
    secenekler: [
      "Önceki Türk-İslam devletlerinin ilmî mirasından",
      "Yalnızca Avrupa üniversitelerinden",
      "Deniz ticaretinden elde edilen gelirlerden",
      "Göçebe boyların sözlü kültüründen"
    ],
    dogru: 0,
    cozum: "Matematik, astronomi, tıp ve coğrafya alanındaki eserlerin tercüme edilmesi, Türk-İslam dünyasının birikiminin sürdürüldüğünü gösterir.",
    fc: ["Osmanlı biliminin beslendiği kaynak nedir?", "Önceki Türk-İslam devletlerinin ilmî birikimi ve tercüme edilen eserlerdir."]
  },
  {
    si: 1,
    metin: "Itri’nin “Segâh Bayram Tekbiri”nin günümüzde hâlâ icra edilmesi hangi özelliğine bağlanabilir?",
    secenekler: [
      "Kalıcı ve evrensel bir müzikal değer taşımasına",
      "Yalnızca sarayda çalınmasına",
      "Notasının kaybolmuş olmasına",
      "Mehter müziğinden türetilmesine"
    ],
    dogru: 0,
    cozum: "Eserin yüzyıllar boyunca farklı coğrafyalarda okunması, bestedeki güçlü müzikal yapının kalıcılığını gösterir.",
    fc: ["Itri’nin müzikal kimliği nedir?", "Klasik Türk müziğinin önemli bestekârlarından biri olmasıdır."]
  },
  {
    si: 1,
    metin: "Mimar Sinan’ın Edirne’de Selimiye Camisi’ni inşa etmesi hangi birikimin ürünüdür?",
    secenekler: [
      "Klasik Osmanlı mimarisinin kubbe ve ölçek deneyiminin",
      "Avrupa barok mimarisinin doğrudan taklidi",
      "Bizans mozaik geleneğinin",
      "Göçebe çadır mimarisinin"
    ],
    dogru: 0,
    cozum: "Selimiye, merkezî kubbe ve taşıyıcı sistem denemelerinin birikimiyle ortaya çıkmış klasik dönem mimarisinin zirvesi sayılır.",
    fc: ["Selimiye Camisi’nin mimari önemi nedir?", "Merkezî kubbeli klasik Osmanlı mimarisinin en gelişmiş örneğidir."]
  },
  {
    si: 2,
    metin: "Kâtip Çelebi’nin coğrafya, astronomi, tarih ve felsefe alanlarında eser vermesi hangi özelliğini gösterir?",
    secenekler: [
      "Çok yönlü bir ilmî birikime sahip olduğunu",
      "Yalnızca dinî ilimlerle uğraştığını",
      "Eserlerini yalnızca Farsça yazdığını",
      "Saraydan hiç destek görmediğini"
    ],
    dogru: 0,
    cozum: "Keşfü’z-Zünun ve Cihannüma gibi eserleri, Kâtip Çelebi’nin farklı disiplinleri birlikte izleyen bir âlim olduğunu ortaya koyar.",
    fc: ["Kâtip Çelebi’nin eser alanları nedir?", "Coğrafya, astronomi, tarih ve felsefe alanlarıdır."]
  },
  {
    si: 2,
    metin: "Piri Reis’in Kitab-ı Bahriye’sinde liman, koy ve geçitleri gösteren haritaların bulunması hangi alandaki katkıyı gösterir?",
    secenekler: [
      "Denizcilik ve coğrafya bilgisi",
      "Şehir planlaması ve mimarlık",
      "Hukuk ve yönetim düzenlemeleri",
      "Müzik ve edebiyat"
    ],
    dogru: 0,
    cozum: "Eser, Akdeniz’de seyir güvenliği için liman ve geçitleri ayrıntılı gösteren bir denizcilik kılavuzudur.",
    fc: ["Kitab-ı Bahriye’nin işlevi nedir?", "Akdeniz’de seyreden denizciler için liman ve geçitleri gösteren kılavuz eserdir."]
  },
  {
    si: 3,
    metin: "Osmanlı bilim tarihine ilişkin kaynakların ağırlıklı olarak saray çevresini anlatması hangi sınırlılığı doğurur?",
    secenekler: [
      "Taşradaki bilimsel faaliyetlerin görünmemesini",
      "Saray âlimlerinin abartılmasını değil",
      "Belgelerin dilinin anlaşılmamasını",
      "Eserlerin hiç günümüze ulaşmamasını"
    ],
    dogru: 0,
    cozum: "Saray merkezli kayıtlar, medrese ve tekke çevresindeki çalışmaları yeterince yansıtmadığı için bilim hayatının bütünü görülemez.",
    fc: ["Saray merkezli kaynakların sınırlılığı nedir?", "Saray dışındaki ilmî faaliyetleri ve taşra kurumlarını yeterince yansıtmamasıdır."]
  },
  {
    si: 3,
    metin: "Evliya Çelebi’nin Seyahatname’sindeki abartılı anlatımlar kaynak olarak kullanılırken nasıl değerlendirilmelidir?",
    secenekler: [
      "Gözlem ile abartının ayrıştırılıp başka kaynaklarla sınanmasıyla",
      "Metnin tamamının olduğu gibi doğru sayılmasıyla",
      "Eserin bütünüyle reddedilmesiyle",
      "Yalnızca edebî yönünün dikkate alınmasıyla"
    ],
    dogru: 0,
    cozum: "Seyahatname zengin gözlem içerir; ancak abartılı bölümler arşiv ve kronik bilgileriyle karşılaştırılarak kullanılmalıdır.",
    fc: ["Seyahatname’nin kaynak değeri nedir?", "Geniş gözleme dayanan, ancak abartı içeren bir anlatı kaynağı olmasıdır."]
  },
  {
    si: 4,
    metin: "Karagöz, orta oyunu ve meddahın Osmanlı şehirlerinde yaygın olması kültürel hayat hakkında neyi gösterir?",
    secenekler: [
      "Sahne sanatlarının geniş halk kesimlerine ulaştığını",
      "Tiyatronun yalnızca sarayda yapıldığını",
      "Halkın eğlence kültürünün bulunmadığını",
      "Yazılı edebiyatın öne çıktığını"
    ],
    dogru: 0,
    cozum: "Bu gösteri türleri kahvehane ve meydanlarda icra edilerek halkın gündelik hayatına ve mizah anlayışına yön vermiştir.",
    fc: ["Meddahın işlevi nedir?", "Tek kişilik anlatımla hikâye anlatan, halkı eğlendirip düşündüren sahne sanatçısıdır."]
  },
  {
    si: 4,
    metin: "Osmanlı sanatının farklı toplumların etkilerini taşıması neyi gösterir?",
    secenekler: [
      "Çok kültürlü bir coğrafyanın sanata yansıdığını",
      "Sanatın tek bir kaynaktan beslendiğini",
      "Yerel sanatların yok sayıldığını",
      "Sarayın sanatı yasakladığını"
    ],
    dogru: 0,
    cozum: "İlk Türk devletlerinin, Türk-İslam devletlerinin ve hâkimiyet kurulan toplumların sanat anlayışları Osmanlı sanatını beslemiştir.",
    fc: ["Osmanlı sanatının beslendiği kaynaklar nedir?", "İlk Türk devletleri, Türk-İslam devletleri ve hâkimiyet kurulan toplumların sanat anlayışlarıdır."]
  }
]);
