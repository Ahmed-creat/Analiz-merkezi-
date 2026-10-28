// Koçluk Hattı (mesaj özelliği) testleri.
// Kaynak: doğrudan yayınlanan site/mesaj.js — kopya değil, canlı dosya.
// node tests/mesaj.test.js   (npm run test:mesaj)
const fs = require("node:fs");
const path = require("node:path");

const KOK = path.resolve(__dirname, "..");
const DOSYA = path.join(KOK, "site", "mesaj.js");
const HTML = path.join(KOK, "site", "index.html");

function yukle() {
  const kaynak = fs.readFileSync(DOSYA, "utf8");
  const mod = { exports: {} };
  // Tarayıcı katmanı document yok diye erken döner; saf fonksiyonlar dışa açılır.
  new Function("module", "exports", "window", "document", kaynak)(mod, mod.exports, undefined, undefined);
  return mod.exports;
}

const H = yukle();
let gecen = 0, kalan = [];
const ok = (ad, kosul, ek) => { if (kosul) gecen++; else kalan.push(ad + (ek ? " → " + ek : "")); };

// ---- 1) Saf yardımcılar ----
ok("sade: büyük harf + noktalama", H.sade("Netlerim NASIL?") === "netlerim nasil", H.sade("Netlerim NASIL?"));
ok("sade: Türkçe karakterler (ı ş ğ ç ö ü)", H.sade("Çalışmalıyım ığüşöç") === "calismaliyim igusoc", H.sade("Çalışmalıyım ığüşöç"));
ok("netHesap: 100D 11Y → 97,25", H.netHesap({ T: { d: 100, w: 11, e: 0 } }).net === 97.25, H.netHesap({ T: { d: 100, w: 11 } }).net);
ok("netHesap: ders ders toplama", H.netHesap({ A: { d: 10, w: 4 }, B: { d: 5, w: 0 } }).net === 14, H.netHesap({ A: { d: 10, w: 4 }, B: { d: 5, w: 0 } }).net);
ok("netHesap: ders yok → 0", H.netHesap({}).net === 0);

// ---- 2) Gerçek Okulizyon verisiyle bağlam (canlı çekimden) ----
const ctx = {
  ad: "MUHAMMED EFE",
  sinif: 10,
  exams: [
    { name: "Deneme 1", date: "2026-10-10", lessons: { "Türkçe": { d: 20, w: 5, e: 0 }, "Matematik": { d: 8, w: 6, e: 6 } } },
    { name: "10.SINIF MAARİF İZLEME SINAVI 1", date: "2026-10-27", net: 97.25,
      lessons: {
        "Türkçe": { d: 27, w: 2, e: 1 }, "Tarih-1": { d: 7, w: 2, e: 1 }, "Matematik-1": { d: 24, w: 2, e: 4 },
        "Fizik": { d: 10, w: 0, e: 0 }, "Kimya": { d: 7, w: 0, e: 3 }, "Biyoloji": { d: 8, w: 2, e: 0 },
        "Coğrafya-1": { d: 9, w: 1, e: 0 }, "Felsefe": { d: 3, w: 2, e: 0 }, "Din Kül.": { d: 5, w: 0, e: 0 }
      } }
  ],
  errorLogs: [
    { lesson: "Türkçe", topic: "Metni millî, manevi ve evrensel değerlerin aktarımı" },
    { lesson: "Türkçe", topic: "Tamlamalar - Karma" },
    { lesson: "Matematik-1", topic: "Tamlamalar - Karma" },
    { lesson: "Kimya", topic: "Kimyasal tepkimeler" }
  ],
  okulizyon: {
    durum: { kod: "ok", mesaj: "1 sınav, 20 hatalı/boş soru aktarıldı." },
    bekleyen: 3,
    sinav: ["10.SINIF MAARİF İZLEME SINAVI 1"],
    sorular: [
      { lesson: "Türkçe", topic: "Tamlamalar - Karma", status: "e" },
      { lesson: "Türkçe", topic: "Metni millî...", status: "w" },
      { lesson: "Kimya", topic: "Kimyasal tepkimeler", status: "e" }
    ]
  },
  okuma: { sayfa: 0, dakika: 0 },
  kalanGun: 42,
  hedefNet: 110
};

// ---- 3) Boş / anlaşılmayan mesaj ----
ok("boş mesaj → örnek sorular", /Örneğin/.test(H.kocYanit("", ctx)), H.kocYanit("").slice(0, 60));
ok("boş mesaj: selamlama ile karışmaz", !/Merhaba/.test(H.kocYanit("   ", ctx)));
ok("anlaşılmaz mesaj → yol gösterir", /tam çözemedim/.test(H.kocYanit("asdkjhqwe", ctx)));
ok("anlaşılmaz mesaj: yardım önerir", /yardım/.test(H.kocYanit("asdkjhqwe", ctx)));

// ---- 4) Net / deneme analizi ----
const net = H.kocYanit("netlerim nasıl?", ctx);
ok("net: son denemenin adı geçer", net.includes("10.SINIF MAARİF İZLEME SINAVI 1"), net.slice(0, 80));
ok("net: son net 97,25 yazılır", net.includes("97,25"), net);
ok("net: önceki denemeye göre fark hesaplanır", /Önceki denemeye göre/.test(net));
ok("net: en zayıf ders orana göre bulunur (Felsefe 3D/2Y)", /En zayıf dersin Felsefe/.test(net), net);
const netsiz = H.kocYanit("netlerim nasıl?", { exams: [] });
ok("net: kayıt yoksa dürüst uyarı", /Henüz deneme sonucu yok/.test(netsiz), netsiz);

// ---- 5) Konu önceliği ----
const konu = H.kocYanit("hangi konuya çalışmalıyım?", ctx);
ok("konu: başlık doğru", /öncelikli konular/.test(konu));
ok("konu: en çok tekrar eden konu 1. sırada", /1\) Tamlamalar - Karma — 3 soru/.test(konu), konu);
ok("konu: ders kırılımı var", /Ders kırılımı: Türkçe/.test(konu), konu);
const konuBos = H.kocYanit("zayıf olduğum konular", {});
ok("konu: veri yoksa dürüst", /Kayıtlı hatalı soru konusu yok/.test(konuBos), konuBos);

// ---- 6) Okulizyon ----
const okz = H.kocYanit("Okulizyon'dan hangi sorular geldi?", ctx);
ok("okulizyon: bekleyen sayı", okz.includes("3 soru"), okz);
ok("okulizyon: sınav adı", okz.includes("MAARİF"), okz);
ok("okulizyon: ders dağılımı", /Ders dağılımı: Türkçe 2 · Kimya 1/.test(okz), okz);
ok("okulizyon: yapılacak adım", /Nedenleri seç/.test(okz));
const okzBos = H.kocYanit("okulizyon", { okulizyon: { bekleyen: 0 } });
ok("okulizyon: boş kuyrukta yönlendirir", /Şimdi dene/.test(okzBos), okzBos);
const okzHata = H.kocYanit("okulizyon", { okulizyon: { bekleyen: 0, durum: { kod: "sifre-gerekli", mesaj: "Okulizyon bu kayıt için şifre istiyor." } } });
ok("okulizyon: hata durumu mesajı gösterilir", /şifre istiyor/.test(okzHata), okzHata);

// ---- 7) Sınav / kitap / motivasyon ----
ok("sınav: kalan gün", H.kocYanit("sınava kaç gün kaldı?", ctx).includes("42 gün"));
ok("sınav: hedef net", H.kocYanit("hedefim ne?", ctx).includes("110"));
ok("sınav: tarih yoksa yönlendirir", /Planlama sayfasına/.test(H.kocYanit("sınav ne zaman", {})), H.kocYanit("sınav ne zaman", {}));
ok("kitap: veri yoksa dürüst", /okuma kaydın yok/.test(H.kocYanit("kitap okuyorum", ctx)));
ok("kitap: veri varsa sayı verir", H.kocYanit("okuma", { okuma: { sayfa: 120, dakika: 300 } }).includes("120 sayfa"));
ok("motivasyon: konu önerir", /Tamlamalar - Karma/.test(H.kocYanit("moralim bozuk", ctx)), H.kocYanit("moralim bozuk", ctx));
ok("teşekkür", /Rica ederim/.test(H.kocYanit("teşekkürler", ctx)));
ok("yardım listesi 4 başlık", (H.kocYanit("yardım", ctx).match(/→/g) || []).length >= 4, H.kocYanit("yardım", ctx));
ok("selamlama: isimle", H.kocYanit("merhaba", ctx).includes("MUHAMMED EFE"));
ok("selamlama: isim yoksa dostum", H.kocYanit("selam", {}).includes("dostum"));

// ---- 8) Yanıtlar her zaman metin (arayüz çökmez) ----
const sorular = ["", "   ", "net", "konu", "okulizyon", "sınav", "kitap", "moralim bozuk", "??", "ğüşıöç", "yardım", "selam"];
ok("tüm sorulara metin döner", sorular.every((q) => typeof H.kocYanit(q, ctx) === "string" && H.kocYanit(q, ctx).length > 5));
ok("bağlam undefined olsa da çökmez", typeof H.kocYanit("netlerim", undefined) === "string");

// ---- 9) Arayüz bağlantısı (index.html) ----
const html = fs.readFileSync(HTML, "utf8");
ok("index.html mesaj.js dosyasını yüklüyor", /<script src="mesaj\.js"><\/script>/.test(html));
ok("koç paneli HTML'de var", html.includes('id="coach-panel"') && html.includes('id="coach-messages"'));
ok("panel açılışı mesajları tazeler", /function toggleCoachPanel\(\)[\s\S]{0,400}renderCoachPanel\(\)/.test(html), "toggleCoachPanel renderCoachPanel çağırmıyor");
ok("mesaj girişi ve gönder düğmesi üretilir", /koc-girdi/.test(fs.readFileSync(DOSYA, "utf8")) && /koc-gonder/.test(fs.readFileSync(DOSYA, "utf8")));
ok("sohbet cihazda saklanır (localStorage)", /localStorage\.setItem\(ANAHTAR/.test(fs.readFileSync(DOSYA, "utf8")));

console.log(`\nMesaj özelliği (Koçluk Hattı) testleri — ${gecen}/${gecen + kalan.length} geçti`);
if (kalan.length) {
  console.error("\nBAŞARISIZ:");
  kalan.forEach((k) => console.error(" ✗ " + k));
  process.exit(1);
}
console.log("✓ tümü geçti");
