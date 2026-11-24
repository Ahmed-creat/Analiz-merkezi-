#!/usr/bin/env node
/* ============================================================
   KONU ↔ HAVUZ KAPSAMI — tests/konu-havuz-kapsam.test.js   (G-04)
   ------------------------------------------------------------
   Talimattaki "25 konu havuza bağlanmıyor / 37 yetim havuz" tablosu
   ESKİ bir ölçüm tabanına (5206ae2) aitti. v75'te havuzlar ders
   kitabından yeniden üretildi ve topic_key'ler müfredat başlıklarıyla
   hizalandı. Bu test güncel gerçeği kilitler:

     1) 10. sınıf: 193 konu · 192 havuz · 192 bağlı + 1 belgelenmiş
        istisna (TDE > Paragraf — kullanıcı: "paragraf havuzu asla
        üretilmeyecek") · belgelenmemiş eksik 0 · yetim havuz 0
     2) Belgesiz bir eksik olsaydı araç KIRMIZI olurdu (kapı gerçekten
        çalışıyor mu? — istisna listesi boşaltılarak sınanır)
     3) Araç salt-okuma (hiçbir yere yazmaz)
     4) Paragraf istisnası uygulamada gerekçesiyle yazılı (tek kaynak)
   ============================================================ */
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const KOK = path.join(__dirname, "..");
const ARAC = path.join(KOK, "docs", "uretim", "araclar", "konu-havuz-kapsam.js");
const HTML = path.join(KOK, "site", "index.html");
const HB = require(path.join(KOK, "site", "havuz-bul.js"));

let gecen = 0, kalan = 0;
const hatalar = [];
function ok(ad, kosul, ek) { if (kosul) gecen++; else { kalan++; hatalar.push(ad + (ek ? " → " + ek : "")); } }

function calistir(htmlYolu) {
  const ortam = Object.assign({}, process.env);
  if (htmlYolu) ortam.AM_HTML = htmlYolu;
  try {
    const cikti = execFileSync(process.execPath, [ARAC], { stdio: "pipe", env: ortam }).toString();
    return { kod: 0, cikti };
  } catch (e) {
    return { kod: e.status || 1, cikti: String(e.stdout || "") + String(e.stderr || "") };
  }
}

// ---------------------------------------------------------------
console.log("\n== 1) Güncel kapsam: 192/193 + 1 istisna, yetim 0 ==");
{
  const r = calistir();
  ok("araç yeşil (çıkış 0)", r.kod === 0, "kod: " + r.kod + " · " + r.cikti.split("\n").slice(-3).join(" "));
  ok("192/193 bağlı", /konu: 192\/193 bağlı/.test(r.cikti), r.cikti.split("\n")[1]);
  ok("belgelenmiş istisna 1", /belgelenmiş istisna: 1/.test(r.cikti), r.cikti.split("\n")[1]);
  ok("belgelenmemiş eksik 0", /belgelenmemiş eksik: 0/.test(r.cikti));
  ok("yetim havuz 0", /yetim: 0/.test(r.cikti));
  ok("istisna Paragraf ve gerekçeli", /İSTİSNA Türk Dili ve Edebiyatı > Paragraf/.test(r.cikti));
}

// ---------------------------------------------------------------
console.log("\n== 2) Kapı GERÇEKTEN çalışıyor (istisna kaldırılınca kırmızı) ==");
{
  const html = fs.readFileSync(HTML, "utf8");
  const gi = html.indexOf("const HAVUZSUZ_GEREKCE = {");
  const son = html.indexOf("\n};", gi) + 3;
  const kirpik = html.slice(0, gi) + "const HAVUZSUZ_GEREKCE = {};" + html.slice(son);
  const gecici = path.join(os.tmpdir(), "am-index-istisnasiz.html");
  fs.writeFileSync(gecici, kirpik, "utf8");
  const r = calistir(gecici);
  ok("istisnasız kapsam KIRMIZI (çıkış 1)", r.kod === 1, "kod: " + r.kod);
  const eksikSatiri = r.cikti.split("\n").filter(x => x.includes("EKSİK")).join(" ");
  ok("eksik konu Paragraf olarak listeleniyor", /EKSİK Türk Dili ve Edebiyatı/.test(eksikSatiri) && /Paragraf/.test(eksikSatiri),
    eksikSatiri || "(EKSİK satırı yok)");
  fs.rmSync(gecici, { force: true });
}

// ---------------------------------------------------------------
console.log("\n== 3) Ölçüm motorun KENDİ eşleştiricisiyle (kopya mantık yok) ==");
{
  const html = fs.readFileSync(HTML, "utf8");
  const b = html.indexOf("const CURRICULUM");
  const cur = Function(html.slice(b, html.indexOf("\n};", b) + 3) + "; return CURRICULUM;")();
  const man = JSON.parse(fs.readFileSync(path.join(KOK, "site", "content", "soru_havuzlari", "index.json"), "utf8"));
  const H = man.havuzlar || [];
  let birebir = 0;
  Object.keys(cur[10] || {}).forEach(d => (cur[10][d] || []).forEach(k => {
    if (H.find(x => String(x.topic_key) === d + " > " + k)) birebir++;
  }));
  ok("192 konu topic_key BİREBİR eşleşiyor (bulanık eşleşmeye gerek yok)", birebir === 192, String(birebir));
  ok("havuzların hepsi 10. sınıf", H.every(h => String(h.sinif) === "10"));
  ok("mükerrer topic_key yok", new Set(H.map(h => h.topic_key)).size === H.length);
  ok("havuz-bul.js hâlâ yalnız BİR yerde tanımlı eşleştirici kullanıyor",
    /const HB = require\(path\.join\(KOK, "site", "havuz-bul\.js"\)\)/.test(fs.readFileSync(ARAC, "utf8")));
  // yetim kontrolü: her havuzun topic_key'i müfredatta var
  const yetim = H.filter(h => {
    const tk = String(h.topic_key || ""), p = tk.indexOf(" > ");
    const d = p >= 0 ? tk.slice(0, p) : "", k = p >= 0 ? tk.slice(p + 3) : tk;
    return !(cur[10][d] || []).includes(k);
  });
  ok("müfredat dışı havuz yok", yetim.length === 0, yetim.slice(0, 3).map(x => x.konu_id).join(", "));
}

// ---------------------------------------------------------------
console.log("\n== 4) Araç salt-okuma ==");
{
  const kod = fs.readFileSync(ARAC, "utf8");
  ok("writeFileSync yok", !/writeFileSync/.test(kod));
  ok("mkdir/rm yok", !/mkdirSync|rmSync|unlinkSync|renameSync/.test(kod));
}

// ---------------------------------------------------------------
console.log("\n== 5) Paragraf: kalıcı istisna, uygulama gerekçeyi yazıyor ==");
{
  const html = fs.readFileSync(HTML, "utf8");
  const gi = html.indexOf("const HAVUZSUZ_GEREKCE = {");
  ok("HAVUZSUZ_GEREKCE tablosu var", gi > 0);
  const tablo = Function(html.slice(gi, html.indexOf("\n};", gi) + 3) + "; return HAVUZSUZ_GEREKCE;")();
  ok("Paragraf istisna listesinde", !!tablo["Türk Dili ve Edebiyatı > Paragraf"]);
  ok("gerekçe 'paragraf sorulmaz' diyor", /paragraf/i.test(tablo["Türk Dili ve Edebiyatı > Paragraf"] || ""));
  ok("gerekçe konu panelinde çiziliyor", /havuzsuzGerekce\(selectedTopicKey\)/.test(html) && /!besAdim && gerekce/.test(html));
  ok("istisna listesi tek kaynak (araç da index.html'den okuyor)",
    /nesneCikar\("HAVUZSUZ_GEREKCE"\)/.test(fs.readFileSync(ARAC, "utf8")));
}

console.log("\n" + "─".repeat(56));
if (kalan) {
  hatalar.forEach(h => console.log(" ✗ " + h));
  console.log("konu-havuz kapsamı — " + gecen + " geçti, " + kalan + " kaldı ✗");
  process.exit(1);
}
console.log("konu-havuz kapsamı — " + gecen + "/" + gecen + " geçti ✓");
