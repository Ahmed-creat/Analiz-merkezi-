#!/usr/bin/env node
/* ============================================================
   TDE KAZANIM SETİ ÜRETİCİ (scripts/tde-kazanim-uret.js)
   ------------------------------------------------------------
   SORUN
   Dokuz dersin 8'inde Okulizyon kazanım metni → konu eşlemesi
   VERİYLE kurulu (kazanim_konu_10.json + konu_esleme.json).
   TDE'de 30 konunun tamamı "Genel konu becerisi" yer tutucusuyla
   duruyordu; Okulizyon'dan gelen TDE kazanımı hiçbir konuya
   bağlanmıyordu.

   NE YAPAR
   1) site/content/mufredat/tde_kazanim_10.json  (yeni, veri kaydı)
        30 konu × {tema, eksen, çıktı kodları, kazanım metinleri,
        ayırt edici terimler, kaynak}
   2) site/content/konu_esleme.json  → TDE havuzlarının arama metni
        yer tutucu yerine GERÇEK kazanım metinleri + terimler
   3) site/content/mufredat/kazanim_konu_10.json → TDE konularına
        çıktı kodları ve metin_esleme kayıtları

   KAYNAKLAR (uydurma YOK)
   • okulizyon  : kullanıcının verdiği 9 gerçek Okulizyon kazanımı
   • odsgm      : MEB ODSGM 2026-2027 tema bazlı çıktı cümlesi (birebir)
   • tymm       : MEB TYMM 10. sınıf TDE öğrenme çıktısı adı (birebir)
   • konu-adi   : Okulizyon konu ağacındaki başlık (uygulamanın konusu)
   • tema-terim : TYMM tema sayfasının "Anahtar Kavramlar"ından

   Kullanım: node scripts/tde-kazanim-uret.js [--json]
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const D = (p) => path.join(KOK, "site", "content", "mufredat", p);
const ICERIK = require(D("tde_icerik_10.json"));
const MEB = require(D("meb_kazanim_10.json"));
const ODSGM = require(D("odsgm_konu_kazanim_10.json"));
const OKZ = require(D("okulizyon_kazanim_10.json"));

/* ------------------------------------------------------------
   ARAŞTIRMA TABLOSU — 30 konu
   ayirt: Okulizyon kazanım cümlesinde konuyu ele veren terimler.
          Kaynak: TYMM tema içerik çerçevesi + Anahtar Kavramlar
          + Okulizyon'un kendi konu adları. Terimler uydurulmadı;
          tema sayfasında geçen kavramlardır.
   eksen: okuma | dil-bilgisi  (TYMM TDE çıktısı beceri eksenli)
   ------------------------------------------------------------ */
const KONU = {
  edebiyat_10_u01_k01: { eksen: "okuma", ayirt: ["koşuk", "destan dönemi", "kopuz", "sığır", "şölen"] },
  edebiyat_10_u01_k02: { eksen: "okuma", ayirt: ["sav", "atasözü"] },
  edebiyat_10_u01_k03: { eksen: "okuma", ayirt: ["türkü", "kavuştak", "nakarat"] },
  edebiyat_10_u01_k04: { eksen: "okuma", ayirt: ["koşma", "güzelleme", "koçaklama", "taşlama"] },
  edebiyat_10_u01_k05: { eksen: "dinleme", ayirt: ["masal", "tekerleme", "masal anlatıcısı", "varyant"] },
  edebiyat_10_u01_k06: { eksen: "dil-bilgisi", ayirt: ["isim", "ad soylu", "varlık adı"] },
  edebiyat_10_u01_k07: { eksen: "dil-bilgisi", ayirt: ["isim tamlaması", "tamlayan", "tamlanan"] },
  edebiyat_10_u01_k08: { eksen: "dil-bilgisi", ayirt: ["sıfat", "ön ad", "niteleme sıfatı", "belirtme sıfatı"] },
  edebiyat_10_u01_k09: { eksen: "dil-bilgisi", ayirt: ["sıfat tamlaması"] },

  edebiyat_10_u02_k01: { eksen: "okuma", ayirt: ["gazel", "matla", "makta"] },
  edebiyat_10_u02_k02: { eksen: "okuma", ayirt: ["kaside", "methiye", "nesib", "fahriye", "tegazzül"] },
  edebiyat_10_u02_k03: { eksen: "okuma", ayirt: ["mersiye"] },
  edebiyat_10_u02_k04: { eksen: "okuma", ayirt: ["saf şiir", "imge", "mazmun", "edebî sanat"] },
  edebiyat_10_u02_k05: { eksen: "dil-bilgisi", ayirt: ["zamir", "adıl"] },
  edebiyat_10_u02_k06: { eksen: "dil-bilgisi", ayirt: ["edat", "ilgeç"] },
  edebiyat_10_u02_k07: { eksen: "dil-bilgisi", ayirt: ["bağlaç"] },
  edebiyat_10_u02_k08: { eksen: "dil-bilgisi", ayirt: ["ünlem"] },
  edebiyat_10_u02_k09: { eksen: "dil-bilgisi", ayirt: ["anlamına göre cümle", "cümle anlamı", "olumlu cümle", "olumsuz cümle", "soru cümlesi"] },

  edebiyat_10_u03_k01: { eksen: "okuma", ayirt: ["destan", "doğal destan", "yapma destan", "motif"] },
  edebiyat_10_u03_k02: { eksen: "okuma", ayirt: ["mesnevi"] },
  edebiyat_10_u03_k03: { eksen: "okuma", ayirt: ["halk hikâyesi"] },
  edebiyat_10_u03_k04: { eksen: "dinleme", ayirt: ["fabl"] },
  edebiyat_10_u03_k05: { eksen: "dil-bilgisi", ayirt: ["zarf", "belirteç"] },
  edebiyat_10_u03_k06: { eksen: "okuma", ayirt: ["ahenk", "uyak", "redif", "aliterasyon", "asonans", "kafiye", "ölçü", "durak", "aruz", "ritim"] },

  edebiyat_10_u04_k01: { eksen: "okuma", ayirt: ["dede korkut"] },
  edebiyat_10_u04_k02: { eksen: "okuma", ayirt: ["tanzimat", "namık kemal", "ziya paşa", "şinasi", "abdülhak hamit"] },
  edebiyat_10_u04_k03: { eksen: "dil-bilgisi", ayirt: ["fiil", "eylem", "kip", "çatı"] },
  edebiyat_10_u04_k04: { eksen: "dil-bilgisi", ayirt: ["yazım", "imla"] },
  edebiyat_10_u04_k05: { eksen: "dil-bilgisi", ayirt: ["noktalama", "virgül", "kesme işareti"] },
  edebiyat_10_u04_k06: { eksen: "dil-bilgisi", ayirt: ["paragraf", "anlatım biçimi", "anlatım tekniği", "düşünceyi geliştirme"] }
};

/* ------------------------------------------------------------
   2. AŞAMA — GENEL BECERİ CÜMLELERİ (fallback)
   Yayınevi kazanım cümlesinde belirli bir tür/dönem adı geçmiyorsa
   cümle "anlam bilgisi" havuzuna yönlenir. 10. sınıf master konu
   listesinde bu alanı karşılayan TEK konu var: "Paragraf".
   (9. sınıfta "Sözcüğün Anlam Özellikleri", "Anlatım Biçimleri" ayrı
   konular; 10. sınıfta havuzu yok. Uydurma konu açmıyoruz.)
   Bu eşleşmeler KESİN DEĞİL: guven "genel" olarak işaretlenir ve
   öğrenci Profil → Konu Eşlemesi'nden tek dokunuşla değiştirebilir.
   ------------------------------------------------------------ */
const GENEL_BECERI = [
  {
    ad: "cikarim",
    hedef: "Paragraf",
    desen: /cikarim|sonuc cikar|tahmin|anlamlandir|yorumla/,
    ornekler: ["Metinlerden hareketle çıkarımlar yapar."],
    gerekce: "Cümlede tür/dönem adı yok; çıkarım anlam bilgisinin (paragraf) becerisidir."
  },
  {
    ad: "ana-dusunce",
    hedef: "Paragraf",
    desen: /ana dusunce|ana fikir|metnin konu|konusunu belir|temasini belir|yardimci dusunce/,
    ornekler: ["Metnin konusunu ve ana düşüncesini belirler."],
    gerekce: "Konu/ana düşünce tespiti paragraf konusudur."
  },
  {
    ad: "soz-varligi",
    hedef: "Paragraf",
    desen: /soz varlig|sozcuk.*anlam|kelime.*anlam|baglamdan.*anlam|anlamini belirle/,
    ornekler: ["Metindeki söz varlığının anlamını bağlamdan hareketle belirler."],
    gerekce: "10. sınıfta sözcük-anlam havuzu Paragraf altında toplanır (ayrı konu yok)."
  },
  {
    ad: "anlatim",
    hedef: "Paragraf",
    desen: /anlatim bicimi|anlatim teknigi|dusunceyi gelistir|anlatim ozelligi|akicilik|duruluk/,
    ornekler: ["Metinde kullanılan anlatım biçimlerini belirler."],
    gerekce: "Anlatım biçimleri paragraf konusudur."
  },
  /* v73 — kullanıcı kuralı: "eğer genellikle metinden bahsediyorsa
     paragrafa bağlanır". En sona yazılır: tür/dönem adı geçen cümleler
     önceki kurallarla ya da sözlükle bağlanır, buraya konusuz kalanlar düşer. */
  {
    ad: "metin",
    hedef: "Paragraf",
    desen: /(^| )met[in][a-z]*/,   // metin · metni · metnin · metne · metinler
    ornekler: [
      "Metni millî, manevi ve evrensel değerlerin aktarımı bağlamında değerlendirir.",
      "Metnin yapı unsurlarının metne olan katkısını değerlendirir.",
      "Yazarın metni yazma amacını belirler."
    ],
    gerekce: "Cümlede tür/dönem adı yok ama doğrudan metin konu ediliyor; metni anlama/çözümleme anlam bilgisinin (paragraf) becerisidir."
  }
];

/* Tema numarası → Okulizyon havuzu (u01…u04) eşleşmesi konu_id'den gelir. */
const temaNo = (konu_id) => Number(String(konu_id).split("_u")[1].slice(0, 2));

/* Bir konunun bağlı olduğu TYMM çıktı kodları: ekseni + teması */
function kodlar(konu_id, eksen) {
  const t = ICERIK.temalar.find((x) => x.no === temaNo(konu_id));
  if (!t) return [];
  if (eksen === "dinleme") return t.dinleme.ciktilar.slice();
  if (eksen === "okuma") return t.okuma.ciktilar.slice();
  return []; // dil bilgisi: TYMM çıktısı beceri eksenli, kural konusuna kod yazılmaz
}

/* Okulizyon'un gerçek cümleleri (kullanıcı 17 Kasım) → konu */
const OKULIZYON_METIN = (() => {
  const liste = Array.isArray(OKZ) ? OKZ : OKZ.kazanimlar || OKZ.kayitlar || [];
  const harita = {
    "edebiyat_10_u01_k01": ["Destan Dönemi Türk şiirini ve koşuk türünün genel özelliklerini açıklar."],
    "edebiyat_10_u01_k03": ["Türkü türünün genel özelliklerini belirler."],
    "edebiyat_10_u01_k04": ["Halk şiirini tanımlar, halk şiiri altında koşma türünün genel özelliklerini kavrar."],
    "edebiyat_10_u03_k06": [
      "Şiirde ahengi sağlayan özellikleri (uyak düzeni, uyak, redif, aliterasyon, asonans) ile ilgili çalışma yapar."
    ]
  };
  /* 9 cümlenin 4'ü konu adı taşır (yukarıda). Kalan 5'i ya aynı cümlenin
     tekrarı ya da konu adı OLMAYAN genel okuma becerisidir — konuya değil
     TDE2.2/TDE2.3 çıktısına bağlanır, uydurma eşleme yapılmaz. */
  harita.__genel = liste
    .map((k) => k.okulizyon)
    .filter((m) => !Object.values(harita).flat().includes(m))
    .filter((m, i, a) => a.indexOf(m) === i);
  return harita;
})();

/* ODSGM tema bazlı çıktı cümlesi (tema 1-2 için birebir var).
   ANAHTAR tema+kod: TDE2.1 her temada ayrı cümle taşır ("Sözün Ezgisi"…
   / "Kelimelerin Ritmi"…). Yalnız koda bakmak tema 2 cümlesini tema 1
   konusuna yazdırıyordu. */
const odsgmCumle = {};
for (const k of ODSGM.konular || []) {
  if (!/Edebiyat/i.test(k.ders || "")) continue;
  const mt = /(\d)\.\s*TEMA/i.exec(k.unite || "");
  const tema = mt ? Number(mt[1]) : null;
  for (const c of k.ciktilar || []) {
    if (!c.kazanim || !tema) continue;
    odsgmCumle[tema + "|" + c.kod] = c.kazanim;
  }
}

const MEB_ADI = {};
for (const c of MEB.ciktilar || []) if (/Edebiyat/i.test(c.ders || "")) MEB_ADI[c.kod] = c.kazanim;

function kazanimlar(konu_id, konu, eksen) {
  const out = [{ metin: konu, kaynak: "konu-adi" }];
  for (const m of OKULIZYON_METIN[konu_id] || []) out.push({ metin: m, kaynak: "okulizyon" });
  const tema = temaNo(konu_id);
  for (const kod of kodlar(konu_id, eksen)) {
    const od = odsgmCumle[tema + "|" + kod];
    out.push(
      od
        ? { metin: od, kaynak: "odsgm", kod }
        : { metin: MEB_ADI[kod] || "", kaynak: "tymm", kod }
    );
  }
  return out.filter((x) => x.metin);
}

function temaTerimleri(konu_id, ayirt) {
  const t = ICERIK.temalar.find((x) => x.no === temaNo(konu_id));
  const anahtar = (t && t.anahtar_kavramlar) || [];
  const sade = (s) => String(s).toLocaleLowerCase("tr-TR");
  const ay = ayirt.map(sade);
  /* temanın anahtar kavramlarından bu konuya ait olanlar: terimin kökü
     konu terimlerinden biriyle örtüşüyorsa alınır (kanıt: TYMM listesi) */
  const ilgili = anahtar.filter((k) => {
    const kk = sade(k);
    return ay.some((a) => a.includes(kk.split(" ")[0]) || kk.includes(a.split(" ")[0]));
  });
  return { anahtar_kavramlar: anahtar, konuya_ait: ilgili };
}

/* Havuzu silinmiş konuların ADI (havuz dosyasındaki topic_key'den alındı). */
const AD_ACIL = {
  edebiyat_10_u03_k06: "Şiirde Ahenk (Ölçü, Uyak, Redif, Aliterasyon, Asonans)",
  edebiyat_10_u04_k06: "Paragraf"
};
/* Müfredat adı eşlemesi: konu_id → 10. sınıf TDE konu adı (konular.js).
   Sıra birebir olmadığı için ada göre değil, konu_id sırasıyla eşlenen
   SABİT tablo kullanılır; tablo yoksa boş kalır. */
const MUFREDAT_KONU = {};

function uret() {
  const h = JSON.parse(fs.readFileSync(path.join(KOK, "site/content/konu_esleme.json"), "utf8"));
  const havuz = {};
  for (const x of h.havuzlar || []) havuz[x.konu_id] = x;

  const konular = Object.keys(KONU).map((konu_id) => {
    const bilgi = KONU[konu_id];
    const tema = ICERIK.temalar.find((x) => x.no === temaNo(konu_id));
    const hav = havuz[konu_id];
    /* v72 — SORU HAVUZU SİLİNMİŞ OLABİLİR. Kullanıcı isteğiyle ajanın elle
       yazdığı 20 havuz kaldırıldı (2'si TDE). Havuz yoksa konu adı konu_id'ye
       düşüp VERİYİ BOZUYORDU. Ad artık konular.js müfredat listesinden
       (10. sınıf TDE) eşlenir; bulunamazsa AD_ACIL listesine bakılır. */
    const konu = (hav && hav.konu) || AD_ACIL[konu_id] || (MUFREDAT_KONU[konu_id]) || konu_id;
    const { anahtar_kavramlar, konuya_ait } = temaTerimleri(konu_id, bilgi.ayirt);
    const kz = kazanimlar(konu_id, konu, bilgi.eksen);
    return {
      konu_id,
      ders: "Türk Dili ve Edebiyatı",
      sinif: 10,
      tema: tema ? tema.no : null,
      tema_ad: tema ? tema.ad : "",
      konu,
      eksen: bilgi.eksen,
      ciktilar: kodlar(konu_id, bilgi.eksen),
      ayirt_edici_terimler: bilgi.ayirt,
      kazanimlar: kz,
      anahtar_kavramlar: konuya_ait.length ? konuya_ait : anahtar_kavramlar.slice(0, 4),
      kaynak_url: tema ? tema.url : ""
    };
  });

  const dosya = {
    surum: "2026-10-27",
    ders: "Türk Dili ve Edebiyatı",
    sinif: 10,
    program: "TYMM 2026-2027 — 10. sınıf TDE, 4 tema",
    aciklama:
      "TDE'nin Okulizyon kazanım seti. Her konu, TYMM çıktı kodlarına ve " +
      "ayırt edici terimlere bağlıdır. Okulizyon kazanım cümlesi bu terimlerden " +
      "birini içeriyorsa konu kesinleşir; içermiyorsa beceri çıktısına bağlanır.",
    kaynaklar: {
      okulizyon: "Kullanıcının Okulizyon hesabından verdiği 9 gerçek kazanım cümlesi (17 Kasım).",
      odsgm: "MEB ODSGM 2026-2027 1. dönem ortak yazılı konu-soru dağılım tablosu (tema bazlı çıktı cümlesi).",
      tymm: "MEB TYMM 10. sınıf TDE öğrenme çıktısı adı (16 çıktı, 4 eksen).",
      "konu-adi": "Okulizyon konu ağacındaki konu başlığı.",
      "tema-terim": "TYMM tema sayfasının Anahtar Kavramlar listesi."
    },
    genel_beceri: {
      aciklama:
        "2. aşama: cümlede tür/dönem adı yoksa anlam bilgisi havuzuna yönlendirilir. " +
        "guven 'genel' — kesin değil, öğrenci tek dokunuşla değiştirebilir.",
      hedef_konu: "Paragraf",
      kurallar: GENEL_BECERI
    },
    sozluk: Object.fromEntries(
      konular.flatMap((k) =>
        k.ayirt_edici_terimler.map((t) => [String(t).toLocaleLowerCase("tr-TR"), k.konu])
      )
    ),
    genel_kazanimlar: (OKULIZYON_METIN.__genel || []).map((m) => ({
      metin: m,
      kaynak: "okulizyon",
      neden_konusuz:
        "Cümlede konu adı yok (genel okuma becerisi). Tek bir konuya bağlanmaz; " +
        "Okulizyon bu kazanımı hangi tema sorusuna yazdıysa o temanın TDE2.x çıktısına aittir.",
      ciktilar: ["TDE2.2", "TDE2.3"]
    })),
    ozet: {
      konu: konular.length,
      okulizyon_cumlesi: konular.reduce((n, k) => n + k.kazanimlar.filter((x) => x.kaynak === "okulizyon").length, 0),
      genel_okulizyon_cumlesi: (OKULIZYON_METIN.__genel || []).length,
      kodlu_konu: konular.filter((k) => k.ciktilar.length).length,
      dil_bilgisi_konu: konular.filter((k) => k.eksen === "dil-bilgisi").length,
      terim: konular.reduce((n, k) => n + k.ayirt_edici_terimler.length, 0)
    },
    konular
  };
  fs.writeFileSync(D("tde_kazanim_10.json"), JSON.stringify(dosya, null, 1));

  /* --- konu_esleme.json: TDE arama metni --- */
  for (const k of dosya.konular) {
    const hav = havuz[k.konu_id];
    if (!hav) continue;
    /* Arama indeksine YALNIZ ayırt edici metin girer:
       konu adı + Okulizyon cümlesi + ayırt edici terim.
       Tema çıktı cümleleri ("… temasında ele alınan metinlerde anlam
       oluşturabilme") temanın BÜTÜN konularında aynı olduğu için indekse
       girmez; girerse "metinlerden hareketle çıkarımlar yapar" gibi genel
       beceri cümleleri rastgele bir konuya "öneri" olarak bağlanıyordu. */
    const parcalar = [hav.konu];
    for (const x of k.kazanimlar) if (x.kaynak === "okulizyon") parcalar.push(x.metin);
    for (const x of k.ayirt_edici_terimler) parcalar.push(x);
    hav.metin = [...new Set(parcalar.map((s) => String(s).trim()).filter(Boolean))].join(" · ");
  }
  h.surum = dosya.surum;
  h.aciklama =
    "Okulizyon kazanım metni → konu başlığı arama indeksi. TDE metinleri " +
    "site/content/mufredat/tde_kazanim_10.json'dan üretilir (scripts/tde-kazanim-uret.js).";
  h.alt_beceri_sayisi = (h.havuzlar || []).reduce(
    (n, x) => n + String(x.metin || "").split(" · ").filter(Boolean).length, 0);
  fs.writeFileSync(path.join(KOK, "site/content/konu_esleme.json"), JSON.stringify(h, null, 1));

  /* --- kazanim_konu_10.json: TDE konuları + metin eşlemesi --- */
  const KK = JSON.parse(fs.readFileSync(D("kazanim_konu_10.json"), "utf8"));
  const byId = {};
  for (const k of dosya.konular) byId[k.konu_id] = k;
  for (const k of KK.konular || []) {
    const x = byId[k.konu_id];
    if (!x) continue;
    k.kodlar = x.ciktilar.slice();
    k.yontem = x.ciktilar.length ? "beceri-eksenli-tema" : "dil-bilgisi-kodsuz";
    k.guven = x.ciktilar.length ? "yapisal" : "yok";
    k.gerekce = x.ciktilar.length
      ? "TDE çıktısı beceri eksenli; konunun teması ve ekseni (okuma/dinleme) resmî çıktı kodunu belirler. " +
        "Kodlar ODSGM tema tablosuyla aynıdır."
      : "Dil bilgisi konusu: TYMM TDE çıktısı beceri eksenli olduğu için kural konusuna kod yazılmadı.";
    k.kazanim_metinleri = x.kazanimlar.length;
    k.metin_kodlari = x.kazanimlar
      .filter((c) => c.kod)
      .map((c) => ({ metin: String(c.metin).toLocaleLowerCase("tr-TR"), kod: c.kod, skor: 1 }));
  }
  const eski = (KK.metin_esleme || []).filter((m) => !/Edebiyat/i.test(m.ders || ""));
  const yeni = [];
  for (const k of dosya.konular) {
    for (const c of k.kazanimlar) {
      yeni.push({
        ders: "Türk Dili ve Edebiyatı",
        metin: c.metin,
        norm: String(c.metin).toLocaleLowerCase("tr-TR"),
        kaynak: c.kaynak,
        konu_id: k.konu_id,
        konu: k.konu,
        topic_key: "Türk Dili ve Edebiyatı > " + k.konu,
        kodlar: c.kod ? [c.kod] : k.ciktilar.slice(),
        kod_guven: (c.kod || k.ciktilar.length) ? "yapisal" : "yok",
        konu_guven: "yapisal"
      });
    }
  }
  /* Aynı cümle birden çok konuya yazıldıysa (tema çıktı cümleleri 4 konuda
     birden geçer) tek konuya bağlanamaz: "coklu" işaretlenir, konu yazılmaz.
     Bu, meb-kazanim-uret.js'in diğer derslerde uyguladığı kuralın aynısıdır. */
  const sayac = {};
  for (const e of yeni) sayac[e.ders + "|" + e.norm] = (sayac[e.ders + "|" + e.norm] || 0) + 1;
  for (const e of yeni) {
    if (sayac[e.ders + "|" + e.norm] > 1) { e.coklu = true; e.konu_guven = "coklu"; }
  }
  KK.metin_esleme = eski.concat(yeni);
  const db = KK.ozet.ders_bazli["Türk Dili ve Edebiyatı"];
  db.yapisal = dosya.konular.filter((k) => k.ciktilar.length).length;
  db.yok = dosya.konular.filter((k) => !k.ciktilar.length).length;
  db.metin = yeni.length;
  db.metin_tek_konu = yeni.filter((e) => !e.coklu).length;
  db.metin_kodlu = yeni.filter((m) => (m.kodlar || []).length).length;
  KK.ozet.metin = (KK.metin_esleme || []).length;
  KK.ozet.metin_tek_konu = (KK.metin_esleme || []).filter((e) => !e.coklu).length;
  fs.writeFileSync(D("kazanim_konu_10.json"), JSON.stringify(KK, null, 1));

  /* --- okz-meb.js: METIN dizisine TDE kayıtlarını ekle --- */
  const MEBJS = path.join(KOK, "site", "okz-meb.js");
  let js = fs.readFileSync(MEBJS, "utf8");
  // norm alanı modülün kendi kök indirgemesiyle üretilmeli; yoksa konuBul
  // birebir karşılaştırmada tutmaz (kok: "…belirler." → "…belirle").
  delete require.cache[require.resolve(MEBJS)];
  const KOKFN = require(MEBJS).kok;
  const bas = js.indexOf("var METIN = ");
  const bit = js.indexOf(";\n", bas);
  if (bas < 0 || bit < 0) throw new Error("okz-meb.js içinde METIN bulunamadı");
  const mevcut = JSON.parse(js.slice(bas + "var METIN = ".length, bit))
    .filter((e) => !/Edebiyat/i.test(e.ders || ""));   // önceki TDE kayıtlarını at (idempotent)
  const tdeMetin = [];
  const normSayac = {};
  for (const k of dosya.konular) for (const c of k.kazanimlar) normSayac[KOKFN(c.metin)] = (normSayac[KOKFN(c.metin)] || 0) + 1;
  for (const k of dosya.konular) {
    for (const c of k.kazanimlar) {
      tdeMetin.push({
        ders: "Türk Dili ve Edebiyatı",
        norm: KOKFN(c.metin),
        metin: c.metin,
        konu_id: k.konu_id,
        konu: k.konu,
        topic_key: "Türk Dili ve Edebiyatı > " + k.konu,
        kodlar: c.kod ? [c.kod] : k.ciktilar.slice(),
        konu_guven: normSayac[KOKFN(c.metin)] > 1 ? "coklu" : "yapisal",
        kod_guven: (c.kod || k.ciktilar.length) ? "yapisal" : "yok"
      });
    }
  }
  const yeniMetin = mevcut.concat(tdeMetin);
  js = js.slice(0, bas + "var METIN = ".length) + JSON.stringify(yeniMetin) + js.slice(bit);
  fs.writeFileSync(MEBJS, js);

  return dosya;
}

if (require.main === module) {
  const d = uret();
  const json = process.argv.includes("--json");
  if (json) {
    console.log(JSON.stringify({ ozet: d.ozet, konular: d.konular.map((k) => ({ konu_id: k.konu_id, konu: k.konu, tema: k.tema, eksen: k.eksen, ciktilar: k.ciktilar, kazanim: k.kazanimlar.length })) }, null, 1));
  } else {
    console.log("\n== TDE KAZANIM SETİ ==");
    console.log("konu: " + d.ozet.konu + " · kodlu: " + d.ozet.kodlu_konu + " · dil bilgisi: " + d.ozet.dil_bilgisi_konu);
    console.log("Okulizyon cümlesi: " + d.ozet.okulizyon_cumlesi + " · ayırt edici terim: " + d.ozet.terim);
    console.log("");
    for (const k of d.konular) {
      console.log(
        "T" + k.tema + " " + String(k.konu).padEnd(34) +
        (k.ciktilar.length ? k.ciktilar.join(",") : "kod yok").padEnd(28) +
        "kzn:" + String(k.kazanimlar.length).padEnd(3) +
        "terim:" + k.ayirt_edici_terimler.length
      );
    }
  }
}

module.exports = { uret, KONU };
