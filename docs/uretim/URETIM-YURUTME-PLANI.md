# Soru Havuzu Üretimi — Yürütme Planı (10. Sınıf, 158 çıktı)

> Bu dosya **plan**dır; üretim başladığında canlı durum `docs/uretim/DURUM.md` içinde tutulur.
> Kaynak kurallar: `docs/uretim/SORU-URETIM-TALIMATI.md` (SÜRÜM 3) +
> `docs/uretim/TUM-KAZANIMLAR-10SINIF.md` (SÜRÜM 3) + kullanıcının vereceği **ders kitapları**.

---

## 0. Ölçülen başlangıç durumu (16 Kasım 2026)

Depoda hazır olan ve doğrulanmış altyapı:

| Bileşen | Durum |
| --- | --- |
| Makine okunur plan (`scripts/uretim-veri.js`) | ✅ 158 kayıt · 612 süreç · 1.686 hedef soru · konu_id'ler tekil |
| Plan doğrulama testi (`npm run -s test:tymm`) | ✅ 67/67 |
| Tüm testler (`npm run -s test:hepsi`) | ✅ 86/86 |
| Havuz doğrulayıcı (`scripts/soru-uret-dogrula.js`) | ✅ çalışıyor (şema, süreç kapsaması, tekrar, dağılım, kart 1:1, görsel atfı) |
| Manifest üretici (`scripts/havuz-index-uret.js --plan`) | ✅ çalışıyor |
| Görsel tipleri (`site/gorsel.js`) | ✅ 7 tip + `dogrula()` |
| **Yeni şemadaki havuz** (`site/content/soru_havuzlari/*_t0X_c0Y.json`) | **0 / 158** |
| Eski şema havuz (2018, `*_10_uNN_kNN.json`) | 172 dosya · 1.956 soru — denetim dışı, **silinmeyecek** |

Ölçüm komutları (kanıt):

```
node scripts/havuz-index-uret.js --plan --kontrol   → havuz: 172 · plana göre kapsanan: 0/158
node scripts/soru-uret-dogrula.js site/content/soru_havuzlari → eksik havuz: 158/158, 0 hata
```

**Sonuç:** üretim gerçekten sıfırdan. Yazılacak içerik: **1.686 soru + 1.686 flashcard**, 158 dosya.

---

## 1. Hacim gerçeği ve tur (oturum) modeli

1.686 soru ≈ 1,2 milyon karaktere yakın Türkçe içerik. Bu **tek turda üretilemez**; doğru model
"küçük partiler + her partide otomatik kapı + ders sonunda dönem kapanışı".

| Ölçü | Değer |
| --- | --- |
| Havuz başına soru | 10 (çoğunluk) – 12/14 (süreç sayısı çok olanlar) |
| Tur başına hedef | **3–5 havuz** (≈ 40–60 soru + aynı sayıda kart) |
| Tahmini toplam tur | **≈ 40–50** (ders kitapları geldikçe) |
| Tur içi akış | üret → tek havuz denetimi → ders dizini denetimi → commit → kısa rapor |

Ben durmadan, senin yeni komutunu beklemeden ilerlerim; **sadece şu 4 durumda dururum**:

1. Sıradaki dersin **kitabı elimde yok** (yeni PDF gerekli),
2. Kitap metni okunamıyor (taranmış sayfa → OCR kararı gerekli),
3. Kitap ile resmî kazanım **çelişiyor** ya da kaynakta veri yok (uydurma yasağı),
4. Pilot kalite onayı (Faz 0 sonunda, tek seferlik).

---

## 2. Faz 0 — Altyapı ve kabul kapıları (1 tur, içerik üretmeden)

Yeni araçlar `docs/uretim/araclar/` altına konur (talimat §12'deki yazma izinlerine uymak için
`scripts/` ve uygulama kodu **değiştirilmez**):

| Araç | İş |
| --- | --- |
| `araclar/kitap-metin.py` | PDF → sayfa numaralı metin (`docs/uretim/.kitap-metin/<ders>.json`). `pypdf` ile; taranmış sayfada uyarı verir |
| `araclar/kitap-harita.js` | Kitap içindekiler → **tema/ünite → sayfa aralığı** haritası; `docs/uretim/kitaplar/<ders>.md` üretir |
| `araclar/havuz-denetle.js` | Tek havuzu hızlı denetler **+ doğrulayıcının denetlemediği** kurallar: soru kökü 30–600 kr, `cozum` ≥ 25 kr, "hepsi/hiçbiri" yasağı, seçenek uzunluk dengesi, A/B/C/D dağılımı, ders içi benzerlik (yakın-tekrar) |
| `araclar/kart-senkron.js` | `flashcards` dizisini sorulardan **yeniden üretir** (`id = <soru_id>:flashcard`), 1:1 garantisi |
| `araclar/is-emri.js` | `konu_id` → plan satırı: kod, kazanım, süreç listesi (etiketleri `a)` temizlenmiş), hedef soru, dosya adı şablonu |
| `araclar/durum.js` | `docs/uretim/DURUM.md` panosunu üretir: ders × tema × havuz durumu, soru/kart sayısı, kapı sonuçları |
| `docs/uretim/SABLON.json` | Talimat §6.4'teki altın örnek (doğrulayıcıdan geçmiş) — birebir şablon |
| `docs/uretim/KAYNAK-DEFTERI.md` | Ders → kitap adı, PDF sha256, sayfa sayısı, tema→sayfa haritası, `kaynak` alanı biçimi |
| `.gitignore` | `.kitap-metin/`, `*.pdf` — telif + boyut; kitap metni repoya **girmez** |

**Faz 0 çıkışı:** araçların hepsi kurulur, altın örnek (`docs/uretim/SABLON.json`) iki
doğrulayıcıdan da geçirilir. İçerik üretimi **ilk ders kitabı gelince** başlar.

> **Kararlaşan akış (kullanıcı seçimi):** pilot 2 havuz yerine **ilk dersin tamamı**
> (Fizik · 22 havuz / 220 soru) üretilip onaya sunulur; onaydan sonra sıradaki derse geçilir.

Araçların doğrulama testi (bu fazda yapıldı):

```
SABLON.json → soru-uret-dogrula.js        → 0 hata ✅
SABLON.json → havuz-denetle.js            → 0 hata, 4 uyarı (bilinçli: kaynak yok, 4/2/2/2 dağılım)
bozuk kopya → havuz-denetle.js            → 9 hata, çıkış kodu 1 ✅ (kısa kök, "hepsi/hiçbiri",
                                             kısa çözüm, şekilde+görselsiz, havuz içi tekrar, kart 1:1)
kitap-metin.py → 18 sayfalık test PDF     → 18/18 sayfa metin, 0 zayıf sayfa ✅
kart-senkron.js → SABLON                  → havuz kartlarını sorulardan yeniden üretti, doğrulayıcı geçti ✅
```

---

## 3. Kitap protokolü (NotebookLM mantığı)

### 3.0 Kitap nasıl ulaşır — sandbox ağ kısıtı

Ölçüldü (16 Kasım 2026): bu ortamdan **yalnızca GitHub, npm ve PyPI** erişilebilir.
`drive.google.com` **kapalı** (`SSL_ERROR_SYSCALL`), `tymm.meb.gov.tr` ve
`ogmmateryal.eba.gov.tr` de kapalı. Yani **Drive bağlantısından kitap indirilemez.**

Kullanılabilir iki yol:

| Yol | Nasıl | Not |
| --- | --- | --- |
| **A. Parçalı yükleme** (önerilen) | PDF'i sayfa aralıklarına böl (ör. 1–80, 81–160 …), her parçayı ayrı mesajda yükle | Parçalar sırayla `--ekle` ile birleşir, sayfa numaraları sürekli kalır |
| **B. GitHub üzerinden** | **özel** bir depo aç → PDF'i *release asset* olarak yükle (2 GB sınırı) → bana `owner/repo` + etiket söyle | `gh release download` ile indiririm; herkese açık depo **önerilmez** (telif) |

Kitap metni `.gitignore`'da: repoya commit edilmez, üretim bitince silinebilir.

### 3.1 İşleyiş

1. **Kitap gelir** (PDF parça(ları)) → `docs/uretim/.kitap-metin/<ders>.json` (sayfa sayfa).
2. **sha256 + sayfa sayısı** kaynak defterine yazılır (izlenebilirlik).
3. **Tema→sayfa haritası** çıkarılır. Her havuzun `kaynak` alanı:
   `"<Ders> 10 ders kitabı, s. a-b"` — uydurma sayfa yazılmaz.
4. **Tek referans kitaptır.** Kazanım cümlesi ve süreç bileşenleri resmî programdan
   **birebir** gelir ve değiştirilmez (talimat §1, §7.1).
5. Kitapta olmayan sayısal veri, tarih, ayet/hadis meali, formül **yazılmaz**; gerekli bilgi
   kitapta yoksa o soru başka bir süreç bileşenine kaydırılır ve not düşülür.
6. Kitap metni **repoya commit edilmez** (telif). Üretim bittiğinde önbellek silinebilir;
   kitap yeniden verildiğinde 1 komutla yeniden çıkarılır.
7. Taranmış PDF çıkarsa: OCR (`tesseract.js`, depoda bağımlılık var) ya da kullanıcıdan
   metin katmanlı kopya istenir. Bu, durma noktalarından biridir.

---

## 4. Havuz üretim döngüsü (her dosya için 8 adım)

```
1  is-emri.js <konu_id>          → kod, kazanım, süreç listesi, hedef soru
2  kitap sayfalarını oku         → kaynak defterindeki sayfa aralığı
3  soruları yaz                  → süreç bileşeni başına ≥2 soru
                                   alt_beceri = resmî süreç metni (birebir, "a)" etiketsiz)
4  her soru için 1 flashcard     → kart, sorunun öğrettiği TEK şeyi sorar (soru kopyası değil)
5  görsel kararı — TEK TEK       → metin "şekilde/grafikte/tabloda/devrede/haritada…" diyorsa
                                   gorsel ZORUNLU; gereksizse alan hiç yazılmaz
6  kart-senkron.js               → flashcards dizisi sorularla birebir
7  havuz-denetle.js <dosya>      → hızlı kapı (hata varsa 3–5'e dön)
8  ders dizini kapıları          → soru-uret-dogrula + havuz-index-uret --kontrol + validate:pools
```

Ek yazım kuralları (üretim sırasında uygulanacak):

### 4.1 Kart ≠ soru: kart tanım/formül, soru kavrama

Depodaki önceki havuzlar (`MANUAL_INCELEME.md` §"MCQ–flashcard çifti örneklemi",
`TEST_BULGULARI_.md` F12/H8/H10 ve BKT şartnamesi) kart biçimini şöyle tanımlıyor:

| Öğe | Ne sorar | Örnek |
| --- | --- | --- |
| **Soru (MCQ)** | Kazanımın **kavrama** düzeyi: senaryo, veri, karşılaştırma, hesap | "Bir taşıyıcı bant valizi 40 s'de 8 m, sonra 20 s'de 4 m taşıyor. Hangi sonuca ulaşılır?" |
| **Kart (flashcard)** | **Bilgi Bankası maddesi:** tanım, formül, birim, kural — *üretim kartı* | "Ortalama süratin matematiksel modelini yazınız." → "Ortalama sürat = alınan yol / geçen zaman." |

Yasaklar (araç bunları **hata** olarak yakalar, `havuz-denetle.js`):

- Tanıma kartı: `hangisi`, `aşağıdaki`, seçenek listesi → **yasak**
- Kart önü, soru kökünün kopyası/özeti (trigram benzerliği > %50) → **hata**, > %35 → uyarı
- Kart önünde şekil/tablo atfı (`şekilde`, `grafikte`, `tabloda`) → **hata**
- Kart arka yüzü 2 cümleden uzun ya da 220 karakterden fazla → uyarı
- Soru kökü tanım/hatırlama düzeyindeyse (sayı yok + "nedir/hangi niceliği verir") → uyarı: kavrama senaryosuna çevrilir
- Kart önü tanım/formül kalıbı taşımıyorsa (`nedir`, `tanımlayınız`, `formül`, `model`, `birim`, `… ilişki`) → uyarı

- **Cevap dengesi:** havuz içinde hiçbir şık %40'ı geçmez → 10 soruda en çok 4; ders genelinde
  A/B/C/D ~%25 hedeflenir (eski havuzlarda A %34,8 idi — tekrarlanmayacak).
- **Çeldirici:** yanlış şıklar konuyla ilgili yaygın kavram yanılgılarından; "hepsi/hiçbiri" yok.
- **Tekrar:** soru kökü hem havuz içinde hem **tüm havuzlarda** tekil (doğrulayıcı global kontrol eder).
- **Dil:** öğrenci seviyesi, açık Türkçe; din/tarih'te resmî anlatım korunur.
- **Telif:** kitaptaki soru birebir alınmaz; bilgiyle **özgün** soru yazılır.

### 4.2 Bilgi grafikle verilir: grafik sorusu **çizilmiş grafik** üzerinden sorulur

Ders kitapları bilgiyi ağırlıkla **grafik, tablo ve şekil** üzerinden veriyor (Fizik 1. ünitede `x-t`,
`v-t`, `a-t` grafikleri; deney sayfalarında veri tabloları; yansıma/kırılma şekilleri). Bu nedenle:

- **Metin görsele gönderme yapıyorsa `gorsel` zorunlu** (araç: `SEKİL_ATFI` listesi → *hata*).
- Sözel grafik tarifi **yerine gerçek görsel** kullanılır: "hız-zaman grafiği yatay eksene paralel olan cisim…"
  gibi bir kök yerine `grafik` tipiyle **çizilmiş grafik** verilir; soru grafikten okunacak biçimde yazılır
  (eğim → hız/ivme/direnç, alan → yer değiştirme/hız değişimi/iş).
- Tema başına tipik görsel eşleşmesi:

| Tema / konu | Görsel tipi | Ne sorulur |
| --- | --- | --- |
| Hareket (sabit hızlı, ivmeli) | `grafik` | eğim = hız / ivme, alan = yer değiştirme, yön (negatif eğim) |
| İş–enerji–güç | `grafik`, `tablo` | F-x alanı = iş, deney tablosundan güç/enerji |
| Elektrik | `grafik`, `tablo` | V-I eğimi = direnç, deney tablosundan eşdeğer direnç/üreteç davranışı |
| Dalgalar | `grafik`, `tablo`, `geometri` | periyot/dalga boyu okuma, ortam sürati tablosu, yansıma açıları |
| Kimya (çözünürlük, iletkenlik), Coğrafya (harita/kesit) | `grafik`, `tablo`, `geometri` | eksen okuma, karşılaştırma, kesit yorumu |

- **Oran hedefi:** ders genelinde görselli soru **≥ %10**, grafik/tablo yoğun temalarda **≥ %30**.
- **Amaç az görsel değil, doğru görsel:** her soru tek tek incelenir; `gerekmez` kararı gerekçelenir
  (`GORSEL-INCELEME.md`). Şekle bağımlı veri yoksa görsel eklenmez, **uydurma görsel konmaz**.
- **Fizik kapanışı (22 havuz / 220 soru):** 27 görselli (%12) — 18 `grafik`, 8 `tablo`, 1 `geometri`;
  grafik yoğun 1. ünitede (Hareket) 30 sorunun 12'si (%40).

---

## 5. Kalite kapıları (her tur sonunda çalıştırılır)

| # | Komut | Eşik |
| --- | --- | --- |
| 1 | `node docs/uretim/araclar/havuz-denetle.js <dosya>` | 0 hata |
| 2 | `node scripts/soru-uret-dogrula.js site/content/soru_havuzlari` | 0 hata |
| 3 | `node scripts/havuz-index-uret.js --plan --kontrol` | 0 hata, kapsanan sayısı artmış |
| 4 | `npm run -s validate:pools` | hepsi geçerli |
| 5 | `npm run -s test:hepsi` | 86/86 (ders kapanışında) |
| 6 | `INCELEME=1 node scripts/soru-uret-dogrula.js …` | listedeki her soru gözden geçirildi |

Ders kapanışında ek olarak: **ders ortalaması** (soru/havuz, şık dağılımı, görselli oran,
kart=soru), `docs/uretim/DURUM.md` güncellemesi ve tek commit.

---

## 6. Ders sırası ve parti planı

Sıra **kitapların geliş sırasına** göre belirlenir; aşağıdaki tablo varsayılan sıradır
(değiştirilebilir). Her satır bir "dönem"dir; dönem sonunda commit + ders raporu.

| Dönem | Ders | Havuz | Soru | Tahmini tur | Not |
| --- | --- | --- | --- | --- | --- |
| 1 | Fizik | 22 | 220 | 5–6 | grafik/devre görselleri yoğun |
| 2 | Kimya | 21 | 214 | 5 | tanecik modeli/deney düzeneği semaları |
| 3 | Biyoloji | 19 | 190 | 4–5 | süreç/enerji piramidi görselleri |
| 4 | Matematik | 21 | 274 | 6–7 | soru başına en yüksek yük (trigonometri/geometri görselleri) |
| 5 | Coğrafya | 18 | 190 | 4–5 | harita/kesit semaları |
| 6 | Tarih | 14 | 140 | 3–4 | sözel ağırlıklı |
| 7 | Felsefe | 10 | 100 | 2–3 | sözel |
| 8 | Din Kültürü | 17 | 170 | 4 | sözel; pilot burada |
| 9 | Türk Dili ve Edebiyatı | 16 | 188 | 4–5 | metin temelli sorular |
| — | **Toplam** | **158** | **1.686** | **≈ 40–50** | |

Küçük partiler hâlinde ilerlemek bilinçli bir tercih: her partide doğrulayıcı çalıştığı için hata
birikmiyor; 1.686 soruluk tek blokta kalite kontrolü imkânsız olurdu.

---

## 7. Dal / commit / teslim akışı — talimatla tek fark

Talimat §2 ayrı bir `soru-uretim` dalı açmayı söylüyor. **Bu oturumun dalı sabittir:**
`arena/4cc1805b-analiz-merkezi` (dal değiştirmek/başka dala push etmek yasak).

Bu yüzden uygulanacak akış:

- Tüm çalışma `arena/4cc1805b-analiz-merkezi` üzerinde, ders dönemi başına **1 commit**:
  `fiz: 10. sınıf soru havuzları (22 havuz / 220 soru)` gibi.
- `main`'e push **yok**, PR #4 merge **yok** (talimat §2 yasakları korunur).
- PR açılacaksa hedef dal (`main` mı, `arena/cc4de070-analiz-merkezi` mi) **senin kararın**.

---

## 8. Riskler ve önlemler

| Risk | Önlem |
| --- | --- |
| Hacim → tur taşması, yarım dosya | Parti başına 3–5 havuz; her tur sonunda commit; yarım dosya commit edilmez |
| Süreç metni birebir tutmama (en sık hata) | `alt_beceri` değerleri plan satırından **kopyalanır**, elle yazılmaz; doğrulayıcı reddeder |
| Cevap A'da yığılması | `havuz-denetle.js` dağılımı her dosyada zorlar |
| Flashcard = soru kopyası | Kart, çözüm sonrası akılda kalması gereken tek bilgiyi sorar; denetim aracı benzerliği uyarır |
| "Şekildeki" deyip görsel koymamak | Doğrulayıcı hata verir; `INCELEME=1` listesi ayrıca tek tek gözden geçirilir |
| Kitapta olmayan veri uydurma | `kaynak` alanı zorunlu iz; sayfa dışı bilgi yazılmaz |
| Taranmış PDF | OCR ya da metin katmanlı kopya talebi (durma noktası) |
| Eski 172 havuzun yeni havuzlarla karışması | Yeni `topic_key` 2026 başlıklarından üretilir; eşleşme raporu ders kapanışında kontrol edilir. **Eski dosyalar silinmez** — o dersin yeni havuzları kapıları geçince `arsiv/` altına taşınır (§9) |

---

## 9. Kararlaşan ayarlar ve kalan tek soru

| Konu | Karar |
| --- | --- |
| İlk ders | **Fizik** (22 havuz / 220 soru) — kitabı gelince başlar |
| Onay noktası | **Ders bazında:** ilk dersin tamamı bitince durup onay alınır, sonra sıradaki ders |
| Eski 172 havuz | **Ders bazında `arsiv/` altına taşınacak** (silinmez). Yeni havuzlar o ders için tamamlanıp kapılar geçtikten sonra taşınır; taşıma ayrı commit |
| Yardımcı araçlar | `docs/uretim/araclar/` (talimat §12 yazma izinlerine uygun; `scripts/` ve uygulama kodu değişmez) |
| Kitap sırası | Kitabı gelen ders işlenir; Fizik sabit |

**Kalan tek açık konu:** Fizik kitabının hangi yolla geleceği (parçalı yükleme mi, özel GitHub
deposu mu) — bkz. §3.0. Kitap ulaştığı anda üretim kesintisiz başlar.

---

## 10. Yürütme sırası (özet)

```
Faz 0  altyapı (TAMAM) + SABLON doğrulaması
Faz 1  Fizik: 22 havuz / 220 soru → ders onayı        ← kitap bekleniyor
Faz 2..9  sıradaki dersler (kitap geldikçe)           ← seri üretim
Faz 10 kapanış: 158/158 · 1.686 soru · 1.686 kart
       manifest üretimi · INCELEME listesi · test:hepsi · ders raporları · PR kararı
```

Kapanış kabul şartları: talimat §10'daki 11 maddenin tamamı + `DURUM.md` panosunda 158/158.
