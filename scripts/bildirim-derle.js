#!/usr/bin/env node
/* ============================================================
   BİLDİRİM FONKSİYONU DERLEYİCİ (scripts/bildirim-derle.js)
   ------------------------------------------------------------
   Tek kaynak ilkesi: şifreleme kodu scripts/webpush-kripto.mjs
   içinde yaşar. Supabase Edge Function tek dosya yüklenebildiği
   için kripto modülü şablona GÖMÜLÜR.

     supabase/functions/bildirim-gonder/sablon.ts   (elle yazılır)
     scripts/webpush-kripto.mjs                    (elle yazılır)
                    ↓  node scripts/bildirim-derle.js
     supabase/functions/bildirim-gonder/index.ts   (üretilir, yüklenir)

   Kullanım: node scripts/bildirim-derle.js [--kontrol]
   --kontrol: yalnız üretilecek dosyanın güncel olup olmadığını söyler.
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const SAR = path.join(KOK, "site", "..", "supabase", "functions", "bildirim-gonder");
const SABLON = path.join(SAR, "sablon.ts");
const KRIPTO = path.join(KOK, "scripts", "webpush-kripto.mjs");
// Bildirim METNİ mantığı: uygulamanın/GitHub Actions'ın kullandığı dosyanın
// AYNISI. Böylece iki gönderici farklı bildirim üretmez.
const MANTIK = path.join(KOK, "bildirim-logic.js");
const CIKTI = path.join(SAR, "index.ts");

function kriptoGom() {
  const kaynak = fs.readFileSync(KRIPTO, "utf8");
  // Yalnız gerekli parçalar: yorum başlığı korunur, "export" anahtar kelimesi atılır.
  const govde = kaynak
    .replace(/^\/\* =+[\s\S]*?=+ \*\/\s*/, "")   // dosya başlığını at (şablonun kendi başlığı var)
    .replace(/^export\s+/gm, "");
  // Şablonun içine girince çift boşluk bırakma
  return govde.trim() + "\n";
}

function mantikGom() {
  const kaynak = fs.readFileSync(MANTIK, "utf8");
  // CommonJS dışa aktarımını at; fonksiyonlar üst düzeyde kalsın.
  let govde = kaynak.replace(/^module\.exports[\s\S]*$/m, "").trim();
  // GÖMÜLÜ dosya küçük kalsın: yalnızca TAMAMEN yorum olan satırları ve boş
  // satırları at (satır içi yorumlara dokunmuyoruz — kod bozulmasın).
  govde = govde.split("\n")
    .filter((satir) => {
      const t = satir.trim();
      return t !== "" && !t.startsWith("//");
    })
    .join("\n");
  if (!/function buildMessages\s*\(/.test(govde)) throw new Error("bildirim-logic.js içinde buildMessages yok");
  return govde + "\n";
}

function uret() {
  const sablon = fs.readFileSync(SABLON, "utf8");
  if (!sablon.includes("//__KRIPTO__")) throw new Error("şablonda //__KRIPTO__ işareti yok");
  if (!sablon.includes("//__MANTIK__")) throw new Error("şablonda //__MANTIK__ işareti yok");
  let cikti =
    "// ⚠ ÜRETİLMİŞ DOSYA — elle düzenlemeyin.\n" +
    "// Kaynak: supabase/functions/bildirim-gonder/sablon.ts + scripts/webpush-kripto.mjs + bildirim-logic.js\n" +
    "// Derle: node scripts/bildirim-derle.js\n\n" +
    sablon.replace("//__KRIPTO__", kriptoGom()).replace("//__MANTIK__", mantikGom());
  return cikti;
}

const yeni = uret();
const eski = fs.existsSync(CIKTI) ? fs.readFileSync(CIKTI, "utf8") : "";

if (process.argv.includes("--kontrol")) {
  console.log(eski === yeni ? "güncel" : "GÜNCEL DEĞİL — node scripts/bildirim-derle.js");
  process.exit(eski === yeni ? 0 : 1);
}

fs.writeFileSync(CIKTI, yeni);
console.log("yazıldı: " + path.relative(KOK, CIKTI) + " (" + yeni.length + " bayt)");
