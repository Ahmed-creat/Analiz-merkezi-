# Teslim notu — Analiz Merkezi tanıtım videosu

Tarih: 2026-11-18 · Dal: `arena/4cc1805b-analiz-merkezi`

## Ne teslim edildi

| Dosya | Açıklama |
|-------|----------|
| `out/tanitim.mp4` (kopyası `teslim/Analiz-Merkezi-tanitim.mp4`) | 1920×1080, 30 fps, H.264, 72,5 s |
| `src/` | Remotion kaynak kodu (6 sahne + bileşenler + tema) |
| `public/ekran/*.png` | Uygulamadan alınan 19 gerçek ekran görüntüsü (3840×2160) |
| `public/fonts/`, `public/logo.png` | Inter yazı tipleri (Türkçe karakterli) ve uygulamanın kendi simgesi |
| `scripts/yakala.js` | Ekranları uygulamadan otomatik çeken betik |
| `scripts/yakalama-kaydi.json` | Yakalama sırasında ölçülen düğme koordinatları (imleç hedefleri) |

## Hangi sürümden çekildi

Ekranlar **dal ucundaki** uygulamadan alındı:

```bash
git archive origin/arena/4cc1805b-analiz-merkezi site | tar -x -C /tmp/site-yeni
```

- Dal ucunda `site/content/soru_havuzlari` altında **192 havuz / 2110 soru** var; manifestin
  gösterdiği 192 dosyanın tamamı mevcut (`eksik dosya: 0`).
- Çalışma ağacındaki `site/` klasöründe 36 havuz dosyası eksikti; video bu yüzden
  önce yanlış (eski) sürümden çekilmişti, ardından **dal ucundan yeniden çekildi**.
- Arayüz kodu (`index.html`, `bkt-engine.js`, `kart.js`, `app-pwa.js`) iki sürümde birebir
  aynı; fark yalnızca soru havuzu dosyalarında.

## Ekranların gerçekliği

- Videoda görünen her ekran uygulamanın kendisinden alındı; elle çizilmiş arayüz yok.
- Videodaki sayılar (%100 hafıza, %90 yeterlilik, sıradaki tekrar 19.11.2026, 2 günlük seri)
  yakalama sırasında **gerçek tıklamalarla** üretildi: 10. sınıf Biyoloji 1.1 konusu seçildi,
  dört adım tamamlandı, 5 soruluk kısa kontrole gerçekten girildi (4 doğru, 1 yanlış →
  yanlışın nedeni seçildi), konu tamamlandı ve hafıza kartı oluştu.
- Uydurma istatistik, sahte grafik, olmayan özellik yok. Boş olan bölümler (ör. Acil
  Çalışılacaklar listesi) olduğu gibi gösterildi; anlatım metni mekanizmayı anlatır.
- Uygulama kaynak dosyalarına dokunulmadı; tüm üretim `tanitim/` altında.

## Kurgu

| # | Sahne | Süre | Not |
|---|-------|------|-----|
| 1 | Açılış | 5,0 s | Gerçek simge, dönen halka, marka adı |
| 2 | Problem | 8,0 s | Üç problem kartı, sıralı giriş |
| 3 | Genel görünüm | 7,0 s | Ana Sayfa, yavaş zoom, modül etiketleri |
| 4 | Özellikler | 39,5 s | Altı özellik; zoom, vurgu halkası, sanal imleç ve tıklama dalgası |
| 5 | Modüller | 6,0 s | Altı ekran, 3B eğimli ızgara |
| 6 | Kapanış | 7,0 s | "Eksiklerini gör. Planını kur. Tekrarı kaçırma." + logo |

Teknik: koyu lacivert zemin, Inter (uygulamanın kendi yazı tipi), sahne başına 8–18 karelik
yumuşak karartma, alt şeritte özellik ilerleme çubuğu, kamera kaydırmaları kenarlarda
boşluk bırakmayacak şekilde sınırlandırıldı.

## Kalite kontrol

- Kare önizlemeleri tek tek incelendi (sahne başları, geçişler, imleç tıklamaları).
- Türkçe karakterler doğru (ı, İ, ş, ğ, ç, ö, ü) — Inter `latin-ext` alt kümesi gömülü.
- Yazılar en küçük planda bile okunur (özellik sahnelerinde ekran kartı 1421 px,
  yakınlaşma 1,24–1,42 arası).
- Çıktı: `ffprobe` ile 1920×1080 / 30 fps / 2175 kare doğrulandı.

## Bilinen sınırlar

- Ses yok (video sessiz; istenirse ayrıca seslendirme/ müzik eklenebilir).
- Deneme/net grafiği sahnesinde grafik boş görünüyor: uygulamada grafik ancak en az 2
  deneme girildikten sonra çizilir; videoda uydurma deneme verisi girilmedi.
- Yeniden render bu ortamda ~35–45 dakika sürer (2 çekirdek, yazılım OpenGL).
