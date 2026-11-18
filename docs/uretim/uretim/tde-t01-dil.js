#!/usr/bin/env node
/* ============================================================
   TDE · 1. TEMA — DİL BİLGİSİ konu havuzları
   ------------------------------------------------------------
   Kaynak: 10. sınıf TDE ders notları (Mustafa Çiftçi)
     edebiyat_10_u01_k06  İsimler (Adlar)        s.40-49
     edebiyat_10_u01_k07  İsim Tamlamaları       s.46-48, 62-65
     edebiyat_10_u01_k08  Sıfatlar (Ön Adlar)    s.50-61
     edebiyat_10_u01_k09  Sıfat Tamlaması        s.65-67
   Kullanım: node docs/uretim/uretim/tde-t01-dil.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Türk Dili ve Edebiyatı";
const DOSYA = "10.Edebiyat.Ders.notlari.Yeni.Mufredat.pdf";
const TEMA = 1;
const TEMA_ADI = "Sözün Ezgisi";

function kaynak(s) {
  return "10. sınıf TDE ders notları (Mustafa Çiftçi), s." + s;
}

/* ---------------- 6) İSİMLER (ADLAR) ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u01_k06",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "İsimler (Adlar)",
  kazanim:
    "İsimleri tür, yapı ve çekim ekleri bakımından çözümleyebilme.",
  kaynak: kaynak("40-49"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "İsmi türleri bakımından sınıflandırır.",
    "İsmin yapısını (basit, türemiş, birleşik) çözümler.",
    "İsim çekim eklerinin işlevini ayırt eder."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Bir metinde \"Marmara Denizi\", \"Türk Dil Kurumu\" ve \"29 Ekim Cumhuriyet Bayramı\" gibi adlar geçmektedir. Bu adların ortak özelliği hangisidir?",
      secenekler: [
        "Tek bir varlığı göstermeleri",
        "Bir türün tamamını karşılamaları",
        "Çokluk ekiyle kurulmaları",
        "Beş duyuyla algılanamamaları"
      ],
      cozum:
        "Bilinen tek bir varlığı gösteren adlar özel isimdir. Yer, kurum ve bayram adları özel isim sayılır; bir türün tamamını karşılayan adlar ise cins isimdir.",
      fc: [
        "Özel isim nedir?",
        "Bilinen tek bir varlığı gösteren; kişi, yer, kurum, eser, bayram gibi adlardır."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Sürü, ordu, meclis, aile\" sözcükleri çokluk eki almadıkları hâlde birden çok varlığı karşılar. Bu sözcükler hangi isim türüne girer?",
      secenekler: ["Topluluk ismi", "Çoğul isim", "Soyut isim", "Cins isim"],
      cozum:
        "Çokluk eki almadığı hâlde tekil görünüp birden çok varlığı karşılayan isimler topluluk ismidir. Çoğul isim, -ler/-lar ekiyle kurulur.",
      fc: [
        "Topluluk ismi nedir?",
        "Çokluk eki almadığı hâlde birden çok varlığı karşılayan, tekil görünüşlü isimdir; sürü, ordu, meclis gibi."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir öğrenci \"rüzgâr, sevgi, oksijen, gözlük\" sözcüklerini somut ve soyut olarak ayırmaktadır. Bu sözcüklerden hangisi soyut isimdir?",
      secenekler: ["Sevgi", "Rüzgâr", "Oksijen", "Gözlük"],
      cozum:
        "Beş duyu organıyla algılanamayan varlıkların adı soyuttur. Sevgi duygu adı olduğu için soyut; rüzgâr, oksijen ve gözlük algılanabilir olduğu için somuttur.",
      fc: [
        "Soyut isim nedir?",
        "Beş duyu organıyla algılanamayan; sevgi, akıl, üzüntü, cömertlik gibi varlıkların adıdır."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Bütün sınıf bu duruma üzüldü.\" cümlesinde \"sınıf\" sözcüğü topluluk ismi, \"Bugün sınıf boyanacak.\" cümlesinde ise tekil isimdir. Bu ayrımın nedeni hangisidir?",
      secenekler: [
        "İlkinde odadaki öğrencilerin, ikincisinde odanın düşünülmesi",
        "İlkinde çokluk ekinin kullanılması",
        "İkincisinde sözcüğün yapım eki alması",
        "İkincisinde sözcüğün özel isim olması"
      ],
      cozum:
        "Ad aktarması yoluyla bir tür adı topluluk adı olabilir: öğrenciler düşünülürse topluluk, oda (bina) düşünülürse tekil isim olur. Çokluk eki iki cümlede de yoktur.",
      fc: [
        "Topluluk adının ad aktarmasıyla kullanımı nedir?",
        "Ad aktarması yoluyla, adın içindeki insan topluluğu düşünüldüğünde topluluk adı olur."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Kalemlik, simitçi, yolcu\" sözcükleri yapı bakımından hangi grupta yer alır?",
      secenekler: ["Türemiş isim", "Basit isim", "Birleşik isim", "Topluluk ismi"],
      cozum:
        "Kök hâlindeki bir isme yapım eki getirilerek oluşturulan isimler türemiş isimdir. Basit isim yapım eki almaz, birleşik isim ise iki sözcüğün birleşmesiyle oluşur.",
      fc: [
        "Türemiş isim nedir?",
        "Basit bir isme yapım eki getirilerek ya da fiil köküne isim yapım eki getirilerek oluşan isimdir."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Biçerdöver, dedikodu, gecekondu, bilgisayar\" sözcükleri yapı bakımından hangi grupta yer alır?",
      secenekler: ["Birleşik isim", "Basit isim", "Türemiş isim", "Cins isim"],
      cozum:
        "En az iki sözcüğün bir araya gelmesiyle oluşan isimler birleşik isimdir. Biçerdöver ve dedikodu iki eylemin, gecekondu ve bilgisayar ad ile eylemin birleşmesiyle oluşmuştur.",
      fc: [
        "Birleşik ismin oluşum yolları nedir?",
        "İki adın, bir ad ile bir eylemin ya da iki eylemin yan yana gelmesiyle oluşur."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Masanın ayağı kırıldı.\" cümlesindeki \"masanın\" sözcüğü yapı bakımından hangi gruptadır?",
      secenekler: [
        "Basit isim",
        "Türemiş isim",
        "Birleşik isim",
        "Adlaşmış isim"
      ],
      cozum:
        "\"Masa\" kökü yapım eki almamıştır; aldığı -nın eki ilgi (çekim) ekidir. Çekim eki bir ismi türemiş yapmaz, bu yüzden sözcük basit isimdir.",
      fc: [
        "Basit isim nedir?",
        "Çekim ekleri sözcüğün anlamını ve türünü değiştirmediği için isim basit kalır."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Köyü güzelmiş.\" ve \"Köyü gezdiler.\" cümlelerinde geçen -ü eki için hangisi doğrudur?",
      secenekler: [
        "İlkinde iyelik, ikincisinde belirtme hâl eki",
        "İlkinde belirtme hâli, ikincisinde iyelik eki",
        "İkisinde de belirtme hâl eki",
        "İkisinde de iyelik eki"
      ],
      cozum:
        "Sözcüğün başına \"onun\" getirilebiliyorsa iyelik ekidir: onun köyü güzelmiş. \"Köyü gezdiler\" cümlesinde ise -ü belirtme (yükleme) hâl ekidir.",
      fc: [
        "İyelik eki ile belirtme hâl ekinin ayrımı nedir?",
        "Sözcüğün başına \"onun\" getirilebiliyorsa iyelik eki, getirilemiyorsa belirtme hâl ekidir."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Çocuklardan biri bahçeye girdi.\" cümlesinde -den eki hangi görevde kullanılmıştır?",
      secenekler: [
        "Tamlayan ekinin yerini tutmuştur.",
        "İsmi cümlede yüklem yapmıştır.",
        "İsme çokluk anlamı katmıştır.",
        "Bir sıfat tamlaması kurmuştur."
      ],
      cozum:
        "Ders notunda -den ekinin belirtili isim tamlamalarındaki tamlayan eki -ın/-in/-un/-ün yerini tutabildiği belirtilir: çocuklardan biri = çocukların biri.",
      fc: [
        "-den ekinin tamlayan eki yerine kullanımı nedir?",
        "Belirtili isim tamlamalarında: \"yolculardan birkaçı\" = \"yolcuların birkaçı\"."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Öğrencilerin hediyeleri verildi.\" cümlesindeki \"hediyeleri\" sözcüğü hangi eki almıştır?",
      secenekler: [
        "Üçüncü çoğul kişi iyelik eki",
        "Çokluk eki ve üçüncü tekil kişi iyelik eki",
        "Belirtme hâl eki",
        "İlgi eki"
      ],
      cozum:
        "Tamlayan (öğrencilerin) çoğul olduğu için -leri eki üçüncü çoğul kişi iyelik ekidir. Tamlayan tekil olsaydı aynı ek çokluk eki + üçüncü tekil kişi iyelik olurdu.",
      fc: [
        "Üçüncü çoğul kişi iyelik ekinin işlevi nedir?",
        "Eklendiği sözcüğün değil, tamlayanın çoğul olduğunu belirtir: onların hediyeleri."
      ]
    }
  ]
});

/* ---------------- 7) İSİM TAMLAMALARI ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u01_k07",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "İsim Tamlamaları",
  kazanim:
    "İsim tamlamalarının türlerini, eklerini ve kuruluş özelliklerini çözümleyebilme.",
  kaynak: kaynak("46-48, 62-65"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "İsim tamlaması türlerini ayırt eder.",
    "Tamlamalarda ek ve kaynaştırma harfi kullanımını çözümler.",
    "İsim tamlamasını sıfat tamlamasından ve zincirleme yapıdan ayırır."
  ],
  items: [
    {
      bi: 0,
      metin:
        "\"Öğrenciler sınav sonuçlarını merak ediyormuş.\" cümlesindeki \"sınav sonuçlarını\" söz grubu hangi tamlama türüdür?",
      secenekler: [
        "Belirtisiz isim tamlaması",
        "Belirtili isim tamlaması",
        "Takısız isim tamlaması",
        "Sıfat tamlaması"
      ],
      cozum:
        "Yalnızca tamlananın ek aldığı (-ları) tamlamalar belirtisiz isim tamlamasıdır. Belirtili tamlamada tamlayan da ilgi eki alır.",
      fc: [
        "Belirtisiz isim tamlaması nedir?",
        "Yalnızca tamlananın iyelik eki aldığı, tamlayanın ek almadığı isim tamlamasıdır."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Bebeğin yüzü çok sevimliydi.\" cümlesindeki tamlama hangi türdendir?",
      secenekler: [
        "Belirtili isim tamlaması",
        "Belirtisiz isim tamlaması",
        "Takısız isim tamlaması",
        "Zincirleme isim tamlaması"
      ],
      cozum:
        "Hem tamlayan (-in) hem tamlanan (-ü) ek aldığı için tamlama belirtilidir. Belirtisizde yalnızca tamlanan ek alır.",
      fc: [
        "Belirtili isim tamlaması nedir?",
        "Tamlayanın ilgi, tamlananın iyelik eki aldığı isim tamlamasıdır: bebeğin yüzü gibi."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Deri ceket\", \"demir kapı\" ve \"cam kavanoz\" söz gruplarında tamlayan, tamlananın neyden yapıldığını bildirir; iki sözcük de ek almaz. Bu gruplar hangi tamlama türüdür?",
      secenekler: [
        "Takısız isim tamlaması",
        "Belirtili isim tamlaması",
        "Belirtisiz isim tamlaması",
        "Sıfat tamlaması"
      ],
      cozum:
        "Tamlayanın da tamlananın da ek almadığı, tamlayanın neyden yapıldığını ya da neye benzediğini bildirdiği gruplar takısız isim tamlamasıdır.",
      fc: [
        "Takısız isim tamlaması nedir?",
        "İki sözcüğün de ek almadığı, tamlayanın maddeyi ya da benzetmeyi bildirdiği tamlamadır: deri ceket, elma yanak."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Masa örtüsünün kenarı yıpranmıştı.\" cümlesindeki tamlama hangi türdendir?",
      secenekler: [
        "Zincirleme isim tamlaması",
        "Belirtisiz isim tamlaması",
        "Takısız isim tamlaması",
        "Sıfat tamlaması"
      ],
      cozum:
        "Tamlayanı (masa örtüsünün) kendi içinde bir isim tamlaması olduğu için yapı zincirlemedir; ikiden fazla isim (masa, örtü, kenar) bir aradadır.",
      fc: [
        "Zincirleme isim tamlaması nedir?",
        "İkiden fazla isimden oluşan; tamlayanın, tamlananın ya da ikisinin kendi içinde tamlama oluşturduğu tamlamadır."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Evin mutfak dolabı\" söz grubunda tamlanan kendi içinde bir tamlama oluşturmuştur. Bu grup hangi tamlama türüdür?",
      secenekler: [
        "Zincirleme isim tamlaması",
        "Belirtili isim tamlaması",
        "Belirtisiz isim tamlaması",
        "Takısız isim tamlaması"
      ],
      cozum:
        "\"Mutfak dolabı\" belirtisiz bir tamlamadır ve bu tamlama \"evin\" tamlayanıyla birleşerek zincirleme isim tamlaması oluşturur.",
      fc: [
        "Tamlananı tamlama olan yapının türü nedir?",
        "Zincirleme isim tamlamasıdır: evin mutfak dolabı gibi."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Suyun sesi\" ve \"neyin nesi\" tamlamalarında kaynaştırma ünsüzü olarak hangi harf kullanılır?",
      secenekler: ["y", "n", "s", "ş"],
      cozum:
        "İsim tamlamalarında genellikle n kaynaştırma ünsüzü kullanılır; ancak su ve ne sözcükleri tamlama kurduğunda y kaynaştırma ünsüzü alır.",
      fc: [
        "Tamlamada y kaynaştırma ünsüzü alan sözcükler nedir?",
        "Su ve ne sözcükleri: suyun sesi, neyin nesi."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Genç kızın sarı saçları\" söz grubunda tamlayan ve tamlanan sıfat almıştır. Bu grubun tamlama türü hangisidir?",
      secenekler: [
        "Belirtili isim tamlaması",
        "Sıfat tamlaması",
        "Takısız isim tamlaması",
        "Belirtisiz isim tamlaması"
      ],
      cozum:
        "Tamlayan da tamlanan da ilgi ve iyelik eki aldığı için yapı belirtili isim tamlamasıdır; sıfatlar tamlamanın içinde yer alır, türünü değiştirmez.",
      fc: [
        "Belirtili isim tamlamasında sıfatın yeri nedir?",
        "Bulunabilir; tamlayan da tamlanan da sıfat alabilir: genç kızın sarı saçları."
      ]
    },
    {
      bi: 2,
      metin:
        "\"İnek sütü\" belirtisiz isim tamlamasının başına \"taze\" sıfatı getirilerek \"taze inek sütü\" grubu kurulmuştur. Bu değişiklikle hangisi oluşur?",
      secenekler: [
        "Sıfat tamlaması",
        "Belirtili isim tamlaması",
        "Takısız isim tamlaması",
        "Zincirleme isim tamlaması"
      ],
      cozum:
        "Belirtisiz isim tamlamasına getirilen sıfat tüm tamlamanın sıfatı olur ve yapı sıfat tamlamasına dönüşür: taze (inek sütü).",
      fc: [
        "Belirtisiz isim tamlaması sıfat aldığında ne olur?",
        "Getirilen sıfat tüm tamlamayı nitelediği için yapı sıfat tamlamasına dönüşür."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Zeytin göz\" ile \"siyah göz\" grupları karşılaştırıldığında hangisi doğrudur?",
      secenekler: [
        "İlki takısız isim tamlaması, ikincisi sıfat tamlamasıdır.",
        "İlki sıfat tamlaması, ikincisi takısız isim tamlamasıdır.",
        "İkisi de belirtili isim tamlamasıdır.",
        "İkisi de sıfat tamlamasıdır."
      ],
      cozum:
        "Benzetme yoluyla kurulan ve ek almayan \"zeytin göz\" takısız isim tamlamasıdır; \"siyah\" nitelik bildirdiği için \"siyah göz\" sıfat tamlamasıdır.",
      fc: [
        "Takısız isim tamlaması ile sıfat tamlamasının ayrımı nedir?",
        "Tamlayan madde ya da benzetme bildiriyorsa takısız isim tamlaması, nitelik bildiriyorsa sıfat tamlamasıdır."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Yolculardan birkaçı otobüse yetişemedi.\" cümlesinde \"yolculardan\" sözcüğü hangi görevde kullanılmıştır?",
      secenekler: [
        "Tamlayan ekinin yerini tutan -den eki almıştır.",
        "Sıfat tamlamasının tamlayanı olmuştur.",
        "Takısız tamlama kurmuştur.",
        "Yüklem olmuştur."
      ],
      cozum:
        "Ders notuna göre kimi durumlarda tamlayan eki -in yerine -den durum eki kullanılır: yolculardan birkaçı = yolcuların birkaçı.",
      fc: [
        "Tamlayan eki yerine kullanılabilen ek nedir?",
        "-den durum eki kullanılabilir: işçilerden hangisi = işçilerin hangisi."
      ]
    }
  ]
});

/* ---------------- 8) SIFATLAR (ÖN ADLAR) ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u01_k08",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Sıfatlar (Ön Adlar)",
  kazanim:
    "Sıfatları tür, özellik ve yapı bakımından çözümleyebilme.",
  kaynak: kaynak("50-61"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Niteleme ve belirtme sıfatlarını ayırt eder.",
    "Sıfatların özelliklerini (adlaşma, pekiştirme, küçültme, derecelendirme) çözümler.",
    "Sıfatların yapısını belirler."
  ],
  items: [
    {
      bi: 0,
      metin:
        "\"Trenimiz karlı dağların arasından geçiyordu.\" cümlesinde \"karlı\" sözcüğü hangi sıfat türüdür?",
      secenekler: [
        "Niteleme sıfatı",
        "İşaret sıfatı",
        "Sayı sıfatı",
        "Belgisiz sıfat"
      ],
      cozum:
        "Adı durum, biçim ya da renk yönüyle niteleyen ve \"nasıl\" sorusuna cevap veren sözcükler niteleme sıfatıdır; \"karlı dağlar\"da karlı nitelemedir.",
      fc: [
        "Niteleme sıfatı nedir?",
        "Bir adı durum, biçim, renk yönüyle niteleyen ve \"nasıl\" sorusuna cevap olan sözcüktür."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Şu alan ağaçlarla doluydu.\" ve \"O kitabı babam okumuş.\" cümlelerinde altı çizili sözcükler hangi sıfat türüdür?",
      secenekler: ["İşaret sıfatı", "Soru sıfatı", "Sayı sıfatı", "Niteleme sıfatı"],
      cozum:
        "\"Bu, şu, o; öteki, öbür, beriki\" gibi sözcükler adları işaret yönüyle belirttiğinde işaret sıfatı olur.",
      fc: [
        "İşaret sıfatı nedir?",
        "Adları işaret yönüyle belirten sözcüktür: bu, şu, o, öteki, öbür, beriki."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Üçüncü sınıflar gezi düzenlemiş.\" cümlesindeki \"üçüncü\" sözcüğü hangi sıfat türüdür?",
      secenekler: ["Sıra sayı sıfatı", "Asıl sayı sıfatı", "Kesir sayı sıfatı", "Üleştirme sayı sıfatı"],
      cozum:
        "Sayı sıfatları asıl, sıra, üleştirme ve kesir olarak ayrılır. \"Üçüncü\" sıralama bildirdiği için sıra sayı sıfatıdır.",
      fc: [
        "Sıra sayı sıfatı nedir?",
        "Varlıkların sırasını bildiren sayı sıfatıdır: birinci, üçüncü, onuncu."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Bazı öğrenciler soruyu boş bıraktı.\" cümlesinde \"bazı\" sözcüğü hangi sıfat türüdür?",
      secenekler: ["Belgisiz sıfat", "İşaret sıfatı", "Soru sıfatı", "Niteleme sıfatı"],
      cozum:
        "Adı belgisizlik yönüyle belirten sözcükler belgisiz sıfattır: bazı, birçok, kimi, hiçbir. İşaret sıfatı varlığı işaret eder.",
      fc: [
        "Belgisiz sıfat nedir?",
        "Adı belgisizlik yönüyle belirten sözcüktür: bazı, birkaç, birçok, kimi, hiçbir."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Ben daha çok, eskilerin şiirlerini beğeniyorum.\" cümlesinde \"eskilerin\" sözcüğü için hangisi doğrudur?",
      secenekler: [
        "Adlaşmış sıfattır.",
        "Niteleme sıfatıdır.",
        "İşaret sıfatıdır.",
        "Sayı sıfatıdır."
      ],
      cozum:
        "Nitelediği ad (şairler) düşüp sıfat onun yerine geçtiğinde adlaşmış sıfat olur: eski şairler → eskiler.",
      fc: [
        "Adlaşmış sıfat nedir?",
        "Nitelediği ad düşen ve o adın yerine geçen sıfattır: eski şairler → eskiler."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Gemimiz masmavi denizde ilerliyordu.\" cümlesinde \"masmavi\" sözcüğü hangi yolla oluşturulmuştur?",
      secenekler: [
        "Pekiştirme yoluyla",
        "Küçültme yoluyla",
        "Derecelendirme yoluyla",
        "Adlaşma yoluyla"
      ],
      cozum:
        "Sıfatın ilk sesi ve \"m, p, r, s\" harfleriyle hece eklenerek yapılan pekiştirmedir: masmavi, upuzun, yemyeşil. Küçültme -cik, -imsi gibi eklerle yapılır.",
      fc: [
        "Sıfatlarda pekiştirme nedir?",
        "Sıfatın anlamının güçlendirilmesidir: masmavi, upuzun, yemyeşil, kapkara."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Yeşilimsi örtü\" ve \"ufacık ev\" söz gruplarında sıfatların anlamı hangi yolla değiştirilmiştir?",
      secenekler: [
        "Küçültme ekleriyle",
        "Pekiştirme ile",
        "Derecelendirme zarflarıyla",
        "Adlaşmayla"
      ],
      cozum:
        "Sıfatlarda küçültme -cik, -ce, -cek, -imsi, -imtırak, -su ekleriyle yapılır: yeşilimsi, ufacık, büyücek, sarımtırak.",
      fc: [
        "Sıfatlarda küçültme ekleri nedir?",
        "-cik, -ce, -cek, -imsi, -imtırak, -su ekleriyle: ufacık, derince, yeşilimsi."
      ]
    },
    {
      bi: 1,
      metin:
        "\"En güzel kitap buydu.\" cümlesinde \"en\" sözcüğü sıfata hangi anlamı katmıştır?",
      secenekler: [
        "En üstünlük",
        "Üstünlük",
        "Aşırılık",
        "Eşitlik"
      ],
      cozum:
        "Sıfatlarda derecelendirme \"pek, çok, daha, en\" sözcükleriyle yapılır: \"daha\" üstünlük, \"en\" en üstünlük, \"çok/pek\" aşırılık anlamı katar.",
      fc: [
        "Sıfatlarda derecelendirmenin yolu nedir?",
        "Sıfattan önce \"pek, çok, daha, en\" gibi miktar zarfları getirilerek yapılır."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Bilgili adam\" ve \"durgun su\" söz gruplarındaki sıfatlar yapı bakımından hangi gruptadır?",
      secenekler: ["Türemiş sıfat", "Basit sıfat", "Birleşik sıfat", "Adlaşmış sıfat"],
      cozum:
        "Yapım ekiyle kurulan sıfatlar türemiş sıfattır: bilgi+li, dur+gun. Basit sıfat yapım eki almaz; birleşik sıfat iki sözcükle kurulur.",
      fc: [
        "Türemiş sıfat nedir?",
        "Ad ya da eylem köküne yapım eki getirilerek kurulan sıfattır: bilgili, durgun, korkak."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Kısa saçlı çocuk\" ve \"kırk yıllık dostum\" söz gruplarındaki sıfatlar hangi gruptadır?",
      secenekler: [
        "Kurallı birleşik sıfat",
        "Türemiş sıfat",
        "Basit sıfat",
        "Adlaşmış sıfat"
      ],
      cozum:
        "Sıfat tamlamasına -li/-siz ya da sayı sıfatına -lik eki getirilerek kurulan, ayrı yazılan birleşik sıfatlara kurallı birleşik sıfat denir.",
      fc: [
        "Kurallı birleşik sıfatın kuruluşu nedir?",
        "Sıfat tamlamasına -li/-siz ya da asıl sayı sıfatına -lik eki getirilerek: kısa saçlı, kırk yıllık."
      ]
    }
  ]
});

/* ---------------- 9) SIFAT TAMLAMASI ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u01_k09",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Sıfat Tamlamaları",
  kazanim:
    "Sıfat tamlamalarının kuruluşunu ve cümledeki görevini çözümleyebilme.",
  kaynak: kaynak("65-67"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Sıfat tamlamasının kuruluşunu belirler.",
    "Sıfat tamlamasının cümledeki görevini çözümler.",
    "Sıfat tamlamasını adlaşmış sıfattan ve isim tamlamasından ayırır."
  ],
  items: [
    {
      bi: 0,
      metin:
        "\"Tatlı dil yılanı deliğinden çıkarır.\" cümlesindeki \"tatlı dil\" söz grubu hangi yapıdadır?",
      secenekler: [
        "Sıfat tamlaması",
        "Belirtisiz isim tamlaması",
        "Belirtili isim tamlaması",
        "Takısız isim tamlaması"
      ],
      cozum:
        "\"Tatlı\" sözcüğü \"dil\" adını nitelediği için grup sıfat tamlamasıdır. İsim tamlamasında iki sözcük de ad olur ve ek alır.",
      fc: [
        "Sıfat tamlaması nedir?",
        "Sıfatın bir adı niteleyerek ya da belirterek kurduğu söz grubudur: tatlı dil, iki yabancı."
      ]
    },
    {
      bi: 0,
      metin:
        "\"İki yabancıyız sanki, birlikte ama yalnızız.\" dizesindeki \"iki yabancı\" grubunda tamlayan hangi sıfat türüdür?",
      secenekler: ["Sayı sıfatı", "Niteleme sıfatı", "İşaret sıfatı", "Belgisiz sıfat"],
      cozum:
        "\"İki\" sözcüğü asıl sayı sıfatıdır; adı sayı yönünden belirterek sıfat tamlaması kurmuştur.",
      fc: [
        "Asıl sayı sıfatı nedir?",
        "Adı sayı yönünden belirten sıfattır: bir, iki, on, yüz, bin."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Yazar, bu oyununda bir meseleyi ele almış.\" cümlesindeki \"bu oyununda\" söz grubunda \"bu\" sözcüğü hangi görevdedir?",
      secenekler: [
        "İşaret sıfatı",
        "İşaret zamiri",
        "Belgisiz sıfat",
        "Soru sıfatı"
      ],
      cozum:
        "\"Bu\" sözcüğü \"oyun\" adının önünde onu işaret yönüyle belirttiği için işaret sıfatıdır. Ek alıp adın yerine geçseydi zamir olurdu.",
      fc: [
        "İşaret sıfatı ile işaret zamirinin ayrımı nedir?",
        "Yanındaki ad düşüp ek aldıklarında: \"bu bizim sorunumuzdu\" cümlesinde zamirdir."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Yaşlı anne ve babalar da vardı.\" cümlesinde \"yaşlı\" sıfatı hangi özelliğiyle kullanılmıştır?",
      secenekler: [
        "İki adı birlikte nitelemesi",
        "Yalnızca ikinci adı nitelemesi",
        "Adlaşmış olması",
        "Tamlanan görevinde olması"
      ],
      cozum:
        "Sıfat tamlamalarında tamlayan (sıfat), birden çok ad için kullanılabilir: yaşlı (anne ve babalar).",
      fc: [
        "Sıfatın birden çok adı birlikte nitelemesi nedir?",
        "Niteleyebilir: \"yaşlı anne ve babalar\"da sıfat iki adı birlikte niteler."
      ]
    },
    {
      bi: 1,
      metin:
        "\"İlginç fikirlerini kendine sakla.\" cümlesinde \"ilginç fikirlerini\" söz grubu cümlenin hangi ögesidir?",
      secenekler: ["Nesne", "Özne", "Dolaylı tümleç", "Yüklem"],
      cozum:
        "Sıfat tamlaması aldığı belirtme hâl ekiyle (-i) nesne görevindedir. Özne yalın hâlde, dolaylı tümleç -e/-de/-den ekleriyle kurulur.",
      fc: [
        "Sıfat tamlamasının cümledeki görevi nedir?",
        "Aldığı çekim ekine bağlıdır: yalın hâl özne, -i nesne, -e/-de/-den dolaylı tümleç olur."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Kimsesiz çocuklara yardım edelim.\" cümlesinde \"kimsesiz çocuklara\" söz grubu hangi ögedir?",
      secenekler: ["Dolaylı tümleç", "Nesne", "Özne", "Zarf tümleci"],
      cozum:
        "Sıfat tamlaması -e yönelme eki aldığı için dolaylı tümleç görevindedir.",
      fc: [
        "Yönelme eki almış sıfat tamlamasının ögesi nedir?",
        "Dolaylı tümleç olur: kimsesiz çocuklara yardım edelim."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Ustabaşı, saf bir adamdı.\" cümlesinde \"saf bir adamdı\" bölümü hangi ögedir?",
      secenekler: ["Yüklem", "Özne", "Nesne", "Dolaylı tümleç"],
      cozum:
        "Ekfiil alan sıfat tamlaması cümlenin yüklemi olur: saf bir adam-dı. Sıfat tamlaması tek başına değil, tamlama hâliyle öge olur.",
      fc: [
        "Ekfiil alan sıfat tamlamasının ögesi nedir?",
        "Yüklem olur: \"Ustabaşı, saf bir adamdı.\""
      ]
    },
    {
      bi: 2,
      metin:
        "\"Gençler bizden hoşgörü istiyor.\" cümlesindeki \"gençler\" sözcüğü için hangisi doğrudur?",
      secenekler: [
        "Adlaşmış sıfattır.",
        "Niteleme sıfatıdır.",
        "Sıfat tamlamasının tamlayanıdır.",
        "İsim tamlamasının tamlananıdır."
      ],
      cozum:
        "Sıfat, çokluk eki alıp nitelediği ad düşünce adlaşır: genç insanlar → gençler. Adlaşmış sıfat artık ad gibi kullanılır.",
      fc: [
        "Sıfat çokluk eki aldığında ne olur?",
        "Nitelediği ad düşmüşse adlaşır: gençler, yaşlılar, çocuklar."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Taze inek sütü\" söz grubu hangi yapıdadır?",
      secenekler: [
        "Sıfat tamlaması",
        "Belirtisiz isim tamlaması",
        "Belirtili isim tamlaması",
        "Takısız isim tamlaması"
      ],
      cozum:
        "\"İnek sütü\" belirtisiz isim tamlamasıdır; başına gelen \"taze\" sıfatı tüm tamlamayı nitelediği için yapı sıfat tamlamasına dönüşür.",
      fc: [
        "Belirtisiz isim tamlaması sıfat aldığında oluşan yapı nedir?",
        "Sıfat tamlaması oluşur: taze inek sütü, sıcak yaz akşamı."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Geniş balkon\" tamlamasından \"balkonu geniş ev\" grubu kurulmuştur. Bu yolla hangi yapı oluşur?",
      secenekler: [
        "Kurallı birleşik sıfat",
        "Belirtili isim tamlaması",
        "Takısız isim tamlaması",
        "Zincirleme isim tamlaması"
      ],
      cozum:
        "Sıfat tamlamasında adla sıfatın yeri değiştirilip ada iyelik eki getirilerek kurallı birleşik sıfat oluşturulur: balkonu geniş ev, uykusu ağır insan.",
      fc: [
        "Yeri değiştirilmiş sıfat tamlamasının oluşturduğu sıfat nedir?",
        "Kurallı birleşik sıfat: geniş balkon → balkonu geniş ev."
      ]
    }
  ]
});
