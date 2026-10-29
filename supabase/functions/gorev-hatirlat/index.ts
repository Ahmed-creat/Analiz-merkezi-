/* ============================================================
   GÖREV HATIRLATICI — Supabase Edge Function (Deno)
   ------------------------------------------------------------
   SORU (kullanıcı): "Her sabah görevleri hatırlatıyor mu?"

   KÖK NEDEN: sabah vardiyası (bildirim-gonder, mod=run) yalnız
   TEKRAR GÜNÜ gelen konularda mesaj üretiyordu. O gün hiç tekrar
   yoksa sabah HİÇBİR bildirim gelmiyordu; günlük görevler
   (konu çalış / kitap oku / soru çöz) hiç hatırlatılmıyordu.

   ÇÖZÜM: Bu küçük fonksiyon her sabah (TR 07:40) çalışır,
   app_states içindeki dailyTasks + bkt_state'e bakar ve o gün
   BİTMEMİŞ çekirdek görev varsa tek bir bildirim gönderir.
   Gönderimi kendisi yapmaz: şifreleme/push işini zaten yapan
   bildirim-gonder fonksiyonunu mod="tekil" ile çağırır.
   Böylece push kripto kodu TEK yerde kalır.

   Sırlar (otomatik):
     SUPABASE_URL · SUPABASE_SERVICE_ROLE_KEY · BILDIRIM_SECRET
   Çağrı: POST /functions/v1/gorev-hatirlat
          x-bildirim-secret: <BILDIRIM_SECRET>
   ============================================================ */

const SURL = (Deno.env.get("SUPABASE_URL") || "").replace(/\/$/, "");
const SRV = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const SECRET = Deno.env.get("BILDIRIM_SECRET") || "";

function json(g: unknown, kod = 200) {
  return new Response(JSON.stringify(g, null, 2), {
    status: kod,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

async function rest(yol: string) {
  const r = await fetch(SURL + "/rest/v1/" + yol, {
    headers: { apikey: SRV, Authorization: "Bearer " + SRV, "Accept-Profile": "public" }
  });
  if (!r.ok) throw new Error("REST " + r.status + " " + (await r.text()).slice(0, 160));
  return await r.json();
}

// Türkiye takvim günü (UTC+3) — "2026-10-29"
function trGun(simdi = new Date()) {
  const t = new Date(simdi.getTime() + 3 * 3600 * 1000);
  return t.toISOString().slice(0, 10);
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
    const abonelikler = await rest("push_abonelikleri?select=user_id,aktif&aktif=eq.true");
    const kullanicilar: string[] = [];
    abonelikler.forEach(function (a: any) {
      if (a && a.user_id && kullanicilar.indexOf(a.user_id) < 0) kullanicilar.push(a.user_id);
    });
    if (!kullanicilar.length) return json({ abonelik: 0, gonderilen: 0, gun: bugun });

    const sonuc: any[] = [];
    for (const uid of kullanicilar) {
      let state: any = null;
      try {
        const satirlar = await rest("app_states?select=state&user_id=eq." + encodeURIComponent(uid) + "&limit=1");
        state = satirlar && satirlar[0] ? satirlar[0].state : null;
      } catch (e) {
        sonuc.push({ user_id: uid, hata: "durum okunamadı" });
        continue;
      }
      const kalan = state ? kalanGorevler(state, bugun) : [];
      if (!kalan.length) { sonuc.push({ user_id: uid, atlandi: "bugünün görevleri bitmiş" }); continue; }

      const ad = state && state.user && state.user.name ? String(state.user.name).slice(0, 24) : "";
      const mesaj = (ad ? ad + ", " : "") + "bugünün görevleri: " + kalan.join(" · ") +
        ". Uygulamayı aç, tek tek işaretle.";
      try {
        const r = await fetch(SURL + "/functions/v1/bildirim-gonder", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-bildirim-secret": SECRET },
          body: JSON.stringify({ mod: "tekil", user_id: uid, mesaj: mesaj })
        });
        const govde: any = await r.json().catch(function () { return {}; });
        sonuc.push({ user_id: uid, http: r.status, gonderilen: govde && govde.gonderilen, kalan: kalan.length });
      } catch (e) {
        sonuc.push({ user_id: uid, hata: String(e).slice(0, 120) });
      }
    }
    const gonderilen = sonuc.filter(function (x) { return x && x.http === 200 && x.gonderilen; }).length;
    return json({ gun: bugun, abonelik: kullanicilar.length, gonderilen, sonuc });
  } catch (e) {
    return json({ hata: String(e).slice(0, 200) }, 500);
  }
});
