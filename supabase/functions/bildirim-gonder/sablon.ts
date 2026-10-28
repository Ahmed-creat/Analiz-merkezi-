/* ============================================================
   BİLDİRİM GÖNDERİCİ — Supabase Edge Function (Deno)
   ------------------------------------------------------------
   AMAÇ: "Uygulama kapalıyken bildirim atması gerekiyor."

   Akış:
     pg_cron (her gün 16:00 UTC = 19:00 TR)
        → net.http_post /functions/v1/bildirim-gonder  {mod:"run"}
        → bu fonksiyon kullanıcıların push_abonelikleri'ni okur
        → her aboneliğe Web Push (RFC 8291 aes128gcm + RFC 8292 VAPID)
        → servis çalışanı (sw.js) push olayını yakalar ve sistem bildirimi
          gösterir — UYGULAMA KAPALIYKEN DE (Android/Chrome, masaüstü,
          iOS 16.4+ yalnız "Ana Ekrana Ekle" ile).

   Gizli değerler (Supabase → Edge Functions → Secrets):
     VAPID_PUBLIC_KEY   · VAPID_PRIVATE_JWK (x.y.d biçimi)
     BILDIRIM_SECRET    · VAPID_KONU (mailto:...)
     SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (otomatik)

   Modlar:
     run  → tüm aktif aboneliklere (x-bildirim-secret zorunlu)
     test → YALNIZ çağıranın kendi aboneliğine (JWT zorunlu)
   ============================================================ */

// ---- KRİPTO (kaynak: scripts/webpush-kripto.mjs — scripts/bildirim-derle.js ile gömülür) ----
//__KRIPTO__

const SURL = Deno.env.get("SUPABASE_URL")!;
const SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_OZEL = Deno.env.get("VAPID_PRIVATE_JWK") || "";
const VAPID_ACIK = Deno.env.get("VAPID_PUBLIC_KEY") || "";
const SECRET = Deno.env.get("BILDIRIM_SECRET") || "";
const KONU = Deno.env.get("VAPID_KONU") || "mailto:bildirim@analiz-merkezi.app";

const sbB = () => ({ apikey: SK, Authorization: "Bearer " + SK, "Content-Type": "application/json" });
const gun = (d: Date) => new Date(d.getTime() + 3 * 3600 * 1000).toISOString().slice(0, 10); // TR günü

function ozelJwk() {
  // "x.y.d" (kompakt) ya da JSON kabul edilir
  if (VAPID_OZEL.trim().startsWith("{")) return JSON.parse(VAPID_OZEL);
  const [x, y, d] = VAPID_OZEL.split(".");
  return { kty: "EC", crv: "P-256", x, y, d };
}

/** Kullanıcının durumundan BUGÜN için anlamlı tek bildirim seç. */
function mesajSec(state: any, bugun: string) {
  const s = state || {};
  // 1) Bugün (veya gecikmiş) konu tekrarı
  const tekrarlar = [];
  for (const key of Object.keys(s.memory || {})) {
    const mem = s.memory[key] || {};
    const sch = mem.schedule || {};
    const tarihler = Object.values(sch).filter(Boolean) as string[];
    if (!tarihler.length) continue;
    const sirali = tarihler.slice().sort();
    const ilk = sirali[0];
    if (ilk && ilk <= bugun) tekrarlar.push({ key, tarih: ilk });
  }
  if (tekrarlar.length) {
    const adlar = tekrarlar.slice(0, 2).map(t => String(t.key).split(" > ").slice(1).join(" > ") || String(t.key));
    return {
      title: tekrarlar.length + " konunun tekrar günü",
      body: adlar.join(" · ") + (tekrarlar.length > 2 ? " ve " + (tekrarlar.length - 2) + " konu daha" : ""),
      url: "./#konu=" + encodeURIComponent(tekrarlar[0].key),
      kind: "review"
    };
  }
  // 2) Kısa kontrol / öğrenme testi bekleyen konular
  const testler = [];
  for (const key of Object.keys(s.bkt_state || {})) {
    const e = s.bkt_state[key] || {};
    const vade = e.precheck_due || e.learning_test_due;
    if (vade && String(vade) <= bugun && (e.onay_durumu || "") !== "ONAYLANDI") testler.push(key);
  }
  if (!testler.length && Array.isArray(s.mini_test_kuyrugu)) {
    s.mini_test_kuyrugu.forEach((x: any) => { if (x && !x.completed && x.topicKey) testler.push(x.topicKey); });
  }
  if (testler.length) {
    const ad = String(testler[0]).split(" > ").slice(1).join(" > ") || String(testler[0]);
    return {
      title: testler.length + " konuda kısa kontrol hazır (3 soru)",
      body: ad + " · 3 dakikada biter",
      url: "./#konu=" + encodeURIComponent(testler[0]),
      kind: "test"
    };
  }
  // 3) Sınav yaklaşıyor
  const hedef = s.plan && s.plan.targetDate;
  if (hedef) {
    const kalan = Math.round((Date.parse(hedef + "T00:00:00Z") - Date.parse(bugun + "T00:00:00Z")) / 86400000);
    if (kalan >= 0 && kalan <= 7) {
      return { title: "Sınava " + kalan + " gün kaldı", body: "Bugün eksik konularını kapat; yeni konu açma.", url: "./", kind: "exam" };
    }
  }
  // 4) Günlük görev
  const dt = s.dailyTasks || {};
  if (dt.date !== bugun || !(dt.study || dt.read || dt.solve)) {
    const seri = Number(s.streak && (s.streak.count || s.streak.current) || 0);
    return {
      title: seri > 0 ? seri + " günlük serini bozma" : "Bugünkü hedefin duruyor",
      body: "10 soru ya da bir konu tekrarı — 5 dakika yeter.",
      url: "./",
      kind: "daily"
    };
  }
  return null;
}

async function gonder(abone: any, mesaj: any) {
  const jwt = await vapidJwt(ozelJwk(), abone.endpoint, KONU);
  const govde = await sifrele({ p256dh: abone.p256dh, auth: abone.auth }, JSON.stringify(mesaj));
  const y = await fetch(abone.endpoint, {
    method: "POST",
    headers: {
      Authorization: "vapid t=" + jwt.jwt + ", k=" + (jwt.acik || VAPID_ACIK),
      "Content-Encoding": "aes128gcm",
      "Content-Type": "application/octet-stream",
      TTL: "86400",
      Urgency: mesaj.kind === "review" ? "normal" : "low"
    },
    body: govde
  });
  return { kod: y.status, metin: y.status === 201 ? "" : (await y.text().catch(() => "")).slice(0, 200) };
}

async function abonelikler(filtre: string) {
  const y = await fetch(SURL + "/rest/v1/push_abonelikleri?select=*&aktif=is.true" + filtre, { headers: sbB() });
  if (!y.ok) throw new Error("push_abonelikleri HTTP " + y.status);
  return await y.json();
}

async function durumAl(userId: string) {
  const y = await fetch(SURL + "/rest/v1/app_states?select=state&user_id=eq." + userId, { headers: sbB() });
  const r = await y.json().catch(() => []);
  return Array.isArray(r) && r[0] ? r[0].state : null;
}

async function isaretle(id: string, bugun: string) {
  await fetch(SURL + "/rest/v1/push_abonelikleri?id=eq." + id, {
    method: "PATCH",
    headers: { ...sbB(), Prefer: "return=minimal" },
    body: JSON.stringify({ son_gonderim: bugun })
  }).catch(() => {});
}

async function sil(id: string) {
  await fetch(SURL + "/rest/v1/push_abonelikleri?id=eq." + id, {
    method: "DELETE", headers: { ...sbB(), Prefer: "return=minimal" }
  }).catch(() => {});
}

Deno.serve(async (istek) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-bildirim-secret",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
  };
  if (istek.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (v: unknown, k = 200) => new Response(JSON.stringify(v, null, 2), {
    status: k, headers: { ...cors, "Content-Type": "application/json" }
  });

  let g: any = {};
  try { g = await istek.json(); } catch { g = {}; }
  const mod = String(g.mod || "run");
  const bugun = gun(new Date());

  if (!VAPID_OZEL || !VAPID_ACIK) return json({ hata: "VAPID anahtarları tanımlı değil" }, 500);

  try {
    // --- TEST: yalnız çağıranın kendi aboneliği ---
    if (mod === "test") {
      const yetki = istek.headers.get("Authorization") || "";
      if (!/^Bearer\s+/i.test(yetki)) return json({ hata: "oturum gerekli" }, 401);
      const uy = await fetch(SURL + "/auth/v1/user", { headers: { apikey: SK, Authorization: yetki } });
      const u = await uy.json().catch(() => ({}));
      if (!u || !u.id) return json({ hata: "oturum doğrulanamadı" }, 401);
      const liste = await abonelikler("&user_id=eq." + u.id);
      if (!liste.length) return json({ hata: "bu hesapta kayıtlı push aboneliği yok" }, 404);
      const durum = await durumAl(u.id);
      const mesaj = g.mesaj || mesajSec(durum, bugun) || {
        title: "Analiz Merkezi", body: "Bildirimler çalışıyor — uygulama kapalıyken de gelecek.", url: "./", kind: "test"
      };
      const sonuc = [];
      for (const a of liste) {
        const r = await gonder(a, mesaj);
        sonuc.push({ id: a.id, ...r });
        if (r.kod === 410 || r.kod === 404) await sil(a.id);
      }
      return json({ mod, gonderilen: sonuc.filter(x => x.kod === 201).length, sonuc });
    }

    // --- RUN: günlük toplu gönderim ---
    if (mod !== "run") return json({ hata: "geçersiz mod — test | run" }, 400);
    const gelen = istek.headers.get("x-bildirim-secret") || "";
    if (!SECRET || gelen !== SECRET) return json({ hata: "yetkisiz (x-bildirim-secret)" }, 401);

    // Sessiz saat: TR 09:00–22:00 dışında gönderme (cron zaten 19:00'da çalışır)
    const trSaat = (new Date().getUTCHours() + 3) % 24;
    if (trSaat < 8 || trSaat >= 22) return json({ mod, atlandi: "sessiz saat", trSaat });

    const abonelikler_ = await abonelikler("");
    const durumlar = new Map<string, any>();
    let gonderilen = 0;
    const hatalar: any[] = [];
    for (const a of abonelikler_) {
      if (a.son_gonderim === bugun) continue;              // günde en fazla 1 bildirim
      if (!aboneGecerliMi(a)) { await sil(a.id); continue; }
      if (!durumlar.has(a.user_id)) durumlar.set(a.user_id, await durumAl(a.user_id));
      const mesaj = mesajSec(durumlar.get(a.user_id), bugun);
      if (!mesaj) continue;                                 // söyleyecek sözü yoksa rahatsız etme
      const r = await gonder(a, mesaj);
      if (r.kod === 201) { gonderilen++; await isaretle(a.id, bugun); }
      else if (r.kod === 404 || r.kod === 410) await sil(a.id);   // abonelik ölmüş
      else hatalar.push({ id: a.id, ...r });
    }
    return json({ mod, abonelik: abonelikler_.length, gonderilen, hatalar: hatalar.slice(0, 10), gun: bugun });
  } catch (e) {
    return json({ hata: String(e) }, 500);
  }
});
