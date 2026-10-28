const PWA_SURUM = "v34.3-profil";
// ============================================================
// ANALİZ MERKEZİ — PWA + SUPABASE KATMANI (app-pwa.js, ES module)
// Kimlik doğrulama : Supabase Auth (e-posta/şifre + Google OAuth)
// Bulut yedek      : Supabase Postgres — public.app_states (RLS korumalı)
// Bildirim         : FCM (opsiyonel; token public.fcm_tokens tablosuna yazılır)
// Service Worker   : offline PWA
// Supabase erişilemezse uygulama tamamen çevrimdışı çalışmaya devam eder.
// ============================================================
import { SUPABASE_CONFIG } from "./supabase-config.js";
import { FIREBASE_CONFIG, FCM_VAPID_KEY } from "./firebase-config.js";

let sb = null;              // Supabase istemcisi
let fbApp = null, fbMsg = null;
let currentUser = null;     // Supabase kullanıcısı
let syncTimer = null;
const SDK = "https://www.gstatic.com/firebasejs/10.12.2";

function cloudReady() {
  return !!(SUPABASE_CONFIG && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey &&
    window.supabase && typeof window.supabase.createClient === "function");
}
function cfgMissing() {
  toast("Bulut özelliği yapılandırılamadı: site/supabase-config.js ve site/vendor/supabase.js dosyalarını kontrol et (docs/SUPABASE-VERCEL.md).", "warning");
}

// Supabase/Auth hata mesajlarını Türkçeleştir
const AUTH_ERR = {
  "invalid login credentials": "E-posta veya şifre hatalı.",
  "invalid_credentials": "E-posta veya şifre hatalı.",
  "email not confirmed": "E-posta adresin henüz onaylanmadı — gelen kutundaki onay bağlantısına tıkla.",
  "email_not_confirmed": "E-posta adresin henüz onaylanmadı — gelen kutundaki onay bağlantısına tıkla.",
  "user already registered": "Bu e-posta ile zaten kayıt var — 'Giriş Yap'ı dene.",
  "already registered": "Bu e-posta ile zaten kayıt var — 'Giriş Yap'ı dene.",
  "password should be at least": "Şifre en az 6 karakter olmalı.",
  "weak_password": "Şifre en az 6 karakter olmalı.",
  "unable to validate email address": "Geçerli bir e-posta adresi gir (ör. ad@ornek.com).",
  "email_address_invalid": "Geçerli bir e-posta adresi gir (ör. ad@ornek.com).",
  "for security purposes": "Çok fazla deneme — birkaç dakika bekle, sonra tekrar dene.",
  "over_email_send_rate_limit": "Çok fazla e-posta isteği — birkaç dakika bekle, sonra tekrar dene.",
  "provider is not enabled": "Google girişi Supabase panelinde etkin değil — e-posta ve şifre ile devam edebilirsin.",
  "failed to fetch": "Sunucuya ulaşılamadı — internet bağlantını kontrol et."
};
function authMsg(e) {
  const k = String((e && (e.code || e.error_code)) || "").toLowerCase();
  const m = String((e && e.message) || "").toLowerCase();
  for (const anahtar of Object.keys(AUTH_ERR)) {
    if (k.includes(anahtar) || m.includes(anahtar)) return AUTH_ERR[anahtar];
  }
  const ham = String((e && (e.message || e.error_description || e.code)) || e || "").trim();
  return "İşlem başarısız" + (ham ? ": " + ham : ".");
}

// ---- 1) SERVICE WORKER (PWA offline + yüklenebilir uygulama) ----
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => console.warn("SW kaydı başarısız (http/yerel dosya olabilir)."));
  });
}

// ---- 2) SUPABASE BAŞLATMA ----
(function initSupabase() {
  if (!cloudReady()) {
    console.warn("Supabase SDK/config bulunamadı — bulut özellikleri kapalı, uygulama çevrimdışı çalışır.");
    return;
  }
  try {
    sb = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" },
      global: { headers: { "x-application-name": "analiz-merkezi-pwa" } }
    });
    hookSaveState();
    listenAuth();
  } catch (e) {
    console.warn("Supabase başlatılamadı:", e);
  }
})();

// ---- 3) GİRİŞ ARAYÜZÜ (yan menü + mobil DAHA + giriş modalı) ----
function initAuthUI() {
  if (window.__pwaProfileHooked) return;
  window.__pwaProfileHooked = true;
  // Giriş ve Okulizyon tek yerde: PROFİL penceresi.
  // Giriş noktaları YALNIZCA iki tane: yan menü "Profil" sekmesi + mobil alt menü "Profil" sekmesi.
  window.__profilAc = openProfileModal;
  const nav = document.getElementById("sidebar-nav");
  if (nav && !document.getElementById("pwa-profile-nav")) {
    const nb = document.createElement("button");
    nb.id = "pwa-profile-nav";
    nb.className = "nav-item pwa-profil-giris";
    nb.dataset.act = "openProfile";
    nb.title = "Profil";
    nb.innerHTML = '<i data-lucide="user-round"></i><span>Profil <b class="pwa-okz-badge" style="display:none;background:#E11D48;color:#fff;border-radius:99px;padding:0 6px;font-size:10px;margin-left:4px;"></b></span>';
    nav.appendChild(nb);
  }
  const bnav = document.getElementById("bottom-nav");
  if (bnav && !document.getElementById("pwa-profile-tab")) {
    const tb = document.createElement("button");
    tb.id = "pwa-profile-tab";
    tb.className = "bottom-nav-item pwa-profil-giris";
    tb.dataset.act = "openProfile";
    tb.title = "Profil";
    tb.innerHTML = '<i data-lucide="user-round"></i><span>Profil</span>';
    bnav.appendChild(tb);
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
    else if (a === "openProfile") openProfileModal();
    else if (a === "syncNow") { if (typeof window.__supabaseSenkronizeEt === "function") { window.__supabaseSenkronizeEt(); toast("Buluta yedekleniyor…", "info"); } }
    else if (a === "pwaProfileClose") closeProfileModal();
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
        <div style="font-weight:800;font-size:18px;">Bulut Hesabı (Supabase)</div>
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
  buildAuthModal();
  const m = document.getElementById("pwa-auth-modal");
  if (!m) return;
  const msg = document.getElementById("pwa-auth-msg");
  if (msg) msg.textContent = "";
  // Bulut yapılandırması eksikse pencereyi yine de aç: kullanıcı ne olduğunu görsün
  if (!cloudReady()) {
    authMsgYaz("Bulut bağlantısı kurulamadı — giriş şu an kullanılamıyor. site/supabase-config.js ve site/vendor/supabase.js dosyalarını kontrol et.", true);
    try { cfgMissing(); } catch (e) {}
  }
  m.style.display = "flex";
  setTimeout(() => { const em = document.getElementById("pwa-email"); if (em) em.focus(); }, 60);
}
function closeAuthModal() { const m = document.getElementById("pwa-auth-modal"); if (m) m.style.display = "none"; }
function authMsgYaz(t, hata) { const el = document.getElementById("pwa-auth-msg"); if (el) { el.textContent = t; el.style.color = hata ? "#E11D48" : "#16A34A"; } }

// ---- 3b) PROFİL PENCERESİ: hesap (Supabase) + Okulizyon bağlantısı ----
function buildProfileModal() {
  if (document.getElementById("pwa-profile-modal")) return;
  const m = document.createElement("div");
  m.id = "pwa-profile-modal";
  m.style.cssText = "position:fixed;inset:0;z-index:9997;display:none;align-items:center;justify-content:center;background:rgba(10,16,32,0.6);padding:14px;";
  m.addEventListener("click", (e) => { if (e.target === m) closeProfileModal(); });
  document.body.appendChild(m);
}
function openProfileModal() {
  // Mobilde açık kalan DAHA sayfası / yan menü çekmecesi arkada kalmasın
  try {
    if (typeof closeMoreSheet === "function") closeMoreSheet();
    if (window.matchMedia && window.matchMedia("(max-width: 1023px)").matches && typeof toggleSidebar === "function") toggleSidebar(false);
  } catch (e) {}
  buildAuthModal();
  buildProfileModal();
  renderProfileModal();
  const m = document.getElementById("pwa-profile-modal");
  if (m) m.style.display = "flex";
  setTimeout(function () { try { okzKuyrukCek(false); } catch (e) {} }, 250);
  if (window.lucide && lucide.createIcons) lucide.createIcons();
}
function closeProfileModal() {
  const m = document.getElementById("pwa-profile-modal");
  if (m) m.style.display = "none";
}
function profilAvatarHarfleri() {
  const ad = String((state && state.user && state.user.name) || (currentUser && currentUser.email) || "").trim();
  const parcalar = ad.replace(/@.*$/, "").split(/[\s._-]+/).filter(Boolean);
  const harf = (parcalar[0] ? parcalar[0][0] : "?") + (parcalar[1] ? parcalar[1][0] : "");
  return harf.toLocaleUpperCase("tr-TR");
}
window.__profilTaze = function () { const m = document.getElementById("pwa-profile-modal"); if (m && m.style.display === "flex") renderProfileModal(); };
function renderProfileModal() {
  const m = document.getElementById("pwa-profile-modal");
  if (!m) return;
  if (!state.settings) state.settings = {};
  const s = state.settings.okulizyon ? state.settings.okulizyon : (state.settings.okulizyon = {});
  const st = okzStore();
  const bekleyen = st.pending.reduce((acc, ex) => acc + (ex.rows || []).length, 0);
  const hesapSatiri = currentUser
    ? '<div style="display:flex;align-items:center;gap:10px;"><div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#1D4ED8,#38BDF8);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;">' + escHtml(profilAvatarHarfleri()) + '</div><div style="min-width:0;"><div style="font-weight:700;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escHtml(currentUser.email || "hesap") + '</div><div style="font-size:11.5px;color:#16A34A;font-weight:600;">☁ Bulut yedeği etkin (Supabase)</div></div></div>'
    : '<div style="font-size:12.5px;opacity:0.8;">Giriş yapılmadı — veriler yalnız bu cihazda saklanıyor.</div>';

  const ILCELER = ["Şahinbey", "Şehitkamil", "Oğuzeli", "Nizip", "İslahiye", "Nurdağı", "Araban", "Yavuzeli", "Karkamış"];
  const inp = (k, label, ph) => '<label style="font-size:11.5px;opacity:0.8;">' + label + '<input id="okz-' + k + '" value="' + escHtml(s[k] || "") + '" placeholder="' + ph + '" autocapitalize="characters" style="width:100%;box-sizing:border-box;padding:9px 10px;border-radius:9px;border:1px solid rgba(0,0,0,0.18);background:var(--bg,#F6F8FC);color:inherit;font-size:13.5px;margin-top:3px;' + (k === "ad" ? "text-transform:uppercase;font-weight:600;" : "") + '"></label>';
  const sel = (k, label, opts) => '<label style="font-size:11.5px;opacity:0.8;">' + label + '<select id="okz-' + k + '" style="width:100%;box-sizing:border-box;padding:9px 10px;border-radius:9px;border:1px solid rgba(0,0,0,0.18);background:var(--bg,#F6F8FC);color:inherit;font-size:13.5px;margin-top:3px;">' + opts.map(o => '<option' + ((s[k] || opts[0]) === o ? " selected" : "") + '>' + escHtml(o) + "</option>").join("") + "</select></label>";

  let html = '<div style="width:100%;max-width:520px;max-height:88vh;overflow:auto;background:var(--bg-elev,#fff);color:var(--text,#16213A);border-radius:18px;padding:20px;box-shadow:0 24px 60px rgba(0,0,0,0.35);">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><div style="font-weight:800;font-size:18px;">👤 Profil <span style="font-size:10px;font-weight:400;opacity:0.5;">' + escHtml(PWA_SURUM) + '</span></div><button data-act="pwaProfileClose" style="background:none;border:0;font-size:20px;cursor:pointer;color:inherit;min-width:36px;min-height:36px;">✕</button></div>';

  // A) HESAP
  html += '<div style="border:1px solid rgba(0,0,0,0.12);border-radius:14px;padding:12px;margin-bottom:14px;">';
  html += '<div style="font-size:11px;font-weight:800;letter-spacing:0.06em;opacity:0.6;margin-bottom:8px;">HESAP</div>';
  html += hesapSatiri;
  html += '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">';
  html += currentUser
    ? '<button data-act="pwaAuth" class="btn btn-ghost btn-sm" style="border:1px solid rgba(0,0,0,0.15);">Çıkış Yap</button><button data-act="syncNow" class="btn btn-ghost btn-sm" style="border:1px solid rgba(0,0,0,0.15);">Şimdi Yedekle</button>'
    : '<button data-act="pwaAuth" class="btn btn-primary btn-sm">Giriş Yap / Kayıt Ol</button>';
  html += '</div>';
  html += '<div style="font-size:11px;opacity:0.65;margin-top:8px;">Giriş yapınca denemeler, konular ve plan cihazlar arasında Supabase üzerinden eşitlenir.</div>';
  html += '</div>';

  // B) OKULIZYON
  html += '<div style="border:1px solid rgba(0,0,0,0.12);border-radius:14px;padding:12px;margin-bottom:14px;">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;"><div style="font-size:11px;font-weight:800;letter-spacing:0.06em;opacity:0.6;">OKULIZYON BAĞLANTISI</div>' + (bekleyen > 0 ? '<span style="font-size:11px;font-weight:700;color:#E11D48;">' + bekleyen + ' soru bekliyor</span>' : '') + '</div>';
  html += '<div style="font-size:11.5px;opacity:0.72;margin-bottom:10px;">Okulizyon\'daki bilgilerini bir kez gir; sınav sonuçların her sabah otomatik çekilir.</div>';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">';
  html += inp("ad", "AD SOYAD (BÜYÜK HARF)", "AHMET YILMAZ");
  html += inp("okulNo", "OKUL NO", "1234");
  html += sel("sinif", "SINIF", ["9", "10", "11", "12"]);
  html += sel("il", "İL", ["Gaziantep"]);
  html += sel("ilce", "İLÇE", ILCELER);
  html += sel("okulAdi", "OKUL", ["Akken Anadolu Lisesi"]);
  html += '</div>';
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  html += '<button data-act="okzSaveBilgi" class="btn btn-primary btn-sm">Bilgileri Kaydet</button>';
  html += '<button data-act="okzSimdiCek" class="btn btn-ghost btn-sm" style="border:1px solid rgba(0,0,0,0.15);">Şimdi dene</button>';
  html += '<button data-act="pwaOkz" class="btn btn-ghost btn-sm" style="border:1px solid rgba(0,0,0,0.15);">Analiz Bekliyor' + (bekleyen > 0 ? " (" + bekleyen + ")" : "") + '</button>';
  html += '</div>';
  // Çekim durumu: sessiz başarısızlık yerine açık bilgi
  const durumRenk = !st.durum ? "#6B7280" : (st.durum.kod === "ok" ? "#16A34A" : (st.durum.kod === "giris-yok" || st.durum.kod === "bos" ? "#B45309" : "#E11D48"));
  html += '<div style="margin-top:9px;font-size:11.5px;line-height:1.45;color:' + durumRenk + ';">'
       + '<b>Son çekim:</b> '
       + (st.durum ? escHtml(okzZaman(st.durum.zaman)) + " — " + escHtml(st.durum.mesaj) : "henüz denenmedi")
       + (st.sonCekim ? '<br><span style="opacity:0.75;">Sunucudaki son çekim: ' + escHtml(okzZaman(Date.parse(st.sonCekim) || 0)) + '</span>' : "")
       + '</div>';
  if (st.duyurular && st.duyurular.length) {
    html += '<div style="margin-top:12px;font-size:11px;font-weight:800;letter-spacing:0.06em;opacity:0.6;">OKUL DUYURULARI</div>';
    st.duyurular.slice(0, 4).forEach(d => {
      html += '<a href="' + escHtml(d.url || "#") + '" target="_blank" rel="noopener" style="display:flex;justify-content:space-between;gap:8px;font-size:12px;padding:6px 0;border-top:1px solid rgba(0,0,0,0.07);text-decoration:none;color:inherit;"><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escHtml(d.baslik || "") + '</span><span style="opacity:0.6;white-space:nowrap;">' + escHtml(d.tarih || "") + '</span></a>';
    });
  }
  html += '</div>';

  // C) SORU HAVUZU / SÜRÜM
  const havuzSayisi = (window.__havuzBilgi && window.__havuzBilgi.havuz) || 0;
  const soruSayisi = (window.__havuzBilgi && window.__havuzBilgi.soru) || 0;
  html += '<div style="border:1px dashed rgba(0,0,0,0.18);border-radius:14px;padding:12px;font-size:12px;opacity:0.85;">';
  html += '<b>Soru havuzu:</b> ' + (havuzSayisi ? havuzSayisi + " havuz · " + soruSayisi + " soru" : "yükleniyor…") + '<br>';
  html += '<b>Sürüm:</b> ' + escHtml(PWA_SURUM) + ' · <b>Bulut:</b> Supabase';
  html += '</div>';

  html += '</div>';
  m.innerHTML = html;
}

// ---- 4) E-POSTA/ŞİFRE İŞLEMLERİ (Supabase Auth) ----
function authAlanlari() {
  const email = ((document.getElementById("pwa-email") || {}).value || "").trim();
  const pass = ((document.getElementById("pwa-pass") || {}).value || "");
  return { email, pass };
}
async function emailLogin() {
  if (!cloudReady() || !sb) return cfgMissing();
  const { email, pass } = authAlanlari();
  if (!email || !pass) return authMsgYaz("E-posta ve şifreyi doldur.", true);
  authMsgYaz("Giriş yapılıyor…", false);
  const { error } = await sb.auth.signInWithPassword({ email: email, password: pass });
  if (error) return authMsgYaz(authMsg(error), true);
  closeAuthModal();
  toast("Giriş başarılı — bulut yedeği etkin.", "success");
}
async function emailRegister() {
  if (!cloudReady() || !sb) return cfgMissing();
  const { email, pass } = authAlanlari();
  if (!email || !pass) return authMsgYaz("E-posta ve şifreyi doldur.", true);
  if (pass.length < 6) return authMsgYaz("Şifre en az 6 karakter olmalı.", true);
  authMsgYaz("Kayıt oluşturuluyor…", false);
  const { data, error } = await sb.auth.signUp({ email: email, password: pass });
  if (error) return authMsgYaz(authMsg(error), true);
  if (data && data.session) {
    closeAuthModal();
    toast("Kayıt oluşturuldu — verilerin artık buluta yedekleniyor.", "success");
  } else {
    authMsgYaz("Kayıt alındı. E-postana gelen onay bağlantısına tıkladıktan sonra giriş yapabilirsin.", false);
  }
}
async function resetPassword() {
  if (!cloudReady() || !sb) return cfgMissing();
  const { email } = authAlanlari();
  if (!email) return authMsgYaz("Önce e-postanı yaz, sonra 'Şifremi unuttum'a bas.", true);
  const yonlendirme = location.origin + location.pathname;
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: yonlendirme });
  if (error) return authMsgYaz(authMsg(error), true);
  authMsgYaz("Şifre sıfırlama bağlantısı e-postana gönderildi (bağlantıya tıklayınca yeni şifre sorulur).", false);
}
async function googleLogin() {
  if (!cloudReady() || !sb) return cfgMissing();
  const { error } = await sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: location.origin + location.pathname, queryParams: { prompt: "select_account" } }
  });
  if (error) authMsgYaz(authMsg(error), true);
}
async function doSignOut() {
  if (!sb) return;
  const { error } = await sb.auth.signOut();
  if (error) return toast(authMsg(error), "error");
  currentUser = null;
  window.__bulutYuklenenKullanici = null;
  setAuthLabel(false);
  toast("Çıkış yapıldı — verilerin bu cihazda durmaya devam ediyor.", "success");
}

function setAuthLabel(girisli, kim) {
  const av = document.getElementById("sidebar-avatar");
  if (av) av.innerHTML = girisli ? '<span style="font-weight:800;font-size:14px;">' + escHtml(profilAvatarHarfleri()) + '</span>' : '<i data-lucide="user" style="width:19px;height:19px;"></i>';
  if (av && window.lucide && lucide.createIcons) lucide.createIcons();
  const lbl = document.getElementById("pwa-auth-label");
  if (!lbl) return;
  lbl.textContent = girisli ? "Çıkış (" + (kim || "hesap") + ") · ☁ bulut" : "Giriş Yap (E-posta)";
  const pm = document.getElementById("pwa-profile-modal");
  if (pm && pm.style.display === "flex") renderProfileModal();
}

// ---- 5) OTURUM TAKİBİ + BULUTTAN GERİ YÜKLEME (Supabase) ----
function sifreYenileAkisi() {
  setTimeout(async () => {
    try {
      const yeni = window.prompt("Yeni şifreni yaz (en az 6 karakter):");
      if (!yeni) return;
      if (yeni.length < 6) return toast("Şifre en az 6 karakter olmalı.", "error");
      const { error } = await sb.auth.updateUser({ password: yeni });
      if (error) throw error;
      toast("Şifren güncellendi — yeni şifreyle giriş yapabilirsin.", "success");
      if (history.replaceState) history.replaceState(null, "", location.pathname);
    } catch (e) { toast(authMsg(e), "error"); }
  }, 400);
}

function listenAuth() {
  if (!sb) return;
  sb.auth.getSession().then(({ data }) => { if (data && data.session) oturumUygula(data.session); });
  // Eski sürümlerden gelen (Firebase) oturum kalıntılarını temizle
  try { Object.keys(localStorage).filter(k => k.indexOf("firebase:") === 0 || k.indexOf("__firebase") === 0).forEach(k => localStorage.removeItem(k)); } catch (e) {}
  sb.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") sifreYenileAkisi();
    if (event === "SIGNED_OUT" || !session) {
      currentUser = null;
      window.__bulutYuklenenKullanici = null;
      setAuthLabel(false);
      return;
    }
    if (session) oturumUygula(session);
  });
}

async function oturumUygula(session) {
  const user = session && session.user;
  if (!user) return;
  const yeniKullanici = !currentUser || currentUser.id !== user.id;
  currentUser = user;
  const kim = (user.email || "").split("@")[0] || "hesap";
  setAuthLabel(true, kim);
  // Giriş yapıldığı anda Okulizyon kuyruğunu dene (eskiden yalnız "internet geri geldi" olayında deniyordu)
  setTimeout(function () { try { if (typeof state !== "undefined") okzKuyrukCek(true); } catch (e) {} }, 1200);
  if (!yeniKullanici && window.__bulutYuklenenKullanici === user.id) return; // token yenilemede tekrar yükleme
  window.__bulutYuklenenKullanici = user.id;
  if (typeof state === "undefined") return; // state henüz hazır değil (index.html yükleniyor)
  if (!state.user.name && kim) {
    state.user.name = kim;
    try { saveState(); } catch (e) {}
    if (typeof updateUserUI === "function") updateUserUI();
  }
  try {
    const { data, error } = await sb.from("app_states")
      .select("state, updated_at, grade, deneme_sayisi")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw error;
    if (data && data.state) {
      const uzakState = typeof data.state === "string" ? JSON.parse(data.state) : data.state;
      const yerelBos = !state.exams.length && !state.questions.length && !Object.keys(state.topics).length;
      const nEx = (uzakState.exams || []).length;
      const nQ = (uzakState.questions || []).length;
      const tarih = data.updated_at ? new Date(data.updated_at).toLocaleDateString("tr-TR") : "bilinmeyen tarih";
      if (!yerelBos) {
        openConfirm(
          "Bulutta " + tarih + " tarihli bir kayıt var (" + nEx + " deneme, " + nQ + " soru çözümü). Buluttaki kayıt YERELDEKİ VERİLERİN ÜZERİNE yazılsın mı?",
          () => {
            state = mergeDeep(freshState(), uzakState);
            state.user.grade = state.user.grade || "9";
            saveState();
            navigate(currentPage);
            if (typeof updateUserUI === "function") updateUserUI();
            toast("Bulut kaydı yüklendi (" + nEx + " deneme).", "success");
          }
        );
      } else {
        state = mergeDeep(freshState(), uzakState);
        saveState();
        navigate(currentPage);
        if (typeof updateUserUI === "function") updateUserUI();
        toast("Bulut kaydın geri yüklendi (" + nEx + " deneme).", "success");
      }
    }
  } catch (e) { console.warn("Bulut kaydı okunamadı:", e); }
  registerFCM();
}

// ---- 6) saveState KANCASI: her kayıtta Supabase'e debounced yaz ----
function hookSaveState() {
  if (window.__saveHooked) return;
  window.__saveHooked = true;
  const orijinal = window.saveState;
  if (typeof orijinal !== "function") return;
  async function senkronizeEt() {
    if (!sb || !currentUser) return;
    try {
      const { error } = await sb.from("app_states").upsert({
        user_id: currentUser.id,
        state: state,
        grade: (state.user && state.user.grade) || null,
        deneme_sayisi: (state.exams || []).length,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });
      if (error) throw error;
      setAuthLabel(true, (currentUser.email || "").split("@")[0] || "hesap");
      const rozet = document.getElementById("pwa-auth-label");
      if (rozet && rozet.textContent.indexOf("✓ bulutta") === -1) rozet.textContent += " · ✓ bulutta";
    } catch (e) { console.warn("Bulut senkronu başarısız (çevrimdışı?):", e); }
  }
  window.__supabaseSenkronizeEt = senkronizeEt;
  window.saveState = function () {
    const sonuc = orijinal.apply(this, arguments);
    if (currentUser && sb) {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(senkronizeEt, 4000);
    }
    return sonuc;
  };
  // İnternet geri gelince bekleyen senkronu otomatik yeniden dene
  window.addEventListener("online", () => {
    if (currentUser && sb) {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(senkronizeEt, 2500);
    }
  });
}

// ---- 7) CLOUD MESSAGING (uygulama açıkken bildirim — opsiyonel) ----
async function registerFCM() {
  if (!currentUser || !sb || !FCM_VAPID_KEY || !FIREBASE_CONFIG || !FIREBASE_CONFIG.apiKey) return;
  try {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    if (!("serviceWorker" in navigator)) return;
    const { initializeApp } = await import(SDK + "/firebase-app.js");
    const { getMessaging, getToken, onMessage } = await import(SDK + "/firebase-messaging.js");
    if (!fbApp) fbApp = initializeApp(FIREBASE_CONFIG);
    fbMsg = getMessaging(fbApp);
    const token = await getToken(fbMsg, {
      vapidKey: FCM_VAPID_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.ready
    });
    if (token) {
      await sb.from("fcm_tokens").upsert({
        user_id: currentUser.id,
        token: token,
        platform: navigator.platform || null,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id,token" });
    }
    if (!window.__fcmDinliyor) {
      window.__fcmDinliyor = true;
      onMessage(fbMsg, (payload) => {
        const t = (payload.notification && payload.notification.title) || "Analiz Merkezi";
        const b = (payload.notification && payload.notification.body) || "";
        if (typeof addNotification === "function") {
          addNotification({ title: t, body: b, kind: "info", topicKey: "fcm@" + Date.now() });
        }
        toast(t + " — " + b, "info");
      });
    }
  } catch (e) { console.warn("FCM kaydı başarısız:", e); }
}

// ---- 8) OKULIZYON ENTEGRASYONU (çek → Analiz Bekliyor → neden seç → kaydet) ----
const OKZ_NEDENLER = ["Konuyu Bilmiyordum", "KONU EKSİKLİĞİ", "ANLAMADIM", "İşlem Hatası/Dikkatsizlik", "Kodlama/Kitapçık Hatası", "SÜRE YETMEDİ", "ÇÖZÜM YOLUNU BULAMADIM"];
function okzStore() {
  if (!state.okulizyon) state.okulizyon = { pending: [], importedKeys: [], pulledAt: 0, duyurular: null };
  return state.okulizyon;
}
// Çekim sonucunu kullanıcıya görünür kıl (sessiz console.warn yerine)
function okzDurum(kod, mesaj) {
  try {
    const st = okzStore();
    st.durum = { kod: kod, mesaj: mesaj, zaman: Date.now() };
    saveState();
  } catch (e) {}
  if (typeof window.__profilTaze === "function") window.__profilTaze();
  return kod;
}
function okzZaman(ts) {
  try { return new Date(ts).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch (e) { return ""; }
}
function okzKey(ex) { return (ex.name || "?") + "|" + (ex.date || ""); }
function initOkulizyonUI() {
  if (window.__okzHooked) return;
  window.__okzHooked = true;
  // Okulizyon girişi yalnız PROFİL penceresinden; burada sadece kuyruk penceresi hazırlanır
  buildOkzModal();
  buildProfileModal();
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const a = el.dataset.act;
    if (a === "pwaOkz") openOkzModal();
    else if (a === "okzSimdiCek") { toast("Okulizyon sonuçları sorgulanıyor…", "info"); okzKuyrukCek(true); }
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
  document.querySelectorAll(".pwa-okz-badge").forEach(b => {
    b.style.display = n > 0 ? "inline-block" : "none";
    b.textContent = n > 0 ? String(n) : "";
  });
  const avatar = document.getElementById("sidebar-avatar");
  if (avatar) {
    avatar.style.boxShadow = n > 0 ? "0 0 0 3px rgba(225,29,72,0.75)" : "";
    avatar.title = n > 0 ? "Profil — " + n + " soru Analiz Bekliyor" : "Profil";
  }
  const pm = document.getElementById("pwa-profile-modal");
  if (pm && pm.style.display === "flex") renderProfileModal();
}
function buildOkzModal() {
  if (document.getElementById("pwa-okz-modal")) return;
  const m = document.createElement("div");
  m.id = "pwa-okz-modal";
  m.style.cssText = "position:fixed;inset:0;z-index:9998;display:none;align-items:center;justify-content:center;background:rgba(10,16,32,0.6);padding:14px;";
  m.addEventListener("click", (e) => { if (e.target === m) closeOkzModal(); });
  document.body.appendChild(m);
}
function openOkzModal() { buildOkzModal(); renderOkzModal(); const m = document.getElementById("pwa-okz-modal"); if (m) m.style.display = "flex"; }
function closeOkzModal() { const m = document.getElementById("pwa-okz-modal"); if (m) m.style.display = "none"; }
function escHtml(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function renderOkzModal() {
  const m = document.getElementById("pwa-okz-modal");
  const s = state.settings && state.settings.okulizyon ? state.settings.okulizyon : {};
  const st = okzStore();
  let html = '<div style="width:100%;max-width:520px;max-height:86vh;overflow:auto;background:var(--bg-elev,#fff);color:var(--text,#16213A);border-radius:18px;padding:20px;box-shadow:0 24px 60px rgba(0,0,0,0.35);">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><div style="font-weight:800;font-size:17px;">Okulizyon <span style="font-size:10px;font-weight:400;opacity:0.5;">' + PWA_SURUM + '</span></div><button data-act="okzClose" style="background:none;border:0;font-size:19px;cursor:pointer;color:inherit;">✕</button></div>';
  // A) Bağlantı bilgileri artık PROFİL penceresinde — burada yalnız kuyruk yönetilir
  html += '<div style="font-size:12px;opacity:0.8;margin-bottom:10px;padding:10px;border:1px dashed rgba(0,0,0,0.2);border-radius:10px;">Okulizyon bilgileri (ad, okul no, sınıf, il/ilçe, okul) <b>Profil</b> penceresinden girilir. Buradan yalnızca <b>Analiz Bekliyor</b> kuyruğunu işlersin.</div>';
  html += '<button data-act="openProfile" class="btn btn-ghost btn-sm" style="border:1px solid rgba(0,0,0,0.15);margin-bottom:14px;">Profili Aç</button>';
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
    html += '<div style="font-weight:800;font-size:14.5px;margin:14px 0 6px;">Okul Duyuruları</div>';
    st.duyurular.slice(0, 6).forEach(d => {
      html += '<a href="' + escHtml(d.url) + '" target="_blank" rel="noopener" style="display:block;font-size:12.5px;padding:7px 0;border-top:1px solid rgba(0,0,0,0.07);text-decoration:none;color:inherit;">' + (d.tarih ? "<b>[" + escHtml(d.tarih) + "]</b> " : "") + escHtml(d.baslik) + (d.lesson ? ' <span style="color:#16A34A;font-weight:700;">takvime eklendi</span>' : "") + "</a>";
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
  const pm = document.getElementById("pwa-profile-modal");
  if (pm && pm.style.display === "flex") renderProfileModal();
  toast("Kaydedildi — çekim her sabah 07:30'da otomatik (" + ad + " · " + state.settings.okulizyon.okulAdi + ")", "success");
}
function okzHepsiUygula(reason) {
  document.querySelectorAll(".okz-reason").forEach(sel => { sel.value = reason; });
}
let okzCekSuruyor = false;
async function okzKuyrukCek(zorla) {
  if (typeof state === "undefined") return;                 // uygulama durumu henüz hazır değil
  if (okzCekSuruyor) return;
  const st0 = okzStore();
  const simdi = Date.now();
  // Otomatik denemeler 5 dakikada bir; "Şimdi dene" her zaman çalışır
  if (!zorla && st0.sonDeneme && simdi - st0.sonDeneme < 5 * 60 * 1000) return;
  st0.sonDeneme = simdi;

  if (!sb) return okzDurum("bulut-yok", "Supabase istemcisi yüklenmedi (vendor/supabase.js / supabase-config.js).");
  if (!currentUser) return okzDurum("giris-yok", "Giriş yapılmadı — sınav sonuçları hesaba bağlı. Önce giriş yap.");

  okzCekSuruyor = true;
  try {
    const { data, error } = await sb.from("okulizyon_kuyrugu")
      .select("exams, pulled_at")
      .eq("user_id", currentUser.id)
      .maybeSingle();
    if (error) return okzDurum("hata", "Sunucu hatası: " + (error.message || "kuyruk okunamadı"));
    if (!data) return okzDurum("bos", "Bu hesap için sunucuda çekilmiş sonuç yok (okulizyon_kuyrugu tablosunda kayıt bulunamadı).");

    const st = okzStore();
    const pulledAt = Date.parse(data.pulled_at) || 0;
    st.sonCekim = data.pulled_at || null;
    if (pulledAt > (st.pulledAt || 0)) {
      st.pulledAt = pulledAt;
      const yeni = (data.exams || []).filter(ex => !st.importedKeys.includes(okzKey(ex)));
      st.pending = yeni;
      const n = yeni.reduce((a, ex) => a + (ex.rows || []).length, 0);
      saveState();
      if (n > 0) {
        addNotification({ title: "Okulizyon: " + n + " soru Analiz Bekliyor", body: yeni.map(e => e.name).join(", ").slice(0, 140), kind: "info", topicKey: "okz@" + data.pulled_at });
        okzBadge();
        openConfirm("Okulizyon'dan " + n + " soru geldi (Analiz Bekliyor). Şimdi nedenlerini seçmek ister misin?", openOkzModal);
        okzDurum("ok", n + " soru Analiz Bekliyor kuyruğuna eklendi.");
      } else {
        okzDurum("ok", "Yeni soru yok — " + ((data.exams || []).length) + " sınav okundu.");
      }
    } else {
      okzDurum("ok", "Yeni sonuç yok. Son çekim: " + (data.pulled_at ? okzZaman(pulledAt) : "bilinmiyor"));
    }

    const { data: duyurular, error: dErr } = await sb.from("okul_duyurulari")
      .select("baslik, tarih, url, lesson")
      .order("created_at", { ascending: false })
      .limit(20);
    if (!dErr && duyurular && duyurular.length) {
      okzStore().duyurular = duyurular;
      okzDuyurularToSchoolExams(duyurular);
      saveState();
    }
  } catch (e) {
    okzDurum("hata", String((e && e.message) || e));
    console.warn("Okulizyon kuyruğu okunamadı:", e);
  } finally {
    okzCekSuruyor = false;
    okzBadge();
  }
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
// Profil (hesap + Okulizyon bilgileri) ve Okulizyon kuyruğu arayüzlerini kur.
// NOT: initAuthUI burada çağrılmazsa Profil'e hiçbir yerden ulaşılamaz (giriş/Okulizyon görünmez).
function pwaArayuzKur() {
  try { initAuthUI(); } catch (e) { console.warn("Profil arayüzü kurulamadı:", e); }
  try { initOkulizyonUI(); } catch (e) { console.warn("Okulizyon arayüzü kurulamadı:", e); }
}
if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", pwaArayuzKur);
else pwaArayuzKur();
window.addEventListener("load", pwaArayuzKur);
window.addEventListener("online", () => setTimeout(okzKuyrukCek, 3000));
