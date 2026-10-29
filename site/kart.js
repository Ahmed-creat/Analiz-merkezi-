/* ============================================================
   TEKRAR KARTLARI (FLASHCARD) — site/kart.js   v35.9
   ------------------------------------------------------------
   Kullanıcı: "depodaki belgeleri okuduğunuzda uygulamada flashcard
   da olacağını görürsünüz" — README ve docs/KONU-ESLEME.md soru
   havuzlarında `flashcards[]` / soru içinde `flashcard {front, back}`
   alanı olduğunu söylüyor. Bu dosya o alanları GERÇEKTEN ekrana çıkarır.

   v35.8'e kadar kart üretimi yalnız "onaylanmış konu" için yapılıyor ve
   kart ekranı birleştirme sırasında çizilmeyen panelde kalmıştı → öğrenci
   hiç kart görmüyordu. Artık kart, konu ONAYLANMADAN da açılır: kart bir
   çalışma aracıdır, ödül değil.

   Genel API: window.AmKart
     ac(topicKey)      → kart penceresini açar (havuzu kendisi bulur)
     kartlar(topicKey) → [{front, back}]  (promise)
     sayi(topicKey)    → kart sayısı (promise)
     kayit(topicKey)   → {gorulen, bildi, zorlandi, bilemedi, sonTarih}

   Veri: soru havuzu (`content/soru_havuzlari/*.json`)
     • sorular[].flashcard.front / .back
     • pool.flashcards[] (varsa)
   Kayıt: state.tekrarKartlari[topicKey] — kalıcı durum, saveState() ile yazılır.
   ============================================================ */
(function () {
  "use strict";
  if (typeof window === "undefined" || typeof document === "undefined") return;

  var MODAL_ID = "kart-modal";

  function esc(x) {
    return String(x == null ? "" : x)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function durum() {
    try { return (typeof state !== "undefined" && state) ? state : null; } catch (e) { return null; }
  }
  function kaydet() {
    try { if (typeof saveState === "function") saveState(); } catch (e) { /* */ }
  }
  function bugun() {
    try { if (typeof todayStr === "function") return todayStr(); } catch (e) { /* */ }
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function havuzId(topicKey) {
    try {
      var A = window.AnalizBKT;
      if (A && typeof A.konuDurum === "function") {
        var d = A.konuDurum(topicKey);
        if (d && d.poolId) return d.poolId;
      }
      if (typeof window.__havuzIdCoz === "function") return window.__havuzIdCoz(topicKey, null);
    } catch (e) { /* */ }
    return null;
  }

  /** Havuzdan kart listesi — soru içi `flashcard` + havuz `flashcards`. */
  function kartlar(topicKey) {
    var id = havuzId(topicKey);
    var A = window.AnalizBKT;
    if (!id || !A || typeof A.loadPool !== "function") return Promise.resolve([]);
    return Promise.resolve(A.loadPool(id)).then(function (pool) {
      if (!pool) return [];
      var out = [];
      var gorulen = {};
      (Array.isArray(pool.sorular) ? pool.sorular : []).forEach(function (q) {
        var k = q && q.flashcard;
        if (!k) return;
        var on = k.front || k.on || "";
        var arka = k.back || k.arka || "";
        if (!on || !arka || gorulen[on]) return;
        gorulen[on] = 1;
        out.push({ front: on, back: arka, kaynak: q.soru_id || "" });
      });
      (Array.isArray(pool.flashcards) ? pool.flashcards : []).forEach(function (k) {
        var on = k && (k.front || k.on);
        var arka = k && (k.back || k.arka);
        if (!on || !arka || gorulen[on]) return;
        gorulen[on] = 1;
        out.push({ front: on, back: arka, kaynak: "havuz" });
      });
      return out;
    }).catch(function () { return []; });
  }

  function sayi(topicKey) {
    return kartlar(topicKey).then(function (l) { return l.length; });
  }

  function kayit(topicKey) {
    var s = durum();
    if (!s) return { gorulen: 0, bildi: 0, zorlandi: 0, bilemedi: 0, sonTarih: null };
    s.tekrarKartlari = s.tekrarKartlari || {};
    s.tekrarKartlari[topicKey] = s.tekrarKartlari[topicKey] || { gorulen: 0, bildi: 0, zorlandi: 0, bilemedi: 0, sonTarih: null };
    return s.tekrarKartlari[topicKey];
  }

  function isaretle(topicKey, puan) {
    var s = durum();
    if (!s) return;
    s.tekrarKartlari = s.tekrarKartlari || {};
    var k = s.tekrarKartlari[topicKey] || { gorulen: 0, bildi: 0, zorlandi: 0, bilemedi: 0, sonTarih: null };
    k.gorulen = (k.gorulen || 0) + 1;
    if (puan === "bildi") k.bildi = (k.bildi || 0) + 1;
    else if (puan === "zorlandi") k.zorlandi = (k.zorlandi || 0) + 1;
    else k.bilemedi = (k.bilemedi || 0) + 1;
    k.sonTarih = bugun();
    s.tekrarKartlari[topicKey] = k;
    kaydet();
  }

  // ---------- Pencere ----------
  function kapat() {
    var m = document.getElementById(MODAL_ID);
    if (m) m.remove();
  }

  function ac(topicKey) {
    if (!topicKey) return Promise.resolve(false);
    kapat();
    return kartlar(topicKey).then(function (liste) {
      var konuAdi = String(topicKey).indexOf(" > ") > 0 ? String(topicKey).split(" > ").slice(1).join(" > ") : String(topicKey);
      var modal = document.createElement("div");
      modal.id = MODAL_ID;
      modal.style.cssText = "position:fixed;inset:0;z-index:10050;display:flex;align-items:center;justify-content:center;background:rgba(10,16,32,.62);padding:14px;";

      var kutu = document.createElement("div");
      kutu.style.cssText = "width:100%;max-width:520px;max-height:90vh;overflow:auto;background:var(--bg-card,#fff);color:var(--text-main,#16213A);border-radius:16px;padding:18px;";

      if (!liste.length) {
        kutu.innerHTML =
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px;">' +
          '<b style="font-size:15px;">Tekrar Kartları</b>' +
          '<button type="button" data-kart-kapat style="min-width:44px;min-height:44px;border:0;background:none;font-size:22px;cursor:pointer;color:inherit;">×</button></div>' +
          '<p style="font-size:13px;line-height:1.55;margin:0;">Bu konuyla birebir eşleşen soru havuzu (ya da kart) bulunamadı. Başka konunun kartları gösterilmez.</p>';
        modal.appendChild(kutu);
        document.body.appendChild(modal);
        modal.addEventListener("click", function (e) {
          if (e.target === modal || e.target.closest("[data-kart-kapat]")) kapat();
        });
        return false;
      }

      var i = 0, acik = false, ozet = { bildi: 0, zorlandi: 0, bilemedi: 0 };
      var tekrar = []; // "bilemedi" kartlar

      function ciz() {
        if (i >= liste.length) { bitisCiz(); return; }
        var k = liste[i];
        kutu.innerHTML =
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px;">' +
          '<div><b style="font-size:15px;">Tekrar Kartı</b><div style="font-size:11px;opacity:.65;">' + esc(konuAdi) + " · " + (i + 1) + " / " + liste.length + "</div></div>" +
          '<button type="button" data-kart-kapat style="min-width:44px;min-height:44px;border:0;background:none;font-size:22px;cursor:pointer;color:inherit;">×</button></div>' +
          '<div style="min-height:120px;border:1px solid var(--border-card,#E5EAF3);border-radius:14px;padding:16px;background:var(--bg-canvas,#F6F8FC);display:flex;align-items:center;font-size:15px;line-height:1.55;font-weight:700;">' +
          esc(acik ? k.front : k.front) + "</div>" +
          (acik
            ? '<div style="margin-top:10px;border:1px solid var(--semantic-success,#16A34A);border-radius:14px;padding:14px;background:rgba(22,163,74,.07);font-size:14px;line-height:1.6;">' + esc(k.back) + "</div>" +
              '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px;">' +
              '<button type="button" class="btn btn-sm btn-success" data-kart-puan="bildi" style="min-height:46px;">Bildim</button>' +
              '<button type="button" class="btn btn-sm btn-ghost" data-kart-puan="zorlandi" style="min-height:46px;">Zorlandım</button>' +
              '<button type="button" class="btn btn-sm btn-danger" data-kart-puan="bilemedi" style="min-height:46px;">Bilemedim</button></div>'
            : '<button type="button" class="btn btn-primary w-full" data-kart-goster style="margin-top:12px;min-height:48px;">Cevabı göster</button>');
      }

      function bitisCiz() {
        var bilinen = ozet.bildi + ozet.zorlandi;
        kutu.innerHTML =
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:10px;">' +
          '<b style="font-size:15px;">Kart turu bitti</b>' +
          '<button type="button" data-kart-kapat style="min-width:44px;min-height:44px;border:0;background:none;font-size:22px;cursor:pointer;color:inherit;">×</button></div>' +
          '<div class="tabular" style="font-size:14px;line-height:1.9;">' +
          "<div>Bildim: <b>" + ozet.bildi + "</b></div>" +
          "<div>Zorlandım: <b>" + ozet.zorlandi + "</b></div>" +
          "<div>Bilemedim: <b>" + ozet.bilemedi + "</b></div>" +
          '<div style="margin-top:6px;font-size:12.5px;opacity:.75;">' + liste.length + " kartın " + bilinen + " tanesini biliyorsun.</div></div>" +
          '<div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;">' +
          (tekrar.length ? '<button type="button" class="btn btn-primary" data-kart-tekrar style="min-height:46px;">Bilemediklerimi tekrar sor (' + tekrar.length + ")</button>" : "") +
          '<button type="button" class="btn btn-ghost" data-kart-kapat style="min-height:46px;">Kapat</button></div>';
      }

      ciz();
      modal.appendChild(kutu);
      document.body.appendChild(modal);

      modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target.closest("[data-kart-kapat]")) { kapat(); return; }
        if (e.target.closest("[data-kart-goster]")) { acik = true; ciz(); return; }
        if (e.target.closest("[data-kart-tekrar]")) {
          liste = tekrar.slice(); tekrar = []; i = 0; acik = false;
          ozet = { bildi: 0, zorlandi: 0, bilemedi: 0 };
          ciz(); return;
        }
        var p = e.target.closest("[data-kart-puan]");
        if (p) {
          var puan = p.getAttribute("data-kart-puan");
          isaretle(topicKey, puan);
          ozet[puan] = (ozet[puan] || 0) + 1;
          if (puan === "bilemedi") tekrar.push(liste[i]);
          i++; acik = false; ciz();
        }
      });
      return true;
    }).catch(function () { return false; });
  }

  window.AmKart = { ac: ac, kartlar: kartlar, sayi: sayi, kayit: kayit, kapat: kapat };
})();
