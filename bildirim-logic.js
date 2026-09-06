// ============================================================
// BİLDİRİM MANTIĞI (saf, bağımlılıksız) — uygulamadaki
// processDueNotifications + calculatePriority + hafıza motorunun
// bulut kopyası. index.js ve test buradan alır.
// Sabitler constants.js ile birebir aynı.
// ============================================================

const REASON_WEIGHTS = {
  "Konuyu Bilmiyordum": 1.5,
  "KONU EKSİKLİĞİ": 1.5,
  "ANLAMADIM": 0.5,
  "İşlem Hatası/Dikkatsizlik": 0.5,
  "Kodlama/Kitapçık Hatası": 0.1,
  "SÜRE YETMEDİ": 0.3,
  "ÇÖZÜM YOLUNU BULAMADIM": 0.8
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
  if (!str || typeof str !== "string" || !/^\d{4}-\d{2}-\d{2}/.test(str)) return null;
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

// ---- HAFIZA MOTORU (engine-memory.js kopyası) ----
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

// ---- TEKRARLAR (dueReviews kopyası) ----
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

// ---- ÖNCELİK MOTORU (engine-priority.js kopyası) ----
function topicLearnedAfter(key, logDate, state) {
  const mem = state.memory[key];
  if (!mem || !mem.completedAt) return false;
  const done = parseDay(mem.completedAt.split("T")[0]);
  const ld = logDate ? parseDay(logDate) : null;
  return !ld ? true : ld < done;
}
function collectErrorStats(state) {
  const stats = {};
  const push = (log, sourceWeight) => {
    if (!log || !log.topic || !log.lesson) return;
    const key = log.lesson + " > " + log.topic;
    if (topicLearnedAfter(key, log.date, state)) return;
    if (!stats[key]) stats[key] = { lesson: log.lesson, topic: log.topic, count: 0, kae: 0, reasons: {}, weighted: 0 };
    const s = stats[key];
    const w = REASON_WEIGHTS[log.type] != null ? REASON_WEIGHTS[log.type] : 0.5;
    s.count++;
    if (log.type === "Konuyu Bilmiyordum" || log.type === "KONU EKSİKLİĞİ") s.kae++;
    s.weighted += w * sourceWeight;
  };
  (state.exams || []).forEach(ex => (ex.errorLogs || []).forEach(l => push(l, 1.5)));
  (state.questions || []).forEach(q => (q.errorLogs || []).forEach(l => push(l, 1.0)));
  return stats;
}
function calculatePriority(state) {
  const stats = collectErrorStats(state);
  return Object.entries(stats)
    .map(([key, s]) => {
      const laplace = s.kae / (s.count + 1);
      const score = s.weighted * (1 + laplace) * (1 + aytWeightOf(s.lesson));
      return [key, Math.round(score * 10) / 10];
    })
    .filter(r => r[1] > 0)
    .sort((a, b) => b[1] - a[1]);
}

// Konu başarı yüzdesi (deneme + soru bankası)
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

// Unutma İndeksi: başarı >%80 + 20 gün temasa yok
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

// ---- ANA ÜRETİCİ: uygulamadaki TÜM bildirim türleri ----
function buildMessages(state, simdi, secenekler) {
  const o = Object.assign({ koç: true }, secenekler || {});
  const bugun = bugunStr(simdi);
  const now = simdi || new Date();
  const out = [];
  const plan = state.plan || {};

  // 1) KOÇ SELAMI (uygulamadaki günlük selamın push hali)
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

  // 2) TEKRAR BİLDİRİMLERİ: "Tekrar Zamanı Geldi!" (günün tekrarları)
  const due = dueReviewsList(state, bugun);
  if (due.length) {
    const gorunen = due.slice(0, 5).map(r => kirp(splitKey(r.topicKey).topic, 24) + " (" + r.day + ". gün)");
    out.push({
      title: "Tekrar Zamanı Geldi!",
      body: due.length + " konunun tekrarı bugün: " + listeMetni(gorunen, 5) + ". Her biri 10 dakikalık müdahale yeter.",
      key: "reviews"
    });
  }

  // 3) ACİL ÇALIŞILACAKLAR (öncelik listesi — uygulamadaki ile aynı formül)
  const pr = calculatePriority(state);
  if (pr.length) {
    const gorunen = pr.slice(0, 5).map(r => kirp(splitKey(r[0]).topic, 24));
    out.push({
      title: "ACİL Çalışılacaklar (" + pr.length + " konu)",
      body: "Öncelik sıran: " + listeMetni(gorunen, 5) + ". En üsttekini bugün bitir.",
      key: "urgent"
    });
  }

  // 4) KRİTİK HAFIZA ALARMI (< %20)
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

  // 5) UNUTMA İNDEKSİ (başarı >%80 + 20 gün dokunulmadı)
  const unutma = forgettingIndexList(state, now);
  if (unutma.length) {
    const gorunen = unutma.slice(0, 4).map(f => kirp(splitKey(f.key).topic, 22) + " (" + f.idle + " gün)");
    out.push({
      title: "Unutma İndeksi Yükseldi",
      body: "Başarılıydın ama dokunmuyorsun: " + listeMetni(gorunen, 4) + ". Bugün tekrar et.",
      key: "forget"
    });
  }

  // 6) OKUL SINAVI: arifesi + günü (en kritik)
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

  // 7) DENEME kilometre taşları
  if (plan.targetDate) {
    const dl = gunFarki(plan.targetDate, bugun);
    if (dl === 7) out.push({ title: "Sınava 1 Hafta!", body: "Bu hafta genel tekrar haftası: eksik konuları kapat, yeni konu açma.", key: "exam@7" });
    if (dl === 3) out.push({ title: "Sınava Hazırlık: Eksik kapatma günü", body: "Sınav kapsamından en zayıf konularını seçip sadece eksik noktalara odaklan.", key: "exam@3" });
    if (dl === 1) out.push({ title: "YARIN SINAV!", body: "Bugün sadece formül hatırlama + yanlış soru defteri. Erken uyu, iyi şanslar!", key: "exam@1" });
  }

  // 8) GÜNLÜK ÖZET: "Bugünün Planı"
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

module.exports = { parseDay, bugunStr, gunFarki, daysSince, splitKey, getMemoryStrength, dueReviewsList, calculatePriority, topicSuccessRate, forgettingIndexList, buildMessages };
