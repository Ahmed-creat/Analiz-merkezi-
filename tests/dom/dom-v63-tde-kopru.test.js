/* v63 — TDE ↔ OKULİZYON KÖPRÜSÜ
   ------------------------------------------------------------
   KULLANICI: "Edebiyatın okulizyonla eşleşmesi için …"
   TYMM TDE çıktıları beceri adı verir, Okulizyon konu kazanımı.
   Bu test köprünün UYDURMA olmadığını kanıtlar:

     1) 4 temanın içeriği TYMM tema sayfalarından alınmış ve kaynaklı
     2) Her tema TYMM'de GERÇEKTEN var olan çıktı kodlarına bağlı
     3) Okulizyon kazanımı → tema eşleşmesi ÇEKİRDEK terimle ve tek tema
     4) "Destan Dönemi" tuzağı: tema 3'e değil tema 1'e bağlanır
     5) Okulizyon metni olmayan temalar BOŞ bırakılmış (uydurulmamış)
   Çalıştır: node tests/dom/dom-v63-tde-kopru.test.js
   ============================================================ */
"use strict";
const fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "..");
const { kopru, temaBul, beceriBul } = require(path.join(KOK, "scripts", "tde-kopru.js"));

const ICERIK = JSON.parse(fs.readFileSync(path.join(KOK, "site/content/mufredat/tde_icerik_10.json"), "utf8"));
const MEB = JSON.parse(fs.readFileSync(path.join(KOK, "site/content/mufredat/meb_kazanim_10.json"), "utf8"));

let gecen = 0; const hata = [];
const ok = (ad, kosul, ek) => { if (kosul) { gecen++; console.log("  ✓ " + ad); } else { hata.push(ad + (ek ? " → " + ek : "")); console.log("  ✗ " + ad + (ek ? " → " + ek : "")); } };

const TDE = "Türk Dili ve Edebiyatı";
const gecerli = new Set(MEB.ciktilar.filter(c => c.ders === TDE).map(c => c.kod));
const r = kopru();
const tema = (n) => ICERIK.temalar.find(t => t.no === n);

console.log("\n== 1) Dört tema, kaynaklı ==");
ok("4 tema", ICERIK.temalar.length === 4, String(ICERIK.temalar.length));
ok("her temanın TYMM url'i var", ICERIK.temalar.every(t => /^https:\/\/tymm\.meb\.gov\.tr\/turk-dili-ve-edebiyati-dersi\/unite\/\d+$/.test(t.url)));
ok("url'ler birbirinden farklı", new Set(ICERIK.temalar.map(t => t.url)).size === 4);
ok("her temada birebir alıntı var", ICERIK.temalar.every(t => typeof t.alinti === "string" && t.alinti.length > 60));
ok("tema adları TYMM ile aynı",
  ICERIK.temalar.map(t => t.ad).join(",") === "Sözün Ezgisi,Kelimelerin Ritmi,Dünden Bugüne,Nesillerin Mirası",
  ICERIK.temalar.map(t => t.ad).join(","));

console.log("\n== 2) Çıktı kodları gerçek ==");
let kodSayisi = 0, gecersiz = [];
for (const t of ICERIK.temalar) {
  for (const alan of ["okuma", "dinleme", "konusma", "yazma"]) {
    for (const c of t[alan].ciktilar) { kodSayisi++; if (!gecerli.has(c)) gecersiz.push(t.no + ":" + c); }
  }
}
ok("kod sayısı 4×4×4 = 64", kodSayisi === 64, String(kodSayisi));
ok("hepsi TYMM'de var", gecersiz.length === 0, gecersiz.join(", "));
ok("her tema 4 beceri eksenini kapsıyor",
  ICERIK.temalar.every(t => ["okuma", "dinleme", "konusma", "yazma"].every(a => t[a].ciktilar.length === 4)));

console.log("\n== 3) İçerik gerçekten TYMM metninden ==");
ok("tema 1: koşuk + türkü + koşma + ninni", ["koşuk", "türkü", "koşma", "ninni"].every(x => tema(1).cekirdek.includes(x)));
ok("tema 2: gazel + kaside + saf şiir", ["gazel", "kaside", "saf şiir"].every(x => tema(2).cekirdek.includes(x)));
ok("tema 3: destan + mesnevi + fabl", ["destan", "mesnevi", "fabl"].every(x => tema(3).cekirdek.includes(x)));
ok("tema 4: Dede Korkut + Tanzimat + Servetifünun + Fecriati",
  ["dede korkut", "tanzimat", "servetifünun", "fecriati"].every(x => tema(4).cekirdek.includes(x)));
ok("anahtar kavramlar boş değil", ICERIK.temalar.every(t => t.anahtar_kavramlar.length >= 8),
  ICERIK.temalar.map(t => t.no + ":" + t.anahtar_kavramlar.length).join(" "));

console.log("\n== 4) Köprü: çekirdek eşleşmesi ==");
const K = (s) => r.kazanimlar.find(x => x.okulizyon === s);
const k1 = K("Destan Dönemi Türk şiirini ve koşuk türünün genel özelliklerini açıklar.");
ok("koşuk kazanımı tema 1", k1 && k1.tema.length === 1 && k1.tema[0] === 1, k1 ? JSON.stringify(k1.tema) : "yok");
ok("'Destan Dönemi' tuzağı: tema 3'e bağlanmadı", k1 && !k1.tema.includes(3), k1 ? JSON.stringify(k1.tema) : "-");

const k4 = K("Halk şiirini tanımlar, halk şiiri altında koşma türünün genel özelliklerini kavrar.");
ok("koşma kazanımı tema 1", k4 && k4.tema[0] === 1, k4 ? JSON.stringify(k4.tema) : "yok");

const k7 = K("Türkü türünün genel özelliklerini belirler.");
ok("türkü kazanımı tema 1", k7 && k7.tema[0] === 1, k7 ? JSON.stringify(k7.tema) : "yok");

const k2 = K("Şiirde ahengi sağlayan özellikleri (uyak düzeni, uyak, redif, aliterasyon, asonans) ile ilgili çalışma yapar.");
ok("ahenk kazanımı beceri kanalına bağlı", k2 && k2.beceri.length > 0, k2 ? k2.beceri.join(",") : "yok");
ok("ahenk TDE2.x çıktısına gidiyor", k2 && k2.beceri.every(c => /^TDE2\./.test(c)), k2 ? k2.beceri.join(",") : "-");

const k3 = K("Metindeki söz varlığının anlamını bağlamdan hareketle belirler.");
ok("söz varlığı → TDE2.2", k3 && k3.beceri.includes("TDE2.2"), k3 ? k3.beceri.join(",") : "yok");

const k8 = K("Metinlerden hareketle çıkarımlar yapar.");
ok("çıkarım → TDE2.3", k8 && k8.beceri.includes("TDE2.3"), k8 ? k8.beceri.join(",") : "yok");

console.log("\n== 5) Eşleşme kalitesi ==");
ok("9 kazanımın hepsi eşleşti", r.kazanimlar.filter(x => x.durum === "eslesti").length === 9,
  r.kazanimlar.map(x => x.sira + ":" + x.durum).join(" "));
ok("hiçbiri belirsiz değil", r.kazanimlar.every(x => !x.belirsiz));
ok("hiçbiri kanıtsız değil", r.kazanimlar.every(x => x.durum !== "kanit-yok"));
ok("her eşleşmenin kanıt metni var",
  r.kazanimlar.every(x => (x.tema_kanit.length > 0) || (x.beceri_kanit && x.beceri_kanit.length > 0) || x.beceri.length > 0));
ok("kodların hepsi gerçek TYMM çıktısı", r.kazanimlar.every(x => x.kod_gecerli));

console.log("\n== 6) Uydurma yok ==");
ok("tema 1 Okulizyon metni VAR", tema(1).okulizyon_durum === "metin-var");
ok("tema 1: 9 kazanım bağlı", tema(1).okulizyon_kazanim.length === 9, String(tema(1).okulizyon_kazanim.length));
[2, 3, 4].forEach(n => {
  ok("tema " + n + " metin BEKLENİYOR", tema(n).okulizyon_durum === "metin-bekleniyor");
  ok("tema " + n + " kazanım listesi BOŞ (uydurulmadı)", tema(n).okulizyon_kazanim.length === 0);
});
ok("kural metni uydurma yasağını yazıyor", /UYDURULMAZ/.test(ICERIK.kopru_kurali));

console.log("\n" + "─".repeat(60));
if (hata.length) { console.log("v63 TDE köprüsü — " + gecen + " geçti, " + hata.length + " kaldı"); hata.forEach(h => console.log("   · " + h)); process.exit(1); }
console.log("v63 TDE köprüsü — " + gecen + "/" + gecen + " geçti ✓");
