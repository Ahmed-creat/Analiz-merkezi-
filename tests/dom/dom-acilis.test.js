// GERÇEK DOM testi — AÇILIŞ (v43)
// site/index.html gerçekten jsdom içinde çalıştırılır; ekranda ne kaldığına
// bakılır. Metin araması yok: kullanıcının gördüğü şey ölçülür.
const fs = require("fs");
const path = require("path");
let JSDOM, VirtualConsole;
try { ({ JSDOM, VirtualConsole } = require("jsdom")); }
catch (e) {
  console.log("DOM testi ATLANDI: jsdom kurulu değil (npm i -D jsdom)");
  process.exit(0);
}

const KOK = path.join(__dirname, "..", "..");
const html = fs.readFileSync(path.join(KOK, "site/index.html"), "utf8");

let gecen = 0, kalan = 0;
const hata = [];
function ok(ad, kosul) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { kalan++; hata.push(ad); console.log("  ✗ " + ad); }
}
const bekle = (ms) => new Promise(r => setTimeout(r, ms));

async function ac(baslangicDepo) {
  const vc = new VirtualConsole();
  const dom = new JSDOM(html, {
    url: "https://analiz-merkezi.vercel.app/",
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(w) {
      for (const [k, v] of Object.entries(baslangicDepo || {})) w.localStorage.setItem(k, v);
      w.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}), text: () => Promise.resolve("") });
      w.matchMedia = w.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
      w.URL.createObjectURL = () => "blob:x";
      w.scrollTo = () => {};
    }
  });
  await new Promise(r => {
    if (dom.window.document.readyState === "complete") return r();
    dom.window.addEventListener("load", r);
  });
  await bekle(150);
  return dom;
}

(async () => {
  console.log("\n== A) Hiçbir açılışta 'Başla' kapısı yok ==");
  for (const [etiket, depo] of [["temiz cihaz (ilk açılış)", {}], ["kullanılmış cihaz", { am_giris_yapildi: "1" }]]) {
    const dom = await ac(depo);
    const d = dom.window.document;
    ok(etiket + ": #splash DOM'da YOK", !d.getElementById("splash"));
    ok(etiket + ": ekranda 'Başla' düğmesi YOK", !d.querySelector('[data-act="enterApp"]'));
    dom.window.close();
  }

  console.log("\n== B) Uygulama doğrudan açılıyor ==");
  {
    const dom = await ac({});
    const w = dom.window;
    ok("__entered işaretli", w.__entered === true);
    ok("pano çizildi (bir sayfa görünür)", !!w.document.querySelector("#app, .app, main, #view, #content") || w.document.body.innerHTML.length > 2000);
    dom.window.close();
  }

  console.log("\n" + "─".repeat(56));
  console.log(`Açılış testi — ${gecen}/${gecen + kalan} geçti` + (kalan ? "" : " ✓"));
  if (kalan) { hata.forEach(h => console.log("  ✗ " + h)); process.exit(1); }
})();
