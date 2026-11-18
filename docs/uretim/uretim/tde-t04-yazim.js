#!/usr/bin/env node
/* ============================================================
   TDE · 4. TEMA — YAZIM VE NOKTALAMA konu havuzları
   ------------------------------------------------------------
   Kaynak: kullanıcının yüklediği PDF'ler
     edebiyat_10_u04_k04  Yazım Kuralları         yazim.json (31 s.)
     edebiyat_10_u04_k05  Noktalama İşaretleri    noktalama.json (12 s.)
   Kullanım: node docs/uretim/uretim/tde-t04-yazim.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Türk Dili ve Edebiyatı";
const TEMA = 4;
const TEMA_ADI = "Nesillerin Mirası";

/* ---------------- 4) YAZIM KURALLARI ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u04_k04",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Yazım Kuralları",
  kazanim:
    "Yazım kurallarını büyük harf, sayı, bağlaç ve ek yazımı bakımından uygulayabilme.",
  kaynak: "10. sınıf Yazım Kuralları notları (Mustafa Çiftçi), 31 s.",
  kaynak_dosya: "Yazim.Kurallari.pdf",
  beceriler: [
    "Büyük harfin kullanıldığı ve kullanılmadığı yerleri ayırt eder.",
    "Sayıların ve eklerin yazımını uygular.",
    "Bağlaç ve soru ekinin yazımını kuralla eşleştirir."
  ],
  items: [
    {
      bi: 0,
      metin:
        "\"İzmir'e -bu güzel şehre- daha önce hiç gelmemiştim.\" cümlesinde iki kısa çizgi arasına açıklama alınmıştır. Bu açıklamanın ilk harfi nasıl yazılır?",
      secenekler: [
        "Küçük harfle başlar",
        "Büyük harfle başlar",
        "Tamamı büyük yazılır",
        "Yalnız ilk sözcüğü büyük olur"
      ],
      cozum:
        "İki kısa çizgi arasındaki açıklama cümleleri büyük harfle başlamaz; cümle büyük harfle başlar kuralının istisnasıdır.",
      fc: [
        "İki kısa çizgi arasındaki açıklamanın yazımı nedir?",
        "Açıklama cümlesi büyük harfle başlamaz: İzmir'e -bu güzel şehre- ..."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Kelimeler genel olarak ikiye ayrılır: isimler ve fiiller.\" cümlesinde iki noktadan sonra örnekler sıralanmıştır. Buna göre iki noktadan sonra gelen bölümün ilk harfi nasıl yazılır?",
      secenekler: [
        "Küçük harfle başlar",
        "Büyük harfle başlar",
        "Tamamı büyük yazılır",
        "Yalnız ilk sözcüğü büyük olur"
      ],
      cozum:
        "İki noktadan sonra cümle gelirse büyük harfle başlar; cümle ve özel ad niteliğinde olmayan örnekler sıralandığında ise küçük harfle başlar.",
      fc: [
        "İki noktadan sonra büyük harf kuralı nedir?",
        "Cümle gelirse büyük, örnek sıralaması gelirse küçük harfle başlar."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Dün Nimet ablama gittim.\" cümlesinde geçen akrabalık bildiren sözcük, kendisinden önceki özel ada rağmen küçük harfle yazılmıştır. Bu yazım hangi kurala dayanır?",
      secenekler: [
        "Akrabalık bildiren kelimeler küçük harfle başlar",
        "Özel adlar her zaman büyük harfle başlar",
        "Hitaplar büyük harfle başlar",
        "Tabela yazıları büyük harfle başlar"
      ],
      cozum:
        "Akrabalık bildiren kelimeler küçük harfle başlar: Nimet ablama, Nezaket teyzemin.",
      fc: [
        "Akrabalık bildiren kelimelerin yazımı nedir?",
        "Küçük harfle başlar: Nimet ablama, Nezaket teyzemin."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Türkçeden Arapçaya geçmiş birçok kelime vardır.\" cümlesinde dil adlarına çekim eki getirilmiştir. Bu eklerin yazımı için hangisi doğrudur?",
      secenekler: [
        "Kesme işaretiyle ayrılmaz",
        "Kesme işaretiyle ayrılır",
        "Ek ayrı sözcük olarak yazılır",
        "Ek büyük harfle yazılır"
      ],
      cozum:
        "Dil ve lehçe adları büyük harfle başlar; ancak bunlara gelen çekim ekleri kesinlikle kesme işaretiyle ayrılmaz: Türkçeden, Arapçaya.",
      fc: [
        "Dil adlarına gelen eklerin yazımı nedir?",
        "Kesme işaretiyle ayrılmaz: Türkçeden, Arapçaya."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Van Gölü\" ve \"Ağrı Dağı\" yazımlarında tür bildiren ikinci sözcük büyük harfle başlamıştır. Buna karşılık hangi yazımda ikinci sözcük küçük harfle başlar?",
      secenekler: [
        "Kocaeli ili",
        "Van Gölü",
        "Çanakkale Boğazı",
        "Fırat Nehri"
      ],
      cozum:
        "Özel ada dâhil olup tamlama kuran göl, dağ, boğaz gibi sözler büyük harfle başlar; özel ada dâhil olmayan il, ilçe, köy sözleri ise küçük harfle başlar: Kocaeli ili.",
      fc: [
        "Yer adlarında tür bildiren sözcüklerin yazımı nedir?",
        "Özel ada dâhilse büyük (Van Gölü), değilse küçük (Kocaeli ili) yazılır."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir metinde \"ikişer, üçer, onar, yüzer\" sözcükleri rakamla değil yazıyla yazılmıştır. Bu yazım hangi sayı türüyle ilgilidir?",
      secenekler: [
        "Üleştirme sayıları",
        "Sıra sayıları",
        "Kesirli sayılar",
        "Çokluk sayıları"
      ],
      cozum:
        "Üleştirme sayıları rakamla değil yazıyla belirtilir: ikişer, üçer, onar, yüzer.",
      fc: [
        "Üleştirme sayılarının yazımı nedir?",
        "Rakamla değil yazıyla yazılır: ikişer, üçer, onar, yüzer."
      ]
    },
    {
      bi: 2,
      metin:
        "\"420185\" ve \"52680250\" sayıları metne aktarılırken üçlü gruplara ayrılmış ve aralarına nokta konmuştur. Bu kural hangi sayılar için geçerlidir?",
      secenekler: [
        "Beş ve daha çok basamaklı sayılar",
        "İki basamaklı sayılar",
        "Yalnızca tarih sayıları",
        "Yalnızca kesirli sayılar"
      ],
      cozum:
        "Beş ve beşten çok rakamlı sayılar sondan sayılmak üzere üçlü gruplara ayrılır ve araya nokta konur: 420.185.",
      fc: [
        "Büyük sayıların yazımı nedir?",
        "Beş ve daha çok basamaklı sayılar üçlü gruplara ayrılır, araya nokta konur."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Kitabı kütüphanede unutmuşum.\" cümlesindeki \"-de\" çıkarıldığında cümlenin anlamı bozulmaktadır. Buna göre bu \"-de\" hangi görevdedir?",
      secenekler: [
        "Bulunma hâl eki",
        "Bağlaç",
        "Yapım eki",
        "Soru eki"
      ],
      cozum:
        "Bulunma hâl eki sözcüğe bitişik yazılır ve cümleden çıkarıldığında anlam bozulur. Bağlaç olan \"de\" ise ayrı yazılır, çıkarıldığında anlamda büyük daralma olmaz.",
      fc: [
        "Bulunma hâl eki ile \"de\" bağlacının ayrımı nedir?",
        "Hâl eki bitişik yazılır ve çıkarılınca anlam bozulur; bağlaç ayrı yazılır."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Hâlâ dağları karlı Erzincan'da mısın?\" cümlesinde soru ekinden sonra kişi eki gelmiştir. Bu eklerin yazımı için hangisi doğrudur?",
      secenekler: [
        "Soru eki ayrı, sonraki ekler bitişik yazılır",
        "Soru eki de sonraki ekler de bitişik yazılır",
        "Soru eki bitişik, sonraki ekler ayrı yazılır",
        "İkisi de kesme işaretiyle ayrılır"
      ],
      cozum:
        "Soru eki mı, mi, mu, mü ayrı yazılır; ancak soru ekinden sonra gelen ekler bu eke bitişik yazılır: mısın, miydi, müdür.",
      fc: [
        "Soru ekinin yazımı nedir?",
        "Soru eki ayrı yazılır, sonra gelen ekler ise ona bitişik yazılır: mısın, miydi."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Kuzey Amerika\" ve \"Amerika'nın kuzeyi\" yazımlarında yön bildiren sözcük farklı harflerle yazılmıştır. Bu farkın nedeni hangisidir?",
      secenekler: [
        "Özel isimden önce gelince büyük, sonra gelince küçük yazılması",
        "Yön adlarının her zaman büyük yazılması",
        "Yön adlarının her zaman küçük yazılması",
        "Ara yönlerin ayrı yazılması"
      ],
      cozum:
        "Yer-yön bildiren sözcükler özel isimden önce kullanıldığında büyük, sonra kullanıldığında küçük harfle başlar; ara yönler bitişik yazılır: Güneydoğu Anadolu.",
      fc: [
        "Yön adlarının yazımı nedir?",
        "Özel isimden önce büyük, sonra küçük yazılır; ara yönler bitişik yazılır."
      ]
    }
  ]
});

/* ---------------- 5) NOKTALAMA İŞARETLERİ ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u04_k05",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Noktalama İşaretleri",
  kazanim:
    "Noktalama işaretlerini işlevlerine göre cümlede doğru biçimde kullanabilme.",
  kaynak: "10. sınıf Noktalama İşaretleri notları (Mustafa Çiftçi), 12 s.",
  kaynak_dosya: "Noktalama.Isaretleri.pdf",
  beceriler: [
    "Nokta, virgül ve noktalı virgülün işlevlerini belirler.",
    "Kesme, tırnak ve üç noktanın kullanım yerlerini ayırt eder.",
    "Noktalama işaretlerinin kullanılmadığı yerleri çözümler."
  ],
  items: [
    {
      bi: 0,
      metin:
        "\"Yol açılmış, biriken vasıtalar sel halinde akmaya başlamıştı.\" cümlesi sıralı bir cümledir ve sonuna nokta konmuştur. Nokta için hangisi söylenebilir?",
      secenekler: [
        "Tamamlanmış cümlenin sonuna konur",
        "Yalnızca kısaltmalardan sonra konur",
        "Yalnızca sayılarda kullanılır",
        "Cümle içinde açıklama başlatır"
      ],
      cozum:
        "Nokta, tamamlanmış cümlenin sonuna konur; sıralı ve devrik cümlelerde de kullanılır, bazı kısaltmaların sonuna da gelir.",
      fc: [
        "Nokta nedir?",
        "Tamamlanmış cümlenin sonuna ve bazı kısaltmaların sonuna konan işarettir."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Final sınavı 10.45'te başlamış.\" cümlesinde saat ve dakika gösteren sayılar birbirinden ayrılmıştır. Bu ayırma hangi işaretle yapılır?",
      secenekler: ["Nokta", "Virgül", "İki nokta", "Kısa çizgi"],
      cozum:
        "Saat ve dakika gösteren sayıları birbirinden ayırmak için nokta konur: 10.45'te.",
      fc: [
        "Saat ile dakikanın ayrılması nedir?",
        "Nokta konur: 10.45'te."
      ]
    },
    {
      bi: 0,
      metin:
        "\"1.000\" ve \"57.435.124\" yazımlarında sayılar sondan sayılmak üzere üçlü gruplara ayrılmıştır. Bu grupların arasına hangi işaret konur?",
      secenekler: ["Nokta", "Virgül", "Kesme", "Eğik çizgi"],
      cozum:
        "Dört ve dörtten çok rakamlı sayılar üçlü gruplara ayrılır ve araya nokta konur.",
      fc: [
        "Dört ve daha çok basamaklı sayıların gruplanması nedir?",
        "Üçlü gruplara ayrılır ve araya nokta konur: 57.435.124."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Portakal suyu, yumurta, peynir, bal masada kendisini bekliyordu.\" cümlesinde sıralanan eş görevli sözcüklerin arasına işaret konmuştur. Bu işaret hangisidir?",
      secenekler: ["Virgül", "Noktalı virgül", "İki nokta", "Nokta"],
      cozum:
        "Birbiri ardınca sıralanan eş görevli sözcük ve sözcük gruplarının arasına virgül konur.",
      fc: [
        "Eş görevli sözcüklerin ayrılması nedir?",
        "Virgül konur: portakal suyu, yumurta, peynir, bal."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Peki, dediğin gibi olsun.\" cümlesinde ret, kabul veya teşvik bildiren sözden sonra bir işaret kullanılmıştır. Bu işaret hangisidir?",
      secenekler: ["Virgül", "İki nokta", "Noktalı virgül", "Ünlem"],
      cozum:
        "Kendisinden sonraki cümleye bağlı olarak ret, kabul ve teşvik bildiren evet, hayır, peki gibi sözlerden sonra virgül konur.",
      fc: [
        "\"Evet, hayır, peki\" sözlerinden sonra gelen işaret nedir?",
        "Virgül konur: Peki, dediğin gibi olsun."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Bu sözleri duydukça aklı çıkacak gibi oluyordu.\" cümlesinde zarf-fiil eki almış sözcükten sonra virgül kullanılmamıştır. Buna göre hangi durumda virgül konmaz?",
      secenekler: [
        "Zarf-fiil eki almış sözcüklerden sonra",
        "Eş görevli sözcükler arasında",
        "Sıralı cümleler arasında",
        "Hitaplardan sonra"
      ],
      cozum:
        "Metin içinde zarf-fiil eki almış kelimelerden sonra virgül konmaz; de/da, ve, veya, yahut gibi bağlaçlardan önce de sonra da virgül konmaz.",
      fc: [
        "Virgülün konmadığı yerler nedir?",
        "Zarf-fiil eki almış sözcüklerden sonra ve bağlaçlardan önce/sonra konmaz."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Anasına bak, kızını al; kenarına bak, bezini al.\" cümlesinde ögeleri arasında virgül bulunan sıralı cümleler ayrılmıştır. Bu ayırma hangi işaretle yapılmıştır?",
      secenekler: ["Noktalı virgül", "Virgül", "İki nokta", "Üç nokta"],
      cozum:
        "Ögeleri arasında virgül bulunan sıralı cümleleri birbirinden ayırmak için noktalı virgül konur.",
      fc: [
        "Noktalı virgül nedir?",
        "Ögeleri arasında virgül bulunan sıralı cümleleri ayıran işarettir."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Gecenin koyu karanlığında rüzgârda sokak korkusu...\" cümlesi anlatım bakımından tamamlanmamıştır. Bu cümlenin sonuna hangi işaret konur?",
      secenekler: ["Üç nokta", "Nokta", "Noktalı virgül", "Kesme"],
      cozum:
        "Anlatım olarak tamamlanmamış cümlelerin sonuna üç nokta konur. Yüklemi ortak kullanılan sıralı cümlelerin sonunda ise üç nokta kullanılmaz.",
      fc: [
        "Üç nokta nedir?",
        "Anlatım olarak tamamlanmamış cümlelerin sonuna konan işarettir."
      ]
    },
    {
      bi: 2,
      metin:
        "\"İnanın, Mustafa Kemaller tükenmez.\" ve \"Palamut, Karadenizli balıkçının yüzünü güldürdü.\" cümlelerinde özel ada gelen ekler kesmeyle ayrılmamıştır. Bu yazım hangi kurala dayanır?",
      secenekler: [
        "Çokluk ve yapım ekleri kesmeyle ayrılmaz",
        "Bütün ekler kesmeyle ayrılır",
        "Özel adlar kesme almaz",
        "Çekim ekleri kesmeyle ayrılmaz"
      ],
      cozum:
        "Özel isimlere getirilen çokluk eki ile yapım ekleri ve bunlardan sonra gelen ekler kesme işaretiyle ayrılmaz: Mustafa Kemaller, Karadenizli.",
      fc: [
        "Kesme işaretinin kullanılmadığı yer nedir?",
        "Özel ada gelen çokluk ve yapım ekleri ile sonraki ekler kesmeyle ayrılmaz."
      ]
    },
    {
      bi: 1,
      metin:
        "Mustafa Kemal, hedefi \"Ordular ilk hedefiniz Akdeniz'dir!\" sözüyle göstermiştir. Başkasından olduğu gibi aktarılan söz hangi işaret içine alınır?",
      secenekler: ["Tırnak işareti", "Yay ayraç", "Köşeli ayraç", "Kısa çizgi"],
      cozum:
        "Başka bir kimseden veya yazıdan olduğu gibi aktarılan sözler tırnak içine alınır; alıntının sonundaki noktalama işareti tırnak içinde kalır.",
      fc: [
        "Tırnak işareti nedir?",
        "Başkasından olduğu gibi aktarılan sözleri içine alan işarettir."
      ]
    }
  ]
});
