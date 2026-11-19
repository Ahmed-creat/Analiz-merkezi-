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

  var TDE = ["turk dili ve edebiyati", "turkce", "edebiyat"];

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
    { ders: ["fizik"], konu: "1.2.2 Yatay Doğrultuda Sabit İvmeyle Hareket Eden Cisimlerin Hareketi",
      desen: /sabit ivme|ivmeli hareket|ivme zaman|ivme.*grafik|grafik.*ivme/ },
    { ders: ["fizik"], konu: "1.1 Sabit Hızlı Hareket",
      desen: /sabit hizli hareket|sabit hizla|sabit suratle|sabit hiz.*grafik/ },
    { ders: ["fizik"], konu: "1.3.2 Serbest Düşme Hareketi", desen: /serbest dusme/ },
    { ders: ["fizik"], konu: "1.4 İki Boyutta Sabit İvmeli Hareket",
      desen: /iki boyutta|yatay atis|egik atis|menzil/ },
    { ders: ["fizik"], konu: "2.1.2 İş, Enerji ve Güç Kavramları Arasındaki İlişki", desen: /is.*enerji.*guc|enerji.*guc|guc.*is/ },
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
    { ders: ["kimya"], konu: "1.2.4 Graham Difüzyon ve Efüzyon Yasası", desen: /difuzyon|efuzyon|eftizyon/ },
    { ders: ["kimya"], konu: "2.1.2 Maddelerin Birbiri İçindeki Çözünebilirliği",
      desen: /birbiri icindeki cozunebilirlik|cozunebilirlik/ },
    { ders: ["kimya"], konu: "2.1.5 Çözünürlük", desen: /cozunurluk|asiri doymus/ },
    { ders: ["kimya"], konu: "2.1.4 Derişim Birimleri (Molarite, ppm)", desen: /derisim|molarite|ppm/ },

    // ---- Biyoloji ----
    { ders: ["biyoloji"], konu: "1.2 Işık Enerjisi Kullanılarak Besin Sentezi (Fotosentez)", desen: /fotosentez/ },
    { ders: ["biyoloji"], konu: "1.4 Işık Enerjisi Kullanılmadan Besin Sentezi (Kemosentez)", desen: /kemosentez/ },
    { ders: ["biyoloji"], konu: "1.5 Sindirim", desen: /sindirim/ },
    // ATP: ODSGM'nin bu konudaki resmî başlığı "Canlılık İçin Enerjinin Önemi
    // (ATP'nin Yapısı ve Enerji Aktarımında ATP'nin Rolü)" — Okulizyon aynı
    // konuyu yalnız parantez içeriğiyle gönderiyor.
    { ders: ["biyoloji"], konu: "1.1 Canlılık İçin Enerjinin Önemi",
      desen: /atpnin yapisi|atp nin yapisi|enerji aktariminda atp|atpnin rolu/ },
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

    // ---- Türk Dili ve Edebiyatı (10. sınıf, 4 tema) ----
    // Kaynak: site/content/mufredat/tde_kazanim_10.json
    // SIRA ÖNEMLİ — özel kural üstte:
    //   "Destan Dönemi Türk şiiri … koşuk türünün" → KOŞUK (destan dönemi
    //   nazım birimi koşuktur), aşağıdaki "Destan" kuralına düşmemeli.
    { ders: TDE, konu: "Koşuk",
      desen: /destan donemi|kosu[kg]|kopuz|(^| )sigir( |$)|(^| )solen( |$)/ },
    { ders: TDE, konu: "Sav", desen: /(^| )sav[a-z]{0,7}( |$)|atasozu/ },
    { ders: TDE, konu: "Türkü", desen: /turku|kavustak|nakarat/ },
    { ders: TDE, konu: "Koşma", desen: /kosma|guzelleme|kocaklama|taslama/ },
    { ders: TDE, konu: "Masal", desen: /masal|tekerleme/ },
    { ders: TDE, konu: "Destan",
      desen: /dogal destan|yapma destan|destan|motif/ },
    { ders: TDE, konu: "Mesnevi", desen: /mesnevi/ },
    { ders: TDE, konu: "Halk Hikâyesi", desen: /halk hikaye/ },
    { ders: TDE, konu: "Fabl", desen: /fabl/ },
    { ders: TDE, konu: "Dede Korkut Hikâyeleri", desen: /dede korkut/ },
    { ders: TDE, konu: "Tanzimat Dönemi Şiiri",
      desen: /tanzimat|namik kemal|ziya pasa|sinasi|abdulhak hamit/ },
    /* v92 — SAF ŞİİR AYRI KONU (kullanıcı, 18 Kasım): yalnızca adı/akımı geçen
       cümle Saf Şiir'e bağlanır. "imge", "mazmun", "edebî sanat" genel şiir
       bilgisi terimleridir; Okulizyon'un "şiirdeki mazmun, imge ve edebî
       sanatları belirler" kazanımı bu yüzden yanlışlıkla Saf Şiir'e düşüyordu.
       Kural GAZEL'den ÖNCE: cümlede hem "saf şiir" hem "mazmun" geçerse
       doğru cevap Saf Şiir'dir. */
    { ders: TDE, konu: "Saf Şiir", desen: /saf siir|oz siir|simgeci|semboliz/ },
    /* "mazmun" divan şiirinin kalıplaşmış imge dünyasıdır (ders notu: saf şiir
       gazelin mazmun dünyasına tepki olarak doğar) → Gazel. */
    { ders: TDE, konu: "Gazel", desen: /gazel|(^| )matla( |$)|(^| )makta( |$)|mazmun/ },
    { ders: TDE, konu: "Kaside", desen: /kaside|methiye|nesib|fahriye|tegazzul/ },
    { ders: TDE, konu: "Mersiye", desen: /mersiye/ },
    { ders: TDE, konu: "Şiirde Ahenk (Ölçü, Uyak, Redif, Aliterasyon, Asonans)",
      desen: /aheng|uyak|redif|aliterasyon|asonans|kafiye|olcu|aruz|durak|ritim/ },
    // Dil bilgisi — tamlama kuralları, tek kelimelik kurallardan ÖNCE
    { ders: TDE, konu: "İsim Tamlamaları", desen: /isim tamlama|tamlayan|tamlanan/ },
    { ders: TDE, konu: "Sıfat Tamlamaları", desen: /sifat tamlama/ },
    { ders: TDE, konu: "İsimler (Adlar)", desen: /isim|ad soylu|varlik adi/ },
    { ders: TDE, konu: "Sıfatlar (Ön Adlar)",
      desen: /sifat|(^| )on ad( |$)|niteleme|belirtme sifati/ },
    { ders: TDE, konu: "Zamir (Adıl)", desen: /zamir|(^| )adil( |$)/ },
    { ders: TDE, konu: "Edat (İlgeç)", desen: /edat|ilgec/ },
    { ders: TDE, konu: "Bağlaç", desen: /baglac/ },
    { ders: TDE, konu: "Ünlem", desen: /unlem/ },
    { ders: TDE, konu: "Zarflar (Belirteçler)", desen: /zarf|belirtec/ },
    { ders: TDE, konu: "Fiiller (Eylemler)",
      desen: /fiil|eylem|(^| )kip( |$)|cati/ },
    { ders: TDE, konu: "Yazım Kuralları", desen: /(^| )yazim|(^| )imla( |$)|yazim kural/ },
    { ders: TDE, konu: "Noktalama İşaretleri", desen: /noktalama|virgul|kesme isareti/ },
    { ders: TDE, konu: "Anlamına Göre Cümleler",
      desen: /anlamina gore cumle|cumle.*anlam|olumlu cumle|olumsuz cumle|soru cumlesi/ },
    // Paragraf EN SONDA: "anlatım biçimi" bir tür sorusunda da geçebilir,
    // tür kuralı onu yukarıda yakalamalı.
    { ders: TDE, konu: "Paragraf",
      desen: /paragraf|anlatim bicimi|anlatim teknigi|dusunceyi gelistirme/ }
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
