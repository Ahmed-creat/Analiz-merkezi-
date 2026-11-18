> Bu rapor `docs/uretim/araclar/kaynak-denetle.js` ile üretildi (2026-11-17).
> Kitap metinleri `kitap-kaynak` dalından alınır (repoda tutulmaz).

# Kaynak Denetimi — 10. sınıf soru havuzları

## Neden bu rapor var
Önceki kapılar yalnız **yapıyı** denetliyordu: 10 soru, 4 şık, `dogru_index`,
kart eşliği, başlık eşleşmesi. "Bu soru **ders kitabından** mı üretildi?"
sorusu hiç sorulmuyordu; bu yüzden uygulamayla gelen eski soru bankası
(`kaynak_dosya: "10. Sınıf … json.zip"`) da "kontrollerden geçti" sayıldı.

## Özet
- **301 havuzun 124'ü** ders kitabı kaynaklı değil (hazır `json.zip` paketi).
- **189 konunun 126'sında** kitap kaynaklı havuz yok; bu konularda uygulama
  eski zip havuzunu gösteriyor.
- 175 havuz kitap kaynaklı (`kaynak: "… ders kitabı, s.X-Y"`).
- 2 havuz PDF (TDE yazım/noktalama), 1 konu havuzsuz (Paragraf, bilinçli).

## Ne yapılacak
1. Kitap havuzları konu adlarına bağlanacak (Fizik, Matematik, Kimya,
   Biyoloji, Coğrafya, Tarih, Din, Felsefe).
2. Kitap havuzu olmayan konular kitaptan üretilecek: **Fizik 2** (1.3 Serbest
   Düşme, 1.4 İki Boyutta), **Felsefe 13**, **Din 7**, **TDE 2-3** + 16 kazanım.
3. Ağaç, kitapların içindekilerine göre **alt konularla** yeniden kurulacak.
4. Eski zip havuzları, yerlerine kitap havuzu bağlandıkça arşive alınacak.

## Çıktı

```text
== HAVUZ KAYNAĞI (ders bazında)
ders                     havuz kitap zip elle pdf belirsiz
Fizik                       43    22   21    0    0        0
Matematik                   42    21   21    0    0        0
Din Kültürü                 36    23   13    0    0        0
Kimya                       35    21   14    0    0        0
Felsefe                     33    10   23    0    0        0
Biyoloji                    30    19   11    0    0        0
Coğrafya                    29    18   11    0    0        0
Türk Dili ve Edebiyatı      29    27    0    0    2        0
Tarih                       24    14   10    0    0        0
TOPLAM                     301

== AĞAÇ KAPSAMASI (konu başına)
ders                     konu kitap havuzu zip havuzu havuz YOK
Biyoloji                   19           8         11          0
Fizik                      21           0         21          0
Din Kültürü                24          11         13          0
Kimya                      19           5         14          0
Coğrafya                   18           7         11          0
Tarih                      14           4         10          0
Matematik                  21           0         21          0
Türk Dili ve Edebiyatı     30          27          2          1
Felsefe                    23           0         23          0
TOPLAM                    189          62        126          1

== ÜRETİLMESİ GEREKEN: yalnız hazır paketten havuzu olan konular
 Biyoloji (11):
    - 1.1 Canlılık İçin Enerjinin Önemi
    - 1.2 Işık Enerjisi Kullanılarak Besin Sentezi (Fotosentez)
    - 1.4 Işık Enerjisi Kullanılmadan Besin Sentezi (Kemosentez)
    - 1.5 Sindirim
    - 1.7 Hücresel Solunum
    - 1.9 Fermantasyon
    - 1.10 Enerji-Metabolizma İlişkisi
    - 2.1 Ekosistemin Bileşenleri
    - 2.3 Ekosistemdeki Madde ve Enerji Akışı
    - 2.4 Madde Döngüleri
    - 2.9 Atık Yönetimi
 Fizik (21):
    - 1.1 Sabit Hızlı Hareket
    - 1.2 Bir Boyutta Sabit İvmeli Hareket
    - 1.3 Serbest Düşme
    - 1.4 İki Boyutta Sabit İvmeli Hareket
    - 2.1 İş, Enerji ve Güç
    - 2.2 Enerji Biçimleri
    - 2.3 Mekanik Enerji
    - 2.4 Enerji Kaynakları
    - 3.1 Basit Elektrik Devreleri
    - 3.2 Elektrik Akımı
    - 3.3 Ohm Yasası
    - 3.4 Dirençlerin Bağlanması
    - 3.5 Üreteçlerin Bağlanması
    - 3.6 Elektrik Akımının Oluşturabileceği Tehlikelere Karşı Alınması Gereken Önlemler
    - 3.7 Topraklamanın Önemi
    - 4.1 Dalgaların Temel Kavramları
    - 4.2 Dalgaların Sınıflandırılması
    - 4.3 Dalgaların Yayılma Süratini Etkileyen Etmenler
    - 4.4 Periyodik Hareketler
    - 4.5 Su Dalgalarında Yansıma ve Kırılma
    - 4.6 Rezonans ve Deprem
 Din Kültürü (13):
    - 1.1.1 İslam'da Bilginin Yeri
    - 1.1.2 İslam'da Bilgi Kaynakları
    - 1.2 Allah-Âlem İlişkisi
    - 2.1 Allah'ın Varlığının Delilleri
    - 2.2 Allah'ı İsim ve Sıfatlarıyla Tanımak
    - 3.1 İslam'ın Tevhit İlkesi
    - 3.2 İslam'da Adalet ve Eşitlik
    - 3.3 İslam ve Barış
    - 4.1 İnsan, Çevre ve Ahlak
    - 4.2 Teknoloji ve Ahlak
    - 4.3 Çevre ve Teknoloji
    - 5.1 Dinî Yorum Farklılıklarının Sebepleri
    - 5.2 İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar
 Kimya (14):
    - 1.1.1 Kimyasal Tepkimelerin Oluşumu
    - 1.1.2 Kimyasal Tepkime Türleri
    - 1.1.3 Mol Kavramı
    - 1.1.4 Kimyasal Tepkime Denklemlerinin Denkleştirilmesi
    - 1.1.5 Kimyasal (Stokiyometrik) Hesaplamalar
    - 1.2.1 Gazların Özellikleri ve Gaz Yasaları
    - 1.2.3 İdeal Gaz Yasası
    - 1.2.4 Graham Difüzyon ve Eftizyon Yasası
    - 2.1.1 Çözünme Süreci
    - 2.1.2 Maddelerin Birbiri İçindeki Çözünebilirliği
    - 2.1.3 Çözünme Olayının Sınıflandırılması
    - 2.1.4 Derişim Birimleri (Molarite, ppm)
    - 2.1.5 Çözünürlük
    - 3.1.2 Atmosferdeki Tepkimeler ve Küresel Sorunlar
 Coğrafya (11):
    - 1.1 Coğrafi Bakış
    - 2.1 CBS ve Uzaktan Algılamanın Uygulama Alanları
    - 2.2 Mekânsal Verilerin Haritalara Aktarılması
    - 3.1 Tektonik Süreçler
    - 3.2 İklim ve Kayaç Yapısının Aşınma ve Çözünme Süreçlerine Etkisi
    - 3.3 Aşınma, Taşınma ve Biriktirme Süreçlerinin Yeryüzünün Şekillenmesine Etkisi
    - 3.4 Yeryüzü Şekilleri ile İlgili Gözlem ve Saha Çalışması
    - 3.5 Yeryüzü Şekilleri ile Beşerî Faaliyetler Arasındaki Etkileşim
    - 4.1 Yerleşmelerin Kuruluşu ve Gelişimi
    - 5.1 Ekonomik Faaliyetlerin Özellikleri
    - 6.1 Afetlerle Mücadelede İyi Uygulama Örnekleri
 Tarih (10):
    - 1.1 Önemli Askerî Mücadelelerin Türk Tarihinin Seyrine Etkileri
    - 1.2 Türkistan'dan Türkiye'ye Türklerde Devlet ve Ordu Teşkilatları
    - 1.3 Türklerde Sosyoekonomik Hayat ve Şehirleşme
    - 2.1 Osmanlı Devleti'nin Kuruluşuna Dair Görüşler
    - 2.3 Osmanlı Devleti'nde Ordu, Hukuk ve Toprak Sistemi
    - 3.1 Osmanlı Devleti'nin Cihan Devleti Hâline Gelmesi
    - 3.2 Osmanlı Devleti'nin Yönetim ve Ordu Yapısında Değişim
    - 3.3 Avrupalıların Sömürgeci Politikaları
    - 3.4 Osmanlı Devleti'nde İsyanlar
    - 3.5 Osmanlı Devleti'nde Bilim, Kültür, Eğitim ve Sanat
 Matematik (21):
    - 1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler
    - 1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler
    - 1.3 Üçgende Alan
    - 1.4 Sinüs ve Kosinüs Teoremleri
    - 2.1 İstatistiksel Problemi Oluşturma, Veri Toplama, Analiz Etme ve Yorumlama
    - 2.2 İstatistiksel Sonuç veya Yorumları Tartışma
    - 3.1 Bir Doğal Sayı ile Asal Çarpanları ve Bölenleri Arasındaki İlişkiler
    - 3.2 En Büyük Ortak Bölen-En Küçük Ortak Kat
    - 3.3 Bölünebilme Özelliklerini Kullanarak Kalan Bulma
    - 4.1 Gerçek Sayılarda Tanımlı Fonksiyonların Nitel Özellikleri
    - 4.2 Gerçek Sayılarda Tanımlı Karesel Fonksiyonlar ve Nitel Özellikleri
    - 4.3 Gerçek Sayılarda Tanımlı Karekök Fonksiyonlar ve Nitel Özellikleri
    - 4.4 Gerçek Sayılarda Tanımlı Rasyonel Fonksiyonlar ve Nitel Özellikleri
    - 4.5 Fonksiyonların Ters Fonksiyonları
    - 4.6 Denklem ve Eşitsizlikler İçeren Problemlerin Çözümü
    - 5.1 Sayma Stratejileri
    - 5.2 Cebirsel ve Fonksiyonel İşlemlerin Algoritmik Yapısı
    - 6.1 İki Nokta Arasındaki Uzaklık ve Bir Doğru Parçasını Belli Oranda Bölme
    - 6.2 Doğrunun Özellikleri ve Analitik İncelenmesi
    - 7.1 Koşullu Olasılık, Bağımlı ve Bağımsız Olaylar
    - 7.2 Bayes Teoremi
 Türk Dili ve Edebiyatı (2):
    - Yazım Kuralları
    - Noktalama İşaretleri
 Felsefe (23):
    - 1.1 Felsefenin Anlamı
    - 1.2 Felsefi Düşüncenin Gelişimi
    - 1.3 Felsefi Düşüncenin Özellikleri
    - 1.4 Felsefi Soruların Temel Özellikleri
    - 1.5 Felsefenin Diğer Alanlarla İlişkisi
    - 1.6 Felsefenin Bireysel ve Toplumsal İşlevi
    - 2.1 Düşünme ve Dil İlişkisi
    - 2.2 Mantık ve Argümantasyonun Temel Kavramları
    - 2.3 Argümantasyonun Yapısı
    - 3.1 Varlık Felsefesinin Konusu ve Temel Kavramları
    - 3.2 Varlık Felsefesinin Temel Problemleri (Varlığın Var Olup Olmadığı, Varlığın Ne Olduğu)
    - 4.1 Bilgi Felsefesinin Konusu ve Temel Kavramları
    - 4.2 Bilgi Felsefesinin Temel Problemleri (Bilginin İmkânı, Kaynağı ve Doğruluk Ölçütleri)
    - 5.1 Ahlak Felsefesinin Konusu ve Temel Kavramları
    - 5.2 Ahlak Felsefesinin Temel Problemleri (Evrensel Ahlak Yasasının İmkânı, Özgürlük-Sorumluluk İlişkisi)
    - 6.1 Estetik ve Sanat Felsefesinin Konusu ve Temel Kavramları
    - 6.2 Estetik ve Sanat Felsefesinin Temel Problemleri (Güzellik ve Ortak Estetik Yargıların İmkânı)
    - 7.1 Siyaset Felsefesinin Konusu ve Temel Kavramları
    - 7.2 Siyaset Felsefesinin Temel Problemleri (Devletin Kökeni, İktidarın Kaynağı ve Meşruiyeti, İdeal Düzen ve Ütopyalar)
    - 8.1 Din Felsefesinin Konusu ve Temel Kavramları
    - 8.2 Din Felsefesinin Temel Problemleri (Tanrı'nın Varlığına İlişkin Görüşler, Tanrı'nın Varlığına Yönelik Kanıtlamalar, Evrenin Sonluluğu ve Sonsuzluğu, Ruhun Ölümsüzlüğü)
    - 9.1 Bilim Felsefesinin Konusu ve Temel Kavramları
    - 9.2 Bilim Felsefesinin Temel Problemleri (Bilimin Ne Olduğu, Bilimin Yöntemi)

== HATALAR (0)

== UYARILAR (124)
  (124 havuz 'json.zip' kaynaklı; tam liste betiğin çıktısında)


```

## Notlar
- `hatalar: 0` — çünkü kitap havuzlarının çoğunda `topic_key` henüz yazılmadı;
  sayfa-konu uyumu denetimi ancak bağlama yapıldıktan sonra işler.
- Bilinen tek sayfa hatası: `fiz_10_t04_c01` (periyodik hareket) s.275-283
  diyor, kitapta konu s.300-308.
