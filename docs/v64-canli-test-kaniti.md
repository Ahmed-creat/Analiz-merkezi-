# v64 — Canlı Test Kanıtı: Uygulama KAPALIYKEN Bildirim

**Tarih:** 16 Kasım 2026 · **Senaryo:** Tablet ekranı kapalı, uygulama tamamen
kapalı, internet açık, pil %2.

## Kullanıcının sorusu
> "Mesaj için uygulamayı açmam mı gerekiyor? Ne saçmalıyorsun o zaman
> bildirime ne gerek vardı ki?"

Önceki turda söylenen "tablet/uygulama açık olmalı" cümlesi **yanlıştı**.

## Kurulan test
Tek seferlik cron (`deneme-1410`, `10 11 16 11 *` = 14:10 TR), gerçek
hatırlatma içeriğiyle `push-tani`'yi çağırdı. Test sonrası cron silindi,
kullanılan geçici `webpush_tek_sefer()` fonksiyonu düşürüldü.

## Ölçüm — üç katman da doğrulandı

| TR saat | Katman | Sonuç |
|---|---|---|
| 14:10:00 | cron → `push-tani` | **201** · `ttl: 21600` · `urgency: high` · `topic: am-deneme-1410` |
| 14:10:18 | FCM → service worker | `push_teslim` **`push`** satırı · uç `gPs8` |
| 14:10:21 | cihaz | `push_teslim` **`gosterim`** · `gosterildi = true` |

Bildirim tablette **"Günaydın! Tekrar Zamanı"** başlığıyla göründü
(5 konu listesiyle). Uygulama kapalıydı, ekran kapalıydı.

## Neden daha önce gelmiyordu
07:35'te FCM mesajı **201** ile kabul etti ama cihaz uykudaydı; TTL 90 dk
dolunca push servisi mesajı **sildi** (`push_teslim`'de tek satır bile yoktu).
TTL 90 dk bizim ayarımızdı; web-push varsayılanı 4 haftadır.

## Kalıcı düzeltmeler
- TTL `5400 → 21600` (6 saat): cihaz uyandığında mesaj hâlâ yaşar.
- `Urgency: high` (RFC 8030 §5.3): FCM yüksek öncelik, uyuyan cihazı uyandırır.
- `Topic: am-<gün>-<vardiya>` (RFC 8030 §5.4): tekrar denemeleri yığılmaz.
- Ölü uç (404/410) pasife alınır (push-tani v8+).
- Profilden elle onarım düğmeleri kaldırıldı; onarım 4 otomatik yolda.
- `webpush_tetikle()` artık `anon`/`authenticated` tarafından çağrılamaz
  (RPC ile bildirim spam'i engellendi); cron `postgres` olarak çalışmaya devam eder.

## Beklenti
- Akşam hatırlatması: **19:30 TR** (`bildirim-aksam`, `30 16 * * *`).
- 19:30'da cihaz uyusa bile mesaj **01:30'a kadar** TTL içinde yaşar.
- Gelmezse ilk bakılacak: `push_teslim`'de `push` satırı var mı?
  - Yok → mesaj cihaza hiç inmedi (ağ/pil kısıtı).
  - Var, `gosterim` yok → cihaz aldı, Android gösteremedi (bildirim izni/kanal).
