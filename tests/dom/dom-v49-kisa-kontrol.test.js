/* ============================================================
   v49 — KULLANICININ 4 MADDESİ, KOŞTURULARAK ÖLÇÜM
   ------------------------------------------------------------
   1) "süre yetmedi denemede olsun ama soru girişinde olmasın"
   2) "kısa kontrol kendi listesini kullanıyor" → tek taksonomi
   3) "kısa kontrolde 'soru hatalı' derse yine de boş nedeni istiyor;
      hata var derse neden sormasın. Ve çözdüğü soru üzerinden hesapla"
   4) "geri bildirim çalışıyor mu, ben nereden göreceğim"
   Çalıştır: node tests/dom/dom-v49-kisa-kontrol.test.js
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const KOK = path.join(__dirname, "..", "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const BKT = fs.readFileSync(path.join(KOK, "site", "bkt-engine.js"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ayrinti) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); return true; }
  kalan++; hatalar.push(ad + (ayrinti ? " → " + ayrinti : ""));
  console.log("  ✗ " + ad + (ayrinti ? " → " + ayrinti : ""));
  return false;
}

/* bkt-engine'i bkt-engine.test.js ile aynı yöntemle yükle */
const vm = require("vm");
const context = {
  console, Date, Set, Math, JSON, Promise, encodeURIComponent,
  clearTimeout() {}, setTimeout() { return 0; },
  window: {}, document: { readyState: "loading", addEventListener() {} }
};
context.state = {
  user: { name: "Test", grade: "10" },
  bkt_state: {}, bkt_processed_records: {},
  flashcards: { cards: [], sessions: {}, lastSoftDrop: {} },
  mini_test_sessions: {}, mini_test_kuyrugu: [],
  memory: {}, exams: [], questions: [], topics: {}
};
vm.runInNewContext(BKT, context, { filename: "bkt-engine.js" });
const API = context.window.AnalizBKT;
ok("bkt-engine yüklendi (API var)", !!API);

const KONU = "Matematik > 1.1 Trigonometri";
const q3 = [
  { soru_id: "s1", metin: "Soru 1", secenekler: ["a", "b"], dogru_index: 0, cozum: "ç1" },
  { soru_id: "s2", metin: "Soru 2", secenekler: ["a", "b"], dogru_index: 1, cozum: "ç2" },
  { soru_id: "s3", metin: "Soru 3", secenekler: ["a", "b"], dogru_index: 1, cozum: "ç3" }
];

/* ============================================================
   1) KISA KONTROL LİSTELERİ = ORİJİNAL TAKSONOMİ
   ============================================================ */
console.log("\n== 1) Kısa Kontrol tek taksonomiyi kullanıyor ==");
{
  ok("YANLIŞ listesi 4'lü orijinal",
    JSON.stringify(API.WRONG_REASONS) === JSON.stringify(["Konuyu Bilmiyordum", "ANLAMADIM", "İşlem Hatası/Dikkatsizlik", "Kodlama/Kitapçık Hatası"]),
    JSON.stringify(API.WRONG_REASONS));
  ok("BOŞ listesi 2'li orijinal",
    JSON.stringify(API.EMPTY_REASONS) === JSON.stringify(["KONUEKSİKLİĞİ", "ÇÖZÜMYOLUNUBULAMADIM"]),
    JSON.stringify(API.EMPTY_REASONS));
  ok("kısa kontrolde 'Süre yetmedi' YOK (süreli sınav değil)",
    API.WRONG_REASONS.concat(API.EMPTY_REASONS).every(r => !/SÜRE/i.test(r)));
  ok("etiket: Konuyu Bilmiyordum", API.REASON_LABELS["Konuyu Bilmiyordum"] === "Konuyu bilmiyordum");
  ok("etiket: Konu eksiği", API.REASON_LABELS["KONUEKSİKLİĞİ"] === "Konu eksiği");
  // Ağırlık: Konuyu Bilmiyordum, Konu eksiğiyle aynı (1.0) — BKT hesabı bozulmaz
  ok("Konuyu Bilmiyordum ağırlığı 1.0", API.WRONG_WEIGHT["Konuyu Bilmiyordum"] === 1.0);
}

/* ============================================================
   2) "SORU HATALI" → NEDEN SORULMAZ, PUANA KATILMAZ
   ============================================================ */
console.log("\n== 2) Hatalı bildirilen soru hesaba katılmıyor ==");
{
  // 3 soru: 1 doğru (s1), 2 yanlış (s2, s3). s3 "hatalı" bildirildi.
  const r1 = API.submitMiniTest({
    konu_id: KONU, pool_id: "mat_10_u01_k01", questions: q3,
    answers: ["0", "0", "0"], hatali: [2], reasons: {}, mode: "precheck"
  });
  ok("hatalı soru neden listesine girmiyor (needsReasons)", r1.needsReasons === true);
  ok("sadece 2 soru için neden isteniyor", JSON.stringify(r1.wrongIndexes) === "[1]", JSON.stringify(r1.wrongIndexes));
  ok("toplam çözülen 2 (3 − 1 hatalı)", r1.total === 2, "gelen: " + r1.total);
  ok("doğru sayısı 1", r1.correct === 1, "gelen: " + r1.correct);

  // Nedenleri vererek tamamla → puan 1/2
  const r2 = API.submitMiniTest({
    konu_id: KONU, pool_id: "mat_10_u01_k01", questions: q3,
    answers: ["0", "0", "0"], hatali: [2], reasons: { 1: "Konuyu Bilmiyordum" }, mode: "precheck"
  });
  ok("tamamlandı (ok)", r2.ok === true);
  ok("puan çözülen soru üzerinden: 1/2", r2.correct === 1 && r2.total === 2, r2.correct + "/" + r2.total);
  ok("hatalı soru için neden istenmedi", r2.ok === true && !r2.needsReasons);

  // Hatalı soru BKT'ye gözlem YAZMAMALI
  const entry = (context.state.bkt_state || {})[KONU] || {};
  const gozlem = Number(entry.gozlem_sayisi || 0);
  ok("hatalı soru gözlem üretmedi (3 değil 2 gözlem)", gozlem === 2, "gözlem: " + gozlem);

  // Hatalı sorunun cevabı "boş" olsa bile neden İSTENMEZ
  const r3 = API.submitMiniTest({
    konu_id: KONU, pool_id: "mat_10_u01_k01", questions: q3,
    answers: ["0", "", ""], hatali: [2], reasons: {}, mode: "precheck"
  });
  ok("boş bırakılan HATALI soru için neden istenmiyor",
    r3.ok === true || (r3.wrongIndexes || []).indexOf(2) < 0,
    JSON.stringify({ ok: r3.ok, needs: r3.needsReasons, wrong: r3.wrongIndexes, bos: r3.bosIndexes }));
  ok("boş listesinde hatalı soru yok", (r3.bosIndexes || []).indexOf(2) < 0, JSON.stringify(r3.bosIndexes));

  // Hepsi hatalı → kontrol sayılmaz
  const r4 = API.submitMiniTest({
    konu_id: KONU, pool_id: "mat_10_u01_k01", questions: q3,
    answers: ["0", "0", "0"], hatali: [0, 1, 2], reasons: {}, mode: "precheck"
  });
  ok("tüm sorular hatalıysa kontrol sayılmaz", r4.ok === false && r4.reason === "all_flagged", JSON.stringify(r4));

  // Hatalı yoksa eski davranış aynen
  const r5 = API.submitMiniTest({
    konu_id: KONU, pool_id: "mat_10_u01_k01", questions: q3,
    answers: ["0", "1", "1"], reasons: {}, mode: "precheck"
  });
  ok("hatalı yoksa 3 soru üzerinden hesaplanır", r5.ok === true && r5.total === 3 && r5.correct === 3, r5.correct + "/" + r5.total);
}

/* ============================================================
   3) ARAYÜZ: hatalı soruda neden kutusu YOK
   ============================================================ */
console.log("\n== 3) Arayüz: hatalı soru satırında neden kutusu yok ==");
{
  ok("showMiniResult hatalı listesini okuyor", /hataliListe/.test(BKT));
  ok("hatalı satırda neden sorusu koşullu (!ok && !hatali)", /if \(!ok && !hatali\)/.test(BKT));
  ok("hatalı satır etiketi var", /Hatalı \(hesaba katılmadı\)/.test(BKT));
  ok("tıklamada işaretleniyor (_bktHatali)", /modal\._bktHatali\[sira\] = true/.test(BKT));
  ok("işaretlenince sonuç ekranı tazeleniyor", /showMiniResult\(modal, modal\._bktDraft\)/.test(BKT));
  ok("completeMiniTestReasons hatalıyı dışlıyor", /filter\(i => !hataliMi\(i\)\)/.test(BKT));
  ok("puan 'gecerli' üzerinden", /const puan = gecerli \?/.test(BKT));
}

/* ============================================================
   4) GERİ BİLDİRİM GÖRÜNÜRLÜĞÜ
   ============================================================ */
console.log("\n== 4) Geri bildirim: gönderim + görünürlük ==");
{
  ok("geriBildirimlerimYukle fonksiyonu var", /async function geriBildirimlerimYukle/.test(HTML));
  ok("Ayarlar'da GÖNDERDİKLERİM bölümü var", HTML.indexOf("GÖNDERDİKLERİM") > 0);
  ok("liste kutusu var", HTML.indexOf('id="geri-bildirimlerim"') > 0);
  ok("kendi satırlarını okur (user_id filtresi)", /\.eq\("user_id", oturum\.user\.id\)/.test(HTML));
  ok("Ayarlar açılınca yükleniyor", /gere?iBildirimlerimYukle\(\); \} catch/.test(HTML));
  ok("gönderim sonrası liste tazeleniyor", /if \(r\.ok\) geriBildirimlerimYukle\(\);/.test(HTML));
  ok("çevrimdışı kuyruk bilgisi gösteriliyor", /Cihazda bekleyen /.test(HTML));
  ok("giriş yoksa yönlendirme var", /Profil → Giriş yap/.test(HTML));
}

console.log("\n" + "─".repeat(56));
if (kalan) {
  console.log("✗ " + kalan + " test başarısız:");
  hatalar.forEach(x => console.log("   • " + x));
  console.log("v49 — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("v49 — " + gecen + "/" + gecen + " geçti ✓");
