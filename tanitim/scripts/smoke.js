const puppeteer = require('puppeteer-core');
(async () => {
  const { default: Chromium } = await import('@sparticuz/chromium');
  const exe = await Chromium.executablePath();
  console.log('exe:', exe);
  const browser = await puppeteer.launch({
    args: [...Chromium.args, '--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
    executablePath: exe,
    headless: 'shell',
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 }
  });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise(r => setTimeout(r, 3000));
  console.log('title:', await page.title());
  console.log('metin uzunluk:', (await page.evaluate(() => document.body.innerText)).length);
  await page.screenshot({ path: '/tmp/smoke.png' });
  await browser.close();
  console.log('OK');
})().catch(e => { console.error('HATA:', e.message); process.exit(1); });
