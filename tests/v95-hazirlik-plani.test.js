#!/usr/bin/env node
/* ============================================================
   v95 — SINAVA HAZIRLIK PLANI (tests/v95-hazirlik-plani.test.js)
   ------------------------------------------------------------
   KULLANICI (20 Kas 2026, geri bildirim):
     "uygulama neye göre sınava hazırlık günlerini belirliyor? Mesela
      okul sınavı için ilk çalışma gününü 3 gün önce seçmiş, bu çok saçma
      yetişmez ki. Deneme için sadece 'eksik kapatma' yazıyor oysaki bizim
      nerede eksik olduğumuzu biliyor direk konu önermeli. Bir günde 4-5 tane
      sınava hazırlık yapılamaz. Bu hazırlıkları bildirimle bildirmeli."

   Bu test METNE değil DAVRANIŞA bakar: hazirlikPlani() gerçekten çalıştırılır
   ve ölçülür:
     1) okul sınavı −3 güne sıkışmaz; konu sayısı kadar oturum üretilir
     2) bir günde en çok 2 hazırlık oturumu (yığılma yok)
     3) her oturum GERÇEK konu listesi taşır (hata günlüğü ∩ sınav kapsamı)
     4) deneme için "eksik kapatma" değil, konu adı önerilir
     5) bildirim aynı plandan üretilir (konu adları bildirimde görünür)
     6) geçmişe plan yazılmaz; kapsam yoksa uydurma plan yok
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const KOK = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ayrinti) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ayrinti !== undefined ? " → " + ayrinti : "")); return false;
}

function fnCikar(ad) {
  const bas = HTML.indexOf("function " + ad + "(");
  if (bas < 0) throw new Error(ad + " bulunamadı");
  let i = HTML.indexOf("{", bas), derinlik = 0, son = -1;
  for (let j = i; j < HTML.length; j++) {
    const c = HTML[j];
    if (c === "{") derinlik++;
    else if (c === "}") { derinlik--; if (derinlik === 0) { son = j + 1; break; } }
  }
  return HTML.slice(bas, son);
}

const SABITLER = HTML.split("\n").filter(x => /^const HAZIRLIK_/.test(x)).join("\n");

// ---- takvim yardımcıları (index.html ile aynı sözleşme) ----
const toDayStr = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const parseDay = str => {
  if (!str || typeof str !== "string" || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(str)) return null;
  const d = new Date(str.slice(0, 10) + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
};
const splitKey = k => {
  const i = String(k).indexOf(" > ");
  return i < 0 ? { lesson: "", topic: String(k) } : { lesson: String(k).slice(0, i), topic: String(k).slice(i + 3) };
};

function kutu(state, bugun) {
  const govde = [
    SABITLER,
    fnCikar("topicLearnedAfter"),
    fnCikar("collectErrorStats"),
    fnCikar("calculatePriority"),
    fnCikar("hazirlikZayifKonular"),
    fnCikar("hazirlikOturumSayisi"),
    fnCikar("hazirlikGunSeti"),
    fnCikar("hazirlikPlani"),
    fnCikar("hazirlikBildirimMetni"),
    fnCikar("hazirlikPlaniKaydet"),
    "\nreturn { hazirlikPlani: hazirlikPlani, hazirlikBildirimMetni: hazirlikBildirimMetni," +
    " hazirlikPlaniKaydet: hazirlikPlaniKaydet, hazirlikZayifKonular: hazirlikZayifKonular," +
    " hazirlikGunSeti: hazirlikGunSeti, hazirlikOturumSayisi: hazirlikOturumSayisi };"
  ].join("\n");
  const g = new Function("state", "todayStr", "parseDay", "toDayStr", "splitKey",
    "canonicalReason", "aytWeightOf", "getMemoryStrength", "saveState", govde);
  return g(state, () => bugun, parseDay, toDayStr, splitKey,
    x => x || "", () => 0.5, () => 50, () => { /* test: kayıt yok */ });
}

const BUGUN = "2026-11-20";

// ---- gerçek kullanıcıya yakın senaryo (10. sınıf, 10 okul sınavı) ----
function senaryo() {
  const ders = (ad, n, onek) => Array.from({ length: n }, (_, i) => ad + " > " + (onek || "Konu") + " " + (i + 1));
  // hata günlüğündeki iki konu sınav kapsamında (kullanıcının gerçek verisi)
  const tdeKapsam = ders("TDE", 21);
  tdeKapsam[0] = "TDE > Şiirde Ahenk";
  tdeKapsam[1] = "TDE > Koşuk";
  return {
    user: { grade: "10" },
    settings: { aytWeight: 0.5 },
    plan: {
      rhythm: "Akşam", examTime: "09:10", targetNet: 95, dailyHours: 2,
      targetDate: "2026-12-20",
      schoolExams: [
        { id: "bio", lesson: "Biyoloji", date: "2027-01-05", topics: ders("Biyoloji", 8) },
        { id: "tar", lesson: "Tarih", date: "2027-01-06", topics: ders("Tarih", 6) },
        { id: "kim", lesson: "Kimya", date: "2027-01-06", topics: ders("Kimya", 8) },
        { id: "mat", lesson: "Matematik", date: "2027-01-07", topics: ders("Matematik", 13) },
        { id: "fiz", lesson: "Fizik", date: "2027-01-08", topics: ders("Fizik", 8) },
        { id: "fel", lesson: "Felsefe", date: "2027-01-08", topics: ders("Felsefe", 13) },
        { id: "cog", lesson: "Coğrafya", date: "2027-01-12", topics: ders("Coğrafya", 7) },
        { id: "din", lesson: "Din Kültürü", date: "2027-01-13", topics: ders("Din Kültürü", 12) },
        { id: "tde", lesson: "TDE", date: "2027-01-14", topics: tdeKapsam }
      ]
    },
    // Okulizyon denemesi: gerçek hata günlüğü (kullanıcının verisi)
    exams: [{
      name: "Okulizyon 10.SINIF MAARİF İZLEME SINAVI 1", date: "2026-10-27", net: 77.5,
      errorLogs: [
        { lesson: "TDE", topic: "Şiirde Ahenk", type: "Konuyu Bilmiyordum", date: "2026-10-27" },
        { lesson: "TDE", topic: "Koşuk", type: "Konuyu Bilmiyordum", date: "2026-10-27" },
        { lesson: "Matematik", topic: "Konu 3", type: "Konuyu Bilmiyordum", date: "2026-10-27" },
        { lesson: "Fizik", topic: "Konu 2", type: "İşlem Hatası/Dikkatsizlik", date: "2026-10-27" }
      ]
    }],
    questions: [],
    memory: {},
    topics: {}
  };
}

const F = kutu(senaryo(), BUGUN);
const plan = F.hazirlikPlani();

// gün başına oturum sayısı
function gunSayaci(liste) {
  const m = {};
  liste.forEach(p => { m[p.date] = (m[p.date] || 0) + 1; });
  return m;
}
const sayac = gunSayaci(plan);
const enYogun = Object.keys(sayac).reduce((a, d) => Math.max(a, sayac[d]), 0);

console.log("\n== 1) Okul sınavı −3 güne sıkışmıyor: gün seti konu sayısından ==");
{
  const tde = plan.filter(p => p.examId === "tde");
  ok("21 konuluk TDE için en az 5 oturum üretildi", tde.length >= 5, tde.length);
  ok("TDE oturumlarının hepsi sınavdan ÖNCE", tde.every(p => p.date < "2027-01-14"), tde.map(p => p.date).join(","));
  // v96 — kural değişti: konular sınavdan EN AZ 3 gün önce biter.
  ok("son TDE oturumu sınavdan 3 gün önce (2027-01-11)", tde.some(p => p.date === "2027-01-11"), tde.map(p => p.date).join(","));
  ok("hiçbir TDE oturumu sınavdan 3 günden yakın değil", tde.every(p => p.gunOnce >= 3), tde.map(p => p.gunOnce).join(","));
  const enErken = tde.slice().sort((a, b) => (a.date < b.date ? -1 : 1))[0];
  const gunFark = Math.round((parseDay("2027-01-14") - parseDay(enErken.date)) / 86400000);
  ok("ilk çalışma günü sınavdan en az 7 gün önce (eski −3 yetmiyordu)", gunFark >= 7, gunFark + " gün");
  ok("oturumlar 21 konunun TAMAMINI kapsıyor",
    new Set(tde.flatMap(p => p.konular)).size === 21, new Set(tde.flatMap(p => p.konular)).size);
  ok("her oturumda en çok 3 konu var", tde.every(p => p.konular.length > 0 && p.konular.length <= 3),
    tde.map(p => p.konular.length).join(","));
  ok("hiçbir oturum geçmişte değil", plan.every(p => p.date >= BUGUN), plan.filter(p => p.date < BUGUN).map(p => p.date).join(","));
}

console.log("\n== 2) Bir günde 4-5 hazırlık YOK: günde en çok 2 oturum ==");
{
  ok("en yoğun günde en çok 2 oturum", enYogun <= 2, enYogun + " oturum");
  ok("10 sınav + deneme için toplam oturum makul", plan.length >= 20 && plan.length <= 60, plan.length);
  ok("aynı sınava aynı gün iki oturum yok",
    Object.keys(sayac).every(d => {
      const g = plan.filter(p => p.date === d);
      return new Set(g.map(p => p.examId)).size === g.length;
    }));
}

console.log("\n== 3) Konular GERÇEK veriden: hata günlüğü ∩ sınav kapsamı ==");
{
  const tde = plan.filter(p => p.examId === "tde");
  const ilk = tde.slice().sort((a, b) => (a.date < b.date ? -1 : 1))[0];
  ok("hata günlüğündeki 'Şiirde Ahenk' ilk oturumda (en zayıf önce)", ilk.konular.indexOf("TDE > Şiirde Ahenk") >= 0, ilk.konular.join(" | "));
  ok("hata günlüğündeki 'Koşuk' ilk oturumda", ilk.konular.indexOf("TDE > Koşuk") >= 0, ilk.konular.join(" | "));
  const kapsam = senaryo().plan.schoolExams.find(s => s.id === "tde").topics;
  ok("okul oturumunda kapsam DIŞI konu yok",
    tde.every(p => p.konular.every(k => kapsam.indexOf(k) >= 0)));
  ok("etiket konu adını gösteriyor", /Sınava hazırlık: TDE · /.test(ilk.etiket), ilk.etiket);
}

console.log("\n== 4) Deneme: 'eksik kapatma' değil, KONU önerisi ==");
{
  const den = plan.filter(p => p.examId === "deneme");
  ok("deneme için oturum üretildi", den.length >= 1, den.length);
  ok("deneme oturumları konu taşıyor", den.every(p => p.konular.length > 0));
  const hepsi = den.flatMap(p => p.konular);
  ok("deneme konuları hata günlüğünden", hepsi.indexOf("TDE > Şiirde Ahenk") >= 0, hepsi.join(" | "));
  ok("'Eksik kapatma' metni planda YOK", !plan.some(p => /Eksik kapatma/i.test(p.etiket + " " + p.detay)));
  ok("'Genel tekrar' / 'Formül turu' sabit adları YOK", !plan.some(p => /Genel tekrar|Formül turu/i.test(p.etiket)));
  ok("tüm oturumlar deneme tarihinden önce", den.every(p => p.date < "2026-12-20"));
}

console.log("\n== 5) Bildirim AYNI plandan üretiliyor (konu adıyla) ==");
{
  const gun = plan.filter(p => p.date === plan[0].date);
  const m = F.hazirlikBildirimMetni(gun);
  ok("bildirim üretildi", !!m);
  ok("başlık 'Bugün hazırlık'", /^Bugün hazırlık: /.test(m.title), m.title);
  const konuAdi = splitKey(gun[0].konular[0]).topic;
  ok("gövde GERÇEK konu adını taşıyor", m.body.indexOf(konuAdi) >= 0, m.body);
  ok("gövde 'eksik kapatma' demiyor", !/eksik kapatma/i.test(m.body), m.body);
  ok("boş listede bildirim üretilmez", F.hazirlikBildirimMetni([]) === null);
  // kaynak: bildirim fonksiyonu da plandan besleniyor (sabit gün yok)
  ok("processDueNotifications hazirlikPlani() kullanıyor",
    /hazirlikPlani\(\)\.filter\(p => p\.date === bugun\)/.test(HTML));
  ok("sabit −7/−3/−1 hazırlık bloğu kaldırıldı",
    HTML.indexOf('[[7, "Genel tekrar"]') < 0 && HTML.indexOf('[[3, "Eksik kapatma"]') < 0);
  ok("plan state'e yazılıyor (push aynı metni görsün)",
    /state\.plan\.hazirlikPlani = yeni/.test(HTML) && /hazirlikPlaniKaydet\(\)/.test(HTML));
  ok("günlük görev listesi hazırlığı AYNI plandan alıyor",
    /const bugunHazirlik = .*hazirlikPlani\(\)\.filter\(p => p\.date === todayStr\(\)\)/.test(HTML) &&
    /tur: "hazirlik"/.test(HTML));
  ok("planlama kartı kaç oturum/hangi günler olduğunu gösteriyor",
    /Hazırlık: <b>' \+ oturumlar\.length \+ " oturum<\/b>/.test(HTML));
}

console.log("\n== 6) Uydurma plan yok: kapsam yoksa klasik gün sayısı ==");
{
  const bos = {
    user: { grade: "10" }, settings: {},
    plan: { targetDate: "2026-12-20", schoolExams: [{ id: "x", lesson: "Matematik", date: "2026-12-05", topics: [] }] },
    exams: [], questions: [], memory: {}, topics: {}
  };
  const F2 = kutu(bos, BUGUN);
  const p2 = F2.hazirlikPlani();
  const okul = p2.filter(p => p.examId === "x");
  const den = p2.filter(p => p.examId === "deneme");
  ok("kapsamsız okul sınavı 2 gün (eski davranış korunur)", okul.length === 2, okul.length);
  ok("son gün sınavdan 3 gün önce (v96 kuralı)", okul.some(p => p.date === "2026-12-02"), okul.map(p => p.date).join(","));
  ok("kapsamsız okul oturumunda konu YOK (uydurma yok)", okul.every(p => p.konular.length === 0));
  ok("kapsamsız deneme 3 gün", den.length === 3, den.length);

  // sınav bugün/geçmiş → hazırlık üretilmez
  const gecmis = {
    user: { grade: "10" }, settings: {},
    plan: { schoolExams: [{ id: "y", lesson: "Fizik", date: "2026-11-20", topics: ["Fizik > Kuvvet"] }] },
    exams: [], questions: [], memory: {}, topics: {}
  };
  const p3 = kutu(gecmis, BUGUN).hazirlikPlani();
  ok("sınav bugünse hazırlık üretilmez", p3.length === 0, JSON.stringify(p3));
}

console.log("\n== 7) Kural görünür: gün seti yardımcıları ==");
{
  ok("gün seti sınavdan 3 gün önceyle biter (v96)", F.hazirlikGunSeti(4, 30).indexOf(3) >= 0, F.hazirlikGunSeti(4, 30).join(","));
  ok("gün seti sınavdan 3 günden yakına inmez", F.hazirlikGunSeti(4, 30).every(x => x >= 3), F.hazirlikGunSeti(4, 30).join(","));
  ok("sınava 3 günden az kaldıysa gün seti boş", F.hazirlikGunSeti(3, 3).length === 0, F.hazirlikGunSeti(3, 3).join(","));
  ok("oturum sayısı konu/3", F.hazirlikOturumSayisi(21, 55, "okul") === 7, F.hazirlikOturumSayisi(21, 55, "okul"));
  ok("oturum tavanı 8", F.hazirlikOturumSayisi(99, 55, "okul") === 8, F.hazirlikOturumSayisi(99, 55, "okul"));
  ok("gün tavanı 2 · oturum başına konu 3 · oturum tavanı 8 sabitleri dosyada",
    /const HAZIRLIK_GUN_TAVAN = 2;/.test(HTML) && /const HAZIRLIK_OTURUM_KONU = 3;/.test(HTML) && /const HAZIRLIK_OTURUM_TAVAN = 8;/.test(HTML));
}

console.log("\n== 8) Plan state'e yazılınca push aynı metni görür ==");
{
  const s = senaryo();
  const F3 = kutu(s, BUGUN);
  let kayit = 0;
  const g = new Function("state", "todayStr", "parseDay", "toDayStr", "splitKey",
    "canonicalReason", "aytWeightOf", "getMemoryStrength", "saveState",
    SABITLER + "\n" + fnCikar("topicLearnedAfter") + "\n" + fnCikar("collectErrorStats") + "\n" +
    fnCikar("calculatePriority") + "\n" + fnCikar("hazirlikZayifKonular") + "\n" +
    fnCikar("hazirlikOturumSayisi") + "\n" + fnCikar("hazirlikGunSeti") + "\n" +
    fnCikar("hazirlikPlani") + "\n" + fnCikar("hazirlikPlaniKaydet") +
    "\nreturn hazirlikPlaniKaydet;");
  const f = g(s, () => BUGUN, parseDay, toDayStr, splitKey, x => x || "", () => 0.5, () => 50, () => { kayit++; });
  const yazdi = f();
  ok("plan state'e yazıldı", yazdi === true && Array.isArray(s.plan.hazirlikPlani), yazdi);
  ok("kayıtta push için tarih/ders/bildirim var",
    s.plan.hazirlikPlani.every(x => x.date && x.ders && x.bildirim && x.gunOnce >= 3));
  ok("kayıt şişmiyor (konu dizisi yazılmaz)", s.plan.hazirlikPlani.every(x => x.konular === undefined));
  ok("bildirim metni konu adı taşıyor",
    s.plan.hazirlikPlani.some(x => /: /.test(x.bildirim)), s.plan.hazirlikPlani[0] && s.plan.hazirlikPlani[0].bildirim);
  ok("aynı plan ikinci kez yazılmaz (gereksiz kayıt yok)", f() === false);
  ok("kayıt sırasında saveState çağrıldı", kayit === 1, kayit);
  F3.hazirlikPlani();  // kullanılmayan uyarısı olmasın
}

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(x => console.log(" ✗ " + x));
  console.log("v95 hazırlık planı testi — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("v95 hazırlık planı testi — " + gecen + "/" + gecen + " geçti ✓");
