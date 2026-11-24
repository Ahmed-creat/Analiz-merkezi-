#!/usr/bin/env node
/* ============================================================
   TDE ↔ OKULİZYON KÖPRÜSÜ
   ------------------------------------------------------------
   Sorun: TYMM Türk Dili ve Edebiyatı çıktıları BECERİ adı verir
     TDE2.2 — "Anlam Oluşturabilme"      (tema yok, içerik yok)
   Okulizyon ise KONU kazanımı verir
     "Şiirde ahengi sağlayan özellikleri … ile ilgili çalışma yapar."

   Çözüm: içerik, TYMM tema sayfasının DÜZ METNİNDE ve Anahtar
   Kavramlar listesinde duruyor (koşuk, koşma, türkü, ninni, masal …).
   Bu betik o içeriği Okulizyon kazanımlarıyla eşler ve HER EŞLEŞMEYİ
   KANITLA birlikte yazar. Eşleşmeyen kazanım "kanıt yok" olarak kalır —
   uydurulmaz.

   Kullanım:
     node scripts/tde-kopru.js            # tablo
     node scripts/tde-kopru.js --json     # makine okunur
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const ICERIK = JSON.parse(fs.readFileSync(path.join(KOK, "site/content/mufredat/tde_icerik_10.json"), "utf8"));
const OKZ = JSON.parse(fs.readFileSync(path.join(KOK, "site/content/mufredat/okulizyon_kazanim_10.json"), "utf8"));
const MEB = JSON.parse(fs.readFileSync(path.join(KOK, "site/content/mufredat/meb_kazanim_10.json"), "utf8"));

const NORM = (s) => String(s).toLocaleLowerCase("tr");
/* Türkçe gövde eşlemesi: "ahengi" ~ "ahenk" → ilk 5 karakter */
const GOVDE = 5;
const govde = (s) => NORM(s).replace(/[^\p{L}\p{N} ]/gu, " ").split(/\s+/).filter((x) => x.length >= 4).map((x) => x.slice(0, GOVDE));

/* Tema içindeki TÜM metin türleri */
function turler(tema) {
  return [...tema.okuma.ana, ...tema.okuma.ara, ...tema.dinleme.tur];
}

/* Bir kazanım hangi temaya bağlanıyor?
   KURAL: EN UZUN ÇEKİRDEK KAZANIR.
   "Destan Dönemi Türk şiiri" hem "destan"(6, tema 3) hem "destan dönemi"(13, tema 1)
   içerir. En uzun çekirdek tema 1'dir — koşuk destan döneminin nazım birimidir.
   Eşit uzunlukta iki farklı tema kalırsa BELİRSİZ diye işaretlenir, seçim yapılmaz. */
function temaBul(kazanim) {
  const k = NORM(kazanim);
  const aday = [];
  for (const tema of ICERIK.temalar) {
    for (const c of (tema.cekirdek || [])) {
      const cl = NORM(c);
      if (k.includes(cl)) aday.push({ tema: tema.no, ad: tema.ad, cekirdek: c, uzunluk: cl.length });
    }
  }
  if (!aday.length) return { temalar: [], belirsiz: false };
  aday.sort((a, b) => b.uzunluk - a.uzunluk);
  const en = aday[0];
  const ayni = aday.filter((x) => x.uzunluk === en.uzunluk && x.tema !== en.tema);
  if (ayni.length) {
    return { temalar: [], belirsiz: true, adaylar: [en, ...ayni] };
  }
  /* kazanan temanın TÜM eşleşen çekirdeklerini kanıt olarak döndür */
  const ayniTema = aday.filter((x) => x.tema === en.tema);
  return { temalar: [{ tema: en.tema, ad: en.ad, cekirdek: ayniTema.map((x) => x.cekirdek) }], belirsiz: false };
}

/* Metin türü geçmiyorsa: HANGİ BECERİ çıktısına bağlanıyor?
   Kanıt = kazanım metnindeki fiil + TYMM anahtar kavramı */
function beceriBul(kazanim) {
  const k = NORM(kazanim);
  const kural = [
    { anahtar: ["ahenk", "uyak", "redif", "aliterasyon", "asonans", "ölçü", "ritim"], cikti: ["TDE2.2", "TDE2.3"], kanit: "TYMM 10/2 Anahtar Kavramlar: ahenk unsurları, aruz, kafiye, ölçü, ritim" },
    { anahtar: ["söz varlığı", "anlam", "bağlam"], cikti: ["TDE2.2"], kanit: "TDE2.2 — Anlam Oluşturabilme" },
    { anahtar: ["çıkarım", "sonuç"], cikti: ["TDE2.3"], kanit: "TDE2.3 — Çözümleyebilme" },
    { anahtar: ["tanımla", "kavra", "belirle", "açıkla", "özellik"], cikti: ["TDE2.3"], kanit: "TDE2.3 — Çözümleyebilme (metni çözümleme)" }
  ];
  for (const r of kural) {
    const v = r.anahtar.filter((a) => k.includes(a));
    if (v.length) return { cikti: r.cikti, kanit: r.kanit, eslesen: v };
  }
  return null;
}

function kopru() {
  const gecerliKod = new Set(MEB.ciktilar.filter((c) => c.ders === ICERIK.ders).map((c) => c.kod));
  const out = { surum: ICERIK.surum, ders: ICERIK.ders, sinif: ICERIK.sinif, kazanimlar: [] };

  for (const kz of OKZ.kazanimlar) {
    const t = temaBul(kz.okulizyon);
    const beceri = beceriBul(kz.okulizyon);
    const kayit = {
      sira: kz.sira,
      okulizyon: kz.okulizyon,
      tema: t.temalar.map((x) => x.tema),
      tema_kanit: t.temalar.map((x) => x.cekirdek.join(", ")),
      belirsiz: !!t.belirsiz,
      beceri: beceri ? beceri.cikti : kz.tymm_esleme || [],
      beceri_kanit: beceri ? beceri.kanit : null,
      durum: t.belirsiz ? "belirsiz" : ((t.temalar.length || beceri) ? "eslesti" : "kanit-yok")
    };
    /* TYMM kodları gerçekten var mı? */
    kayit.kod_gecerli = kayit.beceri.every((c) => gecerliKod.has(c));
    out.kazanimlar.push(kayit);
  }

  /* Tema bazlı özet */
  out.temalar = ICERIK.temalar.map((t) => ({
    no: t.no, ad: t.ad,
    metin_turleri: turler(t),
    okulizyon_durum: t.okulizyon_durum,
    okulizyon_kazanim: t.okulizyon_kazanim
  }));
  return out;
}

if (require.main === module) {
  const r = kopru();
  if (process.argv.includes("--json")) { console.log(JSON.stringify(r, null, 1)); process.exit(0); }

  console.log("\n== TDE ↔ OKULİZYON KÖPRÜSÜ ==\n");
  console.log("| # | Okulizyon kazanımı | Bağlandığı tema | Beceri çıktısı |");
  console.log("|---|---|---|---|");
  for (const k of r.kazanimlar) {
    const t = k.belirsiz ? "BELİRSİZ" : (k.tema.length ? "T" + k.tema.join(",") + " (" + k.tema_kanit.join(" / ") + ")" : "—");
    console.log("| " + k.sira + " | " + k.okulizyon.slice(0, 62) + (k.okulizyon.length > 62 ? "…" : "") +
      " | " + t + " | " + k.beceri.join(", ") + (k.kod_gecerli ? "" : " ⚠") + " |");
  }

  console.log("\n== TEMA BAZINDA İÇERİK (TYMM düz metninden) ==\n");
  for (const t of r.temalar) {
    console.log("▸ " + t.no + ". " + t.ad);
    console.log("   metin türleri : " + t.metin_turleri.join(", "));
    console.log("   Okulizyon     : " + (t.okulizyon_durum === "metin-var"
      ? "metin VAR (" + t.okulizyon_kazanim.length + " kazanım)"
      : "metin BEKLENİYOR — uydurulmadı"));
  }

  const eslesen = r.kazanimlar.filter((k) => k.durum === "eslesti").length;
  console.log("\neşleşen kazanım: " + eslesen + "/" + r.kazanimlar.length +
    " · kanıt yok: " + (r.kazanimlar.length - eslesen));
  console.log("Okulizyon metni bekleyen tema: " +
    r.temalar.filter((t) => t.okulizyon_durum !== "metin-var").map((t) => t.no + ". " + t.ad).join(", "));
}

module.exports = { kopru, temaBul, beceriBul, turler };
