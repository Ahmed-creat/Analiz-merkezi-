#!/usr/bin/env node
/* ============================================================
   COĞRAFYA 10 · 7. ÜNİTE (BÖLGELER, ÜLKELER VE KÜRESEL BAĞLANTILAR)
   ------------------------------------------------------------
   Kaynak: MEB Coğrafya 10 (2025) — cografya.json.
   Basılı sayfa = PDF sayfası − 1.

     7.1 Türk Kültürünün Mekânsal Özellikleri       s.203-221

   Kullanım: node docs/uretim/uretim/cografya-t7.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Coğrafya";
const DOSYA = "cografya-10.pdf (MEB, 2025)";
const kaynak = s => "Coğrafya 10 ders kitabı, s." + s;

yazKonu({
  konu_id: "cogr_10_u07_k01",
  ders: DERS, tema: 7, tema_adi: "Bölgeler, Ülkeler ve Küresel Bağlantılar",
  baslik: "7.1 Türk Kültürünün Mekânsal Özellikleri",
  kazanim: "Türk dünyasının ortak kültürel özellikleri hakkında analojik çıkarım yapar.",
  kaynak: kaynak("203-221"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Türk kültürünün ocağını ve yayıldığı alanları açıklar.",
    "Türk dünyasının ortak kültürel özelliklerini ve kültürel mirasını çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir kültürün doğduğu, ortaya çıktığı ve dünyaya yayıldığı yere ne ad verilir?",
      secenekler: [
        "Kültür ocağı",
        "Kültürel miras",
        "Türk dünyası",
        "Somut olmayan miras"
      ],
      cozum: "Bir kültürün doğduğu, ortaya çıktığı ve dünyaya yayıldığı yere kültür ocağı denir; Türk kültürünün ocağı Orta Asya'dır (s.204).",
      fc: ["Kültür ocağı nedir?", "Kültürün doğup yayıldığı coğrafi alan."]
    },
    {
      bi: 0,
      metin: "Türklerin ilk ana yurdunun batı sınırı hangi doğal unsurlarla belirlenmiştir?",
      secenekler: [
        "Ural Dağları ve Hazar Denizi",
        "Kigan Dağları ve Sibirya Ormanları",
        "Amu Derya Irmağı ve Hindikuş Dağları",
        "Altay Dağları ve Baykal Gölü"
      ],
      cozum: "İlk ana yurdun sınırları; doğuda Kingan Dağları, kuzeyde Sibirya Ormanları, güneyde Amu Derya (Ceyhun) ile Hindikuş ve Altın dağları, batıda Ural Dağları ve Hazar Denizi arasındaki bölgedir (s.204).",
      fc: ["Türklerin ilk ana yurdu nedir?", "Altay Dağları merkezli, Ural-Hazar ile Kingan-Sibirya arasındaki Orta Asya alanı."]
    },
    {
      bi: 0,
      metin: "Aşkabat yakınlarında bulunan ve MÖ 4000-1000 yıllarına tarihlenen arkeolojik kültür hangisidir?",
      secenekler: [
        "Anav kültürü",
        "Kelteminar kültürü",
        "Karasuk kültürü",
        "Andranova kültürü"
      ],
      cozum: "Anav kültürü Aşkabat yakınlarında bulunmuş ve MÖ 4000-1000 yıllarına tarihlenmiştir; Türklerin atalarına ait en eski bulgular Orta Asya'dadır (s.204).",
      fc: ["Anav kültürü nedir?", "Aşkabat yakınlarında MÖ 4000-1000 arasına tarihlenen arkeolojik kültür."]
    },
    {
      bi: 0,
      metin: "Türkistan'dan çevre bölgelere yönelen kitlesel göçlerin temel nedeni hangisidir?",
      secenekler: [
        "Bölgenin kuraklaşması ve doğal kaynakların yetersiz kalması",
        "Bölgede sanayi tesislerinin kurulması",
        "Deniz ticaretinin gelişmesi",
        "Nüfusun azalması"
      ],
      cozum: "Türkistan'ın giderek kuraklaşması, doğal kaynakların yetersizliği ve nüfus artışı bölge dışına kitlesel göçlere yol açmıştır (s.204).",
      fc: ["Türk göçlerinin nedeni nedir?", "Kuraklaşma, kaynak yetersizliği, nüfus artışı ve çatışmalar."]
    },
    {
      bi: 0,
      metin: "MS 4. yüzyılda Hunların Hazar Denizi'nin kuzeyinden Karadeniz'in kuzeyine ve Doğu Avrupa'ya göç etmesi hangi adla anılır?",
      secenekler: [
        "Kavimler Göçü",
        "Büyük Okyanus göçü",
        "Anadolu'ya Oğuz göçü",
        "Saka akınları"
      ],
      cozum: "MS 4. yüzyılda Hunların Karadeniz'in kuzeyine ve Doğu Avrupa'ya göçü Kavimler Göçü olarak bilinir (s.204).",
      fc: ["Kavimler Göçü nedir?", "Hunların MS 4. yüzyılda Doğu Avrupa'ya yönelen kitlesel göçü."]
    },
    {
      bi: 0,
      metin: "Türklerin yaşadığı, devletler kurup hâkim olduğu ve Türk kültürünün yayıldığı bölgelere ne ad verilir?",
      secenekler: [
        "Türk dünyası",
        "Kültür ocağı",
        "Anav bölgesi",
        "Türkistan bozkırı"
      ],
      cozum: "Avrasya coğrafyasında Türklerin yaşadığı, devletler kurduğu ve kültürünün yayıldığı bölgelere Türk dünyası denir (s.204).",
      fc: ["Türk dünyası nedir?", "Ortak tarih, dil ve kültürü paylaşan Türk halklarının yaşadığı geniş coğrafya."]
    },
    {
      bi: 1,
      metin: "Eski Türklerde coğrafi yönlerin renklerle ifade edilmesinde 'gök' rengi hangi yönü temsil eder?",
      secenekler: [
        "Doğu",
        "Batı",
        "Kuzey",
        "Güney"
      ],
      cozum: "Kara kuzeyi, ak batıyı, kızıl güneyi, gök doğuyu temsil ediyordu; Türkler coğrafi unsurları adlandırırken renkleri kullanmıştır (s.209).",
      fc: ["Renklerle yön ifadesi nedir?", "Kara kuzey, ak batı, kızıl güney, gök doğu biçimindeki adlandırma."]
    },
    {
      bi: 1,
      metin: "Türkistan'da İslamiyet'in yayılmasında büyük rol oynayan ve 'Pîr-i Türkistan' olarak bilinen kişi kimdir?",
      secenekler: [
        "Hoca Ahmet Yesevi",
        "Ahi Evran",
        "Kaşgarlı Mahmut",
        "Yusuf Has Hacip"
      ],
      cozum: "Türkistan'da İslamiyet'in yayılmasında Pîr-i Türkistan olarak bilinen Hoca Ahmet Yesevi ve Horasan erenleri büyük rol oynamıştır (s.210).",
      fc: ["Türk-İslam kültürünün Anadolu'ya taşınması nedir?", "Yesevi'nin öğrencilerinin Anadolu'ya gelip kültürün gelişmesine katkı sağlaması."]
    },
    {
      bi: 1,
      metin: "Cami, öğrencilerin eğitim gördüğü birimler ve yoksullara yardım yapılan imaretlerin bir arada bulunduğu çok amaçlı yapılara ne ad verilir?",
      secenekler: [
        "Külliye",
        "Kervansaray",
        "Kurgan",
        "Lonca"
      ],
      cozum: "Camiler, eğitim birimleri ve imaretlerin bir arada bulunduğu çok amaçlı yapılara külliye denir (s.210).",
      fc: ["Külliye nedir?", "Cami, eğitim birimi ve imaretin bir arada bulunduğu yapı topluluğu."]
    },
    {
      bi: 1,
      metin: "Esnaf ve zanaatkârların kurduğu teşkilatların, Türkiye Selçukluları döneminde Ahi Evran tarafından kurulan hangi geleneğin devamı olduğu söylenir?",
      secenekler: [
        "Ahilik",
        "Kurgan geleneği",
        "Yaylak-kışlak geleneği",
        "Ant içme geleneği"
      ],
      cozum: "Osmanlı dönemindeki lonca teşkilatları ve günümüzdeki meslek odaları, Ahi Evran'ın kurduğu ahilik geleneğinin devamıdır (s.211).",
      fc: ["Ahilik nedir?", "Esnaf ve zanaatkârların dayanışma ve meslek ahlakı teşkilatı."]
    },
    {
      bi: 1,
      metin: "Türk dünyasında alfabe farklılıklarından doğan iletişim sorununu çözmek için 2024'te hangi karar alınmıştır?",
      secenekler: [
        "Latin alfabesi temelinde ortak Türk alfabesi oluşturulması",
        "Tüm ülkelerde Kiril alfabesine geçilmesi",
        "Arap alfabesinin ortak alfabe ilan edilmesi",
        "Runik alfabeye geri dönülmesi"
      ],
      cozum: "2024 yılında Türk Devletleri Teşkilatı bünyesinde Latin alfabesi temelinde ortak Türk alfabesi oluşturulması kararlaştırılmıştır (s.212).",
      fc: ["Ortak Türk alfabesi nedir?", "Latin alfabesi temelinde oluşturulan ortak yazı sistemi."]
    },
    {
      bi: 1,
      metin: "Aşağıdakilerden hangisi Türk dünyasının somut olmayan kültürel mirasına örnektir?",
      secenekler: [
        "Dede Korkut Hikâyeleri",
        "Orhun Yazıtları",
        "Tac Mahal",
        "Selimiye Camii"
      ],
      cozum: "Destanlar, hikâyeler, masallar ve anlatma gelenekleri somut olmayan kültürel mirası oluşturur; Dede Korkut Hikâyeleri bunun örneğidir (s.214).",
      fc: ["Somut olmayan kültürel miras nedir?", "Destan, masal, gelenek ve gösteri sanatları gibi maddi olmayan miras."]
    }
  ]
});
