// ============================================================
// ANALİZ MERKEZİ — BULUT BİLDİRİM GÖNDERİCİ (GitHub Actions çalıştırır)
// Cloud Functions/Blaze GEREKMEZ: bu betik GitHub Actions'ın ücretsiz
// sunucusunda çalışır, Firestore'u okur, FCM push gönderir.
// Mantık functions/bildirim-logic.js ile uygulamayla birebir aynı.
//
// Çalıştırma:  FIREBASE_SERVICE_ACCOUNT="<serviceAccount.json içeriği>" node bildirim-gonder.js
// Seçenekler:  SAAT=sabah|aksam (yoksa İstanbul saatine göre otomatik) · DRY_RUN=1 (göndermez, yazdırır)
// ============================================================
const { buildMessages } = require("./bildirim-logic");

const DRY = process.env.DRY_RUN === "1";
const KRITIK_ANAHTARLAR = ["schooleve@", "schooltoday@", "exam@1", ":memcrit"];

function istanbulSaat() {
  return Number(new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", hour: "numeric", hour12: false }));
}
function turkiyeBugun() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" }); // YYYY-MM-DD
}

async function main() {
  const cred = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!cred) {
    console.error("HATA: FIREBASE_SERVICE_ACCOUNT ortam değişkeni yok.");
    console.error("GitHub → Repo → Settings → Secrets and variables → Actions → New repository secret");
    console.error("Ad: FIREBASE_SERVICE_ACCOUNT · Değer: serviceAccountKey.json dosyasının TAM içeriği");
    process.exit(1);
  }
  let credential;
  try { credential = JSON.parse(cred); }
  catch (e) { console.error("HATA: FIREBASE_SERVICE_ACCOUNT geçerli JSON değil."); process.exit(1); }

  // firebase-admin yalnızca gerçek koşuda yüklenir (DRY/uyarı yolu bağımlılıksız çalışır)
  const admin = require("firebase-admin");
  admin.initializeApp({ credential: admin.credential.cert(credential) });
  const db = admin.firestore();

  const saat = process.env.SAAT || (istanbulSaat() >= 17 || istanbulSaat() < 5 ? "aksam" : "sabah");
  const sadeceAksam = saat === "aksam";
  console.log("=== Analiz Merkezi bildirim turu (" + saat + (DRY ? ", KURU ÇALIŞTIRMA" : "") + ") — İstanbul " + turkiyeBugun() + " " + istanbulSaat() + ":00 ===");

  // Firestore saati Türkiye gününe göre değerlendirilsin (buildMessages simdi=İstanbul bugünü)
  const simdi = new Date(turkiyeBugun() + "T" + String(istanbulSaat()).padStart(2, "0") + ":45:00");

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

    const hepsi = buildMessages(state, simdi);
    const liste = sadeceAksam ? hepsi.filter(m => KRITIK_ANAHTARLAR.some(k => m.key.includes(k))) : hepsi;

    const logRef = userRef.collection("meta").doc("notifLog");
    const logSnap = await logRef.get();
    const log = logSnap.exists ? logSnap.data() || {} : {};
    const bugunPrefix = turkiyeBugun();
    const yeni = {};
    Object.keys(log).forEach(k => { if (!k.startsWith(bugunPrefix) && yeni.size < 500) yeni[k.slice(0, 200)] = true; });

    for (const m of liste) {
      if (log[m.key]) continue;
      if (DRY) {
        console.log("  [KURU] " + uid.slice(0, 6) + "… → " + m.title + " | " + m.body.slice(0, 80));
        yeni[m.key] = true; gonderilen++;
        continue;
      }
      try {
        await admin.messaging().send({
          token: token,
          notification: { title: m.title, body: m.body },
          webpush: { notification: { icon: "icons/icon-192.png", badge: "icons/icon-192.png" } },
          android: { priority: "high" }
        });
        console.log("  ✓ " + uid.slice(0, 6) + "… ← " + m.title);
        gonderilen++;
        yeni[m.key] = true;
      } catch (e) {
        console.warn("  ✗ " + uid.slice(0, 6) + "… " + m.title + ": " + e.message);
        if (String(e.code).includes("unregistered")) await userRef.collection("meta").doc("fcm").delete();
      }
    }
    if (!DRY) await logRef.set(yeni, { merge: false });
  }
  console.log("=== BİTTİ: " + gonderilen + " bildirim, " + atlanan + " pas geçilen kullanıcı ===");
  process.exit(0);
}

main().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
