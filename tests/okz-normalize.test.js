// Okulizyon ders adı normalizasyonu testleri.
// Kaynak: yayınlanan site/okz-normalize.js (kopya değil).
// Gerçek veri: 28.10.2026 çekimi (10.SINIF MAARİF İZLEME SINAVI 1).
const fs = require("node:fs");
const path = require("node:path");

const KOK = path.resolve(__dirname, "..");
const H = require(path.join(KOK, "site", "okz-normalize.js"));

let gecen = 0, kalan = [];
const ok = (ad, kosul, ek) => { if (kosul) gecen++; else kalan.push(ad + (ek ? " → " + ek : "")); };

// Uygulamanın 10. sınıf ders listesi (index.html GRADE_10_EXAM_CONFIG)
const BILINEN = ["Türk Dili ve Edebiyatı", "Tarih", "Coğrafya", "Felsefe", "Din Kültürü", "Matematik", "Fizik", "Kimya", "Biyoloji"];

// ---- 1) Gruplama ----
ok("grup: Matematik-1 → matematik", H.grup("Matematik-1") === "matematik", H.grup("Matematik-1"));
ok("grup: Matematik 2 → matematik", H.grup("Matematik 2") === "matematik", H.grup("Matematik 2"));
ok("grup: Tarih-1 → tarih", H.grup("Tarih-1") === "tarih", H.grup("Tarih-1"));
ok("grup: Coğrafya-1 → cografya", H.grup("Coğrafya-1") === "cografya", H.grup("Coğrafya-1"));
ok("grup: Türkçe → tde", H.grup("Türkçe") === "tde", H.grup("Türkçe"));
ok("grup: Din Kül. ve Ahl. Bil. → din", H.grup("Din Kül. ve Ahl. Bil.") === "din", H.grup("Din Kül. ve Ahl. Bil."));
ok("grup: Din Kültürü ve Ahlak Bilgisi → din", H.grup("Din Kültürü ve Ahlak Bilgisi") === "din");
ok("grup: Felsefe → felsefe", H.grup("Felsefe") === "felsefe");
ok("grup: Boş → null", H.grup("") === null);
ok("grup: bilinmeyen ders → null", H.grup("Görsel Sanatlar") === null);

// ---- 2) Kanonik ad ----
ok("kanonik: Matematik-1 → Matematik", H.kanonik("Matematik-1", BILINEN) === "Matematik", H.kanonik("Matematik-1", BILINEN));
ok("kanonik: Türkçe → Türk Dili ve Edebiyatı", H.kanonik("Türkçe", BILINEN) === "Türk Dili ve Edebiyatı");
ok("kanonik: Tarih-1 → Tarih", H.kanonik("Tarih-1", BILINEN) === "Tarih");
ok("kanonik: Din Kül. ve Ahl. Bil. → Din Kültürü", H.kanonik("Din Kül. ve Ahl. Bil.", BILINEN) === "Din Kültürü");
ok("kanonik: bilinmeyen ders korunur", H.kanonik("Görsel Sanatlar", BILINEN) === "Görsel Sanatlar");
ok("kanonik: liste yoksa varsayılan ad", H.kanonik("Matematik-1") === "Matematik");

// ---- 3) Birleştirme (gerçek 28.10 verisi) ----
const okulizyon = {
  "Biyoloji": { d: 9, w: 1, e: 0 },
  "Coğrafya-1": { d: 9, w: 1, e: 0 },
  "Din Kül. ve Ahl. Bil.": { d: 5, w: 0, e: 0 },
  "Felsefe": { d: 4, w: 1, e: 0 },
  "Fizik": { d: 9, w: 1, e: 0 },
  "Kimya": { d: 9, w: 0, e: 1 },
  "Matematik-1": { d: 13, w: 3, e: 14 },
  "Tarih-1": { d: 6, w: 2, e: 2 },
  "Türkçe": { d: 27, w: 3, e: 0 }
};
const birlesik = H.birlestir(okulizyon, BILINEN);
ok("birleştirme: 9 ders → 9 ders", Object.keys(birlesik).length === 9, Object.keys(birlesik).join(","));
ok("birleştirme: tüm anahtarlar uygulamanın bildiği adlar", Object.keys(birlesik).every((k) => BILINEN.includes(k)), Object.keys(birlesik).join(","));
ok("birleştirme: Türkçe → Türk Dili ve Edebiyatı 27/3/0", (() => { const v = birlesik["Türk Dili ve Edebiyatı"]; return v && v.d === 27 && v.w === 3 && v.e === 0; })(), JSON.stringify(birlesik["Türk Dili ve Edebiyatı"]));
ok("birleştirme: Matematik-1 → Matematik 13/3/14", (() => { const v = birlesik["Matematik"]; return v && v.d === 13 && v.w === 3 && v.e === 14; })(), JSON.stringify(birlesik["Matematik"]));
ok("birleştirme: Din → Din Kültürü 5/0/0", (() => { const v = birlesik["Din Kültürü"]; return v && v.d === 5; })());

const top = H.toplam(birlesik);
ok("toplam: 91 doğru", top.d === 91, top.d);
ok("toplam: 12 yanlış", top.w === 12, top.w);
ok("toplam: 17 boş", top.e === 17, top.e);
ok("toplam: 120 soru", top.soru === 120, top.soru);
ok("toplam: net 88 (91 − 12/4)", top.net === 88, top.net);

// ---- 4) Aynı dersin iki testi toplanır ----
const iki = H.birlestir({ "Tarih-1": { d: 5, w: 1, e: 0 }, "Tarih-2": { d: 4, w: 0, e: 2 } }, BILINEN);
ok("aynı ders iki test: Tarih 9/1/2", iki["Tarih"].d === 9 && iki["Tarih"].w === 1 && iki["Tarih"].e === 2, JSON.stringify(iki["Tarih"]));
ok("aynı ders iki test: tek anahtar", Object.keys(iki).length === 1);

// ---- 5) Net formülü ----
ok("net: 10D 4Y → 9", H.net(10, 4) === 9, H.net(10, 4));
ok("net: 0/0 → 0", H.net(0, 0) === 0);
ok("net: 91D 12Y → 88", H.net(91, 12) === 88);

// ---- 5b) Eski hatalı kayıtların onarımı (duzelt) ----
const eskiKayit = [{
  id: "x1", name: "Okulizyon: 10.SINIF MAARİF İZLEME SINAVI 1", date: "2026-10-27",
  lessons: okulizyon, total: 120, net: 97.25,
  errorLogs: [{ qno: "7", lesson: "Matematik-1", topic: "Türev", type: "KONUEKSİKLİĞİ" }]
}, { id: "x2", name: "Kendi denemem", date: "2026-10-20", lessons: { "Matematik": { d: 10, w: 2, e: 0 } }, total: 12, net: 9.5 }];
const r = H.duzelt(eskiKayit, BILINEN);
ok("duzelt: 1 kayıt onarıldı", r.degisti === 1, r.degisti);
ok("duzelt: ders adları düzeldi", Object.keys(r.exams[0].lessons).includes("Matematik") && !Object.keys(r.exams[0].lessons).includes("Matematik-1"));
ok("duzelt: net 88 olarak yenilendi", r.exams[0].net === 88, r.exams[0].net);
ok("duzelt: total 120 kaldı", r.exams[0].total === 120, r.exams[0].total);
ok("duzelt: hata kaydı dersi de düzeldi", r.exams[0].errorLogs[0].lesson === "Matematik", r.exams[0].errorLogs[0].lesson);
ok("duzelt: kendi denemesine dokunmaz", r.exams[1] === eskiKayit[1] && r.exams[1].id === "x2");
ok("duzelt: zaten doğru kayıt tekrar sayılmaz", H.duzelt(r.exams, BILINEN).degisti === 0);
ok("duzelt: boş dizi", H.duzelt([], BILINEN).degisti === 0);
ok("duzelt: null güvenli", H.duzelt(null, BILINEN).degisti === 0);

// ---- 6) Bozuk girdi çökmez ----
ok("boş sözlük", Object.keys(H.birlestir({}, BILINEN)).length === 0);
ok("null sözlük", Object.keys(H.birlestir(null, BILINEN)).length === 0);
ok("eksik alanlar 0 sayılır", H.birlestir({ "Fizik": {} }, BILINEN)["Fizik"].d === 0);

// ---- 7) Dosya yayında mı ----
const html = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
ok("index.html okz-normalize.js yüklüyor", /<script src="okz-normalize\.js"><\/script>/.test(html));
ok("app-pwa.js normalizasyonu kullanıyor", /OKZ\.birlestir|okzNormalize/.test(fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8")));

console.log(`\nOkulizyon ders normalizasyonu testleri — ${gecen}/${gecen + kalan.length} geçti`);
if (kalan.length) {
  console.error("\nBAŞARISIZ:");
  kalan.forEach((k) => console.error(" ✗ " + k));
  process.exit(1);
}
console.log("✓ tümü geçti");
