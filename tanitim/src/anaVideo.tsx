import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {Acilis} from './sahne/Acilis';
import {Kapanis} from './sahne/Kapanis';
import {Akis} from './akis/Akis';

// Yeni sürüm (v83) gerçek akış kaydı: 2138 kare @30fps = 71.3 sn
export const SURE = {
  acilis: 96,
  akis: 2138,
  kapanis: 138,
};

export const TOPLAM = SURE.acilis + SURE.akis + SURE.kapanis;

export const AnaVideo: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: '#F2F6FD'}}>
      <Sequence from={0} durationInFrames={SURE.acilis}>
        <Acilis />
      </Sequence>
      <Sequence from={SURE.acilis} durationInFrames={SURE.akis}>
        <Akis fps={fps} />
      </Sequence>
      <Sequence from={SURE.acilis + SURE.akis} durationInFrames={SURE.kapanis}>
        <Kapanis />
      </Sequence>
    </AbsoluteFill>
  );
};
