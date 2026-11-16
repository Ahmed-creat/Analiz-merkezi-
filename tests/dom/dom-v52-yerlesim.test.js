// GERÇEK DOM testi — v52: EKRAN BOYUTUNA GÖRE YERLEŞİM KARARI
// Tablet portre modunda yan menü + sıkışmış 3 sütun açılıyordu (kullanıcı
// ekran görüntüsü: "Tablette bozuldu"). Burada uygulamanın KENDİ karar
// fonksiyonu (yatayYerlesimMi) gerçek sayfa içinde, gerçek cihaz ölçüleriyle
// çalıştırılır. Ayrıca CSS'teki kırılma noktası ile JS'in aynı metni
// kullandığı doğrulanır — ikisi koparsa test kırmızı olur.
const fs = require("fs");
const path = require("path");
let JSDOM, VirtualConsole;
try { ({ JSDOM, VirtualConsole } = require("jsdom")); }
catch (e) {
  console.log("DOM testi ATLANDI: jsdom kurulu değil (npm i -D jsdom)");
  process.exit(0);
}

const KOK = path.join(__dirname, "..", "..");
const HTML = fs.readFileSync(path.join(KOK, "site/index.html"), "utf8");

let gecen = 0, kalan = 0;
const hata = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { kalan++; hata.push(ad); console.log("  ✗ " + ad + (ek ? "  → " + ek : "")); }
}

// --- Küçük ama gerçek bir medya sorgusu değerlendiricisi ---
// Yalnız uygulamanın kullandığı özellikler: orientation, min/max width/height.
function mqPart(part, w, h) {
  let ok = true;
  const mnW = part.match(/min-width:\s*(\d+)px/); if (mnW) ok = ok && w >= Number(mnW[1]);
  const mxW = part.match(/max-width:\s*(\d+)px/); if (mxW) ok = ok && w <= Number(mxW[1]);
  const mnH = part.match(/min-height:\s*(\d+)px/); if (mnH) ok = ok && h >= Number(mnH[1]);
  const mxH = part.match(/max-height:\s*(\d+)px/); if (mxH) ok = ok && h <= Number(mxH[1]);
  const or = part.match(/orientation:\s*(landscape|portrait)/);
  if (or) ok = ok && ((or[1] === "portrait") ? (h >= w) : (w > h));
  // Test cihazı masaüstü gibi davranır: dokunmatik/kurulu uygulama yok.
  if (/pointer:\s*coarse/.test(part)) ok = false;
  if (/display-mode/.test(part)) ok = false;
  if (/hover:\s*hover/.test(part)) ok = true;
  return ok;
}
// Virgülleri YALNIZ parantez derinliği 0'da ayır (iç içe parantezler bozulmasın).
function mqListe(query) {
  const metin = String(query);
  const parcalar = [];
  let derinlik = 0, bas = 0;
  for (let i = 0; i < metin.length; i++) {
    const c = metin[i];
    if (c === "(") derinlik++;
    else if (c === ")") derinlik--;
    else if (c === "," && derinlik === 0) { parcalar.push(metin.slice(bas, i)); bas = i + 1; }
  }
  parcalar.push(metin.slice(bas));
  return parcalar;
}
function mqEval(query, w, h) {
  return mqListe(query).some(p => mqPart(p, w, h));
}

async function ac(w, h) {
  const dom = new JSDOM(HTML, {
    url: "https://analiz-merkezi.vercel.app/",
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole: new VirtualConsole(),
    beforeParse(win) {
      win.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}), text: () => Promise.resolve("") });
      win.scrollTo = () => {};
      win.URL.createObjectURL = () => "blob:x";
      Object.defineProperty(win, "innerWidth", { value: w, configurable: true });
      Object.defineProperty(win, "innerHeight", { value: h, configurable: true });
      // CSS kırılma noktalarıyla AYNI değerlendirme
      win.matchMedia = (q) => ({
        matches: mqEval(q, w, h),
        media: q,
        onchange: null,
        addListener() {}, removeListener() {},
        addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; }
      });
    }
  });
  await new Promise(r => {
    if (dom.window.document.readyState === "complete") return r();
    dom.window.addEventListener("load", r);
  });
  await new Promise(r => setTimeout(r, 120));
  return dom;
}

const CIHAZLAR = [
  ["iPad portre (820×1180)", 820, 1180, false],
  ["iPad Pro portre (1024×1366)", 1024, 1366, false],
  ["iPad yatay (1180×820)", 1180, 820, true],
  ["iPad mini yatay (1024×768)", 1024, 768, true],
  ["tablet yatay (960×720)", 960, 720, true],
  ["küçük tablet yatay (800×600)", 800, 600, false],
  ["masaüstü (1440×900)", 1440, 900, true],
  ["dizüstü (1280×800)", 1280, 800, true],
  ["dar masaüstü penceresi (1000×700)", 1000, 700, true],
  ["büyük dikey ekran (1200×1400)", 1200, 1400, true],
  ["telefon (390×844)", 390, 844, false],
  ["telefon yatay (844×390)", 844, 390, false]
];

(async () => {
  // Tek bir jsdom açıp her cihazda karar fonksiyonunu çağır (hızlı ve gerçek).
  const dom = await ac(1440, 900);
  const w = dom.window;

  console.log("\n== 1) Yerleşim kararı (uygulamanın kendi fonksiyonu) ==");
  for (const [ad, gw, gh, beklenen] of CIHAZLAR) {
    w.matchMedia = (q) => ({ matches: mqEval(q, gw, gh), media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
    Object.defineProperty(w, "innerWidth", { value: gw, configurable: true });
    Object.defineProperty(w, "innerHeight", { value: gh, configurable: true });
    const sonuc = w.eval("yatayYerlesimMi()");
    ok(ad + (beklenen ? " → YATAY yerleşim" : " → DİKEY yerleşim"), sonuc === beklenen,
      "beklenen " + beklenen + ", gelen " + sonuc);
  }

  console.log("\n== 2) CSS ile JS aynı kırılma noktasını kullanıyor ==");
  const genisJs = w.eval("YERLESIM_GENIS_SORGU");
  const darJs = w.eval("YERLESIM_DAR_SORGU");
  const genisCss = (HTML.match(new RegExp("@media\\s+(\\S[^{]*?)\\s*\\{\\s*\\n\\s*\\.mobile-topbar, \\.bottom-nav \\{ display: none")) || [])[1];
  const darCss = (HTML.match(/@media\s+(\S[^{]*?)\s*\{\s*\n\s*\.sidebar, #sidebar-overlay[^\n]*display: none !important/) || [])[1];
  ok("CSS yatay kuralı = JS yatay kuralı", !!genisCss && genisCss.trim() === genisJs, (genisCss || "?") + " ↔ " + genisJs);
  ok("CSS dikey kuralı = JS dikey kuralı", !!darCss && darCss.trim() === darJs, (darCss || "?") + " ↔ " + darJs);
  ok("yatay yerleşimde alt navigasyon !important ile gizli", HTML.indexOf(".mobile-topbar, .bottom-nav { display: none !important; }") > 0);
  ok("dikey yerleşimde yan menü !important ile gizli", /\.sidebar, #sidebar-overlay[^\n]*display: none !important;/.test(HTML));

  console.log("\n== 3) Taşma koruması ==");
  // Yalnız html: body'ye verilirse sticky üst çubuk bozulur (ölçülmüş tuzak).
  ok("html yatay taşmayı gizliyor", /html \{ overflow-x: hidden; \}/.test(HTML));
  ok("body genişliği ekranla sınırlı", /body \{ max-width: 100%; \}/.test(HTML));
  ok("görev satırı taşmıyor (overflow hidden)", /\.gorev-row \{\s*\n\s*display: flex; gap: 12px; align-items: flex-start; overflow: hidden;/.test(HTML));
  ok("görev satırı içeriği küçülebiliyor (min-width:0)", /\.gorev-row > div \{ min-width: 0; \}/.test(HTML));
  ok("EN ACİL ders adı kırpılıyor (max-width %42 + ellipsis)",
    /max-width:42%;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"/.test(HTML));

  console.log("\n== 4) Eski (bozuk) eşik kalmadı ==");
  ok("1024px kırılma noktası YOK", HTML.indexOf("min-width: 1024px") < 0);
  ok("768px tek başına kırılma noktası YOK (tablet portreyi bozuyordu)",
    !/@media \(min-width: 768px\) and \(min-height: 480px\)/.test(HTML));

  dom.window.close();
  console.log("\n" + "─".repeat(56));
  console.log(`v52 yerleşim — ${gecen}/${gecen + kalan} geçti` + (kalan ? "" : " ✓"));
  if (kalan) { hata.forEach(h => console.log("  ✗ " + h)); process.exit(1); }
})();
