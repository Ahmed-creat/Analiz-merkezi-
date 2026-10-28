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
  function karar(gelen, exams) {
    const liste = Array.isArray(exams) ? exams : [];
    // Uygulamadaki denemeler "Okulizyon: <ad>" biçiminde; çift önek ekleme
    const adi = (ex) => {
      const n = (ex && ex.name) || "Sınav";
      return n.indexOf("Okulizyon: ") === 0 ? n : "Okulizyon: " + n;
    };
    // Tarih boşsa (Okulizyon tarih vermediyse) yalnız ada göre eşle — yoksa
    // aynı sınav her çekimde "yeni" sanılıp tekrar tekrar aktarılır.
    const bul = (ex) => liste.find((e) => e && e.name === adi(ex) &&
      (!(ex && ex.date) || !e.date || String(e.date) === String(ex.date)));
    const hash = (ex) => {
      // iki tarafı da aynı normalizasyondan geçir: ham Okulizyon adları
      // ("Matematik-1") ile uygulama adları ("Matematik") aynı hash'i versin
      const l = birlestir((ex && ex.lessons) || {});
      return [adi(ex), (ex && ex.date) || "",
        Object.keys(l).sort().map((k) => k + ":" + (Number(l[k].d) || 0) + "," + (Number(l[k].w) || 0) + "," + (Number(l[k].e) || 0)).join(";")].join("|");
    };
    const yeni = [], degisen = [], gecerliAnahtarlar = [];
    (Array.isArray(gelen) ? gelen : []).forEach((ex) => {
      const varOlan = bul(ex);
      if (!varOlan) { yeni.push(ex); return; }
      gecerliAnahtarlar.push(((ex && ex.name) || "?") + "|" + ((ex && ex.date) || ""));
      if (hash(varOlan) !== hash(ex)) degisen.push({ key: ((ex.name) || "?") + "|" + (ex.date || ""), exam: ex, hash: hash(ex) });
    });
    return { yeni, degisen, gecerliAnahtarlar };
  }

  const api = { VARSAYILAN, sade, grup, kanonik, birlestir, net, toplam, duzelt, karar };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (kok) kok.OKZ = api;
})(typeof window !== "undefined" ? window : globalThis);
