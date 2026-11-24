#!/usr/bin/env node
/* ============================================================
   ODSGM "Konu-Soru Dağılım Tabloları" → JSON (scripts/odsgm-coz.js)
   ------------------------------------------------------------
   NEDEN: Kullanıcı MEB'in resmî "1. Dönem Konu-Soru Dağılım Tablosu"
   PDF'ini verdi ve "verdiğim PDF'teki gibi olacak" dedi. O tablo
   ÜÇ şeyi birlikte veriyor:
       ÜNİTE/TEMA  ·  KONU (içerik çerçevesi)  ·  ÖĞRENME ÇIKTISI (kod + cümle)
   Bu, "hangi dersin hangi konusunda hangi kazanım var" sorusunun
   MEB'in kendi ağzından cevabı.

   İKİ KATMAN (ikisi de resmî, birbirini doğrular):
     A) TYMM öğretim programı  → tüm 10. sınıf çıktıları (meb_kazanim_10.json, 158)
        Kaynak: TYMM Müfredat, PID + PDF + sha256
     B) ODSGM sınav dağılımı    → o çıktıların HANGİ KONUDA sorulacağı (bu dosya, 57)
        Kaynak: odsgm.meb.gov.tr, 2026-2027 1. dönem tablosu

   Girdi : data/odsgm-2026-1donem-10sinif.pdf  (kullanıcının verdiği resmî PDF)
   Çıktı : site/content/mufredat/odsgm_konu_kazanim_10.json

   Kullanım: node scripts/odsgm-coz.js [pdf-yolu]
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const KOK = path.join(__dirname, "..");
const PDF = process.argv[2] || path.join(KOK, "data/odsgm-2026-1donem-10sinif.pdf");
const CIKTI = path.join(KOK, "site/content/mufredat/odsgm_konu_kazanim_10.json");

// PDF tablo çıkarımı Python (pdfplumber) ile yapılır: JS'te güvenilir tablo
// çıkarımı yok. Betik kendi kendine yeter; veri gömülü değildir.
const PY = String.raw`
import pdfplumber, re, json, sys
from collections import defaultdict

pdf_yolu = sys.argv[1]
DERS_RE = re.compile(r"10\. Sınıf (.+?) Dersi")
# "DKAB.10.1.1" · "BİY.10.1.1" · "TDE2.1" · "ENG.9.1.V1" · "10.1.1" (Mat)
KOD_RE = re.compile(r"^((?:[A-ZÇĞİÖŞÜ]{2,5}\.?)?(?:\d+\.)+\d+(?:\.[A-Z]\d+)?)\.?$")
ATLA = ("10. Sınıf", "2026-2027", "Kaynak:", "Tablodaki", "Resmî dosya", "MEB Ölçme", "Ünite/", "Tema", "Konu", "(İçerik", "Öğrenme")

# NEDEN koordinat: ODSGM PDF'inde bazı sayfalarda (Kimya, Fizik) ünite ve
# konu hücreleri DİKEY BİRLEŞİK. pdfplumber'ın tablo çıkarıcısı bu hücreleri
# boş bırakıyor ya da satırları kaydırıyor. Kelimeleri dikey çizgilerin
# verdiği sütun sınırlarına göre yerleştirmek hem doğru hem eksiksiz sonuç verir.

def sayfa_coz(p):
    """Sütun düzenini KODUN KENDİSİNDEN çıkar: kod hangi x'te başlıyorsa
    onun solundaki dikey çizgiler ünite/konu sütunlarını verir. Böylece
    ders başına değişen sütun sayısı (İngilizce'de konu sütunu yok) ve
    sahte hücre kenarlıkları sorun olmaktan çıkar."""
    ham = sorted({round(l["x0"], 1) for l in p.lines if abs(l["x0"] - l["x1"]) < 1})
    xs = []
    for x in ham:
        if not xs or x - xs[-1] >= 15:
            xs.append(x)
    if len(xs) < 2:
        return []

    kelimeler = p.extract_words()
    kodlar = []
    for w in kelimeler:
        if KOD_RE.match(w["text"].rstrip(".")):
            kodlar.append(w)
    if not kodlar:
        return []

    kod_x = min(w["x0"] for w in kodlar)      # kazanım sütununun sol kenarı
    sol = [x for x in xs if x < kod_x - 1]     # ünite / konu sütunlarının sol sınırları
    sag = [x for x in xs if x > kod_x]         # kazanım sütununun sağ sınırı

    sut = defaultdict(list)
    for w in kelimeler:
        x = (w["x0"] + w["x1"]) / 2
        if x < kod_x:
            # soldaki çizgiler: [ünite başlangıcı, konu başlangıcı]
            if len(sol) >= 2 and x >= sol[1]:
                i = 1      # konu sütunu
            else:
                i = 0      # ünite sütunu (tek sütunlu tabloda ünite+konu)
        elif sag and x >= sag[0]:
            i = 3
        else:
            i = 2
        sut[i].append((round(w["top"], 1), w["text"], round(w["x0"], 1)))

    def satirlar(idx):
        ys = defaultdict(list)
        for top, c, x0 in sut[idx]:
            if c:
                ys[top].append((x0, c))
        return [(y, " ".join(c for _, c in sorted(ys[y]))) for y in sorted(ys)]

    def bloklar(idx):
        """Aynı hücrenin alt satırlarını birleştir. Dikey birleşik hücrede
        metin satır satır geliyor ("İSLAM'DA" / "VARLIK" / "VE" / "BİLGİ");
        satır aralığı küçük olanları tek blok say."""
        out = []
        for y, t in satirlar(idx):
            if not t:
                continue
            if out and y - out[-1][1] <= 12:
                out[-1] = (out[-1][0], y, (out[-1][2] + " " + t).strip())
            else:
                out.append((y, y, t))
        return [(bas, t) for bas, son, t in out]

    uniteler = [(y, t) for y, t in bloklar(0) if t and not t.startswith(ATLA)]
    konular = [(y, t) for y, t in bloklar(1) if t and not t.startswith(ATLA)] if len(sol) >= 2 else []

    kaz = satirlar(2)
    kayitlar, aktif, unite, konu = [], None, "", ""
    for y, t in kaz:
        if t.startswith(ATLA) or re.match(r"^Senaryo\s*\d", t):
            continue
        ilk = t.split(" ")[0]
        if KOD_RE.match(ilk.rstrip(".")):
            kod = ilk.rstrip(".")
            u = [x for x in uniteler if x[0] <= y]
            k = [x for x in konular if x[0] <= y]
            if u: unite = u[-1][1]
            if k: konu = k[-1][1]
            aktif = {"kod": kod, "kazanim": t[len(ilk):].strip(), "unite": unite,
                     "konu": konu, "y": y, "senaryolar": []}
            kayitlar.append(aktif)
        elif aktif is not None:
            aktif["kazanim"] = (aktif["kazanim"] + " " + t).strip()

    # Senaryo sayıları hücrenin TAMAMINA yayılır (TDE'de metin uzun, sayı ortada).
    # Bu yüzden her kazanımın aralığı: kendi y'sinden bir sonrakinin y'sine kadar.
    sayilar = [(top, x0, c) for top, c, x0 in sut[3] if c.strip().isdigit()]
    for i, r in enumerate(kayitlar):
        alt = r["y"]
        ust = kayitlar[i + 1]["y"] if i + 1 < len(kayitlar) else 10 ** 6
        # soldan sağa = senaryo sırası (1..n)
        r["senaryolar"] = [c for top, x0, c in sorted(sayilar, key=lambda t: (t[0], t[1]))
                           if alt - 1 <= top < ust - 1]
        del r["y"]
    return kayitlar

kayitlar, ders = [], None
son_unite, son_konu = "", ""
with pdfplumber.open(pdf_yolu) as pdf:
    for i, sayfa in enumerate(pdf.pages):
        metin = sayfa.extract_text() or ""
        m = DERS_RE.search(metin)
        if m and m.group(1).strip() != ders:
            ders = m.group(1).strip()
            son_unite, son_konu = "", ""      # yeni ders: devamlılık sıfırlanır
        elif m:
            ders = m.group(1).strip()
        if not ders:
            continue
        for r in sayfa_coz(sayfa):
            # Dikey birleşik hücre sayfa sonuna taşarsa (Kimya 1.8-1.10)
            # ünite/konu bir sonraki sayfada boş gelir; önceki değer taşınır.
            if r["unite"]:
                son_unite = r["unite"]
            else:
                r["unite"] = son_unite
            if r["konu"]:
                son_konu = r["konu"]
            else:
                r["konu"] = son_konu
            r["ders"] = ders
            r["sayfa"] = i + 1
            r["kazanim"] = re.sub(r"\s+", " ", r["kazanim"]).strip()
            kayitlar.append(r)
json.dump(kayitlar, sys.stdout, ensure_ascii=False)
`;

const ham = JSON.parse(execFileSync("python3", ["-c", PY, PDF], { maxBuffer: 64 * 1024 * 1024 }).toString());

// Ders adı kanonikleştir (uygulamanın kullandığı adlar)
const KANON = {
  "Türk Dili ve Edebiyatı": "Türk Dili ve Edebiyatı",
  "Matematik": "Matematik",
  "Fizik": "Fizik",
  "Kimya": "Kimya",
  "Biyoloji": "Biyoloji",
  "Tarih": "Tarih",
  "Coğrafya": "Coğrafya",
  "Felsefe": "Felsefe",
  "Din Kültürü ve Ahlak Bilgisi": "Din Kültürü",
  "İngilizce": "İngilizce",
};
const ON_EK = {
  "Türk Dili ve Edebiyatı": "TDE",
  "Fizik": "FİZ", "Kimya": "KİM", "Biyoloji": "BİY", "Tarih": "TAR",
  "Coğrafya": "COĞ", "Felsefe": "FEL", "Din Kültürü": "DKAB", "İngilizce": "ENG",
  "Matematik": "MAT",
};

// Kodu tam biçime çevir: "10.1.1" → "MAT.10.1.1" · "TDE2.1" → "TDE2.1"
function tamKod(ders, kod) {
  if (/^[A-ZÇĞİÖŞÜ]{2,5}/.test(kod)) return kod;
  const p = ON_EK[ders];
  return p ? p + "." + kod : kod;
}

const konular = ham.map(k => {
  const ders = KANON[k.ders] || k.ders;
  return {
    ders,
    unite: k.unite,
    konu: k.konu,
    kod: tamKod(ders, k.kod),
    kazanim: k.kazanim,
    senaryo_sayilari: (k.senaryolar || []).map(Number),
    pdf_sayfa: k.sayfa,
  };
});

// Aynı konu altında birden çok çıktı olabilir: ünite+konu ile grupla
const gruplar = new Map();
konular.forEach(k => {
  const anahtar = k.ders + "|" + k.unite + "|" + k.konu;
  if (!gruplar.has(anahtar)) gruplar.set(anahtar, { ders: k.ders, unite: k.unite, konu: k.konu, ciktilar: [] });
  gruplar.get(anahtar).ciktilar.push({ kod: k.kod, kazanim: k.kazanim, senaryo_sayilari: k.senaryo_sayilari });
});

const dersOzet = {};
konular.forEach(k => { dersOzet[k.ders] = (dersOzet[k.ders] || 0) + 1; });

const cikti = {
  surum: "2026-10-27",
  kaynak: {
    ad: "MEB Ölçme, Değerlendirme ve Sınav Hizmetleri Genel Müdürlüğü (ODSGM)",
    belge: "2026-2027 1. Dönem Konu-Soru Dağılım Tabloları — 10. sınıf (senaryolar)",
    adres: "https://odsgm.meb.gov.tr",
    yayim: "2026-09-10",
    pdf: "data/odsgm-2026-1donem-10sinif.pdf",
    aciklama: "Bakanlığın resmî Excel'inin '10. Sınıf' sekmesinden üretilen PDF; ünite/tema, konu (içerik çerçevesi), öğrenme çıktısı kodu ve cümlesi birebir alındı.",
  },
  program: "Türkiye Yüzyılı Maarif Modeli (TYMM) — 2026-2027 1. dönem ortak yazılı sınav dağılımı",
  ozet: { ders: Object.keys(dersOzet).length, cikti: konular.length, konu: gruplar.size, ders_bazli: dersOzet },
  konular: Array.from(gruplar.values()),
  duz: konular,
};

fs.mkdirSync(path.dirname(CIKTI), { recursive: true });
fs.writeFileSync(CIKTI, JSON.stringify(cikti, null, 1) + "\n", "utf8");
console.log("ODSGM tablosu yazıldı: " + path.relative(KOK, CIKTI));
console.log("  ders: " + cikti.ozet.ders + " · konu: " + cikti.ozet.konu + " · çıktı: " + cikti.ozet.cikti);
Object.entries(dersOzet).forEach(([d, n]) => console.log("   " + d.padEnd(26) + n));
