#!/usr/bin/env node
/* ============================================================
   HAVUZA SORU EKLE (plan hedefi tamamlama aracı)
   ------------------------------------------------------------
   Var olan bir konu havuzuna (U şeması) soru + kart ekler.
   Hedef soru sayısı plan kaydından gelir (DURUM.md "eksik" satırları).

   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js <spec.js> [--kuru]

   Spec biçimi (docs/uretim/uretim/*.js içinde bir veri dosyası):
     module.exports = [
       { konu_id: "mat_10_u04_k02", kaynak: "Matematik 10 ders kitabı, s.197-223",
         items: [ { bi: 0|1, metin, secenekler: [dogru, d1, d2, d3], cozum,
                    fc: [on, arka] } ] }
     ]

   Kurallar:
     • secenekler[0] DOĞRU cevaptır; denge için otomatik taşınır (DENGE).
     • bi, havuzdaki mevcut alt_beceri sırasına göredir (0,1,...).
     • soru_id ve kart id'si havuzun son numarasından devam eder.
     • Yazım hem site/ hem pwa-files/ kopyasına yapılır.
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.resolve(__dirname, "../../..");
const SITE = path.join(KOK, "site/content/soru_havuzlari");
const PWA = path.join(KOK, "pwa-files/content/soru_havuzlari");
const DENGE = [1, 3, 0, 2, 3, 1, 0, 2];
const kuru = process.argv.includes("--kuru");
const specYolu = process.argv[2];

if (!specYolu || specYolu.startsWith("--")) {
  console.error("Kullanım: node docs/uretim/araclar/havuz-ekle.js <spec.js> [--kuru]");
  process.exit(2);
}

const spec = require(path.resolve(specYolu));
let toplamEklenen = 0;

for (const hedef of spec) {
  const p = path.join(SITE, hedef.konu_id + ".json");
  if (!fs.existsSync(p)) throw new Error("havuz yok: " + hedef.konu_id);
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  const sorular = Array.isArray(j.sorular) ? j.sorular : [];
  if (!Array.isArray(j.flashcards)) j.flashcards = [];

  /* mevcut alt_becerileri sırayla topla */
  const beceriler = [];
  for (const q of sorular) if (q.alt_beceri && !beceriler.includes(q.alt_beceri)) beceriler.push(q.alt_beceri);
  if (!beceriler.length) throw new Error(hedef.konu_id + ": alt_beceri yok");
  const kazanim = (sorular[sorular.length - 1] || {}).kazanim || j.kazanim || "";

  let n = sorular.length;
  for (const it of hedef.items || []) {
    if (!Array.isArray(it.secenekler) || it.secenekler.length !== 4) {
      throw new Error(hedef.konu_id + " o" + (n + 1) + ": 4 seçenek gerekli");
    }
    if (!Array.isArray(it.fc) || it.fc.length !== 2) {
      throw new Error(hedef.konu_id + " o" + (n + 1) + ": fc [ön, arka] gerekli");
    }
    const bi = Number(it.bi || 0);
    if (!Number.isInteger(bi) || bi < 0 || bi >= beceriler.length) {
      throw new Error(hedef.konu_id + " o" + (n + 1) + ": bi geçersiz (" + it.bi + ")");
    }
    const dogruMetin = it.secenekler[0];
    const yer = DENGE[n % DENGE.length];
    const secenekler = it.secenekler.slice(1);
    secenekler.splice(yer, 0, dogruMetin);
    const soruId = hedef.konu_id + "_o" + String(n + 1).padStart(2, "0");

    sorular.push({
      soru_id: soruId,
      alt_beceri: beceriler[bi],
      metin: it.metin,
      secenekler,
      dogru_index: yer,
      cozum: it.cozum,
      zorluk: it.zorluk || "deneme",
      flashcard: { front: it.fc[0], back: it.fc[1] },
      kazanim
    });
    j.flashcards.push({ id: soruId + ":flashcard", front: it.fc[0], back: it.fc[1] });
    n++;
  }

  /* yalnız kart ÖNÜ değişimi: onlar: [{ soru_id, on }] — arka yüz korunur */
  let onDuzelti = 0;
  for (const o of hedef.onlar || []) {
    const q = sorular.find(s => s.soru_id === o.soru_id);
    if (!q) throw new Error(hedef.konu_id + ": soru yok → " + o.soru_id);
    if (!o.on || !String(o.on).trim()) throw new Error(o.soru_id + ": on boş");
    q.flashcard.front = o.on;
    const c = j.flashcards.find(f => f.id === o.soru_id + ":flashcard");
    if (c) c.front = o.on;
    onDuzelti++;
  }

  /* mevcut soruları düzeltme: duzeltmeler: [{ soru_id, metin?, cozum?, secenekler?, dogru_index?, fc? }] */
  let soruDuzelti = 0;
  for (const d of hedef.duzeltmeler || []) {
    const q = sorular.find(s => s.soru_id === d.soru_id);
    if (!q) throw new Error(hedef.konu_id + ": soru yok → " + d.soru_id);
    if (d.metin) q.metin = d.metin;
    if (d.cozum) q.cozum = d.cozum;
    if (d.secenekler) {
      if (d.secenekler.length !== 4 || !Number.isInteger(d.dogru_index)) {
        throw new Error(d.soru_id + ": seçenekler için 4 metin + dogru_index gerekli");
      }
      q.secenekler = d.secenekler;
      q.dogru_index = d.dogru_index;
    }
    if (d.fc) {
      if (d.fc.length !== 2) throw new Error(d.soru_id + ": fc [ön, arka] gerekli");
      q.flashcard = { front: d.fc[0], back: d.fc[1] };
      const c = j.flashcards.find(f => f.id === d.soru_id + ":flashcard");
      if (c) { c.front = d.fc[0]; c.back = d.fc[1]; }
      else j.flashcards.push({ id: d.soru_id + ":flashcard", front: d.fc[0], back: d.fc[1] });
    }
    soruDuzelti++;
  }

  /* mevcut kartları düzeltme: kartlar: [{ soru_id, fc: [ön, arka] }] */
  let kartDuzelti = 0;
  for (const k of hedef.kartlar || []) {
    const q = sorular.find(s => s.soru_id === k.soru_id);
    if (!q) throw new Error(hedef.konu_id + ": soru yok → " + k.soru_id);
    if (!Array.isArray(k.fc) || k.fc.length !== 2) throw new Error(k.soru_id + ": fc [ön, arka] gerekli");
    q.flashcard = { front: k.fc[0], back: k.fc[1] };
    const c = j.flashcards.find(f => f.id === k.soru_id + ":flashcard");
    if (c) { c.front = k.fc[0]; c.back = k.fc[1]; }
    else j.flashcards.push({ id: k.soru_id + ":flashcard", front: k.fc[0], back: k.fc[1] });
    kartDuzelti++;
  }

  j.sorular = sorular;
  if (hedef.kaynak && !j.kaynak) j.kaynak = hedef.kaynak;
  if (!kuru) {
    fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n", "utf8");
    const pwaP = path.join(PWA, hedef.konu_id + ".json");
    if (fs.existsSync(pwaP)) fs.writeFileSync(pwaP, JSON.stringify(j, null, 2) + "\n", "utf8");
  }
  const say = {};
  sorular.forEach(q => { say[q.alt_beceri] = (say[q.alt_beceri] || 0) + 1; });
  const dagilim = Object.values(say).join("/");
  console.log(hedef.konu_id, "→", sorular.length, "soru ·", j.flashcards.length, "kart · beceri", dagilim,
    soruDuzelti ? "· soru düzelti " + soruDuzelti : "",
    onDuzelti ? "· kart önü " + onDuzelti : "",
    kartDuzelti ? "· kart düzelti " + kartDuzelti : "");
  toplamEklenen += (hedef.items || []).length;
}

console.log("eklenen soru:", toplamEklenen, kuru ? "(kuru)" : "");
