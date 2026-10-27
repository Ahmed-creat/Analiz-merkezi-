# Analiz Merkezi — Supabase + Vercel yayını

Bu sürüm, **en yeni PR (#3 — "Analiz Merkezi düzeltmeleri ve PWA dağıtım paketleri")** içeriğinin
statik PWA paketinden (`analiz-merkezi-netlify-20261012.zip`) üretilmiştir ve `site/` klasöründen
yayınlanır. Bulut katmanı Firebase'den **Supabase**'e taşındı.

## Yayın

- **Site:** Vercel → proje `analiz-merkezi` (Root Directory: `site`, build adımı yok)
- **Veritabanı / Auth:** Supabase → proje `analiz-merkezi` (`ztgzmhfklsdlngrtennp`, eu-central-1)
- Yerel önizleme: `npx serve site` veya herhangi bir statik sunucu (service worker için https/localhost gerekir)

## Supabase şeması

| Tablo | Amaç | RLS |
| --- | --- | --- |
| `public.app_states` | Kullanıcı başına bulut yedeği (`state` jsonb) | Yalnızca `auth.uid() = user_id` |
| `public.fcm_tokens` | Kullanıcıya bağlı FCM cihaz tokenları | Yalnızca kendi satırları |
| `public.okulizyon_kuyrugu` | Okulizyon çekim servisinin bıraktığı sınav kuyruğu | Yalnızca kendi satırı |
| `public.okul_duyurulari` | Okul sitesi duyuruları (herkes okur) | Giriş yapan herkes okur, yazma yalnızca servis anahtarı |

Migration: `supabase/migrations/0001_analiz_merkezi_supabase_schema.sql` (panelde uygulandı).

## İstemci yapılandırması

- `site/supabase-config.js` → proje URL'si + public (anon/publishable) anahtar
- `site/vendor/supabase.js` → `@supabase/supabase-js` 2.58.0 UMD paketi (CDN bağımlılığı yok, offline çalışır)
- `site/app-pwa.js` →
  - `sb.auth.signInWithPassword` / `signUp` / `resetPasswordForEmail` / `signInWithOAuth`
  - `saveState()` kancası → 4 sn debounce ile `public.app_states` upsert
  - Girişte bulut kaydı varsa geri yükleme onayı
  - FCM token → `public.fcm_tokens`

> Anon anahtar tarayıcıda görünür; güvenlik RLS politikalarıyla sağlanır. `service_role` anahtarı
> asla istemciye konmaz.

## Vercel ortam değişkenleri

Statik site derleme yapmadığı için zorunlu değildir; ileride bir build/edge fonksiyonu eklenirse
kullanılmak üzere şu değişkenler tanımlıdır:

- `SUPABASE_URL` = `https://ztgzmhfklsdlngrtennp.supabase.co`
- `SUPABASE_ANON_KEY` = `site/supabase-config.js` içindeki public anahtar
- `SUPABASE_SERVICE_ROLE_KEY` = **yalnızca sunucu tarafı** (Vercel'de "Sensitive")

## Auth ayarları

- E-posta/şifre kaydı açık, e-posta onayı kapalı (öğrenci akışında anında giriş)
- Site URL + yönlendirme adresleri Vercel alan adına ayarlı
- Google ile giriş için Supabase panelinde Google sağlayıcısı ayrıca yapılandırılmalıdır
