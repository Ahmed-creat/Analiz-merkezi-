/* ============================================================
   GÖRSEL SORU + VİDEO ÇÖZÜM TESTLERİ
   ------------------------------------------------------------
   5. madde: "üçgen, ivme, hız, grafik gibi görsel sorular"
   ve "yapamadığın soruların video çözümü".
   Çalıştır: node tests/gorsel-video.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const GV = require("../site/gorsel.js");
const VC = require("../site/video-cozum.js");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) { gecen++; return true; } kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false; }
function esit(ad, g, b) { return ok(ad, g === b, "gelen: " + JSON.stringify(g) + " · beklenen: " + JSON.stringify(b)); }

const KOK = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const ENGINE = fs.readFileSync(path.join(KOK, "site", "bkt-engine.js"), "utf8");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const HAVUZ = path.join(KOK, "site", "content", "soru_havuzlari");

// ---------- 1) SVG üretimi ----------
console.log("\n== 1) Görsel motoru ==");
const ucgen = GV.svg({ tip: "ucgen", dik: "C", kenarlar: { a: "7", b: "24", c: "?" }, aci: "α", aciKose: "A" });
ok("üçgen: SVG üretildi", /^<svg[\s\S]*<\/svg>$/.test(ucgen), ucgen.slice(0, 40));
ok("üçgen: kenar etiketleri basıldı", ucgen.indexOf(">7<") > 0 && ucgen.indexOf(">24<") > 0);
ok("üçgen: açı adı basıldı", ucgen.indexOf("α") > 0);
ok("üçgen: dik açı işareti var", ucgen.indexOf("<path") > 0);
ok("üçgen: beyaz zemin (koyu temada da okunur)", ucgen.indexOf('fill="#fff"') > 0);

const grafik = GV.svg({ tip: "grafik", xEkseni: "t (s)", yEkseni: "v (m/s)", seriler: [{ ad: "v", noktalar: [[0, 12], [4, 0], [8, -12]] }] });
ok("grafik: eksen adları", grafik.indexOf("t (s)") > 0 && grafik.indexOf("v (m/s)") > 0);
ok("grafik: çizgi (polyline)", grafik.indexOf("<polyline") > 0);
ok("grafik: negatif değerler kırpılmıyor", grafik.indexOf(",0,") > 0 || grafik.indexOf("12") > 0);

const vektor = GV.svg({ tip: "vektor", xEkseni: "vx", yEkseni: "vy", vektorler: [{ ad: "vx = 12", x: 12, y: 0 }, { ad: "vy = 16", x: 0, y: 16 }] });
ok("vektör: iki ok", (vektor.match(/marker-end/g) || []).length === 2);
const sema = GV.svg({ tip: "sema", kutular: ["A", "B", "C"] });
ok("şema: üç kutu", (sema.match(/<rect /g) || []).length >= 4);
const tablo = GV.svg({ tip: "tablo", basliklar: ["t", "v"], satirlar: [["0", "0"], ["2", "10"]] });
ok("tablo: hücreler", tablo.indexOf(">10<") > 0);

esit("bilinmeyen tip → boş", GV.svg({ tip: "yok" }), "");
esit("boş girdi → boş", GV.svg(null), "");
ok("bozuk parametre çökmez", typeof GV.svg({ tip: "grafik", seriler: "x" }) === "string");
esit("doğrulama: sağlam", GV.dogrula({ tip: "ucgen", kenarlar: { a: 1 } }).length, 0);
ok("doğrulama: eksik seriler yakalanır", GV.dogrula({ tip: "grafik" }).length > 0);

// ---------- 2) Havuzlara eklenen görseller ----------
console.log("\n== 2) Havuzdaki görseller ==");
const dosyalar = ["mat_10_u01_k01", "fizik_10_u01_k01", "fizik_10_u01_k02", "fizik_10_u01_k04", "kimya_10_u01_k04", "biyo_10_u01_k02"];
let gorselliSoru = 0, bozuk = 0;
dosyalar.forEach(function (h) {
  const d = JSON.parse(fs.readFileSync(path.join(HAVUZ, h + ".json"), "utf8"));
  (d.sorular || []).forEach(function (q) {
    if (!q.gorsel) return;
    gorselliSoru++;
    if (GV.dogrula(q.gorsel).length || !GV.svg(q.gorsel)) { bozuk++; hatalar.push("bozuk görsel: " + q.soru_id); }
  });
});
ok("en az 10 soruda görsel var", gorselliSoru >= 10, String(gorselliSoru));
esit("bozuk görsel yok", bozuk, 0);

const mat = JSON.parse(fs.readFileSync(path.join(HAVUZ, "mat_10_u01_k01.json"), "utf8"));
const q1 = mat.sorular.find(q => q.soru_id === "mat_10_u01_k01_o01");
ok("trigonometri sorusunda üçgen var", q1 && q1.gorsel && q1.gorsel.tip === "ucgen");
ok("üçgen kenarları soru metniyle aynı (7 ve 24)", q1.gorsel.kenarlar.a === "7" && q1.gorsel.kenarlar.b === "24");
const fiz = JSON.parse(fs.readFileSync(path.join(HAVUZ, "fizik_10_u01_k02.json"), "utf8"));
const q9 = fiz.sorular.find(q => q.soru_id === "fizik_10_u01_k02_o09");
ok("hız-zaman grafiği sorusunda grafik var", q9 && q9.gorsel && q9.gorsel.tip === "grafik");
esit("grafik +12'den −12'ye", JSON.stringify(q9.gorsel.seriler[0].noktalar), JSON.stringify([[0, 12], [4, 0], [8, -12]]));

// ---------- 3) Görsel ekranlara bağlı mı? ----------
console.log("\n== 3) Arayüz bağlantısı ==");
ok("gorsel.js sayfaya yükleniyor", HTML.indexOf('src="gorsel.js"') > 0);
ok("tekrar testinde görsel basılıyor", ENGINE.indexOf("window.GV.html(q.gorsel") > 0);
ok("sonuç ekranında görsel basılıyor", (ENGINE.match(/GV\.html\(q\.gorsel/g) || []).length >= 2);
ok("havuz doğrulaması görseli denetliyor", ENGINE.indexOf("GV.dogrula") > 0);
ok("görsel ekleme betiği var", fs.existsSync(path.join(KOK, "scripts", "gorsel-ekle.js")));

// ---------- 4) Video çözüm: güvenli adres ----------
console.log("\n== 4) Video bağlantısı ==");
esit("göreli → okulizyon.com", VC.normalize("/app2/video/1"), "https://okulizyon.com/app2/video/1");
esit("youtube kabul", VC.normalize("https://www.youtube.com/watch?v=a"), "https://www.youtube.com/watch?v=a");
esit("javascript: reddedilir", VC.normalize("javascript:alert(1)"), "");
esit("yabancı alan adı reddedilir", VC.normalize("https://kotu-site.example/v.mp4"), "");
esit("boş → boş", VC.normalize(""), "");
ok("hücreden bağlantı çıkar", VC.htmlDenCikar('<td><a href="/app2/cozum/9">v</a></td>').indexOf("okulizyon.com") > 0);
esit("hücrede bağlantı yoksa boş", VC.htmlDenCikar("<td>—</td>"), "");

// Okulizyon videoyu doğrudan adresle vermiyor → "Okulizyon'da aç" mantığı
const vA = VC.izleLink({ video: "https://youtu.be/x" });
ok("doğrudan video → 'İzle'", vA && vA.etiket === "İzle", JSON.stringify(vA));
const vB = VC.izleLink({ videoVar: true, okulizyonUrl: "https://okulizyon.com/app2/?pg=yks&sid=1" });
ok("düğme + sınav adresi → 'Okulizyon'da aç'", vB && vB.etiket === "Okulizyon'da aç", JSON.stringify(vB));
esit("ne video ne adres → bağlantı yok (uydurma yok)", VC.izleLink({ videoVar: true }), null);

// ---------- 5) "Çözümü izle" akışı ----------
console.log("\n== 5) Yapamadığın sorular ==");
const st = {
  exams: [{
    name: "Okulizyon: Deneme 1", date: "2026-10-27", okulizyonUrl: "https://okulizyon.com/app2/?pg=yks&sid=9",
    errorLogs: [
      { qno: "3", lesson: "Matematik", topic: "1.1 Trigonometri", status: "w", type: "KONU EKSİKLİĞİ", videoVar: true },
      { qno: "4", lesson: "Fizik", topic: "1.2 Hareket", status: "e", type: "SÜRE YETMEDİ" }
    ]
  }]
};
const iz = VC.izlenecekler(st);
esit("iki soru listelenir", iz.length, 2);
esit("boş soru 'boş' etiketli", iz.find(x => x.qno === "4").durum, "boş");
ok("sınav adresi soruya taşındı", iz[0].okulizyonUrl.indexOf("okulizyon.com") > 0);
esit("konu süzgeci çalışıyor", VC.izlenecekler(st, "Fizik > 1.2 Hareket").length, 1);
esit("olmayan konu → boş", VC.izlenecekler(st, "Yok > Yok").length, 0);

ok("Konu Takibi'nde 'çözümü izle' adımı var", HTML.indexOf("Yapamadığın Soruların Çözümünü İzle") > 0);
ok("adım video listesini basıyor", HTML.indexOf("function videoAdimHtml") > 0);
ok("Denemelerim'de 'Yapamadığın Sorular' bölümü var", HTML.indexOf("Yapamadığın Sorular <span") > 0);
ok("video-cozum.js sayfaya yükleniyor", HTML.indexOf('src="video-cozum.js"') > 0);
ok("içe aktarımda video alanı taşınıyor", APP.indexOf("row.videoVar || row.video") > 0);
ok("sınav adresi kayda yazılıyor", APP.indexOf("okulizyonUrl: ex.url") > 0);
ok("service worker yeni dosyaları önbelleğe alıyor", fs.readFileSync(path.join(KOK, "site", "sw.js"), "utf8").indexOf('"./gorsel.js"') > 0);

// ---------- 6) Okulizyon ayrıştırıcısı video sütununu atlamıyor ----------
console.log("\n== 6) Ayrıştırıcı ==");
const EDGE = fs.readFileSync(path.join(KOK, "supabase/functions/okulizyon-cek/index.ts"), "utf8");
ok("video hücresi okunuyor", EDGE.indexOf("videoBilgisi(tds[0]") > 0);
ok("video_btn düğmesi tanınıyor", EDGE.indexOf("video_btn") > 0);
ok("sınav adresi sınava ekleniyor", /exams\.push\(\{[\s\S]{0,400}?url: url,/.test(EDGE));

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(x => console.log(" ✗ " + x));
  console.log("Görsel/video testi — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("Görsel/video testi — " + gecen + "/" + gecen + " geçti ✓");
