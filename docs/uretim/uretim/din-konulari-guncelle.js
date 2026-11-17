#!/usr/bin/env node
/* ============================================================
   DİN KÜLTÜRÜ VE AHLAK BİLGİSİ 10 — konu ağacını ders kitabına göre günceller
   ------------------------------------------------------------
   Sorun: uygulamanın 10. sınıf Din Kültürü ağacı 2018 müfredatının
   ünite yapısını taşıyordu ("1.1 Kur'an-ı Kerim ve Özellikleri",
   "4.3 Medine Dönemi" ...). 2025-2026 MEB ders kitabı ise Türkiye
   Yüzyılı Maarif Modeli'nin 5 ünitesini izliyor.

   Kaynak (kesin):
     · ders kitabı içindekiler: 5 ünite · 17 konu
       (1 İslam'da Varlık ve Bilgi, 2 Allah'ı Tanımak,
        3 İslam'ın Evrensel Mesajları, 4 Din, Çevre ve Teknoloji,
        5 İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar)
     · site/content/mufredat/meb_kazanim_10.json → DKAB.10.1.1 … DKAB.10.5.3
       (17 öğrenme çıktısı; konu başlıklarıyla 1:1)

   Yaptığı:
     1) konular.js (ve pwa-files/functions/konular.js) içindeki
        "10" bölümünün "Din Kültürü" listesini 17 konuyla değiştirir.
     2) Bilgi Bankası kayıt defterindeki muf_10_din_kulturu_* kayıtlarını
        (content/ ve site/content/ kopyaları) yeni listeden üretir.
     3) Havuzların topic_key'ini ağaç başlıklarına eşitler;
        din_10_u01_k02'yi (bilgi kaynakları) din_10_u01_k01 ile birleştirir.
        Birleştirilen dosya arşive taşınır, silinmez.

   Kullanım:
     node docs/uretim/uretim/din-konulari-guncelle.js           # uygula
     node docs/uretim/uretim/din-konulari-guncelle.js --kontrol  # yalnız bak
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const KONTROL = process.argv.includes("--kontrol");

/* Ders kitabı içindekiler — 5 ünite / 17 konu.
   Son konu her ünitede "Kur'an'dan Mesajlar"; ayet aralığı parantezde
   verilerek aynı adlı konular ayırt edilir (uygulama başlık gösterir). */
const DIN_KONULARI = [
  "1.1 İslam'da Bilgi ve Bilginin Kaynakları",
  "1.2 Allah-Âlem İlişkisi",
  "1.3 Kur'an'dan Mesajlar (İsrâ 36, Mülk 23)",
  "2.1 Allah'ın Varlığının Delilleri",
  "2.2 Allah'ı İsim ve Sıfatlarıyla Tanımak",
  "2.3 Kur'an'dan Mesajlar (Haşr 22-24)",
  "3.1 İslam'ın Tevhit İlkesi",
  "3.2 İslam'da Adalet ve Eşitlik",
  "3.3 İslam ve Barış",
  "3.4 Kur'an'dan Mesajlar (Nahl 90, Nisâ 58, Bakara 208)",
  "4.1 İnsan, Çevre ve Ahlak",
  "4.2 Teknoloji ve Ahlak",
  "4.3 Çevre ve Teknoloji Etkileşimi",
  "4.4 Kur'an'dan Mesajlar (Rûm 41)",
  "5.1 Dinî Yorum Farklılıklarının Nedenleri",
  "5.2 İtikadi-Siyasi ve Fıkhi Yorumlar",
  "5.3 Kur'an'dan Mesajlar (Hucurât 13)"
];

const ESKI_LISTE = [
  "1.1 Kur'an-ı Kerim ve Özellikleri",
  "1.2 Kur'an'ın Anlaşılması ve Yorumlanması",
  "1.3 Kur'an'dan Mesajlar (Ünite 1)",
  "2.1 İslam'ın İbadet Boyutu",
  "2.2 Namaz ve Oruç",
  "2.3 Hac ve Zekât",
  "2.4 Kur'an'dan Mesajlar (Ünite 2)",
  "3.1 İslam'ın Ahlak Boyutu",
  "3.2 Ahlaki Davranışlar",
  "3.3 Toplumsal Ahlak",
  "3.4 Kur'an'dan Mesajlar (Ünite 3)",
  "4.1 Hz. Muhammed'in Hayatı",
  "4.2 Mekke Dönemi",
  "4.3 Medine Dönemi",
  "4.4 Kur'an'dan Mesajlar (Ünite 4)"
];

let hata = 0;
const bildir = m => console.log(m);

/* ---- 1) konular.js (iki kopya) ---- */
const KONULAR_DOSYALARI = [
  path.join(KOK, "konular.js"),
  path.join(KOK, "pwa-files", "functions", "konular.js")
];

const eskiBlok = '  "Din Kültürü": [\n' +
  ESKI_LISTE.map(t => '   "' + t + '"').join(",\n") + "\n  ],";
const yeniBlok = '  "Din Kültürü": [\n' +
  DIN_KONULARI.map(t => '   "' + t + '"').join(",\n") + "\n  ],";

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
  bildir("✔ " + path.relative(KOK, dosya) + ": 15 konu → " + DIN_KONULARI.length + " konu");
}

/* ---- 2) Bilgi Bankası kayıt defteri (iki kopya) ---- */
const DEFTERLER = [
  path.join(KOK, "content", "mufredat", "konu_kayit_defteri.json"),
  path.join(KOK, "site", "content", "mufredat", "konu_kayit_defteri.json")
];

const yeniKayitlar = DIN_KONULARI.map((ad, i) => ({
  konu_id: "muf_10_din_kulturu_" + String(i + 1).padStart(2, "0"),
  konu_adi: ad,
  sinif: 10,
  ders: "Din Kültürü"
}));

for (const dosya of DEFTERLER) {
  if (!fs.existsSync(dosya)) { bildir("✗ yok: " + dosya); hata++; continue; }
  const defter = JSON.parse(fs.readFileSync(dosya, "utf8"));
  const kayitlar = Array.isArray(defter.records) ? defter.records : [];
  const ilkYer = kayitlar.findIndex(r => /^muf_10_din_kulturu_\d+$/.test(String(r.konu_id)));
  if (ilkYer < 0) { bildir("✗ " + path.relative(KOK, dosya) + ": din kaydı yok"); hata++; continue; }
  const kalan = kayitlar.filter(r => !/^muf_10_din_kulturu_\d+$/.test(String(r.konu_id)));
  const eskiAdet = kayitlar.length - kalan.length;
  defter.records = [...kalan.slice(0, ilkYer), ...yeniKayitlar, ...kalan.slice(ilkYer)];
  if (!KONTROL) fs.writeFileSync(dosya, JSON.stringify(defter, null, 2) + "\n", "utf8");
  bildir("✔ " + path.relative(KOK, dosya) + ": " + eskiAdet + " din kaydı → " + yeniKayitlar.length);
}

/* ---- 3) Havuzlar: birleştirme + topic_key eşitleme ----
   Havuzlar 2026 TYMM içeriğiyle yazılmış ama 2018 başlıklarını taşıyordu.
   İçerik incelemesiyle eşlenen 12 havuz ağaç başlığına çekilir.
   din_10_u01_k01 ile din_10_u01_k02 aynı konunun (bilgi ve kaynakları)
   parçalarıydı: ortak soru yok, ikisi birleştirilir.
   Yeni müfredatta karşılığı olmayan havuzlar (hac-zekât, Kur'an'ın ana
   konuları, ahlakın kaynağı) burada ellenmez; arşive taşınır. */
const HAVUZ_DIR = path.join(KOK, "site", "content", "soru_havuzlari");
const ARSIV_DIR = path.join(KOK, "arsiv", "soru_havuzlari", "din");

const HAVUZ_ESLEME = {
  din_10_u01_k01: "Din Kültürü > " + DIN_KONULARI[0],
  din_10_u01_k03: "Din Kültürü > " + DIN_KONULARI[1],
  din_10_u02_k01: "Din Kültürü > " + DIN_KONULARI[3],
  din_10_u02_k02: "Din Kültürü > " + DIN_KONULARI[4],
  din_10_u03_k01: "Din Kültürü > " + DIN_KONULARI[6],
  din_10_u03_k02: "Din Kültürü > " + DIN_KONULARI[7],
  din_10_u03_k03: "Din Kültürü > " + DIN_KONULARI[8],
  din_10_u04_k01: "Din Kültürü > " + DIN_KONULARI[10],
  din_10_u04_k02: "Din Kültürü > " + DIN_KONULARI[11],
  din_10_u04_k03: "Din Kültürü > " + DIN_KONULARI[12],
  din_10_u05_k01: "Din Kültürü > " + DIN_KONULARI[14],
  din_10_u05_k02: "Din Kültürü > " + DIN_KONULARI[15]
};

/* din_10_u01_k02 → din_10_u01_k01 (aynı konu, ortak soru yok) */
function havuzBirlestir(hedefId, kaynakId) {
  const hedefYol = path.join(HAVUZ_DIR, hedefId + ".json");
  const kaynakYol = path.join(HAVUZ_DIR, kaynakId + ".json");
  if (!fs.existsSync(kaynakYol)) return; // zaten birleştirilmiş
  const hedef = JSON.parse(fs.readFileSync(hedefYol, "utf8"));
  const kaynak = JSON.parse(fs.readFileSync(kaynakYol, "utf8"));
  hedef.sorular = [...hedef.sorular, ...kaynak.sorular].map((q, i) => ({
    ...q,
    soru_id: hedefId + "_o" + String(i + 1).padStart(2, "0")
  }));
  hedef.flashcards = [...hedef.flashcards, ...kaynak.flashcards].map((k, i) => ({
    ...k,
    id: hedefId + "_o" + String(i + 1).padStart(2, "0") + ":flashcard"
  }));
  if (!KONTROL) {
    fs.writeFileSync(hedefYol, JSON.stringify(hedef, null, 2) + "\n", "utf8");
    fs.mkdirSync(ARSIV_DIR, { recursive: true });
    fs.renameSync(kaynakYol, path.join(ARSIV_DIR, kaynakId + ".json"));
  }
  bildir("✔ birleştirildi: " + kaynakId + " (" + kaynak.sorular.length + " soru) → " + hedefId +
    " (toplam " + hedef.sorular.length + " soru)");
}

havuzBirlestir("din_10_u01_k01", "din_10_u01_k02");

let etiket = 0;
for (const [konuId, anahtar] of Object.entries(HAVUZ_ESLEME)) {
  const yol = path.join(HAVUZ_DIR, konuId + ".json");
  if (!fs.existsSync(yol)) { bildir("✗ havuz yok: " + konuId); hata++; continue; }
  const pool = JSON.parse(fs.readFileSync(yol, "utf8"));
  if (pool.topic_key === anahtar) continue;
  pool.topic_key = anahtar;
  pool.baslik = anahtar.split(" > ").pop();
  if (!KONTROL) fs.writeFileSync(yol, JSON.stringify(pool, null, 2) + "\n", "utf8");
  etiket++;
}
bildir("✔ topic_key eşitlendi: " + etiket + " havuz");

/* ---- 4) Ağaç ile kayıt defterini çapraz doğrula ---- */
try {
  const { KONULAR } = require(path.join(KOK, "konular.js"));
  const agac = KONULAR["10"]["Din Kültürü"] || [];
  const ayni = agac.length === DIN_KONULARI.length && agac.every((t, i) => t === DIN_KONULARI[i]);
  bildir((ayni ? "✔" : "✗") + " konular.js 10. sınıf Din Kültürü: " + agac.length + " konu");
  if (!ayni) hata++;
} catch (e) {
  bildir("✗ konular.js okunamadı: " + e.message);
  hata++;
}

bildir(hata ? "SONUÇ: " + hata + " hata" : "SONUÇ: tamam");
process.exitCode = hata ? 1 : 0;
