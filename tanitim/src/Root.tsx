import React from 'react';
import {Composition} from 'remotion';
import './fontlar';
import {AnaVideo, TOPLAM} from './anaVideo';
import {TANITIM_TOPLAM, Tanitim} from './pazarlama/Tanitim';

const ayar = {fps: 30, width: 1920, height: 1080} as const;

export const Root: React.FC = () => (
  <>
    <Composition id="AnaVideo" component={AnaVideo} durationInFrames={TOPLAM} {...ayar} />
    <Composition id="Tanitim" component={Tanitim} durationInFrames={TANITIM_TOPLAM} {...ayar} />
  </>
);
