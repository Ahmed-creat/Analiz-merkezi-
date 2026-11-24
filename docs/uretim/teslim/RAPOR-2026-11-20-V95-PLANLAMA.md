# RAPOR — 2026-11-20 · v95 · SINAVA HAZIRLIK PLANI (gerçekçi günler, konu önerisi, bildirim)

## 1) Kullanıcının bildirimi (uygulama içi geri bildirim, 20 Kasım 2026 00:00 TR)

> "Sorun 1) uygulama neye göre sınava hazırlık günlerini belirliyor? Mesela okul
> sınavı için ilk çalışma gününü 3 gün önce seçmiş bu çok saçma yetişmez ki.
> Ve deneme içinde sadece eksik kapatma yazıyor oysaki bizim nerde eksik
> olduğumuzu biliyor direk konu önermeli. Ve uygun bir çalışma programı
> yapabilmeli bir günde 4,5 tane sınava hazırlık yapılamaz. Ve bu hazırlıkları
> bildirimle bildirmeli."

Dört talep:

1. **Hazırlık günleri neye göre belirleniyor?** Okul sınavında ilk çalışma günü
   −3 gün: 21 konuluk sınava yetişmez → daha erken ve yayılmış plan.
2. **"Eksik kapatma" genel metni değil**, uygulamanın bildiği **zayıf konular**
   doğrudan önerilmeli.
3. **Bir günde 4-5 sınav hazırlığı** olmamalı (günlük yük dengesi).
4. Bu hazırlıklar **bildirimle** duyurulmalı.

## 2) Ne yanlıştı (ölçüldü)

| Yer | v94 davranışı | Sorun |
|---|---|---|
| `calendarEventMap()` | Deneme: **sabit** −7 / −3 / −1 · Okul: **sabit** −3 / −1 | Gün sayısı sınav kapsamından bağımsız; 21 konuluk sınavda "ilk gün" sınavdan 3 gün önce |
| Hazırlık etiketi | `"Genel tekrar"`, `"Eksik kapatma"`, `"Formül turu"` | **Konu yok**; kullanıcı "nerede eksik olduğumu biliyor" diyor |
| Gün dağıtımı | Her sınav kendi günlerini **bağımsız** yazıyor | Aynı güne 4-5 hazırlık satırı düşebiliyor |
| Bildirim (`processDueNotifications`) | `dl2 === 7 / 3 / 1` sabit kilometre taşları, sabit metinler | Planla **bağlantısız**; konu içermiyor |
| Sunucu push (`webpush_tetikle`, 0010) | Yalnız görev + tekrar + acil konu | Uygulama kapalıyken hazırlık günü **hiç duyurulmuyordu** |
| Günlük görevler | Sınav görevi yalnız "3 gün içindeki sınav" | Hazırlık oturumu görev listesinde yok |

Kullanıcının gerçek verisi (Supabase `app_states`, user `7490b2fb…`): 10. sınıf,
**10 okul sınavı** (2027-01-05 … 01-14, toplam **96 konu**; TDE 21, Matematik 13,
Felsefe 13, Din 12), **1 deneme** (2026-10-27, net 77.5, **39 hata günlüğü**),
deneme hedefi 2026-12-20, hafıza (tekrar) henüz **boş**. Sabit gün setiyle bu
takvimde hazırlık 3 güne sıkışıyordu.

## 3) Yapılan değişiklik — TEK KAYNAK: `hazirlikPlani()`

`site/index.html` içine yeni blok (takvimden önce):

- `HAZIRLIK_GUN_TAVAN = 2` · `HAZIRLIK_OTURUM_KONU = 3` · `HAZIRLIK_OTURUM_TAVAN = 8`
- `hazirlikZayifKonular()` — uygulamanın **gerçekten bildiği** zayıf konular:
  1. **hata günlüğü** → mevcut `calculatePriority()` (deneme hatası 1.5×, test 1.0×)
  2. **hafıza** → günü geçmiş / hiç tekrar edilmemiş / gücü < %50 konular
  (hata puanları önce gelir; uydurma konu YOK)
- `hazirlikOturumSayisi()` — oturum = ⌈konu ÷ 3⌉, en çok 8
- `hazirlikGunSeti()` — son oturum **daima sınavdan 1 gün önce**, kalanı
  seyrekleşerek **geriye** yayılır
- `hazirlikPlani()` — sınavları tarih sırasıyla işler; her oturum için gün seçer:
  - günde **en çok 2** hazırlık oturumu,
  - gün doluysa **daha erken** güne taşınır (sınava daha çok zaman),
  - aynı sınavın başka oturumunun olduğu güne yazılmaz,
  - **geçmişe plan yazılmaz**, sınav bugün/geçmişse hazırlık üretilmez,
  - kapsam hiç yoksa uydurma plan yok → okul 2, deneme 3 klasik gün.
- Her oturum **konu listesi + hazır bildirim metni** taşır:
  `TDE (sınavdan 3 gün): Şiirde Ahenk, Koşuk +1`

Bu tek kaynak şurada kullanılıyor:

| Tüketici | Ne görüyor |
|---|---|
| Çalışma Takvimi (ay ızgarası + ajanda) | `Sınava hazırlık: TDE · Şiirde Ahenk, Koşuk +1` |
| Gün detayı | "sınavdan N gün önce" + **çalışılacak konular listesi** |
| Okul Sınavları kartı | `Hazırlık: 7 oturum · 23.12.2026 → 13.01.2027` |
| Takvim altı kural notu | "oturum başına 3 konu, günde en çok 2 oturum, son oturum sınavdan 1 gün önce" |
| Uygulama içi bildirim | `Bugün hazırlık: TDE` + gövdede **konu adları** |
| Günlük Görevler | `TDE sınavına hazırlık · sınavdan 5 gün` + konular |
| Sunucu push | `state.plan.hazirlikPlani` → bugünün `bildirim` metni |

Ek olarak: sınav eklenince çıkan toast artık gerçek sonucu söylüyor
("… — 7 hazırlık oturumu takvime işlendi"), planlama kartının açıklaması kuralı
yazıyor, 30 gün bildirimi "1 hafta / 3 gün / 1 gün önce" yanlış vaadinden kurtuldu.

## 4) Kullanıcının kendi verisiyle üretilen plan (bugün 2026-11-20)

```
Gün sayısı: 28 | oturum: 41 | en yoğun gün: 2   (10 sınav + deneme)
```

| Ders | Oturum | İlk gün | Son gün | İlk gün sınavdan |
|---|---|---|---|---|
| Deneme (20 Ara) | 6 | 08.12.2026 | 19.12.2026 | 12 gün |
| TDE (21 konu, 14 Oca) | 7 | 23.12.2026 | 13.01.2027 | **22 gün** |
| Felsefe (13) | 5 | 27.12.2026 | 07.01.2027 | 12 gün |
| Din Kültürü (12) | 4 | 27.12.2026 | 12.01.2027 | 17 gün |
| Matematik (13) | 5 | 28.12.2026 | 06.01.2027 | 10 gün |
| Biyoloji (8) | 3 | 30.12.2026 | 04.01.2027 | 6 gün |
| Kimya (8) | 3 | 31.12.2026 | 05.01.2027 | 6 gün |
| Fizik (8) | 3 | 31.12.2026 | 07.01.2027 | 8 gün |
| Tarih (6) | 2 | 02.01.2027 | 05.01.2027 | 4 gün |
| Coğrafya (7) | 3 | 06.01.2027 | 11.01.2027 | 6 gün |

Örnek oturum satırları (gerçek üretim):

```
23.12.2026  sınavdan 22 gün  TDE · Noktalama İşaretleri, Koşuk +1
24.12.2026  sınavdan 21 gün  TDE · Şiirde Ahenk, Yazım Kuralları +1
08.12.2026  sınavdan 12 gün  Deneme · Noktalama İşaretleri, 1.1 Coğrafi Bakış +1
19.12.2026  sınavdan  1 gün  Deneme · 1.1 Canlılık İçin Enerjinin Önemi
```

Yani: **"Eksik kapatma" yok**, doğrudan deneme hata günlüğündeki konular;
**günde en çok 2**; TDE 21 konu → 7 oturum, ilk oturum sınavdan **22 gün önce**.

## 5) Sunucu tarafı — migration 0013

`supabase/migrations/0013_hazirlik_bildirimi.sql` → `webpush_tetikle()` DÖRDÜNCÜ
kaynak: bugünün hazırlık oturumları (`state.plan.hazirlikPlani`).

- Metin TEK satırda: `Bugün: 3 görev · 2 tekrar · 4 acil konu · 2 hazırlık. … Hazırlık: TDE (sınavdan 3 gün): Şiirde Ahenk, Koşuk.`
- İçerik imzasına girer → aynı içerik gün içinde tekrar gönderilmez.
- Plan yoksa (uygulama hiç açılmamış) **uydurma hazırlık bildirimi gitmez**.
- Fonksiyon gövdesi 0010'un tamamı + hazırlık kaynağıdır (`create or replace`).

Uygulandı: `create_migration name=hazirlik_bildirimi_v95` → kabul (version null).
Teyit (canlı DB):

```
hazirlik_plani_var = 6445   hazirlik_metni_var = 693   uzunluk = 11082
yorum = "v95 — görev + tekrar + acil konu + hazırlık oturumları TEK mesajda; …"
```

Ek olarak canlıda (salt-okunur) ayıklama sorgusu denendi:

```
hazirlik_sayi = 2
hazirlik_liste = "Matematik (sınavdan 10 gün): Üslü Sayılar, Çarpanlara Ayırma | TDE (sınavdan 3 gün): Şiirde Ahenk, Koşuk"
```

## 6) Test kanıtı

Yeni: `tests/v95-hazirlik-plani.test.js` — **46/46** (davranış testi; fonksiyonlar
`index.html`den çıkarılıp GERÇEKTEN çalıştırılır):

1. 21 konuluk TDE → ≥5 oturum, hepsi sınavdan önce, son oturum −1 gün,
   **ilk çalışma günü ≥ 7 gün önce** (eski −3 kapısı düşer), 21 konunun tamamı
   kapsanır, oturum başına ≤3 konu, geçmişte oturum yok.
2. **En yoğun günde ≤ 2 oturum** (10 sınav + deneme ile) ve aynı sınava aynı gün
   iki oturum yok.
3. Hata günlüğündeki **Şiirde Ahenk / Koşuk** ilk oturumda; okul oturumunda
   **kapsam dışı konu yok**; etiket konu adını gösteriyor.
4. Deneme oturumları **konu taşıyor**; "Eksik kapatma / Genel tekrar / Formül
   turu" metinleri planda YOK.
5. Bildirim **aynı plandan**: başlık "Bugün hazırlık: …", gövdede gerçek konu adı,
   "eksik kapatma" yok; sabit −7/−3/−1 bloğu silinmiş; plan `state`e yazılıyor.
6. Kapsam yoksa klasik gün sayısı (okul 2 / deneme 3), konu UYDURULMUYOR;
   sınav bugünse hazırlık yok.
7. Gün seti yardımcıları: sınavdan 1 günle biter, kalan günü aşmaz, ⌈konu/3⌉,
   tavan 8, sabitler dosyada.
8. `hazirlikPlaniKaydet()` gerçekten yazıyor, ikinci kez yazmıyor, state şişmiyor.

Regresyon (davranış testleri yeniden koşturuldu):

```
v37 davranış 53/53 ✓ · şekil tutarlılık 388/388 ✓ · kaynak sözdizimi 40/40 ✓
bildirim-otomatik 22/22 ✓ · görev hatırlatma 18/18 ✓ · v94 42/42 ✓
npm run -s test:hepsi  →  EXIT 0
```

`v94` ve `v93b` sürüm kapıları `v9[3-9]…` desenine genişletildi (v93b ile aynı
kural); **hiçbir eşik gevşetilmedi**, v37'nin "ilk başlık 1 Kasım Paz", "üç ayrı
dolgu rengi", "moreAgenda yok" kapıları aynen geçiyor.

## 7) Değişen dosyalar

| Dosya | Değişiklik |
|---|---|
| `site/index.html` | `hazirlikPlani` motoru + takvim/gün detayı/okul kartı/görev/bildirim bağlantısı; sabit −7/−3/−1 kaldırıldı |
| `site/app-pwa.js` | `PWA_SURUM = "v95-hazirlik-plani"` |
| `site/sw.js` | `CACHE = "…-v95-hazirlik-plani"` |
| `supabase/migrations/0013_hazirlik_bildirimi.sql` | push'a 4. kaynak (hazırlık) |
| `tests/v95-hazirlik-plani.test.js` | yeni davranış testi (46) |
| `tests/v37-davranis.test.js` | yeni fonksiyonlar test kapsamına alındı (iddialar aynı) |
| `tests/v94-mazmun-soz-sanatlari.test.js` | sürüm kapısı `v9[4-9]` |
| `package.json` | `test:v95` + `test:hepsi` zinciri |

## 8) Bilinçli olarak DEĞİŞMEYENLER

- `state` anahtarı hâlâ `"Ders > Konu"`; kullanıcı verisi (`app_states`) elle
  düzenlenmedi — yeni alan (`plan.hazirlikPlani`) uygulama açılışında üretilir.
- `AYT_WEIGHT`, `MEMORY_CRITICAL=20`, `REVIEW_LADDER`, 5. adım, soru puanlaması,
  `hata_gecmisi` 40 tavanı, tek tekrar düğmesi: dokunulmadı.
- Deneme tarihine kalan gün bildirimleri (30/7/1) duruyor; yalnız hazırlık
  cümlesi plandan geliyor.
- Hiçbir kazanım/konu uydurulmadı: konular ya sınav kapsamı ya hata günlüğü ya
  da hafıza kaydından gelir.
