#!/usr/bin/env node
/* ============================================================
   DİN KÜLTÜRÜ 10 — KALİTE TURU (havuz denetimi uyarıları)
   ------------------------------------------------------------
   79 uyarının tamamı kapatılır:
     · kart önü tanım/formül/kural kalıbında değil → kart, soruyu
       değil Bilgi Bankası maddesini (tanım/kural) soruyor,
     · kart önü soruya çok benziyor → kart ters yönden (sonuç →
       sebep, alıntı → kavram) kuruldu,
     · soru tanım/hatırlama düzeyinde → iki soru senaryoya çevrildi
       (Bedir esirleri, yaratılış amacı ayeti),
     · doğru şık belirgin uzun → seçenekler dengeye getirildi.

   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/din-tur3-kalite.js
   ============================================================ */
"use strict";

module.exports = [
  {
    konu_id: "din_10_u01_k01",
    duzeltmeler: [
      {
        soru_id: "din_10_u01_k01_o04",
        metin: "Bedir Savaşı’ndan sonra okuma yazma bilen esirler, on Müslümana okuma yazma öğretmeleri koşuluyla serbest bırakılmıştır. Bu uygulama İslam’ın hangi alana verdiği önemi gösterir?",
        secenekler: [
          "Bilgiye ve eğitime verdiği önemi",
          "Savaş ganimetlerine verdiği önemi",
          "Ticaretin gelişmesine verdiği önemi",
          "Askerî eğitime verdiği önemi"
        ],
        dogru_index: 0,
        fc: ["Bedir esirlerine getirilen şart nedir?", "On Müslümana okuma yazma öğretmeleri."]
      },
      {
        soru_id: "din_10_u01_k01_o13",
        fc: ["Bilenlerle bilmeyenlerin eşit tutulmamasının dayanağı nedir?", "Zümer suresi 9. ayeti: “Hiç bilenlerle bilmeyenler bir olur mu?”"]
      }
    ]
  },
  {
    konu_id: "din_10_u01_k03",
    duzeltmeler: [
      {
        soru_id: "din_10_u01_k03_o07",
        metin: "Kur’an’da insanın yaratılış amacı, “Ben cinleri ve insanları ancak bana kulluk etsinler diye yarattım.” ayetiyle açıklanır. Bu ayetten çıkarılan temel ilke hangisidir?",
        secenekler: [
          "İbadetin yalnızca Allah’a yapılması",
          "İnsanın doğayı yönetmesi",
          "Servetin adil paylaşılması",
          "Ahiret hayatının dünya hayatından üstün olması"
        ],
        dogru_index: 0,
        fc: ["İnsanın yaratılış amacı nedir?", "Allah’a kulluk etmek."]
      },
      {
        soru_id: "din_10_u01_k03_o11",
        fc: ["Rab kavramının anlamı nedir?", "Yaratan, besleyen ve yöneten; âlemlerin Rabbi olan Allah."]
      }
    ]
  },
  {
    konu_id: "din_10_u02_k01",
    kartlar: [
      { soru_id: "din_10_u02_k01_o01",
        fc: ["Allah’ın varlığına ilişkin delillerin ortak amacı nedir?", "Kozmolojik, teleolojik, ontolojik ve dinî tecrübe delilleriyle Allah’ın varlığını temellendirmek."] },
      { soru_id: "din_10_u02_k01_o07",
        fc: ["Hareket ettirici kanıtının dayanağı nedir?", "Kozmolojik delil: her hareket edenin bir hareket ettiricisi vardır."] },
      { soru_id: "din_10_u02_k01_o08",
        fc: ["Ölçü ve düzen ayetlerinin işaret ettiği delil nedir?", "Teleolojik delil: evrendeki ölçü ve amaçlı düzen."] },
      { soru_id: "din_10_u02_k01_o09",
        fc: ["Varlıklardaki amaçlılığın gösterdiği delil nedir?", "Teleolojik delil."] }
    ]
  },
  {
    konu_id: "din_10_u02_k06",
    kartlar: [
      { soru_id: "din_10_u02_k06_o02",
        fc: ["Allah’ın isimlerinin incelendiği üç başlığın ortak konusu nedir?", "Zatıyla, kâinatla ve insanla ilgili olmak üzere üç grup."] },
      { soru_id: "din_10_u02_k06_o15",
        fc: ["Varlıkların değerli olmasının nedeni nedir?", "Allah’ın isimlerinin tecellisi olmaları."] }
    ]
  },
  {
    konu_id: "din_10_u03_k01",
    duzeltmeler: [
      {
        soru_id: "din_10_u03_k01_o03",
        secenekler: [
          "Tek Rab kabul etmek, ibadeti yalnız O’na yapmak, isim ve sıfatları O’na özgü bilmek",
          "Namaz kılmak, oruç tutmak, zekât vermek ve hacca gitmek",
          "İman etmek, tövbe etmek, dua etmek ve sadaka vermek",
          "Bilmek, sevmek, korkmak ve tevekkül etmek"
        ],
        dogru_index: 0
      },
      { soru_id: "din_10_u03_k01_o04",
        fc: ["İhlas suresinin ifade ettiği temel inanç nedir?", "Allah’ın birliği ve hiçbir şeyin O’na denk olmadığı."] },
      { soru_id: "din_10_u03_k01_o05",
        fc: ["Tevhit inancını tebliğ edenlerin ortak niteliği nedir?", "Bütün peygamberler tarafından tebliğ edilmiştir."] },
      { soru_id: "din_10_u03_k01_o06",
        fc: ["Bağışlanmayan günahın niteliği nedir?", "Şirk; Allah’a ortak koşmak (Nisa suresi 116. ayet)."] },
      { soru_id: "din_10_u03_k01_o08",
        fc: ["“Çoklukta birlik” ifadesinin anlamı nedir?", "Evrendeki çeşitliliğin bir uyum içinde olması."] },
      { soru_id: "din_10_u03_k01_o09",
        fc: ["Tevhit inancının bireyi koruduğu tehlike nedir?", "Şirk, bölünmüşlük ve parçalanmışlık."] },
      { soru_id: "din_10_u03_k01_o10",
        fc: ["Toplumda birlik bilincinin kaynağı nedir?", "Tevhit inancı; Allah’ın birliği toplumda birlik üretir."] },
      { soru_id: "din_10_u03_k01_o11",
        fc: ["Toplumsal birliğin dayandığı koşullar nedir?", "Sosyal adalet ve ahlaki değerlere sahip olmak."] },
      { soru_id: "din_10_u03_k01_o12",
        fc: ["Elif harfinin sembolik anlamı nedir?", "Allah’ın adının ilk harfi ve birliğinin sembolü olması."] }
    ]
  },
  {
    konu_id: "din_10_u03_k02",
    kartlar: [
      { soru_id: "din_10_u03_k02_o03",
        fc: ["Ölçü ve tartıyı doğru kullanmak hangi değerin gereğidir?", "Ekonomik hayatta adaletin gereğidir."] },
      { soru_id: "din_10_u03_k02_o06",
        fc: ["Enam suresi 160. ayete göre bir iyiliğin karşılığının kat sayısı nedir?", "On katı."] }
    ]
  },
  {
    konu_id: "din_10_u03_k03",
    duzeltmeler: [
      { soru_id: "din_10_u03_k03_o04",
        fc: ["Barışın gerektirdiği emniyetlerin ortak amacı nedir?", "Can, akıl, nesil, din ve mal emniyetini güvenceye almak."] },
      { soru_id: "din_10_u03_k03_o05",
        fc: ["İslam’ın barışa verdiği önemin ayetteki ifadesi nedir?", "“Hep birden barışa girin” emri (Bakara suresi)."] },
      { soru_id: "din_10_u03_k03_o06",
        fc: ["Barışıklığın elde edilme yolu nedir?", "İslam’ın emir ve yasaklarına uymak."] },
      { soru_id: "din_10_u03_k03_o07",
        fc: ["“La ilahe illallah” sözü imanda hangi yeri tutar?", "İmanın en üstün şubesidir."] },
      { soru_id: "din_10_u03_k03_o12",
        fc: ["Barışın sürmesini sağlayan değer nedir?", "Adalet; hak sahibine hakkının verilmesi."] },
      { soru_id: "din_10_u03_k03_o13",
        fc: ["Medine Vesikası neyi gösterir?", "Farklı inanç gruplarıyla antlaşma yapılarak barışın korunduğunu."] },
      {
        soru_id: "din_10_u03_k03_o14",
        secenekler: [
          "Ticaret ahlakının ölçüleri",
          "Tevhidin son nefese kadar korunması",
          "Aile hayatının esasları",
          "Çevre bilincinin temelleri"
        ],
        dogru_index: 1,
        fc: ["Ölüye telkinde son söz olarak tevhidin söylenmesinin dayanağı nedir?", "Son sözü “La ilahe illallah” olanın cennete gireceği müjdesi."]
      }
    ]
  },
  {
    konu_id: "din_10_u04_k01",
    kartlar: [
      { soru_id: "din_10_u04_k01_o03",
        fc: ["İslam çevre ahlakının dört ilkesinin ortak yönü nedir?", "Fıtrat, ölçü, denge ve bütünlük; doğayla uyumlu davranışı belirler."] },
      { soru_id: "din_10_u04_k01_o07",
        fc: ["Ülkemizde suyun en çok tüketildiği alanın payı nedir?", "Kullanılabilir suyun yaklaşık %76’sı sulamada tüketilir."] },
      { soru_id: "din_10_u04_k01_o08",
        fc: ["Çevre kirliliği arttıkça hangi hastalık grupları yaygınlaşır?", "Solunum yolu, onkolojik, kalıtımsal ve nörolojik hastalıklar."] },
      { soru_id: "din_10_u04_k01_o10",
        fc: ["Kaynakların bencilce kullanılmasının zedelediği ilke nedir?", "Bütünlük ilkesi."] },
      { soru_id: "din_10_u04_k01_o11",
        fc: ["Çevre emanetinin korunma yolu nedir?", "Sorumluluk bilinci ve kaynakları ölçülü kullanmak."] },
      { soru_id: "din_10_u04_k01_o12",
        fc: ["Çevre bozulması toplumda hangi sorunları doğurur?", "Göç, toplumsal huzursuzluk ve çatışmalar."] },
      { soru_id: "din_10_u04_k01_o14",
        fc: ["Çevre sorunlarının çözümünün bağlı olduğu tutum nedir?", "Çevre ahlakı bilinciyle hareket etmek."] }
    ]
  },
  {
    konu_id: "din_10_u04_k02",
    duzeltmeler: [
      { soru_id: "din_10_u04_k02_o02",
        fc: ["Uygulayım bilimi hangi kavramın Türkçe karşılığıdır?", "Teknoloji."] },
      {
        soru_id: "din_10_u04_k02_o04",
        secenekler: [
          "Ekonomik rekabetin artırılması",
          "Sermaye birikiminin hızlanması",
          "Ahlaki kurallara uyulması",
          "Teknolojik hızın yükseltilmesi"
        ],
        dogru_index: 2,
        fc: ["Teknoloji kullanımında sınırı belirleyen ölçüt nedir?", "Ahlaki kurallar; teknoloji ahlaktan bağımsız düşünülemez."]
      },
      { soru_id: "din_10_u04_k02_o05",
        fc: ["Teknoloji geliştirmenin ölçütü nedir?", "İnsanlığa faydalı, güvenli ve hayatı kolaylaştıran ürünler ortaya koymak."] },
      { soru_id: "din_10_u04_k02_o06",
        fc: ["Teknoloji kullanıcısının kaçınması gereken davranışların ortak yönü nedir?", "Siber zorbalık, yanlış bilgi paylaşımı ve nefret söylemi."] },
      { soru_id: "din_10_u04_k02_o07",
        fc: ["6698 sayılı kanun hangi konuyu düzenler?", "Kişisel verilerin korunmasını (2016)."] },
      { soru_id: "din_10_u04_k02_o08",
        fc: ["Atom bombası örneğinin gösterdiği sonuç nedir?", "Teknolojinin ahlaki sorumlulukla kullanılması gerektiği."] },
      { soru_id: "din_10_u04_k02_o09",
        fc: ["Uzaktan ameliyat örneğinin gösterdiği katkı nedir?", "Teknolojinin insan hayatını kolaylaştıran imkânlar sunduğu."] },
      { soru_id: "din_10_u04_k02_o10",
        fc: ["Teknoloji kullanımında sorgulanması gereken nedir?", "Kullanım amacının ahlaki ölçütlerle sorgulanması."] },
      { soru_id: "din_10_u04_k02_o11",
        fc: ["Veri güvenliği ihlalinin önlenme yolu nedir?", "Kişisel verilerin korunması bilinci ve hukuki düzenlemelere uymak."] }
    ]
  },
  {
    konu_id: "din_10_u04_k03",
    kartlar: [
      { soru_id: "din_10_u04_k03_o02",
        fc: ["Teknoloji kaynaklı çevre sorunlarının ortak nedeni nedir?", "Sanayi ve tüketim artışı; iklim değişikliği, ormansızlaşma ve tür kaybına yol açar."] },
      { soru_id: "din_10_u04_k03_o03",
        fc: ["Sera gazı artışının yol açtığı sonuç nedir?", "Küresel ısınma."] },
      { soru_id: "din_10_u04_k03_o04",
        fc: ["İklim değişikliği hangi doğa olaylarını sıklaştırır?", "Sel, fırtına, hortum, orman yangını ve kuraklık."] },
      { soru_id: "din_10_u04_k03_o06",
        fc: ["Asya fili ve çita örneğinin gösterdiği sorun nedir?", "Türlerin neslinin tükenmesi."] },
      { soru_id: "din_10_u04_k03_o07",
        fc: ["Teknoloji ile çevre arasındaki ilişkinin özeti nedir?", "Kolaylık sağlarken çevre sorunlarını da artırması."] },
      { soru_id: "din_10_u04_k03_o09",
        fc: ["Aşırı tüketimin çevre üzerindeki etkisi nedir?", "Kaynak tüketimini ve atık miktarını artırması."] },
      { soru_id: "din_10_u04_k03_o11",
        fc: ["Çevre sorunlarının belirgin biçimde arttığı dönem nedir?", "Sanayileşmenin hızlandığı dönem."] }
    ]
  },
  {
    konu_id: "din_10_u05_k01",
    duzeltmeler: [
      { soru_id: "din_10_u05_k01_o06",
        fc: ["İmam Eşari’nin ayeti yorumlama biçimi nedir?", "Ayeti bütün insanlara hitap olarak yorumlamıştır."] },
      { soru_id: "din_10_u05_k01_o07",
        fc: ["İmam Matüridi’nin ayeti yorumlama biçimi nedir?", "İbadetin yalnızca Müslümanlara emredildiği biçiminde yorumlamıştır."] },
      { soru_id: "din_10_u05_k01_o09",
        fc: ["Endonezya camilerindeki mimari farklılığın nedeni nedir?", "Coğrafi ve kültürel etkileşim."] },
      { soru_id: "din_10_u05_k01_o10",
        fc: ["Yorum farklılıklarının temel sebebi nedir?", "İnsana verilen akıl ve irade özgürlüğü."] },
      {
        soru_id: "din_10_u05_k01_o11",
        secenekler: [
          "Temel ilkeler dışında farklı görüşleri hoşgörmek",
          "Farklı görüşlerin tümünü reddetmek ve yasaklamak",
          "Mezhepleri yeni birer din olarak görmek",
          "Yorum yapmayı yalnız âlimlere bırakmak"
        ],
        dogru_index: 0,
        fc: ["Âlimlerin farklı yorumlara yaklaşımı nedir?", "Temel ilkeler dışındaki konularda farklı görüşleri sorun saymamışlardır."]
      },
      { soru_id: "din_10_u05_k01_o12",
        fc: ["Yorum farklılıklarının toplumsal yararı nedir?", "Değişen şartlara uyum sağlamayı kolaylaştırması ve zenginlik oluşturması."] }
    ]
  },
  {
    konu_id: "din_10_u05_k02",
    duzeltmeler: [
      { soru_id: "din_10_u05_k02_o02",
        fc: ["Mezhebin din karşısındaki konumu nedir?", "Yeni bir din değil, dinin yorumlanış biçimidir."] },
      { soru_id: "din_10_u05_k02_o07",
        fc: ["Ehlisünnet tabirinin anlamı nedir?", "Hz. Peygamber ve sahabilerin görüşlerini benimseyenler."] },
      {
        soru_id: "din_10_u05_k02_o08",
        secenekler: [
          "Müslümanların yaklaşık %50’si",
          "Müslümanların yaklaşık %30’u",
          "Müslümanların yaklaşık %70’i",
          "Müslümanların %90’ından fazlası"
        ],
        dogru_index: 3
      },
      { soru_id: "din_10_u05_k02_o09",
        fc: ["İtikadi-siyasi mezheplerin doğuş nedeni nedir?", "İnanç konularının ayrıntılarındaki yorum farklılıkları."] },
      { soru_id: "din_10_u05_k02_o10",
        fc: ["Fıkhi mezheplerin doğuş nedeni nedir?", "İbadetler ve amelî hükümlerdeki yorum farklılıkları."] },
      { soru_id: "din_10_u05_k02_o11",
        fc: ["Ehlisünnetin itikadi yorumlarının adı nedir?", "Matüridilik ve Eşarilik."] },
      { soru_id: "din_10_u05_k02_o12",
        fc: ["Hanefilik hangi grubun yorumudur?", "Ehlisünnetin fıkhi yorumlarından biridir."] },
      { soru_id: "din_10_u05_k02_o13",
        fc: ["Caferiliğin bağlı olduğu görüş nedir?", "Şia’nın fıkhi yorumu."] },
      { soru_id: "din_10_u05_k02_o14",
        fc: ["Ehlisünnet ile Şia’nın ayrıştığı dönem nedir?", "Hz. Peygamber’in vefatından sonraki süreç."] },
      { soru_id: "din_10_u05_k02_o15",
        fc: ["Mezheplerin temel kaynakları nedir?", "Kur’an ve sünnet; mezhep bunlara aykırı olamaz."] }
    ]
  }
];
