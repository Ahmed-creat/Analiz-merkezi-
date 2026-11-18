#!/usr/bin/env node
/* Tarih 10 · Tema 1 (Türkistan’dan Türkiye’ye, 1040-1299) havuzları.
   Kaynak: MEB Tarih 10 ders kitabı (2025). JSON sayfa = basılı sayfa + 1. */
"use strict";

const { yaz } = require("../yazicilar/yaz.js");

const KAYNAK = "MEB Tarih 10 ders kitabı (2025)";

/* ---------------------------------------------------------------- 1.1 */
yaz("tar_10_t01_c01", KAYNAK + ", s.12-33", [
  {
    si: 0,
    metin: "1040 yılında Gaznelilere karşı kazanılan Dandanakan Savaşı’nın ardından Tuğrul Bey’in sultan ilân edilmesiyle hangi devlet kurulmuştur?",
    secenekler: [
      "Büyük Selçuklu Devleti",
      "Türkiye Selçuklu Devleti",
      "Karahanlı Devleti",
      "Harzemşahlar Devleti"
    ],
    dogru: 0,
    cozum: "Dandanakan zaferinden sonra Selçuklu beyleri Tuğrul Bey’i sultan ilan etmiş ve Horasan’da Büyük Selçuklu Devleti kurulmuştur.",
    fc: ["Dandanakan Savaşı’nın siyasi sonucu nedir?", "Selçukluların Horasan’da devlet kurmasını sağlamış, Tuğrul Bey sultan ilan edilmiştir."]
  },
  {
    si: 0,
    metin: "Tabloda 1040-1299 yılları arasındaki dört mücadelenin sonuçları özetlenmiştir. Tabloya göre Anadolu’nun kesin olarak Türk yurdu hâline geldiğini gösteren gelişme hangi savaşın sonucudur?",
    secenekler: ["Miryokefalon Savaşı", "Pasinler Savaşı", "Dandanakan Savaşı", "Kösedağ Savaşı"],
    dogru: 0,
    cozum: "Tablodaki sonuç sütununda Anadolu’nun Türk yurdu olduğunun kesinleşmesi Miryokefalon Savaşı’nın sonucu olarak verilmiştir.",
    gorsel: {
      tip: "tablo",
      basliklar: ["Savaş", "Yıl", "Sonuç"],
      satirlar: [
        ["Dandanakan", "1040", "Büyük Selçuklu Devleti kuruldu"],
        ["Pasinler", "1048", "Doğu Roma ile ilk büyük karşılaşma"],
        ["Miryokefalon", "1176", "Anadolu’nun Türk yurdu olduğu kesinleşti"],
        ["Kösedağ", "1243", "Anadolu’da Moğol egemenliği başladı"]
      ]
    },
    fc: ["Miryokefalon Savaşı’nın Anadolu açısından sonucu nedir?", "Anadolu’nun Türk yurdu olduğu kesinleşmiş, Bizans’ın yeniden fetih umudu sona ermiştir."]
  },
  {
    si: 0,
    metin: "1048’de Erzurum yakınlarında Selçuklular ile Doğu Roma arasında yapılan ve Selçukluların galibiyetiyle sonuçlanan mücadele hangisidir?",
    secenekler: ["Pasinler Savaşı", "Malazgirt Savaşı", "Miryokefalon Savaşı", "Yassıçemen Savaşı"],
    dogru: 0,
    cozum: "Pasinler Ovası’nda 18 Eylül 1048’de yapılan savaşta Selçuklu ordusu Doğu Roma, Ermeni, Gürcü ve Abaza kuvvetlerini yenmiştir.",
    fc: ["Pasinler Savaşı’nın tarafları nedir?", "Selçuklular ile Doğu Roma, Ermeni, Gürcü ve Abaza kuvvetleri karşı karşıya gelmiştir."]
  },
  {
    si: 0,
    metin: "1075 yılında İznik’i fethederek burayı merkez yapan Süleyman Şah, hangi devletin fiilen kurucusu kabul edilir?",
    secenekler: ["Türkiye Selçuklu Devleti", "Büyük Selçuklu Devleti", "Danişmentliler", "Saltuklular"],
    dogru: 0,
    cozum: "Süleyman Şah’ın 1075’te İznik’i merkez yapması Türkiye Selçuklu Devleti’nin fiilen kuruluşu kabul edilir.",
    fc: ["Türkiye Selçuklu Devleti’nin kuruluş tarihi nedir?", "Süleyman Şah’ın İznik’i merkez yaptığı 1075 yılı fiilî kuruluş kabul edilir."]
  },
  {
    si: 1,
    metin: "Malazgirt Savaşı’nda Selçuklu atlılarının savaşmadan geri çekiliyormuş gibi yapıp Bizans ordusunu çembere alması hangi savaş yöntemine örnektir?",
    secenekler: ["Turan taktiği", "Kuşatma savaşı", "Deniz ablukası", "Siper savaşı"],
    dogru: 0,
    cozum: "Bozkır savaş geleneğine dayanan Turan taktiğinde ordu sahte geri çekilmeyle düşmanı çembere alıp yok eder.",
    fc: ["Turan taktiğinin temel özelliği nedir?", "Sahte geri çekilmeyle düşmanı çembere alıp düzenini bozarak yenmeye dayanır."]
  },
  {
    si: 1,
    metin: "Pasinler Savaşı sonrası yapılan antlaşmada caminin mihrabına ok ve yay damgasının işlenmesi, Selçukluların hangi yönünü ortaya koyar?",
    secenekler: [
      "Askerî zaferi siyasi ve dinî kazanıma dönüştürdüklerini",
      "Doğu Roma ordusunu tamamen dağıttıklarını",
      "Anadolu’da kalıcı yerleşmeyi tamamladıklarını",
      "Donanma gücünü Akdeniz’e taşıdıklarını"
    ],
    dogru: 0,
    cozum: "Antlaşma maddeleri Selçukluların askerî başarısını siyasi ve dinî kazanımlarla taçlandırdığını gösterir.",
    fc: ["Pasinler antlaşmasının sembolik maddesi nedir?", "Caminin mihrabına ok ve yay damgasının işlenmesi kararlaştırılmıştır."]
  },
  {
    si: 1,
    metin: "1144’te Urfa Kontluğu’na son vererek II. Haçlı Seferi’nin başlamasına yol açan Musul Atabeyi hangisidir?",
    secenekler: ["İmadeddin Zengi", "Selahaddin Eyyubi", "Nureddin Mahmud", "Tuğtekin"],
    dogru: 0,
    cozum: "Musul Atabeyi İmadeddin Zengi 1144’te Urfa Kontluğu’na son verince Avrupalılar II. Haçlı Seferi hazırlığına girişti.",
    fc: ["Urfa Kontluğu’na son veren devlet adamının adı nedir?", "Musul Atabeyi İmadeddin Zengi 1144’te kontluğu ortadan kaldırmıştır."]
  },
  {
    si: 2,
    metin: "Aşağıdakilerden hangisi Malazgirt Savaşı’nın sonuçları arasında yer almaz?",
    secenekler: [
      "Haçlı Seferleri’nin sona ermesi",
      "Anadolu’da ilk Türk beyliklerinin kurulması",
      "Bizans’ın Anadolu’daki hâkimiyetinin zayıflaması",
      "Türklerin Ege kıyılarına kadar ilerlemesi"
    ],
    dogru: 0,
    cozum: "Malazgirt sonrası Anadolu’da beylikler kurulmuş ve ilerleme hızlanmıştır; Haçlı Seferleri ise bu zaferin ardından başlamıştır.",
    fc: ["Malazgirt Zaferi’nin Avrupa’daki yankısı nedir?", "Bizans’ı kurtarma düşüncesi Haçlı Seferleri’nin hazırlanmasını hızlandırmıştır."]
  },
  {
    si: 2,
    metin: "1243 Kösedağ Savaşı’nı 1176 Miryokefalon Savaşı’ndan ayıran temel sonuç nedir?",
    secenekler: [
      "Anadolu’da Moğol egemenliğinin başlaması",
      "Anadolu’nun Türk yurdu sayılması",
      "Bizans’ın Anadolu’ya yeniden yerleşmesi",
      "Haçlıların Kudüs’ü ele geçirmesi"
    ],
    dogru: 0,
    cozum: "1243 Kösedağ yenilgisi Türkiye Selçuklu Devleti’ni Moğol tâbiiyetine sokmuş, Anadolu’da siyasi birlik çözülmüştür.",
    fc: ["Kösedağ Savaşı’nın Anadolu’daki siyasi etkisi nedir?", "Türkiye Selçuklu Devleti Moğol egemenliğine girmiş, Anadolu’da beylikler dönemi başlamıştır."]
  },
  {
    si: 2,
    metin: "Dandanakan ve Malazgirt savaşlarının ortak yönü aşağıdakilerden hangisidir?",
    secenekler: [
      "Türklerin yeni bir yurt ve devlet düzeni kurmasını sağlamaları",
      "Bizans ordusunun Anadolu’dan tamamen çekilmesi",
      "Haçlı Seferleri’nin başlamasına yol açmaları",
      "Moğol istilasını durdurmaları"
    ],
    dogru: 0,
    cozum: "Dandanakan devlet kuruluşuna, Malazgirt Anadolu’nun yurt edinilmesine zemin hazırlamış; ikisi de yeni bir düzenin kapısını açmıştır.",
    fc: ["Dandanakan ve Malazgirt’in ortak tarihsel işlevi nedir?", "Her iki zafer de Türklerin yeni bir siyasi düzen kurmasının önünü açmıştır."]
  }
]);

/* ---------------------------------------------------------------- 1.2 */
yaz("tar_10_t01_c02", KAYNAK + ", s.34-49", [
  {
    si: 0,
    metin: "Büyük Selçuklu Devleti’nde Divan-ı A’lâ’nın başkanlığını yürüten ve hükümdardan sonra en yetkili devlet görevlisi hangisidir?",
    secenekler: ["Vezir", "Hâcibü’l-hüccâb", "Emîr-i dâd", "Sahib-i divan-ı istîfâ"],
    dogru: 0,
    cozum: "Divan-ı A’lâ’nın başkanı olan vezir, hükümdardan sonra devlet yönetiminde en yetkili kişiydi.",
    fc: ["Büyük Selçuklu Devleti’nde vezirin görevi nedir?", "Divan-ı A’lâ’ya başkanlık eder ve hükümdardan sonra devletin en yetkili yöneticisi sayılır."]
  },
  {
    si: 0,
    metin: "Karahanlılarda hükümdarın erdemlerinin Tanrı’nın ilahi bir lütfu sayılması ve yönetme yetkisinin bu lütfa bağlanması hangi kavramla ifade edilir?",
    secenekler: ["Kut", "Örf", "Gaza", "Fütüvvet"],
    dogru: 0,
    cozum: "Kut anlayışına göre yönetme yetkisi Tanrı tarafından hükümdara verilir; hükümdar bu lütfun gereklerine göre davranmak zorundadır.",
    fc: ["Kut anlayışının hükümdara yüklediği sorumluluk nedir?", "Yönetme yetkisinin ilahi bir lütuf sayılması, hükümdarı adaletli ve erdemli davranmaya zorlar."]
  },
  {
    si: 0,
    metin: "Büyük Selçuklu sarayında hükümdar ile halk ve devlet adamları arasındaki irtibatı sağlayan görevli hangisidir?",
    secenekler: ["Hâcib", "Şıhne", "Pervane", "Müstevfi"],
    dogru: 0,
    cozum: "Hâcib hükümdarın halkla ve devlet adamlarıyla ilişkisini düzenler, saraydaki hâciblerin başı ise hâcibü’l-hüccâbtır.",
    fc: ["Büyük Selçuklu sarayında hâcibin işlevi nedir?", "Hükümdar ile halk ve devlet adamları arasındaki görüşme düzenini sağlar."]
  },
  {
    si: 1,
    metin: "Meliklerin eğitiminden sorumlu atabeylerin zamanla devlet yönetiminde söz sahibi olması hangi sonucu doğurmuştur?",
    secenekler: [
      "Merkezî otoritenin zayıflaması",
      "Tımar sisteminin kaldırılması",
      "Donanmanın güçlenmesi",
      "Divan üyelerinin azalması"
    ],
    dogru: 0,
    cozum: "Atabeyler melikler adına güç kazanarak merkezî otoriteyi sarstı, taht kavgalarını ve iç karışıklıkları artırdı.",
    fc: ["Atabeylik uygulamasının zayıf yönü nedir?", "Atabeylerin melikler üzerinde nüfuz kazanması merkezî otoriteyi zayıflatmıştır."]
  },
  {
    si: 1,
    metin: "İslamiyet’in kabulünden sonra Türk devletlerinde hükümdarlık alametleri arasına katılan unsurlar hangileridir?",
    secenekler: [
      "Hutbe okutmak ve para bastırmak",
      "Otağ kurmak ve tuğ dikmek",
      "Ok-yay ve çetr kullanmak",
      "Davul çalmak ve sancak taşımak"
    ],
    dogru: 0,
    cozum: "Hutbe ve sikke (para), İslamiyet sonrası hükümdarlığın meşruiyetini gösteren yeni alametler arasındadır.",
    fc: ["Hutbe ve sikkenin işlevi nedir?", "İslamiyet sonrası hükümdarlığın meşruiyetini gösteren saltanat alametleri sayılır."]
  },
  {
    si: 1,
    metin: "Büyük Selçuklu taşra teşkilatında askerî vali olarak görev yapan ve bölgenin güvenliğinden sorumlu tutulan görevli hangisidir?",
    secenekler: ["Şıhne", "Kâdılkudât", "Pervane", "Naib-i saltanat"],
    dogru: 0,
    cozum: "Şıhne (şahne) taşrada askerî vali yetkisiyle görev yapar, güvenlik ve düzeni sağlardı.",
    fc: ["Şıhne görevlisinin yetkisi nedir?", "Taşrada askerî vali olarak görev yapar ve bölgenin güvenliğini sağlar."]
  },
  {
    si: 2,
    metin: "Divan-ı Arz’ın askerî işleri, Divan-ı İstifa’nın maliyeyi yürütmesi, Selçuklu yönetiminde hangi ilkenin uygulandığını gösterir?",
    secenekler: [
      "İş bölümü ve uzmanlaşma",
      "Toprak mülkiyetinin kaldırılması",
      "Yargının tek elde toplanması",
      "Taşra yönetiminin kaldırılması"
    ],
    dogru: 0,
    cozum: "Her divanın belirli bir alandan sorumlu olması, yönetimde iş bölümüne ve uzmanlaşmaya dayalı bir örgütlenme olduğunu gösterir.",
    fc: ["Selçuklu divan sisteminin temel ilkesi nedir?", "Askerî, mali ve idari işler ayrı divanlara dağıtılarak iş bölümü sağlanmıştır."]
  },
  {
    si: 2,
    metin: "Nizamiye medreselerinin açılması, devlet teşkilatında hangi alanın kurumsallaşmasını sağlamıştır?",
    secenekler: [
      "Eğitim ve fıkıh öğretimi",
      "Deniz ticareti ve gümrük",
      "Ordu teçhizatı ve silah üretimi",
      "Posta ve haberleşme"
    ],
    dogru: 0,
    cozum: "Nizamiye medreseleri fıkıh ve dinî ilimler öğretimini kurumsallaştırmış, devletin ihtiyaç duyduğu memur ve âlimleri yetiştirmiştir.",
    fc: ["Nizamiye medreselerinin devlet açısından işlevi nedir?", "Eğitim ve fıkıh öğretimini kurumsallaştırarak devletin ihtiyaç duyduğu kadroları yetiştirmiştir."]
  },
  {
    si: 3,
    metin: "Türkiye Selçuklu Devleti’nde 1243 sonrasında sultanın başkentte bulunmadığı zamanlarda naib-i saltanat görevlisinin tayin edilmesinin nedeni nedir?",
    secenekler: [
      "Yönetimde sürekliliği korumak",
      "Yeni topraklar fethetmek",
      "Vergi oranlarını düşürmek",
      "Ordu mevcudunu artırmak"
    ],
    dogru: 0,
    cozum: "Sultanın yokluğunda devlet işlerinin aksamaması için vekâlet verilmesi, yönetimde sürekliliği sağlama amacına dayanır.",
    fc: ["Naib-i saltanatın tanımı nedir?", "Sultanın başkentte bulunmadığı veya hastalandığı dönemlerde yönetimin aksamaması için doğmuştur."]
  },
  {
    si: 3,
    metin: "İkta askerlerinin giderlerinin toprak gelirleriyle karşılanması, devlet hazinesi açısından hangi sonucu doğurmuştur?",
    secenekler: [
      "Hazineden nakit ödeme yükünün azalması",
      "Tımar arazilerinin özel mülke dönüşmesi",
      "Yeniçeri ocağının kurulması",
      "Divan-ı İstifa’nın kaldırılması"
    ],
    dogru: 0,
    cozum: "İkta sahibi asker geçimini toprak gelirinden sağladığı için hazine nakit ödeme yapmaz, bu da mali yükü hafifletir.",
    fc: ["İkta sisteminin hazineye katkısı nedir?", "Asker ve memurların geçimi toprak gelirinden karşılanır, böylece hazineden nakit ödeme yapılmaz."]
  }
]);

/* ---------------------------------------------------------------- 1.3 */
yaz("tar_10_t01_c03", KAYNAK + ", s.50-65", [
  {
    si: 0,
    metin: "Selçuklu şehirlerinde ticaretin yerleşmeyi nasıl etkilediğini araştırmaya karar veren bir öğrenci, sorgulama sürecinin hangi aşamasındadır?",
    secenekler: [
      "Merak ettiği konuyu belirleme",
      "Topladığı bilgileri değerlendirme",
      "Konu hakkında çıkarım yapma",
      "Kaynakların sınırlılığını sorgulama"
    ],
    dogru: 0,
    cozum: "Araştırma sorusuna karar vermek, sorgulama sürecinin ilk aşaması olan merak edilen konunun belirlenmesidir.",
    fc: ["Sorgulama sürecinin ilk aşaması nedir?", "Merak edilen konunun belirlenip araştırma odağının kurulmasıdır."]
  },
  {
    si: 0,
    metin: "Türklerin Anadolu’da yerleşme biçimini merak eden bir öğrenci, hangi konuyu araştırma problemi olarak belirleyebilir?",
    secenekler: [
      "Kervan yollarının şehirlerin büyümesine etkisi",
      "Haçlı ordularının sefer güzergâhları",
      "Moğol ordusunun savaş düzeni",
      "Bizans sarayındaki unvanların anlamı"
    ],
    dogru: 0,
    cozum: "Yerleşme ve şehirleşmeyle doğrudan ilişkili olan kervan yolları, araştırma problemi için en uygun odaktır.",
    fc: ["Şehirleşme araştırmasında incelenen değişken nedir?", "Ticaret yollarının geçtiği güzergâhlar ile yerleşme yoğunluğu arasındaki ilişki incelenir."]
  },
  {
    si: 1,
    metin: "Kervan yolları üzerindeki kasabalarda nüfus artışını inceleyecek bir öğrencinin sorabileceği en uygun araştırma sorusu hangisidir?",
    secenekler: [
      "Kervan yolu geçen kasabalarda nüfus hangi yüzyılda artmıştır?",
      "Selçuklu sultanları hangi savaşlarda zafer kazanmıştır?",
      "Moğol istilası Anadolu’ya hangi yılda ulaşmıştır?",
      "Haçlılar Kudüs’ü hangi yılda ele geçirmiştir?"
    ],
    dogru: 0,
    cozum: "Araştırma sorusu, incelenen konuyla doğrudan ilgili ve ölçülebilir olmalıdır; nüfus artışı sorusu bu koşulu karşılar.",
    fc: ["İyi bir araştırma sorusunun özelliği nedir?", "Konuyla doğrudan ilgili, sınırları belirli ve yanıtlanabilir olmalıdır."]
  },
  {
    si: 1,
    metin: "Loncaların Selçuklu ticaretindeki payını araştıran bir öğrenci, sorusunu hangi yolla daha verimli hâle getirebilir?",
    secenekler: [
      "Belirli bir şehir ve dönem seçerek",
      "Bütün dünya tarihini kapsayarak",
      "Kaynak kullanmadan ilerleyerek",
      "Soruyu yalnızca savaşlara indirgeyerek"
    ],
    dogru: 0,
    cozum: "Araştırma sorusunun yer ve zamanla sınırlandırılması, bilgi toplamayı ve çıkarım yapmayı kolaylaştırır.",
    fc: ["Araştırma sorusunun sınırlandırılması nedir?", "Konu belirli bir yer, dönem ve toplulukla çerçevelenerek sınırlandırılır."]
  },
  {
    si: 2,
    metin: "XI-XIII. yüzyıl Selçuklu şehirleri hakkında bilgi toplayan bir öğrencinin vakfiye, seyahatname ve arşiv belgesini birlikte kullanmasının avantajı nedir?",
    secenekler: [
      "Farklı kaynak türleriyle çapraz doğrulama yapması",
      "Tek bir kaynağın verisini kesinleştirmesi",
      "Kaynakların tamamını aynı döneme indirgemesi",
      "Belgelerin dilini günümüze uyarlaması"
    ],
    dogru: 0,
    cozum: "Birden çok kaynak türünün birlikte kullanılması, bilgilerin karşılaştırılarak güvenilirliğinin artırılmasını sağlar.",
    fc: ["Çapraz doğrulamanın tanımı nedir?", "Aynı konudaki farklı kaynaklar karşılaştırılarak bilginin güvenilirliği artırılır."]
  },
  {
    si: 2,
    metin: "Yabanlu Panayırı’nın uluslararası bir ticaret merkezi olduğunu araştıran öğrenci, hangi kaynak türünden yararlanabilir?",
    secenekler: [
      "Döneme ait seyahatname ve ticaret kayıtları",
      "Günümüzdeki turizm broşürleri",
      "Yakın dönem romanları ve öyküleri",
      "Sinema filmlerinin afişleri"
    ],
    dogru: 0,
    cozum: "Dönemin tüccarlarının izlenimlerini aktaran seyahatnameler ve ticaret kayıtları, panayırın işlevi hakkında birincil bilgi sunar.",
    fc: ["Seyahatnamelerin sağladığı bilgi nedir?", "Dönemin tüccar ve gezginlerinin gözlemlerini aktararak ticari hayata dair birincil bilgi sunar."]
  },
  {
    si: 3,
    metin: "Bir kaynakta Selçuklu şehirlerinin nüfusu olduğundan çok yüksek gösterilmişse araştırmacı nasıl davranmalıdır?",
    secenekler: [
      "Başka kaynaklarla karşılaştırıp çelişkiyi değerlendirmeli",
      "Veriyi olduğu gibi doğru kabul etmeli",
      "Kaynağı tamamen göz ardı etmeli",
      "Nüfus verisini tarih dışı saymalı"
    ],
    dogru: 0,
    cozum: "Tek kaynağın verisi kesin sayılmaz; vergi ve nüfus kayıtlarıyla karşılaştırılarak abartı olup olmadığı sınanır.",
    fc: ["Tarihsel veride güvenilirlik denetiminin tanımı nedir?", "Aynı olguya ilişkin farklı kayıtlar karşılaştırılarak tutarlılık denetlenir."]
  },
  {
    si: 3,
    metin: "XII-XIII. yüzyıl vakfiyelerinin kadı huzurunda düzenlenip tanıklar önünde kayda geçirilmesi, gelir kayıtlarının güvenilir sayılmasının temel nedeni nedir?",
    secenekler: [
      "Resmî kayıt olmaları ve denetlenmeleri",
      "Edebî üslupla yazılmış olmaları",
      "Yalnızca savaşları anlatmaları",
      "Sonradan kaleme alınmış olmaları"
    ],
    dogru: 0,
    cozum: "Vakfiyeler hukuki işlem belgesi olduğu için hüküm ve denetim süreçlerinden geçer; bu da kayıtların güvenilirliğini artırır.",
    fc: ["Vakfiye belgesinin hukuki niteliği nedir?", "Bir vakfın kuruluşunu ve gelirlerini düzenleyen resmî, denetlenebilir bir belgedir."]
  },
  {
    si: 4,
    metin: "Vakıf arazilerinin geliriyle cami, medrese ve kervansaray yapılması, şehirleşme açısından neyi gösterir?",
    secenekler: [
      "Kentsel hizmetlerin vakıflar eliyle finanse edildiğini",
      "Toprakların tamamının özel mülk olduğunu",
      "Şehirlerde ticaretin tamamen durduğunu",
      "Devletin sosyal hizmetleri bıraktığını"
    ],
    dogru: 0,
    cozum: "Vakıf gelirleriyle inşa edilen yapılar, eğitim ve barınma hizmetlerinin vakıf kurumu üzerinden yürütüldüğünü gösterir.",
    fc: ["Vakıf arazisinin kullanım amacı nedir?", "Geliriyle cami, medrese, hastane ve kervansaray gibi hayır eserleri yaptırılan arazidir."]
  },
  {
    si: 4,
    metin: "Haraci araziden alınan verginin, gayrimüslimler Müslüman olduğunda kaldırılması toprak sisteminin hangi özelliğini gösterir?",
    secenekler: [
      "Verginin inanç ve hukuki statüye bağlı olduğunu",
      "Toprağın her yıl el değiştirdiğini",
      "Vergilerin yalnızca nakit alındığını",
      "Arazi türlerinin birbirine eşit olduğunu"
    ],
    dogru: 0,
    cozum: "Haraç, gayrimüslim tebaanın toprak karşılığı ödediği bir vergidir; statü değişince vergi de ortadan kalkar.",
    fc: ["Haraci arazinin tanımı nedir?", "Fetih sonrası gayrimüslimlerin elinde bırakılan ve karşılığında haraç alınan topraklardır."]
  }
]);

/* ---------------------------------------------------------------- 1.4 */
yaz("tar_10_t01_c04", KAYNAK + ", s.66-99", [
  {
    si: 0,
    metin: "Batı’da bilimsel çalışmaların kilise denetiminde yürütülmesine karşılık Türk-İslam medeniyetinde medrese ve rasathanelerin hükümdarlarca desteklenmesi hangi farkı ortaya koyar?",
    secenekler: [
      "Bilimin devlet himayesinde geliştiğini",
      "Eğitimin tamamen kiliseye bırakıldığını",
      "Bilim insanlarının görev yapamadığını",
      "Medreselerin yalnızca tıp okuttuğunu"
    ],
    dogru: 0,
    cozum: "Türk-İslam devletlerinde âlimler hükümdarlarca korunup desteklenmiş, bilimsel kurumlar saray ve vakıf gelirleriyle yaşatılmıştır.",
    fc: ["Türk-İslam devletlerinde bilim insanlarının konumu nedir?", "Hükümdarlar tarafından desteklenip korunmuş, çalışmaları için kurumlar tahsis edilmiştir."]
  },
  {
    si: 0,
    metin: "Büyük Selçuklu Devleti’nin Bağdat’ta kurduğu Nizamiye medreselerinin müfredat ve idari yapısının Anadolu’da örnek alınması neyi gösterir?",
    secenekler: [
      "Eğitim kurumlarında kurumsal süreklilik olduğunu",
      "Anadolu’da medrese açılmadığını",
      "Müfredatın her bölgede farklılaştığını",
      "Eğitimin saraydan bağımsız yürüdüğünü"
    ],
    dogru: 0,
    cozum: "Anadolu’daki medreseler Nizamiye modelini örnek aldığı için eğitim geleneği kurumlar aracılığıyla sürmüştür.",
    fc: ["Nizamiye medreselerinin Anadolu’ya etkisi nedir?", "Müfredat ve idari yapısı örnek alınarak Anadolu’da yeni medreseler açılmıştır."]
  },
  {
    si: 0,
    metin: "Türk-İslam medeniyetinde küttaplar, medreseler ve tekkelerin farklı işlevler üstlenmesi eğitim anlayışının hangi özelliğini gösterir?",
    secenekler: [
      "Kurumsal çeşitliliğe sahip olduğunu",
      "Yalnızca dinî ilimlere kapalı olduğunu",
      "Tek bir kurumda yürütüldüğünü",
      "Devlet denetimi dışında kaldığını"
    ],
    dogru: 0,
    cozum: "Sıbyan mektepleri, medreseler ve tekkeler farklı yaş ve amaç gruplarına hitap ederek eğitimin kurumsal çeşitliliğini gösterir.",
    fc: ["Küttap ile medrese arasındaki fark nedir?", "Küttap temel eğitim veren sıbyan mektebi, medrese ise yüksek dinî ve ilmî eğitim kurumudur."]
  },
  {
    si: 0,
    metin: "Türk-İslam medeniyetinde şehirlerde darüşşifa ve şifahanelerin kurulması, hangi alandaki gelişmişliğe kanıt olarak gösterilebilir?",
    secenekler: [
      "Sağlık hizmetleri ve tıp eğitimi",
      "Denizcilik ve gemi yapımı",
      "Maden işletmeciliği ve ticaret",
      "Askerî istihkâm ve sur yapımı"
    ],
    dogru: 0,
    cozum: "Darüşşifalar hem tedavi hem tıp eğitimi veren kurumlardır; varlıkları sağlık alanındaki kurumsallaşmayı gösterir.",
    fc: ["Darüşşifanın işlevi nedir?", "Hasta tedavisinin yapıldığı ve hekim yetiştirilen sağlık kurumudur."]
  },
  {
    si: 1,
    metin: "Kaşgarlı Mahmud’un 1072-1074 yıllarında Divânü Lugâti’t-Türk’ü yazması, Anadolu’nun Türkleşmesi sürecine hangi yönüyle katkı sağlar?",
    secenekler: [
      "Türkçenin yazı dili olarak değer kazanmasına",
      "Arapçanın resmî dil ilan edilmesine",
      "Medreselerin kapatılmasına",
      "Göçebe hayatın sona ermesine"
    ],
    dogru: 0,
    cozum: "Eser, Türkçenin Arapçayla boy ölçüşebilecek zenginlikte olduğunu kanıtlayarak Türkçenin itibarını yükseltmiştir.",
    fc: ["Divânü Lugâti’t-Türk’ün dil tarihi açısından önemi nedir?", "Türkçenin ilk kapsamlı sözlüğü olup dilin zenginliğini ortaya koymuştur."]
  },
  {
    si: 1,
    metin: "Yunus Emre’nin şiirlerinde dönemin edebiyat dili olan Farsça yerine Türkçeyi seçmesi hangi sonucu doğurmuştur?",
    secenekler: [
      "Türkçenin Anadolu’da kökleşip değer kazanmasını",
      "Farsçanın saraydan tamamen çıkarılmasını",
      "Tekke edebiyatının sona ermesini",
      "Medrese eğitiminin Türkçeleşmesini"
    ],
    dogru: 0,
    cozum: "Halkın anlayacağı sade Türkçeyle yazması, Türkçenin Anadolu’da yaygınlaşıp edebî değer kazanmasını sağlamıştır.",
    fc: ["Yunus Emre’nin dil tercihinin sonucu nedir?", "Sade Türkçeyle yazması, Türkçenin Anadolu’da yerleşmesini ve değer kazanmasını sağlamıştır."]
  },
  {
    si: 1,
    metin: "Mevlana’nın eserlerini Farsça kaleme almasına karşın farklı din ve kültürlerden insanları etrafında birleştirmesi neyi kanıtlar?",
    secenekler: [
      "Çağrısının din ve kültür sınırlarını aştığını",
      "Farsçanın Anadolu’da tek dil olduğunu",
      "Anadolu’da edebiyatın gelişmediğini",
      "Tasavvufun sarayla sınırlı kaldığını"
    ],
    dogru: 0,
    cozum: "Sevgi ve birlik çağrısı farklı inanç gruplarına ulaşmış, Mevlevilik düşüncesi geniş bir çevrede karşılık bulmuştur.",
    fc: ["Mevlana’nın evrensel yönünün dayanağı nedir?", "İnsan sevgisini ve birliği öne çıkaran çağrısının farklı din ve kültürlere ulaşmasına dayanır."]
  },
  {
    si: 2,
    metin: "Cezeri’nin Kitab-ül Hiyel adlı eserinde elliden fazla mekanik araç tasarlaması, hangi alandaki katkıya örnektir?",
    secenekler: [
      "Mekanik ve otomasyon teknolojisi",
      "Deniz haritacılığı ve gemi yapımı",
      "Fıkıh ve hukuk düzenlemeleri",
      "Şiir ve edebiyat eleştirisi"
    ],
    dogru: 0,
    cozum: "Su saatleri, mum saatleri ve otomatlar gibi tasarımlar, Cezeri’nin mekanik bilimine ve otomasyona öncülük ettiğini gösterir.",
    fc: ["Cezeri’nin eser verdiği alan nedir?", "Mekanik bilimi ve otomatik düzenekler alanında eser vermiştir."]
  },
  {
    si: 2,
    metin: "Hoca Ahmed Yesevi’nin hikmetlerini sade Türkçeyle söylemesi, Anadolu’nun İslamlaşma sürecine nasıl katkı sağlamıştır?",
    secenekler: [
      "Tasavvuf düşüncesinin halk arasında yayılmasını",
      "Arapçanın ibadet dili olmaktan çıkmasını",
      "Medreselerin kapatılmasını",
      "Göçebe boyların şehirlere taşınmasını"
    ],
    dogru: 0,
    cozum: "Anlaşılır Türkçeyle söylenen hikmetler, tasavvufun geniş halk kitlelerine ulaşmasını ve İslamlaşmanın hızlanmasını sağlamıştır.",
    fc: ["Yesevi’nin hikmet geleneğinin kolaylaştırdığı süreç nedir?", "Sade Türkçeyle aktarılan tasavvuf öğretisinin halk arasında yayılmasını kolaylaştırmıştır."]
  },
  {
    si: 2,
    metin: "Hacı Bektaş Veli’nin Makalat adlı eserinde toplumsal barışa dair görüşler ortaya koyması, Anadolu’nun Türkleşmesine hangi yönüyle katkı sağlar?",
    secenekler: [
      "Farklı toplulukların ortak bir hayat anlayışında buluşmasına",
      "Şehirlerde surların yeniden inşasına",
      "Ticaret yollarının denetlenmesine",
      "Moğol ordusunun Anadolu’dan çıkarılmasına"
    ],
    dogru: 0,
    cozum: "Hoşgörü ve ahlak temelli öğretiler, göçebe ve yerleşik toplulukların kaynaşmasını kolaylaştırarak kalıcı yerleşmeyi desteklemiştir.",
    fc: ["Makalat’ın konusu nedir?", "Ahlak, hoşgörü ve toplumsal düzen konularında görüşler içeren bir eserdir."]
  }
]);
