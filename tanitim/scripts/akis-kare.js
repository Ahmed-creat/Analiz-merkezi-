/* Analiz Merkezi — gerçek akışı KARE KARE yakalar (30 fps video için).
   Her kare gerçek arayüz; küçük adımlarla (kaydırma ~15px, yazma 1 karakter,
   imleç interpolasyonu) ilerlediği için oynatımda akıcı görünür.
   Uygulama: /tmp/site-son/site (v83) · 1920×1080
   Çıktı: /tmp/kareler/fNNNNN.jpg + tanitim/public/kayit/akis.json  */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const {tohumKodu} = require('./mock-veri');

const KURU = process.env.KURU === '1';
const KARE_KLASOR = '/tmp/kareler';
const CIKTI = path.join(__dirname, '..', 'public', 'kayit');
const log = {kare: 0, olaylar: [], imlec: [], tikler: [], hatalar: [], fps: 30};
let n = 0;
let imlec = {x: 940, y: 520};
let memBuf = null;

(async () => {
  if (!KURU) {
    fs.rmSync(KARE_KLASOR, {recursive: true, force: true});
    fs.mkdirSync(KARE_KLASOR, {recursive: true});
  }
  fs.mkdirSync(CIKTI, {recursive: true});

  const {default: Chromium} = await import('@sparticuz/chromium');
  const exe = await Chromium.executablePath();
  const browser = await puppeteer.launch({
    args: [...Chromium.args, '--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars', '--force-color-profile=srgb', '--window-size=1920,1080', '--font-render-hinting=none'],
    executablePath: exe,
    headless: 'shell',
    defaultViewport: {width: 1920, height: 1080, deviceScaleFactor: 1},
  });
  const page = await browser.newPage();
  page.on('pageerror', (e) => log.hatalar.push('pageerror: ' + String(e.message).split('\n')[0]));

  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const u = req.url();
    if (u.includes('chart.js')) req.respond({status: 200, contentType: 'application/javascript', body: fs.readFileSync('/tmp/vendor/node_modules/chart.js/dist/chart.umd.js', 'utf8')});
    else if (u.includes('lucide')) req.respond({status: 200, contentType: 'application/javascript', body: fs.readFileSync('/tmp/vendor/node_modules/lucide/dist/umd/lucide.min.js', 'utf8')});
    else if (!u.startsWith('http://127.0.0.1') && !u.startsWith('data:')) req.abort();
    else req.continue();
  });

  await page.evaluateOnNewDocument('(' + tohumKodu.toString() + ')()');
  await page.goto('http://127.0.0.1:8081/index.html', {waitUntil: 'domcontentloaded', timeout: 120000});
  await page.waitForFunction('!!window.Chart && !!window.lucide', {timeout: 40000});
  await page.addStyleTag({content: '*{backdrop-filter:none !important;-webkit-backdrop-filter:none !important}html{scroll-behavior:auto !important}'});
  await new Promise((r) => setTimeout(r, 1500));

  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  const kareDosya = (buf, i) => fs.writeFileSync(path.join(KARE_KLASOR, 'f' + String(i).padStart(5, '0') + '.jpg'), buf);
  const kareAl = async () => {
    if (KURU) { memBuf = null; n++; log.imlec.push([imlec.x, imlec.y]); return; }
    memBuf = await page.screenshot({type: 'jpeg', quality: 86, captureBeyondViewport: false});
    kareDosya(memBuf, n); n++; log.imlec.push([imlec.x, imlec.y]);
  };
  const tut = async (k) => {
    if (KURU) { n += k; for (let i = 0; i < k; i++) log.imlec.push([imlec.x, imlec.y]); return; }
    if (!memBuf) { await kareAl(); k -= 1; }
    for (let i = 0; i < k; i++) { kareDosya(memBuf, n); n++; log.imlec.push([imlec.x, imlec.y]); }
  };
  const olay = (ad, altyazi, adim) => log.olaylar.push({kare: n, ad, altyazi: altyazi || '', adim: adim || 0});

  const merkez = async (sel) => page.evaluate((s) => {
    const els = [...document.querySelectorAll(s)].filter((e) => {
      const r = e.getBoundingClientRect();
      const st = getComputedStyle(e);
      const kap = e.closest('.modal-overlay');
      if (kap && !kap.classList.contains('open')) return false;
      return r.width > 2 && r.height > 2 && r.bottom > 4 && r.top < innerHeight - 4 && st.visibility !== 'hidden' && st.display !== 'none' && Number(st.opacity) > 0.05;
    });
    if (!els.length) return null;
    const r = els[0].getBoundingClientRect();
    return {x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2)};
  }, sel);

  // imleci içerik alanına taşı (tekerlek, imlecin altındaki öğeyi kaydırır)
  const icerigeTasi = async (k = 6) => {
    const uygun = await page.evaluate(([x, y]) => {
      if (x < 330 || x > 1850 || y < 90 || y > 990) return false;
      const e = document.elementFromPoint(x, y);
      if (!e) return false;
      return !e.closest('input, select, textarea, .dd, .dd-menu');
    }, [imlec.x, imlec.y]);
    if (uygun) return;
    await git({x: 1150, y: 620}, k);
  };

  // hedef görünmüyorsa gerçek kaydırmayla ara (her adım kare olarak kaydedilir)
  const bul = async (sel, {adim = 220, deneme = 30} = {}) => {
    let p = await merkez(sel);
    if (p) return p;
    await icerigeTasi();
    const bilgi = await page.evaluate((s) => {
      const el = [...document.querySelectorAll(s)].find((e) => {
        const r = e.getBoundingClientRect();
        return r.width > 2 && r.height > 2;
      });
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {top: Math.round(r.top + scrollY), mevcut: Math.round(scrollY), yuk: document.body.scrollHeight};
    }, sel);
    if (bilgi) {
      const hedefY = Math.max(0, Math.min(bilgi.yuk - 1030, bilgi.top - 480));
      if (KURU) console.log('BUL', sel, JSON.stringify({bilgi, hedefY, imlec}));
      const yon = hedefY >= bilgi.mevcut ? 1 : -1;
      for (let i = 0; i < deneme; i++) {
        const simdi = await page.evaluate(() => Math.round(scrollY));
        if (Math.abs(hedefY - simdi) < 80) break;
        await page.mouse.wheel({deltaY: yon * adim});
        if (KURU) console.log('  wheel', yon * adim, '→', await page.evaluate(() => Math.round(scrollY)));
        await bekle(80);
        memBuf = null;
        await kareAl();
        p = await merkez(sel);
        if (p) return p;
      }
      p = await merkez(sel);
      if (p) return p;
    }
    if (KURU && !log.__hataKare) { log.__hataKare = 1; try { await page.screenshot({path: '/tmp/fail.png'}); } catch (e) {} }
    log.hatalar.push('bulunamadı: ' + sel + ' (scrollY ' + await page.evaluate(() => Math.round(scrollY)) + ')');
    return null;
  };

  // sayfayı hedef öğe görünene kadar adım adım kaydır (her adım kare)
  const kaydirHedefe = async (sel, {adim = 26, sonra = 10} = {}) => {
    await icerigeTasi();
    let p = await merkez(sel);
    if (!p) {
      for (let i = 0; i < 90; i++) {
        const hedef = await page.evaluate((s) => {
          const el = [...document.querySelectorAll(s)].find((e) => e.getBoundingClientRect().width > 2);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {top: Math.round(r.top)};
        }, sel);
        if (!hedef) break;
        if (hedef.top > 620 && hedef.top < 950) break;
        const yon = hedef.top > 950 ? 1 : -1;
        if (yon < 0 && hedef.top < 140) break;
        await page.mouse.wheel({deltaY: yon * adim});
        await bekle(45);
        memBuf = null;
        await kareAl();
      }
      p = await merkez(sel);
    }
    if (!p) { log.hatalar.push('kaydirHedefe bulamadı: ' + sel); return false; }
    await git(p, 10);
    await page.mouse.click(p.x, p.y);
    log.tikler.push({kare: n, x: p.x, y: p.y, ad: sel});
    await bekle(280);
    memBuf = null;
    await kareAl();
    await tut(sonra);
    return true;
  };

  const git = async (hedef, k = 12) => {
    const p = typeof hedef === 'string' ? await merkez(hedef) : hedef;
    if (!p) { log.hatalar.push('hedef yok: ' + hedef); return null; }
    const b = {...imlec};
    for (let i = 1; i <= k; i++) {
      const x = Math.round(b.x + (p.x - b.x) * i / k);
      const y = Math.round(b.y + (p.y - b.y) * i / k);
      await page.mouse.move(x, y);
      imlec = {x, y};
      log.imlec.push([x, y]); n++;
    }
    if (!KURU) {
      const buf = await page.screenshot({type: 'jpeg', quality: 86, captureBeyondViewport: false});
      for (let i = 0; i < k; i++) kareDosya(buf, n - k + i);
      memBuf = buf;
    }
    return p;
  };

  const tik = async (sel, {git: g = 12, sonra = 8, ad, adim = 150, deneme = 9} = {}) => {
    const hedef = await bul(sel, {adim, deneme});
    if (KURU && !hedef) console.log('YOK', n, sel);
    const p = await git(hedef || sel, g);
    if (!p) return false;
    await page.mouse.click(p.x, p.y);
    log.tikler.push({kare: n, x: p.x, y: p.y, ad: ad || sel});
    if (KURU) console.log('TIK', n, ad || sel, '→', p.x, p.y);
    await bekle(280);
    memBuf = null;
    await kareAl();
    await tut(sonra);
    return true;
  };

  const kaydir = async (miktar, {adim = 14, ad} = {}) => {
    await icerigeTasi();
    const yon = miktar > 0 ? 1 : -1;
    let kalan = Math.abs(miktar);
    while (kalan > 0) {
      const d = Math.min(adim, kalan);
      await page.mouse.wheel({deltaY: yon * d});
      kalan -= d;
      await bekle(40);
      memBuf = null;
      await kareAl();
    }
    await bekle(150);
    if (ad) olay(ad, '', 0);
  };

  const yaz = async (sel, metin, {git: g = 14, kareBasina = 2} = {}) => {
    const p = await git((await bul(sel, {adim: 140, deneme: 6})) || sel, g);
    if (!p) return false;
    await page.mouse.click(p.x, p.y);
    await bekle(160);
    for (const ch of metin) {
      await page.keyboard.type(ch);
      memBuf = null;
      await kareAl();
      await tut(Math.max(0, kareBasina - 1));
    }
    return true;
  };

  try {
    // hoş geldin katmanı gecikmeli açılıyor: görünmesini bekle, sonra kapat
    for (let i = 0; i < 40; i++) {
      const acik = await page.evaluate(() => !!document.querySelector('.modal-overlay.open'));
      if (acik) break;
      await bekle(400);
    }
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('[data-act="tanitimKapat"]')].find((e) => e.getBoundingClientRect().width > 0);
      if (b) b.click();
    });
    await bekle(1000);
    for (let i = 0; i < 6; i++) {
      if (!(await page.evaluate(() => !!document.querySelector('.modal-overlay.open')))) break;
      await page.keyboard.press('Escape');
      await page.evaluate(() => { const b = [...document.querySelectorAll('[data-act="closeModal"]')].find((e) => e.closest('.modal-overlay.open')); if (b) b.click(); });
      await bekle(600);
    }
    const acikModallar = await page.evaluate(() => [...document.querySelectorAll('.modal-overlay.open')].map((m) => m.id));
    if (acikModallar.length) log.hatalar.push('açık modal kaldı: ' + acikModallar.join(','));

    // ============ 1 · ANA SAYFA ============
    olay('acilis', 'Beş deneme, 774 soru, 138 sayfa — hepsi tek ekranda', 0);
    await kareAl();
    await tut(54);
    await kaydir(600, {adim: 14});
    await tut(34);
    olay('ana-sayfa-grafik', 'Net gelişimi · ders başarı oranı · acil konular', 0);
    await kaydir(-600, {adim: 45});
    await tut(18);

    // ============ 2 · DENEMELERİM ============
    olay('denemelerim', 'Okulizyon’dan otomatik çekim ya da manuel giriş', 1);
    await tik('[data-nav="exams"]', {ad: 'Denemelerim', sonra: 18});
    await tut(12);
    olay('deneme-formu', 'Yeni deneme: ders ders doğru, yanlış, boş', 2);
    await tik('[data-act="toggleExamForm"]', {ad: 'Yeni Deneme Ekle', sonra: 14});
    await kaydir(170, {adim: 17});
    await tut(10);
    await yaz('#exam-name', 'Deneme 6 · TYT Genel');
    if (KURU) console.log('AD sonrası:', JSON.stringify(await page.evaluate(() => ({ad: document.querySelector('#exam-name') ? document.querySelector('#exam-name').value : 'yok', govde: !!document.querySelector('#exam-form-card .fc-body:not([hidden])'), matematik: !!document.querySelector('[data-exam-dwb=\"Matematik-w\"]'), sy: Math.round(scrollY), acikModal: [...document.querySelectorAll('.modal-overlay.open')].map((m) => m.id)}))));
    await tut(6);
    await yaz('[data-exam-dwb="Türk Dili ve Edebiyatı-d"]', '27', {kareBasina: 3});
    await yaz('[data-exam-dwb="Türk Dili ve Edebiyatı-w"]', '3', {kareBasina: 3});
    if (KURU) console.log('TDE sonrası:', JSON.stringify(await page.evaluate(() => ({tde_d: document.querySelector('[data-exam-dwb=\"Türk Dili ve Edebiyatı-d\"]') ? document.querySelector('[data-exam-dwb=\"Türk Dili ve Edebiyatı-d\"]').value : 'yok', matematik: !!document.querySelector('[data-exam-dwb=\"Matematik-w\"]'), sy: Math.round(scrollY), acikModal: [...document.querySelectorAll('.modal-overlay.open')].map((m) => m.id), secili: document.activeElement ? document.activeElement.tagName + ':' + (document.activeElement.dataset ? Object.keys(document.activeElement.dataset).join(',') : '') : '-'}))));
    await yaz('[data-exam-dwb="Matematik-w"]', '7', {kareBasina: 3});
    await page.evaluate(() => {
      const yaz = (sel, v) => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.value = v;
        el.dispatchEvent(new Event('input', {bubbles: true}));
        el.dispatchEvent(new Event('change', {bubbles: true}));
      };
      const d = {'Matematik': [23, 7], 'Biyoloji': [7, 3]};
      Object.keys(d).forEach((l) => {
        yaz('[data-exam-dwb="' + l + '-d"]', String(d[l][0]));
        yaz('[data-exam-dwb="' + l + '-w"]', String(d[l][1]));
      });
    });
    await bekle(500);
    memBuf = null;
    await kareAl();
    await tut(18);

    olay('hata-satirlari', 'Her yanlış için konu + neden — kör nokta burada çıkıyor', 3);
    await kaydir(430, {adim: 18});
    await tut(14);
    for (let tur = 0; tur < 3; tur++) {
      const kotu = await page.evaluate(() => {
        const doldur = (el, idx) => {
          if (!el) return 'yok';
          const d = [...el.options].map((o) => o.value).filter(Boolean);
          if (!d.length) return 'bos';
          const v = d[Math.min(idx, d.length - 1)];
          el.value = v;
          el.dispatchEvent(new Event('change', {bubbles: true}));
          if (typeof window.ddSync === 'function') window.ddSync(el);
          return el.value === v ? 'ok' : 'kötü';
        };
        const c = [];
        document.querySelectorAll('[data-err$=":topic"]').forEach((el, i) => c.push(doldur(el, i < 3 ? 0 : i % 4)));
        document.querySelectorAll('[data-err$=":type"]').forEach((el, i) => c.push(doldur(el, i % 3)));
        return c.filter((s) => s !== 'ok' && s !== 'yok').length;
      });
      if (!kotu) break;
      await bekle(320);
    }
    memBuf = null;
    await kareAl();
    await tut(20);
    await kaydir(300, {adim: 20});
    await tut(10);
    await kaydirHedefe('[data-act="saveExam"]', {adim: 26, sonra: 24});
    olay('deneme-kayit', 'Kayıt anında Acil Çalışılacaklar listesi kurulur', 3);
    await tut(22);
    await kaydir(330, {adim: 16});
    await tut(30);

    // ============ 3 · KONU TAKİBİ ============
    olay('acil-liste', 'Acil Çalışılacaklar: en çok net getirecek konu en üstte', 4);
    await tik('[data-nav="tracking"]', {ad: 'Konu Takibi', sonra: 18});
    await tut(12);
    await kaydir(100, {adim: 16});
    await tut(28);
    olay('calis', 'Çalış: beş adım, tek tek', 4);
    await tik('[data-act="startStudy"]', {ad: 'Çalış', git: 16, sonra: 24});
    await tut(22);

    for (let i = 0; i < 4; i++) {
      await tik('[data-act="completeStep"][data-step="' + i + '"]', {ad: 'adım ' + (i + 1), git: 10, sonra: 12, deneme: 3});
      await tut(6);
    }
    olay('adimlar', 'Dört adım bitti — sıra kısa kontrolde', 4);
    await tut(12);

    // ============ 4 · KISA KONTROL ============
    olay('kisa-kontrol', 'Beş soruluk kısa kontrol: gerçekten öğrendin mi?', 5);
    await tik('[data-bkt-test]', {ad: 'Kısa Kontrol', git: 16, sonra: 28});
    for (let q = 0; q < 5; q++) {
      const bilgi = await page.evaluate(() => {
        const m = document.getElementById('bkt-test-modal');
        if (!m || !m._bktQuestions) return null;
        const i = Number(m._bktIdx) || 0;
        const s = m._bktQuestions[i];
        return s ? {i, dogru: Number(s.dogru_index), adet: m.querySelectorAll('[data-bkt-secim]').length} : null;
      });
      if (bilgi) {
        const hedef = q === 2 ? (bilgi.dogru + 1) % Math.max(1, bilgi.adet) : bilgi.dogru;
        await tik('[data-bkt-secim="' + hedef + '"]', {ad: 'soru ' + (q + 1), git: 12, sonra: 10, deneme: 2});
      }
      await tik('[data-bkt-next]', {ad: q === 4 ? 'testi bitir' : 'sonraki soru', git: 8, sonra: 10, deneme: 3});
    }
    await bekle(700);
    memBuf = null;
    await kareAl();
    await tut(18);
    olay('neden', 'Yanlışın nedeni kayda geçer — sonraki öncelik buna göre', 5);
    // modal içeriğini sonuna kadar kaydır (düğme modalın altında kalıyor)
    for (let i = 0; i < 8; i++) {
      const kaydi = await page.evaluate(() => {
        const m = document.getElementById('bkt-test-modal');
        if (!m) return false;
        const k = [...m.querySelectorAll('div')].find((d) => d.scrollHeight > d.clientHeight + 40);
        if (!k) return false;
        if (k.scrollTop + k.clientHeight >= k.scrollHeight - 8) return false;
        k.scrollTop = Math.min(k.scrollHeight, k.scrollTop + Math.round(k.clientHeight * 0.55));
        return true;
      });
      if (!kaydi) break;
      await bekle(140);
      memBuf = null;
      await kareAl();
    }
    await tut(10);
    for (let tur = 0; tur < 3; tur++) {
      const secili = await page.evaluate(() => {
        const sels = [...document.querySelectorAll('#bkt-test-modal [data-bkt-reason]')];
        sels.forEach((s) => {
          const v = [...s.options].map((o) => o.value).filter(Boolean)[0];
          if (v) { s.value = v; s.dispatchEvent(new Event('change', {bubbles: true})); s.dispatchEvent(new Event('input', {bubbles: true})); }
        });
        return sels.map((s) => s.value);
      });
      await bekle(400);
      memBuf = null;
      await kareAl();
      await tut(tur === 0 ? 18 : 8);
      await tik('[data-bkt-finalize-test]', {ad: 'nedenleri kaydet', sonra: 18, deneme: 4});
      await bekle(1200);
      memBuf = null;
      await kareAl();
      if (await merkez('[data-bkt-close-test]')) {
        log.adim = {nedenler: secili, tur};
        break;
      }
      log.hatalar.push('finalize tur ' + tur + ' → ' + await page.evaluate(() => { const m = document.getElementById('bkt-test-modal'); return m ? m.innerText.replace(/\n+/g, ' · ').slice(0, 90) : 'modal yok'; }));
    }
    await tut(26);
    await tik('[data-bkt-close-test]', {ad: 'sonucu kapat', sonra: 14, deneme: 8});

    // ============ 5 · KONU TAMAM → HAFIZA ============
    olay('konu-tamam', 'Konu tamam → tekrar takvimi kurulur', 5);
    await tik('[data-act="completeTopic"]', {ad: 'Konuyu tamamla', git: 14, sonra: 28, deneme: 4});
    await kaydir(470, {adim: 20});
    await tut(34);
    olay('hafiza', 'Hafıza gücü ve tekrar günü — zayıf konu kırmızı', 6);

    // ============ 6 · BİLDİRİM ============
    olay('bildirim', 'Tekrar zamanı gelince bildirim düşer', 6);
    await tik('.sidebar-footer [data-act="openNotif"]', {ad: 'Bildirimler', git: 18, sonra: 28});
    await tut(22);
    await kaydir(140, {adim: 14});
    await tut(28);
    await tik('[data-act="closeModal"]', {ad: 'kapat', git: 12, sonra: 12, deneme: 4});

    // ============ 7 · TEKRAR + HAFIZA BARI ============
    olay('tekrar', 'Tekrar günü geldiyse kart zorunlu', 6);
    await tik('[data-nav="tracking"]', {ad: 'Konu Takibi', sonra: 16});
    await kaydir(720, {adim: 24});
    await tut(30);
    await tik('[data-act="reviewTopic"]', {ad: 'Tekrar Ettim', git: 16, sonra: 28, deneme: 5});
    for (let c = 0; c < 4; c++) {
      if (!(await merkez('[data-kart-goster]'))) break;
      await tik('[data-kart-goster]', {ad: 'kart ' + (c + 1), git: 10, sonra: 14, deneme: 2});
      if (!(await merkez('[data-kart-puan="bildi"]'))) break;
      await tik('[data-kart-puan="bildi"]', {ad: 'bildim', git: 10, sonra: 14, deneme: 3});
    }
    await page.evaluate(() => { const b = document.querySelector('[data-kart-kapat]'); if (b) b.click(); });
    await bekle(500);
    memBuf = null;
    await kareAl();
    await tut(26);
    olay('hafiza-yenilendi', 'Tekrar yapıldı: hafıza barı yükseldi', 6);
    await kaydir(-800, {adim: 50});
    await tut(24);

    // ============ 8 · KAPANIŞ ============
    olay('kapanis', 'Bugün ne çalışacağın tek ekranda: Analiz Merkezi', 0);
    await tik('[data-nav="dashboard"]', {ad: 'Ana Sayfa', sonra: 28});
    await tut(42);
    await kaydir(340, {adim: 16});
    await tut(32);
    await kaydir(-340, {adim: 30});
    await tut(54);

    log.kare = n;
    fs.writeFileSync(path.join(CIKTI, 'akis.json'), JSON.stringify(log));
    console.log(JSON.stringify({kare: n, sure: +(n / 30).toFixed(1), olaylar: log.olaylar.length, tik: log.tikler.length, hatalar: log.hatalar.slice(0, 10)}, null, 1));
  } finally {
    await browser.close();
  }
})().catch((e) => { console.error('HATA:', e); process.exit(1); });
