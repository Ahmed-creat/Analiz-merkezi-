#!/usr/bin/env node
/* ============================================================
   BİRLEŞİK KART TESTİ — tests/birlesik-kart.test.js
   ------------------------------------------------------------
   Kullanıcı (v35.8): "Konu takibindeki öğrenme durumu ile hafıza
   gücü bölümünü birleştir — her iki bölümde de hafıza gücünü
   gösteriyor."

   Neyi KANITLIYOR? (metin aramak değil, kartı GERÇEKTEN üretmek)
     1) Tek kart: "Öğrenme Durumu · Hafıza Gücü" (id=bkt-birlesik-kart)
     2) Aynı konu TEK satırda: BKT durumu + yeterlilik + hafıza barı
     3) Tekrar aksiyonları korunuyor (Tekrar Ettim / Erken Tekrar / Sıfırla)
     4) Kısa Kontrol düğmesi kartın içinde (havuzu olan konularda)
     5) Yalnız BKT kaydı olan konu da listeleniyor
     6) Ayrı BKT paneli artık çizilmiyor

   Çalıştır: node tests/birlesik-kart.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const ENGINE = fs.readFileSync(path.join(KOK, "site", "bkt-engine.js"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) { gecen++; return true; } kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false; }

// ---------- 1) Kartın HTML'ini gerçek kodla üret ----------
// v39 — SÖZLEŞME DEĞİŞTİ. Kullanıcı: "hafıza gücünde bar konu ayrı bento grid
// kart olsun", "yeterlilik sadece yüzde olarak yaz", "sadece hafıza için yüzde
// çubuğu kullan", "neden iki tane flashcard düğmesi var", "neden hem flashcard
// hem 5 soru orda". Bu yüzden test artık şunları kanıtlar:
//   • her konu KENDİ bento kartında (konu-grid içinde konu-kart)
//   • çubuk YALNIZ hafıza; yeterlilik sadece "%N" metni
//   • konu kartında TEK flashcard düğmesi; 5 soru düğmesi YOK
const bas = HTML.indexOf("  // ===== ÖĞRENME DURUMU · HAFIZA GÜCÜ (v39");
const son = HTML.indexOf('  container.innerHTML = html;', bas);
ok("hafıza bölümü kodu bulundu", bas > 0 && son > bas);
let blok = HTML.slice(bas, son);

const icon = (n) => "[" + n + "]";
const esc = (x) => String(x == null ? "" : x);
const attr = (x) => esc(x);
const memoryColor = (p) => (p < 20 ? "#EF4444" : p < 40 ? "#F59E0B" : "#16A34A");
const fmtDate = (d) => String(d);
const splitKey = (k) => { const i = String(k).indexOf(" > "); return { lesson: String(k).slice(0, i), topic: String(k).slice(i + 3) }; };
const MEMORY_CRITICAL = 20, MEMORY_WARNING = 40;
let hafizaKartToplam = 0;

// v36 — kart gerçek `kartDurumHizli()` fonksiyonunu kullanıyor.
const kdhBas = HTML.indexOf("function kartDurumHizli");
const kdhSon = HTML.indexOf("\n}", HTML.indexOf("return { sayi: sayi, tamam:", kdhBas)) + 2;
ok("kartDurumHizli bulundu", kdhBas > 0 && kdhSon > kdhBas);
const kartDurumHizliUret = kdhBas > 0
  ? new Function("state", "todayStr", "return (" + HTML.slice(kdhBas, kdhSon) + ")")
  : () => (() => ({ sayi: 0, tamam: false }));
const BUGUN = "2026-10-29";

function kart(ms, bkt, limit, st) {
  const durum = st || { flashcards: { cards: [] }, tekrarKartlari: {} };
  const kdh = kartDurumHizliUret(durum, () => BUGUN);
  const kartDurumHizli = k => kdh(k);
  const window = { AnalizBKT: { konuDurumlari: () => bkt } };
  const fn = new Function("html", "ms", "memoryLimit", "window", "icon", "esc", "attr",
    "memoryColor", "fmtDate", "splitKey", "MEMORY_CRITICAL", "MEMORY_WARNING",
    "state", "todayStr", "kartDurumHizli", "hafizaKartToplam",
    "return (function(){\n" + blok + "\nreturn html; })();");
  return fn("", ms, limit || 10, window, icon, esc, attr, memoryColor, fmtDate, splitKey,
    MEMORY_CRITICAL, MEMORY_WARNING, durum, () => BUGUN, kartDurumHizli, hafizaKartToplam);
}

const MS = {
  rows: [
    { key: "Matematik > 1.1 Trigonometri", lesson: "Matematik", topic: "1.1 Trigonometri", pct: 12, reviews: 2, due: true, next: { date: "2026-11-01", day: 3 } },
    { key: "Fizik > 1.1 Sabit Hızlı Hareket", lesson: "Fizik", topic: "1.1 Sabit Hızlı Hareket", pct: 95, reviews: 5, due: false, next: null }
  ],
  waiting: 1, avg: 53, critical: 1
};
const BKT = {
  "Matematik > 1.1 Trigonometri": { key: "Matematik > 1.1 Trigonometri", durum: "Gelişiyor", onayli: false, yeterlilik: 62, gozlem: 7, poolId: "mat_10_u01_k01", precheck: true, ogrenmeTesti: false, odak: "iç açıortay", kok: "Matematik > 1.0 Temel" },
  "Biyoloji > 2.2 Hücre": { key: "Biyoloji > 2.2 Hücre", durum: "Veri yetersiz", onayli: false, yeterlilik: null, gozlem: 2, poolId: null, precheck: false, ogrenmeTesti: false, odak: "", kok: "" }
};
const cikti = kart(MS, BKT);

console.log("\n== 1) Başlık + her konu kendi bento kartında ==");
ok("başlık kartı var (hafiza-baslik-kart)", cikti.indexOf('id="hafiza-baslik-kart"') >= 0);
ok("başlık: Öğrenme Durumu · Hafıza Gücü", cikti.indexOf("Öğrenme Durumu · Hafıza Gücü") >= 0);
ok("konular bento ızgarasında", cikti.indexOf('class="konu-grid"') >= 0);
ok("her konu ayrı konu-kart", (cikti.match(/class="konu-kart"/g) || []).length === 3,
   String((cikti.match(/class="konu-kart"/g) || []).length));
ok("aynı konu iki kez basılmıyor", (cikti.match(/konu-kart-ad[^>]*>.*?1\.1 Trigonometri/g) || []).length === 1);
ok("BKT durumu kartın içinde", cikti.indexOf("Gelişiyor") >= 0);

console.log("\n== 2) Yalnız HAFIZA çubuğu, yeterlilik % metni ==");
ok("hafıza çubuğu var (%12)", /konu-metre-etiket">Hafıza</.test(cikti) && cikti.indexOf("%12") >= 0);
ok("yeterlilik ÇUBUĞU YOK", cikti.indexOf("konu-metre-etiket\">Yeterlilik<") < 0);
ok("yeterlilik yüzde metni var (%62)", /Yeterlilik: <b>%62<\/b>/.test(cikti));
ok("ikinci çubuk yok (tek konu-metre-bar / konu)", (cikti.match(/konu-metre-bar/g) || []).length === 3,
   String((cikti.match(/konu-metre-bar/g) || []).length));

console.log("\n== 3) 5 soru düğmesi konu kartında YOK ==");
ok("5 soruluk test düğmesi konu kartında YOK", cikti.indexOf("data-bkt-test") < 0);
ok("tekrar aksiyonu (reviewTopic)", cikti.indexOf('data-act="reviewTopic"') >= 0);

console.log("\n== 3b) v37/v39 — kart bitince düğme durumu ==");
{
  const st = {
    flashcards: { cards: [
      { id: "s1", topicKey: "Matematik > 1.1 Trigonometri", front: "ö1", back: "a1" },
      { id: "s2", topicKey: "Matematik > 1.1 Trigonometri", front: "ö2", back: "a2" },
      { id: "s3", topicKey: "Matematik > 1.1 Trigonometri", front: "ö3", back: "a3" }
    ] },
    tekrarKartlari: {}
  };
  const c = kart(MS, BKT, 10, st);
  // v39 — eskiden aynı konuda İKİ flashcard düğmesi vardı
  // ("Kartları Bitir (3)" + "Kart · 3"). Artık TEK düğme var.
  ok("flashcard düğmesi TEK (data-act=kartBasla sayısı 1)",
     (c.match(/data-act="kartBasla"/g) || []).length === 1,
     String((c.match(/data-act="kartBasla"/g) || []).length));
  ok("kart sayısı yazıldı (Kart · 3)", c.indexOf("Kart · 3") >= 0);
  ok("kart zorunlu notu", c.indexOf("kart zorunlu") >= 0);
  ok("5 soru düğmesi yine YOK", c.indexOf("data-bkt-test") < 0);
  ok("ders ayracı KALDIRILDI", c.indexOf("ders-ayrac") < 0);
  const st2 = JSON.parse(JSON.stringify(st));
  st2.tekrarKartlari["Matematik > 1.1 Trigonometri"] = { bildi: 3, bilemedi: 0, tamamlandi: BUGUN };
  const c2 = kart(MS, BKT, 10, st2);
  ok("tamamlanınca kart işareti ✓", c2.indexOf("Kart · 3 ✓") >= 0);
  ok("tamamlanınca tekrar düğmesi geri gelir", c2.indexOf('data-act="reviewTopic"') >= 0);
}

console.log("\n== 3c) Daha fazla göster sayacı ==");
{
  const cok = { rows: [] , waiting: 0, avg: 0, critical: 0 };
  for (let i = 0; i < 9; i++) cok.rows.push({ key: "Matematik > K" + i, lesson: "Matematik", topic: "K" + i, pct: 50, reviews: 1, due: false, next: null });
  const c = kart(cok, {}, 6);
  ok("6 kart çizildi, 3 konu daha kaldı", c.indexOf("Daha Fazla Göster (3 konu daha)") >= 0);
}

console.log("\n== 4) Ayrı BKT paneli çizilmiyor ==");
ok("motor birleşik kartı tanıyor", ENGINE.indexOf('getElementById("bkt-birlesik-kart")') > 0);
ok("eski panel temizleniyor", /bkt-birlesik-kart[\s\S]{0,220}bkt-learning-panel/.test(ENGINE));
ok("konuDurum API'si dışa açık", ENGINE.indexOf("konuDurum: function (key)") > 0);

console.log("\n" + "─".repeat(56));
if (kalan) { hatalar.forEach(h => console.log(" ✗ " + h)); console.log("Birleşik kart testi — " + gecen + "/" + (gecen + kalan) + " geçti"); process.exit(1); }
console.log("Birleşik kart testi — " + gecen + "/" + gecen + " geçti ✓");
