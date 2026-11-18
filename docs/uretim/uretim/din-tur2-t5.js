#!/usr/bin/env node
/* ============================================================
   DİN KÜLTÜRÜ 10 · TUR-2 · 5. ÜNİTE — kitaptan sıfırdan havuzlar
   ------------------------------------------------------------
   Kaynak: MEB Din Kültürü 10 (2025) — din.json (kitap-kaynak).
   Basılı sayfa = PDF sayfası − 1.

     5.1 Dinî Yorum Farklılıklarının Sebepleri        s.143-148  (12)
     5.2 İtikadi-Siyasi ve Fıkhi Yorumlar             s.149-158  (15)

   5.2.1 Ehlisünnet ve 5.2.2 Şia havuzları (u05_k03/k04)
   zaten kitap kaynaklı; bu havuz kavram ve sınıflandırma düzeyinde.

   Kullanım: node docs/uretim/uretim/din-tur2-t5.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Din Kültürü";
const DOSYA = "din-10.pdf (MEB, 2025)";
const kaynak = s => "Din Kültürü 10 ders kitabı, s." + s;
const TEMA = 5;
const TEMA_ADI = "İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar";

/* --------------------------------------------- 5.1 */
yazKonu({
  konu_id: "din_10_u05_k01",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "5.1 Dinî Yorum Farklılıklarının Sebepleri",
  kazanim: "Dinî yorum farklılıklarının sebeplerini açıklar.",
  kaynak: kaynak("143-148"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Din, dinî yorum, muhkem ve müteşabih kavramlarını açıklar.",
    "Yorum farklılıklarının sebeplerini örneklerle yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Akıl sahiplerini peygamberin bildirdiği gerçekleri benimsemeye çağıran ilahi kanuna ne ad verilir?",
      secenekler: ["Din", "Mezhep", "Tevil", "İtikat"],
      cozum: "Din, ilahi kanun olarak insanları iyiye ve mutluluğa çağırır.",
      fc: ["Din nedir?", "Akıl sahiplerini peygamberin bildirdiği gerçekleri benimsemeye çağıran ilahi kanun."]
    },
    {
      bi: 0,
      metin: "İnsanların dinî metinleri esas alarak ortaya koyduğu görüş, düşünce ve uygulamalara ne ad verilir?",
      secenekler: ["Dinî yorum", "İtikat", "Fıkıh", "Tevil"],
      cozum: "Dinî yorum, insanın anlama ve algılama biçimine dayanır.",
      fc: ["Dinî yorum nedir?", "İnsanların dinî metinleri esas alarak ortaya koyduğu görüş, düşünce ve uygulamalar."]
    },
    {
      bi: 0,
      metin: "Din ile dinî yorumun karşılaştırılmasına göre hangisi doğrudur?",
      secenekler: [
        "Din tektir, dinî yorum birden fazla olabilir",
        "Din bölgeseldir, dinî yorum evrenseldir",
        "Her ikisi de yalnızca insan görüşüne dayanır",
        "Dinî yorum tektir, din çeşitlidir"
      ],
      cozum: "Din tek ve evrenseldir; dinî yorum ise insan görüşlerine dayandığı için çeşitlenir.",
      fc: ["Din ve dinî yorum arasındaki fark nedir?", "Din tek ve evrenseldir; dinî yorum birden fazla ve bölgesel olabilir."]
    },
    {
      bi: 0,
      metin: "Anlamı açık, yoruma gerek olmayan, okunduğunda manası hemen anlaşılan ayetlere ne ad verilir?",
      secenekler: ["Muhkem", "Müteşabih", "Tevil", "İcmâ"],
      cozum: "Muhkem ayetler anlamı açık ayetlerdir ve Kur'an'ın çoğunluğunu oluşturur.",
      fc: ["Muhkem ayet nedir?", "Anlamı açık, yoruma gerek olmayan ayet."]
    },
    {
      bi: 0,
      metin: "Birden fazla anlam içerebilen, anlaşılması için araştırma ve düşünme gerektiren ayetlere ne ad verilir?",
      secenekler: ["Müteşabih", "Muhkem", "Mütevâtir", "Mücmel"],
      cozum: "Müteşabih ayetler, Allah'ın sıfatları ve ahiret gibi konularda farklı yorumlara açıktır.",
      fc: ["Müteşabih ayet nedir?", "Birden fazla anlam içerebilen, araştırma ve düşünme gerektiren ayet."]
    },
    {
      bi: 0,
      metin: "\"Ey insanlar! Sizi ve sizden öncekileri yaratan Rabbinize ibadet edin.\" ayetini bütün insanlara hitap olarak yorumlayan âlim hangisidir?",
      secenekler: ["İmam Eşari", "İmam Matüridi", "İmam Gazali", "İmam Azam"],
      cozum: "Eşari, ayetin tüm insanlara hitap ettiği görüşünü benimsemiştir.",
      fc: ["Ayeti bütün insanlara hitap olarak yorumlayan âlim kimdir?", "İmam Eşari."]
    },
    {
      bi: 0,
      metin: "Aynı ayeti ibadetin yalnızca Müslümanlara emredildiği şeklinde yorumlayan âlim hangisidir?",
      secenekler: ["İmam Matüridi", "İmam Eşari", "İmam Şafii", "Hasan Basri"],
      cozum: "Matüridi, ayeti ibadetin Müslümanlara özgü olduğu yönünde yorumlamıştır.",
      fc: ["Ayeti Müslümanlara özgü yorumlayan âlim kimdir?", "İmam Matüridi."]
    },
    {
      bi: 1,
      metin: "Arap alfabesine beş yeni harf eklenerek Endonezya'ya özgü oluşan alfabe hangisidir?",
      secenekler: ["Câvî alfabesi", "Kûfî alfabesi", "Nesih alfabesi", "Sülüs alfabesi"],
      cozum: "Câvî alfabesi, İslam'ın bölge kültürüyle etkileşimine örnektir.",
      fc: ["Câvî alfabesi nedir?", "Arap alfabesine beş harf eklenerek Endonezya'da oluşan alfabe."]
    },
    {
      bi: 1,
      metin: "Endonezya'daki camilerin Hint ve Çin mimari özellikleri taşıması hangi sebebe örnektir?",
      secenekler: [
        "Coğrafi ve kültürel sebeplere",
        "Siyasi çatışmalara",
        "Ekonomik krizlere",
        "Dil farklılıklarına"
      ],
      cozum: "İslam'ın farklı coğrafyalara yayılması yerel kültürlerle etkileşimi doğurmuştur.",
      fc: ["Endonezya camilerindeki mimari farklılık neyi gösterir?", "Coğrafi ve kültürel etkileşimi."]
    },
    {
      bi: 1,
      metin: "Dinî yorum farklılıklarının ortaya çıkmasında en temel etken hangisidir?",
      secenekler: [
        "İnsana verilen akıl ve irade özgürlüğü",
        "İbadetlerin azalması",
        "Kur'an'ın tek kaynak olması",
        "Mezheplerin çoğalması"
      ],
      cozum: "Allah insana akıl ve irade özgürlüğü verdiği için dinin ayrıntılarında farklı görüşler doğabilir.",
      fc: ["Yorum farklılıklarının temel sebebi nedir?", "İnsana verilen akıl ve irade özgürlüğü."]
    },
    {
      bi: 1,
      metin: "İslam âlimlerinin farklı yorumlar ve mezhepler hakkındaki genel tutumu hangisidir?",
      secenekler: [
        "Temel ilkeler dışındaki konularda farklı görüşleri sorun olarak görmemek",
        "Bütün farklı görüşleri reddetmek",
        "Mezhepleri yeni birer din saymak",
        "Yorum yapmayı yasaklamak"
      ],
      cozum: "Âlimler, temel ilke ve hükümler dışındaki farklı görüşleri sorun saymamıştır.",
      fc: ["Âlimler farklı yorumlara nasıl yaklaşmıştır?", "Temel ilkeler dışındaki konularda farklı görüşleri sorun olarak görmemişlerdir."]
    },
    {
      bi: 1,
      metin: "Dinî yorum farklılıklarının toplumsal yararı hangisidir?",
      secenekler: [
        "Değişen şartlara uyum sağlamayı kolaylaştırması",
        "Toplumda ayrılıkları derinleştirmesi",
        "İbadetlerin terk edilmesine yol açması",
        "Bilimsel gelişmeyi yavaşlatması"
      ],
      cozum: "Farklı yorumlar, dinî hükümlerin değişen şartlarda uygulanmasına imkân tanır.",
      fc: ["Yorum farklılıklarının olumlu yönü nedir?", "Değişen şartlara uyum sağlamayı kolaylaştırması ve zenginlik oluşturması."]
    }
  ]
});

/* --------------------------------------------- 5.2 */
yazKonu({
  konu_id: "din_10_u05_k02",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "5.2 İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar",
  kazanim: "İtikadi-siyasi ve fıkhi yorumları temel kavramlarıyla sınıflandırır.",
  kaynak: kaynak("149-158"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Mezhep, itikat, fıkıh ve tevil kavramlarını açıklar.",
    "İtikadi-siyasi ve fıkhi yorumları sınıflandırır."
  ],
  items: [
    {
      bi: 0,
      metin: "İslam'ın inanç esaslarını veya amelî hükümlerini anlama konusunda kendine özgü yaklaşım ve yöntemlere sahip düşünce geleneğine ne ad verilir?",
      secenekler: ["Mezhep", "Tevil", "İtikat", "Fıkıh"],
      cozum: "Mezhep, gidilecek yol anlamına gelir ve yorum geleneğini ifade eder.",
      fc: ["Mezhep nedir?", "İnanç veya amelî hükümleri anlamada kendine özgü yaklaşım ve yöntemi olan düşünce geleneği."]
    },
    {
      bi: 0,
      metin: "Mezheplerin din açısından konumu hangisidir?",
      secenekler: [
        "Yeni bir din değil, dinin yorumlanış biçimidir",
        "Yeni birer din sayılır",
        "Kur'an ve sünnetin yerini alır",
        "Temel kaynaklara aykırı olabilir"
      ],
      cozum: "Mezhepler dinin insanlar tarafından yorumlanış biçimidir ve temel kaynaklara aykırı olamaz.",
      fc: ["Mezhep din midir?", "Hayır; dinin yorumlanış biçimidir."]
    },
    {
      bi: 0,
      metin: "Düğüm atmışçasına bağlanmak, gönülden inanmak anlamına gelen ve imanla eş anlamlı kullanılan kavram hangisidir?",
      secenekler: ["İtikat", "Fıkıh", "Tevil", "Mezhep"],
      cozum: "İtikat, inanılması gereken temel esasların bütününü ifade eder.",
      fc: ["İtikat nedir?", "Gönülden inanmak; imanla eş anlamlı olarak kullanılan temel inanç esasları."]
    },
    {
      bi: 0,
      metin: "İbadet, cezalar ve muamelatla ilgili dinî hükümleri delilleriyle bilmeye ne ad verilir?",
      secenekler: ["Fıkıh", "İtikat", "Tevil", "Tefsir"],
      cozum: "Fıkıh, amelî hükümleri ayrıntılı delillerle ele alır.",
      fc: ["Fıkıh nedir?", "İbadet, ceza ve muamelatla ilgili hükümleri delilleriyle bilmek."]
    },
    {
      bi: 0,
      metin: "Ayet ve hadislerdeki ifadelerin muhtemel anlamlarından birinin delile dayandırılarak tercih edilmesine ne ad verilir?",
      secenekler: ["Tevil", "İcmâ", "Mezhep", "İtikat"],
      cozum: "Tevil, kapalı anlamları açığa çıkarma ve yorumlama işidir.",
      fc: ["Tevil nedir?", "Kapalı anlamları açığa çıkarma; muhtemel anlamlardan birini delile dayanarak tercih etme."]
    },
    {
      bi: 0,
      metin: "Hz. Peygamber ve sahabilerin görüşlerini benimseyip uygulamalarını takip edenler için kullanılan kavram hangisidir?",
      secenekler: ["Ehlisünnet", "Şia", "MuteZile", "Cehmiyye"],
      cozum: "Ehlisünnet, sünneti ve sahabilerin yolunu izleyenleri ifade eder.",
      fc: ["Ehlisünnet nedir?", "Hz. Peygamber ve sahabilerin görüşlerini benimseyip uygulamalarını takip edenler."]
    },
    {
      bi: 0,
      metin: "Ehlisünnet tabirini ilk defa kullanan âlim hangisidir?",
      secenekler: ["Hasan Basri", "İmam Eşari", "İmam Matüridi", "İmam Hanbeli"],
      cozum: "Tabir ilk defa Hasan Basri tarafından kullanılmıştır.",
      fc: ["Sünnet ehli kimlere denir?", "Hz. Peygamber ve sahabilerin görüşlerini benimseyenlere."]
    },
    {
      bi: 0,
      metin: "Bugün Müslümanların yaklaşık ne kadarı Ehlisünnet görüşünü benimsemektedir?",
      secenekler: ["%90'ından fazlası", "%50'si", "%30'u", "%70'i"],
      cozum: "Müslümanların %90'ından fazlası Ehlisünnet görüşündedir.",
      fc: ["Ehlisünnet görüşünün yaygınlığı nedir?", "Müslümanların %90'ından fazlası."]
    },
    {
      bi: 0,
      metin: "İtikadi-siyasi mezhepler hangi konulardaki yorum farklılıklarından doğmuştur?",
      secenekler: [
        "İnanç konularının ayrıntıları",
        "İbadetlerin uygulanışı",
        "Ticaret hukuku",
        "Aile hukuku"
      ],
      cozum: "İtikadi-siyasi mezhepler inanç konularının ayrıntılarındaki farklılıklardan doğmuştur.",
      fc: ["İtikadi-siyasi mezhepler neyden doğmuştur?", "İnanç konularının ayrıntılarındaki yorum farklılıklarından."]
    },
    {
      bi: 0,
      metin: "Fıkhi mezhepler hangi konulardaki yorum farklılıklarından doğmuştur?",
      secenekler: [
        "İbadetler ve dinî hükümler",
        "Allah'ın sıfatları",
        "Kader konusu",
        "Ahiret inancı"
      ],
      cozum: "Fıkhi mezhepler ibadetler ve amelî hükümlerdeki yorum farklılıklarından doğmuştur.",
      fc: ["Fıkhi mezhepler neyden doğmuştur?", "İbadetler ve amelî hükümlerdeki yorum farklılıklarından."]
    },
    {
      bi: 1,
      metin: "Ehlisünnet içindeki itikadi yorumlar hangi seçenekte verilmiştir?",
      secenekler: [
        "Matüridilik ve Eşarilik",
        "Hanefilik ve Şafiilik",
        "Caferilik ve Zeydilik",
        "Malikilik ve Hanbelilik"
      ],
      cozum: "Ehlisünnetin itikadi yorumları Matüridilik ve Eşarilik'tir.",
      fc: ["Ehlisünnetin itikadi yorumları hangileridir?", "Matüridilik ve Eşarilik."]
    },
    {
      bi: 1,
      metin: "Ehlisünnetin fıkhi yorumları hangi seçenekte birlikte verilmiştir?",
      secenekler: [
        "Hanefilik, Malikilik, Şafiilik, Hanbelilik",
        "Matüridilik, Eşarilik, Caferilik, Zeydilik",
        "Caferilik, Zeydilik, İsmaililik, Nusayrilik",
        "Mutezile, Cehmiyye, Kaderiyye, Mürcie"
      ],
      cozum: "Dört fıkhi yorum Hanefilik, Malikilik, Şafiilik ve Hanbelilik'tir.",
      fc: ["Hanefilik hangi gruba girer?", "Ehlisünnetin fıkhi yorumlarından biridir."]
    },
    {
      bi: 1,
      metin: "Şia'nın fıkhi yorumu hangisidir?",
      secenekler: ["Caferilik", "Hanefilik", "Eşarilik", "Malikilik"],
      cozum: "Şia'nın fıkhi yorumu Caferilik olarak bilinir.",
      fc: ["Caferilik hangi görüşe aittir?", "Şia'nın fıkhi yorumu."]
    },
    {
      bi: 1,
      metin: "İslam düşüncesinde ortaya çıkan iki temel itikadi-siyasi görüş hangisidir?",
      secenekler: [
        "Ehlisünnet ve Şia",
        "Hanefilik ve Şafiilik",
        "Matüridilik ve Caferilik",
        "Eşarilik ve Hanbelilik"
      ],
      cozum: "Hz. Peygamber'in vefatından sonraki süreçte Ehlisünnet ve Şia iki temel görüş olarak ortaya çıkmıştır.",
      fc: ["Ehlisünnet ve Şia ne zaman ortaya çıkmıştır?", "Hz. Peygamber'in vefatından sonraki süreçte."]
    },
    {
      bi: 1,
      metin: "Mezheplerin Kur'an ve sünnetle ilişkisi hangisidir?",
      secenekler: [
        "Kur'an ve sünnet mezheplerin temel kaynağıdır",
        "Mezhepler temel kaynakları geçersiz kılar",
        "Mezhepler yeni bir vahiy kaynağıdır",
        "Mezhepler kaynaklardan bağımsız oluşur"
      ],
      cozum: "Mezhepler, Kur'an ve sünnet esas alınarak oluşan yorum gelenekleridir.",
      fc: ["Mezheplerin temel kaynakları nelerdir?", "Kur'an ve sünnet; mezhep bunlara aykırı olamaz."]
    }
  ]
});

console.log("din tur-2 (5. ünite): 2 havuz yazıldı");
