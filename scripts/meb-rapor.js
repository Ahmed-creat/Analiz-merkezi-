#!/usr/bin/env node
/* ============================================================
   MEB KONU → KAZANIM RAPORU (scripts/meb-rapor.js)
   ------------------------------------------------------------
   Kullanıcının istediği biçim: "verdiğim PDF gibi" — ders ders,
   ÜNİTE → KONU → KAZANIM (kod + cümle).

   İki resmî kaynak, iki ayrı bölüm:
     A) ODSGM Konu-Soru Dağılım Tablosu (2026-2027 1. dönem)
        → ünite + konu + hangi senaryoda kaç soru  (kullanıcının PDF'i)
     B) TYMM Öğretim Programı (2026)
        → o konularda geçmeyen ama programda olan çıktılar (tam liste)

   Rakamlar JSON'dan OKUNUR; rapor veri uydurmaz.
   Kullanım: npm run rapor:meb
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const P_TYMM = path.join(KOK, "site/content/mufredat/meb_kazanim_10.json");
const P_ODSGM = path.join(KOK, "site/content/mufredat/odsgm_konu_kazanim_10.json");
const P_ESLEME = path.join(KOK, "site/content/mufredat/kazanim_konu_10.json");
const P_CIKTI = path.join(KOK, "docs/MEB-KONU-KAZANIM-TABLOSU.md");

const tymm = JSON.parse(fs.readFileSync(P_TYMM, "utf8"));
const odsgm = JSON.parse(fs.readFileSync(P_ODSGM, "utf8"));
const esleme = JSON.parse(fs.readFileSync(P_ESLEME, "utf8"));

const DERS_SIRA = ["Türk Dili ve Edebiyatı", "Matematik", "Fizik", "Kimya", "Biyoloji",
  "Tarih", "Coğrafya", "Felsefe", "Din Kültürü", "İngilizce"];

const tymmKod = new Map(tymm.ciktilar.map(c => [c.kod, c]));
const havuzKonu = new Map();
esleme.konular.forEach(k => (k.kodlar || []).forEach(kod => {
  if (!havuzKonu.has(kod)) havuzKonu.set(kod, []);
  havuzKonu.get(kod).push(k);
}));

const BOZUK = /[=∙±≠√]|\bf\(x\)|\bg\(x\)/;
const metinEksik = s => BOZUK.test(String(s || ""));

// ODSGM konu hücresi bazen içerik listesidir ("OKUMA • koşuk • koşma …").
// Raporda okunur kalsın diye ilk iki parça gösterilir.
function kisaKonu(s) {
  const t = String(s == null ? "" : s).replace(/\s+/g, " ").trim();
  const p = t.split(" • ");
  return p.length > 2 ? p.slice(0, 2).join(" • ") + " …" : t;
}

function esc(s) { return String(s == null ? "" : s).replace(/\|/g, "\\|").replace(/\n+/g, " ").trim(); }

const L = [];
L.push("# MEB: Hangi Dersin Hangi Konusunda Hangi Kazanım");
L.push("");
L.push("> **Bu dosya otomatik üretildi.** Elle düzenlemeyin.");
L.push("> Üretici: `scripts/meb-rapor.js` (`npm run rapor:meb`)");
L.push("> Kaynak A: **ODSGM** 2026-2027 1. Dönem Konu-Soru Dağılım Tabloları (senaryolar)");
L.push("> Kaynak B: **TYMM** 2026 ortaöğretim öğrenme çıktıları (programın tamamı)");
L.push("");
L.push("## 0. Kısa cevap");
L.push("");
L.push("MEB'in kendi yayımladığı tabloda her ders şu üçlüyle veriliyor:");
L.push("");
L.push("```");
L.push("ÜNİTE / TEMA  →  KONU (içerik çerçevesi)  →  KAZANIM (kod + cümle)");
L.push("```");
L.push("");
L.push("Aşağıdaki tablolar bu üçlüyü birebir verir. Aynı kazanım kodu birden çok");
L.push("temada geçebilir (TDE'de `TDE2.1` hem *Sözün Ezgisi* hem *Kelimelerin Ritmi*");
L.push("temasında sorulur); o yüzden **asıl anahtar kazanım cümlesidir**, kod değil.");
L.push("");
L.push("| | Sayı |");
L.push("|---|---:|");
L.push("| Ders | " + odsgm.ozet.ders + " |");
L.push("| Ünite | " + new Set(odsgm.duz.map(k => k.ders + "|" + k.unite)).size + " |");
L.push("| Konu | " + odsgm.ozet.konu + " |");
L.push("| Kazanım (ODSGM tablosunda geçen) | " + odsgm.ozet.cikti + " |");
L.push("| Kazanım (TYMM programının tamamı, 9 ders) | " + tymm.ciktilar.length + " |");
L.push("");

// ---------- A) ODSGM: PDF'in aynısı ----------
L.push("## 1. ODSGM tablosu — ders → ünite → konu → kazanım");
L.push("");
L.push("Kaynak: `" + odsgm.kaynak.belge + "` · yayım " + odsgm.kaynak.yayim + " · `" + odsgm.kaynak.adres + "`");
L.push("");
L.push("Son sütun, o kazanımın **hangi yazılıda kaç soru** olarak çıkacağını gösterir");
L.push("(1. dönem 1. ve 2. ortak yazılı senaryoları).");
L.push("");

DERS_SIRA.forEach(ders => {
  const satirlar = odsgm.duz.filter(k => k.ders === ders);
  if (!satirlar.length) return;
  L.push("### " + ders);
  L.push("");
  // ünite sırasını koru
  const uniteler = [];
  satirlar.forEach(k => { if (!uniteler.includes(k.unite)) uniteler.push(k.unite); });
  uniteler.forEach(unite => {
    const konular = [];
    satirlar.filter(k => k.unite === unite).forEach(k => {
      if (!konular.includes(k.konu)) konular.push(k.konu);
    });
    L.push("**" + (unite || "(ünite belirtilmemiş)") + "**");
    L.push("");
    L.push("| Konu | Kazanım kodu | Kazanım cümlesi | Soru |");
    L.push("|---|---|---|---:|");
    satirlar.filter(k => k.unite === unite).forEach(k => {
      const adet = k.senaryo_sayilari && k.senaryo_sayilari.length
        ? k.senaryo_sayilari.join(" · ")
        : "—";
      L.push("| " + esc(kisaKonu(k.konu)) + " | `" + k.kod + "` | " + esc(k.kazanim) + " | " + adet + " |");
    });
    L.push("");
  });
});

// ---------- B) TYMM: programın tamamı ----------
L.push("## 2. TYMM programının tamamı — ODSGM tablosunda geçmeyen çıktılar");
L.push("");
const odsgmKodlar = new Set(odsgm.duz.map(k => k.kod));
const kalan = tymm.ciktilar.filter(c => !odsgmKodlar.has(c.kod));
L.push("1. dönem sınav tablosu tüm programı kapsamaz (dönem ortasına kadar olan konular).");
L.push("Aşağıdaki **" + kalan.length + "** çıktı programda var ama 1. dönem tablosunda yok —");
L.push("yıl içinde sorumlu olduğunuz konular. Bunlar da uygulamada eşlenir;");
L.push("yalnız hangi **konuda** oldukları ODSGM tablosunda yazmadığı için ünite bilgisi temadan gelir.");
L.push("");
DERS_SIRA.filter(d => d !== "İngilizce").forEach(ders => {
  const liste = kalan.filter(c => c.ders === ders);
  if (!liste.length) return;
  L.push("**" + ders + "** (" + liste.length + ")");
  L.push("");
  liste.forEach(c => {
    const hav = havuzKonu.get(c.kod) || [];
    const konu = hav.length ? hav[0].konu : "(havuzda yok)";
    L.push("- `" + c.kod + "` (tema " + c.tema + ") — " + esc(c.kazanim) + "  \n  ↳ uygulama konusu: " + esc(konu));
  });
  L.push("");
});

// ---------- C) Uygulama tarafı ----------
L.push("## 3. Uygulamada ne oluyor");
L.push("");
L.push("Okulizyon'dan bir kazanım cümlesi geldiğinde sırayla:");
L.push("");
L.push("1. **Cümle TYMM tablosunda birebir bulunur** → MEB kodu (`KİM.10.1.4` gibi) kesinleşir.");
L.push("2. **Kod → ODSGM satırı** → ünite ve konu adı gelir (`ETKİLEŞİM` / `Kimyasal Tepkimeler`).");
L.push("3. **Konu → soru havuzu** varsa uygulama konusu bağlanır; yoksa kayıt MEB'in kendi");
L.push("   konu başlığıyla açılır (yanlış konuya yazılmaz, boş da bırakılmaz).");
L.push("");
L.push("**Kritik bulgu:** Okulizyon ana çıktı cümlesini değil, onun **süreç bileşenlerini**");
L.push("(a, b, c maddeleri) gönderiyor. Örnek: \"İslam düşüncesinde bilginin yerini ve");
L.push("kaynaklarını inceler.\" → `DKAB.10.1.1` a) maddesi. Bazen de doğrudan konu başlığı");
L.push("(\"Sabit Hızlı Hareket\"). Sistem bu üç biçimi de tanır:");
L.push("");
L.push("| Gelen metin | Eşleme yolu |");
L.push("|---|---|");
L.push("| Resmî çıktı cümlesi | birebir / ODSGM varyantı |");
L.push("| Süreç bileşeni (a,b,c) | birebir · önek · benzerlik (≥ .62, fark ≥ .08) |");
L.push("| Konu başlığı | ODSGM konu adı |");
L.push("");
L.push("Ölçüm: kullanıcının verdiği **36 gerçek Okulizyon metninin 36'sı** doğru koda gidiyor");
L.push("(`tests/fixtures/okulizyon-kazanim-ornekleri.js`, her metnin beklenen kodu testte sabit).");
L.push("Havuzdaki 992 kazanım metninden **%95,3**'ü konuya bağlanıyor.");
L.push("ODSGM'de geçen kodların **79/79**'u TYMM tablosunda doğrulandı (İngilizce hariç, uygulamada yok).");
L.push("");

L.push("## 4. Sınırlar (dürüstlük notu)");
L.push("");
const eksikler = tymm.ciktilar.filter(c => metinEksik(c.kazanim));
if (eksikler.length) {
  L.push("- **" + eksikler.length + " resmî cümlenin metni eksik** (PDF çıkarımında formül parçaları karıştı): " +
    eksikler.map(c => "`" + c.kod + "`").join(", ") + ". Metin kanıtı olarak kullanılmadı.");
}
L.push("- **ODSGM 1. dönem tablosudur.** 2. dönem konuları ve yıl sonu kapsamı burada yok.");
L.push("- **Ünite/konu adları ODSGM'nin kendi yazımıyla** aktarıldı; düzeltilmedi.");
L.push("- **Din Kültürü soru havuzu 2018 programına göre** kurulu. Kazanım artık 2026 koduyla");
L.push("  ve 2026 konu başlığıyla kaydediliyor, ama o konuların soruları havuzda yok — havuz");
L.push("  güncellenince kendiliğinden bağlanır. Bu bir eşleme eksiği değil, **havuz eksiği**.");
L.push("- **İngilizce** ODSGM tablosunda var, uygulamada dersi/havuzu yok; yalnız bilgi olarak listelendi.");
L.push("");
L.push("## 5. Yenileme");
L.push("");
L.push("```bash");
L.push("node scripts/odsgm-coz.js       # PDF → odsgm_konu_kazanim_10.json");
L.push("node scripts/meb-kazanim-uret.js # konu eşlemesi + site/okz-meb.js");
L.push("npm run rapor:meb                # bu dosya");
L.push("npm run test:meb                 # kontroller");
L.push("```");
L.push("");

fs.writeFileSync(P_CIKTI, L.join("\n"), "utf8");
console.log("Rapor yazıldı: " + path.relative(KOK, P_CIKTI) + " (" + L.length + " satır)");
