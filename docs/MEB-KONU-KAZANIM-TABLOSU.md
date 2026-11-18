# MEB: Hangi Dersin Hangi Konusunda Hangi Kazanım

> **Bu dosya otomatik üretildi.** Elle düzenlemeyin.
> Üretici: `scripts/meb-rapor.js` (`npm run rapor:meb`)
> Kaynak A: **ODSGM** 2026-2027 1. Dönem Konu-Soru Dağılım Tabloları (senaryolar)
> Kaynak B: **TYMM** 2026 ortaöğretim öğrenme çıktıları (programın tamamı)

## 0. Kısa cevap

MEB'in kendi yayımladığı tabloda her ders şu üçlüyle veriliyor:

```
ÜNİTE / TEMA  →  KONU (içerik çerçevesi)  →  KAZANIM (kod + cümle)
```

Aşağıdaki tablolar bu üçlüyü birebir verir. Aynı kazanım kodu birden çok
temada geçebilir (TDE'de `TDE2.1` hem *Sözün Ezgisi* hem *Kelimelerin Ritmi*
temasında sorulur); o yüzden **asıl anahtar kazanım cümlesidir**, kod değil.

| | Sayı |
|---|---:|
| Ders | 10 |
| Ünite | 29 |
| Konu | 64 |
| Kazanım (ODSGM tablosunda geçen) | 107 |
| Kazanım (TYMM programının tamamı, 9 ders) | 158 |

## 1. ODSGM tablosu — ders → ünite → konu → kazanım

Kaynak: `2026-2027 1. Dönem Konu-Soru Dağılım Tabloları — 10. sınıf (senaryolar)` · yayım 2026-09-10 · `https://odsgm.meb.gov.tr`

Son sütun, o kazanımın **hangi yazılıda kaç soru** olarak çıkacağını gösterir
(1. dönem 1. ve 2. ortak yazılı senaryoları).

### Türk Dili ve Edebiyatı

**1. TEMA: SÖZÜN EZGİSİ**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| OKUMA • Tema içeriğine uygun bir koşuk … | `TDE2.1` | “Sözün Ezgisi” temasında ele alınan metinlerde okumayı yönetebilme | — |
| OKUMA • Tema içeriğine uygun bir koşuk … | `TDE2.2` | “Sözün Ezgisi” temasında ele alınan metinlerde anlam oluşturabilme | 1 · 1 · 1 · 2 |
| OKUMA • Tema içeriğine uygun bir koşuk … | `TDE2.3` | “Sözün Ezgisi” temasında ele alınan metinleri çözümleyebilme | 1 · 1 |
| OKUMA • Tema içeriğine uygun bir koşuk … | `TDE2.4` | “Sözün Ezgisi” temasında ele alınan metinlere yönelik okuma sürecini değerlendirebilme | — |
| YAZMA • Dinlediği masalı film şeridi hâline getirebilme | `TDE4.1` | Dinlediği/ izlediği metni film şeridi hâline getireceği yazma sürecini yönetebilme | — |
| YAZMA • Dinlediği masalı film şeridi hâline getirebilme | `TDE4.2` | Dinlediği/ izlediği metni film şeridi hâline getireceği yazısına içerik oluşturabilme | — |
| YAZMA • Dinlediği masalı film şeridi hâline getirebilme | `TDE4.3` | Film şeridi hâline getirdiği yazısını düzenlerken kural uygulayabilme | — |
| YAZMA • Dinlediği masalı film şeridi hâline getirebilme | `TDE4.4` | Film şeridi hâline getirdiği yazısına yönelik yazma sürecini değerlendirebilme | — |

**2. TEMA: KELİMELERİN RİTMİ**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| OKUMA • Tema içeriğine uygun bir gazel … | `TDE2.1` | “Kelimelerin Ritmi” temasında ele alınan metinlerde okumayı yönetebilme | — |
| OKUMA • Tema içeriğine uygun bir gazel … | `TDE2.2` | “Kelimelerin Ritmi” temasında ele alınan metinlerde anlam oluşturabilme | 1 · 1 · 2 · 2 |
| OKUMA • Tema içeriğine uygun bir gazel … | `TDE2.3` | “Kelimelerin Ritmi” temasında ele alınan metinleri çözümleyebilme | 1 · 2 · 2 · 1 · 1 |
| OKUMA • Tema içeriğine uygun bir gazel … | `TDE2.4` | “Kelimelerin Ritmi” temasında ele alınan metinlere yönelik okuma sürecini değerlendirebilme | 1 · 1 · 1 |
| YAZMA • Bilgilendirici bir metni edebî metne dönüştürebilme | `TDE4.1` | Bilgilendirici bir metni edebî metne dönüştüreceği yazma sürecini yönetebilme | — |
| YAZMA • Bilgilendirici bir metni edebî metne dönüştürebilme | `TDE4.2` | Bilgilendirici bir metni edebî metne dönüştüreceği yazısına içerik oluşturabilme | — |
| YAZMA • Bilgilendirici bir metni edebî metne dönüştürebilme | `TDE4.3` | Edebî metne dönüştürdüğü yazısında kural uygulayabilme | 1 · 1 · 1 · 1 · 1 |
| YAZMA • Bilgilendirici bir metni edebî metne dönüştürebilme | `TDE4.4` | Edebî metne dönüştürdüğü yazısına yönelik yazma sürecini değerlendirebilme çıktısından sorulacak https://cdn.eba.gov.tr/yardimcikaynaklar/2026/09/KSDT/edebiyat2.xlsx | — |

### Matematik

**GEOMETRİK ŞEKİLLER**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler | `MAT.10.1.1` | Dik üçgende trigonometrik oranlara (sinüs, kosinüs, tanjant, kotanjant) ve trigonometrik özdeşliklere ilişkin çıkarım yapabilme | 2 · 3 · 3 · 2 · 2 · 1 · 1 · 1 |
| Üçgende Yardımcı Elemanlar | `MAT.10.1.2` | Üçgenin yardımcı elemanlarının özellikleri ile ilgili çıkarım yapabilme | 1 · 1 · 2 · 2 · 2 · 1 · 1 · 1 |
| Üçgenin Alanı | `MAT.10.1.3` | Üçgenin bir kenarı ve o kenara ait yüksekliğinin değişimine bağlı olarak alanının değişimine ilişkin çıkarım yapabilme | 1 · 1 · 1 · 2 · 1 · 1 · 1 |
| Sinüs ve Kosinüs Teoremleri | `MAT.10.1.4` | Sinüs ve kosinüs teoremlerini doğrulayabilme veya ispatlayabilme | 1 · 1 · 1 · 2 · 1 · 1 · 1 |

**İSTATİSTİKSEL ARAŞTIRMA SÜRECİ**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| İki Kategorik Değişkenli Veriler | `MAT.10.2.1` | İki kategorik değişkenli veri ile çalışabilme ve iki kategorik değişken arasındaki ilişkililiğe dayalı karar verebilme | 2 · 1 · 2 · 1 · 1 · 1 |
| Başkaları Tarafından Oluşturulan İki Kategorik Değişkenli Verileri İnceleme | `MAT.10.2.2` | Başkaları tarafından oluşturulan iki kategorik değişkenli verilerin ilişkililiğine dayalı istatistiksel sonuç veya yorumları tartışabilme | 1 · 1 |

**SAYILAR**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| Bir Doğal Sayının Asal Çarpanları, Bölenleri | `MAT.10.3.1` | Bir doğal sayı ile asal çarpanları ve bölenleri arasındaki ilişkilere dair çıkarım yapabilme | 1 · 1 · 1 · 2 · 1 |
| En Büyük Ortak Bölen, En Küçük Ortak Kat | `MAT.10.3.2` | Birden çok doğal sayının ortak bölenleriyle bunların en büyüğü ve ortak katlarıyla bunların en küçüğü arasındaki ilişkilere dair muhakeme yapabilme | 2 · 2 · 3 · 1 · 1 |
| Bölünebilme | `MAT.10.3.3` | Bir doğal sayının belirli doğal sayılara bölümünden kalanlarına dair muhakeme yapabilme | 2 · 2 · 1 · 1 · 1 |

**NİCELİKLER VE DEĞİŞİMLER**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| Gerçek Sayılarda Fonksiyon Olma Şartları | `MAT.10.4.1` | Gerçek sayılarda fonksiyon olma şartları ile gerçek sayılarda tanımlı fonksiyonların nitel özelliklerini matematiksel temsillerle değerlendirebilme | 1 · 1 · 2 · 1 |
| Karesel Fonksiyon ve Nitel Özellikleri | `MAT.10.4.2` | Gerçek sayılarda f(x) = x² şeklinde tanımlı karesel referans fonksiyonun nitel özellikleri ile bu fonksiyondan türetilen (g(x) = a ∙ f(x ± r) ± k (a, r, k ∈ ℝ, a ≠ 0)) karesel fonksiyonların nitel özelliklerine ilişkin matematiksel muhakeme yapabilme | 1 · 1 |
| Karekök Fonksiyonu ve Nitel Özellikleri | `MAT.10.4.3` | Gerçek sayılarda f(x) = √x (x ≥ 0) şeklinde tanımlı karekök referans fonksiyonun nitel özellikleri ile bu fonksiyondan türetilen (g(x) = a ∙ f(x ± r) ± k (a, r, k ∈ ℝ, a ≠ 0)) karekök | — |

### Fizik

**KUVVET VE HAREKET**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| Sabit Hızlı Hareket | `FİZ.10.1.1` | Yatay doğrultuda sabit hızlı hareket ile ilgili tümevarımsal akıl yürütebilme | 3 · 3 · 2 · 2 · 1 · 1 |
| Bir Boyutta Sabit İvmeli Hareket | `FİZ.10.1.2` | İvme ve hız değişimi arasındaki ilişkiye yönelik tümevarımsal akıl yürütebilme | 2 · 3 · 3 · 3 · 1 · 1 · 1 |
| Bir Boyutta Sabit İvmeli Hareket | `FİZ.10.1.3` | Yatay doğrultuda sabit ivmeyle hareket eden cisimlerin hareket grafiklerinden elde edilen matematiksel modelleri yorumlayabilme | 2 · 1 · 2 · 1 · 1 |

**ENERJİ**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| İş, Enerji ve Güç | `FİZ.10.2.1` | Kuvvet-yer değiştirme grafiği kullanılarak iş ile ilgili tümevarımsal akıl yürütebilme | 1 · 1 · 2 · 2 · 2 |
| İş, Enerji ve Güç | `FİZ.10.2.2` | İş, enerji ve güç kavramlarına ilişkin çıkarım yapabilme | 1 · 2 · 2 · 2 · 2 |
| Enerji Biçimleri | `FİZ.10.2.3` | Enerji biçimlerini karşılaştırabilme | 1 · 1 · 1 · 1 · 1 |
| Mekanik Enerji | `FİZ.10.2.4` | Mekanik enerjiyi çözümleyebilme | 1 · 1 · 1 · 1 |
| Enerji Kaynakları | `FİZ.10.2.5` | Yenilenebilen ve yenilenemeyen enerji kaynaklarını karşılaştırabilme çıktısından sorulacak soru sayısını gösterir. Zümre öğretmenleri https://cdn.eba.gov.tr/yardimcikaynaklar/2026/09/KSDT/fizik2.xlsx | 1 · 1 · 1 |

### Kimya

**ETKİLEŞİM**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| Kimyasal Tepkimeler | `KİM.10.1.1` | Kimyasal değişimlere ilişkin kanıtları belirlemeye yönelik bilimsel gözlem yapabilme | 1 · 1 · 1 · 1 · 1 |
| Kimyasal Tepkimeler | `KİM.10.1.2` | Kimyasal tepkimelerin oluşumunu açıklamak için bilimsel model oluşturabilme | 1 · 1 · 1 · 1 · 1 |
| Kimyasal Tepkimeler | `KİM.10.1.3` | Kimyasal tepkime türlerinin oluşum sürecine ilişkin bilimsel gözlem yapabilme | 2 · 2 · 2 · 1 · 2 · 2 · 1 · 1 |
| Kimyasal Tepkimeler | `KİM.10.1.4` | Mol kavramına ilişkin operasyonel tanımlama yapabilme | 2 · 1 · 1 · 2 · 2 · 2 · 1 · 1 |
| Kimyasal Tepkimeler | `KİM.10.1.5` | Saf maddelerin ölçülebilir özellikleri arasındaki ilişkileri belirlemeye yönelik tümdengelimsel akıl yürütebilme | 1 · 2 · 2 · 1 · 2 · 1 · 1 |
| Kimyasal Tepkimeler | `KİM.10.1.6` | Kimyasal tepkime denklemlerinde tanecik sayılarının tutarsızlıklarına ilişkin çelişkiyi giderebilme | 1 · 1 · 1 · 1 · 1 · 1 · 1 · 1 |
| Kimyasal Tepkimeler | `KİM.10.1.7` | Kimyasal tepkimelerde stokiyometrik ilişkilere yönelik | 2 · 2 · 2 · 1 · 2 · 1 · 2 · 2 |
| Gazlar | `KİM.10.1.8` | Gazların özelliklerine ilişkin bilimsel gözlem yapabilme | 2 · 2 · 1 · 1 · 1 · 2 · 2 · 2 |
| Gazlar | `KİM.10.1.9` | Gazların özellikleri arasındaki ilişkileri bilimsel sorgulayabilme | 1 · 2 · 1 · 1 · 1 · 2 · 2 |
| Gazlar | `KİM.10.1.10` | İdeal gaz denklemini tümevarımsal akıl yürütme yoluyla oluşturabilme öğrenme çıktısından https://cdn.eba.gov.tr/yardimcikaynaklar/2026/09/KSDT/kimya4.xlsx | 1 · 1 · 1 · 1 · 1 |

### Biyoloji

**ENERJİ**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| Canlılık İçin Enerjinin Önemi (ATP’nin Yapısı ve Enerji Aktarımında ATP’nin Rolü) | `BİY.10.1.1` | Canlıların yaşamına devam edebilmesi için enerjinin gerekliliğini sorgulayabilme | 2 · 3 · 2 · 3 · 1 |
| Işık Enerjisi Kullanılarak Besin Sentezi: Fotosentez (Işığın Kullanıldığı Tepkimeler, Işığın Kullanılmadığı Tepkimeler, Fotosentez Hızına Etki Eden Çevresel Faktörler) | `BİY.10.1.2` | Fotosentez reaksiyonlarıyla ilgili bilimsel model oluşturabilme | — |
| Işık Enerjisi Kullanılarak Besin Sentezi: Fotosentez (Işığın Kullanıldığı Tepkimeler, Işığın Kullanılmadığı Tepkimeler, Fotosentez Hızına Etki Eden Çevresel Faktörler) | `BİY.10.1.3` | Fotosentezde kullanılan ve üretilen maddelerle ilgili deney yapabilme | 1 · 1 · 1 · 2 · 1 · 1 |
| Işık Enerjisi Kullanılmadan Besin Sentezi: Kemosentez | `BİY.10.1.4` | Kemosentez hakkında bilgi toplayabilme | — |
| Sindirim (Hücre İçi Sindirim ve Hücre Dışı Sindirim), Canlılarda Sindirim Yapıları | `BİY.10.1.5` | Canlılarda sindirim çeşitlerini ve yapılarını sınıflandırabilme | 2 · 2 · 3 · 1 · 2 · 2 |
| İnsanda Sindirim, Emilim ve Taşınma | `BİY.10.1.6` | İnsanda enerji eldesi için sindirim, emilim ve taşıma süreçlerinin gerekliliği ile ilgili bilimsel çıkarım yapabilme | 2 · 1 · 2 |
| Hücresel Solunum (Glikoliz, Sitrik Asit Döngüsü, Elektron Taşıma Sistemi) | `BİY.10.1.7` | Hücresel solunum reaksiyonlarıyla ilgili bilimsel model oluşturabilme | — |
| Besinlerin Solunuma Katılma Yolları | `BİY.10.1.8` | Farklı besin gruplarından enerji eldesi süreçlerini karşılaştırabilme | 2 · 1 · 1 |
| Fermantasyon (Laktik Asit Fermantasyonu, Etil Alkol Fermantasyonu) | `BİY.10.1.9` | Fermantasyon ile ilgili deney yapabilme soru sayısını gösterir. Zümre öğretmenleri senaryolardan birini seçer; Değerlendirme ve Sınav Hizmetleri Genel Müdürlüğü — 2026-2027 1. | 1 · 1 |

### Tarih

**1. ÜNİTE: TÜRKİSTAN’DAN TÜRKİYE’YE (1040-1299)**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| Türkistan’dan Türkiye’ye Uzanan Süreçte Meydana Gelen Önemli Askerî Mücadeleler | `TAR.10.1.1` | Türkistan’dan Türkiye’ye uzanan süreçte 1040-1299 yılları arasında meydana gelen önemli askerî mücadelelerin Türk tarihinin seyrine etkilerini karşılaştırabilme | 3 · 2 · 1 · 2 · 2 · 3 · 1 · 1 |
| Türkistan’dan Türkiye’ye Uzanan Süreçte Türk Devlet ve Ordu Teşkilatında Meydana Gelen Değişim | `TAR.10.1.2` | Türkistan’dan Türkiye’ye uzanan süreçte Türklerde devlet ve ordu teşkilatında meydana gelen değişim ve sürekliliği yorumlayabilme | 2 · 3 · 2 · 2 · 2 · 3 · 1 · 1 · 1 |
| Türkistan’dan Türkiye’ye Uzanan Süreçte Türklerin Sosyal Yaşamları ve Ekonomik Faaliyetleri | `TAR.10.1.3` | Türkistan’dan Türkiye’ye uzanan süreçte Türklerin sosyoekonomik faaliyetleri ile yerleşme ve şehirleşme anlayışları arasındaki ilişkiyi sorgulayabilme | 2 · 2 · 3 · 3 · 2 · 1 · 1 · 1 · 2 |
| Türk-İslam Medeniyetinin Bilim, Kültür, Eğitim ve Sanat Alanlarında Ortaya Çıkardığı Etkiler | `TAR.10.1.4` | Türkistan’dan Türkiye’ye uzanan süreçte Türk-İslam medeniyetinde bilim, kültür, eğitim ve sanat alanlarında meydana gelen gelişmeleri Anadolu’nun Türkleşme ve İslamlaşma sürecine etkisi açısından değerlendirebilme | 2 · 1 · 1 · 1 · 2 |

**2. ÜNİTE: BEYLİKTEN DEVLETE**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| Osmanlı Devleti’nin Kuruluşuna Dair Farklı Görüşler | `TAR.10.2.1` | Osmanlı Devleti’nin kuruluşuna | 2 · 2 · 2 · 1 · 1 · 2 |

**OSMANLI (1299-1453)**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| Osmanlı Devleti’nin Anadolu ve Rumeli’deki Siyasi ve Askerî Mücadeleleri | `TAR.10.2.2` | 1299-1453 yılları arasında Osmanlı Devleti’nin Anadolu ve Rumeli’de gerçekleştirdiği siyasi ve askerî mücadeleleri yorumlayabilme çıktısından sorulacak soru https://cdn.eba.gov.tr/yardimcikaynaklar/2026/09/KSDT/tarih3.xlsx | 2 · 2 · 2 · 2 · 2 |

### Coğrafya

**COĞRAFYANIN DOĞASI**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| Coğrafi Bakış | `COĞ.10.1.1` | Örnek olay, olgu ve/veya mekânı coğrafyanın temel kavramları ile ilişkilendirebilme | 1 · 1 · 1 · 1 · 1 · 1 |

**MEKÂNSAL BİLGİ TEKNOLOJİLERİ**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| CBS ve Uzaktan Algılamanın Uygulama Alanları | `COĞ.10.2.1` | Örnek uygulamalar üzerinden CBS ve uzaktan algılamanın kullanım alanlarını özetleyebilme | 1 · 1 · 1 · 1 · 1 · 1 |
| Mekânsal Verilerin Haritalara Aktarılması | `COĞ.10.2.2` | Mekânsal bilgi teknolojilerini kullanarak altlık haritalar üzerinde mekânsal veriler oluşturabilme | 1 · 1 · 1 · 1 · 1 · 1 |

**DOĞAL SİSTEMLER VE SÜREÇLER**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| Tektonik Süreçler | `COĞ.10.3.1` | Yerkürenin tektonik yapısını çözümleyebilme | 1 · 1 · 2 · 2 · 2 · 2 |
| İklim ve Kayaç Yapısının Aşınma ve Çözünme Süreçlerine Etkisi | `COĞ.10.3.2` | Yeryüzü şekillerinin oluşumunda etkili olan aşınma ve çözünme süreçleri ile iklim ve kayaç özellikleri arasındaki ilişkileri yapılandırabilme | 1 · 1 · 1 · 1 · 2 · 2 · 1 · 2 · 2 · 1 |
| Aşınım ve Birikim Süreçlerinin Yeryüzü Şekillerinin Oluşumuna Etkisi | `COĞ.10.3.3` | Yeryüzü şekillerinin oluşumunu aşınım ve birikim süreçleri açısından çözümleyebilme | 1 · 1 · 1 · 1 · 2 · 2 · 2 · 2 · 2 |
| Yeryüzü Şekilleri ile İlgili Gözlem ve Saha Çalışması | `COĞ.10.3.4` | Yeryüzü şekillerinin oluşumunda doğal süreçlerin etkilerini saha/sanal saha çalışmalarıyla araştırabilme | 1 · 1 · 1 · 1 · 1 · 1 |
| Yeryüzü Şekilleri ile Beşerî Faaliyetler Arasındaki Etkileşim | `COĞ.10.3.5` | Yakın çevresindeki yeryüzü şekilleri ile beşerî faaliyetler arasındaki etkileşimi sorgulayabilme | 1 · 1 · 1 · 1 · 1 · 1 |
| Yeryüzü Şekilleri ile Beşerî Faaliyetler Arasındaki Etkileşim | `COĞ.10.4.1` | Yerleşme yeri seçiminde ve | 1 · 1 · 1 · 2 · 2 |

**BEŞERÎ SİSTEMLER VE SÜREÇLER**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| Yerleşmelerin Fonksiyonları | `COĞ.10.4.2` | Türkiye ve dünyadaki yerleşmeleri fonksiyonlarına göre sınıflandırabilme çıktısından sorulacak soru https://cdn.eba.gov.tr/yardimcikaynaklar/2026/09/KSDT/cografya4.xlsx | 1 · 1 · 1 |

### Felsefe

**1. ÜNİTE: FELSEFENİN DOĞASI**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| Felsefenin Anlamı Felsefi Düşüncenin Özellikleri Felsefi Düşüncenin Gelişimi Felsefi Sorunun Temel Özellikleri Felsefenin Diğer Alanlarla İlişkisi Felsefenin Bireysel ve Toplumsal İşlevi | `FEL.10.1.1` | Felsefenin anlamını, gelişim sürecini ve işlevini sorgulayabilme | 2 · 3 · 3 · 3 · 3 · 1 · 1 · 1 · 1 · 1 |

**2. ÜNİTE: FELSEFE, MANTIK VE ARGÜMANTASYON**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| Düşünme ve Dil İlişkisi | `FEL.10.2.1` | Düşünme ve dil ilişkisini yapılandırabilme | 2 · 1 · 1 · 2 · 2 · 1 · 1 |
| Mantık ve Argümantasyonun Temel Kavramları Argümantasyonun Yapısı | `FEL.10.2.2` | Mantığın temel kavramlarını ve argümantasyon sürecini yorumlayabilme | 2 · 1 · 2 · 2 · 1 · 2 · 2 · 2 · 2 |

**3. ÜNİTE: VARLIK FELSEFESİ**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| Varlık Felsefesinin Konusu ve Temel Kavramları Varlık Felsefesinin Temel Problemleri (Varlığın Var Olup Olmadığı, Varlığın Ne Olduğu) | `FEL.10.3.1` | Varlık felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme | 3 · 2 · 2 · 2 · 3 |

**4. ÜNİTE BİLGİ FELSEFESİ**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| Bilgi Felsefesinin Konusu ve Temel Kavramları Bilgi Felsefesinin Temel Problemleri (Bilginin İmkânı, Kaynağı ve Doğruluk Ölçütleri) | `FEL.10.4.1` | Bilgi felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme soru sayısını gösterir. Zümre Değerlendirme ve Sınav Hizmetleri | 1 · 1 · 1 · 2 · 2 |

### Din Kültürü

**İSLAM’DA VARLIK VE BİLGİ**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| İslam’da Bilgi ve Bilginin Kaynakları | `DKAB.10.1.1` | İslam’da bilginin yerini ve kaynaklarını çözümleyebilme | 2 · 2 · 1 · 2 · 1 · 1 |
| Allah-Âlem İlişkisi | `DKAB.10.1.2` | Allah-âlem ilişkisini müşahede edebilme | 3 · 2 · 3 · 3 · 1 · 1 · 1 · 1 |
| Kur’an’dan Mesajlar | `DKAB.10.1.3` | İsra suresinin 36 ve Mülk suresinin 23. ayetlerinin mesajlarını anlamak için Kur’an-ı Kerim meallerine başvurabilme | 1 · 1 · 1 · 1 |

**ALLAH’I TANIMAK**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| Allah’ın Varlığının Delilleri | `DKAB.10.2.1` | Allah’ın (cc) varlığının delillerini müşahede edebilme | 1 · 1 · 1 · 1 · 2 · 2 · 2 · 2 · 2 |
| Allah’ı İsim ve Sıfatlarıyla Tanımak | `DKAB.10.2.2` | Allah’ı (cc) gereği gibi tanıyabilmek için O’nun isim ve sıfatlarını bağlamına uygun kullanabilme | 2 · 2 · 2 · 2 · 2 · 2 |
| Kur’an’dan Mesajlar | `DKAB.10.2.3` | Haşr suresinin 22-24. ayetlerindeki mesajları anlamak için Kur’an-ı Kerim meallerine başvurabilme | 1 · 1 · 1 · 1 · 1 · 1 |

**İSLAM’IN EVRENSEL MESAJLARI**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
| İslam’ın Tevhit İlkesi | `DKAB.10.3.1` | İslam’ın evrensel mesajlarından biri olan tevhit ilkesi hakkında bilgi toplayabilme çıktısından sorulacak soru sayısını gösterir. Zümre https://cdn.eba.gov.tr/yardimcikaynaklar/2026/09/KSDT/dkab_lise2.xlsx | 1 · 1 · 1 |

### İngilizce

**Revision 1**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
|  | `ENG.9.1.V1` | Students can select and use target vocabulary efficiently, effectively, and accurately, based on the current content about “school life with students of different countries, nationalities, and languages; capitals of their countries, and tourist attractions; activities in their capitals and countries; national days and celebrations” after recognising them in context and developing their conscious and inductive vocabulary learning skills. | 1 · 1 · 1 · 1 |
|  | `ENG.9.4.R3` | Students can make sense of and derive meaning from the current content on “family life with family members’ jobs, work routines, work activities, and workplaces”. | 1 · 1 · 1 · 1 · 1 |

**Revision 2**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
|  | `ENG.9.5.R2` | Students can bring information together about the current content on ''life in the house and neighbourhood with types of houses, rooms, furniture and activities in the house'' through skimming, scanning and detailed reading. | 1 · 1 · 1 · 1 |
|  | `ENG.9.5.W3` | Students can construct new written content on ''life in the house and neighbourhood with types of houses, rooms, furniture and activities in the house'' based on their understanding of the model(s) provided. | 1 · 1 |
|  | `ENG.9.5.W4` | Students can practise producing written content based on the current theme ''life in the house and neighbourhood with types of houses, rooms, furniture and activities in the house''. | 1 · 1 |
|  | `ENG.9.8.V1` | Students can select and use target vocabulary efficiently, effectively, and accurately, based on the current content about ''life in the universe and future with films, film genres, futuristic films with | 1 · 1 · 1 |

**SCHOOL LIFE & EDUCATION**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
|  | `ENG.10.1.R2` | Students can bring information together about the current content on ''school life and education with different types of schools in the world; regular and extracurricular activities at different types of schools; school anxiety and stress; national days and celebrations'' through skimming, scanning and detailed reading. | 1 · 1 · 1 · 1 · 1 |
|  | `ENG.10.1.R3` | Students can make sense of and derive meaning from the current content on ''school life and education with different types of schools in the world; regular and extracurricular activities at different types of schools; school anxiety and stress; national days and celebrations''. | 1 · 1 · 1 · 1 · 1 |
|  | `ENG.10.1.V1` | Students can select and use target vocabulary efficiently, effectively, and accurately, based on the current content about ''school life and education with different types of schools in the world; regular and extracurricular activities at different types of schools; school anxiety and stress; national days and celebrations'' after recognising them in context and developing their conscious and inductive vocabulary learning skills. | 1 · 1 · 1 · 1 · 1 · 1 |
|  | `ENG.10.1.G1` | Students can select and use target grammatical language items efficiently, effectively, and accurately, based on the current content about ''school life and education with different types of schools in the world; regular and extracurricular activities at different | 1 · 1 · 1 · 1 · 1 · 1 |
|  | `ENG.10.1.W3` | Students can construct new written content on ''school life and education with different types of schools in the world; regular and extracurricular activities at different types of schools; school anxiety and stress; national days and celebrations'' based on their understanding of the model(s) provided. | 1 |
|  | `ENG.10.1.W4` | Students can practise producing written content based on the current theme ''school life and education with different types of schools in the world; regular and extracurricular activities at different types of schools; school anxiety and stress; national days and celebrations''. | 1 · 1 |

**CLASSROOM LIFE & LEARNING**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
|  | `ENG.10.2.R2` | Students can bring information together about the current content on ''classroom life and learning with learning activities in the classroom; personal learning styles; learning with technology in the classroom'' through skimming, scanning and detailed reading. | 1 · 1 |
|  | `ENG.10.2.R3` | Students can make sense of and derive meaning from the current content on ''classroom life and learning with learning activities in the classroom; personal learning styles; learning with technology in the classroom''. | 1 · 1 |
|  | `ENG.10.2.V1` | Students can select and use target vocabulary efficiently, effectively, and accurately, based on the current content about ''classroom life and learning with learning activities in the classroom; personal learning styles; learning with technology in the classroom'' after recognising them in context and developing their conscious and inductive vocabulary learning skills. | 1 · 1 |
|  | `ENG.10.2.G1` | Students can select and use target grammatical language items efficiently, effectively, and accurately, based on the current content about ''classroom life and learning with learning activities in the classroom; personal learning styles; learning with technology in the classroom'', after recognising them in context and developing their conscious and inductive grammaring skills through consciousness- raising and discovery. | 1 · 1 |
|  | `ENG.10.2.W3` | Students can construct new written content on ''classroom life and learning with learning activities in the classroom; personal learning styles; learning with technology in the classroom'' based on their understanding of the model(s) provided. | 1 |
|  | `ENG.10.2.W4` | Students can practise producing written content based on the current theme ''classroom life and learning with learning activities in the classroom; personal learning styles; learning with technology in the classroom''. | 1 |

**PERSONAL LIFE AND WELL-BEING**

| Konu | Kazanım kodu | Kazanım cümlesi | Soru |
|---|---|---|---:|
|  | `ENG.10.3.R2` | Students can bring information together about the current content on ''personal life and well- being with body parts, human illnesses and diseases; human nature and human well-being today and in the future; fashion and personal fashion preferences'' through skimming, scanning and detailed reading. | 1 |
|  | `ENG.10.3.R3` | Students can make sense of and derive meaning from the current content on ''personal life and well-being with body parts, human illnesses and diseases; human nature and human well-being today and in the future; fashion and personal fashion preferences''. | 1 · 1 · 1 |
|  | `ENG.10.3.V1` | Students can select and use target vocabulary efficiently, effectively, and accurately, based on the current content about ''personal life and well-being with body parts, human illnesses and diseases; human nature and human well-being today and in the future; fashion and personal fashion preferences'' after recognising them in context and developing their conscious and inductive vocabulary learning skills. | — |
|  | `ENG.10.3.G1` | Students can select and use target grammatical language items efficiently, effectively, and accurately, based on the current content about ''personal life and well-being with body parts, human illnesses and diseases; human nature and human well-being today and in the future; fashion and personal fashion preferences'', after recognising them in context and developing their conscious and inductive grammaring skills through consciousness-raising and discovery. | 1 · 1 |
|  | `ENG.10.3.W3` | Students can construct new written content on ''personal life and well-being with body parts, human illnesses and diseases; human nature and human well-being today and in the future; fashion and personal fashion preferences'' based on their understanding of the model(s) provided. | 1 · 1 |
|  | `ENG.10.3.W4` | Students can practise producing written content based on the current theme ''personal life and well-being with body parts, human illnesses and diseases; human nature and ilgili senaryoda o öğrenme çıktısından sorulacak soru sayısını gösterir. Zümre https://cdn.eba.gov.tr/yardimcikaynaklar/2026/09/KSDT/ingilizce_lise2.xlsx | 1 |

## 2. TYMM programının tamamı — ODSGM tablosunda geçmeyen çıktılar

1. dönem sınav tablosu tüm programı kapsamaz (dönem ortasına kadar olan konular).
Aşağıdaki **83** çıktı programda var ama 1. dönem tablosunda yok —
yıl içinde sorumlu olduğunuz konular. Bunlar da uygulamada eşlenir;
yalnız hangi **konuda** oldukları ODSGM tablosunda yazmadığı için ünite bilgisi temadan gelir.

**Türk Dili ve Edebiyatı** (8)

- `TDE1.1` (tema 1) — Dinlemeyi/İzlemeyi Yönetebilme  
  ↳ uygulama konusu: (havuzda yok)
- `TDE1.2` (tema 1) — Anlam Oluşturabilme  
  ↳ uygulama konusu: (havuzda yok)
- `TDE1.3` (tema 1) — Çözümleyebilme  
  ↳ uygulama konusu: (havuzda yok)
- `TDE1.4` (tema 1) — Süreci Değerlendirebilme  
  ↳ uygulama konusu: (havuzda yok)
- `TDE3.1` (tema 3) — Konuşmayı Yönetebilme  
  ↳ uygulama konusu: (havuzda yok)
- `TDE3.2` (tema 3) — İçerik Oluşturabilme  
  ↳ uygulama konusu: (havuzda yok)
- `TDE3.3` (tema 3) — Kural Uygulayabilme  
  ↳ uygulama konusu: (havuzda yok)
- `TDE3.4` (tema 3) — Süreci Değerlendirebilme  
  ↳ uygulama konusu: (havuzda yok)

**Matematik** (9)

- `MAT.10.4.4` (tema 4) — Gerçek sayılarda f(x) = 1 x (x ≠ 0) şeklinde tanımlı rasyonel referans fonksiyonun lendirir. nitel özellikleri ile bu fonksiyondan türetilen (g(x) = a ∙ f(x ±  
  ↳ uygulama konusu: 4.4 Gerçek Sayılarda Tanımlı Rasyonel Fonksiyonlar ve Nitel Özellikleri
- `MAT.10.4.5` (tema 4) — Doğrusal, karesel, karekök ve rasyonel referans fonksiyonlar ile bu fonksiyonlardan türetilebilen fonksiyonların ters fonksiyonlarına dair çıkarım yapabilme  
  ↳ uygulama konusu: 4.5 Fonksiyonların Ters Fonksiyonları
- `MAT.10.4.6` (tema 4) — Doğrusal, karesel, karekök, rasyonel referans fonksiyonlar ve bunlardan türetilen fonksiyonlarla ifade edilebilen denklem ve eşitsizlikler içeren problemleri çözebilme  
  ↳ uygulama konusu: 4.6 Denklem ve Eşitsizlikler İçeren Problemlerin Çözümü
- `MAT.10.5.1` (tema 5) — Sayma stratejileri kullanarak problem çözebilme  
  ↳ uygulama konusu: 5.1 Sayma Stratejileri
- `MAT.10.5.2` (tema 5) — Cebirsel ve fonksiyonel işlemleri algoritmik bir dille yapılandırabilme  
  ↳ uygulama konusu: 5.2 Cebirsel ve Fonksiyonel İşlemlerin Algoritmik Yapısı
- `MAT.10.6.1` (tema 6) — Dik koordinat sisteminde iki nokta arasındaki uzaklık ve bir doğru parçasını belli oranda bölen noktanın koordinatlarıyla ilgili çıkarım yapabilme  
  ↳ uygulama konusu: 6.1 İki Nokta Arasındaki Uzaklık ve Bir Doğru Parçasını Belli Oranda Bölme
- `MAT.10.6.2` (tema 6) — Dik koordinat sistemini doğrunun özelliklerini incelemek ve doğru ile ilgili problemleri çözebilmek için uygun bir temsil aracı olarak kullanabilme  
  ↳ uygulama konusu: 6.2 Doğrunun Özellikleri ve Analitik İncelenmesi
- `MAT.10.7.1` (tema 7) — Koşullu olasılık ile çıkarım yapabilme  
  ↳ uygulama konusu: 7.1 Koşullu Olasılık, Bağımlı ve Bağımsız Olaylar
- `MAT.10.7.2` (tema 7) — Bir olayın gerçekleşmesinin diğer bir olayın meydana gelmesine bağlı olduğu durumların olasılığını mevcut bilgiye/veriye dayalı tahmin edebilme  
  ↳ uygulama konusu: 7.2 Bayes Teoremi

**Fizik** (14)

- `FİZ.10.3.1` (tema 3) — Basit elektrik devresinde potansiyel fark, elektrik akımı ve direnç kavramlarının tanımına ilişkin analojik akıl yürütebilme  
  ↳ uygulama konusu: 3.1 Basit Elektrik Devreleri
- `FİZ.10.3.2` (tema 3) — Elektrik yükünün hareketi üzerinden elektrik akımı kavramını çözümleyebilme  
  ↳ uygulama konusu: 3.2 Elektrik Akımı
- `FİZ.10.3.3` (tema 3) — Ohm Yasası ile ilgili tümevarımsal akıl yürütebilme  
  ↳ uygulama konusu: 3.3 Ohm Yasası
- `FİZ.10.3.4` (tema 3) — Dirençlerin bağlanma türüne göre eşdeğer dirence ilişkin bilimsel çıkarım yapabilme  
  ↳ uygulama konusu: 3.4 Dirençlerin Bağlanması
- `FİZ.10.3.5` (tema 3) — Üreteçlerin bağlanma türüne göre devreye sağladıkları potansiyel farka ilişkin bilimsel çıkarım yapabilme  
  ↳ uygulama konusu: 3.5 Üreteçlerin Bağlanması
- `FİZ.10.3.6` (tema 3) — Elektrik akımının oluşturabileceği tehlikelere karşı alınması gereken önlemlerle ilgili bilgi toplayabilme  
  ↳ uygulama konusu: 3.6 Elektrik Akımının Oluşturabileceği Tehlikelere Karşı Alınması Gereken Önlemler
- `FİZ.10.3.7` (tema 3) — Topraklama olayının önemini sorgulayabilme  
  ↳ uygulama konusu: (havuzda yok)
- `FİZ.10.4.1` (tema 4) — Periyodik hareketlere ilişkin deneyimlerini yansıtabilme  
  ↳ uygulama konusu: 4.4 Periyodik Hareketler
- `FİZ.10.4.2` (tema 4) — Dalgaların temel kavramlarına ilişkin operasyonel tanımlama yapabilme  
  ↳ uygulama konusu: 4.1 Dalgaların Temel Kavramları
- `FİZ.10.4.3` (tema 4) — Dalgaları özelliklerine göre sınıflandırabilme  
  ↳ uygulama konusu: 4.2 Dalgaların Sınıflandırılması
- `FİZ.10.4.4` (tema 4) — Dalgaların yayılma süratini etkileyen etmenlere ilişkin bilimsel gözleme dayalı tahmin yapabilme  
  ↳ uygulama konusu: 4.3 Dalgaların Yayılma Süratini Etkileyen Etmenler
- `FİZ.10.4.5` (tema 4) — Su dalgalarında yansıma ve kırılma ile ilgili tümevarımsal akıl yürütebilme  
  ↳ uygulama konusu: 4.5 Su Dalgalarında Yansıma ve Kırılma
- `FİZ.10.4.6` (tema 4) — Rezonans ve depreme ilişkin kavramlar üzerinden depremi sorgulayabilme  
  ↳ uygulama konusu: 4.6 Rezonans ve Deprem
- `FİZ.10.4.7` (tema 4) — Depremle ilgili bilimsel model oluşturabilme  
  ↳ uygulama konusu: (havuzda yok)

**Kimya** (11)

- `KİM.10.1.11` (tema 1) — Gazların farklı ortamlarda yayılmasına ilişkin deney yapabilme  
  ↳ uygulama konusu: 1.2.4 Graham Difüzyon ve Eftizyon Yasası
- `KİM.10.2.1` (tema 2) — Çözünme sürecine ilişkin bilimsel model oluşturabilme  
  ↳ uygulama konusu: 2.1.2 Maddelerin Birbiri İçindeki Çözünebilirliği
- `KİM.10.2.2` (tema 2) — Farklı maddelerin birbiri içinde çözünebilirliğini kanıt kullanarak açıklayabilme  
  ↳ uygulama konusu: 2.1.2 Maddelerin Birbiri İçindeki Çözünebilirliği
- `KİM.10.2.3` (tema 2) — Çözünme olayını sınıflandırabilme  
  ↳ uygulama konusu: 2.1.1 Çözünme Süreci
- `KİM.10.2.4` (tema 2) — Çözünürlük kavramına ilişkin operasyonel tanımlama yapabilme  
  ↳ uygulama konusu: 2.1.3 Çözünme Olayının Sınıflandırılması
- `KİM.10.2.5` (tema 2) — Çözünürlüğe etki eden faktörleri belirlemeye yönelik kanıt kullanabilme  
  ↳ uygulama konusu: 2.1.4 Derişim Birimleri (Molarite, ppm)
- `KİM.10.2.6` (tema 2) — Çözeltileri sınıflandırabilme  
  ↳ uygulama konusu: 2.1.5 Çözünürlük
- `KİM.10.2.7` (tema 2) — Çözeltilerin molar derişimine ilişkin tümevarımsal akıl yürütebilme  
  ↳ uygulama konusu: (havuzda yok)
- `KİM.10.2.8` (tema 2) — Çözünen maddenin tanecik sayısının çözeltilerin kaynama ve donma noktasına etkisini belirlemeye yönelik hipotez oluşturabilme  
  ↳ uygulama konusu: (havuzda yok)
- `KİM.10.3.1` (tema 3) — Kimya dersinde mikro ölçekli deney tercih etmenin sonuçlarını ekosistem açısından değerlendirebilme  
  ↳ uygulama konusu: 3.1.2 Atmosferdeki Tepkimeler ve Küresel Sorunlar
- `KİM.10.3.2` (tema 3) — Kimyasal tepkimeler sonucunda atmosferin doğasındaki değişimin ekosisteme etkilerine yönelik problem çözebilme  
  ↳ uygulama konusu: 3.1.2 Atmosferdeki Tepkimeler ve Küresel Sorunlar

**Biyoloji** (10)

- `BİY.10.1.10` (tema 1) — Besinlerden elde edilen enerjinin canlının metabolik süreçlerine katkısı ile ilgili bilimsel çıkarım yapabilme  
  ↳ uygulama konusu: 1.10 Enerji-Metabolizma İlişkisi
- `BİY.10.2.1` (tema 2) — Ekosistemin cansız ve canlı bileşenleri arasındaki ilişkileri çözümleyebilme  
  ↳ uygulama konusu: 2.1 Ekosistemin Bileşenleri
- `BİY.10.2.2` (tema 2) — Komünitelerde ve popülasyonlarda görülen etkileşimleri ve değişimleri sorgulayabilme  
  ↳ uygulama konusu: 2.3 Ekosistemdeki Madde ve Enerji Akışı
- `BİY.10.2.3` (tema 2) — Ekosistemdeki enerji akışıyla ilgili tümevarımsal akıl yürütebilme  
  ↳ uygulama konusu: 2.3 Ekosistemdeki Madde ve Enerji Akışı
- `BİY.10.2.4` (tema 2) — Madde döngüleri ile ilgili bilimsel model oluşturabilme  
  ↳ uygulama konusu: 2.4 Madde Döngüleri
- `BİY.10.2.5` (tema 2) — Ekolojik sürdürülebilirliğin önemini yorumlayabilme  
  ↳ uygulama konusu: 2.9 Atık Yönetimi
- `BİY.10.2.6` (tema 2) — Çevresinde sürdürülebilirliği kısıtlayan durumlarla ilgili gözleme dayalı tahmin yapabilme  
  ↳ uygulama konusu: 2.9 Atık Yönetimi
- `BİY.10.2.7` (tema 2) — Ekolojik ayak izini küçültebilme yollarını bilimsel olarak sorgulayabilme  
  ↳ uygulama konusu: 2.9 Atık Yönetimi
- `BİY.10.2.8` (tema 2) — Doğal kaynakların ve biyoçeşitliliğin korunması için alınan önlemleri sorgulayabilme  
  ↳ uygulama konusu: 2.9 Atık Yönetimi
- `BİY.10.2.9` (tema 2) — Çevresinde atık yönetimi konusunda yapılan çalışmalarla ilgili bilgi toplayabilme  
  ↳ uygulama konusu: 2.9 Atık Yönetimi

**Tarih** (8)

- `TAR.10.2.3` (tema 2) — Osmanlı Devleti’nin ordu, hukuk ve toprak sistemi ile devletleşme süreci arasındaki ilişkiyi çözümleyebilme  
  ↳ uygulama konusu: 2.3 Osmanlı Devleti'nde Ordu, Hukuk ve Toprak Sistemi
- `TAR.10.2.4` (tema 2) — Osmanlı Devleti’nin fethettiği topraklarda kalıcı olabilmek için izlediği politikaları sorgulayabilme  
  ↳ uygulama konusu: 2.1 Osmanlı Devleti'nin Kuruluşuna Dair Görüşler
- `TAR.10.2.5` (tema 2) — Osmanlı Devleti’nin ilim ve irfan geleneğinin oluşmasında şehir, kurum ve şahsiyetlerin etkilerine dair fikirler üretebilme  
  ↳ uygulama konusu: 2.5 Osmanlı Devleti'nin İlim ve İrfan Geleneği
- `TAR.10.3.1` (tema 3) — 1453-1683 yılları arasındaki siyasi ve askerî mücadelelerin Osmanlı Devleti’nin VE SÜREÇ BİLEŞENLERİ cihan devleti hâline gelmesindeki rolüne ilişkin özgün fikirler üretebilme  
  ↳ uygulama konusu: 3.1 Osmanlı Devleti'nin Cihan Devleti Hâline Gelmesi
- `TAR.10.3.2` (tema 3) — 1453-1683 yılları arasında Osmanlı Devleti’nin yönetim ve ordu yapısında meydana gelen değişim ve sürekliliğe ilişkin kaynakları yorumlayabilme  
  ↳ uygulama konusu: 3.2 Osmanlı Devleti'nin Yönetim ve Ordu Yapısında Değişim
- `TAR.10.3.3` (tema 3) — Avrupalıların sömürgeci politikalarının etkilerini tarihsel bağlamı içerisinde değerlendirebilme  
  ↳ uygulama konusu: 3.3 Avrupalıların Sömürgeci Politikaları
- `TAR.10.3.4` (tema 3) — 1453-1683 yılları arasında Osmanlı Devleti’nde gerçekleşen önemli isyanların neden ve sonuçlarını müzakere edebilme  
  ↳ uygulama konusu: 3.4 Osmanlı Devleti'nde İsyanlar
- `TAR.10.3.5` (tema 3) — 1453-1683 yılları arasında Osmanlı Devleti’nde bilim, kültür, eğitim ve sanat alanlarında ortaya çıkan gelişmelere ilişkin oluşturduğu özgün ürünleri paylaşabilme  
  ↳ uygulama konusu: 3.5 Osmanlı Devleti'nde Bilim, Kültür, Eğitim ve Sanat

**Coğrafya** (8)

- `COĞ.10.5.1` (tema 5) — Ekonomik faaliyetleri sektörlere göre sınıflandırabilme  
  ↳ uygulama konusu: 5.1 Ekonomik Faaliyetlerin Özellikleri
- `COĞ.10.5.2` (tema 5) — Ekonomik sektörlerin dağılımını gösteren tablo, grafik, şekil ve/veya diyagramlar üzerinden farklı gelişmişlik seviyesine sahip ülkeleri karşılaştırabilme  
  ↳ uygulama konusu: 5.2 Ekonomik Sektörler ve Gelişmişlik
- `COĞ.10.5.3` (tema 5) — Ekonomik sektörlerin Türkiye ekonomisindeki yeri ve önemini gösteren tablo, grafik, şekil ve/veya diyagram hazırlayabilme  
  ↳ uygulama konusu: 5.3 Türkiye Ekonomisinin Sektörel Dağılımı
- `COĞ.10.6.1` (tema 6) — Afetlerle mücadelede iyi uygulama örneklerini sorgulayabilme  
  ↳ uygulama konusu: (havuzda yok)
- `COĞ.10.6.2` (tema 6) — Afete dirençli yaşam alanlarının coğrafi koşullarını çözümleyebilme  
  ↳ uygulama konusu: 6.1 Afetlerle Mücadelede İyi Uygulama Örnekleri
- `COĞ.10.6.3` (tema 6) — Mekânın özelliklerine göre afetlerden korunma uygulamalarına karar verebilme  
  ↳ uygulama konusu: 6.1 Afetlerle Mücadelede İyi Uygulama Örnekleri
- `COĞ.10.6.4` (tema 6) — Afetlerden korunma amacı ile afet bilinci oluşturmanın faydalarını yansıtabilme  
  ↳ uygulama konusu: 6.1 Afetlerle Mücadelede İyi Uygulama Örnekleri
- `COĞ.10.7.1` (tema 7) — Türk dünyasının ortak kültürel özellikleri hakkında analojik çıkarım yapabilme  
  ↳ uygulama konusu: 7.1 Türk Kültürünün Mekânsal Özellikleri

**Felsefe** (5)

- `FEL.10.5.1` (tema 5) — Ahlak felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme  
  ↳ uygulama konusu: 5.1 Ahlak Felsefesinin Konusu ve Temel Kavramları
- `FEL.10.6.1` (tema 6) — Estetik ve sanat felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme  
  ↳ uygulama konusu: 6.1 Estetik ve Sanat Felsefesinin Konusu ve Temel Kavramları
- `FEL.10.7.1` (tema 7) — Siyaset felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme  
  ↳ uygulama konusu: 7.1 Siyaset Felsefesinin Konusu ve Temel Kavramları
- `FEL.10.8.1` (tema 8) — Din felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme  
  ↳ uygulama konusu: 8.1 Din Felsefesinin Konusu ve Temel Kavramları
- `FEL.10.9.1` (tema 9) — Bilim felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme  
  ↳ uygulama konusu: 9.1 Bilim Felsefesinin Konusu ve Temel Kavramları

**Din Kültürü** (10)

- `DKAB.10.3.2` (tema 3) — İslam’da adalet ve eşitlik kavramlarını bağlamına uygun kullanabilme  
  ↳ uygulama konusu: (havuzda yok)
- `DKAB.10.3.3` (tema 3) — İslam ve barış ilişkisini yorumlayabilme  
  ↳ uygulama konusu: (havuzda yok)
- `DKAB.10.3.4` (tema 3) — Nahl suresinin 90, Nisa suresinin 58 ve Bakara suresinin 208. ayetlerinin mesajlarını anlamak için Kur’an-ı Kerim meallerine başvurabilme  
  ↳ uygulama konusu: (havuzda yok)
- `DKAB.10.4.1` (tema 4) — İnsan, çevre ve ahlak arasındaki ilişkiyi yorumlayabilme  
  ↳ uygulama konusu: (havuzda yok)
- `DKAB.10.4.2` (tema 4) — Teknoloji ve ahlak ilişkisini çözümleyebilme  
  ↳ uygulama konusu: (havuzda yok)
- `DKAB.10.4.3` (tema 4) — Çevre ve teknoloji ilişkisini özetleyebilme  
  ↳ uygulama konusu: (havuzda yok)
- `DKAB.10.4.4` (tema 4) — Rum suresinin 41. ayetinin mesajlarını anlamak için Kur’an-ı Kerim meallerine başvurabilme  
  ↳ uygulama konusu: (havuzda yok)
- `DKAB.10.5.1` (tema 5) — Dinî yorum farklılıklarının ortaya çıkış sebeplerini sentezleyebilme  
  ↳ uygulama konusu: (havuzda yok)
- `DKAB.10.5.2` (tema 5) — İslam düşüncesindeki itikadi-siyasi ve fıkhi yorumları irdeleyebilme  
  ↳ uygulama konusu: (havuzda yok)
- `DKAB.10.5.3` (tema 5) — Hucurat suresinin 13. ayetinin mesajlarını anlamak için Kur’an’ı Kerim meallerine başvurabilme  
  ↳ uygulama konusu: (havuzda yok)

## 3. Uygulamada ne oluyor

Okulizyon'dan bir kazanım cümlesi geldiğinde sırayla:

1. **Cümle TYMM tablosunda birebir bulunur** → MEB kodu (`KİM.10.1.4` gibi) kesinleşir.
2. **Kod → ODSGM satırı** → ünite ve konu adı gelir (`ETKİLEŞİM` / `Kimyasal Tepkimeler`).
3. **Konu → soru havuzu** varsa uygulama konusu bağlanır; yoksa kayıt MEB'in kendi
   konu başlığıyla açılır (yanlış konuya yazılmaz, boş da bırakılmaz).

**Kritik bulgu:** Okulizyon ana çıktı cümlesini değil, onun **süreç bileşenlerini**
(a, b, c maddeleri) gönderiyor. Örnek: "İslam düşüncesinde bilginin yerini ve
kaynaklarını inceler." → `DKAB.10.1.1` a) maddesi. Bazen de doğrudan konu başlığı
("Sabit Hızlı Hareket"). Sistem bu üç biçimi de tanır:

| Gelen metin | Eşleme yolu |
|---|---|
| Resmî çıktı cümlesi | birebir / ODSGM varyantı |
| Süreç bileşeni (a,b,c) | birebir · önek · benzerlik (≥ .62, fark ≥ .08) |
| Konu başlığı | ODSGM konu adı |

Ölçüm: kullanıcının verdiği **36 gerçek Okulizyon metninin 36'sı** doğru koda gidiyor
(`tests/fixtures/okulizyon-kazanim-ornekleri.js`, her metnin beklenen kodu testte sabit).
Havuzdaki 992 kazanım metninden **%95,3**'ü konuya bağlanıyor.
ODSGM'de geçen kodların **79/79**'u TYMM tablosunda doğrulandı (İngilizce hariç, uygulamada yok).

## 4. Sınırlar (dürüstlük notu)

- **3 resmî cümlenin metni eksik** (PDF çıkarımında formül parçaları karıştı): `MAT.10.4.2`, `MAT.10.4.3`, `MAT.10.4.4`. Metin kanıtı olarak kullanılmadı.
- **ODSGM 1. dönem tablosudur.** 2. dönem konuları ve yıl sonu kapsamı burada yok.
- **Ünite/konu adları ODSGM'nin kendi yazımıyla** aktarıldı; düzeltilmedi.
- **Din Kültürü soru havuzu 2018 programına göre** kurulu. Kazanım artık 2026 koduyla
  ve 2026 konu başlığıyla kaydediliyor, ama o konuların soruları havuzda yok — havuz
  güncellenince kendiliğinden bağlanır. Bu bir eşleme eksiği değil, **havuz eksiği**.
- **İngilizce** ODSGM tablosunda var, uygulamada dersi/havuzu yok; yalnız bilgi olarak listelendi.

## 5. Yenileme

```bash
node scripts/odsgm-coz.js       # PDF → odsgm_konu_kazanim_10.json
node scripts/meb-kazanim-uret.js # konu eşlemesi + site/okz-meb.js
npm run rapor:meb                # bu dosya
npm run test:meb                 # kontroller
```
