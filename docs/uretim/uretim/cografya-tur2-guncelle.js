#!/usr/bin/env node
/* ============================================================
   COĞRAFYA 10 — 2. TUR: ağaç, kayıt defteri, grafik, PWA
   ------------------------------------------------------------
   Ders kitabı (MEB, 2025) içindekiler düzeyi 18 konu:
     1. Ünite: 1.1                       → 1 konu
     2. Ünite: 2.1-2.2                   → 2 konu
     3. Ünite: 3.1-3.5                   → 5 konu
     4. Ünite: 4.1-4.2                   → 2 konu
     5. Ünite: 5.1-5.3                   → 3 konu
     6. Ünite: 6.1-6.4                   → 4 konu
     7. Ünite: 7.1                       → 1 konu

   Yaptığı:
     1) konular.js + pwa-files/functions/konular.js: yalnız
        "10": { ... } bölümündeki Coğrafya bloğunu 18 satırlık
        kitapla birebir listeyle değiştirir (9. sınıf ezilmez).
     2) Kayıt defteri (content/mufredat + site/content/mufredat):
        cogr_10_* kayıtlarını canlı havuzlardan yeniden üretir.
     3) Her havuzun topic_key'ini ağaç başlığına eşitler.
     4) İlişki grafiği (3 kopya): cogr_10_* düğümlerini canlı
        başlıklarla günceller, kenarları temizleyip ön koşul
        zincirini kurar.
     5) PWA kopyalarını canlı havuzlarla eşitler, sw.js önbellek
        listesini 18 dosyaya tamamlar.

   Kullanım: node docs/uretim/uretim/cografya-tur2-guncelle.js [--kontrol]
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const KONTROL = process.argv.includes("--kontrol");
const HAVUZ_DIR = path.join(KOK, "site", "content", "soru_havuzlari");

let hata = 0;
const bildir = m => console.log(m);

/* Kitabın içindekiler sırası — 18 konu */
const AGAC = [
  "1.1 Coğrafi Bakış",
  "2.1 CBS ve Uzaktan Algılamanın Uygulama Alanları",
  "2.2 Mekânsal Verilerin Haritalara Aktarılması",
  "3.1 Tektonik Süreçler",
  "3.2 İklim ve Kayaç Yapısının Aşınma ve Çözünme Süreçlerine Etkisi",
  "3.3 Aşınma, Taşınma ve Biriktirme Süreçlerinin Yeryüzünün Şekillenmesine Etkisi",
  "3.4 Yeryüzü Şekilleri ile İlgili Gözlem ve Saha Çalışması",
  "3.5 Yeryüzü Şekilleri ile Beşerî Faaliyetler Arasındaki Etkileşim",
  "4.1 Yerleşmelerin Kuruluşu ve Gelişimi",
  "4.2 Yerleşmelerin Fonksiyonları",
  "5.1 Ekonomik Faaliyetlerin Özellikleri",
  "5.2 Ekonomik Sektörler ve Gelişmişlik",
  "5.3 Türkiye Ekonomisinin Sektörel Dağılımı",
  "6.1 Afetlerle Mücadelede İyi Uygulama Örnekleri",
  "6.2 Afetlere Karşı Dirençli Yaşam Alanları",
  "6.3 Afetlerden Korunma",
  "6.4 Afet Bilinci",
  "7.1 Türk Kültürünün Mekânsal Özellikleri"
];

/* ---- 1) konular.js (iki kopya) ---- */
for (const dosya of [path.join(KOK, "konular.js"), path.join(KOK, "pwa-files", "functions", "konular.js")]) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  let s = fs.readFileSync(dosya, "utf8");
  /* DİKKAT: konular.js içinde 9. ve 10. sınıf olmak üzere iki "Coğrafya"
     bloğu var. Yalnız "10" bölümündeki bloğu hedefle. */
  const on = s.indexOf('"10": {');
  if (on < 0) { bildir("✗ 10. sınıf bölümü yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const m = s.slice(on).match(/  "Coğrafya": \[\n([\s\S]*?)\n  \],/);
  if (!m) { bildir("✗ Coğrafya bloğu bulunamadı: " + path.relative(KOK, dosya)); hata++; continue; }
  m.index += on;
  const mevcut = m[1].split("\n").filter(x => x.trim().startsWith('"')).map(x => x.trim().replace(/^"|",?$/g, ""));
  const yeni = '  "Coğrafya": [\n' + AGAC.map(t => '   "' + t + '"').join(",\n") + "\n  ],";
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
const havuzlar = fs.readdirSync(HAVUZ_DIR).filter(f => /^cogr_10_u\d+_k\d+\.json$/.test(f)).sort();
const kayitlar = havuzlar.map(f => {
  const p = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, f), "utf8"));
  return { konu_id: p.konu_id, konu_adi: numarasiz(p.baslik), sinif: 10, ders: "Coğrafya" };
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
  const ilkYer = d.records.findIndex(r => /^cogr_10_u\d+_k\d+$/.test(String(r.konu_id)));
  if (ilkYer < 0) { bildir("✗ coğrafya kaydı yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const kalan = d.records.filter(r => !/^cogr_10_u\d+_k\d+$/.test(String(r.konu_id)));
  d.records = [...kalan.slice(0, ilkYer), ...kayitlar, ...kalan.slice(ilkYer)];
  if (Array.isArray(d.conflicts)) {
    const once = d.conflicts.length;
    d.conflicts = d.conflicts.filter(c => !/^cogr_10_u\d+_k\d+$/.test(String(c.konu_id)));
    if (!KONTROL && d.conflicts.length !== once) bildir("  çakışma kaydı silindi: " + (once - d.conflicts.length));
  }
  if (!KONTROL) fs.writeFileSync(dosya, JSON.stringify(d, null, 2) + "\n", "utf8");
  bildir("✔ " + path.relative(KOK, dosya) + ": " + kayitlar.length + " coğrafya kaydı");
}

/* ---- 3) topic_key eşitle ---- */
let etiket = 0, eksik = 0;
for (const f of havuzlar) {
  const yol = path.join(HAVUZ_DIR, f);
  const p = JSON.parse(fs.readFileSync(yol, "utf8"));
  if (!AGAC.includes(p.baslik)) { bildir("✗ ağaçta yok: " + p.konu_id + " → " + p.baslik); eksik++; continue; }
  const anahtar = "Coğrafya > " + p.baslik;
  if (p.topic_key === anahtar) continue;
  p.topic_key = anahtar;
  if (!KONTROL) fs.writeFileSync(yol, JSON.stringify(p, null, 2) + "\n", "utf8");
  etiket++;
}
bildir("✔ topic_key eşitlendi: " + etiket + " havuz · ağaçta karşılığı olmayan: " + eksik);
if (eksik) hata += eksik;

/* ---- 4) İlişki grafiği ---- */
const UNITE = {
  "1": "1. Ünite: Coğrafya ve Mekân",
  "2": "2. Ünite: Mekânsal Bilgi Teknolojileri",
  "3": "3. Ünite: Yeryüzünün Şekillenmesi",
  "4": "4. Ünite: Yerleşmeler",
  "5": "5. Ünite: Ekonomik Faaliyetler",
  "6": "6. Ünite: Afetler ve Sürdürülebilir Çevre",
  "7": "7. Ünite: Bölgeler, Ülkeler ve Küresel Bağlantılar"
};
const ZINCIR = [
  ["cogr_10_u01_k01", "cogr_10_u02_k01", "Coğrafi bakış ve mekân kavrayışı kurulmadan CBS'nin uygulama alanları özetlenemez."],
  ["cogr_10_u02_k01", "cogr_10_u02_k02", "CBS ve uzaktan algılama bilinmeden mekânsal veriler altlık haritalara aktarılamaz."],
  ["cogr_10_u01_k01", "cogr_10_u03_k01", "Mekân ve konum kavramları bilinmeden tektonik yapının yer şekillerine etkisi çözümlenemez."],
  ["cogr_10_u03_k01", "cogr_10_u03_k02", "Yerkürenin tektonik yapısı bilinmeden iklim ve kayaç özelliklerinin aşınmaya etkisi kurulamaz."],
  ["cogr_10_u03_k02", "cogr_10_u03_k03", "Aşınma ve çözünme süreçleri bilinmeden aşınım-birikim şekilleri çözümlenemez."],
  ["cogr_10_u03_k03", "cogr_10_u03_k04", "Süreçler bilinmeden yeryüzü şekilleri saha çalışmasıyla araştırılamaz."],
  ["cogr_10_u03_k03", "cogr_10_u03_k05", "Yer şekillerinin oluşumu bilinmeden beşerî faaliyetlerle etkileşimi sorgulanamaz."],
  ["cogr_10_u03_k05", "cogr_10_u04_k01", "Yer şekli-beşerî faaliyet etkileşimi bilinmeden yerleşme yeri seçimi sorgulanamaz."],
  ["cogr_10_u04_k01", "cogr_10_u04_k02", "Yerleşmenin kuruluşu bilinmeden fonksiyonlara göre sınıflandırma yapılamaz."],
  ["cogr_10_u04_k02", "cogr_10_u05_k01", "Yerleşme fonksiyonları bilinmeden ekonomik faaliyetlerin özellikleri sınıflandırılamaz."],
  ["cogr_10_u05_k01", "cogr_10_u05_k02", "Sektörlerin özellikleri bilinmeden gelişmişlik karşılaştırması yorumlanamaz."],
  ["cogr_10_u05_k02", "cogr_10_u05_k03", "Sektörel dağılım okunmadan Türkiye ekonomisinin yapısı grafiklerle gösterilemez."],
  ["cogr_10_u03_k03", "cogr_10_u06_k01", "Doğal süreçlerin yıkıcı etkisi bilinmeden afetlerle mücadele örnekleri sorgulanamaz."],
  ["cogr_10_u06_k01", "cogr_10_u06_k02", "İyi uygulama örnekleri bilinmeden dirençli yaşam alanlarının koşulları çözümlenemez."],
  ["cogr_10_u06_k02", "cogr_10_u06_k03", "Dirençli yaşam alanı koşulları bilinmeden korunma uygulamalarına karar verilemez."],
  ["cogr_10_u06_k03", "cogr_10_u06_k04", "Korunma uygulamaları bilinmeden afet bilincinin faydaları yansıtılamaz."],
  ["cogr_10_u01_k01", "cogr_10_u07_k01", "Coğrafi bakış kazanılmadan Türk kültürünün mekânsal özellikleri çözümlenemez."]
];

for (const dosya of [path.join(KOK, "site", "content", "iliski_grafi.json"),
                     path.join(KOK, "content", "iliski_grafi.json"),
                     path.join(KOK, "pwa-files", "content", "iliski_grafi.json")]) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const g = JSON.parse(fs.readFileSync(dosya, "utf8"));
  g.dugumler = g.dugumler || [];
  g.kenarlar = g.kenarlar || [];

  const eskiKenar = g.kenarlar.length;
  g.kenarlar = g.kenarlar.filter(k => !/^cogr_10_/.test(String(k.kaynak_konu_id)) && !/^cogr_10_/.test(String(k.hedef_konu_id)));

  /* Kitapta karşılığı olmayan eski coğrafya düğümlerini at (u02_k03, u02_k04 gibi) */
  const canliId = new Set(kayitlar.map(k => k.konu_id));
  const oncekiDugum = g.dugumler.length;
  g.dugumler = g.dugumler.filter(d => !/^cogr_10_/.test(String(d.konu_id)) || canliId.has(d.konu_id));
  const atilanDugum = oncekiDugum - g.dugumler.length;

  let dugum = 0, guncel = 0;
  for (const k of kayitlar) {
    const yer = g.dugumler.findIndex(d => d.konu_id === k.konu_id);
    const unite = UNITE[k.konu_id.match(/^cogr_10_u0(\d)_/)[1]];
    if (yer < 0) {
      g.dugumler.push({ konu_id: k.konu_id, konu_adi: k.konu_adi, sinif: 10, ders: "Coğrafya", unite });
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
const PWA = path.join(KOK, "pwa-files", "content", "soru_havuzlari");
if (fs.existsSync(PWA)) {
  for (const f of havuzlar) {
    if (!KONTROL) fs.copyFileSync(path.join(HAVUZ_DIR, f), path.join(PWA, f));
  }
  bildir("✔ PWA kopyası: " + havuzlar.length + " coğrafya havuzu eşitlendi");
}

for (const SW of [path.join(KOK, "sw.js"), path.join(KOK, "site", "sw.js")]) {
  if (!fs.existsSync(SW)) { bildir("✗ yok: " + path.relative(KOK, SW)); hata++; continue; }
  let s = fs.readFileSync(SW, "utf8");
  const satirlar = havuzlar.map(f => '  "./content/soru_havuzlari/' + f.replace(/\.json$/, "") + '.json",');
  const eksikSatir = satirlar.filter(l => !s.includes(l));
  if (eksikSatir.length) {
    const son = [...s.matchAll(/  "\.\/content\/soru_havuzlari\/cogr_10_u\d+_k\d+\.json",\n/g)].pop();
    if (son) {
      const yer = son.index + son[0].length;
      s = s.slice(0, yer) + eksikSatir.join("\n") + "\n" + s.slice(yer);
      if (!KONTROL) fs.writeFileSync(SW, s, "utf8");
      bildir("✔ " + path.relative(KOK, SW) + ": " + eksikSatir.length + " havuz önbellek listesine eklendi");
    } else { bildir("✗ " + path.relative(KOK, SW) + ": coğrafya satırı bulunamadı"); hata++; }
  } else {
    bildir("= " + path.relative(KOK, SW) + " önbellek listesi tam (" + satirlar.length + " coğrafya havuzu)");
  }
}

bildir("canlı coğrafya havuzu: " + havuzlar.length + " · ağaç: " + AGAC.length + " konu");
bildir(hata ? "SONUÇ: " + hata + " hata" : "SONUÇ: tamam");
process.exitCode = hata ? 1 : 0;
