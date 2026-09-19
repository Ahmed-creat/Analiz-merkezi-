# Bildirim sorunu — teşhis ve v33.1 düzeltmesi

## Bulgu
GitHub Actions tarafındaki aktif iş akışı (`.github/workflows/bildirim.yml`) çalışıyor; son test koşusunda Okulizyon adımları test modu nedeniyle atlanıp `bildirim-gonder.js` çalıştırılmış. Depoda ayrıca eski `.github/workflows/main.yml` vardı; bu dosya GitHub'da elle devre dışı bırakılmış olsa da aynı isimle kafa karıştırıyordu ve PR'da kaldırıldı.

Asıl kritik istemci tarafı sorun şuydu:

- `app-pwa.js`, FCM token'ını `getToken(..., { serviceWorkerRegistration: await navigator.serviceWorker.ready })` ile **`sw.js` service worker kaydına bağlı** alıyor.
- Ancak v33 `sw.js` sadece cache/fetch yapıyordu; `push` ve `notificationclick` işleyicisi yoktu.
- Pakette ayrıca `firebase-messaging-sw.js` bulunsa da token `sw.js` kaydına bağlı olduğu için bu dosya arka plan bildiriminde devreye girmiyordu.
- Sonuç: Actions/FCM tarafı “gönderildi” diyebilir; fakat uygulama kapalı/arka plandayken telefonda gösterilecek sistem bildirimi oluşmayabilirdi.

## Düzeltme
- `sw.js` içine Web Push payload'ını okuyup sistem bildirimi gösteren `push` işleyicisi eklendi.
- Bildirime tıklanınca `https://analizmerkezii.netlify.app/` adresini açan/öne getiren `notificationclick` işleyicisi eklendi.
- `bildirim-gonder.js`, `degisiklik-kontrol.js` ve opsiyonel Cloud Functions `index.js` WebPush `fcmOptions.link`, mutlak icon/badge URL'si ve `data.url` ile güçlendirildi.
- Eski/disabled `.github/workflows/main.yml` kaldırıldı; tek iş akışı `bildirim.yml` kaldı.
- `analiz-merkezi-devir-teslim.zip` içindeki `site-yayin.zip` ve `guncelleme.zip` v33.1 olarak güncellendi.

## Yayın sonrası yapılacak test
1. PR merge edildikten sonra `analiz-merkezi-devir-teslim.zip` içindeki `site-yayin.zip` Netlify'a yüklenir.
2. Telefonda site bir kez açılır; Okulizyon başlığında `v33.1` görülmeli.
3. Profil → Giriş Yap ve bildirim izni verilir.
4. GitHub Actions → **Bildirim Motoru** → Run workflow → `test` işaretlenir.
5. Logda `✓ gönderildi` görülürse ve telefon bildirimi gelirse zincir tamamdır. `token YOK` görülürse telefon tarafında giriş/izin yapılmamıştır; `not-registered` görülürse eski token silinir, telefonda yeniden giriş/izin gerekir.

> Not: PR kullanıcı “tmm” demeden merge edilmemeli.
