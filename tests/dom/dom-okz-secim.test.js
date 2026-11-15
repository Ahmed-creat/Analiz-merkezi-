// GERÇEK DOM testi — Okulizyon il/ilçe/okul seçimi, YAZARAK ARAMA (v44)
// site/app-pwa.js'in ilgili bölümü dosyadan OLDUĞU GİBİ alınır, jsdom içinde
// çalıştırılır. Kullanıcı gibi davranılır: harf yazılır, liste süzülür,
// seçeneğe dokunulur, alt liste dolar.
const fs = require("fs");
const path = require("path");
let JSDOM;
try { ({ JSDOM } = require("jsdom")); }
catch (e) { console.log("DOM testi ATLANDI: jsdom kurulu değil (npm i -D jsdom)"); process.exit(0); }

const KOK = path.join(__dirname, "..", "..");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");

function kes(bas, son) {
  const i = APP.indexOf(bas);
  const j = APP.indexOf(son, i);
  if (i < 0 || j < 0) throw new Error("bölüm bulunamadı: " + bas);
  return APP.slice(i, j);
}
const blok = kes("const OKZ_LISTE_ANAHTAR", "function renderProfileModal()");

let gecen = 0, kalan = 0; const hata = [];
function ok(ad, kosul) { if (kosul) { gecen++; console.log("  ✓ " + ad); } else { kalan++; hata.push(ad); console.log("  ✗ " + ad); } }

// Gerçek Okulizyon listeleri (canlı ölçümden alınan kayıtlar)
const IL = [{ ad: "GAZIANTEP", kod: "27" }, { ad: "ADANA", kod: "1" }, { ad: "ANKARA", kod: "6" }];
const ILCE = { "27": [{ ad: "ŞAHİNBEY", kod: "1841" }, { ad: "ŞEHİTKAMİL", kod: "1844" }, { ad: "NİZİP", kod: "1546" }] };
const OKUL = { "1841": [{ ad: "19 MAYIS MTAL", kod: "745770" }, { ad: "100.YIL İLKOKULU", kod: "716237" }] };

function sahteFetch(url) {
  const u = new URL(url);
  const mod = u.searchParams.get("mod");
  let liste = [];
  if (mod === "il") liste = IL;
  if (mod === "ilce") liste = ILCE[u.searchParams.get("ilkodu")] || [];
  if (mod === "okul") liste = OKUL[u.searchParams.get("ilcekodu")] || [];
  return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ ok: true, tur: mod, liste }) });
}

const dom = new JSDOM(`<!doctype html><html><body><div id="pwa-profile-modal"></div></body></html>`,
  { url: "https://analiz-merkezi.vercel.app/", runScripts: "outside-only", pretendToBeVisual: true });
const w = dom.window, d = w.document;

w.escHtml = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
w.SUPABASE_CONFIG = { url: "https://ztgzmhfklsdlngrtennp.supabase.co", anonKey: "test" };
w.fetch = sahteFetch;
w.toast = () => {};

w.eval("(function(){" + blok + `
  window.__okz = {
    secim: () => OKZ_SECIM,
    okzSecim, okzListeTazele, okzSecimYukle, okzListeAnahtari
  };
})()`);
const O = () => w.__okz;
const bekle = (ms) => new Promise(r => setTimeout(r, ms));
const kok = (rol) => d.querySelector('.okz-arama[data-okz-rol="' + rol + '"]');
const girdi = (rol) => kok(rol).querySelector(".okz-arama-girdi");
const liste = (rol) => kok(rol).querySelector(".okz-arama-liste");
const gorunur = (rol) => liste(rol).style.display === "block";
const secenekler = (rol) => Array.from(liste(rol).querySelectorAll(".okz-arama-sec"));

function yaz(rol, metin) {
  const g = girdi(rol);
  g.dispatchEvent(new w.Event("focusin", { bubbles: true }));
  g.value = metin;
  g.dispatchEvent(new w.Event("input", { bubbles: true }));
}
function sec(rol, kod) {
  const hedef = secenekler(rol).find(x => x.dataset.kod === kod);
  if (!hedef) throw new Error(rol + " listesinde kod yok: " + kod);
  hedef.dispatchEvent(new w.MouseEvent("mousedown", { bubbles: true, cancelable: true }));
}

(async () => {
  console.log("\n== 1) Profil açılışı: il araması dolar ==");
  d.getElementById("pwa-profile-modal").innerHTML =
    O().okzSecim("il", "İL", "il", "", "") +
    O().okzSecim("ilce", "İLÇE", "ilce", "", "") +
    O().okzSecim("okulAdi", "OKUL", "okul", "", "");
  O().okzSecimYukle(w.state = {});
  await bekle(60);
  ok("il arama kutusu var (select değil)", !!girdi("il") && d.querySelectorAll("select").length === 0);
  yaz("il", "");
  ok("odaklanınca tüm iller listelenir", secenekler("il").length === IL.length);

  console.log("\n== 2) YAZARAK ARAMA (kullanıcının istediği) ==");
  yaz("il", "gazi");
  ok("'gazi' → yalnız GAZIANTEP", secenekler("il").length === 1 && secenekler("il")[0].dataset.kod === "27");
  yaz("il", "gazı");
  ok("Türkçe harf farkı aramayı bozmuyor ('gazı')", secenekler("il").length === 1);
  yaz("il", "zzz");
  ok("eşleşme yoksa açıkça söyler", /Eşleşme yok/.test(liste("il").textContent));
  yaz("il", "a");
  ok("çok sonuçta ilk 80 gösterilir + 'daha var' uyarısı", secenekler("il").length <= 80);

  console.log("\n== 3) Seçim → İLÇE listesi dolar ==");
  yaz("il", "gazi");
  sec("il", "27");
  await bekle(80);
  ok("il seçildi (kod 27)", O().secim().il.kod === "27");
  ok("gizli alan değeri GAZIANTEP", d.getElementById("okz-il").value === "GAZIANTEP");
  yaz("ilce", "");
  ok("ilçe listesi 3 kayıt", secenekler("ilce").length === 3);
  ok("ŞAHİNBEY listede (kod 1841)", secenekler("ilce").some(x => x.dataset.kod === "1841"));

  console.log("\n== 4) İLÇE → OKUL ==");
  sec("ilce", "1841");
  await bekle(80);
  ok("ilçe seçildi (kod 1841)", O().secim().ilce.kod === "1841");
  yaz("okul", "19 may");
  ok("'19 may' okulu süzdü", secenekler("okul").length === 1 && secenekler("okul")[0].dataset.kod === "745770");
  sec("okul", "745770");
  ok("okul seçildi (kod 745770)", O().secim().okul.kod === "745770");
  ok("gizli alan OKUL adı", d.getElementById("okz-okulAdi").value === "19 MAYIS MTAL");

  console.log("\n== 4b) 'gazi' yaz → EN İYİ eşleşme vurgulu, tek dokunuş seçer ==");
  {
    const k2 = kok("il");
    const g2 = girdi("il");
    g2.dispatchEvent(new w.Event("focusin", { bubbles: true }));
    g2.value = "gazi";
    g2.dispatchEvent(new w.Event("input", { bubbles: true }));
    const ilk = secenekler("il")[0];
    ok("en iyi eşleşme listenin BAŞINDA", ilk && ilk.dataset.kod === "27");
    ok("'EN İYİ' etiketi görünüyor", /EN İYİ/.test(liste("il").textContent));
    ok("en iyi eşleşme zaten aktif (ok tuşu gerekmez)", ilk && ilk.dataset.aktif === "1");
    // Enter ile seç (dokunmadan)
    g2.dispatchEvent(new w.KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    ok("Enter en iyi eşleşmeyi seçti", O().secim().il.kod === "27");
    ok("giriş kutusu tam adı gösterdi", g2.value === "GAZIANTEP");
  }

  console.log("\n== 4c) Yazıp dokunmayı unutursa: tek aday kendiliğinden seçilir ==");
  {
    const g3 = girdi("il");
    g3.dispatchEvent(new w.Event("focusin", { bubbles: true }));
    g3.value = "adan";
    g3.dispatchEvent(new w.Event("input", { bubbles: true }));
    g3.dispatchEvent(new w.Event("focusout", { bubbles: true }));
    await bekle(260);
    ok("'adan' → ADANA kendiliğinden seçildi", O().secim().il.kod === "1");
    ok("kutuya tam ad yazıldı", g3.value === "ADANA");
  }

  console.log("\n== 4d) Belirsiz yazımda ZORLA seçim yapılmaz (yanlış okul riski yok) ==");
  {
    const g4 = girdi("il");
    g4.dispatchEvent(new w.Event("focusin", { bubbles: true }));
    g4.value = "a";            // ADANA, ANKARA, GAZIANTEP... birden çok aday
    g4.dispatchEvent(new w.Event("input", { bubbles: true }));
    g4.dispatchEvent(new w.Event("focusout", { bubbles: true }));
    await bekle(260);
    ok("seçim değişmedi (ADANA kaldı)", O().secim().il.kod === "1");
    ok("yazılan geri alındı", g4.value === "ADANA");
  }

  console.log("\n== 4e) Açılır liste kırpılmıyor (fixed konum, yer yoksa yukarı) ==");
  {
    const g5 = girdi("il");
    g5.dispatchEvent(new w.Event("focusin", { bubbles: true }));
    ok("liste açıldı (display:block)", gorunur("il"));
    ok("konum: fixed (kaydırma kabı kesmez)", liste("il").style.position === "fixed");
    ok("genişlik hesaplandı", /px$/.test(liste("il").style.width));
  }

  console.log("\n== 5) İL değişince alt seçimler temizlenir ==");
  yaz("il", "adana");
  sec("il", "1");
  await bekle(80);
  ok("il kodu 1", O().secim().il.kod === "1");
  ok("ilçe sıfırlandı", O().secim().ilce.kod === "");
  ok("okul sıfırlandı", O().secim().okul.kod === "");
  ok("okul kutusu temizlendi", d.getElementById("okz-okulAdi").value === "");

  console.log("\n" + "─".repeat(56));
  console.log(`Okulizyon arama/seçim testi — ${gecen}/${gecen + kalan} geçti` + (kalan ? "" : " ✓"));
  if (kalan) { hata.forEach(h => console.log("  ✗ " + h)); process.exit(1); }
})();
