import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile} from 'remotion';
import {Zemin} from '../bilesenler/Zemin';
import {Etiket, Baslik, Perde} from '../bilesenler/Yazi';
import {T} from '../veri/tema';
import {EKRANLAR} from '../veri/ekranlar';

const KART_GEN = 520;
const KART_YUK = 293;
const BOSLUK = 28;
const SIRA = [
  EKRANLAR.anaSayfaSonra.dosya,
  EKRANLAR.agacAcik.dosya,
  EKRANLAR.dortAdim.dosya,
  EKRANLAR.konuTakibi.dosya,
  EKRANLAR.soruBankasi.dosya,
  EKRANLAR.kitaplik.dosya,
];

export const S5Moduller: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const genelGiris = spring({frame: frame - 4, fps, config: {damping: 200, mass: 0.9}});
  const surukle = interpolate(frame, [0, durationInFrames], [0, -16]);

  return (
    <AbsoluteFill style={{background: T.zeminKoyu}}>
      <Zemin vurgu="cam" yogunluk={0.75} />

      <div style={{position: 'absolute', left: 0, right: 0, top: 84, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
        <Etiket metin="Genel görünüm" gecikme={4} hiza="center" />
        <Baslik metin="Altı modül, tek düzen." boyut={46} gecikme={8} hiza="center" agirlik={800} vurgu={['tek']} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 246 + surukle,
          display: 'flex',
          justifyContent: 'center',
          perspective: 1600,
          transform: `scale(${interpolate(genelGiris, [0, 1], [0.97, 1])})`,
        }}
      >
        <div style={{display: 'flex', flexWrap: 'wrap', width: 3 * KART_GEN + 2 * BOSLUK, gap: BOSLUK}}>
          {SIRA.map((src, i) => {
            const sp = spring({frame: frame - 12 - i * 5, fps, config: {damping: 200, mass: 0.8}});
            const egim = i % 2 === 0 ? 4 : -4;
            return (
              <div
                key={src}
                style={{
                  width: KART_GEN,
                  height: KART_YUK,
                  borderRadius: 14,
                  overflow: 'hidden',
                  border: '1px solid rgba(148,163,184,0.16)',
                  boxShadow: '0 30px 60px -34px rgba(2,6,23,0.95)',
                  opacity: sp,
                  transform: `translateY(${interpolate(sp, [0, 1], [34, 0])}px) rotateY(${egim * (1 - sp)}deg) rotateX(${(1 - sp) * 5}deg)`,
                  background: '#0A1120',
                  position: 'relative',
                }}
              >
                <Img
                  src={staticFile(src)}
                  style={{width: KART_GEN, height: KART_YUK, objectFit: 'cover', objectPosition: 'left top', filter: 'brightness(0.94) saturate(1.04)'}}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(200deg, rgba(37,99,235,0.08) 0%, rgba(4,6,14,0) 52%, rgba(4,6,14,0.24) 100%)',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 62,
          textAlign: 'center',
          fontFamily: T.posta,
          fontSize: 19,
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: T.metinCok,
          opacity: interpolate(frame, [70, 96], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        Ana Sayfa · Görevler · Denemeler · Takip · Soru Bankası · Kitaplık
      </div>
      <Perde giris={10} cikis={16} sure={durationInFrames} />
    </AbsoluteFill>
  );
};
