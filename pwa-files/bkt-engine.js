/*
 * Analiz Merkezi — BKT / doğrulama / ilişki grafı / flashcard katmanı
 *
 * Bu dosya klasik script olarak çalışır; ana uygulamanın mevcut state ve kayıt
 * akışını kaldırmadan üzerine eklenir. Kullanıcı arayüzünde yalnızca Bölüm 9
 * terminolojisi kullanılır.
 */
(function () {
  "use strict";

  const PARAM = Object.freeze({ P_L0: 0.12, P_G: 0.25, P_S: 0.10 });
  const SOURCE_PT = Object.freeze({ deneme: 0.05, soru_girisi: 0.15, mini_test: 0.10 });
  const WRONG_WEIGHT = Object.freeze({
    "KONUEKSİKLİĞİ": 1.0,
    "ANLAMADIM": 0.5,
    "ÇÖZÜMYOLUNUBULAMADIM": 0.5,
    "İşlem Hatası/Dikkatsizlik": 0.2,
    "Kodlama/Kitapçık Hatası": null,
    "SÜREYETMEDİ": null
  });
  const EMPTY_REASONS = Object.freeze(["KONUEKSİKLİĞİ", "SÜREYETMEDİ", "ÇÖZÜMYOLUNUBULAMADIM"]);
  const ALLOWED_SOURCES = Object.freeze(["deneme", "soru_girisi", "mini_test"]);
  const PARAM_KEYS = Object.freeze(["P_L0", "P_G", "P_S"]);
  const STATUS_TEXT = {
    VERI_YETERSIZ: "Birkaç soru daha çöz, seviyen netleşsin",
    OGRENIYOR: "Gelişiyor",
    ONAYLANDI: "Öğrenme Onaylandı",
    RISKLI: "Tekrar Gerekiyor",
    ONARIM: "Bu konuyu yeniden çalışalım"
  };
  const GRAPH_PATH = "content/iliski_grafi.json";
  const TODAY = () => (typeof todayStr === "function" ? todayStr() : new Date().toISOString().slice(0, 10));
  let graphPromise = null;
  let graph = null;
  let saveWrapped = false;
  let motorReady = true;
  let completeTopicWrapped = false;
  let uiObserver = null;
  let uiTimer = null;

  function appState() {
    try { return typeof state === "undefined" ? null : state; } catch (e) { return null; }
  }

  function clamp(n, min, max) { return Math.min(max, Math.max(min, Number(n) || 0)); }
  function dateValue(value) {
    const n = Date.parse(value || "");
    return Number.isFinite(n) ? n : 0;
  }
  const REASON_ALIASES = Object.freeze({
    "KONU EKSİKLİĞİ": "KONUEKSİKLİĞİ",
    "KONUEKSİKLİĞİ": "KONUEKSİKLİĞİ",
    "SÜRE YETMEDİ": "SÜREYETMEDİ",
    "SÜREYETMEDİ": "SÜREYETMEDİ",
    "ÇÖZÜM YOLU BULAMADIM": "ÇÖZÜMYOLUNUBULAMADIM",
    "ÇÖZÜM YOLUNU BULAMADIM": "ÇÖZÜMYOLUNUBULAMADIM",
    "ÇÖZÜM YOLUNUBULAMADIM": "ÇÖZÜMYOLUNUBULAMADIM"
  });
  function normalizeReason(reason) {
    const r = String(reason || "").trim();
    return REASON_ALIASES[r] || r;
  }
  function displayReason(reason) {
    return ({
      "KONUEKSİKLİĞİ": "Konu eksiği",
      "SÜREYETMEDİ": "Süre yetmedi",
      "ÇÖZÜMYOLUNUBULAMADIM": "Çözüm yolunu bulamadım"
    })[normalizeReason(reason)] || String(reason || "");
  }
  function validateParameters(params) {
    const p = Object.assign({}, PARAM, params || {});
    const bounded = PARAM_KEYS.every(k => Number.isFinite(Number(p[k])) && Number(p[k]) >= 0 && Number(p[k]) <= 1);
    const sourceOk = Object.keys(SOURCE_PT).every(k => Number.isFinite(Number(SOURCE_PT[k])) && SOURCE_PT[k] >= 0 && SOURCE_PT[k] <= 1);
    return bounded && sourceOk && Number(p.P_G) + Number(p.P_S) < 1;
  }
  function initializeMotor(params) {
    motorReady = validateParameters(params);
    if (!motorReady) console.error("BKT motoru başlatılmadı: parametre aralığı veya P_G + P_S kısıtı ihlal edildi.");
    return motorReady;
  }
  function topicKey(topic, lesson) {
    if (topic && String(topic).includes(" > ")) return String(topic);
    return lesson && topic ? String(lesson) + " > " + String(topic) : String(topic || "");
  }
  function safeText(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
  function normalizeRecordReasons(record) {
    if (!record || typeof record !== "object") return;
    (Array.isArray(record.errorLogs) ? record.errorLogs : []).forEach(x => {
      if (x && (x.type || x.reason)) { const value = normalizeReason(x.type || x.reason); x.type = value; if (x.reason != null) x.reason = value; }
    });
    (Array.isArray(record.observations) ? record.observations : []).forEach(x => { if (x && (x.neden || x.reason)) { const value = normalizeReason(x.neden || x.reason); x.neden = value; if (x.reason != null) x.reason = value; } });
    (Array.isArray(record.bktObservations) ? record.bktObservations : []).forEach(x => { if (x && (x.neden || x.reason)) { const value = normalizeReason(x.neden || x.reason); x.neden = value; if (x.reason != null) x.reason = value; } });
  }
  function migrateTaxonomy(s) {
    if (!s || s.taxonomy_migration_done) return false;
    (Array.isArray(s.exams) ? s.exams : []).forEach(normalizeRecordReasons);
    (Array.isArray(s.questions) ? s.questions : []).forEach(normalizeRecordReasons);
    Object.values(s.bkt_state || {}).forEach(entry => {
      (Array.isArray(entry.hata_gecmisi) ? entry.hata_gecmisi : []).forEach(x => { if (x) x.type = normalizeReason(x.type || x.reason); });
    });
    s.taxonomy_migration_done = true;
    return true;
  }
  function migrateFlashcardMemory(s) {
    if (!s || s.flashcard_memory_migration_done) return false;
    (s.flashcards.cards || []).forEach(card => {
      if (card.S != null) return;
      const mem = s.memory && s.memory[card.topicKey]; const count = mem && Number(mem.reviewCount) || 0;
      const rate = Math.max(0.03, 0.16 * Math.pow(0.90, count));
      card.S = 1 / rate;
      card.memory_bar = card.memory_bar == null ? 1 : card.memory_bar;
    });
    s.flashcard_memory_migration_done = true;
    return true;
  }
  function ensureStore() {
    const s = appState();
    if (!s) return null;
    if (!s.bkt_state || typeof s.bkt_state !== "object" || Array.isArray(s.bkt_state)) s.bkt_state = {};
    if (!s.bkt_processed_records || typeof s.bkt_processed_records !== "object") s.bkt_processed_records = {};
    if (!s.flashcards || typeof s.flashcards !== "object") s.flashcards = { cards: [], sessions: {}, lastSoftDrop: {} };
    if (!Array.isArray(s.flashcards.cards)) s.flashcards.cards = [];
    if (!s.flashcards.sessions || typeof s.flashcards.sessions !== "object") s.flashcards.sessions = {};
    if (!s.flashcards.lastSoftDrop || typeof s.flashcards.lastSoftDrop !== "object") s.flashcards.lastSoftDrop = {};
    if (!Array.isArray(s.soru_havuzu_gosterim_logu)) s.soru_havuzu_gosterim_logu = [];
    if (!Array.isArray(s.mini_test_kuyrugu)) s.mini_test_kuyrugu = [];
    migrateFlashcardMemory(s);
    if (!s.mini_test_sessions || typeof s.mini_test_sessions !== "object") s.mini_test_sessions = {};
    migrateTaxonomy(s);
    return s;
  }
  function newEntry() {
    return {
      L: PARAM.P_L0,
      gozlem_sayisi: 0,
      son_gozlem_tarihi: null,
      tetiklenen_krediler: [],
      onay_durumu: "VERI_YETERSIZ",
      graph_topic_id: null,
      son_negatif_tarihi: null,
      flashcard_bilemedi_ardisik: 0,
      son_hafiza_dususu: null,
      hata_gecmisi: []
    };
  }
  function getEntry(key, create) {
    const s = ensureStore();
    if (!s || !key) return null;
    if (!s.bkt_state[key] && create !== false) s.bkt_state[key] = newEntry();
    return s.bkt_state[key] || null;
  }
  function statusFor(entry) {
    if (!entry || entry.gozlem_sayisi < 5) return "VERI_YETERSIZ";
    return entry.onay_durumu || "OGRENIYOR";
  }
  function observedFromEntry(entry, correct, source, reason) {
    const pT = SOURCE_PT[source];
    if (pT == null) throw new Error("kaynak geçersiz");
    const prior = clamp(entry.L, 0.01, 0.99);
    if (correct) {
      return (prior * (1 - PARAM.P_S)) /
        (prior * (1 - PARAM.P_S) + (1 - prior) * PARAM.P_G) +
        (1 - ((prior * (1 - PARAM.P_S)) /
          (prior * (1 - PARAM.P_S) + (1 - prior) * PARAM.P_G))) * pT;
    }
    const wrong = prior * PARAM.P_S /
      (prior * PARAM.P_S + (1 - prior) * (1 - PARAM.P_G));
    return wrong + (1 - wrong) * pT;
  }

  function observe(input) {
    const data = input || {};
    if (!motorReady) return { ignored: true, reason: "parametre" };
    const source = String(data.kaynak || data.source || "");
    const key = topicKey(data.konu_id || data.topicKey || data.topic, data.lesson || data.ders);
    if (!ALLOWED_SOURCES.includes(source)) return { ignored: true, reason: "kaynak" };
    if (!key) return { ignored: true, reason: "konu" };
    const correct = data.dogru_mu === true || data.correct === true;
    const reason = normalizeReason(data.neden || data.reason);
    const weight = correct ? 1 : WRONG_WEIGHT[reason];
    if (!correct && weight == null) return { ignored: true, reason: "gözlem sayılmayan neden" };
    const entry = getEntry(key, true);
    if (data.record_id || data.recordId) entry.son_kayit_id = data.record_id || data.recordId;
    if (data.graph_topic_id || data.graphTopicId) entry.graph_topic_id = data.graph_topic_id || data.graphTopicId;
    if (data.pool_id || data.poolId) entry.pool_id = data.pool_id || data.poolId;
    else if (!entry.pool_id) entry.pool_id = resolvePoolId(key);
    if (data.alt_beceri || data.altBeceri) entry.last_alt_beceri = data.alt_beceri || data.altBeceri;
    const nextFull = observedFromEntry(entry, correct, source, reason);
    entry.L = clamp(correct ? nextFull : entry.L + (nextFull - entry.L) * weight, 0.01, 0.99);
    entry.gozlem_sayisi += 1;
    entry.son_gozlem_tarihi = data.tarih || data.date || TODAY();
    if (!Array.isArray(entry.hata_gecmisi)) entry.hata_gecmisi = [];
    if (!correct) {
      entry.son_negatif_tarihi = entry.son_gozlem_tarihi;
      entry.hata_gecmisi.push({ type: reason, date: entry.son_gozlem_tarihi, source: source, alt_beceri: data.alt_beceri || data.altBeceri || "" });
      if (entry.hata_gecmisi.length > 100) entry.hata_gecmisi.shift();
    }
    if (entry.gozlem_sayisi >= 5 && entry.onay_durumu === "VERI_YETERSIZ") entry.onay_durumu = "OGRENIYOR";
    return { ignored: false, topicKey: key, L: entry.L, status: statusFor(entry), weight: weight };
  }

  function processObservationList(list, source, idPrefix) {
    let count = 0;
    (Array.isArray(list) ? list : []).forEach(function (item, i) {
      const id = idPrefix + ":" + i;
      const s = ensureStore();
      if (s.bkt_processed_records[id]) return;
      const result = observe({
        konu_id: item.konu_id || item.topicKey || item.topic,
        lesson: item.lesson || item.ders,
        dogru_mu: item.dogru_mu === true || item.correct === true,
        neden: item.neden || item.reason,
        kaynak: item.kaynak || source,
        tarih: item.tarih || item.date || TODAY(),
        graph_topic_id: item.graph_topic_id || item.graphTopicId,
        pool_id: item.pool_id || item.poolId,
        alt_beceri: item.alt_beceri || item.altBeceri || "",
        record_id: item.record_id || item.recordId || null
      });
      s.bkt_processed_records[id] = 1;
      if (!result.ignored) count++;
    });
    return count;
  }

  function processRecord(record, source) {
    if (!record || !record.id) return 0;
    const s = ensureStore();
    let count = 0;
    const prefix = "record:" + source + ":" + record.id;
    count += processObservationList(record.bktObservations, source, prefix + ":explicit");
    count += processObservationList(record.observations, source, prefix + ":observations");
    const majorErrors = {};
    (Array.isArray(record.errorLogs) ? record.errorLogs : []).forEach(function (error, i) {
      const id = prefix + ":error:" + i;
      const reason = normalizeReason(error.type || error.reason);
      if (["Konuyu Bilmiyordum", "KONU EKSİKLİĞİ", "ANLAMADIM"].includes(reason)) {
        const key = topicKey(error.konu_id || error.topic, error.lesson);
        majorErrors[key] = (majorErrors[key] || 0) + 1;
      }
      if (s.bkt_processed_records[id]) return;
      const result = observe({
        konu_id: error.konu_id || error.topic,
        lesson: error.lesson,
        dogru_mu: false,
        neden: reason,
        kaynak: source,
        tarih: error.date || record.date || TODAY(),
        graph_topic_id: error.graph_topic_id || error.graphTopicId,
        alt_beceri: error.alt_beceri || error.altBeceri || "",
        record_id: record.id
      });
      s.bkt_processed_records[id] = 1;
      if (!result.ignored) count++;
    });
    if (source === "deneme") Object.keys(majorErrors).forEach(function (key) {
      const entry = getEntry(key, false);
      if (entry && entry.onay_durumu === "ONAYLANDI" && majorErrors[key] >= 2) entry.onay_durumu = "RISKLI";
    });
    return count;
  }

  function migrateExisting() {
    const s = ensureStore();
    if (!s || s.bkt_migration_done) return 0;
    const rows = [];
    (s.exams || []).forEach(x => rows.push({ row: x, source: "deneme" }));
    (s.questions || []).forEach(x => rows.push({ row: x, source: "soru_girisi" }));
    rows.sort((a, b) => dateValue(a.row.date) - dateValue(b.row.date));
    let count = 0;
    rows.forEach(x => { count += processRecord(x.row, x.source); });
    s.bkt_migration_done = true;
    return count;
  }

  function rebuildAfterDeletion(s) {
    s.bkt_state = {}; s.bkt_processed_records = {}; s.bkt_migration_done = false;
    migrateExisting();
    s.bkt_migration_done = true;
    return true;
  }
  function syncDeletedRecords() {
    const s = ensureStore(); if (!s || !s.bkt_migration_done) return false;
    const current = new Set([...(s.exams || []).map(x => "deneme:" + x.id), ...(s.questions || []).map(x => "soru_girisi:" + x.id)]);
    const deleted = Object.keys(s.bkt_processed_records || {}).some(id => {
      const match = id.match(/^record:(deneme|soru_girisi):([^:]+)/);
      return match && !current.has(match[1] + ":" + match[2]);
    });
    return deleted ? rebuildAfterDeletion(s) : false;
  }
  function processNewRecords() {
    const s = ensureStore();
    if (!s) return 0;
    (s.exams || []).forEach(normalizeRecordReasons); (s.questions || []).forEach(normalizeRecordReasons);
    migrateTaxonomy(s);
    syncDeletedRecords();
    migrateExisting();
    let count = 0;
    (s.exams || []).forEach(x => { count += processRecord(x, "deneme"); });
    (s.questions || []).forEach(x => { count += processRecord(x, "soru_girisi"); });
    if (typeof getMemoryStrength === "function") Object.keys(s.memory || {}).forEach(function (key) {
      applyMemorySignal(key, getMemoryStrength(key));
    });
    Object.keys(s.bkt_state).forEach(degradedApproval);
    queueLearningTests();
    return count;
  }

  function topologicalCycleEdges(edges, ids) {
    const outgoing = {}; ids.forEach(id => { outgoing[id] = []; });
    edges.filter(e => e.iliski_tipi === "SERT_ONKOSUL").forEach(e => outgoing[e.kaynak_konu_id].push(e));
    const colour = {}; const stack = []; const stackIndex = {};
    function visit(id) {
      colour[id] = 1; stackIndex[id] = stack.length;
      for (const edge of outgoing[id] || []) {
        const next = edge.hedef_konu_id;
        if (colour[next] === 1) {
          const start = stackIndex[next];
          return stack.slice(start).concat(edge);
        }
        if (!colour[next]) { stack.push(edge); const found = visit(next); if (found) return found; stack.pop(); }
      }
      colour[id] = 2; delete stackIndex[id];
      return null;
    }
    for (const id of ids) { if (!colour[id]) { stack.length = 0; const found = visit(id); if (found) return found; } }
    return null;
  }
  function validateGraphData(data) {
    const errors = []; const disabled_edges = [];
    if (!data || !Array.isArray(data.dugumler) || !Array.isArray(data.kenarlar)) errors.push("şema: dugumler/kenarlar dizisi zorunlu");
    const nodes = Array.isArray(data && data.dugumler) ? data.dugumler : [];
    const sourceEdges = Array.isArray(data && data.kenarlar) ? data.kenarlar : [];
    if (!nodes.length) errors.push("düğüm yok");
    const ids = new Set(nodes.map(n => n && n.konu_id).filter(Boolean));
    if (ids.size !== nodes.filter(n => n && n.konu_id).length) errors.push("yinelenen konu_id");
    const valid = [];
    nodes.forEach(n => { if (!n || !n.konu_id || !n.konu_adi || !Number.isFinite(Number(n.sinif)) || !n.ders) errors.push("geçersiz düğüm"); });
    sourceEdges.forEach((edge, i) => {
      const type = edge && edge.iliski_tipi;
      const min = type === "SERT_ONKOSUL" ? 0.70 : 0.20;
      const max = type === "SERT_ONKOSUL" ? 1.00 : 0.50;
      if (!edge || !ids.has(edge.kaynak_konu_id) || !ids.has(edge.hedef_konu_id)) { errors.push("yetim kenar:" + i); disabled_edges.push({ edge: edge, reason: "yetim" }); return; }
      if (!["SERT_ONKOSUL", "YUMUSAK_TRANSFER"].includes(type) || !Number.isFinite(Number(edge.agirlik)) || Number(edge.agirlik) < min || Number(edge.agirlik) > max) { errors.push("ağırlık/tür:" + i); disabled_edges.push({ edge: edge, reason: "ağırlık/tür" }); return; }
      const source = nodes.find(n => n.konu_id === edge.kaynak_konu_id);
      const target = nodes.find(n => n.konu_id === edge.hedef_konu_id);
      const out = Object.assign({}, edge);
      if (type === "SERT_ONKOSUL" && Number(source.sinif) > Number(target.sinif)) out.ileri_bagimlilik = true;
      valid.push(out);
    });
    // Aşırı girişler: en yüksek ağırlıklı dört kenar kalır; diğerleri pasif loga gider.
    const byTarget = {};
    valid.forEach(edge => { if (edge.iliski_tipi === "SERT_ONKOSUL") (byTarget[edge.hedef_konu_id] ||= []).push(edge); });
    Object.keys(byTarget).forEach(id => {
      const incoming = byTarget[id].slice().sort((a, b) => Number(b.agirlik) - Number(a.agirlik));
      incoming.slice(4).forEach(edge => {
        const at = valid.indexOf(edge); if (at >= 0) valid.splice(at, 1);
        errors.push("sert yoğunluk:" + id); disabled_edges.push({ edge: edge, reason: "sert yoğunluk" });
      });
    });
    // Döngülü SERT kenarlar da aktif listeden çıkarılır; uygulama bozulmuş grafla çalışmaya devam eder.
    let cycle;
    while ((cycle = topologicalCycleEdges(valid, ids))) {
      const removed = cycle.slice().sort((a, b) => Number(a.agirlik) - Number(b.agirlik))[0];
      const at = valid.indexOf(removed); if (at < 0) break;
      valid.splice(at, 1);
      errors.push("sert döngü"); disabled_edges.push({ edge: removed, reason: "sert döngü" });
    }
    return { valid: errors.length === 0, errors: errors, nodes: nodes, edges: valid, disabled_edges: disabled_edges, ids: ids };
  }

  function loadGraph() {
    if (graphPromise) return graphPromise;
    graphPromise = fetch(GRAPH_PATH, { cache: "no-store" }).then(r => {
      if (!r.ok) throw new Error("graf dosyası okunamadı");
      return r.json();
    }).then(data => {
      graph = validateGraphData(data);
      window.__analizIliskiGrafigi = graph;
      if (!graph.valid) console.warn("İlişki grafında devre dışı kenarlar var:", graph.errors);
      return graph;
    }).catch(err => {
      console.warn("İlişki grafı bozulmuş modda çalışıyor:", err.message || err);
      graph = { valid: false, errors: [String(err.message || err)], nodes: [], edges: [], ids: new Set() };
      window.__analizIliskiGrafigi = graph;
      return graph;
    });
    return graphPromise;
  }

  function applyGraphCredits(sourceId) {
    if (!graph || !graph.edges) return [];
    const source = getEntry(sourceId, false);
    // Kredi çağıran akışa güvenmez; kaynak doğrudan burada doğrulanır.
    if (!source || statusFor(source) !== "ONAYLANDI") return [];
    const changed = [];
    graph.edges.filter(e => e.kaynak_konu_id === sourceId && !e.ileri_bagimlilik).forEach(function (edge) {
      const target = getEntry(edge.hedef_konu_id, true);
      const latch = edge.kaynak_konu_id + "->" + edge.hedef_konu_id;
      if (target.tetiklenen_krediler.includes(latch)) return;
      const credit = edge.iliski_tipi === "SERT_ONKOSUL" ? 0.15 * Number(edge.agirlik) : 0.10 * Number(edge.agirlik);
      target.L = clamp(Math.min(0.40, target.L + credit), 0.01, 0.99);
      target.tetiklenen_krediler.push(latch);
      changed.push({ target: edge.hedef_konu_id, credit: credit });
    });
    return changed;
  }

  function applyRootPriority(sourceKey, ownPriority, targetPriority, weight, targetKey) {
    const entry = getEntry(sourceKey, true); const base = Number(ownPriority) || 0; const target = Number(targetPriority) || 0; const multiplier = Number(weight) || 0;
    const effective = Math.max(base, target * multiplier);
    entry.kok_neden_oncelik = { target: targetKey || null, kendi: base, hedef: target, agirlik: multiplier, etkin: effective };
    return effective;
  }
  function clearRootPriority(sourceKey) {
    const entry = getEntry(sourceKey, false); if (entry && entry.kok_neden_oncelik) delete entry.kok_neden_oncelik; return true;
  }
  function clearRootPrioritiesForTarget(targetKey) {
    const s = ensureStore(); Object.keys(s.bkt_state || {}).forEach(key => { const e = s.bkt_state[key]; if (e.kok_neden_oncelik && e.kok_neden_oncelik.target === targetKey) delete e.kok_neden_oncelik; });
  }
  function rootCause(topicId, recentErrors, options) {
    const rows = Array.isArray(recentErrors) ? recentErrors : [];
    const difficult = rows.filter(r => ["ANLAMADIM", "KONU EKSİKLİĞİ", "KONUEKSİKLİĞİ"].includes(normalizeReason(r.type || r.reason)));
    const recent = rows.filter(r => !r.date || Date.now() - dateValue(r.date) <= 14 * 86400000);
    const ratioTrigger = rows.length >= 3 && difficult.length / rows.length >= 0.40;
    if (recent.length < 3 && !ratioTrigger) { clearRootPrioritiesForTarget(topicId); return null; }
    // Kendi deneme verisi yeterliyse mevcut mekanizma önceliklidir; graf karışmaz.
    const local = rows.filter(r => r.source === "deneme");
    const localDifficult = local.filter(r => ["ANLAMADIM", "KONU EKSİKLİĞİ", "KONUEKSİKLİĞİ"].includes(normalizeReason(r.type || r.reason)));
    if ((options && options.localDataSufficient) || (local.length >= 3 && (localDifficult.length >= 3 || localDifficult.length / local.length >= 0.40))) return null;
    if (!graph || !graph.edges) return null;
    const candidates = graph.edges.filter(e => e.hedef_konu_id === topicId && e.iliski_tipi === "SERT_ONKOSUL" && !e.ileri_bagimlilik)
      .map(e => { const entry = getEntry(e.kaynak_konu_id, false); return { edge: e, entry: entry, L: entry ? entry.L : null }; })
      .sort((a, b) => (a.L == null ? -1 : a.L) - (b.L == null ? -1 : b.L) || Number(b.edge.agirlik) - Number(a.edge.agirlik));
    if (!candidates.length) return null;
    const weak = candidates.filter(x => !x.entry || x.entry.L < 0.60);
    const nodeFor = id => graph.nodes.find(n => n.konu_id === id);
    if (!weak.length || candidates.every(x => x.entry && x.entry.L >= 0.85)) {
      const current = nodeFor(topicId);
      if (typeof console !== "undefined" && console.info) console.info("Kök neden önerisi mevcut konuda tutuldu", topicId);
      return { topicId: topicId, topicName: current ? current.konu_adi : topicId, stay: true, reason: "Mevcut konuyu çalışmaya devam et" };
    }
    const chosen = weak[0];
    const node = nodeFor(chosen.edge.kaynak_konu_id);
    if (typeof calculatePriority === "function") {
      try {
        const priorities = calculatePriority() || []; const targetRow = priorities.find(x => x[0] === topicId); const sourceRow = priorities.find(x => x[0] === chosen.edge.kaynak_konu_id);
        applyRootPriority(chosen.edge.kaynak_konu_id, sourceRow ? sourceRow[1] : 0, targetRow ? targetRow[1] : 0, Number(chosen.edge.agirlik), topicId);
      } catch (_) {}
    }
    return {
      topicId: chosen.edge.kaynak_konu_id,
      topicName: node ? node.konu_adi : chosen.edge.kaynak_konu_id,
      priorityWeight: Number(chosen.edge.agirlik),
      priorityMultiplier: Number(chosen.edge.agirlik),
      priorityFormula: "max(kendi puanı, hedef puanı × kenar ağırlığı)",
      reason: "Önce şu konuyu sağlamlaştır"
    };
  }

  function applyMemorySignal(key, memoryPercent) {
    const entry = getEntry(key, true); const s = ensureStore(); const today = TODAY();
    if (Number(memoryPercent) >= 20 || s.flashcards.lastSoftDrop[key] === today) return false;
    entry.L = clamp(entry.L * 0.8, 0.01, 0.99);
    entry.son_hafiza_dususu = today;
    s.flashcards.lastSoftDrop[key] = today;
    if (entry.onay_durumu === "ONAYLANDI") entry.onay_durumu = "RISKLI";
    return true;
  }

  function validatePool(pool, expectedId) {
    const errors = [];
    const questions = Array.isArray(pool && pool.sorular) ? pool.sorular : [];
    if (!pool || !pool.konu_id || (expectedId && pool.konu_id !== expectedId)) errors.push("konu_id");
    if (questions.length < 10) errors.push("en az 10 soru");
    const skillCounts = {};
    questions.forEach((q, i) => {
      if (!q || !q.soru_id || !q.alt_beceri || !q.metin) errors.push("soru alanı:" + i);
      if (!Array.isArray(q.secenekler) || q.secenekler.length !== 4 || !Number.isInteger(q.dogru_index)) errors.push("seçenek:" + i);
      if (!q.cozum || q.zorluk !== "deneme") errors.push("çözüm/deneme zorluğu:" + i);
      if (q.alt_beceri) skillCounts[q.alt_beceri] = (skillCounts[q.alt_beceri] || 0) + 1;
    });
    Object.keys(skillCounts).forEach(k => { if (skillCounts[k] < 2) errors.push("alt beceri:" + k); });
    return { valid: errors.length === 0, errors: errors };
  }

  const poolCache = {};
  let poolManifest = null;
  let poolManifestPromise = null;
  function loadPoolManifest() {
    if (poolManifestPromise) return poolManifestPromise;
    poolManifestPromise = fetch("content/soru_havuzlari/index.json", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(data => {
      poolManifest = data && Array.isArray(data.havuzlar) ? data : { havuzlar: [] };
      return poolManifest;
    }).catch(() => { poolManifest = { havuzlar: [] }; return poolManifest; });
    return poolManifestPromise;
  }
  function resolvePoolId(topicKey) {
    if (!poolManifest || !Array.isArray(poolManifest.havuzlar)) return null;
    const raw = String(topicKey || "");
    const direct = poolManifest.havuzlar.find(p => p.topic_key === raw);
    if (direct) return direct.konu_id;
    const lesson = raw.split(" > ")[0];
    const topic = raw.split(" > ").slice(1).join(" > ");
    const sameLesson = poolManifest.havuzlar.filter(p => !lesson || p.ders === lesson);
    const normalized = normalizeReason(topic).toLocaleLowerCase("tr-TR");
    const exact = sameLesson.find(p => p.baslik && normalizeReason(p.baslik).toLocaleLowerCase("tr-TR") === normalized);
    return exact ? exact.konu_id : null;
  }
  function loadPool(topicId) {
    if (!topicId) return Promise.resolve(null);
    if (poolCache[topicId]) return poolCache[topicId];
    const path = "content/soru_havuzlari/" + encodeURIComponent(topicId) + ".json";
    poolCache[topicId] = fetch(path, { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(pool => {
      if (!pool) return null;
      const check = validatePool(pool, topicId);
      if (!check.valid) { console.warn("Soru havuzu geçersiz:", topicId, check.errors); return null; }
      return pool;
    }).catch(() => null);
    return poolCache[topicId];
  }

  const REVIEW_LADDER = Object.freeze([1, 3, 7, 14, 28]);
  function addDays(date, days) {
    const d = new Date(dateValue(date) || Date.now()); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + Number(days));
    return d.toISOString().slice(0, 10);
  }
  function daysBetween(a, b) { return Math.floor((dateValue(b) - dateValue(a)) / 86400000); }
  function poolLogFor(s, poolId, questionId) {
    return s.soru_havuzu_gosterim_logu.find(x => x.konu_id === poolId && x.soru_id === questionId);
  }
  function selectPoolQuestions(pool, poolId, count, atDate) {
    const s = ensureStore(); const questions = Array.isArray(pool && pool.sorular) ? pool.sorular : [];
    const today = atDate || TODAY(); const id = poolId || (pool && pool.konu_id);
    const rows = questions.map(q => ({ q: q, log: poolLogFor(s, id, q.soru_id) }));
    const eligible = rows.filter(row => !row.log || daysBetween(row.log.son_gosterim_tarihi, today) >= 28);
    const source = eligible.length >= count ? eligible : rows;
    source.sort((a, b) => dateValue(a.log && a.log.son_gosterim_tarihi) - dateValue(b.log && b.log.son_gosterim_tarihi));
    const chosen = source.slice(0, Math.min(count, source.length));
    chosen.forEach(row => {
      const old = row.log;
      if (old) old.son_gosterim_tarihi = today;
      else s.soru_havuzu_gosterim_logu.push({ konu_id: id, soru_id: row.q.soru_id, son_gosterim_tarihi: today });
    });
    if (typeof saveState === "function") saveState();
    return chosen.map(row => row.q);
  }
  function learningDayForTopic() {
    try {
      const left = typeof daysLeftToExam === "function" ? daysLeftToExam() : null;
      return left != null && left < 7 ? 2 : 3;
    } catch (e) { return 3; }
  }
  function scheduleLearningTest(key, baseDate) {
    const entry = getEntry(key, true); const due = addDays(baseDate || TODAY(), learningDayForTopic());
    entry.learning_test_due = due; entry.learning_test_locked_until = null;
    return due;
  }
  function queueLearningTests() {
    const s = ensureStore(); const today = TODAY();
    Object.keys(s.bkt_state).forEach(key => {
      const entry = s.bkt_state[key];
      if (!entry.learning_test_due && entry.study_completed_at) scheduleLearningTest(key, entry.study_completed_at);
      if (!entry.learning_test_due || dateValue(entry.learning_test_due) > dateValue(today)) return;
      if (entry.learning_test_locked_until && dateValue(entry.learning_test_locked_until) > dateValue(today)) return;
      if (statusFor(entry) === "ONAYLANDI") return;
      const poolId = entry.pool_id || resolvePoolId(key); if (!poolId) return;
      if (!s.mini_test_kuyrugu.some(x => x.topicKey === key && x.type === "learning" && !x.completed)) {
        s.mini_test_kuyrugu.push({ id: "learning:" + key, topicKey: key, poolId: poolId, type: "learning", due: today, completed: false });
      }
    });
    return s.mini_test_kuyrugu;
  }
  function precheckTopic(key, poolId) {
    const entry = getEntry(key, true); entry.precheck_due = TODAY(); entry.pool_id = poolId || entry.pool_id || resolvePoolId(key);
    return openMiniTest(key, entry.pool_id, { mode: "precheck" });
  }
  function openMiniTest(topicKey, poolId, options) {
    const opts = options || {}; const mode = opts.mode || "learning";
    loadPool(poolId || topicKey).then(function (pool) {
      if (!pool) return typeof toast === "function" && toast("Bu konu için henüz soru havuzu hazırlanmadı.", "info");
      const actualPoolId = pool.konu_id || poolId; const count = mode === "precheck" ? 3 : 5; const stored = (ensureStore().mini_test_sessions || {})[topicKey];
      const storedQuestions = stored && !stored.complete && stored.mode === mode && Array.isArray(stored.questionIds) ? stored.questionIds.map(id => pool.sorular.find(q => q.soru_id === id)).filter(Boolean) : [];
      const questions = opts.questions || (storedQuestions.length === count ? storedQuestions : selectPoolQuestions(pool, actualPoolId, count));
      let modal = document.getElementById("bkt-test-modal");
      if (!modal) { modal = document.createElement("div"); modal.id = "bkt-test-modal"; modal.style.cssText = "position:fixed;inset:0;z-index:10001;display:flex;align-items:center;justify-content:center;background:rgba(10,16,32,.62);padding:14px;"; document.body.appendChild(modal); }
      const title = mode === "precheck" ? "Kısa Kontrol" : "Öğrenme Testi";
      let html = '<div style="width:100%;max-width:600px;max-height:90vh;overflow:auto;background:var(--bg-card,#fff);color:var(--text-main,#16213A);border-radius:16px;padding:20px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><strong>' + title + ' — ' + questions.length + ' soru</strong><button type="button" data-bkt-close-test style="min-width:48px;min-height:48px;border:0;background:none;color:inherit;font-size:20px;cursor:pointer;">×</button></div><p class="text-xs text-muted">Tüm soruları işaretle. Test sırasında doğru cevap gösterilmez.</p>';
      questions.forEach(function (q, i) {
        html += '<fieldset style="border:0;border-top:1px solid var(--border-card);padding:12px 0;margin:0;"><legend style="font-weight:700;font-size:13px;">' + (i + 1) + '. ' + safeText(q.metin) + '</legend>';
        (q.secenekler || []).forEach(function (option, j) { html += '<label style="display:block;font-size:12.5px;padding:5px 0;min-height:48px;"><input type="radio" name="bkt-q-' + i + '" value="' + j + '"> ' + safeText(option) + '</label>'; });
        html += '</fieldset>';
      });
      html += '<div id="bkt-test-message" class="text-xs" style="min-height:18px;margin-bottom:8px;"></div><button type="button" class="btn btn-primary w-full" data-bkt-submit-test disabled style="min-height:48px;">Testi Bitir</button></div>';
      modal.innerHTML = html; modal.style.display = "flex";
      modal._bktQuestions = questions; modal._bktTopicKey = topicKey; modal._bktPoolId = actualPoolId; modal._bktMode = mode;
      persistMiniSession(modal);
      const saved = (ensureStore().mini_test_sessions || {})[topicKey];
      if (saved && Array.isArray(saved.answers)) saved.answers.forEach((answer, i) => { if (answer !== "") { const radio = modal.querySelector('input[name="bkt-q-' + i + '"][value="' + answer + '"]'); if (radio) radio.checked = true; } });
      updateMiniSubmitState(modal);
    });
  }
  function persistMiniSession(modal) {
    const s = ensureStore(); if (!s || !modal) return;
    const answers = (modal._bktQuestions || []).map((q, i) => { const el = modal.querySelector('input[name="bkt-q-' + i + '"]:checked'); return el ? el.value : ""; });
    s.mini_test_sessions[modal._bktTopicKey] = { topicKey: modal._bktTopicKey, poolId: modal._bktPoolId, mode: modal._bktMode, questionIds: (modal._bktQuestions || []).map(q => q.soru_id), answers: answers, started: s.mini_test_sessions[modal._bktTopicKey]?.started || TODAY(), complete: false };
    if (typeof saveState === "function") saveState();
  }
  function updateMiniSubmitState(modal) {
    if (!modal) return false;
    const questions = modal._bktQuestions || []; const complete = questions.length > 0 && questions.every((q, i) => modal.querySelector('input[name="bkt-q-' + i + '"]:checked'));
    const button = modal.querySelector("[data-bkt-submit-test]"); if (button) button.disabled = !complete;
    return complete;
  }

  function closeMiniTest() { const modal = document.getElementById("bkt-test-modal"); if (modal) modal.remove(); }
  function showMiniResult(modal, draft) {
    const questions = modal._bktQuestions || []; const wrong = draft.wrongIndexes || [];
    let html = '<div style="width:100%;max-width:600px;max-height:90vh;overflow:auto;background:var(--bg-card,#fff);color:var(--text-main,#16213A);border-radius:16px;padding:20px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><strong>Sonuçlar</strong><button type="button" data-bkt-close-test style="min-width:48px;min-height:48px;border:0;background:none;color:inherit;font-size:20px;">×</button></div><p class="text-sm">' + draft.correct + '/' + questions.length + ' doğru.</p>';
    questions.forEach((q, i) => {
      const ok = Number(draft.answers[i]) === Number(q.dogru_index);
      html += '<div style="border-top:1px solid var(--border-card);padding:10px 0;font-size:12px;"><b>' + (i + 1) + '. ' + (ok ? "Doğru" : "Yanlış") + '</b><div class="text-muted" style="margin-top:4px;">Çözüm: ' + safeText(q.cozum) + '</div>';
      if (!ok) html += '<label style="display:block;margin-top:7px;">Neden <select data-bkt-reason="' + i + '" style="min-height:48px;"><option value="">Seçiniz</option><option value="Konuyu Bilmiyordum">Konuyu bilmiyordum</option><option value="KONUEKSİKLİĞİ">Konu eksiği</option><option value="ANLAMADIM">Anlamadım</option><option value="ÇÖZÜMYOLUNUBULAMADIM">Çözüm yolunu bulamadım</option><option value="İşlem Hatası/Dikkatsizlik">İşlem hatası / dikkatsizlik</option><option value="Kodlama/Kitapçık Hatası">Kodlama / kitapçık hatası</option><option value="SÜREYETMEDİ">Süre yetmedi</option></select></label>';
      html += '</div>';
    });
    html += '<div id="bkt-test-message" class="text-xs" style="min-height:18px;margin:8px 0;"></div><button type="button" class="btn btn-primary w-full" data-bkt-finalize-test style="min-height:48px;">Nedenleri Kaydet</button></div>';
    modal.innerHTML = html; modal._bktDraft = draft;
  }
  function finishMiniTest(modal) {
    if (!updateMiniSubmitState(modal)) { const msg = modal.querySelector("#bkt-test-message"); if (msg) msg.textContent = "Testi bitirmek için tüm soruları işaretle."; return; }
    persistMiniSession(modal);
    const answers = (modal._bktQuestions || []).map((q, i) => modal.querySelector('input[name="bkt-q-' + i + '"]:checked').value);
    const result = submitMiniTest({ konu_id: modal._bktTopicKey, pool_id: modal._bktPoolId, questions: modal._bktQuestions, answers: answers, mode: modal._bktMode });
    if (result.needsReasons) showMiniResult(modal, result);
    else completeMiniTestView(modal, result);
  }
  function completeMiniTestReasons(modal) {
    const draft = modal._bktDraft || {}; const reasons = {};
    (draft.wrongIndexes || []).forEach(i => { const el = modal.querySelector('[data-bkt-reason="' + i + '"]'); if (el && el.value) reasons[i] = el.value; });
    if ((draft.wrongIndexes || []).some(i => !reasons[i])) { const msg = modal.querySelector("#bkt-test-message"); if (msg) msg.textContent = "Her yanlış cevap için neden seç."; return; }
    const result = submitMiniTest({ konu_id: modal._bktTopicKey, pool_id: modal._bktPoolId, questions: modal._bktQuestions, answers: draft.answers, reasons: reasons, mode: modal._bktMode });
    if (result.ok) completeMiniTestView(modal, result);
  }
  function completeMiniTestView(modal, result) {
    const s = ensureStore(); if (s && s.mini_test_sessions[modal._bktTopicKey]) s.mini_test_sessions[modal._bktTopicKey].complete = true;
    if (typeof saveState === "function") saveState();
    const msg = modal.querySelector("#bkt-test-message"); if (msg) msg.textContent = modal._bktMode === "precheck" && result.result.returnToFirstStep ? "1. adıma dönüp konuyu yeniden çalışalım." : (result.result.passed ? "Öğrenme Onaylandı." : "Bu konuyu yeniden çalışalım; yeni test daha sonra açılacak.");
    const button = modal.querySelector("[data-bkt-submit-test], [data-bkt-finalize-test]"); if (button) button.remove();
    setTimeout(closeMiniTest, 1300);
  }
  function submitMiniTest(input) {
    const data = input || {}; const questions = Array.isArray(data.questions) ? data.questions : [];
    const answers = Array.isArray(data.answers) ? data.answers : [];
    if (!questions.length || answers.length !== questions.length || answers.some(a => a == null || a === "")) return { ok: false, reason: "all_required" };
    const reasons = data.reasons || {}; const wrongIndexes = [];
    let correct = 0;
    questions.forEach((q, i) => { if (Number(answers[i]) === Number(q.dogru_index)) correct++; else wrongIndexes.push(i); });
    if (wrongIndexes.length && wrongIndexes.some(i => !reasons[i])) return { ok: false, needsReasons: true, correct: correct, total: questions.length, answers: answers, wrongIndexes: wrongIndexes };
    questions.forEach((q, i) => {
      const isCorrect = Number(answers[i]) === Number(q.dogru_index);
      observe({ konu_id: data.konu_id || data.topicKey, pool_id: data.pool_id || data.poolId, dogru_mu: isCorrect, neden: reasons[i], kaynak: "mini_test", tarih: TODAY(), alt_beceri: q.alt_beceri });
      if (!isCorrect && reasons[i]) {
        const card = q.flashcard || { front: q.metin, back: q.cozum };
        addErrorCard({ topicKey: data.konu_id || data.topicKey, front: card.front || card.on, back: card.back || card.arka, reason: reasons[i] });
      }
    });
    const mode = data.mode || "learning";
    const result = mode === "precheck" ? { passed: false, precheck: true, returnToFirstStep: correct <= 1, ratio: questions.length ? correct / questions.length : 0, status: statusFor(getEntry(data.konu_id || data.topicKey, true)) } : validateLearningTest(data.konu_id || data.topicKey, correct, questions.length);
    result.correct = correct; result.total = questions.length;
    return { ok: true, result: result, correct: correct, total: questions.length, answers: answers, wrongIndexes: wrongIndexes };
  }

  function validateLearningTest(key, correct, total) {
    const entry = getEntry(key, true); const ratio = total ? Number(correct) / Number(total) : 0; const today = TODAY();
    entry.last_learning_test = { date: today, correct: Number(correct), total: Number(total), ratio: ratio };
    if (ratio >= 0.80 && entry.L >= 0.85) {
      const wasApproved = entry.onay_durumu === "ONAYLANDI";
      entry.onay_durumu = "ONAYLANDI"; entry.learning_test_due = null; entry.learning_test_locked_until = null;
      if (!wasApproved) createCardsOnApproval(key);
      if (entry.pool_id) loadPool(entry.pool_id).then(pool => { if (pool) createCardsOnApproval(key, pool); });
      applyGraphCredits(entry.graph_topic_id || key);
      const task = ensureStore().mini_test_kuyrugu.find(x => x.topicKey === key && x.type === "learning"); if (task) task.completed = true;
    } else {
      entry.onay_durumu = ratio < 0.80 ? "ONARIM" : "OGRENIYOR";
      if (ratio < 0.80) entry.learning_test_locked_until = addDays(today, 2);
      entry.learning_test_due = addDays(today, 2);
    }
    return { passed: ratio >= 0.80 && entry.L >= 0.85, ratio: ratio, status: statusFor(entry) };
  }
  function degradedApproval(key) {
    const s = ensureStore(); const entry = getEntry(key, false); if (!s || !entry || entry.pool_id) return false;
    if (entry.gozlem_sayisi < 5 || entry.L < 0.85) return false;
    const rows = (s.exams || []).flatMap(ex => (ex.errorLogs || []).filter(x => topicKey(x.topic, x.lesson) === key || x.topicKey === key));
    if (rows.length && rows.filter(x => x.correct === true || x.dogru_mu === true).length / rows.length < 0.60) return false;
    entry.onay_durumu = "ONAYLANDI"; createCardsOnApproval(key); return true;
  }
  function createCardsOnApproval(key, pool) {
    const s = ensureStore(); if (!s) return;
    const topic = (s.topics && s.topics[key]) || {};
    const questionCards = pool && Array.isArray(pool.sorular) ? pool.sorular.map(q => q && q.flashcard).filter(Boolean) : [];
    const sourceCards = pool && Array.isArray(pool.flashcards) ? pool.flashcards : (questionCards.length ? questionCards : (Array.isArray(topic.flashcards) ? topic.flashcards : []));
    sourceCards.slice(0, 10).forEach(function (card, i) {
      const front = card.front || card.on; const back = card.back || card.arka;
      if (!front || !back) return;
      const id = (pool ? "pool:" + (pool.konu_id || key) : "std:" + key) + ":" + i;
      if (s.flashcards.cards.some(c => c.id === id)) return;
      s.flashcards.cards.push({ id: id, topicKey: key, standard: true, front: front, back: back, due: TODAY(), unknownStreak: 0, S: 1, memory_bar: 1, review_index: 0, schedule: REVIEW_LADDER.map(day => addDays(TODAY(), day)) });
    });
  }
  function addErrorCard(card) {
    const s = ensureStore(); if (!s || !card || !card.topicKey || !card.front || !card.back) return false;
    const qualifying = ["Konuyu Bilmiyordum", "KONUEKSİKLİĞİ", "ÇÖZÜMYOLUNUBULAMADIM"];
    if (!qualifying.includes(normalizeReason(card.reason))) return false;
    const count = s.flashcards.cards.filter(c => c.topicKey === card.topicKey && c.errorCard).length;
    if (count >= 5) return false;
    s.flashcards.cards.push({ id: "err:" + Date.now() + ":" + count, topicKey: card.topicKey, errorCard: true, front: card.front, back: card.back, due: TODAY(), unknownStreak: 0, S: 1, memory_bar: 1, review_index: 0 });
    return true;
  }
  function memoryRecall(S, t) { return Math.exp(-Number(t) / Math.max(0.0001, Number(S))); }
  function dueCards() {
    const s = ensureStore(); const today = TODAY();
    return (s.flashcards.cards || []).filter(card => statusFor(getEntry(card.topicKey, false)) === "ONAYLANDI" && (!card.due || dateValue(card.due) <= dateValue(today)));
  }
  function dailyVerificationQueue() {
    const s = ensureStore(); queueLearningTests(); let seconds = 15 * 60; const tests = [];
    (s.mini_test_kuyrugu || []).filter(x => !x.completed && dateValue(x.due) <= dateValue(TODAY())).forEach(task => {
      if (seconds < 5 * 60) return; tests.push(task); seconds -= 5 * 60;
    });
    const cards = dueCards().sort((a, b) => Number(b.errorCard) - Number(a.errorCard));
    const selectedCards = cards.filter(() => { if (seconds < 30) return false; seconds -= 30; return true; });
    return { tests: tests, cards: selectedCards, remainingSeconds: seconds };
  }
  function flashcardReview(cardId, rating) {
    const s = ensureStore(); const card = s && s.flashcards.cards.find(c => c.id === cardId);
    if (!card) return { ok: false };
    if (statusFor(getEntry(card.topicKey, false)) !== "ONAYLANDI") return { ok: false, reason: "approval" };
    const key = card.topicKey; const entry = getEntry(key, true); const today = TODAY();
    const value = rating === true ? "Bildi" : rating === false ? "Bilemedi" : String(rating || "Bilemedi");
    if (!["Bildi", "Zorlandım", "Bilemedi"].includes(value)) return { ok: false, reason: "rating" };
    const session = s.flashcards.sessions[key + ":" + today] ||= { date: today, cardIds: [], outcomes: {}, complete: false };
    if (!session.cardIds.includes(cardId)) session.cardIds.push(cardId);
    card.S = Number(card.S) || 1; card.last = today;
    if (value === "Bildi") {
      card.S *= 1.6; card.memory_bar = 1; card.unknownStreak = 0; entry.flashcard_bilemedi_ardisik = 0;
      card.review_index = Math.min(REVIEW_LADDER.length - 1, (card.review_index || 0) + 1);
      card.due = card.schedule && card.schedule[card.review_index] ? card.schedule[card.review_index] : addDays(today, 1);
    } else if (value === "Zorlandım") {
      card.S *= 1.2; card.memory_bar = 1; card.unknownStreak = 0; entry.flashcard_bilemedi_ardisik = 0;
      card.review_index = Math.min(REVIEW_LADDER.length - 1, (card.review_index || 0) + 1);
      card.due = card.schedule && card.schedule[card.review_index] ? card.schedule[card.review_index] : addDays(today, 1);
    } else {
      card.unknownStreak = (card.unknownStreak || 0) + 1; card.due = addDays(today, 1);
      entry.flashcard_bilemedi_ardisik = (entry.flashcard_bilemedi_ardisik || 0) + 1;
      if (entry.flashcard_bilemedi_ardisik >= 2 && s.flashcards.lastSoftDrop[key] !== today) {
        entry.L = clamp(entry.L * 0.8, 0.01, 0.99); entry.son_hafiza_dususu = today; s.flashcards.lastSoftDrop[key] = today;
        if (entry.onay_durumu === "ONAYLANDI") entry.onay_durumu = "RISKLI";
      }
    }
    session.outcomes[cardId] = value;
    const positive = Object.values(session.outcomes).filter(x => x === "Bildi" || x === "Zorlandım").length;
    session.complete = session.cardIds.length > 0 && positive / session.cardIds.length >= 0.70;
    return { ok: true, rating: value, status: statusFor(entry), L: entry.L, S: card.S, R: memoryRecall(card.S, 0), complete: session.complete };
  }

  const API = window.AnalizBKT = {
    PARAM: PARAM,
    SOURCE_PT: SOURCE_PT,
    WRONG_WEIGHT: WRONG_WEIGHT,
    EMPTY_REASONS: EMPTY_REASONS,
    STATUS_TEXT: STATUS_TEXT,
    normalizeReason: normalizeReason,
    validateParameters: validateParameters,
    initializeMotor: initializeMotor,
    observe: observe,
    migrateExisting: migrateExisting,
    processNewRecords: processNewRecords,
    syncDeletedRecords: syncDeletedRecords,
    loadGraph: loadGraph,
    validateGraphData: validateGraphData,
    applyGraphCredits: applyGraphCredits,
    loadPoolManifest: loadPoolManifest,
    listPools: function () { return poolManifest ? poolManifest.havuzlar.slice() : []; },
    rootCause: rootCause,
    applyRootPriority: applyRootPriority,
    clearRootPriority: clearRootPriority,
    clearRootPrioritiesForTarget: clearRootPrioritiesForTarget,
    applyMemorySignal: applyMemorySignal,
    memoryRecall: memoryRecall,
    dueCards: dueCards,
    dailyVerificationQueue: dailyVerificationQueue,
    selectPoolQuestions: selectPoolQuestions,
    scheduleLearningTest: scheduleLearningTest,
    queueLearningTests: queueLearningTests,
    validatePool: validatePool,
    loadPool: loadPool,
    openMiniTest: openMiniTest,
    submitMiniTest: submitMiniTest,
    validateLearningTest: validateLearningTest,
    addErrorCard: addErrorCard,
    flashcardReview: flashcardReview,
    getState: ensureStore,
    statusFor: statusFor
  };

  function focusLabel(entry) {
    const counts = {};
    (entry && entry.hata_gecmisi || []).forEach(row => {
      if (!row || !row.alt_beceri || (row.date && daysBetween(row.date, TODAY()) > 30)) return;
      counts[row.alt_beceri] = (counts[row.alt_beceri] || 0) + 1;
    });
    return Object.keys(counts).find(label => counts[label] >= 2) || "";
  }
  function renderBktPanel() {
    const s = ensureStore(); const host = document.getElementById("main-content");
    if (!s || !host || !s.user || !s.user.name) return;
    queueLearningTests();
    const entries = Object.keys(s.bkt_state).map(key => ({ key: key, entry: s.bkt_state[key] }))
      .sort((a, b) => (statusFor(a.entry) === "ONAYLANDI" ? 1 : 0) - (statusFor(b.entry) === "ONAYLANDI" ? 1 : 0) || b.entry.gozlem_sayisi - a.entry.gozlem_sayisi).slice(0, 12);
    let panel = document.getElementById("bkt-learning-panel");
    if (!entries.length) { if (panel) panel.remove(); return; }
    if (!panel) { panel = document.createElement("section"); panel.id = "bkt-learning-panel"; panel.className = "card"; host.appendChild(panel); }
    let html = '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px;"><div><h3 style="margin:0;font-size:16px;">Öğrenme Durumu</h3><div class="text-xs text-muted">Konuların yeterlilik ve tekrar göstergeleri</div></div></div><div style="display:grid;gap:7px;">';
    entries.forEach(function (row) {
      const e = row.entry; const status = statusFor(e); const known = e.gozlem_sayisi >= 5; const percent = Math.round(e.L * 100);
      const cards = (s.flashcards.cards || []).filter(c => c.topicKey === row.key); const memory = cards.length ? Math.round(cards.reduce((sum, c) => sum + Number(c.memory_bar == null ? 1 : c.memory_bar), 0) / cards.length * 100) : 0;
      html += '<div style="border:1px solid var(--border-card);border-radius:10px;padding:9px 10px;"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;"><strong style="font-size:12.5px;">' + safeText(row.key) + '</strong><span class="text-xs" style="color:var(--brand-blue);font-weight:700;">' + safeText(STATUS_TEXT[status] || "Gelişiyor") + '</span></div>';
      if (known) html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;"><div><div class="text-xs">Yeterlilik: <b>' + percent + '%</b></div><div style="height:5px;background:var(--bg-canvas);border-radius:99px;overflow:hidden;"><div style="height:100%;width:' + percent + '%;background:var(--brand-blue);border-radius:99px;"></div></div></div><div><div class="text-xs">Hafıza: <b>' + memory + '%</b></div><div style="height:5px;background:var(--bg-canvas);border-radius:99px;overflow:hidden;"><div style="height:100%;width:' + memory + '%;background:var(--memory-indigo);border-radius:99px;"></div></div></div></div>';
      else html += '<div class="text-xs text-muted" style="margin-top:5px;">Birkaç soru daha çöz, seviyen netleşsin · ' + e.gozlem_sayisi + ' soru</div>';
      const label = focusLabel(e); if (label) html += '<div class="text-xs" style="margin-top:6px;color:var(--brand-blue);">Hataların şurada yoğunlaşıyor: ' + safeText(label) + '</div>';
      const cause = e.graph_topic_id ? rootCause(e.graph_topic_id, e.hata_gecmisi || []) : null;
      if (cause && !cause.stay) html += '<div class="text-xs" style="margin-top:6px;color:var(--brand-blue);">Önce şunu sağlamlaştır: ' + safeText(cause.topicName) + '</div>';
      const poolId = e.pool_id || e.soru_havuzu_id || resolvePoolId(row.key);
      const precheck = e.precheck_due && dateValue(e.precheck_due) <= dateValue(TODAY());
      const task = s.mini_test_kuyrugu.find(x => x.topicKey === row.key && x.type === "learning" && !x.completed);
      if (poolId && precheck) html += '<button type="button" class="btn btn-sm btn-ghost bkt-control" data-bkt-test="' + safeText(row.key) + '" data-bkt-pool="' + safeText(poolId) + '" data-bkt-mode="precheck" style="margin-top:7px;min-width:48px;min-height:48px;">Kısa Kontrol — 3 soru</button>';
      else if (poolId && task) html += '<button type="button" class="btn btn-sm btn-ghost bkt-control" data-bkt-test="' + safeText(row.key) + '" data-bkt-pool="' + safeText(poolId) + '" data-bkt-mode="learning" style="margin-top:7px;min-width:48px;min-height:48px;">Öğrenme Testi — 5 soru</button>';
      html += '</div>';
    });
    html += '</div>';
    const verificationQueue = dailyVerificationQueue();
    const cards = verificationQueue.cards;
    if (cards.length) {
      const card = cards[0];
      html += '<div style="border-top:1px solid var(--border-card);margin-top:12px;padding-top:10px;"><div class="text-xs text-muted" style="margin-bottom:5px;">Tekrar Kartı</div><div style="font-weight:700;font-size:13px;margin-bottom:8px;">' + safeText(card.front) + '</div><div style="display:flex;gap:7px;flex-wrap:wrap;"><button class="btn btn-sm btn-ghost bkt-control" data-bkt-card="' + safeText(card.id) + '" data-bkt-rating="Bildi" style="min-width:48px;min-height:48px;">Bildi</button><button class="btn btn-sm btn-ghost bkt-control" data-bkt-card="' + safeText(card.id) + '" data-bkt-rating="Zorlandım" style="min-width:48px;min-height:48px;">Zorlandım</button><button class="btn btn-sm btn-primary bkt-control" data-bkt-card="' + safeText(card.id) + '" data-bkt-rating="Bilemedi" style="min-width:48px;min-height:48px;">Bilemedi</button></div></div>';
    }
    panel.innerHTML = html;
    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  function scheduleUi() { clearTimeout(uiTimer); uiTimer = setTimeout(renderBktPanel, 80); }
  function install() {
    if (saveWrapped) return;
    saveWrapped = true;
    initializeMotor(PARAM);
    const original = window.saveState;
    if (typeof original === "function") {
      window.saveState = function () {
        processNewRecords();
        const result = original.apply(this, arguments);
        scheduleUi();
        return result;
      };
    }
    if (!completeTopicWrapped && typeof window.completeTopic === "function") {
      completeTopicWrapped = true; const originalComplete = window.completeTopic;
      window.completeTopic = function (key) { const result = originalComplete.apply(this, arguments); const entry = getEntry(key, true); entry.study_completed_at = TODAY(); entry.precheck_due = TODAY(); scheduleLearningTest(key, TODAY()); if (typeof saveState === "function") saveState(); return result; };
    }
    const host = document.getElementById("main-content");
    if (host && window.MutationObserver) { uiObserver = new MutationObserver(scheduleUi); uiObserver.observe(host, { childList: true }); }
    document.addEventListener("change", function (event) {
      if (event.target.matches && event.target.matches("#bkt-test-modal input[type=radio]")) { const modal = document.getElementById("bkt-test-modal"); persistMiniSession(modal); updateMiniSubmitState(modal); }
    });
    document.addEventListener("click", function (event) {
      const testButton = event.target.closest("[data-bkt-test]");
      if (testButton) { openMiniTest(testButton.dataset.bktTest, testButton.dataset.bktPool, { mode: testButton.dataset.bktMode || "learning" }); return; }
      if (event.target.closest("[data-bkt-close-test]")) { closeMiniTest(); return; }
      if (event.target.closest("[data-bkt-submit-test]")) { const modal = document.getElementById("bkt-test-modal"); if (modal) finishMiniTest(modal); return; }
      if (event.target.closest("[data-bkt-finalize-test]")) { const modal = document.getElementById("bkt-test-modal"); if (modal) completeMiniTestReasons(modal); return; }
      const button = event.target.closest("[data-bkt-card]"); if (!button) return;
      flashcardReview(button.dataset.bktCard, button.dataset.bktRating || "Bilemedi");
      if (typeof saveState === "function") saveState(); scheduleUi();
    });
    loadPoolManifest().then(function () { Object.keys((ensureStore() || {}).bkt_state || {}).forEach(key => { const e = getEntry(key, false); const poolId = e && (e.pool_id || resolvePoolId(key)); if (e && poolId) { e.pool_id = poolId; if (e.onay_durumu === "ONAYLANDI") loadPool(poolId).then(pool => pool && createCardsOnApproval(key, pool)); } }); queueLearningTests(); scheduleUi(); });
    processNewRecords(); loadGraph(); scheduleUi();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
})();
