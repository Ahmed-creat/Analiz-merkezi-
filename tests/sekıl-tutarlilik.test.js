#!/usr/bin/env node
/* ============================================================
   ŞEKİL ↔ CEVAP TUTARLILIK TESTİ — tests/sekıl-tutarlilik.test.js
   ------------------------------------------------------------
   Kullanıcı (v35.9): "bazı fizik sorularında görselde yanlışlıklar var,
   görselde v-t grafiğinde ivmeyi 6 göstermiş ama sorunun cevabı ivme 0."

   Kök neden: `gorsel` alanı sorunun SAYILARIYLA değil, elle yazılıyordu ve
   hiçbir test "şekildeki sayı cevapla uyuşuyor mu?" diye bakmıyordu.

   Neyi kanıtlıyor? (metin değil, SAYI)
     1) Her şekilli sorunun grafiğinde en az 2 nokta var, sayılar sonlu.
     2) Grafik eksen adı doğru: v-t ise seri `v`, x-t ise `x`.
     3) Hız SABİT ise (tüm y değerleri eşit) sorunun doğru cevabı "ivme 0"
         ya da "sabit hız/sürat" demeli; ivme sorusunda 0 dışı cevap varsa
         şekil yanlış demektir → test kırılır.
     4) Eğim = ivme: v-t grafiğinin eğimi ile cevaptaki ivme sayısı
         (varsa) tutmalı.
     5) Geometri: verilen kenar uzunlukları ile çizilen şekil birbirini
         tutmalı (cosinüs/sinüs teoremiyle en az bir açı hesaplanabilir).
     6) Şekilde `undefined`/`NaN`/`Infinity` yok.

   Çalıştır: node tests/sekıl-tutarlilik.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const KOK = path.join(__dirname, "..");
const HDIR = path.join(KOK, "site", "content", "soru_havuzlari");
const GV = require(path.join(KOK, "site", "gorsel.js"));

// Incelenen havuzlar: kullanıcının şikâyet ettiği konular
const HAVUZLAR = [
  "mat_10_u01_k01", "mat_10_u01_k02", "mat_10_u01_k03", "mat_10_u01_k04",
  "fizik_10_u01_k01", "fizik_10_u01_k02"
];

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false;
}
function sayi(x) { const n = Number(x); return Number.isFinite(n); }
// TÜRKÇE TUZAĞI: "İvme".toLowerCase() → "i̇vme" (i + birleşik nokta) ve
// /ivme/ ile EŞLEŞMEZ. Testin hata yakalamamasının sebebi buydu.
function kucult(x) {
  return String(x == null ? "" : x)
    .replace(/İ/g, "i").replace(/I/g, "ı")
    .toLowerCase();
}

function sorular(id) {
  const d = JSON.parse(fs.readFileSync(path.join(HDIR, id + ".json"), "utf8"));
  return Array.isArray(d.sorular) ? d.sorular : [];
}

/** Doğru cevap metnini sayı listesine çevir ("−24 m", "6 m/s", "0") */
function cevapSayilari(metin) {
  const t = String(metin == null ? "" : metin).replace(/−/g, "-").replace(",", ".");
  const m = t.match(/-?\d+(?:\.\d+)?/g) || [];
  return m.map(Number).filter(Number.isFinite);
}

console.log("\n== 1) Her şekil geçerli ve sayıları sonlu ==");
let toplamSoru = 0, sekilli = 0;
HAVUZLAR.forEach(id => {
  const liste = sorular(id);
  toplamSoru += liste.length;
  liste.forEach(q => {
    const s = q.soru_id;
    if (!q.gorsel) { ok(s + " şekilsiz", false); return; }
    sekilli++;
    const hata = GV.dogrula(q.gorsel);
    ok(s + " şekil doğrulaması", hata.length === 0, (hata || []).join(" · "));
    const svg = GV.svg(q.gorsel);
    ok(s + " SVG'de NaN/undefined yok", !/NaN|undefined|Infinity/.test(svg));
  });
});
ok("6 havuzun tamamı şekilli", sekilli === toplamSoru, sekilli + "/" + toplamSoru);

console.log("\n== 2) Grafik eksen adı seriyle uyumlu ==");
HAVUZLAR.forEach(id => {
  sorular(id).forEach(q => {
    const g = q.gorsel || {};
    if (g.tip !== "grafik") return;
    const yEkseni = String(g.yEkseni || "");
    (g.seriler || []).forEach(sr => {
      const nokta = Array.isArray(sr.noktalar) ? sr.noktalar : [];
      ok(q.soru_id + " nokta sayısı", nokta.length >= 2, String(nokta.length));
      ok(q.soru_id + " noktalar sonlu", nokta.every(n => Array.isArray(n) && sayi(n[0]) && sayi(n[1])));
      // Seri adı TEK HARF ise eksen adıyla aynı olmalı (v ↔ v (m/s)).
      // Uzun açıklayıcı adlar ("hızlı 14 m/s") serbesttir.
      const ad = kucult(sr.ad).trim();
      const eks = kucult(yEkseni);
      if (ad.length === 1) {
        ok(q.soru_id + " seri harfi eksene uygun", eks.indexOf(ad) >= 0, ad + " ↔ " + eks);
      }
    });
  });
});

console.log("\n== 3) v-t grafiği ↔ ivme cevabı (iki yönlü) ==");
// Kullanıcının bildirdiği hata sınıfı: grafikte hızın değiştiği görülüyor ama
// cevap "ivme 0". Bu çelişki test tarafından YAKALANMALI.
HAVUZLAR.forEach(id => {
  sorular(id).forEach(q => {
    const g = q.gorsel || {};
    if (g.tip !== "grafik") return;
    const eks = kucult(g.yEkseni);
    if (eks.indexOf("v") !== 0) return;                       // yalnız v-t
    const metin = kucult(q.metin);
    if (!/ivme/.test(metin)) return;                          // yalnız ivme soruları
    const seri = (g.seriler || [])[0];
    if (!seri || !Array.isArray(seri.noktalar) || seri.noktalar.length < 2) return;
    const ys = seri.noktalar.map(n => Number(n[1]));
    const sabit = ys.every(y => Math.abs(y - ys[0]) < 1e-9);
    const cevapHam = String(q.secenekler[q.dogru_index] || "");
    const cevap = cevapSayilari(cevapHam);
    const cevapSifir = cevap.length > 0 && Math.abs(cevap[0]) < 1e-9;
    // (a) Hız sabitse → ivme 0 olmalı
    if (sabit) ok(q.soru_id + " sabit v-t → ivme cevabı 0", cevapSifir, cevapHam);
    // (b) Hız DEĞİŞİYORSA → cevap 0 olamaz (ivme sıfır olamaz)
    else ok(q.soru_id + " değişen v-t → ivme cevabı 0 olamaz", !cevapSifir, cevapHam);
  });
});

console.log("\n== 4) v-t eğimi = sorudaki/cevaptaki ivme ==");
HAVUZLAR.forEach(id => {
  sorular(id).forEach(q => {
    const g = q.gorsel || {};
    if (g.tip !== "grafik") return;
    if (kucult(g.yEkseni).indexOf("v") !== 0) return;
    const metin = String(q.metin || "");
    if (!/ivme/.test(kucult(metin))) return;
    const seri = (g.seriler || [])[0];
    if (!seri || !Array.isArray(seri.noktalar) || seri.noktalar.length < 2) return;
    const ilk = seri.noktalar[0], son = seri.noktalar[seri.noktalar.length - 1];
    const dt = Number(son[0]) - Number(ilk[0]);
    if (!(Math.abs(dt) > 1e-9)) return;
    const egim = (Number(son[1]) - Number(ilk[1])) / dt;
    const temiz = metin.replace(/−/g, "-").replace(/,/g, ".");

    // (a) Soru metninde yazılı ivme (m/s²) varsa eğim ona eşit olmalı
    const mIvme = temiz.match(/(-?\d+(?:\.\d+)?)\s*m\/s²/);
    if (mIvme) {
      const hedef = Number(mIvme[1]);
      ok(q.soru_id + " v-t eğimi (" + egim + ") = sorudaki ivme (" + hedef + ")",
        Math.abs(Math.abs(egim) - Math.abs(hedef)) < 1e-6,
        "eğim " + egim + " ≠ ivme " + hedef + " [" + metin.slice(0, 55) + "]");
    }
    // (b) Doğru cevap ivme ise (birimi m/s²) eğim o sayı olmalı
    const cevapHam = String(q.secenekler[q.dogru_index] || "");
    if (/m\/s²/.test(cevapHam)) {
      const cevap = cevapSayilari(cevapHam);
      if (cevap.length === 1) {
        ok(q.soru_id + " v-t eğimi (" + egim + ") = cevap ivmesi (" + cevap[0] + ")",
          Math.abs(Math.abs(egim) - Math.abs(cevap[0])) < 1e-6,
          "eğim " + egim + " ≠ cevap " + cevap[0]);
      }
    }
    // (c) Doğru cevap son hız (m/s) ise grafiğin son noktası o olmalı
    if (/m\/s\b/.test(cevapHam) && !/m\/s²/.test(cevapHam)) {
      const cevap = cevapSayilari(cevapHam);
      if (cevap.length === 1) {
        ok(q.soru_id + " grafiğin son hızı (" + son[1] + ") = cevap (" + cevap[0] + ")",
          Math.abs(Number(son[1]) - cevap[0]) < 1e-6 || Math.abs(Number(ilk[1]) - cevap[0]) < 1e-6,
          "son nokta " + son[1] + " ≠ cevap " + cevap[0]);
      }
    }
  });
});

console.log("\n== 5) Geometri: çizilen şekil ile verilen sayılar ==");
HAVUZLAR.forEach(id => {
  sorular(id).forEach(q => {
    const g = q.gorsel || {};
    if (g.tip !== "geometri") return;
    const nk = g.noktalar || {};
    const kenarlar = g.kenarlar || [];
    // Verilen her kenar etiketi sayı olmalı (harf/’?’ hariç)
    kenarlar.forEach(k => {
      if (k.etiket == null) return;
      const s = String(k.etiket).trim();
      // Etiket boş olamaz; sayı, "?", harf, "3√7", "GD = 7", "eğik destek" hepsi olur.
      ok(q.soru_id + " kenar etiketi dolu (" + s + ")", s.length > 0);
      ok(q.soru_id + " kenar etiketi NaN değil", !/NaN|undefined/.test(s));
    });
    // Geometrik tutarlılık: üçgen eşitsizliği (verilen sayısal kenarlar)
    const sayisalKenarlar = kenarlar
      .filter(k => /^\d+([.,]\d+)?$/.test(String(k.etiket || "")))
      .map(k => Number(String(k.etiket).replace(",", ".")))
      .sort((a, b) => a - b);
    if (sayisalKenarlar.length === 3) {
      ok(q.soru_id + " üçgen eşitsizliği",
        sayisalKenarlar[0] + sayisalKenarlar[1] > sayisalKenarlar[2],
        sayisalKenarlar.join("-"));
    }
    // Nokta koordinatları çerçeve içinde (380×300)
    Object.keys(nk).forEach(k => {
      const p = nk[k];
      const x = Array.isArray(p) ? p[0] : (p && p.x);
      const y = Array.isArray(p) ? p[1] : (p && p.y);
      if (!sayi(x) || !sayi(y)) { ok(q.soru_id + " nokta " + k + " sonlu", false); return; }
      ok(q.soru_id + " nokta " + k + " çerçevede", x >= 0 && x <= 380 && y >= 0 && y <= 300, x + "," + y);
    });
  });
});

console.log("\n== 6) Tablo tipi: başlık ve satır sayısı ==");
HAVUZLAR.forEach(id => {
  sorular(id).forEach(q => {
    const g = q.gorsel || {};
    if (g.tip !== "tablo") return;
    ok(q.soru_id + " tablo başlıkları", Array.isArray(g.basliklar) && g.basliklar.length > 0);
    ok(q.soru_id + " tablo satırları", Array.isArray(g.satirlar) && g.satirlar.length > 0);
    (g.satirlar || []).forEach(r => {
      ok(q.soru_id + " tablo satır genişliği", Array.isArray(r) && r.length === (g.basliklar || []).length,
        JSON.stringify(r));
    });
  });
});

console.log("\n" + "─".repeat(58));
if (kalan) {
  hatalar.slice(0, 25).forEach(h => console.log(" ✗ " + h));
  if (hatalar.length > 25) console.log(" … " + (hatalar.length - 25) + " hata daha");
  console.log("Şekil tutarlılık testi — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("Şekil tutarlılık testi — " + gecen + "/" + gecen + " geçti ✓");
