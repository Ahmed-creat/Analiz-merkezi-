#!/usr/bin/env node
/* ============================================================
   KİMYA 10 — 2. TUR: ağaç, kayıt defteri, grafik, PWA
   ------------------------------------------------------------
   Ders kitabı (MEB, 2025) içindekiler düzeyi 19 konu:
     1. Tema Kimyasal Türler ve Etkileşimler → 9 konu (1.1.1–1.2.4)
     2. Tema Çeşitlilik                     → 8 konu (2.1.1–2.1.8)
     3. Tema Sürdürülebilirlik              → 2 konu (3.1.1–3.1.2)

   Yaptığı:
     1) konular.js + pwa-files/functions/konular.js: yalnız
        "10": { ... } bölümündeki Kimya bloğunu 19 satırlık
        kitapla birebir listeyle değiştirir ("Eftizyon" ve
        "Çözünürlğe" yazım hataları düzelir; 9. sınıf ezilmez).
     2) Kayıt defteri (content/mufredat + site/content/mufredat):
        kimya_10_* kayıtlarını canlı havuzlardan yeniden üretir.
     3) Her havuzun topic_key'ini ağaç başlığına eşitler.
     4) İlişki grafiği: kimya_10_* düğümlerini canlı başlıklarla
        günceller, kenarları temizleyip ön koşul zincirini kurar.
     5) PWA kopyalarını canlı havuzlarla eşitler, sw.js önbellek
        listesini 19 dosyaya tamamlar.

   Kullanım: node docs/uretim/uretim/kimya-tur2-guncelle.js [--kontrol]
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
  "1.1.1 Kimyasal Tepkimelerin Oluşumu",
  "1.1.2 Kimyasal Tepkime Türleri",
  "1.1.3 Mol Kavramı",
  "1.1.4 Kimyasal Tepkime Denklemlerinin Denkleştirilmesi",
  "1.1.5 Kimyasal (Stokiyometrik) Hesaplamalar",
  "1.2.1 Gazların Özellikleri ve Gaz Yasaları",
  "1.2.2 Gazların Kinetik Moleküler Teorisi",
  "1.2.3 İdeal Gaz Yasası",
  "1.2.4 Graham Difüzyon ve Efüzyon Yasası",
  "2.1.1 Çözünme Süreci",
  "2.1.2 Maddelerin Birbiri İçindeki Çözünebilirliği",
  "2.1.3 Çözünme Olayının Sınıflandırılması",
  "2.1.4 Derişim Birimleri (Molarite, ppm)",
  "2.1.5 Çözünürlük",
  "2.1.6 Çözünürlüğe Etki Eden Faktörler",
  "2.1.7 Çözeltilerin Sınıflandırılması",
  "2.1.8 Koligatif Özellikler",
  "3.1.1 Makro ve Mikro Ölçekli Deneyler",
  "3.1.2 Atmosferdeki Tepkimeler ve Küresel Sorunlar"
];

/* ---- 1) konular.js (iki kopya) ---- */
for (const dosya of [path.join(KOK, "konular.js"), path.join(KOK, "pwa-files", "functions", "konular.js")]) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  let s = fs.readFileSync(dosya, "utf8");
  /* DİKKAT: konular.js içinde 9. ve 10. sınıf olmak üzere iki "Kimya"
     bloğu var. Yalnız "10" bölümündeki bloğu hedefle. */
  const on = s.indexOf('"10": {');
  if (on < 0) { bildir("✗ 10. sınıf bölümü yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const m = s.slice(on).match(/  "Kimya": \[\n([\s\S]*?)\n  \],/);
  if (!m) { bildir("✗ Kimya bloğu bulunamadı: " + path.relative(KOK, dosya)); hata++; continue; }
  m.index += on;
  const mevcut = m[1].split("\n").filter(x => x.trim().startsWith('"')).map(x => x.trim().replace(/^"|",?$/g, ""));
  const yeni = '  "Kimya": [\n' + AGAC.map(t => '   "' + t + '"').join(",\n") + "\n  ],";
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
const havuzlar = fs.readdirSync(HAVUZ_DIR).filter(f => /^kimya_10_u\d+_k\d+\.json$/.test(f)).sort();
const kayitlar = havuzlar.map(f => {
  const p = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, f), "utf8"));
  return { konu_id: p.konu_id, konu_adi: numarasiz(p.baslik), sinif: 10, ders: "Kimya" };
});

for (const dosya of [path.join(KOK, "content", "mufredat", "konu_kayit_defteri.json"),
                     path.join(KOK, "site", "content", "mufredat", "konu_kayit_defteri.json")]) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const d = JSON.parse(fs.readFileSync(dosya, "utf8"));
  if (!Array.isArray(d.records)) { bildir("✗ records yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const ilkYer = d.records.findIndex(r => /^kimya_10_u\d+_k\d+$/.test(String(r.konu_id)));
  if (ilkYer < 0) { bildir("✗ kimya kaydı yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const kalan = d.records.filter(r => !/^kimya_10_u\d+_k\d+$/.test(String(r.konu_id)));
  d.records = [...kalan.slice(0, ilkYer), ...kayitlar, ...kalan.slice(ilkYer)];
  if (!KONTROL) fs.writeFileSync(dosya, JSON.stringify(d, null, 2) + "\n", "utf8");
  bildir("✔ " + path.relative(KOK, dosya) + ": " + kayitlar.length + " kimya kaydı");
}

/* ---- 3) topic_key eşitle ---- */
let etiket = 0, eksik = 0;
for (const f of havuzlar) {
  const yol = path.join(HAVUZ_DIR, f);
  const p = JSON.parse(fs.readFileSync(yol, "utf8"));
  if (!AGAC.includes(p.baslik)) { bildir("✗ ağaçta yok: " + p.konu_id + " → " + p.baslik); eksik++; continue; }
  const anahtar = "Kimya > " + p.baslik;
  if (p.topic_key === anahtar) continue;
  p.topic_key = anahtar;
  if (!KONTROL) fs.writeFileSync(yol, JSON.stringify(p, null, 2) + "\n", "utf8");
  etiket++;
}
bildir("✔ topic_key eşitlendi: " + etiket + " havuz · ağaçta karşılığı olmayan: " + eksik);
if (eksik) hata += eksik;

/* ---- 4) İlişki grafiği ---- */
const UNITE = {
  "1": "1. Ünite: Kimyasal Türler ve Etkileşimler",
  "2": "2. Ünite: Çeşitlilik",
  "3": "3. Ünite: Sürdürülebilirlik"
};
const ZINCIR = [
  ["kimya_10_u01_k01", "kimya_10_u01_k02", "Tepkimenin oluşumu ve kanıtları bilinmeden tepkime türleri sınıflandırılamaz."],
  ["kimya_10_u01_k03", "kimya_10_u01_k05", "Mol kavramı ve mol kütlesi hesaplanmadan stokiyometrik hesaplama yapılamaz."],
  ["kimya_10_u01_k04", "kimya_10_u01_k05", "Denklem denkleştirilmeden mol oranları ve stokiyometri kurulamaz."],
  ["kimya_10_u01_k06", "kimya_10_u01_k07", "Gazların özellikleri ve gaz yasaları bilinmeden kinetik moleküler teori yorumlanamaz."],
  ["kimya_10_u01_k06", "kimya_10_u01_k08", "Gaz yasaları bilinmeden ideal gaz denklemi türetilemez."],
  ["kimya_10_u01_k07", "kimya_10_u01_k09", "Kinetik moleküler teoride tanecik hızı kavranmadan difüzyon-efüzyon açıklanamaz."],
  ["kimya_10_u01_k08", "kimya_10_u01_k09", "İdeal gaz denkleminde mol kütlesi ilişkisi kurulmadan Graham yasası hesaplanamaz."],
  ["kimya_10_u02_k01", "kimya_10_u02_k02", "Çözünme süreci ve etkileşimler anlaşılmadan maddelerin birbiri içinde çözünebilirliği açıklanamaz."],
  ["kimya_10_u02_k02", "kimya_10_u02_k03", "Polar-apolar çözünürlük bilgisi olmadan iyonik/moleküler çözünme ayırt edilemez."],
  ["kimya_10_u02_k03", "kimya_10_u02_k04", "İyonlaşma bilinmeden derişim ve elektrolit davranışı hesaplanamaz."],
  ["kimya_10_u02_k04", "kimya_10_u02_k05", "Derişim birimleri bilinmeden çözünürlük nicel olarak ifade edilemez."],
  ["kimya_10_u02_k05", "kimya_10_u02_k06", "Çözünürlük tanımı kurulmadan çözünürlüğe etki eden faktörler yorumlanamaz."],
  ["kimya_10_u02_k05", "kimya_10_u02_k07", "Doyma kavramı bilinmeden doymuş/aşırı doymuş çözelti sınıflandırılamaz."],
  ["kimya_10_u02_k07", "kimya_10_u02_k08", "Çözeltilerin sınıflandırılması bilinmeden koligatif özellikler tanecik sayısıyla ilişkilendirilemez."],
  ["kimya_10_u01_k05", "kimya_10_u03_k01", "Tepkime hesaplamaları bilinmeden atom ekonomisi ve deney ölçeği karşılaştırılamaz."],
  ["kimya_10_u03_k01", "kimya_10_u03_k02", "Makro/mikro ölçek ve emisyon değerlendirmesi olmadan atmosferdeki tepkimelerin küresel etkisi tartışılamaz."]
];

for (const dosya of [path.join(KOK, "content", "iliski_grafi.json"),
                     path.join(KOK, "pwa-files", "content", "iliski_grafi.json")]) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const g = JSON.parse(fs.readFileSync(dosya, "utf8"));
  g.dugumler = g.dugumler || [];
  g.kenarlar = g.kenarlar || [];

  /* Kenarları temizle: kimya_10 düğümlerine değen eski kenarlar yeniden kurulur */
  const eskiKenar = g.kenarlar.length;
  g.kenarlar = g.kenarlar.filter(k => !/^kimya_10_/.test(String(k.kaynak_konu_id)) && !/^kimya_10_/.test(String(k.hedef_konu_id)));

  let dugum = 0, guncel = 0;
  for (const k of kayitlar) {
    const yer = g.dugumler.findIndex(d => d.konu_id === k.konu_id);
    const unite = UNITE[k.konu_id.match(/^kimya_10_u0(\d)_/)[1]];
    if (yer < 0) {
      g.dugumler.push({ konu_id: k.konu_id, konu_adi: k.konu_adi, sinif: 10, ders: "Kimya", unite });
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
  bildir("✔ PWA kopyası: " + havuzlar.length + " kimya havuzu eşitlendi");
}

const SW = path.join(KOK, "sw.js");
if (fs.existsSync(SW)) {
  let s = fs.readFileSync(SW, "utf8");
  const satirlar = havuzlar.map(f => '  "./content/soru_havuzlari/' + f.replace(/\.json$/, "") + '.json",');
  const eksikSatir = satirlar.filter(l => !s.includes(l));
  if (eksikSatir.length) {
    const son = [...s.matchAll(/  "\.\/content\/soru_havuzlari\/kimya_10_u\d+_k\d+\.json",\n/g)].pop();
    if (son) {
      const yer = son.index + son[0].length;
      s = s.slice(0, yer) + eksikSatir.join("\n") + "\n" + s.slice(yer);
      if (!KONTROL) fs.writeFileSync(SW, s, "utf8");
      bildir("✔ sw.js: " + eksikSatir.length + " havuz önbellek listesine eklendi");
    } else { bildir("✗ sw.js: kimya satırı bulunamadı"); hata++; }
  } else {
    bildir("= sw.js önbellek listesi tam (" + satirlar.length + " kimya havuzu)");
  }
}

bildir("canlı kimya havuzu: " + havuzlar.length + " · ağaç: " + AGAC.length + " konu");
bildir(hata ? "SONUÇ: " + hata + " hata" : "SONUÇ: tamam");
process.exitCode = hata ? 1 : 0;
