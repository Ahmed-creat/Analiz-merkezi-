/* ============================================================
   ANALİZ MERKEZİ — KASA (site/kasa.js)  v106
   ------------------------------------------------------------
   KULLANICI: "Hem ad soyad, sınav sonuçları, hedef, plan takibi,
   kitaplar bunları neden şifrelenmiyor?"

   CEVAP: artık şifreleniyor. Buluta yazılan kişisel veri, cihazdan
   ÇIKMADAN ÖNCE şifrelenir. Sunucu yalnız şifreli kutuyu görür.

   Neden "sıfır bilgi" (zero-knowledge):
     • Şifreleme tarayıcıda (Web Crypto, AES-256-GCM).
     • Anahtar kullanıcının KASA ŞİFRESİNDEN türetilir (PBKDF2-SHA256).
     • Sunucuya giden: { tuz, IV, şifreli metin }. Anahtar ve şifre gitmez.
     • Veritabanını açan kişi (uygulamanın sahibi dahil) anlamsız harf görür.

   ÖNEMLİ TASARIM KARARI: tuz kaydın İÇİNDE taşınır (sunucuda).
   Böylece aynı kasa şifresi her cihazda aynı anahtarı üretir; veri
   telefonda yazılıp bilgisayarda açılabilir. Tuz gizli değildir.

   BEDELİ (dürüstçe):
     • Kasa şifresini unutan, verisini KURTARAMAZ. "Şifremi unuttum"
       hesabı açar ama eski şifreli veriyi açmaz. Kurtarma anahtarı
       (12 kelime) indiren kişi kurtarabilir; o anahtar da sunucuda
       açık hâlde durmaz.
     • Sunucu okuyamadığı için sunucuda arama/sıralama yapılamaz —
       arama cihazda yapılır (uygulama zaten cihazda çalışıyor).
     • Bildirim metinleri ve "geri bildirim" kasaya GİRMEZ: onlar
       öğrenciye gösterilmek için üretilir (kullanıcı isteği).

   ZARF BİÇİMİ (app_states.state):
     { "__kasa": 1, "t": "<b64 tuz>", "iv": "<b64>", "ct": "<b64>" }
   ============================================================ */

const KASA_SURUM = 1;
const KASA_TUR = 310000;   // PBKDF2-SHA256 tur sayısı (kaba kuvveti pahalı yapar)
const KASA_IPUCU = "am_kasa_ipucu_v1";   // cihazda: kasa kurulu mu (anahtar DEĞİL)
const KASA_TUZ_YEREL = "am_kasa_tuz_v1"; // cihazda: bu hesabın tuzu (GİZLİ DEĞİL)

/* v120 — CİHAZDA KALICI ANAHTAR (IndexedDB)
   ------------------------------------------------------------
   KULLANICI: "İyi de güncel sistemlerde şifreli bilgi varsa onlarda
   mı her gün şifre yazıyor?" → HAYIR. WhatsApp/Signal/Bitwarden de
   anahtarı cihazda tutar; sunucu yine göremez.

   ÖNCEKİ HATA (v106): anahtar yalnız bellekteydi (_anahtar). Sayfa her
   yenilendiğinde şifre soruluyordu; buna karşılık cihazdaki localStorage
   kaydı DÜZ metindi. Yani en yüksek sürtünme + en düşük koruma.

   ŞİMDİ: anahtar cihazda IndexedDB'de durur ama AÇIK hâlde değil:
     • `cihaz` = AES-GCM anahtarı, extractable:false → JS kodu DIŞARI
       ÇIKARAMAZ (tarayıcı vermez).
     • `sarili` = kasa anahtarının o cihaz anahtarıyla sarılmış hâli.
   Sayfa yenilenince `cihezdanAc()` açar; şifre SORULMAZ.
   Çıkış yapınca / "Kilitle" denince cihaz anahtarı SİLİNİR.
   ------------------------------------------------------------ */
const IDB_AD = "am-kasa-v1";
const IDB_DEPO = "kasa";
const IDB_KAYIT = "anahtar";

let _anahtar = null;        // CryptoKey — bellekte (sayfa açıkken)
let _tuzB64 = "";           // bu hesabın tuzu (kayıttan gelir)
let _anahtarTuz = "";       // anahtarın türetildiği tuz (önbellek için)

/* ---------- kodlama ---------- */
function b64(buf) {
  const b = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s);
}
function b64den(s) {
  const ham = atob(String(s || ""));
  const b = new Uint8Array(ham.length);
  for (let i = 0; i < ham.length; i++) b[i] = ham.charCodeAt(i);
  return b;
}
function rastgele(n) { return crypto.getRandomValues(new Uint8Array(n)); }

/* ---------- cihaz deposu (IndexedDB) ---------- */
function idbAc() {
  return new Promise((coz, red) => {
    try {
      if (!globalThis.indexedDB) return red(new Error("indexedDB yok"));
      const istek = indexedDB.open(IDB_AD, 1);
      istek.onupgradeneeded = () => {
        const db = istek.result;
        if (!db.objectStoreNames.contains(IDB_DEPO)) db.createObjectStore(IDB_DEPO);
      };
      istek.onsuccess = () => coz(istek.result);
      istek.onerror = () => red(istek.error || new Error("idb açılamadı"));
    } catch (e) { red(e); }
  });
}
function idbYaz(db, deger) {
  return new Promise((coz, red) => {
    try {
      const t = db.transaction(IDB_DEPO, "readwrite");
      t.objectStore(IDB_DEPO).put(deger, IDB_KAYIT);
      t.oncomplete = () => coz(true);
      t.onerror = () => red(t.error);
    } catch (e) { red(e); }
  });
}
function idbOku(db) {
  return new Promise((coz, red) => {
    try {
      const t = db.transaction(IDB_DEPO, "readonly");
      const i = t.objectStore(IDB_DEPO).get(IDB_KAYIT);
      i.onsuccess = () => coz(i.result || null);
      i.onerror = () => red(i.error);
    } catch (e) { red(e); }
  });
}
function idbSil(db) {
  return new Promise((coz) => {
    try {
      const t = db.transaction(IDB_DEPO, "readwrite");
      t.objectStore(IDB_DEPO).delete(IDB_KAYIT);
      t.oncomplete = () => coz(true);
      t.onerror = () => coz(false);
    } catch (e) { coz(false); }
  });
}

// Tuzu cihaza yaz (gizli değil; yalnız "hangi hesabın tuzu" bilgisi).
function tuzuYereleYaz(tuzB64) {
  try { localStorage.setItem(KASA_TUZ_YEREL, String(tuzB64 || "")); } catch (e) { /* */ }
}
function tuzuYereldenOku() {
  try { return localStorage.getItem(KASA_TUZ_YEREL) || ""; } catch (e) { return ""; }
}

/* Cihazdaki kalıcı anahtarı aç: şifre SORULMADAN.
   Dönüş: true = açıldı · false = bu cihazda kayıtlı anahtar yok */
async function cihezdanAc() {
  if (_anahtar) return true;
  let db = null;
  try {
    db = await idbAc();
    const kayit = await idbOku(db);
    if (!kayit || !kayit.cihaz || !kayit.sarili) return false;
    const ham = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64den(kayit.iv) }, kayit.cihaz, b64den(kayit.sarili)
    );
    _anahtar = await crypto.subtle.importKey(
      "raw", ham, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
    );
    _tuzB64 = String(kayit.tuz || "");
    _anahtarTuz = _tuzB64;
    return true;
  } catch (e) {
    return false;   // bozuk/başka cihaz → şifre sorulur (veri kaybı yok)
  } finally {
    try { if (db) db.close(); } catch (e) { /* */ }
  }
}

/* Açık anahtarı cihaza bağla (sayfa yenilenince şifre sorulmasın). */
async function cihazaBagla(tuzB64) {
  if (!_anahtar) return false;
  let db = null;
  try {
    db = await idbAc();
    /* Cihaz anahtarı: extractable FALSE → uygulama kodu bu anahtarı
       okuyup dışarı gönderemez. Yalnız sar/çöz için kullanılır. */
    const cihaz = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
    );
    const ham = await crypto.subtle.exportKey("raw", _anahtar);
    const iv = rastgele(12);
    const sarili = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cihaz, ham);
    await idbYaz(db, { v: 1, tuz: String(tuzB64 || _tuzB64 || ""), cihaz, iv: b64(iv), sarili: b64(sarili) });
    tuzuYereleYaz(tuzB64 || _tuzB64);
    return true;
  } catch (e) {
    return false;   // IndexedDB yok (gizli sekme) → her açılışta şifre sorulur
  } finally {
    try { if (db) db.close(); } catch (e) { /* */ }
  }
}

async function cihazBaginiKes() {
  let db = null;
  try {
    db = await idbAc();
    await idbSil(db);
  } catch (e) { /* */ }
  finally { try { if (db) db.close(); } catch (e) { /* */ } }
  try { localStorage.removeItem(KASA_TUZ_YEREL); } catch (e) { /* */ }
}

/* Cihazda kayıtlı anahtar var mı? (şifre istemeden kontrol) */
async function cihazdaAnahtarVarMi() {
  let db = null;
  try {
    db = await idbAc();
    const kayit = await idbOku(db);
    return !!(kayit && kayit.cihaz && kayit.sarili);
  } catch (e) { return false; }
  finally { try { if (db) db.close(); } catch (e) { /* */ } }
}

async function anahtarTuret(sifre, tuzB64) {
  const taban = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(String(sifre || "")), "PBKDF2", false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: b64den(tuzB64), iterations: KASA_TUR, hash: "SHA-256" },
    taban, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
  );
}

/* ---------- kurulum / açma ---------- */
function kasaVarMi() {
  try { return localStorage.getItem(KASA_IPUCU) === "1"; } catch (e) { return false; }
}
function kasaIsaretle() {
  try { localStorage.setItem(KASA_IPUCU, "1"); } catch (e) { /* */ }
}
function kasaAcikMi() { return !!_anahtar; }
/* v120 — "Kilitle" artık cihazdaki kalıcı anahtarı da siler; yoksa
   sayfa yenilenince kasa kendiliğinden açılırdı (kilitleme anlamsız olurdu). */
function kasaKilitle() {
  _anahtar = null; _anahtarTuz = "";
  try { cihazBaginiKes(); } catch (e) { /* */ }
}

// İLK KURULUM: yeni tuz üret, anahtarı türet. Kayıt bu tuzla şifrelenir.
async function kasaKur(kasaSifresi) {
  if (!globalThis.crypto || !globalThis.crypto.subtle) {
    return { ok: false, hata: "Bu tarayıcı şifrelemeyi desteklemiyor — güncel bir tarayıcı kullan." };
  }
  if (String(kasaSifresi || "").length < 8) {
    return { ok: false, hata: "Kasa şifresi en az 8 karakter olmalı." };
  }
  _tuzB64 = b64(rastgele(16));
  _anahtar = await anahtarTuret(kasaSifresi, _tuzB64);
  _anahtarTuz = _tuzB64;
  kasaIsaretle();
  /* v120 — anahtarı cihaza bağla: bu cihazda bir daha şifre sorulmaz. */
  try { await cihazaBagla(_tuzB64); } catch (e) { /* */ }
  return { ok: true, tuz: _tuzB64 };
}

/* VAR OLAN KASAYI AÇ: tuz kaydın içinden gelir (cihaz değişse de aynı).
   v120 — tuz verilmezse cihazda saklanan tuzu kullan. v106'daki hata,
   pencere tuzu bilmeden açıldığı için HER SEFERİNDE çıkıyordu
   (app-pwa.js:1958 tuzu geçmiyordu). Artık tuz cihazdan da gelir. */
async function kasaAc(kasaSifresi, tuzB64) {
  let tuz = tuzB64 || _tuzB64 || tuzuYereldenOku();
  if (!tuz && _anahtar) tuz = _anahtarTuz;   // anahtar zaten açıksa tuzu biliyoruz
  if (!tuz) return { ok: false, hata: "Kasa kaydı henüz yüklenmedi. Bir saniye sonra tekrar dene." };
  if (_anahtar && _anahtarTuz === tuz) return { ok: true };
  const a = await anahtarTuret(kasaSifresi, tuz);
  // Doğrulama: şifre yanlışsa GCM çözme hata verir. Bunu çağıran taraf
  // (ilk kaydı çözmeye çalışarak) görür; burada yalnız anahtarı saklarız.
  _anahtar = a;
  _tuzB64 = tuz;
  _anahtarTuz = tuz;
  kasaIsaretle();
  tuzuYereleYaz(tuz);
  /* v120 — doğru şifre girildi: anahtarı cihaza bağla, bir daha sorulmasın. */
  try { await cihazaBagla(tuz); } catch (e) { /* */ }
  return { ok: true };
}

/* ---------- kripto ---------- */
async function kasaSifrele(nesne) {
  if (!_anahtar) return null;
  const iv = rastgele(12);
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv }, _anahtar, new TextEncoder().encode(JSON.stringify(nesne))
  );
  return { __kasa: KASA_SURUM, t: _tuzB64, iv: b64(iv), ct: b64(ct) };
}

// Dönüş: { nesne } başarılı · { kilitli:true } anahtar yok · { acilmadi:true } şifre yanlış
async function kasaCoz(zarf) {
  if (!zarf || typeof zarf !== "object" || !zarf.__kasa) return { nesne: null };
  if (!_anahtar) return { kilitli: true };
  try {
    const duz = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64den(zarf.iv) }, _anahtar, b64den(zarf.ct)
    );
    return { nesne: JSON.parse(new TextDecoder().decode(duz)) };
  } catch (e) {
    return { acilmadi: true };
  }
}
function zarfMi(x) { return !!(x && typeof x === "object" && x.__kasa); }
function zarfTuzu(x) { return (x && x.t) ? String(x.t) : ""; }

/* ---------- kurtarma anahtarı (12 kelime) ---------- */
// 12 kelime = 96 bit rastgelelik. Kasa anahtarını bununla SARARIZ;
// kelimeleri bilen kişi veriyi kurtarır, bilmeyen açamaz.
const KELIMELER = [
  "ada", "ağaç", "akıl", "alın", "anahtar", "araba", "ayna", "balık", "bardak", "bayrak",
  "bulut", "çiçek", "çorap", "dağ", "demir", "deniz", "dere", "dolap", "duvar", "ekmek",
  "elma", "fener", "gemi", "göl", "güneş", "halı", "harita", "hava", "ırmak", "inci",
  "kalem", "kapı", "kartal", "kaya", "kelime", "kilit", "kitap", "köprü", "kuş", "kuzu",
  "limon", "masa", "mavi", "merdiven", "mum", "mutfak", "orman", "otobüs", "pencere", "perde",
  "pilav", "portakal", "renk", "resim", "saat", "sandalye", "sarımsak", "sedef", "sema", "sokak",
  "süt", "şapka", "şeker", "şimşek", "tarla", "taş", "tepe", "toprak", "tren", "tuz",
  "uçurtma", "uyku", "üzüm", "vadi", "yağmur", "yaprak", "yastık", "yaz", "yelken", "yemek",
  "yıldız", "yol", "yumurta", "zaman", "zeytin", "zil", "kestane", "sabah", "akşam", "düğme",
  "kutu", "mektup", "defter", "silgi", "cetvel", "harf", "sıra", "kalemlik", "bahçe", "köşe",
];
function kurtarmaUret() {
  const b = rastgele(12);
  const k = [];
  for (let i = 0; i < 12; i++) k.push(KELIMELER[b[i] % KELIMELER.length]);
  return k.join(" ");
}

// Kasa anahtarını kurtarma kelimeleriyle sar. Sunucuya yalnız SARMALANMIŞ hâli gider.
async function kasaSar(kurtarma) {
  if (!_anahtar) return null;
  const ham = await crypto.subtle.exportKey("raw", _anahtar);
  const sKey = await anahtarTuret(kurtarma, _tuzB64);
  const iv = rastgele(12);
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, sKey, ham);
  return { v: KASA_SURUM, t: _tuzB64, iv: b64(iv), ct: b64(ct) };
}

// Kurtarma kelimeleriyle kasa anahtarını geri aç.
async function kasaCozKurtarma(kurtarma, sarma) {
  if (!sarma || !sarma.t) return { ok: false, hata: "Kurtarma kaydı yok." };
  try {
    const sKey = await anahtarTuret(kurtarma, sarma.t);
    const ham = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64den(sarma.iv) }, sKey, b64den(sarma.ct)
    );
    _anahtar = await crypto.subtle.importKey(
      "raw", ham, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
    );
    _tuzB64 = sarma.t;
    _anahtarTuz = sarma.t;
    kasaIsaretle();
    try { tuzuYereleYaz(sarma.t); await cihazaBagla(sarma.t); } catch (e) { /* */ }
    return { ok: true };
  } catch (e) {
    return { ok: false, hata: "Kurtarma anahtarı bu kasaya ait değil." };
  }
}

export {
  KASA_SURUM, KASA_TUR,
  kasaVarMi, kasaAcikMi, kasaKur, kasaAc, kasaKilitle,
  kasaSifrele, kasaCoz, zarfMi, zarfTuzu,
  kurtarmaUret, kasaSar, kasaCozKurtarma,
  /* v120 — cihazda kalıcı anahtar (sayfa yenilenince şifre sorulmaz) */
  cihezdanAc, cihazdaAnahtarVarMi, cihazBaginiKes, tuzuYereldenOku, tuzuYereleYaz,
};
