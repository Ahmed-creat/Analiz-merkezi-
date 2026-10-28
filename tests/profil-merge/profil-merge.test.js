/**
 * Profil + Okulizyon birleşik sürümü — gerçekçi DOM testi.
 *
 * ÖNEMLİ: Bu test GERÇEK site/index.html dosyasını yükler (inline uygulama
 * betikleri çalıştırılmaz) ve app-pwa.js'i olduğu gibi değerlendirir.
 * initAuthUI/initOkulizyonUI ELLE ÇAĞRILMAZ — sayfa kendi kendine kurmalıdır.
 * (Önceki sürümde bu fonksiyonlar elle çağrıldığı için "hiçbir yerde Profil yok"
 *  hatası teste yakalanmamıştı.)
 */
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const KOK = path.join(__dirname, "..", "..");
const html = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");

const vc = new VirtualConsole();
const jsdomHatalari = [];
vc.on("jsdomError", (e) => jsdomHatalari.push(String((e && e.message) || e)));

const dom = new JSDOM(html, {
  url: "https://analiz-merkezi.vercel.app/",
  pretendToBeVisual: true,
  virtualConsole: vc,
  runScripts: "outside-only" // inline uygulama betikleri çalışmasın, DOM gerçek olsun
});
const { window } = dom;
const { document } = window;

// --- index.html tarafında tanımlı olan global bağımlılıklar (stub) ---
window.state = {
  user: { name: "Ahmet İbrahim", grade: "10" },
  settings: { okulizyon: { ad: "AHMET İBRAHİM", okulNo: "1234", sinif: "10", il: "Gaziantep", ilce: "Şahinbey", okulAdi: "Akken Anadolu Lisesi" } },
  okulizyon: {
    pending: [{ name: "TYT Deneme 3", date: "2026-10-20", rows: [{ qno: 1, lesson: "Matematik", topic: "Türev", status: "w" }] }],
    importedKeys: [], pulledAt: 0,
    duyurular: [{ baslik: "Matematik sınavı", tarih: "2026-11-02", url: "https://ornek", lesson: "Matematik" }]
  },
  exams: [], questions: [], topics: {}
};
window.saveState = function () { window.__kayitSayisi = (window.__kayitSayisi || 0) + 1; };
window.toast = function (m, k) { window.__toasts = (window.__toasts || []).concat([k + ":" + m]); };
window.escHtml = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
window.lucide = { createIcons() {} };
window.fetch = () => Promise.reject(new Error("ağ kapalı (test)"));

// --- app-pwa.js: ES modül import satırlarını at, sayfa bağlamında değerlendir ---
let src = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
src = src.replace(/^import .*$/gm, "");
src = 'window.SUPABASE_CONFIG = { url: "", anonKey: "" }; window.FIREBASE_CONFIG = {}; window.FCM_VAPID_KEY = "";\n' + src;
let yuklemeHatasi = null;
try { window.eval(src); } catch (e) { yuklemeHatasi = String(e && (e.stack || e.message)); }

// JSDOM belgeyi asenkron ayrıştırır: gerçek tarayıcıdaki gibi "load"u bekle
const sayfaHazir = new Promise((coz) => {
  if (document.readyState === "complete") return coz();
  window.addEventListener("load", () => coz());
  setTimeout(coz, 4000); // güvenlik ağı
});

(async () => {
await sayfaHazir;
if (yuklemeHatasi) console.log("MODÜL YÜKLEME HATASI:", yuklemeHatasi);
const jsdomIlgili = jsdomHatalari.filter((h) => !/Not implemented/.test(h));
if (jsdomIlgili.length) console.log("JSDOM HATALARI:", jsdomIlgili.slice(0, 3));

const kontrol = [];
function bekle(ad, kosul) { kontrol.push([ad, !!kosul]); }
const tiklama = (el) => el && el.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));

// ---------- 0) Sayfa kendi kendine kuruldu mu? (asıl regresyon) ----------
bekle("modül hatasız yüklendi", !yuklemeHatasi);
bekle("initAuthUI kendiliğinden çalıştı (__pwaProfileHooked)", window.__pwaProfileHooked === true);
bekle("initOkulizyonUI kendiliğinden çalıştı (__okzHooked)", window.__okzHooked === true);
bekle("window.__profilAc tanımlı", typeof window.__profilAc === "function");

// ---------- 1) Profil'e giriş noktaları gerçek HTML'de var mı? ----------
const navBtn = document.getElementById("pwa-profile-nav");
const moreBtn = document.getElementById("pwa-profile-more");
const tabBtn = document.getElementById("pwa-profile-tab");
const userKart = document.getElementById("sidebar-user");
bekle("yan menüde 'Profil & Okulizyon' sekmesi var", navBtn && /Profil/.test(navBtn.textContent));
bekle("DAHA sayfasında Profil maddesi var", moreBtn && /Profil/.test(moreBtn.textContent));
bekle("mobil alt menüde Profil sekmesi var", tabBtn && /Profil/.test(tabBtn.textContent));
bekle("kullanıcı kartı tıklanabilir (cursor:pointer)", userKart && userKart.style.cursor === "pointer");
bekle("profil sekmeleri data-act=openProfile taşıyor",
  [navBtn, moreBtn, tabBtn].every((el) => el && el.dataset.act === "openProfile"));
bekle("eski yan menü Giriş butonu yok", !document.getElementById("pwa-auth-btn"));
bekle("eski yan menü Okulizyon butonu yok", !document.getElementById("pwa-okz-btn"));

// ---------- 2) Tıklayınca Profil penceresi açılıyor mu? ----------
const profil = () => document.getElementById("pwa-profile-modal");
tiklama(navBtn);
bekle("yan menü sekmesine tıklayınca profil penceresi açıldı", profil() && profil().style.display === "flex");
const icerik = profil() ? profil().innerHTML : "";
bekle("HESAP bölümü var", icerik.includes("HESAP"));
bekle("OKULIZYON BAĞLANTISI bölümü var", icerik.includes("OKULIZYON BAĞLANTISI"));
bekle("okul no alanı var", !!document.getElementById("okz-okulNo"));
bekle("ad alanı kayıtlı değerle dolu", (document.getElementById("okz-ad") || {}).value === "AHMET İBRAHİM");
bekle("il seçimi Gaziantep", (document.getElementById("okz-il") || {}).value === "Gaziantep");
bekle("analiz bekliyor sayısı görünüyor", icerik.includes("1 soru bekliyor"));
bekle("sürüm damgası görünüyor", /v34\./.test(icerik));

// kapat → başka giriş noktalarından aç
tiklama(document.querySelector("#pwa-profile-modal [data-act='pwaProfileClose']"));
bekle("profil penceresi kapandı", profil().style.display === "none");
tiklama(tabBtn);
bekle("mobil alt menü sekmesinden açıldı", profil().style.display === "flex");
tiklama(document.querySelector("#pwa-profile-modal [data-act='pwaProfileClose']"));
tiklama(userKart);
bekle("kullanıcı kartından açıldı", profil().style.display === "flex");

// ---------- 3) Giriş (Supabase) akışı erişilebilir mi? ----------
const girisBtn = document.querySelector("#pwa-profile-modal [data-act='pwaAuth']");
bekle("profilden 'Giriş Yap / Kayıt Ol' butonu var", girisBtn && /Giriş Yap/.test(girisBtn.textContent));
tiklama(girisBtn);
const authModal = document.getElementById("pwa-auth-modal");
bekle("giriş penceresi açıldı", authModal && authModal.style.display === "flex");
bekle("e-posta + şifre alanları var", !!document.getElementById("pwa-email") && !!document.getElementById("pwa-pass"));
bekle("Google ile giriş seçeneği var", !!document.querySelector("#pwa-auth-modal [data-act='pwaAuthGoogle']"));
tiklama(document.querySelector("#pwa-auth-modal [data-act='pwaAuthClose']"));
bekle("giriş penceresi kapandı", authModal.style.display === "none");

// ---------- 4) Okulizyon kuyruk penceresi ----------
tiklama(document.querySelector("#pwa-profile-modal [data-act='pwaOkz']"));
const okz = document.getElementById("pwa-okz-modal");
bekle("okz penceresi açıldı", okz && okz.style.display === "flex");
bekle("okz penceresinde form yok (Profile taşındı)", okz && !okz.innerHTML.includes('id="okz-ad"'));
bekle("okz penceresinde kuyruk var", okz && okz.innerHTML.includes("Analiz Bekliyor"));
bekle("okz penceresi Profile yönlendiriyor", okz && okz.innerHTML.includes("Profili Aç"));

// ---------- 5) Bilgi kaydetme + badge ----------
document.getElementById("okz-okulNo").value = "9876";
tiklama(document.querySelector("#pwa-profile-modal [data-act='okzSaveBilgi']"));
bekle("okul no kaydedildi", window.state.settings.okulizyon.okulNo === "9876");
bekle("saveState çağrıldı", (window.__kayitSayisi || 0) > 0);
const badge = document.querySelector("#pwa-profile-nav .pwa-okz-badge");
bekle("yan menüdeki badge sayısı 1", badge && badge.textContent === "1" && badge.style.display === "inline-block");

let hata = 0;
for (const [ad, ok] of kontrol) { if (!ok) { hata++; console.log("❌ " + ad); } else console.log("✅ " + ad); }
console.log("\n" + (kontrol.length - hata) + "/" + kontrol.length + " test geçti");
process.exit(hata ? 1 : 0);
})().catch((e) => { console.log("TEST ÇÖKTÜ:", e && (e.stack || e.message)); process.exit(1); });
