// ============================================================
// FIREBASE YAPILANDIRMASI — proje: analiz-merkezi-87338
// Eksik olan TEK değer: apiKey (aşağıya yapıştır).
// Firebase Console → ⚙️ Project settings → General → Web API Key
// apiKey dolana kadar giriş/bulut özellikleri kapalı kalır,
// uygulama kendisi tam çalışır (offline-first).
// ============================================================
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD7X9Sqn6HEoVEtjqcjw7FcFMQfrzup_Ng",
  authDomain: "analiz-merkezi-87338.firebaseapp.com",
  projectId: "analiz-merkezi-87338",
  storageBucket: "analiz-merkezi-87338.firebasestorage.app",
  messagingSenderId: "962539397686",
  appId: "1:962539397686:web:b69803732167321778ae97"
};

// Cloud Messaging (bildirimler) için:
// Firebase Console → Cloud Messaging → Web Push sertifikası → ortak anahtar
export const FCM_VAPID_KEY = "BGNEdtJqHQPzC-Lco6a-Kcd0zPdFiQ4nVgU7CWHi4gg4GxXw-ka6lOWHuZWbeEzETpcTh5-fRsIf2yiy8pyPkDQ";
