#!/usr/bin/env node
/* ============================================================
   Plan şemalı havuzların topic_key'ini ağaç başlığıyla eşitler
   ------------------------------------------------------------
   Bu havuzlar plan şemasında üretildiği için topic_key'leri
   kazanım cümlesiydi ("1.3 Fotosentezde kullanılan ve üretilen
   maddelerle ilgili deney yapabilme"). Uygulama havuzu KONU
   BAŞLIĞIYLA aradığı için bu konularda havuz "yok" görünüyordu.
   Eşleme konu adları uydurulmadan, `konular.js` ağacındaki
   başlıklarla yapılır; başlık ağaçta yoksa betik hata verir.

   Kullanım: node docs/uretim/uretim/konu-basligi-esle.js
   (idempotent; Tarih 2.2 ve 2.4 yazıcısı tarih-t02.js içinde)
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const { konuBasligiYaz } = require("../yazicilar/yaz.js");
const { KONULAR } = require("../../../konular.js");

const ESLEME = {
  biyo_10_t01_c03: ["Biyoloji", "1.3 Fotosentezde Kullanılan ve Üretilen Maddeler"],
  biyo_10_t01_c06: ["Biyoloji", "1.6 İnsanda Sindirim"],
  biyo_10_t02_c05: ["Biyoloji", "2.5 Ekolojik Sürdürülebilirliğin Önemi"],
  biyo_10_t02_c07: ["Biyoloji", "2.7 Ekolojik Ayak İzinin Küçültülmesi"],
  biyo_10_t02_c08: ["Biyoloji", "2.8 Doğal Kaynakların ve Biyoçeşitliliğin Korunması"],
  kim_10_t01_c08: ["Kimya", "1.2.2 Gazların Kinetik Moleküler Teorisi"],
  kim_10_t03_c01: ["Kimya", "3.1.1 Makro ve Mikro Ölçekli Deneyler"],

  /* 2026-11-17 · Kaynağı ders kitabı olmayan 15 havuz arşive taşındı
     (arsiv/soru_havuzlari/). O konuların havuzu aslında PLAN şemasında
     vardı; başlıkları kazanım cümlesi olduğu için uygulama bulamıyordu.
     Kazanım metni ile ağaç başlığı birebir örtüşenler burada eşitlenir. */
  biyo_10_t01_c08: ["Biyoloji", "1.8 Besinlerin Solunuma Katılma Yolları"],
  biyo_10_t02_c02: ["Biyoloji", "2.2 Komünitelerde ve Popülasyonlarda Görülen Etkileşimler ve Değişimler"],
  biyo_10_t02_c06: ["Biyoloji", "2.6 Ekolojik Sürdürülebilirliği Kısıtlayan Durumlar"],
  kim_10_t02_c05: ["Kimya", "2.1.6 Çözünürlğe Etki Eden Faktörler"],
  kim_10_t02_c06: ["Kimya", "2.1.7 Çözeltilerin Sınıflandırılması"],
  kim_10_t02_c08: ["Kimya", "2.1.8 Koligatif Özellikler"],
  cogr_10_t04_c02: ["Coğrafya", "4.2 Yerleşmelerin Fonksiyonları"],
  cogr_10_t05_c02: ["Coğrafya", "5.2 Ekonomik Sektörler ve Gelişmişlik"],
  cogr_10_t05_c03: ["Coğrafya", "5.3 Türkiye Ekonomisinin Sektörel Dağılımı"],
  cogr_10_t06_c02: ["Coğrafya", "6.2 Afetlere Karşİ Dirençli Yaşam Alanları"],
  cogr_10_t06_c03: ["Coğrafya", "6.3 Afetlerden Korunma"],
  cogr_10_t06_c04: ["Coğrafya", "6.4 Afet Bilinci"],
  cogr_10_t07_c01: ["Coğrafya", "7.1 Türk Kültürünün Mekânsal Özellikleri"],
  tar_10_t01_c04: ["Tarih", "1.4 Türk-İslam Medeniyetinde Bilim, Kültür, Eğitim ve Sanat"],
  tar_10_t02_c05: ["Tarih", "2.5 Osmanlı Devleti'nin İlim ve İrfan Geleneği"]
};

const HAVUZ_DIR = path.join(__dirname, "..", "..", "..", "site", "content", "soru_havuzlari");
const agac = KONULAR["10"];

let yazilan = 0, atlanan = 0, hata = [];

for (const [konu_id, [ders, baslik]] of Object.entries(ESLEME)) {
  const agacBasliklari = agac[ders] || [];
  if (!agacBasliklari.includes(baslik)) {
    hata.push(konu_id + ": ağaçta başlık yok → " + ders + " > " + baslik);
    continue;
  }
  const yol = path.join(HAVUZ_DIR, konu_id + ".json");
  if (!fs.existsSync(yol)) { hata.push(konu_id + ": havuz dosyası yok"); continue; }
  const topic_key = ders + " > " + baslik;
  const havuz = JSON.parse(fs.readFileSync(yol, "utf8"));
  if (havuz.topic_key === topic_key) { atlanan++; continue; }
  konuBasligiYaz(konu_id, topic_key);
  yazilan++;
}

console.log("konu başlığı eşlemesi: " + yazilan + " havuz yazıldı · " + atlanan + " zaten güncel");
if (hata.length) {
  console.log("HATALAR:");
  hata.forEach(h => console.log("  - " + h));
  process.exitCode = 1;
} else {
  console.log("SONUÇ: tamam");
}
