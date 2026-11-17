#!/usr/bin/env node
/* ============================================================
   FELSEFE 10 — KALAN UYARILARIN KAPATILMASI
   · 12 soru "tanım/hatırlama" uyarısı → senaryo + sayı ile kavrama düzeyi
   · 2 soruda doğru şık uzunlukla ele veriyordu → şıklar dengelendi
   · 3 kart arka yüzü 220 kr sınırının üstündeydi → kısaltıldı
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/felsefe-tamlik.js
   ============================================================ */
"use strict";

const K = "fel_10_";
const duz = (konu_id, liste) => ({ konu_id, duzeltmeler: liste });

module.exports = [
  duz(K + "u02_k02", [
    {
      soru_id: K + "u02_k02_o03",
      metin: "Bir öğretmen tahtaya iki önerme yazıyor: “Bu odada 12 kişi var.” ve “Bu odada 12 kişi yok.” Aynı koşullarda biri doğru olduğunda diğerinin zorunlu olarak yanlış olduğu iki düşünce arasındaki bu ilişki nedir?"
    },
    {
      soru_id: K + "u02_k02_o09",
      metin: "Bir öğrenci tartışmada iki gerekçe sunuyor: “Sınav 3 oturumda yapıldı.” ve “Her oturum 40 dakika sürdü.” Ardından bu gerekçelerden “Sınav yorucu geçti.” iddiasına ulaşıyor. Gerekçelerin ve ulaşılan iddianın adları sırasıyla nedir?"
    },
    {
      soru_id: K + "u02_k02_o10",
      metin: "Bir öğretmen “Bu sınıftaki 30 öğrencinin tamamı geziye katıldı.” genel yargısını veriyor; ardından bu kuralı sınıfın bir üyesi olan Elif’e uygulayıp onun da katıldığı sonucuna varıyor. Bu akıl yürütme türü nedir?"
    },
    {
      soru_id: K + "u02_k02_o13",
      fc: [
        "Safsatının tanımı ve başlıca türleri nedir?",
        "Safsata, düşünceyi ileri sürerken ya da anlamaya çalışırken yapılan yanlış çıkarımdır. Genelleştirme özelden genele sıçrar, yetersiz örnek bütünü temsil etmez, yanlış sebep kanıtsız nedensellik kurar."
      ]
    }
  ]),
  duz(K + "u03_k01", [
    {
      soru_id: K + "u03_k01_o03",
      metin: "Bir kişi kırmızı bir elmayı bilincinde beliren renk, biçim ve tat olarak ele alıyor. Aynı elmayı arkadaşı da görüyor ama tadını almıyor. Kişinin ele aldığı bu görünüşü anlatan kavram nedir?"
    },
    {
      soru_id: K + "u03_k01_o05",
      metin: "Bir varlık farklı durumlar geçirse de onu o varlık yapan değişmez nitelikler inceleniyor: buz eriyip suya, su buharlaşıp gaza dönüşüyor ama H2O yapısı korunuyor. Bu incelemenin konusu nedir?"
    }
  ]),
  duz(K + "u04_k01", [
    {
      soru_id: K + "u04_k01_o03",
      metin: "Bir öğrenci laboratuvarda 3 farklı mineral örneğini tanımaya çalışıyor; kendisi bu örnekleri inceliyor, örnekler ise inceleniyor. Bu ilişkide öğrencinin ve incelenen nesnenin bilgi felsefesindeki adları sırasıyla nedir?"
    }
  ]),
  duz(K + "u04_k02", [
    {
      soru_id: K + "u04_k02_o02",
      metin: "Bir düşünür, insanın kullandığı kaynakların güvenilmez olabileceği gerekçesiyle kesin bilgi iddialarını askıya alıyor; 3 kez yapılan gözlemde de aynı sonuca varamıyor. Bu yaklaşım nedir?",
      secenekler: ["Dogmatizm", "Septisizm (şüphecilik)", "Rasyonalizm (akılcılık)", "Empirizm (deneycilik)"],
      dogru_index: 1
    }
  ]),
  duz(K + "u05_k01", [
    {
      soru_id: K + "u05_k01_o06",
      secenekler: ["Haz veren duygu", "Sorumluluk", "Öz varlık", "Sanı (doksa)"],
      dogru_index: 1
    }
  ]),
  duz(K + "u05_k02", [
    {
      soru_id: K + "u05_k02_o14",
      metin: "Bir kişi dürtülerini tanıyıp bilgi edinerek davranışlarını daha bilinçli yönlendiriyor; her hafta 2 saat ayırdığı bu farkındalık çalışmasıyla seçimlerini kendisi belirliyor. Bu özgürlük anlayışı nedir?"
    }
  ]),
  duz(K + "u06_k01", [
    {
      soru_id: K + "u06_k01_o04",
      metin: "Bir eleştirmen, 18. yüzyıldan kalma bir tablonun izleyicide beğeni ve estetik haz uyandıran niteliğini adlandırıyor; salondaki izleyicilerin çoğu da aynı hazzı duyduğunu söylüyor. Bu niteliğin kavramı nedir?"
    },
    {
      soru_id: K + "u06_k01_o07",
      metin: "Bir ziyaretçi müzede 4 heykeli tek tek izleyip her biri hakkında beğeni yargısı veriyor. Bu ilişkide ziyaretçinin ve heykelin estetik kavramlarıyla adları sırasıyla nedir?"
    }
  ]),
  duz(K + "u07_k02", [
    {
      soru_id: K + "u07_k02_o09",
      metin: "Bir yönetici, yetkisinin Tanrı tarafından verildiğini ve ilahi iradeyi uyguladığını ileri sürüyor; yasaların kaynağı olarak kutsal metinleri gösterip yönetimi tek kişinin iradesine dayandırıyor. Bu yönetim yaklaşımı nedir?"
    },
    {
      soru_id: K + "u07_k02_o13",
      fc: [
        "Ütopya ile distopya arasındaki ilişki nasıl tanımlanır?",
        "Ütopya gerçekleşmesi mümkün olmayan ideal toplumsal düzeni tasvir eder; adil, eşit ve özgür bir düzen sunar. Distopya ise baskı, adaletsizlik ve özgürlük kısıtlamalarının egemen olduğu düzeni anlatır."
      ]
    }
  ]),
  duz(K + "u08_k02", [
    {
      soru_id: K + "u08_k02_o04",
      metin: "Bir yaklaşım, Tanrı’nın var olduğuna ilişkin iddianın hiçbir kanıtla temellendirilemediğini belirtiyor ve bu iddiayı kabul etmiyor; 4 temel teistik argümanı da yetersiz buluyor. Bu görüşün adı nedir?"
    },
    {
      soru_id: K + "u08_k02_o12",
      fc: [
        "Farabi'nin ruhun ölümsüzlüğü açıklaması nedir?",
        "Ruh bedenle birlikte meydana gelir ama sürmek için bedene ihtiyaç duymaz; faal akılla ilişkisi sayesinde ölümden sonra evrensel akılla birleşir. Bu ölümsüzlük, ruhunu bilgi ve erdemle geliştirenler için geçerlidir."
      ]
    }
  ])
];
