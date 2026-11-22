// ============================================================
// HESAP SİL — hesap + TÜM veriler kalıcı olarak silinir (KVKK m.7)
// ------------------------------------------------------------
// KULLANICI (2 Kasım 2026): "Tmm silmeyi ekle"
//
// NEDEN GEREKLİ: Eski "Tüm verileri sil" yalnız cihazdaki kaydı ve bulut
// state'ini sıfırlıyordu; auth.users satırı, e-posta adresi ve okulizyon_kimlik
// (okul no bağı) KALIYORDU. KVKK m.7 silme hakkı karşılanmıyordu.
//
// NASIL ÇALIŞIR:
//   1) İstemci kendi oturum JWT'sini yollar (Authorization: Bearer ...).
//   2) Fonksiyon JWT'yi auth/v1/user ile doğrular → kullanıcı kimliği.
//   3) "SİL" onay metni eşleşmezse reddeder (yanlışlıkla silme koruması).
//   4) auth.users satırı silinir → ON DELETE CASCADE ile:
//        app_states, okulizyon_kimlik, okulizyon_kuyrugu, fcm_tokens,
//        push_abonelikleri, bildirimler, bildirim_log
//      bildirim_kuyrugu FK'sız olduğu için AYRICA silinir (aşağıda).
//      geri_bildirim / kazanim_konu_cache → SET NULL (kişisel veri kalmaz).
//
// GÜVENLİK: Kullanıcı YALNIZ kendini silebilir. Başka uid gönderilse bile
// yok sayılır — uid her zaman JWT'den gelir.
// ============================================================

const SURL = Deno.env.get("SUPABASE_URL")!;
const SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const cors: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ON DELETE CASCADE dışında kalan tablolar (elle temizlenir)
const EK_TABLOLAR = ["bildirim_kuyrugu", "push_teslim"];

Deno.serve(async (istek: Request) => {
  if (istek.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (v: unknown, k = 200) =>
    new Response(JSON.stringify(v), { status: k, headers: { ...cors, "Content-Type": "application/json" } });

  if (istek.method !== "POST") return json({ hata: "yalnız POST" }, 405);

  // 1) Oturum doğrula
  const yetki = istek.headers.get("Authorization") || "";
  if (!/^Bearer\s+/i.test(yetki)) return json({ hata: "oturum gerekli" }, 401);

  let uid = "";
  try {
    const y = await fetch(SURL + "/auth/v1/user", { headers: { apikey: SK, Authorization: yetki } });
    if (!y.ok) return json({ hata: "oturum doğrulanamadı" }, 401);
    const u: any = await y.json();
    uid = String(u?.id || "");
  } catch (e) {
    return json({ hata: "oturum doğrulanamadı" }, 401);
  }
  if (!uid) return json({ hata: "oturum doğrulanamadı" }, 401);

  // 2) Onay metni — yanlışlıkla silmeyi engeller
  let g: any = {};
  try { g = await istek.json(); } catch { g = {}; }
  const onay = String(g?.onay || "").trim().toLocaleUpperCase("tr-TR");
  if (onay !== "SİL" && onay !== "SIL") {
    return json({ hata: 'Onay için "SİL" yazmalısın.' }, 400);
  }

  const silinen: Record<string, number | string> = {};

  try {
    // 3) FK'sız tablolar
    for (const t of EK_TABLOLAR) {
      try {
        const y = await fetch(
          SURL + `/rest/v1/${t}?user_id=eq.${uid}`,
          {
            method: "DELETE",
            headers: {
              apikey: SK, Authorization: "Bearer " + SK,
              Prefer: "return=minimal, count=exact",
            },
          }
        );
        const aralik = y.headers.get("content-range") || "";
        silinen[t] = aralik.includes("/") ? Number(aralik.split("/")[1]) || 0 : (y.ok ? "silindi" : "atlandı");
        if (!y.ok) silinen[t] = "atlandı (" + y.status + ")";
      } catch (_e) {
        silinen[t] = "atlandı";
      }
    }

    // 4) Hesabı sil → CASCADE ile kişisel veri tabloları temizlenir
    const s = await fetch(SURL + "/auth/v1/admin/users/" + uid, {
      method: "DELETE",
      headers: { apikey: SK, Authorization: "Bearer " + SK },
    });
    if (!s.ok) {
      const m = await s.text().catch(() => "");
      return json({ hata: "Hesap silinemedi (HTTP " + s.status + ")", ayrinti: m.slice(0, 200) }, 500);
    }
    silinen.hesap = "silindi";

    // 5) Silindiğini doğrula (kullanıcı gerçekten yok mu?)
    const k = await fetch(SURL + "/auth/v1/admin/users/" + uid, {
      headers: { apikey: SK, Authorization: "Bearer " + SK },
    });
    const kalan = await k.json().catch(() => ({}));
    const hesapKaldi = !!(kalan && kalan.id === uid);

    return json({
      tamam: !hesapKaldi,
      mesaj: hesapKaldi
        ? "Hesap hâlâ görünüyor — Supabase panelinden kontrol et."
        : "Hesabın ve tüm verilerin kalıcı olarak silindi.",
      silinen,
    });
  } catch (e) {
    return json({ hata: String(e) }, 500);
  }
});
