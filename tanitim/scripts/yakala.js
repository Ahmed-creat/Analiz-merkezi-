/* Analiz Merkezi — tanıtım videosu için otomatik ekran yakalama.
   Uygulamanın kendisi http://127.0.0.1:8080 üzerinden açılır, gerçek tıklamalarla
   ilerlenir ve her adımda 3840x2160 (1920x1080 @2x) PNG alınır. */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CIKTI = path.join(__dirname, '..', 'public', 'ekran');
const BEKLE = ms => new Promise(r => setTimeout(r, ms));
const kayit = { rects: {}, adimlar: [], hatalar: [] };

(async () => {
  const { default: Chromium } = await import('@sparticuz/chromium');
  fs.mkdirSync(CIKTI, { recursive: true });
  const exe = await Chromium.executablePath();
  const browser = await puppeteer.launch({
    args: [...Chromium.args, '--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars', '--force-color-profile=srgb'],
    executablePath: exe,
    headless: 'shell',
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 2 }
  });
  const page = await browser.newPage();
  page.on('pageerror', e => kayit.hatalar.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') kayit.hatalar.push('console: ' + m.text()); });

  const gorunur = async sel => {
    const h = await page.$(sel);
    if (!h) return false;
    return page.evaluate(el => {
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && st.display !== 'none';
    }, h);
  };
  const tik = async (sel, ad) => {
    try {
      await page.waitForSelector(sel, { visible: true, timeout: 8000 });
      await page.click(sel);
      await BEKLE(550);
      kayit.adimlar.push('tik OK: ' + (ad || sel));
      return true;
    } catch (e) {
      kayit.hatalar.push('tik FAIL: ' + (ad || sel) + ' → ' + e.message.split('\n')[0]);
      return false;
    }
  };
  const metinle = async (secim, metin) => page.evaluate((s, m) => {
    const el = [...document.querySelectorAll(s)].find(e => (e.innerText || '').toLowerCase().includes(m.toLowerCase()));
    return el ? (el.getAttribute('data-topic') || el.getAttribute('data-nav') || el.getAttribute('data-lesson') || el.innerText.slice(0, 40)) : null;
  }, secim, metin);
  const rect = async (sel, ad) => {
    const h = await page.$(sel);
    if (!h) { kayit.hatalar.push('rect yok: ' + ad); return; }
    const b = await h.boundingBox();
    if (b) kayit.rects[ad] = { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
  };
  const cek = async ad => {
    await page.screenshot({ path: path.join(CIKTI, ad + '.png') });
    kayit.adimlar.push('ekran: ' + ad);
  };

  await page.evaluateOnNewDocument(() => {
    try {
      const k = 'analizmerkezi_v6';
      const mevcut = JSON.parse(localStorage.getItem(k) || '{}');
      mevcut.user = Object.assign({ name: '', grade: '10', joined: null }, mevcut.user || {}, { grade: '10' });
      localStorage.setItem(k, JSON.stringify(mevcut));
      localStorage.setItem('am_karsilama_goruldu', '1');
    } catch (e) { /* */ }
  });
  await page.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle2', timeout: 120000 });
  await BEKLE(3500);

  // 1) İlk açılış katmanlarını kapat (tanıtım + hoş geldin)
  if (await gorunur('#tanitim-modal [data-act="tanitimKapat"]')) await tik('#tanitim-modal [data-act="tanitimKapat"]', 'tanıtım kapat');
  await BEKLE(600);
  if (await gorunur('#welcome-modal [data-act="completeWelcome"]')) {
    await tik('#welcome-modal [data-act="completeWelcome"]', 'hoş geldin: başlayalım');
    await BEKLE(900);
  }
  // kalan katmanlar
  for (const s of ['[data-act="tanitimKapat"]', '[data-act="closeModal"]']) {
    if (await gorunur(s)) { await page.click(s).catch(() => {}); await BEKLE(400); }
  }
  const sinif = await page.evaluate(() => { try { return JSON.parse(localStorage.getItem('analizmerkezi_v6') || '{}').user; } catch (e) { return null; } });
  kayit.adimlar.push('kullanıcı: ' + JSON.stringify(sinif));

  // 2) Ana sayfa
  await cek('01-ana-sayfa');
  await rect('[data-nav="knowledge"]', 'navBilgi');
  await rect('[data-nav="tracking"]', 'navTakip');
  await rect('[data-nav="tasks"]', 'navGorevler');
  await rect('[data-nav="exams"]', 'navDenemeler');
  await rect('[data-nav="questionbank"]', 'navSoruBankasi');
  await rect('[data-nav="library"]', 'navKitaplik');
  await rect('[data-nav="dashboard"]', 'navAnaSayfa');

  // 3) Bilgi Bankası — müfredat ağacı
  await tik('[data-nav="knowledge"]', 'Bilgi Bankası');
  await BEKLE(700);
  const ders = await metinle('.tree-lesson', 'Biyoloji');
  if (!ders) { kayit.hatalar.push('Biyoloji dersi bulunamadı'); }
  await cek('02-bilgi-bankasi');
  if (ders) {
    await tik('.tree-lesson[data-lesson="' + ders + '"]', 'Biyoloji aç');
    await BEKLE(700);
    await rect('.tree-lesson[data-lesson="' + ders + '"]', 'dersBiyoloji');
    const ilkKonu = await page.evaluate(() => {
      const iste = 'Biyoloji > 1.1 Canlılık İçin Enerjinin Önemi';
      const e = [...document.querySelectorAll('.tree-child')].find(x => x.dataset.topic === iste) || document.querySelector('.tree-child');
      return e ? e.dataset.topic : null;
    });
    kayit.adimlar.push('ilk konu: ' + ilkKonu);
    await cek('03-agac-acik');
    if (ilkKonu) {
      await tik('.tree-child[data-topic="' + ilkKonu.replace(/"/g, '\\"') + '"]', 'konu seç');
      await BEKLE(900);
      await page.evaluate(() => {
        const el = [...document.querySelectorAll('.tree-child')].find(e => e.classList.contains('active'));
        if (!el) return;
        const b = el.getBoundingClientRect();
        window.__seciliKonu = { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
      }).then(async () => { const v = await page.evaluate(() => window.__seciliKonu); if (v) kayit.rects.seciliKonu = v; });
      await cek('04-konu-panel');

      // 4) 1-4. adımları tamamla
      for (let i = 0; i < 4; i++) {
        const sel = '[data-act="completeStep"][data-step="' + i + '"]';
        if (!(await gorunur(sel))) { kayit.hatalar.push('adım düğmesi yok: ' + i); break; }
        await rect(sel, 'adimTamamla' + i);
        await page.click(sel).catch(e => kayit.hatalar.push('adım tık: ' + e.message));
        await BEKLE(1200);
        kayit.adimlar.push('adım tamamlandı: ' + i);
      }
      await BEKLE(700);
      await cek('05-dort-adim');
      await rect('[data-bkt-test]', 'kisaKontrolBaslat');
      const varMi = await gorunur('[data-bkt-test]');

      // 5) 5 soruluk kısa kontrolü gerçekten çöz
      if (varMi) {
        await tik('[data-bkt-test]', 'kısa kontrole başla');
        await BEKLE(2500);
        for (let q = 0; q < 5; q++) {
          const bilgi = await page.evaluate(() => {
            const m = document.getElementById('bkt-test-modal');
            if (!m || !m._bktQuestions) return null;
            const i = Number(m._bktIdx) || 0;
            const s = m._bktQuestions[i];
            const adet = m.querySelectorAll('[data-bkt-secim]').length;
            return s ? { i, dogru: Number(s.dogru_index), adet, metin: String(s.metin).slice(0, 60) } : null;
          });
          kayit.adimlar.push('soru: ' + JSON.stringify(bilgi));
          if (q === 0) { await cek('06-kisa-kontrol-soru'); await rect('#bkt-test-modal', 'testModal'); }
          if (bilgi) {
            const hedef = q === 2 ? (bilgi.dogru + 1) % Math.max(1, bilgi.adet) : bilgi.dogru;
            await tik('[data-bkt-secim="' + hedef + '"]', 'şık ' + hedef);
          }
          await BEKLE(500);
          if (q < 4) await tik('[data-bkt-next]', 'sonraki soru');
          await BEKLE(700);
        }
        // 5) son soruda "Testi Bitir" ile sonuç/neden ekranı
        await tik('[data-bkt-next]', 'testi bitir');
        await BEKLE(1800);
        await cek('07-neden-sec');
        await rect('[data-bkt-finalize-test]', 'nedenleriKaydet');
        if (await gorunur('[data-bkt-reason]')) {
          const deger = await page.evaluate(() => {
            const sec = document.querySelector('[data-bkt-reason]');
            if (!sec) return null;
            return [...sec.options].map(o => o.value).filter(Boolean)[0] || null;
          });
          if (deger) { await page.select('[data-bkt-reason]', deger).catch(e => kayit.hatalar.push('neden seç: ' + e.message)); await BEKLE(500); }
          await cek('08-neden-secildi');
        }
        await tik('[data-bkt-finalize-test]', 'nedenleri kaydet');
        await BEKLE(1800);
        await cek('09-sonuc');
        if (await gorunur('[data-bkt-close-test]')) { await tik('[data-bkt-close-test]', 'testi kapat'); await BEKLE(1400); }
        await cek('10-adim5-bitti');
      }

      // 6) Konuyu tamamla
      if (await gorunur('[data-act="completeTopic"]')) {
        await rect('[data-act="completeTopic"]', 'konuyuTamamla');
        await tik('[data-act="completeTopic"]', 'konuyu tamamla');
        await BEKLE(1600);
        await cek('11-konu-tamamlandi');
      } else {
        kayit.hatalar.push('completeTopic düğmesi yok');
      }
    }
  }

  // 7) Konu Takibi (gerçek hafıza kartı)
  await tik('[data-nav="tracking"]', 'Konu Takibi');
  await BEKLE(1200);
  await cek('12-konu-takibi');
  await rect('.bento-card', 'takipKart');

  // 8) Günlük görevler
  await tik('[data-nav="tasks"]', 'Günlük Görevler');
  await BEKLE(1100);
  await cek('13-gunluk-gorevler');

  // 9) Denemelerim (boş durum + giriş formu)
  await tik('[data-nav="exams"]', 'Denemelerim');
  await BEKLE(1100);
  await cek('14-denemelerim');
  if (await gorunur('[data-act="toggleExamForm"]')) {
    await rect('[data-act="toggleExamForm"]', 'denemeFormuAc');
    await tik('[data-act="toggleExamForm"]', 'deneme formu');
    await BEKLE(900);
    await cek('15-deneme-formu');
  }

  // 10) Soru Bankası
  await tik('[data-nav="questionbank"]', 'Soru Bankası');
  await BEKLE(1200);
  await cek('16-soru-bankasi');

  // 11) Kitaplık
  await tik('[data-nav="library"]', 'Kitaplık');
  await BEKLE(1100);
  await cek('17-kitaplik');

  // 12) Planlama
  await tik('[data-nav="planning"]', 'Planlama');
  await BEKLE(1100);
  await cek('18-planlama');

  // 13) Ana sayfa (veri oluştuktan sonra)
  await tik('[data-nav="dashboard"]', 'Ana Sayfa');
  await BEKLE(1400);
  await cek('19-ana-sayfa-sonra');

  fs.writeFileSync(path.join(__dirname, '..', '..', 'tanitim', 'scripts', 'yakalama-kaydi.json'), JSON.stringify(kayit, null, 2));
  console.log(JSON.stringify(kayit, null, 2));
  await browser.close();
})().catch(e => { console.error('HATA:', e); process.exit(1); });
