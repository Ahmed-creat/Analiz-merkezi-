/* ============================================================
   OKULİZYON DERS ADI NORMALİZASYONU (site/okz-normalize.js)
   Sorun: Okulizyon ders adları uygulamanın beklediği adlarla birebir
   uyuşmuyor ("Matematik-1" ≠ "Matematik", "Din Kül. ve Ahl. Bil." ≠
   "Din Kültürü", "Türkçe" ≠ "Türk Dili ve Edebiyatı"). Bu yüzden
   çekilen 9 dersten yalnız 4'ü Denemelerim/Konu Takibi'nde görünüyordu.
   Bu modül adları gruplar, uygulamanın bildiği ada çevirir ve aynı derse
   düşenleri (Matematik-1 + Matematik-2) toplayarak birleştirir.
   Klasik script + CommonJS dışa aktarım (testler doğrudan okur).
   ============================================================ */
(function (kok) {
  "use strict";

  // Uygulamanın varsayılan ders adları (grade config yoksa)
  const VARSAYILAN = {
    tde: "Türk Dili ve Edebiyatı",
    tarih: "Tarih",
    cografya: "Coğrafya",
    matematik: "Matematik",
    din: "Din Kültürü",
    felsefe: "Felsefe",
    fizik: "Fizik",
    kimya: "Kimya",
    biyoloji: "Biyoloji"
  };

  function sade(s) {
    return String(s == null ? "" : s)
      .replace(/ı/g, "i").replace(/İ/g, "i").replace(/I/g, "i")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s*-\s*\d+\s*$/, "")   // "Matematik-1", "Tarih - 2" → "-N" at
      .replace(/\s*\b\d+\s*$/, "")     // "Matematik 1" → sondaki sayı
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Ad → grup. Sıra önemli: daha özel desenler önce.
  const DESENLER = [
    [/^(turk dili( ve edebiyati)?|tde|edebiyat|turkce)$/, "tde"],
    [/^din( kulturu)?( ve ahlak bilgisi)?$/, "din"],
    [/^din kul\w*/, "din"],
    [/^tarih$/, "tarih"],
    [/^cografya$/, "cografya"],
    [/^matematik$/, "matematik"],
    [/^felsefe$/, "felsefe"],
    [/^fizik$/, "fizik"],
    [/^kimya$/, "kimya"],
    [/^biyoloji$/, "biyoloji"]
  ];

  function grup(ad) {
    const s = sade(ad);
    if (!s) return null;
    for (const [re, g] of DESENLER) if (re.test(s)) return g;
    // "matematik 1", "turkce 2" gibi ekler zaten sade() ile atıldı
    return null;
  }

  // Grubu bilinen bir ada çevir: önce uygulamanın kendi listesindeki ad,
  // yoksa varsayılan ad. Tanınmayan ders olduğu gibi kalır (veri kaybı yok).
  function kanonik(ad, bilinenler) {
    const g = grup(ad);
    if (!g) return String(ad == null ? "" : ad).trim();
    if (Array.isArray(bilinenler)) {
      const eslesen = bilinenler.find((b) => grup(b) === g);
      if (eslesen) return eslesen;
    }
    return VARSAYILAN[g] || String(ad).trim();
  }

  // Aynı kanonik ada düşen dersleri topla (d/w/e toplanır)
  function birlestir(lessons, bilinenler) {
    const out = {};
    const kaynak = lessons && typeof lessons === "object" ? lessons : {};
    for (const ad of Object.keys(kaynak)) {
      const v = kaynak[ad] || {};
      const k = kanonik(ad, bilinenler);
      if (!k) continue;
      if (!out[k]) out[k] = { d: 0, w: 0, e: 0 };
      out[k].d += Number(v.d) || 0;
      out[k].w += Number(v.w) || 0;
      out[k].e += Number(v.e) || 0;
    }
    return out;
  }

  function net(d, w) {
    const D = Number(d) || 0, W = Number(w) || 0;
    return Math.round((D - W / 4) * 100) / 100;
  }

  // Ders sözlüğünden toplam D/Y/B/Net
  function toplam(lessons) {
    let d = 0, w = 0, e = 0;
    Object.keys(lessons || {}).forEach((k) => {
      d += Number(lessons[k].d) || 0;
      w += Number(lessons[k].w) || 0;
      e += Number(lessons[k].e) || 0;
    });
    return { d, w, e, soru: d + w + e, net: net(d, w) };
  }

  // Eski (yanlış adlarla kaydedilmiş) denemeleri onarır. Saf fonksiyon.
  function duzelt(exams, bilinenler) {
    let degisti = 0;
    const out = (Array.isArray(exams) ? exams : []).map((ex) => {
      if (!ex || !ex.lessons || typeof ex.lessons !== "object") return ex;
      const yeni = birlestir(ex.lessons, bilinenler);
      const eskiK = Object.keys(ex.lessons), yeniK = Object.keys(yeni);
      const ayni = eskiK.length === yeniK.length &&
        yeniK.every((k) => ex.lessons[k] && (Number(ex.lessons[k].d) || 0) === yeni[k].d &&
          (Number(ex.lessons[k].w) || 0) === yeni[k].w && (Number(ex.lessons[k].e) || 0) === yeni[k].e);
      if (ayni) return ex;
      degisti++;
      const t = toplam(yeni);
      const errorLogs = Array.isArray(ex.errorLogs)
        ? ex.errorLogs.map((l) => (l ? Object.assign({}, l, { lesson: kanonik(l.lesson, bilinenler) }) : l))
        : ex.errorLogs;
      return Object.assign({}, ex, { lessons: yeni, total: t.soru, net: t.net, errorLogs });
    });
    return { exams: out, degisti };
  }

  // Okulizyon'dan gelen sınav listesiyle uygulamadaki denemeleri karşılaştırır.
  // "Aktarılmış" kabulü KAYIT DEFTERİNE değil, Denemelerim'de gerçekten
  // durup durmadığına dayanır: deneme silinmişse sınav yeniden "yeni" sayılır.
  // Sınavın içerik parmak izi. İki tarafı da AYNI normalizasyondan geçirir:
  // ham Okulizyon adları ("Matematik-1") ile uygulama adları ("Matematik")
  // aynı hash'i versin.
  function kararHash(ex) {
    const adi = (x) => {
      const n = (x && x.name) || "Sınav";
      return n.indexOf("Okulizyon: ") === 0 ? n : "Okulizyon: " + n;
    };
    const l = birlestir((ex && ex.lessons) || {});
    return [adi(ex), (ex && ex.date) || "",
      Object.keys(l).sort().map((k) => k + ":" + (Number(l[k].d) || 0) + "," + (Number(l[k].w) || 0) + "," + (Number(l[k].e) || 0)).join(";")].join("|");
  }

  // v93 — OKULİZYON SINAV KİMLİĞİ = AD + TARİH (sid DEĞİL)
  // KULLANICI: "birden fazla varsa doğru şekilde birbirine karışmadan
  // çekilebiliyor mu?"
  /* v93 — KULLANICI (19 Kas): "Aynı deneme bugün kendiliğinden 2. kez
     eklendi."  ÖLÇÜM (canlı `app_states`): aynı kullanıcıda AYNI sınav iki
     satır — "Okulizyon: 10.SINIF MAARİF İZLEME SINAVI 1" · 2026-10-27 ·
     net 77,5 · 120 soru · 39 hata · iki AYRI `okulizyonUrl`.
     Kök neden: v46c kimliği `sid`e bağlamıştı. Oysa Okulizyon'un sonuç
     bağlantısındaki `sid` ( ?pg=yks&sid=… ) OTURUM jetonudur: her giriş/
     çekimde YENİ üretilir. Aynı sınav iki çekimde iki farklı sid aldığı için
     "başka sınav" sanılıp ikinci kez yazıldı; üstelik hata kayıtları da
     ikiye katlandı (öncelik puanları şişti).
     YENİ KURAL: kimlik = SINAV ADI + TARİH (+ içerik).
       • ad + tarih aynı, içerik aynı   → AYNI sınav (mükerrer yazılmaz)
       • ad + tarih aynı, içerik farklı → sonucu DEĞİŞMİŞ (güncelleme adayı)
       • ad ya da tarih farklı          → yeni sınav
     sid yalnız "aynı sayfa" bilgisidir; kimlik olarak KULLANILMAZ. */
  // Okulizyon sonuç sayfası bağlantısından oturum jetonu (kimlik DEĞİL).
  function sidCikar(url) {
    const m = /[?&]sid=([^&]+)/i.exec(String(url || ""));
    if (!m) return "";
    try { return decodeURIComponent(m[1]); } catch (e) { return m[1]; }
  }
  function siniSid(ex) { return sidCikar(ex && (ex.url || ex.okulizyonUrl)); }
  // Eski (sid'siz) defter anahtarı — geriye dönük uyumluluk için korunur.
  function kararEskiAnahtar(ex) {
    return ((ex && ex.name) || "?") + "|" + ((ex && ex.date) || "");
  }
  // Sınav anahtarı: her zaman "ad|tarih" (sid jetonu kimlik değildir)
  function kararAnahtar(ex) {
    return kararEskiAnahtar(ex);
  }

  /* v93 — MÜKERRER DENEME TEMİZLİĞİ (elde kalmış kayıtlar).
     Aynı ad + tarih + içerikle birden çok deneme yazılmışsa tek kayda
     indirilir. Korunan kayıt: nedeni işlenmiş satırı en çok olan (öğrencinin
     emeği kaybolmaz); yoksa en eskisi. İşlenmiş nedenler boş satırlara
     taşınır. Saf fonksiyon: {exams, birlestirilen}. */
  function yinelenenleriBirlestir(exams) {
    const liste = Array.isArray(exams) ? exams : [];
    const islenmis = (ex) => (Array.isArray(ex && ex.errorLogs) ? ex.errorLogs.filter((l) => l && l.type).length : 0);
    const tutulan = [];
    const atilan = [];
    liste.forEach((ex) => {
      if (!ex) { tutulan.push(ex); return; }
      const h = kararHash(ex);
      const i = tutulan.findIndex((t) => t && kararHash(t) === h);
      if (i < 0) { tutulan.push(ex); return; }
      // Aynı sınav: daha çok işlenmiş satırı olan kayıt korunur
      const a = tutulan[i];
      const korunan = islenmis(ex) > islenmis(a) ? ex : a;
      const digeri = korunan === a ? ex : a;
      // nedenleri korunan kayda taşı (konu + soru no eşleşmesiyle)
      const kaynak = Array.isArray(digeri.errorLogs) ? digeri.errorLogs : [];
      const hedef = Array.isArray(korunan.errorLogs) ? korunan.errorLogs : [];
      kaynak.forEach((l) => {
        if (!l || !l.type) return;
        const es = hedef.find((x) => x && String(x.qno) === String(l.qno) &&
          String(x.lesson || "") === String(l.lesson || "") && String(x.topic || "") === String(l.topic || ""));
        if (es && !es.type) es.type = l.type;
      });
      if (!korunan.okulizyonUrl && digeri.okulizyonUrl) korunan.okulizyonUrl = digeri.okulizyonUrl;
      tutulan[i] = korunan;
      atilan.push(digeri);
    });
    return { exams: tutulan, birlestirilen: atilan.length };
  }

  /**
   * gelen  : sunucudan gelen Okulizyon sınavları
   * exams  : uygulamadaki denemeler (state.exams)
   * islenen: { "ad|tarih": hash } — bu sınav bu içerikle zaten işlendi
   *          ya da kullanıcı tarafından yoksayıldı. Aynı hash ise kuyruğa
   *          GERİ KONMAZ; içerik değişirse (hash farklıysa) yeniden gelir.
   */
  function karar(gelen, exams, islenen) {
    const liste = Array.isArray(exams) ? exams : [];
    const defter = islenen && typeof islenen === "object" ? islenen : {};
    // Uygulamadaki denemeler "Okulizyon: <ad>" biçiminde; çift önek ekleme
    const adi = (ex) => {
      const n = (ex && ex.name) || "Sınav";
      return n.indexOf("Okulizyon: ") === 0 ? n : "Okulizyon: " + n;
    };
    // Tarih boşsa (Okulizyon tarih vermediyse) yalnız ada göre eşle — yoksa
    // aynı sınav her çekimde "yeni" sanılıp tekrar tekrar aktarılır.
    const adaGoreBul = (ex) => liste.find((e) => e && e.name === adi(ex) &&
      (!(ex && ex.date) || !e.date || String(e.date) === String(ex.date)));
    // v93 — sid jetonu eşleştirmede KULLANILMAZ (her çekimde değişir).
    // Eşleşme yalnız ad + tarih (+ içerik) ile yapılır; aynı sınav ikinci
    // kez yeni sayılmaz.
    const bul = (ex) => adaGoreBul(ex);
    const hash = (ex) => {
      // iki tarafı da aynı normalizasyondan geçir: ham Okulizyon adları
      // ("Matematik-1") ile uygulama adları ("Matematik") aynı hash'i versin
      const l = birlestir((ex && ex.lessons) || {});
      return [adi(ex), (ex && ex.date) || "",
        Object.keys(l).sort().map((k) => k + ":" + (Number(l[k].d) || 0) + "," + (Number(l[k].w) || 0) + "," + (Number(l[k].e) || 0)).join(";")].join("|");
    };
    const yeni = [], degisen = [], gecerliAnahtarlar = [];
    (Array.isArray(gelen) ? gelen : []).forEach((ex) => {
      const anahtar = kararAnahtar(ex);
      const eski = kararEskiAnahtar(ex);
      const h = hash(ex);
      const varOlan = bul(ex);
      if (varOlan) gecerliAnahtarlar.push(anahtar);
      // Bu sınav bu içerikle zaten işlendi veya yoksayıldı → kuyruğa geri koyma.
      // v93 — "silinen" notu artık ad|tarih anahtarıyla tutulur (sid anahtarı
      // her çekimde değiştiği için silinen sınav geri geliyordu). Eski sid'li
      // notlar da okunur: geriye dönük uyumluluk.
      if ((defter[anahtar] && defter[anahtar] === h) || (defter[eski] && defter[eski] === h)) return;
      const sidAnahtar = siniSid(ex) ? "sid:" + siniSid(ex) : "";
      if (sidAnahtar && defter[sidAnahtar] && defter[sidAnahtar] === h) return;
      if (!varOlan) { yeni.push(ex); return; }
      if (hash(varOlan) !== h) degisen.push({ key: ((ex.name) || "?") + "|" + (ex.date || ""), exam: ex, hash: h });
    });
    return { yeni, degisen, gecerliAnahtarlar };
  }

  const api = { VARSAYILAN, sade, grup, kanonik, birlestir, net, toplam, duzelt, karar, kararHash, kararAnahtar, kararEskiAnahtar, sidCikar, yinelenenleriBirlestir };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (kok) kok.OKZ = api;
})(typeof window !== "undefined" ? window : globalThis);
