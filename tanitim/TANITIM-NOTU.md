# Tanıtım filmi (pazarlama) — yapım notu

`teslim/Analiz-Merkezi-tanitim-filmi.mp4` · 1920×1080 · 30 fps · **86,8 sn** · ses yok
Remotion kompozisyonu: `Tanitim` (`src/pazarlama/Tanitim.tsx`)

Bu video **kullanım videosu değil**: uygulamanın hangi problemi çözdüğünü, nasıl
çözdüğünü ve bunu hangi bilimsel bulguya dayandırdığını anlatan bir lansman filmi.
Ekranda yalnız gerçek arayüz var; hiçbir arayüz çizilmadı.

## Akış (kare @30fps)

| Bölüm | Kare | Süre | Ne anlatıyor |
|-------|------|------|--------------|
| Kanca | 0–210 | 7,0 s | “Çok çalışıyorsun.” → “Net artmıyor.” → “Sorun çalışmak değil, **zamanlama**.” |
| Unutma eğrisi | 210–690 | 16,0 s | Ebbinghaus (1885): %100 → 1. gün %33 → 31. gün %21; tekrarlarla eğri yassılaşıyor |
| Test etkisi | 690–840 | 5,0 s | Bir hafta sonra hatırlanan: tekrar okuma %40, kendini sınama %61 |
| Marka | 840–1000 | 5,3 s | “Analiz Merkezi — denemelerini bir çalışma planına çevirir.” |
| Özellik 1 | 1000–1204 | 6,8 s | Deneme girişi → net, sıralama, ders başarısı |
| Özellik 2 | 1204–1408 | 6,8 s | Kök neden: her yanlışta konu + neden |
| Özellik 3 | 1408–1612 | 6,8 s | Acil Çalışılacaklar: en çok net getirecek konu en üstte |
| Özellik 4 | 1612–1816 | 6,8 s | Beş adımlı çalışma, adım bitmeden sonraki açılmıyor |
| Özellik 5 | 1816–2020 | 6,8 s | Kısa kontrol: 5 soru, geçemezsen konu kapanmıyor |
| Özellik 6 | 2020–2224 | 6,8 s | Hafıza: 1 · 3 · 7 · 14 · 28. gün, kart zorunlu |
| Rakamlar | 2224–2374 | 5,0 s | 844 soru · 14 acil konu · %51 hafıza · 12 gün seri |
| Kapanış | 2374–2604 | 7,7 s | “Bugün ne çalışacağın belli.” · “Her yanlış, bir sonraki adım.” · analiz-merkezi.vercel.app |

Toplam **2604 kare = 86,8 sn**.

## Bilimsel dayanak

Videoda geçen her iddia, depodaki bilimsel notlarla ve uygulamanın kendi
mekanizmasıyla uyumlu:

| Videoda | Dayanak | Uygulamada karşılığı |
|---------|---------|----------------------|
| Unutma eğrisi %33 (1. gün) · %21 (31. gün) | Hermann Ebbinghaus, 1885 (ölçüm noktaları: 20 dk %58, 1 gün %33, 6 gün %25, 31 gün %21) | `bkt-engine.js` hafıza motoru: `R = e^(-t/S)` |
| Aralıklı tekrar eğriyi yassılaştırır | Cepeda vd. 2006 meta-analizi; aralık/sınav oranı kuralı Cepeda 2008 | `REVIEW_LADDER = [1, 3, 7, 14, 28]` gün |
| Aktif hatırlama: %61 vs %40 (1 hafta) | Roediger & Karpicke, 2006, *Psychological Science* | Konu bitince 5 soruluk kısa kontrol; geçilmezse konu kapanmıyor |
| Kök neden taksonomisi | Doignon & Falmagne 1985; Vuong vd. 2011 (ön koşul grafları, kök-neden teşhisi) | Hata nedeni: konu eksikliği / anlamadım / işlem hatası / dikkatsizlik |
| Öncelik = en çok net getiren konu | — (uygulamanın öncelik motoru) | `Acil Çalışılacaklar (Öncelik Sırası)` listesi |

Kaynak özetleri: `docs/Analiz_Merkezi_BKT_Dogrulama_Iliski_Grafi_Ajan_Raporu.md` §11.

## Görsel dil

- Koyu aktlar (problem + bilim) `#06090F` üzerine mavi/amber ışıklar; ürün aktları
  açık `#FBFCFE → #E6EEFA` degrade + ince ızgara. Apple lansman ritmi: koyu ikna,
  açık ürün.
- Tipografi: uygulamanın kendi yazı tipi **Inter** (400/600/700/800), 800 ağırlık,
  negatif harf aralığı. Vurgu rengi `#1D4ED8`, problem rengi `#FBBF24`.
- Ürün görselleri gerçek ekran görüntüleridir; tarayıcı penceresi çerçevesi içinde
  yumuşak yakınlaştırma (0,86×–1,55×) ve yavaş sürüklenme ile sunulur.
- Teknik terim yok: videoda “motor”, “model”, “algoritma”, “BKT” geçmiyor.

## Teknik

- Ekran görüntüleri kare kare kaydedilen akıştan alındı (`public/promo/*.png`).
- Her bölüm ayrı bir `Sequence`; giriş/çıkış animasyonları `yum` (smoothstep)
  eğrileriyle, kamera hareketleri ölçek + kaydırma ile.
- Unutma eğrisi gerçek ölçüm noktalarından monoton kübik (Fritsch–Carlson)
  interpolasyonla çizilir; tekrarlı eğri her tekrarda tepeye döner ve sönümü
  giderek yavaşlar.

Yeniden üretmek için:

```bash
LD_LIBRARY_PATH=/tmp/chromium-libs/lib npx remotion render src/index.ts Tanitim out/tanitim-pazarlama.mp4 --concurrency=2
```
