#!/usr/bin/env node
/* Din Kültürü ve Ahlak Bilgisi 10 · Tema 4 (Din, Çevre ve Teknoloji) havuzları.
   Kaynak: MEB Din Kültürü ve Ahlak Bilgisi 10 ders kitabı (2025). */
"use strict";

const { yaz, konuBasligiYaz } = require("../yazicilar/yaz.js");

const KAYNAK = "MEB Din Kültürü ve Ahlak Bilgisi 10 ders kitabı (2025)";

/* ---------------------------------------------------------------- 4.1 */
yaz("din_10_t04_c01", KAYNAK + ", s.116-123", [
  {
    si: 0,
    metin: "İslam’ın çevre ahlakının temel ilkeleri arasında hangileri yer alır?",
    secenekler: [
      "Fıtrat, ölçü, denge ve bütünlük",
      "Rekabet, hız ve kazanç",
      "Tüketim, birikim ve gösteriş",
      "Bireycilik, sınırsız özgürlük ve serbestlik"
    ],
    dogru: 0,
    cozum: "İslam’ın çevre ahlakında fıtrat, ölçü, denge ve bütünlük gibi ilkelerin önemli bir yeri vardır.",
    fc: ["Çevre kavramının tanımı nedir?", "Canlı varlıkların içinde yer aldığı, onların yaşamasını sağlayan fiziksel, kimyasal ve biyolojik faktörlerin toplamıdır."]
  },
  {
    si: 0,
    metin: "“Yarın kıyametin kopacağını bilseniz bile elinizdeki fidanı dikiniz.” hadisi çevre ahlakı açısından neyi öğütler?",
    secenekler: [
      "Sonuç görünmese de çevreye yararlı işler yapmayı",
      "Ağaç dikmeyi kıyamet yaklaşınca bırakmayı",
      "Çevre sorunlarını kader saymayı",
      "Doğal kaynakları hızla tüketmeyi"
    ],
    dogru: 0,
    cozum: "Hadis, sonucu görülmese bile çevreye fayda sağlayacak davranışlardan vazgeçilmemesi gerektiğini öğütler.",
    fc: ["Fidan dikme hadisinin mesajı nedir?", "Sonucu görülmese de yararlı işler yapmayı, çevreye katkıdan vazgeçmemeyi öğütlemesidir."]
  },
  {
    si: 0,
    metin: "Kur’an’da evrenin belli bir ölçü ve dengeyle yaratıldığının bildirilmesi çevre ahlakına nasıl temel olur?",
    secenekler: [
      "İnsanın bu ölçüyü bozmayacak biçimde davranmasını gerektirir",
      "Doğal kaynakların sınırsız olduğunu gösterir",
      "Çevre sorunlarının kader olduğunu bildirir",
      "İnsanın doğaya müdahalesini yasaklar"
    ],
    dogru: 0,
    cozum: "Evren ölçü ve denge üzerine kurulduğuna göre insanın bu dengeyi koruması, çevreye karşı ahlaki sorumluluğunun gereğidir.",
    fc: ["Ölçü ve denge ilkesinin anlamı nedir?", "Evrenin belli bir ölçü ve düzen içinde yaratıldığı, insanın bu dengeyi koruması gerektiğidir."]
  },
  {
    si: 0,
    metin: "İnsanın çevreye karşı sorumlu tutulmasının temel gerekçesi hangisidir?",
    secenekler: [
      "Yeryüzünde halife olarak emaneti korumakla görevli olması",
      "Doğal kaynakların tükenmez olması",
      "Çevre sorunlarının kendiliğinden çözülmesi",
      "İnsanın doğadan bağımsız yaşaması"
    ],
    dogru: 0,
    cozum: "İnsan, yeryüzünde halife olarak yaratılmıştır; bu konum ona çevreyi koruma ve emanete sahip çıkma sorumluluğu yükler.",
    fc: ["Çevre emanetinin tanımı nedir?", "İnsana koruması için bırakılan doğal varlıklar ve kaynaklardır."]
  },
  {
    si: 1,
    metin: "Su kirliliğinin başlıca nedenleri arasında hangileri sayılır?",
    secenekler: [
      "Endüstriyel, tarımsal ve evsel atıklar, petrol sızıntıları",
      "Ağaçlandırma çalışmaları",
      "Geri dönüşüm uygulamaları",
      "Yenilenebilir enerji kullanımı"
    ],
    dogru: 0,
    cozum: "Endüstriyel, tarımsal ve evsel atıkların suya karışması; petrol sızıntıları ve bilinçsiz madencilik su kirliliğine yol açar.",
    fc: ["Küresel ısınmanın tanımı nedir?", "Sera gazlarının artmasıyla atmosferin ısınması ve buna bağlı iklim değişiklikleridir."]
  },
  {
    si: 1,
    metin: "Biyoçeşitliliğin azalmasına yol açan etkenler hangileridir?",
    secenekler: [
      "Aşırı avlanma, yaşam alanlarının tahribi ve çarpık kentleşme",
      "Korunan alanların artırılması",
      "Atık yönetiminin geliştirilmesi",
      "Enerji verimliliğinin sağlanması"
    ],
    dogru: 0,
    cozum: "Aşırı avlanma, doğal yaşam alanlarının tahribi, çarpık kentleşme ve iklim değişikliği biyoçeşitliliğin azalmasına neden olur.",
    fc: ["Biyoçeşitliliğin tanımı nedir?", "Bir bölgede yaşayan canlı türlerinin ve bunların oluşturduğu çeşitliliğin bütünüdür."]
  },
  {
    si: 1,
    metin: "İklim değişikliğiyle mücadelede bireye düşen davranışlar hangileridir?",
    secenekler: [
      "Fosil yakıt kullanımını azaltmak, yenilenebilir enerjiyi tercih etmek",
      "Enerji tüketimini artırıp tasarrufu gereksiz görmek",
      "Orman alanlarını yerleşime açıp ağaçlandırmayı bırakmak",
      "Atıkları doğaya bırakıp geri dönüşümü önemsememek"
    ],
    dogru: 0,
    cozum: "Fosil yakıt kullanımını azaltmak, yenilenebilir ve verimli enerji kaynaklarını tercih etmek, ağaçlandırma faaliyetlerine katılmak iklim değişikliğiyle mücadeleye katkı sağlar.",
    fc: ["Sürdürülebilir tüketimin tanımı nedir?", "Gelecek nesillerin ihtiyaçlarını gözeterek doğal kaynakları verimli kullanmaktır."]
  },
  {
    si: 2,
    metin: "Bir kişi, kullanmadığı hâlde musluğu açık bırakıp suyun boşa akmasına neden olmuştur. Bu davranış çevre ahlakının hangi ilkesini ihlal eder?",
    secenekler: ["Ölçülü olma ve israf etmeme", "Bütünlük ve süreklilik ilkesi", "Fıtrat ve yaratılış ilkesi", "Emanet ve güven ilkesi"],
    dogru: 0,
    cozum: "Doğal kaynakların amaçsız harcanması israfı doğurur; çevre ahlakı kaynakların ölçülü kullanılmasını ister.",
    fc: ["İsraf kavramının tanımı nedir?", "Doğal kaynakların amaçsız, ölçüsüz ve gereksiz biçimde harcanmasıdır."]
  },
  {
    si: 2,
    metin: "Bir öğrencinin “Çevre sorunları beni ilgilendirmez.” sözünün çevre ahlakı açısından sorunlu olmasının nedeni hangisidir?",
    secenekler: [
      "İnsanın yaptıklarından sorumlu olması ve çevrenin bütün canlıları etkilemesi",
      "Çevre sorunlarının yalnızca devlete ait olması",
      "Çevrenin insan hayatına etkisinin bulunmaması",
      "Bireyin sorumluluğunun yalnızca kendisiyle sınırlı olması"
    ],
    dogru: 0,
    cozum: "İnsanın çevreye verdiği zarar bütün canlıları ve gelecek nesilleri etkiler; bu nedenle sorumluluk bireyle sınırlı değildir.",
    fc: ["Çevre ahlakının tanımı nedir?", "İnsanın çevreye karşı sorumluluklarını ve doğru davranış ilkelerini konu edinen ahlak alanıdır."]
  },
  {
    si: 2,
    metin: "Geri dönüşüme ve atık yönetimine destek olmanın çevreye katkısı hangisidir?",
    secenekler: [
      "Atık miktarını azaltıp çevre temizliğine katkı sağlaması",
      "Kaynak tüketimini artırması",
      "Doğal yaşam alanlarını daraltması",
      "Sera gazı emisyonunu çoğaltması"
    ],
    dogru: 0,
    cozum: "Atık miktarını en aza indirmek ve atıkları geri dönüştürmek hem çevre temizliğine katkıda bulunur hem doğal kaynakların korunmasını sağlar.",
    fc: ["Geri dönüşümün yararı nedir?", "Atık miktarını azaltır, doğal kaynakların korunmasına ve çevre temizliğine katkı sağlar."]
  }
]);

/* ---------------------------------------------------------------- 4.2 */
yaz("din_10_t04_c02", KAYNAK + ", s.124-127", [
  {
    si: 0,
    metin: "Teknolojiyle ilgili ahlaki unsurlar araştırılırken hangi konu başlıkları öne çıkar?",
    secenekler: [
      "Mahremiyet, sorumluluk, güvenlik ve doğruluk",
      "Hız, kapasite ve fiyat",
      "Marka, model ve renk",
      "Kurulum, güncelleme ve depolama"
    ],
    dogru: 0,
    cozum: "Teknoloji ahlakında mahremiyet, sorumluluk, güvenlik, doğruluk ve nefret söyleminden kaçınma gibi unsurlar öne çıkar.",
    fc: ["Teknoloji ahlakının tanımı nedir?", "Teknolojinin üretilmesi, geliştirilmesi ve kullanılmasında uyulması gereken ahlaki ilkeler bütünüdür."]
  },
  {
    si: 0,
    metin: "Teknoloji geliştirenlerin taşıması gereken ahlaki sorumluluk hangisidir?",
    secenekler: [
      "Ürünün insanlığa faydalı, güvenli ve hayatı kolaylaştırıcı olmasını gözetmek",
      "Yalnızca kâr oranını yükseltmeyi hedeflemek",
      "Kullanıcı verilerini sınırsız toplamak",
      "Reklam sayısını artırmaya odaklanmak"
    ],
    dogru: 0,
    cozum: "Teknolojiyi geliştirenler, ortaya koydukları ürünlerin insanlığa faydalı, hayatı kolaylaştırıcı ve güvenli olmasını amaçlamalıdır.",
    fc: ["Ürün geliştirirken gözetilmesi gereken ahlaki ölçüt nedir?", "Ürünün insanlığa faydalı, güvenli ve hayatı kolaylaştırıcı olmasını gözetmektir."]
  },
  {
    si: 0,
    metin: "Kullanıcıların dijital ortamlarda kaçınması gereken davranışlar hangileridir?",
    secenekler: [
      "Siber zorbalık, yanlış bilgi paylaşımı ve nefret söylemi",
      "Bilgiyi kaynağından doğrulamak",
      "Gizlilik ayarlarını gözden geçirmek",
      "Kişisel verileri paylaşmamak"
    ],
    dogru: 0,
    cozum: "Kullanıcılar siber zorbalık, yanlış bilgi paylaşımı ve nefret söyleminde bulunma gibi davranışlardan uzak durmalıdır.",
    fc: ["Siber zorbalığın tanımı nedir?", "Dijital ortamlarda kişilere yönelik kasıtlı, tekrarlayan ve zarar verici davranışlardır."]
  },
  {
    si: 0,
    metin: "Teknoloji alanında uyulması gereken ahlaki kurallardan biri olan mahremiyet neyi gerektirir?",
    secenekler: [
      "Kişisel verilerin gizlenmesi ve izinsiz erişime karşı korunması",
      "Bütün bilgilerin herkesle paylaşılması",
      "Kullanıcı verilerinin satılması",
      "Özel hayata dair verilerin yayılması"
    ],
    dogru: 0,
    cozum: "Mahremiyet, kişilerin kimlik bilgileri, özel hayatı gibi verilerin gizli tutulmasını ve izinsiz erişimlere karşı korunmasını gerektirir.",
    fc: ["Mahremiyetin tanımı nedir?", "Kişinin özel alanının ve kişisel verilerinin korunması, başkalarınca bilinmemesidir."]
  },
  {
    si: 0,
    metin: "6698 sayılı Kişisel Verilerin Korunması Kanunu hangi amaca yöneliktir?",
    secenekler: [
      "Kişisel verilerin korunmasını sağlamak",
      "Teknoloji üretimini yasaklamak",
      "Sosyal medya kullanımını tamamen kaldırmak",
      "Cep telefonu satışını sınırlamak"
    ],
    dogru: 0,
    cozum: "Kanun, kişisel verilerin işlenmesinde kişilerin haklarını korumayı amaçlar; yürürlüğe girmesi bu alanda yeni bir dönem başlatmıştır.",
    fc: ["Kişisel verinin tanımı nedir?", "Kimliği belirli veya belirlenebilir bir kişiye ilişkin her türlü bilgidir."]
  },
  {
    si: 1,
    metin: "Teknoloji ile ahlak arasındaki ilişki nasıl açıklanır?",
    secenekler: [
      "Teknolojinin etkileri ahlaki ölçütlerle değerlendirilip sınırlandırılır",
      "Teknoloji ahlaktan bütünüyle bağımsızdır",
      "Ahlak yalnızca teknolojinin hızıyla ilgilenir",
      "Teknoloji ahlaki sorunları kendiliğinden çözer"
    ],
    dogru: 0,
    cozum: "Teknoloji tarafsız araçlar sunsa da kullanım biçimi ahlaki sonuçlar doğurur; bu nedenle teknolojinin etkileri ahlaki ölçütlerle değerlendirilir.",
    fc: ["Teknolojinin kötüye kullanımının sonucu nedir?", "İnsanlığa zarar vermesi, hak ihlalleri ve toplumsal güven kaybıdır."]
  },
  {
    si: 1,
    metin: "Sosyal medyada yalan haber paylaşan bir kullanıcının ihlal ettiği ahlaki ilke hangisidir?",
    secenekler: ["Doğruluk ve dürüstlük", "Mahremiyet ilkesi", "Liyakat ilkesi", "Ahde vefa ilkesi"],
    dogru: 0,
    cozum: "Yalan ve iftira, İslam’ın yasakladığı davranışlardandır; doğruluğu sınanmamış bilgiyi paylaşmak dürüstlük ilkesini zedeler.",
    fc: ["Yanlış bilgi paylaşımının zararı nedir?", "Toplumsal güveni sarsar, insanları yanıltır ve hak kayıplarına yol açar."]
  },
  {
    si: 1,
    metin: "Bir uygulamanın kullanıcıdan gereksiz izinler istemesi hangi ahlaki sorunu doğurur?",
    secenekler: [
      "Kişisel verilerin sınır dışı toplanması ve mahremiyetin zedelenmesi",
      "Uygulamanın daha hızlı çalışması",
      "Cihazın pil ömrünün artması",
      "Veri güvenliğinin tamamen sağlanması"
    ],
    dogru: 0,
    cozum: "Amacı dışında veri toplanması mahremiyeti zedeler; kişisel verilerin korunması ilkesiyle bağdaşmaz.",
    fc: ["Veri güvenliğinin amacı nedir?", "Kişisel verilerin izinsiz erişim, kayıp ve kötüye kullanıma karşı korunmasıdır."]
  },
  {
    si: 1,
    metin: "Kur’an’ın “Gizlilikleri araştırmayın, birbirinizin gıybetini yapmayın…” emri dijital ortamda hangi davranışı yasaklar?",
    secenekler: [
      "Başkalarının özel bilgilerini araştırıp paylaşmayı",
      "Bilgiyi kaynağından doğrulamayı",
      "Gizlilik ayarlarını denetlemeyi",
      "Kişisel verileri korumayı"
    ],
    dogru: 0,
    cozum: "Ayet, başkalarının gizli bilgilerini araştırmayı ve arkasından konuşmayı yasaklar; bu yasak dijital ortamlarda da geçerlidir.",
    fc: ["Gıybetin tanımı nedir?", "Bir kişinin arkasından, duyduğunda üzüleceği biçimde konuşmaktır."]
  },
  {
    si: 1,
    metin: "7 Nisan tarihinin teknoloji ahlakı açısından önemi hangisidir?",
    secenekler: [
      "Kişisel Verileri Koruma Günü olarak kutlanması",
      "Teknoloji fuarlarının açılması",
      "Sosyal medya kullanımının başlaması",
      "İnternetin ülkemizde yaygınlaşması"
    ],
    dogru: 0,
    cozum: "6698 sayılı kanunun 7 Nisan 2016’da yürürlüğe girmesi nedeniyle 7 Nisan, Kişisel Verileri Koruma Günü olarak kutlanmaktadır.",
    fc: ["Kişisel Verileri Koruma Günü’nün belirlenme gerekçesi nedir?", "7 Nisan’dır; kişisel verilerin korunmasına dikkat çekmek için kutlanır."]
  }
]);

/* ---------------------------------------------------------------- 4.3 */
yaz("din_10_t04_c03", KAYNAK + ", s.128-131", [
  {
    si: 0,
    metin: "Teknolojik gelişmelerin kırsal bölgelerden kentlere göçü hızlandırmasının çevresel sonucu hangisidir?",
    secenekler: [
      "Doğal yaşam alanlarının azalması ve çarpık kentleşmenin artması",
      "Doğal kaynakların çoğalması",
      "Biyoçeşitliliğin artması",
      "Kirliliğin tamamen ortadan kalkması"
    ],
    dogru: 0,
    cozum: "Kentlerin nüfusu hızla artınca doğal yaşam alanları azalır; su, hava ve toprak kirliliği ile çarpık kentleşme ortaya çıkar.",
    fc: ["Çarpık kentleşmenin tanımı nedir?", "Plan ve altyapıdan yoksun, doğal çevreyi bozan düzensiz kentleşmedir."]
  },
  {
    si: 0,
    metin: "Dijital teknolojilerin yaygınlaşmasının tüketim alışkanlıklarına etkisi hangisidir?",
    secenekler: [
      "Ürünlere erişimi kolaylaştırıp tüketim bağımlılığını artırması",
      "Tüketimi bütünüyle ortadan kaldırması",
      "Yalnızca üretimi artırıp tüketimi azaltması",
      "İhtiyaçları azaltıp israfı bitirmesi"
    ],
    dogru: 0,
    cozum: "Dijital teknolojiler ürün ve hizmetlere erişimi kolaylaştırır; farklı ve eşsiz olma isteği tüketimi artırarak tüketim bağımlılığına yol açabilir.",
    fc: ["Tüketim bağımlılığının tanımı nedir?", "İhtiyaç dışı alışverişi durduramama, aşırı ve sürekli tüketme eğilimidir."]
  },
  {
    si: 0,
    metin: "Çevreye duyarlı teknolojik ürünlerin geliştirilmesinin amacı hangisidir?",
    secenekler: [
      "Enerji verimliliği sağlayıp çevre kirliliğini azaltmak",
      "Ham madde tüketimini artırmak",
      "Sera gazı emisyonunu yükseltmek",
      "Doğal kaynakları hızla tüketmek"
    ],
    dogru: 0,
    cozum: "Çevre dostu teknolojiler yenilenebilir enerji kullanımını artırır, enerji tasarrufu sağlar; kirliliği ve sera gazı emisyonunu azaltır.",
    fc: ["Yenilenebilir enerjinin tanımı nedir?", "Kendini sürekli yenileyen, tükenmeyen kaynaklardan elde edilen enerjidir."]
  },
  {
    si: 0,
    metin: "“Türkiye Çevre Haftası” hangi amaçla kutlanmaktadır?",
    secenekler: [
      "Doğal çevrenin korunması konusunda farkındalık oluşturmak",
      "Teknoloji ürünlerini tanıtmak",
      "Kentleşmeyi hızlandırmak",
      "Enerji tüketimini artırmak"
    ],
    dogru: 0,
    cozum: "Çevre, Şehircilik ve İklim Değişikliği Bakanlığı 5-9 Haziran günlerini içeren haftayı çevre bilinci oluşturmak için Çevre Haftası olarak kutlar.",
    fc: ["Çevre bilinci oluşturmayı amaçlayan haftanın adı nedir?", "5-9 Haziran günlerini içeren haftadır."]
  },
  {
    si: 1,
    metin: "Çevre ve teknoloji ilişkisi konusunda yapılan çözümlemede hangi iki yön birlikte ele alınır?",
    secenekler: [
      "Teknolojinin zararları ve çevre yararına kullanımı",
      "Yalnızca teknolojinin maliyeti",
      "Yalnızca kentlerin nüfus sayısı",
      "Yalnızca ürünlerin markası"
    ],
    dogru: 0,
    cozum: "Çözümleme, teknolojinin yol açtığı kirlilik ve kaynak tüketimi ile çevre dostu teknolojilerin sağladığı yararları birlikte değerlendirmeyi gerektirir.",
    fc: ["Teknolojinin çevreye olumsuz etkisinin nedeni nedir?", "Aşırı kaynak tüketimi, atık üretimi ve kirliliğe yol açmasıdır."]
  },
  {
    si: 1,
    metin: "Teknolojinin çevre üzerindeki etkileri hangi başlıklar altında sınıflandırılabilir?",
    secenekler: [
      "Olumsuz etkiler ve çevre yararına olan katkılar",
      "Yalnızca ekonomik etkiler",
      "Yalnızca hukuki düzenlemeler",
      "Yalnızca kültürel sonuçlar"
    ],
    dogru: 0,
    cozum: "Teknoloji bir yandan kirlilik ve kaynak tüketimine yol açarken diğer yandan çevre dostu çözümler ve tasarruf imkânı sunar.",
    fc: ["Enerji verimliliğinin tanımı nedir?", "Aynı işi daha az enerji kullanarak yapabilme, israfı azaltma durumudur."]
  },
  {
    si: 1,
    metin: "Atık miktarının azaltılması ve geri dönüşümün yaygınlaşması çevre açısından hangi sonucu doğurur?",
    secenekler: [
      "Doğal kaynakların korunması ve kirliliğin azalması",
      "Ham madde ihtiyacının artması",
      "Enerji tüketiminin yükselmesi",
      "Biyoçeşitliliğin zarar görmesi"
    ],
    dogru: 0,
    cozum: "Geri dönüşüm ham madde ihtiyacını ve atık kirliliğini azaltır; böylece doğal kaynaklar korunur.",
    fc: ["Geri dönüşümün çevreye katkısı nedir?", "Ham madde ihtiyacını azaltır, atık kirliliğini düşürür ve kaynakları korur."]
  },
  {
    si: 2,
    metin: "Çevre ve teknoloji ilişkisi dikkate alındığında sürdürülebilir bir yaşam için hangi yol izlenmelidir?",
    secenekler: [
      "Teknolojiden çevre yararına yararlanıp tüketimi ölçülü tutmak",
      "Bütün teknolojik ürünlerden vazgeçmek",
      "Doğal kaynakları sınırsız kullanmak",
      "Atıkları ayrıştırmadan depolamak"
    ],
    dogru: 0,
    cozum: "Sürdürülebilir yaşam, teknolojinin sağladığı imkânlardan çevre yararına yararlanmayı ve tüketimde ölçülü davranmayı gerektirir.",
    fc: ["Sürdürülebilirliğin tanımı nedir?", "Bugünün ihtiyaçlarını, gelecek nesillerin imkânlarını tehlikeye atmadan karşılamaktır."]
  },
  {
    si: 2,
    metin: "Bir şehrin toplu taşımayı yaygınlaştırıp elektrikli araçları desteklemesinin çevresel gerekçesi hangisidir?",
    secenekler: [
      "Egzoz kaynaklı hava kirliliğini ve sera gazını azaltmak",
      "Trafikteki araç sayısını çoğaltmak",
      "Yakıt tüketimini yükseltmek",
      "Kent merkezini genişletmek"
    ],
    dogru: 0,
    cozum: "Toplu taşıma ve elektrikli araçlar bireysel araç kullanımını azaltarak hava kirliliğini ve sera gazı emisyonunu düşürür.",
    fc: ["Sera gazlarının çevreye etkisi nedir?", "Atmosferde birikerek ısınmaya ve iklim değişikliğine yol açarlar."]
  },
  {
    si: 2,
    metin: "Teknolojinin çevreye etkisini açıklayan bir metinde hangi ifade nesnel bir değerlendirme içerir?",
    secenekler: [
      "“Fosil yakıt kullanımı sera gazı emisyonunu artırmaktadır.”",
      "“Teknoloji bütünüyle kötüdür, kaldırılmalıdır.”",
      "“Her teknolojik ürün doğaya zarar vermek zorundadır.”",
      "“Çevre sorunları teknolojiyle hiç ilgili değildir.”"
    ],
    dogru: 0,
    cozum: "Nesnel değerlendirme, ölçülebilir ve doğrulanabilir bir ilişki kurar; fosil yakıt ile sera gazı arasındaki bağ böyledir.",
    fc: ["Nesnel değerlendirmenin ölçütü nedir?", "Ölçülebilir verilere ve doğrulanabilir ilişkilere dayanmasıdır."]
  }
]);

/* ---------------------------------------------------------------- 4.4 */
yaz("din_10_t04_c04", KAYNAK + ", s.132-134", [
  {
    si: 0,
    metin: "Rum suresinin 41. ayeti hangi konuyu ele alır?",
    secenekler: [
      "İnsanların yaptıkları yüzünden karada ve denizde bozulmanın ortaya çıkmasını",
      "Namazın farz kılınması ve vakitlerinin belirlenmesi",
      "Mirasın paylaşım esasları ve ölçüleri",
      "Orucun hükmü ve bozan durumların açıklanması"
    ],
    dogru: 0,
    cozum: "Ayet, insanların kendi elleriyle yaptıkları yüzünden karada ve denizde fesat çıktığını, bunun da yapılanların bir kısmının karşılığı olduğunu bildirir.",
    fc: ["İnsanların yaptıklarının yeryüzündeki sonucu nedir?", "İnsanların yaptıkları sebebiyle karada ve denizde bozulmanın ortaya çıkmasıdır."]
  },
  {
    si: 0,
    metin: "Ayette “karada ve denizde bozulmaların ortaya çıkması” ifadesi hangi anlamlara yorumlanır?",
    secenekler: [
      "Kasırgaların artması, toprağın çoraklaşması, kıtlık ve sel gibi felaketler",
      "Yalnızca deniz taşımacılığının gelişmesi",
      "Yalnızca kentlerin sayısının artması",
      "Yalnızca ticaretin canlanması"
    ],
    dogru: 0,
    cozum: "İfade; kasırgaların artması, arazilerin çoraklaşması, kaynak sularının azalması, kıtlık, yangın ve sel gibi felaketlerin çoğalması biçiminde yorumlanır.",
    fc: ["Ayette sözü edilen bozulmanın kapsamı nedir?", "Kasırga, kuraklık, kıtlık, yangın ve sel gibi felaketlerin artmasıdır."]
  },
  {
    si: 1,
    metin: "Rum suresinin 41. ayetinde geçen “fesat” kavramı hangi anlamlara gelir?",
    secenekler: [
      "Bozulmak, çürümek, sağduyudan uzaklaşmak",
      "Düzen kurmak ve ıslah etmek",
      "Yardımlaşmak ve paylaşmak",
      "Ölçülü olmak ve dengeyi korumak"
    ],
    dogru: 0,
    cozum: "Fesat; bozulmak, çürümek, sağduyudan uzaklaşmak anlamlarına gelir; ayette düzen ve dengenin bozulmasını ifade eder.",
    fc: ["Fesadın ayetteki anlamı nedir?", "Düzen ve dengenin bozulması, yeryüzünde ortaya çıkan olumsuzluklardır."]
  },
  {
    si: 1,
    metin: "Ayette insanın çevreye verdiği zararla ilgili hangi kavramlar öne çıkar?",
    secenekler: ["Bozulma, düzen ve denge", "Şükür, sabır ve tevekkül", "Adalet, emanet ve liyakat", "İlim, hikmet ve irfan"],
    dogru: 0,
    cozum: "Ayet, insan kaynaklı bozulmayı düzen ve dengenin yitirilmesi üzerinden anlatır.",
    fc: ["Dengenin bozulmasının sonucu nedir?", "Çevre sorunlarının artması, kıtlık ve felaketlerin çoğalmasıdır."]
  },
  {
    si: 2,
    metin: "Ayette geçen konular hangi başlıklar altında sınıflandırılabilir?",
    secenekler: [
      "İnsanın yaptıkları ve bunların çevrede doğurduğu sonuçlar",
      "Yalnızca ibadetlerin sayısı ve vakti",
      "Yalnızca ahiret hayatının aşamaları",
      "Yalnızca ticaretin hükümleri"
    ],
    dogru: 0,
    cozum: "Ayet iki konuyu birlikte ele alır: insanların yaptıkları ve bu yapılanların yeryüzünde yol açtığı bozulma.",
    fc: ["Ayetin iki ana konusu nedir?", "İnsanların yaptıkları ve bu yaptıklarının çevrede doğurduğu bozulmadır."]
  },
  {
    si: 2,
    metin: "“Fesat” kavramının Kur’an’da geçtiği başka bir bağlam hangisidir?",
    secenekler: [
      "Orta yoldan uzaklaşmak ve haksız kazanç",
      "Namazın vakitlerini düzenlemek ve sıralamak",
      "Zekâtın hesaplanmasını yapmak ve oranını belirtmek",
      "Hac menasikini sıralamak ve çeşitlerini saymak"
    ],
    dogru: 0,
    cozum: "Fesat kavramı; orta yoldan uzaklaşmak, başkasının malına haksız yere el koymak gibi anlamlarda da kullanılır.",
    fc: ["Fesadın sözlük anlamı nedir?", "Bozulmak, çürümek ve sağduyudan uzaklaşmaktır."]
  },
  {
    si: 3,
    metin: "Ayetten hareketle çevre sorunlarının ortaya çıkışı hakkında hangi ÇIKARIM yapılabilir?",
    secenekler: [
      "Sorunların temelinde insanın sorumluluklarını yerine getirmemesi vardır",
      "Sorunlar insandan bağımsız olarak ortaya çıkar",
      "Sorunların çözümü mümkün değildir",
      "Sorunlar yalnızca denizlerde görülür"
    ],
    dogru: 0,
    cozum: "Ayet, bozulmanın insanların yaptıkları sebebiyle ortaya çıktığını bildirir; dolayısıyla sorunların kaynağı insanın sorumluluğunu yerine getirmemesidir.",
    fc: ["Ayetin sorumluluk mesajı nedir?", "İnsanın çevreye verdiği zarardan sorumlu olduğunu hatırlatmasıdır."]
  },
  {
    si: 3,
    metin: "Ayette yaşanan olumsuzlukların hangi işlevi vurgulanır?",
    secenekler: [
      "İnsana sorumluluklarını hatırlatan bir uyarı olması",
      "İnsanı çevreden koparması",
      "Sorunların çözümsüz olduğunu göstermesi",
      "Doğal kaynakların tükendiğini bildirmesi"
    ],
    dogru: 0,
    cozum: "Yaşanan sorunlar; insana sorumluluklarını hatırlatması, çevreyle ilişkisini gözden geçirmesi ve hatalarından ders çıkarması açısından uyarı niteliği taşır.",
    fc: ["Ayetin uyarı yönü nedir?", "İnsanın hatalarından ders çıkarıp çevreyle ilişkisini gözden geçirmesini istemesidir."]
  },
  {
    si: 4,
    metin: "Rum suresinin 41. ayetinin mesajını kendi cümleleriyle ifade eden cümle hangisidir?",
    secenekler: [
      "“Çevreye verdiğim zararın sonuçlarını görüyor ve davranışımı düzeltiyorum.”",
      "“Çevre sorunları benim davranışlarımla ilgisizdir.”",
      "“Doğal kaynaklar tükenmez, kullanmaya devam edebilirim.”",
      "“Bozulma kendiliğinden oluşur, önlemek mümkün değildir.”"
    ],
    dogru: 0,
    cozum: "Ayet, bozulmanın insanın yaptıklarından kaynaklandığını bildirir; mesajı içselleştiren kişi kendi davranışını düzeltmeye yönelir.",
    fc: ["Ayeti yaşantıya taşımanın yolu nedir?", "Kendi davranışlarını gözden geçirip çevreye zarar vermeyi bırakmaktır."]
  },
  {
    si: 4,
    metin: "Bir öğrenci ayetten hareketle çevre sorunlarına çözüm önerisi geliştirirken hangi yaklaşımı benimsemelidir?",
    secenekler: [
      "Sorumluluğu kabul edip somut davranış değişikliği önermeli",
      "Sorunun kaynağını bütünüyle başkalarına yüklemeli",
      "Çözümün imkânsız olduğunu söylemeli",
      "Konuyu bütünüyle gündemden çıkarmalı"
    ],
    dogru: 0,
    cozum: "Ayet insanı sorumlu tuttuğu için çözüm önerisi de bireyin kendi davranışlarını değiştirmesine dayanmalıdır.",
    fc: ["Çözüm önerisinin ölçütü nedir?", "Sorunun kaynağına uygun, uygulanabilir ve sorumluluk üstlenen bir öneri olmasıdır."]
  }
]);

/* Uygulama bu havuzu konu başlığıyla arar (bkz. yaz.js · konuBasligiYaz). */
konuBasligiYaz("din_10_t04_c04", "Din Kültürü > 4.4 Kur'an'dan Mesajlar (Rûm 41)");
