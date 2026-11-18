/* v83 — KULLANICI GERİ BİLDİRİMLERİ (18 Kas, 43. tur)
   ------------------------------------------------------------
   1) "Okulizyon bilgilerini ilk girdiğimizde çekmiyor, şimdi deneye
      tıklayınca çekiyor."
      Kök neden: kenar fonksiyon bilgileri BULUTTAKİ app_states'ten okur;
      saveState() 1,5 sn gecikmeli yazıyor, eski kod 500 ms sonra çekiyordu →
      sunucu eski/boş bilgiyi görüyordu. Ölçüt: kaydet → bulut yazımı BEKLENİR
      → sonra çekim. (Kaynak sırası + "gecikmeli 500 ms çekim" yok.)

   2) "Deneme eklendiğinde gelen uyarı çok saçma… Hem sil ne alaka, sile
      tıkladığında açılıyor."
      Kök neden: "Şimdi açayım mı?" sorusu SİLME penceresiyle (Dikkat! ·
      İptal · Sil) soruluyordu. Ölçüt: bu pencere YOK; yerine Denemelerim'de
      🟢 yeşil nokta + sayfada yeşil bilgi şeridi (kaç deneme / kaç soru).

   3) "Mobilde üstte uygulama simgesi var, onu profil simgesine çevir."
   4) "Hiçbir profesyonel uygulamada veri bildirim kutusu öyle açık durmaz."
      Ölçüt: geri bildirim kutusu KAPALI başlar, düğmeyle açılır.
   5) "Bildirimlerde tablet yazıyor, onu cihaza çevir."

   Çalıştır: NODE_PATH=/tmp/jsdom-deps/node_modules node tests/dom/dom-v83-sade-okz.test.js
   (jsdom yoksa DOM bölümü atlanır; kaynak ölçümleri yine koşar.)
   ============================================================ */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const KOK = path.join(__dirname, "..", "..");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");

let gecen = 0; const hata = [];
const ok = (ad, kosul, ek) => {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { hata.push(ad + (ek ? " → " + ek : "")); console.log("  ✗ " + ad + (ek ? " → " + ek : "")); }
};
const bekle = (ms) => new Promise(r => setTimeout(r, ms));

/* ---------- 1) KAYNAK: kaydet → bulut yazımını bekle → çekim ---------- */
console.log("\n== 1) Okulizyon bilgisi kaydedilince çekim GERÇEKTEN başlıyor ==");
const saveBas = APP.indexOf("function okzSaveBilgi()");
const saveSon = APP.indexOf("function okzBilgiBulutaYaz()");
const saveGovde = APP.slice(saveBas, saveSon);
ok("bulut yazımını bekleyen yardımcı var", saveSon > saveBas && /function okzBilgiBulutaYaz\(\)/.test(APP));
ok("kaydetme akışı bulut yazımını BEKLİYOR", /okzBilgiBulutaYaz\(\)\.then\(function \(yazildi\)/.test(saveGovde));
ok("çekim yalnız yazma bitince çağrılıyor",
  saveGovde.indexOf("okzBilgiBulutaYaz().then") > 0 && saveGovde.indexOf("okzSunucuCek()") > saveGovde.indexOf("okzBilgiBulutaYaz().then"));
ok("ESKİ yarış (500 ms sonra çekim) KALMADI", !/okzSunucuCek\(\)[^;]*\}, 500\)/.test(saveGovde));
ok("süren bir bulut yazımı varsa ÖNCE o bitiyor (eski durum yazılmasın)",
  /for \(let i = 0; i < 20 && yazmaUcusu; i\+\+\)/.test(APP));
ok("yazma başarısızsa kullanıcıya söyleniyor", /Bilgiler buluta yazılamadı/.test(saveGovde));
ok("eksik il/ilçe/okul KODU sessiz geçilmiyor (çekim denenmez)",
  /if \(kodEksik\)/.test(saveGovde) && saveGovde.indexOf("if (kodEksik)") < saveGovde.indexOf("okzBilgiBulutaYaz().then"));
ok("aynı ad için eski KOD korunuyor (bağlantı bozulmaz)", /kodSec\(/.test(saveGovde) && /eski\[kodAnahtari\]/.test(saveGovde));

/* ---------- 2) KAYNAK: saçma uyarı yok, yeşil nokta var ---------- */
console.log("\n== 2) \"Şimdi açayım mı?\" SİLME penceresi kaldırıldı ==");
ok("openConfirm ile Okulizyon sorusu YOK", !/openConfirm\(\s*"Okulizyon/.test(APP));
// AYIRT EDİCİ ÖLÇÜT (ham string tuzağı yok): import akışında onay/gezinme ÇAĞRISI olmamalı.
const importBlok = APP.slice(APP.indexOf("if (n > 0) {"), APP.indexOf("} else if (degisen.length)"));
ok("import akışında onay penceresi ÇAĞRILMIYOR", importBlok.indexOf("openConfirm(") < 0);
ok("import akışında kendiliğinden sayfa değiştirme YOK", !/navigate\(\s*"exams"/.test(importBlok));
ok("import sonrası yeşil nokta işaretleniyor", /okzYeniPartiIsaretle\(yeni, n\)/.test(APP));
ok("nokta Denemelerim sekmelerine çiziliyor", /\[data-nav="exams"\]/.test(APP) && /pwa-yeni-nokta/.test(APP));
ok("okzBadge noktayı tazeliyor", /function okzBadge\(\)[\s\S]{0,220}okzYeniPartiNoktasi\(\)/.test(APP));
ok("okundu köprüsü var", /window\.__okzYeniPartiGoruldu = function/.test(APP));
ok("parti köprüsü var (sayfa şeridi okur)", /window\.__okzYeniParti = function/.test(APP));
ok("Denemelerim açılınca nokta sönüyor", /page === "exams"[\s\S]{0,200}__okzYeniPartiGoruldu/.test(HTML));
ok("sayfada yeşil bilgi şeridi var", /id="okz-yeni-serit"/.test(HTML) && /Okulizyon\\'dan ' \+ yp\.denemeler \+ ' deneme eklendi/.test(HTML));
ok("şeritte kullanıcıya ne yapacağı yazıyor", /soru neden bekliyor[\s\S]{0,200}Analiz bekliyor/.test(HTML));
ok("\"Nedenleri seç\" düğmesi neden bekleyen denemeye götürüyor", /data-act="okzNedenSec"/.test(HTML) && /case "okzNedenSec"/.test(HTML));

/* ---------- 3) Nokta mantığı: çiz, tekrar çizme, okundu → sön ---------- */
console.log("\n== 3) Yeşil nokta davranışı (izole çalıştırma) ==");
const fnBas = APP.indexOf("function okzYeniPartiNoktasi()");
const fnSon = APP.indexOf("function okzBadge()", fnBas);
const fnKaynak = APP.slice(fnBas, fnSon);
function noktaKos(goruldu, sorular) {
  const dotlar = [];
  const etiket = { children: [], appendChild(n) { this.children.push(n); } };
  const btn = {
    querySelector(sel) {
      if (sel === ".pwa-yeni-nokta") return dotlar[0] || null;
      if (sel === "span") return etiket;
      return null;
    },
    appendChild(n) { dotlar.push(n); }
  };
  const document = {
    querySelectorAll(sel) { return sel === '[data-nav="exams"]' ? [btn] : []; },
    createElement() {
      const el = { className: "", style: { cssText: "" }, title: "" };
      dotlar.push(el);
      return el;
    }
  };
  const state = { okulizyon: {} };
  const ctx = {
    document, state,
    okzStore: () => ({ yeniParti: { denemeler: 1, sorular: sorular, goruldu: goruldu, adlar: ["Deneme A"] } })
  };
  vm.runInNewContext(fnKaynak + "\n;globalThis.__n = okzYeniPartiNoktasi;", ctx, { filename: "nokta.js" });
  ctx.__n(); ctx.__n();                       // iki kez çağır: kopya çizmemeli
  return { adet: dotlar.length, dot: dotlar[0] };
}
const yeni = noktaKos(false, 20);
ok("yeni parti → nokta GÖRÜNÜR", yeni.dot && yeni.dot.style.display === "inline-block", JSON.stringify(yeni.dot && yeni.dot.style));
ok("iki çağrıda tek nokta (kopya yok)", yeni.adet === 1, "adet: " + yeni.adet);
ok("nokta yeşil", /#16A34A/.test(yeni.dot.style.cssText));
ok("ipucu metni bilgi veriyor", /yeni deneme/.test(yeni.dot.title || ""), yeni.dot.title);
const eski = noktaKos(true, 20);
ok("okundu → nokta SÖNER", eski.dot && eski.dot.style.display === "none", JSON.stringify(eski.dot && eski.dot.style));
const bos = noktaKos(false, 0);
ok("deneme gelmediyse (0 soru) nokta yok", bos.dot && bos.dot.style.display === "none");

/* ---------- 4) DOM: şerit + ayarlar + avatar + metinler ---------- */
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
        { qno: 1, lesson: "Matematik", topic: "Türev", type: "" },
        { qno: 2, lesson: "Matematik", topic: "Türev", type: "" }
      ]
    }],
    settings: { notifPermission: "default" }
  };
  const dom = new JSDOM(HTML, {
    url: "https://analiz-merkezi.vercel.app/",
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole: new VirtualConsole(),
    beforeParse(w) {
      w.localStorage.setItem("analizmerkezi_v6", JSON.stringify(baslangic));
      w.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}), text: () => Promise.resolve("") });
      w.matchMedia = w.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
      w.URL.createObjectURL = () => "blob:x";
      w.scrollTo = () => {};
      // app-pwa.js ES modül olduğu için jsdom'da koşmaz: köprüleri taklit et.
      w.__okzYeniParti = () => ({ denemeler: 1, sorular: 2, adlar: ["Okulizyon Deneme A"], zaman: 1, goruldu: false });
      w.__okzBekleyenSatirlar = () => 2;
      w.__okzYeniPartiGoruldu = () => { w.__gorulduCagrildi = true; };
    }
  });
  const w = dom.window, d = w.document;
  await new Promise(r => (d.readyState === "complete" ? r() : w.addEventListener("load", r)));
  await bekle(120);

  console.log("\n== 4) Denemelerim: yeşil bilgi şeridi ==");
  w.navigate("exams");
  const serit = d.getElementById("okz-yeni-serit");
  ok("şerit Denemelerim'de çiziliyor", !!serit);
  ok("kaç deneme geldiği yazılı", !!serit && serit.textContent.includes("Okulizyon'dan 1 deneme eklendi"));
  ok("kaç soru beklediği yazılı", !!serit && /2 soru neden bekliyor/.test(serit.textContent));
  ok("nerede seçileceği yazılı", !!serit && serit.textContent.includes("Analiz bekliyor"));
  ok("Denemelerim açılınca nokta okundu işaretleniyor", w.__gorulduCagrildi === true);

  console.log("\n== 5) Ayarlar: geri bildirim kutusu KAPALI duruyor ==");
  const kutu = d.getElementById("geri-bildirim-kutu");
  const acBtn = d.getElementById("geri-bildirim-ac");
  ok("kutu başlangıçta KAPALI (hidden)", !!kutu && kutu.hidden === true);
  ok("kapalıyken metin alanı görünmüyor",
    !!kutu && kutu.querySelectorAll("textarea").length === 1);
  ok("\"Geri bildirim yaz\" düğmesi var", !!acBtn && acBtn.textContent.includes("Geri bildirim yaz"));
  acBtn.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  await bekle(20);
  ok("düğmeye basınca kutu açılıyor", kutu.hidden === false);
  ok("kutuda gönderme yolu duruyor", !!d.getElementById("geri-bildirim-metin") && !!d.querySelector('[data-act="geriBildirimGonder"]'));

  console.log("\n== 6) Mobil üst bar: profil simgesi ==");
  const av = d.getElementById("topbar-avatar");
  const bar = d.querySelector(".mobile-topbar");
  ok("avatar var", !!av);
  ok("avatar profil açıyor", !!av && av.dataset.act === "openProfile");
  ok("avatar baş harfleri gösteriyor", !!av && av.textContent.trim() === "AY", av && av.textContent);
  ok("üst barda uygulama LOGOSU (<img>) kalmadı", !!bar && bar.querySelectorAll("img").length === 0);
  ok("uygulama adı hâlâ yazıyor", !!d.getElementById("topbar-name"));

  console.log("\n== 7) Bildirim metni: tablet → cihaz ==");
  const uyku = d.getElementById("bildirim-uyku-notu");
  ok("\"Cihaz bildirimleri gecikiyorsa\" yazıyor", !!uyku && uyku.textContent.includes("Cihaz bildirimleri gecikiyorsa"));
  ok("\"Tablet bildirimleri\" metni kalmadı",
    !HTML.includes("Tablet bildirimleri") && !(uyku && uyku.textContent.includes("Tablet")));

  dom.window.close();
  bitir();
})();

function bitir() {
  console.log("\n" + (hata.length ? "✗ BAŞARISIZ" : "✓ TAMAM") + " — geçen: " + gecen + ", kalan: " + hata.length);
  if (hata.length) { hata.forEach(h => console.log("   • " + h)); process.exit(1); }
  process.exit(0);
}
