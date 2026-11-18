import React from 'react';
import {AbsoluteFill, Img, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Zemin} from '../bilesenler/Zemin';
import {Perde} from '../bilesenler/Yazi';
import {T} from '../veri/tema';

const SATIRLAR = ['Eksiklerini gör.', 'Planını kur.', 'Tekrarı kaçırma.'];

export const S6Kapanis: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const logo = spring({frame: frame - 8, fps, config: {damping: 200, mass: 0.8}});
  const logoCikis = interpolate(frame, [96, 118], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const metinCikis = interpolate(frame, [100, 124], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const marka = spring({frame: frame - 120, fps, config: {damping: 200, mass: 0.8}});
  const buyume = interpolate(frame, [0, durationInFrames], [1, 1.03]);

  return (
    <AbsoluteFill style={{background: T.zeminKoyu}}>
      <Zemin vurgu="mavi" yogunluk={0.9} />
      <AbsoluteFill style={{alignItems: 'center', transform: `scale(${buyume})`}}>
        {/* logo */}
        <div
          style={{
            width: 118,
            height: 118,
            borderRadius: 30,
            overflow: 'hidden',
            opacity: logo * logoCikis,
            transform: `scale(${interpolate(logo, [0, 1], [0.7, 1])})`,
            boxShadow: '0 30px 70px -26px rgba(37,99,235,0.8), 0 0 0 1px rgba(148,163,184,0.2)',
            position: 'absolute',
            top: 146,
          }}
        >
          <Img src={staticFile('logo.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>

        {/* üç satır mesaj */}
        <div style={{opacity: metinCikis, position: 'absolute', top: 330, width: '100%', textAlign: 'center'}}>
          {SATIRLAR.map((s, i) => {
            const sp = spring({frame: frame - 32 - i * 13, fps, config: {damping: 200, mass: 0.7}});
            return (
              <div
                key={s}
                style={{
                  fontFamily: T.posta,
                  fontSize: 66,
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.26,
                  color: i === 2 ? T.mavi : T.metin,
                  opacity: sp,
                  transform: `translateY(${interpolate(sp, [0, 1], [26, 0])}px)`,
                }}
              >
                {s}
              </div>
            );
          })}
        </div>

        {/* marka kapanışı */}
        <div
          style={{
            position: 'absolute',
            top: 372,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            opacity: marka,
            transform: `translateY(${interpolate(marka, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              width: 86,
              height: 86,
              borderRadius: 22,
              overflow: 'hidden',
              marginBottom: 16,
              boxShadow: '0 24px 60px -26px rgba(37,99,235,0.85), 0 0 0 1px rgba(148,163,184,0.18)',
            }}
          >
            <Img src={staticFile('logo.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
          <div style={{width: interpolate(marka, [0, 1], [0, 560]), height: 1.5, background: 'linear-gradient(90deg, rgba(59,130,246,0), rgba(59,130,246,0.9), rgba(59,130,246,0))'}} />
          <div style={{fontFamily: T.posta, fontSize: 58, fontWeight: 800, color: T.metin, letterSpacing: '-0.02em'}}>Analiz Merkezi</div>
          <div style={{fontFamily: T.posta, fontSize: 22, fontWeight: 600, color: T.metinSoluk, letterSpacing: '0.02em'}}>
            Sınav analizi ve aralıklı tekrar · 9–10. sınıf
          </div>
        </div>
      </AbsoluteFill>
      <Perde giris={10} cikis={18} sure={durationInFrames} />
    </AbsoluteFill>
  );
};
