// ============================================================
// v108 — ZORUNLU İLK KURULUM: GERÇEK DAVRANIŞ TESTİ
// tests/kurulum-v108.test.js
// ------------------------------------------------------------
// KULLANICI: "Yeni kayıtta bu adım zorunlu değil mi? Öğrenci e-posta
// veya şifreyle kaydolsun, sonra direk bilgi paneli gelsin: ad soyad,
// sınıf, il, ilçe, okul, okul no — ve o anahtarı seçer."
//
// Metin aranmaz: site/app-pwa.js'in kurulum fonksiyonları alınır, sahte
// bir DOM'a karşı GERÇEKTEN koşturulur. Ölçülen:
//   1) Akış gerçekten zorunlu (kilit yoksa panel açılır)
//   2) Eksik bilgiyle 1. adım geçilemez
//   3) Şifre ≥8 ve iki alan aynı olmalı
//   4) Onay kutusu işaretlenmeden bitmez
//   5) Bitince işaret yazılır, panel kapanır
// ============================================================
const fs = require("fs");
const path = require("path");

const KOK = path.resolve(__dirname, "..");
const APP = fs.readFileSync(path.join(KOK, "site/app-pwa.js"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
const ok = (ad, kosul, ayrinti) => {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { kalan++; hatalar.push(ad + (ayrinti ? " → " + ayrinti : "")); console.log("  ✗ " + ad + (ayrinti ? " → " + ayrinti : "")); }
};

/* ---------- sahte DOM ---------- */
function eleman(id) {
  return {
    id,
    value: "",
    checked: false,
    disabled: false,
    placeholder: "",
    textContent: "",
    innerHTML: "",
    style: { cssText: "", display: "none", opacity: "", cursor: "" },
    dataset: {},
    children: [],
    _dinleyici: {},
    addEventListener(olay, fn) { (this._dinleyici[olay] = this._dinleyici[olay] || []).push(fn); },
    remove() { this._silindi = true; },
    focus() { this._odak = true; },
    setAttribute() { },
    removeAttribute() { },
    insertBefore() { },
    querySelector(sec) { return belge._eleman(sec); },
    querySelectorAll() { return []; },
  };
}

const belge = {
  _ogeler: {},
  _eleman(sec) {
    if (!sec) return null;
    const id = String(sec).replace(/^#/, "");
    return this._ogeler[id] || null;
  },
  getElementById(id) { return this._ogeler[id] || null; },
  querySelector(sec) { return this._eleman(sec); },
  querySelectorAll() { return []; },
  createElement() { return eleman("yeni-" + Math.random().toString(36).slice(2, 7)); },
  body: {
    appendChild(el) {
      // Panel kendi kimliğini (am-kurulum) ekledikten sonra eklenir; test
      // kapanıp kapanmadığını buradan görür.
      if (el && el.id) belge._ogeler[el.id] = el;
    }
  },
  addEventListener() { },
  activeElement: null,
};

const depo = {};
globalThis.localStorage = {
  getItem: (k) => (k in depo ? depo[k] : null),
  setItem: (k, v) => { depo[k] = String(v); },
  removeItem: (k) => { delete depo[k]; },
};
globalThis.document = belge;
globalThis.window = globalThis;
globalThis.toast = () => { };
globalThis.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ liste: [] }) });
globalThis.state = { settings: {} };
globalThis.saveState = () => { };
globalThis.currentUser = { id: "u1", email: "ogrenci@ornek.com" };
globalThis.SUPABASE_CONFIG = { url: "https://ornek.supabase.co", anonKey: "anon" };
globalThis.KASA = { kasaVarMi: () => false, kasaAcikMi: () => false };
globalThis.okzSecimleriDoldur = () => { };

/* Kilit sahte: gerçek kripto yerine "kuruldu" der (kripto kasa-v106'da ölçülüyor). */
globalThis.kasaKurVeAnahtar = async (sifre) => {
  if (!sifre || sifre.length < 8) return { ok: false, hata: "Şifre en az 8 karakter olmalı." };
  globalThis.KASA = { kasaVarMi: () => true, kasaAcikMi: () => true };
  return { ok: true, kelimeler: "elma kedi yol deniz bulut kalem taş ırmak gül yaprak ay güneş" };
};

/* app-pwa.js yalnız KURULUM bölümü kesilip koşturulur. */
const i = APP.indexOf("const KURULUM_TAM_KEY");
const j = APP.indexOf("async function kasaAcTiklandi()");
if (i < 0 || j <= i) { console.log("✗ kurulum bölümü bulunamadı"); process.exit(1); }
const KOD = APP.slice(i, j);

/* Uygulama kodu "currentUser", "KASA", "state" gibi DIŞ değişkenleri okur.
   Bunlar zamanla değiştiği için değer değil KAPSAM veriyoruz: with(baglam)
   içindeki her okuma, çağrı anındaki değeri görür. */
const baglam = {
  get KASA() { return globalThis.KASA; },
  get state() { return globalThis.state; },
  get currentUser() { return globalThis.currentUser; },
  get saveState() { return globalThis.saveState; },
  get SUPABASE_CONFIG() { return globalThis.SUPABASE_CONFIG; },
  get toast() { return globalThis.toast; },
  get document() { return belge; },
  get localStorage() { return globalThis.localStorage; },
  get kasaKurVeAnahtar() { return globalThis.kasaKurVeAnahtar; },
  okzSecimleriDoldur() { },
};
const api = new Function("baglam",
  "with (baglam) {\n" + KOD +
  "\nreturn { kurulumPaneli, kurulumGerekli, kurulumAkisi, kurMetinYaz, KURULUM_TAM_KEY };\n}"
)(baglam);

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  console.log("\n== 1) Kurulum gerçekten ZORUNLU mu? ==");
  {
    globalThis.KASA = { kasaVarMi: () => false, kasaAcikMi: () => false };
    globalThis.currentUser = { id: "u1", email: "ogrenci@ornek.com" };
    ok("kilit yoksa kurulum gerekli", (await api.kurulumGerekli()) === true);
    ok("işaret tanımlı", api.KURULUM_TAM_KEY === "am_kurulum_tam_v1");

    globalThis.KASA = { kasaVarMi: () => true, kasaAcikMi: () => true };
    ok("kilit açıksa gerekli değil", (await api.kurulumGerekli()) === false);
    globalThis.KASA = { kasaVarMi: () => false, kasaAcikMi: () => false };
    globalThis.currentUser = null;
    ok("giriş yoksa panel çıkmaz", (await api.kurulumGerekli()) === false);
    globalThis.currentUser = { id: "u1", email: "ogrenci@ornek.com" };
  }

  console.log("\n== 1b) VERİ KAYBI KORUMASI: açık olmayan kilidin üzerine yeni kilit ==");
  {
    // kasaKurVeAnahtar'ın koruma dalını gerçek kodla ölç.
    const bas = APP.indexOf("async function kasaKurVeAnahtar(sifre) {");
    const son = APP.indexOf("async function kasaKurTiklandi()");
    const korunan = new Function("KASA", "window", "localStorage",
      APP.slice(bas, son) +
      "\nfunction kasaSarmayiStateeYaz(){}" + // bu kesitte yok: yan etkisi ölçülmüyor
      "\nreturn kasaKurVeAnahtar;");
    const koru = korunan({ kasaVarMi: () => true, kasaAcikMi: () => false }, globalThis,
      { removeItem() { } });
    const r = await koru("guclu-sifre-1");
    ok("kilit var + kapalı → YENİ kilit kurulmuyor (veri kaybı yok)",
      r.ok === false && /zaten bir kilit var/.test(r.hata || ""), r.hata);

    // Kilit hiç yoksa kurulur (bu yolun açık kalması şart).
    const serbest = korunan({ kasaVarMi: () => false, kasaAcikMi: () => false }, globalThis,
      { removeItem() { } });
    globalThis.window.__kasa = {
      kur: async () => ({ ok: true }),
      kurtarmaUret: () => "bir iki üç dört beş altı yedi sekiz dokuz on onbir oniki",
      kurtarmaSar: async () => ({ t: "x" }),
    };
    const r2 = await serbest("guclu-sifre-1");
    ok("kilit yoksa kurulum yapılıyor", r2.ok === true);

    // Açık kilit varsa da (profilde şifre değiştirme yolu) kurulabilir.
    const acik = korunan({ kasaVarMi: () => true, kasaAcikMi: () => true }, globalThis,
      { removeItem() { } });
    ok("kilit açıkken kurulum engellenmiyor", (await acik("guclu-sifre-1")).ok === true);
  }

  console.log("\n== 2) Panel: üç adım, eksik bilgiyle geçiş yok ==");
  {
    const idler = ["kur-ad", "kur-okulno", "kur-sinif", "kur-il", "kur-ilce", "kur-okul",
      "kur-hata1", "kur-hata2", "kur-hata3", "kur-sifre", "kur-sifre2",
      "kur-onay", "kur-bitir", "kur-kur", "kur-indir", "kur-kelimeler",
      "kur-adim1", "kur-adim2", "kur-adim3", "kur-ileri", "kur-il-liste", "kur-ilce-liste", "kur-okul-liste"];
    idler.forEach((id) => { belge._ogeler[id] = eleman(id); });
    belge._ogeler["kur-sinif"].value = "9";
    belge._ogeler["kur-adim1"].style.display = "block";
    belge._ogeler["kur-adim2"].style.display = "none";
    belge._ogeler["kur-adim3"].style.display = "none";

    let ileriFn = null, kurFn = null, bitirFn = null, indirFn = null, onayFn = null;
    belge._ogeler["kur-ileri"].addEventListener = (o, fn) => { if (o === "click") ileriFn = fn; };
    belge._ogeler["kur-kur"].addEventListener = (o, fn) => { if (o === "click") kurFn = fn; };
    belge._ogeler["kur-bitir"].addEventListener = (o, fn) => { if (o === "click") bitirFn = fn; };
    belge._ogeler["kur-indir"].addEventListener = (o, fn) => { if (o === "click") indirFn = fn; };
    belge._ogeler["kur-onay"].addEventListener = (o, fn) => { if (o === "change") onayFn = fn; };

    // Panel kendi dinleyicilerini "document" üzerinden bizim düğümlerimize bağlar.
    api.kurulumPaneli();

    ok("üç adımın düğümleri var", !!(ileriFn && kurFn && bitirFn && indirFn));
    ok("panelde kapatma düğmesi YOK",
      !/id="kur-kapat"|>Kapat<|>✕</.test(APP.slice(APP.indexOf("function kurulumPaneli"), APP.indexOf("function kurMetinYaz"))));

    // 1. adım: eksikler
    ileriFn();
    ok("boş ad soyad → geçmiyor", belge._ogeler["kur-adim2"].style.display === "none" &&
      /Ad soyadını yaz/.test(belge._ogeler["kur-hata1"].textContent));

    belge._ogeler["kur-ad"].value = "zeynep kaya";
    ileriFn();
    ok("okul no yok → geçmiyor", /Okul numaranı yaz/.test(belge._ogeler["kur-hata1"].textContent));

    belge._ogeler["kur-okulno"].value = "1234";
    ileriFn();
    ok("il/ilçe/okul yok → geçmiyor", /İl, ilçe ve okulunu yaz/.test(belge._ogeler["kur-hata1"].textContent));

    // 1. adım: tam bilgi
    belge._ogeler["kur-il"].value = "Gaziantep";
    belge._ogeler["kur-ilce"].value = "Şahinbey";
    belge._ogeler["kur-okul"].value = "19 Mayıs Anadolu Lisesi";
    ileriFn();
    ok("tam bilgi → adım 2 açıldı", belge._ogeler["kur-adim2"].style.display === "block");
    ok("ad BÜYÜK harfe çevrildi", globalThis.state.settings.okulizyon.ad === "ZEYNEP KAYA",
      globalThis.state.settings.okulizyon.ad);
    ok("okul no + sınıf + il kaydedildi",
      globalThis.state.settings.okulizyon.okulNo === "1234" &&
      globalThis.state.settings.okulizyon.sinif === "9" &&
      globalThis.state.settings.okulizyon.il === "Gaziantep");

    // 2. adım: şifre
    belge._ogeler["kur-sifre"].value = "kisa";
    belge._ogeler["kur-sifre2"].value = "kisa";
    await kurFn();
    ok("kısa şifre reddedildi", /8 karakter/.test(belge._ogeler["kur-hata2"].textContent) &&
      belge._ogeler["kur-adim3"].style.display === "none");

    belge._ogeler["kur-sifre"].value = "guclu-sifre-1";
    belge._ogeler["kur-sifre2"].value = "baska-sifre-2";
    await kurFn();
    ok("uyuşmayan şifreler reddedildi", /aynı değil/.test(belge._ogeler["kur-hata2"].textContent));

    belge._ogeler["kur-sifre"].value = "guclu-sifre-1";
    belge._ogeler["kur-sifre2"].value = "guclu-sifre-1";
    await kurFn();
    ok("geçerli şifre → 12 kelime adımı", belge._ogeler["kur-adim3"].style.display === "block");
    ok("12 kelime ekranda (indirilebilir)", String(belge._ogeler["kur-kelimeler"].textContent).trim().split(/\s+/).length === 12,
      belge._ogeler["kur-kelimeler"].textContent);

    // 3. adım: onay
    belge._ogeler["kur-onay"].checked = false;
    bitirFn();
    ok("onaysız bitmiyor", /kâğıda yazdım/.test(belge._ogeler["kur-hata3"].textContent) &&
      depo["am_kurulum_tam_v1"] === undefined);

    if (onayFn) { belge._ogeler["kur-onay"].checked = true; onayFn(); }
    belge._ogeler["kur-onay"].checked = true;
    bitirFn();
    ok("onayla bitiyor + işaret yazılıyor", depo["am_kurulum_tam_v1"] === "1");
    ok("bitince panel kapanıyor", !belge._eleman("am-kurulum") || belge._eleman("am-kurulum")._silindi === true);
    ok("bitince akış artık zorunlu değil", (await api.kurulumGerekli()) === false);
  }

  console.log("\n" + "─".repeat(60));
  if (kalan) {
    console.log("\n✗ " + kalan + " kontrol kaldı (" + gecen + " geçti)");
    hatalar.forEach((h) => console.log("  · " + h));
    process.exit(1);
  }
  console.log("v108 kurulum davranış testi — " + gecen + "/" + gecen + " geçti ✓");
})();
