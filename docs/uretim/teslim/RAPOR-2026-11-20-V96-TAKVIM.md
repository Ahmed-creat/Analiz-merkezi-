# v96 — Hazırlık bitiş kuralı, sınav gecesi/sabahı, renkli takvim

**Tarih:** 20 Kasım 2026 · **Sürüm:** `v97-sade-baslik` · **Dal:** `arena/cc4de070-analiz-merkezi`

## Kullanıcının geri bildirimi (birebir)

> "bir sınavdan en az 3 gün önce konuları bitmeli son gün son konu tekrarı ve
> yazılı örnek senaryolarıni çözsün, ve sınav gecesi sabah hangi sınav varsa
> çalışmalı. Ayrıca okulizyonda öğretmen çalışma günü falan vermiyor. Karışıklık
> kalksın silelim. Ayrıca takvim görseldeki gibi olsun. Yani gerçekten renkli
> bölümler. Yine aynı şekilde sınavlar ayrı deneme ayrı renk tekrar bunları ayrı
> renk vb."

Ek olarak kullanıcı, uygulamanın okul programı ekran görüntüsünü (Google Takvim
aylık görünümü, tam genişlikte dolu renkli olay blokları) paylaştı.

## Ne değişti

### 1) Konular sınavdan en az 3 gün önce bitiyor

Yeni sabit: `HAZIRLIK_BITIS_GUN = 3`.

- `hazirlikGunSeti()` son oturumu **her zaman sınav − 3 gün** olacak şekilde
  üretir; kalan oturumlar seyrekleşerek geriye yayılır.
- `hazirlikOturumSayisi()` pencereyi `kalanGun − 3` ile sınırlar. Sınava 3 günden
  az kaldıysa **0 oturum** (uydurma plan yok).
- Eski "son oturum sınavdan 1 gün önce" davranışı kaldırıldı.

### 2) Son gün = son konu tekrarı + yazılı örnek senaryo

Her sınavın en geç oturumu `son: true` olarak işaretlenir:

- etiket: **"Son tekrar + yazılı örnek senaryo: <ders> · <konular>"**
- gün detayı: "SON TUR: konular burada bitiyor (sınavdan en az 3 gün önce)…
  konu tekrarı + yazılı örnek senaryoları çöz."
- bildirim metni: "SON TUR — <ders> (sınavdan 3 gün): … + yazılı örnek senaryo"
- Tek oturumluk küçük sınavda o oturum başlığı yine "Sınava hazırlık" kalır
  (yanlış yere "son tekrar" denmez), sonuna "yazılı örnek senaryo" eklenir.

### 3) Sınav gecesi + sınav sabahı çalışması

Yeni fonksiyon `sinavYakinlari()`; her sınav (okul + deneme) için iki satır:

| Satır | Tarih | Metin |
|---|---|---|
| Sınav gecesi | sınav − 1 gün | "Sınav gecesi: <ders> · son bakış" — 30 dk, **gerçek konu adlarıyla** |
| Sınav sabahı | sınav günü | "Sınav sabahı: <ders> · 15 dk göz atma" — aynı konular |

**v96b — kullanıcı düzeltmesi:** *"Yanlış defteri ne? Uygulamada öyle bir şey
geçmiyor ki."* Haklıydı: "yanlış defteri" uygulamada var olmayan bir şeydi.
Metin artık **gerçek veriyi konu adıyla** gösteriyor:

1. **Denemelerim'de hata olarak işaretlediğin konular** (varsa) →
   "Denemelerim'de yanlış yaptığın konular: Noktalama İşaretleri, Şiirde Ahenk,
   Koşuk. 30 dakika bunlara bak, sonra erken uyu."
2. Yoksa **o sınav için seçtiğin konular** →
   "Sınav için seçtiğin konular: Vektörler, Kuvvet."
3. İkisi de yoksa **konu uydurulmaz** → "Bu ders için kayıtlı hata ya da konu
   yok." + kısa tekrar önerisi.

Deneme sınavında ders ayrımı yapılmaz; en zayıf konular "Matematik: Üçgende
Yardımcı Elemanlar" biçiminde gelir.

Ayrıca uygulamada görünen tüm "yanlış defteri / formül turu" ifadeleri kaldırıldı
(`EXAM_REGIMES`, sınav −1 bildirimi, günlük görev, gün detayı, hazırlık
bildirimi). Test, **yorumlar ayıklanmış görünen metinde** bu ifadelerin
geçmediğini doğrular.

Bu satırlar: takvimde **kendi rengiyle**, gün detayında, Günlük Görevler'de ve
bildirimde (uygulama içi + tarayıcı) görünür. Geçmiş sınav için satır üretilmez.

### 4) Okulizyon karışıklığı kaldırıldı

- `site/app-pwa.js` içinde okulizyon sınav kaydına yazılan **hazırlık günü alanı
  silindi**.
- `site/index.html` içindeki ikinci gün hesabı (`schoolPrepDaysFor`) kaldırıldı.
- Artık hazırlık günleri **tek kaynaktan** (`hazirlikPlani`) üretilir; ikinci bir
  hesap yok. Okulizyon sınavı yalnız ders/tarih/konu bilgisi taşır.

### 5) Takvim: gerçek renkli bloklar

- Gün hücresi beyaz kart (min-height 104px); içinde **tam genişlikte, dolu
  renkli** olay blokları (Google Takvim görünümü), ilk 3 blok + "+N daha".
- **Tek renk kaynağı:** `CAL_RENK`. Izgara, gösterge (legend), gün detayı ve
  ajanda aynı haritayı kullanır — ikinci bir palet yok (eski `PALET` silindi).
- Hafta sonu hücreleri hafif griye boyanır, bugünün numarası mavi rozet olur.

| Tür | Renk | Örnek |
|---|---|---|
| Okul sınavı | `#D50000` kırmızı | "Sınav: Din Kültürü" |
| Deneme sınavı | `#8E24AA` mor | "Deneme sınavı" |
| Sınava hazırlık | `#F4511E` turuncu | "Hazırlık: TDE" |
| Son tekrar + örnek senaryo | `#C2185B` pembe | "Son tekrar: TDE" |
| Konu tekrarı (3/7/14/21/28) | `#3F51B5` mavi | "Tekrar · 3 konu" |
| Sınav gecesi | `#00796B` turkuaz | "Gece: Coğrafya" |
| Sınav sabahı | `#0B8043` yeşil | "Sabah: Din Kültürü" |

## Gerçek veriyle ölçüm

Kullanıcının verisi: 9 okul sınavı (96 konu, 5–14 Ocak 2027) + 1 deneme
(20 Aralık 2026) + 18 farklı zayıf konu. Bugün = 20 Kasım 2026.

| Ölçüm | Değer |
|---|---|
| Hazırlık oturumu | **40** |
| Yayıldığı gün | **26** |
| En yoğun gün | **2 oturum** (kural korunuyor) |
| En erken oturum | sınavdan **24 gün** önce |
| En geç oturum | sınavdan **3 gün** önce |
| Son tur (son tekrar + senaryo) | **10** (her sınav için 1) |
| Sınav gecesi/sabahı satırı | **20** (10 sınav × 2) |

TDE örneği (21 konu → 7 oturum, sınav 14 Ocak 2027):

```
21 Ara (−24)  22 Ara (−23)  23 Ara (−22)  24 Ara (−21)
06 Oca (−8)   09 Oca (−5)   11 Oca (−3) ← SON TEKRAR + yazılı örnek senaryo
13 Oca gece (son bakış) · 14 Oca sınav + sabah 15 dk göz atma
```

## Test

| Test | Sonuç |
|---|---|
| `tests/v96-tekrar-takvim.test.js` (yeni) | **81/81 ✓** |
| `tests/v95-hazirlik-plani.test.js` (v96 kuralına güncellendi) | **48/48 ✓** |
| `tests/v37-davranis.test.js` (harness: yeni fonksiyonlar) | **53/53 ✓** |
| `npm run -s test:hepsi` | **EXIT=0** |

v96 testi davranışı ölçer: hiçbir oturum sınavdan 3 günden yakın değil, son
oturum `son` ve metni "yazılı örnek senaryo", gece/sabah satırları doğru
tarihte **ve gerçek konu adı taşıyor**, konu yoksa uydurulmuyor, `prepDays`
tamamen yok, takvim çıktısı 7 farklı renkte blok üretiyor, ekranda "yanlış
defteri" geçmiyor.

## Değişen dosyalar

- `site/index.html` — bitiş kuralı, son tur, `sinavYakinlari()`, `CAL_RENK`,
  renkli takvim ızgarası + CSS, gün detayı, günlük görev, bildirim
- `site/app-pwa.js` — okulizyon sınav kaydından hazırlık günü alanı çıkarıldı;
  `PWA_SURUM = "v96b-gercek-konu"`
- `site/sw.js` — önbellek `analiz-merkezi-v-20261027-v96b-gercek-konu`
- `tests/v96-tekrar-takvim.test.js` (yeni), `tests/v95-…` (güncellendi),
  `tests/v37-…` (harness güncellendi)
- `package.json` — `test:v96`, `test:hepsi` zincirine eklendi

## v97 — Başlıklarda konu adı YOK (kullanıcı düzeltmesi)

KULLANICI (20 Kas 2026, ekran görüntüsü):
> "Başlıklara neden konuları yazıyorsun ki, zaten konular altta yazıyor.
> **Son konu tekrarı: MATEMATİK**, **Sınava hazırlık: Din Kültürü** vb yazsın
> başlıkta."

Önce başlık, etiketin tamamını (`Sınava hazırlık: Din Kültürü · 1.3 Kur'an'dan
Mesajlar, 2.1 Allah'ın Varlığının Delilleri +1`) basıyordu; konular hemen
altındaki listede bir kez daha görünüyordu. Artık başlık **yalnız tür + ders**:

| Yer | Yeni başlık |
|---|---|
| Gün detayı (son tur) | `Son konu tekrarı + yazılı örnek senaryo: Türk Dili ve Edebiyatı (sınavdan 3 gün önce)` |
| Gün detayı (hazırlık) | `Sınava hazırlık: Din Kültürü (sınavdan 9 gün önce)` |
| Takvim bloğu | `Son konu tekrarı: Matematik` / `Sınava hazırlık: Din Kültürü` |
| Takvim bloğu (sınav öncesi) | `Sınav gecesi: Biyoloji` / `Sınav sabahı: Biyoloji` (eski `Gece:` / `Sabah:` kısaltmaları kalktı) |
| Konu tekrarı bloğu | `Konu tekrarı · N konu` |

Konular **yalnız alttaki listede** görünür (`Son tekrar konuları (2):`,
`Çalışılacak konular (3):`). Ayrıca hazırlık açıklamasındaki "hata günlüğü"
terimi de kaldırıldı → "Denemelerim'deki hatalarına ve hafıza gücüne göre
seçilen en zayıf N konu."

Test (v96 dosyası, bölüm 7): gün detayı başlığında konu adı geçmediği, konuların
alttaki listede durduğu, takvim bloğu ile gün detayının AYNI başlık dilini
kullandığı doğrulanır.

## v98 — Denemede yazılı örnek YOK + hazırlık hedef net ve ivmeye göre

KULLANICI (20 Kas 2026):
> "Denemede yazılı örnek soruları yok. Ve şunu da gözden kaçırmayalım.
> Deneme hazırlıkları öğrencinin deneme hedefi ve ivme ölçerine göre
> planlanmalı. Hedeflediği nete ulaşmak için hangi konuları bitirmeli,
> haftalık ivmesi ne kadar bunlara göre olmalı. Ve sonraki denemeye kadar
> öğrencinin hatası olan tüm konuları çalışması gerekmiyor mu?"

### 1) Deneme = test sınavı: yazılı örnek senaryo YOK

"Yazılı örnek senaryo" yalnız **okul (yazılı) sınavında** kalır. Denemede
başlık/açıklama/bildirim dili:

| Yer | Metin |
|---|---|
| Takvim bloğu (hazırlık) | `Deneme hazırlığı · 2 konu (3/9)` |
| Takvim bloğu (son) | `Deneme öncesi son tekrar` |
| Gün detayı başlığı | `Deneme hazırlığı · 2 konu (3/9)` + `(denemeye 19 gün)` |
| Gün detayı (son) | `Deneme öncesi son tekrar (9/9) (denemeye 3 gün)` |
| Gün detayı açıklaması | "Bu oturumda denemede yanlış yaptığın konular çalışılır." / son: "Denemeye 3 gün kaldı. Bugün yeni konu açma: yanlış yaptığın konuların son tekrarı + hızlı soru taraması." |
| Bildirim | `Deneme (denemeye 15 gün) — 3 konu: …` · son: `… — SON TEKRAR …` |
| Uygulama içi bildirim | `Deneme hazırlığı · denemeye 15 gün` |

Okul sınavı dili değişmedi: `Son konu tekrarı + yazılı örnek senaryo: <ders> (sınavdan 3 gün önce)`.

### 2) `denemeIvmesi()` — hedef net ve ivme ölçer (yalnız kayıtlı denemeler)

```
son net        = en yeni denemenin neti
önceki net     = bir önceki denemenin neti
ölçülen ivme   = (son − önceki) × 7 / iki deneme arası gün      (net/hafta)
gereken net    = hedef net − son net
kalan hafta    = ceil(hedefe kalan gün / 7)
gereken ivme   = gereken net / kalan hafta
durum          = veri-yok | ivme-bilinmiyor | yolunda | geride
```

- İkinci deneme yoksa **uydurulmaz**: "Ölçülen ivme için iki deneme gerekli."
- Hedef net/tarih yoksa: "Deneme hedefine net girilince ivme hesaplanır."
- **İvme Ölçer** kartında artık ölçülen ivme de yazıyor:
  `+0.47 net/hafta ölçülen ivme · gereken +6.6 → GERİDE` (yeşil/kırmızı).

### 3) Hazırlık planı: hedefe göre konu + haftalık yük

- **TÜM hata konuları** plana girer (`Denemelerim` hata kayıtları), en zayıf
  konular **en erken** oturuma yazılır → tekrar etmeye zaman kalır.
- Hafıza kaynaklı (tekrar/hafıza) zayıflar **yalnız yer kalırsa** eklenir.
- Oturum başına konu: normalde **3**, ivme **geride** ise **2** (daha sık tekrar,
  daha çok oturum). Deneme tavanı 12 → **20 oturum** (gerçek sınır hedefe kalan gün).
- Konular denemeden **en az 3 gün önce** biter; son oturum "son tekrar".
- Sığmayan konu olursa `kalanKonu` ile "N konu sonraki tura kaldı" (kırmızı).

**Deneme Hedefi kartı (kapalı özet) — plan kutusu:**

```
Deneme hazırlık planı: 9 oturum · 18 konu · hataların 18/18 konusu kapsanıyor · haftada ~6 konu
İlk oturum: 29.11.2026 · son oturum: 17.12.2026 (denemeden 3 gün önce)
Hedef 95 net · son net 62 · gereken +6.6 net/hafta · ölçülen +0.47 net/hafta → GERİDE.
```

`haftada ~N konu` = planın gerçek penceresi (ilk oturum → son oturum) üzerinden.

### 4) Test

`tests/v96-tekrar-takvim.test.js` bölüm 8 (28 yeni assert, toplam **112/112**):
denemede yazılı örnek yok · okulda var · ölçülen/gereken ivme · "geride"
durumunda oturum başına 2 konu · 30 hata konusunun **tamamı** planda ·
oturum sırası (1/9) · plan kutusu ve İvme Ölçer satırı · gün detayı
"denemeye N gün" der, "sınavdan" demez.

Sürüm: `PWA_SURUM = "v98-deneme-plani"`, SW `analiz-merkezi-v-20261027-v98-deneme-plani`.

## v98b — Düzeltme cümlesi uygulamaya YAZILMAZ

KULLANICI (20 Kas 2026):
> "yazılı örnek yok, deneme test sınavıdır mi? Ya şu hatayı her ai yapıyor.
> Prompttaki düzeltme ifadelerini uygulamaya eklemeyi bırakın... yazılı örnek
> yoksa yok. Niye öğrenciye yok diyorsun? O biliyor zaten."

Kural: **kullanıcının düzeltmesi uygulamanın metnine dönüşmez.** Uygulama
"şu yok / şu değil / şu gerekli" demez; yalnız **ne yapılacağını** söyler.
Yok olan şey sessizce yok olur.

| Önce (kaldırıldı) | Sonra |
|---|---|
| "…son tekrarı + hızlı soru taraması **(yazılı örnek yok, deneme test sınavıdır)**." | "…son tekrarı + hızlı soru taraması." |
| "Hedef 95 net · **henüz deneme yok**; ilk denemeni ekleyince ölçüm başlar." | "Hedef 95 net · ilk denemeni ekle, haftalık ölçüm başlasın." |
| "…**Ölçülen ivme için ikinci deneme gerekli.**" | "…İkinci denemeyi ekle, ölçülen ivme de karşılaştırılsın." |
| İvme Ölçer: "Ölçülen ivme için **iki deneme gerekli** — sonraki denemeden sonra burada görünür." | "İkinci denemeden sonra ölçülen ivme de burada." |

Test (v96 dosyası, bölüm 8/f): kaynakta **yorumlar ayıklanmış** hâlde
`deneme test sınavıdır`, `yazılı örnek yok`, `uydurma yok`, `iki deneme gerekli`
ifadeleri geçmez; deneme son tekrar kutusunda `yok`, `değil`, `sınavıdır`
geçmez ve metin eylemi söyler. Toplam **117/117**.

Sürüm: `PWA_SURUM = "v98b-sade-dil"`, SW `analiz-merkezi-v-20261027-v98b-sade-dil`.

## v99 — Boş günler kullanılır · tek ivme sayısı · son tekrar = tekrar

KULLANICI (20 Kas 2026):
> "1) öğrencinin boş günleri varsa neden görevler yayılmıyor? 2) son tekrarda
> yeni konu açma diyor ama o gün 3 konu çalış diyor. … Ve sorun şu ivme ölçer:
> +4.08 haftalık net artışı hedefi diyor, tekrarda ivme 3.5 diyor. Ve haftalık 4
> ise denemeye çalışmaya 5 hafta önce başlaması gerekmiyor mu? Yoksa birbiriyle
> çelişiyor"

### 1) Boş günler artık kullanılıyor
`hazirlikGunSeti()` yayılımı **2n günle** sınırlıydı: sınav 30 gün sonraysa ilk
9 gün bomboş kalıyor, 9 oturum son 18 güne sıkışıyordu.

| | Önce | Sonra |
|---|---|---|
| Deneme planı | ilk oturum denemeden 21 gün önce (bugünden 9 gün sonra) | **ilk oturum YARIN**, son oturum −3 |
| Oturum aralığı | sona doğru sıkışık | **eşit aralık** (30 gün / 7 oturum ≈ 4-5 gün) |
| Okul sınavı | son 2n güne sıkışık | sınava **en fazla 21 gün** kala başlar (7 hafta önce "sınava hazırlık" yazmaz) |

Yerleşim sırası: (1) hedef gün, (2) daha erken gün, (3) **daha geç gün** (sınav−3'ü
geçmeden). Böylece tüm sınavların ilk oturumu aynı güne (yarına) yığılmıyor;
günde en çok 2 oturum, aynı sınava aynı gün tek oturum.

### 2) Son tekrar = TEKRAR (yeni konu değil)
Metin "yeni konu açma" derken liste yeni konular gösteriyordu. Artık:
- Konular **çalışma oturumlarına** dağıtılır (6 çalışma × 3 konu = 18).
- Son oturum (−3 gün) **daha önce çalışılmış en zayıf 3 konunun tekrarıdır**;
  `tekrar: true` bayrağı taşır, listede başlık **"Son tekrar edilecek konular (3)"**.
- Oturum sayısı: `çalışma + 1` (30 konu → 10 + 1 = 11).

### 3) İvme TEK sayı — 4.08 ≠ 3.5 çelişkisi bitti
İki ayrı hesap vardı: İvme Ölçer **ortalama net + yukarı yuvarlanmış hafta**
(17.5 / 4.29 = 4.08, "5 hafta"), plan **son net + ceil hafta** (17.5 / 5 = 3.5).

Tek hesap: **hedef − son net = kalan net · kalan gün ÷ 7 = hafta · kalan net ÷
hafta = haftada gereken net.** `weeklyMomentum()` artık `denemeIvmesi()`'ni
kullanır; yukarı yuvarlama yok (30 gün = **4,3 hafta**), bölme tam hafta ile.

```
İvme Ölçer : +4.08 net/hafta gereken ivme · 30 gün = 4.3 hafta · hedefe 17.5 net
             Son Net 77.5 · Hedef Net 95 · Kalan Gün 30
Cümle      : Hedef 95 net · son net 77.5 → +17.5 net kaldı · 30 gün (4.3 hafta)
             → haftada +4.08 net gerekiyor.
```

Kullanıcının "haftalık 4 ise 5 hafta önce başlaması gerekmiyor mu?" sorusunun
cevabı: 5 değil **4,3 hafta** var; 17.5 net ÷ 4,3 hafta = **haftada 4.08 net**.
Sayı artık her yerde (İvme Ölçer, plan kutusu, gün detayı, üst mesaj) aynı.

### 4) Plan kutusu
`Deneme hazırlık planı: 6 çalışma + 1 son tekrar · 18 konu · hataların 18/18
konusu kapsanıyor · haftada ~5 konu` — konu sayısı **tekil** (tekrar oturumu
sayıyı şişirmez).

### 5) Test
`tests/v96-tekrar-takvim.test.js` → **140/140** (bölüm 9: boş gün yok, eşit
aralık, okul ≤ 21 gün, İvme Ölçer = plan sayısı, 4.3 hafta, 4.08).
`test:hepsi` EXIT=0 · v95 48/48 · v37 53/53 · sw 24/24.

Sürüm: `PWA_SURUM = "v99-tek-ivme-yayilim"`.

---

## v100 — "Eğer bu kadar boş ise günde 3 konu yerine 2 veya 1 de çalışabilmeli"

Kullanıcı (67): **"Sen anlamamışsın ki yine çok fazla boş gün oluyor. Eğer bu
kadar boş ise günde 3 konu yerine 2 veya 1 de çalışabilmeli, neden boş günü
olsun ki."**

### 1) Kök neden: oturum sayısı konu sayısına bağlıydı
v99'da deneme hazırlığı **günde 3 konu** varsayıp `oturum = çalışma + 1`
üretiyordu: 18 konu → **7 oturum**. 30 günlük pencereye 7 oturum serpilince
aralıklar 2-3 güne çıkıyor, yani **boş gün** kalıyordu. Sorun "3 konu"da değil,
oturum sayısının pencereden bağımsız hesaplanmasındaydı.

### 2) Yeni kural: oturum sayısı = pencereyi dolduracak sayı
`hazirlikOturumSayisi()` (deneme):

```
hedef = konuSayisi + ceil(konuSayisi / 2)      // 18 → 27
oturum = min(HAZIRLIK_DENEME_OTURUM_TAVAN,     // 40
             max(calisma + 1, hedef))
```

18 konu → **27 oturum**; pencere 30 gün → 27 oturum **her güne bir tane**,
boşluk yok. Konu sayısı güne yetmediğinde **günde 3 konu yerine 1-2 konu**
çalışılır; yetmediği yerde oturum **tekrar oturumu** olur (yeni konu açılmaz).

### 3) Dağıtım: çalışma / tekrar ayrımı
`tip[]` dizisi tutulur: ilk `çalışma` oturumu yeni konular (eşit paylaşım,
taban + artan: 18 konu / 18 çalışma → çoğu gün **1 konu**), kalan oturumlar
**tekrar**: daha önce çalışılmış konulardan geriye doğru seçilir; son oturum
`Deneme öncesi son tekrar` ilk `boy` (en zayıf) konuyu tekrar eder.

Etiketler:
```
çalışma günü : Deneme hazırlığı: 1 konu · 5/27
tekrar günü  : Deneme tekrarı: 1 konu · 4/27
son gün      : Deneme öncesi son tekrar (27/27)
```
Tekrar gününün açıklaması: *"Bugün yeni konu yok: birkaç gün önce çalıştığın
konuları tekrar ediyorsun (kalıcılık için)."* — liste başlığı **"Tekrar
edilecek konular"** (v66 kuralı: yeni konu açma denip konu listelemek yok;
tekrar listesi adıyla tekrar).

### 4) Uzak sınav: 3 ay boyunca "deneme hazırlığı" olmaz
`HAZIRLIK_DENEME_PENCERE = 30` — deneme 30 günden uzaksa hazırlık **son 30
güne** sıkışır (`enErkenDeneme = min(kalan − 1, 30)`); sınav 30 günden yakınsa
zaten yarın başlar. Okul sınavı penceresi 21 → **14 gün** (`max(14, n + 1)`)
yapıldı: 9 okul sınavı artık 14 güne sığar, daha erken "hazırlık" yazmaz.

### 5) Plan kutusu (18 hata konusu, 30 gün)
```
Deneme hazırlık planı: 18 çalışma + 9 tekrar · 18 konu
hataların 18/18 konusu kapsanıyor · haftada ~5 konu
İlk oturum: 21.11.2026 · son oturum: 17.12.2026 (denemeden 3 gün önce)
```
Konu sayısı **18** (tekrar oturumları sayıyı şişirmez), çalışma + tekrar ayrı
gösterilir.

### 6) Ölçüm (bugün 20.11.2026, 18 hata konusu, son net 77.5, hedef 95)
| Senaryo | Sonuç |
|---|---|
| 30 gün | **27 oturum**, 21.11 → 17.12, **boşluk hep 1 (her gün)**; 18 çalışma + 9 tekrar; oturum başına 1-3 konu (çoğu 1) |
| Kısa pencere (9 gün) | 6 oturum, her gün, **3 konu/oturum** (15 konu) |
| Uzak sınav (92 gün) | 27 oturum **yalnız son 30 günde** (21.01.2027 → 17.02.2027) |

İvme cümlesi v99'dan değişmedi: **tek değer** — *"Hedef 95 net · son net 77.5 →
+17.5 net kaldı · 30 gün (4.3 hafta) → haftada +4.08 net gerekiyor."*

### 7) Test
`tests/v96-tekrar-takvim.test.js` → **154/154**; bölüm 8 v100 tasarımına göre
güncellendi (27 oturum, oturum başına 1-3 konu, `hazırlığı|tekrarı`), **bölüm
10** eklendi: boş gün yok (27 oturum her gün), yarın başlar, −3 günde biter,
tekrar oturumları daha önce çalışılmış konuları tekrar eder, 3 konuluk günde
≤5 oturum, 92 günlük pencerede ilk oturum ≥58. gün.

Üç haneli sürüm numarası için eski testlerdeki sabit `v9x` regexleri
**sayıya** çevrildi (v72 · v78 · v93 · v93b · v94): eşik gevşetmesi değil,
damga biçimi artık `v100-…` (v100 ≥ v94 ✓).

`test:hepsi` **EXIT=0** · v96 154/154 · v95 48/48 · v37 53/53 · sw 24/24 ·
sözdizimi 40/40.

Sürüm: `PWA_SURUM = "v100-her-gun-plan"`.

---

## v101 — "Tekrar günlerinde en çok yanlış yaptığı konular" + yoğunluk hesabı

Kullanıcı (68): **"Deneme tekrarı günlerinde encok yanlış yaptığı konuları
çalışsın. Birde şeyi hesapla öğrenci her bu deneme hazırlığında konuyu çalışsa
bunun tekrarlarida olacak ya yoğun oluyor mu"**

### 1) Tekrar günü artık HATA SAYISINA göre seçer
v100'de tekrar günü, daha önce çalışılmış bir oturumun konularını kopyalıyordu
(sıra rastgeleydi). v101'de seçim üç kurala bağlandı:

1. yalnız o güne kadar **çalışılmış** konular arasından seçilir (uydurma yok),
2. sıra: **en çok hata** → puan → havuz sırası,
3. aynı konu yığılmaz: her tekrar günü bir sonraki en hatalı konuya geçer;
   konular bir kez tekrar edildikten sonra başa döner.

`hazirlikZayifKonular()` artık konunun **gerçek hata sayısını** (`sayi`) taşır;
puan (ders ağırlığıyla şişen skor) yalnız eşitlik bozucudur. Deneme havuzu da
hata sayısına göre sıralanır → en çok yanlış yapılan konu **ilk** çalışılır ve
**son tekrara** girer.

Örnek (hata sayıları 5,4,4,4,3,3,3,3,3,2,2,2,2,2,1,1,1,1):
```
21.11 çalışma  Üçgende Yardımcı Elemanlar (5 hata)
22.11 çalışma  Dik Üçgende Trigonometrik Oranlar (4)
23.11 çalışma  Kimyasal Tepkime Türleri (4)
24.11 TEKRAR  Üçgende Yardımcı Elemanlar (5)   ← en çok yanlış yapılan
27.11 TEKRAR  Dik Üçgende Trigonometrik Oranlar (4)
29.11 TEKRAR  Kimyasal Tepkime Türleri (4)
02.12 TEKRAR  Şiirde Ahenk (4)
...
17.12 SON TEKRAR  Yardımcı Elemanlar (5) · Dik Üçgende Trigonometrik (4) · Kimyasal Tepkime (4)
```
9 tekrar günü, en çok hatalı 9 konuyu kapsar; son tekrar en hatalı 3 konudur.

**Ağırlık korundu:** tekrar günü, çalışma günüyle **aynı boyda** (18 konu / 18
çalışma → tekrar günü **1 konu**). Gün detayında konu adının yanında
**"· 5 hata"** yazar; başlık listesi "Tekrar edilecek konular" olarak kalır.

### 2) Yoğunluk hesabı (asıl soru)
Öğrenci her hazırlık oturumunda konuyu bitirirse **1-3-7-14-28 tekrar
merdiveni** kurulur (sınav yaklaştıkça Cepeda oranıyla sıklaşır). Plan + bu
tekrarlar birlikte günlük yükü şöyle çıkar (30 gün, 18 hata konusu, bugün
20.11.2026):

| Ölçü | Değer |
|---|---|
| Planda oturum | 27 (18 çalışma + 8 tekrar + 1 son tekrar) |
| Yeni konu | 18 |
| Hazırlık tekrarı | 11 konu (9 tekrar günü + son tekrar 3 konu) |
| Sırası gelen konu tekrarı (merdiven) | 81 |
| **30 günde toplam madde** | **110** |
| **Günde ortalama** | **3,7 madde (≈ 70 dk)** |
| En yoğun gün | **7 madde (≈ 105 dk)** — 17.12, son tekrar günü |
| Dağılım | 1 madde: 2 gün · 2: 7 · 3: 5 · 4: 7 · 5: 4 · 6: 4 · 7: 1 |

Varsayım: yeni konu ≈ 40 dk, tekrar ≈ 15 dk. Yani **günde ~1 saat**: yoğun
değil. Tekrar merdiveni 18 konuya 30 günde 81 temas üretiyor (konu başına ~4,5);
bu 1-3-7-14-28 aralıklı tekrarın kendisidir, plan şişmesi değil. En yoğun gün
son tekrar günüdür ve orada yeni konu yoktur (yalnız tekrar).

### 3) Yükü artıran iki şey kaldırıldı
- Tekrar günü 3 konu değil **1 konu** (çalışma günüyle aynı boy).
- **Aynı gün mükerrer temas:** konu hem hazırlık oturumunda hem "Konu
  Tekrarları" listesinde görünüyorsa tekrar listesinden **çıkarılır** — gün iki
  kat iş gibi görünmez.
- Gün detayının altına **"Bugünün yükü: N madde — 1 yeni konu + 1 hazırlık
  tekrarı + 2 konu tekrarı"** satırı eklendi: öğrenci o gün ne kadar işi
  olduğunu sayıyla görür.

### 4) Test
`tests/v96-tekrar-takvim.test.js` **169/169** (bölüm 11: ilk tekrar en hatalı
konu · tekrar günleri yalnız en hatalı K konu · aynı konu yığılmaz · tekrar günü
çalışma günüyle aynı boyda · son tekrar en hatalı konular · planda hata sayıları
· mükerrer öğe yok · "Bugünün yükü" üç parçalı).
`test:hepsi` **EXIT=0**.

Sürüm: `PWA_SURUM = "v101-hatali-tekrar"`.
