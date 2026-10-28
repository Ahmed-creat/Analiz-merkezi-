/* ============================================================
   KONU ANAHTARI (site/konu-anahtar.js)
   ------------------------------------------------------------
   SORUN (kullanıcı bildirimi): "konular yine kazanım olarak
   kaydediliyor... her kazanımda basbayağı konu ismi geçiyor."
   Doğru: Okulizyon'un kazanım cümlelerinin çoğunda konu adı ya
   aynen geçiyor ya da konunun ayırt edici kavramı geçiyor
   ("açıortay", "mol", "ahenk"...). Skor tabanlı eşleme bu
   cümlelerde düşük kalıyordu (0.04–0.22) ve kayıt ham kazanım
   olarak kalıyordu.

   ÇÖZÜM: elle bakılmış, KÜÇÜK ve DENETLENEBİLİR kural tablosu.
   Her satır: ders + kazanımda geçmesi gereken ifade → konu.
   Kural yoksa UYDURMA yapılmaz (null döner, ham kazanım korunur).

   Tarayıcı: <script src="konu-anahtar.js"></script> → window.KA
   Node    : module.exports = KA
   ============================================================ */
(function (kok) {
  "use strict";

  function sade(x) {
    return String(x == null ? "" : x)
      .toLocaleLowerCase("tr-TR")
      .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g")
      .replace(/ç/g, "c").replace(/ö/g, "o").replace(/ü/g, "u")
      .replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u")
      .replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  }

  // SIRA ÖNEMLİ: daha özel kural üstte olmalı.
  // (Örn. "kenara ait yükseklik ... alan" → Üçgende Alan,
  //  "yükseklik" tek başına Yardımcı Elemanlar demek DEĞİL.)
  var KURALLAR = [
    // ---- Matematik ----
    { ders: ["matematik"], konu: "1.3 Üçgende Alan",
      desen: /ucgenin alani|kenara ait yukseklik|alana dair|alanindaki degisim/ },
    { ders: ["matematik"], konu: "1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler",
      desen: /acior|kenarortay|kenar orta dikme|yardimci eleman/ },
    { ders: ["matematik"], konu: "1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler",
      desen: /trigonometrik oran|trigonometrik ozdeslik|tanjant|kotanjant/ },
    { ders: ["matematik"], konu: "1.4 Sinüs ve Kosinüs Teoremleri",
      desen: /sinus teorem|kosinus teorem|sinus ve kosinus/ },
    { ders: ["matematik"], konu: "7.1 Koşullu Olasılık, Bağımlı ve Bağımsız Olaylar",
      desen: /kosullu olasilik|bagimli olay|bagimsiz olay|olasilik/ },
    { ders: ["matematik"], konu: "7.2 Bayes Teoremi", desen: /bayes/ },
    { ders: ["matematik"], konu: "3.2 En Büyük Ortak Bölen-En Küçük Ortak Kat",
      desen: /ebob|ekok|en buyuk ortak bolen|en kucuk ortak kat/ },
    { ders: ["matematik"], konu: "3.3 Bölünebilme Özelliklerini Kullanarak Kalan Bulma",
      desen: /bolunebilme|kalan bulma/ },
    { ders: ["matematik"], konu: "3.1 Bir Doğal Sayı ile Asal Çarpanları ve Bölenleri Arasındaki İlişkiler",
      desen: /asal carpan|asal bolen/ },
    { ders: ["matematik"], konu: "4.2 Gerçek Sayılarda Tanımlı Karesel Fonksiyonlar ve Nitel Özellikleri",
      desen: /karesel fonksiyon|parabol/ },
    { ders: ["matematik"], konu: "4.3 Gerçek Sayılarda Tanımlı Karekök Fonksiyonlar ve Nitel Özellikleri",
      desen: /karekok fonksiyon/ },
    { ders: ["matematik"], konu: "5.1 Sayma Stratejileri",
      desen: /sayma strateji|permutasyon|kombinasyon|faktoriyel/ },

    // ---- Fizik ----
    { ders: ["fizik"], konu: "1.2 Bir Boyutta Sabit İvmeli Hareket",
      desen: /sabit ivme|ivmeli hareket|ivme zaman|ivme.*grafik|grafik.*ivme/ },
    { ders: ["fizik"], konu: "1.1 Sabit Hızlı Hareket",
      desen: /sabit hizli hareket|sabit hizla|sabit suratle|sabit hiz.*grafik/ },
    { ders: ["fizik"], konu: "1.3 Serbest Düşme", desen: /serbest dusme/ },
    { ders: ["fizik"], konu: "1.4 İki Boyutta Sabit İvmeli Hareket",
      desen: /iki boyutta|yatay atis|egik atis|menzil/ },
    { ders: ["fizik"], konu: "2.1 İş, Enerji ve Güç", desen: /is.*enerji.*guc|enerji.*guc|guc.*is/ },
    { ders: ["fizik"], konu: "3.3 Ohm Yasası", desen: /ohm|direnc.*gerilim|akim.*gerilim/ },
    { ders: ["fizik"], konu: "3.4 Dirençlerin Bağlanması", desen: /direnclerin baglanmasi|seri.*paralel.*direnc|esdeger direnc/ },
    { ders: ["fizik"], konu: "4.1 Dalgaların Temel Kavramları",
      desen: /dalga boyu|dalga.*frekans|periyot.*dalga|dalgalarin temel/ },

    // ---- Kimya ----
    { ders: ["kimya"], konu: "1.1.2 Kimyasal Tepkime Türleri",
      desen: /tepkime tur|tepkime turleri|cokelme|indirgenme|yukseltgenme|asit.?baz/ },
    { ders: ["kimya"], konu: "1.1.3 Mol Kavramı",
      desen: /mol kavrami|maddelerin miktarini|avogadro|tanecik sayisi|mol sayisi/ },
    { ders: ["kimya"], konu: "1.1.4 Kimyasal Tepkime Denklemlerinin Denkleştirilmesi",
      desen: /denklestir|denklem.*esitle/ },
    { ders: ["kimya"], konu: "1.1.5 Kimyasal (Stokiyometrik) Hesaplamalar",
      desen: /stokiyometri|tepkime.*hesaplama|sinirlayici bilesen/ },
    { ders: ["kimya"], konu: "1.2.1 Gazların Özellikleri ve Gaz Yasaları",
      desen: /gaz yasa|boyle|charles|basinc.?hacim|ideal gaz/ },
    { ders: ["kimya"], konu: "1.2.4 Graham Difüzyon ve Eftizyon Yasası", desen: /difuzyon|efuzyon|eftizyon/ },
    { ders: ["kimya"], konu: "2.1.2 Maddelerin Birbiri İçindeki Çözünebilirliği",
      desen: /birbiri icindeki cozunebilirlik|cozunebilirlik/ },
    { ders: ["kimya"], konu: "2.1.5 Çözünürlük", desen: /cozunurluk|asiri doymus/ },
    { ders: ["kimya"], konu: "2.1.4 Derişim Birimleri (Molarite, ppm)", desen: /derisim|molarite|ppm/ },

    // ---- Biyoloji ----
    { ders: ["biyoloji"], konu: "1.2 Işık Enerjisi Kullanılarak Besin Sentezi (Fotosentez)", desen: /fotosentez/ },
    { ders: ["biyoloji"], konu: "1.4 Işık Enerjisi Kullanılmadan Besin Sentezi (Kemosentez)", desen: /kemosentez/ },
    { ders: ["biyoloji"], konu: "1.5 Sindirim", desen: /sindirim/ },
    { ders: ["biyoloji"], konu: "1.7 Hücresel Solunum", desen: /hucre sel solunum|hucre solunumu|oksijenli solunum|oksijensiz solunum/ },
    { ders: ["biyoloji"], konu: "1.9 Fermantasyon", desen: /fermantasyon|etil alkol|laktik asit/ },
    { ders: ["biyoloji"], konu: "2.1 Ekosistemin Bileşenleri", desen: /ekosistemin bilesenleri|ekosistem.*bilesen/ },
    { ders: ["biyoloji"], konu: "2.4 Madde Döngüleri", desen: /azot dongusu|karbon dongusu|madde dongu/ },

    // ---- Coğrafya ----
    { ders: ["cografya"], konu: "1.1 Coğrafi Bakış",
      desen: /ornek olay|olguyu|olgunun|mekanin|mekanlar|temel kavramlari ile iliskilendir|cografi bakis/ },
    { ders: ["cografya"], konu: "2.1 CBS ve Uzaktan Algılamanın Uygulama Alanları", desen: /cbs|uzaktan algilama/ },
    { ders: ["cografya"], konu: "2.2 Mekânsal Verilerin Haritalara Aktarılması", desen: /harita/ },
    { ders: ["cografya"], konu: "3.1 Tektonik Süreçler", desen: /tektonik|fay hatti|levha hareketleri/ },

    // ---- Türk Dili ve Edebiyatı ----
    { ders: ["turk dili ve edebiyati", "turkce", "edebiyat"], konu: "Şiirde Ahenk (Ölçü, Uyak, Redif, Aliterasyon, Asonans)",
      desen: /ahenk|uyak|redif|aliterasyon|asonans|olcu/ },
    { ders: ["turk dili ve edebiyati", "turkce", "edebiyat"], konu: "Paragraf",
      desen: /paragraf|anlatim bicimi|anlatim teknigi/ },
    { ders: ["turk dili ve edebiyati", "turkce", "edebiyat"], konu: "Saf Şiir",
      desen: /mazmun|imge|edebi sanat|edebî sanat/ },
    { ders: ["turk dili ve edebiyati", "turkce", "edebiyat"], konu: "Yazım Kuralları",
      desen: /yazim kural|yazim yanlis/ },
    { ders: ["turk dili ve edebiyati", "turkce", "edebiyat"], konu: "Noktalama İşaretleri",
      desen: /noktalama/ },
    { ders: ["turk dili ve edebiyati", "turkce", "edebiyat"], konu: "Zamir (Adıl)", desen: /zamir/ },
    { ders: ["turk dili ve edebiyati", "turkce", "edebiyat"], konu: "Sıfatlar (Ön Adlar)", desen: /sifat|on ad/ },
    { ders: ["turk dili ve edebiyati", "turkce", "edebiyat"], konu: "Fiiller (Eylemler)", desen: /fiil\b|eylem/ },
    { ders: ["turk dili ve edebiyati", "turkce", "edebiyat"], konu: "Zarflar (Belirteçler)", desen: /zarf|belirtec/ },
    { ders: ["turk dili ve edebiyati", "turkce", "edebiyat"], konu: "Edat (İlgeç)", desen: /edat|ilgec/ },
    { ders: ["turk dili ve edebiyati", "turkce", "edebiyat"], konu: "Bağlaç", desen: /baglac/ },
    { ders: ["turk dili ve edebiyati", "turkce", "edebiyat"], konu: "Ünlem", desen: /unlem/ },
    { ders: ["turk dili ve edebiyati", "turkce", "edebiyat"], konu: "Anlamına Göre Cümleler",
      desen: /anlamina gore cumle|cumle.*anlam/ }
  ];

  /** kazanım + ders → { konu, kaynak:"kural" } ya da null */
  function esle(kazanim, ders) {
    var metin = sade(kazanim);
    if (!metin) return null;
    var d = sade(ders);
    for (var i = 0; i < KURALLAR.length; i++) {
      var r = KURALLAR[i];
      var dersTutar = !d || r.ders.some(function (x) { return d.indexOf(x) >= 0; });
      if (!dersTutar) continue;
      if (r.desen.test(metin)) return { konu: r.konu, kaynak: "kural", kural: i };
    }
    return null;
  }

  var KA = { esle: esle, KURALLAR: KURALLAR, sade: sade };
  if (typeof module !== "undefined" && module.exports) module.exports = KA;
  if (kok) kok.KA = KA;
})(typeof window !== "undefined" ? window : globalThis);
