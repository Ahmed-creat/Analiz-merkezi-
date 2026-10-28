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

## Push bildirim — v35.5 durumu

İki gönderici var, ikisi de **aynı metni** üretiyor (`bildirim-logic.js` tek kaynak):

| Gönderici | Kanal | Durum |
|---|---|---|
| GitHub Actions `bildirim-gonder.js` | Firebase (FCM) | Firestore okuyor; hedef adres artık **Vercel** |
| Supabase Edge `bildirim-gonder` v4 + pg_cron | Web Push (VAPID) | **çalışıyor**, `push_abonelikleri` dolunca gönderir |
| Vercel cron / diğer | — | kullanılmıyor |

**Kalan tek adım kullanıcıda:** uygulama içinde Ayarlar → **Bildirim İzni İste**
dokunuşu. İzin + abonelik kaydı olmadan hiçbir kanal telefona ulaşamaz
(`public.push_abonelikleri` şu an **0 satır**).

Metinler: `coach` (her gün), `reviews`, `urgent`, `memcrit`, `forget`,
`schooleve@…`, `schooltoday@…`, `exam@7/3/1`, `daily` — sabah hepsi, akşam yalnız
kritikler; her anahtar günde bir kez (`public.bildirim_log`).

## Okul duyuruları — ÖLÜ

`okul_duyuruları` tablosu okunuyor ama **hiçbir kod yazmıyor**.
