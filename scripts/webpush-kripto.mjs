/* ============================================================
   WEB PUSH KRİPTO ÇEKİRDEĞİ  (scripts/webpush-kripto.mjs)
   ------------------------------------------------------------
   Tarayıcı push servisine (Chrome/FCM, Mozilla autopush, Apple)
   şifreli gövde göndermek için RFC 8291 (aes128gcm) + RFC 8292
   (VAPID) uygulaması. HARİCİ BAĞIMLILIK YOK: yalnız WebCrypto.

   Bu dosya TEK kaynak: supabase/functions/bildirim-gonder
   içine scripts/bildirim-derle.js ile gömülür; tests/bildirim.test.js
   ise aynı dosyayı ithal edip şifreleyip kendi "tarayıcı" tarafında
   çözer (uçtan uca doğrulama).

   Kullanım (Deno/Node):
     const v = await vapidJwt(ozelAnahtarJwk, endpoint, "mailto:...")
     const govde = await sifrele({ p256dh, auth }, JSON.stringify(mesaj))
     await fetch(endpoint, { method:"POST", headers:{...,Authorization:"vapid t="+v.jwt+", k="+v.acik}, body: govde })
   ============================================================ */

const enc = new TextEncoder();
const dec = new TextDecoder();

export function b64url(bytes) {
  let s = "";
  const b = new Uint8Array(bytes);
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function b64urlCoz(s) {
  const t = String(s || "").replace(/-/g, "+").replace(/_/g, "/");
  const pad = t.length % 4 === 0 ? "" : "=".repeat(4 - (t.length % 4));
  const bin = atob(t + pad);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}

/** Ham P-256 anahtarını (65 bayt, 0x04 ile başlar) WebCrypto anahtarına çevir. */
async function disAnahtar(ham, kullanim) {
  return crypto.subtle.importKey(
    "raw", ham, { name: "ECDH", namedCurve: "P-256" }, false, kullanim
  );
}

function birlestir(...parcalar) {
  const toplam = parcalar.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(toplam);
  let i = 0;
  for (const p of parcalar) { out.set(p, i); i += p.length; }
  return out;
}

async function hkdf(ikm, salt, info, uzunluk) {
  const anahtar = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt, info: enc.encode(info) }, anahtar, uzunluk * 8
  );
  return new Uint8Array(bits);
}

/**
 * Push gövdesini şifrele (RFC 8291, aes128gcm).
 * @param {{p256dh:string, auth:string}} abone  base64url alıcı anahtarları
 * @param {string} metin  gönderilecek JSON
 * @returns {Promise<{govde:Uint8Array, tuz:Uint8Array, asPublic:Uint8Array}>}
 */
export async function sifrele(abone, metin, rs = 4096) {
  const uaPublic = b64urlCoz(abone.p256dh);
  const authSecret = b64urlCoz(abone.auth);
  if (uaPublic.length !== 65) throw new Error("p256dh 65 bayt olmalı (gelen " + uaPublic.length + ")");
  if (authSecret.length !== 16) throw new Error("auth 16 bayt olmalı (gelen " + authSecret.length + ")");

  const asCift = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const asPublic = new Uint8Array(await crypto.subtle.exportKey("raw", asCift.publicKey));

  const uaKey = await disAnahtar(uaPublic, []);
  const ecdh = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "ECDH", public: uaKey }, asCift.privateKey, 256
  ));

  // IKM = HKDF(auth_secret, ecdh, "WebPush: info\0" || ua_public || as_public, 32)
  const info = birlestir(enc.encode("WebPush: info\0"), uaPublic, asPublic);
  const ikmAnahtar = await crypto.subtle.importKey("raw", ecdh, "HKDF", false, ["deriveBits"]);
  const ikm = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt: authSecret, info }, ikmAnahtar, 256
  ));

  const tuz = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(ikm, tuz, "Content-Encoding: aes128gcm\0", 16);
  const nonce = await hkdf(ikm, tuz, "Content-Encoding: nonce\0", 12);

  // Son kayıt: düz metin + 0x02 ayırıcı
  const duz = birlestir(enc.encode(metin), new Uint8Array([2]));

  const aes = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const sifreli = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, aes, duz));

  // Gövde: salt(16) || rs(4, BE) || idlen(1)=65 || as_public(65) || ciphertext
  const bas = new Uint8Array(16 + 4 + 1 + 65);
  bas.set(tuz, 0);
  new DataView(bas.buffer).setUint32(16, rs, false);
  bas[20] = 65;
  bas.set(asPublic, 21);

  return { govde: birlestir(bas, sifreli), tuz, asPublic, rs };
}

/** Şifreyi çöz — SADECE TEST için (tarayıcının yaptığı işin eşi). */
export async function coz(aboneOzelJwk, abone, govde) {
  const uaKey = await crypto.subtle.importKey(
    "jwk", aboneOzelJwk, { name: "ECDH", namedCurve: "P-256" }, false, ["deriveBits"]
  );
  const ham = new Uint8Array(govde);
  const tuz = ham.slice(0, 16);
  const idlen = ham[20];
  const asPublic = ham.slice(21, 21 + idlen);
  const sifreli = ham.slice(21 + idlen);

  const asKey = await disAnahtar(asPublic, []);
  const ecdh = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: asKey }, uaKey, 256));
  const info = birlestir(enc.encode("WebPush: info\0"), b64urlCoz(abone.p256dh), asPublic);
  const ikmAnahtar = await crypto.subtle.importKey("raw", ecdh, "HKDF", false, ["deriveBits"]);
  const ikm = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt: b64urlCoz(abone.auth), info }, ikmAnahtar, 256
  ));

  const cek = await hkdf(ikm, tuz, "Content-Encoding: aes128gcm\0", 16);
  const nonce = await hkdf(ikm, tuz, "Content-Encoding: nonce\0", 12);
  const aes = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["decrypt"]);
  const duz = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce }, aes, sifreli));

  // Sondaki 0x02 + dolgu sıfırlarını at
  let son = duz.length;
  while (son > 0 && duz[son - 1] === 0) son--;
  if (son > 0 && duz[son - 1] === 2) son--;
  return dec.decode(duz.slice(0, son));
}

/**
 * VAPID JWT üret (RFC 8292). ES256, ham r||s imza.
 * @param {object} ozelJwk  P-256 özel anahtar (JWK; d, x, y)
 * @param {string} endpoint push servisi adresi (aud = origin)
 * @param {string} konu     iletişim adresi ("mailto:..." ya da https URL)
 */
export async function vapidJwt(ozelJwk, endpoint, konu, gecerlilikSn = 12 * 3600) {
  const url = new URL(endpoint);
  const bas = { typ: "JWT", alg: "ES256" };
  const govde = {
    aud: url.origin,
    exp: Math.floor(Date.now() / 1000) + gecerlilikSn,
    sub: konu || "mailto:bildirim@analiz-merkezi.app"
  };
  const imzasiz = b64url(enc.encode(JSON.stringify(bas))) + "." + b64url(enc.encode(JSON.stringify(govde)));

  const anahtar = await crypto.subtle.importKey(
    "jwk", ozelJwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]
  );
  const imza = new Uint8Array(await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" }, anahtar, enc.encode(imzasiz)
  ));
  // WebCrypto ES256 zaten ham r||s döndürür (DER değil) — JWS ile uyumlu.
  const jwt = imzasiz + "." + b64url(imza);
  const acik = b64url(birlestir(
    new Uint8Array([4]),
    b64urlCoz(ozelJwk.x),
    b64urlCoz(ozelJwk.y)
  ));
  return { jwt, acik };
}

/** Tarayıcı aboneliğinin alanlarını doğrula. */
export function aboneGecerliMi(a) {
  try {
    if (!a || !a.endpoint || !a.p256dh || !a.auth) return false;
    const u = new URL(a.endpoint);
    if (u.protocol !== "https:") return false;
    return b64urlCoz(a.p256dh).length === 65 && b64urlCoz(a.auth).length === 16;
  } catch (e) { return false; }
}
