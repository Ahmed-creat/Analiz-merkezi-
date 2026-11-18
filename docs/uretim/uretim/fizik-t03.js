#!/usr/bin/env node
/* ============================================================
   FİZİK 10 · 3. ÜNİTE ELEKTRİK — kitaptan sıfırdan havuzlar
   ------------------------------------------------------------
     3.1 Basit Elektrik Devreleri              s.200-208
     3.2 Elektrik Akımı                        s.209-214
     3.3 Ohm Yasası                            s.215-222
     3.4 Dirençlerin Bağlanması                s.223-241
     3.5 Üreteçlerin Bağlanması                s.242-249
     3.6 Akımın Tehlikeleri ve Önlemler   s.250-253
     3.7 Topraklamanın Önemi                   s.254-258
   Kullanım: node docs/uretim/uretim/fizik-t03.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Fizik";
const DOSYA = "fizik-10.pdf (MEB, 2025)";
const kaynak = s => "Fizik 10 ders kitabı, s." + s;

/* ------------------------------------------------------- 3.1 */
yazKonu({
  konu_id: "fizik_10_u03_k01",
  ders: DERS, tema: 3, tema_adi: "Elektrik",
  baslik: "3.1 Basit Elektrik Devreleri",
  kazanim: "Basit elektrik devresinin elemanlarını tanır; akım, potansiyel fark ve direnci ilişkilendirir.",
  kaynak: kaynak("200-208"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Devre elemanlarını ve işlevlerini tanır.",
    "Ölçüm araçlarını ve temel elektriksel büyüklükleri ilişkilendirir."
  ],
  items: [
    {
      bi: 0,
      metin: "Direncin SI'daki birimi nedir?",
      secenekler: ["Ohm (Ω)", "Volt (V)", "Amper (A)", "Watt (W)"],
      cozum: "Kitapta direncin R ile gösterildiği ve biriminin ohm (Ω) olduğu belirtilir (s.204).",
      fc: ["Direncin birimi nedir?", "Ohm (Ω)"]
    },
    {
      bi: 0,
      metin: "Direnç hangi harfle gösterilir?",
      secenekler: ["R", "V", "I", "W"],
      cozum: "Direnç R, potansiyel fark V, akım I ile gösterilir (s.204).",
      fc: ["Direncin sembolü nedir?", "R"]
    },
    {
      bi: 0,
      metin: "Devreyi açıp kapatmaya yarayan devre elemanı hangisidir?",
      secenekler: ["Anahtar", "Üreteç", "Direnç", "Voltmetre"],
      cozum: "Anahtar, devredeki akım yolunu açıp kapatarak devreyi çalıştırır veya durdurur (s.201-202).",
      fc: ["Devreyi açıp kapatan eleman nedir?", "Anahtar."]
    },
    {
      bi: 0,
      metin: "Bir iletkenin direnci aşağıdakilerden hangisine bağlı değildir?",
      secenekler: ["Üzerinden geçen akım şiddetine", "Uzunluğuna", "Kesit alanına", "Yapıldığı maddenin cinsine"],
      cozum: "Kitaba göre telin direnci uzunluğuna, kesit alanına ve cinsine bağlıdır (s.204-205).",
      fc: ["Tel direnci nelere bağlıdır?", "Uzunluk, kesit alanı, maddenin cinsi."]
    },
    {
      bi: 0,
      metin: "Su tesisatı analojisinde pompa hangi devre elemanına karşılık gelir?",
      secenekler: ["Üreteç", "Direnç", "Anahtar", "Lamba"],
      cozum: "Kitapta pompa üretece, vana anahtara, kireçlenmiş boru dirence, boru iletken tele benzetilir (s.201).",
      fc: ["Su analojisinde pompa neye benzetilir?", "Üretece."]
    },
    {
      bi: 1,
      metin: "Bir devre elemanının iki ucu arasına direnci çok küçük bir iletkenle yol açılmasına ne denir?",
      secenekler: ["Kısa devre", "Açık devre", "Paralel bağlama", "Topraklama"],
      cozum: "Kitapta direnci küçük bir yoldan akımın geçmesi kısa devre olarak tanımlanır (s.228).",
      fc: ["Kısa devre nedir?", "Akımın direnci çok küçük bir yoldan geçmesi."]
    },
    {
      bi: 1,
      metin: "Ampermetre devreye nasıl bağlanır?",
      secenekler: ["Seri", "Paralel", "Ters yönde", "Topraklı"],
      cozum: "Akımı ölçen ampermetre devreye seri bağlanır (s.228).",
      fc: ["Ampermetre nasıl bağlanır?", "Seri."]
    },
    {
      bi: 1,
      metin: "Voltmetre devreye nasıl bağlanır?",
      secenekler: ["Paralel", "Seri", "Kısa devre olarak", "Anahtar yerine"],
      cozum: "Potansiyel farkı ölçen voltmetre, uçları arasındaki gerilim ölçülecek elemana paralel bağlanır (s.206-207).",
      fc: ["Voltmetre nasıl bağlanır?", "Paralel."]
    },
    {
      bi: 1,
      metin: "Su tesisatı analojisinde borunun daralmış kısmı hangi kavrama karşılık gelir?",
      secenekler: ["Direnç", "Akım", "Potansiyel fark", "Anahtar"],
      cozum: "Dar boruda suyun akışı zorlaşır; benzer biçimde daralan kesit direnci artırır (s.201).",
      fc: ["Analojide daralan boru neyi temsil eder?", "Direnci."]
    },
    {
      bi: 1,
      metin: "Potansiyel farkın birimi nedir?",
      secenekler: ["Volt", "Amper", "Ohm", "Joule"],
      cozum: "Potansiyel fark V ile gösterilir ve birimi volt (V)'tur (s.206).",
      fc: ["Potansiyel farkın birimi nedir?", "Volt."]
    }
  ]
});

/* ------------------------------------------------------- 3.2 */
yazKonu({
  konu_id: "fizik_10_u03_k02",
  ders: DERS, tema: 3, tema_adi: "Elektrik",
  baslik: "3.2 Elektrik Akımı",
  kazanim: "Elektrik akımını yük ve zamanla ilişkilendirerek hesaplar.",
  kaynak: kaynak("209-214"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Akım kavramını ve akımın yönünü açıklar.",
    "Akım, yük ve zaman arasındaki ilişkiyi kullanarak hesap yapar."
  ],
  items: [
    {
      bi: 0,
      metin: "Elektrik akımı hangi bağıntıyla hesaplanır?",
      secenekler: ["I = q/t", "I = t/q", "I = q·t", "I = V·R"],
      cozum: "Akım, birim zamanda geçen yük miktarıdır: I = q/t (s.210).",
      fc: ["Akımın modeli nedir?", "I = q/t"]
    },
    {
      bi: 0,
      metin: "Elektrik yükünün birimi nedir?",
      secenekler: ["Coulomb (C)", "Amper (A)", "Volt (V)", "Ohm (Ω)"],
      cozum: "Yük q ile gösterilir, birimi coulomb (C)'dur (s.210).",
      fc: ["Yükün birimi nedir?", "Coulomb."]
    },
    {
      bi: 0,
      metin: "Elektrik akımının yönü hangi kabulle belirlenir?",
      secenekler: ["Pozitif yüklerin hareket yönü", "Elektronların hareket yönü", "Manyetik alan yönü", "Rastgele yön"],
      cozum: "Kitapta akım yönünün pozitif yüklerin hareket yönü kabul edildiği, gerçekte elektronların ters yönde hareket ettiği belirtilir (s.213).",
      fc: ["Akımın yönü neye göre kabul edilir?", "Pozitif yüklerin hareket yönüne göre."]
    },
    {
      bi: 0,
      metin: "Bir elektronun yükünün büyüklüğü yaklaşık kaç coulombdur?",
      secenekler: ["1,6·10⁻¹⁹", "1,6·10¹⁹", "9,1·10⁻³¹", "6,02·10²³"],
      cozum: "Kitapta elektronun yükü 1,6·10⁻¹⁹ C olarak verilir (s.213).",
      fc: ["Elektronun yükü kaç coulombdur?", "1,6·10⁻¹⁹ C"]
    },
    {
      bi: 0,
      metin: "Akım şiddetinin birimi nedir?",
      secenekler: ["Amper", "Coulomb", "Volt", "Watt"],
      cozum: "Akım I ile gösterilir, birimi amper (A)'dir (s.210).",
      fc: ["Akımın birimi nedir?", "Amper."]
    },
    {
      bi: 1,
      metin: "Bir iletkenin kesitinden 2 s'de 16 C yük geçiyor. Akım şiddeti kaç A'dır?",
      secenekler: ["8", "32", "0,125", "16"],
      cozum: "I = q/t = 16/2 = 8 A (s.210'daki model).",
      fc: ["2 s'de 16 C geçerse akım kaç A'dır?", "8 A"]
    },
    {
      bi: 1,
      metin: "Bir iletkenin kesitinden 2 s'de 10·10¹⁹ elektron geçiyor. Akım şiddeti kaç A'dır? (e = 1,6·10⁻¹⁹ C)",
      secenekler: ["8", "16", "4", "80"],
      cozum: "q = 10·10¹⁹ · 1,6·10⁻¹⁹ = 16 C; I = 16/2 = 8 A (kitaptaki örnek, s.213).",
      fc: ["2 s'de 10·10¹⁹ elektron geçen iletkende akım kaç A'dır?", "8 A"]
    },
    {
      bi: 1,
      metin: "Üzerinden 5 A akım geçen iletkenin kesitinden 10 s'de kaç coulomb yük geçer?",
      secenekler: ["50", "2", "5", "0,5"],
      cozum: "q = I·t = 5·10 = 50 C (s.210).",
      fc: ["5 A akım 10 s'de kaç C yük taşır?", "50 C"]
    },
    {
      bi: 1,
      metin: "Bir iletkenin farklı kesitlerinden birim zamanda geçen yük miktarı için hangisi doğrudur?",
      secenekler: ["Eşittir", "Kesit büyükse daha fazladır", "Kesit küçükse daha fazladır", "Sıfırdır"],
      cozum: "Kitaptaki 3.2. soruda kesitler farklı olsa da birim zamanda geçen yükün aynı olduğu (akımın korunduğu) vurgulanır (s.210).",
      fc: ["Kesit değişince akım değişir mi?", "Hayır, seri devrede akım aynıdır."]
    },
    {
      bi: 1,
      metin: "Devredeki akım şiddetini ölçen ölçüm aracı hangisidir?",
      secenekler: ["Ampermetre", "Voltmetre", "Ohmmetre", "Barometre"],
      cozum: "Akım ampermetreyle, potansiyel fark voltmetreyle ölçülür (s.213).",
      fc: ["Akımı hangi araç ölçer?", "Ampermetre."]
    }
  ]
});

/* ------------------------------------------------------- 3.3 */
yazKonu({
  konu_id: "fizik_10_u03_k03",
  ders: DERS, tema: 3, tema_adi: "Elektrik",
  baslik: "3.3 Ohm Yasası",
  kazanim: "Ohm Yasası'nı kullanarak potansiyel fark, akım ve direnç arasındaki ilişkiyi açıklar.",
  kaynak: kaynak("215-222"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Ohm Yasası'nı ve grafik yorumunu açıklar.",
    "Potansiyel fark, akım ve direnç hesaplar."
  ],
  items: [
    {
      bi: 0,
      metin: "Ohm Yasası hangi ilişkiyi ifade eder?",
      secenekler: ["Sabit sıcaklıkta potansiyel farkın akıma oranı sabittir", "Potansiyel fark ile akımın çarpımı sabittir", "Akımın potansiyel farka oranı sürekli artar", "Direnç zamana bağlıdır"],
      cozum: "Kitapta sabit sıcaklıkta V/I oranının sabit kaldığı ve bu sabitin direnci verdiği belirtilir (s.218).",
      fc: ["Ohm Yasası'nın temel ifadesi nedir?", "V/I = R (sabit sıcaklıkta)."]
    },
    {
      bi: 0,
      metin: "Ohm Yasası'nın matematiksel modeli hangisidir?",
      secenekler: ["V = I·R", "V = I/R", "V = R/I", "I = V·R"],
      cozum: "V = I·R; birimi volttur (s.218).",
      fc: ["Ohm Yasası'nın modeli nedir?", "V = I·R"]
    },
    {
      bi: 0,
      metin: "Potansiyel fark-akım grafiğinin eğimi neyi verir?",
      secenekler: ["Direnci", "Gücü", "Yükü", "Zamanı"],
      cozum: "Kitaptaki etkinlikte V-I grafiğinin eğiminin direnci verdiği bulunur (s.216-217).",
      fc: ["V-I grafiğinin eğimi neyi verir?", "Direnci."]
    },
    {
      bi: 0,
      metin: "Aynı iletkende potansiyel fark artırılırsa akım nasıl değişir?",
      secenekler: ["Doğru orantılı olarak artar", "Azalır", "Değişmez", "Önce artar sonra azalır"],
      cozum: "Direnç sabitken I = V/R olduğundan V ile I doğru orantılıdır (s.218).",
      fc: ["Gerilim artarsa akım ne olur?", "Doğru orantılı artar."]
    },
    {
      bi: 0,
      metin: "Direnç sabitken akım ile potansiyel fark arasındaki ilişki nedir?",
      secenekler: ["Doğru orantılı", "Ters orantılı", "Karesel", "Bağımsız"],
      cozum: "Ohm Yasası'na göre V arttıkça I aynı oranda artar (s.218).",
      fc: ["Akım ile gerilim arasındaki orantı nedir?", "Doğru orantı."]
    },
    {
      bi: 1,
      metin: "Uçları arasındaki potansiyel fark 12 V olan 6 Ω'luk dirençten kaç amper akım geçer?",
      secenekler: ["2", "72", "0,5", "18"],
      cozum: "I = V/R = 12/6 = 2 A (s.218).",
      fc: ["12 V, 6 Ω için akım kaç A'dır?", "2 A"]
    },
    {
      bi: 1,
      metin: "Üzerinden 3 A akım geçen 4 Ω'luk direncin uçları arasındaki potansiyel fark kaç V'tur?",
      secenekler: ["12", "7", "0,75", "1,33"],
      cozum: "V = I·R = 3·4 = 12 V (s.218).",
      fc: ["3 A ve 4 Ω için gerilim kaç V'tur?", "12 V"]
    },
    {
      bi: 1,
      metin: "Uçları arasındaki potansiyel fark 20 V olan dirençten 4 A akım geçiyor. Direnç kaç Ω'dur?",
      secenekler: ["5", "80", "0,2", "24"],
      cozum: "R = V/I = 20/4 = 5 Ω (s.218).",
      fc: ["20 V'ta 4 A geçen direnç kaç Ω'dur?", "5 Ω"]
    },
    {
      bi: 1,
      metin: "Potansiyel fark sabitken direnç iki katına çıkarılırsa akım nasıl değişir?",
      secenekler: ["Yarıya iner", "İki katına çıkar", "Değişmez", "Dört katına çıkar"],
      cozum: "I = V/R olduğundan R iki katına çıkarsa I yarıya iner; akım dirençle ters orantılıdır (s.218).",
      fc: ["Direnç artarsa akım ne olur?", "Ters orantılı azalır."]
    },
    {
      bi: 1,
      metin: "10 Ω'luk dirençten 2 A akım geçiyor. Direncin uçları arasındaki potansiyel fark kaç V'tur?",
      secenekler: ["20", "5", "12", "0,2"],
      cozum: "V = I·R = 2·10 = 20 V (s.218).",
      fc: ["10 Ω ve 2 A için gerilim kaç V'tur?", "20 V"]
    }
  ]
});

/* ------------------------------------------------------- 3.4 */
yazKonu({
  konu_id: "fizik_10_u03_k04",
  ders: DERS, tema: 3, tema_adi: "Elektrik",
  baslik: "3.4 Dirençlerin Bağlanması",
  kazanim: "Dirençlerin seri, paralel ve birleşik bağlanmasında eşdeğer direnç ve akım-potansiyel fark ilişkilerini kullanır.",
  kaynak: kaynak("223-241"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Bağlama türlerini ve eşdeğer direnci açıklar.",
    "Seri ve paralel devrelerde akım, gerilim ve direnç hesabı yapar."
  ],
  items: [
    {
      bi: 0,
      metin: "Seri bağlı dirençlerin eşdeğer direnci nasıl bulunur?",
      secenekler: ["Dirençler toplanır", "Dirençlerin tersleri toplanır", "Dirençler çarpılır", "Dirençlerin ortalaması alınır"],
      cozum: "Seri bağlamada R_eş = R1 + R2 + ... (s.229).",
      fc: ["Seri bağlamada eşdeğer direnç nasıl bulunur?", "Toplanır."]
    },
    {
      bi: 0,
      metin: "Paralel bağlı dirençlerde hangi nicelik her kolda eşittir?",
      secenekler: ["Potansiyel fark", "Akım", "Direnç", "Güç"],
      cozum: "Paralel kolların uçları aynı noktalara bağlı olduğundan potansiyel farkları eşittir (s.230).",
      fc: ["Paralel bağlamada hangi nicelik eşittir?", "Potansiyel fark."]
    },
    {
      bi: 0,
      metin: "Seri bağlı dirençlerde akım için hangisi doğrudur?",
      secenekler: ["Her dirençte aynıdır", "Dirençlerde toplanır", "Her kolda yarıya inmiş", "Sıfırdır"],
      cozum: "Seri devrede akımın geçebileceği tek yol vardır; akım her elemanında aynıdır (s.229).",
      fc: ["Seri devrede akım değişir mi?", "Hayır, her yerde aynıdır."]
    },
    {
      bi: 0,
      metin: "Paralel bağlı dirençlerde ana kol akımı nasıl bulunur?",
      secenekler: ["Kollardaki akımların toplamı", "Kollardaki akımların çarpımı", "Bir kolun akımı", "Kollardaki akımların ortalaması"],
      cozum: "Ana kol akımı, paralel kollardan geçen akımların toplamına eşittir (s.230).",
      fc: ["Paralel devrede ana kol akımı nedir?", "Kolların akımları toplamı."]
    },
    {
      bi: 0,
      metin: "Seri bağlı dirençlerin eşdeğer direnci, dirençlerin her birine göre nasıldır?",
      secenekler: ["Daha büyüktür", "Daha küçüktür", "Eşittir", "Bağımsızdır"],
      cozum: "Toplama yapıldığı için eşdeğer direnç en büyük dirençten de büyüktür (s.229).",
      fc: ["Seri eşdeğer direnç büyür mü?", "Evet, dirençler toplanır."]
    },
    {
      bi: 1,
      metin: "3 Ω ve 5 Ω'luk iki direnç seri bağlanırsa eşdeğer direnç kaç Ω olur?",
      secenekler: ["8", "2", "15", "4"],
      cozum: "R_eş = 3 + 5 = 8 Ω (s.229).",
      fc: ["3 Ω + 5 Ω seri bağlanırsa kaç Ω olur?", "8 Ω"]
    },
    {
      bi: 1,
      metin: "6 Ω ve 3 Ω'luk iki direnç paralel bağlanırsa eşdeğer direnç kaç Ω olur?",
      secenekler: ["2", "9", "3", "18"],
      cozum: "1/R_eş = 1/6 + 1/3 = 1/2 → R_eş = 2 Ω (s.230).",
      fc: ["6 Ω ve 3 Ω paralel bağlanırsa kaç Ω olur?", "2 Ω"]
    },
    {
      bi: 1,
      metin: "3, 4 ve 5 Ω'luk dirençler seri bağlıdır. 5 Ω'luk direncin uçları arasında 30 V vardır. Devreden geçen akım kaç A'dır?",
      secenekler: ["6", "10", "2", "30"],
      cozum: "Seri devrede akım her yerde aynıdır: I = 30/5 = 6 A (kitaptaki 3.6. soru, s.232).",
      fc: ["5 Ω'da 30 V varsa seri devrede akım kaç A'dır?", "6 A"]
    },
    {
      bi: 1,
      metin: "Aynı devrede (3, 4, 5 Ω seri) üretecin potansiyel farkı kaç V'tur?",
      secenekler: ["72", "30", "12", "45"],
      cozum: "R_eş = 3 + 4 + 5 = 12 Ω; V = I·R_eş = 6·12 = 72 V (s.232).",
      fc: ["3-4-5 Ω seri devrede 6 A için üreteç gerilimi kaç V'tur?", "72 V"]
    },
    {
      bi: 1,
      metin: "12 V'luk üretece paralel bağlanan 6 Ω ve 3 Ω'luk dirençlerden geçen akımlar sırasıyla kaç A'dır?",
      secenekler: ["2 ve 4", "4 ve 2", "6 ve 3", "0,5 ve 0,25"],
      cozum: "Paralel kollarda V = 12 V: I1 = 12/6 = 2 A, I2 = 12/3 = 4 A (s.235).",
      fc: ["12 V'ta 6 Ω ve 3 Ω paralel kolların akımları kaç A'dır?", "2 A ve 4 A"]
    }
  ]
});

/* ------------------------------------------------------- 3.5 */
yazKonu({
  konu_id: "fizik_10_u03_k05",
  ders: DERS, tema: 3, tema_adi: "Elektrik",
  baslik: "3.5 Üreteçlerin Bağlanması",
  kazanim: "Üreteçlerin seri ve paralel bağlanmasının devreye etkisini açıklar.",
  kaynak: kaynak("242-249"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Üreteç bağlama türlerini açıklar.",
    "Bağlı üreteçlerin toplam potansiyel farkını hesaplar."
  ],
  items: [
    {
      bi: 0,
      metin: "Üreteçler seri bağlandığında devrenin potansiyel farkı nasıl bulunur?",
      secenekler: ["Üreteçlerin potansiyel farkları toplanır", "Potansiyel farklar çarpılır", "Ortalaması alınır", "En büyüğü alınır"],
      cozum: "Seri bağlı üreteçlerin potansiyel farkları toplanır (s.244).",
      fc: ["Seri üreteçlerin toplam gerilimi nasıl bulunur?", "Toplanır."]
    },
    {
      bi: 0,
      metin: "Üreteçler düz seri bağlanırken kutuplar nasıl birleştirilir?",
      secenekler: ["Zıt kutuplar uç uca", "Aynı kutuplar uç uca", "Paralel olarak", "Rastgele"],
      cozum: "Düz seri bağlamada bir üretecin (+) kutbu diğerinin (−) kutbuna bağlanır (s.244).",
      fc: ["Seri bağlamada kutuplar nasıl birleşir?", "Zıt kutuplar uç uca."]
    },
    {
      bi: 0,
      metin: "Üreteçler paralel bağlandığında devrede ne artar?",
      secenekler: ["Devrenin akım verme kapasitesi", "Potansiyel fark", "Eşdeğer direnç", "Enerji kaybı"],
      cozum: "Paralel bağlamada potansiyel fark değişmez, üreteçlerin toplam akım verme süresi/kapasitesi artar (s.244).",
      fc: ["Üreteçler paralel bağlanınca ne artar?", "Akım verme kapasitesi."]
    },
    {
      bi: 0,
      metin: "Özdeş üreteçler paralel bağlandığında devrenin potansiyel farkı nasıl değişir?",
      secenekler: ["Değişmez", "Toplanır", "Yarıya iner", "İki katına çıkar"],
      cozum: "Paralel bağlı özdeş üreteçlerin potansiyel farkı bir üretecin potansiyel farkına eşittir (s.244).",
      fc: ["Paralel özdeş pillerde gerilim değişir mi?", "Değişmez."]
    },
    {
      bi: 0,
      metin: "Üreteçler neden seri bağlanır?",
      secenekler: ["Daha yüksek potansiyel fark elde etmek için", "Daha düşük potansiyel fark için", "Direnci artırmak için", "Akımı kesmek için"],
      cozum: "Seri bağlama ile üreteçlerin potansiyel farkları toplanarak daha büyük gerilim elde edilir (s.244).",
      fc: ["Seri bağlamanın amacı nedir?", "Gerilimi artırmak."]
    },
    {
      bi: 1,
      metin: "10 V, 15 V ve 20 V'luk üreteçler düz seri bağlanırsa toplam potansiyel fark kaç V olur?",
      secenekler: ["45", "30", "25", "15"],
      cozum: "10 + 15 + 20 = 45 V (kitaptaki VKL örneği, s.245).",
      fc: ["10+15+20 V seri bağlanırsa toplam kaç V olur?", "45 V"]
    },
    {
      bi: 1,
      metin: "15 V'luk ve 10 V'luk iki üreteç, biri ters çevrilerek bağlanırsa toplam potansiyel fark kaç V olur?",
      secenekler: ["5", "25", "15", "10"],
      cozum: "Ters bağlamada potansiyel farklar çıkarılır: 15 − 10 = 5 V (s.244).",
      fc: ["Biri ters bağlı 15 V ve 10 V'ta toplam gerilim kaç V'tur?", "5 V"]
    },
    {
      bi: 1,
      metin: "Özdeş iki 1,5 V'luk pil seri bağlanırsa toplam potansiyel fark kaç V olur?",
      secenekler: ["3", "1,5", "0,75", "4,5"],
      cozum: "Seri bağlamada toplanır: 1,5 + 1,5 = 3 V (s.244).",
      fc: ["İki 1,5 V pil seri bağlanırsa kaç V olur?", "3 V"]
    },
    {
      bi: 1,
      metin: "Özdeş iki 1,5 V'luk pil paralel bağlanırsa devrenin potansiyel farkı kaç V olur?",
      secenekler: ["1,5", "3", "0,75", "6"],
      cozum: "Paralel bağlamada potansiyel fark değişmez, 1,5 V olarak kalır (s.244).",
      fc: ["Paralel iki 1,5 V pilde gerilim kaç V olur?", "1,5 V"]
    },
    {
      bi: 1,
      metin: "Seri bağlı üreteçlerden birinin kutupları ters çevrilirse devrenin toplam potansiyel farkı nasıl değişir?",
      secenekler: ["Azalır", "Artar", "Değişmez", "Sıfırlanır"],
      cozum: "Ters bağlanan üreteç toplamdan çıkarıldığı için toplam potansiyel fark azalır (s.244).",
      fc: ["Bir üreteç ters bağlanırsa toplam gerilim ne olur?", "Azalır."]
    }
  ]
});

/* ------------------------------------------------------- 3.6 */
yazKonu({
  konu_id: "fizik_10_u03_k06",
  ders: DERS, tema: 3, tema_adi: "Elektrik",
  baslik: "3.6 Elektrik Akımının Oluşturabileceği Tehlikelere Karşı Alınması Gereken Önlemler",
  kazanim: "Elektrik akımının oluşturabileceği tehlikeleri tanır ve alınması gereken önlemleri açıklar.",
  kaynak: kaynak("250-253"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Elektrik tehlikelerini tanır.",
    "Elektrik güvenliği önlemlerini açıklar."
  ],
  items: [
    {
      bi: 0,
      metin: "Aşırı akımdan cihazları ve canlıları koruyan devre elemanı hangisidir?",
      secenekler: ["Sigorta", "Voltmetre", "Anahtar", "Direnç"],
      cozum: "Kitapta sigortanın aşırı akım durumunda devreyi keserek koruma sağladığı belirtilir (s.251).",
      fc: ["Aşırı akıma karşı hangi eleman korur?", "Sigorta."]
    },
    {
      bi: 0,
      metin: "Evlerdeki priz ve duylar birbirine nasıl bağlıdır?",
      secenekler: ["Paralel", "Seri", "Karışık", "Bağımsız"],
      cozum: "Her cihazın aynı potansiyel farkla çalışabilmesi için prizler paralel bağlanır (s.251).",
      fc: ["Ev prizleri nasıl bağlıdır?", "Paralel."]
    },
    {
      bi: 0,
      metin: "Elektrik çarpmasını önlemek için prizlerde bulunması gereken özellik nedir?",
      secenekler: ["Topraklı olması", "Boyasız olması", "Yüksek gerilimli olması", "Sigortasız olması"],
      cozum: "Kitapta topraklı priz kullanımı güvenlik önlemi olarak verilir (s.252).",
      fc: ["Güvenli priz nasıl olmalıdır?", "Topraklı."]
    },
    {
      bi: 0,
      metin: "Elektrikli aletlerin güvenli çalışması için ne yapılmalıdır?",
      secenekler: ["Üreticinin belirttiği gerilim aralığında kullanılmalı", "Her gerilimde kullanılmalı", "Islak zeminde kullanılmalı", "Sigortası çıkarılmalı"],
      cozum: "Cihazlar yalnız uygun gerilimde ve kullanım kılavuzuna göre çalıştırılmalıdır (s.251).",
      fc: ["Cihaz hangi gerilimde çalıştırılmalı?", "Üreticinin belirttiği gerilimde."]
    },
    {
      bi: 0,
      metin: "Elektrik kazasında aranması gereken acil yardım numarası hangisidir?",
      secenekler: ["112", "110", "155", "177"],
      cozum: "Acil yardım için 112 aranır (s.253).",
      fc: ["Acil yardım numarası kaçtır?", "112"]
    },
    {
      bi: 1,
      metin: "Elektrik akımına kapılan bir kişiye ilk olarak ne yapılmalıdır?",
      secenekler: ["Akım kaynağı kesilmeli", "Kişiye su dökülmeli", "Çıplak elle tutulmalı", "Kişi kaldırılıp yürütülmeli"],
      cozum: "Kitapta ilk adımın akımı kesmek olduğu, aksi hâlde kurtarmaya çalışanın da çarpılabileceği belirtilir (s.253).",
      fc: ["Elektrik çarpmasında ilk adım nedir?", "Akımı kesmek."]
    },
    {
      bi: 1,
      metin: "Akım kesilemiyorsa kişi nasıl kurtarılmalıdır?",
      secenekler: ["Yalıtkan bir malzemeyle teması kesilerek", "Metal çubukla çekilerek", "Islak bezle tutularak", "Beklenerek"],
      cozum: "Yalıtkan malzeme (kuru tahta, kauçuk vb.) kullanılmalıdır; metal ve ıslak bez iletkendir (s.253).",
      fc: ["Akım kesilemiyorsa kişi neyle ayrılır?", "Yalıtkan malzemeyle."]
    },
    {
      bi: 1,
      metin: "Islak elle prize dokunmanın tehlikesi hangi nedenle artar?",
      secenekler: ["Vücut direnci azaldığı için akım artar", "Akım sıfırlanır", "Potansiyel fark artar", "Vücut direnci artar"],
      cozum: "Islanan deri direnci düşürür; I = V/R olduğundan vücuttan geçen akım artar (s.252, s.256).",
      fc: ["Islak elle dokunmak neden tehlikelidir?", "Vücut direnci azalır, akım artar."]
    },
    {
      bi: 1,
      metin: "Prizlere emniyet kapağı takılmasının amacı nedir?",
      secenekler: ["Çocukların prize yabancı cisim sokmasını engellemek", "Akımı artırmak", "Gerilimi düşürmek", "Direnci azaltmak"],
      cozum: "Kitapta prizlere emniyet kapağı takılması, özellikle küçük çocuklar için alınan bir önlem olarak verilir (s.252).",
      fc: ["Emniyet kapağı neden takılır?", "Çocukların prize cisim sokmasını engellemek için."]
    },
    {
      bi: 1,
      metin: "Elektrik uyarı levhalarının amacı nedir?",
      secenekler: ["Kişileri tehlikeye karşı uyarmak", "Gerilimi artırmak", "Akımı depolamak", "Direnci ölçmek"],
      cozum: "Uyarı levhaları tehlike ve yasakları bildirerek kazaları önler (s.252).",
      fc: ["Uyarı levhaları ne işe yarar?", "Tehlikeye karşı uyarır."]
    }
  ]
});

/* ------------------------------------------------------- 3.7 */
yazKonu({
  konu_id: "fizik_10_u03_k07",
  ders: DERS, tema: 3, tema_adi: "Elektrik",
  baslik: "3.7 Topraklamanın Önemi",
  kazanim: "Topraklamanın işlevini ve elektrik güvenliğindeki önemini açıklar.",
  kaynak: kaynak("254-258"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Topraklamanın ne olduğunu ve amacını açıklar.",
    "Kaçak akımın can güvenliği üzerindeki etkisini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Topraklama nedir?",
      secenekler: ["Cihazın iletkenle toprağa gömülü sisteme bağlanması", "Cihazın prize seri bağlanması", "Sigortanın devreden çıkarılması", "Gerilimin yükseltilmesi"],
      cozum: "Kitapta topraklama, elektrikli cihazın toprağa gömülü iletken sisteme bağlanması olarak tanımlanır (s.254).",
      fc: ["Topraklama nedir?", "Cihazın toprağa gömülü iletkene bağlanması."]
    },
    {
      bi: 0,
      metin: "Topraklamanın temel amacı nedir?",
      secenekler: ["Elektrik kaçağında can ve mal güvenliğini korumak", "Akımı artırmak", "Enerji tasarrufu sağlamak", "Direnci ölçmek"],
      cozum: "Topraklama, kaçak akımı toprağa yönlendirerek kişinin çarpılmasını önler (s.254-255).",
      fc: ["Topraklama neden yapılır?", "Kaçak akımda güvenliği sağlamak için."]
    },
    {
      bi: 0,
      metin: "Elektrik kaçağı nedir?",
      secenekler: ["Akımın cihaz dışına istenmeyen yola çıkması", "Akımın kesilmesi", "Gerilimin düşmesi", "Direncin artması"],
      cozum: "Yalıtımın bozulmasıyla akımın gövdeye/çevreye geçmesi kaçak olarak adlandırılır (s.254).",
      fc: ["Kaçak akım nasıl oluşur?", "Yalıtım bozulunca akım cihaz gövdesine geçer."]
    },
    {
      bi: 0,
      metin: "Topraklaması yapılmamış bir cihazda kaçak oluşursa ne olur?",
      secenekler: ["Cihaza dokunan kişiden akım geçebilir", "Cihaz çalışmaz", "Akım kendiliğinden sıfırlanır", "Gerilim düşer"],
      cozum: "Kaçak akımın toprağa gidecek yolu yoksa gövdeye dokunan kişi üzerinden devresini tamamlar (s.255).",
      fc: ["Topraksız cihazda kaçak olursa ne olur?", "Kişi çarpılabilir."]
    },
    {
      bi: 0,
      metin: "Topraklama hangi durumda koruma sağlar?",
      secenekler: ["Elektrik kaçağı olduğunda", "Cihaz kapalıyken", "Gerilim sıfırken", "Sigorta atınca"],
      cozum: "Topraklama, kaçak anında akımın güvenli yoldan toprağa gitmesini sağlar (s.255).",
      fc: ["Topraklama ne zaman devreye girer?", "Kaçak akım oluştuğunda."]
    },
    {
      bi: 1,
      metin: "Vücut direnci 2000 Ω olan bir kişi 220 V'luk gerilime dokunursa üzerinden yaklaşık kaç amper akım geçer?",
      secenekler: ["0,11", "11", "1,1", "440.000"],
      cozum: "I = V/R = 220/2000 = 0,11 A (kitaptaki hesap, s.256).",
      fc: ["220 V'a 2000 Ω ile dokunulursa akım kaç A'dır?", "0,11 A"]
    },
    {
      bi: 1,
      metin: "Çok küçük akımların bile tehlikeli olmasının temel nedeni nedir?",
      secenekler: ["Vücut direncinin küçük olması ve akımın sinir-kas sistemini etkilemesi", "Vücudun gerilimi artırması", "Vücudun yalıtkan olması", "Akımın yön değiştirmesi"],
      cozum: "Kitapta 0,1 A dolayındaki akımın bile kalp ritmini bozabilecek düzeyde tehlikeli olduğu belirtilir (s.255-256).",
      fc: ["Küçük akım neden tehlikelidir?", "Sinir ve kalp işlevini bozar."]
    },
    {
      bi: 1,
      metin: "Kaçak akım topraklama iletkeni üzerinden akarsa ne olur?",
      secenekler: ["Kişi üzerinden akım geçmesi engellenir", "Gerilim iki katına çıkar", "Cihaz bozulur", "Akım hiç kesilmez"],
      cozum: "Akım en küçük dirençli yolu (toprak hattı) seçtiği için kişi korunur (s.255).",
      fc: ["Toprak hattı kaçakta ne yapar?", "Akımı toprağa taşır, kişiyi korur."]
    },
    {
      bi: 1,
      metin: "Banyo ve mutfak gibi ıslak yerlerde topraklamanın önemi neden daha yüksektir?",
      secenekler: ["Islaklık vücut direncini azalttığı için akım artar", "Gerilim yükselir", "Direnç artar", "Akım azalır"],
      cozum: "Islak zemin ve deri direnci düşürür; aynı gerilimde vücuttan geçen akım büyür (s.252, s.256).",
      fc: ["Islak ortamda elektrik neden daha tehlikelidir?", "Direnç düşer, akım artar."]
    },
    {
      bi: 1,
      metin: "Topraklaması yapılmamış bir buzdolabına dokunan kişi için hangisi doğrudur?",
      secenekler: ["Kaçak varsa akım kişi üzerinden toprağa akar", "Akım hiç geçmez", "Yalnız ışık oluşur", "Cihaz otomatik kapanır"],
      cozum: "Toprak hattı olmadığından devre kişi üzerinden tamamlanır ve çarpılma riski doğar (s.255).",
      fc: ["Topraksız cihazda kaçak varsa akım nereden geçer?", "Kişi üzerinden."]
    }
  ]
});
