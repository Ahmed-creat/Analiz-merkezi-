# Analiz Merkezi — Supabase + Vercel yayını

Bu yayın, **en yeni PR (#3 — "Analiz Merkezi düzeltmeleri ve PWA dağıtım paketleri")** içeriğinden
üretilen statik PWA'dır. Bulut katmanı Firebase Auth/Firestore'dan **Supabase**'e taşındı.

## Canlı adresler

| Bileşen | Adres / kimlik |
| --- | --- |
| Uygulama (production) | <https://analiz-merkezi.vercel.app> |
| Vercel projesi | `analiz-merkezi` — `prj_w9G0n8W36VlZAJk5i3iUejfrEBtr` (team `ib SOFTWARE`) |
| Son deployment | `dpl_AhbaU32c6iRm7onjqRLUQkjEG46Q` |
| Supabase projesi | `analiz-merkezi` — ref `ztgzmhfklsdlngrtennp`, bölge `eu-central-1` |

> `analiz-merkezi-ib-software.vercel.app` ekip takma adı Vercel Authentication korumasındadır (giriş ister);
> herkese açık adres **analiz-merkezi.vercel.app**'dir.

## Yayın akışı

1. Kaynak: depodaki `site/` klasörü (PR #3'ün `analiz-merkezi-netlify-20261012.zip` paketinden çıkarıldı,
   Netlify'a özel `netlify.toml` kaldırıldı).
2. Vercel proje ayarları:
   - Root Directory: `deploy`
   - Install Command: `true`
   - Build Command: `bash build.sh`
   - Output Directory: `out`
3. `deploy/build.sh`, public depoyu (`Ahmed-creat/Analiz-merkezi-`) `arena/cc4de070-analiz-merkezi`
   dalından klonlar ve `site/` içeriğini `out/` klasörüne kopyalar.
   - Farklı dal/depo için: `SITE_BRANCH`, `SITE_REPO` ortam değişkenleri.
4. Vercel dosya yüklemesi GitHub hesabına "Login Connection" olmadığı için git entegrasyonu yerine
   build sırasında klonlama kullanılır. Yeni sürüm için: değişikliği dala push et → yeni deployment oluştur.

Yerel önizleme: `npx serve site` (service worker için `localhost` veya https gerekir).

## Supabase şeması

| Tablo | Amaç | RLS |
| --- | --- | --- |
| `public.app_states` | Kullanıcı başına tek satır bulut yedeği (`state` jsonb, `grade`, `deneme_sayisi`, `updated_at`) | `auth.uid() = user_id` (select/insert/update/delete) |
| `public.fcm_tokens` | Kullanıcıya bağlı FCM cihaz tokenları | Yalnızca kendi satırları |
| `public.okulizyon_kuyrugu` | Okulizyon çekim servisinin bıraktığı sınav kuyruğu (`exams` jsonb, `pulled_at`) | Yalnızca kendi satırı |
| `public.okul_duyurulari` | Okul sitesi duyuruları (`baslik`, `tarih`, `url`, `lesson`) | Giriş yapan herkes okur; yazma servis anahtarıyla |

Migration dosyası: `supabase/migrations/0001_analiz_merkezi_supabase_schema.sql` (panelde uygulandı).

## İstemci tarafı

- `site/supabase-config.js` → proje URL'si + public anon anahtar (gizli değildir; RLS korur)
- `site/vendor/supabase.js` → `@supabase/supabase-js` 2.58.0 UMD (CDN bağımlılığı yok, service worker önbelleğinde)
- `site/app-pwa.js`:
  - `sb.auth.signInWithPassword` · `signUp` · `resetPasswordForEmail` · `signInWithOAuth` · `signOut`
  - `saveState()` kancası → 4 sn debounce ile `app_states` upsert; girişte bulut kaydı geri yükleme onayı
  - FCM token → `fcm_tokens`; Okulizyon kuyruğu/duyuruları → Supabase tabloları
  - Supabase yoksa/çevrimdışıysa sessizce çevrimdışı moda düşer

## Auth ayarları (Supabase)

- E-posta/şifre kaydı açık, e-posta onayı kapalı (`mailer_autoconfirm = true`), şifre min. 6 karakter
- Site URL: `https://analiz-merkezi.vercel.app`
- Yönlendirme izinleri: `https://analiz-merkezi.vercel.app/**`, `http://localhost:3000/**`
- Google girişi arayüzde var; Supabase panelinde Google sağlayıcısı yapılandırılmadan pasif kalır
  (kullanıcıya Türkçe "e-posta ile devam et" mesajı gösterilir)

## Vercel ortam değişkenleri

Statik sitede zorunlu değildir; gelecekteki build/edge fonksiyonları için tanımlı:

- `SUPABASE_URL` = `https://ztgzmhfklsdlngrtennp.supabase.co`
- `SUPABASE_ANON_KEY` = public anon anahtar (encrypted)
- `service_role` anahtarı istemciye **konmaz**; gerekirse yalnızca sunucu tarafında "Sensitive" olarak eklenir.
