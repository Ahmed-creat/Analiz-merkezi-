#!/usr/bin/env node
/* ============================================================
   KİMYA 10 · 2-3. TEMALAR — kitaptan sıfırdan havuzlar
   ------------------------------------------------------------
     2.1.1 Çözünme Süreci                                s.151-155
     2.1.2 Maddelerin Birbiri İçindeki Çözünebilirliği    s.156-163
     2.1.3 Çözünme Olayının Sınıflandırılması             s.164-171
     2.1.4 Derişim Birimleri (Molarite, ppm)              s.172-178
     2.1.5 Çözünürlük                                     s.179-183
     2.1.6 Çözünürlüğe Etki Eden Faktörler                s.184-191
     2.1.7 Çözeltilerin Sınıflandırılması                 s.192-201
     2.1.8 Koligatif Özellikler                           s.202-210
     3.1.1 Makro ve Mikro Ölçekli Deneyler                s.238-246
     3.1.2 Atmosferdeki Tepkimeler ve Küresel Sorunlar    s.247-255

   Kullanım: node docs/uretim/uretim/kimya-t2.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Kimya";
const DOSYA = "kimya-10.pdf (MEB, 2025)";
const kaynak = s => "Kimya 10 ders kitabı, s." + s;

/* ---------------------------------------------------- 2.1.1 */
yazKonu({
  konu_id: "kimya_10_u02_k01",
  ders: DERS, tema: 2, tema_adi: "Çeşitlilik",
  baslik: "2.1.1 Çözünme Süreci",
  kazanim: "Çözünme sürecinin aşamalarını tanecik düzeyinde açıklar.",
  kaynak: kaynak("151-155"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Çözünme sürecinin aşamalarını sıralar.",
    "Çözünmede etkili etkileşimleri yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Kitaba göre çözünme süreci kaç temel aşamada gerçekleşir?",
      secenekler: ["Üç: çözünenin kristalinden çıkması, çözücüde boşluk oluşması, taneciklerin boşluğa yerleşmesi", "İki: ısıtma ve karıştırma", "Dört: erime, kaynama, soğuma, süzme", "Tek: çözünenin çözücüye eklenmesi"],
      cozum: "Görsel 2.1'de ilaç molekülünün kristalinden çıkması, çözücüde boşluk oluşması ve molekülün boşluğa yerleşmesi olmak üzere üç aşama gösterilir (s.151).",
      fc: ["Çözünmenin üç aşaması nedir?", "Kristalden ayrılma, boşluk oluşumu, yerleşme."]
    },
    {
      bi: 0,
      metin: "Çözünme sürecinin ilk aşaması nedir?",
      secenekler: ["Çözünen taneciklerin kristal yüzeyinden ayrılması", "Çözücü moleküllerinin buharlaşması", "Çözeltinin soğuması", "Çökelmenin başlaması"],
      cozum: "İlk aşamada çözünen tanecikler kristalinden çıkar ve çözücü içinde dağılır (s.151).",
      fc: ["Çözünme sırasında çözünen taneciklere ne olur?", "Kristal yüzeyinden ayrılıp çözücüde dağılır."]
    },
    {
      bi: 0,
      metin: "İlaçların vücut tarafından emilebilmesi için neden önce çözünmesi gerekir?",
      secenekler: ["Çözünmeyen ilaç mide-bağırsak kanalında tam emilemez", "Çözünme ilacı zehirler", "Çözünme ilacın tadını değiştirir", "Çözünme ilacı buharlaştırır"],
      cozum: "Kitaba göre tamamen çözünmeyen bir ilaç mide-bağırsak kanalında tam olarak emilemez; bu yüzden çözünürlük farmakolojide temel konudur (s.151).",
      fc: ["İlaç neden çözünmelidir?", "Emilebilmesi için."]
    },
    {
      bi: 1,
      metin: "Şekerin suda çözünmesi sırasında çözücüde boşluk oluşması için ne gerekir?",
      secenekler: ["Su molekülleri arasındaki etkileşimlerin bir kısmının kopması", "Suyun kaynaması", "Şekerin erimesi", "Basıncın sıfır olması"],
      cozum: "Çözücüde boşluk oluşması, çözücü tanecikleri arasındaki etkileşimlerin bir kısmının kopmasını gerektirir (s.151-153).",
      fc: ["Çözücüde boşluk nasıl oluşur?", "Çözücü tanecikleri arası etkileşimler kopar."]
    },
    {
      bi: 1,
      metin: "Çözünme sırasında çözünen ile çözücü tanecikleri arasında yeni etkileşimler oluşur. Bu durumun sonucu nedir?",
      secenekler: ["Enerji açığa çıkabilir ya da enerji alınabilir", "Kütle yok olur", "Tanecik sayısı azalır", "Çözelti her zaman ısınır"],
      cozum: "Tanecikler arası yeni etkileşimler enerji alışverişine yol açar; bazı çözünmeler ısı verir, bazıları ısı alır (s.153).",
      fc: ["Çözünmede enerji ne olur?", "Alınabilir veya açığa çıkabilir."]
    },
    {
      bi: 1,
      metin: "İyonik bir katı suda çözünürken su molekülleri iyonların çevresini sarar. Bu olaya ne denir?",
      secenekler: ["Hidratasyon (solvatasyon)", "Efüzyon", "Difüzyon", "Nötralleşme"],
      cozum: "Su moleküllerinin iyonları sararak kararlılık kazandırması hidratasyon (solvatasyon) olarak açıklanır (s.167-168).",
      fc: ["Su moleküllerinin iyonları sarması nedir?", "Hidratasyon."]
    },
    {
      bi: 1,
      metin: "Çözünme hızını artıran uygulama hangisidir?",
      secenekler: ["Karıştırmak ve temas yüzeyini artırmak", "Çözüneni iri parçalar hâlinde eklemek", "Çözeltiyi soğutmak", "Çözücü miktarını azaltmak"],
      cozum: "Karıştırma ve yüzey alanının artırılması taneciklerin çözücüyle temasını artırarak çözünmeyi hızlandırır (s.153-155).",
      fc: ["Çözünmeyi ne hızlandırır?", "Karıştırma, küçük parçalar, sıcaklık."]
    },
    {
      bi: 1,
      metin: "Çözünme süreci sonunda oluşan karışım için hangisi doğrudur?",
      secenekler: ["Çözünen tanecikleri çözücü içinde dağılmıştır", "Çözünen çökelmiştir", "İki faz kesin çizgiyle ayrılır", "Çözücü buharlaşmıştır"],
      cozum: "Çözünmede çözünen tanecikleri çözücü içinde homojen olarak dağılır (s.151-153).",
      fc: ["Çözeltide tanecikler nasıldır?", "Homojen dağılmış."]
    },
    {
      bi: 1,
      metin: "Suya tuz eklendiğinde taneciklerin kristalden ayrılması için gereken enerji nereden sağlanır?",
      secenekler: ["Çözücü-tanecik etkileşimlerinden ve ortamdan", "Yalnız kaptan", "Taneciklerin kütlesinden", "Havadan"],
      cozum: "Kristalden ayrılma enerji gerektirir; bu enerji çözücü-çözünen etkileşimleriyle ve ortamdan karşılanır (s.151-153).",
      fc: ["Kristali ayırma enerjisi nereden gelir?", "Çözücü etkileşimleri ve ortamdan."]
    },
    {
      bi: 1,
      metin: "Aynı miktar şeker, aynı sıcaklıkta hangi hâlde daha hızlı çözünür?",
      secenekler: ["Toz hâlinde", "Küp hâlinde", "İri kristal hâlinde", "Parça büyüklüğü hızı etkilemez"],
      cozum: "Toz hâlinde yüzey alanı büyük olduğundan çözünme daha hızlıdır (s.153-155).",
      fc: ["Yüzey alanı çözünme hızını nasıl etkiler?", "Yüzey alanı büyüdükçe çözünme hızlanır."]
    }
  ]
});

/* ---------------------------------------------------- 2.1.2 */
yazKonu({
  konu_id: "kimya_10_u02_k02",
  ders: DERS, tema: 2, tema_adi: "Çeşitlilik",
  baslik: "2.1.2 Maddelerin Birbiri İçindeki Çözünebilirliği",
  kazanim: "Maddelerin birbiri içinde çözünebilirliğini taneciklerin polaritesiyle ilişkilendirir.",
  kaynak: kaynak("156-163"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Polar-apolar yapı ile çözünürlük ilişkisini açıklar.",
    "Günlük yaşam örneklerini çözünürlükle yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Yağda çözünen vitaminler hangileridir?",
      secenekler: ["A, D ve K", "C ve B", "Yalnız C", "Yalnız B12"],
      cozum: "Kitaba göre A, D ve K gibi yağda çözünen vitaminler apolar, hidrofobik moleküllerdir (s.156).",
      fc: ["A, D ve K vitaminlerinin ortak özelliği nedir?", "Apolar ve hidrofobiktirler; yağda çözünürler."]
    },
    {
      bi: 0,
      metin: "C vitamini neden kanda ve hücre içi sıvılarda rahatça dolaşabilir?",
      secenekler: ["Polar ve hidrofilik yapıda olduğu için", "Apolar olduğu için", "Yağlı dokularda depolandığı için", "İyonik olduğu için"],
      cozum: "C vitamini polar ve hidrofilik yapısı sayesinde su içeren ortamlarda çözünür (s.156).",
      fc: ["C vitamini neden suda çözünür?", "Polar ve hidrofilik olduğu için."]
    },
    {
      bi: 0,
      metin: "Genel çözünürlük kuralı hangisidir?",
      secenekler: ["Benzer benzeri çözer", "Zıt zıttı çözer", "Büyük küçüğü çözer", "Sıcak soğuğu çözer"],
      cozum: "Polar çözücüler polar maddeleri, apolar çözücüler apolar maddeleri çözer; yani benzer benzeri çözer (s.157-160).",
      fc: ["Çözünürlükte temel kural nedir?", "Benzer benzeri çözer."]
    },
    {
      bi: 1,
      metin: "İyot (I2) hangi çözücüde daha iyi çözünür?",
      secenekler: ["Karbon tetra klorür (apolar)", "Su (polar)", "Tuzlu su", "Asitli su"],
      cozum: "İyot apolar bir maddedir; apolar çözücü olan CCl4'te iyi çözünür, suda çok az çözünür (s.158).",
      fc: ["İyodun apolar çözücüde çözünmesinin nedeni nedir?", "Benzer benzeri çözer; iyot apolardır."]
    },
    {
      bi: 1,
      metin: "Tuz (NaCl) hangi tür çözücüde iyi çözünür?",
      secenekler: ["Polar çözücüde", "Apolar çözücüde", "Yalnız asitlerde", "Yalnız bazlarda"],
      cozum: "İyonik bileşikler polar çözücülerde (ör. su) iyonlarına ayrışarak çözünür (s.158-160).",
      fc: ["İyonik bileşikler hangi tür çözücüde çözünür?", "Polar çözücüde (iyon-dipol etkileşimi)."]
    },
    {
      bi: 1,
      metin: "Su ile yağ karıştırıldığında neden iki faz oluşur?",
      secenekler: ["Su polar, yağ apolar olduğu için birbiri içinde çözünmezler", "Yağ sudan ağır olduğu için", "Su kaynadığı için", "Yağ iyonik olduğu için"],
      cozum: "Polar su ile apolar yağ birbiri içinde çözünmez; bu yüzden iki ayrı faz oluşur (s.157-160).",
      fc: ["Su ve yağ neden karışmaz?", "Polar-apolar uyuşmazlığı."]
    },
    {
      bi: 1,
      metin: "Alkolün suda iyi çözünmesinin nedeni nedir?",
      secenekler: ["Molekülünde hem polar hem apolar kısım bulunması", "Apolar olması", "İyonik olması", "Yoğunluğunun büyük olması"],
      cozum: "Alkol molekülünün -OH ucu suyla hidrojen bağı kurar; bu nedenle suda iyi çözünür (s.158-161).",
      fc: ["Alkol suda neden çözünür?", "-OH ucu suyla etkileşir."]
    },
    {
      bi: 1,
      metin: "Aşağıdaki madde çiftlerinden hangisi birbiri içinde en iyi çözünür?",
      secenekler: ["Su ve şeker", "Su ve zeytinyağı", "Su ve benzin", "Benzin ve tuz"],
      cozum: "Şeker polar yapıda olduğundan polar suda iyi çözünür; diğer çiftler polar-apolar uyuşmazlığı gösterir (s.157-160).",
      fc: ["Su ile hangi madde iyi çözünür?", "Şeker."]
    },
    {
      bi: 1,
      metin: "Kutup (polar) çözücülerde iyonik bileşiklerin çözünmesini sağlayan temel etkileşim nedir?",
      secenekler: ["İyon-dipol etkileşimleri", "Kovalent bağ", "Metalik bağ", "Hidrojen bağı olmayan itme"],
      cozum: "Polar çözücü moleküllerinin kısmi yükleri iyonlarla iyon-dipol etkileşimi kurar ve iyonları çözeltiye taşır (s.158-167).",
      fc: ["İyonik çözünmede hangi etkileşim etkili?", "İyon-dipol."]
    },
    {
      bi: 1,
      metin: "Yağda çözünen vitaminlerin vücutta depolanma eğilimi neden fazladır?",
      secenekler: ["Yağlı dokularda çözünüp orada depolandıkları için", "Suda çözündükleri için", "İdrarla atıldıkları için", "Gaz hâlinde oldukları için"],
      cozum: "Apolar/hidrofobik olduklarından yağlı dokularda emilir ve depolanırlar (s.156).",
      fc: ["A, D, K neden depolanır?", "Yağlı dokularda çözünürler."]
    }
  ]
});

/* ---------------------------------------------------- 2.1.3 */
yazKonu({
  konu_id: "kimya_10_u02_k03",
  ders: DERS, tema: 2, tema_adi: "Çeşitlilik",
  baslik: "2.1.3 Çözünme Olayının Sınıflandırılması",
  kazanim: "Çözünme olayını iyonik, moleküler, fiziksel ve kimyasal çözünme olarak sınıflandırır.",
  kaynak: kaynak("164-171"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Çözünme türlerini örnekleriyle ayırt eder.",
    "Çözünme türünü denklemden belirler."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir maddenin çözücü içinde iyonlarına ayrışarak çözünmesine ne denir?",
      secenekler: ["İyonik çözünme", "Moleküler çözünme", "Kimyasal çözünme", "Fiziksel çözünme"],
      cozum: "İyonik çözünme, maddenin çözücüde iyonlarına ayrışarak çözünmesidir; iyonik bileşiklerin suda çözünmesi örnektir (s.167).",
      fc: ["İyonlarına ayrışarak çözünme nedir?", "İyonik çözünme."]
    },
    {
      bi: 0,
      metin: "Şekerin suda molekülleri bozulmadan dağılması hangi çözünme türüdür?",
      secenekler: ["Moleküler çözünme", "İyonik çözünme", "Kimyasal çözünme", "Nötralleşme"],
      cozum: "Moleküler çözünmede moleküller iyonlaşmadan çözücü içinde dağılır (s.168).",
      fc: ["Şekerin suda çözünmesi hangi tür?", "Moleküler çözünme."]
    },
    {
      bi: 0,
      metin: "Vücut sıvılarında elektrik yükü taşıyan bileşenlere ne denir?",
      secenekler: ["Elektrolitler", "Katalizörler", "Enzimler", "Lipitler"],
      cozum: "Kitaba göre elektrolitler vücut sıvılarında pozitif veya negatif yük taşıyan bileşenlerdir (s.164).",
      fc: ["Vücut sıvılarında yük taşıyanlara ne denir?", "Elektrolitler."]
    },
    {
      bi: 1,
      metin: "SrCl2(k) → Sr²⁺(suda) + 2Cl⁻(suda) gösterimi hangi çözünme türünü belirtir?",
      secenekler: ["İyonik çözünme", "Moleküler çözünme", "Kimyasal çözünme", "Fiziksel çözünme"],
      cozum: "Bileşik iyonlarına ayrıştığından bu iyonik çözünmedir (s.167).",
      fc: ["SrCl2 → Sr²⁺ + 2Cl⁻ hangi çözünme?", "İyonik çözünme."]
    },
    {
      bi: 1,
      metin: "Aşağıdaki çözünmelerden hangisi kimyasal çözünmedir?",
      secenekler: ["Sodyum metalinin suda hidrojen gazı çıkararak çözünmesi", "Şekerin suda çözünmesi", "Tuzun suda iyonlaşması", "Alkolün suda çözünmesi"],
      cozum: "Çözünme sırasında yeni bir kimyasal tür oluşuyorsa (gaz çıkışı, yeni bileşik) kimyasal çözünmedir (s.168).",
      fc: ["Kimyasal çözünmeye örnek ver.", "Na'nın suda H2 çıkararak çözünmesi."]
    },
    {
      bi: 1,
      metin: "İyonik çözünmenin ilk adımında ne olur?",
      secenekler: ["Katyon ve anyonlar suyun kısmi uçları tarafından çekilerek suya geçer", "Moleküller iyonlaşır", "Su buharlaşır", "Çökelek oluşur"],
      cozum: "İlk adımda katyon ve anyonlar suyun kısmi negatif (O ucu) ve kısmi pozitif (H ucu) uçları tarafından çekilip suya geçer (s.167-168).",
      fc: ["İyonik çözünmede su molekülleri ne yapar?", "İyonları kısmi yükleriyle çeker."]
    },
    {
      bi: 1,
      metin: "İyonik çözünmede iyonların çevresini su moleküllerinin sarması iyonlara ne kazandırır?",
      secenekler: ["Kararlılık", "Kütle", "Renk", "Asitlik"],
      cozum: "Suyun kısmi negatif ucu katyonu, kısmi pozitif ucu anyonu sararak iyonlara kararlılık kazandırır (s.168).",
      fc: ["İyonları su sarması ne sağlar?", "Kararlılık."]
    },
    {
      bi: 1,
      metin: "Alkolün suda çözünmesi hangi çözünme türüne girer?",
      secenekler: ["Moleküler (fiziksel) çözünme", "İyonik çözünme", "Kimyasal çözünme", "Nötralleşme"],
      cozum: "Alkol moleküler yapıda olup iyonlaşmadan dağıldığından moleküler/fiziksel çözünmedir (s.168).",
      fc: ["Moleküler çözünme nedir?", "Moleküllerin iyonlaşmadan çözücüde dağılması."]
    },
    {
      bi: 1,
      metin: "Akümülatörde elektrik iletimini sağlayan sülfürik asit çözeltisi hangi özelliği taşır?",
      secenekler: ["Elektrolit olması", "Elektrolit olmaması", "Apolar olması", "Katı olması"],
      cozum: "Sülfürik asit iyonlarına ayrıştığından elektrolit çözeltidir ve aküde iletkenliği sağlar (s.192).",
      fc: ["Aküdeki H2SO4 çözeltisi nedir?", "Elektrolit."]
    },
    {
      bi: 1,
      metin: "Çözünme türleri hangi iki ana başlıkta toplanır?",
      secenekler: ["Fiziksel ve kimyasal çözünme", "Sıcak ve soğuk çözünme", "Hızlı ve yavaş çözünme", "Katı ve gaz çözünme"],
      cozum: "Kitaptaki şemada çözünme türleri fiziksel (iyonik, moleküler) ve kimyasal çözünme olarak sınıflandırılır (s.168).",
      fc: ["Çözünme türleri hangi iki grupta?", "Fiziksel ve kimyasal."]
    }
  ]
});

/* ---------------------------------------------------- 2.1.4 */
yazKonu({
  konu_id: "kimya_10_u02_k04",
  ders: DERS, tema: 2, tema_adi: "Çeşitlilik",
  baslik: "2.1.4 Derişim Birimleri (Molarite, ppm)",
  kazanim: "Molarite ve ppm birimlerini kullanarak çözelti derişimi hesaplar.",
  kaynak: kaynak("172-178"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Molarite ve ppm kavramlarını açıklar.",
    "Derişim ve seyreltme hesaplarını yapar."
  ],
  items: [
    {
      bi: 0,
      metin: "Molarite (M) hangi bağıntıyla hesaplanır?",
      secenekler: ["M = n / V", "M = n · V", "M = V / n", "M = m / V"],
      cozum: "Molarite, bir litre çözeltideki çözünmüş maddenin mol sayısıdır: M = n/V (V litre) (s.173-174).",
      fc: ["Molarite bağıntısı nedir?", "M = n/V"]
    },
    {
      bi: 0,
      metin: "ppm (milyonda bir derişim) neyi ifade eder?",
      secenekler: ["Bir litre çözeltide çözünen maddenin miligram cinsinden kütlesini", "Bir litre çözeltideki mol sayısını", "Çözeltinin yoğunluğunu", "Çözünenin kütlece yüzdesini"],
      cozum: "1 L (veya 1 kg) çözeltide çözünen maddenin mg cinsinden kütlesine ppm denir (s.175).",
      fc: ["ppm neyi ifade eder?", "1 L çözeltide mg cinsinden çözünen."]
    },
    {
      bi: 0,
      metin: "Çok az çözünmüş madde içeren çözeltilerde hangi birim tercih edilir?",
      secenekler: ["ppm", "Molarite", "Molalite", "Yüzde"],
      cozum: "Çözünen miktarı çok az olduğunda molarite yerine ppm kullanılır (s.175).",
      fc: ["Çok seyreltik çözeltide hangi birim?", "ppm."]
    },
    {
      bi: 1,
      metin: "2 L çözeltide 0,5 mol çözünen madde varsa molaritesi kaç mol/L'dir?",
      secenekler: ["0,25", "0,5", "1", "4"],
      cozum: "M = n/V = 0,5/2 = 0,25 mol/L (s.174).",
      fc: ["0,5 mol / 2 L kaç M'dir?", "0,25 M"]
    },
    {
      bi: 1,
      metin: "0,5 M 4 L çözeltide kaç mol çözünen vardır?",
      secenekler: ["2", "0,5", "4", "8"],
      cozum: "n = M·V = 0,5·4 = 2 mol (s.174).",
      fc: ["0,5 M 4 L'de kaç mol?", "2 mol"]
    },
    {
      bi: 1,
      metin: "1 L çözeltide 4 mg kurşun iyonu bulunan su örneğinin derişimi kaç ppm'dir?",
      secenekler: ["4", "0,4", "40", "400"],
      cozum: "1 L'de 4 mg → 4 ppm (s.175).",
      fc: ["1 L'de 4 mg kaç ppm?", "4 ppm"]
    },
    {
      bi: 1,
      metin: "1000 cm³ havada 380 mg CO2 bulunuyorsa CO2 derişimi kaç ppm'dir?",
      secenekler: ["380", "38", "3800", "0,38"],
      cozum: "1000 cm³ = 1 L; 1 L'de 380 mg → 380 ppm (kitaptaki tablo, s.175-176).",
      fc: ["1000 cm³'te 380 mg CO2 kaç ppm?", "380 ppm"]
    },
    {
      bi: 1,
      metin: "10 M 100 mL konsantre çözeltiden 0,1 M kaç litre çözelti hazırlanabilir?",
      secenekler: ["10", "1", "100", "0,1"],
      cozum: "n = 10·0,1 = 1 mol; V = n/M = 1/0,1 = 10 L (kitabın kontrol noktası, s.177).",
      fc: ["10 M 100 mL'den 0,1 M kaç L olur?", "10 L"]
    },
    {
      bi: 1,
      metin: "1 M 50 mL çözelti su ile 250 mL'ye tamamlanırsa yeni derişim kaç M olur?",
      secenekler: ["0,2", "0,5", "1", "5"],
      cozum: "M1V1 = M2V2 → 1·50 = M2·250 → M2 = 0,2 M (s.177-178).",
      fc: ["1 M 50 mL → 250 mL kaç M?", "0,2 M"]
    },
    {
      bi: 1,
      metin: "Aynı hacimdeki iki çözeltiden birim hacimde daha çok çözünen içeren için hangisi doğrudur?",
      secenekler: ["Daha derişiktir", "Daha seyreltiktir", "Doymuştur", "Elektrolit değildir"],
      cozum: "Birim hacimde çözünen miktarı fazla olan çözelti daha derişiktir (s.174).",
      fc: ["Birim hacimde çok çözünen çözelti nasıldır?", "Derişik."]
    }
  ]
});

/* ---------------------------------------------------- 2.1.5 */
yazKonu({
  konu_id: "kimya_10_u02_k05",
  ders: DERS, tema: 2, tema_adi: "Çeşitlilik",
  baslik: "2.1.5 Çözünürlük",
  kazanim: "Çözünürlüğü tanımlar ve çözünürlükle doymuşluk arasındaki ilişkiyi açıklar.",
  kaynak: kaynak("179-183"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Çözünürlük kavramını açıklar.",
    "Çözünürlük verilerini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Belirli sıcaklık ve basınçta çözünürlük nasıl tanımlanır?",
      secenekler: ["Belirli sıcaklık ve basınçta 100 g çözücüde çözünebilen maksimum madde miktarı", "Çözeltinin kaynama noktası", "Çözücünün buhar basıncı", "Çözünenin mol sayısı"],
      cozum: "Çözünürlük, belirli sıcaklık ve basınçta 100 g çözücüde çözünebilen maksimum madde miktarıdır (g/100 g çözücü) (s.181-183).",
      fc: ["Çözünürlüğün birimi nedir?", "g çözünen / 100 g çözücü."]
    },
    {
      bi: 0,
      metin: "Akide şekeri yapımında şurup nasıl hazırlanır?",
      secenekler: ["Bir ölçü suya üç ölçü şeker eklenerek", "Üç ölçü suya bir ölçü şeker eklenerek", "Yalnız su kaynatılarak", "Şeker eritilmeden"],
      cozum: "Kitaba göre akide şekeri yapılırken genellikle bir ölçü suya üç ölçü şeker kullanılır (s.179).",
      fc: ["Akide şurubunda su-şeker oranı nedir?", "1 ölçü suya 3 ölçü şeker."]
    },
    {
      bi: 0,
      metin: "Aynı koşullarda farklı katıların 100 g suda çözünen miktarlarının farklı olmasının temel nedeni nedir?",
      secenekler: ["Maddenin cinsi", "Kabın şekli", "Karıştırma süresi", "Ölçüm hatası"],
      cozum: "Çözünürlük maddenin cinsine bağlıdır; bu yüzden farklı katılar farklı miktarlarda çözünür (s.181-183).",
      fc: ["Çözünürlük neden maddeye göre değişir?", "Madde cinsi etkilidir."]
    },
    {
      bi: 1,
      metin: "25 °C'ta bir katının çözünürlüğü 40 g/100 g su ise 200 g suda en fazla kaç gram çözünür?",
      secenekler: ["80", "40", "200", "400"],
      cozum: "100 g suda 40 g ise 200 g suda 80 g çözünür (s.181-183).",
      fc: ["40 g/100 g ise 200 g suda kaç g?", "80 g"]
    },
    {
      bi: 1,
      metin: "100 g suda 30 g madde çözündüğünde doymuş çözelti elde ediliyorsa çözünürlük kaç g/100 g su'dur?",
      secenekler: ["30", "70", "130", "3"],
      cozum: "Doymuş çözeltide çözünen miktarı çözünürlüğü verir: 30 g/100 g su (s.181-183).",
      fc: ["100 g suda 30 g ile doyuyorsa çözünürlük kaçtır?", "30 g/100 g su"]
    },
    {
      bi: 1,
      metin: "Şeker şurubu yavaş soğutulursa hangi sonuç beklenir?",
      secenekler: ["İri kristaller oluşur", "Hiç kristal oluşmaz", "Şeker bozunur", "Su buharlaşır"],
      cozum: "Yavaş soğutmada kristal büyümesi için zaman kaldığından iri kristaller oluşur; akide şekeri böyle yapılır (s.179-180).",
      fc: ["Yavaş soğutmada kristal nasıl olur?", "İri kristaller."]
    },
    {
      bi: 1,
      metin: "Çözünürlük eğrisinin altındaki bölgede bulunan bir nokta hangi çözeltiyi gösterir?",
      secenekler: ["Doymamış çözelti", "Doymuş çözelti", "Aşırı doymuş çözelti", "Saf çözücü"],
      cozum: "Eğrinin altında kalan çözelti daha fazla madde çözebilir; doymamıştır (s.183, s.199).",
      fc: ["Eğrinin altındaki nokta hangi çözelti?", "Doymamış."]
    },
    {
      bi: 1,
      metin: "Bir katının çözünürlüğü 20 °C'ta 20 g, 60 °C'ta 60 g/100 g su ise sıcaklık artışının etkisi nedir?",
      secenekler: ["Çözünürlük artar", "Çözünürlük azalır", "Değişmez", "Önce artar sonra azalır"],
      cozum: "Verilerde sıcaklık arttıkça çözünürlük 20'den 60'a çıkmıştır; bu katı için çözünürlük sıcaklıkla artar (s.181-184).",
      fc: ["Sıcaklık artınca çözünürlük ne olur (bu katıda)?", "Artar."]
    },
    {
      bi: 1,
      metin: "Çözünürlük birimi genellikle nasıl ifade edilir?",
      secenekler: ["g çözünen / 100 g çözücü", "mol / L", "mg / L", "g / mL"],
      cozum: "Katıların çözünürlüğü genellikle 100 g çözücüde çözünen gram miktarı olarak verilir (s.181).",
      fc: ["Çözünürlük birimi nedir?", "g/100 g çözücü"]
    },
    {
      bi: 1,
      metin: "Doymuş bir çözeltiye aynı sıcaklıkta biraz daha katı eklendiğinde ne gözlenir?",
      secenekler: ["Katı çözünmeden dipte kalır", "Katı tamamen çözünür", "Çözelti kaynar", "Çözelti donar"],
      cozum: "Doymuş çözelti daha fazla madde çözemediğinden eklenen katı çözünmeden kalır (s.183, s.197).",
      fc: ["Doymuş çözeltiye katı eklenirse ne olur?", "Çözünmeden kalır."]
    }
  ]
});

/* ---------------------------------------------------- 2.1.6 */
yazKonu({
  konu_id: "kimya_10_u02_k06",
  ders: DERS, tema: 2, tema_adi: "Çeşitlilik",
  baslik: "2.1.6 Çözünürlüğe Etki Eden Faktörler",
  kazanim: "Sıcaklık, basınç ve madde cinsinin çözünürlüğe etkisini açıklar.",
  kaynak: kaynak("184-191"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Faktörlerin katı ve gaz çözünürlüğüne etkisini ayırt eder.",
    "Günlük yaşam olaylarını çözünürlükle açıklar."
  ],
  items: [
    {
      bi: 0,
      metin: "Katıların çözünürlüğü sıcaklık arttıkça genellikle nasıl değişir?",
      secenekler: ["Artar", "Azalır", "Değişmez", "Sıfır olur"],
      cozum: "Çoğu katının çözünürlüğü sıcaklıkla artar (s.184-188).",
      fc: ["Katılarda sıcaklık çözünürlüğü nasıl etkiler?", "Artırır."]
    },
    {
      bi: 0,
      metin: "Gazların çözünürlüğü sıcaklık arttıkça nasıl değişir?",
      secenekler: ["Azalır", "Artar", "Değişmez", "Önce artar"],
      cozum: "Gazların çözünürlüğü sıcaklık arttıkça azalır; bu nedenle ısınan sularda çözünmüş oksijen azalır (s.184-190).",
      fc: ["Gazlarda sıcaklık çözünürlüğü nasıl etkiler?", "Azaltır."]
    },
    {
      bi: 0,
      metin: "Gazların çözünürlüğü basınç arttıkça nasıl değişir?",
      secenekler: ["Artar", "Azalır", "Değişmez", "Sıfır olur"],
      cozum: "Basınç arttıkça gazın sıvıdaki çözünürlüğü artar (s.186-190).",
      fc: ["Gazlarda basınç çözünürlüğü nasıl etkiler?", "Artırır."]
    },
    {
      bi: 1,
      metin: "Kuzey denizlerinde balıkçılığın gelişmiş olmasının nedeni nedir?",
      secenekler: ["Soğuk suda çözünmüş oksijen miktarının fazla olması", "Suyun tuzluluğunun sıfır olması", "Basıncın çok yüksek olması", "Suyun sıcak olması"],
      cozum: "Kitaba göre Kuzey denizlerinde suda çözünmüş oksijen fazladır; bu da balıkçılığı geliştirmiştir (s.184).",
      fc: ["Kuzey denizlerinde balık neden çok?", "Soğuk suda O2 çözünürlüğü yüksek."]
    },
    {
      bi: 1,
      metin: "Gazlı içecek şişelerinin kapağı açıldığında neden gaz çıkışı olur?",
      secenekler: ["Basınç azaldığı için CO2 çözünürlüğü düşer", "Sıcaklık arttığı için", "Su buharlaştığı için", "Şeker kristallendiği için"],
      cozum: "Kapak açılınca basınç düşer, CO2'nin çözünürlüğü azalır ve gaz kabarcıkları çıkar (s.184-190).",
      fc: ["Gazlı içecek açılınca neden gaz çıkar?", "Basınç düşer, çözünürlük azalır."]
    },
    {
      bi: 1,
      metin: "Şeker pancarından şeker elde edilirken sıcak su kullanılmasının nedeni nedir?",
      secenekler: ["Sıcaklık arttıkça şekerin çözünürlüğünün artması", "Suyun buharlaşması", "Şekerin bozunması", "Basıncın artması"],
      cozum: "Sıcaklık artışı katı şekerin çözünürlüğünü artırdığından pancardaki şekerin büyük kısmı alınabilir (s.184).",
      fc: ["Pancar işleminde neden sıcak su?", "Şeker çözünürlüğü artar."]
    },
    {
      bi: 1,
      metin: "Asitli içeceklerin üzerinde 'Soğuk içiniz.' yazmasının nedeni nedir?",
      secenekler: ["Sıcaklık artınca çözünmüş CO2 miktarı azalacağı için", "Soğuk daha tatlı olduğu için", "Sıcaklık basıncı artırdığı için", "Soğuk suda şeker çözünmediği için"],
      cozum: "Sıcaklık arttıkça gazların çözünürlüğü azalır; içecek ısınırsa CO2 kaçar (s.184-186).",
      fc: ["Gazlı içecek neden soğuk içilir?", "Sıcakta CO2 çözünürlüğü azalır."]
    },
    {
      bi: 1,
      metin: "Dalgıçların derin dalışlarda normal hava yerine özel karışım kullanmasının nedeni nedir?",
      secenekler: ["Derinlikte basınç arttığı için azotun kanda çözünürlüğünün artması", "Oksijenin azalması", "Suyun sıcak olması", "Havanın kuruması"],
      cozum: "Derinlikte basınç arttıkça azot kanda daha çok çözünür; bu yüzden özel karışımlar kullanılır (s.184).",
      fc: ["Derinde azot çözünürlüğü neden artar?", "Basınç artar."]
    },
    {
      bi: 1,
      metin: "Çözünürlüğe etki eden faktörler hangileridir?",
      secenekler: ["Madde cinsi, sıcaklık ve basınç", "Yalnız karıştırma hızı", "Kabın rengi", "Ölçüm süresi"],
      cozum: "Kitapta çözünürlüğe madde cinsi, sıcaklık ve basıncın etki ettiği belirtilir (s.184-191).",
      fc: ["Madde cinsi çözünürlüğü nasıl etkiler?", "Her maddenin kendine özgü çözünürlüğü vardır."]
    },
    {
      bi: 1,
      metin: "NaCl deniz suyunda bol, CaCO3 çok az çözünür. Bu farkı açıklayan temel etken nedir?",
      secenekler: ["Maddenin cinsi", "Sıcaklık", "Basınç", "Hacim"],
      cozum: "Aynı çözücüde farklı maddelerin farklı çözünürlükte olması maddenin cinsinden kaynaklanır (s.184).",
      fc: ["NaCl ve CaCO3 çözünürlük farkı neden?", "Madde cinsi."]
    }
  ]
});

/* ---------------------------------------------------- 2.1.7 */
yazKonu({
  konu_id: "kimya_10_u02_k07",
  ders: DERS, tema: 2, tema_adi: "Çeşitlilik",
  baslik: "2.1.7 Çözeltilerin Sınıflandırılması",
  kazanim: "Çözeltileri elektrolitlik ve doygunluk bakımından sınıflandırır.",
  kaynak: kaynak("192-201"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Elektrolit ve elektrolit olmayan çözeltileri ayırt eder.",
    "Doymamış, doymuş ve aşırı doymuş çözeltileri karşılaştırır."
  ],
  items: [
    {
      bi: 0,
      metin: "Elektriği ileten çözeltilere ne denir?",
      secenekler: ["Elektrolit çözelti", "Elektrolit olmayan çözelti", "Aşırı doymuş çözelti", "Süspansiyon"],
      cozum: "İyonlarına ayrışarak elektrik ileten çözeltiler elektrolit çözeltidir (s.197).",
      fc: ["Elektrolit çözeltiler neden elektrik iletir?", "Serbest iyon içerdikleri için."]
    },
    {
      bi: 0,
      metin: "Belirli sıcaklıkta daha fazla madde çözebilen çözeltiye ne denir?",
      secenekler: ["Doymamış çözelti", "Doymuş çözelti", "Aşırı doymuş çözelti", "Elektrolit çözelti"],
      cozum: "Doymamış çözelti, çözücünün daha fazla madde çözebildiği çözeltidir (s.197-199).",
      fc: ["Daha fazla madde çözebilen çözelti nedir?", "Doymamış."]
    },
    {
      bi: 0,
      metin: "Aşırı doymuş çözelti için hangisi doğrudur?",
      secenekler: ["Kararsızdır ve koşullar değişince çökelme görülebilir", "Kararlıdır ve çökelme görülmez", "Elektrolit değildir", "Saf çözücüdür"],
      cozum: "Aşırı doymuş çözelti normalde çözünebilecek maksimumdan fazlasını içerir; kararsızdır ve çökelme gözlenebilir (s.199).",
      fc: ["Aşırı doymuş çözelti kararlı mı?", "Hayır, kararsız."]
    },
    {
      bi: 1,
      metin: "Aşağıdakilerden hangisi elektrolit olmayan çözeltiye örnektir?",
      secenekler: ["Şeker çözeltisi", "Tuz çözeltisi", "Hidroklorik asit çözeltisi", "Sodyum hidroksit çözeltisi"],
      cozum: "Şeker moleküler çözündüğü ve iyon oluşturmadığı için elektrolit değildir (s.197).",
      fc: ["Şeker çözeltisi neden elektriği iletmez?", "Moleküler çözündüğü için serbest iyon yoktur."]
    },
    {
      bi: 1,
      metin: "Doymuş çözeltide katısı ile dengede olan bir çözelti için hangisi doğrudur?",
      secenekler: ["Katı miktarı değişmez, çökelme görülmez", "Sürekli çökelme olur", "Elektrolit değildir", "Doymamıştır"],
      cozum: "Doymuş çözelti katısıyla dengededir; katı miktarı değişmez ve çökelme görülmez (s.199).",
      fc: ["Doymuş çözeltide katı miktarı değişir mi?", "Değişmez."]
    },
    {
      bi: 1,
      metin: "Sıcaklık düşürüldüğünde aşırı doymuş çözeltide ne gözlenir?",
      secenekler: ["Çökelme", "Daha fazla çözünme", "Kaynama", "Elektrolit oluşumu"],
      cozum: "Aşırı doymuş çözelti kararsız olduğundan koşullar değiştiğinde (soğuma) çözünen çökelir (s.199).",
      fc: ["Aşırı doymuş çözelti soğursa ne olur?", "Çökelme olur."]
    },
    {
      bi: 1,
      metin: "Akümülatörde kullanılan seyreltik sülfürik asit çözeltisi hangi sınıfa girer?",
      secenekler: ["Elektrolit çözelti", "Elektrolit olmayan çözelti", "Aşırı doymuş çözelti", "Saf çözücü"],
      cozum: "Sülfürik asit iyonlarına ayrıştığından elektrolit çözeltidir ve aküde iletkenliği sağlar (s.192).",
      fc: ["Akü asidi hangi tür çözelti?", "Elektrolit."]
    },
    {
      bi: 1,
      metin: "Doymamış bir çözelti nasıl doymuş hâle getirilebilir?",
      secenekler: ["Çözünen eklemeye devam ederek veya çözücüyü buharlaştırarak", "Suyu artırarak", "Basıncı düşürerek", "Kabı büyüterek"],
      cozum: "Çözünen eklenmesi veya çözücünün buharlaştırılması çözeltiyi doyma noktasına getirir (s.199).",
      fc: ["Doymamış çözelti nasıl doyurulur?", "Çözünen ekleyerek veya çözücü buharlaştırarak."]
    },
    {
      bi: 1,
      metin: "Elektrolit olmayan çözeltilerde elektrik iletiminin görülmemesinin nedeni nedir?",
      secenekler: ["Serbest iyon bulunmaması", "Suyun olmaması", "Çözeltinin soğuk olması", "Çözücünün apolar olması"],
      cozum: "İletkenlik serbest iyonlarla sağlanır; moleküler çözünmede iyon oluşmadığından iletim olmaz (s.197).",
      fc: ["Elektrolit olmayan çözelti neden iletmez?", "Serbest iyon yok."]
    },
    {
      bi: 1,
      metin: "0,1 M tuz çözeltisi ile 0,1 M şeker çözeltisi için hangisi doğrudur?",
      secenekler: ["Tuz çözeltisi elektrolit, şeker çözeltisi değildir", "İkisi de elektrolittir", "İkisi de elektrolit değildir", "Şeker çözeltisi daha iyi iletir"],
      cozum: "Tuz iyonlarına ayrışır (elektrolit), şeker moleküler çözünür (elektrolit değil) (s.197).",
      fc: ["Tuz ve şeker çözeltisi iletkenlik bakımından?", "Tuz iletir, şeker iletmez."]
    }
  ]
});

/* ---------------------------------------------------- 2.1.8 */
yazKonu({
  konu_id: "kimya_10_u02_k08",
  ders: DERS, tema: 2, tema_adi: "Çeşitlilik",
  baslik: "2.1.8 Koligatif Özellikler",
  kazanim: "Koligatif özellikleri tanecik sayısıyla ilişkilendirir ve günlük yaşamda açıklar.",
  kaynak: kaynak("202-210"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Koligatif özellikleri tanımlar.",
    "Kaynama/donma noktası değişimlerini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Koligatif özellikler neye bağlıdır?",
      secenekler: ["Çözünen tanecik sayısına", "Çözünenin türüne", "Çözeltinin rengine", "Kabın hacmine"],
      cozum: "Koligatif özellikler çözünenin türüne değil, tanecik sayısına bağlıdır (s.205).",
      fc: ["Tanecik sayısı artınca kaynama noktası nasıl değişir?", "Yükselir."]
    },
    {
      bi: 0,
      metin: "Aşağıdakilerden hangisi koligatif özelliktir?",
      secenekler: ["Kaynama noktası yükselmesi", "Renk değişimi", "Yoğunluk artışı", "Asitlik"],
      cozum: "Kaynama noktası yükselmesi ve donma noktası alçalması koligatif özelliklerdir (s.205).",
      fc: ["Koligatif özelliğe örnek ver.", "Kaynama noktası yükselmesi."]
    },
    {
      bi: 0,
      metin: "Uçucu olmayan bir katı saf çözücüde çözündüğünde çözeltinin buhar basıncı nasıl değişir?",
      secenekler: ["Azalır", "Artar", "Değişmez", "Sıfır olur"],
      cozum: "Çözünen tanecikler buharlaşmaya engel olduğundan çözeltinin buhar basıncı saf çözücününkinden düşüktür (s.205).",
      fc: ["Çözeltinin buhar basıncı ne olur?", "Azalır."]
    },
    {
      bi: 1,
      metin: "Yollara kışın tuz dökülmesinin nedeni nedir?",
      secenekler: ["Donma noktasını düşürerek buzlanmayı önlemek", "Suyu kaynatmak", "Buhar basıncını artırmak", "Yolu temizlemek"],
      cozum: "Tuzlu su, saf suya göre daha düşük sıcaklıkta donar; tuzlama buzlanmayı azaltır (s.202-206).",
      fc: ["Yola tuz neden dökülür?", "Donma noktasını düşürür."]
    },
    {
      bi: 1,
      metin: "Araç radyatörlerine antifriz konmasının nedeni nedir?",
      secenekler: ["Donma noktasını düşürüp kaynama noktasını yükseltmek", "Yakıt tasarrufu sağlamak", "Rengi değiştirmek", "Basıncı artırmak"],
      cozum: "Antifriz çözünen tanecik sayısını artırarak donma noktasını düşürür, kaynama noktasını yükseltir (s.202-206).",
      fc: ["Antifriz ne işe yarar?", "Donmayı geciktirir, kaynamayı yükseltir."]
    },
    {
      bi: 1,
      metin: "Aynı miktar suda 1 mol şeker ile 1 mol NaCl çözüldüğünde hangi çözeltinin kaynama noktası daha yüksek olur?",
      secenekler: ["NaCl çözeltisinin, çünkü daha çok tanecik oluşur", "Şeker çözeltisinin", "İkisi eşittir", "Belirlenemez"],
      cozum: "NaCl iki iyona ayrıştığından tanecik sayısı fazladır; koligatif etki daha büyük olur (s.205-206).",
      fc: ["1 mol NaCl mi 1 mol şeker mi daha çok kaynama yükseltir?", "NaCl (daha çok tanecik)."]
    },
    {
      bi: 1,
      metin: "Tatlı su gölleri tuzlu su göllerine göre neden daha çabuk donar?",
      secenekler: ["Tuzlu suyun donma noktası daha düşük olduğu için", "Tuzlu su daha sıcak olduğu için", "Tatlı suyun buhar basıncı düşük olduğu için", "Tuz buz oluşumunu hızlandırdığı için"],
      cozum: "Çözünen tuz donma noktasını düşürdüğünden tuzlu su daha geç donar (s.202-206).",
      fc: ["Tuzlu göl neden geç donar?", "Donma noktası düşer."]
    },
    {
      bi: 1,
      metin: "Uçak kanatlarına kışın alkol püskürtülmesinin nedeni nedir?",
      secenekler: ["Buzlanmayı önlemek", "Kanadı temizlemek", "Yakıtı soğutmak", "Basıncı artırmak"],
      cozum: "Alkol çözeltisi donma noktasını düşürerek kanatlarda buz oluşumunu engeller (s.202).",
      fc: ["Uçak kanadına neden alkol?", "Buzlanmayı önlemek için."]
    },
    {
      bi: 1,
      metin: "Çözeltinin kaynama noktası saf çözücüye göre nasıldır?",
      secenekler: ["Daha yüksektir", "Daha düşüktür", "Aynıdır", "Tanecik sayısına bağlı değildir"],
      cozum: "Çözünen tanecikler buhar basıncını düşürdüğünden çözelti daha yüksek sıcaklıkta kaynar (s.205-206).",
      fc: ["Çözelti mi saf su mu daha yüksek sıcaklıkta kaynar?", "Çözelti."]
    },
    {
      bi: 1,
      metin: "Koligatif etkinin büyüklüğü neye göre değişir?",
      secenekler: ["Çözünen tanecik sayısına", "Çözünenin rengine", "Kabın şekline", "Çözücünün hacmine tek başına"],
      cozum: "Etki, çözeltideki toplam çözünen tanecik sayısıyla artar (s.205).",
      fc: ["Koligatif etki neye göre artar?", "Tanecik sayısı arttıkça."]
    }
  ]
});

/* ---------------------------------------------------- 3.1.1 */
yazKonu({
  konu_id: "kimya_10_u03_k01",
  ders: DERS, tema: 3, tema_adi: "Sürdürülebilirlik",
  baslik: "3.1.1 Makro ve Mikro Ölçekli Deneyler",
  kazanim: "Makro ve mikro ölçekli deneyleri atom ekonomisi ve su ayak izi açısından karşılaştırır.",
  kaynak: kaynak("238-246"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Makro ve mikro ölçek kavramlarını açıklar.",
    "Atom ekonomisi ve su ayak izini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Bir öğrenci 250 mL çözelti hazırlayıp bol miktarda kimyasal harcıyor. Bu deney hangi ölçekte yapılmıştır?",
      secenekler: ["Kullanılan kimyasal maddelerin miktarının yüksek olduğu deney", "Çok küçük miktarlarla yapılan deney", "Yalnız bilgisayarda yapılan deney", "Yalnız gazlarla yapılan deney"],
      cozum: "Kitaba göre makro ölçekli deney, kullanılan kimyasal maddelerin miktarının yüksek olduğu deneydir (s.240).",
      fc: ["Makro ölçekli deney nedir?", "Yüksek miktarda kimyasalla yapılan deney."]
    },
    {
      bi: 0,
      metin: "Bir öğrenci damıtma plakasında yalnızca birkaç damla çözeltiyle çalışıyor. Bu deney hangi ölçektedir?",
      secenekler: ["Çok küçük miktarlarla gerçekleştirilen deney türü", "Çok büyük kaplarda yapılan deney", "Sadece teorik hesap", "Endüstriyel üretim"],
      cozum: "Mikro ölçekli deney çok küçük miktarlarla gerçekleştirilen deney türüdür (s.240).",
      fc: ["Mikro ölçekli deney nedir?", "Çok küçük miktarlarla yapılan deney."]
    },
    {
      bi: 0,
      metin: "Atom ekonomisi neyi ifade eder?",
      secenekler: ["Tepkimeye giren atomların ne kadarının istenen üründe yer aldığını", "Tepkimenin hızını", "Kullanılan su miktarını", "Deneyin süresini"],
      cozum: "Atom ekonomisi, çıkış maddesindeki atomların ne kadarının istenen üründe yer aldığını gösteren verimlilik yorumudur (s.240).",
      fc: ["Atom ekonomisi nedir?", "Atomların ürüne geçme oranı."]
    },
    {
      bi: 0,
      metin: "Kitaba göre su ayak izi neyi ifade eder?",
      secenekler: ["Bir ürün veya etkinlik için harcanan toplam su miktarını", "Suyun sertliğini", "Sudaki iyon miktarını", "Buharlaşma hızını"],
      cozum: "Su ayak izi, bireyin veya üretimin dolaylı ve dolaysız toplam su tüketimini ifade eder (s.240).",
      fc: ["Su ayak izi hangi tüketimi kapsar?", "Dolaylı ve dolaysız toplam su tüketimini."]
    },
    {
      bi: 1,
      metin: "Mikro ölçekli deneyin makro ölçeğe göre avantajı hangisidir?",
      secenekler: ["Daha az kimyasal ve daha az atık oluşması", "Daha çok atık üretmesi", "Daha pahalı olması", "Daha uzun sürmesi"],
      cozum: "Mikro ölçekte kimyasal tüketimi ve atık azalır; deney daha güvenli ve ekonomik olur (s.238-241).",
      fc: ["Mikro ölçeğin avantajı nedir?", "Az kimyasal, az atık."]
    },
    {
      bi: 1,
      metin: "Atom ekonomisi %100 olan bir tepkime için hangisi doğrudur?",
      secenekler: ["Tepkenlerdeki tüm atomlar istenen ürüne geçer", "Hiç ürün oluşmaz", "Yan ürün çoktur", "Tepkime gerçekleşmez"],
      cozum: "Atom ekonomisi %100 ise istenmeyen yan ürün yoktur; tüm atomlar üründe yer alır (s.240).",
      fc: ["Atom ekonomisi %100 ne demek?", "Tüm atomlar üründe."]
    },
    {
      bi: 1,
      metin: "Deney tasarımında bağımlı değişken nedir?",
      secenekler: ["Ölçülen ve değişimi izlenen değişken", "Araştırmacının değiştirdiği değişken", "Sabit tutulan değişken", "Hiç ölçülmeyen değişken"],
      cozum: "Bağımlı değişken, bağımsız değişkene bağlı olarak ölçülen değişkendir; kontrol değişkenleri sabit tutulur (s.190, s.239-241).",
      fc: ["Bağımsız değişken nedir?", "Araştırmacının kendi değiştirdiği değişken."]
    },
    {
      bi: 1,
      metin: "Sürdürülebilirlik açısından deneylerde öncelikli hedef nedir?",
      secenekler: ["Kimyasal ve su tüketimini azaltıp atığı en aza indirmek", "Daha çok kimyasal kullanmak", "Deneyi uzatmak", "Atığı doğaya bırakmak"],
      cozum: "Kitaba göre deneylerde kaynak tüketimini ve atığı azaltmak, sürdürülebilirliğe katkı sağlar (s.238-241).",
      fc: ["Deneylerde sürdürülebilirlik nasıl sağlanır?", "Az kimyasal, az su, az atık."]
    },
    {
      bi: 1,
      metin: "Aynı deney hem makro hem mikro ölçekte yapıldığında hangi sonuç beklenir?",
      secenekler: ["Gözlem benzer olur, tüketilen madde miktarı farklı olur", "Gözlem tamamen farklı olur", "Mikro ölçekte tepkime olmaz", "Makro ölçekte ürün oluşmaz"],
      cozum: "Ölçek değişse de kimyasal olay aynıdır; mikro ölçekte daha az madde kullanılır (s.238-241).",
      fc: ["Ölçek değişince gözlem değişir mi?", "Kimyasal olay aynı, madde miktarı farklı."]
    },
    {
      bi: 1,
      metin: "Yeşil kimya açısından en uygun deney tasarımı hangisidir?",
      secenekler: ["Küçük ölçekli, az çözücü gerektiren ve atığı geri kazanılabilen tasarım", "Bol çözücü kullanan tasarım", "Atığı lavaboya döken tasarım", "Tek kullanımlık bol malzemeli tasarım"],
      cozum: "Yeşil kimya, kimyasal ve çözücü tüketimini azaltan, atığı önleyen tasarımları önceler (s.237-241).",
      fc: ["Yeşil kimyada tercih ne?", "Az madde, az atık, geri kazanım."]
    }
  ]
});

/* ---------------------------------------------------- 3.1.2 */
yazKonu({
  konu_id: "kimya_10_u03_k02",
  ders: DERS, tema: 3, tema_adi: "Sürdürülebilirlik",
  baslik: "3.1.2 Atmosferdeki Tepkimeler ve Küresel Sorunlar",
  kazanim: "Atmosferdeki tepkimelerin yol açtığı küresel çevre sorunlarını açıklar.",
  kaynak: kaynak("247-255"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Atmosferdeki temel tepkimeleri tanır.",
    "Küresel sorunların neden ve sonuçlarını ilişkilendirir."
  ],
  items: [
    {
      bi: 0,
      metin: "Stratosferdeki ozon tabakasının işlevi nedir?",
      secenekler: ["Güneş'ten gelen UV ışınlarını soğurmak", "Atmosferi ısıtmak", "Oksijen üretmek", "Azotu parçalamak"],
      cozum: "Stratosferdeki ozon, Güneş'ten gelen ışınların Dünya yüzeyine ulaşmasını engeller (UV'yi soğurur) (s.251).",
      fc: ["Ozon tabakası ne yapar?", "UV ışınlarını soğurur."]
    },
    {
      bi: 0,
      metin: "Ozonun parçalanmasına yol açan maddeler hangileridir?",
      secenekler: ["Kloroflorokarbonlar (CFC) ve azot oksitler", "Yalnız su buharı", "Yalnız oksijen", "Yalnız helyum"],
      cozum: "CFC türleri ve azot oksit bileşikleri ozonu parçalayabilen gruplardır (s.251).",
      fc: ["Ozonu neler parçalar?", "CFC ve azot oksitler."]
    },
    {
      bi: 0,
      metin: "Sera etkisine yol açan gazlara örnek hangisidir?",
      secenekler: ["CO2", "O2", "N2", "He"],
      cozum: "CO2, CH4 gibi gazlar sera etkisinde etkilidir; atmosferde biriken bu gazlar ısınmayı artırır (s.247-253).",
      fc: ["Sera gazına örnek ver.", "CO2"]
    },
    {
      bi: 1,
      metin: "Asit yağmurlarının oluşumunda hangi gazlar etkilidir?",
      secenekler: ["SO2 ve NOx", "O2 ve N2", "He ve Ne", "H2 ve CH4"],
      cozum: "SO2 ve azot oksitler atmosferde suyla tepkimeye girerek asit yağmurlarına yol açar (s.249-253).",
      fc: ["Asit yağmuru hangi gazlardan olur?", "SO2 ve NOx."]
    },
    {
      bi: 1,
      metin: "Orman yangınlarından çıkan dumanın atmosferdeki etkisi nedir?",
      secenekler: ["Klor içeren molekülleri harekete geçirip ozon tabakasını inceltmesi", "Ozonu artırması", "Atmosferi soğutması", "Oksijeni yok etmesi"],
      cozum: "Kitaptaki habere göre yangın dumanı, klor içeren molekülleri harekete geçirerek ozon tabakasını inceltebilir (s.247-248).",
      fc: ["Yangın dumanı atmosferi nasıl etkiler?", "Ozon incelmesine katkı."]
    },
    {
      bi: 1,
      metin: "Kış aylarında Antarktika üzerinde ozon azalımının artmasının nedeni nedir?",
      secenekler: ["Kutup girdabı nedeniyle buz parçacıklarının oluşup klor bileşiklerini etkinleştirmesi", "Güneş ışınlarının artması", "Oksijen oranının yükselmesi", "Deniz seviyesinin düşmesi"],
      cozum: "Kutup girdabı havayı hapseder, soğuma ile buz parçacıkları oluşur ve klor bileşikleri ozonla tepkimeye girer (s.251-252).",
      fc: ["Antarktika'da ozon neden kışın azalır?", "Kutup girdabı ve buz parçacıkları."]
    },
    {
      bi: 1,
      metin: "Sera etkisinin artmasının temel sonucu nedir?",
      secenekler: ["Dünya yüzey sıcaklığının artması", "Ozonun tamamen bitmesi", "Denizlerin tuzlanması", "Oksijenin tükenmesi"],
      cozum: "Sera gazlarının artışı atmosferde daha fazla ısı tutulmasına, küresel sıcaklık artışına yol açar (s.249-253).",
      fc: ["Sera etkisi artarsa ne olur?", "Küresel ısınma."]
    },
    {
      bi: 1,
      metin: "Küresel sorunlarla mücadelede bireysel katkı hangisidir?",
      secenekler: ["Enerji ve su tüketimini azaltmak, atıkları ayrıştırmak", "Daha çok fosil yakıt kullanmak", "Kimyasal atıkları doğaya bırakmak", "Deneyleri büyük ölçekte yapmak"],
      cozum: "Kitaptaki yansıtma soruları kaynak tüketimini ve kirliliği azaltmaya yönelik davranışları hedefler (s.254-255).",
      fc: ["Birey küresel sorunlara nasıl katkı verir?", "Tüketimi azaltarak, atığı ayrıştırarak."]
    },
    {
      bi: 1,
      metin: "Atmosferdeki CO2 miktarının artmasının başlıca nedeni nedir?",
      secenekler: ["Fosil yakıtların yanması", "Ozonun parçalanması", "Azotun yoğunlaşması", "Helyumun artması"],
      cozum: "Fosil yakıtların yanması atmosfere büyük miktarda CO2 salar; bu da sera etkisini güçlendirir (s.249-253).",
      fc: ["CO2 neden artıyor?", "Fosil yakıt kullanımı."]
    },
    {
      bi: 1,
      metin: "Asit yağmurlarının çevreye etkisi hangisidir?",
      secenekler: ["Toprak ve su kimyasını değiştirip canlılara zarar vermesi", "Ozonu artırması", "Havayı temizlemesi", "Deniz seviyesini düşürmesi"],
      cozum: "Asit yağmurları su ve toprağın pH'ını düşürerek bitki, su canlıları ve yapılara zarar verir (s.249-253).",
      fc: ["Asit yağmuru neye zarar verir?", "Toprak, su, canlılar, yapılar."]
    }
  ]
});
