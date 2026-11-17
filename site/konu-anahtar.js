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

    { ders: ["matematik"], konu: "2.1 İki Kategorik Değişkenin İlişkililiğini İçeren İstatistiksel Problemi Oluşturma, Veri Toplama, Analiz Etme ve Yorumlama",
      desen: /kategorik degisken|iki yonlu tablo|kontenjans|istatistiksel arastirma/ },
    { ders: ["matematik"], konu: "2.2 Başkaları Tarafından Oluşturulan İki Kategorik Değişkenli Verilerin İlişkililiğine Dayalı İstatistiksel Sonuç veya Yorumları Tartışma",
      desen: /istatistiksel sonuc|yorum.*tartis|yanlilik|orneklem/ },
    { ders: ["matematik"], konu: "4.1 Gerçek Sayılarda Tanımlı Fonksiyonların Nitel Özellikleri",
      desen: /fonksiyonun nitel|bire bir|orten fonksiyon|artan.*azalan/ },
    { ders: ["matematik"], konu: "4.4 Gerçek Sayılarda Tanımlı Rasyonel Fonksiyonlar ve Nitel Özellikleri",
      desen: /rasyonel fonksiyon|asimptot/ },
    { ders: ["matematik"], konu: "4.5 Doğrusal, Karesel, Karekök ve Rasyonel Referans Fonksiyonlar ile Bu Fonksiyonlardan Türetilebilen Fonksiyonların Ters Fonksiyonları",
      desen: /ters fonksiyon|tersi fonksiyon/ },
    { ders: ["matematik"], konu: "4.6 Doğrusal, Karesel, Karekök, Rasyonel Referans Fonksiyonlar ve Bunlardan Türetilen Fonksiyonlarla İfade Edilebilen Denklem ve Eşitsizlikler İçeren Problemlerin Çözümü",
      desen: /denklem.*esitsizlik|esitsizlik.*problem|modelle/ },
    { ders: ["matematik"], konu: "5.2 Cebirsel ve Fonksiyonel İşlemlerin Algoritmik Yapısı",
      desen: /algoritma|akis semasi|sozde kod|mantik baglac|niceleyici|babil metodu/ },
    { ders: ["matematik"], konu: "6.1 Dik Koordinat Sisteminde İki Nokta Arasındaki Uzaklık ve Bir Doğru Parçasını Belli Oranda Bölme",
      desen: /iki nokta arasindaki uzaklik|orta nokta|oranda bolme|disdan bolme/ },
    { ders: ["matematik"], konu: "6.2 Dik Koordinat Sisteminde Doğrunun Özellikleri ve Analitik İncelenmesi",
      desen: /dogrunun egimi|egim|dogru denklemi|paralel.*dik/ },
    // ---- Fizik ----
    { ders: ["fizik"], konu: "1.2.2 Yatay Doğrultuda Sabit İvmeyle Hareket Eden Cisimlerin Hareketi",
      desen: /yatay dogrultuda sabit ivme|ivme zaman|ivme.*grafik|grafik.*ivme|sabit ivme.*grafik/ },
    { ders: ["fizik"], konu: "1.2.1 İvme ve Hız Değişimi Arasındaki İlişki",
      desen: /sabit ivme|ivmeli hareket|ivme ve hiz degisimi|hiz degisimi/ },
    { ders: ["fizik"], konu: "1.1 Sabit Hızlı Hareket",
      desen: /sabit hizli hareket|sabit hizla|sabit suratle|sabit hiz.*grafik/ },
    { ders: ["fizik"], konu: "1.3.2 Serbest Düşme Hareketi",
      desen: /serbest dusme.*hesap|serbest dusme hareketi|serbest dusmeye yonelik/ },
    { ders: ["fizik"], konu: "1.3.1 Düşey Doğrultuda Cisimlerin Sahip Olduğu İvme",
      desen: /serbest dusme|yer cekimi ivmesi|dusey dogrultuda/ },
    { ders: ["fizik"], konu: "1.4 İki Boyutta Sabit İvmeli Hareket",
      desen: /iki boyutta|yatay atis|egik atis|menzil/ },
    { ders: ["fizik"], konu: "2.1.2 İş, Enerji ve Güç Kavramları Arasındaki İlişki",
      desen: /guc|is.*enerji.*guc|enerji.*guc/ },
    { ders: ["fizik"], konu: "2.1.1 Kuvvet-Yer Değiştirme Grafiği Kullanılarak İş Kavramının Tanımlanması",
      desen: /is kavrami|kuvvet.*yer degistirme|f.?x grafigi|grafik.*alan/ },
    { ders: ["fizik"], konu: "3.3 Ohm Yasası", desen: /ohm|direnc.*gerilim|akim.*gerilim/ },
    { ders: ["fizik"], konu: "3.4 Dirençlerin Bağlanması", desen: /direnclerin baglanmasi|seri.*paralel.*direnc|esdeger direnc/ },
    { ders: ["fizik"], konu: "4.1 Dalgaların Temel Kavramları",
      desen: /dalga boyu|dalga.*frekans|periyot.*dalga|dalgalarin temel/ },

    { ders: ["fizik"], konu: "4.6.1 Rezonans ve Depremle İlgili Kavramlar",
      desen: /rezonans|deprem|odak noktasi|merkez ussu|fay hatti|sismik/ },
    { ders: ["fizik"], konu: "4.6.2 Depremle İlgili Bilimsel Model Oluşturabilme",
      desen: /sismograf|sismogram|sismolog|sismik izolator/ },

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

    { ders: ["kimya"], konu: "1.1.1 Kimyasal Tepkimelerin Oluşumu",
      desen: /kimyasal degisim|kanit|tepkime.*olusum|model olustur/ },
    { ders: ["kimya"], konu: "1.2.2 Gazların Kinetik Moleküler Teorisi",
      desen: /kinetik molekuler|tanecik hizi|ortalama kinetik enerji/ },
    { ders: ["kimya"], konu: "1.2.3 İdeal Gaz Yasası",
      desen: /ideal gaz|genel gaz denklem|r sabiti/ },
    { ders: ["kimya"], konu: "2.1.1 Çözünme Süreci",
      desen: /cozunme sureci|hidratasyon|solvatasyon/ },
    { ders: ["kimya"], konu: "2.1.3 Çözünme Olayının Sınıflandırılması",
      desen: /iyonik cozunme|molekuler cozunme|elektrolit olmayan/ },
    { ders: ["kimya"], konu: "2.1.6 Çözünürlüğe Etki Eden Faktörler",
      desen: /cozunurluge etki|sicaklik.*cozunurluk|basinc.*cozunurluk/ },
    { ders: ["kimya"], konu: "2.1.7 Çözeltilerin Sınıflandırılması",
      desen: /doymus|asiri doymus|doymamis|elektrolit cozelti/ },
    { ders: ["kimya"], konu: "2.1.8 Koligatif Özellikler",
      desen: /koligatif|kaynama noktasi yuksel|donma noktasi dus|buhar basinci/ },
    { ders: ["kimya"], konu: "3.1.1 Makro ve Mikro Ölçekli Deneyler",
      desen: /makro olcek|mikro olcek|atom ekonomisi|su ayak izi/ },
    { ders: ["kimya"], konu: "3.1.2 Atmosferdeki Tepkimeler ve Küresel Sorunlar",
      desen: /sera etkisi|asit yagmur|ozon|kuresel isinma|cfc/ },
    // ---- Biyoloji ----
    { ders: ["biyoloji"], konu: "2.7 Ekolojik Ayak İzinin Küçültülmesi",
      desen: /ekolojik ayak izi|karbon ayak izi|su ayak izi|ayak izini kucult/ },
    { ders: ["biyoloji"], konu: "2.9 Atık Yönetimi",
      desen: /atik yonetimi|bertaraf|kompost|biyometanizasyon/ },
    { ders: ["biyoloji"], konu: "2.8 Doğal Kaynakların ve Biyoçeşitliliğin Korunması",
      desen: /biyocesitliligin korunmasi|dogal kaynaklarin korunmasi|koruma.*onlem|tohum bankasi/ },
    { ders: ["biyoloji"], konu: "2.6 Ekolojik Sürdürülebilirliği Kısıtlayan Durumlar",
      desen: /kisitlayan|habitat kaybi|otrofikasyon|asit yagmuru|ozon tabakasi/ },
    { ders: ["biyoloji"], konu: "2.5 Ekolojik Sürdürülebilirliğin Önemi",
      desen: /ekolojik surdurulebilirligin onem|surdurulebilirligin onemini/ },
    { ders: ["biyoloji"], konu: "2.4 Madde Döngüleri",
      desen: /azot dongusu|karbon dongusu|su dongusu|madde dongu/ },
    { ders: ["biyoloji"], konu: "2.3 Ekosistemdeki Madde ve Enerji Akışı",
      desen: /enerji akisi|enerji piramidi|besin zinciri|besin agi|trofik|biyolojik birikim/ },
    { ders: ["biyoloji"], konu: "2.2 Komünitelerde ve Popülasyonlarda Görülen Etkileşimler ve Değişimler",
      desen: /komunite|populasyon|rekabet|simbiyoz|parazit|mutualizm|sukse/ },
    { ders: ["biyoloji"], konu: "2.1 Ekosistemin Bileşenleri",
      desen: /ekosistemin.*bilesen|ekosistem.*cansiz|cansiz.*bilesen/ },
    { ders: ["biyoloji"], konu: "1.10 Enerji-Metabolizma İlişkisi",
      desen: /metabolik surec|metabolizma/ },
    { ders: ["biyoloji"], konu: "1.8 Besinlerin Solunuma Katılma Yolları",
      desen: /farkli besin gruplari|besin gruplarindan enerji/ },
    { ders: ["biyoloji"], konu: "1.9 Fermantasyon",
      desen: /fermantasyon|etil alkol|laktik asit/ },
    { ders: ["biyoloji"], konu: "1.7 Hücresel Solunum",
      desen: /hucresel solunum|hucre solunumu|oksijenli solunum|oksijensiz solunum/ },
    { ders: ["biyoloji"], konu: "1.6 İnsanda Sindirim",
      desen: /insanda.*sindirim|emilim/ },
    { ders: ["biyoloji"], konu: "1.5 Sindirim",
      desen: /sindirim cesit|sindirim yapi|sindirim.*siniflandir/ },
    { ders: ["biyoloji"], konu: "1.4 Işık Enerjisi Kullanılmadan Besin Sentezi (Kemosentez)",
      desen: /kemosentez/ },
    { ders: ["biyoloji"], konu: "1.3 Fotosentezde Kullanılan ve Üretilen Maddeler",
      desen: /fotosentezde kullanilan|uretilen maddeler|fotosentez.*deney/ },
    { ders: ["biyoloji"], konu: "1.2 Işık Enerjisi Kullanılarak Besin Sentezi (Fotosentez)",
      desen: /fotosentez/ },
    { ders: ["biyoloji"], konu: "1.1 Canlılık İçin Enerjinin Önemi",
      desen: /enerjinin gereklilig|canlilik icin enerji|atp/ },
    // ---- Coğrafya ----
    { ders: ["cografya"], konu: "7.1 Türk Kültürünün Mekânsal Özellikleri",
      desen: /turk dunyasi|turk kultur|kulturel miras|turkistan|nevruz|hidirellez|ahi|yunus|destan/ },
    { ders: ["cografya"], konu: "6.4 Afet Bilinci",
      desen: /afet bilinci|afet egitimi|tatbikat|afet cantasi|unisdr/ },
    { ders: ["cografya"], konu: "6.3 Afetlerden Korunma",
      desen: /afetlerden korunma|yapisal olmayan risk|istinat|dere islah|kentsel donusum|guclendirme/ },
    { ders: ["cografya"], konu: "6.2 Afetlere Karşı Dirençli Yaşam Alanları",
      desen: /direncli yasam|direnclilik|saglamlik|yedeklilik|kapsayicilik|risk haritasi/ },
    { ders: ["cografya"], konu: "6.1 Afetlerle Mücadelede İyi Uygulama Örnekleri",
      desen: /afetle mucadele|iyi uygulama|erken uyari|tsunami|kasirga|heyelan|orman yangini/ },
    { ders: ["cografya"], konu: "5.3 Türkiye Ekonomisinin Sektörel Dağılımı",
      desen: /turkiye ekonomisinin sektorel|turkiye.*sektorel dagilim|gsyih/ },
    { ders: ["cografya"], konu: "5.2 Ekonomik Sektörler ve Gelişmişlik",
      desen: /sektorel dagilim|gelismislik|sektorlerin dagilimi/ },
    { ders: ["cografya"], konu: "5.1 Ekonomik Faaliyetlerin Özellikleri",
      desen: /ekonomik faaliyet.*ozellik|ekonomik faaliyetleri.*siniflandir|besincil|dorduncu sektor/ },
    { ders: ["cografya"], konu: "4.2 Yerleşmelerin Fonksiyonları",
      desen: /yerlesme.*fonksiyon|fonksiyon.*yerlesme|metropol|sehir.*fonksiyon/ },
    { ders: ["cografya"], konu: "4.1 Yerleşmelerin Kuruluşu ve Gelişimi",
      desen: /yerlesme yeri|yerlesmenin kurulus|yerlesme.*gelisim|koy|kasaba/ },
    { ders: ["cografya"], konu: "3.5 Yeryüzü Şekilleri ile Beşerî Faaliyetler Arasındaki Etkileşim",
      desen: /beser[iî] faaliyet|yer sekli.*etkilesim|yeryuzu sekli.*beser/ },
    { ders: ["cografya"], konu: "3.4 Yeryüzü Şekilleri ile İlgili Gözlem ve Saha Çalışması",
      desen: /saha calismasi|g[oö]zlem|arazi calismasi/ },
    { ders: ["cografya"], konu: "3.3 Aşınma, Taşınma ve Biriktirme Süreçlerinin Yeryüzünün Şekillenmesine Etkisi",
      desen: /asinim|birikim|tasinma|vadi|delta|karst|dolin|magara|moren|barkan/ },
    { ders: ["cografya"], konu: "3.2 İklim ve Kayaç Yapısının Aşınma ve Çözünme Süreçlerine Etkisi",
      desen: /cozunme|kayac yapisi|fiziksel.*kimyasal.*ayris|ayrisma/ },
    { ders: ["cografya"], konu: "3.1 Tektonik Süreçler",
      desen: /tektonik|fay hatti|levha hareket|orojenez|epirojenez|volkan/ },
    { ders: ["cografya"], konu: "2.2 Mekânsal Verilerin Haritalara Aktarılması",
      desen: /vektor|katman|mekansal veri.*harita|altlik harita/ },
    { ders: ["cografya"], konu: "2.1 CBS ve Uzaktan Algılamanın Uygulama Alanları",
      desen: /cbs|uzaktan algilama|cografi bilgi sistem/ },
    { ders: ["cografya"], konu: "1.1 Coğrafi Bakış",
      desen: /ornek olay|olguyu|olgunun|mekanin|mekanlar|temel kavramlari ile iliskilendir|cografi bakis/ },
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
