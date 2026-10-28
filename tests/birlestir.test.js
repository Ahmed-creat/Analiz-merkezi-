/* ============================================================
   BULUT BİRLEŞTİRME TESTİ (tests/birlestir.test.js)
   ------------------------------------------------------------
   1. maddedeki şikâyet: "her girişte buluttaki veri üzerine
   kaydedilsin mi diye soruyor". Çözüm: soru sormadan birleştir.

   Bu test şunu kanıtlar: birleştirme HİÇBİR kaydı silmez.
   Çalıştır: node tests/birlestir.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const VB = require("../site/veri-birlestir.js");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) { gecen++; return true; } kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false; }
function esit(ad, gelen, beklenen) { return ok(ad, gelen === beklenen, "gelen: " + JSON.stringify(gelen) + " · beklenen: " + JSON.stringify(beklenen)); }

const KOK = path.join(__dirname, "..");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");

// ---- 1) Oturum açılışında soru kalmadı ----
console.log("\n== 1) Girişte soru sorulmuyor ==");
ok("'ÜZERİNE yazılsın mı?' metni kaldırıldı", APP.indexOf("ÜZERİNE yazılsın mı") < 0);
ok("oturumUygula birleştirme yapıyor", /birlestirici\.birlestir\(state, uzakState\)/.test(APP) && APP.indexOf("window.VB") > 0);
ok("birleştirme sonrası bilgi veriliyor", APP.indexOf("hiçbir veri silinmedi") > 0);
ok("veri-birlestir.js sayfaya yüklendi", HTML.indexOf('src="veri-birlestir.js"') > 0);
ok("openConfirm ile bulut sorusu kalmadı", !/openConfirm\(\s*\n?\s*"Bulutta/.test(APP));

// ---- 2) Denemeler: iki tarafta olanlar korunur ----
console.log("\n== 2) Denemeler birleşiyor ==");
const yerel = {
  user: { name: "ÖĞRENCİ", grade: "10" },
  exams: [
    { id: "a1", name: "Deneme 1", date: "2026-10-01", lessons: { Matematik: { d: 10, w: 2, e: 0 } }, errorLogs: [{ qno: 1, type: "KONU EKSİKLİĞİ" }], net: 9.5 },
    { id: "a2", name: "Deneme 2", date: "2026-10-20", lessons: {}, errorLogs: [], net: 5 }
  ],
  questions: [{ id: "q1", lesson: "Fizik", d: 5, w: 1, e: 0, errorLogs: [] }],
  topics: { "Matematik > Trigonometri": { step: 2 } },
  bkt_state: { "Matematik > Trigonometri": { L: 0.4, gozlem_sayisi: 3, hata_gecmisi: [], onay_durumu: "GELISIYOR" } },
  settings: { notifPermission: "granted" },
  notifications: [{ id: "n1", title: "yerel", date: "2026-10-20" }]
};
const uzak = {
  user: { name: "", grade: "9" },
  exams: [
    // aynı deneme (aynı id) ama bulutta daha çok hata kaydı işlenmiş
    { id: "a1", name: "Deneme 1", date: "2026-10-01", lessons: { Matematik: { d: 10, w: 2, e: 0 } }, errorLogs: [{ qno: 1 }, { qno: 2 }, { qno: 3 }], net: 9.5 },
    { id: "a3", name: "Deneme 3 (bulutta)", date: "2026-09-15", lessons: {}, errorLogs: [], net: 7 }
  ],
  questions: [{ id: "q2", lesson: "Kimya", d: 8, w: 0, e: 2, errorLogs: [] }],
  topics: { "Matematik > Trigonometri": { step: 4 }, "Fizik > Hareket": { step: 1 } },
  bkt_state: {
    "Matematik > Trigonometri": { L: 0.8, gozlem_sayisi: 9, hata_gecmisi: [{ date: "2026-10-10" }], onay_durumu: "ONAYLANDI" },
    "Fizik > Hareket": { L: 0.5, gozlem_sayisi: 4, hata_gecmisi: [], onay_durumu: "GELISIYOR" }
  },
  settings: { lastCoachDay: "2026-10-20" },
  notifications: [{ id: "n2", title: "bulut", date: "2026-10-25" }]
};
const m = VB.birlestir(yerel, uzak);

esit("deneme sayısı 3 (2 yerel + 1 bulut)", m.exams.length, 3);
ok("yereldeki Deneme 2 korunur", !!m.exams.find(e => e.id === "a2"));
ok("buluttaki Deneme 3 eklendi", !!m.exams.find(e => e.id === "a3"));
const a1 = m.exams.find(e => e.id === "a1");
ok("aynı denemede daha işlenmiş kopya kazanır", a1.errorLogs.length === 3, "hata kaydı: " + a1.errorLogs.length);
esit("soru çözümleri birleşti", m.questions.length, 2);
ok("kullanıcı adı boş buluta ezilmedi", m.user.name === "ÖĞRENCİ");
ok("sınıf bilgisi korunur", m.user.grade === "10", m.user.grade);
ok("yerel ayar korunur", m.settings.notifPermission === "granted");
ok("bulut ayarı da eklenir", m.settings.lastCoachDay === "2026-10-20");
esit("bildirim birleşti", m.notifications.length, 2);
ok("bildirimler yeniden eskiye sıralı", m.notifications[0].id === "n2", m.notifications.map(n => n.id).join(","));

// ---- 3) BKT / konu: ileri olan kazanır, geçmiş birleşir ----
console.log("\n== 3) BKT ve konular ==");
const bkt = m.bkt_state["Matematik > Trigonometri"];
esit("gözlem sayısı: büyük olan", bkt.gozlem_sayisi, 9);
esit("yeterlilik: yüksek olan", bkt.L, 0.8);
esit("onay durumu: ileri olan", bkt.onay_durumu, "ONAYLANDI");
ok("hata geçmişleri birleşti", bkt.hata_gecmisi.length >= 1);
ok("buluttaki yeni konu eklendi", !!m.bkt_state["Fizik > Hareket"]);
esit("konu adımı: ileri olan", m.topics["Matematik > Trigonometri"].step, 4);
ok("yerelde olmayan konu eklendi", !!m.topics["Fizik > Hareket"]);

// ---- 4) Okulizyon defteri: silinen veri geri gelmez ----
console.log("\n== 4) Okulizyon defteri korunur ==");
const m2 = VB.birlestir(
  { okulizyon: { islenen: { "Sınav A|2026-10-27": "hashA" }, pending: [], importedKeys: ["Sınav A|2026-10-27"] } },
  { okulizyon: { islenen: { "Sınav B|2026-10-20": "hashB" }, pending: [{ name: "Sınav C", date: "2026-10-01", rows: [] }], importedKeys: ["Sınav B|2026-10-20"] } }
);
esit("iki taraftaki defter kaydı korunur", Object.keys(m2.okulizyon.islenen).length, 2);
esit("kuyruk kaybolmadı", m2.okulizyon.pending.length, 1);
esit("importedKeys birleşti", m2.okulizyon.importedKeys.length, 2);

// ---- 5) Boş / bozuk girdi ----
console.log("\n== 5) Dayanıklılık ==");
const m3 = VB.birlestir({ exams: [] }, null);
esit("uzak null → yerel korunur", m3.exams.length, 0);
const m4 = VB.birlestir(null, { exams: [{ id: "x" }] });
esit("yerel null → bulut korunur", m4.exams.length, 1);
const m5 = VB.birlestir({ exams: "bozuk" }, { exams: [{ id: "y" }] });
esit("bozuk dizi → bulut kullanılır", m5.exams.length, 1);
const oz = VB.ozet(m);
esit("özet: deneme", oz.deneme, 3);
ok("özet: hata sayısı toplanır", oz.hata >= 3, JSON.stringify(oz));

// ---- 6) Hiçbir kayıt kaybolmadı (ana iddia) ----
console.log("\n== 6) Kayıpsızlık ==");
const oncekiIdler = yerel.exams.map(e => e.id).concat(uzak.exams.map(e => e.id));
const sonrakiIdler = m.exams.map(e => e.id);
ok("tüm deneme kimlikleri korundu", oncekiIdler.every(id => sonrakiIdler.includes(id)), oncekiIdler.join(",") + " → " + sonrakiIdler.join(","));
esit("kimlik tekrarı yok", new Set(sonrakiIdler).size, sonrakiIdler.length);

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(x => console.log(" ✗ " + x));
  console.log("Birleştirme testi — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("Birleştirme testi — " + gecen + "/" + gecen + " geçti ✓");
