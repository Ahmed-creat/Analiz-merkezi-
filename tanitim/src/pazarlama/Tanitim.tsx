import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {
  AcikZemin,
  Baslik,
  Cip,
  Etiket,
  Gren,
  KoyuZemin,
  Marka,
  Sayac,
  UygulamaEkrani,

  yasam,
  yum,
} from './parcalar';
import {UnutmaEgrisi} from './egri';

/* ------------------------------------------------------------------ */
/* zaman çizelgesi (kare @30fps)                                      */
/* ------------------------------------------------------------------ */
export const SURE = {
  kanca: 210,
  egri: 480,
  testEtkisi: 150,
  reveal: 160,
  ozellik: 204,
  rakamlar: 150,
  final: 230,
};
const OZELLIK_SAYISI = 6;
export const TANITIM_TOPLAM =
  SURE.kanca +
  SURE.egri +
  SURE.testEtkisi +
  SURE.reveal +
  SURE.ozellik * OZELLIK_SAYISI +
  SURE.rakamlar +
  SURE.final;

const B = {
  kanca: 0,
  egri: SURE.kanca,
  testEtkisi: SURE.kanca + SURE.egri,
  reveal: SURE.kanca + SURE.egri + SURE.testEtkisi,
  ozellik: SURE.kanca + SURE.egri + SURE.testEtkisi + SURE.reveal,
  rakamlar: SURE.kanca + SURE.egri + SURE.testEtkisi + SURE.reveal + SURE.ozellik * OZELLIK_SAYISI,
  final:
    SURE.kanca + SURE.egri + SURE.testEtkisi + SURE.reveal + SURE.ozellik * OZELLIK_SAYISI + SURE.rakamlar,
};

/* ------------------------------------------------------------------ */
/* 1 · KANCA                                                          */
/* ------------------------------------------------------------------ */
const Kanca: React.FC = () => {
  const f = useCurrentFrame();
  // bantlar üst üste binmeden, yukarı/aşağı kayarak yer değiştirir
  const g1 = yum((f - 6) / 16);
  const x1 = yum((f - 74) / 14);
  const b1 = {op: Math.min(g1, 1 - x1), y: (1 - g1) * 26 - x1 * 120, blur: (1 - g1) * 5};
  const g2 = yum((f - 80) / 14);
  const x2 = yum((f - 136) / 12);
  const b2 = {op: Math.min(g2, 1 - x2), y: (1 - g2) * 120 - x2 * 120, blur: (1 - g2) * 5};
  const g3 = yum((f - 146) / 16);
  const b3 = {op: g3, y: (1 - g3) * 120, blur: (1 - g3) * 5};

  return (
    <AbsoluteFill>
      <KoyuZemin />
      {/* yavaş kayan ızgara */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '110px 110px',
          transform: `translateY(${f * 0.35}px)`,
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 10%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 10%, transparent 72%)',
        }}
      />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
          {/* beat 1 */}
          <div
            style={{
              position: 'absolute',
              opacity: b1.op,
              transform: `translateY(${b1.y}px)`,
              filter: `blur(${b1.blur}px)`,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 26,
            }}
          >
            <div
              style={{
                fontSize: 104,
                fontWeight: 800,
                letterSpacing: -4,
                color: '#F3F7FF',
                lineHeight: 1.05,
              }}
            >
              Çok çalışıyorsun.
            </div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 600,
                color: '#93A4C4',
                letterSpacing: 0.4,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              774 soru · 5 deneme · 138 sayfa
            </div>
          </div>

          {/* beat 2 */}
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
            <div
              style={{
                fontSize: 118,
                fontWeight: 800,
                letterSpacing: -5,
                color: '#FBBF24',
                lineHeight: 1.02,
              }}
            >
              Net artmıyor.
            </div>
            <div style={{fontSize: 32, fontWeight: 600, color: '#9FB0CC', letterSpacing: 0.2}}>
              Aynı konular. Aynı hatalar.
            </div>
          </div>

          {/* beat 3 */}
          <div
            style={{
              position: 'absolute',
              opacity: b3.op,
              transform: `translateY(${b3.y}px)`,
              filter: `blur(${b3.blur}px)`,
              textAlign: 'center',
            }}
          >
            <div style={{fontSize: 78, fontWeight: 700, letterSpacing: -3, color: '#C8D6F0', lineHeight: 1.2}}>
              Sorun çalışmak değil.
            </div>
            <div style={{fontSize: 104, fontWeight: 800, letterSpacing: -4.5, color: '#FFFFFF', lineHeight: 1.15}}>
              Sorun, <span style={{color: '#60A5FA'}}>zamanlama.</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <Gren />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2 · UNUTMA EĞRİSİ                                                  */
/* ------------------------------------------------------------------ */
const Egri: React.FC = () => {
  const f = useCurrentFrame();
  const bas = yasam(f, 4, 480, 16, 12);
  const t1 = yasam(f, 18, 200, 16, 12);
  const t2 = yasam(f, 196, 300, 16, 12);
  const t3 = yasam(f, 296, 480, 18, 12);

  return (
    <AbsoluteFill>
      <KoyuZemin isik="sag" />
      <AbsoluteFill style={{padding: '86px 120px'}}>
        <div style={{opacity: bas.op, transform: `translateY(${bas.y}px)`}}>
          <Etiket op={bas.op} renk="#7FA8F5">
            1885 · Hermann Ebbinghaus · Unutma eğrisi
          </Etiket>
        </div>

        <div style={{position: 'absolute', left: 110, top: 250, transform: 'scale(1.07)', transformOrigin: 'top left'}}>
          <UnutmaEgrisi f={f} tabanBasla={30} tekrarBasla={268} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 126,
            top: 878,
            display: 'flex',
            gap: 34,
            opacity: yum((f - 320) / 16),
            fontSize: 20,
            fontWeight: 600,
            color: '#8090AB',
          }}
        >
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 10}}>
            <span style={{width: 26, height: 4, borderRadius: 2, background: '#F59E0B'}} /> tekrarsız
          </span>
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 10}}>
            <span style={{width: 26, height: 4, borderRadius: 2, background: '#60A5FA'}} /> aralıklı tekrarla
          </span>
        </div>

        {/* sağ kolon */}
        <div style={{position: 'absolute', left: 1300, top: 250, width: 500}}>
          <div
            style={{
              position: 'absolute',
              opacity: t1.op,
              transform: `translateY(${t1.y}px)`,
              filter: `blur(${t1.blur}px)`,
            }}
          >
            <div style={{fontSize: 60, fontWeight: 800, letterSpacing: -2.6, color: '#F3F7FF', lineHeight: 1.14}}>
              Bir kez öğrendiğinin
              <br />
              <span style={{color: '#FBBF24'}}>üçte ikisi</span>
              <br />
              24 saatte gider.
            </div>
            <div style={{marginTop: 26, fontSize: 24, fontWeight: 550, color: '#8FA1C0', lineHeight: 1.45}}>
              Ezber değil, biyoloji. Beyin, kullanılmayan bağlantıyı budar.
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
            <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
              <div style={{fontSize: 132, fontWeight: 800, letterSpacing: -6, color: '#FBBF24', lineHeight: 1}}>%33</div>
              <div style={{fontSize: 26, fontWeight: 650, color: '#94A7C6'}}>1. gün</div>
            </div>
            <div style={{marginTop: 18, fontSize: 30, fontWeight: 650, color: '#C6D5EF', lineHeight: 1.5}}>
              6. gün %25 · 31. gün %21
            </div>
            <div style={{marginTop: 22, fontSize: 24, fontWeight: 550, color: '#8FA1C0', lineHeight: 1.5}}>
              Yani sınavdan üç hafta önce çalıştığın konu, sınavda büyük ölçüde yok.
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              opacity: t3.op,
              transform: `translateY(${t3.y}px)`,
              filter: `blur(${t3.blur}px)`,
            }}
          >
            <div style={{fontSize: 26, fontWeight: 700, letterSpacing: 3.4, color: '#7FA8F5', textTransform: 'uppercase'}}>
              Aralıklı tekrar
            </div>
            <div style={{marginTop: 16, fontSize: 58, fontWeight: 800, letterSpacing: -2.2, color: '#FFFFFF', lineHeight: 1.12}}>
              Eğri yassılaşır.
              <br />
              <span style={{color: '#7FB4FF'}}>Bilgi kalır.</span>
            </div>
            <div style={{marginTop: 30, display: 'flex', gap: 7, alignItems: 'center'}}>
              {[1, 3, 7, 14, 28].map((g, i) => {
                const a = yum((f - 306 - i * 12) / 12);
                return (
                  <div
                    key={g}
                    style={{
                      opacity: a,
                      transform: `translateY(${(1 - a) * 14}px)`,
                      padding: '8px 11px',
                      borderRadius: 10,
                      background: 'rgba(96,165,250,0.14)',
                      border: '1px solid rgba(96,165,250,0.34)',
                      color: '#DCEAFF',
                      fontSize: 19,
                      fontWeight: 700,
                      fontVariantNumeric: 'tabular-nums',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {g}. gün
                  </div>
                );
              })}
            </div>
            <div style={{marginTop: 24, fontSize: 21, fontWeight: 550, color: '#7C8BA8'}}>
              Cepeda vd. 2006 meta-analizi · aralıklı tekrar
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <Gren />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 3 · TEST ETKİSİ                                                    */
/* ------------------------------------------------------------------ */
const TestEtkisi: React.FC = () => {
  const f = useCurrentFrame();
  const t = yasam(f, 6, 150, 16, 12);
  const okuma = yum((f - 22) / 38);
  const sinama = yum((f - 40) / 42);
  const dip = yasam(f, 96, 150, 14, 10);

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
        gap: 18,
      }}
    >
      <div
        style={{
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: -1.6,
          color: yaziRenk || renk,
          opacity: p,
          transform: `translateY(${(1 - p) * 12}px)`,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {deger}
      </div>
      <div
        style={{
          width: 190,
          height: 390 * oran * (0.35 + 0.65 * p) * (p > 0 ? 1 : 0),
          borderRadius: '14px 14px 3px 3px',
          background: renk,
          boxShadow: `0 20px 60px ${renk}44`,
          opacity: 0.92,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.32), rgba(255,255,255,0))',
          }}
        />
      </div>
      <div style={{fontSize: 22, fontWeight: 650, color: '#9AABC8', whiteSpace: 'nowrap'}}>{etiket}</div>
    </div>
  );

  return (
    <AbsoluteFill>
      <KoyuZemin isik="sol" />
      <AbsoluteFill style={{padding: '100px 130px'}}>
        <div style={{opacity: t.op, transform: `translateY(${t.y}px)`}}>
          <Etiket op={t.op} renk="#7FA8F5">
            Test etkisi · aktif hatırlama
          </Etiket>
          <div style={{marginTop: 34}}>
            <Baslik
              satirlar={[
                'Okumak unutturur.',
                <span key="s" style={{color: '#60A5FA'}}>
                  Sınamak hatırlatır.
                </span>,
              ]}
              f={f}
              basla={14}
              boyut={78}
              renk="#F3F7FF"
            />
          </div>
          <div style={{marginTop: 30, width: 720, fontSize: 27, fontWeight: 550, color: '#93A4C4', lineHeight: 1.5}}>
            Aynı süre, iki farklı çalışma. Bir hafta sonra hatırlanan bilgi:
          </div>
          <div style={{marginTop: 34, fontSize: 20, fontWeight: 550, color: '#6C7C99'}}>
            Roediger &amp; Karpicke, 2006 · Psychological Science
          </div>
        </div>

        <div style={{position: 'absolute', left: 880, top: 190, width: 760, height: 700}}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 1,
              background: 'rgba(255,255,255,0.16)',
            }}
          />
          {cubuk(0.4, okuma, '#56657E', 'Tekrar okuma', '%40', 70, '#A9B6CC')}
          {cubuk(0.61, sinama, '#3B82F6', 'Kendini sınama', '%61', 400)}
        </div>

        <div
          style={{
            position: 'absolute',
            left: 880,
            bottom: 96,
            width: 700,
            opacity: dip.op,
            transform: `translateY(${dip.y}px)`,
            fontSize: 26,
            fontWeight: 650,
            color: '#BFDBFE',
            textAlign: 'center',
          }}
        >
          Aynı süre. %50 daha fazla akılda kalan.
        </div>
      </AbsoluteFill>
      <Gren />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 4 · TANITIM / MARKA                                                */
/* ------------------------------------------------------------------ */
const Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const logo = yum((f - 4) / 22);
  const ad = yum((f - 16) / 22);
  const alt = yum((f - 30) / 22);
  const cipler = yum((f - 52) / 22);
  const cikis = 1 - yum((f - 148) / 12);

  return (
    <AbsoluteFill style={{opacity: cikis}}>
      <AcikZemin />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
          <div
            style={{
              transform: `scale(${0.6 + 0.4 * logo}) rotate(${(1 - logo) * -8}deg)`,
              opacity: logo,
            }}
          >
            <Marka boyut={132} />
          </div>
          <div
            style={{
              fontSize: 108,
              fontWeight: 800,
              letterSpacing: -4.5,
              color: '#0B1220',
              opacity: ad,
              transform: `translateX(${(1 - ad) * -22}px)`,
            }}
          >
            Analiz Merkezi
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 42,
            fontWeight: 600,
            letterSpacing: -1,
            color: '#3F5A83',
            opacity: alt,
            transform: `translateY(${(1 - alt) * 16}px)`,
            textAlign: 'center',
          }}
        >
          Denemelerini bir çalışma planına çevirir.
        </div>

        <div
          style={{
            marginTop: 62,
            display: 'flex',
            gap: 16,
            opacity: cipler,
            transform: `translateY(${(1 - cipler) * 18}px)`,
          }}
        >
          {['Okulizyon bağlantısı', 'Kök neden analizi', 'Beş adımlı çalışma', 'Hafıza takibi'].map(m => (
            <div
              key={m}
              style={{
                padding: '14px 24px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(37,99,235,0.16)',
                boxShadow: '0 12px 30px rgba(37,99,235,0.10)',
                fontSize: 22,
                fontWeight: 650,
                color: '#1B4B8F',
              }}
            >
              {m}
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <Gren koyu={false} op={0.35} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 5 · ÖZELLİK SAHNELERİ                                              */
/* ------------------------------------------------------------------ */
type OzellikAyari = {
  sira: string;
  etiket: string;
  baslik: string[];
  alt: string;
  cip: string;
  ekran: {src: string; cx: number; cy: number; s: number};
  ters?: boolean;
};

const OZELLIKLER: OzellikAyari[] = [
  {
    sira: '01 · DENEME GİRİŞİ',
    etiket: 'Denemelerim',
    baslik: ['Denemeyi gir.', 'Neti o hesaplar.'],
    alt: 'Ders ders doğru, yanlış, boş. Okulizyon’daki denemeler kendiliğinden gelir; net, sıralama ve ders başarısı anında çıkar.',
    cip: 'Okulizyon bağlantısı · otomatik',
    ekran: {src: 'promo/k7.0.png', cx: 915, cy: 385, s: 0.86},
  },
  {
    sira: '02 · KÖK NEDEN',
    etiket: 'Her yanlış: konu + neden',
    baslik: ['Her yanlış,', 'bir neden taşır.'],
    alt: 'Konu eksiği mi, işlem hatası mı, dikkatsizlik mi? Yanlışın nedenini işaretlersin; plan gerçek eksiğine göre kurulur.',
    cip: 'Konu + neden · her yanlış satırında',
    ekran: {src: 'promo/k16.5.png', cx: 660, cy: 330, s: 1.42},
    ters: true,
  },
  {
    sira: '03 · ÖNCELİK',
    etiket: 'Acil Çalışılacaklar',
    baslik: ['Sıradaki konu,', 'artık belli.'],
    alt: 'En çok net getirecek konu en üstte. Kaç kez yanlış yaptığın, hatanın türü ve konunun ağırlığı aynı listede tartılır.',
    cip: 'Her sabah yeniden sıralanır',
    ekran: {src: 'promo/k21.0.png', cx: 930, cy: 335, s: 0.86},
  },
  {
    sira: '04 · YOL HARİTASI',
    etiket: 'Çalış',
    baslik: ['Beş adım.', 'Teker teker.'],
    alt: 'Ön test, aktif çalışma, çözümlü örnek, kavram pratiği, kısa kontrol. Adım bitmeden sonraki açılmıyor.',
    cip: '“Çalıştım” demek yetmiyor',
    ekran: {src: 'promo/k29.5.png', cx: 985, cy: 470, s: 1.12},
    ters: true,
  },
  {
    sira: '05 · KISA KONTROL',
    etiket: 'Öğrenme kanıtı',
    baslik: ['Öğrendin mi?', 'Beş soru söyler.'],
    alt: 'Kontrol, konuyu bitirdiğin gün değil, tam zamanı geldiğinde. Geçemezsen konu kapanmıyor; eksik yer yeniden açılıyor.',
    cip: '5 soru · gerçek soru bankasından',
    ekran: {src: 'promo/k33.0.png', cx: 960, cy: 445, s: 1.55},
  },
  {
    sira: '06 · HAFIZA',
    etiket: 'Tekrar',
    baslik: ['Tam unutmadan', 'önce hatırlatır.'],
    alt: '1 · 3 · 7 · 14 · 28. gün. Tekrar günü geldiyse kart zorunlu. Hafıza gücün yükseldikçe aralıklar açılıyor.',
    cip: 'Bildirim · tekrar takvimi',
    ekran: {src: 'promo/k63.0.png', cx: 800, cy: 640, s: 1.06},
    ters: true,
  },
];

const Ozellik: React.FC<{ayar: OzellikAyari}> = ({ayar}) => {
  const f = useCurrentFrame();
  const g = yum((f - 1) / 15);
  const c = 1 - yum((f - (SURE.ozellik - 10)) / 10);
  const metin = yasam(f, 8, SURE.ozellik - 8, 18, 12);
  const pencere = yum((f - 4) / 26);
  const cipOp = yum((f - 40) / 16);
  const altOp = yum((f - 26) / 18);

  const metinSol = ayar.ters ? 1250 : 130;
  const ekranSol = ayar.ters ? 70 : 760;

  return (
    <AbsoluteFill style={{opacity: Math.min(g, c)}}>
      <AcikZemin kaydir={f * 0.3} />

      <div
        style={{
          position: 'absolute',
          left: metinSol,
          top: 205,
          width: 585,
          opacity: metin.op,
          transform: `translateY(${metin.y}px)`,
          filter: `blur(${metin.blur}px)`,
        }}
      >
        <Etiket op={1} renk="#2563EB">
          {ayar.sira}
        </Etiket>
        <div style={{marginTop: 26}}>
          <Baslik
            satirlar={ayar.baslik.map((t, i) =>
              i === 1 ? (
                <span key={t} style={{color: '#1D4ED8'}}>
                  {t}
                </span>
              ) : (
                t
              ),
            )}
            f={f}
            basla={10}
            boyut={60}
            satirAra={4}
          />
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 25,
            fontWeight: 550,
            lineHeight: 1.52,
            color: '#4A5F80',
            opacity: altOp,
            transform: `translateY(${(1 - altOp) * 12}px)`,
          }}
        >
          {ayar.alt}
        </div>
        <div style={{marginTop: 32, opacity: cipOp, transform: `translateY(${(1 - cipOp) * 12}px)`}}>
          <Cip metin={ayar.cip} op={1} />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: ekranSol,
          top: 215,
          opacity: pencere,
          transform: `translateY(${(1 - pencere) * 46}px) scale(${0.965 + 0.035 * pencere})`,
        }}
      >
        <UygulamaEkrani
          src={ayar.ekran.src}
          cx={ayar.ekran.cx}
          cy={ayar.ekran.cy}
          s={ayar.ekran.s}
          genislik={1120}
          yukseklik={673}
          drift={0}
        />

        <div
          style={{
            position: 'absolute',
            left: ayar.ters ? 690 : -20,
            top: -58,
            opacity: cipOp,
            transform: `translateY(${(1 - cipOp) * 10}px)`,
          }}
        >
          <Cip metin={ayar.etiket} op={1} />
        </div>
      </div>
      <Gren koyu={false} op={0.28} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 6 · RAKAMLAR                                                       */
/* ------------------------------------------------------------------ */
const Rakamlar: React.FC = () => {
  const f = useCurrentFrame();
  const t = yasam(f, 4, SURE.rakamlar, 16, 12);
  const kalemler = [
    {deger: 844, sonEk: '', birim: 'soru', alt: 'çözüldü, hepsi kayıtta'},
    {deger: 14, sonEk: '', birim: 'acil konu', alt: 'öncelik sırasına dizildi'},
    {deger: 51, sonEk: '%', birim: 'hafıza', alt: 'tekrarlarla yükseliyor'},
    {deger: 12, sonEk: '', birim: 'gün seri', alt: 'her gün bir adım'},
  ];

  return (
    <AbsoluteFill>
      <KoyuZemin isik="sag" />
      <AbsoluteFill style={{padding: '110px 130px'}}>
        <div style={{opacity: t.op, transform: `translateY(${t.y}px)`}}>
          <Etiket op={t.op} renk="#7FA8F5">
            Tek hesap · tek ekran
          </Etiket>
          <div style={{marginTop: 30}}>
            <Baslik satirlar={['Her şey bir yerde.']} f={f} basla={10} boyut={84} renk="#F3F7FF" />
          </div>
        </div>

        <div style={{position: 'absolute', left: 118, top: 430, display: 'flex', gap: 46}}>
          {kalemler.map((k, i) => {
            const p = yum((f - 24 - i * 10) / 26);
            return (
              <div key={k.birim} style={{width: 400, opacity: p, transform: `translateY(${(1 - p) * 26}px)`}}>
                <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
                  <div
                    style={{
                      fontSize: 112,
                      fontWeight: 800,
                      letterSpacing: -6,
                      color: '#FFFFFF',
                      lineHeight: 1,
                    }}
                  >
                    <Sayac deger={k.deger} f={f} basla={26 + i * 10} sure={40} sonEk={k.sonEk} />
                  </div>
                  <div style={{fontSize: 34, fontWeight: 700, color: '#7FB4FF', letterSpacing: -0.5}}>
                    {k.birim}
                  </div>
                </div>
                <div style={{marginTop: 16, fontSize: 23, fontWeight: 550, color: '#8FA1C0'}}>{k.alt}</div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: 'absolute',
            left: 130,
            top: 770,
            fontSize: 26,
            fontWeight: 600,
            color: '#6C7C99',
            opacity: yum((f - 70) / 20),
          }}
        >
          Beş deneme, 138 sayfa, 12 günlük seri — hepsi aynı ekranda.
        </div>
      </AbsoluteFill>
      <Gren />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 7 · KAPANIŞ                                                        */
/* ------------------------------------------------------------------ */
const Final: React.FC = () => {
  const f = useCurrentFrame();
  const t1 = yasam(f, 4, 96, 16, 14);
  const logo = yum((f - 96) / 20);
  const ad = yum((f - 108) / 20);
  const slogan = yum((f - 104) / 20);
  const url = yum((f - 124) / 20);
  const karart = yum((f - (SURE.final - 18)) / 18);

  return (
    <AbsoluteFill>
      <AcikZemin />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center', position: 'absolute', opacity: t1.op, transform: `translateY(${t1.y}px)`, filter: `blur(${t1.blur}px)`}}>
          <div style={{fontSize: 82, fontWeight: 800, letterSpacing: -3.4, color: '#0B1220'}}>
            Bugün ne çalışacağın belli.
          </div>
          <div style={{marginTop: 22, fontSize: 34, fontWeight: 600, color: '#4A5F80'}}>
            Gerisi artık tahmin değil.
          </div>
        </div>

        <div style={{textAlign: 'center'}}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 28,
              opacity: Math.min(logo, ad),
              transform: `translateY(${(1 - logo) * 18}px)`,
            }}
          >
            <div style={{transform: `scale(${0.7 + 0.3 * logo})`}}>
              <Marka boyut={104} />
            </div>
            <div style={{fontSize: 86, fontWeight: 800, letterSpacing: -3.6, color: '#0B1220'}}>
              Analiz Merkezi
            </div>
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 40,
              fontWeight: 650,
              letterSpacing: -0.8,
              color: '#1D4ED8',
              opacity: slogan,
              transform: `translateY(${(1 - slogan) * 16}px)`,
            }}
          >
            Her yanlış, bir sonraki adım.
          </div>

          <div
            style={{
              marginTop: 46,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 18,
              opacity: url,
              transform: `translateY(${(1 - url) * 14}px)`,
            }}
          >
            <div
              style={{
                padding: '16px 30px',
                borderRadius: 999,
                background: '#1D4ED8',
                color: '#FFFFFF',
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 0.2,
                boxShadow: '0 18px 44px rgba(29,78,216,0.32)',
              }}
            >
              analiz-merkezi.vercel.app
            </div>
            <div style={{fontSize: 22, fontWeight: 600, color: '#4A5F80'}}>
              Ücretsiz · Web ve mobil · Okulizyon bağlantısı
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#FFFFFF', opacity: karart}} />
      <Gren koyu={false} op={0.3} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* ANA KOMPOZİSYON                                                    */
/* ------------------------------------------------------------------ */
export const Tanitim: React.FC = () => (
  <AbsoluteFill style={{background: '#06090F', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden'}}>
    <Sequence from={B.kanca} durationInFrames={SURE.kanca}>
      <Kanca />
    </Sequence>
    <Sequence from={B.egri} durationInFrames={SURE.egri}>
      <Egri />
    </Sequence>
    <Sequence from={B.testEtkisi} durationInFrames={SURE.testEtkisi}>
      <TestEtkisi />
    </Sequence>
    <Sequence from={B.reveal} durationInFrames={SURE.reveal}>
      <Reveal />
    </Sequence>
    {OZELLIKLER.map((a, i) => (
      <Sequence key={a.sira} from={B.ozellik + i * SURE.ozellik} durationInFrames={SURE.ozellik}>
        <Ozellik ayar={a} />
      </Sequence>
    ))}
    <Sequence from={B.rakamlar} durationInFrames={SURE.rakamlar}>
      <Rakamlar />
    </Sequence>
    <Sequence from={B.final} durationInFrames={SURE.final}>
      <Final />
    </Sequence>
  </AbsoluteFill>
);
