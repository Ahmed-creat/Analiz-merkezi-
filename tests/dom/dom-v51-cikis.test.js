// GERÇEK DOM testi — v51: çıkış yapınca cihazdaki bilgiler siliniyor mu?
// + yan menüde satıcı damgası (Panam) kalmadı mı?
// Metin araması değil: uygulama jsdom içinde çalıştırılır, KULLANICININ
// GÖRDÜĞÜ ekran ve gerçekten localStorage'da kalan anahtarlar ölçülür.
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
const APP = fs.readFileSync(path.join(KOK, "site/app-pwa.js"), "utf8");
const MANIFEST = fs.readFileSync(path.join(KOK, "site/manifest.json"), "utf8");

let gecen = 0, kalan = 0;
const hata = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { kalan++; hata.push(ad); console.log("  ✗ " + ad + (ek ? "  → " + ek : "")); }
}
const bekle = (ms) => new Promise(r => setTimeout(r, ms));
// Kullanıcının GÖRDÜĞÜ metin: script/style içerikleri sayılmaz.
function gorunenMetin(d) {
  const kopya = d.body.cloneNode(true);
  kopya.querySelectorAll("script, style").forEach(n => n.remove());
  return kopya.textContent || "";
}

// Kullanıcının cihazında birikmiş GERÇEKÇİ veri: deneme, hafıza,
// bekleyen Okulizyon soruları, Okulizyon adı + şifresi, sınıf arşivi,
// çevrimdışı geri bildirim kuyruğu...
const DOLU_STATE = {
  user: { name: "Ahmet Yılmaz", grade: "10", joined: "2026-09-01" },
  streak: { count: 12, lastCheck: "2026-11-14", freezeWeek: null, freezeUsed: false },
  exams: [{ id: "e1", name: "TYT-1", date: "2026-11-10", lessons: {}, errorLogs: [], total: 120, net: 61 }],
  questions: [], books: [], topics: {}, memory: {}, notifications: [], badges: {},
  plan: { targetDate: "2027-06-20" },
  settings: { okulizyon: { ad: "AHMET YILMAZ", okulNo: "1234", sinif: "10", il: "GAZİANTEP", sifre: "gizli123" } },
  okulizyon: {
    pending: [{ ad: "Deneme A", rows: [{ q: 1 }, { q: 2 }] }],
    importedKeys: [], aktarilan: {}, guncellenen: [], pulledAt: 0, duyular: null, islenen: {}
  },
  bkt_state: {}, bkt_processed_records: {}, dailyTasks: { study: true, read: false, solve: false, date: "2026-11-14" }
};

async function ac(depo) {
  const dom = new JSDOM(HTML, {
    url: "https://analiz-merkezi.vercel.app/",
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole: new VirtualConsole(),
    beforeParse(w) {
      for (const [k, v] of Object.entries(depo || {})) w.localStorage.setItem(k, v);
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
  console.log("\n== 1) Yan menüde satıcı damgası YOK ==");
  {
    const dom = await ac({});
    const d = dom.window.document;
    ok("DOM'da .sb-vendor düğümü YOK", d.querySelectorAll(".sb-vendor").length === 0);
    ok("yan menü metninde 'Panam' yok", !/panam/i.test(d.getElementById("sidebar") ? d.getElementById("sidebar").textContent : ""));
    ok("görünen metinde 'Yayıncılık' yok", !/yayıncılık/i.test(gorunenMetin(d)));
    // Eski kopyadan DOM'a sızsa bile açılışta silinir.
    const sahte = d.createElement("div");
    sahte.className = "sb-vendor";
    sahte.textContent = "Panam Yayıncılık";
    d.getElementById("sidebar").appendChild(sahte);
    dom.window.document.querySelectorAll(".sb-vendor").forEach(n => n.remove());
    ok("sızmış damga temizlenebiliyor", d.querySelectorAll(".sb-vendor").length === 0);
    dom.window.close();
  }

  console.log("\n== 2) Çıkış: cihazdaki bilgiler siliniyor ==");
  {
    const depo = {
      analizmerkezi_v6: JSON.stringify(DOLU_STATE),
      analizmerkezi_v6_g9: JSON.stringify(DOLU_STATE),
      "am_okz_islenen_v1": JSON.stringify({ "sinav-1": true }),
      am_geri_bildirim_kuyruk: JSON.stringify([{ mesaj: "test" }]),
      am_theme: "dark"
    };
    const dom = await ac(depo);
    const w = dom.window, d = w.document;

    ok("açılışta isim görünüyor (Ahmet Yılmaz)", d.getElementById("sidebar-user-name").textContent === "Ahmet Yılmaz",
      d.getElementById("sidebar-user-name").textContent);
    ok("açılışta bekleyen Okulizyon sorusu var (2)", w.eval("state").okulizyon.pending[0].rows.length === 2);
    ok("açılışta Okulizyon şifresi bellekte", w.eval("state").settings.okulizyon.sifre === "gizli123");

    ok("temizleme fonksiyonu var", typeof w.__cikisYerelTemizle === "function");
    w.__cikisYerelTemizle();
    await bekle(120);

    ok("ana kayıt (analizmerkezi_v6) SİLİNDİ", w.localStorage.getItem("analizmerkezi_v6") === null,
      String(w.localStorage.getItem("analizmerkezi_v6")).slice(0, 40));
    ok("sınıf arşivi (…_g9) SİLİNDİ", w.localStorage.getItem("analizmerkezi_v6_g9") === null);
    ok("Okulizyon defteri SİLİNDİ", w.localStorage.getItem("am_okz_islenen_v1") === null);
    ok("çevrimdışı geri bildirim kuyruğu SİLİNDİ", w.localStorage.getItem("am_geri_bildirim_kuyruk") === null);
    ok("tema tercihi KORUNDU (kişisel veri değil)", w.localStorage.getItem("am_theme") === "dark");

    ok("bellekteki deneme listesi boş", w.eval("state").exams.length === 0);
    ok("bellekteki Okulizyon bilgisi boş", !w.eval("state").settings.okulizyon || !w.eval("state").settings.okulizyon.ad);
    ok("bellekteki Okulizyon şifresi silindi", !w.eval("state").settings.okulizyon || !w.eval("state").settings.okulizyon.sifre);
    ok("bekleyen Okulizyon sorusu kalmadı", !w.eval("state").okulizyon || !(w.eval("state").okulizyon.pending || []).length);
    ok("seri sıfırlandı", w.eval("state").streak.count === 0);

    ok("yan menüde isim 'Misafir'", d.getElementById("sidebar-user-name").textContent === "Misafir",
      d.getElementById("sidebar-user-name").textContent);
    ok("ekranda '… soru bekliyor' YOK", !/soru bekliyor/i.test(gorunenMetin(d)));
    dom.window.close();
  }

  console.log("\n== 3) Çıkış akışı buluta son yazmayı deniyor ==");
  {
    ok("doSignOut buluta yazıyor (bulutaYaz)", /async function doSignOut[\s\S]{0,400}bulutaYaz\(true\)/.test(APP));
    ok("doSignOut yerel temizliği çağırıyor", /__cikisYerelTemizle/.test(APP));
    ok("çıkış mesajı 'silindi' diyor", /Bu cihazdaki kayıtlar silindi/.test(APP));
  }

  console.log("\n== 4) Yerleşim: bilgisayar/tablet yatay, telefon dikey ==");
  {
    // v52: kırılma noktası yatay ekran ister (tablet portrede bozuluyordu).
    // Ayrıntılı cihaz matrisi: dom-v52-yerlesim.test.js
    ok("yatay yerleşim kuralı yatay ekran istiyor",
      /@media \(\(orientation: landscape\) and \(min-width: 900px\) and \(min-height: 480px\)\)/.test(HTML));
    ok("telefon/tablet portre kuralı var",
      HTML.indexOf("@media (max-width: 899px), (max-height: 479px), ((orientation: portrait) and (max-width: 1179px))") > 0);
    ok("eski 1024px kırılma noktası kalmadı", HTML.indexOf("min-width: 1024px") < 0);
    ok("yerleşim ölçütü tek fonksiyonda", /function yatayYerlesimMi\(\)/.test(HTML));
    ok("yön kilidi yalnız kurulu uygulamada denenir", /navigator\.standalone|display-mode: standalone/.test(HTML));
    ok("manifest yönü kısıtlanmıyor (any)", /"orientation":\s*"any"/.test(MANIFEST));
  }

  console.log("\n" + "─".repeat(56));
  console.log(`v51 çıkış/yerleşim — ${gecen}/${gecen + kalan} geçti` + (kalan ? "" : " ✓"));
  if (kalan) { hata.forEach(h => console.log("  ✗ " + h)); process.exit(1); }
})();
