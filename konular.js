// Uygulamanın konu ağacı (curriculum.js ile birebir) — kazanım→konu eşleştirmesi için
const KONULAR = {
 "9": {
  "Biyoloji": [
   "1.1 Biyolojinin Önemi ve Katkıları",
   "1.2 Bilim ve Bilimsel Araştırma Süreçleri",
   "1.3 Bilim Etiği",
   "1.4 Canlıların Ortak Özellikleri",
   "1.5 Sınıflandırma ve Modern Yaklaşımlar",
   "1.6 Üçüstâlem (Domain) Sistemi",
   "1.7 Biyoçeşitlilik",
   "2.1 İnorganik Moleküller",
   "2.2 Organik Moleküller",
   "2.3 Organik Moleküllerin Ayıraçları",
   "2.4 Enzim Aktivitesi Koşulları",
   "2.5 Hücre ve Alt Birimleri",
   "2.6 Hücre Zarından Geçişler",
   "2.7 Difüzyon ve Osmoz",
   "2.8 Hücre, Doku, Organ Organizasyonu"
  ],
  "Fizik": [
   "1.1 Fizik Bilimi",
   "1.2 Fiziğin Alt Dalları",
   "1.3 Fizik Bilimine Yön Verenler",
   "1.4 Kariyer Keşfi",
   "2.1 Temel ve Türetilmiş Nicelikler",
   "2.2 Skaler ve Vektörel Nicelikler",
   "2.3 Vektörler",
   "2.4 Doğadaki Temel Kuvvetler",
   "2.5 Hareket Türleri",
   "3.1 Basınç",
   "3.2 Sıvılarda Basınç",
   "3.3 Açık Hava Basıncı",
   "3.4 Kaldırma Kuvveti",
   "3.5 Bernoulli İlkesi",
   "4.1 İç Enerji, Isı ve Sıcaklık",
   "4.2 Isı, Öz Isı, Isı Sığası",
   "4.3 Hâl Değişimi",
   "4.4 Isıl Denge",
   "4.5 Isı Aktarım Yolları",
   "4.6 Isı İletim Hızı"
  ],
  "Din Kültürü": [
   "1.1 İnsan ve Yaratılış",
   "1.2 Doğruyu Arayan Varlık: İnsan",
   "1.3 İbadet ve Dua Eden Varlık",
   "1.4 Kur'an'dan Mesajlar (Ünite 1)",
   "2.1 İman ve Mahiyeti",
   "2.2 İslam'da İman Esasları",
   "2.3 İmanın Birey/Topluma Kazandırdıkları",
   "2.4 Kur'an'dan Mesajlar (Ünite 2)",
   "3.1 İbadetin Kapsamı",
   "3.2 Temel İbadetler",
   "3.3 İnsan ve İbadet",
   "3.4 Kur'an'dan Mesajlar (Ünite 3)",
   "4.1 Ahlakın Mahiyeti",
   "4.2 Ahlakın Temel Unsurları",
   "4.3 Ahlaki Tutum ve Davranışlar",
   "4.4 Kur'an'dan Mesajlar (Ünite 4)",
   "5.1 Hz. Muhammed'in Beşeri/Peygamberlik Yönü",
   "5.2 Hz. Muhammed'in Örnekliği",
   "5.3 Hz. Muhammed ve Ehl-i Beyt Sevgisi",
   "5.4 Kur'an'dan Mesajlar (Ünite 5)"
  ],
  "Kimya": [
   "1.1.1 Günlük Hayatta Kimya",
   "1.1.2 Kimyanın Alt Disiplinleri",
   "1.1.3 Kariyer Olanakları",
   "1.1.4 Güvenlik ve Kimya Sallar",
   "1.2.1 Atom Teorileri ve Yapısı",
   "1.2.2 Orbitaller ve Elektron Dizilimi",
   "1.2.3 Periyodik Tabloda Yer Bulma",
   "1.2.4 Periyodik Özellikler",
   "2.1.1 Metalik Bağ",
   "2.1.2 İyonik Bağ",
   "2.1.3 Kovalent Bağ",
   "2.1.4 Lewis Nokta Yapısı",
   "2.1.5 Polarlık ve Apolarlık",
   "2.1.6 Bileşiklerin Adlandırılması",
   "2.2.1 Moleküllerarası Etkileşimler",
   "2.2.2 Katılar ve Özellikleri",
   "2.2.3 Sıvılar ve Özellikleri",
   "3.1.1 Metal Nanoparçacıklar",
   "3.1.2 Yeşil Kimya",
   "3.1.3 Metallerin Çevresel Etkileri"
  ],
  "Coğrafya": [
   "1.1.1 Coğrafya Biliminin Konusu",
   "1.1.2 Niçin Coğrafya Öğrenmeliyiz?",
   "1.1.3 Coğrafya Biliminin Gelişimi",
   "2.1.1 Mekânın Sembolik Dili: Harita",
   "2.1.2 Türkiye'nin Coğrafi Konumu",
   "2.1.3 Mekânsal Bilgi Teknolojileri",
   "3.1.1 Hava Olayları",
   "3.1.2 İklim Sistemi",
   "3.1.3 İklim Türleri",
   "3.1.4 İklim Değişiklikleri",
   "4.1.1 Nüfusun Tarihsel Değişimi",
   "4.1.2 Nüfusun Dağılışı ve Hareketleri",
   "4.1.3 Demografik Dönüşüm ve Piramitler",
   "4.1.4 Nüfus Politikaları",
   "5.1.1 Ekonomiyi Etkileyen Doğal Faktörler",
   "5.1.2 Ekonomiyi Etkileyen Beşerî Faktörler",
   "6.1.1 Tehlike, Risk ve Afet",
   "6.1.2 Afet Türleri",
   "6.1.3 Bütüncül Afet Yönetimi",
   "7.1.1 Bölge Belirleme Kriterleri",
   "7.1.2 Kriterlere Göre Bölge Sınırları",
   "7.1.3 Bölge Sınırlarında Değişim"
  ],
  "Tarih": [
   "1.1 Tarih Öğrenmenin Faydaları",
   "1.2 Tarihin Doğası",
   "1.3 Tarihsel Bilginin Üretimi",
   "1.4 Dijital Dönüşüm ve Tarih",
   "2.1 Tarım Devrimi'nin Etkileri",
   "2.2 Eski Çağ'da Yönetenler/Savaşanlar",
   "2.3 Eski Çağ'da Hukuk",
   "2.4 Eski Çağ'da İnanç, Bilim, Sanat",
   "2.5 Türklerde Konar-Göçer Yaşam",
   "3.1 Ortaçağ'daki Kitlesel Göçler",
   "3.2 Ortaçağ Siyasi Gelişmeleri",
   "3.3 Ortaçağ Ticaret Yolları",
   "3.4 Ortaçağ Bilim, Kültür, Sanat"
  ],
  "Matematik": [
   "1.1 Üslü ve Köklü Sayılarla İşlemler",
   "1.2 Aralıklar ve Küme İşlemleri",
   "1.3 Sayı Kümelerinin Özellikleri",
   "1.4 Gerçek Sayıların İşlem Özellikleri",
   "2.1 Doğrusal Fonksiyonlar",
   "2.2 Mutlak Değer Fonksiyonları",
   "2.3 Denklem ve Eşitsizlik Problemleri",
   "3.1 Üçgende Açı ve Kenarlar",
   "4.1 Geometrik Dönüşümler",
   "4.2 Eşlik ve Benzerlik Koşulları",
   "4.3 Benzer Üçgen Oluşturma",
   "4.4 Tales, Öklid ve Pisagor",
   "4.5 Eşlik/Benzerlik Problemleri",
   "5.1 Algoritma ile Problem Çözme",
   "5.2 Mantık Bağlaçları ve Niceleyiciler (Algoritma)",
   "5.3 Matematiksel İspatlarda Mantık",
   "6.1 Tek Değişkenli Veri Analizi",
   "6.2 Veri Yorumlama ve Tartışma",
   "7.1 Olasılık Tahmini (Gözleme Dayalı)",
   "7.2 Tümevarımsal Olasılık"
  ],
  "Türk Dili ve Edebiyatı": [
   "Edebiyat Nedir?",
   "Gündelik Dil/Edebi Dil",
   "Metin/Edebi Metin",
   "Güzel Sanatlar ve Edebiyat",
   "Kurmaca, İmge, Sembol",
   "Söz Sanatları (Edebi Sanatlar)",
   "Sözcüğün Anlam Özellikleri",
   "Deneme",
   "Mülakat",
   "Paragrafta Düşünceyi Geliştirme",
   "Ses Olayları",
   "Dinleme",
   "Yazma Tür ve Teknikleri",
   "Hikâye ve İnceleme Yöntemi",
   "Bakış Açıları",
   "Konularına Göre Şiir Türleri",
   "Üslup",
   "Anı (Hatıra)",
   "Gezi Yazısı",
   "Anlatım Biçimleri",
   "Şiir Bilgisi (Şekil Unsurları)",
   "Sözcükte Yapı",
   "Roman ve Teknikleri",
   "Anlatım Özellikleri (Açıklık, Duruluk)",
   "Otobiyografi",
   "Yazım Kuralları",
   "Noktalama İşaretleri",
   "Paragraf"
  ]
 },
 "10": {
  "Biyoloji": [
   "1.1 Canlılık İçin Enerjinin Önemi",
   "1.2 Işık Enerjisi Kullanılarak Besin Sentezi (Fotosentez)",
   "1.3 Fotosentezde Kullanılan ve Üretilen Maddeler",
   "1.4 Işık Enerjisi Kullanılmadan Besin Sentezi (Kemosentez)",
   "1.5 Sindirim",
   "1.6 İnsanda Sindirim",
   "1.7 Hücresel Solunum",
   "1.8 Besinlerin Solunuma Katılma Yolları",
   "1.9 Fermantasyon",
   "1.10 Enerji-Metabolizma İlişkisi",
   "2.1 Ekosistemin Bileşenleri",
   "2.2 Komünitelerde ve Popülasyonlarda Görülen Etkileşimler ve Değişimler",
   "2.3 Ekosistemdeki Madde ve Enerji Akışı",
   "2.4 Madde Döngüleri",
   "2.5 Ekolojik Sürdürülebilirliğin Önemi",
   "2.6 Ekolojik Sürdürülebilirliği Kısıtlayan Durumlar",
   "2.7 Ekolojik Ayak İzinin Küçültülmesi",
   "2.8 Doğal Kaynakların ve Biyoçeşitliliğin Korunması",
   "2.9 Atık Yönetimi"
  ],
  "Fizik": [
   "1.1 Sabit Hızlı Hareket",
   "1.2 Bir Boyutta Sabit İvmeli Hareket",
   "1.3 Serbest Düşme",
   "1.4 İki Boyutta Sabit İvmeli Hareket",
   "2.1 İş, Enerji ve Güç",
   "2.2 Enerji Biçimleri",
   "2.3 Mekanik Enerji",
   "2.4 Enerji Kaynakları",
   "3.1 Basit Elektrik Devreleri",
   "3.2 Elektrik Akımı",
   "3.3 Ohm Yasası",
   "3.4 Dirençlerin Bağlanması",
   "3.5 Üreteçlerin Bağlanması",
   "3.6 Elektrik Akımının Oluşturabileceği Tehlikelere Karşı Alınması Gereken Önlemler",
   "3.7 Topraklamanın Önemi",
   "4.1 Dalgaların Temel Kavramları",
   "4.2 Dalgaların Sınıflandırılması",
   "4.3 Dalgaların Yayılma Süratini Etkileyen Etmenler",
   "4.4 Periyodik Hareketler",
   "4.5 Su Dalgalarında Yansıma ve Kırılma",
   "4.6 Rezonans ve Deprem"
  ],
  "Din Kültürü": [
   "1.1 Kur'an-ı Kerim ve Özellikleri",
   "1.2 Kur'an'ın Anlaşılması ve Yorumlanması",
   "1.3 Kur'an'dan Mesajlar (Ünite 1)",
   "2.1 İslam'ın İbadet Boyutu",
   "2.2 Namaz ve Oruç",
   "2.3 Hac ve Zekât",
   "2.4 Kur'an'dan Mesajlar (Ünite 2)",
   "3.1 İslam'ın Ahlak Boyutu",
   "3.2 Ahlaki Davranışlar",
   "3.3 Toplumsal Ahlak",
   "3.4 Kur'an'dan Mesajlar (Ünite 3)",
   "4.1 Hz. Muhammed'in Hayatı",
   "4.2 Mekke Dönemi",
   "4.3 Medine Dönemi",
   "4.4 Kur'an'dan Mesajlar (Ünite 4)"
  ],
  "Kimya": [
   "1.1.1 Kimyasal Tepkimelerin Oluşumu",
   "1.1.2 Kimyasal Tepkime Türleri",
   "1.1.3 Mol Kavramı",
   "1.1.4 Kimyasal Tepkime Denklemlerinin Denkleştirilmesi",
   "1.1.5 Kimyasal (Stokiyometrik) Hesaplamalar",
   "1.2.1 Gazların Özellikleri ve Gaz Yasaları",
   "1.2.2 Gazların Kinetik Moleküler Teorisi",
   "1.2.3 İdeal Gaz Yasası",
   "1.2.4 Graham Difüzyon ve Eftizyon Yasası",
   "2.1.1 Çözünme Süreci",
   "2.1.2 Maddelerin Birbiri İçindeki Çözünebilirliği",
   "2.1.3 Çözünme Olayının Sınıflandırılması",
   "2.1.4 Derişim Birimleri (Molarite, ppm)",
   "2.1.5 Çözünürlük",
   "2.1.6 Çözünürlğe Etki Eden Faktörler",
   "2.1.7 Çözeltilerin Sınıflandırılması",
   "2.1.8 Koligatif Özellikler",
   "3.1.1 Makro ve Mikro Ölçekli Deneyler",
   "3.1.2 Atmosferdeki Tepkimeler ve Küresel Sorunlar"
  ],
  "Coğrafya": [
   "1.1 Coğrafi Bakış",
   "2.1 CBS ve Uzaktan Algılamanın Uygulama Alanları",
   "2.2 Mekânsal Verilerin Haritalara Aktarılması",
   "3.1 Tektonik Süreçler",
   "3.2 İklim ve Kayaç Yapısının Aşınma ve Çözünme Süreçlerine Etkisi",
   "3.3 Aşınma, Taşınma ve Biriktirme Süreçlerinin Yeryüzünün Şekillenmesine Etkisi",
   "3.4 Yeryüzü Şekilleri ile İlgili Gözlem ve Saha Çalışması",
   "3.5 Yeryüzü Şekilleri ile Beşerî Faaliyetler Arasındaki Etkileşim",
   "4.1 Yerleşmelerin Kuruluşu ve Gelişimi",
   "4.2 Yerleşmelerin Fonksiyonları",
   "5.1 Ekonomik Faaliyetlerin Özellikleri",
   "5.2 Ekonomik Sektörler ve Gelişmişlik",
   "5.3 Türkiye Ekonomisinin Sektörel Dağılımı",
   "6.1 Afetlerle Mücadelede İyi Uygulama Örnekleri",
   "6.2 Afetlere Karşİ Dirençli Yaşam Alanları",
   "6.3 Afetlerden Korunma",
   "6.4 Afet Bilinci",
   "7.1 Türk Kültürünün Mekânsal Özellikleri"
  ],
  "Tarih": [
   "1.1 Önemli Askerî Mücadelelerin Türk Tarihinin Seyrine Etkileri",
   "1.2 Türkistan'dan Türkiye'ye Türklerde Devlet ve Ordu Teşkilatları",
   "1.3 Türklerde Sosyoekonomik Hayat ve Şehirleşme",
   "1.4 Türk-İslam Medeniyetinde Bilim, Kültür, Eğitim ve Sanat",
   "2.1 Osmanlı Devleti'nin Kuruluşuna Dair Görüşler",
   "2.2 Beylikten Devlete Siyasi ve Askerî Gelişmeler",
   "2.3 Osmanlı Devleti'nde Ordu, Hukuk ve Toprak Sistemi",
   "2.4 Osmanlı Devleti'nin İskân ve İstimalet Politikası",
   "2.5 Osmanlı Devleti'nin İlim ve İrfan Geleneği",
   "3.1 Osmanlı Devleti'nin Cihan Devleti Hâline Gelmesi",
   "3.2 Osmanlı Devleti'nin Yönetim ve Ordu Yapısında Değişim",
   "3.3 Avrupalıların Sömürgeci Politikaları",
   "3.4 Osmanlı Devleti'nde İsyanlar",
   "3.5 Osmanlı Devleti'nde Bilim, Kültür, Eğitim ve Sanat"
  ],
  "Matematik": [
   "1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler",
   "1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler",
   "1.3 Üçgende Alan",
   "1.4 Sinüs ve Kosinüs Teoremleri",
   "2.1 İstatistiksel Problemi Oluşturma, Veri Toplama, Analiz Etme ve Yorumlama",
   "2.2 İstatistiksel Sonuç veya Yorumları Tartışma",
   "3.1 Bir Doğal Sayı ile Asal Çarpanları ve Bölenleri Arasındaki İlişkiler",
   "3.2 En Büyük Ortak Bölen-En Küçük Ortak Kat",
   "3.3 Bölünebilme Özelliklerini Kullanarak Kalan Bulma",
   "4.1 Gerçek Sayılarda Tanımlı Fonksiyonların Nitel Özellikleri",
   "4.2 Gerçek Sayılarda Tanımlı Karesel Fonksiyonlar ve Nitel Özellikleri",
   "4.3 Gerçek Sayılarda Tanımlı Karekök Fonksiyonlar ve Nitel Özellikleri",
   "4.4 Gerçek Sayılarda Tanımlı Rasyonel Fonksiyonlar ve Nitel Özellikleri",
   "4.5 Fonksiyonların Ters Fonksiyonları",
   "4.6 Denklem ve Eşitsizlikler İçeren Problemlerin Çözümü",
   "5.1 Sayma Stratejileri",
   "5.2 Cebirsel ve Fonksiyonel İşlemlerin Algoritmik Yapısı",
   "6.1 İki Nokta Arasındaki Uzaklık ve Bir Doğru Parçasını Belli Oranda Bölme",
   "6.2 Doğrunun Özellikleri ve Analitik İncelenmesi",
   "7.1 Koşullu Olasılık, Bağımlı ve Bağımsız Olaylar",
   "7.2 Bayes Teoremi"
  ],
  "Türk Dili ve Edebiyatı": [
   "1.1 Koşuk",
   "1.2 Türkü",
   "1.3 Masal",
   "2.1 Gazel",
   "2.2 Saf Şiir",
   "2.3 Söyleşi",
   "3.1 Destan",
   "3.2 Mesnevi",
   "3.3 Fabl",
   "4.1 Dede Korkut Hikâyeleri",
   "4.2 Tanzimat Şiiri",
   "4.3 Millî Edebiyat Dönemi'nde Hikâye"
  ]
 }
};

// Kazanım metninden KONU ADI çıkar — 3 geçişli deterministik eşleştirme (AI yok):
// 1) konu adı kazanımın içinde tam geçiyorsa birebir
// 2) anlamlı kelime örtüşmesi ≥ %50 (en az 2 kelime)
// 3) BENZERSİZ uzun anahtar kelime (yalnız tek konuda geçen: "tales", "pisagor"…)
function normalize(s) {
  return String(s || "").toLowerCase()
    .replace(/[çÇ]/g, "c").replace(/[ğĞ]/g, "g").replace(/[ıİ]/g, "i").replace(/i̇/g, "i")
    .replace(/[öÖ]/g, "o").replace(/[şŞ]/g, "s").replace(/[üÜ]/g, "u")
    .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
const STOP = new Set(["ve","ile","yapma","yapar","yapabilme","bir","kurma","kazanimi","kazanim","bilgi","farkindalik","iliskin","uygulama","gor","yorum","yap","eder","edebilme","olusturma","hesaplama","bulma","cozme","belirleme","aciklama","temel","seviye","ornek","verilen","ifadesi","islem","sayi","sayilar","problemler","problem"]);
let _indeks = null;
function tokenIndeks(grade) {
  if (_indeks && _indeks.grade === grade) return _indeks;
  const indeks = { grade: grade, map: {} };
  const kaynak = KONULAR[String(grade || "9")] || KONULAR["9"];
  Object.keys(kaynak).forEach(lesson => kaynak[lesson].forEach(topic => {
    normalize(topic).split(" ").filter(w => w && !STOP.has(w) && w.length > 2 && !/^\d/.test(w)).forEach(w => {
      (indeks.map[w] = indeks.map[w] || new Set()).add(topic);
    });
  }));
  _indeks = indeks;
  return indeks;
}
function kazanimToTopic(kazanim, grade) {
  const kaynak = KONULAR[String(grade || "9")] || KONULAR["9"];
  const normK = normalize(kazanim);
  // Geçiş 1: tam geçme
  let enIyi = null, enSkor = 0;
  Object.keys(kaynak).forEach(lesson => kaynak[lesson].forEach(topic => {
    const t = normalize(topic);
    if (normK.includes(t)) { if (enSkor < 999) { enIyi = topic; enSkor = 999; } }
  }));
  if (enIyi) return enIyi;
  // Geçiş 2: örtüşme ≥ %50 ve en az 2 kelime
  Object.keys(kaynak).forEach(lesson => kaynak[lesson].forEach(topic => {
    const kelimeler = normalize(topic).split(" ").filter(w => w && !STOP.has(w) && w.length > 2 && !/^\d/.test(w));
    if (kelimeler.length < 2) return;
    const tutan = kelimeler.filter(w => normK.includes(w)).length;
    const skor = tutan / kelimeler.length;
    if (tutan >= 2 && skor >= 0.5 && skor > enSkor) { enSkor = skor; enIyi = topic; }
  }));
  if (enIyi) return enIyi;
  // Geçiş 3: benzersiz uzun kelime (tek konuya ait)
  const indeks = tokenIndeks(grade);
  const kazanımKelimeleri = normK.split(" ");
  for (const w of kazanımKelimeleri) {
    if (w.length < 5 || STOP.has(w) || /^\d/.test(w)) continue;
    const set = indeks.map[w];
    if (set && set.size === 1) return set.values().next().value;
  }
  // Hiçbiri tutmadıysa: kazanım başındaki kodu temizle ("M.9.1.1. metin…")
  const temiz = String(kazanim).replace(/^([A-Za-zÇĞİÖŞÜ]?\.?\s*\d+([.\-]\d+)*[.\-]?\s*)+/i, "").trim();
  return temiz.length > 2 ? temiz.slice(0, 80) : String(kazanim).trim();
}
module.exports = { KONULAR, kazanimToTopic, normalize };
