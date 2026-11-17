#!/usr/bin/env node
/* ============================================================
   HAVUZ DENETLEYİCİ (hızlı kapı)
   ------------------------------------------------------------
   scripts/soru-uret-dogrula.js'in kapsamadığı kuralları da denetler:
     · soru kökü 30–600 karakter (talimat §6.2)
     · cozum ≥ 25 karakter ve nedeni açıklar
     · "hepsi / hiçbiri" çeldirici yasağı (§7.4)
     · doğru şıkkın uzunlukla ele vermemesi
     · havuz içi ve TÜM havuzlara karşı yakın-tekrar (trigram)
     · flashcard'ın sorunun kopyası olmaması
     · kaynak alanı (izlenebilirlik)
     · şekle gönderme → gorsel zorunlu

   Kullanım:
     node docs/uretim/araclar/havuz-denetle.js <dosya.json> [...]
     node docs/uretim/araclar/havuz-denetle.js --tumu          # yeni şemalı tüm havuzlar
     node docs/uretim/araclar/havuz-denetle.js --ders Fizik
     node docs/uretim/araclar/havuz-denetle.js --konu          # konu ağacı havuzları (yeni şema)

   Çıkış kodu: hata varsa 1, yoksa 0. Uyarılar çıkış kodunu etkilemez.
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const U = require(path.join(KOK, "scripts", "uretim-veri.js"));
const HAVUZ_DIR = path.join(KOK, "site", "content", "soru_havuzlari");
const GV = require(path.join(KOK, "site", "gorsel.js"));

const planKonu = new Map(U.plan.map(c => [c.konu_id, c]));
const args = process.argv.slice(2);

const SEKIL_ATFI = ["şekilde", "şekildeki", "şekle göre", "şekli verilen", "görselde",
  "görseldeki", "görsele göre", "grafikte", "grafikteki", "grafiğe göre", "tabloda",
  "tablodaki", "tabloya göre", "düzenekte", "düzenekteki", "devredeki", "devrede",
  "haritada", "haritadaki", "şemada", "şemadaki", "şemaya göre", "çizimde", "kesitte",
  "kesitteki", "yukarıdaki şekil", "aşağıdaki şekil", "yukarıdaki grafik", "aşağıdaki grafik"];

function sade(s) {
  return String(s == null ? "" : s)
    .toLocaleLowerCase("tr")
    .replace(/[’‘`´]/g, "'")
    .replace(/^[a-eç]\s*\)\s*/i, "")
    .replace(/[.,;:!?"()[\]…]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
function etiketTemizle(s) { return String(s == null ? "" : s).replace(/^[a-eç]\s*\)\s*/i, "").trim(); }

function ucgenler(metin) {
  const s = " " + sade(metin) + " ";
  const set = new Set();
  for (let i = 0; i < s.length - 2; i++) set.add(s.slice(i, i + 3));
  return set;
}
function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let kesisim = 0;
  for (const x of a) if (b.has(x)) kesisim++;
  return kesisim / (a.size + b.size - kesisim);
}


/* ---- plan kaydı → canlı havuz dosyası -----------------------------------
   Tek yapı U (konu ağacı) olduğundan plan kayıtlarının kendi dosya adları
   (tNN_cNN) diskte yoktur; kazanım kodu → konu eşlemesiyle bulunur. */
const KAZANIM_DOSYA = path.join(KOK, "site", "content", "mufredat", "kazanim_konu_10.json");
const KOD_HAVUZ = new Map();
try {
  const K = JSON.parse(fs.readFileSync(KAZANIM_DOSYA, "utf8"));
  for (const k of (K.konular || [])) {
    const ad = String(k.konu_id || "") + ".json";
    if (!fs.existsSync(path.join(HAVUZ_DIR, ad))) continue;
    for (const kod of (k.kodlar || [])) if (!KOD_HAVUZ.has(kod)) KOD_HAVUZ.set(kod, ad);
  }
} catch (e) { /* eşleme yoksa yalnız plan adıyla çalışılır */ }
function planDosyasi(kayit) {
  if (kayit.dosya && fs.existsSync(path.join(HAVUZ_DIR, kayit.dosya))) return kayit.dosya;
  return KOD_HAVUZ.get(kayit.kod) || null;
}

/* ---- diğer havuzlardaki soru kökleri (global tekrar için) ---- */
function digerHavuzlar(haric) {
  const out = [];
  if (!fs.existsSync(HAVUZ_DIR)) return out;
  for (const f of fs.readdirSync(HAVUZ_DIR)) {
    if (!f.endsWith(".json") || f === "index.json" || f === path.basename(haric)) continue;
    try {
      const p = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, f), "utf8"));
      for (const q of (Array.isArray(p.sorular) ? p.sorular : [])) {
        if (q && q.metin) out.push({ dosya: f, metin: q.metin, uc: ucgenler(q.metin) });
      }
    } catch (e) { /* bozuk dosyayı resmî doğrulayıcı yakalar */ }
  }
  return out;
}

function denetle(dosya) {
  const hatalar = [], uyarilar = [];
  const H = m => hatalar.push(m);
  const W = m => uyarilar.push(m);

  let pool;
  try {
    pool = JSON.parse(fs.readFileSync(dosya, "utf8"));
  } catch (e) {
    return { dosya, hatalar: ["geçersiz JSON: " + e.message], uyarilar, ozet: null };
  }

  const konuId = String(pool.konu_id || "").trim();
  const plan = planKonu.get(konuId);
  /* Konu ağacı havuzu: uygulamanın Bilgi Bankası konuları (ör. Koşuk).
     MEB çıktı kodu yoktur, plan karşılığı yoktur — bu yüzden plan
     denetimi yerine konu sözleşmesi denetlenir. */
  const KONU_SEMA = /_10_u\d+_k\d+$/;
  const konuHavuzu = !plan && KONU_SEMA.test(konuId);
  if (!plan && !konuHavuzu) H("konu_id planda yok: " + JSON.stringify(konuId));
  if (konuHavuzu) {
    if (!String(pool.baslik || "").trim() && !String(pool.topic_key || "").trim()) {
      H("konu havuzunda baslik/topic_key yok (uygulama havuzu başlıkla bulur)");
    }
    if (!String(pool.kazanim || "").trim()) W("konu havuzunda kazanim alanı yok (konu kazanımı yazılmalı)");
  }
  if (konuId && path.basename(dosya) !== konuId + ".json") H("dosya adı konu_id ile uyuşmuyor");

  if (plan) {
    if (String(pool.kod || "") !== plan.kod) H("kod uyuşmuyor: " + pool.kod + " ≠ " + plan.kod);
    if (sade(pool.kazanim) !== sade(plan.kazanim)) H("kazanim resmî çıktıyla aynı değil");
    if (String(pool.ders || "") !== plan.ders) H("ders uyuşmuyor: " + pool.ders);
    if (Number(pool.tema) !== Number(plan.tema)) H("tema uyuşmuyor: " + pool.tema);
    if (plan.tema_adi && pool.tema_adi && String(pool.tema_adi).trim() !== plan.tema_adi) {
      H("tema_adi uyuşmuyor: " + JSON.stringify(pool.tema_adi) + " ≠ " + plan.tema_adi);
    }
  }
  if (Number(pool.sinif) !== 10) H("sinif 10 olmalı");
  if (!pool.kaynak) W("kaynak alanı yok (ders kitabı + sayfa izlenebilirliği)");

  const sorular = Array.isArray(pool.sorular) ? pool.sorular : [];
  if (plan && sorular.length < plan.hedef_soru) {
    H("soru sayısı yetersiz: " + sorular.length + " < " + plan.hedef_soru);
  }

  /* süreç kapsaması */
  const say = new Map();
  const beklenen = plan ? new Map(plan.surec.map(s => [sade(s), s])) : new Map();
  for (const q of sorular) {
    if (!q || !q.alt_beceri) continue;
    const a = sade(q.alt_beceri);
    say.set(a, (say.get(a) || 0) + 1);
    if (beklenen.size && !beklenen.has(a)) {
      H("alt_beceri resmî süreç bileşeni değil: " + String(q.alt_beceri).slice(0, 70));
    }
    if (/^[a-eç]\s*\)/.test(String(q.alt_beceri))) {
      W("alt_beceri \"a)\" etiketiyle yazılmış — etiketsiz olmalı");
    }
  }
  for (const [norm, metin] of beklenen) {
    const n = say.get(norm) || 0;
    if (n < 2) H("süreç bileşenine " + n + " soru (en az 2): " + metin.slice(0, 60));
  }
  if (konuHavuzu) {
    /* Plansız havuzda süreç listesi yok; kural aynı: her beceriye >= 2 soru. */
    if (say.size < 2) H("konu havuzunda en az 2 ayrı alt_beceri olmalı (var: " + say.size + ")");
    for (const [norm, n] of say) {
      if (n < 2) H("alt_beceriye " + n + " soru (en az 2): " + norm.slice(0, 60));
    }
  }

  const digerleri = digerHavuzlar(dosya);
  const dagilim = [0, 0, 0, 0];
  const gorulen = new Map();
  let gorselli = 0, gorselsizAtifYok = 0;

  sorular.forEach((q, i) => {
    const no = "soru " + (i + 1);
    if (!q || typeof q !== "object") { H(no + ": nesne değil"); return; }

    if (!q.soru_id) H(no + ": soru_id yok");
    else if (konuId && !String(q.soru_id).startsWith(konuId + "_")) H(no + ": soru_id " + konuId + "_… ile başlamalı");
    else if (!/^.+_o\d\d$/.test(String(q.soru_id))) W(no + ": soru_id biçimi <konu_id>_o<iki hane> değil");

    const metin = String(q.metin || "").trim();
    if (!metin) H(no + ": metin yok");
    else if (metin.length < 30) H(no + ": soru kökü 30 karakterden kısa (" + metin.length + ")");
    else if (metin.length > 600) H(no + ": soru kökü 600 karakterden uzun (" + metin.length + ")");

    const sec = Array.isArray(q.secenekler) ? q.secenekler : [];
    if (sec.length !== 4) H(no + ": 4 seçenek gerekli (" + sec.length + ")");
    const ssec = sec.map(sade);
    if (ssec.some(x => !x)) H(no + ": boş seçenek");
    if (new Set(ssec).size !== ssec.length) H(no + ": seçenekler birbirinin aynısı");
    sec.forEach((s, j) => {
      if (/^(hepsi|hiçbiri|tümü|hiç birisi)\b/i.test(String(s).trim())) {
        H(no + ": \"" + s + "\" çeldirici yasak (§7.4)");
      }
    });

    if (!Number.isInteger(q.dogru_index) || q.dogru_index < 0 || q.dogru_index > 3) {
      H(no + ": dogru_index 0-3 arası tam sayı olmalı");
    } else {
      dagilim[q.dogru_index]++;
      const d = sec[q.dogru_index];
      if (typeof d === "string" && sec.length === 4) {
        const dl = sec.map(x => String(x || "").trim().length);
        const ort = dl.reduce((a, b) => a + b, 0) / 4;
        if (dl[q.dogru_index] === Math.max(...dl) && dl[q.dogru_index] > ort * 1.7 && ort > 0) {
          W(no + ": doğru şık diğerlerinden belirgin uzun (uzunlukla ele veriyor)");
        }
      }
    }

    const cozum = String(q.cozum || "").trim();
    if (!cozum) H(no + ": cozum yok");
    else if (cozum.length < 25) H(no + ": cozum çok kısa (" + cozum.length + " < 25)");

    if (q.zorluk !== "deneme") H(no + ": zorluk \"deneme\" olmalı");
    if (q.kazanim && plan && sade(q.kazanim) !== sade(plan.kazanim)) H(no + ": soru içindeki kazanim farklı");
    if (!q.kazanim) W(no + ": soru içinde kazanim alanı yok (havuzdan devralınıyor)");

    /* ---- kart: TANIM / FORMÜL / KURAL (üretim kartı) ----
       Kural (depodaki önceki havuzlar + MANUAL_INCELEME):
         · kart Bilgi Bankası'ndaki tanım/formül/kural maddesini sorar
         · tanıma kartı (4 seçenekli "hangisi") YASAK
         · kart, soru senaryosunun kopyası/özeti olamaz
         · arka yüz en çok 2 cümle                                    */
    const KART_DESEN = /(nedir|ne demektir|tanımla|tanımı|formül|model|birim|sembol|işareti|arasındaki ilişki|nasıl hesaplanır|nasıl bulunur|nasıl tanımlanır|ne söylenir|hangi niceliği verir|biçimi nasıldır|ne olur)/i;
    const KART_YASAK = /(hangisi|aşağıdaki|aşağıdakilerden|şekilde|grafikte|tabloda)/i;
    const fc = q.flashcard;
    if (!fc || typeof fc !== "object") H(no + ": flashcard yok");
    else {
      const on = String(fc.front || "").trim();
      const ar = String(fc.back || "").trim();
      if (!on) H(no + ": flashcard.front boş");
      if (!ar) H(no + ": flashcard.back boş");
      if (sade(on) === sade(ar) && on) H(no + ": flashcard ön/arka aynı");
      if (on && KART_YASAK.test(on)) {
        H(no + ": kart tanıma/tablo sorusu gibi (\"" + on.slice(0, 40) + "\"… ) — kart tanım/formül sormalı");
      }
      if (on && !KART_DESEN.test(on)) {
        W(no + ": kart önü tanım/formül/kural kalıbında değil: " + JSON.stringify(on.slice(0, 50)));
      }
      if (metin && on) {
        const benzerlik = jaccard(ucgenler(on), ucgenler(metin));
        if (benzerlik > 0.5) H(no + ": kart önü sorunun kopyası (%" + Math.round(benzerlik * 100) + ")");
        else if (benzerlik > 0.35) W(no + ": kart önü soruya çok benziyor (%" + Math.round(benzerlik * 100) + ")");
      }
      if (ar) {
        const cumle = (ar.match(/[.!?](\s|$)/g) || []).length;
        if (cumle > 2) W(no + ": kart arka yüzü " + cumle + " cümle (en çok 2 olmalı)");
        if (ar.length > 220) W(no + ": kart arka yüzü çok uzun (" + ar.length + " kr)");
      }
      if (ar && cozum.length > 60 && jaccard(ucgenler(ar), ucgenler(cozum)) > 0.9) {
        W(no + ": flashcard.back çözümün kopyası");
      }
    }

    /* ---- soru kavrama düzeyinde mi? tanım sorusu karta taşınmalı ---- */
    if (metin && metin.length < 140 && !/\d/.test(metin) &&
        /\b(nedir|ne demektir|hangi niceliği verir|tanımlayınız)\b/i.test(metin)) {
      W(no + ": soru tanım/hatırlama düzeyinde görünüyor — kavrama senaryosuna çevrilmeli");
    }

    /* görsel */
    const dusuk = " " + metin.toLocaleLowerCase("tr") + " ";
    const atif = SEKIL_ATFI.find(k => dusuk.includes(k));
    if (q.gorsel) {
      gorselli++;
      try {
        const g = GV.dogrula(q.gorsel);
        if (g && g.length) H(no + ": görsel geçersiz (" + g.join(",") + ")");
      } catch (e) {
        H(no + ": görsel doğrulanamadı (" + e.message + ")");
      }
      if (!atif) W(no + ": görsel var ama metin şekle gönderme yapmıyor (gereksiz olabilir)");
    } else if (atif) {
      H(no + ": metin \"" + atif + "\" diyor ama gorsel yok");
    } else {
      gorselsizAtifYok++;
    }

    /* tekrar */
    if (metin) {
      const n = sade(metin);
      if (gorulen.has(n)) H(no + ": metin havuz içinde tekrar ediyor (" + gorulen.get(n) + ")");
      else gorulen.set(n, q.soru_id || no);
      const uc = ucgenler(metin);
      for (const d of digerleri) {
        if (sade(d.metin) === n) { H(no + ": metin başka havuzda birebir var (" + d.dosya + ")"); break; }
      }
      for (const d of digerleri) {
        if (jaccard(uc, d.uc) > 0.85) { W(no + ": başka havuzdaki soruya çok benziyor (" + d.dosya + ")"); break; }
      }
    }
  });

  /* dağılım */
  if (sorular.length >= 4) {
    const enB = Math.max(...dagilim);
    const yuzde = Math.round((enB / sorular.length) * 100);
    if (enB > Math.ceil(sorular.length * 0.4)) {
      H("doğru cevap dağılımı bozuk: " + dagilim.join("/") + " (en çok %" + yuzde + " > %40)");
    } else if (yuzde >= 35) {
      W("şık dağılımı sınırda: " + dagilim.join("/") + " (en çok %" + yuzde + ")");
    }
  }

  /* havuz düzeyi flashcards */
  const kartlar = Array.isArray(pool.flashcards) ? pool.flashcards : null;
  if (!kartlar) H("flashcards dizisi yok");
  else {
    if (kartlar.length !== sorular.length) {
      H("flashcards " + kartlar.length + " kart ≠ soru " + sorular.length + " (1:1 olmalı)");
    }
    kartlar.forEach((k, i) => {
      const q = sorular[i];
      if (!k || !k.front || !k.back) { H("kart " + (i + 1) + ": front/back eksik"); return; }
      if (q && q.soru_id && k.id !== q.soru_id + ":flashcard") {
        H("kart " + (i + 1) + ": id " + q.soru_id + ":flashcard olmalı (" + k.id + ")");
      }
      if (q && q.flashcard && (sade(k.front) !== sade(q.flashcard.front) || sade(k.back) !== sade(q.flashcard.back))) {
        W("kart " + (i + 1) + ": havuz dizisindeki kart soru içindeki flashcard ile aynı değil");
      }
    });
  }

  const ozet = {
    soru: sorular.length,
    hedef: plan ? plan.hedef_soru : null,
    kart: kartlar ? kartlar.length : 0,
    dagilim: dagilim.join("/"),
    gorselli,
    gorselsiz: gorselsizAtifYok,
    surec_kapsama: plan ? plan.surec.map(s => (say.get(sade(s)) || 0)).join("+") : "-"
  };
  return { dosya, hatalar, uyarilar, ozet };
}

/* ---- hedef dosyalar ---- */
let hedefler = [];
const tumu = args.includes("--tumu");
/* --konu : konu ağacı havuzları (u/k şeması) — yalnız YENİ şemalı
   olanlar, yani kazanim alanı yazılmış olanlar denetlenir. Eski
   şemalı konu havuzları (kazanim alanı yok) geçiş döneminde korunur. */
const konu = args.includes("--konu");
const dersArg = args.indexOf("--ders") >= 0 ? args[args.indexOf("--ders") + 1] : null;
if (tumu || dersArg) {
  const istenen = dersArg ? U.plan.filter(c => c.ders.toLocaleLowerCase("tr") === String(dersArg).toLocaleLowerCase("tr")) : U.plan;
  for (const c of istenen) {
    const ad = planDosyasi(c);
    if (ad) hedefler.push(path.join(HAVUZ_DIR, ad));
  }
} else if (konu) {
  for (const f of fs.readdirSync(HAVUZ_DIR)) {
    if (!/_10_u\d+_k\d+\.json$/.test(f)) continue;
    const p = path.join(HAVUZ_DIR, f);
    try {
      const pool = JSON.parse(fs.readFileSync(p, "utf8"));
      if (String(pool.kazanim || "").trim()) hedefler.push(p);
    } catch (e) { /* bozuk JSON'u resmî doğrulayıcı yakalar */ }
  }
} else {
  hedefler = args.filter(a => !a.startsWith("--")).map(a => (path.isAbsolute(a) ? a : path.join(KOK, a)));
}
if (!hedefler.length) {
  console.error("Denetlenecek dosya yok.");
  console.error("Kullanım: node docs/uretim/araclar/havuz-denetle.js <dosya.json> | --tumu | --ders <Ders> | --konu");
  process.exit(2);
}

let topHata = 0, topUyari = 0;
for (const d of hedefler) {
  const r = denetle(d);
  const ad = path.basename(d);
  console.log("\n" + (r.hatalar.length ? "✗" : "✅") + " " + ad +
    (r.ozet ? "  ·  soru " + r.ozet.soru + (r.ozet.hedef ? "/" + r.ozet.hedef : "") +
      " · kart " + r.ozet.kart + " · şık " + r.ozet.dagilim +
      " · görselli " + r.ozet.gorselli + " · süreç " + r.ozet.surec_kapsama : ""));
  r.hatalar.forEach(h => console.log("   ✗ " + h));
  r.uyarilar.forEach(u => console.log("   ! " + u));
  topHata += r.hatalar.length;
  topUyari += r.uyarilar.length;
}
console.log("\n== ÖZET ==");
console.log("dosya: " + hedefler.length + " · hata: " + topHata + " · uyarı: " + topUyari);
process.exit(topHata ? 1 : 0);
