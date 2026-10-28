#!/usr/bin/env node
/* ============================================================
   SORU HAVUZLARINA GÖRSEL EKLE (scripts/gorsel-ekle.js)
   ------------------------------------------------------------
   Bazı sorular (üçgen, hız-zaman grafiği, vektör bileşenleri)
   görmeden çözülemez. Bu betik soruya `gorsel` alanı ekler;
   site/gorsel.js bu alanı SVG'ye çevirir.

   KURAL: yalnız sorunun METNİNDE VERİLEN bilgi çizilir.
   Cevabı ele verecek şekil çizilmez (ör. "grafiği nasıl olmalı?"
   tipi sorularda şekil eklenmez).

   Kullanım:  node scripts/gorsel-ekle.js          → ekler/günceller
              node scripts/gorsel-ekle.js --kontrol → yalnız rapor
   İdempotent: aynı şekil ikinci kez yazılmaz.
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const HAVUZ = path.join(KOK, "site", "content", "soru_havuzlari");
const GV = require(path.join(KOK, "site", "gorsel.js"));

// ------------------------------------------------------------
// Küratörlü liste: her şekil, soru metnindeki VERİYLE eşleşir.
// ------------------------------------------------------------
const GORSELLER = {
  // --- Matematik 1.1 Dik üçgende trigonometrik oranlar ---
  // "α açısının karşı dik kenarı 7, komşu dik kenarı 24" (α köşesi A)
  mat_10_u01_k01_o01: {
    tip: "ucgen", dik: "C", kenarlar: { a: "7", b: "24", c: "?" },
    aci: "α", aciKose: "A", aciklama: "Karşı dik kenar 7, komşu dik kenar 24."
  },
  // "ilk üçgenin karşı ve komşu dik kenarları 9 ve 40 … ikinci x ve 80"
  mat_10_u01_k01_o02: {
    tip: "ucgen", dik: "C", kenarlar: { a: "9", b: "40", c: "?" },
    aci: "α", aciKose: "A",
    not: "2. üçgen: karşı x, komşu 80 (aynı dar açı)",
    aciklama: "1. üçgen 9–40; 2. üçgen x–80."
  },
  // "sin α = 20/29" → karşı 20, hipotenüs 29
  mat_10_u01_k01_o03: {
    tip: "ucgen", dik: "C", kenarlar: { a: "20", b: "?", c: "29" },
    aci: "α", aciKose: "A", aciklama: "sin α = 20/29."
  },
  // "tan α = 5/8" → karşı 5, komşu 8
  mat_10_u01_k01_o04: {
    tip: "ucgen", dik: "C", kenarlar: { a: "5", b: "8", c: "?" },
    aci: "α", aciKose: "A", aciklama: "tan α = 5/8."
  },
  // "30°lik açının karşısındaki kenar 8 cm"
  mat_10_u01_k01_o05: {
    tip: "ucgen", dik: "C", kenarlar: { a: "8", b: "?", c: "?" },
    aci: "30°", aciKose: "A", aciklama: "30°'nin karşısı 8 cm."
  },

  // --- Fizik 1.1 Sabit hızlı hareket ---
  // "sabit hızını gösteren yatay hız-zaman doğrusu zaman ekseninin ALTINDA"
  fizik_10_u01_k01_o07: {
    tip: "grafik", xEkseni: "t (s)", yEkseni: "v (m/s)",
    seriler: [{ ad: "v", noktalar: [[0, -6], [4, -6], [8, -6]] }],
    aciklama: "Hız-zaman doğrusu eksenin altında (sabit hız, negatif yön)."
  },

  // --- Fizik 1.2 Bir boyutta sabit ivmeli hareket ---
  // "t=0'da +12 m/s'den t=8 s'de −12 m/s'ye" (grafik VERİ olarak veriliyor)
  fizik_10_u01_k02_o09: {
    tip: "grafik", xEkseni: "t (s)", yEkseni: "v (m/s)",
    seriler: [{ ad: "v", noktalar: [[0, 12], [4, 0], [8, -12]] }],
    aciklama: "Hız-zaman grafiği: t=0'da +12 m/s, t=8 s'de −12 m/s."
  },
  // "hız-zaman grafiği POZİTİF EĞİMLİ bir doğruysa …" (eğim veri, yorum isteniyor)
  fizik_10_u01_k02_o11: {
    tip: "grafik", xEkseni: "t (s)", yEkseni: "v (m/s)",
    seriler: [{ ad: "v", noktalar: [[0, 2], [3, 8], [6, 14]] }],
    aciklama: "Hız-zaman grafiği pozitif eğimli doğru."
  },

  // --- Fizik 1.4 İki boyutta sabit ivmeli hareket ---
  // "yatay hız bileşeni 12 m/s, düşey hız bileşeni 16 m/s"
  fizik_10_u01_k04_o06: {
    tip: "vektor", xEkseni: "vx (m/s)", yEkseni: "vy (m/s)",
    vektorler: [{ ad: "vx = 12", x: 12, y: 0 }, { ad: "vy = 16", x: 0, y: 16 }, { ad: "v", x: 12, y: 16 }],
    aciklama: "Hız bileşenleri vx = 12 m/s, vy = 16 m/s."
  },
  // "yatayla 30° açı yapan doğrultuda 24 m/s ilk hız"
  fizik_10_u01_k04_o01: {
    tip: "vektor", xEkseni: "x", yEkseni: "y",
    vektorler: [{ ad: "v₀ = 24 m/s", x: 21, y: 12 }],
    aciklama: "İlk hız 24 m/s, yatayla 30°."
  },

  // --- Kimya: denklem denkleştirme şeması ---
  kimya_10_u01_k04_o01: {
    tip: "sema", kutular: ["Tepkenler", "Denkleştir", "Ürünler"],
    aciklama: "Kütle korunumu: iki tarafta atom sayıları eşit olmalı."
  },

  // --- Biyoloji: fotosentez/kemosentez karşılaştırma şeması ---
  biyo_10_u01_k02_o01: {
    tip: "sema", kutular: ["Işık enerjisi", "Fotosentez", "Besin + O₂"],
    aciklama: "Fotosentez ışık enerjisiyle besin üretir."
  }
};

function kontrolRaporu(havuzlar) {
  const sorunlar = [];
  Object.keys(GORSELLER).forEach(function (id) {
    const havuzId = id.replace(/_o\d+$/, "");
    const h = havuzlar.find(function (x) { return x.konu_id === havuzId; });
    if (!h) { sorunlar.push(id + ": havuz yok (" + havuzId + ")"); return; }
    const d = JSON.parse(fs.readFileSync(path.join(HAVUZ, h.dosya || havuzId + ".json"), "utf8"));
    const q = (d.sorular || []).find(function (x) { return x.soru_id === id; });
    if (!q) { sorunlar.push(id + ": soru yok"); return; }
    const hatalar = GV.dogrula(GORSELLER[id]);
    if (hatalar.length) sorunlar.push(id + ": " + hatalar.join(", "));
    if (!GV.svg(GORSELLER[id])) sorunlar.push(id + ": SVG üretilemedi");
  });
  return sorunlar;
}

function calistir(yaz) {
  const manifest = JSON.parse(fs.readFileSync(path.join(HAVUZ, "index.json"), "utf8"));
  const havuzlar = Array.isArray(manifest.havuzlar) ? manifest.havuzlar : [];

  const sorunlar = kontrolRaporu(havuzlar);
  if (sorunlar.length) {
    console.error("✗ Görsel tanımları hatalı:");
    sorunlar.forEach(function (s) { console.error("   • " + s); });
    return 1;
  }

  // Havuz bazında topla
  const gruplar = {};
  Object.keys(GORSELLER).forEach(function (id) {
    const havuzId = id.replace(/_o\d+$/, "");
    (gruplar[havuzId] = gruplar[havuzId] || []).push(id);
  });

  let eklenen = 0, guncellenen = 0, ayni = 0;
  Object.keys(gruplar).forEach(function (havuzId) {
    const h = havuzlar.find(function (x) { return x.konu_id === havuzId; });
    if (!h) return;
    const dosya = path.join(HAVUZ, h.dosya || havuzId + ".json");
    const d = JSON.parse(fs.readFileSync(dosya, "utf8"));
    let degisti = false;
    (d.sorular || []).forEach(function (q) {
      const g = GORSELLER[q.soru_id];
      if (!g) return;
      const mevcut = JSON.stringify(q.gorsel || null);
      const yeni = JSON.stringify(g);
      if (mevcut === yeni) { ayni++; return; }
      if (yaz) {
        q.gorsel = g;
        degisti = true;
        if (mevcut === "null") eklenen++; else guncellenen++;
      }
    });
    // Havuz dosyaları 2 boşluk girintili tutulur; biçim değişirse diff
    // her satırı değişmiş gibi gösterir.
    if (yaz && degisti) fs.writeFileSync(dosya, JSON.stringify(d, null, 2) + "\n", "utf8");
  });

  console.log("Görsel tanımı: " + Object.keys(GORSELLER).length + " soru · " + Object.keys(gruplar).length + " havuz");
  console.log((yaz ? "✓ " : "(kontrol) ") + "eklenen: " + eklenen + " · güncellenen: " + guncellenen + " · zaten aynı: " + ayni);
  return 0;
}

const yaz = !process.argv.includes("--kontrol");
process.exit(calistir(yaz));
