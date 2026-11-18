import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {S1Acilis} from './sahne/S1Acilis';
import {S2Problem} from './sahne/S2Problem';
import {S3Genel} from './sahne/S3Genel';
import {S4Ozellikler} from './sahne/S4Ozellikler';
import {S5Moduller} from './sahne/S5Moduller';
import {S6Kapanis} from './sahne/S6Kapanis';
import {OZELLIK_SURESI} from './sahne/S4Ozellikler';
import {T} from './veri/tema';

export const SURE = {
  s1: 150,
  s2: 240,
  s3: 210,
  s4: OZELLIK_SURESI.reduce((a, b) => a + b, 0),
  s5: 180,
  s6: 210,
};

export const TOPLAM = SURE.s1 + SURE.s2 + SURE.s3 + SURE.s4 + SURE.s5 + SURE.s6;

export const AnaVideo: React.FC = () => {
  const b1 = 0;
  const b2 = b1 + SURE.s1;
  const b3 = b2 + SURE.s2;
  const b4 = b3 + SURE.s3;
  const b5 = b4 + SURE.s4;
  const b6 = b5 + SURE.s5;

  return (
    <AbsoluteFill style={{background: T.zeminKoyu}}>
      <Sequence from={b1} durationInFrames={SURE.s1} layout="none">
        <S1Acilis />
      </Sequence>
      <Sequence from={b2} durationInFrames={SURE.s2} layout="none">
        <S2Problem />
      </Sequence>
      <Sequence from={b3} durationInFrames={SURE.s3} layout="none">
        <S3Genel />
      </Sequence>
      <Sequence from={b4} durationInFrames={SURE.s4} layout="none">
        <S4Ozellikler />
      </Sequence>
      <Sequence from={b5} durationInFrames={SURE.s5} layout="none">
        <S5Moduller />
      </Sequence>
      <Sequence from={b6} durationInFrames={SURE.s6} layout="none">
        <S6Kapanis />
      </Sequence>
    </AbsoluteFill>
  );
};
