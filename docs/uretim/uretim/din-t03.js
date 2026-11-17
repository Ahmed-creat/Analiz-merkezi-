#!/usr/bin/env node
/* Din Kültürü ve Ahlak Bilgisi 10 · Tema 3 (İslam’ın Evrensel Mesajları) havuzları.
   Kaynak: MEB Din Kültürü ve Ahlak Bilgisi 10 ders kitabı (2025). */
"use strict";

const { yaz, konuBasligiYaz } = require("../yazicilar/yaz.js");

const KAYNAK = "MEB Din Kültürü ve Ahlak Bilgisi 10 ders kitabı (2025)";

/* ---------------------------------------------------------------- 3.1 */
yaz("din_10_t03_c01", KAYNAK + ", s.82-85", [
  {
    si: 0,
    metin: "Tevhit ilkesi hakkında bilgi toplarken başvurulacak kaynakların başında hangisi gelir?",
    secenekler: [
      "Kur’an-ı Kerim ve hadisler",
      "Yalnızca sosyal medya gönderileri",
      "Yalnızca konuyla ilgisiz edebî romanlar",
      "Yalnızca kişisel izlenimler"
    ],
    dogru: 0,
    cozum: "Tevhit ilkesine ilişkin bilgiler öncelikle İslam’ın temel kaynakları olan Kur’an-ı Kerim ve sünnetten elde edilir.",
    fc: ["Tevhit kavramının sözlük anlamı nedir?", "Birlemek, bir kılmak, bir şeyin bir ve tek olduğuna hükmetmek demektir."]
  },
  {
    si: 0,
    metin: "Tevhit ilkesiyle ilgili bilgiler doğrulanırken hangi ölçüt esas alınır?",
    secenekler: ["Ayet ve hadislerle uygunluk", "Bilginin çok kısa olması", "Kaynağın yeni basılmış olması", "Anlatımın süslü olması"],
    dogru: 0,
    cozum: "Tevhit konusundaki bilgiler, ayet ve hadislerin ortaya koyduğu çerçeveye uygunluğu bakımından sınanır.",
    fc: ["Doğrulama kavramının anlamı nedir?", "Bir bilginin güvenilir kaynaklarla uygunluğunun sınanmasıdır."]
  },
  {
    si: 0,
    metin: "Tevhit ilkesi araştırılırken “Allah’ın bir olması” hangi başlıklar altında incelenir?",
    secenekler: [
      "Zatında, sıfatlarında, isimlerinde ve fiillerinde",
      "Yalnızca isimlerinde ve bu isimlerin sayısında",
      "Yalnızca fiillerinde ve yaratma biçiminde",
      "Yalnızca insanlarla ilişkisinde ve ahlakta"
    ],
    dogru: 0,
    cozum: "Allah’ın bir olması; zatında, sıfatlarında, isimlerinde, fiillerinde eşi ve benzerinin bulunmaması anlamına gelir.",
    fc: ["Tevhidin zıddı olan kavram nedir?", "Şirktir; Allah’a başka bir varlığı denk görmek anlamına gelir."]
  },
  {
    si: 1,
    metin: "“Eğer yerde ve gökte Allah’tan başka ilahlar olsaydı, kesinlikle ikisinin de düzeni bozulurdu…” ayeti hangi surededir?",
    secenekler: ["Enbiya", "İhlas", "Nahl", "Haşr"],
    dogru: 0,
    cozum: "Ayet Enbiya suresinin 22. ayetidir ve tevhidin gerekliliğini evrendeki düzen üzerinden açıklar.",
    fc: ["Enbiya suresi 22. ayetin konusu nedir?", "Allah’tan başka ilah bulunmadığını, aksi hâlde evren düzeninin bozulacağını bildirir."]
  },
  {
    si: 1,
    metin: "İhlas suresinde tevhit inancı nasıl ifade edilir?",
    secenekler: [
      "Allah’ın bir ve tek olduğu, hiçbir şeyin O’na denk olmadığı bildirilir",
      "Allah’ın yaratılmışlara benzediği söylenir",
      "Allah’ın yalnızca ahirette bilineceği anlatılır",
      "Allah’ın isimlerinin sayıldığı belirtilir"
    ],
    dogru: 0,
    cozum: "İhlas suresi Allah’ın bir tek olduğunu, hiçbir şeye muhtaç bulunmadığını, doğmadığını ve hiçbir şeyin O’na denk olmadığını bildirir.",
    fc: ["Samed isminin anlamı nedir?", "Her şey O’na muhtaçtır, O hiçbir şeye muhtaç değildir."]
  },
  {
    si: 1,
    metin: "Hadiste imanın en üstün şubesi olarak hangi söz gösterilir?",
    secenekler: [
      "“La ilahe illallah” (Allah’tan başka ilah yoktur.)",
      "“Elhamdülillah” (Hamd Allah’a mahsustur.)",
      "“Bismillah” (Allah’ın adıyla başlarım.)",
      "“Sübhanallah” (Allah’ı tenzih ederim.)"
    ],
    dogru: 0,
    cozum: "Hadiste imanın yetmiş küsur şubesi olduğu, bunların en üstününün “La ilahe illallah” sözü olduğu bildirilir.",
    fc: ["İmanın yetmiş küsur şubesi ifadesinin anlamı nedir?", "İmanın dalları; inancın söz, kalp ve davranışa yansıyan dereceleridir."]
  },
  {
    si: 2,
    metin: "Bir öğrenci “Tevhit yalnızca Allah’ın varlığını kabul etmektir.” demiştir. Bu ifadenin eksik kalan yönü hangisidir?",
    secenekler: [
      "Allah’ın birliğini ve ortağı olmadığını da kapsaması gerekmesi",
      "Tevhidin yalnızca ahiret hayatıyla ilgili bir inanç olması",
      "Tevhidin bilgiyle hiçbir ilgisinin bulunmaması ve akılla sınanmaması",
      "Tevhidin yalnızca peygamberlere ait bir görev olması"
    ],
    dogru: 0,
    cozum: "Tevhit, Allah’ın varlığını kabul etmenin yanında O’nun bir olduğunu, eşi ve ortağı bulunmadığını bilmeyi de kapsar.",
    fc: ["Tevhit ilkesinin tanımı nedir?", "Allah’ın bir olduğunu bilmek, O’ndan başka ilah bulunmadığına, eşi ve ortağı olmadığına inanmaktır."]
  },
  {
    si: 2,
    metin: "“Son sözü ‘La ilahe illallah’ olan kimse cennete girer.” hadisi tevhidin hangi yönünü gösterir?",
    secenekler: [
      "İnancın hayatın sonuna kadar korunması gerektiğini",
      "Tevhidin yalnızca sözle sınırlı olduğunu",
      "İmanın amelsiz yeterli olduğunu",
      "Tevhidin yalnızca âlimlere ait olduğunu"
    ],
    dogru: 0,
    cozum: "Hadis, tevhit inancının hayatın son anına kadar korunmasının ve dile getirilmesinin önemine işaret eder.",
    fc: ["Tevhidin insan hayatındaki yeri nedir?", "Yalnızca bir inanç değil, hayatın tamamına yön veren bir yaşam biçimidir."]
  },
  {
    si: 3,
    metin: "Tevhit ilkesi hakkında toplanan bilgiler kaydedilirken hangi yöntem uygundur?",
    secenekler: [
      "Bilgileri kaynağıyla birlikte not etmek",
      "Bilgileri kaynaksız ve düzensiz yazmak",
      "Yalnızca başlıkları yazıp ayrıntı bırakmamak",
      "Bilgileri ezberleyip hiç yazmamak"
    ],
    dogru: 0,
    cozum: "Bilgilerin kaynağıyla birlikte kaydedilmesi, sonradan doğrulama yapılmasını ve bilgi karışıklığının önlenmesini sağlar.",
    fc: ["Bilgi kaydında kaynak belirtmenin yararı nedir?", "Bilginin doğrulanmasını kolaylaştırır ve karışıklığı önler."]
  },
  {
    si: 3,
    metin: "Tevhit ilkesiyle ilgili bir sunum hazırlayan öğrenci hangi sıralamayı izlemelidir?",
    secenekler: [
      "Kaynakları belirleme, bilgi toplama, ayetlerle doğrulama, kaydetme",
      "Kaydetme, doğrulama, bilgi toplama, kaynak belirleme",
      "Doğrulama, kaynak belirleme, kaydetme, bilgi toplama",
      "Bilgi toplama, kaydetme, kaynak belirleme, doğrulama"
    ],
    dogru: 0,
    cozum: "Bilgi toplama süreci kaynağın belirlenmesiyle başlar; toplanan bilgi ayet ve hadislerle doğrulanır, ardından kaydedilir.",
    fc: ["Bilgi toplama sürecinin aşamaları nedir?", "Kaynak belirleme, bilgi toplama, doğrulama ve kayıt altına alma aşamalarıdır."]
  }
]);

/* ---------------------------------------------------------------- 3.2 */
yaz("din_10_t03_c02", KAYNAK + ", s.86-95", [
  {
    si: 0,
    metin: "Adaletin İslam’ın evrensel mesajlarından biri sayılmasının nedeni hangisidir?",
    secenekler: [
      "Toplumda hak ve hukuku gözeterek huzuru sağlaması",
      "Yalnızca mahkemelerde uygulanması",
      "Sadece ekonomik hayatı düzenlemesi",
      "Yalnızca Müslümanlara ait olması"
    ],
    dogru: 0,
    cozum: "Adalet hukuk, ekonomi ve toplumsal hayatın her alanında hakkı gözetir; bu yönüyle bütün insanlığı ilgilendiren evrensel bir ilkedir.",
    fc: ["Adalet kavramının tanımı nedir?", "Hak sahibine hakkını vermek, her şeyi layık olduğu yere koymak, aşırılıktan uzak ve dengeli olmaktır."]
  },
  {
    si: 0,
    metin: "Hz. Peygamber’in peygamberlik öncesinde Hilfülfudul’a katılması neyi gösterir?",
    secenekler: [
      "Adaleti sağlama çabasının peygamberlikten önce de sürdüğünü",
      "Ticaretle hiç uğraşmadığını ve ticaretten uzak durduğunu",
      "Mekke’den ayrılarak başka bir şehre yerleştiğini",
      "Kabilesinin yönetimini tek başına ele aldığını"
    ],
    dogru: 0,
    cozum: "Hilfülfudul haksızlıklarla mücadele için kurulmuş bir topluluktur; Hz. Peygamber’in buraya katılması adalete verdiği önemi gösterir.",
    fc: ["Hilfülfudulun tanımı nedir?", "Mekke’de haksızlıklarla mücadele etmek üzere kurulan, Hz. Peygamber’in de katıldığı topluluktur."]
  },
  {
    si: 0,
    metin: "Kur’an’a göre insanın Allah katında değerli olmasının ölçütü hangisidir?",
    secenekler: [
      "Allah’a karşı gelmekten en çok sakınmak",
      "Soyunun soylu ve tanınmış bir aileden olması",
      "Servetinin çok olması ve zenginliğini göstermesi",
      "Makamının yüksek olması ve yetki taşıması"
    ],
    dogru: 0,
    cozum: "İnsanlar aynı atadan gelir; üstünlük soy, servet veya makamla değil, takva ile yani Allah’a karşı gelmekten sakınmakla ölçülür.",
    fc: ["Takva kavramının tanımı nedir?", "Allah’ın hoşnutluğunu kazanmak için emirlere uyup haramlardan sakınmaktır."]
  },
  {
    si: 1,
    metin: "Adalet ile eşitlik arasındaki ilişki nasıl açıklanır?",
    secenekler: [
      "Eşitlik herkese aynı hakkı tanırken adalet herkese hakkını verir",
      "Adalet eşitlikten bütünüyle bağımsız bir kavramdır",
      "Eşitlik yalnızca ekonomik alanda geçerli bir ilkedir",
      "Adalet yalnızca cezaların belirlenmesiyle ilgilidir"
    ],
    dogru: 0,
    cozum: "Eşitlik bütün bireylerin aynı haklara sahip olmasını; adalet ise herkese hak ettiğini vermeyi, dengeyi gözetmeyi ifade eder.",
    fc: ["Eşitlik ilkesinin tanımı nedir?", "İnsanların eşit doğduğu gerçeğinden hareketle tüm bireylerin aynı haklara sahip olması ve aynı düzeyde saygıyı hak etmesidir."]
  },
  {
    si: 1,
    metin: "Adaletin “hesap verebilirlik” ilkesi hangi davranışla ilişkilidir?",
    secenekler: [
      "Alınan kararların sonuçlarından sorumlu olmak",
      "Hiçbir karar almamak",
      "Kararları gizli tutmak",
      "Sorumluluğu başkasına devretmek"
    ],
    dogru: 0,
    cozum: "Hesap verebilirlik, kişinin kararlarından ve bu kararların sonuçlarından sorumlu olmasını gerektirir.",
    fc: ["Hesap verebilirlik ilkesinin tanımı nedir?", "Kişinin aldığı kararlardan ve bu kararların sonuçlarından sorumlu olmasıdır."]
  },
  {
    si: 1,
    metin: "Şeffaflık ilkesinin bulunmadığı bir toplumda ortaya çıkması beklenen sonuç hangisidir?",
    secenekler: [
      "Yolsuzluk ve adalet algısının zayıflaması",
      "Adaletin daha hızlı sağlanması",
      "Toplumsal güvenin pekişmesi",
      "Denetimin kolaylaşması"
    ],
    dogru: 0,
    cozum: "Şeffaflığın olmadığı yerde yolsuzluk, toplumsal sarsıntı ve ahlaki çöküntü kaçınılmaz olur; adalet algısı da zayıflar.",
    fc: ["Açıklık ve denetlenebilirlikle ilgili adalet ilkesinin adı nedir?", "Şeffaflık ilkesidir."]
  },
  {
    si: 2,
    metin: "Tarafsızlık ile hakkaniyet arasındaki fark hangisidir?",
    secenekler: [
      "Tarafsızlık ayrım yapmamayı, hakkaniyet olayın özel koşullarını gözetmeyi gerektirir",
      "İkisi de aynı ilkeyi ifade eden eş anlamlı kavramlardır",
      "Tarafsızlık yalnızca hâkimlerin uyması gereken bir kuraldır",
      "Hakkaniyet yalnızca ödüllerin dağıtımında uygulanan bir ölçüdür"
    ],
    dogru: 0,
    cozum: "Tarafsızlık dil, din, cinsiyet gibi nedenlerle ayrım yapmamayı; hakkaniyet ise her olayın kendine özgü koşullarını gözeterek karar vermeyi gerektirir.",
    fc: ["Hakkaniyetin tanımı nedir?", "Görev, sorumluluk veya ödül paylaşımında bireysel farklılıkları gözeterek hakkı olana razı olmaktır."]
  },
  {
    si: 2,
    metin: "Adaletin ilkelerinden “liyakat” ile “emanet” arasındaki ilişki nasıl açıklanır?",
    secenekler: [
      "İşi ehline vermek hem liyakati hem emaneti korumak demektir",
      "Liyakat yalnızca eğitimle ilgili bir kavramdır",
      "Emanet yalnızca eşya için geçerli bir kuraldır",
      "İki ilke birbirini bütünüyle dışlar"
    ],
    dogru: 0,
    cozum: "Görevi yapabilecek yetkinlikte olana vermek liyakati; emaneti ehline teslim etmek ise emanet ilkesini korumak anlamına gelir.",
    fc: ["Liyakat ilkesinin tanımı nedir?", "Yeterlilik ilkesidir; görevin başarıyla yapılabilmesi için gereken yetkinliğe sahip olmayı ifade eder."]
  },
  {
    si: 3,
    metin: "Bir müdürün işe alımlarda kişisel yakınlık yerine sınav sonucunu esas alması hangi adalet ilkesine uygundur?",
    secenekler: ["Liyakat", "Ahde vefa", "Emanet", "Hakkaniyet"],
    dogru: 0,
    cozum: "Göreve en yetkin kişinin seçilmesi liyakat ilkesinin gereğidir; yakınlık ölçütü ise ayrıcalık doğurur.",
    fc: ["Ahde vefanın tanımı nedir?", "Allah’a ve insanlara verilen sözün yerine getirilmesi, anlaşmalara sadık kalınmasıdır."]
  },
  {
    si: 3,
    metin: "Bir öğrencinin kopya çekmeden sınava girmesi ahlaki açıdan hangi ilkeyle açıklanır?",
    secenekler: ["Dürüstlük", "Şeffaflık", "Liyakat", "Tarafsızlık"],
    dogru: 0,
    cozum: "Kopya çekmemek, kişinin gerçeği söylemesi ve doğru davranması anlamına gelen dürüstlük ilkesine uygun bir davranıştır.",
    fc: ["Dürüstlüğün tanımı nedir?", "Kişinin gerçeği söylemesi, doğru davranması ve ahlaki değerlere uygun hareket etmesidir."]
  }
]);

/* ---------------------------------------------------------------- 3.3 */
yaz("din_10_t03_c03", KAYNAK + ", s.96-101", [
  {
    si: 0,
    metin: "İslam kelimesinin kökü hangi anlamları taşır?",
    secenekler: [
      "Kurtuluşa erme, güven ve emniyette olma, barış yapma",
      "Savaşma, mücadele etme ve direnme",
      "Yalnızca ibadetleri yerine getirme ve namaz kılma",
      "Yalnızca bilgi edinme ve öğrenme"
    ],
    dogru: 0,
    cozum: "İslam, “kurtuluşa erme, güven ve emniyette olma, sulh ve barış yapma” anlamlarına gelen s-l-m kökünden gelir.",
    fc: ["Selam isminin anlamı nedir?", "Barış ve esenlik sahibi olan, kurtuluşa erdirendir."]
  },
  {
    si: 0,
    metin: "İslam’a göre barış ortamının korunması hangi değerlerin güvenliğine bağlıdır?",
    secenekler: ["Can, akıl, din, mal ve nesil", "Yalnızca mal ve mülk güvenliği", "Yalnızca can ve beden güvenliği", "Yalnızca din ve ibadet özgürlüğü"],
    dogru: 0,
    cozum: "İslam’da can, akıl, din, mal ve nesil kutsal kabul edilir; bu değerlerin korunması huzur, güven ve barış ortamına bağlıdır.",
    fc: ["İslam’a göre kutsal sayılan değerlerin listesi nedir?", "Can, akıl, din, mal ve nesildir; bunların korunması barış ortamına bağlıdır."]
  },
  {
    si: 0,
    metin: "Hz. Peygamber’in “Düşmanla karşılaşmayı temenni etmeyiniz.” hadisi hangi ilkeyi gösterir?",
    secenekler: [
      "Savaşın son çare olarak görülmesini",
      "Savaşın sürekli olmasını",
      "Barışın imkânsız sayılmasını",
      "Savunmanın yasaklanmasını"
    ],
    dogru: 0,
    cozum: "Hadis, savaşın istenen değil zorunlu hâllerde başvurulan son çare olduğunu gösterir.",
    fc: ["Cihat kavramının tanımı nedir?", "Allah yolunda veya O’nun korunmasını emrettiği kutsal değerler uğrunda yapılan mücadeledir."]
  },
  {
    si: 0,
    metin: "Kur’an’da savaşın karşılığı olarak kullanılan kavram hangisidir?",
    secenekler: ["Kıtal-mukatele", "Silm-sulh", "Cihat-şehadet", "İhsan-ihlas"],
    dogru: 0,
    cozum: "Savaş, Kur’an-ı Kerim’de kıtal-mukatele kavramıyla ifade edilir; silm ve sulh ise barış anlamlarına gelir.",
    fc: ["Silm kavramının tanımı nedir?", "Uzlaşma, teslimiyet, itaat ve barış anlamlarına gelir."]
  },
  {
    si: 1,
    metin: "Sınıfta arkadaşıyla küskünlüğünü gidermek isteyen bir öğrencinin öne çıkardığı değer hangisidir?",
    secenekler: ["Barış ve uzlaşma", "Rekabet", "Tarafsızlık", "Liyakat"],
    dogru: 0,
    cozum: "Küskünlüğü gidermek, anlaşma ve uzlaşma yoluyla barışı yeniden kurmak anlamına gelir.",
    fc: ["Sulh kavramının tanımı nedir?", "Anlaşma, uzlaşma ve barış yapma demektir."]
  },
  {
    si: 1,
    metin: "“İslam barış dinidir.” ifadesini kendi yaşantısı için anlamlı kılan biri hangi davranışı gösterir?",
    secenekler: [
      "Komşusuyla ilişkilerinde anlayış ve uzlaşma arar",
      "Tartışmaları şiddetle çözer",
      "Farklı görüşlere tahammül etmez",
      "İnsanlara önyargıyla yaklaşır"
    ],
    dogru: 0,
    cozum: "Barış ilkesini içselleştiren kişi, günlük ilişkilerinde anlayış, uzlaşma ve güveni esas alır.",
    fc: ["Müslümanın barışı koruma sorumluluğu nedir?", "Yeryüzünde huzur ve güveni sağlamak, temel değerleri korumaya çalışmaktır."]
  },
  {
    si: 1,
    metin: "Barışın bozulduğu bir toplumda ortaya çıkması beklenen durum hangisidir?",
    secenekler: [
      "Bilim, sanat ve medeniyetin gerilemesi",
      "Adaletin güçlenmesi",
      "İnsan haklarının gelişmesi",
      "Ekonomik bolluğun artması"
    ],
    dogru: 0,
    cozum: "Barış ve adaletin hâkim olduğu dönemlerde bilim, felsefe ve sanat gelişir; barışın bozulduğu ortamda ise medeniyet ve ahlaki değerler zarar görür.",
    fc: ["Barış ortamının topluma etkisi nedir?", "Huzurlu hayat ortamı oluşur; yeryüzü imar edilir, bilim, felsefe ve sanat gelişir."]
  },
  {
    si: 2,
    metin: "İslam ve barış ilişkisini nesnel biçimde ifade eden cümle hangisidir?",
    secenekler: [
      "“İslam, adını barış ve esenlik anlamına gelen kökten alır.”",
      "“İslam sürekli savaşı emreder.”",
      "“İslam barışla hiç ilgilenmez.”",
      "“İslam yalnızca savunmayı yasaklar.”"
    ],
    dogru: 0,
    cozum: "Nesnel ifade, doğrulanabilir bilgiye dayanır. İslam’ın adını barış anlamına gelen kökten alması metne dayalı bir olgudur.",
    fc: ["Nesnel ifadenin tanımı nedir?", "Kişisel duygu ve yargıları katmadan, doğrulanabilir bilgiye dayanan anlatımdır."]
  },
  {
    si: 2,
    metin: "İslam’da savaşa izin verilen durumlar hangisidir?",
    secenekler: [
      "Toprakların işgali ve can-mal güvenliğinin tehdidi",
      "Ticarette rekabetin artması",
      "Bir görüşün yaygınlaşmaması",
      "Komşular arasında küslük"
    ],
    dogru: 0,
    cozum: "Müslüman topraklarının işgali veya can ve mal güvenliğinin tehdit edilmesi gibi zorunlu hâller savaşı meşru kılar.",
    fc: ["Savaşı meşru kılan durumların tanımı nedir?", "Müslüman topraklarının işgali ile can ve mal güvenliğinin tehdit edilmesi gibi zorunlu hâllerdir."]
  },
  {
    si: 2,
    metin: "Barışın sağlanmasında adaletin işlevi nasıl açıklanır?",
    secenekler: [
      "Hakların korunması yoluyla güveni ve huzuru kalıcı kılar",
      "Yalnızca cezaları artırır",
      "Barışı geçici olarak erteler",
      "Yalnızca yönetimle ilgilidir"
    ],
    dogru: 0,
    cozum: "Adalet, herkesin hakkını gözeterek toplumda güven oluşturur; bu güven barışın kalıcı olmasını sağlar.",
    fc: ["Adaletin barışla ilişkisi nedir?", "Adalet, hakların korunmasını sağlayarak barış ve güven ortamını kalıcı kılar."]
  }
]);

/* ---------------------------------------------------------------- 3.4 */
yaz("din_10_t03_c04", KAYNAK + ", s.102-107", [
  {
    si: 0,
    metin: "“Şüphesiz Allah, adaleti, iyilik yapmayı, yakınlara yardım etmeyi emreder…” ayeti hangi sure ve ayettir?",
    secenekler: ["Nahl 90", "Nisa 58", "Bakara 208", "Enam 160"],
    dogru: 0,
    cozum: "Ayet Nahl suresinin 90. ayetidir; adaleti, iyiliği ve akrabaya yardımı emreder, çirkin işleri yasaklar.",
    fc: ["Nahl suresi 90. ayetin konusu nedir?", "Adaletin, iyiliğin ve yakınlara yardımın emredilmesi; çirkin işlerin ve haddi aşmanın yasaklanmasıdır."]
  },
  {
    si: 0,
    metin: "“Allah size, emanetleri mutlaka ehline vermenizi ve insanlar arasında hükmettiğiniz zaman adaletle hükmetmenizi emreder.” ayeti hangi surededir?",
    secenekler: ["Nisa", "Nahl", "Bakara", "Haşr"],
    dogru: 0,
    cozum: "Ayet Nisa suresinin 58. ayetidir; emanetlerin ehline verilmesini ve adaletle hükmedilmesini emreder.",
    fc: ["Nisa suresi 58. ayetin konusu nedir?", "Emanetlerin ehline verilmesi ve hüküm verirken adaletle davranılmasıdır."]
  },
  {
    si: 1,
    metin: "Nahl suresi 90. ayette geçen “fahşâ” kavramı neyi ifade eder?",
    secenekler: [
      "Hayâsızlık, çirkin söz ve işler",
      "Adalet, denge ve ölçülü olma",
      "Akrabaya yardım ve iyilik",
      "Ahde vefa ve sözünde durma"
    ],
    dogru: 0,
    cozum: "Fahşâ; hayâsızlık, çirkin sözler ve çirkin işler için kullanılır; edep, hayâ ve iffete aykırı her türlü söz ve davranışı kapsar.",
    fc: ["Bağy kavramının tanımı nedir?", "Genel ahlak kurallarını aşan, bütün varlıkların haklarını çiğneyen zorbalıktır."]
  },
  {
    si: 1,
    metin: "Bakara suresi 208. ayette geçen “silm” kavramı hangi anlamlara gelir?",
    secenekler: ["Uzlaşma, teslimiyet ve itaat", "Yalnızca savaş", "Yalnızca ticaret", "Yalnızca ceza"],
    dogru: 0,
    cozum: "Silm; uzlaşma, teslimiyet ve itaat anlamlarına gelir; Türkçeye genellikle barış olarak çevrilir.",
    fc: ["Münker kavramının tanımı nedir?", "Aklın ve sağduyunun çirkin bulduğu, toplumun yadırgadığı tutum ve davranışlardır."]
  },
  {
    si: 2,
    metin: "Üç ayet konularına göre nasıl sınıflandırılır?",
    secenekler: [
      "İlki ahlaki ilkeleri, ikincisi emanet-adaleti, üçüncüsü barışa girişi",
      "İkisi yalnızca ibadetleri, biri ticaret ahlakını konu edinir",
      "Üçü de yalnızca ahiret hayatının aşamalarını işler",
      "Üçü de aynı konuyu farklı sözlerle tekrar anlatır"
    ],
    dogru: 0,
    cozum: "Nahl 90 ahlaki ilkeleri, Nisa 58 emanet ve adaleti, Bakara 208 ise barışa ve teslimiyete girişi konu edinir.",
    fc: ["Üç ayetin ortak yönü nedir?", "Toplum düzenini koruyan ilkeleri, emanet, adalet ve barışı emretmeleridir."]
  },
  {
    si: 2,
    metin: "Aşağıdakilerden hangisi Nisa suresi 58. ayette emredilenler arasında yer alır?",
    secenekler: ["Emanetleri ehline vermek", "Yetim malına dokunmamak", "Oruç tutmak", "Hac yapmak"],
    dogru: 0,
    cozum: "Ayet iki şeyi emreder: emanetleri ehline vermek ve insanlar arasında adaletle hükmetmek.",
    fc: ["Emanet kavramının tanımı nedir?", "Korunması istenen maddi ve manevi değerdir; devletin makamları da emanettir."]
  },
  {
    si: 3,
    metin: "Hz. Peygamber’in Kâbe’nin anahtarını Osman bin Talha’da bırakması hangi ilkeye uygun davranıştır?",
    secenekler: ["Emaneti ehline verme", "Sadaka dağıtma", "Oruç tutma", "Ticaret yapma"],
    dogru: 0,
    cozum: "Görevi, o işi yapmaya ehil olan kişide bırakmak Nisa 58. ayetin emanetleri ehline verme emrine uygundur.",
    fc: ["Emanetleri ehline vermenin anlamı nedir?", "Bir görevi veya işi, onu en iyi yapacak yetkinlikte olan kişiye bırakmaktır."]
  },
  {
    si: 3,
    metin: "Bakara 208. ayette inananların uyarılmasının gerekçesi hangisidir?",
    secenekler: [
      "Dinin emirlerini tam yerine getirmeyip ikiyüzlülüğe düşmeleri",
      "Ticaretlerinin azalması ve kazançlarının düşmesi",
      "Yolculuğa çıkmamaları ve seyahatten uzak durmaları",
      "İlim öğrenmeyi bırakıp eğitimden uzaklaşmaları"
    ],
    dogru: 0,
    cozum: "Ayet, inananları İslam’a bütünüyle girmeye çağırır; emirleri eksik yerine getirip şeytanın adımlarını izlemelerini yasaklar.",
    fc: ["İkiyüzlülüğün tanımı nedir?", "İnandığını söyleyip davranışlarında bunun gereğini yerine getirmemektir."]
  },
  {
    si: 4,
    metin: "Nahl 90. ayetin mesajını kendi cümleleriyle ifade eden cümle hangisidir?",
    secenekler: [
      "“Adaletli ve iyiliksever olmalı, çirkin işlerden kaçınmalıyım.”",
      "“Yalnızca kendi çıkarımı düşünmeli, başkasını gözetmemeliyim.”",
      "“Haddi aşmakta ve ölçüyü kaçırmakta sakınca yoktur.”",
      "“Yakınlarıma yardım etmek gereksiz bir davranıştır.”"
    ],
    dogru: 0,
    cozum: "Ayet adaleti, iyiliği ve akrabaya yardımı emreder; çirkin işleri, kötülüğü ve haddi aşmayı yasaklar. İlk cümle bu mesajı yansıtır.",
    fc: ["Kendi cümlesiyle ifade etmenin ölçütü nedir?", "Ayetin içeriğine bağlı kalarak, anlaşılır ve özgün biçimde anlatmaktır."]
  },
  {
    si: 4,
    metin: "Bakara 208. ayetin mesajını günlük hayata taşıyan biri hangi davranışı gösterir?",
    secenekler: [
      "İnandığı değerleri tutarlı biçimde yaşar",
      "Sözüyle davranışı arasında fark gözetir",
      "Yalnızca bayramlarda ibadet eder",
      "İnsanlara karşı güveni sarsar"
    ],
    dogru: 0,
    cozum: "Ayet, inananların İslam’a bütünüyle girip emirleri eksiksiz yerine getirmesini ister; bu da söz ile davranış arasında tutarlılık gerektirir.",
    fc: ["Teslimiyetin tanımı nedir?", "Allah’ın emirlerine gönülden boyun eğip gereğince davranmaktır."]
  }
]);

/* Uygulama bu havuzu konu başlığıyla arar (bkz. yaz.js · konuBasligiYaz). */
konuBasligiYaz("din_10_t03_c04", "Din Kültürü > 3.4 Kur'an'dan Mesajlar (Nahl 90, Nisâ 58, Bakara 208)");
