#!/usr/bin/env node
/* Din Kültürü ve Ahlak Bilgisi 10 · Tema 1 (İslam’da Varlık ve Bilgi) havuzları.
   Kaynak: MEB Din Kültürü ve Ahlak Bilgisi 10 ders kitabı (2025).
   Sayfa numaraları basılı sayfadır (JSON sayfa = basılı sayfa). */
"use strict";

const { yaz } = require("../yazicilar/yaz.js");

const KAYNAK = "MEB Din Kültürü ve Ahlak Bilgisi 10 ders kitabı (2025)";

/* ---------------------------------------------------------------- 1.1 */
yaz("din_10_t01_c01", KAYNAK + ", s.14-23", [
  {
    si: 0,
    metin: "İslam literatüründe bilgi genellikle “ilim” kavramıyla karşılanır. Buna göre ilim sahibi kişiye verilen ad hangisidir?",
    secenekler: ["Âlim", "Fâkih", "Müfessir", "Muhaddis"],
    dogru: 0,
    cozum: "İlimle meşgul olan, bilgi sahibi kişiye âlim denir; fâkih, müfessir ve muhaddis ise belirli ilim dallarıyla uğraşan kişilerdir.",
    fc: ["İlim kavramının anlamı nedir?", "Bilmek, bir şeyin aslını kavramak; İslam literatüründe bilgi karşılığında kullanılır."]
  },
  {
    si: 0,
    metin: "Hz. Muhammed’in (sav) “İlim öğrenmek kadın ve erkek her Müslüman’a farzdır.” sözü ilmin hangi yönünü vurgular?",
    secenekler: [
      "Herkes için yerine getirilmesi gereken bir görev olduğunu",
      "Yalnızca erkeklere ait bir uğraş olduğunu",
      "Sadece din âlimlerine bırakıldığını",
      "Yalnızca ibadet vakitlerinde gerekli olduğunu"
    ],
    dogru: 0,
    cozum: "Hadis, ilim öğrenmeyi cinsiyet ayrımı yapmadan bütün Müslümanlar için farz, yani zorunlu bir görev olarak bildirir.",
    fc: ["İlim öğrenmenin dindeki hükmü nedir?", "Kadın ve erkek her Müslüman için farz sayılmasıdır."]
  },
  {
    si: 0,
    metin: "Bedir Savaşı sonrasında okuma yazma bilen esirlerin on Müslüman’a okuma yazma öğretmesi karşılığında serbest bırakılması neyi gösterir?",
    secenekler: [
      "İlmin yaygınlaşmasına verilen değeri",
      "Savaşın uzun süre devam ettiğini",
      "Esirlerin tümünün varlıklı olduğunu",
      "Medine’de hiç okul bulunmadığını"
    ],
    dogru: 0,
    cozum: "Esirlerin özgürlüğüne karşılık okuma yazma öğretmesi, Hz. Peygamber’in eğitimin yaygınlaşmasına verdiği önemi gösterir.",
    fc: ["Bedir esirlerine okuma yazma öğretilmesinin amacı nedir?", "Toplumda okuma yazma bilenlerin çoğalmasını sağlamaktır."]
  },
  {
    si: 0,
    metin: "Metne göre doğru bilgi insanı öncelikli olarak hangi sonuca yönlendirir?",
    secenekler: ["Doğru inanca", "Dünyadan uzaklaşmaya", "Mal biriktirmeye", "Toplumdan soyutlanmaya"],
    dogru: 0,
    cozum: "Doğru bilgi insanı doğru inanca, doğru inanç ise doğru davranışa yönlendirir.",
    fc: ["Doğru bilginin davranışa etkisi nedir?", "Doğru bilgi doğru inanca, doğru inanç da doğru davranışa götürür."]
  },
  {
    si: 0,
    metin: "İslam’a göre bilginin asıl kaynağı hangisidir?",
    secenekler: ["Allah (cc)", "İnsanın hayal gücü", "Toplumsal gelenek", "Sanat eserleri"],
    dogru: 0,
    cozum: "İslam’a göre bilginin asıl kaynağı Allah’tır; insana düşünme, araştırma ve öğrenme kabiliyetini de O vermiştir.",
    fc: ["Vahyin bilgi değeri nedir?", "İnananlar için kesin bilgi kaynağıdır ve bağlayıcıdır."]
  },
  {
    si: 1,
    metin: "İslam düşüncesinde nesnel bilgi kaynakları hangileridir?",
    secenekler: [
      "Sadık haber, selim akıl ve salim duyular",
      "Sezgi, rüya ve ilham",
      "Gelenek, görenek ve alışkanlık",
      "Sanat, edebiyat ve müzik"
    ],
    dogru: 0,
    cozum: "Sadık haber, selim akıl ve salim duyular nesnel; sezgi, rüya, keşif ve ilham ise öznel bilgi kaynaklarıdır.",
    fc: ["Nesnel bilgi kaynaklarının tanımı nedir?", "Doğruluğu kişiye bağlı olmayan, sadık haber, selim akıl ve salim duyulardan oluşan kaynaklardır."]
  },
  {
    si: 1,
    metin: "Sadık haberin iki kısmı aşağıdakilerden hangisidir?",
    secenekler: [
      "Haberi resul ve mütevatir haber",
      "Sezgi ve ilham",
      "Gözlem ve deney",
      "Rüya ve keşif"
    ],
    dogru: 0,
    cozum: "Sadık haber; peygamberlerin Allah’tan alıp ilettiği haberi resul (vahiy) ile mütevatir haberden oluşur.",
    fc: ["Haberi resulün tanımı nedir?", "Peygamberlerin Allah’tan alıp insanlara ulaştırdığı haberlerdir; vahiy de denir."]
  },
  {
    si: 1,
    metin: "Mütevatir haberin kesin bilgi kaynağı sayılmasının gerekçesi hangisidir?",
    secenekler: [
      "Yalan üzerinde birleşmeleri mümkün olmayan toplulukların aynı içerikle aktarması",
      "Tek bir kişinin kendi gözlemiyle aktarması ve yazıya geçirmesi",
      "Yalnızca resmî belgelerde yer alması ve arşivlenmesi",
      "Aktaran kişinin toplumda tanınmış bir bilgin olması"
    ],
    dogru: 0,
    cozum: "Mütevatir haber, farklı zaman ve mekânlarda pek çok kişinin aynı içerikle aktardığı haberdir; bu yüzden doğruluğundan şüphe duyulmaz.",
    fc: ["Mütevatir haberin tanımı nedir?", "Yalan üzerinde birleşmeleri mümkün olmayan bir topluluğun aynı içerikle aktardığı haberdir."]
  },
  {
    si: 1,
    metin: "Salim duyularla elde edilen bilgilerin sınırlı sayılmasının nedeni hangisidir?",
    secenekler: [
      "Duyuların belirli aralıkta algılaması ve kimi zaman yanıltması",
      "Duyuların hiçbir zaman bilgi vermemesi ve güvenilmez sayılması",
      "Aklın duyulardan önce gelmesi ve onu her durumda denetlemesi",
      "Herkesin aynı duyusal sonucu alması ve hiç yanılmaması"
    ],
    dogru: 0,
    cozum: "Kulak belirli aralıktaki sesleri duyar, göz belirli ortamdaki varlıkları görür; ayrıca uzaktaki nesnelerin küçük görünmesi gibi durumlarda duyular yanıltabilir.",
    fc: ["Salim duyuların tanımı nedir?", "Herhangi bir etkenle temel özelliğini yitirmemiş, sağlıklı duyu organlarıdır."]
  },
  {
    si: 1,
    metin: "Öznel bilgi kaynaklarıyla elde edilen bilgilerin özelliği hangisidir?",
    secenekler: [
      "Kesin olmaması ve bağlayıcılık taşımaması",
      "Herkes için zorunlu olması",
      "Vahiy ile eşdeğer sayılması",
      "Deneyle kanıtlanmış olması"
    ],
    dogru: 0,
    cozum: "Sezgi, rüya, keşif ve ilham gibi öznel kaynaklardan gelen bilgiler kesin değildir ve başkaları için bağlayıcılığı yoktur.",
    fc: ["Öznel bilgi kaynaklarının tanımı nedir?", "Kişinin kendi tecrübesiyle bilgi edindiği sezgi, rüya, keşif ve ilham gibi kaynaklardır."]
  }
]);

/* ---------------------------------------------------------------- 1.2 */
yaz("din_10_t01_c02", KAYNAK + ", s.24-29", [
  {
    si: 0,
    metin: "Allah-âlem ilişkisi konusuna başlarken öğrencilerden merak ettiklerini kâğıda yazıp soru kutusuna atmaları istenmiştir. Bu etkinliğin temel amacı hangisidir?",
    secenekler: [
      "Merak edilenleri belirleyip inceleme sorusuna dönüştürmek",
      "Konuyla ilgili bilgileri ezberleyerek akılda tutmak",
      "Sınavda çıkabilecek soruları önceden belirlemek",
      "Konuya ait görselleri toplayarak sergi hazırlamak"
    ],
    dogru: 0,
    cozum: "Etkinlik, öğrencinin konu hakkında merak ettiklerini fark etmesini ve bunları cevaplanabilir sorulara dönüştürmesini amaçlar.",
    fc: ["Merak duygusunun öğrenmedeki işlevi nedir?", "İlgiyi canlı tutar; öğrenciyi soru sormaya ve araştırmaya yöneltir."]
  },
  {
    si: 0,
    metin: "Allah-âlem ilişkisi hakkında merak edilenleri belirlerken hangi ölçüt esas alınır?",
    secenekler: [
      "Sorunun konunun kavram ve ayetleriyle ilişkili olması",
      "Sorunun cevabının çok kısa olması",
      "Sorunun günlük hayatta hiç karşılığının bulunmaması",
      "Cevabın yalnızca tek bir kaynakta geçmesi"
    ],
    dogru: 0,
    cozum: "İnceleme sorusu, konunun kavramlarına ve temel kaynaklarına bağlanabildiğinde araştırılabilir ve sınanabilir olur.",
    fc: ["İyi bir inceleme sorusunun özelliği nedir?", "Konuya ilişkin kavramlara dayanan, açık ve kaynaklarla sınanabilir olmasıdır."]
  },
  {
    si: 0,
    metin: "Aşağıdaki sorulardan hangisi Allah-âlem ilişkisini incelemeye yöneliktir?",
    secenekler: [
      "Evrenin yaratılışı ile yaratmanın sürekliliği arasında nasıl bir ilişki vardır?",
      "Tatilde hangi şehre gidileceği ve hangi otelde kalınacağı",
      "Sınavın kaç dakika süreceği ve kaç soru sorulacağı",
      "Ders kitabının kaç sayfa olduğu ve kaç ünite içerdiği"
    ],
    dogru: 0,
    cozum: "Yaratma ve süreklilik kavramlarını karşılaştıran ilk soru doğrudan Allah-âlem ilişkisini sorgular; diğerleri günlük ya da biçimsel sorulardır.",
    fc: ["Allah-âlem ilişkisini konu alan soruların ortak özelliği nedir?", "Yaratma, rızık ve kulluk gibi kavramları ayetlerle ilişkilendirmeleridir."]
  },
  {
    si: 1,
    metin: "“Allah evreni yarattıktan sonra onu kendi hâline mi bırakmıştır?” sorusu Allah-âlem ilişkisinin hangi boyutunu sorgular?",
    secenekler: ["Yaratmanın sürekliliğini", "İnsanın özgürlüğünü", "Meleklerin sayısını", "Cennetin katlarını"],
    dogru: 0,
    cozum: "Soru, yaratmanın ilk anda kalıp kalmadığını; yani Allah’ın yaratmayı sürdürüp sürdürmediğini sorgular.",
    fc: ["Yaratmanın sürekliliğinin tanımı nedir?", "Allah’ın yaratmayı başlatıp ardından sürdürmesi, evrenin O’nun iradesiyle ayakta kalmasıdır."]
  },
  {
    si: 1,
    metin: "“Âlemin varlığı kendiliğinden mi, bir yaratıcıya mı bağlıdır?” sorusuna Kur’an’dan verilen yanıt hangisidir?",
    secenekler: [
      "Âlemi oluşturan her varlığın varlığı Allah’a bağlıdır",
      "Âlem kendi kendine yeten, dışarıdan bir desteğe ihtiyaç duymayan bütündür",
      "Âlemi yalnızca insanın bilgi ve emeği meydana getirmiştir",
      "Âlem birbirini izleyen tesadüflerin rastlantısal sonucudur"
    ],
    dogru: 0,
    cozum: "Kur’an, âlemi oluşturan bütün varlıkların varlığının Allah’a bağlı olduğunu, O’nun yoktan var eden ve yaratması devam eden güç olduğunu bildirir.",
    fc: ["Âlem kavramının tanımı nedir?", "Allah dışındaki bütün varlıkları, yani yaratılmışların tümünü ifade eder."]
  },
  {
    si: 1,
    metin: "Bir öğrenci, Allah-âlem ilişkisini araştırırken “Allah’ın evrendeki yasaları değişir mi?” sorusunu sormuştur. Bu soru hangi ayetle yanıtlanır?",
    secenekler: [
      "“Allah’ın yasalarında asla bir değişme bulamazsın…” (Fatır 43)",
      "“Ben cinleri ve insanları ancak bana kulluk etsinler diye yarattım.” (Zariyat 56)",
      "“Yeryüzünde yaşayan bütün canlıların rızkı ancak Allah’a aittir.” (Hud 6)",
      "“Göklerin ve yerin mülkiyeti yalnız Allah’ındır.” (Bakara 107)"
    ],
    dogru: 0,
    cozum: "Evrendeki yasaların değişmezliği doğrudan Fatır suresinin 43. ayetinde bildirilir; diğer ayetler kulluk, rızık ve mülkiyet konularındadır.",
    fc: ["Allah’ın evrendeki yasalarının özelliği nedir?", "Değişmez ve sapmaz niteliktedir; evrendeki düzen bu yasalarla sürer."]
  },
  {
    si: 2,
    metin: "Akıl ve duyularla algılanamayan varlıkların oluşturduğu bölüme ne ad verilir?",
    secenekler: ["Gayb âlemi", "Şehadet âlemi", "Mülk âlemi", "Melekût âlemi"],
    dogru: 0,
    cozum: "Duyularla algılanabilen varlıklar şehadet âlemini, akıl ve duyularla algılanamayan varlıklar ise gayb âlemini oluşturur.",
    fc: ["Şehadet âleminin tanımı nedir?", "İnsanın duyularıyla algılayabildiği varlıklardan oluşan bölümdür."]
  },
  {
    si: 2,
    metin: "İslam inancına göre insanın yeryüzündeki konumu hangi sorumlulukla açıklanır?",
    secenekler: [
      "Yeryüzünü imar etme ve emanetleri koruma",
      "Evrendeki bütün varlıklara hükmetme",
      "Meleklerin yerini alma",
      "Kâinatın yasalarını değiştirme"
    ],
    dogru: 0,
    cozum: "İnsan, halife olarak yeryüzünü imar etmek, adaleti sağlamak ve Allah’ın emanetlerini korumakla görevlidir.",
    fc: ["İnsanın halifelik sorumluluğu nedir?", "Yeryüzünü imar etmek, adaleti sağlamak ve Allah’ın emanetlerini korumaktır."]
  },
  {
    si: 3,
    metin: "“Âlemlerin Rabbi” tabiri Allah-âlem ilişkisi hakkında hangi çıkarımı destekler?",
    secenekler: [
      "Bütün âlemlerin Allah’ın yönetim ve terbiyesinde olduğunu",
      "Âlemlerin kendi başına buyruk, bağımsız varlıklar olduğunu",
      "Evrenin yaratılmadan önce de var olduğunu ve sürdüğünü",
      "İnsanın âlemden bağımsız, ayrı bir varlık olduğunu"
    ],
    dogru: 0,
    cozum: "Rab; yaratan, besleyen, terbiye eden ve yöneten demektir. Tabir, bütün âlemlerin Allah’ın yönetiminde olduğunu gösterir.",
    fc: ["Rab kavramının anlamı nedir?", "Yaratan, besleyen, terbiye eden ve yönetendir; âlemlerin Rabbi Allah’tır."]
  },
  {
    si: 3,
    metin: "Allah-âlem ilişkisine dair ayetlerden hareketle aşağıdaki çıkarımlardan hangisi yapılabilir?",
    secenekler: [
      "Âlemdeki her şey Allah’a muhtaçtır; O hiçbir şeye muhtaç değildir",
      "Âlem Allah’a muhtaçtır; Allah da âlemin varlığına bağlıdır",
      "İnsan âlemdeki hiçbir varlığa muhtaç değildir",
      "Evrendeki düzen kendiliğinden oluşmuştur"
    ],
    dogru: 0,
    cozum: "Ayetler, âlemdeki her şeyin Allah’a muhtaç olduğunu; hiçbir şeye ihtiyacı olmayanın ise yalnız Allah olduğunu bildirir.",
    fc: ["Varlıkların Allah’a bağımlılığı nasıl tanımlanır?", "Evrendeki her varlığın varlığını sürdürmek için Allah’a bağımlı olmasıdır."]
  }
]);

/* ---------------------------------------------------------------- 1.3 */
yaz("din_10_t01_c03", KAYNAK + ", s.31-33", [
  {
    si: 0,
    metin: "“Hakkında kesin bilgi sahibi olmadığın şeyin peşine düşme. Çünkü kulak, göz ve kalp, bunların hepsi ondan sorumludur.” buyruğu hangi surenin 36. ayetidir?",
    secenekler: ["İsra", "Mülk", "Nahl", "Hucurat"],
    dogru: 0,
    cozum: "Söz konusu ayet İsra suresinin 36. ayetidir; Mülk 23’te ise kulak, göz ve kalbin verilişi ve şükür konu edilir.",
    fc: ["İsra suresi 36. ayetin konusu nedir?", "Bilgi edinme araçlarının doğru kullanımı ve bunlardan sorumlu olunmasıdır."]
  },
  {
    si: 0,
    metin: "“De ki: O, sizi yaratan ve size kulaklar, gözler ve kalpler verendir. Ne kadar da az şükrediyorsunuz!” ayetinin bulunduğu sure ve ayet numarası hangisidir?",
    secenekler: ["Mülk 23", "İsra 36", "Bakara 208", "Rum 41"],
    dogru: 0,
    cozum: "Ayet Mülk suresinin 23. ayetidir; İsra 36 bilgi sorumluluğunu, Bakara 208 ve Rum 41 ise ilerleyen ünitelerdeki konuları bildirir.",
    fc: ["Mülk suresi 23. ayetin konusu nedir?", "İnsana verilen kulak, göz ve kalp nimetleri ile şükür sorumluluğudur."]
  },
  {
    si: 1,
    metin: "Her iki ayette de bilgi edinme vasıtası olarak zikredilen üç organ hangisidir?",
    secenekler: ["Kulak, göz ve kalp", "El, ayak ve dil", "Akıl, hafıza ve hayal", "Göz, burun ve dil"],
    dogru: 0,
    cozum: "İsra 36 ve Mülk 23’te bilgi edinme vasıtaları olarak kulak, göz ve kalp birlikte zikredilir.",
    fc: ["Bilgi edinme vasıtalarının işlevi nedir?", "İnsanın çevresini algılamasını, düşünmesini ve yeni bilgiler edinmesini sağlar."]
  },
  {
    si: 1,
    metin: "İsra suresinde kulak, göz ve kalbin “ondan sorumlu” sayılması neyi ifade eder?",
    secenekler: [
      "Bu vasıtalarla elde edilen bilgilerden insanın sorumlu olduğunu",
      "Organların kendi başına karar verip insanı yönlendirdiğini",
      "Bilgi edinmenin hiçbir sorumluluk doğurmadığını ve serbest olduğunu",
      "Kalbin bilgi edinmede işlevsiz, yalnızca duygu organı olduğunu"
    ],
    dogru: 0,
    cozum: "Ayet, insanın duyularıyla ve aklıyla elde ettiği bilgilerden hesap vereceğini; bu vasıtaları yerinde kullanması gerektiğini bildirir.",
    fc: ["İsra suresine göre bilgi kaynaklarının sorumluluğu nedir?", "Kulak, göz ve kalple elde edilenlerden insanın hesap vermekle yükümlü olmasıdır."]
  },
  {
    si: 2,
    metin: "İsra 36. ayet ile Mülk 23. ayet içeriklerine göre nasıl sınıflandırılır?",
    secenekler: [
      "İlki bilginin sorumluluğunu, ikincisi verilen nimetleri konu edinir",
      "İkisi de yalnızca namaz ve oruç gibi ibadetleri konu edinir",
      "İlki ahiret hayatını, ikincisi ticaret ahlakını konu edinir",
      "İkisi de aynı tarihî olayı farklı sözlerle anlatır"
    ],
    dogru: 0,
    cozum: "İsra 36 bilgi edinme araçlarının sorumluluğunu; Mülk 23 ise insana verilen kulak, göz ve kalp nimetlerini ve şükrü konu edinir.",
    fc: ["İki ayetin ortak konusu nedir?", "İnsana verilen kulak, göz ve kalp gibi bilgi edinme vasıtalarıdır."]
  },
  {
    si: 2,
    metin: "Aşağıdaki yargılardan hangisi Mülk 23. ayetin içeriğine girer?",
    secenekler: [
      "İnsanın kulak, göz ve kalple yaratılması",
      "İftiranın yasaklanması",
      "Adaletin emredilmesi",
      "Yetim hakkının korunması"
    ],
    dogru: 0,
    cozum: "Mülk 23, insanı yaratanın Allah olduğunu ve ona kulak, göz ve kalp verdiğini bildirir; diğer yargılar farklı ayetlerin konusudur.",
    fc: ["Mülk 23. ayetteki şükrün tanımı nedir?", "İnsana kulak, göz ve kalp gibi nimetleri veren yaratıcısına yönelmesidir."]
  },
  {
    si: 3,
    metin: "İsra 36. ayetinden hareketle aşağıdaki çıkarımlardan hangisine ulaşılır?",
    secenekler: [
      "Doğruluğu kanıtlanmamış bilgiyle hüküm vermek sorumluluk doğurur",
      "Duyulan her haber olduğu gibi doğru kabul edilmelidir",
      "Bilgi edinmek sorumluluktan bütünüyle bağımsız bir uğraştır",
      "Kulak ve göz bilgi kaynağı olarak görülmemelidir"
    ],
    dogru: 0,
    cozum: "Ayet, kesin bilgi sahibi olunmayan konuda hüküm vermeyi yasaklar; çünkü insan bu vasıtalarla elde ettiklerinden sorumludur.",
    fc: ["Yalancı şahitliğin yasaklanma gerekçesi nedir?", "Bilgi sahibi olunmayan konuda hüküm vermek başkalarının hayatını olumsuz etkilediği için."]
  },
  {
    si: 3,
    metin: "Mülk 23. ayetinden hareketle insanın bilgi edinme sürecine ilişkin hangi sonuca varılır?",
    secenekler: [
      "Bilgi edinme imkânları insana verilmiş birer nimettir",
      "Bilgi insanın kendi çabasıyla değil, tesadüfle oluşur",
      "İnsan bilgiye ihtiyaç duymayan bir varlıktır",
      "Duyular bilgi edinmede gereksiz araçlardır"
    ],
    dogru: 0,
    cozum: "Ayet, kulak, göz ve kalbi Allah’ın verdiği nimetler olarak sunar; insan bu imkânlarla bilgi edinir ve şükretmekle yükümlüdür.",
    fc: ["Mülk 23. ayetine göre bilgi edinmenin kaynağı nedir?", "Allah’ın insana verdiği kulak, göz ve kalp gibi vasıtalardır."]
  },
  {
    si: 4,
    metin: "İsra 36. ayetin mesajını kendi cümleleriyle ifade eden bir öğrencinin aşağıdaki cümlelerinden hangisi ayete uygundur?",
    secenekler: [
      "“Bilmediğim bir konuda konuşmadan önce öğrenmeli, duyduğumu sorgulamalıyım.”",
      "“Duyduğum her haberi hiç sorgulamadan olduğu gibi aktarmalıyım.”",
      "“Kulak ve göz yeterli olmadığı için bilgi edinmeye çalışmamalıyım.”",
      "“Kesin bilgiye ulaşmak imkânsız olduğu için fikir belirtmemeliyim.”"
    ],
    dogru: 0,
    cozum: "Ayet, kesin bilgi olmadan hüküm vermemeyi ve bilgi kaynaklarını sorumlulukla kullanmayı ister; bunu en iyi yansıtan cümle ilkidir.",
    fc: ["Ayetin mesajını günlük hayata taşımanın yolu nedir?", "Duyulan bilgiyi sorgulamak ve doğruluğu öğrenilmeden hüküm vermemektir."]
  },
  {
    si: 4,
    metin: "Mülk 23. ayetin mesajını kendi cümleleriyle ifade eden aşağıdaki cümlelerden hangisi ayetin anlamına uygundur?",
    secenekler: [
      "“Sahip olduğum imkânlar bana verilmiş nimetlerdir; bunları yerinde kullanmalıyım.”",
      "“Başarılarımı yalnızca kendi çabama borçluyum, kimseye teşekkür etmem.”",
      "“Nimetlerden yararlanırken hiçbir sorumluluk taşımam.”",
      "“Evrenin işleyişi beni ilgilendirmez, üzerinde düşünmem.”"
    ],
    dogru: 0,
    cozum: "Ayet, verilen nimetleri hatırlatıp şükre çağırır. Nimetleri fark edip yerinde kullanmayı anlatan ilk cümle bu mesajı yansıtır.",
    fc: ["Şükrün tanımı nedir?", "Allah’ın verdiği nimetleri fark edip O’na yönelmek ve nimetleri yerinde kullanmaktır."]
  }
]);
