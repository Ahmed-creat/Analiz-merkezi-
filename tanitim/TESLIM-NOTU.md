# Teslim notu — Analiz Merkezi tanıtım videosu (v2)

Tarih: 2026-11-18 · Dal: `arena/4cc1805b-analiz-merkezi`

## Ne teslim edildi

| Dosya | Açıklama |
|-------|----------|
| `teslim/Analiz-Merkezi-tanitim-filmi.mp4` | **Tanıtım filmi (lansman):** problem → bilim → ürün. 1920×1080 · 30 fps · H.264 · **86,8 sn** · 2604 kare · ses yok. Yapım notu: `TANITIM-NOTU.md` |
| `teslim/poster-filmi.png` | Filmin kapak karesi |
| `teslim/Analiz-Merkezi-tanitim-v2.mp4` | **Kullanım videosu:** tek kesintisiz gerçek akış. 1920×1080 · 30 fps · H.264 · **79,07 sn** · 2372 kare · **16 MB** · ses yok |
| `teslim/poster.png` | Kapak karesi |
| `teslim/Analiz-Merkezi-tanitim.mp4` | İlk sürüm (v1, 72,5 sn) — arşiv olarak duruyor |
| `src/` | Remotion kaynağı: açılış · akış (kamera/imleç/altyazı) · kapanış |
| `public/kayit/kayit.mp4` | Gerçek arayüzden yakalanan akış (71,3 sn, 2138 kare) |
| `public/kayit/akis.json` | Kare → imleç konumu, tık anları ve altyazı olayları |
| `scripts/akis-kare.js` | Akışı kare kare yakalayan betik (gerçek tıklamalarla) |
| `scripts/mock-veri.js` | Ekranları dolduran gerçekçi öğrenci verisi (localStorage tohumu) |

## Hangi sürümden çekildi

Videodaki arayüz **`arena/cc4de070-analiz-merkezi` dalının ucu `c48f51e` (v83)**.
Vercel'de yayında olan sürümün aynısı.

```bash
git fetch origin arena/cc4de070-analiz-merkezi
git archive FETCH_HEAD site | tar -x -C /tmp/site-son
python3 -m http.server 8081 --directory /tmp/site-son/site
```

Uygulama kaynak dosyalarına **dokunulmadı**; tüm iş `tanitim/` altında.

## Videoda ne anlatılıyor (tek kesintisiz akış)

| # | Adım | Ne görünüyor |
|---|------|--------------|
| — | Açılış | Marka + “Deneme analizi → günlük çalışma planı” |
| 1 | Ana sayfa | 5 deneme · 774 soru · ort. net 67,45 · net gelişimi ve ders başarı grafikleri |
| 2 | Denemelerim | Okulizyon’dan çekilmiş 2 deneme + manuel giriş formu |
| 3 | Deneme girişi | TDE 27/3, Matematik 23/7 yazılıyor; her yanlış için **konu + neden** satırları |
| 4 | Analiz | Kayıt sonrası Acil Çalışılacaklar listesinin kurulması |
| 5 | Çalış | “Çalış” → 5 adımlı çalışma yol haritası, adımlar tek tek tamamlanıyor |
| 6 | Kısa kontrol | Gerçek 5 soruluk kontrol (Biyoloji · fotosentez), yanlışın nedeni seçiliyor |
| 7 | Konu tamam | “Tamamlandı — hafıza takibinde”, tekrar takvimi kuruluyor |
| 8 | Bildirim | Bildirim merkezi: “Yeni Konu Tamamlandı … ilk tekrar 19.11.2026” |
| 9 | Tekrar | “Tekrar Ettim · kartlar zorunlu” → kart turu (Bildim/Bilemedim) |
| 10 | Kapanış | “Her yanlış, bir sonraki adım.” + canlı adres |

## Ekranların gerçekliği

- Her kare **gerçek uygulamadan** alınan ekran görüntüsüdür; çizilmiş arayüz, uydurma
  grafik veya olmayan özellik yok.
- Sayılar gerçek veriden geliyor: `scripts/mock-veri.js` 10. sınıf müfredatına uygun
  **5 deneme, 12 soru çözümü, 3 kitap, 6 hafıza kaydı, 4 bildirim, 12 günlük seri**
  yazıyor (localStorage `analizmerkezi_v6`, uygulama şemasıyla birebir).
- Akış sırasındaki tüm tıklamalar gerçek: “Yeni Deneme Ekle”, ders ders doğru/yanlış,
  konu+neden seçimi, “Denemeyi Kaydet”, “Çalış”, 4 adım, 5 soruluk kısa kontrol,
  neden seçimi, “Konuyu tamamla”, bildirim, “Tekrar Ettim” ve 4 kart oylaması.
- Boş durum ekranı yok; her ekran dolu veriyle açılıyor.

## Yöntem (neden ham ekran kaydı değil)

Bu ortamda kare üretimi ölçüldü:

| Yöntem | Ölçüm |
|---|---|
| CDP screencast (`page.screencast`) | **0–2 kare/sn** (akıcı değil) |
| Tek kare ekran görüntüsü (1080p) | **194 ms** |

Neden: uygulamadaki gizli modal katmanlarında `backdrop-filter: blur(4px)` var; tarayıcı
bunları gizliyken de yazılımda bulanıklaştırıyor, boyama saniyelere çıkıyor.

Çözüm: **kare yakalama hızını video hızından ayırmak.** Betik uygulamayı gerçek
tıklamalarla sürüyor, her karede küçük bir adım ilerletiyor (kaydırma ~15 px, yazma
1 karakter, imleç interpolasyonu) ve her adımda ekran görüntüsü alıyor; kareler 30 fps’te
oynatılıyor. Böylece hareket akıcı, içerik gerçek kalıyor. Kamera yakınlaştırmaları, imleç,
tık dalgası, adım rozeti ve altyazılar Remotion’da ekleniyor.

## Bilinen sınırlar

- **Ses yok.** Sentetik tık sesleri istenirse `out/kayit.mp4` + `akis.json` tık anlarından
  birkaç dakikada eklenebilir; müzik dosyası ayrıca gerekiyor.
- Akış 1920×1080 yakalandı; kamera en fazla 1,18× yakınlaştırıyor (kaynak ölçek sınırı).
- Videoda yalnız tek öğrenci senaryosu (10. sınıf, TYT deneme düzeni) var.
