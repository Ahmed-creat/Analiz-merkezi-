# Analiz Merkezi — tanıtım videoları

1920×1080 · 30 fps · Türkçe. Tanıtım filmi özgün müzikli, kullanım videosu sessiz. Videolardaki **her kare uygulamanın kendisinden**
alınmıştır (arayüz v83, dal ucu `arena/cc4de070-analiz-merkezi` @ `c48f51e`).
Elle çizilmiş arayüz yok. Uygulama kaynak dosyalarına **hiç dokunulmaz**.

| Video | Dosya | Süre | Amaç |
|-------|-------|------|------|
| **Tanıtım filmi** (lansman) | `teslim/Analiz-Merkezi-tanitim-filmi.mp4` | 94,0 sn | Tek anlatı: problem → bilim **aynı sahnede gerçek ekranla** → plan → kanıt → tekrar. Özgün müzikli. Yapım notu: `TANITIM-NOTU.md` |
| **Kullanım videosu** (v2) | `teslim/Analiz-Merkezi-tanitim-v2.mp4` | 79,1 sn | Uygulamanın gerçek kullanımı, tek kesintisiz akış. Bu README bu videoyu anlatır. |

Kompozisyonlar: `Tanitim` (film) ve `AnaVideo` (kullanım) — ikisi de `src/index.ts` içinde.

## Kullanım videosu (v2)

## Neden “gerçek ekran kaydı” değil?

Bu ortamda tarayıcı kare üretimi ölçüldü: CDP screencast **0–2 kare/sn** veriyor
(uygulamadaki gizli modal katmanlarında `backdrop-filter: blur(4px)` yazılım boyamasını
saniyelere çıkarıyor). Tek kare ekran görüntüsü ise **194 ms** (1080p).

Bu yüzden kare yakalama hızı video hızından ayrıldı: betik uygulamayı gerçek tıklamalarla
sürüyor, her karede küçük bir adım ilerletiyor ve ekran görüntüsü alıyor. Kareler 30 fps’te
oynatıldığı için hareket akıcı, içerik gerçek oluyor.

```
uygulama (gerçek tıklamalar)  →  scripts/akis-kare.js  →  2138 kare (30 fps)
        →  out/kayit.mp4  →  Remotion (kamera · imleç · tık dalgası · altyazı)  →  MP4
```

## Sahne haritası

| Bölüm | Kare | Süre | İçerik |
|-------|------|------|--------|
| Açılış | 0–96 | 3,2 s | Marka + “Deneme analizi → günlük çalışma planı” |
| Akış | 96–2234 | 71,3 s | Tek kesintisiz gerçek kullanım akışı (aşağıdaki tablo) |
| Kapanış | 2234–2372 | 4,6 s | “Her yanlış, bir sonraki adım.” + canlı adres |

Akış olayları (`public/kayit/akis.json` → `olaylar`):

| Olay | Adım | Altyazı |
|------|------|---------|
| `acilis` | – | Beş deneme, 774 soru, 138 sayfa — hepsi tek ekranda |
| `ana-sayfa-grafik` | – | Net gelişimi · ders başarı oranı · acil konular |
| `denemelerim` | 1 | Okulizyon’dan otomatik çekim ya da manuel giriş |
| `deneme-formu` | 2 | Yeni deneme: ders ders doğru, yanlış, boş |
| `hata-satirlari` | 3 | Her yanlış için konu + neden — kör nokta burada çıkıyor |
| `deneme-kayit` | 3 | Kayıt anında Acil Çalışılacaklar listesi kurulur |
| `acil-liste` | 4 | Acil Çalışılacaklar: en çok net getirecek konu en üstte |
| `calis` | 4 | Çalış: beş adım, tek tek |
| `kisa-kontrol` | 5 | Beş soruluk kısa kontrol: gerçekten öğrendin mi? |
| `neden` | 5 | Yanlışın nedeni kayda geçer — sonraki öncelik buna göre |
| `konu-tamam` | 5 | Konu tamam → tekrar takvimi kurulur |
| `bildirim` | 6 | Tekrar zamanı gelince bildirim düşer |
| `tekrar` | 6 | Tekrar günü geldiyse kart zorunlu |
| `hafiza-yenilendi` | 6 | Tekrar yapıldı: hafıza barı yükseldi |
| `kapanis` | – | Bugün ne çalışacağın tek ekranda: Analiz Merkezi |

## Dosya düzeni

```
scripts/akis-kare.js      akışı kare kare yakalar (mock veri + gerçek tıklamalar)
scripts/mock-veri.js      ekranları dolduran öğrenci verisi (localStorage tohumu)
scripts/mufredat10.json   10. sınıf ders → konu listesi (mock veri tutarlılığı)
public/kayit/kayit.mp4    yakalanan akış (71,3 sn · 2138 kare · 6,1 MB)
public/kayit/akis.json    kare → imleç, tık anları, altyazı olayları
src/akis/Akis.tsx         kamera + imleç + tık dalgası + altyazı kartı
src/sahne/Acilis.tsx      açılış
src/sahne/Kapanis.tsx     kapanış
src/veri/tema.ts          marka renkleri
```

## Komutlar

```bash
# 1) Uygulamayı servis et (v83, dal ucu)
git fetch origin arena/cc4de070-analiz-merkezi
git archive FETCH_HEAD site | tar -x -C /tmp/site-son
python3 -m http.server 8081 --directory /tmp/site-son/site

# 2) Akışı kare kare yakala  (~2,5 dk, 2138 kare)
LD_LIBRARY_PATH=/tmp/chromium-libs/lib node scripts/akis-kare.js

# 3) Kareleri videoya çevir
ffmpeg -framerate 30 -i /tmp/kareler/f%05d.jpg -c:v libx264 -crf 17 -pix_fmt yuv420p out/kayit.mp4
cp out/kayit.mp4 public/kayit/kayit.mp4

# 4) Render  (~13 dk, 2372 kare)
LD_LIBRARY_PATH=/tmp/chromium-libs/lib npx remotion render src/index.ts AnaVideo out/tanitim-v2.mp4 --concurrency=2
```

Önizleme: `npm run studio` · Kare kontrolü: `npx remotion still src/index.ts AnaVideo out/kare.png --frame=760`

## Ses

Video sessiz teslim edildi. Tık sesleri istenirse `akis.json` içindeki `tikler` dizisi
(tık başına kare numarası) doğrudan ses yerleştirmede kullanılabilir.
