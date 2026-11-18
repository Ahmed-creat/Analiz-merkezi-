import React from 'react';
import {Img, staticFile, interpolate} from 'remotion';
import {yumusak} from '../veri/tema';

export type Odak = {x: number; y: number};

type Props = {
  src: string;
  p: number; // 0..1 — sahne içi ilerleme
  zoom?: [number, number];
  odak?: Odak;
  odakSon?: Odak;
  yaricap?: number;
  kenar?: boolean;
  golge?: boolean;
  opaklik?: number;
  children?: React.ReactNode;
};

const K = {gen: 1920, yuk: 1080};

// Gerçek arayüz görüntüsünü sinematik kamera hareketiyle gösterir.
// Görüntü 3840×2160 (2×) olduğu için yakınlaşma kayıpsız kalır.
export const Ekran: React.FC<Props> = ({
  src,
  p,
  zoom = [1, 1],
  odak,
  odakSon,
  yaricap = 18,
  kenar = true,
  golge = true,
  opaklik = 1,
  children,
}) => {
  const e = yumusak(p);
  const s = interpolate(e, [0, 1], [zoom[0], zoom[1]]);
  const o0 = odak ?? {x: K.gen / 2, y: K.yuk / 2};
  const o1 = odakSon ?? o0;
  const ox = interpolate(e, [0, 1], [o0.x, o1.x]);
  const oy = interpolate(e, [0, 1], [o0.y, o1.y]);
  // Kenarlarda boşluk görünmemesi için kaydırma sınırlanır.
  const sinir = (deger: number, boyut: number) => Math.min(0, Math.max(boyut - s * boyut, deger));
  const dx = s >= 1 ? sinir(K.gen / 2 - s * ox, K.gen) : K.gen / 2 - s * ox;
  const dy = s >= 1 ? sinir(K.yuk / 2 - s * oy, K.yuk) : K.yuk / 2 - s * oy;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: K.gen,
        height: K.yuk,
        borderRadius: yaricap,
        overflow: 'hidden',
        border: kenar ? '1px solid rgba(148,163,184,0.20)' : undefined,
        boxShadow: golge
          ? '0 28px 64px -26px rgba(2,6,23,0.92), 0 8px 24px -12px rgba(2,6,23,0.7)'
          : undefined,
        opacity: opaklik,
        background: '#0A1120',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${dx}px, ${dy}px) scale(${s})`,
          transformOrigin: '0 0',
        }}
      >
        <Img src={staticFile(src)} style={{width: K.gen, height: K.yuk, display: 'block'}} />
        {children}
      </div>
      {/* cam parlaması */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(115deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 38%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
