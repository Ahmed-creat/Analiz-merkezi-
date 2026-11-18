import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

const yumusak = (t: number) => {
  const k = Math.min(1, Math.max(0, t));
  return k * k * (3 - 2 * k);
};

const satirlar = [
  'Okulizyon çekimi ya da manuel giriş',
  'Her yanlış için konu + neden',
  'Acil çalışılacaklar sırası',
  'Beş adım + kısa kontrol',
  'Tekrar takvimi ve hafıza gücü',
];

export const Kapanis: React.FC = () => {
  const frame = useCurrentFrame();
  const g = yumusak(frame / 24);
  const kapanis = interpolate(frame, [100, 118], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const op = Math.min(g, kapanis);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(150deg,#EDF2FB 0%,#F7FAFF 45%,#E7EFFB 100%)',
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >
      <div style={{position: 'absolute', width: 820, height: 820, borderRadius: '50%', left: -260, top: -300, background: 'radial-gradient(circle,rgba(37,99,235,0.18),rgba(37,99,235,0) 68%)'}} />
      <div style={{position: 'absolute', width: 700, height: 700, borderRadius: '50%', right: -220, bottom: -260, background: 'radial-gradient(circle,rgba(34,211,238,0.16),rgba(34,211,238,0) 70%)'}} />

      <div style={{position: 'absolute', left: 150, top: 236, opacity: op, transform: `translateY(${(1 - g) * 24}px)`}}>
        <div style={{fontSize: 24, fontWeight: 800, letterSpacing: 2.6, color: '#2563EB', marginBottom: 18}}>ANALİZ MERKEZİ</div>
        <div style={{fontSize: 82, fontWeight: 800, letterSpacing: -2, color: '#0F1B33', lineHeight: 1.1}}>
          Her yanlış,
          <br />
          bir sonraki adım.
        </div>
      </div>

      <div style={{position: 'absolute', left: 154, top: 566, display: 'flex', flexDirection: 'column', gap: 12}}>
        {satirlar.map((s, i) => {
          const a = yumusak((frame - 12 - i * 8) / 18);
          return (
            <div key={s} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: a, transform: `translateX(${(1 - a) * -18}px)`}}>
              <div style={{width: 22, height: 22, borderRadius: 7, background: 'linear-gradient(135deg,#1D4ED8,#38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path d="M1.6 6.4 L4.4 9.2 L10.4 3.2" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{fontSize: 27, fontWeight: 600, color: '#2C4368'}}>{s}</div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          right: 150,
          top: 300,
          width: 520,
          padding: '34px 38px',
          borderRadius: 26,
          background: 'rgba(255,255,255,0.94)',
          border: '1px solid rgba(37,99,235,0.18)',
          boxShadow: '0 26px 60px rgba(20,38,74,0.14)',
          opacity: op,
          transform: `translateY(${(1 - g) * 30}px)`,
        }}
      >
        <div style={{fontSize: 19, fontWeight: 800, letterSpacing: 1.6, color: '#2563EB', marginBottom: 14}}>CANLI</div>
        <div style={{fontSize: 34, fontWeight: 800, color: '#0F1B33', lineHeight: 1.2, marginBottom: 10}}>analiz-merkezi.vercel.app</div>
        <div style={{fontSize: 20, fontWeight: 500, color: '#5A7295', lineHeight: 1.45}}>
          Denemelerini gir, eksiklerini sırayla kapat. Hafıza gücü ve tekrar takvimi kendiliğinden işler.
        </div>
        <div style={{marginTop: 22, height: 6, borderRadius: 99, background: 'linear-gradient(90deg,#1D4ED8,#3B82F6,#22D3EE)'}} />
      </div>
    </AbsoluteFill>
  );
};
