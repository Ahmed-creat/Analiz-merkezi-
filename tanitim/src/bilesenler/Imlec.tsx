import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {yumusak} from '../veri/tema';

export type Nokta = {f: number; x: number; y: number};

type Props = {
  yol: Nokta[];
  tiklama?: number[];
  boyut?: number;
  opaklik?: number;
};

// Ekran görüntüsüyle AYNI koordinat uzayında (1920×1080 CSS px) çalışan
// sanal imleç: tuşlara gider, tıklar, dalga bırakır.
export const Imlec: React.FC<Props> = ({yol, tiklama = [], boyut = 30, opaklik = 1}) => {
  const frame = useCurrentFrame();
  const noktalar = [...yol].sort((a, b) => a.f - b.f);

  const konum = (): {x: number; y: number} => {
    if (frame <= noktalar[0].f) return noktalar[0];
    for (let i = 0; i < noktalar.length - 1; i++) {
      const a = noktalar[i];
      const b = noktalar[i + 1];
      if (frame >= a.f && frame <= b.f) {
        const p = yumusak((frame - a.f) / Math.max(1, b.f - a.f));
        return {x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p};
      }
    }
    return noktalar[noktalar.length - 1];
  };
  const {x, y} = konum();

  // tıklama anında hafif basma
  let baski = 1;
  for (const c of tiklama) {
    const d = frame - c;
    if (d >= 0 && d < 8) baski = Math.min(baski, 1 - 0.14 * Math.sin((d / 8) * Math.PI));
  }

  const dalgalar = tiklama
    .map(c => frame - c)
    .filter(d => d >= 0 && d <= 20)
    .map((d, i) => ({d, i}));

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity: opaklik}}>
      {dalgalar.map(({d, i}) => {
        const p = d / 20;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - 60,
              top: y - 60,
              width: 120,
              height: 120,
              borderRadius: '50%',
              border: `2.5px solid rgba(59,130,246,${interpolate(p, [0, 1], [0.85, 0])})`,
              background: `radial-gradient(circle, rgba(59,130,246,${interpolate(p, [0, 1], [0.30, 0])}) 0%, rgba(59,130,246,0) 70%)`,
              transform: `scale(${interpolate(p, [0, 1], [0.22, 1.15])})`,
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: x - boyut * 0.18,
          top: y - boyut * 0.1,
          width: boyut,
          height: boyut * 1.35,
          transform: `scale(${baski})`,
          transformOrigin: '10% 10%',
          filter: 'drop-shadow(0 6px 14px rgba(2,6,23,0.55))',
        }}
      >
        <svg viewBox="0 0 24 32" width={boyut} height={boyut * 1.35}>
          <path
            d="M2 1.6 L2 25.4 L8.4 19.6 L12.4 29.2 L16.6 27.3 L12.7 18 L21.2 17.4 Z"
            fill="#FFFFFF"
            stroke="#0B1426"
            strokeWidth={1.7}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
