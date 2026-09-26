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
    "KONU EKSİKLİĞİ": 1.0,
    "KONUEKSİKLİĞİ": 1.0,
    "Konuyu Bilmiyordum": 1.0,
    "ANLAMADIM": 0.5,
    "ÇÖZÜM YOLUNU BULAMADIM": 0.5,
    "İşlem Hatası/Dikkatsizlik": 0.2,
    "Kodlama/Kitapçık Hatası": null,
    "SÜRE YETMEDİ": null
  });
  const ALLOWED_SOURCES = ["deneme", "soru_girisi", "mini_test"];
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
  function normalizeReason(reason) {
    const r = String(reason || "").trim();
    if (r === "KONUEKSİKLİĞİ") return "KONU EKSİKLİĞİ";
    if (r === "ÇÖZÜM YOLUNUBULAMADIM") return "ÇÖZÜM YOLUNU BULAMADIM";
    if (r === "SÜREYETMEDİ") return "SÜRE YETMEDİ";
    return r;
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
  function ensureStore() {
    const s = appState();
    if (!s) return null;
    if (!s.bkt_state || typeof s.bkt_state !== "object" || Array.isArray(s.bkt_state)) s.bkt_state = {};
    if (!s.bkt_processed_records || typeof s.bkt_processed_records !== "object") s.bkt_processed_records = {};
    if (!s.flashcards || typeof s.flashcards !== "object") s.flashcards = { cards: [], sessions: {}, lastSoftDrop: {} };
    if (!Array.isArray(s.flashcards.cards)) s.flashcards.cards = [];
    if (!s.flashcards.sessions || typeof s.flashcards.sessions !== "object") s.flashcards.sessions = {};
    if (!s.flashcards.lastSoftDrop || typeof s.flashcards.lastSoftDrop !== "object") s.flashcards.lastSoftDrop = {};
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
    const source = String(data.kaynak || data.source || "");
    const key = topicKey(data.konu_id || data.topicKey || data.topic, data.lesson || data.ders);
    if (!ALLOWED_SOURCES.includes(source)) return { ignored: true, reason: "kaynak" };
    if (!key) return { ignored: true, reason: "konu" };
    const correct = data.dogru_mu === true || data.correct === true;
    const reason = normalizeReason(data.neden || data.reason);
    const weight = correct ? 1 : WRONG_WEIGHT[reason];
    if (!correct && weight == null) return { ignored: true, reason: "gözlem sayılmayan neden" };
    const entry = getEntry(key, true);
    if (data.graph_topic_id || data.graphTopicId) entry.graph_topic_id = data.graph_topic_id || data.graphTopicId;
    if (!correct && entry.onay_durumu === "ONAYLANDI") entry.onay_durumu = "RISKLI";
    const nextFull = observedFromEntry(entry, correct, source, reason);
    entry.L = clamp(correct ? nextFull : entry.L + (nextFull - entry.L) * weight, 0.01, 0.99);
    entry.gozlem_sayisi += 1;
    entry.son_gozlem_tarihi = data.tarih || data.date || TODAY();
    if (!Array.isArray(entry.hata_gecmisi)) entry.hata_gecmisi = [];
    if (!correct) {
      entry.son_negatif_tarihi = entry.son_gozlem_tarihi;
      entry.hata_gecmisi.push({ type: reason, date: entry.son_gozlem_tarihi });
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
        graph_topic_id: item.graph_topic_id || item.graphTopicId
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
        graph_topic_id: error.graph_topic_id || error.graphTopicId
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

  function processNewRecords() {
    const s = ensureStore();
    if (!s) return 0;
    migrateExisting();
    let count = 0;
    (s.exams || []).forEach(x => { count += processRecord(x, "deneme"); });
    (s.questions || []).forEach(x => { count += processRecord(x, "soru_girisi"); });
    if (typeof getMemoryStrength === "function") Object.keys(s.memory || {}).forEach(function (key) {
      applyMemorySignal(key, getMemoryStrength(key));
    });
    return count;
  }

  function validateGraphData(data) {
    const errors = [];
    if (!data || !Array.isArray(data.dugumler) || !Array.isArray(data.kenarlar)) errors.push("şema: dugumler/kenarlar dizisi zorunlu");
    const nodes = Array.isArray(data && data.dugumler) ? data.dugumler : [];
    const edges = Array.isArray(data && data.kenarlar) ? data.kenarlar : [];
    if (!nodes.length) errors.push("düğüm yok");
    const ids = new Set(nodes.map(n => n && n.konu_id).filter(Boolean));
    if (ids.size !== nodes.filter(n => n && n.konu_id).length) errors.push("yinelenen konu_id");
    const incoming = {};
    const valid = [];
    nodes.forEach(n => {
      if (!n || !n.konu_id || !n.konu_adi || !Number.isFinite(Number(n.sinif)) || !n.ders) errors.push("geçersiz düğüm");
    });
    edges.forEach((edge, i) => {
      const type = edge && edge.iliski_tipi;
      const min = type === "SERT_ONKOSUL" ? 0.70 : 0.20;
      const max = type === "SERT_ONKOSUL" ? 1.00 : 0.50;
      if (!edge || !ids.has(edge.kaynak_konu_id) || !ids.has(edge.hedef_konu_id)) { errors.push("yetim kenar:" + i); return; }
      if (!["SERT_ONKOSUL", "YUMUSAK_TRANSFER"].includes(type) || Number(edge.agirlik) < min || Number(edge.agirlik) > max) { errors.push("ağırlık/tür:" + i); return; }
      const source = nodes.find(n => n.konu_id === edge.kaynak_konu_id);
      const target = nodes.find(n => n.konu_id === edge.hedef_konu_id);
      const out = Object.assign({}, edge);
      if (type === "SERT_ONKOSUL" && Number(source.sinif) > Number(target.sinif)) out.ileri_bagimlilik = true;
      valid.push(out);
      if (type === "SERT_ONKOSUL") incoming[edge.hedef_konu_id] = (incoming[edge.hedef_konu_id] || 0) + 1;
    });
    Object.keys(incoming).forEach(id => { if (incoming[id] > 4) errors.push("sert yoğunluk:" + id); });
    const dagEdges = valid.filter(e => e.iliski_tipi === "SERT_ONKOSUL");
    const indegree = {}; const outgoing = {};
    ids.forEach(id => { indegree[id] = 0; outgoing[id] = []; });
    dagEdges.forEach(e => { if (e.ileri_bagimlilik) return; indegree[e.hedef_konu_id]++; outgoing[e.kaynak_konu_id].push(e.hedef_konu_id); });
    const queue = Object.keys(indegree).filter(id => indegree[id] === 0); let seen = 0;
    while (queue.length) { const id = queue.shift(); seen++; outgoing[id].forEach(next => { indegree[next]--; if (!indegree[next]) queue.push(next); }); }
    if (seen !== ids.size) errors.push("sert döngü");
    return { valid: errors.length === 0, errors: errors, nodes: nodes, edges: valid, ids: ids };
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
    const s = ensureStore(); const changed = [];
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

  function rootCause(topicId, recentErrors) {
    const rows = Array.isArray(recentErrors) ? recentErrors : [];
    const difficult = rows.filter(r => ["ANLAMADIM", "KONU EKSİKLİĞİ", "KONUEKSİKLİĞİ"].includes(normalizeReason(r.type || r.reason)));
    const recent = rows.filter(r => !r.date || Date.now() - dateValue(r.date) <= 14 * 86400000);
    const ratioTrigger = rows.length >= 3 && difficult.length / rows.length >= 0.40;
    if (recent.length < 3 && !ratioTrigger) return null;
    if (!graph || !graph.edges) return null;
    const candidates = graph.edges.filter(e => e.hedef_konu_id === topicId && e.iliski_tipi === "SERT_ONKOSUL" && !e.ileri_bagimlilik)
      .map(e => {
        const entry = getEntry(e.kaynak_konu_id, false);
        return { edge: e, entry: entry, L: entry ? entry.L : null };
      })
      .filter(x => !x.entry || x.entry.L < 0.60)
      .sort((a, b) => (a.L == null ? -1 : a.L) - (b.L == null ? -1 : b.L) || Number(b.edge.agirlik) - Number(a.edge.agirlik));
    if (!candidates.length) return null;
    const chosen = candidates[0];
    const node = graph.nodes.find(n => n.konu_id === chosen.edge.kaynak_konu_id);
    return { topicId: chosen.edge.kaynak_konu_id, topicName: node ? node.konu_adi : chosen.edge.kaynak_konu_id, priorityWeight: Number(chosen.edge.agirlik), reason: "Önce şu konuyu sağlamlaştır" };
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

  function openMiniTest(topicKey, poolId) {
    loadPool(poolId || topicKey).then(function (pool) {
      if (!pool) return typeof toast === "function" && toast("Bu konu için henüz soru havuzu hazırlanmadı.", "info");
      const questions = pool.sorular.slice(0, 5);
      let modal = document.getElementById("bkt-test-modal");
      if (!modal) { modal = document.createElement("div"); modal.id = "bkt-test-modal"; modal.style.cssText = "position:fixed;inset:0;z-index:10001;display:flex;align-items:center;justify-content:center;background:rgba(10,16,32,.62);padding:14px;"; document.body.appendChild(modal); }
      let html = '<div style="width:100%;max-width:600px;max-height:90vh;overflow:auto;background:var(--bg-card,#fff);color:var(--text-main,#16213A);border-radius:16px;padding:20px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><strong>Öğrenme Testi</strong><button type="button" data-bkt-close-test style="border:0;background:none;color:inherit;font-size:20px;cursor:pointer;">×</button></div><p class="text-xs text-muted">Tüm soruları işaretle. Test sırasında doğru cevap gösterilmez.</p>';
      questions.forEach(function (q, i) {
        html += '<fieldset style="border:0;border-top:1px solid var(--border-card);padding:12px 0;margin:0;"><legend style="font-weight:700;font-size:13px;">' + (i + 1) + '. ' + safeText(q.metin) + '</legend>';
        (q.secenekler || []).forEach(function (option, j) { html += '<label style="display:block;font-size:12.5px;padding:5px 0;"><input type="radio" name="bkt-q-' + i + '" value="' + j + '"> ' + safeText(option) + '</label>'; });
        html += '<label class="text-xs text-muted" style="display:block;margin-top:5px;">Cevabı bilmiyorsan nedeni <select data-bkt-reason="' + i + '" style="margin-left:4px;"><option value="">Sonuçtan sonra seç</option><option value="Konuyu Bilmiyordum">Konuyu Bilmiyordum</option><option value="KONU EKSİKLİĞİ">Konu Eksiği</option><option value="ANLAMADIM">Anlamadım</option><option value="ÇÖZÜM YOLUNU BULAMADIM">Çözüm yolunu bulamadım</option><option value="İşlem Hatası/Dikkatsizlik">İşlem hatası</option></select></label></fieldset>';
      });
      html += '<div id="bkt-test-message" class="text-xs" style="min-height:18px;margin-bottom:8px;"></div><button type="button" class="btn btn-primary w-full" data-bkt-submit-test>Testi Bitir</button></div>';
      modal.innerHTML = html; modal.style.display = "flex";
      modal._bktQuestions = questions; modal._bktTopicKey = topicKey; modal._bktPoolId = pool.konu_id || poolId;
    });
  }

  function closeMiniTest() { const modal = document.getElementById("bkt-test-modal"); if (modal) modal.remove(); }
  function finishMiniTest(modal) {
    const questions = modal._bktQuestions || []; const answers = []; const reasons = {};
    for (let i = 0; i < questions.length; i++) {
      const answer = modal.querySelector('input[name="bkt-q-' + i + '"]:checked');
      if (!answer) { const msg = modal.querySelector("#bkt-test-message"); if (msg) msg.textContent = "Testi bitirmek için tüm soruları işaretle."; return; }
      answers.push(answer.value);
      const reason = modal.querySelector('[data-bkt-reason="' + i + '"]');
      if (reason && reason.value) reasons[i] = reason.value;
    }
    const result = submitMiniTest({ konu_id: modal._bktTopicKey, questions: questions, answers: answers, reasons: reasons });
    const msg = modal.querySelector("#bkt-test-message");
    if (!result.ok) { if (msg) msg.textContent = result.reason === "reason_required" ? "Yanlış cevapların nedenini seç." : "Tüm soruları işaretle."; return; }
    if (msg) msg.textContent = result.result.passed ? "Öğrenme Onaylandı." : "Bu konuyu yeniden çalışalım; yeni test daha sonra açılacak.";
    const button = modal.querySelector("[data-bkt-submit-test]"); if (button) button.remove();
    if (typeof saveState === "function") saveState();
    setTimeout(closeMiniTest, 1300);
  }

  function submitMiniTest(input) {
    const data = input || {}; const questions = Array.isArray(data.questions) ? data.questions : [];
    const answers = Array.isArray(data.answers) ? data.answers : [];
    if (!questions.length || answers.length !== questions.length || answers.some(a => a == null || a === "")) return { ok: false, reason: "all_required" };
    const reasons = data.reasons || {};
    for (let i = 0; i < questions.length; i++) {
      if (Number(answers[i]) !== Number(questions[i].dogru_index) && !reasons[i]) return { ok: false, reason: "reason_required", index: i };
    }
    let correct = 0;
    questions.forEach((q, i) => { if (Number(answers[i]) === Number(q.dogru_index)) correct++; });
    questions.forEach((q, i) => {
      observe({ konu_id: data.konu_id || data.topicKey, dogru_mu: Number(answers[i]) === Number(q.dogru_index), neden: reasons[i], kaynak: "mini_test", tarih: TODAY() });
    });
    const result = validateLearningTest(data.konu_id || data.topicKey, correct, questions.length);
    result.correct = correct; result.total = questions.length;
    return { ok: true, result: result };
  }

  function validateLearningTest(key, correct, total) {
    const entry = getEntry(key, true); const ratio = total ? Number(correct) / Number(total) : 0;
    if (ratio >= 0.80 && entry.L >= 0.85) {
      entry.onay_durumu = "ONAYLANDI";
      createCardsOnApproval(key);
      applyGraphCredits(entry.graph_topic_id || key);
    } else {
      entry.onay_durumu = ratio < 0.80 ? "ONARIM" : "OGRENIYOR";
    }
    return { passed: ratio >= 0.80 && entry.L >= 0.85, ratio: ratio, status: statusFor(entry) };
  }

  function createCardsOnApproval(key) {
    const s = ensureStore();
    if (!s || s.flashcards.cards.some(c => c.topicKey === key && c.standard)) return;
    // İçerik kaynağı yoksa uydurma bilgi üretilmez. Havuz/konu verisi kart
    // sağlayana kadar yalnızca yapı hazırlanır; hata kartları çözüm alanından gelir.
    const topic = (s.topics && s.topics[key]) || {};
    (Array.isArray(topic.flashcards) ? topic.flashcards : []).slice(0, 8).forEach(function (card, i) {
      s.flashcards.cards.push({ id: "std:" + key + ":" + i, topicKey: key, standard: true, front: card.front, back: card.back, due: TODAY(), unknownStreak: 0 });
    });
  }

  function addErrorCard(card) {
    const s = ensureStore(); if (!s || !card || !card.topicKey || !card.front || !card.back) return false;
    const qualifying = ["Konuyu Bilmiyordum", "KONU EKSİKLİĞİ", "KONUEKSİKLİĞİ", "ÇÖZÜM YOLUNU BULAMADIM"];
    if (!qualifying.includes(normalizeReason(card.reason))) return false;
    const count = s.flashcards.cards.filter(c => c.topicKey === card.topicKey && c.errorCard).length;
    if (count >= 5) return false;
    s.flashcards.cards.push({ id: "err:" + Date.now() + ":" + count, topicKey: card.topicKey, errorCard: true, front: card.front, back: card.back, due: TODAY(), unknownStreak: 0 });
    return true;
  }

  function flashcardReview(cardId, knew) {
    const s = ensureStore(); const card = s && s.flashcards.cards.find(c => c.id === cardId);
    if (!card) return { ok: false };
    const key = card.topicKey; const entry = getEntry(key, true); const today = TODAY();
    if (knew) { card.unknownStreak = 0; card.last = today; card.due = today; }
    else {
      card.unknownStreak = (card.unknownStreak || 0) + 1; card.last = today; card.due = today;
      entry.flashcard_bilemedi_ardisik = (entry.flashcard_bilemedi_ardisik || 0) + 1;
      if (entry.flashcard_bilemedi_ardisik >= 2 && s.flashcards.lastSoftDrop[key] !== today) {
        entry.L = clamp(entry.L * 0.8, 0.01, 0.99);
        entry.son_hafiza_dususu = today;
        s.flashcards.lastSoftDrop[key] = today;
        if (entry.onay_durumu === "ONAYLANDI") entry.onay_durumu = "RISKLI";
      }
    }
    if (knew) entry.flashcard_bilemedi_ardisik = 0;
    return { ok: true, status: statusFor(entry), L: entry.L };
  }

  const API = window.AnalizBKT = {
    PARAM: PARAM,
    SOURCE_PT: SOURCE_PT,
    WRONG_WEIGHT: WRONG_WEIGHT,
    STATUS_TEXT: STATUS_TEXT,
    observe: observe,
    migrateExisting: migrateExisting,
    processNewRecords: processNewRecords,
    loadGraph: loadGraph,
    validateGraphData: validateGraphData,
    applyGraphCredits: applyGraphCredits,
    rootCause: rootCause,
    applyMemorySignal: applyMemorySignal,
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

  function renderBktPanel() {
    const s = ensureStore(); const host = document.getElementById("main-content");
    if (!s || !host || !s.user || !s.user.name) return;
    const entries = Object.keys(s.bkt_state).map(key => ({ key: key, entry: s.bkt_state[key] }))
      .sort((a, b) => (statusFor(a.entry) === "ONAYLANDI" ? 1 : 0) - (statusFor(b.entry) === "ONAYLANDI" ? 1 : 0) || b.entry.gozlem_sayisi - a.entry.gozlem_sayisi)
      .slice(0, 12);
    let panel = document.getElementById("bkt-learning-panel");
    if (!entries.length) { if (panel) panel.remove(); return; }
    if (!panel) { panel = document.createElement("section"); panel.id = "bkt-learning-panel"; panel.className = "card"; host.appendChild(panel); }
    let html = '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px;"><div><h3 style="margin:0;font-size:16px;">Öğrenme Durumu</h3><div class="text-xs text-muted">Konuların yeterlilik ve tekrar sinyalleri</div></div></div>';
    html += '<div style="display:grid;gap:7px;">';
    entries.forEach(function (row) {
      const e = row.entry; const status = statusFor(e); const known = e.gozlem_sayisi >= 5;
      const percent = Math.round(e.L * 100);
      html += '<div style="border:1px solid var(--border-card);border-radius:10px;padding:9px 10px;">';
      html += '<div style="display:flex;justify-content:space-between;gap:8px;align-items:center;"><strong style="font-size:12.5px;">' + safeText(row.key) + '</strong><span class="text-xs" style="color:var(--brand-blue);font-weight:700;">' + safeText(STATUS_TEXT[status] || "Gelişiyor") + '</span></div>';
      html += known ? '<div class="text-xs" style="margin-top:5px;">Yeterlilik: <b>' + percent + '%</b> · ' + e.gozlem_sayisi + ' soru</div>' : '<div class="text-xs text-muted" style="margin-top:5px;">Birkaç soru daha çöz, seviyen netleşsin · ' + e.gozlem_sayisi + ' soru</div>';
      if (known) html += '<div style="height:5px;background:var(--bg-canvas);border-radius:99px;margin-top:6px;overflow:hidden;"><div style="height:100%;width:' + percent + '%;background:var(--brand-blue);border-radius:99px;"></div></div>';
      const cause = e.graph_topic_id ? rootCause(e.graph_topic_id, e.hata_gecmisi || []) : null;
      if (cause) html += '<div class="text-xs" style="margin-top:6px;color:var(--brand-blue);">Önce şunu sağlamlaştır: ' + safeText(cause.topicName) + '</div>';
      const poolId = e.pool_id || e.soru_havuzu_id;
      if (poolId) html += '<button type="button" class="btn btn-sm btn-ghost" data-bkt-test="' + safeText(row.key) + '" data-bkt-pool="' + safeText(poolId) + '" style="margin-top:7px;">Öğrenme Testi</button>';
      html += '</div>';
    });
    html += '</div>';
    const cards = s.flashcards.cards.filter(c => !c.due || c.due <= TODAY());
    if (cards.length) {
      const card = cards[0];
      html += '<div style="border-top:1px solid var(--border-card);margin-top:12px;padding-top:10px;"><div class="text-xs text-muted" style="margin-bottom:5px;">Tekrar Kartı</div><div style="font-weight:700;font-size:13px;margin-bottom:8px;">' + safeText(card.front) + '</div><div style="display:flex;gap:7px;"><button class="btn btn-sm btn-ghost" data-bkt-card="' + safeText(card.id) + '" data-bkt-known="0">Bilemedi</button><button class="btn btn-sm btn-primary" data-bkt-card="' + safeText(card.id) + '" data-bkt-known="1">Bildi</button></div></div>';
    }
    panel.innerHTML = html;
    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  function scheduleUi() { clearTimeout(uiTimer); uiTimer = setTimeout(renderBktPanel, 80); }
  function install() {
    if (saveWrapped) return;
    saveWrapped = true;
    const original = window.saveState;
    if (typeof original === "function") {
      window.saveState = function () {
        processNewRecords();
        const result = original.apply(this, arguments);
        scheduleUi();
        return result;
      };
    }
    const host = document.getElementById("main-content");
    if (host && window.MutationObserver) {
      uiObserver = new MutationObserver(scheduleUi);
      uiObserver.observe(host, { childList: true });
    }
    document.addEventListener("click", function (event) {
      const testButton = event.target.closest("[data-bkt-test]");
      if (testButton) { openMiniTest(testButton.dataset.bktTest, testButton.dataset.bktPool); return; }
      if (event.target.closest("[data-bkt-close-test]")) { closeMiniTest(); return; }
      if (event.target.closest("[data-bkt-submit-test]")) { const modal = document.getElementById("bkt-test-modal"); if (modal) finishMiniTest(modal); return; }
      const button = event.target.closest("[data-bkt-card]");
      if (!button) return;
      flashcardReview(button.dataset.bktCard, button.dataset.bktKnown === "1");
      if (typeof saveState === "function") saveState();
      scheduleUi();
    });
    processNewRecords();
    loadGraph();
    scheduleUi();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
})();
