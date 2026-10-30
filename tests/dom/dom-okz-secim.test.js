// GERÇEK DOM testi — Okulizyon il/ilçe/okul seçimi (v43)
// site/app-pwa.js'in İLGİLİ bölümü dosyadan OLDUĞU GİBİ alınır, jsdom içinde
// çalıştırılır, ağ sahte (fetch) ama davranış gerçek: kullanıcı il seçtiğinde
// ilçe listesi doluyor mu, ilçe seçtiğinde okul listesi doluyor mu?
const fs = require("fs");
const path = require("path");
let JSDOM;
try { ({ JSDOM } = require("jsdom")); }
catch (e) { console.log("DOM testi ATLANDI: jsdom kurulu değil (npm i -D jsdom)"); process.exit(0); }

const KOK = path.join(__dirname, "..", "..");
const APP = fs.readFileSync(KOK + "/site/app-pwa.js", "utf8");

// --- foradan gerçek kod parçaları ---
function kes(bas, son) {
  const i = APP.indexOf(bas);
  const j = APP.indexOf(son, i);
  if (i < 0 || j < 0) throw new Error("bölüm bulunamadı: " + bas);
  return APP.slice(i, j);
}
const blokSecim = kes("const OKZ_LISTE_ANAHTAR", "function renderProfileModal()");
const blokChange = kes('  // v43 — İL → İLÇE → OKUL zinciri', '  document.addEventListener("click", (e) => {');

let gecen = 0, kalan = 0; const hata = [];
function ok(ad, kosul) { if (kosul) { gecen++; console.log("  ✓ " + ad); } else { kalan++; hata.push(ad); console.log("  ✗ " + ad); } }

// --- sahte ağ: gerçek Okulizyon listeleri (canlı ölçümden alınan ilk kayıtlar) ---
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

const dom = new JSDOM(`<!doctype html><html><body>
  <div id="pwa-profile-modal" style="display:flex"></div>
  <div id="toast"></div>
</body></html>`, { url: "https://analiz-merkezi.vercel.app/", runScripts: "outside-only", pretendToBeVisual: true });
const w = dom.window, d = w.document;

// index.html'in sağladığı yardımcılar
w.escHtml = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
w.SUPABASE_CONFIG = { url: "https://ztgzmhfklsdlngrtennp.supabase.co", anonKey: "test" };
w.fetch = sahteFetch;
w.toast = () => {};
w.state = { settings: {} };
w.document.addEventListener("change", () => {});

// kodu pencere kapsamında çalıştır
const calistir = (kod) => w.eval("(function(){" + kod + "\n;window.__okz={secim:()=>OKZ_SECIM,okzSecim,okzListeTazele,okzSecimleriDoldur,okzSecimYukle,okzListeAnahtari};})()");
calistir(blokSecim + "\n" + blokChange);
const O = () => w.__okz;

const bekle = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  console.log("\n== 1) Profil açılışı: il listesi dolar ==");
  d.getElementById("pwa-profile-modal").innerHTML =
    O().okzSecim("il", "İL", "il", "", "") + O().okzSecim("ilce", "İLÇE", "ilce", "", "") + O().okzSecim("okulAdi", "OKUL", "okul", "", "");
  O().okzSecimYukle(w.state.settings.okulizyon || {});
  await bekle(60);
  const ilSel = d.querySelector('select[data-okz-rol="il"]');
  ok("il select var", !!ilSel);
  ok("il listesi 3 seçenek + başlık", ilSel && ilSel.options.length === IL.length + 1);
  ok("GAZIANTEP listede", ilSel && Array.from(ilSel.options).some(o => o.value === "GAZIANTEP" && o.dataset.kod === "27"));

  console.log("\n== 2) İL seçilince İLÇE dolar (eski hata: boş kalıyordu) ==");
  ilSel.value = "GAZIANTEP";
  ilSel.dispatchEvent(new w.Event("change", { bubbles: true }));
  await bekle(80);
  const ilceSel = d.querySelector('select[data-okz-rol="ilce"]');
  ok("ilçe listesi 3 seçenek + başlık", ilceSel && ilceSel.options.length === ILCE["27"].length + 1);
  ok("ŞAHİNBEY (kod 1841) ilçe listesinde", ilceSel && Array.from(ilceSel.options).some(o => o.value === "ŞAHİNBEY" && o.dataset.kod === "1841"));
  ok("il seçimi korundu", ilSel.value === "GAZIANTEP");

  console.log("\n== 3) İLÇE seçilince OKUL dolar ==");
  ilceSel.value = "ŞAHİNBEY";
  ilceSel.dispatchEvent(new w.Event("change", { bubbles: true }));
  await bekle(80);
  const okulSel = d.querySelector('select[data-okz-rol="okul"]');
  ok("okul listesi 2 seçenek + başlık", okulSel && okulSel.options.length === OKUL["1841"].length + 1);
  ok("19 MAYIS MTAL (kod 745770) listede", okulSel && Array.from(okulSel.options).some(o => o.value === "19 MAYIS MTAL" && o.dataset.kod === "745770"));
  ok("ilçe seçimi korundu", ilceSel.value === "ŞAHİNBEY");

  console.log("\n== 4) Seçimler durumda (DOM'a bağlı değil) ==");
  const S = O().secim();
  ok("il kodu 27", S.il.kod === "27");
  ok("ilçe kodu 1841", S.ilce.kod === "1841");

  console.log("\n== 5) İL değişince alt seçimler temizlenir ve yeniden dolar ==");
  ilSel.value = "ADANA";
  ilSel.dispatchEvent(new w.Event("change", { bubbles: true }));
  await bekle(80);
  ok("ilçe sıfırlandı (ADANA'nın ilçesi yok)", d.querySelector('select[data-okz-rol="ilce"]').options.length === 1);
  ok("okul sıfırlandı", d.querySelector('select[data-okz-rol="okul"]').options.length === 1);
  ok("il kodu 1", O().secim().il.kod === "1");

  console.log("\n" + "─".repeat(56));
  console.log(`Okulizyon seçim testi — ${gecen}/${gecen + kalan} geçti`);
  if (kalan) { hata.forEach(h => console.log("  ✗ " + h)); process.exit(1); }
})();
