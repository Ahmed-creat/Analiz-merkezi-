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
    _ozellik: {},
    setAttribute(k, v) { this._ozellik[k] = v; },
    removeAttribute(k) { delete this._ozellik[k]; },
    getAttribute(k) { return this._ozellik[k]; },
    getBoundingClientRect() { return { top: 0, left: 0, height: 34, width: 200 }; },
    setSelectionRange() { },
    get classList() { return { contains: (c) => c === "am-sifre-kutu" && this.className === "am-sifre-kutu" }; },
    insertBefore(yeni) { yeni.children.push(this); return yeni; },
    appendChild(c) { this.children.push(c); return c; },
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
  if (!sifre || sifre.length < 6) return { ok: false, hata: "Şifre en az 6 karakter olmalı." };
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
  "\nreturn { kurulumPaneli, kurulumGerekli, kurulumAkisi, kurMetinYaz, kurulumBilgiVarMi, KURULUM_TAM_KEY };\n}"
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
    // Bu bölüm "bilgiler EKSİK" senaryosunu ölçer: kayıtlı bilgi yok.
    globalThis.state = { settings: {} };
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
    ok("kısa şifre reddedildi", /6 karakter/.test(belge._ogeler["kur-hata2"].textContent) &&
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

  console.log("\n== 3) BİLGİLER KAYITLIYSA: panel doğrudan GİRİŞ ŞİFRESİYLE açılır ==");
  {
    // KULLANICI: "Zaten Okulizyon bilgileri kayıtlı kişilere sadece giriş
    // şifresi bölümünü açmak gerekiyor."
    globalThis.KASA = { kasaVarMi: () => false, kasaAcikMi: () => false };
    globalThis.currentUser = { id: "u2", email: "kayitli@ornek.com" };
    globalThis.state = {
      settings: {
        okulizyon: {
          ad: "ZEYNEP KAYA", okulNo: "1234", sinif: "11",
          il: "Gaziantep", ilkodu: "27", ilce: "Şahinbey", ilcekodu: "2701",
          okulAdi: "19 Mayıs Anadolu Lisesi", kurumkodu: "750001",
        },
      },
    };
    delete depo["am_kurulum_tam_v1"];

    ok("bilgi hazır kabul ediliyor", api.kurulumBilgiVarMi() === true);

    // Panelin ürettiği HTML'de 1. adım gizli, 2. adım açık olmalı.
    let html = "";
    const sahte = eleman("am-kurulum-sahte");
    const gercekCreate = belge.createElement;
    belge.createElement = function () { const e = eleman("am-kurulum"); return e; };
    belge.body.appendChild = function (el) { html = String(el.innerHTML || ""); belge._ogeler["am-kurulum"] = el; };
    api.kurulumPaneli();
    belge.createElement = gercekCreate;

    ok("1. adım GİZLİ (bilgiler sorulmuyor)", /id="kur-adim1" style="display:none;"/.test(html));
    ok("2. adım AÇIK (yalnız giriş şifresi)", /id="kur-adim2">/.test(html));
    ok("başlık 'Giriş şifreni belirle'", /Giriş şifreni belirle/.test(html));
    ok("kayıtlı bilgiler özet olarak gösteriliyor",
      /ZEYNEP KAYA/.test(html) && /1234/.test(html) && /19 Mayıs/.test(html));
    ok("bilgi isteme metni YOK", !/Bilgilerini tamamla/.test(html));
    ok("12 kelime adımı yine gizli (şifreden sonra)", /id="kur-adim3" style="display:none;"/.test(html));

    // Eksik bilgi → 1. adım geri gelir
    ok("okul no yoksa bilgi EKSİK sayılır",
      api.kurulumBilgiVarMi({ ad: "A", okulNo: "", il: "G", ilce: "Ş", okulAdi: "X" }) === false);
    ok("il yoksa bilgi EKSİK sayılır",
      api.kurulumBilgiVarMi({ ad: "A", okulNo: "1", il: "", ilce: "Ş", okulAdi: "X" }) === false);
    ok("yalnız ad+okulno yetmez (okul gerekli)",
      api.kurulumBilgiVarMi({ ad: "A", okulNo: "1", il: "G", ilce: "Ş", okulAdi: "" }) === false);
  }

  console.log("\n== 4) Bulut kaydı bekleme (bilgi yüklenmeden adım sorulmaz) ==");
  {
    ok("bulut yüklemesi bitmeden panel açılmıyor",
      /window\.__bulutYuklemeBitti \|\| Date\.now\(\) > sinir/.test(APP));
    ok("yükleme bitince işaret yazılıyor", /window\.__bulutYuklemeBitti = true;/.test(APP));
    ok("yeni kullanıcıda işaret sıfırlanıyor", /window\.__bulutYuklemeBitti = false;/.test(APP));
  }

  console.log("\n== 5) ŞİFREYİ GÖSTER — göz ikonu (kullanıcı isteği) ==");
  {
    // Gerçek fonksiyonlar: sifreGozKur + sifreGozleriKur
    /* v112 — ikon sabitleri (GOZ_IKON_ACIK/KAPALI) sifreGozKur'dan ÖNCE
       tanımlı; dilim onları da kapsamalı, yoksa çalışma anında tanımsız kalır. */
    const gozKodu = APP.slice(
      APP.indexOf("const GOZ_IKON_ACIK"),
      APP.indexOf("function cloudReady()")
    );
    // Şifre alanı + ebeveyn
    const alan = eleman("test-sifre");
    alan.type = "password";
    alan.value = "Gizli123";
    // Sahte DOM'da kutu.querySelector gerçek alanı döndürsün (tarayıcıda
    // selector zaten alanı bulur; burada taklit ediyoruz).
    const gozBelge = {
      createElement() {
        const e = eleman("goz-" + Math.random().toString(36).slice(2, 7));
        e.querySelector = () => alan;
        return e;
      },
    };
    const gozApi = new Function("document", "window",
      gozKodu + "\nreturn { sifreGozKur, sifreGozleriKur };"
    )(gozBelge, globalThis);

    const ebeveyn = eleman("kapsam");
    alan.parentNode = ebeveyn;
    ebeveyn.insertBefore = function (yeni, once) { yeni.parentNode = this; this._eklenen = yeni; return yeni; };
    const kapsam = { querySelectorAll: () => [alan] };

    gozApi.sifreGozleriKur(kapsam);
    const kutu = ebeveyn._eklenen;
    ok("şifre alanı sarmalandı (am-sifre-kutu)", !!kutu && kutu.className === "am-sifre-kutu");

    const btn = (kutu && kutu.children || []).find((c) => c.className === "am-goz");
    /* v112 — KULLANICI: "Emoji kullanma, klasik şifre alanındaki göz ikonunu kullan."
       İkon artık EMOJİ DEĞİL, satır içi SVG. */
    ok("göz düğmesi eklendi", !!btn);
    ok("ikon SVG (emoji değil)", !!btn && /^<svg /.test(btn.innerHTML || ""));
    ok("açık göz ikonu çizili", !!btn && btn.innerHTML.indexOf("<circle") > 0);
    ok("ikon metni/düğmede emoji yok", !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(String(btn && btn.innerHTML)));
    ok("düğme şifre gösterme modunda (aria-pressed=false)",
      btn && btn._ozellik["aria-pressed"] === "false" && /göster/i.test(btn._ozellik["aria-label"] || ""));
    ok("alanın sağında düğmeye yer açıldı", /42px/.test(alan.style.paddingRight || ""));

    // Tıklayınca şifre GÖRÜNÜR
    btn._dinleyici.click[0]({ preventDefault() { }, stopPropagation() { } });
    ok("tıklayınca şifre görünür (type=text)", alan.type === "text");
    ok("düğme 'gizle' moduna geçti", /gizle/i.test(btn._ozellik["aria-label"] || ""));
    ok("ikon üstü çizili göze döndü", /M3 3l18 18/.test(btn.innerHTML || ""));

    // Tekrar tıklayınca gizlenir
    btn._dinleyici.click[0]({ preventDefault() { }, stopPropagation() { } });
    ok("ikinci tıklamada yeniden gizlenir (type=password)", alan.type === "password");
    ok("ikon açık göze döndü", /<circle/.test(btn.innerHTML || "") && !/M3 3l18 18/.test(btn.innerHTML || ""));

    // Değer korunuyor mu? (göz değiştirirken şifre kaybolmasın)
    ok("şifre değeri korunuyor", alan.value === "Gizli123");

    // İki kez kurulum düğmeyi çoğaltmaz
    gozApi.sifreGozKur(kutu);
    ok("aynı alana ikinci göz eklenmiyor", kutu.children.filter((c) => c.className === "am-goz").length === 1);

    ok("uygulama kodunda göz emojisi YOK", !/👁|🙈/.test(APP));

    // Uygulamanın her şifre penceresinde çağrılıyor mu?
    ok("giriş ekranında kuruluyor", /try \{ sifreGozleriKur\(m\); \}/.test(APP));
    ok("kurulum panelinde kuruluyor", /try \{ sifreGozleriKur\(d\); \}/.test(APP));
    ok("profil penceresinde kuruluyor", /m\.innerHTML = html;\s*\n\s*try \{ sifreGozleriKur\(m\); \}/.test(APP));
    const cagriSayisi = (APP.match(/sifreGozleriKur\(/g) || []).length;
    ok("en az 4 pencereye bağlı (tanım + 4 çağrı)", cagriSayisi >= 5, String(cagriSayisi));
  }

  console.log("\n== 6) OKUL SİTESİ ÇEKİMİ KALDIRILDI (v111 — kullanıcı isteği) ==");
  {
    /* KULLANICI: "sınav tarihleri için okul çekimi çalışmıyor; bunu kaldırabiliriz
       ve bununla ilgili çöp kod kalmasın."
       Neden çalışmıyordu (ölçüldü): çekici okul-sitesi.js Firestore'a yazıyordu,
       uygulama ise Supabase public.okul_duyurulari tablosundan okuyordu; o tabloya
       yazan HİÇBİR betik yoktu (canlıda 0 satır). Ayrıca GitHub'da okul-cekim
       iş akışı hiç yoktu. Artık hem istemci okuması hem çekici kaldırıldı. */
    const KOD = APP.replace(/\/\*[\s\S]*?\*\//g, "");
    ok("okul_duyurulari tablosu artık OKUNMUYOR",
      !/okul_duyurulari/.test(KOD));
    ok("duyuru → takvim otomatik ekleme fonksiyonu YOK",
      !/okzDuyurularToSchoolExams/.test(KOD));
    ok("okulizyon state'inde duyurular alanı YOK",
      !/duyurular: null/.test(KOD) && !/st\.duyurular/.test(KOD));
    ok("profilden 'Okul Duyuruları' bölümü kalktı",
      !/Okul Duyuruları/.test(KOD) && !/OKUL DUYURULARI/.test(KOD));

    // Depo tarafı: çekici betikler ve iş akışı adımları silinmiş olmalı.
    const yol = (x) => require("path").join(__dirname, "..", x);
    const varMi = (x) => require("fs").existsSync(yol(x));
    ok("okul-sitesi.js (Firestore çekicisi) SİLİNDİ", !varMi("okul-sitesi.js"));
    ok("degisiklik-kontrol.js (30 dk gözcüsü) SİLİNDİ", !varMi("degisiklik-kontrol.js"));
    ok("okul sitesi duman testi SİLİNDİ", !varMi("tests/okulizyon-okul-smoke.js"));
    const wf = require("fs").readFileSync(yol(".github/workflows/bildirim.yml"), "utf8");
    ok("iş akışında okul-sitesi adımı YOK", !/okul-sitesi\.js/.test(wf));
    ok("iş akışında 30 dk gözcü adımı YOK",
      !/degisiklik-kontrol\.js/.test(wf) && !/\*\/30 \* \* \* \*/.test(wf));
    ok("Okulizyon çekimi iş akışında DURUYOR", /node okulizyon-cek\.js/.test(wf));
  }

  console.log("\n== 7) HESAP VE VERİYİ KALICI SİL (v113 — KVKK m.7) ==");
  {
    /* KULLANICI: "Tmm silmeyi ekle"
       Eski "Tüm verileri sil" yalnız cihazı ve bulut state'ini sıfırlıyordu;
       auth.users satırı, e-posta ve okulizyon_kimlik KALIYORDU. */
    const KOD = APP.replace(/\/\*[\s\S]*?\*\//g, "");
    ok("profilde 'kalıcı sil' düğmesi var", /data-act="hesapSil"/.test(KOD));
    ok("onay penceresi 'SİL' yazdırıyor", /am-hesap-sil-onay/.test(KOD) && /Onay için "SİL" yazmalısın/.test(KOD));
    ok("geri alınamaz uyarısı yazılı", /geri alınamaz/.test(KOD));
    ok("nelerin silineceği listeleniyor",
      /E-posta ve hesabın/.test(KOD) && /Okulizyon bağın/.test(KOD) && /Denemeler, sınav sonuçları/.test(KOD));
    ok("silme sunucu fonksiyonuna gidiyor", /functions\/v1\/hesap-sil/.test(KOD));
    ok("oturum JWT'si gönderiliyor", /session\.access_token/.test(KOD) && /Authorization: "Bearer " \+ jwt/.test(KOD));
    ok("başarıda cihaz temizlenip oturum kapanıyor",
      /__cikisYerelTemizle/.test(KOD) && /sb\.auth\.signOut\(\)/.test(KOD));

    // Sunucu fonksiyonu deposu
    const yol = (x) => require("path").join(__dirname, "..", x);
    const fnYolu = yol("supabase/functions/hesap-sil/index.ts");
    ok("hesap-sil edge fonksiyonu var", require("fs").existsSync(fnYolu));
    const FN = require("fs").readFileSync(fnYolu, "utf8");
    ok("fonksiyon uid'yi JWT'den alıyor (başkasını silemez)",
      /auth\/v1\/user/.test(FN) && !/g\.uid|g\.user_id/.test(FN));
    ok("sunucu da 'SİL' onayı istiyor", /onay !== "SİL"/.test(FN));
    ok("hesap silme admin API ile", /auth\/v1\/admin\/users\//.test(FN));
    ok("silindiği DOĞRULANIYOR (yanlış 'silindi' demez)", /hesapKaldi/.test(FN) && /tamam: !hesapKaldi/.test(FN));

    // Saklama süresi
    const MIG = yol("supabase/migrations/0018_hesap_silme_ve_saklama.sql");
    ok("saklama süresi göçü var", require("fs").existsSync(MIG));
    const M = require("fs").readFileSync(MIG, "utf8");
    ok("saklama süresi 24 ay tanımlı", /select 24 \$\$/.test(M));
    ok("süre dolunca silme fonksiyonu var", /hesap_saklama_temizle/.test(M));
    ok("silmeden önce uyarı fonksiyonu var", /hesap_saklama_uyar/.test(M));
    ok("bildirim_kuyrugu hesaba bağlanıyor (CASCADE)", /bildirim_kuyrugu_user_id_fkey/.test(M) && /on delete cascade/.test(M));
  }

  console.log("\n== 8) ŞİFRE 6 + AYDINLATMA/ONAY (v114) ==");
  {
    /* KULLANICI:
       • "Bende sana diyorum ki şifreyi neden 8 yapıyoruz. 6 ise sende 6 yap."
       • "Veli iznini neden kutucuk olarak ekliyoruz? Google ile girişte devam
          ederek veri ve gizlilik politikalarını kabul etmiş olursunuz yetmiyor mu" */
    const KOD = APP.replace(/\/\*[\s\S]*?\*\//g, "");

    // --- Şifre 6 ---
    ok("hesap şifresi kuralı 6", /if \(s\.length < 6\) return "Şifre en az 6 karakter/.test(KOD));
    ok("8 karakter kuralı KALMADI", !/length < 8/.test(KOD));
    /* v117 — pencere yeniden tasarlandı: alanın kendi ETİKETİ var (ŞİFRE),
       placeholder artık yalnız kuralı söylüyor. */
    ok("giriş alanı 'en az 6' yazıyor", /placeholder="En az 6 karakter"/.test(KOD));
    ok("veri kilidi şifresi de 6", /sifre\.length < 6/.test(KOD) && /s1\.length < 6/.test(KOD));
    ok("harf+rakam zorunluluğu kaldırıldı (sunucu uygulamıyor)",
      !/en az bir harf ve bir rakam/.test(KOD));
    ok("sıfırlama da 6", /en az 6 karakter/.test(KOD) && !/en az 8 karakter/.test(KOD));

    // --- Aydınlatma / onay ---
    ok("aydınlatma sayfası var", require("fs").existsSync(require("path").join(__dirname, "..", "site/gizlilik.html")));
    ok("kurulumda aydınlatma bağlantısı var", /gizlilik\.html/.test(KOD));
    ok("'devam ederek kabul' metni var", /Devam ederek/.test(KOD) && /okuduğunu kabul etmiş olursun/.test(KOD));
    ok("Google düğmesi üstünde de kabul satırı var", /pwa-auth-onay/.test(KOD));
    ok("ZORUNLU veli kutucuğu YOK (bloklamıyor)", !/kutuyu işaretle/.test(KOD));
    /* v124 — KULLANICI: "KVKK konusunda gereksiz her şeyi kaldırıyoruz."
       Opsiyonel "18 yaşından küçüğüm" kutusu KALDIRILDI: hiçbir şeyi
       engellemiyordu, yalnız beyan kaydediyordu → gereksiz sürtünme.
       Bu testler kaldırılmayı KİLİTLER (geri gelmesin). */
    ok("18 altı veli beyan kutusu KALDIRILDI", !/kur-veli-beyan/.test(KOD) && !/yasBeyani/.test(KOD));
    ok("veliIzin kaydı KALDIRILDI", !/veliIzin/.test(KOD));
    ok("yerine yalnız aydınlatma kaydı var", /state\.settings\.aydinlatma = \{/.test(KOD) && /surum: "2026-10-27"/.test(KOD));
    ok("aydınlatma kaydında yaş beyanı YOK", /state\.settings\.aydinlatma = \{[\s\S]{0,200}\}/.test(KOD) && !/aydinlatma = \{[\s\S]{0,200}yasBeyani/.test(KOD));
    ok("gizlilik.html service worker önbelleğinde", /gizlilik\.html/.test(require("fs").readFileSync(require("path").join(__dirname, "..", "site/sw.js"), "utf8")));

    // --- Aydınlatma metni içeriği (KVKK m.10 asgari) ---
    const G = require("fs").readFileSync(require("path").join(__dirname, "..", "site/gizlilik.html"), "utf8");
    ok("metinde veri sorumlusu var", /Veri sorumlusu/.test(G));
    ok("metinde işleme amaçları var", /İşleme amaçları/.test(G));
    ok("metinde hukuki sebepler (m.5) var", /KVKK m\.5/.test(G));
    ok("metinde aktarım (yurt dışı) var", /Aktarım/.test(G) && /yurt dışı/.test(G));
    ok("metinde 24 ay saklama var", /24 ay/.test(G));
    ok("metinde m.11 hakları var", /KVKK m\.11/.test(G));
    ok("metinde silme hakkı + profil yolu var", /Hesabımı ve tüm verilerimi kalıcı sil/.test(G));
    ok("metinde 18 yaş altı bölümü var", /18 yaş/.test(G) && /veli/.test(G));
    ok("reklam/izleme çerezi yok beyanı var", /izleme çerezi/.test(G));
    /* v114 — DÜRÜSTLÜK: metin, kodun yapmadığı bir şeyi VAAT ETMEMELİ.
       "izin verilmeden hesap etkinleştirilmez" yazıyordu ama kod engellemiyordu. */
    ok("metin kodla çelişmiyor (engel vaadi yok)",
      !/izin verilmeden hesap etkinleştirilmez/.test(G));
    ok("veli izni sınırı açıkça yazılı", /zorunlu bir "veli izni" kutusu yoktur/.test(G));
    /* v117 — KULLANICI: "gizlilik html'i yaptım zaten" → üç alan dolduruldu.
       v115'in "eksik alan" uyarısı artık GEREKSİZ; kaldırıldı. Yerine daha
       güçlü bir kontrol: metinde doldurulacak köşeli parantez KALMAMALI. */
    ok("eksik alan uyarısı kaldırıldı (alanlar dolu)", !/am-eksik-uyari/.test(G));
    ok("metinde doldurulacak [ALAN] kalmadı",
      !/\[[A-ZÇĞİÖŞÜ][^\]]{2,}\]/.test(G.replace(/<script[\s\S]*?<\/script>/g, "")));
    ok("veri sorumlusu adı yazılı", /Ahmed İbrahim/.test(G));
    ok("KVKK m.13 e-posta adresi yazılı", /hnekfamy8@gmail\.com/.test(G));
    ok("şehir yazılı", /Gaziantep, Türkiye/.test(G));
  }

  console.log("\n== 9) İLETİŞİM KANALI (v116 — KVKK m.13) ==");
  {
    /* KULLANICI: "Yok veremem. Sen bana nerden dolduracağımı soyle"
       Metin "bize ulaş" diyordu ama uygulamada HİÇ kanal yoktu. m.13 başvurusu
       için kanal şart; geri_bildirim tablosu vardı, arayüzü yoktu. */
    const KOD = APP.replace(/\/\*[\s\S]*?\*\//g, "");
    ok("iletişim penceresi var", /iletisimPencereAc/.test(KOD));
    ok("profilden açılıyor", /data-act="iletisim"/.test(KOD));
    /* v124 — kullanıcıya "KVKK m.13" jargonu gösterilmez; seçenek
       "Verilerimle ilgili istek" olarak duruyor. */
    ok("veri isteği konusu seçilebiliyor", /Verilerimle ilgili istek/.test(KOD));
    ok("kullanıcıya KVKK madde numarası GÖSTERİLMİYOR", !/KVKK m\.13/.test(KOD));
    ok("silme talebi konusu var", /Verilerimin silinmesini istiyorum/.test(KOD));
    ok("30 gün yanıt süresi yazılı", /30 gün/.test(KOD));
    ok("geri_bildirim tablosuna yazıyor", /from\("geri_bildirim"\)/.test(KOD) && /\.insert\(/.test(KOD));
    ok("girişsiz de gönderilebiliyor", /currentUser \? currentUser\.id : null/.test(KOD));
    ok("boş mesaj reddediliyor", /mesaj\.length < 5/.test(KOD));
    ok("hata kullanıcıya gösteriliyor", /Gönderilemedi/.test(KOD));

    // Metin artık kendi kendini açıklıyor
    const G = require("fs").readFileSync(require("path").join(__dirname, "..", "site/gizlilik.html"), "utf8");
    ok("'veri sorumlusu 18 yaş şartı yok' açıklaması var", /yaş şartı\s*\n?\s*koymaz/.test(G));
    ok("küçük + veli temsili doğru anlatılıyor", /TMK m\.14/.test(G) && /TMK m\.16/.test(G));
    ok("gerçek kişi veri sorumlusu olarak gösteriliyor", /Ahmed İbrahim<\/b> — gerçek kişi/.test(G));
  }

  console.log("\n== 10) TEK AKIŞ — giriş penceresi ve bilgi formu üst üste binmez (v117) ==");
  {
    /* KULLANICI: "Uygulamaya ilk girildiğinde bilgi formu hemen üstünde de
       hesap alanı çıkıyor. Bunları daha profesyonel şekilde yap."
       İki tam ekran katman (z-index 9999) aynı anda DOM'da olmamalı. */
    ok("tek katman kuralı var", /function girisPaneliAcikMi/.test(APP));
    ok("kurulum paneli hesap penceresi açıkken açılmıyor",
      /if \(girisPaneliAcikMi\(\)\) return false;/.test(APP));
    ok("bekleme sonrası da yeniden kontrol ediliyor",
      /bekleme sırasında giriş açıldıysa yine girme/.test(APP));
    ok("pencere kapanınca kurulum devralıyor",
      /window\.__amAuthZorunlu = false;[\s\S]{0,260}kurulumAkisi\(\)/.test(APP));

    /* Sekmeli hesap formu */
    ok("iki sekme var (giriş / yeni hesap)", /pwa-tab-giris/.test(APP) && /pwa-tab-kayit/.test(APP));
    ok("tek ana düğme sekmele değişiyor",
      /ana\.setAttribute\("data-act", kayit \? "pwaAuthRegister" : "pwaAuthLogin"\)/.test(APP));
    ok("başlık sekmeyle değişiyor", /Hesap oluştur/.test(APP) && /id="pwa-auth-baslik"/.test(APP));
    ok("şifre alanı autocomplete sekmeye göre", /"new-password" : "current-password"/.test(APP));
    ok("aydınlatma satırı hâlâ formda", /pwa-auth-onay/.test(APP) && /gizlilik\.html/.test(APP));
    ok("eski 4 düğme kaldırıldı (tek akış)", !/Yeni Kayıt Oluştur/.test(APP));
  }

  console.log("\n== 11) KVKK ZORUNLU / DEĞİL tablosu (v118) ==");
  {
    /* KULLANICI: "Yani su anda KVKK için ne zorunlu ne zorunlu degilmiş"
       Cevap hem docs hem gizlilik.html'de yazılı olmalı ve KODLA uyuşmalı. */
    const D = require("fs").readFileSync(require("path").join(__dirname, "..", "docs/KVKK-ZORUNLU-ZORUNLU-DEGIL.md"), "utf8");
    ok("referans belgesi var", D.length > 3000);
    ok("5 zorunlu madde sayılıyor", /ZORUNLU \(5 madde\)/.test(D));
    ok("7 zorunlu olmayan madde", /ZORUNLU DEĞİL \(7 madde\)/.test(D));
    ok("standart sözleşme eksik olarak işaretli", /standart sözleşme/i.test(D) && /EKSİK/.test(D));
    ok("VERBİS muaf gerekçesi yazılı", /50.*100 M TL/.test(D));
    ok("72 saat ihlal bildirimi yazılı", /72 saat/.test(D));
    ok("30 gün yanıt süresi yazılı", /30 gün/.test(D));
    ok("okulizyon düzeltmesi belgede", /OrbimSoft/.test(D));
    ok("işletme hesabı istisnası (2025/2393)", /2025\/2393/.test(D));

    /* Metin ile kod çelişmemeli: metin hâlâ zorunlu veli kutusu vaat etmiyor */
    const G = require("fs").readFileSync(require("path").join(__dirname, "..", "site/gizlilik.html"), "utf8");
    ok("gizlilikte yurt dışı aktarım tablosu var",
      /Supabase<\/td><td>Frankfurt/.test(G) && /Vercel<\/td><td>ABD/.test(G));
    ok("standart sözleşme eksiği metinde AÇIKÇA yazılı", /standart sözleşme/.test(G) && /yerine getirilmemiştir/.test(G));
    ok("metin hâlâ veli kutusu vaat etmiyor", !/izin verilmeden hesap etkinleştirilmez/.test(G));
  }

  console.log("\n== 12) 72 SAAT + STANDART SÖZLEŞME rehberleri (v119) ==");
  {
    /* KULLANICI: "72 saatlik ihlal bildirimi ve Standart sözleşme ne niye nasıl"
       İkisi de dosya olarak yazılmalı ve DOĞRU kanalı göstermeli. */
    const fs = require("fs");
    const I = fs.readFileSync(require("path").join(__dirname, "..", "docs/IHLAL-72-SAAT-PLANI.md"), "utf8");
    const S = fs.readFileSync(require("path").join(__dirname, "..", "docs/STANDART-SOZLESME-REHBERI.md"), "utf8");

    // --- 72 saat ---
    ok("72 saat planı var", I.length > 4000);
    ok("ne/neden/nasıl üçlüsü ayrı", /## 1\. NE\?/.test(I) && /## 2\. NİYE\?/.test(I) && /## 3\. NASIL\?/.test(I));
    ok("resmî çevrimiçi form adresi", /ihlalbildirim\.kvkk\.gov\.tr/.test(I));
    ok("resmî e-posta kanalı", /ihlalbildirimi@kvkk\.gov\.tr/.test(I));
    ok("ALO 198 yardım hattı", /ALO 198/.test(I));
    ok("2019/10 Kurul kararı dayanak", /2019\/10/.test(I));
    ok("güvenlik kodu uyarısı var", /GÜVENLİK KODU/.test(I));
    ok("forma kişisel veri yazılmaz uyarısı", /kişisel veriyi bu forma/.test(I) || /kişisel veri YAZMA/.test(I));
    ok("takip bildirimi anlatılıyor", /Takip bildirimi|takip bildirimi/.test(I));
    ok("72 saat çözme süresi değil uyarısı", /çözmek.*değil/.test(I));

    // --- standart sözleşme ---
    ok("standart sözleşme rehberi var", S.length > 5000);
    ok("4 tip tablosu var", /Veri sorumlusu → veri sorumlusu/.test(S) && /Veri sorumlusu → veri işleyen/.test(S));
    ok("doğru tip seçilmiş (sorumlu→işleyen)", /SEN BUNU SEÇECEKSİN/.test(S));
    ok("üç kademe anlatılıyor", /YETERLİLİK KARARI/.test(S) && /UYGUN GÜVENCE/.test(S) && /ARIZİ/.test(S));
    ok("5 iş günü + hangi andan", /5 iş günü/.test(S) && /[İi]mzaların tamamlandığı/.test(S));
    ok("bildirim modülü adresi", /standartsozlesme\.kvkk\.gov\.tr/.test(S));
    ok("GDPR DPA ile farkı tabloda", /GDPR DPA/.test(S));
    ok("Kurul 2024/959 dayanak", /2024\/959/.test(S));
    ok("yönetmelik m.14/5 dayanak", /14\/5/.test(S));
    ok("sağlayıcı imzalamazsa senaryosu", /Senaryo C|Hiç cevap vermez/.test(S));
    ok("self-host alternatifi dürüstçe yazılı", /self-host/i.test(S));
    ok("Supabase için doldurulmuş tablo", /Supabase Inc\./.test(S) && /Frankfurt/.test(S));
    ok("Vercel için doldurulmuş tablo", /Vercel Inc\./.test(S) && /Walnut/.test(S));
  }

  console.log("\n== 13) ÖLÇEK GERÇEĞİ — 6 kullanıcı (v120) ==");
  {
    /* KULLANICI: "Yav ben bunu globale sürmeyeceğim ki, ve sözleşme falan
       abartı gibi emin misin?"
       HAKLIYDI: ilk reçete kurumsal ölçek içindi. Belge artık ölçekle hizalı
       ve standart sözleşme 'bugün yapılacak' listesinden ÇIKARILDI. */
    const fs = require("fs");
    const K = fs.readFileSync(require("path").join(__dirname, "..", "docs/KVKK-ZORUNLU-ZORUNLU-DEGIL.md"), "utf8");
    const S = fs.readFileSync(require("path").join(__dirname, "..", "docs/STANDART-SOZLESME-REHBERI.md"), "utf8");

    ok("ölçek bölümü var", /GERÇEK ÖLÇEK/.test(K) && /6 kullanıcı/.test(K));
    ok("standart sözleşme bugünkü listeden çıkarıldı",
      /teorik — .*kimse sormuyor|teorik/.test(K));
    ok("bugünkü iş listesi 3 madde ve 1 saat", /3 iş, toplam 1 saat/.test(K));
    ok("2FA en ucuz sigorta olarak yazılı", /2FA/.test(K));
    ok("eşikler yazılı (100 kullanıcı/duyuru/para)", /100.*geçerse/.test(K));
    ok("self-host alternatifi duruyor", /self-host/.test(K));

    // Rehber artık "görev" değil "referans"
    ok("rehber 'bugün yapılacak değil' diyor", /Bugün yapılacaklar listesinde DEĞİL/.test(S));
    ok("ne zaman açılacağı yazılı", /kullanıcı ~100/.test(S));
    ok("'globale sürmemek' bölümü var", /globale sürmeyeceğim/.test(S));
    ok("m.9 kişi sayısına bakmaz dürüstçe yazılı",
      /kişi sayısına bakmaz/.test(S));
    ok("noindex önerisi var", /noindex/.test(S));
    ok("'yayınlamıyorum != kimse bilmiyor' dürüstlüğü",
      /kimse bilmiyor/.test(S));
  }

  console.log("\n" + "─".repeat(60));
  if (kalan) {
    console.log("\n✗ " + kalan + " kontrol kaldı (" + gecen + " geçti)");
    hatalar.forEach((h) => console.log("  · " + h));
    process.exit(1);
  }
  console.log("v108 kurulum davranış testi — " + gecen + "/" + gecen + " geçti ✓");
})();
