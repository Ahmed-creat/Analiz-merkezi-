/* v84 — "NEDENLERİ SEÇ" DİYİNCE LİSTE AÇILSIN + GÜNCEL SİTE ADRESİ
   ------------------------------------------------------------
   KULLANICI (18 Kas):
     1) "Denemede nedenleri seç diyince liste açılsın."
     2) "Şu an depoda uygulamanın websitesi eski netlify bağlantısı yazıyor.
         Güncelini yaz."

   ÖLÇÜT (1): liste artık sayfada aranmaz — PENCERE açılır.
     • Denemelerim'deki yeşil şerit "Nedenleri seç" → pencere
     • Satırdaki "analiz bekliyor (N) →" → pencere
     • Pencere içinde satır satır neden seçimi + "tümüne" + "Nedenleri kaydet"
     • Liste TEK kaynaktan üretilir (okzNedenListesiHtml): sayfa kartı ve
       pencere aynı HTML'i kullanır, ayrışamaz.
     • Kaydedince pencere tazelenir; iş bittiyse kendiliğinden kapanır.

   ÖLÇÜT (2): depoda uygulamanın adresi olarak Netlify kalmaz; güncel adres
     https://analiz-merkezi.vercel.app yazar.

   Çalıştır: NODE_PATH=/tmp/jsdom-deps/node_modules node tests/dom/dom-v84-neden-listesi.test.js
   ============================================================ */
"use strict";
const fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "..");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const SW_KOK = fs.readFileSync(path.join(KOK, "sw.js"), "utf8");
const SW_SITE = fs.readFileSync(path.join(KOK, "site", "sw.js"), "utf8");
const README = fs.readFileSync(path.join(KOK, "README.md"), "utf8");
const KARS = fs.readFileSync(path.join(KOK, "docs", "SURUM-KARSILASTIRMA.md"), "utf8");
const CANLI = "https://analiz-merkezi.vercel.app";

let gecen = 0; const hata = [];
const ok = (ad, kosul, ek) => {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { hata.push(ad + (ek ? " → " + ek : "")); console.log("  ✗ " + ad + (ek ? " → " + ek : "")); }
};
const bekle = (ms) => new Promise(r => setTimeout(r, ms));

/* ---------- 1) KAYNAK: liste tek yerde, pencereye bağlı ---------- */
console.log("\n== 1) Neden listesi tek kaynak ==");
ok("okzNedenListesiHtml() tanımlı", /function okzNedenListesiHtml\(ex, secIdx\)/.test(HTML));
ok("renderExams listeyi bu fonksiyondan alıyor", /const nedenListesi = okzNedenListesiHtml\(sonEx, secIdx\)/.test(HTML));
const okzReasonKurulum = (HTML.match(/class="okz-reason"/g) || []).length;
ok("satır (select.okz-reason) TEK yerde üretiliyor", okzReasonKurulum === 1, "bulunan: " + okzReasonKurulum);
ok("sayfa kartı #analiz-bekliyor duruyor", /id="analiz-bekliyor"/.test(HTML));
ok("karttan pencereye geçiş düğmesi var", /data-act="okzNedenSec" data-idx="/.test(HTML));

console.log("\n== 2) Pencere (modal) var ==");
ok("#neden-modal işaretlemesi var", /id="neden-modal"/.test(HTML) && /class="modal-overlay"/.test(HTML));
ok("gövdesi #neden-modal-govde", /id="neden-modal-govde"/.test(HTML));
ok("başlığı #neden-modal-baslik", /id="neden-modal-baslik"/.test(HTML));
ok("okzNedenModalAc() tanımlı", /function okzNedenModalAc\(idx\)/.test(HTML));
ok("okzNedenModalTazele() tanımlı", /function okzNedenModalTazele\(idx\)/.test(HTML));

console.log("\n== 3) Düğmeler pencereyi açıyor ==");
const secCase = HTML.slice(HTML.indexOf('case "okzNedenSec"'), HTML.indexOf('case "okzNedenSec"') + 900);
ok('"Nedenleri seç" → okzNedenModalAc()', /okzNedenModalAc\(hedef\)/.test(secCase));
ok('satırdaki "analiz bekliyor" → okzNedenModalAc()', /case "examAnaliz":[\s\S]{0,160}okzNedenModalAc\(Number\(el\.dataset\.idx\)\)/.test(HTML));
ok("kaydet → pencere tazeleniyor", /case "okzNedenKaydet":[\s\S]{0,320}okzNedenModalTazele\(i\)/.test(HTML));
ok("tümüne → pencere tazeleniyor", /case "okzNedenHepsi":[\s\S]{0,700}okzNedenModalTazele\(i2\)/.test(HTML));

console.log("\n== 4) Aynı satır iki yerde: boş seçim dolu seçimi ezmez ==");
ok("okzAnalizKaydet dolu seçimi koruyor", /if \(!secimler\[k\] \|\| sel\.value\) secimler\[k\] = sel\.value;/.test(APP));

/* ---------- 5) GÜNCEL SİTE ADRESİ ---------- */
console.log("\n== 5) Depoda güncel adres yazıyor (Netlify değil) ==");
ok("kök sw.js APP_URL güncel adres", SW_KOK.includes('const APP_URL = "' + CANLI + '/";'),
  (SW_KOK.match(/const APP_URL = "[^"]+"/) || [""])[0]);
ok("kök sw.js'te netlify.app YOK", !/netlify\.app/.test(SW_KOK));
ok("yayınlanan sw.js site adresini kullanıyor", /const APP_URL = self\.location\.origin \+ "\/";/.test(SW_SITE));
ok("README güncel adresi veriyor", README.includes(CANLI) && !/netlify\.app/.test(README));
ok("sürüm karşılaştırması güncel adresi yazıyor", KARS.includes("Uygulamanın güncel adresi") && KARS.includes(CANLI));
ok("Netlify satırı 'ESKİ' diye işaretli", /v33\.1\*\* \(ESKİ yayın: analizmerkezii\.netlify\.app — artık kullanılmıyor\)/.test(KARS));

/* ---------- 6) GERÇEK DOM: pencere açılıyor mu? ---------- */
(async () => {
  let JSDOM, VirtualConsole;
  try { ({ JSDOM, VirtualConsole } = require("jsdom")); }
  catch (e) {
    console.log("\nDOM bölümü ATLANDI: jsdom yok (npm i --no-save --prefix /tmp/jsdom-deps jsdom@25)");
    return bitir();
  }
  const baslangic = {
    user: { name: "Ahmet Yılmaz", grade: "10" },
    exams: [{
      id: "e1", name: "Okulizyon Deneme A", date: "2026-11-17", total: 20, net: 5,
      lessons: { Matematik: { d: 5, w: 3, e: 2 } },
      errorLogs: [
        { qno: 1, lesson: "Matematik", topic: "Türev", type: "", status: "w" },
        { qno: 2, lesson: "Matematik", topic: "Türev", type: "", status: "e" },
        { qno: 3, lesson: "Matematik", topic: "Limit", type: "KONUEKSİKLİĞİ", status: "w" }
      ]
    }],
    settings: {}
  };
  const dom = new JSDOM(HTML, {
    url: CANLI + "/",
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole: new VirtualConsole(),
    beforeParse(w) {
      w.localStorage.setItem("analizmerkezi_v6", JSON.stringify(baslangic));
      w.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}), text: () => Promise.resolve("") });
      w.matchMedia = w.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
      w.URL.createObjectURL = () => "blob:x";
      w.scrollTo = () => {};
      w.__okzYeniParti = () => ({ denemeler: 1, sorular: 2, adlar: ["Okulizyon Deneme A"], zaman: 1, goruldu: false });
      w.__okzBekleyenSatirlar = () => 2;
      w.__okzYeniPartiGoruldu = () => {};
      // app-pwa.js bir ES modül: köprüyü taklit ediyoruz. Gerçek fonksiyon gibi
      // yalnız SEÇİLMİŞ satırlara neden yazar, sonra sayfayı tazeler.
      w.__okzNedenKaydet = (idx) => {
        const i = Number(idx);
        const secim = {};
        w.document.querySelectorAll(".okz-reason").forEach(sel => {
          const k = sel.dataset.i + ":" + sel.dataset.j;
          if (!secim[k] || sel.value) secim[k] = sel.value;
        });
        let yazilan = 0;
        const durum = w.eval("state");
        durum.exams.forEach((ex, ei) => {
          if (ei !== i) return;
          (ex.errorLogs || []).forEach((log, j) => {
            if (!log || log.type) return;
            const s = secim[ei + ":" + j];
            if (!s) return;
            log.type = s; yazilan++;
          });
        });
        w.renderExams(w.document.getElementById("main-content"));
        return yazilan;
      };
    }
  });
  const w = dom.window, d = w.document;
  await new Promise(r => (d.readyState === "complete" ? r() : w.addEventListener("load", r)));
  await bekle(120);

  console.log("\n== 6) Denemelerim → 'Nedenleri seç' pencereyi açıyor ==");
  w.navigate("exams");
  await bekle(40);
  const seritBtn = d.querySelector('#okz-yeni-serit [data-act="okzNedenSec"]');
  ok("yeşil şeritte 'Nedenleri seç' var", !!seritBtn);
  const modal = d.getElementById("neden-modal");
  ok("başlangıçta pencere KAPALI", !!modal && !modal.classList.contains("open"));
  seritBtn.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  await bekle(60);
  ok("tıklayınca pencere AÇILIYOR", !!modal && modal.classList.contains("open"));
  ok("başlıkta soru sayısı yazıyor", /Nedenleri seç · 2 soru/.test(d.getElementById("neden-modal-baslik").textContent),
    d.getElementById("neden-modal-baslik").textContent);
  const govde = d.getElementById("neden-modal-govde");
  ok("listede 2 soru var", govde.querySelectorAll(".okz-reason").length === 2,
    "bulunan: " + govde.querySelectorAll(".okz-reason").length);
  ok("nedeni yazılmış satır listede YOK", !govde.textContent.includes("#3"));
  const ilkSecenekler = Array.from(govde.querySelectorAll(".okz-reason")[0].options).map(o => o.value);
  ok("yanlış satırı YANLIŞ nedenlerini listeliyor", ilkSecenekler.includes("Konuyu Bilmiyordum") && !ilkSecenekler.includes("SÜREYETMEDİ"), ilkSecenekler.join("|"));
  ok("\"tümüne\" düğmeleri pencerede de var", govde.querySelectorAll('[data-act="okzNedenHepsi"]').length > 0);
  ok("\"Nedenleri kaydet\" düğmesi var", !!govde.querySelector('[data-act="okzNedenKaydet"]'));

  console.log("\n== 7) Seç + kaydet → pencere tazelenir, iş bitince kapanır ==");
  const sel0 = govde.querySelectorAll(".okz-reason")[0];
  sel0.value = "Konuyu Bilmiyordum";
  ok("seçim yapılabiliyor", sel0.value === "Konuyu Bilmiyordum", sel0.value);
  govde.querySelector('[data-act="okzNedenKaydet"]').dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  await bekle(80);
  ok("1 soru kaydedildi", w.eval("state").exams[0].errorLogs[0].type === "Konuyu Bilmiyordum");
  ok("pencere AÇIK kalıyor (1 soru daha var)", modal.classList.contains("open"));
  ok("başlık 1'e düştü", /· 1 soru/.test(d.getElementById("neden-modal-baslik").textContent),
    d.getElementById("neden-modal-baslik").textContent);

  // kalan satırı da "tümüne" ile kapat → iş biter, pencere kapanır
  const kalanGovde = d.getElementById("neden-modal-govde");
  const hepsi = kalanGovde.querySelector('[data-act="okzNedenHepsi"][data-okz-hedef="bos"]');
  ok("boş satır için 'tümüne' düğmesi var", !!hepsi);
  hepsi.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  await bekle(80);
  ok("boş satırın nedeni yazıldı", !!w.eval("state").exams[0].errorLogs[1].type);
  ok("iş bitince pencere KAPANIYOR", !modal.classList.contains("open"));

  console.log("\n== 8) Satırdaki 'analiz bekliyor' düğmesi de pencereyi açıyor ==");
  w.eval("state").exams[0].errorLogs[0].type = "";
  w.renderExams(d.getElementById("main-content"));
  await bekle(40);
  const satirBtn = d.querySelector('[data-act="examAnaliz"]');
  ok("satırda 'analiz bekliyor' düğmesi var", !!satirBtn);
  if (satirBtn) {
    satirBtn.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
    await bekle(60);
    ok("satır düğmesi pencereyi açıyor", modal.classList.contains("open"));
  }

  dom.window.close();
  bitir();
})();

function bitir() {
  console.log("\n" + (hata.length ? "✗ BAŞARISIZ" : "✓ TAMAM") + " — geçen: " + gecen + ", kalan: " + hata.length);
  if (hata.length) { hata.forEach(h => console.log("   • " + h)); process.exit(1); }
  process.exit(0);
}
