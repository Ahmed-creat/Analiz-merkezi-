const PWA_SURUM = "v60-tek-tekrar-dugmesi";
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
  toast("Bulut yedeği şu an kullanılamıyor — yerel kayıt devam ediyor.", "warning");
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
  "provider is not enabled": "Google ile giriş şu an kullanılamıyor — e-posta ve şifre ile devam edebilirsin.",
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
    eskiAnahtarlariTemizle();
    hookSaveState();
    listenAuth();
    // v40 — oturum açıldıysa Realtime bildirim kanalını hemen kur.
    setTimeout(function () { try { bildirimKanaliniKur(); } catch (e) { } }, 1500);
    // Köprü: site/push-bildirim.js (klasik script) modül kapsamındaki
    // Supabase istemcisine ve oturuma buradan erişir.
    window.__amSupabase = sb;
    window.__amSupabaseConfig = SUPABASE_CONFIG;
    window.__amSession = async function () {
      try { const { data } = await sb.auth.getSession(); return (data && data.session) || null; }
      catch (e) { return null; }
    };
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
    // v41 — test/tanılama düğmeleri KALDIRILDI. "Bu cihazda dene" artık
    // yalnız bildirim izni VERİLDİĞİ ANDA kendiliğinden çalışır (index.html
    // requestNotifPermission → window.__amCihazBildirimTesti).
  });
  if (window.lucide && lucide.createIcons) lucide.createIcons();
}

// v41 — TEK CÜMLELİK, ÖĞRENCİYE YÖNELİK DURUM.
// Teknik tanılama metinleri (VAPID anahtarı, abonelik uç noktası, sunucu
// sürümü, push izi) kaldırıldı; öğrencinin yapabileceği bir şey varsa o yazılır.
// v55 — profil düğmesi: bildirimi göster, göründü mü diye ölç, sonucu söyle.
async function amKanalTestiCalistir() {
  if (typeof toast === "function") toast("Bildirim kanalı deneniyor…", "info");
  const t = await cihazBildirimTesti();
  if (typeof toast === "function") {
    if (t && t.gorunur) toast("Cihaz bildirimi gösteriyor ✓ Bu cihaza hatırlatmalar düşecek.", "success");
    else if (t && /izin/.test(String(t.neden || ""))) toast("Önce bildirim izni ver: Ayarlar → Bildirim İzni İste.", "warning");
    else toast("Bu cihaz bildirimi GÖSTERMİYOR. Telefon ayarları → Uygulamalar → Chrome → Bildirimler'i aç, Rahatsız etmeyin'i kapat, sonra tekrar dene.", "error");
  }
  await pushTeshisYaz();
}

async function pushTeshisYaz() {
  const kutu = document.getElementById("pwa-push-durum");
  if (!kutu) return;
  try {
    if (typeof Notification === "undefined" || !("serviceWorker" in navigator)) {
      kutu.textContent = "Bu tarayıcı bildirim göstermiyor. iPhone'da uygulamayı “Ana Ekrana Ekle” ile kurunca çalışır.";
      return;
    }
    if (Notification.permission === "denied") {
      kutu.textContent = "Bildirimler tarayıcıda kapalı. Adres çubuğundaki kilit simgesi → Bildirimler → İzin ver → sayfayı yenile.";
      return;
    }
    if (Notification.permission !== "granted") {
      kutu.textContent = "Bildirim izni verilmedi. Ayarlar → “Bildirim İzni İste”ye dokun; izin verdiğin an bir deneme bildirimi gelir.";
      return;
    }
    let abone = null;
    try { const k = await navigator.serviceWorker.ready; abone = await k.pushManager.getSubscription(); } catch (e) { /* */ }
    if (!abone) {
      kutu.textContent = "İzin var ama cihaz kaydı tamamlanmadı. “Bağlantıyı yenile”ye dokun.";
      return;
    }
    // v44 — YALAN SÖYLEME: sunucunun gönderdiği ile cihazın aldığı karşılaştırılır.
    // Sunucu "gönderdim" diyor, cihazda iz yoksa gerçekten ulaşmıyor demektir.
    const bilgi = (window.AmPush && window.AmPush.teshis) ? await window.AmPush.teshis().catch(() => null) : null;
    const cihaz = bilgi && bilgi.cihaz ? bilgi.cihaz : {};
    const sonGonderim = cihaz.sunucuSonGonderim || null;
    const sonPush = cihaz.sonPush ? new Date(cihaz.sonPush.zaman) : null;
    // v54 — ÖNCE "SUNUCU BU CİHAZI TANIYOR MU?".
    // 15 Kasım vakası: cihazda abonelik vardı, arayüz "Açık ✓ hatırlatma gelir"
    // diyordu, ama uç nokta veritabanında YOKTU → sunucu başka (ölü) uçlara
    // gönderiyor, FCM 201 dönüyor, tablete hiçbir şey ulaşmıyordu.
    if (cihaz.kayitli === false) {
      let m2 = "Bu cihaz sunucuya kayıtlı değil — hatırlatmalar şu an bu cihaza gelmez. “Bağlantıyı yenile”ye dokun.";
      if (cihaz.ucKodu) m2 += " · Cihaz kodu: " + cihaz.ucKodu + ".";
      const kh = window.AmPush && window.AmPush.sonKayitHatasi ? window.AmPush.sonKayitHatasi() : null;
      if (kh && kh.neden) m2 += " Kayıt hatası: " + String(kh.neden).slice(0, 80);
      kutu.textContent = m2;
      return;
    }
    // v57 — DÜRÜSTLÜK: "izin açık" bir kanıt değil, ön koşuldur. Metin artık
    // "hatırlatma gelir" DEMAZ; cihazın push alıp almadığı ölçümle yazılır.
    // v59 — DÜRÜST SAAT: hatırlatma günde iki vardiya gider (sabah + akşam).
    // Dört saat yazıp ikisini göndermek yanıltıcıydı.
    let metin = "Bildirim izni açık ✓ Günde 2 hatırlatma: sabah 07:35 · akşam 19:30.";
    if (sonGonderim) {
      const t = new Date(sonGonderim + "T00:00:00");
      const gun = t.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
      metin += " Sunucu son olarak " + gun + " gönderdi";
      if (sonPush && sonPush >= t) {
        metin += ", cihaz aldı ✓";
      } else if (sonPush) {
        metin += ", cihaz en son " + sonPush.toLocaleDateString("tr-TR") + " tarihli bildirimi aldı — bağlantıyı yenile.";
      } else {
        metin += ", cihaza ulaştığına dair iz yok — “Bağlantıyı yenile”ye dokun.";
      }
    } else if (sonPush) {
      metin += " Son gelen bildirim: " + sonPush.toLocaleString("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) + ".";
    }
    // v53 — CİHAZ KODU + varsa gösterim hatası. İkisi birlikte, "sunucu
    // gönderdi ama cihaz göstermedi" ile "cihaz hiç almadı" ayrımını
    // kullanıcıdan tek satırla öğrenmeyi sağlar.
    const kanal = (window.__amSonKanalTesti ? window.__amSonKanalTesti() : null);
    if (kanal && kanal.gorunur === false) {
      metin += " · CİHAZ BİLDİRİM GÖSTERMİYOR (kanal testi: " +
        new Date(kanal.zaman).toLocaleString("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) +
        "). Android: Ayarlar → Uygulamalar → Chrome → Bildirimler açık mı? Rahatsız etmeyin kapalı mı?";
    } else if (kanal && kanal.gorunur === true) {
      metin += " · Kanal testi: cihaz bildirimi gösteriyor.";
    }
    // v57 — CİHAZ BEYANI (sw.js → push_teslim): sunucunun gönderdiği push
    // OLAYI bu cihaza ulaştı mı? "Gönderildi" ile "cihaz aldı" arasındaki fark
    // artık kullanıcıya tahmin olarak değil kayıt olarak gösterilir.
    try {
      const kod = cihaz.ucKodu || "";
      if (sb && sb.from && kod) {
        const { data } = await sb.from("push_teslim")
          .select("asama,created_at,gosterildi,hata")
          .eq("abonelik", kod).order("created_at", { ascending: false }).limit(6);
        const satirlar = Array.isArray(data) ? data : [];
        const pushSatir = satirlar.filter(function (r) { return r.asama === "push"; })[0] || null;
        const gosterim = satirlar.filter(function (r) { return r.asama === "gosterim"; })[0] || null;
        const bicim = function (z) {
          return new Date(z).toLocaleString("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
        };
        if (pushSatir) {
          metin += " · Cihaz sunucu bildirimini ALDI ✓ (" + bicim(pushSatir.created_at) + ")";
          if (gosterim) metin += gosterim.gosterildi ? ", ekranda gösterdi ✓." : ", EKRANDA GÖSTEREMEDİ: " + String(gosterim.hata || "bilinmeyen hata").slice(0, 60);
          else metin += ".";
        } else if (satirlar.some(function (r) { return r.asama === "sw-acildi"; })) {
          metin += " · Cihaz hazır, ama sunucu bildirimi bu cihaza HİÇ ULAŞMADI.";
        }
      }
    } catch (e) { /* ölçüm okunamazsa metin kısalır, uygulama bozulmaz */ }
    if (cihaz.ucKodu) metin += " · Cihaz kodu: " + cihaz.ucKodu + ".";
    // v56 — hangi tarayıcı? (Chrome dışı / WebView ise push inmez)
    try {
      const tb = (window.AmPush && window.AmPush.kisaTarayici) ? window.AmPush.kisaTarayici() : "";
      if (tb) metin += " · Tarayıcı: " + tb + ".";
    } catch (e) { /* */ }
    if (sonPush && sonPush.hata) metin += " Gösterim hatası: " + String(sonPush.hata).slice(0, 80);
    if (sonPush && sonPush.sadeSecenek) metin += " (sade biçimde gösterildi)";
    kutu.textContent = metin;
  } catch (e) {
    kutu.textContent = "Bildirim durumu okunamadı. Uygulamayı yenilemeyi dene.";
  }
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
      <div id="pwa-auth-google-not" style="font-size:11.5px;margin-top:8px;color:#B45309;line-height:1.4;"></div>
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
    authMsgYaz("Giriş şu an kullanılamıyor. İnternet bağlantını kontrol edip tekrar dene.", true);
    try { cfgMissing(); } catch (e) {}
  }
  m.style.display = "flex";
  googleHazirMi().then(hazir => {
    const b = m.querySelector('[data-act="pwaAuthGoogle"]');
    const not = document.getElementById("pwa-auth-google-not");
    if (!b) return;
    if (hazir === false) {
      b.setAttribute("disabled", "disabled");
      b.style.opacity = "0.45"; b.style.cursor = "not-allowed";
      if (not) {
        not.textContent = "Google ile giriş şu an kullanılamıyor. E-posta ve şifre ile giriş yapabilirsin.";
      }
    } else {
      b.removeAttribute("disabled"); b.style.opacity = ""; b.style.cursor = "pointer";
      if (not) not.textContent = "";
    }
  });
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
// ============================================================
// v42 — OKULİZYON İL / İLÇE / OKUL LİSTELERİ (SABİT DEĞİL)
// KULLANICI: "Okulizyon bilgileri de sabit olmasın. Şehir, ilçe ve okullar
// Okulizyon'daki gibi seçilebilsin. Direkt oradaki listeleri kopyala yapıştır."
// Kaynak: okulizyon-liste edge fonksiyonu (okulizyon.com'un kendi listeleri).
// Liste + KOD birlikte saklanır: sonraki çekimlerde isim tahmini kalmaz.
// ============================================================
const OKZ_LISTE_ANAHTAR = "am_okz_liste_v42";
let OKZ_LISTE = (function () {
  try { const t = JSON.parse(localStorage.getItem(OKZ_LISTE_ANAHTAR) || "{}"); return (t && typeof t === "object") ? t : {}; } catch (e) { return {}; }
})();
const okzListeKod = (mod, kod) => mod === "il" ? "il" : (mod === "ilce" ? "ilce:" + kod : "okul:" + kod);
// "Gaziantep" = "GAZIANTEP" = "Gazıantep" (Türkçe büyük/küçük + aksan farkı yok)
const okzNorm = (x) => String(x || "").toLocaleUpperCase("tr-TR")
  .replace(/İ/g, "I").replace(/Ş/g, "S").replace(/Ğ/g, "G").replace(/Ç/g, "C")
  .replace(/Ö/g, "O").replace(/Ü/g, "U").replace(/\s+/g, " ").trim();
const okzAyni = (a, b) => !!a && !!b && okzNorm(a) === okzNorm(b);
function okzListeYaz(k) {
  try { localStorage.setItem(OKZ_LISTE_ANAHTAR, JSON.stringify(OKZ_LISTE)); } catch (e) { /* */ }
}

// SEÇİM DURUMU — v43
// KULLANICI: "Okulizyon bilgileri sabit değil ama girişini bozmuşsun. Sadece
// şehir seçilebiliyor."
// KÖK NEDEN: seçimlerin hangi listeye ait olduğu DOM'daki data-okz-liste
// niteliğinden okunuyordu. İl değişince o nitelik ESKİ kodda kalıyor, bu
// yüzden ilçe listesi hiç dolmuyordu (yalnız il seçilebiliyordu).
// ÇÖZÜM: seçimler artık DOM'da değil, bu durum nesnesinde tutulur. Liste
// hangi kod için geldiyse o select doğrudan bu duruma göre çizilir.
let OKZ_SECIM = { il: { ad: "", kod: "" }, ilce: { ad: "", kod: "" }, okul: { ad: "", kod: "" } };
let OKZ_HATA = "";      // son liste hatası (arayüzde gösterilir)
let OKZ_SURUYOR = {};   // aynı listenin iki kez çekilmesini engeller

const okzRolKod = (rol) => rol === "il" ? "il" : (rol === "ilce" ? "ilce" : "okul");
function okzListeAnahtari(rol) {
  if (rol === "il") return "il";
  if (rol === "ilce") return OKZ_SECIM.il.kod ? "ilce:" + OKZ_SECIM.il.kod : "";
  return OKZ_SECIM.ilce.kod ? "okul:" + OKZ_SECIM.ilce.kod : "";
}

// ARAYÜZ — v44: YAZARAK ARAMA (Okulizyon'daki gibi)
// KULLANICI: "Bu sınıf il ilçe okul seçmede okulizyondaki gibi yazma da olsun,
// yani arama gibi."
// 765 okullu bir listede kaydırma çilesi bitiyor: harf yazdıkça süzülür.
// Gizli <input id="okz-X"> değeri korur (okzSaveBilgi aynı yerden okur).
function okzSecim(id, etiket, rol, seciliKod, seciliAd) {
  const ad = seciliAd || "";
  const kod = seciliKod || "";
  const anahtar = okzListeAnahtari(rol);
  const hazir = !!(anahtar && (OKZ_LISTE[anahtar] || []).length);
  const ipucu = rol === "il" ? "İl yaz (ör. Gazi)" : (rol === "ilce" ? "İlçe yaz (ör. Şahin)" : "Okul yaz (ör. 19 Mayıs)");
  const kapali = rol !== "il" && !anahtar ? " disabled" : "";
  return '<div class="okz-arama" data-okz-rol="' + rol + '" style="position:relative;">' +
    '<label style="font-size:11.5px;opacity:0.8;">' + etiket +
    '<input id="okz-' + id + '-arama" class="okz-arama-girdi" type="text" autocomplete="off" spellcheck="false" role="combobox" aria-autocomplete="list" aria-expanded="false"' +
    ' placeholder="' + (anahtar ? ipucu : (rol === "il" ? "Yükleniyor…" : "Önce il seç")) + '"' +
    (hazir || anahtar ? "" : kapali) +
    ' value="' + escHtml(ad) + '"' +
    ' style="width:100%;box-sizing:border-box;padding:9px 30px 9px 10px;border-radius:9px;border:1px solid rgba(0,0,0,0.18);background:var(--bg,#F6F8FC);color:inherit;font-size:13.5px;margin-top:3px;">' +
    '</label>' +
    '<span style="position:absolute;right:26px;top:26px;pointer-events:none;opacity:0.45;font-size:11px;">▾</span>' +
    '<input type="hidden" id="okz-' + id + '" value="' + escHtml(ad) + '" data-kod="' + escHtml(kod) + '">' +
    '<div class="okz-arama-liste" role="listbox" hidden style="position:fixed;z-index:9998;left:0;top:0;display:none;max-height:min(46vh,300px);overflow:auto;-webkit-overflow-scrolling:touch;background:var(--bg-elev,#fff);color:var(--text,#16213A);border:1px solid rgba(0,0,0,0.18);border-radius:11px;box-shadow:0 16px 40px rgba(0,0,0,0.22);"></div>' +
    '</div>';
}

// --- Yazarak arama davranışı (olaylar document üzerinden, tek dinleyici) ---
function okzAramaKok(el) { return el && el.closest ? el.closest(".okz-arama") : null; }
function okzAramaListe(kok) { return kok ? kok.querySelector(".okz-arama-liste") : null; }
function okzAramaGirdi(kok) { return kok ? kok.querySelector(".okz-arama-girdi") : null; }
function okzAramaGizli(kok) { return kok ? kok.querySelector('input[type="hidden"][id^="okz-"]') : null; }

function okzAramaCiz(kok, yazilan) {
  const rol = kok.dataset.okzRol;
  const kutu = okzAramaListe(kok);
  if (!kutu) return;
  const anahtar = okzListeAnahtari(rol);
  const hepsi = anahtar ? (OKZ_LISTE[anahtar] || []) : [];
  if (!hepsi.length) {
    kutu.innerHTML = '<div style="padding:10px 12px;font-size:12.5px;opacity:0.7;">' +
      (rol === "il" ? "Yükleniyor…" : (rol === "ilce" ? "Önce il seç" : "Önce ilçe seç")) + "</div>";
    okzAramaKonumla(kok); okzAramaGirdi(kok).setAttribute("aria-expanded", "true");
    return;
  }
  const q = okzNorm(yazilan || "");
  const secili = (OKZ_SECIM[rol] && OKZ_SECIM[rol].kod) || "";
  let suzulen = hepsi;
  if (q) {
    // Önce "başlıyor", sonra "içeriyor" — yazdıkça en olası üstte.
    const bas = [], ic = [];
    for (const x of hepsi) {
      const n = okzNorm(x.ad);
      if (n.startsWith(q)) bas.push(x);
      else if (n.indexOf(q) >= 0) ic.push(x);
    }
    suzulen = bas.concat(ic);
  }
  if (!suzulen.length) {
    kutu.innerHTML = '<div style="padding:10px 12px;font-size:12.5px;opacity:0.7;">Sonuç yok.</div>';
  } else {
    // v45c — KULLANICI: "EN İYİ, birkaç harf daha yaz gibi etiket olmasın,
    // aynı Okulizyon'daki gibi olsun."
    // Liste SADE: sadece adlar, tek satır, etiket yok, uyarı yok, sayaç yok.
    // En çok uyuşan yine en üstte — kullanıcı ilk satıra dokunur.
    const EN_FAZLA = 120;
    const parca = suzulen.slice(0, EN_FAZLA);
    kutu.innerHTML = parca.map(x =>
      '<div class="okz-arama-sec" role="option" data-kod="' + escHtml(x.kod) + '" data-ad="' + escHtml(x.ad) + '"' +
      ' style="padding:10px 12px;font-size:13.5px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;' +
      'background:' + (x.kod === secili ? "rgba(37,99,235,0.14)" : "transparent") + ';' +
      (x.kod === secili ? "font-weight:700;" : "") + '">' + escHtml(x.ad) + "</div>"
    ).join("");
    // Odaktan çıkışta "tek net aday" kuralı için hatırlanan bilgiler.
    kutu.dataset.enIyiKod = parca.length ? parca[0].kod : "";
    kutu.dataset.enIyiAd = parca.length ? parca[0].ad : "";
    kutu.dataset.adet = String(suzulen.length);
    kutu.dataset.sorgu = String(yazilan || "");
  }
  okzAramaKonumla(kok);
  okzAramaGirdi(kok).setAttribute("aria-expanded", "true");
}

// v45 — KONUMLANDIRMA: profil penceresi kaydırılabilir; position:absolute ile
// açılan liste altta KIRPILIYORDU (765 okullu listede tam bir çile).
// Kutu artık gövdeye göre FIXED konumlanır: hiçbir kaydırma kabı onu kesmez.
// Yer yoksa YUKARI açılır.
function okzAramaKonumla(kok) {
  const kutu = okzAramaListe(kok);
  const g = okzAramaGirdi(kok);
  if (!kutu || !g) return;
  const r = g.getBoundingClientRect();
  const boslukAlt = window.innerHeight - r.bottom;
  const yukari = boslukAlt < 220 && r.top > boslukAlt;
  const yukseklik = Math.min(300, Math.max(160, (yukari ? r.top : boslukAlt) - 16));
  kutu.style.display = "block";
  kutu.style.width = Math.max(180, Math.round(r.width)) + "px";
  kutu.style.left = Math.round(Math.min(r.left, window.innerWidth - Math.max(180, r.width) - 8)) + "px";
  kutu.style.maxHeight = yukseklik + "px";
  if (yukari) {
    kutu.style.top = "auto";
    kutu.style.bottom = Math.round(window.innerHeight - r.top + 4) + "px";
  } else {
    kutu.style.bottom = "auto";
    kutu.style.top = Math.round(r.bottom + 4) + "px";
  }
}
function okzAramaGizle(kutu) {
  if (!kutu) return;
  kutu.style.display = "none";
}
// Profil kaydırılınca/pencere boyutu değişince liste yerinde kalsın.
function okzAramaKonumlariTazele() {
  document.querySelectorAll(".okz-arama").forEach(kok => {
    const kutu = okzAramaListe(kok);
    if (kutu && kutu.style.display === "block") okzAramaKonumla(kok);
  });
}
window.addEventListener("scroll", okzAramaKonumlariTazele, true);
window.addEventListener("resize", okzAramaKonumlariTazele);
function okzAramaKapat(kok) {
  const kutu = okzAramaListe(kok);
  okzAramaGizle(kutu);
  const g = okzAramaGirdi(kok);
  if (g) { g.setAttribute("aria-expanded", "false"); const sec = OKZ_SECIM[kok.dataset.okzRol]; if (sec && sec.ad) g.value = sec.ad; }
}
function okzAramaSec(kok, ad, kod) {
  const rol = kok.dataset.okzRol;
  const gizli = okzAramaGizli(kok);
  if (gizli) { gizli.value = ad; gizli.dataset.kod = kod; }
  const g = okzAramaGirdi(kok); if (g) g.value = ad;
  OKZ_SECIM[rol] = { ad: ad, kod: kod };
  okzAramaKapat(kok);
  if (rol === "il") {
    OKZ_SECIM.ilce = { ad: "", kod: "" };
    OKZ_SECIM.okul = { ad: "", kod: "" };
    okzAramaAltSifirla("ilce", "Önce il seç");
    okzAramaAltSifirla("okul", "Önce ilçe seç");
    if (kod) okzListeTazele("ilce");
  } else if (rol === "ilce") {
    OKZ_SECIM.okul = { ad: "", kod: "" };
    okzAramaAltSifirla("okul", "Önce ilçe seç");
    if (kod) okzListeTazele("okul");
  }
}
function okzAramaAltSifirla(rol, ipucu) {
  const kok = document.querySelector('.okz-arama[data-okz-rol="' + rol + '"]');
  if (!kok) return;
  const g = okzAramaGirdi(kok); if (g) { g.value = ""; g.placeholder = ipucu; g.disabled = false; }
  const h = okzAramaGizli(kok); if (h) { h.value = ""; h.dataset.kod = ""; }
  const kutu = okzAramaListe(kok); okzAramaGizle(kutu);
}

document.addEventListener("focusin", (e) => {
  const kok = okzAramaKok(e.target);
  if (!kok || !e.target.classList.contains("okz-arama-girdi")) return;
  okzAramaCiz(kok, "");
  const g = okzAramaGirdi(kok); if (g) g.select();
});
document.addEventListener("input", (e) => {
  const kok = okzAramaKok(e.target);
  if (!kok || !e.target.classList.contains("okz-arama-girdi")) return;
  okzAramaCiz(kok, e.target.value);
});
function okzAramaTiklandi(e) {
  const sec = e.target.closest && e.target.closest(".okz-arama-sec");
  if (!sec) return false;
  e.preventDefault();
  const kok = okzAramaKok(sec);
  if (kok) okzAramaSec(kok, sec.dataset.ad || "", sec.dataset.kod || "");
  return true;
}
// Hem fare hem dokunma: mobilde mousedown gecikebilir/düşebilir.
document.addEventListener("pointerdown", okzAramaTiklandi);
document.addEventListener("mousedown", (e) => { if (!e.__okzIslendi) okzAramaTiklandi(e); });

// v44b — ODAKTAN ÇIKINCA EN İYİ EŞLEŞMEYİ SEÇ
// Kullanıcı "gazi" yazıp listeden dokunmayı unutursa alan boş kalmasın.
// Kural: yazdığıyla BAŞLAYAN tek sonuç varsa o seçilir; birden çok aday
// varsa hiçbir şey zorla seçilmez (yanlış okula giriş riski yok).
document.addEventListener("focusout", (e) => {
  const kok = okzAramaKok(e.target);
  if (!kok || !e.target.classList.contains("okz-arama-girdi")) return;
  const rol = kok.dataset.okzRol;
  const yazilan = String(e.target.value || "").trim();
  const seciliKod = (OKZ_SECIM[rol] && OKZ_SECIM[rol].kod) || "";
  setTimeout(() => {
    const kutu = okzAramaListe(kok);
    if (!kutu) return;
    // Kullanıcı listeden bir şeye dokunduysa okzAramaSec zaten çalıştı.
    if ((OKZ_SECIM[rol] && OKZ_SECIM[rol].kod) !== seciliKod) { okzAramaGizle(kutu); return; }
    const enIyiKod = kutu.dataset.enIyiKod || "";
    const enIyiAd = kutu.dataset.enIyiAd || "";
    const adet = Number(kutu.dataset.adet || 0);
    if (!yazilan || !enIyiKod || !enIyiAd) { okzAramaGizle(kutu); return; }
    const q = okzNorm(yazilan);
    const anahtar = okzListeAnahtari(rol);
    const hepsi = anahtar ? (OKZ_LISTE[anahtar] || []) : [];
    const baslayanlar = hepsi.filter(x => okzNorm(x.ad).startsWith(q));
    if (baslayanlar.length === 1) {
      // Tek ve net aday: kendiliğinden seç.
      okzAramaSec(kok, baslayanlar[0].ad, baslayanlar[0].kod);
      return;
    }
    if (adet === 1) { okzAramaSec(kok, enIyiAd, enIyiKod); return; }
    // Belirsiz: yazılanı geri al, kayıtlı seçime dön (yanlış seçim yapma).
    const sec = OKZ_SECIM[rol];
    e.target.value = sec && sec.ad ? sec.ad : "";
    okzAramaGizle(kutu);
  }, 180);
});
document.addEventListener("keydown", (e) => {
  const kok = okzAramaKok(e.target);
  if (!kok || !e.target.classList.contains("okz-arama-girdi")) return;
  const kutu = okzAramaListe(kok);
  if (e.key === "Escape") { okzAramaKapat(kok); return; }
  if (!kutu || kutu.style.display !== "block") { if (e.key === "ArrowDown") okzAramaCiz(kok, e.target.value); return; }
  const secenekler = Array.from(kutu.querySelectorAll(".okz-arama-sec"));
  if (!secenekler.length) return;
  let i = secenekler.findIndex(x => x.dataset.aktif === "1");
  if (e.key === "ArrowDown") { e.preventDefault(); i = Math.min(secenekler.length - 1, i + 1); }
  else if (e.key === "ArrowUp") { e.preventDefault(); i = Math.max(0, i - 1); }
  else if (e.key === "Enter") {
    e.preventDefault();
    const hedef = secenekler[i < 0 ? 0 : i];
    if (hedef) okzAramaSec(kok, hedef.dataset.ad || "", hedef.dataset.kod || "");
    return;
  } else return;
  secenekler.forEach((x, j) => {
    x.dataset.aktif = j === i ? "1" : "0";
    x.style.background = j === i ? "rgba(37,99,235,0.18)" : (x.dataset.kod === (OKZ_SECIM[kok.dataset.okzRol] || {}).kod ? "rgba(37,99,235,0.14)" : "transparent");
  });
  if (secenekler[i] && secenekler[i].scrollIntoView) secenekler[i].scrollIntoView({ block: "nearest" });
});
document.addEventListener("click", (e) => {
  if (okzAramaKok(e.target)) return;
  document.querySelectorAll(".okz-arama").forEach(okzAramaKapat);
});

// Liste çek: rol + kod. Başarılıysa önbelleğe yazılır ve arayüz tazelenir.
function okzListeTazele(rol, zorla) {
  const anahtar = okzListeAnahtari(rol);
  if (!anahtar) return Promise.resolve([]);
  if (!zorla && (OKZ_LISTE[anahtar] || []).length) { okzSecimleriDoldur(); return Promise.resolve(OKZ_LISTE[anahtar]); }
  if (OKZ_SURUYOR[anahtar]) return OKZ_SURUYOR[anahtar];
  const cfg = (typeof SUPABASE_CONFIG !== "undefined" && SUPABASE_CONFIG) ? SUPABASE_CONFIG : null;
  if (!cfg || !cfg.url) { OKZ_HATA = "Sunucu ayarı bulunamadı."; okzHataYaz(); return Promise.resolve([]); }
  const mod = rol === "okul" ? "okul" : rol;
  const kod = rol === "il" ? "" : (rol === "ilce" ? OKZ_SECIM.il.kod : OKZ_SECIM.ilce.kod);
  let url = cfg.url + "/functions/v1/okulizyon-liste?mod=" + encodeURIComponent(mod);
  if (mod === "ilce") url += "&ilkodu=" + encodeURIComponent(kod);
  if (mod === "okul") url += "&ilcekodu=" + encodeURIComponent(kod);
  if (zorla) url += "&zorla=1";
  OKZ_HATA = "";
  okzHataYaz();
  OKZ_SURUYOR[anahtar] = fetch(url, { headers: { apikey: cfg.anonKey } })
    .then(r => r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status)))
    .then(c => {
      const liste = c && Array.isArray(c.liste) ? c.liste.filter(x => x && x.ad && x.kod) : [];
      if (!liste.length) throw new Error("boş liste");
      OKZ_LISTE[anahtar] = liste;
      okzListeYaz(anahtar);
      return liste;
    })
    .catch(e => {
      OKZ_HATA = (rol === "il" ? "İl" : rol === "ilce" ? "İlçe" : "Okul") + " listesi yüklenemedi (" + String((e && e.message) || e) + "). İnterneti kontrol edip “Listeyi yenile”ye bas.";
      return [];
    })
    .then(l => { delete OKZ_SURUYOR[anahtar]; okzSecimleriDoldur(); okzHataYaz(); return l; });
  return OKZ_SURUYOR[anahtar];
}

// Liste sunucudan gelince AÇIK aramaları tazele (seçim durumdan okunur).
function okzSecimleriDoldur() {
  document.querySelectorAll(".okz-arama").forEach(kok => {
    const rol = kok.dataset.okzRol;
    const anahtar = okzListeAnahtari(rol);
    const liste = anahtar ? (OKZ_LISTE[anahtar] || []) : [];
    const g = okzAramaGirdi(kok);
    if (g) {
      g.disabled = !anahtar || !liste.length;
      if (anahtar && liste.length) {
        g.placeholder = rol === "il" ? "İl yaz (ör. Gazi)" : (rol === "ilce" ? "İlçe yaz (ör. Şahin)" : "Okul yaz (ör. 19 Mayıs)");
      }
    }
    const sec = OKZ_SECIM[rol] || { ad: "", kod: "" };
    const h = okzAramaGizli(kok);
    if (h && sec.ad) { h.value = sec.ad; h.dataset.kod = sec.kod || ""; if (g && document.activeElement !== g) g.value = sec.ad; }
    const kutu = okzAramaListe(kok);
    if (kutu && kutu.style.display === "block") okzAramaCiz(kok, (g && document.activeElement === g) ? g.value : "");
  });
}

function okzHataYaz() {
  const k = document.getElementById("okz-liste-hata");
  if (!k) return;
  k.textContent = OKZ_HATA || "";
  k.style.display = OKZ_HATA ? "block" : "none";
}
// Profil açıldığında kayıtlı seçimleri duruma yükle
function okzSecimYukle(s) {
  OKZ_SECIM = {
    il: { ad: (s && s.il) || "", kod: (s && s.ilkodu) || "" },
    ilce: { ad: (s && s.ilce) || "", kod: (s && s.ilcekodu) || "" },
    okul: { ad: (s && s.okulAdi) || "", kod: (s && s.kurumkodu) || "" }
  };
  OKZ_HATA = "";
  okzListeTazele("il");
  if (OKZ_SECIM.il.kod) okzListeTazele("ilce");
  if (OKZ_SECIM.ilce.kod) okzListeTazele("okul");
}

function renderProfileModal() {
  const m = document.getElementById("pwa-profile-modal");
  if (!m) return;
  if (!state.settings) state.settings = {};
  const s = state.settings.okulizyon ? state.settings.okulizyon : (state.settings.okulizyon = {});
  const st = okzStore();
  const bekleyen = st.pending.reduce((acc, ex) => acc + (ex.rows || []).length, 0);
  const hesapSatiri = currentUser
    ? '<div style="display:flex;align-items:center;gap:10px;"><div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#1D4ED8,#38BDF8);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;">' + escHtml(profilAvatarHarfleri()) + '</div><div style="min-width:0;"><div style="font-weight:700;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escHtml(currentUser.email || "hesap") + '</div><div style="font-size:11.5px;color:#16A34A;font-weight:600;">☁ Bulut yedeği açık</div></div></div>'
    : '<div style="font-size:12.5px;opacity:0.8;">Giriş yapılmadı — veriler yalnız bu cihazda saklanıyor.</div>';

  const inp = (k, label, ph) => '<label style="font-size:11.5px;opacity:0.8;">' + label + '<input id="okz-' + k + '" value="' + escHtml(s[k] || "") + '" placeholder="' + ph + '" autocapitalize="characters" style="width:100%;box-sizing:border-box;padding:9px 10px;border-radius:9px;border:1px solid rgba(0,0,0,0.18);background:var(--bg,#F6F8FC);color:inherit;font-size:13.5px;margin-top:3px;' + (k === "ad" ? "text-transform:uppercase;font-weight:600;" : "") + '"></label>';
  const sel = (k, label, opts) => '<label style="font-size:11.5px;opacity:0.8;">' + label + '<select id="okz-' + k + '" style="width:100%;box-sizing:border-box;padding:9px 10px;border-radius:9px;border:1px solid rgba(0,0,0,0.18);background:var(--bg,#F6F8FC);color:inherit;font-size:13.5px;margin-top:3px;">' + opts.map(o => '<option' + ((s[k] || opts[0]) === o ? " selected" : "") + '>' + escHtml(o) + "</option>").join("") + "</select></label>";

  let html = '<div style="width:100%;max-width:520px;max-height:88vh;overflow:auto;background:var(--bg-elev,#fff);color:var(--text,#16213A);border-radius:18px;padding:20px;box-shadow:0 24px 60px rgba(0,0,0,0.35);">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><div style="font-weight:800;font-size:18px;">👤 Profil</div><button data-act="pwaProfileClose" style="background:none;border:0;font-size:20px;cursor:pointer;color:inherit;min-width:36px;min-height:36px;">✕</button></div>';

  // A) HESAP
  html += '<div style="border:1px solid rgba(0,0,0,0.12);border-radius:14px;padding:12px;margin-bottom:14px;">';
  html += '<div style="font-size:11px;font-weight:800;letter-spacing:0.06em;opacity:0.6;margin-bottom:8px;">HESAP</div>';
  html += hesapSatiri;
  html += '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">';
  html += currentUser
    ? '<button data-act="pwaAuth" class="btn btn-ghost btn-sm" style="border:1px solid rgba(0,0,0,0.15);">Çıkış Yap</button><button data-act="syncNow" class="btn btn-ghost btn-sm" style="border:1px solid rgba(0,0,0,0.15);">Şimdi Yedekle</button>'
    : '<button data-act="pwaAuth" class="btn btn-primary btn-sm">Giriş Yap / Kayıt Ol</button>';
  html += '</div>';
  html += '<div style="font-size:11px;opacity:0.65;margin-top:8px;">Giriş yapınca verilerin cihazların arasında eşitlenir.</div>';
  html += '</div>';

  // B) OKULIZYON
  html += '<div style="border:1px solid rgba(0,0,0,0.12);border-radius:14px;padding:12px;margin-bottom:14px;">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;"><div style="font-size:11px;font-weight:800;letter-spacing:0.06em;opacity:0.6;">OKULIZYON BAĞLANTISI</div>' + (bekleyen > 0 ? '<span style="font-size:11px;font-weight:700;color:#E11D48;">' + bekleyen + ' soru bekliyor</span>' : '') + '</div>';
  html += '<div style="font-size:11.5px;opacity:0.72;margin-bottom:10px;">Okulizyon\'daki bilgilerini bir kez gir; sınav sonuçların her sabah otomatik çekilir.</div>';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">';
  html += inp("ad", "AD SOYAD (BÜYÜK HARF)", "AHMET YILMAZ");
  html += inp("okulNo", "OKUL NO", "1234");
  html += sel("sinif", "SINIF", ["9", "10", "11", "12"]);
  // v42 — KULLANICI: "Okulizyon bilgileri de sabit olmasın. Şehir, ilçe ve
  // okullar Okulizyon'daki gibi seçilebilsin. Direkt oradaki listeleri
  // kopyala yapıştır." Listeler artık okulizyon-liste edge fonksiyonundan
  // GERÇEK okulizyon.com listeleri olarak gelir (il → ilçe → okul zinciri).
  html += okzSecim("il", "İL", "il", s.ilkodu || "", s.il || "");
  html += okzSecim("ilce", "İLÇE", "ilce", s.ilcekodu || "", s.ilce || "");
  html += okzSecim("okulAdi", "OKUL", "okul", s.kurumkodu || "", s.okulAdi || "");
  html += '<div id="okz-liste-hata" style="display:none;grid-column:1 / -1;font-size:11.5px;line-height:1.45;color:#B45309;"></div>';
  html += '<div style="grid-column:1 / -1;"><button data-act="okzListeYenile" style="background:none;border:0;padding:0;font-size:11.5px;text-decoration:underline;color:#2563EB;cursor:pointer;">Listeyi yenile</button></div>';
  html += '<label style="font-size:11.5px;opacity:0.8;grid-column:1 / -1;">OKULİZYON ŞİFRESİ (yalnız gerekiyorsa)<input id="okz-sifre" type="password" autocomplete="off" value="' + escHtml(s.sifre || "") + '" placeholder="Okulizyon şifresi" style="width:100%;box-sizing:border-box;padding:9px 10px;border-radius:9px;border:1px solid rgba(0,0,0,0.18);background:var(--bg,#F6F8FC);color:inherit;font-size:13.5px;margin-top:3px;"></label>';
  html += '</div>';
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  html += '<button data-act="okzSaveBilgi" class="btn btn-primary btn-sm">Bilgileri Kaydet</button>';
  html += '<button data-act="okzSimdiCek" class="btn btn-ghost btn-sm" style="border:1px solid rgba(0,0,0,0.15);">Şimdi dene</button>';
  html += '<button data-act="pwaOkz" class="btn btn-ghost btn-sm" style="border:1px solid rgba(0,0,0,0.15);">Analiz Bekliyor' + (bekleyen > 0 ? " (" + bekleyen + ")" : "") + '</button>';
  html += '</div>';
  // Çekim durumu: sessiz başarısızlık yerine açık bilgi
  const OKZ_AMBER = ["giris-yok", "bos", "sifre-gerekli", "bilgi-yok", "eslesme-yok", "bekliyor"];
  const durumRenk = !st.durum ? "#6B7280" : (st.durum.kod === "ok" ? "#16A34A" : (OKZ_AMBER.indexOf(st.durum.kod) >= 0 ? "#B45309" : "#E11D48"));
  html += '<div style="margin-top:9px;font-size:11.5px;line-height:1.45;color:' + durumRenk + ';">'
       + '<b>Son çekim:</b> '
       + (st.durum ? escHtml(okzZaman(st.durum.zaman)) + " — " + escHtml(st.durum.mesaj) : "henüz denenmedi")
       + (st.sonCekim ? '<br><span style="opacity:0.75;">Son otomatik çekim: ' + escHtml(okzZaman(Date.parse(st.sonCekim) || 0)) + '</span>' : "")
       + '</div>';
  if (st.duyurular && st.duyurular.length) {
    html += '<div style="margin-top:12px;font-size:11px;font-weight:800;letter-spacing:0.06em;opacity:0.6;">OKUL DUYURULARI</div>';
    st.duyurular.slice(0, 4).forEach(d => {
      html += '<a href="' + escHtml(d.url || "#") + '" target="_blank" rel="noopener" style="display:flex;justify-content:space-between;gap:8px;font-size:12px;padding:6px 0;border-top:1px solid rgba(0,0,0,0.07);text-decoration:none;color:inherit;"><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escHtml(d.baslik || "") + '</span><span style="opacity:0.6;white-space:nowrap;">' + escHtml(d.tarih || "") + '</span></a>';
    });
  }
  html += '</div>';

  // B2) OKULİZYON KONU EŞLEMESİ (kazanım → konu başlığı)
  // Tek bir bölüm hatası Profil penceresini bozmasın
  try { html += okzKonuEslemeHtml(); } catch (e) { console.warn("Konu eşlemesi bölümü basılamadı:", e); }
  if (!OKZK_IDX) okzkYukle().then(() => {
    const pm = document.getElementById("pwa-profile-modal");
    if (pm && pm.style.display === "flex") renderProfileModal();
  });

  // v41 — KULLANICI: "Uygulamada öğrenciyi ilgilendirmeyen yazıları sil.
  // Mesela teknik yazılar vb. Bildirim çalıştığına göre test bildirimi, cihaz
  // bildirimi vb kaldır."
  // Buradaki "Soru havuzu / Sürüm / Bulut" teknik kutusu ve dört tanılama
  // düğmesi (test bildirimi gönder, bu cihazda dene, realtime kanalı yenile,
  // yeniden kontrol) KALDIRILDI. Yerine tek cümlelik, öğrenciye yönelik
  // bildirim durumu kaldı.
  html += '<div style="border:1px solid rgba(0,0,0,0.10);border-radius:14px;padding:12px;font-size:12px;line-height:1.6;">';
  html += '<b>Bildirimler</b><div id="pwa-push-durum" style="margin-top:6px;">kontrol ediliyor…</div>';
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">';
  html += '<button data-act="amBildirimOnar" style="background:none;border:1px solid rgba(0,0,0,0.15);border-radius:8px;padding:6px 10px;font-size:12px;color:inherit;cursor:pointer;">Bağlantıyı yenile</button>';
  // v55 — tek dokunuş: bildirimi gösterir ve GERÇEKTEN göründü mü diye ölçer.
  html += '<button data-act="amKanalTesti" style="background:none;border:1px solid rgba(0,0,0,0.15);border-radius:8px;padding:6px 10px;font-size:12px;color:inherit;cursor:pointer;">Bildirim kanalını test et</button>';
  html += '</div>';
  html += '</div>';

  html += '</div>';
  m.innerHTML = html;
  pushTeshisYaz();
  // v43 — listeler önbellekten hemen çizilir, eksik olanlar arka planda çekilir.
  okzSecimYukle(s);
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
// Google girişi Supabase'de açık mı? (kapalıysa düğme ham hata yerine ne yapılacağını söyler)
async function googleHazirMi() {
  try {
    const y = await fetch(SUPABASE_CONFIG.url + "/auth/v1/settings", { headers: { apikey: SUPABASE_CONFIG.anonKey } });
    const j = await y.json();
    return !!(j && j.external && j.external.google === true);
  } catch (e) { return null; }
}
async function googleLogin() {
  if (!cloudReady() || !sb) return cfgMissing();
  const { error } = await sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: location.origin + location.pathname, queryParams: { prompt: "select_account" } }
  });
  if (error) {
    const ham = String((error && (error.message || error.error_description || error.code)) || "");
    authMsgYaz(/provider is not enabled/i.test(ham)
      ? "Google ile giriş şu an kullanılamıyor. E-posta ve şifre ile giriş yapabilirsin."
      : authMsg(error), true);
  }
}
async function doSignOut() {
  if (!sb) return;
  // v51 — KULLANICI: "Çıkış yapınca hâlâ bilgiler kalıyor; normal
  // uygulamalarda çıkış yapınca bilgi kalmıyor."
  // 1) Son hâli buluta yazmayı dene: çıkış veri kaybına dönüşmesin.
  try { await bulutaYaz(true); } catch (e) { /* çevrimdışı: sonraki girişte birleşir */ }
  const { error } = await sb.auth.signOut();
  if (error) return toast(authMsg(error), "error");
  currentUser = null;
  window.currentUser = null;
  window.__bulutYuklenenKullanici = null;
  // 2) Bu cihazdaki kişisel kayıtları sil (denemeler, hafıza, bekleyen
  //    Okulizyon soruları, Okulizyon adı/şifresi...).
  try { if (typeof window.__cikisYerelTemizle === "function") window.__cikisYerelTemizle(); } catch (e) { console.warn("Yerel temizlik:", e); }
  setAuthLabel(false);
  toast("Çıkış yapıldı. Bu cihazdaki kayıtlar silindi — tekrar giriş yapınca geri gelir.", "success");
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
  // v54 — tablette uygulama arka plandan dönünce abonelik tazelensin
  // (endpoint değişmişse sunucudaki kayıt eskiyordu).
  window.addEventListener("focus", function () {
    try { if (window.AmPush && window.AmPush.otomatik) window.AmPush.otomatik(); } catch (e) { /* */ }
  });
  // Eski sürümlerden gelen (Firebase) oturum kalıntılarını temizle
  try { Object.keys(localStorage).filter(k => k.indexOf("firebase:") === 0 || k.indexOf("__firebase") === 0).forEach(k => localStorage.removeItem(k)); } catch (e) {}
  sb.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") sifreYenileAkisi();
    if (event === "SIGNED_OUT" || !session) {
      currentUser = null;
      window.currentUser = null;
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
  window.currentUser = user;
  // Bildirim izni daha önce verilmişse aboneliği tazele (sessiz)
  setTimeout(function () { try { if (window.AmPush && window.AmPush.otomatik) window.AmPush.otomatik(); } catch (e) {} }, 1500);
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
      // v44 — uzak kaydın zamanı: kendi yazdığımızdan yeni ise üzerine yazmayız.
      sonUzakYazma = bulutZaman(data.updated_at);
      const uzakState = typeof data.state === "string" ? JSON.parse(data.state) : data.state;
      const yerelBos = !state.exams.length && !state.questions.length && !Object.keys(state.topics).length;
      const nEx = (uzakState.exams || []).length;
      const nQ = (uzakState.questions || []).length;
      const tarih = data.updated_at ? new Date(data.updated_at).toLocaleDateString("tr-TR") : "bilinmeyen tarih";
      if (!yerelBos) {
        // SORU SORMA YOK: iki tarafı birleştir, hiçbir kayıt kaybolmaz.
        // (Eski davranış her girişte "üzerine yazılsın mı?" diye soruyordu.)
        const birlestirici = (window.VB && typeof window.VB.birlestir === "function") ? window.VB : null;
        const onceki = birlestirici ? birlestirici.ozet(state) : { deneme: 0, hata: 0 };
        if (birlestirici) {
          state = birlestirici.birlestir(state, uzakState);
        } else {
          // VB yüklenmemişse en azından bulutu kaybetme: yerel dolu olan
          // alanları koruyarak birleştir (mergeDeep derin birleştirir).
          state = mergeDeep(mergeDeep(freshState(), uzakState), state);
        }
        state.user.grade = state.user.grade || (uzakState.user && uzakState.user.grade) || "9";
        // v36 — Buluttan gelen 5,8 MB'lık kayıt (tek konuda 7.680 mükerrer hata
        // kaydı) sıkıştırılmadan yazılırsa localStorage kotası dolar ve her
        // kayıtta "depolama dolu" uyarısı çıkar. Birleştirmeden hemen sonra sıkıştır.
        try { if (window.VeriSikistir && window.VeriSikistir.sikistir) window.VeriSikistir.sikistir(state); } catch (e) { /* */ }
        saveState();
        navigate(currentPage);
        if (typeof updateUserUI === "function") updateUserUI();
        const sonra = birlestirici ? birlestirici.ozet(state) : { deneme: nEx, hata: 0 };
        const fark = sonra.deneme - onceki.deneme;
        toast("☁ Bulutla birleştirildi · " + sonra.deneme + " deneme, " + sonra.hata + " hata kaydı" +
          (fark > 0 ? " (+" + fark + " buluttan)" : "") + " — hiçbir veri silinmedi.", "success");
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

// ---- 6) TEK YAZICI: cihaz önbelleği + hesaptaki tek kopya (v44) ----
// KULLANICI: "Bilgiler hem localStorage hem bulut hem Supabase'de depolanınca
// karmaşıklık oluyor. Güncel uygulamalar nasıl yapıyorsa öyle yap."
//
// DURUM (eski): saveState → 4 sn debounce; ayrıca "online" olayında ayrı bir
// zamanlayıcı; ayrıca elle "Şimdi Yedekle" → AYNI anda 2-3 yazma uçuşuyor,
// eskisi yeniyi ezip geçebiliyordu. Üstüne giriş yapınca birleştirme başka bir
// yerde tekrar yazıyordu.
//
// YENİ (güncel uygulama deseni — "yerel önbellek + tek uzak kopya"):
//   • Tek yazıcı: aynı anda EN FAZLA bir yazma uçuşur (single-flight).
//   • Kısa debounce + son hâli yaz: uçuş sırasında yeni değişiklik olursa
//     bitince BİR kez daha yazılır (kuyruk birleşir, istek çoğalmaz).
//   • Sürüm damgası: yazdığımız anı saklarız; bizden daha yeni bir uzak kayıt
//     varsa üzerine YAZMAYIZ (bayat sekme veri ezmez), birleştiririz.
//   • Çevrimdışıysa yazma beklemez: cihazda durur, bağlantı gelince gider.
let yazmaUcusu = null;      // süren yazma
let yazmaBekliyor = false;  // uçuş sırasında yeni değişiklik oldu
let yazmaZamanlayici = null;
let sonYerelDegisim = 0;    // bu cihazdaki son değişiklik (ms)
let sonUzakYazma = 0;       // sunucudaki updated_at (ms)

function bulutZaman(iso) { const t = iso ? Date.parse(iso) : NaN; return isNaN(t) ? 0 : t; }

async function bulutaYaz(sessiz) {
  if (!sb || !currentUser) return { ok: false, neden: "oturum yok" };
  if (typeof state === "undefined") return { ok: false, neden: "durum yok" };
  if (yazmaUcusu) { yazmaBekliyor = true; return yazmaUcusu; }
  yazmaUcusu = (async () => {
    try {
      const { error } = await sb.from("app_states").upsert({
        user_id: currentUser.id,
        state: state,
        grade: (state.user && state.user.grade) || null,
        deneme_sayisi: (state.exams || []).length,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });
      if (error) throw error;
      sonUzakYazma = Date.now();
      setAuthLabel(true, (currentUser.email || "").split("@")[0] || "hesap");
      const rozet = document.getElementById("pwa-auth-label");
      if (rozet && rozet.textContent.indexOf("✓ bulutta") === -1) rozet.textContent += " · ✓ bulutta";
      return { ok: true };
    } catch (e) {
      if (!sessiz) console.warn("Bulut yazımı başarısız (çevrimdışı?):", e);
      return { ok: false, neden: String(e && e.message || e) };
    } finally {
      yazmaUcusu = null;
      if (yazmaBekliyor) { yazmaBekliyor = false; setTimeout(() => bulutaYaz(true), 300); }
    }
  })();
  return yazmaUcusu;
}

function yazmaPlanla(gecikme) {
  if (!currentUser || !sb) return;
  sonYerelDegisim = Date.now();
  clearTimeout(yazmaZamanlayici);
  yazmaZamanlayici = setTimeout(() => { bulutaYaz(true); }, gecikme == null ? 1500 : gecikme);
}

function hookSaveState() {
  if (window.__saveHooked) return;
  window.__saveHooked = true;
  const orijinal = window.saveState;
  if (typeof orijinal !== "function") return;
  window.__supabaseSenkronizeEt = () => bulutaYaz(false);
  window.saveState = function () {
    const sonuc = orijinal.apply(this, arguments);
    yazmaPlanla(1500);
    return sonuc;
  };
  // Çevrimdışıyken biriken değişiklik: bağlantı gelince TEK yazma.
  window.addEventListener("online", () => yazmaPlanla(800));
  // Sekme kapanırken kaybolmasın (mobil tarayıcı arka plana atınca).
  window.addEventListener("pagehide", () => { if (currentUser && sb && sonYerelDegisim > sonUzakYazma) bulutaYaz(true); });
}

// Eski sürümlerden kalan, artık HİÇBİR işe yaramayan anahtarları temizle.
// (Açılış kapısı kaldırıldı, test işareti cihaz+uç noktaya taşındı.)
function eskiAnahtarlariTemizle() {
  try {
    const olu = ["am_giris_yapildi"]; // açılış kapısı kaldırıldı: işaret artık ölü
    olu.forEach(k => localStorage.removeItem(k));
    Object.keys(localStorage).forEach(k => {
      // v60 — KÖK NEDEN: burada "am_push_test_gonderildi*" anahtarları da
      // siliniyordu. O anahtar "bu cihaza test bildirimi zaten gönderildi"
      // işaretidir; her açılışta silindiği için koruma her seferinde sıfırlanıp
      // HER UYGULAMA AÇILIŞINDA yeni bir test push'u atılıyordu (kullanıcı:
      // "Uygulamaya her girildiğinde test bildirimi geliyor"). Artık YALNIZ
      // gerçekten ölü olan Firebase anahtarları temizlenir.
      if (k.indexOf("firebase:") === 0 || k.indexOf("__firebase") === 0) localStorage.removeItem(k);
    });
  } catch (e) { /* */ }
}

// ---- 6b) REALTIME BİLDİRİM KANALI (v40) ----
// KULLANICI: "Realtime niye kullanmıyorsun."
// Neden Realtime: Web Push (VAPID) kanalı cihaz tarafında sessizce
// düşebiliyor (pil tasarrufu, kanal ayarı, ölü abonelik). Realtime ise
// doğrudan veritabanı satırıyla çalışır: satır yazıldığı ANDA uygulamaya
// düşer, push servisinin davranışına bağlı değildir.
// Akış: edge fonksiyonu → bildirim_log (trigger) → bildirimler tablosu
//       → supabase.channel(postgres_changes) → bildirim + sistem bildirimi.
let bildirimKanal = null;
function bildirimKanaliniKur() {
  if (!sb || !currentUser || bildirimKanal) return;
  try {
    bildirimKanal = sb.channel("am-bildirim-" + currentUser.id)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "bildirimler", filter: "user_id=eq." + currentUser.id },
        (p) => { try { realtimeBildirim(p.new); } catch (e) { console.warn("realtime:", e); } })
      .subscribe((durum) => {
        if (durum === "SUBSCRIBED") {
          window.__amRealtimeBildirim = true;
          bildirimleriGetir();
        }
      });
  } catch (e) { console.warn("realtime kanalı kurulamadı:", e); }
}
async function bildirimleriGetir() {
  if (!sb || !currentUser) return;
  try {
    const { data } = await sb.from("bildirimler").select("*")
      .eq("user_id", currentUser.id).eq("okundu", false)
      .order("created_at", { ascending: false }).limit(5);
    (data || []).forEach((r) => { try { realtimeBildirim(r, true); } catch (e) { } });
  } catch (e) { /* tablo yoksa sessiz */ }
}
// Gelen bildirimi HEM uygulama içi listeye HEM sistem bildirimine yaz.
function realtimeBildirim(r, sessizSistem) {
  if (!r || !r.baslik) return;
  const imza = "am_bildirim_" + r.id;
  try { if (localStorage.getItem(imza)) return; localStorage.setItem(imza, "1"); } catch (e) { }
  if (typeof addNotification === "function") {
    addNotification({ title: r.baslik, body: r.metin || "", kind: "info", topicKey: "rt@" + r.id });
  }
  if (typeof toast === "function") toast(r.baslik + (r.metin ? " — " + r.metin : ""), "info");
  if (sessizSistem) return;
  // Sistem bildirimi: push'a bağlı değil, doğrudan servis çalışanından.
  try {
    if ("serviceWorker" in navigator && typeof Notification !== "undefined" && Notification.permission === "granted") {
      navigator.serviceWorker.ready.then((kayit) =>
        kayit.showNotification(r.baslik, {
          body: r.metin || "", icon: "./icons/icon-192.png", badge: "./icons/icon-192.png",
          tag: r.tur || "analiz-merkezi", data: { url: r.url || "./" }
        })
      ).catch(() => { });
    }
  } catch (e) { }
  if (sb && r.id) { try { sb.from("bildirimler").update({ okundu: true }).eq("id", r.id).then(() => { }); } catch (e) { } }
}

// ---- 6c) İZİN VERİLDİĞİ ANDA CİHAZ BİLDİRİMİ (v41) ----
// Kullanıcı: "Bildirim çalıştığına göre test bildirimi, cihaz bildirimi vb
// kaldır. 'Bu cihazda dene'yi bildirim izni verildiği anda çağır."
// Yani ayrı test düğmesi YOK; izin verilir verilmez bu cihazda bir sistem
// bildirimi gösterilir. Kullanıcı bildirimi görürse kanal sağlamdır.
// v55 — "GÖNDERİLDİ" DEMEK YETMİYOR: GERÇEKTEN GÖRÜNDÜ MÜ?
// 16 Kasım vakası: showNotification hatasız dönüyordu ama Android bildirimi
// hiç göstermiyordu; arayüz "test bildirimi gönderildi" diyordu. Artık
// gösterimden sonra getNotifications() ile VAR MI diye bakılır ve sonuç
// cihazda saklanır (profil satırı bunu okur).
const KANAL_TESTI_ANAHTARI = "am_bildirim_kanal_testi";
async function cihazBildirimTesti() {
  const yaz = (r) => {
    try { localStorage.setItem(KANAL_TESTI_ANAHTARI, JSON.stringify(Object.assign({ zaman: Date.now() }, r))); } catch (e) { /* */ }
    return r;
  };
  try {
    if (typeof Notification === "undefined") return yaz({ ok: false, neden: "Bu tarayıcı bildirim göstermiyor." });
    if (Notification.permission !== "granted") return yaz({ ok: false, neden: "Bildirim izni verilmedi." });
    if (!("serviceWorker" in navigator)) return yaz({ ok: false, neden: "Bu ortamda sistem bildirimi gösterilemiyor." });
    const kayit = await navigator.serviceWorker.ready;
    const etiket = "am-izin-testi-" + Date.now(); // benzersiz: eski bildirimle karışmasın
    await kayit.showNotification("Bildirimler açıldı ✓", {
      body: "Bunu görüyorsan bu cihazın bildirim kanalı sağlam. Her sabah görevlerini hatırlatacağım.",
      icon: "./icons/icon-192.png", badge: "./icons/icon-192.png", tag: etiket, data: { url: "./" }
    });
    // Kısa bekle: bazı tarayıcılar listeyi gecikmeli günceller.
    await new Promise(function (r) { setTimeout(r, 1200); });
    let sayi = -1;
    try { sayi = (await kayit.getNotifications({ tag: etiket })).length; } catch (e) { sayi = -1; }
    const gorunur = sayi > 0;
    return yaz({
      ok: gorunur,
      gorunur: gorunur,
      sayi: sayi,
      neden: gorunur ? "" : "Tarayıcı bildirimi oluşturdu ama listede yok — cihaz/Android göstermiyor."
    });
  } catch (e) {
    return yaz({ ok: false, gorunur: false, neden: "Bildirim gösterilemedi: " + String((e && e.message) || e).slice(0, 80) });
  }
}
function sonKanalTesti() {
  try { const j = JSON.parse(localStorage.getItem(KANAL_TESTI_ANAHTARI) || "null"); return j && j.zaman ? j : null; } catch (e) { return null; }
}
window.__amSonKanalTesti = sonKanalTesti;
// index.html (klasik script) bu kancayla çağırır.
window.__amCihazBildirimTesti = cihazBildirimTesti;

// ---- 7) CLOUD MESSAGING (KALDIRILDI — v40) ----
// KÖK NEDEN ("bildirim hiç gelmiyor"): Firebase getToken(), AYNI servis
// çalışanında push aboneliğini KENDİ VAPID anahtarıyla yeniden kuruyor ve
// site/push-bildirim.js'in (Supabase Web Push) aboneliğini EZİYORDU.
// Sonuç: veritabanındaki endpoint ölüyor (410) ya da sunucunun imzaladığı
// anahtar cihazdaki abonelikle uyuşmuyordu. İki kanal aynı aboneliği
// paylaşamaz. Web Push + Realtime yeterli olduğu için FCM kapalı.
async function registerFCM() { return; }
async function registerFCMEski() {
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
// v35.8 — "Süre yetmedi" nedeni kaldırıldı (yanlış ve boş için ayrı listeler
// index.html'deki WRONG_REASONS / EMPTY_REASONS'tan gelir).
const OKZ_NEDENLER = ["KONUEKSİKLİĞİ", "ANLAMADIM", "ÇÖZÜMYOLUNUBULAMADIM", "İşlem Hatası/Dikkatsizlik", "Kodlama/Kitapçık Hatası"];
// ------------------------------------------------------------
// İŞLENDİ / YOKSAYILDI DEFTERİ
// ------------------------------------------------------------
// Sorun: "Analiz Bekliyor" kuyruğu her çekimde sunucudan yeniden
// kuruluyordu. Kullanıcı verileri silince (Denemelerim → sil veya
// "Tüm Verileri Sıfırla") sınav artık Denemelerim'de olmadığı için
// yeniden "yeni" sayılıyor ve kuyruk hiç boşalmıyordu.
//
// Çözüm: içerik parmak izine (hash) bağlı kalıcı bir defter.
//   • kullanıcı nedenleri kaydederse  → işlendi
//   • "Yoksay" derse                  → yoksayıldı
// Aynı sınav + aynı içerik defterde varsa kuyruğa GERİ KONMAZ.
// Okulizyon'da sonuç değişirse hash değişir → kendiliğinden geri gelir.
//
// Defter hem state içinde (cihazlar arası eşitlenir) hem de ayrı bir
// localStorage anahtarında tutulur; "Tüm Verileri Sıfırla" state'i
// sıfırlasa bile localStorage kopyası kalır → sorular geri gelmez.
const OKZ_DEFTER_KEY = "am_okz_islenen_v1";
function okzDefterDisktenOku() {
  try {
    const ham = localStorage.getItem(OKZ_DEFTER_KEY);
    const v = ham ? JSON.parse(ham) : null;
    return v && typeof v === "object" && !Array.isArray(v) ? v : {};
  } catch (e) { return {}; }
}
function okzDefterDiskeYaz(harita) {
  try { localStorage.setItem(OKZ_DEFTER_KEY, JSON.stringify(harita || {})); } catch (e) { /* kota dolu olabilir */ }
}
// Diskteki kopya + state kopyası birleşik defter
function okzDefter() {
  const disk = okzDefterDisktenOku();
  const st = okzStore();
  if (!st.islenen || typeof st.islenen !== "object") st.islenen = {};
  return Object.assign({}, disk, st.islenen);
}
function okzDefterIsaretle(anahtar, hash) {
  if (!anahtar) return;
  const st = okzStore();
  if (!st.islenen || typeof st.islenen !== "object") st.islenen = {};
  st.islenen[anahtar] = String(hash || "");
  okzDefterDiskeYaz(Object.assign({}, okzDefterDisktenOku(), st.islenen));
}
// Defterdeki kayıt sayısı. Ekranda gösterilmiyor (v50'de defter satırı kaldırıldı);
// testler bu fonksiyonla defterin doğru yazıldığını ölçüyor.
function okzDefterSayisi() { return Object.keys(okzDefter()).length; }
function okzDefterTemizle() {
  const st = okzStore();
  st.islenen = {};
  okzDefterDiskeYaz({});
  try { saveState(); } catch (e) { /* */ }
}
// v46c — Okulizyon sınav kimliği. sid varsa "sid:<sid>", yoksa "ad|tarih".
// Aynı ad+tarihli iki ayrı sınav artık tek sınav sanılmıyor.
function okzKey(ex) {
  if (window.OKZ && typeof window.OKZ.kararAnahtar === "function") return window.OKZ.kararAnahtar(ex);
  const m = /[?&]sid=([^&]+)/i.exec(String((ex && (ex.url || ex.okulizyonUrl)) || ""));
  if (m) return "sid:" + m[1];
  return ((ex && ex.name) || "?") + "|" + ((ex && ex.date) || "");
}
// Geriye dönük anahtar: sid'e geçmeden önce yazılmış defter kayıtları ve
// "sildim" işaretleri kaybolmasın diye ikisi BİRLİKTE yazılır.
function okzDefterIkili(ex, hash) {
  okzDefterIsaretle(okzKey(ex), hash);
  const eski = ((ex && ex.name) || "?") + "|" + ((ex && ex.date) || "");
  const kisa = eski.replace(/^Okulizyon:\s*/i, "");
  okzDefterIsaretle(eski, hash);
  if (kisa !== eski) okzDefterIsaretle(kisa, hash);
}
// Denemelerim'den bir Okulizyon denemesi silinirse deftere yaz:
// "sildim" = "bir daha Analiz Bekliyor'a gelmesin". index.html → deleteExam çağırır.
window.__okzDenemeSilindi = function (ex) {
  try {
    const ham = String((ex && ex.name) || "");
    if (!/^Okulizyon:\s*/i.test(ham)) return;           // yalnız Okulizyon kaynaklı denemeler
    const ad = ham.replace(/^Okulizyon:\s*/i, "").trim();
    if (!ad) return;
    const hash = (window.OKZ && typeof window.OKZ.kararHash === "function") ? window.OKZ.kararHash(ex) : "";
    // v46c: sid anahtarı + eski "ad|tarih" anahtarı BİRLİKTE yazılır ki
    // hangi sürümde silinmiş olursa olsun sınav geri gelmesin.
    okzDefterIkili(Object.assign({}, ex, { name: ad }), hash);
  } catch (e) { /* sessiz */ }
};
// Kullanıcı "verileri sil" dediğinde kuyruktakilerin TAMAMINI deftere yaz.
// Mantık: silmek = "bunu istemiyorum". Böylece bir daha "Analiz Bekliyor"a düşmez.
// index.html → executeReset("all" | "exams") bunu çağırır.
window.__okzKuyruguDeftereYaz = function () {
  try {
    const st = okzStore();
    const liste = st.pending || [];
    liste.forEach(ex => {
      const h = (window.OKZ && typeof window.OKZ.kararHash === "function") ? window.OKZ.kararHash(ex) : "";
      okzDefterIkili(ex, h);
    });
    st.pending = [];
    return liste.length;
  } catch (e) { return 0; }
};

function okzStore() {
  if (!state.okulizyon) state.okulizyon = { pending: [], importedKeys: [], aktarilan: {}, guncellenen: [], pulledAt: 0, duyurular: null, islenen: {} };
  // Sıfırlama sonrası diskteki defteri state'e geri getir.
  // (okzStore her çağrıda yeni nesne kurabildiği için KOŞULSUZ birleştir.)
  if (!state.okulizyon.islenen || typeof state.okulizyon.islenen !== "object") state.okulizyon.islenen = {};
  const diskDefter = okzDefterDisktenOku();
  Object.keys(diskDefter).forEach(k => {
    if (!(k in state.okulizyon.islenen)) state.okulizyon.islenen[k] = diskDefter[k];
  });
  if (!state.okulizyon.aktarilan) state.okulizyon.aktarilan = {};
  if (!Array.isArray(state.okulizyon.guncellenen)) state.okulizyon.guncellenen = [];
  return state.okulizyon;
}
// Sunucudaki çekim durumu → kullanıcıya ne yapacağını söyleyen cümle
const OKZ_SEBEP = {
  "sifre-gerekli": "Okulizyon bu kayıt için şifre istiyor: yukarıdaki OKULİZYON ŞİFRESİ alanını doldurup “Bilgileri Kaydet”e bas, sonra “Şimdi dene”.",
  "eslesme-yok": "Okulizyon’da il/ilçe/okul eşleşmedi: Profil’deki il, ilçe ve okul adını kontrol et.",
  "red": "Okulizyon bu ad-soyad + okul no ile kayıt bulamadı: bilgileri Okulizyon’a giriş yaptığın hâliyle birebir yaz.",
  "bilgi-yok": "Ad soyad ve okul no kayıtlı değil: Okulizyon bölümündeki alanları doldurup kaydet.",
  "sonuc-yok": "Giriş başarılı ama sonuç tablosu okunamadı; sınav sonuçları Okulizyon’da yayınlanmamış olabilir.",
  "hata": "Sunucu hatası; birkaç dakika sonra “Şimdi dene” ile tekrar dene.",
  "giris-yok": "Giriş yapılmadı — sınav sonuçları hesaba bağlı.",
  "bos": "Bu hesap için henüz sunucuda çekilmiş sonuç yok."
};
// Tarayıcıdan gerçek çekimi tetikle (Edge Function “ben” modu) → sonra kuyruğu oku
async function okzSunucuCek() {
  if (!sb || !currentUser) return okzDurum("giris-yok", OKZ_SEBEP["giris-yok"]);
  const yetki = await sb.auth.getSession().then(r => r && r.data && r.data.session).catch(() => null);
  if (!yetki || !yetki.access_token) return okzDurum("giris-yok", "Oturum bulunamadı — tekrar giriş yap.");
  okzDurum("bekliyor", "Okulizyon’a bağlanılıyor…");
  try {
    const y = await fetch(SUPABASE_CONFIG.url + "/functions/v1/okulizyon-cek", {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_CONFIG.anonKey, Authorization: "Bearer " + yetki.access_token },
      body: JSON.stringify({ mod: "ben" })
    });
    const c = await y.json().catch(() => ({}));
    if (!y.ok) return okzDurum("hata", "Çekici HTTP " + y.status + (c.hata ? " — " + c.hata : ""));
    if (c.durum === "ok") toast("Okulizyon: " + (c.sinav || 0) + " sınav, " + (c.satir || 0) + " soru aktarıldı.", "success");
    else okzDurum(c.durum || "red", (c.mesaj || "Sonuç alınamadı.") + (OKZ_SEBEP[c.durum] ? " → " + OKZ_SEBEP[c.durum] : ""));
  } catch (e) {
    return okzDurum("hata", "Çekici çağrılamadı: " + ((e && e.message) || e));
  }
  return okzKuyrukCek(true);
}
// Çekim sonucunu kullanıcıya görünür kıl (sessiz console.warn yerine)
function okzDurum(kod, mesaj) {
  try {
    const st = okzStore();
    st.durum = { kod: kod, mesaj: mesaj, zaman: Date.now() };
    saveState();
  } catch (e) {}
  if (typeof window.__profilTaze === "function") window.__profilTaze();
  // Okulizyon penceresi açıksa sonucu ANINDA göster (elle yenilemeye gerek kalmasın)
  try {
    const m = document.getElementById("pwa-okz-modal");
    if (m && m.style.display === "flex") renderOkzModal();
  } catch (e) { /**/ }
  return kod;
}
function okzZaman(ts) {
  try { return new Date(ts).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch (e) { return ""; }
}
// Uygulamanın bildiği ders adları (10. sınıf / 9. sınıf farkı index.html'den gelir)
function okzBilinenDersler() {
  try { if (typeof activeLessonConfig === "function") return Object.keys(activeLessonConfig()); } catch (e) { /**/ }
  return ["Türk Dili ve Edebiyatı", "Tarih", "Coğrafya", "Felsefe", "Din Kültürü", "Matematik", "Fizik", "Kimya", "Biyoloji"];
}
// Okulizyon adlarını uygulamanın adlarına çevir ("Matematik-1" → "Matematik")
function okzNormalize(exams) {
  const N = window.OKZ, b = okzBilinenDersler();
  return (exams || []).map(ex => {
    const kopya = Object.assign({}, ex);
    kopya.lessons = N && typeof N.birlestir === "function" ? N.birlestir(ex.lessons, b) : (ex.lessons || {});
    return kopya;
  });
}
// Ders sözlüğünün D/Y/B/Net özeti
function okzOzet(lessons) {
  if (window.OKZ && typeof window.OKZ.toplam === "function") return window.OKZ.toplam(lessons);
  let d = 0, w = 0, e = 0;
  Object.keys(lessons || {}).forEach(k => { d += Number(lessons[k].d) || 0; w += Number(lessons[k].w) || 0; e += Number(lessons[k].e) || 0; });
  return { d: d, w: w, e: e, soru: d + w + e, net: Math.round((d - w / 4) * 100) / 100 };
}
// Daha önce yanlış ders adlarıyla aktarılmış Okulizyon denemelerini onar
function okzDersleriDuzelt() {
  try {
    if (typeof state === "undefined" || !state || !Array.isArray(state.exams)) return 0;
    const b = okzBilinenDersler();
    const N = window.OKZ;
    if (!N || typeof N.duzelt !== "function") return 0;
    const dokunulacak = state.exams.map(ex => (ex && typeof ex.name === "string" && ex.name.indexOf("Okulizyon:") === 0) ? ex : null);
    if (!dokunulacak.some(Boolean)) return 0;
    const r = N.duzelt(dokunulacak, b);
    if (!r.degisti) return 0;
    let i = 0;
    state.exams = state.exams.map(ex => {
      const aday = dokunulacak[i++];
      return aday ? r.exams[i - 1] : ex;
    });
    saveState();
    try { if (typeof navigate === "function") navigate(currentPage); } catch (e) { /**/ }
    if (typeof renderExamChart === "function") renderExamChart();
    return r.degisti;
  } catch (e) { return 0; }
}
// ============================================================
// OKULİZYON KAZANIM → KONU BAŞLIĞI EŞLEMESİ
// ------------------------------------------------------------
// Okulizyon sorunun konusunu KAZANIM METNİ olarak verir
// ("Dik üçgende trigonometrik oranlar ... varsayımlarda bulunur.").
// Uygulama KONU BAŞLIĞI kullanır ("1.1 Dik Üçgende ... Özdeşlikler").
// Aynı konu iki ayrı kayıt gibi görünüyordu ve soru havuzu
// bulunamıyordu. Eşleştirme iki seviyede yapılır:
//   • KESİN  → otomatik uygulanır (başlık kazanımın içinde aynen var)
//   • ÖNERİ  → öğrenci onaylar (Profil → Okulizyon → Konu Eşlemesi)
// Emin olmadığımız eşleşme ASLA sessizce yazılmaz.
// ============================================================
let OKZK_IDX = null, OKZK_YUKLENIYOR = null;
function okzkYukle() {
  if (OKZK_IDX) return Promise.resolve(OKZK_IDX);
  if (OKZK_YUKLENIYOR) return OKZK_YUKLENIYOR;
  OKZK_YUKLENIYOR = fetch("content/konu_esleme.json", { cache: "no-store" })
    .then(r => (r && r.ok ? r.json() : null))
    .then(v => {
      OKZK_IDX = v && window.OKZK && typeof window.OKZK.indeksKur === "function" ? window.OKZK.indeksKur(v) : null;
      return OKZK_IDX;
    })
    .catch(() => { OKZK_IDX = null; return null; });
  return OKZK_YUKLENIYOR;
}
function okzDersKanonik(ders) {
  return window.OKZ && typeof window.OKZ.kanonik === "function" ? window.OKZ.kanonik(ders, okzBilinenDersler()) : ders;
}
function okzKonuHaritasi() {
  const st = okzStore();
  if (!st.konuHaritasi || typeof st.konuHaritasi !== "object") st.konuHaritasi = {};
  return st.konuHaritasi;
}
function okzHaritaAnahtar(ders, kazanim) { return String(ders || "") + "|" + String(kazanim || "").trim(); }
// Kazanım → { konu, topicKey, kaynak } ; bulunamazsa null
// Otomatik kabul eşiği: öneri hem ÇOK yüksek hem de ikinci adayın
// belirgin biçimde önünde olmalı. Böylece "fotosentez" gibi bir kazanım
// yanlışlıkla "enerji-metabolizma" konusuna bağlanmaz.
const OKZ_OTO_ESIK = 0.55;   // en iyi adayın skoru
const OKZ_OTO_FARK = 0.25;   // ikinci adayla fark
function okzKonuBul(ders, kazanim) {
  if (!kazanim) return null;
  const kanon = okzDersKanonik(ders);
  const elle = okzKonuHaritasi()[okzHaritaAnahtar(kanon, kazanim)];
  if (elle) return { konu: String(elle).split(" > ").slice(1).join(" > "), topicKey: elle, kaynak: "harita" };
  // 2) ELLE BAKILMIŞ KURAL TABLOSU (site/konu-anahtar.js)
  // Kazanım cümlesinde konunun ayırt edici kavramı geçiyorsa ("açıortay",
  // "mol", "ahenk"…) doğrudan konuya bağlanır. İndeks yüklenmeden de çalışır.
  if (window.KA && typeof window.KA.esle === "function") {
    const kural = window.KA.esle(kazanim, kanon);
    if (kural && kural.konu) {
      return { konu: kural.konu, topicKey: kanon + " > " + kural.konu, kaynak: "kural" };
    }
  }
  if (!OKZK_IDX || !window.OKZK || typeof window.OKZK.esle !== "function") return null;
  const r = window.OKZK.esle(kazanim, kanon, OKZK_IDX);
  if (r && r.guven === "kesin") return { konu: r.konu, topicKey: r.topicKey, kaynak: "kesin" };
  // Güçlü öneri: kullanıcıyı 26 satır seçmekten kurtarır (ÖLÇÜLÜ).
  if (typeof window.OKZK.adaylar === "function") {
    const aday = window.OKZK.adaylar(kazanim, kanon, OKZK_IDX, 2) || [];
    const birinci = aday[0], ikinci = aday[1];
    if (birinci && birinci.skor >= OKZ_OTO_ESIK && (!ikinci || birinci.skor - ikinci.skor >= OKZ_OTO_FARK)) {
      return { konu: birinci.konu, topicKey: birinci.topicKey, kaynak: "oto", skor: birinci.skor };
    }
  }
  return null;
}
// Hata kaydını uygulamanın diline çevir: ders kanonik, konu konu başlığı
function okzKayitKonu(ders, kazanim) {
  const kanon = okzDersKanonik(ders);
  const e = okzKonuBul(kanon, kazanim);
  return { lesson: kanon, topic: e ? e.konu : String(kazanim || ""), kazanim: String(kazanim || ""), eslendi: !!e };
}
// bkt-engine'in soru havuzu bulması için köprü: KAZANIM → konu_id
window.__okzKonuPoolEsle = function (ders, konu) {
  if (!OKZK_IDX || !window.OKZK || typeof window.OKZK.esle !== "function") return null;
  const r = window.OKZK.esle(konu, ders, OKZK_IDX);
  return r && r.guven === "kesin" && r.konuId ? r.konuId : null;
};

// İki BKT kaydını birleştir (aynı konuya düşen kazanım + konu başlığı kaydı)
function okzbktBirlestir(hedef, kaynak) {
  if (!hedef || !kaynak || hedef === kaynak) return hedef;
  const n1 = Number(hedef.gozlem_sayisi) || 0, n2 = Number(kaynak.gozlem_sayisi) || 0;
  const top = n1 + n2;
  if (top > 0) hedef.L = ((Number(hedef.L) || 0) * n1 + (Number(kaynak.L) || 0) * n2) / top;
  hedef.gozlem_sayisi = top;
  // v36 — KÖK NEDEN DÜZELTMESİ: burada koşulsuz birleştirme vardı; her
  // senkronda aynı kayıtlar tekrar eklenip tek konuyu 7.680 kayda çıkardı
  // (bulut 5,8 MB, "depolama dolu" hatası). Artık tekilleştir + 40'ta tut.
  const hamHata = (Array.isArray(hedef.hata_gecmisi) ? hedef.hata_gecmisi : [])
    .concat(Array.isArray(kaynak.hata_gecmisi) ? kaynak.hata_gecmisi : []);
  hedef.hata_gecmisi = (typeof window !== "undefined" && window.VeriSikistir && window.VeriSikistir.tekilKirp)
    ? window.VeriSikistir.tekilKirp(hamHata, 40)
    : hamHata.slice(-40);
  Object.keys(kaynak).forEach(k => { if (hedef[k] === undefined) hedef[k] = kaynak[k]; });
  // Daha ileri bir onay durumu varsa onu koru
  const SIRA = { VERI_YETERSIZ: 0, GELISIYOR: 1, PEKISIYOR: 2, RISKLI: 3, ONAYLANDI: 4 };
  if ((SIRA[kaynak.onay_durumu] || 0) > (SIRA[hedef.onay_durumu] || 0)) hedef.onay_durumu = kaynak.onay_durumu;
  return hedef;
}

// Eski kayıtları onar: ders adını kanonikleştir, kazanımı konu başlığına çevir,
// BKT kayıtlarını birleştir. Tekrar çalıştırmak zararsızdır (idempotent).
function okzKonulariOnar(sessiz) {
  return okzkYukle().then(() => {
    let degisen = 0;
    // 1) Denemelerim'deki hata kayıtları
    (Array.isArray(state.exams) ? state.exams : []).forEach(ex => {
      (Array.isArray(ex && ex.errorLogs) ? ex.errorLogs : []).forEach(l => {
        if (!l) return;
        const eskiDers = String(l.lesson || "");
        const kazanim = l.kazanim || l.topic;
        if (!kazanim) return;
        const y = okzKayitKonu(eskiDers, kazanim);
        if (y.lesson !== eskiDers) { l.lesson = y.lesson; degisen++; }
        if (y.eslendi && l.topic !== y.topic) { l.topic = y.topic; degisen++; }
        // Okulizyon'un özgün kazanım metnini her zaman sakla: sonradan
        // eşlemeyi değiştirmek veya metni göstermek için gerekli.
        if (l.kazanim == null) l.kazanim = kazanim;
      });
    });
    // 2) BKT kayıtları, kartlar, kuyruk, oturumlar
    const s = state;
    if (s && s.bkt_state && typeof s.bkt_state === "object") {
      Object.keys(s.bkt_state).forEach(eski => {
        const p = eski.indexOf(" > ");
        if (p < 0) return;
        const ders = eski.slice(0, p), konu = eski.slice(p + 3);
        const kanon = okzDersKanonik(ders);
        const e = okzKonuBul(kanon, konu);
        // Konu eşlenemese bile DERS adı düzeltilir: "Türkçe" → "Türk Dili ve Edebiyatı".
        // Böylece aynı dersin konuları aynı başlık altında toplanır.
        const yeni = kanon + " > " + (e ? e.konu : konu);
        if (yeni === eski) return;
        if (s.bkt_state[yeni]) okzbktBirlestir(s.bkt_state[yeni], s.bkt_state[eski]);
        else s.bkt_state[yeni] = s.bkt_state[eski];
        delete s.bkt_state[eski];
        (s.flashcards && Array.isArray(s.flashcards.cards) ? s.flashcards.cards : []).forEach(c => { if (c && c.topicKey === eski) c.topicKey = yeni; });
        (Array.isArray(s.mini_test_kuyrugu) ? s.mini_test_kuyrugu : []).forEach(t => { if (t && t.topicKey === eski) t.topicKey = yeni; });
        if (s.flashcards && s.flashcards.sessions && s.flashcards.sessions[eski]) {
          s.flashcards.sessions[yeni] = s.flashcards.sessions[eski]; delete s.flashcards.sessions[eski];
        }
        if (s.mini_test_sessions && s.mini_test_sessions[eski]) {
          s.mini_test_sessions[yeni] = s.mini_test_sessions[eski]; delete s.mini_test_sessions[eski];
        }
        degisen++;
      });
    }
    // Video bağlantılarını güvenli biçime çevir (eski kayıtlar dahil)
    try { if (window.VC && typeof window.VC.videolariIsle === "function") window.VC.videolariIsle(state.exams); } catch (e) { /* */ }
    if (degisen) {
      try { saveState(); } catch (e) { /* */ }
      try { if (typeof navigate === "function") navigate(typeof currentPage === "string" ? currentPage : "dashboard"); } catch (e) { /* */ }
      try { if (typeof window.__bktUiTazele === "function") window.__bktUiTazele(); } catch (e) { /* */ }
      if (!sessiz) toast(degisen + " konu kaydı konu başlıklarına eşlendi.", "success");
    }
    return degisen;
  }).catch(() => 0);
}

// Henüz eşlenmemiş kazanımlar (Profil → Konu Eşlemesi listesi)
function okzEslenmemisKonular() {
  const harita = okzKonuHaritasi();
  const gorulen = Object.create(null);
  const liste = [];
  window.__okzOtoEslenen = [];
  const ekle = (ders, kazanim) => {
    if (!ders || !kazanim) return;
    const kanon = okzDersKanonik(ders);
    const anahtar = okzHaritaAnahtar(kanon, kazanim);
    if (gorulen[anahtar]) return;
    gorulen[anahtar] = 1;
    if (harita[anahtar]) return;
    if (OKZK_IDX && window.OKZK) {
      const r = window.OKZK.esle(kazanim, kanon, OKZK_IDX);
      if (r && r.guven === "kesin") return;
      // Güçlü öneri varsa satır açma; kullanıcı yalnız belirsizleri görsün
      const o = okzKonuBul(kanon, kazanim);
      if (o && o.kaynak === "oto") { window.__okzOtoEslenen.push({ ders: kanon, kazanim: kazanim, konu: o.konu }); return; }
    }
    const oneriler = OKZK_IDX && window.OKZK ? window.OKZK.adaylar(kazanim, kanon, OKZK_IDX, 3) : [];
    liste.push({ ders: kanon, kazanim: kazanim, oneriler: oneriler });
  };
  try {
    (Array.isArray(state.exams) ? state.exams : []).forEach(ex => {
      (Array.isArray(ex && ex.errorLogs) ? ex.errorLogs : []).forEach(l => l && ekle(l.lesson, l.kazanim || l.topic));
    });
  } catch (e) { /* durum hazır değilse boş liste */ }
  return liste;
}

// Seçilen eşlemeleri kaydet: haritaya yaz + kayıtları onar
async function okzKonuEsleKaydet() {
  await okzkYukle();
  const harita = okzKonuHaritasi();
  let say = 0;
  document.querySelectorAll("[data-okz-konu]").forEach(sel => {
    const ders = sel.dataset.okzDers || "";
    const kazanim = sel.dataset.okzKazanim || "";
    const secim = sel.value;
    if (!ders || !kazanim || !secim) return;
    harita[okzHaritaAnahtar(ders, kazanim)] = secim;
    say++;
  });
  if (!say) return toast("Hiç konu seçilmedi.", "info");
  saveState();
  const degisen = await okzKonulariOnar(true);
  renderProfileModal();
  toast(say + " eşleme kaydedildi" + (degisen ? " · " + degisen + " kayıt birleştirildi" : "") + ".", "success");
}

// Konu eşlemesi arayüzünü bas (Profil penceresi)
// KURAL: Öneri yalnız GÜÇLÜ ise (>=0.35) hazır seçili gelir; zayıf öneri
// kutuya yazılmaz, yanlış eşleşme kazara kaydedilmesin.
const OKZ_ONERI_ESIK = 0.35;
function okzKonuEslemeHtml() {
  const eksik = okzEslenmemisKonular();
  const harita = okzKonuHaritasi();
  const elleSayi = Object.keys(harita).length;
  let h = '<details id="okz-konu-esleme" ' + (eksik.length ? 'open' : '') + ' style="border:1px solid rgba(0,0,0,0.12);border-radius:14px;padding:12px;margin-bottom:14px;"><summary style="cursor:pointer;font-size:12.5px;font-weight:700;">Okulizyon konu eşlemesi' + (eksik.length ? ' · ' + eksik.length + ' bekliyor' : ' ✓') + '</summary>';
  h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;"><div style="font-size:11px;font-weight:800;letter-spacing:0.06em;opacity:0.6;">OKULİZYON KONU EŞLEMESİ</div>' + (elleSayi ? '<span style="font-size:10.5px;opacity:0.6;">' + elleSayi + ' eşleme kayıtlı</span>' : '') + '</div>';
  h += '<div style="font-size:11.5px;opacity:0.75;line-height:1.5;margin-bottom:8px;">Okulizyon\'daki kazanımları uygulamadaki konu başlıklarıyla eşleştir. Eşleşmeyen kazanımların soru havuzu açılmaz. Bir kez yapman yeterli — sonraki çekimlerde otomatik uygulanır.</div>';
  if (!eksik.length) {
    h += '<div style="font-size:12px;color:#16A34A;font-weight:600;">✓ Tüm konular eşlendi — soru havuzu bağlı.</div></details>';
    return h;
  }
  const oto = Array.isArray(window.__okzOtoEslenen) ? window.__okzOtoEslenen : [];
  if (oto.length) {
    h += '<details style="border:1px solid rgba(22,163,74,0.35);background:rgba(22,163,74,0.06);border-radius:10px;padding:8px;margin-bottom:8px;">';
    h += '<summary style="cursor:pointer;font-size:11.5px;font-weight:700;color:#15803D;">✓ ' + oto.length + ' kazanım otomatik eşlendi (kontrol etmek için aç)</summary>';
    h += '<div style="margin-top:6px;display:grid;gap:4px;">' + oto.slice(0, 30).map(x =>
      '<div style="font-size:10.5px;opacity:0.8;line-height:1.35;">' + escHtml(String(x.kazanim).slice(0, 80)) + ' → <b>' + escHtml(x.konu) + '</b></div>').join("") + '</div>';
    h += '</details>';
  }
  if (!eksik.length && oto.length) {
    h += '<div style="font-size:11px;opacity:0.7;margin-bottom:6px;">Belirsiz kazanım kalmadı — seçim yapmana gerek yok.</div>';
  }
  h += '<div style="font-size:11.5px;font-weight:700;color:#B45309;margin-bottom:4px;">' + eksik.length + ' kazanım bekliyor</div>';
  h += '<div style="font-size:11px;opacity:0.7;line-height:1.45;margin-bottom:8px;">Her satır hazır öneriyle gelir; dokunman yeterli. Gerekirse listeden değiştir.</div>';
  let sonDers = "";
  h += '<div style="display:grid;gap:8px;">';
  eksik.forEach((x, i) => {
    const konular = OKZK_IDX && window.OKZK ? window.OKZK.konular(x.ders, OKZK_IDX) : [];
    const oneri = x.oneriler && x.oneriler[0];
    // Öğrenciyi 26 satırlık seçimle yormamak için HER satır en iyi öneriyle
    // hazır gelir. Emin olmadığımızda bunu açıkça yazarız; yanlışsa değiştirir.
    const guclu = oneri && oneri.skor >= OKZ_ONERI_ESIK;
    const secili = oneri ? oneri.topicKey : "";
    if (x.ders !== sonDers) {
      sonDers = x.ders;
      h += '<div style="font-size:11px;font-weight:800;opacity:0.55;margin-top:4px;">' + escHtml(x.ders) + '</div>';
    }
    let opts = '<option value="">— konu seç —</option>';
    opts += konular.map(k => '<option value="' + escHtml(k.topicKey) + '"' + (k.topicKey === secili ? " selected" : "") + '>' + escHtml(k.konu) + '</option>').join("");
    h += '<div style="border:1px solid rgba(0,0,0,0.09);border-radius:10px;padding:8px;">';
    h += '<div style="font-size:11px;opacity:0.75;line-height:1.4;margin-bottom:6px;">' + escHtml(String(x.kazanim).slice(0, 140)) + '</div>';
    h += '<select data-okz-konu="' + i + '" data-okz-ders="' + escHtml(x.ders) + '" data-okz-kazanim="' + escHtml(x.kazanim) + '" style="width:100%;box-sizing:border-box;padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,0.18);background:var(--bg,#F6F8FC);color:inherit;font-size:12.5px;">' + opts + '</select>';
    if (oneri && oneri.skor > 0) {
      h += '<div style="font-size:10.5px;opacity:0.6;margin-top:3px;">Öneri (%' + Math.round(oneri.skor * 100) + '): ' + escHtml(oneri.konu) + (guclu ? ' — hazır seçildi' : ' — emin değilim; yanlışsa listeden değiştir') + '</div>';
    }
    h += '</div>';
  });
  h += '</div>';
  h += '<button data-act="okzKonuEsle" class="btn btn-primary btn-sm" style="margin-top:10px;">Önerileri kabul et ve eşle</button>';
  h += '</details>';
  return h;
}

// Sınavın içerik parmak izi: Okulizyon verisi değişirse yakalanır
function okzHash(ex) {
  const l = ex.lessons || {};
  return [ex.name || "", ex.date || "",
    Object.keys(l).sort().map(k => k + ":" + (Number(l[k].d) || 0) + "," + (Number(l[k].w) || 0) + "," + (Number(l[k].e) || 0)).join(";")
  ].join("|");
}
function initOkulizyonUI() {
  if (window.__okzHooked) return;
  window.__okzHooked = true;
  // Okulizyon girişi yalnız PROFİL penceresinden; burada sadece kuyruk penceresi hazırlanır
  buildOkzModal();
  buildProfileModal();
  // v44 — İL → İLÇE → OKUL zinciri yazarak aramalı bileşende yürür
  // (okzAramaSec). Burada ayrıca change dinleyicisi YOK: tek yol, tek davranış.

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const a = el.dataset.act;
    if (a === "pwaOkz") openOkzModal();
    else if (a === "okzSimdiCek") { toast("Okulizyon sonuçları sorgulanıyor…", "info"); okzSunucuCek(); }
    else if (a === "okzClose") closeOkzModal();
    else if (a === "okzSaveBilgi") okzSaveBilgi();
    else if (a === "amKanalTesti") { amKanalTestiCalistir(); }
    else if (a === "amBildirimOnar") {
      if (!window.AmPush || !window.AmPush.yenile) { toast("Bildirim modülü yüklenmedi, sayfayı yenile.", "warning"); return; }
      toast("Bildirim bağlantısı yeniden kuruluyor…", "info");
      window.AmPush.yenile().then(r => {
        if (r && r.ok) {
          toast("Bağlantı yenilendi — birazdan bir deneme bildirimi gelecek.", "success");
          setTimeout(function () { try { pushTeshisYaz(); } catch (e) {} }, 1500);
        } else {
          toast("Kurulamadı: " + ((r && r.neden) || "bilinmeyen hata"), "error");
        }
      });
    }
    else if (a === "okzListeYenile") { toast("Listeler yenileniyor…", "info"); okzListeTazele("il", true).then(() => { if (OKZ_SECIM.il.kod) return okzListeTazele("ilce", true); }).then(() => { if (OKZ_SECIM.ilce.kod) return okzListeTazele("okul", true); }); }
    else if (a === "okzAnalizKaydet") okzAnalizKaydet();
    else if (a === "okzHepsi") okzHepsiUygula(el.dataset.reason);
    else if (a === "okzYeniden") okzYenidenAktar(el.dataset.i);
    else if (a === "okzSonucGuncelle") okzSonucuYaz(el.dataset.ad, el.dataset.tarih);
    else if (a === "okzKonuEsle") okzKonuEsleKaydet();
    else if (a === "okzHizliNedenSec") {
      document.querySelectorAll(".okz-hizli-chip").forEach(c => {
        const sec = c.dataset.reason === el.dataset.reason;
        c.dataset.secili = sec ? "1" : "0";
        c.style.border = "1px solid " + (sec ? "#2563EB" : "rgba(0,0,0,0.18)");
        c.style.background = sec ? "rgba(37,99,235,0.12)" : "none";
        c.style.fontWeight = sec ? "700" : "400";
      });
      window.__okzHizliNeden = el.dataset.reason;
    }
    else if (a === "okzHizliIsle") okzAnalizKaydet(window.__okzHizliNeden || "KONU EKSİKLİĞİ");
    else if (a === "okzYoksay") okzYoksay([{ anahtar: el.dataset.key, hash: el.dataset.hash }]);
    else if (a === "okzHepsiniYoksay") okzHepsiniYoksay();
    else if (a === "okzDefteriTemizle") { okzDefterTemizle(); renderProfileModal(); toast("Yoksayılan kayıtlar geri alındı — sonraki çekimde yeniden gelir.", "info"); }
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

// Ders ders D/Y/B/Net tablosu (Okulizyon penceresi)
function okzDersTablosu(lessons) {
  const N = window.OKZ;
  const anahtarlar = Object.keys(lessons || {}).sort((a, b) => a.localeCompare(b, "tr"));
  if (!anahtarlar.length) return "";
  const say = (n) => String(Math.round((Number(n) || 0) * 100) / 100).replace(".", ",");
  let html = '<table style="width:100%;font-size:11.5px;border-collapse:collapse;margin:4px 0 8px;">';
  html += '<tr style="opacity:0.6;text-align:right;"><th style="text-align:left;font-weight:600;padding:3px 4px;">Ders</th><th>D</th><th>Y</th><th>B</th><th>Net</th></tr>';
  anahtarlar.forEach(k => {
    const v = lessons[k] || {};
    const net = N && typeof N.net === "function" ? N.net(v.d, v.w) : (Number(v.d) || 0) - (Number(v.w) || 0) / 4;
    html += '<tr style="text-align:right;border-top:1px solid rgba(0,0,0,0.06);"><td style="text-align:left;padding:3px 4px;">' + escHtml(k) + '</td><td>' + (Number(v.d) || 0) + '</td><td>' + (Number(v.w) || 0) + '</td><td>' + (Number(v.e) || 0) + '</td><td style="font-weight:700;">' + say(net) + '</td></tr>';
  });
  const t = okzOzet(lessons);
  html += '<tr style="text-align:right;border-top:2px solid rgba(0,0,0,0.18);font-weight:800;"><td style="text-align:left;padding:3px 4px;">TOPLAM</td><td>' + t.d + '</td><td>' + t.w + '</td><td>' + t.e + '</td><td>' + say(t.net) + '</td></tr>';
  html += "</table>";
  return html;
}
// "Son çekilen sonuç" bölümünden tek dokunuşla kaydı güncelle
function okzSonucuYaz(ad, tarih) {
  const st = okzStore();
  const sn = (st.sonSonuc || []).find(x => ("Okulizyon: " + (x.name || "Sınav")) === ad && String(x.date || "") === String(tarih || ""));
  if (!sn) return toast("Sonuç bulunamadı — yeniden çek.", "error");
  const lessons = window.OKZ ? window.OKZ.birlestir(sn.lessons, okzBilinenDersler()) : sn.lessons;
  const oz = okzOzet(lessons);
  const idx = state.exams.findIndex(e => e && e.name === ad && String(e.date || "") === String(tarih || ""));
  if (idx >= 0) {
    state.exams[idx] = Object.assign({}, state.exams[idx], { lessons: lessons, total: oz.soru, net: oz.net });
  } else {
    state.exams.push({ id: (typeof uid === "function" ? uid() : "okz" + Date.now()), name: ad, date: tarih || todayStr(), lessons: lessons, errorLogs: [], total: oz.soru, net: oz.net });
  }
  st.guncellenen = (st.guncellenen || []).filter(x => okzKey(x.exam) !== (sn.name + "|" + (sn.date || "")));
  saveState();
  renderOkzModal();
  try { navigate(currentPage); } catch (e) { /**/ }
  if (typeof renderExamChart === "function") renderExamChart();
  toast("Kaydedildi — net " + oz.net + " · " + oz.soru + " soru.", "success");
}

// Okulizyon'da sonucu değişen sınavı uygulamadaki kayda yansıt
function okzYenidenAktar(i) {
  const st = okzStore();
  const g = (st.guncellenen || [])[Number(i)];
  if (!g) return;
  const ex = g.exam;
  const lessons = window.OKZ ? window.OKZ.birlestir(ex.lessons, okzBilinenDersler()) : (ex.lessons || {});
  const oz = okzOzet(lessons);
  const ad = "Okulizyon: " + (ex.name || "Sınav");
  const idx = state.exams.findIndex(e => e.name === ad && String(e.date || "") === String(ex.date || ""));
  if (idx >= 0) {
    state.exams[idx] = Object.assign({}, state.exams[idx], { lessons: lessons, total: oz.soru, net: oz.net });
  } else {
    state.exams.push({ id: (typeof uid === "function" ? uid() : "okz" + Date.now()), name: ad, date: ex.date || todayStr(), lessons: lessons, errorLogs: [], total: oz.soru, net: oz.net });
  }
  st.aktarilan = st.aktarilan || {};
  st.aktarilan[g.key] = g.hash;
  st.guncellenen = (st.guncellenen || []).filter(x => x.key !== g.key);
  saveState();
  renderOkzModal();
  try { navigate(currentPage); } catch (e) { /**/ }
  if (typeof renderExamChart === "function") renderExamChart();
  toast("Güncellendi — " + (ex.name || "sınav") + " · net " + oz.net + " · " + oz.soru + " soru.", "success");
}

// Kuyruktaki sınavları kalıcı olarak yoksay (içerik değişirse geri gelir)
function okzYoksay(liste) {
  let say = 0;
  (liste || []).forEach(x => {
    if (!x || !x.anahtar) return;
    okzDefterIsaretle(x.anahtar, x.hash);
    say++;
  });
  if (!say) return;
  const st = okzStore();
  const anahtarlar = (liste || []).map(x => x && x.anahtar);
  st.pending = (st.pending || []).filter(ex => !anahtarlar.includes(okzKey(ex)));
  try { saveState(); } catch (e) { /* */ }
  okzBadge();
  renderOkzModal();
  const kalan = (st.pending || []).reduce((a, ex) => a + (ex.rows || []).length, 0);
  if (kalan > 0) toast("Yoksayıldı. " + kalan + " soru kaldı.", "info");
  else toast("Tamam — bir daha gelmeyecek.", "success");
}
function okzHepsiniYoksay() {
  const st = okzStore();
  const liste = (st.pending || []).map(ex => ({
    anahtar: okzKey(ex),
    hash: window.OKZ && window.OKZ.kararHash ? window.OKZ.kararHash(ex) : okzHash(ex)
  }));
  if (!liste.length) return toast("Yoksayılacak sınav yok.", "info");
  const toplam = (st.pending || []).reduce((a, ex) => a + (ex.rows || []).length, 0);
  openConfirm(toplam + " soru yoksayılacak ve bir daha gösterilmeyecek. Emin misin?", function () {
    okzYoksay(liste);
  });
}

function renderOkzModal() {
  const m = document.getElementById("pwa-okz-modal");
  const s = state.settings && state.settings.okulizyon ? state.settings.okulizyon : {};
  const st = okzStore();
  let html = '<div style="width:100%;max-width:520px;max-height:86vh;overflow:auto;background:var(--bg-elev,#fff);color:var(--text,#16213A);border-radius:18px;padding:20px;box-shadow:0 24px 60px rgba(0,0,0,0.35);">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><div style="font-weight:800;font-size:17px;">Okulizyon</div><button data-act="okzClose" style="background:none;border:0;font-size:19px;cursor:pointer;color:inherit;">✕</button></div>';
  // A) Bağlantı bilgileri artık PROFİL penceresinde — burada yalnız kuyruk yönetilir
  html += '<div style="font-size:12px;opacity:0.8;margin-bottom:10px;padding:10px;border:1px dashed rgba(0,0,0,0.2);border-radius:10px;">Okulizyon bilgilerini <b>Profil</b> penceresinden gir. Burada bekleyen sınav sonuçlarını işlersin.</div>';
  html += '<button data-act="openProfile" class="btn btn-ghost btn-sm" style="border:1px solid rgba(0,0,0,0.15);margin-bottom:14px;">Profili Aç</button>';
  // A2) SON ÇEKİLEN SONUÇ — her zaman görünür (yeni olsun olmasın)
  const sonSonuc = Array.isArray(st.sonSonuc) ? st.sonSonuc : [];
  if (sonSonuc.length) {
    html += '<div style="font-weight:800;font-size:14.5px;margin:2px 0 6px;">📥 Okulizyon\'dan Son Çekilen Sonuç</div>';
    sonSonuc.slice(0, 5).forEach(sn => {
      const ad = "Okulizyon: " + (sn.name || "Sınav");
      const varOlan = state.exams.find(e => e && e.name === ad && String(e.date || "") === String(sn.date || ""));
      const oz = okzOzet(sn.lessons);
      html += '<div style="border:1px solid rgba(0,0,0,0.12);border-radius:12px;padding:10px;margin-bottom:10px;">';
      html += '<div style="font-weight:700;font-size:13.5px;">' + escHtml(sn.name || "Sınav") +
        (sn.date ? ' <span style="opacity:0.6;font-weight:400;">· ' + escHtml(sn.date) + "</span>" : "") + "</div>";
      html += '<div style="font-size:11px;opacity:0.7;margin-bottom:4px;">' + oz.soru + " soru · " + oz.d + " D · " + oz.w + " Y · " + oz.e + " B — çekim: " + escHtml(okzZaman(st.sonCekim ? Date.parse(st.sonCekim) : Date.now())) + "</div>";
      html += okzDersTablosu(sn.lessons);
      html += '<div style="font-size:11.5px;font-weight:600;color:' + (varOlan ? "#16A34A" : "#B45309") + ';">' +
        (varOlan ? "✓ Bu sınav Denemelerim'de kayıtlı (net " + varOlan.net + ")." : "⏳ Henüz Denemelerim'e işlenmedi.") + "</div>";
      if (varOlan && okzHash({ name: ad, date: sn.date, lessons: varOlan.lessons }) !== okzHash({ name: ad, date: sn.date, lessons: sn.lessons })) {
        html += '<button data-act="okzSonucGuncelle" data-ad="' + escHtml(ad) + '" data-tarih="' + escHtml(sn.date) + '" class="btn btn-primary btn-sm" style="margin-top:6px;">Kaydı bu sonuçla güncelle</button>';
      }
      if (!varOlan && (sn.satir || 0) > 0) {
        html += '<div style="font-size:11px;opacity:0.7;margin-top:4px;">Aşağıdaki “Analiz Bekliyor” bölümünden nedenlerini seçip işleyebilirsin.</div>';
      }
      html += "</div>";
    });
  }
  // B0) VERİSİ GÜNCELLENEN SINAVLAR (Okulizyon cevap anahtarını değiştirdiyse)
  const guncel = st.guncellenen || [];
  if (guncel.length) {
    html += '<div style="font-weight:800;font-size:14.5px;margin-bottom:6px;">🔁 Verisi Güncellenen Sınavlar</div>';
    guncel.forEach((g, i) => {
      html += '<div style="border:1px solid rgba(180,83,9,0.35);background:rgba(245,158,11,0.08);border-radius:12px;padding:10px;margin-bottom:10px;">';
      html += '<div style="font-weight:700;font-size:13px;margin-bottom:2px;">' + escHtml(g.exam.name) + (g.exam.date ? ' <span style="opacity:0.6;font-weight:400;">· ' + escHtml(g.exam.date) + "</span>" : "") + '</div>';
      html += '<div style="font-size:11.5px;opacity:0.8;">Okulizyon\'daki sonuç değişmiş. Uygulamadaki kayıt eski puanla duruyor.</div>';
      html += okzDersTablosu(g.exam.lessons);
      html += '<button data-act="okzYeniden" data-i="' + i + '" class="btn btn-primary btn-sm">Uygulamadaki kaydı güncelle</button>';
      html += "</div>";
    });
  }
  // B) ANALİZ BEKLİYOR
  const bekleyen = st.pending.filter(ex => (ex.rows || []).length);
  if (bekleyen.length) {
    html += '<div style="font-weight:800;font-size:14.5px;margin-bottom:6px;">⏳ Analiz Bekliyor (' + bekleyen.reduce((a, ex) => a + ex.rows.length, 0) + ' soru)</div>';
    // TEK DOKUNUŞ: soru başına neden seçmek zorunda değilsin. Sınavın tamamı
    // için bir neden seç, gerisini uygulama yapsın (konu eşlemesi otomatik).
    html += '<div style="border:1px solid rgba(37,99,235,0.35);background:rgba(37,99,235,0.06);border-radius:12px;padding:10px;margin-bottom:10px;">';
    html += '<div style="font-size:12.5px;font-weight:700;margin-bottom:6px;">⚡ Tüm yanlış/boşlar için tek neden seç</div>';
    html += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;" id="okz-hizli-nedenler">' +
      ["KONUEKSİKLİĞİ", "ANLAMADIM", "İşlem Hatası/Dikkatsizlik"].map((r, k) =>
        '<button data-act="okzHizliNedenSec" data-reason="' + escHtml(r) + '" class="okz-hizli-chip" data-secili="' + (k === 0 ? "1" : "0") + '" style="font-size:11.5px;padding:7px 10px;min-height:40px;border-radius:99px;border:1px solid ' + (k === 0 ? "#2563EB" : "rgba(0,0,0,0.18)") + ';background:' + (k === 0 ? "rgba(37,99,235,0.12)" : "none") + ';color:inherit;cursor:pointer;font-weight:' + (k === 0 ? "700" : "400") + ';">' + r + '</button>').join("") +
      '</div>';
    html += '<button data-act="okzHizliIsle" class="btn btn-primary w-full" style="font-weight:700;">Bu nedenle tümünü işle</button>';
    html += '<div style="font-size:10.5px;opacity:0.65;margin-top:6px;line-height:1.4;">Konular otomatik eşlenir; emin olunamayanlar için hazır öneri sunulur.</div>';
    html += '</div>';
    html += '<div style="font-size:11.5px;opacity:0.75;margin-bottom:8px;">İstersen soru soru da düzenleyebilirsin.</div>';
    bekleyen.forEach((ex, i) => {
      html += '<div style="border:1px solid rgba(0,0,0,0.12);border-radius:12px;padding:10px;margin-bottom:10px;">';
      html += '<div style="font-weight:700;font-size:13.5px;margin-bottom:6px;">' + escHtml(ex.name) + (ex.date ? ' <span style="opacity:0.6;font-weight:400;">· ' + escHtml(ex.date) + "</span>" : "") + "</div>";
      html += okzDersTablosu(ex.lessons);
      // Okulizyon videoyu doğrudan adresle vermiyor; çözüm düğmeleri sınav
      // sayfasında. Bağlantı yoksa düğme ÇİZİLMEZ (boş vaat yok).
      const okzSinavUrl = (function () {
        try { const u = window.VC && window.VC.normalize ? window.VC.normalize(ex.url || ex.okulizyonUrl || "") : String(ex.url || ""); return u; } catch (e) { return ""; }
      })();
      if (okzSinavUrl) {
        html += '<a href="' + escHtml(okzSinavUrl) + '" target="_blank" rel="noopener" class="btn btn-sm btn-ghost" style="margin:2px 0 6px;display:inline-flex;gap:5px;align-items:center;min-height:38px;">▶ Okulizyon\'da sınavı ve çözümleri aç</a>';
      }
      html += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">' + OKZ_NEDENLER.slice(0, 3).map(r => '<button data-act="okzHepsi" data-reason="' + escHtml(r) + '" style="font-size:10.5px;padding:4px 8px;border-radius:99px;border:1px solid rgba(0,0,0,0.15);background:none;cursor:pointer;color:inherit;">tümü: ' + r + "</button>").join("")
        + '<button data-act="okzYoksay" data-key="' + escHtml(okzKey(ex)) + '" data-hash="' + escHtml(window.OKZ && window.OKZ.kararHash ? window.OKZ.kararHash(ex) : okzHash(ex)) + '" style="font-size:10.5px;padding:4px 8px;border-radius:99px;border:1px solid rgba(0,0,0,0.15);background:none;cursor:pointer;color:#B45309;">bu sınavı yoksay</button>'
        + "</div>";
      // Soru soru neden seçimi İSTEĞE BAĞLI ve varsayılan kapalı:
      // 21 soruluk sınavda 21 açılır kutu göstermek öğrenciyi boğuyordu.
      html += '<details style="margin-top:6px;"><summary style="cursor:pointer;font-size:11.5px;opacity:0.75;padding:4px 0;">Soruları tek tek düzenle (isteğe bağlı · ' + ex.rows.length + ' soru)</summary>';
      ex.rows.forEach((row, j) => {
        html += '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px solid rgba(0,0,0,0.07);">';
        html += '<span style="min-width:26px;font-size:11px;opacity:0.6;">#' + (row.qno || j + 1) + "</span>";
        const satirVideo = (function () {
          try { if (window.VC && window.VC.normalize) return window.VC.normalize(row.video || ""); } catch (e) { /* */ }
          return "";
        })();
        const satirLink = satirVideo || ((row.videoVar || satirVideo) && okzSinavUrl ? okzSinavUrl : "");
        html += '<div style="flex:1;min-width:0;"><div style="font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escHtml(row.topic) + '</div><div style="font-size:10.5px;opacity:0.6;">' + escHtml(row.lesson) + " · " + (row.status === "e" ? "BOŞ" : "YANLIŞ") + (satirLink ? " · çözüm var" : "") + "</div></div>";
        if (satirLink) html += '<a href="' + escHtml(satirLink) + '" target="_blank" rel="noopener" title="Çözümü aç" style="min-width:40px;min-height:40px;display:flex;align-items:center;justify-content:center;border-radius:9px;border:1px solid rgba(37,99,235,0.35);background:rgba(37,99,235,0.08);color:#1D4ED8;text-decoration:none;font-size:13px;">▶</a>';
        html += '<select class="okz-reason" data-i="' + i + '" data-j="' + j + '" style="max-width:42%;padding:6px;border-radius:8px;border:1px solid rgba(0,0,0,0.2);background:var(--bg,#F6F8FC);color:inherit;font-size:11.5px;"><option value="">Atla</option>' + OKZ_NEDENLER.map(r => '<option value="' + escHtml(r) + '">' + r + "</option>").join("") + "</select>";
        html += "</div>";
      });
      html += "</details>";
      html += "</div>";
    });
    html += '<button data-act="okzAnalizKaydet" class="btn btn-primary w-full" style="font-weight:700;">Seçilenleri Deneme Olarak Kaydet</button>';
    html += '<button data-act="okzHepsiniYoksay" class="btn btn-ghost w-full btn-sm" style="margin-top:8px;border:1px solid rgba(0,0,0,0.15);opacity:0.85;">Analiz etmeyeceğim — hepsini yoksay</button>';
    html += '<div style="font-size:10.5px;opacity:0.6;margin-top:6px;line-height:1.45;">İşaretlediğin sınavlar bir daha sorulmaz.</div>';
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
  // v43 — seçilen Okulizyon KODLARI durumdan okunur (DOM'a bağlı değil).
  const secKod = (rol) => (OKZ_SECIM[rol] && OKZ_SECIM[rol].kod) || "";
  if (!al("il") || !al("ilce") || !al("okulAdi")) { toast("İl, ilçe ve okulu Okulizyon listesinden seç.", "error"); return; }
  if (!secKod("il") || !secKod("ilce") || !secKod("okul")) {
    // Liste ağdan gelmediyse isimle kaydetmeye izin ver ama sessiz kalma.
    toast("Seçtiğin il/ilçe/okulun kodu alınamadı — “Listeyi yenile”ye basıp tekrar seç.", "warning");
  }
  state.settings.okulizyon = {
    ad: ad, okulNo: al("okulNo"),
    sinif: al("sinif") || "9",
    il: al("il"), ilkodu: secKod("il"),
    ilce: al("ilce"), ilcekodu: secKod("ilce"),
    okulAdi: al("okulAdi"), kurumkodu: secKod("okul")
  };
  const sifreEl = document.getElementById("okz-sifre");
  if (sifreEl && sifreEl.value) state.settings.okulizyon.sifre = sifreEl.value;
  saveState();
  const pm = document.getElementById("pwa-profile-modal");
  if (pm && pm.style.display === "flex") renderProfileModal();
  toast("Kaydedildi — şimdi Okulizyon'da aranıyor…", "info");
  // Kaydettikten hemen sonra gerçek çekimi dene (tek dokunuşla sonuç)
  setTimeout(function () { try { okzSunucuCek(); } catch (e) {} }, 500);
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

  if (!sb) return okzDurum("bulut-yok", "Bulut bağlantısı kurulamadı. Birazdan tekrar dene.");
  if (!currentUser) return okzDurum("giris-yok", "Giriş yapılmadı — sınav sonuçları hesaba bağlı. Önce giriş yap.");

  okzCekSuruyor = true;
  okzDersleriDuzelt();
  try {
    const { data, error } = await sb.from("okulizyon_kuyrugu")
      .select("exams, pulled_at, durum, durum_mesaji")
      .eq("user_id", currentUser.id)
      .maybeSingle();
    if (error) return okzDurum("hata", "Sonuçlar şu an alınamadı. Birazdan tekrar dene.");
    if (!data) return okzDurum("bos", "Bu hesap için sunucuda çekilmiş sonuç yok — «Şimdi dene» ile ilk çekimi başlat.");
    // Sunucu "giriş yapılamadı / şifre gerekli / sonuç yok" dediyse sebebi göster
    if (data.durum && data.durum !== "ok" && !(data.exams && data.exams.length)) {
      return okzDurum(data.durum, (data.durum_mesaji || "Okulizyon sonucu alınamadı.") + (OKZ_SEBEP[data.durum] ? " → " + OKZ_SEBEP[data.durum] : ""));
    }

    const st = okzStore();
    const pulledAt = Date.parse(data.pulled_at) || 0;
    st.sonCekim = data.pulled_at || null;
    const gelen = okzNormalize(data.exams || []);
    // Son çekilen sonucu HER ZAMAN sakla/göster (yeni olsun olmasın)
    st.sonSonuc = gelen.map(ex => ({
      name: ex.name || "", date: ex.date || "", lessons: ex.lessons || {},
      satir: (ex.rows || []).length, toplam: ex.toplam || null
    }));
    // --- Gerçek duruma göre karar ver (kayıt defterine değil) ---
    // Defter: daha önce işlenen/yoksayılan sınavlar kuyruğa geri konmaz
    const defter = okzDefter();
    const K = (window.OKZ && typeof window.OKZ.karar === "function")
      ? window.OKZ.karar(gelen, state.exams, defter)
      : { yeni: gelen, degisen: [], gecerliAnahtarlar: [] };
    const yeni = K.yeni, degisen = K.degisen, gecerliAnahtarlar = K.gecerliAnahtarlar;
    // Kayıt defterini gerçekle hizala: Denemelerim'de olmayan anahtarlar "aktarıldı" sayılmaz
    st.importedKeys = (st.importedKeys || []).filter(k => gecerliAnahtarlar.includes(k));
    gecerliAnahtarlar.forEach(k => { if (!st.importedKeys.includes(k)) st.importedKeys.push(k); });
    st.guncellenen = degisen;
    st.pending = yeni;
    const n = yeni.reduce((a, ex) => a + (ex.rows || []).length, 0);
    const guncelMi = pulledAt > (st.pulledAt || 0);
    if (guncelMi) st.pulledAt = pulledAt;
    saveState();
    if (n > 0) {
      addNotification({ title: "Okulizyon: " + n + " soru Analiz Bekliyor", body: yeni.map(e => e.name).join(", ").slice(0, 140), kind: "info", topicKey: "okz@" + data.pulled_at });
      okzBadge();
      if (guncelMi) openConfirm("Okulizyon'dan " + n + " soru geldi (Analiz Bekliyor). Şimdi nedenlerini seçmek ister misin?", openOkzModal);
      okzDurum("ok", "Okulizyon'dan " + gelen.length + " sınav okundu · " + n + " hatalı/boş soru Analiz Bekliyor kuyruğunda.");
    } else if (degisen.length) {
      okzDurum("ok", gelen.length + " sınav okundu · " + degisen.length + " sınavın sonucu Okulizyon'da DEĞİŞMİŞ — aşağıdan güncelleyebilirsin.");
    } else if (gelen.length) {
      okzDurum("ok", "Her şey güncel: " + gelen.length + " sınav okundu, Denemelerim'dekilerle aynı. (Son çekim: " +
        okzZaman(pulledAt || Date.now()) + ")");
    } else {
      okzDurum("sonuc-yok", "Okulizyon'a girildi ama sınav sonucu bulunamadı (son çekim: " + okzZaman(pulledAt || Date.now()) + ").");
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
async function okzAnalizKaydet(tekNeden) {
  // Kazanım → konu başlığı eşlemesi için indeksin yüklü olması gerekir
  await okzkYukle();
  const st = okzStore();
  const secimler = {};
  if (!tekNeden) document.querySelectorAll(".okz-reason").forEach(sel => { secimler[sel.dataset.i + ":" + sel.dataset.j] = sel.value; });
  let eklenen = 0, islenen = 0;
  st.pending.forEach((ex, i) => {
    const logs = [];
    (ex.rows || []).forEach((row, j) => {
      const r = tekNeden || secimler[i + ":" + j];
      if (r) {
        // Ders adını uygulamanın adına çevir, kazanımı konu başlığına eşle
        const k = okzKayitKonu(row.lesson, row.topic);
        const log = { qno: row.qno || j + 1, lesson: k.lesson, topic: k.topic, kazanim: k.kazanim, type: r, date: ex.date || todayStr() };
        // Video çözüm izi: Okulizyon sınav tablosunun ilk sütunu.
        if (row.video) log.video = row.video;
        if (row.videoVar || row.video) log.videoVar = true;
        if (row.status === "e") log.status = "e";
        logs.push(log);
      }
    });
    if (!logs.length) return;
    const hamDersler = ex.lessons && Object.keys(ex.lessons).length ? ex.lessons : {};
    const lessons = window.OKZ ? window.OKZ.birlestir(hamDersler, okzBilinenDersler()) : hamDersler;
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
      net: net,
      // Bu sınavın Okulizyon'daki sonuç sayfası (video düğmeleri orada)
      okulizyonUrl: ex.url || ""
    });
    eklenen += logs.length; islenen++;
    const anahtar = okzKey(ex);
    if (!st.importedKeys.includes(anahtar)) st.importedKeys.push(anahtar);
    st.aktarilan = st.aktarilan || {};
    st.aktarilan[anahtar] = okzHash(ex);
    // Kalıcı defter: bu sınav bu içerikle işlendi (silinse bile geri gelmez)
    okzDefterIkili(ex, window.OKZ && window.OKZ.kararHash ? window.OKZ.kararHash(ex) : okzHash(ex));
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
  // Açılışta sonucu tazele: kullanıcı hiçbir şeye basmadan "Analiz Bekliyor" dolsun.
  // (Yalnız oturum açıksa; giriş yoksa sessizce geç.)
  setTimeout(function () {
    try {
      if (typeof state === "undefined" || !sb || !currentUser) return;
      okzDersleriDuzelt();
      okzKonulariOnar(true).then(() => okzKuyrukCek(false));
    } catch (e) { /**/ }
  }, 2500);
}
if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", pwaArayuzKur);
else pwaArayuzKur();
window.addEventListener("load", pwaArayuzKur);
window.addEventListener("online", () => setTimeout(okzKuyrukCek, 3000));
