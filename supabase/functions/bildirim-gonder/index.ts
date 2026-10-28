// ⚠ ÜRETİLMİŞ DOSYA — elle düzenlemeyin.
// Kaynak: supabase/functions/bildirim-gonder/sablon.ts + scripts/webpush-kripto.mjs + bildirim-logic.js
// Derle: node scripts/bildirim-derle.js

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
const REASON_WEIGHTS = {
  "Konuyu Bilmiyordum": 1.5,
  "KONUEKSİKLİĞİ": 1.5,
  "ANLAMADIM": 0.5,
  "İşlem Hatası/Dikkatsizlik": 0.5,
  "Kodlama/Kitapçık Hatası": 0.1,
  "SÜREYETMEDİ": 0.3,
  "ÇÖZÜMYOLUNUBULAMADIM": 0.8
};
const MEMORY_BASE_DECAY = 0.16;
const MEMORY_DECAY_SLOWDOWN = 0.90;
const MEMORY_DECAY_FLOOR = 0.03;
const MEMORY_CRITICAL = 20;
const AYT_WEIGHT = {
  "Türk Dili ve Edebiyatı": 0.18, "Matematik": 0.30, "Fizik": 0.105, "Kimya": 0.0975,
  "Biyoloji": 0.0975, "Tarih": 0.15, "Coğrafya": 0.13, "Din Kültürü": 0.05
};
const RHYTHMS = [
  { key: "Sabah", coach: "Günaydın" },
  { key: "Öğle", coach: "İyi günler" },
  { key: "Akşam", coach: "İyi akşamlar" }
];
function parseDay(str) {
  if (!str || typeof str !== "string" || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(str)) return null;
  const d = new Date(str.slice(0, 10) + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}
function bugunStr(simdi) {
  const d = simdi || new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function gunFarki(tarihStr, bugun) {
  const a = parseDay(tarihStr), b = parseDay(bugun);
  if (!a || !b) return null;
  return Math.round((a - b) / 86400000);
}
function daysSince(iso, simdi) {
  if (!iso) return 0;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 0;
  return Math.max(0, Math.floor(((simdi || new Date()) - d) / 86400000));
}
function splitKey(key) {
  const i = key.indexOf(" > ");
  return i < 0 ? { lesson: key, topic: key } : { lesson: key.slice(0, i), topic: key.slice(i + 3) };
}
function aytWeightOf(lesson) { return AYT_WEIGHT[lesson] || 0; }
function memoryDecayRate(mem) {
  const n = (mem && mem.reviewCount) || 0;
  return Math.max(MEMORY_DECAY_FLOOR, MEMORY_BASE_DECAY * Math.pow(MEMORY_DECAY_SLOWDOWN, n));
}
function getMemoryStrength(key, state, simdi) {
  const mem = state.memory[key];
  if (!mem || !mem.lastReview) return 0;
  const d = daysSince(mem.lastReview, simdi);
  return Math.max(0, Math.min(100, Math.round(100 * Math.exp(-memoryDecayRate(mem) * d))));
}
function dueReviewsList(state, bugun) {
  const t = parseDay(bugun);
  const list = [];
  Object.keys(state.memory || {}).forEach(key => {
    const mem = state.memory[key];
    if (!mem || !mem.schedule) return;
    Object.entries(mem.schedule).forEach(([day, date]) => {
      const dt = parseDay(date);
      if (dt && dt <= t) list.push({ topicKey: key, day: Number(day) });
    });
  });
  return list;
}
function topicLearnedAfter(key, logDate, state) {
  const mem = state.memory[key];
  if (!mem || !mem.completedAt) return false;
  const done = parseDay(mem.completedAt.split("T")[0]);
  const ld = logDate ? parseDay(logDate) : null;
  return !ld ? true : ld < done;
}
function canonicalReason(value) {
  const r = String(value || "").trim();
  return ({ "KONU EKSİKLİĞİ": "KONUEKSİKLİĞİ", "SÜRE YETMEDİ": "SÜREYETMEDİ", "ÇÖZÜM YOLUNU BULAMADIM": "ÇÖZÜMYOLUNUBULAMADIM" })[r] || r;
}
function collectErrorStats(state) {
  const stats = {};
  const push = (log, source) => {
    if (!log || !log.topic || !log.lesson) return;
    const key = log.lesson + " > " + log.topic;
    if (topicLearnedAfter(key, log.date, state)) return;
    if (!stats[key]) stats[key] = { lesson: log.lesson, topic: log.topic, count: 0, denemeBilgi: 0, testBilgi: 0, islem: 0, anlamadim: 0, reasons: {} };
    const row = stats[key]; const reason = canonicalReason(log.type || log.reason); row.count++; row.reasons[reason] = (row.reasons[reason] || 0) + 1;
    if (reason === "Konuyu Bilmiyordum" || reason === "KONUEKSİKLİĞİ") source === "deneme" ? row.denemeBilgi++ : row.testBilgi++;
    if (reason === "İşlem Hatası/Dikkatsizlik") row.islem++;
    if (reason === "ANLAMADIM") row.anlamadim++;
  };
  (state.exams || []).forEach(ex => (ex.errorLogs || []).forEach(l => push(l, "deneme")));
  (state.questions || []).forEach(q => (q.errorLogs || []).forEach(l => push(l, "test")));
  return stats;
}
function calculatePriority(state, aytOverride) {
  const stats = collectErrorStats(state);
  return Object.entries(stats).map(([key, s]) => {
    const configuredAyt = state && state.settings && Number.isFinite(Number(state.settings.aytWeight)) ? Number(state.settings.aytWeight) : aytOverride;
    const factor = configuredAyt == null ? aytWeightOf(s.lesson) : configuredAyt;
    const score = (1.5 * s.denemeBilgi + 1.0 * s.testBilgi + 0.5 * (s.islem + s.anlamadim)) * (1 + factor);
    const override = state.bkt_state && state.bkt_state[key] && state.bkt_state[key].kok_neden_oncelik;
    const effective = override ? Math.max(score, Number(override.etkin) || 0) : score;
    return [key, Math.round(effective * 100) / 100];
  }).filter(r => r[1] > 0).sort((a, b) => b[1] - a[1]);
}
function topicSuccessRate(topicKey, state) {
  const p = splitKey(topicKey);
  let d = 0, total = 0;
  (state.exams || []).forEach(ex => {
    const l = ex.lessons && ex.lessons[p.lesson];
    if (l) { d += Number(l.d) || 0; total += (Number(l.d) || 0) + (Number(l.w) || 0) + (Number(l.e) || 0); }
  });
  (state.questions || []).forEach(q => {
    const hit = (q.errorLogs || []).some(e => e.topic === p.topic && e.lesson === p.lesson);
    if (q.lesson === p.lesson || hit) {
      d += Number(q.d) || 0; total += (Number(q.d) || 0) + (Number(q.w) || 0) + (Number(q.e) || 0);
    }
  });
  return total > 0 ? Math.round((d / total) * 100) : null;
}
function forgettingIndexList(state, simdi) {
  const list = [];
  Object.keys(state.memory || {}).forEach(key => {
    const mem = state.memory[key];
    if (!mem || !mem.completedAt) return;
    const rate = topicSuccessRate(key, state);
    const idle = mem.lastReview ? daysSince(mem.lastReview, simdi) : daysSince(mem.completedAt, simdi);
    if (rate !== null && rate > 80 && idle >= 20) list.push({ key, idle, rate });
  });
  return list;
}
function kirp(s, n) { return s.length > n ? s.slice(0, n - 1) + "…" : s; }
function listeMetni(items, max) {
  if (items.length <= max) return items.join(", ");
  return items.slice(0, max).join(", ") + "… ve " + (items.length - max) + " konu daha";
}
function buildMessages(state, simdi, secenekler) {
  const o = Object.assign({ koç: true }, secenekler || {});
  const bugun = bugunStr(simdi);
  const now = simdi || new Date();
  const out = [];
  const plan = state.plan || {};
  if (o.koç) {
    const rhythm = RHYTHMS.find(r => r.key === plan.rhythm) || RHYTHMS[0];
    let dl = null;
    if (plan.targetDate) {
      const f = gunFarki(plan.targetDate, bugun);
      if (f !== null && f >= 0) dl = f;
    }
    out.push({
      title: rhythm.coach + (state.user && state.user.name ? ", " + state.user.name : "") + "!",
      body: dl !== null ? "Sınava " + dl + " gün kaldı. Hazırsan bugünün öncelikli görevine başlayalım!" : "Bugünün öncelikli görevine hazırsan başlayalım!",
      key: "coach"
    });
  }
  const due = dueReviewsList(state, bugun);
  if (due.length) {
    const gorunen = due.slice(0, 5).map(r => kirp(splitKey(r.topicKey).topic, 24) + " (" + r.day + ". gün)");
    out.push({
      title: "Tekrar Zamanı Geldi!",
      body: due.length + " konunun tekrarı bugün: " + listeMetni(gorunen, 5) + ". Her biri 10 dakikalık müdahale yeter.",
      key: "reviews"
    });
  }
  const pr = calculatePriority(state);
  if (pr.length) {
    const gorunen = pr.slice(0, 5).map(r => kirp(splitKey(r[0]).topic, 24));
    out.push({
      title: "ACİL Çalışılacaklar (" + pr.length + " konu)",
      body: "Öncelik sıran: " + listeMetni(gorunen, 5) + ". En üsttekini bugün bitir.",
      key: "urgent"
    });
  }
  const kritik = Object.keys(state.memory || {})
    .filter(k => state.memory[k].completedAt)
    .map(k => ({ key: k, pct: getMemoryStrength(k, state, now) }))
    .filter(r => r.pct < MEMORY_CRITICAL)
    .sort((a, b) => a.pct - b.pct);
  if (kritik.length) {
    const gorunen = kritik.slice(0, 5).map(r => kirp(splitKey(r.key).topic, 22) + " %" + r.pct);
    out.push({
      title: kritik.length === 1 ? "ACİL: " + kirp(splitKey(kritik[0].key).topic, 26) + " unutulmak üzere!" : "ACİL: " + kritik.length + " konu unutulmak üzere!",
      body: "Hafıza gücü düştü: " + listeMetni(gorunen, 5) + ". 10 dakikalık acil tekrar yap!",
      key: "memcrit"
    });
  }
  const unutma = forgettingIndexList(state, now);
  if (unutma.length) {
    const gorunen = unutma.slice(0, 4).map(f => kirp(splitKey(f.key).topic, 22) + " (" + f.idle + " gün)");
    out.push({
      title: "Unutma İndeksi Yükseldi",
      body: "Başarılıydın ama dokunmuyorsun: " + listeMetni(gorunen, 4) + ". Bugün tekrar et.",
      key: "forget"
    });
  }
  (plan.schoolExams || []).forEach(se => {
    if (!se || !se.date) return;
    const f = gunFarki(se.date, bugun);
    const konuSay = (se.topics || []).length;
    if (f === 1) {
      out.push({
        title: "Yarın " + se.lesson + " Sınavın!",
        body: "Sınav yarın" + (se.time ? ", saat " + se.time : "") + ". Bu akşam şurada çalış: " + konuSay + " seçili konu.",
        key: "schooleve@" + se.id
      });
    }
    if (f === 0) {
      out.push({
        title: "BUGÜN " + se.lesson + " Sınavı",
        body: "Sınav bugün" + (se.time ? ", saat " + se.time : "") + ". Bol şans!",
        key: "schooltoday@" + se.id
      });
    }
  });
  if (plan.targetDate) {
    const dl = gunFarki(plan.targetDate, bugun);
    if (dl === 7) out.push({ title: "Sınava 1 Hafta!", body: "Bu hafta genel tekrar haftası: eksik konuları kapat, yeni konu açma.", key: "exam@7" });
    if (dl === 3) out.push({ title: "Sınava Hazırlık: Eksik kapatma günü", body: "Sınav kapsamından en zayıf konularını seçip sadece eksik noktalara odaklan.", key: "exam@3" });
    if (dl === 1) out.push({ title: "YARIN SINAV!", body: "Bugün sadece formül hatırlama + yanlış soru defteri. Erken uyu, iyi şanslar!", key: "exam@1" });
  }
  const olaylar = [];
  if (due.length > 0) olaylar.push(due.length + " konu tekrarı");
  if (plan.targetDate === bugun) olaylar.push("DENEME SINAVI" + (plan.examTime ? " (" + plan.examTime + ")" : ""));
  (plan.schoolExams || []).forEach(se => { if (se && se.date === bugun) olaylar.push(se.lesson + " sınavı" + (se.time ? " (" + se.time + ")" : "")); });
  const hazirlık = [];
  if (plan.targetDate) {
    const dl = gunFarki(plan.targetDate, bugun);
    if (dl === 7) hazirlık.push("denemeye hazırlık: genel tekrar");
    if (dl === 3) hazirlık.push("denemeye hazırlık: eksik kapatma");
    if (dl === 1) hazirlık.push("denemeye hazırlık: formül turu");
  }
  (plan.schoolExams || []).forEach(se => {
    const f = gunFarki(se.date, bugun);
    if (f === 3) hazirlık.push(se.lesson + " sınavına hazırlık: eksik kapatma");
    if (f === 1) hazirlık.push(se.lesson + " sınavına hazırlık: formül turu");
  });
  if (olaylar.length || hazirlık.length) {
    out.push({
      title: "Bugünün Planı",
      body: "Bugün: " + olaylar.concat(hazirlık).join(" · ") + ".",
      key: "daily"
    });
  }
  return out.map(m => Object.assign(m, { key: bugun + ":" + m.key })); // güne özel tekilleştirme
}

const enc = new TextEncoder();
const NUL = String.fromCharCode(0); // protokol ayırıcısı (kaçış yazmadan)
const dec = new TextDecoder();

function b64url(bytes) {
  let s = "";
  const b = new Uint8Array(bytes);
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  // Kaçışsız (edge fonksiyonuna gömülünce okunur kalsın): + → -, / → _
  return btoa(s).split("+").join("-").split("/").join("_").replace(/=+$/, "");
}

function b64urlCoz(s) {
  const t = String(s || "").replace(/-/g, "+").replace(/_/g, "/");
  const pad = t.length % 4 === 0 ? "" : "=".repeat(4 - (t.length % 4));
  const bin = atob(t + pad);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}

/** Ham P-256 anahtarını (65 bayt, 0x04 ile başlar) WebCrypto anahtarına çevir. */
async function disAnahtar(ham, kullanim) {
  return crypto.subtle.importKey(
    "raw", ham, { name: "ECDH", namedCurve: "P-256" }, false, kullanim
  );
}

function birlestir(...parcalar) {
  const toplam = parcalar.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(toplam);
  let i = 0;
  for (const p of parcalar) { out.set(p, i); i += p.length; }
  return out;
}

async function hkdf(ikm, salt, info, uzunluk) {
  const anahtar = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt, info: enc.encode(info) }, anahtar, uzunluk * 8
  );
  return new Uint8Array(bits);
}

/**
 * Push gövdesini şifrele (RFC 8291, aes128gcm).
 * @param {{p256dh:string, auth:string}} abone  base64url alıcı anahtarları
 * @param {string} metin  gönderilecek JSON
 * @returns {Promise<{govde:Uint8Array, tuz:Uint8Array, asPublic:Uint8Array}>}
 */
async function sifrele(abone, metin, rs = 4096) {
  const uaPublic = b64urlCoz(abone.p256dh);
  const authSecret = b64urlCoz(abone.auth);
  if (uaPublic.length !== 65) throw new Error("p256dh 65 bayt olmalı (gelen " + uaPublic.length + ")");
  if (authSecret.length !== 16) throw new Error("auth 16 bayt olmalı (gelen " + authSecret.length + ")");

  const asCift = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const asPublic = new Uint8Array(await crypto.subtle.exportKey("raw", asCift.publicKey));

  const uaKey = await disAnahtar(uaPublic, []);
  const ecdh = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "ECDH", public: uaKey }, asCift.privateKey, 256
  ));

  // IKM = HKDF(auth_secret, ecdh, "WebPush: info" + NUL || ua_public || as_public, 32)
  const info = birlestir(enc.encode("WebPush: info" + NUL), uaPublic, asPublic);
  const ikmAnahtar = await crypto.subtle.importKey("raw", ecdh, "HKDF", false, ["deriveBits"]);
  const ikm = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt: authSecret, info }, ikmAnahtar, 256
  ));

  const tuz = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(ikm, tuz, "Content-Encoding: aes128gcm" + NUL, 16);
  const nonce = await hkdf(ikm, tuz, "Content-Encoding: nonce" + NUL, 12);

  // Son kayıt: düz metin + 0x02 ayırıcı
  const duz = birlestir(enc.encode(metin), new Uint8Array([2]));

  const aes = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const sifreli = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, aes, duz));

  // Gövde: salt(16) || rs(4, BE) || idlen(1)=65 || as_public(65) || ciphertext
  const bas = new Uint8Array(16 + 4 + 1 + 65);
  bas.set(tuz, 0);
  new DataView(bas.buffer).setUint32(16, rs, false);
  bas[20] = 65;
  bas.set(asPublic, 21);

  return { govde: birlestir(bas, sifreli), tuz, asPublic, rs };
}

/** Şifreyi çöz — SADECE TEST için (tarayıcının yaptığı işin eşi). */
async function coz(aboneOzelJwk, abone, govde) {
  const uaKey = await crypto.subtle.importKey(
    "jwk", aboneOzelJwk, { name: "ECDH", namedCurve: "P-256" }, false, ["deriveBits"]
  );
  const ham = new Uint8Array(govde);
  const tuz = ham.slice(0, 16);
  const idlen = ham[20];
  const asPublic = ham.slice(21, 21 + idlen);
  const sifreli = ham.slice(21 + idlen);

  const asKey = await disAnahtar(asPublic, []);
  const ecdh = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: asKey }, uaKey, 256));
  const info = birlestir(enc.encode("WebPush: info" + NUL), b64urlCoz(abone.p256dh), asPublic);
  const ikmAnahtar = await crypto.subtle.importKey("raw", ecdh, "HKDF", false, ["deriveBits"]);
  const ikm = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt: b64urlCoz(abone.auth), info }, ikmAnahtar, 256
  ));

  const cek = await hkdf(ikm, tuz, "Content-Encoding: aes128gcm" + NUL, 16);
  const nonce = await hkdf(ikm, tuz, "Content-Encoding: nonce" + NUL, 12);
  const aes = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["decrypt"]);
  const duz = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce }, aes, sifreli));

  // Sondaki 0x02 + dolgu sıfırlarını at
  let son = duz.length;
  while (son > 0 && duz[son - 1] === 0) son--;
  if (son > 0 && duz[son - 1] === 2) son--;
  return dec.decode(duz.slice(0, son));
}

/**
 * VAPID JWT üret (RFC 8292). ES256, ham r||s imza.
 * @param {object} ozelJwk  P-256 özel anahtar (JWK; d, x, y)
 * @param {string} endpoint push servisi adresi (aud = origin)
 * @param {string} konu     iletişim adresi ("mailto:..." ya da https URL)
 */
async function vapidJwt(ozelJwk, endpoint, konu, gecerlilikSn = 12 * 3600) {
  const url = new URL(endpoint);
  const bas = { typ: "JWT", alg: "ES256" };
  const govde = {
    aud: url.origin,
    exp: Math.floor(Date.now() / 1000) + gecerlilikSn,
    sub: konu || "mailto:bildirim@analiz-merkezi.app"
  };
  const imzasiz = b64url(enc.encode(JSON.stringify(bas))) + "." + b64url(enc.encode(JSON.stringify(govde)));

  const anahtar = await crypto.subtle.importKey(
    "jwk", ozelJwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]
  );
  const imza = new Uint8Array(await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" }, anahtar, enc.encode(imzasiz)
  ));
  // WebCrypto ES256 zaten ham r||s döndürür (DER değil) — JWS ile uyumlu.
  const jwt = imzasiz + "." + b64url(imza);
  const acik = b64url(birlestir(
    new Uint8Array([4]),
    b64urlCoz(ozelJwk.x),
    b64urlCoz(ozelJwk.y)
  ));
  return { jwt, acik };
}

/** Tarayıcı aboneliğinin alanlarını doğrula. */
function aboneGecerliMi(a) {
  try {
    if (!a || !a.endpoint || !a.p256dh || !a.auth) return false;
    const u = new URL(a.endpoint);
    if (u.protocol !== "https:") return false;
    return b64urlCoz(a.p256dh).length === 65 && b64urlCoz(a.auth).length === 16;
  } catch (e) { return false; }
}


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
        for (const m of mesajlar) {
          const anahtar = String((m && m.key) || "");
          if (!anahtar || bugunKumesi.has(anahtar)) continue;   // bugün zaten gitti
          if (aksam && !kritikMi(anahtar)) continue;            // akşam yalnız kritik
          const mesaj = {
            title: String(m.title || "Analiz Merkezi"),
            body: String(m.body || ""),
            url: hedefUrl(anahtar),
            kind: anahtar.split(":").pop()
          };
          const r = await gonder(a, mesaj);
          if (r.kod === 201) {
            gonderilen++;
            bugunKumesi.add(anahtar);
            await anahtarYaz(a.user_id, anahtar, bugun);
          } else if (r.kod === 404 || r.kod === 410) { await sil(a.id); break; }
          else hatalar.push({ id: a.id, anahtar, ...r });
        }
        if (gonderilen) await isaretle(a.id, bugun);
      } catch (e) {
        hatalar.push({ id: a.id, hata: String(e).slice(0, 160) });
      }
    }
    return json({ mod, vardiya: aksam ? "aksam" : "sabah", kontrol, abonelik: abonelikler_.length, gonderilen, hatalar: hatalar.slice(0, 10), gun: bugun });
  } catch (e) {
    return json({ hata: String(e) }, 500);
  }
});
