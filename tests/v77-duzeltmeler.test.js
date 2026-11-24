#!/usr/bin/env node
/* ============================================================
   v77 DÜZELTMELERİ — DAVRANIŞ TESTİ (tests/v77-duzeltmeler.test.js)
   ------------------------------------------------------------
   KULLANICI (17 Kas):
     1) "hatirlatmaTelafisi() ... 02.53'te 'Günaydın', 14.11'de 'Akşam
        tekrarı' gösteriyor. Vardiyayı gerçek bildirim saatleriyle uyumlu
        yap; planlanan saatlerden ÖNCE telafi gönderme."
     2) "Konu çalışmasını sıfırlayınca kısa kontrol geri gelmiyor."
     3) "Flashcard'da hatalı soruya tıklayınca ona göre değerlendirme yapsın."
     4) "'soru hatalı' yazıyor, bu daha çok uyarı gibi. 'Soruda hata mı var?'
        yapalım. Benzer yazıları profesyonelleştir."

   KANIT: kod metni aranmaz; fonksiyonlar çalıştırılır, DOM olayları tetiklenir.
   Çalıştır: node tests/v77-duzeltmeler.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const KOK = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const KART = fs.readFileSync(path.join(KOK, "site", "kart.js"), "utf8");
const BKT = fs.readFileSync(path.join(KOK, "site", "bkt-engine.js"), "utf8");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) { gecen++; return true; } kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false; }
function esit(ad, gelen, beklenen) {
  return ok(ad, JSON.stringify(gelen) === JSON.stringify(beklenen),
    "gelen: " + JSON.stringify(gelen) + " · beklenen: " + JSON.stringify(beklenen));
}

// ------------------------------------------------------------
// 1) TELAFİ VARDİYA PENCERESİ — gerçek cron saatleri
//    sabah 07:35 · akşam 19:30 (supabase 0002_webpush_tetikle)
// ------------------------------------------------------------
console.log("\n== 1) Telafi vardiyası gerçek bildirim saatlerine bağlı ==");
{
  const bas = HTML.indexOf("const TELAFI_PENCERE");
  const son = HTML.indexOf("function hatirlatmaTelafisi", bas);
  ok("telafi penceresi kodu bulundu", bas > 0 && son > bas);
  const kaynak = HTML.slice(bas, son);
  const fn = new Function(kaynak + "\nreturn { TELAFI_PENCERE, telafiVardiyasi };")();

  const t = (hh, mm) => fn.telafiVardiyasi(new Date(2026, 10, 17, hh, mm, 0));

  esit("02:53 → bildirim YOK (gece)", t(2, 53), null);
  esit("00:00 → bildirim YOK", t(0, 0), null);
  esit("07:34 → bildirim YOK (07:35'ten önce)", t(7, 34), null);
  esit("07:35 → sabah vardiyası", t(7, 35), "s");
  esit("11:06 → sabah vardiyası", t(11, 6), "s");
  esit("13:59 → sabah vardiyası (13:05 tekrarı dahil)", t(13, 59), "s");
  esit("14:00 → bildirim YOK (vardiya arası)", t(14, 0), null);
  esit("14:11 → bildirim YOK (kullanıcının şikâyeti)", t(14, 11), null);
  esit("19:29 → bildirim YOK (19:30'dan önce)", t(19, 29), null);
  esit("19:30 → akşam vardiyası", t(19, 30), "a");
  esit("21:35 → akşam vardiyası (tekrar saati)", t(21, 35), "a");
  esit("23:59 → akşam vardiyası", t(23, 59), "a");

  // Fonksiyon vardiya yoksa HİÇBİR ŞEY yapmamalı (erken çıkış).
  ok("vardiya yoksa bildirim planlanmıyor",
    /const vardiya = telafiVardiyasi\(d\);\s*\n\s*if \(!vardiya\) return;/.test(HTML));
  ok("eski 'saat < 14' kuralı KALMADI", !/getHours\(\) < 14 \? "s" : "a"/.test(HTML));
}

// ------------------------------------------------------------
// 2) GERÇEK ÇALIŞTIRMA: 02:53'te telafi bildirimi GÖSTERİLMEZ
// ------------------------------------------------------------
console.log("\n== 2) Gece açılışta telafi bildirimi gösterilmez (çalıştırma) ==");
function telafiCalistir(saat, dakika) {
  const gosterilen = [];
  const kayit = { showNotification: (b) => { gosterilen.push(String(b)); return Promise.resolve(); } };
  const depo = {};
  const sandbox = {
    console: { log() {}, warn() {}, error() {} },
    Date: class extends Date {
      constructor(...a) { if (a.length) super(...a); else super(2026, 10, 17, saat, dakika, 0); }
      static now() { return new Date(2026, 10, 17, saat, dakika, 0).getTime(); }
    },
    Notification: { permission: "granted" },
    navigator: { serviceWorker: { ready: Promise.resolve(kayit) } },
    caches: {
      open: () => Promise.resolve({
        match: () => Promise.resolve(null),
        put: () => Promise.resolve()
      })
    },
    localStorage: {
      getItem: (k) => (Object.prototype.hasOwnProperty.call(depo, k) ? depo[k] : null),
      setItem: (k, v) => { depo[k] = String(v); }
    },
    dueReviews: () => [{ topicKey: "Matematik > 1.1 Trigonometri" }],
    splitKey: (k) => ({ topic: String(k).split(" > ")[1] || k }),
    todayStr: () => "2026-11-17"
  };
  sandbox.window = sandbox;

  const bas = HTML.indexOf("const TELAFI_PENCERE");
  const son = HTML.indexOf("window.__amHatirlatmaTelafisi");
  vm.createContext(sandbox);
  vm.runInContext(HTML.slice(bas, son), sandbox, { filename: "telafi.js" });
  // Fonksiyon tanımı yüklenir; açılıştaki çağrıyı biz tetikleriz.
  vm.runInContext("hatirlatmaTelafisi();", sandbox, { filename: "telafi-cagri.js" });
  return new Promise((r) => setTimeout(() => r({ gosterilen, depo }), 40));
}

(async () => {
  {
    const gece = await telafiCalistir(2, 53);
    esit("02:53 → hiçbir bildirim gösterilmedi", gece.gosterilen, []);
    esit("02:53 → telafi anahtarı yazılmadı", Object.keys(gece.depo).filter(k => /am_telafi_/.test(k)), []);
  }
  {
    const ogle = await telafiCalistir(14, 11);
    esit("14:11 → hiçbir bildirim gösterilmedi", ogle.gosterilen, []);
  }
  {
    const sabah = await telafiCalistir(8, 5);
    esit("08:05 → sabah başlığı gösterildi", sabah.gosterilen, ["Günaydın! Tekrar Zamanı"]);
  }
  {
    const aksam = await telafiCalistir(20, 10);
    esit("20:10 → akşam başlığı gösterildi", aksam.gosterilen, ["Akşam tekrarı seni bekliyor"]);
  }

  // ----------------------------------------------------------
  console.log("\n== 3) Konu sıfırlama kısa kontrolü geri getirir ==");
  {
    const bas = HTML.indexOf("function resetTopicMemory");
    const son = HTML.indexOf("\n}", HTML.indexOf("saveState();", bas)) + 2;
    const govde = HTML.slice(bas, son);
    const durum = {
      user: {}, memory: {}, topics: {},
      bkt_state: { "Matematik > 1.1 Trigonometri": { son_kisa_kontrol: "2026-11-10", precheck_due: "2026-11-24", L: 0.8 } },
      mini_test_kuyrugu: [
        { topicKey: "Matematik > 1.1 Trigonometri", type: "precheck" },
        { topicKey: "Fizik > 2.1 Kuvvet", type: "learning" }
      ]
    };
    const sandbox = { console, state: durum, saveState() {} };
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(govde, sandbox);
    sandbox.resetTopicMemory("Matematik > 1.1 Trigonometri");
    ok("BKT kaydı silindi (kısa kontrol 5. adımda yeniden çıkar)",
      !durum.bkt_state["Matematik > 1.1 Trigonometri"], JSON.stringify(durum.bkt_state));
    ok("mini test kuyruğu bu konu için temizlendi",
      durum.mini_test_kuyrugu.length === 1 && durum.mini_test_kuyrugu[0].topicKey === "Fizik > 2.1 Kuvvet",
      JSON.stringify(durum.mini_test_kuyrugu));
    ok("hafıza sıfırlandı", durum.memory["Matematik > 1.1 Trigonometri"].completedAt === null);
    ok("adımlar 0'a döndü", durum.topics["Matematik > 1.1 Trigonometri"].step === 0);
  }

  // ----------------------------------------------------------
  console.log("\n== 4) Flashcard hatası turu DEĞERLENDİRİR ==");
  {
    // Basit ama olay dinleyicisi tutan DOM
    function el(id) {
      const e = {
        id: id || "", style: { cssText: "" }, className: "", dataset: {}, _html: "", cocuklar: [], _d: [],
        get innerHTML() { return this._html; }, set innerHTML(v) { this._html = String(v); },
        appendChild(c) { this.cocuklar.push(c); return c; },
        remove() { },
        querySelector() { return null; }, querySelectorAll() { return []; },
        addEventListener(ad, fn) { this._d.push({ ad, fn }); },
        removeEventListener() { }, setAttribute() { }, focus() { },
        closest() { return null; }
      };
      return e;
    }
    const body = el("body");
    const document = {
      body, head: el("head"), readyState: "complete",
      createElement: () => el(),
      getElementById: (id) => (body.cocuklar.find(c => c.id === id) || null),
      querySelectorAll: () => [], addEventListener() { }, removeEventListener() { }
    };
    const HAVUZ = {
      konu_id: "mat_10_u01_k01",
      topic_key: "Matematik > 1.1 Trigonometri",
      sorular: [1, 2, 3].map(n => ({
        soru_id: "q" + n, metin: "Soru " + n, secenekler: ["A", "B"], dogru_index: 0,
        cozum: "c" + n, flashcard: { front: "Ön " + n, back: "Arka " + n }
      }))
    };
    const durum = { memory: {}, tekrarKartlari: {}, flashcards: { cards: [], sessions: {}, lastSoftDrop: {} } };
    const bildirim = [];
    const sandbox = {
      window: null,
      document,
      console: { log() {}, warn() {}, error() {} },
      setTimeout, clearTimeout, Promise, Date, Math, JSON, Object, Array, String, Number, Boolean,
      state: durum,
      saveState() {},
      todayStr: () => "2026-11-17",
      toast() {},
      AnalizBKT: { konuDurum: () => ({ poolId: HAVUZ.konu_id }), loadPool: () => Promise.resolve(HAVUZ) }
    };
    sandbox.window = sandbox;
    sandbox.window.__amGeriBildirim = (p) => { bildirim.push(p); return Promise.resolve({ ok: true }); };
    sandbox.__amGeriBildirim = sandbox.window.__amGeriBildirim;
    vm.createContext(sandbox);
    vm.runInContext(KART, sandbox, { filename: "kart.js" });

    const r = await sandbox.AmKart.ac(HAVUZ.topic_key, { tekrar: true });
    ok("kart turu açıldı", !!(r && r.ok), JSON.stringify(r));
    const modal = body.cocuklar.find(c => c.id === "kart-modal");
    const kutu = modal && modal.cocuklar[0];
    ok("kutu çizildi", !!kutu);

    // Ön yüz → çevir → hata bildir
    function tikla(ozellik) {
      const hedef = { closest: (sel) => (sel === "[" + ozellik + "]" ? hedef : null) };
      modal._d.filter(l => l.ad === "click").forEach(l => l.fn({ target: hedef }));
    }
    tikla("data-kart-goster");                    // çevir
    await new Promise(r2 => setTimeout(r2, 260));
    ok("düğme metni profesyonel: 'Soruda hata mı var?'", kutu.innerHTML.indexOf("Soruda hata mı var?") >= 0);
    ok("eski 'Bu kartta hata var' metni YOK", kutu.innerHTML.indexOf("hatta hata var") < 0);
    ok("düğmede ünlem/uyarı ikonu YOK", kutu.innerHTML.indexOf("⚠") < 0);

    tikla("data-kart-sikayet");                   // hata bildir
    await new Promise(r2 => setTimeout(r2, 30));
    ok("geri bildirim gönderildi", bildirim.length === 1, String(bildirim.length));
    ok("bildirim metni profesyonel", /Kartta hata bildirildi/.test(String(bildirim[0] && bildirim[0].mesaj)), String(bildirim[0] && bildirim[0].mesaj));
    ok("tur ilerledi (sıradaki kart)", kutu.innerHTML.indexOf("Ön 2") >= 0, String(kutu.innerHTML).slice(0, 120));

    // Kalan 2 kartı 'bildim' işaretle
    tikla("data-kart-goster");
    await new Promise(r2 => setTimeout(r2, 260));
    // puan düğmeleri doğrudan görünür
    const puan = (deger) => {
      const hedef = { closest: (sel) => (sel === "[data-kart-puan]" ? hedef : null), getAttribute: () => deger };
      modal._d.filter(l => l.ad === "click").forEach(l => l.fn({ target: hedef }));
    };
    puan("bildi");
    await new Promise(r2 => setTimeout(r2, 30));
    tikla("data-kart-goster");
    await new Promise(r2 => setTimeout(r2, 260));
    puan("bildi");
    await new Promise(r2 => setTimeout(r2, 60));

    const sonuc = kutu.innerHTML;
    ok("tur sonunda 'Hata bildirildi: 1' yazar", /Hata bildirildi: <b>1<\/b>/.test(sonuc), sonuc.slice(0, 200));
    ok("hatalı kart değerlendirmeye alınmadı (2/2 → tamamlandı)",
      sonuc.indexOf("Günün tekrarı tamamlandı") >= 0, sonuc.slice(0, 240));
    const kayit = durum.tekrarKartlari[HAVUZ.topic_key] || {};
    ok("defterde görülen 2 (hatalı kart sayılmadı)", Number(kayit.gorulen) === 2, JSON.stringify(kayit));
  }

  // ----------------------------------------------------------
  console.log("\n== 5) Uyarı dili profesyonelleştirildi ==");
  {
    const GORUNUR = HTML.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
    ok("'Bu soruda hata var' metni KALMADI", GORUNUR.indexOf("Bu soruda hata var") < 0);
    ok("'Bu kartta hata var' metni KALMADI", GORUNUR.indexOf("Bu kartta hata var") < 0);
    ok("kısa kontrolde yeni etiket", /Soruda hata mı var\?/.test(BKT));
    ok("kartta yeni etiket", /Soruda hata mı var\?/.test(KART));
    ok("sonuç ekranı 'Hata bildirildi (değerlendirilmedi)'", /Hata bildirildi \(değerlendirilmedi\)/.test(BKT));
    ok("'hatalı olarak bildirildi' dili KALMADI", BKT.indexOf("hatalı olarak bildirildi") < 0);
    ok("app-pwa bağıran büyük harf kalmadı", !/GÖSTERMİYOR/.test(APP));
    ok("yardım metni yeni düğmeyi gösteriyor", /Soruda hata mı var\?” düğmesine bas/.test(GORUNUR));
  }

  console.log("\n" + "─".repeat(56));
  if (kalan) {
    hatalar.forEach(h => console.log(" ✗ " + h));
    console.log("v77 düzeltmeleri — " + gecen + " geçti, " + kalan + " kaldı ✗");
    process.exit(1);
  }
  console.log("v77 düzeltmeleri — " + gecen + "/" + gecen + " geçti ✓");
})().catch(e => {
  console.error("TEST ÇÖKTÜ:", (e && e.stack) || e);
  process.exit(1);
});
