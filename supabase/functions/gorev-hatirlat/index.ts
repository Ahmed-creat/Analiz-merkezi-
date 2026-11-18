/* ============================================================
   GÖREV HATIRLATICI — Supabase Edge Function (Deno)  ·  v87
   ------------------------------------------------------------
   KULLANICI (18 Kas):
     "Bugün hiç bildirim gelmedi. Son düzeltmeler neyi değiştirdi."

   ÖLÇÜM (canlı, 18 Kas 07:40): bu fonksiyon çalışıyor ama
   `bildirim-gonder`e mod=tekil diyor; o fonksiyon v59'da
   yalnız `saglik | test` kabul ediyor → **HTTP 400**. Yani sabah
   görev hatırlatması HİÇ gönderilmiyordu (net._http_response 210).

   ÇÖZÜM — TEK KANAL: `push-tani` (web-push).
   Vardiya hatırlatması (public.webpush_tetikle) nasıl çalışıyorsa
   görev hatırlatması da aynı yoldan gider:
     • cihaz "gösterdim" (push_teslim.gosterildi=true) yazana kadar
       günde en fazla 3 deneme (07:40 · 09:40 · 11:40 TR),
     • deneme sayacı bildirim_log'da `YYYY-MM-DD:gorev:try:N`,
     • sessiz saat 06:00–21:00 (TR), `?zorla=1` ile atlanır.

   Çağrı: POST /functions/v1/gorev-hatirlat
          x-bildirim-secret: <BILDIRIM_SECRET>
   ============================================================ */

const SURL = (Deno.env.get("SUPABASE_URL") || "").replace(/\/$/, "");
const SRV = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const SECRET = Deno.env.get("BILDIRIM_SECRET") || "";

const BASLIK = "Bugünün görevleri";   // push_teslim.baslik ile BİREBİR aynı olmalı
const AZAMI_DENEME = 3;               // günde en fazla 3 (vardiya kuralıyla aynı mantık)
const TTL = "5400";                   // 90 dk: 2 saatte bir deneme → mesaj birikmez

function json(g: unknown, kod = 200) {
  return new Response(JSON.stringify(g, null, 2), {
    status: kod,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

type RestSecenek = { method?: string; body?: string; headers?: Record<string, string> };

async function rest(yol: string, secenek: RestSecenek = {}) {
  const r = await fetch(SURL + "/rest/v1/" + yol, {
    method: secenek.method || "GET",
    headers: Object.assign({
      apikey: SRV,
      Authorization: "Bearer " + SRV,
      "Accept-Profile": "public",
      "Content-Profile": "public"
    }, secenek.headers || {}),
    body: secenek.body
  });
  const metin = await r.text();
  let veri: any = null;
  try { veri = metin ? JSON.parse(metin) : null; } catch (_) { veri = null; }
  if (!r.ok) throw new Error("REST " + r.status + " " + metin.slice(0, 160));
  return { veri, satir: Array.isArray(veri) ? veri.length : 0 };
}

// Türkiye takvim günü (UTC+3) — "2026-10-29"
function trGun(simdi = new Date()) {
  const t = new Date(simdi.getTime() + 3 * 3600 * 1000);
  return t.toISOString().slice(0, 10);
}
// Türkiye gece yarısının UTC karşılığı (push_teslim.created_at filtresi için)
function trGunBaslangicIso(bugun: string) {
  return new Date(bugun + "T00:00:00+03:00").toISOString();
}

// O gün bitmemiş ÇEKİRDEK görevler (uygulamadaki gunlukGorevler() ile aynı kural)
function kalanGorevler(state: any, bugun: string) {
  const dt = (state && state.dailyTasks) || {};
  const tarih = dt.date || null;
  // Görev bayrakları yalnız BUGÜN için geçerli (dünkü işaret bugünü kapatmaz).
  const bugunGecerli = tarih === null || tarih === bugun;
  const bkt = (state && state.bkt_state) || {};
  const bugunAdim = Object.keys(bkt).some(function (k) {
    return bkt[k] && bkt[k].study_completed_at === bugun;
  });
  const kalan: string[] = [];
  if (!(bugunGecerli && dt.study) && !bugunAdim) kalan.push("konu çalış");
  if (!(bugunGecerli && dt.read)) kalan.push("kitap oku");
  if (!(bugunGecerli && dt.solve)) kalan.push("soru çöz");
  return kalan;
}

function son4(endpoint: string) {
  return String(endpoint || "").slice(-4);
}

Deno.serve(async (istek) => {
  try {
    if (istek.method !== "POST" && istek.method !== "GET") {
      return json({ hata: "yalnız POST" }, 405);
    }
    const gelen = istek.headers.get("x-bildirim-secret") || "";
    if (!SECRET || gelen !== SECRET) return json({ hata: "yetkisiz (x-bildirim-secret)" }, 401);
    if (!SURL || !SRV) return json({ hata: "sunucu sırları eksik" }, 500);

    const trSaat = (new Date().getUTCHours() + 3) % 24;
    // Sessiz saat: TR 06:00–21:00 dışında gönderme (gece bildirimi yok).
    const zorla = new URL(istek.url).searchParams.get("zorla") === "1";
    if (!zorla && (trSaat < 6 || trSaat >= 21)) return json({ atlandi: "sessiz saat", trSaat });

    const bugun = trGun();
    const gunBas = trGunBaslangicIso(bugun);

    // Kullanıcı → aktif abonelikler (uç noktanın son 4 hanesi eşleşme anahtarı)
    const abonelikler = (await rest("push_abonelikleri?select=id,user_id,endpoint&aktif=eq.true")).veri || [];
    const kullanicilar: string[] = [];
    const subsByUser: Record<string, any[]> = {};
    abonelikler.forEach(function (a: any) {
      if (!a || !a.user_id || !a.id) return;
      if (kullanicilar.indexOf(a.user_id) < 0) { kullanicilar.push(a.user_id); subsByUser[a.user_id] = []; }
      subsByUser[a.user_id].push(a);
    });
    if (!kullanicilar.length) return json({ abonelik: 0, gonderilen: 0, gun: bugun });

    // Bugün bu başlıkla GÖSTERİLMİŞ bildirim var mı? (cihazın kendi beyanı)
    let gosterilenler: string[] = [];
    try {
      const g = await rest("push_teslim?select=abonelik&asama=eq.gosterim&gosterildi=is.true" +
        "&baslik=eq." + encodeURIComponent(BASLIK) + "&created_at=gte." + encodeURIComponent(gunBas));
      gosterilenler = ((g.veri as any[]) || []).map(function (x: any) { return String(x.abonelik || ""); });
    } catch (_) { /* kanıt okunamazsa gönderim yine denenir */ }

    const sonuc: any[] = [];
    let gonderilen = 0;

    for (const uid of kullanicilar) {
      const subs = subsByUser[uid] || [];

      // 1) Cihaz gösterdiyse bir daha gönderme
      const gosterildi = subs.some(function (s: any) { return gosterilenler.indexOf(son4(s.endpoint)) >= 0; });
      if (gosterildi) { sonuc.push({ user_id: uid, atlandi: "cihaz gösterdi" }); continue; }

      // 2) Bugünün kalan görevleri
      let state: any = null;
      try {
        const satirlar = await rest("app_states?select=state&user_id=eq." + encodeURIComponent(uid) + "&limit=1");
        state = satirlar && (satirlar.veri as any[])[0] ? (satirlar.veri as any[])[0].state : null;
      } catch (e) {
        sonuc.push({ user_id: uid, hata: "durum okunamadı" });
        continue;
      }
      const kalan = state ? kalanGorevler(state, bugun) : [];
      if (!kalan.length) { sonuc.push({ user_id: uid, atlandi: "bugünün görevleri bitmiş" }); continue; }

      // 3) Deneme sınırı (günde 3)
      let deneme = 0;
      try {
        const l = await rest("bildirim_log?select=anahtar&user_id=eq." + encodeURIComponent(uid) +
          "&anahtar=like." + encodeURIComponent(bugun + ":gorev:try:*"));
        deneme = l.satir;
      } catch (_) { deneme = 0; }
      if (deneme >= AZAMI_DENEME) { sonuc.push({ user_id: uid, atlandi: "deneme sınırı" }); continue; }

      // 4) Deneme kaydı (çakışma = başka bir koşu zaten gönderdi)
      try {
        const ins = await rest("bildirim_log?on_conflict=user_id,anahtar", {
          method: "POST",
          headers: { "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=representation" },
          body: JSON.stringify([{ user_id: uid, anahtar: bugun + ":gorev:try:" + (deneme + 1), gun: bugun }])
        });
        if (!ins.satir) { sonuc.push({ user_id: uid, atlandi: "başka koşu gönderdi" }); continue; }
      } catch (_) { /* kayıt yazılamazsa gönderim yine denenir */ }

      const ad = state && state.user && state.user.name ? String(state.user.name).slice(0, 24) : "";
      const metin = (ad ? ad + ", " : "") + "bugünün görevleri: " + kalan.join(" · ") +
        ". Uygulamayı aç, tek tek işaretle.";
      const yuk = JSON.stringify({ title: BASLIK, body: metin, url: "./", kind: "tasks" });

      let buKullanici = 0;
      for (const s of subs) {
        try {
          const r = await fetch(SURL + "/functions/v1/push-tani", {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-bildirim-secret": SECRET },
            body: JSON.stringify({ abonelik_id: s.id, ttl: TTL, sifreli: "webpush", mesaj: yuk })
          });
          const govde: any = await r.json().catch(function () { return {}; });
          if (r.status === 200 && govde && govde.kod === 201) buKullanici++;
        } catch (_) { /* tek abonelik hatası diğerlerini durdurmaz */ }
      }
      gonderilen += buKullanici;
      sonuc.push({ user_id: uid, gonderilen: buKullanici, abonelik: subs.length, kalan: kalan.length });
    }

    return json({ gun: bugun, kanal: "push-tani", kullanici: kullanicilar.length, gonderilen, sonuc });
  } catch (e) {
    return json({ hata: String(e).slice(0, 200) }, 500);
  }
});
