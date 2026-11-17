#!/usr/bin/env node
/* ============================================================
   Üslup yaması: "doğru şık belirgin uzun" uyarıları
   ------------------------------------------------------------
   havuz-son-kontrol.js şu kuralı uyarı sayar:
       doğru şık uzunluğu > ortalama * 1.7  ve
       doğru şık, en uzun çeldiriciden 12 karakterden fazla uzun
   Bu durumda cevap, metni okumadan yalnız uzunluğa bakarak bulunabilir.

   Yamada doğru şık kısaltılır (anlam korunarak) veya çeldiriciler
   doğru şıkla aynı ayrıntı düzeyine getirilir. `dogru_index`
   değişmez; yalnız şık metinleri yenilenir.

   Kullanım:
     node docs/uretim/uretim/yama-sik-uzunluk.js --kontrol   (yalnız bakar)
     node docs/uretim/uretim/yama-sik-uzunluk.js             (yazar)
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KONTROL = process.argv.includes("--kontrol");
const HAVUZ_DIR = path.join(__dirname, "..", "..", "..", "site", "content", "soru_havuzlari");

/* havuz → { soru_id: [dört şık] } — doğru cevabın konumu korunur */
const YAMA = {
  biyo_10_u01_k08: {
    biyo_10_u01_k08_o10: ["Mitokondri iç zarında", "Sitoplazmada", "Çekirdekte", "Lizozomda"]
  },
  biyo_10_u02_k01: {
    biyo_10_u02_k01_o07: ["Üretici", "Tüketici", "Ayrıştırıcı", "Sınırlayıcı etken"]
  },
  biyo_10_u02_k05: {
    biyo_10_u02_k05_o03: ["S eğrisi", "J eğrisi", "Ters eğri", "Sabit çizgi"],
    biyo_10_u02_k05_o09: ["Azalır, sonra artar", "Sürekli artar", "Değişmez", "Sıfırlanır"]
  },
  biyo_10_u02_k06: {
    biyo_10_u02_k06_o06: [
      "Verimli üst toprağın taşınması",
      "Toprağın kimyasal gübreyle zenginleşmesi",
      "Yer altı suyunun yükselmesi",
      "Toprağın donması"
    ],
    biyo_10_u02_k06_o07: [
      "Zincirin en üst halkasında",
      "Üreticilerde",
      "Ayrıştırıcılarda",
      "Birincil tüketicilerde"
    ]
  },
  cogr_10_u03_k04: {
    cogr_10_u03_k04_o09: [
      "Yalnızca gezi fotoğrafları",
      "Sadece konu başlığı ve sonuç cümlesi",
      "Amaç, yöntem, gözlem ve kanıta dayalı öngörü",
      "Gözlemle ilgisi olmayan genel bilgiler"
    ]
  },
  cogr_10_u03_k05: {
    cogr_10_u03_k05_o12: [
      "Yalnızca yerleşmelerin adları",
      "Sadece yıllık yağış miktarı",
      "Yerleşme dağılışı, ekonomik faaliyet ve ulaşım",
      "İlgisiz bir döneme ait nüfus sıralaması"
    ]
  },
  cogr_10_u04_k02: {
    cogr_10_u04_k02_o04: ["Gerileyen yerleşmeler", "Metropoliten alanlar", "Uydu kentler", "Banliyöler"],
    cogr_10_u04_k02_o10: ["Metropoliten alan", "Yalnız köy sınırları", "Yalnız liman bölgesi", "Yalnız sanayi sitesi"]
  },
  cogr_10_u05_k02: {
    cogr_10_u05_k02_o01: ["Tarım, hayvancılık, madencilik", "Sanayi ve imalat", "Ticaret ve ulaşım", "Bilişim ve yazılım"],
    cogr_10_u05_k02_o02: ["Sanayi, imalat ve inşaat", "Tarım ve hayvancılık", "Turizm ve sağlık", "Ar-Ge ve yazılım"],
    cogr_10_u05_k02_o03: ["Ticaret, ulaşım ve turizm", "Madencilik", "İmalat sanayi", "Ormancılık"],
    cogr_10_u05_k02_o04: ["Bilişim ve Ar-Ge", "Tarım ve ormancılık", "Sanayi ve imalat", "İnşaat ve ulaşım"],
    cogr_10_u05_k02_o10: [
      "Üretilen mal ve hizmet toplam değeri",
      "Ülkenin toplam nüfusunu",
      "İthalat miktarını",
      "Turist sayısını"
    ]
  },
  cogr_10_u06_k01: {
    cogr_10_u06_k01_o06: [
      "Her yerde aynı erişim ve hizmet planını kullanmak",
      "Yer şekilleri ve erişimi birlikte değerlendiren yerel planlama",
      "Risk incelemesi tamamlanmadan yeni yapı alanları açmak",
      "Yalnızca toplam nüfusa bakıp mekânsal özellikleri göz ardı etmek"
    ],
    cogr_10_u06_k01_o07: [
      "Yalnızca günlük hava tahminini incelemek",
      "Sadece nüfus miktarını dikkate almak",
      "Yerleşim, erişim ve bina özelliklerini incelemek",
      "Coğrafi koşulları planlama dışında bırakmak"
    ]
  },
  cogr_10_u06_k02: {
    cogr_10_u06_k02_o09: ["Yamaçta kontrolsüz kazı", "Yağış miktarı", "Yamaç eğimi", "Kaya yapısı"]
  },
  cogr_10_u06_k03: {
    cogr_10_u06_k03_o02: ["Eğitim ve yasal düzenleme", "Baraj inşası", "İstinat duvarı", "Set yapımı"],
    cogr_10_u06_k03_o08: [
      "Azaltma, hazırlık, müdahale, iyileştirme",
      "Yalnız müdahale aşaması",
      "Yalnız iyileştirme aşaması",
      "Yalnız sigorta ve finansman"
    ]
  },
  cogr_10_u06_k04: {
    cogr_10_u06_k04_o04: ["Su, gıda, ilaç, düdük, radyo", "Yalnız oyun konsolu", "Yalnız kitap", "Yalnız kıyafet"],
    cogr_10_u06_k04_o06: [
      "Toplanma alanını önceden öğrenmek",
      "Afet anında aramak",
      "Toplanma alanını umursamamak",
      "Yalnız komşuya sormak"
    ],
    cogr_10_u06_k04_o07: ["Davranışı otomatikleştirmek", "Korku yaratmak", "Zaman kaybettirmek", "Sınav yapmak"],
    cogr_10_u06_k04_o10: ["AFAD", "Bir eğitim vakfı", "Bir özel şirket", "Bir yerel dernek"]
  },
  cogr_10_u07_k01: {
    cogr_10_u07_k01_o02: [
      "Çadır ve yaylak-kışlak kullanımı",
      "Yüksek katlı konutlar",
      "Metro ağları",
      "Liman kentleri"
    ],
    cogr_10_u07_k01_o04: [
      "Kültürel öğelerin yayılmasını",
      "Kültürün yok olmasını",
      "Nüfusun azalmasını",
      "İklim değişimini"
    ]
  },
  din_10_u02_k05: {
    din_10_u02_k05_o04: [
      "Evrende her şeyin tesadüfen oluştuğunu kanıtlar",
      "İnsanın ahlaki sorumluluğunu ortaya koyar",
      "Evrenin varlığının bir yaratıcı gerektirdiğini",
      "İbadetlerin farz olduğunu temellendirir"
    ]
  },
  din_10_u02_k07: {
    din_10_u02_k07_o04: [
      "Evrende düzen bulunmadığı",
      "Evrenin bir başlangıcı olmadığı",
      "Zihindeki fikrin varlığı kanıtlamaması",
      "İnsanın dua etmediği"
    ]
  },
  din_10_u03_k01: {
    din_10_u03_k01_o10: [
      "Şirk ve tevil kavramlarıyla",
      "Çoklukta birlik ve birlikte çoklukla",
      "İlim ve sezgi kavramlarıyla",
      "Savaş ve barış kavramlarıyla"
    ]
  },
  fizik_10_u01_k01: {
    fizik_10_u01_k01_o11: ["Alınan toplam yolu", "Ortalama sürati", "Yer değiştirme", "Hareket süresini"]
  },
  fizik_10_u01_k03: {
    fizik_10_u01_k03_o03: ["10 katına çıkar.", "Yarısına iner.", "Değişmez.", "Sıfır olur."]
  },
  fizik_10_u02_k02: {
    fizik_10_u02_k02_o09: [
      "Sesin yayılması için maddesel ortam gerekir.",
      "Zil titreşmediği için ses oluşmamıştır.",
      "Ses yalnızca sıvılarda yayılır.",
      "Ses enerjisi ışığa dönüştüğü için duyulmaz."
    ],
    fizik_10_u02_k02_o10: [
      "Yalnızca katılarda bulunmaları",
      "Birbirine dönüşememeleri",
      "Her durumda aynı kaynaktan elde edilmeleri",
      "Joule ile ifade edilir ve birbirine dönüşebilir."
    ]
  },
  fizik_10_u03_k07: {
    fizik_10_u03_k07_o06: [
      "İstasyonun besleme gerilimini ayarlamak",
      "Yıldırım yükünü toprağa aktarmak",
      "Tüm elektrik akımını sürekli kesmek",
      "Rüzgâr hızını ölçmek"
    ]
  },
  kimya_10_u02_k06: {
    kimya_10_u02_k06_o10: [
      "İyon derişimlerinin çarpımı",
      "Çözeltinin toplam kütlesini",
      "Çözücünün hacmini",
      "Çözünme ısısını"
    ]
  },
  kimya_10_u02_k07: {
    kimya_10_u02_k07_o01: [
      "Daha fazla madde çözebilen çözelti",
      "Maksimum maddeyi çözmüş çözelti",
      "Çökelme olan çözelti",
      "Saf çözücü"
    ],
    kimya_10_u02_k07_o02: [
      "Doygun çözeltiyi soğutarak",
      "Çözeltiyi ısıtarak",
      "Saf su eklenerek",
      "Basınç düşürülerek"
    ],
    kimya_10_u02_k07_o07: ["Heterojen karışım", "Homojen katı-sıvı karışımı", "İyonik çözelti", "Gaz karışımı"]
  },
  kimya_10_u02_k08: {
    kimya_10_u02_k08_o07: ["Osmoz", "Çözünenin zarı geçmesi", "Buharın yoğuşması", "İyonların çökelmesi"],
    kimya_10_u02_k08_o09: [
      "Buhar basıncı dış basınca eşitlenmeli",
      "Çözelti soğuduğu için",
      "Tanecik sayısı azaldığı için",
      "Yoğunluk düştüğü için"
    ]
  },
  mat_10_u02_k02: {
    mat_10_u02_k02_o06: [
      "Grafik, aracın süreyi kesin olarak kısalttığını kanıtlar.",
      "Dağılım nedensellik göstermez; başka etkenler incelenmeli.",
      "Kategorik veriler grafikle karşılaştırılamaz.",
      "Bütün ekiplerin iş yükü aynı olmak zorundadır."
    ],
    mat_10_u02_k02_o08: [
      "Çevrim içi kayıt yaptırmak her kişinin gösteriye gelmesini sağlar.",
      "Etkinlik alanında kayıt yaptıranların tamamı gösteriye gelmemiştir.",
      "Kayıt yöntemi katılımı kesin olarak belirler.",
      "Çevrim içi grupta katılım %75, diğerinde %50; nedensellik yok."
    ]
  },
  tarih_10_u01_k01: {
    tarih_10_u01_k01_o09: [
      "İslam dünyasındaki saygınlığın artması",
      "Kudüs'ün Haçlılara bırakılmasını",
      "Selçukluların Moğollara yenilmesini",
      "Doğu Roma ile Haçlıların birleşmesini"
    ]
  },
  tarih_10_u01_k04: {
    tarih_10_u01_k04_o07: ["Konaklama ve güvenlik", "Eğitim vermek", "Sağlık hizmeti sunmak", "İbadet yeri olmak"]
  },
  tarih_10_u02_k01: {
    tarih_10_u02_k01_o04: [
      "Fetret Devri'ni sona erdirmesine",
      "Edirne'nin fethini başlatmasına",
      "İskân politikasının Rumeli'de uygulanmasına",
      "Beyliğin bağımsız siyasi güç olarak doğuşu"
    ],
    tarih_10_u02_k01_o09: [
      "Balkanlarda hâkimiyetin güçlenmesi",
      "Ankara Savaşı'nın sona ermesi",
      "Fetret Devri'nin başlaması",
      "Osmanlıların İznik'i kaybetmesi"
    ],
    tarih_10_u02_k01_o12: [
      "Osmanlı kuvvetlerinin Rumeli'den çekilmesi",
      "Osmanlı siyasi birliğinin sona ermesi",
      "Sırp Despotluğu'nun Anadolu'da kurulması",
      "Rumeli'de Osmanlı hâkimiyetinin güçlenmesi"
    ]
  },
  tarih_10_u02_k05: {
    tarih_10_u02_k05_o02: ["Sahn-ı Seman", "Enderun", "Darüşşifa", "Rasathane"],
    tarih_10_u02_k05_o08: ["Esnaf arasında dayanışma", "Medresede ders vermek", "Vergi toplamak", "Asker yetiştirmek"],
    tarih_10_u02_k05_o09: ["Okul ve kütüphane finansmanı", "Yalnız cami yapmak", "Yalnız çeşme yapmak", "Yalnız ticaret yapmak"],
    tarih_10_u02_k05_o10: ["Bibliyografya eserleri", "Yalnız şiir", "Yalnız hat sanatı", "Yalnız musiki"]
  },
  tarih_10_u03_k01: {
    tarih_10_u03_k01_o08: [
      "Osmanlı Devleti'nin Akdeniz'den çekilmesini",
      "Safevi Devleti'nin sona ermesini",
      "Osmanlıların Avrupa'daki bütün seferleri durdurmasını",
      "İslam dünyasındaki etkinin ve gelirlerin artması"
    ],
    tarih_10_u03_k01_o15: [
      "Portekiz'in bütün Hint Okyanusu limanlarını Osmanlılara bırakmasını",
      "Mekke ve Medine'nin başka bir devlete bağlanmasını",
      "Tüccarların güvenliğini artırıp baharat ticaretini canlandırması",
      "Baharat ticaretinin tamamen sona ermesini"
    ]
  },
  tarih_10_u03_k05: {
    tarih_10_u03_k05_o03: ["Hukuk ve yönetim", "Tıp ve eczacılık", "Coğrafya ve haritacılık", "Fıkıh ve kelam"]
  }
};

/* havuz-son-kontrol.js ile aynı kural */
function uyariVar(sec, di) {
  const uz = sec.map(x => String(x || "").length);
  const ort = uz.reduce((a, b) => a + b, 0) / 4;
  return uz[di] > ort * 1.7 && uz[di] - Math.max(...uz.filter((_, j) => j !== di)) > 12;
}

let yazilan = 0, atlanan = 0, hatalar = [];

for (const [havuz, sorular] of Object.entries(YAMA)) {
  const yol = path.join(HAVUZ_DIR, havuz + ".json");
  if (!fs.existsSync(yol)) { hatalar.push(havuz + ": dosya yok"); continue; }
  const veri = JSON.parse(fs.readFileSync(yol, "utf8"));
  let degisti = false;

  for (const [soruId, secenekler] of Object.entries(sorular)) {
    const q = (veri.sorular || []).find(x => x.soru_id === soruId);
    if (!q) { hatalar.push(havuz + " " + soruId + ": soru yok"); continue; }
    if (secenekler.length !== 4) { hatalar.push(soruId + ": 4 şık değil"); continue; }
    if (new Set(secenekler).size !== 4) { hatalar.push(soruId + ": mükerrer şık"); continue; }
    const di = q.dogru_index;
    if (!Number.isInteger(di) || di < 0 || di > 3) { hatalar.push(soruId + ": dogru_index geçersiz"); continue; }
    if (uyariVar(secenekler, di)) hatalar.push(soruId + ": yeni şıklar da kuralı çiğniyor");
    q.secenekler = secenekler.slice();
    degisti = true;
  }

  if (!degisti) { atlanan++; continue; }
  if (!KONTROL) fs.writeFileSync(yol, JSON.stringify(veri, null, 2) + "\n", "utf8");
  yazilan += Object.keys(sorular).length;
}

console.log(
  (KONTROL ? "(kontrol modu) " : "") +
  "yama: " + yazilan + " soru · havuz: " + Object.keys(YAMA).length +
  " · atlanan havuz: " + atlanan
);
if (hatalar.length) {
  console.log("HATALAR:");
  hatalar.forEach(h => console.log("  - " + h));
  process.exitCode = 1;
} else {
  console.log("SONUÇ: yama temiz");
}
