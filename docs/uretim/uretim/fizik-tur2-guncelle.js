#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — 2. TUR: ağacı kitabın ALT KONULARIYLA tamamla
   ------------------------------------------------------------
   Ders kitabı (MEB, 2025) içindekiler düzeyi:
     2.1 İş, Enerji ve Güç  →  A) s.110-126   B) s.127-142
     4.6 Rezonans ve Deprem →  A) s.323-331   B) s.332-338
   Bu iki konu alt konulara ayrılır; kalan 18 havuz kitaptan
   yeniden yazıldığı için ağaç 23 → 25 konu olur.

   Yaptığı:
     1) konular.js + pwa-files/functions/konular.js: Fizik bloğunu
        25 satırlık kitapla birebir listeyle değiştirir.
     2) Kayıt defteri (content/mufredat + site/content/mufredat):
        fizik_10_* kayıtlarını canlı havuzlardan yeniden üretir.
     3) Her havuzun topic_key'ini ağaç başlığına eşitler.
     4) İlişki grafiği: eksik düğümleri ekler (fizik_10_u02_k05,
        fizik_10_u04_k07) ve alt konu zinciri kenarlarını kurar.
     5) PWA kopyalarını canlı havuzlarla eşitler, sw.js önbellek
        listesini 25 dosyaya tamamlar.

   Kullanım: node docs/uretim/uretim/fizik-tur2-guncelle.js [--kontrol]
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const KONTROL = process.argv.includes("--kontrol");
const HAVUZ_DIR = path.join(KOK, "site", "content", "soru_havuzlari");

let hata = 0;
const bildir = m => console.log(m);

/* Kitabın içindekiler sırası — 25 konu */
const AGAC = [
  "1.1 Sabit Hızlı Hareket",
  "1.2.1 İvme ve Hız Değişimi Arasındaki İlişki",
  "1.2.2 Yatay Doğrultuda Sabit İvmeyle Hareket Eden Cisimlerin Hareketi",
  "1.3.1 Düşey Doğrultuda Cisimlerin Sahip Olduğu İvme",
  "1.3.2 Serbest Düşme Hareketi",
  "1.4 İki Boyutta Sabit İvmeli Hareket",
  "2.1.1 Kuvvet-Yer Değiştirme Grafiği Kullanılarak İş Kavramının Tanımlanması",
  "2.1.2 İş, Enerji ve Güç Kavramları Arasındaki İlişki",
  "2.2 Enerji Biçimleri",
  "2.3 Mekanik Enerji",
  "2.4 Enerji Kaynakları",
  "3.1 Basit Elektrik Devreleri",
  "3.2 Elektrik Akımı",
  "3.3 Ohm Yasası",
  "3.4 Dirençlerin Bağlanması",
  "3.5 Üreteçlerin Bağlanması",
  "3.6 Elektrik Akımının Oluşturabileceği Tehlikelere Karşı Alınması Gereken Önlemler",
  "3.7 Topraklamanın Önemi",
  "4.1 Dalgaların Temel Kavramları",
  "4.2 Dalgaların Sınıflandırılması",
  "4.3 Dalgaların Yayılma Süratini Etkileyen Etmenler",
  "4.4 Periyodik Hareketler",
  "4.5 Su Dalgalarında Yansıma ve Kırılma",
  "4.6.1 Rezonans ve Depremle İlgili Kavramlar",
  "4.6.2 Depremle İlgili Bilimsel Model Oluşturabilme"
];

/* ---- 1) konular.js (iki kopya) ---- */
for (const dosya of [path.join(KOK, "konular.js"), path.join(KOK, "pwa-files", "functions", "konular.js")]) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  let s = fs.readFileSync(dosya, "utf8");
  /* DİKKAT: konular.js içinde 9. ve 10. sınıf olmak üzere iki "Fizik"
     bloğu var. Yalnız "10" bölümündeki bloğu hedefle. */
  const on = s.indexOf('"10": {');
  if (on < 0) { bildir("✗ 10. sınıf bölümü yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const m = s.slice(on).match(/  "Fizik": \[\n([\s\S]*?)\n  \],/);
  if (!m) { bildir("✗ Fizik bloğu bulunamadı: " + path.relative(KOK, dosya)); hata++; continue; }
  m.index += on; m[0] = m[0];
  const mevcut = m[1].split("\n").filter(x => x.trim().startsWith('"')).map(x => x.trim().replace(/^"|",?$/g, ""));
  const yeni = '  "Fizik": [\n' + AGAC.map(t => '   "' + t + '"').join(",\n") + "\n  ],";
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
const havuzlar = fs.readdirSync(HAVUZ_DIR).filter(f => /^fizik_10_u\d+_k\d+\.json$/.test(f)).sort();
const kayitlar = havuzlar.map(f => {
  const p = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, f), "utf8"));
  return { konu_id: p.konu_id, konu_adi: numarasiz(p.baslik), sinif: 10, ders: "Fizik" };
});

for (const dosya of [path.join(KOK, "content", "mufredat", "konu_kayit_defteri.json"),
                     path.join(KOK, "site", "content", "mufredat", "konu_kayit_defteri.json")]) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const d = JSON.parse(fs.readFileSync(dosya, "utf8"));
  if (!Array.isArray(d.records)) { bildir("✗ records yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const ilkYer = d.records.findIndex(r => /^fizik_10_u\d+_k\d+$/.test(String(r.konu_id)));
  if (ilkYer < 0) { bildir("✗ fizik kaydı yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const kalan = d.records.filter(r => !/^fizik_10_u\d+_k\d+$/.test(String(r.konu_id)));
  d.records = [...kalan.slice(0, ilkYer), ...kayitlar, ...kalan.slice(ilkYer)];
  if (!KONTROL) fs.writeFileSync(dosya, JSON.stringify(d, null, 2) + "\n", "utf8");
  bildir("✔ " + path.relative(KOK, dosya) + ": " + kayitlar.length + " fizik kaydı");
}

/* ---- 3) topic_key eşitle ---- */
let etiket = 0, eksik = 0;
for (const f of havuzlar) {
  const yol = path.join(HAVUZ_DIR, f);
  const p = JSON.parse(fs.readFileSync(yol, "utf8"));
  if (!AGAC.includes(p.baslik)) { bildir("✗ ağaçta yok: " + p.konu_id + " → " + p.baslik); eksik++; continue; }
  const anahtar = "Fizik > " + p.baslik;
  if (p.topic_key === anahtar) continue;
  p.topic_key = anahtar;
  if (!KONTROL) fs.writeFileSync(yol, JSON.stringify(p, null, 2) + "\n", "utf8");
  etiket++;
}
bildir("✔ topic_key eşitlendi: " + etiket + " havuz · ağaçta karşılığı olmayan: " + eksik);
if (eksik) hata += eksik;

/* ---- 4) İlişki grafiği ---- */
const UNITE = {
  "1": "1. Ünite: Kuvvet ve Hareket",
  "2": "2. Ünite: Enerji",
  "3": "3. Ünite: Elektrik",
  "4": "4. Ünite: Dalgalar"
};
const ZINCIR = [
  ["fizik_10_u02_k01", "fizik_10_u02_k05", "Kuvvet-yer değiştirme grafiğinden iş kavramı anlaşılmadan iş-enerji-güç ilişkisi ve güç hesabı kurulamaz."],
  ["fizik_10_u02_k05", "fizik_10_u02_k03", "İş-enerji ilişkisi ve güç kavramı bilinmeden mekanik enerjinin korunumu ve enerji dönüşümleri çözümlenemez."],
  ["fizik_10_u02_k05", "fizik_10_u02_k02", "İş ve enerji ilişkisi kurulmadan enerji biçimleri arasındaki dönüşümler anlamlandırılamaz."],
  ["fizik_10_u02_k02", "fizik_10_u02_k04", "Enerji biçimleri tanınmadan enerji kaynaklarının sınıflandırılması ve sürdürülebilirlik değerlendirmesi yapılamaz."],
  ["fizik_10_u04_k06", "fizik_10_u04_k07", "Rezonans ve deprem kavramları (odak, merkez üssü, büyüklük, şiddet) bilinmeden sismograf ve sismik izolatör modelleri açıklanamaz."]
];

for (const dosya of [path.join(KOK, "content", "iliski_grafi.json"),
                     path.join(KOK, "pwa-files", "content", "iliski_grafi.json")]) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const g = JSON.parse(fs.readFileSync(dosya, "utf8"));
  const dugumler = g.dugumler || [];
  let eklenen = 0;
  for (const k of kayitlar) {
    if (dugumler.some(d => d.konu_id === k.konu_id)) continue;
    const unite = UNITE[k.konu_id.match(/^fizik_10_u0(\d)_/)[1]];
    dugumler.push({ konu_id: k.konu_id, konu_adi: k.konu_adi, sinif: 10, ders: "Fizik", unite });
    eklenen++;
  }
  g.dugumler = dugumler;
  g.kenarlar = g.kenarlar || [];
  const var_ = new Set(g.kenarlar.map(k => k.kaynak_konu_id + "→" + k.hedef_konu_id + ":" + k.iliski_tipi));
  for (const [a, b, gerekce] of ZINCIR) {
    const anahtar = a + "→" + b + ":SERT_ONKOSUL";
    if (var_.has(anahtar)) continue;
    if (!dugumler.some(d => d.konu_id === a) || !dugumler.some(d => d.konu_id === b)) continue;
    g.kenarlar.push({ kaynak_konu_id: a, hedef_konu_id: b, iliski_tipi: "SERT_ONKOSUL", agirlik: 0.9, gerekce });
    var_.add(anahtar);
  }
  if (!KONTROL) fs.writeFileSync(dosya, JSON.stringify(g, null, 2) + "\n", "utf8");
  bildir("✔ " + path.relative(KOK, dosya) + ": " + g.dugumler.length + " düğüm · " + g.kenarlar.length + " kenar (+" + eklenen + " düğüm)");
}

/* ---- 5) PWA kopyaları + sw.js ---- */
const PWA = path.join(KOK, "pwa-files", "content", "soru_havuzlari");
if (fs.existsSync(PWA)) {
  for (const f of havuzlar) {
    if (!KONTROL) fs.copyFileSync(path.join(HAVUZ_DIR, f), path.join(PWA, f));
  }
  bildir("✔ PWA kopyası: " + havuzlar.length + " fizik havuzu eşitlendi");
}

const SW = path.join(KOK, "sw.js");
if (fs.existsSync(SW)) {
  let s = fs.readFileSync(SW, "utf8");
  const satirlar = havuzlar.map(f => '  "./content/soru_havuzlari/' + f.replace(/\.json$/, "") + '.json",');
  const eksikSatir = satirlar.filter(l => !s.includes(l));
  if (eksikSatir.length) {
    /* mevcut fizik satırlarından sonra ekle */
    const sonFizik = [...s.matchAll(/  "\.\/content\/soru_havuzlari\/fizik_10_u\d+_k\d+\.json",\n/g)].pop();
    if (sonFizik) {
      const yer = sonFizik.index + sonFizik[0].length;
      s = s.slice(0, yer) + eksikSatir.join("\n") + "\n" + s.slice(yer);
      if (!KONTROL) fs.writeFileSync(SW, s, "utf8");
      bildir("✔ sw.js: " + eksikSatir.length + " havuz önbellek listesine eklendi");
    } else { bildir("✗ sw.js: fizik satırı bulunamadı"); hata++; }
  } else {
    bildir("= sw.js önbellek listesi tam (" + satirlar.length + " fizik havuzu)");
  }
}

bildir("canlı fizik havuzu: " + havuzlar.length + " · ağaç: " + AGAC.length + " konu");
bildir(hata ? "SONUÇ: " + hata + " hata" : "SONUÇ: tamam");
process.exitCode = hata ? 1 : 0;
