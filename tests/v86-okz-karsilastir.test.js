#!/usr/bin/env node
/* ============================================================
   v86 — OKULİZYON: "DEFTER YOK, DENEMELERİM VAR"
   ------------------------------------------------------------
   KULLANICI (18 Kas):
     "Tüm verileri silsek de uygulama yeni Okulizyon'dan çekilen
      denemeyi hâlâ aynı diyor. ... En önemlisi bu Okulizyon sorunu.
      Çekme defteri mi ne ona ne gerek var. Uygulama eğer Denemelerim
      bölümünde deneme varsa onunla karşılaştırsın."
     "Deneme analizini yaparken tüm yanlışlara konu eksiği denince
      hepsine değil, sadece listede görünene işaretliyor; boşta da
      aynı sorun var."

   Kanıtlananlar:
     1) "tümüne" düğmesi TÜM bekleyen satırlara yazar (25 satır sınırından bağımsız)
     2) Yanlış nedeni boş satıra, boş nedeni yanlışa yazılmaz
     3) İşlenmiş satıra dokunulmaz; ikinci çağrı 0 döner
     4) Okulizyon kararı yalnız Denemelerim'e (sid) göre verilir
     5) Sıfırlama "silinen" notunu temizler → her şey yeniden çekilir
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) gecen++; else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }
function esit(ad, gelen, beklenen) { ok(ad, gelen === beklenen, "gelen: " + JSON.stringify(gelen) + " · beklenen: " + JSON.stringify(beklenen)); }

// ---- app-pwa.js'deki GERÇEK köprüyü çıkar ----
const BAS = "window.__okzNedenHepsi = function (denemeIdx, hedef, reason) {";
const SON = "window.__okzBekleyenSatirlar";
const i1 = APP.indexOf(BAS), i2 = APP.indexOf(SON, i1);
ok("__okzNedenHepsi köprüsü bulundu", i1 > 0 && i2 > i1);

const BLOK = APP.slice(i1, i2);
const kayit = { save: 0, toast: [], render: 0 };
const sahteWindow = {};
const fn = new Function(
  "state", "saveState", "okzBadge", "renderExams", "document", "toast", "window",
  BLOK + "\nreturn { okzNedenHepsi: window.__okzNedenHepsi };"
);
function kos(state) {
  return fn(state,
    () => { kayit.save++; },
    () => {},
    () => { kayit.render++; },
    { getElementById: () => null },
    (m) => { kayit.toast.push(m); },
    sahteWindow
  );
}

/* 40 soru: 30 yanlış + 10 boş. Pencere ilk 25 satırı çizer → eski kod yalnız
   bu 25'i işaretliyordu; yeni kod 30 yanlışın TAMAMINI işaretler. */
function denemeYap() {
  const errorLogs = [];
  for (let i = 0; i < 30; i++) errorLogs.push({ qno: i + 1, type: "", status: "" });
  for (let i = 0; i < 10; i++) errorLogs.push({ qno: 31 + i, type: "", status: "e" });
  return { name: "Okulizyon: 10. SINIF DENEME", date: "2026-10-27", errorLogs, lessons: {} };
}

console.log("\n== 1) 'Yanlışların tümüne' → 30 yanlışın TAMAMI ==");
{
  const ex = denemeYap();
  const api = kos({ exams: [ex] });
  const n = api.okzNedenHepsi(0, "yanlis", "KONUEKSİKLİĞİ");
  esit("işaretlenen satır = 30 (25 değil)", n, 30);
  esit("yanlışların hepsi işaretli", ex.errorLogs.slice(0, 30).filter(l => l.type === "KONUEKSİKLİĞİ").length, 30);
  esit("boşlara dokunulmadı", ex.errorLogs.slice(30).filter(l => !l.type).length, 10);
  ok("kayıt (saveState) bir kez", kayit.save >= 1);
  ok("kullanıcıya sayı söylendi", /30 soruya/.test(kayit.toast.join(" ")), kayit.toast.join(" "));
}

console.log("\n== 2) 'Boşların tümüne' → 10 boşun TAMAMI, yanlışlar korunur ==");
{
  const ex = denemeYap();
  const api = kos({ exams: [ex] });
  esit("boşlar işaretlendi", api.okzNedenHepsi(0, "bos", "KONUEKSİKLİĞİ"), 10);
  esit("boşların hepsi işaretli", ex.errorLogs.slice(30).filter(l => l.type === "KONUEKSİKLİĞİ").length, 10);
  esit("yanlışlar hâlâ boş", ex.errorLogs.slice(0, 30).filter(l => !l.type).length, 30);
  esit("sonra yanlışlar da işaretlenir", api.okzNedenHepsi(0, "yanlis", "ANLAMADIM"), 30);
  esit("iş bitince 0 döner", api.okzNedenHepsi(0, "yanlis", "ANLAMADIM"), 0);
  esit("bir kez daha boş: 0", api.okzNedenHepsi(0, "bos", "KONUEKSİKLİĞİ"), 0);
}

console.log("\n== 3) İşlenmiş satıra dokunulmaz ==");
{
  const ex = denemeYap();
  ex.errorLogs[0].type = "İşlem Hatası/Dikkatsizlik";
  const api = kos({ exams: [ex] });
  esit("29 yanlış işaretlenir", api.okzNedenHepsi(0, "yanlis", "ANLAMADIM"), 29);
  esit("kullanıcının seçimi korunur", ex.errorLogs[0].type, "İşlem Hatası/Dikkatsizlik");
}

console.log("\n== 4) Pencere 25 satır çiziyor, \"tümüne\" bundan bağımsız ==");
{
  ok("pencere ilk 25 satırı çiziyor", /bekleyen\.slice\(0, 25\)/.test(HTML));
  ok("'tümüne' DOM select'i aramıyor", !/querySelectorAll/.test(BLOK));
  ok("hedef türü (yanlis|bos) kabul ediliyor", /hedef === "bos" \|\| hedef === "e"/.test(BLOK));
}

console.log("\n== 5) Okulizyon kararı yalnız Denemelerim'e göre ==");
{
  ok("karar çağrısı: gelen + state.exams + silinen", /OKZ\.karar\(gelen, state\.exams, silinen\)/.test(APP));
  ok("'okzDefter()' karar yolundan kalktı", !/const defter = okzDefter\(\);/.test(APP));
  ok("işlendi defterine yazım yok", !/okzDefterIkili\(/.test(APP));
  ok("kalıcı defter fonksiyonu yok", !/function okzDefterIsaretle\(/.test(APP));
  ok("eski anahtar bir kez temizleniyor", /localStorage\.removeItem\(OKZ_ESKI_DEFTER_KEY\)/.test(APP) && /OKZ_DEFTER_KALDIRILDI/.test(APP));
  ok("profilde defter düğmesi yok", !/data-act="okzDefteriTemizle"/.test(APP + HTML) && !/>İçe aktarma defterini sıfırla</.test(APP));
}

console.log("\n== 6) Sıfırlama → her şey yeniden çekilir ==");
{
  ok("executeReset silinen notunu temizliyor", /type === "all" \|\| type === "exams"[\s\S]{0,220}__okzSilinenleriTemizle/.test(HTML));
  ok("sıfırlama kuyruğu deftere YAZMIYOR", !/__okzKuyruguDeftereYaz/.test(HTML + APP));
  ok("temizlik diski de boşaltıyor", /function \(\) \{[\s\S]{0,600}okzSilinenDiskeYaz\(\{\}\)/.test(APP));
}

console.log("\n== 7) Aynı ad+tarih, farklı Okulizyon sınavı ==");
{
  ok("okzDenemeyeYaz ÖNCE sid'e bakıyor",
    /if \(sid\) \{[\s\S]{0,300}sidCikar\(e\.okulizyonUrl\) === sid/.test(APP));
  ok("başka sınavın sid'iyle eşleşmiyor", /return !sid \|\| !esid \|\| esid === sid;/.test(APP));
}

console.log("\n" + "─".repeat(58));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("v86 — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("v86 okulizyon/denemelerim — " + gecen + "/" + gecen + " geçti ✓");
