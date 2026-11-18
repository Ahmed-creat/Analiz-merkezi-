#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — 3. TUR ONARIM (havuz denetimi hataları)
   ------------------------------------------------------------
   Denetimin bildirdiği kusurlar ve karşılığı:
     · "kart önü sorunun kopyası" → kart, soruyu tekrarlamak yerine
       kavramı/bağıntıyı ters yönden soruyor (birim ↔ büyüklük,
       olay → koşul, sonuç → neden),
     · "soru kökü 30 karakterden kısa" → kökler bağlam eklenerek
       genişletildi,
     · "metin grafikte/devrede diyor ama görsel yok" → veriler kökün
       içine yazıldı, görsel atfı kaldırıldı,
     · "seçenekler birbirinin aynısı" → normalizasyonda çakışan
       sayılar (75 / 7,5 · 11 / 1,1) gerçekten farklı değerlerle
       değiştirildi.

   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/fizik-tur3-onar.js
   ============================================================ */
"use strict";

module.exports = [
  {
    konu_id: "fizik_10_u01_k01",
    kartlar: [
      { soru_id: "fizik_10_u01_k01_o02",
        fc: ["Sürat ile hız arasındaki temel ayrım nedir?", "Sürat skalerdir (yalnız büyüklük), hız vektöreldir (büyüklük + yön)."] },
      { soru_id: "fizik_10_u01_k01_o04",
        fc: ["Bir cismin hızı sabitse eşit zaman aralıklarında aldığı yol için ne söylenir?", "Eşittir; konum zamanla doğrusal olarak değişir."] }
    ]
  },
  {
    konu_id: "fizik_10_u02_k01",
    duzeltmeler: [
      {
        soru_id: "fizik_10_u02_k01_o02",
        metin: "İşin SI birim sistemindeki birimi aşağıdakilerden hangisidir?",
        fc: ["İş hangi birimle ölçülür ve bu birim nasıl tanımlanır?", "Joule (J); 1 J = 1 N·m."]
      },
      {
        soru_id: "fizik_10_u02_k01_o03",
        metin: "1 N·m’lik iş kaç joule değerine eşittir?",
        fc: ["Joule ile newton-metre arasındaki ilişki nedir?", "1 J = 1 N·m; aynı büyüklüğü gösterirler."]
      },
      {
        soru_id: "fizik_10_u02_k01_o04",
        metin: "İş, matematiksel özelliği bakımından nasıl bir büyüklüktür?",
        fc: ["İşin skaler olması ne anlama gelir?", "Yalnız büyüklüğü vardır, yönü yoktur."]
      },
      {
        soru_id: "fizik_10_u02_k01_o08",
        metin: "40 N’luk sabit kuvvet, bir cismi 10 m yer değiştirirken etki etmiştir. Bu kuvvetin yaptığı iş kaç joule’dür?",
        fc: ["Kuvvet-yol ilişkisinde yapılan iş hangi geometrik büyüklüğe karşılık gelir?", "Kuvvet-yol grafiğinin altında kalan alana."]
      }
    ]
  },
  {
    konu_id: "fizik_10_u02_k04",
    kartlar: [
      { soru_id: "fizik_10_u02_k04_o03",
        fc: ["Sürdürülebilir enerji üretiminin ölçütü nedir?", "Doğal dengeyi bozmamak ve kaynağın kendini yenileyebilmesi."] },
      { soru_id: "fizik_10_u02_k04_o04",
        fc: ["Uranyum neden tükenebilir bir yakıt sayılır?", "Rezervleri sınırlıdır; kendini yenilemesi mümkün değildir."] },
      { soru_id: "fizik_10_u02_k04_o05",
        fc: ["Enerji etiketinde A sınıfı neyi gösterir?", "En yüksek verimliliği, yani aynı iş için en az enerji tüketimini."] }
    ]
  },
  {
    konu_id: "fizik_10_u02_k05",
    duzeltmeler: [
      {
        soru_id: "fizik_10_u02_k05_o01",
        fc: ["İş-enerji teoremi neyi ifade eder?", "Net kuvvetin yaptığı iş, cismin kinetik enerji değişimine eşittir."]
      },
      {
        soru_id: "fizik_10_u02_k05_o02",
        metin: "Fizikte güç kavramı aşağıdakilerden hangisiyle tanımlanır?"
      },
      {
        soru_id: "fizik_10_u02_k05_o03",
        metin: "Gücün SI birim sistemindeki birimi aşağıdakilerden hangisidir?"
      },
      {
        soru_id: "fizik_10_u02_k05_o04",
        metin: "1 kilowatt kaç watt değerine eşittir?"
      },
      {
        soru_id: "fizik_10_u02_k05_o06",
        fc: ["Güç, iş ve zaman arasındaki bağıntı nedir?", "P = W / t; 7200 J / 60 s = 120 W."]
      },
      {
        soru_id: "fizik_10_u02_k05_o08",
        secenekler: ["30", "0,75", "7,5", "150"],
        dogru_index: 2,
        fc: ["Kaldırma işinde harcanan güç hangi bağıntıyla hesaplanır?", "P = m·g·h / t; 5000 · 10 · 3 / 20 = 7500 W = 7,5 kW."]
      }
    ]
  },
  {
    konu_id: "fizik_10_u03_k01",
    kartlar: [
      { soru_id: "fizik_10_u03_k01_o01",
        fc: ["Ohm (Ω) hangi fiziksel büyüklüğün birimidir?", "Direncin birimi."] },
      { soru_id: "fizik_10_u03_k01_o07",
        fc: ["Akım şiddetini ölçen aracın bağlanma biçimi nedir?", "Seri bağlanır; akım kollara ayrılmadan üzerinden geçer."] },
      { soru_id: "fizik_10_u03_k01_o08",
        fc: ["Gerilimi ölçen aracın bağlanma biçimi nedir?", "Paralel bağlanır; ölçülecek uçların gerilim farkını alır."] },
      { soru_id: "fizik_10_u03_k01_o10",
        fc: ["Volt hangi büyüklüğün birimidir?", "Potansiyel farkın (gerilimin)."] }
    ]
  },
  {
    konu_id: "fizik_10_u03_k02",
    duzeltmeler: [
      {
        soru_id: "fizik_10_u03_k02_o02",
        fc: ["Coulomb hangi büyüklüğün birimidir?", "Elektrik yükünün."]
      },
      {
        soru_id: "fizik_10_u03_k02_o05",
        metin: "Akım şiddetinin SI birim sistemindeki birimi aşağıdakilerden hangisidir?",
        fc: ["Amper hangi büyüklüğün birimidir?", "Akım şiddetinin."]
      },
      {
        soru_id: "fizik_10_u03_k02_o10",
        metin: "Elektrik akımının şiddetini ölçmek için kullanılan araç hangisidir?",
        fc: ["Ampermetrenin ölçtüğü büyüklük nedir?", "Akım şiddeti."]
      }
    ]
  },
  {
    konu_id: "fizik_10_u03_k03",
    kartlar: [
      { soru_id: "fizik_10_u03_k03_o03",
        fc: ["Direnç, gerilim ile akım arasındaki ilişkiden nasıl elde edilir?", "Gerilim-akım doğrusunun eğimi direnci verir: R = V / I."] }
    ]
  },
  {
    konu_id: "fizik_10_u03_k04",
    duzeltmeler: [
      {
        soru_id: "fizik_10_u03_k04_o01",
        fc: ["Eşdeğer direnci dirençlerin toplamına eşit olan bağlama türü nedir?", "Seri bağlama: R_eş = R₁ + R₂ + …"]
      },
      {
        soru_id: "fizik_10_u03_k04_o07",
        fc: ["İki direnç paralel bağlandığında eşdeğer direnç hangi sınırlar arasında olur?", "Her iki dirençten de küçüktür; 6 Ω ∥ 3 Ω = 2 Ω."]
      },
      {
        soru_id: "fizik_10_u03_k04_o08",
        metin: "3, 4 ve 5 Ω’luk dirençler seri bağlanmıştır. 5 Ω’luk direncin uçları arasındaki potansiyel fark 30 V ise akım kaç amperdir?"
      },
      {
        soru_id: "fizik_10_u03_k04_o09",
        metin: "3, 4 ve 5 Ω’luk dirençler seri bağlanmıştır ve üzerlerinden 6 A akım geçmektedir. Üretecin potansiyel farkı kaç volttur?"
      }
    ]
  },
  {
    konu_id: "fizik_10_u03_k05",
    duzeltmeler: [
      {
        soru_id: "fizik_10_u03_k05_o03",
        metin: "Özdeş üreteçler paralel bağlandığında hangi nicelik artar?",
        fc: ["Paralel bağlı özdeş üreteçlerin sağladığı toplam gerilim nasıl değişir?", "Değişmez, bir üretecin gerilimine eşit kalır; akım verme kapasitesi artar."]
      }
    ]
  },
  {
    konu_id: "fizik_10_u03_k07",
    duzeltmeler: [
      {
        soru_id: "fizik_10_u03_k07_o01",
        metin: "Topraklama uygulaması aşağıdakilerden hangisiyle tanımlanır?",
        fc: ["Toprağa gömülü iletkenin işlevi nedir?", "Kaçak akımı güvenli biçimde toprağa aktarır."]
      },
      {
        soru_id: "fizik_10_u03_k07_o03",
        metin: "Elektrik kaçağı (kaçak akım) aşağıdakilerden hangisiyle açıklanır?"
      },
      {
        soru_id: "fizik_10_u03_k07_o06",
        secenekler: ["0,11", "11", "110", "440"],
        dogru_index: 0
      }
    ]
  },
  {
    konu_id: "fizik_10_u04_k01",
    duzeltmeler: [
      {
        soru_id: "fizik_10_u04_k01_o01",
        metin: "Fizikte dalga kavramı aşağıdakilerden hangisiyle tanımlanır?"
      },
      {
        soru_id: "fizik_10_u04_k01_o03",
        metin: "Dalga boyu hangi SI birimiyle ifade edilir?"
      },
      {
        soru_id: "fizik_10_u04_k01_o04",
        metin: "Frekansın SI birim sistemindeki birimi hangisidir?",
        fc: ["Hertz hangi büyüklüğün birimidir?", "Frekansın (saniyedeki titreşim sayısının)."]
      },
      {
        soru_id: "fizik_10_u04_k01_o05",
        fc: ["Frekansı 5 Hz olan bir hareketin periyodu kaç saniyedir?", "T = 1 / f = 1 / 5 = 0,2 s."]
      }
    ]
  },
  {
    konu_id: "fizik_10_u04_k02",
    kartlar: [
      { soru_id: "fizik_10_u04_k02_o08",
        fc: ["Sesin yayılabilmesi için hangi koşul gereklidir?", "Maddesel (esnek) bir ortam; boşlukta ses yayılmaz."] }
    ]
  },
  {
    konu_id: "fizik_10_u04_k04",
    kartlar: [
      { soru_id: "fizik_10_u04_k04_o02",
        fc: ["Sarkaç periyodunda kütlenin ve küçük genliğin etkisi nedir?", "Etkisi yoktur; periyot yalnızca ip uzunluğu ve yerçekimi ivmesiyle belirlenir."] }
    ]
  },
  {
    konu_id: "fizik_10_u04_k06",
    duzeltmeler: [
      {
        soru_id: "fizik_10_u04_k06_o01",
        metin: "Rezonans olayı aşağıdakilerden hangisiyle tanımlanır?",
        fc: ["Doğal frekansıyla aynı frekansta zorlanan sistemde genliğe ne olur?", "Genlik belirgin biçimde büyür; bu olaya rezonans denir."]
      },
      {
        soru_id: "fizik_10_u04_k06_o07",
        metin: "Depremde merkez üssü ile odak noktası arasındaki ilişki nedir?",
        fc: ["Odağın yeryüzündeki iz düşümüne ne ad verilir?", "Merkez üssü (episantr)."]
      },
      {
        soru_id: "fizik_10_u04_k06_o08",
        metin: "Deprem büyüklüğü (magnitüd) hangi niceliği ifade eder?",
        fc: ["Deprem büyüklüğü ile şiddet arasındaki fark nedir?", "Büyüklük açığa çıkan enerjiyi, şiddet yüzeydeki etkiyi ifade eder."]
      },
      {
        soru_id: "fizik_10_u04_k06_o09",
        metin: "Deprem şiddeti hangi ölçek kullanılarak derecelendirilir?",
        fc: ["Değiştirilmiş Mercalli ölçeği neyi derecelendirir?", "Depremin yüzeydeki etkisini (şiddetini) I-XII arasında."]
      }
    ]
  },
  {
    konu_id: "fizik_10_u04_k07",
    kartlar: [
      { soru_id: "fizik_10_u04_k07_o06",
        fc: ["Deprem verileri hangi araçlarla dolaylı olarak toplanır?", "Sismograf (sismometre) ile yer hareketi kaydedilir."] }
    ]
  }
];
