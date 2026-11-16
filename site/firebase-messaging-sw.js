/* Firebase Cloud Messaging — arka plan bildirim service worker'ı
   (uygulama kapalıyken push). {"apiKey": "", "authDomain": "", "projectId": "", "storageBucket": "", "messagingSenderId": "", "appId": ""} derlemede gerçek değerle değişir. */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

const CFG = {"apiKey": "AIzaSyD7X9Sqn6HEoVEtjqcjw7FcFMQfrzup_Ng", "authDomain": "analiz-merkezi-87338.firebaseapp.com", "projectId": "analiz-merkezi-87338", "storageBucket": "analiz-merkezi-87338.firebasestorage.app", "messagingSenderId": "962539397686", "appId": "1:962539397686:web:b69803732167321778ae97"};
if (CFG && CFG.apiKey) {
  firebase.initializeApp(CFG);
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    const t = (payload.notification && payload.notification.title) || "Analiz Merkezi";
    const b = (payload.notification && payload.notification.body) || "";
    self.registration.showNotification(t, { body: b, icon: "./icons/icon-192.png" });
  });
}

/* Bildirime tıklayınca uygulamayı aç / öne getir */
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
      for (const c of cs) { if ("focus" in c) return c.focus(); }
      return self.clients.openWindow("./");
    })
  );
});
