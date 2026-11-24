#!/usr/bin/env node
/* ============================================================
   ANALİZ BEKLİYOR — PROFİLDEN KALKTI, DENEMELERİM'DE AÇILIYOR
   tests/v79-analiz-bekliyor.test.js
   ------------------------------------------------------------
   KULLANICI (bu tur):
     1) "profilden analiz bekliyor'u kaldırmamışsın."
     2) "denemelerimde analiz bekleyen deneme tuşa basılınca açılacaktı."
     3) "neden yanlış ve boş için aynı neden listesi kullanılıyor?"
     4) "bu analiz bekleyen bölümünün rengi ... normal deneme kartı gibi olmalı."

   Kanıtlananlar:
     1) Profilde 'Analiz Bekliyor' adı/sayacı/götürücüsü YOK (yalnız rozet)
     2) Denemelerim'de satırdaki "analiz bekliyor (N) →" düğmesi o denemeyi
        seçip DOĞRUDAN karta kaydırıyor; satıra basmak da bekleyen varsa oraya
     3) YANLIŞ satırında WRONG_REASONS, BOŞ satırında EMPTY_REASONS;
        "tümü" yalnız aynı tür satıra yazar (kod GERÇEKTEN koşturulur)
     4) Kart normal bento-card görünümünde (turuncu vurgu yok)
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const KOK = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const APP_KOD = APP.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) gecen++; else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }

/** index.html içinden süslü parantez dengesiyle fonksiyon kes. */
function fonksiyonAl(ad) {
  const bas = HTML.indexOf("function " + ad + "(");
  if (bas < 0) throw new Error("fonksiyon yok: " + ad);
  let derinlik = 0;
  for (let j = HTML.indexOf("{", bas); j < HTML.length; j++) {
    if (HTML[j] === "{") derinlik++;
    else if (HTML[j] === "}") { derinlik--; if (derinlik === 0) return HTML.slice(bas, j + 1); }
  }
  throw new Error("kapanmadı: " + ad);
}

// ---------------------------------------------------------------
console.log("\n== 1) Profilde 'Analiz Bekliyor' YOK ==");
{
  ok("profil düğmesinde ad yok", APP_KOD.indexOf(">Analiz Bekliyor") < 0);
  ok("okz penceresinde '⏳ Analiz Bekliyor' bölümü yok", APP_KOD.indexOf("⏳ Analiz Bekliyor") < 0);
  ok("'Denemelerim'de aç' götürücüsü kalktı (ölü eylem yok)", APP_KOD.indexOf("okzGitDenemeler") < 0);
  ok("profilde nötr 'Okulizyon sonuçları' düğmesi var", APP_KOD.indexOf(">Okulizyon sonuçları<") > 0);
  ok("profil ipucu metni 'Analiz Bekliyor' demiyor",
    APP_KOD.indexOf("soru Analiz Bekliyor") < 0 && APP_KOD.indexOf("soruda neden seçilmedi") > 0);
  ok("eski 'burada bekleyen sınav sonuçlarını işlersin' notu kalktı",
    APP_KOD.indexOf("Burada bekleyen sınav sonuçlarını işlersin") < 0);
}

// ---------------------------------------------------------------
console.log("\n== 2) Denemelerim'de tuş → liste açılıyor ==");
{
  ok("satırda 'analiz bekliyor (N) →' DÜĞMESİ var",
    /data-act="examAnaliz" data-idx="/.test(HTML));
  ok("düğme yanlış denemeyi seçmiyor (satırın kendi idx'i)", /data-act="examAnaliz" data-idx="' \+ idx \+ '/.test(HTML));
  /* v85 — KULLANICI: "düğmeye basılınca açılıyor ama hala altta da duruyor."
     Sayfadaki liste kartı KALDIRILDI; neden seçimi yalnız PENCEREDE.
     Ölçüt aynı: tuşa basınca liste açılır (artık pencere olarak). */
  ok("examAnaliz işleyicisi var", /case "examAnaliz": examDetailSelect\(Number\(el\.dataset\.idx\)\)/.test(HTML));
  ok("liste penceresi tanımlı", /function okzNedenModalAc\(idx\)/.test(HTML));
  ok("sayfada satır listesi kalmadı", !/id="analiz-bekliyor"/.test(HTML));
  ok("examDetailSelect kaydırıyor", /hedef\.scrollIntoView\(\{ behavior: "smooth", block: "start" \}\)/.test(HTML));
  ok("bekleyen varsa PENCERE açılır", /if \(git !== "ders-detay" && bekleyenVar && typeof okzNedenModalAc === "function"\)/.test(HTML));
  ok("bekleyen yoksa ders detayına iner", /const hedef = document\.getElementById\("ders-detay"\)/.test(HTML));

  /* GERÇEK davranış: examDetailSelect koşturulur, kaydırılan öğe okunur. */
  const govde = fonksiyonAl("examDetailSelect");
  const kaydirilan = [];
  const acilan = [];
  const ogeler = {
    /* v85 — liste kartı yok; yerine pencere açılıyor. */
    "analiz-bekliyor": { id: "analiz-bekliyor", classList: { add() {}, remove() {} }, scrollIntoView() { kaydirilan.push("analiz-bekliyor"); } },
    "ders-detay": { id: "ders-detay", classList: { add() {}, remove() {} }, scrollIntoView() { kaydirilan.push("ders-detay"); } }
  };
  function kos(exams, git) {
    kaydirilan.length = 0; acilan.length = 0;
    const sb = {
      state: { exams: exams },
      examDetailIdx: null,
      renderExams() {}, window: { lucide: null }, lucide: null,
      document: { getElementById: id => ogeler[id] || null, querySelectorAll: () => [] },
      setTimeout: (fn) => fn(),
      Number, String,
      okzNedenModalAc(idx) { acilan.push(idx); }
    };
    vm.createContext(sb);
    vm.runInContext(govde + "\nthis.sec = examDetailSelect;", sb);
    sb.sec(git === undefined ? (exams.length - 1) : null, git);
  }
  kos([{ name: "A", errorLogs: [{ qno: 1, type: "" }] }]);
  ok("neden bekleyen denemede LİSTE (pencere) açılıyor", acilan.length === 1 && kaydirilan.length === 0, "pencere:" + acilan + " kaydırma:" + kaydirilan);
  kos([{ name: "B", errorLogs: [{ qno: 1, type: "ANLAMADIM" }] }]);
  ok("bekleyen yokken ders detayına kaydırıyor", kaydirilan[0] === "ders-detay", String(kaydirilan));
  kos([{ name: "C", errorLogs: [{ qno: 1, type: "" }] }], "ders-detay");
  ok("açık istek (ders-detay) varsa pencere açılmaz", acilan.length === 0 && kaydirilan[0] === "ders-detay", "pencere:" + acilan);
}

// ---------------------------------------------------------------
console.log("\n== 3) Yanlış ve boş AYRI neden listeleri ==");
{
  /* v84 — liste artık okzNedenListesiHtml() içinde TEK yerde üretiliyor
     (sayfa kartı + pencere aynı HTML'i kullanır). Ölçüt aynı: liste kuralları. */
  const blok = HTML.slice(HTML.indexOf('const bekleyen = ((ex && ex.errorLogs)'), HTML.indexOf('Nedenleri kaydet'));
  ok("satır türü belirleniyor (status e = boş)", /bos: !!\(l && l\.status === "e"\)/.test(blok));
  ok("yanlış sayısı ayrı", /const yanlisN = bekleyen\.filter\(x => !x\.bos\)\.length/.test(blok));
  ok("boş sayısı ayrı", /const bosN = bekleyen\.filter\(x => x\.bos\)\.length/.test(blok));
  ok("yanlış satırında WRONG_REASONS", /\(x\.bos \? EMPTY_REASONS : WRONG_REASONS\)\.map/.test(blok));
  ok("select türü taşıyor (data-bos)", /data-bos="' \+ \(x\.bos \? 1 : 0\) \+ '"/.test(blok));
  ok("'Yanlışların tümüne' düğmeleri", /Yanlışların tümüne/.test(blok) && /data-okz-hedef="yanlis"/.test(blok));
  ok("'Boşların tümüne' düğmeleri", /Boşların tümüne/.test(blok) && /data-okz-hedef="bos"/.test(blok));
  ok("tek havuzlu eski liste YOK", blok.indexOf("WRONG_REASONS.concat(EMPTY_REASONS)") < 0);

  /* v86 — KULLANICI: "tüm yanlışlara konu eksiği deyince hepsine değil,
     sadece listede görünene işaretliyor; boşta da aynı sorun var."
     "tümü" artık DOM'daki 25 satıra değil, STATE'teki TÜM bekleyen satırlara
     yazar. Davranış tests/v86-okz-karsilastir.test.js'te koşturulur; burada
     işleyicinin köprüyü doğru argümanlarla çağırdığı ölçülür. */
  const bas2 = HTML.indexOf('case "okzNedenHepsi": {');
  const bit2 = HTML.indexOf('case "videoGit"', bas2);
  const govde = HTML.slice(bas2, bit2);
  ok("işleyici köprüyü çağırıyor", /window\.__okzNedenHepsi\(i2, el\.dataset\.okzHedef, r\)/.test(govde));
  ok("köprü yoksa eski DOM yolu duruyor (güvenlik)", /querySelectorAll\('\.okz-reason\[data-i="' \+ i2 \+ '"\]\[data-bos="' \+ hedef \+ '"\]'\)/.test(govde));
  ok("sonra pencere tazeleniyor", /okzNedenModalTazele\(i2\)/.test(govde));
  ok("köprü uygulama tarafında tanımlı", /window\.__okzNedenHepsi = function \(denemeIdx, hedef, reason\)/.test(
    require("fs").readFileSync(require("path").join(__dirname, "..", "site", "app-pwa.js"), "utf8")));
}

// ---------------------------------------------------------------
console.log("\n== 4) Liste TEK yerde: pencere (sayfada kart yok) ==");
{
  /* v85 — KULLANICI: "düğmeye basılınca açılıyor ama hala altta da duruyor."
     Sayfada liste kartı/select KALMAZ; yalnız özet şerit + pencere. */
  ok("sayfada analiz kartı YOK", !/id="analiz-bekliyor"/.test(HTML));
  ok("sayfada neden select'i üretilmiyor", (HTML.match(/class="okz-reason"/g) || []).length === 1);
  ok("liste penceresi (modal) var", /id="neden-modal"/.test(HTML) && /id="neden-modal-govde"/.test(HTML));
  ok("özet şerit duruyor", /id="okz-yeni-serit"/.test(HTML));
  ok("şeritten pencereye gidiş var", /data-act="okzNedenSec"/.test(HTML));
  ok("turuncu vurgu kalmadı (normal bento-card)", HTML.indexOf('border:1px solid rgba(180,83,9') < 0);
  ok("satır içi sayaç da turuncu değil", HTML.indexOf('color:#B45309;">analiz bekliyor') < 0);
}

console.log("\n" + "─".repeat(58));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("analiz bekliyor — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("analiz bekliyor (G-08/v79) — " + gecen + "/" + gecen + " geçti ✓");
