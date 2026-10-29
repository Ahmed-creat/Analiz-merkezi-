/* ============================================================
   BKT MOTORU — site/bkt-engine.js   (TEK KAYNAK, v35.7)
   ------------------------------------------------------------
   Ders/konu bazlı yeterlilik (BKT), tekrar kartları, ilişki grafı,
   soru havuzundan mini test.

   v35.7'de YAPILANLAR (kullanıcı bildirimleri):
     1) Kısa Kontrol = 5 soru, sorular TEK TEK gösterilir.
        (Bu dosya artık tek motor: index.html içindeki kopya, fazladan
        bir parantez yüzünden HİÇ çalışmıyordu; o yüzden eski motorun
        tek-sayfa listesi görünüyordu.)
     2) Havuz eşleme KESİN: yalnız çalışılan konunun havuzu açılır.
        Benzer başlık / aynı dersin başka havuzu / tahmini eşleme YOK.
     3) Sonuç ekranı kendiliğinden kapanmaz ("Kapat" ile çıkılır).

   Tarayıcı: <script src="bkt-engine.js" defer></script>
   Test   : tests/bkt-engine.test.js, tests/bkt-panel.test.js,
            tests/kisa-kontrol.test.js, tests/kaynak-sozdizimi.test.js
   ============================================================ */
(function () {
  "use strict";

  const PARAM = Object.freeze({ P_L0: 0.12, P_G: 0.25, P_S: 0.10 });
  const SOURCE_PT = Object.freeze({ deneme: 0.05, soru_girisi: 0.15, mini_test: 0.10 });
  // v35.8 — "Süre yetmedi" SEÇENEĞİ TAMAMEN KALDIRILDI; yanlış ve boş için
  // HATA NEDENLERİ AYRI listelenir (kullanıcı isteği).
  const WRONG_WEIGHT = Object.freeze({
    "KONUEKSİKLİĞİ": 1.0,
    "ANLAMADIM": 0.5,
    "ÇÖZÜMYOLUNUBULAMADIM": 0.5,
    "İşlem Hatası/Dikkatsizlik": 0.2,
    "Kodlama/Kitapçık Hatası": null
  });
  // Yanlış cevap nedenleri (5)
  const WRONG_REASONS = Object.freeze([
    "KONUEKSİKLİĞİ", "ANLAMADIM", "ÇÖZÜMYOLUNUBULAMADIM",
    "İşlem Hatası/Dikkatsizlik", "Kodlama/Kitapçık Hatası"
  ]);
  // Boş bırakma nedenleri (3) — işlem/kitapçık hatası boşta anlamsız.
  const EMPTY_REASONS = Object.freeze(["KONUEKSİKLİĞİ", "ANLAMADIM", "ÇÖZÜMYOLUNUBULAMADIM"]);
  const REASON_LABELS = Object.freeze({
    "KONUEKSİKLİĞİ": "Konu eksiği — bilmiyordum",
    "ANLAMADIM": "Anlamadım",
    "ÇÖZÜMYOLUNUBULAMADIM": "Çözüm yolunu bulamadım",
    "İşlem Hatası/Dikkatsizlik": "İşlem hatası / dikkatsizlik",
    "Kodlama/Kitapçık Hatası": "Kodlama / kitapçık hatası"
  });
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
    // Eski kayıtlarda kalmış "süre yetmedi" değeri ARTIK SEÇENEK DEĞİL;
    // yalnız eski veriyi okunur göstermek için tanınır (ağırlığı yok → motor
    // bu nedeni gözlem saymaz, yanlış da olsa puanı düşürmez).
    "SÜRE YETMEDİ": "SUREYETMEDI",
    "SÜREYETMEDİ": "SUREYETMEDI",
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
      "ANLAMADIM": "Anlamadım",
      "ÇÖZÜMYOLUNUBULAMADIM": "Çözüm yolunu bulamadım",
      "SUREYETMEDI": "Süre yetmedi (eski kayıt)"
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

  // Uzun kazanım cümleleri paneli boğmasın: başlık kısalır, tamamı tooltip'te
  function kisaKonu(key) {
    const metin = String(key == null ? "" : key);
    const p = metin.indexOf(" > ");
    if (p < 0) return metin.length > 62 ? metin.slice(0, 59).trim() + "…" : metin;
    const ders = metin.slice(0, p), konu = metin.slice(p + 3);
    return ders + " > " + (konu.length > 54 ? konu.slice(0, 51).trim() + "…" : konu);
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
      // v36: 100 kayıt × 339 konu bulutu ve localStorage'ı taşırıyordu.
      if (entry.hata_gecmisi.length > 40) entry.hata_gecmisi.shift();
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
      // İsteğe bağlı görsel: varsa tanımı geçerli olmalı (yoksa soru görselsiz
      // kalırdı — sessiz kayıp). gorsel.js → window.GV
      if (q.gorsel && window.GV && typeof window.GV.dogrula === "function") {
        const g = window.GV.dogrula(q.gorsel);
        if (g.length) errors.push("görsel:" + i + " (" + g.join(",") + ")");
      }
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
      // Profil penceresi için havuz özeti (app-pwa.js okur)
      try {
        window.__havuzBilgi = {
          havuz: poolManifest.havuzlar.length || (data && data.havuz_sayisi) || 0,
          soru: (data && data.soru_sayisi) || poolManifest.havuzlar.reduce((a, h) => a + (Number(h.soru_sayisi) || 0), 0)
        };
        const pm = document.getElementById("pwa-profile-modal");
        if (pm && pm.style.display === "flex" && typeof window.__profilTaze === "function") window.__profilTaze();
      } catch (e) {}
    }).catch(() => { poolManifest = { havuzlar: [] }; return poolManifest; }).then(function (pm) {
      // Manifest geç gelirse Bilgi Bankası havuzsuz çizilmiş olur: düğme yok.
      // Yüklendikten sonra o sayfadaysak yeniden çiz.
      try {
        if (typeof currentPage !== "undefined" && currentPage === "knowledge") {
          const host = document.getElementById("main-content");
          if (host) { renderKnowledge(host); if (window.lucide && lucide.createIcons) lucide.createIcons(); }
        }
      } catch (e) { /* */ }
      return pm;
    });
    return poolManifestPromise;
  }
  // ---- HAVUZ EŞLEME: YALNIZ ÇALIŞILAN KONU -------------------------
  // Kullanıcı şikâyeti: "Bir konuyu çalışıyorum, testte başka konuların
  // soruları çıkıyor." Eski çözücü, aynı DERSTEKİ herhangi bir havuzu
  // başlık benzerliğiyle bağlıyor, eşleşme bulamayınca aynı dersin
  // havuzuna düşüyordu (havuz-bul.js'in kelime kapsama / etiket
  // adımları). Artık yalnız BİREBİR eşleşme kabul edilir; tutmazsa
  // null döner ve test açılmaz — başka konunun sorusu GÖSTERİLMEZ.
  //   1) topic_key birebir aynı
  //   2) aynı ders + konu başlığı birebir aynı (başlık yoksa topic_key'den türetilir)
  function sadeles(x) {
    return String(x == null ? "" : x).toLocaleLowerCase("tr-TR")
      .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g")
      .replace(/ç/g, "c").replace(/ö/g, "o").replace(/ü/g, "u")
      .replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u")
      .replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function konuParcasi(topicKey) {
    const t = String(topicKey == null ? "" : topicKey);
    const p = t.indexOf(" > ");
    return p >= 0 ? t.slice(p + 3) : t;
  }
  function dersParcasi(topicKey) {
    const t = String(topicKey == null ? "" : topicKey);
    const p = t.indexOf(" > ");
    return p >= 0 ? t.slice(0, p) : "";
  }
  function havuzBasligi(h) {
    if (!h) return "";
    if (h.baslik) return String(h.baslik);
    return konuParcasi(h.topic_key);
  }
  // v39 — ELLE DOĞRULANMIŞ EK EŞLEME (konu → havuz kimliği)
  // Yalnız "havuz GERÇEKTEN bu konunun sorularını içeriyor" diye tek tek
  // kontrol edilmiş satırlar burada. Uydurma eşleme yok; başka konunun
  // sorusu gösterilmez. Gerekçe her satırın yanında yazılı.
  const EK_ESLEME = Object.freeze({
    // Havuzun başlığı "Besinlerin Hücresel Solunuma Katılma Yolları";
    // konudaki tek fark "hücresel" kelimesi (4/4 anahtar kelime aynı).
    "Biyoloji > 1.8 Besinlerin Solunuma Katılma Yolları": "biyo_10_u01_k05",
    // Havuzun etiketleri: "Komünitede Tür İçi ve Türler Arası Etkileşimler",
    // "Popülasyon Dinamikleri", "Süksesyon" — konunun tam karşılığı.
    "Biyoloji > 2.2 Komünitelerde ve Popülasyonlarda Görülen Etkileşimler ve Değişimler": "biyo_10_u02_k02",
    // Havuz etiketi: "Ekolojik Sürdürülebilirliği Kısıtlayan/Engelleyen Durumlar".
    "Biyoloji > 2.6 Ekolojik Sürdürülebilirliği Kısıtlayan Durumlar": "biyo_10_u02_k04",
    // Havuz soruları afet direnci/afet bilinci üzerine (4/5 anahtar kelime).
    "Coğrafya > 6.2 Afetlere Karşİ Dirençli Yaşam Alanları": "cogr_10_u06_k01",
    "Coğrafya > 6.3 Afetlerden Korunma": "cogr_10_u06_k01"
  });
  // Saf fonksiyon: verilen havuz listesinde YALNIZ bu konunun havuzunu arar.
  function havuzEsle(topicKey, havuzlar) {
    const liste = Array.isArray(havuzlar) ? havuzlar : [];
    const ham = String(topicKey == null ? "" : topicKey);
    if (!ham || ham === "undefined" || ham === "null" || !liste.length) return null;
    for (let i = 0; i < liste.length; i++) {
      if (liste[i] && String(liste[i].topic_key) === ham) return liste[i];
    }
    const ders = sadeles(dersParcasi(ham));
    const konu = konuParcasi(ham);
    const ayniDers = liste.filter(h => h && (!ders || sadeles(h.ders) === ders));
    for (let i = 0; i < ayniDers.length; i++) {
      if (sadeles(havuzBasligi(ayniDers[i])) === sadeles(konu)) return ayniDers[i];
    }
    // v39 — KÖK NEDEN ("neden konuların soru havuzu yok sorunu geliyor"):
    // Burada YALNIZ iki kural vardı (topic_key birebir / başlık birebir).
    // Oysa havuz manifestinde çoğu havuzun `baslik` alanı yok ve bir havuz
    // birden çok alt konuyu kapsıyor (ör. tarih_10_u02_k01 hem 2.1, 2.2, 2.4;
    // biyo_10_u02_k04 hem atık yönetimi hem ekolojik sürdürülebilirlik).
    // Bu konular havuzu OLDUĞU HÂLDE "havuz yok" görünüyordu.
    // Çözüm: site/havuz-bul.js (HB) tek kaynak — numara/etiket kuralları
    // orada ve yalnız TEK eşleşme kabul edilir. Ayrıca elle doğrulanmış
    // konu→havuz tablosu (EK_ESLEME) son adım olarak denenir.
    try {
      if (typeof window !== "undefined" && window.HB && typeof window.HB.bul === "function") {
        // SINIF KİLİDİ: havuz manifesti 10. sınıf. 9. sınıf konusu asla
        // 10. sınıf havuzuna bağlanmaz (eski hata: "1.4 Kur'an'dan Mesajlar"
        // 10. sınıfın havuzuna düşüyordu). Yalnız öğrencinin sınıfıyla
        // aynı `sinif` etiketli havuzlar arasında aranır.
        let sinif = "";
        try { const st = ensureStore(); sinif = String((st && st.user && st.user.grade) || ""); } catch (e2) { sinif = ""; }
        const uygun = sinif ? liste.filter(function (h) { return h && String(h.sinif || "") === sinif; }) : [];
        const hb = uygun.length ? window.HB.bul(ham, uygun) : null;
        if (hb && hb.konu_id) return hb;
      }
    } catch (e) { /* HB yoksa aşağıdaki elle eşlemeye düşer */ }
    if (EK_ESLEME[ham]) {
      const secili = liste.find(function (h) { return h && String(h.konu_id) === EK_ESLEME[ham]; });
      if (secili) return secili;
    }
    // Başka konu/ders/sınıfın sorusu yine GÖSTERİLMEZ: eşleşme yoksa null.
    return null;
  }
  function resolvePoolId(topicKey) {
    if (!poolManifest || !Array.isArray(poolManifest.havuzlar)) return null;
    const h = havuzEsle(topicKey, poolManifest.havuzlar);
    return h && h.konu_id ? h.konu_id : null;
  }
  // Kayıtlı (eski sürümden kalmış olabilecek) havuz kimliği bu konuya
  // gerçekten ait mi? Manifest yüklü değilse karar veremeyiz → geçici kabul.
  function havuzDogrula(topicKey, id) {
    if (!id) return false;
    if (!poolManifest || !Array.isArray(poolManifest.havuzlar) || !poolManifest.havuzlar.length) return true;
    const h = poolManifest.havuzlar.find(p => p && String(p.konu_id) === String(id));
    if (!h) return false;
    return !!havuzEsle(topicKey, [h]);
  }
  // Bilgi Bankası (IIFE dışı) bu köprüyü kullanır — bkz. havuzIdCoz().
  // İkinci argüman: kayıtta yazılı (doğrulanacak) havuz kimliği.
  window.__havuzIdCoz = function (topicKey, kayitli) {
    const kesin = resolvePoolId(topicKey);
    if (kesin) return kesin;
    if (kayitli && havuzDogrula(topicKey, kayitli)) return String(kayitli);
    return null;
  };
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
    // v35.6 — GÖRSELLİ SORULAR ÖNE: havuzda görsel (şema/grafik/vektör/üçgen) olan
    // sorular hiç gösterilmiyordu ("hangi sorulara görsel eklendi, hiç görmedim").
    // Hiç gösterilmemiş görselli soru, hiç gösterilmemiş diğerlerinden önce gelir;
    // bir kez gösterildikten sonra tekrar 28 gün kuralına döner.
    const gorunmemis = (row) => !row.log;
    source.sort((a, b) => {
      const ga = gorunmemis(a) && a.q && a.q.gorsel ? 1 : 0;
      const gb = gorunmemis(b) && b.q && b.q.gorsel ? 1 : 0;
      if (ga !== gb) return gb - ga;
      return dateValue(a.log && a.log.son_gosterim_tarihi) - dateValue(b.log && b.log.son_gosterim_tarihi);
    });
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
  // v35.7 — YALNIZ BU KONUNUN HAVUZU.
  // Eski hâli "düğmenin kimliği → çözülen kimlik → anahtarın kendisi"
  // sırasıyla deniyordu; kayıtlı kimlik eski sürümden YANLIŞ kalmışsa
  // başka konunun soruları açılıyordu. Artık sıra: (1) bu konunun
  // birebir havuzu, (2) çağıranın verdiği VE doğrulanmış kimlik.
  // Hiçbiri yoksa null → test açılmaz, uyarı gösterilir.
  function havuzuBul(topicKey, poolId) {
    const adaylar = [];
    const ekle = id => { id = String(id == null ? "" : id); if (id && id !== "undefined" && id !== "null" && adaylar.indexOf(id) < 0) adaylar.push(id); };
    ekle(resolvePoolId(topicKey));
    if (poolId && havuzDogrula(topicKey, poolId)) ekle(poolId);
    return adaylar.reduce(function (zincir, id) {
      return zincir.then(function (bulunan) { return bulunan || loadPool(id); });
    }, Promise.resolve(null));
  }
  // Kısa Kontrol / Öğrenme Testi — v35.6
  //  • Her iki modda 5 soru — precheck modunda da 5 (eski sürümde daha azdı)
  //  • Sorular TEK TEK, sırayla gösterilir (hepsi alt alta değil)
  //  • Havuzda görsel varsa (q.gorsel) sorunun içinde çizilir (gorsel.js → GV)
  const MINI_SORU = 5;
  // Kısa Kontrol aynı konu için bu kadar gün içinde yeniden açılmaz.
  const KISA_ARALIK_GUN = 3;
  function miniBaslik(mode) { return mode === "precheck" ? "Kısa Kontrol" : "Öğrenme Testi"; }
  // v35.8 — SONUÇ EKRANI SORUYU DA GÖSTERİR (yalnız "cevap" değil):
  // soru metni + varsa şekil + tüm şıklar (senin cevabın / doğru cevap) + çözüm.
  function miniSoruTam(q, cevap) {
    if (!q) return "";
    const dogru = Number(q.dogru_index);
    const verilen = (cevap == null || String(cevap) === "") ? null : Number(cevap);
    let h = miniGorsel(q);
    h += '<div style="font-weight:700;font-size:13px;line-height:1.5;margin:4px 0 8px;">' + safeText(q.metin) + '</div><div style="display:grid;gap:5px;">';
    (q.secenekler || []).forEach(function (sec, j) {
      const buDogru = j === dogru;
      const buBenim = verilen !== null && j === verilen;
      const kenar = buDogru ? "var(--semantic-success)" : (buBenim ? "var(--semantic-error)" : "var(--border-card)");
      const zemin = buDogru ? "rgba(22,163,74,.08)" : (buBenim ? "rgba(239,68,68,.07)" : "transparent");
      h += '<div style="border:1.2px solid ' + kenar + ';background:' + zemin + ';border-radius:9px;padding:7px 9px;font-size:12.5px;line-height:1.45;">' +
        '<b style="margin-right:6px;">' + ("ABCDE".charAt(j) || (j + 1)) + ')</b>' + safeText(sec) +
        (buDogru ? ' <b style="color:var(--semantic-success);">✓ doğru cevap</b>' : "") +
        (buBenim ? ' <b style="color:var(--semantic-error);">← senin cevabın</b>' : "") + "</div>";
    });
    if (verilen === null) h += '<div class="text-xs text-muted">Bu soruyu <b>boş bıraktın</b>.</div>';
    h += "</div>";
    return h;
  }
  function miniGorsel(q) {
    try {
      if (q && q.gorsel && window.GV && typeof window.GV.html === "function") return window.GV.html(q.gorsel, 320);
    } catch (e) { /* görsel çizilemezse soru yine görünür */ }
    return "";
  }
  function cizMiniSoru(modal) {
    const qs = modal._bktQuestions || [];
    const i = Number(modal._bktIdx) || 0;
    const q = qs[i] || { metin: "", secenekler: [] };
    if (!Array.isArray(modal._bktAnswers)) modal._bktAnswers = [];
    const cevap = modal._bktAnswers[i];
    const sonuncu = i >= qs.length - 1;
    const oran = qs.length ? Math.round(((i + 1) / qs.length) * 100) : 0;
    const seciliMi = (j) => String(cevap == null ? "" : cevap) === String(j);
    let h = '<div style="width:100%;max-width:600px;max-height:92vh;overflow:auto;background:var(--bg-card,#fff);color:var(--text-main,#16213A);border-radius:16px;padding:18px;">';
    h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px;">' +
      '<div><div style="font-weight:800;font-size:15px;">' + miniBaslik(modal._bktMode) + '</div>' +
      '<div class="text-xs text-muted">Soru ' + (i + 1) + ' / ' + qs.length + (modal._bktKonuAdi ? " · " + safeText(modal._bktKonuAdi) : "") + '</div></div>' +
      '<button type="button" data-bkt-close-test style="min-width:48px;min-height:48px;border:0;background:none;color:inherit;font-size:22px;cursor:pointer;">×</button></div>';
    h += '<div style="height:7px;border-radius:999px;background:var(--bg-canvas,#EEF2F9);overflow:hidden;margin-bottom:14px;"><div style="height:100%;width:' + oran + '%;background:var(--brand-blue,#2563EB);transition:width .18s;"></div></div>';
    h += miniGorsel(q);
    h += '<div style="font-weight:700;font-size:15px;line-height:1.5;margin:2px 0 12px;">' + safeText(q.metin) + '</div>';
    (q.secenekler || []).forEach(function (secenek, j) {
      const sec = seciliMi(j);
      h += '<label style="display:flex;gap:10px;align-items:flex-start;border:1.5px solid ' + (sec ? "var(--brand-blue,#2563EB)" : "var(--border-card,#E3E9F4)") + ';background:' + (sec ? "rgba(37,99,235,.07)" : "transparent") + ';border-radius:12px;padding:12px;margin-bottom:9px;font-size:13.5px;line-height:1.45;min-height:52px;cursor:pointer;">' +
        '<input type="radio" name="bkt-q" value="' + j + '" data-bkt-secim="' + j + '"' + (sec ? " checked" : "") + ' style="margin-top:2px;width:18px;height:18px;flex:0 0 auto;">' +
        '<span><b style="margin-right:6px;">' + ("ABCDE".charAt(j) || (j + 1)) + ')</b>' + safeText(secenek) + '</span></label>';
    });
    h += '<div style="display:flex;gap:8px;margin-top:6px;">';
    if (i > 0) h += '<button type="button" class="btn btn-ghost" data-bkt-prev style="flex:0 0 auto;min-height:48px;">Geri</button>';
    const bos = (cevap == null || cevap === "");
    // v35.8 — BOŞ BIRAKMAK SERBEST: düğme artık kilitlenmiyor.
    h += '<button type="button" class="btn btn-primary" data-bkt-next style="flex:1;min-height:48px;">' + (sonuncu ? "Testi Bitir" : "İleri") + '</button></div>';
    h += '<div class="text-xs text-muted" style="margin-top:8px;line-height:1.45;">' +
      (bos ? 'İstersen boş bırakıp geçebilirsin — sonuçta "boş" olarak sayılır ve boş için ayrı neden sorulur.'
           : 'Cevabını değiştirebilirsin.') + '</div>';
    // v41 — KULLANICI: "öğrenci soruda hata var ise soru hatalı mı? ya tıklar,
    // bize şu soru hatalı mesajı gelir." Her sorunun altında bu düğme var.
    h += '<button type="button" class="btn btn-ghost w-full" data-bkt-sikayet="' + i + '" style="margin-top:6px;min-height:38px;font-size:11.5px;opacity:.85;">⚠ Bu soruda hata var</button>';
    h += '<div id="bkt-test-message" class="text-xs" style="min-height:18px;margin-top:8px;"></div></div>';
    modal.innerHTML = h;
  }
  function miniSonraki(modal) {
    const qs = modal._bktQuestions || [];
    const i = Number(modal._bktIdx) || 0;
    const cevap = (modal._bktAnswers || [])[i];
    // v35.8 — Boş bırakmak serbest: cevapsız da ilerlenir (boş olarak sayılır).
    if (cevap == null || cevap === "") { modal._bktAnswers[i] = ""; }
    persistMiniSession(modal);
    if (i >= qs.length - 1) { finishMiniTest(modal); return; }
    modal._bktIdx = i + 1;
    cizMiniSoru(modal);
  }
  function miniOnceki(modal) {
    const i = Number(modal._bktIdx) || 0;
    if (i <= 0) return;
    persistMiniSession(modal);
    modal._bktIdx = i - 1;
    cizMiniSoru(modal);
  }
  function openMiniTest(topicKey, poolId, options) {
    const opts = options || {}; const mode = opts.mode || "learning";
    havuzuBul(topicKey, poolId).then(function (pool) {
      if (!pool) return typeof toast === "function" && toast("Bu konu için soru havuzu bulunamadı — başka konunun soruları gösterilmez.", "warning");
      // Son güvenlik kapısı: yüklenen havuz bu konunun birebir havuzu mu?
      const kesin = resolvePoolId(topicKey);
      if (kesin && pool.konu_id && String(pool.konu_id) !== String(kesin)) {
        return typeof toast === "function" && toast("Bu konunun havuzu bulunamadı — başka konunun soruları gösterilmez.", "warning");
      }
      if (!Array.isArray(pool.sorular) || !pool.sorular.length) return typeof toast === "function" && toast("Havuz açıldı ama içinde soru yok.", "error");
      const actualPoolId = pool.konu_id || poolId;
      const count = Math.min(MINI_SORU, pool.sorular.length);
      const stored = (ensureStore().mini_test_sessions || {})[topicKey];
      const storedQuestions = stored && !stored.complete && stored.mode === mode && Array.isArray(stored.questionIds)
        ? stored.questionIds.map(id => pool.sorular.find(q => q.soru_id === id)).filter(Boolean) : [];
      const questions = opts.questions || (storedQuestions.length === count ? storedQuestions : selectPoolQuestions(pool, actualPoolId, count));
      let modal = document.getElementById("bkt-test-modal");
      if (!modal) {
        modal = document.createElement("div"); modal.id = "bkt-test-modal";
        modal.style.cssText = "position:fixed;inset:0;z-index:10001;display:flex;align-items:center;justify-content:center;background:rgba(10,16,32,.62);padding:14px;";
        document.body.appendChild(modal);
      }
      modal._bktQuestions = questions;
      modal._bktTopicKey = topicKey;
      modal._bktPoolId = actualPoolId;
      modal._bktMode = mode;
      modal._bktIdx = 0;
      const parca = String(topicKey || "").split(" > ");
      modal._bktKonuAdi = parca.length > 1 ? parca.slice(1).join(" > ") : String(topicKey || "");
      // Daha önce yarım bırakılan cevaplar korunur
      const onceki = (ensureStore().mini_test_sessions || {})[topicKey];
      modal._bktAnswers = new Array(questions.length).fill("");
      if (onceki && !onceki.complete && Array.isArray(onceki.answers) && onceki.answers.length === questions.length) {
        onceki.answers.forEach((a, k) => { modal._bktAnswers[k] = a; });
      }
      modal.style.display = "flex";
      cizMiniSoru(modal);
      persistMiniSession(modal);
    });
  }
  function persistMiniSession(modal) {
    const s = ensureStore(); if (!s || !modal) return;
    if (!Array.isArray(modal._bktAnswers)) modal._bktAnswers = [];
    s.mini_test_sessions[modal._bktTopicKey] = {
      topicKey: modal._bktTopicKey, poolId: modal._bktPoolId, mode: modal._bktMode,
      questionIds: (modal._bktQuestions || []).map(q => q.soru_id),
      answers: (modal._bktQuestions || []).map((q, i) => modal._bktAnswers[i] == null ? "" : modal._bktAnswers[i]),
      started: (s.mini_test_sessions[modal._bktTopicKey] || {}).started || TODAY(), complete: false
    };
    if (typeof saveState === "function") saveState();
  }
  function updateMiniSubmitState(modal) {
    if (!modal) return false;
    const questions = modal._bktQuestions || [];
    // v35.8 — Kısa Kontrol'de boş bırakma serbest olduğu için düğme hiç kilitlenmez.
    const button = modal.querySelector("[data-bkt-next]"); if (button) button.disabled = false;
    return (modal._bktAnswers || []).filter(a => a != null && a !== "").length === questions.length;
  }
  function closeMiniTest() { const modal = document.getElementById("bkt-test-modal"); if (modal) modal.remove(); }
  // Neden seçenekleri: yanlış için WRONG_REASONS, boş için EMPTY_REASONS.
  function nedenSecenekleri(bosMu) {
    const liste = bosMu ? EMPTY_REASONS : WRONG_REASONS;
    return liste.map(function (r) {
      return '<option value="' + safeText(r) + '">' + safeText(REASON_LABELS[r] || r) + "</option>";
    }).join("");
  }
  function showMiniResult(modal, draft) {
    const questions = modal._bktQuestions || [];
    const puan = questions.length ? Math.round((Number(draft.correct) / questions.length) * 100) : 0;
    const renk = puan >= 80 ? "var(--semantic-success)" : puan >= 40 ? "var(--semantic-warning)" : "var(--semantic-error)";
    let html = '<div style="width:100%;max-width:600px;max-height:90vh;overflow:auto;background:var(--bg-card,#fff);color:var(--text-main,#16213A);border-radius:16px;padding:20px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><strong>Sonuçlar</strong><button type="button" data-bkt-close-test style="min-width:48px;min-height:48px;border:0;background:none;color:inherit;font-size:20px;">×</button></div>' +
      '<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:10px;"><b class="tabular" style="font-size:32px;color:' + renk + ';">' + draft.correct + '/' + questions.length + '</b><span class="text-sm text-muted">doğru · %' + puan + '</span></div>' +
      '<p class="text-xs text-muted" style="margin-bottom:8px;">Yanlışların nedenini seç — kayıt buna göre işlenecek.</p>';
    questions.forEach((q, i) => {
      const ham = draft.answers[i];
      const bosMu = ham == null || String(ham) === "";
      const ok = !bosMu && Number(ham) === Number(q.dogru_index);
      const etiket = ok ? "Doğru" : bosMu ? "Boş" : "Yanlış";
      const renk = ok ? "var(--semantic-success)" : bosMu ? "var(--semantic-warning)" : "var(--semantic-error)";
      html += '<div style="border-top:1px solid var(--border-card);padding:10px 0;font-size:12px;"><b style="color:' + renk + ';">' + (i + 1) + ". " + etiket + "</b>" + miniSoruTam(q, ham) +
        '<button type="button" class="btn btn-ghost" data-bkt-sikayet="' + i + '" style="margin-top:6px;min-height:34px;font-size:11px;opacity:.85;">⚠ Bu soruda hata var</button>' +
        '<div class="text-muted" style="margin-top:6px;">Çözüm: ' + safeText(q.cozum) + "</div>";
      // Yanlış ve boş için AYRI neden listesi (Süre yetmedi seçeneği yok).
      if (!ok) html += '<label style="display:block;margin-top:7px;">' + (bosMu ? "Neden boş bıraktın?" : "Neden yanlış yaptın?") +
        ' <select data-bkt-reason="' + i + '" data-bkt-bos="' + (bosMu ? "1" : "0") + '" style="min-height:48px;"><option value="">Seçiniz</option>' + nedenSecenekleri(bosMu) + "</select></label>";
      html += "</div>";
    });
    html += '<div id="bkt-test-message" class="text-xs" style="min-height:18px;margin:8px 0;"></div><button type="button" class="btn btn-primary w-full" data-bkt-finalize-test style="min-height:48px;">Nedenleri Kaydet</button></div>';
    modal.innerHTML = html; modal._bktDraft = draft;
  }
  function finishMiniTest(modal) {
    // Tek soru gösterildiği için cevaplar DOM'dan değil modal._bktAnswers'tan okunur.
    persistMiniSession(modal);
    const answers = (modal._bktQuestions || []).map((q, i) => {
      const a = (modal._bktAnswers || [])[i];
      return a == null ? "" : String(a);
    });
    // v35.8 — Boş bırakılan soru bitirmeyi ENGELLEMEZ ("" = boş cevap).
    const result = submitMiniTest({ konu_id: modal._bktTopicKey, pool_id: modal._bktPoolId, questions: modal._bktQuestions, answers: answers, mode: modal._bktMode });
    if (result.needsReasons) showMiniResult(modal, result);
    else completeMiniTestView(modal, result);
  }
  function completeMiniTestReasons(modal) {
    const draft = modal._bktDraft || {}; const reasons = {};
    const gerekli = (draft.wrongIndexes || []).concat(draft.bosIndexes || []);
    gerekli.forEach(i => {
      const el = modal.querySelector('[data-bkt-reason="' + i + '"]');
      if (el && el.value) reasons[i] = el.value;
    });
    if (gerekli.some(i => !reasons[i])) {
      const msg = modal.querySelector("#bkt-test-message");
      const eksikBos = (draft.bosIndexes || []).some(i => !reasons[i]);
      if (msg) msg.textContent = eksikBos ? "Boş bıraktığın sorular için de neden seç." : "Her yanlış cevap için neden seç.";
      return;
    }
    const result = submitMiniTest({ konu_id: modal._bktTopicKey, pool_id: modal._bktPoolId, questions: modal._bktQuestions, answers: draft.answers, reasons: reasons, mode: modal._bktMode });
    if (result.ok) completeMiniTestView(modal, result);
  }
  function completeMiniTestView(modal, result) {
    const s = ensureStore(); if (s && s.mini_test_sessions[modal._bktTopicKey]) s.mini_test_sessions[modal._bktTopicKey].complete = true;
    if (typeof saveState === "function") saveState();
    // v35.6: sonuç 1.3 saniyede kayboluyordu — öğrenci skoru göremiyordu.
    // Artık sonuç ekranı AÇIK kalır, "Kapat" ile çıkılır.
    const dogru = Number(result.correct) || 0;
    const toplam = Number(result.total) || (modal._bktQuestions || []).length || 0;
    const puan = toplam ? Math.round((dogru / toplam) * 100) : 0;
    const renk = puan >= 80 ? "var(--semantic-success)" : puan >= 40 ? "var(--semantic-warning)" : "var(--semantic-error)";
    const baslik = modal._bktMode === "precheck" ? "Kısa Kontrol sonucu" : "Öğrenme Testi sonucu";
    const mesaj = puan >= 80
      ? "Konu sağlam görünüyor — tekrar takvimine devam."
      : puan >= 40
        ? "Yarısından çoğu doğru. Eksik kalan yerleri bir kez daha oku; yarın tekrar soracağım."
        : "Konuyu yeniden çalışalım; yeni kontrol 2 gün sonra açılacak.";
    let h = '<div style="width:100%;max-width:600px;max-height:92vh;overflow:auto;background:var(--bg-card,#fff);color:var(--text-main,#16213A);border-radius:16px;padding:20px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;"><strong>' + baslik + '</strong><button type="button" data-bkt-close-test style="min-width:48px;min-height:48px;border:0;background:none;color:inherit;font-size:22px;">×</button></div>' +
      '<div style="display:flex;align-items:baseline;gap:10px;margin:4px 0 6px;"><b class="tabular" style="font-size:34px;color:' + renk + ';">' + dogru + '/' + toplam + '</b><span class="text-sm text-muted">doğru · %' + puan + '</span></div>' +
      '<p class="text-sm" style="margin-bottom:12px;line-height:1.5;">' + mesaj + '</p>';
    (modal._bktQuestions || []).forEach(function (q, i) {
      const cevap = (modal._bktAnswers || [])[i];
      const bosMu = cevap == null || String(cevap) === "";
      const ok = !bosMu && Number(cevap) === Number(q.dogru_index);
      h += '<div style="border-top:1px solid var(--border-card);padding:9px 0;font-size:12.5px;">' +
        '<b style="color:' + (ok ? "var(--semantic-success)" : bosMu ? "var(--semantic-warning)" : "var(--semantic-error)") + ';">' + (i + 1) + ". " + (ok ? "Doğru" : bosMu ? "Boş" : "Yanlış") + "</b>" +
        miniSoruTam(q, cevap) +
        '<div class="text-muted" style="margin-top:4px;line-height:1.45;">' + safeText(q.cozum) + "</div>" +
        '<button type="button" class="btn btn-ghost" data-bkt-sikayet="' + i + '" style="margin-top:6px;min-height:34px;font-size:11px;opacity:.85;">⚠ Bu soruda hata var</button></div>';
    });
    h += '<button type="button" data-bkt-close-test class="btn btn-primary w-full" style="min-height:48px;margin-top:12px;">Kapat</button></div>';
    modal.innerHTML = h;
  }
  function submitMiniTest(input) {
    const data = input || {}; const questions = Array.isArray(data.questions) ? data.questions : [];
    const answers = Array.isArray(data.answers) ? data.answers : [];
    if (!questions.length || answers.length !== questions.length) return { ok: false, reason: "all_required" };
    const reasons = data.reasons || {}; const wrongIndexes = []; const bosIndexes = [];
    let correct = 0;
    questions.forEach((q, i) => {
      const cevap = answers[i] == null ? "" : String(answers[i]);
      if (cevap === "") { bosIndexes.push(i); return; }          // boş = yanlış ama nedeni AYRI
      if (Number(cevap) === Number(q.dogru_index)) correct++; else wrongIndexes.push(i);
    });
    const nedenGerekli = wrongIndexes.concat(bosIndexes);
    if (nedenGerekli.length && nedenGerekli.some(i => !reasons[i])) {
      return { ok: false, needsReasons: true, correct: correct, total: questions.length, answers: answers, wrongIndexes: wrongIndexes, bosIndexes: bosIndexes };
    }
    questions.forEach((q, i) => {
      const isCorrect = answers[i] != null && String(answers[i]) !== "" && Number(answers[i]) === Number(q.dogru_index);
      observe({ konu_id: data.konu_id || data.topicKey, pool_id: data.pool_id || data.poolId, dogru_mu: isCorrect, neden: reasons[i], kaynak: "mini_test", tarih: TODAY(), alt_beceri: q.alt_beceri });
      if (!isCorrect && reasons[i]) {
        const card = q.flashcard || { front: q.metin, back: q.cozum };
        addErrorCard({ topicKey: data.konu_id || data.topicKey, front: card.front || card.on, back: card.back || card.arka, reason: reasons[i] });
      }
    });
    const mode = data.mode || "learning";
    // v35.9 — "5 kısa soru her zaman açık kalmayacak": Kısa Kontrol yapıldığı
    // gün damgalanır; KISA_ARALIK_GUN gün boyunca bir daha AÇILMAZ (motorun
    // kendi zamanlaması — precheck_due — geldiyse elbette açılır).
    if (mode === "precheck") {
      const kayit = getEntry(data.konu_id || data.topicKey, true);
      kayit.son_kisa_kontrol = TODAY();
      kayit.son_kisa_kontrol_dogru = correct;
      kayit.son_kisa_kontrol_toplam = questions.length;
      // KÖK NEDEN (v35.9): precheck_due hiç ilerletilmiyordu → "5 soru"
      // düğmesi SONSUZA KADAR açık kalıyordu (kullanıcı şikâyeti: "5 kısa
      // soru her zaman açık kalmayacak"). Test yapıldıysa sıradaki kontrol
      // ertelenir: geçtiyse KISA_ARALIK_GUN, kaldıysa 1 gün sonra.
      const gecti = questions.length ? (correct / questions.length) >= 0.6 : false;
      kayit.precheck_due = addDays(TODAY(), gecti ? KISA_ARALIK_GUN : 1);
      kayit.son_kisa_kontrol_gecti = gecti;
      // v41 — 5. ADIM TAMAMLANDI. Yol haritası aynı ekranda tazelenir
      // (kullanıcı: "adım bittiğinde çıkmıyor, ağaca tıklayınca açılıyor").
      try { if (typeof window.__kisaKontrolBitti === "function") window.__kisaKontrolBitti(data.konu_id || data.topicKey); } catch (e) { /* */ }
    }
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
    // Rapor §5.1: konu başına EN FAZLA 8 standart kart.
    sourceCards.slice(0, 8).forEach(function (card, i) {
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
    WRONG_REASONS: WRONG_REASONS,
    REASON_LABELS: REASON_LABELS,
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
    havuzEsle: havuzEsle,
    havuzDogrula: havuzDogrula,
    havuzIdCoz: function (k, kayitli) { return window.__havuzIdCoz(k, kayitli); },
    resolvePoolId: resolvePoolId,
    MINI_SORU: MINI_SORU,
    KISA_ARALIK_GUN: KISA_ARALIK_GUN,
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
    statusFor: statusFor,
    // v35.8 — Konu Takibi'ndeki BİRLEŞİK kart ("Öğrenme Durumu · Hafıza Gücü")
    // bu tek çağrıyla konunun BKT durumunu alır. Ayrı panel kaldırıldığı için
    // aynı konu iki yerde gösterilmiyor.
    konuDurum: function (key) {
      const s = ensureStore();
      if (!s || !s.bkt_state || !key) return null;
      const e = s.bkt_state[key];
      if (!e) return null;
      const status = statusFor(e);
      const known = e.gozlem_sayisi >= 5;
      const poolId = window.__havuzIdCoz(key, e.pool_id || e.soru_havuzu_id) || null;
      const precheck = !!(e.precheck_due && dateValue(e.precheck_due) <= dateValue(TODAY()));
      // Kısa Kontrol erişimi: motor "zamanı geldi" diyorsa AÇIK; aksi hâlde
      // son testten bu yana KISA_ARALIK_GUN geçmeden KAPALI.
      let kisaAcik = true, kisaKalan = 0;
      if (e.son_kisa_kontrol) {
        const gecen = Math.floor((dateValue(TODAY()) - dateValue(e.son_kisa_kontrol)) / 86400000);
        const sinir = e.son_kisa_kontrol_gecti === false ? 1 : KISA_ARALIK_GUN;
        if (gecen >= 0 && gecen < sinir) { kisaAcik = false; kisaKalan = sinir - gecen; }
      }
      const task = (s.mini_test_kuyrugu || []).some(function (x) { return x.topicKey === key && x.type === "learning" && !x.completed; });
      const cause = e.graph_topic_id ? rootCause(e.graph_topic_id, e.hata_gecmisi || []) : null;
      return {
        key: key,
        durum: STATUS_TEXT[status] || "Gelişiyor",
        onayli: status === "ONAYLANDI",
        yeterlilik: known ? Math.round(e.L * 100) : null,
        gozlem: e.gozlem_sayisi || 0,
        poolId: poolId,
        precheck: precheck,
        // v37 — kullanıcı: "ne kadar çözülse de kalkmıyor". Arayüz artık
        // "zamanı geldi mi" (precheck) ve "en son ne zaman yapıldı" bilgisini
        // AYRI alır; test yapıldıysa kart hiç gösterilmez.
        precheckTarih: e.precheck_due || null,
        kisaYapildi: !!e.son_kisa_kontrol,
        kisaKontrol: { acik: kisaAcik, kalan: kisaKalan, sonTarih: e.son_kisa_kontrol || null },
        ogrenmeTesti: task,
        odak: focusLabel(e) || "",
        kok: cause && !cause.stay ? cause.topicName : ""
      };
    },
    konuDurumlari: function () {
      const out = {};
      try {
        Object.keys((ensureStore() || {}).bkt_state || {}).forEach(function (k) {
          const d = API.konuDurum(k);
          if (d) out[k] = d;
        });
      } catch (e) { /* */ }
      return out;
    },
    paneliTazele: function () { try { renderBktPanel(); } catch (e) { /* */ } }
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
    const s = ensureStore();
    if (!s) return;
    // v40 — KULLANICI: "yukarıda Hafıza Gücü/Öğrenme Durumu var, altta tekrar
    // Öğrenme Durumu var, neden?"
    // KÖK NEDEN: Konu Takibi'ndeki birleşik kart v38'de `id="bkt-birlesik-kart"`
    // taşıyordu ve buradaki erken dönüş o kimliğe bakıyordu. v39'da kart
    // `id="hafiza-baslik-kart"` + `.konu-kart` oldu; kimlik değişince erken
    // dönüş hiç tutmadı ve ESKİ "Öğrenme Durumu" paneli altta ikinci kez
    // çizildi. Aynı konular iki yerde göründü.
    // ÇÖZÜM: Ayrı panel tamamen kaldırıldı. Tek yer: Konu Takibi'ndeki
    // "Öğrenme Durumu · Hafıza Gücü" bölümü. Burada yalnız kuyruk doldurulur
    // (öğrenme testi planlaması bunun içinde) ve eski panel kalıntısı silinir.
    queueLearningTests();
    const eskiPanel = document.getElementById("bkt-learning-panel");
    if (eskiPanel) eskiPanel.remove();
  }

  function scheduleUi() { clearTimeout(uiTimer); uiTimer = setTimeout(renderBktPanel, 80); }
  // app-pwa.js konu eşlemesi yaptıktan sonra paneli tazeleyebilsin
  window.__bktUiTazele = scheduleUi;
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
      if (event.target.matches && event.target.matches("#bkt-test-modal input[data-bkt-secim]")) {
        const modal = document.getElementById("bkt-test-modal");
        if (!modal) return;
        const i = Number(modal._bktIdx) || 0;
        if (!Array.isArray(modal._bktAnswers)) modal._bktAnswers = [];
        modal._bktAnswers[i] = String(event.target.value);
        persistMiniSession(modal);
        // Seçimi görsel olarak da işaretle (radio'nun kendi stili yetmiyor)
        cizMiniSoru(modal);
      }
    });
    document.addEventListener("click", function (event) {
      const testButton = event.target.closest("[data-bkt-test]");
      if (testButton) { openMiniTest(testButton.dataset.bktTest, testButton.dataset.bktPool, { mode: testButton.dataset.bktMode || "learning" }); return; }
      if (event.target.closest("[data-bkt-close-test]")) { closeMiniTest(); return; }
      // v41 — "Bu soruda hata var": soru metni + konu + havuz bize iletilir.
      const sikayet = event.target.closest("[data-bkt-sikayet]");
      if (sikayet) {
        const modal = document.getElementById("bkt-test-modal");
        const sira = Number(sikayet.dataset.bktSikayet) || 0;
        const q = (modal && modal._bktQuestions && modal._bktQuestions[sira]) || {};
        const parca = String((modal && modal._bktTopicKey) || "").split(" > ");
        if (typeof window.__amGeriBildirim === "function") {
          const cevap = Array.isArray(q.secenekler) ? q.secenekler.map(function (x, j) { return ("ABCDE".charAt(j) || (j + 1)) + ") " + x; }).join(" | ") : "";
          window.__amGeriBildirim({
            tur: "soru",
            ders: parca.length > 1 ? parca[0] : "",
            konu: (modal && modal._bktTopicKey) || "",
            havuz: (modal && modal._bktPoolId) || "",
            soru_id: q.soru_id || "",
            soru_metni: (q.metin || "") + (cevap ? " || " + cevap : ""),
            mesaj: "Soru hatalı bildirimi · doğru cevap indeksi: " + q.dogru_index + " · mod: " + ((modal && modal._bktMode) || "")
          });
        }
        return;
      }
      if (event.target.closest("[data-bkt-submit-test]")) { const modal = document.getElementById("bkt-test-modal"); if (modal) finishMiniTest(modal); return; }
      if (event.target.closest("[data-bkt-next]")) { const modal = document.getElementById("bkt-test-modal"); if (modal) miniSonraki(modal); return; }
      if (event.target.closest("[data-bkt-prev]")) { const modal = document.getElementById("bkt-test-modal"); if (modal) miniOnceki(modal); return; }
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
