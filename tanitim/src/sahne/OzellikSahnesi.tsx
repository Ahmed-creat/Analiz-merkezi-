import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Zemin} from '../bilesenler/Zemin';
import {Etiket, Baslik, Aciklama} from '../bilesenler/Yazi';
import {Ekran, Odak} from '../bilesenler/Ekran';
import {Imlec, Nokta} from '../bilesenler/Imlec';
import {T} from '../veri/tema';
import {Kutu} from '../veri/ekranlar';

export type Cekim = {
  src: string;
  baslangic: number;
  zoom: [number, number];
  odak?: Odak;
  odakSon?: Odak;
  imlec?: {yol: Nokta[]; tiklama: number[]};
  vurgu?: Kutu;
};

export type Ozellik = {
  no: string;
  etiket: string;
  baslik: string;
  aciklama: string;
  maddeler: string[];
  cekimler: Cekim[];
  vurgu?: 'mavi' | 'mor' | 'cam';
};

const OLCek = 0.74; // 1920 → 1421 px sahne kartı
const KART_X = 470;
const KART_Y = (1080 - 1080 * OLCek) / 2 + 6;

export const OzellikSahnesi: React.FC<{ozellik: Ozellik; sure: number; sira: number; toplam: number}> = ({ozellik, sure, sira, toplam}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const kartGiris = spring({frame: frame - 6, fps, config: {damping: 200, mass: 0.9}});

  return (
    <AbsoluteFill style={{background: T.zeminKoyu}}>
      <Zemin vurgu={ozellik.vurgu ?? 'mavi'} yogunluk={0.8} />

      {/* sol sütun */}
      <div style={{position: 'absolute', left: 100, top: 268, width: 340}}>
        <Etiket metin={ozellik.etiket} gecikme={4} />
        <div style={{marginTop: 18}}>
          <Baslik metin={ozellik.baslik} boyut={38} gecikme={10} vurgu={[]} satirYuksekligi={1.14} genislik={340} />
        </div>
        <div style={{marginTop: 20}}>
          <Aciklama metin={ozellik.aciklama} gecikme={26} boyut={16.5} genislik={330} />
        </div>
        <div style={{marginTop: 30, display: 'flex', flexDirection: 'column', gap: 14}}>
          {ozellik.maddeler.map((m, i) => {
            const p = interpolate(frame, [40 + i * 10, 56 + i * 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return (
              <div key={m} style={{display: 'flex', gap: 12, alignItems: 'flex-start', opacity: p, transform: `translateX(${interpolate(p, [0, 1], [12, 0])}px)`}}>
                <svg width={20} height={20} viewBox="0 0 24 24" style={{marginTop: 3, flexShrink: 0}}>
                  <circle cx={12} cy={12} r={10} fill="rgba(37,99,235,0.18)" stroke="rgba(59,130,246,0.5)" strokeWidth={1.2} />
                  <path d="M7.5 12.5 L10.5 15.3 L16.5 8.8" fill="none" stroke={T.mavi} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{fontFamily: T.posta, fontSize: 15, lineHeight: 1.5, color: '#C7D3E6'}}>{m}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ekran kartı */}
      <div
        style={{
          position: 'absolute',
          left: KART_X,
          top: KART_Y,
          width: 1920 * OLCek,
          height: 1080 * OLCek,
          transform: `translateY(${interpolate(kartGiris, [0, 1], [26, 0])}px) scale(${interpolate(kartGiris, [0, 1], [0.97, 1])})`,
          opacity: kartGiris,
        }}
      >
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${OLCek})`, transformOrigin: '0 0'}}>
          {ozellik.cekimler.map((c, i) => {
            const son = i === ozellik.cekimler.length - 1 ? sure : ozellik.cekimler[i + 1].baslangic;
            const giris = i === 0 ? 1 : interpolate(frame, [c.baslangic - 2, c.baslangic + 8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const cikisOp = i === ozellik.cekimler.length - 1
              ? 1
              : interpolate(frame, [ozellik.cekimler[i + 1].baslangic - 2, ozellik.cekimler[i + 1].baslangic + 8], [1, 0], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                });
            const op = Math.min(giris, cikisOp);
            if (frame < c.baslangic - 12) return null;
            const yerel = Math.min(1, Math.max(0, (frame - c.baslangic) / Math.max(1, son - c.baslangic)));
            return (
              <div key={i} style={{position: 'absolute', inset: 0, opacity: op}}>
                <Ekran src={c.src} p={yerel} zoom={c.zoom} odak={c.odak} odakSon={c.odakSon} yaricap={20}>
                  {c.vurgu && (
                    <div
                      style={{
                        position: 'absolute',
                        left: c.vurgu.x - 10,
                        top: c.vurgu.y - 10,
                        width: c.vurgu.w + 20,
                        height: c.vurgu.h + 20,
                        borderRadius: 14,
                        border: '2.5px solid rgba(59,130,246,0.9)',
                        boxShadow: '0 0 0 6px rgba(59,130,246,0.18), 0 0 40px rgba(59,130,246,0.45)',
                        opacity: interpolate(frame - c.baslangic, [10, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
                      }}
                    />
                  )}
                  {c.imlec && <Imlec yol={c.imlec.yol} tiklama={c.imlec.tiklama} boyut={34} />}
                </Ekran>
              </div>
            );
          })}
        </div>
      </div>

      {/* bölüm ilerlemesi */}
      <div style={{position: 'absolute', left: 100, right: 100, bottom: 46, height: 2, background: 'rgba(148,163,184,0.14)', borderRadius: 2}}>
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, ((sira - 1 + Math.min(1, frame / sure)) / toplam) * 100)}%`,
            background: 'linear-gradient(90deg, rgba(37,99,235,0.7), rgba(59,130,246,1))',
            borderRadius: 2,
            boxShadow: '0 0 12px rgba(59,130,246,0.6)',
          }}
        />
      </div>
      <div style={{position: 'absolute', left: 100, bottom: 62, fontFamily: T.posta, fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', color: T.metinCok}}>
        ÖZELLİKLER
      </div>

      {/* numara göstergesi */}
      <div
        style={{
          position: 'absolute',
          right: 96,
          top: 74,
          fontFamily: T.posta,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '0.16em',
          color: T.metinCok,
        }}
      >
        {ozellik.no} / 06
      </div>
    </AbsoluteFill>
  );
};
