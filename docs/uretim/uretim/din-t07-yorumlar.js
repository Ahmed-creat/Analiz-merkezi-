#!/usr/bin/env node
/* ============================================================
   Din Kültürü 10 · 5. ÜNİTE — 5.2 alt başlıkları
   ------------------------------------------------------------
   Ders kitabı içindekileri 5.2'yi iki alt başlığa ayırır:
     5.2.1 Ehlisünnet
     5.2.2 Şia
   "5.2 İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar"
   havuzu genel/fıkhi yorumları taşımaya devam eder; bu iki havuz
   yalnızca ilgili alt başlığın sorularını içerir.

   Kaynak: MEB Din Kültürü ve Ahlak Bilgisi 10 ders kitabı (2025),
   s. 150-158.
   Kullanım: node docs/uretim/uretim/din-t07-yorumlar.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Din Kültürü";
const DOSYA = "2025-2026.10.Sinif.Din.Kulturu.Ve.Ahlak.Bigisi.Ders.Kitabi.-MEB.pdf";
const TEMA_ADI = "İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar";
const kaynak = s => "MEB Din Kültürü ve Ahlak Bilgisi 10 ders kitabı (2025), s." + s;

/* ------------------------------------------------------------ 5.2.1 */
yazKonu({
  konu_id: "din_10_u05_k03",
  ders: DERS,
  tema: 5,
  tema_adi: TEMA_ADI,
  baslik: "5.2.1 Ehlisünnet",
  kazanim: "Ehlisünnet kavramını ve bu çizgide oluşan itikadi ve fıkhi yorumları açıklar.",
  kaynak: kaynak("153-156"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Ehlisünnet kavramını ve dayanaklarını açıklar.",
    "Ehlisünnet çizgisindeki itikadi ve fıkhi yorumları ayırt eder."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Hz. Peygamber'in söz, fiil ve onaylarını izleyen, sahabilerin yolunu benimseyen çoğunluk anlayışa verilen ad hangisidir?",
      secenekler: ["Ehlisünnet", "Şia", "Mutezile", "Haricîlik"],
      cozum:
        "Ehlisünnet, Hz. Peygamber'in sünnetine ve sahabilerin yoluna bağlı kalan çoğunluk anlayışın adıdır.",
      fc: ["Ehlisünnet ne demektir?", "Hz. Peygamber'in sünnetine ve sahabilerin yoluna bağlı kalan çoğunluk anlayış."]
    },
    {
      bi: 0,
      metin:
        "Ehlisünnet anlayışının temel dayanakları arasında hangisi yer alır?",
      secenekler: [
        "Kur'an, sünnet ve sahabe icması",
        "Yalnızca akıl",
        "Yalnızca rüya ve keşif",
        "Yalnızca örf ve âdet"
      ],
      cozum:
        "Ehlisünnet, Kur'an ve sünneti esas alır; sahabenin uygulama ve icmasını da önemser.",
      fc: ["Ehlisünnetin temel dayanakları nelerdir?", "Kur'an, sünnet ve sahabe icması."]
    },
    {
      bi: 1,
      metin:
        "Ehlisünnet çizgisindeki itikadi yorumlar arasında aşağıdakilerden hangisi yer alır?",
      secenekler: ["Maturidilik", "Caferilik", "Zeydilik", "İsmaililik"],
      cozum:
        "Maturidilik ve Eş'arilik, Ehlisünnet içinde gelişen itikadi yorumlardır; diğerleri Şia içinde yer alır.",
      fc: ["Ehlisünnetin itikadi yorumları hangileridir?", "Maturidilik ve Eş'arilik."]
    },
    {
      bi: 1,
      metin:
        "Ehlisünnet fıkhında öne çıkan dört mezhep hangisinde birlikte verilmiştir?",
      secenekler: [
        "Hanefilik, Şafiilik, Malikilik, Hanbelilik",
        "Caferilik, Zeydilik, İsmaililik, Nusayrilik",
        "Maturidilik, Eş'arilik, Mutezile, Cehmiyye",
        "Haricîlik, Mutezile, Kaderiyye, Mürcie"
      ],
      cozum:
        "Sünni fıkıh geleneğinde Hanefi, Şafii, Maliki ve Hanbeli mezhepleri esas alınır.",
      fc: ["Ehlisünnetin fıkhi mezhepleri hangileridir?", "Hanefilik, Şafiilik, Malikilik ve Hanbelilik."]
    },
    {
      bi: 0,
      metin:
        "Ehlisünnet anlayışına göre iman ile amel arasındaki ilişki nasıl açıklanır?",
      secenekler: [
        "Amel imanın göstergesidir; imanı besler ama imanın kendisi değildir",
        "Amel olmadan iman da yoktur",
        "İman yalnızca sözle söylenir, amelin etkisi yoktur",
        "Amel imandan üstündür ve imanı geçersiz kılar"
      ],
      cozum:
        "Ehlisünnet, ameli imanın bir göstergesi ve güçlendiricisi sayar; imanı amelden ayrı bir tasdik olarak tanımlar.",
      fc: ["Ehlisünnete göre amel ile iman ilişkisi nedir?", "Amel imanın göstergesidir; imanı besler ancak imanın kendisi değildir."]
    },
    {
      bi: 1,
      metin:
        "Bir öğrenci, Ehlisünnetin \"orta yol\" anlayışını anlatmaktadır. Bu ifade neyi vurgular?",
      secenekler: [
        "Akıl ile nakil arasında denge kurulmasını",
        "Yalnızca naklin kabul edilmesini",
        "Yalnızca aklın esas alınmasını",
        "İbadetlerin terk edilmesini"
      ],
      cozum:
        "Ehlisünnet, aklı ve nakli birlikte değerlendirir; aşırı yorumlardan uzak durmayı esas alır.",
      fc: ["Ehlisünnetin \"orta yol\" anlayışı nedir?", "Akıl ile nakil arasında denge kurmak, aşırı yorumlardan uzak durmak."]
    },
    {
      bi: 0,
      metin:
        "Ehlisünnet kavramındaki \"sünnet\" hangi anlama gelir?",
      secenekler: [
        "Hz. Peygamber'in söz, fiil ve onayları",
        "Toplumun örf ve âdetleri",
        "Devlet yönetimi kuralları",
        "Ticari sözleşme biçimleri"
      ],
      cozum:
        "Sünnet, Hz. Peygamber'in sözleri, davranışları ve onaylarıdır; Ehlisünnet bu yolu izleyenleri ifade eder.",
      fc: ["Sünnet ne demektir?", "Hz. Peygamber'in söz, fiil ve onayları."]
    },
    {
      bi: 1,
      metin:
        "Ehlisünnet fıkhında hüküm çıkarma sırası genellikle hangisidir?",
      secenekler: [
        "Kur'an, sünnet, icma, kıyas",
        "Kıyas, örf, icma, Kur'an",
        "Yalnızca örf ve âdet",
        "Yalnızca kişisel görüş"
      ],
      cozum:
        "Sünni fıkıh usulünde temel kaynaklar Kur'an ve sünnet; ardından icma ve kıyas gelir.",
      fc: ["Ehlisünnet fıkhında delil sırası nedir?", "Kur'an, sünnet, icma ve kıyas."]
    },
    {
      bi: 0,
      metin:
        "Ehlisünnetin oluşumunda etkili olan temel tutum hangisidir?",
      secenekler: [
        "İhtilaflarda aşırılıktan kaçınıp birleştirici olmak",
        "Görüş ayrılıklarını tekfirle sonuçlandırmak",
        "Sahabeyi tamamen dışlamak",
        "Kur'an'ı yorumlamaktan vazgeçmek"
      ],
      cozum:
        "Ehlisünnet, ayrılıklarda ölçülü ve birleştirici bir tutum benimsemiştir.",
      fc: ["Ehlisünnetin ihtilaflara yaklaşımı nasıldır?", "Ölçülü, birleştirici ve aşırılıktan uzak."]
    },
    {
      bi: 0,
      metin:
        "Aşağıdakilerden hangisi Ehlisünnet içinde sayılmaz?",
      secenekler: ["İsmaililik", "Hanefilik", "Maturidilik", "Hanbelilik"],
      cozum:
        "İsmaililik Şia içinde yer alır; diğer üçü Ehlisünnet çizgisindedir.",
      fc: ["İsmaililik hangi gelenek içinde yer alır?", "Şia içinde."]
    }
  ]
});

/* ------------------------------------------------------------ 5.2.2 */
yazKonu({
  konu_id: "din_10_u05_k04",
  ders: DERS,
  tema: 5,
  tema_adi: TEMA_ADI,
  baslik: "5.2.2 Şia",
  kazanim: "Şia kavramını, imamet anlayışını ve bu çizgideki fıkhi yorumları açıklar.",
  kaynak: kaynak("156-158"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Şia'nın imamet anlayışını açıklar.",
    "Şia içindeki fıkhi yorumları ayırt eder."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Hz. Ali'nin ve soyundan gelen imamların İslam toplumunun meşru liderleri olduğunu kabul eden yorum hangisidir?",
      secenekler: ["Şia", "Ehlisünnet", "Mutezile", "Haricîlik"],
      cozum:
        "Şia, imametin Hz. Ali ve soyundan gelenlere ait olduğu görüşünü esas alır.",
      fc: ["Şia ne demektir?", "Hz. Ali ve Ehlibeyt'e bağlılığı esas alan, imameti onların hakkı sayan yorum."]
    },
    {
      bi: 0,
      metin:
        "Şia düşüncesinde imamın belirlenmesi hangi yolla açıklanır?",
      secenekler: [
        "Allah'ın bildirmesi ve Peygamber'in tayini ile",
        "Toplumun çoğunluk oyuyla",
        "Aile büyüklerinin seçimiyle",
        "Devlet başkanının atamasıyla"
      ],
      cozum:
        "Şia, imamın nass ve tayin yoluyla belirlendiğini savunur; seçim düşüncesini kabul etmez.",
      fc: ["Şia'ya göre imam nasıl belirlenir?", "Nass ve tayin yoluyla; ilahi bildirim ve Peygamber'in işaretiyle."]
    },
    {
      bi: 1,
      metin:
        "Şia içinde fıkıh alanında öne çıkan ve Cafer Sadık'ın görüşleri etrafında şekillenen yorum hangisidir?",
      secenekler: ["Caferilik", "Hanefilik", "Malikilik", "Maturidilik"],
      cozum:
        "Caferilik, Şia'nın fıkhi yorumu olup Cafer Sadık'ın görüşleri etrafında oluşmuştur.",
      fc: ["Caferilik nedir?", "Şia içindeki fıkhi yorum; Cafer Sadık'ın görüşleri etrafında şekillenmiştir."]
    },
    {
      bi: 1,
      metin:
        "Şia'da imamların günahsız ve hatasız olduğu inancı hangi kavramla ifade edilir?",
      secenekler: ["İsmet", "İcma", "Kıyas", "İctihad"],
      cozum:
        "İsmet, imamların hata ve günahtan korunmuş olduğu inancını ifade eder.",
      fc: ["İsmet ne demektir?", "Hata ve günahtan korunmuş olma; Şia'da imamlar için kullanılır."]
    },
    {
      bi: 0,
      metin:
        "Şia'nın Ehlibeyt vurgusu hangi anlamı taşır?",
      secenekler: [
        "Peygamber'in ailesine ve yakınlarına bağlılığı",
        "Yalnızca devlet yönetimini ilgilendiren bir kuralı",
        "Ticari ortaklık esaslarını",
        "İbadet vakitlerini"
      ],
      cozum:
        "Ehlibeyt, Peygamber'in ev halkını ifade eder; Şia bu bağlılığı inancının merkezine yerleştirir.",
      fc: ["Ehlibeyt kimlerdir?", "Hz. Peygamber'in ev halkı ve yakınları."]
    },
    {
      bi: 1,
      metin:
        "Şia içinde \"On İki İmam\" inancını esas alan kol hangisidir?",
      secenekler: ["İsnâaşeriyye", "Zeydilik", "İsmaililik", "Maturidilik"],
      cozum:
        "İsnâaşeriyye (On İki İmam) Şia'nın en yaygın koludur; Zeydilik ve İsmaililik diğer kollardır.",
      fc: ["İsnâaşeriyye ne demektir?", "On İki İmam inancını esas alan Şia kolu."]
    },
    {
      bi: 0,
      metin:
        "Şia'nın fıkhi yorumlarında Sünni gelenekten ayrıldığı nokta hangisidir?",
      secenekler: [
        "İmamların sözlerini de hüküm kaynağı sayması",
        "Kur'an'ı hiç dikkate almaması",
        "Namazı farz saymaması",
        "Orucu terk etmesi"
      ],
      cozum:
        "Şia, imamların söz ve uygulamalarını da fıkhi hükümlerde kaynak olarak değerlendirir.",
      fc: ["Şia fıkhının ayırt edici kaynağı nedir?", "İmamların söz ve uygulamalarının da delil sayılması."]
    },
    {
      bi: 1,
      metin:
        "Bir metinde, Şia'nın son imamın gizlendiği ve bir gün ortaya çıkacağı inancı anlatılmaktadır. Bu inanç hangi kavramla ifade edilir?",
      secenekler: ["Gaybet", "İsmet", "İcma", "Tevella"],
      cozum:
        "Gaybet, on ikinci imamın gizlendiği inancını ifade eden kavramdır.",
      fc: ["Gaybet ne demektir?", "Şia'da son imamın gizlendiği inancı."]
    },
    {
      bi: 0,
      metin:
        "Şia ile Ehlisünnetin ortak kabulü hangisidir?",
      secenekler: [
        "Kur'an'ın Allah'ın kelamı olduğu",
        "İmametin nassla belirlendiği",
        "İmamların günahsız olduğu",
        "Yalnızca imamların görüşünün bağlayıcı olduğu"
      ],
      cozum:
        "İki gelenek de Kur'an'ı vahiy ürünü sayar; imamet ve ismet konularında ayrılırlar.",
      fc: ["Şia ile Ehlisünnetin ortak noktası nedir?", "Kur'an'ın vahiy olduğu, temel ibadetler ve iman esasları."]
    },
    {
      bi: 1,
      metin:
        "Şia'nın ortaya çıkışında etkili olan temel tartışma hangisidir?",
      secenekler: [
        "İmametin kimin hakkı olduğu",
        "Namazın kaç rekât olduğu",
        "Orucun hangi ayda tutulacağı",
        "Zekâtın hangi mala verileceği"
      ],
      cozum:
        "Şia'nın doğuşunda, Hz. Peygamber sonrası imametin kime ait olduğu tartışması belirleyici olmuştur.",
      fc: ["Şia'nın doğuşundaki temel tartışma nedir?", "İmametin kime ait olduğu tartışması."]
    }
  ]
});
