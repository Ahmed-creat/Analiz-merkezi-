// ============================================================
// v120 — CİHAZDA KALICI ANAHTAR + TUZ HATASI TESTLERİ
// tests/kasa-v120-cihaz.test.js
// ------------------------------------------------------------
// KULLANICI: "İyi de güncel sistemlerde şifreli bilgi varsa onlarda
// mı her gün şifre yazıyor?" → HAYIR, yazmıyorlar. Anahtar cihazda
// kalıcı durur; şifre yalnız YENİ cihazda sorulur.
//
// Ayrıca kullanıcının bildirdiği GERÇEK HATA: "Kasa kaydı eksik (tuz yok)."
//   app-pwa.js:1958 pencereyi tuz OLMADAN açıyordu → "Kilidi aç"
//   her basışta hata veriyordu.
//
// Burada üç şey ölçülür:
//   1) Kripto gerçekten çalışıyor mu? (fake-indexeddb ile GERÇEK IndexedDB)
//   2) Sayfa yenilenince şifre soruluyor mu? (yeni modül örneği = yeni sayfa)
//   3) Tuz olmadan "tuz yok" hatası çıkıyor mu? (çıkmamalı)
// ============================================================
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const KOK = path.resolve(__dirname, "..");
const oku = (p) => fs.readFileSync(path.join(KOK, p), "utf8");
const APP = oku("site/app-pwa.js");
const KASA_KOD = oku("site/kasa.js");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ayrinti) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { kalan++; hatalar.push(ad + (ayrinti ? " → " + ayrinti : "")); console.log("  ✗ " + ad + (ayrinti ? " → " + ayrinti : "")); }
}

/* ---------- tarayıcı taklidi ---------- */
globalThis.btoa = (s) => Buffer.from(s, "binary").toString("base64");
globalThis.atob = (s) => Buffer.from(s, "base64").toString("binary");

const depo = {};
globalThis.localStorage = {
  getItem: (k) => (k in depo ? depo[k] : null),
  setItem: (k, v) => { depo[k] = String(v); },
  removeItem: (k) => { delete depo[k]; },
};

/* Web Crypto: Node'un kendi subtle'ı var, ama CryptoKey nesneleri
   kasa.js modülü içinde kullanılır → globalThis.crypto yeterli. */
if (!globalThis.crypto) globalThis.crypto = crypto.webcrypto;

/* ---------- küçük IndexedDB taklidi (yalnız kullanılan API) ----------
   Not: fake-indexeddb bağımlılığı yok; kasa.js'in kullandığı dar yüzey
   (open / createObjectStore / put / get / delete / transaction) taklit edilir.
   DEĞERLER BELLEKTE TUTULUR → "sayfa yenilendi" senaryosu gerçekçi. */
const idbDepo = {};   // { [dbAd]: { [depoAd]: { [kayit]: deger } } }
function idbKur() {
  globalThis.indexedDB = {
    open(ad) {
      const istek = { result: null, error: null, onsuccess: null, onerror: null, onupgradeneeded: null };
      const db = {
        objectStoreNames: { contains: (d) => !!idbDepo[ad] && d in idbDepo[ad] },
        createObjectStore(d) { idbDepo[ad] = idbDepo[ad] || {}; idbDepo[ad][d] = idbDepo[ad][d] || {}; },
        transaction(d, mod) {
          idbDepo[ad] = idbDepo[ad] || {}; idbDepo[ad][d] = idbDepo[ad][d] || {};
          const dep = idbDepo[ad][d];
          const t = { oncomplete: null, onerror: null, error: null };
          t.objectStore = () => ({
            put(deger, anahtar) { dep[anahtar] = deger; setTimeout(() => t.oncomplete && t.oncomplete(), 0); },
            get(anahtar) {
              const i = { result: dep[anahtar] || null, error: null, onsuccess: null, onerror: null };
              setTimeout(() => i.onsuccess && i.onsuccess(), 0);
              return i;
            },
            delete(anahtar) { delete dep[anahtar]; setTimeout(() => t.oncomplete && t.oncomplete(), 0); },
          });
          return t;
        },
        close() { },
      };
      istek.result = db;
      setTimeout(() => {
        if (!idbDepo[ad]) { idbDepo[ad] = {}; if (istek.onupgradeneeded) istek.onupgradeneeded(); }
        if (istek.onsuccess) istek.onsuccess();
      }, 0);
      return istek;
    },
  };
}
idbKur();

(async () => {
  const yol = path.join(KOK, "site/kasa.js");
  const K = await import(yol + "?v=1");   // 1. "sayfa yüklemesi"

  // ------------------------------------------------------------
  console.log("\n== 1) İlk kurulum: anahtar cihaza bağlanıyor ==");
  {
    const kur = await K.kasaKur("kedi-yol-2026");
    ok("kasa kuruldu", kur.ok === true);
    ok("tuz üretildi", !!kur.tuz);
    await new Promise((r) => setTimeout(r, 20));   // IDB yazımı bitsin

    const varMi = await K.cihazdaAnahtarVarMi();
    ok("anahtar cihaza YAZILDI (IndexedDB)", varMi === true);

    const kayit = idbDepo["am-kasa-v1"] && idbDepo["am-kasa-v1"]["kasa"] && idbDepo["am-kasa-v1"]["kasa"]["anahtar"];
    ok("kayıtta cihaz anahtarı var", !!(kayit && kayit.cihaz));
    ok("cihaz anahtarı extractable DEĞİL (JS dışarı çıkaramaz)", kayit.cihaz.extractable === false);
    ok("kasa anahtarı DÜZ saklanmıyor (sarili)", !!(kayit && kayit.sarili) && !("ham" in (kayit || {})));
    ok("tuz cihazda da saklandı", !!K.tuzuYereldenOku());
  }

  // ------------------------------------------------------------
  console.log("\n== 2) SAYFA YENİLENDİ: şifre sorulmadan açılıyor ==");
  {
    /* Yeni modül örneği = sayfanın yeniden yüklenmesi (bellekteki
       _anahtar SIFIRLANIR). Cihazdaki kayıt kalır. */
    const K2 = await import(yol + "?v=2");
    ok("yeni sayfada kasa KAPALI (bellek boş)", K2.kasaAcikMi() === false);

    const acildi = await K2.cihezdanAc();
    ok("cihazdan SESSİZCE açıldı — şifre sorulmadı", acildi === true);
    ok("kasa artık açık", K2.kasaAcikMi() === true);

    /* Gerçek kanıt: açılan anahtar, önceki oturumda şifreleneni çözebiliyor. */
    const K1 = K;
    const nesne = { user: { name: "Zeynep Kaya" }, exams: [{ p: 88 }] };
    const zarf = await K1.kasaSifrele(nesne);
    const coz = await K2.kasaCoz(zarf);
    ok("önceki oturumun şifrelediği veri yeni sayfada çözüldü",
      !!(coz && coz.nesne && coz.nesne.user.name === "Zeynep Kaya"), JSON.stringify(coz));
  }

  // ------------------------------------------------------------
  console.log("\n== 3) TUZ HATASI: 'Kasa kaydı eksik (tuz yok)' ARTIK ÇIKMIYOR ==");
  {
    const K3 = await import(yol + "?v=3");   // yeni cihaz değil, ama bellek boş
    /* Eski hata: pencere tuzu bilmeden açılıyordu → kasaAc(sifre, undefined)
       → "Kasa kaydı eksik (tuz yok)." Artık tuz cihazdan gelir. */
    const r = await K3.kasaAc("kedi-yol-2026");   // tuz VERİLMİYOR (eski çağrı biçimi)
    ok("tuzsuz çağrı artık hata vermiyor", r.ok === true, r.hata);
    /* Yalnız KOD satırlarına bak (yorum satırları hariç) — hata metni
       kullanıcıya gösterilen dize olarak kalmamalı. */
    const kodSatirlari = KASA_KOD.split("\n")
      .filter((l) => !/^\s*(\/\*|\*|\/\/)/.test(l)).join("\n");
    ok("eski 'tuz yok' hata DİZESİ kodda kalmadı", !/tuz yok/.test(kodSatirlari));
    ok("kasa.js'te 'Kasa kaydı eksik' metni YOK", !/Kasa kaydı eksik/.test(kodSatirlari));
  }

  // ------------------------------------------------------------
  console.log("\n== 4) app-pwa.js: pencere tuzu bilmeden AÇILMIYOR ==");
  {
    ok("pencere açılırken tuz okunuyor",
      /tuzuYereldenOku/.test(APP) && /kasaUyarisiGoster\("kilitli", tuz\)/.test(APP));
    ok("tuz yoksa pencere açılmıyor (erken dönüş)",
      /if \(!tuz\) return;/.test(APP));
    ok("sessiz açılış kancası var", /kasaCihazdanSessizAc/.test(APP) && /await kasaCihazdanSessizAc\(\)/.test(APP));
    /* Sıra: state hazır DEĞİLSE erken çıkış yapılır (bulut okunmaz).
       Bu yüzden sessiz açılış, "if (typeof state === 'undefined') return;"
       satırından SONRA ama bulut okumasından ÖNCE olmalı. */
    const iErken = APP.indexOf('if (typeof state === "undefined") return; // state henüz hazır değil');
    const iSessiz = APP.indexOf("await kasaCihazdanSessizAc()");
    const iBulut = APP.indexOf('from("app_states")', APP.indexOf("async function oturumUygula"));
    ok("sessiz açılış: state hazır olduktan sonra, bulut okumasından ÖNCE",
      iErken > 0 && iSessiz > iErken && iSessiz < iBulut, iErken + "/" + iSessiz + "/" + iBulut);
    ok("çıkışta cihaz anahtarı siliniyor",
      /doSignOut[\s\S]{0,1500}KASA\.kasaKilitle\(\)/.test(APP));
    ok("'Kilitle' düğmesi cihazı da temizler (kasa.js)", /function kasaKilitle\(\)[\s\S]{0,200}cihazBaginiKes/.test(KASA_KOD));
  }

  // ------------------------------------------------------------
  console.log("\n== 5) KİLİTLE: cihaz anahtarı silinince şifre tekrar sorulur ==");
  {
    const K4 = await import(yol + "?v=4");
    ok("açılışta cihazdan açıldı", (await K4.cihezdanAc()) === true);
    K4.kasaKilitle();
    await new Promise((r) => setTimeout(r, 30));   // IDB silme bitsin
    ok("kilitlenince bellek boş", K4.kasaAcikMi() === false);
    ok("kilitlenince cihazdaki anahtar SİLİNDİ", (await K4.cihazdaAnahtarVarMi()) === false);
    ok("tuz ipucu da silindi", !K4.tuzuYereldenOku());
    ok("cihazda anahtar yokken sessiz açılış yapılamaz", (await K4.cihezdanAc()) === false);
  }

  // ------------------------------------------------------------
  console.log("\n== 6) YENİ CİHAZ: cihazda anahtar yok → şifre sorulur (doğru davranış) ==");
  {
    /* Yeni cihaz = boş IndexedDB. Eski kayıt yine tuzuyla açılabilmeli
       (tuz ZARFIN İÇİNDE taşınıyor — taşınabilirlik korunuyor). */
    const eskiKayit = idbDepo["am-kasa-v1"];
    delete idbDepo["am-kasa-v1"];   // "başka cihaz"
    const K5 = await import(yol + "?v=5");
    ok("yeni cihazda cihaz anahtarı YOK", (await K5.cihazdaAnahtarVarMi()) === false);
    ok("yeni cihazda sessiz açılış olmaz", (await K5.cihezdanAc()) === false);

    /* Zarftan tuzuyla aç (telefondan bilgisayara geçiş senaryosu). */
    const tuz = K.tuzuYereldenOku();   // not: yeni cihazda localStorage boş olur, aşağıda zarftan alınır
    /* Telefondan gelen kayıt: tuz ZARFIN İÇİNDE (kasa.js:16 tasarım kararı). */
    const zarfOrnek = await K.kasaSifrele({ user: { name: "Ahmet" } });
    const r = await K5.kasaAc("kedi-yol-2026", zarfOrnek.t);
    ok("şifre + tuz ile açıldı", r.ok === true, r.hata);
    const coz = await K5.kasaCoz(zarfOrnek);
    ok("veri yeni cihazda çözüldü", !!(coz && coz.nesne && coz.nesne.user.name === "Ahmet"));
    await new Promise((r2) => setTimeout(r2, 20));
    ok("yeni cihaz artık anahtarı kendine bağladı", (await K5.cihazdaAnahtarVarMi()) === true);
    idbDepo["am-kasa-v1"] = eskiKayit;   // geri koy (sonraki testler etkilenmesin)
  }

  // ------------------------------------------------------------
  console.log("\n" + "─".repeat(60));
  if (kalan) {
    console.log("\n✗ " + kalan + " kontrol kaldı (" + gecen + " geçti)");
    hatalar.forEach((h) => console.log("  · " + h));
    process.exit(1);
  }
  console.log("v120 kasa cihaz testleri — " + gecen + "/" + gecen + " geçti ✓");
})();
