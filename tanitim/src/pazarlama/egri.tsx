import React from 'react';
import {yum} from './parcalar';

/* Ebbinghaus unutma eğrisi — ölçülen noktalar (H. Ebbinghaus, 1885) */
const OLCUM: [number, number][] = [
  [0, 100],
  [0.0139, 58], // 20 dakika
  [1, 33],
  [2, 28],
  [6, 25],
  [31, 21],
];

/* monoton kübik (Fritsch–Carlson) — ölçüm noktalarından geçen düzgün eğri */
const egriOlustur = (noktalar: [number, number][]) => {
  const n = noktalar.length;
  const xs = noktalar.map(p => p[0]);
  const ys = noktalar.map(p => p[1]);
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  const m: number[] = new Array(n).fill(0);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const h = a * a + b * b;
    if (h > 9) {
      const t = 3 / Math.sqrt(h);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }
  return (x: number) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (i < n - 2 && x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i];
    const t = (x - xs[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h * m[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h * m[i + 1]
    );
  };
};

const tabanEgri = egriOlustur(OLCUM);

/* tekrarlardan sonra: her tekrarda eğri tepeye döner, sönüm yavaşlar */
const TEKRAR_GUN = [1, 3, 7, 14, 28];
const SONUM = [1.6, 3.4, 6, 10, 18];

const tekrarliDeger = (t: number) => {
  let k = -1;
  for (let i = 0; i < TEKRAR_GUN.length; i++) if (t >= TEKRAR_GUN[i]) k = i;
  if (k < 0) return 100 * Math.exp(-t / 0.9);
  return 100 * Math.exp(-(t - TEKRAR_GUN[k]) / SONUM[k]);
};

const GUN = 31;
const YUK = 430;
const GEN = 1010;

const x = (t: number) => (GEN * Math.pow(Math.max(0, t) / GUN, 0.42));
const y = (v: number) => YUK - (Math.max(0, Math.min(100, v)) / 100) * YUK;

const yol = (deger: (t: number) => number, adet = 260) => {
  let s = '';
  for (let i = 0; i <= adet; i++) {
    const t = (i / adet) * GUN;
    s += `${i === 0 ? 'M' : 'L'}${x(t).toFixed(2)},${y(deger(t)).toFixed(2)}`;
  }
  return s;
};

export const UnutmaEgrisi: React.FC<{
  f: number;
  tabanBasla: number;
  tekrarBasla: number;
  gen?: number;
}> = ({f, tabanBasla, tekrarBasla, gen = 1100}) => {
  const pTaban = yum((f - tabanBasla) / 60);
  const pTekrar = yum((f - tekrarBasla) / 80);

  const etiketler: {t: number; v: number; ad: string}[] = [
    {t: 0.0139, v: 58, ad: '20 dk'},
    {t: 1, v: 33, ad: '1. gün'},
    {t: 6, v: 25, ad: '6. gün'},
    {t: 31, v: 21, ad: '31. gün'},
  ];

  return (
    <svg width={GEN} height={YUK + 90} viewBox={`0 0 ${GEN} ${YUK + 90}`} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="egriDolusu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="maviDolgu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
        <filter id="egriParlak" x="-30%" y="-60%" width="160%" height="260%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ızgara */}
      {[0, 25, 50, 75, 100].map(v => (
        <line
          key={v}
          x1={0}
          x2={GEN}
          y1={y(v)}
          y2={y(v)}
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={1}
        />
      ))}
      {[
        {v: 100, ad: '%100'},
        {v: 50, ad: '%50'},
        {v: 0, ad: '%0'},
      ].map(l => (
        <text
          key={l.ad}
          x={-16}
          y={y(l.v) + 6}
          textAnchor="end"
          fill="#7C8BA8"
          fontSize={19}
          fontWeight={600}
        >
          {l.ad}
        </text>
      ))}
      {[
        {t: 0.0139, ad: '20 dk'},
        {t: 1, ad: '1 gün'},
        {t: 7, ad: '1 hafta'},
        {t: 31, ad: '1 ay'},
      ].map(l => (
        <text
          key={l.ad}
          x={x(l.t)}
          y={YUK + 40}
          textAnchor="middle"
          fill="#7C8BA8"
          fontSize={19}
          fontWeight={600}
        >
          {l.ad}
        </text>
      ))}

      {/* tekrarsız: unutma */}
      <path
        d={yol(tabanEgri) + ` L${GEN},${YUK} L0,${YUK} Z`}
        fill="url(#egriDolusu)"
        opacity={pTaban * 0.9}
      />
      <path
        d={yol(tabanEgri)}
        fill="none"
        stroke="#F59E0B"
        strokeWidth={5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={`${pTaban} 1`}
        opacity={pTaban > 0 ? 1 : 0}
      />

      {/* ölçüm noktaları */}
      {etiketler.map((n, i) => {
        const g = yum((f - tabanBasla - 24 - i * 7) / 12);
        return (
          <g key={n.ad} opacity={g}>
            <circle cx={x(n.t)} cy={y(n.v)} r={7} fill="#0B1220" stroke="#F59E0B" strokeWidth={3} />
            <text
              x={x(n.t) + (i === 0 ? 16 : 0)}
              y={y(n.v) - 22}
              textAnchor={i === 0 ? 'start' : 'middle'}
              fill="#F3C77B"
              fontSize={22}
              fontWeight={700}
            >
              %{n.v}
            </text>
          </g>
        );
      })}

      {/* tekrarlı: aralıklı tekrar */}
      {pTekrar > 0 && (
        <>
          <path
            d={yol(tekrarliDeger) + ` L${GEN},${YUK} L${x(1)},${YUK} Z`}
            fill="url(#maviDolgu)"
            opacity={pTekrar}
          />
          <path
            d={yol(tekrarliDeger)}
            fill="none"
            stroke="#60A5FA"
            strokeWidth={6}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${pTekrar} 1`}
            filter="url(#egriParlak)"
          />
          {TEKRAR_GUN.map((t, i) => {
            const g = yum((f - tekrarBasla - 10 - i * 12) / 10);
            return (
              <g key={t} opacity={g}>
                <line
                  x1={x(t)}
                  x2={x(t)}
                  y1={y(100)}
                  y2={YUK}
                  stroke="rgba(96,165,250,0.35)"
                  strokeWidth={2}
                  strokeDasharray="5 7"
                />
                <circle cx={x(t)} cy={y(100)} r={8} fill="#60A5FA" />
                <text
                  x={x(t)}
                  y={y(100) - 18}
                  textAnchor="middle"
                  fill="#BFDBFE"
                  fontSize={20}
                  fontWeight={700}
                >
                  {t}. gün
                </text>
              </g>
            );
          })}
        </>
      )}
    </svg>
  );
};
