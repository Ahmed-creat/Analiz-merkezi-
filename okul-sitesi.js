// ============================================================
// OKUL SİTESİ ÇEKİCİ + GEMINI VISION — GitHub Actions'ta çalışır
// 1) Duyurular/sınav tarihleri: deterministik Cheerio tarama (AI YOK)
// 2) Ders programı görsel/PDF: yalnız bunlar Gemini Vision API'ye
//    gönderülür (metne dönüştürme) → JSON
// Sonuç her kullanıcıya users/{uid}/okul/duyurular olarak yazılır.
// Çalıştırma: FIREBASE_SERVICE_ACCOUNT + (isteğe bağlı GEMINI_API_KEY)
// ============================================================
const cheerio = require("cheerio");

// ---- OKULA ÖZEL YAPILANDIRMA ----
const OKUL_SITESI = {
  url: "https://akkentanadolulisesi.meb.k12.tr/icerikler/icerikler/listele_775116_Duyurular",  // Duyurular listesi
  ekUrl: "https://akkentanadolulisesi.meb.k12.tr/icerikler/icerikler/listele_775115_Haberler",   // Haberler listesi
  duyuruSecici: "a",          // MEB CMS: duyurular /icerikler/ bağlantıları
  programAnahtari: /(ders\s*program|haftalık|belirtilen\s*gün)/i,
  tarihRegex: /(\d{2})[.\/](\d{2})[.\/](\d{4})/g
};

function tarihBul(text) {
  OKUL_SITESI.tarihRegex.lastIndex = 0;
  const m = OKUL_SITESI.tarihRegex.exec(text);
  return m ? m[3] + "-" + m[2] + "-" + m[1] : null;
}

function parseDuyurular(html, baseUrl) {
  const $ = cheerio.load(html);
  const duyurular = [];
  const programlar = [];
  $(OKUL_SITESI.duyuruSecici).each((i, a) => {
    const t = $(a).text().replace(/\s+/g, " ").trim();
    const href = $(a).attr("href") || "";
    if (!t || t.length < 8 || !href) return;
    const u = (() => { try { return new URL(href, baseUrl).href; } catch (e) { return ""; } })();
    if (!u) return;
    if (OKUL_SITESI.programAnahtari.test(t)) {
      if (/\.(png|jpe?g|gif|pdf)(\?|$)/i.test(u)) programlar.push({ baslik: t, url: u });
    } else if (/(sınav|yazılı|deneme|duyur)/i.test(t)) {
      const tarih = tarihBul(t) || tarihBul($(a).parent().text());
      duyurular.push({ baslik: t.slice(0, 200), url: u, tarih: tarih });
    }
  });
  return { duyurular: duyurular.slice(0, 30), programlar: programlar.slice(0, 6) };
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
    const t = line.toLowerCase();
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
  if (programlar.length && !DRY) {
    programJson = await ocrCevir(programlar[0].url).catch(e => { console.warn("  OCR hatası: " + e.message); return null; });
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
module.exports = { OKUL_SITESI, parseDuyurular, tarihBul };
