#!/usr/bin/env node
/* ============================================================
   DURUM PANOSU — docs/uretim/DURUM.md üretir
   ------------------------------------------------------------
   Kullanım:
     node docs/uretim/araclar/durum.js          # panoyu yaz
     node docs/uretim/araclar/durum.js --konsol # yazmadan göster
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const U = require(path.join(KOK, "scripts", "uretim-veri.js"));
const HAVUZ = path.join(KOK, "site", "content", "soru_havuzlari");
const HEDEF = path.join(KOK, "docs", "uretim", "DURUM.md");
const konsol = process.argv.includes("--konsol");

function havuz(kayit) {
  const p = path.join(HAVUZ, kayit.dosya);
  if (!fs.existsSync(p)) return { durum: "yok", soru: 0, kart: 0, gorselli: 0 };
  try {
    const pool = JSON.parse(fs.readFileSync(p, "utf8"));
    const s = Array.isArray(pool.sorular) ? pool.sorular : [];
    const k = Array.isArray(pool.flashcards) ? pool.flashcards : [];
    const tamam = s.length >= kayit.hedef_soru && k.length === s.length;
    return {
      durum: tamam ? "tamam" : "eksik",
      soru: s.length, kart: k.length,
      gorselli: s.filter(q => q && q.gorsel).length
    };
  } catch (e) {
    return { durum: "bozuk", soru: 0, kart: 0, gorselli: 0 };
  }
}

const satirlar = [];
satirlar.push("# Üretim Durumu (otomatik)");
satirlar.push("");
satirlar.push("> Bu dosya `node docs/uretim/araclar/durum.js` ile üretilir — **elle düzenlenmez**.");
satirlar.push("> Güncelleme: " + new Date().toISOString().slice(0, 16).replace("T", " ") + " (UTC)");
satirlar.push("");
satirlar.push("## Ders bazında");
satirlar.push("");
satirlar.push("| Ders | Havuz (tamam/toplam) | Soru | Hedef | Kart | Görselli soru |");
satirlar.push("| --- | --- | --- | --- | --- | --- |");

let T = { tamam: 0, havuz: 0, soru: 0, hedef: 0, kart: 0, gorselli: 0 };
const eksikler = [];
for (const ders of U.DERS_SIRA) {
  const liste = U.plan.filter(c => c.ders === ders);
  const d = liste.map(havuz);
  const tam = d.filter(x => x.durum === "tamam").length;
  const soru = d.reduce((a, b) => a + b.soru, 0);
  const kart = d.reduce((a, b) => a + b.kart, 0);
  const hedef = liste.reduce((a, b) => a + b.hedef_soru, 0);
  const gorsel = d.reduce((a, b) => a + b.gorselli, 0);
  satirlar.push("| " + ders + " | " + tam + "/" + liste.length + " | " + soru + " | " + hedef +
    " | " + kart + " | " + gorsel + " |");
  T.tamam += tam; T.havuz += liste.length; T.soru += soru; T.hedef += hedef;
  T.kart += kart; T.gorselli += gorsel;
  liste.forEach((c, i) => {
    if (d[i].durum !== "tamam") eksikler.push({ ders, c, d: d[i] });
  });
}
satirlar.push("| **TOPLAM** | **" + T.tamam + "/" + T.havuz + "** | **" + T.soru + "** | **" +
  T.hedef + "** | **" + T.kart + "** | **" + T.gorselli + "** |");
satirlar.push("");
satirlar.push("İlerleme: **%" + Math.round((T.soru / T.hedef) * 100) + "** (" +
  T.soru + "/" + T.hedef + " soru) · kart 1:1 " + (T.kart === T.soru ? "✔" : "✗ " + T.kart + "/" + T.soru));
satirlar.push("");

satirlar.push("## Eksik havuzlar");
satirlar.push("");
if (!eksikler.length) satirlar.push("Yok — 158/158 tamam 🎉");
else {
  let ders = null;
  for (const e of eksikler) {
    if (e.ders !== ders) {
      ders = e.ders;
      satirlar.push("");
      satirlar.push("### " + ders);
      satirlar.push("");
      satirlar.push("| konu_id | kod | hedef soru | durum |");
      satirlar.push("| --- | --- | --- | --- |");
    }
    satirlar.push("| `" + e.c.konu_id + "` | " + e.c.kod + " | " + e.c.hedef_soru + " | " +
      (e.d.durum === "yok" ? "yok" : e.d.durum + " (" + e.d.soru + " soru, " + e.d.kart + " kart)") + " |");
  }
}
satirlar.push("");
satirlar.push("## Kapı komutları");
satirlar.push("");
satirlar.push("```bash");
satirlar.push("node docs/uretim/araclar/havuz-denetle.js --tumu      # hızlı kapı");
satirlar.push("node scripts/soru-uret-dogrula.js site/content/soru_havuzlari");
satirlar.push("node scripts/havuz-index-uret.js --plan --kontrol");
satirlar.push("npm run -s validate:pools && npm run -s test:hepsi");
satirlar.push("```");

const metin = satirlar.join("\n") + "\n";
if (konsol) console.log(metin);
else {
  fs.writeFileSync(HEDEF, metin, "utf8");
  console.log("yazıldı: " + path.relative(KOK, HEDEF));
  console.log("havuz " + T.tamam + "/" + T.havuz + " · soru " + T.soru + "/" + T.hedef +
    " · kart " + T.kart + " · görselli " + T.gorselli);
}
