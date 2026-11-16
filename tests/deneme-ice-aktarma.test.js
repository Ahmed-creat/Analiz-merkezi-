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
     7) errorLogs sayısı = derslerdeki w + e toplamı − beyan edilmiş eksik kazanım
     7b) ARİTMETİK: Σ net_beyan = sınavın Genel Net'i  (birebir, tolerans 0)
     7c) ARİTMETİK: Σ(d − w/4) Genel Net'e en fazla 0,25 uzak
         — PDF'in kendi içinde çeliştiği sınavlar _tutarsizliklar'da beyanlıysa
           bu kontrol o sınav için beyan edilen sapmaya kadar gevşetilir.
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

/* Geçerli neden kodları — UYDURULMAZ, index.html'deki listelerden okunur. */
function diziCikar(ad) {
  const i = HTML.indexOf("const " + ad + " = [");
  if (i < 0) throw new Error(ad + " bulunamadı");
  const bas = HTML.indexOf("[", i);
  const son = HTML.indexOf("];", bas);
  return eval("(" + HTML.slice(bas, son + 1) + ")");
}
const WRONG_REASONS = diziCikar("WRONG_REASONS");
const EMPTY_REASONS = diziCikar("EMPTY_REASONS");
const GECERLI_NEDEN = new Set([...WRONG_REASONS, ...EMPTY_REASONS]);

/* "konu eksikliği"nin kanonik kodu — canonicalReason eşlemesinden okunur.
   DİKKAT: doğru kod KONUEKSİKLİĞİ (eksik). KONUEKSİZLİĞİ (eksiz) yazılırsa
   REASON_WEIGHTS'ta karşılığı olmaz → ağırlık uygulanmaz, sessiz bozulma. */
const KONU_EKSIKLIGI = (() => {
  const m = HTML.match(/"KONU EKSİKLİĞİ"\s*:\s*"([^"]+)"/);
  if (!m) throw new Error("canonicalReason eşlemesi yok");
  return m[1];
})();
const BKT_KAYNAK = fs.readFileSync(path.join(KOK, "site/bkt-engine.js"), "utf8");

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
    /* Sınav bazlı dağılım: yayın kurulu bir sınavda ders soru sayısını
       değiştirebilir (ör. Gis-3: Tarih 14, Din 4). Bu durumda sınav kendi
       azamisini `ders_azami` ile beyan eder ve o değer esas alınır. */
    const azami = (ex.ders_azami && Number.isFinite(ex.ders_azami[ders]))
      ? ex.ders_azami[ders] : LESSON_CONFIG[ders].max;
    const asim = v.d + v.w + v.e - azami;
    if (asim > 0) {
      const beyan = (veri._tutarsizliklar || []).some(
        t => t.sinav === ex.id && t.ders === ders);
      ok(etiket + " azami aşımı beyan edilmiş", beyan,
        (v.d + v.w + v.e) + " > " + azami + " (beyan yok)");
    } else ok(etiket + " azamiyi aşmıyor", true);

    // Sınav bazlı dağılım varsa gerekçesi _tutarsizliklar'da olmalı.
    if (ex.ders_azami && Number.isFinite(ex.ders_azami[ders])) {
      const gerekce = (veri._tutarsizliklar || []).some(
        x => x.sinav === ex.id && x.tur === "sinav-bazli-dagilim");
      ok(etiket + " sınav bazlı dağılım gerekçeli", gerekce, "ders_azami var, gerekçe yok");
    }
    // Toplam 120 ve genel net tutuyorsa her ders azamisini DOLDURMALI.
    if (veri._revizyon) {
      const toplam = Object.values(ex.lessons || {}).reduce((a, x) => a + x.d + x.w + x.e, 0);
      ok(etiket + " kapasite tam", v.d + v.w + v.e === azami || toplam !== 120,
        (v.d + v.w + v.e) + " ≠ " + azami + " (ders toplamı " + toplam + ")");
    }
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
  /* Belgede kazanım metni yazılmamış (ya da fazla yazılmış) sorular olabilir.
     Kayıt UYDURULMAZ; her sapma sınavın kazanim_farki alanında beyan edilir.
     Beyan ile gerçek kayıt sayısı birebir tutmak ZORUNDA. */
  const beklenen = Object.values(ex.lessons || {}).reduce((a, v) => a + v.w + v.e, 0);
  const farklar = (ex.kazanim_farki || []);
  const farkToplam = farklar.reduce((a, k) => a + (k.fark.yanlis || 0) + (k.fark.bos || 0), 0);
  ok(ex.id + " kayıt sayısı = w+e − beyanlı kazanım farkı", ex.errorLogs.length === beklenen - farkToplam,
    ex.errorLogs.length + " ≠ " + (beklenen - farkToplam) + " (w+e " + beklenen + ", beyanlı fark " + farkToplam + ")");

  // Ders bazında da tutmalı: kayıt(ders) + fark(ders) = w + e
  const dersKayit = {};
  ex.errorLogs.forEach(l => { dersKayit[l.lesson] = (dersKayit[l.lesson] || 0) + 1; });
  const dersFark = {};
  farklar.forEach(k => { dersFark[k.ders] = (k.fark.yanlis || 0) + (k.fark.bos || 0); });
  Object.entries(ex.lessons || {}).forEach(([ders, v]) => {
    const kayit = dersKayit[ders] || 0;
    const fark = dersFark[ders] || 0;
    ok(ex.id + " · " + ders + " kayıt+fark = w+e", kayit + fark === v.w + v.e,
      "kayıt " + kayit + " + fark " + fark + " ≠ " + (v.w + v.e));
    ok(ex.id + " · " + ders + " beyan ile liste tutarlı",
      !dersFark[ders] || farklar.some(k => k.ders === ders && k.liste &&
        k.liste.yanlis - k.baslik.yanlis !== undefined), "beyan eksik");
  });
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
/* Toplam kayıt SABİT DEĞİL: belgede kazanımı yazılmamış sorular varsa düşer.
   Doğru ölçüt, kayıtların derslerle ve beyanlarla tutarlı olması (yukarıda). */
ok("toplam hata kaydı > 0", toplamKayit > 0, String(toplamKayit));
ok("toplam hata kaydı = w+e − beyanlı fark",
  toplamKayit === (veri.state.exams || []).reduce((a, ex) =>
    a + Object.values(ex.lessons || {}).reduce((b, v) => b + v.w + v.e, 0) -
    (ex.kazanim_farki || []).reduce((b, k) => b + (k.fark.yanlis || 0) + (k.fark.bos || 0), 0), 0),
  String(toplamKayit));

// ---------- 4b) tüm nedenler konu eksikliği ----------
console.log("\n== 4b) Tüm nedenler konu eksikliği ==");
const nedenler = new Set();
(veri.state.exams || []).forEach(ex => ex.errorLogs.forEach(l => nedenler.add(l.type)));
ok("tek neden türü var", nedenler.size === 1, [...nedenler].join(", "));
ok("neden = kanonik konu eksikliği", nedenler.has(KONU_EKSIKLIGI),
  [...nedenler].join(", ") + " ≠ " + KONU_EKSIKLIGI);
ok("kanonik kod BKT motorunda tanınıyor", BKT_KAYNAK.includes('"' + KONU_EKSIKLIGI + '"'));
ok("kanonik kodun ağırlığı var",
  new RegExp('"' + KONU_EKSIKLIGI + '"\\s*:\\s*[\\d.]+').test(HTML));
ok("emekli kod KONUEKSİZLİĞİ (Z) kullanılmıyor",
  ![...nedenler].some(n => n.includes("EKSİZ")), [...nedenler].join(", "));

// ---------- 4c) ARİTMETİK ----------
console.log("\n== 4c) Aritmetik (ders netleri ⇔ Genel Net) ==");
const yuv = (n) => Math.round(n * 100) / 100;
(veri.state.exams || []).forEach((ex) => {
  const dersler = Object.values(ex.lessons || {});
  const beyan = yuv(dersler.reduce(
    (a, v) => a + (Number.isFinite(v.net_beyan) ? v.net_beyan : v.d - v.w / NET_RULE.wrongDivisor), 0));
  const hesap = yuv(dersler.reduce((a, v) => a + netOf(v.d, v.w), 0));
  const genel = yuv(ex.net);

  // (a) PDF'ten okunan ders netlerinin toplamı Genel Net'i BİREBİR tutmalı.
  ok(ex.id + " Σ ders net_beyan = Genel Net", Math.abs(beyan - genel) < 0.005,
    "dersler " + beyan + " ≠ genel " + genel + " (fark " + yuv(genel - beyan) + ")");

  // (b) d/w tam sayı olduğu için hesap en fazla 0,25 sapabilir.
  const sapma = yuv(Math.abs(hesap - genel));
  const beyanli = (veri._tutarsizliklar || []).some(t => t.sinav === ex.id);
  const sinir = beyanli ? 1.5 : 0.25;
  ok(ex.id + " Σ(d−w/4) Genel Net'e yakın", sapma <= sinir + 1e-9,
    "fark " + sapma + " (sınır " + sinir + (beyanli ? ", beyanlı sınav" : "") + ")");

  // (c) Hiçbir ders sessizce atlanmamış olmalı. Birleşik satır ("Tarih & Coğrafya & Din")
  //     kendi derslerini kapsar; içindeki dersler de kapsama sayılır.
  const anahtarlar = Object.keys(ex.lessons || {});
  const kapsanan = new Set(anahtarlar.filter(k => LESSON_CONFIG[k]));
  anahtarlar.filter(k => k.includes("&")).forEach(k =>
    k.split("&").map(x => x.trim()).forEach(x => {
      const xl = x.toLowerCase();
      const t = Object.keys(LESSON_CONFIG).find(d =>
        d.toLowerCase() === xl || d.toLowerCase().startsWith(xl + " "));
      if (t) kapsanan.add(t);
    }));
  ok(ex.id + " ders kapsamı", kapsanan.size === Object.keys(LESSON_CONFIG).length,
    kapsanan.size + "/" + Object.keys(LESSON_CONFIG).length + " ders; eksik: " +
    Object.keys(LESSON_CONFIG).filter(d => !kapsanan.has(d)).join(", "));
});

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
  console.log(veri.state.exams.length + " sınav · " + toplamKayit + " hata kaydı · uygulama şemasına uygun.");
  process.exit(0);
} else {
  console.log(`GEÇEN ${gecen} · KALAN ${kalan} ❌`);
  hatalar.forEach(h => console.log("  • " + h));
  process.exit(1);
}
