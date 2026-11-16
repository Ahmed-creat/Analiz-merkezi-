#!/usr/bin/env node
/* ============================================================
   DENEME REVİZE PDF → UYGULAMA JSON
   ------------------------------------------------------------
   "9.json revize.pdf" gibi DÜZELTME belgelerini okur ve
   site/veri/9-sinif-denemeler.json dosyasını yeniden üretir.

   Üç aşama:
     1) GLİF ONARIMI — PDF üreticisi bazı rakamları emojiye
        eşlemiş olabilir (ToUnicode bozuk). Hangi karakterin hangi
        rakam olduğu TAHMİN EDİLMEZ: 0-9 arası her aday denenir,
        "d − w/4 = Net" denklemlerini TUTAN tek aday seçilir.
        Birden fazla aday aynı sonucu verirse HATA verilir.
     2) AYRIŞTIRMA — sınav → ders → (d,w,e,net) + kazanım listeleri
     3) UZLAŞTIRMA — belge kendi içinde çelişirse aritmetik kazanır,
        çelişki _tutarsizliklar / uyarilar içinde BEYAN EDİLİR.

   Kullanım:
     node scripts/deneme-revize-uygula.js <revize.pdf> [orijinal.pdf] [--yaz]
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const { pdfMetinCikar } = require("./pdf-metin-cikar.js");

const KOK = path.join(__dirname, "..");
const HEDEF = path.join(KOK, "site/veri/9-sinif-denemeler.json");

const yuvarla = (n) => Math.round(n * 100) / 100;
const sayi = (s) => parseFloat(String(s).replace(",", "."));

/* ---------- uygulama sabitleri (koddan okunur, elle yazılmaz) ---------- */
function dersYapilandirmasi() {
  const html = fs.readFileSync(path.join(KOK, "site/index.html"), "utf8");
  const i = html.indexOf("const LESSON_CONFIG = {");
  const b = html.indexOf("{", i);
  let d = 0, j = b;
  for (; j < html.length; j++) {
    if (html[j] === "{") d++;
    else if (html[j] === "}") { d--; if (d === 0) break; }
  }
  return eval("(" + html.slice(b, j + 1) + ")");
}

const AD_ESLE = {
  "Türkçe": "Türk Dili ve Edebiyatı",
  "TDE": "Türk Dili ve Edebiyatı",
  "Matematik": "Matematik", "Matematik-1": "Matematik", "Matematik-2": "Matematik",
  "Tarih": "Tarih", "Tarih-1": "Tarih", "Tarih-2": "Tarih",
  "Coğrafya": "Coğrafya", "Coğrafya-1": "Coğrafya", "Coğrafya-2": "Coğrafya",
  "Fizik": "Fizik", "Kimya": "Kimya", "Biyoloji": "Biyoloji",
  "Din Kültürü": "Din Kültürü", "Din": "Din Kültürü", "Felsefe": "Felsefe"
};
const adCoz = (a) => AD_ESLE[String(a).trim()] || null;

const AY = { Ocak: 1, Şubat: 2, Mart: 3, Nisan: 4, Mayıs: 5, Haziran: 6, Temmuz: 7, Ağustos: 8, Eylül: 9, Ekim: 10, Kasım: 11, Aralık: 12 };

/* ============================================================
   1) GLİF ONARIMI
   ============================================================ */
function supheliKarakterler(metin) {
  const set = new Map();
  for (const c of metin) {
    const k = c.codePointAt(0);
    if (k < 128) continue;
    if (/[çğıöşüÇĞİÖŞÜâîû–—’‘“”·°]/.test(c)) continue;
    set.set(c, (set.get(c) || 0) + 1);
  }
  return set;
}

const DERS_SATIRI = /\(\s*([\dCARET]+)D\s*\/\s*([\dCARET]+)Y\s*\/\s*([\dCARET]+)B\s*—\s*Net:\s*([\dCARET,]+)\s*\)/;

/* Verilen eşleme ile kaç ders satırı "d − w/4 = net" denklemini tutuyor? */
function denklemSayisi(metin, harita) {
  let ok = 0, top = 0;
  const desen = new RegExp(
    "\\(\\s*([\\d" + [...harita.keys()].map(escRe).join("") + "]+)D\\s*\\/\\s*" +
    "([\\d" + [...harita.keys()].map(escRe).join("") + "]+)Y\\s*\\/\\s*" +
    "([\\d" + [...harita.keys()].map(escRe).join("") + "]+)B\\s*—\\s*Net:\\s*" +
    "([\\d" + [...harita.keys()].map(escRe).join("") + ",]+)\\s*\\)", "g");
  const cevir = (s) => [...String(s)].map((c) => (harita.has(c) ? String(harita.get(c)) : c)).join("");
  let m;
  while ((m = desen.exec(metin))) {
    top++;
    const D = +cevir(m[1]), W = +cevir(m[2]), N = sayi(cevir(m[4]));
    if (Math.abs(D - W / 4 - N) < 1e-9) ok++;
  }
  return { ok: ok, top: top };
}
function escRe(c) { return c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function glifOnar(metin) {
  const supheli = supheliKarakterler(metin);
  if (!supheli.size) return { metin: metin, rapor: null };

  const onarimlar = [];
  let calisan = metin;

  for (const [c] of supheli) {
    /* Aday rakamları sına */
    const sonuc = [];
    for (let r = 0; r <= 9; r++) {
      const d = denklemSayisi(calisan, new Map([[c, r]]));
      sonuc.push({ rakam: r, ok: d.ok, top: d.top });
    }
    sonuc.sort((a, b) => b.ok - a.ok);
    const enIyi = sonuc[0];
    const ayni = sonuc.filter((s) => s.ok === enIyi.ok);

    if (enIyi.ok === 0 || (ayni.length > 1 && ayni[0].top !== ayni[1].top)) {
      throw new Error(
        "Glif onarılamadı: " + JSON.stringify(c) + " (U+" + c.codePointAt(0).toString(16).toUpperCase() + ")\n" +
        "  Aday skorları: " + sonuc.map((s) => s.rakam + "→" + s.ok + "/" + s.top).join(" "));
    }
    if (ayni.length > 1 && ayni[0].ok === ayni[1].ok) {
      throw new Error(
        "Glif belirsiz: " + JSON.stringify(c) + " için birden çok rakam aynı skoru veriyor (" +
        ayni.map((s) => s.rakam).join(", ") + "). Tahmin edilmez — belge elle incelenmeli.");
    }

    onarimlar.push({ karakter: c, kod: "U+" + c.codePointAt(0).toString(16).toUpperCase(), rakam: enIyi.rakam, kanit: enIyi.ok + "/" + enIyi.top });
    calisan = calisan.split(c).join(String(enIyi.rakam));
  }

  return { metin: calisan, rapor: { supheli: supheli.size, onarimlar: onarimlar } };
}

/* ============================================================
   2) AYRIŞTIRMA
   ============================================================ */
function temizle(s) {
  return String(s).replace(/\*+/g, " ").replace(/\s+/g, " ").trim();
}

/* "a (1Y); b (2B); c; d (Toplam 4B)" → [{kazanim, adet, tip}] */
function kalemler(blok) {
  const out = [];
  const parcalar = temizle(blok)
    .replace(/\[\d+(?:\s*,\s*\d+)*\]\.?/g, "")
    .split(/\s*;\s*/)
    .map((x) => x.replace(/\.$/, "").trim())
    .filter(Boolean);

  let toplam = null;              // "(Toplam 4B)" → tüm parçalara dağıt
  const ham = [];
  for (const p of parcalar) {
    const t = /\(\s*Toplam\s*(\d+)\s*([YB])\s*\)\s*$/i.exec(p);
    if (t) { toplam = { adet: +t[1], tip: t[2].toUpperCase() }; ham.push({ kazanim: p.slice(0, t.index).trim(), adet: null, tip: toplam.tip }); continue; }
    const m = /\((\d+)\s*([YB])\)\s*$/i.exec(p);
    if (m) { ham.push({ kazanim: p.slice(0, m.index).trim(), adet: +m[1], tip: m[2].toUpperCase() }); continue; }
    ham.push({ kazanim: p, adet: null, tip: toplam ? toplam.tip : null });
  }
  if (toplam) {
    const eksik = ham.filter((x) => x.adet === null);
    if (eksik.length && toplam.adet % eksik.length === 0) {
      eksik.forEach((x) => { x.adet = toplam.adet / eksik.length; });
    }
  }
  for (const h of ham) {
    if (!h.kazanim || h.adet === null || !h.tip) continue;
    out.push({ kazanim: h.kazanim, adet: h.adet, tip: h.tip });
  }
  return out;
}

function ayikla(metin) {
  const g = metin.replace(/^########## SAYFA \d+ ##########$/gm, "").replace(/\r/g, "");
  const baslik = [...g.matchAll(/###\s*\*\*(\d+)\.\s*Deneme:\s*([^\n(]+?)\s*\(([^)]+)\)\*\*/g)];

  return baslik.map((b, i) => {
    const bas = b.index + b[0].length;
    const son = i + 1 < baslik.length ? baslik[i + 1].index : g.length;
    const gov = g.slice(bas, son);

    const gn = /Genel Sonuç:\*\*\s*(\d+)\s*Doğru,\s*(\d+)\s*Yanlış,\s*(\d+)\s*Boş\s*\|\s*\*\*Genel Net:\s*([\d,]+)/.exec(gov);
    const gn2 = gn ? null : /Genel Net:\s*\*?\*?\s*([\d,]+)/.exec(gov);

    const dRe = /\*\*([A-ZÇĞİÖŞÜa-zçğıöşü0-9 .\-]+?)\s*\((\d+)D\s*\/\s*(\d+)Y\s*\/\s*(\d+)B\s*—\s*Net:\s*([\d,]+)\):\*\*/g;
    const dl = [...gov.matchAll(dRe)];

    const dersler = dl.map((d, j) => {
      const s = d.index + d[0].length;
      const e = j + 1 < dl.length ? dl[j + 1].index : gov.length;
      const blk = gov.slice(s, e);
      const parca = blk.split(/\*\*Boş:\*\*/);
      return {
        pdfAd: d[1].trim(),
        d: +d[2], w: +d[3], e: +d[4], net: sayi(d[5]),
        yanlis: kalemler(parca[0].replace(/\*\*Yanlış:\*\*/, "")),
        bos: kalemler(parca[1] || "")
      };
    });

    return {
      no: +b[1], ad: b[2].trim(), tarihHam: b[3].trim(),
      genel: gn ? { D: +gn[1], W: +gn[2], B: +gn[3], net: sayi(gn[4]) }
        : (gn2 ? { D: null, W: null, B: null, net: sayi(gn2[1]) } : null),
      dersler: dersler
    };
  });
}

/* ============================================================
   3) KAZANIM METNİ EŞLEME (kısaltılmış → tam TYMM metni)
   ============================================================ */
const TRnorm = (s) => String(s).toLocaleLowerCase("tr").replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();
function benzerlik(a, b) {
  const A = new Set(TRnorm(a).split(" ").filter((x) => x.length > 2));
  const B = new Set(TRnorm(b).split(" ").filter((x) => x.length > 2));
  if (!A.size || !B.size) return 0;
  let k = 0;
  for (const x of A) if (B.has(x)) k++;
  return k / Math.min(A.size, B.size);
}
function tamMetinBul(kisa, havuz, esik) {
  let en = { metin: kisa, p: 0 };
  for (const h of havuz) {
    const p = benzerlik(kisa, h);
    if (p > en.p) en = { metin: h, p: p };
  }
  return en.p >= (esik || 0.6) ? { metin: en.metin, p: en.p } : { metin: kisa, p: en.p };
}

/* ============================================================
   4) UZLAŞTIRMA + JSON
   ============================================================ */
function calistir(revizeYol, orijinalYol, yaz) {
  const YAP = dersYapilandirmasi();
  const hamMetin = pdfMetinCikar(revizeYol);
  const onarim = glifOnar(hamMetin);
  const sinavlar = ayikla(onarim.metin);

  /* tam kazanım havuzu (orijinal PDF varsa) */
  let havuz = [];
  if (orijinalYol && fs.existsSync(orijinalYol)) {
    const { ayikla: orjAyikla } = require("./deneme-pdf-ayikla.js");
    for (const s of orjAyikla(pdfMetinCikar(orijinalYol)))
      for (const d of s.dersler)
        for (const k of [...d.yanlis, ...d.bos]) havuz.push(k.kazanim);
  }
  havuz = [...new Set(havuz)];

  const tutarsizliklar = [];
  const rapor = [];
  const ciktilar = [];

  sinavlar.forEach((s) => {
    const id = "pdf9-" + String(s.no).padStart(2, "0");
    const kazanimFarki = [];
    const dersler = s.dersler.map((d) => {
      const kanon = adCoz(d.pdfAd);
      const kap = kanon && YAP[kanon] ? YAP[kanon].max : 0;
      const listeW = d.yanlis.reduce((a, x) => a + x.adet, 0);
      const listeE = d.bos.reduce((a, x) => a + x.adet, 0);

      const dwOK = Math.abs(d.d - d.w / 4 - d.net) < 1e-9;
      const kapOK = !kap || d.d + d.w + d.e === kap;
      const listeOK = listeW === d.w && listeE === d.e;

      /* ÖNCELİK: ders başlığındaki D/Y/B esastır — yedi sınavın ders toplamı
         genel sonucu birebir veriyor. Kazanım listesi yalnızca AYRINTIdır;
         eksikse bu beyan edilir, başlık ASLA listeden türetilmez. */
      const dd = d.d, ww = d.w, ee = d.e;
      const notlar = [];

      if (!dwOK) {
        notlar.push("belgede d − w/4 = " + yuvarla(d.d - d.w / 4) + " ≠ beyan edilen Net " + d.net);
      }
      if (!kapOK && kap) {
        notlar.push("d+w+e = " + (d.d + d.w + d.e) + " ≠ azami " + kap);
      }
      /* Başlık (d/w/e) ile kazanım listesi çelişebilir; iki yön de beyan edilir. */
      const fark = { y: d.w - listeW, b: d.e - listeE };
      if (fark.y !== 0 || fark.b !== 0) {
        const parca = [];
        if (fark.y > 0) parca.push(fark.y + " yanlışın kazanımı listede yok");
        if (fark.b > 0) parca.push(fark.b + " boşun kazanımı listede yok");
        if (fark.y < 0) parca.push(Math.abs(fark.y) + " yanlış listede FAZLA");
        if (fark.b < 0) parca.push(Math.abs(fark.b) + " boş listede FAZLA");
        notlar.push("kazanım listesi başlıkla uyuşmuyor (başlık " + d.w + "Y/" + d.e + "B, liste " +
          listeW + "Y/" + listeE + "B): " + parca.join(" · "));
        kazanimFarki.push({
          ders: kanon || d.pdfAd,
          baslik: { yanlis: d.w, bos: d.e },
          liste: { yanlis: listeW, bos: listeE },
          fark: { yanlis: fark.y, bos: fark.b }
        });
      }

      return { pdfAd: d.pdfAd, ders: kanon || d.pdfAd, kanonik: !!kanon, kap: kap, d: dd, w: ww, e: ee, net: d.net, yanlis: d.yanlis, bos: d.bos, notlar: notlar, listeW: listeW, listeE: listeE };
    });

    /* --- SINA V BAZLI DERS KAPASİTESİ ---------------------------------------
       Yayın kurulu bir sınavda soru dağılımını değiştirebilir: ör. Gis-3'te
       Tarih 14, Din Kültürü 4 (genel azami 12 ve 6). Bu bir HATA DEĞİL,
       o sınavın kendi tasarımıdır — orijinal karne de Tarih'i 14 soru
       üzerinden hesaplamıştır.
       Bu yüzden: soru TAŞINMAZ. Dersin toplam soru sayısı uygulamanın genel
       azamisinden farklıysa sınavın `ders_azami` alanına o sınavın kendi
       azamisi yazılır ve gerekçesi _tutarsizliklar'a düşer.
       Sınavın TOPLAMI yine 120 olmalıdır. --- */
    const dersAzami = {};
    const sapmalar = [];
    for (const x of dersler) {
      if (!x.kap) continue;
      const toplam = x.d + x.w + x.e;
      if (toplam !== x.kap) {
        dersAzami[x.ders] = toplam;
        sapmalar.push(x.pdfAd + " " + toplam + " soru (genel azami " + x.kap + ")");
      }
    }
    if (sapmalar.length) {
      tutarsizliklar.push({
        sinav: id, ders: null, soru: null, azami: null, tur: "sinav-bazli-dagilim",
        aciklama: "Bu sınavda soru dağılımı genel azamiden farklı: " + sapmalar.join(" · ") +
          ". Bu bir HATA DEĞİL: yayın kurulu o sınav için dağılımı özel tasarlamış, orijinal " +
          "karne de o sayılar üzerinden hesaplanmıştır. Soru taşınmadı; sınavın kendi dağılımı " +
          "korundu (`ders_azami` alanı). Toplam soru sayısı " +
          dersler.reduce((a, x) => a + x.d + x.w + x.e, 0) + ", genel net " + (s.genel && s.genel.net != null ? s.genel.net : "-") + "."
      });
    }

    /* --- sınav düzeyi kontroller --- */
    const sD = dersler.reduce((a, x) => a + x.d, 0);
    const sW = dersler.reduce((a, x) => a + x.w, 0);
    const sE = dersler.reduce((a, x) => a + x.e, 0);
    const sNet = yuvarla(dersler.reduce((a, x) => a + (x.d - x.w / 4), 0));
    const g = s.genel || {};
    const examNot = [];

    if (g.net != null && Math.abs(sNet - g.net) > 0.005) {
      examNot.push("ders netleri toplamı " + sNet + " ≠ Genel Net " + g.net);
      tutarsizliklar.push({ sinav: id, ders: null, soru: sNet, azami: g.net,
        aciklama: "Ders netleri toplamı Genel Net'i tutmuyor (fark " + yuvarla(g.net - sNet) + ")." });
    }
    if (g.D != null && (sD !== g.D || sW !== g.W || sE !== g.B)) {
      examNot.push("ders D/Y/B toplamı " + sD + "/" + sW + "/" + sE + " ≠ genel " + g.D + "/" + g.W + "/" + g.B +
        " (net aynı: " + sNet + " = " + g.net + ")");
      tutarsizliklar.push({
        sinav: id, ders: null, soru: sD + "/" + sW + "/" + sE, azami: null,
        aciklama: "Belgenin GENEL satırı kendi ders dökümüyle çelişiyor: genel " + g.D + "/" + g.W + "/" + g.B +
          ", ders toplamı " + sD + "/" + sW + "/" + sE + ". Net ikisinde de " + g.net +
          ". Ders dökümü esas alındı (her ders kendi içinde d−w/4=net tutuyor ve toplam 120)."
      });
    }
    const toplamSoru = sD + sW + sE;
    const kapasite = Object.values(YAP).reduce((a, x) => a + x.max, 0);
    if (toplamSoru !== kapasite) examNot.push("derslerin soru toplamı " + toplamSoru + " ≠ " + kapasite);

    /* --- errorLogs --- */
    const errorLogs = [];
    let qno = 1;
    for (const x of dersler) {
      for (const tip of ["yanlis", "bos"]) {
        const kaynakAd = tip === "yanlis" ? "y" : "b";
        for (const k of x[tip]) {
          const tam = tamMetinBul(k.kazanim, havuz, 0.6);
          for (let n = 0; n < k.adet; n++) {
            errorLogs.push({
              qno: qno++,
              lesson: x.ders,
              topic: tam.metin,
              kazanim: tam.metin,
              type: "KONUEKSİKLİĞİ",
              date: null
            });
          }
        }
      }
    }

    const kayit = {
      id: id,
      name: s.no + ". Deneme: " + s.ad,
      date: null,
      lessons: {},
      errorLogs: errorLogs,
      total: kapasite,
      net: g.net,
      kaynak: "9. sınıf deneme revize dökümü · " + s.tarihHam,
      bilinen_soru: toplamSoru
    };
    if (Object.keys(dersAzami).length) kayit.ders_azami = dersAzami;
    for (const x of dersler) {
      const o = { d: x.d, w: x.w, e: x.e, net_beyan: yuvarla(x.d - x.w / 4) };
      if (Math.abs(o.net_beyan - x.net) > 0.001) o.belge_net = x.net;   // taşıma öncesi belge değeri
      if (!x.kanonik) o.kaynak = "bilesik-satir";
      kayit.lessons[x.ders] = o;
    }
    const uy = [...examNot];
    for (const x of dersler) if (x.notlar.length) uy.push(x.pdfAd + ": " + x.notlar.join(" · "));
    if (kazanimFarki.length) {
      kayit.kazanim_farki = kazanimFarki.map((k) => ({
        ders: k.ders,
        baslik: k.baslik, liste: k.liste, fark: k.fark,
        aciklama: "Kazanım listesi ders başlığıyla uyuşmuyor. Kayıt UYDURULMADI: errorLogs yalnızca " +
          "belgede yazılı kazanımları içerir. D/Y/B ve net başlıktan alındı."
      }));
      uy.push("errorLogs " + errorLogs.length + " kayıt · başlıktaki w+e = " +
        dersler.reduce((a, x) => a + x.w + x.e, 0) + " · beyanlı kazanım farkı: " +
        kazanimFarki.map((k) => k.ders + " " + k.fark.yanlis + "Y/" + k.fark.bos + "B").join(", "));
    }
    if (uy.length) kayit.uyarilar = uy;

    rapor.push({ id: id, ad: s.no + ". " + s.ad, genel: g, sD: sD, sW: sW, sE: sE, sNet: sNet, toplamSoru: toplamSoru, examNot: examNot, kayitSayisi: errorLogs.length });
    ciktilar.push(kayit);
  });

  /* tarih: başlıktan */
  const AYRE = /(\d{1,2})\s+([A-Za-zÇĞİÖŞÜçğıöşü]+)\s+(\d{4})/;
  sinavlar.forEach((s, i) => {
    const m = AYRE.exec(s.tarihHam);
    if (m && AY[m[2]]) {
      ciktilar[i].date = m[3] + "-" + String(AY[m[2]]).padStart(2, "0") + "-" + String(m[1]).padStart(2, "0");
      ciktilar[i].errorLogs.forEach((l) => { l.date = ciktilar[i].date; });
    }
  });

  return { ciktilar, rapor, tutarsizliklar, onarim: onarim.rapor, YAP };
}

function asanDers(dersler, pdfAd) {
  const x = dersler.find((d) => d.pdfAd === pdfAd);
  return x ? x.ders : pdfAd;
}

module.exports = { glifOnar, ayikla, kalemler, calistir, tamMetinBul, benzerlik };

/* ---------------- CLI ---------------- */
if (require.main === module) {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const revize = args[0];
  const orijinal = args[1];
  if (!revize) {
    console.error("Kullanım: node scripts/deneme-revize-uygula.js <revize.pdf> [orijinal.pdf] [--yaz]");
    process.exit(2);
  }

  const { ciktilar, rapor, tutarsizliklar, onarim } = calistir(revize, orijinal, false);

  console.log("\n== GLİF ONARIMI ==");
  if (!onarim) console.log("  bozuk glif yok");
  else for (const o of onarim.onarimlar)
    console.log("  " + o.karakter + " (" + o.kod + ") → '" + o.rakam + "'   kanıt: d−w/4=Net denklemlerinin " + o.kanit + " tutması");

  console.log("\n== SINAVLAR ==");
  let sorun = 0;
  for (const r of rapor) {
    const g = r.genel || {};
    const tam = r.sD === g.D && r.sW === g.W && r.sE === g.B && r.toplamSoru === 120;
    const netOK = Math.abs(r.sNet - (g.net || 0)) < 0.005;
    if (!netOK) sorun++;
    console.log("  " + (netOK ? "✓" : "✗") + " " + r.id + " " + r.ad.padEnd(36) +
      " ders " + r.sD + "/" + r.sW + "/" + r.sE + " · genel " + g.D + "/" + g.W + "/" + g.B +
      " · net " + r.sNet + " · kayıt " + r.kayitSayisi + (tam ? "" : "   ⚠"));
    r.examNot.forEach((n) => console.log("      ! " + n));
  }
  console.log("\n  tutarsızlık kaydı: " + tutarsizliklar.length + " · net uyuşmayan sınav: " + sorun);

  if (process.argv.includes("--yaz")) {
    if (sorun) {
      console.error("\nNet uyuşmayan sınav var → yazılmadı.");
      process.exit(1);
    }
    const dosya = {
      _mod: "deneme-birlestir",
      _okumaNotu: "9. sınıf deneme dökümü (REVİZE). \"Verileri İçe Aktar\" düğmesiyle açılabilir: _mod=deneme-birlestir olduğu için tam durum değişimi YAPILMAZ, yalnız bu sınavlar listeye eklenir.",
      _uyari: "Tüm hata nedenleri KONUEKSİKLİĞİ (ağırlık 1,5). Yanlış/boş ayrımı lessons[ders].w ve .e alanlarında.",
      _surum: "2026-10-27",
      _kaynak: "9. sınıf deneme revize dökümü — " + ciktilar.length + " sınav",
      _revizyon: {
        belge: path.basename(revize),
        glif_onarimi: onarim ? onarim.onarimlar : null,
        dogrulama: rapor.map((r) => ({
          sinav: r.id,
          ders_toplami: r.sD + "/" + r.sW + "/" + r.sE,
          genel: r.genel ? r.genel.D + "/" + r.genel.W + "/" + r.genel.B : null,
          ders_neti: r.sNet,
          genel_net: r.genel ? r.genel.net : null,
          soru_toplami: r.toplamSoru
        }))
      },
      _tutarsizliklar: tutarsizliklar,
      _sayilar: {
        sinav: ciktilar.length,
        hata_kaydi: ciktilar.reduce((a, x) => a + x.errorLogs.length, 0)
      },
      state: { user: { name: "", grade: "9", joined: null }, exams: ciktilar }
    };
    fs.mkdirSync(path.dirname(HEDEF), { recursive: true });
    fs.writeFileSync(HEDEF, JSON.stringify(dosya, null, 1), "utf8");
    console.log("\nyazıldı: " + path.relative(KOK, HEDEF));
    console.log("sınav " + ciktilar.length + " · hata kaydı " + dosya._sayilar.hata_kaydi);
  }
}
