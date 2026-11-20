/* ============================================================
   GÖRSEL SORU MOTORU (site/gorsel.js)
   ------------------------------------------------------------
   Soru havuzundaki sorular metin tabanlıydı; üçgen, grafik, vektör
   gibi görmesi gereken sorular için resim yoktu.

   Çözüm: soruya isteğe bağlı bir `gorsel` alanı eklenir; bu modül
   açıklamayı SVG'ye çevirir. Böylece ek dosya/resim sunucusu
   gerekmez, çevrimdışı da çalışır, büyütünce bulanıklaşmaz.

   Desteklenen tipler:
     {tip:"ucgen",  dik:"C", kenarlar:{a:"7", b:"24", c:"25"}, aci:"α", aciKose:"A", dikIsaret:true}
     {tip:"grafik", xEkseni:"t (s)", yEkseni:"v (m/s)",
        seriler:[{ad:"v", noktalar:[[0,0],[2,10],[4,10]]}], izgara:true, alan:false}
     {tip:"vektor", xEkseni:"x", yEkseni:"y", vektorler:[{ad:"F", x:3, y:2}]}
     {tip:"sema",    kutular:["Veri","İşlem","Sonuç"], oklar:true}
     {tip:"tablo",   basliklar:["t(s)","v(m/s)"], satirlar:[["0","0"],["2","10"]]}

     {tip:"geometri",                       // SERBEST üçgen/çokgen (yardımcı elemanlar)
        noktalar:{A:[150,40], B:[40,230], C:[330,230], D:[185,230]},
        kenarlar:[{a:"A",b:"B",etiket:"8"},{a:"A",b:"C",etiket:"6"}],
        acilar:[{kose:"A",etiket:"α",a:"B",b:"C"}],
        dikler:["C"],                       // veya [{kose:"D",a:"A",b:"B"}]
        cizgiler:[{a:"A",b:"D",etiket:"n",kesikli:true}],
        not:"AD iç açıortay"}
     {tip:"cember", aci:235, yon:"saat", noktaAdi:"P", cos:"−12/37", sin:"35/37"}

   Kullanım (tarayıcı):  GV.svg({...})           → SVG metni
                         GV.html(gorsel, boy)    → <figure> sarmalı
   Node                  :  require("../site/gorsel.js").svg(...)
   ============================================================ */
(function (kok) {
  "use strict";

  const TIPLER = ["ucgen", "grafik", "vektor", "sema", "tablo", "geometri", "cember"];

  function esc(x) {
    return String(x == null ? "" : x).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function sayi(x, vars) { const n = Number(x); return isFinite(n) ? n : (vars || 0); }

  // Uzun açıklama ("not") metinleri tek satırda çerçeveden taşıyordu:
  // kelime sınırından ~62 karakterde bölünür.
  function satirBol(metin, en) {
    const k = Math.max(20, en || 62);
    const kelimeler = String(metin == null ? "" : metin).split(/\s+/).filter(Boolean);
    const satirlar = [];
    let satir = "";
    kelimeler.forEach(function (w) {
      if (!satir) { satir = w; return; }
      if ((satir + " " + w).length <= k) satir += " " + w;
      else { satirlar.push(satir); satir = w; }
    });
    if (satir) satirlar.push(satir);
    return satirlar;
  }

  // ---------- ÜÇGEN ----------
  function ucgen(g) {
    // Dik açı hangi köşede? Varsayılan C (klasik gösterim).
    const dik = String(g.dik || "C").toUpperCase();
    const ken = g.kenarlar || {};
    // Köşe noktaları: A üst, B sağ-alt, C sol-alt (dik açı C'de)
    const A = { x: 180, y: 40 }, B = { x: 330, y: 240 }, C = { x: 180, y: 240 };
    const nokta = { A: A, B: B, C: C };
    // Etiketler: a = B'nin karşısı (BC), b = A'nın karşısı (AC), c = C'nin karşısı (AB)
    const etiket = {
      a: { p: { x: (B.x + C.x) / 2, y: B.y + 20 }, h: "middle" },
      b: { p: { x: A.x - 14, y: (A.y + C.y) / 2 + 4 }, h: "end" },
      c: { p: { x: (A.x + B.x) / 2 + 14, y: (A.y + B.y) / 2 }, h: "start" }
    };
    let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 285" role="img" aria-label="Üçgen şekli">';
    s += '<rect width="380" height="285" fill="#fff"/>';
    s += '<polygon points="' + A.x + ',' + A.y + " " + B.x + "," + B.y + " " + C.x + "," + C.y + '" fill="#EEF4FF" stroke="#2563EB" stroke-width="2"/>';
    // dik açı işareti
    if (g.dikIsaret !== false) {
      const d = nokta[dik] || C;
      const yon1 = dik === "C" ? { x: 0, y: -1 } : { x: 1, y: 0 };
      const yon2 = dik === "C" ? { x: 1, y: 0 } : { x: 0, y: -1 };
      const k = 16;
      s += '<path d="M ' + (d.x + yon1.x * k) + " " + (d.y + yon1.y * k) +
        " L " + (d.x + yon1.x * k + yon2.x * k) + " " + (d.y + yon1.y * k + yon2.y * k) +
        " L " + (d.x + yon2.x * k) + " " + (d.y + yon2.y * k) + '" fill="none" stroke="#2563EB" stroke-width="2"/>';
    }
    // kenar etiketleri
    ["a", "b", "c"].forEach(function (k) {
      if (ken[k] == null || ken[k] === "") return;
      const e = etiket[k];
      s += '<text x="' + e.p.x + '" y="' + e.p.y + '" text-anchor="' + e.h + '" font-family="system-ui,sans-serif" font-size="14" fill="#16213A" font-weight="600">' + esc(ken[k]) + "</text>";
    });
    // köşe adları
    [["A", A, -8, -10], ["B", B, 8, 6], ["C", C, -8, 16]].forEach(function (n) {
      s += '<text x="' + (n[1].x + n[2]) + '" y="' + (n[1].y + n[3]) + '" font-family="system-ui,sans-serif" font-size="13" fill="#5B6577">' + n[0] + "</text>";
    });
    // açı yayı + adı
    if (g.aci) {
      const kose = String(g.aciKose || "A").toUpperCase();
      const d = nokta[kose] || A;
      s += '<path d="M ' + (d.x + 26) + " " + d.y + " A 26 26 0 0 1 " + d.x + " " + (d.y + 26) + '" fill="none" stroke="#B45309" stroke-width="2"/>';
      s += '<text x="' + (d.x + 34) + '" y="' + (d.y + 30) + '" font-family="system-ui,sans-serif" font-size="15" fill="#B45309" font-style="italic">' + esc(g.aci) + "</text>";
    }
    if (g.not) s += '<text x="10" y="276" font-family="system-ui,sans-serif" font-size="11.5" fill="#5B6577">' + esc(g.not) + "</text>";
    return s + "</svg>";
  }

  // ---------- GRAFİK ----------
  function grafik(g) {
    const W = 380, H = 292, sol = 50, alt = H - 58, ust = 24, sag = W - 16;
    const seriler = Array.isArray(g.seriler) ? g.seriler : [];
    let maxX = 1, maxY = 1, minY = 0;
    seriler.forEach(function (sr) {
      (sr.noktalar || []).forEach(function (n) {
        maxX = Math.max(maxX, sayi(n[0]));
        maxY = Math.max(maxY, sayi(n[1]));
        minY = Math.min(minY, sayi(n[1]));
      });
    });
    // "Güzel" eksen adımı (1-2-2,5-5 · 10^k): 5,75 / 11,5 gibi okunmaz
    // sayılar yerine 0-10-20, 0-4-8, 0-2,5-5 gibi etiketler üretir.
    function guzelAdim(aralik) {
      const k = Math.max(aralik, 1e-9) / 4;
      const us = Math.pow(10, Math.floor(Math.log10(k)));
      const ad = [1, 2, 2.5, 5, 10].map(function (m) { return m * us; }).filter(function (a) { return a >= k - 1e-9; });
      return ad[0] || 10 * us;
    }
    // Eksen, verinin bittiği yerde biter (6 s'lik grafikte 8'e kadar
    // uzamaz): adım "güzel" sayı, üst sınır adımın katı.
    const xs = guzelAdim(maxX);
    const xTop = Math.max(xs, Math.ceil(maxX / xs - 1e-9) * xs);
    let ys = guzelAdim(Math.max(maxY - minY, 1));
    if (4 * ys < maxY - minY) ys = guzelAdim(ys * 2);
    let y0 = Math.floor(minY / ys + 1e-9) * ys;
    let yTop = Math.ceil(maxY / ys - 1e-9) * ys;
    if (yTop - y0 < ys) yTop = y0 + ys;
    const px = function (x) { return sol + (sayi(x) / xTop) * (sag - sol); };
    const py = function (y) { return alt - ((sayi(y) - y0) / (yTop - y0 || 1)) * (alt - ust); };
    const sifir = py(0);
    const sifirIcinde = sifir >= ust - 0.5 && sifir <= alt + 0.5;
    const eksenY = sifirIcinde ? sifir : alt;           // x ekseninin çizileceği y
    const etiketY = sifirIcinde ? sifir + 14 : alt + 14;
    const bicim = function (v) {
      const y = Math.abs(v) < 1e-9 ? 0 : v;
      return String(Math.round(y * 100) / 100).replace(".", ",");
    };
    const renk = ["#2563EB", "#16A34A", "#B45309", "#7C3AED"];
    let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Grafik">';
    s += '<rect width="' + W + '" height="' + H + '" fill="#fff"/>';
    if (g.izgara !== false) {
      // yatay ızgara: y değerleri (y0 + i·ys)
      for (let v = y0, i = 0; v <= yTop + 1e-9 && i < 12; v += ys, i++) {
        const y = py(v);
        s += '<line x1="' + sol + '" y1="' + y + '" x2="' + sag + '" y2="' + y + '" stroke="#E8EEF8" stroke-width="1"/>';
        s += '<text x="' + (sol - 6) + '" y="' + (y + 3.5) + '" text-anchor="end" font-family="system-ui,sans-serif" font-size="9.5" fill="#8A94A6">' + bicim(v) + "</text>";
      }
      // dikey ızgara: t değerleri (xs, 2·xs …)
      for (let v = xs, i = 1; v <= xTop + 1e-9 && i < 12; v += xs, i++) {
        const x = px(v);
        s += '<line x1="' + x + '" y1="' + ust + '" x2="' + x + '" y2="' + alt + '" stroke="#F1F5FB" stroke-width="1"/>';
        s += '<text x="' + x + '" y="' + etiketY + '" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9.5" fill="#8A94A6">' + bicim(v) + "</text>";
      }
    }
    // eksenler (x ekseni sıfır çizgisinde; sıfır aralık dışındaysa tabanda)
    s += '<line x1="' + sol + '" y1="' + ust + '" x2="' + sol + '" y2="' + alt + '" stroke="#5B6577" stroke-width="1.5"/>';
    s += '<line x1="' + sol + '" y1="' + eksenY + '" x2="' + sag + '" y2="' + eksenY + '" stroke="#5B6577" stroke-width="1.5"/>';
    // Eksen adları: sayı etiketleriyle ÇAKIŞMASIN diye çerçevenin dışına
    s += '<text x="' + (sag - 2) + '" y="' + (alt + 32) + '" text-anchor="end" font-family="system-ui,sans-serif" font-size="11" font-weight="600" fill="#16213A">' + esc(g.xEkseni || "x") + "</text>";
    s += '<text x="' + (sol - 4) + '" y="' + 11 + '" text-anchor="start" font-family="system-ui,sans-serif" font-size="11" font-weight="600" fill="#16213A">' + esc(g.yEkseni || "y") + "</text>";
    seriler.forEach(function (sr, si) {
      const nok = sr.noktalar || [];
      const n = nok.map(function (p) { return px(p[0]) + "," + py(p[1]); }).join(" ");
      if (!n) return;
      if (g.alan && nok.length) s += '<polygon points="' + n + " " + px(nok[nok.length - 1][0]) + "," + eksenY + " " + px(nok[0][0]) + "," + eksenY + '" fill="' + renk[si % 4] + '22"/>';
      s += '<polyline points="' + n + '" fill="none" stroke="' + renk[si % 4] + '" stroke-width="2.5" stroke-linejoin="round"/>';
      nok.forEach(function (p) {
        s += '<circle cx="' + px(p[0]) + '" cy="' + py(p[1]) + '" r="3.2" fill="' + renk[si % 4] + '"/>';
      });
      if (sr.ad) {
        const sonN = nok[nok.length - 1] || [0, 0];
        // Etiket, çizginin son noktasının üstünde; tabana çok yakınsa
        // (x ekseni adıyla çakışacaksa) yukarı taşınır.
        let ly = py(sonN[1]) - 10;
        if (ly > alt - 26) ly = py(sonN[1]) - 26;
        if (ly < 26) ly = 26;
        s += '<text x="' + Math.min(px(sonN[0]) + 6, sag - 4) + '" y="' + ly + '" text-anchor="end" font-family="system-ui,sans-serif" font-size="11.5" font-weight="700" fill="' + renk[si % 4] + '">' + esc(sr.ad) + "</text>";
      }
    });
    if (g.not) {
      // Not: 380 px'lik çerçeveye sığacak şekilde bölünür (taşma yok).
      const ns = satirBol(g.not, 58);
      ns.forEach(function (sat, i) {
        s += '<text x="8" y="' + (H - 6 - (ns.length - 1 - i) * 12.5) + '" font-family="system-ui,sans-serif" font-size="10.5" fill="#5B6577">' + esc(sat) + "</text>";
      });
    }
    return s + "</svg>";
  }

  // ---------- VEKTÖR ----------
  function vektor(g) {
    const W = 360, H = 260, O = { x: 40, y: H - 40 }, U = 34;
    const vk = Array.isArray(g.vektorler) ? g.vektorler : [];
    let maxX = 1, maxY = 1;
    vk.forEach(function (v) { maxX = Math.max(maxX, Math.abs(sayi(v.x, 1))); maxY = Math.max(maxY, Math.abs(sayi(v.y, 1))); });
    const k = Math.min((W - 90) / maxX, (H - 90) / maxY);
    const renk = ["#2563EB", "#16A34A", "#B45309", "#7C3AED"];
    let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Vektör şeması">';
    s += '<defs><marker id="ok" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#2563EB"/></marker></defs>';
    s += '<rect width="' + W + '" height="' + H + '" fill="#fff"/>';
    s += '<line x1="' + O.x + '" y1="' + O.y + '" x2="' + (W - 16) + '" y2="' + O.y + '" stroke="#5B6577"/>';
    s += '<line x1="' + O.x + '" y1="' + O.y + '" x2="' + O.x + '" y2="16" stroke="#5B6577"/>';
    s += '<text x="' + (W - 14) + '" y="' + (O.y + 16) + '" text-anchor="end" font-family="system-ui,sans-serif" font-size="11">' + esc(g.xEkseni || "x") + "</text>";
    // y adı eksenin SOLUNA yazılır: dikey vektörlerin etiketiyle çakışmasın.
    s += '<text x="' + (O.x - 20) + '" y="14" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11">' + esc(g.yEkseni || "y") + "</text>";
    vk.forEach(function (v, i) {
      const bx = O.x + sayi(v.x) * k, by = O.y - sayi(v.y) * k;
      s += '<line x1="' + O.x + '" y1="' + O.y + '" x2="' + bx + '" y2="' + by + '" stroke="' + renk[i % 4] + '" stroke-width="2.5" marker-end="url(#ok)"/>';
      const ad = String(v.ad || "");
      // Uzun etiketler okun SOLUNA, kısa etiketler sağına yazılır (taşma olmasın).
      const uzun = ad.length > 7;
      const lx = uzun ? Math.max(bx - 10, 12) : Math.min(bx + 9, W - 6);
      s += '<text x="' + lx + '" y="' + (by - 8) + '" text-anchor="' + (uzun ? "end" : "start") + '" font-family="system-ui,sans-serif" font-size="12.5" font-weight="700" fill="' + renk[i % 4] + '">' + esc(ad) + "</text>";
    });
    return s + "</svg>";
  }

  // ---------- ŞEMA ----------
  function sema(g) {
    const k = Array.isArray(g.kutular) ? g.kutular : [];
    const W = 380, H = 120, n = Math.max(1, k.length), bw = Math.min(100, (W - 30) / n - 14), gap = (W - 20 - bw * n) / Math.max(1, n - 1 || 1);
    let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Şema">';
    s += '<rect width="' + W + '" height="' + H + '" fill="#fff"/>';
    k.forEach(function (t, i) {
      const x = 10 + i * (bw + gap);
      s += '<rect x="' + x + '" y="30" width="' + bw + '" height="52" rx="10" fill="#EEF4FF" stroke="#2563EB"/>';
      s += '<text x="' + (x + bw / 2) + '" y="61" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11.5" fill="#16213A">' + esc(t) + "</text>";
      if (i < n - 1 && g.oklar !== false) s += '<text x="' + (x + bw + gap / 2 - 4) + '" y="61" font-family="system-ui,sans-serif" font-size="15" fill="#5B6577">→</text>';
    });
    return s + "</svg>";
  }

  // ---------- TABLO ----------
  function tablo(g) {
    const bas = Array.isArray(g.basliklar) ? g.basliklar : [];
    const sat = Array.isArray(g.satirlar) ? g.satirlar : [];
    const sut = Math.max(1, bas.length);
    const W = 360, cw = (W - 20) / sut, rh = 26, H = 20 + rh * (sat.length + 1);
    let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Tablo">';
    s += '<rect width="' + W + '" height="' + H + '" fill="#fff"/>';
    bas.forEach(function (b, i) {
      s += '<rect x="' + (10 + i * cw) + '" y="10" width="' + cw + '" height="' + rh + '" fill="#EEF4FF" stroke="#C9D8F5"/>';
      s += '<text x="' + (10 + i * cw + cw / 2) + '" y="' + (10 + rh - 9) + '" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="700" fill="#16213A">' + esc(b) + "</text>";
    });
    sat.forEach(function (r, ri) {
      (r || []).forEach(function (h, i) {
        s += '<rect x="' + (10 + i * cw) + '" y="' + (10 + rh * (ri + 1)) + '" width="' + cw + '" height="' + rh + '" fill="#fff" stroke="#E8EEF8"/>';
        s += '<text x="' + (10 + i * cw + cw / 2) + '" y="' + (10 + rh * (ri + 1) + rh - 9) + '" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#16213A">' + esc(h) + "</text>";
      });
    });
    return s + "</svg>";
  }


  // ---------- GEOMETRİ: serbest üçgen + yardımcı elemanlar ----------
  // Koordinatlar 380×300 çerçevesine göre verilir: [x, y]
  function geometri(g) {
    const W = 380, H = 300;
    const sekiller = Array.isArray(g.sekiller) ? g.sekiller : [g];
    let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Geometri şekli">';
    s += '<rect width="' + W + '" height="' + H + '" fill="#fff"/>';
    const cizgi = function (p, q, renk, kalinlik, kesikli) {
      return '<line x1="' + p.x + '" y1="' + p.y + '" x2="' + q.x + '" y2="' + q.y + '" stroke="' + (renk || "#2563EB") +
        '" stroke-width="' + (kalinlik || 2) + '"' + (kesikli ? ' stroke-dasharray="6 5"' : "") + ' stroke-linecap="round"/>';
    };
    const orta = function (p, q) { return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 }; };
    const birim = function (p, q) {
      const dx = q.x - p.x, dy = q.y - p.y, u = Math.hypot(dx, dy) || 1;
      return { x: dx / u, y: dy / u };
    };

    const satirlar = [];
    sekiller.forEach(function (sh) {
      const ham = sh.noktalar || {};
      const P = {};
      Object.keys(ham).forEach(function (k) {
        const p = ham[k];
        if (Array.isArray(p)) P[k] = { x: sayi(p[0]), y: sayi(p[1]) };
        else if (p && typeof p === "object") P[k] = { x: sayi(p.x), y: sayi(p.y) };
      });
      const govde = Array.isArray(sh.ucgen) ? sh.ucgen : (P.A && P.B && P.C ? ["A", "B", "C"] : null);

      // gövde (üçgen/çokgen) dolgusu
      if (govde && govde.every(function (k) { return P[k]; })) {
        const pts = govde.map(function (k) { return P[k].x + "," + P[k].y; }).join(" ");
        s += '<polygon points="' + pts + '" fill="' + (sh.dolgu || "#EEF4FF") + '" stroke="' + (sh.cizgi || "#2563EB") + '" stroke-width="' + (sh.kalinlik || 2) + '"' +
          (sh.kesikli ? ' stroke-dasharray="7 5"' : "") + ' stroke-linejoin="round"/>';
      }
      // çemberler (çevrel/dış teğet çember) — üçgenin ALTINA çizilir ki
      // üçgen kenarları çemberin üstünde kalsın.
      (sh.cemberler || []).forEach(function (c) {
        const m = P[c.merkez];
        if (!m) return;
        s += '<circle cx="' + m.x + '" cy="' + m.y + '" r="' + sayi(c.r, 60) + '" fill="none" stroke="' + (c.renk || "#7C3AED") +
          '" stroke-width="' + (c.kalinlik || 1.4) + '"' + (c.kesikli ? ' stroke-dasharray="6 5"' : "") + "/>";
      });
      // ek çizgiler (yükseklik, kenarortay, açıortay, yarıçap…)
      (sh.cizgiler || []).forEach(function (c) {
        const p = P[c.a], q = P[c.b];
        if (!p || !q) return;
        s += cizgi(p, q, c.renk || "#B45309", c.kalinlik || 1.8, c.kesikli);
        if (c.etiket) {
          const o = orta(p, q);
          const d = birim(p, q);
          const nx = -d.y, ny = d.x;             // normal yönü
          const kay = c.kaydir || [nx * 12, ny * 12];
          s += '<text x="' + (o.x + kay[0]) + '" y="' + (o.y + kay[1] + 4) + '" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12.5" font-weight="700" fill="' + (c.renk || "#B45309") + '">' + esc(c.etiket) + "</text>";
        }
      });
      // kenar etiketleri
      (sh.kenarlar || []).forEach(function (k) {
        const p = P[k.a], q = P[k.b];
        if (!p || !q || k.etiket == null) return;
        const o = orta(p, q);
        const d = birim(p, q);
        const nx = -d.y, ny = d.x;
        // etiket üçgenin DIŞINA düşsün: merkezden uzağa
        let yon = 1;
        if (govde && govde.every(function (kk) { return P[kk]; })) {
          const mx = govde.reduce(function (a, kk) { return a + P[kk].x; }, 0) / govde.length;
          const my = govde.reduce(function (a, kk) { return a + P[kk].y; }, 0) / govde.length;
          if ((o.x + nx - mx) * nx + (o.y + ny - my) * ny < 0) yon = -1;
        }
        const kay = k.kaydir || [nx * 14 * yon, ny * 14 * yon];
        s += '<text x="' + (o.x + kay[0]) + '" y="' + (o.y + kay[1] + 4) + '" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13.5" font-weight="600" fill="#16213A">' + esc(k.etiket) + "</text>";
      });
      // açı yayları
      (sh.acilar || []).forEach(function (a) {
        const v = P[a.kose], p1 = P[a.a], p2 = P[a.b];
        if (!v || !p1 || !p2) return;
        const r = sayi(a.cap, 30);
        const u1 = birim(v, p1), u2 = birim(v, p2);
        const s1 = { x: v.x + u1.x * r, y: v.y + u1.y * r };
        const s2 = { x: v.x + u2.x * r, y: v.y + u2.y * r };
        const cap = a.cap || 30;
        let aci1 = Math.atan2(u1.y, u1.x), aci2 = Math.atan2(u2.y, u2.x);
        let fark = aci2 - aci1;
        while (fark <= -Math.PI) fark += Math.PI * 2;
        while (fark > Math.PI) fark -= Math.PI * 2;
        const buyuk = Math.abs(fark) > Math.PI ? 1 : 0;
        const saat = fark > 0 ? 1 : 0;
        s += '<path d="M ' + s1.x + " " + s1.y + " A " + cap + " " + cap + " 0 " + buyuk + " " + saat + " " + s2.x + " " + s2.y + '" fill="none" stroke="#B45309" stroke-width="1.8"/>';
        if (a.etiket) {
          const ub = birim({ x: 0, y: 0 }, { x: u1.x + u2.x, y: u1.y + u2.y });
          s += '<text x="' + (v.x + ub.x * (r + 16)) + '" y="' + (v.y + ub.y * (r + 16) + 4) + '" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-style="italic" font-weight="700" fill="#B45309">' + esc(a.etiket) + "</text>";
        }
      });
      // dik açı işaretleri
      (sh.dikler || []).forEach(function (d) {
        const kose = typeof d === "string" ? d : d.kose;
        const v = P[kose];
        if (!v) return;
        let p1 = P[typeof d === "object" ? d.a : "A"], p2 = P[typeof d === "object" ? d.b : "B"];
        if (!p1 || !p2) return;
        const u1 = birim(v, p1), u2 = birim(v, p2);
        const k = 15;
        const n1 = { x: v.x + u1.x * k, y: v.y + u1.y * k };
        const n2 = { x: v.x + u2.x * k, y: v.y + u2.y * k };
        const koseN = { x: n1.x + u2.x * k, y: n1.y + u2.y * k };
        s += '<path d="M ' + n1.x + " " + n1.y + " L " + koseN.x + " " + koseN.y + " L " + n2.x + " " + n2.y + '" fill="none" stroke="#2563EB" stroke-width="1.6"/>';
      });
      // nokta adları + nokta işaretleri
      const adlar = sh.etiketler === false ? {} : (sh.etiketler || null);
      Object.keys(P).forEach(function (k) {
        const p = P[k];
        // Yardımcı noktalar (G1, G2 …) varsayılan olarak adsızdır: yalnız
        // çizgi/etiket için kullanılır, köşe adı gibi görünmez.
        const varsayilan = /^G\d+$/.test(k) ? false : k;
        const ad = adlar ? adlar[k] : varsayilan;
        if (ad === false || ad === null) return;
        if (!(k in (sh.noktaGoster || {})) && sh.noktaGoster !== true) {
          // sadece üçgen köşeleri ve etiket verilen noktalar işaretlenir
        }
        const goster = sh.noktaGoster === true || (govde && govde.indexOf(k) >= 0) || (sh.isaretli || []).indexOf(k) >= 0;
        if (goster) s += '<circle cx="' + p.x + '" cy="' + p.y + '" r="3" fill="#16213A"/>';
        if (ad) {
          const d = { x: 0, y: 0 };
          if (govde && govde.every(function (kk) { return P[kk]; })) {
            const mx = govde.reduce(function (a, kk) { return a + P[kk].x; }, 0) / govde.length;
            const my = govde.reduce(function (a, kk) { return a + P[kk].y; }, 0) / govde.length;
            const u = birim({ x: mx, y: my }, p);
            d.x = u.x * 16; d.y = u.y * 16;
          }
          const kay = (sh.etiketKaydir && sh.etiketKaydir[k]) || [d.x, d.y];
          s += '<text x="' + (p.x + kay[0]) + '" y="' + (p.y + kay[1] + 4) + '" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#5B6577">' + esc(ad) + "</text>";
        }
      });
      if (sh.not) satirlar.push(sh.not);
    });
    // Notlar en altta, satır bölünerek yazılır (çerçeveden taşmasın).
    const tumSatirlar = [];
    satirlar.forEach(function (n) { satirBol(n).forEach(function (l) { tumSatirlar.push(l); }); });
    for (let i = tumSatirlar.length - 1, k = 0; i >= 0; i--, k++) {
      s += '<text x="10" y="' + (H - 7 - k * 13.5) + '" font-family="system-ui,sans-serif" font-size="10.5" fill="#5B6577">' + esc(tumSatirlar[i]) + "</text>";
    }
    return s + "</svg>";
  }

  // ---------- BİRİM ÇEMBER ----------
  function cember(g) {
    const W = 380, H = 316, cx = 190, cy = 168, r = 105;
    const aci = sayi(g.aci, 0);                     // derece, matematik yönü (saat yönünün tersi +)
    const yon = String(g.yon || "ters");            // "ters" = saat yönünün tersi
    const rad = (Math.abs(aci) * Math.PI) / 180;
    const isaretliAci = yon === "saat" ? -rad : rad;
    const px = cx + r * Math.cos(isaretliAci);
    const py = cy - r * Math.sin(isaretliAci);
    let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Birim çember">';
    s += '<rect width="' + W + '" height="' + H + '" fill="#fff"/>';
    s += '<line x1="' + (cx - r - 22) + '" y1="' + cy + '" x2="' + (cx + r + 22) + '" y2="' + cy + '" stroke="#5B6577" stroke-width="1.4"/>';
    s += '<line x1="' + cx + '" y1="' + (cy - r - 22) + '" x2="' + cx + '" y2="' + (cy + r + 22) + '" stroke="#5B6577" stroke-width="1.4"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#2563EB" stroke-width="2"/>';
    // açı yayı (yönlü)
    const yay = Math.abs(aci) > 360 ? 359.9 : Math.abs(aci);
    const s1 = { x: cx + 30, y: cy };
    const s2 = { x: cx + 30 * Math.cos(isaretliAci), y: cy - 30 * Math.sin(isaretliAci) };
    // SVG'de sweep-flag=1 saat yönünde ilerler. "saat" yönünde dönen açı
    // yayı da SAAT YÖNÜNDE çizilmeli; aksi hâlde yay noktanın ters tarafında
    // biter ve şekil yanlış anlaşılır.
    const buyuk = yay > 180 ? 1 : 0;
    const saat = yon === "saat" ? 1 : 0;
    s += '<path d="M ' + s1.x + " " + s1.y + " A 30 30 0 " + buyuk + " " + saat + " " + s2.x + " " + s2.y + '" fill="none" stroke="#B45309" stroke-width="2"/>';
    // yarıçap + nokta
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + px + '" y2="' + py + '" stroke="#2563EB" stroke-width="2"/>';
    s += '<circle cx="' + px + '" cy="' + py + '" r="4" fill="#2563EB"/>';
    if (g.noktaAdi !== false) s += '<text x="' + (px + 10) + '" y="' + (py - 8) + '" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#2563EB">' + esc(g.noktaAdi || "P") + "</text>";
    // eksen izdüşümleri
    if (g.izdusum !== false) {
      s += '<line x1="' + px + '" y1="' + py + '" x2="' + px + '" y2="' + cy + '" stroke="#94A3B8" stroke-width="1.3" stroke-dasharray="5 4"/>';
      s += '<line x1="' + px + '" y1="' + py + '" x2="' + cx + '" y2="' + py + '" stroke="#94A3B8" stroke-width="1.3" stroke-dasharray="5 4"/>';
    }
    // cos etiketi: x ekseninin ALTINDA, izdüşümün hizasında (yarıçap çizgisiyle
    // çakışmaz). Nokta eksene çok yakınsa üst tarafa alınır.
    if (g.cos) {
      const cosY = Math.abs(py - cy) < 34 ? cy - 11 : cy + 20;
      const cosX = Math.max(26, Math.min(W - 26, px));
      s += '<text x="' + cosX + '" y="' + cosY + '" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="#5B6577">' + esc(g.cos) + "</text>";
    }
    // sin etiketi: düşey izdüşüm çizgisinin hemen yanında
    if (g.sin) {
      const sagda = px >= cx;
      s += '<text x="' + (sagda ? px - 13 : px + 13) + '" y="' + ((cy + py) / 2 + 4) + '" text-anchor="' + (sagda ? "end" : "start") + '" font-family="system-ui,sans-serif" font-size="12" fill="#5B6577">' + esc(g.sin) + "</text>";
    }
    // açı etiketi: yayın DIŞINDA, açıortay yönünde (yay ve eksenle çakışmaz)
    if (g.aciEtiket) {
      const yb = isaretliAci / 2;
      s += '<text x="' + (cx + 56 * Math.cos(yb)) + '" y="' + (cy - 56 * Math.sin(yb) + 4) + '" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12.5" font-weight="700" fill="#B45309">' + esc(g.aciEtiket) + "</text>";
    }
    s += '<text x="' + (cx + r + 14) + '" y="' + (cy - 6) + '" font-family="system-ui,sans-serif" font-size="11" fill="#5B6577">x</text>';
    s += '<text x="' + (cx + 6) + '" y="' + (cy - r - 12) + '" font-family="system-ui,sans-serif" font-size="11" fill="#5B6577">y</text>';
    if (g.not) s += '<text x="10" y="' + (H - 8) + '" font-family="system-ui,sans-serif" font-size="11" fill="#5B6577">' + esc(g.not) + "</text>";
    return s + "</svg>";
  }

  function svg(gorsel) {
    if (!gorsel || typeof gorsel !== "object") return "";
    try {
      switch (String(gorsel.tip || "")) {
        case "ucgen": return ucgen(gorsel);
        case "grafik": return grafik(gorsel);
        case "vektor": return vektor(gorsel);
        case "sema": return sema(gorsel);
        case "tablo": return tablo(gorsel);
        case "geometri": return geometri(gorsel);
        case "cember": return cember(gorsel);
        default: return "";
      }
    } catch (e) { return ""; }
  }

  // <figure> sarmalı: ekran okuyucu ve küçük ekran desteğiyle
  function html(gorsel, boy) {
    const ic = svg(gorsel);
    if (!ic) return "";
    return '<figure style="margin:8px 0;text-align:center;">' +
      '<div style="display:inline-block;max-width:' + (boy || 340) + 'px;width:100%;border:1px solid var(--border-card,#E8EEF8);border-radius:10px;overflow:hidden;background:#fff;">' + ic + "</div>" +
      (gorsel.aciklama ? '<figcaption style="font-size:10.5px;opacity:0.65;margin-top:3px;">' + esc(gorsel.aciklama) + "</figcaption>" : "") +
      "</figure>";
  }

  // Doğrulama: havuz denetiminde kullanılır (bozuk görsel sessizce kaybolmasın)
  function dogrula(gorsel) {
    const hatalar = [];
    if (!gorsel) return hatalar;
    if (TIPLER.indexOf(String(gorsel.tip || "")) < 0) hatalar.push("gorsel.tip: " + gorsel.tip);
    if (String(gorsel.tip) === "ucgen" && !gorsel.kenarlar) hatalar.push("ucgen.kenarlar yok");
    if (String(gorsel.tip) === "grafik" && !Array.isArray(gorsel.seriler)) hatalar.push("grafik.seriler yok");
    if (String(gorsel.tip) === "tablo" && !Array.isArray(gorsel.satirlar)) hatalar.push("tablo.satirlar yok");
    if (String(gorsel.tip) === "geometri") {
      const sek = Array.isArray(gorsel.sekiller) ? gorsel.sekiller : [gorsel];
      sek.forEach(function (sh, i) {
        if (!sh || !sh.noktalar || !Object.keys(sh.noktalar).length) hatalar.push("geometri.noktalar yok:" + i);
      });
    }
    if (String(gorsel.tip) === "cember" && !isFinite(Number(gorsel.aci))) hatalar.push("cember.aci yok");
    return hatalar;
  }

  const GV = { svg: svg, html: html, dogrula: dogrula, TIPLER: TIPLER };
  if (typeof module !== "undefined" && module.exports) module.exports = GV;
  if (kok) kok.GV = GV;
})(typeof window !== "undefined" ? window : globalThis);
