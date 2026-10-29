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
const bas = HTML.indexOf("  // ===== ÖĞRENME DURUMU · HAFIZA GÜCÜ (TEK KART, v35.9 — SADE) =====");
const son = HTML.indexOf('  html += "</div>";\n\n  container.innerHTML = html;', bas);
ok("birleşik kart kodu bulundu", bas > 0 && son > bas);
const blok = HTML.slice(bas, son + '  html += "</div>";'.length);

const icon = (n) => "[" + n + "]";
const esc = (x) => String(x == null ? "" : x);
const attr = (x) => esc(x);
const statBox = (t, v) => "<stat " + t + "=" + v + ">";
const memoryColor = (p) => (p < 20 ? "#EF4444" : p < 40 ? "#F59E0B" : "#16A34A");
const fmtDate = (d) => String(d);
const splitKey = (k) => { const i = String(k).indexOf(" > "); return { lesson: String(k).slice(0, i), topic: String(k).slice(i + 3) }; };
const idealReviewInterval = () => 3;
const MEMORY_CRITICAL = 20, MEMORY_WARNING = 40;

function kart(ms, bkt, limit) {
  const window = { AnalizBKT: { konuDurumlari: () => bkt } };
  const fn = new Function("html", "ms", "memoryLimit", "window", "icon", "esc", "attr", "statBox",
    "memoryColor", "fmtDate", "splitKey", "idealReviewInterval", "MEMORY_CRITICAL", "MEMORY_WARNING",
    "return (function(){\n" + blok + "\nreturn html;\n})();");
  return fn("", ms, limit || 10, window, icon, esc, attr, statBox, memoryColor, fmtDate, splitKey,
    idealReviewInterval, MEMORY_CRITICAL, MEMORY_WARNING);
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

console.log("\n== 1) Tek kart, tek satır ==");
ok("kart kimliği bkt-birlesik-kart", cikti.indexOf('id="bkt-birlesik-kart"') >= 0);
ok("başlık: Öğrenme Durumu · Hafıza Gücü", cikti.indexOf("Öğrenme Durumu · Hafıza Gücü") >= 0);
ok("ayrı 'Hafıza Gücü' kartı YOK", cikti.indexOf("> Hafıza Gücü</h3>") < 0);
ok("aynı konu iki kez basılmıyor", (cikti.match(/1\.1 Trigonometri<\/b>/g) || []).length === 1);
ok("BKT durumu satırın içinde", cikti.indexOf("Gelişiyor") >= 0);
ok("yeterlilik barı (BKT)", cikti.indexOf("Yeterlilik (BKT)") >= 0);
ok("hafıza barı (%12)", cikti.indexOf("%12") >= 0);

console.log("\n== 2) Aksiyonlar korunuyor ==");
ok("tekrar aksiyonu (reviewTopic)", cikti.indexOf('data-act="reviewTopic"') >= 0);
ok("sıfırlama aksiyonu (resetTopic)", cikti.indexOf('data-act="resetTopic"') >= 0);
ok("kısa kontrol düğmesi kartın içinde", cikti.indexOf('data-bkt-test="Matematik > 1.1 Trigonometri"') >= 0);
ok("kısa kontrol havuzu doğru", cikti.indexOf('data-bkt-pool="mat_10_u01_k01"') >= 0);

console.log("\n== 3) Yalnız BKT kaydı olan konu ==");
ok("BKT-only konu listelendi", cikti.indexOf("2.2 Hücre") >= 0);
ok("havuzsuz konuda dürüst uyarı", cikti.indexOf("Soru havuzu eşlenmedi") >= 0);

console.log("\n== 4) Ayrı BKT paneli çizilmiyor ==");
ok("motor birleşik kartı tanıyor", ENGINE.indexOf('getElementById("bkt-birlesik-kart")') > 0);
ok("eski panel temizleniyor", /bkt-birlesik-kart[\s\S]{0,220}bkt-learning-panel/.test(ENGINE));
ok("konuDurum API'si dışa açık", ENGINE.indexOf("konuDurum: function (key)") > 0);

console.log("\n" + "─".repeat(56));
if (kalan) { hatalar.forEach(h => console.log(" ✗ " + h)); console.log("Birleşik kart testi — " + gecen + "/" + (gecen + kalan) + " geçti"); process.exit(1); }
console.log("Birleşik kart testi — " + gecen + "/" + gecen + " geçti ✓");
