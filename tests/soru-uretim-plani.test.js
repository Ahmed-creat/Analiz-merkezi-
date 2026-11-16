/* ============================================================
   SORU ÜRETİM PLANI TESTİ
   ------------------------------------------------------------
   Neyi doğrular?
     1) Plan 158 çıktıyı, 612 süreç bileşenini kapsıyor.
     2) Hedef soru kuralı her kayıtta doğru: max(10, 2 × süreç).
     3) konu_id'ler tekil, dosya adlarıyla tutarlı, kurala uygun.
     4) Planın her kod'u resmî MEB tablosunda var (uydurma yok).
     5) Süreç metinleri resmî veriyle birebir.
     6) Altın örnek havuz şemayı karşılıyor (10 soru, 2 süreç × 5).
   Çalıştır: node tests/soru-uretim-plani.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const PLAN = require(path.join(KOK, "docs/uretim/uretim-plani.json"));
const RESMI = require(path.join(KOK, "site/content/mufredat/meb_kazanim_10.json")).ciktilar;
const ORNEK = require(path.join(KOK, "docs/uretim/ornekler/din_10_t01_c01.json"));

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false;
}
function esit(ad, g, b) {
  return ok(ad, g === b, "gelen: " + JSON.stringify(g) + " · beklenen: " + JSON.stringify(b));
}
function sade(s) {
  return String(s == null ? "" : s).toLocaleLowerCase("tr")
    .replace(/[’‘`´]/g, "'")
    .replace(/^[a-eç]\s*\)\s*/i, "")
    .replace(/[.,;:!?"()\[\]]/g, "").replace(/\s+/g, " ").trim();
}

const P = PLAN.ciktilar;

// ---------- 1) kapsam ----------
console.log("\n== 1) Kapsam ==");
esit("plan 158 çıktı", P.length, 158);
esit("resmî veri 158 çıktı", RESMI.length, 158);
esit("özet çıktı", PLAN.ozet.cikti, 158);
esit("özet süreç 612", PLAN.ozet.surec, 612);
esit("özet hedef 1686", PLAN.ozet.hedef_soru, 1686);
esit("dokuz ders", new Set(P.map(x => x.ders)).size, 9);

const resmiKod = new Set(RESMI.map(x => x.kod));
const planKod = new Set(P.map(x => x.kod));
esit("plan ↔ resmî kod kümesi aynı", planKod.size, resmiKod.size);
const planDisi = [...planKod].filter(k => !resmiKod.has(k));
esit("planda uydurma kod yok", planDisi.join(","), "");

// ---------- 2) hedef kuralı ----------
console.log("\n== 2) Hedef soru kuralı ==");
let kuralHatasi = [];
for (const c of P) {
  const beklenen = Math.max(10, 2 * c.surec_sayisi);
  if (c.hedef_soru !== beklenen) kuralHatasi.push(c.kod + ": " + c.hedef_soru + "≠" + beklenen);
  if (c.surec.length !== c.surec_sayisi) kuralHatasi.push(c.kod + ": surec_sayisi tutmuyor");
}
esit("max(10, 2×süreç) her kayıtta doğru", kuralHatasi.join(" | "), "");
esit("hedef toplamı 1686", P.reduce((a, b) => a + b.hedef_soru, 0), 1686);

// ---------- 3) kimlik ----------
console.log("\n== 3) konu_id / dosya ==");
const idler = P.map(x => x.konu_id);
esit("konu_id tekil", new Set(idler).size, idler.length);
const bicimHatasi = P.filter(c => !/^[a-z]+_10_t\d{2}_c\d{2}$/.test(c.konu_id)).map(c => c.konu_id);
esit("konu_id biçimi <ders>_10_tNN_cNN", bicimHatasi.join(","), "");
const dosyaHatasi = P.filter(c => c.dosya !== c.konu_id + ".json").map(c => c.dosya);
esit("dosya adı konu_id ile aynı", dosyaHatasi.join(","), "");
const temaHatasi = [];
for (const c of P) {
  const m = /t(\d{2})_c(\d{2})$/.exec(c.konu_id);
  if (!m) { temaHatasi.push(c.konu_id); continue; }
  if (Number(m[1]) !== c.tema) temaHatasi.push(c.konu_id + ": tema " + m[1] + "≠" + c.tema);
  const m1 = /\.10\.(\d+)\.(\d+)$/.exec(c.kod);          // DKAB.10.1.1 → tema 1
  const m2 = /^[A-ZİÇĞÖŞÜ]+(\d+)\.(\d+)$/.exec(c.kod);     // TDE1.1 → tema 1
  const kodTema = m1 ? Number(m1[1]) : (m2 ? Number(m2[1]) : null);
  if (kodTema !== null && kodTema !== c.tema) temaHatasi.push(c.kod + ": kod teması " + kodTema + "≠" + c.tema);
}
esit("konu_id teması MEB koduyla uyumlu", temaHatasi.join(","), "");

// ---------- 4) süreç sadakati ----------
console.log("\n== 4) Süreç metinleri resmî mi ==");
const resmiMap = new Map(RESMI.map(x => [x.kod, x]));
const surecFarki = [];
for (const c of P) {
  const r = resmiMap.get(c.kod);
  if (!r) continue;
  const rs = (r.surec || []).map(s => (typeof s === "string" ? s : s.metin));
  if (rs.length !== c.surec.length) surecFarki.push(c.kod + ": sayı");
  for (let i = 0; i < rs.length; i++) {
    if (sade(rs[i]) !== sade(c.surec[i])) surecFarki.push(c.kod + " #" + (i + 1));
  }
}
esit("süreç metinleri resmî veriyle birebir", surecFarki.join(","), "");
esit("boş süreç listesi yok", P.filter(c => !c.surec.length).length, 0);

// ---------- 5) altın örnek ----------
console.log("\n== 5) Altın örnek havuz ==");
const ornekPlan = P.find(c => c.konu_id === ORNEK.konu_id);
ok("örnek planda var", !!ornekPlan);
esit("örnek kod", ORNEK.kod, "DKAB.10.1.1");
esit("örnek kazanım plandakiyle aynı", sade(ORNEK.kazanim), sade(ornekPlan.kazanim));
esit("örnek soru sayısı hedefe eşit", ORNEK.sorular.length, ornekPlan.hedef_soru);
const beceri = new Map();
const dagilim = [0, 0, 0, 0];
for (const q of ORNEK.sorular) {
  beceri.set(sade(q.alt_beceri), (beceri.get(sade(q.alt_beceri)) || 0) + 1);
  dagilim[q.dogru_index]++;
  ok(q.soru_id + " 4 seçenek", q.secenekler.length === 4);
  ok(q.soru_id + " çözüm var", !!(q.cozum && q.cozum.trim()));
  ok(q.soru_id + " zorluk deneme", q.zorluk === "deneme");
}
for (const s of ornekPlan.surec) {
  ok("süreç kapsandı: " + s.slice(0, 40), (beceri.get(sade(s)) || 0) >= 2, "soru: " + (beceri.get(sade(s)) || 0));
}
ok("cevap dağılımı dengeli", Math.max(...dagilim) <= Math.ceil(ORNEK.sorular.length * 0.4), dagilim.join("/"));
esit("flashcard sayısı soru sayısına eşit", ORNEK.flashcards.length, ORNEK.sorular.length);

// ---------- 6) durum sayıları ----------
console.log("\n== 6) Mevcut durum ==");
esit("boş çıktı 38", PLAN.ozet.durum.bos, 38);
const dinBos = P.filter(c => c.ders === "Din Kültürü" && c.mevcut.durum === "bos").length;
const tdeBos = P.filter(c => c.ders === "Türk Dili ve Edebiyatı" && c.mevcut.durum === "bos").length;
esit("Din'de 17 boş çıktı", dinBos, 17);
esit("TDE'de 16 boş çıktı", tdeBos, 16);

// ---------- özet ----------
console.log("\n" + "-".repeat(52));
if (kalan === 0) {
  console.log(`SORU ÜRETİM PLANI: ${gecen}/${gecen} geçti ✅`);
  console.log("158 çıktı · 612 süreç · 1.686 hedef soru · konu_id'ler tekil.");
  process.exit(0);
} else {
  console.log(`GEÇEN ${gecen} · KALAN ${kalan} ❌`);
  hatalar.forEach(h => console.log("  • " + h));
  process.exit(1);
}
