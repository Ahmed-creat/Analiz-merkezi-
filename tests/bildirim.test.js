#!/usr/bin/env node
/* ============================================================
   BİLDİRİM (WEB PUSH) TESTLERİ — tests/bildirim.test.js
   ------------------------------------------------------------
   Neyi kanıtlıyor?  "Uygulama kapalıyken bildirim atma" zincirinin
   kripto ve yetki parçaları doğru mu? Tarayıcı olmadan sınanabilen
   her halka burada sınanır:

     1) aes128gcm şifreleme → tarayıcı tarafı çözme (birebir eşitlik)
     2) VAPID ES256 JWT imzası gerçekten doğrulanıyor mu + aud kuralı
     3) Abonelik alan doğrulaması (bozuk kayıtlar sunucuda silinir)
     4) Üretilen edge fonksiyon şablonla SENKRON mu (elle düzenleme yok)
     5) Edge fonksiyonda yetki kapıları var mı:
          run  → x-bildirim-secret zorunlu
          test → JWT zorunlu + yalnız kendi aboneliği
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { pathToFileURL } = require("url");

const KOK = path.join(__dirname, "..");
let gecen = 0, kalan = 0;
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { kalan++; console.log("  ✗ " + ad + (ek ? "  → " + ek : "")); }
}

(async () => {
  const M = await import(pathToFileURL(path.join(KOK, "scripts", "webpush-kripto.mjs")).href);
  const { sifrele, coz, vapidJwt, b64url, b64urlCoz, aboneGecerliMi } = M;

  // ---------- 1) ŞİFRELEME ----------
  console.log("\n1) aes128gcm şifreleme / çözme (RFC 8291)");
  const ua = crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const uaCift = await ua;
  const uaPub = new Uint8Array(await crypto.subtle.exportKey("raw", uaCift.publicKey));
  const uaJwk = await crypto.subtle.exportKey("jwk", uaCift.privateKey);
  const auth = Uint8Array.from(crypto.randomBytes(16));
  const abone = { endpoint: "https://fcm.googleapis.com/fcm/send/test-endpoint", p256dh: b64url(uaPub), auth: b64url(auth) };

  const mesaj = JSON.stringify({ title: "Bugün 2 konunun tekrar günü", body: "Matematik · Fizik", url: "./#konu=Matematik%20%3E%20Türev" });
  const s = await sifrele(abone, mesaj);
  ok("gövde 16+4+1+65 başlık içeriyor", s.govde.length > 86);
  ok("rs alanı 4096", new DataView(s.govde.buffer, s.govde.byteOffset).getUint32(16, false) === 4096);
  ok("idlen = 65", s.govde[20] === 65);
  const geri = await coz(uaJwk, abone, s.govde);
  ok("tarayıcı tarafı çözünce metin birebir aynı", geri === mesaj, geri.slice(0, 60));

  // Her mesaj için tuz farklı olmalı (aynı metin → farklı şifreli gövde)
  const s2 = await sifrele(abone, mesaj);
  ok("her gönderimde yeni tuz", b64url(s.tuz) !== b64url(s2.tuz));
  ok("aynı metin farklı şifreli gövde üretir", b64url(s.govde) !== b64url(s2.govde));

  // Bozuk abonelik → açık hata (sessiz çöp gönderimi yok)
  let hata = null;
  try { await sifrele({ p256dh: b64url(new Uint8Array(10)), auth: b64url(auth) }, "x"); }
  catch (e) { hata = String(e.message); }
  ok("bozuk p256dh açık hata verir", !!hata && /65 bayt/.test(hata), hata || "hata yok");

  // ---------- 2) VAPID ----------
  console.log("\n2) VAPID JWT (RFC 8292)");
  const vap = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const vapJwk = await crypto.subtle.exportKey("jwk", vap.privateKey);
  const { jwt, acik } = await vapidJwt(vapJwk, abone.endpoint, "mailto:test@ornek.com");

  const [h, p, imzaB64] = jwt.split(".");
  ok("JWT 3 parça", !!h && !!p && !!imzaB64);

  const bas = JSON.parse(Buffer.from(h.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
  const gov = JSON.parse(Buffer.from(p.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
  ok("alg = ES256", bas.alg === "ES256");
  ok("aud = push servisi kökü", gov.aud === "https://fcm.googleapis.com", gov.aud);
  ok("sub iletişim adresi", /^mailto:|^https:/.test(gov.sub), gov.sub);
  ok("exp gelecekte (≤24 saat)", gov.exp > Math.floor(Date.now() / 1000) && gov.exp <= Math.floor(Date.now() / 1000) + 86400);

  const dogrula = await crypto.subtle.importKey(
    "jwk", { kty: "EC", crv: "P-256", x: vapJwk.x, y: vapJwk.y },
    { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]
  );
  const imza = b64urlCoz(imzaB64);
  ok("imza ham r||s (64 bayt, DER değil)", imza.length === 64, imza.length + " bayt");
  ok("imza doğrulanıyor", await crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" }, dogrula, imza,
    new TextEncoder().encode(h + "." + p)
  ));
  ok("açık anahtar 65 bayt 0x04", b64urlCoz(acik).length === 65 && b64urlCoz(acik)[0] === 4);

  // Farklı endpoint → farklı aud (imza karışmasın)
  const v2 = await vapidJwt(vapJwk, "https://updates.push.services.mozilla.com/wpush/v2/abc", "mailto:t@o.com");
  const g2 = JSON.parse(Buffer.from(v2.jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
  ok("Mozilla endpoint için aud = mozilla kökü", g2.aud === "https://updates.push.services.mozilla.com", g2.aud);

  // ---------- 3) ABONELİK DOĞRULAMA ----------
  console.log("\n3) Abonelik doğrulama");
  ok("geçerli abonelik", aboneGecerliMi(abone));
  ok("http endpoint reddedilir", !aboneGecerliMi({ ...abone, endpoint: "http://x/y" }));
  ok("eksik auth reddedilir", !aboneGecerliMi({ ...abone, auth: "" }));
  ok("kısa p256dh reddedilir", !aboneGecerliMi({ ...abone, p256dh: b64url(new Uint8Array(32)) }));
  ok("null güvenli", !aboneGecerliMi(null));

  // ---------- 4) ÜRETİLEN DOSYA SENKRON MU ----------
  console.log("\n4) Edge fonksiyon derlemesi");
  const { execFileSync } = require("child_process");
  let kontrol = "";
  try {
    kontrol = execFileSync(process.execPath, [path.join(KOK, "scripts", "bildirim-derle.js"), "--kontrol"], { encoding: "utf8" }).trim();
  } catch (e) {
    kontrol = String((e.stdout || "") + (e.stderr || "")).trim();
  }
  ok("index.ts şablon + kripto ile güncel", kontrol === "güncel", kontrol);

  // ---------- 5) YETKİ KAPILARI ----------
  console.log("\n5) Edge fonksiyon yetki kapıları");
  const surucu = fs.readFileSync(path.join(KOK, "supabase", "functions", "bildirim-gonder", "index.ts"), "utf8");
  ok("mod:run x-bildirim-secret istiyor",
    /mod !== "run"[\s\S]{0,400}x-bildirim-secret/.test(surucu) && /SECRET \|\| gelen !== SECRET/.test(surucu));
  ok("mod:test JWT'yi /auth/v1/user ile doğruluyor", /\/auth\/v1\/user/.test(surucu) && /mod === "test"/.test(surucu));
  ok("mod:test yalnız çağıranın aboneliğini okuyor", /abonelikler\("&user_id=eq\." \+ u\.id\)/.test(surucu));
  ok("yalnız test|run modları var", /geçersiz mod — test \| run/.test(surucu));
  ok("sessiz saat koruması var", /sessiz saat/.test(surucu));
  // v35.4: tek "günün bildirimi" yerine ANAHTAR başına günlük tekilleştirme.
  ok("günlük tekilleştirme bildirim_log anahtarlarıyla", /gunlukAnahtarlar\(/.test(surucu) && /bildirim_log\?select=anahtar/.test(surucu));
  ok("gönderilen anahtar kaydediliyor (tekrar atmaz)", /await anahtarYaz\(/.test(surucu) && /bildirim_log\?on_conflict=user_id,anahtar/.test(surucu));
  ok("sabah tüm bildirimler, akşam yalnız kritik", /vardiya: aksam \? "aksam" : "sabah"/.test(surucu) && /KRITIK/.test(surucu));
  ok("bildirim metinleri gömülü tek kaynaktan (buildMessages)", /function buildMessages\s*\(/.test(surucu));
  ok("ölü abonelikler siliniyor (404/410)", /410/.test(surucu) && /await sil\(a\.id\)/.test(surucu));
  ok("service role anahtarı tarayıcıya sızmıyor", !/service_role/.test(fs.readFileSync(path.join(KOK, "site", "push-bildirim.js"), "utf8")));
  ok("VAPID özel anahtarı depoda yok",
    !fs.readFileSync(path.join(KOK, "site", "push-bildirim.js"), "utf8").includes("Q-SA82vvE8VWKFSm"));

  // ---------- 6) TARAYICI TARAFI ----------
  console.log("\n6) Tarayıcı tarafı (push-bildirim.js)");
  const pb = fs.readFileSync(path.join(KOK, "site", "push-bildirim.js"), "utf8");
  ok("pushManager.subscribe kullanılıyor", /pushManager\.subscribe/.test(pb));
  ok("userVisibleOnly: true", /userVisibleOnly:\s*true/.test(pb));
  ok("farklı anahtarlı eski abonelik yenilenir", /unsubscribe\(\)/.test(pb));
  ok("push_abonelikleri tablosuna yazıyor", /push_abonelikleri/.test(pb));
  ok("REST yedek yolu var (SDK yoksa)", /rest\/v1\/push_abonelikleri/.test(pb));
  ok("ham hata metni yerine Türkçe cümle", /anlasilirHata/.test(pb));

  console.log("\n" + (kalan === 0 ? "✓ TÜMÜ GEÇTİ" : "✗ BAŞARISIZ") + "  (" + gecen + " geçti, " + kalan + " kaldı)");
  process.exit(kalan === 0 ? 0 : 1);
})().catch((e) => { console.error("TEST ÇÖKTÜ:", e); process.exit(1); });
