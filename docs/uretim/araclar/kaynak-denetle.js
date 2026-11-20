#!/usr/bin/env node
/* ============================================================
   KAYNAK DENETİMİ (docs/uretim/araclar/kaynak-denetle.js)
   ------------------------------------------------------------
   NEDEN VAR?
   Kapılar (havuz-son-kontrol, soru-uret-dogrula) havuzun YAPISINI
   denetliyordu: 10 soru, 4 şık, dogru_index, kart eşliği, başlık
   eşleşmesi… Ama "bu soru ders kitabından mı üretildi?" sorusunu
   hiç sormuyordu. Bu yüzden uygulamayla birlikte gelen eski soru
   bankası (kaynak_dosya: "10. Sınıf … json.zip") havuzları da
   "kontrollerden geçti" sayılıyordu.

   Bu denetim üç şeyi arar:
     1) Kaynak türü: ders kitabı mı, hazır paket mi, belirsiz mi?
     2) Sayfa aralığı: kitabın gerçek sayfa sayısı içinde mi?
     3) Konu-sayfa uyumu: havuzun sayfaları, bağlı olduğu konunun
        kitaptaki sayfa aralığıyla örtüşüyor mu?
        (Örnek hata: periyodik hareket havuzu s.275-283 diyordu,
         konu kitapta s.300-308.)

   Kitap metinleri repoda tutulmaz (5 MB). `kitap-kaynak` dalından
   alınır:
     git fetch origin kitap-kaynak
     for f in biyoloji cografya din edebiyat felsefe fizik kimya \
              matematik tarih; do
       git show FETCH_HEAD:$f.json > /tmp/kitaplar/$f.json
     done

   Kullanım:
     node docs/uretim/araclar/kaynak-denetle.js [kitap_dizini]
     (varsayılan: /tmp/kitaplar)
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const HAVUZ_DIR = path.join(KOK, "site", "content", "soru_havuzlari");
const KITAP_DIZIN = process.argv[2] || "/tmp/kitaplar";

/* ders adı (konular.js) → kitap metni dosyası */
const KITAP = {
  "Biyoloji": "biyoloji",
  "Coğrafya": "cografya",
  "Din Kültürü": "din",
  "Türk Dili ve Edebiyatı": "edebiyat",
  "Felsefe": "felsefe",
  "Fizik": "fizik",
  "Kimya": "kimya",
  "Matematik": "matematik",
  "Tarih": "tarih"
};
/* havuz kimliği öneki → ders adı */
const ONEK = {
  biyo: "Biyoloji", cogr: "Coğrafya", din: "Din Kültürü", edebiyat: "Türk Dili ve Edebiyatı",
  fel: "Felsefe", fiz: "Fizik", fizik: "Fizik", kim: "Kimya", kimya: "Kimya",
  mat: "Matematik", tar: "Tarih", tarih: "Tarih"
};

const { KONULAR } = require(path.join(KOK, "konular.js"));

/* ---------------- kitap metinleri + içindekiler ---------------- */
function kitapOku(slug) {
  const yol = path.join(KITAP_DIZIN, slug + ".json");
  if (!fs.existsSync(yol)) return null;
  return JSON.parse(fs.readFileSync(yol, "utf8"));
}

const duz = s => String(s == null ? "" : s).replace(/\s+/g, " ").trim();

/* "1.1. Sabit Hızlı Hareket 16" satırlarını yakalar */
function icindekiler(kitap) {
  const harita = new Map();
  for (const p of kitap.sayfalar || []) {
    const t = duz(p.metin);
    if (!/İçindekiler|IÇINDEKILER/i.test(t.slice(0, 400))) continue;
    const re = /(\d+)\.(\d+)\.?\s+([A-ZÇĞİÖŞÜ][^0-9]{4,90}?)\s+(\d{1,3})(?=\s|$)/g;
    let m;
    while ((m = re.exec(t))) {
      const no = m[1] + "." + m[2];
      const sayfa = Number(m[4]);
      const baslik = duz(m[3]).replace(/\s+/g, " ");
      if (sayfa > 0 && sayfa <= (kitap.sayfa_sayisi || 1000) && !harita.has(no)) {
        harita.set(no, { baslik, sayfa });
      }
    }
  }
  return harita;
}

/* "s.34-41" / "s. 34 - 41" → { ilk, son } */
function sayfaAraligi(metin) {
  const m = duz(metin).match(/s\.?\s*(\d{1,3})\s*(?:[-–]\s*(\d{1,3}))?/);
  if (!m) return null;
  const ilk = Number(m[1]);
  const son = m[2] ? Number(m[2]) : ilk;
  return { ilk, son: Math.max(ilk, son) };
}

/* ---------------- havuzların kaynak türü ---------------- */
function kaynakTuru(havuz) {
  const kd = duz(havuz.kaynak_dosya);
  const k = duz(havuz.kaynak);
  if (sayfaAraligi(k)) return "kitap";
  if (/\.zip/i.test(kd)) return "zip";
  if (/elle yaz/i.test(kd)) return "elle";
  if (/\.pdf/i.test(kd)) return "pdf";
  return "belirsiz";
}

const kutular = {};
const hatalar = [];
const uyarilar = [];
let toplamHavuz = 0;

for (const dosya of fs.readdirSync(HAVUZ_DIR).filter(f => f.endsWith(".json") && f !== "index.json")) {
  const havuz = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, dosya), "utf8"));
  const id = dosya.replace(/\.json$/, "");
  const onek = id.split("_10")[0];
  const ders = ONEK[onek] || "?";
  const tur = kaynakTuru(havuz);
  toplamHavuz++;

  kutular[ders] = kutular[ders] || { toplam: 0, kitap: 0, zip: 0, elle: 0, pdf: 0, belirsiz: 0 };
  kutular[ders].toplam++;
  kutular[ders][tur]++;

  const aralik = sayfaAraligi(duz(havuz.kaynak));
  const kitap = KITAP[ders] ? kitapOku(KITAP[ders]) : null;

  if (tur === "kitap") {
    const sonSayfa = kitap ? kitap.sayfa_sayisi : null;
    if (sonSayfa && aralik && aralik.son > sonSayfa) {
      hatalar.push(id + ": sayfa aralığı kitabın dışında (s." + aralik.ilk + "-" + aralik.son + " > " + sonSayfa + " sayfa)");
    }
    /* konu-sayfa uyumu */
    const konu = String(havuz.topic_key || "").split(" > ")[1] || "";
    const noMatch = konu.match(/^(\d+)\.(\d+(?:\.\d+)?)/);
    if (kitap && noMatch && aralik) {
      const no = noMatch[1] + "." + noMatch[2];
      const toc = icindekiler(kitap).get(no);
      if (toc) {
        const sapma = aralik.ilk - toc.sayfa;
        if (sapma < -6 || sapma > 30) {
          uyarilar.push(id + ": sayfa " + aralik.ilk + " ama kitapta \"" + no + " " + toc.baslik +
            "\" s." + toc.sayfa + " (sapma " + sapma + ")");
        }
      }
    }
  }
  if (tur === "zip") {
    uyarilar.push(id + ": kaynağı ders kitabı değil (" + duz(havuz.kaynak_dosya) + ")");
  }
}

/* ---------------- ağaç kapsaması ---------------- */
const agac = KONULAR["10"] || {};
const kapsama = {};
for (const ders of Object.keys(agac)) {
  kapsama[ders] = { konu: 0, kitap: 0, zip: 0, yok: 0, zipKonular: [] };
}
const havuzlar = fs.readdirSync(HAVUZ_DIR)
  .filter(f => f.endsWith(".json") && f !== "index.json")
  .map(f => JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, f), "utf8")));

for (const ders of Object.keys(agac)) {
  for (const konu of agac[ders]) {
    kapsama[ders].konu++;
    const key = ders + " > " + konu;
    const h = havuzlar.find(x => String(x.topic_key) === key);
    if (!h) { kapsama[ders].yok++; continue; }
    if (kaynakTuru(h) === "kitap") kapsama[ders].kitap++;
    else { kapsama[ders].zip++; kapsama[ders].zipKonular.push(konu); }
  }
}

/* ---------------- rapor ---------------- */
console.log("== HAVUZ KAYNAĞI (ders bazında)");
console.log("ders".padEnd(24), "havuz", "kitap", "zip", "elle", "pdf", "belirsiz");
for (const [ders, v] of Object.entries(kutular).sort((a, b) => b[1].toplam - a[1].toplam)) {
  console.log(
    ders.padEnd(24),
    String(v.toplam).padStart(5), String(v.kitap).padStart(5),
    String(v.zip).padStart(4), String(v.elle).padStart(4),
    String(v.pdf).padStart(4), String(v.belirsiz).padStart(8)
  );
}
console.log("TOPLAM".padEnd(24), String(toplamHavuz).padStart(5));

console.log("\n== AĞAÇ KAPSAMASI (konu başına)");
console.log("ders".padEnd(24), "konu", "kitap havuzu", "zip havuzu", "havuz YOK");
let T = { konu: 0, kitap: 0, zip: 0, yok: 0 };
for (const [ders, v] of Object.entries(kapsama)) {
  T.konu += v.konu; T.kitap += v.kitap; T.zip += v.zip; T.yok += v.yok;
  console.log(ders.padEnd(24), String(v.konu).padStart(4), String(v.kitap).padStart(11), String(v.zip).padStart(10), String(v.yok).padStart(10));
}
console.log("TOPLAM".padEnd(24), String(T.konu).padStart(4), String(T.kitap).padStart(11), String(T.zip).padStart(10), String(T.yok).padStart(10));

console.log("\n== ÜRETİLMESİ GEREKEN: yalnız hazır paketten havuzu olan konular");
for (const [ders, v] of Object.entries(kapsama)) {
  if (!v.zipKonular.length) continue;
  console.log(" " + ders + " (" + v.zipKonular.length + "):");
  v.zipKonular.forEach(k => console.log("    - " + k));
}

console.log("\n== HATALAR (" + hatalar.length + ")");
hatalar.forEach(h => console.log("  ✗ " + h));
console.log("\n== UYARILAR (" + uyarilar.length + ")");
uyarilar.slice(0, 40).forEach(u => console.log("  ! " + u));
if (uyarilar.length > 40) console.log("  … +" + (uyarilar.length - 40));
