#!/usr/bin/env node
/* ============================================================
   T → U BİRLEŞTİRME (tek seferlik göç aracı)
   ------------------------------------------------------------
   Amaç: depoda iki şema vardı —
     • U havuzu: `ders_10_uNN_kNN` (kitabın konu ağacı)  → 187/214 havuz
     • T havuzu: `ders_10_tNN_cNN` (plan tema/çıktı kimliği) → 27 havuz
   Karar: TEK yapı = U. Bu araç, taşınmış/kopyalanmış dosyaların içeriğini
   yeni kimlikle uyumlu hâle getirir (konu_id, baslik, kaynak_dosya) ve
   `kazanim_konu_10.json` içindeki Din kayıtlarını canlı U havuzlarına bağlar.

   Dosya adı değişiklikleri `git mv` ile yapılır (bkz. commit mesajı);
   bu araç yalnız JSON içeriğini düzeltir. JSON'lar elle düzenlenmez kuralı
   gereği bütün alan yazımı burada yapılır.

   Kullanım: node docs/uretim/araclar/t2u-birlestir.js [--kuru]
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.resolve(__dirname, "../../..");
// v78 (G-15) — tek kaynak: site/content/soru_havuzlari
const SITE = path.join(KOK, "site/content/soru_havuzlari");
const KAZANIM = path.join(KOK, "site/content/mufredat/kazanim_konu_10.json");
const kuru = process.argv.includes("--kuru");

/* Kitap ağacı: konu_id → { konu, kodlar } (Din Kültürü 10) */
const DIN_AGAC = [
  ["din_10_u01_k01", "1.1.1 İslam'da Bilginin Yeri", ["DKAB.10.1.1"]],
  ["din_10_u01_k02", "1.1.2 İslam'da Bilgi Kaynakları", ["DKAB.10.1.1"]],
  ["din_10_u01_k03", "1.2 Allah-Âlem İlişkisi", ["DKAB.10.1.2"]],
  ["din_10_u01_k04", "1.3 Kur'an'dan Mesajlar (Ünite 1)", ["DKAB.10.1.3"]],
  ["din_10_u02_k01", "2.1 Allah'ın Varlığının Delilleri", ["DKAB.10.2.1"]],
  ["din_10_u02_k02", "2.1.1 Kozmolojik Delil", []],
  ["din_10_u02_k03", "2.1.2 Teleolojik Delil", []],
  ["din_10_u02_k04", "2.1.3 Ontolojik Delil", []],
  ["din_10_u02_k05", "2.1.4 Dinî Tecrübe Delili", []],
  ["din_10_u02_k06", "2.2 Allah'ı İsim ve Sıfatlarıyla Tanımak", ["DKAB.10.2.2"]],
  ["din_10_u02_k07", "2.3 Kur'an'dan Mesajlar (Ünite 2)", ["DKAB.10.2.3"]],
  ["din_10_u03_k01", "3.1 İslam'ın Tevhit İlkesi", ["DKAB.10.3.1"]],
  ["din_10_u03_k02", "3.2 İslam'da Adalet ve Eşitlik", ["DKAB.10.3.2"]],
  ["din_10_u03_k03", "3.3 İslam ve Barış", ["DKAB.10.3.3"]],
  ["din_10_u03_k04", "3.4 Kur'an'dan Mesajlar (Ünite 3)", ["DKAB.10.3.4"]],
  ["din_10_u04_k01", "4.1 İnsan, Çevre ve Ahlak", ["DKAB.10.4.1"]],
  ["din_10_u04_k02", "4.2 Teknoloji ve Ahlak", ["DKAB.10.4.2"]],
  ["din_10_u04_k03", "4.3 Çevre ve Teknoloji", ["DKAB.10.4.3"]],
  ["din_10_u04_k04", "4.4 Kur'an'dan Mesajlar (Ünite 4)", ["DKAB.10.4.4"]],
  ["din_10_u05_k01", "5.1 Dinî Yorum Farklılıklarının Sebepleri", ["DKAB.10.5.1"]],
  ["din_10_u05_k02", "5.2 İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar", ["DKAB.10.5.2"]],
  ["din_10_u05_k03", "5.2.1 Ehlisünnet", []],
  ["din_10_u05_k04", "5.2.2 Şia", []],
  ["din_10_u05_k05", "5.3 Kur'an'dan Mesajlar (Ünite 5)", ["DKAB.10.5.3"]]
];

const DERS_DOSYA = {
  "Din Kültürü": "din-10.pdf (MEB, 2025)",
  "Felsefe": "felsefe-10.pdf (MEB, 2025)"
};

function yaz(yol, veri) {
  if (kuru) return;
  fs.writeFileSync(yol, JSON.stringify(veri, null, 2) + "\n", "utf8");
}

/* ---- 1) Havuz dosyalarının kimliğini dosya adına eşitle --------------- */
let duzeltilen = 0;
const dosyalar = fs.readdirSync(SITE).filter(a => /^(din|fel)_10_/.test(a) && a.endsWith(".json"));
for (const ad of dosyalar) {
  const konuId = ad.replace(/\.json$/, "");
  const p = path.join(SITE, ad);
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  const once = JSON.stringify(j);
  j.konu_id = konuId;
  /* soru/kart kimliklerini yeni konu_id ön ekiyle yeniden yaz */
  const idYenile = (eskiId) => {
    const m = /^(\w+?_10_[tu]\d+_[kc]\d+)_o(\d+)$/.exec(String(eskiId || ""));
    return m ? konuId + "_o" + m[2] : eskiId;
  };
  if (Array.isArray(j.sorular)) {
    j.sorular.forEach((q, i) => {
      const yeniId = idYenile(q.soru_id) || (konuId + "_o" + String(i + 1).padStart(2, "0"));
      q.soru_id = yeniId.startsWith(konuId + "_o") ? yeniId : konuId + "_o" + String(i + 1).padStart(2, "0");
      if (q.flashcard && q.flashcard.id) q.flashcard.id = q.soru_id + ":flashcard";
    });
  }
  if (Array.isArray(j.flashcards)) {
    j.flashcards.forEach((f, i) => {
      if (!f || !f.id) return;
      const m = /^(\w+?_10_[tu]\d+_[kc]\d+)_o(\d+)(:flashcard)?$/.exec(String(f.id));
      const temel = m ? konuId + "_o" + m[2] : konuId + "_o" + String(i + 1).padStart(2, "0");
      f.id = temel + ":flashcard";
    });
  }
  if (!j.baslik) {
    if (j.topic_key) j.baslik = String(j.topic_key).split(">").pop().trim();
    else if (j.kazanim) j.baslik = konuId;
  }
  if (!j.topic_key && j.baslik) j.topic_key = j.ders + " > " + j.baslik;
  if (!j.kaynak_dosya && DERS_DOSYA[j.ders]) j.kaynak_dosya = DERS_DOSYA[j.ders];
  if (JSON.stringify(j) !== once) {
    yaz(p, j);
    duzeltilen++;
  }
}
console.log("havuz kimliği düzeltilen dosya:", duzeltilen);

/* ---- 2)kazanim_konu_10.json: Din kayıtlarını canlı U ağacına bağla ---- */
const K = JSON.parse(fs.readFileSync(KAZANIM, "utf8"));
const konular = K.konular || [];
const dinVar = new Map(konular.filter(k => k.ders === "Din Kültürü").map(k => [k.konu_id, k]));
let eklenen = 0, guncel = 0;

/* Eski (2018 numaralandırmasına dayalı) Din kayıtlarını at */
K.konular = konular.filter(k => k.ders !== "Din Kültürü");
for (const [konuId, konu, kodlar] of DIN_AGAC) {
  const dosya = path.join(SITE, konuId + ".json");
  if (!fs.existsSync(dosya)) continue;
  const j = JSON.parse(fs.readFileSync(dosya, "utf8"));
  const tema = Number(j.tema || String(konu).split(".")[0]) || 1;
  const konuAd = j.baslik || konu;
  const kayit = {
    konu_id: konuId,
    ders: "Din Kültürü",
    konu: konuAd,
    tema,
    kodlar,
    guven: kodlar.length ? "elle" : "yok",
    yontem: kodlar.length ? "elle-esleme" : "yapi-farkli",
    skor: kodlar.length ? 1 : 0,
    uyari: kodlar.length ? "" : "Kitapta alt başlık; resmî kazanım kodu üst konuda.",
    gerekce: "Kitabın içindekiler ağacındaki bölüm başlığı esas alındı (tur-2, kitap sayfaları: " +
      String(j.kaynak || "").replace(/^.*?s\./, "s.") + ")."
  };
  if (dinVar.has(konuId)) guncel++; else eklenen++;
  K.konular.push(kayit);
}
const DERS_SIRA = ["Türk Dili ve Edebiyatı", "Matematik", "Fizik", "Kimya", "Biyoloji", "Tarih", "Coğrafya", "Felsefe", "Din Kültürü"];
K.konular.sort((a, b) => {
  const d = DERS_SIRA.indexOf(a.ders) - DERS_SIRA.indexOf(b.ders);
  if (d !== 0) return d;
  return String(a.konu_id).localeCompare(String(b.konu_id), "tr");
});
if (K.ozet && typeof K.ozet === "object") K.ozet.konu_sayisi = K.konular.length;
if (!kuru) fs.writeFileSync(KAZANIM, JSON.stringify(K, null, 2) + "\n", "utf8");
console.log("kazanım eşlemesi: Din kayıt " + (DIN_AGAC.length) + " (güncellenen " + guncel + ", yeni " + eklenen + ") · toplam konu " + K.konular.length);

/* v78 (G-15) — pwa-files kopyası silindi; kazanım dosyasının tek kaynağı
   site/content/mufredat/kazanim_konu_10.json (KAZANIM sabiti). */
/* ---- 3) Kayıt defterinden arşivlenen T havuzlarının izlerini düşür ----- */
const DEFTERLER = [
  path.join(KOK, "content/mufredat/konu_kayit_defteri.json"),
  path.join(KOK, "site/content/mufredat/konu_kayit_defteri.json")
];
for (const d of DEFTERLER) {
  if (!fs.existsSync(d)) continue;
  const D = JSON.parse(fs.readFileSync(d, "utf8"));
  const once = (D.records || []).length;
  D.records = (D.records || []).filter(r => {
    const id = String(r.konu_id || r.id || "");
    if (!/_10_t\d+_c\d+$/.test(id)) return true;          /* T şemalı olmayanlara dokunma */
    return fs.existsSync(path.join(SITE, id + ".json"));     /* yaşayan havuz varsa kalsın */
  });
  const fark = once - D.records.length;
  if (fark > 0) {
    if (!kuru) fs.writeFileSync(d, JSON.stringify(D, null, 2) + "\n", "utf8");
    console.log("defter temizlendi:", path.relative(KOK, d), "-" + fark + " kayıt → " + D.records.length);
  }
}

console.log(kuru ? "(kuru çalışma — dosya yazılmadı)" : "tamam");
