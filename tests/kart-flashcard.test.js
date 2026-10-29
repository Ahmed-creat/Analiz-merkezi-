#!/usr/bin/env node
/* ============================================================
   FLASHCARD TESTİ — tests/kart-flashcard.test.js
   ------------------------------------------------------------
   Kullanıcı (v36):
     • "kartlar flashcard olacak, gerçekten arkasına dönecek" (v37: 3B çevirme)
     • "konunun tekrar edilmesi için flashcardı tamamlamak zorunlu"
     • "flashcard sayısı da raporlarda var"
     • "flashcard ile testin görevleri farklıydı, ikisi aynı yerde olamaz"

   Bu test METNE BAKMAZ: site/kart.js dosyasını sahte bir DOM'da
   GERÇEKTEN çalıştırır, düğmelere basar ve sonucu okur.

   Denetlenenler:
     1) Kart tavanı: en fazla 8 standart + 5 hata kartı (rapor §5.1)
     2) Gerçek 3B çevirme: arka yüz backface-visibility ile gizli; kart döner
     3) Yalnız iki değerlendirme düğmesi: Bildim / Bilemedim
     4) %70 eşiği: 4/5 → gün tamam; 3/5 → tamamlanmaz (rapor §5.4)
     5) Tamamlanınca hafıza barı köprüsü (__kartTamamla) çağrılır
     6) Kısa Kontrol (5 soru) kart ekranından AÇILMAZ — ayrı bölüm
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const KOK = path.join(__dirname, "..");

let gecen = 0, kalan = 0; const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ek !== undefined ? " → " + ek : "")); return false;
}

// ---------------- SAHTE DOM (kart.js'in kullandığı kadar) ----------------
function sahteDom() {
  const dinleyiciler = [];
  function el(tag) {
    const e = {
      tagName: tag, id: "", style: { cssText: "" }, _html: "", cocuklar: [],
      set innerHTML(v) { this._html = String(v); },
      get innerHTML() { return this._html; },
      set textContent(v) { this._html = String(v); },
      get textContent() { return this._html; },
      appendChild(c) { this.cocuklar.push(c); return c; },
      remove() {
        const i = dinleyiciler.findIndex(l => l.el === this);
        if (i >= 0) dinleyiciler.splice(i, 1);
        if (this._ebeveyn) { const j = this._ebeveyn.cocuklar.indexOf(this); if (j >= 0) this._ebeveyn.cocuklar.splice(j, 1); }
      },
      addEventListener(ad, fn) { dinleyiciler.push({ el: this, ad: ad, fn: fn }); }
    };
    return e;
  }
  const body = el("body");
  const document = {
    body: body,
    createElement: t => el(t),
    getElementById: id => {
      if (id === "kart-modal") return body.cocuklar.find(c => c.id === id) || null;
      return null;
    }
  };
  // body.appendChild sırasında modal id'si ata: kart.js modal.id = MODAL_ID yapar
  return { document: document, body: body, dinleyiciler: dinleyiciler, el: el };
}

/**
 * Bir düğmeye "tıkla": o anki ekranda `oznitelik` varsa, tıklanan öğe
 * GERÇEKTEN o düğmedir. `closest()` yalnız bu özniteliği tanır — böylece
 * "Kartı çevir"e basınca kapat düğmesine basılmış sayılmaz.
 */
function tikla(dinleyiciler, modal, oznitelik, deger) {
  const ic = modal.cocuklar[0] ? modal.cocuklar[0].innerHTML : "";
  if (!new RegExp(oznitelik + '(?=[\\s>=]|$)').test(ic)) return false; // ekranda o düğme yok
  // Aynı öznitelik ekranda birden çok kez olabilir (Bildim / Bilemedim);
  // tıklanan, DEĞERİ istenen olan düğmedir.
  const hepsi = [];
  const re = new RegExp(oznitelik + '="([^"]*)"', "g");
  let m;
  while ((m = re.exec(ic)) !== null) hepsi.push(m[1]);
  const bulunan = hepsi.length ? hepsi[0] : "";
  if (deger !== undefined && hepsi.indexOf(deger) < 0) return false;
  const hedef = {
    closest: sel => (sel === "[" + oznitelik + "]" ? { getAttribute: () => (deger !== undefined ? deger : bulunan) } : null)
  };
  dinleyiciler.filter(l => l.el === modal).forEach(l => l.fn({ target: hedef }));
  return true;
}

function kartKur(state, havuz) {
  const dom = sahteDom();
  const sandbox = {
    window: null, document: dom.document,
    console: { log() {}, warn() {}, error() {}, info() {} },
    setTimeout, clearTimeout, Promise, Date, Math, JSON, Object, Array, String, Number, Boolean,
    state: state,
    saveState: () => { sandbox.__kayit = (sandbox.__kayit || 0) + 1; },
    todayStr: () => "2026-10-29"
  };
  sandbox.window = sandbox;
  sandbox.__kartTamamlaCagrildi = [];
  sandbox.__kartTamamla = k => sandbox.__kartTamamlaCagrildi.push(k);
  sandbox.AmKart = null;
  // Motor köprüsü: flashcardReview çağrılarını kaydet
  sandbox.__reviewCagri = [];
  sandbox.AnalizBKT = {
    loadPool: () => Promise.resolve(havuz || null),
    konuDurum: () => ({ poolId: "test_havuz" }),
    flashcardReview: (id, rating) => { sandbox.__reviewCagri.push({ id, rating }); return { ok: true }; }
  };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(KOK, "site", "kart.js"), "utf8"), sandbox, { filename: "kart.js" });
  return { A: sandbox.AmKart, s: sandbox, dom: dom };
}

function bosState() {
  return { memory: {}, tekrarKartlari: {}, flashcards: { cards: [], sessions: {}, lastSoftDrop: {} } };
}

function kartYap(topicKey, adet, hataAdet) {
  const out = [];
  for (let i = 0; i < adet; i++) out.push({ id: "std:" + i, topicKey: topicKey, front: "Ön " + i, back: "Arka " + i, standard: true });
  for (let i = 0; i < (hataAdet || 0); i++) out.push({ id: "err:" + i, topicKey: topicKey, front: "Hata ön " + i, back: "Hata arka " + i, errorCard: true });
  return out;
}

(async () => {
  const K = "Matematik > 1.1 Trigonometri";

  // ---------- 1) Tavan: 8 standart + 5 hata ----------
  console.log("\n== 1) Kart tavanı: 8 standart + 5 hata (rapor §5.1) ==");
  {
    const st = bosState();
    st.flashcards.cards = kartYap(K, 12, 7);
    const { A } = kartKur(st);
    const liste = await A.kartlar(K);
    ok("toplam kart 13'e indi (8+5)", liste.length === 13, String(liste.length));
    const hata = liste.filter(k => k.hataKarti).length;
    ok("hata kartı 5", hata === 5, String(hata));
    ok("standart kart 8", liste.length - hata === 8, String(liste.length - hata));
  }

  // ---------- 2) GERÇEK FLASHCARD: 3B çevirme ----------
  console.log("\n== 2) Gerçek çevirme: 3B dönüş (rotateY) ==\n");
  {
    const st = bosState();
    st.flashcards.cards = kartYap(K, 2, 0);
    const { A, dom } = kartKur(st);
    A.ac(K);
    await new Promise(r => setTimeout(r, 0));
    const modal = dom.body.cocuklar.find(c => c.id === "kart-modal");
    ok("kart penceresi açıldı", !!modal);
    const ic0 = modal.cocuklar[0].innerHTML;
    ok("ön yüz görünüyor", ic0.includes("Ön 0"), ic0.slice(0, 60));
    // İki yüz de DOM'da durur (gerçek çevirme böyle çalışır) ama arka yüz
    // backface-visibility:hidden + rotateY(180deg) ile GÖRÜNMEZ.
    ok("kart sahnesi var (perspective)", ic0.includes("perspective:1200px"));
    ok("iç katman preserve-3d", ic0.includes("preserve-3d"));
    ok("arka yüz gizli (backface-visibility)", ic0.includes("backface-visibility:hidden"));
    ok("arka yüz 180° çevrili", /kart-arka[^>]*rotateY\(180deg\)/.test(ic0));
    ok("kart ön yüzde (rotateY(0deg))", ic0.includes("rotateY(0deg)"));
    ok("'Kartı çevir' düğmesi var", ic0.includes("data-kart-goster"));
    ok("çevirmeden Bildim/Bilemedim YOK", !ic0.includes("data-kart-puan"));

    tikla(dom.dinleyiciler, modal, "data-kart-goster");
    const ic1 = modal.cocuklar[0].innerHTML;
    ok("çevirince kart 180° döndü", ic1.includes("rotateY(180deg)"));
    ok("çevirince arka yüz içeriği görünür", ic1.includes("Arka 0"));
    ok("'ARKA YÜZ' etiketi var", ic1.includes("ARKA YÜZ"));
    ok("Bildim düğmesi", ic1.includes('data-kart-puan="bildi"'));
    ok("Bilemedim düğmesi", ic1.includes('data-kart-puan="bilemedi"'));
    ok("'Zorlandım' düğmesi YOK (rapor §5.1: iki düğme)", !ic1.includes("Zorlandım"));
    // Klasik davranış: karta tekrar dokununca geri döner.
    tikla(dom.dinleyiciler, modal, "data-kart-goster");
    ok("karta tekrar dokununca geri döner", modal.cocuklar[0].innerHTML.includes("rotateY(0deg)"));
    // Kartın kendisinde de çevir düğmesi var (erişilebilirlik).
    ok("çevirmeli kartta 'geri çevir' düğmesi", ic1.includes("data-kart-cevir"));
  }

  // ---------- 3) %70 eşiği: 4/5 tamam, 3/5 tamam değil ----------
  console.log("\n== 3) %70 eşiği (rapor §5.4) ==");
  async function turYap(bilinen, toplam) {
    const st = bosState();
    st.flashcards.cards = kartYap(K, toplam, 0);
    const k = kartKur(st);
    let son = null;
    const p = k.A.ac(K).then(r => { son = r; });
    await new Promise(r => setTimeout(r, 0));
    const modal = k.dom.body.cocuklar.find(c => c.id === "kart-modal");
    for (let i = 0; i < toplam; i++) {
      tikla(k.dom.dinleyiciler, modal, "data-kart-goster");
      tikla(k.dom.dinleyiciler, modal, "data-kart-puan", i < bilinen ? "bildi" : "bilemedi");
    }
    await p;
    // bitiş ekranı: ac() Promise'i kart açılışında çözülür; sonucu kayıttan oku
    return { st: k.s.state, s: k.s, sonuc: k.A.sonucuIsle, ic: modal.cocuklar[0].innerHTML };
  }
  {
    const r = await turYap(4, 5);
    ok("4/5 bildi → gün TAMAMLANDI", r.st.tekrarKartlari[K].tamamlandi === "2026-10-29", JSON.stringify(r.st.tekrarKartlari[K]));
    ok("hafıza köprüsü çağrıldı", r.s.__kartTamamlaCagrildi.indexOf(K) >= 0);
    ok("bildi sayısı 4", r.st.tekrarKartlari[K].bildi === 4, String(r.st.tekrarKartlari[K].bildi));
  }
  {
    const r = await turYap(3, 5);
    ok("3/5 bildi (%60) → gün TAMAMLANMADI", r.st.tekrarKartlari[K].tamamlandi === null, JSON.stringify(r.st.tekrarKartlari[K]));
    ok("hafıza köprüsü çağrılmadı", r.s.__kartTamamlaCagrildi.length === 0);
    ok("bilemedi sayısı 2", r.st.tekrarKartlari[K].bilemedi === 2, String(r.st.tekrarKartlari[K].bilemedi));
  }

  // ---------- 4) Türkçe eşik sınırı: tam %70 ----------
  console.log("\n== 4) Sınır: 7/10 = tam %70 → tamamlanır ==");
  {
    const r = await turYap(7, 10);
    ok("7/10 bildi → tamamlandı", r.st.tekrarKartlari[K].tamamlandi === "2026-10-29", JSON.stringify(r.st.tekrarKartlari[K]));
  }

  // ---------- 5) tekrarDurumu: kartı olan konu zorunlu ----------
  console.log("\n== 5) Kartı olan konunun tekrarı ZORUNLU ==");
  {
    const st = bosState();
    st.flashcards.cards = kartYap(K, 3, 0);
    const { A } = kartKur(st);
    const d = await A.tekrarDurumu(K);
    ok("zorunlu = true", d.zorunlu === true);
    ok("kart sayısı 3", d.kartSayisi === 3, String(d.kartSayisi));
    ok("bugün tamamlanmadı", d.tamamlandi === false);

    const st2 = bosState();
    st2.memory[K] = { schedule: { 3: "2026-10-28" } };
    const k2 = kartKur(st2);
    const d2 = await k2.A.tekrarDurumu("Fizik > Kartı olmayan");
    ok("kartı olmayan konu zorunlu değil", d2.zorunlu === false);
  }

  // ---------- 6) Bölüm ayrımı: kart ekranı Kısa Kontrol açmaz ----------
  console.log("\n== 6) Kart ekranı Kısa Kontrol (5 soru) AÇMAZ ==");
  {
    const kaynak = fs.readFileSync(path.join(KOK, "site", "kart.js"), "utf8");
    ok("kart.js mini test açmıyor", !/openMiniTest|submitMiniTest|data-bkt-test/.test(kaynak));
    ok("kart.js 'Kısa Kontrol' düğmesi basmıyor", !/data-act="bktTest"|bkt-control/.test(kaynak));
    const idx = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
    ok("Konu Takibi'nde Kısa Kontrol ayrı düğme", /bkt-control/.test(idx) && /data-act="kartBasla"/.test(idx));
  }

  console.log("\n" + "─".repeat(58));
  if (kalan) {
    hatalar.forEach(h => console.log(" ✗ " + h));
    console.log("Flashcard testi — " + gecen + "/" + (gecen + kalan) + " geçti");
    process.exit(1);
  }
  console.log("Flashcard testi — " + gecen + "/" + gecen + " geçti ✓");
})();
