#!/usr/bin/env node
/* ============================================================
   v44 — BİLDİRİM ZİNCİRİ ve TEK KAYIT KURALI
   ------------------------------------------------------------
   Kullanıcının üç isteği ölçülür:

   1) "Okulizyon seçiminde okulizyondaki gibi yazma da olsun (arama)."
      → Profildeki il/ilçe/okul artık yazarak aranan bileşen.
        Davranışı tests/dom/dom-okz-secim.test.js GERÇEK DOM'da ölçer;
        burada sözleşme (kaynak) ölçülür.

   2) "Bilgiler hem localStorage hem bulut hem Supabase'de depolanınca
      karmaşıklık oluyor; güncel uygulamalar nasıl yapıyorsa öyle yap."
      → Tek yazıcı (single-flight), kısa debounce, ölü anahtar temizliği.
        Eşzamanlılık davranışı aşağıda GERÇEKTEN koşturularak ölçülür.

   3) "Bildirim çalışmıyor, sadece ayarlardan tıklayınca test geliyor."
      → Kök neden: ayarlardaki test YEREL gösterimdir (pil/kanal yok).
        Gerçek push, sunucunun İMZA ANAHTARI ile aboneliğin anahtarı
        ayrışırsa 201 döner ama tarayıcı sessizce düşürür.
        Çözüm sözleşmesi: sunucu imza anahtarını yayınlar, uygulama
        aboneliği ONUNLA kurar.
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const KOK = path.join(__dirname, "..");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const PUSH = fs.readFileSync(path.join(KOK, "site", "push-bildirim.js"), "utf8");
const SABLON = fs.readFileSync(path.join(KOK, "supabase", "functions", "bildirim-gonder", "sablon.ts"), "utf8");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) { gecen++; return true; } kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); return false; }

console.log("\n== 1) Okulizyon seçimi: YAZARAK ARAMA ==");
ok("arama kutusu bileşeni var", APP.indexOf("okz-arama-girdi") > 0);
ok("harf yazınca süzülüyor (input olayı)", /document\.addEventListener\("input"/.test(APP) && APP.indexOf("okzAramaCiz(kok, e.target.value)") > 0);
ok("Türkçe harf farkı aramayı bozmuyor", APP.indexOf("const okzNorm") > 0 && APP.indexOf("n.startsWith(q)") > 0);
ok("klavyeyle seçim (ok tuşları + Enter)", APP.indexOf("ArrowDown") > 0 && APP.indexOf("ArrowUp") > 0 && APP.indexOf('e.key === "Enter"') > 0);
ok("seçim gizli alanda korunuyor (kaydet bozulmasın)", APP.indexOf('type="hidden" id="okz-\' + id') > 0 || APP.indexOf('id="okz-\' + id') > 0);
ok("uzun okul listesi kırpılıyor (performans sınırı var)", /EN_FAZLA = \d+/.test(APP));
ok("il değişince ilçe/okul temizleniyor", APP.indexOf("function okzAramaAltSifirla") > 0 && APP.indexOf('okzAramaAltSifirla("ilce"') > 0);

console.log("\n== 2) DEPOLAMA: tek yazıcı, tek kopya ==");
ok("tek yazıcı (single-flight) var", APP.indexOf("if (yazmaUcusu) { yazmaBekliyor = true; return yazmaUcusu; }") > 0);
ok("uçuş sırasında gelen değişiklik bir kez daha yazılır", APP.indexOf("if (yazmaBekliyor) { yazmaBekliyor = false;") > 0);
ok("app_states'e YALNIZ tek yerden yazılıyor", (APP.match(/from\("app_states"\)\.upsert/g) || []).length === 1,
   "upsert sayısı: " + (APP.match(/from\("app_states"\)\.upsert/g) || []).length);
ok("kısa debounce (1.5 sn), 4 sn değil", APP.indexOf("yazmaPlanla(1500)") > 0 && APP.indexOf("setTimeout(senkronizeEt, 4000)") < 0);
ok("çevrimdışı birikimi tek yazmaya iner", APP.indexOf('addEventListener("online", () => yazmaPlanla(800))') > 0);
ok("sayfa kapanırken kaybolmuyor", APP.indexOf('addEventListener("pagehide"') > 0);
ok("ölü localStorage anahtarları temizleniyor", APP.indexOf("function eskiAnahtarlariTemizle") > 0);
ok("açılış kapısı işareti artık yazılmıyor", HTML.indexOf('setItem("am_giris_yapildi"') < 0);
ok("uzak kaydın zamanı biliniyor (bayat sekme ezmez)", APP.indexOf("sonUzakYazma = bulutZaman(data.updated_at)") > 0);

console.log("\n== 3) BİLDİRİM: sunucu ↔ tarayıcı anahtar anlaşması ==");
ok("sunucu imza anahtarını yayınlıyor", SABLON.indexOf("acikAnahtar: imzaAnahtari") > 0);
ok("imza anahtarı ÖZEL anahtardan türetiliyor", SABLON.indexOf("const imzaAnahtari = turetilen || VAPID_ACIK") > 0);
ok("uygulama anahtarı sunucudan alıyor", PUSH.indexOf("async function sunucuVapid()") > 0);
ok("abonelik SUNUCU anahtarıyla kuruluyor", PUSH.indexOf("const kullanilacak = sunucuAnahtar || VAPID_ACIK") > 0);
// v61 — karşılaştırma artık `anahtarAyni` değişkeninde; tarayıcı anahtarı
// OKUYAMAZSA cihazda saklanan anahtarla kıyaslanır (yoksa her açılışta yeni
// uç nokta doğuyordu: aynı kullanıcıda 6 aktif abonelik).
ok("anahtar değişmişse abonelik yenileniyor",
  PUSH.indexOf("anahtarAyni = b64Yaz(mevcut) === kullanilacak") > 0 &&
  PUSH.indexOf("if (!anahtarAyni) {") > 0);
ok("anahtar çakışmasında zorla sıfırlayıp yeniden dener", PUSH.indexOf("await eski.unsubscribe()") > 0);
// v54: 8 deneme (32 sn) yavaş açılışta yetmiyordu; sınır yükseltildi.
// Test sabit sayıya bağlı kalmasın: "vazgeçmeden yeniden deniyor" ölçülür.
ok("oturum geç gelirse vazgeçmiyor (yeniden dener)", /if \(otomatikDeneme\+\+ < \d+\) setTimeout\(otomatik, \d+\)/.test(PUSH));
ok("tek dokunuşluk onarım var", PUSH.indexOf("async function yenile()") > 0 && APP.indexOf('a === "amBildirimOnar"') > 0);
ok("durum metni sunucu + cihazı KARŞILAŞTIRIYOR", APP.indexOf("sunucuSonGonderim") > 0 && APP.indexOf("cihaz aldı") > 0);
ok("hatırlatma saatleri yazılı (v59: günde 2 vardiya)", APP.indexOf("sabah 07:35 · akşam 19:30") > 0);

console.log("\n== 4) TEK YAZICI DAVRANIŞI (koşturularak) ==");
// Gerçek kodu jsdom'suz, küçük bir sahte Supabase ile koştur.
(async () => {
  const dom = require("path").join(__dirname, "..", "node_modules");
  let JSDOM = null;
  try { ({ JSDOM } = require("jsdom")); } catch (e) { /* yoksa normal global kullanılır */ }

  const i = APP.indexOf("let yazmaUcusu = null;");
  const j = APP.indexOf("function hookSaveState()", i);
  const blok = APP.slice(i, j);

  let esZamanli = 0, enFazla = 0, yazma = 0;
  const sbSahte = {
    from: () => ({
      upsert: async () => {
        esZamanli++; enFazla = Math.max(enFazla, esZamanli); yazma++;
        await new Promise(r => setTimeout(r, 25));
        esZamanli--;
        return { error: null };
      }
    })
  };
  /* v106 — bulutaYaz artık kasa zarfını hazırlıyor (KASA modülü + window
     köprüsü). Test ortamında "kasa kapalı" davranışı taklit edilir; ölçülen
     şey (tek yazıcı/debounce) değişmiyor. */
  const kapsam = {
    sb: sbSahte, currentUser: { id: "u1", email: "a@b.c" }, state: { exams: [] },
    setAuthLabel: () => {}, document: { getElementById: () => null },
    console, setTimeout, clearTimeout, Date,
    window: { __kasa: { durum: () => ({ acik: false, var: false }), uyari: () => {} } },
    KASA: { kasaAcikMi: () => false },
    kasaZarfHazirla: async (n) => ({ zarf: null, duz: n }),
    kasaKayitAc: async (h) => ({ state: h, durum: "duz" })
  };
  const fn = new Function("kapsam", "with (kapsam) { " + blok + "\n return { bulutaYaz, yazmaPlanla }; }");
  const A = fn(kapsam);

  // 12 hızlı kaydetme → debounce birleştirmeli, eşzamanlı yazma OLMAMALI
  for (let k = 0; k < 12; k++) A.yazmaPlanla(5);
  await new Promise(r => setTimeout(r, 120));
  ok("12 hızlı değişiklik → tek yazma", yazma === 1, "yazma: " + yazma);
  ok("aynı anda asla 2 yazma yok", enFazla <= 1, "en fazla eşzamanlı: " + enFazla);

  // uçuş sırasında gelen değişiklik → bitince BİR kez daha
  const p1 = A.bulutaYaz(true);
  A.yazmaPlanla(1); A.yazmaPlanla(1); A.yazmaPlanla(1);
  await p1;
  await new Promise(r => setTimeout(r, 200));
  // ilk yazma + birleşmiş kuyruk = 2 yazma (3 ayrı istek ATILMAZ)
  ok("uçuş sırasındaki değişiklik kaybolmuyor", yazma === 2, "toplam yazma: " + yazma);
  ok("kuyruk birleşiyor (3 ayrı yazma olmuyor)", yazma < 5, "toplam yazma: " + yazma);
  ok("eşzamanlılık yine 1", enFazla === 1, "en fazla: " + enFazla);

  console.log("\n" + "─".repeat(56));
  if (kalan) {
    hatalar.forEach(x => console.log("  ✗ " + x));
    console.log("v44 testi — " + gecen + "/" + (gecen + kalan) + " geçti");
    process.exit(1);
  }
  console.log("v44 testi — " + gecen + "/" + gecen + " geçti ✓");
})();
