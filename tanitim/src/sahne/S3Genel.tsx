import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Zemin} from '../bilesenler/Zemin';
import {Etiket, Baslik, Perde} from '../bilesenler/Yazi';
import {Ekran} from '../bilesenler/Ekran';
import {T} from '../veri/tema';
import {EKRANLAR} from '../veri/ekranlar';

const OLCek = 0.72;
const KART_GEN = 1920 * OLCek;
const KART_YUK = 1080 * OLCek;

export const S3Genel: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1]);
  const kart = spring({frame: frame - 10, fps, config: {damping: 200, mass: 0.8}});

  const cipler = ['Günün özeti', 'Görevler', 'Konu takibi', 'Net grafiği'];
  const cipBas = 52;

  return (
    <AbsoluteFill style={{background: T.zeminKoyu}}>
      <Zemin vurgu="mavi" yogunluk={0.85} />

      <div style={{position: 'absolute', left: 108, top: 52}}>
        <Etiket metin="Tek ekran" gecikme={4} />
        <div style={{marginTop: 12}}>
          <Baslik metin="Tüm çalışma düzenin bir arada." boyut={44} gecikme={8} agirlik={700} />
        </div>
      </div>

      <div style={{position: 'absolute', right: 108, top: 66, display: 'flex', gap: 12}}>
        {cipler.map((m, i) => {
          const g = interpolate(frame, [cipBas + i * 8, cipBas + i * 8 + 16], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={m}
              style={{
                fontFamily: T.posta,
                fontSize: 17,
                fontWeight: 600,
                color: i === 0 ? '#DBEAFE' : T.metinSoluk,
                padding: '9px 16px',
                borderRadius: 999,
                border: '1px solid rgba(148,163,184,0.18)',
                background: i === 0 ? 'rgba(37,99,235,0.20)' : 'rgba(15,23,42,0.6)',
                opacity: g,
                transform: `translateY(${interpolate(g, [0, 1], [8, 0])}px)`,
              }}
            >
              {m}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: (1920 - KART_GEN) / 2,
          top: 178,
          width: KART_GEN,
          height: KART_YUK,
          transform: `translateY(${interpolate(kart, [0, 1], [30, 0])}px) scale(${interpolate(kart, [0, 1], [0.97, 1])})`,
          opacity: kart,
        }}
      >
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${OLCek})`, transformOrigin: '0 0'}}>
          <Ekran
            src={EKRANLAR.anaSayfaSonra.dosya}
            p={p}
            zoom={[1.0, 1.06]}
            odak={{x: 1000, y: 520}}
            odakSon={{x: 1140, y: 470}}
            yaricap={22}
          />
        </div>
      </div>
      <Perde giris={10} cikis={16} sure={durationInFrames} />
    </AbsoluteFill>
  );
};
