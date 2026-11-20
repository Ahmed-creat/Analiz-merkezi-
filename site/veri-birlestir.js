/* ============================================================
   VERİ BİRLEŞTİRME (site/veri-birlestir.js)
   ------------------------------------------------------------
   Sorun: her girişte "Buluttaki kayıt YERELDEKİ VERİLERİN ÜZERİNE
   yazılsın mı?" diye soruluyordu. Öğrenci her seferinde karar
   vermek zorunda kalıyor, "Evet" derse cihazda yaptığı çalışma
   gidebiliyordu.

   Çözüm: soru sormadan BİRLEŞTİR. Hiçbir kayıt silinmez:
     • denemeler / soru çözümleri  → aynı kayıt iki tarafta varsa
       daha çok hata kaydı olan (daha işlenmiş) kazanır
     • BKT (yeterlilik)            → gözlem sayısı büyük olan, eşitse
       L değeri büyük olan kazanır; hata geçmişleri birleşir
     • konular / hafıza            → ileri adım / daha çok tekrar
       olan kazanır
     • ayarlar, plan, kullanıcı    → yerel cihaz kazanır, yerelde
       boşsa buluttaki değer alınır

   Tarayıcıda:  <script src="veri-birlestir.js"></script> → window.VB
   Node'da    :  module.exports = VB
   ============================================================ */
(function (kok) {
  "use strict";

  function nesne(x) { return x && typeof x === "object" && !Array.isArray(x); }

  // veri-sikistir.js: tarayıcıda pencereye, Node'da require ile gelir.
  function sikistirici() {
    if (kok && kok.VeriSikistir) return kok.VeriSikistir;
    try { if (typeof require === "function") return require("./veri-sikistir.js"); } catch (e) { /* yoksa aşağıdaki yedek */ }
    return null;
  }
  function dizi(x) { return Array.isArray(x) ? x : []; }
  function sayi(x) { const n = Number(x); return isFinite(n) ? n : 0; }

  // Boş değerler ("" / null / undefined) karşı tarafı EZMESİN.
  // Gerçek olay: Profil → Okulizyon kimliği bulutta duruyordu, uygulamanın
  // eski bir sekmesi boş ayarla kaydedince kimlik silindi ve otomatik çekim
  // "kimlik yok" dedi. Bu yüzden yerel değer yalnız DOLU ise kazanır.
  function dolu(x) {
    const r = {};
    if (!nesne(x)) return r;
    Object.keys(x).forEach(function (k) {
      const v = x[k];
      if (v === "" || v === null || v === undefined) return;
      if (nesne(v) && !Object.keys(v).length) return;
      r[k] = v;
    });
    return r;
  }

  // Bir kayıt ne kadar "işlenmiş"? (daha çok bilgi taşıyan kazanır)
  function agirlik(x) {
    if (!nesne(x)) return 0;
    return dizi(x.errorLogs).length * 100 + dizi(x.rows).length * 50 +
      Object.keys(nesne(x.lessons) ? x.lessons : {}).length;
  }

  function anahtar(ex, alanlar) {
    const alan = alanlar || ["id"];
    for (let i = 0; i < alan.length; i++) {
      const k = String((ex && ex[alan[i]]) || "");
      if (k) return alan[i] + ":" + k;
    }
    return "ad:" + String((ex && ex.name) || "") + "|" + String((ex && ex.date) || "");
  }

  /**
   * İki listeyi kimliğe göre birleştirir; hiçbir kayıt atılmaz.
   * Çakışmada `yeğle(a, b)` → hangisi tutulacak.
   */
  function listeBirlestir(yerel, uzak, alanlar, yeğle) {
    const harita = new Map();
    dizi(yerel).forEach(x => harita.set(anahtar(x, alanlar), x));
    dizi(uzak).forEach(x => {
      const k = anahtar(x, alanlar);
      if (!harita.has(k)) { harita.set(k, x); return; }
      const a = harita.get(k);
      harita.set(k, (yeğle || agirlikYeğle)(a, x));
    });
    return Array.from(harita.values());
  }
  function agirlikYeğle(a, b) { return agirlik(b) > agirlik(a) ? b : a; }

  // BKT kaydı: gözlem sayısı çok olan; eşitse yeterlilik (L) yüksek olan
  function bktBirlestir(a, b) {
    if (!nesne(a)) return b;
    if (!nesne(b)) return a;
    const n1 = sayi(a.gozlem_sayisi), n2 = sayi(b.gozlem_sayisi);
    let ana = a, yan = b;
    if (n2 > n1 || (n2 === n1 && sayi(b.L) > sayi(a.L))) { ana = b; yan = a; }
    const cikti = Object.assign({}, yan, ana);
    cikti.gozlem_sayisi = Math.max(n1, n2);
    cikti.L = Math.max(sayi(a.L), sayi(b.L));
    // v36 — KÖK NEDEN DÜZELTMESİ: burada iki dizi koşulsuz birleştiriliyordu.
    // Her girişte (senkron) aynı kayıtlar tekrar eklendiği için tek konunun
    // hata geçmişi 7.680 kayda çıktı ve bulut/localStorage taştı.
    // Artık tekilleştirilir + 40 kayıtta tutulur (veri-sikistir.js ile aynı kural).
    const VS = sikistirici();
    const ham = dizi(a.hata_gecmisi).concat(dizi(b.hata_gecmisi));
    cikti.hata_gecmisi = VS ? VS.tekilKirp(ham, VS.SINIR.hata_gecmisi) : ham.slice(-40);
    const SIRA = { VERI_YETERSIZ: 0, GELISIYOR: 1, PEKISIYOR: 2, RISKLI: 3, ONAYLANDI: 4 };
    const s1 = SIRA[a.onay_durumu] || 0, s2 = SIRA[b.onay_durumu] || 0;
    if (s1 !== s2) cikti.onay_durumu = s1 > s2 ? a.onay_durumu : b.onay_durumu;
    return cikti;
  }

  // "Ders > Konu" haritaları: ileri olan kazanır (adım / tekrar sayısı)
  function konuHaritasiBirlestir(yerel, uzak, puan) {
    const cikti = {};
    const al = (h) => (nesne(h) ? h : {});
    const y = al(yerel), u = al(uzak);
    const p = puan || function (x) {
      if (!nesne(x)) return 0;
      return sayi(x.step) * 10 + sayi(x.reviewCount) * 5 + (x.completedAt ? 100 : 0) + (x.lastReview ? 1 : 0);
    };
    Object.keys(y).forEach(k => { cikti[k] = y[k]; });
    Object.keys(u).forEach(k => {
      if (!(k in cikti)) { cikti[k] = u[k]; return; }
      const a = cikti[k], b = u[k];
      cikti[k] = p(b) > p(a) ? b : a;
    });
    return cikti;
  }

  // Sayaç/nesne haritaları (bkt_processed_records, aktarilan, islenen, badges…)
  function nesneBirlestir(yerel, uzak) {
    const cikti = {};
    const y = nesne(yerel) ? yerel : {}, u = nesne(uzak) ? uzak : {};
    Object.keys(y).forEach(k => { cikti[k] = y[k]; });
    Object.keys(u).forEach(k => { if (!(k in cikti)) cikti[k] = u[k]; });
    return cikti;
  }

  /**
   * yerel: bu cihazdaki state (kullanıcının şu anki çalışması)
   * uzak : buluttaki state
   * Dönen: hiçbir veri kaybetmeyen birleşik state.
   */
  function birlestir(yerel, uzak) {
    const y = nesne(yerel) ? yerel : {};
    const u = nesne(uzak) ? uzak : {};
    const cikti = Object.assign({}, y);

    // Kimlik bilgileri: yerel doluysa yerel, boşsa bulut
    const yu = nesne(y.user) ? y.user : {}, uu = nesne(u.user) ? u.user : {};
    cikti.user = Object.assign({}, uu, yu);
    ["name", "grade", "joined"].forEach(k => { if (!cikti.user[k] && uu[k]) cikti.user[k] = uu[k]; });

    cikti.exams = listeBirlestir(y.exams, u.exams, ["id"]);
    cikti.questions = listeBirlestir(y.questions, u.questions, ["id"]);
    cikti.books = listeBirlestir(y.books, u.books, ["id"]);
    cikti.topics = konuHaritasiBirlestir(y.topics, u.topics);
    cikti.memory = konuHaritasiBirlestir(y.memory, u.memory, function (x) {
      if (!nesne(x)) return 0;
      return sayi(x.reviewCount) * 10 + (x.completedAt ? 100 : 0) + (x.lastReview ? 1 : 0);
    });

    // BKT: konu bazında birleştir
    cikti.bkt_state = {};
    const yb = nesne(y.bkt_state) ? y.bkt_state : {}, ub = nesne(u.bkt_state) ? u.bkt_state : {};
    Object.keys(yb).forEach(k => { cikti.bkt_state[k] = yb[k]; });
    Object.keys(ub).forEach(k => { cikti.bkt_state[k] = k in cikti.bkt_state ? bktBirlestir(cikti.bkt_state[k], ub[k]) : ub[k]; });

    cikti.bkt_processed_records = nesneBirlestir(y.bkt_processed_records, u.bkt_processed_records);
    cikti.mini_test_kuyrugu = listeBirlestir(y.mini_test_kuyrugu, u.mini_test_kuyrugu, ["topicKey", "id"]);
    cikti.mini_test_sessions = nesneBirlestir(y.mini_test_sessions, u.mini_test_sessions);
    cikti.soru_havuzu_gosterim_logu = listeBirlestir(
      y.soru_havuzu_gosterim_logu, u.soru_havuzu_gosterim_logu, ["konu_id", "soru_id"]);
    cikti.notifications = listeBirlestir(y.notifications, u.notifications, ["id"], function (a, b) {
      return String((b && b.date) || "") > String((a && a.date) || "") ? b : a;
    }).sort(function (a, b) {
      return String((b && b.date) || "").localeCompare(String((a && a.date) || ""));
    }).slice(0, 200);

    // Ayarlar: yerel kazanır ama bulutta olup yerelde olmayan anahtar eklenir
    cikti.settings = nesneBirlestir(y.settings, u.settings);
    if (nesne(y.settings) && nesne(u.settings)) {
      cikti.settings = Object.assign({}, u.settings, dolu(y.settings));
      if (nesne(u.settings.okulizyon) || nesne(y.settings.okulizyon)) {
        cikti.settings.okulizyon = Object.assign(
          {},
          nesne(u.settings.okulizyon) ? u.settings.okulizyon : {},
          dolu(nesne(y.settings.okulizyon) ? y.settings.okulizyon : {})
        );
        if (!cikti.settings.okulizyon.islenen) cikti.settings.okulizyon.islenen = {};
      }
    }
    cikti.plan = nesneBirlestir(y.plan, u.plan);
    if (nesne(y.plan) && nesne(u.plan)) cikti.plan = Object.assign({}, u.plan, y.plan);

    // Okulizyon defteri: iki taraftaki "işlendi/yoksayıldı" kayıtları korunur
    const yOkz = nesne(y.okulizyon) ? y.okulizyon : {}, uOkz = nesne(u.okulizyon) ? u.okulizyon : {};
    if (Object.keys(yOkz).length || Object.keys(uOkz).length) {
      cikti.okulizyon = Object.assign({}, uOkz, yOkz);
      cikti.okulizyon.islenen = nesneBirlestir(yOkz.islenen, uOkz.islenen);
      cikti.okulizyon.pending = listeBirlestir(yOkz.pending, uOkz.pending, ["name", "date"]);
      cikti.okulizyon.importedKeys = Array.from(new Set(dizi(yOkz.importedKeys).concat(dizi(uOkz.importedKeys))));
      cikti.okulizyon.aktarilan = nesneBirlestir(yOkz.aktarilan, uOkz.aktarilan);
    }

    cikti.flashcards = Object.assign({}, nesne(u.flashcards) ? u.flashcards : {}, nesne(y.flashcards) ? y.flashcards : {});
    if (nesne(y.flashcards) || nesne(u.flashcards)) {
      const yf = nesne(y.flashcards) ? y.flashcards : {}, uf = nesne(u.flashcards) ? u.flashcards : {};
      cikti.flashcards.cards = listeBirlestir(yf.cards, uf.cards, ["id"]);
      cikti.flashcards.sessions = nesneBirlestir(yf.sessions, uf.sessions);
    }

    cikti.dailyTasks = nesneBirlestir(y.dailyTasks, u.dailyTasks);
    if (nesne(y.dailyTasks) && nesne(u.dailyTasks)) {
      // Aynı gün: yerel (şu anki cihaz) kazanır; farklı gün: yeni tarih kazanır
      const yt = String(y.dailyTasks.date || ""), ut = String(u.dailyTasks.date || "");
      cikti.dailyTasks = yt >= ut ? Object.assign({}, u.dailyTasks, y.dailyTasks) : Object.assign({}, y.dailyTasks, u.dailyTasks);
    }
    cikti.badges = nesneBirlestir(y.badges, u.badges);
    return cikti;
  }

  // Hiç veri var mı? (birleştirmeden sonra "kayıp var mı" kontrolü için)
  function ozet(s) {
    const x = nesne(s) ? s : {};
    return {
      deneme: dizi(x.exams).length,
      soru: dizi(x.questions).length,
      kitap: dizi(x.books).length,
      konu: Object.keys(nesne(x.topics) ? x.topics : {}).length,
      bkt: Object.keys(nesne(x.bkt_state) ? x.bkt_state : {}).length,
      hata: dizi(x.exams).concat(dizi(x.questions)).reduce(function (a, e) { return a + dizi(e && e.errorLogs).length; }, 0)
    };
  }

  const VB = { birlestir: birlestir, bktBirlestir: bktBirlestir, listeBirlestir: listeBirlestir, ozet: ozet, anahtar: anahtar, agirlik: agirlik };
  if (typeof module !== "undefined" && module.exports) module.exports = VB;
  if (kok) kok.VB = VB;
})(typeof window !== "undefined" ? window : globalThis);
