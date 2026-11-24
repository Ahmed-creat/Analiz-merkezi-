#!/usr/bin/env node
/* ============================================================
   SİLMEDE KULLANICI İLERLEMESİNİ KORUMA — tests/bkt-silme-koruma.test.js  (G-03)
   ------------------------------------------------------------
   YAYINLANAN dosyayı ölçer: site/bkt-engine.js (vm + sahte state).

   KÖK NEDEN: bir deneme/soru silinince `rebuildAfterDeletion` tüm
   `bkt_state`i sıfırlıyordu. `migrateExisting()` yalnız hata kayıtlarından
   türeyen alanları geri yazabildiği için kullanıcı eyleminden doğan alanlar
   (onay, kısa kontrol damgası, zamanlamalar, havuz kimliği) KALICI olarak
   kayboluyordu → "Yeterlilik: —", onaysız konu, bir daha açılmayan 5. adım.

   Kanıtlananlar:
     1) Silmeden sonra onay_durumu / son_kisa_kontrol* / precheck_due /
        study_completed_at / learning_test_due / learning_test_locked_until /
        pool_id / graph_topic_id KORUNUYOR
     2) Türetilmiş alanlar (gozlem_sayisi, L, hata_gecmisi) yeniden hesaplanıyor
     3) Silinmeyen kaydın türetilmiş değerleri yeniden üretiliyor
     4) İkinci çağrıda rebuild TEKRAR TETİKLENMİYOR (idempotent)
     5) Kısa kontrol görevi silmeden sonra yeniden "açık" görünüyor
     6) syncDeletedRecords silme tespiti korunuyor (silinen kayıt hâlâ sayılmıyor)
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

/* AM_MOTOR: gerileme karşılaştırması için eski motor sürümü ölçülebilir. */
const MOTOR = process.env.AM_MOTOR || path.join(__dirname, "..", "site", "bkt-engine.js");
const KOD = fs.readFileSync(MOTOR, "utf8");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) gecen++; else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }

function p2(n) { return String(n).padStart(2, "0"); }
function gunStr(d) { return d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate()); }
function bugun() { return gunStr(new Date()); }
function gunOnce(n) { const d = new Date(); d.setDate(d.getDate() - n); return gunStr(d); }

function kur() {
  const context = {
    console, Date, Set, Math, JSON, Promise, encodeURIComponent, Number, Object, Array, String, isFinite,
    window: {},
    document: { readyState: "loading", addEventListener() {} }
  };
  context.state = {
    user: { name: "Test", grade: "9" },
    bkt_state: {}, bkt_processed_records: {}, bkt_migration_done: false,
    flashcards: { cards: [], sessions: {}, lastSoftDrop: {} },
    memory: {}, exams: [], questions: [], topics: {},
    mini_test_kuyrugu: [], mini_test_sessions: {}, soru_havuzu_gosterim_logu: []
  };
  vm.runInNewContext(KOD, context, { filename: "bkt-engine.js" });
  return { BKT: context.window.AnalizBKT, state: context.state, context };
}

function kayitDeneme(id, konuId, tarih) {
  return {
    id: id,
    date: tarih,
    errorLogs: [{ konu_id: konuId, type: "Konuyu Bilmiyordum", date: tarih }]
  };
}

const KONU = "Matematik > Türev";
const KORUNAN = {
  onay_durumu: "ONAYLANDI",
  son_kisa_kontrol: gunOnce(4),
  son_kisa_kontrol_dogru: 4,
  son_kisa_kontrol_toplam: 5,
  son_kisa_kontrol_gecti: true,
  precheck_due: gunOnce(1),
  study_completed_at: gunOnce(10),
  learning_test_due: gunOnce(2),
  learning_test_locked_until: gunOnce(1),
  pool_id: "mat_10_turev",
  graph_topic_id: "mat_10_turev_g"
};

// ---------------------------------------------------------------
console.log("\n== 1) Silme sonrası kullanıcı alanları KORUNUYOR ==");
{
  const h = kur();
  h.state.exams = [kayitDeneme("e1", KONU, gunOnce(5))];
  h.BKT.processNewRecords();
  const e = h.state.bkt_state[KONU];
  ok("kayıt işlendi (gozlem 1)", e && e.gozlem_sayisi === 1, e && String(e.gozlem_sayisi));

  // Kullanıcı ilerlemesi (onay + kısa kontrol + zamanlamalar)
  Object.keys(KORUNAN).forEach(k => { e[k] = KORUNAN[k]; });
  e.L = 0.93;
  e.hata_gecmisi = [{ tarih: gunOnce(5), neden: "KONU EKSİKLİĞİ" }];

  // Deneme silinir → processNewRecords → syncDeletedRecords → rebuild
  h.state.exams = [];
  h.BKT.processNewRecords();

  const y = h.state.bkt_state[KONU];
  ok("konu kaydı SİLİNMEDİ", !!y, "rebuild tüm bkt_state'i silmiş (eski hata)");
  if (y) {
    Object.keys(KORUNAN).forEach(k => {
      ok("korunan alan: " + k, y[k] === KORUNAN[k], JSON.stringify(y[k]) + " ≠ " + JSON.stringify(KORUNAN[k]));
    });
    ok("gozlem_sayisi yeniden hesaplandı (0)", y.gozlem_sayisi === 0, String(y.gozlem_sayisi));
    ok("L türetilmiş → başlangıç değerine döndü", y.L === h.BKT.PARAM.P_L0, String(y.L));
    ok("hata_gecmisi türetilmiş → sıfırlandı", Array.isArray(y.hata_gecmisi) && y.hata_gecmisi.length === 0,
      JSON.stringify(y.hata_gecmisi));
  } else {
    /* Kayıt tümüyle silindiyse kalan ölçümler anlamsız; bölüm tek tek düşer. */
    Object.keys(KORUNAN).forEach(k => ok("korunan alan: " + k, false, "kayıt yok"));
    ok("gozlem_sayisi yeniden hesaplandı (0)", false, "kayıt yok");
  }
}

// ---------------------------------------------------------------
console.log("\n== 2) Silinmeyen kayıt yeniden üretiliyor (rebuild doğru çalışıyor) ==");
{
  const h = kur();
  const A = "Matematik > Türev", B = "Fizik > Vektörler";
  h.state.exams = [kayitDeneme("e1", A, gunOnce(5)), kayitDeneme("e2", B, gunOnce(5))];
  h.BKT.processNewRecords();
  Object.keys(h.state.bkt_state).forEach(k => {
    const e = h.state.bkt_state[k];
    e.onay_durumu = "ONAYLANDI"; e.precheck_due = gunOnce(1);
    e.son_kisa_kontrol = gunOnce(4); e.study_completed_at = gunOnce(9);
    e.pool_id = "p_" + k.length; e.graph_topic_id = "g_" + k.length;
  });

  h.state.exams = [h.state.exams[1]];      // yalnız e1 (Türev) silindi
  h.BKT.processNewRecords();

  ok("silinmeyen konu kaydı duruyor", !!h.state.bkt_state[B]);
  ok("silinmeyen konu gozlem yeniden üretildi (1)", !!(h.state.bkt_state[B] && h.state.bkt_state[B].gozlem_sayisi === 1),
    String(h.state.bkt_state[B] && h.state.bkt_state[B].gozlem_sayisi));
  ok("silinmeyen konu onayı korundu", !!(h.state.bkt_state[B] && h.state.bkt_state[B].onay_durumu === "ONAYLANDI"),
    h.state.bkt_state[B] && h.state.bkt_state[B].onay_durumu);
  ok("silinen konu onayı da korundu (kullanıcı eylemi)",
    h.state.bkt_state[A] && h.state.bkt_state[A].onay_durumu === "ONAYLANDI",
    h.state.bkt_state[A] && h.state.bkt_state[A].onay_durumu);
  ok("silinen konuda gozlem 0", !!(h.state.bkt_state[A] && h.state.bkt_state[A].gozlem_sayisi === 0),
    String(h.state.bkt_state[A] && h.state.bkt_state[A].gozlem_sayisi));
  ok("silinen kayıt artık sayılmıyor (processed temiz)",
    !Object.keys(h.state.bkt_processed_records).some(id => id.indexOf("record:deneme:e1") === 0),
    JSON.stringify(Object.keys(h.state.bkt_processed_records).slice(0, 3)));
}

// ---------------------------------------------------------------
console.log("\n== 3) İkinci çağrı rebuild'i TEKRAR tetiklemiyor (idempotent) ==");
{
  const h = kur();
  h.state.exams = [kayitDeneme("e1", KONU, gunOnce(5))];
  h.BKT.processNewRecords();
  const ilk = h.state.bkt_state[KONU];
  ok("ilk kayıt oluştu", !!ilk);
  if (ilk) {
    ilk.onay_durumu = "ONAYLANDI";
    h.state.exams = [];
    h.BKT.processNewRecords();
    const y = h.state.bkt_state[KONU];
    ok("silme sonrası ilk rebuild oldu (kayıt duruyor)", !!(y && y.onay_durumu === "ONAYLANDI"));
    if (y) {
      // Sentetik işaret: rebuild bir daha çalışırsa bu değer sıfırlanır.
      y.gozlem_sayisi = 42;
      h.BKT.processNewRecords();
      ok("ikinci çağrıda rebuild YOK (işaret korundu)", y.gozlem_sayisi === 42, String(y.gozlem_sayisi));
      ok("onay ikinci çağrıda da duruyor", y.onay_durumu === "ONAYLANDI");
    } else {
      ok("ikinci çağrıda rebuild YOK (işaret korundu)", false, "kayıt silinmiş");
      ok("onay ikinci çağrıda da duruyor", false, "kayıt silinmiş");
    }
  } else {
    ok("silme sonrası ilk rebuild oldu (kayıt duruyor)", false, "kayıt yok");
    ok("ikinci çağrıda rebuild YOK (işaret korundu)", false, "kayıt yok");
    ok("onay ikinci çağrıda da duruyor", false, "kayıt yok");
  }
}

// ---------------------------------------------------------------
console.log("\n== 4) KABUL: silmeden sonra kısa kontrol görevi yeniden AÇIK ==");
{
  const h = kur();
  h.state.exams = [kayitDeneme("e1", KONU, gunOnce(20))];
  h.BKT.processNewRecords();
  const e = h.state.bkt_state[KONU];
  // 5. adım (kısa kontrol) daha önce yapılmış ve süresi dolmuş olsun
  e.son_kisa_kontrol = gunOnce(4);              // KISA_ARALIK_GUN=3 geçmiş
  e.son_kisa_kontrol_gecti = true;
  e.precheck_due = gunOnce(1);
  e.study_completed_at = gunOnce(10);
  e.pool_id = "mat_10_turev";

  const once = h.BKT.konuDurum(KONU);
  ok("silmeden önce precheck AÇIK", once && once.precheck === true, JSON.stringify(once && once.precheck));
  ok("silmeden önce kısa kontrol açık", once && once.kisaKontrol.acik === true);

  h.state.exams = [];                            // deneme silindi
  h.BKT.processNewRecords();

  const sonra = h.BKT.konuDurum(KONU);
  ok("silmeden sonra konu kaydı duruyor", !!sonra, "kayıt yok");
  ok("silmeden sonra kısa kontrol HÂLÂ açık (5. adım geri geliyor)",
    !!(sonra && sonra.kisaKontrol.acik === true), JSON.stringify(sonra && sonra.kisaKontrol));
  ok("silmeden sonra precheck tarihi korundu", !!(sonra && sonra.precheckTarih === gunOnce(1)),
    sonra && String(sonra.precheckTarih));
  ok("silmeden sonra 'kısa kontrol yapıldı' bilgisi korundu", !!(sonra && sonra.kisaYapildi === true));
}

// ---------------------------------------------------------------
console.log("\n== 5) Kaynak koruması: rebuild sonrası saveState çağrılmıyor ==");
{
  const kod = KOD;
  const bas = kod.indexOf("function rebuildAfterDeletion");
  const govde = kod.slice(bas, kod.indexOf("\n  }", bas));
  /* Yorumları ayıkla, yalnız KOD içinde saveState aranır. */
  const yalnizKod = govde.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
  ok("rebuildAfterDeletion gövdesinde saveState YOK", !/saveState/.test(yalnizKod));
  ok("KORUNAN_ALANLAR listesi kodda var", /const KORUNAN_ALANLAR = \[/.test(kod));
  ok("yedek rebuild'den ÖNCE alınıyor",
    kod.indexOf("Object.keys(s.bkt_state || {})") >= 0 &&
    kod.indexOf("Object.keys(s.bkt_state || {})") < kod.indexOf("s.bkt_state = {}; s.bkt_processed_records = {};"));
}

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("bkt silme koruması — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("bkt silme koruması — " + gecen + "/" + gecen + " geçti ✓");
