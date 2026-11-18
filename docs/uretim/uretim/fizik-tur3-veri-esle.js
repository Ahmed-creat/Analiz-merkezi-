#!/usr/bin/env node
/* ============================================================
   FİZİK 10 · 3. TUR — kalan iki kazanımın haritaya bağlanması
   ------------------------------------------------------------
   2026 programında ayrı iki çıktı vardır:
     FİZ.10.3.7  Topraklama olayının önemini sorgulayabilme (5 süreç)
     FİZ.10.4.7  Depremle ilgili bilimsel model oluşturabilme (2 süreç)

   Havuzlar (fizik_10_u03_k07 "3.7 Topraklamanın Önemi",
   fizik_10_u04_k07 "4.6.2 Depremle İlgili Bilimsel Model
   Oluşturabilme") yazılmıştı ancak 2. turda bir önceki çıktıya
   (sırasıyla FİZ.10.3.6 ve FİZ.10.4.6) bağlanmıştı. Bu betik
   yalnız bu iki kaydın künyesini düzeltir; içerik değiştirmez.

   Kullanım:
     node docs/uretim/uretim/fizik-tur3-veri-esle.js [--kontrol]
   Sonrasında: npm run esleme:uret
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const KONTROL = process.argv.includes("--kontrol");
const KAZANIM = path.join(KOK, "site", "content", "mufredat", "kazanim_konu_10.json");
const HAVUZ_DIR = path.join(KOK, "site", "content", "soru_havuzlari");

const DUZELTME = [
  {
    konu_id: "fizik_10_u03_k07",
    kod: "FİZ.10.3.7",
    gerekce: "Kitabın 3.7 başlığı doğrudan topraklamanın önemini sorgulatır; 2026 programında bu çıktı FİZ.10.3.7 olarak 3.6'dan ayrı tanımlanmıştır (5 süreç)."
  },
  {
    konu_id: "fizik_10_u04_k07",
    kod: "FİZ.10.4.7",
    gerekce: "Depremle ilgili bilimsel model oluşturma (sismograf, sismik izolatör) programda ayrı çıktı olarak FİZ.10.4.7 kodundadır; 4.6.2 havuzu bu çıktıya bağlanır."
  }
];

const veri = JSON.parse(fs.readFileSync(KAZANIM, "utf8"));
const program = JSON.parse(fs.readFileSync(path.join(KOK, "site", "content", "mufredat", "meb_kazanim_10.json"), "utf8"));
let hata = 0;

for (const d of DUZELTME) {
  const kayit = veri.konular.find(k => k.konu_id === d.konu_id);
  if (!kayit) { console.error("✗ kayıt yok:", d.konu_id); hata++; continue; }
  const hedef = program.ciktilar.find(c => c.kod === d.kod);
  if (!hedef) { console.error("✗ program çıktısı yok:", d.kod); hata++; continue; }
  if (!fs.existsSync(path.join(HAVUZ_DIR, d.konu_id + ".json"))) {
    console.error("✗ havuz dosyası yok:", d.konu_id); hata++; continue;
  }

  kayit.kodlar = [d.kod];
  kayit.guven = "kesin";
  kayit.yontem = "elle-dogrulama";
  kayit.skor = 1;
  kayit.uyari = "";
  kayit.gerekce = d.gerekce;
  kayit.kazanim_metinleri = 1;
  kayit.metin_kodlari = [{ metin: hedef.kazanim, kod: d.kod, skor: 1 }];
  console.log("✓", d.konu_id, "→", d.kod, "·", hedef.kazanim.slice(0, 48) + "…");
}

if (hata) { console.error("düzeltilemeyen kayıt:", hata); process.exit(1); }
if (!KONTROL) fs.writeFileSync(KAZANIM, JSON.stringify(veri, null, 2) + "\n", "utf8");
console.log(KONTROL ? "(kontrol)" : "yazıldı: " + path.relative(KOK, KAZANIM));
