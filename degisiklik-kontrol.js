// ============================================================
// DEĞİŞİKLİK GÖZCÜSÜ — GitHub Actions'ta her 30 dk çalışır
// Mantık: HAFİF kontrol (anlamsal karma karşılaştırma) →
//   değişiklik YOKSA saniyeler içinde çıkar (kotayı korur)
//   değişiklik VARSA: tam çekici çalıştırır (okulizyon-cek /
//   okul-sitesi) + KULLANICIYA ANINDA PUSH atar.
// Karma, HTML'den değil AYIKLANAN İÇERİĞİN JSON'undan üretilir
// (sayfada dönen tarih/sayaçlar sahte alarm üretmez).
// ============================================================
const crypto = require("crypto");
const { execFileSync } = require("child_process");
const { parseSinavListesi } = require("./okulizyon-parser");

function hashOf(obj) {
  return crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex").slice(0, 40);
}
// Okulizyon sayfası anlamsal özeti: sınav linkleri + tablo satır adları
function okzOzet(html) {
  return { linkler: parseSinavListesi(html).map(l => l.name + "|" + l.href) };
}

async function main() {
  const cred = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!cred) { console.error("HATA: FIREBASE_SERVICE_ACCOUNT yok."); process.exit(1); }
  const admin = require("firebase-admin");
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(cred)) });
  const db = admin.firestore();

  // Gözcü yalnız OKUL SİTESİ'ni hafifçe kontrol eder (fetch + karma).
  // Okulizyon girişi gerçek tarayıcı gerektirdiğinden (gizli AJAX API'si)
  // hafif kontrole uygun değil → günlük 07:30 tam turda tarayıcıyla çekilir.
  const { OKUL_SITESI, parseDuyurular } = require("./okul-sitesi.js");

  let okulizyonDegisti = false, siteDegisti = false;
  const hedefKullanicilar = []; // anında push atılacaklar

  // ---- 1) OKUL SİTESİ (herkese açık — global karma) ----
  if (OKUL_SITESI.url) {
    try {
      const r = await fetch(OKUL_SITESI.url, { headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "tr" } });
      const ozet = parseDuyurular(await r.text(), OKUL_SITESI.url);
      const yenı = hashOf(ozet);
      const snap = await db.collection("meta").doc("siteHash").get();
      const eski = snap.exists ? snap.data().okul : null;
      if (eski !== yenı) {
        siteDegisti = true;
        await db.collection("meta").doc("siteHash").set({ okul: yenı }, { merge: true });
        console.log("Okul sitesi DEĞİŞTİ (" + ozet.duyurular.length + " duyuru) — tam çekim tetiklenecek");
      }
    } catch (e) { console.warn("Okul sitesi kontrol edilemedi: " + e.message); }
  }

  const users = await db.collection("users").listDocuments();

  // ---- 3) DEĞİŞİKLİK VARSA: tam çekim + ANINDA push ----
  if (!okulizyonDegisti && !siteDegisti) {
    console.log("Değişiklik yok (" + users.length + " kullanıcı kontrol edildi) — çıkılıyor.");
    process.exit(0);
  }
  if (siteDegisti) {
    console.log("Tam okul sitesi çekimi çalışıyor…");
    execFileSync("node", ["okul-sitesi.js"], { stdio: "inherit", env: process.env });
  }
  // Anında bildirim (tüm token sahiplerine — değişiklik kendi hesabında olmasa da
  // site duyurusu ilgilendirebilir; Okulizyon değişiminde yalnız ilgili kullanıcılara)
  const hedef = okulizyonDegisti && !siteDegisti ? hedefKullanicilar : null;
  const alicilar = [];
  if (hedef) {
    for (const k of hedef) {
      const t = await k.ref.collection("meta").doc("fcm").get();
      if (t.exists) alicilar.push({ token: t.data().token, baslik: "🎓 Okulizyon'da yeni sonuç!", body: "Yeni sınav sonucun işlendi — uygulamayı aç, Analiz Bekliyor listesinde nedenlerini seç." });
    }
  } else {
    for (const u of users) {
      const t = await u.collection("meta").doc("fcm").get();
      if (t.exists) alicilar.push({ token: t.data().token, baslik: "🏫 Okulundan yeni duyuru", body: "Okul sitesinde değişiklik var — duyuruları Okulizyon penceresinden gör." });
    }
  }
  for (const a of alicilar) {
    try {
      await admin.messaging().send({ token: a.token, notification: { title: a.baslik, body: a.body }, android: { priority: "high" } });
      console.log("  ANINDA PUSH ✓ " + a.baslik);
    } catch (e) { console.warn("  push hatası: " + e.message); }
  }
  console.log("Değişiklik işlendi: okulizyon=" + okulizyonDegisti + " site=" + siteDegisti);
  process.exit(0);
}

if (require.main === module) {
  main().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
}
module.exports = { hashOf, okzOzet };
