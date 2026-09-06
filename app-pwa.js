const PWA_SURUM = "v30.1";
// ============================================================
// ANALİZ MERKEZİ — PWA + FIREBASE KATMANI (app-pwa.js, ES module)
// Kimlik doğrulama: E-POSTA/ŞİFRE (kayıt + giriş + şife sıfırlama)
//                  + isteğe bağlı Google ile devam
// Firestore: otomatik bulut yedek + girişte geri yükleme
// Cloud Messaging: bildirimler · Service Worker: offline PWA
// BU DOSYA OLMAKSIZIN DA UYGULAMA TAM ÇALIŞIR (offline-first):
// firebase-config.js boşsa her şey sessizce devre dışı kalır.
// ============================================================
import { FIREBASE_CONFIG, FCM_VAPID_KEY } from "./firebase-config.js";

let fbApp = null, fbAuth = null, fbDb = null, fbMsg = null;
let currentUser = null;
let syncTimer = null;
const SDK = "https://www.gstatic.com/firebasejs/10.12.2";

function fbReady() { return !!(FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId); }
function cfgMissing() {
  toast("Bulut özelliği henüz yapılandırılmadı: analiz-merkezi-pwa/firebase-config.js içindeki apiKey ve diğer alanları doldur (README-PWA.md).", "warning");
}

// Hata kodlarını Türkçeleştir
const AUTH_ERR = {
  "auth/invalid-credential": "E-posta veya şifre hatalı.",
  "auth/wrong-password": "E-posta veya şifre hatalı.",
  "auth/user-not-found": "Bu e-posta ile kayıt yok — önce 'Kayıt Ol'a bas.",
  "auth/email-already-in-use": "Bu e-posta ile zaten kayıt var — 'Giriş Yap'ı dene.",
  "auth/weak-password": "Şifre en az 6 karakter olmalı.",
  "auth/invalid-email": "Geçerli bir e-posta adresi gir (ör. ad@ornek.com).",
  "auth/too-many-requests": "Çok fazla deneme — biraz bekle, sonra dene.",
  "auth/network-request-failed": "İnternet bağlantısı yok — çevrimdışı çalışıyorsun.",
  "auth/operation-not-allowed": "Firebase Console → Authentication → Sign-in method → Email/Password açık değil.",
  "auth/popup-blocked": "Tarayıcı pop-up'ı engelledi — tekrar tıkla.",
  "auth/unauthorized-domain": "Site adresi Firebase → Authentication → Settings → Authorized domains listesinde değil."
};
function authMsg(e) {
  const k = String((e && e.code) || e || "");
  return AUTH_ERR[k] || ("İşlem başarısız: " + (k || e));
}

// ---- 1) SERVICE WORKER (PWA offline + yüklenebilir uygulama) ----
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => console.warn("SW kaydı başarısız (http/yerel dosya olabilir)."));
  });
}

// ---- 2) FIREBASE BAŞLATMA ----
if (fbReady()) {
  try {
    const { initializeApp } = await import(SDK + "/firebase-app.js");
    const { getAuth } = await import(SDK + "/firebase-auth.js");
    const { getFirestore } = await import(SDK + "/firebase-firestore.js");
    fbApp = initializeApp(FIREBASE_CONFIG);
    fbAuth = getAuth(fbApp);
    fbDb = getFirestore(fbApp);
    try {
      const { getMessaging } = await import(SDK + "/firebase-messaging.js");
      fbMsg = getMessaging(fbApp);
    } catch (e) { /* Messaging desteklenmiyorsa sessiz geç */ }
    hookSaveState();
    listenAuth();
  } catch (e) {
    console.warn("Firebase başlatılamadı:", e);
  }
}
if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", initAuthUI);
else initAuthUI();

// ---- 3) GİRİŞ ARAYÜZÜ (yan menü + mobil DAHA + giriş modalı) ----
function initAuthUI() {
  if (document.getElementById("pwa-auth-btn")) return;
  const footer = document.querySelector(".sidebar-footer");
  if (footer) {
    const btn = document.createElement("button");
    btn.id = "pwa-auth-btn";
    btn.className = "btn btn-ghost w-full";
    btn.style.cssText = "justify-content:flex-start;color:#fff;margin-bottom:8px;border:1px solid rgba(255,255,255,0.25);";
    btn.dataset.act = "pwaAuth";
    btn.innerHTML = '<i data-lucide="log-in" style="width:16px;height:16px;"></i> <span id="pwa-auth-label">Giriş Yap (E-posta)</span>';
    footer.before(btn);
  }
  const more = document.getElementById("more-sheet");
  if (more) {
    const mbtn = document.createElement("button");
    mbtn.className = "ms-item";
    mbtn.style.gridColumn = "1 / -1";
    mbtn.dataset.act = "pwaAuth";
    mbtn.innerHTML = '<i data-lucide="log-in" style="width:18px;height:18px;color:var(--text-muted);"></i> <span>Giriş Yap / Bulut Yedek</span>';
    more.appendChild(mbtn);
  }
  buildAuthModal();
  // Bildirim izni ayarlardan SONRADAN verilirse FCM token'ı o an kaydet
  const orijinalIzin = window.requestNotifPermission;
  if (typeof orijinalIzin === "function" && !window.__izinHooked) {
    window.__izinHooked = true;
    window.requestNotifPermission = async function (...args) {
      const sonuc = await orijinalIzin.apply(this, args);
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        setTimeout(registerFCM, 800);
      }
      return sonuc;
    };
  }
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const a = el.dataset.act;
    if (a === "pwaAuth") { currentUser ? doSignOut() : openAuthModal(); }
    else if (a === "pwaAuthClose") closeAuthModal();
    else if (a === "pwaAuthLogin") emailLogin();
    else if (a === "pwaAuthRegister") emailRegister();
    else if (a === "pwaAuthReset") resetPassword();
    else if (a === "pwaAuthGoogle") googleLogin();
  });
  if (window.lucide && lucide.createIcons) lucide.createIcons();
}

function buildAuthModal() {
  if (document.getElementById("pwa-auth-modal")) return;
  const m = document.createElement("div");
  m.id = "pwa-auth-modal";
  m.style.cssText = "position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;background:rgba(10,16,32,0.6);padding:16px;";
  m.innerHTML = `
    <div style="width:100%;max-width:380px;background:var(--bg-elev,#fff);color:var(--text,#16213A);border-radius:18px;padding:22px;box-shadow:0 24px 60px rgba(0,0,0,0.35);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <div style="font-weight:800;font-size:18px;">Bulut Hesabı</div>
        <button data-act="pwaAuthClose" style="background:none;border:0;cursor:pointer;font-size:20px;line-height:1;color:inherit;">✕</button>
      </div>
      <div style="font-size:12.5px;opacity:0.75;margin-bottom:14px;">Giriş yapınca verilerin hesabına otomatik yedeklenir; başka cihazdan devam edebilirsin.</div>
      <input id="pwa-email" type="email" inputmode="email" autocomplete="email" placeholder="E-posta (ör. ad@gmail.com)"
        style="width:100%;box-sizing:border-box;padding:11px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.18);background:var(--bg,#F6F8FC);color:inherit;font-size:14px;margin-bottom:10px;">
      <input id="pwa-pass" type="password" autocomplete="current-password" placeholder="Şifre (en az 6 karakter)"
        style="width:100%;box-sizing:border-box;padding:11px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.18);background:var(--bg,#F6F8FC);color:inherit;font-size:14px;margin-bottom:12px;">
      <button data-act="pwaAuthLogin" class="btn btn-primary w-full" style="margin-bottom:8px;font-weight:700;">Giriş Yap</button>
      <button data-act="pwaAuthRegister" class="btn btn-ghost w-full" style="margin-bottom:6px;border:1px solid rgba(0,0,0,0.15);">Yeni Kayıt Oluştur</button>
      <button data-act="pwaAuthReset" style="background:none;border:0;cursor:pointer;font-size:12.5px;opacity:0.8;color:inherit;text-decoration:underline;">Şifremi unuttum</button>
      <div style="display:flex;align-items:center;gap:10px;margin:14px 0;opacity:0.4;font-size:12px;"><div style="flex:1;height:1px;background:currentColor;"></div>veya<div style="flex:1;height:1px;background:currentColor;"></div></div>
      <button data-act="pwaAuthGoogle" class="btn btn-ghost w-full" style="border:1px solid rgba(0,0,0,0.15);font-weight:600;">
        <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>
        Google ile devam et
      </button>
      <div id="pwa-auth-msg" style="font-size:12.5px;margin-top:10px;min-height:16px;"></div>
    </div>`;
  m.addEventListener("click", (e) => { if (e.target === m) closeAuthModal(); });
  document.body.appendChild(m);
}
function openAuthModal() {
  const m = document.getElementById("pwa-auth-modal");
  if (!m) return;
  if (!fbReady()) { cfgMissing(); return; }
  const msg = document.getElementById("pwa-auth-msg");
  if (msg) msg.textContent = "";
  m.style.display = "flex";
  setTimeout(() => { const em = document.getElementById("pwa-email"); if (em) em.focus(); }, 60);
}
function closeAuthModal() { const m = document.getElementById("pwa-auth-modal"); if (m) m.style.display = "none"; }
function authMsgYaz(t, hata) { const el = document.getElementById("pwa-auth-msg"); if (el) { el.textContent = t; el.style.color = hata ? "#E11D48" : "#16A34A"; } }

// ---- 4) E-POSTA/ŞİFRE İŞLEMLERİ ----
async function emailLogin() {
  if (!fbAuth) return cfgMissing();
  const email = (document.getElementById("pwa-email") || {}).value || "";
  const pass = (document.getElementById("pwa-pass") || {}).value || "";
  if (!email || !pass) return authMsgYaz("E-posta ve şifreyi doldur.", true);
  authMsgYaz("Giriş yapılıyor…", false);
  try {
    const { signInWithEmailAndPassword } = await import(SDK + "/firebase-auth.js");
    await signInWithEmailAndPassword(fbAuth, email.trim(), pass);
    closeAuthModal();
    toast("Giriş başarılı 🎉", "success");
  } catch (e) { authMsgYaz(authMsg(e), true); }
}
async function emailRegister() {
  if (!fbAuth) return cfgMissing();
  const email = (document.getElementById("pwa-email") || {}).value || "";
  const pass = (document.getElementById("pwa-pass") || {}).value || "";
  if (!email || !pass) return authMsgYaz("E-posta ve şifreyi doldur.", true);
  if (pass.length < 6) return authMsgYaz("Şifre en az 6 karakter olmalı.", true);
  authMsgYaz("Kayıt oluşturuluyor…", false);
  try {
    const { createUserWithEmailAndPassword } = await import(SDK + "/firebase-auth.js");
    await createUserWithEmailAndPassword(fbAuth, email.trim(), pass);
    closeAuthModal();
    toast("Kayıt oluşturuldu — verilerin artık buluta yedekleniyor ☁️", "success");
  } catch (e) { authMsgYaz(authMsg(e), true); }
}
async function resetPassword() {
  if (!fbAuth) return cfgMissing();
  const email = (document.getElementById("pwa-email") || {}).value || "";
  if (!email) return authMsgYaz("Önce e-postanı yaz, sonra 'Şifremi unuttum'a bas.", true);
  try {
    const { sendPasswordResetEmail } = await import(SDK + "/firebase-auth.js");
    await sendPasswordResetEmail(fbAuth, email.trim());
    authMsgYaz("Şifre sıfırlama bağlantısı e-postana gönderildi 📬", false);
  } catch (e) { authMsgYaz(authMsg(e), true); }
}
async function googleLogin() {
  if (!fbAuth) return cfgMissing();
  try {
    const { GoogleAuthProvider, signInWithPopup } = await import(SDK + "/firebase-auth.js");
    await signInWithPopup(fbAuth, new GoogleAuthProvider());
    closeAuthModal();
    toast("Google ile giriş başarılı 🎉", "success");
  } catch (e) { authMsgYaz(authMsg(e), true); }
}
async function doSignOut() {
  try {
    const { signOut } = await import(SDK + "/firebase-auth.js");
    await signOut(fbAuth);
    toast("Çıkış yapıldı — verilerin bu cihazda durmaya devam ediyor.", "success");
  } catch (e) { toast(authMsg(e), "error"); }
}

function setAuthLabel(girisli, kim) {
  const lbl = document.getElementById("pwa-auth-label");
  if (lbl) lbl.textContent = girisli ? "Çıkış (" + (kim || "hesap") + ")" : "Giriş Yap (E-posta)";
}

// ---- 5) OTURUM TAKİBİ + BULUTTAN GERİ YÜKLEME ----
function listenAuth() {
  import(SDK + "/firebase-auth.js").then(({ onAuthStateChanged }) => {
    onAuthStateChanged(fbAuth, async (user) => {
      currentUser = user || null;
      const kim = user ? ((user.email || "").split("@")[0] || "hesap") : null;
      setAuthLabel(!!user, kim);
      if (!user || typeof state === "undefined") return; // state: global let — window üzerinde DEĞİL
      if (!state.user.name && (user.displayName || kim)) {
        state.user.name = user.displayName || kim;
        try { saveState(); } catch (e) {}
        if (typeof updateUserUI === "function") updateUserUI();
      }
      try {
        const { doc, getDoc } = await import(SDK + "/firebase-firestore.js");
        const snap = await getDoc(doc(fbDb, "users", user.uid, "state", "main"));
        if (snap.exists()) {
          const uzak = snap.data();
          const uzakState = uzak && uzak.json ? JSON.parse(uzak.json) : null;
          const yerelBos = !state.exams.length && !state.questions.length && !Object.keys(state.topics).length;
          if (uzakState && !yerelBos) {
            const nEx = (uzakState.exams || []).length;
            const nQ = (uzakState.questions || []).length;
            openConfirm(
              "Bulutta " + new Date(uzak.updatedAt || Date.now()).toLocaleDateString("tr-TR") +
              " tarihli bir kayıt var (" + nEx + " deneme, " + nQ + " soru çözümü). Buluttaki kayıt YERELDEKİ VERİLERİN ÜZERİNE yazılsın mı?",
              () => {
                state = mergeDeep(freshState(), uzakState);
                state.user.grade = state.user.grade || "9";
                saveState();
                navigate(currentPage);
                if (typeof updateUserUI === "function") updateUserUI();
                toast("Bulut kaydı yüklendi (" + nEx + " deneme).", "success");
              }
            );
          } else if (uzakState && yerelBos) {
            state = mergeDeep(freshState(), uzakState);
            saveState();
            navigate(currentPage);
            if (typeof updateUserUI === "function") updateUserUI();
            toast("Bulut kaydın geri yüklendi (" + (uzakState.exams || []).length + " deneme).", "success");
          }
        }
      } catch (e) { console.warn("Bulut kaydı okunamadı:", e); }
      registerFCM();
    });
  });
}

// ---- 6) saveState KANCASI: her kayıtta buluta debounced yaz ----
function hookSaveState() {
  if (window.__saveHooked) return;
  window.__saveHooked = true;
  const orijinal = window.saveState;
  if (typeof orijinal !== "function") return;
  async function senkronizeEt() {
    try {
      const { doc, setDoc } = await import(SDK + "/firebase-firestore.js");
      await setDoc(doc(fbDb, "users", currentUser.uid, "state", "main"), {
        json: JSON.stringify(state),
        updatedAt: Date.now(),
        grade: state.user.grade,
        denemeSayisi: (state.exams || []).length
      });
      setAuthLabel(true, (currentUser.email || "").split("@")[0]);
      const rozet = document.getElementById("pwa-auth-label");
      if (rozet) rozet.textContent += " · ✓ bulutta";
    } catch (e) { console.warn("Bulut senkronu başarısız (çevrimdışı?):", e); }
  }
  window.saveState = function () {
    const sonuc = orijinal.apply(this, arguments);
    if (currentUser && fbDb) {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(senkronizeEt, 4000);
    }
    return sonuc;
  };
  // İnternet geri gelince bekleyen senkronu otomatik yeniden dene
  window.addEventListener("online", () => {
    if (currentUser && fbDb) {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(senkronizeEt, 2500);
    }
  });
}

// ---- 7) CLOUD MESSAGING (uygulama açıkken bildirim) ----
async function registerFCM() {
  if (!fbMsg || !FCM_VAPID_KEY || !currentUser) return;
  try {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    const { getToken, onMessage } = await import(SDK + "/firebase-messaging.js");
    const token = await getToken(fbMsg, { vapidKey: FCM_VAPID_KEY, serviceWorkerRegistration: await navigator.serviceWorker.ready });
    if (token) {
      const { doc, setDoc } = await import(SDK + "/firebase-firestore.js");
      await setDoc(doc(fbDb, "users", currentUser.uid, "meta", "fcm"), { token: token, updatedAt: Date.now() });
    }
    onMessage(fbMsg, (payload) => {
      const t = (payload.notification && payload.notification.title) || "Analiz Merkezi";
      const b = (payload.notification && payload.notification.body) || "";
      if (typeof addNotification === "function") {
        addNotification({ title: t, body: b, kind: "info", topicKey: "fcm@" + Date.now() });
      }
      toast(t + " — " + b, "info");
    });
  } catch (e) { console.warn("FCM kaydı başarısız:", e); }
}

// ---- 8) OKULIZYON ENTEGRASYONU (çek → Analiz Bekliyor → neden seç → kaydet) ----
const OKZ_NEDENLER = ["Konuyu Bilmiyordum", "KONU EKSİKLİĞİ", "ANLAMADIM", "İşlem Hatası/Dikkatsizlik", "Kodlama/Kitapçık Hatası", "SÜRE YETMEDİ", "ÇÖZÜM YOLUNU BULAMADIM"];
function okzStore() {
  if (!state.okulizyon) state.okulizyon = { pending: [], importedKeys: [], pulledAt: 0, duyurular: null };
  return state.okulizyon;
}
function okzKey(ex) { return (ex.name || "?") + "|" + (ex.date || ""); }

function initOkulizyonUI() {
  if (document.getElementById("pwa-okz-btn")) return;
  const footer = document.querySelector(".sidebar-footer");
  if (footer) {
    const btn = document.createElement("button");
    btn.id = "pwa-okz-btn";
    btn.className = "btn btn-ghost w-full";
    btn.style.cssText = "justify-content:flex-start;color:#fff;margin-bottom:8px;border:1px solid rgba(255,255,255,0.25);";
    btn.dataset.act = "pwaOkz";
    btn.innerHTML = '<i data-lucide="graduation-cap" style="width:16px;height:16px;"></i> <span id="pwa-okz-label">Okulizyon Bağlantısı</span>';
    const authBtn = document.getElementById("pwa-auth-btn");
    if (authBtn) authBtn.after(btn); else footer.before(btn);
  }
  const more = document.getElementById("more-sheet");
  if (more) {
    const mb = document.createElement("button");
    mb.className = "ms-item";
    mb.style.gridColumn = "1 / -1";
    mb.dataset.act = "pwaOkz";
    mb.innerHTML = '<i data-lucide="graduation-cap" style="width:18px;height:18px;color:var(--text-muted);"></i> <span>Okulizyon · Analiz Bekliyor</span>';
    more.appendChild(mb);
  }
  buildOkzModal();
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const a = el.dataset.act;
    if (a === "pwaOkz") openOkzModal();
    else if (a === "okzClose") closeOkzModal();
    else if (a === "okzSaveBilgi") okzSaveBilgi();
    else if (a === "okzAnalizKaydet") okzAnalizKaydet();
    else if (a === "okzHepsi") okzHepsiUygula(el.dataset.reason);
  });
  okzBadge();
  if (window.lucide && lucide.createIcons) lucide.createIcons();
}
function okzBadge() {
  const n = okzStore().pending.reduce((a, ex) => a + (ex.rows || []).length, 0);
  const l = document.getElementById("pwa-okz-label");
  if (l) l.textContent = n > 0 ? "Okulizyon · " + n + " konu Analiz Bekliyor!" : "Okulizyon Bağlantısı";
}
function buildOkzModal() {
  if (document.getElementById("pwa-okz-modal")) return;
  const m = document.createElement("div");
  m.id = "pwa-okz-modal";
  m.style.cssText = "position:fixed;inset:0;z-index:9998;display:none;align-items:center;justify-content:center;background:rgba(10,16,32,0.6);padding:14px;";
  m.addEventListener("click", (e) => { if (e.target === m) closeOkzModal(); });
  document.body.appendChild(m);
}
function openOkzModal() { renderOkzModal(); const m = document.getElementById("pwa-okz-modal"); if (m) m.style.display = "flex"; }
function closeOkzModal() { const m = document.getElementById("pwa-okz-modal"); if (m) m.style.display = "none"; }
function escHtml(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function renderOkzModal() {
  const m = document.getElementById("pwa-okz-modal");
  const s = state.settings && state.settings.okulizyon ? state.settings.okulizyon : {};
  const st = okzStore();
  let html = '<div style="width:100%;max-width:520px;max-height:86vh;overflow:auto;background:var(--bg-elev,#fff);color:var(--text,#16213A);border-radius:18px;padding:20px;box-shadow:0 24px 60px rgba(0,0,0,0.35);">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><div style="font-weight:800;font-size:17px;">🎓 Okulizyon <span style="font-size:10px;font-weight:400;opacity:0.5;">' + PWA_SURUM + '</span></div><button data-act="okzClose" style="background:none;border:0;font-size:19px;cursor:pointer;color:inherit;">✕</button></div>';
  // A) Bağlantı bilgileri
  html += '<div style="font-size:12px;opacity:0.75;margin-bottom:8px;">Sınav sonuçların her sabah otomatik çekilir; yanlış/boş sorular aşağıda <b>Analiz Bekliyor</b> listesine düşer.</div>';
  // OKULIZYON SİTESİ GİRİŞ EKRANININ KOPYASI: AD SOYAD (büyük harf) → OKUL NO → SINIF → İL → İLÇE → OKUL (seçmeli)
  const ILCELER = ["Şahinbey", "Şehitkamil", "Oğuzeli", "Nizip", "İslahiye", "Nurdağı", "Araban", "Yavuzeli", "Karkamış"];
  const inp = (k, label, ph) => '<label style="font-size:11.5px;opacity:0.8;">' + label + '<input id="okz-' + k + '" value="' + escHtml(s[k] || "") + '" placeholder="' + ph + '" autocapitalize="characters" style="width:100%;box-sizing:border-box;padding:9px 10px;border-radius:9px;border:1px solid rgba(0,0,0,0.18);background:var(--bg,#F6F8FC);color:inherit;font-size:13.5px;margin-top:3px;' + (k === "ad" ? "text-transform:uppercase;font-weight:600;letter-spacing:0.02em;" : "") + '"></label>';
  const sel = (k, label, opts) => '<label style="font-size:11.5px;opacity:0.8;">' + label + '<select id="okz-' + k + '" style="width:100%;box-sizing:border-box;padding:9px 10px;border-radius:9px;border:1px solid rgba(0,0,0,0.18);background:var(--bg,#F6F8FC);color:inherit;font-size:13.5px;margin-top:3px;">' + opts.map(o => '<option' + ((s[k] || opts[0]) === o ? " selected" : "") + '>' + escHtml(o) + "</option>").join("") + "</select></label>";
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">';
  html += inp("ad", "AD SOYAD (BÜYÜK HARF)", "AHMET YILMAZ");
  html += inp("okulNo", "OKUL NO", "1234");
  html += sel("sinif", "SINIF", ["9", "10", "11", "12"]);
  html += sel("il", "İL", ["Gaziantep"]);
  html += sel("ilce", "İLÇE", ILCELER);
  html += sel("okulAdi", "OKUL", ["Akken Anadolu Lisesi"]);
  html += "</div>";
  html += '<button data-act="okzSaveBilgi" class="btn btn-primary w-full" style="font-weight:700;margin-bottom:14px;">Bilgileri Kaydet</button>';
  // B) ANALİZ BEKLİYOR
  const bekleyen = st.pending.filter(ex => (ex.rows || []).length);
  if (bekleyen.length) {
    html += '<div style="font-weight:800;font-size:14.5px;margin-bottom:6px;">⏳ Analiz Bekliyor (' + bekleyen.reduce((a, ex) => a + ex.rows.length, 0) + ' soru)</div>';
    html += '<div style="font-size:11.5px;opacity:0.75;margin-bottom:8px;">Her soru için nedenini seç — kaydedince deneme olarak işlenir, öncelik listesine girer.</div>';
    bekleyen.forEach((ex, i) => {
      html += '<div style="border:1px solid rgba(0,0,0,0.12);border-radius:12px;padding:10px;margin-bottom:10px;">';
      html += '<div style="font-weight:700;font-size:13.5px;margin-bottom:6px;">' + escHtml(ex.name) + (ex.date ? ' <span style="opacity:0.6;font-weight:400;">· ' + escHtml(ex.date) + "</span>" : "") + "</div>";
      html += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">' + OKZ_NEDENLER.slice(0, 3).map(r => '<button data-act="okzHepsi" data-reason="' + escHtml(r) + '" style="font-size:10.5px;padding:4px 8px;border-radius:99px;border:1px solid rgba(0,0,0,0.15);background:none;cursor:pointer;color:inherit;">tümü: ' + r + "</button>").join("") + "</div>";
      ex.rows.forEach((row, j) => {
        html += '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px solid rgba(0,0,0,0.07);">';
        html += '<span style="min-width:26px;font-size:11px;opacity:0.6;">#' + (row.qno || j + 1) + "</span>";
        html += '<div style="flex:1;min-width:0;"><div style="font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escHtml(row.topic) + '</div><div style="font-size:10.5px;opacity:0.6;">' + escHtml(row.lesson) + " · " + (row.status === "e" ? "BOŞ" : "YANLIŞ") + "</div></div>";
        html += '<select class="okz-reason" data-i="' + i + '" data-j="' + j + '" style="max-width:42%;padding:6px;border-radius:8px;border:1px solid rgba(0,0,0,0.2);background:var(--bg,#F6F8FC);color:inherit;font-size:11.5px;"><option value="">Atla</option>' + OKZ_NEDENLER.map(r => '<option value="' + escHtml(r) + '">' + r + "</option>").join("") + "</select>";
        html += "</div>";
      });
      html += "</div>";
    });
    html += '<button data-act="okzAnalizKaydet" class="btn btn-primary w-full" style="font-weight:700;">Seçilenleri Deneme Olarak Kaydet</button>';
  } else {
    html += '<div style="border:1px dashed rgba(0,0,0,0.2);border-radius:12px;padding:16px;text-align:center;font-size:13px;opacity:0.75;">Analiz bekleyen soru yok. Sınav sonuçların her sabah 07:00 otomatik çekilir.</div>';
  }
  // C) Okul duyuruları
  if (st.duyurular && st.duyurular.length) {
    html += '<div style="font-weight:800;font-size:14.5px;margin:14px 0 6px;">🏫 Okul Duyuruları</div>';
    st.duyurular.slice(0, 6).forEach(d => {
      html += '<a href="' + escHtml(d.url) + '" target="_blank" rel="noopener" style="display:block;font-size:12.5px;padding:7px 0;border-top:1px solid rgba(0,0,0,0.07);text-decoration:none;color:inherit;">' + (d.tarih ? "<b>[" + escHtml(d.tarih) + "]</b> " : "") + escHtml(d.baslik) + (d.lesson ? ' <span style="color:#16A34A;font-weight:700;">📅 takvime eklendi</span>' : "") + "</a>";
    });
  }
  html += "</div>";
  m.innerHTML = html;
}
function okzSaveBilgi() {
  const al = k => { const el = document.getElementById("okz-" + k); return el ? (el.value || "").trim() : ""; };
  const ad = al("ad").toLocaleUpperCase("tr-TR"); // sitedeki gibi BÜYÜK HARF
  if (!ad || !al("okulNo")) { toast("AD SOYAD ve OKUL NO gerekli (adı büyük harf yaz).", "error"); return; }
  state.settings.okulizyon = {
    ad: ad, okulNo: al("okulNo"),
    sinif: al("sinif") || "9", il: al("il") || "Gaziantep",
    ilce: al("ilce") || "Şahinbey", okulAdi: al("okulAdi") || "Akken Anadolu Lisesi"
  };
  saveState();
  toast("Kaydedildi — çekim her sabah 07:30'da otomatik (" + ad + " · " + state.settings.okulizyon.okulAdi + ")", "success");
}
function okzHepsiUygula(reason) {
  document.querySelectorAll(".okz-reason").forEach(sel => { sel.value = reason; });
}
async function okzKuyrukCek() {
  if (!currentUser || !fbDb) return;
  try {
    const { doc, getDoc } = await import(SDK + "/firebase-firestore.js");
    const snap = await getDoc(doc(fbDb, "users", currentUser.uid, "okulizyon", "queue"));
    if (snap.exists()) {
      const q = snap.data();
      const st = okzStore();
      if ((q.pulledAt || 0) > (st.pulledAt || 0)) {
        st.pulledAt = q.pulledAt;
        const yeni = (q.exams || []).filter(ex => !st.importedKeys.includes(okzKey(ex)));
        st.pending = yeni;
        const n = yeni.reduce((a, ex) => a + (ex.rows || []).length, 0);
        saveState();
        if (n > 0) {
          addNotification({ title: "Okulizyon: " + n + " soru Analiz Bekliyor", body: yeni.map(e => e.name).join(", ").slice(0, 140), kind: "info", topicKey: "okz@" + q.pulledAt });
          okzBadge();
          openConfirm("Okulizyon'dan " + n + " soru geldi (Analiz Bekliyor). Şimdi nedenlerini seçmek ister misin?", openOkzModal);
        }
      }
    }
    const dSnap = await getDoc(doc(fbDb, "users", currentUser.uid, "okul", "duyurular"));
    if (dSnap.exists() && dSnap.data().duyurular) {
      okzStore().duyurular = dSnap.data().duyurular;
      okzDuyurularToSchoolExams(dSnap.data().duyurular);
      saveState();
    }
  } catch (e) { console.warn("Okulizyon kuyruk okunamadı:", e); }
}
// Okul sitesinden gelen SINAV duyuruları → takvime otomatik okul sınavı
function okzDuyurularToSchoolExams(duyurular) {
  let eklenen = 0;
  (duyurular || []).forEach(d => {
    if (!d.lesson || !d.tarih) return; // yalnız ders+bilinen tarihli sınav duyuruları
    const st = okzStore();
    const key = "okulsitesi@" + d.lesson + "@" + d.tarih;
    if (st.importedKeys.includes(key)) return;
    if ((state.plan.schoolExams || []).some(se => se.auto && se.lesson === d.lesson && se.date === d.tarih)) { st.importedKeys.push(key); return; }
    const kalan = typeof parseDay === "function" && typeof todayStr === "function"
      ? Math.round((parseDay(d.tarih) - parseDay(todayStr())) / 86400000) : 7;
    state.plan.schoolExams = state.plan.schoolExams || [];
    state.plan.schoolExams.push({
      id: (typeof uid === "function" ? uid() : "ok" + Date.now() + Math.random().toString(36).slice(2, 6)),
      lesson: d.lesson, date: d.tarih, time: "", topics: [], auto: true,
      prepDays: typeof schoolPrepDaysFor === "function" ? schoolPrepDaysFor(Math.max(1, kalan)) : [3, 1]
    });
    st.importedKeys.push(key);
    eklenen++;
    if (typeof addNotification === "function") {
      addNotification({ title: "Takvime eklendi: " + d.lesson + " sınavı", body: parseDay(d.tarih).toLocaleDateString("tr-TR") + " — okul sitesinden alındı; hazırlık günleri sınava kalan süreye göre işlendi. Konularını Planlama'dan seçebilirsin.", kind: "exam", topicKey: key });
    }
  });
  if (eklenen && typeof toast === "function") toast("Okul sitesinden " + eklenen + " sınav tarihi takvime eklendi (hazırlık günleri oranla hesaplandı).", "success");
  return eklenen;
}
window.okzDuyurularToSchoolExams = okzDuyurularToSchoolExams;
function okzAnalizKaydet() {
  const st = okzStore();
  const secimler = {};
  document.querySelectorAll(".okz-reason").forEach(sel => { secimler[sel.dataset.i + ":" + sel.dataset.j] = sel.value; });
  let eklenen = 0, islenen = 0;
  st.pending.forEach((ex, i) => {
    const logs = [];
    (ex.rows || []).forEach((row, j) => {
      const r = secimler[i + ":" + j];
      if (r) logs.push({ qno: row.qno || j + 1, lesson: row.lesson, topic: row.topic, type: r, date: ex.date || todayStr() });
    });
    if (!logs.length) return;
    const lessons = ex.lessons && Object.keys(ex.lessons).length ? ex.lessons : {};
    let d = 0, w = 0;
    Object.values(lessons).forEach(v => { d += Number(v.d) || 0; w += Number(v.w) || 0; });
    const total = logs.length + d + w; // en azından log sayısı
    const net = typeof netOf === "function" ? Math.round(netOf(d, w) * 100) / 100 : Math.round((d - w / 4) * 100) / 100;
    state.exams.push({
      id: (typeof uid === "function" ? uid() : "okz" + Date.now() + Math.random().toString(36).slice(2, 7)),
      name: "Okulizyon: " + (ex.name || "Sınav"),
      date: ex.date || todayStr(),
      lessons: lessons,
      errorLogs: logs,
      total: Object.keys(lessons).length ? d + w + Object.values(lessons).reduce((a, v) => a + (Number(v.e) || 0), 0) : total,
      net: net
    });
    eklenen += logs.length; islenen++;
    st.importedKeys.push(okzKey(ex));
  });
  st.pending = st.pending.filter(ex => st.importedKeys.includes(okzKey(ex)) ? false : true);
  saveState();
  okzBadge();
  closeOkzModal();
  navigate(currentPage);
  if (typeof renderExamChart === "function") renderExamChart();
  if (window.lucide && lucide.createIcons) lucide.createIcons();
  toast(islenen ? "✓ " + islenen + " sınav işlendi (" + eklenen + " hata kaydı) — Konu Takibi ve öncelik listesi güncellendi!" : "Önce en az bir soru için neden seç.", islenen ? "success" : "error");
}
// Okulizyon UI'ı hazır olsun + kuyruğu çek (girişte + internet gelince)
if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", initOkulizyonUI);
else initOkulizyonUI();
window.addEventListener("online", () => setTimeout(okzKuyrukCek, 3000));
