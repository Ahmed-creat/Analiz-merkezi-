#!/usr/bin/env node
/* ============================================================
   COĞRAFYA 10 · 3. ÜNİTE (3.3 - 3.5) — kitaptan havuzlar
   ------------------------------------------------------------
   Kaynak: MEB Coğrafya 10 (2025) — cografya.json.
   Basılı sayfa = PDF sayfası − 1.

     3.3 Aşınma, Taşınma ve Biriktirme Süreçlerinin
         Yeryüzünün Şekillenmesine Etkisi                 s.76-96
     3.4 Yeryüzü Şekilleri ile İlgili Gözlem ve
         Saha Çalışması                                   s.97-98
     3.5 Yeryüzü Şekilleri ile Beşerî Faaliyetler
         Arasındaki Etkileşim                             s.99-107

   Kullanım: node docs/uretim/uretim/cografya-t3.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Coğrafya";
const DOSYA = "cografya-10.pdf (MEB, 2025)";
const kaynak = s => "Coğrafya 10 ders kitabı, s." + s;

/* ------------------------------------------------------- 3.3 */
yazKonu({
  konu_id: "cogr_10_u03_k03",
  ders: DERS, tema: 3, tema_adi: "Doğal Sistemler ve Süreçler",
  baslik: "3.3 Aşınma, Taşınma ve Biriktirme Süreçlerinin Yeryüzünün Şekillenmesine Etkisi",
  kazanim: "Aşınma, taşınma ve biriktirme süreçlerinin yeryüzünün şekillenmesine etkisini sorgular.",
  kaynak: kaynak("76-96"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Aşınma, taşınma ve biriktirme süreçlerini birbirinden ayırt eder.",
    "Dış kuvvetlere göre oluşan yer şekillerini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "Ana kaya üzerinde oluşmuş toprağın ve küçük boyutlu malzemelerin su, rüzgâr, canlılar gibi dış etkenlerce aşındırılıp taşınmasına ne ad verilir?",
      secenekler: [
        "Erozyon",
        "Ayrışma",
        "Biriktirme",
        "Orojenez"
      ],
      cozum: "Toprağın ve küçük boyutlu malzemelerin dış etkenler tarafından aşındırılması ve taşınması süreci erozyondur (s.77).",
      fc: ["Erozyon nedir?", "Toprak ve küçük boyutlu malzemenin dış etkenlerce aşındırılıp taşınması."]
    },
    {
      bi: 0,
      metin: "Yamaçlardaki malzemenin kendi ağırlığı ve yer çekimi etkisiyle yamaçtan aşağı hareket etmesine ne ad verilir?",
      secenekler: [
        "Kütle hareketleri",
        "Erozyon",
        "Sedimantasyon",
        "Karstlaşma"
      ],
      cozum: "Malzemenin ağırlığı ve yer çekimi etkisiyle yamaçtan aşağı hareket etmesi kütle hareketleridir; kaya düşmesi, kayma, akma ve sürünme bunlara örnektir (s.77).",
      fc: ["Kütle hareketi nedir?", "Yamaç malzemesinin yer çekimiyle aşağı doğru hareket etmesi."]
    },
    {
      bi: 0,
      metin: "Aşınma, taşınma ve biriktirme süreçlerinin uzun vadede arazi üzerinde oluşturduğu sonuç hangisidir?",
      secenekler: [
        "Arazinin giderek düzleşmesi",
        "Yükseltilerin sürekli artması",
        "Kayaçların başkalaşıma uğraması",
        "Yeni levha sınırlarının oluşması"
      ],
      cozum: "Biriktirme sürecinin nihai sonucu arazinin tamamen düzleşmesidir; yükseltiler aşındırılırken çukurluklar doldurulur (s.78).",
      fc: ["Dış süreçlerin arazi üzerindeki genel etkisi nedir?", "Yükseltileri aşındırıp çukurları doldurarak araziyi düzleştirmek."]
    },
    {
      bi: 0,
      metin: "Akarsular yataklarını hangi üç doğrultuda aşındırır?",
      secenekler: [
        "Derine, yana ve geriye doğru",
        "Yalnızca derine doğru",
        "Yalnızca yana doğru",
        "Yukarı, aşağı ve yatay"
      ],
      cozum: "Akarsular yatağını derine, yana ve ağız kısmından kaynağa doğru geriye doğru aşındırır (s.79).",
      fc: ["Akarsu aşındırması nedir?", "Akarsuyun yatağını derine, yana ve geriye doğru kazımasıdır."]
    },
    {
      bi: 0,
      metin: "Akarsuyun denize döküldüğü durumda taban seviyesi ne olur?",
      secenekler: [
        "Deniz seviyesi",
        "Kalıcı kar sınırı",
        "Ağız kısmındaki tepe yükseltisi",
        "Kaynak yükseltisi"
      ],
      cozum: "Akarsu denize dökülüyorsa taban seviyesi deniz seviyesi, göle dökülüyorsa göl seviyesidir (s.79).",
      fc: ["Taban seviyesi nedir?", "Akarsuyun aşındırma yapabileceği en alt seviye."]
    },
    {
      bi: 0,
      metin: "Akarsuyun akış hızının azalmasıyla yatağında büklümler yaparak akması sonucu oluşan şekle ne ad verilir?",
      secenekler: [
        "Menderes",
        "Delta",
        "Taraça",
        "Peneplen"
      ],
      cozum: "Akarsu, genişlettiği vadi tabanında menderes adı verilen büklümler yaparak akmaya başlar (s.81).",
      fc: ["Menderes nedir?", "Akarsuyun yatağında büklümler yaparak akmasıdır."]
    },
    {
      bi: 1,
      metin: "Akarsuların taşıdığı alüvyonların denize döküldüğü yerde birikerek oluşturduğu düzlüklere ne ad verilir?",
      secenekler: [
        "Delta",
        "Taraça",
        "Sirk",
        "Moren"
      ],
      cozum: "Kıyıda derinlik azsa ve biriktirmeyi önleyen akıntı yoksa alüvyonlar denizi doldurarak delta adı verilen düzlükleri oluşturur (s.83).",
      fc: ["Delta nedir?", "Akarsuyun denize döküldüğü yerde alüvyon birikmesiyle oluşan düzlük."]
    },
    {
      bi: 1,
      metin: "Kireç taşı gibi çözünebilen kayaçlarda yer altı sularının kayaçları çözmesi ve mağara tavanının çökmesiyle hangi yer şekli oluşur?",
      secenekler: [
        "Obruk",
        "Sarkıt",
        "Kumul",
        "Falez"
      ],
      cozum: "Mağara sisteminin tavanının çökmesiyle obruk adı verilen çukurlar oluşur (s.84).",
      fc: ["Obruk nedir?", "Karstik mağara tavanının çökmesiyle oluşan çukurluk."]
    },
    {
      bi: 1,
      metin: "İçinde çözünmüş kalsiyum karbonat bulunan yer altı sularının yeryüzüne çıktığı yerde çökelmesiyle hangi oluşum meydana gelir?",
      secenekler: [
        "Traverten",
        "Dolin",
        "Lapya",
        "Düden"
      ],
      cozum: "Yer altı sularının yüzeye çıktığı yerdeki çökelmeler travertenleri oluşturur (s.84).",
      fc: ["Traverten nedir?", "Kalsiyum karbonatlı yer altı sularının yüzeyde çökelmesiyle oluşan karstik birikim."]
    },
    {
      bi: 1,
      metin: "Buzul Çağı'nda oluşmuş derin buzul vadilerinin deniz suları altında kalmasıyla oluşan kıyı tipi hangisidir?",
      secenekler: [
        "Fiyortlu kıyı",
        "Boyuna kıyı",
        "Dalmaçya kıyı",
        "Rialı kıyı"
      ],
      cozum: "Fiyortlar, Buzul Çağı'nda oluşmuş derin buzul vadilerinin deniz suları altında kalmasıyla oluşur (s.86).",
      fc: ["Fiyort nedir?", "Buzul vadisinin deniz suları altında kalmasıyla oluşan dik yamaçlı koy."]
    },
    {
      bi: 1,
      metin: "Buzul vadilerinin en üst kısmında, üç tarafı yamaçlarla çevrili kâse şeklindeki çukurlara ne ad verilir?",
      secenekler: [
        "Sirk",
        "Drumlin",
        "Sandur",
        "Yardang"
      ],
      cozum: "Buzul vadilerinin en üst kısmındaki üç tarafı kapalı, bir tarafı vadiye açık kâse biçimli çukurlar sirktir (s.88).",
      fc: ["Sirk nedir?", "Buzul vadisi başlangıcında oluşan kâse biçimli çukur."]
    },
    {
      bi: 1,
      metin: "Rüzgârın havada asılı olarak taşıdığı ince malzemeyi biriktirmesiyle oluşan, büyük oranda kuvarstan oluşan çökellere ne ad verilir?",
      secenekler: [
        "Lös",
        "Kumul",
        "Moren",
        "Taraça"
      ],
      cozum: "Lös, rüzgârın havada asılı taşıdığı ince malzemenin birikmesiyle oluşan ve büyük oranda kuvarstan oluşan çökellerdir (s.92).",
      fc: ["Lös nedir?", "Rüzgârın taşıdığı ince siltin birikmesiyle oluşan çökel örtüsü."]
    }
  ]
});

/* ------------------------------------------------------- 3.4 */
yazKonu({
  konu_id: "cogr_10_u03_k04",
  ders: DERS, tema: 3, tema_adi: "Doğal Sistemler ve Süreçler",
  baslik: "3.4 Yeryüzü Şekilleri ile İlgili Gözlem ve Saha Çalışması",
  kazanim: "Yeryüzünü şekillendiren süreçleri saha/sanal saha çalışmalarıyla araştırır.",
  kaynak: kaynak("97-98"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Saha çalışmasının aşamalarını ve hazırlık adımlarını açıklar.",
    "Saha gözlemlerini çözümleyip öngörü ve ürün dosyasına dönüştürür."
  ],
  items: [
    {
      bi: 0,
      metin: "Coğrafya biliminde araştırma yöntemlerinin temelini oluşturan gözlem ve saha çalışması neden zorunludur?",
      secenekler: [
        "Coğrafya biliminin laboratuvarı arazidir",
        "Arazi çalışması yalnızca harita çizmeye yarar",
        "Saha çalışması laboratuvar deneylerinin yerini alır",
        "Arazi gözlemi yalnızca iklim ölçümleri için yapılır"
      ],
      cozum: "Coğrafya biliminin laboratuvarı arazidir; gözlem ve saha çalışmasından elde edilen bilgi, belge ve görseller araştırmaya kaynaklık eder (s.97).",
      fc: ["Coğrafyanın laboratuvarı nedir?", "Arazi; gözlem ve saha çalışmasının yapıldığı ortam."]
    },
    {
      bi: 0,
      metin: "Saha çalışmasının aşamaları hangi sırayla gerçekleşir?",
      secenekler: [
        "Hazırlık ve planlama, sahada uygulama, raporlama ve sunma",
        "Raporlama, hazırlık, sahada uygulama",
        "Sahada uygulama, raporlama, hazırlık",
        "Harita çizimi, sunum, güzergâh belirleme"
      ],
      cozum: "Saha çalışması hazırlık ve planlama, sahada/sanal sahada uygulama, raporlama ve sunma aşamalarından oluşur (s.97).",
      fc: ["Saha çalışması nedir?", "Arazide gözlem yaparak bilgi, belge ve görsel toplamaya dayanan araştırma yöntemi."]
    },
    {
      bi: 0,
      metin: "Saha çalışmasının hazırlık ve planlama aşamasında yapılması gereken hangisidir?",
      secenekler: [
        "Gezi güzergâhını ve taslak planı belirlemek",
        "Yer şekillerinin oluşum süreçlerini çözümlemek",
        "Ürün dosyasını sınıfla paylaşmak",
        "Gelecekteki değişimlere dair öngörü yazmak"
      ],
      cozum: "Hazırlık aşamasında güzergâh belirlenir, taslak gezi planı hazırlanır ve gerekli eşyalar temin edilir (s.97).",
      fc: ["Gezi planı nedir?", "Saha öncesinde güzergâhı ve yapılacakları sıralayan taslak çizelge."]
    },
    {
      bi: 0,
      metin: "Saha çalışması için hazırlanması gereken eşyalar arasında hangisi yer alır?",
      secenekler: [
        "Defter, bölge haritası ve fotoğraf makinesi",
        "Sismograf ve Richter ölçeği",
        "Meteoroloji istasyonu ve radyosonda",
        "Sondaj makinesi ve mikroskop"
      ],
      cozum: "Saha çalışmasında defter, kalem, bölge haritası, fotoğraf makinesi ve uygun kıyafetler hazırlanır (s.97).",
      fc: ["Saha çalışması donanımı nedir?", "Defter, kalem, bölge haritası, fotoğraf makinesi ve uygun kıyafet."]
    },
    {
      bi: 0,
      metin: "Sahada uygulama aşamasının temel işi hangisidir?",
      secenekler: [
        "Yer şekillerini gözlemleyip oluşumlarında etkili kuvvetlere dair bilgi toplamak",
        "Toplanan verileri rapora dönüştürmek",
        "Çalışmanın ölçütlerini kontrol listesine işaretlemek",
        "Ürün dosyasını arkadaşlarla paylaşmak"
      ],
      cozum: "Sahada yer şekilleri gözlemlenir; aşınım ve birikim süreçlerinin etkisine dair bilgi toplanır (s.97).",
      fc: ["Sahada uygulama nedir?", "Yer şekillerinin yerinde gözlemlenmesi ve süreçlere dair bilgi toplanması."]
    },
    {
      bi: 1,
      metin: "Saha çalışmasının ülke açısından bilimsel katkısının yanında hangi işlevi vardır?",
      secenekler: [
        "Doğal zenginliklerin fark edilmesine ve korunmasına katkı sağlamak",
        "Yalnızca harita satışlarını artırmak",
        "Arazi kullanımını sınırlandırmak",
        "Yer şekillerinin oluşumunu durdurmak"
      ],
      cozum: "Saha çalışması doğal zenginliklerin fark edilmesine, değerinin bilinmesine, korunmasına ve gelecek nesillere aktarılmasına katkı sağlar (s.97).",
      fc: ["Saha çalışmasının koruma boyutu nedir?", "Doğal varlıkların fark edilip korunmasına ve aktarılmasına katkı."]
    },
    {
      bi: 1,
      metin: "Raporlama aşamasında gözlem yoluyla toplanan bilgilerden yararlanılarak yapılan iş hangisidir?",
      secenekler: [
        "Yer şeklinin oluşumundaki aşınım ve birikim süreçlerini çözümlemek",
        "Gezilecek güzergâhı yeniden belirleyip planı gözden geçirmek",
        "Saha için eksik kalan eşyaları tamamlamak",
        "Gözlem yapılacak alanı ve güzergâhı yeniden seçmek"
      ],
      cozum: "Raporlamada toplanan bilgilerden yararlanılarak yer şekillerinin oluşumunda etkili kuvvetlerin süreçleri çözümlenir (s.97).",
      fc: ["Saha raporunda çözümleme nedir?", "Gözlem verilerinden yararlanarak yer şeklinin oluşum sürecini açıklamak."]
    },
    {
      bi: 1,
      metin: "Çözümlenen yer şekillerinin gelecekte uğrayabileceği değişimler hakkında öngörüde bulunmak neden istenir?",
      secenekler: [
        "Süreçlerin yönünü kavrayıp olası değişimi önceden değerlendirmek için",
        "Gözlem sayısını artırmak için",
        "Harita ölçeğini küçültmek için",
        "Araziye yeniden gitmeyi önlemek için"
      ],
      cozum: "Öngörü, yer şeklinin oluşumunda etkili süreçlerin gelecekte ne yönde değişebileceğini değerlendirmeyi sağlar (s.97).",
      fc: ["Saha çalışmasında öngörü nedir?", "İzlenen süreçlerin gelecekte yaratabileceği değişimlere dair çıkarım."]
    },
    {
      bi: 1,
      metin: "Saha çalışmasının sonunda elde edilen veriler ve öngörüler bir araya getirilerek ne oluşturulur?",
      secenekler: [
        "Ürün dosyası",
        "Kontrol listesi",
        "Taslak gezi planı",
        "Ders kitabı özeti"
      ],
      cozum: "Elde edilen veriler ve öngörüler birleştirilerek ürün dosyası oluşturulur ve arkadaşlarla paylaşılır (s.97-98).",
      fc: ["Ürün dosyası nedir?", "Saha verileri ile öngörülerin bir araya getirildiği çalışma dosyası."]
    },
    {
      bi: 1,
      metin: "Saha çalışmasının değerlendirilmesinde ne kullanılır?",
      secenekler: [
        "Aşamaları kapsayan kontrol listesi",
        "Yalnızca yazılı sınav",
        "Sadece harita çizim puanı",
        "Grup üyelerinin birbirini puanlaması"
      ],
      cozum: "Çalışma; hazırlık ve planlama, sahada uygulama, raporlama ve sunma, arazi çalışması başlıklı kontrol listesiyle değerlendirilir (s.98).",
      fc: ["Kontrol listesi nedir?", "Saha çalışması ölçütlerinin evet-hayır biçiminde işaretlendiği değerlendirme aracı."]
    }
  ]
});

/* ------------------------------------------------------- 3.5 */
yazKonu({
  konu_id: "cogr_10_u03_k05",
  ders: DERS, tema: 3, tema_adi: "Doğal Sistemler ve Süreçler",
  baslik: "3.5 Yeryüzü Şekilleri ile Beşerî Faaliyetler Arasındaki Etkileşim",
  kazanim: "Yeryüzü şekilleri ile beşerî faaliyetler arasındaki etkileşimi sorgular.",
  kaynak: kaynak("99-107"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Yeryüzü şekillerinin yerleşme, nüfus ve ulaşım üzerindeki etkisini açıklar.",
    "Yeryüzü şekillerinin ekonomik, sosyal ve kültürel faaliyetlerle etkileşimini çözümler."
  ],
  items: [
    {
      bi: 0,
      metin: "İnsanların günlük hayatı içindeki ekonomik, sosyal ve kültürel faaliyetlerinin tamamına verilen ad hangisidir?",
      secenekler: [
        "Beşerî faaliyetler",
        "Tektonik süreçler",
        "Dış kuvvetler",
        "Karstik süreçler"
      ],
      cozum: "Beşerî faaliyetler; insanların günlük hayatındaki ekonomik, sosyal ve kültürel faaliyetlerinin hepsini kapsar (s.99).",
      fc: ["Beşerî faaliyet nedir?", "İnsanların ekonomik, sosyal ve kültürel faaliyetlerinin tamamı."]
    },
    {
      bi: 0,
      metin: "Nil Vadisi, Büyük Menderes Vadisi ve Çukurova'nın tarih boyunca yoğun nüfuslu olması hangisiyle açıklanır?",
      secenekler: [
        "Verimli ovalar ve nehir vadilerinin tarıma elverişli koşullar sunması",
        "Bu alanların yüksek ve engebeli olması",
        "Bölgelerde volkanik faaliyetlerin sürmesi",
        "Karasal iklimin egemen olması"
      ],
      cozum: "Tarım için ideal koşullar sunan verimli ovalar ve nehir vadileri yoğun nüfuslu yerleşmelerin gelişmesine olanak sağlamıştır (s.99).",
      fc: ["Verimli ova ve vadilerin yerleşmeye etkisi nedir?", "Tarıma elverişli koşullar sundukları için yoğun nüfuslanırlar."]
    },
    {
      bi: 0,
      metin: "Dağlık bölgelerin nüfus bakımından seyrek olmasının temel nedeni hangisidir?",
      secenekler: [
        "Olumsuz coğrafi koşullar",
        "Deniz etkisinin çok güçlü olması",
        "Tarım alanlarının fazlalığı",
        "Ulaşım ağlarının çok gelişmiş olması"
      ],
      cozum: "Dağlık bölgeler olumsuz coğrafi koşulları nedeniyle daha seyrek nüfuslu bölgeler olmuştur (s.99).",
      fc: ["Yeryüzü şekillerinin nüfusa etkisi nedir?", "Eğim ve yükselti arttıkça yerleşme zorlaşır, nüfus seyrekleşir."]
    },
    {
      bi: 0,
      metin: "Dağlık bölgelerde kara ve demir yolu yapımında maliyeti artıran mühendislik çözümleri hangileridir?",
      secenekler: [
        "Tüneller ve viyadükler",
        "Kanallar ve savaklar",
        "Barajlar ve regülatörler",
        "İskeleler ve dalgakıranlar"
      ],
      cozum: "Dağlık bölgelerde ulaşım, tünel ve viyadük gibi maliyetleri çok artıran mühendislik çözümlerini gerektirir (s.99).",
      fc: ["Dağlık arazide ulaşım yatırımı nedir?", "Tünel ve viyadük gibi maliyeti yükselten mühendislik yapıları gerektirir."]
    },
    {
      bi: 0,
      metin: "Düzlük alanların kara ve demir yolu ulaşımı için elverişli olmasının sonucu hangisidir?",
      secenekler: [
        "Yol yapım maliyetlerinin azalması",
        "Ulaşımın tamamen durması",
        "Tünel sayısının artması",
        "Deniz yolu kullanımının zorunlu olması"
      ],
      cozum: "Düzlük alanlar kara ve demir yolu ulaşımına elverişlidir; bu durum yol yapım maliyetlerini azaltır (s.99).",
      fc: ["Düzlük alanların ulaşıma etkisi nedir?", "Kara ve demir yolu yapımını kolaylaştırıp maliyeti düşürür."]
    },
    {
      bi: 1,
      metin: "Ovaların ekonomik faaliyetlere etkisi hangisidir?",
      secenekler: [
        "Tarım ve hayvancılık için elverişli olmaları",
        "Ormancılık ve madencilikte öne çıkmaları",
        "Balıkçılık ve denizciliğe imkân vermeleri",
        "Buzul turizmine uygun olmaları"
      ],
      cozum: "Ovalar tarım ve hayvancılık için elverişliyken dağlık alanlar ormancılık ve madenciliğe, kıyılar balıkçılık, denizcilik ve turizme elverişlidir (s.99).",
      fc: ["Yer şekilleri ile ekonomik faaliyet arasındaki ilişki nedir?", "Ova tarım-hayvancılık, dağ ormancılık-madencilik, kıyı balıkçılık-turizm getirir."]
    },
    {
      bi: 1,
      metin: "Karadeniz kıyı kuşağındaki dağ köylerinde yemek, müzik ve mimarinin kendine has özellikler taşıması hangisiyle açıklanır?",
      secenekler: [
        "Dağlık arazinin toplulukları izole ederek özgün kültür geliştirmelerine yol açması",
        "Bölgenin düz ve ulaşımın kolay olması",
        "Bölgede tarımsal üretimin çok yüksek olması",
        "Bölgenin deniz turizmine açık olması"
      ],
      cozum: "Dağlık bölgelerde daha az iletişim kuran topluluklar izole yaşamları nedeniyle kendilerine özgü kültürel özellikler geliştirmiştir (s.100).",
      fc: ["Yer şekillerinin kültüre etkisi nedir?", "Ulaşım güçlüğü toplulukları yalıtarak özgün kültürel özellikler oluşturur."]
    },
    {
      bi: 1,
      metin: "Nevşehir'deki volkanik tüf platosunda peribacalarının konut, depo ve yer altı şehri olarak kullanılmasının nedeni hangisidir?",
      secenekler: [
        "Arazinin kolay işlenebilir ve kolay aşınabilir olması",
        "Bölgede yıllık yağışın çok yüksek olması",
        "Kayaçların ayrışmaya karşı çok dirençli olması",
        "Bölgenin deprem riskinin sıfır olması"
      ],
      cozum: "Peribacaları kolay işlenebildiği için oyularak konut, barınak ve depo; tehlikeli dönemlerde yer altı şehri olarak kullanılmıştır (s.100).",
      fc: ["Peribacasının beşerî kullanımı nedir?", "Kolay oyulabildiği için konut, depo ve yer altı şehri olarak kullanılır."]
    },
    {
      bi: 1,
      metin: "Nil Vadisi'nin verimli olmasına karşın zaman zaman taşkın yapması hangi durumu doğurur?",
      secenekler: [
        "Vadide yerleşmiş insanlar için tehlike oluşturması",
        "Tarımsal üretimin tamamen sona ermesi",
        "Vadinin boşaltılması",
        "Ulaşımın tamamen kesilmesi"
      ],
      cozum: "Nil Nehri'nin zaman zaman taşkın yapması vadide yaşayan insanlar için tehlike oluşturur (s.100).",
      fc: ["Taşkın ovasının avantaj ve riski nedir?", "Verimli tarım alanı sağlar, ancak taşkın yaptığında can ve mal riski doğurur."]
    },
    {
      bi: 1,
      metin: "İnsan faaliyetlerinin yeryüzü şekillerini etkilediğini gösteren örnek hangisidir?",
      secenekler: [
        "Baraj inşaatlarının nehir akışını ve vadi yapısını değiştirmesi",
        "Akarsuların denize döküldüğü yerde delta oluşturması",
        "Buzulların vadileri U profiline sokması",
        "Rüzgârın kumulları engellerin önünde biriktirmesi"
      ],
      cozum: "Baraj inşaatları nehirlerin akışını ve vadilerin yapısını değiştirir; tarım ve şehirleşme de erozyon riskini artırır (s.99).",
      fc: ["İnsanın yeryüzü şekline müdahalesi nedir?", "Baraj, tarım ve şehirleşme yoluyla doğal süreçlerin değiştirilmesi."]
    }
  ]
});
