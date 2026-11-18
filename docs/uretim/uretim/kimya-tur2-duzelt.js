#!/usr/bin/env node
/* ============================================================
   KİMYA 10 — havuz denetleyici düzeltmeleri (tek seferlik)
   ------------------------------------------------------------
   `docs/uretim/araclar/havuz-denetle.js` 19 havuzda 38 bulgu
   verdi. Bulguların kaynağı üretici betiklerdeki metinler:
     · kart önü sorunun kopyası (34) — kart tanım sormalı
     · soru kökü 30 karakterden kısa (5)
     · "grafikte / tabloya göre" deyip görsel olmaması (2)
     · "Hepsi aynı hızda" çeldiricisi (1)
   Bu betik kimya-t1.js / kimya-t2.js içindeki metinleri düzeltir;
   ardından üreticiler yeniden koşulur.

   Kullanım: node docs/uretim/uretim/kimya-tur2-duzelt.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const DOSYALAR = [
  path.join(__dirname, "kimya-t1.js"),
  path.join(__dirname, "kimya-t2.js")
];

/* [eski, yeni] — her biri dosyalarda TAM BİR kez geçmeli */
const YAMA = [
  /* ---- 1.1.1 ---- */
  ['fc: ["Sodyum tuzu havai fişekte hangi rengi verir?", "Sarı."]',
   'fc: ["Na⁺ tuzlarının alev rengi nedir?", "Sarı."]'],
  ['fc: ["Çift yönlü tepkime hangi okla gösterilir?", "⇌"]',
   'fc: ["Kimyasal denklemde ⇌ sembolü neyi gösterir?", "Tepkimenin çift yönlü olduğunu."]'],

  /* ---- 1.1.2 ---- */
  ['metin: "Elektron transferine dayanan tepkimelere ne denir?",',
   'metin: "Bir atom elektron verirken diğeri elektron alıyorsa bu tepkime türü hangisidir?",'],
  ['fc: ["Her asit-baz tepkimesi nötralleşme mi?", "Hayır; nötralleşme sulu ortamda olur."]',
   'fc: ["Nötralleşmenin koşulu nedir?", "Sulu ortamda H⁺ ile OH⁻ birleşmesi."]'],

  /* ---- 1.1.3 ---- */
  ['fc: ["108 g Ag kaç moldür?", "1 mol"]',
   'fc: ["n = m/MA bağıntısındaki MA neyi gösterir?", "Mol kütlesini (g/mol)."]'],
  ['fc: ["0,5 mol CO2 kaç gramdır?", "22 g"]',
   'fc: ["Kütle mol sayısından nasıl bulunur?", "m = n·MA bağıntısıyla."]'],
  ['fc: ["36 g su kaç moldür?", "2 mol"]',
   'fc: ["Mol sayısı kütleden nasıl bulunur?", "n = m/MA bağıntısıyla."]'],

  /* ---- 1.1.4 ---- */
  ['fc: ["Denkleştirmede hangi elementler sona bırakılır?", "O ve H."]',
   'fc: ["Denkleştirmenin ilk adımı nedir?", "En karmaşık formüllü bileşikteki elementten başlanır."]'],

  /* ---- 1.2.1 ---- */
  ['fc: ["Deniz seviyesinde açık hava basıncı kaç atm?", "1 atm"]',
   'fc: ["1 atmosfer kaç mmHg\'dir?", "76 cmHg = 760 mmHg."]'],
  ['metin: "Aynı grafikte hacim 12 L iken basınç y ise y kaç atm\'dir?",',
   'metin: "Sabit sıcaklıkta 6 atm basınçta 2 L hacim kaplayan gazın hacmi 12 L olursa basıncı kaç atm olur?",'],
  ['cozum: "y·12 = 6·2 → y = 1 atm (s.94).",',
   'cozum: "P₁V₁ = P₂V₂ → 6·2 = y·12 → y = 1 atm (s.94).",'],
  ['fc: ["12 L\'de basınç kaç atm\'dir?", "1 atm"]',
   'fc: ["Sabit sıcaklıkta basınç ile hacim arasındaki ilişki nedir?", "Ters orantılıdır; P·V sabit kalır."]'],

  /* ---- 1.2.2 ---- */
  ['fc: ["Gaz tanecikleri nasıl hareket eder?", "Sürekli ve rastgele."]',
   'fc: ["Kinetik moleküler teorinin temel varsayımı nedir?", "Gaz tanecikleri sürekli ve rastgele hareket eder."]'],
  ['metin: "Gaz basıncının nedeni nedir?",',
   'metin: "Kinetik moleküler teoriye göre gazların kap çeperine uyguladığı basıncın nedeni nedir?",'],
  ['fc: ["Gaz basıncı neden oluşur?", "Taneciklerin çepere çarpmasından."]',
   'fc: ["Taneciklerin kap çeperine çarpması neyi oluşturur?", "Gaz basıncını."]'],
  ['fc: ["Sıcak hava balonu neden yükselir?", "Isınan havanın yoğunluğu azalır."]',
   'fc: ["Sıcaklık artınca gaz yoğunluğu nasıl değişir?", "Azalır; yoğunluğu küçülen hava yükselir."]'],

  /* ---- 1.2.3 ---- */
  ['fc: ["İdeal gaz denklemi nedir?", "PV = nRT"]',
   'fc: ["İdeal gaz denklemindeki semboller neyi gösterir?", "P basınç, V hacim, n mol, T sıcaklık, R gaz sabiti."]'],
  ['metin: "Kitaptaki tabloya göre ideal gaz sabiti R yaklaşık kaçtır?",',
   'metin: "İdeal gaz denkleminde basınç atm, hacim litre alınırsa gaz sabiti R yaklaşık kaçtır?",'],

  /* ---- 1.2.4 ---- */
  ['metin: "Difüzyon nedir?",',
   'metin: "Bir gazın başka gaz molekülleriyle kendiliğinden karışması hangi kavramla adlandırılır?",'],
  ['metin: "Efüzyon nedir?",',
   'metin: "Bir gazın küçük bir delikten dışarı kaçması hangi kavramla adlandırılır?",'],

  /* ---- 2.1.1 ---- */
  ['fc: ["Çözünme kaç aşamada gerçekleşir?", "Üç aşamada."]',
   'fc: ["Çözünmenin üç aşaması nedir?", "Kristalden ayrılma, boşluk oluşumu, yerleşme."]'],
  ['fc: ["Çözünmenin ilk aşaması nedir?", "Taneciklerin kristalden ayrılması."]',
   'fc: ["Çözünme sırasında çözünen taneciklere ne olur?", "Kristal yüzeyinden ayrılıp çözücüde dağılır."]'],
  ['"İri kristal hâlinde", "Hepsi aynı hızda"]',
   '"İri kristal hâlinde", "Parça büyüklüğü hızı etkilemez"'],
  ['fc: ["Toz mu küp mü hızlı çözünür?", "Toz."]',
   'fc: ["Yüzey alanı çözünme hızını nasıl etkiler?", "Yüzey alanı büyüdükçe çözünme hızlanır."]'],

  /* ---- 2.1.2 ---- */
  ['fc: ["Yağda çözünen vitaminler hangileri?", "A, D, K."]',
   'fc: ["A, D ve K vitaminlerinin ortak özelliği nedir?", "Apolar ve hidrofobiktirler; yağda çözünürler."]'],
  ['fc: ["İyot hangi çözücüde çözünür?", "Apolar çözücüde (CCl4)."]',
   'fc: ["İyodun apolar çözücüde çözünmesinin nedeni nedir?", "Benzer benzeri çözer; iyot apolardır."]'],
  ['fc: ["Tuz hangi çözücüde çözünür?", "Polar çözücüde."]',
   'fc: ["İyonik bileşikler hangi tür çözücüde çözünür?", "Polar çözücüde (iyon-dipol etkileşimi)."]'],

  /* ---- 2.1.3 ---- */
  ['fc: ["Alkolün suda çözünmesi hangi tür?", "Moleküler çözünme."]',
   'fc: ["Moleküler çözünme nedir?", "Moleküllerin iyonlaşmadan çözücüde dağılması."]'],

  /* ---- 2.1.5 ---- */
  ['metin: "Çözünürlük nasıl tanımlanır?",',
   'metin: "Belirli sıcaklık ve basınçta çözünürlük nasıl tanımlanır?",'],
  ['fc: ["Çözünürlük nedir?", "100 g çözücüde çözünen maksimum madde miktarı."]',
   'fc: ["Çözünürlüğün birimi nedir?", "g çözünen / 100 g çözücü."]'],
  ['fc: ["Akide şurubu nasıl hazırlanır?", "1 ölçü su + 3 ölçü şeker."]',
   'fc: ["Akide şurubunda su-şeker oranı nedir?", "1 ölçü suya 3 ölçü şeker."]'],

  /* ---- 2.1.6 ---- */
  ['fc: ["Çözünürlüğe hangi faktörler etki eder?", "Madde cinsi, sıcaklık, basınç."]',
   'fc: ["Madde cinsi çözünürlüğü nasıl etkiler?", "Her maddenin kendine özgü çözünürlüğü vardır."]'],

  /* ---- 2.1.7 ---- */
  ['fc: ["Elektriği ileten çözelti nedir?", "Elektrolit."]',
   'fc: ["Elektrolit çözeltiler neden elektrik iletir?", "Serbest iyon içerdikleri için."]'],
  ['fc: ["Elektrolit olmayan çözeltiye örnek?", "Şeker çözeltisi."]',
   'fc: ["Şeker çözeltisi neden elektriği iletmez?", "Moleküler çözündüğü için serbest iyon yoktur."]'],

  /* ---- 2.1.8 ---- */
  ['fc: ["Koligatif özellikler neye bağlı?", "Çözünen tanecik sayısına."]',
   'fc: ["Tanecik sayısı artınca kaynama noktası nasıl değişir?", "Yükselir."]'],

  /* ---- 3.1.1 ---- */
  ['metin: "Makro ölçekli deney nedir?",',
   'metin: "Bir öğrenci 250 mL çözelti hazırlayıp bol miktarda kimyasal harcıyor. Bu deney hangi ölçekte yapılmıştır?",'],
  ['metin: "Mikro ölçekli deney nedir?",',
   'metin: "Bir öğrenci damıtma plakasında yalnızca birkaç damla çözeltiyle çalışıyor. Bu deney hangi ölçektedir?",'],
  ['metin: "Su ayak izi neyi ifade eder?",',
   'metin: "Kitaba göre su ayak izi neyi ifade eder?",'],
  ['fc: ["Su ayak izi nedir?", "Toplam su tüketimi."]',
   'fc: ["Su ayak izi hangi tüketimi kapsar?", "Dolaylı ve dolaysız toplam su tüketimini."]'],
  ['fc: ["Bağımlı değişken nedir?", "Ölçülen değişken."]',
   'fc: ["Bağımsız değişken nedir?", "Araştırmacının kendi değiştirdiği değişken."]']
];

const icerik = new Map();
for (const d of DOSYALAR) icerik.set(d, fs.readFileSync(d, "utf8"));

let uygulanan = 0, bulunmayan = 0;
for (const [eski, yeni] of YAMA) {
  let yer = null;
  for (const d of DOSYALAR) if (icerik.get(d).includes(eski)) { yer = d; break; }
  if (!yer) { console.log("✗ bulunamadı: " + eski.slice(0, 60)); bulunmayan++; continue; }
  const s = icerik.get(yer);
  const ilk = s.indexOf(eski);
  if (s.indexOf(eski, ilk + 1) >= 0) { console.log("✗ birden çok: " + eski.slice(0, 60)); bulunmayan++; continue; }
  icerik.set(yer, s.slice(0, ilk) + yeni + s.slice(ilk + eski.length));
  uygulanan++;
}
for (const [d, s] of icerik) fs.writeFileSync(d, s, "utf8");
console.log("✔ uygulanan yama: " + uygulanan + " · eksik: " + bulunmayan);
process.exitCode = bulunmayan ? 1 : 0;
