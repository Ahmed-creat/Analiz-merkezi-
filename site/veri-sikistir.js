/* ============================================================
   VERİ SIKIŞTIRMA — site/veri-sikistir.js   v36
   ------------------------------------------------------------
   KÖK NEDEN (ölçüldü): kullanıcının bulut kaydı 5.868.448 bayttı.
   Bunun 5.820.607 baytı `bkt_state` içindeydi ve TEK bir konunun
   `hata_gecmisi` dizisi 7.680 kayıt tutuyordu (motor 100'de kesiyor).

   Nasıl oldu: bulut birleştirme (`veri-birlestir.js → bktBirlestir`,
   `app-pwa.js → okzbktBirlestir`) her senkronda iki tarafın
   `hata_gecmisi` dizilerini KOŞULSUZ birleştiriyordu. Aynı kayıtlar
   her girişte tekrar eklendi: 100 → 200 → 400 … → 7.680.
   Sonuç: localStorage kotası doldu ve uygulama her kayıtta
   "Veri kaydedilemedi: depolama dolu olabilir" diyordu.

   Bu dosya iki iş yapar:
     1) TEKİLLEŞTİRME — aynı hata kaydı bir kez tutulur.
     2) SIKIŞTIRMA — sınırsız büyüyebilen diziler son N kayda indirilir.

   Kullanıcı verisi SİLİNMEZ: yalnız tekrarlar ve en eski kayıtlar atılır.
   Tekrar çalıştırmak zararsızdır (idempotent).

   Tarayıcı: <script src="veri-sikistir.js"></script> → window.VeriSikistir
   Node    : module.exports = VeriSikistir
   ============================================================ */
(function (kok) {
  "use strict";

  // Sınırlar: normal / acil (kota dolduğunda)
  var SINIR = {
    hata_gecmisi: 40,
    hata_gecmisi_acil: 10,
    processed: 3000,
    processed_acil: 500,
    notifications: 80,
    notifications_acil: 20,
    gosterim: 200,
    oturum: 60,
    kart_standart: 8,
    kart_hata: 5
  };

  function dizi(x) { return Array.isArray(x) ? x : []; }
  function nesne(x) { return x && typeof x === "object" && !Array.isArray(x); }

  /** Hata kaydı için tekilleştirme anahtarı (tarih + tür + kaynak + alt beceri). */
  function hataAnahtari(g) {
    if (!g || typeof g !== "object") return "";
    return [g.date || g.tarih || "", g.type || g.reason || "", g.source || g.kaynak || "", g.alt_beceri || ""].join("|");
  }

  /**
   * Diziyi sondan (en yeni) başa tarar, tekrarları atar, `sinir` kadar tutar.
   * Dönen dizi ESKİDEN YENİYE sıralıdır (motorun beklediği yön).
   */
  function tekilKirp(liste, sinir, anahtarFn) {
    var a = dizi(liste);
    var fn = anahtarFn || hataAnahtari;
    var gorulen = Object.create(null);
    var secilen = [];
    for (var i = a.length - 1; i >= 0 && secilen.length < sinir; i--) {
      var k = fn(a[i], i);
      if (k && gorulen[k]) continue;
      if (k) gorulen[k] = 1;
      secilen.push(a[i]);
    }
    secilen.reverse();
    return secilen;
  }

  function bayt(deger) {
    try { return JSON.stringify(deger).length; } catch (e) { return 0; }
  }

  /**
   * Durumu sıkıştırır. `state` yerinde değişir; rapor döner.
   * @param {object} state         uygulama durumu
   * @param {object} [secenek]     {acil:boolean}
   */
  function sikistir(state, secenek) {
    var acil = !!(secenek && secenek.acil);
    var rap = { oncekiBayt: 0, sonrakiBayt: 0, kazanilan: 0, hataTekrar: 0, hataKirpilan: 0, kartTemizlenen: 0, islem: [] };
    if (!nesne(state)) return rap;
    rap.oncekiBayt = bayt(state);

    var sinirHata = acil ? SINIR.hata_gecmisi_acil : SINIR.hata_gecmisi;

    // ---- 1) bkt_state: hata geçmişi tekilleştirme + kesme ----
    if (nesne(state.bkt_state)) {
      Object.keys(state.bkt_state).forEach(function (key) {
        var e = state.bkt_state[key];
        if (!nesne(e)) return;
        var liste = dizi(e.hata_gecmisi);
        if (!liste.length) { if (e.hata_gecmisi !== undefined) e.hata_gecmisi = []; return; }
        var onceki = liste.length;
        // kaç tanesi tekrar? (sınırdan bağımsız)
        var gorulen = Object.create(null), tekil = 0;
        liste.forEach(function (g) { var k = hataAnahtari(g) || ("idx" + tekil); if (!gorulen[k]) { gorulen[k] = 1; tekil++; } });
        var yeni = tekilKirp(liste, sinirHata);
        rap.hataTekrar += Math.max(0, onceki - tekil);
        rap.hataKirpilan += Math.max(0, tekil - yeni.length);
        if (yeni.length !== onceki) e.hata_gecmisi = yeni;
      });
      if (rap.hataTekrar || rap.hataKirpilan) rap.islem.push("hata geçmişi: " + rap.hataTekrar + " mükerrer, " + rap.hataKirpilan + " eski kayıt atıldı");
    }

    // ---- 2) bkt_processed_records: en yeni N kayıt ----
    var procSinir = acil ? SINIR.processed_acil : SINIR.processed;
    if (nesne(state.bkt_processed_records)) {
      var pk = Object.keys(state.bkt_processed_records);
      if (pk.length > procSinir) {
        var atilan = pk.length - procSinir;
        var yeniProc = {};
        pk.slice(atilan).forEach(function (k) { yeniProc[k] = state.bkt_processed_records[k]; });
        state.bkt_processed_records = yeniProc;
        rap.islem.push("işlenmiş kayıt defteri: " + atilan + " eski anahtar atıldı");
      }
    }

    // ---- 3) bildirimler: en yeni N ----
    var notSinir = acil ? SINIR.notifications_acil : SINIR.notifications;
    if (Array.isArray(state.notifications) && state.notifications.length > notSinir) {
      var nAtilan = state.notifications.length - notSinir;
      state.notifications = state.notifications.slice(nAtilan);
      rap.islem.push("bildirim geçmişi: " + nAtilan + " eski bildirim atıldı");
    }

    // ---- 4) gösterim günlüğü ----
    if (Array.isArray(state.soru_havuzu_gosterim_logu) && state.soru_havuzu_gosterim_logu.length > SINIR.gosterim) {
      state.soru_havuzu_gosterim_logu = state.soru_havuzu_gosterim_logu.slice(-SINIR.gosterim);
      rap.islem.push("soru gösterim günlüğü kısaltıldı");
    }

    // ---- 5) mini test oturumları: en yeni N ----
    if (nesne(state.mini_test_sessions)) {
      var mk = Object.keys(state.mini_test_sessions);
      if (mk.length > SINIR.oturum) {
        var mYeni = {};
        mk.slice(-SINIR.oturum).forEach(function (k) { mYeni[k] = state.mini_test_sessions[k]; });
        state.mini_test_sessions = mYeni;
        rap.islem.push("mini test oturumları: " + (mk.length - SINIR.oturum) + " eski oturum atıldı");
      }
    }

    // ---- 6) flashcard kartları: konu başına tavanlar (8 standart / 5 hata) ----
    if (nesne(state.flashcards) && Array.isArray(state.flashcards.cards)) {
      var sayac = Object.create(null);
      var temiz = [];
      state.flashcards.cards.forEach(function (c) {
        if (!nesne(c)) { rap.kartTemizlenen++; return; }
        var k = String(c.topicKey || "");
        if (!k) { rap.kartTemizlenen++; return; }
        var tur = c.errorCard ? "h" : "s";
        sayac[k] = sayac[k] || { s: 0, h: 0 };
        var tavan = tur === "h" ? SINIR.kart_hata : SINIR.kart_standart;
        if (sayac[k][tur] >= tavan) { rap.kartTemizlenen++; return; }
        sayac[k][tur]++;
        temiz.push(c);
      });
      if (temiz.length !== state.flashcards.cards.length) {
        state.flashcards.cards = temiz;
        rap.islem.push("flashcard: " + rap.kartTemizlenen + " fazla kart atıldı");
      }
    }

    rap.sonrakiBayt = bayt(state);
    rap.kazanilan = Math.max(0, rap.oncekiBayt - rap.sonrakiBayt);
    return rap;
  }

  /** Durumun bayt cinsinden büyüklüğü (kabaca: JSON uzunluğu). */
  function boyut(state) { return bayt(state); }

  /** En büyük 8 alan — teşhis için. */
  function enBuyukler(state, adet) {
    var n = adet || 8;
    if (!nesne(state)) return [];
    return Object.keys(state).map(function (k) {
      return { alan: k, bayt: bayt(state[k]) };
    }).sort(function (a, b) { return b.bayt - a.bayt; }).slice(0, n);
  }

  var API = { sikistir: sikistir, tekilKirp: tekilKirp, hataAnahtari: hataAnahtari, boyut: boyut, enBuyukler: enBuyukler, SINIR: SINIR };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  if (kok && typeof kok === "object") kok.VeriSikistir = API;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));
