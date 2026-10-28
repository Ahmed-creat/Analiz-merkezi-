const fs = require("fs");
const { JSDOM } = require("jsdom");

const html = `<!doctype html><html><body>
<div class="sidebar">
  <div class="sidebar-user">
    <div id="sidebar-avatar"></div>
    <div><div id="sidebar-user-name">Ahmet</div><div id="sidebar-user-grade">10. Sınıf</div></div>
  </div>
  <nav class="sidebar-nav" id="sidebar-nav"><button class="nav-item" data-nav="dashboard"><span>Ana Sayfa</span></button></nav>
  <div class="sidebar-footer"></div>
</div>
<nav id="more-sheet"><button class="ms-item">Görevler</button></nav>
<main id="main-content"></main>
</body></html>`;

const { VirtualConsole } = require("jsdom");
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => console.log("JSDOM HATA:", e && (e.stack || e.message)));
vc.on("error", (...a) => console.log("KONSOL HATA:", ...a));
vc.on("warn", (...a) => console.log("KONSOL UYARI:", ...a));
vc.on("log", (...a) => console.log("KONSOL:", ...a));
const dom = new JSDOM(html, { url: "https://analiz-merkezi.vercel.app/", pretendToBeVisual: true, virtualConsole: vc, runScripts: "dangerously" });
const { window } = dom;
global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.location = window.location;
global.localStorage = window.localStorage;

// Uygulama bağımlılıkları (index.html tarafında tanımlı olanlar)
window.state = {
  user: { name: "Ahmet İbrahim", grade: "10" },
  settings: { okulizyon: { ad: "AHMET İBRAHİM", okulNo: "1234", sinif: "10", il: "Gaziantep", ilce: "Şahinbey", okulAdi: "Akken Anadolu Lisesi" } },
  okulizyon: { pending: [{ name: "TYT Deneme 3", date: "2026-10-20", rows: [{ qno: 1, lesson: "Matematik", topic: "Türev", status: "w" }] }], importedKeys: [], pulledAt: 0, duyurular: [{ baslik: "Matematik sınavı", tarih: "2026-11-02", url: "https://ornek", lesson: "Matematik" }] },
  exams: [], questions: [], topics: {}
};
window.saveState = function () { window.__kayitSayisi = (window.__kayitSayisi || 0) + 1; };
window.toast = function (m, k) { window.__toasts = (window.__toasts || []).concat([k + ":" + m]); };
window.lucide = { createIcons() {} };

// app-pwa.js'i ES modül import satırlarından arındırıp klasik script olarak yükle
let src = fs.readFileSync(require("path").join(__dirname, "..", "..", "site", "app-pwa.js"), "utf8");
src = src.replace(/^import .*$/gm, "");
src = src.replace('import { SUPABASE_CONFIG } from "./supabase-config.js";', "");
src = src.replace('import { FIREBASE_CONFIG, FCM_VAPID_KEY } from "./firebase-config.js";', "");
src = `window.SUPABASE_CONFIG = { url: "", anonKey: "" }; window.FIREBASE_CONFIG = {}; window.FCM_VAPID_KEY = "";\n`
  + "(async () => {\n" + src + "\n"
  + "window.openProfileModal = openProfileModal; window.initOkulizyonUI = initOkulizyonUI; window.initAuthUI = initAuthUI; window.openOkzModal = openOkzModal;"
  + "window.okzSaveBilgi = okzSaveBilgi; window.okzBadge = okzBadge; window.renderProfileModal = renderProfileModal;"
  + "\n})().catch(e => { window.__iifeHata = String(e && (e.stack || e.message)); });";

const el = window.document.createElement("script");
el.textContent = src;
window.document.body.appendChild(el);
window.initAuthUI();
window.initOkulizyonUI();

if (window.__iifeHata) console.log("IIFE HATA:", window.__iifeHata);
const kontrol = [];
function bekle(ad, kosul) { kontrol.push([ad, !!kosul]); }

bekle("initAuthUI çalıştı", window.__pwaProfileHooked);
bekle("yan menüde Profil sekmesi var", window.document.getElementById("pwa-profile-nav"));
bekle("DAHA sayfasında Profil maddesi var", window.document.getElementById("pwa-profile-more"));
bekle("eski sidebar Giriş butonu yok", !window.document.getElementById("pwa-auth-btn"));
bekle("eski sidebar Okulizyon butonu yok", !window.document.getElementById("pwa-okz-btn"));

window.openProfileModal();
const modal = window.document.getElementById("pwa-profile-modal");
const icerik = modal ? modal.innerHTML : "";
bekle("profil penceresi açıldı", modal && modal.style.display === "flex");
bekle("HESAP bölümü var", icerik.includes("HESAP"));
bekle("OKULIZYON BAĞLANTISI bölümü var", icerik.includes("OKULIZYON BAĞLANTISI"));
bekle("okul no alanı var", window.document.getElementById("okz-okulNo"));
bekle("ad alanı dolu", (window.document.getElementById("okz-ad") || {}).value === "AHMET İBRAHİM");
bekle("analiz bekliyor sayısı görünüyor", icerik.includes("1 soru bekliyor"));
bekle("sürüm damgası görünüyor", icerik.includes("v34.0-supabase-pools"));

// Okulizyon penceresi: form kaldırıldı, kuyruk kaldı
window.openOkzModal();
const okz = window.document.getElementById("pwa-okz-modal").innerHTML;
bekle("okz penceresinde form yok", !okz.includes('id="okz-ad"'));
bekle("okz penceresinde kuyruk var", okz.includes("Analiz Bekliyor"));
bekle("okz penceresi profile yönlendiriyor", okz.includes("Profili Aç"));

// Bilgi kaydetme
window.document.getElementById("okz-okulNo").value = "9876";
window.okzSaveBilgi();
bekle("okul no kaydedildi", window.state.settings.okulizyon.okulNo === "9876");
bekle("saveState çağrıldı", window.__kayitSayisi > 0);

// Badge
window.okzBadge();
const badge = window.document.querySelector(".pwa-okz-badge");
bekle("badge sayısı 1", badge && badge.textContent === "1" && badge.style.display === "inline-block");

let hata = 0;
for (const [ad, ok] of kontrol) { if (!ok) { hata++; console.log("❌ " + ad); } else console.log("✅ " + ad); }
console.log("\n" + (kontrol.length - hata) + "/" + kontrol.length + " test geçti");
process.exit(hata ? 1 : 0);
