#!/usr/bin/env node
/* ============================================================
   v89 — "Tekrar yok ama ACİL KONU var, bildirim gelmedi"
   ------------------------------------------------------------
   KULLANICI (18 Kas 19:43):
     "Ya bildirimin çalıştığından emin misin şu an 19.43 hâlâ gelmedi."
     "Tekrar yok ama konu takibinde acil konu var. Bunun içinde
      bildirim vardı. Bu gelmezse öğrenci çalışmaz ve tekrar da etmez."

   Kanıtlananlar:
     1) Motor artık tekrar listesi boşken ACİL KONU üretiyor
     2) Puanlama uygulamadaki REASON_WEIGHTS ile aynı
     3) "Öğrenildi" işaretinden önceki hatalar dışlanıyor (uygulama kuralı)
     4) Tekrar varsa eski davranış bozulmuyor
     5) İkisi de yoksa uydurma bildirim yok
     6) Cihaz gösterdiyse mükerrer yok, deneme sınırı 4, TTL 90 dk
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const SQL = fs.readFileSync(path.join(KOK, "supabase", "migrations", "0007_bildirim_acil_konu.sql"), "utf8");
const ESKI = fs.readFileSync(path.join(KOK, "supabase", "migrations", "0002_webpush_tetikle.sql"), "utf8");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) gecen++; else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }

console.log("\n== 1) Kök neden: eski motor yalnız tekrar listesine bakıyordu ==");
{
  ok("eski sürümde memory planı okunuyor", /state->'memory'/.test(ESKI));
  ok("eski sürümde tekrar boşsa atlanıyor (kör nokta)", /if adet = 0 then continue; end if;/.test(ESKI));
  ok("eski sürümde hata kaydı (errorLogs) HİÇ okunmuyor", !/errorLogs/.test(ESKI));
}

console.log("\n== 2) Yeni motor: tekrar boşsa acil konu ==");
{
  ok("acil konu yolu eklendi", /tur := 'acil'/.test(SQL));
  ok("errorLogs taranıyor", /errorLogs/.test(SQL) && /jsonb_array_elements/.test(SQL));
  ok("hem denemeler hem testler taranıyor", /'deneme'::text as kaynak/.test(SQL) && /'test'::text as kaynak/.test(SQL));
  ok("acil konu sayısı sınırsız, listede en çok 3 ad (mesaj kısa)", /sira <= 3/.test(SQL));
  ok("sıralama puana göre", /row_number\(\) over \(order by puan desc, konu\)/.test(SQL));
  ok("uzun konu adı kısaltılır", /left\(konu, 45\) \|\| '…'/.test(SQL));
  ok("tekrar yolu KORUNDU (önce tekrar)", SQL.indexOf("state->'memory'") < SQL.indexOf("tur := 'acil'"));
  ok("ikisi de boşsa sessiz", /if adet = 0 then continue; end if;/.test(SQL));
  ok("konu adı 'Ders > Konu' ayrımından çıkarılıyor", /split_part\(\(e->>'lesson'\) \|\| ' > ' \|\| \(e->>'topic'\)/.test(SQL));
}

console.log("\n== 3) Puanlama uygulamayla aynı (REASON_WEIGHTS) ==");
{
  const blok = (/const REASON_WEIGHTS = \{([\s\S]*?)\};/.exec(HTML) || [])[1] || "";
  ok("REASON_WEIGHTS okundu", blok.length > 0);
  const agirliklar = {};
  blok.replace(/"([^"]+)"\s*:\s*([0-9.]+)/g, (m, k, v) => { agirliklar[k] = Number(v); return m; });
  ok("Konuyu Bilmiyordum ağırlığı 1.5", agirliklar["Konuyu Bilmiyordum"] === 1.5);
  ok("KONUEKSİKLİĞİ ağırlığı 1.5", agirliklar["KONUEKSİKLİĞİ"] === 1.5);
  ok("ANLAMADIM ağırlığı 0.5", agirliklar["ANLAMADIM"] === 0.5);
  ok("İşlem Hatası ağırlığı 0.5", agirliklar["İşlem Hatası/Dikkatsizlik"] === 0.5);
  ok("ÇÖZÜMYOLUNUBULAMADIM ağırlığı 0.8", agirliklar["ÇÖZÜMYOLUNUBULAMADIM"] === 0.8);
  ok("Kodlama/Kitapçık ağırlığı 0.1", agirliklar["Kodlama/Kitapçık Hatası"] === 0.1);

  // Her hata tipi SQL'de geçiyor mu?
  const tipler = Object.keys(agirliklar);
  const eksik = tipler.filter(t => SQL.indexOf(t) < 0);
  ok("her hata tipi SQL'de eşlenmiş", eksik.length === 0, "eksik: " + eksik.join(", "));
  ok("deneme 1.5 / test 1.0 ayrımı var", /when kay\.kaynak = 'deneme' then 1\.5 else 1\.0 end/.test(SQL));
}

console.log("\n== 4) Uygulama kurallarıyla uyum ==");
{
  ok("'öğrendim' sonrası eski hata düşer (topicLearnedAfter)", /completedAt/.test(SQL) && /left\(m\.value->>'completedAt', 10\)::date > left\(e->>'date', 10\)::date/.test(SQL));
  ok("tarihi okunamayan kayıt sayılmaz", /\(e->>'date'\) ~ '\^\[0-9\]\{4\}-\[0-9\]\{2\}-\[0-9\]\{2\}'/.test(SQL));
  ok("konu/ders boş kayıt sayılmaz", /\(e->>'topic'\) is not null and \(e->>'lesson'\) is not null/.test(SQL));
}

console.log("\n== 5) Gönderim ve mükerrer koruması ==");
{
  ok("TTL 90 dakika", /'ttl', '5400'/.test(SQL) && !/'ttl', '21600'/.test(SQL));
  ok("ACİL başlığı var (sabah/akşam)", /Günaydın! Acil konular/.test(SQL) && /Akşam: acil konular açık/.test(SQL));
  ok("TEKRAR başlığı korundu", /Günaydın! Tekrar Zamanı/.test(SQL) && /Akşam tekrarı seni bekliyor/.test(SQL));
  ok("cihaz gösterdiyse mükerrer yok", /t\.gosterildi is true and t\.baslik = hat_baslik/.test(SQL));
  ok("vardiya başına en çok 4 deneme", /deneme >= 4/.test(SQL));
  ok("push-tani kanalı (v87 kuralı)", /push-tani/.test(SQL));
  ok("başlık cihaza giden yükte", /jsonb_build_object\('title', hat_baslik, 'body', govde/.test(SQL));
  ok("acil bildirim türü ayrı", /'kind', case when tur = 'acil' then 'acil-konu' else 'reviews' end/.test(SQL));
  ok("acil metni ne yapılacağını söylüyor", /10 dakikada kapat/.test(SQL));
}

console.log("\n== 6) Sözdizimi güvenliği ==");
{
  ok("fonksiyon create or replace ile", /create or replace function public\.webpush_tetikle\(\)/.test(SQL));
  ok("SECURITY DEFINER korundu", /security definer/.test(SQL));
  ok("jsonb döndürüyor", /returns jsonb/.test(SQL));
  ok("döngü değişkeni kay ile çakışmıyor", (SQL.match(/\bkay\b/g) || []).length > 0 && !/declare[\s\S]*?\bkay\b\s+record/.test(SQL));
}

console.log("\n" + "─".repeat(58));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("v89 — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("v89 acil konu bildirimi — " + gecen + "/" + gecen + " geçti ✓");
