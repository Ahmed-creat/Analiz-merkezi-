# 10. Sınıf — Tüm Derslerin Öğrenme Çıktıları ve Süreç Bileşenleri

> ## SÜRÜM 3
> **158 çıktı · 612 süreç · 1.686 soru · 1.686 flashcard · 44 tema**
>
> Bu blok güncellik damgasıdır. Dosyanın başında **SÜRÜM 3** yazmıyorsa
> elindeki kopya eskidir — yeniden indir.

> **Kaynak:** MEB Türkiye Yüzyılı Maarif Modeli (TYMM) 2026 öğretim programları.
> `node scripts/kazanim-dokumu.js` üretir; elle düzenlenmez.
> Ham veri: `site/content/mufredat/meb_kazanim_10.json`
> Eşlik eden talimat: `docs/uretim/SORU-URETIM-TALIMATI.md`

## Bu dosya nedir?

Dokuz dersin **10. sınıf** programındaki **158 öğrenme çıktısının** tamamı, **44 tema** ve
bu çıktıların **612 süreç bileşeni** burada eksiksiz listelenmiştir.

Her çıktının başlığı altında şu satır vardır:

```
Dosya: <konu_id>.json · konu_id: <ders>_10_t<tema>_c<sıra> · soru: N · flashcard: N · süreç: M
```

Bunlar soru üretecek ajanın iş emridir: hangi dosyayı açacağı, kaç soru ve kaç
flashcard yazacağı, soruları hangi süreç bileşenlerine dağıtacağı bu satırdan okunur.

Görsel için bu satırda sayı YOKTUR. Görsel, sorular yazıldıktan sonra soru bazında
tek tek kararlaştırılır (bkz. talimat §8).

**Hiçbir metin değiştirilmemiştir.** Kazanım cümleleri ve süreç bileşenleri resmî
programdan birebir alınmıştır (doğrulama: `npm run -s test:tymm` → 158/158 çıktı, 612/612 süreç).

## Özet

| Ders | Çıktı | Süreç | Soru | Flashcard |
| --- | --- | --- | --- | --- |
| Türk Dili ve Edebiyatı | 16 | 64 | **188** | 188 |
| Matematik | 21 | 123 | **274** | 274 |
| Fizik | 22 | 70 | **220** | 220 |
| Kimya | 21 | 69 | **214** | 214 |
| Biyoloji | 19 | 61 | **190** | 190 |
| Tarih | 14 | 49 | **140** | 140 |
| Coğrafya | 18 | 73 | **190** | 190 |
| Felsefe | 10 | 38 | **100** | 100 |
| Din Kültürü | 17 | 65 | **170** | 170 |
| **Toplam** | **158** | **612** | **1686** | **1686** |

**İki sayı kuralı:**

```
soru      = max(10, 2 × süreç bileşeni sayısı)   → taban 10, süreç çoksa artar
flashcard = soru sayısı                         → her soru için tam 1 kart
```

Flashcard istisnasız 1:1'dir. Mevcut 172 havuzun tamamı böyledir
(1956 soru / 1956 kart). Kart metni sorunun kendisinden bağımsız
yazılmaz; o sorunun öğrettiği tek şeyi sorar.

**Görsel için sayı yoktur.** Aynı çıktının soruları farklı ihtiyaç taşır:
"dik kenarları 7 ve 24 olan dik üçgende tan α" görsel ister,
"1 − cos²x kaçtır" istemez. Karar soru yazıldıktan sonra, soru bazında,
tek tek verilir — bkz. talimat §8.

## Kaynak belgeler

| Ders | Program (PID) | Kaynak adresi | sha256 |
| --- | --- | --- | --- |
| Türk Dili ve Edebiyatı | 2252 | `https://mufredat.meb.gov.tr/Dosyalar/2026518151228236-edebiyatd%C3%B6p.pdf` | `a04e1444eae5495ac9a4…` |
| Matematik | 2256 | `https://mufredat.meb.gov.tr/Dosyalar/2026518151640408-mated%C3%B6p.pdf` | `8e1b0c98f0e42b08b7ed…` |
| Fizik | 2254 | `https://mufredat.meb.gov.tr/Dosyalar/2026518151437471-fizikd%C3%B6p.pdf` | `119b158574ebc2a4b059…` |
| Kimya | 2255 | `https://mufredat.meb.gov.tr/Dosyalar/2026518151539674-kimya.pdf` | `8ebbc113d520eb118e25…` |
| Biyoloji | 2250 | `https://mufredat.meb.gov.tr/Dosyalar/202651815105221-biyolojid%C3%B6p.pdf` | `758809eb508d40e0ffea…` |
| Tarih | 2271 | `https://mufredat.meb.gov.tr/Dosyalar/2026691344767-tarihd%C3%B6p.pdf` | `19340c05d40256afd3e4…` |
| Coğrafya | 2251 | `https://mufredat.meb.gov.tr/Dosyalar/2026518151120283-cogd%C3%B6p.pdf` | `39aee8c83fb6775243ca…` |
| Felsefe | 2253 | `https://mufredat.meb.gov.tr/Dosyalar/2026518151339111-felsefed%C3%B6p.pdf` | `26ada7a42aea65c5e2b1…` |
| Din Kültürü | 2153 | `https://mufredat.meb.gov.tr/Dosyalar/2026313101155916-dkab912.pdf` | `c48c7083d24b106321ee…` |

---

## Türk Dili ve Edebiyatı

16 öğrenme çıktısı · 64 süreç bileşeni · 188 soru

| Tema | Ad | Çıktı | Soru |
| --- | --- | --- | --- |
| 1 | Sözün Ezgisi | 4 | 42 |
| 2 | Kelimelerin Ritmi | 4 | 42 |
| 3 | Dünden Bugüne | 4 | 52 |
| 4 | Nesillerin Mirası | 4 | 52 |

### Türk Dili ve Edebiyatı · Tema 1 — Sözün Ezgisi

#### `TDE1.1` — Dinlemeyi/İzlemeyi Yönetebilme

- **Dosya:** `edebiyat_10_t01_c01.json` · **konu_id:** `edebiyat_10_t01_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2

**Süreç bileşenleri:**

- TDE1.1.1. Seçim yapar.
- TDE1.1.2. İlişkiyi sürdürür.

#### `TDE1.2` — Anlam Oluşturabilme

- **Dosya:** `edebiyat_10_t01_c02.json` · **konu_id:** `edebiyat_10_t01_c02` · **soru:** 12 · **flashcard:** 12 · **süreç:** 6

**Süreç bileşenleri:**

- TDE1.2.1. Ön bilgilerle bağlantı kurar.
- TDE1.2.2. Tahmin eder.
- TDE1.2.3. Çıkarım yapar.
- TDE1.2.4. Karşılaştırır.
- TDE1.2.5. Sınıflandırır.
- TDE1.2.6. Tepki verir.

#### `TDE1.3` — Çözümleyebilme

- **Dosya:** `edebiyat_10_t01_c03.json` · **konu_id:** `edebiyat_10_t01_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2

**Süreç bileşenleri:**

- TDE1.3.1. Parçaları belirler.
- TDE1.3.2. Parçalar arasındaki ilişkileri belirler.

#### `TDE1.4` — Süreci Değerlendirebilme

- **Dosya:** `edebiyat_10_t01_c04.json` · **konu_id:** `edebiyat_10_t01_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2

**Süreç bileşenleri:**

- TDE1.4.1. Kendini değerlendirir.
- TDE1.4.2. Tepki ortaya koyar.

### Türk Dili ve Edebiyatı · Tema 2 — Kelimelerin Ritmi

#### `TDE2.1` — Okumayı Yönetebilme

- **Dosya:** `edebiyat_10_t02_c01.json` · **konu_id:** `edebiyat_10_t02_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** OKUMA • Tema içeriğine uygun bir koşuk • Ara Metin: Tema içeriğine uygun bir koşma • Tema içeriğine uygun bir türkü • Ara Metin: Tema içeriğine uygun bir ninni *(senaryo sayıları: —)*

**Süreç bileşenleri:**

- TDE2.1.1. İnceler ve görüş oluşturur.
- TDE2.1.2. Seçim yapar.

#### `TDE2.2` — Anlam Oluşturabilme

- **Dosya:** `edebiyat_10_t02_c02.json` · **konu_id:** `edebiyat_10_t02_c02` · **soru:** 12 · **flashcard:** 12 · **süreç:** 6
- **ODSGM sınav konusu:** OKUMA • Tema içeriğine uygun bir koşuk • Ara Metin: Tema içeriğine uygun bir koşma • Tema içeriğine uygun bir türkü • Ara Metin: Tema içeriğine uygun bir ninni *(senaryo sayıları: 1, 1, 1, 2)*

**Süreç bileşenleri:**

- TDE2.2.1. Ön bilgilerle bağlantı kurar.
- TDE2.2.2. Tahmin eder.
- TDE2.2.3. Çıkarım yapar.
- TDE2.2.4. Karşılaştırır.
- TDE2.2.5. Sınıflandırır.
- TDE2.2.6. Tepki verir.

#### `TDE2.3` — Çözümleyebilme

- **Dosya:** `edebiyat_10_t02_c03.json` · **konu_id:** `edebiyat_10_t02_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** OKUMA • Tema içeriğine uygun bir koşuk • Ara Metin: Tema içeriğine uygun bir koşma • Tema içeriğine uygun bir türkü • Ara Metin: Tema içeriğine uygun bir ninni *(senaryo sayıları: 1, 1)*

**Süreç bileşenleri:**

- TDE2.3.1. Nesne, olgu ve olaylara ilişkin parçaları belirler.
- TDE2.3.2. Parçalar arasındaki ilişkileri belirler.

#### `TDE2.4` — Süreci Değerlendirebilme

- **Dosya:** `edebiyat_10_t02_c04.json` · **konu_id:** `edebiyat_10_t02_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** OKUMA • Tema içeriğine uygun bir koşuk • Ara Metin: Tema içeriğine uygun bir koşma • Tema içeriğine uygun bir türkü • Ara Metin: Tema içeriğine uygun bir ninni *(senaryo sayıları: —)*

**Süreç bileşenleri:**

- TDE2.4.1. Kendini değerlendirir.
- TDE2.4.2. Tepki ortaya koyar.

### Türk Dili ve Edebiyatı · Tema 3 — Dünden Bugüne

#### `TDE3.1` — Konuşmayı Yönetebilme

- **Dosya:** `edebiyat_10_t03_c01.json` · **konu_id:** `edebiyat_10_t03_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2

**Süreç bileşenleri:**

- TDE3.1.1. Seçim yapar.
- TDE3.1.2. İlişkiyi sürdürür.

#### `TDE3.2` — İçerik Oluşturabilme

- **Dosya:** `edebiyat_10_t03_c02.json` · **konu_id:** `edebiyat_10_t03_c02` · **soru:** 18 · **flashcard:** 18 · **süreç:** 9

**Süreç bileşenleri:**

- TDE3.2.1. Ön bilgilerle bağlantı kurar.
- TDE3.2.2. Tahmin eder.
- TDE3.2.3. Karşılaştırır.
- TDE3.2.4. Sınıflandırır.
- TDE3.2.5. Yeniden ifade eder.
- TDE3.2.6. Tepki verir.
- TDE3.2.7. Sesle anlam oluşturur.
- TDE3.2.8. Görsel ögeleri kullanır.
- TDE3.2.9. Sunar.

#### `TDE3.3` — Kural Uygulayabilme

- **Dosya:** `edebiyat_10_t03_c03.json` · **konu_id:** `edebiyat_10_t03_c03` · **soru:** 14 · **flashcard:** 14 · **süreç:** 7

**Süreç bileşenleri:**

- TDE3.3.1. Plan hazırlar.
- TDE3.3.2. Düşünceyi geliştirme yollarını kullanır.
- TDE3.3.3. Uygun söz varlığı kullanır.
- TDE3.3.4. İletileri açık ve örtük biçimde ifade eder.
- TDE3.3.5. Türkçe dil yapılarını uygular.
- TDE3.3.6. Bağdaşıklık ögelerini kullanır.
- TDE3.3.7. Beden dilini ve mekânı kullanır.

#### `TDE3.4` — Süreci Değerlendirebilme

- **Dosya:** `edebiyat_10_t03_c04.json` · **konu_id:** `edebiyat_10_t03_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2

**Süreç bileşenleri:**

- TDE3.4.1. Kendini değerlendirir.
- TDE3.4.2. Tepki ortaya koyar.

### Türk Dili ve Edebiyatı · Tema 4 — Nesillerin Mirası

#### `TDE4.1` — Yazmayı Yönetebilme

- **Dosya:** `edebiyat_10_t04_c01.json` · **konu_id:** `edebiyat_10_t04_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** YAZMA • Dinlediği masalı film şeridi hâline getirebilme *(senaryo sayıları: —)*

**Süreç bileşenleri:**

- TDE4.1.1. Seçim yapar.
- TDE4.1.2. İlişkiyi sürdürür.

#### `TDE4.2` — İçerik Oluşturabilme

- **Dosya:** `edebiyat_10_t04_c02.json` · **konu_id:** `edebiyat_10_t04_c02` · **soru:** 16 · **flashcard:** 16 · **süreç:** 8
- **ODSGM sınav konusu:** YAZMA • Dinlediği masalı film şeridi hâline getirebilme *(senaryo sayıları: —)*

**Süreç bileşenleri:**

- TDE4.2.1. Ön bilgilerle bağlantı kurar.
- TDE4.2.2. Tahmin eder.
- TDE4.2.3. Karşılaştırır.
- TDE4.2.4. Sınıflandırır.
- TDE4.2.5. Yeniden ifade eder.
- TDE4.2.6. Tepki verir.
- TDE4.2.7. Görsel ögeleri kullanır.
- TDE4.2.8. Sunar.

#### `TDE4.3` — Kural Uygulayabilme

- **Dosya:** `edebiyat_10_t04_c03.json` · **konu_id:** `edebiyat_10_t04_c03` · **soru:** 16 · **flashcard:** 16 · **süreç:** 8
- **ODSGM sınav konusu:** YAZMA • Dinlediği masalı film şeridi hâline getirebilme *(senaryo sayıları: —)*

**Süreç bileşenleri:**

- TDE4.3.1. Plan hazırlar.
- TDE4.3.2. Düşünceyi geliştirme yollarını kullanır.
- TDE4.3.3. Uygun söz varlığı kullanır.
- TDE4.3.4. İletileri açık ve örtük biçimde ifade eder.
- TDE4.3.5. Türkçe dil yapılarını uygular.
- TDE4.3.6. Bağdaşıklık ögelerini kullanır.
- TDE4.3.7. Yazım kurallarını uygular.
- TDE4.3.8. Noktalama kurallarını uygular.

#### `TDE4.4` — Süreci Değerlendirebilme

- **Dosya:** `edebiyat_10_t04_c04.json` · **konu_id:** `edebiyat_10_t04_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** YAZMA • Dinlediği masalı film şeridi hâline getirebilme *(senaryo sayıları: —)*

**Süreç bileşenleri:**

- TDE4.4.1. Kendini değerlendirir.
- TDE4.4.2. Tepki ortaya koyar.

---

## Matematik

21 öğrenme çıktısı · 123 süreç bileşeni · 274 soru

| Tema | Ad | Çıktı | Soru |
| --- | --- | --- | --- |
| 1 | Geometrik Şekiller | 4 | 40 |
| 2 | İstatistiksel Araştırma Süreci | 2 | 26 |
| 3 | Sayılar | 3 | 38 |
| 4 | Nicelikler ve Değişimler | 6 | 100 |
| 5 | Sayma, Algoritma ve Bilişim | 2 | 30 |
| 6 | Analitik İnceleme | 2 | 20 |
| 7 | Veriden Olasılığa | 2 | 20 |

### Matematik · Tema 1 — Geometrik Şekiller

#### `MAT.10.1.1` — Dik üçgende trigonometrik oranlara (sinüs, kosinüs, tanjant, kotanjant) ve trigonometrik özdeşliklere ilişkin çıkarım yapabilme

- **Dosya:** `mat_10_t01_c01.json` · **konu_id:** `mat_10_t01_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5
- **ODSGM sınav konusu:** Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler *(senaryo sayıları: 2, 3, 3, 2, 2, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Dik üçgende trigonometrik oranlar ve trigonometrik özdeşliklerle ilgili varsayımlarda bulunur.
- b) Trigonometrik oranlar ve trigonometrik özdeşliklerle ilgili örüntüleri geneller.
- c) Trigonometrik oranlar ve trigonometrik özdeşliklerle ilgili elde ettiği genellemelerini varsayımlarıyla karşılaştırır.
- ç) Yaptığı karşılaştırmalardan dik üçgende trigonometrik oranlara ve trigonometrik özdeşliklere ilişkin önermeler sunar.
- d) Ulaştığı trigonometrik oranları ve trigonometrik özdeşlikleri problemler bağlamında değerlendirir.

#### `MAT.10.1.2` — Üçgenin yardımcı elemanlarının özellikleri ile ilgili çıkarım yapabilme

- **Dosya:** `mat_10_t01_c02.json` · **konu_id:** `mat_10_t01_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5
- **ODSGM sınav konusu:** Üçgende Yardımcı Elemanlar *(senaryo sayıları: 1, 1, 2, 2, 2, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Üçgende iç ve dış açıortayların, kenarortayların, kenar orta dikmelerin ve yüksekliklerin özelliklerine ilişkin varsayımda bulunur.
- b) Farklı üçgen örneklerini inceleyerek varsayımlarına ilişkin örüntüleri geneller.
- c) Üçgenin yardımcı elemanlarıyla ilgili genellemelerini varsayımlarıyla karşılaştırır.
- ç) Elde ettiği genellemelerden hareketle yardımcı elemanların özelliklerine ilişkin önermeler sunar.
- d) Üçgenin yardımcı elemanlarıyla ilgili önermeleri problemler bağlamında değerlendirir.

#### `MAT.10.1.3` — Üçgenin bir kenarı ve o kenara ait yüksekliğinin değişimine bağlı olarak alanının değişimine ilişkin çıkarım yapabilme

- **Dosya:** `mat_10_t01_c03.json` · **konu_id:** `mat_10_t01_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5
- **ODSGM sınav konusu:** Üçgenin Alanı *(senaryo sayıları: 1, 1, 1, 2, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Üçgenin bir kenarı ve o kenara ait yüksekliğindeki değişimin üçgenin alanındaki değişime etkisine dair varsayımlarda bulunur.
- b) Farklı üçgenlerdeki gözlemlerinden yararlanarak varsayımlarına yönelik örüntüleri geneller.
- c) Genellemelerini varsayımlarıyla karşılaştırır.
- ç) Elde ettiği genellemelerden üçgenin alanının hangi elemanlara göre değiştiğine ilişkin önermeler sunar.
- d) Önermeleri gerçek yaşam problemleri bağlamında değerlendirir.

#### `MAT.10.1.4` — Sinüs ve kosinüs teoremlerini doğrulayabilme veya ispatlayabilme

- **Dosya:** `mat_10_t01_c04.json` · **konu_id:** `mat_10_t01_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** Sinüs ve Kosinüs Teoremleri *(senaryo sayıları: 1, 1, 1, 2, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Üçgende sinüs ve kosinüs teoremlerine ilişkin farklı doğrulama veya ispatları kullanır.
- b) Yapılan doğrulama veya ispatları yeni durumlara uyarlayarak değerlendirir.

### Matematik · Tema 2 — İstatistiksel Araştırma Süreci

#### `MAT.10.2.1` — İki kategorik değişkenli veri ile çalışabilme ve iki kategorik değişken arasındaki ilişkililiğe dayalı karar verebilme

- **Dosya:** `mat_10_t02_c01.json` · **konu_id:** `mat_10_t02_c01` · **soru:** 16 · **flashcard:** 16 · **süreç:** 8
- **ODSGM sınav konusu:** İki Kategorik Değişkenli Veriler *(senaryo sayıları: 2, 1, 2, 1, 1, 1)*

**Süreç bileşenleri:**

- a) İki kategorik değişkenli veriye dayalı, istatistiksel araştırma gerektiren gerçek yaşam durumlarını belirler.
- b) Bağlam içerisinde iki kategorik değişken arasındaki ilişkililiğe odaklanan araştırma soruları oluşturur.
- c) İki kategorik değişkenli veri toplamak/elde etmek için plan yapar.
- ç) İki kategorik değişkenli verileri toplayarak/elde ederek analize hazırlar.
- d) Araştırma sorusu bağlamında toplanan/elde edilen iki kategorik değişkenli verileri analiz etmek için görselleştirme ve/veya özetleme (toplam satır veya sütunlardaki göreli sıklıkları gösteren iki yönlü tablo, koşullu göreli sıklıkları gösteren sütun grafikleri, koşullu göreli sıklıklar gibi) araçlarından uygun olanı seçer.
- e) Araştırma sorusu bağlamında toplanan/elde edilen verileri belirlediği araçlarla analiz eder.
- f) İki kategorik değişkenli veri dağılımlarına dayalı istatistiksel araştırmadan hareketle elde edilen bulguları yorumlayarak sonuç çıkarır.
- g) İki kategorik değişkenli veri dağılımlarına dayalı istatistiksel araştırmadan hareketle elde edilen sonuçları araştırma sorusu bağlamında değerlendirir.

#### `MAT.10.2.2` — Başkaları tarafından oluşturulan iki kategorik değişkenli verilerin ilişkililiğine dayalı istatistiksel sonuç veya yorumları tartışabilme

- **Dosya:** `mat_10_t02_c02.json` · **konu_id:** `mat_10_t02_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** Başkaları Tarafından Oluşturulan İki Kategorik Değişkenli Verileri İnceleme *(senaryo sayıları: 1, 1)*

**Süreç bileşenleri:**

- a) Başkaları tarafından oluşturulan iki kategorik değişkenli verilerin ilişkililiğine dayalı istatistiksel sonuç veya yorumlara yönelik istatistiksel temellendirme yapar.
- b) Başkaları tarafından oluşturulan iki kategorik değişkenli verilerin ilişkililiğine dayalı istatistiksel sonuç veya yorumlara yönelik hataları ya da yanlılıkları tespit eder.
- c) Başkaları tarafından oluşturulan iki kategorik değişkenli verilerin ilişkililiğine dayalı istatistiksel sonuç veya yorumları çürütür ya da kabul eder.

### Matematik · Tema 3 — Sayılar

#### `MAT.10.3.1` — Bir doğal sayı ile asal çarpanları ve bölenleri arasındaki ilişkilere dair çıkarım yapabilme

- **Dosya:** `mat_10_t03_c01.json` · **konu_id:** `mat_10_t03_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5
- **ODSGM sınav konusu:** Bir Doğal Sayının Asal Çarpanları, Bölenleri *(senaryo sayıları: 1, 1, 1, 2, 1)*

**Süreç bileşenleri:**

- a) Bir doğal sayının asal çarpanları ve bölenleri hakkında varsayımlarda bulunur.
- b) Farklı örneklerden elde ettiği örüntüleri listeleyerek bir doğal sayının asal çarpanları ve bölenleri hakkındaki varsayımlarına yönelik örüntüleri geneller.
- c) Oluşturduğu genellemelerin varsayımlarını karşılayıp karşılamadığını örneklerle sınar.
- ç) Bir doğal sayının asal çarpanları ve bölenleri ile ilgili ulaştığı sonuçlara yönelik matematiksel önermeler sunar.
- d) Elde ettiği önermelerin gerçek yaşam durumları içeren problemlerdeki kullanışlılığını değerlendirir.

#### `MAT.10.3.2` — Birden çok doğal sayının ortak bölenleriyle bunların en büyüğü ve ortak katlarıyla bunların en küçüğü arasındaki ilişkilere dair muhakeme yapabilme

- **Dosya:** `mat_10_t03_c02.json` · **konu_id:** `mat_10_t03_c02` · **soru:** 14 · **flashcard:** 14 · **süreç:** 7
- **ODSGM sınav konusu:** En Büyük Ortak Bölen, En Küçük Ortak Kat *(senaryo sayıları: 2, 2, 3, 1, 1)*

**Süreç bileşenleri:**

- a) Birden çok doğal sayının ortak bölenleriyle bunların en büyüğü ve ortak katlarıyla bunların en küçüğü arasındaki ilişkilere dair varsayımlarda bulunur.
- b) Farklı örneklerden elde ettiği örüntüleri listeleyerek varsayımlarına yönelik örüntüleri geneller.
- c) Oluşturduğu genellemelerin varsayımlarını karşılayıp karşılamadığını örneklerle sınar.
- ç) Birden çok doğal sayının ortak bölenleriyle bunların en büyüğü ve ortak katlarıyla bunların en küçüğü arasındaki ilişkilere dair elde ettiği genellemelere yönelik önermeler sunar.
- d) Sunduğu önermelerin gerçek yaşam durumları içeren problemlerdeki katkısını değerlendirir.
- e) Elde ettiği önermeler ile ilgili matematiksel doğrulama yöntemlerini seçer ve kullanır.
- f) Elde ettiği önermelere ilişkin uyguladığı matematiksel doğrulamayı kullanışlılığı açısından değerlendirir.

#### `MAT.10.3.3` — Bir doğal sayının belirli doğal sayılara bölümünden kalanlarına dair muhakeme yapabilme

- **Dosya:** `mat_10_t03_c03.json` · **konu_id:** `mat_10_t03_c03` · **soru:** 14 · **flashcard:** 14 · **süreç:** 7
- **ODSGM sınav konusu:** Bölünebilme *(senaryo sayıları: 2, 2, 1, 1, 1)*

**Süreç bileşenleri:**

- a) 2, 3, 4, 5, 9 ve 10 ile bölünebilme özelliklerinden hareketle bir doğal sayının 2, 3, 4, 5, 8, 9 ve 10 ile bölümünden elde edilecek kalanlara ilişkin varsayımlarda bulunur.
- b) Aynı sayı ile bölme işleminden elde edilecek kalanlara ilişkin farklı örneklerle ilgili örüntüleri listeleyerek varsayımlarına yönelik örüntüleri geneller.
- c) Oluşturduğu genellemenin kendi varsayımını karşılayıp karşılamadığını örneklerle sınar.
- ç) Ulaştığı sonuçlara yönelik matematiksel önermeleri doğrulayabileceği şekilde sunar.
- d) Ulaştığı önermelerin katkısını bu sayıların en küçük ortak katlarından oluşan sayılara bölümünden kalanı bulma bağlamında değerlendirir.
- e) Önermelere ilişkin matematiksel doğrulama yöntemlerini seçer ve kullanır.
- f) Önermelere ilişkin uyguladığı matematiksel doğrulama yöntemini kullanışlılığı açısından değerlendirir. 98

### Matematik · Tema 4 — Nicelikler ve Değişimler

#### `MAT.10.4.1` — Gerçek sayılarda fonksiyon olma şartları ile gerçek sayılarda tanımlı fonksiyonların nitel özelliklerini matematiksel temsillerle değerlendirebilme

- **Dosya:** `mat_10_t04_c01.json` · **konu_id:** `mat_10_t04_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** Gerçek Sayılarda Fonksiyon Olma Şartları *(senaryo sayıları: 1, 1, 2, 1)*

**Süreç bileşenleri:**

- a) Gerçek sayılarda fonksiyon olma şartları ile gerçek sayılarda tanımlı fonksiyonların nitel özelliklerini (tanım kümesi, görüntü kümesi, işareti, artanlığı-azalanlığı, maksimum-minimum noktaları, sıfırları, bire birliği, tekliği-çiftliği, örtenliği) grafik ve cebirsel temsilleri üzerinden analiz eder.
- b) Gerçek sayılarda tanımlı fonksiyonların grafik ve cebirsel temsillerini fonksiyon olma şartları ve fonksiyonların nitel özellikleri bakımından karşılaştırır.
- c) Karşılaştırmalarından hareketle gerçek sayılarda tanımlı fonksiyonların grafik ve

#### `MAT.10.4.2` — Gerçek sayılarda f(x) = x2 şeklinde tanımlı karesel referans fonksiyonun nitel cebirsel temsilleri ile nitel özellikleri hakkında yargıda bulunur. özellikleri ile bu fonksiyondan türetilen (g(x) = a ∙ f(x ±

- **Dosya:** `mat_10_t04_c02.json` · **konu_id:** `mat_10_t04_c02` · **soru:** 24 · **flashcard:** 24 · **süreç:** 12
- **ODSGM sınav konusu:** Karesel Fonksiyon ve Nitel Özellikleri *(senaryo sayıları: 1, 1)*

**Süreç bileşenleri:**

- r) ± k (a, r, k ∈ ℝ, a ≠ 0)) karesel fonksiyonların nitel özelliklerine ilişkin matematiksel muhakeme yapabilme
- a) Karesel referans fonksiyonun nitel özelliklerini (tanım kümesi, görüntü kümesi, işareti, artanlığı-azalanlığı, maksimum-minimum noktaları, sıfırları, bire birliği, tekliği-çiftliği, örtenliği) matematiksel temsilleri kullanarak belirler.
- b) Karesel referans fonksiyonun nitel özellikleri ile matematiksel temsilleri arasındaki ilişkileri belirler.
- c) Karesel referans fonksiyonu grafik ve cebirsel temsili üzerinde yapılan işlemlerle diğer karesel fonksiyonlara dönüştürür.
- ç) Karesel referans fonksiyon ile elde ettiği karesel fonksiyonların grafik ve cebirsel temsilleri arasındaki ilişkiyi ifade eder.
- d) Karesel referans fonksiyonun nitel özelliklerinden hareketle diğer karesel fonksiyonların nitel özellikleri hakkında varsayımlarda bulunur.
- e) Varsayımlarına dayalı olarak karesel fonksiyonların nitel özelliklerine ilişkin örüntüleri (cebirsel, sayısal veya grafiksel) geneller.
- f) Genellemelerinin varsayımlarını karşılayıp karşılamadığını kontrol eder.
- g) Genellemelerinden elde ettiği önermeleri uygun sözel veya cebirsel dil ile sunar.
- ğ) Elde ettiği önermelerin gerçek yaşam bağlamlarındaki kullanışlılığını değerlendirir.
- h) Önermelerini grafiksel olarak doğrular veya cebirsel olarak ispatlar.
- ı) Uyguladığı doğrulama veya ispat yöntemlerinin farklı durumlardaki kullanışlılığını değerlendirir.

#### `MAT.10.4.3` — Gerçek sayılarda f(x) = x (x ≥ 0) şeklinde tanımlı karekök referans fonksiyonun nitel özellikleri ile bu fonksiyondan türetilen (g(x) = a ∙ f(x ±

- **Dosya:** `mat_10_t04_c03.json` · **konu_id:** `mat_10_t04_c03` · **soru:** 12 · **flashcard:** 12 · **süreç:** 6
- **ODSGM sınav konusu:** Karekök Fonksiyonu ve Nitel Özellikleri *(senaryo sayıları: —)*

**Süreç bileşenleri:**

- r) ± k (a, r, k ∈ ℝ, a ≠ 0)) karekök fonksiyonlarının nitel özelliklerine ilişkin matematiksel muhakeme yapabilme
- a) Karekök referans fonksiyonun nitel özelliklerini (tanım kümesi, görüntü kümesi, işareti, artanlığı-azalanlığı, maksimum-minimum noktaları, sıfırları, bire birliği, tekliği-çiftliği, örtenliği) matematiksel temsilleri kullanarak belirler.
- b) Karekök referans fonksiyonun nitel özellikleri ile matematiksel temsilleri arasındaki ilişkileri belirler.
- c) Karekök referans fonksiyonu grafik ve cebirsel temsili üzerinde yapılan işlemlerle diğer karekök fonksiyonlarına dönüştürür.
- ç) Karekök referans fonksiyon ile elde ettiği karekök fonksiyonlarının grafik ve cebirsel temsilleri arasındaki ilişkiyi ifade eder.
- d) Karekök referans fonksiyonun nitel özelliklerinden hareketle diğer karekök fonksiyonlarının nitel özellikleri hakkında varsayımlarda bulunur. 104

#### `MAT.10.4.4` — Gerçek sayılarda f(x) = 1 x (x ≠ 0) şeklinde tanımlı rasyonel referans fonksiyonun lendirir. nitel özellikleri ile bu fonksiyondan türetilen (g(x) = a ∙ f(x ±

- **Dosya:** `mat_10_t04_c04.json` · **konu_id:** `mat_10_t04_c04` · **soru:** 24 · **flashcard:** 24 · **süreç:** 12

**Süreç bileşenleri:**

- r) ± k (a, r, k ∈ ℝ, a ≠ 0)) rasyonel fonksiyonların nitel özelliklerine ilişkin matematiksel muhakeme yapabilme
- a) Rasyonel referans fonksiyonun nitel özelliklerini (tanım kümesi, görüntü kümesi, işareti, artanlığı-azalanlığı, maksimum-minimum noktaları, sıfırları, bire birliği, tekliği-çiftliği, örtenliği) matematiksel temsilleri kullanarak belirler.
- b) Rasyonel referans fonksiyonun nitel özellikleri ile matematiksel temsilleri arasındaki ilişkileri belirler.
- c) Rasyonel referans fonksiyonu grafik ve cebirsel temsili üzerinde yapılan işlemlerle diğer rasyonel fonksiyonlara dönüştürür.
- ç) Rasyonel referans fonksiyon ile elde ettiği rasyonel fonksiyonların grafik ve cebirsel temsilleri arasındaki ilişkiyi ifade eder.
- d) Rasyonel referans fonksiyonun nitel özelliklerinden hareketle diğer rasyonel fonksiyonların nitel özellikleri hakkında varsayımlarda bulunur.
- e) Varsayımlarına dayalı olarak rasyonel fonksiyonların nitel özelliklerine ilişkin örüntüleri (cebirsel, sayısal veya grafiksel) geneller.
- f) Genellemelerinin varsayımlarını karşılayıp karşılamadığını kontrol eder.
- g) Genellemelerinden elde ettiği önermeleri uygun sözel veya cebirsel dil ile sunar.
- ğ) Elde ettiği önermelerin gerçek yaşam bağlamlarındaki kullanışlılığını değerlendirir.
- h) Önermelerini grafiksel olarak doğrular veya cebirsel olarak ispatlar.
- ı) Uyguladığı doğrulama veya ispat yöntemlerinin farklı durumlardaki kullanışlılığını değerlendirir.

#### `MAT.10.4.5` — Doğrusal, karesel, karekök ve rasyonel referans fonksiyonlar ile bu fonksiyonlardan türetilebilen fonksiyonların ters fonksiyonlarına dair çıkarım yapabilme

- **Dosya:** `mat_10_t04_c05.json` · **konu_id:** `mat_10_t04_c05` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5

**Süreç bileşenleri:**

- a) Referans fonksiyonlar ve bunlardan türetilebilen fonksiyonlar üzerinden bir fonksiyonun ters fonksiyonuna ilişkin varsayımlarda bulunur.
- b) Varsayımlarından yararlanıp farklı durumlarla ilgili örüntüleri listeleyerek referans fonksiyonlar ve bunlardan türetilen fonksiyonların ters fonksiyonlarına ilişkin genellemeler yapar.
- c) Referans fonksiyonlar ve bunlardan türetilen fonksiyonların ters fonksiyonlarıyla ilişkisine dair varsayımları ile genellemelerini karşılaştırır.
- ç) Referans fonksiyonlar ve bunlardan türetilen fonksiyonların ters fonksiyon ilişkisine ait önermeleri matematiksel olarak doğrulanabilecek şekilde sunar.
- d) Referans fonksiyonlar ve bunlardan türetilen fonksiyonların ters fonksiyonlarına ait elde edilen önermeleri fonksiyonların nitel özellikleri bağlamında değerlendirir. 105

#### `MAT.10.4.6` — Doğrusal, karesel, karekök, rasyonel referans fonksiyonlar ve bunlardan türetilen fonksiyonlarla ifade edilebilen denklem ve eşitsizlikler içeren problemleri çözebilme

- **Dosya:** `mat_10_t04_c06.json` · **konu_id:** `mat_10_t04_c06` · **soru:** 20 · **flashcard:** 20 · **süreç:** 10

**Süreç bileşenleri:**

- a) Bu fonksiyonlarla ifade edilebilen denklem ve eşitsizliklere ilişkin matematiksel bileşenleri (nitel özellikleri ile cebirsel ve grafik temsilleri) belirler.
- b) Bu fonksiyonlarla ifade edilebilen denklem ve eşitsizliklere ilişkin matematiksel bileşenlerin aralarındaki ilişkileri belirler.
- c) Bu fonksiyonlarla ifade edilebilen denklem ve eşitsizliklerin problem bağlamındaki temsillerini farklı temsillere dönüştürür.
- ç) Dönüştürdüğü temsillerin problem bağlamındaki anlamını ifade eder.
- d) Elde ettiği ve yorumladığı farklı temsillerden yararlanarak problemin çözümü için strateji oluşturur.
- e) Belirlediği stratejiyi kullanır.
- f) Elde ettiği çözümü farklı yöntemleri kullanarak doğrular.
- g) Problemin olası çözüm stratejilerini gözden geçirir.
- ğ) Problemin olası çözüm stratejilerinin farklı problem durumlarında kullanımı ile ilgili çıkarımlar yapar.
- h) Çıkarımlarının geçerliliğini sözel, cebirsel ve grafiksel argümanlarla değerlendirir.

### Matematik · Tema 5 — Sayma, Algoritma ve Bilişim

#### `MAT.10.5.1` — Sayma stratejileri kullanarak problem çözebilme

- **Dosya:** `mat_10_t05_c01.json` · **konu_id:** `mat_10_t05_c01` · **soru:** 20 · **flashcard:** 20 · **süreç:** 10

**Süreç bileşenleri:**

- a) Verilen sayma problemindeki sayılacak nesneleri belirler.
- b) Sayma problemlerinde yer alan nesneler arasındaki ilişkileri belirler.
- c) Problem durumlarındaki sözel ifadeleri görsel temsillere dönüştürür.
- ç) Problem durumlarını onlara eş olan başka problem durumlarıyla ya da uygun görsel, tablo veya cebirsel temsillerle yeniden ifade eder.
- d) Sayma problemlerindeki farklı durumlara uygun çözüm stratejisi oluşturur.
- e) Seçtiği çözüm stratejisini kullanır.
- f) Seçtiği çözüm stratejisini kontrol eder.
- g) Sayma problemlerindeki olası çözüm stratejilerini gözden geçirir.
- ğ) Sayma problemlerinde çözüme ulaştıran stratejilere yönelik çıkarımlar yapar.
- h) Sayma problemlerinde çözüme ulaştıran stratejilere yönelik çıkarımları değerlendirir.

#### `MAT.10.5.2` — Cebirsel ve fonksiyonel işlemleri algoritmik bir dille yapılandırabilme

- **Dosya:** `mat_10_t05_c02.json` · **konu_id:** `mat_10_t05_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2

**Süreç bileşenleri:**

- a) Karşılaşılan problem durumlarındaki cebirsel ve fonksiyonel işlemlerin algoritmik yapısını ortaya koyar.
- b) Ön bilgilerini kullanarak cebirsel ve fonksiyonel yapılar ile bu yapıların algoritmaları arasında uyumlu bir bütün oluşturur.

### Matematik · Tema 6 — Analitik İnceleme

#### `MAT.10.6.1` — Dik koordinat sisteminde iki nokta arasındaki uzaklık ve bir doğru parçasını belli oranda bölen noktanın koordinatlarıyla ilgili çıkarım yapabilme

- **Dosya:** `mat_10_t06_c01.json` · **konu_id:** `mat_10_t06_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5

**Süreç bileşenleri:**

- a) Dik koordinat sisteminde iki nokta arasındaki uzaklık bağıntısı ve bir doğru parçasını belli oranda bölen noktanın koordinatlarıyla ilgili varsayımda bulunur.
- b) Farklı örnekler üzerinden varsayımlarına yönelik örüntüleri geneller.
- c) İki nokta arasındaki uzaklık bağıntısına ve bir doğru parçasını belli oranda bölen noktanın koordinatlarına ilişkin genellemeleri ile varsayımlarını karşılaştırır.
- ç) İki nokta arasındaki uzaklık bağıntısına ve bir doğru parçasını belli oranda bölen noktanın koordinatlarına yönelik önermeler sunar.
- d) Önermeleri gerçek yaşam problemleri bağlamında değerlendirir.

#### `MAT.10.6.2` — Dik koordinat sistemini doğrunun özelliklerini incelemek ve doğru ile ilgili problemleri çözebilmek için uygun bir temsil aracı olarak kullanabilme

- **Dosya:** `mat_10_t06_c02.json` · **konu_id:** `mat_10_t06_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Dik koordinat sistemini doğrunun eğim açısını, eğimini ve doğruların birbirlerine göre konumlarını belirlemede araç olarak tanır.
- b) Karşılaştığı problem durumlarında dik koordinat sistemini doğrunun eğim açısını, eğimini ve doğruların birbirlerine göre konumlarını belirlemede uygun bir temsil aracı olarak seçer.
- c) Dik koordinat sistemini doğrunun eğim açısını, eğimini ve doğruların birbirlerine göre konumlarını temsil etme aracı olarak kullanır.

### Matematik · Tema 7 — Veriden Olasılığa

#### `MAT.10.7.1` — Koşullu olasılık ile çıkarım yapabilme

- **Dosya:** `mat_10_t07_c01.json` · **konu_id:** `mat_10_t07_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5

**Süreç bileşenleri:**

- a) Bir olayın gerçekleşmesinin diğer bir olayın meydana gelmesine bağlı olduğu durumlara ilişkin mevcut olasılık bilgisini kullanarak varsayımda bulunur.
- b) Bir olayın gerçekleşmesinin diğer bir olayın meydana gelmesine bağlı olduğu gerçek yaşam durumlarına ilişkin olası tüm çıktıları listeler.
- c) Bir olayın gerçekleşmesinin diğer bir olayın meydana gelmesine bağlı olduğu ya da olmadığı durumlarda olası tüm çıktıların sayısı ile istenen durumların sayısını karşılaştırır.
- ç) Bir olayın gerçekleşmesinin diğer bir olayın meydana gelmesine bağlı olduğu durumların olasılığını hesaplamaya yönelik matematiksel önerme sunar.
- d) Bir olayın gerçekleşmesinin diğer bir olayın meydana gelmesine bağlı olduğu ya da olmadığı gerçek yaşam durumlarının olasılığını koşullu olasılık ile değerlendirir.

#### `MAT.10.7.2` — Bir olayın gerçekleşmesinin diğer bir olayın meydana gelmesine bağlı olduğu durumların olasılığını mevcut bilgiye/veriye dayalı tahmin edebilme

- **Dosya:** `mat_10_t07_c02.json` · **konu_id:** `mat_10_t07_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Bayes teoreminin kullanıldığı gerçek yaşam durumlarına ilişkin mevcut bilgileri kullanır.
- b) Mevcut bilgileri kullanarak Bayes teoremine dayalı hesaplama yapar.
- c) Bayes teoreminin kullanıldığı gerçek yaşam durumlarına ilişkin ileriye yönelik yargıda bulunur.

---

## Fizik

22 öğrenme çıktısı · 70 süreç bileşeni · 220 soru

| Tema | Ad | Çıktı | Soru |
| --- | --- | --- | --- |
| 1 | Kuvvet ve Hareket | 3 | 30 |
| 2 | Enerji | 5 | 50 |
| 3 | Elektrik | 7 | 70 |
| 4 | Dalgalar | 7 | 70 |

### Fizik · Tema 1 — Kuvvet ve Hareket

#### `FİZ.10.1.1` — Yatay doğrultuda sabit hızlı hareket ile ilgili tümevarımsal akıl yürütebilme

- **Dosya:** `fiz_10_t01_c01.json` · **konu_id:** `fiz_10_t01_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** Sabit Hızlı Hareket *(senaryo sayıları: 3, 3, 2, 2, 1, 1)*

**Süreç bileşenleri:**

- a) Yatay doğrultuda sabit hızlı hareket eden cisimlerin konum, yer değiştirme, hız ve zaman değişkenlerine yönelik gözlemler yapar.
- b) Yatay doğrultuda sabit hızlı hareket eden cisimlerin hareket grafiklerinden yararlanarak hız, sürat, yer değiştirme ve alınan yol değişkenlerinin matematiksel modelini bulur.
- c) Yatay doğrultuda sabit hızlı hareket eden cisimlerin hız, sürat, yer değiştirme ve alınan yol değişkenlerine ilişkin matematiksel modelleri geneller.

#### `FİZ.10.1.2` — İvme ve hız değişimi arasındaki ilişkiye yönelik tümevarımsal akıl yürütebilme

- **Dosya:** `fiz_10_t01_c02.json` · **konu_id:** `fiz_10_t01_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** Bir Boyutta Sabit İvmeli Hareket *(senaryo sayıları: 2, 3, 3, 3, 1, 1, 1)*

**Süreç bileşenleri:**

- a) İvme ve hız değişimi arasındaki ilişkiyi keşfeder.
- b) İvme ve hız değişimi arasındaki ilişkiyi geneller.

#### `FİZ.10.1.3` — Yatay doğrultuda sabit ivmeyle hareket eden cisimlerin hareket grafiklerinden elde edilen matematiksel modelleri yorumlayabilme

- **Dosya:** `fiz_10_t01_c03.json` · **konu_id:** `fiz_10_t01_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** Bir Boyutta Sabit İvmeli Hareket *(senaryo sayıları: 2, 1, 2, 1, 1)*

**Süreç bileşenleri:**

- a) Yatay doğrultuda sabit ivmeli hareket grafiklerini inceler.
- b) Yatay doğrultuda sabit ivmeli hareket grafiklerini birbirine dönüştürerek matematiksel modellere ulaşır.
- c) Yatay doğrultuda sabit ivmeyle hareket eden cisimlerin hareketine ilişkin grafikleri ve matematiksel modeller arasındaki ilişkiyi kendi cümleleriyle yeniden ifade eder.

### Fizik · Tema 2 — Enerji

#### `FİZ.10.2.1` — Kuvvet-yer değiştirme grafiği kullanılarak iş ile ilgili tümevarımsal akıl yürütebilme

- **Dosya:** `fiz_10_t02_c01.json` · **konu_id:** `fiz_10_t02_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** İş, Enerji ve Güç *(senaryo sayıları: 1, 1, 2, 2, 2)*

**Süreç bileşenleri:**

- a) Kuvvet, yer değiştirme ve iş arasındaki ilişkiyi matematiksel olarak modeller.
- b) Kuvvet, yer değiştirme ve iş arasındaki ilişki hakkında genelleme yapar.

#### `FİZ.10.2.2` — İş, enerji ve güç kavramlarına ilişkin çıkarım yapabilme

- **Dosya:** `fiz_10_t02_c02.json` · **konu_id:** `fiz_10_t02_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5
- **ODSGM sınav konusu:** İş, Enerji ve Güç *(senaryo sayıları: 1, 2, 2, 2, 2)*

**Süreç bileşenleri:**

- a) İş, enerji ve güç kavramları hakkında mevcut bilgisi dâhilinde hipotez kurar.
- b) İş, enerji ve güç kavramlarına yönelik ilişkileri listeler.
- c) İş, enerji ve güç kavramlarını karşılaştırır.
- ç) İş ve güç kavramları arasındaki ilişkiye yönelik önermelerde bulunur.
- d) Önermelerini matematiksel modele dönüştürerek değerlendirir.

#### `FİZ.10.2.3` — Enerji biçimlerini karşılaştırabilme

- **Dosya:** `fiz_10_t02_c03.json` · **konu_id:** `fiz_10_t02_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** Enerji Biçimleri *(senaryo sayıları: 1, 1, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Enerji biçimlerine ilişkin özellikleri belirler.
- b) Enerji biçimlerine ilişkin benzerlikleri listeler.
- c) Enerji biçimlerine ilişkin farklılıkları listeler.

#### `FİZ.10.2.4` — Mekanik enerjiyi çözümleyebilme

- **Dosya:** `fiz_10_t02_c04.json` · **konu_id:** `fiz_10_t02_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** Mekanik Enerji *(senaryo sayıları: 1, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Mekanik enerjiye ilişkin bileşenleri belirler.
- b) Mekanik enerjiyle ilgili bileşenler arasındaki matematiksel ilişkiyi belirler.

#### `FİZ.10.2.5` — Yenilenebilen ve yenilenemeyen enerji kaynaklarını karşılaştırabilme

- **Dosya:** `fiz_10_t02_c05.json` · **konu_id:** `fiz_10_t02_c05` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** Enerji Kaynakları *(senaryo sayıları: 1, 1, 1)*

**Süreç bileşenleri:**

- a) Yenilenebilen ve yenilenemeyen enerji kaynaklarına ilişkin özellikleri belirler.
- b) Yenilenebilen ve yenilenemeyen enerji kaynaklarının avantajlarını listeler.
- c) Yenilenebilen ve yenilenemeyen enerji kaynaklarının dezavantajlarını listeler.

### Fizik · Tema 3 — Elektrik

#### `FİZ.10.3.1` — Basit elektrik devresinde potansiyel fark, elektrik akımı ve direnç kavramlarının tanımına ilişkin analojik akıl yürütebilme

- **Dosya:** `fiz_10_t03_c01.json` · **konu_id:** `fiz_10_t03_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Basit elektrik devresi ile su tesisatının bileşenlerini gözlemler.
- b) Basit elektrik devresi ile su tesisatının bileşenleri arasındaki benzerlikleri ve farklılıkları tespit eder.
- c) Benzerliklere dayalı olarak basit elektrik devresindeki potansiyel fark, elektrik akımı ve direncin tanımı hakkında çıkarım yapar.

#### `FİZ.10.3.2` — Elektrik yükünün hareketi üzerinden elektrik akımı kavramını çözümleyebilme

- **Dosya:** `fiz_10_t03_c02.json` · **konu_id:** `fiz_10_t03_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2

**Süreç bileşenleri:**

- a) Bir iletkende elektrik akımı oluşması ile ilgili değişkenleri belirler.
- b) Elektrik akımını oluşturan değişkenler arasındaki ilişkiyi belirler.

#### `FİZ.10.3.3` — Ohm Yasası ile ilgili tümevarımsal akıl yürütebilme

- **Dosya:** `fiz_10_t03_c03.json` · **konu_id:** `fiz_10_t03_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2

**Süreç bileşenleri:**

- a) Elektrik akımı, direnç ve potansiyel fark arasındaki ilişkiyi deney yoluyla keşfederek Ohm Yasası'nın matematiksel modeline ulaşır.
- b) Ohm Yasası'nın matematiksel modeli üzerinden genelleme yapar.

#### `FİZ.10.3.4` — Dirençlerin bağlanma türüne göre eşdeğer dirence ilişkin bilimsel çıkarım yapabilme

- **Dosya:** `fiz_10_t03_c04.json` · **konu_id:** `fiz_10_t03_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Dirençlerin seri, paralel ve birleşik bağlanma türlerini tanımlar.
- b) Dirençlerin seri, paralel ve birleşik bağlanması ile eşdeğer direnç arasındaki ilişkiyi belirlemek üzere veri toplar ve kaydeder.
- c) Elde ettiği verileri yorumlayarak ulaştığı çıkarımları matematiksel modellemeleri kullanarak test eder.

#### `FİZ.10.3.5` — Üreteçlerin bağlanma türüne göre devreye sağladıkları potansiyel farka ilişkin bilimsel çıkarım yapabilme

- **Dosya:** `fiz_10_t03_c05.json` · **konu_id:** `fiz_10_t03_c05` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Üreteçlerin seri ve paralel bağlanma türlerini tanımlar.
- b) Üreteçlerin seri ve paralel bağlanması durumunda devrenin potansiyel fark, ana kol akımı ve üreteçlerin tükenme süreleri arasındaki ilişkiyi belirlemek üzere veri toplayarak kaydeder.
- c) Elde ettiği verileri yorumlayarak değerlendirir.

#### `FİZ.10.3.6` — Elektrik akımının oluşturabileceği tehlikelere karşı alınması gereken önlemlerle ilgili bilgi toplayabilme

- **Dosya:** `fiz_10_t03_c06.json` · **konu_id:** `fiz_10_t03_c06` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4

**Süreç bileşenleri:**

- a) Elektrik akımının oluşturabileceği tehlikelere karşı alınması gereken önlemlere ilişkin bilgiye ulaşmak için kullanacağı araçları belirler.
- b) Belirlediği aracı kullanarak elektrik akımının oluşturabileceği tehlikelere karşı alınması gereken önlemler ile ilgili bilgileri bulur.
- c) Elektrik akımının oluşturabileceği tehlikelere karşı alınması gereken önlemler hakkında ulaşılan bilgileri doğrular.
- ç) Elektrik akımının oluşturabileceği tehlikelere karşı alınması gereken önlemler hakkındaki ulaştığı bilgileri kaydeder.

#### `FİZ.10.3.7` — Topraklama olayının önemini sorgulayabilme

- **Dosya:** `fiz_10_t03_c07.json` · **konu_id:** `fiz_10_t03_c07` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5

**Süreç bileşenleri:**

- a) Topraklama olayını tanımlar.
- b) Topraklama olayıyla ilgili sorular sorar.
- c) Topraklama olayı hakkında bilgi toplar.
- ç) Topraklama olayı ile ilgili topladığı bilgilerin doğru olup olmadığını değerlendirir.
- d) Topraklama olayının önemi hakkında çıkarım yapar.

### Fizik · Tema 4 — Dalgalar

#### `FİZ.10.4.1` — Periyodik hareketlere ilişkin deneyimlerini yansıtabilme

- **Dosya:** `fiz_10_t04_c01.json` · **konu_id:** `fiz_10_t04_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Periyodik hareketlere ilişkin deneyimlerini gözden geçirir.
- b) Periyodik hareketlere ilişkin deneyimlerinden çıkarım yapar.
- c) Periyodik hareketlere ilişkin deneyimlerinden ulaştığı çıkarımı değerlendirir.

#### `FİZ.10.4.2` — Dalgaların temel kavramlarına ilişkin operasyonel tanımlama yapabilme

- **Dosya:** `fiz_10_t04_c02.json` · **konu_id:** `fiz_10_t04_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Dalgaların temel kavramlarına ilişkin nitelikleri tanımlar.
- b) Dalgaların temel kavramlarına ilişkin niteliklerin ölçümünü yapar.
- c) Dalgaların temel kavramlarını niteliklerine bağlı olarak tanımlar.

#### `FİZ.10.4.3` — Dalgaları özelliklerine göre sınıflandırabilme

- **Dosya:** `fiz_10_t04_c03.json` · **konu_id:** `fiz_10_t04_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4

**Süreç bileşenleri:**

- a) Dalgaların özelliklerini belirler.
- b) Dalgaları titreşim doğrultusu ve taşıdığı enerjiye göre ayrıştırır.
- c) Dalgaları titreşim doğrultusu ve taşıdığı enerjiye göre gruplandırır.
- ç) Dalgaları enine, boyuna, hem enine hem boyuna, mekanik ve elektromanyetik olarak adlandırır.

#### `FİZ.10.4.4` — Dalgaların yayılma süratini etkileyen etmenlere ilişkin bilimsel gözleme dayalı tahmin yapabilme

- **Dosya:** `fiz_10_t04_c04.json` · **konu_id:** `fiz_10_t04_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5

**Süreç bileşenleri:**

- a) Dalgaların yayılma süratine etki eden etmenleri tahmin eder.
- b) Dalgaların farklı ortamlardaki yayılma süratini karşılaştırır.
- c) Dalgaların farklı ortamlardaki yayılma süratlerine ilişkin sonuç çıkarır.
- ç) Elektromanyetik dalgaların yayılma sürati ile ilgili tahminlerde bulunur.
- d) Elektromanyetik dalgaların yayılma sürati ile ilgili tahminlerinin geçerliliğini sorgular.

#### `FİZ.10.4.5` — Su dalgalarında yansıma ve kırılma ile ilgili tümevarımsal akıl yürütebilme

- **Dosya:** `fiz_10_t04_c05.json` · **konu_id:** `fiz_10_t04_c05` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Su dalgalarında yansıma ve kırılma olaylarına ilişkin gözlemler yapar.
- b) Su dalgalarında yansıma ve kırılma olayları sırasındaki açılar arasında ilişki kurar.
- c) Su dalgalarında yansıma ve kırılma olaylarına ilişkin genellemeler yapar.

#### `FİZ.10.4.6` — Rezonans ve depreme ilişkin kavramlar üzerinden depremi sorgulayabilme

- **Dosya:** `fiz_10_t04_c06.json` · **konu_id:** `fiz_10_t04_c06` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5

**Süreç bileşenleri:**

- a) Rezonans ve depremle ilişkili olan kavramları tanımlar.
- b) Rezonans ve depremle ilişkili olan kavramlar ile ilgili sorular sorar.
- c) Rezonans ve depremle ilişkili olan kavramlar hakkında bilgi toplar.
- ç) Rezonans ve depremle ilişkili olan kavramlar ile ilgili toplanan bilgilerin doğru olup olmadığını değerlendirir.
- d) Rezonans ve depreme ilişkin kavramlar üzerinden depreme yönelik çıkarımlar yapar.

#### `FİZ.10.4.7` — Depremle ilgili bilimsel model oluşturabilme

- **Dosya:** `fiz_10_t04_c07.json` · **konu_id:** `fiz_10_t04_c07` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2

**Süreç bileşenleri:**

- a) Depremle ilgili bir model önerir.
- b) Depremle ilgili önerilen modeli geliştirir.

---

## Kimya

21 öğrenme çıktısı · 69 süreç bileşeni · 214 soru

| Tema | Ad | Çıktı | Soru |
| --- | --- | --- | --- |
| 1 | Etkileşim | 11 | 114 |
| 2 | Çeşitlilik | 8 | 80 |
| 3 | Sürdürülebilirlik | 2 | 20 |

### Kimya · Tema 1 — Etkileşim

#### `KİM.10.1.1` — Kimyasal değişimlere ilişkin kanıtları belirlemeye yönelik bilimsel gözlem yapabilme

- **Dosya:** `kim_10_t01_c01.json` · **konu_id:** `kim_10_t01_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** Kimyasal Tepkimeler *(senaryo sayıları: 1, 1, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Kimyasal değişimlerin gözlemlenebilir göstergelerini (enerji değişimi, gaz çıkışı, renk değişimi veya yeni bir katının oluşumu) tanımlar.
- b) Kimyasal değişimlerin gözlemlenebilir göstergelerine ilişkin veri toplar ve kaydeder.
- c) Kimyasal değişimlerin gözlemlenebilir göstergelerine ilişkin topladığı verileri tepkenlerin alt mikro seviyedeki değişimi temelinde açıklar.

#### `KİM.10.1.10` — İdeal gaz denklemini tümevarımsal akıl yürütme yoluyla oluşturabilme

- **Dosya:** `kim_10_t01_c10.json` · **konu_id:** `kim_10_t01_c10` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** Gazlar *(senaryo sayıları: 1, 1, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Boyle, Charles ve Avogadro yasaları arasında örüntü oluşturur.
- b) Gazların basınç, hacim, sıcaklık ve mol sayısı değişkenleri arasındaki ilişkiyi genel matematiksel bir eşitlikle ifade eder.

#### `KİM.10.1.11` — Gazların farklı ortamlarda yayılmasına ilişkin deney yapabilme

- **Dosya:** `kim_10_t01_c11.json` · **konu_id:** `kim_10_t01_c11` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2

**Süreç bileşenleri:**

- a) Efüzyon ve difüzyon ile ilgili deney tasarlar.
- b) Deney sonuçlarını günlük hayattaki durumları açıklamak için kullanır.

#### `KİM.10.1.2` — Kimyasal tepkimelerin oluşumunu açıklamak için bilimsel model oluşturabilme

- **Dosya:** `kim_10_t01_c02.json` · **konu_id:** `kim_10_t01_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** Kimyasal Tepkimeler *(senaryo sayıları: 1, 1, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Taneciklerin yeniden düzenlenmesi temelinde kimyasal tepkimelerin oluşumu için önerdiği modeli farklı kimyasal tepkimelerin oluşum süreçlerini ince­leyerek sınar.
- b) Sınama sürecinde elde ettiği kanıtlara uygun olarak modelini geliştirir.

#### `KİM.10.1.3` — Kimyasal tepkime türlerinin oluşum sürecine ilişkin bilimsel gözlem yapabilme

- **Dosya:** `kim_10_t01_c03.json` · **konu_id:** `kim_10_t01_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** Kimyasal Tepkimeler *(senaryo sayıları: 2, 2, 2, 1, 2, 2, 1, 1)*

**Süreç bileşenleri:**

- a) Tepkime türlerinin (çökelme, indirgenme-yükseltgenme ve asit-baz) oluşum sürecine ilişkin gözlemlenebilir göstergeleri (renk değişimi, çökelek oluşumu, enerji değişimi ve gaz çıkışı) tanımlar.
- b) Tepkime türlerinin oluşum sürecine ilişkin gözlemlenebilir göstergelere yönelik veri toplar ve kaydeder.
- c) Tepkimelerin oluşum sürecine ilişkin verileri sembolik ve alt mikro seviyedeki gösterimlerle açıklar.

#### `KİM.10.1.4` — Mol kavramına ilişkin operasyonel tanımlama yapabilme

- **Dosya:** `kim_10_t01_c04.json` · **konu_id:** `kim_10_t01_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** Kimyasal Tepkimeler *(senaryo sayıları: 2, 1, 1, 2, 2, 2, 1, 1)*

**Süreç bileşenleri:**

- a) Maddelerin miktarını ifade etmek için ölçülebilir (kütle, tanecik sayısı vb.) özellikleri belirler.
- b) Maddelerin aynı sayıda tanecik içeren örneklerinin kütlesini ölçer.
- c) Maddelerin tanecik sayısını ifade etmek için yaptığı işlemlere uygun tanım yapar.

#### `KİM.10.1.5` — Saf maddelerin ölçülebilir özellikleri arasındaki ilişkileri belirlemeye yönelik tümdengelimsel akıl yürütebilme

- **Dosya:** `kim_10_t01_c05.json` · **konu_id:** `kim_10_t01_c05` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** Kimyasal Tepkimeler *(senaryo sayıları: 1, 2, 2, 1, 2, 1, 1)*

**Süreç bileşenleri:**

- a) Atom sayısı, molekül sayısı, kütle ile mol sayısı arasındaki ilişkiyi kuramsal temele dayalı kurduğu hipotezleri ile test eder.
- b) Değişkenler arasındaki orantısal ilişkilere yönelik hipotezlerini yeni durumları açıklamak için kullanır.

#### `KİM.10.1.6` — Kimyasal tepkime denklemlerinde tanecik sayılarının tutarsızlıklarına ilişkin çelişkiyi giderebilme

- **Dosya:** `kim_10_t01_c06.json` · **konu_id:** `kim_10_t01_c06` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4
- **ODSGM sınav konusu:** Kimyasal Tepkimeler *(senaryo sayıları: 1, 1, 1, 1, 1, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Kimyasal tepkime denklemlerinde tepken ve ürünlerin tanecik sayılarındaki tutarsızlıkların nerede olduğunu belirler.
- b) Kimyasal tepkime denklemlerinde tepken ve ürünlerin tanecik sayılarının denkleştirilmesi için olası yolları araştırır.
- c) Kimyasal tepkime denklemlerinde tepken ve ürünlerin tanecik sayılarının denkleştirilmesi için uygun yolu seçerek uygular.
- ç) Kimyasal tepkime denklemlerinde tanecik sayılarının denkliğini değerlendirir. 40

#### `KİM.10.1.7` — Kimyasal tepkimelerde stokiyometrik ilişkilere yönelik tümdengelimsel akıl yürütebilme

- **Dosya:** `kim_10_t01_c07.json` · **konu_id:** `kim_10_t01_c07` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** Kimyasal Tepkimeler *(senaryo sayıları: 2, 2, 2, 1, 2, 1, 2, 2)*

**Süreç bileşenleri:**

- a) Denkleştirilmiş kimyasal tepkimelerde tepken ve ürünlerin katsayıları ile mol sayıları arasındaki ilişkileri belirler.
- b) Denkleştirilmiş kimyasal tepkimelerde tepken ve ürünler arasındaki stokiyometrik ilişkileri kurar.
- c) Denkleştirilmiş kimyasal tepkimelerde tepken ve ürünler arasındaki stokiyometrik ilişkilere yönelik çıkarım yapar.

#### `KİM.10.1.8` — Gazların özelliklerine ilişkin bilimsel gözlem yapabilme

- **Dosya:** `kim_10_t01_c08.json` · **konu_id:** `kim_10_t01_c08` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** Gazlar *(senaryo sayıları: 2, 2, 1, 1, 1, 2, 2, 2)*

**Süreç bileşenleri:**

- a) Gazların özelliklerinin (hacim, basınç, genleşme, sıkıştırılabilirlik, karışabilirlik ve yoğunluk) farkını ortaya koyar.
- b) Gazların özelliklerine ilişkin veri toplar ve kaydeder.
- c) Topladığı veriler üzerinden gazların özelliklerine (basınç, hacim, sıcaklık ve madde miktarı) ilişkin keşfettiği örüntüleri tanecikli model ile açıklar.

#### `KİM.10.1.9` — Gazların özellikleri arasındaki ilişkileri bilimsel sorgulayabilme

- **Dosya:** `kim_10_t01_c09.json` · **konu_id:** `kim_10_t01_c09` · **soru:** 14 · **flashcard:** 14 · **süreç:** 7
- **ODSGM sınav konusu:** Gazlar *(senaryo sayıları: 1, 2, 1, 1, 1, 2, 2)*

**Süreç bileşenleri:**

- a) Gazların hacim, basınç, sıcaklık ve madde miktarı değişkenleri arasındaki ilişkilere yönelik araştırılabilir sorular oluşturur.
- b) Değişkenler arasındaki ilişkiyi belirlemek üzere hipotez kurar.
- c) Basınç, hacim, sıcaklık ve madde miktarı arasındaki ikili ilişkileri gösteren gaz yasalarına yönelik araştırma planlar ve planladığı araştırmayı gerçekleştirir.
- ç) Çizdiği grafikler üzerinden matematiksel modeller önerir.
- d) Elde ettiği grafiksel ve matematiksel modelleri kullanarak gazlara ilişkin değişkenler (P, V, T ve
- n) arasındaki ilişkileri açıklar.
- e) Gaz yasalarını kinetik moleküler teori ile değerlendirir.

### Kimya · Tema 2 — Çeşitlilik

#### `KİM.10.2.1` — Çözünme sürecine ilişkin bilimsel model oluşturabilme

- **Dosya:** `kim_10_t02_c01.json` · **konu_id:** `kim_10_t02_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2

**Süreç bileşenleri:**

- a) Çözünme sürecini temsil etmek için basit tanecik modelleri geliştirir.
- b) Çözünme sürecine ilişkin modelleri bilimsel modellerle karşılaştırır.

#### `KİM.10.2.2` — Farklı maddelerin birbiri içinde çözünebilirliğini kanıt kullanarak açıklayabilme

- **Dosya:** `kim_10_t02_c02.json` · **konu_id:** `kim_10_t02_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Farklı maddelerin birbiri içinde çözünmesi ya da çözünmemesi durumuna ilişkin ölçütler (çözücü ve çözünenin polar/apolar veya iyonik/moleküler olması) belirler.
- b) Çözünme sürecine yönelik verileri kullanarak çözünme ya da çözünmeme durumlarını açıklayacak şekilde veri seti oluşturur.
- c) Farklı maddelerin birbiri içinde çözünme ya da çözünmeme durumunu kanıtlara dayalı olarak açıklar.

#### `KİM.10.2.3` — Çözünme olayını sınıflandırabilme

- **Dosya:** `kim_10_t02_c03.json` · **konu_id:** `kim_10_t02_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4

**Süreç bileşenleri:**

- a) Çeşitli maddelerin suda çözünme olayını ayırt etmek için ölçütler (çözücü ve çözünenin etkileşimleri ve sembolik gösterimleri) belirler.
- b) Çözünme olayını belirlediği ölçütlere (iyonik veya moleküler, fiziksel veya kimyasal) göre ayrıştırır.
- c) Belirlediği ölçütleri kullanarak çözünme olaylarını gruplandırır.
- ç) Oluşturduğu grup adlandırmalarını bilimsel karşılığı ile kıyaslar.

#### `KİM.10.2.4` — Çözünürlük kavramına ilişkin operasyonel tanımlama yapabilme

- **Dosya:** `kim_10_t02_c04.json` · **konu_id:** `kim_10_t02_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Katıların saf sudaki çözünürlüğüne ilişkin ölçütler (maddde cinsi ve sıcaklık) belirler.
- b) Çözünürlüğe ilişkin belirlediği ölçütleri test eder.
- c) Çözünürlüğün tanımını yaparak kendi tanımı ile bilimsel tanım arasındaki farkı açıklar.

#### `KİM.10.2.5` — Çözünürlüğe etki eden faktörleri belirlemeye yönelik kanıt kullanabilme

- **Dosya:** `kim_10_t02_c05.json` · **konu_id:** `kim_10_t02_c05` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Katı ve gazların saf sudaki çözünürlüğüne etki eden faktörlere ilişkin ölçütler (madde cinsi, sıcaklık ve basınç) belirler.
- b) Çözünürlük ile ilgili seçtiği verileri değişkenler arası ilişkileri belirleyecek şekilde düzenler.
- c) Çözünürlüğe etki eden faktörleri veriye dayalı açıklar.

#### `KİM.10.2.6` — Çözeltileri sınıflandırabilme

- **Dosya:** `kim_10_t02_c06.json` · **konu_id:** `kim_10_t02_c06` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4

**Süreç bileşenleri:**

- a) Çözeltileri ayırt etmek için ölçütler (içerdiği çözünenin miktarı üzerinden doymuş, doymamış, aşırı doymuş; içerdiği çözünenin iyonik karakteri üzerinden elektrolit olan, elektrolit olmayan) belirler.
- b) Çözeltileri belirlediği ölçütlere göre ayrıştırır.
- c) Çözeltileri farklı biçimlerde gruplandırır.
- ç) Oluşturduğu grup adlandırmalarını bilimsel karşılığı ile kıyaslar.

#### `KİM.10.2.7` — Çözeltilerin molar derişimine ilişkin tümevarımsal akıl yürütebilme

- **Dosya:** `kim_10_t02_c07.json` · **konu_id:** `kim_10_t02_c07` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2

**Süreç bileşenleri:**

- a) Çözeltilerin molar derişimine ilişkin keşfettiği örüntüyü matematiksel olarak modelleyip bu modeli yeni çözeltilerin verileri üzerinde test eder.
- b) Çözeltilerin molar derişimini, kurduğu matematiksel model üzerinden geneller. 49

#### `KİM.10.2.8` — Çözünen maddenin tanecik sayısının çözeltilerin kaynama ve donma noktasına etkisini belirlemeye yönelik hipotez oluşturabilme

- **Dosya:** `kim_10_t02_c08.json` · **konu_id:** `kim_10_t02_c08` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5

**Süreç bileşenleri:**

- a) Katı-sıvı çözeltilerin kaynama ve donma noktasının saf suya göre değişimine yönelik araştırma sorusu belirler.
- b) Çözeltilerin kaynama ve donma noktasının değişimine yönelik neden-sonuç ilişkilerini belirtir.
- c) Neden-sonuç ilişkilerini araştırabilmek için bağımlı-bağımsız değişkenleri ve kontrol değişkenlerini belirler.
- ç) Değişkenler arasındaki ilişkiyi belirlemek üzere deneyler yaparak elde ettiği verilere dayalı önermeler sunar.
- d) Çözeltilerin kaynama noktasının yükselmesi ve donma noktasının düşmesine neden olan faktörlere yönelik sunduğu önermeleri bilimsel kuramlar ile destekler.

### Kimya · Tema 3 — Sürdürülebilirlik

#### `KİM.10.3.1` — Kimya dersinde mikro ölçekli deney tercih etmenin sonuçlarını ekosistem açısından değerlendirebilme

- **Dosya:** `kim_10_t03_c01.json` · **konu_id:** `kim_10_t03_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4

**Süreç bileşenleri:**

- a) Makro ve mikro ölçekli deneylerin ekosisteme etkilerine ilişkin ölçütler (kimyasal madde miktarı, su miktarı ve kimyasal kirlilik miktarı) belirler.
- b) Kimyasal tepkimelerle ilgili makro ve mikro ölçekli deneyleri gerçekleştirirken belirlediği ölçütler temelinde ölçümler yapar.
- c) Ölçme sonuçlarından hareketle makro ve mikro ölçekli deneylerin etkilerine ilişkin belirlediği ölçütleri karşılaştırır.
- ç) Makro ve mikro ölçekli deneylerin ekosisteme etkileri hakkında yargıya varır.

#### `KİM.10.3.2` — Kimyasal tepkimeler sonucunda atmosferin doğasındaki değişimin ekosisteme etkilerine yönelik problem çözebilme

- **Dosya:** `kim_10_t03_c02.json` · **konu_id:** `kim_10_t03_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5

**Süreç bileşenleri:**

- a) Kimyasal tepkimeler sonucunda atmosferin doğasındaki değişimin ekosisteme etkilerine yönelik problemleri (hava kirliliği, ozon azalımı, asit yağmurları, sera etkisi, küresel ısınma vb.) belirler.
- b) Belirlediği problemlerin ekosistem (canlı, cansız, sucul sistem, toprak, hava, sağlık vb.) üzerindeki etkilerini özetler.
- c) Problemlerin çözümüne yönelik veriye dayalı tahminlerde bulunur.
- ç) Problemin çözümüne yönelik önermeler üzerinden akıl yürütür.
- d) Problemin çözümüne ilişkin değerlendirmelerde bulunur.

---

## Biyoloji

19 öğrenme çıktısı · 61 süreç bileşeni · 190 soru

| Tema | Ad | Çıktı | Soru |
| --- | --- | --- | --- |
| 1 | Enerji | 10 | 100 |
| 2 | Ekoloji | 9 | 90 |

### Biyoloji · Tema 1 — Enerji

#### `BİY.10.1.1` — Canlıların yaşamına devam edebilmesi için enerjinin gerekliliğini sorgulayabilme

- **Dosya:** `biyo_10_t01_c01.json` · **konu_id:** `biyo_10_t01_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5
- **ODSGM sınav konusu:** Canlılık İçin Enerjinin Önemi (ATP’nin Yapısı ve Enerji Aktarımında ATP’nin Rolü) *(senaryo sayıları: 2, 3, 2, 3, 1)*

**Süreç bileşenleri:**

- a) Canlıların yaşamına devam edebilmesi için enerjinin gerekliliğiyle ilgili merakını ifade eder.
- b) Canlıların yaşamına devam edebilmesi için enerjinin gerekliliğiyle ilgili sorular sorar.
- c) Canlıların yaşamına devam edebilmesi için enerjinin gerekliliğiyle ilgili bilgileri toplar.
- ç) Canlıların yaşamına devam edebilmesi için enerjinin gerekliliğiyle ilgili topladığı bilgilerin doğruluğunu değerlendirir.
- d) Canlıların yaşamına devam edebilmesi için enerjinin gerekliliğiyle ilgili topladığı bilgiler üzerinden çıkarım yapar.

#### `BİY.10.1.10` — Besinlerden elde edilen enerjinin canlının metabolik süreçlerine katkısı ile ilgili bilimsel çıkarım yapabilme

- **Dosya:** `biyo_10_t01_c10.json` · **konu_id:** `biyo_10_t01_c10` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Besinlerden elde edilen enerjinin özelliklerini tanımlar.
- b) Besinlerden elde edilen enerjinin canlının metabolik süreçlerine katkısı ile ilgili bilgileri/verileri toplar ve kaydeder.
- c) Besinlerden elde edilen enerjinin canlının metabolik süreçlerine katkısı ile ilgili topladığı bilgileri/verileri yorumlar ve değerlendirir.

#### `BİY.10.1.2` — Fotosentez reaksiyonlarıyla ilgili bilimsel model oluşturabilme

- **Dosya:** `biyo_10_t01_c02.json` · **konu_id:** `biyo_10_t01_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** Işık Enerjisi Kullanılarak Besin Sentezi: Fotosentez (Işığın Kullanıldığı Tepkimeler, Işığın Kullanılmadığı Tepkimeler, Fotosentez Hızına Etki Eden Çevresel Faktörler) *(senaryo sayıları: —)*

**Süreç bileşenleri:**

- a) Fotosentez reaksiyonlarının işleyişini açıklamak için model önerir.
- b) Fotosentez reaksiyonlarının işleyişi ile ilgili önerdiği modeli bilimsel modellerle karşılaştır ve elde ettiği kanıtlarla modelini yeniler.

#### `BİY.10.1.3` — Fotosentezde kullanılan ve üretilen maddelerle ilgili deney yapabilme

- **Dosya:** `biyo_10_t01_c03.json` · **konu_id:** `biyo_10_t01_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** Işık Enerjisi Kullanılarak Besin Sentezi: Fotosentez (Işığın Kullanıldığı Tepkimeler, Işığın Kullanılmadığı Tepkimeler, Fotosentez Hızına Etki Eden Çevresel Faktörler) *(senaryo sayıları: 1, 1, 1, 2, 1, 1)*

**Süreç bileşenleri:**

- a) Fotosentezde kullanılan ve üretilen maddelerle ilgili deney tasarlar.
- b) Tasarladığı deneyden elde ettiği sonuçların analizini yapar ve bu sonuçları fotosentezi açıklamak için kullanır.

#### `BİY.10.1.4` — Kemosentez hakkında bilgi toplayabilme

- **Dosya:** `biyo_10_t01_c04.json` · **konu_id:** `biyo_10_t01_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4
- **ODSGM sınav konusu:** Işık Enerjisi Kullanılmadan Besin Sentezi: Kemosentez *(senaryo sayıları: —)*

**Süreç bileşenleri:**

- a) Kemosentez hakkında bilgiye ulaşmak için kullanacağı araçları belirler.
- b) Belirlediği araçları kullanarak kemosentez ile ilgili bilgilere ulaşır.
- c) Kemosentez ile ilgili ulaştığı bilgileri doğrular.
- ç) Kemosentez ile ilgili ulaştığı bilgileri kaydeder.

#### `BİY.10.1.5` — Canlılarda sindirim çeşitlerini ve yapılarını sınıflandırabilme

- **Dosya:** `biyo_10_t01_c05.json` · **konu_id:** `biyo_10_t01_c05` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4
- **ODSGM sınav konusu:** Sindirim (Hücre İçi Sindirim ve Hücre Dışı Sindirim), Canlılarda Sindirim Yapıları *(senaryo sayıları: 2, 2, 3, 1, 2, 2)*

**Süreç bileşenleri:**

- a) Canlılarda sindirim çeşitleri ve yapılarını sınıflandırmak için ölçütler belirler.
- b) Canlılarda sindirim çeşitleri ve yapılarını oluşturduğu ölçütlere göre ayrıştırır.
- c) Canlılarda sindirim çeşitleri ve yapılarını gruplandırır.
- ç) Canlılarda sindirim çeşitleri ve yapılarını isimlendirir.

#### `BİY.10.1.6` — İnsanda enerji eldesi için sindirim, emilim ve taşıma süreçlerinin gerekliliği ile ilgili bilimsel çıkarım yapabilme

- **Dosya:** `biyo_10_t01_c06.json` · **konu_id:** `biyo_10_t01_c06` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** İnsanda Sindirim, Emilim ve Taşınma *(senaryo sayıları: 2, 1, 2)*

**Süreç bileşenleri:**

- a) İnsanda sindirim, emilim ve taşıma süreçlerinin niteliklerini tanımlar.
- b) İnsanda sindirim, emilim ve taşıma süreçlerinin besinlerden enerji eldesi için gerekliliğiyle ilgili bilgileri/verileri toplar ve kaydeder.
- c) İnsanda sindirim, emilim ve taşıma süreçlerinin besinlerden enerji eldesi için gerekliliğiyle ilgili topladığı bilgileri/verileri yorumlar ve değerlendirir.

#### `BİY.10.1.7` — Hücresel solunum reaksiyonlarıyla ilgili bilimsel model oluşturabilme

- **Dosya:** `biyo_10_t01_c07.json` · **konu_id:** `biyo_10_t01_c07` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** Hücresel Solunum (Glikoliz, Sitrik Asit Döngüsü, Elektron Taşıma Sistemi) *(senaryo sayıları: —)*

**Süreç bileşenleri:**

- a) Hücresel solunum reaksiyonlarının işleyişini açıklamak için model önerir.
- b) Hücresel solunum reaksiyonlarının işleyişi ile ilgili oluşturduğu modeli bilimsel modellerle karşılaştır ve elde ettiği kanıtlarla modelini yeniden yapılandırır.

#### `BİY.10.1.8` — Farklı besin gruplarından enerji eldesi süreçlerini karşılaştırabilme

- **Dosya:** `biyo_10_t01_c08.json` · **konu_id:** `biyo_10_t01_c08` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** Besinlerin Solunuma Katılma Yolları *(senaryo sayıları: 2, 1, 1)*

**Süreç bileşenleri:**

- a) Farklı besin gruplarından enerji eldesi süreçlerine ilişkin özellikleri belirler.
- b) Farklı besin gruplarından enerji eldesi süreçlerine ilişkin benzerlikleri listeler.
- c) Farklı besin gruplarından enerji eldesi süreçlerine ilişkin farklılıkları listeler. 30

#### `BİY.10.1.9` — Fermantasyon ile ilgili deney yapabilme

- **Dosya:** `biyo_10_t01_c09.json` · **konu_id:** `biyo_10_t01_c09` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** Fermantasyon (Laktik Asit Fermantasyonu, Etil Alkol Fermantasyonu) *(senaryo sayıları: 1, 1)*

**Süreç bileşenleri:**

- a) Fermantasyon ile ilgili deney tasarlar.
- b) Tasarladığı deneyden elde ettiği sonuçların analizini yapar ve bu sonuçları fermantasyonu açıklamak için kullanır.

### Biyoloji · Tema 2 — Ekoloji

#### `BİY.10.2.1` — Ekosistemin cansız ve canlı bileşenleri arasındaki ilişkileri çözümleyebilme

- **Dosya:** `biyo_10_t02_c01.json` · **konu_id:** `biyo_10_t02_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2

**Süreç bileşenleri:**

- a) Ekosistemi oluşturan cansız ve canlı bileşenleri belirler.
- b) Ekosistemin cansız ve canlı bileşenleri arasındaki ilişkileri belirler.

#### `BİY.10.2.2` — Komünitelerde ve popülasyonlarda görülen etkileşimleri ve değişimleri sorgulayabilme

- **Dosya:** `biyo_10_t02_c02.json` · **konu_id:** `biyo_10_t02_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5

**Süreç bileşenleri:**

- a) Popülasyon, komünite ve ekosistemlerde görülen etkileşimleri ve değişimleri tanımlar.
- b) Popülasyon, komünite ve ekosistemlerde görülen etkileşimler ve değişimlerle ilgili sorular sorar.
- c) Popülasyon, komünite ve ekosistemlerde görülen etkileşimler ve değişimlerle ilgili bilgi toplar.
- ç) Popülasyon, komünite ve ekosistemlerde görülen etkileşimler ve değişimlerle ilgili topladığı bilgilerin doğruluğunu değerlendirir.
- d) Popülasyon, komünite ve ekosistemlerde görülen etkileşimler ve değişimlerle ilgili topladığı bilgiler üzerinden çıkarım yapar.

#### `BİY.10.2.3` — Ekosistemdeki enerji akışıyla ilgili tümevarımsal akıl yürütebilme

- **Dosya:** `biyo_10_t02_c03.json` · **konu_id:** `biyo_10_t02_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Ekosistemdeki enerji akışıyla ilgili gözlem yapar.
- b) Ekosistemdeki enerji akışıyla ilgili örüntüleri oluşturur.
- c) Oluşturduğu örüntülerden yola çıkarak ekosistemdeki enerji akışıyla ilgili genelleme yapar.

#### `BİY.10.2.4` — Madde döngüleri ile ilgili bilimsel model oluşturabilme

- **Dosya:** `biyo_10_t02_c04.json` · **konu_id:** `biyo_10_t02_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2

**Süreç bileşenleri:**

- a) Madde döngülerinin işleyişini açıklamak için model önerir.
- b) Madde döngülerinin işleyişi ile ilgili önerdiği modeli bilimsel modellerle karşılaştırır ve elde ettiği kanıtlarla modelini yeniler.

#### `BİY.10.2.5` — Ekolojik sürdürülebilirliğin önemini yorumlayabilme

- **Dosya:** `biyo_10_t02_c05.json` · **konu_id:** `biyo_10_t02_c05` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Ekolojik sürdürülebilirliğin önemini inceler.
- b) Ekolojik sürdürülebilirliğin önemini bağlamdan kopmadan dönüştürür.
- c) Ekolojik sürdürülebilirliğin önemini anlamı değiştirmeyecek şekilde yeniden ifade eder.

#### `BİY.10.2.6` — Çevresinde sürdürülebilirliği kısıtlayan durumlarla ilgili gözleme dayalı tahmin yapabilme

- **Dosya:** `biyo_10_t02_c06.json` · **konu_id:** `biyo_10_t02_c06` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Çevresinde sürdürülebilirliği kısıtlayan durumları gözlem ve deneyimleriyle ilişkilendirir.
- b) Çevresinde sürdürülebilirliği kısıtlayan durumlara ilişkin çıkarım yapar.
- c) Çevresinde sürdürülebilirliği kısıtlayan durumlara ilişkin yargıda bulunur.

#### `BİY.10.2.7` — Ekolojik ayak izini küçültebilme yollarını bilimsel olarak sorgulayabilme

- **Dosya:** `biyo_10_t02_c07.json` · **konu_id:** `biyo_10_t02_c07` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4

**Süreç bileşenleri:**

- a) Ekolojik ayak izini küçültebilme yollarıyla ilgili araştırma sorusu belirler.
- b) Ekolojik ayak izini küçültebilme yollarıyla ilgili araştırma sorusunu cevaplamak için bir tablo/model oluşturur.
- c) Ekolojik ayak izini küçültebilme yollarıyla ilgili araştırma planlar.
- ç) Ekolojik ayak izini küçültebilme yollarıyla ilgili elde ettiği verileri analiz eder ve yorumlar. 38

#### `BİY.10.2.8` — Doğal kaynakların ve biyoçeşitliliğin korunması için alınan önlemleri sorgulayabilme

- **Dosya:** `biyo_10_t02_c08.json` · **konu_id:** `biyo_10_t02_c08` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5

**Süreç bileşenleri:**

- a) Doğal kaynakların ve biyoçeşitliliğin korunması için alınan önlemlere ilişkin merakını ifade eder.
- b) Doğal kaynakların ve biyoçeşitliliğin korunması için alınan önlemler ile ilgili sorular sorar.
- c) Doğal kaynakların ve biyoçeşitliliğin korunması için alınan önlemler ile ilgili bilgi toplar.
- ç) Doğal kaynakların ve biyoçeşitliliğin korunması için alınan önlemler ile ilgili topladığı bilgilerin doğruluğunu değerlendirir.
- d) Doğal kaynakların ve biyoçeşitliliğin korunması için alınan önlemler ile ilgili topladığı bilgiler üzerinden çıkarım yapar.

#### `BİY.10.2.9` — Çevresinde atık yönetimi konusunda yapılan çalışmalarla ilgili bilgi toplayabilme

- **Dosya:** `biyo_10_t02_c09.json` · **konu_id:** `biyo_10_t02_c09` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4

**Süreç bileşenleri:**

- a) Çevresinde atık yönetimi konusunda yapılan çalışmalarla ilgili bilgilere ulaşmak için kullanacağı araçları belirler.
- b) Belirlediği araçları kullanarak çevresinde atık yönetimi konusunda yapılan çalışmalarla ilgili bilgilere ulaşır.
- c) Çevresinde atık yönetimi konusunda yapılan çalışmalarla ilgili ulaştığı bilgileri doğrular.
- ç) Çevresinde atık yönetimi konusunda yapılan çalışmalarla ilgili ulaştığı bilgileri kaydeder.

---

## Tarih

14 öğrenme çıktısı · 49 süreç bileşeni · 140 soru

| Tema | Ad | Çıktı | Soru |
| --- | --- | --- | --- |
| 1 | Türkistan’dan Türkiye’ye (1040-1299) | 4 | 40 |
| 2 | Beylikten Devlete Osmanlı (1299-1453) | 5 | 50 |
| 3 | Cihan Devleti Osmanlı (1453-1683) | 5 | 50 |

### Tarih · Tema 1 — Türkistan’dan Türkiye’ye (1040-1299)

#### `TAR.10.1.1` — Türkistan’dan Türkiye’ye uzanan süreçte 1040-1299 yılları arasında meydana VE SÜREÇ BİLEŞENLERİ gelen önemli askerî mücadelelerin Türk tarihinin seyrine etkilerini karşılaştırabilme

- **Dosya:** `tar_10_t01_c01.json` · **konu_id:** `tar_10_t01_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** Türkistan’dan Türkiye’ye Uzanan Süreçte Meydana Gelen Önemli Askerî Mücadeleler *(senaryo sayıları: 3, 2, 1, 2, 2, 3, 1, 1)*

**Süreç bileşenleri:**

- a) Türk tarihinin seyrini değiştiren önemli askerî mücadeleleri tarih şeridi üzerinde sıralar.
- b) Türk tarihinin seyrini değiştiren önemli askerî mücadelelerin özelliklerini belirler.
- c) Türk tarihinin seyrini değiştiren önemli askerî mücadelelerin etkilerini benzerlik ve farklılıkları açısından listeler.

#### `TAR.10.1.2` — Türkistan’dan Türkiye’ye uzanan süreçte Türklerde devlet ve ordu teşkilatında meydana gelen değişim ve sürekliliği yorumlayabilme

- **Dosya:** `tar_10_t01_c02.json` · **konu_id:** `tar_10_t01_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4
- **ODSGM sınav konusu:** Türkistan’dan Türkiye’ye Uzanan Süreçte Türk Devlet ve Ordu Teşkilatında Meydana Gelen Değişim *(senaryo sayıları: 2, 3, 2, 2, 2, 3, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Türkistan’dan Türkiye’ye uzanan süreçte Türklerde devlet ve ordu teşkilatında meydana gelen değişim ve sürekliliği sağlayan unsurları inceler.
- b) Türkistan’dan Türkiye’ye uzanan süreçte Türklerde devlet ve ordu teşkilatında meydana gelen değişim ve sürekliliğin etkilediği unsurları inceler.
- c) Türkistan’dan Türkiye’ye uzanan süreçte Türklerde devlet ve ordu teşkilatında meydana gelen değişim ve sürekliliğin kurumlara etkilerini sorgular.
- ç) Türkistan’dan Türkiye’ye uzanan süreçte Türklerde devlet ve ordu teşkilatında meydana gelen değişim ve sürekliliğin neden ve sonuçlarını açıklar.

#### `TAR.10.1.3` — Türkistan’dan Türkiye’ye uzanan süreçte Türklerin sosyoekonomik faaliyetleri ile yerleşme ve şehirleşme anlayışları arasındaki ilişkiyi sorgulayabilme

- **Dosya:** `tar_10_t01_c03.json` · **konu_id:** `tar_10_t01_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5
- **ODSGM sınav konusu:** Türkistan’dan Türkiye’ye Uzanan Süreçte Türklerin Sosyal Yaşamları ve Ekonomik Faaliyetleri *(senaryo sayıları: 2, 2, 3, 3, 2, 1, 1, 1, 2)*

**Süreç bileşenleri:**

- a) Türkistan’dan Türkiye’ye uzanan süreçte Türklerin sosyoekonomik faaliyetleri ile yerleşme ve şehirleşme anlayışları arasındaki ilişki hakkında merak ettiği konuları belirler.
- b) İlgili konular hakkında sorular sorar.
- c) Farklı kaynaklar üzerinden konuya ilişkin bilgi toplar.
- ç) Topladığı bilgilerin doğruluğunu değerlendirir.
- d) Topladığı bilgiler üzerinden Türkistan’dan Türkiye’ye uzanan süreçte Türklerin sosyoekonomik faaliyetleri ile yerleşme ve şehirleşme anlayışları arasındaki ilişki hakkında çıkarım yapar.

#### `TAR.10.1.4` — Türkistan’dan Türkiye’ye uzanan süreçte Türk-İslam medeniyetinde bilim, kültür, eğitim ve sanat alanlarında meydana gelen gelişmeleri Anadolu’nun Türkleşme ve İslamlaşma sürecine etkisi açısından değerlendirebilme

- **Dosya:** `tar_10_t01_c04.json` · **konu_id:** `tar_10_t01_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** Türk-İslam Medeniyetinin Bilim, Kültür, Eğitim ve Sanat Alanlarında Ortaya Çıkardığı Etkiler *(senaryo sayıları: 2, 1, 1, 1, 2)*

**Süreç bileşenleri:**

- a) Türk-İslam medeniyeti ile Batı medeniyetinin bilim, kültür, eğitim ve sanat anlayışını karşılaştırır.
- b) Türkistan’dan Türkiye’ye uzanan süreçte Türk-İslam medeniyetinde bilim, kültür, eğitim ve sanat alanlarında meydana gelen gelişmelerin Anadolu’nun Türkleşme ve İslamlaşma sürecine etkisine ilişkin kanıtları kullanarak yargıda bulunur.
- c) Hoca Ahmed Yesevi, Kaşgarlı Mahmud, Ömer Hayyam, Cezeri, İbnülarabi, Mevlana Celaleddin Rumi, Hacı Bektaş Veli, Yunus Emre ve İbni Bibi’nin düşünceleri veya eserleri hakkında insanlığın ortak mirasına katkıları bakımından yargıda bulunur.

### Tarih · Tema 2 — Beylikten Devlete Osmanlı (1299-1453)

#### `TAR.10.2.1` — Osmanlı Devleti’nin kuruluşuna dair farklı görüşleri tartışabilme VE SÜREÇ BİLEŞENLERİ

- **Dosya:** `tar_10_t02_c01.json` · **konu_id:** `tar_10_t02_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** Osmanlı Devleti’nin Kuruluşuna Dair Farklı Görüşler *(senaryo sayıları: 2, 2, 2, 1, 1, 2)*

**Süreç bileşenleri:**

- a) Tarihçilerin Osmanlı Devleti’nin kuruluşuna dair öne sürdüğü farklı görüşlerin benzer ve farklı yönlerini belirler.
- b) Tarihçilerin Osmanlı Devleti’nin kuruluşuna dair öne sürdüğü görüşlerin güçlü ve zayıf yönleri ile tutarsızlıklarını tespit eder.
- c) Tarihçilerin Osmanlı Devleti’nin kuruluşuna dair öne sürdüğü görüşleri gerekçeleriyle çürütür veya kabul eder.

#### `TAR.10.2.2` — 1299-1453 yılları arasında Osmanlı Devleti’nin Anadolu ve Rumeli’de gerçekleştirdiği siyasi ve askerî mücadeleleri yorumlayabilme

- **Dosya:** `tar_10_t02_c02.json` · **konu_id:** `tar_10_t02_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** Osmanlı Devleti’nin Anadolu ve Rumeli’deki Siyasi ve Askerî Mücadeleleri *(senaryo sayıları: 2, 2, 2, 2, 2)*

**Süreç bileşenleri:**

- a) Osmanlı Devleti’nin Anadolu ve Rumeli’de gerçekleştirdiği siyasi ve askerî mücadeleleri farklı kaynakları karşılaştırarak inceler.
- b) Osmanlı Devleti’nin Anadolu ve Rumeli’de gerçekleştirdiği siyasi ve askerî mücadelelere ilişkin farklı kaynaklardaki bilgi ve bakış açılarını görsel bir forma dönüştürür.
- c) Osmanlı Devleti’nin Anadolu ve Rumeli’de gerçekleştirdiği siyasi ve askerî mücadeleleri verilen kaynaklara dayanarak kendi cümleleriyle ifade eder.

#### `TAR.10.2.3` — Osmanlı Devleti’nin ordu, hukuk ve toprak sistemi ile devletleşme süreci arasındaki ilişkiyi çözümleyebilme

- **Dosya:** `tar_10_t02_c03.json` · **konu_id:** `tar_10_t02_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2

**Süreç bileşenleri:**

- a) Osmanlı Beyliği’nin devletleşmesini sağlayan sistemlerin özelliklerini belirler.
- b) Osmanlı Beyliği’nin devletleşmesini sağlayan sistemler arasındaki ilişkiyi belirler.

#### `TAR.10.2.4` — Osmanlı Devleti’nin fethettiği topraklarda kalıcı olabilmek için izlediği politikaları sorgulayabilme

- **Dosya:** `tar_10_t02_c04.json` · **konu_id:** `tar_10_t02_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Osmanlı Devleti’nin fethettiği topraklarda uyguladığı iskân ve istimalet politikalarına yönelik kaynaklardaki farklı bakış açılarının nedenlerine dair sorular sorar.
- b) Osmanlı Devleti’nin fethettiği topraklarda uyguladığı iskân ve istimalet politikalarına ilişkin kaynaklardaki bilgilerin sınırlılıkları hakkında çıkarım yapar.
- c) Osmanlı Devleti’nin fethettiği topraklarda uyguladığı iskân ve istimalet politikalarına yönelik kaynaklara dayalı çıkarım yapar.

#### `TAR.10.2.5` — Osmanlı Devleti’nin ilim ve irfan geleneğinin oluşmasında şehir, kurum ve şahsiyetlerin etkilerine dair fikirler üretebilme

- **Dosya:** `tar_10_t02_c05.json` · **konu_id:** `tar_10_t02_c05` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Osmanlı Devleti’nin ilim ve irfan geleneğinin oluşmasında şehir, kurum ve şahsiyetlerin etkilerini fark eder.
- b) Osmanlı Devleti’nin ilim ve irfan geleneğinin oluşmasında ilk Türk-İslam devletlerindeki benzer deneyimleri inceler.
- c) Osmanlı Devleti’nin ilim ve irfan geleneğinin oluşmasında şehir, kurum ve şahsiyetlerin rolüne ilişkin fikir üretir.

### Tarih · Tema 3 — Cihan Devleti Osmanlı (1453-1683)

#### `TAR.10.3.1` — 1453-1683 yılları arasındaki siyasi ve askerî mücadelelerin Osmanlı Devleti’nin VE SÜREÇ BİLEŞENLERİ cihan devleti hâline gelmesindeki rolüne ilişkin özgün fikirler üretebilme

- **Dosya:** `tar_10_t03_c01.json` · **konu_id:** `tar_10_t03_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) 1453-1683 yılları arasındaki siyasi ve askerî mücadeleleri belirler.
- b) 1453-1683 yılları arasındaki siyasi ve askerî mücadeleler ile Osmanlı Devleti’nin cihan devleti hâline gelmesini ilişkilendirir.
- c) 1453-1683 yılları arasındaki siyasi ve askerî mücadelelerin sonucunda bir cihan devleti hâline gelen Osmanlı Devleti’nin politikaları hakkında özgün bir içerik oluşturur.

#### `TAR.10.3.2` — 1453-1683 yılları arasında Osmanlı Devleti’nin yönetim ve ordu yapısında meydana gelen değişim ve sürekliliğe ilişkin kaynakları yorumlayabilme

- **Dosya:** `tar_10_t03_c02.json` · **konu_id:** `tar_10_t03_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) 1453-1683 yılları arasında Osmanlı Devleti’nin yönetim ve ordu yapısında meydana gelen değişim ve sürekliliği kaynaklar üzerinden inceler.
- b) 1453-1683 yılları arasında Osmanlı Devleti’nin yönetim ve ordu yapısında meydana gelen değişimle ilgili farklı kaynaklardaki bilgileri tablo yaparak gösterir.
- c) 1453-1683 yılları arasında Osmanlı Devleti’nin yönetim ve ordu yapısında meydana gelen değişimleri birden çok kaynaktaki kanıtlara dayanarak ifade eder.

#### `TAR.10.3.3` — Avrupalıların sömürgeci politikalarının etkilerini tarihsel bağlamı içerisinde değerlendirebilme

- **Dosya:** `tar_10_t03_c03.json` · **konu_id:** `tar_10_t03_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4

**Süreç bileşenleri:**

- a) Avrupalıların sömürgeci politikalarını kaynaklara dayanarak çözümler.
- b) Avrupalıların sömürgeci politikalarıyla ilgili olarak dönemin koşullarını fark eder.
- c) Avrupalıların sömürgeci politikalarının günümüze etkilerini açıklar.
- ç) Avrupalıların sömürgeci politikalarının etkilerini dönemin koşulları içinde açıklar.

#### `TAR.10.3.4` — 1453-1683 yılları arasında Osmanlı Devleti’nde gerçekleşen önemli isyanların neden ve sonuçlarını müzakere edebilme

- **Dosya:** `tar_10_t03_c04.json` · **konu_id:** `tar_10_t03_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5

**Süreç bileşenleri:**

- a) 1453-1683 yılları arasında Osmanlı Devleti’nde gerçekleşen önemli isyanların neden ve sonuçları konusunda bireylerin farklı görüşlerde olabileceğini fark eder.
- b) 1453-1683 yılları arasında Osmanlı Devleti’nde gerçekleşen önemli isyanların neden ve sonuçları konusunda kendi görüşüyle diğer bireylerin görüşlerini karşılaştırır.
- c) 1453-1683 yılları arasında Osmanlı Devleti’nde gerçekleşen önemli isyanların nedenlerine ilişkin mevcut görüşlerden hareketle dönemin şartlarını göz önünde bulundurarak isyanların önlenmesine yönelik olası çözümler önerir.
- ç) 1453-1683 yılları arasında Osmanlı Devleti’nde gerçekleşen önemli isyanların neden ve sonuçlarına ilişkin farklı görüş ve düşünceleri değerlendirerek kendi görüşünü gözden geçirir.
- d) 1453-1683 yılları arasında Osmanlı Devleti’nde gerçekleşen önemli isyanları ve bunlara karşı alınan önlemlere ilişkin farklı görüş ve düşünceleri değerlendirerek grubun görüşünü ifade eder. 45

#### `TAR.10.3.5` — 1453-1683 yılları arasında Osmanlı Devleti’nde bilim, kültür, eğitim ve sanat alanlarında ortaya çıkan gelişmelere ilişkin oluşturduğu özgün ürünleri paylaşabilme

- **Dosya:** `tar_10_t03_c05.json` · **konu_id:** `tar_10_t03_c05` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5

**Süreç bileşenleri:**

- a) Araştırmasında belirlediği kaynaklardan 1453-1683 yılları arasında bilim, kültür, eğitim ve sanat alanlarında ortaya çıkan gelişmelere ilişkin bilgi toplar.
- b) 1453-1683 yılları arasında bilim, kültür, eğitim ve sanat alanlarında ortaya çıkan gelişmelere ilişkin belirlediği kaynakları inceleyerek araştırmasına dair bilgileri tespit eder.
- c) 1453-1683 yılları arasında bilim, kültür, eğitim ve sanat alanlarında ortaya çıkan gelişmelere ilişkin kullanacağı kaynakların sınırlılığını sorgular.
- ç) 1453-1683 yılları arasında bilim, kültür, eğitim ve sanat alanlarında ortaya çıkan gelişmelere ilişkin kaynaklardan araştırmasına uygun olarak belirlediği bilgileri yorumlar.
- d) 1453-1683 yılları arasında bilim, kültür, eğitim ve sanat alanlarında ortaya çıkan gelişmelere ilişkin kanıtlara dayanarak oluşturduğu araştırmasını paylaşır.

---

## Coğrafya

18 öğrenme çıktısı · 73 süreç bileşeni · 190 soru

| Tema | Ad | Çıktı | Soru |
| --- | --- | --- | --- |
| 1 | Coğrafyanın Doğası | 1 | 10 |
| 2 | Mekânsal Bilgi Teknolojileri | 2 | 24 |
| 3 | Doğal Sistemler ve Süreçler | 5 | 52 |
| 4 | Beşerî Sistemler ve Süreçler | 2 | 20 |
| 5 | Ekonomik Faaliyetler ve Etkileri | 3 | 32 |
| 6 | Afetler ve Sürdürülebilir Çevre | 4 | 42 |
| 7 | Bölgeler, Ülkeler ve Küresel Bağlantılar | 1 | 10 |

### Coğrafya · Tema 1 — Coğrafyanın Doğası

#### `COĞ.10.1.1` — Örnek olay, olgu ve/veya mekânı coğrafyanın temel kavramları ile ilişkilendirebilme

- **Dosya:** `cogr_10_t01_c01.json` · **konu_id:** `cogr_10_t01_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4
- **ODSGM sınav konusu:** Coğrafi Bakış *(senaryo sayıları: 1, 1, 1, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Örnek olay, olgu ve/veya mekânın harita üzerindeki konumunu algılar.
- b) Örnek olay, olgu ve/veya mekânın temel coğrafi koşullarını tanımlar.
- c) Örnek olay, olgu ve/veya mekânın yakın ve uzak çevresiyle olan ilişkilerini çözümler.
- ç) Örnek olay, olgu ve/veya mekânın aynı çevrede bulunan diğer olay, olgu veya mekânlar üzerindeki etkisini sorgular.

### Coğrafya · Tema 2 — Mekânsal Bilgi Teknolojileri

#### `COĞ.10.2.1` — Örnek uygulamalar üzerinden CBS ve uzaktan algılamanın kullanım alanlarını özetleyebilme

- **Dosya:** `cogr_10_t02_c01.json` · **konu_id:** `cogr_10_t02_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** CBS ve Uzaktan Algılamanın Uygulama Alanları *(senaryo sayıları: 1, 1, 1, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Örnek uygulamalar üzerinden CBS ve uzaktan algılamanın kullanım alanlarını çözümler.
- b) Örnek uygulamalar üzerinden CBS ve uzaktan algılamanın kullanım alanlarını sınıflandırır.
- c) Örnek uygulamalar üzerinden CBS ve uzaktan algılamanın kullanım alanlarını yorumlar.

#### `COĞ.10.2.2` — Mekânsal bilgi teknolojilerini kullanarak altlık haritalar üzerinde mekânsal veriler oluşturabilme

- **Dosya:** `cogr_10_t02_c02.json` · **konu_id:** `cogr_10_t02_c02` · **soru:** 14 · **flashcard:** 14 · **süreç:** 7
- **ODSGM sınav konusu:** Mekânsal Verilerin Haritalara Aktarılması *(senaryo sayıları: 1, 1, 1, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Oluşturacağı haritanın amacını belirler.
- b) Oluşturacağı harita için gerekli olan yöntemler ve araç gereci kullanır.
- c) Oluşturacağı haritaya ekleyeceği verileri toplar.
- ç) Oluşturacağı haritanın türünü belirler.
- d) Verileri haritaya işler ve haritanın bileşenlerini oluşturur.
- e) Oluşturduğu haritayı amacına uygun biçimde kullanır.
- f) Oluşturduğu haritayı ihtiyaç duyduğunda tekrar kullanır.

### Coğrafya · Tema 3 — Doğal Sistemler ve Süreçler

#### `COĞ.10.3.1` — Yerkürenin tektonik yapısını çözümleyebilme

- **Dosya:** `cogr_10_t03_c01.json` · **konu_id:** `cogr_10_t03_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** Tektonik Süreçler *(senaryo sayıları: 1, 1, 2, 2, 2, 2)*

**Süreç bileşenleri:**

- a) Levha tektoniğine neden olan süreçleri belirler.
- b) Yeryüzü şekilleri ile levha tektoniği arasındaki ilişkiyi belirler.

#### `COĞ.10.3.2` — Yeryüzü şekillerinin oluşumunda etkili olan aşınma ve çözünme süreçleri ile iklim ve kayaç özellikleri arasındaki ilişkileri yapılandırabilme

- **Dosya:** `cogr_10_t03_c02.json` · **konu_id:** `cogr_10_t03_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** İklim ve Kayaç Yapısının Aşınma ve Çözünme Süreçlerine Etkisi *(senaryo sayıları: 1, 1, 1, 1, 2, 2, 1, 2, 2, 1)*

**Süreç bileşenleri:**

- a) Aşınma ve çözünme süreçleri ile iklim ve kayaç yapısı arasındaki ilişkileri neden-sonuç bağlamında ortaya koyar.
- b) Aşınma ve çözünme süreçlerine ilişkin edindiği bilgilerle kendi bilgilerini anlamlı bir bütün hâline getirir.

#### `COĞ.10.3.3` — Yeryüzü şekillerinin oluşumunu aşınım ve birikim süreçleri açısından çözümleyebilme

- **Dosya:** `cogr_10_t03_c03.json` · **konu_id:** `cogr_10_t03_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** Aşınım ve Birikim Süreçlerinin Yeryüzü Şekillerinin Oluşumuna Etkisi *(senaryo sayıları: 1, 1, 1, 1, 2, 2, 2, 2, 2)*

**Süreç bileşenleri:**

- a) Aşınım ve birikim süreçlerinde ortaya çıkan yeryüzü şekillerini belirler.
- b) Aşınım ve birikim süreçleriyle yeryüzü şekilleri arasındaki ilişkiyi belirler.

#### `COĞ.10.3.4` — Yeryüzü şekillerinin oluşumunda doğal süreçlerin etkilerini saha/sanal saha çalışmalarıyla araştırabilme

- **Dosya:** `cogr_10_t03_c04.json` · **konu_id:** `cogr_10_t03_c04` · **soru:** 12 · **flashcard:** 12 · **süreç:** 6
- **ODSGM sınav konusu:** Yeryüzü Şekilleri ile İlgili Gözlem ve Saha Çalışması *(senaryo sayıları: 1, 1, 1, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Yeryüzü şekillerinin oluşum ve değişimini incelemek için hazırlık yapar.
- b) Yeryüzü şekillerinin oluşum ve değişiminde etkili olan faktörleri belirleyebilmek için çalışma sahasında uygulama yapar.
- c) Yeryüzü şekillerinin oluşum ve değişimiyle ilgili çalışma sahasından bilgi toplar.
- ç) Yeryüzü şekillerinin oluşum ve değişimiyle ilgili çalışma sahasından elde ettiği bilgileri çözümler.
- d) Yeryüzü şekillerinin oluşum ve değişimiyle ilgili çözümlediği bilgilere dayalı tahminde bulunur.
- e) Yeryüzü şekillerinin oluşum ve değişimiyle ilgili tahminlerini raporlar.

#### `COĞ.10.3.5` — Yakın çevresindeki yeryüzü şekilleri ile beşerî faaliyetler arasındaki etkileşimi sorgulayabilme

- **Dosya:** `cogr_10_t03_c05.json` · **konu_id:** `cogr_10_t03_c05` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5
- **ODSGM sınav konusu:** Yeryüzü Şekilleri ile Beşerî Faaliyetler Arasındaki Etkileşim *(senaryo sayıları: 1, 1, 1, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Yakın çevresindeki yeryüzü şekilleri ve beşerî faaliyetler arasındaki etkileşimle ilgili merak ettiği soruları sorar.
- b) Yakın çevresindeki yeryüzü şekilleri ve beşerî faaliyetler arasındaki etkileşimle ilgili bilgi toplar.
- c) Yakın çevresindeki yeryüzü şekilleri ve beşerî faaliyetler arasındaki etkileşimle ilgili topladığı bilgileri düzenler.
- ç) Yakın çevresindeki yeryüzü şekilleri ve beşerî faaliyetler arasındaki etkileşimle ilgili düzenlediği bilgileri çözümler.
- d) Yakın çevresindeki yeryüzü şekilleri ve beşerî faaliyetler arasındaki etkileşimle ilgili çözümlediği bilgilerden çıkardığı sonuçları paylaşır. 50

### Coğrafya · Tema 4 — Beşerî Sistemler ve Süreçler

#### `COĞ.10.4.1` — Yerleşme yeri seçiminde ve yerleşmelerin gelişiminde etkili olan coğrafi faktörleri sorgulayabilme

- **Dosya:** `cogr_10_t04_c01.json` · **konu_id:** `cogr_10_t04_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5
- **ODSGM sınav konusu:** Yeryüzü Şekilleri ile Beşerî Faaliyetler Arasındaki Etkileşim *(senaryo sayıları: 1, 1, 1, 2, 2)*

**Süreç bileşenleri:**

- a) Yerleşme yeri seçiminde ve yerleşmelerin gelişiminde etkili olan coğrafi faktörlere yönelik sorular sorar.
- b) Yerleşme yeri seçiminde ve yerleşmelerin gelişiminde etkili olan coğrafi faktörlere yönelik bilgi toplar.
- c) Yerleşme yeri seçiminde ve yerleşmelerin gelişiminde etkili olan coğrafi faktörlere yönelik topladığı bilgileri düzenler.
- ç) Yerleşme yeri seçiminde ve yerleşmelerin gelişiminde etkili olan coğrafi faktörlere yönelik düzenlediği bilgileri çözümler.
- d) Yerleşme yeri seçiminde ve yerleşmelerin gelişiminde etkili olan coğrafi faktörlere yönelik çözümlediği bilgilerden çıkardığı sonuçları paylaşır.

#### `COĞ.10.4.2` — Türkiye ve dünyadaki yerleşmeleri fonksiyonlarına göre sınıflandırabilme

- **Dosya:** `cogr_10_t04_c02.json` · **konu_id:** `cogr_10_t04_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4
- **ODSGM sınav konusu:** Yerleşmelerin Fonksiyonları *(senaryo sayıları: 1, 1, 1)*

**Süreç bileşenleri:**

- a) Türkiye ve dünyadaki yerleşmelerin fonksiyonları üzerinde etkili olan değişkenleri belirler.
- b) Türkiye ve dünyadaki yerleşmelerin fonksiyonları üzerinde etkili olan değişkenleri ayrıştırır.
- c) Türkiye ve dünyadaki yerleşmelerin fonksiyonları üzerinde etkili olan değişkenleri tasnif eder.
- ç) Türkiye ve dünyadaki yerleşmeleri fonksiyonlarına göre etiketler.

### Coğrafya · Tema 5 — Ekonomik Faaliyetler ve Etkileri

#### `COĞ.10.5.1` — Ekonomik faaliyetleri sektörlere göre sınıflandırabilme

- **Dosya:** `cogr_10_t05_c01.json` · **konu_id:** `cogr_10_t05_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4

**Süreç bileşenleri:**

- a) Ekonomik faaliyetlerin sınıflandırılmasındaki ölçütleri belirler.
- b) Ekonomik faaliyetleri sektörlere göre ayırır.
- c) Ekonomik faaliyetleri sektörlere göre tasnif eder.
- ç) Ekonomik faaliyetleri sektörlere göre etiketler.

#### `COĞ.10.5.2` — Ekonomik sektörlerin dağılımını gösteren tablo, grafik, şekil ve/veya diyagramlar üzerinden farklı gelişmişlik seviyesine sahip ülkeleri karşılaştırabilme

- **Dosya:** `cogr_10_t05_c02.json` · **konu_id:** `cogr_10_t05_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4

**Süreç bileşenleri:**

- a) Farklı gelişmişlik seviyesine sahip ülkelerde ekonomik sektörlerin dağılımını gösteren tablo, grafik, şekil ve/veya diyagramları bileşenleriyle tanır ve anlamlandırır.
- b) Farklı gelişmişlik seviyesine sahip ülkelerde ekonomik sektörlerin dağılımını gösteren tablo, grafik, şekil ve/veya diyagramları çözümler.
- c) Farklı gelişmişlik seviyesine sahip ülkelerde ekonomik sektörlerin dağılımını gösteren tablo, grafik, şekil ve/veya diyagramlardan sonuç çıkarır.
- ç) Farklı gelişmişlik seviyesine sahip ülkelerde ekonomik sektörlerin dağılımını gösteren tablo, grafik, şekil ve/veya diyagramlardan elde ettiği sonuçları karşılaştırır.

#### `COĞ.10.5.3` — Ekonomik sektörlerin Türkiye ekonomisindeki yeri ve önemini gösteren tablo, grafik, şekil ve/veya diyagram hazırlayabilme

- **Dosya:** `cogr_10_t05_c03.json` · **konu_id:** `cogr_10_t05_c03` · **soru:** 12 · **flashcard:** 12 · **süreç:** 6

**Süreç bileşenleri:**

- a) Ekonomik sektörlerin Türkiye ekonomisindeki yeri ve önemine ilişkin oluşturacağı tablo, grafik, şekil ve/veya diyagramın amacını belirler.
- b) Ekonomik sektörlerin Türkiye ekonomisindeki yeri ve önemine ilişkin oluşturacağı tablo, grafik, şekil ve/veya diyagramın türünü ve kullanacağı araç gereci belirler.
- c) Ekonomik sektörlerin Türkiye ekonomisindeki yeri ve önemine ilişkin oluşturacağı tablo, grafik, şekil ve/veya diyagramla ilgili veri toplar.
- ç) Topladığı verileri ekonomik sektörlere göre sınıflandırır.
- d) Ekonomik sektörlere göre sınıflandırdığı verileri görselleştirir.
- e) Ekonomik sektörlerin Türkiye ekonomisindeki yeri ve önemini gösteren tablo, grafik, şekil ve/veya diyagramları amaca uygun şekilde kullanır.

### Coğrafya · Tema 6 — Afetler ve Sürdürülebilir Çevre

#### `COĞ.10.6.1` — Afetlerle mücadelede iyi uygulama örneklerini sorgulayabilme

- **Dosya:** `cogr_10_t06_c01.json` · **konu_id:** `cogr_10_t06_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5

**Süreç bileşenleri:**

- a) Afetlerle mücadelede iyi uygulama örneklerine yönelik merak ettiği soruları sorar.
- b) Afetlerle mücadelede iyi uygulama örnekleri ile ilgili bilgi toplar.
- c) Afetlerle mücadelede iyi uygulama örnekleri hakkında elde ettiği bilgileri düzenler.
- ç) Afetlerle mücadelede iyi uygulama örnekleri hakkında düzenlediği bilgileri çözümler.
- d) Afetle mücadelede iyi uygulama örneklerine ilişkin çözümlediği bilgilerden çıkardığı sonuçları paylaşır.

#### `COĞ.10.6.2` — Afete dirençli yaşam alanlarının coğrafi koşullarını çözümleyebilme

- **Dosya:** `cogr_10_t06_c02.json` · **konu_id:** `cogr_10_t06_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2

**Süreç bileşenleri:**

- a) Afete dirençli yaşam alanlarının coğrafi koşullarını tanımlar.
- b) Afete dirençli yaşam alanlarında yer alan mekânsal unsurların kendi aralarındaki ilişkileri çözümler.

#### `COĞ.10.6.3` — Mekânın özelliklerine göre afetlerden korunma uygulamalarına karar verebilme

- **Dosya:** `cogr_10_t06_c03.json` · **konu_id:** `cogr_10_t06_c03` · **soru:** 12 · **flashcard:** 12 · **süreç:** 6

**Süreç bileşenleri:**

- a) Mekânın özelliklerine göre afetlerden korunma uygulamalarına karar vermeyi amaç olarak belirler.
- b) Mekânın özelliklerine göre afetlerden korunma uygulamalarına ilişkin bilgi toplar.
- c) Mekânın özelliklerine göre afetlerden korunma uygulamalarına alternatif seçenekler oluşturur.
- ç) Mekânın özelliklerine göre afetlerden korunma uygulamalarına alternatif oluşturduğu seçenekler üzerinden çıkarım yapar.
- d) Mekânın özelliklerine göre afetlerden korunma uygulamaları arasından seçim yapar.
- e) Mekânın özelliklerine göre seçtiği afetlerden korunma uygulamalarının sonuçları üzerinde yansıtma yapar.

#### `COĞ.10.6.4` — Afetlerden korunma amacı ile afet bilinci oluşturmanın faydalarını yansıtabilme

- **Dosya:** `cogr_10_t06_c04.json` · **konu_id:** `cogr_10_t06_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Afetlerden korunma amacı ile afet bilinci oluşturmanın faydalarına ilişkin deneyimlerini gözden geçirir.
- b) Afetlerden korunma amacı ile afet bilinci oluşturmanın faydalarına ilişkin deneyimlerinden çıkarım yapar.
- c) Afetlerden korunma amacı ile afet bilinci oluşturmanın faydalarına ilişkin çıkarımlarını değerlendirir.

### Coğrafya · Tema 7 — Bölgeler, Ülkeler ve Küresel Bağlantılar

#### `COĞ.10.7.1` — Türk dünyasının ortak kültürel özellikleri hakkında analojik çıkarım yapabilme

- **Dosya:** `cogr_10_t07_c01.json` · **konu_id:** `cogr_10_t07_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Türk kültürünün yayıldığı alanları gözlemler.
- b) Türk kültürünün yayıldığı alanlardaki kültürel özellikleri tespit eder.
- c) Türk kültürünün yayıldığı alanlardaki ortak kültürel özellikler hakkında çıkarımda bulunur.

---

## Felsefe

10 öğrenme çıktısı · 38 süreç bileşeni · 100 soru

| Tema | Ad | Çıktı | Soru |
| --- | --- | --- | --- |
| 1 | Felsefenin Doğası | 1 | 10 |
| 2 | Felsefe, Mantık ve Argümantasyon | 2 | 20 |
| 3 | Varlık Felsefesi | 1 | 10 |
| 4 | Bilgi Felsefesi | 1 | 10 |
| 5 | Ahlak Felsefesi | 1 | 10 |
| 6 | Estetik ve Sanat Felsefesi | 1 | 10 |
| 7 | Siyaset Felsefesi | 1 | 10 |
| 8 | Din Felsefesi | 1 | 10 |
| 9 | Bilim Felsefesi | 1 | 10 |

### Felsefe · Tema 1 — Felsefenin Doğası

#### `FEL.10.1.1` — Felsefenin anlamını, gelişim sürecini ve işlevini sorgulayabilme

- **Dosya:** `fel_10_t01_c01.json` · **konu_id:** `fel_10_t01_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5
- **ODSGM sınav konusu:** Felsefenin Anlamı Felsefi Düşüncenin Özellikleri Felsefi Düşüncenin Gelişimi Felsefi Sorunun Temel Özellikleri Felsefenin Diğer Alanlarla İlişkisi Felsefenin Bireysel ve Toplumsal İşlevi *(senaryo sayıları: 2, 3, 3, 3, 3, 1, 1, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Felsefenin anlamını merak eder ve felsefenin ortak tanımının imkânına yönelik şüphe duyar.
- b) Felsefi düşüncenin genel özellikleri, ortaya çıkışı ve tarihsel gelişimi üzerine derinlemesine düşünür.
- c) Felsefi soruların temel özelliklerini ifade ederek felsefi soru sorar.
- ç) Felsefenin bilim, din ve sanat alanlarıyla ilişkisine eleştirel yaklaşır.
- d) Felsefenin bireysel ve toplumsal işlevlerini tartışır.

### Felsefe · Tema 2 — Felsefe, Mantık ve Argümantasyon

#### `FEL.10.2.1` — Düşünme ve dil ilişkisini yapılandırabilme

- **Dosya:** `fel_10_t02_c01.json` · **konu_id:** `fel_10_t02_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** Düşünme ve Dil İlişkisi *(senaryo sayıları: 2, 1, 1, 2, 2, 1, 1)*

**Süreç bileşenleri:**

- a) Düşünme ve dil ilişkisini inceleyerek nedensel ilişkiler ortaya koyar.
- b) Tespit ettiği ilişkilerden hareketle uyumlu bir bütün oluşturur.

#### `FEL.10.2.2` — Mantığın temel kavramlarını ve argümantasyon sürecini yorumlayabilme.

- **Dosya:** `fel_10_t02_c02.json` · **konu_id:** `fel_10_t02_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3
- **ODSGM sınav konusu:** Mantık ve Argümantasyonun Temel Kavramları Argümantasyonun Yapısı *(senaryo sayıları: 2, 1, 2, 2, 1, 2, 2, 2, 2)*

**Süreç bileşenleri:**

- a) Mantık ve argümantasyonla ilgili kavramları inceler.
- b) İfadeleri bağlamından koparmadan mantıksal yapılarına göre öncül ve sonuç bileşenlerine ayırarak dönüştürür.
- c) İfadeleri anlamını değiştirmeden, kendi cümleleriyle nesnel ve doğru biçimde yeniden ifade eder.

### Felsefe · Tema 3 — Varlık Felsefesi

#### `FEL.10.3.1` — Varlık felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme

- **Dosya:** `fel_10_t03_c01.json` · **konu_id:** `fel_10_t03_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4
- **ODSGM sınav konusu:** Varlık Felsefesinin Konusu ve Temel Kavramları Varlık Felsefesinin Temel Problemleri (Varlığın Var Olup Olmadığı, Varlığın Ne Olduğu) *(senaryo sayıları: 3, 2, 2, 2, 3)*

**Süreç bileşenleri:**

- a) Varlık felsefesinin konusunu ve temel kavramlarını açıklar.
- b) Varlık felsefesinin temel problemlerini açıklar.
- c) Varlık felsefesinin temel problemlerine yönelik düşünce ve argümanları değerlendirir.
- ç) Varlık felsefesiyle ilgili metinlerde yer alan kavram, problem ve argümanları inceler.

### Felsefe · Tema 4 — Bilgi Felsefesi

#### `FEL.10.4.1` — Bilgi felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme

- **Dosya:** `fel_10_t04_c01.json` · **konu_id:** `fel_10_t04_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4
- **ODSGM sınav konusu:** Bilgi Felsefesinin Konusu ve Temel Kavramları Bilgi Felsefesinin Temel Problemleri (Bilginin İmkânı, Kaynağı ve Doğruluk Ölçütleri) *(senaryo sayıları: 1, 1, 1, 2, 2)*

**Süreç bileşenleri:**

- a) Bilgi felsefesinin konusunu ve temel kavramlarını açıklar.
- b) Bilgi felsefesinin temel problemlerini açıklar.
- c) Bilgi felsefesinin temel problemlerine yönelik düşünce ve argümanları değerlendirir.
- ç) Bilgi felsefesiyle ilgili metinlerde yer alan kavram, problem ve argümanları inceler.

### Felsefe · Tema 5 — Ahlak Felsefesi

#### `FEL.10.5.1` — Ahlak felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme

- **Dosya:** `fel_10_t05_c01.json` · **konu_id:** `fel_10_t05_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4

**Süreç bileşenleri:**

- a) Ahlak felsefesinin konusunu ve temel kavramlarını açıklar.
- b) Ahlak felsefesinin temel problemlerini açıklar.
- c) Ahlak felsefesinin temel problemlerine yönelik düşünce ve argümanları değerlendirir.
- ç) Ahlak felsefesiyle ilgili metinlerde yer alan kavram, problem ve argümanları inceler.

### Felsefe · Tema 6 — Estetik ve Sanat Felsefesi

#### `FEL.10.6.1` — Estetik ve sanat felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme

- **Dosya:** `fel_10_t06_c01.json` · **konu_id:** `fel_10_t06_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4

**Süreç bileşenleri:**

- a) Estetik ve sanat felsefesinin konusunu ve temel kavramlarını açıklar.
- b) Estetik ve sanat felsefesinin temel problemlerini açıklar.
- c) Estetik ve sanat felsefesinin temel problemlerine yönelik düşünce ve argümanları değerlendirir.
- ç) Estetik ve sanat felsefesiyle ilgili metinlerde yer alan kavram, problem ve argümanları inceler.

### Felsefe · Tema 7 — Siyaset Felsefesi

#### `FEL.10.7.1` — Siyaset felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme

- **Dosya:** `fel_10_t07_c01.json` · **konu_id:** `fel_10_t07_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4

**Süreç bileşenleri:**

- a) Siyaset felsefesinin konusunu ve temel kavramlarını açıklar.
- b) Siyaset felsefesinin temel problemlerini açıklar.
- c) Siyaset felsefesinin temel problemlerine yönelik düşünce ve argümanları değerlendirir.
- ç) Siyaset felsefesiyle ilgili metinlerde yer alan kavram, problem ve argümanları inceler.

### Felsefe · Tema 8 — Din Felsefesi

#### `FEL.10.8.1` — Din felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme

- **Dosya:** `fel_10_t08_c01.json` · **konu_id:** `fel_10_t08_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4

**Süreç bileşenleri:**

- a) Din felsefesinin konusunu ve temel kavramlarını açıklar.
- b) Din felsefesinin temel problemlerini açıklar.
- c) Din felsefesinin temel problemlerine yönelik düşünce ve argümanları değerlendirir.
- ç) Din felsefesiyle ilgili metinlerde yer alan kavram, problem ve argümanları inceler.

### Felsefe · Tema 9 — Bilim Felsefesi

#### `FEL.10.9.1` — Bilim felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme

- **Dosya:** `fel_10_t09_c01.json` · **konu_id:** `fel_10_t09_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4

**Süreç bileşenleri:**

- a) Bilim felsefesinin konusunu ve temel kavramlarını açıklar.
- b) Bilim felsefesinin temel problemlerini açıklar.
- c) Bilim felsefesinin temel problemlerine yönelik düşünce ve argümanları değerlendirir.
- ç) Bilim felsefesiyle ilgili metinlerde yer alan kavram, problem ve argümanları inceler.

---

## Din Kültürü

17 öğrenme çıktısı · 65 süreç bileşeni · 170 soru

| Tema | Ad | Çıktı | Soru |
| --- | --- | --- | --- |
| 1 | İslam’da Varlık ve Bilgi | 3 | 30 |
| 2 | Allah’ı Tanımak | 3 | 30 |
| 3 | İslam’ın Evrensel Mesajları | 4 | 40 |
| 4 | Din, Çevre ve Teknoloji | 4 | 40 |
| 5 | İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar | 3 | 30 |

### Din Kültürü · Tema 1 — İslam’da Varlık ve Bilgi

#### `DKAB.10.1.1` — İslam’da bilginin yerini ve kaynaklarını çözümleyebilme

- **Dosya:** `din_10_t01_c01.json` · **konu_id:** `din_10_t01_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2
- **ODSGM sınav konusu:** İslam’da Bilgi ve Bilginin Kaynakları *(senaryo sayıları: 2, 2, 1, 2, 1, 1)*

**Süreç bileşenleri:**

- a) İslam düşüncesinde bilginin yerini ve kaynaklarını inceler.
- b) İslam düşüncesinde bilginin yeri ve kaynakları arasındaki ilişkiyi belirler.

#### `DKAB.10.1.2` — Allah-âlem ilişkisini müşahede edebilme

- **Dosya:** `din_10_t01_c02.json` · **konu_id:** `din_10_t01_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4
- **ODSGM sınav konusu:** Allah-Âlem İlişkisi *(senaryo sayıları: 3, 2, 3, 3, 1, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Allah-âlem ilişkisiyle ilgili merak ettiklerini belirler.
- b) Allah-âlem ilişkisiyle ilgili merak ettiklerine dair sorular sorar.
- c) Allah-âlem ilişkisiyle ilgili kavramları inceler.
- ç) Allah-âlem ilişkisi hakkında inceleme sonuçlarından hareketle çıkarım yapar.

#### `DKAB.10.1.3` — İsra suresinin 36 ve Mülk suresinin 23. ayetlerinin mesajlarını anlamak için Kur’an-ı Kerim meallerine başvurabilme

- **Dosya:** `din_10_t01_c03.json` · **konu_id:** `din_10_t01_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5
- **ODSGM sınav konusu:** Kur’an’dan Mesajlar *(senaryo sayıları: 1, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Ayetlerin meallerini bulur.
- b) Ayetlerde geçen konu ve kavramları belirler.
- c) Ayetleri içeriklerine göre sınıflandırır.
- ç) Ayetlerin içerdiği mesajlarla ilgili çıkarım yapar.
- d) Ayetlerde verilen mesajlarla ilgili çıkarımlarını kendi cümleleriyle ifade eder.

### Din Kültürü · Tema 2 — Allah’ı Tanımak

#### `DKAB.10.2.1` — Allah’ın (cc) varlığının delillerini müşahede edebilme

- **Dosya:** `din_10_t02_c01.json` · **konu_id:** `din_10_t02_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4
- **ODSGM sınav konusu:** Allah’ın Varlığının Delilleri *(senaryo sayıları: 1, 1, 1, 1, 2, 2, 2, 2, 2)*

**Süreç bileşenleri:**

- a) Allah’ın (cc) varlığının delilleriyle ilgili merak ettiklerini belirler.
- b) Allah’ın (cc) varlığının delilleriyle ilgili sorular sorar.
- c) Allah’ın (cc) varlığının delillerini inceler.
- ç) Allah’ın (cc) varlığının delilleriyle ilgili inceleme sonuçları hakkında çıkarım yapar.

#### `DKAB.10.2.2` — Allah’ı (cc) gereği gibi tanıyabilmek için O’nun isim ve sıfatlarını bağlamına uygun kullanabilme

- **Dosya:** `din_10_t02_c02.json` · **konu_id:** `din_10_t02_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4
- **ODSGM sınav konusu:** Allah’ı İsim ve Sıfatlarıyla Tanımak *(senaryo sayıları: 2, 2, 2, 2, 2, 2)*

**Süreç bileşenleri:**

- a) Ayet ve hadislerde yer alan Allah’ın (cc) isim ve sıfatlarını fark eder.
- b) Allah’ın (cc) isimleri ve sıfatları arasında ilişki kurar.
- c) Allah’ın (cc) isimleri ve sıfatlarının benzerliklerini ve farklılıklarını açıklar.
- ç) Allah’ın (cc) isim ve sıfatlarına sözlü ve yazılı iletişimde bağlamına uygun olarak yer verir.

#### `DKAB.10.2.3` — Haşr suresinin 22-24. ayetlerindeki mesajları anlamak için Kur’an-ı Kerim meallerine başvurabilme

- **Dosya:** `din_10_t02_c03.json` · **konu_id:** `din_10_t02_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5
- **ODSGM sınav konusu:** Kur’an’dan Mesajlar *(senaryo sayıları: 1, 1, 1, 1, 1, 1)*

**Süreç bileşenleri:**

- a) Ayetlerin mealini bulur.
- b) Ayetlerde geçen konu ve kavramları belirler.
- c) Ayetleri içeriklerine göre sınıflandırır.
- ç) Ayetlerin içerdiği mesajlarla ilgili çıkarım yapar.
- d) Ayetlerde verilen mesajlarla ilgili çıkarımlarını kendi cümleleriyle ifade eder.

### Din Kültürü · Tema 3 — İslam’ın Evrensel Mesajları

#### `DKAB.10.3.1` — İslam’ın evrensel mesajlarından biri olan tevhit ilkesi hakkında bilgi toplayabilme

- **Dosya:** `din_10_t03_c01.json` · **konu_id:** `din_10_t03_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4
- **ODSGM sınav konusu:** İslam’ın Tevhit İlkesi *(senaryo sayıları: 1, 1, 1)*

**Süreç bileşenleri:**

- a) İslam’da tevhit ilkesi hakkında bilgiye ulaşmak için kullanacağı kaynakları araştırır.
- b) Belirlediği kaynaklardan İslam’da tevhit ilkesi hakkında bilgileri bulur.
- c) İslam’da tevhit ilkesi hakkında elde ettiği bilgileri ayet ve hadisler ışığında doğrular.
- ç) İslam’da tevhit ilkesi hakkında elde ettiği bilgileri kaydeder.

#### `DKAB.10.3.2` — İslam’da adalet ve eşitlik kavramlarını bağlamına uygun kullanabilme

- **Dosya:** `din_10_t03_c02.json` · **konu_id:** `din_10_t03_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4

**Süreç bileşenleri:**

- a) İslam’da adalet ve eşitlik kavramlarının önemini fark eder.
- b) İslam’da adalet ve eşitlik kavramları arasında ilişki kurar.
- c) İslam’da adalet ve eşitlik kavramlarının benzerliklerini ve farklılıklarını açıklar.
- ç) İslam’da adalet ve eşitlik kavramlarına sözlü ve yazılı iletişimde bağlamına uygun olarak yer verir.

#### `DKAB.10.3.3` — İslam ve barış ilişkisini yorumlayabilme

- **Dosya:** `din_10_t03_c03.json` · **konu_id:** `din_10_t03_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) İslam ve barış ilişkisini inceler.
- b) İslam ve barış ilişkisini bağlamı içerisinde kendisi için anlamlı hâle getirir.
- c) İslam ve barış ilişkisini nesnel ve doğru bir şekilde ifade eder.

#### `DKAB.10.3.4` — Nahl suresinin 90, Nisa suresinin 58 ve Bakara suresinin 208. ayetlerinin mesajlarını anlamak için Kur’an-ı Kerim meallerine başvurabilme

- **Dosya:** `din_10_t03_c04.json` · **konu_id:** `din_10_t03_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5

**Süreç bileşenleri:**

- a) Ayetlerin meallerini bulur.
- b) Ayetlerde geçen konu ve kavramları belirler.
- c) Ayetleri içeriklerine göre sınıflandırır.
- ç) Ayetlerin içerdiği mesajlarla ilgili çıkarım yapar.
- d) Ayetlerde verilen mesajlarla ilgili yaptığı çıkarımları kendi cümleleriyle ifade eder.

### Din Kültürü · Tema 4 — Din, Çevre ve Teknoloji

#### `DKAB.10.4.1` — İnsan, çevre ve ahlak arasındaki ilişkiyi yorumlayabilme

- **Dosya:** `din_10_t04_c01.json` · **konu_id:** `din_10_t04_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) İnsan, çevre ve ahlak arasındaki ilişkiyi inceler.
- b) Çevreye karşı ahlaki sorumluluklarını bağlamından koparmadan kendi yaşantısı için anlamlı hâle getirir.
- c) İnsan ve çevre arasındaki ilişkiyi nesnel bir biçimde ifade eder.

#### `DKAB.10.4.2` — Teknoloji ve ahlak ilişkisini çözümleyebilme

- **Dosya:** `din_10_t04_c02.json` · **konu_id:** `din_10_t04_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 2

**Süreç bileşenleri:**

- a) Teknoloji ve ahlakla ilgili unsurları araştırır.
- b) Teknoloji ve ahlakla ilgili unsurlar arasındaki ilişkileri belirler.

#### `DKAB.10.4.3` — Çevre ve teknoloji ilişkisini özetleyebilme

- **Dosya:** `din_10_t04_c03.json` · **konu_id:** `din_10_t04_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Çevre ve teknoloji ilişkisi ile ilgili çözümleme yapar.
- b) Çevre ve teknoloji arasındaki ilişkileri sınıflandırır.
- c) Çevre ve teknoloji ilişkisini açıklar.

#### `DKAB.10.4.4` — Rum suresinin 41. ayetinin mesajlarını anlamak için Kur’an-ı Kerim meallerine başvurabilme

- **Dosya:** `din_10_t04_c04.json` · **konu_id:** `din_10_t04_c04` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5

**Süreç bileşenleri:**

- a) Ayetin mealini bulur.
- b) Ayette geçen konu ve kavramları belirler.
- c) Ayette geçen konuları sınıflandırır.
- ç) Ayetin içerdiği mesajlarla ilgili çıkarım yapar.
- d) Ayette verilen mesajlarla ilgili çıkarımlarını kendi cümleleriyle ifade eder.

### Din Kültürü · Tema 5 — İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar

#### `DKAB.10.5.1` — Dinî yorum farklılıklarının ortaya çıkış sebeplerini sentezleyebilme

- **Dosya:** `din_10_t05_c01.json` · **konu_id:** `din_10_t05_c01` · **soru:** 10 · **flashcard:** 10 · **süreç:** 3

**Süreç bileşenleri:**

- a) Dinî yorum farklılıklarının ortaya çıkış sebeplerinin neler olduğunu belirler.
- b) Dinî yorum farklılıklarının ortaya çıkış sebepleri arasında ilişki kurar.
- c) Dinî yorum farklılıklarının ortaya çıkış sebepleriyle ilgili bütünsel bakış açısına ulaşır.

#### `DKAB.10.5.2` — İslam düşüncesindeki itikadi-siyasi ve fıkhi yorumları irdeleyebilme

- **Dosya:** `din_10_t05_c02.json` · **konu_id:** `din_10_t05_c02` · **soru:** 10 · **flashcard:** 10 · **süreç:** 4

**Süreç bileşenleri:**

- a) İslam düşüncesindeki itikadi-siyasi ve fıkhi yorumları tespit eder.
- b) İslam düşüncesindeki itikadi-siyasi ve fıkhi yorumları karşılaştırır.
- c) İslam düşüncesindeki itikadi-siyasi ve fıkhi yorumları temel dinî bilgi kaynaklarını ölçüt alarak inceler.
- ç) İslam düşüncesindeki itikadi-siyasi ve fıkhi yorumları açıklar.

#### `DKAB.10.5.3` — Hucurat suresinin 13. ayetinin mesajlarını anlamak için Kur’an’ı Kerim meallerine başvurabilme

- **Dosya:** `din_10_t05_c03.json` · **konu_id:** `din_10_t05_c03` · **soru:** 10 · **flashcard:** 10 · **süreç:** 5

**Süreç bileşenleri:**

- a) Ayetin mealini bulur.
- b) Ayette geçen konu ve kavramları belirler.
- c) Ayette geçen konuları sınıflandırır.
- ç) Ayetin içerdiği mesajlarla ilgili çıkarım yapar.
- d) Ayette verilen mesajlarla ilgili çıkarımları kendi cümleleriyle ifade eder.

---

## Tema adı çözülemeyen başlıklar

Aşağıdaki temalarda resmî ad **kanıtlanamadığı için boş bırakıldı** (uydurulmadı).
Soru üretimi için tema numarası ve MEB kodu yeterlidir.


## Sırada ne var?

Soru üretimi talimatı: **`docs/uretim/SORU-URETIM-TALIMATI.md`**

```bash
node scripts/soru-uret-dogrula.js <dizin>       # üretilen havuzları doğrula
node scripts/havuz-index-uret.js --plan         # manifest üret + planla karşılaştır
```
