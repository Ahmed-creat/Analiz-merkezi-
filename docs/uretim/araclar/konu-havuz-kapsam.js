#!/usr/bin/env node
/* ============================================================
   KONU ↔ HAVUZ KAPSAM ÖLÇERİ  (salt-okuma)   docs/uretim/araclar/konu-havuz-kapsam.js
   ------------------------------------------------------------
   Neyi ölçer?
     • 10. sınıf müfredatındaki her konu bir soru havuzuna bağlanıyor mu?
       (motorun KENDİ eşleştiricisi: site/havuz-bul.js — kopya mantık yok)
     • Havuzu olmayan konu BELGELENMİŞ istisna mı?
       (gerekçe tek kaynaktan: site/index.html → HAVUZSUZ_GEREKCE)
     • Hiçbir konuya bağlanmayan (yetim) havuz var mı?

   KURAL: eşik gevşetilmez, uydurma eşleme yapılmaz.
     - Belgelenmemiş eksik konu  → çıkış kodu 1
     - Yetim havuz               → çıkış kodu 1
   Paragraf kalıcı istisnadır (kullanıcı kararı: paragraf sorusu uygulamada
   sorulmaz; havuzu üretilmeyecek).

   Kullanım: node docs/uretim/araclar/konu-havuz-kapsam.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.resolve(__dirname, "../../..");
const HB = require(path.join(KOK, "site", "havuz-bul.js"));
/* AM_HTML: gerileme/istisna sınaması için başka bir index.html ölçülebilir. */
const HTML_YOLU = process.env.AM_HTML ? path.resolve(process.env.AM_HTML) : path.join(KOK, "site", "index.html");
const html = fs.readFileSync(HTML_YOLU, "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(KOK, "site", "content", "soru_havuzlari", "index.json"), "utf8"));

// index.html içinden `const AD = { ... };` nesnesini SÜSLÜ PARANTEZ sayarak
// çıkarır (satır sonuna/boşluğa bağlı değil; metin içindeki { } atlanır).
function nesneCikar(ad) {
  const bas = html.indexOf("const " + ad + " = {");
  if (bas < 0) return null;
  let i = html.indexOf("{", bas), derinlik = 0, tirnak = null;
  for (; i < html.length; i++) {
    const c = html[i];
    if (tirnak) {
      if (c === "\\") { i++; continue; }
      if (c === tirnak) tirnak = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { tirnak = c; continue; }
    if (c === "{") derinlik++;
    else if (c === "}") { derinlik--; if (!derinlik) break; }
  }
  const govde = html.slice(html.indexOf("{", bas), i + 1);
  return Function("return (" + govde + ");")();
}

// ---- Müfredat ----
const CURRICULUM = nesneCikar("CURRICULUM");
if (!CURRICULUM) throw new Error("index.html içinde CURRICULUM bulunamadı");

// ---- Belgelenmiş istisnalar (tek kaynak: uygulamanın kendi gerekçe tablosu) ----
const HAVUZSUZ_GEREKCE = nesneCikar("HAVUZSUZ_GEREKCE") || {};

const havuzlar = Array.isArray(manifest.havuzlar) ? manifest.havuzlar : [];
function coz(topicKey) {
  const birebir = havuzlar.find(h => String(h.topic_key) === topicKey);
  if (birebir) return birebir;
  return HB.bul(topicKey, havuzlar.filter(h => String(h.sinif) === "10"));
}

const tree = CURRICULUM[10] || {};
let toplam = 0, bagli = 0;
const eksik = {}, istisna = {};
const kullanilan = {};
Object.keys(tree).forEach(ders => {
  eksik[ders] = [];
  (tree[ders] || []).forEach(konu => {
    toplam++;
    const tk = ders + " > " + konu;
    const h = coz(tk);
    if (h) { bagli++; kullanilan[h.konu_id] = 1; return; }
    if (HAVUZSUZ_GEREKCE[tk]) istisna[ders] = (istisna[ders] || []).concat([konu]);
    else eksik[ders].push(konu);
  });
});

const yetim = havuzlar.filter(h => !kullanilan[h.konu_id]);
const belgelenmis = Object.keys(HAVUZSUZ_GEREKCE).length;
const belgelenmemis = Object.keys(eksik).reduce((a, d) => a + eksik[d].length, 0);

// ---- Rapor ----
console.log("KONU ↔ HAVUZ KAPSAMI (10. sınıf)");
console.log("  konu: " + bagli + "/" + toplam + " bağlı · belgelenmiş istisna: " + belgelenmis +
  " · belgelenmemiş eksik: " + belgelenmemis);
Object.keys(istisna).forEach(d => {
  istisna[d].forEach(k => console.log("  · İSTİSNA " + d + " > " + k + " → " + HAVUZSUZ_GEREKCE[d + " > " + k]));
});
if (belgelenmemis) {
  Object.keys(eksik).forEach(d => {
    if (eksik[d].length) console.log("  ✗ EKSİK " + d + " (" + eksik[d].length + "): " + eksik[d].join(" | "));
  });
}
console.log("  havuz: " + havuzlar.length + " · bağlanan: " + (havuzlar.length - yetim.length) + " · yetim: " + yetim.length);
if (yetim.length) {
  yetim.forEach(h => console.log("  ✗ YETİM " + h.konu_id + " · " + (h.baslik || h.topic_key)));
}

// ---- Kapı ----
if (belgelenmemis || yetim.length) {
  console.log("\nSONUÇ: ✗ kapsam eksik/ yetim havuz var (belgelenmemiş).");
  process.exit(1);
}
console.log("\nSONUÇ: ✓ her konu ya havuza bağlı ya belgelenmiş istisna; yetim havuz yok.");
