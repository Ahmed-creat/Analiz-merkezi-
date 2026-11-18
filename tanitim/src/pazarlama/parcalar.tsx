import React from 'react';
import {Img, interpolate, staticFile} from 'remotion';

/* ---------- yardımcılar ---------- */
export const yum = (t: number) => {
  const k = Math.min(1, Math.max(0, t));
  return k * k * (3 - 2 * k);
};

export const gir = (f: number, basla: number, sure = 16) => yum((f - basla) / sure);
export const cik = (f: number, basla: number, sure = 12) => 1 - yum((f - basla) / sure);

/* Bir yazının giriş/çıkış ömrü: opaklık + yukarı kayma + hafif bulanıklık */
export const yasam = (
  f: number,
  basla: number,
  bit: number,
  girisSure = 16,
  cikisSure = 12,
) => {
  const g = yum((f - basla) / girisSure);
  const c = 1 - yum((f - (bit - cikisSure)) / cikisSure);
  const op = Math.min(g, c);
  return {
    op,
    y: (1 - g) * 26 - (1 - c) * 14,
    blur: (1 - g) * 5 + (1 - c) * 4,
  };
};

/* ---------- marka ---------- */
export const Marka: React.FC<{boyut?: number; golge?: boolean}> = ({boyut = 92, golge = true}) => (
  <div
    style={{
      width: boyut,
      height: boyut,
      borderRadius: boyut * 0.28,
      background: 'linear-gradient(140deg,#1D4ED8 0%,#2563EB 55%,#38BDF8 100%)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: boyut * 0.085,
      padding: boyut * 0.22,
      boxSizing: 'border-box',
      boxShadow: golge ? `0 ${boyut * 0.2}px ${boyut * 0.45}px rgba(37,99,235,0.30)` : undefined,
      flexShrink: 0,
    }}
  >
    {[0.38, 0.62, 0.86, 1].map((h, i) => (
      <div
        key={i}
        style={{
          width: boyut * 0.1,
          height: boyut * 0.5 * h,
          borderRadius: boyut * 0.05,
          background: i === 3 ? '#FFFFFF' : 'rgba(255,255,255,0.82)',
        }}
      />
    ))}
  </div>
);

/* ---------- üst etiket ---------- */
export const Etiket: React.FC<{
  children: React.ReactNode;
  op: number;
  renk?: string;
  y?: number;
}> = ({children, op, renk = '#3B82F6', y = 0}) => (
  <div
    style={{
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: 4.6,
      textTransform: 'uppercase',
      color: renk,
      opacity: op,
      transform: `translateY(${y}px)`,
      fontVariantNumeric: 'tabular-nums',
    }}
  >
    {children}
  </div>
);

/* ---------- satır satır açılan büyük başlık ---------- */
export const Baslik: React.FC<{
  satirlar: (string | React.ReactNode)[];
  f: number;
  basla: number;
  boyut?: number;
  renk?: string;
  satirAra?: number;
  agirlik?: number;
}> = ({satirlar, f, basla, boyut = 92, renk = '#0B1220', satirAra = 8, agirlik = 800}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: satirAra}}>
    {satirlar.map((s, i) => {
      const g = yum((f - basla - i * 7) / 18);
      return (
        <div key={i} style={{overflow: 'hidden', paddingBottom: boyut * 0.06}}>
          <div
            style={{
              fontSize: boyut,
              fontWeight: agirlik,
              letterSpacing: boyut * -0.035,
              lineHeight: 1.08,
              color: renk,
              transform: `translateY(${(1 - g) * boyut * 0.9}px)`,
              opacity: g,
            }}
          >
            {s}
          </div>
        </div>
      );
    })}
  </div>
);

/* ---------- uygulama ekranı (pencere) ---------- */
export const UygulamaEkrani: React.FC<{
  src: string;
  cx?: number;
  cy?: number;
  s?: number;
  genislik?: number;
  yukseklik?: number;
  drift?: number;
  url?: string;
  cerceve?: boolean;
}> = ({
  src,
  cx = 960,
  cy = 540,
  s = 0.62,
  genislik = 1180,
  yukseklik = 664,
  drift = 0,
  url = 'analiz-merkezi.vercel.app',
  cerceve = true,
}) => {
  const olcek = s * (1 + drift);
  const icYukseklik = yukseklik - (cerceve ? 42 : 0);
  const sol = genislik / 2 - cx * olcek;
  const ust = icYukseklik / 2 - cy * olcek;
  return (
    <div
      style={{
        width: genislik,
        height: yukseklik,
        borderRadius: 20,
        overflow: 'hidden',
        background: '#F5F7FB',
        boxShadow:
          '0 2px 4px rgba(11,18,32,0.06), 0 30px 70px rgba(11,18,32,0.16), 0 80px 140px rgba(15,27,51,0.12)',
        border: '1px solid rgba(11,18,32,0.08)',
        position: 'relative',
      }}
    >
      {cerceve && (
        <div
          style={{
            height: 42,
            background: 'linear-gradient(#F2F5FA,#E9EEF7)',
            borderBottom: '1px solid rgba(11,18,32,0.07)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 8,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
            <div key={c} style={{width: 11, height: 11, borderRadius: 6, background: c, opacity: 0.85}} />
          ))}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#7A8AA3',
              letterSpacing: 0.2,
            }}
          >
            {url}
          </div>
        </div>
      )}
      <div style={{position: 'absolute', inset: cerceve ? '42px 0 0 0' : 0, overflow: 'hidden'}}>
        <Img
          src={staticFile(src)}
          style={{
            position: 'absolute',
            left: sol,
            top: ust - (cerceve ? 0 : 0),
            width: 1920 * olcek,
            height: 1080 * olcek,
          }}
        />
        {/* ekran üstü yumuşak parlama */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0) 30%, rgba(11,18,32,0.05))',
          }}
        />
      </div>
    </div>
  );
};

/* ---------- Apple tarzı açıklama çipi ---------- */
export const Cip: React.FC<{
  metin: string;
  op: number;
  y?: number;
  koyu?: boolean;
  genislik?: number;
}> = ({metin, op, y = 0, koyu = false, genislik}) => (
  <div
    style={{
      opacity: op,
      transform: `translateY(${y}px)`,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 22px',
      borderRadius: 999,
      background: koyu ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.96)',
      border: koyu ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(11,18,32,0.07)',
      boxShadow: koyu ? 'none' : '0 14px 40px rgba(11,18,32,0.14)',
      color: koyu ? '#DCE6FA' : '#1B2A44',
      fontSize: 21,
      fontWeight: 650,
      letterSpacing: -0.2,
      whiteSpace: 'nowrap',
      width: genislik,
      boxSizing: 'border-box',
    }}
  >
    <span
      style={{
        width: 9,
        height: 9,
        borderRadius: 5,
        background: '#2563EB',
        boxShadow: '0 0 0 4px rgba(37,99,235,0.16)',
        flexShrink: 0,
      }}
    />
    {metin}
  </div>
);

/* ---------- sayaç ---------- */
export const Sayac: React.FC<{
  deger: number;
  f: number;
  basla: number;
  sure?: number;
  ondalik?: number;
  sonEk?: string;
  onek?: string;
}> = ({deger, f, basla, sure = 34, ondalik = 0, sonEk = '', onek = ''}) => {
  const p = yum((f - basla) / sure);
  const v = deger * p;
  return (
    <span style={{fontVariantNumeric: 'tabular-nums'}}>
      {onek}
      {v.toFixed(ondalik).replace('.', ',')}
      {sonEk}
    </span>
  );
};

/* ---------- film greni + vinyet ---------- */
export const Gren: React.FC<{koyu?: boolean; op?: number}> = ({koyu = true, op = 0.5}) => (
  <>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: koyu
          ? 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%)'
          : 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(15,27,51,0.10) 100%)',
        opacity: op,
        pointerEvents: 'none',
      }}
    />
  </>
);

/* ---------- koyu zemin ---------- */
export const KoyuZemin: React.FC<{op?: number; isik?: 'sol' | 'sag'}> = ({op = 1, isik = 'sol'}) => (
  <div style={{position: 'absolute', inset: 0, opacity: op, background: '#06090F'}}>
    <div
      style={{
        position: 'absolute',
        width: 1400,
        height: 1400,
        borderRadius: '50%',
        left: isik === 'sol' ? -520 : undefined,
        right: isik === 'sag' ? -520 : undefined,
        top: -520,
        background: 'radial-gradient(circle, rgba(37,99,235,0.30), rgba(37,99,235,0) 62%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 1100,
        height: 1100,
        borderRadius: '50%',
        right: isik === 'sol' ? -420 : undefined,
        left: isik === 'sag' ? -420 : undefined,
        bottom: -520,
        background: 'radial-gradient(circle, rgba(56,189,248,0.18), rgba(56,189,248,0) 65%)',
      }}
    />
  </div>
);

/* ---------- açık zemin ---------- */
export const AcikZemin: React.FC<{kaydir?: number}> = ({kaydir = 0}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(155deg,#FBFCFE 0%,#F2F6FD 46%,#E6EEFA 100%)',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          'linear-gradient(rgba(15,27,51,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,27,51,0.035) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
        transform: `translateY(${kaydir}px)`,
        maskImage: 'radial-gradient(ellipse at 55% 45%, black 20%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at 55% 45%, black 20%, transparent 80%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 1200,
        height: 1200,
        borderRadius: '50%',
        right: -420,
        top: -520,
        background: 'radial-gradient(circle, rgba(59,130,246,0.16), rgba(59,130,246,0) 65%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 900,
        height: 900,
        borderRadius: '50%',
        left: -320,
        bottom: -460,
        background: 'radial-gradient(circle, rgba(34,211,238,0.13), rgba(34,211,238,0) 68%)',
      }}
    />
  </div>
);

/* ---------- geçiş perdesi (bölümler arası) ---------- */
export const Perde: React.FC<{f: number; basla: number; sure?: number; renk?: string}> = ({
  f,
  basla,
  sure = 10,
  renk = '#FFFFFF',
}) => {
  const p = interpolate(f, [basla - sure / 2, basla, basla + sure / 2], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{position: 'absolute', inset: 0, background: renk, opacity: p, pointerEvents: 'none'}} />
  );
};
