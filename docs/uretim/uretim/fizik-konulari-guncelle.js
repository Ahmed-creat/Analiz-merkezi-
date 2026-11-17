#!/usr/bin/env node
/* ============================================================
   FİZİK 10 — konu ağacını ders kitabının ALT KONULARINA göre kurar
   ------------------------------------------------------------
   Sorun: uygulamanın 10. sınıf Fizik ağacı kitabın ünite/konu
   başlıklarını tek satırda tutuyordu ("1.3 Serbest Düşme",
   "1.2 Bir Boyutta Sabit İvmeli Hareket"). Ders kitabı ise bu
   konuları A) ve B) alt başlıklarına ayırıyor. Alt konu olmadan
   aynı başlık altında iki havuz kalıyor ve uygulama soruları
   yanlış konuya bağlıyor.

   Kaynak: MEB Fizik 10 ders kitabı (2025) içindekiler, s.7-8:
       1.1. Sabit Hızlı Hareket                         s.16
       1.2. Bir Boyutta Sabit İvmeli Hareket            s.33
         A) İvme ve Hız Değişimi Arasındaki İlişki      s.33
         B) Yatay Doğrultuda Sabit İvmeyle Hareket Eden
            Cisimlerin Hareketi                         s.43
       1.3. Serbest Düşme                               s.60
         A) Düşey Doğrultuda Cisimlerin Sahip Olduğu İvme s.60
         B) Serbest Düşme Hareketi                       s.67
       1.4. İki Boyutta Sabit İvmeli Hareket             s.78
       (2-4. üniteler bu turda değiştirilmedi; sonraki turda
        aynı yöntemle alt konulara ayrılacak.)

   Yaptığı:
     1) konular.js ve pwa-files/functions/konular.js içindeki
        10. sınıf Fizik listesinin 1. ünite satırlarını alt
        konularla değiştirir (2-4. üniteler aynen kalır).
     2) Eski tek konulu havuzları (fizik_10_u01_k02, _k03, _k04)
        arsiv/soru_havuzlari/fizik/ altına TAŞIR (silmez).
     3) Bilgi Bankası kayıt defterindeki fizik_10_* kayıtlarını,
        canlı havuz dosyalarından yeniden üretir: konu_id = havuz
        kimliği, konu_adi = numarasız başlık.
     4) Her canlı fizik havuzunun topic_key'ini ağaç başlığıyla
        eşitler ve tutmayanı bildirir.

   Kullanım:
     node docs/uretim/uretim/fizik-konulari-guncelle.js --kontrol
     node docs/uretim/uretim/fizik-konulari-guncelle.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const KONTROL = process.argv.includes("--kontrol");
const HAVUZ_DIR = path.join(KOK, "site", "content", "soru_havuzlari");
const ARSIV_DIR = path.join(KOK, "arsiv", "soru_havuzlari", "fizik");

let hata = 0;
const bildir = m => console.log(m);

/* Ders kitabı sırasıyla 10. sınıf Fizik ağacı (1. ünite alt konulu) */
const FIZIK_KONULARI = [
  "1.1 Sabit Hızlı Hareket",
  "1.2.1 İvme ve Hız Değişimi Arasındaki İlişki",
  "1.2.2 Yatay Doğrultuda Sabit İvmeyle Hareket Eden Cisimlerin Hareketi",
  "1.3.1 Düşey Doğrultuda Cisimlerin Sahip Olduğu İvme",
  "1.3.2 Serbest Düşme Hareketi",
  "1.4 İki Boyutta Sabit İvmeli Hareket",
  "2.1 İş, Enerji ve Güç",
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
  "4.6 Rezonans ve Deprem"
];

/* Eski ağaçtaki 21 satır (1. ünite tek konulu) */
const ESKI_LISTE = [
  "1.1 Sabit Hızlı Hareket",
  "1.2 Bir Boyutta Sabit İvmeli Hareket",
  "1.3 Serbest Düşme",
  "1.4 İki Boyutta Sabit İvmeli Hareket",
  "2.1 İş, Enerji ve Güç",
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
  "4.6 Rezonans ve Deprem"
];

/* ---- 1) konular.js (iki kopya) ---- */
const KONULAR_DOSYALARI = [
  path.join(KOK, "konular.js"),
  path.join(KOK, "pwa-files", "functions", "konular.js")
];

const eskiBlok = '  "Fizik": [\n' +
  ESKI_LISTE.map(t => '   "' + t + '"').join(",\n") + "\n  ],";
const yeniBlok = '  "Fizik": [\n' +
  FIZIK_KONULARI.map(t => '   "' + t + '"').join(",\n") + "\n  ],";

for (const dosya of KONULAR_DOSYALARI) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + dosya); hata++; continue; }
  let s = fs.readFileSync(dosya, "utf8");
  if (s.includes(yeniBlok)) { bildir("= zaten güncel: " + path.relative(KOK, dosya)); continue; }
  const adet = s.split(eskiBlok).length - 1;
  if (adet !== 1) {
    bildir("✗ " + path.relative(KOK, dosya) + ": eski blok " + adet + " kez bulundu (1 bekleniyordu)");
    hata++;
    continue;
  }
  s = s.replace(eskiBlok, yeniBlok);
  if (!KONTROL) fs.writeFileSync(dosya, s, "utf8");
  bildir("✔ " + path.relative(KOK, dosya) + ": " + ESKI_LISTE.length + " konu → " + FIZIK_KONULARI.length + " konu");
}

/* ---- 2) Eski tek konulu havuzları arşive taşı ----
   fizik_10_u01_k02 → 1.2 (tek konu, iki alt başlık birlikte)
   fizik_10_u01_k03 → 1.3 (tek konu, iki alt başlık birlikte)
   fizik_10_u01_k04 → 1.4 (kitap sayfası künyesi yoktu)
   Yerlerine 1.2.1/1.2.2/1.3.1/1.3.2/1.4 havuzları kitaptan yazıldı. */
const ARSIVLE = ["fizik_10_u01_k02", "fizik_10_u01_k03", "fizik_10_u01_k04"];
for (const id of ARSIVLE) {
  const kaynak = path.join(HAVUZ_DIR, id + ".json");
  const hedef = path.join(ARSIV_DIR, id + ".json");
  if (!fs.existsSync(kaynak)) {
    if (fs.existsSync(hedef)) bildir("= arşivde zaten var: " + id);
    else { bildir("✗ havuz yok: " + id); hata++; }
    continue;
  }
  if (!KONTROL) {
    fs.mkdirSync(ARSIV_DIR, { recursive: true });
    fs.renameSync(kaynak, hedef);
  }
  bildir("✔ arşive taşındı: " + id);
}

/* ---- 3) Kayıt defteri: canlı havuzlardan yeniden üret ---- */
const numarasiz = t => String(t).replace(/^\d+(\.\d+)*\s*/, "").trim();

const havuzlar = fs.readdirSync(HAVUZ_DIR)
  .filter(f => /^fizik_10_u\d+_k\d+\.json$/.test(f))
  .filter(f => !(KONTROL && ARSIVLE.includes(f.replace(/\.json$/, ""))))
  .sort();

const yeniKayitlar = havuzlar.map(f => {
  const p = JSON.parse(fs.readFileSync(path.join(HAVUZ_DIR, f), "utf8"));
  return {
    konu_id: p.konu_id,
    konu_adi: numarasiz(p.baslik),
    sinif: 10,
    ders: "Fizik"
  };
});

const DEFTERLER = [
  path.join(KOK, "content", "mufredat", "konu_kayit_defteri.json"),
  path.join(KOK, "site", "content", "mufredat", "konu_kayit_defteri.json")
];

for (const dosya of DEFTERLER) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
  const defter = JSON.parse(fs.readFileSync(dosya, "utf8"));
  const kayitlar = Array.isArray(defter.records) ? defter.records : [];
  const ilkYer = kayitlar.findIndex(r => /^fizik_10_u\d+_k\d+$/.test(String(r.konu_id)));
  if (ilkYer < 0) { bildir("✗ " + path.relative(KOK, dosya) + ": fizik_10 kaydı yok"); hata++; continue; }
  const kalan = kayitlar.filter(r => !/^fizik_10_u\d+_k\d+$/.test(String(r.konu_id)));
  const eskiAdet = kayitlar.length - kalan.length;
  defter.records = [...kalan.slice(0, ilkYer), ...yeniKayitlar, ...kalan.slice(ilkYer)];
  /* Eski tek konulu havuzların "çakışma" kayıtları da düşer. */
  if (Array.isArray(defter.conflicts)) {
    const once = defter.conflicts.length;
    defter.conflicts = defter.conflicts.filter(c => !ARSIVLE.includes(String(c.konu_id)));
    if (once !== defter.conflicts.length) bildir("✔ çakışma listesi: " + (once - defter.conflicts.length) + " eski kayıt düştü");
  }
  if (!KONTROL) fs.writeFileSync(dosya, JSON.stringify(defter, null, 2) + "\n", "utf8");
  bildir("✔ " + path.relative(KOK, dosya) + ": " + eskiAdet + " fizik kaydı → " + yeniKayitlar.length);
}

/* ---- 4) Ağaç ↔ havuz bağı (topic_key) ---- */
let etiket = 0, uyusmayan = 0;
for (const f of havuzlar) {
  const yol = path.join(HAVUZ_DIR, f);
  const p = JSON.parse(fs.readFileSync(yol, "utf8"));
  const baslik = FIZIK_KONULARI.find(t => t === p.baslik);
  if (!baslik) {
    bildir("✗ ağaçta yok: " + p.konu_id + " → " + p.baslik);
    uyusmayan++;
    continue;
  }
  const anahtar = "Fizik > " + baslik;
  if (p.topic_key === anahtar) continue;
  p.topic_key = anahtar;
  if (!KONTROL) fs.writeFileSync(yol, JSON.stringify(p, null, 2) + "\n", "utf8");
  etiket++;
}
bildir("✔ topic_key eşitlendi: " + etiket + " havuz · ağaçta karşılığı olmayan: " + uyusmayan);
if (uyusmayan) hata += uyusmayan;

/* ---- 5) Özet ---- */
try {
  delete require.cache[require.resolve(path.join(KOK, "konular.js"))];
  const { KONULAR } = require(path.join(KOK, "konular.js"));
  const agac = KONULAR["10"]["Fizik"] || [];
  const ayni = agac.length === FIZIK_KONULARI.length && agac.every((t, i) => t === FIZIK_KONULARI[i]);
  bildir((ayni ? "✔" : "✗") + " konular.js 10. sınıf Fizik: " + agac.length + " konu");
  if (!ayni) hata++;

  const pwa = fs.readFileSync(path.join(KOK, "pwa-files", "functions", "konular.js"), "utf8");
  const blokAyni = pwa.includes(yeniBlok);
  bildir((blokAyni ? "✔" : "✗") + " pwa-files/functions/konular.js blok eşleşmesi");
  if (!blokAyni) hata++;
} catch (e) {
  bildir("✗ konular.js okunamadı: " + e.message);
  hata++;
}

bildir("canlı fizik havuzu: " + havuzlar.length);
bildir(hata ? "SONUÇ: " + hata + " hata" : "SONUÇ: tamam");
process.exitCode = hata ? 1 : 0;

/* ---- 6) İlişki grafiği: düğüm ve kenarları yeni konulara taşı ----
   Grafik, konu bağımlılıklarını (SERT_ONKOSUL / YUMUSAK_TRANSFER) tutar.
   Eski tek konulu 1.2 / 1.3 / 1.4 düğümleri kaldırılır, yerine alt
   konular eklenir. Kenarlar yeni kimliklere yönlendirilir; alt konular
   arasındaki sıra bağı da eklenir. */
const GRAF_DOSYALARI = [
  path.join(KOK, "content", "iliski_grafi.json"),
  path.join(KOK, "pwa-files", "content", "iliski_grafi.json")
];
const GRAF_ESLEME = {
  fizik_10_u01_k02: "fizik_10_u01_k05",
  fizik_10_u01_k03: "fizik_10_u01_k07",
  fizik_10_u01_k04: "fizik_10_u01_k09"
};
const YENI_ZINCIR = [
  ["fizik_10_u01_k05", "fizik_10_u01_k06", "İvme ile hız değişimi arasındaki ilişki kurulmadan yatay doğrultuda sabit ivmeli hareketin modelleri (v = v₀ + a·t, x = v₀·t + ½·a·t²) anlaşılamaz."],
  ["fizik_10_u01_k06", "fizik_10_u01_k07", "Yatay doğrultuda sabit ivmeli hareketin modelleri ve grafikleri bilinmeden düşey doğrultudaki yer çekimi ivmesiyle hareket çözümlenemez."],
  ["fizik_10_u01_k07", "fizik_10_u01_k08", "Yer çekimi ivmesinin (g) tanımı ve kütleden bağımsızlığı bilinmeden serbest düşme hareketinin matematiksel modelleri ve grafikleri yorumlanamaz."],
  ["fizik_10_u01_k08", "fizik_10_u01_k09", "Düşey doğrultudaki serbest düşme hareketi bilinmeden iki boyutta sabit ivmeli hareketin düşey bileşeni çözümlenemez."]
];

try {
  const kayitHaritasi = new Map(yeniKayitlar.map(k => [k.konu_id, k]));
  const uniteAdi = (() => {
    for (const dosya of GRAF_DOSYALARI) {
      if (!fs.existsSync(dosya)) continue;
      const g = JSON.parse(fs.readFileSync(dosya, "utf8"));
      const d = (g.dugumler || []).find(x => x.konu_id === "fizik_10_u01_k01");
      if (d && d.unite) return d.unite;
    }
    return "1. Ünite: Kuvvet ve Hareket";
  })();

  for (const dosya of GRAF_DOSYALARI) {
    if (!fs.existsSync(dosya)) { bildir("✗ yok: " + path.relative(KOK, dosya)); hata++; continue; }
    const g = JSON.parse(fs.readFileSync(dosya, "utf8"));
    const dugumler = g.dugumler || [];
    const ilkYer = dugumler.findIndex(d => d.konu_id === "fizik_10_u01_k02");
    if (ilkYer < 0) { bildir("= grafik zaten güncel: " + path.relative(KOK, dosya)); continue; }

    const kalanDugum = dugumler.filter(d => !GRAF_ESLEME[d.konu_id]);
    const yeniDugumler = ["fizik_10_u01_k05", "fizik_10_u01_k06", "fizik_10_u01_k07", "fizik_10_u01_k08", "fizik_10_u01_k09"]
      .filter(id => kayitHaritasi.has(id))
      .map(id => {
        const k = kayitHaritasi.get(id);
        return { konu_id: k.konu_id, konu_adi: k.konu_adi, sinif: 10, ders: "Fizik", unite: uniteAdi };
      });
    g.dugumler = [...kalanDugum.slice(0, ilkYer), ...yeniDugumler, ...kalanDugum.slice(ilkYer)];

    const cevher = new Set();
    const kenarlar = [];
    for (const k of (g.kenarlar || [])) {
      const kaynak = GRAF_ESLEME[k.kaynak_konu_id] || k.kaynak_konu_id;
      const hedef = GRAF_ESLEME[k.hedef_konu_id] || k.hedef_konu_id;
      const anahtar = kaynak + "→" + hedef + ":" + k.iliski_tipi;
      if (cevher.has(anahtar)) continue;
      cevher.add(anahtar);
      kenarlar.push({ ...k, kaynak_konu_id: kaynak, hedef_konu_id: hedef });
    }
    for (const [kaynak, hedef, gerekce] of YENI_ZINCIR) {
      const anahtar = kaynak + "→" + hedef + ":SERT_ONKOSUL";
      if (cevher.has(anahtar)) continue;
      cevher.add(anahtar);
      kenarlar.push({ kaynak_konu_id: kaynak, hedef_konu_id: hedef, iliski_tipi: "SERT_ONKOSUL", agirlik: 0.9, gerekce });
    }
    g.kenarlar = kenarlar;

    if (!KONTROL) fs.writeFileSync(dosya, JSON.stringify(g, null, 2) + "\n", "utf8");
    bildir("✔ " + path.relative(KOK, dosya) + ": " + g.dugumler.length + " düğüm · " + g.kenarlar.length + " kenar");
  }
} catch (e) {
  bildir("✗ ilişki grafiği güncellenemedi: " + e.message);
  hata++;
}

/* ---- 7) PWA kopyası ve önbellek listesi (sw.js) ---- */
const PWA_HAVUZ = path.join(KOK, "pwa-files", "content", "soru_havuzlari");
const PWA_LISTE = ["fizik_10_u01_k05", "fizik_10_u01_k06", "fizik_10_u01_k07", "fizik_10_u01_k08", "fizik_10_u01_k09"];
if (fs.existsSync(PWA_HAVUZ)) {
  for (const id of ARSIVLE) {
    const yol = path.join(PWA_HAVUZ, id + ".json");
    if (fs.existsSync(yol)) {
      if (!KONTROL) fs.unlinkSync(yol);
      bildir("✔ PWA kopyası kaldırıldı: " + id);
    }
  }
  for (const id of PWA_LISTE) {
    const kaynak = path.join(HAVUZ_DIR, id + ".json");
    const hedef = path.join(PWA_HAVUZ, id + ".json");
    if (!fs.existsSync(kaynak)) continue;
    if (!KONTROL) fs.copyFileSync(kaynak, hedef);
    bildir("✔ PWA kopyası eklendi: " + id);
  }
}

const SW_DOSYA = path.join(KOK, "sw.js");
if (fs.existsSync(SW_DOSYA)) {
  let s = fs.readFileSync(SW_DOSYA, "utf8");
  const satir = id => '  "./content/soru_havuzlari/' + id + '.json",';
  const eskiSatirlar = ARSIVLE.map(satir).join("\n") + "\n";
  const yeniSatirlar = PWA_LISTE.map(satir).join("\n") + "\n";
  if (s.includes(eskiSatirlar)) {
    s = s.replace(eskiSatirlar, yeniSatirlar);
    if (!KONTROL) fs.writeFileSync(SW_DOSYA, s, "utf8");
    bildir("✔ sw.js önbellek listesi: 3 eski havuz → 5 yeni havuz");
  } else {
    const hepsiVar = PWA_LISTE.every(id => s.includes(satir(id)));
    bildir((hepsiVar ? "= " : "✗ ") + "sw.js önbellek listesi");
    if (!hepsiVar) hata++;
  }
}
