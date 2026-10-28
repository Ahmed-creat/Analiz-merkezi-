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

   Kullanım (tarayıcı):  GV.svg({...})           → SVG metni
                         GV.html(gorsel, boy)    → <figure> sarmalı
   Node                  :  require("../site/gorsel.js").svg(...)
   ============================================================ */
(function (kok) {
  "use strict";

  const TIPLER = ["ucgen", "grafik", "vektor", "sema", "tablo"];

  function esc(x) {
    return String(x == null ? "" : x).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function sayi(x, vars) { const n = Number(x); return isFinite(n) ? n : (vars || 0); }

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
    const W = 380, H = 270, sol = 46, alt = H - 38, ust = 20, sag = W - 18;
    const seriler = Array.isArray(g.seriler) ? g.seriler : [];
    let maxX = 1, maxY = 1, minY = 0;
    seriler.forEach(function (sr) {
      (sr.noktalar || []).forEach(function (n) {
        maxX = Math.max(maxX, sayi(n[0]));
        maxY = Math.max(maxY, sayi(n[1]));
        minY = Math.min(minY, sayi(n[1]));
      });
    });
    maxX = Math.max(maxX, 1); maxY = Math.max(maxY, 1);
    const px = function (x) { return sol + (sayi(x) / maxX) * (sag - sol); };
    const py = function (y) { return alt - ((sayi(y) - minY) / (maxY - minY || 1)) * (alt - ust); };
    const renk = ["#2563EB", "#16A34A", "#B45309", "#7C3AED"];
    let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 270" role="img" aria-label="Grafik">';
    s += '<rect width="380" height="270" fill="#fff"/>';
    if (g.izgara !== false) {
      for (let i = 0; i <= 4; i++) {
        const y = ust + ((alt - ust) / 4) * i;
        s += '<line x1="' + sol + '" y1="' + y + '" x2="' + sag + '" y2="' + y + '" stroke="#E8EEF8" stroke-width="1"/>';
        const val = maxY - ((maxY - minY) / 4) * i;
        s += '<text x="' + (sol - 6) + '" y="' + (y + 4) + '" text-anchor="end" font-family="system-ui,sans-serif" font-size="9.5" fill="#8A94A6">' + (Math.round(val * 100) / 100) + "</text>";
      }
      for (let i = 1; i <= 4; i++) {
        const x = sol + ((sag - sol) / 4) * i;
        s += '<line x1="' + x + '" y1="' + ust + '" x2="' + x + '" y2="' + alt + '" stroke="#F1F5FB" stroke-width="1"/>';
        s += '<text x="' + x + '" y="' + (alt + 14) + '" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9.5" fill="#8A94A6">' + (Math.round((maxX / 4) * i * 100) / 100) + "</text>";
      }
    }
    // eksenler
    s += '<line x1="' + sol + '" y1="' + ust + '" x2="' + sol + '" y2="' + alt + '" stroke="#5B6577" stroke-width="1.5"/>';
    s += '<line x1="' + sol + '" y1="' + alt + '" x2="' + sag + '" y2="' + alt + '" stroke="#5B6577" stroke-width="1.5"/>';
    s += '<text x="' + (sag - 2) + '" y="' + (alt - 6) + '" text-anchor="end" font-family="system-ui,sans-serif" font-size="11" fill="#16213A">' + esc(g.xEkseni || "x") + "</text>";
    s += '<text x="' + (sol + 4) + '" y="' + (ust + 2) + '" font-family="system-ui,sans-serif" font-size="11" fill="#16213A">' + esc(g.yEkseni || "y") + "</text>";
    seriler.forEach(function (sr, si) {
      const n = (sr.noktalar || []).map(function (p) { return px(p[0]) + "," + py(p[1]); }).join(" ");
      if (!n) return;
      if (g.alan) s += '<polygon points="' + n + " " + px((sr.noktalar[sr.noktalar.length - 1] || [0])[0]) + "," + alt + " " + px((sr.noktalar[0] || [0])[0]) + "," + alt + '" fill="' + renk[si % 4] + '22"/>';
      s += '<polyline points="' + n + '" fill="none" stroke="' + renk[si % 4] + '" stroke-width="2.5" stroke-linejoin="round"/>';
      (sr.noktalar || []).forEach(function (p) {
        s += '<circle cx="' + px(p[0]) + '" cy="' + py(p[1]) + '" r="3.2" fill="' + renk[si % 4] + '"/>';
      });
      if (sr.ad) s += '<text x="' + (sag - 4) + '" y="' + (py((sr.noktalar[sr.noktalar.length - 1] || [0, 0])[1]) - 8) + '" text-anchor="end" font-family="system-ui,sans-serif" font-size="11.5" font-weight="700" fill="' + renk[si % 4] + '">' + esc(sr.ad) + "</text>";
    });
    if (g.not) s += '<text x="' + sol + '" y="' + (H - 6) + '" font-family="system-ui,sans-serif" font-size="10.5" fill="#5B6577">' + esc(g.not) + "</text>";
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
    s += '<text x="' + (O.x + 6) + '" y="18" font-family="system-ui,sans-serif" font-size="11">' + esc(g.yEkseni || "y") + "</text>";
    vk.forEach(function (v, i) {
      const bx = O.x + sayi(v.x) * k, by = O.y - sayi(v.y) * k;
      s += '<line x1="' + O.x + '" y1="' + O.y + '" x2="' + bx + '" y2="' + by + '" stroke="' + renk[i % 4] + '" stroke-width="2.5" marker-end="url(#ok)"/>';
      s += '<text x="' + (bx + 8) + '" y="' + (by - 6) + '" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="' + renk[i % 4] + '">' + esc(v.ad || "") + "</text>";
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

  function svg(gorsel) {
    if (!gorsel || typeof gorsel !== "object") return "";
    try {
      switch (String(gorsel.tip || "")) {
        case "ucgen": return ucgen(gorsel);
        case "grafik": return grafik(gorsel);
        case "vektor": return vektor(gorsel);
        case "sema": return sema(gorsel);
        case "tablo": return tablo(gorsel);
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
    return hatalar;
  }

  const GV = { svg: svg, html: html, dogrula: dogrula, TIPLER: TIPLER };
  if (typeof module !== "undefined" && module.exports) module.exports = GV;
  if (kok) kok.GV = GV;
})(typeof window !== "undefined" ? window : globalThis);
