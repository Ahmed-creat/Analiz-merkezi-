# v96 — Hazırlık bitiş kuralı, sınav gecesi/sabahı, renkli takvim

**Tarih:** 20 Kasım 2026 · **Sürüm:** `v96-tekrar-takvim` · **Dal:** `arena/cc4de070-analiz-merkezi`

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
| Sınav gecesi | sınav − 1 gün | "Sınav gecesi: <ders> · son bakış" — 30 dk yanlış defteri, yeni konu yok |
| Sınav sabahı | sınav günü | "Sınav sabahı: <ders> · 15 dk göz atma" — formül/anahtar kelime |

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
| `tests/v96-tekrar-takvim.test.js` (yeni) | **60/60 ✓** |
| `tests/v95-hazirlik-plani.test.js` (v96 kuralına güncellendi) | **48/48 ✓** |
| `tests/v37-davranis.test.js` (harness: yeni fonksiyonlar) | **53/53 ✓** |
| `npm run -s test:hepsi` | **EXIT=0** |

v96 testi davranışı ölçer: hiçbir oturum sınavdan 3 günden yakın değil, son
oturum `son` ve metni "yazılı örnek senaryo", gece/sabah satırları doğru
tarihte, `prepDays` tamamen yok, takvim çıktısı 7 farklı renkte blok üretiyor.

## Değişen dosyalar

- `site/index.html` — bitiş kuralı, son tur, `sinavYakinlari()`, `CAL_RENK`,
  renkli takvim ızgarası + CSS, gün detayı, günlük görev, bildirim
- `site/app-pwa.js` — okulizyon sınav kaydından hazırlık günü alanı çıkarıldı;
  `PWA_SURUM = "v96-tekrar-takvim"`
- `site/sw.js` — önbellek `analiz-merkezi-v-20261027-v96-tekrar-takvim`
- `tests/v96-tekrar-takvim.test.js` (yeni), `tests/v95-…` (güncellendi),
  `tests/v37-…` (harness güncellendi)
- `package.json` — `test:v96`, `test:hepsi` zincirine eklendi
