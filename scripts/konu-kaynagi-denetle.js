#!/usr/bin/env node
/* ============================================================
   KONU KAYNAĞI DENETİMİ
   ------------------------------------------------------------
   Bir ders/sınıf için "konu adı" üç kaynakta aranır ve nerede
   BULUNDUĞU / BULUNMADIĞI raporlanır. Hiçbir konu adı uydurulmaz.

     1) TYMM  — tema → öğrenme çıktıları; "İçerik Çerçevesi" beceri
                başlıkları verir, konu adı vermez.
     2) ODSGM — tema → konu (içerik çerçevesi) → çıktı kodu.
                Konu adı BURADADIR.
     3) Ders kitabı — kitap bazlı ünite/konu başlıkları.

   Kullanım:
     node scripts/konu-kaynagi-denetle.js
     node scripts/konu-kaynagi-denetle.js "<odsgm.pdf>" --yaz
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const MUFREDAT = path.join(KOK, "site/content/mufredat");
const ODSGM_10 = path.join(MUFREDAT, "odsgm_konu_kazanim_10.json");
const MEBB_10 = path.join(MUFREDAT, "meb_kazanim_10.json");

const oku = (p) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : null);

/* ---------- 1) kaynak envanteri ---------- */
function envanter() {
  const odsgm = oku(ODSGM_10);
  const meb = oku(MEBB_10);
  const cikti = [];

  if (meb && meb.ciktilar) {
    const dersler = [...new Set(meb.ciktilar.map((c) => c.ders))];
    for (const ders of dersler) {
      const c = meb.ciktilar.filter((x) => x.ders === ders);
      cikti.push({ ders, cikti: c.length, tema: new Set(c.map((x) => x.tema)).size });
    }
  }

  return {
    tymm: { var: !!meb, program: meb && meb.program, dersler: cikti },
    odsgm: odsgm
      ? {
          var: true,
          belge: odsgm.kaynak && odsgm.kaynak.belge,
          konu: (odsgm.konular || []).length,
          cikti: (odsgm.konular || []).reduce((a, k) => a + (k.ciktilar || []).length, 0),
          ders_bazli: odsgm.ozet && odsgm.ozet.ders_bazli
        }
      : { var: false }
  };
}

/* ---------- 2) konu adı nerede var? ---------- */
function konuNerede(ders) {
  const odsgm = oku(ODSGM_10);
  const meb = oku(MEBB_10);
  const sonuc = { ders, tymm_icerik_cercevesi: null, odsgm_konu: [], kaynak: null };

  /* TYMM: İçerik Çerçevesi yalnız beceri başlıkları verir */
  sonuc.tymm_icerik_cercevesi = {
    var: true,
    ama: "beceri başlıkları (Okuma/Yazma/Dinleme/Konuşma) — konu adı DEĞİL",
    cikti_sayisi: meb ? meb.ciktilar.filter((c) => c.ders === ders).length : 0
  };

  if (odsgm) {
    sonuc.odsgm_konu = (odsgm.konular || [])
      .filter((k) => k.ders === ders)
      .map((k) => ({ unite: k.unite, konu: k.konu, ciktilar: (k.ciktilar || []).map((c) => c.kod) }));
    if (sonuc.odsgm_konu.length) sonuc.kaynak = "ODSGM konu-soru dağılım tablosu";
  }

  if (!sonuc.kaynak) {
    sonuc.kaynak = "YOK — bu ders/sınıf için konu tablosu depoda yok (uydurulmaz)";
  }
  return sonuc;
}

/* ---------- 3) ODSGM PDF'inden tablo çıkarma ---------- */
/* PDF satırları: tema başlığı, ardından "konu" hücresi ve çıktı kodları.
   Biçim belgeye göre değiştiği için TAHMİN ETMEZ: bulunanı raporlar,
   bulamadığını "elle kontrol" olarak işaretler. */
function pdfCikar(pdfYolu) {
  const { pdfMetinCikar } = require("./pdf-metin-cikar.js");
  const metin = pdfMetinCikar(pdfYolu);
  const satirlar = metin.split("\n").map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean);

  const temalar = [];
  let aktif = null;
  for (const s of satirlar) {
    const t = /^(\d+)\.\s*(TEMA|ÜNİTE)\s*:?\s*(.+)$/i.exec(s);
    if (t) {
      aktif = { unite: t[1] + ". TEMA: " + t[3].trim(), konu: [], ciktilar: [] };
      temalar.push(aktif);
      continue;
    }
    if (!aktif) continue;
    const kodlar = s.match(/\b[A-ZÇĞİÖŞÜ]{2,6}\d*\.\d+\.\d+\b/g);
    if (kodlar) aktif.ciktilar.push(...kodlar);
    else aktif.konu.push(s);
  }
  return temalar.filter((t) => t.konu.length || t.ciktilar.length);
}

/* ---------- CLI ---------- */
if (require.main === module) {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const pdf = args[0];

  if (!pdf) {
    const e = envanter();
    console.log("\n== KONU ADI KAYNAK ENVANTERİ ==\n");
    console.log("1) TYMM (tymm.meb.gov.tr)");
    console.log("   " + (e.tymm.program || "-"));
    console.log("   Çıktı sayısı: " + e.tymm.dersler.reduce((a, d) => a + d.cikti, 0) +
      " · ders: " + e.tymm.dersler.length);
    console.log("   ⚠ 'İçerik Çerçevesi' konu adı DEĞİL, beceri başlığı verir.\n");

    console.log("2) ODSGM (odsgm.meb.gov.tr)");
    if (e.odsgm.var) {
      console.log("   " + e.odsgm.belge);
      console.log("   konu: " + e.odsgm.konu + " · çıktı: " + e.odsgm.cikti);
      console.log("   ders bazlı: " + JSON.stringify(e.odsgm.ders_bazli));
      console.log("   ✅ KONU ADI BURADA.");
    } else console.log("   ✗ yok");

    console.log("\n3) Ders kitabı (ogmmateryal.eba.gov.tr) — kitap bazlı, depoda yok.\n");

    console.log("== DERS BAZINDA KONU KAYNAĞI ==");
    console.log("| Ders | TYMM çıktı | ODSGM konu | Kaynak |");
    console.log("|---|---|---|---|");
    for (const d of e.tymm.dersler.map((x) => x.ders)) {
      const k = konuNerede(d);
      console.log("| " + d + " | " + k.tymm_icerik_cercevesi.cikti_sayisi + " | " +
        k.odsgm_konu.length + " | " + (k.odsgm_konu.length ? "ODSGM ✓" : "YOK") + " |");
    }
    console.log("\n9. sınıf ODSGM tablosu depoda YOK. PDF verilirse:");
    console.log("  node scripts/konu-kaynagi-denetle.js \"<pdf>\" --yaz");
    process.exit(0);
  }

  const temalar = pdfCikar(pdf);
  console.log("\n== " + path.basename(pdf) + " ==");
  console.log("tema/ünite bulundu: " + temalar.length);
  temalar.forEach((t) => {
    console.log("\n▸ " + t.unite);
    if (t.konu.length) console.log("  KONU: " + t.konu.slice(0, 6).join(" | "));
    if (t.ciktilar.length) console.log("  ÇIKTILAR: " + [...new Set(t.ciktilar)].join(", "));
  });
  if (!temalar.length) {
    console.error("\nTema/ünite satırı bulunamadı. PDF metni tablo biçiminde olmayabilir; elle kontrol gerekir.");
    process.exit(1);
  }

  if (process.argv.includes("--yaz")) {
    const hedef = path.join(MUFREDAT, "odsgm_konu_kazanim_9.json");
    fs.writeFileSync(hedef, JSON.stringify({
      surum: new Date().toISOString().slice(0, 10),
      kaynak: { ad: "MEB Ölçme, Değerlendirme ve Sınav Hizmetleri Genel Müdürlüğü (ODSGM)",
        pdf: path.basename(pdf), aciklama: "konu-kaynagi-denetle.js ile PDF'ten çıkarıldı" },
      konular: temalar.map((t) => ({ unite: t.unite, konu: t.konu.join(" • "),
        ciktilar: [...new Set(t.ciktilar)].map((kod) => ({ kod: kod })) }))
    }, null, 1), "utf8");
    console.log("\nyazıldı: site/content/mufredat/odsgm_konu_kazanim_9.json");
  }
}

module.exports = { envanter, konuNerede, pdfCikar };
