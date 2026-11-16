#!/usr/bin/env node
/* ============================================================
   TÜM KAZANIM DÖKÜMÜ (insan/ajan tarafından okunabilir)
   ------------------------------------------------------------
   Dokuz dersin 10. sınıf programındaki BÜTÜN öğrenme çıktılarını
   ve süreç bileşenlerini tek Markdown dosyasına yazar.

   Kaynak: site/content/mufredat/meb_kazanim_10.json  (resmî TYMM 2026)
           docs/uretim/uretim-plani.json              (hedef + konu_id)
           site/content/mufredat/odsgm_konu_kazanim_10.json (sınav konusu)

   Çıktı : docs/uretim/TUM-KAZANIMLAR-10SINIF.md

   Kullanım: node scripts/kazanim-dokumu.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const U = require("./uretim-veri.js");
const PLAN = { ciktilar: U.plan, ozet: U.ozet };
const ODSGM = require(path.join(KOK, "site/content/mufredat/odsgm_konu_kazanim_10.json"));
const FY = require(path.join(KOK, "tests/fixtures/tymm-2026-10sinif.json"));
const CIKTI = path.join(KOK, "docs/uretim", "TUM-KAZANIMLAR-10SINIF.md");

/* ODSGM'de bir kodun bağlı olduğu konu(lar) ve senaryo sayıları. */
const odsgmKonu = {};
for (const k of ODSGM.konular || []) {
  for (const c of k.ciktilar || []) {
    (odsgmKonu[c.kod] = odsgmKonu[c.kod] || []).push({
      unite: k.unite,
      konu: k.konu,
      senaryo: c.senaryo_sayilari || []
    });
  }
}

const DERS_SIRA = U.DERS_SIRA;

const L = [];
const p = s => L.push(s);

p("# 10. Sınıf — Tüm Derslerin Öğrenme Çıktıları ve Süreç Bileşenleri");
p("");
p("> **Kaynak:** MEB Türkiye Yüzyılı Maarif Modeli (TYMM) 2026 öğretim programları.");
p("> `node scripts/kazanim-dokumu.js` üretir; elle düzenlenmez.");
p("> Ham veri: `site/content/mufredat/meb_kazanim_10.json`");
p("> Eşlik eden talimat: `docs/uretim/SORU-URETIM-TALIMATI.md`");
p("");
p("## Bu dosya nedir?");
p("");
p("Dokuz dersin **10. sınıf** programındaki **158 öğrenme çıktısının** tamamı, **44 tema** ve");
p("bu çıktıların **612 süreç bileşeni** burada eksiksiz listelenmiştir.");
p("");
p("Her çıktının başlığı altında şu satır vardır:");
p("");
p("```");
p("Dosya: <konu_id>.json · konu_id: <ders>_10_t<tema>_c<sıra> · hedef soru: N · süreç: M");
p("```");
p("");
p("Bunlar soru üretecek ajanın iş emridir: hangi dosyayı açacağı, kaç soru yazacağı");
p("ve soruları hangi süreç bileşenlerine dağıtacağı bu satırdan okunur.");
p("");
p("**Hiçbir metin değiştirilmemiştir.** Kazanım cümleleri ve süreç bileşenleri resmî");
p("programdan birebir alınmıştır (doğrulama: `npm run -s test:tymm` → 158/158 çıktı, 612/612 süreç).");
p("");

// ---- özet ----
const toplamCikti = PLAN.ciktilar.length;
const toplamSurec = PLAN.ciktilar.reduce((a, b) => a + b.surec_sayisi, 0);
const toplamHedef = PLAN.ciktilar.reduce((a, b) => a + b.hedef_soru, 0);
p("## Özet");
p("");
p("| Ders | Çıktı | Süreç bileşeni | Üretilecek soru |");
p("| --- | --- | --- | --- |");
for (const ders of DERS_SIRA) {
  const ds = PLAN.ciktilar.filter(c => c.ders === ders);
  p(`| ${ders} | ${ds.length} | ${ds.reduce((a, b) => a + b.surec_sayisi, 0)} | **${ds.reduce((a, b) => a + b.hedef_soru, 0)}** |`);
}
p(`| **Toplam** | **${toplamCikti}** | **${toplamSurec}** | **${toplamHedef}** |`);
p("");
p("Kural: `hedef soru = max(10, 2 × süreç bileşeni sayısı)`");
p("");
p("## Kaynak belgeler");
p("");
p("| Ders | Program (PID) | Kaynak adresi | sha256 |");
p("| --- | --- | --- | --- |");
for (const ders of DERS_SIRA) {
  const k = FY.kaynaklar[ders];
  p(`| ${ders} | ${k.pid} | \`${k.url}\` | \`${k.sha256.slice(0, 20)}…\` |`);
}
p("");
p("---");
p("");

// ---- dersler ----
for (const ders of DERS_SIRA) {
  const ds = PLAN.ciktilar.filter(c => c.ders === ders).sort((a, b) => a.tema - b.tema || a.kod.localeCompare(b.kod, "tr"));
  const temaSet = [...new Set(ds.map(c => c.tema))].sort((a, b) => a - b);

  p(`## ${ders}`);
  p("");
  p(`${ds.length} öğrenme çıktısı · ${ds.reduce((a, b) => a + b.surec_sayisi, 0)} süreç bileşeni · ` +
    `${ds.reduce((a, b) => a + b.hedef_soru, 0)} soru`);
  p("");
  p("| Tema | Ad | Çıktı |");
  p("| --- | --- | --- |");
  for (const t of temaSet) {
    const ad = ds.find(c => c.tema === t).tema_adi;
    const n = ds.filter(c => c.tema === t).length;
    p(`| ${t} | ${ad || "— (kanıtlanmış ad yok)"} | ${n} |`);
  }
  p("");

  for (const t of temaSet) {
    const ad = ds.find(c => c.tema === t).tema_adi;
    p(`### ${ders} · Tema ${t}${ad ? " — " + ad : ""}`);
    p("");
    for (const c of ds.filter(x => x.tema === t)) {
      p(`#### \`${c.kod}\` — ${c.kazanim}`);
      p("");
      p(`- **Dosya:** \`${c.dosya}\` · **konu_id:** \`${c.konu_id}\` · **hedef soru:** ${c.hedef_soru} · **süreç:** ${c.surec_sayisi}`);
      const od = odsgmKonu[c.kod];
      if (od && od.length) {
        const o = od[0];
        const sn = o.senaryo && o.senaryo.length ? o.senaryo.join(", ") : "—";
        p(`- **ODSGM sınav konusu:** ${o.konu} *(senaryo sayıları: ${sn})*`);
      }
      p("");
      p("**Süreç bileşenleri:**");
      p("");
      for (const s of c.surec) p(`- ${s}`);
      p("");
    }
  }
  p("---");
  p("");
}

// ---- kuyruk ----
p("## Tema adı çözülemeyen başlıklar");
p("");
p("Aşağıdaki temalarda resmî ad **kanıtlanamadığı için boş bırakıldı** (uydurulmadı).");
p("Soru üretimi için tema numarası ve MEB kodu yeterlidir.");
p("");
for (const ders of DERS_SIRA) {
  const eksik = [...new Set(PLAN.ciktilar.filter(c => c.ders === ders && !c.tema_adi).map(c => c.tema))].sort((a, b) => a - b);
  if (eksik.length) p(`- **${ders}**: tema ${eksik.join(", ")}`);
}
p("");
p("## Sırada ne var?");
p("");
p("Soru üretimi talimatı: **`docs/uretim/SORU-URETIM-TALIMATI.md`**");
p("");
p("```bash");
p("node scripts/soru-uret-dogrula.js <dizin>       # üretilen havuzları doğrula");
p("node scripts/havuz-index-uret.js --plan         # manifest üret + planla karşılaştır");
p("```");

fs.writeFileSync(CIKTI, L.join("\n") + "\n", "utf8");
console.log("yazıldı: docs/uretim/TUM-KAZANIMLAR-10SINIF.md (" + L.length + " satır)");
console.log("çıktı " + toplamCikti + " · süreç " + toplamSurec + " · hedef soru " + toplamHedef);
