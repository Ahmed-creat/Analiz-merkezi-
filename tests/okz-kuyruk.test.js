/* ============================================================
   KUYRUK DEFTERİ — "verileri silsem de hep Analiz Bekliyor"
   ------------------------------------------------------------
   app-pwa.js'deki GERÇEK defter kodunu (okzDefter*, okzStore)
   sahte bir localStorage + state ile çalıştırır ve şunu kanıtlar:
     • işlenen/yoksayılan sınav deftere yazılır,
     • "Tüm Verileri Sıfırla" state'i sıfırlasa bile defter kalır,
     • sıfırlama sonrası aynı sınav kuyruğa GERİ GELMEZ,
     • Okulizyon'da içerik değişirse geri gelir.
   Çalıştır: node tests/okz-kuyruk.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const OKZ = require("../site/okz-normalize.js");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ayrinti) { if (kosul) { gecen++; return true; } kalan++; hatalar.push(ad + (ayrinti ? " → " + ayrinti : "")); return false; }
function esit(ad, gelen, beklenen) { return ok(ad, gelen === beklenen, "gelen: " + JSON.stringify(gelen) + " · beklenen: " + JSON.stringify(beklenen)); }

// ---- app-pwa.js'den defter bloğunu çıkar ----
const BAS = "const OKZ_DEFTER_KEY =";
const SON = "// Sunucudaki çekim durumu";
const i1 = APP.indexOf(BAS), i2 = APP.indexOf(SON, i1);
ok("app-pwa.js içinde defter bloğu bulundu", i1 > 0 && i2 > i1);
const BLOK = APP.slice(i1, i2);

// Blok `window.__okzDenemeSilindi` atar → testte sahte global
globalThis.window = globalThis;
globalThis.OKZ = OKZ;

// ---- Sahte ortam ----
function depoYap() {
  const veri = {};
  return {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(veri, k) ? veri[k] : null),
    setItem: (k, v) => { veri[k] = String(v); },
    removeItem: (k) => { delete veri[k]; },
    _veri: veri
  };
}

function ortam() {
  const localStorage = depoYap();
  const kayit = { saveState: 0 };
  let state = { user: { name: "TEST", grade: "10" }, exams: [] };
  // state'i dışarıdan değiştirebilmek için kutu
  const kutu = { get: () => state, set: (s) => { state = s; } };

  const fn = new Function(
    "localStorage", "getState", "setState", "saveState",
    BLOK + "\nreturn { okzDefter, okzDefterIsaretle, okzDefterTemizle, okzDefterSayisi, okzStore, OKZ_DEFTER_KEY };"
  );
  // okzStore `state` değişkenine doğrudan erişir → erişimci ile sarmalıyoruz
  const src = `
    Object.defineProperty(globalThis, "__durum", { get: getState, set: setState, configurable: true });
  `;
  const api = fn.call(
    null, localStorage, kutu.get, kutu.set, () => { kayit.saveState++; }
  );
  // Not: BLOK içindeki `state` serbest değişken; Function gövdesinde
  // tanımlı olmadığı için ReferenceError verir. Bu yüzden blok, `state`
  // adında bir parametre ile sarılarak çalıştırılır (aşağıda).
  return { api, localStorage, kayit, kutu };
}

// `state` serbest değişkenini parametre yaparak gerçek bir kutu kur
function ortam2() {
  const localStorage = depoYap();
  const kutu = { state: { user: { name: "TEST", grade: "10" }, exams: [] } };
  const fn = new Function(
    "localStorage", "state", "saveState",
    BLOK + "\nreturn { okzDefter, okzDefterIsaretle, okzDefterTemizle, okzDefterSayisi, okzStore, okzKey, okzDefterIkili, OKZ_DEFTER_KEY };"
  );
  // state'i canlı tutmak için getter/setter'lı bir Proxy kullan
  const proxy = new Proxy({}, {
    get: (t, p) => kutu.state[p],
    set: (t, p, v) => { kutu.state[p] = v; return true; },
    has: (t, p) => p in kutu.state,
    deleteProperty: (t, p) => { delete kutu.state[p]; return true; },
    ownKeys: () => Reflect.ownKeys(kutu.state),
    getOwnPropertyDescriptor: (t, p) => Object.getOwnPropertyDescriptor(kutu.state, p)
  });
  const api = fn(localStorage, proxy, () => {});
  return { api, localStorage, kutu };
}

// ---- Sınav verisi (gerçek Okulizyon biçimi) ----
const SINAV = {
  name: "10.SINIF MAARİF İZLEME SINAVI 1",
  date: "2026-10-27",
  lessons: { "Matematik-1": { d: 20, w: 2, e: 8 }, "Türkçe": { d: 19, w: 9, e: 2 } },
  rows: [{ qno: "3", lesson: "Matematik-1", topic: "Dik üçgende ...", status: "e" }]
};
const ANAHTAR = OKZ.kararAnahtar(SINAV);
const HASH = OKZ.kararHash(SINAV);

(async function () {
  // ---------- 1) Defter temel çalışma ----------
  console.log("\n== 1) Defter temel ==");
  const o = ortam2();
  esit("başlangıçta defter boş", o.api.okzDefterSayisi(), 0);
  o.api.okzDefterIsaretle(ANAHTAR, HASH);
  esit("işaretlenince 1 kayıt", o.api.okzDefterSayisi(), 1);
  esit("defterde doğru hash", o.api.okzDefter()[ANAHTAR], HASH);
  ok("localStorage'a yazıldı", o.localStorage.getItem(o.api.OKZ_DEFTER_KEY) !== null);
  esit("state içine de yazıldı", o.kutu.state.okulizyon.islenen[ANAHTAR], HASH);

  // ---------- 2) Karar: kuyruğa geri konmaz ----------
  console.log("\n== 2) Karar ==");
  let k = OKZ.karar([SINAV], [], o.api.okzDefter());
  esit("defterdeki sınav yeni sayılmaz", k.yeni.length, 0);
  k = OKZ.karar([SINAV], [], {});
  esit("defter boşken yeni sayılır", k.yeni.length, 1);

  // ---------- 3) "Tüm Verileri Sıfırla" ----------
  console.log("\n== 3) Tüm verileri sıfırla ==");
  // executeReset("all") ile aynı: state = freshState()
  o.kutu.state = { user: { name: "TEST", grade: "10" }, exams: [] };
  ok("state'te okulizyon kalmadı", o.kutu.state.okulizyon === undefined);
  // Uygulama açılınca okzStore() yeniden kurulur
  const st = o.api.okzStore();
  ok("okulizyon yeniden kuruldu", !!st);
  esit("defter state'e geri yüklendi", st.islenen[ANAHTAR], HASH);
  esit("defter sayısı korundu", o.api.okzDefterSayisi(), 1);
  k = OKZ.karar([SINAV], o.kutu.state.exams, o.api.okzDefter());
  esit("SIFIRLAMA SONRASI kuyruğa geri gelmez", k.yeni.length, 0);

  // ---------- 4) Denemelerim'i silmek ----------
  console.log("\n== 4) Denemelerim'i sil ==");
  const o2 = ortam2();
  o2.api.okzDefterIsaretle(ANAHTAR, HASH);
  // deneme içeri aktarılmıştı, sonra silindi
  const DEPO = { name: "Okulizyon: " + SINAV.name, date: SINAV.date, lessons: {}, errorLogs: [] };
  k = OKZ.karar([SINAV], [DEPO], o2.api.okzDefter());
  esit("aktarılmışken yeni değil", k.yeni.length, 0);
  k = OKZ.karar([SINAV], [], o2.api.okzDefter()); // silindi
  esit("Denemelerim'den silinse de kuyruğa dönmez", k.yeni.length, 0);

  // ---------- 5) İçerik değişirse geri gelir ----------
  console.log("\n== 5) Okulizyon'da sonuç değişti ==");
  const DEGISMIS = Object.assign({}, SINAV, { lessons: { "Matematik-1": { d: 22, w: 0, e: 8 }, "Türkçe": { d: 19, w: 9, e: 2 } } });
  k = OKZ.karar([DEGISMIS], [], o2.api.okzDefter());
  esit("içerik değişince geri gelir", k.yeni.length, 1);

  // ---------- 6) Geri al ----------
  console.log("\n== 6) Geri al ==");
  o2.api.okzDefterTemizle();
  esit("defter temizlendi", o2.api.okzDefterSayisi(), 0);
  esit("localStorage da temizlendi", o2.localStorage.getItem(o2.api.OKZ_DEFTER_KEY), "{}");
  k = OKZ.karar([SINAV], [], o2.api.okzDefter());
  esit("geri aldıktan sonra yeniden gelir", k.yeni.length, 1);

  // ---------- 7) Bozuk disk verisi ----------
  console.log("\n== 7) Dayanıklılık ==");
  const o3 = ortam2();
  o3.localStorage.setItem(o3.api.OKZ_DEFTER_KEY, "{bozuk json");
  esit("bozuk JSON çökmez", o3.api.okzDefterSayisi(), 0);
  o3.localStorage.setItem(o3.api.OKZ_DEFTER_KEY, "[1,2,3]");
  esit("dizi gelirse yok sayılır", o3.api.okzDefterSayisi(), 0);

  // ---------- 8) Denemelerim'den silmek deftere yazılır ----------
  console.log("\n== 8) deleteExam hook ==");
  const o4 = ortam2();
  const DENEME = { name: "Okulizyon: " + SINAV.name, date: SINAV.date, lessons: SINAV.lessons, errorLogs: [] };
  ok("hook tanımlı", typeof globalThis.__okzDenemeSilindi === "function");
  globalThis.__okzDenemeSilindi(DENEME);
  esit("silinen Okulizyon denemesi deftere yazıldı", o4.api.okzDefterSayisi(), 1);
  esit("anahtar öneksiz (ham ad)", Object.keys(o4.api.okzDefter())[0], ANAHTAR);
  esit("hash ham sınavla aynı", o4.api.okzDefter()[ANAHTAR], HASH);
  k = OKZ.karar([SINAV], [], o4.api.okzDefter());
  esit("silindikten sonra kuyruğa dönmez", k.yeni.length, 0);
  // Okulizyon kaynaklı olmayan deneme deftere yazılmaz
  globalThis.__okzDenemeSilindi({ name: "Kendi denemem", date: "2026-10-01", lessons: {} });
  esit("elle girilen deneme deftere yazılmaz", o4.api.okzDefterSayisi(), 1);

  // ---------- 9) "Verileri sil" = kuyruğu deftere yaz ----------
  console.log("\n== 9) executeReset → kuyruk deftere ==");
  const o5 = ortam2();
  ok("__okzKuyruguDeftereYaz tanımlı", typeof globalThis.__okzKuyruguDeftereYaz === "function");
  o5.kutu.state.okulizyon = { pending: [SINAV, Object.assign({}, SINAV, { name: "2. DENEME", date: "2026-10-20" })], importedKeys: [], aktarilan: {}, guncellenen: [] };
  const sayi = globalThis.__okzKuyruguDeftereYaz();
  esit("kuyruktaki 2 sınav deftere yazıldı", sayi, 2);
  esit("kuyruk boşaltıldı", o5.kutu.state.okulizyon.pending.length, 0);
  k = OKZ.karar([SINAV], [], o5.api.okzDefter());
  esit("silme sonrası kuyruğa geri gelmez", k.yeni.length, 0);
  const GELEN2 = [SINAV, Object.assign({}, SINAV, { name: "2. DENEME", date: "2026-10-20" })];
  esit("ikisi de geri gelmez", OKZ.karar(GELEN2, [], o5.api.okzDefter()).yeni.length, 0);

  // ============================================================
  // v46c — ÇOK SINAV: aynı ad + aynı tarih olsa bile KARIŞMAZ
  // Kullanıcı: "birden fazla varsa doğru şekilde birbirine karışmadan
  // çekilebiliyor mu?"
  // Okulizyon her sınava tekil sid verir → kimlik odur.
  // ============================================================
  console.log("\n== 10) Aynı ad+tarih, farklı sid → AYRI sınavlar ==");
  {
    const A = Object.assign({}, SINAV, { url: "https://okulizyon.com/app2/ogrenci/?pg=yks&sid=111" });
    const B = Object.assign({}, SINAV, { url: "https://okulizyon.com/app2/ogrenci/?pg=yks&sid=222" });
    esit("sid okunuyor", OKZ.sidCikar(A.url), "111");
    ok("anahtar sid'e dayanıyor", OKZ.kararAnahtar(A) === "sid:111", OKZ.kararAnahtar(A));
    ok("iki sınavın anahtarı FARKLI", OKZ.kararAnahtar(A) !== OKZ.kararAnahtar(B));
    // A depoda var; B gelirse ikisi karışmamalı → B "yeni"
    const depoA = { name: "Okulizyon: " + A.name, date: A.date, lessons: A.lessons, okulizyonUrl: A.url };
    const k1 = OKZ.karar([B], [depoA], {});
    esit("B yeni sınav olarak gelir (A ile karışmadı)", k1.yeni.length, 1);
    esit("yanlış eşleşme 'değişmiş' üretmez", k1.degisen.length, 0);
    // Aynı sid tekrar gelirse yeni değil
    const k2 = OKZ.karar([A], [depoA], {});
    esit("aynı sid tekrar 'yeni' sayılmaz", k2.yeni.length, 0);
    // Aynı sid, içerik değişti → degisen
    const A2 = Object.assign({}, A, { lessons: { Matematik: { d: 25, w: 1, e: 4 } } });
    const k3 = OKZ.karar([A2], [depoA], {});
    esit("içerik değişince 'değişmiş' olarak görünür", k3.degisen.length, 1);
  }

  console.log("\n== 11) sid yoksa eski davranış korunur (geriye dönük) ==");
  {
    const sidsiz = Object.assign({}, SINAV);
    esit("sid yoksa anahtar ad|tarih", OKZ.kararAnahtar(sidsiz), SINAV.name + "|" + SINAV.date);
    // Eski sürümde deftere "ad|tarih" ile yazılmış silme kaydı, sid'li gelse bile tutmalı
    const defter = {};
    defter[SINAV.name + "|" + SINAV.date] = OKZ.kararHash(SINAV);
    const s = Object.assign({}, SINAV, { url: "https://okulizyon.com/app2/ogrenci/?pg=yks&sid=999" });
    esit("eski defter kaydı geçerli (silinen sınav geri gelmez)", OKZ.karar([s], [], defter).yeni.length, 0);
  }

  console.log("\n== 12) okzKey (app-pwa) sid'i okuyor ==");
  {
    const o = ortam2();
    ok("okzKey sid'li denemede sid:...", String(o.api.okzKey({ name: "X", date: "2026-10-27", url: "https://a/?sid=77" })) === "sid:77",
      String(o.api.okzKey({ name: "X", date: "2026-10-27", url: "https://a/?sid=77" })));
    ok("uygulamadaki deneme (okulizyonUrl) da sid okur",
      String(o.api.okzKey({ name: "Okulizyon: X", date: "2026-10-27", okulizyonUrl: "https://a/?pg=yks&sid=88" })) === "sid:88");
    // fidye: ikili defter hem sid hem ad|tarih yazar
    const o2 = ortam2();
    o2.api.okzDefterIkili({ name: "X", date: "2026-10-27", url: "https://a/?sid=55" }, "H1");
    const d = o2.api.okzDefter();
    ok("ikili defter sid anahtarını yazdı", d["sid:55"] === "H1");
    ok("ikili defter eski anahtarı da yazdı", d["X|2026-10-27"] === "H1");
  }

  // ---------- Sonuç ----------
  console.log("\n" + "─".repeat(56));
  if (kalan) {
    console.log("✗ " + kalan + " test başarısız:");
    hatalar.forEach((x) => console.log("   • " + x));
    console.log("Kuyruk defteri testi — " + gecen + "/" + (gecen + kalan) + " geçti");
    process.exit(1);
  }
  console.log("Kuyruk defteri testi — " + gecen + "/" + gecen + " geçti ✓");
})();
