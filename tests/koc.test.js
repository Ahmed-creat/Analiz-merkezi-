#!/usr/bin/env node
/* ============================================================
   v102 — KOÇLUK MOTORU TESTLERİ (tests/koc.test.js)
   ------------------------------------------------------------
   KULLANICI (tur 70): "Koçluk hattını çok daha iyi programla."
   Dört zorunlu eksen ve bu dosyadaki karşılığı:

   1) VERİ DOĞRULAMA — sınav tarihi, hedef net ve deneme sonuçları
      GERÇEK uygulama kayıtlarından okunur (plan.targetDate,
      plan.targetNet, exams[].net / lessons[].d-w, errorLogs).
   2) ANALİZ — net değişimi, hata nedenleri ve konu öncelikleri
      YORUMLANIR (salt veri gösterimi değil).
   3) ÖNERİ — gerekçeli, öğrencinin kendi verisine dayalı.
   4) HATA YÖNETİMİ — veri yoksa SAYI UYDURULMAZ (null döner),
      eksik veri ADIYLA söylenir.
   Ayrıca: panel (index.html/coachMessages) ile sohbet (mesaj.js)
   AYNI motoru kullanır → aynı sayıyı söyler.

   Motor saf: state parametre alır, DOM/localStorage/ağ yok.
   node tests/koc.test.js   (npm run test:koc)
   ============================================================ */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const KOK = path.resolve(__dirname, "..");
const K = require(path.join(KOK, "site", "koc.js"));
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const MESAJ = fs.readFileSync(path.join(KOK, "site", "mesaj.js"), "utf8");

let gecen = 0;
const kalan = [];
const ok = (ad, kosul, ek) => { if (kosul) gecen++; else kalan.push(ad + (ek ? " → " + ek : "")); };

// ------------------------------------------------------------
// Ortak örnek: iki deneme, ders kırılımı, hata nedenleri
// ------------------------------------------------------------
function ornek() {
  return {
    user: { name: "Efe", grade: "10" },
    settings: {},
    plan: {
      targetDate: "2026-12-20", targetNet: 95,
      schoolExams: [{ id: "s1", lesson: "Fizik", date: "2026-11-27", topics: ["Fizik > Kuvvet"] }],
      hazirlikPlani: [{ date: "2026-11-21", ders: "Matematik", kaynak: "deneme" }]
    },
    exams: [
      {
        id: "1", name: "Deneme-1", date: "2026-10-27", net: 77.5,
        lessons: { "Matematik": { d: 10, w: 4, e: 2 }, "Türkçe": { d: 20, w: 5, e: 0 } },
        errorLogs: [
          { lesson: "Matematik", topic: "Üçgende Alan", type: "Konuyu Bilmiyordum", date: "2026-10-27" },
          { lesson: "Matematik", topic: "Üçgende Alan", type: "Konuyu Bilmiyordum", date: "2026-10-27" },
          { lesson: "Türkçe", topic: "Şiirde Ahenk", type: "İşlem Hatası/Dikkatsizlik", date: "2026-10-27" }
        ]
      },
      {
        id: "2", name: "Deneme-2", date: "2026-11-15", net: 81.5,
        lessons: { "Matematik": { d: 12, w: 3, e: 1 }, "Türkçe": { d: 22, w: 6, e: 0 } },
        errorLogs: [
          { lesson: "Matematik", topic: "Üçgende Alan", type: "İşlem Hatası/Dikkatsizlik", date: "2026-11-15" }
        ]
      }
    ],
    questions: [],
    memory: {}
  };
}
const BUGUN = "2026-11-20";
const SNAP = K.snapshot(ornek(), BUGUN);

// ------------------------------------------------------------
console.log("\n== 1) Yardımcılar: tarih, sayı biçimi, Türkçe küçük harf ==");
{
  // gunFarki(a, b) = a − b (gün). Uygulamada hafıza/tekrar hesapları bu işareti kullanır.
  ok("gunFarki takvim günü sayar (UTC, saat kayması yok)", K.gunFarki("2026-11-15", "2026-10-27") === 19, K.gunFarki("2026-11-15", "2026-10-27"));
  ok("fmtTR 2026-12-20 → 20.12.2026", K.fmtTR("2026-12-20") === "20.12.2026", K.fmtTR("2026-12-20"));
  ok("tr ondalık virgülle", K.tr(81.5) === "81,5" && K.tr(3.15) === "3,15", K.tr(3.15));
  ok("kucuk('İŞLEM') noktalı i üretmez", K.kucuk("İŞLEM") === "işlem", K.kucuk("İŞLEM"));
  ok("iyelik: 1'i / 2'si / 4'ü", K.iyelik(1) === "i" && K.iyelik(2) === "si" && K.iyelik(4) === "ü",
    [K.iyelik(1), K.iyelik(2), K.iyelik(4)].join(","));
  ok("dersKonu 'Ders > Konu' ayırır", JSON.stringify(K.dersKonu("Matematik > Üçgende Alan")) === JSON.stringify({ ders: "Matematik", konu: "Üçgende Alan" }));
}

// ------------------------------------------------------------
console.log("== 2) VERİ DOĞRULAMA: net kayıttan / D-Y'den / yoksa null ==");
{
  const kayit = K.netCoz({ id: "a", name: "A", date: "2026-11-01", net: 77.5, lessons: { "Matematik": { d: 10, w: 4 } } });
  ok("kayıtta net varsa KAYIT kullanılır", kayit.net === 77.5 && kayit.kaynak === "kayit", JSON.stringify(kayit));

  const hesap = K.netCoz({ id: "b", name: "B", date: "2026-11-01", lessons: { "Matematik": { d: 10, w: 4, e: 0 }, "Türkçe": { d: 20, w: 0, e: 0 } } });
  ok("net yoksa D/Y'den hesaplanır (10+20 − 4/4 = 29)", hesap.net === 29 && hesap.kaynak === "hesap", JSON.stringify(hesap));

  const yok = K.netCoz({ id: "c", name: "C", date: "2026-11-01", lessons: {} });
  ok("ne net ne D/Y varsa NULL döner (0 DEĞİL)", yok.net === null && yok.kaynak === null, JSON.stringify(yok));
  ok("netsiz deneme 'atlanan' listesine girer (adıyla)", (function () {
    const s = K.snapshot({ plan: {}, exams: [{ id: "c", name: "Boş Deneme", date: "2026-11-01", lessons: {} }] }, BUGUN);
    const n = K.netAnalizi(s);
    return n.sayi === 0 && n.atlanan.length === 1 && n.atlanan[0].name === "Boş Deneme";
  })());

  // snapshot GERÇEK alan adlarından okur
  ok("snapshot plan.targetDate okur", SNAP.plan.targetDate === "2026-12-20", SNAP.plan.targetDate);
  ok("snapshot plan.targetNet okur", SNAP.plan.targetNet === 95, SNAP.plan.targetNet);
  ok("snapshot deneme adı/tarihi/neti okur", SNAP.exams[1].name === "Deneme-2" && SNAP.exams[1].net === 81.5 && SNAP.exams[1].date === "2026-11-15");
  ok("snapshot DERS kırılımını bozmadan taşır", SNAP.exams[0].lessons["Matematik"].d === 10);
  ok("snapshot errorLogs'u hata günlüğüne çevirir", SNAP.hatalar.length === 4, String(SNAP.hatalar.length));
  ok("hata günlüğü neden + tarih taşır", SNAP.hatalar[0].type === "Konuyu Bilmiyordum" && SNAP.hatalar[0].date === "2026-10-27");
  ok("okul sınavları tarihiyle taşınır", SNAP.plan.schoolExams.length === 1 && SNAP.plan.schoolExams[0].date === "2026-11-27");
  ok("hazırlık planı taşınır", SNAP.hazirlik.length === 1 && SNAP.hazirlik[0].date === "2026-11-21");
  ok("ad/sınıf gerçek kullanıcıdan", SNAP.ad === "Efe" && SNAP.sinif === "10");
}

// ------------------------------------------------------------
console.log("== 3) ANALİZ: net değişimi YORUMLANIR ==");
{
  const n = K.netAnalizi(SNAP);
  ok("iki deneme karşılaştırılır (son/önceki)", n.son.name === "Deneme-2" && n.onceki.name === "Deneme-1");
  ok("fark +4 net", n.fark === 4, String(n.fark));
  ok("fark gün sayısı 19", n.farkGun === 19, String(n.farkGun));
  ok("haftalık tempo ölçülür (+1,47)", n.haftalik === 1.47, String(n.haftalik));
  ok("ders değişimi hesaplanır (Matematik +2,25)", (function () {
    const m = n.dersler.yukselen.find((x) => x.ders === "Matematik");
    return !!m && m.fark === 2.25;
  })(), JSON.stringify(n.dersler.yukselen));
  ok("en zayıf ders oranla bulunur (Matematik %70)", n.enZayifDers && n.enZayifDers.ders === "Matematik" && n.enZayifDers.oran === 70, JSON.stringify(n.enZayifDers));
  ok("yorum metni önceki neti + farkı yazar", /77,5/.test(n.yorum.join(" ")) && /göre \+4 net/.test(n.yorum.join(" ")), n.yorum.join(" | "));
  ok("yorum metni haftalık tempoyu yazar", /haftada \+1,47 net/.test(n.yorum.join(" ")), n.yorum.join(" | "));
  ok("yorum metni en zayıf dersi yorumlar", /en zayıf ders/i.test(n.yorum.join(" ")), n.yorum.join(" | "));
}

// ------------------------------------------------------------
console.log("== 4) ANALİZ: hedef + ivme (uydurma yok) ==");
{
  const h = K.hedefAnalizi(SNAP);
  ok("kalan gün 30", h.kalanGun === 30, String(h.kalanGun));
  ok("gereken net 13,5", h.gerekenNet === 13.5, String(h.gerekenNet));
  ok("hafta YUKARI yuvarlanmaz (4,3)", h.kalanHafta === 4.3, String(h.kalanHafta));
  ok("gereken ivme 3,15 net/hafta", h.gerekenIvme === 3.15, String(h.gerekenIvme));
  ok("ölçülen ivme 1,47 net/hafta", h.olculenIvme === 1.47, String(h.olculenIvme));
  ok("durum 'geride' + gerekçe metni", h.durum === "geride" && /Tempo gerekenin altında/.test(h.yorum.join(" ")), h.durum);

  const bos = K.hedefAnalizi(K.snapshot({ plan: {}, exams: [] }, BUGUN));
  ok("VERİ YOK: tarih null", bos.tarih === null);
  ok("VERİ YOK: gereken ivme null (0 DEĞİL)", bos.gerekenIvme === null && bos.gerekenNet === null, JSON.stringify(bos.gerekenIvme));
  ok("VERİ YOK: durum 'tarih-yok'", bos.durum === "tarih-yok", bos.durum);
  ok("VERİ YOK: yorum 'sayı uydurulmaz' der", /sayı uydurulmaz/.test(bos.yorum.join(" ")), bos.yorum.join(" | "));

  const tekN = K.hedefAnalizi(K.snapshot({ plan: { targetDate: "2026-12-20", targetNet: 95 }, exams: [] }, BUGUN));
  ok("deneme yokken son net null", tekN.sonNet === null);
  ok("deneme yokken durum 'deneme-yok'", tekN.durum === "deneme-yok", tekN.durum);

  const tek = K.hedefAnalizi(K.snapshot({ plan: { targetDate: "2026-12-20", targetNet: 95 }, exams: [ornek().exams[0]] }, BUGUN));
  ok("tek denemede ölçülen ivme null (uydurulmaz)", tek.olculenIvme === null, String(tek.olculenIvme));
  // Tek deneme = 77,5 net → gereken (95−77,5)/4,3 = 4,08
  ok("tek denemede gereken ivme hesaplanır (4,08)", tek.gerekenIvme === 4.08, String(tek.gerekenIvme));
}

// ------------------------------------------------------------
console.log("== 5) ANALİZ: hata nedenleri + baskın neden yorumu ==");
{
  const h = K.hataAnalizi(SNAP);
  ok("toplam 4 hata", h.toplam === 4, String(h.toplam));
  ok("neden dağılımı: konu 2 · işlem 2", h.nedenler[0].adet === 2 && h.nedenler.length === 2, JSON.stringify(h.nedenler.map((x) => x.ad + ":" + x.adet)));
  ok("yüzdeler 50/50", h.nedenler.every((x) => x.yuzde === 50), JSON.stringify(h.nedenler.map((x) => x.yuzde)));
  ok("ders dağılımı Matematik 3 · Türkçe 1", h.dersler[0].ders === "Matematik" && h.dersler[0].adet === 3 && h.dersler[1].adet === 1, JSON.stringify(h.dersler));
  // Dağılım KIRPILMAZ: 4'ten çok neden varsa kalanı sayıyla söylenir
  const cok = K.snapshot({
    plan: {}, exams: [{ id: "m", name: "M", date: BUGUN, net: 60, errorLogs: [
      { lesson: "Matematik", topic: "A", type: "Konuyu Bilmiyordum", date: BUGUN },
      { lesson: "Matematik", topic: "B", type: "KONUEKSİKLİĞİ", date: BUGUN },
      { lesson: "Matematik", topic: "C", type: "ANLAMADIM", date: BUGUN },
      { lesson: "Matematik", topic: "D", type: "İşlem Hatası/Dikkatsizlik", date: BUGUN },
      { lesson: "Matematik", topic: "E", type: "ÇÖZÜMYOLUNUBULAMADIM", date: BUGUN },
      { lesson: "Matematik", topic: "F", type: "SUREYETMEDI", date: BUGUN }
    ] }]
  }, BUGUN);
  ok("6 nedenin 4'ü yazılır, kalan '2 neden daha' diye sayılır",
    /\+2 neden daha/.test(K.kartlar(cok, { adet: 6 }).join(" ")), K.kartlar(cok, { adet: 6 })[2]);

  // Yalnız nedensiz hatalar: dağılım yok ama durum ADIYLA söylenir
  const nedensizSnap = K.snapshot({
    plan: { targetDate: "2026-12-20", targetNet: 95 },
    exams: [{ id: "n", name: "Okulizyon", date: "2026-11-10", net: 80, errorLogs: [
      { lesson: "Matematik", topic: "Üçgende Alan", qno: "7" },
      { lesson: "Matematik", topic: "Üçgende Alan", qno: "9" }
    ] }], memory: {}
  }, BUGUN, { okulizyon: { bekleyen: 2 } });
  const nk = K.kartlar(nedensizSnap, { adet: 6 }).join(" ");
  ok("nedensiz hatalar sayısıyla söylenir (2 hatanın 2'sinde)", /2 hatanın 2(?:&#39;|')sinde de neden seçilmemiş/.test(nk), nk);
  ok("neden yoksa konu önceliği hesaplanmaz denir (0 uydurulmaz)", /nedenini seçmeden konu önceliği hesaplanmaz/.test(nk), nk);
  ok("Okulizyon bekleyen soru için 'neden seç' önerisi gelir",
    /Okulizyon sorusuna neden seç/.test(K.oneriler(nedensizSnap).map((o) => o.baslik).join(" ")),
    K.oneriler(nedensizSnap).map((o) => o.baslik).join(" | "));

  ok("baskın neden yorumu: bilgi eksiği / işlem ayrımı yapılır",
    /Baskın neden (bilgi eksiği|işlem\/dikkat)/.test(h.yorum.join(" ")), h.yorum.join(" | "));

  const islem = K.snapshot({
    plan: {}, exams: [{ id: "x", name: "X", date: BUGUN, net: 50, errorLogs: [
      { lesson: "Matematik", topic: "Türev", type: "İşlem Hatası/Dikkatsizlik", date: BUGUN },
      { lesson: "Matematik", topic: "Türev", type: "İşlem Hatası/Dikkatsizlik", date: BUGUN },
      { lesson: "Matematik", topic: "Türev", type: "İşlem Hatası/Dikkatsizlik", date: BUGUN }
    ] }]
  }, BUGUN);
  const hi = K.hataAnalizi(islem);
  ok("baskın neden işlem → 'bilgin var, uygulamada kaybediyorsun'",
    /bilgin var, uygulamada kaybediyorsun/.test(hi.yorum.join(" ")), hi.yorum.join(" | "));
  ok("baskın nedenin AKSiYONU taşınır (NEDEN_TABLO)",
    hi.nedenler[0].aksiyon.length > 10 && /işlem kontrolü/.test(hi.nedenler[0].aksiyon), hi.nedenler[0].aksiyon);
}

// ------------------------------------------------------------
console.log("== 6) ANALİZ: konu önceliği formülü ve 'öğrenildi' kuralı ==");
{
  const o = K.oncelikler(SNAP, 5, { ayt: (ders) => (ders === "Matematik" ? 0.3 : 0) }).tumu;
  const mat = o.find((x) => x.key === "Matematik > Üçgende Alan");
  // 3 hata: 2 deneme konu-bilmiyordum (2×1,5=3) + 1 deneme işlem (0,5) = 3,5 × (1+0,30) = 4,55
  ok("formül 1,5·konu + 1,0·test + 0,5·(işlem+anlamadım) × (1+AYT)",
    mat && mat.puan === 4.55, mat && mat.puan);
  const tr = o.find((x) => x.key === "Türkçe > Şiirde Ahenk");
  ok("AYT ağırlığı 0 olan ders 0,5 puanla kalır", tr && tr.puan === 0.5, tr && tr.puan);
  ok("sıralama puana göre (Matematik önce)", o[0].key === "Matematik > Üçgende Alan", o.map((x) => x.key).join(" | "));
  ok("gerekçe metni hata sayısını + nedeni + son tarihi taşır",
    /3 hatanın 2'si konuyu bilmiyordum/.test(mat.gerekce) && /son hata 15\.11\.2026/.test(mat.gerekce), mat.gerekce);

  const testSnap = K.snapshot({
    plan: {},
    exams: [],
    questions: [{ id: "q", name: "Soru Bankası", date: BUGUN, errorLogs: [
      { lesson: "Matematik", topic: "Türev", type: "KONUEKSİKLİĞİ", date: BUGUN }
    ] }]
  }, BUGUN);
  const to = K.oncelikler(testSnap, 5, { ayt: () => 0 }).tumu;
  ok("test kaynaklı konu eksiği 1,0 katsayısıyla", to.length === 1 && to[0].puan === 1, JSON.stringify(to.map((x) => x.puan)));
  ok("kaynak ayrımı korunur (deneme/test)", to[0].test === 1 && to[0].deneme === 0, JSON.stringify(to[0]));

  // topicLearnedAfter: konu 01.11'de öğrenildi → öncesindeki hatalar düşer
  const ogr = ornek();
  ogr.memory = { "Matematik > Üçgende Alan": { completedAt: "2026-11-01T10:00:00Z", lastReview: "2026-11-01T10:00:00Z", reviewCount: 1, schedule: {} } };
  const os = K.snapshot(ogr, BUGUN);
  const oo = K.oncelikler(os, 5, { ayt: () => 0 }).tumu;
  const mat2 = oo.find((x) => x.key === "Matematik > Üçgende Alan");
  ok("öğrenildi tarihinden SONRAKİ hata sayılır (2 değil 1)", mat2 && mat2.adet === 1, mat2 && mat2.adet);
  ok("düşen hatalar arşivde sayılır (2)", os.hatalar.length === 4 && K.hataAyir(os).arsiv.length === 2, String(K.hataAyir(os).arsiv.length));
  ok("arşiv sayısı yorumda açıkça söylenir", /konu öğrenildi olarak işaretlendiği için listeden düştü/.test(K.hataAnalizi(os).yorum.join(" ")),
    K.hataAnalizi(os).yorum.join(" | "));
}

// ------------------------------------------------------------
console.log("== 7) HATA YÖNETİMİ: eksik veri adıyla raporlanır ==");
{
  const bos = K.snapshot({ plan: {}, exams: [], questions: [], memory: {} }, BUGUN);
  const eksik = K.eksikler(bos);
  const alanlar = eksik.map((x) => x.alan);
  ok("sınav tarihi eksik olarak listelenir", alanlar.includes("Sınav tarihi"), alanlar.join(","));
  ok("hedef net eksik olarak listelenir", alanlar.includes("Hedef net"), alanlar.join(","));
  ok("deneme sonucu eksik olarak listelenir", alanlar.includes("Deneme sonucu"), alanlar.join(","));
  ok("hata kaydı eksik olarak listelenir", alanlar.includes("Hata kaydı"), alanlar.join(","));
  ok("her eksik kaydın NEREDEN girileceği yazılı", eksik.every((x) => x.nerede && x.nerede.length > 2), JSON.stringify(eksik.map((x) => x.nerede)));
  ok("her eksik kaydın ETKİSİ yazılı", eksik.every((x) => x.etki && x.etki.length > 10), eksik[0] && eksik[0].etki);
  ok("durum 'eksik' işaretli", eksik.every((x) => x.durum === "eksik" || x.durum === "kısmi"), eksik.map((x) => x.durum).join(","));

  const tam = K.eksikler(SNAP);
  ok("tam veride 'eksik' kalmaz", tam.length === 0, JSON.stringify(tam.map((x) => x.alan)));

  const yarim = K.snapshot({ plan: { targetDate: "2026-12-20" }, exams: [{ id: "z", name: "Z", date: "2026-11-01", lessons: {} }] }, BUGUN);
  const y = K.eksikler(yarim);
  ok("hedef net eksik → 'kısmi/eksik' + adı", y.some((x) => x.alan === "Hedef net"), JSON.stringify(y.map((x) => x.alan)));
  ok("netsiz denemenin ADI eksik raporda geçer", y.some((x) => /Z/.test(x.mesaj)), JSON.stringify(y.map((x) => x.mesaj)));

  // Rapor ve kartlar bu eksikleri gösterir
  const r = K.rapor(bos);
  ok("rapor 'Eksik veri' bölümü var", r.bolumler.some((b) => b.baslik === "Eksik veri"));
  const kart = K.kartlar(bos, { adet: 6 }).join(" ");
  ok("kartta eksik veri adıyla yazılı", /Eksik veri/.test(kart) && /Sınav tarihi/.test(kart), kart.slice(0, 200));
  ok("boş veride kart net/ivme sayısı ÜRETMEZ", !/son net/i.test(kart) && !/haftada [+-]?\d/.test(kart), kart.slice(0, 200));
}

// ------------------------------------------------------------
console.log("== 8) ÖNERİ: gerekçeli ve veriye dayalı ==");
{
  const on = K.oneriler(SNAP);
  ok("öneri üretilir", on.length > 0, String(on.length));
  ok("her öneri gerekçe + aksiyon taşır", on.every((o) => o.gerekce && o.gerekce.length > 15 && o.aksiyon && o.aksiyon.length > 8),
    JSON.stringify(on[0]));
  ok("öneri öncelik sırasına göre dizilir", on.every((o, i) => i === 0 || on[i - 1].oncelik <= o.oncelik), on.map((o) => o.oncelik).join(","));
  ok("en zayıf konu önerisi verideki hata sayısını anar", /Üçgende Alan/.test(on[0].baslik + " " + on[0].gerekce), on[0].baslik);
  ok("ivme geride → tempo önerisi gerekçeli", K.oneriler(SNAP).some((o) => /temp/i.test(o.baslik) && /haftada 3,15 net gerekiyor/.test(o.gerekce)),
    JSON.stringify(K.oneriler(SNAP).map((o) => o.baslik)));
  ok("veri yokken öneri 'önce veri gir' der, sayı uydurmaz",
    /Önce deneme sonucu gir/.test(K.oneriler(K.snapshot({ plan: {}, exams: [] }, BUGUN)).map((o) => o.baslik).join(" ")));
}

// ------------------------------------------------------------
console.log("== 9) HATA NEDENİ SÖZLÜĞÜ index.html ile AYNI ==");
{
  const dizi = (ad) => {
    const m = HTML.match(new RegExp("const " + ad + " = \\[([^\\]]*)\\]"));
    return m ? m[1].split(",").map((x) => x.trim().replace(/^"|"$/g, "")).filter(Boolean) : null;
  };
  const yanlis = dizi("WRONG_REASONS");
  const bos = dizi("EMPTY_REASONS");
  ok("index.html'den WRONG_REASONS okundu", Array.isArray(yanlis) && yanlis.length === 4, String(yanlis));
  ok("index.html'den EMPTY_REASONS okundu", Array.isArray(bos) && bos.length === 3, String(bos));

  const motorAnahtarlari = Object.keys(K.NEDEN_TABLO);
  // index.html "SÜREYETMEDİ" yazar, canonicalReason onu "SUREYETMEDI"ye çevirir;
  // karşılaştırma KANONİK biçim üzerinden yapılır (sözlük kaymasın).
  const kanon = (x) => (x === "SÜREYETMEDİ" || x === "SÜRE YETMEDİ" ? "SUREYETMEDI" : x);
  const beklenen = (yanlis || []).concat(bos || []).map(kanon);
  ok("NEDEN_TABLO 7 nedeni birebir kapsıyor", motorAnahtarlari.length === 7 &&
    beklenen.every((x) => motorAnahtarlari.includes(x)) &&
    motorAnahtarlari.every((x) => beklenen.includes(x)),
    "motor: " + motorAnahtarlari.join(" | ") + " · index: " + beklenen.join(" | "));
  ok("her index nedeni motorda KOD bulur", beklenen.every((x) => K.nedenBilgi(x)), beklenen.join(","));

  ok("her nedenin adı/grup/yorum/aksiyonu var", motorAnahtarlari.every((k) => {
    const n = K.NEDEN_TABLO[k];
    return n.ad && n.grup && n.yorum && n.aksiyon && n.kod;
  }));

  // canonicalReason eşlemesi: her kanonik değer motorda karşılık bulur
  const kanonik = HTML.match(/function canonicalReason[\s\S]{0,600}?\}\s*\n/);
  ok("canonicalReason bulundu", !!kanonik);
  const ciftler = [["KONU EKSİKLİĞİ", "KONUEKSİKLİĞİ"], ["ÇÖZÜM YOLUNU BULAMADIM", "ÇÖZÜMYOLUNUBULAMADIM"],
    ["SÜRE YETMEDİ", "SUREYETMEDI"], ["SÜREYETMEDİ", "SUREYETMEDI"]];
  ok("canonicalReason eşlemeleri motorda aynı", ciftler.every(([g, c]) => K.nedenCoz(g) === K.nedenCoz(c)),
    ciftler.map(([g]) => g + "→" + K.nedenCoz(g)).join(", "));
  ok("'SÜRE YETMEDİ' → 'SUREYETMEDI' (index canonical ile uyumlu)", K.nedenCoz("SÜRE YETMEDİ") === "SUREYETMEDI");
  ok("'SÜRE YETMEDİ' → kod 'sure'", (K.nedenBilgi("SÜRE YETMEDİ") || {}).kod === "sure");
  ok("bilinmeyen neden UYDURULMAZ (nedenBilgi null)", K.nedenBilgi("UYDURMA NEDEN") === null && K.nedenBilgi("") === null);
  ok("bilinmeyen neden 'seçilmemiş' sayılır ve sayıyla raporlanır", (function () {
    const s = K.snapshot({ plan: {}, exams: [{ id: "u", name: "U", date: BUGUN, net: 10, errorLogs: [
      { lesson: "Matematik", topic: "Türev", type: "UYDURMA NEDEN", date: BUGUN }] }] }, BUGUN);
    const h = K.hataAnalizi(s);
    return h.toplam === 1 && h.nedenler.length === 0 && h.nedensiz === 1 && /neden seçilmemiş/.test(h.yorum.join(" "));
  })());
}

// ------------------------------------------------------------
console.log("== 10) TEK HESAP: panel ve sohbet aynı motoru kullanır ==");
{
  ok("index.html koc.js'i mesaj.js'DEN ÖNCE yükler",
    HTML.indexOf('<script src="koc.js"></script>') > -1 &&
    HTML.indexOf('<script src="koc.js"></script>') < HTML.indexOf('<script src="mesaj.js"></script>'));
  ok("coachMessages metni motordan alır", /motor\.kartlar\(snap/.test(HTML));
  ok("panel snapshot'ı gerçek state + bugün ile kurar", /motor\.snapshot\(state, todayStr\(\), kocEk\(\)\)/.test(HTML));
  ok("mesaj.js raporu motordan alır (baglam → snapshot + rapor)", /mot\.rapor\(snap\)/.test(MESAJ) && /mot\.snapshotCtx\(c, bugun, \{/.test(MESAJ));
  ok("sohbet dalları rapor bölümlerini kullanır", /bolum\(c\.rapor, "Net analizi"\)/.test(MESAJ) && /bolum\(c\.rapor, "Konu önceliği"\)/.test(MESAJ));

  // Aynı sayı: panelin net kartı ile sohbetin net yanıtı
  globalThis.KOC_MOTOR = K;
  const mod = { exports: {} };
  new Function("module", "exports", "window", "document", MESAJ)(mod, mod.exports, undefined, undefined);
  const H = mod.exports;
  const rapor = K.rapor(SNAP);
  const kart = K.kartlar(SNAP, { adet: 6 }).join(" ");
  const yanit = H.kocYanit("netlerim nasıl?", { ad: "Efe", snap: SNAP, rapor: rapor, kalanGun: 30, hedefNet: 95 });
  ok("panel son neti 81,5 yazar", /81,5/.test(kart), kart.slice(0, 120));
  ok("sohbet son neti 81,5 yazar", /81,5/.test(yanit), yanit.slice(0, 120));
  ok("sohbet önceki neti ve farkı yazar", /77,5/.test(yanit) && /\+4 net/.test(yanit), yanit.slice(0, 160));
  ok("sohbet hedefe kalanı yazar (13,5)", /13,5/.test(yanit), yanit.slice(0, 200));
  ok("sohbet haftalık gereken tempoyu yazar (3,15)", /3,15/.test(yanit), yanit.slice(0, 200));
  ok("sohbette panelin sayısıyla çelişen değer yok", !/haftada \+0/.test(yanit));

  const konu = H.kocYanit("hangi konuya çalışmalıyım?", { rapor: rapor });
  ok("konu yanıtı öncelik listesini taşır (Üçgende Alan)", /Üçgende Alan/.test(konu), konu.slice(0, 160));
  ok("konu yanıtı gerekçeyi taşır (hata sayısı)", /\d+ hatanın/.test(konu), konu.slice(0, 200));

  const neden = H.kocYanit("hata nedenlerim ne?", { rapor: rapor });
  ok("neden yanıtı dağılımı verir (%50)", /%50/.test(neden), neden.slice(0, 160));
  ok("neden yanıtı baskın nedenin aksiyonunu verir", /aksiyonu:/.test(neden), neden.slice(0, 240));

  const bosSnap = K.snapshot({ plan: {}, exams: [] }, BUGUN);
  const bosYanit = H.kocYanit("netlerim nasıl?", { rapor: K.rapor(bosSnap) });
  ok("veri yokken sohbet sayı uydurmaz", /veri yok/i.test(bosYanit) && !/\d+ net/.test(bosYanit), bosYanit.slice(0, 160));
  ok("veri yokken sohbet eksiği ADIYLA söyler", /Deneme sonucu|Hiç deneme kaydı yok/.test(bosYanit), bosYanit.slice(0, 200));

  const eksikYanit = H.kocYanit("eksik veri ne?", { rapor: K.rapor(bosSnap) });
  ok("'eksik veri' sorusu konu listesine düşmez", !/Öncelik sıran/.test(eksikYanit), eksikYanit.slice(0, 120));
  ok("'eksik veri' cevabı kayıt adlarını sayar", /Sınav tarihi/.test(eksikYanit) && /Hedef net/.test(eksikYanit), eksikYanit.slice(0, 200));
}

// ------------------------------------------------------------
console.log("== 11) Kartlar: HTML güvenliği ve sınır ==");
{
  const kotu = K.snapshot({
    plan: { targetDate: "2026-12-20", targetNet: 90 },
    exams: [{ id: "k", name: '<img src=x onerror="alert(1)">', date: "2026-11-01", net: 50, errorLogs: [
      { lesson: "<b>Mat</b>", topic: '<script>alert(2)</script>', type: "Konuyu Bilmiyordum", date: "2026-11-01" }
    ] }]
  }, BUGUN);
  const kart = K.kartlar(kotu, { adet: 6 });
  ok("kart sayısı sınırı uygulanır (≤6)", kart.length <= 6, String(kart.length));
  ok("HTML kaçışı: <script> ham geçmez", !/<script>/.test(kart.join("")) && !/onerror="/.test(kart.join("")));
  ok("kartlar <b> ile başlar (panel biçimi)", kart.every((x) => /^<b>/.test(x)));
  const tek = K.kartlar(SNAP, { adet: 1 });
  ok("adet=1 tek kart döner", tek.length === 1, String(tek.length));
  ok("varsayılan adet 6", K.kartlar(SNAP).length <= 6);
}

// ------------------------------------------------------------
console.log("\n──────────────────────────────────────────────────────────");
if (kalan.length) {
  console.error("koc testi — " + gecen + "/" + (gecen + kalan.length) + " geçti, " + kalan.length + " BAŞARISIZ");
  kalan.forEach((k) => console.error(" ✗ " + k));
  process.exit(1);
}
console.log("koc testi — " + gecen + "/" + gecen + " geçti ✓");
