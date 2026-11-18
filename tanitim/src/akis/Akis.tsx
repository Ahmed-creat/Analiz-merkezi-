import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

/* Gerçek uygulama akışı: kare kare yakalanmış video + kamera + imleç + altyazı. */

type Olay = {kare: number; ad: string; altyazi: string; adim: number};
type Tik = {kare: number; x: number; y: number; ad: string};
type AkisVeri = {kare: number; olaylar: Olay[]; imlec: [number, number][]; tikler: Tik[]};

const ADIM_ADI: Record<number, string> = {
  1: 'DENEMELERİM',
  2: 'DENEME GİRİŞİ',
  3: 'ANALİZ',
  4: 'ACİL ÇALIŞILACAKLAR',
  5: 'KISA KONTROL',
  6: 'TEKRAR & HAFIZA',
};

// olay adı → kamera: s = yakınlaştırma, ox/oy = sahne kaydırması (piksel)
// Kenar boşluğu kalmaması için odak noktası fx = 960/s + ox, fy = 540/s + oy seçilir.
const KAMERA: Record<string, {s: number; ox: number; oy: number}> = {
  acilis: {s: 1.05, ox: 0, oy: 0},
  'ana-sayfa-grafik': {s: 1.12, ox: 20, oy: 10},
  denemelerim: {s: 1.1, ox: 10, oy: 0},
  'deneme-formu': {s: 1.18, ox: -30, oy: -10},
  'hata-satirlari': {s: 1.18, ox: -30, oy: 30},
  'deneme-kayit': {s: 1.12, ox: 0, oy: 10},
  'acil-liste': {s: 1.14, ox: -10, oy: 0},
  calis: {s: 1.16, ox: 0, oy: 0},
  adimlar: {s: 1.16, ox: 0, oy: 20},
  'kisa-kontrol': {s: 1.12, ox: 0, oy: 0},
  neden: {s: 1.12, ox: 0, oy: 20},
  'konu-tamam': {s: 1.12, ox: 0, oy: 0},
  hafiza: {s: 1.14, ox: 0, oy: -10},
  bildirim: {s: 1.1, ox: 0, oy: 0},
  tekrar: {s: 1.14, ox: -20, oy: 10},
  'hafiza-yenilendi': {s: 1.12, ox: 0, oy: 0},
  kapanis: {s: 1.04, ox: 0, oy: 0},
};

const yumusak = (t: number) => {
  const k = Math.min(1, Math.max(0, t));
  return k * k * (3 - 2 * k);
};

export const Akis: React.FC<{fps: number}> = () => {
  const frame = useCurrentFrame();
  const [veri, setVeri] = useState<AkisVeri | null>(null);
  const [handle] = useState(() => delayRender('akış verisi yükleniyor'));

  useEffect(() => {
    fetch(staticFile('kayit/akis.json'))
      .then((r) => r.json())
      .then((d: AkisVeri) => {
        setVeri(d);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);

  if (!veri) return <AbsoluteFill style={{backgroundColor: '#0B1220'}} />;

  const olaylar = veri.olaylar;
  // içinde bulunduğumuz olay
  let idx = 0;
  for (let i = 0; i < olaylar.length; i++) if (olaylar[i].kare <= frame) idx = i;
  const suanki = olaylar[idx];
  const onceki = olaylar[Math.max(0, idx - 1)];
  const hedef = KAMERA[suanki.ad] || KAMERA.acilis;

  // kamera: olay değişiminde 26 karede yumuşak geçiş
  const gecis = yumusak((frame - olaylar[idx].kare) / 26);
  const ilk = KAMERA[onceki.ad] || KAMERA.acilis;
  const s = ilk.s + (hedef.s - ilk.s) * gecis;
  const ox = ilk.ox + (hedef.ox - ilk.ox) * gecis;
  const oy = ilk.oy + (hedef.oy - ilk.oy) * gecis;
  // tx/ty doğrudan çözülür: kenar boşluğu oluşmaz, sadece istenen kayma kadar kırpılır
  const tx = 960 * (s - 1) - ox * s;
  const ty = 540 * (s - 1) - oy * s;

  const imlec = veri.imlec[Math.min(frame, veri.imlec.length - 1)] || [960, 540];

  // altyazı görünürlüğü: olaydan 10 kare sonra gelir, sonraki olaydan 6 kare önce gider
  const sonraki = olaylar[idx + 1];
  const giris = interpolate(frame, [suanki.kare + 4, suanki.kare + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cikis = sonraki ? interpolate(frame, [sonraki.kare - 8, sonraki.kare - 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const alfa = suanki.altyazi ? giris * cikis : 0;
  const kayma = (1 - giris) * 16;

  // tık dalgası
  const tikler = veri.tikler.filter((t) => frame >= t.kare && frame - t.kare < 16);

  // akış ilerlemesi
  const ilerleme = Math.min(1, frame / (veri.kare - 1));

  return (
    <AbsoluteFill style={{backgroundColor: '#EDF2FA', overflow: 'hidden'}}>
      {/* video + imleç: aynı kamera dönüşümü içinde */}
      <AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: 'center'}}>
        <OffthreadVideo src={staticFile('kayit/kayit.mp4')} muted />
        {/* imleç */}
        <div
          style={{
            position: 'absolute',
            left: imlec[0],
            top: imlec[1],
            transform: `translate(-4px, -2px) scale(${1 / s})`,
            transformOrigin: 'top left',
            pointerEvents: 'none',
          }}
        >
          <svg width="34" height="38" viewBox="0 0 34 38" style={{filter: 'drop-shadow(0 3px 6px rgba(15,27,51,.35))'}}>
            <path d="M4 2 L4 30 L11.5 23.2 L16.4 34 L21.2 31.9 L16.3 21.4 L26 21.4 Z" fill="#0F1B33" stroke="#FFFFFF" strokeWidth="2.2" strokeLinejoin="round" />
          </svg>
        </div>
        {/* tık dalgaları */}
        {tikler.map((t) => {
          const yas = frame - t.kare;
          const r = 10 + yas * 4.4;
          const op = Math.max(0, 0.75 * (1 - yas / 16));
          return (
            <div
              key={t.kare}
              style={{
                position: 'absolute',
                left: t.x - r,
                top: t.y - r,
                width: r * 2,
                height: r * 2,
                borderRadius: '50%',
                border: '3px solid rgba(37,99,235,' + op + ')',
                background: 'rgba(37,99,235,' + op * 0.16 + ')',
                pointerEvents: 'none',
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* altyazı kartı — uygulamanın sağ boşluğunda */}
      <div
        style={{
          position: 'absolute',
          right: 60,
          bottom: 74,
          width: 620,
          padding: '22px 26px 24px',
          borderRadius: 20,
          background: 'rgba(255,255,255,0.96)',
          border: '1px solid rgba(37,99,235,0.16)',
          boxShadow: '0 18px 44px rgba(20,38,74,0.16)',
          opacity: alfa,
          transform: `translateY(${kayma}px)`,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10}}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg,#2563EB,#3B82F6)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 17,
            }}
          >
            {suanki.adim || '·'}
          </div>
          <div style={{fontSize: 15, fontWeight: 800, letterSpacing: 1.4, color: '#2563EB'}}>
            {ADIM_ADI[suanki.adim] || 'ANALİZ MERKEZİ'}
          </div>
        </div>
        <div style={{fontSize: 27, lineHeight: 1.32, fontWeight: 700, color: '#0F1B33'}}>{suanki.altyazi}</div>
      </div>

      {/* ilerleme çizgisi */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 5, background: 'rgba(37,99,235,0.12)'}}>
        <div style={{width: `${ilerleme * 100}%`, height: '100%', background: 'linear-gradient(90deg,#1D4ED8,#3B82F6,#22D3EE)'}} />
      </div>
    </AbsoluteFill>
  );
};

export const kullanilanEasing = Easing;
