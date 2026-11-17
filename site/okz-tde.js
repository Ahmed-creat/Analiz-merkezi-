/* ============================================================
   TDE KAZANIM → KONU EŞLEŞTİRME MOTORU (site/okz-tde.js)
   ------------------------------------------------------------
   NEDEN VAR
   Okulizyon'un kazanım havuzu YAYINEVİ SERBEST METNİDİR: cümleler
   MEB'in resmî öğrenme çıktısıyla birebir örtüşmez ve çoğunda
   konu/tür adı geçmez ("Metindeki söz varlığının anlamını bağlamdan
   hareketle belirler."). MEB kodu zorlanmaz (uydurulmaz); bunun
   yerine üç aşamalı, ölçülü bir çözüm uygulanır.

   AŞAMA 1 — SÖZLÜK (kural tabanlı)
     Cümlede konunun ayırt edici terimi geçiyorsa ("kavuştak",
     "matla", "tegazzül", "cönk", "aliterasyon"…) doğrudan o konuya
     bağlanır. Türkçe ekleri tanınır: "koşuğun" → koşuk, "kafiyenin"
     → kafiye. Terim + Türkçe ek dışındaki harf dizileri eşleşmez
     ("çatışma" ≠ "çatı", "savaş" ≠ "sav").

   AŞAMA 2 — GENEL BECERİ (son çare)
     Cümlede hiçbir tür/dönem/terim yoksa ve cümle anlam bilgisi
     becerisi anlatıyorsa ("çıkarım yapar", "ana düşünceyi belirler",
     "söz varlığının anlamı", "anlatım biçimleri") **Paragraf**
     konusuna yönlendirilir. güven: "genel" — kesin değil.

   AŞAMA 3 — VEKTÖR BENZERLİĞİ
     Ne sözlük ne genel beceri tutmuyorsa cümle, 30 konunun
     ad + anahtar kavram vektörleriyle TF-IDF kosinüs benzerliğine
     göre karşılaştırılır. Eşik ve fark koşulu tutmazsa **null**
     döner: emin olmadığımız eşleşme yazılmaz.

   ÖĞRENEN SÖZLÜK
     Burada çözülen her cümle uygulamada `kazanim_konu_cache`
     tablosuna yazılır; aynı cümle ikinci kez geldiğinde hiçbir
     aşama çalışmadan DB'den gelir (bkz. app-pwa.js okzKonuBul).

   VERİ    : site/okz-tde-veri.js (OTOMATİK ÜRETİLİR)
   ÜRETİCİ : scripts/tde-icerik-uret.js
   API     : window.OKZTDE / module.exports
     sozlukEsle(kazanim)  → {aşama:1, konu, terim, guven:"kural"} | null
     genelEsle(kazanim)   → {aşama:2, konu, kural,  guven:"genel"} | null
     vektorEsle(kazanim)  → {aşama:3, konu, skor, fark, guven:"vektor"} | null
     esle(kazanim)        → ilk tutan aşama (1→2→3) | null
     iliski(konu)         → [{konu, tur, neden}]  (müfredat ilişkileri)
     konular()            → 30 konunun adı
   ============================================================ */
(function (kok) {
  "use strict";

  var SURUM = "2026-10-27";

  function veri() {
    if (kok.OKZTDE_VERI) return kok.OKZTDE_VERI;
    if (typeof module !== "undefined" && module.exports) {
      try { return require("./okz-tde-veri.js"); } catch (e) { return null; }
    }
    return null;
  }

  /* ---- normalizasyon (okz-meb.js ile aynı kural) ---- */
  function sade(s) {
    return String(s == null ? "" : s)
      .replace(/ı/g, "i").replace(/İ/g, "i").replace(/I/g, "i")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* ---- Türkçe ek tanıma --------------------------------------
     Terim, cümlenin kelimesiyle KÖK düzeyinde karşılaştırılır:
      • "koşuğun" → koşuk · "kafiyenin" → kafiye · "tamlamalarını" → tamlama
      • "çatışma" ≠ çatı, "savaş" ≠ sav  (ek olmayan harf dizisi eşleşmez)
     Çok kelimeli terimlerde son kelime hariç birebir eşleşme aranır
     (isim tamlaması ≠ sıfat tamlaması). */
  var EKLER = [
    "lar", "ler", "ları", "leri", "ların", "lerin", "lara", "lere",
    "a", "e", "ı", "i", "u", "ü", "ya", "ye", "yı", "yi", "yu", "yü",
    "da", "de", "ta", "te", "dan", "den", "tan", "ten",
    "nda", "nde", "ndan", "nden", "nın", "nin", "nun", "nün",
    "ın", "in", "un", "ün", "na", "ne", "nı", "ni", "nu", "nü",
    "la", "le", "yla", "yle", "ca", "ce", "ça", "çe",
    "lık", "lik", "luk", "lük", "lı", "li", "lu", "lü",
    "sı", "si", "su", "sü", "sız", "siz", "suz", "süz",
    "cı", "ci", "cu", "cü", "cık", "cik", "cuk", "cük",
    "dır", "dir", "dur", "dür", "tır", "tir", "tur", "tür",
    "mış", "miş", "muş", "müş", "yken", "ken", "ınca", "ince",
    "mak", "mek", "ma", "me", "ış", "iş", "uş", "üş",
    "an", "en", "ar", "er", "ır", "ir", "ur", "ür",
    "yor", "acak", "ecek", "malı", "meli", "maz", "mez",
    "ki", "gil", "msı", "msi", "rak", "rek"
  ];
  var EK_KUME = new Set(EKLER);

  /* ilk 5 harf: "betimlemelerini" / "betimleyici" → "betim" */
  function govde(w) {
    return w.length >= 5 ? w.slice(0, 5) : w;
  }

  /* Ekleri en fazla iki turda at, sonra ilk 5 harfe indir:
     "siiri" → "siir" · "betimlemelerini" → "betimleme" → "betim" */
  function kok(w) {
    w = sade(w);
    for (var tur = 0; tur < 2; tur++) {
      for (var n = Math.min(5, w.length - 4); n >= 1; n--) {
        if (EK_KUME.has(w.slice(-n))) { w = w.slice(0, -n); break; }
      }
    }
    return govde(w);
  }

  /* son ünsüz yumuşaması: koşuk → koşuğ, ahenk → aheng */
  function yumusak(terim) {
    var son = terim.slice(-1);
    var m = { k: "g", p: "b", t: "d", ç: "c" };
    return m[son] ? terim.slice(0, -1) + m[son] : terim;
  }

  function kokler(metin) {
    return sade(metin).split(" ").filter(Boolean).map(kok);
  }

  /* Terimin son kelimesinin alabileceği taban biçimler:
     "tamlaması" → tamlama · "tamlamaları" → tamlama (+ yumuşama) */
  var SON_EK = ["ları", "leri", "lar", "ler", "nın", "nin", "nun", "nün",
    "sını", "sini", "sına", "sine", "sı", "si", "su", "sü", "ın", "in", "un", "ün", "ı", "i", "u", "ü"];
  function sonAdaylar(kelime) {
    var w = sade(kelime);
    var aday = [w];
    SON_EK.forEach(function (ek) {
      if (ek.length < 2 || w.length - ek.length < 4) return;
      if (w.slice(-ek.length) === ek) aday.push(w.slice(0, -ek.length));
    });
    aday.slice().forEach(function (a) {
      var y = yumusak(a);
      if (aday.indexOf(y) < 0) aday.push(y);
    });
    return aday;
  }

  /* ek dizisi gerçek bir çekim eki mi? ("larini" = lar+ini → i+ni) */
  function ekUyum(kalan, derinlik) {
    if (!kalan) return true;
    if ((derinlik || 0) > 3) return false;
    if (EK_KUME.has(kalan)) return true;
    var n = Math.min(4, kalan.length);
    for (var i = 2; i <= n; i++) {
      if (EK_KUME.has(kalan.slice(0, i)) && ekUyum(kalan.slice(i), (derinlik || 0) + 1)) return true;
    }
    return false;
  }

  /* Terim cümlenin kelimelerinde geçiyor mu? Dönen: kapsanan kelime sayısı */
  function terimKokSayisi(cumleKelimeleri, terim) {
    var parca = sade(terim).split(" ").filter(Boolean);
    if (!parca.length) return 0;
    var adaylar = sonAdaylar(parca[parca.length - 1]);
    for (var i = 0; i + parca.length <= cumleKelimeleri.length; i++) {
      var uygun = true;
      for (var j = 0; j < parca.length - 1; j++) {
        if (cumleKelimeleri[i + j] !== sade(parca[j])) { uygun = false; break; }
      }
      if (!uygun) continue;
      var w = cumleKelimeleri[i + parca.length - 1];
      for (var a = 0; a < adaylar.length; a++) {
        var ad = adaylar[a];
        if (w === ad) return parca.length;
        if (w.indexOf(ad) === 0 && ekUyum(w.slice(ad.length))) return parca.length;
      }
    }
    return 0;
  }

  function terimVar(cumleKelimeleri, terim) { return terimKokSayisi(cumleKelimeleri, terim) > 0; }

  /* ============================================================
     AŞAMA 1 — SÖZLÜK
     En çok kelimeyi kapsayan terim kazanır ("isim tamlaması" > "isim").
     Eşitlikte iki FARKLI konu çıkarsa belirsiz sayılır ve aşama atlanır:
     yanlış konu yazmak, konu yazmamaktan kötüdür.
     ============================================================ */
  function sozlukEsle(kazanim) {
    var v = veri();
    if (!v || !v.sozluk) return null;
    var ck = sade(kazanim).split(" ").filter(Boolean);
    if (!ck.length) return null;
    var enIyi = null, celiski = false;
    Object.keys(v.sozluk).forEach(function (terim) {
      var n = terimKokSayisi(ck, terim);
      if (!n) return;
      var uzunluk = sade(terim).length;
      if (!enIyi || n > enIyi.n || (n === enIyi.n && uzunluk > enIyi.uzunluk)) {
        enIyi = { n: n, uzunluk: uzunluk, konu: v.sozluk[terim], ham: terim };
        celiski = false;
      } else if (n === enIyi.n && uzunluk === enIyi.uzunluk && v.sozluk[terim] !== enIyi.konu) {
        celiski = true;
      }
    });
    if (!enIyi || celiski) return null;
    return { konu: enIyi.konu, terim: enIyi.ham, guven: "kural", asama: 1, skor: 1 };
  }

  /* ============================================================
     AŞAMA 2 — GENEL BECERİ (son çare)
     Cümlede tür/dönem/terim adı YOKSA ve anlam bilgisi becerisi
     anlatıyorsa Paragraf'a yönlendirilir. güven: "genel".
     ============================================================ */
  var GENEL_DESEN = {
    "cikarim": /(^| )(cikarim|cikarsama|cikarimlar|sonuc cikar|anlam cikar)/,
    "ana-dusunce": /(^| )(ana dusunce|ana fikir|ana iletisi|metnin konusu|konu ve ana)/,
    "soz-varligi": /(^| )(soz varlig|sozcuklerin anlam|kelimelerin anlam|baglamdan hareketle anlam|sozcuk anlam)/,
    "anlatim": /(^| )(anlatim bicim|anlatim teknig|dusunceyi gelistirme|anlatim ozellig)/
  };

  function genelEsle(kazanim) {
    var v = veri();
    if (!v || !v.genel) return null;
    var c = sade(kazanim);
    if (!c) return null;
    var kural = (v.genel.kurallar || []).filter(function (r) { return GENEL_DESEN[r.ad]; })
      .filter(function (r) { return GENEL_DESEN[r.ad].test(c); })[0];
    if (!kural) return null;
    return {
      konu: kural.hedef,
      kural: kural.ad,
      guven: "genel",
      asama: 2,
      skor: 0.5,
      gerekce: kural.gerekce || ""
    };
  }

  /* ============================================================
     AŞAMA 3 — VEKTÖR BENZERLİĞİ (TF-IDF ağırlıklı kapsam)
     ------------------------------------------------------------
     Konu vektörü: konu adı (2 kat) + anahtar kavramlar + bölüm adı.
     Cümle kelimeleri ilk 5 harfe indirgenir ("betimlemelerini" ≈
     "betimleyici" → "betim") ve konu vektörüyle karşılaştırılır.
     Puan = eşleşen kelimelerin IDF ağırlığı / cümlenin tüm ağırlığı.
     Koşullar (hepsi birden):
       • en az 2 ayrı kelime eşleşmeli
       • puan ≥ 0.34
       • ikinci konuyla fark ≥ 0.08
     Tutmazsa null — uydurma eşleşme yazılmaz.
     ============================================================ */
  var ESIK_KAPSAM = 0.34;
  var ESIK_KAPSAM_FARK = 0.08;
  var ESIK_KELIME = 2;

  /* Her konuda geçen genel fiiller: ayırt edici değil, puana katılmaz. */
  var DURAK = new Set([
    "acikl", "belir", "yapar", "yorum", "incele", "karsil", "sinifl",
    "ornekl", "uygul", "kulla", "olust", "sorgu", "deger", "cozum",
    "metin", "eser", "donem", "unsur", "ozell", "bilgi", "sürec", "surec"
  ]);

  var VEKTOR = null;
  function vektorKur() {
    if (VEKTOR) return VEKTOR;
    var v = veri();
    if (!v || !v.konular) return null;
    var belgeler = v.konular.map(function (k) {
      var kelimeler = (k.konu + " " + k.konu + " " + k.kavram.join(" ") + " " + (k.bolum || "")).split(/\s+/);
      var kume = Object.create(null);
      kelimeler.forEach(function (w) {
        w = kok(w);
        if (w.length < 3 || DURAK.has(w)) return;
        kume[w] = 1;
      });
      return { konu: k.konu, kume: kume };
    });
    var df = Object.create(null);
    var N = belgeler.length;
    belgeler.forEach(function (b) {
      Object.keys(b.kume).forEach(function (w) { df[w] = (df[w] || 0) + 1; });
    });
    var idf = Object.create(null);
    Object.keys(df).forEach(function (w) { idf[w] = Math.log((N + 1) / (df[w] + 0.5)) + 1; });
    VEKTOR = { belgeler: belgeler, idf: idf };
    return VEKTOR;
  }

  function vektorEsle(kazanim) {
    var V = vektorKur();
    if (!V) return null;
    var kelimeler = [];
    sade(kazanim).split(" ").forEach(function (w) {
      if (w.length < 3) return;
      w = kok(w);
      if (DURAK.has(w)) return;
      if (kelimeler.indexOf(w) < 0) kelimeler.push(w);
    });
    if (kelimeler.length < 2) return null;
    /* bilinmeyen kelime paydada zayıf ağırlıkla durur: cümle ne kadar
       çok tanınmayan kelime içeriyorsa eşleşme o kadar zorlaşır. */
    var toplam = 0;
    kelimeler.forEach(function (w) { toplam += V.idf[w] || 0.7; });
    if (!toplam) return null;

    /* Aşama 2'nin hedefi (Paragraf) 3. aşamada yarışmaz: anlam bilgisi
       zaten yukarıda ele alındı; burada konuya ÖZGÜ benzerlik aranır. */
    var genelHedef = (veri().genel && veri().genel.hedef_konu) || null;
    var puanlar = [];
    V.belgeler.forEach(function (b) {
      if (genelHedef && b.konu === genelHedef) return;
      var esles = 0, agirlik = 0;
      kelimeler.forEach(function (w) {
        if (!b.kume[w]) return;
        esles++;
        agirlik += V.idf[w] || 0.7;
      });
      if (esles < ESIK_KELIME) return;
      puanlar.push({ konu: b.konu, skor: agirlik / toplam, esles: esles });
    });
    puanlar.sort(function (a, b) { return b.skor - a.skor; });
    var birinci = puanlar[0], ikinci = puanlar[1];
    if (!birinci || birinci.skor < ESIK_KAPSAM) return null;
    var fark = birinci.skor - (ikinci ? ikinci.skor : 0);
    if (fark < ESIK_KAPSAM_FARK) return null;
    return {
      konu: birinci.konu,
      skor: Math.round(birinci.skor * 1000) / 1000,
      fark: Math.round(fark * 1000) / 1000,
      esles: birinci.esles,
      guven: "vektor",
      asama: 3
    };
  }

  /* 1 → 2 → 3: ilk tutan aşama. Emin olunmayan cümlede null. */
  function esle(kazanim) {
    return sozlukEsle(kazanim) || genelEsle(kazanim) || vektorEsle(kazanim);
  }

  function iliski(konu) {
    var v = veri();
    return v && v.iliski && v.iliski[konu] ? v.iliski[konu] : [];
  }

  function konular() {
    var v = veri();
    return v && v.konular ? v.konular.map(function (k) { return k.konu; }) : [];
  }

  function kavramlar(konu) {
    var v = veri();
    if (!v || !v.konular) return [];
    var k = v.konular.filter(function (x) { return x.konu === konu; })[0];
    return k ? k.kavram : [];
  }

  var API = {
    surum: SURUM,
    esikVektor: ESIK_KAPSAM,
    esikFark: ESIK_KAPSAM_FARK,
    sade: sade,
    kok: kok,
    kokler: kokler,
    ekUyum: ekUyum,
    sonAdaylar: sonAdaylar,
    terimVar: terimVar,
    sozlukEsle: sozlukEsle,
    genelEsle: genelEsle,
    vektorEsle: vektorEsle,
    esle: esle,
    iliski: iliski,
    konular: konular,
    kavramlar: kavramlar
  };

  if (typeof module !== "undefined" && module.exports) module.exports = API;
  kok.OKZTDE = Object.assign(kok.OKZTDE || {}, API);
})(typeof globalThis !== "undefined" ? globalThis : this);
