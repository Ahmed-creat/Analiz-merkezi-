/* ============================================================
   v126 — GÖREV LİSTESİ = BİLDİRİMİN GÖREVLERİ (gerçek DOM)
   tests/dom/dom-v126-gorev-bildirim.test.js
   ------------------------------------------------------------
   KULLANICI: "Görevlerde bildirim geliyor ya bunun görevleri diye
   onlar yer alacak."
   Ölçülen (site/index.html GERÇEK olarak yüklenir, satır içi betik
   olduğu gibi koşturulur, sahte veri gerçek `state`e yazılır):
     1) Bildirimdeki üç sayı (görev · tekrar · acil) ile görev
        listesindeki satırlar BİREBİR aynı.
     2) Çift sayım yok: gorev + tekrar + acil = listedeki iş sayısı.
     3) Acil konu listesi kırpılmıyor (8 acil → 8 satır).
     4) Her tekrar/acil konusu KENDİ satırında, konu adıyla.
     5) Ekranda ders veren açıklama paragrafı YOK.
   ============================================================ */
"use strict";
const fs = require("fs"), path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");
const KOK = path.join(__dirname, "..", "..");
const html = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");

const dom = new JSDOM(html, {
  url: "https://analiz-merkezi.vercel.app/",
  virtualConsole: new VirtualConsole(),
  runScripts: "outside-only"
});
const { window } = dom;
const bloklar = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); return true; }
  kalan++; hatalar.push(ad + (ek ? " → " + ek : ""));
  console.log("  ✗ " + ad + (ek ? " → " + ek : ""));
  return false;
}

try {
  window.eval(bloklar[0]);
  /* `let state` blok kapsamında: kurulum AYNI eval içinde yapılmalı,
     aksi hâlde window.state kopyası boş kalır. */
  window.eval(bloklar[1] + `
;window.__v126Kur = function () {
  const g = "2026-10-20";                       // geçmiş gün → tekrar günü gelmiş
  state.user = { name: "A", grade: "10" };
  state.settings = state.settings || {}; state.settings.okz = {};
  state.topics = {}; state.questions = []; state.notifications = [];
  state.dailyTasks = { study: false, read: false, solve: false, date: null };
  state.memory = {};
  for (let i = 1; i <= 6; i++) {
    state.memory["Matematik > Konu " + i] = { completedAt: g, reviewCount: 1, schedule: { "1": g } };
  }
  state.exams = [{ date: g, lessons: {}, errorLogs:
    Array.from({ length: 8 }, (_, i) => ({ lesson: "Fizik", topic: "Acil " + i, type: "Konuyu Bilmiyordum", date: g })) }];
};`);
  window.__v126Kur();

  console.log("== 1) Bildirim sayıları = listedeki işler ==");
  const liste = window.gunlukGorevler();
  const b = window.bekleyenIsler();
  const tekrarSatir = liste.filter(x => x.tur === "tekrar").length;
  const acilSatir = liste.filter(x => /^Acil: /.test(x.baslik)).length;
  const digerSatir = liste.length - tekrarSatir - acilSatir;

  ok("liste üretildi", liste.length > 0, "satır: " + liste.length);
  ok("tekrar sayısı listedeki tekrar satırı sayısına EŞİT", b.tekrar === tekrarSatir, b.tekrar + " vs " + tekrarSatir);
  ok("acil sayısı listedeki acil satırı sayısına EŞİT", b.acil === acilSatir, b.acil + " vs " + acilSatir);
  ok("görev sayısı kalan satırlara EŞİT", b.gorev === digerSatir, b.gorev + " vs " + digerSatir);
  ok("üç sayının toplamı = listedeki iş sayısı (çift sayım yok)", b.toplam === liste.length, b.toplam + " vs " + liste.length);

  console.log("\n== 2) Konu konu satırlar ==");
  ok("8 acil konu KIRPILMADAN 8 satır", acilSatir === 8, "acil satır: " + acilSatir);
  ok("6 tekrar konusu ayrı ayrı satır", tekrarSatir === 6, "tekrar satır: " + tekrarSatir);
  ok("her tekrar satırı konu adıyla", liste.filter(x => x.tur === "tekrar").every(x => /^Tekrar: Konu \d$/.test(x.baslik)),
    JSON.stringify(liste.filter(x => x.tur === "tekrar").map(x => x.baslik).slice(0, 3)));
  ok("her acil satırı konu adıyla", liste.filter(x => /^Acil: /.test(x.baslik)).every(x => /^Acil: Acil \d$/.test(x.baslik)),
    JSON.stringify(liste.filter(x => /^Acil: /.test(x.baslik)).map(x => x.baslik).slice(0, 3)));
  ok("satır kimlikleri tek (id çakışması yok)",
    new Set(liste.map(x => x.id)).size === liste.length);

  console.log("\n== 3) Ekranda ders veren cümle yok ==");
  ok("'Değişen kısım / sabit kalan kısım' paragrafı YOK", !/Değişen kısım/.test(html) && !/Sabit kalan kısım/.test(html));
  ok("'günün işi · çekirdek' rozeti YOK", !/günün işi/.test(html) && !/cekirdekKalan/.test(html));
  ok("'Neden değişiyor?' başlığı YOK", !/Neden değişiyor\?/.test(html));
} catch (e) {
  kalan++; hatalar.push("koşum hatası: " + (e && (e.stack || e.message)));
  console.log("  ✗ koşum hatası → " + (e && (e.stack || e.message)));
}

window.close();
console.log("\n──────────────────────────────────────────────────────────");
console.log(kalan === 0
  ? "v126 görev listesi/bildirim — " + gecen + "/" + gecen + " geçti ✓"
  : "v126 görev listesi/bildirim — " + gecen + " geçti, " + kalan + " kaldı ✗\n  - " + hatalar.join("\n  - "));
process.exit(kalan === 0 ? 0 : 1);
