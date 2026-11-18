#!/usr/bin/env node
/* ============================================================
   FİZİK 10 · 4. ÜNİTE DALGALAR — kitaptan sıfırdan havuzlar
   ------------------------------------------------------------
     4.1 Dalgaların Temel Kavramları          s.274-282
     4.2 Dalgaların Sınıflandırılması          s.283-290
     4.3 Yayılma Süratini Etkileyen Etmenler   s.291-299
     4.4 Periyodik Hareketler                  s.300-308
     4.5 Yansıma ve Kırılma                    s.309-322
     4.6 A) Rezonans ve Deprem Kavramları      s.323-331
     4.6 B) Depremle İlgili Bilimsel Model     s.332-338
   Kullanım: node docs/uretim/uretim/fizik-t04.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Fizik";
const DOSYA = "fizik-10.pdf (MEB, 2025)";
const kaynak = s => "Fizik 10 ders kitabı, s." + s;

/* ------------------------------------------------------- 4.1 */
yazKonu({
  konu_id: "fizik_10_u04_k01",
  ders: DERS, tema: 4, tema_adi: "Dalgalar",
  baslik: "4.1 Dalgaların Temel Kavramları",
  kazanim: "Dalga, genlik, dalga boyu, periyot ve frekans kavramlarını kullanarak dalga hareketini açıklar.",
  kaynak: kaynak("274-282"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Dalga hareketine ait temel kavramları tanımlar.",
    "Dalga boyu, frekans ve sürat arasındaki ilişkiyi kullanarak hesap yapar."
  ],
  items: [
    {
      bi: 0,
      metin: "Dalga nasıl tanımlanır?",
      secenekler: ["Titreşim sonucu esnek ortamda oluşan şekil değişikliği", "Cismin bir noktadan diğerine taşınması", "Enerjinin depolanması", "Kuvvetlerin dengelenmesi"],
      cozum: "Kitapta dalga, titreşimler sonucunda esnek ortamda meydana gelen şekil değişikliği olarak tanımlanır (s.278).",
      fc: ["Dalga nedir?", "Esnek ortamda titreşimle oluşan şekil değişikliği."]
    },
    {
      bi: 0,
      metin: "Bir dalganın denge konumundan en uzak noktaya olan uzaklığına ne denir?",
      secenekler: ["Genlik", "Uzanım", "Dalga boyu", "Periyot"],
      cozum: "Denge konumundan en büyük uzaklığa genlik (A) denir; uzanım denge konumundan olan anlık uzaklıktır (s.279).",
      fc: ["Genlik nedir?", "Denge konumundan en büyük uzaklık."]
    },
    {
      bi: 0,
      metin: "Dalga boyunun birimi nedir?",
      secenekler: ["Metre", "Saniye", "Hertz", "Newton"],
      cozum: "Dalga boyu λ ile gösterilir ve uzunluk birimi metre ile ölçülür (s.280).",
      fc: ["Dalga boyu hangi birimle ölçülür?", "Metre."]
    },
    {
      bi: 0,
      metin: "Frekansın birimi nedir?",
      secenekler: ["Hertz", "Metre", "Saniye", "Joule"],
      cozum: "Frekans f ile gösterilir, birimi hertz (Hz)'dir (s.280).",
      fc: ["Frekansın birimi nedir?", "Hertz."]
    },
    {
      bi: 0,
      metin: "Periyot ile frekans arasındaki ilişki nedir?",
      secenekler: ["f = 1/T", "f = T", "f = T²", "f = 2T"],
      cozum: "Periyot bir tam titreşim süresi, frekans saniyedeki titreşim sayısıdır; f = 1/T (s.280).",
      fc: ["Periyot ve frekans arasındaki bağıntı nedir?", "f = 1/T"]
    },
    {
      bi: 1,
      metin: "Havadaki sesin sürati 340 m/s, kemanın la notasının frekansı 440 Hz'tir. Bu sesin dalga boyu yaklaşık kaç m'dir?",
      secenekler: ["0,77", "1,29", "340", "440"],
      cozum: "λ = v/f = 340/440 ≈ 0,77 m (kitaptaki 440 Hz örneği, s.281).",
      fc: ["340 m/s ve 440 Hz için dalga boyu kaç m'dir?", "Yaklaşık 0,77 m"]
    },
    {
      bi: 1,
      metin: "Dalga boyu 2 m, frekansı 5 Hz olan dalganın yayılma sürati kaç m/s'dir?",
      secenekler: ["10", "2,5", "0,4", "7"],
      cozum: "v = λ·f = 2·5 = 10 m/s (s.280).",
      fc: ["λ = 2 m, f = 5 Hz ise sürat kaç m/s'dir?", "10 m/s"]
    },
    {
      bi: 1,
      metin: "Yayılma sürati 20 m/s, dalga boyu 4 m olan dalganın periyodu kaç s'dir?",
      secenekler: ["0,2", "5", "80", "4"],
      cozum: "f = v/λ = 20/4 = 5 Hz; T = 1/f = 0,2 s (s.280).",
      fc: ["v = 20 m/s, λ = 4 m ise periyot kaç s'dir?", "0,2 s"]
    },
    {
      bi: 1,
      metin: "Genliği daha büyük olan bir dalga için hangisi doğrudur?",
      secenekler: ["Taşıdığı enerji daha büyüktür", "Frekansı daha büyüktür", "Sürati daha büyüktür", "Dalga boyu daha büyüktür"],
      cozum: "Kitapta genliğin dalganın taşıdığı enerjinin bir ölçüsü olduğu belirtilir (s.279).",
      fc: ["Genlik neyin ölçüsüdür?", "Taşınan enerjinin."]
    },
    {
      bi: 1,
      metin: "Frekansı sabit tutulan bir dalganın dalga boyu artırılırsa yayılma sürati nasıl değişir?",
      secenekler: ["Artar", "Azalır", "Değişmez", "Sıfır olur"],
      cozum: "v = λ·f bağıntısında f sabitse λ arttıkça v artar (s.280).",
      fc: ["Frekans sabitken dalga boyu artarsa sürat ne olur?", "Artar."]
    }
  ]
});

/* ------------------------------------------------------- 4.2 */
yazKonu({
  konu_id: "fizik_10_u04_k02",
  ders: DERS, tema: 4, tema_adi: "Dalgalar",
  baslik: "4.2 Dalgaların Sınıflandırılması",
  kazanim: "Dalgaları taşıdıkları enerjiye ve titreşim doğrultusuna göre sınıflandırır.",
  kaynak: kaynak("283-290"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Sınıflandırma ölçütlerini açıklar.",
    "Dalga türlerini örneklendirir."
  ],
  items: [
    {
      bi: 0,
      metin: "Dalgalar taşıdığı enerjiye göre nasıl sınıflandırılır?",
      secenekler: ["Mekanik ve elektromanyetik", "Enine ve boyuna", "Ses ve ışık", "Temel ve türetilmiş"],
      cozum: "Kitapta enerji taşıma biçimine göre mekanik ve elektromanyetik dalgalar ayrımı yapılır (s.284).",
      fc: ["Enerjiye göre dalga çeşitleri nelerdir?", "Mekanik ve elektromanyetik."]
    },
    {
      bi: 0,
      metin: "Mekanik dalgaların ortak özelliği nedir?",
      secenekler: ["Maddesel bir ortam gerektirir", "Boşlukta yayılır", "Yalnız katılarda yayılır", "Enerji taşımaz"],
      cozum: "Mekanik dalgalar esnek bir ortamda yayılır; boşlukta yayılamaz (s.284).",
      fc: ["Mekanik dalga ortam gerektirir mi?", "Evet, maddesel ortam gerekir."]
    },
    {
      bi: 0,
      metin: "Aşağıdakilerden hangisi elektromanyetik dalgadır?",
      secenekler: ["Işık", "Ses", "Su dalgası", "Yay dalgası"],
      cozum: "Işık elektromanyetik dalga olup boşlukta yayılabilir (s.284-285).",
      fc: ["Işık hangi dalga türüdür?", "Elektromanyetik."]
    },
    {
      bi: 0,
      metin: "Titreşim doğrultusuna göre dalgalar nasıl adlandırılır?",
      secenekler: ["Enine ve boyuna", "Mekanik ve elektromanyetik", "Periyodik ve periyodik olmayan", "Sesli ve sessiz"],
      cozum: "Titreşim doğrultusu yayılma doğrultusuna dikse enine, paralelse boyuna dalga denir (s.285).",
      fc: ["Titreşime göre dalga çeşitleri nelerdir?", "Enine ve boyuna."]
    },
    {
      bi: 0,
      metin: "Enine dalgada titreşim doğrultusu yayılma doğrultusuna göre nasıldır?",
      secenekler: ["Diktir", "Paraleldir", "Ters yönlüdür", "Rastgeledir"],
      cozum: "Enine dalgada titreşim yayılma doğrultusuna diktir (s.285).",
      fc: ["Enine dalgada titreşim nasıldır?", "Yayılmaya dik."]
    },
    {
      bi: 1,
      metin: "Ses dalgaları hangi tür dalgadır?",
      secenekler: ["Boyuna mekanik dalga", "Enine elektromanyetik dalga", "Enine mekanik dalga", "Boyuna elektromanyetik dalga"],
      cozum: "Ses, maddesel ortamda boyuna yayılan mekanik dalgadır (s.284-285).",
      fc: ["Ses hangi dalga türüdür?", "Boyuna mekanik dalga."]
    },
    {
      bi: 1,
      metin: "Deprem dalgaları için hangisi doğrudur?",
      secenekler: ["Hem enine hem boyuna yayılabilir", "Yalnız enine yayılır", "Yalnız boyuna yayılır", "Elektromanyetik dalgadır"],
      cozum: "Kitapta deprem dalgalarının mekanik dalga olup hem enine hem boyuna yayılabildiği yazılıdır (s.326).",
      fc: ["Deprem dalgaları nasıl yayılır?", "Hem enine hem boyuna."]
    },
    {
      bi: 1,
      metin: "Boşlukta yayılabilen dalga hangisidir?",
      secenekler: ["Elektromanyetik dalga", "Ses dalgası", "Su dalgası", "Deprem dalgası"],
      cozum: "Mekanik dalgalar ortam gerektirir; boşlukta yalnız elektromanyetik dalgalar yayılır (s.284).",
      fc: ["Boşlukta hangi dalga yayılır?", "Elektromanyetik."]
    },
    {
      bi: 1,
      metin: "Su dalgaları hangi sınıfta yer alır?",
      secenekler: ["Mekanik dalga", "Elektromanyetik dalga", "Nükleer dalga", "Işık dalgası"],
      cozum: "Su dalgaları maddesel ortam (su) gerektirdiğinden mekanik dalgadır (s.284).",
      fc: ["Su dalgası mekanik mi?", "Evet, mekanik dalgadır."]
    },
    {
      bi: 1,
      metin: "Yay üzerinde oluşturulan dalgada titreşim, yayılma doğrultusuna dik ise bu dalga hangisidir?",
      secenekler: ["Enine dalga", "Boyuna dalga", "Elektromanyetik dalga", "Ses dalgası"],
      cozum: "Titreşim yayılmaya dik olduğu için enine dalgadır (s.285).",
      fc: ["Yayda dik titreşim hangi dalgadır?", "Enine dalga."]
    }
  ]
});

/* ------------------------------------------------------- 4.3 */
yazKonu({
  konu_id: "fizik_10_u04_k03",
  ders: DERS, tema: 4, tema_adi: "Dalgalar",
  baslik: "4.3 Dalgaların Yayılma Süratini Etkileyen Etmenler",
  kazanim: "Dalgaların yayılma süratini etkileyen etmenleri deney ve gözlemlere dayanarak açıklar.",
  kaynak: kaynak("291-299"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Yayılma süratini etkileyen etmenleri açıklar.",
    "Deneysel verilerden sonuç çıkarır."
  ],
  items: [
    {
      bi: 0,
      metin: "Su dalgalarının yayılma sürati temel olarak neye bağlıdır?",
      secenekler: ["Ortamın derinliğine", "Dalganın genliğine", "Kaynağın rengine", "Dalga sayısına"],
      cozum: "Kitaptaki etkinlikte derinlik arttıkça su dalgalarının süratinin arttığı görülür (s.292-293).",
      fc: ["Su dalgasının sürati neye bağlıdır?", "Ortamın derinliğine."]
    },
    {
      bi: 0,
      metin: "Ses dalgalarının yayılma sürati hangi ortamda en büyüktür?",
      secenekler: ["Katı", "Sıvı", "Gaz", "Boşluk"],
      cozum: "Tanecikler arası bağların güçlü olduğu katılarda ses en hızlı yayılır (s.294).",
      fc: ["Ses en hızlı hangi ortamda yayılır?", "Katıda."]
    },
    {
      bi: 0,
      metin: "Bir dalganın yayılma süratini belirleyen temel etmen nedir?",
      secenekler: ["Yayıldığı ortamın özellikleri", "Kaynağın genliği", "Gözlemcinin konumu", "Dalganın adı"],
      cozum: "Sürat ortamın özelliklerine bağlıdır; kaynak yalnız frekansı belirler (s.293-294).",
      fc: ["Dalga süratini ne belirler?", "Ortamın özellikleri."]
    },
    {
      bi: 0,
      metin: "Sesin yayılma sürati hava sıcaklığı arttıkça nasıl değişir?",
      secenekler: ["Artar", "Azalır", "Değişmez", "Yalnız katılarda artar"],
      cozum: "Kitapta sıcaklık arttıkça sesin havadaki süratinin arttığı belirtilir (s.294).",
      fc: ["Sıcaklık artarsa sesin sürati ne olur?", "Artar."]
    },
    {
      bi: 0,
      metin: "Aynı ortamda farklı frekanslarda üretilen dalgaların süratleri için hangisi doğrudur?",
      secenekler: ["Eşittir", "Frekansı büyük olan daha hızlıdır", "Frekansı küçük olan daha hızlıdır", "Genliğe bağlıdır"],
      cozum: "Sürat ortama bağlı olduğundan aynı ortamda farklı frekanslı dalgaların sürati eşittir; frekans değişince dalga boyu değişir (s.293).",
      fc: ["Aynı ortamda farklı frekanslı dalgaların sürati eşit midir?", "Evet, eşittir."]
    },
    {
      bi: 1,
      metin: "Derin ortamdan sığ ortama geçen su dalgasının sürati nasıl değişir?",
      secenekler: ["Azalır", "Artar", "Değişmez", "Sıfır olur"],
      cozum: "Derinlik azaldıkça sürat azalır; kitaptaki gözlemler bunu destekler (s.292-293, s.318).",
      fc: ["Sığ ortama geçen su dalgası hızlanır mı?", "Hayır, yavaşlar."]
    },
    {
      bi: 1,
      metin: "Derin ortamdan sığ ortama geçen su dalgasının dalga boyu nasıl değişir?",
      secenekler: ["Azalır", "Artar", "Değişmez", "İki katına çıkar"],
      cozum: "Frekans değişmez, sürat azalırsa λ = v/f bağıntısına göre dalga boyu azalır (s.293).",
      fc: ["Sığ ortamda dalga boyu ne olur?", "Azalır."]
    },
    {
      bi: 1,
      metin: "Ortam değişirken su dalgasının değişmeyen özelliği hangisidir?",
      secenekler: ["Frekans", "Sürat", "Dalga boyu", "İlerleme doğrultusu"],
      cozum: "Frekans kaynağa bağlıdır; ortam değişse de değişmez, sürat ve dalga boyu değişir (s.293, s.318).",
      fc: ["Ortam değişince hangi özellik sabit kalır?", "Frekans."]
    },
    {
      bi: 1,
      metin: "Bir yayın gerginliği artırılırsa yay üzerindeki dalganın sürati nasıl değişir?",
      secenekler: ["Artar", "Azalır", "Değişmez", "Sıfır olur"],
      cozum: "Kitapta yayın gerginliği arttıkça dalga süratinin arttığı belirtilir (s.294).",
      fc: ["Gergin yayda dalga hızlanır mı?", "Evet, gerginlik artarsa sürat artar."]
    },
    {
      bi: 1,
      metin: "Özdeş dalga leğenlerinde 4 cm ve 6 cm derinlikte, aynı 1 s aralıkla dalga üretildiğinde süratlerin farklı çıkmasının nedeni nedir?",
      secenekler: ["Derinliğin farklı olması", "Frekansların farklı olması", "Genliklerin farklı olması", "Renklerin farklı olması"],
      cozum: "Frekanslar aynı olduğu hâlde sürat farklıysa tek değişken derinliktir (kitaptaki 4.15. soru, s.315).",
      fc: ["Aynı frekansta sürat neden farklı olur?", "Derinlik farklı olduğu için."]
    }
  ]
});

/* ------------------------------------------------------- 4.4 */
yazKonu({
  konu_id: "fizik_10_u04_k04",
  ders: DERS, tema: 4, tema_adi: "Dalgalar",
  baslik: "4.4 Periyodik Hareketler",
  kazanim: "Basit sarkaç ve yay sarkacında periyodu etkileyen değişkenleri açıklar.",
  kaynak: kaynak("300-308"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Periyodik hareketi ve sarkaç türlerini açıklar.",
    "Periyodu etkileyen değişkenleri deney verileriyle yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Periyodik hareket nasıl tanımlanır?",
      secenekler: ["Denge noktası etrafında düzenli olarak tekrarlanan hareket", "Sabit hızlı hareket", "Tek yönlü hızlanan hareket", "Duran hâl"],
      cozum: "Kitapta periyodik hareket, denge noktası etrafında düzenli tekrarlanan hareket olarak tanımlanır (s.301, s.308).",
      fc: ["Periyodik hareket nedir?", "Denge noktası etrafında düzenli tekrar eden hareket."]
    },
    {
      bi: 0,
      metin: "Basit sarkacın periyodu hangi niceliğe bağlıdır?",
      secenekler: ["İpin uzunluğuna", "Kütleye", "Genliğin büyüklüğüne (10°'den küçük açılarda)", "Ortamın rengine"],
      cozum: "Basit sarkacın periyodu ipin uzunluğunun kareköküyle doğru, g'nin kareköküyle ters orantılıdır (s.304, s.308).",
      fc: ["Basit sarkacın periyodu neye bağlıdır?", "İpin uzunluğuna ve g'ye."]
    },
    {
      bi: 0,
      metin: "Basit sarkacın periyodu ipin ucundaki kütle değiştirildiğinde nasıl değişir?",
      secenekler: ["Değişmez", "Artar", "Azalır", "Kütlenin karesi kadar artar"],
      cozum: "Kitapta basit sarkacın periyodunun kütleye bağlı olmadığı açıkça belirtilir (s.306, s.308).",
      fc: ["Kütle değişince sarkaç periyodu değişir mi?", "Hayır, değişmez."]
    },
    {
      bi: 0,
      metin: "Yay sarkacının periyodu hangi niceliğe bağlı değildir?",
      secenekler: ["Yer çekimi ivmesine", "Kütleye", "Yay sabitine", "Yayın esnekliğine"],
      cozum: "Kitaba göre yay sarkacının periyodu kütleye ve yay sabitine bağlıdır, çekim ivmesine bağlı değildir (s.308).",
      fc: ["Yay sarkacı periyodu g'ye bağlı mı?", "Hayır, bağlı değildir."]
    },
    {
      bi: 0,
      metin: "Basit sarkacın periyodik hareket olarak kabul edilmesi için açının hangi sınırın altında olması gerekir?",
      secenekler: ["10°", "45°", "90°", "Sınır yoktur"],
      cozum: "Kitapta düşeyle yapılan açının 10°'den küçük olması koşuluyla hareketin periyodik olduğu belirtilir (s.304).",
      fc: ["Basit sarkaç hangi açıya kadar periyodik sayılır?", "10°'den küçük açılarda."]
    },
    {
      bi: 1,
      metin: "Deneyde ip uzunluğu 10 cm iken periyot 0,6 s, 40 cm iken 1,2 s ölçülmüştür. Uzunluk artırıldığında periyot nasıl değişmiştir?",
      secenekler: ["Artmıştır", "Azalmıştır", "Değişmemiştir", "Yarıya inmiştir"],
      cozum: "Kitaptaki tabloda uzunluk arttıkça periyot artmaktadır (s.306).",
      fc: ["Uzunluk artarsa sarkaç periyodu ne olur?", "Artar."]
    },
    {
      bi: 1,
      metin: "40 cm uzunluğundaki sarkaçta kütle 100 g'dan 250 g'a çıkarılırsa periyot ne olur?",
      secenekler: ["1,2 s olarak kalır", "1,2 s'den büyük olur", "1,2 s'den küçük olur", "Sıfır olur"],
      cozum: "Periyot kütleye bağlı olmadığından değişmez, 1,2 s kalır (s.306-307).",
      fc: ["Kütle artarsa sarkaç periyodu kaç s olur?", "Değişmez, 1,2 s."]
    },
    {
      bi: 1,
      metin: "Bir sarkacın ipi kısaltılırsa periyodu nasıl değişir?",
      secenekler: ["Azalır", "Artar", "Değişmez", "Önce artar sonra azalır"],
      cozum: "T ∝ √l olduğundan uzunluk azalırsa periyot azalır (s.304-305).",
      fc: ["İp kısalırsa sarkaç hızlanır mı?", "Evet, periyot azalır."]
    },
    {
      bi: 1,
      metin: "Yay sarkacında yaya asılan kütle artırılırsa periyot nasıl değişir?",
      secenekler: ["Artar", "Azalır", "Değişmez", "Sıfır olur"],
      cozum: "T ∝ √m olduğundan kütle artarsa yay sarkacının periyodu artar (s.308).",
      fc: ["Yay sarkacında kütle artarsa periyot ne olur?", "Artar."]
    },
    {
      bi: 1,
      metin: "Cisimlerin dışarıdan etki olmaksızın yaptıkları salınımın frekansına ne denir?",
      secenekler: ["Doğal titreşim frekansı", "Rezonans frekansı", "Dalga frekansı", "Ölçüm frekansı"],
      cozum: "Kitapta bu frekans doğal titreşim frekansı olarak adlandırılır (s.303, s.308).",
      fc: ["Kendi kendine salınımın frekansı nedir?", "Doğal titreşim frekansı."]
    }
  ]
});

/* ------------------------------------------------------- 4.5 */
yazKonu({
  konu_id: "fizik_10_u04_k05",
  ders: DERS, tema: 4, tema_adi: "Dalgalar",
  baslik: "4.5 Su Dalgalarında Yansıma ve Kırılma",
  kazanim: "Su dalgalarında yansıma ve kırılma olaylarını yasalarıyla açıklar.",
  kaynak: kaynak("309-322"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Yansıma yasalarını açıklar.",
    "Kırılma olayında sürat, dalga boyu ve yön değişimini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Engel yüzeyine dik olarak çizilen doğruya ne denir?",
      secenekler: ["Yüzey normali", "Gelme açısı", "Yansıma açısı", "Ayırıcı yüzey"],
      cozum: "Kitapta yüzeye dik çizilen doğru yüzey normali (N) olarak tanımlanır (s.312).",
      fc: ["Yüzey normali nedir?", "Engel yüzeyine dik doğru."]
    },
    {
      bi: 0,
      metin: "Yansıma yasasına göre hangisi doğrudur?",
      secenekler: ["Gelme açısı yansıma açısına eşittir", "Gelme açısı yansıma açısından büyüktür", "Gelme açısı yansıma açısından küçüktür", "Açıların toplamı 90°'dir"],
      cozum: "Kitapta i = r eşitliği verilir (s.312).",
      fc: ["Yansıma yasası nedir?", "i = r"]
    },
    {
      bi: 0,
      metin: "Gelme açısı hangi iki doğru arasındaki açıdır?",
      secenekler: ["Gelen dalganın doğrultusu ile yüzey normali", "Gelen dalga ile engel yüzeyi", "Yansıyan dalga ile engel yüzeyi", "İki engel arasındaki uzaklık"],
      cozum: "Gelme açısı, gelen dalganın ilerleme doğrultusunun normalle yaptığı açıdır (s.312).",
      fc: ["Gelme açısı nerede ölçülür?", "Normal ile gelen dalga doğrultusu arasında."]
    },
    {
      bi: 0,
      metin: "Yankının net olarak algılanabilmesi için ses kaynağı ile engel arasında en az kaç metre olmalıdır?",
      secenekler: ["17 m", "7 m", "34 m", "170 m"],
      cozum: "Kitapta bu mesafenin en az 17 m olması gerektiği belirtilir (s.316).",
      fc: ["Yankı için en az kaç m gerekir?", "17 m"]
    },
    {
      bi: 0,
      metin: "Sesin sert ve düzgün bir yüzeyden yansımasıyla oluşan ikinci sese ne denir?",
      secenekler: ["Yankı", "Tını", "Rezonans", "Girişim"],
      cozum: "Kitapta bu olay yankı olarak adlandırılır (s.316).",
      fc: ["Yansıyan sesin adı nedir?", "Yankı."]
    },
    {
      bi: 1,
      metin: "Derin ortamdan sığ ortama geçen su dalgasının yayılma sürati nasıl değişir?",
      secenekler: ["Azalır", "Artar", "Değişmez", "Sıfır olur"],
      cozum: "Sığ ortamda sürat azalır; dalga normale yaklaşarak kırılır (s.318).",
      fc: ["Derinden sığa geçen dalga yavaşlar mı?", "Evet, sürat azalır."]
    },
    {
      bi: 1,
      metin: "Derin ortamdan sığ ortama geçen dalganın ilerleme doğrultusu normale göre nasıl değişir?",
      secenekler: ["Normale yaklaşır", "Normalden uzaklaşır", "Doğrultusu değişmez", "Geri yansır"],
      cozum: "Yavaşlayan dalga normale yaklaşacak biçimde kırılır (s.318).",
      fc: ["Yavaşlayan dalga normale ne yapar?", "Yaklaşır."]
    },
    {
      bi: 1,
      metin: "Kırılma sırasında değişmeyen nicelik hangisidir?",
      secenekler: ["Frekans", "Sürat", "Dalga boyu", "İlerleme doğrultusu"],
      cozum: "Frekans kaynağa bağlıdır; ortam değişse de sabit kalır (s.318).",
      fc: ["Kırılmada hangi nicelik sabittir?", "Frekans."]
    },
    {
      bi: 1,
      metin: "Sığ ortamdan derin ortama geçen bir dalganın dalga boyu nasıl değişir?",
      secenekler: ["Artar", "Azalır", "Değişmez", "Sıfır olur"],
      cozum: "Derin ortamda sürat artar; frekans sabit olduğu için λ = v/f bağıntısına göre dalga boyu artar (s.318-320).",
      fc: ["Sığdan derine geçen dalgada dalga boyu ne olur?", "Artar."]
    },
    {
      bi: 1,
      metin: "Yansıma olayında dalganın hangi özelliği değişir?",
      secenekler: ["İlerleme yönü", "Frekansı", "Sürati", "Dalga boyu"],
      cozum: "Yansımada ortam aynı kaldığından sürat, frekans ve dalga boyu değişmez; yalnız yön değişir (s.312).",
      fc: ["Yansımada ne değişir?", "Yalnız ilerleme yönü."]
    }
  ]
});

/* ----------------------------------------------------- 4.6 A */
yazKonu({
  konu_id: "fizik_10_u04_k06",
  ders: DERS, tema: 4, tema_adi: "Dalgalar",
  baslik: "4.6.1 Rezonans ve Depremle İlgili Kavramlar",
  kazanim: "Rezonansı açıklar; depremle ilgili kavramları (odak, merkez üssü, büyüklük, şiddet) ayırt eder.",
  kaynak: kaynak("323-331"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Rezonansı tanımlar ve örneklendirir.",
    "Depremle ilgili kavramları ayırt eder."
  ],
  items: [
    {
      bi: 0,
      metin: "Rezonans nasıl tanımlanır?",
      secenekler: ["Dış etkinin frekansının sistemin doğal frekansına eşit olmasıyla genliğin büyümesi", "Genliğin sürekli azalması", "Frekansın sıfırlanması", "Dalganın engelden yansıması"],
      cozum: "Kitapta rezonans, dışarıdan gelen etkinin frekansı ile sistemin doğal frekansının eşit olması sonucu genliğin sürekli artması olarak tanımlanır (s.325).",
      fc: ["Rezonans nedir?", "Zorlayıcı frekans = doğal frekans olduğunda genlik artar."]
    },
    {
      bi: 0,
      metin: "Ses dalgalarıyla ilgili rezonans türü hangisidir?",
      secenekler: ["Akustik rezonans", "Optik rezonans", "Nükleer rezonans", "Elektriksel rezonans"],
      cozum: "Kitapta akustik rezonansın ses dalgalarıyla ilgili olduğu belirtilir (s.329).",
      fc: ["Ses rezonansının adı nedir?", "Akustik rezonans."]
    },
    {
      bi: 0,
      metin: "Bir köprüde rezonans oluşması hangi sonuca yol açabilir?",
      secenekler: ["Titreşimlerin yapının çökmesine", "Yapının güçlenmesine", "Frekansın sıfırlanmasına", "Enerjinin yok olmasına"],
      cozum: "Kitapta köprüde rezonans oluşursa titreşimlerin çökmeye neden olabileceği yazılıdır (s.326).",
      fc: ["Köprüde rezonans neden tehlikelidir?", "Yapı çökebilir."]
    },
    {
      bi: 0,
      metin: "Deprem dalgalarının diğer adı nedir?",
      secenekler: ["Sismik dalgalar", "Elektromanyetik dalgalar", "Ses dalgaları", "Su dalgaları"],
      cozum: "Kitapta deprem dalgalarına sismik dalgalar da denildiği belirtilir (s.326).",
      fc: ["Deprem dalgasına ne denir?", "Sismik dalga."]
    },
    {
      bi: 0,
      metin: "Yer kabuğundaki levha hareketleri sonucu kayaçlarda oluşan kırılma hatlarına ne denir?",
      secenekler: ["Fay hattı", "Odak noktası", "Merkez üssü", "Sismograf"],
      cozum: "Kitapta bu kırılma hatları fay hattı olarak adlandırılır (s.326).",
      fc: ["Kırılma hattına ne denir?", "Fay hattı."]
    },
    {
      bi: 1,
      metin: "Depremin yer altında, kırılmanın gerçekleştiği noktasına ne denir?",
      secenekler: ["Odak noktası", "Merkez üssü", "Fay hattı", "Episantr"],
      cozum: "Odak noktası yerin altındaki kırılma noktasıdır; enerjinin açığa çıktığı yerdir (s.326).",
      fc: ["Depremin yer altındaki kaynağı nedir?", "Odak noktası."]
    },
    {
      bi: 1,
      metin: "Depremin merkez üssü nedir?",
      secenekler: ["Odak noktasının yeryüzündeki en yakın noktası", "Depremin büyüklüğü", "Fayın uzunluğu", "Sismografın bulunduğu yer"],
      cozum: "Merkez üssü, odak noktasının yüzeye en yakın noktası olup etkilerin en yoğun hissedildiği yerdir (s.326).",
      fc: ["Merkez üssü nedir?", "Odağın yüzeydeki iz düşümü."]
    },
    {
      bi: 1,
      metin: "Depremin büyüklüğü neyi ifade eder?",
      secenekler: ["Açığa çıkan enerji miktarını", "Yüzeyde hissedilme derecesini", "Odak derinliğini", "Fayın rengini"],
      cozum: "Kitapta büyüklüğün depremin oluşturduğu sarsıntının enerji salınımını ifade ettiği belirtilir (s.326-327).",
      fc: ["Büyüklük neyi ifade eder?", "Açığa çıkan enerjiyi."]
    },
    {
      bi: 1,
      metin: "Depremin şiddeti hangi ölçekle derecelendirilir?",
      secenekler: ["Değiştirilmiş Mercalli ölçeği (I-XII)", "Ohm ölçeği", "Hertz ölçeği", "Newton ölçeği"],
      cozum: "Kitapta şiddetin Değiştirilmiş Mercalli (MMI) ölçeğiyle I'den XII'ye derecelendirildiği yazılıdır (s.327).",
      fc: ["Deprem şiddeti hangi ölçekle belirtilir?", "Mercalli (I-XII)."]
    },
    {
      bi: 1,
      metin: "Depremin şiddeti hangi etmenlere bağlıdır?",
      secenekler: ["Odağa uzaklık, zemin koşulları ve yapı dayanıklılığı", "Yalnız büyüklük", "Yalnız fay uzunluğu", "Yalnız depremin saati"],
      cozum: "Kitapta şiddetin odağa uzaklık, zemin koşulları ve yapıların dayanıklılığına bağlı olduğu belirtilir (s.327).",
      fc: ["Şiddet nelere bağlıdır?", "Uzaklık, zemin, yapı dayanıklılığı."]
    }
  ]
});

/* ----------------------------------------------------- 4.6 B */
yazKonu({
  konu_id: "fizik_10_u04_k07",
  ders: DERS, tema: 4, tema_adi: "Dalgalar",
  baslik: "4.6.2 Depremle İlgili Bilimsel Model Oluşturabilme",
  kazanim: "Sismograf ve sismik izolatör gibi modelleri açıklar; deprem riskine çözüm önerileri geliştirir.",
  kaynak: kaynak("332-338"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Sismoloji ve sismograf kavramlarını açıklar.",
    "Deprem riskine yönelik model ve çözüm önerilerini yorumlar."
  ],
  items: [
    {
      bi: 0,
      metin: "Deprem ve yer hareketlerini inceleyen bilim dalına ne denir?",
      secenekler: ["Sismoloji", "Jeoloji", "Meteoroloji", "Astronomi"],
      cozum: "Kitapta bu bilim dalı sismoloji (deprem bilimi) olarak adlandırılır (s.332).",
      fc: ["Deprem biliminin adı nedir?", "Sismoloji."]
    },
    {
      bi: 0,
      metin: "Yer sarsıntılarını zamanla ilişkilendirerek kaydeden cihaza ne denir?",
      secenekler: ["Sismograf", "Barometre", "Termometre", "Voltmetre"],
      cozum: "Kitapta bu cihaz sismograf (depremyazar) olarak tanımlanır (s.332).",
      fc: ["Deprem kayıt cihazının adı nedir?", "Sismograf."]
    },
    {
      bi: 0,
      metin: "Sismografların yaptığı kayda ne denir?",
      secenekler: ["Sismogram", "Diyagram", "Spektrum", "Histogram"],
      cozum: "Kitapta sismografların yaptığı kayıt sismogram olarak adlandırılır (s.332).",
      fc: ["Sismograf kaydına ne denir?", "Sismogram."]
    },
    {
      bi: 0,
      metin: "Sismoloji alanında çalışan bilim insanına ne denir?",
      secenekler: ["Sismolog", "Jeolog", "Kimyager", "Astronom"],
      cozum: "Kitapta bu kişiler sismolog (deprem bilimci) olarak adlandırılır (s.332).",
      fc: ["Deprem bilimcisine ne denir?", "Sismolog."]
    },
    {
      bi: 0,
      metin: "En basit sismograf hangi parçalardan oluşur?",
      secenekler: ["Yay, ağırlıklı çubuk ve kayıt kalemi", "Mıknatıs ve pil", "Ayna ve mercek", "Türbin ve jeneratör"],
      cozum: "Kitapta en basit sismografın bir ucu sabitlenmiş, yayla desteklenmiş ağırlıklı çubuk ve kayıt kaleminden oluştuğu belirtilir (s.332).",
      fc: ["Basit sismografın parçaları nelerdir?", "Yay, ağırlıklı çubuk, kayıt kalemi."]
    },
    {
      bi: 1,
      metin: "Depremlerin doğrudan ölçülememesinin nedeni nedir?",
      secenekler: ["Yerin derinliklerinde meydana gelmeleri", "Çok kısa sürmeleri", "Ses çıkarmamaları", "Renklerinin olmaması"],
      cozum: "Kitapta depremlerin yerin derinliklerinde oluştuğu için doğrudan ölçülemediği, sismograflarla kaydedildiği belirtilir (s.332).",
      fc: ["Deprem neden doğrudan ölçülemez?", "Yer altında oluşur."]
    },
    {
      bi: 1,
      metin: "Sismik izolatörlerin işlevi nedir?",
      secenekler: ["Binaları depremin yıkıcı etkisinden korumak", "Elektrik akımını kesmek", "Sesi yalıtmak", "Işığı yansıtmak"],
      cozum: "Kitapta sismik izolatörlerin binaların yapısal güvenliğini artırarak depremin etkisinden koruduğu belirtilir (s.335).",
      fc: ["Sismik izolatör ne yapar?", "Bina ile zemin arasındaki etkiyi azaltır."]
    },
    {
      bi: 1,
      metin: "Meksiko'da merkez üssünden 320 km uzakta büyük yıkım oluşmasının temel nedeni nedir?",
      secenekler: ["Göl tabanı zeminin sismik dalgaları güçlendirmesi (rezonans)", "Depremin merkez üssünün şehirde olması", "Binaların çok hafif olması", "Depremin çok sığ olması"],
      cozum: "Kitaptaki örnekte göl tabanına kurulu zeminin dalgaları daha güçlü ilettiği ve binaların doğal frekansıyla rezonansa girdiği açıklanır (s.328).",
      fc: ["Meksiko'da uzak deprem neden yıkıcı oldu?", "Zemin rezonansı büyüttü."]
    },
    {
      bi: 1,
      metin: "Binaların doğal titreşim frekansı tasarımda neden dikkate alınır?",
      secenekler: ["Deprem dalgası frekansıyla çakışırsa rezonans yıkıma yol açabilir", "Bina daha hafif olsun diye", "Maliyeti artırmak için", "Ses yalıtımı için"],
      cozum: "Doğal frekans zorlayıcı frekansa eşitlenirse genlik büyür; bu nedenle frekansların çakışmaması hedeflenir (s.326, s.328).",
      fc: ["Bina frekansı neden önemlidir?", "Rezonans riskini önlemek için."]
    },
    {
      bi: 1,
      metin: "Deprem riskini azaltmaya yönelik en uygun model önerisi hangisidir?",
      secenekler: ["Zemin etüdüne göre tasarlanmış sismik izolatörlü yapılar", "Yalnız deprem sonrası yardım planı", "Binaların yüksekliğini artırmak", "Depremi önceden durdurmaya çalışmak"],
      cozum: "Kitapta depremin öngörülemezliği vurgulanır; bu nedenle riski azaltan yapısal çözümler (izolatör, zemin etüdü, dayanıklı tasarım) önerilir (s.334-336).",
      fc: ["Deprem riskini azaltan çözüm nedir?", "Zemin etüdü + sismik izolatör + dayanıklı tasarım."]
    }
  ]
});
