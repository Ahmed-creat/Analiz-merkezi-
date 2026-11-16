#!/usr/bin/env node
/* ============================================================
   MEB KAZANIM → KONU EŞLEME ÜRETİCİ
   ------------------------------------------------------------
   Girdi
     site/content/mufredat/meb_kazanim_10.json  (resmî MEB 2026
        öğrenme çıktısı tablosu, 10. sınıf — 9 ders, 158 çıktı)
     site/content/konu_esleme.json              (172 havuz)
     site/content/soru_havuzlari/*.json         (kazanım metinleri)

   Çıktı
     site/content/mufredat/kazanim_konu_10.json (denetim dosyası)
     site/okz-meb.js                            (tarayıcı modülü)

   EŞLEME KATMANLARI (karıştırılmaz)
     kesin    → Okulizyon kazanım metni resmî çıktı cümlesiyle
                aynı köke indirgeniyor (Dice ≥ .80). Otomatik uygulanır.
     yapisal  → metin yok/farklı; uygulamanın ünite numarası MEB tema
                numarasıyla ve konu sırası çıktı sırasıyla örtüşüyor.
                Otomatik uygulanır, kanıt "sira"/"tek-cikti".
     orta     → yalnız başlık benzerliği; OTOMATİK UYGULANMAZ.
     yok      → kanıt yetersiz; hiçbir kod yazılmaz.

   Dürüstlük: tema numarası tutmayan eşleşme "kesin" sayılmaz.
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const RESMI = path.join(KOK, "site/content/mufredat/meb_kazanim_10.json");
const HAVUZ_INDEKSI = path.join(KOK, "site/content/konu_esleme.json");
const HAVUZ_DIZINI = path.join(KOK, "site/content/soru_havuzlari");
const CIKTI_JSON = path.join(KOK, "site/content/mufredat/kazanim_konu_10.json");
const CIKTI_JS = path.join(KOK, "site/okz-meb.js");

// Okulizyon kazanım metinleri 2. kişiye çevrilmiş ("…sorgulamanız"),
// resmî çıktılar ise ad eylemlidir ("…sorgulayabilme"). İkisini aynı
// köke indirmek için son kelimenin bu eklerini atarız.
const EKLER = [
  "yabilmeniz", "yebilmeniz", "abilmeniz", "ebilmeniz",
  "yabilmenizi", "yebilmenizi", "abilmenizi", "ebilmenizi",
  "yabilme", "yebilme", "abilme", "ebilme",
  "yabilmek", "yebilmek", "abilmek", "ebilmek",
  "maniz", "meniz", "malari", "meleri", "masi", "mesi"
];

const DURAKLI = new Set(
  ("ve ile bir bu su icin olan olarak ilgili iliskin gibi daha en her cok da de ki mi ne ya veya " +
    "uzere yonelik gore sonra once kendi diger ayni bazi tum cesitli acisindan baglaminda sirasinda " +
    "icinde uzerinde arasinda hakkinda durumunda oldugu edilmesi yapilmasi ifade eder etme olur ise " +
    "genel temel amac amaci olay olgu yeni biri iki uc bilimsel bilim gozlem egitim kazanim beceri duzey").split(/\s+/)
);

function sade(s) {
  return String(s == null ? "" : s)
    .replace(/ı/g, "i").replace(/İ/g, "i").replace(/I/g, "i")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Son kelimenin eylem ekini at → kök cümle (arama anahtarı) */
function kok(metin) {
  const s = sade(metin);
  if (!s) return "";
  const k = s.split(" ");
  const son = k[k.length - 1];
  for (const ek of EKLER) {
    if (son.endsWith(ek) && son.length - ek.length >= 3) {
      k[k.length - 1] = son.slice(0, son.length - ek.length);
      break;
    }
  }
  return k.join(" ");
}

function kelimeler(metin) {
  const out = [];
  for (const w of kok(metin).split(" ")) {
    if (w.length < 3 || DURAKLI.has(w)) continue;
    out.push(w);
  }
  return out;
}

// "sorgulama" ↔ "sorgula" aynı kelime sayılır (ilk 5 harf).
// 4 harf yetmiyor: "karesel" ile "karekök" ilk 4 harfte aynıdır ve
// Matematik konusu yanlış çıktıya bağlanıyordu.
function ayniKelime(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length >= 5 && b.length >= 5) return a.slice(0, 5) === b.slice(0, 5);
  return false;
}

/** Dice katsayısı — 1.0 birebir aynı kelime kümesi */
function dice(aKelimeler, bKelimeler) {
  if (!aKelimeler.length || !bKelimeler.length) return 0;
  const kalan = bKelimeler.slice();
  let ortak = 0;
  for (const a of aKelimeler) {
    const i = kalan.findIndex(b => ayniKelime(a, b));
    if (i >= 0) { ortak++; kalan.splice(i, 1); }
  }
  return (2 * ortak) / (aKelimeler.length + bKelimeler.length);
}

function okuJson(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
function yazJson(p, v) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(v, null, 1) + "\n", "utf8");
}

// ---------------- havuzlar ----------------
const resmi = okuJson(RESMI);
const ciktilar = resmi.ciktilar;

const havuzlar = [];
for (const ad of fs.readdirSync(HAVUZ_DIZINI)) {
  if (!ad.endsWith(".json") || ad === "index.json") continue;
  const d = okuJson(path.join(HAVUZ_DIZINI, ad));
  if (!d || !Array.isArray(d.sorular) || !d.konu_id) continue;
  const kazanimlar = [];
  const altBeceriler = new Set();
  for (const q of d.sorular) {
    const k = String(q.kazanim || "").trim();
    if (k && !kazanimlar.includes(k)) kazanimlar.push(k);
    for (const a of String(q.alt_beceri || "").split("·")) {
      const t = a.trim();
      if (t) altBeceriler.add(t);
    }
  }
  const m = /_u(\d+)_k(\d+)$/.exec(d.konu_id);
  havuzlar.push({
    konu_id: d.konu_id,
    ders: d.ders,
    sinif: d.sinif,
    tema: m ? Number(m[1]) : 0,
    sira: m ? Number(m[2]) : 0,
    konu: String(d.topic_key || "").split(" > ").slice(1).join(" > "),
    topic_key: String(d.topic_key || ""),
    kazanimlar,
    altBeceriler: Array.from(altBeceriler)
  });
}

const dersler = Array.from(new Set(ciktilar.map(c => c.ders)));
const ciktiDizini = {};
for (const ders of dersler) ciktiDizini[ders] = ciktilar.filter(c => c.ders === ders);

// tema → o çıktı sayısı, konu sayısı
function temaCiktilar(ders, tema) { return ciktiDizini[ders].filter(c => c.tema === tema); }

const KESIN_ESIK = 0.8;
const YAPISAL_BASLIK_ESIK = 0.2;
const ORTA_BASLIK_ESIK = 0.32;
const ORTA_FARK_ESIK = 0.08;

/* KONU BAŞLIĞI RESMÎ ÇIKTIDA AYNEN GEÇİYORSA (kelime kökü düzeyinde)
   eşleme "başlık-geçiyor" sayılır: "Enerji Biçimleri" →
   "Enerji biçimlerini karşılaştırabilme". Tek başına bu kanıt, sıra
   varsayımından daha güçlüdür; yine de "kesin" değil "yapısal"dır. */
function baslikGeciyor(konuKelimeler, ciktiKelimeler) {
  if (konuKelimeler.length < 2) return 0;
  let eslesen = 0;
  for (const k of konuKelimeler) if (ciktiKelimeler.some(c => ayniKelime(k, c))) eslesen++;
  return eslesen === konuKelimeler.length ? konuKelimeler.length : 0;
}

/* Uygulamanın konu numarası MEB'in tema numarasıyla aynı mı?
   "5.1 Ekonomik Faaliyetler" → tema 5 ✔
   "2.1.6 Çözünürlüğe..."     → 3 bileşenli alt numaralandırma ✘ (sıra kuralı uygulanmaz) */
function numaraUyumlu(konuAdi, tema) {
  const m = /^\s*(\d+(?:\.\d+)*)/.exec(String(konuAdi || ""));
  if (!m) return false;
  const p = m[1].split(".");
  if (p.length !== 2) return false;
  return Number(p[0]) === tema;
}

/* Elle doğrulanmış istisnalar (her biri resmî çıktı metnine dayanır).
   Otomatik katman bu satırları üretemiyor (program yeniden yapılandırılmış
   ya da eşleşme tek bir başlık kanıtıyla sınırlı); gerekçe zorunlu. */
const ELLE = {
  fizik_10_u01_k02: { kodlar: ["FİZ.10.1.2"], gerekce: "2026 programı tema 1: sabit ivmeli hareketin ivme-hız ilişkisi çıktısı." },
  fizik_10_u01_k04: { kodlar: ["FİZ.10.1.3"], gerekce: "2026 programında 'iki boyutta sabit ivmeli hareket' yerine yatay doğrultuda sabit ivmeli hareket grafikleri çıktısı (FİZ.10.1.3)." },
  fizik_10_u01_k03: { kodlar: [], gerekce: "Serbest düşme 2026 programında 11. sınıfa taşındı (FİZ.11.1.1, FİZ.11.1.2); 10. sınıfta karşılığı yok." },
  fizik_10_u02_k01: { kodlar: ["FİZ.10.2.1", "FİZ.10.2.2"], gerekce: "Konu iş-enerji-güç bütününü kapsıyor; 2026'da iş grafiği (10.2.1) ve iş-enerji-güç çıkarımı (10.2.2) ayrı çıktı." },
  biyo_10_u02_k06: { kodlar: ["BİY.10.2.6"], gerekce: "Konu başlığı 'sürdürülebilirliği kısıtlayan durumlar'; çıktı gözleme dayalı tahmin (BİY.10.2.6)." },
};

/* Beceri eksenli programlar: 10. sınıf çıktıları konu değil dil becerisi
   bildirir (dinleme/okuma/konuşma/yazma). Konu başlığıyla (Koşuk, Gazel,
   İsimler…) birebir eşlenemez → kod yazılmaz, gerekçe rapora girer. */
const BECERI_EKSENLI = new Set(["Türk Dili ve Edebiyatı"]);

/* Yapı farklı dersler: havuz 2018 ünite yapısını izliyor, 2026 programı
   üniteleri yeniden kurmuş. Aynı numaralı tema aynı içerik DEĞİL
   (ör. havuz 3. ünite "Ahlak", 2026 3. tema "tevhit/adalet/barış").
   Bu yüzden kod yazılmaz; yanlış kod yazmak eşlememekten kötüdür. */
const YAPI_FARKLI = {
  "Din Kültürü": "Havuz 2018 ünite yapısında (Kur'an, ibadet, ahlak, Hz. Muhammed, yorumlar); 2026 TYMM üniteleri farklı. Konu bazlı eşleme yapılmadı."
};

/* Sıra kuralı kapatılan dersler: havuzun konu sırası MEB temasının
   çıktı sırasını izlemiyor (Din Kültürü havuzu 2018 ünite yapısında). */
const SIRA_KAPALI = new Set(["Din Kültürü"]);

const sonuc = [];
for (const h of havuzlar) {
  const adaylar = ciktiDizini[h.ders] || [];
  if (YAPI_FARKLI[h.ders]) {
    sonuc.push(Object.assign({}, h, {
      kodlar: [], guven: "yok", yontem: "yapi-farkli", skor: 0, uyari: "",
      gerekce: YAPI_FARKLI[h.ders]
    }));
    continue;
  }
  if (BECERI_EKSENLI.has(h.ders)) {
    sonuc.push(Object.assign({}, h, {
      kodlar: [], guven: "yok", yontem: "beceri-eksenli", skor: 0, uyari: "",
      gerekce: "TDE programı dil becerisi eksenli (TDE1.1-TDE4.4); tür/gramer konusu resmî çıktıyla birebir eşlenemez."
    }));
    continue;
  }
  if (!adaylar.length) {
    sonuc.push(Object.assign({}, h, { kodlar: [], guven: "yok", yontem: "ders-yok", skor: 0, uyari: "", gerekce: "Bu dersin 10. sınıf tablosu yok." }));
    continue;
  }
  const baslik = kelimeler(h.konu);
  const altKelimeler = kelimeler(h.altBeceriler.join(" "));
  const kazAnimKelimeleri = h.kazanimlar.map(kelimeler);

  // 1) HER kazanım metni ayrı ayrı resmî çıktıya bağlanır: bir konu
  // birden çok çıktıyı kapsayabilir (Biyoloji 1.5 Sindirim → 10.1.5 + 10.1.6).
  const metinKod = [];
  let enIyi = { skor: 0, cikti: null };
  for (const metin of h.kazanimlar) {
    const kk = kelimeler(metin);
    let sec = null;
    for (const c of adaylar) {
      const skor = dice(kk, kelimeler(c.kazanim));
      if (!sec || skor > sec.skor) sec = { skor, cikti: c };
    }
    if (!sec) continue;
    metinKod.push({ metin, skor: sec.skor, cikti: sec.cikti });
    if (sec.skor > enIyi.skor) enIyi = { skor: sec.skor, cikti: sec.cikti };
  }

  let karar = null;

  // 0) elle doğrulanmış istisna (gerekçesi yazılı)
  if (ELLE[h.konu_id]) {
    const e = ELLE[h.konu_id];
    karar = {
      kodlar: e.kodlar, guven: e.kodlar.length ? "yapisal" : "yok",
      yontem: "elle-dogrulama", skor: 0, uyari: "", gerekce: e.gerekce
    };
  }

  // 1) kazanım metinleri resmî çıktı cümlelerine indirgendi
  if (!karar && enIyi.cikti && enIyi.skor >= KESIN_ESIK) {
    const gecen = metinKod.filter(x => x.skor >= KESIN_ESIK);
    const kodlar = Array.from(new Set(gecen.map(x => x.cikti.kod)))
      .sort((a, b) => (a.length - b.length) || a.localeCompare(b, "tr"));
    const ayniTema = gecen.every(x => x.cikti.tema === h.tema);
    karar = {
      kodlar: kodlar,
      guven: ayniTema ? "kesin" : "orta",
      yontem: "kazanim-metni",
      skor: Math.round(enIyi.skor * 1000) / 1000,
      uyari: ayniTema ? "" : "tema-uyumsuz",
      gerekce: "",
      _metinKod: gecen
    };
  }

  // 2) konu başlığı resmî çıktının içinde aynen geçiyor (aynı tema)
  if (!karar) {
    const ayniTema = adaylar.filter(c => c.tema === h.tema);
    const gecen = [];
    for (const c of ayniTema) {
      const ck = kelimeler(c.kazanim);
      const n = baslikGeciyor(baslik, ck);
      if (n > 0) gecen.push({ c: c, n: n, ek: ck.length - n });
    }
    if (gecen.length) {
      gecen.sort((a, b) => b.n - a.n || a.ek - b.ek);
      karar = {
        kodlar: [gecen[0].c.kod], guven: "yapisal", yontem: "baslik-geciyor",
        skor: 1, uyari: "", gerekce: ""
      };
    }
  }

  // 3) temada tek çıktı var → konu ne olursa olsun o çıktıya bağlıdır
  const temaAday = temaCiktilar(h.ders, h.tema);
  if (!karar && temaAday.length === 1) {
    const c = temaAday[0];
    const b = Math.max(dice(baslik, kelimeler(c.kazanim)), dice(altKelimeler, kelimeler(c.kazanim)));
    if (b >= YAPISAL_BASLIK_ESIK) {
      karar = {
        kodlar: [c.kod], guven: "yapisal", yontem: "tek-cikti",
        skor: Math.round(b * 1000) / 1000, uyari: "", gerekce: ""
      };
    }
  }

  // 4) tema içi sıra: konu sayısı = çıktı sayısı ve numaralandırma uyumlu
  const temaHavuz = havuzlar.filter(x => x.ders === h.ders && x.tema === h.tema);
  if (!karar && !SIRA_KAPALI.has(h.ders) && temaAday.length > 1 && temaHavuz.length === temaAday.length && numaraUyumlu(h.konu, h.tema)) {
    const sira = temaHavuz.slice().sort((a, b) => a.sira - b.sira).findIndex(x => x.konu_id === h.konu_id);
    if (sira >= 0 && sira < temaAday.length) {
      const c = temaAday[sira];
      const b = Math.max(dice(baslik, kelimeler(c.kazanim)), dice(altKelimeler, kelimeler(c.kazanim)));
      if (b >= YAPISAL_BASLIK_ESIK) {
        karar = {
          kodlar: [c.kod], guven: "yapisal", yontem: "sira",
          skor: Math.round(b * 1000) / 1000, uyari: "", gerekce: ""
        };
      }
    }
  }

  // 5) yalnız başlık benzerliği → onay ister
  if (!karar) {
    // Aynı tema dışına öneri yazmayız: tema 2 konusuna tema 1 çıktısı önerilmez.
    const skorlar = temaAday.map(c => ({
      c: c,
      skor: Math.max(dice(baslik, kelimeler(c.kazanim)), dice(altKelimeler, kelimeler(c.kazanim)))
    })).sort((a, b) => b.skor - a.skor);
    if (skorlar.length) {
      const birinci = skorlar[0], ikinci = skorlar[1];
      if (birinci.skor >= ORTA_BASLIK_ESIK && (!ikinci || birinci.skor - ikinci.skor >= ORTA_FARK_ESIK)) {
        karar = {
          kodlar: [birinci.c.kod], guven: "orta", yontem: "baslik-benzerligi",
          skor: Math.round(birinci.skor * 1000) / 1000, uyari: "", gerekce: ""
        };
      }
    }
  }

  // 6) kanıt yok
  if (!karar) {
    karar = { kodlar: [], guven: "yok", yontem: "kanit-yok", skor: 0, uyari: "", gerekce: "" };
  }

  sonuc.push(Object.assign({}, h, karar));
}

// ---------------- metin → konu (çalışma zamanı) ----------------
const metinEsleme = [];
const eslesmeyen = [];
for (const h of sonuc) {
  const kendiKodu = {};
  for (const x of (h._metinKod || [])) kendiKodu[x.metin] = x.cikti.kod;
  for (const metin of h.kazanimlar) {
    const kod = kendiKodu[metin] || null;
    metinEsleme.push({
      ders: h.ders,
      metin,
      norm: kok(metin),
      konu_id: h.konu_id,
      konu: h.konu,
      topic_key: h.topic_key,
      kodlar: kod ? [kod] : h.kodlar,
      kod_guven: kod ? "kesin" : (h.guven === "yok" ? "yok" : h.guven),
      konu_guven: "kesin"            // metin bu havuzun sorularında aynen var
    });
    if (!kod) eslesmeyen.push({ ders: h.ders, metin, konu_id: h.konu_id, konu_kodlari: h.kodlar });
  }
}
// Aynı metin birden fazla konuya yazıldıysa işaretle (otomatik uygulanmaz)
const metinSayaci = {};
for (const e of metinEsleme) {
  const k = e.ders + "|" + e.norm;
  metinSayaci[k] = (metinSayaci[k] || 0) + 1;
}
for (const e of metinEsleme) {
  const n = metinSayaci[e.ders + "|" + e.norm];
  if (n > 1) { e.coklu = true; e.konu_guven = "coklu"; }
}

// ---------------- çıktılar ----------------
const dersOzet = {};
const tanim = (liste, evet) => liste.filter(evet).length;
for (const ders of dersler) {
  const liste = sonuc.filter(h => h.ders === ders);
  dersOzet[ders] = {
    konu: liste.length,
    cikti: (ciktiDizini[ders] || []).length,
    kesin: tanim(liste, h => h.guven === "kesin"),
    yapisal: tanim(liste, h => h.guven === "yapisal"),
    orta: tanim(liste, h => h.guven === "orta"),
    yok: tanim(liste, h => h.guven === "yok"),
    metin: liste.reduce((n, h) => n + h.kazanimlar.length, 0),
    metin_tek_konu: metinEsleme.filter(e => e.ders === ders && !e.coklu).length,
    metin_kodlu: metinEsleme.filter(e => e.ders === ders && e.kodlar.length).length
  };
}

const denetim = {
  surum: resmi.surum,
  kaynak: "site/content/mufredat/meb_kazanim_10.json",
  uretici: "scripts/meb-kazanim-uret.js",
  katmanlar: {
    kesin: "Okulizyon kazanım metni resmî çıktı cümlesine indirgendi (Dice ≥ .80) — otomatik.",
    yapisal: "Metin yok/farklı; ünite no = MEB tema no, konu sırası = çıktı sırası — otomatik.",
    orta: "Yalnız başlık benzerliği — otomatik uygulanmaz, onay ister.",
    yok: "Kanıt yetersiz — kod yazılmadı."
  },
  ozet: {
    ders: dersler.length,
    cikti: ciktilar.length,
    konu: sonuc.length,
    eslesen_konu: tanim(sonuc, h => h.kodlar.length && h.guven !== "orta"),
    oneri_konu: tanim(sonuc, h => h.guven === "orta"),
    eslesmeyen_konu: tanim(sonuc, h => !h.kodlar.length),
    metin: metinEsleme.length,
    metin_tek_konu: metinEsleme.filter(e => !e.coklu).length,
    metin_kodlu: metinEsleme.filter(e => e.kodlar.length).length,
    ders_bazli: dersOzet
  },
  konular: sonuc.map(h => ({
    konu_id: h.konu_id, ders: h.ders, konu: h.konu, tema: h.tema,
    kodlar: h.kodlar, guven: h.guven, yontem: h.yontem, skor: h.skor,
    uyari: h.uyari || "",
    gerekce: h.gerekce || "",
    kazanim_metinleri: h.kazanimlar.length,
    metin_kodlari: (h._metinKod || []).map(x => ({ metin: x.metin, kod: x.cikti.kod, skor: Math.round(x.skor * 1000) / 1000 }))
  })),
  metin_esleme: metinEsleme,
  eslesmeyen_metinler: eslesmeyen
};
yazJson(CIKTI_JSON, denetim);

// ---------------- tarayıcı modülü ----------------
const tablo = {};
for (const ders of dersler) {
  tablo[ders] = (ciktiDizini[ders] || []).map(c => ({ kod: c.kod, tema: c.tema, kazanim: c.kazanim, norm: kok(c.kazanim), kelime: kelimeler(c.kazanim).join(" ") }));
}
const metinMap = metinEsleme.map(e => ({
  ders: e.ders, norm: e.norm, metin: e.metin, konu_id: e.konu_id,
  konu: e.konu, topic_key: e.topic_key, kodlar: e.kodlar,
  konu_guven: e.coklu ? "coklu" : "kesin",
  kod_guven: e.kodlar.length ? e.kod_guven : "yok"
}));

const js = `/* ============================================================
   MEB KAZANIM KATMANI (site/okz-meb.js)
   ------------------------------------------------------------
   OTOMATİK ÜRETİLDİ — ELLE DÜZENLEMEYİN.
   Üretici : scripts/meb-kazanim-uret.js
   Veri    : site/content/mufredat/meb_kazanim_10.json
             (MEB TTKB 2026 ortaöğretim öğrenme çıktıları, 10. sınıf)

   NE YAPAR
   Okulizyon'un gönderdiği kazanım cümlesini MEB'in resmî öğrenme
   çıktısı tablosunda bulur:
     • çıktı KODU  (ör. BİY.10.1.1)  → hangi tema, hangi kazanım
     • konu_id     (ör. biyo_10_u01_k01) → uygulamanın konusu
   Kod eşleşmesi resmî metne dayanır; konu eşleşmesi havuzun kendi
   kazanım metninden gelir. Emin olmadığımızda "yok" deriz.

   API (window.OKZM / module.exports)
     ciktiBul(kazanim, ders)      → {kod,tema,kazanim,skor} | null
     konuBul(kazanim, ders)       → {konuId,topicKey,konu,kodlar,guven} | null
     konuKazanimlari(konu_id)     → [{kod,tema,kazanim}]
     tablo(ders)                  → resmî çıktı listesi
     kok(metin)                   → arama anahtarı
   ============================================================ */
(function (kok_) {
  "use strict";

  var SURUM = ${JSON.stringify(resmi.surum)};
  var TABLO = ${JSON.stringify(tablo)};
  var METIN = ${JSON.stringify(metinMap)};
  var CIKTI_SAYISI = ${ciktilar.length};

  var DURAKLI = new Set(${JSON.stringify(Array.from(DURAKLI))});
  var EKLER = ${JSON.stringify(EKLER)};

  function sade(s) {
    return String(s == null ? "" : s)
      .replace(/ı/g, "i").replace(/İ/g, "i").replace(/T/g, "T").replace(/I/g, "i")
      .normalize("NFD").replace(/[\\u0300-\\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\\s]/g, " ")
      .replace(/\\s+/g, " ")
      .trim();
  }

  function kok(metin) {
    var s = sade(metin);
    if (!s) return "";
    var k = s.split(" ");
    var son = k[k.length - 1];
    for (var i = 0; i < EKLER.length; i++) {
      var ek = EKLER[i];
      if (son.length > ek.length && son.slice(-ek.length) === ek && son.length - ek.length >= 3) {
        k[k.length - 1] = son.slice(0, son.length - ek.length);
        break;
      }
    }
    return k.join(" ");
  }

  function kelimeler(metin) {
    var out = [];
    for (var w of kok(metin).split(" ")) {
      if (w.length < 3 || DURAKLI.has(w)) continue;
      out.push(w);
    }
    return out;
  }

  function ayniKelime(a, b) {
    if (!a || !b) return false;
    if (a === b) return true;
    if (a.length >= 4 && b.length >= 4) return a.slice(0, 4) === b.slice(0, 4);
    return false;
  }

  function dice(aK, bK) {
    if (!aK.length || !bK.length) return 0;
    var kalan = bK.slice(), ortak = 0;
    for (var i = 0; i < aK.length; i++) {
      for (var j = 0; j < kalan.length; j++) {
        if (ayniKelime(aK[i], kalan[j])) { ortak++; kalan.splice(j, 1); break; }
      }
    }
    return (2 * ortak) / (aK.length + bK.length);
  }

  /** Resmî çıktı tablosunda ara: önce birebir kök, sonra Dice */
  function ciktiBul(kazanim, ders) {
    var metin = String(kazanim == null ? "" : kazanim).trim();
    if (!metin) return null;
    var anahtar = kok(metin);
    var liste = TABLO[ders] || (function () {
      var tum = [];
      for (var k in TABLO) tum = tum.concat(TABLO[k]);
      return tum;
    })();
    for (var i = 0; i < liste.length; i++) {
      if (liste[i].norm === anahtar) {
        return { kod: liste[i].kod, tema: liste[i].tema, kazanim: liste[i].kazanim, skor: 1, yontem: "birebir" };
      }
    }
    var enIyi = null, kk = kelimeler(metin);
    for (var j = 0; j < liste.length; j++) {
      var skor = dice(kk, liste[j].kelime ? liste[j].kelime.split(" ") : kelimeler(liste[j].kazanim));
      if (!enIyi || skor > enIyi.skor) enIyi = { kod: liste[j].kod, tema: liste[j].tema, kazanim: liste[j].kazanim, skor: skor };
    }
    if (!enIyi || enIyi.skor < 0.8) return null;
    enIyi.skor = Math.round(enIyi.skor * 1000) / 1000;
    enIyi.yontem = "dice";
    return enIyi;
  }

  /** Kazanım cümlesi → uygulamanın konusu (havuzun kendi kazanım metni) */
  function konuBul(kazanim, ders) {
    var metin = String(kazanim == null ? "" : kazanim).trim();
    if (!metin) return null;
    var anahtar = kok(metin);
    for (var i = 0; i < METIN.length; i++) {
      var e = METIN[i];
      if (e.norm !== anahtar) continue;
      if (ders && e.ders && sade(e.ders) !== sade(ders)) continue;
      if (e.konu_guven === "coklu") {
        // Aynı cümle birden çok konunun havuzunda: konu yazılmaz, kod yazılır.
        return { konuId: null, konu: "", topicKey: "", kodlar: e.kodlar, kodGuven: e.kod_guven, guven: "coklu", metin: e.metin };
      }
      return {
        konuId: e.konu_id, konu: e.konu, topicKey: e.topic_key,
        kodlar: e.kodlar, kodGuven: e.kod_guven, guven: "kesin", metin: e.metin
      };
    }
    return null;
  }

  function konuKazanimlari(konu_id) {
    var out = [], gorulen = {};
    for (var i = 0; i < METIN.length; i++) {
      if (METIN[i].konu_id !== konu_id) continue;
      if (METIN[i].kod_guven !== "kesin" && METIN[i].kod_guven !== "yapisal") continue;
      for (var j = 0; j < METIN[i].kodlar.length; j++) {
        var kod = METIN[i].kodlar[j];
        if (gorulen[kod]) continue;
        gorulen[kod] = 1;
        var c = ciktiByKod(kod);
        if (c) out.push(c);
      }
    }
    return out;
  }

  function ciktiByKod(kod) {
    for (var d in TABLO) {
      for (var i = 0; i < TABLO[d].length; i++) {
        if (TABLO[d][i].kod === kod) return { kod: kod, tema: TABLO[d][i].tema, kazanim: TABLO[d][i].kazanim };
      }
    }
    return null;
  }

  function tablo(ders) {
    return (TABLO[ders] || []).map(function (c) { return { kod: c.kod, tema: c.tema, kazanim: c.kazanim }; });
  }

  var API = {
    surum: SURUM,
    ciktiSayisi: CIKTI_SAYISI,
    dersler: Object.keys(TABLO),
    sade: sade,
    kok: kok,
    kelimeler: kelimeler,
    dice: dice,
    ciktiBul: ciktiBul,
    konuBul: konuBul,
    konuKazanimlari: konuKazanimlari,
    tablo: tablo
  };

  if (typeof module !== "undefined" && module.exports) module.exports = API;
  kok_.OKZM = Object.assign(kok_.OKZM || {}, API);
})(typeof globalThis !== "undefined" ? globalThis : this);
`;
fs.writeFileSync(CIKTI_JS, js, "utf8");

// ---------------- rapor ----------------
console.log("resmî çıktı:", ciktilar.length, "| ders:", dersler.length);
console.log("havuz:", sonuc.length, "| eşleşen:", denetim.ozet.eslesen_konu,
  "| öneri:", denetim.ozet.oneri_konu, "| eşleşmeyen:", denetim.ozet.eslesmeyen_konu);
console.log("metin:", denetim.ozet.metin, "| tek konu:", denetim.ozet.metin_tek_konu, "| kodlu:", denetim.ozet.metin_kodlu);
for (const ders of dersler) {
  const z = dersOzet[ders];
  console.log("  " + ders.padEnd(13) + " çıktı:" + String(z.cikti).padStart(3) +
    " konu:" + String(z.konu).padStart(3) +
    " kesin:" + String(z.kesin).padStart(3) + " yapısal:" + String(z.yapisal).padStart(3) +
    " orta:" + String(z.orta).padStart(3) + " yok:" + String(z.yok).padStart(3) +
    " metin:" + String(z.metin).padStart(4) + " kodlu:" + String(z.metin_kodlu).padStart(4));
}
console.log("yazıldı:", path.relative(KOK, CIKTI_JSON), "ve", path.relative(KOK, CIKTI_JS));
