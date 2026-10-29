/* ============================================================
   TEKRAR KARTLARI (FLASHCARD) — site/kart.js   v36
   ------------------------------------------------------------
   KULLANICI ŞİKÂYETLERİ (v36):
     • "flashcard ile testin görevleri farklıydı, ikisi aynı yerde olamaz"
     • "kartlar flashcard olacak, gerçekten arkasına dönecek"
     • "konunun tekrar edilmesi için flashcardı tamamlamak zorunlu"
     • "flashcard sayısı raporlarda var"  (8 standart + 5 hata kartı)

   RAPOR (docs/Analiz_Merkezi_BKT_Dogrulama_Iliski_Grafi_Ajan_Raporu.md):
     §5.1 → üretim kartı (önce zihinden üret, sonra çevir); iki düğme
            Bildi / Bilemedi; konu başına EN FAZLA 8 standart + 5 hata kartı
     §5.2 → yalnız ONAYLANDI konu tekrar kuyruğuna girer; kart verisi BKT'ye
            doğrudan gözlem olarak GİRMEZ (yalnız yumuşak sinyal)
     §5.4 → Bildi: bar %100, S×1.6, günün tekrarı tamamlandı.
            Bilemedi: bar artmaz, günün tekrarı SAYILMAZ, kart ertesi gün
            yeniden gelir. Oturumun tamamlanması için kartların ≥ %70'i.

   BÖLÜM AYRIMI (kullanıcı: "ikisi aynı yerde olamaz"):
     • Kısa Kontrol (5 soru)  → Konu Takibi'nde konu satırında "Kısa Kontrol"
       düğmesi + motorun zamanlaması (precheck_due). Bu bir TESTTİR.
     • Tekrar kartları        → "Günlük Görevler" sayfasında ve "Tekrar
       Zamanı"nda kart ekranı. Bu bir TEKRARDIR.
     İkisi artık aynı kart/düğme içinde gösterilmez.

   GENEL API: window.AmKart
     ac(topicKey, secenek) → Promise<sonuç>  (sonuç: {ok, tamamlandi, bildi,
                              bilemedi, oran, kartSayisi})
     kartlar(topicKey)     → Promise<[{front, back, hataKarti}]>
     sayi(topicKey)        → Promise<number>   (en fazla 8+5)
     kayit(topicKey)       → {gorulen, bildi, zorlandi, bilemedi, sonTarih, tamamlandi}
     tekrarDurumu(topicKey)→ Promise<{zorunlu, kartSayisi, tamamlandi, oran}>
     gununKartlari()       → Promise<[{topicKey, kartSayisi}]>  (bugün tekrarı
                              gelen konular)
   ============================================================ */
(function () {
  "use strict";
  if (typeof window === "undefined" || typeof document === "undefined") return;

  var MODAL_ID = "kart-modal";
  var TAVAN = { standart: 8, hata: 5 };   // rapor §5.1
  var OTURUM_ESIGI = 0.70;                // rapor §5.4
  var HAFIZA_SINIRI = 20;                 // rapor §5.2 kural 2

  function esc(x) {
    return String(x == null ? "" : x)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function dizi(x) { return Array.isArray(x) ? x : []; }
  function nesne(x) { return x && typeof x === "object" && !Array.isArray(x); }
  function bugun() {
    try { if (typeof todayStr === "function") return todayStr(); } catch (e) { /* */ }
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function durum() {
    try { return (typeof state !== "undefined" && state) ? state : null; } catch (e) { return null; }
  }
  function kaydet() {
    try { if (typeof saveState === "function") saveState(); } catch (e) { /* */ }
  }
  function BKT() { return window.AnalizBKT || null; }

  // ---------------------------------------------------------------- VERİ
  function havuzId(topicKey) {
    try {
      var A = BKT();
      if (A && typeof A.konuDurum === "function") {
        var d = A.konuDurum(topicKey);
        if (d && d.poolId) return d.poolId;
      }
      if (typeof window.__havuzIdCoz === "function") return window.__havuzIdCoz(topicKey, null);
    } catch (e) { /* */ }
    return null;
  }

  /**
   * Kart listesi: motorun kart defteri (ONAYLANDI konularda oluşur) + havuzdaki
   * `flashcards[]` / soru içi `flashcard`. Tavan: 8 standart + 5 hata kartı.
   */
  function kartlar(topicKey) {
    var out = [], gorulen = {};
    var s = durum();
    var defter = s && nesne(s.flashcards) && dizi(s.flashcards.cards)
      ? s.flashcards.cards.filter(function (c) { return c && c.topicKey === topicKey; }) : [];
    var hata = defter.filter(function (c) { return !!c.errorCard; });
    var std = defter.filter(function (c) { return !c.errorCard; });

    function ekle(on, arka, hataKarti) {
      if (!on || !arka) return;
      var k = String(on).trim();
      if (!k || gorulen[k]) return;
      gorulen[k] = 1;
      out.push({ front: k, back: String(arka).trim(), hataKarti: !!hataKarti });
    }

    hata.slice(-TAVAN.hata).forEach(function (c) { ekle(c.front, c.back, true); });
    std.slice(0, TAVAN.standart).forEach(function (c) { ekle(c.front, c.back, false); });

    var id = havuzId(topicKey);
    var A = BKT();
    if (out.length < TAVAN.standart + TAVAN.hata && id && A && typeof A.loadPool === "function") {
      return Promise.resolve(A.loadPool(id)).then(function (pool) {
        if (pool) {
          dizi(pool.flashcards).forEach(function (k) {
            if (out.length >= TAVAN.standart + TAVAN.hata) return;
            ekle(k && (k.front || k.on), k && (k.back || k.arka), false);
          });
          dizi(pool.sorular).forEach(function (q) {
            if (out.length >= TAVAN.standart + TAVAN.hata) return;
            var k = q && q.flashcard;
            ekle(k && (k.front || k.on), k && (k.back || k.arka), false);
          });
        }
        return out;
      }).catch(function () { return out; });
    }
    return Promise.resolve(out);
  }

  function sayi(topicKey) { return kartlar(topicKey).then(function (l) { return l.length; }); }

  function kayit(topicKey) {
    var s = durum();
    if (!s) return { gorulen: 0, bildi: 0, zorlandi: 0, bilemedi: 0, sonTarih: null, tamamlandi: null };
    s.tekrarKartlari = nesne(s.tekrarKartlari) ? s.tekrarKartlari : {};
    s.tekrarKartlari[topicKey] = s.tekrarKartlari[topicKey] ||
      { gorulen: 0, bildi: 0, zorlandi: 0, bilemedi: 0, sonTarih: null, tamamlandi: null };
    return s.tekrarKartlari[topicKey];
  }

  /** Eski (v35.9) kart kayıtlarını tek biçime çevir: zorlandı yok, bildi/bilemedi var. */
  function migrate() {
    var s = durum();
    if (!s || !nesne(s.tekrarKartlari)) return;
    Object.keys(s.tekrarKartlari).forEach(function (k) {
      var r = s.tekrarKartlari[k] || {};
      if (r.zorlandi && !r.bildi) { r.bildi = r.zorlandi; }
      if (r.tamamlandi === undefined) r.tamamlandi = null;
      s.tekrarKartlari[k] = r;
    });
  }

  /** Bugün kart turu tamamlandı mı? (tamamlandi === bugünün tarihi) */
  function bugunTamam(topicKey) {
    var r = durum() && s_get(topicKey);
    return !!(r && r.tamamlandi === bugun());
  }
  function s_get(topicKey) {
    var s = durum();
    return s && nesne(s.tekrarKartlari) ? s.tekrarKartlari[topicKey] : null;
  }

  /**
   * Tekrar zorunluluğu: kartı olan konunun tekrarı, kart turu tamamlanmadan
   * "yapıldı" sayılmaz. Karta hiç sahip olmayan konu eski davranışta kalır.
   */
  function tekrarDurumu(topicKey) {
    return kartlar(topicKey).then(function (liste) {
      var r = s_get(topicKey) || {};
      return {
        zorunlu: liste.length > 0,
        kartSayisi: liste.length,
        tamamlandi: r.tamamlandi === bugun(),
        bugunBildi: Number(r.bildi) || 0,
        bugunBilemedi: Number(r.bilemedi) || 0
      };
    });
  }

  /** Bugün tekrarı gelen konular (hafıza motoru) + kart sayıları. */
  function gununKartlari() {
    var s = durum();
    if (!s || !nesne(s.memory)) return Promise.resolve([]);
    var bugunT = bugun();
    var anahtarlar = [];
    Object.keys(s.memory).forEach(function (key) {
      var mem = s.memory[key];
      if (!mem || !nesne(mem.schedule)) return;
      var geldi = Object.keys(mem.schedule).some(function (g) {
        return String(mem.schedule[g] || "") <= bugunT;
      });
      if (geldi) anahtarlar.push(key);
    });
    return Promise.all(anahtarlar.map(function (k) {
      return kartlar(k).then(function (l) { return { topicKey: k, kartSayisi: l.length, liste: l }; });
    })).then(function (r) { return r.filter(function (x) { return x.kartSayisi > 0; }); });
  }

  /**
   * Kart turu sonucunu işle (rapor §5.4).
   * Bildi → kart S×1.6, bar %100, günün tekrarı tamamlandı.
   * Bilemedi → bar artmaz, S çarpılmaz, günün tekrarı SAYILMAZ.
   * Oturum ≥ %70 bildiyse gün tamamlanır.
   */
  function sonucuIsle(topicKey, sonuc, liste) {
    var s = durum();
    if (!s) return;
    var r = kayit(topicKey);
    var bugunT = bugun();
    var toplam = liste.length || 1;
    var bilinen = sonuc.bildi;
    r.gorulen = (Number(r.gorulen) || 0) + toplam;
    r.bildi = (Number(r.bildi) || 0) + sonuc.bildi;
    r.bilemedi = (Number(r.bilemedi) || 0) + sonuc.bilemedi;
    r.sonTarih = bugunT;
    var oran = bilinen / toplam;

    var A = BKT();
    // Motorun kendi kart defteri varsa onu da güncelle (S, due, yumuşak düşüş).
    if (A && typeof A.flashcardReview === "function" && nesne(s.flashcards) && dizi(s.flashcards.cards)) {
      dizi(s.flashcards.cards).forEach(function (c) {
        if (!c || c.topicKey !== topicKey) return;
        var i = sonuc.detay.indexOf(c.front);
        // detay: [{front, bildi}] — aynı ön yüz birden fazla kartta olmaz
        if (i < 0) return;
        try { A.flashcardReview(c.id, sonuc.detay[i].bildi ? "Bildi" : "Bilemedi"); } catch (e) { /* */ }
      });
    }

    if (oran >= OTURUM_ESIGI) {
      r.tamamlandi = bugunT;
      // Hafıza barını %100'e çek + sonraki tekrarı yeniden kur (rapor §5.4).
      try {
        if (typeof window.__kartTamamla === "function") window.__kartTamamla(topicKey, false);
      } catch (e) { /* */ }
    } else {
      r.tamamlandi = null;   // gün SAYILMAZ; kartlar ertesi gün yeniden gelir
    }
    kaydet();
  }

  // ---------------------------------------------------------------- PENCERE
  function kapat() {
    var m = document.getElementById(MODAL_ID);
    if (m) m.remove();
  }

  function ac(topicKey, secenek) {
    if (!topicKey) return Promise.resolve({ ok: false });
    var o = secenek || {};
    kapat();
    return kartlar(topicKey).then(function (liste) {
      var konuAdi = String(topicKey).indexOf(" > ") > 0
        ? String(topicKey).split(" > ").slice(1).join(" > ") : String(topicKey);
      var modal = document.createElement("div");
      modal.id = MODAL_ID;
      modal.style.cssText = "position:fixed;inset:0;z-index:10050;display:flex;align-items:center;justify-content:center;background:rgba(10,16,32,.62);padding:14px;";

      var kutu = document.createElement("div");
      kutu.style.cssText = "width:100%;max-width:520px;max-height:90vh;overflow:auto;background:var(--bg-card,#fff);color:var(--text-main,#16213A);border-radius:16px;padding:18px;";

      function bitir(sonuc) {
        modal.appendChild(kutu);
        document.body.appendChild(modal);
        return sonuc;
      }

      if (!liste.length) {
        kutu.innerHTML =
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px;">' +
          '<b style="font-size:15px;">Tekrar Kartları</b>' +
          '<button type="button" data-kart-kapat style="min-width:44px;min-height:44px;border:0;background:none;font-size:22px;cursor:pointer;color:inherit;">×</button></div>' +
          '<p style="font-size:13px;line-height:1.55;margin:0;">Bu konuyla birebir eşleşen kart bulunamadı. Başka konunun kartları gösterilmez.</p>' +
          '<p style="font-size:12px;opacity:.7;margin:8px 0 0;">Kartlar, konu onaylandığında Bilgi Bankası maddelerinden üretilir. Kısa Kontrol buradan açılmaz — o Konu Takibi\'nde.</p>';
        return bitir({ ok: false, kartSayisi: 0 });
      }

      var i = 0, acik = false;
      var sonuc = { bildi: 0, bilemedi: 0, detay: [] };
      var sadeceBilemedi = Array.isArray(o.sadece) ? o.sadece.slice() : null;
      var tur = sadeceBilemedi ? sadeceBilemedi : liste;

      function ciz() {
        if (i >= tur.length) return bitisCiz();
        var k = tur[i];
        var on = esc(k.front);
        var cevap = esc(k.back);
        // GERÇEK FLASHCARD: arka yüz gizli, "Kartı çevir" ile açılır.
        kutu.innerHTML =
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px;">' +
          '<div><b style="font-size:15px;">Tekrar Kartı</b>' +
          '<div style="font-size:11px;opacity:.65;">' + esc(konuAdi) + " · " + (i + 1) + " / " + tur.length +
          (k.hataKarti ? " · hata kartı" : "") + "</div></div>" +
          '<button type="button" data-kart-kapat style="min-width:44px;min-height:44px;border:0;background:none;font-size:22px;cursor:pointer;color:inherit;">×</button></div>' +

          '<div class="kart-yuz" style="min-height:132px;border:1px solid var(--border-card,#E5EAF3);border-radius:14px;padding:16px;background:var(--bg-canvas,#F6F8FC);display:flex;align-items:center;justify-content:center;text-align:center;font-size:15.5px;line-height:1.55;font-weight:700;">' +
          on + "</div>" +

          (acik
            ? '<div class="kart-arka" style="margin-top:10px;border:1px solid var(--semantic-success,#16A34A);border-radius:14px;padding:14px;background:rgba(22,163,74,.07);font-size:14px;line-height:1.65;">' +
              '<div style="font-size:10.5px;font-weight:800;letter-spacing:.06em;opacity:.6;margin-bottom:4px;">ARKA YÜZ</div>' + cevap + "</div>" +
              '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;">' +
              '<button type="button" class="btn btn-sm btn-success" data-kart-puan="bildi" style="min-height:48px;">Bildim</button>' +
              '<button type="button" class="btn btn-sm btn-danger" data-kart-puan="bilemedi" style="min-height:48px;">Bilemedim</button></div>'
            : '<button type="button" class="btn btn-primary w-full" data-kart-goster style="margin-top:12px;min-height:50px;">Kartı çevir</button>' +
              '<div style="font-size:11.5px;opacity:.65;margin-top:6px;text-align:center;">Önce zihninden cevapla, sonra çevir.</div>');
      }

      function bitisCiz() {
        var oran = tur.length ? sonuc.bildi / tur.length : 0;
        var tamam = oran >= OTURUM_ESIGI;
        sonucuIsle(topicKey, sonuc, tur);
        kutu.innerHTML =
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:10px;">' +
          '<b style="font-size:15px;">Kart turu bitti</b>' +
          '<button type="button" data-kart-kapat style="min-width:44px;min-height:44px;border:0;background:none;font-size:22px;cursor:pointer;color:inherit;">×</button></div>' +
          '<div style="font-size:14px;line-height:1.9;">' +
          "<div>Bildim: <b>" + sonuc.bildi + "</b></div>" +
          "<div>Bilemedim: <b>" + sonuc.bilemedi + "</b></div>" +
          '<div style="margin-top:6px;font-weight:700;color:' + (tamam ? "var(--semantic-success,#16A34A)" : "var(--semantic-warning,#F5A623)") + ';">' +
          (tamam ? "✓ Günün tekrarı tamamlandı (≥ %70)" : "✗ Tekrar tamamlanmadı — en az %70 bilmen gerekiyor") + "</div>" +
          (tamam ? "" : '<div style="font-size:12px;opacity:.75;margin-top:4px;">Bilemediklerin yarın yeniden sorulacak; tekrar günü kapanmadı.</div>') +
          "</div>" +
          '<div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;">' +
          (!tamam && sonuc.bilemedi ? '<button type="button" class="btn btn-primary" data-kart-tekrar style="min-height:46px;">Bilemediklerimi tekrar sor (' + sonuc.bilemedi + ")</button>" : "") +
          '<button type="button" class="btn btn-ghost" data-kart-kapat style="min-height:46px;">Kapat</button></div>';
        return { ok: true, tamamlandi: tamam, bildi: sonuc.bildi, bilemedi: sonuc.bilemedi, oran: oran, kartSayisi: tur.length };
      }

      ciz();
      modal.appendChild(kutu);
      document.body.appendChild(modal);

      modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target.closest("[data-kart-kapat]")) { kapat(); return; }
        if (e.target.closest("[data-kart-goster]")) { acik = true; ciz(); return; }
        if (e.target.closest("[data-kart-tekrar]")) {
          tur = liste.filter(function (k) {
            return sonuc.detay.some(function (d) { return !d.bildi && d.front === k.front; });
          });
          if (!tur.length) return;
          sonuc = { bildi: 0, bilemedi: 0, detay: [] };
          i = 0; acik = false; ciz(); return;
        }
        var p = e.target.closest("[data-kart-puan]");
        if (p) {
          var bildi = p.getAttribute("data-kart-puan") === "bildi";
          if (bildi) sonuc.bildi++; else sonuc.bilemedi++;
          sonuc.detay.push({ front: tur[i].front, bildi: bildi });
          i++; acik = false; ciz();
        }
      });
      return Promise.resolve({ ok: true, acildi: true });
    }).catch(function () { return { ok: false }; });
  }

  migrate();
  window.AmKart = {
    ac: ac, kartlar: kartlar, sayi: sayi, kayit: kayit, kapat: kapat,
    tekrarDurumu: tekrarDurumu, gununKartlari: gununKartlari,
    sonucuIsle: sonucuIsle, migrate: migrate,
    TAVAN: TAVAN, OTURUM_ESIGI: OTURUM_ESIGI
  };
})();
