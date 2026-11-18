/* Analiz Merkezi — Service Worker
   AĞ ÖNCELİKLİ: çevrimiçiyse hep GÜNCEL dosya sunulur (yayınladığın
   güncelleme anında gelir), çevrimdışiyse önbellek. Sürüm damgası
   build_pwa.py ile otomatik artar (1789801981 yerine zaman damgası). */
const CACHE = "analiz-merkezi-v-20261027-v85-tek-liste";
const ASSETS = [
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./firebase-config.js",
  "./supabase-config.js",
  "./mesaj.js",
  "./okz-normalize.js",
  "./okz-konu.js",
  "./okz-meb.js",
  "./okz-tde-veri.js",
  "./okz-tde.js",
  "./konu-anahtar.js",
  "./havuz-bul.js",
  "./veri-sikistir.js",
  "./veri-birlestir.js",
  "./gorsel.js",
  "./kok-eksik.js",
  "./video-cozum.js",
  "./push-bildirim.js",
  "./bkt-engine.js",
  "./kart.js",
  "./content/konu_esleme.json",
  "./vendor/supabase.js",
  "./content/iliski_grafi.json",
  "./content/soru_havuzlari/biyo_10_u01_k01.json",
  "./content/soru_havuzlari/biyo_10_u01_k02.json",
  "./content/soru_havuzlari/biyo_10_u01_k03.json",
  "./content/soru_havuzlari/biyo_10_u01_k04.json",
  "./content/soru_havuzlari/biyo_10_u01_k05.json",
  "./content/soru_havuzlari/biyo_10_u01_k06.json",
  "./content/soru_havuzlari/biyo_10_u01_k07.json",
  "./content/soru_havuzlari/biyo_10_u01_k08.json",
  "./content/soru_havuzlari/biyo_10_u01_k09.json",
  "./content/soru_havuzlari/biyo_10_u01_k10.json",
  "./content/soru_havuzlari/biyo_10_u02_k01.json",
  "./content/soru_havuzlari/biyo_10_u02_k02.json",
  "./content/soru_havuzlari/biyo_10_u02_k03.json",
  "./content/soru_havuzlari/biyo_10_u02_k04.json",
  "./content/soru_havuzlari/biyo_10_u02_k05.json",
  "./content/soru_havuzlari/biyo_10_u02_k06.json",
  "./content/soru_havuzlari/biyo_10_u02_k07.json",
  "./content/soru_havuzlari/biyo_10_u02_k08.json",
  "./content/soru_havuzlari/biyo_10_u02_k09.json",
  "./content/soru_havuzlari/cogr_10_u01_k01.json",
  "./content/soru_havuzlari/cogr_10_u02_k01.json",
  "./content/soru_havuzlari/cogr_10_u02_k02.json",
  "./content/soru_havuzlari/cogr_10_u03_k01.json",
  "./content/soru_havuzlari/cogr_10_u03_k02.json",
  "./content/soru_havuzlari/cogr_10_u03_k03.json",
  "./content/soru_havuzlari/cogr_10_u03_k04.json",
  "./content/soru_havuzlari/cogr_10_u03_k05.json",
  "./content/soru_havuzlari/cogr_10_u04_k01.json",
  "./content/soru_havuzlari/cogr_10_u04_k02.json",
  "./content/soru_havuzlari/cogr_10_u05_k01.json",
  "./content/soru_havuzlari/cogr_10_u05_k02.json",
  "./content/soru_havuzlari/cogr_10_u05_k03.json",
  "./content/soru_havuzlari/cogr_10_u06_k01.json",
  "./content/soru_havuzlari/cogr_10_u06_k02.json",
  "./content/soru_havuzlari/cogr_10_u06_k03.json",
  "./content/soru_havuzlari/cogr_10_u06_k04.json",
  "./content/soru_havuzlari/cogr_10_u07_k01.json",
  "./content/soru_havuzlari/din_10_u01_k01.json",
  "./content/soru_havuzlari/din_10_u01_k02.json",
  "./content/soru_havuzlari/din_10_u01_k03.json",
  "./content/soru_havuzlari/din_10_u01_k04.json",
  "./content/soru_havuzlari/din_10_u02_k01.json",
  "./content/soru_havuzlari/din_10_u02_k02.json",
  "./content/soru_havuzlari/din_10_u02_k03.json",
  "./content/soru_havuzlari/din_10_u02_k04.json",
  "./content/soru_havuzlari/din_10_u02_k05.json",
  "./content/soru_havuzlari/din_10_u02_k06.json",
  "./content/soru_havuzlari/din_10_u02_k07.json",
  "./content/soru_havuzlari/din_10_u03_k01.json",
  "./content/soru_havuzlari/din_10_u03_k02.json",
  "./content/soru_havuzlari/din_10_u03_k03.json",
  "./content/soru_havuzlari/din_10_u03_k04.json",
  "./content/soru_havuzlari/din_10_u04_k01.json",
  "./content/soru_havuzlari/din_10_u04_k02.json",
  "./content/soru_havuzlari/din_10_u04_k03.json",
  "./content/soru_havuzlari/din_10_u04_k04.json",
  "./content/soru_havuzlari/din_10_u05_k01.json",
  "./content/soru_havuzlari/din_10_u05_k02.json",
  "./content/soru_havuzlari/din_10_u05_k03.json",
  "./content/soru_havuzlari/din_10_u05_k04.json",
  "./content/soru_havuzlari/din_10_u05_k05.json",
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
  "./content/soru_havuzlari/edebiyat_10_u03_k06.json",
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
  "./content/soru_havuzlari/fizik_10_u01_k05.json",
  "./content/soru_havuzlari/fizik_10_u01_k06.json",
  "./content/soru_havuzlari/fizik_10_u01_k07.json",
  "./content/soru_havuzlari/fizik_10_u01_k08.json",
  "./content/soru_havuzlari/fizik_10_u01_k09.json",
  "./content/soru_havuzlari/fizik_10_u02_k01.json",
  "./content/soru_havuzlari/fizik_10_u02_k02.json",
  "./content/soru_havuzlari/fizik_10_u02_k03.json",
  "./content/soru_havuzlari/fizik_10_u02_k04.json",
  "./content/soru_havuzlari/fizik_10_u02_k05.json",
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
  "./content/soru_havuzlari/fizik_10_u04_k07.json",
  "./content/soru_havuzlari/index.json",
  "./content/soru_havuzlari/kimya_10_u01_k01.json",
  "./content/soru_havuzlari/kimya_10_u01_k02.json",
  "./content/soru_havuzlari/kimya_10_u01_k03.json",
  "./content/soru_havuzlari/kimya_10_u01_k04.json",
  "./content/soru_havuzlari/kimya_10_u01_k05.json",
  "./content/soru_havuzlari/kimya_10_u01_k06.json",
  "./content/soru_havuzlari/kimya_10_u01_k07.json",
  "./content/soru_havuzlari/kimya_10_u01_k08.json",
  "./content/soru_havuzlari/kimya_10_u01_k09.json",
  "./content/soru_havuzlari/kimya_10_u02_k01.json",
  "./content/soru_havuzlari/kimya_10_u02_k02.json",
  "./content/soru_havuzlari/kimya_10_u02_k03.json",
  "./content/soru_havuzlari/kimya_10_u02_k04.json",
  "./content/soru_havuzlari/kimya_10_u02_k05.json",
  "./content/soru_havuzlari/kimya_10_u02_k06.json",
  "./content/soru_havuzlari/kimya_10_u02_k07.json",
  "./content/soru_havuzlari/kimya_10_u02_k08.json",
  "./content/soru_havuzlari/kimya_10_u03_k01.json",
  "./content/soru_havuzlari/kimya_10_u03_k02.json",
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
  "./content/soru_havuzlari/tar_10_u01_k01.json",
  "./content/soru_havuzlari/tar_10_u01_k02.json",
  "./content/soru_havuzlari/tar_10_u01_k03.json",
  "./content/soru_havuzlari/tar_10_u01_k04.json",
  "./content/soru_havuzlari/tar_10_u02_k05.json",
  "./content/soru_havuzlari/tar_10_u02_k06.json",
  "./content/soru_havuzlari/tar_10_u02_k07.json",
  "./content/soru_havuzlari/tar_10_u02_k08.json",
  "./content/soru_havuzlari/tar_10_u02_k09.json",
  "./content/soru_havuzlari/tar_10_u03_k10.json",
  "./content/soru_havuzlari/tar_10_u03_k11.json",
  "./content/soru_havuzlari/tar_10_u03_k12.json",
  "./content/soru_havuzlari/tar_10_u03_k13.json",
  "./content/soru_havuzlari/tar_10_u03_k14.json"
];
const APP_URL = self.location.origin + "/";
const ICON_URL = "./icons/icon-192.png";

self.addEventListener("install", (e) => {
  /* v72 — KÖK NEDEN DÜZELTMESİ: `addAll` TEK bir 404'te komple reddeder;
     o zaman yeni service worker kurulamaz, skipWaiting çalışmaz ve kullanıcı
     ESKİ sürümde kalır (silinen havuz dosyaları yüzünden tam olarak bu oldu).
     Artık her dosya AYRI eklenir; eksik olan atlanır, kurulum tamamlanır. */
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.all(ASSETS.map((u) =>
        c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});
/* v53 — KORUNAN önbellek: push izi. Eski hâlde burada CACHE dışındaki HER
   önbellek siliniyordu; "am-push-iz" de silindiği için "cihaza ulaştı mı"
   kanıtı her yayında yok oluyordu. */
const KORUNAN_IZ = "am-push-iz";
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE && k !== KORUNAN_IZ).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
  // v57 — hangi SW sürümünün cihazda gerçekten çalıştığı sunucudan görülsün
  e.waitUntil(teslimAbone().then(() => teslimYaz({ asama: "sw-acildi" })));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  // v51 — Sayfa (HTML) her zaman AĞDAN ve tarayıcı önbelleği ATLANARAK
  // alınır: yayınlanan sürüm bir sonraki açılışta kesin görünür, eski ekran
  // (silinmiş bir satır bile) cihazda takılı kalmaz.
  const istek = e.request.mode === "navigate" ? new Request(e.request, { cache: "no-store" }) : e.request;
  e.respondWith(
    fetch(istek).then((res) => {
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
  // Web Push (bildirim-gonder) gövdesi düz JSON gönderir: {title, body, url, kind}
  const ham = (payload.fcmOptions && payload.fcmOptions.link) || data.url || payload.url || APP_URL;
  let url = APP_URL;
  try { url = new URL(ham, self.location.origin).href; } catch (e) { url = APP_URL; }
  const icon = n.icon || data.icon || ICON_URL;
  const badge = n.badge || data.badge || ICON_URL;
  const tag = data.key || payload.kind || payload.collapse_key || "analiz-merkezi";
  // v43 — KULLANICI: "Bildirim sadece ayarlardan dokununca geliyor."
  // Bildirim artık ekranda KALIR (requireInteraction) ve tek dokunuşluk
  // "Aç" düğmesi taşır; sessizce kaybolup gözden kaçmaz.
  return {
    title,
    options: {
      body, icon, badge, tag, renotify: true, requireInteraction: true,
      vibrate: [180, 90, 180],
      actions: [{ action: "ac", title: "Uygulamayı aç" }],
      data: { url }
    }
  };
}
/* v35.9 — PUSH İZİ (cihaz tarafı kanıt)
   "Sunucu gönderdi (FCM 201) ama telefon göstermedi" ile "cihaza hiç
   ulaşmadı" arasındaki farkı ayırmak için her push'un zamanı yazılır.
   Ayarlar → Bildirim durumu bu izi okur. */
const PUSH_IZ_ADI = "am-push-iz";
const PUSH_IZ_YOLU = "/__am-push-son";

/* v57 — CİHAZ TARAFI ÖLÇÜM (sunucudan okunabilir kanıt)
   -------------------------------------------------------
   Tablo: "FCM 201 kabul etti" ≠ "bildirim cihazda". Aradaki farkı ölçmenin
   tek kesin yolu cihazın KENDİ beyanıdır. Bu yüzden service worker:
     • her kurulumda  asama:"sw-acildi"   → hangi SW sürümü çalışıyor,
     • push gelince   asama:"push"        → push OLAYI cihaza ULAŞTI,
     • gösterim sonrası asama:"gosterim"  → gösterildi mi, hata neydi
   satırlarını doğrudan veritabanına yazar. Böylece "cihaza hiç inmedi" ile
   "indi ama Android göstermedi" ayrımı tahmin değil kayıt olur.
   Yazma/okuma anon anahtarla; tablo yalnız teşhis satırları içerir (gizli veri yok). */
const TESLIM_URL = "https://ztgzmhfklsdlngrtennp.supabase.co/rest/v1/push_teslim";
const TESLIM_ANAHTAR = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Z3ptaGZrbHNkbG5ncnRlbm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMTgzODMsImV4cCI6MjEwODY5NDM4M30.mQ1gt11KldJaPkdU07B51jC6XLYyfwsIaU-qNYkhZzE";
let TESLIM_ABONE = "";
async function teslimYaz(kayit) {
  try {
    const govde = Object.assign({
      sw: CACHE,
      ua: String((self.navigator && self.navigator.userAgent) || "").slice(0, 160),
      abonelik: TESLIM_ABONE
    }, kayit);
    const y = await fetch(TESLIM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: TESLIM_ANAHTAR,
        Authorization: "Bearer " + TESLIM_ANAHTAR,
        Prefer: "return=minimal"
      },
      body: JSON.stringify(govde)
    });
    return y.ok;
  } catch (e) { return false; }
}
/* Bu cihazın abonelik kuyruğu (son 4 karakter) — hangi cihaz olduğu belli olsun */
async function teslimAbone() {
  try {
    const a = await self.registration.pushManager.getSubscription();
    TESLIM_ABONE = a && a.endpoint ? String(a.endpoint).slice(-4) : "";
  } catch (e) { TESLIM_ABONE = ""; }
  return TESLIM_ABONE;
}
async function pushIzYaz(bilgi) {
  try {
    const c = await caches.open(PUSH_IZ_ADI);
    await c.put(PUSH_IZ_YOLU, new Response(JSON.stringify(bilgi), {
      headers: { "Content-Type": "application/json" }
    }));
  } catch (e) { /* iz yazılamazsa bildirim yine gösterilir */ }
}
self.addEventListener("push", (event) => {
  const secim = bildirimSecenekleri(pushPayload(event));
  event.waitUntil((async () => {
    const iz = { zaman: Date.now(), baslik: String(secim.title || "").slice(0, 120) };
    // v57 — ÖNCE "push OLAYI ULAŞTI" satırı (gösterim başarısız olsa da kalır)
    await teslimAbone();
    await teslimYaz({ asama: "push", baslik: String(secim.title || "").slice(0, 120) });
    // ÖNCE iz, SONRA gösterim: gösterim hata verse bile "push ulaştı" kanıtı kalır.
    // v62 — MÜKERRER ENGELLİ: uygulama açılırken aynı hatırlatmayı YEREL
    // gösterdiyse (kaynak:"yerel") ve üzerinden 3 saat geçmediyse, geç gelen
    // push tekrar gösterilmez. Mesaj yine "ulaştı" diye kaydedilir.
    let oncekiIz = null;
    try {
      const c0 = await caches.open(PUSH_IZ_ADI);
      const r0 = await c0.match(PUSH_IZ_YOLU);
      oncekiIz = r0 ? await r0.json() : null;
    } catch (e) { oncekiIz = null; }
    const yerelGosterildi = !!(oncekiIz && oncekiIz.kaynak === "yerel" &&
      oncekiIz.baslik === iz.baslik &&
      (Date.now() - Number(oncekiIz.zaman || 0)) < 3 * 3600 * 1000);
    await pushIzYaz(Object.assign({}, iz, { tekrar: yerelGosterildi }));
    if (yerelGosterildi) {
      await teslimYaz({ asama: "gosterim", baslik: iz.baslik, gosterildi: true, hata: null });
      return;
    }
    try {
      await self.registration.showNotification(secim.title, secim.options);
      iz.gosterildi = true;
    } catch (e) {
      // v53 — KÖK NEDEN SINIFI: bazı tarayıcılar (vibrate/actions/requireInteraction
      // gibi) seçeneklerden birini reddedince showNotification HATA atar ve
      // bildirim HİÇ görünmez; sunucu ise 201 aldığı için sorun görünmezdi.
      // Sade seçeneklerle bir kez daha dene; sonucu ize yaz.
      iz.hata = String(e).slice(0, 160);
      iz.gosterildi = false;
      try {
        await self.registration.showNotification(secim.title, {
          body: secim.options.body,
          tag: secim.options.tag,
          data: secim.options.data
        });
        iz.gosterildi = true;
        iz.sadeSecenek = true;
      } catch (e2) {
        iz.hata2 = String(e2).slice(0, 160);
      }
    }
    if (iz.hata) await pushIzYaz(iz);
    // v57 — gösterim sonucu da sunucuya: "Android gösterdi mi?"
    await teslimYaz({
      asama: "gosterim",
      baslik: iz.baslik,
      gosterildi: !!iz.gosterildi,
      hata: iz.hata2 || iz.hata || null
    });
  })());
});

/* v43 — Tarayıcı aboneliği kendiliğinden yenilerse (endpoint değişirse)
   yeniden abone ol ve sunucuya yaz. Aksi hâlde eski uç nokta ölür ve
   zamanlanmış hatırlatmalar sessizce kaybolur. */
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil((async () => {
    try {
      const secenekler = event.oldSubscription ? event.oldSubscription.options : { userVisibleOnly: true };
      const yeni = await self.registration.pushManager.subscribe(secenekler);
      // Yazma yetkisi (oturum + apikey) service worker'da yok; uygulama her
      // açılışta AmPush.otomatik() ile aboneliği sunucuya kendisi yazar.
      const cs = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const c of cs) { try { c.postMessage({ am: "push-yenilendi", endpoint: (yeni && yeni.endpoint) || "" }); } catch (_) {} }
    } catch (_) { /* yenilenemezse uygulama açılışında tekrar denenir */ }
  })());
});

/* Bildirime tıklayınca uygulamayı aç / öne getir */
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  // v43 — "Aç" düğmesi ya da gövdeye dokunma: ikisi de uygulamayı açar.
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
