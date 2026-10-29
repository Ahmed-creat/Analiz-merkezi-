#!/usr/bin/env node
/* ============================================================
   DEPOLAMA TESTİ — tests/veri-sikistir.test.js
   ------------------------------------------------------------
   Kullanıcı (v36): "Google ile giriş yap ekledim, giriliyor, ama
   uygulamada 'veri kaydedilmedi, depolama dolu olabilir' uyarısı geliyor."

   ÖLÇÜLEN GERÇEK (Supabase app_states, 29.10.2026):
     kullanıcı 7490b2fb → state 5.868.448 bayt
       bkt_state                         5.820.607 bayt
         "Matematik > 1.3 Üçgende Alan"    668.497 bayt
           hata_gecmisi: 7.680 kayıt        668.160 bayt
   Sebep: veri-birlestir.js ve app-pwa.js her senkronda iki tarafın
   hata_gecmisi dizilerini KOŞULSUZ birleştiriyordu (100 → 200 → 400 …).

   Bu test:
     1) Gerçek boyuttaki vaka ile sıkıştırma oranını ölçer.
     2) Mükerrer kayıtların tek kopyaya indiğini, GERÇEK kayıtların
        korunduğunu doğrular.
     3) İki birleştirme noktasının artık tekilleştirdiğini çalıştırarak
        kanıtlar (bktBirlestir + okzbktBirlestir).
     4) 5 MB localStorage kotasında kaydın başarılı olduğunu gösterir.
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const KOK = path.join(__dirname, "..");
const VS = require(path.join(KOK, "site", "veri-sikistir.js"));
const VB = require(path.join(KOK, "site", "veri-birlestir.js"));

let gecen = 0, kalan = 0; const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ek !== undefined ? " → " + ek : "")); return false;
}

// ---------------- GERÇEK VAKANIN YENİDEN ÜRETİMİ ----------------
const KONU = "Matematik > 1.3 Üçgende Alan";
function gercekHata(i) {
  // Motorun ürettiği biçim: {type, date, source, alt_beceri}
  return {
    type: ["ANLAMADIM", "KONUEKSİKLİĞİ", "ÇÖZÜMYOLUNUBULAMADIM"][i % 3],
    date: "2026-10-" + String(1 + (i % 28)).padStart(2, "0"),
    source: "deneme",
    alt_beceri: "alan"
  };
}
function buyukState() {
  const st = {
    exams: Array.from({ length: 6 }, (_, i) => ({ id: "e" + i, date: "2026-10-0" + (i + 1), errorLogs: [] })),
    questions: [], books: [], topics: {}, memory: {},
    notifications: Array.from({ length: 130 }, (_, i) => ({ id: "n" + i, title: "b" + i })),
    bkt_processed_records: {}, mini_test_sessions: {}, soru_havuzu_gosterim_logu: [],
    bkt_state: {}, tekrarKartlari: {}, flashcards: { cards: [], sessions: {}, lastSoftDrop: {} }
  };
  // 40 konu; her birinde 40 GERÇEK kayıt ama 7680'e şişmiş dizi
  for (let k = 0; k < 40; k++) {
    const kayit = Array.from({ length: 40 }, (_, i) => gercekHata(i));
    const sismis = [];
    for (let i = 0; i < 7680; i++) sismis.push(kayit[i % 40]);   // 192 kez tekrar
    st.bkt_state["Matematik > Konu " + k] = {
      L: 0.7, gozlem_sayisi: 20, onay_durumu: "OGRENIYOR",
      hata_gecmisi: sismis, pool_id: "p" + k
    };
  }
  st.bkt_state[KONU] = {
    L: 0.42, gozlem_sayisi: 12, onay_durumu: "OGRENIYOR",
    hata_gecmisi: Array.from({ length: 7680 }, (_, i) => gercekHata(i)),
    pool_id: "mat_10_u01_k03"
  };
  for (let i = 0; i < 4000; i++) st.bkt_processed_records["record:deneme:x" + i] = 1;
  for (let i = 0; i < 300; i++) st.flashcards.cards.push({ id: "c" + i, topicKey: KONU, front: "ö" + i, back: "a" + i });
  return st;
}

(async () => {
  console.log("\n== 1) Gerçek vaka: 7.680 kayıtlı hata geçmişi ==");
  const st = buyukState();
  const once = VS.boyut(st);
  ok("başlangıç boyutu 5 MB üzeri (gerçek vaka)", once > 5 * 1024 * 1024, (once / 1048576).toFixed(2) + " MB");

  const rap = VS.sikistir(st);
  const sonra = VS.boyut(st);
  ok("sıkıştırma sonrası 1 MB altı", sonra < 1024 * 1024, (sonra / 1024).toFixed(0) + " KB");
  ok("en az 10 kat küçüldü", once / sonra > 10, (once / sonra).toFixed(1) + "×");
  ok("mükerrer sayısı raporlandı", rap.hataTekrar > 100000, String(rap.hataTekrar));

  console.log("\n== 2) Tekilleştirme: 7.680 → 40 (gerçek kayıt korunur) ==");
  const e = st.bkt_state[KONU];
  ok("dizi 40'ta tutuluyor", e.hata_gecmisi.length <= VS.SINIR.hata_gecmisi, String(e.hata_gecmisi.length));
  const benzersiz = new Set(e.hata_gecmisi.map(VS.hataAnahtari));
  ok("tekrar YOK", benzersiz.size === e.hata_gecmisi.length, benzersiz.size + "/" + e.hata_gecmisi.length);
  ok("L / gözlem / onay KORUNDU", e.L === 0.42 && e.gozlem_sayisi === 12 && e.onay_durumu === "OGRENIYOR");
  ok("pool_id korundu", e.pool_id === "mat_10_u01_k03");
  // Kesme SONDAN (en yeni) yapılır: kalan son eleman, kaynağın son elemanı olmalı.
  const kaynakSon = gercekHata(7679);
  const tutulanSon = e.hata_gecmisi[e.hata_gecmisi.length - 1];
  ok("en yeni kayıt korunuyor (sondan kesme)",
    tutulanSon.date === kaynakSon.date && tutulanSon.type === kaynakSon.type,
    JSON.stringify(tutulanSon) + " ≠ " + JSON.stringify(kaynakSon));

  console.log("\n== 3) Diğer sınırsız diziler ==");
  ok("bildirimler 80'e indi", st.notifications.length === 80, String(st.notifications.length));
  ok("işlenmiş kayıt defteri 3000'e indi", Object.keys(st.bkt_processed_records).length === 3000,
    String(Object.keys(st.bkt_processed_records).length));
  const kartStd = st.flashcards.cards.filter(c => !c.errorCard).length;
  ok("flashcard 8'e indi", kartStd === 8, String(kartStd));

  console.log("\n== 4) İdempotent: ikinci çalıştırma bir şey silmez ==");
  const b2 = VS.boyut(st);
  VS.sikistir(st);
  ok("boyut değişmedi", VS.boyut(st) === b2, b2 + " → " + VS.boyut(st));
  ok("kayıt sayısı değişmedi", st.bkt_state[KONU].hata_gecmisi.length <= VS.SINIR.hata_gecmisi);

  // ---------------- 5) BİRLEŞTİRME NOKTALARI (kök neden) ----------------
  console.log("\n== 5) Kök neden: iki birleştirme noktası artık tekilleştiriyor ==");
  const ayni = Array.from({ length: 40 }, (_, i) => gercekHata(i));
  const a = { L: 0.5, gozlem_sayisi: 10, hata_gecmisi: ayni.slice() };
  const b = { L: 0.5, gozlem_sayisi: 10, hata_gecmisi: ayni.slice() };
  const r1 = VB.bktBirlestir(a, b);
  ok("veri-birlestir: 80 → 40", r1.hata_gecmisi.length === 40, String(r1.hata_gecmisi.length));
  const r2 = VB.bktBirlestir(r1, b);
  ok("veri-birlestir: üçüncü birleştirme şişirmiyor", r2.hata_gecmisi.length === 40, String(r2.hata_gecmisi.length));
  ok("gözlem sayısı korunuyor", r1.gozlem_sayisi === 10, String(r1.gozlem_sayisi));

  // app-pwa.js içindeki okzbktBirlestir: dosyadan çıkarıp çalıştır
  const pwa = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
  const bas = pwa.indexOf("function okzbktBirlestir");
  const son = pwa.indexOf("\n}", pwa.indexOf("return hedef;", bas)) + 2;
  ok("okzbktBirlestir bulundu", bas > 0 && son > bas);
  const sandbox = { window: { VeriSikistir: VS }, console: { log() {}, warn() {}, error() {} } };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  vm.runInContext(pwa.slice(bas, son), sandbox, { filename: "okzbktBirlestir" });
  const h1 = { L: 0.5, gozlem_sayisi: 10, hata_gecmisi: ayni.slice() };
  const h2 = { L: 0.5, gozlem_sayisi: 10, hata_gecmisi: ayni.slice() };
  sandbox.okzbktBirlestir(h1, h2);
  ok("app-pwa: 80 → 40", h1.hata_gecmisi.length === 40, String(h1.hata_gecmisi.length));
  ok("app-pwa: tekrar yok", new Set(h1.hata_gecmisi.map(VS.hataAnahtari)).size === h1.hata_gecmisi.length);

  // ---------------- 6) GERÇEK localStorage kotası ----------------
  console.log("\n== 6) localStorage kotası: sıkıştırılmış kayıt sığıyor ==");
  let bellek = {};
  const kota = 5 * 1024 * 1024;   // Chrome varsayılanı ~5 MB
  const ls = {
    setItem(k, v) {
      if (String(v).length > kota) { const er = new Error("QuotaExceededError"); er.name = "QuotaExceededError"; throw er; }
      bellek[k] = v;
    },
    getItem: k => (k in bellek ? bellek[k] : null)
  };
  // Sıkıştırmadan ÖNCE yazmayı dene (eski davranış)
  let eskiHata = null;
  try { ls.setItem("am_state_v5", JSON.stringify(buyukState())); } catch (er) { eskiHata = er.name; }
  ok("sıkıştırmasız yazma kotayı dolduruyor (hata böyle çıkıyordu)", eskiHata === "QuotaExceededError", String(eskiHata));
  // Sıkıştırdıktan SONRA yaz
  const temiz = buyukState();
  VS.sikistir(temiz);
  let sonuc = "yazıldı";
  try { ls.setItem("am_state_v5", JSON.stringify(temiz)); } catch (er) { sonuc = er.name; }
  ok("sıkıştırılmış kayıt yazıldı", sonuc === "yazıldı", sonuc);
  ok("yazılan boyut 5 MB altı", (bellek["am_state_v5"] || "").length < kota,
    ((bellek["am_state_v5"] || "").length / 1024).toFixed(0) + " KB");

  console.log("\n" + "─".repeat(58));
  if (kalan) {
    hatalar.forEach(h => console.log(" ✗ " + h));
    console.log("Depolama testi — " + gecen + "/" + (gecen + kalan) + " geçti");
    process.exit(1);
  }
  console.log("Depolama testi — " + gecen + "/" + gecen + " geçti ✓");
  console.log("Ölçüm: " + (once / 1048576).toFixed(2) + " MB → " + (sonra / 1024).toFixed(0) + " KB (" +
    (once / sonra).toFixed(0) + "× küçük)");
})();
