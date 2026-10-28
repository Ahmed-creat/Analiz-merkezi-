// Okulizyon çekici — Supabase Edge Function (Deno).
// Akış okulizyon.com'un kendi JS'inden (orbimogrgiris.js) doğrulandı:
//  POST /ajax/ogrencigirisarama.php {giristuru,adsoyad,ogrno,sinif,ilkodu,ilcekodu,kurumkodu}
//    → {tamam,ogrid,sifrevar,yksid,...} | {tamam:false,mesaj}
//  ogrid>0 & sifrevar → POST /ajax/ogrencigiris.php (şifre) ; ogrid=0 & yksid/lgsid>0 → oturum açık
//  GET /app2/ogrenci/?pg=sinavsonuclari → sonuç HTML'i
// Yazma: public.okulizyon_kuyrugu (user_id, exams, pulled_at, durum, durum_mesaji, ham_ozet)
const TABAN = "https://okulizyon.com";
const GIRIS = TABAN + "/app2/ogrgiris/";
const ARAMA = [TABAN + "/ajax/ogrencigirisarama.php", TABAN + "/app2/ajax/ogrencigirisarama.php"];
const SONUC = TABAN + "/app2/ogrenci/?pg=sinavsonuclari";
const UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/126 Mobile Safari/537.36";
const SURL = Deno.env.get("SUPABASE_URL")!;
const SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

class Kavanoz {
  m = new Map<string, string>();
  al(y: Response) {
    const l: string[] = typeof (y.headers as any).getSetCookie === "function"
      ? (y.headers as any).getSetCookie() : [y.headers.get("set-cookie") || ""].filter(Boolean);
    for (const s of l) { if (!s) continue; const c = s.split(";")[0], i = c.indexOf("="); if (i > 0) this.m.set(c.slice(0, i).trim(), c.slice(i + 1).trim()); }
  }
  baslik() { return [...this.m].map(([k, v]) => k + "=" + v).join("; "); }
}
async function http(k: Kavanoz, url: string, opt: RequestInit = {}) {
  const h = new Headers(opt.headers || {});
  h.set("User-Agent", UA);
  if (!h.has("Accept")) h.set("Accept", "application/json, text/html, */*");
  if (k.baslik()) h.set("Cookie", k.baslik());
  const y = await fetch(url, { ...opt, headers: h, redirect: "follow" });
  k.al(y);
  return y;
}
const form = (o: Record<string, string>) => { const p = new URLSearchParams(); for (const [a, b] of Object.entries(o)) p.append(a, String(b ?? "")); return p.toString(); };
const metin = (s: string) => String(s || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const kucuk = (s: string) => metin(s).toLocaleLowerCase("tr-TR");
const sayi = (s: string) => { const n = parseInt(String(s).replace(/[^\d-]/g, ""), 10); return isNaN(n) ? 0 : n; };

// Türkçe karakter farkı gözetmeyen normalizasyon ("Şahinbey" = "SAHINBEY", ama "AKKEN" ≠ "AKKENT")
function norm(x: string) {
  return String(x || "").toLocaleUpperCase("tr-TR")
    .replace(/İ/g, "I").replace(/Ş/g, "S").replace(/Ğ/g, "G").replace(/Ç/g, "C").replace(/Ö/g, "O").replace(/Ü/g, "U")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
}
const OKUL_TAKMA: Array<[RegExp, string]> = [[/\bAKKEN\b/g, "AKKENT"]]; // uygulamadaki eski yazım
function esle(t: Record<string, string>, ara?: string) {
  if (!ara) return null;
  let h = norm(ara);
  for (const [re, d] of OKUL_TAKMA) h = h.replace(re, d);
  const ks = Object.keys(t);
  const tam = ks.find((k) => norm(k) === h);
  if (tam) return t[tam];
  const ic = ks.find((k) => { const n = norm(k); return n.includes(h) || h.includes(n); });
  if (ic) return t[ic];
  const kel = h.split(" ").filter((w) => w.length > 2);
  const ke = ks.find((k) => { const n = norm(k); return kel.length > 0 && kel.every((w) => n.includes(w)); });
  return ke ? t[ke] : null;
}

function secenekler(html: string, ad: string) {
  const ic = new RegExp('<select[^>]*name=["\']' + ad + '["\'][^>]*>([\\s\\S]*?)<\\/select>', "i").exec(html)?.[1] || "";
  const cikti: Record<string, string> = {};
  const re = /<option[^>]*value=["']([^"']*)["'][^>]*>([\s\S]*?)<\/option>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(ic))) { const e = metin(m[2]); if (e && m[1]) cikti[e] = m[1]; }
  return cikti;
}
function baglantilar(html: string) {
  const out: { ad: string; href: string; tarih: string }[] = [], gor = new Set<string>();
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const href = /href=["']([^"']+)["']/i.exec(m[1])?.[1] || "";
    if (!href || /^javascript:/i.test(href) || href === "#") continue;
    const kendi = metin(m[2]);
    // Link metni sınav adı olmalı; "Profilim" gibi komşu metinler sınav sanılmasın
    const kk = kucuk(kendi);
    const jenerik = kk.length < 4 || /^(sonuç|sonuc|sonuçlar|sonuclar|detay|detaylar|görüntüle|goruntule|incele|gör|gor|git|buraya|tıkla|tikla|aç|ac)\b/.test(kk);
    let ad = "";
    if (!jenerik) {
      if (!/(deneme|sinav|sınav|yazili|yazılı|sonuc|sonuç)/i.test(kk)) continue;
      ad = kendi;
    } else {
      const cevreMetin = metin(html.slice(Math.max(0, m.index - 300), m.index + 300));
      if (!/(deneme|sinav|sınav|yazili|yazılı|sonuc|sonuç)/i.test(kucuk(cevreMetin))) continue;
      ad = (kendi + " " + cevreMetin).slice(0, 120);
    }
    ad = ad.slice(0, 200);
    const cevre = html.slice(Math.max(0, m.index - 500), m.index);
    if (ad.length < 3 || gor.has(href + "|" + ad)) continue;
    gor.add(href + "|" + ad);
    // Tarih genelde sınav adından SONRA gelir; önce sağına, sonra soluna bak
    const sagMetin = metin(html.slice(m.index, Math.min(html.length, m.index + 400)));
    const t = /(\d{2})[.\/](\d{2})[.\/](\d{4})/.exec(sagMetin) || /(\d{2})[.\/](\d{2})[.\/](\d{4})/.exec(cevre);
    out.push({ ad, href: href.startsWith("http") ? href : new URL(href, TABAN).href, tarih: t ? t[3] + "-" + t[2] + "-" + t[1] : "" });
  }
  return out;
}
function tablolar(html: string) {
  const out: string[][][] = [];
  const tre = /<table\b[^>]*>([\s\S]*?)<\/table>/gi;
  let t: RegExpExecArray | null;
  while ((t = tre.exec(html))) {
    const sat: string[][] = [], rre = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
    let r: RegExpExecArray | null;
    while ((r = rre.exec(t[1]))) {
      const hucre: string[] = [], cre = /<(td|th)\b[^>]*>([\s\S]*?)<\/\1>/gi;
      let c: RegExpExecArray | null;
      while ((c = cre.exec(r[1]))) hucre.push(metin(c[2]));
      if (hucre.length) sat.push(hucre);
    }
    if (sat.length) out.push(sat);
  }
  return out;
}
function ayikla(html: string, ad: string, tarih: string) {
  const lessons: Record<string, { d: number; w: number; e: number }> = {}, rows: any[] = [];
  for (const sat of tablolar(html)) {
    const bas = sat[0].map(kucuk);
    const bul = (ks: string[]) => bas.findIndex((h) => ks.some((k) => h.includes(k)));
    const ders = bul(["ders"]);
    const konu = bul(["konu", "kazan"]), durumK = bul(["durum"]);
    // 1) DETAY tablosu: Soru | Ders | Konu/Kazanım | Durum  (Doğru/Yanlış sütunu YOKTUR)
    if (konu >= 0 && durumK >= 0) {
      for (const s of sat.slice(1)) {
        const k = s[konu] || ""; if (!k) continue;
        const dr = kucuk(s[durumK] || "");
        const kod = /yanlış|yanlis|hatal/.test(dr) ? "w" : (/boş|bos/.test(dr) ? "e" : "");
        if (kod) rows.push({ qno: s[0] || "", lesson: (ders >= 0 ? s[ders] : "") || "Genel", topic: k, status: kod });
      }
      continue;
    }
    // 2) ÖZET tablosu: Ders | Doğru | Yanlış | Boş
    const dogru = bul(["doğru", "dogru"]), yanlis = bul(["yanlış", "yanlis"]);
    const bos = bas.findIndex((h) => h === "boş" || h === "bos");
    if (ders < 0 || dogru < 0 || yanlis < 0 || Object.keys(lessons).length > 0) continue;
    for (const s of sat.slice(1)) {
      const d = s[ders] || ""; if (!d || /toplam|genel/i.test(d)) continue;
      lessons[d] = { d: sayi(s[dogru]), w: sayi(s[yanlis]), e: bos >= 0 ? sayi(s[bos]) : 0 };
    }
  }
  return { name: ad, date: tarih, lessons, rows };
}

async function giris(kimlik: any, k: Kavanoz): Promise<any> {
  let html = "";
  try { html = await (await http(k, GIRIS)).text(); } catch (e) { return { durum: "hata", mesaj: "Giriş sayfası: " + String(e) }; }
  const ilkodu = esle(secenekler(html, "ilkodu"), kimlik.il || "Gaziantep") || "27";
  let ilcekodu = "", kurumkodu = "";
  try {
    const j: any = await (await http(k, TABAN + "/ajax/ilceler.php?ilkodu=" + ilkodu, { headers: { "X-Requested-With": "XMLHttpRequest", Referer: GIRIS } })).json();
    const t: Record<string, string> = {};
    for (const s of (Array.isArray(j) ? j : [])) if (s?.ilceadi != null) t[String(s.ilceadi)] = String(s.ilcekodu);
    ilcekodu = esle(t, kimlik.ilce) || "";
  } catch (_) { /**/ }
  if (ilcekodu) {
    try {
      const j: any = await (await http(k, TABAN + "/ajax/kurumlar.php?ilcekodu=" + ilcekodu, { headers: { "X-Requested-With": "XMLHttpRequest", Referer: GIRIS } })).json();
      const t: Record<string, string> = {};
      for (const s of (Array.isArray(j) ? j : [])) { const a = s?.kurum ?? s?.kurumadi ?? s?.adi; const c = s?.kurumkodu ?? s?.kodu; if (a != null && c != null) t[String(a)] = String(c); }
      kurumkodu = esle(t, kimlik.okulAdi) || ""; // eşleşmezse BOŞ: yanlış okula giriş yapmaktansa dur
    } catch (_) { /**/ }
  }
  const kodlar = { ilkodu, ilcekodu, kurumkodu };
  if (!ilcekodu) return { durum: "eslesme-yok", mesaj: "İlçe Okulizyon listesinde bulunamadı: " + (kimlik.ilce || "-"), kodlar };
  if (!kurumkodu) return { durum: "eslesme-yok", mesaj: "Okul Okulizyon listesinde bulunamadı: " + (kimlik.okulAdi || "-") + " (ilçe: " + (kimlik.ilce || "-") + ")", kodlar };
  const govde = { giristuru: "1", adsoyad: String(kimlik.ad || "").toLocaleUpperCase("tr-TR").trim(), ogrno: String(kimlik.okulNo || "").trim(), sinif: String(kimlik.sinif || "").replace(/\D/g, "") || "10", ilkodu, ilcekodu, kurumkodu };
  let ham: any = null, sonHata = "";
  for (const uc of ARAMA) {
    try {
      const y = await http(k, uc, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest", Referer: GIRIS, Origin: TABAN }, body: form(govde) });
      const t = await y.text();
      try { ham = JSON.parse(t); } catch { ham = { hamMetin: t.slice(0, 300), http: y.status }; }
      if (y.ok) break; sonHata = "HTTP " + y.status;
    } catch (e) { sonHata = String(e); }
  }
  if (!ham) return { durum: "hata", mesaj: "Giriş ucu yanıt vermedi: " + sonHata, kodlar };
  if (!ham.tamam) return { durum: "red", mesaj: String(ham.mesaj || "Giriş reddedildi"), ham, kodlar };
  const ogrid = Number(ham.ogrid || 0);
  if (ogrid > 0 && !ham.sifrevar) return { durum: "oturum", ogrid, ham, kodlar };
  if (ogrid > 0 && ham.sifrevar) {
    if (!kimlik.sifre) return { durum: "sifre-gerekli", ogrid, ham, kodlar };
    try {
      const y = await http(k, TABAN + "/ajax/ogrencigiris.php", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest", Referer: GIRIS, Origin: TABAN }, body: form({ ...govde, ogrid: String(ogrid), sifre: String(kimlik.sifre) }) });
      const c: any = await y.json().catch(() => ({}));
      return c?.tamam ? { durum: "oturum", ogrid, ham: c, kodlar } : { durum: "red", mesaj: String(c?.mesaj || "Şifre reddedildi"), ham: c, kodlar };
    } catch (e) { return { durum: "hata", mesaj: "Şifreli giriş: " + String(e), ham, kodlar }; }
  }
  if (Number(ham.yksid || 0) > 0 || Number(ham.lgsid || 0) > 0 || Number(ham.kdsid || 0) > 0) return { durum: "oturum", ogrid: 0, ham, kodlar };
  return { durum: "red", mesaj: "Kayıt bulundu ama oturum açılamadı", ham, kodlar };
}

const sb = (yol: string) => SURL + "/rest/v1/" + yol;
const sbB = (ek: Record<string, string> = {}) => ({ apikey: SK, Authorization: "Bearer " + SK, "Content-Type": "application/json", ...ek });
async function yaz(userId: string, alanlar: Record<string, unknown>) {
  const y = await fetch(sb("okulizyon_kuyrugu?on_conflict=user_id"), { method: "POST", headers: sbB({ Prefer: "resolution=merge-duplicates,return=minimal" }), body: JSON.stringify([{ user_id: userId, pulled_at: new Date().toISOString(), ...alanlar }]) });
  return { ok: y.ok, kod: y.status, metin: y.ok ? "" : (await y.text()).slice(0, 200) };
}
function kimlikOku(s: any) {
  try {
    const st = typeof s.state === "string" ? JSON.parse(s.state) : s.state, o = st?.settings?.okulizyon;
    if (!o?.ad || !o?.okulNo) return null;
    return { ad: o.ad, okulNo: o.okulNo, sinif: o.sinif, il: o.il, ilce: o.ilce, okulAdi: o.okulAdi, sifre: o.sifre };
  } catch { return null; }
}

async function kullaniciCek(userId: string, stateJson: any): Promise<any> {
  const kim = kimlikOku({ state: stateJson });
  if (!kim) {
    await yaz(userId, { durum: "bilgi-yok", durum_mesaji: "Profil → Okulizyon bölümünde ad soyad ve okul no kayıtlı değil." });
    return { durum: "bilgi-yok" };
  }
  try {
    const k = new Kavanoz(), r: any = await giris(kim, k);
    if (r.durum !== "oturum") {
      const msj = r.durum === "sifre-gerekli"
        ? "Okulizyon bu kayıt için şifre istiyor — Profil → Okulizyon bölümüne şifreni yaz ve kaydet."
        : (r.mesaj || "Giriş yapılamadı");
      await yaz(userId, { durum: r.durum, durum_mesaji: msj.slice(0, 400) });
      return { durum: r.durum, mesaj: msj, kodlar: r.kodlar, ham: r.ham };
    }
    const sy = await http(k, SONUC, { headers: { Referer: TABAN + "/app2/ogrenci/" } });
    const html = await sy.text(), bs = baglantilar(html);
    const exams: any[] = [];
    if (!bs.length) exams.push(ayikla(html, "Okulizyon Sonucu", ""));
    else for (const b of bs.slice(0, 15)) {
      try { exams.push(ayikla(await (await http(k, b.href, { headers: { Referer: SONUC } })).text(), b.ad, b.tarih)); } catch (_) { /**/ }
    }
    const dolu = exams.filter((e) => Object.keys(e.lessons || {}).length || (e.rows || []).length);
    const satir = dolu.reduce((a, e) => a + (e.rows || []).length, 0);
    await yaz(userId, {
      exams: dolu, durum: dolu.length ? "ok" : "sonuc-yok",
      durum_mesaji: dolu.length
        ? dolu.length + " sınav, " + satir + " hata satırı aktarıldı."
        : "Giriş başarılı ama sonuç tablosu okunamadı (" + bs.length + " bağlantı, HTML " + html.length + " bayt).",
      ham_ozet: metin(html).slice(0, 1500)
    });
    return { durum: dolu.length ? "ok" : "sonuc-yok", sinav: dolu.length, satir, kodlar: r.kodlar };
  } catch (e) {
    await yaz(userId, { durum: "hata", durum_mesaji: String(e).slice(0, 400) });
    return { durum: "hata", mesaj: String(e) };
  }
}

Deno.serve(async (istek) => {
  const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "POST, GET, OPTIONS" };
  if (istek.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (v: unknown, k = 200) => new Response(JSON.stringify(v, null, 2), { status: k, headers: { ...cors, "Content-Type": "application/json" } });
  let g: any = {}; try { g = await istek.json(); } catch { g = {}; }
  const mod = String(g.mod || "run"), t0 = Date.now();
  try {
    if (mod === "probe") {
      const k = new Kavanoz(), y = await http(k, GIRIS), html = await y.text();
      const iller = secenekler(html, "ilkodu"), gz = esle(iller, "Gaziantep");
      let ilceler: unknown = null, kurumlar: unknown = null;
      try {
        const j: any = await (await http(k, TABAN + "/ajax/ilceler.php?ilkodu=" + (gz || 27))).json();
        ilceler = Array.isArray(j) ? j.slice(0, 3) : j;
        if (Array.isArray(j) && j[0]?.ilcekodu) { const j2: any = await (await http(k, TABAN + "/ajax/kurumlar.php?ilcekodu=" + j[0].ilcekodu)).json(); kurumlar = Array.isArray(j2) ? j2.slice(0, 3) : j2; }
      } catch (e) { ilceler = String(e); }
      return json({ mod, sayfaKod: y.status, sayfaBoyut: html.length, ilSayisi: Object.keys(iller).length, gaziantepKodu: gz, ilceler, kurumlar, sureMs: Date.now() - t0 });
    }
    if (mod === "parse") {
      // Yayındaki ayrıştırıcıyı verilen HTML ile sına (canlı doğrulama)
      const html = String(g.html || "");
      const bag = baglantilar(html);
      return json({ mod, uzunluk: html.length, sinav: ayikla(html, String(g.ad || "Test Sinavi"), String(g.tarih || "")), baglanti: bag, sureMs: Date.now() - t0 });
    }
    if (mod === "test") {
      const kim = g.kimlik;
      if (!kim?.ad || !kim?.okulNo) return json({ hata: "kimlik gerekli" }, 400);
      const k = new Kavanoz(), r: any = await giris(kim, k);
      if (r.durum !== "oturum") return json({ mod, giris: r, sureMs: Date.now() - t0 });
      const y = await http(k, SONUC, { headers: { Referer: TABAN + "/app2/ogrenci/" } }), html = await y.text(), bs = baglantilar(html);
      return json({ mod, giris: { durum: r.durum, ogrid: r.ogrid, kodlar: r.kodlar }, sonucKod: y.status, boyut: html.length, baglanti: bs.slice(0, 5), baglantiSayisi: bs.length, metin: metin(html).slice(0, 900), sureMs: Date.now() - t0 });
    }
    if (mod === "ben") {
      // Tarayıcıdaki "Şimdi dene" düğmesi: JWT sahibinin kaydını çek
      const yetki = istek.headers.get("Authorization") || "";
      if (!/^Bearer\s+/i.test(yetki)) return json({ hata: "oturum gerekli" }, 401);
      const uy = await fetch(SURL + "/auth/v1/user", { headers: { apikey: SK, Authorization: yetki } });
      const u: any = await uy.json().catch(() => ({}));
      if (!u?.id) return json({ hata: "oturum doğrulanamadı" }, 401);
      const sy = await fetch(sb("app_states?select=user_id,state&user_id=eq." + u.id), { headers: sbB() });
      const tek: any[] = await sy.json().catch(() => []);
      const o = await kullaniciCek(u.id, tek[0]?.state);
      return json({ mod, ...o, sureMs: Date.now() - t0 });
    }
    const y = await fetch(sb("app_states?select=user_id,state"), { headers: sbB() });
    if (!y.ok) return json({ hata: "app_states HTTP " + y.status }, 500);
    const liste: any[] = await y.json().catch(() => []);
    const ozet: any[] = [];
    for (const s of liste) ozet.push({ user: s.user_id, ...(await kullaniciCek(s.user_id, s.state)) });
    return json({ mod, kullanici: liste.length, ozet, sureMs: Date.now() - t0 });
  } catch (e) { return json({ hata: String(e) }, 500); }
});
