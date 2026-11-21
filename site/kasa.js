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

let _anahtar = null;        // CryptoKey — yalnız bellekte
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
function kasaKilitle() { _anahtar = null; _anahtarTuz = ""; }

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
  return { ok: true, tuz: _tuzB64 };
}

// VAR OLAN KASAYI AÇ: tuz kaydın içinden gelir (cihaz değişse de aynı).
async function kasaAc(kasaSifresi, tuzB64) {
  if (!tuzB64) return { ok: false, hata: "Kasa kaydı eksik (tuz yok)." };
  if (_anahtar && _anahtarTuz === tuzB64) return { ok: true };
  const a = await anahtarTuret(kasaSifresi, tuzB64);
  // Doğrulama: şifre yanlışsa GCM çözme hata verir. Bunu çağıran taraf
  // (ilk kaydı çözmeye çalışarak) görür; burada yalnız anahtarı saklarız.
  _anahtar = a;
  _tuzB64 = tuzB64;
  _anahtarTuz = tuzB64;
  kasaIsaretle();
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
};
