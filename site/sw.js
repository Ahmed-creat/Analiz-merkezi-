/* Analiz Merkezi — Service Worker
   AĞ ÖNCELİKLİ: çevrimiçiyse hep GÜNCEL dosya sunulur (yayınladığın
   güncelleme anında gelir), çevrimdışiyse önbellek. Sürüm damgası
   build_pwa.py ile otomatik artar (1789801981 yerine zaman damgası). */
const CACHE = "analiz-merkezi-v-20261028-v35-0-gorsel-video";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./firebase-config.js",
  "./supabase-config.js",
  "./mesaj.js",
  "./okz-normalize.js",
  "./okz-konu.js",
  "./veri-birlestir.js",
  "./gorsel.js",
  "./video-cozum.js",
  "./content/konu_esleme.json",
  "./vendor/supabase.js",
  "./content/iliski_grafi.json",
  "./content/soru_havuzlari/index.json",
  "./content/soru_havuzlari/biyo_10_u01_k01.json",
  "./content/soru_havuzlari/biyo_10_u01_k02.json",
  "./content/soru_havuzlari/biyo_10_u01_k03.json",
  "./content/soru_havuzlari/biyo_10_u01_k04.json",
  "./content/soru_havuzlari/biyo_10_u01_k05.json",
  "./content/soru_havuzlari/biyo_10_u01_k06.json",
  "./content/soru_havuzlari/biyo_10_u01_k07.json",
  "./content/soru_havuzlari/biyo_10_u02_k01.json",
  "./content/soru_havuzlari/biyo_10_u02_k02.json",
  "./content/soru_havuzlari/biyo_10_u02_k03.json",
  "./content/soru_havuzlari/biyo_10_u02_k04.json",
  "./content/soru_havuzlari/cogr_10_u01_k01.json",
  "./content/soru_havuzlari/cogr_10_u02_k01.json",
  "./content/soru_havuzlari/cogr_10_u02_k02.json",
  "./content/soru_havuzlari/cogr_10_u03_k01.json",
  "./content/soru_havuzlari/cogr_10_u03_k02.json",
  "./content/soru_havuzlari/cogr_10_u03_k03.json",
  "./content/soru_havuzlari/cogr_10_u03_k04.json",
  "./content/soru_havuzlari/cogr_10_u03_k05.json",
  "./content/soru_havuzlari/cogr_10_u04_k01.json",
  "./content/soru_havuzlari/cogr_10_u05_k01.json",
  "./content/soru_havuzlari/cogr_10_u06_k01.json",
  "./content/soru_havuzlari/din_10_u01_k01.json",
  "./content/soru_havuzlari/din_10_u01_k02.json",
  "./content/soru_havuzlari/din_10_u01_k03.json",
  "./content/soru_havuzlari/din_10_u02_k01.json",
  "./content/soru_havuzlari/din_10_u02_k02.json",
  "./content/soru_havuzlari/din_10_u03_k01.json",
  "./content/soru_havuzlari/din_10_u03_k02.json",
  "./content/soru_havuzlari/din_10_u03_k03.json",
  "./content/soru_havuzlari/din_10_u04_k01.json",
  "./content/soru_havuzlari/din_10_u04_k02.json",
  "./content/soru_havuzlari/din_10_u04_k03.json",
  "./content/soru_havuzlari/din_10_u05_k01.json",
  "./content/soru_havuzlari/din_10_u05_k02.json",
  "./content/soru_havuzlari/edebiyat_10_u01_k01.json",
  "./content/soru_havuzlari/edebiyat_10_u01_k02.json",
  "./content/soru_havuzlari/edebiyat_10_u01_k03.json",
  "./content/soru_havuzlari/edebiyat_10_u01_k04.json",
  "./content/soru_havuzlari/edebiyat_10_u01_k05.json",
  "./content/soru_havuzlari/edebiyat_10_u01_k06.json",
  "./content/soru_havuzlari/edebiyat_10_u01_k07.json",
  "./content/soru_havuzlari/edebiyat_10_u01_k08.json",
  "./content/soru_havuzlari/edebiyat_10_u01_k09.json",
  "./content/soru_havuzlari/edebiyat_10_u02_k01.json",
  "./content/soru_havuzlari/edebiyat_10_u02_k02.json",
  "./content/soru_havuzlari/edebiyat_10_u02_k03.json",
  "./content/soru_havuzlari/edebiyat_10_u02_k04.json",
  "./content/soru_havuzlari/edebiyat_10_u02_k05.json",
  "./content/soru_havuzlari/edebiyat_10_u02_k06.json",
  "./content/soru_havuzlari/edebiyat_10_u02_k07.json",
  "./content/soru_havuzlari/edebiyat_10_u02_k08.json",
  "./content/soru_havuzlari/edebiyat_10_u02_k09.json",
  "./content/soru_havuzlari/edebiyat_10_u03_k01.json",
  "./content/soru_havuzlari/edebiyat_10_u03_k02.json",
  "./content/soru_havuzlari/edebiyat_10_u03_k03.json",
  "./content/soru_havuzlari/edebiyat_10_u03_k04.json",
  "./content/soru_havuzlari/edebiyat_10_u03_k05.json",
  "./content/soru_havuzlari/edebiyat_10_u04_k01.json",
  "./content/soru_havuzlari/edebiyat_10_u04_k02.json",
  "./content/soru_havuzlari/edebiyat_10_u04_k03.json",
  "./content/soru_havuzlari/edebiyat_10_u04_k04.json",
  "./content/soru_havuzlari/edebiyat_10_u04_k05.json",
  "./content/soru_havuzlari/fel_10_u01_k01.json",
  "./content/soru_havuzlari/fel_10_u01_k02.json",
  "./content/soru_havuzlari/fel_10_u01_k03.json",
  "./content/soru_havuzlari/fel_10_u01_k04.json",
  "./content/soru_havuzlari/fel_10_u01_k05.json",
  "./content/soru_havuzlari/fel_10_u01_k06.json",
  "./content/soru_havuzlari/fel_10_u02_k01.json",
  "./content/soru_havuzlari/fel_10_u02_k02.json",
  "./content/soru_havuzlari/fel_10_u02_k03.json",
  "./content/soru_havuzlari/fel_10_u03_k01.json",
  "./content/soru_havuzlari/fel_10_u03_k02.json",
  "./content/soru_havuzlari/fel_10_u04_k01.json",
  "./content/soru_havuzlari/fel_10_u04_k02.json",
  "./content/soru_havuzlari/fel_10_u05_k01.json",
  "./content/soru_havuzlari/fel_10_u05_k02.json",
  "./content/soru_havuzlari/fel_10_u06_k01.json",
  "./content/soru_havuzlari/fel_10_u06_k02.json",
  "./content/soru_havuzlari/fel_10_u07_k01.json",
  "./content/soru_havuzlari/fel_10_u07_k02.json",
  "./content/soru_havuzlari/fel_10_u08_k01.json",
  "./content/soru_havuzlari/fel_10_u08_k02.json",
  "./content/soru_havuzlari/fel_10_u09_k01.json",
  "./content/soru_havuzlari/fel_10_u09_k02.json",
  "./content/soru_havuzlari/fizik_10_u01_k01.json",
  "./content/soru_havuzlari/fizik_10_u01_k02.json",
  "./content/soru_havuzlari/fizik_10_u01_k03.json",
  "./content/soru_havuzlari/fizik_10_u01_k04.json",
  "./content/soru_havuzlari/fizik_10_u02_k01.json",
  "./content/soru_havuzlari/fizik_10_u02_k02.json",
  "./content/soru_havuzlari/fizik_10_u02_k03.json",
  "./content/soru_havuzlari/fizik_10_u02_k04.json",
  "./content/soru_havuzlari/fizik_10_u03_k01.json",
  "./content/soru_havuzlari/fizik_10_u03_k02.json",
  "./content/soru_havuzlari/fizik_10_u03_k03.json",
  "./content/soru_havuzlari/fizik_10_u03_k04.json",
  "./content/soru_havuzlari/fizik_10_u03_k05.json",
  "./content/soru_havuzlari/fizik_10_u03_k06.json",
  "./content/soru_havuzlari/fizik_10_u03_k07.json",
  "./content/soru_havuzlari/fizik_10_u04_k01.json",
  "./content/soru_havuzlari/fizik_10_u04_k02.json",
  "./content/soru_havuzlari/fizik_10_u04_k03.json",
  "./content/soru_havuzlari/fizik_10_u04_k04.json",
  "./content/soru_havuzlari/fizik_10_u04_k05.json",
  "./content/soru_havuzlari/fizik_10_u04_k06.json",
  "./content/soru_havuzlari/kimya_10_u01_k01.json",
  "./content/soru_havuzlari/kimya_10_u01_k02.json",
  "./content/soru_havuzlari/kimya_10_u01_k03.json",
  "./content/soru_havuzlari/kimya_10_u01_k04.json",
  "./content/soru_havuzlari/kimya_10_u01_k05.json",
  "./content/soru_havuzlari/kimya_10_u01_k06.json",
  "./content/soru_havuzlari/kimya_10_u01_k07.json",
  "./content/soru_havuzlari/kimya_10_u01_k08.json",
  "./content/soru_havuzlari/kimya_10_u02_k01.json",
  "./content/soru_havuzlari/kimya_10_u02_k02.json",
  "./content/soru_havuzlari/kimya_10_u02_k03.json",
  "./content/soru_havuzlari/kimya_10_u02_k04.json",
  "./content/soru_havuzlari/kimya_10_u02_k05.json",
  "./content/soru_havuzlari/kimya_10_u03_k01.json",
  "./content/soru_havuzlari/mat_10_u01_k01.json",
  "./content/soru_havuzlari/mat_10_u01_k02.json",
  "./content/soru_havuzlari/mat_10_u01_k03.json",
  "./content/soru_havuzlari/mat_10_u01_k04.json",
  "./content/soru_havuzlari/mat_10_u02_k01.json",
  "./content/soru_havuzlari/mat_10_u02_k02.json",
  "./content/soru_havuzlari/mat_10_u03_k01.json",
  "./content/soru_havuzlari/mat_10_u03_k02.json",
  "./content/soru_havuzlari/mat_10_u03_k03.json",
  "./content/soru_havuzlari/mat_10_u04_k01.json",
  "./content/soru_havuzlari/mat_10_u04_k02.json",
  "./content/soru_havuzlari/mat_10_u04_k03.json",
  "./content/soru_havuzlari/mat_10_u04_k04.json",
  "./content/soru_havuzlari/mat_10_u04_k05.json",
  "./content/soru_havuzlari/mat_10_u04_k06.json",
  "./content/soru_havuzlari/mat_10_u05_k01.json",
  "./content/soru_havuzlari/mat_10_u05_k02.json",
  "./content/soru_havuzlari/mat_10_u06_k01.json",
  "./content/soru_havuzlari/mat_10_u06_k02.json",
  "./content/soru_havuzlari/mat_10_u07_k01.json",
  "./content/soru_havuzlari/mat_10_u07_k02.json",
  "./content/soru_havuzlari/tarih_10_u01_k01.json",
  "./content/soru_havuzlari/tarih_10_u01_k02.json",
  "./content/soru_havuzlari/tarih_10_u01_k03.json",
  "./content/soru_havuzlari/tarih_10_u02_k01.json",
  "./content/soru_havuzlari/tarih_10_u02_k02.json",
  "./content/soru_havuzlari/tarih_10_u03_k01.json",
  "./content/soru_havuzlari/tarih_10_u03_k02.json",
  "./content/soru_havuzlari/tarih_10_u03_k03.json",
  "./content/soru_havuzlari/tarih_10_u03_k04.json",
  "./content/soru_havuzlari/tarih_10_u03_k05.json"
];
const APP_URL = self.location.origin + "/";
const ICON_URL = "./icons/icon-192.png";

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then((res) => {
      const kopya = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, kopya));
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || (e.request.mode === "navigate" ? caches.match("./index.html") : undefined)))
  );
});

// FCM token'ı app-pwa.js içinde bu sw.js kaydıyla alınıyor.
// Bu nedenle arka plan push'u da burada karşılanmalı; ayrı firebase-messaging-sw.js
// dosyası bu token için devreye girmez. Mesaj geldiğinde sistem bildirimi göster.
function pushPayload(event) {
  if (!event.data) return {};
  try { return event.data.json(); }
  catch (e) {
    try { return { notification: { title: "Analiz Merkezi", body: event.data.text() } }; }
    catch (_) { return {}; }
  }
}
function bildirimSecenekleri(payload) {
  const n = payload.notification || {};
  const data = payload.data || {};
  const title = n.title || data.title || payload.title || "Analiz Merkezi";
  const body = n.body || data.body || payload.body || "Yeni bildirimin var.";
  const url = (payload.fcmOptions && payload.fcmOptions.link) || data.url || APP_URL;
  const icon = n.icon || data.icon || ICON_URL;
  const badge = n.badge || data.badge || ICON_URL;
  const tag = data.key || payload.collapse_key || "analiz-merkezi";
  return { title, options: { body, icon, badge, tag, renotify: false, data: { url } } };
}
self.addEventListener("push", (event) => {
  const secim = bildirimSecenekleri(pushPayload(event));
  event.waitUntil(self.registration.showNotification(secim.title, secim.options));
});

/* Bildirime tıklayınca uygulamayı aç / öne getir */
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const hedef = (e.notification.data && e.notification.data.url) || APP_URL;
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
      for (const c of cs) {
        if ("focus" in c) {
          try { c.navigate(hedef); } catch (_) {}
          return c.focus();
        }
      }
      return self.clients.openWindow(hedef);
    })
  );
});
