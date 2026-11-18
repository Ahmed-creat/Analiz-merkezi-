import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {Zemin} from '../bilesenler/Zemin';
import {Etiket, Baslik, Aciklama, Perde} from '../bilesenler/Yazi';
import {T} from '../veri/tema';

const Simge: React.FC<{tip: 'ara' | 'grafik' | 'tekrar'; renk: string}> = ({tip, renk}) => {
  const ortak = {fill: 'none', stroke: renk, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={30} height={30} viewBox="0 0 24 24">
      {tip === 'ara' && (
        <>
          <circle cx={10.5} cy={10.5} r={6.5} {...ortak} />
          <path d="M15.5 15.5 L21 21" {...ortak} />
        </>
      )}
      {tip === 'grafik' && (
        <>
          <path d="M3 20 H21" {...ortak} />
          <path d="M6 20 V12" {...ortak} />
          <path d="M11 20 V7" {...ortak} />
          <path d="M16 20 V14" {...ortak} />
          <path d="M20 9 L20 4" {...ortak} />
        </>
      )}
      {tip === 'tekrar' && (
        <>
          <path d="M20 12 A8 8 0 1 1 17.4 6.4" {...ortak} />
          <path d="M20 3.5 V8 H15.5" {...ortak} />
        </>
      )}
    </svg>
  );
};

const Kartlar = [
  {
    no: '01',
    simge: 'ara' as const,
    baslik: 'Eksik konular görünmüyor',
    metin: 'Hangi konuda gerçekten eksiksin, hangisi önce çalışılmalı?',
  },
  {
    no: '02',
    simge: 'grafik' as const,
    baslik: 'Net gelişimi ölçülemiyor',
    metin: 'Denemeden denemeye ne değişti, hangi ders neti düşürdü?',
  },
  {
    no: '03',
    simge: 'tekrar' as const,
    baslik: 'Tekrarlar düzensiz',
    metin: 'Ne zaman hangi konuyu tekrar edeceksin, unutmadan?',
  },
];

export const S2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill style={{background: T.zeminKoyu}}>
      <Zemin vurgu="mor" yogunluk={0.9} />
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 108, top: 340, width: 780}}>
          <Etiket metin="Problem" gecikme={6} />
          <div style={{marginTop: 26}}>
            <Baslik metin="Nerede eksik kaldığını görmek zor." boyut={64} gecikme={10} vurgu={['eksik']} />
          </div>
          <div style={{marginTop: 26}}>
            <Aciklama
              metin="Çoğu öğrenci neyi bilmediğini tahminle arar. Eksik konu, net gelişimi ve tekrar zamanı aynı yerde durmayınca çalışma düzeni dağılır."
              gecikme={30}
              boyut={25}
              genislik={660}
            />
          </div>
        </div>

        <div style={{position: 'absolute', left: 900, top: 314, width: 910, display: 'flex', flexDirection: 'column', gap: 20}}>
          {Kartlar.map((k, i) => {
            const sp = spring({frame: frame - 44 - i * 22, fps, config: {damping: 200, mass: 0.7}});
            return (
              <div
                key={k.no}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 26,
                  padding: '26px 30px',
                  borderRadius: 20,
                  background: 'linear-gradient(120deg, rgba(15,23,42,0.94) 0%, rgba(11,20,38,0.82) 100%)',
                  border: '1px solid rgba(148,163,184,0.14)',
                  boxShadow: '0 30px 70px -40px rgba(2,6,23,0.95)',
                  opacity: sp * 0.999,
                  transform: `translateX(${interpolate(sp, [0, 1], [46, 0])}px)`,
                }}
              >
                <div
                  style={{
                    minWidth: 62,
                    height: 62,
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(59,130,246,0.12)',
                    border: '1px solid rgba(59,130,246,0.28)',
                  }}
                >
                  <Simge tip={k.simge} renk={T.mavi} />
                </div>
                <div>
                  <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
                    <span style={{fontFamily: T.posta, fontSize: 16, fontWeight: 800, color: T.mavi, letterSpacing: '0.12em'}}>{k.no}</span>
                    <span style={{fontFamily: T.posta, fontSize: 32, fontWeight: 700, color: T.metin, letterSpacing: '-0.01em'}}>{k.baslik}</span>
                  </div>
                  <div style={{fontFamily: T.posta, fontSize: 22, color: T.metinSoluk, marginTop: 6, lineHeight: 1.45}}>{k.metin}</div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Perde giris={10} cikis={16} sure={durationInFrames} />
    </AbsoluteFill>
  );
};
