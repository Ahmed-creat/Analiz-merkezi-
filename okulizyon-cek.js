// ============================================================
// OKULIZYON ÇEKİCİ — GERÇEK TARAYICI (Playwright) sürümü
// Neden tarayıcı: okulizyon.com girişi gizli bir AJAX API'si kullanıyor
// (düz form POST çalışmıyor). GitHub Actions'ta headless Chromium açar,
// gerçek seçmenlerle (il/ilçe/kurum) giriş yapar, sonuç sayfalarını
// indirip okulizyon-parser.js (deterministik Cheerio) ile ayıklar.
//
// Kullanıcı bilgileri (uygulamadan): settings.okulizyon =
//   { ad, okulNo, sinif, ilce, okulAdi, sifre? }
// Çıktı: users/{uid}/okulizyon/queue (Analiz Bekliyor kuyruğu)
// Çalıştırma: FIREBASE_SERVICE_ACCOUNT="..." node okulizyon-cek.js  (DRY_RUN=1 ilk kullanıcıyı test eder)
// ============================================================
const { parseSinavListesi, parseSonuclar } = require("./okulizyon-parser");

const GIRIS_URL = "https://okulizyon.com/app2/ogrgiris/";
const IL_ADI = "Gaziantep"; // sabit: Akken Anadolu Lisesi → Gaziantep/Şahinbey

async function girisYap(pg, okz) {
  await pg.goto(GIRIS_URL, { waitUntil: "domcontentloaded", timeout: 45000 });
  await pg.waitForTimeout(1500);
  // "Öğrenci No" formu sekmesi kapalıysa aç (sekme başlığı değişken olabilir; form varsa yeter)
  const form = pg.locator("#gt_ogrencino_form");
  if (!(await form.count())) throw new Error("giriş formu bulunamadı (site değişmiş?)");
  // Alanları doldur
  await pg.fill('#gt_ogrencino_form input[name="adsoyad"]', String(okz.ad).toLocaleUpperCase("tr-TR")); // sitedeki gibi büyük harf
  await pg.fill('#gt_ogrencino_form input[name="ogrno"]', String(okz.okulNo));
  try { await pg.selectOption("#gt_ogrencino_sinifcombo", { label: String(okz.sinif || "9") }); } catch (e) { /* sınıf combo opsiyonel */ }
  await pg.selectOption("#gt_ogrencino_ilcombo", { label: IL_ADI });
  await pg.waitForTimeout(1800); // ilçe listesi AJAX ile dolar
  if (okz.ilce) {
    try { await pg.selectOption("#gt_ogrencino_ilcecombo", { label: okz.ilce }); } catch (e) {
      await pg.selectOption("#gt_ogrencino_ilcecombo", { index: 1 }); // ilk ilçe (Şahinbey büyük ilçe, genelde üstte)
    }
    await pg.waitForTimeout(1800); // kurum listesi dolar
  }
  if (okz.okulAdi) {
    try {
      const opt = pg.locator('#gt_ogrencino_kurumkodu option', { hasText: okz.okulAdi.split(" ")[0] }).first();
      const v = await opt.getAttribute("value");
      if (v) await pg.selectOption("#gt_ogrencino_kurumkodu", v);
    } catch (e) { /* kurum seçilemezse devam */ }
  }
  // Gönder
  await pg.locator('#gt_ogrencino_form button[type="submit"], #gt_ogrencino_form .btn-primary').first().click();
  await pg.waitForLoadState("networkidle").catch(() => {});
  await pg.waitForTimeout(2500);
  const html = await pg.content();
  // Giriş başarısı: form kayboldu mu / hata mesajı var mı?
  const hata = /hata|bulunamadı|yanlış|geçersiz/i.test(pg.url() + " " + html.slice(0, 3000)) && await pg.locator("#gt_ogrencino_form:visible").count();
  if (hata) throw new Error("giriş reddedildi — ad/no/sınıf/ilçe/okul bilgilerini kontrol et");
  return html;
}

async function kullaniciCek(browser, userRef, dry) {
  const sSnap = await userRef.collection("state").doc("main").get();
  if (!sSnap.exists) return { status: "atla" };
  let state;
  try { state = JSON.parse(sSnap.data().json || "{}"); } catch (e) { return { status: "atla" }; }
  const okz = state.settings && state.settings.okulizyon;
  if (!okz || !okz.ad || !okz.okulNo) return { status: "bilgi-yok" };

  const ctx = await browser.newContext({ userAgent: "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/126 Mobile Safari/537.36", locale: "tr-TR", viewport: { width: 390, height: 844 } });
  const pg = await ctx.newPage();
  try {
    const anaHtml = await girisYap(pg, okz);
    // Sonuç/sınav linklerini topla (en yeni 3)
    let liste = parseSinavListesi(anaHtml).filter(l => /deneme|sınav|yazılı|sonuç/i.test(l.name));
    const queue = { pulledAt: Date.now(), exams: [] };
    if (!liste.length) {
      // Giriş sonrası doğrudan sonuç tablosu çıkmış olabilir
      const p = parseSonuclar(anaHtml, { name: "Okulizyon Sonucu", date: "", grade: state.user && state.user.grade });
      queue.exams = queue.exams.concat(p.exams);
    }
    for (const s of liste.slice(0, 3)) {
      const u = new URL(s.href, GIRIS_URL).href;
      await pg.goto(u, { waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
      await pg.waitForTimeout(1200);
      const p = parseSonuclar(await pg.content(), { name: s.name, date: "", grade: state.user && state.user.grade });
      queue.exams = queue.exams.concat(p.exams);
    }
    await ctx.close();
    if (!queue.exams.length || !queue.exams.some(e => (e.rows || []).length || Object.keys(e.lessons || {}).length)) {
      return { status: "sonuc-yok" };
    }
    if (dry) {
      console.log("  [KURU] " + okz.ad + " → " + queue.exams.map(e => e.name + " (" + (e.rows || []).length + " satır)").join(", "));
      return { status: "kuru" };
    }
    await userRef.collection("okulizyon").doc("queue").set(queue);
    return { status: "ok", exam: queue.exams.length, rows: queue.exams.reduce((a, e) => a + (e.rows || []).length, 0) };
  } catch (e) {
    await ctx.close();
    return { status: "hata: " + e.message.slice(0, 120) };
  }
}

async function main() {
  const DRY = process.env.DRY_RUN === "1";
  const cred = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!cred) { console.error("HATA: FIREBASE_SERVICE_ACCOUNT yok."); process.exit(1); }
  const admin = require("firebase-admin");
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(cred)) });
  const db = admin.firestore();
  const { chromium } = require("playwright");
  const browser = await chromium.launch({ headless: true });

  const users = await db.collection("users").listDocuments();
  console.log("=== Okulizyon çekimi (" + (DRY ? "KURU" : "CANLI") + "): " + users.length + " kullanıcı ===");
  const ozet = {};
  for (const u of users) {
    const r = await kullaniciCek(browser, u, DRY);
    ozet[r.status] = (ozet[r.status] || 0) + 1;
    if (r.status === "ok") console.log("  ✓ " + u.id.slice(0, 6) + "… " + r.exam + " sınav, " + r.rows + " satır");
    else if (r.status !== "bilgi-yok" && r.status !== "atla") console.log("  · " + u.id.slice(0, 6) + "… " + r.status);
    if (DRY && r.status !== "bilgi-yok" && r.status !== "atla") break; // kuru modda ilk kullanıcı yeter
  }
  await browser.close();
  console.log("=== BİTTİ:", JSON.stringify(ozet), "===");
  process.exit(0);
}
if (require.main === module) {
  main().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
}
module.exports = { GIRIS_URL, girisYap };
