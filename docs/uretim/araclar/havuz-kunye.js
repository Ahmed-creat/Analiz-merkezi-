#!/usr/bin/env node
/* ============================================================
   HAVUZ KÜNYESİ — kaynak (ders kitabı + sayfa) ve kazanım alanları
   ------------------------------------------------------------
   Bazı derslerin 2. tur havuzları künye alanları olmadan yazıldı:
     · havuzda `kaynak` yok          (ders kitabı + sayfa izlenebilirliği)
     · havuzda `kazanim` yok         (konu kazanımı)
     · sorularda `kazanim` yok       (havuzdan devralınıyor)

   Bu araç, kitap metninden sayfa aralığını bulur ve künyeyi yazar:
     · kaynak  = "<Ders> 10 ders kitabı, s.<ilk>-<son>"
       ilk  : havuz başlığının kitapta ilk geçtiği sayfa (içindekiler hariç)
       son  : sıradaki havuzun ilk sayfası - 1
     · kazanim = kazanım→konu eşlemesindeki resmî çıktı varsa plan
                 metni, yoksa temanın program çıktısı (meb_kazanim_10)
     · soru.kazanim = havuz kazanımı (denetim kuralı: plan metniyle aynı)

   Kullanım:
     node docs/uretim/araclar/havuz-kunye.js "Felsefe" [--kuru]
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const KOK = path.resolve(__dirname, "../../..");
const SITE = path.join(KOK, "site/content/soru_havuzlari");
const PWA = path.join(KOK, "pwa-files/content/soru_havuzlari");
const KAZANIM = path.join(KOK, "site/content/mufredat/kazanim_konu_10.json");
const PROGRAM = path.join(KOK, "site/content/mufredat/meb_kazanim_10.json");
const KITAP_DIR = path.join(KOK, "docs/uretim/.kitap-metin");

const args = process.argv.slice(2);
const kuru = args.includes("--kuru");
const ders = args.find(a => !a.startsWith("--"));
if (!ders) {
  console.error('Kullanım: node docs/uretim/araclar/havuz-kunye.js "<Ders>" [--kuru]');
  process.exit(2);
}

const SLUG = {
  "Felsefe": "felsefe", "Din Kültürü": "din", "Coğrafya": "cografya",
  "Fizik": "fizik", "Kimya": "kimya", "Matematik": "matematik"
};
const slug = SLUG[ders];
const kitapYolu = slug ? path.join(KITAP_DIR, slug + ".json") : null;
const kitap = kitapYolu && fs.existsSync(kitapYolu)
  ? JSON.parse(fs.readFileSync(kitapYolu, "utf8")) : null;

const kazanimVeri = JSON.parse(fs.readFileSync(KAZANIM, "utf8"));
const program = JSON.parse(fs.readFileSync(PROGRAM, "utf8"));

const sadeles = s => String(s || "").toLocaleLowerCase("tr").replace(/[^a-zçğıöşü0-9 ]/g, " ").replace(/\s+/g, " ").trim();

/* havuzları konu sırasına diz */
const dosyalar = fs.readdirSync(SITE)
  .filter(f => f.endsWith(".json") && f !== "index.json")
  .filter(f => {
    try { return JSON.parse(fs.readFileSync(path.join(SITE, f), "utf8")).ders === ders; }
    catch (e) { return false; }
  })
  .sort();

if (!dosyalar.length) { console.error("havuz yok:", ders); process.exit(1); }

function sayfaBul(baslik) {
  if (!kitap) return null;
  const core = sadeles(String(baslik).replace(/^\d+(\.\d+)*\s*/, ""));
  if (core.length < 6) return null;
  for (const p of kitap.sayfalar) {
    if (p.s <= 14) continue;              // içindekiler / ilk sayfalar
    if (sadeles(p.metin).includes(core)) return p.s;
  }
  return null;
}

const havuzlar = dosyalar.map(f => {
  const p = path.join(SITE, f);
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  return { f, p, j };
});

/* 1) sayfa başlangıçları */
const baslangiclar = havuzlar.map(h => sayfaBul(h.j.baslik));
for (let i = baslangiclar.length - 2; i >= 0; i--) {
  if (baslangiclar[i] == null) baslangiclar[i] = baslangiclar[i + 1];
}
for (let i = 1; i < baslangiclar.length; i++) {
  if (baslangiclar[i] != null && baslangiclar[i - 1] != null && baslangiclar[i] < baslangiclar[i - 1]) {
    baslangiclar[i] = baslangiclar[i - 1];
  }
}

let kaynakYazan = 0, kazanimYazan = 0, soruKazanim = 0, atlanan = 0;

havuzlar.forEach((h, i) => {
  const j = h.j;
  const sorular = Array.isArray(j.sorular) ? j.sorular : [];

  /* --- kaynak --- */
  const ilk = baslangiclar[i];
  const sonraki = baslangiclar.slice(i + 1).find(x => x != null && x > ilk);
  if (ilk != null) {
    const son = sonraki ? sonraki - 1 : ilk + 8;
    const yeniKaynak = ders + " 10 ders kitabı, s." + ilk + "-" + son;
    if (!j.kaynak) { j.kaynak = yeniKaynak; kaynakYazan++; }
  } else if (!j.kaynak) {
    console.log("  ! sayfa bulunamadı:", h.f);
    atlanan++;
  }

  /* --- kazanım --- */
  const kayit = kazanimVeri.konular.find(k => k.konu_id === j.konu_id);
  const kod = kayit && Array.isArray(kayit.kodlar) && kayit.kodlar.length ? kayit.kodlar[0] : null;
  let kazanim = null;
  if (kod) {
    const plan = (program.ciktilar || []).find(c => c.kod === kod);
    if (plan) kazanim = plan.kazanim;
  }
  if (!kazanim) {
    /* temanın çıktısı: konu_id içindeki u<NN> */
    const m = /_u(\d\d)_/.exec(j.konu_id);
    if (m) {
      const tema = Number(m[1]);
      const aday = (program.ciktilar || []).filter(c => c.ders === ders && c.tema === tema);
      if (aday.length) kazanim = aday[0].kazanim;
    }
  }
  if (kazanim && !j.kazanim) { j.kazanim = kazanim; kazanimYazan++; }
  if (j.kazanim) {
    for (const q of sorular) {
      if (q.kazanim !== j.kazanim) { q.kazanim = j.kazanim; soruKazanim++; }
    }
  }

  if (!kuru) {
    fs.writeFileSync(h.p, JSON.stringify(j, null, 2) + "\n", "utf8");
    const pwaP = path.join(PWA, h.f);
    if (fs.existsSync(pwaP)) fs.writeFileSync(pwaP, JSON.stringify(j, null, 2) + "\n", "utf8");
  }
});

console.log(ders + ": " + havuzlar.length + " havuz · kaynak +" + kaynakYazan +
  " · kazanım +" + kazanimYazan + " · soru kazanımı " + soruKazanim +
  (atlanan ? " · sayfası bulunamayan " + atlanan : "") + (kuru ? " (kuru)" : ""));
