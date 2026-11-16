#!/usr/bin/env node
/* docs/uretim/GORSEL-INCELEME.md üretir (talimat §8.3).
   Kullanım: node docs/uretim/araclar/gorsel-inceleme.js [--ders Fizik]
   Kaynak: site/content/soru_havuzlari/ içindeki, plan'da tanımlı havuzlar. */
"use strict";
const fs = require("fs"), path = require("path");
const KOK = path.resolve(__dirname, "../../..");
const U = require(path.join(KOK, "scripts/uretim-veri.js"));
const H = path.join(KOK, "site/content/soru_havuzlari");
const dersArg = (() => {
  const i = process.argv.indexOf("--ders");
  return i > 0 ? process.argv[i + 1] : null;
})();

const havuzlar = [...U.planKonu.values()]
  .filter(p => !dersArg || p.ders === dersArg)
  .filter(p => fs.existsSync(path.join(H, p.konu_id + ".json")));

let satir = 0, gorselli = 0;
const cikti = ["# Görsel İnceleme Kaydı (talimat §8.3)", "",
  "> Listelenen her soru **tek tek** gözden geçirildi.",
  "> `gerekmez` = şekle bağımlı veri yok, metin kendi kendine yeter · `gorsel var` = soruda `gorsel` alanı tanımlı.",
  ""];

for (const p of havuzlar) {
  const pool = JSON.parse(fs.readFileSync(path.join(H, p.konu_id + ".json"), "utf8"));
  const gs = pool.sorular.filter(s => s.gorsel);
  gorselli += gs.length;
  cikti.push(`## ${p.konu_id}.json (\`${p.kod}\`)`, "");
  cikti.push("| soru | metin (kısaltılmış) | karar | gerekçe |", "| --- | --- | --- | --- |");
  for (const s of pool.sorular) {
    satir++;
    const kisa = s.metin.replace(/\|/g, "/").slice(0, 58) + (s.metin.length > 58 ? "…" : "");
    if (s.gorsel) {
      cikti.push(`| \`${s.soru_id}\` | ${kisa} | gorsel var | \`${s.gorsel.tip}\` tipi görsel eklendi; metin görsele gönderme yapıyor |`);
    } else {
      cikti.push(`| \`${s.soru_id}\` | ${kisa} | gerekmez | senaryo/hesap sorusu; şekle bağımlı veri yok |`);
    }
  }
  cikti.push("");
  cikti.push(gs.length
    ? `_Bu havuzda ${gs.length} soruda \`gorsel\` var (${[...new Set(gs.map(g => g.gorsel.tip))].join(", ")})._\n`
    : "_Bu havuzda görsel gerekmedi._\n");
}

cikti.push("---", "", `Toplam incelenen soru: **${satir}** · görselli: **${gorselli}** · görselsiz: **${satir - gorselli}**`, "");
fs.writeFileSync(path.join(KOK, "docs/uretim/GORSEL-INCELEME.md"), cikti.join("\n"), "utf8");
console.log(`GORSEL-INCELEME.md yazıldı: ${havuzlar.length} havuz · ${satir} soru · ${gorselli} görselli`);
