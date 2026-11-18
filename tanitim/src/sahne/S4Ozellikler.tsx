import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {OzellikSahnesi, Ozellik} from './OzellikSahnesi';
import {Perde} from '../bilesenler/Yazi';
import {EKRANLAR, KUTULAR, merkez} from '../veri/ekranlar';
import {T} from '../veri/tema';

export const OZELLIK_SURESI = [170, 195, 205, 265, 175, 175];

const denemeBtn = merkez(KUTULAR.denemeFormuAc);
const erkenTekrar = {x: 745, y: 478};

export const OZELLIKLER: Ozellik[] = [
  {
    no: '01',
    etiket: 'Sınav analizi',
    baslik: 'Sınav ve net analizi',
    aciklama:
      'Her denemeyi ders ders doğru, yanlış ve boş olarak girersin; net ve başarı oranı kendiliğinden hesaplanır.',
    maddeler: ['Ders bazlı doğru · yanlış · boş girişi', 'Net ve başarı oranı otomatik', 'Yanlışın nedeni konu takibine işlenir'],
    vurgu: 'mavi',
    cekimler: [
      {
        src: EKRANLAR.denemelerim.dosya,
        baslangic: 0,
        zoom: [1.1, 1.24],
        odak: {x: 880, y: 320},
        imlec: {
          yol: [
            {f: 4, x: 1420, y: 700},
            {f: 34, x: denemeBtn.x, y: denemeBtn.y},
            {f: 92, x: denemeBtn.x, y: denemeBtn.y},
          ],
          tiklama: [56],
        },
        vurgu: KUTULAR.denemeFormuAc,
      },
      {
        src: EKRANLAR.denemeFormu.dosya,
        baslangic: 92,
        zoom: [1.12, 1.34],
        odak: {x: 900, y: 430},
        odakSon: {x: 860, y: 520},
      },
    ],
  },
  {
    no: '02',
    etiket: 'Konu eksikleri',
    baslik: 'Konu eksikleri ve öncelik puanı',
    aciklama:
      'Yanlış ve boş soruların nedenini işaretlersin. Eksik konular tek yerde birikir, en acil olan listenin başına geçer.',
    maddeler: [
      'Neden seçilir: konuyu bilmiyordum, anlamadım, işlem hatası…',
      'Acil Çalışılacaklar öncelik sırasıyla',
      'Konu eksiği ve tekrar aynı ekranda',
    ],
    vurgu: 'cam',
    cekimler: [
      {
        src: EKRANLAR.nedenSec.dosya,
        baslangic: 0,
        zoom: [1.18, 1.42],
        odak: {x: 960, y: 520},
        odakSon: {x: 950, y: 620},
      },
      {
        src: EKRANLAR.konuTakibi.dosya,
        baslangic: 108,
        zoom: [1.22, 1.34],
        odak: {x: 940, y: 250},
        odakSon: {x: 950, y: 262},
        vurgu: KUTULAR.takipKart,
      },
    ],
  },
  {
    no: '03',
    etiket: 'Aralıklı tekrar',
    baslik: 'Tekrar zamanı kendiliğinden gelir',
    aciklama:
      'Konu bitince 3-7-14-21-28 günlük tekrar takvimi kurulur; hafıza gücü düşen konu listede yukarı çıkar.',
    maddeler: ['Hafıza gücü yüzdesi ve renk eşiği', 'Tekrar günü gelen konu kırmızı', 'Kart turuyla tekrar — istersen erken'],
    vurgu: 'mor',
    cekimler: [
      {
        src: EKRANLAR.konuTamam.dosya,
        baslangic: 0,
        zoom: [1.2, 1.34],
        odak: {x: 950, y: 470},
        odakSon: {x: 900, y: 520},
      },
      {
        src: EKRANLAR.konuTakibi.dosya,
        baslangic: 100,
        zoom: [1.24, 1.32],
        odak: {x: 900, y: 442},
        imlec: {
          yol: [
            {f: 104, x: 1500, y: 700},
            {f: 134, x: erkenTekrar.x, y: erkenTekrar.y},
            {f: 200, x: erkenTekrar.x, y: erkenTekrar.y},
          ],
          tiklama: [148],
        },
      },
    ],
  },
  {
    no: '04',
    etiket: 'Bilgi Bankası',
    baslik: 'Beş adımlı konu çalışması',
    aciklama:
      'Ön test, aktif çalışma, çözümlü örnek, karışık pratik ve 5 soruluk kısa kontrol. Adımlar sırayla açılır; bitmeyen konu hafızaya girmez.',
    maddeler: ['Adımlar sırayla kilit açar', 'Kısa kontrol: gerçek havuzdan 5 soru', 'Yanlışın nedeni kayda işlenir'],
    vurgu: 'mavi',
    cekimler: [
      {
        src: EKRANLAR.konuPanel.dosya,
        baslangic: 0,
        zoom: [1.14, 1.28],
        odak: {x: 940, y: 470},
        odakSon: {x: 950, y: 520},
      },
      {
        src: EKRANLAR.dortAdim.dosya,
        baslangic: 72,
        zoom: [1.2, 1.34],
        odak: {x: 900, y: 470},
        vurgu: KUTULAR.kisaKontrolBaslat,
      },
      {src: EKRANLAR.kisaKontrol.dosya, baslangic: 140, zoom: [1.14, 1.26], odak: {x: 960, y: 500}},
      {src: EKRANLAR.sonuc.dosya, baslangic: 212, zoom: [1.14, 1.3], odak: {x: 960, y: 470}},
    ],
  },
  {
    no: '05',
    etiket: 'Günlük plan',
    baslik: 'Günlük plan ve görevler',
    aciklama:
      'Günlük görevler üç temel adımdan oluşur: kitap okuma, soru çözümü ve konu çalışması. Seri ile planlama aynı yerde.',
    maddeler: ['Üç temel günlük görev', 'Seri ve okunan sayfa sayacı', 'Planlama: sınava kalan gün'],
    vurgu: 'cam',
    cekimler: [
      {src: EKRANLAR.gorevler.dosya, baslangic: 0, zoom: [1.12, 1.26], odak: {x: 800, y: 400}},
      {src: EKRANLAR.planlama.dosya, baslangic: 92, zoom: [1.12, 1.26], odak: {x: 900, y: 430}},
    ],
  },
  {
    no: '06',
    etiket: 'Kayıt düzeni',
    baslik: 'Soru bankası ve kitaplık',
    aciklama:
      'Çözdüğün soruları ve yanlışlarını kaydedersin; kitaplıkta hangi kitabın neresinde olduğunu takip edersin.',
    maddeler: ['Soru çözümü ve hata girişi', 'Kitap ve okunan sayfa takibi', 'Tüm kayıtlar tek düzen içinde'],
    vurgu: 'mavi',
    cekimler: [
      {src: EKRANLAR.soruBankasi.dosya, baslangic: 0, zoom: [1.12, 1.26], odak: {x: 860, y: 400}},
      {src: EKRANLAR.kitaplik.dosya, baslangic: 92, zoom: [1.12, 1.26], odak: {x: 900, y: 430}},
    ],
  },
];

export const S4Ozellikler: React.FC = () => {
  let birikim = 0;
  return (
    <AbsoluteFill style={{background: T.zeminKoyu}}>
      {OZELLIKLER.map((o, i) => {
        const bas = birikim;
        birikim += OZELLIK_SURESI[i];
        return (
          <Sequence key={o.no} from={bas} durationInFrames={OZELLIK_SURESI[i]} layout="none">
            <OzellikSahnesi ozellik={o} sure={OZELLIK_SURESI[i]} sira={i + 1} toplam={OZELLIKLER.length} />
            <Perde giris={8} cikis={8} sure={OZELLIK_SURESI[i]} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
