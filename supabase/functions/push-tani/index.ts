// PUSH TANI — bos ya da sifreli push gonderir; hangi katmanin bozuk oldugunu ayirir.
// sifreli="webpush" -> bagimsiz web-push kutuphanesi ile sifreler (referans uygulama)
// v8 (v61) — OLU ABONELIK TEMIZLIGI: Chrome uc noktayi iptal ettiyse (404/410)
// kaydi PASIFE alir. Yoksa ayni kullaniciya her cron'da olu uclara push gider
// ve gercek cihaz mesaji kacirir (olcum: 16 Kas, 6 aktif abonelik).
const enc = new TextEncoder();
const b64url = (bytes: Uint8Array) => {
  let s = ""; const b = new Uint8Array(bytes);
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s).split("+").join("-").split("/").join("_").replace(/=+$/, "");
};
const b64Coz = (s: string) => {
  const t = String(s || "").replace(/-/g, "+").replace(/_/g, "/");
  const pad = t.length % 4 === 0 ? "" : "=".repeat(4 - (t.length % 4));
  const bin = atob(t + pad); const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
};
const birlestir = (...p: Uint8Array[]) => {
  const n = p.reduce((a, b) => a + b.length, 0); const o = new Uint8Array(n);
  let i = 0; for (const x of p) { o.set(x, i); i += x.length; } return o;
};
const SURL = Deno.env.get("SUPABASE_URL") || "";
const SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const SECRET = Deno.env.get("BILDIRIM_SECRET") || "";
const KONU = Deno.env.get("VAPID_KONU") || "mailto:bildirim@analiz-merkezi.app";
const VAPID_ACIK = (Deno.env.get("VAPID_PUBLIC_KEY") || "").trim();
function ozelJwk(): any {
  const ham = (Deno.env.get("VAPID_PRIVATE_JWK") || "").trim();
  if (!ham) throw new Error("VAPID_PRIVATE_JWK yok");
  if (ham.startsWith("{")) { const j = JSON.parse(ham); if (j && j.d && j.x && j.y) return j; }
  const p = ham.split(".");
  if (p.length === 3) return { kty: "EC", crv: "P-256", x: p[0], y: p[1], d: p[2] };
  throw new Error("VAPID_PRIVATE_JWK okunamadi");
}
async function vapidJwt(jwk: any, endpoint: string) {
  const url = new URL(endpoint);
  const bas = { typ: "JWT", alg: "ES256" };
  const govde = { aud: url.origin, exp: Math.floor(Date.now() / 1000) + 3600, sub: KONU };
  const imzasiz = b64url(enc.encode(JSON.stringify(bas))) + "." + b64url(enc.encode(JSON.stringify(govde)));
  const anahtar = await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const imza = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, anahtar, enc.encode(imzasiz)));
  const acik = b64url(birlestir(new Uint8Array([4]), b64Coz(jwk.x), b64Coz(jwk.y)));
  return { jwt: imzasiz + "." + b64url(imza), acik };
}
function json(g: unknown, kod = 200) {
  return new Response(JSON.stringify(g, null, 2), { status: kod, headers: { "Content-Type": "application/json" } });
}
Deno.serve(async (istek) => {
  try {
    if (istek.method !== "POST") return json({ hata: "POST" }, 405);
    const g = await istek.json().catch(() => ({}));
    const gelen = istek.headers.get("x-bildirim-secret") || "";
    if (!SECRET || gelen !== SECRET) return json({ hata: "yetkisiz" }, 401);
    const id = String(g.abonelik_id || "");
    if (!id) return json({ hata: "abonelik_id gerekli" }, 400);
    const y = await fetch(SURL + "/rest/v1/push_abonelikleri?select=*&id=eq." + encodeURIComponent(id), {
      headers: { apikey: SK, Authorization: "Bearer " + SK }
    });
    const liste = await y.json().catch(() => []);
    if (!Array.isArray(liste) || !liste.length) return json({ hata: "abonelik yok" }, 404);
    const a = liste[0];
    const jwt = await vapidJwt(ozelJwk(), a.endpoint);
    // v9 — URGENCY + TOPIC (RFC 8030 5.3 / 5.4).
    // OLCUM (16 Kas): 07:35'te FCM 201 dondu, cihazda TEK satir yok. Sebep
    // mesajin cihaz uykudayken kuyrukta beklemesi ve TTL'in dolmasi.
    //  • Urgency: high  -> FCM yuksek oncelik; cihaz uykudan uyandirilabilir.
    //  • Topic          -> ayni vardiyanin tekrar denemeleri YIGILMAZ, son
    //                      mesaj eskisinin yerine gecer (4 ayri bildirim olmaz).
    const topic = String(g.topic || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 32);
    const basliklar: Record<string, string> = {
      Authorization: "vapid t=" + jwt.jwt + ", k=" + (jwt.acik || VAPID_ACIK),
      TTL: g.ttl ? String(g.ttl) : "21600",
      Urgency: g.urgency ? String(g.urgency) : "high"
    };
    if (topic) basliklar.Topic = topic;
    // v10 — KURU ÇALIŞTIRMA: bildirimi GÖNDERMEDEN hangi başlıkların
    // kullanılacağını döndürür. Canlı doğrulama için cihaza test bildirimi
    // atmadan "TTL/urgency/topic gerçekten yazılıyor mu" ölçülür.
    if (g.kuru === true) {
      return json({
        kuru: true,
        endpointSon4: String(a.endpoint).slice(-4),
        ttl: basliklar.TTL,
        urgency: basliklar.Urgency,
        topic: basliklar.Topic || null,
        sifreli: g.sifreli || "yok"
      });
    }
    let govde: Uint8Array | undefined;
    let not = "";
    if (g.sifreli === "webpush") {
      const mod = await import("npm:web-push@3.6.7");
      const wp = (mod as any).default || mod;
      const det = wp.generateRequestDetails(
        { endpoint: a.endpoint, keys: { p256dh: a.p256dh, auth: a.auth } },
        String(g.mesaj || "Analiz Merkezi test"),
        { contentEncoding: "aes128gcm" }
      );
      govde = new Uint8Array(det.body);
      basliklar["Content-Encoding"] = "aes128gcm";
      basliklar["Content-Type"] = det.headers["Content-Type"] || "application/octet-stream";
      not = "web-push " + (govde ? govde.length : 0) + " bayt";
    }
    const r = await fetch(a.endpoint, { method: "POST", headers: basliklar, body: govde });
    const metin = r.status === 201 ? "" : (await r.text().catch(() => "")).slice(0, 300);

    // v8 — OLU ABONELIK: 404/410 -> pasife al. Boylece ayni kullaniciya
    // mukerrer/olu uclara gonderim surmez.
    let kapatildi = false;
    if (r.status === 404 || r.status === 410) {
      kapatildi = true;
      await fetch(SURL + "/rest/v1/push_abonelikleri?id=eq." + encodeURIComponent(id), {
        method: "PATCH",
        headers: {
          apikey: SK, Authorization: "Bearer " + SK,
          "Content-Type": "application/json", Prefer: "return=minimal"
        },
        body: JSON.stringify({ aktif: false, updated_at: new Date().toISOString() })
      }).catch(() => { /* temizlik basarisizsa gonderim sonucu yine doner */ });
    }
    return json({
      kod: r.status, metin, not,
      sifreli: g.sifreli || "yok",
      endpointSon4: String(a.endpoint).slice(-4),
      kapatildi,
      ttl: basliklar.TTL,
      urgency: basliklar.Urgency,
      topic: basliklar.Topic || null
    });
  } catch (e) {
    return json({ hata: String(e).slice(0, 300) }, 500);
  }
});
