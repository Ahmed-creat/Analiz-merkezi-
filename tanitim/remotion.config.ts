import {Config} from '@remotion/cli/config';

// Bu ortamda tarayıcı sistemde yok; @sparticuz/chromium ikilisi kullanılıyor.
// Kütüphaneler LD_LIBRARY_PATH=/tmp/chromium-libs/lib ile verilir (bkz. README).
Config.setBrowserExecutable(process.env.CHROMIUM_PATH || '/tmp/chromium');
Config.setChromiumOpenGlRenderer('swangle');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setConcurrency(Number(process.env.REMOTION_CONCURRENCY || 2));
