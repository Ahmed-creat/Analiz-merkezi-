/* ============================================================
   KÖK EKSİK (site/kok-eksik.js)  —  v35.6
   ------------------------------------------------------------
   NEDEN VAR: v35.5'e kadar Ana Sayfa'daki "Kök Eksik Uyarısı"
   sabit bir kelime listesiyle (CROSS_LINKS) çalışıyordu:

      { Matematik / "Trigonometri" }  ↔  { Fizik / "Dalgalar" }

   ve iki konunun başarısını topicSuccessRate() ile kıyaslıyordu.
   O fonksiyon DENEME tarafında DERS düzeyinde hesaplıyor: aynı
   dersin BÜTÜN konuları aynı yüzdeyi alır. Yani ekranda yazan
   "Trigonometri zayıf (%X), Dalgalar güçlü (%Y) — kök ders
   Matematik" cümlesi aslında "Matematik dersinin yüzdesi ile Fizik
   dersinin yüzdesi" idi. Konu düzeyinde tek bir ölçüm yoktu:
   uydurma bir uyarıydı ve her denemede 4 kez tekrarlanıyordu.

   YENİ KURAL (uydurma yok):
     • Ön koşul bilgisi YALNIZ içerik/iliski_grafi.json içindeki
       SERT_ONKOSUL kenarlarından gelir (kaynak → hedef).
       Graf yoksa/boşsa uyarı ÜRETİLMEZ.
     • Zayıflık KONU düzeyindeki hata kayıtlarından ölçülür
       (deneme hata günlüğü + soru bankası hata günlüğü).
     • Konu tamamlandıktan SONRAKİ hatalar sayılır; tamamlamadan
       önceki hatalar "geçmiş" sayılır ve uyarı üretmez.
     • Tek hata eğilim değildir: en az 2 hata istenir.
     • Aynı zayıf konu için TEK satır üretilir (kopya yok).
   ============================================================ */
(function (kok) {
  "use strict";

  function gunKisa(x) {
    return x ? String(x).slice(0, 10) : "";
  }

  /** Konu bazlı hata sayacı: { "Ders > Konu": sayı } */
  function hataSayaclari(exams, questions, bellek) {
    const sayac = {};
    const ekle = (log) => {
      if (!log || !log.lesson || !log.topic) return;
      const key = log.lesson + " > " + log.topic;
      const mem = bellek && bellek[key];
      const bitis = mem && mem.completedAt ? gunKisa(mem.completedAt) : "";
      const tarih = gunKisa(log.date);
      // Konu tamamlandıktan ÖNCEKİ hatalar geçmişte kaldı: uyarı üretmez.
      if (bitis && tarih && tarih < bitis) return;
      sayac[key] = (sayac[key] || 0) + 1;
    };
    (exams || []).forEach(function (ex) { (ex && ex.errorLogs || []).forEach(ekle); });
    (questions || []).forEach(function (q) { (q && q.errorLogs || []).forEach(ekle); });
    return sayac;
  }

  /**
   * @param {{nodes:Array, edges:Array}|null} graf  window.__analizIliskiGrafigi
   * @param {Object} sayac  hataSayaclari() çıktısı
   * @param {Object} bellek state.memory
   * @param {{enAzHata?:number, enFazlaSatir?:number, enFazlaBagimli?:number}} secenek
   * @returns {Array<{weak,root,hata,bagimli:Array<string>,sayi:number}>}
   */
  function listele(graf, sayac, bellek, secenek) {
    const o = secenek || {};
    const enAzHata = Number.isFinite(Number(o.enAzHata)) ? Number(o.enAzHata) : 2;
    const enFazlaSatir = Number.isFinite(Number(o.enFazlaSatir)) ? Number(o.enFazlaSatir) : 4;
    const enFazlaBagimli = Number.isFinite(Number(o.enFazlaBagimli)) ? Number(o.enFazlaBagimli) : 3;

    // Hem ham JSON (dugumler/kenarlar) hem doğrulanmış graf (nodes/edges) kabul edilir.
    const dugumler = graf && (graf.nodes || graf.dugumler);
    const kenarlar = graf && (graf.edges || graf.kenarlar);
    if (!Array.isArray(dugumler) || !Array.isArray(kenarlar) || !kenarlar.length) return [];

    const dugum = {};
    dugumler.forEach(function (n) { if (n && n.konu_id) dugum[n.konu_id] = n; });

    const cikti = [];
    dugumler.forEach(function (n) {
      if (!n || !n.konu_id || !n.ders || !n.konu_adi) return;
      const key = n.ders + " > " + n.konu_adi;
      const hata = Number((sayac || {})[key] || 0);
      if (hata < enAzHata) return;

      const bagimli = [];
      const gorulen = {};
      kenarlar.forEach(function (e) {
        if (!e || e.kaynak_konu_id !== n.konu_id) return;
        if (e.iliski_tipi !== "SERT_ONKOSUL") return;
        if (e.ileri_bagimlilik) return;             // üst sınıftan gelen bağ kredi sayılmaz
        const h = dugum[e.hedef_konu_id];
        if (!h || !h.ders || !h.konu_adi) return;
        const hk = h.ders + " > " + h.konu_adi;
        if (hk === key || gorulen[hk]) return;
        gorulen[hk] = true;
        bagimli.push(hk);
      });
      if (!bagimli.length) return;

      cikti.push({
        weak: key, root: n.ders, hata: hata,
        bagimli: bagimli, sayi: bagimli.length,
        gosterilen: bagimli.slice(0, enFazlaBagimli)
      });
    });

    cikti.sort(function (a, b) { return b.hata - a.hata; });
    return cikti.slice(0, enFazlaSatir);
  }

  const KE = { listele: listele, hataSayaclari: hataSayaclari };
  if (typeof module !== "undefined" && module.exports) module.exports = KE;
  if (kok) kok.KE = KE;
})(typeof window !== "undefined" ? window : globalThis);
