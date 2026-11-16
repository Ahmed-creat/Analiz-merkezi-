#!/usr/bin/env node
/* ============================================================
   DENEME PDF → UYGULAMA JSON  (tek, tekrar çalıştırılabilir hat)
   ------------------------------------------------------------
   PDF metnini çıkarır, sınavları/dersleri/kazanımları ayırır,
   ARİTMETİĞİ DOĞRULAR ve site/veri/9-sinif-denemeler.json yazar.

   Neden aritmetik doğrulaması: PDF'te bir ders bloğu eksikse
   ders netleri toplamı "Genel Net"i tutmaz. İlk sürümde bu kontrol
   yoktu; 6 sınavda eksik ders sessizce kayboldu. Artık:
     |Σ ders neti − Genel Net| > 0.01  →  fark raporlanır,
     eksik dersler ve kapasiteleri yazılır, dosyaya işlenir.

   Kullanım:
     node scripts/deneme-pdf-ayikla.js <dosya.pdf> [--yaz]
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const { pdfMetinCikar } = require("./pdf-metin-cikar.js");

const KOK = path.join(__dirname, "..");
const HEDEF = path.join(KOK, "site/veri/9-sinif-denemeler.json");

/* 9. sınıf deneme formatı — index.html'deki LESSON_CONFIG'ten okunur */
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

/* PDF'teki ad → uygulamanın ders adı */
const AD_ESLE = {
  "Türkçe": "Türk Dili ve Edebiyatı",
  "TDE": "Türk Dili ve Edebiyatı",
  "Matematik": "Matematik", "Matematik-1": "Matematik", "Matematik-2": "Matematik",
  "Tarih": "Tarih", "Tarih-1": "Tarih", "Tarih-2": "Tarih",
  "Coğrafya": "Coğrafya", "Coğrafya-1": "Coğrafya", "Coğrafya-2": "Coğrafya",
  "Fizik": "Fizik", "Kimya": "Kimya", "Biyoloji": "Biyoloji",
  "Din Kültürü": "Din Kültürü", "Din": "Din Kültürü",
  "Felsefe": "Felsefe"
};
const adCoz = (a) => AD_ESLE[a.trim()] || null;

/* Bileşik satır ("Tarih & Coğrafya & Din") için ders sezgisi */
const DERS_IPUCU = {
  "Din Kültürü": ["islam", "ibadet", "kuran", "peygamber", "allah", "ayet", "sure", "hadis", "iman", "ahlak", "hac", "zekat", "namaz", "oruç", "tevhit", "muhammed"],
  "Tarih": ["tarih", "osmanlı", "çağ", "devrim", "savaş", "antlaşma", "medeniyet", "devlet", "göç", "kronoloji", "kaynak", "tarım", "inanç"],
  "Coğrafya": ["coğrafya", "harita", "iklim", "mekân", "mekan", "bölge", "nüfus", "nufus", "doğal", "uzaktan", "algılama", "cbs", "levha", "yeryüzü"]
};


const AY = { Ocak: 1, Şubat: 2, Mart: 3, Nisan: 4, Mayıs: 5, Haziran: 6, Temmuz: 7, Ağustos: 8, Eylül: 9, Ekim: 10, Kasım: 11, Aralık: 12 };
const sayi = (s) => parseFloat(String(s).replace(",", "."));
const yuvarla = (n) => Math.round(n * 100) / 100;

function tarihCoz(s) {
  const m = /(\d{1,2})\s+([A-Za-zÇĞİÖŞÜçğıöşü]+)\s+(\d{4})/.exec(s);
  if (!m || !AY[m[2]]) return null;
  return m[3] + "-" + String(AY[m[2]]).padStart(2, "0") + "-" + String(m[1]).padStart(2, "0");
}

/* Satır temizliği: markdown, atıf, ayırıcı */
function temizle(s) {
  return String(s)
    .replace(/\*+/g, " ")
    .replace(/\b(Yanlış|Boş)\s*:/g, " ")
    .replace(/\[\d+(?:\s*,\s*\d+)*\]\.?/g, "")
    .replace(/-{3,}/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;])/g, "$1")
    .trim();
}

/* "… (2Y); … (3Y)" → [{kazanim, adet, tip}] */
function kalemler(blok) {
  const out = [];
  for (let p of temizle(blok).split(/\s*;\s*/)) {
    p = p.replace(/\.$/, "").trim();
    if (!p) continue;
    const m = /\((\d+)\s*([YB])\)\s*$/i.exec(p);
    if (!m) continue;
    const kazanim = p.slice(0, m.index).trim();
    if (!kazanim) continue;
    out.push({ kazanim: kazanim, adet: Number(m[1]), tip: m[2].toUpperCase() });
  }
  return out;
}

/* ---------------- ayrıştırma ---------------- */
function ayikla(metin) {
  const govde = metin.replace(/^########## SAYFA \d+ ##########$/gm, "").replace(/\r/g, "");
  const baslik = [...govde.matchAll(/### \*\*(\d+)\. Deneme:\s*([^(]+?)\s*\(([^)]+)\)\*\*/g)];

  return baslik.map((b, i) => {
    const bas = b.index + b[0].length;
    const son = i + 1 < baslik.length ? baslik[i + 1].index : govde.length;
    const gov = govde.slice(bas, son);

    const gn = /Genel Net:\*\*\s*([\d,]+)/.exec(gov);
    const dRe = /\* \*\*([^*(]+?)\s*\(([\d,]+)\s*Net\):\*\*/g;
    const dl = [...gov.matchAll(dRe)];

    const dersler = dl.map((d, j) => {
      const s = d.index + d[0].length;
      const e = j + 1 < dl.length ? dl[j + 1].index : gov.length;
      const blk = gov.slice(s, e);
      const parca = blk.split(/\*\*Boş:\*\*/);
      return {
        pdfAd: d[1].trim(),
        net: sayi(d[2]),
        yanlis: kalemler(parca[0]),
        bos: kalemler(parca[1] || "")
      };
    });

    return {
      no: Number(b[1]),
      ad: b[2].trim(),
      tarihHam: b[3].trim(),
      tarih: tarihCoz(b[3]),
      genelNet: gn ? sayi(gn[1]) : null,
      dersler: dersler
    };
  });
}

/* ---------------- aritmetik doğrulama ---------------- */
function dogrula(sinav, yapilandirma) {
  const bilinen = new Map();      // kanonik ders → net
  const hamAdlar = new Set();

  for (const d of sinav.dersler) {
    if (d.pdfAd.includes("&")) {
      d.pdfAd.split("&").forEach(x => hamAdlar.add(x.trim()));
      continue;
    }
    const k = adCoz(d.pdfAd);
    if (k) bilinen.set(k, (bilinen.get(k) || 0) + d.net);
    else hamAdlar.add(d.pdfAd);
  }

  const dersToplami = yuvarla(sinav.dersler.reduce((a, d) => a + d.net, 0));
  const fark = yuvarla((sinav.genelNet || 0) - dersToplami);

  const eksik = [];
  if (Math.abs(fark) > 0.01) {
    for (const ders of Object.keys(yapilandirma)) {
      if (bilinen.has(ders)) continue;
      if ([...hamAdlar].some(h => adCoz(h) === ders)) continue;
      eksik.push({ ders: ders, kapasite: yapilandirma[ders].max });
    }
  }
  const kapasite = eksik.reduce((a, x) => a + x.kapasite, 0);

  return {
    dersToplami,
    genelNet: sinav.genelNet,
    fark,
    eksik,
    kapasite,
    /* fark = kapasite ise eksik dersler tümüyle doğrudur (w=0, e=0).
       Bu bir varsayım değil, aritmetik zorunluluk. */
    zorunlu: eksik.length > 0 && Math.abs(fark - kapasite) < 0.005,
    sigiyor: fark <= kapasite + 1e-9
  };
}

/* Kapasite koruması: d+w+e azamiyi aşarsa önce boş, sonra yanlış kırpılır.
   PDF'in beyan ettiği net `net_beyan` alanında aynen korunur. */
function kapasiteyeSigdir(d, w, e, kap, uyarilar, etiket) {
  if (!kap) return { d: d, w: w, e: e };
  if (d + w + e <= kap) return { d: d, w: w, e: e };
  /* PDF'in sayıları KIRPILMAZ (veri bozulmaz). Çelişki yalnız beyan edilir. */
  uyarilar.push(etiket + ": PDF d+w+e = " + (d + w + e) + " > azami " + kap +
    " · PDF'in kendi sayımı çelişkili, sayılar olduğu gibi bırakıldı");
  return { d: d, w: w, e: e };
}

/* Bileşik satır ("Tarih & Coğrafya & Din") → alt derslere bölünür.
   Kazanım metninden ders çıkarılır; çıkarılamazsa kapasiteye göre en büyük ders. */
function dersBul(kazanim, adaylar) {
  const k = String(kazanim).toLocaleLowerCase("tr");
  let en = { ders: null, p: 0 };
  for (const ad of adaylar) {
    const ip = DERS_IPUCU[ad] || [];
    let p = 0;
    for (const w of ip) if (k.includes(w)) p += w.length >= 6 ? 2 : 1;
    if (p > en.p) en = { ders: ad, p: p };
  }
  return en.ders;
}

/* ---------------- eksik ders netlerini türet ----------------
   PDF bu derslerin bölümünü hiç içermiyor: d/w/e YOK.
   Tek kesin bilgi: Σ(ders neti) = Genel Net  →  eksiklerin toplam neti = fark.
   Dağıtım kapasite oranıyla yapılır, her ders için d,w TAM SAYI ve
   d + w <= kapasite olacak şekilde en az yanlışlı çözüm seçilir.
   Bu TÜRETİMDİR, gözlem değildir → JSON'da kaynak:"aritmetik-turetme". */
function netDagit(fark, eksikler) {
  const kapasite = eksikler.reduce((a, x) => a + x.kapasite, 0);
  if (!kapasite) return [];

  const Q = Math.round(fark * 4);
  const ceyrek = eksikler.map(x => (fark * x.kapasite / kapasite) * 4);

  /* Her ders için (d,w) seçenekleri: c = 4d-w (çeyrek net birimi) */
  const secenek = eksikler.map((x, i) => {
    const o = [];
    for (let d = 0; d <= x.kapasite; d++) {
      for (let w = 0; d + w <= x.kapasite; w++) {
        o.push({ d: d, w: w, c: 4 * d - w, maliyet: Math.abs((4 * d - w) - ceyrek[i]) + w * 0.01 });
      }
    }
    return o;
  });

  /* DP: toplam katkı → en düşük maliyet */
  let dp = new Map([[0, { maliyet: 0, secim: [] }]]);
  for (const ops of secenek) {
    const nd = new Map();
    for (const [top, st] of dp) {
      for (const o of ops) {
        const t = top + o.c;
        const m = st.maliyet + o.maliyet;
        const v = nd.get(t);
        if (!v || m < v.maliyet) nd.set(t, { maliyet: m, secim: st.secim.concat([o]) });
      }
    }
    dp = nd;
  }

  let en = dp.get(Q);
  if (!en) {                                   // tam eşleşme yoksa en yakın
    let bf = Infinity;
    for (const [t, st] of dp) {
      const f = Math.abs(t - Q) * 10 + st.maliyet;
      if (f < bf) { bf = f; en = st; }
    }
  }

  return eksikler.map((x, i) => {
    const o = en.secim[i] || { d: 0, w: 0 };
    return { ders: x.ders, d: o.d, w: o.w, e: x.kapasite - o.d - o.w, net: yuvarla(o.d - o.w / 4) };
  });
}

/* ---------------- JSON kurucu ---------------- */
function kur(sinavlar, rapor, yapilandirma, elle) {
  elle = elle || {};
  const ciktilar = [];
  const notlar = [];
  const tutarsizliklar = [];

  sinavlar.forEach((s, i) => {
    const r = rapor[i];
    const lessons = {};
    const errorLogs = [];
    let qno = 1;
    const uyarilar = [];

    /* hata kayıtları için kalem listesi (bileşik satırda ders başına) */
    const kayitKalem = [];

    for (const d of s.dersler) {
      const parcalar = d.pdfAd.includes("&")
        ? d.pdfAd.split("&").map(x => adCoz(x.trim())).filter(Boolean)
        : null;

      if (parcalar && parcalar.length >= 2) {
        /* --- birleşik satır: kazanımlardan derslere dağıt --- */
        const aday = parcalar;
        const torba = {}; aday.forEach(a => torba[a] = { y: [], b: [] });
        let belirsiz = 0;
        for (const k of d.yanlis) {
          const h = dersBul(k.kazanim, aday);
          if (h) torba[h].y.push(k); else belirsiz += k.adet;
        }
        for (const k of d.bos) {
          const h = dersBul(k.kazanim, aday);
          if (h) torba[h].b.push(k); else belirsiz += k.adet;
        }
        if (belirsiz) uyarilar.push(d.pdfAd + ": " + belirsiz + " sorunun dersi kazanımdan çıkarılamadı");

        const alt = aday.map(a => ({
          ders: a,
          kapasite: (yapilandirma[a] && yapilandirma[a].max) || 0,
          w: torba[a].y.reduce((x, k) => x + k.adet, 0),
          e: torba[a].b.reduce((x, k) => x + k.adet, 0),
          kalemler: torba[a]
        }));

        const kapTop = alt.reduce((a, x) => a + x.kapasite, 0);
        const wTop = alt.reduce((a, x) => a + x.w, 0);
        let D = Math.round(d.net + wTop / 4);           // toplam doğru
        // oransal dağıt, sonra düzelt
        alt.forEach(x => { x.d = Math.min(Math.round(D * x.kapasite / kapTop), x.kapasite - x.w - x.e); x.d = Math.max(0, x.d); });
        let farkD = D - alt.reduce((a, x) => a + x.d, 0);
        for (let tur = 0; tur < 200 && farkD !== 0; tur++) {
          for (const x of alt) {
            const yon = farkD > 0 ? 1 : -1;
            if (x.d + yon >= 0 && x.d + yon + x.w + x.e <= x.kapasite) { x.d += yon; farkD -= yon; }
            if (farkD === 0) break;
          }
          if (alt.every(x => (farkD > 0 ? x.d + x.w + x.e >= x.kapasite : x.d === 0))) break;
        }

        /* net_beyan = PDF'in satır netinin kapasiteye göre payı (toplamı tam tutar).
           d/w/e ise kapasiteye SIĞAN tam sayı karşılığı — fark uyarıda yazılır. */
        alt.forEach(x => {
          x.d = Math.max(0, Math.min(x.d, x.kapasite - x.w - x.e));
        });
        const topla = yuvarla(alt.reduce((a, x) => a + x.d - x.w / 4, 0));

        if (Math.abs(topla - d.net) > 0.25 + 1e-9) {
          /* Parçalama neti bozuyor → birleşik satır KORUNUR (veri bozulmaz). */
          const w = d.yanlis.reduce((a, x) => a + x.adet, 0);
          const e = d.bos.reduce((a, x) => a + x.adet, 0);
          const dd = Math.round(d.net + w / 4);
          lessons[d.pdfAd] = { d: dd, w: w, e: e, net_beyan: d.net, kaynak: "bilesik-satir" };
          kayitKalem.push({ ders: d.pdfAd, kalemler: { y: d.yanlis, b: d.bos } });
          uyarilar.push(d.pdfAd + " (" + d.net + " net, " + w + " yanlış) ayrı derslere bölünemedi: " +
            "bölününce " + topla + " net çıkıyor, " + Math.abs(yuvarla(topla - d.net)) +
            " kayıp. PDF " + yuvarla(d.net + w / 4) + " doğru diyor → " +
            yuvarla(d.net + w / 4 + w) + " soru, azami " + kapTop +
            " (PDF kendi içinde çelişkili). Birleşik satır korundu, kazanımlar derslere ayrıldı.");
          continue;
        }

        for (const x of alt) {
          lessons[x.ders] = {
            d: x.d, w: x.w, e: x.e, net_beyan: yuvarla(x.d - x.w / 4),
            kaynak: "bilesik-satir"
          };
          kayitKalem.push({ ders: x.ders, kalemler: x.kalemler });
        }
        uyarilar.push(d.pdfAd + " (" + d.net + " net) alt derslere bölündü: " +
          alt.map(x => x.ders + " " + yuvarla(x.d - x.w / 4)).join(" · ") + " = " + topla);
        continue;
      }

      const kanon = parcalar ? parcalar[0] : (adCoz(d.pdfAd) || d.pdfAd);
      const w = d.yanlis.reduce((a, x) => a + x.adet, 0);
      const e = d.bos.reduce((a, x) => a + x.adet, 0);
      const kap = (yapilandirma[kanon] && yapilandirma[kanon].max) || 0;
      const sig = kapasiteyeSigdir(Math.round(d.net + w / 4), w, e, kap, uyarilar, d.pdfAd + " (" + d.net + " net)");
      lessons[kanon] = { d: sig.d, w: sig.w, e: sig.e, net_beyan: d.net };
      if (kap && sig.d + sig.w + sig.e > kap) {
        tutarsizliklar.push({
          sinav: "pdf9-" + String(s.no).padStart(2, "0"), ders: kanon,
          soru: sig.d + sig.w + sig.e, azami: kap,
          aciklama: "PDF'teki d+w+e azamiyi aşıyor; veri kırpılmadı."
        });
      }
      const geri = yuvarla(sig.d - sig.w / 4);
      if (Math.abs(geri - d.net) > 0.001) {
        uyarilar.push(d.pdfAd + ": PDF neti " + d.net + " ama d/w tam sayı olmak zorunda → " + geri + " (0,25 PDF içi tutarsızlık)");
      }
      kayitKalem.push({ ders: kanon, kalemler: { y: d.yanlis, b: d.bos } });
    }

    /* Eksik dersler: PDF'te bölüm yok ama net farkı bunların neti olduğunu
       söylüyor. Elle kanıt (docs/veri/eksik-dersler.json) varsa o kullanılır,
       yoksa aritmetikten türetilir ve açıkça işaretlenir. */
    const eklenen = [];
    if (r.eksik.length && Math.abs(r.fark) > 0.001) {
      const dagitim = netDagit(r.fark, r.eksik);
      for (const v of dagitim) {
        const elleV = elle[s.no] && elle[s.no][v.ders] ? elle[s.no][v.ders] : null;
        const d = elleV ? elleV.d : v.d;
        const w = elleV ? elleV.w : v.w;
        const e = elleV ? elleV.e : v.e;
        lessons[v.ders] = {
          d: d, w: w, e: e, net_beyan: yuvarla(d - w / 4),
          kaynak: elleV ? "elle" : "aritmetik-turetme"
        };
        eklenen.push(v.ders);
      }
    }

    // hata kayıtları — her yanlış/boş SORU için ayrı kayıt
    for (const kk of kayitKalem) {
      for (const tip of ["y", "b"]) {
        for (const k of kk.kalemler[tip]) {
          for (let n = 0; n < k.adet; n++) {
            errorLogs.push({
              qno: qno++,
              lesson: kk.ders,
              topic: k.kazanim,
              kazanim: k.kazanim,
              type: "KONUEKSİKLİĞİ",
              date: s.tarih
            });
          }
        }
      }
    }

    const toplamSoru = Object.values(lessons).reduce((a, v) => a + v.d + v.w + v.e, 0);
    const kayit = {
      id: "pdf9-" + String(s.no).padStart(2, "0"),
      name: s.no + ". Deneme: " + s.ad,
      date: s.tarih,
      lessons: lessons,
      errorLogs: errorLogs,
      total: Object.values(yapilandirma).reduce((a, x) => a + x.max, 0),
      net: s.genelNet,
      kaynak: "9. sınıf deneme dökümü (PDF) · " + s.tarihHam,
      bilinen_soru: toplamSoru
    };
    if (eklenen.length) kayit.tamamlanan_dersler = eklenen;
    if (eklenen.length) {
      uyarilar.push(
        "PDF'te " + eklenen.join(", ") + " bölümü YOK. Bu derslerin neti " + r.fark +
        " (Genel Net − ders toplamı). d/w/e kapasite oranıyla türetildi, gözlem değildir."
      );
      notlar.push(s.no + ". sınav: " + eklenen.join(", ") + " PDF'te yok → aritmetikten türetildi (fark " + r.fark + ")");
    }
    if (uyarilar.length) kayit.uyarilar = uyarilar;
    ciktilar.push(kayit);
  });

  return { ciktilar, notlar, tutarsizliklar };
}


/* ---------------- ana ---------------- */
function calistir(pdfYolu, yaz) {
  const yapilandirma = dersYapilandirmasi();
  const metin = pdfMetinCikar(pdfYolu);
  const sinavlar = ayikla(metin);

  const rapor = [];
  for (const s of sinavlar) {
    const d = dogrula(s, yapilandirma);
    rapor.push({ baslik: s.no + ". " + s.ad, tarih: s.tarih, ...d });
  }
  return { sinavlar, rapor, yapilandirma };
}

if (require.main === module) {
  const pdf = process.argv[2];
  if (!pdf) {
    console.error("Kullanım: node scripts/deneme-pdf-ayikla.js <dosya.pdf> [--yaz]");
    process.exit(2);
  }
  const { sinavlar, rapor, yapilandirma } = calistir(pdf, false);
  let sorunlu = 0;
  console.log("\n== ARİTMETİK DOĞRULAMA (Σ ders neti vs Genel Net) ==");
  for (const r of rapor) {
    const im = r.fark === 0 ? "✓" : (r.zorunlu ? "◆" : (r.sigiyor ? "!" : "✗"));
    console.log(
      im + " " + r.baslik.padEnd(38) +
      " ders " + String(r.dersToplami).padStart(6) +
      " · genel " + String(r.genelNet).padStart(6) +
      " · fark " + String(r.fark).padStart(6) +
      (r.eksik.length ? "  eksik: " + r.eksik.map(e => e.ders + "(" + e.kapasite + ")").join(", ") +
        " · kapasite " + r.kapasite : "")
    );
    if (!r.sigiyor) sorunlu++;
  }
  console.log("\n✓ tam  ◆ fark = kapasite (eksik dersler tümüyle doğru)  ! fark kapasiteye sığıyor  ✗ sığmıyor");
  if (sorunlu) {
    console.error("\n" + sorunlu + " sınavda fark, eksik derslerin kapasitesini AŞIYOR → PDF tutarsız.");
    process.exit(1);
  }

  if (process.argv.includes("--yaz")) {
    // Elle doldurulmuş eksik dersler varsa oku
    let elle = {};
    const elleYol = path.join(KOK, "docs/veri/eksik-dersler.json");
    if (fs.existsSync(elleYol)) {
      const j = JSON.parse(fs.readFileSync(elleYol, "utf8"));
      elle = j.sinavlar || {};
    }
    const { ciktilar, notlar, tutarsizliklar } = kur(sinavlar, rapor, yapilandirma, elle);
    const dosya = {
      _mod: "deneme-birlestir",
      _okumaNotu:
        "9. sınıf deneme dökümü. \"Verileri İçe Aktar\" düğmesiyle açılabilir: _mod=deneme-birlestir " +
        "olduğu için tam durum değişimi YAPILMAZ, yalnız bu sınavlar listeye eklenir.",
      _uyari:
        "Tüm hata nedenleri KONUEKSİKLİĞİ (ağırlık 1,5). Yanlış/boş ayrımı lessons[ders].w ve .e alanlarında.",
      _surum: "2026-11-17",
      _tutarsizliklar: tutarsizliklar,
      _kaynak: "9. sınıf deneme dökümü (PDF) — " + sinavlar.length + " sınav",
      _sayilar: {
        sinav: ciktilar.length,
        hata_kaydi: ciktilar.reduce((a, x) => a + x.errorLogs.length, 0),
        turetilmis_dersli_sinav: ciktilar.filter(x => x.tamamlanan_dersler).length
      },
      state: { user: { name: "", grade: "9", joined: null }, exams: ciktilar }
    };
    fs.mkdirSync(path.dirname(HEDEF), { recursive: true });
    fs.writeFileSync(HEDEF, JSON.stringify(dosya, null, 1), "utf8");
    console.log("\nyazıldı: " + path.relative(KOK, HEDEF));
    console.log("sınav " + ciktilar.length + " · hata kaydı " + dosya._sayilar.hata_kaydi +
      " · türetilmiş dersli sınav " + dosya._sayilar.turetilmis_dersli_sinav);
    notlar.forEach(n => console.log("  ! " + n));
  }
}

module.exports = { ayikla, dogrula, calistir, adCoz, temizle, kalemler };
