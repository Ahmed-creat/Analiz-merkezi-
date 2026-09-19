// ============================================================
// OKUL SİTESİ ÇEKİCİ + OCR — GitHub Actions'ta çalışır
// 1) Duyurular/sınav tarihleri: deterministik Cheerio tarama (AI YOK)
// 2) Ders programı görsel/PDF: yalnız görseller Tesseract OCR ile okunur.
// Sonuç her kullanıcıya users/{uid}/okul/duyurular olarak yazılır.
// Çalıştırma: FIREBASE_SERVICE_ACCOUNT
// ============================================================
const cheerio = require("cheerio");

// ---- OKULA ÖZEL YAPILANDIRMA ----
const OKUL_SITESI = {
  url: "https://akkentanadolulisesi.meb.k12.tr/icerikler/icerikler/listele_775116_Duyurular",  // Duyurular listesi
  ekUrl: "https://akkentanadolulisesi.meb.k12.tr/icerikler/icerikler/listele_775115_Haberler",   // Haberler listesi
  duyuruSecici: "a",          // MEB CMS: duyurular /icerikler/ bağlantıları
  programAnahtari: /(ders\s*program|haftalık|haftalik|belirtilen\s*gün)/i,
  tarihRegex: /(\d{1,2})[.\/](\d{1,2})[.\/](\d{4})/g
};

const AY_MAP = {
  "oca": "01", "ocak": "01",
  "şub": "02", "sub": "02", "şubat": "02", "subat": "02",
  "mar": "03", "mart": "03", "mrt": "03",
  "nis": "04", "nisan": "04",
  "may": "05", "mayıs": "05", "mayis": "05",
  "haz": "06", "haziran": "06",
  "tem": "07", "temmuz": "07",
  "ağu": "08", "agu": "08", "ağustos": "08", "agustos": "08",
  "eyl": "09", "eylül": "09", "eylul": "09",
  "eki": "10", "ekim": "10",
  "kas": "11", "kasım": "11", "kasim": "11",
  "ara": "12", "aralık": "12", "aralik": "12"
};
function temiz(x) { return String(x || "").replace(/\s+/g, " ").trim(); }
function iki(n) { return String(n).padStart(2, "0"); }
function tarihBul(text) {
  const s = temiz(text);
  OKUL_SITESI.tarihRegex.lastIndex = 0;
  const m = OKUL_SITESI.tarihRegex.exec(s);
  if (m) return m[3] + "-" + iki(m[2]) + "-" + iki(m[1]);
  const alt = s.toLocaleLowerCase("tr-TR").replace(/ı/g, "i");
  const m2 = alt.match(/(\d{1,2})\s*([a-zçğıöşü]{3,8})\s*(\d{4})/i);
  if (m2) {
    const ay = AY_MAP[m2[2]] || AY_MAP[m2[2].slice(0, 3)];
    if (ay) return m2[3] + "-" + ay + "-" + iki(m2[1]);
  }
  return null;
}

function dersBul(baslik) {
  const DERSLER = {
    "türk dili": "Türk Dili ve Edebiyatı", "turk dili": "Türk Dili ve Edebiyatı",
    "türkçe": "Türk Dili ve Edebiyatı", "turkce": "Türk Dili ve Edebiyatı", "edebiyat": "Türk Dili ve Edebiyatı",
    "matematik": "Matematik", "geometri": "Matematik",
    "fizik": "Fizik", "kimya": "Kimya", "biyoloji": "Biyoloji",
    "tarih": "Tarih", "coğrafya": "Coğrafya", "cografya": "Coğrafya",
    "din": "Din Kültürü", "ingilizce": "İngilizce", "almanca": "Almanca",
    "felsefe": "Felsefe"
  };
  const kl = temiz(baslik).toLocaleLowerCase("tr-TR").replace(/ı/g, "i");
  const bulun = Object.keys(DERSLER).find(k => kl.includes(k));
  return bulun ? DERSLER[bulun] : "";
}

function parseDuyurular(html, baseUrl) {
  const $ = cheerio.load(html);
  const duyuruMap = new Map();
  const programMap = new Map();

  $(OKUL_SITESI.duyuruSecici).each((i, a) => {
    let t = temiz($(a).text() || $(a).attr("title") || $(a).attr("aria-label"));
    const href = $(a).attr("href") || "";
    if (!href) return;
    const u = (() => { try { return new URL(href, baseUrl).href; } catch (e) { return ""; } })();
    if (!u) return;

    const ctx = temiz($(a).closest("tr, li, article, .card, .item, .duyuru, .haber").text() || $(a).parent().text());
    if (!t || /^devamı$/i.test(t) || /^devami$/i.test(t)) {
      // "Devamı" linklerinde başlık çoğu zaman aynı satırdaki diğer linkin title/text'idir.
      const rowTitle = temiz($(a).closest("tr, li, article, .card, .item").find("a[title]").first().attr("title") || ctx);
      t = rowTitle || t;
    }
    if (!t || t.length < 8) return;
    const isIcerik = /\/icerikler\//i.test(u);
    const isFile = /\.(png|jpe?g|gif|webp|pdf)(\?|$)/i.test(u);
    const programMi = OKUL_SITESI.programAnahtari.test(t + " " + ctx);

    if (programMi) {
      // Program bir makale sayfası veya doğrudan görsel/pdf olabilir. OCR yalnız doğrudan görselde denenir.
      if (!programMap.has(u)) programMap.set(u, { baslik: t.slice(0, 200), url: u, dosya: isFile });
      return;
    }

    // MEB liste sayfalarında gerçek içerikler /icerikler/...html bağlantılarıdır.
    // Sınav/yazılı/duyuru kelimeleri geçmese bile okul haber/duyurusu olarak saklanır;
    // sınav takvimine otomatik ekleme aşağıda yalnız sınav/yazılı başlıklarında yapılır.
    if (!isIcerik && !/(sınav|sinav|yazılı|yazili|deneme|duyur)/i.test(t + " " + ctx)) return;
    const tarih = tarihBul(t) || tarihBul(ctx);
    const key = u;
    const eski = duyuruMap.get(key);
    const baslik = t.slice(0, 200);
    if (eski && eski.baslik.length >= baslik.length) return;
    const kayit = { baslik, url: u, tarih };
    if (tarih && /(yazılı|yazili|sınav|sinav|deneme)/i.test(baslik)) {
      const lesson = dersBul(baslik);
      if (lesson) kayit.lesson = lesson;
    }
    duyuruMap.set(key, kayit);
  });
  return { duyurular: Array.from(duyuruMap.values()).slice(0, 30), programlar: Array.from(programMap.values()).slice(0, 6) };
}

// Ders programı görseli → METİN: Tesseract OCR (kütüphane, API anahtari GEREKMEZ)
// PDF desteklenmez; görseller (png/jpg) okunur. OCR metninden gün/saat/ders çıkarılır.
async function ocrCevir(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("indirilemedi " + r.status);
  if (/\.pdf(\?|$)/i.test(url)) throw new Error("PDF desteklenmiyor (görsel bekleniyor)");
  const buf = Buffer.from(await r.arrayBuffer());
  const { createWorker } = require("tesseract.js");
  const worker = await createWorker("tur");
  const { data } = await worker.recognize(buf);
  await worker.terminate();
  const metin = (data && data.text ? data.text : "").trim();
  if (!metin) throw new Error("OCR metin bulamadı");
  // Metni yapıya çevir: gün satırları + "HH:MM Ders" satırları
  const GUNLER = ["pazartesi", "sali", "çarşamba", "carsamba", "persembe", "cuma", "cumartesi", "pazar"];
  const gunler = [];
  let suAn = null;
  metin.split(/\r?\n/).forEach(line => {
    const t = line.toLocaleLowerCase("tr-TR");
    const gun = GUNLER.find(g => t.includes(g));
    if (gun && t.split(" ").length <= 4) { suAn = { gun: gun.charAt(0).toUpperCase() + gun.slice(1), dersler: [] }; gunler.push(suAn); return; }
    const m2 = line.match(/(\d{1,2})[:.](\d{2})\s+(.+)/);
    if (m2 && suAn) suAn.dersler.push({ saat: m2[1] + ":" + m2[2], ders: m2[3].trim().slice(0, 40) });
  });
  return gunler.length ? { gunler: gunler } : { ham: metin.slice(0, 3000) };
}

async function main() {
  const DRY = process.env.DRY_RUN === "1";
  const cred = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!cred) { console.error("HATA: FIREBASE_SERVICE_ACCOUNT yok."); process.exit(1); }
  if (!OKUL_SITESI.url) { console.log("OKUL_SITESI.url boş — okul sitesi çekimi pas geçildi (yapılandırma bekleniyor)."); process.exit(0); }

  const admin = require("firebase-admin");
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(cred)) });
  const db = admin.firestore();

  console.log("=== Okul sitesi çekimi: " + OKUL_SITESI.url + " ===");
  const cek = async (u) => {
    const r = await fetch(u, { headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "tr" } });
    return parseDuyurular(await r.text(), u);
  };
  const birinci = await cek(OKUL_SITESI.url);
  const ikinci = OKUL_SITESI.ekUrl ? await cek(OKUL_SITESI.ekUrl).catch(() => ({ duyurular: [], programlar: [] })) : { duyurular: [], programlar: [] };
  const duyurular = birinci.duyurular.concat(ikinci.duyurular);
  const programlar = birinci.programlar.concat(ikinci.programlar);
  console.log("  " + duyurular.length + " duyuru, " + programlar.length + " ders programı dosyası");
  duyurular.slice(0, 8).forEach(d => console.log("    · [" + (d.tarih || "tarih?") + "] " + d.baslik.slice(0, 70)));

  let programJson = null;
  const dogrudanProgram = programlar.find(p => /\.(png|jpe?g|gif|webp)(\?|$)/i.test(p.url));
  if (dogrudanProgram && !DRY) {
    programJson = await ocrCevir(dogrudanProgram.url).catch(e => { console.warn("  OCR hatası: " + e.message); return null; });
    if (programJson) console.log("  ✓ Ders programı OCR ile okundu (" + (programJson.gunler ? programJson.gunler.length + " gün" : "ham metin") + ")");
  }

  if (DRY) { console.log("=== BİTTİ (KURU) ==="); process.exit(0); }
  const users = await db.collection("users").listDocuments();
  for (const u of users) {
    await u.collection("okul").doc("duyurular").set({ updatedAt: Date.now(), duyurular: duyurular, program: programJson });
  }
  console.log("=== BİTTİ: " + users.length + " kullanıcının okul/duyurular belgesi güncellendi ===");
  process.exit(0);
}
if (require.main === module) {
  main().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
}
module.exports = { OKUL_SITESI, parseDuyurular, tarihBul, dersBul };
