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

// ---- KRİPTO (kaynak: scripts/webpush-kripto.mjs) ----
// ---- BİLDİRİM METNİ (kaynak: bildirim-logic.js — GitHub Actions ile AYNI dosya) ----
// Elle düzenlemeyin: iki göndericinin aynı metni üretmesi için tek kaynaktan gömülür.
//__MANTIK__
//__KRIPTO__

const SURL = Deno.env.get("SUPABASE_URL")!;
const SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_OZEL = Deno.env.get("VAPID_PRIVATE_JWK") || "";
const VAPID_ACIK = Deno.env.get("VAPID_PUBLIC_KEY") || "";
const SECRET = Deno.env.get("BILDIRIM_SECRET") || "";
const KONU = Deno.env.get("VAPID_KONU") || "mailto:bildirim@analiz-merkezi.app";
// Tarayıcının abone olurken kullandığı AÇIK anahtar (site/push-bildirim.js).
// Gizli değildir; burada yalnız "sunucudaki sır aynı mı?" denetimi için durur.
// Farklıysa push servisi 403 döner ve HİÇBİR bildirim gitmez — bu, en sık
// görülen "izin var ama bildirim gelmiyor" nedenidir.
// v38 — site/push-bildirim.js ile BİREBİR aynı olmalı (teşhis bunu karşılaştırır)
const TARAYICI_VAPID_ACIK = "BNRjTCIDs_ML94GereBzsi08_jNu0qXDQt8GNZPepDplBaIvW3HJuq7GtYOy-lKkNnPPCdMm6YJSFzJIQR46aU8";

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
      title: testler.length + " konuda kısa kontrol hazır (5 soru)",
      body: ad + " · 5 soru, 3 dakikada biter",
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
  let s: any = Array.isArray(r) && r[0] ? r[0].state : null;
  // Eski kayıtlarda state metin (text) olabilir — sessizce patlamasın
  if (typeof s === "string") { try { s = JSON.parse(s); } catch { s = null; } }
  return s && typeof s === "object" ? s : null;
}

// Bildirime dokununca nereye gidilsin?
function hedefUrl(anahtar: string) {
  const k = String(anahtar || "");
  if (k.includes("schooleve@") || k.includes("schooltoday@")) return "./#sayfa=planning";
  if (k.includes(":reviews") || k.includes(":urgent") || k.includes(":memcrit") || k.includes(":forget")) return "./#sayfa=knowledge";
  if (k.includes(":coach") || k.includes(":daily")) return "./#sayfa=dashboard";
  if (k.includes(":exam@")) return "./#sayfa=planning";
  return "./";
}

// Bugün hangi anahtarlar gönderildi? (iki cihaz aynı bildirimi iki kez almasın)
async function gunlukAnahtarlar(userId: string, bugun: string): Promise<Set<string>> {
  const kume = new Set<string>();
  try {
    const y = await fetch(SURL + "/rest/v1/bildirim_log?select=anahtar&user_id=eq." + userId + "&gun=eq." + bugun, { headers: sbB() });
    const r = await y.json().catch(() => []);
    (Array.isArray(r) ? r : []).forEach((x: any) => { if (x && x.anahtar) kume.add(String(x.anahtar)); });
    // 3 günden eski kayıtları temizle (tablo şişmesin)
    const eski = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10);
    await fetch(SURL + "/rest/v1/bildirim_log?gun=lt." + eski, { method: "DELETE", headers: { ...sbB(), Prefer: "return=minimal" } }).catch(() => {});
  } catch (_) { /* tablo yoksa bildirim yine gider, tekilleştirme yapılmaz */ }
  return kume;
}

async function anahtarYaz(userId: string, anahtar: string, bugun: string) {
  await fetch(SURL + "/rest/v1/bildirim_log?on_conflict=user_id,anahtar", {
    method: "POST",
    headers: { ...sbB(), Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify([{ user_id: userId, anahtar, gun: bugun }])
  }).catch(() => {});
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

  // --- SAĞLIK: teşhis (sır sızdırmaz; yalnız var/yok ve eşleşme) ---
  // v38 — KÖK NEDEN ÖLÇÜMÜ: push servisi 201 dönerken telefonun bildirimi
  // sessizce düşürmesinin tek sebebi, imzada kullanılan anahtarın cihazdaki
  // aboneliğin "applicationServerKey"i ile AYNI OLMAMASIDIR. Bu yüzden özel
  // anahtardan TÜRETİLEN açık anahtar da raporlanır (açık anahtar sır değil).
  if (mod === "saglik") {
    let ozelGecerli = false, turetilen = "";
    try {
      const j = ozelJwk();
      ozelGecerli = !!(j && j.d && j.x && j.y);
      if (j && j.x && j.y) turetilen = b64url(birlestir(new Uint8Array([4]), b64urlCoz(j.x), b64urlCoz(j.y)));
    } catch { ozelGecerli = false; }
    return json({
      surum: "v37",
      vapid: {
        ozelAnahtarVar: !!VAPID_OZEL,
        ozelAnahtarCozuluyor: ozelGecerli,
        acikAnahtarVar: !!VAPID_ACIK,
        // Sır olarak yazılan açık anahtar, tarayıcıdakiyle aynı mı?
        tarayiciIleAyni: !!VAPID_ACIK && VAPID_ACIK.trim() === TARAYICI_VAPID_ACIK,
        // ASIL ÖLÇÜM: imzayı atan anahtar tarayıcıdakiyle aynı mı?
        turetilenAnahtar: turetilen,
        turetilenParmak: turetilen.slice(0, 24),
        tarayiciParmak: TARAYICI_VAPID_ACIK.slice(0, 24),
        imzaTarayiciIleAyni: !!turetilen && turetilen === TARAYICI_VAPID_ACIK
      },
      bildirimSecretVar: !!SECRET,
      supabaseAnahtariVar: !!SK
    });
  }

  if (!VAPID_OZEL || !VAPID_ACIK) return json({ hata: "VAPID anahtarları tanımlı değil" }, 500);

  try {
    // --- TEST: yalnız çağıranın kendi aboneliği ---
    if (mod === "test") {
      const yetki = istek.headers.get("Authorization") || "";
      if (!/^Bearer +/i.test(yetki)) return json({ hata: "oturum gerekli" }, 401);
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

    // --- TEKİL: x-bildirim-secret ile TEK kullanıcıya/cihaza test ---
    // Sağdaki teşhis "cihaza hiç ulaşmadı" dediğinde gerçek gönderimi
    // tek cihazda ölçmek için: push servisinin döndüğü kodu abonelik
    // abonelik raporlar (201 = servis kabul etti, 404/410 = abonelik ölü).
    if (mod === "tekil") {
      const gelen = istek.headers.get("x-bildirim-secret") || "";
      if (!SECRET || gelen !== SECRET) return json({ hata: "yetkisiz (x-bildirim-secret)" }, 401);
      const kime = String(g.user_id || "");
      const tekId = String(g.abonelik_id || "");
      const filtre = tekId
        ? "&id=eq." + encodeURIComponent(tekId)
        : (kime ? "&user_id=eq." + encodeURIComponent(kime) : "");
      if (!filtre) return json({ hata: "user_id veya abonelik_id gerekli" }, 400);
      const liste = await abonelikler(filtre);
      if (!liste.length) return json({ hata: "abonelik yok", filtre }, 404);
      const mesaj = {
        title: "Analiz Merkezi",
        body: String(g.mesaj || "Bildirim testi — bu mesajı görüyorsan kanal çalışıyor."),
        url: "./",
        kind: "test"
      };
      const sonuc: any[] = [];
      for (const a of liste) {
        const r = await gonder(a, mesaj);
        sonuc.push({ id: a.id, user_id: a.user_id, kod: r.kod, metin: r.metin });
        if (r.kod === 201) await isaretle(a.id, bugun);
        if (r.kod === 404 || r.kod === 410) await sil(a.id);
      }
      return json({ mod, gonderilen: sonuc.filter(x => x.kod === 201).length, sonuc });
    }

    // --- RUN: günlük toplu gönderim ---
    if (mod !== "run") return json({ hata: "geçersiz mod — test | run" }, 400);
    const gelen = istek.headers.get("x-bildirim-secret") || "";
    if (!SECRET || gelen !== SECRET) return json({ hata: "yetkisiz (x-bildirim-secret)" }, 401);

    // Sessiz saat: TR 06:00–22:00 dışında gönderme.
    // NOT: sabah vardiyası cron'u 04:35 UTC = 07:35 TR'de çalışır; eski alt sınır
    // (08) yüzünden SABAH BİLDİRİMİ HİÇ GİTMİYORDU. Sınır 06'ya çekildi.
    const trSaat = (new Date().getUTCHours() + 3) % 24;
    if (trSaat < 6 || trSaat >= 22) return json({ mod, atlandi: "sessiz saat", trSaat });

    // SABAH / AKŞAM: GitHub Actions sürümüyle AYNI kural.
    //   sabah (TR < 14) → günün TÜM bildirimleri
    //   akşam (TR ≥ 14) → yalnız kritikler (okul sınavı, sınav geri sayımı, hafıza kritik)
    const aksam = trSaat >= 14;
    const KRITIK = ["schooleve@", "schooltoday@", "exam@", ":memcrit"];
    // v36 — KULLANICI: "sadece tekrar günleri açılmalı".
    // Gönderim artık YALNIZ şu anahtarlarla sınırlı:
    //   • :reviews  → bugün tekrar günü gelen konular
    //   • :memcrit  → hafızası %20'nin altına düşen (acil tekrar) konular
    //   • :forget   → unutma indeksi yükselen konular
    //   • schooltoday@ / schooleve@ → okul sınavı günü/yarını (kaçırılması
    //     zararlı olduğu için korunuyor)
    // Kaldırılanlar: coach (selamlama), urgent (öncelik listesi), daily (özet),
    // exam@ geri sayım. Bunlar in-app bildirim olarak kalır.
    const TEKRAR_IZINLI = [":reviews", ":memcrit", ":forget", "schooltoday@", "schooleve@"];
    const tekrarMi = (k: string) => TEKRAR_IZINLI.some((p) => String(k || "").includes(p));
    const kritikMi = (k: string) => KRITIK.some((p) => String(k || "").includes(p));

    // TANILAMA: gömülü bildirim mantığı (bildirim-logic.js) gerçekten çalışıyor mu?
    // Sabit bir örnek durumla buildMessages koşar ve yalnız ANAHTARLARI döndürür.
    // Sır gerektirir, kişisel veri içermez. Beklenen: ["coach","exam@1","daily"].
    let kontrol: string[] = [];
    try {
      kontrol = buildMessages({
        user: { name: "Test" },
        plan: { rhythm: "Akşam", targetDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10) },
        exams: [], questions: [], memory: {}, bkt_state: {}
      }, new Date()).map((m: any) => String(m.key).split(":").pop());
    } catch (e) { kontrol = ["HATA: " + String(e).slice(0, 80)]; }

    const abonelikler_ = await abonelikler("");
    const durumlar = new Map<string, any>();
    const gonderilmis = new Map<string, Set<string>>();
    let gonderilen = 0;
    const hatalar: any[] = [];

    for (const a of abonelikler_) {
      if (!aboneGecerliMi(a)) { await sil(a.id); continue; }
      // TEK kullanıcının bozuk verisi TÜM listeyi durdurmasın
      try {
        if (!durumlar.has(a.user_id)) durumlar.set(a.user_id, await durumAl(a.user_id));
        if (!gonderilmis.has(a.user_id)) gonderilmis.set(a.user_id, await gunlukAnahtarlar(a.user_id, bugun));
        const st = durumlar.get(a.user_id);
        if (!st) continue;
        let mesajlar: any[] = [];
        try { mesajlar = buildMessages(st, new Date()); } catch (e) { continue; }
        const bugunKumesi = gonderilmis.get(a.user_id)!;
        let buAbone = 0;
        for (const m of mesajlar) {
          const anahtar = String((m && m.key) || "");
          if (!anahtar || bugunKumesi.has(anahtar)) continue;   // bugün zaten gitti
          if (aksam && !kritikMi(anahtar)) continue;            // akşam yalnız kritik
          if (!tekrarMi(anahtar)) continue;                      // v36: yalnız tekrar günleri
          const mesaj = {
            title: String(m.title || "Analiz Merkezi"),
            body: String(m.body || ""),
            url: hedefUrl(anahtar),
            kind: anahtar.split(":").pop()
          };
          const r = await gonder(a, mesaj);
          if (r.kod === 201) {
            gonderilen++; buAbone++;
            bugunKumesi.add(anahtar);
            await anahtarYaz(a.user_id, anahtar, bugun);
          } else if (r.kod === 404 || r.kod === 410) { await sil(a.id); break; }
          else hatalar.push({ id: a.id, anahtar, ...r });
        }
        // v38 — ESKİ HATA: `if (gonderilen)` GLOBAL sayaçtı; bir cihaza
        // gönderim başarılı olunca SONRAKİ TÜM abonelikler "gönderildi"
        // işaretleniyordu. Artık abonelik başına sayılıyor.
        if (buAbone) await isaretle(a.id, bugun);
      } catch (e) {
        hatalar.push({ id: a.id, hata: String(e).slice(0, 160) });
      }
    }
    return json({ mod, vardiya: aksam ? "aksam" : "sabah", kontrol, abonelik: abonelikler_.length, gonderilen, hatalar: hatalar.slice(0, 10), gun: bugun });
  } catch (e) {
    return json({ hata: String(e) }, 500);
  }
});
