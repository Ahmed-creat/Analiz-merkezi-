// ============================================================
// ANALİZ MERKEZİ — BULUT BİLDİRİM MOTORU (Cloud Functions)
// Uygulama KAPALIyken çalışır: Firestore'daki senkronize planına bakıp
// FCM push bildirimi gönderir (uygulamadaki bildirimlerin bulut kopyası).
//
// Çalışma saatleri (Europe/Istanbul): 07:30 tam set · 19:30 akşam kritikleri
// Deploy:  firebase deploy --only functions   (Blaze planı gerekir)
// ============================================================
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const { buildMessages } = require("./bildirim-logic");

admin.initializeApp();
const db = admin.firestore();

async function bildirimleriGonder(sadeceAksam) {
  const users = await db.collection("users").listDocuments();
  let gonderilen = 0, atlanan = 0;
  for (const userRef of users) {
    const uid = userRef.id;
    const [stateSnap, tokenSnap] = await Promise.all([
      userRef.collection("state").doc("main").get(),
      userRef.collection("meta").doc("fcm").get()
    ]);
    if (!stateSnap.exists || !tokenSnap.exists) { atlanan++; continue; }
    const token = tokenSnap.data().token;
    let state;
    try { state = JSON.parse(stateSnap.data().json || "{}"); } catch (e) { atlanan++; continue; }
    if (!token || !state.plan) { atlanan++; continue; }

    const hepsi = buildMessages(state, new Date());
    // Akşam koşusunda yalnız kritikler (sınav arifesi/günü + yarın deneme)
    const kritikAnahtarlar = ["schooleve@", "schooltoday@", "exam@1", ":memcrit"];
    const liste = sadeceAksam
      ? hepsi.filter(m => kritikAnahtarlar.some(k => m.key.includes(k)))
      : hepsi;

    // Tekilleştirme: aynı gün aynı bildirim iki kez gitmesin
    const logRef = userRef.collection("meta").doc("notifLog");
    const logSnap = await logRef.get();
    const log = logSnap.exists ? logSnap.data() || {} : {};
    const bugunPrefix = new Date().toISOString().slice(0, 10);
    const yeni = {};
    Object.keys(log).forEach(k => { if (!k.startsWith(bugunPrefix)) yeni[k.slice(0, 200)] = true; }); // eski günleri temizle

    for (const m of liste) {
      if (log[m.key]) continue;
      try {
        await admin.messaging().send({
          token: token,
          notification: { title: m.title, body: m.body },
          webpush: { notification: { icon: "icons/icon-192.png", badge: "icons/icon-192.png" } },
          android: { priority: "high" }
        });
        gonderilen++;
        yeni[m.key] = true;
      } catch (e) {
        console.warn(uid, "gönderim hatası:", e.message);
        if (String(e.code).includes("unregistered")) {
          await userRef.collection("meta").doc("fcm").delete(); // ölü token temizliği
        }
      }
    }
    await logRef.set(yeni, { merge: false });
  }
  console.log((sadeceAksam ? "Akşam" : "Sabah") + " turu: " + gonderilen + " bildirim, " + atlanan + " pas geçilen kullanıcı.");
  return null;
}

// 07:30 — tam set: Bugünün Planı + sınav arifesi/günü + deneme kilometre taşları
exports.sabahBildirimleri = onSchedule(
  { schedule: "30 7 * * *", timeZone: "Europe/Istanbul" },
  () => bildirimleriGonder(false)
);

// 19:30 — akşam kritikleri: "Yarın sınavın, bu akşam çalış" anı
exports.aksamBildirimleri = onSchedule(
  { schedule: "30 19 * * *", timeZone: "Europe/Istanbul" },
  () => bildirimleriGonder(true)
);
