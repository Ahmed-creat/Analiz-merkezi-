import {staticFile, delayRender, continueRender} from 'remotion';

// Inter — uygulamanın kendi yazı tipi (--font-sans: 'Inter').
// Yerel woff2 dosyaları yüklenene kadar render bekletilir.
const AGIRLIKLAR = [400, 600, 700, 800];
const handle = delayRender('Inter yazı tipleri yükleniyor');

if (typeof document !== 'undefined') {
  const stil = document.createElement('style');
  stil.textContent = AGIRLIKLAR.map(
    w => `@font-face{font-family:'Inter';font-style:normal;font-weight:${w};font-display:block;src:url(${staticFile(`fonts/inter-latin-ext-${w}-normal.woff2`)}) format('woff2');}`,
  ).join('\n');
  document.head.appendChild(stil);
  Promise.all(AGIRLIKLAR.map(w => document.fonts.load(`${w} 48px Inter`, 'Eksik konu takibi ışğİŞĞ')))
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
} else {
  continueRender(handle);
}
