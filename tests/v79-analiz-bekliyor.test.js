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
  ok("examAnaliz işleyicisi var", /case "examAnaliz": examDetailSelect\(Number\(el\.dataset\.idx\), "analiz-bekliyor"\)/.test(HTML));
  ok("examDetailSelect kaydırıyor", /hedef\.scrollIntoView\(\{ behavior: "smooth", block: "start" \}\)/.test(HTML));
  ok("bekleyen varsa analiz kartına iner", /const hedefId = git \|\| \(bekleyenVar \? "analiz-bekliyor" : "ders-detay"\)/.test(HTML));
  ok("bekleyen yoksa ders detayına iner (boşa kaydırma yok)", /bekleyenVar \? "analiz-bekliyor" : "ders-detay"/.test(HTML));

  /* GERÇEK davranış: examDetailSelect koşturulur, kaydırılan öğe okunur. */
  const govde = fonksiyonAl("examDetailSelect");
  const kaydirilan = [];
  const ogeler = {
    "analiz-bekliyor": { id: "analiz-bekliyor", classList: { add() {}, remove() {} }, scrollIntoView() { kaydirilan.push("analiz-bekliyor"); } },
    "ders-detay": { id: "ders-detay", classList: { add() {}, remove() {} }, scrollIntoView() { kaydirilan.push("ders-detay"); } }
  };
  function kos(exams, git) {
    kaydirilan.length = 0;
    const sb = {
      state: { exams: exams },
      examDetailIdx: null,
      renderExams() {}, window: { lucide: null }, lucide: null,
      document: { getElementById: id => ogeler[id] || null, querySelectorAll: () => [] },
      setTimeout: (fn) => fn(),
      Number, String
    };
    vm.createContext(sb);
    vm.runInContext(govde + "\nthis.sec = examDetailSelect;", sb);
    sb.sec(git === undefined ? (exams.length - 1) : null, git);
  }
  kos([{ name: "A", errorLogs: [{ qno: 1, type: "" }] }]);
  ok("neden bekleyen denemede ANALİZ kartına kaydırıyor", kaydirilan[0] === "analiz-bekliyor", String(kaydirilan));
  kos([{ name: "B", errorLogs: [{ qno: 1, type: "ANLAMADIM" }] }]);
  ok("bekleyen yokken ders detayına kaydırıyor", kaydirilan[0] === "ders-detay", String(kaydirilan));
  kos([{ name: "C", errorLogs: [{ qno: 1, type: "" }] }], "ders-detay");
  ok("açık istek varsa ona uyar", kaydirilan[0] === "ders-detay", String(kaydirilan));
}

// ---------------------------------------------------------------
console.log("\n== 3) Yanlış ve boş AYRI neden listeleri ==");
{
  const blok = HTML.slice(HTML.indexOf('const bekleyen = (sonEx.errorLogs'), HTML.indexOf('Nedenleri kaydet'));
  ok("satır türü belirleniyor (status e = boş)", /bos: !!\(l && l\.status === "e"\)/.test(blok));
  ok("yanlış sayısı ayrı", /const yanlisN = bekleyen\.filter\(x => !x\.bos\)\.length/.test(blok));
  ok("boş sayısı ayrı", /const bosN = bekleyen\.filter\(x => x\.bos\)\.length/.test(blok));
  ok("yanlış satırında WRONG_REASONS", /\(x\.bos \? EMPTY_REASONS : WRONG_REASONS\)\.map/.test(blok));
  ok("select türü taşıyor (data-bos)", /data-bos="' \+ \(x\.bos \? 1 : 0\) \+ '"/.test(blok));
  ok("'Yanlışların tümüne' düğmeleri", /Yanlışların tümüne/.test(blok) && /data-okz-hedef="yanlis"/.test(blok));
  ok("'Boşların tümüne' düğmeleri", /Boşların tümüne/.test(blok) && /data-okz-hedef="bos"/.test(blok));
  ok("tek havuzlu eski liste YOK", blok.indexOf("WRONG_REASONS.concat(EMPTY_REASONS)") < 0);

  /* "tümü" GERÇEKTEN koşturulur: yalnız aynı tür select'e yazmalı. */
  const bas = HTML.indexOf('case "okzNedenHepsi": {');
  const bit = HTML.indexOf('case "videoGit"', bas);
  /* süslü parantez dengesiyle gövdeyi al; sonundaki "break;" atılır */
  let d = 0, son = -1;
  for (let j = HTML.indexOf("{", bas); j < bit; j++) {
    if (HTML[j] === "{") d++;
    else if (HTML[j] === "}") { d--; if (d === 0) { son = j; break; } }
  }
  const hepsi = "var hepsi = (el) => {" + HTML.slice(HTML.indexOf("{", bas) + 1, son).replace(/break;\s*$/, "") + "};";
  const yazilan = [];
  const sb = {
    Number, String,
    document: {
      querySelectorAll: sel => {
        /* beklenen seçici: .okz-reason[data-i="3"][data-bos="1"] */
        const m = /^\.okz-reason\[data-i="(\d+)"\]\[data-bos="(\d)"\]$/.exec(sel);
        if (!m) return [];
        return [{ value: "", _t: m[2] }, { value: "", _t: m[2] }];
      }
    },
    window: { __okzNedenKaydet: () => { yazilan.push("kaydet"); } },
    toast() {}
  };
  vm.createContext(sb);
  vm.runInContext(hepsi, sb);
  const secimler = [];
  const arananlar = [];
  sb.document.querySelectorAll = (sel) => {
    arananlar.push(sel);
    const m = /^\.okz-reason\[data-i="(\d+)"\]\[data-bos="(\d)"\]$/.exec(sel);
    if (!m) return [];
    return [{
      _v: "",
      get value() { return this._v; },
      set value(x) { this._v = x; secimler.push(m[2] + ":" + x); }
    }];
  };
  sb.hepsi({ dataset: { idx: "3", reason: "KONUEKSİZLİĞİ", okzHedef: "bos" } });
  ok("boş hedefi yalnız data-bos=1 satırlarını seçti",
    secimler.length === 1 && secimler[0] === "1:KONUEKSİZLİĞİ",
    JSON.stringify(secimler) + " seçici=" + JSON.stringify(arananlar));
  ok("seçici data-bos hedefini taşıyor",
    arananlar.length === 1 && /\[data-i="3"\]\[data-bos="1"\]/.test(arananlar[0]), JSON.stringify(arananlar));
  ok("kaydet çağrıldı", yazilan.length === 1, String(yazilan.length));
}

// ---------------------------------------------------------------
console.log("\n== 4) Kart normal deneme kartı görünümünde ==");
{
  const kart = HTML.slice(HTML.indexOf('id="analiz-bekliyor"') - 60, HTML.indexOf('id="analiz-bekliyor"') + 500);
  ok("bento-card sınıfı kullanılıyor", /class="bento-card" id="analiz-bekliyor"/.test(HTML));
  ok("turuncu kenar/arka plan kalktı",
    HTML.indexOf('id="analiz-bekliyor" style="margin-top:16px;border:1px solid rgba(180,83,9') < 0);
  ok("başlık ikonu marka renginde", /icon\("clipboard-list", 16, "vertical-align:middle;margin-right:6px;color:var\(--brand-blue\);"\)/.test(kart) ||
    /clipboard-list[^\n]{0,120}brand-blue/.test(kart));
  ok("satır içi sayaç da turuncu değil", HTML.indexOf('color:#B45309;">analiz bekliyor') < 0);
}

console.log("\n" + "─".repeat(58));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("analiz bekliyor — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("analiz bekliyor (G-08/v79) — " + gecen + "/" + gecen + " geçti ✓");
