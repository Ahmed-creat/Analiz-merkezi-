#!/usr/bin/env node
/* Tarih 10 · Tema 2 (Beylikten Devlete Osmanlı, 1299-1453) havuzları.
   Kaynak: MEB Tarih 10 ders kitabı (2025). JSON sayfa = basılı sayfa + 1. */
"use strict";

const { yaz } = require("../yazicilar/yaz.js");

const KAYNAK = "MEB Tarih 10 ders kitabı (2025)";

/* ---------------------------------------------------------------- 2.1 */
yaz("tar_10_t02_c01", KAYNAK + ", s.110-121", [
  {
    si: 0,
    metin: "1916’da Osmanlı İmparatorluğu’nun Kuruluşu adlı eseriyle Osmanlıların Anadolu Türklerinden ayrı bir unsur olduğunu savunan tarihçi hangisidir?",
    secenekler: ["H. A. Gibbons", "M. F. Köprülü", "P. Wittek", "H. İnalcık"],
    dogru: 0,
    cozum: "Amerikalı gazeteci Herbert Adams Gibbons, 1916 tarihli eserinde Osmanlı kuruluşunu Anadolu Türklerinden kopuk bir süreç olarak açıklamıştır.",
    fc: ["Gibbons’un kuruluş tezinin özü nedir?", "Osmanlıların Anadolu Türklerinden farklı bir unsur olduğu iddiasına dayanır."]
  },
  {
    si: 0,
    metin: "Köprülü’nün Gibbons’a yönelttiği temel eleştiri aşağıdakilerden hangisidir?",
    secenekler: [
      "Osmanlıyı Anadolu Türklerinden ayrı saymanın hatalı olması",
      "Kuruluşun Moğol istilasına bağlanmasının yanlış olması",
      "Gaza geleneğinin göz ardı edilmiş olması",
      "Bizans kaynaklarının hiç kullanılmaması"
    ],
    dogru: 0,
    cozum: "Köprülü, Osmanlıların Selçuklu ve İlhanlı hâkimiyeti altındaki Anadolu Türkleriyle aynı siyasi, iktisadi ve kültürel birliğin parçası olduğunu belirtir.",
    fc: ["Köprülü’nün kuruluş tezinin özü nedir?", "Osmanlıların Anadolu Türklerinden ayrı olmadığı, aynı birliğin parçası olduğu görüşüdür."]
  },
  {
    si: 0,
    metin: "Gibbons ile Wittek’in kuruluş açıklamaları hangi noktada birbirinden ayrılır?",
    secenekler: [
      "Biri dış etkilere, diğeri gaza geleneğine ağırlık verir",
      "İkisi de Moğol istilasını tek neden sayar",
      "İkisi de kuruluşu 1453 sonrasına taşır",
      "Biri donanmayı, diğeri tımarı öne çıkarır"
    ],
    dogru: 0,
    cozum: "Gibbons kuruluşta Bizans ve Hristiyan unsurların etkisini öne çıkarırken Wittek, Osmanlıların gaza geleneğinden gelen bir Türk boyu olduğunu savunur.",
    fc: ["Wittek’in kuruluş tezinin özü nedir?", "Osmanlı Beyliği’nin kuruluşunda gaza geleneğinin temel unsur olduğu görüşüdür."]
  },
  {
    si: 1,
    metin: "Wittek’in gaza tezine kanıt olarak gösterdiği kaynak aşağıdakilerden hangisidir?",
    secenekler: [
      "Ahmedî’nin İskendername adlı eseri",
      "Aşıkpaşazade’nin tarih kitabı",
      "Pachymeres’in Bizans vakayinamesi",
      "İbn Bibi’nin Selçukname’si"
    ],
    dogru: 0,
    cozum: "Wittek, Ahmedî’nin İskendername’sindeki bölümü Osmanlıların gazi topluluğuna mensup olduğuna kanıt göstermiştir.",
    fc: ["Gaza tezinin dayandığı temel kanıt nedir?", "Ahmedî’nin İskendername’sinde Osmanlıların gazi topluluğuna bağlanmasıdır."]
  },
  {
    si: 1,
    metin: "İlk Osmanlı kroniklerinin Osman Bey döneminden yaklaşık yüz yıl sonra yazılmış olması, bu kaynakların hangi yönden zayıf olduğunu gösterir?",
    secenekler: [
      "Çağdaş tanıklığa dayanmamaları",
      "Aşırı ayrıntılı olmaları",
      "Yalnızca Bizans’ı anlatmaları",
      "Türkçe kaleme alınmamaları"
    ],
    dogru: 0,
    cozum: "Olayların üzerinden uzun zaman geçtikten sonra yazılan kroniklerde menkıbe ve kurgu bilgilerin anlatıya karışması kaçınılmaz olur.",
    fc: ["Kronik kaynakların sınırlılığı nedir?", "Olay dönemine tanıklık etmedikleri için menkıbe ve kurgu bilgi içerebilirler."]
  },
  {
    si: 1,
    metin: "İnalcık’ın Osmanlı kuruluşunu üç temel çerçevede ele alması, önceki tezlerin hangi sınırlılığını aşmaya yöneliktir?",
    secenekler: [
      "Tek etkene dayalı açıklamaların yetersizliğini",
      "Kaynak dilinin Arapça olmasını",
      "Kuruluş tarihinin bilinmemesini",
      "Beyliğin göçebe olmasını"
    ],
    dogru: 0,
    cozum: "Türkmen göçü, gaza hareketi ve ticaret merkezlerinin yükselişi birlikte değerlendirilerek tek nedenli açıklamalar aşılmaya çalışılmıştır.",
    fc: ["İnalcık’ın kuruluş yönteminin özelliği nedir?", "Göç, gaza ve ticaret gibi birden çok etkeni birlikte değerlendirmesidir."]
  },
  {
    si: 2,
    metin: "Kuruluşu yalnızca gaza geleneğine bağlayan görüş hangi gerekçeyle eleştiriye açıktır?",
    secenekler: [
      "Gaza anlayışının diğer uç beyliklerinde de bulunması",
      "Gaza kavramının Osmanlı kaynaklarında geçmemesi",
      "Beyliğin denizci bir topluluk olması",
      "Moğolların Anadolu’ya hiç girmemesi"
    ],
    dogru: 0,
    cozum: "Aynı gaza geleneğini taşıyan beylikler arasından yalnızca Osmanlı’nın büyümesi, gaza dışındaki etkenlerin de hesaba katılmasını gerektirir.",
    fc: ["Gaza tezinin zayıf noktası nedir?", "Gaza geleneğinin diğer uç beyliklerinde de görülmesi, Osmanlı’nın yükselişini tek başına açıklamaya yetmez."]
  },
  {
    si: 2,
    metin: "Osmanlı Devleti’nin kuruluş tarihi olarak 1299 yılının benimsenmesinin dayanağı nedir?",
    secenekler: [
      "Osman Bey’in Karacahisar’da kendi adına hutbe okutması",
      "Bursa’nın fethedilmesi",
      "İznik’te ilk medresenin açılması",
      "Ankara Savaşı’nın kazanılması"
    ],
    dogru: 0,
    cozum: "Hutbenin hükümdar adına okutulması bağımsızlık göstergesi sayıldığı için 1299 kuruluş yılı olarak kabul edilmiştir.",
    fc: ["Hutbe okutmanın anlamı nedir?", "Hükümdarın kendi adına hutbe okutması bağımsızlık ilanı sayılır."]
  },
  {
    si: 2,
    metin: "Kuruluş dönemi tartışmalarında 1299-1326 arası olaylar için kesin yargıya varmayı güçleştiren temel etken nedir?",
    secenekler: [
      "Döneme ait yeterli çağdaş kaynak bulunmaması",
      "Tarihçilerin konuyla ilgilenmemesi",
      "Belgelerin tamamının yok edilmesi",
      "Kuruluşun başka bir devlete ait olması"
    ],
    dogru: 0,
    cozum: "İlk dönem olaylarına ilişkin çağdaş kaynakların azlığı, tarihçileri teorik çıkarımlara yöneltmiş ve farklı görüşlerin doğmasına yol açmıştır.",
    fc: ["Kuruluş tartışmalarının kaynağı nedir?", "İlk döneme ait çağdaş kaynak ve bilgi azlığıdır."]
  },
  {
    si: 2,
    metin: "İnalcık’ın “Osman Gazi’nin esas hedefi İznik’ti” tespitini dayandırdığı kaynak hangisidir?",
    secenekler: ["Bizans kaynağı Pachymeres", "Aşıkpaşazade tarihi", "İbn Bibi’nin Selçukname’si", "Naima’nın vakayinamesi"],
    dogru: 0,
    cozum: "İnalcık, Pachymeres’in tercümelerini okuyarak Osman Gazi ile Bizans arasındaki mücadelenin İznik’in kuşatılmasıyla başladığını belirlemiştir.",
    fc: ["İnalcık’ın Bizans kaynağı okumasının sonucu nedir?", "Osman Gazi’nin asıl hedefinin İznik olduğunu ortaya koymuştur."]
  }
]);

/* ---------------------------------------------------------------- 2.2 */
yaz("tar_10_t02_c02", KAYNAK + ", s.122-139", [
  {
    si: 0,
    metin: "Osman Gazi’nin 1302’de Koyunhisar Savaşı’nı kazanması beyliğe hangi avantajı sağlamıştır?",
    secenekler: [
      "Türkmen aşiretleri arasında ün kazanıp gazi alplerin önderi olmasını",
      "Bizans başkentini ele geçirmesini",
      "Donanma kurarak Ege’ye açılmasını",
      "İpek yolunun denetimini almasını"
    ],
    dogru: 0,
    cozum: "Koyunhisar zaferi Osman Gazi’nin itibarını artırmış, çevresinde gazi ve alp topluluklarının toplanmasını sağlamıştır.",
    fc: ["Koyunhisar Savaşı’nın beyliğe katkısı nedir?", "Osman Gazi’nin Türkmen aşiretleri arasında ününü artırmış, gazi alplerin önderi yapmıştır."]
  },
  {
    si: 0,
    metin: "Orhan Gazi’nin 1345’te Karesioğulları’nı topraklarına katması, Osmanlı’ya hangi alanda üstünlük sağlamıştır?",
    secenekler: [
      "Denizcilik tecrübesi ve donanma imkânı",
      "Ağır top teknolojisi",
      "Medrese eğitimi geleneği",
      "Tımar sisteminin denetimi"
    ],
    dogru: 0,
    cozum: "Osmanlı hâkimiyetine alınan ilk Türk beyliği olan Karesioğulları’nın tersane ve denizcilik tecrübesi Rumeli fetihlerini kolaylaştırdı.",
    fc: ["Osmanlı’ya katılan ilk Türk beyliğinin adı nedir?", "1345’te katılan Karesioğulları’dır."]
  },
  {
    si: 0,
    metin: "1353’te Çimpe Kalesi’nin alınması Osmanlı tarihi açısından neden önemlidir?",
    secenekler: [
      "Rumeli’de elde edilen ilk üs olması",
      "Anadolu’da ilk fetih olması",
      "Bizans’ın başkentinin düşmesi",
      "İlk donanmanın kurulması"
    ],
    dogru: 0,
    cozum: "Çimpe, Osmanlıların Rumeli’de tutunduğu ilk üs olmuş ve Balkan fetihlerinin hareket noktasını oluşturmuştur.",
    fc: ["Çimpe Kalesi’nin önemi nedir?", "Osmanlıların Rumeli’de elde ettiği ilk üs olmasıdır."]
  },
  {
    si: 1,
    metin: "Tabloda 1299-1453 arasındaki dört savaş ve sonuçları verilmiştir. Tabloya göre Fetret Devri’ne yol açan gelişme hangi savaşın sonucudur?",
    secenekler: ["Ankara Savaşı", "I. Kosova Savaşı", "Niğbolu Savaşı", "Varna Savaşı"],
    dogru: 0,
    cozum: "Tabloda şehzadeler arası taht kavgalarıyla başlayan Fetret Devri, 1402 Ankara Savaşı’nın sonucu olarak gösterilmiştir.",
    gorsel: {
      tip: "tablo",
      basliklar: ["Savaş", "Yıl", "Sonuç"],
      satirlar: [
        ["I. Kosova", "1389", "Balkanlarda Osmanlı üstünlüğü pekişti"],
        ["Niğbolu", "1396", "Haçlı ordusu ağır yenilgiye uğradı"],
        ["Ankara", "1402", "Fetret Devri başladı"],
        ["Varna", "1444", "Balkan Haçlı ittifakı dağıldı"]
      ]
    },
    fc: ["Fetret Devri’nin başlangıç olayı nedir?", "1402 Ankara Savaşı yenilgisiyle başlamış, şehzadeler arasında taht kavgası çıkmıştır."]
  },
  {
    si: 1,
    metin: "II. Kosova Savaşı’nın (1448) ardından Osmanlı Devleti’nin Balkanlardaki konumu nasıl değişmiştir?",
    secenekler: [
      "Haçlıların Osmanlıyı Balkanlardan atma umudu sona ermiştir",
      "Balkan beylikleri Osmanlı’dan ayrılmıştır",
      "Osmanlı Balkanlardan çekilmiştir",
      "Macaristan Osmanlı’ya bağlanmıştır"
    ],
    dogru: 0,
    cozum: "II. Kosova, Balkanlarda Osmanlı hâkimiyetini kesinleştirmiş ve yeni bir Haçlı seferi girişimini fiilen bitirmiştir.",
    fc: ["II. Kosova Savaşı’nın sonucu nedir?", "Balkanlarda Osmanlı hâkimiyeti kesinleşmiş, Haçlı girişimleri sonuçsuz kalmıştır."]
  },
  {
    si: 1,
    metin: "I. Kosova (1389) ve Niğbolu (1396) savaşlarının ortak sonucu aşağıdakilerden hangisidir?",
    secenekler: [
      "Balkanlarda Osmanlı üstünlüğünün pekişmesi",
      "Anadolu birliğinin bozulması",
      "Bizans’ın Osmanlı’ya tâbi olması",
      "Memlûklerle sınır komşusu olunması"
    ],
    dogru: 0,
    cozum: "Her iki savaş da Balkan Haçlı ittifaklarının yenilgisiyle sonuçlanmış, Osmanlı’nın bölgedeki egemenliğini güçlendirmiştir.",
    fc: ["Niğbolu Savaşı’nın önemi nedir?", "Haçlı ordusunun ağır yenilgisiyle Balkanlarda Osmanlı üstünlüğü pekişmiştir."]
  },
  {
    si: 2,
    metin: "1402 Ankara Savaşı’nın ardından yaşanan Fetret Devri’nin Osmanlı devlet düzenine etkisi nedir?",
    secenekler: [
      "Taht kavgalarıyla merkezî otoritenin sarsılması",
      "Tımar sisteminin ilk kez uygulanması",
      "Devşirme usulünün kaldırılması",
      "Başkentin Edirne’ye taşınması"
    ],
    dogru: 0,
    cozum: "Yıldırım Bayezid’in esir düşmesiyle şehzadeler taht için çatışmış, Anadolu’daki beylikler yeniden kurularak birlik bozulmuştur.",
    fc: ["Fetret Devri’nin anlamı nedir?", "1402-1413 arasında taht kavgaları nedeniyle devlet otoritesinin durakladığı dönemdir."]
  },
  {
    si: 2,
    metin: "Edirne’nin fethinin (1361) başkent açısından anlamı nedir?",
    secenekler: [
      "Devletin merkezinin Rumeli’ye taşınması",
      "Anadolu’daki fetihlerin durması",
      "Bizans’la ittifak kurulması",
      "Donanmanın Karadeniz’e çıkması"
    ],
    dogru: 0,
    cozum: "Edirne’nin alınmasıyla başkent Bursa’dan Edirne’ye taşınmış, devletin ağırlık merkezi Rumeli’ye kaymıştır.",
    fc: ["Edirne’nin üstlendiği işlev nedir?", "Fethin ardından Osmanlı Devleti’nin yeni başkenti olmuştur."]
  },
  {
    si: 2,
    metin: "Niğbolu Savaşı’nın (1396) ardından Yıldırım Bayezid’in Anadolu’ya yönelmesinin sonucu ne olmuştur?",
    secenekler: [
      "Anadolu beyliklerinin ilhak edilmesi",
      "Balkan fetihlerinin durdurulması",
      "Bizans’ın Osmanlı’ya savaş açması",
      "Moğolların Anadolu’ya girmesi"
    ],
    dogru: 0,
    cozum: "Bayezid Anadolu’ya dönerek beylikleri topraklarına katmış, böylece Anadolu’da siyasi birliği büyük ölçüde sağlamıştır.",
    fc: ["Yıldırım Bayezid’in Anadolu politikası nedir?", "Beylikleri ilhak ederek Anadolu’da siyasi birliği sağlamaya çalışmaktır."]
  },
  {
    si: 2,
    metin: "14. yüzyılda Osmanlı’nın Rumeli’de ilerlemesinde akıncı ve gazi gruplarının rolü nedir?",
    secenekler: [
      "Ordunun önünde keşif yapıp geçitleri güvenceye almaları",
      "Vergi toplama işini yürütmeleri",
      "Medreselerde ders vermeleri",
      "Donanmaya asker yetiştirmeleri"
    ],
    dogru: 0,
    cozum: "Akıncılar asıl ordudan önde giderek keşif yapar, yol ve köprüleri emniyete alır, düşman yardımını engellerdi.",
    fc: ["Akıncıların savaş görevi nedir?", "Keşif yapmak, geçitleri güven altına almak ve düşmanı yıpratmaktır."]
  }
]);

/* ---------------------------------------------------------------- 2.3 */
yaz("tar_10_t02_c03", KAYNAK + ", s.140-155", [
  {
    si: 0,
    metin: "Osmanlı toprak sisteminde mülkiyeti devlete ait olup işleme hakkı şahıslara bırakılan araziler hangisidir?",
    secenekler: ["Mirî arazi", "Mülk arazi", "Vakıf arazisi", "Haraci arazi"],
    dogru: 0,
    cozum: "Mirî arazi, mülkiyeti devlete ait olan ve işleme hakkı reayaya bırakılan, genellikle tahıl üretilen tarlalardır.",
    fc: ["Mirî arazinin tanımı nedir?", "Mülkiyeti devlete ait olup işleme hakkı şahıslara bırakılan arazidir."]
  },
  {
    si: 0,
    metin: "Tımarlı sipahinin dirlik içindeki görevleri arasında aşağıdakilerden hangisi yer alır?",
    secenekler: [
      "Üretimi düzenlemek ve vergiyi toplamak",
      "Medresede müderrislik yapmak",
      "Tersanede gemi inşa etmek",
      "Saray mutfağını yönetmek"
    ],
    dogru: 0,
    cozum: "Tımarlı sipahi kendi dirliğinde tarımsal üretimin organize edilmesinden, köy düzeninden ve verginin toplanmasından sorumluydu.",
    fc: ["Tımarlı sipahinin görevi nedir?", "Dirliğinde üretimi düzenler, düzeni sağlar ve belirlenen vergiyi toplar."]
  },
  {
    si: 0,
    metin: "Geçerli bir sebep olmadan toprağını üç yıl boyunca ekip biçmeyen reayanın ödediği vergi hangisidir?",
    secenekler: ["Çiftbozan", "Avarız", "Öşür", "Cizye"],
    dogru: 0,
    cozum: "Toprağın boş bırakılmasını önlemek için üç yıl ekmeyen reayadan bir defaya mahsus çiftbozan vergisi alınırdı.",
    fc: ["Çiftbozan vergisinin tanımı nedir?", "Toprağını üç yıl işlemeyen reayadan bir defaya mahsus alınan vergidir."]
  },
  {
    si: 0,
    metin: "1300’lerden itibaren uygulanan devşirme sistemiyle yetiştirilen çocukların kapıkulu ocaklarına alınmasındaki temel amaç nedir?",
    secenekler: [
      "Padişaha bağlı merkezî bir ordu kurmak",
      "Tımar sahiplerini denetlemek",
      "Vakıf gelirlerini artırmak",
      "Deniz ticaretini geliştirmek"
    ],
    dogru: 0,
    cozum: "Devşirme kökenli kapıkulları padişaha doğrudan bağlı oldukları için merkezî otoritenin dayanağı olmuş, uç beylerinin gücünü dengelemiştir.",
    fc: ["Devşirme sisteminin amacı nedir?", "Padişaha bağlı, merkezî otoriteyi güçlendiren bir ordu ve bürokrasi kurmaktır."]
  },
  {
    si: 0,
    metin: "Osmanlı hukuk sisteminde örfi hukukun kaynağı aşağıdakilerden hangisidir?",
    secenekler: [
      "Padişah fermanları ve kanunnameler",
      "Kur’an ve hadis hükümleri",
      "Fethedilen yerlerin yerel örf ve âdetleri",
      "Medrese müfredatındaki fıkıh kitapları"
    ],
    dogru: 0,
    cozum: "Örfi hukuk, şer’i hukukun düzenlemediği alanlarda padişahın iradesiyle konulan kanun ve fermanlardan oluşur.",
    fc: ["Örfi hukukun tanımı nedir?", "Şer’i hukukun boş bıraktığı alanlarda padişah iradesiyle konulan kurallar bütünüdür."]
  },
  {
    si: 1,
    metin: "Tımar sistemi ile kapıkulu ocakları arasındaki mali ilişki aşağıdakilerden hangisidir?",
    secenekler: [
      "Tımarlı sipahi toprak geliriyle, kapıkulu hazineden ulufeyle beslenir",
      "İkisi de yalnızca ganimetle geçinir",
      "İkisinin gideri vakıflarca karşılanır",
      "İkisi de ticaret geliriyle beslenir"
    ],
    dogru: 0,
    cozum: "Tımarlı sipahinin geçimi dirlik gelirine bağlıyken kapıkulu askerine üç ayda bir ulufe adı verilen maaş ödenirdi.",
    fc: ["Ulufenin tanımı nedir?", "Kapıkulu askerlerine üç ayda bir ödenen maaştır."]
  },
  {
    si: 1,
    metin: "Toprak sistemindeki dirlik düzenlemesi, Osmanlı ordu teşkilatını hangi yönde etkilemiştir?",
    secenekler: [
      "Taşrada toprak geliriyle beslenen sipahi ordusunu doğurmuştur",
      "Kapıkulu askerlerinin sayısını sıfıra indirmiştir",
      "Donanmanın kaldırılmasına yol açmıştır",
      "Devşirme usulünü gereksiz kılmıştır"
    ],
    dogru: 0,
    cozum: "Dirlik geliri karşılığında asker beslemek zorunda olan sipahiler, eyalet ordusunun temelini oluşturmuştur.",
    fc: ["Tımar sistemi ile ordu arasındaki bağ nedir?", "Dirlik sahibi sipahiler gelirleri karşılığında asker besleyerek eyalet ordusunu oluşturur."]
  },
  {
    si: 1,
    metin: "Devşirme ve tımar uygulamalarının ortak amacı aşağıdakilerden hangisidir?",
    secenekler: [
      "Merkezî otoriteyi güçlendirmek",
      "Ticareti denetim altına almak",
      "Vakıf sayısını artırmak",
      "Medrese müfredatını birleştirmek"
    ],
    dogru: 0,
    cozum: "Devşirme merkeze bağlı kadrolar yetiştirirken tımar taşrada devlet otoritesini ve vergi düzenini yerleştiriyordu.",
    fc: ["Devşirme ve tımarın ortak hedefi nedir?", "Taşrada ve merkezde devlet otoritesini güçlendirmektir."]
  },
  {
    si: 1,
    metin: "Kadının hem şer’i hem örfi davalara bakabilmesi Osmanlı hukuk düzeni hakkında neyi gösterir?",
    secenekler: [
      "İkili hukuk yapısının bütünleşik işlediğini",
      "Örfi hukukun tamamen kaldırıldığını",
      "Şer’i hukukun uygulanmadığını",
      "Yargının eyaletlere bırakıldığını"
    ],
    dogru: 0,
    cozum: "Kadı, şer’i hükümlerin yanında padişah kanunlarını da uygulayarak iki hukuk alanını aynı mahkemede birleştirirdi.",
    fc: ["Kadının yargı yetkisi nedir?", "Bulunduğu kazada hem şer’i hem örfi davalara bakmakla yetkilidir."]
  },
  {
    si: 1,
    metin: "Has, zeamet ve tımar dirliklerinin birlikte değerlendirilmesi hangi ortak ilkeyi gösterir?",
    secenekler: [
      "Gelirin hizmet karşılığı tahsis edilmesini",
      "Toprağın özel mülkiyete geçmesini",
      "Vergilerin nakden toplanmasını",
      "Askerliğin babadan oğula geçmesini"
    ],
    dogru: 0,
    cozum: "Dirlikler gelir büyüklüğüne göre sınıflandırılır ve karşılığında devlet hizmeti yüklenen kişilere verilirdi.",
    fc: ["Dirlik sisteminin temel ilkesi nedir?", "Devlet gelirinin hizmet karşılığı olarak görevlilere tahsis edilmesidir."]
  }
]);

/* ---------------------------------------------------------------- 2.4 */
yaz("tar_10_t02_c04", KAYNAK + ", s.156-171", [
  {
    si: 0,
    metin: "14-15. yüzyıl iskân politikasının uygulanışına ilişkin kaynaklarda farklı bakış açılarının bulunmasının temel nedeni nedir?",
    secenekler: [
      "Kaynakların yazıldığı dönem ve amaçlarının farklı olması",
      "İskânın hiç uygulanmamış olması",
      "Belgelerin tamamının aynı elden çıkması",
      "Konunun yalnızca sözlü aktarılması"
    ],
    dogru: 0,
    cozum: "Bir kaynağın hangi dönemde, kim tarafından ve hangi amaçla yazıldığı, olayı değerlendiriş biçimini belirler.",
    fc: ["Kaynaklarda bakış açısı farkının nedeni nedir?", "Kaynağın yazıldığı dönem, yazarı ve amacının farklı olmasıdır."]
  },
  {
    si: 0,
    metin: "İstimalet politikasına ilişkin farklı yorumları değerlendiren bir araştırmacının sorması gereken temel soru hangisidir?",
    secenekler: [
      "Kaynağı kim, hangi amaçla ve ne zaman yazmıştır?",
      "Kaynak kaç sayfadan oluşmaktadır?",
      "Kaynak hangi dilde basılmıştır?",
      "Kaynağın kapağında hangi resim vardır?"
    ],
    dogru: 0,
    cozum: "Yazarın kimliği, amacı ve yazılış zamanı bilinmeden kaynağın bakış açısı ve sınırlılığı değerlendirilemez.",
    fc: ["Kaynak eleştirisinin ilk sorusu nedir?", "Kaynağın kim tarafından, hangi amaçla ve ne zaman üretildiğidir."]
  },
  {
    si: 0,
    metin: "Üsküp’e Saruhan bölgesinden Türklerin yerleştirilmesiyle hangi sonucun amaçlandığı söylenebilir?",
    secenekler: [
      "Fethedilen bölgede kalıcı nüfus ve düzen oluşturmak",
      "Anadolu’daki nüfusu tamamen boşaltmak",
      "Ticaret yollarını kapatmak",
      "Bizans ordusunu güçlendirmek"
    ],
    dogru: 0,
    cozum: "İskân, fethedilen yerlerde yerleşik Türk nüfusu oluşturarak şehirlerin imarını ve bölgenin kalıcı hâkimiyetini sağlamıştır.",
    fc: ["İskân politikasının amacı nedir?", "Fethedilen bölgelerde kalıcı Türk nüfusu ve düzen oluşturmaktır."]
  },
  {
    si: 1,
    metin: "Vakıf kayıtlarının yalnızca hayır işlerini öne çıkarması, iskân politikası konusunda hangi sınırlılığı doğurur?",
    secenekler: [
      "Yerel direnç ve başarısızlıkları yansıtmaması",
      "Bölgenin adını yanlış yazması",
      "Vakıfların tarihini bilmemesi",
      "Belgelerin dilini değiştirmesi"
    ],
    dogru: 0,
    cozum: "Vakıf belgeleri kurumun yararını öne çıkardığı için iskân sürecindeki çatışmaları ve aksaklıkları aktarmaz.",
    fc: ["Vakıf kayıtlarının sınırlılığı nedir?", "Kurumun başarısını öne çıkarıp çatışma ve aksaklıklara yer vermemesidir."]
  },
  {
    si: 1,
    metin: "1402 sonrası nüfus hareketlerini tek bir kaynağa dayanarak değerlendirmenin sınırlılığı nedir?",
    secenekler: [
      "Eksik ya da yanlı bilgiyi kesin sonuç sayma riski",
      "Kaynağın mutlaka yanlış olması",
      "Nüfusun hiç değişmemesi",
      "Vergi kayıtlarının yok sayılması"
    ],
    dogru: 0,
    cozum: "Tek kaynak, olayın yalnızca bir yönünü yansıtır; tahrir kayıtları ve kroniklerle karşılaştırma yapılmadan kesin yargıya varılamaz.",
    fc: ["Tek kaynağa dayanmanın riski nedir?", "Olayın tek yönünü göstererek eksik ya da yanlı sonuçlara götürmesidir."]
  },
  {
    si: 1,
    metin: "1402 sonrası iskânın yavaşladığını anlatan bir kaynağın sınırlılığı ne olabilir?",
    secenekler: [
      "Dönemin bütününü tek bir bakış açısıyla açıklaması",
      "Olayları tarih sırasına koyması",
      "Belgelerden alıntı yapması",
      "Yer adlarını ayrıntılı vermesi"
    ],
    dogru: 0,
    cozum: "Tek bakış açısına dayanan anlatı, başka bölgelerdeki uygulamaları ve farklı nedenleri gözden kaçırabilir.",
    fc: ["Anlatı kaynaklarının sınırlılığı nedir?", "Olayı yazarın bakış açısıyla sınırlayıp başka etkenleri görünmez kılmasıdır."]
  },
  {
    si: 2,
    metin: "Tımar sisteminin iskân politikasına sağladığı yarar aşağıdakilerden hangisidir?",
    secenekler: [
      "Yollar boyunca köyler kurulup sevkiyat kolaylaşmıştır",
      "Bölge halkı vergiden tamamen muaf tutulmuştur",
      "Şehirlerde surlar yıkılmıştır",
      "Göçler tamamen yasaklanmıştır"
    ],
    dogru: 0,
    cozum: "Tımar toprağı verilmesi göçü teşvik etmiş, kurulan köy ve kasabalar yeni seferlerde asker ve erzak tedarikini kolaylaştırmıştır.",
    fc: ["Tımarın iskâna katkısı nedir?", "Toprak verilerek göç teşvik edilmiş, yollar boyunca köyler kurulmuştur."]
  },
  {
    si: 2,
    metin: "Uzunköprü örneğinden iskân politikasına ilişkin hangi çıkarım yapılabilir?",
    secenekler: [
      "Altyapı yatırımlarının yerleşmeyi kalıcı kıldığı",
      "Köprülerin yalnızca askerî amaç taşıdığı",
      "Şehirlerin kendiliğinden büyüdüğü",
      "Vakıfların iskânla ilgisiz olduğu"
    ],
    dogru: 0,
    cozum: "Köprü çevresinde vakıf, mescit, imaret ve pazar kurulması, ulaşım yatırımının yerleşmeyi çektiğini gösterir.",
    fc: ["Cisr-i Ergene’nin inşa amacı nedir?", "Ergene üzerinde ulaşımı sağlamak ve çevresinde yeni bir yerleşme kurmaktır."]
  },
  {
    si: 2,
    metin: "Balkanlarda Anadolu beyliklerinin adını taşıyan köylerin bulunması neyi kanıtlar?",
    secenekler: [
      "İskânın izlerinin günümüze ulaştığını",
      "Beyliklerin Balkanlarda kurulduğunu",
      "Göçlerin hiç yaşanmadığını",
      "Köy adlarının sonradan uydurulduğunu"
    ],
    dogru: 0,
    cozum: "Rumeli’ye yerleşen aileler geldikleri yörenin adını taşıyan köyler kurmuş, bu adlar günümüze kadar sürmüştür.",
    fc: ["Balkan köy adlarının kaynağı nedir?", "İskân edilen ailelerin Anadolu’daki geldikleri yörenin adıdır."]
  },
  {
    si: 2,
    metin: "Ahilerin ve dervişlerin iskân faaliyetlerine katılması hangi sonucu doğurmuştur?",
    secenekler: [
      "Balkanlarda şehir hayatının ve İslamlaşmanın yayılmasını",
      "Ticaretin bütünüyle durmasına yol açmasını",
      "Osmanlı ordusunun dağılmasına yol açmasını",
      "Bütün vakıfların kapatılmasını"
    ],
    dogru: 0,
    cozum: "Ahiler ve dervişler yerleştikleri yerlerde örnek yaşayış ve sosyal hizmetlerle bölgenin İslamlaşmasına ve şehirleşmesine katkı sağlamıştır.",
    fc: ["Ahilerin iskândaki rolü nedir?", "Yerleştikleri bölgelerde ticaret, sosyal yardım ve İslamlaşmayı yaygınlaştırmaktır."]
  }
]);

/* ---------------------------------------------------------------- 2.5 */
yaz("tar_10_t02_c05", KAYNAK + ", s.172-196", [
  {
    si: 0,
    metin: "Osmanlı belgelerinde şehrin “cuma kılınır ve pazar kurulur yer” olarak tanımlanması neyi gösterir?",
    secenekler: [
      "İbadet ve ticaretin şehir hayatının ölçütü olduğunu",
      "Şehirlerde pazar kurulmasının yasak olduğunu",
      "Cami yapımının yalnızca saraya ait olduğunu",
      "Köylerin şehirden büyük olduğunu"
    ],
    dogru: 0,
    cozum: "Tanım, bir yerleşmenin şehir sayılması için ulu cami ve düzenli pazar gibi kurumsal unsurları şart koşar.",
    fc: ["Osmanlı’da şehir tanımı nedir?", "Cuma namazı kılınan ve pazar kurulan yerleşme olarak tanımlanır."]
  },
  {
    si: 0,
    metin: "Orhan Gazi’nin Bursa’da cami, imaret, medrese, hamam ve kervansaraydan oluşan külliye yaptırması hangi amaca hizmet eder?",
    secenekler: [
      "Şehirde ilmî ve sosyal hayatı kurumsallaştırmak",
      "Ticaret yollarını kapatmak",
      "Asker sayısını azaltmak",
      "Bizans’la ittifak kurmak"
    ],
    dogru: 0,
    cozum: "Külliye, eğitim, ibadet, barınma ve sosyal yardım işlevlerini bir araya getirerek şehir hayatını kurumsallaştırır.",
    fc: ["Külliyenin tanımı nedir?", "Cami, medrese, imaret, hamam gibi yapıların bir arada kurulduğu yapı topluluğudur."]
  },
  {
    si: 0,
    metin: "Şeyh Edebali’nin Bilecik’te bir zaviye kurması, ilim ve irfan geleneğinde hangi kurumun rolünü gösterir?",
    secenekler: [
      "Tekke ve zaviyelerin",
      "Tersanelerin",
      "Bedestenlerin",
      "Tımarlı sipahilerin"
    ],
    dogru: 0,
    cozum: "Zaviye ve tekkeler, dervişlerin eğitim gördüğü ve halkın dinî-sosyal ihtiyaçlarının karşılandığı kurumlardır.",
    fc: ["Zaviyenin işlevi nedir?", "Dervişlerin barındığı, eğitim gördüğü ve halka hizmet verdiği tekke yapısıdır."]
  },
  {
    si: 1,
    metin: "İlk Türk-İslam devletlerindeki medrese ve vakıf deneyiminin Osmanlı’ya aktarılması hangi sonucu doğurmuştur?",
    secenekler: [
      "Eğitim kurumlarının kesintisiz süreklilik kazanmasını",
      "Medreselerin kapatılmasını",
      "Vakıfların kaldırılmasını",
      "Eğitimin saraya taşınmasını"
    ],
    dogru: 0,
    cozum: "Vakıf gelirleriyle desteklenen medrese modeli Osmanlı’da da sürdürülmüş, eğitim kesintisiz bir kurumsal geleneğe dönüşmüştür.",
    fc: ["Medrese modelinin sürekliliği neye dayanır?", "Vakıf gelirleriyle desteklenen kurumsal yapının kuşaktan kuşağa aktarılmasına dayanır."]
  },
  {
    si: 1,
    metin: "Selçuklu dönemindeki Nizamiye modeli ile Osmanlı medreseleri arasındaki benzerlik aşağıdakilerden hangisidir?",
    secenekler: [
      "Vakıf gelirleriyle desteklenen yapı ve örgütlü müfredat",
      "Yalnızca tıp eğitimi verilmesi",
      "Eğitimin yalnızca Türkçe yapılması",
      "Öğrencilerin ücretle okutulması"
    ],
    dogru: 0,
    cozum: "Her iki modelde de medreseler vakıf gelirleriyle yaşatılmış ve belirli bir müfredat sırasına göre eğitim verilmiştir.",
    fc: ["Medreselerin mali kaynağı nedir?", "Vakıf gelirleri ve vakfedilen arazilerin geliridir."]
  },
  {
    si: 1,
    metin: "Karahanlı ve Gazneli dönemlerindeki âlim himayesinin Osmanlı’da yinelenmesi neyi gösterir?",
    secenekler: [
      "İlim geleneğinin devlet desteğiyle sürdüğünü",
      "Âlimlerin devletten uzak durduğunu",
      "Bilimsel çalışmaların yasaklandığını",
      "Medreselerin bağımsız kaldığını"
    ],
    dogru: 0,
    cozum: "Hükümdarların âlimleri koruyup desteklemesi, Türk-İslam devletlerinde bilim ve eğitimin ortak bir gelenek olarak sürmesini sağlamıştır.",
    fc: ["Türk-İslam devletlerinde âlimlerin konumu nedir?", "Hükümdarlarca korunup desteklenen, saray ve vakıf imkânlarıyla çalışan kişilerdir."]
  },
  {
    si: 2,
    metin: "İznik’te ilk Osmanlı medresesinin açılması devletin hangi ihtiyacına yanıt verir?",
    secenekler: [
      "Kadı ve müderris gibi ilmî kadrolar yetiştirmek",
      "Donanmaya kaptan yetiştirmek",
      "Ticaret kervanlarını korumak",
      "Surları onarmak"
    ],
    dogru: 0,
    cozum: "Yeni kurulan devletin yargı ve eğitim hizmetlerini yürütecek yetişmiş kadrolara ihtiyacı vardı; medrese bu ihtiyaca yanıt verdi.",
    fc: ["İznik medresesinin işlevi nedir?", "Devletin ihtiyaç duyduğu kadı ve müderrisleri yetiştiren ilk Osmanlı yüksek eğitim kurumudur."]
  },
  {
    si: 2,
    metin: "Dursun Fakih’in Karacahisar’da ilk cuma hutbesini okuması kuruluş döneminde hangi gelişmenin göstergesidir?",
    secenekler: [
      "Bağımsızlık ve dinî meşruiyetin ilan edilmesinin",
      "Bizans’a bağlılığın sürmesinin",
      "Medreselerin kapatılmasının",
      "Göçebe hayatın sona ermesinin"
    ],
    dogru: 0,
    cozum: "Hutbenin Osman Gazi adına okunması, bağımsızlığın ilanı ve yeni devletin dinî meşruiyet kazanması anlamına gelir.",
    fc: ["İlk cuma hutbesinin anlamı nedir?", "Devletin bağımsızlığını ve dinî meşruiyetini ilan etmesidir."]
  },
  {
    si: 2,
    metin: "Hacı Bayram Veli’nin Ankara’da çevresinde çok sayıda dervişin toplanmasının şehir hayatına etkisi ne olabilir?",
    secenekler: [
      "Vakıf, zaviye ve mahallelerin kurulmasıyla şehrin büyümesi",
      "Şehir nüfusunun hızla azalması ve boşalması",
      "Ticaretin bütünüyle durması ve pazarların kapanması",
      "Medreselerin kapatılıp eğitimin sona ermesi"
    ],
    dogru: 0,
    cozum: "Adına vakıflar, zaviyeler ve mahalleler kurulması, tasavvufi hareketin şehirleşmeyi ve nüfus artışını desteklediğini gösterir.",
    fc: ["Tekke ve zaviyelerin şehre etkisi nedir?", "Mahalle ve vakıf kurulmasını sağlayarak şehrin büyümesine katkı verir."]
  },
  {
    si: 2,
    metin: "Bacıyân-ı Rum teşkilatının varlığı ilim ve irfan geleneğine hangi katkıyı sağlar?",
    secenekler: [
      "Kadınların üretim ve karar süreçlerine katılmasını",
      "Yalnızca erkeklerin eğitim almasını",
      "Ticaretin saraya devredilmesini",
      "Göçlerin yasaklanmasını"
    ],
    dogru: 0,
    cozum: "Anadolu kadınlarının oluşturduğu bu teşkilat, kadınların üretimde ve toplumsal kararlarda yer almasını sağlamıştır.",
    fc: ["Bacıyân-ı Rum nedir?", "Anadolu’da kadınların kurduğu, üretim ve sosyal dayanışmayı örgütleyen teşkilattır."]
  }
]);
