#!/usr/bin/env node
/* ============================================================
   KAYIT DEFTERİ EŞİTLE — canlı havuzlar ↔ konu_kayit_defteri
   ------------------------------------------------------------
   SORUN (2026-11-16, `npm run validate:ids` çıkış 1):
     · 34 canlı havuzun `konu_id`'si defterde yok   → "havuz konu_id defterde yok"
     · 77 çakışma kaydı: aynı konu_id, iki farklı başlık
       (tur-2'de havuz başlığı yenilendi, defter eski başlığı tuttu)
   NEDEN:
     Defteri yalnız ders tur-2 betikleri (tek tek ders) ve `durum.js`
     türevleri yazıyor. `docs/uretim/uretim/din-t0*.js` ve
     `felsefe-t0*.js` havuz üretiyor ama deftere kayıt YAZMIYOR;
     `cografya/…-tur2-guncelle.js` gibi betikler de yalnız kendi
     dersinin satırlarını yeniliyor. Havuz başlığı değişince eski
     kayıt "çakışma" olarak `conflicts`'e düşüyor, hiçbir tur sonunda
     uzlaştırılmıyor.

   ÇÖZÜM (tek kaynak: havuz dosyası):
     1) Canlı her havuz için kayıt garanti edilir (yoksa eklenir).
     2) Var olan kaydın `konu_adi`'ı havuz başlığıyla eşitlenir
        (başlık yoksa `tema_adi`, o da yoksa `kazanim`).
     3) Uzlaşan `conflicts` kayıtları silinir; canlı havuzu olmayan
        çakışma kalırsa rapor edilir (owner kararı).

   İdempotent: ikinci çalıştırmada +0 kayıt, 0 çakışma.

   Kullanım:
     node docs/uretim/araclar/kayit-defteri-esitle.js [--kontrol]
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const KONTROL = process.argv.includes("--kontrol");
const HAVUZ = path.join(KOK, "site", "content", "soru_havuzlari");
const DEFTERLER = [
  path.join(KOK, "content", "mufredat", "konu_kayit_defteri.json"),
  path.join(KOK, "site", "content", "mufredat", "konu_kayit_defteri.json")
];

let hata = 0;
const bildir = m => console.log(m);

/* Başlıktaki "1.2.3 " numarasını at (diğer üretim betikleriyle aynı kural). */
const numarasiz = t => String(t || "").replace(/^\d+(\.\d+)*\.?\s*/, "").trim();

/* ---- 1) Canlı havuz kataloğu ---- */
const havuzlar = new Map();
for (const f of fs.readdirSync(HAVUZ).sort()) {
  if (!f.endsWith(".json") || f === "index.json") continue;
  let p;
  try { p = JSON.parse(fs.readFileSync(path.join(HAVUZ, f), "utf8")); }
  catch (e) { bildir("✗ okunamadı: " + f + " (" + e.message + ")"); hata++; continue; }
  const id = String(p.konu_id || f.replace(/\.json$/, ""));
  const ad = numarasiz(p.baslik) || String(p.tema_adi || "").trim() ||
    String(p.kazanim || "").trim() || id;
  havuzlar.set(id, { konu_id: id, konu_adi: ad, ders: p.ders, sinif: Number(p.sinif) || 10 });
}
bildir("canlı havuz: " + havuzlar.size);

/* ---- 2) Defterleri eşitle ---- */
for (const dosya of DEFTERLER) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const d = JSON.parse(fs.readFileSync(dosya, "utf8"));
  const kayitlar = Array.isArray(d.records) ? d.records : [];
  const gorulen = new Set(kayitlar.map(r => String(r.konu_id)));

  let adGuncel = 0, dersGuncel = 0;
  for (const r of kayitlar) {
    const h = havuzlar.get(String(r.konu_id));
    if (!h) continue;
    if (r.konu_adi !== h.konu_adi) { r.konu_adi = h.konu_adi; adGuncel++; }
    /* 10. sınıf havuz kaydının dersi havuzun dersiyle aynı olmalı (9. sınıf ezilmez). */
    if (Number(r.sinif) === 10 && h.ders && r.ders !== h.ders) { r.ders = h.ders; dersGuncel++; }
  }

  /* Eksik havuz kayıtlarını aynı dersin son kaydından sonra ekle. */
  const eksikler = [...havuzlar.values()].filter(h => !gorulen.has(h.konu_id));
  for (const h of eksikler) {
    const yeni = { konu_id: h.konu_id, konu_adi: h.konu_adi, sinif: h.sinif || 10, ders: h.ders || "" };
    let yer = -1;
    for (let i = kayitlar.length - 1; i >= 0; i--) {
      if (kayitlar[i].ders === yeni.ders) { yer = i + 1; break; }
    }
    if (yer < 0) kayitlar.push(yeni); else kayitlar.splice(yer, 0, yeni);
  }
  d.records = kayitlar;

  /* Uzlaşan çakışmaları sil. */
  const oncekiCakisma = Array.isArray(d.conflicts) ? d.conflicts.length : 0;
  if (Array.isArray(d.conflicts)) {
    d.conflicts = d.conflicts.filter(c => {
      const h = havuzlar.get(String(c.konu_id));
      /* Canlı havuzu olan çakışma başlık eşitlemesiyle çözüldü → düş. */
      if (h) return false;
      return true;
    });
  }
  const kalanCakisma = Array.isArray(d.conflicts) ? d.conflicts.length : 0;

  if (!KONTROL) fs.writeFileSync(dosya, JSON.stringify(d, null, 2) + "\n", "utf8");
  bildir("✔ " + path.relative(KOK, dosya) + ": " + kayitlar.length + " kayıt (+" + eksikler.length +
    " yeni, başlık " + adGuncel + ", ders " + dersGuncel + ") · çakışma " + oncekiCakisma + " → " + kalanCakisma);
  if (kalanCakisma) {
    bildir("  ! canlı havuzu olmayan çakışma kaydı kaldı: " + kalanCakisma + " (owner kararı)");
  }
}

bildir(hata ? "SONUÇ: " + hata + " hata" : "SONUÇ: tamam");
process.exitCode = hata ? 1 : 0;
