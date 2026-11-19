/* ============================================================
   v86 — "ÇEKME DEFTERİ YOK: DENEMELERİM'DE VARSA AYNI"
   ------------------------------------------------------------
   KULLANICI (18 Kas):
     "Tüm verileri silsek de uygulama yeni Okulizyon'dan çekilen
      denemeyi hâlâ aynı diyor. Çekme defteri mi ne ona ne gerek var.
      Uygulama eğer Denemelerim bölümünde deneme varsa onunla
      karşılaştırsın. Daha iyi olmaz mı"

   Bu dosya app-pwa.js'deki GERÇEK kodu (okzSilinen*, okzStore) sahte
   bir localStorage + state ile çalıştırır ve şunu kanıtlar:
     • Kalıcı "işlendi defteri" YOK; karar yalnız Denemelerim'e bakar,
     • Tüm veriler silinince sınav YENİ sayılır (eski hata buydu),
     • Denemelerim'de duran sınav "aynı" sayılır (tekrar içe alınmaz),
     • Tek tek silinen deneme geri gelmez; "verileri sil" notu temizler,
     • Okulizyon'da içerik değişirse geri gelir.
   Çalıştır: node tests/okz-kuyruk.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");
const OKZ = require("../site/okz-normalize.js");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ayrinti) { if (kosul) { gecen++; return true; } kalan++; hatalar.push(ad + (ayrinti ? " → " + ayrinti : "")); return false; }
function esit(ad, gelen, beklenen) { return ok(ad, gelen === beklenen, "gelen: " + JSON.stringify(gelen) + " · beklenen: " + JSON.stringify(beklenen)); }

// ---- app-pwa.js'den gerçek blok ----
const BAS = "const OKZ_SILINEN_KEY =";
const SON = "// Sunucudaki çekim durumu";
const i1 = APP.indexOf(BAS), i2 = APP.indexOf(SON, i1);
ok("app-pwa.js içinde v86 bloğu bulundu", i1 > 0 && i2 > i1);
ok("kalıcı 'işlendi' defteri kodu YOK", !/function okzDefterIsaretle\(/.test(APP) && !/function okzDefter\(\)/.test(APP));
ok("defter sıfırlama düğmesi YOK", HTML.indexOf('data-act="okzDefteriTemizle"') < 0);
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

// `state` serbest değişkenini parametre yaparak gerçek bir kutu kur
function ortam2() {
  const localStorage = depoYap();
  const kutu = { state: { user: { name: "TEST", grade: "10" }, exams: [] } };
  const fn = new Function(
    "localStorage", "state", "saveState",
    BLOK + "\nreturn { okzSilinen, okzSilinenIsaretle, okzSilinenIkili, okzSilinenDisktenOku, okzStore, okzKey, OKZ_SILINEN_KEY, OKZ_ESKI_DEFTER_KEY, __okzSilinenleriTemizle, __okzDenemeSilindi };"
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
  // ---------- 1) Silinen notu temel ----------
  console.log("\n== 1) 'Silinen' notu temel ==");
  {
    const o = ortam2();
    esit("başlangıçta not boş", Object.keys(o.api.okzSilinen()).length, 0);
    o.api.okzSilinenIsaretle(ANAHTAR, HASH);
    esit("işaretlenince 1 kayıt", Object.keys(o.api.okzSilinen()).length, 1);
    esit("doğru hash", o.api.okzSilinen()[ANAHTAR], HASH);
    esit("diske de yazıldı", JSON.parse(o.localStorage.getItem(o.api.OKZ_SILINEN_KEY))[ANAHTAR], HASH);
    // state sıfırlansa bile diskteki not geri gelir (tek silme kalıcı olsun)
    o.kutu.state = { user: { name: "TEST" }, exams: [] };
    esit("not state'e geri yüklendi", o.api.okzSilinen()[ANAHTAR], HASH);
  }

  // ---------- 2) ASIL HATA: her şey silinince sınav YENİ ----------
  console.log("\n== 2) Tüm veriler silindi → sınav YENİ (eski hata) ==");
  {
    const o = ortam2();
    // Eski sürümün kalıcı defteri elde kalmış olsun
    o.localStorage.setItem(o.api.OKZ_ESKI_DEFTER_KEY, JSON.stringify({ [ANAHTAR]: HASH, [SINAV.name + "|" + SINAV.date]: HASH }));
    o.kutu.state.okulizyon = { islenen: { [ANAHTAR]: HASH }, pending: [], importedKeys: [] };
    o.api.okzStore();                                  // bir kez dokun: eski defter silinir
    esit("eski defter diskten SİLİNDİ", o.localStorage.getItem(o.api.OKZ_ESKI_DEFTER_KEY), null);
    o.kutu.state = { user: { name: "TEST" }, exams: [] };   // "Tüm verileri sil"
    const k = OKZ.karar([SINAV], o.kutu.state.exams, o.api.okzSilinen());
    esit("Denemelerim boşken sınav YENİ sayılır", k.yeni.length, 1);
    esit("yanlışlıkla 'değişmiş' denmez", k.degisen.length, 0);
  }

  // ---------- 3) Denemelerim'de varsa aynı ----------
  console.log("\n== 3) Denemelerim'de duruyorsa AYNI ==");
  {
    const o = ortam2();
    const DEPO = { name: "Okulizyon: " + SINAV.name, date: SINAV.date, lessons: SINAV.lessons, errorLogs: [] };
    let k = OKZ.karar([SINAV], [DEPO], o.api.okzSilinen());
    esit("aynı sınav tekrar içe alınmaz", k.yeni.length, 0);
    esit("içerik aynıysa 'değişmiş' de denmez", k.degisen.length, 0);
    const DEGISMIS = Object.assign({}, SINAV, { lessons: { Matematik: { d: 25, w: 1, e: 4 } } });
    k = OKZ.karar([DEGISMIS], [DEPO], o.api.okzSilinen());
    esit("içerik değişince 'değişmiş' görünür", k.degisen.length, 1);
  }

  // ---------- 4) Tek silme geri gelmez, sıfırlama notu temizler ----------
  console.log("\n== 4) Tek silme / sıfırlama ayrımı ==");
  {
    const o = ortam2();
    const DENEME = { name: "Okulizyon: " + SINAV.name, date: SINAV.date, lessons: SINAV.lessons, errorLogs: [] };
    ok("hook tanımlı", typeof o.api.__okzDenemeSilindi === "function");
    o.api.__okzDenemeSilindi(DENEME);
    esit("silinen deneme nota yazıldı", Object.keys(o.api.okzSilinen()).length, 1);
    esit("anahtar sid/ad|tarih", o.api.okzSilinen()[ANAHTAR], HASH);
    esit("silindikten sonra geri gelmez", OKZ.karar([SINAV], [], o.api.okzSilinen()).yeni.length, 0);
    o.api.__okzDenemeSilindi({ name: "Kendi denemem", date: "2026-10-01", lessons: {} });
    esit("elle girilen deneme nota yazılmaz", Object.keys(o.api.okzSilinen()).length, 1);

    globalThis.window = globalThis;
    esit("notu temizle 1 kayıt sildi", o.api.__okzSilinenleriTemizle(), 1);
    esit("disk de temiz", o.localStorage.getItem(o.api.OKZ_SILINEN_KEY), "{}");
    esit("temizlikten sonra sınav YENİDEN gelir", OKZ.karar([SINAV], [], o.api.okzSilinen()).yeni.length, 1);
  }

  // ---------- 5) İçerik değişirse silinmiş sınav geri gelir ----------
  console.log("\n== 5) İçerik değişti → silinmiş olsa da geri gelir ==");
  {
    const o = ortam2();
    o.api.okzSilinenIsaretle(ANAHTAR, HASH);
    const DEGISMIS = Object.assign({}, SINAV, { lessons: { Matematik: { d: 25, w: 1, e: 4 } } });
    esit("içerik değişince geri gelir", OKZ.karar([DEGISMIS], [], o.api.okzSilinen()).yeni.length, 1);
    esit("aynı içerik gelmez", OKZ.karar([SINAV], [], o.api.okzSilinen()).yeni.length, 0);
  }

  // ---------- 6) Dayanıklılık ----------
  console.log("\n== 6) Dayanıklılık ==");
  {
    const o = ortam2();
    o.localStorage.setItem(o.api.OKZ_SILINEN_KEY, "{bozuk json");
    esit("bozuk JSON çökmez", Object.keys(o.api.okzSilinen()).length, 0);
    o.localStorage.setItem(o.api.OKZ_SILINEN_KEY, "[1,2,3]");
    esit("dizi gelirse yok sayılır", Object.keys(o.api.okzSilinen()).length, 0);
  }

  // ---------- 7) Sıfırlama yolu: defter değil 'silinen' temizlenir ----------
  console.log("\n== 7) executeReset bağlantısı ==");
  {
    ok("index.html silinenleri temizliyor", /__okzSilinenleriTemizle/.test(HTML));
    ok("eski kuyruk→defter yolu YOK", !/__okzKuyruguDeftereYaz/.test(HTML) && !/__okzKuyruguDeftereYaz/.test(APP));
    ok("sıfırlama 'all' ve 'exams' için çalışıyor", /type === "all" \|\| type === "exams"[\s\S]{0,200}__okzSilinenleriTemizle/.test(HTML));
  }

  // ============================================================
  // v46c — ÇOK SINAV: aynı ad + aynı tarih olsa bile KARIŞMAZ
  // ============================================================
  console.log("\n== 8) Aynı ad+tarih, farklı sid → AYNI sınav (v93) ==");
  {
    /* v93 — KULLANICI (19 Kas): "Aynı deneme bugün kendiliğinden 2. kez eklendi."
       sid, Okulizyon'un OTURUM jetonudur: aynı sınavın iki çekiminde farklı
       değer gelir. v46c'de kimliğe konduğu için aynı sınav iki kez yazıldı
       (canlı kanıt: aynı ad+tarih+net, 1. kopya 39 nedeni işlenmiş /
       2. kopya 0). Kimlik artık ad|tarih(+içerik); sid yalnız bağlantı bilgisi. */
    const A = Object.assign({}, SINAV, { url: "https://okulizyon.com/app2/ogrenci/?pg=yks&sid=111" });
    const B = Object.assign({}, SINAV, { url: "https://okulizyon.com/app2/ogrenci/?pg=yks&sid=222" });
    esit("sid hâlâ okunuyor (bağlantı için)", OKZ.sidCikar(A.url), "111");
    esit("anahtar ad|tarih", OKZ.kararAnahtar(A), SINAV.name + "|" + SINAV.date);
    ok("iki çekimin anahtarı AYNI", OKZ.kararAnahtar(A) === OKZ.kararAnahtar(B));
    const depoA = { name: "Okulizyon: " + A.name, date: A.date, lessons: A.lessons, okulizyonUrl: A.url };
    const k1 = OKZ.karar([B], [depoA], {});
    esit("B mükerrer yazılmaz (aynı sınav)", k1.yeni.length, 0);
    esit("yanlış eşleşme 'değişmiş' üretmez", k1.degisen.length, 0);
    const k2 = OKZ.karar([A], [depoA], {});
    esit("aynı içerik tekrar 'yeni' sayılmaz", k2.yeni.length, 0);
    const A2 = Object.assign({}, A, { lessons: { Matematik: { d: 25, w: 1, e: 4 } } });
    const k3 = OKZ.karar([A2], [depoA], {});
    esit("içerik değişince 'değişmiş' olarak görünür", k3.degisen.length, 1);
    const C = Object.assign({}, B, { date: "2026-11-02" });
    esit("farklı tarihli GERÇEK sınav yeni sayılır", OKZ.karar([C], [depoA], {}).yeni.length, 1);
  }

  console.log("\n== 9) Geriye dönük: eski sid notu okunur, ama yeni sid kimlik değil ==");
  {
    const sidsiz = Object.assign({}, SINAV);
    esit("anahtar her durumda ad|tarih", OKZ.kararAnahtar(sidsiz), SINAV.name + "|" + SINAV.date);
    const not = {};
    not[SINAV.name + "|" + SINAV.date] = OKZ.kararHash(SINAV);
    const s = Object.assign({}, SINAV, { url: "https://okulizyon.com/app2/ogrenci/?pg=yks&sid=999" });
    esit("ad|tarih silme notu sid'li çekimde de geçerli", OKZ.karar([s], [], not).yeni.length, 0);
    /* Eski sürüm deftere "sid:<jeton>" yazıyordu. Geçiş döneminde o notlar
       hâlâ okunmalı — yoksa güncelleme sonrası silinmiş sınavlar geri gelir. */
    const eskiNot = {};
    eskiNot["sid:999"] = OKZ.kararHash(s);
    esit("eski sid notu hâlâ okunuyor (silinen geri gelmez)", OKZ.karar([s], [], eskiNot).yeni.length, 0);
  }

  console.log("\n== 10) okzKey (app-pwa) sid kullanmıyor ==");
  {
    const o = ortam2();
    esit("okzKey = ad|tarih", String(o.api.okzKey({ name: "X", date: "2026-10-27", url: "https://a/?sid=77" })), "X|2026-10-27");
    esit("okulizyonUrl'lu deneme de ad|tarih",
      String(o.api.okzKey({ name: "Okulizyon: X", date: "2026-10-27", okulizyonUrl: "https://a/?pg=yks&sid=88" })), "Okulizyon: X|2026-10-27");
    const o2 = ortam2();
    o2.api.okzSilinenIkili({ name: "X", date: "2026-10-27", url: "https://a/?sid=55" }, "H1");
    const d = o2.api.okzSilinen();
    esit("ikili not ad|tarih anahtarını yazdı", d["X|2026-10-27"], "H1");
    ok("sid anahtarı YAZILMIYOR", !("sid:55" in d));
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
