#!/usr/bin/env node
/* DİN KÜLTÜRÜ 10 — kalite turu 3: tam kapsamlı denetimde ortaya çıkan
   7 havuzun (u02_k02..k05, u05_k03..k04) uyarıları */
"use strict";

module.exports = [
  {
    konu_id: "din_10_u02_k02",
    duzeltmeler: [
      {
        soru_id: "din_10_u02_k02_o04",
        secenekler: [
          "Evrenin varlığını kendisinden açıklayamadığını gösterir",
          "Evrende her şeyin tesadüfen oluştuğunu kanıtlar",
          "İnsanın ahlaki sorumluluğunu ortaya koyar",
          "İbadetlerin farz olduğunu temellendirir"
        ],
        dogru_index: 0,
        fc: ["Kozmolojik delilin dayandığı özellik nedir?", "Evrenin varlığını kendisinden açıklayamaması, yani sonradan var olması."]
      },
      { soru_id: "din_10_u02_k02_o02",
        fc: ["Evrenin sonradan var olmasının gerektirdiği nedir?", "Bir varlık sebebini, dolayısıyla bir yaratıcıyı gerektirir."] },
      { soru_id: "din_10_u02_k02_o03",
        fc: ["Hudûs delilinin diğer adı nedir?", "Kozmolojik delil; evrenin sonradan yaratıldığı öncülünden yola çıkar."] },
      { soru_id: "din_10_u02_k02_o07",
        fc: ["Kozmolojik delil ile teleolojik delil arasındaki fark nedir?", "Kozmolojik delil varlık ve hareketten, teleolojik delil düzen ve amaçtan yola çıkar."] },
      { soru_id: "din_10_u02_k02_o08",
        fc: ["Kozmolojik delilde sebep kavramının anlamı nedir?", "Sonradan var olan her şeyin varlığını bir başka varlığa borçlu olması."] }
    ]
  },
  {
    konu_id: "din_10_u02_k03",
    kartlar: [
      { soru_id: "din_10_u02_k03_o02",
        fc: ["Teleolojik delilin diğer adları nedir?", "Gaye ve nizam delili."] },
      { soru_id: "din_10_u02_k03_o05",
        fc: ["Teleolojik delilin kullandığı kanıtlar nedir?", "Doğadaki düzen, uyum ve amaçlılık örnekleri."] },
      { soru_id: "din_10_u02_k03_o09",
        fc: ["Teleolojik delilin başlangıç sorusu nedir?", "“Evrendeki düzen neden vardır, hangi amaca hizmet eder?”"] }
    ]
  },
  {
    konu_id: "din_10_u02_k04",
    duzeltmeler: [
      {
        soru_id: "din_10_u02_k04_o04",
        secenekler: [
          "Evrende düzen bulunmadığı ve amaçlılık görülmediği",
          "Evrenin bir başlangıcı olmadığı ve sonsuz olduğu",
          "Zihinde bulunan bir fikrin varlığı kanıtlamaya yetmeyeceği",
          "İnsanın dua etmediği ve dinî tecrübe yaşamadığı"
        ],
        dogru_index: 2,
        fc: ["Zihindeki kavramdan varlığa geçişin tartışmalı olmasının nedeni nedir?", "Kavramın zihinde bulunması, onun gerçekte var olduğunu göstermez."]
      },
      { soru_id: "din_10_u02_k04_o02",
        fc: ["En yetkin varlık fikri hangi delilin çıkış noktasıdır?", "Ontolojik delilin."] },
      { soru_id: "din_10_u02_k04_o06",
        fc: ["Ontolojik delilin yöntemi nedir?", "Deney ve gözlem değil, kavramlar üzerinden akıl yürütme."] },
      { soru_id: "din_10_u02_k04_o08",
        fc: ["Ontolojik delilin akılcı sayılmasının nedeni nedir?", "Deney ve gözlem yerine kavram ve akıl yürütmeye dayanması."] }
    ]
  },
  {
    konu_id: "din_10_u02_k05",
    kartlar: [
      { soru_id: "din_10_u02_k05_o02",
        fc: ["Bireyin kişisel dinî deneyimi hangi delilin kanıtıdır?", "Dinî tecrübe delilinin."] },
      { soru_id: "din_10_u02_k05_o04",
        fc: ["Öznel yaşantının kanıt sayılmamasının nedeni nedir?", "Herkes için geçerli ve aktarılabilir bir kanıt oluşturmaması."] },
      { soru_id: "din_10_u02_k05_o05",
        fc: ["Dinî tecrübenin davranış üzerindeki etkisi nedir?", "İnancı güçlendirerek davranışlara yön vermesi."] },
      { soru_id: "din_10_u02_k05_o07",
        fc: ["Dinî tecrübenin değerlendirilmesinde ölçüt nedir?", "Dinin temel öğretileriyle uyumunun gözetilmesi."] },
      { soru_id: "din_10_u02_k05_o09",
        fc: ["Dinî tecrübenin yaygınlığının gösterdiği nedir?", "Benzer manevi yaşantıların farklı kültürlerde de görülmesi."] },
      { soru_id: "din_10_u02_k05_o10",
        fc: ["Kavram temelli ve yaşantı temelli delillerin ortak niteliği nedir?", "Ontolojik delil kavramı, dinî tecrübe delili yaşantıyı esas alır."] }
    ]
  },
  {
    konu_id: "din_10_u05_k03",
    kartlar: [
      { soru_id: "din_10_u05_k03_o02",
        fc: ["Ehlisünnetin dayandığı temel kaynaklar nedir?", "Kur’an, sünnet ve sahabe icması."] },
      { soru_id: "din_10_u05_k03_o03",
        fc: ["Ehlisünnet içindeki itikadi yorumların adları nedir?", "Maturidilik ve Eş’arilik."] },
      { soru_id: "din_10_u05_k03_o04",
        fc: ["Ehlisünnetin fıkhi mezheplerinin adları nedir?", "Hanefilik, Şafiilik, Malikilik ve Hanbelilik."] },
      { soru_id: "din_10_u05_k03_o05",
        fc: ["İmanın göstergesi sayılan nedir?", "Amel; ameli imanı besler ancak imanın kendisi değildir."] },
      { soru_id: "din_10_u05_k03_o06",
        fc: ["Akıl ile nakil arasındaki denge hangi anlayışın özelliğidir?", "Ehlisünnetin “orta yol” anlayışının."] },
      { soru_id: "din_10_u05_k03_o08",
        fc: ["Kıyas, icma, sünnet ve Kur’an hangi sırayla uygulanır?", "Kur’an, sünnet, icma, kıyas (Ehlisünnet fıkhında delil sırası)."] },
      { soru_id: "din_10_u05_k03_o09",
        fc: ["Ehlisünnetin ihtilaf karşısındaki tutumu nedir?", "Ölçülü, birleştirici ve aşırılıktan uzak."] },
      { soru_id: "din_10_u05_k03_o10",
        fc: ["İsmaililiğin bağlı olduğu gelenek nedir?", "Şia."] }
    ]
  },
  {
    konu_id: "din_10_u05_k04",
    kartlar: [
      { soru_id: "din_10_u05_k04_o02",
        fc: ["Nass ve tayin hangi mezhebin imamet anlayışını açıklar?", "Şia’nın imamet anlayışını."] },
      { soru_id: "din_10_u05_k04_o05",
        fc: ["Ehlibeyt kavramının kapsamı nedir?", "Hz. Peygamber’in ev halkı ve yakınları."] },
      { soru_id: "din_10_u05_k04_o09",
        fc: ["Kur’an’ın vahiy olduğu ve temel iman esasları hangi iki gelenekte ortaktır?", "Şia ile Ehlisünnette."] }
    ]
  }
];
