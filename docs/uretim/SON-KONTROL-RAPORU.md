# Son Kontrol Raporu — 10. Sınıf Soru Havuzları

> Tarih: 2026-11-16 · Güncelleme: 2026-11-17 · Dal: `arena/4cc1805b-analiz-merkezi`
> Kapsam: **309 havuz dosyası · 3.393 soru · 3.393 flashcard**
> (142 plan şemalı `_tNN_cNN` + 167 eski şemalı `_uNN_kNN` konu havuzu)
> Din Kültürü 10 ağacı ders kitabına göre yenilendi; 4 eski din havuzu arşivde.

## 1. Kapılar — hepsi geçti

| Kapı | Sonuç |
| --- | --- |
| `havuz-son-kontrol.js` (tüm dosyalar) | 309 dosya · **0 hata** · 52 üslup uyarısı · başlık eşleşmesi 172/182 |
| `havuz-denetle.js --tumu` (plan şeması) | 142 dosya · **0 hata · 0 uyarı** |
| `soru-uret-dogrula.js` | 309 dosya (142 geçerli · 167 eski şema) · 1.499 soru · görselli 146 · plan dışı 0 · **TÜM KURALLAR GEÇTİ** |
| `havuz-index-uret.js --plan --kontrol` | 309 havuz · 3.393 soru · kapsanan **142/158** |
| `npm run -s validate:pools` | hepsi geçerli |
| `npm run -s test:hepsi` | **67/67** + konu bulma 75/75 |
| `durum.js` | TDE 29/29 konu · 290 soru · toplam 171/171 havuz · 1.789/1.788 soru · kart 1:1 |
| `npm run -s test:konubulma` | **75/75** — 182 konunun tamamında Kısa Kontrol havuzu bulunuyor |

**Kritik not:** `havuz-denetle.js --tumu` ve `soru-uret-dogrula.js` yalnız plan
şemalı havuzları denetler. 171 eski şemalı konu havuzu bu iki kapının dışında
kalıyordu; kapsam boşluğu bu turda yeni `docs/uretim/araclar/havuz-son-kontrol.js`
aracıyla kapatıldı.

## 2. Ders bazında durum

| Ders | Havuz | Soru | Kart | Görselli |
| --- | --- | --- | --- | --- |
| Matematik | 42 | 526 | 526 | 70 |
| Fizik | 43 | 434 | 434 | 53 |
| Coğrafya | 36 | 395 | 395 | 8 |
| Felsefe | 33 | 387 | 387 | 0 |
| Kimya | 38 | 387 | 387 | 47 |
| Din Kültürü | 29 | 342 | 342 | 0 |
| Biyoloji | 33 | 340 | 340 | 39 |
| Tarih | 26 | 292 | 292 | 5 |
| Türk Dili ve Edebiyatı | 29 | 290 | 290 | 0 |
| **TOPLAM** | **309** | **3.393** | **3.393** | **222** |

Kontrol edilen ortak ölçütler: soru = kart eşliği, boş şık, `dogru_index`
aralığı, kök ve çözüm uzunluğu, mükerrer `soru_id` / soru metni / `topic_key`,
kart önünün soru kökünü tekrar etmemesi, `topic_key` ile `konular.js` ağacının
uyuşması. Doğru şık dağılımı dengeli: `{0: 914, 1: 924, 2: 713, 3: 842}`.

## 3. Bu turda düzeltilen 20 bulgu

Düzeltmeler `docs/uretim/uretim/yama-eski-havuzlar.js` (kalıcı, idempotent) ve
üretici dosyalar üzerinden yapıldı; JSON elle düzenlenmedi.

**a) Kart önü = soru kökü olan 12 soru** (kart soruyu tekrar ediyordu, tanım
vermiyordu) → kök senaryolaştırıldı, kart tanım olarak bırakıldı:

`cogr_10_u04_k02` s10 · `cogr_10_u06_k03` s1-s3 · `cogr_10_u06_k04` s10 ·
`din_10_u02_k04` s2 · `din_10_u03_k04` s3/s5 · `kimya_10_u02_k07` s1/s3/s7 ·
`kimya_10_u02_k08` s1/s7

**b) Tanım kalıbında kalmış 3 kısa kök** → senaryoya çevrildi:
`cogr_10_u05_k02` s10 (GSYH) · `din_10_u02_k03` s7 (zekât oranı) ve s8
(zekâtın verileceği kişiler)

**c) Tek satırlık 2 çözüm** → bağıntı + yerine koyma adımları açıldı:
`fizik_10_u01_k02` s7 (v = v₀ + a·t) · `kimya_10_u01_k03` s9 (n = m / Mₐ)

**d) `topic_key` çakışması** → `din_10_u05_k01`, `din_10_u04_k03` ile aynı
anahtarı ("4.3 Medine Dönemi") taşıyordu; Bilgi Bankası kayıt defterindeki
resmî adına çekildi. Ayrıca `havuz-index-uret.js` artık çakışmayı kendisi
çözüyor (ikinci kez aynı anahtarı kullanan havuz resmî konu adıyla etiketlenir)
ve `topic_key` için havuz dosyasını esas alıyor.

**e) Ağaç başlığı uyuşmazlığı** → üreticide düzeltildi, havuzlar yeniden
üretildi: `edebiyat_10_u02_k04` "Saf (Öz) Şiir Anlayışı" → **"Saf Şiir"**,
`edebiyat_10_u03_k05` "Zarflar (Belirteç)" → **"Zarflar (Belirteçler)"**.

## 4. Din Kültürü 10 — ağaç ders kitabına göre yenilendi (2026-11-17)

Din Kültürü 10 konularının uygulamada yanlış görünmesinin nedeni: ağaç 2018
müfredatının ünite yapısını taşıyordu (Kur'an-ı Kerim, İbadet, Ahlak, Hz.
Muhammed, Yorumlar), havuzlar ise 2025-2026 MEB kitabının (Türkiye Yüzyılı
Maarif Modeli) içeriğiyle yazılmıştı.

**Yapılanlar**

1. `konular.js` (ve `pwa-files/functions/konular.js`) 10. sınıf Din Kültürü
   listesi ders kitabının içindekilerine göre **15 → 17 konu** olarak yenilendi:
   İslam'da Varlık ve Bilgi · Allah'ı Tanımak · İslam'ın Evrensel Mesajları ·
   Din, Çevre ve Teknoloji · İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar
   (her ünitenin son konusu "Kur'an'dan Mesajlar"; ayet aralığı parantezde).
   Kaynak: `meb_kazanim_10.json` → DKAB.10.1.1 … DKAB.10.5.3 (17 öğrenme çıktısı).
2. Bilgi Bankası kayıt defterindeki `muf_10_din_kulturu_*` kayıtları (iki kopya)
   aynı listeyle üretildi.
3. Havuzlar içeriklerine göre yeni başlıklara bağlandı (12 havuz).
   `din_10_u01_k02` (bilgi kaynakları), aynı konunun parçası olduğu
   `din_10_u01_k01` ile birleştirildi → **27 soru**; dosya arşive taşındı.
4. Yeni müfredatta karşılığı olmayan 3 havuz arşive taşındı (silinmedi):
   `din_10_u02_k03` (Hac ve Zekât), `din_10_u02_k04` (Kur'an'ın ana konuları),
   `din_10_u03_k04` (Ahlakın temel kaynağı).
5. "Kur'an'dan Mesajlar" konularının havuzları plan şemasında olduğu için
   (`din_10_t01_c03` vb.) bu dosyalara ders kitabı başlığı yazıldı
   (`konuBasligiYaz`); manifest artık bu başlığı `topic_key` olarak kullanıyor.
6. Arşivlenen havuzların üretilen indekslerdeki izleri temizlendi
   (`scripts/arsiv-kayit-temizle.js`).

Sonuç: 10. sınıf 182 konunun **tamamında** Kısa Kontrol havuzu bulunuyor
(`npm run -s test:konubulma` → 75/75); Din Kültürü 17/17 başlık eşleşti.

## 5. Açık konular

| # | Konu | Durum |
| --- | --- | --- |
| 1 | **9 konuda birebir başlık eşleşmesi yok** | Biyoloji 1.3, 1.6, 2.5, 2.7, 2.8 · Kimya 1.2.2, 3.1.1 · Tarih 2.2, 2.4. Bunlar **havuzsuz değil**: plan şemalı havuzları var, ancak `topic_key`'leri kazanım cümlesi (ör. "1.3 Fotosentezde kullanılan ve üretilen maddelerle ilgili deney yapabilme"), ağaç başlığı değil. Uygulama normalize ederek buluyor (test 75/75). Tutarlılık için din'de yapıldığı gibi bu 9 havuzun da başlığı yazılabilir. |
| 2 | **TDE Paragraf** | Ağaçta konu var, havuz **bilinçli olarak üretilmedi** (kullanıcı talimatı: "uygulamada paragraf sorusu soramayız"). Dosya `arsiv/soru_havuzlari/edebiyat/edebiyat_10_u04_k06.json`. |
| 3 | **52 üslup uyarısı** | Doğru şık diğerlerinden belirgin uzun; cevap metinden okunabiliyor. |
| 4 | **`kim_10_t02_c08` hedef 10, soru 11** | Fazla soru hata değil (`≥ hedef`). |
| 5 | **`kazanim_konu_10.json` ve `konu_esleme.json` bayat** | Üreticileri yeniden çalıştırıldığında 10 bin satırlık fark ve eşleme kalitesi değişimi doğuyor; ayrı bir iş olarak ele alınmalı. Şimdilik yalnız arşiv izleri temizlendi. |

---

## 6. Yeni / güncellenen araçlar
## 5. Yeni / güncellenen araçlar

- `docs/uretim/araclar/havuz-son-kontrol.js` — 313 dosyayı tek geçişte denetler
  (yapı, soru/kart, mükerrer kayıt, kart önü–kök, şık dengesi, `topic_key` ↔
  ağaç, ağaç kapsamı). `--ayrinti` tüm listeyi yazdırır.
- `docs/uretim/uretim/yama-eski-havuzlar.js` — üreticisi olmayan eski şemalı
  havuzların kalıcı yaması (`--kontrol` ile yalnız bakar).
- `scripts/havuz-index-uret.js` — `topic_key` çakışması çözümü + havuz
  dosyasını kaynak alma.
- `docs/uretim/araclar/durum.js` — kapı komutları listesine yeni araç eklendi.
- `docs/uretim/uretim/din-konulari-guncelle.js` — Din Kültürü 10 ağacını,
  kayıt defterini ve havuz başlıklarını ders kitabına göre yeniler (idempotent).
- `docs/uretim/yazicilar/yaz.js` → `konuBasligiYaz()` — plan şemalı bir havuza
  Bilgi Bankası konu başlığı yazar.
- `scripts/arsiv-kayit-temizle.js` — arşive taşınan havuzların üretilen
  indekslerdeki izlerini temizler.
