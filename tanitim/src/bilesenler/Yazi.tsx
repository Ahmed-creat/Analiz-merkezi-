import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {T} from '../veri/tema';

export const Etiket: React.FC<{metin: string; gecikme?: number; renk?: string; hiza?: 'left' | 'center'}> = ({
  metin,
  gecikme = 0,
  renk = T.mavi,
  hiza = 'left',
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - gecikme, [0, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [10, 0])}px)`,
        justifyContent: hiza === 'center' ? 'center' : 'flex-start',
      }}
    >
      <div style={{width: 34, height: 2, background: renk, borderRadius: 2}} />
      <span
        style={{
          fontFamily: T.posta,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: renk,
        }}
      >
        {metin}
      </span>
    </div>
  );
};

export const Baslik: React.FC<{
  metin: string;
  gecikme?: number;
  boyut?: number;
  agirlik?: number;
  renk?: string;
  vurgu?: string[];
  vurguRengi?: string;
  satirYuksekligi?: number;
  hiza?: 'left' | 'center';
  genislik?: number;
}> = ({
  metin,
  gecikme = 0,
  boyut = 76,
  agirlik = 800,
  renk = T.metin,
  vurgu = [],
  vurguRengi = T.mavi,
  satirYuksekligi = 1.12,
  hiza = 'left',
  genislik,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const kelimeler = metin.split(' ');
  return (
    <div
      style={{
        fontFamily: T.posta,
        fontSize: boyut,
        fontWeight: agirlik,
        lineHeight: satirYuksekligi,
        letterSpacing: '-0.02em',
        color: renk,
        textAlign: hiza,
        maxWidth: genislik,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.12em 0.26em',
        justifyContent: hiza === 'center' ? 'center' : 'flex-start',
      }}
    >
      {kelimeler.map((k, i) => {
        const sp = spring({frame: frame - gecikme - i * 3.2, fps, config: {damping: 200, mass: 0.5}});
        const vurgulu = vurgu.some(v => k.toLowerCase().replace(/[.,!?]/g, '').startsWith(v.toLowerCase()));
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: sp,
              transform: `translateY(${interpolate(sp, [0, 1], [26, 0])}px)`,
              color: vurgulu ? vurguRengi : undefined,
            }}
          >
            {k}
          </span>
        );
      })}
    </div>
  );
};

export const Aciklama: React.FC<{
  metin: string;
  gecikme?: number;
  boyut?: number;
  renk?: string;
  genislik?: number;
  hiza?: 'left' | 'center';
  agirlik?: number;
}> = ({metin, gecikme = 0, boyut = 26, renk = T.metinSoluk, genislik = 720, hiza = 'left', agirlik = 400}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - gecikme, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        fontFamily: T.posta,
        fontSize: boyut,
        fontWeight: agirlik,
        lineHeight: 1.55,
        color: renk,
        maxWidth: genislik,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [14, 0])}px)`,
        textAlign: hiza,
        marginLeft: hiza === 'center' ? 'auto' : undefined,
        marginRight: hiza === 'center' ? 'auto' : undefined,
      }}
    >
      {metin}
    </div>
  );
};

// Sahne giriş/çıkış karartması — yumuşak "dip" geçişler.
export const Perde: React.FC<{giris?: number; cikis?: number; sure: number}> = ({giris = 10, cikis = 12, sure}) => {
  const frame = useCurrentFrame();
  // giriş: 1 → 0 (perde açılır), çıkış: 0 → 1 (perde kapanır); ortada 0.
  const a = interpolate(frame, [0, giris], [1, 0], {extrapolateRight: 'clamp'});
  const b = interpolate(frame, [sure - cikis, sure - 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: T.zeminKoyu,
        opacity: Math.max(a, b),
        pointerEvents: 'none',
      }}
    />
  );
};
