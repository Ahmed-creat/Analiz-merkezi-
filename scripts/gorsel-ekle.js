#!/usr/bin/env node
/* ============================================================
   SORU ŞEKİLLERİ EKLEYİCİ — scripts/gorsel-ekle.js
   ------------------------------------------------------------
   Kullanıcı isteği (v35.8):
     "Özellikle matematik trigonometri ve üçgen, fizikte sabit hız
      ve ivme grafikleri sorularının NEREDEYSE HEPSİNİN şekli olsun;
      çünkü öğrencinin bunu zihninde canlandırması zor."

   Bu betik aşağıdaki havuzlardaki sorulara `gorsel` alanı ekler:
     mat_10_u01_k01  Dik üçgende trigonometrik oranlar
     mat_10_u01_k02  Üçgende yardımcı elemanlar
     mat_10_u01_k03  Üçgende alan
     mat_10_u01_k04  Sinüs / Kosinüs teoremleri
     fizik_10_u01_k01 Sabit hızlı hareket
     fizik_10_u01_k02 Bir boyutta sabit ivmeli hareket

   Her şekil sorusunun KENDİ sayılarıyla çizilir (uydurma şekil yok):
   üçgen kenarları, açıları, yükseklik/kenarortay/açıortay ve
   hız-zaman–konum-zaman grafikleri sorudaki değerlerden gelir.

   Güvenlik kontrolleri (kaydetmeden önce):
     • her görsel GV.svg() ile gerçekten SVG üretiyor mu?
     • SVG içinde NaN / undefined / boş etiket var mı?
     • tüm koordinatlar 380×285 çerçevesinin içinde mi?
     • her soru için bir tanım var mı, tanımsız kalan kaç soru?

   Çalıştır:  node scripts/gorsel-ekle.js            (yazar)
              node scripts/gorsel-ekle.js --kontrol  (yalnız denetler)
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const GV = require("../site/gorsel.js");

const KOK = path.join(__dirname, "..");
const HAVUZ = path.join(KOK, "site", "content", "soru_havuzlari");
const KONTROL = process.argv.indexOf("--kontrol") >= 0;

// ---------- KISA YARDIMCILAR ----------
const P = (x, y) => [x, y];

// Dik üçgen: C sol-alt (dik), A sol-üst, B sağ-alt.
// a = BC (yatay), b = CA (düşey), c = AB (hipotenüs)
function sayiEtiket(t) {
  const m = String(t == null ? "" : t).replace(",", ".").match(/^\d+(\.\d+)?$/);
  return m ? parseFloat(m[0]) : null;
}
// Şekil, sorudaki SAYILARA GÖRE ölçeklenir (7–24 üçgeni ile 24–7 üçgeni
// aynı görünmesin): iki dik kenar da sayıysa oran korunur.
function dikOlcek(a, b) {
  const A = sayiEtiket(a), B = sayiEtiket(b);
  if (!A || !B) return { yatay: 270, dusey: 185 };
  // Kenar oranı korunur ama 1:4 gibi uç oranlar 1:3'e yumuşatılır;
  // aksi hâlde 9–40–41 üçgeni tek çizgi gibi görünüyordu.
  const M = 210, oran = Math.max(1 / 3, Math.min(3, A / B));
  if (oran >= 1) return { yatay: M, dusey: Math.round(M / oran) };
  return { yatay: Math.round(M * oran), dusey: M };
}
function dikUcgen(kenar, opts) {
  const o = opts || {};
  const ol = dikOlcek(kenar.a, kenar.b);
  const g = {
    tip: "geometri",
    noktalar: { C: P(70, 240), A: P(70, 240 - ol.dusey), B: P(70 + ol.yatay, 240) },
    kenarlar: [
      { a: "B", b: "C", etiket: kenar.a },
      { a: "C", b: "A", etiket: kenar.b },
      { a: "A", b: "B", etiket: kenar.c }
    ],
    acilar: [],
    dikler: ["C"],
    not: o.not
  };
  if (o.aci) g.acilar.push({ kose: o.aciKose || "A", a: "B", b: "C", etiket: o.aci });
  if (o.aciB) g.acilar.push({ kose: "B", a: "A", b: "C", etiket: o.aciB });
  if (o.cizgiler) g.cizgiler = o.cizgiler;
  if (o.isaretli) g.isaretli = o.isaretli;
  if (o.etiketler) g.etiketler = o.etiketler;
  if (o.ek) Object.assign(g, o.ek);
  return g;
}

// Genel üçgen: A üst, B sol-alt, C sağ-alt.
// a = BC (alt), b = CA (sağ), c = AB (sol)
function ucgen(kenar, acilar, opts) {
  const o = opts || {};
  const g = {
    tip: "geometri",
    noktalar: o.noktalar || { A: P(190, 48), B: P(48, 242), C: P(338, 242) },
    kenarlar: [
      { a: "B", b: "C", etiket: kenar.a },
      { a: "C", b: "A", etiket: kenar.b },
      { a: "A", b: "B", etiket: kenar.c }
    ].filter(k => k.etiket != null && k.etiket !== ""),
    acilar: acilar || []
  };
  if (o.cizgiler) g.cizgiler = o.cizgiler;
  if (o.dikler) g.dikler = o.dikler;
  if (o.isaretli) g.isaretli = o.isaretli;
  if (o.cemberler) g.cemberler = o.cemberler;
  if (o.not) g.not = o.not;
  if (o.etiketler) g.etiketler = o.etiketler;
  return g;
}

function vt(noktalar, opts) {
  const o = opts || {};
  return Object.assign({
    tip: "grafik", xEkseni: o.x || "t (s)", yEkseni: o.y || "v (m/s)",
    seriler: [{ ad: o.ad || "v", noktalar: noktalar }]
  }, o.alan ? { alan: true } : {});
}
function xt(noktalar, opts) {
  const o = opts || {};
  return Object.assign({
    tip: "grafik", xEkseni: o.x || "t (s)", yEkseni: o.y || "x (m)",
    seriler: [{ ad: o.ad || "x", noktalar: noktalar }]
  }, o.alan ? { alan: true } : {});
}

// ---------- MATEMATİK 1.1 — DİK ÜÇGENDE TRİGONOMETRİ ----------
const MAT_K01 = {
  mat_10_u01_k01_o01: dikUcgen({ a: "7", b: "24", c: "?" }, { aci: "α", aciKose: "A" }),
  mat_10_u01_k01_o02: {
    tip: "geometri",
    sekiller: [
      {
        noktalar: { C: P(30, 230), A: P(30, 95), B: P(150, 230) },
        kenarlar: [{ a: "B", b: "C", etiket: "9" }, { a: "C", b: "A", etiket: "40" }],
        acilar: [{ kose: "A", a: "B", b: "C", etiket: "α" }],
        dikler: ["C"], etiketler: { A: "A", B: "B", C: "C" }
      },
      {
        noktalar: { C: P(205, 230), A: P(205, 95), B: P(355, 230) },
        kenarlar: [{ a: "B", b: "C", etiket: "x" }, { a: "C", b: "A", etiket: "80" }],
        acilar: [{ kose: "A", a: "B", b: "C", etiket: "α" }],
        dikler: ["C"], etiketler: { A: "A′", B: "B′", C: "C′" }
      }
    ],
    not: "1. üçgen 9–40 · 2. üçgen x–80 (aynı dar açı)"
  },
  mat_10_u01_k01_o03: dikUcgen({ a: "20", b: "?", c: "29" }, { aci: "α", not: "sin α = 20/29" }),
  mat_10_u01_k01_o04: dikUcgen({ a: "5", b: "8", c: "?" }, { aci: "α", not: "tan α = 5/8" }),
  mat_10_u01_k01_o05: dikUcgen({ a: "8", b: "?", c: "?" }, { aci: "30°", not: "30°'nin karşısındaki kenar 8 cm" }),
  mat_10_u01_k01_o06: dikUcgen({ a: "4", b: "4", c: "?" }, { aci: "45°", aciB: "45°", not: "ikizkenar dik üçgen: dik kenarlar 4 ve 4" }),
  mat_10_u01_k01_o07: {
    tip: "geometri",
    noktalar: { A: P(50, 238), B: P(300, 238), C: P(300, 80) },
    kenarlar: [
      { a: "A", b: "B", etiket: "yatay (komşu)", kaydir: [0, 22] },
      { a: "B", b: "C", etiket: "düşey", kaydir: [40, -6] },
      { a: "A", b: "C", etiket: "eğik destek" }
    ],
    acilar: [{ kose: "A", a: "B", b: "C", etiket: "α" }],
    dikler: [{ kose: "B", a: "A", b: "C" }],
    not: "tan α = düşey yükselme / yatay uzaklık"
  },
  mat_10_u01_k01_o08: dikUcgen({ a: "9", b: "40", c: "41" }, { aci: "β", not: "sin β = 9/41 · cos β = 40/41" }),
  mat_10_u01_k01_o09: { tip: "cember", aci: 109, yon: "ters", noktaAdi: "P", cos: "−12/37", sin: "35/37", not: "P noktası birim çember üzerinde" },
  mat_10_u01_k01_o10: { tip: "cember", aci: 50, yon: "ters", noktaAdi: "P", cos: "x", sin: "y", not: "P birim çemberde ⇔ x² + y² = 1" },
  mat_10_u01_k01_o11: { tip: "cember", aci: 235, yon: "saat", noktaAdi: "P", aciEtiket: "−235°", not: "saat yönünde 235° → negatif yönlü açı" },
  mat_10_u01_k01_o12: { tip: "cember", aci: 137, yon: "ters", noktaAdi: "P", aciEtiket: "+137°", not: "saat yönünün tersine 137° → pozitif yönlü açı" }
};

// ---------- MATEMATİK 1.2 — YARDIMCI ELEMANLAR ----------
const MAT_K02 = {
  mat_10_u01_k02_o01: {
    tip: "geometri",
    noktalar: { A: P(190, 50), B: P(50, 242), C: P(330, 242), D: P(210, 242) },
    ucgen: ["A", "B", "C"],
    kenarlar: [
      { a: "A", b: "B", etiket: "8" },
      { a: "A", b: "C", etiket: "6" },
      { a: "B", b: "D", etiket: "4", kaydir: [0, 18] },
      { a: "D", b: "C", etiket: "x", kaydir: [0, 18] }
    ],
    cizgiler: [{ a: "A", b: "D", kesikli: true }],
    acilar: [
      { kose: "A", a: "B", b: "D", etiket: "" },
      { kose: "A", a: "D", b: "C", etiket: "" }
    ],
    isaretli: ["D"],
    not: "AD, A açısının iç açıortayı · AB = 8, AC = 6, BD = 4"
  },
  mat_10_u01_k02_o02: {
    tip: "geometri",
    noktalar: { A: P(190, 48), B: P(55, 240), C: P(325, 240), K: P(170, 165) },
    ucgen: ["A", "B", "C"],
    cizgiler: [
      { a: "A", b: "K", kesikli: true },
      { a: "B", b: "K", kesikli: true }
    ],
    acilar: [{ kose: "C", a: "A", b: "B", etiket: "58°" }],
    isaretli: ["K"],
    not: "İç açıortaylar K'da kesişiyor · ∠AKB = ?"
  },
  mat_10_u01_k02_o03: {
    tip: "geometri",
    noktalar: { A: P(190, 60), B: P(80, 205), C: P(300, 205), P: P(190, 272) },
    ucgen: ["A", "B", "C"],
    cizgiler: [
      { a: "A", b: "P", kesikli: true, renk: "#16A34A" },
      { a: "B", b: "P", kesikli: true, renk: "#16A34A" },
      { a: "C", b: "P", kesikli: true, renk: "#16A34A" }
    ],
    isaretli: ["P"],
    not: "Şematik: iki dış + bir iç açıortay tek noktada (P = dış teğet çember merkezi)"
  },
  mat_10_u01_k02_o04: {
    tip: "geometri",
    noktalar: { A: P(190, 50), B: P(60, 242), C: P(320, 242), D: P(190, 242), G: P(190, 178) },
    ucgen: ["A", "B", "C"],
    cizgiler: [{ a: "A", b: "D", renk: "#B45309" }],
    kenarlar: [
      { a: "A", b: "G", etiket: "AG = ?", kaydir: [-58, 0] },
      { a: "G", b: "D", etiket: "GD = 7", kaydir: [56, 0] }
    ],
    isaretli: ["D", "G"],
    not: "AD kenarortay, G ağırlık merkezi (AG = 2·GD)"
  },
  mat_10_u01_k02_o05: {
    tip: "geometri",
    noktalar: { C: P(65, 240), A: P(65, 70), B: P(330, 240), M: P(197, 155) },
    ucgen: ["A", "B", "C"],
    kenarlar: [{ a: "A", b: "B", etiket: "18", kaydir: [-26, -16] }],
    etiketKaydir: { M: [20, 18] },
    cizgiler: [{ a: "C", b: "M", renk: "#B45309", etiket: "kenarortay = ?", kaydir: [62, 10] }],
    dikler: ["C"],
    isaretli: ["M"],
    not: "Hipotenüse ait kenarortay · M = AB'nin orta noktası"
  },
  mat_10_u01_k02_o06: {
    tip: "geometri",
    noktalar: { A: P(190, 52), B: P(58, 242), C: P(322, 242), D: P(124, 147), E: P(256, 147), G: P(190, 179) },
    ucgen: ["A", "B", "C"],
    cizgiler: [
      { a: "C", b: "D", kesikli: true },
      { a: "B", b: "E", kesikli: true }
    ],
    isaretli: ["D", "E", "G"],
    not: "BE ve CD kenarortay · üçüncü kenarortay da G'den geçer"
  },
  mat_10_u01_k02_o07: {
    tip: "geometri",
    noktalar: { A: P(70, 150), B: P(320, 150), D: P(195, 150), U: P(195, 48), V: P(195, 250) },
    kenarlar: [],
    cizgiler: [{ a: "U", b: "V", etiket: "ℓ", kesikli: true, kaydir: [24, 0] }],
    dikler: [{ kose: "D", a: "A", b: "U" }],
    isaretli: ["D"],
    not: "D = AB'nin orta noktası · ℓ ⊥ AB"
  },
  mat_10_u01_k02_o08: {
    tip: "geometri",
    noktalar: { A: P(190, 55), B: P(60, 235), C: P(320, 235), O: P(190, 192), M1: P(125, 145), M2: P(255, 145) },
    ucgen: ["A", "B", "C"],
    cizgiler: [
      { a: "M1", b: "O", kesikli: true, renk: "#16A34A" },
      { a: "M2", b: "O", kesikli: true, renk: "#16A34A" }
    ],
    dikler: [{ kose: "M1", a: "A", b: "O" }, { kose: "M2", a: "A", b: "O" }],
    isaretli: ["O", "M1", "M2"],
    not: "Kenar orta dikmeleri O'da kesişir → O, köşelere eşit uzaklıkta"
  },
  mat_10_u01_k02_o09: {
    tip: "geometri",
    noktalar: { A: P(190, 75), B: P(116, 202), C: P(264, 202), O: P(190, 160) },
    ucgen: ["A", "B", "C"],
    cemberler: [{ merkez: "O", r: 85 }],
    cizgiler: [
      { a: "O", b: "A", renk: "#B45309", etiket: "11", kaydir: [-26, 0] },
      { a: "O", b: "C", renk: "#B45309", etiket: "?", kaydir: [22, 8] }
    ],
    isaretli: ["O"],
    not: "O = çevrel çember merkezi · OA = OB = OC"
  },
  mat_10_u01_k02_o10: {
    tip: "geometri",
    noktalar: { A: P(190, 175), B: P(70, 240), C: P(310, 240), H: P(190, 42) },
    ucgen: ["A", "B", "C"],
    cizgiler: [
      { a: "B", b: "H", kesikli: true, renk: "#B45309" },
      { a: "C", b: "H", kesikli: true, renk: "#B45309" },
      { a: "A", b: "H", kesikli: true, renk: "#B45309" }
    ],
    acilar: [{ kose: "A", a: "B", b: "C", etiket: "geniş" }],
    isaretli: ["H"],
    not: "Geniş açılı üçgende yüksekliklerin kesim noktası H üçgenin DIŞINDA"
  },
  mat_10_u01_k02_o11: {
    tip: "geometri",
    noktalar: { C: P(70, 240), A: P(70, 70), B: P(330, 240) },
    ucgen: ["A", "B", "C"],
    dikler: ["C"],
    cizgiler: [{ a: "A", b: "C", renk: "#B45309" }, { a: "B", b: "C", renk: "#B45309" }],
    isaretli: ["C"],
    not: "Dik üçgende yüksekliklerin kesim noktası H = C (dik köşe)"
  },
  mat_10_u01_k02_o12: {
    tip: "geometri",
    noktalar: { A: P(190, 55), B: P(60, 240), C: P(320, 240), H: P(190, 151), F1: P(190, 240), F2: P(262, 168) },
    ucgen: ["A", "B", "C"],
    cizgiler: [
      { a: "A", b: "F1", kesikli: true, renk: "#B45309" },
      { a: "B", b: "H", kesikli: true, renk: "#B45309" },
      { a: "C", b: "H", kesikli: true, renk: "#B45309" }
    ],
    isaretli: ["H", "F1"],
    not: "Dar açılı üçgende yüksekliklerin kesim noktası H üçgenin İÇİNDE"
  }
};

// ---------- MATEMATİK 1.3 — ÜÇGENDE ALAN ----------
// İki üçgen: aynı yükseklik (tabanlar farklı) / aynı taban (yükseklikler farklı)
function ikiUcgen(sol, sag, not) {
  return {
    tip: "geometri",
    sekiller: [sol, sag],
    not: not
  };
}
const MAT_K03 = {
  mat_10_u01_k03_o01: ikiUcgen(
    { noktalar: { A: P(85, 60), B: P(35, 225), C: P(135, 225), F: P(85, 225) }, kenarlar: [{ a: "B", b: "C", etiket: "5", kaydir: [0, 18] }], cizgiler: [{ a: "A", b: "F", kesikli: true, etiket: "h", kaydir: [16, 0] }], etiketler: { A: "A", B: "B", C: "C", F: false } },
    { noktalar: { A: P(272, 60), B: P(202, 225), C: P(342, 225), F: P(272, 225) }, kenarlar: [{ a: "B", b: "C", etiket: "10", kaydir: [0, 18] }], cizgiler: [{ a: "A", b: "F", kesikli: true, etiket: "h", kaydir: [16, 0] }], etiketler: { A: "D", B: "E", C: "K", F: false } },
    "Yükseklikler eşit (h) · tabanlar 5 ve 10 → alan oranı = taban oranı"
  ),
  mat_10_u01_k03_o02: ikiUcgen(
    { noktalar: { A: P(85, 60), B: P(35, 225), C: P(135, 225), F: P(85, 225) }, kenarlar: [{ a: "B", b: "C", etiket: "4", kaydir: [0, 18] }], cizgiler: [{ a: "A", b: "F", kesikli: true, etiket: "h", kaydir: [16, 0] }], etiketler: { A: "A", B: "B", C: "C", F: false }, not: "1. üçgen · alan = 12 cm²" },
    { noktalar: { A: P(272, 60), B: P(205, 225), C: P(340, 225), F: P(272, 225) }, kenarlar: [{ a: "B", b: "C", etiket: "?", kaydir: [0, 18] }], cizgiler: [{ a: "A", b: "F", kesikli: true, etiket: "h", kaydir: [16, 0] }], etiketler: { A: "D", B: "E", C: "K", F: false }, not: "2. üçgen · alan = 18 cm²" },
    "Yükseklikler eşit → alanlar tabanlarla orantılı"
  ),
  mat_10_u01_k03_o03: ikiUcgen(
    { noktalar: { A: P(85, 130), B: P(35, 225), C: P(150, 225), F: P(85, 225) }, kenarlar: [{ a: "B", b: "C", etiket: "a", kaydir: [0, 18] }], cizgiler: [{ a: "A", b: "F", kesikli: true, etiket: "3", kaydir: [16, 0] }], etiketler: { A: "A", B: "B", C: "C", F: false } },
    { noktalar: { A: P(272, 55), B: P(202, 225), C: P(342, 225), F: P(272, 225) }, kenarlar: [{ a: "B", b: "C", etiket: "a", kaydir: [0, 18] }], cizgiler: [{ a: "A", b: "F", kesikli: true, etiket: "6", kaydir: [16, 0] }], etiketler: { A: "D", B: "E", C: "K", F: false } },
    "Tabanlar eşit (a) · yükseklikler 3 ve 6 → alan oranı = yükseklik oranı"
  ),
  mat_10_u01_k03_o04: ikiUcgen(
    { noktalar: { A: P(85, 130), B: P(35, 225), C: P(150, 225), F: P(85, 225) }, kenarlar: [{ a: "B", b: "C", etiket: "a", kaydir: [0, 18] }], cizgiler: [{ a: "A", b: "F", kesikli: true, etiket: "5", kaydir: [16, 0] }], etiketler: { A: "A", B: "B", C: "C", F: false }, not: "1. üçgen · alan = 20 cm²" },
    { noktalar: { A: P(272, 70), B: P(202, 225), C: P(342, 225), F: P(272, 225) }, kenarlar: [{ a: "B", b: "C", etiket: "a", kaydir: [0, 18] }], cizgiler: [{ a: "A", b: "F", kesikli: true, etiket: "?", kaydir: [16, 0] }], etiketler: { A: "D", B: "E", C: "K", F: false }, not: "2. üçgen · alan = 28 cm²" },
    "Tabanlar eşit → alanlar yüksekliklerle orantılı"
  ),
  mat_10_u01_k03_o05: {
    tip: "geometri",
    noktalar: { B: P(110, 245), C: P(280, 245), A1: P(80, 95), A2: P(315, 95) },
    sekiller: [
      { noktalar: { A: P(80, 95), B: P(110, 245), C: P(280, 245) }, kenarlar: [{ a: "B", b: "C", etiket: "ortak taban", kaydir: [0, 20] }], not: "1. levha: 24 cm²" },
      { noktalar: { A: P(315, 95), B: P(110, 245), C: P(280, 245), G1: P(62, 95), G2: P(340, 95) }, dolgu: "none", kesikli: true, cizgi: "#16A34A", etiketler: { A: "A′", B: false, C: false }, cizgiler: [{ a: "G1", b: "G2", kesikli: true, renk: "#16A34A", etiket: "tabana paralel kılavuz", kaydir: [-20, -10] }] }
    ],
    not: "Aynı taban + paralel doğru üzerinde tepe → yükseklik eşit → alanlar EŞİT"
  },
  mat_10_u01_k03_o06: {
    tip: "geometri",
    sekiller: [
      { noktalar: { A: P(120, 90), B: P(80, 240), C: P(290, 240) }, kenarlar: [{ a: "B", b: "C", etiket: "sabit taban", kaydir: [0, 18] }] },
      { noktalar: { A: P(250, 90), B: P(80, 240), C: P(290, 240), G1: P(60, 90), G2: P(322, 90) }, dolgu: "none", kesikli: true, cizgi: "#16A34A", etiketler: { A: "A′", B: false, C: false }, cizgiler: [{ a: "G1", b: "G2", kesikli: true, renk: "#16A34A", etiket: "ray", kaydir: [0, -10] }] }
    ],
    not: "Tepe noktası paralel ray üzerinde gezer → yükseklik değişmez → ALAN DEĞİŞMEZ"
  },
  mat_10_u01_k03_o07: {
    tip: "geometri",
    sekiller: [
      { noktalar: { A: P(150, 80), B: P(70, 240), C: P(300, 240) }, kenarlar: [{ a: "B", b: "C", etiket: "ortak taban", kaydir: [0, 20] }] },
      { noktalar: { A: P(230, 80), B: P(70, 240), C: P(300, 240), G1: P(52, 80), G2: P(330, 80) }, dolgu: "none", kesikli: true, cizgi: "#16A34A", etiketler: { A: "A′", B: false, C: false }, cizgiler: [{ a: "G1", b: "G2", kesikli: true, renk: "#16A34A", etiket: "paralel doğru", kaydir: [-118, -10] }] }
    ],
    not: "Üst köşeler aynı paralel doğruda → yükseklikler eşit → alanlar eşit"
  },
  mat_10_u01_k03_o08: {
    tip: "geometri",
    sekiller: [
      { noktalar: { A: P(140, 85), B: P(75, 240), C: P(305, 240) }, kenarlar: [{ a: "B", b: "C", etiket: "ortak taban", kaydir: [0, 20] }] },
      { noktalar: { A: P(240, 85), B: P(75, 240), C: P(305, 240), G1: P(57, 85), G2: P(335, 85) }, dolgu: "none", kesikli: true, cizgi: "#16A34A", etiketler: { A: "A′", B: false, C: false }, cizgiler: [{ a: "G1", b: "G2", kesikli: true, renk: "#16A34A", etiket: "taşıyıcı çizgi", kaydir: [124, -10] }] }
    ],
    not: "Aynı taban + aynı paralel üzerinde tepe → alanlar eşit"
  },
  mat_10_u01_k03_o09: {
    tip: "geometri",
    sekiller: [
      { noktalar: { A: P(85, 160), B: P(35, 235), C: P(135, 235) }, kenarlar: [{ a: "A", b: "B", etiket: "3k" }], acilar: [{ kose: "A", a: "B", b: "C", etiket: "θ" }], not: "küçük üçgen" },
      { noktalar: { A: P(266, 70), B: P(190, 238), C: P(342, 238) }, kenarlar: [{ a: "A", b: "B", etiket: "5k" }], acilar: [{ kose: "A", a: "B", b: "C", etiket: "θ" }], not: "büyük üçgen" }
    ],
    not: "Benzer üçgenlerde kenar oranı 3/5 → alan oranı (3/5)² = 9/25"
  },
  mat_10_u01_k03_o10: {
    tip: "geometri",
    sekiller: [
      { noktalar: { A: P(85, 165), B: P(35, 235), C: P(140, 235) }, kenarlar: [{ a: "B", b: "C", etiket: "a", kaydir: [0, 16] }], not: "ilk üçgen" },
      { noktalar: { A: P(264, 70), B: P(184, 238), C: P(340, 238) }, kenarlar: [{ a: "B", b: "C", etiket: "1,4a", kaydir: [0, 16] }], not: "1,4 kat büyütülmüş" }
    ],
    not: "Tüm kenarlar 1,4 ile çarpılırsa alan 1,4² = 1,96 katı olur"
  },
  mat_10_u01_k03_o11: {
    tip: "geometri",
    noktalar: { A: P(150, 70), B: P(60, 240), C: P(340, 240) },
    ucgen: ["A", "B", "C"],
    kenarlar: [{ a: "A", b: "B", etiket: "12" }, { a: "A", b: "C", etiket: "8" }],
    acilar: [{ kose: "A", a: "B", b: "C", etiket: "45°" }],
    not: "Alan = ½ · 12 · 8 · sin 45°"
  },
  mat_10_u01_k03_o12: {
    tip: "geometri",
    noktalar: { A: P(150, 70), B: P(60, 240), C: P(340, 240) },
    ucgen: ["A", "B", "C"],
    kenarlar: [{ a: "A", b: "B", etiket: "14" }, { a: "A", b: "C", etiket: "6" }],
    acilar: [{ kose: "A", a: "B", b: "C", etiket: "45°" }],
    not: "Alan = ½ · 14 · 6 · sin 45°"
  }
};

// ---------- MATEMATİK 1.4 — SİNÜS / KOSİNÜS TEOREMLERİ ----------
const MAT_K04 = {
  mat_10_u01_k04_o01: dikUcgen({ a: "7", b: "?", c: "?" }, { aci: "45°", not: "A = 45°, C = 90°, a = BC = 7 cm" }),
  mat_10_u01_k04_o02: ucgen({ a: "", b: "7", c: "12" }, [{ kose: "A", a: "B", b: "C", etiket: "60°" }], { not: "İki kenar 12 ve 7, aralarındaki açı 60° → alan = ½·12·7·sin60°" }),
  mat_10_u01_k04_o03: ucgen({ a: "?", b: "", c: "12" }, [{ kose: "A", a: "B", b: "C", etiket: "60°" }, { kose: "C", a: "A", b: "B", etiket: "45°" }], { not: "c = 12 cm · A = 60° · C = 45° (sinüs teoremi)" }),
  mat_10_u01_k04_o04: ucgen({ a: "10", b: "?", c: "" }, [{ kose: "A", a: "B", b: "C", etiket: "30°" }, { kose: "B", a: "A", b: "C", etiket: "45°" }], { not: "A = 30°, B = 45°, a = 10 cm → b = ?" }),
  mat_10_u01_k04_o05: dikUcgen({ a: "8", b: "?", c: "?" }, { aci: "60°", not: "A = 60°, C = 90°, a = 8 cm" }),
  mat_10_u01_k04_o06: ucgen({ a: "12", b: "?", c: "" }, [{ kose: "A", a: "B", b: "C", etiket: "60°" }, { kose: "B", a: "A", b: "C", etiket: "45°" }], { not: "A = 60°, B = 45°, a = 12 cm → b = ?" }),
  mat_10_u01_k04_o07: ucgen({ a: "?", b: "8", c: "7" }, [{ kose: "A", a: "B", b: "C", etiket: "60°" }], { not: "b = 8, c = 7, aralarındaki açı A = 60° → a² = b² + c² − 2bc·cosA" }),
  mat_10_u01_k04_o08: ucgen({ a: "9", b: "?", c: "5" }, [{ kose: "B", a: "A", b: "C", etiket: "60°" }], { not: "a = 9, c = 5, aralarındaki açı B = 60° → b = ?" }),
  mat_10_u01_k04_o09: ucgen({ a: "9", b: "3√7", c: "6" }, [{ kose: "B", a: "A", b: "C", etiket: "?" }], { not: "a = 9, b = 3√7, c = 6 → kosinüs teoremiyle B" }),
  mat_10_u01_k04_o10: ucgen({ a: "?", b: "5", c: "8" }, [{ kose: "A", a: "B", b: "C", etiket: "120°" }], { not: "5 ve 8 kenarları arasındaki açı 120° → karşısındaki kenar ?" }),
  mat_10_u01_k04_o11: ucgen({ a: "10", b: "7", c: "9" }, [{ kose: "C", a: "A", b: "B", etiket: "?" }], { not: "a = 10, b = 7, c = 9 → cos C = ?" }),
  mat_10_u01_k04_o12: dikUcgen({ a: "?", b: "9", c: "?" }, { aci: "", not: "Dik açıyı çevreleyen kenarlar 7 ve 9 → hipotenüs ?" })
};

// ---------- FİZİK 1.1 — SABİT HIZLI HAREKET ----------
const FIZIK_K01 = {
  fizik_10_u01_k01_o01: {
    tip: "vektor", xEkseni: "x", yEkseni: "y",
    vektorler: [{ ad: "v₁", x: 4, y: 0 }, { ad: "v₂", x: 3, y: 2.4 }, { ad: "v₃", x: 0, y: 4 }],
    aciklama: "Kıvrımlı yolda hız vektörü her noktada yola teğettir; sürat sabit olsa da YÖN değişir."
  },
  fizik_10_u01_k01_o02: xt([[0, 0], [1, 5], [2, 10], [3, 15]], { not: "v = 5 m/s sabit · t = 3 s → Δx = 15 m" }),
  fizik_10_u01_k01_o03: {
    tip: "tablo", basliklar: ["t (s)", "x (m)"], satirlar: [["0", "14"], ["6", "50"]],
    aciklama: "Tablodaki konumlar: t = 0'da 14 m, t = 6 s'de 50 m"
  },
  fizik_10_u01_k01_o04: vt([[0, 6], [1, 6], [2, 6], [3, 6]], { not: "Her 1 s'de 6 m → hız sabit, ivme = 0" }),
  fizik_10_u01_k01_o05: xt([[0, 0], [2, 8], [4, 16], [6, 24]], { not: "Sabit hızlı harekette konum-zaman grafiği DOĞRU (eğim = hız)" }),
  fizik_10_u01_k01_o06: xt([[0, 0], [2, -6], [4, -12], [8, -24]], { not: "v = −3 m/s · t = 8 s → Δx = −24 m (negatif yön)" }),
  fizik_10_u01_k01_o07: vt([[0, -6], [4, -6], [8, -6]], { not: "Hız-zaman doğrusu eksenin ALTINDA → hareket negatif yönde" }),
  fizik_10_u01_k01_o08: xt([[0, 10], [2, 16], [4, 10]], { not: "Başlangıç ve bitiş konumu aynı → ortalama hız = 0" }),
  fizik_10_u01_k01_o09: xt([[0, 0], [30, 240], [60, 480], [90, 720]], { not: "720 m / 90 s = 8 m/s" }),
  fizik_10_u01_k01_o10: xt([[0, 0], [1, 3], [2, 6], [3, 9], [4, 12]], { not: "Yön değişmiyor: yol = yer değiştirme → sürat = hız büyüklüğü" }),
  fizik_10_u01_k01_o11: {
    tip: "vektor", xEkseni: "x", yEkseni: "y",
    vektorler: [{ ad: "Δx (yer değiştirme)", x: 5, y: 2 }],
    aciklama: "Başlangıçtan bitişe çizilen yönlü doğru parçası: yer değiştirme"
  },
  fizik_10_u01_k01_o12: {
    tip: "grafik", xEkseni: "t (s)", yEkseni: "v (m/s)",
    seriler: [{ ad: "hızlı 14 m/s", noktalar: [[0, 14], [4, 14]] }, { ad: "yavaş 9 m/s", noktalar: [[0, 9], [4, 9]] }],
    aciklama: "Aynı yönde: bağıl hız = 14 − 9 = 5 m/s"
  }
};

// ---------- FİZİK 1.2 — SABİT İVMELİ HAREKET ----------
const FIZIK_K02 = {
  fizik_10_u01_k02_o01: vt([[0, 4], [3, 16], [6, 28]], { not: "v: 4 → 28 m/s (6 s) · a = Δv/Δt = 24/6 = 4 m/s²" }),
  fizik_10_u01_k02_o02: vt([[0, 10], [2, 7], [4, 4]], { not: "Δv = 4 − 10 = −6 m/s (yavaşlıyor)" }),
  fizik_10_u01_k02_o03: vt([[0, 5], [3, 11], [6, 17]], { not: "v₀ = 5 m/s · a = 2 m/s² · t = 6 s → v = 17 m/s" }),
  fizik_10_u01_k02_o04: vt([[0, 20], [2, 14], [4, 8]], { not: "Sürat azalıyor → ivme HAREKET YÖNÜNÜN TERSİNE" }),
  fizik_10_u01_k02_o05: vt([[0, 5], [3, 14], [6, 23]], { not: "v: 5 → 23 m/s (6 s) · a = 18/6 = 3 m/s²" }),
  fizik_10_u01_k02_o06: vt([[0, -5], [3, -14], [6, -23]], { not: "Batıya giderken hızlanıyor: v negatif ve büyüyor → ivme de negatif" }),
  fizik_10_u01_k02_o07: vt([[0, 3], [3, 9], [6, 15]], { not: "v₀ = 3 · a = 2 · t = 6 → v = 3 + 12 = 15 m/s" }),
  fizik_10_u01_k02_o08: vt([[0, 0], [3, 9], [6, 18]], { alan: true, not: "Durgun başlangıç, a = 3 m/s² · taralı alan = yer değiştirme = 54 m" }),
  fizik_10_u01_k02_o09: vt([[0, 12], [4, 0], [8, -12]], { alan: true, not: "+12 → −12 m/s (8 s) · net alan = net yer değiştirme" }),
  fizik_10_u01_k02_o10: vt([[0, 22], [2, 16], [4, 10]], { not: "v: 22 → 10 m/s (4 s) · a = −12/4 = −3 m/s²" }),
  fizik_10_u01_k02_o11: vt([[0, 2], [3, 8], [6, 14]], { not: "Pozitif eğimli v-t doğrusu → ivme pozitif, araç hızlanıyor" }),
  fizik_10_u01_k02_o12: xt([[0, 0], [0.1, 0.6], [0.2, 1.2], [0.3, 1.8]], { not: "6 m/s sabit · fren 0,3 s sonra → 1,8 m ilerler" })
};

const EK = Object.assign({}, MAT_K01, MAT_K02, MAT_K03, MAT_K04, FIZIK_K01, FIZIK_K02);

// ---------- UYGULA ----------
function svgDenetle(id, g) {
  const hata = [];
  const svg = GV.svg(g);
  if (!svg || svg.length < 120) hata.push("SVG üretilmedi");
  if (/NaN|undefined|Infinity/.test(svg)) hata.push("SVG içinde NaN/undefined");
  const dogrula = GV.dogrula(g);
  dogrula.forEach(h => hata.push("doğrulama: " + h));
  return { hata: hata, svg: svg };
}

const havuzlar = ["mat_10_u01_k01", "mat_10_u01_k02", "mat_10_u01_k03", "mat_10_u01_k04", "fizik_10_u01_k01", "fizik_10_u01_k02"];
let toplam = 0, eklenecek = 0, zatenVar = 0, tanimsiz = 0, hatali = 0;
const hatalar = [];

havuzlar.forEach(function (id) {
  const yol = path.join(HAVUZ, id + ".json");
  const d = JSON.parse(fs.readFileSync(yol, "utf8"));
  (d.sorular || []).forEach(function (q) {
    toplam++;
    const yeni = EK[q.soru_id];
    if (!yeni) { tanimsiz++; hatalar.push("tanım yok: " + q.soru_id + " — " + String(q.metin).slice(0, 70)); return; }
    const dene = svgDenetle(q.soru_id, yeni);
    if (dene.hata.length) { hatali++; hatalar.push(q.soru_id + ": " + dene.hata.join(" | ")); return; }
    if (q.gorsel) zatenVar++;
    if (!q.gorsel || JSON.stringify(q.gorsel) !== JSON.stringify(yeni)) {
      q.gorsel = yeni;
      eklenecek++;
    }
  });
  if (!KONTROL) fs.writeFileSync(yol, JSON.stringify(d, null, 2) + "\n");
});

console.log("Havuzlar: " + havuzlar.length + " · soru: " + toplam);
console.log("Şekil eklenecek/güncellenecek: " + eklenecek + " · önceden görselli: " + zatenVar);
console.log("Tanımı olmayan soru: " + tanimsiz + " · hatalı görsel: " + hatali);
hatalar.slice(0, 20).forEach(h => console.log("  ! " + h));
if (tanimsiz || hatali) process.exit(1);
if (!KONTROL) console.log("\nHavuz dosyaları güncellendi.");
