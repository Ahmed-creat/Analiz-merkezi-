#!/usr/bin/env node
/* ============================================================
   OKULİZYON KAZANIM → KONU EŞLEME ÖLÇÜMÜ
   ------------------------------------------------------------
   Uygulamanın GERÇEK karar zincirini (site/app-pwa.js → okzKonuBul)
   tarayıcısız çalıştırır ve her kazanım cümlesinin hangi konuya
   bağlandığını tablo hâlinde yazar. Kural/vektör katmanlarında
   yapılan bir değişikliğin ne kazandırdığını, ne bozduğunu
   ölçmenin tek yolu budur — tahminle değil.

   Kullanım:
     node scripts/okz-esleme-olcum.js
     node scripts/okz-esleme-olcum.js docs/uretim/okulizyon-ornek-kazanimlar.json
     node scripts/okz-esleme-olcum.js <dosya> --sessiz

   Girdi biçimi: { "cumleler": [ { "ders": "...", "kazanim": "..." } ] }
            veya  [ { "ders": "...", "kazanim": "..." } ]

   Not: okzKonuBul, uygulamanın kendi dosyasından ÇIKARILIR (kopyası
   değil). Böylece ölçüm ile uygulama aynı kodu koşar; biri değişip
   diğeri unutulmaz.
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const KOK = path.join(__dirname, "..");
const APP = path.join(KOK, "site", "app-pwa.js");

/* ---------- 1) Uygulama modüllerini yükle (globalThis'e yazarlar) --- */
globalThis.window = globalThis;
/* Her modül kendi API'sini window'a yazar; okz-tde.js Node'da yalnız
   module.exports döndürdüğü için onu AÇIKÇA bağlıyoruz (tarayıcıda
   <script> sırası aynı işi yapar). */
const MODUL_ADI = {
  "okz-normalize.js": "OKZ",
  "konu-anahtar.js": "KA",
  "okz-konu.js": "OKZK",
  "okz-meb.js": "OKZM",
  "okz-tde.js": "OKZTDE"
};
for (const f of Object.keys(MODUL_ADI)) {
  const api = require(path.join(KOK, "site", f));
  const ad = MODUL_ADI[f];
  if (api && typeof api === "object" && !globalThis[ad]) globalThis[ad] = api;
}

/* ---------- 2) okzKonuBul zincirini app-pwa.js'ten çıkar ----------- */
const kaynak = fs.readFileSync(APP, "utf8");

function govde(ad) {
  const bas = kaynak.indexOf("function " + ad + "(");
  if (bas < 0) throw new Error("app-pwa.js içinde bulunamadı: " + ad);
  let i = kaynak.indexOf("{", bas), derinlik = 0;
  for (; i < kaynak.length; i++) {
    if (kaynak[i] === "{") derinlik++;
    else if (kaynak[i] === "}") { derinlik--; if (derinlik === 0) return kaynak.slice(bas, i + 1); }
  }
  throw new Error("gövde kapanmadı: " + ad);
}

const FONKSIYONLAR = [
  "okzDersKanonik", "okzKonuHaritasi", "okzHaritaAnahtar", "okzMetinNorm",
  "okzCacheAnahtar", "okzCacheBul", "okzCacheYaz", "okzKonuBul", "okzTdeMi", "okzTdeYedek"
];

/* Uygulamada bu isimler tarayıcı ortamından gelir; burada sadeleştirilir. */
const ORTAM = `
  var OKZ_CACHE = Object.create(null);
  var OKZ_CACHE_YUKLENDI = false;
  var OKZK_IDX = null;
  var OKZ_OTO_ESIK = 0.55, OKZ_OTO_FARK = 0.25;
  function okzStore() { return {}; }
  function okzBilinenDersler() { return window.__DERSLER || []; }
  function okzCacheYaz() { /* ölçümde yazma yok */ }
`;

const sandbox = {
  window: globalThis,
  globalThis: globalThis,
  console: console,
  fetch: function () { return Promise.resolve(null); },
  localStorage: { getItem: function () { return null; }, setItem: function () {} }
};
vm.createContext(sandbox);
vm.runInContext(ORTAM + "\n" + FONKSIYONLAR.map(govde).join("\n"), sandbox);

/* Konu eşleme indeksi (uygulama bunu fetch ile yükler) */
const esleme = JSON.parse(fs.readFileSync(path.join(KOK, "site", "content", "konu_esleme.json"), "utf8"));
sandbox.OKZK_IDX = globalThis.OKZK && globalThis.OKZK.indeksKur ? globalThis.OKZK.indeksKur(esleme) : null;
if (!sandbox.OKZK_IDX) throw new Error("konu eşleme indeksi kurulamadı");

const dersler = new Set();
(esleme.havuzlar || []).forEach(h => h && h.ders && dersler.add(h.ders));
globalThis.__DERSLER = Array.from(dersler);

/* ---------- 3) Girdiyi oku ---------------------------------------- */
const arg = process.argv.slice(2);
const sessiz = arg.includes("--sessiz");
const dosya = arg.find(a => !a.startsWith("--")) || path.join(KOK, "docs", "uretim", "okulizyon-ornek-kazanimlar.json");
const ham = JSON.parse(fs.readFileSync(path.isAbsolute(dosya) ? dosya : path.join(KOK, dosya), "utf8"));
const cumleler = Array.isArray(ham) ? ham : ham.cumleler || [];

/* ---------- 4) Koş ------------------------------------------------- */
const sonuc = [];
for (const c of cumleler) {
  if (!c || !c.kazanim) continue;
  let r = null;
  try { r = sandbox.okzKonuBul(c.ders, c.kazanim); } catch (e) { r = { hata: String(e && e.message || e) }; }
  sonuc.push({
    ders: c.ders,
    kazanim: String(c.kazanim),
    konu: r && r.konu ? r.konu : "",
    kaynak: r && r.kaynak ? r.kaynak : (r && r.hata ? "HATA" : "boş"),
    asama: r && r.asama ? r.asama : 0,
    kod: r && r.kod ? r.kod : "",
    hata: r && r.hata ? r.hata : ""
  });
}

/* ---------- 5) Rapor ---------------------------------------------- */
const dolu = sonuc.filter(s => s.konu);
const bos = sonuc.filter(s => !s.konu);
const kaynakSay = {};
dolu.forEach(s => { kaynakSay[s.kaynak] = (kaynakSay[s.kaynak] || 0) + 1; });

if (process.argv.includes("--json")) {
  process.stdout.write(JSON.stringify(sonuc, null, 1) + "\n");
} else {
  console.log("== OKULİZYON KAZANIM → KONU ÖLÇÜMÜ ==");
  console.log("girdi     : " + path.relative(KOK, path.isAbsolute(dosya) ? dosya : path.join(KOK, dosya)));
  console.log("cümle     : " + sonuc.length);
  console.log("eşleşen   : " + dolu.length + " (%" + (sonuc.length ? Math.round(dolu.length / sonuc.length * 1000) / 10 : 0) + ")");
  console.log("boş       : " + bos.length);
  console.log("kaynak    : " + Object.keys(kaynakSay).sort().map(k => k + " " + kaynakSay[k]).join(" · "));
  const hatalar = sonuc.filter(s => s.kaynak === "HATA");
  if (hatalar.length) console.log("HATA      : " + hatalar.length);
  if (!sessiz) {
    if (bos.length) {
      console.log("\n--- BOŞ KALANLAR ---");
      bos.forEach(s => console.log("  · [" + s.ders + "] " + s.kazanim));
    }
    console.log("\n--- TABLO ---");
    sonuc.forEach(s => console.log(
      "  " + (s.konu ? "✓" : "✗") + " " + (s.ders || "?").slice(0, 22).padEnd(22) +
      " | " + (s.konu || "—").slice(0, 42).padEnd(42) +
      " | " + s.kaynak + (s.kod ? " (" + s.kod + ")" : "")
    ));
  }
}

/* Boş varsa çıkış kodu 1 — CI'da "boş kalmayacak" kapısı olarak kullanılabilir. */
process.exitCode = bos.length ? 1 : 0;
