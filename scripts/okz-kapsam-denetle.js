#!/usr/bin/env node
/* ============================================================
   OKULİZYON → UYGULAMA KONUSU KAPSAM DENETİMİ
   ------------------------------------------------------------
   Soru: "Okulizyon'daki kazanımlar uygulamadaki konularla
          %100 eşleşiyor mu?"

   Bu betik her Okulizyon kazanım cümlesini uygulamanın GERÇEK
   karar zincirinden (app-pwa.js → okzKonuBul) geçirir, sonra çıkan
   konuyu uygulamanın iki kaynağıyla karşılaştırır:

     HAVUZ  site/content/soru_havuzlari/index.json      (soru var)
     AĞAÇ   site/index.html → CURRICULUM["10"]           (Bilgi Bankası'ndaki
            uygulamanın GERÇEK konu ağacı, 180 konu)
            + site/content/mufredat/kazanim_konu_10.json (havuz türevi)

   Durumlar
     HAVUZ        → konu birebir havuzda: kart açılır, soru gelir
     AĞAÇ         → konu ağaçta var, havuzu yok
     BAŞLIK FARKI → konu HAVUZDA/AĞAÇTA VAR ama adı farklı yazılmış
                    (ör. "Coğrafi Bakış" ↔ "1.1 Coğrafi Bakış")
     YOK          → uygulamada böyle bir konu yok

   Kullanım:
     node scripts/okz-kapsam-denetle.js
     node scripts/okz-kapsam-denetle.js docs/uretim/okulizyon-ornek-kazanimlar.json
     node scripts/okz-kapsam-denetle.js --json
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const KOK = path.join(__dirname, "..");

/* ---------- 1) uygulama modülleri ------------------------------- */
globalThis.window = globalThis;
const MODUL_ADI = {
  "okz-normalize.js": "OKZ",
  "konu-anahtar.js": "KA",
  "okz-konu.js": "OKZK",
  "okz-meb.js": "OKZM",
  "okz-tde.js": "OKZTDE"
};
for (const f of Object.keys(MODUL_ADI)) {
  const api = require(path.join(KOK, "site", f));
  if (api && typeof api === "object" && !globalThis[MODUL_ADI[f]]) globalThis[MODUL_ADI[f]] = api;
}

/* ---------- 2) okzKonuBul zincirini app-pwa.js'ten çıkar -------- */
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
function govde(ad) {
  const bas = APP.indexOf("function " + ad + "(");
  if (bas < 0) throw new Error("bulunamadı: " + ad);
  let i = APP.indexOf("{", bas), d = 0;
  for (; i < APP.length; i++) {
    if (APP[i] === "{") d++;
    else if (APP[i] === "}") { d--; if (!d) return APP.slice(bas, i + 1); }
  }
  throw new Error("kapanmadı: " + ad);
}
const FONK = ["okzDersKanonik", "okzKonuHaritasi", "okzHaritaAnahtar", "okzMetinNorm",
  "okzCacheAnahtar", "okzCacheBul", "okzCacheYaz", "okzKonuBul", "okzTdeMi", "okzTdeYedek"];

const sandbox = {
  window: globalThis, globalThis: globalThis, console: console,
  fetch: () => Promise.resolve(null),
  localStorage: { getItem: () => null, setItem: () => {} }
};
vm.createContext(sandbox);
vm.runInContext(`
  var OKZ_CACHE = Object.create(null);
  var OKZ_CACHE_YUKLENDI = false;
  var OKZK_IDX = null;
  var OKZ_OTO_ESIK = 0.55, OKZ_OTO_FARK = 0.25;
  function okzStore() { return {}; }
  function okzBilinenDersler() { return window.__DERSLER || []; }
  function okzCacheYaz() {}
` + "\n" + FONK.map(govde).join("\n"), sandbox);

const esleme = JSON.parse(fs.readFileSync(path.join(KOK, "site", "content", "konu_esleme.json"), "utf8"));
sandbox.OKZK_IDX = globalThis.OKZK.indeksKur(esleme);
globalThis.__DERSLER = Array.from(new Set((esleme.havuzlar || []).map(h => h.ders).filter(Boolean)));

/* ---------- 3) uygulamanın konu evreni -------------------------- */
const MANIFEST = JSON.parse(fs.readFileSync(path.join(KOK, "site", "content", "soru_havuzlari", "index.json"), "utf8"));
const AGAC = JSON.parse(fs.readFileSync(path.join(KOK, "site", "content", "mufredat", "kazanim_konu_10.json"), "utf8"));

/* "1.1 Coğrafi Bakış" → "cografi bakis" : numara ve noktalama atılır */
function sadeles(x) {
  return String(x == null ? "" : x)
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ç/g, "c")
    .replace(/ö/g, "o").replace(/ü/g, "u").replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u")
    .replace(/^\s*\d+\s*[.)]\s*\d*\s*/, " ")      // baştaki "1.1 " / "1) "
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const havuzlar = (MANIFEST.havuzlar || []).map(h => ({
  konu_id: h.konu_id,
  ders: h.ders || "",
  topic_key: h.topic_key || "",
  konu: String(h.topic_key || "").split(" > ").slice(1).join(" > ") || h.baslik || "",
  anahtar: sadeles(String(h.topic_key || "").split(" > ").slice(1).join(" > ") || h.baslik || "")
}));
const havuzTopic = new Map(havuzlar.map(h => [String(h.topic_key), h]));
const havuzBaslik = new Map();
havuzlar.forEach(h => { if (!havuzBaslik.has(h.ders + "|" + h.anahtar)) havuzBaslik.set(h.ders + "|" + h.anahtar, h); });

/* BİLGİ BANKASI AĞACI — uygulamanın gerçek konu listesi (CURRICULUM).
   Havuz türevi kazanim_konu_10.json 152 konu içerir; CURRICULUM 180.
   Fark: havuzu olmayan ama uygulamada SORULABİLEN konular (TDE'nin
   dil bilgisi başlıkları gibi). "Uygulamadaki konular" = bu ağaç. */
function curriculumCek() {
  const h = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
  const i = h.indexOf("const CURRICULUM = {");
  if (i < 0) return null;
  const bas = h.indexOf("{", i);
  let d = 0, j = bas;
  for (; j < h.length; j++) {
    if (h[j] === "{") d++;
    else if (h[j] === "}") { d--; if (!d) { j++; break; } }
  }
  try { return JSON.parse(JSON.stringify(eval("(" + h.slice(bas, j) + ")"))); } catch (e) { return null; }
}
const CURR = curriculumCek();
const agaclar = (AGAC.konular || []).map(k => ({
  konu_id: k.konu_id,
  ders: k.ders || "",
  konu: k.konu || "",
  anahtar: sadeles(k.konu || "")
}));
if (CURR && CURR["10"]) {
  for (const ders of Object.keys(CURR["10"])) {
    for (const ad of CURR["10"][ders]) {
      agaclar.push({ konu_id: "", ders, konu: String(ad), anahtar: sadeles(ad), kaynak: "bilgi-bankasi" });
    }
  }
}
const agacBaslik = new Map();
agaclar.forEach(k => { if (!agacBaslik.has(k.ders + "|" + k.anahtar)) agacBaslik.set(k.ders + "|" + k.anahtar, k); });

const agacTopic = new Map(agaclar.map(k => [k.ders + " > " + k.konu, k]));

function cozumle(r, ders) {
  if (!r || !r.konu) return { durum: "BOŞ" };
  const topicKey = String(r.topicKey || "");
  // 1) birebir havuz anahtarı
  const h = havuzTopic.get(topicKey);
  if (h) return { durum: "HAVUZ", hedef: h };
  // 2) birebir ağaç anahtarı (havuzu yok — ör. Paragraf)
  const a = agacTopic.get(topicKey);
  if (a) return { durum: "AĞAÇ", hedef: a };
  // 3) ad aynı, yazımı farklı → havuzda ara
  const ad = r.konu;
  const anahtar = sadeles(String(topicKey).split(" > ").slice(1).join(" > ") || ad);
  const baslikHavuz = havuzBaslik.get(ders + "|" + sadeles(ad)) || havuzBaslik.get(ders + "|" + anahtar);
  if (baslikHavuz) return { durum: "BAŞLIK FARKI", hedef: baslikHavuz, nerede: "havuz" };
  // 4) ad aynı, yazımı farklı → ağaçta ara
  const baslikAgac = agacBaslik.get(ders + "|" + sadeles(ad)) || agacBaslik.get(ders + "|" + anahtar);
  if (baslikAgac) return { durum: "BAŞLIK FARKI", hedef: baslikAgac, nerede: "ağaç" };
  return { durum: "YOK" };
}

/* ---------- 4) girdi -------------------------------------------- */
const arg = process.argv.slice(2);
const json = arg.includes("--json");
const dosya = arg.find(a => !a.startsWith("--")) || path.join(KOK, "docs", "uretim", "okulizyon-ornek-kazanimlar.json");
const ham = JSON.parse(fs.readFileSync(path.isAbsolute(dosya) ? dosya : path.join(KOK, dosya), "utf8"));
const cumleler = Array.isArray(ham) ? ham : ham.cumleler || [];

/* ---------- 5) koş ---------------------------------------------- */
const satirlar = [];
for (const c of cumleler) {
  if (!c || !c.kazanim) continue;
  const ders = c.ders || "";
  let r = null;
  try { r = sandbox.okzKonuBul(ders, c.kazanim); } catch (e) { r = null; }
  const s = cozumle(r, ders);
  satirlar.push({
    ders,
    kazanim: String(c.kazanim),
    konu: r && r.konu ? r.konu : "",
    topicKey: r && r.topicKey ? r.topicKey : "",
    kaynak: r && r.kaynak ? r.kaynak : "boş",
    kod: r && r.kod ? r.kod : "",
    durum: s.durum,
    hedefKonu: s.hedef ? s.hedef.konu : "",
    hedefId: s.hedef ? s.hedef.konu_id : "",
    nerede: s.nerede || ""
  });
}

const say = {};
satirlar.forEach(s => { say[s.durum] = (say[s.durum] || 0) + 1; });
const tam = (say.HAVUZ || 0);
const toplam = satirlar.length;

if (json) {
  process.stdout.write(JSON.stringify({ toplam, say, satirlar }, null, 1) + "\n");
} else {
  console.log("== OKULİZYON KAZANIM → UYGULAMA KONUSU DENETİMİ ==");
  console.log("girdi   : " + path.relative(KOK, path.isAbsolute(dosya) ? dosya : path.join(KOK, dosya)));
  console.log("cümle   : " + toplam);
  console.log("");
  console.log("  HAVUZ         (konu birebir havuzda, soru açılır) : " + tam);
  console.log("  AĞAÇ          (konu ağaçta var, havuzu yok)        : " + (say.AĞAÇ || 0));
  console.log("  BAŞLIK FARKI  (konu var ama adı farklı yazılmış)   : " + (say["BAŞLIK FARKI"] || 0));
  console.log("  YOK           (uygulamada böyle konu yok)          : " + (say.YOK || 0));
  console.log("  BOŞ           (hiçbir konuya bağlanmadı)           : " + (say.BOŞ || 0));
  console.log("");
  const konuda = tam + (say["AĞAÇ"] || 0);
  console.log("");
  console.log("  KONU EŞLEŞMESİ  : " + konuda + "/" + toplam +
    " (%" + (toplam ? Math.round(konuda / toplam * 1000) / 10 : 0) + ")  → kazanım uygulamanın bir konusuna bağlandı");
  console.log("  HAVUZ EŞLEŞMESİ : " + tam + "/" + toplam +
    " (%" + (toplam ? Math.round(tam / toplam * 1000) / 10 : 0) + ")  → o konunun soru havuzu var");

  const sorunlu = satirlar.filter(s => s.durum !== "HAVUZ");
  if (sorunlu.length) {
    console.log("\n--- TAM EŞLEŞMEYENLER ---");
    sorunlu.forEach(s => {
      console.log("  [" + s.durum + "] " + s.ders + " | " + s.kazanim.slice(0, 62));
      console.log("        okzKonuBul → " + (s.konu || "—") + "  [" + s.kaynak + (s.kod ? " " + s.kod : "") + "]");
      if (s.hedefKonu) console.log("        uygulamada → " + s.hedefKonu + "  (" + s.hedefId + ", " + s.nerede + ")");
    });
  }
  console.log("\n--- TAM EŞLEŞENLER (kaynak dağılımı) ---");
  const ks = {};
  satirlar.filter(s => s.durum === "HAVUZ").forEach(s => { ks[s.kaynak] = (ks[s.kaynak] || 0) + 1; });
  console.log("  " + Object.keys(ks).sort().map(k => k + " " + ks[k]).join(" · ") || "  (yok)");
}

process.exitCode = (say.YOK || say.BOŞ || say["BAŞLIK FARKI"]) ? 1 : 0;
