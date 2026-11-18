# Analiz Merkezi — tanıtım videosu (Remotion)

1920×1080 · 30 fps · 72,5 saniye · Türkçe. Uygulamanın **kendi arayüzüyle** çekilmiş
gerçek ekran görüntüleri üzerine kurulu, kodla üretilen bir tanıtım filmi.

Videoda gösterilen her ekran `../site/` altındaki canlı uygulamadan alınır. Uygulama
kaynak dosyalarına **hiç dokunulmaz**; tüm iş bu klasörde durur.

## Sahne haritası

| # | Sahne | Süre | İçerik |
|---|-------|------|--------|
| 1 | Açılış | 5,0 s | Uygulamanın gerçek simgesi, marka adı, alt başlık |
| 2 | Problem | 8,0 s | Eksik konu görünmüyor · net gelişimi ölçülemiyor · tekrarlar düzensiz |
| 3 | Genel görünüm | 7,0 s | Ana Sayfa ekranı, yavaş kamera kayması, modül etiketleri |
| 4 | Özellikler | 39,5 s | Altı özellik, gerçek ekranlarda zoom + imleç tıklamaları |
| 5 | Modüller | 6,0 s | Altı ekran bir arada (kaydırmalı ızgara) |
| 6 | Kapanış | 7,0 s | Marka mesajı + kapanış logosu |

Özellik sahneleri (her biri gerçek ekranla):

1. **Sınav ve net analizi** — Denemelerim → Yeni deneme formu
2. **Konu eksikleri ve öncelik puanı** — yanlış nedeni seçimi → Konu Takibi / Acil Çalışılacaklar
3. **Aralıklı tekrar** — tamamlanan konu paneli → hafıza kartı ("Erken Tekrar" tıklaması)
4. **Beş adımlı konu çalışması** — çalışma yol haritası → 5. adım → Kısa Kontrol sorusu → sonuç
5. **Günlük plan ve görevler** — Günlük Görevler → Planlama
6. **Soru bankası ve kitaplık** — Soru Bankası → Kitaplık

## Dosya düzeni

```
tanitim/
  src/
    index.ts                Remotion girişi
    Root.tsx                Kompozisyonlar (AnaVideo + sahne sahne önizleme)
    anaVideo.tsx            Zaman çizelgesi (tek video, altı sahne)
    fontlar.ts              Inter woff2 yüklemesi (render bekletilir)
    sahne/                  S1–S6 sahne bileşenleri + OzellikSahnesi
    bilesenler/             Zemin, Ekran (kamera), Imlec, Yazi (tipografi/perde)
    veri/                   Tema ve ekran/koordinat tabloları
  scripts/
    yakala.js               Uygulamayı açar, gerçek tıklamalarla ilerler, ekranları çeker
    al2-extract.js          Chromium için eksik sistem kütüphanelerini açar
    yakalama-kaydi.json     Yakalanan ekranların koordinat kaydı (imleç için)
  public/
    ekran/*.png             Uygulamadan alınan 3840×2160 görüntüler (19 adet)
    fonts/*.woff2           Inter (400/600/700/800, latin-ext → Türkçe karakterler)
    logo.png                Uygulamanın kendi simgesi (site/icons/icon-512.png)
  out/                      Render çıktısı (depoya girmez)
```

## Ekranları yeniden yakalamak

**Önemli:** çalışma ağacındaki `../site/` her zaman dal ucundaki sürüm olmayabilir.
Bu videoda kullanılan görüntüler, soru havuzlarının aktarıldığı **dal ucundan**
(`arena/4cc1805b-analiz-merkezi`) alınan sürümden çekildi:

```bash
git archive origin/arena/4cc1805b-analiz-merkezi site | tar -x -C /tmp/site-yeni
python3 -m http.server 8080 --bind 0.0.0.0 --directory /tmp/site-yeni/site   # 1. terminal
node scripts/yakala.js                                                       # 2. terminal
```

Çalışma ağacındaki `site/` klasöründe 36 havuz dosyası eksikti (dal ucunda 192 havuz /
2110 soru tam). Bu yüzden görüntüler dal ucundan yeniden çekildi.

`yakala.js` uygulamayı tarayıcıda açar, hoş geldin katmanını kapatır, 10. sınıf
Biyoloji 1.1 konusunu seçer, dört adımı tamamlar, **5 soruluk kısa kontrole gerçekten
girer** (4 doğru 1 yanlış → yanlış nedeni seçilir), konuyu tamamlar ve sonra sırayla
Konu Takibi, Günlük Görevler, Denemelerim, Soru Bankası, Kitaplık ve Planlama
ekranlarını çeker. Böylece videoda görünen sayılar (%100 hafıza, %90 yeterlilik,
19.11.2026 tekrar tarihi, 2 günlük seri) ekranda **gerçekten tıklanarak** üretilmiş
verilerdir; hiçbir grafik veya istatistik elle yazılmamıştır.

Yakalama sonrası ekranlar zaten 2× ölçekli (3840×2160) olduğu için yakınlaşmalar
kayıpsız kalır.

## Videoyu üretmek

```bash
npm install
npx remotion studio src/index.ts            # canlı önizleme
npm run render                              # out/tanitim.mp4
npx remotion still src/index.ts AnaVideo out/poster.png --frame=2120
```

### Bu ortama özgü notlar

Sistemde tarayıcı ve `libnss3` gibi kütüphaneler bulunmadığı için:

```bash
node scripts/al2-extract.js                       # al2023.tar.br → /tmp/chromium-libs
export LD_LIBRARY_PATH=/tmp/chromium-libs/lib
export CHROMIUM_PATH=$(node -e "import('@sparticuz/chromium').then(async m=>{console.log(await m.default.executablePath())})")
```

`remotion.config.ts` tarayıcıyı `CHROMIUM_PATH` (varsayılan `/tmp/chromium`) üzerinden
kullanır, yazılım OpenGL (`swangle`) ile çalışır ve eşzamanlılığı 2 tutar.
2 çekirdekli makinede tam render ~35 dakikadır.

## Kurgu notları

- Zemin koyu lacivert; ışık kütleleri ve ızgara çok yavaş kayar (hazır şablon hissi yok).
- Her sahne 8–18 karelik yumuşak karartmayla girer/çıkar.
- Kamera hareketleri `zoom` + `odak` çiftleriyle tanımlıdır; kenarlarda boşluk
  görünmemesi için kaydırma sınırlanır (`Ekran.tsx`).
- İmleç, ekran görüntüsüyle aynı koordinat uzayında çalışır (`Imlec.tsx`); tıklama
  anında dalga ve hafif basma animasyonu vardır.
- Alt şeritte altı özelliğin ilerleme çubuğu bulunur.
