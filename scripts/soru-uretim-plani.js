#!/usr/bin/env node
/* ============================================================
   SORU ÜRETİM PLANI ÜRETİCİ
   ------------------------------------------------------------
   Soru üretecek ajanın (veya insanın) tek bakışta göreceği
   iş emri dosyasını üretir:

     docs/uretim/uretim-plani.json   → 158 çıktı, her biri için
                                       hedef soru + konu_id + süreç
     docs/uretim/PLAN-TABLOSU.md     → ders bazlı özet tablo

   Kural (tek ve sabit):
     hedef soru = max(10, 2 × süreç bileşeni sayısı)
     her süreç bileşeni = bir alt_beceri, her birine ≥ 2 soru

   Kullanım: node scripts/soru-uretim-plani.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const MUFREDAT = path.join(KOK, "site/content/mufredat/meb_kazanim_10.json");
const ESLESME = path.join(KOK, "site/content/mufredat/kazanim_konu_10.json");
const HAVUZ_DIR = path.join(KOK, "site/content/soru_havuzlari");
const CIKTI_DIR = path.join(KOK, "docs/uretim");

/* Ders kısa adları — konu_id ve dosya adlarında kullanılır. */
const KISA = {
  "Biyoloji": "biyo",
  "Coğrafya": "cogr",
  "Din Kültürü": "din",
  "Felsefe": "fel",
  "Fizik": "fiz",
  "Kimya": "kim",
  "Matematik": "mat",
  "Tarih": "tar",
  "Türk Dili ve Edebiyatı": "edebiyat"
};

/* Resmî tema adları — YALNIZ doğrulanmış kaynaktan.
   Din: dkab912.pdf s.36-37 (1.3 tablosu).
   Matematik: TYMM 2026 kataloğu (theme alanı).
   TDE: program beceri eksenli; tema = beceri alanı.
   Diğer derslerde ad doğrulanmadı → null bırakılır, uydurulmaz. */
const TEMA_ADI = {
  "Din Kültürü": {
    1: "İslam’da Varlık ve Bilgi",
    2: "Allah’ı Tanımak",
    3: "İslam’ın Evrensel Mesajları",
    4: "Din, Çevre ve Teknoloji",
    5: "İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar"
  },
  "Matematik": {
    1: "Geometrik Şekiller",
    2: "İstatistiksel Araştırma Süreci",
    3: "Sayılar",
    4: "Nicelikler ve Değişimler",
    5: "Sayma, Algoritma ve Bilişim",
    6: "Analitik İnceleme",
    7: "Veriden Olasılığa"
  },
  "Türk Dili ve Edebiyatı": null   // tema = dinleme/okuma/konuşma/yazma becerisi
};

const ciktilar = require(MUFREDAT).ciktilar;
const eslesme = require(ESLESME);

// ---- havuzdaki mevcut soru sayıları ----
const havuz = {};
for (const f of fs.readdirSync(HAVUZ_DIR).filter(f => f.endsWith(".json") && f !== "index.json")) {
  const d = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, f), "utf8"));
  if (d && d.konu_id) havuz[d.konu_id] = (d.sorular || []).length;
}

// ---- kod → mevcut havuz konuları ----
const kodKonu = {};
for (const k of eslesme.konular) {
  for (const c of k.kodlar || []) (kodKonu[c] = kodKonu[c] || []).push(k.konu_id);
}

/* Kod → tema ve çıktı sırası.
   DKAB.10.1.1 → tema 1, sıra 1
   TDE1.1      → tema 1, sıra 1   (TDE kodlarında sınıf gömülü değil) */
function kodCoz(kod) {
  let m = /^([A-ZİÇĞÖŞÜ]+)\.10\.(\d+)\.(\d+)$/.exec(kod);
  if (m) return { tema: Number(m[2]), sira: Number(m[3]) };
  m = /^([A-ZİÇĞÖŞÜ]+)(\d+)\.(\d+)$/.exec(kod);
  if (m) return { tema: Number(m[2]), sira: Number(m[3]) };
  return null;
}

const plan = [];
const dersOzet = {};

for (const c of ciktilar) {
  const kisa = KISA[c.ders];
  if (!kisa) throw new Error("Ders kısa adı tanımsız: " + c.ders);
  const kc = kodCoz(c.kod);
  if (!kc) throw new Error("Kod çözülemedi: " + c.kod);

  const surec = (c.surec || []).map(s => (typeof s === "string" ? s : s.metin)).filter(Boolean);
  const surecSayisi = surec.length;
  const hedef = Math.max(10, 2 * surecSayisi);

  const konuId = `${kisa}_10_t${String(kc.tema).padStart(2, "0")}_c${String(kc.sira).padStart(2, "0")}`;
  const mevcut = kodKonu[c.kod] || [];
  let mevcutSoru = 0;
  for (const id of mevcut) mevcutSoru += havuz[id] || 0;

  const durum = mevcutSoru === 0 ? "bos" : (mevcutSoru < hedef ? "kismi" : "tam");
  const temaAdi = TEMA_ADI[c.ders] ? (TEMA_ADI[c.ders][kc.tema] || null) : null;

  plan.push({
    sira: plan.length + 1,
    ders: c.ders,
    ders_kisa: kisa,
    sinif: 10,
    tema: kc.tema,
    tema_adi: temaAdi,
    kod: c.kod,
    kazanim: c.kazanim,
    surec,
    surec_sayisi: surecSayisi,
    hedef_soru: hedef,
    konu_id: konuId,
    dosya: konuId + ".json",
    mevcut: mevcut.length
      ? { konu_id: mevcut, soru: mevcutSoru, durum, eksik: Math.max(0, hedef - mevcutSoru) }
      : { konu_id: [], soru: 0, durum: "bos", eksik: hedef }
  });

  const d = dersOzet[c.ders] = dersOzet[c.ders] || { cikti: 0, surec: 0, hedef: 0, bos: 0, kismi: 0, tam: 0 };
  d.cikti++; d.surec += surecSayisi; d.hedef += hedef; d[durum]++;
}

const toplamHedef = plan.reduce((a, b) => a + b.hedef_soru, 0);
const toplamSurec = plan.reduce((a, b) => a + b.surec_sayisi, 0);

// ---- JSON ----
if (!fs.existsSync(CIKTI_DIR)) fs.mkdirSync(CIKTI_DIR, { recursive: true });

const govde = {
  surum: "2026-10-28",
  aciklama:
    "10. sınıf soru üretim iş emri. Her kayıt bir MEB öğrenme çıktısına karşılık gelir; " +
    "bir soru havuzu dosyası üretilecektir. Kaynak: meb_kazanim_10.json (resmî TYMM 2026).",
  kural: {
    hedef_soru: "max(10, 2 × süreç bileşeni sayısı)",
    alt_beceri: "Her süreç bileşeni ayrı bir alt_beceri değeridir; her birine en az 2 soru.",
    zorluk: "Tüm sorularda zorluk = \"deneme\"",
    konu_id: "<ders_kisa>_10_t<tema>_c<sira> — MEB koduyla birebir, tahmin yok",
    dosya: "<konu_id>.json"
  },
  ozet: {
    cikti: plan.length,
    surec: toplamSurec,
    hedef_soru: toplamHedef,
    ders: Object.keys(dersOzet).length,
    durum: {
      bos: plan.filter(p => p.mevcut.durum === "bos").length,
      kismi: plan.filter(p => p.mevcut.durum === "kismi").length,
      tam: plan.filter(p => p.mevcut.durum === "tam").length
    },
    eksik_soru: plan.reduce((a, b) => a + b.mevcut.eksik, 0)
  },
  ders_ozet: dersOzet,
  ciktilar: plan
};

fs.writeFileSync(path.join(CIKTI_DIR, "uretim-plani.json"), JSON.stringify(govde, null, 1) + "\n", "utf8");

// ---- Markdown tablo ----
const L = [];
const p = s => L.push(s);
p("# 10. Sınıf Soru Üretim Planı");
p("");
p("> `node scripts/soru-uretim-plani.js` üretir · elle düzenlenmez.");
p("> Makine tarafı: `docs/uretim/uretim-plani.json` · Talimat: `docs/uretim/SORU-URETIM-TALIMATI.md`");
p("");
p("## Kural");
p("");
p("```");
p("hedef soru = max(10, 2 × süreç bileşeni sayısı)");
p("her süreç bileşeni = bir alt_beceri → her birine en az 2 soru");
p("```");
p("");
p("Bu kural 158 çıktının tamamına uygulanır: " + plan.length + " çıktı · " + toplamSurec +
  " süreç bileşeni → **" + toplamHedef + " soru**.");
p("");
p("## Ders bazlı hedefler");
p("");
p("| Ders | Çıktı | Süreç | Hedef soru | Havuzu boş | Kısmi | Tam |");
p("| --- | --- | --- | --- | --- | --- | --- |");
for (const [ders, d] of Object.entries(dersOzet)) {
  p(`| ${ders} | ${d.cikti} | ${d.surec} | **${d.hedef}** | ${d.bos} | ${d.kismi} | ${d.tam} |`);
}
p(`| **Toplam** | **${plan.length}** | **${toplamSurec}** | **${toplamHedef}** | ` +
  `**${govde.ozet.durum.bos}** | **${govde.ozet.durum.kismi}** | **${govde.ozet.durum.tam}** |`);
p("");
p("## Mevcut durum");
p("");
const mevcutToplam = plan.reduce((a, b) => a + b.mevcut.soru, 0);
p(`Havuzda bugün bu çıktılara bağlı **${mevcutToplam} soru** var. Hedefe ulaşmak için gereken`);
p(`**en az ${govde.ozet.eksik_soru} soru** (havuzu boş ${govde.ozet.durum.bos} çıktı dahil).`);
p("");
p("Havuzu tamamen boş olan çıktılar:");
p("");
for (const ders of Object.keys(dersOzet)) {
  const bos = plan.filter(p => p.ders === ders && p.mevcut.durum === "bos");
  if (!bos.length) continue;
  p(`- **${ders}** (${bos.length}): \`${bos.map(x => x.kod).join("`, `")}\``);
}
p("");
p("## Çıktı listesi (158)");
p("");
p("| # | Kod | Ders | Tema | Hedef | Konu id |");
p("| --- | --- | --- | --- | --- | --- |");
for (const c of plan) {
  p(`| ${c.sira} | \`${c.kod}\` | ${c.ders} | ${c.tema}${c.tema_adi ? " · " + c.tema_adi : ""} | ${c.hedef_soru} | \`${c.konu_id}\` |`);
}
p("");
p("## Tema adı notu");
p("");
p("Tema adı yalnız doğrulanmış kaynaktan yazılır. Din için `dkab912.pdf` s.36-37 (1.3 tablosu),");
p("Matematik için TYMM 2026 kataloğu kullanıldı. Diğer derslerde tema adı **boş bırakıldı**");
p("(uydurulmadı); soru üretimi için tema numarası ve MEB kodu yeterlidir.");

fs.writeFileSync(path.join(CIKTI_DIR, "PLAN-TABLOSU.md"), L.join("\n") + "\n", "utf8");

console.log("yazıldı: docs/uretim/uretim-plani.json (" + plan.length + " çıktı)");
console.log("yazıldı: docs/uretim/PLAN-TABLOSU.md (" + L.length + " satır)");
console.log("hedef soru: " + toplamHedef + " · süreç: " + toplamSurec + " · eksik: " + govde.ozet.eksik_soru);
for (const [ders, d] of Object.entries(dersOzet)) {
  console.log("  " + ders.padEnd(24) + " çıktı " + String(d.cikti).padStart(2) +
    " · süreç " + String(d.surec).padStart(3) + " · hedef " + String(d.hedef).padStart(4) +
    " · boş " + d.bos);
}
