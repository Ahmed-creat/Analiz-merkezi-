#!/usr/bin/env node
/* PDF metin çıkarıcı — FlateDecode + ToUnicode CMap + /W glif genişlikleri.
   Bu PDF'te her satır kendi `cm` matrisiyle konumlanıyor (Td sabit),
   bu yüzden CTM takibi zorunlu. */
"use strict";
const fs = require("fs");
const zlib = require("zlib");

function pdfMetinCikar(yol) {
const raw = fs.readFileSync(yol).toString("latin1");

const nesneler = new Map();
{
  const re = /(\d+)\s+(\d+)\s+obj\b/g;
  let m;
  while ((m = re.exec(raw))) {
    const s = m.index + m[0].length;
    const e = raw.indexOf("endobj", s);
    nesneler.set(Number(m[1]), raw.slice(s, e < 0 ? raw.length : e));
  }
}

function akis(g) {
  const i = g.indexOf("stream");
  if (i < 0) return null;
  let b = i + 6;
  if (g[b] === "\r") b++;
  if (g[b] === "\n") b++;
  const e = g.lastIndexOf("endstream");
  if (e <= b) return null;
  const v = Buffer.from(g.slice(b, e), "latin1");
  if (/FlateDecode/.test(g.slice(0, i))) { try { return zlib.inflateSync(v); } catch (x) { return null; } }
  return v;
}

const acik = new Map();
for (const [no, g] of nesneler) {
  if (!/stream/.test(g)) continue;
  const v = akis(g);
  if (v) acik.set(no, v.toString("latin1"));
}

/* ToUnicode */
const harita = new Map();
for (const t of acik.values()) {
  if (!/beginbfchar|beginbfrange/.test(t)) continue;
  let b;
  const r1 = /beginbfchar([\s\S]*?)endbfchar/g;
  while ((b = r1.exec(t))) {
    const c = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g;
    let q;
    while ((q = c.exec(b[1]))) {
      let s = "";
      for (let i = 0; i + 4 <= q[2].length; i += 4) s += String.fromCharCode(parseInt(q[2].substr(i, 4), 16));
      harita.set(parseInt(q[1], 16), s);
    }
  }
  const r2 = /beginbfrange([\s\S]*?)endbfrange/g;
  while ((b = r2.exec(t))) {
    const c = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g;
    let q;
    while ((q = c.exec(b[1]))) {
      const lo = parseInt(q[1], 16), hi = parseInt(q[2], 16), hd = parseInt(q[3], 16);
      for (let k = lo; k <= hi; k++) harita.set(k, String.fromCharCode(hd + (k - lo)));
    }
  }
}

/* /W genişlikleri — yalnız CIDFont nesnesinden */
const genislik = new Map();
for (const g of nesneler.values()) {
  if (!/\/CIDFontType2|\/Subtype\s*\/CIDFontType/.test(g)) continue;
  const i = g.indexOf("/W");
  if (i < 0) continue;
  const s = g.slice(i + 2);
  const bas = s.indexOf("[");
  if (bas < 0) continue;
  let d = 0, son = bas;
  for (; son < s.length; son++) {
    if (s[son] === "[") d++;
    else if (s[son] === "]") { d--; if (d === 0) break; }
  }
  const tok = s.slice(bas + 1, son).match(/\[[^\]]*\]|-?[\d.]+/g) || [];
  let k = 0;
  while (k < tok.length) {
    if (tok[k].startsWith("[")) {
      const ilk = Number(tok[k - 1]);
      tok[k].slice(1, -1).trim().split(/\s+/).filter(Boolean).map(Number)
        .forEach((v, j) => { if (v) genislik.set(ilk + j, v); });
      k++;
    } else {
      const b = tok[k + 1], c = tok[k + 2];
      if (c !== undefined && !b.startsWith("[") && !c.startsWith("[")) {
        for (let j = +tok[k]; j <= +b; j++) genislik.set(j, +c);
        k += 3;
      } else k++;
    }
  }
  break;
}

const coz = (hex) => {
  let s = "";
  for (let i = 0; i + 4 <= hex.length; i += 4) {
    const k = parseInt(hex.substr(i, 4), 16);
    s += harita.has(k) ? harita.get(k) : "";
  }
  return s;
};
const kodlar = (hex) => {
  const a = [];
  for (let i = 0; i + 4 <= hex.length; i += 4) a.push(parseInt(hex.substr(i, 4), 16));
  return a;
};

const carp = (m1, m2) => [
  m1[0] * m2[0] + m1[1] * m2[2], m1[0] * m2[1] + m1[1] * m2[3],
  m1[2] * m2[0] + m1[3] * m2[2], m1[2] * m2[1] + m1[3] * m2[3],
  m1[4] * m2[0] + m1[5] * m2[2] + m2[4], m1[4] * m2[1] + m1[5] * m2[3] + m2[5]
];
const uygula = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

const sayfaNesneleri = [];
for (const g of nesneler.values()) {
  if (!/\/Type\s*\/Page[^s]/.test(g)) continue;
  const c = g.match(/\/Contents\s+(\d+)\s+0\s+R/);
  if (c) sayfaNesneleri.push(Number(c[1]));
}
sayfaNesneleri.sort((a, b) => a - b);

const TOK = /<([0-9A-Fa-f]*)>\s*Tj|\[((?:[^\[\]]|\[[^\]]*\])*)\]\s*TJ|(-?[\d.]+)\s+(-?[\d.]+)\s+(?:Td|TD)|(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(?:cm|Tm)|([-\d.]+)\s+Tf|q\b|Q\b/g;

function cikar(t) {
  let ctm = [1, 0, 0, 1, 0, 0], tm = [1, 0, 0, 1, 0, 0], fs2 = 10;
  const yigin = [], parcalar = [];
  let sonBitis = null, sonGen = 0;
  TOK.lastIndex = 0;
  let k;
  while ((k = TOK.exec(t))) {
    if (k[0] === "q") yigin.push(ctm.slice());
    else if (k[0] === "Q") { if (yigin.length) ctm = yigin.pop(); }
    else if (k[11] !== undefined) fs2 = parseFloat(k[11]);
    else if (k[5] !== undefined) {
      const m = [+k[5], +k[6], +k[7], +k[8], +k[9], +k[10]];
      if (/cm$/.test(k[0])) ctm = carp(m, ctm); else tm = m;
    } else if (k[3] !== undefined) {
      tm = carp([1, 0, 0, 1, +k[3], +k[4]], tm);
    } else if (k[1] !== undefined || k[2] !== undefined) {
      const hexler = k[1] !== undefined ? [k[1]] : [...k[2].matchAll(/<([0-9A-Fa-f]*)>/g)].map(x => x[1]);
      const m = carp(tm, ctm);
      const olcek = Math.hypot(m[0], m[1]);
      const p = uygula(m, 0, 0);
      let x = p[0], s = "";
      for (const h of hexler) {
        for (const cid of kodlar(h)) {
          const ch = harita.has(cid) ? harita.get(cid) : "";
          if (!ch) { x += (genislik.get(cid) || 500) / 1000 * fs2 * olcek; continue; }
          if (sonBitis !== null && x - sonBitis - sonGen > 0.9) s += " ";
          s += ch;
          sonBitis = x;
          sonGen = (genislik.get(cid) || 500) / 1000 * fs2 * olcek;
          x += sonGen;
        }
      }
      if (s) parcalar.push({ x: p[0], y: p[1], s });
    }
  }
  const satirlar = [];
  for (const p of parcalar.slice().sort((a, b) => b.y - a.y || a.x - b.x)) {
    let h = satirlar.find(z => Math.abs(z.y - p.y) < 3);
    if (!h) { h = { y: p.y, p: [] }; satirlar.push(h); }
    h.p.push(p);
  }
  satirlar.sort((a, b) => b.y - a.y);
  return satirlar.map(z => {
    z.p.sort((a, b) => a.x - b.x);
    return z.p.map(q => q.s).join("").replace(/\s+/g, " ").trim();
  }).filter(Boolean);
}

let out = "";
sayfaNesneleri.forEach((no, i) => {
  const t = acik.get(no);
  if (!t) return;
  out += "\n\n########## SAYFA " + (i + 1) + " ##########\n" + cikar(t).join("\n");
});
return out;
}

module.exports = { pdfMetinCikar };

if (require.main === module) {
  if (!process.argv[2]) {
    console.error("Kullanım: node scripts/pdf-metin-cikar.js <dosya.pdf>");
    process.exit(2);
  }
  process.stdout.write(pdfMetinCikar(process.argv[2]) + "\n");
}
