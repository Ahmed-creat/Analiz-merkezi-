#!/usr/bin/env node
/* ============================================================
   BİYOLOJİ 10 — 2. TUR: ağaç, kayıt defteri, grafik, PWA
   ------------------------------------------------------------
   Ders kitabı (MEB, 2025) içindekiler düzeyi 19 konu:
     1. Tema: Enerji  → 10 konu (1.1–1.10)
     2. Tema: Ekoloji →  9 konu (2.1–2.9)

   Yaptığı:
     1) konular.js + pwa-files/functions/konular.js: yalnız
        "10": { ... } bölümündeki Biyoloji bloğunu 19 satırlık
        kitapla birebir listeyle değiştirir (9. sınıf ezilmez).
     2) Kayıt defteri (content/mufredat + site/content/mufredat):
        biyo_10_* kayıtlarını canlı havuzlardan yeniden üretir.
     3) Her havuzun topic_key'ini ağaç başlığına eşitler.
     4) İlişki grafiği (3 kopya): biyo_10_* düğümlerini canlı
        başlıklarla günceller, kenarları temizleyip ön koşul
        zincirini kurar.
     5) PWA kopyalarını canlı havuzlarla eşitler, sw.js önbellek
        listesini 19 dosyaya tamamlar.

   Kullanım: node docs/uretim/uretim/biyoloji-tur2-guncelle.js [--kontrol]
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const KONTROL = process.argv.includes("--kontrol");
const HAVUZ_DIR = path.join(KOK, "site", "content", "soru_havuzlari");

let hata = 0;
const bildir = m => console.log(m);

/* Kitabın içindekiler sırası — 19 konu */
const AGAC = [
  "1.1 Canlılık İçin Enerjinin Önemi",
  "1.2 Işık Enerjisi Kullanılarak Besin Sentezi (Fotosentez)",
  "1.3 Fotosentezde Kullanılan ve Üretilen Maddeler",
  "1.4 Işık Enerjisi Kullanılmadan Besin Sentezi (Kemosentez)",
  "1.5 Sindirim",
  "1.6 İnsanda Sindirim",
  "1.7 Hücresel Solunum",
  "1.8 Besinlerin Solunuma Katılma Yolları",
  "1.9 Fermantasyon",
  "1.10 Enerji-Metabolizma İlişkisi",
  "2.1 Ekosistemin Bileşenleri",
  "2.2 Komünitelerde ve Popülasyonlarda Görülen Etkileşimler ve Değişimler",
  "2.3 Ekosistemdeki Madde ve Enerji Akışı",
  "2.4 Madde Döngüleri",
  "2.5 Ekolojik Sürdürülebilirliğin Önemi",
  "2.6 Ekolojik Sürdürülebilirliği Kısıtlayan Durumlar",
  "2.7 Ekolojik Ayak İzinin Küçültülmesi",
  "2.8 Doğal Kaynakların ve Biyoçeşitliliğin Korunması",
  "2.9 Atık Yönetimi"
];

/* ---- 1) konular.js (iki kopya) ---- */
for (const dosya of [path.join(KOK, "konular.js"), path.join(KOK, "pwa-files", "functions", "konular.js")]) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  let s = fs.readFileSync(dosya, "utf8");
  /* DİKKAT: konular.js içinde 9. ve 10. sınıf olmak üzere iki "Biyoloji"
     bloğu var. Yalnız "10" bölümündeki bloğu hedefle. */
  const on = s.indexOf('"10": {');
  if (on < 0) { bildir("✗ 10. sınıf bölümü yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const m = s.slice(on).match(/  "Biyoloji": \[\n([\s\S]*?)\n  \],/);
  if (!m) { bildir("✗ Biyoloji bloğu bulunamadı: " + path.relative(KOK, dosya)); hata++; continue; }
  m.index += on;
  const mevcut = m[1].split("\n").filter(x => x.trim().startsWith('"')).map(x => x.trim().replace(/^"|",?$/g, ""));
  const yeni = '  "Biyoloji": [\n' + AGAC.map(t => '   "' + t + '"').join(",\n") + "\n  ],";
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
const havuzlar = fs.readdirSync(HAVUZ_DIR).filter(f => /^biyo_10_u\d+_k\d+\.json$/.test(f)).sort();
const kayitlar = havuzlar.map(f => {
  const p = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, f), "utf8"));
  return { konu_id: p.konu_id, konu_adi: numarasiz(p.baslik), sinif: 10, ders: "Biyoloji" };
});

for (const dosya of [path.join(KOK, "content", "mufredat", "konu_kayit_defteri.json"),
                     path.join(KOK, "site", "content", "mufredat", "konu_kayit_defteri.json")]) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const d = JSON.parse(fs.readFileSync(dosya, "utf8"));
  if (!Array.isArray(d.records)) { bildir("✗ records yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const ilkYer = d.records.findIndex(r => /^biyo_10_u\d+_k\d+$/.test(String(r.konu_id)));
  if (ilkYer < 0) { bildir("✗ biyoloji kaydı yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const kalan = d.records.filter(r => !/^biyo_10_u\d+_k\d+$/.test(String(r.konu_id)));
  d.records = [...kalan.slice(0, ilkYer), ...kayitlar, ...kalan.slice(ilkYer)];
  if (!KONTROL) fs.writeFileSync(dosya, JSON.stringify(d, null, 2) + "\n", "utf8");
  bildir("✔ " + path.relative(KOK, dosya) + ": " + kayitlar.length + " biyoloji kaydı");
}

/* ---- 3) topic_key eşitle ---- */
let etiket = 0, eksik = 0;
for (const f of havuzlar) {
  const yol = path.join(HAVUZ_DIR, f);
  const p = JSON.parse(fs.readFileSync(yol, "utf8"));
  if (!AGAC.includes(p.baslik)) { bildir("✗ ağaçta yok: " + p.konu_id + " → " + p.baslik); eksik++; continue; }
  const anahtar = "Biyoloji > " + p.baslik;
  if (p.topic_key === anahtar) continue;
  p.topic_key = anahtar;
  if (!KONTROL) fs.writeFileSync(yol, JSON.stringify(p, null, 2) + "\n", "utf8");
  etiket++;
}
bildir("✔ topic_key eşitlendi: " + etiket + " havuz · ağaçta karşılığı olmayan: " + eksik);
if (eksik) hata += eksik;

/* ---- 4) İlişki grafiği ---- */
const UNITE = {
  "1": "1. Tema: Enerji",
  "2": "2. Tema: Çevre ve Ekoloji"
};
const ZINCIR = [
  ["biyo_10_u01_k01", "biyo_10_u01_k02", "Enerji ve ATP kavranmadan fotosentezle besin sentezi açıklanamaz."],
  ["biyo_10_u01_k02", "biyo_10_u01_k03", "Fotosentezin işleyiş modeli kurulmadan kullanılan ve üretilen maddeler yorumlanamaz."],
  ["biyo_10_u01_k02", "biyo_10_u01_k04", "Işıklı besin sentezi bilinmeden kemosentezle karşılaştırılamaz."],
  ["biyo_10_u01_k05", "biyo_10_u01_k06", "Canlılarda sindirim çeşitleri bilinmeden insanda sindirim sistemi çözümlenemez."],
  ["biyo_10_u01_k06", "biyo_10_u01_k07", "Sindirim ve emilim süreçleri kurulmadan hücresel solunum modeli kurulamaz."],
  ["biyo_10_u01_k07", "biyo_10_u01_k08", "Hücresel solunum bilinmeden besinlerin solunuma katılma yolları karşılaştırılamaz."],
  ["biyo_10_u01_k07", "biyo_10_u01_k09", "Oksijenli solunum bilinmeden fermantasyonun farkı açıklanamaz."],
  ["biyo_10_u01_k08", "biyo_10_u01_k10", "Besin gruplarının enerji eldesi bilinmeden metabolizma ilişkisi kurulamaz."],
  ["biyo_10_u01_k09", "biyo_10_u01_k10", "Fermantasyonun enerji verimi bilinmeden enerji-metabolizma ilişkisi tamamlanamaz."],
  ["biyo_10_u02_k01", "biyo_10_u02_k02", "Ekosistemin bileşenleri bilinmeden komünite ve popülasyon etkileşimleri çözümlenemez."],
  ["biyo_10_u02_k02", "biyo_10_u02_k03", "Türler arası etkileşimler bilinmeden besin zinciri ve enerji akışı yorumlanamaz."],
  ["biyo_10_u02_k03", "biyo_10_u02_k04", "Enerji akışı ve trofik basamaklar bilinmeden madde döngüleri modellenemez."],
  ["biyo_10_u02_k04", "biyo_10_u02_k05", "Madde döngüleri bilinmeden ekolojik sürdürülebilirliğin önemi yorumlanamaz."],
  ["biyo_10_u02_k05", "biyo_10_u02_k06", "Sürdürülebilirliğin önemi kurulmadan onu kısıtlayan durumlar tahmin edilemez."],
  ["biyo_10_u02_k06", "biyo_10_u02_k07", "Kısıtlayan durumlar bilinmeden ekolojik ayak izini küçültme yolları sorgulanamaz."],
  ["biyo_10_u02_k06", "biyo_10_u02_k08", "Kirlilik ve habitat kaybı bilinmeden koruma önlemleri değerlendirilemez."],
  ["biyo_10_u02_k07", "biyo_10_u02_k09", "Ayak izi kavramı bilinmeden atık yönetimi çalışmaları anlamlandırılamaz."]
];

for (const dosya of [path.join(KOK, "site", "content", "iliski_grafi.json"),
                     path.join(KOK, "content", "iliski_grafi.json"),
                     path.join(KOK, "pwa-files", "content", "iliski_grafi.json")]) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const g = JSON.parse(fs.readFileSync(dosya, "utf8"));
  g.dugumler = g.dugumler || [];
  g.kenarlar = g.kenarlar || [];

  const eskiKenar = g.kenarlar.length;
  g.kenarlar = g.kenarlar.filter(k => !/^biyo_10_/.test(String(k.kaynak_konu_id)) && !/^biyo_10_/.test(String(k.hedef_konu_id)));

  let dugum = 0, guncel = 0;
  for (const k of kayitlar) {
    const yer = g.dugumler.findIndex(d => d.konu_id === k.konu_id);
    const unite = UNITE[k.konu_id.match(/^biyo_10_u0(\d)_/)[1]];
    if (yer < 0) {
      g.dugumler.push({ konu_id: k.konu_id, konu_adi: k.konu_adi, sinif: 10, ders: "Biyoloji", unite });
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
    " kenar (+" + dugum + " düğüm, " + guncel + " başlık, +" + kenar + " kenar, -" + (eskiKenar - (g.kenarlar.length - kenar)) + " eski kenar)");
}

/* ---- 5) PWA kopyaları + sw.js ---- */
const PWA = path.join(KOK, "pwa-files", "content", "soru_havuzlari");
if (fs.existsSync(PWA)) {
  for (const f of havuzlar) {
    if (!KONTROL) fs.copyFileSync(path.join(HAVUZ_DIR, f), path.join(PWA, f));
  }
  bildir("✔ PWA kopyası: " + havuzlar.length + " biyoloji havuzu eşitlendi");
}

for (const SW of [path.join(KOK, "sw.js"), path.join(KOK, "site", "sw.js")]) {
  if (!fs.existsSync(SW)) { bildir("✗ yok: " + path.relative(KOK, SW)); hata++; continue; }
  let s = fs.readFileSync(SW, "utf8");
  const satirlar = havuzlar.map(f => '  "./content/soru_havuzlari/' + f.replace(/\.json$/, "") + '.json",');
  const eksikSatir = satirlar.filter(l => !s.includes(l));
  if (eksikSatir.length) {
    const son = [...s.matchAll(/  "\.\/content\/soru_havuzlari\/biyo_10_u\d+_k\d+\.json",\n/g)].pop();
    if (son) {
      const yer = son.index + son[0].length;
      s = s.slice(0, yer) + eksikSatir.join("\n") + "\n" + s.slice(yer);
      if (!KONTROL) fs.writeFileSync(SW, s, "utf8");
      bildir("✔ " + path.relative(KOK, SW) + ": " + eksikSatir.length + " havuz önbellek listesine eklendi");
    } else { bildir("✗ " + path.relative(KOK, SW) + ": biyoloji satırı bulunamadı"); hata++; }
  } else {
    bildir("= " + path.relative(KOK, SW) + " önbellek listesi tam (" + satirlar.length + " biyoloji havuzu)");
  }
}

bildir("canlı biyoloji havuzu: " + havuzlar.length + " · ağaç: " + AGAC.length + " konu");
bildir(hata ? "SONUÇ: " + hata + " hata" : "SONUÇ: tamam");
process.exitCode = hata ? 1 : 0;
