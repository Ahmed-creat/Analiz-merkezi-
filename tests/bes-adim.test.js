#!/usr/bin/env node
/* ============================================================
   5. ADIM = KISA KONTROL  (tests/bes-adim.test.js)
   ------------------------------------------------------------
   Kullanıcı (v41): "5 soruluk tekrar sorusu bu 5 adım kontrol
   olarak ekle. Adım bittiğinde çıkmıyor, müfredat ağacına
   tıklandığında açılıyor bunu düzelt."

   Bu test BLOĞU GERÇEKTEN ÇALIŞTIRIR (metin aramaz):
     · 4 çalışma adımı varken 5. adım KİLİTLİ
     · 4. adım bitince (tstate.step = 4) 5. adım AKTİF ve
       "5 soruluk kontrole başla" düğmesi AYNI EKRANDA çıkar
       (hiçbir yere tıklamak gerekmez)
     · kısa kontrol bitince TAMAMLANDI + doğru sayısı yazılır
     · havuzu olmayan konuda 5. adım konuyu kilitlemez
     · completeTopic, 5. adım bitmeden konuyu tamamlamaz
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) { gecen++; return true; } kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false; }

// ---------- blok: 5 adımlı yol haritası ----------
const BAS = HTML.indexOf("      const adimBitti = tstate.step >= ROADMAP_STEPS.length;");
const SON = HTML.indexOf('      html += "</div>";\n    }\n  }', BAS);
ok("yol haritası bloğu bulundu", BAS > 0 && SON > BAS, BAS + "/" + SON);
const BLOK = HTML.slice(BAS, SON + '      html += "</div>";'.length);

const ROADMAP_STEPS = [
  { title: "Ön Test", desc: "" },
  { title: "Aktif Çalışma", desc: "" },
  { title: "Çözümlü Örnek", desc: "" },
  { title: "Karışık Pratik", desc: "" }
];

function ciz(state, step, pool) {
  const selectedTopicKey = "Matematik > Üslü Sayılar";
  const tstate = { step: step };
  const attr = (x) => String(x);
  const esc = (x) => String(x == null ? "" : x);
  const icon = (n) => "[" + n + "]";
  const APRX = "'";
  const havuzIdCoz = () => pool;
  const fn = new Function(
    "state", "tstate", "selectedTopicKey", "ROADMAP_STEPS", "havuzIdCoz", "attr", "esc", "icon", "APRX",
    "var html = '';\n" + BLOK + "\nreturn html;"
  );
  return fn(state, tstate, selectedTopicKey, ROADMAP_STEPS, havuzIdCoz, attr, esc, icon, APRX);
}

const HAVUZ = "mat_10_u01_k01";

console.log("\n== 1) 4. adım bitmeden 5. adım kilitli ==");
{
  const h = ciz({ bkt_state: {} }, 3, HAVUZ);
  ok("5. adım yazılı", h.indexOf("Kısa Kontrol (5 soru)") >= 0);
  ok("5. adım başlığında kilit simgesi var", h.indexOf("Kısa Kontrol (5 soru) [lock]") >= 0);
  ok("başlat düğmesi YOK", h.indexOf("5 soruluk kontrole başla") < 0);
  ok("konu tamamlama düğmesi YOK", h.indexOf('data-act="completeTopic"') < 0);
}

console.log("\n== 2) 4. adım bitince 5. adım AYNI EKRANDA ==");
{
  const h = ciz({ bkt_state: {} }, 4, HAVUZ);
  ok("5. adım kilidi açıldı (başlıkta kilit yok)", h.indexOf("Kısa Kontrol (5 soru) [lock]") < 0);
  ok("başlat düğmesi çizildi", h.indexOf("5 soruluk kontrole başla") >= 0);
  ok("düğme doğru konuya bağlı", h.indexOf('data-bkt-test="Matematik > Üslü Sayılar"') >= 0);
  ok("düğme doğru havuza bağlı", h.indexOf('data-bkt-pool="' + HAVUZ + '"') >= 0);
  ok("mod precheck (kısa kontrol)", h.indexOf('data-bkt-mode="precheck"') >= 0);
  ok("tamamla düğmesi KİLİTLİ (önce kontrol)",
    h.indexOf('data-act="completeTopic"') >= 0 && h.indexOf("Önce 5 soruluk kontrolü bitir") >= 0);
}

console.log("\n== 3) Kısa kontrol bitince TAMAMLANDI ==");
{
  const h = ciz({ bkt_state: { "Matematik > Üslü Sayılar": { son_kisa_kontrol: "2026-10-29", son_kisa_kontrol_dogru: 4, son_kisa_kontrol_toplam: 5 } } }, 4, HAVUZ);
  ok("TAMAMLANDI yazıyor", h.indexOf("TAMAMLANDI") >= 0);
  ok("doğru sayısı yazılı (4/5)", h.indexOf("4/5") >= 0);
  ok("başlat düğmesi kalktı", h.indexOf("5 soruluk kontrole başla") < 0);
  ok("tamamla düğmesi açıldı", h.indexOf("Konuyu Tamamlandı Olarak İşaretle") >= 0);
  ok("kilit metni yok", h.indexOf("Önce 5 soruluk kontrolü bitir") < 0);
}

console.log("\n== 4) Havuzu olmayan konu kilitlenmez ==");
{
  const h = ciz({ bkt_state: {} }, 4, null);
  ok("havuz yok notu", h.indexOf("soru havuzu yok") >= 0);
  ok("tamamla düğmesi AÇIK", h.indexOf("Konuyu Tamamlandı Olarak İşaretle") >= 0);
}

console.log("\n== 5) completeTopic kapısı ==");
{
  const i = HTML.indexOf("function completeTopic(");
  const parca = HTML.slice(i, i + 900);
  ok("5. adım kapısı kodda", parca.indexOf("son_kisa_kontrol") > 0);
  ok("kapı havuz varsa çalışır", parca.indexOf("if (kontrolHavuz && !bktKayit.son_kisa_kontrol)") > 0);
  ok("kapı uyarı verip çıkar", parca.indexOf("Önce 5. adımı bitir") > 0);
}

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(x => console.log(" ✗ " + x));
  console.log("5. adım testi — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("5. adım testi — " + gecen + "/" + gecen + " geçti ✓");
