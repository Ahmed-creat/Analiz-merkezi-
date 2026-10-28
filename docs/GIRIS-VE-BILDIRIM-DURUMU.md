# Giriş yöntemleri ve bildirim durumu (v34.6)

## Google ile giriş — AÇIK DEĞİL

Hata: `{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}`

Sebep koddan değil, **Supabase projesindeki sağlayıcı ayarından**:

```
external_google_enabled : false
external_google_client_id : null
```

Supabase'de Google sağlayıcısı kapalı olduğu için `signInWithOAuth({provider:"google"})`
istek atıyor ve 400 dönüyor.

### Açmak için (tek seferlik, ~5 dakika)
1. Google Cloud Console → **APIs & Services → Credentials** → *Create credentials*
   → **OAuth client ID** → *Web application*.
2. **Authorized redirect URI**:
   `https://ztgzmhfklsdlngrtennp.supabase.co/auth/v1/callback`
3. Çıkan **Client ID** ve **Client Secret** → Supabase →
   **Authentication → Providers → Google** → Enable + değerleri gir → Save.
4. Supabase → **Authentication → URL Configuration** → Site URL zaten
   `https://analiz-merkezi.vercel.app`.

Açıldığı an ek kod gerekmez; düğme çalışır.

### Şimdilik yapılan (v34.6)
- Giriş penceresi açılırken `/auth/v1/settings` sorgulanır;
  `google` kapalıysa düğme **pasifleşir** ve altında ne yapılacağı yazar
  (ham 400 mesajı kullanıcıya gösterilmez).
- E-posta + şifre ile giriş/kayıt sorunsuz çalışıyor (`mailer_autoconfirm: true`).

## Push bildirim — ŞU AN ÇALIŞMIYOR

GitHub Actions (`Bildirim Motoru`) yeşil görünüyor ama **Firestore** okuyor ve
**eski Netlify adresine** (`analizmerkezii.netlify.app`) bakıyor. Yeni uygulama
ise FCM token'ını **Supabase `public.fcm_tokens`** tablosuna yazıyor (şu an 0 satır).
Sonuç: uygulamayı açmadan bildirim gelmez.

Düzeltmek için: bildirim gönderimi Supabase Edge Function + pg_cron'a taşınmalı,
`FIREBASE_SERVICE_ACCOUNT` secret'ı Supabase'e eklenmeli.

## Okul duyuruları — ÖLÜ

`okul_duyuruları` tablosu okunuyor ama **hiçbir kod yazmıyor**.
