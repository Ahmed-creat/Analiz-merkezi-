// Okulizyon il / ilçe / okul listeleri — Supabase Edge Function (Deno).
// KULLANICI: "Okulizyon bilgileri de sabit olmasın. Şehir, ilçe ve okullar
// Okulizyon'daki gibi seçilebilsin. Direkt oradaki listeleri kopyala yapıştır."
//
// Tarayıcı okulizyon.com'a doğrudan istek atamaz (CORS + oturum). Bu fonksiyon
// okulizyon.com'un KENDİ açılır listelerini okur ve uygulamaya verir:
//   • il    → GET /app2/ogrgiris/ sayfasındaki <select name="ilkodu">
//   • ilçe  → GET /ajax/ilceler.php?ilkodu=27     → [{ilceadi, ilcekodu}]
//   • okul  → GET /ajax/kurumlar.php?ilcekodu=…   → [{kurum, kurumkodu}]
//
// Aynı istekleri okulizyon-cek zaten kullanıyor (isim eşleştirmesi için).
// Burada amaç arayüze GERÇEK listeyi vermek; kod (ilkodu/ilcekodu/kurumkodu)
// da saklanır ki sonraki çekimlerde isim tahmini kalmasın.
//
// Önbellek: public.okulizyon_liste (tur, anahtar) — 7 gün. Okulizyon'u
// gereksiz yormamak için. ?zorla=1 ile tazelenir.
const TABAN = "https://okulizyon.com";
const GIRIS = TABAN + "/app2/ogrgiris/";
const UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/126 Mobile Safari/537.36";
const SURL = Deno.env.get("SUPABASE_URL") || "";
const SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const GUN = 7 * 24 * 3600 * 1000;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
};
function json(g: unknown, kod = 200) {
  return new Response(JSON.stringify(g), {
    status: kod,
    headers: { ...CORS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=3600" }
  });
}
const metin = (s: string) => String(s || "").replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'")
  .replace(/&quot;/g, '"').replace(/&Uuml;/g, "Ü").replace(/&uuml;/g, "ü")
  .replace(/&Ouml;/g, "Ö").replace(/&ouml;/g, "ö").replace(/&Ccedil;/g, "Ç")
  .replace(/&ccedil;/g, "ç").replace(/&Scedil;/g, "Ş").replace(/&scedil;/g, "ş")
  .replace(/&Gbreve;/g, "Ğ").replace(/&gbreve;/g, "ğ").replace(/&Idot;/g, "İ")
  .replace(/&inodot;/g, "ı").replace(/\s+/g, " ").trim();

async function http(url: string, ek: Record<string, string> = {}) {
  const h: Record<string, string> = {
    "User-Agent": UA,
    Accept: "text/html,application/json,*/*",
    "Accept-Language": "tr-TR,tr;q=0.9",
    ...ek
  };
  const y = await fetch(url, { headers: h, redirect: "follow" });
  return y;
}

// <select name="ilkodu"> … </select> → [{ad, kod}]
function secenekler(html: string, ad: string) {
  const ic = new RegExp('<select[^>]*name=["\']' + ad + '["\'][^>]*>([\\s\\S]*?)<\\/select>', "i").exec(html)?.[1] || "";
  const out: Array<{ ad: string; kod: string }> = [];
  const re = /<option[^>]*value=["']([^"']*)["'][^>]*>([\s\S]*?)<\/option>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(ic))) {
    const e = metin(m[2]);
    if (e && m[1] && m[1] !== "0") out.push({ ad: e, kod: String(m[1]) });
  }
  return out;
}

async function onbellekOku(tur: string, anahtar: string) {
  const y = await fetch(SURL + "/rest/v1/okulizyon_liste?select=veri,guncellendi&tur=eq." +
    encodeURIComponent(tur) + "&anahtar=eq." + encodeURIComponent(anahtar) + "&limit=1",
    { headers: { apikey: SK, Authorization: "Bearer " + SK } });
  if (!y.ok) return null;
  const j: any = await y.json().catch(() => null);
  const s = Array.isArray(j) ? j[0] : null;
  if (!s || !Array.isArray(s.veri) || !s.veri.length) return null;
  const t = Date.parse(s.guncellendi || "");
  if (!t || Date.now() - t > GUN) return null;
  return s.veri as Array<{ ad: string; kod: string }>;
}
async function onbellekYaz(tur: string, anahtar: string, veri: unknown) {
  await fetch(SURL + "/rest/v1/okulizyon_liste?on_conflict=tur,anahtar", {
    method: "POST",
    headers: {
      apikey: SK, Authorization: "Bearer " + SK,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify([{ tur, anahtar, veri, guncellendi: new Date().toISOString() }])
  }).catch(() => null);
}
function sirala(l: Array<{ ad: string; kod: string }>) {
  return l.slice().sort((a, b) => a.ad.localeCompare(b.ad, "tr"));
}

Deno.serve(async (istek) => {
  if (istek.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const u = new URL(istek.url);
    let mod = (u.searchParams.get("mod") || "").toLowerCase();
    let ilkodu = (u.searchParams.get("ilkodu") || "").trim();
    let ilcekodu = (u.searchParams.get("ilcekodu") || "").trim();
    if (istek.method === "POST") {
      const g: any = await istek.json().catch(() => ({}));
      mod = String(g.mod || mod).toLowerCase();
      ilkodu = String(g.ilkodu || ilkodu).trim();
      ilcekodu = String(g.ilcekodu || ilcekodu).trim();
    }
    const zorla = u.searchParams.get("zorla") === "1";
    if (!["il", "ilce", "okul"].includes(mod)) return json({ hata: "mod: il | ilce | okul" }, 400);
    if (mod === "ilce" && !ilkodu) return json({ hata: "ilkodu gerekli" }, 400);
    if (mod === "okul" && !ilcekodu) return json({ hata: "ilcekodu gerekli" }, 400);

    const anahtar = mod === "il" ? "81" : (mod === "ilce" ? ilkodu : ilcekodu);
    if (!zorla) {
      const c = await onbellekOku(mod, anahtar);
      if (c) return json({ ok: true, tur: mod, kaynak: "onbellek", liste: c });
    }

    let liste: Array<{ ad: string; kod: string }> = [];
    if (mod === "il") {
      const html = await (await http(GIRIS)).text();
      liste = secenekler(html, "ilkodu");
      if (!liste.length) {
        // Sayfa yapısı değişirse: Türkiye'nin 81 ili sabit listesi devreye girer
        liste = IL_LISTESI.map((ad, i) => ({ ad, kod: String(i + 1) }));
      }
    } else if (mod === "ilce") {
      const y = await http(TABAN + "/ajax/ilceler.php?ilkodu=" + encodeURIComponent(ilkodu), {
        "X-Requested-With": "XMLHttpRequest", Referer: GIRIS
      });
      const j: any = await y.json().catch(() => []);
      for (const s of (Array.isArray(j) ? j : [])) {
        if (s && s.ilceadi != null && s.ilcekodu != null) liste.push({ ad: metin(String(s.ilceadi)), kod: String(s.ilcekodu) });
      }
    } else {
      const y = await http(TABAN + "/ajax/kurumlar.php?ilcekodu=" + encodeURIComponent(ilcekodu), {
        "X-Requested-With": "XMLHttpRequest", Referer: GIRIS
      });
      const j: any = await y.json().catch(() => []);
      for (const s of (Array.isArray(j) ? j : [])) {
        const ad = s?.kurum ?? s?.kurumadi ?? s?.adi;
        const kod = s?.kurumkodu ?? s?.kodu;
        if (ad != null && kod != null) liste.push({ ad: metin(String(ad)), kod: String(kod) });
      }
    }
    liste = sirala(liste.filter((x) => x.ad && x.kod));
    if (!liste.length) return json({ ok: false, tur: mod, liste: [], hata: "liste boş döndü" }, 200);
    await onbellekYaz(mod, anahtar, liste);
    return json({ ok: true, tur: mod, kaynak: "okulizyon", adet: liste.length, liste });
  } catch (e) {
    return json({ ok: false, hata: String(e).slice(0, 200) }, 500);
  }
});

// Yalnız son çare: okulizyon.com'a ulaşılamazsa il listesi boş kalmasın.
const IL_LISTESI = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya",
  "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik",
  "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum",
  "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir",
  "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul",
  "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale",
  "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa",
  "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye",
  "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak",
  "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
];
