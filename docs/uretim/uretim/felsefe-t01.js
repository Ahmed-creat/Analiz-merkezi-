#!/usr/bin/env node
/* Felsefe 10 · Ünite 1-2 havuzları (Felsefenin Doğası; Mantık ve Argümantasyon).
   Kaynak: MEB Felsefe 10 ders kitabı (2025). JSON sayfa = basılı sayfa + 1. */
"use strict";

const { yaz } = require("../yazicilar/yaz.js");

const KAYNAK = "MEB Felsefe 10 ders kitabı (2025)";

/* ---------------------------------------------------------------- 1.1 */
yaz("fel_10_t01_c01", KAYNAK + ", s.15-39", [
  {
    si: 0,
    metin: "“Philosophia” terimini ilk kullanan ve bilgeliğin tanrılara özgü olduğunu savunan filozof aşağıdakilerden hangisidir?",
    secenekler: ["Pythagoras", "Thales", "Sokrates", "Platon"],
    dogru: 0,
    cozum: "Pythagoras, “bilgelik sevgisi” anlamına gelen philosophia kavramını kullanmış ve bilgeliğin ancak tanrılara özgü olabileceğini söylemiştir.",
    fc: ["Philosophia kavramının anlamı nedir?", "Yunanca bilgelik sevgisi, hikmet arayışı anlamına gelen felsefe terimidir."]
  },
  {
    si: 0,
    metin: "Felsefeyi “yolda olmak” biçiminde tanımlayan 20. yüzyıl filozofu hangisidir?",
    secenekler: ["Karl Jaspers", "Nurettin Topçu", "Hilmi Ziya Ülken", "Ernst von Aster"],
    dogru: 0,
    cozum: "Karl Jaspers felsefeyi kesin bir sonuç değil, sürekli bir arayış olarak görmüş ve “Felsefe yolda olmaktır.” demiştir.",
    fc: ["Jaspers’in felsefe tanımı nedir?", "Felsefeyi bitmeyen bir arayış, yani “yolda olmak” olarak tanımlar."]
  },
  {
    si: 1,
    metin: "Felsefi düşüncenin, doğru kabul edilen bilgileri bile gerekçeleriyle yeniden sınaması hangi özelliğine işaret eder?",
    secenekler: ["Eleştirel olma", "Tutarlı olma", "Evrensel olma", "Rasyonel olma"],
    dogru: 0,
    cozum: "Eleştirel düşünme, hiçbir yargıyı sorgulanamaz saymaz; yerleşik kabulleri gerekçeleriyle yeniden değerlendirir.",
    fc: ["Eleştirel olmanın tanımı nedir?", "Yerleşik kabulleri ve yargıları gerekçeleriyle yeniden sınama tutumudur."]
  },
  {
    si: 1,
    metin: "Felsefi düşüncenin “yığılımlı ilerleme” özelliği aşağıdakilerden hangisini anlatır?",
    secenekler: [
      "Önceki görüşlerin birikerek sonraki düşüncelere temel olmasını",
      "Her filozofun öncekini bütünüyle reddetmesini",
      "Felsefenin kesin sonuçlara ulaşmasını",
      "Düşüncelerin birbirinden bağımsız doğmasını"
    ],
    dogru: 0,
    cozum: "Yığılımlı ilerlemede felsefe, önceki görüşlerin birikimi üzerine yeni sorgulamalar ekleyerek ilerler; düşünce mirası aktarılır.",
    fc: ["Yığılımlı ilerlemenin tanımı nedir?", "Önceki düşüncelerin birikerek sonraki görüşlere temel oluşturmasıdır."]
  },
  {
    si: 4,
    metin: "Felsefe, Orta Çağ’da dinî bakış açısıyla evreni anlamlandırmış; Rönesans’la birlikte aklı temel alarak bilimlerin gelişmesine katkı sunmuştur. Bu durum felsefenin hangi işlevini gösterir?",
    secenekler: [
      "Toplumsal gelişmeye yön verme işlevini",
      "Yalnızca bireysel avunma sağlama işlevini",
      "Bilimsel bilgiyi yok sayma işlevini",
      "Toplumu değişmez kılma işlevini"
    ],
    dogru: 0,
    cozum: "Felsefe, dönemlerin düşünme biçimini dönüştürerek bilimlerin ve toplumların gelişmesine katkı sağlar; bu da toplumsal işlevidir.",
    fc: ["Felsefenin toplumsal işlevi nedir?", "Dönemin düşünme biçimini dönüştürerek bilimlerin ve toplumun gelişmesine katkı sağlamasıdır."]
  },
  {
    si: 2,
    metin: "Bir düşünür, “Sokak kapısı açık mı?” sorusu ile “Şuur nedir?” sorusunu karşılaştırarak felsefi soruların pratik sorulardan ayrıldığını savunur. Bu düşünüre göre felsefi soruyu ayırt eden yön nedir?",
    secenekler: [
      "Yanıtının bir eylemle doğrulanamaması",
      "Yalnızca uzmanlarca sorulabilmesi",
      "Günlük yaşamdan tümüyle kopuk olması",
      "Yanıtının sayısal verilerle ölçülmesi"
    ],
    dogru: 0,
    cozum: "Metne göre felsefi soru eylemlerden doğmaz ve eylemle giderilemez; yanıtı pratik bir işlemle sınanamaz.",
    fc: ["Felsefi sorunun pratik sorulardan farkı nedir?", "Yanıtının bir eylemle veya yaptırmayla karşılanamamasıdır."]
  },
  {
    si: 2,
    metin: "Felsefi soruların yanıtının deneyle kesin olarak kapatılamaması, bu soruların hangi niteliğinden kaynaklanır?",
    secenekler: ["Kuramsal niteliğinden", "Deneysel niteliğinden", "Dinsel içeriğinden", "Sayısal yapısından"],
    dogru: 0,
    cozum: "Felsefi sorular olgusal dünyaya ilişkin deneyle sınanabilir önermeler değil, anlam ve temellendirme üzerine kurulu kuramsal sorulardır.",
    fc: ["Felsefi soruların niteliği nedir?", "Kuramsal ve temellendirmeye dayalı sorulardır; deneyle kapatılamaz."]
  },
  {
    si: 3,
    metin: "Bilimin başlangıçta felsefenin bir parçası olarak doğması ve 19. yüzyılda bağımsız bir disipline dönüşmesi neyi gösterir?",
    secenekler: [
      "Felsefenin bilimlerin doğuşuna zemin hazırladığını",
      "Bilimin felsefeyi gereksiz kıldığını",
      "Felsefenin deney yöntemini kullandığını",
      "Bilimin metafizikle özdeşleştiğini"
    ],
    dogru: 0,
    cozum: "Bilim, felsefenin sorduğu sorular ve geliştirdiği yöntem tartışmaları içinden doğmuş, sonra kendi yöntemiyle ayrışmıştır.",
    fc: ["Bilim ve felsefenin tarihsel ilişkisi nedir?", "Bilim felsefenin içinden doğmuş, zamanla kendi yöntemiyle bağımsızlaşmıştır."]
  },
  {
    si: 3,
    metin: "Felsefenin din karşısındaki tutumu, dinî öğretilerin sorgusuz kabulüne karşılık nasıl tanımlanabilir?",
    secenekler: [
      "İnanç önermelerini de akla dayalı gerekçelerle tartışmaya açması",
      "Dini bütünüyle yok sayması",
      "Dini bilimsel yöntemle kanıtlaması",
      "İnancı yalnızca duyguya indirgemesi"
    ],
    dogru: 0,
    cozum: "Felsefe, dinî öğretilerin içeriğini reddetmek yerine onları akıl ve gerekçe düzleminde tartışmaya açar.",
    fc: ["Felsefenin dinle ilişkisi nedir?", "Dinî önermeleri akla dayalı gerekçelerle sorgulama ve tartışma ilişkisidir."]
  },
  {
    si: 4,
    metin: "Felsefi düşünmenin bireylere katkısı olarak aşağıdakilerden hangisi gösterilebilir?",
    secenekler: [
      "Sorunlara alternatif çözümler üretme becerisi kazandırması",
      "Bütün sorulara kesin yanıtlar vermesi",
      "Bireyin inançlarını tümüyle değiştirmesi",
      "Yalnızca uzmanlık bilgisi kazandırması"
    ],
    dogru: 0,
    cozum: "Araştırmalar felsefi düşünmenin eleştirel düşünme, akıl yürütme ve alternatif çözüm üretme gibi becerileri geliştirdiğini gösterir.",
    fc: ["Felsefenin bireysel işlevi nedir?", "Eleştirel düşünme, akıl yürütme ve alternatif çözüm üretme becerileri kazandırmasıdır."]
  }
]);

/* ---------------------------------------------------------------- 2.1 */
yaz("fel_10_t02_c01", KAYNAK + ", s.47-49", [
  {
    si: 0,
    metin: "Türkçede akrabalık ilişkileri için çok sayıda ayrı sözcük bulunmasına karşın İngilizcede bazı ilişkilerin tek sözcükle karşılanması neyi gösterir?",
    secenekler: [
      "Dilin kültürel deneyimi sınıflandırdığını",
      "Bütün dillerin aynı yapıda olduğunu",
      "Düşünmenin dilden tümüyle bağımsız olduğunu",
      "Sözcük sayısının düşünmeyi hiç etkilemediğini"
    ],
    dogru: 0,
    cozum: "Bir toplumun dilindeki ayrımlar, o toplumun deneyimini ve dikkatini hangi konulara yönelttiğini yansıtır.",
    fc: ["Dilin kültürle ilişkisi nedir?", "Dil, toplumun deneyimini sınıflandırarak kültürel ayrımları görünür kılar."]
  },
  {
    si: 0,
    metin: "Bazı düşünürlerin düşünmeyi “sessiz konuşma” olarak nitelemesi hangi ilişkiye dayanır?",
    secenekler: [
      "Düşünme ile dil arasındaki iç içeliğe",
      "Düşünmenin duygulardan oluşmasına",
      "Dilin yalnızca yazıyla var olmasına",
      "Konuşmanın düşünmeyi engellemesine"
    ],
    dogru: 0,
    cozum: "Düşünmenin sessiz konuşma sayılması, zihinsel süreçlerin dilsel yapılarla iç içe yürüdüğü görüşüne dayanır.",
    fc: ["Düşünmenin sessiz konuşma sayılmasının anlamı nedir?", "Zihinsel süreçlerin dilsel yapılarla birlikte yürüdüğünü anlatır."]
  },
  {
    si: 0,
    metin: "Dil ile düşünmenin birbirini etkilediğini ancak birinin diğerine indirgenemeyeceğini savunan görüş hangi yaklaşımı yansıtır?",
    secenekler: [
      "Karşılıklı etkileşim yaklaşımını",
      "Dil-düşünce özdeşliğini",
      "Dilin düşünceden bağımsızlığını",
      "Düşünmenin dil tarafından yok sayılmasını"
    ],
    dogru: 0,
    cozum: "Bu görüş, iki alanın birbirini beslediğini ama birinin diğerine indirgenemeyeceğini söyleyerek etkileşimci bir tutum alır.",
    fc: ["Etkileşim yaklaşımının özü nedir?", "Dil ve düşünmenin karşılıklı etkileşim içinde olduğu, birinin diğerine indirgenemeyeceğidir."]
  },
  {
    si: 0,
    metin: "Bir dilde yeni teknolojilerle birlikte yeni sözcüklerin türetilmesi, düşünme-dil ilişkisi açısından neyi gösterir?",
    secenekler: [
      "Deneyim değiştikçe dilin de değiştiğini",
      "Dilin değişmez bir yapı olduğunu",
      "Düşünmenin dilden önce var olduğunu",
      "Sözcüklerin düşünmeyi hiç etkilemediğini"
    ],
    dogru: 0,
    cozum: "Yeni deneyim alanları yeni kavramları ve sözcükleri doğurur; bu da dilin yaşayan ve düşünmeyle birlikte değişen bir yapı olduğunu gösterir.",
    fc: ["Dilin değişkenliğinin nedeni nedir?", "Yeni deneyimlerin yeni kavram ve sözcükler doğurduğunu, dilin yaşayan bir yapı olduğunu."]
  },
  {
    si: 0,
    metin: "Dilin sözcük dağarcığının düşünme biçimini sınırlandırdığı iddiası hangi sonuca götürür?",
    secenekler: [
      "Yeni kavramlar öğrenildikçe düşünme alanının genişlediğine",
      "Düşünmenin dil öğrenmeden gelişemeyeceğine",
      "Sözcük sayısının düşünmeyi hiç etkilemediğine",
      "Dilin yalnızca iletişim sağladığına"
    ],
    dogru: 0,
    cozum: "Dil düşünmeyi sınırlıyorsa, yeni kavramların öğrenilmesi düşünülebilir alanı da genişletir; bu da dil eğitiminin felsefi önemini gösterir.",
    fc: ["Dil-düşünce sınırı tartışmasının pratik sonucu nedir?", "Yeni kavramlar öğrenildikçe düşünme alanının genişlemesidir."]
  },
  {
    si: 1,
    metin: "Düşünme ve dil ilişkisine dair farklı görüşleri bir araya getiren bir öğrencinin uyumlu bir bütün oluşturması için ne yapması gerekir?",
    secenekler: [
      "Görüşlerin ortak ve ayrılan yönlerini karşılaştırması",
      "Yalnızca ilk okuduğu görüşü benimsemesi",
      "Görüşleri birbirine karıştırması",
      "Kaynakları kullanmadan sonuca varması"
    ],
    dogru: 0,
    cozum: "Bütünlüklü bir yapı kurmak için görüşlerin hangi noktalarda örtüştüğü ve hangi noktalarda ayrıldığı sistemli biçimde karşılaştırılır.",
    fc: ["Görüşleri bütünleştirmenin yolu nedir?", "Ortak ve ayrılan yönleri karşılaştırarak tutarlı bir çerçeve kurmaktır."]
  },
  {
    si: 1,
    metin: "“Dil düşünceyi belirler” ile “düşünce dili belirler” savlarını uzlaştıran bir çözümleme hangi ilkeye dayanır?",
    secenekler: [
      "Karşılıklı etkileşim ilkesine",
      "Tek yönlü nedensellik ilkesine",
      "Düşüncenin dil karşısında yok sayılmasına",
      "Dilin yalnızca ses olayı sayılmasına"
    ],
    dogru: 0,
    cozum: "İki savı birlikte korumanın yolu, dil ile düşünmenin karşılıklı olarak birbirini etkilediğini kabul etmektir.",
    fc: ["İki savı uzlaştıran ilke nedir?", "Dil ve düşünmenin karşılıklı etkileşim içinde olduğu ilkesidir."]
  },
  {
    si: 1,
    metin: "Bir metinde dilin düşünceyi sınırladığı savı ile düşünmenin dilden bağımsız olduğu savı birlikte verilmişse bu iki sav arasındaki ilişki nasıl adlandırılır?",
    secenekler: ["Çelişik olma", "Tutarlı olma", "Özdeş olma", "Birbirini destekleme"],
    dogru: 0,
    cozum: "Biri dilin belirleyici olduğunu, diğeri düşünmenin dilden bağımsız olduğunu söylediği için savlar birbiriyle çelişir.",
    fc: ["Çelişik savların özelliği nedir?", "Aynı konuda birbirini dışlayan yargılar ileri sürmeleridir."]
  },
  {
    si: 1,
    metin: "Düşünme ve dil üzerine farklı görüşleri sınıflandırarak sunan bir öğrencinin ortaya koyduğu çalışma hangi niteliği taşır?",
    secenekler: [
      "Sistemli ve tutarlı bir düzenleme",
      "Kanıtsız bir derleme",
      "Tek görüşe dayalı bir özet",
      "Kaynakları birbirine karıştıran bir metin"
    ],
    dogru: 0,
    cozum: "Görüşlerin benzerlik ve farklılıklarına göre düzenlenmesi, çalışmaya sistemli ve tutarlı bir yapı kazandırır.",
    fc: ["Sistemli düşünmenin ölçütü nedir?", "Görüşlerin belirli bir düzene ve tutarlılığa göre yapılandırılmasıdır."]
  },
  {
    si: 1,
    metin: "Düşünme ve dil ilişkisi üzerine kurulan bütünlüklü bir açıklamanın tutarlı sayılması için hangi koşul gerekir?",
    secenekler: [
      "Öne sürülen savların birbirini çürütmemesi",
      "Bütün filozofların aynı görüşte olması",
      "Açıklamanın yalnızca örneklerden oluşması",
      "Savların günlük dile dayanması"
    ],
    dogru: 0,
    cozum: "Tutarlılık, açıklamayı oluşturan önermelerin birbiriyle çelişmemesi ve aralarında mantıksal bir bağ bulunmasıyla sağlanır.",
    fc: ["Tutarlılığın koşulu nedir?", "Önermelerin birbiriyle çelişmemesi ve mantıksal bağ taşımasıdır."]
  }
]);

/* ---------------------------------------------------------------- 2.2 */
yaz("fel_10_t02_c02", KAYNAK + ", s.50-61", [
  {
    si: 0,
    metin: "“Bütün insanlar ölümlüdür; Ali insan olduğuna göre Ali de ölümlüdür.” akıl yürütmesi hangi akıl ilkesine örnektir?",
    secenekler: ["Özdeşlik ilkesi", "Çelişmezlik ilkesi", "Yeter-sebep ilkesi", "Üçüncü hâlin imkânsızlığı"],
    dogru: 0,
    cozum: "Özdeşlik ilkesi, bir terime başta verilen anlamın akıl yürütme boyunca korunmasını gerektirir; örnekte “insan” ve “ölümlü” aynı anlamda kullanılmıştır.",
    fc: ["Özdeşlik ilkesinin tanımı nedir?", "Bir terime başta verilen anlamın akıl yürütme boyunca korunması kuralıdır."]
  },
  {
    si: 0,
    metin: "“Evren ya vardır ya yoktur.” önermesi hangi akıl ilkesini örnekler?",
    secenekler: [
      "Üçüncü hâlin imkânsızlığı ilkesini",
      "Özdeşlik ilkesini",
      "Yeter-sebep ilkesini",
      "Çelişmezlik ilkesini"
    ],
    dogru: 0,
    cozum: "Üçüncü hâlin imkânsızlığı ilkesine göre bir önerme ya doğru ya yanlıştır; üçüncü bir seçenek bulunmaz.",
    fc: ["Üçüncü hâlin imkânsızlığı nedir?", "Bir önermenin ya doğru ya yanlış olması, üçüncü seçeneğin bulunmamasıdır."]
  },
  {
    si: 0,
    metin: "Bir akıl yürütmede sonucun öncüllerden zorunlu olarak çıkması hangi kavramla ifade edilir?",
    secenekler: ["Geçerlilik", "Doğruluk", "Tutarlılık", "Safsata"],
    dogru: 0,
    cozum: "Geçerlilik, sonucun öncüllerden zorunlu olarak çıkmasıdır; bu durum öncüllerin doğru olmasından ayrı bir özelliktir.",
    fc: ["Geçerliliğin tanımı nedir?", "Sonucun öncüllerden zorunlu olarak çıkması durumudur."]
  },
  {
    si: 1,
    metin: "“Hava soğudu, yollar buz tuttu, bu yüzden kaza riski arttı.” ifadesinde sonuç önermesi hangisidir?",
    secenekler: [
      "Kaza riskinin artması",
      "Havanın soğuması",
      "Yolların buz tutması",
      "Havanın soğuması ve yolların buz tutması"
    ],
    dogru: 0,
    cozum: "İfadede ilk iki önerme gerekçe, “kaza riski arttı” yargısı ise bu gerekçelerle varılan sonuçtur.",
    fc: ["Sonuç önermesinin tanımı nedir?", "Öncüllerle kanıtlanan, onlardan çıkarılan önermedir."]
  },
  {
    si: 1,
    metin: "“Bütün öğrenciler sınava girdi. Ayşe öğrencidir. O hâlde Ayşe de sınava girdi.” argümanında öncüller hangileridir?",
    secenekler: [
      "İlk iki önerme",
      "Son önerme",
      "İkinci ve üçüncü önerme",
      "Yalnızca birinci önerme"
    ],
    dogru: 0,
    cozum: "Argümanda sonucu desteklemek için öne sürülen ilk iki önerme öncül, “Ayşe de sınava girdi” önermesi sonuçtur.",
    fc: ["Öncül nedir?", "Bir sonucu desteklemek için öne sürülen gerekçe önermesidir."]
  },
  {
    si: 1,
    metin: "Bir tartışmada konuyla ilgisi olmayan cümlelerin ayıklanması neden gereklidir?",
    secenekler: [
      "Argümanın mantıksal yapısının görünür kılınması için",
      "Konuşmayı uzatmak için",
      "Karşı tarafı yanıltmak için",
      "Öncülleri çoğaltmak için"
    ],
    dogru: 0,
    cozum: "İlgisiz ifadeler ayıklandığında öncüller ile sonuç arasındaki bağ belirginleşir ve argüman denetlenebilir hâle gelir.",
    fc: ["Argümanı standart biçime sokmanın amacı nedir?", "Öncül ve sonuç ilişkisini görünür ve denetlenebilir kılmaktır."]
  },
  {
    si: 2,
    metin: "“Çoğu insan sabah erken kalkmanın daha verimli olduğunu söylüyor, bence de öyle.” ifadesini nesnel biçimde yeniden yazmak için ne yapılmalıdır?",
    secenekler: [
      "Kişisel yargıyı kanıta dayalı bir ifadeye dönüştürmek",
      "İfadeyi olduğu gibi yinelemek",
      "İfadeyi soruya çevirmek",
      "İfadedeki özneyi değiştirmek"
    ],
    dogru: 0,
    cozum: "Nesnel yeniden ifade, kişisel kanıyı korumak yerine iddianın hangi veriye dayandığını belirterek anlamı güvenilir kılar.",
    fc: ["Nesnel yeniden ifade nedir?", "Kişisel yargıları kanıt ve gerekçeye bağlayarak anlamı koruyan yeniden yazımdır."]
  },
  {
    si: 2,
    metin: "Bir metindeki savı kendi cümleleriyle yeniden ifade ederken anlamın korunması için hangi ölçüte dikkat edilir?",
    secenekler: [
      "Terimlerin aynı anlamda kullanılması",
      "Cümlelerin birebir kopyalanması",
      "Metnin tamamen kısaltılması",
      "Yazarın adının belirtilmemesi"
    ],
    dogru: 0,
    cozum: "Anlamı değiştirmeden yeniden ifade, kavramların aynı kapsamda ve aynı anlamda kullanılmasını gerektirir.",
    fc: ["Anlamı koruyan yeniden ifadenin koşulu nedir?", "Kavramların aynı anlamda ve aynı kapsamda kullanılmasıdır."]
  },
  {
    si: 2,
    metin: "Günlük dildeki bir konuşmayı, öncüllerin alt alta yazıldığı ve sonucun bir çizgiyle ayrıldığı standart argüman biçimine dönüştürmenin yararı nedir?",
    secenekler: [
      "Gizli kalan öncüllerin görünür hâle gelmesi",
      "Konuşmanın anlamının değişmesi",
      "Sonucun her zaman doğru çıkması",
      "Öncüllerin sayısının sıfıra inmesi"
    ],
    dogru: 0,
    cozum: "Standart biçim, öncülleri alt alta yazdığı için söylenmemiş varsayımlar ortaya çıkar ve argüman denetlenebilir olur.",
    fc: ["Biçimsel argüman dilinin tanımı nedir?", "Öncüllerin alt alta yazılıp çizgi altına sonucun yazıldığı mantıksal düzendir."]
  },
  {
    si: 2,
    metin: "Aynı düşünceyi farklı sözcüklerle anlatan iki cümlenin anlamca eşdeğer sayılması için hangi koşul gerekir?",
    secenekler: [
      "Doğruluk değerlerinin ve kapsamının korunması",
      "Sözcük sayılarının eşit olması",
      "İki cümlenin de soru olması",
      "Cümlelerin aynı uzunlukta olması"
    ],
    dogru: 0,
    cozum: "Anlam eşdeğerliği, iki ifadenin aynı doğruluk değerini taşıması ve aynı olgu alanını kapsamasıyla sağlanır.",
    fc: ["Anlam eşdeğerliğinin koşulu nedir?", "İki ifadenin aynı doğruluk değerini taşıması ve aynı kapsama sahip olmasıdır."]
  }
]);
