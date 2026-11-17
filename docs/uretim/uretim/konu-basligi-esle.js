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
  kim_10_t03_c01: ["Kimya", "3.1.1 Makro ve Mikro Ölçekli Deneyler"]
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
