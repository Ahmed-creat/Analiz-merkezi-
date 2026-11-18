import React from 'react';
import {AbsoluteFill, Img, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Zemin} from '../bilesenler/Zemin';
import {T} from '../veri/tema';
import {Perde} from '../bilesenler/Yazi';

// Sahne 1 — sinematik açılış: gerçek uygulama simgesi + marka adı.
export const S1Acilis: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const logo = spring({frame: frame - 8, fps, config: {damping: 200, mass: 0.9}});
  const halka = interpolate(frame, [16, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cizgi = interpolate(frame, [34, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ad = spring({frame: frame - 40, fps, config: {damping: 200, mass: 0.6}});
  const alt = interpolate(frame, [58, 82], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const kapanis = interpolate(frame, [durationInFrames - 26, durationInFrames - 4], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const buyume = interpolate(frame, [0, durationInFrames], [1, 1.05]);

  return (
    <AbsoluteFill style={{background: T.zeminKoyu}}>
      <Zemin vurgu="mavi" />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `scale(${buyume})`, opacity: kapanis}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -24}}>
          <div style={{position: 'relative', width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {/* dönen halka */}
            <svg width={300} height={300} style={{position: 'absolute', transform: `rotate(${frame * 0.55}deg)`, opacity: halka * 0.75}}>
              <circle cx={150} cy={150} r={140} fill="none" stroke="rgba(59,130,246,0.55)" strokeWidth={1.6} strokeDasharray="8 14" />
            </svg>
            <svg width={300} height={300} style={{position: 'absolute', transform: `rotate(${-frame * 0.32}deg)`, opacity: halka * 0.5}}>
              <circle cx={150} cy={150} r={122} fill="none" stroke="rgba(34,211,238,0.45)" strokeWidth={1.2} strokeDasharray="3 10" />
            </svg>
            <div
              style={{
                width: 190,
                height: 190,
                borderRadius: 46,
                overflow: 'hidden',
                opacity: logo,
                transform: `scale(${interpolate(logo, [0, 1], [0.72, 1])})`,
                boxShadow: '0 40px 90px -30px rgba(37,99,235,0.85), 0 0 0 1px rgba(148,163,184,0.22)',
                background: '#0B1426',
              }}
            >
              <Img src={staticFile('logo.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          </div>

          <div
            style={{
              marginTop: 42,
              width: interpolate(cizgi, [0, 1], [0, 300]),
              height: 1.5,
              background: 'linear-gradient(90deg, rgba(59,130,246,0), rgba(59,130,246,0.9), rgba(59,130,246,0))',
            }}
          />

          <div
            style={{
              marginTop: 30,
              fontFamily: T.posta,
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: T.metin,
              opacity: ad,
              transform: `translateY(${interpolate(ad, [0, 1], [22, 0])}px)`,
            }}
          >
            Analiz Merkezi
          </div>

          <div
            style={{
              marginTop: 18,
              fontFamily: T.posta,
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: T.metinSoluk,
              opacity: alt,
              transform: `translateY(${interpolate(alt, [0, 1], [14, 0])}px)`,
            }}
          >
            Sınav analizi · Konu takibi · Aralıklı tekrar
          </div>
        </div>
      </AbsoluteFill>
      <Perde giris={12} cikis={14} sure={durationInFrames} />
    </AbsoluteFill>
  );
};
