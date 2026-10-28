/* ============================================================
   OKULİZYON KAZANIM → KONU BAŞLIĞI EŞLEME (site/okz-konu.js)
   ------------------------------------------------------------
   SORUN
   Okulizyon, yanlış/boş soruların konusunu KAZANIM METNİ olarak
   verir (uzun, "… yapar." ile biten cümle):
     "Dik üçgende trigonometrik oranlar ve trigonometrik
      özdeşliklerle ilgili varsayımlarda bulunur."
   Uygulama ise KONU BAŞLIĞI kullanır (kısa müfredat başlığı):
     "1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler"

   Birebir eşleşmedikleri için aynı konu iki ayrı kayıt gibi
   görünüyordu; soru havuzu da "Ders > Konu başlığı" ile arandığı
   için hiç bulunamıyordu → "dersi çalıştım, soru havuzundan soru
   gelmiyor".

   ÇÖZÜM
   Kazanım metnini o dersin konu başlıklarıyla karşılaştırır.
   İki aşama vardır ve ikisi KARIŞTIRILMAZ:

     KESİN  → konu başlığı kazanım metninin içinde aynen geçiyor
              ("Türkü", "Noktalama İşaretleri", "Sabit Hızlı Hareket").
              Bu güvenle otomatik uygulanır.

     ÖNERİ  → yalnız kelime/ikili-kelime örtüşmesi var. YANLIŞ
              OLABİLİR, bu yüzden OTOMATİK UYGULANMAZ; öğrenciye
              tek dokunuşla onaylatılır.

   Dürüstlük kuralı: emin olmadığımız eşleşmeyi "oldu" diye
   yazmayız. Yanlış konuya yazmak, eşlememekten daha kötüdür.

   API (window.OKZK / module.exports):
     sade(metin)                          → arama için sadeleştirilmiş metin
     toke(metin)                          → anlamlı kelimeler
     indeksKur(veri)                      → arama indeksi
     konular(ders, indeks)                → o dersin konuları (sıralı)
     esle(kazanim, ders, indeks, secenek) → {konu, topicKey, konuId, skor, guven, neden}
     adaylar(kazanim, ders, indeks, n)    → en olası n konu (UI için)
   Klasik script + CommonJS dışa aktarım (testler doğrudan okur).
   ============================================================ */
(function (kok) {
  "use strict";

  // Arama metninde anlam taşımayan (her kazanımda geçen) kelimeler
  const DURAKLI = new Set(
    (
      // Bağlaç/edat ve kalıp sözler (sade yazım: ç→c, ı→i, ş→s, ğ→g, ö→o, ü→u)
      "ve ile bir bu su icin olan olarak ilgili iliskin gibi daha en her cok da de ki mi ne ya veya " +
      "uzere yonelik gore sonra once kendi diger ayni bazi tum cesitli acisindan baglaminda sirasinda " +
      "icinde uzerinde arasinda hakkinda durumunda oldugu edilmesi yapilmasi ifade eder etme olur ise " +
      "genel temel amac amaci olay olgu yeni biri iki uc bilimsel bilim gozlem egitim kazanim beceri duzey " +
      // Kazanım cümlelerinin kalıp yüklemleri
      "belirler belirleme belirleyebilme aciklar aciklama aciklayabilme kavrar tanimlar tanimlama " +
      "sorgular sorgulama yapar yapabilme yapabilir bulunur bulunmasi bulunabilme ayirt edebilme " +
      "degerlendirir degerlendirme iliskilendirir karşılastirir karsilastirir listeler inceleyebilme " +
      "varsayim varsayimlar varsayimda varsayimlarda varsayimlarda varsayimi " +
      "iliskisine iliskiler iliskileri iliskilerin iliskisini farkinda olur"
    )
      .split(/\s+/)
      .filter(Boolean)
  );

  // Türkçe karakterleri sadeleştir, noktalama/rakam düzenini boz
  function sade(s) {
    return String(s == null ? "" : s)
      .replace(/ı/g, "i")
      .replace(/İ/g, "i")
      .replace(/I/g, "i")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Anlamlı kelimeler (tekilleştirilmiş)
  function toke(metin) {
    const cikti = [];
    const gorulen = Object.create(null);
    for (const w of sade(metin).split(" ")) {
      if (w.length < 3) continue;
      if (DURAKLI.has(w)) continue;
      if (gorulen[w]) continue;
      gorulen[w] = 1;
      cikti.push(w);
    }
    return cikti;
  }

  // Türkçe ekler yüzünden "türkünün" ≠ "türkü" olur; ilk 4 harf eşitse eş say
  function ayniKelime(a, b) {
    if (!a || !b) return false;
    if (a === b) return true;
    if (a.length >= 4 && b.length >= 4) return a.slice(0, 4) === b.slice(0, 4);
    return false;
  }

  // Ardışık kelime ikilileri ("sabit hizli", "hizli hareket")
  function ikili(kelimeler) {
    const out = [];
    const gorulen = Object.create(null);
    for (let i = 0; i + 1 < kelimeler.length; i++) {
      const g = kelimeler[i] + " " + kelimeler[i + 1];
      if (gorulen[g]) continue;
      gorulen[g] = 1;
      out.push(g);
    }
    return out;
  }

  // "1.1 Dik Üçgende..." → "dik ucgende..." (başlık numarası atılmış)
  function numarasiz(baslikSade) {
    // sade() noktaları boşluğa çevirir: "1.1.3 Mol" → "1 1 3 mol"
    return sade(baslikSade).replace(/^(\d+\s+)+/, "").trim();
  }

  /** Arama indeksi kur. veri = { surum, havuzlar:[{konu_id,ders,topic_key,konu,metin,soru}] } */
  function indeksKur(veri) {
    const havuzlar = (veri && Array.isArray(veri.havuzlar) ? veri.havuzlar : []).map(function (h) {
      const konu = String(h.konu || String(h.topic_key || "").split(" > ").slice(1).join(" > "));
      const kelimeler = toke(h.metin || konu);
      return {
        konu_id: String(h.konu_id || ""),
        ders: String(h.ders || ""),
        topic_key: String(h.topic_key || ""),
        konu: konu,
        soru: Number(h.soru) || 0,
        _k: kelimeler,
        _ikili: Object.create(null, Object.fromEntries(ikili(kelimeler).map(function (g) { return [g, { value: 1, enumerable: true }]; })))
      };
    });
    const df = Object.create(null);
    const df1 = Object.create(null);
    for (const h of havuzlar) {
      for (const g of Object.keys(h._ikili)) df[g] = (df[g] || 0) + 1;
      for (const w of h._k) df1[w] = (df1[w] || 0) + 1;
    }
    return { havuzlar: havuzlar, df: df, df1: df1, N: havuzlar.length, surum: (veri && veri.surum) || "" };
  }

  function idf(df, N, t) {
    return Math.log((N + 1) / ((df[t] || 0) + 1)) + 1;
  }

  function dersHavuzlari(ders, indeks) {
    if (!indeks || !indeks.havuzlar) return [];
    const hedef = sade(ders);
    if (!hedef) return indeks.havuzlar;
    const ayni = indeks.havuzlar.filter(function (h) { return sade(h.ders) === hedef; });
    return ayni.length ? ayni : indeks.havuzlar;
  }

  /** O dersin konuları — "Ders > Konu" anahtarı ve sıralı başlık */
  function konular(ders, indeks) {
    return dersHavuzlari(ders, indeks)
      .map(function (h) {
        return { topicKey: h.topic_key, konu: h.konu, konu_id: h.konu_id, ders: h.ders, soru: h.soru };
      })
      .sort(dogalSirala);
  }

  function numaraParcala(konu) {
    const m = /^(\d+(?:\.\d+)*)/.exec(sade(konu) || "");
    return m ? m[1].split(".").map(Number) : [];
  }
  function dogalSirala(a, b) {
    const A = numaraParcala(a.konu), B = numaraParcala(b.konu);
    for (let i = 0; i < Math.min(A.length, B.length); i++) if (A[i] !== B[i]) return A[i] - B[i];
    if (A.length !== B.length) return A.length - B.length;
    return String(a.konu).localeCompare(String(b.konu), "tr");
  }

  /** KESİN eşleşme: konu başlığı kazanım metninin içinde aynen geçiyor mu? */
  function kesinEsle(kazanim, adaylar, ayar) {
    const kaz = sade(kazanim);
    const kazKelimeler = toke(kazanim);
    const bulunan = [];
    for (const h of adaylar) {
      const b = numarasiz(sade(h.konu));
      if (!b) continue;
      const tam = kaz === b || kaz === sade(h.konu);
      // Kısa başlıklar ("Türkü", "Koşma") metnin içinde geçebilir
      const ifade = b.length <= ayar.kisaBaslik && kaz.indexOf(b) >= 0;
      if (!tam && !ifade) continue;
      // Tek kelimelik başlıklarda kelimenin gerçekten var olduğunu doğrula
      if (!tam && b.indexOf(" ") < 0 && !kazKelimeler.some(function (k) { return ayniKelime(k, b); })) continue;
      bulunan.push({ h: h, uzunluk: b.length, tam: tam });
    }
    if (!bulunan.length) return null;
    bulunan.sort(function (a, b) { return (b.tam ? 1 : 0) - (a.tam ? 1 : 0) || b.uzunluk - a.uzunluk; });
    return bulunan[0];
  }

  /** Kelime/ikili-kelime örtüşmesine göre sıralı aday listesi */
  function puanla(kazanim, adaylar, indeks) {
    const kelimeler = toke(kazanim);
    if (!kelimeler.length) return [];
    const ikililer = ikili(kelimeler);
    const sonuc = adaylar.map(function (h) {
      let pay = 0, payda = 0;
      for (const g of ikililer) {
        const w = idf(indeks.df, indeks.N, g) * 2;
        payda += w;
        if (h._ikili[g]) pay += w;
      }
      for (const k of kelimeler) {
        const w = idf(indeks.df1, indeks.N, k) * 0.5;
        payda += w;
        if (h._k.some(function (x) { return ayniKelime(x, k); })) pay += w;
      }
      return { h: h, skor: payda ? pay / payda : 0 };
    });
    sonuc.sort(function (a, b) { return b.skor - a.skor; });
    return sonuc;
  }

  function paketle(sec, skor, guven, neden) {
    return {
      konu: sec ? sec.konu : "",
      konuId: sec ? sec.konu_id : "",
      topicKey: sec ? sec.topic_key : "",
      ders: sec ? sec.ders : "",
      soru: sec ? sec.soru : 0,
      skor: Math.round((skor || 0) * 1000) / 1000,
      guven: guven,
      neden: neden
    };
  }

  /**
   * Kazanım → konu başlığı.
   * guven: "kesin"  → otomatik uygulanabilir
   *        "oneri"  → kullanıcı onayı şart (yanlış olabilir)
   *        "yok"    → hiçbir konuyla anlamlı örtüşme bulunamadı
   */
  function esle(kazanim, ders, indeks, secenek) {
    const ayar = Object.assign({ kisaBaslik: 34, oneriEsik: 0.08 }, secenek || {});
    const bos = { konu: "", konuId: "", topicKey: "", ders: ders || "", soru: 0, skor: 0, guven: "yok", neden: "indeks-yok" };
    if (!indeks || !indeks.havuzlar || !indeks.havuzlar.length) return bos;
    const metin = String(kazanim == null ? "" : kazanim).trim();
    if (!metin) return Object.assign({}, bos, { neden: "bos" });
    const adaylar = dersHavuzlari(ders, indeks);

    const kesin = kesinEsle(metin, adaylar, ayar);
    if (kesin) return paketle(kesin.h, 1, "kesin", "baslik-geciyor");

    const puanli = puanla(metin, adaylar, indeks);
    if (!puanli.length) return Object.assign({}, bos, { neden: "kelime-yok" });
    const birinci = puanli[0];
    if (birinci.skor < ayar.oneriEsik) return Object.assign({}, bos, { skor: Math.round(birinci.skor * 1000) / 1000, neden: "zayif" });
    return paketle(birinci.h, birinci.skor, "oneri", "kelime-ortusmesi");
  }

  /** UI için: en olası n konu (skorla birlikte) */
  function adaylar(kazanim, ders, indeks, n) {
    if (!indeks || !indeks.havuzlar) return [];
    const liste = dersHavuzlari(ders, indeks);
    const puanli = puanla(kazanim, liste, indeks);
    const kesin = kesinEsle(kazanim, liste, { kisaBaslik: 34 });
    let out = puanli.map(function (x) {
      return { konu: x.h.konu, topicKey: x.h.topic_key, konu_id: x.h.konu_id, ders: x.h.ders, soru: x.h.soru, skor: Math.round(x.skor * 1000) / 1000, kesin: !!(kesin && kesin.h === x.h) };
    });
    if (kesin) {
      out = out.filter(function (x) { return x.topicKey !== kesin.h.topic_key; });
      out.unshift({ konu: kesin.h.konu, topicKey: kesin.h.topic_key, konu_id: kesin.h.konu_id, ders: kesin.h.ders, soru: kesin.h.soru, skor: 1, kesin: true });
    }
    return out.slice(0, n || 3);
  }

  const API = {
    surum: "1.0.0",
    DURAKLI: DURAKLI,
    sade: sade,
    toke: toke,
    ayniKelime: ayniKelime,
    ikili: ikili,
    numarasiz: numarasiz,
    indeksKur: indeksKur,
    konular: konular,
    dogalSirala: dogalSirala,
    esle: esle,
    adaylar: adaylar
  };

  if (typeof module !== "undefined" && module.exports) module.exports = API;
  kok.OKZK = Object.assign(kok.OKZK || {}, API);
})(typeof globalThis !== "undefined" ? globalThis : this);
