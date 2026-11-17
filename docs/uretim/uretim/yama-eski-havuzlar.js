#!/usr/bin/env node
/* ============================================================
   ESKİ ŞEMALI KONU HAVUZLARI — kalıcı yama
   ------------------------------------------------------------
   Bu havuzların üretici betiği yok (2018 ünite yapısında, elle
   hazırlanmış dosyalar). Bu yüzden JSON'lar doğrudan düzenlenmez;
   düzeltmeler burada, tek yerde tutulur ve betik yeniden
   çalıştırılabilir (idempotent).

   Düzeltilen sorunlar (2026-11 son kontrol):
     1) Kart önü ile soru kökü AYNI olan 12 soru → kök senaryolaştırıldı,
        kart tanım olarak kaldı.
     2) Tanım kalıbında kalmış 3 kısa kök (metropoliten alan, GSYH, zekât
        oranı, zekâtın verileceği kişiler) → senaryoya çevrildi.
     3) İki sayısal soruda çözüm tek satırdı → bağıntı ve yerine koyma
        adımları açık yazıldı.
     4) din_10_u05_k01, din_10_u04_k03 ile aynı topic_key'i taşıyordu
        → resmî konu adına çekildi (indekste çakışma kalmadı).

   Kullanım:
     node docs/uretim/uretim/yama-eski-havuzlar.js          # uygula
     node docs/uretim/uretim/yama-eski-havuzlar.js --kontrol # yalnız bak
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..", "..", "..");
const HAVUZ = path.join(KOK, "site", "content", "soru_havuzlari");
const KONTROL = process.argv.includes("--kontrol");

/* dosya · soru no (1'den başlar) · eski metin/kök · yeni metin/kök */
const YAMALAR = [
  /* ---- Coğrafya ---- */
  {
    dosya: "cogr_10_u04_k02.json", no: 10, alan: "metin",
    eski: "Metropoliten alan nedir?",
    yeni: "Bir kent, çevresindeki yerleşmelerle ortak bir ekonomik ve toplumsal bütün oluşturmuş; ulaşım ve hizmet ağı bu bütüne göre kurulmuştur. Bu yerleşim biçimine ne ad verilir?"
  },
  {
    dosya: "cogr_10_u05_k02.json", no: 10, alan: "metin",
    eski: "GSYH neyi ifade eder?",
    yeni: "Bir ülkede belirli bir dönemde üretilen mal ve hizmetlerin parasal toplamı hesaplanarak ülke ekonomisinin büyüklüğü ölçülmüştür. Bu gösterge hangisidir?"
  },
  {
    dosya: "cogr_10_u06_k04.json", no: 10, alan: "metin",
    eski: "AFAD hangi kurumdur?",
    yeni: "Bir ilde büyük bir depremin ardından arama kurtarma, barınma ve yardım dağıtımı tek merkezden yürütülmüştür. Bu işleri yürüten kurum hangisidir?"
  },
  {
    dosya: "cogr_10_u06_k03.json", no: 1, alan: "metin",
    eski: "Yapısal önlem örneği hangisidir?",
    yeni: "Heyelan riski taşıyan bir yamaçta toprak kaymasını önlemek için mühendislik çözümü uygulanmıştır. Bu amaçla hangi çalışma yapılır?"
  },
  {
    dosya: "cogr_10_u06_k03.json", no: 2, alan: "metin",
    eski: "Yapısal olmayan önlem örneği hangisidir?",
    yeni: "Bir okulda afet bilinci kazandırmak için tatbikatlar düzenlenmiş, belediye de yapı denetimi yönetmeliğini güncellemiştir. Bu çalışmalar hangi önlem grubundadır?"
  },
  {
    dosya: "cogr_10_u06_k03.json", no: 3, alan: "metin",
    eski: "Depremde yapısal olmayan risk hangisidir?",
    yeni: "Deprem sırasında evdeki dolabın devrilmesi ve pencere camlarının kırılması yaralanmalara yol açmıştır. Bu tehlikeler hangi risk grubundadır?"
  },

  /* ---- Din Kültürü ---- */
  {
    dosya: "din_10_u02_k04.json", no: 2, alan: "metin",
    eski: "Kur'an'da en çok vurgulanan konu hangisidir?",
    yeni: "Kur'an'ın ana konuları incelendiğinde, ayetlerin en çok üzerinde durduğu ve diğer konuların kendisine bağlandığı ilke hangisidir?"
  },
  {
    dosya: "din_10_u02_k03.json", no: 7, alan: "metin",
    eski: "Zekât oranı kırkta bir ise bu yüzde kaçtır?",
    yeni: "Bir kişi, nisap miktarını aşan malının kırkta birini zekât olarak vermektedir. Bu oran yüzde olarak kaçtır?"
  },
  {
    dosya: "din_10_u02_k03.json", no: 7, alan: "cozum",
    eski: "1/40 = %2,5 zekât oranıdır.",
    yeni: "Kırkta bir kesri, 1/40 = 0,025 olduğundan yüzde olarak %2,5'e karşılık gelir. Zekât, nisap miktarını aşan malın kırkta biri oranında verilir."
  },
  {
    dosya: "din_10_u02_k03.json", no: 8, alan: "metin",
    eski: "Zekât kimlere verilir?",
    yeni: "Bir kişi zekâtını yalnız akrabalarına vermek istemiş; oysa zekâtın harcanacağı yerler Kur'an'da sayılmıştır. Buna göre zekât kimlere verilir?"
  },
  {
    dosya: "din_10_u03_k04.json", no: 3, alan: "metin",
    eski: "Gıybet nedir?",
    yeni: "Bir kişi, arkadaşının arkasından onun duyduğunda üzüleceği bir özelliğini anlatmıştır. Bu davranış hangi kavramla adlandırılır?"
  },
  {
    dosya: "din_10_u03_k04.json", no: 5, alan: "metin",
    eski: "İnfak ne demektir?",
    yeni: "Bir kişi, ihtiyaç fazlası malını Allah rızası için ihtiyaç sahipleriyle paylaşmıştır. Bu davranış hangi kavramla ifade edilir?"
  },

  /* ---- Kimya ---- */
  {
    dosya: "kimya_10_u02_k07.json", no: 1, alan: "metin",
    eski: "Doymamış çözelti hangisidir?",
    yeni: "Belirli bir sıcaklıkta, çözücü hâlâ daha fazla madde çözebilecek durumdayken bir çözelti hazırlanmıştır. Bu çözelti hangi sınıfa girer?"
  },
  {
    dosya: "kimya_10_u02_k07.json", no: 3, alan: "metin",
    eski: "Elektrolit çözelti hangisidir?",
    yeni: "Hazırlanan çözeltide madde suda iyonlarına ayrışmakta ve çözelti elektrik akımını iletmektedir. Bu çözelti hangi türdendir?"
  },
  {
    dosya: "kimya_10_u02_k07.json", no: 7, alan: "metin",
    eski: "Süspansiyon hangisidir?",
    yeni: "Kum suda çözünmeden dağılmış; karışım bir süre bekletildiğinde tanecikler kabın dibine çökmüştür. Bu karışım hangisidir?"
  },
  {
    dosya: "kimya_10_u02_k08.json", no: 1, alan: "metin",
    eski: "Koligatif özellikler neye bağlıdır?",
    yeni: "Aynı derişimde hazırlanan tuzlu ve şekerli suyun kaynama noktası yükselmesi aynı ölçülmüştür. Bu gözlem, koligatif özelliklerin neye bağlı olduğunu gösterir?"
  },
  {
    dosya: "kimya_10_u02_k08.json", no: 7, alan: "metin",
    eski: "Ozmoz nedir?",
    yeni: "Bir hücre saf suya konulduğunda şişmiştir; çünkü su, yarı geçirgen zardan hücre içine doğru geçmiştir. Bu olay hangi kavramla adlandırılır?"
  },

  /* ---- Din Kültürü: topic_key çakışması ----
     din_10_u05_k01, din_10_u04_k03 ile aynı anahtarı ("4.3 Medine
     Dönemi") taşıyordu; içeriği 5. ünitenin konusu olduğu için
     Bilgi Bankası kayıt defterindeki resmî adına çekildi. */
  {
    dosya: "din_10_u05_k01.json", no: null, alan: "topic_key",
    eski: "Din Kültürü > 4.3 Medine Dönemi",
    yeni: "Din Kültürü > Dinî Yorum Farklılıklarının Nedenleri"
  },

  /* ---- Fizik / Kimya: kısa çözümler ---- */
  {
    dosya: "fizik_10_u01_k02.json", no: 7, alan: "cozum",
    eski: "v=v₀+at=3+2·6=15 m/s olur.",
    yeni: "Sabit ivmeli harekette son hız v = v₀ + a·t bağıntısıyla bulunur. Değerler yerine konur: v = 3 m/s + (2 m/s²)·(6 s) = 3 + 12 = 15 m/s."
  },
  {
    dosya: "kimya_10_u01_k03.json", no: 9, alan: "cozum",
    eski: "n=m/M=85/17=5 mol.",
    yeni: "Mol sayısı n = m / Mₐ bağıntısıyla bulunur. Burada m = 85 g, Mₐ = 17 g/mol olduğundan n = 85/17 = 5 mol olur."
  }
];

let uygulanan = 0, atlanan = 0, hatalar = [];

for (const y of YAMALAR) {
  const yol = path.join(HAVUZ, y.dosya);
  if (!fs.existsSync(yol)) { hatalar.push(y.dosya + ": dosya yok"); continue; }
  const pool = JSON.parse(fs.readFileSync(yol, "utf8"));
  /* no: null → alan havuzun kendi üstünde (ör. topic_key) */
  const q = y.no ? (pool.sorular || [])[y.no - 1] : pool;
  if (!q) { hatalar.push(y.dosya + " s" + y.no + ": soru yok"); continue; }
  const etiket = y.no ? y.dosya + " s" + y.no : y.dosya;
  if (String(q[y.alan]) === y.yeni) { atlanan++; continue; }
  if (String(q[y.alan]) !== y.eski) {
    hatalar.push(etiket + " · " + y.alan + ": beklenen değer bulunamadı → " + JSON.stringify(String(q[y.alan]).slice(0, 60)));
    continue;
  }
  q[y.alan] = y.yeni;
  if (!KONTROL) fs.writeFileSync(yol, JSON.stringify(pool, null, 2) + "\n", "utf8");
  uygulanan++;
}

console.log((KONTROL ? "[kontrol] " : "") + "yama: " + uygulanan + " · zaten güncel: " + atlanan + " · hata: " + hatalar.length);
hatalar.forEach(h => console.log("  ✗ " + h));
process.exitCode = hatalar.length ? 1 : 0;
