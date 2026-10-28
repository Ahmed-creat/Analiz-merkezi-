/* ============================================================
   HAVUZ BULUCU (site/havuz-bul.js)
   ------------------------------------------------------------
   SORUN (kullanıcı bildirimi): "bazı konularda kısa kontrol
   gelmiyor". Uygulama Kısa Kontrol düğmesini yalnızca BKT
   kaydında `pool_id` varsa çiziyordu; `pool_id` ise ancak düğme
   tıklandığında yazılıyordu (yumurta-tavuk). Ayrıca havuz
   manifestinde 60+ havuzda `baslik` alanı yoktu (Kimya,
   Coğrafya, Türk Dili ve Edebiyatı), bu yüzden başlıkla eşleme
   de tutmuyordu.

   ÇÖZÜM: "Ders > Konu" metninden havuzu bulmanın tek yeri burası.
   Sıra:
     1) topic_key BİREBİR eşit                  (en güvenilir)
     2) ders + başlık eşit (baslik yoksa topic_key'den türetilir)
     3) baştaki numara atılmış hâliyle eşit      ("1.1 X" → "X")
     4) başlığın TÜM anlamlı kelimeleri konu metninde var ve
        sonuç TEK ise                                (belirsizse null)
   Hiçbiri tutmazsa null döneriz: uydurma havuz açmayız.

   Tarayıcı: <script src="havuz-bul.js"></script> → window.HB
   Node    : module.exports = HB
   ============================================================ */
(function (kok) {
  "use strict";

  function metin(x) { return String(x == null ? "" : x); }

  // Türkçe küçük harf + aksan sadeleştirme (Ş→s, Ğ→g, İ→i, I→ı korunur)
  function sade(x) {
    return metin(x)
      .toLocaleLowerCase("tr-TR")
      .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g")
      .replace(/ç/g, "c").replace(/ö/g, "o").replace(/ü/g, "u")
      .replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u")
      .replace(/[^a-z0-9 ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  // "1.1 Sabit Hızlı Hareket" → "sabit hizli hareket"
  function numarasiz(x) {
    return sade(metin(x).replace(/^[\[\s]*\d+([.\-]\d+)*[)\].:\s]*/, ""));
  }
  var DURAK = { ve: 1, ile: 1, bir: 1, "": 1, the: 1, of: 1, in: 1 };
  function kelimeler(x) {
    return sade(x).split(" ").filter(function (w) { return w.length > 2 && !DURAK[w]; });
  }
  function ders(havuz) { return metin(havuz && havuz.ders); }
  function konuBasligi(havuz) {
    if (!havuz) return "";
    if (havuz.baslik) return metin(havuz.baslik);
    var tk = metin(havuz.topic_key);
    var p = tk.indexOf(" > ");
    return p >= 0 ? tk.slice(p + 3) : tk;
  }
  function konuParcasi(topicKey) {
    var tk = metin(topicKey);
    var p = tk.indexOf(" > ");
    return p >= 0 ? tk.slice(p + 3) : tk;
  }
  function dersParcasi(topicKey) {
    var tk = metin(topicKey);
    var p = tk.indexOf(" > ");
    return p >= 0 ? tk.slice(0, p) : "";
  }

  /** topicKey → havuz kaydı (manifest.havuzlar içinden) ya da null */
  function bul(topicKey, havuzlar) {
    var liste = Array.isArray(havuzlar) ? havuzlar : [];
    if (!liste.length) return null;
    var ham = metin(topicKey);
    if (!ham) return null;

    // 1) topic_key birebir
    for (var i = 0; i < liste.length; i++) if (metin(liste[i].topic_key) === ham) return liste[i];

    var dersAdi = sade(dersParcasi(ham));
    var konu = konuParcasi(ham);

    // 2) aynı ders + başlık eşit (baslik yoksa topic_key'den türetilir)
    var ayniDers = liste.filter(function (h) { return !dersAdi || sade(ders(h)) === dersAdi; });
    for (var j = 0; j < ayniDers.length; j++) {
      if (sade(konuBasligi(ayniDers[j])) === sade(konu)) return ayniDers[j];
    }

    // 3) numarasız başlık eşitliği
    var numarasizKonu = numarasiz(konu);
    if (numarasizKonu) {
      for (var k = 0; k < ayniDers.length; k++) {
        if (numarasiz(konuBasligi(ayniDers[k])) === numarasizKonu) return ayniDers[k];
      }
    }

    // 4) kelime kapsama: başlığın tüm anlamlı kelimeleri konuda geçiyor
    var istenen = kelimeler(konu);
    if (istenen.length >= 2) {
      var eslesen = ayniDers.filter(function (h) {
        var bas = kelimeler(konuBasligi(h));
        if (!bas.length) return false;
        return bas.every(function (w) { return istenen.indexOf(w) >= 0; });
      });
      if (eslesen.length === 1) return eslesen[0];   // belirsizse null
    }
    return null;
  }

  /** konu "Ders > Konu" biçiminde değilse dersi öne ekler */
  function anahtar(konu, dersAdi) {
    var k = metin(konu);
    if (k.indexOf(" > ") >= 0) return k;
    var d = metin(dersAdi);
    return d ? d + " > " + k : k;
  }

  var HB = { bul: bul, anahtar: anahtar, konuBasligi: konuBasligi, sade: sade, numarasiz: numarasiz };
  if (typeof module !== "undefined" && module.exports) module.exports = HB;
  if (kok) kok.HB = HB;
})(typeof window !== "undefined" ? window : globalThis);
