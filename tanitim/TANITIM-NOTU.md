# Tanıtım filmi (pazarlama) — yapım notu

`teslim/Analiz-Merkezi-tanitim-filmi.mp4` · 1920×1080 · 30 fps · **89,5 sn** · ses yok
Remotion kompozisyonu: `Tanitim` (`src/pazarlama/Tanitim.tsx`)

Bu video **kullanım videosu değil**: uygulamanın hangi problemi çözdüğünü, problemi
nasıl çözdüğünü ve bunu hangi bilimsel bulguya dayandırdığını anlatan bir lansman
filmi. Ekranda yalnız gerçek arayüz var; hiçbir arayüz çizilmedi. Logolar uygulamanın
kendi logosu (`public/promo/logo.png`, uygulamanın sidebar logosundan birebir alındı).

> **Videoda hiçbir tanıtım sayısı kullanılmaz.** “Şu kadar soru, şu kadar seri”
> gibi rakamlar mock veriden gelir ve izleyiciye bir şey söylemez; bu yüzden filmde
> yok. Sayılar yalnızca ekran görüntülerinin içinde (uygulamanın kendi arayüzünde)
> görünür — orası zaten gerçek kullanımın görüntüsü.

## Akış (kare @30fps)

| Bölüm | Kare | Süre | Ne anlatıyor |
|-------|------|------|--------------|
| Kanca | 0–210 | 7,0 s | “Çok çalışıyorsun.” → “**Net artmıyor.** Aynı konular. Aynı hatalar.” → “Sorun çalışmak değil, **zamanlama**.” |
| Unutma eğrisi | 210–690 | 16,0 s | Ebbinghaus (1885): %100 → 1. gün %33 → 31. gün %21; tekrarlarla eğri yassılaşıyor. “Uygulama bu takvimi senin yerine kurar.” |
| Test etkisi | 690–840 | 5,0 s | Bir hafta sonra hatırlanan: tekrar okuma %40, kendini sınama %61 |
| **Köprü** | 840–1005 | 5,5 s | Bilim → uygulama eşlemesi: *unutma eğrisi → tekrar takvimi*, *test etkisi → 5 soruluk kısa kontrol*, *kök neden → konu + neden kaydı*. “Sen denemeyi girersin; planı ve zamanlamayı uygulama kurar.” |
| Marka | 1005–1165 | 5,3 s | Logo + “Bilimi, günlük çalışma planına çevirir.” |
| Özellik 1 | 1165–1360 | 6,5 s | Deneme girişi → net, sıralama, ders başarısı |
| Özellik 2 | 1360–1555 | 6,5 s | Kök neden: her yanlışta konu + neden |
| Özellik 3 | 1555–1750 | 6,5 s | Acil Çalışılacaklar: en çok net getirecek konu en üstte |
| Özellik 4 | 1750–1945 | 6,5 s | Beş adımlı çalışma, adım bitmeden sonraki açılmıyor |
| Özellik 5 | 1945–2140 | 6,5 s | Kısa kontrol: 5 soru, geçemezsen konu kapanmıyor |
| Özellik 6 | 2140–2335 | 6,5 s | Hafıza: 1 · 3 · 7 · 14 · 28. gün, kart zorunlu |
| Döngü | 2335–2455 | 4,0 s | Ölç › Teşhis › Plan › Kanıtla › Tekrar — “Denemeyi girersin. Teşhisi, planı ve tekrarı uygulama kurar.” |
| Kapanış | 2455–2685 | 7,7 s | “Bugün ne çalışacağın belli.” · “Her yanlış, bir sonraki adım.” · analiz-merkezi.vercel.app |

Toplam **2685 kare = 89,5 sn**.

## Bilim → uygulama bağı

Videoda bilim bölümü ayrı bir “belgesel” gibi kalmaz; her bulgu uygulamanın hangi
mekanizmasına denk geldiğiyle birlikte gösterilir:

| Videoda | Dayanak | Uygulamada karşılığı |
|---------|---------|----------------------|
| Unutma eğrisi: %33 (1. gün) · %21 (31. gün) | Hermann Ebbinghaus, 1885 (20 dk %58, 1 gün %33, 6 gün %25, 31 gün %21) | Hafıza motoru `R = e^(-t/S)`; hafıza gücü göstergesi |
| Aralıklı tekrar eğriyi yassılaştırır | Cepeda vd. 2006 meta-analizi; Cepeda 2008 | `REVIEW_LADDER = [1, 3, 7, 14, 28]` gün; tekrar günü kart zorunlu |
| Aktif hatırlama: %61 vs %40 (1 hafta) | Roediger & Karpicke, 2006, *Psychological Science* | Konu sonunda 5 soruluk kısa kontrol; geçilmezse konu kapanmıyor |
| Kök neden teşhisi | Doignon & Falmagne 1985; Vuong vd. 2011 | Hata nedeni kaydı: konu eksikliği / anlamadım / işlem hatası / dikkatsizlik |

Kaynak özetleri: `docs/Analiz_Merkezi_BKT_Dogrulama_Iliski_Grafi_Ajan_Raporu.md` §11.

## Görsel dil

- Koyu aktlar (problem + bilim + köprü) `#06090F` üzerine mavi ışıklar; ürün aktları
  açık `#FBFCFE → #E6EEFA` degrade + ince ızgara. Apple lansman ritmi: koyu ikna,
  açık ürün.
- Tipografi: uygulamanın kendi yazı tipi **Inter** (400/600/700/800). Vurgu rengi
  `#1D4ED8`, problem rengi `#FBBF24`.
- Ürün görselleri gerçek ekran görüntüleridir; tarayıcı penceresi çerçevesinde
  0,86×–1,55× yakınlaştırma ve yavaş sürüklenme ile sunulur.
- Teknik terim yok: “motor”, “model”, “algoritma”, “BKT” geçmiyor.

## Teknik

- Ekran görüntüleri kare kare kaydedilen akıştan alındı (`public/promo/*.png`).
- Her bölüm ayrı bir `Sequence`; giriş/çıkış animasyonları `yum` (smoothstep)
  eğrileriyle.
- Unutma eğrisi gerçek ölçüm noktalarından monoton kübik (Fritsch–Carlson)
  interpolasyonla çizilir; tekrarlı eğri her tekrarda tepeye döner ve sönümü
  giderek yavaşlar.
- Logo `public/promo/logo.png`: uygulamanın sidebar logosu (WebP) çözülüp zemini
  saydamlaştırıldı.

Yeniden üretmek için:

```bash
LD_LIBRARY_PATH=/tmp/chromium-libs/lib npx remotion render src/index.ts Tanitim out/tanitim-pazarlama.mp4 --concurrency=2
```
