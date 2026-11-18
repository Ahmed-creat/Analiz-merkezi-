#!/usr/bin/env node
/* ============================================================
   SABAH GÖREV HATIRLATMASI (tests/gorev-hatirlat.test.js)
   ------------------------------------------------------------
   Kullanıcının sorusu: "Her sabah görevleri hatırlatıyor mu?"

   Ölçülen gerçek durum (v41 öncesi):
     bildirim-gonder içindeki TEKRAR_IZINLI listesi yalnız
     [:reviews, :memcrit, :forget, schooltoday@, schooleve@]
     anahtarlarını geçiriyor. Günlük görevler (konu çalış /
     kitap oku / soru çöz) bu listede YOK → sabah o gün tekrar
     günü olan konu yoksa HİÇ bildirim gitmiyordu.

   v41 çözümü: supabase/functions/gorev-hatirlat
     · her sabah TR 07:40 (cron 'gorev-sabah', 40 4 * * *)
     · app_states içindeki dailyTasks + bkt_state'e bakar
     · bitmemiş çekirdek görev varsa bildirim-gonder'i
       mod="tekil" ile çağırır (push kriptosu tek yerde kalır)

   Bu test fonksiyonun GÖREV KARARINI kod çalıştırarak kanıtlar.
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const KOK = path.join(__dirname, "..");
const YOL = path.join(KOK, "supabase", "functions", "gorev-hatirlat", "index.ts");
const KAYNAK = fs.readFileSync(YOL, "utf8");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ayrinti) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ayrinti ? " → " + ayrinti : "")); return false;
}

// trGun + kalanGorevler fonksiyonlarını dosyadan al ve koştur
function kararFn() {
  const bas = KAYNAK.indexOf("// Türkiye takvim günü");
  const son = KAYNAK.indexOf("Deno.serve");
  ok("karar fonksiyonları dosyada bulundu", bas > 0 && son > bas);
  // TypeScript tip eklerini at (Deno dosyası .ts; vm düz JS koşar)
  const parca = KAYNAK.slice(bas, son)
    .replace(/:\s*(any|string|number|boolean|unknown)(\[\])?/g, "")
    .replace(/\bconst\s+(\w+)\s*=\s*\[\]/g, "const $1 = []");
  const kutu = {};
  vm.createContext(kutu);
  vm.runInContext(parca + "\n;this.trGun = trGun; this.kalanGorevler = kalanGorevler;", kutu);
  return kutu;
}

const GUN = "2026-10-29";
const DUN = "2026-10-28";

console.log("\n== 1) Görev kararı: bugünün bayrakları ==");
const F = kararFn();
ok("trGun() Türkiye gününü verir", /^\d{4}-\d{2}-\d{2}$/.test(F.trGun(new Date("2026-10-29T05:00:00Z"))));

let k = F.kalanGorevler({ dailyTasks: { date: GUN, study: false, read: false, solve: false }, bkt_state: {} }, GUN);
ok("hiçbiri yapılmadıysa 3 görev kalır", k.length === 3, JSON.stringify(k));

k = F.kalanGorevler({ dailyTasks: { date: GUN, study: true, read: true, solve: false }, bkt_state: {} }, GUN);
ok("soru çöz kaldıysa yalnız o anılır", k.length === 1 && k[0] === "soru çöz", JSON.stringify(k));

k = F.kalanGorevler({ dailyTasks: { date: GUN, study: true, read: true, solve: true }, bkt_state: {} }, GUN);
ok("üçü de bittiyse mesaj YOK", k.length === 0, JSON.stringify(k));

console.log("\n== 2) Dünkü işaret bugünü kapatmaz ==");
k = F.kalanGorevler({ dailyTasks: { date: DUN, study: true, read: true, solve: true }, bkt_state: {} }, GUN);
ok("dünkü bayraklar geçersiz → 3 görev kalır", k.length === 3, JSON.stringify(k));
k = F.kalanGorevler({ dailyTasks: { study: true, read: true, solve: true }, bkt_state: {} }, GUN);
ok("tarih alanı yoksa bayraklar bugün sayılır", k.length === 0, JSON.stringify(k));

console.log("\n== 3) 5. adım bitince 'konu çalış' kapanır ==");
k = F.kalanGorevler({ dailyTasks: { date: GUN, study: false, read: false, solve: false }, bkt_state: { "Matematik > Üslü Sayılar": { study_completed_at: GUN } } }, GUN);
ok("bugün konu bitiren 'konu çalış' almaz", k.indexOf("konu çalış") < 0, JSON.stringify(k));
k = F.kalanGorevler({ dailyTasks: { date: GUN }, bkt_state: { "A > B": { study_completed_at: DUN } } }, GUN);
ok("dün konu bitirmiş olmak bugünü kapatmaz", k.indexOf("konu çalış") >= 0, JSON.stringify(k));

console.log("\n== 4) Fonksiyonun gönderim yolu ==");
ok("bildirim-gonder mod=tekil ile çağrılıyor", /mod:\s*"tekil"/.test(KAYNAK));
ok("x-bildirim-secret ile yetkileniyor", KAYNAK.indexOf("x-bildirim-secret") > 0);
ok("Verify JWT gerekmez (secret ile korunuyor)", KAYNAK.indexOf("BILDIRIM_SECRET") > 0);
ok("sessiz saat 06–21 dışında göndermez", /trSaat < 6 \|\| trSaat >= 21/.test(KAYNAK));
ok("push_abonelikleri aktif=eq.true süzülüyor", KAYNAK.indexOf("push_abonelikleri?select=user_id,aktif&aktif=eq.true") > 0);
ok("görev metni 'bugünün görevleri' diyor", KAYNAK.indexOf("bugünün görevleri") > 0);

console.log("\n== 5) Sabah bildirimi uygulamada da anlatılıyor ==");
ok("kılavuzda sabah görev hatırlatması yazılı", HTML.indexOf("günün görevleri") > 0);

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(x => console.log(" ✗ " + x));
  console.log("Görev hatırlatma testi — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("Görev hatırlatma testi — " + gecen + "/" + gecen + " geçti ✓");
