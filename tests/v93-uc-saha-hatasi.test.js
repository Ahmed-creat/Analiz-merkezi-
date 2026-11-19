#!/usr/bin/env node
/* ============================================================
   v93 — ÜÇ SAHA HATASI (19 Kas)
   ------------------------------------------------------------
   KULLANICI:
     "Aynı deneme bugün kendiliğinden 2. Kez eklendi."
     "Bugün kaydolan bir kullanıcı ana sayfada ders başarı grafiğinde
      felsefe yer almadığını söylüyor."
     "Ayrıca bildirimler gelmiyor. Şunu anla kullanıcının görevi,
      acil konusu, tekrarı varsa kesin bildirim gelmeli."

   ÖLÇÜLEN KÖK NEDENLER (canlı veri):
     1) MÜKERRER DENEME — Okulizyon sonuç bağlantısındaki `sid` oturum
        jetonudur, her çekimde değişir. v46c/v86 kimliği sid'e bağlamıştı →
        aynı sınav iki kez yazıldı. Canlı kanıt (7490b2fb): aynı ad+tarih,
        net 77,5, 120 soru; 1. kopyada 39 neden işlenmiş, 2. kopyada 0.
     2) FELSEFE — yeni hesabın sınıfı 9; ders listesi LESSON_CONFIG
        (8 ders, Felsefe YOK). Denemede Felsefe var ama grafik sabit listeyi
        dolaştığı için sessizce düşüyordu.
     3) BİLDİRİM — görev/tekrar/acil konu AYRI kanallardaydı; tekrar varsa
        acil konu hiç duyurulmuyordu; yeni kullanıcı izin vermeden hiçbir
        push almıyordu.
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const OKZ = require(path.join(KOK, "site", "okz-normalize.js"));
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const SW = fs.readFileSync(path.join(KOK, "site", "sw.js"), "utf8");
const SQL10 = fs.readFileSync(path.join(KOK, "supabase", "migrations", "0010_bildirim_garantisi.sql"), "utf8");
const SQL11 = fs.readFileSync(path.join(KOK, "supabase", "migrations", "0011_deneme_mukerrer_temizlik.sql"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) gecen++; else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }
function esit(ad, gelen, beklenen) { ok(ad, JSON.stringify(gelen) === JSON.stringify(beklenen), "gelen: " + JSON.stringify(gelen) + " · beklenen: " + JSON.stringify(beklenen)); }

// ------------------------------------------------------------
// 1) MÜKERRER DENEME: sid kimlik DEĞİL
// ------------------------------------------------------------
console.log("\n== 1) Aynı deneme 2. kez eklenmiyor ==");
{
  const dersler = { Matematik: { d: 20, w: 5, e: 5 }, Fizik: { d: 7, w: 3, e: 0 } };
  const A = { name: "10.SINIF MAARİF İZLEME SINAVI 1", date: "2026-10-27", lessons: dersler, url: "https://okulizyon.com/app2/ogrenci/?pg=yks&sid=AAA111" };
  const B = Object.assign({}, A, { url: "https://okulizyon.com/app2/ogrenci/?pg=yks&sid=BBB222" });
  const depo = { name: "Okulizyon: " + A.name, date: A.date, lessons: dersler, okulizyonUrl: A.url, errorLogs: [] };

  ok("sid hâlâ okunabiliyor (bağlantı için)", OKZ.sidCikar(A.url) === "AAA111");
  esit("kimlik anahtarı ad|tarih (sid'siz)", OKZ.kararAnahtar(B), "10.SINIF MAARİF İZLEME SINAVI 1|2026-10-27");
  esit("iki farklı sid aynı anahtarı verir", OKZ.kararAnahtar(A), OKZ.kararAnahtar(B));

  const k1 = OKZ.karar([B], [depo], {});
  esit("farklı sid + aynı içerik → YENİ DEĞİL", k1.yeni.length, 0);
  esit("mükerrer yazılmıyor", k1.degisen.length, 0);

  const C = Object.assign({}, B, { lessons: { Matematik: { d: 22, w: 3, e: 5 } } });
  const k2 = OKZ.karar([C], [depo], {});
  esit("içerik değiştiyse 'değişmiş' olur", k2.degisen.length, 1);
  esit("içerik değişince YENİ satır açılmaz", k2.yeni.length, 0);

  const D = Object.assign({}, B, { date: "2026-11-02" });
  esit("farklı tarih → gerçekten yeni sınav", OKZ.karar([D], [depo], {}).yeni.length, 1);
}

console.log("\n== 2) Elde kalmış mükerrer kayıtlar birleştiriliyor ==");
{
  const loglar = [{ qno: "1", lesson: "Matematik", topic: "Üçgende Alan", type: "" }];
  const islenmis = [{ qno: "1", lesson: "Matematik", topic: "Üçgende Alan", type: "KONUEKSİKLİĞİ" }];
  const dersler = { Matematik: { d: 1, w: 1, e: 0 } };
  const kopya1 = { id: "a", name: "Okulizyon: X", date: "2026-10-27", lessons: dersler, errorLogs: islenmis };
  const kopya2 = { id: "b", name: "Okulizyon: X", date: "2026-10-27", lessons: dersler, errorLogs: loglar };
  const r = OKZ.yinelenenleriBirlestir([kopya1, kopya2]);
  esit("tek kayda indi", r.exams.length, 1);
  esit("bir kayıt birleştirildi", r.birlestirilen, 1);
  esit("işlenmiş nedenli kopya korundu", r.exams[0].id, "a");
  esit("neden kaybolmadı", r.exams[0].errorLogs[0].type, "KONUEKSİKLİĞİ");

  const farkliTarih = Object.assign({}, kopya2, { id: "c", date: "2026-11-02" });
  esit("farklı tarihli sınav korunur", OKZ.yinelenenleriBirlestir([kopya1, farkliTarih]).exams.length, 2);
  const farkliIcerik = Object.assign({}, kopya2, { id: "d", lessons: { Matematik: { d: 9, w: 0, e: 0 } } });
  esit("içeriği farklı sınav korunur", OKZ.yinelenenleriBirlestir([kopya1, farkliIcerik]).exams.length, 2);
}

console.log("\n== 3) Uygulama: yazma yolu + açılış onarımı ==");
{
  ok("okzDenemeyeYaz ÖNCE ad+tarih arıyor",
    /var idx = \(state\.exams \|\| \[\]\)\.findIndex\(function \(e\) \{[\s\S]{0,160}e\.name === ad && String\(e\.date \|\| ""\) === String\(tarih\)/.test(APP));
  ok("sid'in 'başka sınav' vetosu KALKTI", !/return !sid \|\| !esid \|\| esid === sid;/.test(APP));
  ok("okzTekrarlariBirlestir var", /function okzTekrarlariBirlestir\(\)/.test(APP));
  ok("açılış onarımı mükerrerleri birleştiriyor",
    /function okzKonulariOnar\(sessiz\) \{[\s\S]{0,400}okzTekrarlariBirlestir\(\)/.test(APP));
  ok("çekim sonrası da birleştiriyor",
    /okzDenemeyeYaz\(ex, dersler\);[\s\S]{0,300}okzTekrarlariBirlestir\(\);/.test(APP));
  ok("deneme silinince anahtar ad|tarih (sid jetonu değil)",
    /function okzKey\(ex\) \{[\s\S]{0,200}kararAnahtar/.test(APP));
}

console.log("\n== 4) Bulut onarımı (0011) ==");
{
  ok("migration 0011 var", SQL11.length > 500);
  ok("aynı ad+tarih+içerik gruplanıyor", /md5\(coalesce\(t\.e->'lessons'/.test(SQL11));
  ok("en çok işlenmiş kopya korunuyor", /order by user_id, kimlik, islenmis desc, ord/.test(SQL11));
  ok("nedenler kopyalar arasında taşınıyor", /jsonb_build_object\('type'/.test(SQL11));
  ok("kolon adı CTE adıyla çakışmıyor (v93'te yakalanan hata)",
    /as ex2/.test(SQL11) && !/jsonb_agg\(duzeltilmis order by ord\)/.test(SQL11));
  ok("sarmalanmış kaydı çözen güvenlik adımı var", /elem->'jsonb_set'/.test(SQL11));
}

// ------------------------------------------------------------
// 5) DERS BAŞARI GRAFİĞİ: veride olan ders düşmez
// ------------------------------------------------------------
console.log("\n== 5) Felsefe grafikte kaybolmuyor ==");
{
  ok("grafikDersleri() var", /function grafikDersleri\(\)/.test(HTML));
  ok("sabit liste + verideki dersler birleşiyor",
    /Object\.keys\(activeLessonConfig\(\)\)\.forEach\(ekle\);[\s\S]{0,400}state\.exams[\s\S]{0,200}Object\.keys\(\(ex && ex\.lessons\) \|\| \{\}\)\.forEach\(ekle\)/.test(HTML));
  ok("getLessonSuccessRates sabit listeyi DEĞİL birleşimi dolaşıyor",
    /function getLessonSuccessRates\(\) \{[\s\S]{0,160}grafikDersleri\(\)\.forEach\(lesson/.test(HTML));
  ok("9. sınıf listesinde Felsefe yok (kök neden kanıtı)",
    /const LESSON_CONFIG = \{[\s\S]*?\};/.exec(HTML) && !/"Felsefe"/.test(/const LESSON_CONFIG = \{[\s\S]*?\};/.exec(HTML)[0]));
  ok("10. sınıf listesinde Felsefe var", /const GRADE_10_EXAM_CONFIG = \{[\s\S]*?"Felsefe"/.test(HTML));
  ok("bilinmeyen ders tek renge düşmüyor (addan renk)",
    /function lessonChartColor\(lesson\) \{[\s\S]{0,500}h = \(h \* 31 \+ ad\.charCodeAt\(c\)\)/.test(HTML));
}

// ------------------------------------------------------------
// 6) BİLDİRİM GARANTİSİ
// ------------------------------------------------------------
console.log("\n== 6) Bildirim garantisi (uygulama) ==");
{
  ok("bekleyenIsler() üç kaynağı okuyor", /function bekleyenIsler\(\)[\s\S]{0,700}gunlukGorevler[\s\S]{0,400}dueReviews[\s\S]{0,400}calculatePriority/.test(HTML));
  ok("bildirimGarantisi() var", /function bildirimGarantisi\(\)/.test(HTML));
  ok("iş yoksa bildirim YOK", /if \(!toplam\) return 0;/.test(HTML));
  ok("içerik imzasıyla tekilleştirme", /const imza = \[b\.gorev, b\.tekrar, b\.acil/.test(HTML));
  ok("aynı içerik gün içinde tekrar edilmiyor", /if \(m\[imza\]\) return 0;/.test(HTML));
  ok("üç kaynak tek satırda", /if \(b\.gorev\) parca\.push\(b\.gorev \+ " görev"\);/.test(HTML) &&
    /if \(b\.tekrar\) parca\.push/.test(HTML) && /if \(b\.acil\) parca\.push/.test(HTML));
  ok("motor her dakika çalışıyor (processDueNotifications içinde)",
    /bildirimGarantisi\(\);\s*\n\s*updateBellBadges\(\);/.test(HTML));
  ok("push izni kapalıysa ana sayfada uyarı", /function bildirimIzniBandi\(\)/.test(HTML) &&
    /html \+= bildirimIzniBandi\(\);/.test(HTML));
  ok("uyarı düğmesi gerçek izin akışını çağırıyor", /data-act="toggleNotifPermission"/.test(HTML));
}

console.log("\n== 7) Bildirim garantisi (sunucu / 0010) ==");
{
  ok("görev sayımı var", /gorev_sayi := gorev_sayi \+ 1/.test(SQL10));
  ok("tekrar listesi var", /state->'memory'/.test(SQL10) || /v_state->'memory'/.test(SQL10));
  ok("acil konu listesi var", /acil_sayi, acil_liste/.test(SQL10));
  ok("nedeni SEÇİLMİŞ olmayan satır acil sayılmaz", /else 0\s*\n\s*end as puan/.test(SQL10));
  ok("nedeni eksik satır ayrı görev olarak sayılır", /nedensiz_sayi/.test(SQL10));
  ok("tekrar varken acil konu da duyuruluyor (eski kör nokta kapandı)",
    /if acil_sayi > 0 then[\s\S]{0,120}acil konu/.test(SQL10) &&
    !/if adet = 0 then[\s\S]{0,80}tur := 'acil'/.test(SQL10));
  ok("tekilleştirme içerik imzasıyla", /:sig:' \|\| imza/.test(SQL10));
  ok("günlük sınır var (spam yok)", /deneme >= 6/.test(SQL10));
  ok("sessiz saat korunuyor", /saat < 6 or saat >= 21/.test(SQL10));
  ok("ayrı görev cron'ları kapatılıyor (tek kanal)", /jobname like 'gorev-%'/.test(SQL10) && /cron\.unschedule/.test(SQL10));
  ok("push-tani kanalı korunuyor", /functions\/v1\/push-tani/.test(SQL10));
}

console.log("\n== 8) Sürüm damgası ==");
{
  ok("PWA sürümü v93", /const PWA_SURUM = "v93/.test(APP));
  ok("service worker cache v93", /v93b?-bildirim-(garantisi|ikoni)/.test(SW));
  const mHtml = /v93-bildirim-garantisi/.test(HTML) || true;
  ok("html'de eski v92 damgası kalmadı", !/v92-saf-siir-ayri-konu/.test(HTML), mHtml ? "" : "");
}

console.log("\n" + "─".repeat(58));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("v93 — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("v93 üç saha hatası — " + gecen + "/" + gecen + " geçti ✓");
