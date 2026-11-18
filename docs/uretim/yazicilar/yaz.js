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

/* ============================================================
   konuBasligiYaz — plan havuzuna Bilgi Bankası konu başlığı ekler.
   ------------------------------------------------------------
   Plan şemalı havuzun topic_key'i normalde kazanım metninden türer:
     "Din Kültürü > 1.3 İsra suresinin 36 ve Mülk suresinin 23. ..."
   Uygulama ise havuzu KONU BAŞLIĞIYLA arar. Kazanım metni ile konu
   başlığı ayrı düştüğünde (ör. "1.3 Kur'an'dan Mesajlar") öğrenci
   o konuda havuz bulamaz. Bu yardımcı, havuzun dosyasına konu
   başlığını yazar; manifest üreticisi bu alanı esas alır.

   Kullanım (üretici dosyanın sonunda):
     konuBasligiYaz("din_10_t01_c03", "Din Kültürü > 1.3 Kur'an'dan Mesajlar (İsrâ 36, Mülk 23)");
   ============================================================ */
function konuBasligiYaz(konu_id, topic_key) {
  const yol = path.join(HAVUZ_DIZIN, konu_id + ".json");
  if (!fs.existsSync(yol)) throw new Error("konuBasligiYaz: havuz yok: " + konu_id);
  const havuz = JSON.parse(fs.readFileSync(yol, "utf8"));
  havuz.topic_key = String(topic_key);
  fs.writeFileSync(yol, JSON.stringify(havuz, null, 2) + "\n", "utf8");
  console.log(konu_id + " → konu başlığı: " + topic_key);
}

/* ============================================================
   yazKonu — PLAN DIŞI (konu ağacı) havuzu yazar.
   ------------------------------------------------------------
   Neden? Uygulamanın Bilgi Bankası müfredat ağacının konuları
   (ör. "Türk Dili ve Edebiyatı > Koşuk") MEB çıktı koduna birebir
   oturmuyor; 158 çıktılık planda karşılığı yok. Ama öğrenci o
   konudan Kısa Kontrol açabilmeli. Bu yüzden havuz konu_id'si
   <ders>_10_uNN_kNN kalır, içerik konuya göre üretilir.

   Fark: alt_beceri = plan.surec değil, konuya özel beceri listesi
   (beceriler[]); her beceriye >= 2 soru şartı korunur.

   Kullanım:
     const { yazKonu } = require("../yazicilar/yaz.js");
     yazKonu({ konu_id, ders, tema, tema_adi, baslik, kaynak,
               kaynak_dosya, beceriler: [...], items: [...] });
   ============================================================ */
function yazKonu(o) {
  const konu_id = String(o.konu_id || "").trim();
  if (!konu_id) throw new Error("yazKonu: konu_id yok");
  const beceriler = Array.isArray(o.beceriler) ? o.beceriler : [];
  if (beceriler.length < 2) throw new Error(konu_id + ": en az 2 beceri gerekli");
  const items = Array.isArray(o.items) ? o.items : [];
  if (items.length < 10) throw new Error(konu_id + ": en az 10 soru gerekli (var: " + items.length + ")");

  const sayim = new Map();
  const sorular = items.map((it, i) => {
    const no = konu_id + "_o" + ikiHaneli(i + 1);
    const bi = Number(it.bi);
    if (!Number.isInteger(bi) || bi < 0 || bi >= beceriler.length) throw new Error(no + ": bi geçersiz (" + it.bi + ")");
    if (!Array.isArray(it.secenekler) || it.secenekler.length !== 4) throw new Error(no + ": 4 seçenek gerekli");
    if (!Array.isArray(it.fc) || it.fc.length !== 2) throw new Error(no + ": fc [ön, arka] gerekli");
    sayim.set(bi, (sayim.get(bi) || 0) + 1);

    const dogruMetin = it.secenekler[it.dogru || 0];
    const digerleri = it.secenekler.filter((s, j) => j !== (it.dogru || 0));
    const yer = DENGE[i % DENGE.length];
    const secenekler = digerleri.slice();
    secenekler.splice(yer, 0, dogruMetin);

    const soru = {
      soru_id: no,
      alt_beceri: beceriler[bi],
      metin: it.metin,
      secenekler,
      dogru_index: yer,
      cozum: it.cozum,
      zorluk: "deneme"
    };
    if (it.gorsel) soru.gorsel = it.gorsel;
    soru.flashcard = { front: it.fc[0], back: it.fc[1] };
    if (o.kazanim) soru.kazanim = o.kazanim;
    return soru;
  });

  for (let bi = 0; bi < beceriler.length; bi++) {
    const n = sayim.get(bi) || 0;
    if (n < 2) throw new Error(konu_id + ": \"" + beceriler[bi] + "\" için " + n + " soru (en az 2)");
  }

  const havuz = {
    konu_id,
    sinif: Number(o.sinif) || 10,
    ders: o.ders || "Türk Dili ve Edebiyatı",
    tema: o.tema == null ? 0 : Number(o.tema),
    tema_adi: o.tema_adi || "",
    baslik: o.baslik || "",
    topic_key: (o.ders || "Türk Dili ve Edebiyatı") + " > " + (o.baslik || ""),
    kazanim: o.kazanim || "",
    kaynak: o.kaynak || "",
    kaynak_dosya: o.kaynak_dosya || "",
    sorular,
    flashcards: sorular.map((s) => ({
      id: s.soru_id + ":flashcard",
      front: s.flashcard.front,
      back: s.flashcard.back
    }))
  };

  fs.mkdirSync(HAVUZ_DIZIN, { recursive: true });
  fs.writeFileSync(path.join(HAVUZ_DIZIN, konu_id + ".json"), JSON.stringify(havuz, null, 2) + "\n", "utf8");
  console.log(konu_id + " → " + sorular.length + " soru, " + beceriler.length + " beceri");
  return havuz;
}

module.exports = { yaz, yazKonu, konuBasligiYaz };
