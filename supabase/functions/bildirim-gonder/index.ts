// ⚠ ELLE YAZILIR (v59) — scripts/bildirim-derle.js artık bu dosyayı ÜRETMEZ.
// Sunucuya yüklenen sürüm: version 13 (lean, run=kapalı).
// BILDIRIM GONDER (v59 — yalin surum)
// ------------------------------------------------------------
// NEDEN DEGISTI: bu fonksiyonun icindeki gomulu sifreleme kodu eskidigi icin
// FCM 201 donuyor ama Chrome govdeyi cozemediginden push OLAYI cihaza hic
// ulasmiyordu. Gorev dagilimi artik soyle:
//   gonderim  -> push-tani (web-push ile sifreler) + public.webpush_tetikle (cron)
//   bu fonksiyon yalnizca:
//     mod=saglik -> imza atan GERCEK acik anahtari yayinlar (uygulama aboneligi
//                   bu anahtarla kurar; iki taraf ayrisamaz)
//     mod=test   -> sahip KULLANICI kendi aboneligine test push'u (push-tani'ya devreder)
//     mod=run    -> KAPALI (eski GitHub Actions yolu; tek kanal kurali)
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
const SURL = Deno.env.get("SUPABASE_URL") || "";
const SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const SECRET = Deno.env.get("BILDIRIM_SECRET") || "";
const VAPID_ACIK = (Deno.env.get("VAPID_PUBLIC_KEY") || "").trim();
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-bildirim-secret",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
};
function json(g: unknown, kod = 200) {
  return new Response(JSON.stringify(g, null, 2), {
    status: kod, headers: { ...cors, "Content-Type": "application/json" }
  });
}
function ozelJwk(): any {
  const ham = (Deno.env.get("VAPID_PRIVATE_JWK") || "").trim();
  if (!ham) throw new Error("VAPID_PRIVATE_JWK yok");
  if (ham.startsWith("{")) { const j = JSON.parse(ham); if (j && j.d && j.x && j.y) return j; }
  const p = ham.split(".");
  if (p.length === 3) return { kty: "EC", crv: "P-256", x: p[0], y: p[1], d: p[2] };
  throw new Error("VAPID_PRIVATE_JWK okunamadi");
}
Deno.serve(async (istek) => {
  if (istek.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const g = await istek.json().catch(() => ({}));
    const mod = String((g && g.mod) || "");

    if (mod === "saglik") {
      let turetilen = "", gecerli = false;
      try {
        const j = ozelJwk();
        const xb = b64Coz(j.x), yb = b64Coz(j.y);
        const ham = new Uint8Array(65);
        ham[0] = 4; ham.set(xb, 1); ham.set(yb, 33);
        turetilen = b64url(ham);
        gecerli = xb.length === 32 && yb.length === 32;
      } catch (_) { gecerli = false; }
      const imza = turetilen || VAPID_ACIK;
      return json({
        surum: "v59",
        acikAnahtar: imza,
        vapid: {
          ozelAnahtarVar: !!Deno.env.get("VAPID_PRIVATE_JWK"),
          ozelAnahtarCozuluyor: gecerli,
          acikAnahtarVar: !!VAPID_ACIK,
          turetilenAnahtar: turetilen,
          turetilenParmak: turetilen.slice(0, 24),
          tarayiciParmak: VAPID_ACIK.slice(0, 24),
          imzaTarayiciIleAyni: !!turetilen && turetilen === VAPID_ACIK
        },
        gonderimYolu: "push-tani (web-push)",
        bildirimSecretVar: !!SECRET
      });
    }

    // GONDERIM KAPALI — tek kanal: pg_cron -> webpush_tetikle -> push-tani
    if (mod === "run") {
      return json({
        mod,
        kapali: true,
        neden: "Gonderim bu fonksiyondan kaldirildi (v59). Tek kanal: webpush_tetikle + push-tani.",
        gonderilen: 0
      });
    }

    if (mod === "test") {
      const yetki = istek.headers.get("Authorization") || "";
      if (!/^Bearer +/i.test(yetki)) return json({ hata: "oturum gerekli" }, 401);
      const uy = await fetch(SURL + "/auth/v1/user", { headers: { apikey: SK, Authorization: yetki } });
      const u = await uy.json().catch(() => ({}));
      if (!u || !u.id) return json({ hata: "oturum dogrulanamadi" }, 401);
      const ly = await fetch(SURL + "/rest/v1/push_abonelikleri?select=id&aktif=is.true&user_id=eq." + encodeURIComponent(u.id), {
        headers: { apikey: SK, Authorization: "Bearer " + SK }
      });
      const liste = await ly.json().catch(() => []);
      if (!Array.isArray(liste) || !liste.length) return json({ hata: "bu hesapta kayitli push abonelik yok" }, 404);
      const sonuc = [];
      for (const a of liste) {
        const r = await fetch(SURL + "/functions/v1/push-tani", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-bildirim-secret": SECRET },
          body: JSON.stringify({
            abonelik_id: a.id,
            ttl: "600",
            sifreli: "webpush",
            mesaj: JSON.stringify({
              title: "Analiz Merkezi",
              body: "Test bildirimi — kanal calisiyor.",
              url: "./",
              kind: "test"
            })
          })
        });
        const j = await r.json().catch(() => ({ kod: r.status }));
        sonuc.push({ id: a.id, ...j });
      }
      return json({ mod, gonderilen: sonuc.filter((x: any) => x.kod === 201).length, sonuc });
    }

    return json({ hata: "gecersiz mod — saglik | test" }, 400);
  } catch (e) {
    return json({ hata: String(e).slice(0, 300) }, 500);
  }
});
