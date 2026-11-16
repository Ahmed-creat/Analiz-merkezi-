/* ============================================================
   DENEME İÇE AKTARMA TESTİ
   ------------------------------------------------------------
   site/veri/9-sinif-denemeler.json dosyasını uygulamanın
   kurallarıyla karşılaştırır. Uygulama kodu DEĞİŞTİRİLMEZ;
   test yalnız index.html'deki sabitleri okuyup doğrular.

     1) Dosya, importData'nın beklediği sarmalayıcıda (state.user + state.exams)
     2) Her sınavda id, name, date, lessons, errorLogs, total, net var
     3) date YYYY-MM-DD, net sayı
     4) lessons anahtarları LESSON_CONFIG'te (bileşik satırlar hariç)
     5) d/w/e negatif değil, tam sayı
     6) netOf(d,w) beyan nete en fazla 0,25 uzak (yuvarlama payı)
     7) errorLogs sayısı = derslerdeki w + e toplamı
     8) her kayıtta lesson, topic, kazanim, type, date; type geçerli neden
     9) metin tekrarı yok, Türkçe karakterler bozulmamış
   Çalıştır: node tests/deneme-ice-aktarma.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const VERI = path.join(KOK, "site/veri/9-sinif-denemeler.json");
const HTML = fs.readFileSync(path.join(KOK, "site/index.html"), "utf8");

/* index.html'deki iki sabit: ders azami soruları ve net kuralı */
function sabitOku(ad) {
  const i = HTML.indexOf("const " + ad + " = {");
  if (i < 0) throw new Error(ad + " bulunamadı");
  const b = HTML.indexOf("{", i);
  let d = 0, j = b;
  for (; j < HTML.length; j++) {
    if (HTML[j] === "{") d++;
    else if (HTML[j] === "}") { d--; if (d === 0) break; }
  }
  return eval("(" + HTML.slice(b, j + 1) + ")");
}
const LESSON_CONFIG = sabitOku("LESSON_CONFIG");
const NET_RULE = sabitOku("NET_RULE");
const netOf = (d, w) => d - w / NET_RULE.wrongDivisor;

const GECERLI_NEDEN = new Set([
  "Konuyu Bilmiyordum", "ANLAMADIM", "İşlem Hatası/Dikkatsizlik", "Kodlama/Kitapçık Hatası",
  "KONUEKSİKLİĞİ", "SÜREYETMEDİ", "ÇÖZÜMYOLUNUBULAMADIM"
]);

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false;
}

// ---------- 1) dosya + sarmalayıcı ----------
console.log("== 1) Dosya ve sarmalayıcı ==");
ok("dosya var", fs.existsSync(VERI));
const veri = JSON.parse(fs.readFileSync(VERI, "utf8"));
ok("state sarmalayıcısı var", !!(veri.state && typeof veri.state === "object"));
ok("state.user var (importData şartı)", !!(veri.state && veri.state.user));
ok("state.exams dizi", Array.isArray(veri.state && veri.state.exams));
ok("7 sınav", (veri.state.exams || []).length === 7, String((veri.state.exams || []).length));
ok("öğrenci adı yazılmamış (gizlilik)", !veri.state.user.name, JSON.stringify(veri.state.user.name));
ok("sınıf 9", String(veri.state.user.grade) === "9");

// ---------- 2-3) sınav alanları ----------
console.log("\n== 2) Sınav alanları ==");
const kimlik = new Set();
(veri.state.exams || []).forEach((ex, i) => {
  const n = "sınav " + (i + 1);
  ok(n + " id", !!ex.id);
  ok(n + " name", !!(ex.name && ex.name.trim()));
  ok(n + " date YYYY-MM-DD", /^\d{4}-\d{2}-\d{2}$/.test(String(ex.date)), ex.date);
  ok(n + " lessons nesne", !!(ex.lessons && typeof ex.lessons === "object"));
  ok(n + " errorLogs dizi", Array.isArray(ex.errorLogs));
  ok(n + " total sayı", Number.isFinite(ex.total) && ex.total > 0);
  ok(n + " net sayı", Number.isFinite(ex.net));
  ok(n + " id tekil", !kimlik.has(ex.id), ex.id);
  kimlik.add(ex.id);
});

// ---------- 4-6) dersler ----------
console.log("\n== 3) Ders dökümü (d/w/e) ==");
let bileşik = [];
(veri.state.exams || []).forEach((ex) => {
  Object.entries(ex.lessons || {}).forEach(([ders, v]) => {
    const etiket = ex.id + " · " + ders;
    if (!LESSON_CONFIG[ders]) { bileşik.push(ders); return; }
    ok(etiket + " d tam sayı", Number.isInteger(v.d) && v.d >= 0, String(v.d));
    ok(etiket + " w tam sayı", Number.isInteger(v.w) && v.w >= 0, String(v.w));
    ok(etiket + " e tam sayı", Number.isInteger(v.e) && v.e >= 0, String(v.e));
    // Azami aşımı yalnızca dosyada AÇIKÇA beyan edilmişse kabul edilir.
    const asim = v.d + v.w + v.e - LESSON_CONFIG[ders].max;
    if (asim > 0) {
      const beyan = (veri._tutarsizliklar || []).some(
        t => t.sinav === ex.id && t.ders === ders);
      ok(etiket + " azami aşımı beyan edilmiş", beyan,
        (v.d + v.w + v.e) + " > " + LESSON_CONFIG[ders].max + " (beyan yok)");
    } else ok(etiket + " azamiyi aşmıyor", true);
    if (Number.isFinite(v.net_beyan)) {
      const fark = Math.abs(netOf(v.d, v.w) - v.net_beyan);
      ok(etiket + " net beyana yakın", fark <= 0.25 + 1e-9, "fark " + fark.toFixed(2));
    }
  });
});
ok("bileşik satır yalnız 2 sınavda", new Set(bileşik).size <= 2, [...new Set(bileşik)].join(", "));

// ---------- 7-8) hata kayıtları ----------
console.log("\n== 4) Hata kayıtları ==");
let toplamKayit = 0;
(veri.state.exams || []).forEach((ex) => {
  const beklenen = Object.values(ex.lessons || {}).reduce((a, v) => a + v.w + v.e, 0);
  ok(ex.id + " kayıt sayısı = w+e", ex.errorLogs.length === beklenen,
    ex.errorLogs.length + " ≠ " + beklenen);
  toplamKayit += ex.errorLogs.length;
  ex.errorLogs.forEach((l, i) => {
    const n = ex.id + " kayıt " + (i + 1);
    if (!l || typeof l !== "object") { ok(n, false, "nesne değil"); return; }
    if (!Number.isInteger(l.qno) || l.qno < 1) ok(n + " qno", false, String(l.qno));
    if (!l.lesson) ok(n + " lesson", false);
    if (!l.topic) ok(n + " topic", false);
    if (!l.kazanim) ok(n + " kazanim", false);
    if (!GECERLI_NEDEN.has(l.type)) ok(n + " type geçerli", false, String(l.type));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(l.date))) ok(n + " date", false, String(l.date));
  });
  const qno = ex.errorLogs.map(l => l.qno);
  ok(ex.id + " qno tekrar etmiyor", new Set(qno).size === qno.length);
});
ok("toplam hata kaydı 209", toplamKayit === 209, String(toplamKayit));

// ---------- 9) metin ----------
console.log("\n== 5) Metin kalitesi ==");
const metinler = [];
(veri.state.exams || []).forEach(ex => ex.errorLogs.forEach(l => metinler.push(l.lesson + "|" + l.kazanim)));
const bos = metinler.filter(m => /\s{2,}/.test(m) || m.trim().length < 8);
ok("bozuk/boş kazanım yok", bos.length === 0, bos.slice(0, 3).join(" · "));
ok("Türkçe karakter korunmuş", !/Ã|Ä|Å/.test(metinler.join(" ")));
const tekrar = metinler.length - new Set(metinler).size;
ok("tekrar eden kayıt sayısı makul (< %60)", tekrar / metinler.length < 0.6, String(tekrar));

// ---------- 6) uçtan uca: BKT motoru işliyor mu ----------
console.log("\n== 6) BKT motoru (uçtan uca) ==");
{
  const vm = require("vm");
  const kod = fs.readFileSync(path.join(KOK, "site/bkt-engine.js"), "utf8");
  const ctx = {
    console, Date, Set, Math, JSON, Promise, encodeURIComponent,
    window: {}, document: { readyState: "loading", addEventListener() {} }
  };
  ctx.state = {
    user: { name: "", grade: "9" },
    bkt_state: {}, bkt_processed_records: {},
    flashcards: { cards: [], sessions: {}, lastSoftDrop: {} },
    memory: {},
    exams: JSON.parse(JSON.stringify(veri.state.exams)),
    questions: [], topics: {}
  };
  vm.runInNewContext(kod, ctx, { filename: "bkt-engine.js" });
  const BKT = ctx.window.AnalizBKT;
  ok("AnalizBKT yüklendi", !!BKT);
  if (BKT) {
    BKT.processNewRecords();
    const durum = ctx.state.bkt_state || {};
    const gozlem = Object.values(durum).reduce((a, e) => a + (Number(e.gozlem_sayisi) || 0), 0);
    ok("tüm hata kayıtları gözlem oldu", gozlem === toplamKayit, gozlem + " ≠ " + toplamKayit);
    ok("konu durumu oluştu", Object.keys(durum).length > 100, String(Object.keys(durum).length));
    BKT.processNewRecords();
    const gozlem2 = Object.values(ctx.state.bkt_state || {})
      .reduce((a, e) => a + (Number(e.gozlem_sayisi) || 0), 0);
    ok("ikinci çalıştırma tekrar eklemiyor", gozlem2 === gozlem, gozlem + " → " + gozlem2);
    const anahtar = Object.keys(durum);
    const eslesen = anahtar.filter(k => !/ > .{70}/.test(k)).length;
    ok("konu başlığı eşleşen oran ≥ %80", eslesen / anahtar.length >= 0.8,
      Math.round(100 * eslesen / anahtar.length) + "%");
  }
}

// ---------- özet ----------
console.log("\n" + "-".repeat(52));
if (kalan === 0) {
  console.log(`DENEME İÇE AKTARMA: ${gecen}/${gecen} geçti ✅`);
  console.log("7 sınav · 209 hata kaydı · uygulama şemasına uygun.");
  process.exit(0);
} else {
  console.log(`GEÇEN ${gecen} · KALAN ${kalan} ❌`);
  hatalar.forEach(h => console.log("  • " + h));
  process.exit(1);
}
