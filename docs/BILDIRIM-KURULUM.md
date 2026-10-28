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
| son_gonderim | son başarılı gönderim günü (bilgi amaçlı) |
| unique (user_id, endpoint) | aynı cihaz iki kez yazılmaz |

`public.bildirim_log` — **anahtar başına günlük tekilleştirme** (v35.5)

| Kolon | Not |
|---|---|
| user_id | `auth.users(id)`, cascade |
| anahtar | `"2026-10-28:coach"`, `"2026-10-28:exam@1"`, … |
| gun | TR günü (`date`) |
| PK | `(user_id, anahtar)` — aynı anahtar ikinci kez yazılamaz |
| 3 günden eski satırlar | fonksiyon kendisi siler |

RLS açık; `anon`/`authenticated` rollerinin hiçbir yetkisi yok (yalnız service role).

RLS: kullanıcı **yalnız kendi** satırlarını görür/yazar/siler. `anon` rolüne hiçbir yetki verilmez.

## Zamanlanmış görev

```
cron.job: bildirim-sabah  →  "35 4 * * *"  (TR 07:35)
cron.job: bildirim-aksam  →  "30 16 * * *" (TR 19:30)
   └─ public.bildirim_cron_tetikle()
        └─ net.http_post → /functions/v1/bildirim-gonder  {mod:"run"}
             x-bildirim-secret: vault'tan
```

`mod:"run"` (v35.5 — GitHub Actions ile **aynı** kural):
- `x-bildirim-secret` yoksa/yanlışsa **401**
- TR 06:00–22:00 dışında hiç göndermez (sabah cron'u 07:35'te çalışır; eski 08 sınırı sabah bildirimini tamamen engelliyordu)
- **sabah (TR < 14) → günün TÜM bildirimleri**, akşam (TR ≥ 14) → yalnız **kritik** anahtarlar
  (`schooleve@`, `schooltoday@`, `exam@`, `:memcrit`)
- anahtar bugün `bildirim_log`'da varsa **atlar** (iki cihaz aynı bildirimi iki kez almaz)
- 404/410 dönen aboneliği **siler** (ölü uç nokta birikmez)
- yanıtta `vardiya` (`sabah`/`aksam`) ve `kontrol` alanları döner — `kontrol`, gömülü
  `buildMessages`'ın sabit örnek durumla ürettiği anahtarlardır (`["coach","exam@1","daily"]`).
  Bu alan görünmüyorsa eski sürüm çalışıyor demektir.

`mod:"test"`:
- `Authorization: Bearer <kullanıcı JWT>` ister, `/auth/v1/user` ile doğrular
- **yalnız çağıranın kendi** aboneliklerine gönderir

## Bildirim metni nasıl seçilir?

**Tek kaynak: `bildirim-logic.js`.** GitHub Actions göndericisi (`bildirim-gonder.js`) bu
dosyayı doğrudan çağırır; edge fonksiyonuna ise `scripts/bildirim-derle.js` tarafından
**gömülür**. İki yol aynı `buildMessages` çıktısını üretir — metinler ayrışamaz.

`buildMessages` bir kullanıcı için **birden çok** mesaj üretir:

| Anahtar | Ne zaman |
|---|---|
| `coach` | her gün — günaydın/iyi akşamlar + sınava kalan gün |
| `reviews` | tekrar günü gelmiş konu varsa |
| `urgent` | öncelik listesi doluysa |
| `memcrit` | hafıza gücü %20 altına düşen konu |
| `forget` | unutma indeksi yükselen konu |
| `schooleve@…` / `schooltoday@…` | okul sınavı yarın / bugün |
| `exam@7` / `exam@3` / `exam@1` | denemeye 7/3/1 gün |
| `daily` | bugünün olayları + hazırlık özeti |

Hepsi güne özel anahtarla (`2026-10-28:coach`) yazılır; aynı anahtar gün içinde ikinci
kez gönderilmez. Sabah hepsi gider, akşam yalnız kritikler. Söyleyecek söz yoksa
**hiç göndermez**.

## Derleme ve test

```bash
node scripts/bildirim-derle.js      # index.ts'i şablon+kriptodan üret
node scripts/bildirim-derle.js --kontrol   # güncel mi?
npm run -s test:bildirim            # 40 kontrol: şifreleme, VAPID, yetki kapıları, gömülü mantık
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
