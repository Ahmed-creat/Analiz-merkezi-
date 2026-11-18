# Tanıtım filmi — yapım notu (v3, tek anlatı)

`teslim/Analiz-Merkezi-tanitim-filmi.mp4` · 1920×1080 · 30 fps · **94,0 sn (2.820 kare)** · müzikli
Remotion kompozisyonu: `Tanitim` (`src/pazarlama/Tanitim.tsx`)

v3, v2'nin (“bilim belgeseli + sonradan eklenen ürün reklamı”) mimarisini terk ediyor.
Bilim artık ayrı bir bölüm değil: **her bilimsel bulgu, uygulamanın o bulguyu hayata
geçiren gerçek ekranıyla aynı sahnede** anlatılıyor. Araya konan 5,5 saniyelik köprü
sahnesi kaldırıldı; yerine anlatım mimarisi değişti.

Ekranda yalnız gerçek arayüz var. Hiçbir ekran çizilmedi, hiçbir özellik uydurulmadı;
tüm görüntüler uygulamanın kendi kaydından (`public/kayit/kayit.mp4`, 1920×1080,
30 fps, 71 sn) alınır — tarayıcı penceresi çerçevesi içinde, gerçek zamanlı akış
olarak. Logo uygulamanın kendi logosu (`public/promo/logo.png`).

> **Videoda tanıtım rakamı yok.** “Şu kadar soru”, “şu kadar net arttı” gibi ifadeler
> kullanılmaz; mock veri yalnız arayüzün içinde görünür. Net artışı, başarı garantisi,
> performans istatistiği vaat edilmez.

## Anlatı akışı (kare @30fps)

| # | Sahne | Kare | Süre | Anlatı | Ekranda (gerçek) |
|---|-------|------|------|--------|------------------|
| 1 | Problem | 0–210 | 7,0 s | “Çok çalışıyorsun.” → “**Net artmıyor.**” → “Sorun … **neyi, neden ve ne zaman** çalıştığın.” | — (koyu, marka köşesi) |
| 2 | Unutma | 210–630 | 14,0 s | Ebbinghaus (1885): %100 → %58 (20 dk) → %33 (1. gün) → %21 (31. gün); aralıklı tekrar eğriyi yassılaştırır | Eğri büyüyerek **Öğrenme Durumu · Hafıza Gücü** ekranına dönüşür (tekrar günü kırmızı kartlar, 1·3·7·14·28) |
| 3 | Hatırlama | 630–930 | 10,0 s | Test etkisi: bir hafta sonra %61 (kendini sınama) vs %40 (tekrar okuma) — Roediger & Karpicke 2006 | Çubuklar **Kısa Kontrol** ekranına açılır: 4–5 soruluk kontrol, “doğru cevap ↔ senin cevabın”, “Neden yanlış yaptın?” |
| 4 | Deneme | 930–1320 | 13,0 s | Okulizyon bağlantısı ya da elle giriş; ders ders doğru/yanlış/boş; her yanlış konusu ve nedeniyle kaydedilir | Denemelerim (net gelişimi, son denemeler, ders detayları) → deneme formu |
| 5 | Kök neden | 1320–1650 | 11,0 s | Dört neden: konuyu bilmiyordum · anlamadım · işlem hatası · dikkatsizlik → liste anında kurulur | Yanlış satırlarında konu + neden seçimleri (gerçek dropdown’lar) |
| 6 | Acil + Çalışma | 1650–2130 | 16,0 s | Acil Çalışılacaklar → Çalış: beş adım (ön test, aktif çalışma, çözümlü örnek, karmaşık pratik, kısa kontrol); adım bitmeden sonraki açılmaz | Acil listesi → Bilgi Bankası çalışma yol haritası (kilitli 4. ve 5. adım) → kısa kontrol |
| 7 | Hafıza | 2130–2520 | 13,0 s | Konu bitince takip başlar; tekrar 1·3·7·14·28. gün; tekrar günü kartlar zorunlu | Konu Takibi: hafıza gücü barları, “Tekrar Et” kartları, hafıza %’leri |
| 8 | Kapanış | 2520–2820 | 10,0 s | Ölç › Teşhis › Plan › Kanıtla › Tekrar (her adımın altında gerçek ekran) → logo → “**Bilimi, günlük çalışma planına çevirir.**” → “**Her yanlış, bir sonraki adım.**” → analiz-merkezi.vercel.app | Beş gerçek ekran kırpması |

Toplam **2.820 kare = 94,0 sn**. Sahne sayısı sekiz; tekrar eden, bağımsız slayt yok.

## Bilim → uygulama (aynı sahne)

| Sahne | Dayanak | Uygulamada karşılığı |
|-------|---------|----------------------|
| 2 · Unutma | Hermann Ebbinghaus, 1885 (20 dk %58 · 1. gün %33 · 6. gün %25 · 31. gün %21) | Hafıza gücü göstergesi; hafıza %’si düşen konu kırmızı |
| 2 · Aralıklı tekrar | Cepeda vd. 2006/2008 (aralıklı tekrar lehine) | Tekrar takvimi `1 · 3 · 7 · 14 · 28` gün; tekrar günü kart zorunlu |
| 3 · Test etkisi | Roediger & Karpicke, 2006, *Psychological Science* (1 hafta: %61 test / %40 tekrar okuma; 5 dk’lık testte sıra ters döner) | Konu sonunda 5 soruluk kısa kontrol; geçilmezse konu kapanmıyor |
| 5 · Kök neden | Hata nedeni sınıflandırması (konu eksikliği / anlama / işlem / dikkat) | Her yanlış satırında konu + neden kaydı |

Oranlar kesin sonuç gibi sunulmaz: değerler deneysel ölçüm olarak, kaynağıyla ve
“kişiye/konuya göre değişebilir” notuyla verilir.

## Müzik

- Parça: **özgün sentez** — `tanitim/scripts/muzik.py` ile üretildi (`public/muzik.mp3`,
  95,00 sn, 192 kbps stereo). Am–F–C–G pad + bas + 92 bpm kick + pluck + shimmer,
  delay ve baş/son fade.
- Lisans: tamamen bu proje için üretildi; üçüncü taraf kayıt, sample veya telif
  içermez. YouTube/Vercel/Instagram gibi platformlarda **atıf gerekmez**, ticari
  kullanım serbest.
- Film 94,0 sn olduğu için kesme/loop gerekmiyor; ses seviyesi `0,5` ile baştan
  1,5 sn, sondan 3 sn yumuşak fade’leniyor (Remotion `volume` eğrisi).
- Not: başlangıçta MiroMaxMusic “Modern Technology And Applications (No Copyright
  Music)” (Pixabay Content License) düşünüldü; bu ortamda indirilemediği için aynı
  işlevi gören özgün parça üretildi. Lisanslı dosya gelirse `public/muzik.mp3` ile
  değiştirilir; film ≤ 95 sn olduğu sürece başka değişiklik gerekmez.

## Görsel dil

- Koyu aktlar `#06090F` + mavi ışık; uygulama aktları `#FBFCFE → #E6EEFA`.
  Bilimden uygulamaya geçiş **keskin renk kırılmasıyla değil**, grafik/çubuğun
  gerçek ekrana dönüşmesiyle yapılır (S2 ve S3’te panel grafiğin/çubukların
  içinden büyür); S3 sonu açık zemine, S7 sonu koyuya yumuşak geçer.
- Tipografi: Inter (400/600/700/800). Vurgu `#1D4ED8`, problem `#FBBF24`.
- Her sahnede sürekli kamera hareketi: yavaş push-in, sabit sol kenar (uygulamanın
  kendi sidebar’ı kırpılmaz), sahne sonunda bir sonraki sahneye bağlanan hareket.
- Alt köşede anlatı kartı (`Anlati`): 1–2 cümlelik, zamanlanmış altyazı; sağ altta
  7 bölümlük ilerleme göstergesi.

## Teknik

- Kayıt akışı `OffthreadVideo` ile `startFrom` + `playbackRate` kullanılarak
  sahnelere bölünür (her sahnenin gerçek ekran penceresi):

  | Sahne | `startFrom` | `playbackRate` | Kaynaktaki olay |
  |-------|------------|----------------|-----------------|
  | 2 | 1384 | 0,55 | Hafıza Gücü ekranı |
  | 3 | 893 | 1,35 | Kısa kontrol |
  | 4 | 164 | 0,62 | Denemelerim → deneme formu |
  | 5 | 400 | 0,64 | Yanlış satırları + neden seçimi |
  | 6 | 618 | 0,75 | Acil listesi → çalışma adımları |
  | 7 | 1500 | 0,60 | Tekrar / hafıza kartları |

- Zaman çizelgesi `SURE` sabitleriyle tanımlı; toplam `TANITIM_TOPLAM` (2.820 kare)
  `Root.tsx`’te kompozisyon süresi olarak kullanılıyor.
- Unutma eğrisi gerçek ölçüm noktalarından monoton kübik (Fritsch–Carlson)
  interpolasyonla çizilir (`src/pazarlama/egri.tsx`).
- Bileşenler: `parcalar.tsx` → `Pencere` (tarayıcı çerçevesi), `Anlati`, `MarkaKose`,
  `Gren`, `KoyuZemin`, `AcikZemin`, `Etiket`, `Baslik`, `Marka`.

Yeniden üretmek için:

```bash
cd tanitim
# bu makinede (2 çekirdek / 3 GB) tek seferlik render bellek nedeniyle düşüyor;
# film parçalara bölünüp birleştiriliyor ve müzik sonradan ekleniyor:
LD_LIBRARY_PATH=/tmp/chromium-libs/lib npx remotion render src/index.ts Tanitim out/parca/p1.mp4 --muted --frames=0-939    --concurrency=2
LD_LIBRARY_PATH=/tmp/chromium-libs/lib npx remotion render src/index.ts Tanitim out/parca/p2.mp4 --muted --frames=940-1879 --concurrency=2
LD_LIBRARY_PATH=/tmp/chromium-libs/lib npx remotion render src/index.ts Tanitim out/parca/p3.mp4 --muted --frames=1880-2819 --concurrency=2

printf "file 'p1.mp4'\nfile 'p2.mp4'\nfile 'p3.mp4'\n" > out/parca/list.txt
ffmpeg -f concat -safe 0 -i out/parca/list.txt -c copy out/parca/video.mp4
ffmpeg -i out/parca/video.mp4 -i public/muzik.mp3 \
  -filter_complex "[1:a]atrim=0:94,volume=0.5,afade=t=in:st=0:d=1.5,afade=t=out:st=91:d=3[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart out/tanitim-pazarlama.mp4
```

(Parça sınırları sahne sınırlarına denk gelir: 940 = S4 başı, 1880 = S7 ortası; birleştirmede
görüntü sıçraması yok.)

## QC kontrol listesi (v3)

- [x] Sahne kopukluğu yok; her sahne öğesi sonrakine bağlanıyor (eğri → hafıza ekranı,
      çubuklar → kısa kontrol, neden seçimi → acil listesi, adımlar → kısa kontrol).
- [x] Bilim ↔ özellik eşleşmesi aynı sahnede kuruluyor; bağımsız slayt koleksiyonu yok.
- [x] Tüm ekranlar gerçek kayıttan; çizilmiş arayüz yok.
- [x] Türkçe karakterler doğru (ı, ş, ğ, ü, ö, ç), taşma/kırpılma yok.
- [x] Tanıtım rakamı, garanti, performans iddiası yok.
- [x] Müzik video süresine uygun, baş/son fade’li.
