#!/usr/bin/env node
/* ============================================================
   COĞRAFYA 10 · 4. ÜNİTE (BEŞERÎ SİSTEMLER VE SÜREÇLER)
   ------------------------------------------------------------
   Kaynak: MEB Coğrafya 10 (2025) — cografya.json.
   Basılı sayfa = PDF sayfası − 1.

     4.1 Yerleşmelerin Kuruluşu ve Gelişimi         s.121-129
     4.2 Yerleşmelerin Fonksiyonları                s.130-135

   Kullanım: node docs/uretim/uretim/cografya-t4.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Coğrafya";
const DOSYA = "cografya-10.pdf (MEB, 2025)";
const kaynak = s => "Coğrafya 10 ders kitabı, s." + s;

/* ------------------------------------------------------- 4.1 */
yazKonu({
  konu_id: "cogr_10_u04_k01",
  ders: DERS, tema: 4, tema_adi: "Beşerî Sistemler ve Süreçler",
  baslik: "4.1 Yerleşmelerin Kuruluşu ve Gelişimi",
  kazanim: "Yerleşmelerin yer seçimi, kuruluşu ve gelişiminde etkili olan coğrafi faktörleri sorgular.",
  kaynak: kaynak("121-129"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Yerleşme yerinin seçiminde etkili doğal ve beşerî faktörleri açıklar.",
    "Yerleşme tiplerini ölçütlerine göre sınıflandırır."
  ],
  items: [
    {
      bi: 0,
      metin: "İnsanların barınma, korunma ve sosyoekonomik ihtiyaçlarını sürdürdükleri yerlere ne ad verilir?",
      secenekler: [
        "Yerleşme",
        "Nüfus",
        "Fonksiyon",
        "Mekânsal veri"
      ],
      cozum: "İnsanların barınma, korunma, sosyoekonomik ve benzeri ihtiyaçlarını sürdürdükleri yerlere yerleşme denir (s.121).",
      fc: ["Yerleşme nedir?", "İnsanların barınma ve sosyoekonomik ihtiyaçlarını sürdürdüğü yer."]
    },
    {
      bi: 0,
      metin: "Neolitik Çağ'da insanın yerleşik hayata geçmesine yol açan değişim hangisidir?",
      secenekler: [
        "Tarım ve hayvancılık gibi ekonomik faaliyetlere yönelmesi",
        "Madenden saban yapması",
        "Ticaret yollarını kullanması",
        "Şehirlerde sanayi tesisleri kurması"
      ],
      cozum: "Göçebe yaşayan insanın Neolitik Çağ'da tarım ve hayvancılığa yönelmesi yerleşik hayata geçmesine neden olmuştur (s.121).",
      fc: ["Yerleşik hayata geçiş nedir?", "Tarım ve hayvancılığın başlamasıyla insanların belirli bir yerde kalıcı yaşaması."]
    },
    {
      bi: 0,
      metin: "Yeryüzündeki ilk yerleşme alanlarının seçiminde öne çıkan iki temel unsur hangileridir?",
      secenekler: [
        "İklim koşullarının elverişliliği ve su kaynaklarının yeterliliği",
        "Maden yataklarının varlığı ve sanayi tesisleri",
        "Ulaşım ağları ve üniversiteler",
        "Turizm değerleri ve limanlar"
      ],
      cozum: "İklim koşullarının elverişli ve su kaynaklarının yeterli olması, ilk yerleşme alanlarının seçiminde öne çıkan unsurlardır (s.122).",
      fc: ["İlk yerleşme yeri seçimi nedir?", "Elverişli iklim ve yeterli su kaynağına dayanan yer seçimidir."]
    },
    {
      bi: 0,
      metin: "Bakır, tunç ve demirin işlenmeye başlanması yerleşme yeri seçiminde nasıl bir değişim yaratmıştır?",
      secenekler: [
        "Madenin çıkarıldığı ve odunun bol olduğu ağaçlık mekânların tercih edilmesine",
        "Yalnızca kıyı ovalarının tercih edilmesine",
        "Yerleşmelerin su kaynaklarından uzaklaşmasına",
        "Göçebe hayata geri dönülmesine"
      ],
      cozum: "Maden işlemeye başlanmasıyla madenin çıkarıldığı ve eritmede kullanılan odunun bol olduğu ağaçlık mekânlar yerleşme olarak tercih edilmiştir (s.122).",
      fc: ["Madenciliğin yerleşmeye etkisi nedir?", "Maden yatakları ve yakıt odunu bulunan alanlarda yerleşme kurulması."]
    },
    {
      bi: 0,
      metin: "Sanayi Devrimi'nin yerleşmeler üzerindeki etkisi hangisidir?",
      secenekler: [
        "Yerleşmelerin hem nüfus hem alan olarak hızla büyümesi",
        "Yerleşmelerin kırsal alanlara dağılması",
        "Şehirlerde iş imkânlarının azalması",
        "Metropollerin ortadan kalkması"
      ],
      cozum: "Sanayi Devrimi ile kurulan tesisler yerleşmelerin hem nüfus miktarı hem alansal açıdan büyümesini hızlandırmıştır (s.122).",
      fc: ["Sanayileşmenin şehirleşmeye etkisi nedir?", "İş imkânı yaratarak nüfus ve alan bakımından hızlı büyüme sağlar."]
    },
    {
      bi: 0,
      metin: "Yerleşmeyi sınırlandıran doğal faktörlerden biri olan gür orman alanları hangi özelliği nedeniyle yerleşmeye elverişli değildir?",
      secenekler: [
        "Ekonomik faaliyetleri ve ulaşımı olumsuz etkilemesi",
        "Topraklarının çok verimli olması",
        "İklimin çok kurak olması",
        "Yer altı suyunun bulunmaması"
      ],
      cozum: "Gür orman alanları ekonomik faaliyetleri ve ulaşımı olumsuz etkilediği için yerleşmeyi sınırlandırır; Amazon ve Kongo havzalarında yerleşme seyrektir (s.123).",
      fc: ["Bitki örtüsünün yerleşmeye etkisi nedir?", "Gür ormanlar ulaşımı ve ekonomik faaliyeti zorlaştırarak yerleşmeyi sınırlar."]
    },
    {
      bi: 0,
      metin: "Yeryüzündeki yerleşmelerin büyük kısmının Kuzey Yarım Küre'de bulunmasının nedeni hangisidir?",
      secenekler: [
        "Karaların kapladığı alanın Kuzey Yarım Küre'de daha fazla olması",
        "Kuzey Yarım Küre'de yükseltinin sıfır olması",
        "Güney Yarım Küre'de hiç su kaynağı bulunmaması",
        "Kuzey Yarım Küre'de bitki örtüsünün hiç bulunmaması"
      ],
      cozum: "Yeryüzünün yaklaşık dörtte üçü sularla kaplıdır; karaların alanı Kuzey Yarım Küre'de daha fazla olduğu için yerleşmelerin büyük kısmı buradadır (s.123).",
      fc: ["Kara ve deniz dağılışı nedir?", "Karaların Kuzey Yarım Küre'de daha geniş yer tutmasıdır."]
    },
    {
      bi: 1,
      metin: "Türkiye'de kır yerleşmesi sayılabilmesi için nüfusun üst sınırı kaçtır?",
      secenekler: [
        "10 bin",
        "2 bin",
        "20 bin",
        "100 bin"
      ],
      cozum: "Yaşayanların ağırlıklı olarak tarım ve hayvancılıkla geçindiği, nüfusu 10 binden az kırsal yerleşmeler kır yerleşmesidir (s.125).",
      fc: ["Kır yerleşmesi nedir?", "Nüfusu 10 binden az, geçimi tarım ve hayvancılığa dayanan yerleşme."]
    },
    {
      bi: 1,
      metin: "Türkiye'de nüfusu 2.000 ila 10.000 arasında olan kır yerleşmesine ne ad verilir?",
      secenekler: [
        "Kasaba",
        "Köy",
        "Mezra",
        "Metropol"
      ],
      cozum: "Kır yerleşmelerinden nüfusu 2.000 ila 10.000 arası olanına kasaba, 2.000'in altında olanına köy denir (s.125).",
      fc: ["Kasaba nedir?", "Nüfusu 2.000 ile 10.000 arasında olan kır yerleşmesi."]
    },
    {
      bi: 1,
      metin: "Yayla, oba ve kom gibi köy altı yerleşmelerinin ortak özelliği hangisidir?",
      secenekler: [
        "Yılın belirli dönemlerinde geçici olarak kullanılmaları",
        "Yıl boyu sürekli yerleşme olmaları",
        "İdari olarak ilçeye bağlı olmaları",
        "Nüfuslarının 20 binin üzerinde olması"
      ],
      cozum: "Mahalle ve mezra yıl boyu yaşanan kır yerleşmeleriyken yayla, oba ve kom yılın belirli dönemlerinde kullanılan geçici köy altı yerleşmeleridir (s.125).",
      fc: ["Geçici köy altı yerleşmesi nedir?", "Yılın belirli dönemlerinde kullanılan yayla, oba ve kom gibi yerleşme."]
    },
    {
      bi: 1,
      metin: "Türkiye'de nüfusu 100 bin ila 1 milyon arasında olan şehirler hangi sınıfa girer?",
      secenekler: [
        "Büyük şehir",
        "Orta şehir",
        "Küçük şehir",
        "Metropol"
      ],
      cozum: "Şehirler nüfusa göre küçük (20 bine kadar), orta (20-100 bin), büyük (100 bin-1 milyon) ve metropol (1 milyon üzeri) olarak sınıflandırılır (s.125).",
      fc: ["Metropol nedir?", "Nüfusu 1 milyonun üzerinde olan şehir yerleşmesi."]
    },
    {
      bi: 1,
      metin: "Türkiye'de yerleşmelerin yoğunluğu hangi yönde azalır?",
      secenekler: [
        "Batıdan doğuya ve kıyıdan iç kesimlere doğru",
        "Doğudan batıya ve iç kesimlerden kıyıya doğru",
        "Kuzeyden güneye ve kıyıdan iç kesimlere doğru",
        "Güneyden kuzeye ve iç kesimlerden kıyıya doğru"
      ],
      cozum: "Türkiye'de yerleşmelerin yoğunluğu batıdan doğuya ve kıyıdan iç kesimlere gidildikçe genel olarak azalır (s.126).",
      fc: ["Türkiye'de yerleşme dağılışı nedir?", "Kıyı ve batı kesimlerinde yoğun, iç ve doğu kesimlerde seyrektir."]
    },
    {
      bi: 1,
      metin: "Salda Gölü çevresinde kurulacak yerleşmelerin doğal yaşam alanına zarar vermesini önlemek için hangi adım atılmıştır?",
      secenekler: [
        "Koruma Amaçlı İmar Planları onaylanarak yürürlüğe girmiştir",
        "Göl çevresindeki tüm yerleşmeler kaldırılmıştır",
        "Gölün suyu tarımsal sulamaya açılmıştır",
        "Göl alanı turizm yatırımlarına tahsis edilmiştir"
      ],
      cozum: "Salda Gölü çevresinde I. ve II. derece doğal sit alanlarına ilişkin Koruma Amaçlı Nazım ve Uygulama İmar Planları onaylanmıştır (s.129).",
      fc: ["Koruma amaçlı imar planı nedir?", "Hassas doğal alanlarda yapılaşmayı sınırlandıran plan."]
    }
  ]
});

/* ------------------------------------------------------- 4.2 */
yazKonu({
  konu_id: "cogr_10_u04_k02",
  ders: DERS, tema: 4, tema_adi: "Beşerî Sistemler ve Süreçler",
  baslik: "4.2 Yerleşmelerin Fonksiyonları",
  kazanim: "Yerleşmeleri gelişiminde etkili olan fonksiyonlara göre sınıflandırır.",
  kaynak: kaynak("130-135"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Yerleşme fonksiyonlarını örneklerle açıklar.",
    "Türkiye'nin idari yapısı ile fonksiyon değişimini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir yerleşmenin kurulup varlığını sürdürmesinde rol oynayan ekonomik, sosyal ve kültürel amaçlı etkenler o yerleşmenin neyini oluşturur?",
      secenekler: [
        "Fonksiyonlarını",
        "Nüfus yoğunluğunu",
        "Yerleşme tipini",
        "Mekânsal verisini"
      ],
      cozum: "Yerleşmenin oluşmasını ve varlığını sürdürmesini sağlayan ekonomik, sosyal ve kültürel faktörler o yerleşmenin fonksiyonlarıdır (s.130).",
      fc: ["Yerleşme fonksiyonu nedir?", "Yerleşmenin varlığını sürdürmesini sağlayan ekonomik, sosyal ve kültürel işlevler."]
    },
    {
      bi: 0,
      metin: "Tarım, hayvancılık, balıkçılık ve ormancılık gibi faaliyetler hangi fonksiyona karşılık gelir?",
      secenekler: [
        "Tarım fonksiyonu",
        "Sanayi fonksiyonu",
        "Ticaret fonksiyonu",
        "Yönetim fonksiyonu"
      ],
      cozum: "Tarım, hayvancılık, balıkçılık ve ormancılık birincil ekonomik faaliyetler olup tarım fonksiyonu başlığında değerlendirilir (s.130).",
      fc: ["Tarım fonksiyonu nedir?", "Yerleşmenin geçiminin tarım, hayvancılık, balıkçılık ve ormancılığa dayanması."]
    },
    {
      bi: 0,
      metin: "Gelişiminde madencilik fonksiyonunun belirleyici olduğu yerleşmeler arasında hangisi yer alır?",
      secenekler: [
        "Afşin-Elbistan (Kahramanmaraş)",
        "Salihli (Manisa)",
        "İnegöl (Bursa)",
        "Kemer (Antalya)"
      ],
      cozum: "Johannesburg, Essen, Ereğli, Afşin-Elbistan ve Maden gelişiminde madenciliğin etkili olduğu yerleşmelerdendir (s.130).",
      fc: ["Madencilik fonksiyonu nedir?", "Yerleşmenin gelişiminde maden çıkarma ve işletmenin belirleyici olması."]
    },
    {
      bi: 0,
      metin: "Ham maddelerin atölye ve fabrikalarda işlenerek yeni ürüne dönüştürülmesi hangi fonksiyona örnektir?",
      secenekler: [
        "Sanayi fonksiyonu",
        "Tarım fonksiyonu",
        "Turizm fonksiyonu",
        "Sağlık fonksiyonu"
      ],
      cozum: "Ham madde ve ara malların bilgi, beceri ve teknolojiyle yeni ürüne dönüştürülmesi sanayi fonksiyonudur (s.130).",
      fc: ["Sanayi fonksiyonu nedir?", "Ham maddenin fabrikada işlenerek yeni ürüne dönüştürülmesi."]
    },
    {
      bi: 0,
      metin: "Yönetim fonksiyonuyla öne çıkan yerleşmeler genellikle hangi özelliğe sahiptir?",
      secenekler: [
        "Ülkelerin başkenti olmaları",
        "Kıyı turizminin merkezi olmaları",
        "Maden yataklarının üzerinde kurulmuş olmaları",
        "Nüfuslarının 2.000'in altında olması"
      ],
      cozum: "Yönetim fonksiyonuna sahip yerleşmeler genellikle ülkelerin başkentidir; Washington, Londra, Moskova ve Ankara bu fonksiyona örnektir (s.131).",
      fc: ["Yönetim fonksiyonu nedir?", "Meclis, bakanlık gibi idari birimlerde yürütülen işlerin yerleşmeye egemen olması."]
    },
    {
      bi: 0,
      metin: "Türkiye'de kamu hizmetlerinin her yere ulaştırılması amacıyla oluşturulan idari yapı hangi iki gruba ayrılır?",
      secenekler: [
        "Merkezî yönetim ve yerel yönetim",
        "Köy ve kasaba yönetimi",
        "İl ve bölge yönetimi",
        "Askerî ve sivil yönetim"
      ],
      cozum: "İdari fonksiyona sahip birimler merkezî yönetim ve yerel (mahallî) yönetim olarak ikiye ayrılır (s.131).",
      fc: ["Merkezî yönetim nedir?", "Başkent ve taşra teşkilatından oluşan ülke yönetimi."]
    },
    {
      bi: 1,
      metin: "Türkiye'de merkezî yönetimin en büyük idari birimi hangisidir?",
      secenekler: [
        "İl",
        "İlçe",
        "Köy",
        "Belediye"
      ],
      cozum: "İller merkezî yönetimin temel örgütlenme birimi olup yönetim sistemi içinde en büyük idari birimdir; ilçeler il yönetiminin alt kademesidir (s.131).",
      fc: ["İl nedir?", "Merkezî yönetimin en büyük idari birimi."]
    },
    {
      bi: 1,
      metin: "Türkiye'de en küçük yerel yönetim birimi hangisidir?",
      secenekler: [
        "Köy",
        "İl özel idaresi",
        "Belediye",
        "İlçe"
      ],
      cozum: "Yerel yönetim birimleri il özel idaresi, belediyeler ve köylerdir; bunlardan en küçüğü köydür (s.131).",
      fc: ["Yerel yönetim birimleri nedir?", "Seçmenlerce seçilen il özel idaresi, belediye ve köy yönetimleri."]
    },
    {
      bi: 1,
      metin: "Köy yerleşmesinin tanımında yer alan ölçüt hangisidir?",
      secenekler: [
        "Ortak malları bulunması ve nüfusu iki binden az olması",
        "Nüfusunun 100 binin üzerinde olması ve belediye teşkilatı bulunması",
        "Yalnızca sanayi tesisleri ile iş yerlerinden oluşması",
        "Sınırları içinde üniversite ve hastane bulunması"
      ],
      cozum: "Köy; cami, okul, otlak, yaylak gibi ortak malları bulunan, evleri toplu veya dağınık, nüfusu iki binden az yerleşmedir (s.131).",
      fc: ["Köy nedir?", "Ortak malları bulunan, nüfusu iki binden az olan yerleşme."]
    },
    {
      bi: 1,
      metin: "Kuruluşunda tarım fonksiyonu ön planda olan Adana'nın zamanla sanayi ve ticaret merkezine dönüşmesi hangi durumu gösterir?",
      secenekler: [
        "Yerleşmenin fonksiyonlarının zaman içinde değişebildiğini",
        "Fonksiyonların hiç değişmediğini",
        "Yerleşmelerin yalnızca tek fonksiyona sahip olabildiğini",
        "Tarım fonksiyonunun sanayiyi engellediğini"
      ],
      cozum: "Yerleşmelerin kuruluşunda ve gelişiminde belirleyici olan fonksiyonlar zaman içinde değişebilir ya da yenileri eklenebilir; Adana bunun örneğidir (s.132).",
      fc: ["Fonksiyon değişimi nedir?", "Yerleşmenin baskın işlevinin zamanla değişmesi veya yeni işlevler eklenmesi."]
    },
    {
      bi: 1,
      metin: "Eskişehir'de üniversiteler ve turizm-rekreasyon alanlarının varlığı hangi fonksiyonun hâkim olmasını sağlamıştır?",
      secenekler: [
        "Eğitim ve kültür fonksiyonu",
        "Madencilik fonksiyonu",
        "Askerî fonksiyon",
        "Tarım fonksiyonu"
      ],
      cozum: "Eskişehir'deki üniversiteler ile turizm rekreasyon alanları eğitim ve kültür fonksiyonunun hâkim olmasını sağlamıştır (s.132).",
      fc: ["Eğitim ve kültür fonksiyonu nedir?", "Üniversite, müze ve kültürel faaliyetlerin yerleşmeye egemen olması."]
    }
  ]
});
