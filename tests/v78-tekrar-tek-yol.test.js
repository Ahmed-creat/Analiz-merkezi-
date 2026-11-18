#!/usr/bin/env node
/* ============================================================
   ERKEN TEKRAR: İKİ EKRAN TEK DAVRANIŞ — tests/v78-tekrar-tek-yol.test.js   (G-06)
   ------------------------------------------------------------
   KULLANICI KARARI (2026-11-18):
     "erken tekrarda kart açsın. Konu takibinde de bilgi bankasında da aynı
      şey. Neden farklı davransın ki."

   KÖK NEDEN: Konu Takibi'ndeki "Erken Tekrar" düğmesi reviewTopic(key,true)
   çağırıyordu → kart turu AÇILMADAN tekrar yazılıyordu. Bilgi Bankası ise
   tekrarKartBasla ile kart açıyordu (v60 "tek düğme" iddiası yarım kalmış).

   Kanıtlananlar (index.html'den GERÇEK kod, vm ile):
     1) earlyReview       → kart turu açar (AmKart.ac: tekrar+erken)
     2) reviewTopic(k,true) → aynı yolu izler (kart turu)
     3) reviewTopic(k,false) → günü gelmişse yine kart turu
     4) Kart turu AÇILIRKEN markReviewed ÇAĞRILMAZ (kayıt tur bitince yazılır)
     5) Kartı olmayan konuda kilitlenme yok: kayıt doğrudan yazılır
     6) Konu Takibi satırındaki erken düğme data-act="tekrarKart"
     7) Kaynakta data-act="earlyReview" kalmadı
     8) Erken turda basamak ARTMAZ (G-02 karar A ile uyum)
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const HTML = fs.readFileSync(path.join(__dirname, "..", "site", "index.html"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) gecen++; else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }

function kes(ad) {
  const bas = HTML.indexOf("function " + ad + "(");
  if (bas < 0) throw new Error("fonksiyon yok: " + ad);
  const ac = HTML.indexOf("{", bas);
  let d = 0;
  for (let i = ac; i < HTML.length; i++) {
    if (HTML[i] === "{") d++;
    else if (HTML[i] === "}") { d--; if (!d) return HTML.slice(bas, i + 1); }
  }
  throw new Error("kapanmadı: " + ad);
}

const KAYNAK = [kes("reviewTopic"), kes("tekrarKartBasla"), kes("earlyReview")].join("\n\n");

function kur(secenek) {
  const o = secenek || {};
  const iz = { ac: [], mark: [], toast: [], navigate: [], uyari: 0 };
  const ctx = {
    console, JSON, Object, Array, String, Number, Math, Promise,
    state: { memory: {}, topics: {}, bkt_state: {} },
    window: {
      AmKart: o.kartYok ? undefined : {
        kartlar: function () { return Promise.resolve(o.kartListesi || [{ front: "soru", back: "cevap" }]); },
        ac: function (key, opts) { iz.ac.push({ key: key, opts: opts }); return Promise.resolve(o.acSonuc || { ok: true }); }
      }
    },
    konuTamamMi: () => o.tamam !== false,
    tamamlanmamisUyar: () => { iz.uyari++; },
    nextReviewInfo: () => o.sonraki || { day: 3, date: "2026-12-01" },
    parseDay: (s) => { const d = new Date(String(s) + "T00:00:00"); return isNaN(d) ? null : d; },
    todayStr: () => "2026-11-18",
    kartGosterilir: () => o.kartVar !== false,
    kartDurumHizli: () => ({ sayi: o.kartSayi === undefined ? 5 : o.kartSayi, tamam: !!o.turBugunBitti }),
    markReviewed: (k, e) => { iz.mark.push({ key: k, erken: e }); },
    navigate: (p) => { iz.navigate.push(p); },
    toast: (m) => { iz.toast.push(m); }
  };
  vm.runInNewContext(KAYNAK, ctx);
  return { iz, ctx };
}

// Promise zincirini beklemek için küçük yardımcı
function bekle() { return new Promise(r => setTimeout(r, 5)); }

(async function () {
  console.log("\n== 1) earlyReview → kart turu açar ==");
  {
    const { iz, ctx } = kur();
    ctx.earlyReview("Matematik > Türev");
    ok("AmKart.ac çağrıldı", iz.ac.length === 1, String(iz.ac.length));
    ok("doğru konu", iz.ac[0] && iz.ac[0].key === "Matematik > Türev");
    ok("tekrar modu", !!(iz.ac[0] && iz.ac[0].opts && iz.ac[0].opts.tekrar === true));
    ok("erken işareti", !!(iz.ac[0] && iz.ac[0].opts && iz.ac[0].opts.erken === true));
  }

  console.log("\n== 2) reviewTopic(k, true) AYNI yolu izler ==");
  {
    const { iz, ctx } = kur();
    ctx.reviewTopic("Fizik > Vektörler", true);
    ok("kart turu açıldı", iz.ac.length === 1, String(iz.ac.length));
    ok("erken işareti var", !!(iz.ac[0] && iz.ac[0].opts.erken === true));
    ok("doğrudan markReviewed ÇAĞRILMADI (kayıt tur bitince)", iz.mark.length === 0, JSON.stringify(iz.mark));
  }

  console.log("\n== 3) reviewTopic(k, false) günü gelmişse kart turu ==");
  {
    const { iz, ctx } = kur();
    ctx.reviewTopic("Fizik > Vektörler", false);
    await bekle();   // kart listesi Promise ile geliyor
    ok("kart turu açıldı", iz.ac.length === 1, String(iz.ac.length));
    ok("erken işareti YOK", !!(iz.ac[0] && iz.ac[0].opts.erken === false));
  }

  console.log("\n== 4-5) Kart yoksa kilitlenme yok ==");
  {
    const { iz, ctx } = kur({ kartYok: true });
    ctx.reviewTopic("Kimya > Mol", true);
    ok("AmKart yok → kayıt doğrudan yazıldı", iz.mark.length === 1, JSON.stringify(iz.mark));
    ok("erken olarak yazıldı", iz.mark[0] && iz.mark[0].erken === true);
    ok("kullanıcıya bilgi verildi", iz.toast.length === 1);
  }
  {
    const { iz, ctx } = kur({ kartSayi: 0, kartVar: false });
    ctx.reviewTopic("Biyoloji > Hücre", true);
    ok("kart gösterilmeyen konuda kilitlenme yok", iz.mark.length === 1 && iz.ac.length === 0,
      "mark: " + iz.mark.length + " · ac: " + iz.ac.length);
  }
  {
    const { iz, ctx } = kur({ turBugunBitti: true });
    ctx.reviewTopic("Tarih > İlk Türk Devletleri", false);
    ok("tur bugün bittiyse kart istenmez, kayıt yazılır", iz.mark.length === 1 && iz.ac.length === 0,
      "mark: " + iz.mark.length + " · ac: " + iz.ac.length);
  }

  console.log("\n== 6-7) Kaynak: iki ekran aynı düğmeye bağlı ==");
  {
    ok("Konu Takibi erken düğmesi tekrarKart'a bağlı",
      /data-act="tekrarKart" data-topic="' \+ attr\(r\.key\)/.test(HTML));
    ok("data-act=\"earlyReview\" kaynakta KALMADI", HTML.indexOf('data-act="earlyReview"') < 0);
    ok("earlyReview yardımcısı tekrarKartBasla'ya delege ediyor",
      /function earlyReview\(topicKey\) \{ tekrarKartBasla\(topicKey\); \}/.test(HTML));
    ok("reviewTopic'in erken dalı tekrarKartBasla çağırıyor",
      /if \(erken\) \{ tekrarKartBasla\(topicKey\); return; \}/.test(HTML));
  }

  console.log("\n== 8) Erken turda basamak artmaz (G-02 A kararı) ==");
  {
    const i = HTML.indexOf("window.__kartTamamla = function");
    const parca = HTML.slice(i, i + 900);
    ok("__kartTamamla: erken → adım sabit", /mem\.step = erken \? adimKart : Math\.min/.test(parca));
    ok("markReviewed: early → adım sabit", /mem\.step = early \? adimTekrar : Math\.min/.test(HTML));
  }

  await bekle();
  console.log("\n" + "─".repeat(56));
  if (kalan) {
    hatalar.forEach(h => console.log(" ✗ " + h));
    console.log("tekrar tek yol — " + gecen + " geçti, " + kalan + " kaldı ✗");
    process.exit(1);
  }
  console.log("tekrar tek yol — " + gecen + "/" + gecen + " geçti ✓");
})();
