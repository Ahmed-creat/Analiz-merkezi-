#!/usr/bin/env node
/* ============================================================
   DİN KÜLTÜRÜ 10 · TUR-2 · 4. ÜNİTE — kitaptan sıfırdan havuzlar
   ------------------------------------------------------------
   Kaynak: MEB Din Kültürü 10 (2025) — din.json (kitap-kaynak).
   Basılı sayfa = PDF sayfası − 1.

     4.1 İnsan, Çevre ve Ahlak     s.115-122  (14 soru)
     4.2 Teknoloji ve Ahlak        s.122-126  (12 soru)
     4.3 Çevre ve Teknoloji        s.126-130  (12 soru)

   Kullanım: node docs/uretim/uretim/din-tur2-t4.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Din Kültürü";
const DOSYA = "din-10.pdf (MEB, 2025)";
const kaynak = s => "Din Kültürü 10 ders kitabı, s." + s;
const TEMA = 4;
const TEMA_ADI = "Din, Çevre ve Teknoloji";

/* --------------------------------------------- 4.1 */
yazKonu({
  konu_id: "din_10_u04_k01",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "4.1 İnsan, Çevre ve Ahlak",
  kazanim: "İslam'ın çevre ahlakı ilkelerini ve çevre sorunlarının sonuçlarını açıklar.",
  kaynak: kaynak("115-122"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Çevre ahlakının fıtrat, ölçü, denge ve bütünlük ilkelerini açıklar.",
    "Çevre sorunlarının birey ve toplum üzerindeki etkilerini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Canlıların yaşamını etkileyen fiziksel, kimyasal ve biyolojik faktörlerin toplamına ne ad verilir?",
      secenekler: ["Çevre", "Fıtrat", "Ahlak", "Emanet"],
      cozum: "Çevre, canlıların içinde yer aldığı ve yaşamını etkileyen faktörlerin toplamıdır.",
      fc: ["Çevre nedir?", "Canlıların yaşamını etkileyen fiziksel, kimyasal ve biyolojik faktörlerin toplamı."]
    },
    {
      bi: 0,
      metin: "Varlıkların yaratılıştaki tabiatına uygun olmasını ifade eden kavram hangisidir?",
      secenekler: ["Fıtrat", "Ölçü", "Denge", "Bütünlük"],
      cozum: "Fıtrat, yaratılış ve belli bir yatkınlığa sahip oluş anlamına gelir.",
      fc: ["Fıtrat nedir?", "Yaratılış; varlıkların yaratılıştaki tabiatına uygun olması."]
    },
    {
      bi: 0,
      metin: "İslam'ın çevre ahlakının ilkeleri hangi seçenekte birlikte verilmiştir?",
      secenekler: [
        "Fıtrat, ölçü, denge ve bütünlük",
        "Sabır, şükür, tevekkül ve dua",
        "Adalet, liyakat, emanet ve şeffaflık",
        "Tevhit, nübüvvet, ahiret ve kader"
      ],
      cozum: "Fıtrat, ölçü, denge ve bütünlük çevre ahlakının temel ilkeleridir.",
      fc: ["Çevre ahlakının ilkeleri hangileridir?", "Fıtrat, ölçü, denge ve bütünlük."]
    },
    {
      bi: 0,
      metin: "\"Yarın kıyametin kopacağını bilseniz bile elinizdeki fidanı dikiniz.\" hadisi hangi davranışı teşvik eder?",
      secenekler: [
        "Çevreyi korumayı ve ağaç dikmeyi",
        "Ticaretle uğraşmayı",
        "Yolculuğa çıkmayı",
        "İbadetleri çoğaltmayı"
      ],
      cozum: "Hadis, son ana kadar dahi çevreyi imar etmeyi öğütler.",
      fc: ["Fidan dikmeyi öğütleyen hadis nedir?", "\"Yarın kıyametin kopacağını bilseniz bile elinizdeki fidanı dikiniz.\""]
    },
    {
      bi: 0,
      metin: "Çevreyi oluşturan varlıkların bir bütünün parçası olması ve birindeki değişimin tümünü etkilemesi hangi ilkeyle ilgilidir?",
      secenekler: ["Bütünlük", "Ölçü", "Fıtrat", "Denge"],
      cozum: "Bütünlük ilkesi, parçalardaki değişimin bütünü etkilediğini ifade eder.",
      fc: ["Bütünlük ilkesi nedir?", "Varlıkların bir bütünün parçası olması ve birindeki değişimin tümünü etkilemesi."]
    },
    {
      bi: 0,
      metin: "Türkiye'de kişi başına düşen kullanılabilir tatlı su miktarı yaklaşık ne kadardır?",
      secenekler: ["1.555 m³", "755 m³", "2.555 m³", "3.155 m³"],
      cozum: "Kişi başına düşen miktar 1.555 m³ olduğu için Türkiye su stresi sınıfındadır.",
      fc: ["Türkiye'nin su sınıfı nedir?", "Su stresi; kişi başına yaklaşık 1.555 m³ ile."]
    },
    {
      bi: 0,
      metin: "Ülkemizde kullanılabilir su kaynaklarının en büyük bölümü hangi alanda tüketilmektedir?",
      secenekler: ["Sulama", "İçme suyu", "Sanayi", "Enerji üretimi"],
      cozum: "Kaynakların yaklaşık %76'sı sulamada kullanılır.",
      fc: ["Sulamada kullanılan su oranı yaklaşık ne kadardır?", "Kaynakların yaklaşık %76'sı."]
    },
    {
      bi: 1,
      metin: "Çevre sorunlarının sağlık alanındaki sonuçları hangisidir?",
      secenekler: [
        "Solunum yolu ve onkolojik hastalıkların artması",
        "Sağlık hizmetlerinin ucuzlaması",
        "Bağışıklık sisteminin güçlenmesi",
        "Beslenme alışkanlıklarının düzelmesi"
      ],
      cozum: "Çevre sorunları solunum, onkolojik, kalıtımsal ve nörolojik hastalıklara yol açar.",
      fc: ["Çevre sorunlarının sağlık etkisi nedir?", "Solunum yolu, onkolojik, kalıtımsal ve nörolojik hastalıklar."]
    },
    {
      bi: 1,
      metin: "Çevre sorunlarının ortaya çıkmasında temel etken hangisidir?",
      secenekler: [
        "İnsanın doğal kaynakları bilinçsiz kullanması",
        "Doğal afetlerin sıklaşması",
        "Mevsimlerin değişmesi",
        "Nüfusun yaşlanması"
      ],
      cozum: "Çevre sorunları büyük oranda insan kaynaklıdır ve çözümü de insana bağlıdır.",
      fc: ["Çevre sorunlarının temel kaynağı nedir?", "İnsanın bilinçsiz tutumu ve doğal kaynakları aşırı kullanması."]
    },
    {
      bi: 1,
      metin: "İnsanın doğal kaynakları yalnızca kendi çıkarı için kullanmaya başlaması hangi ilkenin yok sayılmasıyla ilişkilidir?",
      secenekler: ["Bütünlük", "Ölçü", "Fıtrat", "Emanet"],
      cozum: "Bütünlük ilkesi yok sayıldığında çevre emanet bilinciyle korunmaz.",
      fc: ["Kaynakların bencilce kullanımı hangi ilkeyi zedeler?", "Bütünlük ilkesini."]
    },
    {
      bi: 1,
      metin: "Çevrenin insana emanet edildiği bilinci hangi davranışı gerektirir?",
      secenekler: [
        "Sorumluluk bilinciyle hareket etmeyi",
        "Kaynakları sınırsız tüketmeyi",
        "Doğal alanları yerleşime açmayı",
        "Atıkları doğaya bırakmayı"
      ],
      cozum: "İslam ahlakı, insanın çevreye karşı sorumluluk bilinciyle davranmasını ister.",
      fc: ["Çevre emaneti nasıl korunur?", "Sorumluluk bilinciyle ve kaynakları ölçülü kullanarak."]
    },
    {
      bi: 1,
      metin: "Çevre sorunlarının sosyal alandaki sonuçlarına hangisi örnektir?",
      secenekler: [
        "Göç ve toplumsal huzursuzluk",
        "Üretim maliyetlerinin düşmesi",
        "Kentlerin düzenli büyümesi",
        "Eğitim süresinin uzaması"
      ],
      cozum: "Çevre sorunları göç, huzursuzluk ve çatışmalara yol açabilir.",
      fc: ["Çevre sorunlarının sosyal sonucu nedir?", "Göç, toplumsal huzursuzluk ve çatışmalar."]
    },
    {
      bi: 1,
      metin: "Türkiye'de su stresi sınıfına girilmesinin anlamı hangisidir?",
      secenekler: [
        "Kullanılabilir su miktarının kişi başına 1.000-1.700 m³ arasında olması",
        "Su kaynaklarının tümüyle tükenmesi",
        "Kişi başına 1.700 m³ten fazla su düşmesi",
        "Su kullanımının sanayide yoğunlaşması"
      ],
      cozum: "1.000-1.700 m³ arası su stresi, 1.000 m³ altı su kıtlığı olarak tanımlanır.",
      fc: ["Su stresi ne demektir?", "Kişi başına kullanılabilir suyun 1.000-1.700 m³ arasında olması."]
    },
    {
      bi: 1,
      metin: "Çevre sorunlarının en aza indirilmesi hangi tutuma bağlanmıştır?",
      secenekler: [
        "İslam'ın öngördüğü çevre ahlakı bilinciyle hareket etmeye",
        "Teknoloji kullanımının tümüyle bırakılmasına",
        "Kentleşmenin hızlandırılmasına",
        "Üretimin artırılmasına"
      ],
      cozum: "Çevre ahlakı bilinciyle hareket eden insan sorunların üstesinden gelebilir.",
      fc: ["Çevre sorunlarının çözümü neye bağlıdır?", "Çevre ahlakı bilinciyle hareket etmeye."]
    }
  ]
});

/* --------------------------------------------- 4.2 */
yazKonu({
  konu_id: "din_10_u04_k02",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "4.2 Teknoloji ve Ahlak",
  kazanim: "Teknolojinin ahlaki sorumlulukla kullanılmasının önemini açıklar.",
  kaynak: kaynak("122-126"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Teknolojinin olumlu ve olumsuz etkilerini ahlakla ilişkilendirir.",
    "Teknoloji kullanımında ahlaki sorumluluğun gereklerini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "İnsanın maddi çevresini değiştirmek amacıyla geliştirdiği araç gereçler ve bunlara ilişkin bilgilerin tümüne ne ad verilir?",
      secenekler: ["Teknoloji", "Sanat", "Bilim", "Ahlak"],
      cozum: "Teknoloji, araç gereçler ve bunlara ilişkin bilgilerin tümüdür.",
      fc: ["Teknoloji nedir?", "İnsanın çevresini değiştirmek için geliştirdiği araç gereçler ve bilgilerin tümü."]
    },
    {
      bi: 0,
      metin: "Teknoloji kavramının Türkçedeki karşılığı hangisidir?",
      secenekler: ["Uygulayım bilimi", "Doğa bilimi", "Toplum bilimi", "Varlık bilimi"],
      cozum: "Teknoloji Türkçede \"uygulayım bilimi\" olarak adlandırılır.",
      fc: ["Teknolojinin Türkçe karşılığı nedir?", "Uygulayım bilimi."]
    },
    {
      bi: 0,
      metin: "Teknolojinin doğru kullanılmadığında ortaya çıkardığı olumsuzluklara hangisi örnektir?",
      secenekler: [
        "Bağımlılık ve sosyal izolasyon",
        "Bilgiye erişimin kolaylaşması",
        "İş verimliliğinin artması",
        "Ulaşımın hızlanması"
      ],
      cozum: "Bağımlılık, veri güvenliği ihlali, işsizlik ve sosyal izolasyon teknolojinin yanlış kullanımının sonuçlarıdır.",
      fc: ["Teknolojinin yanlış kullanımının sonucu nedir?", "Bağımlılık, veri güvenliği ihlali, işsizlik, sosyal izolasyon."]
    },
    {
      bi: 0,
      metin: "Teknolojinin olumsuz etkilerinin azaltılmasında hangi unsurun işlevi vurgulanır?",
      secenekler: ["Ahlaki kurallar", "Rekabet", "Sermaye", "Hız"],
      cozum: "Hem geliştirenler hem kullanıcılar ahlaki unsurlara uymalıdır.",
      fc: ["Teknolojinin olumsuz etkilerini azaltan unsur nedir?", "Ahlaki kurallara uyulması."]
    },
    {
      bi: 0,
      metin: "Teknoloji geliştirenlerin taşıması gereken amaç hangisidir?",
      secenekler: [
        "İnsanlığa faydalı ve güvenli ürünler ortaya koymak",
        "Üretimi en kısa sürede artırmak",
        "Pazar payını büyütmek",
        "Rakiplerinden önce davranmak"
      ],
      cozum: "Geliştiriciler, teknolojinin faydalı, kolaylaştırıcı ve güvenli olmasını amaçlamalıdır.",
      fc: ["Teknoloji geliştirenin amacı ne olmalıdır?", "İnsanlığa faydalı, güvenli ve hayatı kolaylaştıran ürünler."]
    },
    {
      bi: 0,
      metin: "Kullanıcıların kaçınması gereken davranışlar hangi seçenekte verilmiştir?",
      secenekler: [
        "Siber zorbalık, yanlış bilgi paylaşımı ve nefret söylemi",
        "Araştırma yapmak ve kaynak taramak",
        "Çevrim içi derslere katılmak",
        "İşlerini dijital araçlarla planlamak"
      ],
      cozum: "Kullanıcılar siber zorbalık, yanlış bilgi ve nefret söyleminden uzak durmalıdır.",
      fc: ["Teknoloji kullanıcısı hangi davranışlardan kaçınmalıdır?", "Siber zorbalık, yanlış bilgi paylaşımı ve nefret söylemi."]
    },
    {
      bi: 0,
      metin: "Kişisel Verilerin Korunması Kanunu'nun numarası ve yürürlüğe girdiği yıl hangisidir?",
      secenekler: [
        "6698 sayılı kanun, 2016",
        "657 sayılı kanun, 1965",
        "5237 sayılı kanun, 2004",
        "2820 sayılı kanun, 1983"
      ],
      cozum: "6698 sayılı kanun 7 Nisan 2016 tarihinde yürürlüğe girmiştir.",
      fc: ["Kişisel Verilerin Korunması Kanunu kaç numaralıdır?", "6698 sayılı kanun (2016)."]
    },
    {
      bi: 1,
      metin: "Hiroşima ve Nagazaki'ye atom bombası atılması teknoloji-ahlak ilişkisi açısından neyi gösterir?",
      secenekler: [
        "Teknolojinin ahlaki sorumluluktan bağımsız kullanılamayacağını",
        "Teknolojinin her zaman faydalı olduğunu",
        "Savaşın teknolojiyi geliştirdiğini",
        "Bilimsel bilginin sınırlı olduğunu"
      ],
      cozum: "Örnek, teknolojinin insanlığa zarar verecek biçimde kullanılabildiğini gösterir.",
      fc: ["Atom bombası örneği neyi gösterir?", "Teknolojinin ahlaki sorumlulukla kullanılması gerektiğini."]
    },
    {
      bi: 1,
      metin: "Uzaktan gerçekleştirilen robotik ameliyat örneği teknolojinin hangi yönünü gösterir?",
      secenekler: [
        "İnsan hayatını kolaylaştıran imkânlar sunduğunu",
        "Çevre kirliliğini artırdığını",
        "İşsizliği zorunlu kıldığını",
        "Veri güvenliğini ortadan kaldırdığını"
      ],
      cozum: "Uzaktan ameliyat, teknolojinin sağlık alanında sağladığı faydaya örnektir.",
      fc: ["Uzaktan ameliyat örneği neyi gösterir?", "Teknolojinin hayatı kolaylaştıran faydalarını."]
    },
    {
      bi: 1,
      metin: "Teknolojinin doğru kullanımı için bireye düşen sorumluluk hangisidir?",
      secenekler: [
        "Kullanım amacını ahlaki ölçütlerle sorgulamak",
        "Her yeni teknolojiyi hemen edinmek",
        "Sosyal medyada daha çok paylaşım yapmak",
        "Teknolojiyi eğlence aracı olarak görmek"
      ],
      cozum: "Birey, teknolojiyi kullanırken ahlaki ölçütleri gözetmelidir.",
      fc: ["Teknolojinin doğru kullanımı için ne gerekir?", "Kullanım amacının ahlaki ölçütlerle sorgulanması."]
    },
    {
      bi: 1,
      metin: "Teknoloji kaynaklı veri güvenliği ihlallerinin önlenmesi hangi bilinçle ilişkilidir?",
      secenekler: [
        "Kişisel verilerin korunması bilinciyle",
        "Daha fazla uygulama yüklemekle",
        "Şifreleri paylaşmakla",
        "Hesapları ortak kullanmakla"
      ],
      cozum: "Kişisel verilerin korunması, hukuki ve ahlaki bir sorumluluktur.",
      fc: ["Veri güvenliği ihlali nasıl önlenir?", "Kişisel verilerin korunması bilinci ve hukuki düzenlemelere uymakla."]
    },
    {
      bi: 1,
      metin: "Teknolojiyi hem geliştirenlerin hem kullanıcıların ahlaki ilkelere uyması hangi sonucu doğurur?",
      secenekler: [
        "Ortaya çıkabilecek olumsuzlukların önüne geçilmesini",
        "Teknolojik gelişmenin durmasını",
        "Maliyetlerin artmasını",
        "Kullanımın yasaklanmasını"
      ],
      cozum: "Ahlaki unsurlara uyulması, teknolojinin zararlarını sınırlar.",
      fc: ["Ahlaki ilkelere uyulmasının sonucu nedir?", "Teknolojinin olumsuz etkilerinin önüne geçilmesi."]
    }
  ]
});

/* --------------------------------------------- 4.3 */
yazKonu({
  konu_id: "din_10_u04_k03",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "4.3 Çevre ve Teknoloji",
  kazanim: "Teknolojik gelişmelerin çevre üzerindeki etkilerini açıklar.",
  kaynak: kaynak("126-130"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Teknolojik gelişmelerin yol açtığı çevre sorunlarını açıklar.",
    "Çevre sorunlarına yönelik çözüm önerilerini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Sanayi için gereken ham madde ihtiyacının doğal kaynaklara yönelmesi hangi sonucu doğurmuştur?",
      secenekler: [
        "Doğal kaynakların hızla tükenmesini",
        "Kentlerin küçülmesini",
        "Üretimin azalmasını",
        "Göçlerin durmasını"
      ],
      cozum: "Ham madde ihtiyacı kaynakların hızla tükenmesine ve çevre sorunlarına yol açmıştır.",
      fc: ["Ham madde ihtiyacının sonucu nedir?", "Doğal kaynakların hızla tükenmesi ve çevre sorunları."]
    },
    {
      bi: 0,
      metin: "Teknolojik gelişmelerin sebep olduğu çevre sorunları hangi seçenekte verilmiştir?",
      secenekler: [
        "İklim değişikliği, ormanların yok edilmesi, türlerin tükenmesi",
        "Okuryazarlığın artması, kentlerin güzelleşmesi",
        "Ulaşımın kolaylaşması, iletişimin hızlanması",
        "Sağlık hizmetlerinin yaygınlaşması, ömrün uzaması"
      ],
      cozum: "İklim değişikliği, ormansızlaşma, türlerin tükenmesi, çarpık kentleşme ve tüketim bağımlılığı teknoloji kaynaklı sorunlardır.",
      fc: ["Teknoloji kaynaklı çevre sorunları hangileridir?", "İklim değişikliği, ormansızlaşma, türlerin tükenmesi, çarpık kentleşme, tüketim bağımlılığı."]
    },
    {
      bi: 0,
      metin: "Sanayi, enerji ve otomotiv sektörlerindeki gelişmelerin atmosferde artırdığı gaz hangisidir?",
      secenekler: ["Sera gazı", "Oksijen", "Azot", "Hidrojen"],
      cozum: "Sera gazlarının artması küresel ısınmaya yol açar.",
      fc: ["Sera gazı artışı neye yol açar?", "Küresel ısınmaya."]
    },
    {
      bi: 0,
      metin: "Küresel ısınmanın doğrudan sonuçları hangi seçenekte verilmiştir?",
      secenekler: [
        "Sel, fırtına ve kuraklığın artması",
        "Deniz seviyesinin düşmesi",
        "Ormanların genişlemesi",
        "Kutup buzullarının artması"
      ],
      cozum: "Küresel ısınma afetleri artırır, deniz seviyesini yükseltir ve kuraklığı çoğaltır.",
      fc: ["Küresel ısınmanın sonuçları nedir?", "Sel, fırtına, hortum, orman yangını, deniz seviyesi yükselmesi ve kuraklık."]
    },
    {
      bi: 0,
      metin: "Teknolojik imkânların kırsaldan kente göçü hızlandırmasının çevresel sonucu hangisidir?",
      secenekler: [
        "Çarpık kentleşme ve doğal yaşam alanlarının azalması",
        "Kırsal üretimin artması",
        "Kentlerde su tüketiminin azalması",
        "Hava kirliliğinin bitmesi"
      ],
      cozum: "Kent nüfusunun hızla artması çarpık kentleşmeye ve kirliliğe yol açar.",
      fc: ["Kentleşme baskısının çevresel sonucu nedir?", "Çarpık kentleşme, kirlilik ve doğal yaşam alanlarının daralması."]
    },
    {
      bi: 0,
      metin: "Anadolu'da geçmişte yaşayan Asya fili, aslan ve çita gibi türlerin bugün bulunmaması hangi soruna örnektir?",
      secenekler: [
        "Türlerin neslinin tükenmesine",
        "İklimin soğumasına",
        "Ormanların artmasına",
        "Kentlerin küçülmesine"
      ],
      cozum: "Bu türlerin nesli ülkemizde tümüyle tükenmiştir.",
      fc: ["Anadolu'daki Asya fili ve çita örneği neyi gösterir?", "Türlerin neslinin tükenmesini."]
    },
    {
      bi: 1,
      metin: "Teknolojinin çevreye etkisi hangi ikili ilişkiyle açıklanabilir?",
      secenekler: [
        "Hayatı kolaylaştırırken çevre sorunlarını artırması",
        "Yalnızca çevreyi koruması",
        "Üretimi tümüyle durdurması",
        "Doğal kaynakları çoğaltması"
      ],
      cozum: "Teknoloji bir yandan kolaylık sağlar, diğer yandan çevre sorunlarını artırır.",
      fc: ["Teknoloji-çevre ilişkisi nasıl özetlenir?", "Kolaylık sağlarken çevre sorunlarını da artırması."]
    },
    {
      bi: 1,
      metin: "Su kirliliğini azaltmak isteyen birinin çözüm önerisi hangisidir?",
      secenekler: [
        "Kimyasal temizleyiciler yerine doğal ürünler kullanmak",
        "Daha fazla deterjan tüketmek",
        "Atık suları akarsulara bırakmak",
        "Su kullanımını artırmak"
      ],
      cozum: "Kimyasal ürünler yerine doğal temizleyiciler tercih edilmelidir.",
      fc: ["Mutfakta kullanılan kimyasal temizleyicilerin zararı nedir?", "Su kirliliğine yol açmaları."]
    },
    {
      bi: 1,
      metin: "Tüketim bağımlılığının çevreyle ilişkisi hangisidir?",
      secenekler: [
        "Kaynak tüketimini ve atık miktarını artırması",
        "Doğal kaynakları koruması",
        "Kirliliği tümüyle önlemesi",
        "Üretimi azaltması"
      ],
      cozum: "Aşırı tüketim, kaynakların tükenmesini ve atık artışını hızlandırır.",
      fc: ["Aşırı tüketim çevreyi nasıl etkiler?", "Kaynak tüketimini ve atık miktarını artırır."]
    },
    {
      bi: 1,
      metin: "Çevre sorunlarının çözümünde teknolojiden yararlanmanın doğru biçimi hangisidir?",
      secenekler: [
        "Çevre dostu, tasarruflu teknolojiler geliştirmek",
        "Teknoloji kullanımını tümüyle bırakmak",
        "Üretimi sınırsız artırmak",
        "Doğal kaynakları hızla tüketmek"
      ],
      cozum: "Teknoloji, çevreye duyarlı ve tasarruflu biçimde yönlendirilmelidir.",
      fc: ["Çevre sorunlarında teknolojinin doğru kullanımı nedir?", "Çevre dostu ve tasarruflu teknolojiler geliştirmek."]
    },
    {
      bi: 1,
      metin: "Teknolojik gelişmelerin çevre üzerindeki olumsuz etkilerinin artmaya başladığı dönem hangisiyle ilişkilendirilir?",
      secenekler: [
        "Sanayileşmenin hızlandığı dönem",
        "Tarımın başladığı dönem",
        "Yazının bulunduğu dönem",
        "Ateşin keşfedildiği dönem"
      ],
      cozum: "Sanayileşmeyle birlikte ham madde ihtiyacı ve kirlilik hızla artmıştır.",
      fc: ["Çevre sorunları hangi dönemde artmıştır?", "Sanayileşmenin hızlandığı dönemde."]
    },
    {
      bi: 1,
      metin: "Çevre sorunlarıyla mücadelede bireyin yapabileceği en etkili davranış hangisidir?",
      secenekler: [
        "Kaynakları israf etmemek ve geri dönüşüme katkı sunmak",
        "Sorunu yalnızca yöneticilere bırakmak",
        "Tüketimi artırarak ekonomiyi canlandırmak",
        "Kirliliği görmezden gelmek"
      ],
      cozum: "İsrafı önlemek ve geri dönüşüme katkı sunmak bireysel sorumluluktur.",
      fc: ["Bireyin çevre sorumluluğu nedir?", "İsraf etmemek, geri dönüşüme katkı sunmak."]
    }
  ]
});

console.log("din tur-2 (4. ünite): 3 havuz yazıldı");
