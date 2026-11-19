# Rapor — v93 · Üç saha hatası (mükerrer deneme · Felsefe · bildirim)

**Tarih:** 19 Kasım 2026 · **Sürüm:** v93-bildirim-garantisi

**Kullanıcı isteği (3 madde):**

1. "Aynı deneme bugün kendiliğinden 2. kez eklendi."
2. "Bugün kaydolan bir kullanıcı ana sayfada ders başarı grafiğinde felsefe yer
   almadığını söylüyor."
3. "Ayrıca bildirimler gelmiyor. Şunu anla kullanıcının görevi, acil konusu,
   tekrarı varsa kesin bildirim gelmeli."

Bu üçü **ayrı hatalardı**; ikisi veride ölçüldü, biri cihaz kaydıyla doğrulandı.

---

## 1) Aynı deneme iki kez eklendi

### Ölçüm (canlı `app_states`)

`7490b2fb…` hesabında **aynı sınav iki kez** duruyordu:

| Kayıt | Sınav | Tarih | Net | Neden işlenmiş |
|---|---|---|---|---|
| `mwmcn5hxleh22` | Okulizyon: 10.SINIF MAARİF İZLEME SINAVI 1 | 2026-10-27 | 77,5 | **39** |
| `mwnu3b2u88ntv` | Okulizyon: 10.SINIF MAARİF İZLEME SINAVI 1 | 2026-10-27 | 77,5 | **0** |

İki kaydın Okulizyon bağlantısı farklıydı: `…?pg=yks&sid=AAAA` ve `…sid=BBBB`.

### Kök neden

`sid` **oturum jetonudur**; aynı sınavın her çekiminde değişir. v46c/v86 kimliği
bu jetonun üzerine kurmuştu ("başka sınavın sid'i → eşleşme yok"). Sonuç: aynı
sınav ikinci çekimde "yeni" sanılıp tekrar yazıldı. Silinen bir deneme de aynı
sebeple geri geliyordu (defter anahtarı da sid'e bağlıydı).

### Düzeltme

| Yer | Değişiklik |
|---|---|
| `site/okz-normalize.js` | Kimlik = **ad + tarih** (+ içerik). `sid` yalnız bağlantı bilgisi. |
| `site/app-pwa.js` · `okzDenemeyeYaz` | Önce **ad + tarih** aranır; sid ikinci ipucu. |
| `site/app-pwa.js` · `okzTekrarlariBirlestir` | Elde kalmış kopyaları tek kayda indirir; **en çok nedeni işlenmiş** kayıt korunur, boş satırların nedenleri taşınır. Açılışta (oturum beklemeden), giriş sonrası onarımda ve her Okulizyon çekiminden sonra çalışır. |
| `supabase/migrations/0011_deneme_mukerrer_temizlik.sql` | Aynı temizliğin sunucu tarafı (idempotent). |

Canlı veri elle onarıldı: `7490b2fb` artık **1 deneme / 39 neden işlenmiş / 0 boş**.

---

## 2) Ders başarı grafiğinde Felsefe yok

### Ölçüm

Yeni hesap (`grade = "9"`) + Okulizyon'dan gelen 10. sınıf denemesi:
denemede **Felsefe 5 soru** var. Ana sayfadaki "Ders Başarı Oranları" grafiği
Felsefe'yi hiç göstermiyordu.

### Kök neden

Grafik ders listesini **sabit** `LESSON_CONFIG`'ten alıyordu. 9. sınıf listesinde
Felsefe yok (TDE 30 · Mat 30 · Fizik 10 · Kimya 10 · Biyo 10 · Tarih 12 ·
Coğrafya 12 · Din 6 = 120). Felsefe yalnız 10. sınıf listesinde (5 soru) var.
Veride olan ama listede olmayan her ders sessizce düşüyordu.

### Düzeltme

`getLessonSuccessRates()` artık `grafikDersleri()` üzerinden çalışıyor:

**sabit ders listesi ∪ denemelerdeki dersler ∪ soru kayıtlarındaki dersler**

- Hiçbir ders kaybolmaz; **veri yoksa oran da yok** (uydurma yüzde yok).
- `LESSON_CONFIG`'in toplamı (120) **değiştirilmedi** — sınav yapısı aynı.
- Listedeki olmayan ders tek renge düşmesin diye renk **ders adından** türetilir
  (aynı ders her zaman aynı renk).

---

## 3) Bildirim garantisi (görev · acil konu · tekrar)

### Ölçüm (canlı)

- Cihaz kaydı `push_teslim`: bugün 06:37 "Acil konular", 07:04 "Bugünün
  görevleri", 16:45 "Akşam: acil konular", 17:40 "Yeni deneme sonucun var" —
  hepsi `gösterildi = true`. **Kanal sağlamdı, kapsam eksikti.**
- Sunucu fonksiyonu `webpush_tetikle`: "tekrar varsa acil konu **hiç**
  duyurulmaz" (`if adet = 0 then … acil …`), **görev hiç girmiyordu**.
- Puanlamada `else 1.0` vardı: **nedeni boş** satırlar da "acil konu" sayılıyordu
  (uygulamanın kendi hesabı nedensiz satırı saymaz).
- Yeni hesabın **aktif push aboneliği yok** (abonelikler yalnız izin veren
  hesaplarda) → yeni kullanıcı hiçbir bildirim almıyordu.

### Düzeltme

**Sunucu** — `0010_bildirim_garantisi.sql` (canlıya uygulandı):

- Üç kaynak **tek mesajda**: `Bugün: 3 görev · 2 acil konu · 1 tekrar.
  En önce: X, Y.`
- Görev = bugünün çekirdek üç görevi + bugün yapılmış çalışma + nedeni işlenmemiş
  hata satırı. Tekrar = hafıza planı. Acil = **nedeni seçilmiş** hata kayıtları
  (uygulamanın puanlamasıyla).
- Üçü de boşsa **sessiz** (uydurma bildirim yok).
- Tekilleştirme **içerik imzasıyla** (md5): aynı içerik tekrar gönderilmez,
  içerik değişince (görev bitti / yeni acil konu doğdu) yeniden gönderilir.
- Günlük tavan 6, sessiz saat TR 21–06, TTL 90 dk, `urgency: high`.
- Ayrı görev cron'ları kapatıldı: aynı işi iki kanal duyurmasın.

**Uygulama** — `site/index.html`:

- `bildirimGarantisi()`: görev · acil konu · tekrar varsa **uygulama içi**
  bildirim doğar (push izni olmasa da kullanıcı görür).
- Ana sayfada, bekleyen iş varken ve bildirim izni yokken **tek dokunuşluk
  uyarı**: "Bekleyen işin var ama bildirimler kapalı" → gerçek izin akışı.
  iPhone'da "Ana Ekrana Ekle" gibi doğru yönlendirme `bildirimTeshis()`'ten gelir.

### Canlı doğrulama (19 Kas 20:58 TR)

`select public.webpush_tetikle();` → `gönderilen: 1`.
Cihaz kaydı: `push` (17:58:44Z) → `gosterim` `gösterildi = true` (17:58:45Z),
başlık **"Akşam: bugün seni bekleyenler"**.
İkinci çağrı: `gönderilen: 0` (aynı içerik tekrar gönderilmedi).

---

## Testler

| Test | Kapsam | Sonuç |
|---|---|---|
| `tests/v93-uc-saha-hatasi.test.js` | Üç hatanın kaynak/migration kontratı | 55/55 |
| `tests/v93-saha-testi.test.js` | Gerçek fonksiyonlar sahte state ile **koşturulur** (mükerrer birleştirme, Felsefe oranı, bildirim garantisi) | 43/43 |
| `tests/dom/dom-v93-uc-duzeltme.test.js` | Uygulama jsdom'da **gerçekten açılır** (Felsefe grafikte, bildirim doğar, izin bandı) | 26/26 |
| `tests/okz-kuyruk.test.js` | Kimlik artık sid değil (bölüm 8–10) | 44/44 |
| `tests/v86-okz-karsilastir.test.js` | sid vetosu kalktı | 29/29 |
| `npm run -s test:hepsi` | Tüm paket | ✅ |

---

## Açık kalanlar

- Kullanıcının kendi hesabında bildirim izni kapalıysa uygulama bunu **söyler**;
  izni açmak kullanıcı dokunuşu ister (tarayıcı kuralı). Yeni hesapta abonelik,
  izin verildiği anda kurulur.
- `0011` veri onarımı canlı veride elle uygulandı; dosya gelecekteki tekrarlar
  için duruyor (idempotent).
