/* ============================================================
   v48 — KULLANICI BİLDİRDİĞİ 4 SORUN, GERÇEK DAVRANIŞLA ÖLÇÜM
   ------------------------------------------------------------
   1) "Akıllı zorluk filtresi bölümünü kaldır"
   2) "deneme bölümündeki her gelişim grafiği bozuk" (uzun ad ekseni bozuyor)
   3) "soru girişinde otomatik boş hesabı yok" → 10 soru · D8/Y1 → B1 olmalı
   4) "yanlış ve boş nedenleri değişmiş, orjinali böyle değildi"

   Bu dosya index.html'deki GERÇEK kodu (bindQBForm, kisaDenemeEtiketi,
   grafikAyar, WRONG_REASONS/EMPTY_REASONS, reasonLabel) çıkarıp jsdom'da
   çalıştırır: kullanıcının yaptığı gibi input olayları gönderilir.
   Çalıştır: node tests/dom/dom-giris-duzeltme.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ayrinti) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); return true; }
  kalan++; hatalar.push(ad + (ayrinti ? " → " + ayrinti : ""));
  console.log("  ✗ " + ad + (ayrinti ? " → " + ayrinti : ""));
  return false;
}

let w = null, document = null;
try {
  const { JSDOM } = require("jsdom");
  const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://analiz-merkezi.vercel.app/" });
  w = dom.window;
  document = w.document;
} catch (e) {
  console.log("DOM testi ATLANDI: jsdom kurulu değil (npm i -D jsdom)");
  process.exit(0);
}

/* ---- index.html içinden bir fonksiyonu süslü parantez sayarak çıkar ---- */
function fonksiyonCikar(ad) {
  const bas = HTML.indexOf("function " + ad + "(");
  if (bas < 0) return "";
  const ac = HTML.indexOf("{", bas);
  let derinlik = 0, i = ac;
  for (; i < HTML.length; i++) {
    const c = HTML[i];
    if (c === "{") derinlik++;
    else if (c === "}") { derinlik--; if (derinlik === 0) { i++; break; } }
  }
  return HTML.slice(bas, i);
}
function satirCikar(onEk) {
  const i = HTML.indexOf(onEk);
  if (i < 0) return "";
  const son = HTML.indexOf("\n", i);
  return HTML.slice(i, son < 0 ? HTML.length : son);
}

/* ============================================================
   1) AKILLI ZORLUK FİLTRESİ KALDIRILDI MI?
   ============================================================ */
console.log("\n== 1) Akıllı Zorluk Filtresi bölümü kaldırıldı ==");
{
  ok("bölüm başlığı artık YOK", HTML.indexOf("Akıllı Zorluk Filtresi") < 0);
  ok("öneri açıklaması (≤%40 TEMEL · ≤%75 ORTA) YOK", HTML.indexOf("≤%40 TEMEL") < 0);
  const qb = HTML.slice(HTML.indexOf("function renderQuestionBank("), HTML.indexOf("function bindQBForm("));
  ok("Soru Bankası ekranı 'Akıllı' kartı çizmiyor", qb.indexOf("Akıllı") < 0);
  ok("Soru Bankası ekranı difficultyFor çağırmıyor", qb.indexOf("difficultyFor") < 0);
}

/* ============================================================
   2) GRAFİK: uzun sınav adı ekseni bozmuyor
   ============================================================ */
console.log("\n== 2) Grafik etiketleri kısaltılıyor, tam ad ipucunda ==");
{
  const src = fonksiyonCikar("kisaDenemeEtiketi") + "\n" + fonksiyonCikar("grafikAyar");
  ok("kisaDenemeEtiketi bulundu", src.indexOf("function kisaDenemeEtiketi") >= 0);
  ok("grafikAyar bulundu", src.indexOf("function grafikAyar") >= 0);
  const cssVar = () => "#64748B";
  const api = new Function("cssVar", src + "\nreturn { kisaDenemeEtiketi, grafikAyar };")(cssVar);

  const uzun = "Okulizyon: 10.SINIF MAARİF İZLEME SINAVI 1";
  const k = api.kisaDenemeEtiketi(uzun);
  ok("uzun ad 12 karaktere kısalıyor", k.length <= 13, "gelen: " + k + " (" + k.length + ")");
  ok("kısaltmada … var", /…$/.test(k), k);
  ok("'Okulizyon:' öneki atılıyor", k.indexOf("Okulizyon") < 0, k);
  ok("kısa ad bozulmuyor", api.kisaDenemeEtiketi("Özdebir") === "Özdebir");
  ok("boş ad çökmüyor", api.kisaDenemeEtiketi("") === "Deneme");

  const tam = [uzun, "Özdebir"];
  const a = api.grafikAyar(tam);
  ok("x ekseni EĞİK DEĞİL (maxRotation 0)", a.scales.x.ticks.maxRotation === 0);
  ok("x ekseni otomatik seyreltme açık", a.scales.x.ticks.autoSkip === true);
  ok("x etiketi en fazla 6", a.scales.x.ticks.maxTicksLimit === 6);
  ok("grafik taşmıyor (maintainAspectRatio false)", a.maintainAspectRatio === false);
  // İpucu (tooltip) TAM adı göstermeli
  const baslik = a.plugins.tooltip.callbacks.title([{ dataIndex: 0 }]);
  ok("ipucu TAM sınav adını gösteriyor", baslik === uzun, baslik);
  ok("ikinci noktanın ipucu doğru", a.plugins.tooltip.callbacks.title([{ dataIndex: 1 }]) === "Özdebir");
  // Denemelerim ve Ana Sayfa aynı ayarı kullanıyor mu?
  ok("Denemelerim grafiği grafikAyar kullanıyor",
    /exam-chart[\s\S]{0,900}grafikAyar/.test(HTML));
  ok("Ana Sayfa net grafiği de grafikAyar kullanıyor",
    /__dashNet = new Chart[\s\S]{0,700}grafikAyar/.test(HTML));
}

/* ============================================================
   3) SORU GİRİŞİ: OTOMATİK BOŞ (gerçek DOM + gerçek olaylar)
   ============================================================ */
console.log("\n== 3) Soru girişinde otomatik boş hesabı (gerçek DOM) ==");
{
  document.body.innerHTML =
    '<select id="qb-lesson"><option value="">Ders Seç…</option><option value="Matematik">Matematik</option></select>' +
    '<input id="qb-d" type="number"><input id="qb-w" type="number"><input id="qb-e" type="number">' +
    '<input id="qb-total" type="number"><div id="qb-validation"></div><div id="qb-error-area"></div>';

  const src = fonksiyonCikar("bindQBForm");
  ok("bindQBForm bulundu", src.indexOf("function bindQBForm") >= 0, String(src.length));
  // Gerçek kodu koştur: sadece clamp ve updateQBErrors sahte (DOM parçası yok)
  const cagri = { son: null };
  const clamp = (v, a, b) => Math.min(Math.max(Number(v) || 0, a), b);
  const updateQBErrors = (d, w2, e) => { cagri.son = { d, w: w2, e }; };
  const esc = (x) => String(x == null ? "" : x);
  const fn = new Function("document", "clamp", "updateQBErrors", "icon", "esc", src + "\nreturn bindQBForm;");

  const g = id => document.getElementById(id);
  const yaz = (el, v) => { el.value = String(v); el.dispatchEvent(new w.Event("input", { bubbles: true })); };

  // bindQBForm() gerçek kodu koştur (DOM hazır)
  fn(document, clamp, updateQBErrors, () => "", esc)();
  const D = document.getElementById("qb-d"), W = document.getElementById("qb-w"),
        E = document.getElementById("qb-e"), T = document.getElementById("qb-total");

  yaz(T, 10);
  ok("toplam 10 yazıldı", T.value === "10");
  yaz(D, 8);
  ok("D8 → boş otomatik 2", E.value === "2", "gelen boş: " + E.value);
  yaz(W, 1);
  ok("Y1 → boş otomatik 1  (10 − 8 − 1)", E.value === "1", "gelen boş: " + E.value);
  ok("hata satırları doğru sayıda açıldı (D8/Y1/B1)",
    cagri.son && cagri.son.d === 8 && cagri.son.w === 1 && cagri.son.e === 1, JSON.stringify(cagri.son));

  // --- Ters yön: D ve Y'yi artırınca boş düşer, negatife inmez ---
  yaz(D, 10);
  ok("D10/Y1 → boş 0 (negatife inmez)", E.value === "0", "gelen: " + E.value);

  // --- Temiz form, toplam HİÇ yazılmadan: toplam = D+Y+B (eski davranış korunur) ---
  const temizForm = () => {
    document.body.innerHTML =
      '<select id="qb-lesson"><option value="">Ders Seç…</option><option value="Matematik">Matematik</option></select>' +
      '<input id="qb-d" type="number"><input id="qb-w" type="number"><input id="qb-e" type="number">' +
      '<input id="qb-total" type="number"><div id="qb-validation"></div><div id="qb-error-area"></div>';
    document.getElementById("qb-lesson").value = "Matematik";
    fn(document, clamp, updateQBErrors, () => "", esc)();
  };
  temizForm();
  yaz(g("qb-d"), 8); yaz(g("qb-w"), 1); yaz(g("qb-e"), 2);
  ok("toplam yazılmadıysa toplam = D+Y+B (11)", g("qb-total").value === "11", "gelen: " + g("qb-total").value);

  // --- Toplam boşken boş ELLE girilebilmeli (otomatik dayatma yok) ---
  temizForm();
  yaz(g("qb-d"), 8); yaz(g("qb-w"), 1); yaz(g("qb-e"), 3);
  ok("elle boş girilebiliyor (toplam boşken)", g("qb-e").value === "3", "gelen: " + g("qb-e").value);
  ok("toplam buna göre 12", g("qb-total").value === "12", "gelen: " + g("qb-total").value);

  // --- Toplam yazılıyken boş ELLE değiştirilemez (her zaman türetilir) ---
  temizForm();
  yaz(g("qb-total"), 20); yaz(g("qb-d"), 12); yaz(g("qb-e"), 7);
  ok("toplam varken elle boş yazılamaz → 8", g("qb-e").value === "8", "gelen: " + g("qb-e").value);

  // --- Kayıtlı eski veri: boş 0 kalmış, toplam 10 / D8 / Y1 → listede B1 ---
  const qbSrc = fonksiyonCikar("qbBos");
  ok("qbBos bulundu", qbSrc.indexOf("function qbBos") >= 0);
  const qbBos = new Function(qbSrc + "\nreturn qbBos;")();
  ok("eski kayıt 10 soru D8/Y1/B0 → B1 gösterir", qbBos({ total: 10, d: 8, w: 1, e: 0 }) === 1);
  ok("boşu doğru kayıt aynen kalır", qbBos({ total: 10, d: 8, w: 1, e: 1 }) === 1);
  ok("boşu büyük kayıt küçültülmez", qbBos({ total: 10, d: 5, w: 1, e: 4 }) === 4);
}

/* ============================================================
   4) NEDEN LİSTELERİ — ORİJİNAL AYRIM
   ============================================================ */
console.log("\n== 4) Yanlış/boş nedenleri orijinal ayrımda ==");
{
  const wSatir = satirCikar("const WRONG_REASONS =");
  const eSatir = satirCikar("const EMPTY_REASONS =");
  ok("WRONG_REASONS bulundu", wSatir.length > 0);
  ok("EMPTY_REASONS bulundu", eSatir.length > 0);

  const wr = new Function(wSatir.replace("const ", "return ") + ";")();
  const er = new Function(eSatir.replace("const ", "return ") + ";")();

  // 12.10.2026 teslim zip'indeki ORİJİNAL listeler (Süre yetmedi hariç — v35.8'de
  // kullanıcı kendi isteğiyle kaldırttı)
  ok("YANLIŞ = Konuyu Bilmiyordum · Anlamadım · İşlem hatası · Kodlama hatası",
    JSON.stringify(wr) === JSON.stringify(["Konuyu Bilmiyordum", "ANLAMADIM", "İşlem Hatası/Dikkatsizlik", "Kodlama/Kitapçık Hatası"]),
    JSON.stringify(wr));
  ok("BOŞ = Konu eksiği · Çözüm yolunu bulamadım",
    JSON.stringify(er) === JSON.stringify(["KONUEKSİKLİĞİ", "ÇÖZÜMYOLUNUBULAMADIM"]), JSON.stringify(er));
  ok("iki liste AYRI", JSON.stringify(wr) !== JSON.stringify(er));
  ok("'Süre yetmedi' hiçbir listede yok (kullanıcı isteği)",
    wr.concat(er).every(r => !/SÜRE|süre/i.test(r)));
  ok("'Konuyu Bilmiyordum' yeniden YANLIŞ listesinde", wr.includes("Konuyu Bilmiyordum"));
  ok("'Anlamadım' BOŞ listesinde değil (orijinalde yoktu)", !er.includes("ANLAMADIM"));

  // reasonLabel: her seçenek Türkçe etiket göstermeli (kod değil)
  const rl = new Function(fonksiyonCikar("canonicalReason") + "\n" + fonksiyonCikar("reasonLabel") + "\nreturn reasonLabel;")();
  ok("Konuyu Bilmiyordum → 'Konuyu bilmiyordum'", rl("Konuyu Bilmiyordum") === "Konuyu bilmiyordum", rl("Konuyu Bilmiyordum"));
  ok("KONUEKSİKLİĞİ → 'Konu eksiği'", rl("KONUEKSİKLİĞİ") === "Konu eksiği", rl("KONUEKSİKLİĞİ"));
  ok("ANLAMADIM → 'Anlamadım'", rl("ANLAMADIM") === "Anlamadım", rl("ANLAMADIM"));
  ok("ÇÖZÜMYOLUNUBULAMADIM → 'Çözüm yolunu bulamadım'", rl("ÇÖZÜMYOLUNUBULAMADIM") === "Çözüm yolunu bulamadım");
  ok("Konuyu Bilmiyordum artık Konu eksiğine KATLANMIYOR",
    rl("Konuyu Bilmiyordum") !== rl("KONUEKSİKLİĞİ"));

  // Form gerçekten bu listeleri kullanıyor mu? (deneme + soru girişi)
  ok("Deneme formu WRONG/EMPTY listeni kullanıyor",
    /isWrong \? WRONG_REASONS : EMPTY_REASONS/.test(HTML));
  const kullanim = (HTML.match(/isWrong \? WRONG_REASONS : EMPTY_REASONS/g) || []).length;
  ok("hem deneme hem soru girişinde aynı listeler (2 yer)", kullanim === 2, "bulunan: " + kullanim);
}

console.log("\n" + "─".repeat(56));
if (kalan) {
  console.log("✗ " + kalan + " test başarısız:");
  hatalar.forEach(x => console.log("   • " + x));
  console.log("v48 giriş düzeltmeleri — " + gecen + "/" + (gecen + kalan) + " geçti");
  process.exit(1);
}
console.log("v48 giriş düzeltmeleri — " + gecen + "/" + gecen + " geçti ✓");
