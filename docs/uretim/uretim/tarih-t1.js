#!/usr/bin/env node
/* ============================================================
   TARİH 10 · 1. ÜNİTE — TÜRKİSTAN'DAN TÜRKİYE'YE (1040-1299)
   ------------------------------------------------------------
   Kaynak: MEB Tarih 10 (2025) — .kitap-metin/tarih.json
   (319 PDF sayfası). Basılı sayfa = PDF sayfası − 1.

     1.1 Önemli Askerî Mücadelelerin Türk Tarihinin
         Seyrine Etkileri                          s.12-33

   Kullanım: node docs/uretim/uretim/tarih-t1.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Tarih";
const DOSYA = "tarih-10.pdf (MEB, 2025)";
const kaynak = s => "Tarih 10 ders kitabı, s." + s;

yazKonu({
  konu_id: "tar_10_u01_k01",
  ders: DERS, tema: 1, tema_adi: "Türkistan'dan Türkiye'ye (1040-1299)",
  baslik: "1.1 Önemli Askerî Mücadelelerin Türk Tarihinin Seyrine Etkileri",
  kazanim: "1040-1299 yılları arasında meydana gelen önemli askerî mücadelelerin Türk tarihinin seyrine etkilerini karşılaştırır.",
  kaynak: kaynak("12-33"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "1040-1299 arasındaki askerî mücadelelerin neden ve sonuçlarını açıklar.",
    "Mücadelelerin Türk tarihinin seyrine etkisini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "1040 yılında Gaznelilere karşı kazanılan ve Büyük Selçuklu Devleti'nin kurulmasıyla sonuçlanan savaş hangisidir?",
      secenekler: [
        "Dandanakan Savaşı",
        "Pasinler Savaşı",
        "Miryokefalon Savaşı",
        "Kösedağ Savaşı"
      ],
      cozum: "Tuğrul ve Çağrı Beylerin liderliğindeki Oğuzlar, 1040'ta Gaznelilere karşı Dandanakan Savaşı'nı kazanarak Büyük Selçuklu Devleti'ni kurdu; Cend şehri başkent yapıldı (s.13-14).",
      fc: ["Dandanakan Savaşı nedir?", "1040'ta Selçukluların Gaznelileri yenip devlet kurduğu meydan savaşı."]
    },
    {
      bi: 0,
      metin: "Dandanakan Savaşı'nın ardından toplanan Selçuklu beyleri yeni devletin ilk sultanı olarak kimi ilan etmiştir?",
      secenekler: [
        "Tuğrul Bey'i",
        "Alp Arslan'ı",
        "Selçuk Bey'i",
        "İbrahim Yınal'ı"
      ],
      cozum: "Savaşın son günü yapılan toplantıda Tuğrul Bey yeni devletin ilk sultanı ilan edildi ve civardaki hükümdarlara fetihnâmeler gönderildi (s.14).",
      fc: ["Fetihnâme nedir?", "Kazanılan zaferin hükümdarlara yazılı olarak bildirildiği mektup."]
    },
    {
      bi: 0,
      metin: "18 Eylül 1048'de Erzurum yakınlarında yapılan Pasinler Savaşı'nın Türk tarihi açısından önemi nedir?",
      secenekler: [
        "Selçukluların Doğu Roma ile yaptığı bilinen ilk savaş olması",
        "Anadolu'nun kapılarının Türklere açılması",
        "İstanbul'un ilk kez Türkler tarafından kuşatılması",
        "Türkiye Selçuklu Devleti'nin kurulması"
      ],
      cozum: "Pasinler Savaşı, Selçukluların Doğu Roma İmparatorluğu ile yaptığı bilinen ilk savaş olarak tarihe geçmiştir; savaş sonrası Bizans ile diplomatik ilişkiler kurulmuştur (s.14-15).",
      fc: ["Pasinler Savaşı nedir?", "1048'de Selçuklular ile Doğu Roma arasındaki ilk savaş."]
    },
    {
      bi: 0,
      metin: "Malazgirt Savaşı'nda Alp Arslan'ın bizzat uyguladığı, sahte geri çekilme üzerine kurulu Türk savaş yöntemine ne ad verilir?",
      secenekler: [
        "Turan taktiği",
        "Kılıç hakkı",
        "İstimalet",
        "Fetihnâme"
      ],
      cozum: "Turan taktiği (bozkır kapanı), sahte geri çekilme ile düşmanı çembere alma yöntemidir; Malazgirt'te başarıyla uygulanmıştır (s.16).",
      fc: ["Turan taktiği nedir?", "Sahte geri çekilmeyle düşmanı çevreleyip yok etmeye dayanan Türk savaş yöntemi."]
    },
    {
      bi: 0,
      metin: "Miryokefalon Zaferi kaynaklarda hangi adla anılmıştır?",
      secenekler: [
        "Devlet ve vatan koruyan zafer",
        "Anadolu'nun kapısını açan zafer",
        "İlk deniz zaferi",
        "Bozkır kapanı"
      ],
      cozum: "Miryokefalon Zaferi (1176), Malazgirt'le kurulan devletin ve vatanın korunmasını sağladığı için 'devlet ve vatan koruyan zafer' olarak anılmıştır (s.18).",
      fc: ["Miryokefalon Zaferi nedir?", "1176'da II. Kılıçarslan'ın Bizans'ı yenerek Anadolu'yu Türk yurdu olarak koruduğu zafer."]
    },
    {
      bi: 1,
      metin: "I. Haçlı Seferi'nin ardından Türkiye Selçuklu Devleti başkentini nereye taşımak zorunda kalmıştır?",
      secenekler: [
        "İznik'ten Konya'ya",
        "Konya'dan İznik'e",
        "Sivas'tan Kayseri'ye",
        "Ankara'dan Kütahya'ya"
      ],
      cozum: "Haçlıların ilk hedefi olan İznik'i kurtaramayan I. Kılıçarslan, başkenti Konya'ya taşımıştır (s.23).",
      fc: ["I. Haçlı Seferi nedir?", "1095-1099'da Anadolu üzerinden Kudüs'e yürüyen Batılı orduların seferi."]
    },
    {
      bi: 1,
      metin: "II. Haçlı Seferi'nin düzenlenmesine yol açan gelişme hangisidir?",
      secenekler: [
        "Urfa Kontluğu'na 1144'te İmadeddin Zengi'nin son vermesi",
        "Kudüs'ün 1099'da Haçlıların eline geçmesi",
        "İstanbul'un 1204'te yağmalanması",
        "Malazgirt'te Bizans ordusunun yenilmesi"
      ],
      cozum: "I. Haçlı Seferi sırasında kurulan Urfa Kontluğu'na 1144'te Musul Atabeyi İmadeddin Zengi son verince Avrupalılar II. Haçlı Seferi (1147-1148) hazırlığına başladı (s.23).",
      fc: ["II. Haçlı Seferi nedir?", "1147-1148'de Urfa'nın kaybı üzerine düzenlenen ve Anadolu'da yenilgiyle biten sefer."]
    },
    {
      bi: 1,
      metin: "III. Haçlı Seferi'ni sonuçları bakımından diğerlerinden ayıran özellik hangisidir?",
      secenekler: [
        "Kudüs'ün geri alınamaması",
        "Anadolu'nun tümüyle Haçlı egemenliğine girmesi",
        "Türkiye Selçuklu Devleti'nin yıkılması",
        "İstanbul'da Latin İmparatorluğu'nun kurulması"
      ],
      cozum: "III. Haçlı Seferi'nde Akka ele geçirilip kıyı hâkimiyeti güçlendiyse de Kudüs geri alınamamıştır (s.26).",
      fc: ["III. Haçlı Seferi nedir?", "1189-1192'de Kudüs'ü geri almak için düzenlenen, ancak hedefine ulaşamayan sefer."]
    },
    {
      bi: 1,
      metin: "Hıttin Muharebesi'ni kazanarak Kudüs'ü 1187'de Müslümanların eline geçiren hükümdar kimdir?",
      secenekler: [
        "Selahaddin Eyyubi",
        "Nureddin Zengi",
        "II. Kılıçarslan",
        "Baycu Noyan"
      ],
      cozum: "Eyyubi Devleti'nin kurucusu Selahaddin Eyyubi, Hıttin Muharebesi'ni kazandı; üç ay sonra Kudüs Haçlılardan geri alındı (1187) (s.25).",
      fc: ["Hıttin Muharebesi nedir?", "1187'de Selahaddin Eyyubi'nin Haçlıları yenip Kudüs'ü geri aldığı savaş."]
    },
    {
      bi: 1,
      metin: "1243'te Baycu Noyan komutasındaki Moğolların sahte ricat yöntemiyle kazandığı, Anadolu'yu Moğol tahakkümüne sokan savaş hangisidir?",
      secenekler: [
        "Kösedağ Savaşı",
        "Yassıçimen Savaşı",
        "Miryokefalon Savaşı",
        "Dandanakan Savaşı"
      ],
      cozum: "Kösedağ Savaşı'nda (1243) Moğollar sahte ricat uyguladı; bozgun sonrası Türkiye Selçuklu Devleti Moğol tahakkümüne girdi ve 1243-1308 arası bu baskıdan kurtulamadı (s.29).",
      fc: ["Kösedağ Savaşı nedir?", "1243'te Moğolların Selçuklu ordusunu bozguna uğrattığı savaş."]
    }
  ]
});
