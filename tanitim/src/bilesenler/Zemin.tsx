import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {T} from '../veri/tema';

type Props = {
  vurgu?: 'mavi' | 'mor' | 'cam' | 'karisik';
  yogunluk?: number;
};

// Koyu lacivert zemin — tek katman boyama (render hızı için sade tutuldu).
// Işık kütleleri çok yavaş kayar; ızgara ince bir doku olarak durur.
export const Zemin: React.FC<Props> = ({vurgu = 'karisik', yogunluk = 1}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  const a =
    vurgu === 'mavi'
      ? 'rgba(37,99,235,0.34)'
      : vurgu === 'mor'
        ? 'rgba(139,92,246,0.30)'
        : vurgu === 'cam'
          ? 'rgba(34,211,238,0.22)'
          : 'rgba(37,99,235,0.32)';
  const b =
    vurgu === 'mavi'
      ? 'rgba(14,165,233,0.16)'
      : vurgu === 'mor'
        ? 'rgba(37,99,235,0.26)'
        : vurgu === 'cam'
          ? 'rgba(37,99,235,0.26)'
          : 'rgba(139,92,246,0.20)';

  const aX = (vurgu === 'mor' ? 74 : 26) + Math.sin(t * 0.16) * 4;
  const aY = (vurgu === 'mor' ? 26 : 30) + Math.cos(t * 0.12) * 3;
  const bX = 78 + Math.cos(t * 0.11) * 4;
  const bY = 72 + Math.sin(t * 0.15) * 3;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: T.zeminKoyu,
        backgroundImage: [
          `radial-gradient(52% 46% at ${aX}% ${aY}%, ${a} 0%, rgba(4,6,14,0) 70%)`,
          `radial-gradient(50% 44% at ${bX}% ${bY}%, ${b} 0%, rgba(4,6,14,0) 72%)`,
          `linear-gradient(to right, ${T.cizgi} 1px, transparent 1px)`,
          `linear-gradient(to bottom, ${T.cizgi} 1px, transparent 1px)`,
          `radial-gradient(120% 90% at 50% 0%, ${T.zeminAcik} 0%, ${T.zemin} 45%, ${T.zeminKoyu} 100%)`,
        ].join(', '),
        backgroundSize: `auto, auto, 96px 96px, 96px 96px, auto`,
        backgroundPosition: `0 0, 0 0, ${(frame * 0.12) % 96}px ${(frame * 0.06) % 96}px, ${(frame * 0.12) % 96}px ${(frame * 0.06) % 96}px, 0 0`,
        opacity: 1,
      }}
    >
      <AbsoluteFill style={{background: 'radial-gradient(100% 72% at 50% 45%, rgba(0,0,0,0) 42%, rgba(2,4,10,0.7) 100%)', opacity: 0.9 * yogunluk}} />
    </AbsoluteFill>
  );
};
