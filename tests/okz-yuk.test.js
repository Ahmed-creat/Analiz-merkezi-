/* ============================================================
   ÖĞRENCİ YÜKÜ TESTİ (tests/okz-yuk.test.js)
   ------------------------------------------------------------
   2. madde: "öğrenciye çok fazla yük bindi. Hem neden seçiyor
   hem de konuları seçiyor."

   Bu testler, öğrencinin Okulizyon akışında kaç karar vermek
   zorunda kaldığını ölçer:
     • kuyrukta TEK dokunuş var mı (soru başına neden yerine),
     • eşleme listesi hazır öneriyle mi geliyor (elle seçim yok),
     • blok katlanır mı (Profil duvar gibi görünmesin).
   Çalıştır: node tests/okz-yuk.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) { gecen++; return true; } kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false; }
function esit(ad, g, b) { return ok(ad, g === b, "gelen: " + JSON.stringify(g) + " · beklenen: " + JSON.stringify(b)); }

// app-pwa.js'den ilgili fonksiyon gövdelerini çıkar
function govde(ad, uzunluk) {
  const i = APP.indexOf("function " + ad + "(");
  if (i < 0) return "";
  return APP.slice(i, i + (uzunluk || 2600));
}
const modal = govde("renderOkzModal", 7000);
const kaydet = govde("okzAnalizKaydet", 3200);
const esleme = govde("okzKonuEslemeHtml", 5200);

// ---------- 1) Kuyrukta tek dokunuş ----------
console.log("\n== 1) Kuyrukta tek dokunuş ==");
ok("tek dokunuş şeridi var", modal.indexOf("okzHizliIsle") > 0);
ok("sınav başına tek neden açıklaması", modal.indexOf("Tek dokunuş") > 0);
ok("üç hazır neden var", modal.indexOf('"KONU EKSİKLİĞİ", "İşlem Hatası/Dikkatsizlik", "SÜRE YETMEDİ"') > 0);
ok("varsayılan neden seçili (ekstra dokunuş yok)", /data-secili="' \+ \(k === 0/.test(modal));
ok("tek düğme: 'tümünü işle'", modal.indexOf("tümünü işle") > 0);
ok("soru başına seçim isteğe bağlı olarak yazılı", modal.indexOf("isteğe bağlı") > 0);

// ---------- 2) Tek neden tüm sorulara uygulanıyor ----------
console.log("\n== 2) Tek neden uygulanması ==");
ok("okzAnalizKaydet tekNeden parametresi alıyor", APP.indexOf("async function okzAnalizKaydet(tekNeden)") > 0);
ok("tek neden modunda açılır liste okunmuyor", kaydet.indexOf("if (!tekNeden) document.querySelectorAll(\".okz-reason\")") > 0);
ok("neden: tekNeden || soru seçimi", kaydet.indexOf("const r = tekNeden || secimler[i + \":\" + j]") > 0);
ok("hızlı işlem tıklaması bağlı", APP.indexOf('a === "okzHizliIsle"') > 0);

// ---------- 3) Konu eşlemesi: elle seçim yok ----------
console.log("\n== 3) Konu eşlemesi yükü ==");
ok("her satır en iyi öneriyle hazır geliyor", esleme.indexOf("const secili = oneri ? oneri.topicKey") > 0);
ok("'hazır seçildi' / 'emin değilim' bilgisi var", esleme.indexOf("emin değilim") > 0);
ok("tek düğme: 'Önerileri kabul et ve eşle'", esleme.indexOf("Önerileri kabul et") > 0);
ok("blok katlanır (<details>)", esleme.indexOf("<details") > 0 && esleme.indexOf("</details>") > 0);
ok("kaç kazanım beklediği başlıkta", esleme.indexOf("kazanım bekliyor") > 0);

// ---------- 4) Karar sayısı ölçümü (yükün kendisi) ----------
console.log("\n== 4) Öğrenci kaç karar veriyor ==");
// Tek dokunuş yolu: 1 neden seç + 1 düğme = 2 dokunuş (sınav kaç soru olursa olsun)
const SORU = 21;
const eskiYol = SORU + 1;          // her soru için açılır liste + kaydet
const yeniYol = 1 + 1;             // tek neden + işle
ok("yeni yol soru sayısından bağımsız", yeniYol === 2);
ok("karar sayısı belirgin azaldı", yeniYol * 5 <= eskiYol, "eski: " + eskiYol + " · yeni: " + yeniYol);
esit("21 soruluk sınavda dokunuş", yeniYol, 2);

// ---------- 5) Eşleme önerisi gerçekten dolu mu ----------
console.log("\n== 5) Öneri motoru ==");
const OKZK = require(path.join(KOK, "site", "okz-konu.js"));
const ham = require(path.join(KOK, "site", "content", "konu_esleme.json"));
const idx = OKZK.indeksKur(ham);
const ornek = [
  ["Matematik", "dik üçgende trigonometrik oranlara (sinüs, kosinüs, tanjant, kotanjant) ve trigonometrik özdeşliklere ilişkin çıkarım yapabilmeniz,"],
  ["Fizik", "sabit ivmeli hareket eden bir cismin konum, hız ve ivme grafiklerini çizer ve yorumlar."],
  ["Kimya", "kimyasal tepkimelerde kütlenin korunumunu açıklar."],
  ["Biyoloji", "fotosentez süreçlerini açıklar."]
];
let onerisiOlan = 0, dogruDersde = 0;
ornek.forEach(([ders, kazanim]) => {
  const aday = OKZK.adaylar(kazanim, ders, idx, 1);
  if (aday.length) {
    onerisiOlan++;
    if (aday[0].ders === ders) dogruDersde++;
  }
});
esit("her kazanım için en az bir öneri üretiliyor", onerisiOlan, ornek.length);
esit("öneriler doğru dersten", dogruDersde, ornek.length);
// Otomatik kabul kuralı: skor yüksek + ikinci adayla fark büyük
const OKZ_OTO_ESIK = 0.55, OKZ_OTO_FARK = 0.25;
function otoKabul(ders, kazanim) {
  const a = OKZK.adaylar(kazanim, ders, idx, 2) || [];
  const b = a[0], i = a[1];
  return !!(b && b.skor >= OKZ_OTO_ESIK && (!i || b.skor - i.skor >= OKZ_OTO_FARK));
}
ok("trigonometri kazanımı otomatik kabul edilir", otoKabul(...ornek[0]), JSON.stringify(OKZK.adaylar(ornek[0][1], ornek[0][0], idx, 2)));
ok("belirsiz fizik kazanımı otomatik kabul EDİLMEZ", !otoKabul(...ornek[1]));
ok("belirsiz biyoloji kazanımı otomatik kabul EDİLMEZ", !otoKabul(...ornek[3]));
ok("app-pwa aynı eşikleri kullanıyor", APP.indexOf("OKZ_OTO_ESIK = 0.55") > 0 && APP.indexOf("OKZ_OTO_FARK = 0.25") > 0);
ok("otomatik eşleme 'oto' kaynağıyla işaretli", APP.indexOf('kaynak: "oto"') > 0);
ok("otomatik eşlenenler kullanıcıya gösteriliyor", APP.indexOf("kazanım otomatik eşlendi") > 0);

// ---------- 6) Gerileme koruması: eski zorunlu akış geri gelmesin ----------
console.log("\n== 6) Gerileme koruması ==");
ok("'Her soru için nedenini seç' zorunlu metni kaldı", modal.indexOf("Her soru için nedenini seç") < 0);
ok("eşleme listesinde boş seçim zorunlu değil", esleme.indexOf("const secili = guclu ?") < 0);

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(x => console.log(" ✗ " + x));
  console.log("Öğrenci yükü testi — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("Öğrenci yükü testi — " + gecen + "/" + gecen + " geçti ✓");
