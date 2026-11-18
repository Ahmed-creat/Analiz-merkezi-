import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

const yumusak = (t: number) => {
  const k = Math.min(1, Math.max(0, t));
  return k * k * (3 - 2 * k);
};

const Marka: React.FC<{boyut?: number}> = ({boyut = 92}) => (
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
      boxShadow: '0 18px 40px rgba(37,99,235,0.28)',
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

export const Acilis: React.FC = () => {
  const frame = useCurrentFrame();
  const g1 = yumusak(frame / 26);
  const g2 = yumusak((frame - 10) / 26);
  const g3 = yumusak((frame - 22) / 26);
  const cikis = interpolate(frame, [78, 96], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(150deg,#F7FAFF 0%,#EDF2FB 52%,#E4EDFA 100%)',
        fontFamily: 'Inter, system-ui, sans-serif',
        opacity: cikis,
        overflow: 'hidden',
      }}
    >
      {/* yumuşak marka lekeleri */}
      <div style={{position: 'absolute', width: 780, height: 780, borderRadius: '50%', right: -220, top: -280, background: 'radial-gradient(circle,rgba(59,130,246,0.22),rgba(59,130,246,0) 68%)'}} />
      <div style={{position: 'absolute', width: 620, height: 620, borderRadius: '50%', left: -180, bottom: -260, background: 'radial-gradient(circle,rgba(34,211,238,0.18),rgba(34,211,238,0) 70%)'}} />
      {/* ince ızgara */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(15,27,51,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(15,27,51,0.045) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(circle at 30% 45%, black 30%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(circle at 30% 45%, black 30%, transparent 78%)',
        }}
      />

      <div style={{position: 'absolute', left: 140, top: 300, display: 'flex', alignItems: 'center', gap: 30, opacity: g1, transform: `translateY(${(1 - g1) * 26}px)`}}>
        <Marka />
        <div style={{fontSize: 92, fontWeight: 800, letterSpacing: -2.4, color: '#0F1B33'}}>Analiz Merkezi</div>
      </div>

      <div style={{position: 'absolute', left: 146, top: 430, fontSize: 38, fontWeight: 600, color: '#3F5A83', opacity: g2, transform: `translateY(${(1 - g2) * 22}px)`}}>
        Deneme analizi → günlük çalışma planı
      </div>

      <div style={{position: 'absolute', left: 146, top: 540, display: 'flex', gap: 16, opacity: g3}}>
        {['Okulizyon’dan otomatik çekim', 'Acil çalışılacaklar', 'Kısa kontrol', 'Tekrar takvimi'].map((m, i) => (
          <div
            key={m}
            style={{
              padding: '14px 22px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.86)',
              border: '1px solid rgba(37,99,235,0.2)',
              color: '#1D4ED8',
              fontWeight: 700,
              fontSize: 23,
              boxShadow: '0 10px 26px rgba(20,38,74,0.08)',
              opacity: yumusak((frame - 22 - i * 6) / 20),
              transform: `translateY(${(1 - yumusak((frame - 22 - i * 6) / 20)) * 14}px)`,
            }}
          >
            {m}
          </div>
        ))}
      </div>

      <div style={{position: 'absolute', left: 146, bottom: 96, fontSize: 21, fontWeight: 600, letterSpacing: 0.4, color: '#6E86A8', opacity: g3}}>
        Gerçek arayüz · 10. sınıf deneme düzeni · v83
      </div>
    </AbsoluteFill>
  );
};
