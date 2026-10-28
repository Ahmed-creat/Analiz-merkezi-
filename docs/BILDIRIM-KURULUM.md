# Uygulama Kapalıyken Bildirim — Kurulum ve Durum

Bu belge **v35.4** ile gelen Web Push (VAPID) altyapısını anlatır.
FCM (Firebase) yolu artık **zorunlu değil**; sunucu bizim, anahtar bizim.

## Ne çalışıyor, ne çalışmıyor (dürüst)

| Ortam | Uygulama kapalıyken |
|---|---|
| Android Chrome / masaüstü Chrome-Edge-Firefox | ✅ çalışır |
| iPhone / iPad Safari (iOS 16.4+) | ✅ **yalnız "Ana Ekrana Ekle" ile kurulduysa** |
| iPhone/iPad, sekmede açılmış hâli | ❌ iOS izin vermiyor (Apple kuralı) |
| Gizli sekme | ❌ |
| Bildirim iznini reddeden kullanıcı | ❌ |

> iOS kısıtı uygulama hatası değil, Apple'ın Safari kuralıdır.
> Ana ekrana eklenince aynı Android akışı gibi çalışır.

## Parçalar

| Katman | Dosya / yer | İş |
|---|---|---|
| Kripto | `scripts/webpush-kripto.mjs` | RFC 8291 `aes128gcm` + RFC 8292 VAPID (WebCrypto, bağımlılık yok) |
| Derleyici | `scripts/bildirim-derle.js` | Kriptoyu şablona gömüp `index.ts` üretir |
| Şablon | `supabase/functions/bildirim-gonder/sablon.ts` | Sunucu mantığı (elle düzenlenen dosya) |
| Yayın dosyası | `supabase/functions/bildirim-gonder/index.ts` | **ÜRETİLMİŞ** — elle düzenlenmez |
| Tarayıcı | `site/push-bildirim.js` | Abonelik + kayıt + test (`window.AmPush`) |
| Servis çalışanı | `site/sw.js` → `push` / `notificationclick` | Bildirimi gösterir, tıklanınca `url`'i açar |
| Arayüz | Ayarlar → **BİLDİRİM** | Aç/Durum/Test bildirimi |

## Gizli değerler (Supabase → Edge Functions → Secrets)

| Ad | Ne |
|---|---|
| `VAPID_PUBLIC_KEY` | 65 baytlık açık anahtar (base64url). `site/push-bildirim.js` içinde **aynı** değer var (gizli değildir). |
| `VAPID_PRIVATE_JWK` | `x.y.d` biçiminde P-256 özel anahtar. **Asla depoya yazılmaz.** |
| `VAPID_KONU` | `mailto:...` iletişim adresi |
| `BILDIRIM_SECRET` | `mod:"run"` için `x-bildirim-secret` başlığı |
| `CRON_SECRET` | `okulizyon-cek` `mod:"run"` kapısı (`x-cron-secret`) |

Aynı sırların kopyaları `vault.decrypted_secrets` içinde:
`bildirim_secret`, `cron_secret` — pg_cron fonksiyonları oradan okur.

## Veritabanı

`public.push_abonelikleri`

| Kolon | Not |
|---|---|
| id | uuid |
| user_id | `auth.users(id)` — silinince abonelikler de gider |
| endpoint / p256dh / auth | tarayıcının verdiği push adresi ve anahtarlar |
| aktif | varsayılan true |
| son_gonderim | TR günü; **günde 1 bildirim** kuralı bununla uygulanır |
| unique (user_id, endpoint) | aynı cihaz iki kez yazılmaz |

RLS: kullanıcı **yalnız kendi** satırlarını görür/yazar/siler. `anon` rolüne hiçbir yetki verilmez.

## Zamanlanmış görev

```
cron.job: bildirim-gunluk  →  "0 16 * * *"  (TR 19:00)
   └─ public.bildirim_cron_tetikle()
        └─ net.http_post → /functions/v1/bildirim-gonder  {mod:"run"}
             x-bildirim-secret: vault'tan
```

`mod:"run"`:
- `x-bildirim-secret` yoksa/yanlışsa **401**
- TR 08:00–22:00 dışında hiç göndermez
- bugün gönderilmiş aboneliği atlar (`son_gonderim`)
- 404/410 dönen aboneliği **siler** (ölü uç nokta birikmez)

`mod:"test"`:
- `Authorization: Bearer <kullanıcı JWT>` ister, `/auth/v1/user` ile doğrular
- **yalnız çağıranın kendi** aboneliklerine gönderir

## Bildirim metni nasıl seçilir?

Sunucu, kullanıcının `app_states.state` kaydına bakar ve **tek** anlamlı mesaj seçer:

1. bugün/gecikmiş konu tekrarı → "N konunun tekrar günü"
2. kısa kontrol zamanı gelmiş konu → "N konuda kısa kontrol hazır (3 soru)"
3. sınava ≤ 7 gün → "Sınava N gün kaldı"
4. günlük görev eksik → "Bugünkü hedefin duruyor"

Söyleyecek söz yoksa **hiç göndermez** (rahatsız etmez).

## Derleme ve test

```bash
node scripts/bildirim-derle.js      # index.ts'i şablon+kriptodan üret
node scripts/bildirim-derle.js --kontrol   # güncel mi?
npm run -s test:bildirim            # 37 kontrol: şifreleme, VAPID, yetki kapıları
```

Testler şifreli gövdeyi gerçekten **çözer** (tarayıcının yaptığı işin eşi) ve
VAPID imzasını doğrular. Yani "çalışıyor gibi görünüyor" değil, kanıtlı.

## Kullanıcı görünen akış

1. Giriş yap
2. **Ayarlar → BİLDİRİM → "Bildirim İzni İste"**
3. İzin ver → abonelik `push_abonelikleri`'ne yazılır, satır "✓ Arka plan bildirimi açık" olur
4. **"Test bildirimi gönder"** → birkaç saniye içinde bildirim gelir
5. Bildirime dokun → ilgili sayfa açılır (`#konu=...` / `#deneme=...`)

## Sık karşılaşılanlar

| Belirti | Sebep / çözüm |
|---|---|
| "Abonelik var, hesaba bağlanması gerekiyor" | Giriş yapılmamış ya da RLS reddetti; Ayarlar'dan kapat-aç |
| Test 404 | Bu cihaz kayıtlı değil — önce bildirimleri aç |
| Test 401 | Oturum süresi dolmuş; yeniden giriş |
| Hiç bildirim gelmiyor (test çalışıyor) | `mesajSec` boş dönmüş olabilir: tekrar/kontrol/sınav/görev yoksa sunucu susar |
| iPhone'da hiç gelmiyor | Safari'de "Ana Ekrana Ekle" ile kurulmadıkça iOS izin vermez |
