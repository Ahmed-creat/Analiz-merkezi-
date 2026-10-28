/* ============================================================
   KONU BULMA + KISA KONTROL + VİDEO BAĞLANTISI TESTLERİ
   ------------------------------------------------------------
   Kullanıcı bildirimi (üç şikâyet):
     1) "bazı konularda kısa kontrol gelmiyor, gelse de açılmıyor"
     2) "hiçbir video bağlantısı yok; bağlantı yoksa neden izle diyorsun"
     3) "konular yine kazanım olarak kaydediliyor — her kazanımda
         basbayağı konu ismi geçiyor"
   Bu test üçünün kök nedenini ve düzeltmesini doğrular.
   Çalıştır: node tests/konu-bulma.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const HB = require("../site/havuz-bul.js");
const KA = require("../site/konu-anahtar.js");
const VC = require("../site/video-cozum.js");
globalThis.KA = KA;   // VC tarayıcıda window.KA üzerinden okur

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) { gecen++; return true; } kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false; }
function esit(ad, g, b) { return ok(ad, g === b, "gelen: " + JSON.stringify(g) + " · beklenen: " + JSON.stringify(b)); }

const KOK = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const MANIFEST = require(path.join(KOK, "site", "content", "soru_havuzlari", "index.json"));
const HAVUZLAR = MANIFEST.havuzlar || [];

// ---------- 1) Manifest: baslik alanı ----------
console.log("\n== 1) Havuz manifesti ==");
esit("havuz sayısı 172", HAVUZLAR.length, 172);
ok("her havuzda baslik var", HAVUZLAR.every(h => h.baslik && String(h.baslik).trim()), HAVUZLAR.filter(h => !h.baslik).map(h => h.konu_id).slice(0, 5).join(","));
ok("her havuzda baslik dolu", HAVUZLAR.every(h => String(h.baslik || "").trim().length > 0), HAVUZLAR.filter(h => !String(h.baslik || "").trim()).map(h => h.konu_id).slice(0,3).join(","));
ok("Kimya havuzunda baslik dolu", !!HB.bul("Kimya > 1.1.3 Mol Kavramı", HAVUZLAR));
ok("Coğrafya havuzunda baslik dolu", !!HB.bul("Coğrafya > 1.1 Coğrafi Bakış", HAVUZLAR));
ok("TDE havuzunda baslik dolu", !!HB.bul("Türk Dili ve Edebiyatı > Destan", HAVUZLAR));

// ---------- 2) Havuz bulucu ----------
console.log("\n== 2) Havuz bulucu (HB) ==");
esit("birebir topic_key", HB.bul("Fizik > 1.1 Sabit Hızlı Hareket", HAVUZLAR).konu_id, "fizik_10_u01_k01");
esit("numarasız başlık da bulur", HB.bul("Fizik > Sabit Hızlı Hareket", HAVUZLAR).konu_id, "fizik_10_u01_k01");
esit("kısa başlık (Destan)", HB.bul("Türk Dili ve Edebiyatı > Destan", HAVUZLAR).konu_id, "edebiyat_10_u03_k01");
esit("Kimya mol", HB.bul("Kimya > 1.1.3 Mol Kavramı", HAVUZLAR).konu_id, "kimya_10_u01_k03");
esit("olmayan konu → null", HB.bul("Fizik > Kuantum Dolanıklık", HAVUZLAR), null);
esit("boş anahtar → null", HB.bul("", HAVUZLAR), null);
esit('"undefined" metni → null', HB.bul("undefined", HAVUZLAR), null);
esit("ders uyuşmazsa null", HB.bul("Fizik > Destan", HAVUZLAR), null);

// ---------- 2b) KISA KONTROL KAPSAMASI (her konuda çıkmalı) ----------
console.log("\n== 2b) Kapsama ==");
const { KONULAR } = require(path.join(KOK, "konular.js"));
let konuSayisi = 0; const kapsanmayan = [];
for (const ders of Object.keys(KONULAR["10"])) {
  for (const konu of KONULAR["10"][ders]) {
    konuSayisi++;
    if (!HB.bul(ders + " > " + konu, HAVUZLAR)) kapsanmayan.push(ders + " > " + konu);
  }
}
esit("10. sınıf konu sayısı 180", konuSayisi, 180);
esit("her konuda Kısa Kontrol (havuz) var: 180/180", kapsanmayan.length, 0);
ok("kapsanmayan konu listesi boş", kapsanmayan.length === 0, kapsanmayan.slice(0, 3).join(" | "));
esit("etiket (alt beceri) kademesi çalışıyor",
  (HB.bul("Biyoloji > 2.7 Ekolojik Ayak İzinin Küçültülmesi", HAVUZLAR) || {}).konu_id,
  "biyo_10_u02_k04");

// ---------- 3) Kazanım → konu kuralları ----------
console.log("\n== 3) Kazanım → konu (elle bakılmış kurallar) ==");
const ORNEKLER = [
  ["Matematik", "Üçgende iç ve dış açıortayların, kenarortayların, kenar orta dikmelerin ve yüksekliklerin özelliklerine ilişkin varsayımda bulunur.",
    "1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler"],
  ["Matematik", "Üçgenin bir kenarı ve o kenara ait yüksekliğindeki değişimin üçgenin alanındaki değişime etkisine dair varsayımlarda bulunur.",
    "1.3 Üçgende Alan"],
  ["Fizik", "Yatay doğrultuda sabit ivmeyle hareket eden cisimlerin hareketine ilişkin grafikleri ve matematiksel modeller arasındaki ilişkiyi kendi cümleleriyle yeniden ifade eder.",
    "1.2 Bir Boyutta Sabit İvmeli Hareket"],
  ["Kimya", "Maddelerin miktarını ifade etmek için ölçülebilir (kütle, tanecik sayısı vb.) özellikleri belirler.",
    "1.1.3 Mol Kavramı"],
  ["Kimya", "Tepkime türlerinin (çökelme, indirgenme-yükseltgenme, asit-baz) oluşum sürecine ilişkin gözlemlenebilir göstergeleri (renk değişimi, çökelek oluşumu) tanımlar.",
    "1.1.2 Kimyasal Tepkime Türleri"],
  ["Coğrafya", "Örnek olay, olgu ve/veya mekânın aynı çevrede bulunan diğer olay, olgu veya mekânlar üzerindeki etkisini sorgular.",
    "1.1 Coğrafi Bakış"],
  ["Türk Dili ve Edebiyatı", "Şiirde ahengi sağlayan özellikleri (uyak düzeni, uyak, redif, aliterasyon,asonans) ile ilgili çalışma yapar.",
    "Şiirde Ahenk (Ölçü, Uyak, Redif, Aliterasyon, Asonans)"]
];
ORNEKLER.forEach(([ders, kazanim, beklenen]) => {
  const r = KA.esle(kazanim, ders);
  esit("kural: " + beklenen.slice(0, 34), r ? r.konu : null, beklenen);
});
esit("kural: karşılığı olmayan kazanım UYDURULMAZ",
  KA.esle("Metnin yapı unsurlarının metne olan katkısını değerlendirir.", "Türk Dili ve Edebiyatı"), null);
esit("kural: ders uyuşmazsa çalışmaz",
  KA.esle("Tepkime türlerinin oluşum süreci", "Matematik"), null);
ok("kural sayısı makul (denetlenebilir)", KA.KURALLAR.length > 20 && KA.KURALLAR.length < 80, String(KA.KURALLAR.length));
ok("her kuralda ders + konu + desen var", KA.KURALLAR.every(r => Array.isArray(r.ders) && r.ders.length && r.konu && r.desen instanceof RegExp));

// ---------- 4) Kazanım → konu → havuz (uçtan uca) ----------
console.log("\n== 4) Uçtan uca: kazanım → konu → havuz ==");
let bulunan = 0;
ORNEKLER.forEach(([ders, kazanim]) => {
  const kural = KA.esle(kazanim, ders);
  if (!kural) return;
  const h = HB.bul(ders + " > " + kural.konu, HAVUZLAR);
  if (h) bulunan++;
  ok("havuz bulundu: " + kural.konu.slice(0, 30), !!h, ders + " > " + kural.konu);
});
ok("örneklerin çoğu havuza bağlandı", bulunan >= ORNEKLER.length - 1, bulunan + "/" + ORNEKLER.length);

// ---------- 5) app-pwa bağlantısı ----------
console.log("\n== 5) Uygulama bağlantısı ==");
ok("okzKonuBul kural tablosunu kullanıyor", APP.indexOf('window.KA && typeof window.KA.esle === "function"') > 0);
ok("kural eşleşmesi 'kural' kaynağıyla işaretli", APP.indexOf('kaynak: "kural"') > 0);
ok("kural, konu anahtarını Ders > Konu üretiyor", APP.indexOf('topicKey: kanon + " > " + kural.konu') > 0);
ok("kuyrukta sınav çözüm bağlantısı var", APP.indexOf("sınavı ve çözümleri aç") > 0);
ok("satır bazında çözüm bağlantısı var", APP.indexOf("çözüm var") > 0);
ok("bağlantı yalnız adres varsa çiziliyor", APP.indexOf("if (okzSinavUrl)") > 0);

// ---------- 6) Kısa Kontrol düzeltmesi ----------
console.log("\n== 6) Kısa Kontrol ==");
ok("havuz-bul.js index.html'de yükleniyor", HTML.indexOf('<script src="havuz-bul.js"></script>') > 0);
ok("konu-anahtar.js index.html'de yükleniyor", HTML.indexOf('<script src="konu-anahtar.js"></script>') > 0);
ok("resolvePoolId ortak bulucuyu kullanıyor", /function resolvePoolId\(topicKey\)[\s\S]{0,600}HB\.bul/.test(HTML));
ok('"undefined" havuz kimliği geçersiz sayılıyor', HTML.indexOf('raw === "undefined"') > 0);
// v35.4: tek kademe yetmiyordu — poolId boş/yanlışsa test hiç açılmıyordu.
// Artık havuzuBul(): poolId → resolvePoolId(topicKey) → topicKey sırayla denenir.
ok("openMiniTest havuzu 3 kademede arıyor", /function havuzuBul\(topicKey, poolId\)/.test(HTML) && /havuzuBul\(topicKey, poolId\)/.test(HTML));
ok("openMiniTest her kademeyi deniyor", /function openMiniTest\(topicKey, poolId, options\)[\s\S]{0,900}havuzuBul\(topicKey, poolId\)/.test(HTML));
ok("havuzuBul resolvePoolId'yi kullanıyor", /function havuzuBul\(topicKey, poolId\)[\s\S]{0,900}resolvePoolId\(topicKey\)/.test(HTML));
ok("boş havuzda sessiz kalmıyor (toast)", /havuzuBul[\s\S]{0,2000}toast\(/.test(HTML));
ok("panelde kısa kontrol precheck şartına bağlı DEĞİL", HTML.indexOf("Havuz ÇÖZÜLÜRSE düğme her zaman çıkar") > 0);
ok("panelde precheck vurgusu korunuyor", HTML.indexOf("const precheck = !!(e.precheck_due") > 0);
// v35.4: resolvePoolId IIFE İÇİNDE tanımlı; renderKnowledge dışarıda olduğu
// için çağrı ReferenceError atıp BİLGİ BANKASI sayfasını beyaz bırakıyordu.
// Köprü: havuzIdCoz() → window.__havuzIdCoz (IIFE içinde açılır).
ok("konu detayında da pool_id olmadan çözülüyor", HTML.indexOf("const cozulen = kayitliHavuz || havuzIdCoz(selectedTopicKey)") > 0);
ok("IIFE köprüsü açık (window.__havuzIdCoz)", HTML.indexOf("window.__havuzIdCoz = resolvePoolId") > 0);
ok("sayfa çizimi try/catch ile korunuyor", /Bu sayfa yüklenemedi/.test(HTML));

// ---------- 7) Video bağlantısı metinleri ----------
console.log("\n== 7) Video bağlantısı ==");
esit("konu eşleşmesi: birebir", VC.konuTutar("Fizik > 1.1 Sabit Hızlı Hareket", "Fizik > 1.1 Sabit Hızlı Hareket"), true);
esit("konu eşleşmesi: kazanım konuyu içeriyor",
  VC.konuTutar("Türk Dili ve Edebiyatı > Şiirde Ahenk (Ölçü, Uyak, Redif, Aliterasyon, Asonans)",
    "Türk Dili ve Edebiyatı > Şiirde ahengi sağlayan özellikleri (uyak düzeni, uyak, redif) ile ilgili çalışma yapar."), true);
esit("konu eşleşmesi: alakasız konu", VC.konuTutar("Fizik > 1.1 Sabit Hızlı Hareket", "Kimya > Mol Kavramı"), false);
const ornekDurum = { exams: [{ name: "Okulizyon: Deneme 1", date: "2026-10-27", okulizyonUrl: "https://okulizyon.com/app2/ogrenci/?pg=yks&sid=1",
  errorLogs: [{ lesson: "Matematik", topic: "Üçgende iç ve dış açıortayların özelliklerine ilişkin varsayımda bulunur.", status: "e", videoVar: true, qno: "3" }] }] };
const izl = VC.izlenecekler(ornekDurum, "Matematik > 1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler");
esit("kazanım metni konuya bağlanınca video listesi DOLUYOR", izl.length, 1);
const lk = VC.izleLink(izl[0]);
ok("bağlantı Okulizyon sınav sayfasına gidiyor", lk && lk.href.indexOf("okulizyon.com") > 0, JSON.stringify(lk));
esit("adres yoksa bağlantı null", VC.izleLink({ videoVar: true }), null);
ok("boş durumda 'izle' vaadi yok", HTML.indexOf("Bu konu için <b>henüz çözüm bağlantısı yok</b>") > 0);
ok("sınav düzeyinde çözüm düğmesi var", HTML.indexOf("· çözümler</a>") > 0);

// ---------- 8) Sürüm ----------
console.log("\n== 8) Sürüm ==");
ok("PWA sürümü v35.4", APP.indexOf('const PWA_SURUM = "v35.4-bildirim-video"') === 0);
ok("SW önbelleği yenilendi", fs.readFileSync(path.join(KOK, "site", "sw.js"), "utf8").indexOf("v35-4-bildirim-video") > 0);
ok("SW yeni modülleri önbelleğe alıyor", /ASSETS[\s\S]{0,900}havuz-bul\.js/.test(fs.readFileSync(path.join(KOK, "site", "sw.js"), "utf8")));

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(x => console.log(" ✗ " + x));
  console.log("Konu bulma / kısa kontrol / video — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("Konu bulma / kısa kontrol / video — " + gecen + "/" + gecen + " geçti ✓");
