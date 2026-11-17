#!/usr/bin/env node
/* ============================================================
   TARİH 10 — 2. TUR: ağaç, kayıt defteri, grafik, PWA
   ------------------------------------------------------------
   Ders kitabı (MEB, 2025) içindekiler düzeyi 14 konu:
     1. Ünite: 1.1-1.4                   → 4 konu
     2. Ünite: 2.1-2.5                   → 5 konu
     3. Ünite: 3.1-3.5                   → 5 konu

   Yaptığı:
     1) konular.js + pwa-files/functions/konular.js: yalnız
        "10": { ... } bölümündeki Tarih bloğunu 14 satırlık
        kitapla birebir listeyle eşitler (9. sınıf ezilmez).
     2) Kayıt defteri (content/mufredat + site/content/mufredat):
        eski tar_10_* / tarih_10_* kayıtlarını atar, canlı
        havuzlardan 14 yeni tar_10_u*_k* kaydı üretir.
     3) Her havuzun topic_key'ini ağaç başlığına eşitler.
     4) İlişki grafiği (3 kopya): eski tarih düğümlerini atar,
        canlı 14 düğümü yazar, ön koşul zincirini kurar.
     5) PWA kopyalarını canlı havuzlarla eşitler, arşive giden
        havuzların PWA kopyalarını siler, sw.js önbellek
        listesini 14 dosyaya indirger.

   Kullanım: node docs/uretim/uretim/tarih-tur2-guncelle.js [--kontrol]
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const KONTROL = process.argv.includes("--kontrol");
const HAVUZ_DIR = path.join(KOK, "site", "content", "soru_havuzlari");
const ARSIV_DIR = path.join(KOK, "arsiv", "soru_havuzlari", "tarih");

let hata = 0;
const bildir = m => console.log(m);

/* Kitabın içindekiler sırası — 14 konu */
const AGAC = [
  "1.1 Önemli Askerî Mücadelelerin Türk Tarihinin Seyrine Etkileri",
  "1.2 Türkistan'dan Türkiye'ye Türklerde Devlet ve Ordu Teşkilatları",
  "1.3 Türklerde Sosyoekonomik Hayat ve Şehirleşme",
  "1.4 Türk-İslam Medeniyetinde Bilim, Kültür, Eğitim ve Sanat",
  "2.1 Osmanlı Devleti'nin Kuruluşuna Dair Görüşler",
  "2.2 Beylikten Devlete Siyasi ve Askerî Gelişmeler",
  "2.3 Osmanlı Devleti'nde Ordu, Hukuk ve Toprak Sistemi",
  "2.4 Osmanlı Devleti'nin İskân ve İstimalet Politikası",
  "2.5 Osmanlı Devleti'nin İlim ve İrfan Geleneği",
  "3.1 Osmanlı Devleti'nin Cihan Devleti Hâline Gelmesi",
  "3.2 Osmanlı Devleti'nin Yönetim ve Ordu Yapısında Değişim",
  "3.3 Avrupalıların Sömürgeci Politikaları",
  "3.4 Osmanlı Devleti'nde İsyanlar",
  "3.5 Osmanlı Devleti'nde Bilim, Kültür, Eğitim ve Sanat"
];

/* ---- 1) konular.js (iki kopya) ---- */
for (const dosya of [path.join(KOK, "konular.js"), path.join(KOK, "pwa-files", "functions", "konular.js")]) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  let s = fs.readFileSync(dosya, "utf8");
  /* DİKKAT: konular.js içinde 9. ve 10. sınıf olmak üzere iki "Tarih"
     bloğu var. Yalnız "10" bölümündeki bloğu hedefle. */
  const on = s.indexOf('"10": {');
  if (on < 0) { bildir("✗ 10. sınıf bölümü yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const m = s.slice(on).match(/  "Tarih": \[\n([\s\S]*?)\n  \],/);
  if (!m) { bildir("✗ Tarih bloğu bulunamadı: " + path.relative(KOK, dosya)); hata++; continue; }
  m.index += on;
  const mevcut = m[1].split("\n").filter(x => x.trim().startsWith('"')).map(x => x.trim().replace(/^"|",?$/g, ""));
  const yeni = '  "Tarih": [\n' + AGAC.map(t => '   "' + t + '"').join(",\n") + "\n  ],";
  if (mevcut.length === AGAC.length && mevcut.every((t, i) => t === AGAC[i])) {
    bildir("= zaten güncel: " + path.relative(KOK, dosya));
    continue;
  }
  s = s.slice(0, m.index) + yeni + s.slice(m.index + m[0].length);
  if (!KONTROL) fs.writeFileSync(dosya, s, "utf8");
  bildir("✔ " + path.relative(KOK, dosya) + ": " + mevcut.length + " konu → " + AGAC.length + " konu");
}

/* ---- 2) Kayıt defteri ---- */
const numarasiz = t => String(t).replace(/^\d+(\.\d+)*\s*/, "").trim();
const havuzlar = fs.readdirSync(HAVUZ_DIR).filter(f => /^tar_10_u\d+_k\d+\.json$/.test(f)).sort();
const kayitlar = havuzlar.map(f => {
  const p = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, f), "utf8"));
  return { konu_id: p.konu_id, konu_adi: numarasiz(p.baslik), sinif: 10, ders: "Tarih" };
});
if (kayitlar.length !== AGAC.length) {
  bildir("✗ canlı havuz " + kayitlar.length + " · ağaç " + AGAC.length);
  hata++;
}

for (const dosya of [path.join(KOK, "content", "mufredat", "konu_kayit_defteri.json"),
                     path.join(KOK, "site", "content", "mufredat", "konu_kayit_defteri.json")]) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const d = JSON.parse(fs.readFileSync(dosya, "utf8"));
  if (!Array.isArray(d.records)) { bildir("✗ records yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const eskiMi = /^(tar_10_|tarih_10_)/;
  const ilkYer = d.records.findIndex(r => eskiMi.test(String(r.konu_id)));
  if (ilkYer < 0) { bildir("✗ tarih kaydı yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const kalan = d.records.filter(r => !eskiMi.test(String(r.konu_id)));
  d.records = [...kalan.slice(0, ilkYer), ...kayitlar, ...kalan.slice(ilkYer)];
  if (Array.isArray(d.conflicts)) {
    const once = d.conflicts.length;
    d.conflicts = d.conflicts.filter(c => !eskiMi.test(String(c.konu_id)));
    if (!KONTROL && d.conflicts.length !== once) bildir("  çakışma kaydı silindi: " + (once - d.conflicts.length));
  }
  if (!KONTROL) fs.writeFileSync(dosya, JSON.stringify(d, null, 2) + "\n", "utf8");
  bildir("✔ " + path.relative(KOK, dosya) + ": " + kayitlar.length + " tarih kaydı");
}

/* ---- 3) topic_key eşitle ---- */
let etiket = 0, eksik = 0;
for (const f of havuzlar) {
  const yol = path.join(HAVUZ_DIR, f);
  const p = JSON.parse(fs.readFileSync(yol, "utf8"));
  if (!AGAC.includes(p.baslik)) { bildir("✗ ağaçta yok: " + p.konu_id + " → " + p.baslik); eksik++; continue; }
  const anahtar = "Tarih > " + p.baslik;
  if (p.topic_key === anahtar) continue;
  p.topic_key = anahtar;
  if (!KONTROL) fs.writeFileSync(yol, JSON.stringify(p, null, 2) + "\n", "utf8");
  etiket++;
}
bildir("✔ topic_key eşitlendi: " + etiket + " havuz · ağaçta karşılığı olmayan: " + eksik);
if (eksik) hata += eksik;

/* ---- 4) İlişki grafiği ---- */
const UNITE = {
  "1": "1. Ünite: Türkistan'dan Türkiye'ye (1040-1299)",
  "2": "2. Ünite: Beylikten Devlete",
  "3": "3. Ünite: Cihan Devleti (1453-1683)"
};
const ZINCIR = [
  ["tar_10_u01_k01", "tar_10_u01_k02", "Askerî mücadeleler bilinmeden devlet ve ordu teşkilatındaki değişim çözümlenemez."],
  ["tar_10_u01_k02", "tar_10_u01_k03", "Devlet ve ordu teşkilatı bilinmeden sosyoekonomik hayat ve şehirleşme yorumlanamaz."],
  ["tar_10_u01_k03", "tar_10_u01_k04", "Şehir ve ekonomik hayat bilinmeden Türk-İslam medeniyetinin bilim ve sanat birikimi açıklanamaz."],
  ["tar_10_u01_k04", "tar_10_u02_k05", "Türk-İslam medeniyeti birikimi bilinmeden Osmanlı kuruluş tartışmaları değerlendirilemez."],
  ["tar_10_u02_k05", "tar_10_u02_k06", "Kuruluş tartışmaları bilinmeden beylikten devlete siyasi gelişmeler sıralanamaz."],
  ["tar_10_u02_k06", "tar_10_u02_k07", "Siyasi gelişmeler bilinmeden ordu, hukuk ve toprak sistemi çözümlenemez."],
  ["tar_10_u02_k07", "tar_10_u02_k08", "Kurumlar bilinmeden iskân ve istimalet politikası açıklanamaz."],
  ["tar_10_u02_k08", "tar_10_u02_k09", "İskân ve istimalet bilinmeden ilim ve irfan geleneğinin taşıyıcıları anlaşılamaz."],
  ["tar_10_u02_k09", "tar_10_u03_k10", "İlim ve irfan geleneği bilinmeden cihan devleti hâline gelme süreci bütünüyle kavranamaz."],
  ["tar_10_u03_k10", "tar_10_u03_k11", "Cihan devleti siyaseti bilinmeden yönetim ve ordu yapısındaki değişim çözümlenemez."],
  ["tar_10_u03_k11", "tar_10_u03_k12", "Yönetim yapısı bilinmeden Avrupalıların sömürgeci politikalarıyla karşılaştırma yapılamaz."],
  ["tar_10_u03_k12", "tar_10_u03_k13", "Sömürgecilik ve ekonomik baskı bilinmeden iç isyanların nedenleri açıklanamaz."],
  ["tar_10_u03_k13", "tar_10_u03_k14", "İsyanlar ve düzen bozulması bilinmeden bilim, kültür ve sanat hayatının çözülmesi okunamaz."]
];

for (const dosya of [path.join(KOK, "site", "content", "iliski_grafi.json"),
                     path.join(KOK, "content", "iliski_grafi.json"),
                     path.join(KOK, "pwa-files", "content", "iliski_grafi.json")]) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const g = JSON.parse(fs.readFileSync(dosya, "utf8"));
  g.dugumler = g.dugumler || [];
  g.kenarlar = g.kenarlar || [];

  const canliId = new Set(kayitlar.map(k => k.konu_id));
  const eskiKenar = g.kenarlar.length;
  /* Yalnız ucu arşivlenmiş kenarları at; canlı düğümler arası kenarlar korunur (idempotent). */
  g.kenarlar = g.kenarlar.filter(k => {
    const a = String(k.kaynak_konu_id), b = String(k.hedef_konu_id);
    const tarihKenar = /^(tar_10_|tarih_10_)/.test(a) || /^(tar_10_|tarih_10_)/.test(b);
    return !tarihKenar || (canliId.has(a) && canliId.has(b));
  });

  const oncekiDugum = g.dugumler.length;
  g.dugumler = g.dugumler.filter(d => !/^(tar_10_|tarih_10_)/.test(String(d.konu_id)) || canliId.has(d.konu_id));
  const atilanDugum = oncekiDugum - g.dugumler.length;

  let dugum = 0, guncel = 0;
  for (const k of kayitlar) {
    const yer = g.dugumler.findIndex(d => d.konu_id === k.konu_id);
    const unite = UNITE[k.konu_id.match(/^tar_10_u0(\d)_/)[1]];
    if (yer < 0) {
      g.dugumler.push({ konu_id: k.konu_id, konu_adi: k.konu_adi, sinif: 10, ders: "Tarih", unite });
      dugum++;
    } else if (g.dugumler[yer].konu_adi !== k.konu_adi || g.dugumler[yer].unite !== unite) {
      g.dugumler[yer].konu_adi = k.konu_adi;
      g.dugumler[yer].unite = unite;
      guncel++;
    }
  }

  const var_ = new Set(g.kenarlar.map(k => k.kaynak_konu_id + "→" + k.hedef_konu_id + ":" + k.iliski_tipi));
  let kenar = 0;
  for (const [a, b, gerekce] of ZINCIR) {
    const anahtar = a + "→" + b + ":SERT_ONKOSUL";
    if (var_.has(anahtar)) continue;
    if (!g.dugumler.some(d => d.konu_id === a) || !g.dugumler.some(d => d.konu_id === b)) continue;
    g.kenarlar.push({ kaynak_konu_id: a, hedef_konu_id: b, iliski_tipi: "SERT_ONKOSUL", agirlik: 0.9, gerekce });
    var_.add(anahtar);
    kenar++;
  }
  if (!KONTROL) fs.writeFileSync(dosya, JSON.stringify(g, null, 2) + "\n", "utf8");
  bildir("✔ " + path.relative(KOK, dosya) + ": " + g.dugumler.length + " düğüm · " + g.kenarlar.length +
    " kenar (+" + dugum + " düğüm, -" + atilanDugum + " eski düğüm, " + guncel + " başlık, +" + kenar +
    " kenar, -" + (eskiKenar - (g.kenarlar.length - kenar)) + " eski kenar)");
}

/* ---- 5) PWA kopyaları + sw.js ---- */
const PWA_DIR = path.join(KOK, "pwa-files", "content", "soru_havuzlari");
if (fs.existsSync(PWA_DIR)) {
  const arsiv = fs.existsSync(ARSIV_DIR) ? fs.readdirSync(ARSIV_DIR) : [];
  let silinen = 0;
  for (const f of fs.readdirSync(PWA_DIR)) {
    const arsivAdi = "eski-" + f;
    if (!arsiv.includes(arsivAdi)) continue;
    if (!KONTROL) fs.unlinkSync(path.join(PWA_DIR, f));
    silinen++;
  }
  for (const f of havuzlar) {
    if (!KONTROL) fs.copyFileSync(path.join(HAVUZ_DIR, f), path.join(PWA_DIR, f));
  }
  if (!KONTROL && fs.existsSync(path.join(HAVUZ_DIR, "index.json"))) {
    fs.copyFileSync(path.join(HAVUZ_DIR, "index.json"), path.join(PWA_DIR, "index.json"));
  }
  bildir("✔ PWA kopyası: " + havuzlar.length + " tarih havuzu eşitlendi · " + silinen + " arşiv kopyası silindi");
}

/* sw.js önbellek listesi: canlı havuzların TAMAMI (index.json ile 1:1) */
const manifestYolu = path.join(HAVUZ_DIR, "index.json");
const tumIdler = JSON.parse(fs.readFileSync(manifestYolu, "utf8")).havuzlar.map(h => h.konu_id).sort();

for (const SW of [path.join(KOK, "sw.js"), path.join(KOK, "site", "sw.js")]) {
  if (!fs.existsSync(SW)) { bildir("✗ yok: " + path.relative(KOK, SW)); hata++; continue; }
  const satirlar = fs.readFileSync(SW, "utf8").split("\n");
  const yer = satirlar.map((l, i) => (l.indexOf("./content/soru_havuzlari/") >= 0 ? i : -1)).filter(i => i >= 0);
  if (!yer.length) { bildir("✗ " + path.relative(KOK, SW) + ": havuz satırı yok"); hata++; continue; }
  const ilk = yer[0], son = yer[yer.length - 1];
  if (yer.length !== son - ilk + 1) { bildir("✗ " + path.relative(KOK, SW) + ": havuz satırları bitişik değil"); hata++; continue; }
  const blok = satirlar.slice(ilk, son + 1);
  const endeksSatiri = blok.find(l => l.indexOf("soru_havuzlari/index.json") >= 0);
  const yeniBlok = tumIdler.map(id => '  "./content/soru_havuzlari/' + id + '.json",');
  yeniBlok[yeniBlok.length - 1] = yeniBlok[yeniBlok.length - 1].replace(/,$/, "");
  if (endeksSatiri) yeniBlok.unshift(endeksSatiri.replace(/,$/, "") + ",");
  if (yeniBlok.length === blok.length && yeniBlok.every((l, i) => l === blok[i])) {
    bildir("= " + path.relative(KOK, SW) + " önbellek listesi tam (" + (yeniBlok.length - (endeksSatiri ? 1 : 0)) + " havuz)");
    continue;
  }
  satirlar.splice(ilk, blok.length, ...yeniBlok);
  if (!KONTROL) fs.writeFileSync(SW, satirlar.join("\n"), "utf8");
  bildir("✔ " + path.relative(KOK, SW) + ": " + blok.length + " satır → " + yeniBlok.length + " satır");
}

bildir("canlı tarih havuzu: " + havuzlar.length + " · ağaç: " + AGAC.length + " konu");
bildir(hata ? "SONUÇ: " + hata + " hata" : "SONUÇ: tamam");
process.exitCode = hata ? 1 : 0;
