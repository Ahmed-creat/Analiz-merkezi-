/* ============================================================
   VİDEO ÇÖZÜM (site/video-cozum.js)
   ------------------------------------------------------------
   Okulizyon sınav sonuç tablosunda her sorunun bir "Video"
   sütunu var (Soru | Video | D.C. | Ö.C. | Kazanım). Eski
   ayrıştırıcı bu sütunu atıyordu; artık bağlantı saklanıyor.

   Bu modül:
     • Okulizyon'dan gelen göreli/özel bağlantıyı mutlak adrese
       çevirir, yalnız izinli alan adlarını kabul eder,
     • deneme hata kayıtlarından "çözümü izlenecek sorular"
       listesini üretir (ders/konu bazında),
     • soru havuzundaki metin çözümünü de listeye katar
       (video yoksa "çözüm metni" gösterilir, uydurma video yok).

   Kullanım: VC.normalize(url) · VC.izlenecekler(state, konuKey)
   ============================================================ */
(function (kok) {
  "use strict";

  // Yalnız bu alan adlarındaki bağlantılar kabul edilir (güvenlik)
  const IZINLI = [
    "okulizyon.com", "www.okulizyon.com",
    "youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com",
    "vimeo.com", "player.vimeo.com",
    "drive.google.com", "docs.google.com"
  ];

  function temel() {
    try { return typeof location !== "undefined" && location.origin ? location.origin : "https://okulizyon.com"; }
    catch (e) { return "https://okulizyon.com"; }
  }

  /**
   * Ham bağlantı → güvenli mutlak URL (yoksa "").
   * • "//host/yol"        → https://host/yol
   * • "/app2/..."         → https://okulizyon.com/app2/...
   * • "javascript:..."    → reddedilir
   */
  function normalize(ham) {
    let u = String(ham == null ? "" : ham).trim();
    if (!u) return "";
    // HTML attribute kalıntıları
    u = u.replace(/^['"]|['"]$/g, "");
    if (/^javascript:/i.test(u) || /^data:/i.test(u)) return "";
    if (u.indexOf("//") === 0) u = "https:" + u;
    let mutlak;
    try {
      mutlak = new URL(u, temel());
    } catch (e) { return ""; }
    if (!/^https?:$/.test(mutlak.protocol)) return "";
    const host = mutlak.hostname.toLowerCase();
    if (IZINLI.indexOf(host) < 0) return "";
    return mutlak.toString();
  }

  // HTML parçasından video bağlantısı çıkar (Okulizyon hücresi)
  function htmlDenCikar(hucre) {
    const h = String(hucre || "");
    if (!h) return "";
    const adaylar = [];
    const aRe = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi;
    let m;
    while ((m = aRe.exec(h))) adaylar.push(m[1]);
    const dRe = /data-(?:video|video_url|videourl|href|url)\s*=\s*["']([^"']+)["']/gi;
    while ((m = dRe.exec(h))) adaylar.push(m[1]);
    const iRe = /<iframe\b[^>]*src\s*=\s*["']([^"']+)["']/gi;
    while ((m = iRe.exec(h))) adaylar.push(m[1]);
    for (let i = 0; i < adaylar.length; i++) {
      const u = normalize(adaylar[i]);
      if (u) return u;
    }
    // hücrede çıplak adres varsa
    const cRe = /(https?:\/\/[^\s"'<>]+)/i;
    const c = cRe.exec(h);
    return c ? normalize(c[1]) : "";
  }

  /** Toplu işlem: hata kayıtlarına video alanı ekler. */
  function videolariIsle(examlar) {
    let sayi = 0;
    (Array.isArray(examlar) ? examlar : []).forEach(function (ex) {
      (Array.isArray(ex && ex.errorLogs) ? ex.errorLogs : []).forEach(function (l) {
        if (!l) return;
        const u = normalize(l.video);
        if (u) { if (l.video !== u) { l.video = u; sayi++; } }
        else if (l.video) { delete l.video; }
      });
    });
    return sayi;
  }

  /**
   * "Çözümü izlenecek sorular": yanlış/boş sorular.
   * kaynaklar: deneme hata kayıtları (video varsa), yoksa metin çözümü.
   * konuKey verilirse yalnız o konu (ör. "Matematik > 1.1 ...") süzülür.
   */
  // Konu adları bazen kayıttan bazen kazanımdan gelir; birebir eşitlik
  // yetmiyor (kullanıcı: "hiçbir video bağlantısı yok"). Bu yüzden konu
  // metinleri normalize edilip BİRİBİRİNİ KAPSIYORSA da eşleşir.
  function konuSade(x) {
    return String(x == null ? "" : x).toLocaleLowerCase("tr-TR")
      .replace(/[ıİ]/g, "i").replace(/[şŞ]/g, "s").replace(/[ğĞ]/g, "g")
      .replace(/[çÇ]/g, "c").replace(/[öÖ]/g, "o").replace(/[üÜ]/g, "u")
      .replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function konuTutar(hedef, aday) {
    if (!hedef) return true;
    if (hedef === aday) return true;                 // birebir
    const a = konuSade(hedef), b = konuSade(aday);
    if (!a || !b) return false;
    if (a === b) return true;
    // Biri diğerini kapsıyorsa (en az 8 karakter) aynı konu sayılır
    if (a.length >= 8 && b.length >= 8 && (a.indexOf(b) >= 0 || b.indexOf(a) >= 0)) return true;
    // "Ders > Konu" biçiminde ders eşitse konu kısmına bak
    const pa = a.split(" > "), pb = b.split(" > ");
    const ka = pa.length > 1 ? pa.slice(1).join(" > ") : "", kb = pb.length > 1 ? pb.slice(1).join(" > ") : "";
    if (ka && kb && (ka.indexOf(kb) >= 0 || kb.indexOf(ka) >= 0)) return true;
    // Kelime örtüşmesi: iki metin de aynı konuyu anlatıyorsa (örn. konu
    // başlığı "Şiirde Ahenk", kazanım "şiirde ahengi sağlayan özellikler…")
    const DURAK = { ve: 1, ile: 1, bir: 1, icin: 1, olan: 1, olarak: 1 };
    const kel = function (x) { return x.split(" ").filter(function (w) { return w.length > 3 && !DURAK[w]; }); };
    const w1 = kel(ka || a), w2 = kel(kb || b);
    if (w1.length >= 2 && w2.length >= 2) {
      let ortak = 0;
      w1.forEach(function (w) { if (w2.indexOf(w) >= 0) ortak++; });
      const oran = ortak / Math.min(w1.length, w2.length);
      if (ortak >= 2 && oran >= 0.5) return true;
    }
    return false;
  }

  function izlenecekler(state, konuKey) {
    const cikti = [];
    const hedef = String(konuKey || "");
    const denemeler = Array.isArray(state && state.exams) ? state.exams : [];
    denemeler.forEach(function (ex, exIdx) {
      (Array.isArray(ex && ex.errorLogs) ? ex.errorLogs : []).forEach(function (l) {
        if (!l) return;
        const ders = String(l.lesson || "");
        const konu = ders + " > " + String(l.topic || "");
        let eslesti = konuTutar(hedef, konu);
        // Kayıt hâlâ ham kazanım metniyse kural tablosuyla konuya çevirip
        // tekrar dene (kullanıcı: "konular yine kazanım olarak kaydediliyor").
        const KA = (typeof window !== "undefined" && window.KA) ? window.KA : (typeof globalThis !== "undefined" ? globalThis.KA : null);
        if (!eslesti && KA && typeof KA.esle === "function") {
          try {
            const kural = KA.esle(l.topic, ders);
            if (kural && kural.konu) eslesti = konuTutar(hedef, ders + " > " + kural.konu);
          } catch (e) { /* kural yoksa geç */ }
        }
        if (!eslesti) return;
        cikti.push({
          deneme: ex.name || "Deneme",
          denemeId: ex.id || "",
          // Uygulamanın KENDİ sonuç ekranında o derse atlayabilmek için
          // sıra numarası (state.exams içindeki konum).
          denemeIdx: exIdx,
          tarih: ex.date || (l.date || ""),
          ders: l.lesson || "",
          konu: l.topic || "",
          kazanim: l.kazanim || "",
          qno: l.qno || "",
          durum: l.status === "e" || l.status === "bos" ? "boş" : "yanlış",
          neden: l.type || "",
          video: normalize(l.video),
          // Okulizyon videoyu doğrudan adresle vermiyor: sınav sayfasında
          // "video" düğmesi var. O zaman "Okulizyon'da aç" bağlantısı veririz.
          videoVar: !!(l.videoVar || l.video),
          okulizyonUrl: normalize(ex.okulizyonUrl || ex.url || ""),
          cozum: String(l.cozum || ""),
          konuKey: konu
        });
      });
    });
    // En yeni denemeler önce
    cikti.sort(function (a, b) { return String(b.tarih).localeCompare(String(a.tarih)); });
    return cikti;
  }

  /** Soru havuzu sorusuna video/çözüm bağlantısı (varsa). */
  function soruCozumu(q) {
    const video = normalize(q && (q.video || q.cozum_video || (q.cozum && q.cozum.video)));
    const metin = typeof (q && q.cozum) === "string" ? q.cozum : String((q && q.cozum && q.cozum.metin) || "");
    return { video: video, metin: metin };
  }

  /**
   * Bir "yapamadığın soru" için izleme bağlantısı.
   * Dönen: { href, etiket, disari } — uydurma yok:
   *   • doğrudan video adresi varsa  → "İzle"
   *   • yoksa sınav sayfası varsa    → "Okulizyon'da aç" (videoyu orada açar)
   *   • ikisi de yoksa               → null
   */
  function izleLink(x) {
    if (!x) return null;
    if (x.video) return { href: x.video, etiket: "İzle", disari: true };
    if (x.videoVar && x.okulizyonUrl) return { href: x.okulizyonUrl, etiket: "Okulizyon'da aç", disari: true };
    return null;
  }

  const VC = {
    izleLink: izleLink,
    normalize: normalize, htmlDenCikar: htmlDenCikar, videolariIsle: videolariIsle,
    izlenecekler: izlenecekler, soruCozumu: soruCozumu, konuTutar: konuTutar, IZINLI: IZINLI
  };
  if (typeof module !== "undefined" && module.exports) module.exports = VC;
  if (kok) kok.VC = VC;
})(typeof window !== "undefined" ? window : globalThis);
