#!/usr/bin/env node
/* ============================================================
   İŞ EMRİ — konu_id → plan satırı
   ------------------------------------------------------------
   Kullanım:
     node docs/uretim/araclar/is-emri.js                    # ders ders özet + durum
     node docs/uretim/araclar/is-emri.js --ders Fizik       # bir dersin 22 iş emri
     node docs/uretim/araclar/is-emri.js --konu fiz_10_t01_c01
                                                            # dosya iskeleti + süreç listesi
     node docs/uretim/araclar/is-emri.js --kalan            # yalnız eksik havuzlar

   Kaynak: scripts/uretim-veri.js (158 resmî çıktı, 612 süreç)
   ============================================================ */
"use strict";

const path = require("path");
const fs = require("fs");

const KOK = path.join(__dirname, "..", "..", "..");
const U = require(path.join(KOK, "scripts", "uretim-veri.js"));
const HAVUZ = path.join(KOK, "site", "content", "soru_havuzlari");

const args = process.argv.slice(2);
function opt(ad) {
  const i = args.indexOf(ad);
  return i >= 0 ? args[i + 1] : null;
}
function etiketsiz(s) {
  return String(s == null ? "" : s).replace(/^[a-eç]\s*\)\s*/i, "").trim();
}

/* Havuz durumu: yok / bozuk / eksik / tamam */
function durum(kayit) {
  const p = path.join(HAVUZ, kayit.dosya);
  if (!fs.existsSync(p)) return { kod: "yok", soru: 0, kart: 0, metin: "yok" };
  let pool;
  try {
    pool = JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    return { kod: "bozuk", soru: 0, kart: 0, metin: "bozuk JSON" };
  }
  const s = Array.isArray(pool.sorular) ? pool.sorular.length : 0;
  const k = Array.isArray(pool.flashcards) ? pool.flashcards.length : 0;
  const tamam = s >= kayit.hedef_soru && k === s;
  return {
    kod: tamam ? "tamam" : "eksik",
    soru: s, kart: k,
    metin: (tamam ? "tamam " : "eksik ") + s + "/" + kayit.hedef_soru + " soru, " + k + " kart"
  };
}

function satir(c) {
  const d = durum(c);
  return [
    (d.kod === "tamam" ? "✅" : d.kod === "yok" ? "·" : d.kod === "bozuk" ? "✗" : "◐"),
    c.konu_id.padEnd(20),
    c.kod.padEnd(11),
    ("t" + String(c.tema).padStart(2, "0")).padEnd(4),
    String(c.surec_sayisi).padStart(2),
    String(c.hedef_soru).padStart(3),
    d.metin
  ].join(" ");
}

function ozet() {
  console.log("== 10. SINIF SORU HAVUZU İŞ EMRİ ==");
  console.log("çıktı: " + U.plan.length + " · süreç: " + U.ozet.surec +
    " · hedef soru: " + U.ozet.hedef_soru + " · hedef kart: " + U.ozet.flashcard);
  let tSoru = 0, tKart = 0, tamam = 0;
  for (const ders of U.DERS_SIRA) {
    const liste = U.plan.filter(c => c.ders === ders);
    const d = liste.map(durum);
    const s = d.reduce((a, b) => a + b.soru, 0);
    const k = d.reduce((a, b) => a + b.kart, 0);
    const tam = d.filter(x => x.kod === "tamam").length;
    const hedef = liste.reduce((a, b) => a + b.hedef_soru, 0);
    tSoru += s; tKart += k; tamam += tam;
    console.log("  " + ders.padEnd(24) + " havuz " + String(tam).padStart(2) + "/" +
      String(liste.length).padStart(2) + " · soru " + String(s).padStart(4) + "/" +
      String(hedef).padStart(4) + " · kart " + String(k).padStart(4));
  }
  const oran = Math.round((tSoru / U.ozet.hedef_soru) * 100);
  console.log("  " + "TOPLAM".padEnd(24) + " havuz " + tamam + "/" + U.plan.length +
    " · soru " + tSoru + "/" + U.ozet.hedef_soru + " (%" + oran + ") · kart " + tKart);
}

function dersListe(ders) {
  const liste = U.plan.filter(c => c.ders.toLocaleLowerCase("tr") === String(ders).toLocaleLowerCase("tr"));
  if (!liste.length) {
    console.error("Ders bulunamadı: " + ders);
    console.error("Dersler: " + U.DERS_SIRA.join(" · "));
    process.exit(2);
  }
  let tema = null;
  for (const c of liste) {
    if (c.tema !== tema) {
      tema = c.tema;
      console.log("\n-- Tema " + tema + ": " + (c.tema_adi || "(ad yok)") + " --");
    }
    console.log(satir(c));
  }
  const s = liste.reduce((a, b) => a + durum(b).soru, 0);
  console.log("\ntoplam yazılan soru: " + s + " / hedef " + liste.reduce((a, b) => a + b.hedef_soru, 0));
}

function kalan() {
  const eksik = U.plan.filter(c => durum(c).kod !== "tamam");
  if (!eksik.length) { console.log("Tüm havuzlar tamam 🎉"); return; }
  console.log("eksik havuz: " + eksik.length);
  let ders = null;
  for (const c of eksik) {
    if (c.ders !== ders) { ders = c.ders; console.log("\n## " + ders); }
    console.log("  " + satir(c));
  }
}

function konu(konuId) {
  const c = U.planKonu.get(konuId);
  if (!c) {
    console.error("Planda yok: " + konuId);
    process.exit(2);
  }
  console.log("dosya   : site/content/soru_havuzlari/" + c.dosya);
  console.log("kod     : " + c.kod);
  console.log("ders    : " + c.ders + " · tema " + c.tema + " (" + (c.tema_adi || "-") + ")");
  console.log("kazanım : " + c.kazanim);
  console.log("hedef   : " + c.hedef_soru + " soru · " + c.flashcard_hedef + " flashcard");
  console.log("süreç   : " + c.surec_sayisi + " bileşen (her birine EN AZ 2 soru)");
  c.surec.forEach((s, i) => console.log("  " + (i + 1) + ") " + etiketsiz(s)));
  console.log("durum   : " + durum(c).metin);

  const iskelet = {
    konu_id: c.konu_id,
    kod: c.kod,
    sinif: 10,
    ders: c.ders,
    tema: c.tema,
    tema_adi: c.tema_adi,
    kazanim: c.kazanim,
    kaynak: c.ders + " 10 ders kitabı, s.__-__",
    sorular: [],
    flashcards: []
  };
  console.log("\n-- dosya iskeleti --");
  console.log(JSON.stringify(iskelet, null, 2));
}

if (args.includes("--konu")) konu(opt("--konu"));
else if (args.includes("--ders")) dersListe(opt("--ders"));
else if (args.includes("--kalan")) kalan();
else ozet();
