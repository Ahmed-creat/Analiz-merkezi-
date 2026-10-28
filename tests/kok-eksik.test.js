/* ============================================================
   v35.6 — Kök Eksik / Bilgi Bankası döngüsü / Kısa Kontrol (5 soru)
   ------------------------------------------------------------
   Kullanıcı bildirimleri:
     • "Kök Eksik Uyarısı: Trigonometri zayıf ama Dalgalar güçlü" (anlamsız)
     • "Konuyu aç → Bilgi Bankası → Sonuçta gör → tekrar Deneme ekranı" (kısır döngü)
     • "Kısa kontrol sorusunu 5 yap"
     • "Konu çalışıldıktan hemen sonra 5 kontrol sorusu çıksın"
     • "Hangi sorulara görsel eklendi, hiç görmedim"
   ============================================================ */
const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const KE = require(path.join(KOK, "site", "kok-eksik.js"));
const GRAF = JSON.parse(fs.readFileSync(path.join(KOK, "site", "content", "iliski_grafi.json"), "utf8"));

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) {
  if (kosul) { gecen++; return; }
  kalan++; hatalar.push(ad + (ek ? " — " + ek : ""));
}
function esit(ad, a, b) { ok(ad, JSON.stringify(a) === JSON.stringify(b), "gelen: " + JSON.stringify(a)); }

// ---------- 1) Kök eksik: eski uydurma eşleştirme GİTTİ ----------
console.log("\n== 1) Kök eksik uydurma eşleştirmesi kaldırıldı ==");
ok("CROSS_LINKS sabiti kaldırıldı", HTML.indexOf("const CROSS_LINKS") < 0);
ok("kodda eski eşleştirme yok (yalnız yorumda geçiyor)",
  (HTML.match(/"Trigonometri ↔ Dalgalar"/g) || []).length === 0);
ok("kök eksik modülü yükleniyor", HTML.indexOf('<script src="kok-eksik.js"></script>') > 0);
ok("rootDeficitList grafı kullanıyor", /function rootDeficitList\(\)[\s\S]{0,700}__analizIliskiGrafigi/.test(HTML));
ok("ders yüzdesi karşılaştırması kalmadı", !/rootDeficitList\(\)[\s\S]{0,900}topicSuccessRate/.test(HTML));

// ---------- 2) Kök eksik: gerçek ön koşul grafı ----------
console.log("\n== 2) Kök eksik: gerçek ön koşul grafı ==");
const matTrigo = "Matematik > Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler";
const sayac = { [matTrigo]: 3 };
const liste = KE.listele(GRAF, sayac, {}, { enAzHata: 2 });
ok("zayıf konu için uyarı üretildi", liste.length === 1, JSON.stringify(liste.map(x => x.weak)));
if (liste.length) {
  const r = liste[0];
  esit("kök ders Matematik", r.root, "Matematik");
  ok("bağlı konular grafın SERT_ONKOSUL kenarlarından", r.bagimli.length === 3, JSON.stringify(r.bagimli));
  ok("Sinüs/Kosinüs Teoremleri bağlı", r.bagimli.indexOf("Matematik > Sinüs ve Kosinüs Teoremleri") >= 0);
  ok("Vektörler bağlı", r.bagimli.some(x => x.indexOf("Vektörler") >= 0));
  ok("İki Boyutta Sabit İvmeli Hareket bağlı", r.bagimli.some(x => x.indexOf("İki Boyutta Sabit İvmeli") >= 0));
  ok("DALGALAR listede YOK (eskiden 4 kopya çıkıyordu)", !r.bagimli.some(x => x.indexOf("Dalga") >= 0), JSON.stringify(r.bagimli));
}

// Dalga konularına hata yazılsa bile trigonometriyle EŞLEŞMEZ
const sayac2 = { [matTrigo]: 3, "Fizik > Dalgaların Temel Kavramları": 5 };
const l2 = KE.listele(GRAF, sayac2, {}, { enAzHata: 2 });
ok("kök ders her satırda konunun KENDİ dersi", l2.every(x => x.root === x.weak.split(" > ")[0]), JSON.stringify(l2.map(x => x.root)));
ok("Dalgalar için trigonometri kökü YOK", l2.every(x => !/Trigonometri/.test(x.root)), JSON.stringify(l2.map(x => x.root)));
ok("tek hata uyarı üretmez", KE.listele(GRAF, { [matTrigo]: 1 }, {}, { enAzHata: 2 }).length === 0);
ok("graf yoksa uyarı YOK", KE.listele(null, { [matTrigo]: 9 }, {}, {}).length === 0);
ok("boş graf uyarı üretmez", KE.listele({ nodes: [], edges: [] }, { [matTrigo]: 9 }, {}, {}).length === 0);

// Konu tamamlandıktan önceki hatalar sayılmaz
const bellek = { [matTrigo]: { completedAt: "2026-10-20T10:00:00.000Z" } };
const s3 = KE.hataSayaclari(
  [{ errorLogs: [{ lesson: "Matematik", topic: "Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler", date: "2026-10-01" },
                 { lesson: "Matematik", topic: "Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler", date: "2026-10-25" }] }],
  [], bellek);
esit("tamamlama öncesi hata sayılmadı", s3[matTrigo], 1);

// ---------- 3) Bilgi Bankası kısır döngüsü ----------
console.log("\n== 3) Bilgi Bankası → Deneme döngüsü kırıldı ==");
ok("satır artık soruCozum açıyor", /data-act="soruCozum"/.test(HTML));
ok("soruCozumDetay tanımlı", /function soruCozumDetay\(examIdx, ders, qno, topicKey\)/.test(HTML));
ok("soruCozumDetay sayfa değiştirmiyor (navigate YOK)",
  !/function soruCozumDetay\([\s\S]{0,2600}navigate\(/.test(HTML));
ok("detayda 'Bu konudan 5 soru çöz' var", HTML.indexOf("Bu konudan 5 soru çöz") > 0);
ok("Okulizyon bağlantısı AÇIK etiketli (oturum gerekir)", HTML.indexOf("oturum gerekir") > 0);
ok("Eski 'Sonuçta gör' düğmesi kaldırıldı", (HTML.match(/> Sonuçta gör</g) || []).length === 0 && HTML.indexOf("Sonuçta gör</span>") < 0);
ok("klavye (Enter/Space) soruCozum'u açıyor", /keydown[\s\S]{0,300}data-act="soruCozum"/.test(HTML));

// ---------- 4) Kısa Kontrol: 5 soru + tek tek ----------
console.log("\n== 4) Kısa Kontrol 5 soru, sırayla ==");
ok("MINI_SORU = 5", /const MINI_SORU = 5/.test(HTML));
ok("precheck de 5 soru (eski 3 kalmadı)", !/mode === "precheck" \? Math\.min\(3/.test(HTML));
ok("tek soru çizen cizMiniSoru var", /function cizMiniSoru\(modal\)/.test(HTML));
ok("ileri/geri düğmeleri var", /data-bkt-next/.test(HTML) && /data-bkt-prev/.test(HTML));
ok("soru sayacı gösteriliyor", /Soru ' \+ \(i \+ 1\) \+ ' \/ ' \+ qs\.length/.test(HTML));
ok("buton etiketi 5 soru", HTML.indexOf("Kısa Kontrol — 5 soru") > 0);
ok("tamamlanan konuda belirgin kontrol kartı", HTML.indexOf("5 soruluk kısa kontrol seni bekliyor") > 0);
ok("completeTopic sonunda otomatik kontrol", /function completeTopic\(key\)[\s\S]{0,2000}miniKontrolBaslat\(key\)/.test(HTML));

// ---------- 5) Görseller gerçekten çiziliyor ----------
console.log("\n== 5) Soru görselleri ==");
const poolDir = path.join(KOK, "site", "content", "soru_havuzlari");
const gorselli = [];
fs.readdirSync(poolDir).filter(f => f.endsWith(".json") && f !== "index.json").forEach(f => {
  let d; try { d = JSON.parse(fs.readFileSync(path.join(poolDir, f), "utf8")); } catch (e) { return; }
  (d.sorular || []).forEach(q => { if (q.gorsel) gorselli.push({ dosya: f, id: q.soru_id, tip: q.gorsel.tip }); });
});
ok("havuzlarda görselli soru var (" + gorselli.length + ")", gorselli.length >= 12);
ok("mini testte görsel çiziliyor (GV.html)", /function miniGorsel\(q\)[\s\S]{0,300}GV\.html/.test(HTML));
ok("çizim sırasında soru görseli ekleniyor", /h \+= miniGorsel\(q\);/.test(HTML));
ok("sonuç ekranında da görsel var", /miniGorsel\(q\) \+ '<div class="text-muted"/.test(HTML));
ok("görselli sorular seçimde öne alınıyor", /a\.q && a\.q\.gorsel \? 1 : 0/.test(HTML));
const GV = require(path.join(KOK, "site", "gorsel.js"));
let cizilen = 0;
gorselli.forEach(g => {
  const d = JSON.parse(fs.readFileSync(path.join(poolDir, g.dosya), "utf8"));
  const q = (d.sorular || []).find(x => x.soru_id === g.id);
  if (GV.svg(q.gorsel)) cizilen++;
});
esit("her görselli soru SVG'ye çevrilebiliyor", cizilen, gorselli.length);

// ---------- 6) Bildirim izni: sessiz otomatik istek YOK ----------
console.log("\n== 6) Bildirim izni ==");
ok("deneme kaydından sonra otomatik izin isteği KALDIRILDI",
  HTML.indexOf('state.settings.notifPermission !== "granted") requestNotifPermission()') < 0);
ok("izin yalnız düğmeden isteniyor", /case "toggleNotifPermission": requestNotifPermission\(\);/.test(HTML));
ok("tanılama paneli var", /function bildirimTeshisPaneli\(\)/.test(HTML));
ok("engelli durumunda adım adım çözüm yazıyor", HTML.indexOf("Tarayıcı izni bir kez 'engellendi' olarak kaydedince site kodla geri açamaz") > 0);
ok("requestPermission await'siz (dokunuş içinde)", /sonuc = Notification\.requestPermission\(bitir\)/.test(HTML));

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(x => console.log(" ✗ " + x));
  console.log("Kök eksik / döngü / kısa kontrol / görsel — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("Kök eksik / döngü / kısa kontrol / görsel — " + gecen + "/" + gecen + " geçti ✓");
