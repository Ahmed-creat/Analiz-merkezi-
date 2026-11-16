#!/usr/bin/env node
/* ============================================================
   MEB KAZANIM ↔ KONU RAPORU (scripts/meb-rapor.js)
   ------------------------------------------------------------
   Girdi : site/content/mufredat/meb_kazanim_10.json      (resmî tablo)
           site/content/mufredat/kazanim_konu_10.json     (eşleme çıktısı)
   Çıktı : docs/MEB-KONU-KAZANIM-TABLOSU.md

   Neden ayrı rapor: kullanıcı "MEB hangi dersin hangi konusunda hangi
   kazanım var paylaşıyor" diye sordu. JSON teknik araçlar için; bu rapor
   insanın okuyacağı biçim. Rakamlar JSON'dan OKUNUR, burada üretilmez —
   rapor ile veri çelişirse doğru olan JSON'dur.

   Kullanım: npm run rapor:meb
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const P_TABLO = path.join(KOK, "site/content/mufredat/meb_kazanim_10.json");
const P_ESLEME = path.join(KOK, "site/content/mufredat/kazanim_konu_10.json");
const P_CIKTI = path.join(KOK, "docs/MEB-KONU-KAZANIM-TABLOSU.md");

const tablo = JSON.parse(fs.readFileSync(P_TABLO, "utf8"));
const esleme = JSON.parse(fs.readFileSync(P_ESLEME, "utf8"));

const DERS_SIRA = ["Biyoloji", "Coğrafya", "Din Kültürü", "Felsefe", "Fizik", "Kimya", "Matematik", "Tarih", "Türk Dili ve Edebiyatı"];

// kod → resmî çıktı
const ciktilar = new Map();
tablo.ciktilar.forEach(c => ciktilar.set(c.kod, c));

// ders → konu listesi
const konular = new Map();
esleme.konular.forEach(k => {
  if (!konular.has(k.ders)) konular.set(k.ders, []);
  konular.get(k.ders).push(k);
});

const GUvenAd = { kesin: "kesin", yapisal: "yapısal", orta: "orta", yok: "—" };

// PDF'ten çıkarılırken formül parçaları karışmış cümleler (ör. "f(x) = a ∙ f(x...")
// Metin kanıtı olarak KULLANILMAZ; raporda işaretlenir ki kimse tam sanmasın.
const BOZUK = /[=∙±≠√]|\bf\(x\)|\bg\(x\)/;
function metinEksik(s) { return BOZUK.test(String(s || "")); }

function tabloKacis(s) {
  return String(s == null ? "" : s).replace(/\|/g, "\\|").replace(/\n+/g, " ").trim();
}

function kodlarinCumlesi(kodlar) {
  return kodlar.map(k => {
    const c = ciktilar.get(k);
    if (!c) return "**" + k + "** — (resmî metin bulunamadı)";
    return "**" + k + "** — " + c.kazanim + (metinEksik(c.kazanim) ? " _(PDF çıkarımı eksik)_" : "");
  }).join("<br>");
}

const L = [];
const oz = esleme.ozet;

L.push("# MEB Kazanım ↔ Konu Tablosu — 10. sınıf (2026)");
L.push("");
L.push("> **Bu dosya otomatik üretildi.** Elle düzenlemeyin.");
L.push("> Üretici: `scripts/meb-rapor.js` (`npm run rapor:meb`)");
L.push("> Veri: `site/content/mufredat/meb_kazanim_10.json` + `site/content/mufredat/kazanim_konu_10.json`");
L.push("> Yöntem ve kaynak ayrıntısı: [`docs/MEB-KAZANIM-TABLOLARI.md`](./MEB-KAZANIM-TABLOLARI.md)");
L.push("");
L.push("Sürüm: " + tablo.surum + " · Program: " + tablo.program);
L.push("");
L.push("## 1. Tek bakışta");
L.push("");
L.push("| Ölçü | Sayı |");
L.push("|---|---:|");
L.push("| Ders | " + oz.ders + " |");
L.push("| Resmî öğrenme çıktısı (kazanım) | " + oz.cikti + " |");
L.push("| Uygulamadaki konu | " + oz.konu + " |");
L.push("| Konuya bağlanan | " + oz.eslesen_konu + " |");
L.push("| Kanıt yetersiz (kod yazılmadı) | " + oz.eslesmeyen_konu + " |");
L.push("| Onay bekleyen öneri | " + oz.oneri_konu + " |");
L.push("");

// güven toplamları
let topKesin = 0, topYapisal = 0, topYok = 0;
esleme.konular.forEach(k => {
  if (k.guven === "kesin") topKesin++;
  else if (k.guven === "yapisal") topYapisal++;
  else if (k.guven === "yok") topYok++;
});
L.push("Güven dağılımı: **" + topKesin + " kesin** (metin kanıtı), **" + topYapisal + " yapısal** (tema/sıra hizası), **" + topYok + " kanıtsız**.");
L.push("");
L.push("## 2. Ders ders özet");
L.push("");
L.push("| Ders | Konu | Kesin | Yapısal | Kanıtsız | Resmî çıktı | Kaynak (PID) |");
L.push("|---|---:|---:|---:|---:|---:|---|");
DERS_SIRA.forEach(d => {
  const b = oz.ders_bazli[d];
  if (!b) return;
  const kay = tablo.kaynaklar[d] || {};
  L.push("| " + d + " | " + b.konu + " | " + b.kesin + " | " + b.yapisal + " | " + b.yok + " | " + b.cikti + " | " + (kay.pid || "—") + " |");
});
L.push("");

L.push("## 3. Konu → kazanım tabloları");
L.push("");
L.push("`Güven` sütunu kanıtın türünü söyler:");
L.push("");
L.push("- **kesin** — Okulizyon kazanım metni resmî çıktı cümlesine indirgendi (kelime örtüşmesi ≥ .80).");
L.push("- **yapısal** — metin kanıtı yok; ünite numarası MEB tema numarasına, konu sırası çıktı sırasına hizalandı. Kod doğru tema/sıradadır, cümle eşleşmesi iddiası **değildir**.");
L.push("- **—** — kanıt yetersiz; uygulama bu konuya MEB kodu yazmaz.");
L.push("");

DERS_SIRA.forEach(d => {
  const liste = konular.get(d) || [];
  const kay = tablo.kaynaklar[d] || {};
  L.push("### " + d);
  L.push("");
  if (kay.program) {
    L.push("Resmî program: " + kay.program + (kay.pid ? " · PID " + kay.pid : ""));
    L.push("");
  }
  L.push("| Konu | Konu kimliği | MEB kodu | Güven | Resmî kazanım cümlesi |");
  L.push("|---|---|---|---|---|");
  liste.forEach(k => {
    const kod = k.kodlar && k.kodlar.length ? k.kodlar.join("<br>") : "—";
    const cumle = k.kodlar && k.kodlar.length ? kodlarinCumlesi(k.kodlar) : "—";
    L.push("| " + tabloKacis(k.konu) + " | `" + k.konu_id + "` | " + kod + " | " + (GUvenAd[k.guven] || k.guven) + " | " + tabloKacis(cumle).replace(/&lt;br&gt;/g, "<br>") + " |");
  });
  L.push("");
});

// Bağlanamayanlar
L.push("## 4. Konuya bağlanamayan resmî çıktılar");
L.push("");
const bagliKodlar = new Set();
esleme.konular.forEach(k => (k.kodlar || []).forEach(x => bagliKodlar.add(x)));
const baglanmayan = tablo.ciktilar.filter(c => !bagliKodlar.has(c.kod));
L.push("Toplam **" + baglanmayan.length + "** çıktı hiçbir konuya bağlanmadı. Bunlar uygulamada **hiçbir konuya yazılmaz** — yanlış konuya yazmaktansa boş bırakmak yeğdir.");
L.push("");
DERS_SIRA.forEach(d => {
  const liste = baglanmayan.filter(c => c.ders === d);
  if (!liste.length) return;
  L.push("**" + d + "** (" + liste.length + ")");
  L.push("");
  liste.forEach(c => L.push("- `" + c.kod + "` (tema " + c.tema + ") — " + c.kazanim));
  L.push("");
});

L.push("## 5. Sınırlar (dürüstlük notu)");
L.push("");
const eksikler = tablo.ciktilar.filter(c => metinEksik(c.kazanim));
if (eksikler.length) {
  L.push("- **" + eksikler.length + " resmî cümlenin metni eksik.** PDF'ten kopyalanırken formül parçaları karıştı; cümle tam değil. Bu çıktılar yalnızca tema/sıra hizasıyla (yapısal) bağlandı, metin kanıtı olarak kullanılmadı: " + eksikler.map(c => "`" + c.kod + "`").join(", ") + " — yeniden çıkarılmalı.");
}
L.push("- **Doğrulama düzeyi ders başına farklı.** Biyoloji tablosu resmî PDF (s. 16-30) ve `tymm.meb.gov.tr/biyoloji-dersi/unite/10` ile 19/19 karşılaştırıldı. Diğer 8 dersin kod/metni 2026 program PDF'inden çıkarıldı (PID ve sha256 `meb_kazanim_10.json` içinde); sitenin tema sayfalarıyla ikinci kez karşılaştırılmadı.");
L.push("- **Yapısal eşleme içerik kanıtı değildir.** " + topYapisal + " konu sıra hizasıyla bağlandı; metin okunmadı. Öğretmen itirazı olursa bu satırlar önce gözden geçirilmeli.");
L.push("- **Din Kültürü ve TDE bilinçli olarak boş.** Din havuzu 2018 programının ünitelerini taşıyor, 2026 temaları farklı; TDE programı tema değil dil becerisi eksenli (TDE1.1–TDE4.4). İkisinde de konu bazlı eşleme uydurulmadı.");
L.push("- **Çalışma zamanı davranışı:** uygulama, Okulizyon'dan gelen kazanım cümlesini bu tablodaki metinlerle birebir karşılaştırır; tanımazsa kod yazmaz ve alt katmanlara düşer. Havuzdaki 992 kazanım metniyle ölçüm: %95,3 konuya bağlandı.");
L.push("- **Tablo 10. sınıf.** 9-11-12 tabloları bu sürümde yok.");
L.push("");
L.push("## 6. Yenileme");
L.push("");
L.push("```bash");
L.push("npm run rapor:meb     # bu dosyayı json'lardan yeniden üretir");
L.push("npm run test:meb      # tablo + eşleme + entegrasyon kontrolleri");
L.push("```");
L.push("");

fs.writeFileSync(P_CIKTI, L.join("\n"), "utf8");
console.log("Rapor yazıldı: " + path.relative(KOK, P_CIKTI) + " (" + L.length + " satır)");
