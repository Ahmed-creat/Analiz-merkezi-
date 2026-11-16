// Koçluk Hattı ARAYÜZ testi (tarayıcı olmadan, küçük bir DOM taklidiyle).
// Amaç: "mesaj özelliği"nin gerçekten açıldığını, yazı yazılabildiğini,
// yanıt geldiğini ve sohbetin cihazda saklandığını doğrulamak.
// node tests/mesaj-ui.test.js
const fs = require("node:fs");
const path = require("node:path");

const KOK = path.resolve(__dirname, "..");
const DOSYA = path.join(KOK, "site", "mesaj.js");

// ---- Küçük DOM taklidi ----
function El(tag) {
  this.tagName = String(tag).toUpperCase();
  this.children = [];
  this.style = {};
  this.attrs = {};
  this.listeners = {};
  this.classlar = new Set();
  this._text = "";
  this.id = "";
  this.className = "";
  this.value = "";
  this.classList = {
    contains: (c) => this.classlar.has(c),
    add: (c) => this.classlar.add(c),
    remove: (c) => this.classlar.delete(c),
    toggle: (c) => (this.classlar.has(c) ? (this.classlar.delete(c), false) : (this.classlar.add(c), true))
  };
}
Object.defineProperty(El.prototype, "textContent", {
  get() { return this.children.length ? this.children.map((c) => c.textContent).join("") : this._text; },
  set(v) { this._text = v == null ? "" : String(v); this.children = []; }
});
El.prototype.appendChild = function (c) { this.children.push(c); c.parentNode = this; return c; };
El.prototype.setAttribute = function (k, v) { this.attrs[k] = String(v); };
El.prototype.getAttribute = function (k) { return this.attrs[k]; };
El.prototype.addEventListener = function (tip, fn) { (this.listeners[tip] = this.listeners[tip] || []).push(fn); };
El.prototype.tetikle = function (tip, olay) { (this.listeners[tip] || []).forEach((fn) => fn(olay || { preventDefault() {} })); };
El.prototype.tumunuBul = function (id, acc) {
  acc = acc || [];
  if (this.id === id) acc.push(this);
  this.children.forEach((c) => c.tumunuBul && c.tumunuBul(id, acc));
  return acc;
};

const body = new El("body");
const head = new El("head");
const panel = new El("div");
panel.id = "coach-panel";
panel.classList.add("hidden");
panel.appendChild(new El("div")); // #coach-messages yerine geçen mevcut içerik
body.appendChild(panel);

const document_ = {
  readyState: "complete",
  head,
  body,
  createElement: (t) => new El(t),
  getElementById(id) {
    if (id === "coach-panel") return panel;
    const bulunan = body.tumunuBul(id).filter((e) => e.id === id);
    return bulunan[0] || null;
  },
  addEventListener() {}
};

const depo = {};
const window_ = {
  document: document_,
  localStorage: {
    getItem: (k) => (k in depo ? depo[k] : null),
    setItem: (k, v) => { depo[k] = String(v); },
    removeItem: (k) => { delete depo[k]; }
  },
  state: {
    user: { name: "MUHAMMED EFE", grade: 10 },
    exams: [
      { name: "Deneme 1", date: "2026-10-10", lessons: { "Türkçe": { d: 20, w: 5, e: 0 }, "Matematik": { d: 8, w: 6, e: 6 } } },
      { name: "MAARİF İZLEME 1", date: "2026-10-27", net: 97.25, lessons: { "Türkçe": { d: 27, w: 2, e: 1 }, "Matematik-1": { d: 24, w: 2, e: 4 } } }
    ],
    errorLogs: [],
    okulizyon: {
      durum: { kod: "ok", mesaj: "1 sınav, 20 hatalı/boş soru aktarıldı." },
      pending: [{ name: "MAARİF İZLEME 1", date: "2026-10-27", rows: [
        { qno: "7", lesson: "Türkçe", topic: "Metni millî…", status: "w" },
        { qno: "13", lesson: "Türkçe", topic: "Tamlamalar", status: "e" },
        { qno: "2", lesson: "Tarih-1", topic: "Osmanlı", status: "w" }
      ] }]
    },
    reading: { sayfa: 0 },
    plan: { targetNet: 110 }
  },
  daysLeftToExam: () => 42
};

// node ortamında zamanlayıcılar: yanıt hemen gelsin
const zamanlayici = global.setTimeout;

let hata = null;
try {
  new Function("module", "exports", "window", "document", "setInterval", "setTimeout", fs.readFileSync(DOSYA, "utf8"))(
    { exports: {} }, {}, window_, document_, () => 1, (fn) => fn()
  );
} catch (e) { hata = e; }

let gecen = 0, kalan = [];
const ok = (ad, kosul, ek) => { if (kosul) gecen++; else kalan.push(ad + (ek ? " → " + ek : "")); };

ok("mesaj katmanı yüklenirken çökmüyor", !hata, hata && hata.message);
ok("panel kuruldu (koc-sohbet)", !!document_.getElementById("koc-sohbet"));
ok("mesaj giriş alanı var", !!document_.getElementById("koc-girdi"));
ok("gönder düğmesi var", !!document_.getElementById("koc-gonder"));
ok("temizle düğmesi var", !!document_.getElementById("koc-temizle"));

const govde = document_.getElementById("koc-sohbet");
ok("açılışta karşılama mesajı var", govde.children.length === 1 && /Merhaba/.test(govde.textContent), govde.children.length + " balon");
ok("karşılama nasıl soracağını söyler", /netlerim nasıl/.test(govde.textContent));
ok("panel erişilebilirlik etiketi", /Koçluk Hattı/.test(panel.attrs["aria-label"] || ""), panel.attrs["aria-label"]);
ok("sohbet günlüğü (role=log)", govde.attrs.role === "log");

// ---- Mesaj gönderme ----
const form = document_.getElementById("koc-form");
const girdi = document_.getElementById("koc-girdi");
girdi.value = "netlerim nasıl?";
form.tetikle("submit");
const benim = govde.children.filter((c) => /koc-ben/.test(c.className));
const robot = govde.children.filter((c) => /koc-robot/.test(c.className));
ok("yazılan mesaj balonu eklendi", benim.length === 1 && benim[0].textContent === "netlerim nasıl?", String(benim.length));
ok("mesaj gönderildikten sonra giriş temizlenir", girdi.value === "");
ok("koç yanıtı geldi", robot.length === 2, robot.length + " robot balonu");
ok("yanıt gerçek veriden (net 97,25)", /97,25/.test(govde.textContent), govde.textContent.slice(-120));
ok("yanıt deneme adını içerir", /MAARİF İZLEME 1/.test(govde.textContent));

// ---- Kalıcılık ----
const kayit = JSON.parse(depo["am_koc_sohbet_v1"] || "[]");
ok("sohbet localStorage'a yazıldı", kayit.length === 3, JSON.stringify(kayit.map((k) => k.kim)));

// ---- İkinci soru: Okulizyon ----
girdi.value = "Okulizyon'dan hangi sorular geldi?";
form.tetikle("submit");
ok("Okulizyon sorusu yanıtlanır", /3 soru/.test(govde.textContent), govde.textContent.slice(-120));
ok("Okulizyon ders dağılımı gösterilir", /Türkçe 2/.test(govde.textContent));

// ---- HTML enjeksiyonu ----
const kotu = '<img src=x onerror="alert(1)">';
girdi.value = kotu;
form.tetikle("submit");
const sonBen = govde.children.filter((c) => /koc-ben/.test(c.className)).pop();
ok("HTML enjeksiyonu etkisiz (textContent)", sonBen.textContent === kotu && sonBen.children.length === 0, sonBen.textContent);

// ---- Temizle ----
document_.getElementById("koc-temizle").tetikle("click");
ok("temizle sohbeti sıfırlar", govde.children.length === 1 && JSON.parse(depo["am_koc_sohbet_v1"] || "[]").length === 1, govde.children.length + " balon / " + (depo["am_koc_sohbet_v1"] || "yok"));

// ---- Tazeleme kancası (panel her açılışta çağırır) ----
ok("paneli tazeleme kancası var", typeof window_.__kocSohbetTazele === "function");
ok("hazır bayrağı", window_.__kocHazir === true);

// ---- ikinci kez kurulum çoğaltmaz ----
const adetOnce = panel.children.length;
document_.getElementById("koc-sohbet") && new Function("module", "exports", "window", "document", "setInterval", "setTimeout", fs.readFileSync(DOSYA, "utf8"))(
  { exports: {} }, {}, window_, document_, () => 1, (fn) => fn()
);
ok("çift yükleme paneli çoğaltmaz", panel.children.length === adetOnce, panel.children.length + " vs " + adetOnce);

console.log(`\nMesaj arayüzü (Koçluk Hattı) testleri — ${gecen}/${gecen + kalan.length} geçti`);
if (kalan.length) {
  console.error("\nBAŞARISIZ:");
  kalan.forEach((k) => console.error(" ✗ " + k));
  process.exit(1);
}
console.log("✓ tümü geçti");
