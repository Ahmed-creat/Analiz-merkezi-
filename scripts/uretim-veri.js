#!/usr/bin/env node
/* ============================================================
   ÜRETİM VERİSİ (tek kaynak modülü)
   ------------------------------------------------------------
   Resmî TYMM 2026 verisinden 158 iş emrini BELLEKTE üretir.
   Ayrı bir plan JSON dosyası yoktur — tek doğru kaynak:
     site/content/mufredat/meb_kazanim_10.json

   Tema adları: TYMM resmî sayfalarından (10. sınıf = /12 deseni)
     https://tymm.meb.gov.tr/ogretim-programlari/<ders>-dersi/12
   Din Kültürü TYMM'de listelenmediği için dkab912.pdf s.36-37
   (1.3 ÜNİTE/ÇIKTI/SAAT tablosu) kullanıldı.

   Kullanım:  const U = require("./uretim-veri.js");
              U.plan            → 158 kayıt
              U.planKayit(kod)
   ============================================================ */
"use strict";

const path = require("path");

const KOK = path.join(__dirname, "..");
const MUFREDAT = require(path.join(KOK, "site/content/mufredat/meb_kazanim_10.json"));

/* Ders kısa adları — konu_id ve dosya adlarında kullanılır. */
const KISA = {
  "Biyoloji": "biyo",
  "Coğrafya": "cogr",
  "Din Kültürü": "din",
  "Felsefe": "fel",
  "Fizik": "fiz",
  "Kimya": "kim",
  "Matematik": "mat",
  "Tarih": "tar",
  "Türk Dili ve Edebiyatı": "edebiyat"
};

/* Ders sırası — belgede ve tablolarda bu sıra kullanılır. */
const DERS_SIRA = [
  "Türk Dili ve Edebiyatı", "Matematik", "Fizik", "Kimya", "Biyoloji",
  "Tarih", "Coğrafya", "Felsefe", "Din Kültürü"
];

/* Resmî tema adları — TAMAMI doğrulanmış kaynaktan.
   Kaynak A: https://tymm.meb.gov.tr/ogretim-programlari/<ders>-dersi/12
             (10. sınıf tema listesi; başlıklar birebir)
   Kaynak B: dkab912.pdf s.36-37, "1.3. ÜNİTE ÖĞRENME ÇIKTILARI SAYISI
             VE SÜRE TABLOSU" → 10. SINIF DİN KÜLTÜRÜ VE AHLAK BİLGİSİ. */
const TEMA_ADI = {
  "Türk Dili ve Edebiyatı": {
    1: "Sözün Ezgisi",
    2: "Kelimelerin Ritmi",
    3: "Dünden Bugüne",
    4: "Nesillerin Mirası"
  },
  "Matematik": {
    1: "Geometrik Şekiller",
    2: "İstatistiksel Araştırma Süreci",
    3: "Sayılar",
    4: "Nicelikler ve Değişimler",
    5: "Sayma, Algoritma ve Bilişim",
    6: "Analitik İnceleme",
    7: "Veriden Olasılığa"
  },
  "Fizik": {
    1: "Kuvvet ve Hareket",
    2: "Enerji",
    3: "Elektrik",
    4: "Dalgalar"
  },
  "Kimya": {
    1: "Etkileşim",
    2: "Çeşitlilik",
    3: "Sürdürülebilirlik"
  },
  "Biyoloji": {
    1: "Enerji",
    2: "Ekoloji"
  },
  "Tarih": {
    1: "Türkistan’dan Türkiye’ye (1040-1299)",
    2: "Beylikten Devlete Osmanlı (1299-1453)",
    3: "Cihan Devleti Osmanlı (1453-1683)"
  },
  "Coğrafya": {
    1: "Coğrafyanın Doğası",
    2: "Mekânsal Bilgi Teknolojileri",
    3: "Doğal Sistemler ve Süreçler",
    4: "Beşerî Sistemler ve Süreçler",
    5: "Ekonomik Faaliyetler ve Etkileri",
    6: "Afetler ve Sürdürülebilir Çevre",
    7: "Bölgeler, Ülkeler ve Küresel Bağlantılar"
  },
  "Felsefe": {
    1: "Felsefenin Doğası",
    2: "Felsefe, Mantık ve Argümantasyon",
    3: "Varlık Felsefesi",
    4: "Bilgi Felsefesi",
    5: "Ahlak Felsefesi",
    6: "Estetik ve Sanat Felsefesi",
    7: "Siyaset Felsefesi",
    8: "Din Felsefesi",
    9: "Bilim Felsefesi"
  },
  "Din Kültürü": {
    1: "İslam’da Varlık ve Bilgi",
    2: "Allah’ı Tanımak",
    3: "İslam’ın Evrensel Mesajları",
    4: "Din, Çevre ve Teknoloji",
    5: "İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar"
  }
};

/* Kod → tema + çıktı sırası.
     DKAB.10.1.1 → tema 1, sıra 1
     TDE1.1      → tema 1, sıra 1   (TDE kodlarında sınıf gömülü değil) */
function kodCoz(kod) {
  let m = /^([A-ZİÇĞÖŞÜ]+)\.10\.(\d+)\.(\d+)$/.exec(kod);
  if (m) return { tema: Number(m[2]), sira: Number(m[3]) };
  m = /^([A-ZİÇĞÖŞÜ]+)(\d+)\.(\d+)$/.exec(kod);
  if (m) return { tema: Number(m[2]), sira: Number(m[3]) };
  return null;
}

function sade(s) {
  return String(s == null ? "" : s)
    .toLocaleLowerCase("tr")
    .replace(/[’‘`´]/g, "'")
    .replace(/^[a-eç]\s*\)\s*/i, "")
    .replace(/[.,;:!?"()\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* ---- HEDEF SORU ----------------------------------------------------------
   Taban 10'dur (uygulamanın standardı: her kazanım 10 soru).
   Yalnızca "her süreç bileşenine en az 2 soru" şartı 10'u aşmayı
   gerektiriyorsa artar:  hedef = max(10, 2 × süreç).
   Böylece 158 çıktının 139'u tam 10, 19'u daha fazladır.            */
function hedefHesapla(surecSayisi) {
  return Math.max(10, 2 * surecSayisi);
}

/* ---- FLASHCARD -----------------------------------------------------------
   Kural: HER SORU İÇİN BİR KART. Mevcut 172 havuzun tamamı böyledir
   (150/150, 205/205, 252/252 … flashcard = soru). İsteğe bağlı değildir. */
function flashcardHesapla(hedefSoru) {
  return hedefSoru;
}

/* ---- GÖRSEL --------------------------------------------------------------
   Görsel, kazanımdan sayılamaz. Aynı çıktının soruları farklı ihtiyaçlar
   taşır: "dik kenarları 7 ve 24 olan dik üçgende tan α" görsel ister;
   "1 − cos²x kaçtır" gibi bir özdeşlik sorusu istemez.

   Bu yüzden burada kazanım başına görsel sayısı TANIMLANMAZ.
   Karar, soru yazıldıktan sonra soru bazında verilir:
     - Metin bir şekle gönderme yapıyorsa ("şekilde", "grafikte",
       "düzenekte" …) görsel ZORUNLUDUR — doğrulayıcı bunu arar.
     - Görsel gerekiyorsa site/gorsel.js tipleriyle tanımlanır.
     - Gerektirmiyorsa alan hiç yazılmaz.
   Doğrulayıcı ayrıca "tek tek inceleme" listesi basar.               */


const plan = [];

for (const c of MUFREDAT.ciktilar) {
  const kisa = KISA[c.ders];
  if (!kisa) throw new Error("Ders kısa adı tanımsız: " + c.ders);
  const kc = kodCoz(c.kod);
  if (!kc) throw new Error("Kod çözülemedi: " + c.kod);

  const surec = (c.surec || []).map(s => (typeof s === "string" ? s : s.metin)).filter(Boolean);
  const konuId = `${kisa}_10_t${String(kc.tema).padStart(2, "0")}_c${String(kc.sira).padStart(2, "0")}`;

  plan.push({
    sira: plan.length + 1,
    ders: c.ders,
    ders_kisa: kisa,
    sinif: 10,
    tema: kc.tema,
    tema_adi: (TEMA_ADI[c.ders] || {})[kc.tema] || null,
    kod: c.kod,
    kazanim: c.kazanim,
    surec,
    surec_sayisi: surec.length,
    hedef_soru: hedefHesapla(surec.length),
    flashcard_hedef: flashcardHesapla(hedefHesapla(surec.length)),
    konu_id: konuId,
    dosya: konuId + ".json"
  });
}

const planKayit = new Map(plan.map(c => [c.kod, c]));
const planKonu = new Map(plan.map(c => [c.konu_id, c]));

const ozet = {
  cikti: plan.length,
  surec: plan.reduce((a, b) => a + b.surec_sayisi, 0),
  hedef_soru: plan.reduce((a, b) => a + b.hedef_soru, 0),
  flashcard: plan.reduce((a, b) => a + b.flashcard_hedef, 0),
  ders: new Set(plan.map(c => c.ders)).size,
  tema_adli: plan.filter(c => c.tema_adi).length
};

module.exports = {
  KISA, DERS_SIRA, TEMA_ADI,
  plan, planKayit, planKonu, ozet,
  kodCoz, sade, hedefHesapla, flashcardHesapla
};
