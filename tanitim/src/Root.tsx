import React from 'react';
import {Composition} from 'remotion';
import './fontlar';
import {AnaVideo, SURE, TOPLAM} from './anaVideo';
import {S1Acilis} from './sahne/S1Acilis';
import {S2Problem} from './sahne/S2Problem';
import {S3Genel} from './sahne/S3Genel';
import {S4Ozellikler} from './sahne/S4Ozellikler';
import {S5Moduller} from './sahne/S5Moduller';
import {S6Kapanis} from './sahne/S6Kapanis';

const ayar = {fps: 30, width: 1920, height: 1080} as const;

export const Root: React.FC = () => (
  <>
    <Composition id="AnaVideo" component={AnaVideo} durationInFrames={TOPLAM} {...ayar} />
    <Composition id="S1-Acilis" component={S1Acilis} durationInFrames={SURE.s1} {...ayar} />
    <Composition id="S2-Problem" component={S2Problem} durationInFrames={SURE.s2} {...ayar} />
    <Composition id="S3-Genel" component={S3Genel} durationInFrames={SURE.s3} {...ayar} />
    <Composition id="S4-Ozellikler" component={S4Ozellikler} durationInFrames={SURE.s4} {...ayar} />
    <Composition id="S5-Moduller" component={S5Moduller} durationInFrames={SURE.s5} {...ayar} />
    <Composition id="S6-Kapanis" component={S6Kapanis} durationInFrames={SURE.s6} {...ayar} />
  </>
);
