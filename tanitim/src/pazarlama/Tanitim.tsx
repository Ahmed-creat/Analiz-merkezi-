import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {
  AcikZemin,
  Anlati,
  Baslik,
  Etiket,
  Gren,
  KoyuZemin,
  Marka,
  MarkaKose,
  Pencere,
  yasam,
  yum,
} from './parcalar';
import {UnutmaEgrisi} from './egri';

/* ================================================================== */
/* ZAMAN ÇİZELGESİ (kare @30fps)                                      */
/* ================================================================== */
export const SURE = {
  problem: 210, // 0–7
  unutma: 420, // 7–21
  hatirlama: 300, // 21–31
  deneme: 390, // 31–44
  oncelik: 330, // 44–55
  calis: 480, // 55–71
  hafiza: 390, // 72–85
  kapanis: 300, // 85–95
};

export const TANITIM_TOPLAM =
  SURE.problem +
  SURE.unutma +
  SURE.hatirlama +
  SURE.deneme +
  SURE.oncelik +
  SURE.calis +
  SURE.hafiza +
  SURE.kapanis;

const B = {
  problem: 0,
  unutma: SURE.problem,
  hatirlama: SURE.problem + SURE.unutma,
  deneme: SURE.problem + SURE.unutma + SURE.hatirlama,
  oncelik: SURE.problem + SURE.unutma + SURE.hatirlama + SURE.deneme,
  calis: SURE.problem + SURE.unutma + SURE.hatirlama + SURE.deneme + SURE.oncelik,
  hafiza: SURE.problem + SURE.unutma + SURE.hatirlama + SURE.deneme + SURE.oncelik + SURE.calis,
  kapanis:
    SURE.problem + SURE.unutma + SURE.hatirlama + SURE.deneme + SURE.oncelik + SURE.calis + SURE.hafiza,
};

/* kamera ara değeri */
const kam = (
  f: number,
  basla: number,
  sure: number,
  a: {s: number; cx: number; cy: number},
  b: {s: number; cx: number; cy: number},
) => {
  const p = yum((f - basla) / sure);
  return {
    s: a.s + (b.s - a.s) * p,
    cx: a.cx + (b.cx - a.cx) * p,
    cy: a.cy + (b.cy - a.cy) * p,
  };
};

/* ================================================================== */
/* SAHNE 1 · PROBLEM                                                  */
/* ================================================================== */
const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const g1 = yum((f - 8) / 16);
  const x1 = yum((f - 66) / 14);
  const b1 = {op: Math.min(g1, 1 - x1), y: (1 - g1) * 26 - x1 * 120, blur: (1 - g1) * 5};
  const g2 = yum((f - 72) / 14);
  const x2 = yum((f - 138) / 12);
  const b2 = {op: Math.min(g2, 1 - x2), y: (1 - g2) * 120 - x2 * 120, blur: (1 - g2) * 5};
  const g3 = yum((f - 144) / 16);
  const b3 = {op: g3, y: (1 - g3) * 90, blur: (1 - g3) * 5};

  return (
    <AbsoluteFill>
      <KoyuZemin />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '110px 110px',
          transform: `translateY(${f * 0.3}px)`,
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 10%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 10%, transparent 72%)',
        }}
      />
      <MarkaKose op={yum((f - 4) / 20)} />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            position: 'absolute',
            opacity: b1.op,
            transform: `translateY(${b1.y}px)`,
            filter: `blur(${b1.blur}px)`,
            textAlign: 'center',
          }}
        >
          <div style={{fontSize: 104, fontWeight: 800, letterSpacing: -4, color: '#F3F7FF', lineHeight: 1.05}}>
            Çok çalışıyorsun.
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            opacity: b2.op,
            transform: `translateY(${b2.y}px)`,
            filter: `blur(${b2.blur}px)`,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 22,
          }}
        >
          <div style={{fontSize: 118, fontWeight: 800, letterSpacing: -5, color: '#FBBF24', lineHeight: 1.02}}>
            Net artmıyor.
          </div>
          <div style={{fontSize: 32, fontWeight: 600, color: '#9FB0CC'}}>Aynı konular. Aynı hatalar.</div>
        </div>

        <div
          style={{
            position: 'absolute',
            opacity: b3.op,
            transform: `translateY(${b3.y}px)`,
            filter: `blur(${b3.blur}px)`,
            textAlign: 'center',
          }}
        >
          <div style={{fontSize: 42, fontWeight: 600, letterSpacing: -0.8, color: '#B8C7E2', lineHeight: 1.35}}>
            Sorun yalnızca ne kadar çalıştığın değil;
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 66,
              fontWeight: 800,
              letterSpacing: -2.6,
              color: '#FFFFFF',
              lineHeight: 1.18,
            }}
          >
            <span style={{color: '#FBBF24'}}>neyi</span>, <span style={{color: '#93C5FD'}}>neden</span> ve{' '}
            <span style={{color: '#67E8F9'}}>ne zaman</span> çalıştığın.
          </div>
        </div>
      </AbsoluteFill>
      <Gren />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* SAHNE 2 · UNUTMA EĞRİSİ + GERÇEK HAFIZA EKRANI                     */
/* ================================================================== */
const Unutma: React.FC = () => {
  const f = useCurrentFrame();
  const bas = yasam(f, 4, SURE.unutma, 16, 14);
  const t1 = yasam(f, 26, 190, 16, 12);
  const t2 = yasam(f, 186, 300, 16, 12);

  const panelP = yum((f - 214) / 66);
  const panelOp = yum((f - 206) / 24);
  const altYazi = yum((f - 292) / 22);
  const dx = (1 - panelP) * (640 - 960);
  const dy = (1 - panelP) * (450 - 545);
  const olcek = 0.62 + 0.38 * panelP;

  return (
    <AbsoluteFill>
      <KoyuZemin isik="sag" />
      <MarkaKose op={yum((f - 8) / 20)} />

      <div style={{position: 'absolute', left: 118, top: 196, opacity: 1 - yum((f - 240) / 30)}}>
        <Etiket op={bas.op} renk="#7FA8F5">
          1885 · Hermann Ebbinghaus · Unutma eğrisi
        </Etiket>
      </div>

      {/* grafik */}
      <div
        style={{
          position: 'absolute',
          left: 116,
          top: 272,
          transformOrigin: 'top left',
          opacity: 1 - yum((f - 232) / 34),
        }}
      >
        <UnutmaEgrisi f={f} tabanBasla={26} tekrarBasla={122} gen={1000} />
      </div>

      {/* grafiğin sağındaki anlatım */}
      <div style={{position: 'absolute', left: 1180, top: 268, width: 640}}>
        <div
          style={{
            position: 'absolute',
            opacity: t1.op,
            transform: `translateY(${t1.y}px)`,
            filter: `blur(${t1.blur}px)`,
          }}
        >
          <div style={{fontSize: 62, fontWeight: 800, letterSpacing: -2.4, color: '#F3F7FF', lineHeight: 1.14}}>
            Bilgi zamanla
            <br />
            <span style={{color: '#FBBF24'}}>unutulur.</span>
          </div>
          <div style={{marginTop: 24, fontSize: 24, fontWeight: 550, color: '#8FA1C0', lineHeight: 1.5}}>
            Ebbinghaus'un 1885'te yaptığı bellek deneylerinde, öğrenilen bilginin büyük bölümü ilk
            günlerde kayboldu.
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            opacity: t2.op,
            transform: `translateY(${t2.y}px)`,
            filter: `blur(${t2.blur}px)`,
          }}
        >
          <div style={{fontSize: 56, fontWeight: 800, letterSpacing: -2, color: '#FFFFFF', lineHeight: 1.16}}>
            Aralıklı tekrar,
            <br />
            <span style={{color: '#7FB4FF'}}>hatırlamayı destekler.</span>
          </div>
          <div style={{marginTop: 24, fontSize: 23, fontWeight: 550, color: '#8FA1C0', lineHeight: 1.5}}>
            Aynı bilgiyi artan aralıklarla tekrar etmek, tek seferde çalışmaya göre daha kalıcı
            öğrenme sağlar.
          </div>
          <div style={{marginTop: 26, display: 'flex', gap: 8}}>
            {[1, 3, 7, 14, 28].map((g, i) => {
              const a = yum((f - 206 - i * 9) / 12);
              return (
                <div
                  key={g}
                  style={{
                    opacity: a,
                    transform: `translateY(${(1 - a) * 12}px)`,
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: 'rgba(96,165,250,0.14)',
                    border: '1px solid rgba(96,165,250,0.34)',
                    color: '#DCEAFF',
                    fontSize: 19,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {g}. gün
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* gerçek uygulama ekranı: grafiğin içinden büyüyerek açılır */}
      <div
        style={{
          position: 'absolute',
          left: 370,
          top: 213,
          opacity: panelOp,
          transform: `translate(${dx}px, ${dy}px) scale(${olcek})`,
          transformOrigin: 'center center',
        }}
      >
        <Pencere
          kaynak={{tip: 'video', basla: 1384}}
          hiz={0.55}
          genislik={1180}
          yukseklik={664}
          s={0.9 + 0.05 * panelP}
          cx={590 / (0.9 + 0.05 * panelP)}
          cy={600}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 56,
          textAlign: 'center',
          opacity: altYazi,
          transform: `translateY(${(1 - altYazi) * 12}px)`,
        }}
      >
        <div style={{fontSize: 29, fontWeight: 650, color: '#E7EEFC'}}>
          Analiz Merkezi, tekrar zamanlarını senin için takip eder.
        </div>
        <div style={{marginTop: 8, fontSize: 20, fontWeight: 550, color: '#7C8BA8'}}>
          1 · 3 · 7 · 14 · 28. gün · tekrar günü geldiğinde kartlar zorunlu
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 54,
          bottom: 44,
          fontSize: 15,
          fontWeight: 550,
          color: '#5E6E8C',
          opacity: yum((f - 60) / 24) * (1 - yum((f - 236) / 28)),
        }}
      >
        Ebbinghaus (1885) deneylerinden ölçülen değerler; kişiye ve konuya göre değişebilir.
      </div>
      <Gren />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* SAHNE 3 · AKTİF HATIRLAMA + GERÇEK KISA KONTROL                    */
/* ================================================================== */
const Hatirlama: React.FC = () => {
  const f = useCurrentFrame();
  const t = yasam(f, 4, 200, 14, 12);
  const okuma = yum((f - 20) / 34);
  const sinama = yum((f - 36) / 38);
  const panelP = yum((f - 116) / 60);
  const panelOp = yum((f - 108) / 22);
  const altYazi = yum((f - 210) / 20);
  const dx = (1 - panelP) * (1180 - 960);
  const dy = (1 - panelP) * (430 - 545);

  const cubuk = (
    oran: number,
    p: number,
    renk: string,
    etiket: string,
    deger: string,
    xPoz: number,
    yaziRenk?: string,
  ) => (
    <div
      style={{
        position: 'absolute',
        left: xPoz,
        bottom: 0,
        width: 210,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          fontSize: 38,
          fontWeight: 800,
          letterSpacing: -1.4,
          color: yaziRenk || renk,
          opacity: p,
          transform: `translateY(${(1 - p) * 12}px)`,
        }}
      >
        {deger}
      </div>
      <div
        style={{
          width: 190,
          height: 500 * oran * (0.30 + 0.70 * p),
          borderRadius: '12px 12px 3px 3px',
          background: renk,
          boxShadow: `0 20px 50px ${renk}44`,
          opacity: 0.92,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0))',
          }}
        />
      </div>
      <div style={{fontSize: 21, fontWeight: 650, color: '#9AABC8', whiteSpace: 'nowrap'}}>{etiket}</div>
    </div>
  );

  return (
    <AbsoluteFill>
      <KoyuZemin isik="sol" />
      <MarkaKose op={yum((f - 6) / 20)} />

      <div style={{position: 'absolute', left: 116, top: 150, width: 810, opacity: t.op, transform: `translateY(${t.y}px)`}}>
        <Etiket op={t.op} renk="#7FA8F5">
          Aktif hatırlama · test etkisi
        </Etiket>
        <div style={{marginTop: 30}}>
          <Baslik
            satirlar={['Okumak yeterli değil.', 'Hatırladığını kanıtla.']}
            f={f}
            basla={12}
            boyut={66}
            renk="#F3F7FF"
          />
        </div>
        <div style={{marginTop: 26, fontSize: 24, fontWeight: 550, color: '#93A4C4', lineHeight: 1.5}}>
          Bir hafta sonra hatırlanan bilgi: kendini sınayan öğrencide, aynı süre tekrar okuyan
          öğrenciye göre belirgin biçimde daha yüksek.
        </div>
        <div style={{marginTop: 22, fontSize: 17, fontWeight: 550, color: '#6C7C99', lineHeight: 1.4}}>
          Roediger &amp; Karpicke (2006), Psychological Science · deneysel değerler, kişiye göre değişir
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 1080,
          top: 250,
          width: 700,
          height: 530,
          opacity: 1 - yum((f - 140) / 26),
        }}
      >
        {cubuk(0.4, okuma, '#56657E', 'Tekrar okuma', '%40', 30, '#A9B6CC')}
        {cubuk(0.61, sinama, '#3B82F6', 'Kendini sınama', '%61', 370)}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 370,
          top: 213,
          opacity: panelOp,
          transform: `translate(${dx}px, ${dy}px) scale(${0.62 + 0.38 * panelP})`,
          transformOrigin: 'center center',
        }}
      >
        <Pencere
          kaynak={{tip: 'video', basla: 893}}
          hiz={1.35}
          genislik={1180}
          yukseklik={664}
          s={0.9}
          cx={1020}
          cy={520}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 54,
          textAlign: 'center',
          opacity: altYazi,
          transform: `translateY(${(1 - altYazi) * 12}px)`,
        }}
      >
        <div style={{fontSize: 30, fontWeight: 650, color: '#E7EEFC'}}>
          Beş soruluk kısa kontrol — geçemezsen konu kapanmaz.
        </div>
      </div>
      <Gren />
      <AbsoluteFill style={{background: '#FBFCFE', opacity: yum((f - 286) / 14)}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* ORTAK: YOLCULUK SAHNESİ                                            */
/* ================================================================== */
const BOLUM_SAYISI = 7;

const Yolculuk: React.FC<{
  baslaKare: number;
  hiz?: number;
  sure: number;
  kamA: {s: number; cx: number; cy: number};
  kamB: {s: number; cx: number; cy: number};
  kamBasla?: number;
  kamSure?: number;
  bolumler: {basla: number; metin: string}[];
  cumleler: {basla: number; bit: number; metin: string}[];
  son?: 'acik' | 'koyu';
}> = ({baslaKare, hiz = 1, sure, kamA, kamB, kamBasla = 0, kamSure, bolumler, cumleler, son}) => {
  const f = useCurrentFrame();
  const k = kam(f, kamBasla, kamSure ?? sure, kamA, kamB);
  const g = yum((f - 2) / 12);
  const c = 1 - yum((f - (sure - 10)) / 10);
  const aktif = bolumler.reduce((acc, bol, i) => (f >= bol.basla ? i : acc), 0);
  const etiket = bolumler[aktif].metin;
  const no = parseInt(etiket.slice(0, 2), 10) || 1;

  return (
    <AbsoluteFill style={{opacity: Math.min(g, c)}}>
      <AcikZemin />
      <div style={{position: 'absolute', left: 200, top: 74}}>
        <Pencere kaynak={{tip: 'video', basla: baslaKare}} hiz={hiz} genislik={1520} yukseklik={800} s={k.s} cx={k.cx} cy={k.cy} />
      </div>
      <MarkaKose op={1} koyu={false} boyut={30} />
      <Anlati f={f} etiket={etiket} cumleler={cumleler} genislik={790} sol={64} alt={44} />
      {/* bölüm göstergesi */}
      <div
        style={{
          position: 'absolute',
          right: 66,
          bottom: 58,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
        }}
      >
        {Array.from({length: BOLUM_SAYISI}).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === no - 1 ? 42 : 22,
              height: 4,
              borderRadius: 2,
              background: i === no - 1 ? '#1D4ED8' : i < no - 1 ? 'rgba(29,78,216,0.34)' : 'rgba(11,18,32,0.14)',
            }}
          />
        ))}
      </div>
      <Gren koyu={false} op={0.26} />
      {son && (
        <AbsoluteFill
          style={{
            background: son === 'acik' ? '#FBFCFE' : '#06090F',
            opacity: yum((f - (sure - 15)) / 15),
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* SAHNE 4 · DENEME                                                   */
/* ================================================================== */
const Deneme: React.FC = () => (
  <Yolculuk
    baslaKare={164}
    hiz={0.62}
    sure={SURE.deneme}
    kamA={{s: 0.86, cx: 760 / 0.86, cy: 450}}
    kamB={{s: 0.9, cx: 760 / 0.9, cy: 470}}
    bolumler={[
      {basla: 0, metin: '01 · Deneme girişi'},
      {basla: 246, metin: '02 · Ders tablosu'},
    ]}
    cumleler={[
      {basla: 14, bit: 128, metin: 'Okulizyon bağlantısı ya da elle giriş.'},
      {basla: 134, bit: 250, metin: 'Ders ders doğru, yanlış ve boş.'},
      {basla: 256, bit: SURE.deneme, metin: 'Her yanlış, konusu ve nedeniyle kaydedilir.'},
    ]}
  />
);

/* ================================================================== */
/* SAHNE 5 · ÖNCELİK                                                  */
/* ================================================================== */
const Oncelik: React.FC = () => (
  <Yolculuk
    baslaKare={400}
    hiz={0.64}
    sure={SURE.oncelik}
    kamA={{s: 0.88, cx: 760 / 0.88, cy: 440}}
    kamBasla={90}
    kamSure={200}
    kamB={{s: 0.92, cx: 760 / 0.92, cy: 410}}
    bolumler={[{basla: 0, metin: '03 · Yanlışın nedeni'}]}
    cumleler={[
      {basla: 12, bit: 150, metin: 'Her yanlış için konu ve neden: konuyu bilmiyordum, anlamadım, işlem hatası, dikkatsizlik.'},
      {basla: 158, bit: SURE.oncelik, metin: 'Kaydedildiği an Acil Çalışılacaklar listesi kurulur.'},
    ]}
  />
);

/* ================================================================== */
/* SAHNE 6 · ÇALIŞMA                                                  */
/* ================================================================== */
const Calis: React.FC = () => (
  <Yolculuk
    baslaKare={618}
    hiz={0.75}
    sure={SURE.calis}
    kamA={{s: 0.86, cx: 760 / 0.86, cy: 420}}
    kamB={{s: 0.92, cx: 760 / 0.92, cy: 450}}
    bolumler={[
      {basla: 0, metin: '04 · Acil Çalışılacaklar'},
      {basla: 118, metin: '05 · Çalışma'},
      {basla: 350, metin: '06 · Kısa kontrol'},
    ]}
    cumleler={[
      {basla: 12, bit: 118, metin: 'En çok net getirecek konu en üstte; sıra her gün yenilenir.'},
      {basla: 126, bit: 340, metin: 'Çalış: beş adım — ön test, aktif çalışma, çözümlü örnek, karmaşık pratik, kısa kontrol.'},
      {basla: 348, bit: SURE.calis, metin: 'Adım bitmeden sonraki açılmaz; geçemezsen konu kapanmaz.'},
    ]}
  />
);

/* ================================================================== */
/* SAHNE 7 · HAFIZA                                                   */
/* ================================================================== */
const Hafiza: React.FC = () => (
  <Yolculuk
    baslaKare={1500}
    hiz={0.6}
    sure={SURE.hafiza}
    kamA={{s: 0.88, cx: 760 / 0.88, cy: 560}}
    kamB={{s: 0.94, cx: 760 / 0.94, cy: 600}}
    bolumler={[{basla: 0, metin: '07 · Hafıza'}]}
    cumleler={[
      {basla: 14, bit: 146, metin: 'Konu tamamlandığında hafıza takibi başlar.'},
      {basla: 154, bit: 292, metin: 'Tekrar takvimi: 1 · 3 · 7 · 14 · 28. gün.'},
      {basla: 300, bit: SURE.hafiza, metin: 'Tekrar günü geldiyse kartlar zorunlu: hatırla, işaretle, ilerle.'},
    ]}
  />
);

/* ================================================================== */
/* SAHNE 8 · BİRLEŞME + KAPANIŞ                                       */
/* ================================================================== */
const ASAMALAR = [
  {ad: 'Ölç', src: 'promo/k7.0.png', cx: 620, cy: 300},
  {ad: 'Teşhis', src: 'promo/k16.5.png', cx: 780, cy: 330},
  {ad: 'Plan', src: 'promo/k21.0.png', cx: 700, cy: 430},
  {ad: 'Kanıtla', src: 'promo/k33.0.png', cx: 1010, cy: 340},
  {ad: 'Tekrar', src: 'promo/k63.0.png', cx: 800, cy: 520},
];

/* aşama kartının içinde gösterilen gerçek ekran kırpması */
const KART_G = 352;
const KART_Y = 220;
const KART_S = 0.5;

const Kapanis: React.FC = () => {
  const f = useCurrentFrame();
  const kartGeri = 1 - yum((f - 184) / 24);
  const logoP = yum((f - 196) / 16);
  const mesaj = yum((f - 208) / 14);
  const slogan = yum((f - 218) / 14);
  const url = yum((f - 226) / 12);
  const karart = yum((f - 288) / 12);

  return (
    <AbsoluteFill>
      <KoyuZemin isik="sag" />

      <div style={{position: 'absolute', left: 0, right: 0, top: 186, textAlign: 'center', opacity: kartGeri}}>
        <Etiket op={yum((f + 10) / 12)} renk="#7FA8F5">
          Tek sistem
        </Etiket>
        <div
          style={{
            marginTop: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          {ASAMALAR.map((a, i) => {
            const p = yum((f + 12 - i * 8) / 14);
            return (
              <div key={a.ad} style={{display: 'flex', alignItems: 'center', gap: 16}}>
                <div
                  style={{
                    fontSize: 44,
                    fontWeight: 800,
                    letterSpacing: -1.6,
                    color: '#FFFFFF',
                    opacity: p,
                    transform: `translateY(${(1 - p) * 14}px)`,
                  }}
                >
                  {a.ad}
                </div>
                {i < ASAMALAR.length - 1 && (
                  <div style={{fontSize: 26, color: '#3B82F6', opacity: p}}>›</div>
                )}
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
          top: 468,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          opacity: kartGeri,
          transform: `scale(${0.90 + 0.10 * kartGeri})`,
        }}
      >
        {ASAMALAR.map((a, i) => {
          const p = yum((f - 24 - i * 18) / 20);
          return (
            <div
              key={a.ad}
              style={{
                width: KART_G,
                opacity: p,
                transform: `translateY(${(1 - p) * 16}px)`,
              }}
            >
              <div
                style={{
                  width: KART_G,
                  height: KART_Y,
                  borderRadius: 14,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: '#F5F7FB',
                  position: 'relative',
                  boxShadow: '0 22px 50px rgba(0,0,0,0.35)',
                }}
              >
                <Img
                  src={staticFile(a.src)}
                  style={{
                    position: 'absolute',
                    left: KART_G / 2 - a.cx * KART_S,
                    top: KART_Y / 2 - a.cy * KART_S,
                    width: 1920 * KART_S,
                    height: 1080 * KART_S,
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 12,
                  textAlign: 'center',
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: 1.6,
                  textTransform: 'uppercase',
                  color: '#8FA1C0',
                }}
              >
                {a.ad}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 792,
          textAlign: 'center',
          opacity: yum((f - 112) / 20) * kartGeri,
          transform: `translateY(${(1 - yum((f - 112) / 20)) * 12}px)`,
        }}
      >
        <div style={{fontSize: 34, fontWeight: 650, letterSpacing: -0.6, color: '#DCE6FA'}}>
          Bilimi, günlük çalışma planına çevirir.
        </div>
      </div>

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: Math.min(logoP, 1)}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
            <div style={{transform: `scale(${0.8 + 0.2 * logoP})`}}>
              <Marka boyut={126} />
            </div>
            <div style={{fontSize: 78, fontWeight: 800, letterSpacing: -3.2, color: '#FFFFFF'}}>Analiz Merkezi</div>
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 36,
              fontWeight: 650,
              letterSpacing: -0.6,
              color: '#DCE6FA',
              opacity: mesaj,
              transform: `translateY(${(1 - mesaj) * 14}px)`,
            }}
          >
            Bilimi, günlük çalışma planına çevirir.
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: -1,
              color: '#60A5FA',
              opacity: slogan,
              transform: `translateY(${(1 - slogan) * 14}px)`,
            }}
          >
            Her yanlış, bir sonraki adım.
          </div>
          <div
            style={{
              marginTop: 38,
              padding: '15px 30px',
              borderRadius: 999,
              background: '#1D4ED8',
              color: '#FFFFFF',
              fontSize: 25,
              fontWeight: 700,
              boxShadow: '0 18px 44px rgba(29,78,216,0.36)',
              opacity: url,
              transform: `translateY(${(1 - url) * 12}px)`,
            }}
          >
            analiz-merkezi.vercel.app
          </div>
        </div>
      </AbsoluteFill>

      <Gren />
      <AbsoluteFill style={{background: '#06090F', opacity: karart}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* ANA KOMPOZİSYON                                                    */
/* ================================================================== */
export const Tanitim: React.FC = () => (
  <AbsoluteFill style={{background: '#06090F', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden'}}>
    <Audio
      src={staticFile('muzik.mp3')}
      volume={(f: number) => {
        const giris = Math.min(1, f / 45);
        const cikis = Math.min(1, Math.max(0, (TANITIM_TOPLAM - f) / 90));
        return 0.5 * giris * cikis;
      }}
    />
    <Sequence from={B.problem} durationInFrames={SURE.problem}>
      <Problem />
    </Sequence>
    <Sequence from={B.unutma} durationInFrames={SURE.unutma}>
      <Unutma />
    </Sequence>
    <Sequence from={B.hatirlama} durationInFrames={SURE.hatirlama}>
      <Hatirlama />
    </Sequence>
    <Sequence from={B.deneme} durationInFrames={SURE.deneme}>
      <Deneme />
    </Sequence>
    <Sequence from={B.oncelik} durationInFrames={SURE.oncelik}>
      <Oncelik />
    </Sequence>
    <Sequence from={B.calis} durationInFrames={SURE.calis}>
      <Calis />
    </Sequence>
    <Sequence from={B.hafiza} durationInFrames={SURE.hafiza}>
      <Hafiza />
    </Sequence>
    <Sequence from={B.kapanis} durationInFrames={SURE.kapanis}>
      <Kapanis />
    </Sequence>
  </AbsoluteFill>
);
