#!/usr/bin/env node
/* ============================================================
   OKULİZYON → DENEMELERİM (tek yol) — tests/v78-okulizyon-denemelerim.test.js  (G-08)
   ------------------------------------------------------------
   KULLANICI
     "okulizyondan gelen denemeler profildeki analiz bekliyor kısmında olmasın,
      direk denemelerim bölümünde olsun. Analiz bekliyor'a tıkladığında orada
      liste görünsün." · "neden seçimini daha sonra yapınca daha hızlı olmuyor ki"

   ESKİ DURUM: çekilen sınav `state.okulizyon.pending` kuyruğunda bekliyordu;
   Denemelerim'e ancak modalda neden seçilip kaydedilince giriyordu. "Hızlı
   kaydet" yolu ise `errorLogs: []` yazdığı için deneme görünse bile KONU
   ANALİZİ hiç doğmuyordu ("Okulizyon hatasız ama analiz yok").

   Kanıtlananlar:
     1) Çekimde denemeler DOĞRUDAN state.exams'a yazılıyor, kuyruk boşalıyor
     2) Satırlar konu + soru no + video ile yazılıyor, `type` BOŞ
     3) MOTOR: neden boş satır gözlem SAYILMAZ ve "işlendi" İŞARETLENMEZ
        (neden sonra yazılınca gerçekten işlenir — bu, "sonra seç" akışının
        analiz üretmesinin tek şartı)
     4) Neden yazılınca gözlem oluşuyor (Acil Çalışılacaklar doluyor)
     5) Profil modalında kuyruk listesi YOK; "Denemelerim'de aç" var
     6) Hızlı kaydet yolları artık errorLogs: [] yazmıyor
     7) Denemelerim'de satır satır neden seçimi + "tümü" + kaydet
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const KOK = path.join(__dirname, "..");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const MOTOR = fs.readFileSync(path.join(KOK, "site", "bkt-engine.js"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) gecen++; else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }

// ---------------------------------------------------------------
console.log("\n== 1-2) Çekim: denemeler doğrudan Denemelerim'e, satırlar nedensiz ==");
{
  ok("çekimde denemeler okzDenemeyeYaz ile yazılıyor",
    /yeni\.forEach\(function \(ex\) \{[\s\S]{0,300}okzDenemeyeYaz\(ex, dersler\)/.test(APP));
  ok("kuyruk boşaltılıyor (profilde beklemiyor)", /okzIsaretle\(ex\);\s*\}\);\s*st\.pending = \[\];/.test(APP));
  ok("okzDenemeyeYaz errorLogs'u satırlardan kuruyor",
    /errorLogs: okzSatirLoglari\(ex\)/.test(APP));
  ok("satır kaydı tip BOŞ (neden sonra seçilir)", /type: "", date: \(ex && ex\.date\) \|\| todayStr\(\)/.test(APP));
  ok("satır kaydı soru no taşıyor", /qno: row\.qno \|\| \(j \+ 1\)/.test(APP));
  ok("satır kaydı video izi taşıyor", /if \(row\.video\) log\.video = row\.video;/.test(APP));
  /* Yorumlar ayıklanır: kök neden ANLATIMI değil, KOD denetlenir. */
  const APP_KOD = APP.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  ok("hızlı kaydet yolu errorLogs: [] YAZMIYOR", APP_KOD.indexOf("errorLogs: []") < 0,
    "kalan: " + (APP_KOD.match(/errorLogs: \[\]/g) || []).length);
  ok("hızlı kaydet satırları taşıyor", /okzDenemeyeYaz\(\{ name: sn\.name[\s\S]{0,120}rows: sn\.rows/.test(APP));
  ok("sonSonuc satırları saklıyor", /satir: \(ex\.rows \|\| \[\]\)\.length, toplam: ex\.toplam \|\| null,\s*\n\s*rows: ex\.rows \|\| \[\]/.test(APP));
}

// ---------------------------------------------------------------
console.log("\n== 3-4) MOTOR: neden boş → gözlem yok, işaret yok; neden yazılınca işlenir ==");
{
  const context = {
    console, Date, Set, Math, JSON, Promise, encodeURIComponent, Number, Object, Array, String, isFinite,
    window: {},
    document: { readyState: "loading", addEventListener() {} }
  };
  context.state = {
    user: { name: "Test", grade: "10" },
    bkt_state: {}, bkt_processed_records: {}, bkt_migration_done: false,
    flashcards: { cards: [], sessions: {}, lastSoftDrop: {} },
    memory: {}, questions: [], topics: {}, mini_test_kuyrugu: [], mini_test_sessions: {},
    soru_havuzu_gosterim_logu: [],
    exams: [{
      id: "okz1", name: "Okulizyon: Deneme 1", date: "2026-11-17",
      lessons: { "Matematik": { d: 5, w: 2, e: 1 } },
      errorLogs: [
        { qno: 3, lesson: "Matematik", topic: "Türev", type: "", date: "2026-11-17" },
        { qno: 7, lesson: "Matematik", topic: "Türev", type: "", date: "2026-11-17" }
      ]
    }]
  };
  vm.runInNewContext(MOTOR, context, { filename: "bkt-engine.js" });
  const BKT = context.window.AnalizBKT;

  BKT.processNewRecords();
  const isaretli = Object.keys(context.state.bkt_processed_records).filter(k => k.indexOf("error:") > 0);
  ok("neden boş satır 'işlendi' SAYILMADI", isaretli.length === 0, JSON.stringify(isaretli.slice(0, 3)));
  const kayit = context.state.bkt_state["Matematik > Türev"];
  ok("gözlem oluşmadı (uydurma yok)", !kayit || kayit.gozlem_sayisi === 0,
    kayit && String(kayit.gozlem_sayisi));

  // Kullanıcı nedenleri Denemelerim'de seçti
  context.state.exams[0].errorLogs[0].type = "KONUEKSİKLİĞİ";
  context.state.exams[0].errorLogs[1].type = "ANLAMADIM";
  BKT.processNewRecords();
  const sonra = context.state.bkt_state["Matematik > Türev"];
  ok("neden yazılınca gözlem oluştu (2)", sonra && sonra.gozlem_sayisi === 2, sonra && String(sonra.gozlem_sayisi));
  ok("hata geçmişi yazıldı", sonra && sonra.hata_gecmisi.length === 2, sonra && String(sonra.hata_gecmisi.length));
  ok("tekrar işleme mükerrer gözlem eklemiyor", (function () {
    BKT.processNewRecords();
    return context.state.bkt_state["Matematik > Türev"].gozlem_sayisi === 2;
  })());
}

// ---------------------------------------------------------------
console.log("\n== 5) Profil: kuyruk listesi YOK, götürücü var ==");
{
  const bas = APP.indexOf("function renderOkzModal()");
  const son = APP.indexOf("function okzSaveBilgi()");
  const modal = APP.slice(bas, son);
  ok("modalda kuyruk listesi yok", modal.indexOf("st.pending") < 0);
  /* v79 — KULLANICI: "profilden analiz bekliyor'u kaldırmamışsın." Artık
     profilde 'Analiz Bekliyor' ADI, SAYACI ve götürücüsü HİÇ yok.
     Yorumlar ayıklanır: kök neden ANLATIMI değil, KOD denetlenir. */
  const APP_KOD = APP.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  ok("profil penceresinde 'Analiz Bekliyor' adı yok",
    APP_KOD.indexOf(">Analiz Bekliyor") < 0 && APP_KOD.indexOf("⏳ Analiz Bekliyor") < 0);
  ok("profilde bekleyen sayacı yok", !/Analiz Bekliyor' \+ \(bekleyen/.test(APP_KOD) && modal.indexOf("okzBekleyenSatirlar") < 0);
  ok("'Denemelerim'de aç' götürücüsü kalktı (düğmesiz eylem yok)", APP_KOD.indexOf("okzGitDenemeler") < 0);
  ok("sayaç yalnız profil rozetinde kullanılıyor", /const n = okzBekleyenSatirlar\(\)/.test(APP));
  ok("okzBekleyenSatirlar yalnız boş nedenli satırları sayar", /l && !l\.type/.test(APP));
}

// ---------------------------------------------------------------
console.log("\n== 6) Denemelerim: liste + neden seçimi + tek tuş ==");
{
  ok("satırda 'analiz bekliyor (N)' rozeti", /analiz bekliyor \(' \+ bekleyenN/.test(HTML));
  ok("editör yalnız neden bekleyen satırları listeler", /filter\(x => x\.l && !x\.l\.type\)/.test(HTML));
  ok("satır başına neden seçimi (select.okz-reason)", /class="okz-reason" data-i="/.test(HTML));
  ok("'tümü: <neden>' tek tuşu", HTML.indexOf('data-act="okzNedenHepsi"') > 0);
  ok("kaydet düğmesi", HTML.indexOf('data-act="okzNedenKaydet"') > 0);
  ok("kaydet köprüsü app-pwa'da", /window\.__okzNedenKaydet = function/.test(APP));
  ok("kaydet yazınca saveState + analiz", /saveState\(\);\s*\/\/ BKT: neden yazılan satırlar işlenir/.test(APP));
}

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("okulizyon → denemelerim — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("okulizyon → denemelerim — " + gecen + "/" + gecen + " geçti ✓");
