/* ============================================================
   ENTEGRASYON: app-pwa.js içindeki GERÇEK onarım kodu
   ------------------------------------------------------------
   Bu test, app-pwa.js'den eşleme bloğunu olduğu gibi alır ve
   kullanıcının gerçek (bozuk) durumu üzerinde çalıştırır:
   26 "Ders > kazanım" BKT kaydı → konu başlıklarına eşlenir,
   aynı konuya düşenler birleşir, ders adları düzeltilir.
   Çalıştır: node tests/okz-konu-entegrasyon.test.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const OKZK = require("../site/okz-konu.js");
const OKZ = require("../site/okz-normalize.js");

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ayrinti) {
  if (kosul) { gecen++; return true; }
  kalan++; hatalar.push(ad + (ayrinti ? " → " + ayrinti : "")); return false;
}
function esit(ad, gelen, beklenen) { return ok(ad, gelen === beklenen, "gelen: " + JSON.stringify(gelen) + " · beklenen: " + JSON.stringify(beklenen)); }

// ---- app-pwa.js'den eşleme bloğunu çıkar ----
const BAS = "let OKZK_IDX = null, OKZK_YUKLENIYOR = null;";
const SON = "// Sınavın içerik parmak izi:";
const basI = APP.indexOf(BAS);
const sonI = APP.indexOf(SON, basI);
ok("app-pwa.js içinde eşleme bloğu bulundu", basI > 0 && sonI > basI);
const BLOK = APP.slice(basI, sonI);

// ---- Sahte ortam ----
const BILINEN = ["Türk Dili ve Edebiyatı", "Tarih", "Coğrafya", "Felsefe", "Din Kültürü", "Matematik", "Fizik", "Kimya", "Biyoloji"];
const INDEKS_VERISI = JSON.parse(fs.readFileSync(path.join(KOK, "site", "content", "konu_esleme.json"), "utf8"));

function ortam(state) {
  const window = { OKZ: OKZ, OKZK: OKZK };
  const kayit = { saveState: 0, toast: [], navigate: [] };
  const fn = new Function(
    "window", "document", "fetch", "state", "okzStore", "okzBilinenDersler",
    "saveState", "toast", "navigate", "currentPage", "escHtml",
    BLOK + "\nreturn { okzkYukle, okzKonuBul, okzKayitKonu, okzKonulariOnar, okzEslenmemisKonular, okzKonuHaritasi, okzHaritaAnahtar, okzbktBirlestir, okzKonuEslemeHtml };"
  );
  const api = fn(
    window,
    { querySelectorAll: () => [] },
    () => Promise.resolve({ ok: true, json: () => Promise.resolve(INDEKS_VERISI) }),
    state,
    () => state.okulizyon || (state.okulizyon = { importedKeys: [], pending: [], aktarilan: {}, guncellenen: [], konuHaritasi: {} }),
    () => BILINEN,
    () => { kayit.saveState++; },
    (m) => { kayit.toast.push(m); },
    (p) => { kayit.navigate.push(p); },
    "tracking",
    (s) => String(s == null ? "" : s)
  );
  return { api, window, kayit };
}

// ---- Kullanıcının GERÇEK 26 BKT anahtarı (DB'den) ----
const GERCEK = [
  "Türkçe > Yazım Kuralları",
  "Türkçe > Noktalama İşaretleri",
  "Türkçe > İki Cümleyi Birleştirme",
  "Türkçe > Yazarın metni yazma amacını belirler.",
  "Türkçe > Metinlerden hareketle çıkarımlar yapar.",
  "Türkçe > Metnin yardımcı düşüncelerini belirler.",
  "Türkçe > Türkü türünün genel özelliklerini belirler.",
  "Matematik > 1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler",
  "Felsefe > Felsefenin bilim, din ve sanat alanlarıyla ilişkisine eleştirel yaklaşır.",
  "Coğrafya-1 > Örnek olay, olgu ve/veya mekânın temel coğrafi koşullarını tanımlar.",
  "Fizik > Yatay doğrultuda sabit hızlı hareket ile ilgili tümevarımsal akıl yürütebilme",
  "Türkçe > Metni millî, manevi ve evrensel değerlerin aktarımı bağlamında değerlendirir.",
  "Kimya > Kimyasal değişimlere ilişkin kanıtları belirlemeye yönelik bilimsel gözlem yapabilme",
  "Tarih-1 > Türk tarihinin seyrini değiştiren önemli askerî mücadelelerin özelliklerini belirler.",
  "Türkçe > Halk şiirini tanımlar ,halk şiiri altında koşma türünün genel özelliklerini kavrar.",
  "Matematik-1 > Dik üçgende trigonometrik oranlar ve trigonometrik özdeşliklerle ilgili varsayımlarda bulunur.",
  "Kimya > Maddelerin miktarını ifade etmek için ölçülebilir (kütle, tanecik sayısı vb.) özellikleri belirler.",
  "Fizik > Yatay doğrultuda sabit ivmeli hareket grafiklerini birbirine dönüştürerek matematiksel modellere ulaşır.",
  "Türkçe > Şiirde ahengi sağlayan özellikleri (uyak düzeni, uyak, redif, aliterasyon,asonans) ile ilgili çalışma yapar.",
  "Coğrafya-1 > Örnek olay, olgu ve/veya mekânın aynı çevrede bulunan diğer olay, olgu veya mekânlar üzerindeki etkisini sorgulayır.".replace("sorgulayır", "sorgular"),
  "Tarih-1 > Türk tarihinin seyrini değiştiren önemli askerî mücadelelerin etkilerini benzerlik ve farklılıklar açısından listeler.",
  "Matematik-1 > Üçgenin bir kenarı ve o kenara ait yüksekliğindeki değişimin üçgenin alanındaki değişime etkisine dair varsayımlarda bulunur.",
  "Matematik-1 > Üçgende iç ve dış açıortayların, kenarortayların, kenar orta dikmelerin ve yüksekliklerin özelliklerine ilişkin varsayımda bulunur.",
  "Fizik > Yatay doğrultuda sabit hızlı hareket eden cisimlerin hız, sürat, yer değiştirme ve alınan yol değişkenlerine ilişkin matematiksel modelleri geneller.",
  "Tarih-1 > Türkistan’dan Türkiye’ye uzanan süreçte Türklerde devlet ve ordu teşkilatında meydana gelen değişim ve sürekliliği sağlayan unsurları inceler.",
  "Fizik > Yatay doğrultuda sabit ivmeyle hareket eden cisimlerin hareketine ilişkin grafikleri ve matematiksel modeller arasındaki ilişkiyi kendi cümleleriyle yeniden ifade eder."
];

function durumKur() {
  const bkt_state = {};
  const cards = [];
  GERCEK.forEach((k, i) => {
    bkt_state[k] = { L: 0.4 + i * 0.01, gozlem_sayisi: 2, hata_gecmisi: [{ date: "2026-10-27", tip: "w" }], onay_durumu: "GELISIYOR" };
    cards.push({ id: "c" + i, topicKey: k, front: "?", back: "!" });
  });
  return {
    user: { name: "TEST", grade: "10" },
    exams: GERCEK.map((k, i) => ({
      id: "e" + i,
      name: "Okulizyon: 10.SINIF MAARİF İZLEME SINAVI 1",
      date: "2026-10-27",
      lessons: {},
      errorLogs: [{
        qno: String(i + 1),
        lesson: k.split(" > ")[0],
        topic: k.split(" > ").slice(1).join(" > "),
        type: "KONUEKSİKLİĞİ",
        date: "2026-10-27"
      }]
    })),
    bkt_state: bkt_state,
    flashcards: { cards: cards, sessions: {}, lastSoftDrop: {} },
    mini_test_kuyrugu: [],
    mini_test_sessions: {},
    soru_havuzu_gosterim_logu: [],
    okulizyon: { importedKeys: [], pending: [], aktarilan: {}, guncellenen: [], konuHaritasi: {} }
  };
}

(async function () {
  // ---------- 1) Blok çalışıyor mu? ----------
  console.log("\n== 1) Blok yükleniyor ==");
  const { api, window, kayit } = ortam(durumKur());
  ok("fonksiyonlar dışa aktarıldı", typeof api.okzKonulariOnar === "function");
  const idx = await api.okzkYukle();
  ok("konu_esleme.json yüklendi", !!idx && idx.N === 152, String(idx && idx.N));
  ok("soru havuzu köprüsü kuruldu", typeof window.__okzKonuPoolEsle === "function");

  // ---------- 2) Köprü: kazanım → konu_id ----------
  console.log("\n== 2) Soru havuzu köprüsü ==");
  esit("köprü: Noktalama İşaretleri", window.__okzKonuPoolEsle("Türkçe", "Noktalama İşaretleri"), "edebiyat_10_u04_k05");
  esit("köprü: eşlenemeyeni uydurmaz", window.__okzKonuPoolEsle("Kimya", "Bambaşka bir cümle zebra"), null);

  // ---------- 3) Tek kayıt dönüşümü ----------
  console.log("\n== 3) Kayıt dönüşümü ==");
  const k1 = api.okzKayitKonu("Matematik-1", "Dik üçgende trigonometrik oranlar ve trigonometrik özdeşliklerle ilgili varsayımlarda bulunur.");
  esit("ders kanonikleşti", k1.lesson, "Matematik");
  esit("konu ham kazanım olarak korunur (onay yok)", k1.topic, "Dik üçgende trigonometrik oranlar ve trigonometrik özdeşliklerle ilgili varsayımlarda bulunur.");
  esit("kazanım metni saklanır", typeof k1.kazanim, "string");
  const k2 = api.okzKayitKonu("Türkçe", "Yazım Kuralları");
  esit("kesin eşleşme uygulanır", k2.topic, "Yazım Kuralları");
  esit("kesin eşleşmede ders doğru", k2.lesson, "Türk Dili ve Edebiyatı");
  ok("kesin eşleşme işaretlenir", k2.eslendi === true);

  // ---------- 4) Onarım: gerçek 26 kayıt ----------
  console.log("\n== 4) Gerçek veri onarımı ==");
  const state = durumKur();
  const o = ortam(state);
  await o.api.okzkYukle();
  const once = Object.keys(state.bkt_state).length;
  const degisen = await o.api.okzKonulariOnar(true);
  const sonra = Object.keys(state.bkt_state);
  console.log("   önce: " + once + " → sonra: " + sonra.length + " kayıt (" + degisen + " değişiklik)");
  ok("kayıt sayısı değişti (birleşme oldu)", degisen > 0, String(degisen));
  ok("hiçbir kayıt kaybolmadı", sonra.length > 0 && sonra.length <= once);
  ok("eski 'Türkçe >' anahtarı kalmadı", !sonra.some((k) => k.indexOf("Türkçe > ") === 0));
  ok("eski 'Matematik-1 >' anahtarı kalmadı", !sonra.some((k) => k.indexOf("Matematik-1 > ") === 0));
  ok("eski 'Tarih-1 >' anahtarı kalmadı", !sonra.some((k) => k.indexOf("Tarih-1 > ") === 0));
  ok("eski 'Coğrafya-1 >' anahtarı kalmadı", !sonra.some((k) => k.indexOf("Coğrafya-1 > ") === 0));
  const havuzaBagli = sonra.filter((k) => INDEKS_VERISI.havuzlar.some((h) => h.topic_key === k));
  ok("en az 6 konu soru havuzuna bağlandı", havuzaBagli.length >= 6, "bağlı: " + havuzaBagli.length);
  ok("her anahtar 'Ders > Konu' biçiminde", sonra.every((k) => k.indexOf(" > ") > 0));
  ok("ders adları uygulamanın bildiği adlarda", sonra.every((k) => BILINEN.includes(k.split(" > ")[0])), sonra.map((k) => k.split(" > ")[0]).join(","));

  // Flashcards da taşındı mı?
  ok("kartlar yeni anahtarlara taşındı", state.flashcards.cards.every((c) => sonra.includes(c.topicKey)));
  ok("hata geçmişi korundu", sonra.every((k) => (state.bkt_state[k].hata_gecmisi || []).length >= 1));
  ok("gözlem sayısı korundu", sonra.every((k) => Number(state.bkt_state[k].gozlem_sayisi) >= 2));

  // ErrorLogs düzeltildi mi?
  ok("errorLogs ders adları düzeltildi", state.exams.every((e) => BILINEN.includes(e.errorLogs[0].lesson)));
  ok("errorLogs kazanım metni saklandı", state.exams.every((e) => typeof e.errorLogs[0].kazanim === "string" && e.errorLogs[0].kazanim.length > 0));

  // ---------- 5) İdempotentlik ----------
  console.log("\n== 5) Tekrar çalıştırma ==");
  const degisen2 = await o.api.okzKonulariOnar(true);
  esit("ikinci çalıştırmada değişiklik yok", degisen2, 0);
  esit("kayıt sayısı sabit", Object.keys(state.bkt_state).length, sonra.length);

  // ---------- 6) Elle eşleme (harita) çalışıyor mu? ----------
  console.log("\n== 6) Elle eşleme ==");
  const kazanimMetni = "Üçgende iç ve dış açıortayların, kenarortayların, kenar orta dikmelerin ve yüksekliklerin özelliklerine ilişkin varsayımda bulunur.";
  const harita = o.api.okzKonuHaritasi();
  harita[o.api.okzHaritaAnahtar("Matematik", kazanimMetni)] = "Matematik > 1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler";
  const degisen3 = await o.api.okzKonulariOnar(true);
  ok("elle eşleme uygulandı", degisen3 >= 1, String(degisen3));
  const ucgenAnahtar = "Matematik > 1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler";
  ok("eşlenen konu havuzda var", INDEKS_VERISI.havuzlar.some((h) => h.topic_key === ucgenAnahtar));
  ok("kazanım anahtarı kalmadı", !Object.keys(state.bkt_state).some((k) => k.indexOf("açıortayların") > 0));

  // ---------- 7) Eşlenmemişler listesi (arayüz) ----------
  console.log("\n== 7) Arayüz listesi ==");
  const eksik = o.api.okzEslenmemisKonular();
  ok("eşlenmemişler listeleniyor", Array.isArray(eksik));
  ok("listede artık 'Türkçe' dersi yok (kanonikleşti)", eksik.every((x) => x.ders !== "Türkçe"));
  ok("her satırda öneri dizisi var", eksik.every((x) => Array.isArray(x.oneriler)));
  const html = o.api.okzKonuEslemeHtml();
  ok("arayüz HTML üretiyor", typeof html === "string" && html.indexOf("OKULİZYON KONU EŞLEMESİ") > 0);
  ok("arayüzde kaydet düğmesi var", html.indexOf('data-act="okzKonuEsle"') > 0);
  ok("arayüzde seçim kutuları var", html.indexOf("data-okz-konu") > 0);
  ok("arayüzde kazanım metni kaçışlı basılıyor (XSS)", html.indexOf("<script") < 0);

  // ---------- 8) BKT birleştirme matematiği ----------
  console.log("\n== 8) Birleştirme matematiği ==");
  const h = { L: 0.6, gozlem_sayisi: 3, hata_gecmisi: [1], onay_durumu: "GELISIYOR" };
  const k = { L: 0.2, gozlem_sayisi: 1, hata_gecmisi: [2], onay_durumu: "ONAYLANDI" };
  o.api.okzbktBirlestir(h, k);
  esit("gözlem sayıları toplandı", h.gozlem_sayisi, 4);
  esit("L ağırlıklı ortalama", Math.round(h.L * 1000) / 1000, 0.5);
  esit("hata geçmişi birleşti", h.hata_gecmisi.length, 2);
  esit("ileri onay durumu korundu", h.onay_durumu, "ONAYLANDI");

  // ---------- Sonuç ----------
  console.log("\n" + "─".repeat(56));
  if (kalan) {
    console.log("✗ " + kalan + " test başarısız:");
    hatalar.forEach((x) => console.log("   • " + x));
    console.log("Konu eşleme entegrasyon testi — " + gecen + "/" + (gecen + kalan) + " geçti");
    process.exit(1);
  }
  console.log("Konu eşleme entegrasyon testi — " + gecen + "/" + gecen + " geçti ✓");
})();
