#!/usr/bin/env node
/* ============================================================
   HAVUZ YAZICI (docs/uretim/yazicilar/yaz.js)
   ------------------------------------------------------------
   Amaç: Bir konu havuzunun 10-24 sorusunu, plan kaydındaki
   süreç bileşenlerine bağlayarak tek çağrıda üretmek.

   Kullanım (ders içerik dosyasından):
     const { yaz } = require("./yaz.js");
     yaz("cogr_10_t03_c01", "Coğrafya 10 ders kitabı, s.49-69", [ ... ]);

   Soru nesnesi:
     { si, metin, secenekler: [4 metin], dogru: 0, cozum, gorsel?, fc: [ön, arka] }

   - si            : plan.surec dizisindeki indeks (her bileşene >= 2 soru)
   - dogru         : doğru metnin secenekler içindeki sırası (DENGE ile taşınır)
   - secenekler[0] : doğru cevap olarak yazılması önerilir; denge için otomatik taşınır
   - gorsel        : site/gorsel.js şeması (ucgen, grafik, vektor, sema, tablo, geometri, cember)
   - fc            : flashcard [ön, arka]; ön "… nedir?" kalıbında olmalı

   Üretilen dosya: site/content/soru_havuzlari/<konu_id>.json
   Şema: sorular[] + flashcards[] (1:1), alt_beceri = süreç metni (harf öneki temiz).
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.resolve(__dirname, "../../..");
const HAVUZ_DIZIN = path.join(KOK, "site/content/soru_havuzlari");
const U = require(path.join(KOK, "scripts/uretim-veri.js"));

/* Doğru cevap konumlarının dağılımı: 8'lik döngü, şıklar dengeli dağılır. */
const DENGE = [1, 3, 0, 2, 3, 1, 0, 2];

function ikiHaneli(n) {
  return String(n).padStart(2, "0");
}

function yaz(konu_id, kaynak, items) {
  const plan = U.plan.find((p) => p.konu_id === konu_id);
  if (!plan) throw new Error("planda yok: " + konu_id);
  if (!Array.isArray(items) || !items.length) throw new Error(konu_id + ": soru yok");

  const sorular = items.map((it, i) => {
    const si = Number(it.si);
    if (!Number.isInteger(si) || si < 0 || si >= plan.surec.length) {
      throw new Error(konu_id + " o" + ikiHaneli(i + 1) + ": si geçersiz (" + it.si + ")");
    }
    if (!Array.isArray(it.secenekler) || it.secenekler.length !== 4) {
      throw new Error(konu_id + " o" + ikiHaneli(i + 1) + ": 4 seçenek gerekli");
    }
    if (!Array.isArray(it.fc) || it.fc.length !== 2) {
      throw new Error(konu_id + " o" + ikiHaneli(i + 1) + ": fc [ön, arka] gerekli");
    }
    const dogruMetin = it.secenekler[it.dogru || 0];
    const digerleri = it.secenekler.filter((s, j) => j !== (it.dogru || 0));
    const yer = DENGE[i % DENGE.length];
    const secenekler = digerleri.slice();
    secenekler.splice(yer, 0, dogruMetin);

    const soru = {
      soru_id: konu_id + "_o" + ikiHaneli(i + 1),
      alt_beceri: plan.surec[si].replace(/^[a-eç]\s*\)\s*/i, "").trim(),
      metin: it.metin,
      secenekler,
      dogru_index: yer,
      cozum: it.cozum,
      zorluk: "deneme"
    };
    if (it.gorsel) soru.gorsel = it.gorsel;
    soru.flashcard = { front: it.fc[0], back: it.fc[1] };
    soru.kazanim = plan.kazanim;
    return soru;
  });

  const havuz = {
    konu_id: plan.konu_id,
    kod: plan.kod,
    sinif: plan.sinif,
    ders: plan.ders,
    tema: plan.tema,
    tema_adi: plan.tema_adi,
    kazanim: plan.kazanim,
    kaynak,
    sorular,
    flashcards: sorular.map((s) => ({
      id: s.soru_id + ":flashcard",
      front: s.flashcard.front,
      back: s.flashcard.back
    }))
  };

  fs.mkdirSync(HAVUZ_DIZIN, { recursive: true });
  fs.writeFileSync(
    path.join(HAVUZ_DIZIN, plan.konu_id + ".json"),
    JSON.stringify(havuz, null, 2) + "\n",
    "utf8"
  );

  const gorselli = sorular.filter((s) => s.gorsel).length;
  console.log(plan.konu_id + " → " + sorular.length + " soru, " + gorselli + " görselli");
  return havuz;
}

module.exports = { yaz };
