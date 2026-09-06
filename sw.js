/* Analiz Merkezi — Service Worker
   AĞ ÖNCELİKLİ: çevrimiçiyse hep GÜNCEL dosya sunulur (yayınladığın
   güncelleme anında gelir), çevrimdışiyse önbellek. Sürüm damgası
   build_pwa.py ile otomatik artar (1788692268 yerine zaman damgası). */
const CACHE = "analiz-merkezi-v-1788692268";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icons/icon-192.png", "./icons/icon-512.png", "./firebase-config.js"];
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
