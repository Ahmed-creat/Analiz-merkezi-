# Son Kontrol Raporu — 10. Sınıf Soru Havuzları

> Tarih: 2026-11-16 · Dal: `arena/4cc1805b-analiz-merkezi`
> Kapsam: **313 havuz dosyası · 3.423 soru · 3.423 flashcard**
> (142 plan şemalı `_tNN_cNN` + 171 eski şemalı `_uNN_kNN` konu havuzu)

## 1. Kapılar — hepsi geçti

| Kapı | Sonuç |
| --- | --- |
| `havuz-son-kontrol.js` (tüm dosyalar) | 313 dosya · **0 hata** · 60 üslup uyarısı · ağaç kapsamı 170/180 |
| `havuz-denetle.js --tumu` (plan şeması) | 142 dosya · **0 hata · 0 uyarı** |
| `soru-uret-dogrula.js` | 313 dosya · 1.499 soru (plan) · görselli 146 · plan dışı 0 · **TÜM KURALLAR GEÇTİ** |
| `havuz-index-uret.js --plan --kontrol` | 313 havuz · 3.423 soru · kapsanan **142/158** |
| `npm run -s validate:pools` | hepsi geçerli |
| `npm run -s test:hepsi` | **67/67** |
| `durum.js` | TDE 29/29 konu · 290 soru · toplam 171/171 havuz · 1.789/1.788 soru · kart 1:1 |

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
| Din Kültürü | 33 | 372 | 372 | 0 |
| Biyoloji | 33 | 340 | 340 | 39 |
| Tarih | 26 | 292 | 292 | 5 |
| Türk Dili ve Edebiyatı | 29 | 290 | 290 | 0 |
| **TOPLAM** | **313** | **3.423** | **3.423** | **222** |

Kontrol edilen ortak ölçütler: soru = kart eşliği, boş şık, `dogru_index`
aralığı, kök ve çözüm uzunluğu, mükerrer `soru_id` / soru metni / `topic_key`,
kart önünün soru kökünü tekrar etmemesi, `topic_key` ile `konular.js` ağacının
uyuşması. Doğru şık dağılımı dengeli: `{0: 944, 1: 924, 2: 713, 3: 842}`.

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

## 4. Açık konular (karar bekliyor)

| # | Konu | Durum / öneri |
| --- | --- | --- |
| 1 | **Din Kültürü 10 ağacı 2018 müfredatı, havuzlar 2025 TYMM** | Havuzlar Bilgi Bankası kayıt defterindeki 13 yeni konuya göre yazıldı; uygulama ağacı ise eski 15 başlığı taşıyor. Örn. `din_10_u01_k01` "İslam'da Bilgi ve Bilginin Kaynakları" içeriği, ağaçta "1.1 Kur'an-ı Kerim ve Özellikleri" başlığı altında görünüyor; `din_10_u04_*` (çevre/teknoloji) "Hz. Muhammed'in Hayatı / Mekke / Medine" başlıklarında. Öneri: `konular.js` din ağacı TYMM başlıklarına güncellensin (ağaç 180 → 178 konu). Ayrıca `din_10_u02_k03`, `din_10_u02_k04`, `din_10_u03_k04` yeni müfredatta olmayan eski konular. |
| 2 | **10 ağaç konusu havuzsuz** | Biyoloji 5 (1.3, 1.6, 2.5, 2.7, 2.8), Kimya 2 (1.2.2, 3.1.1), Tarih 2 (2.2, 2.4), TDE 1 (Paragraf — kullanıcı kararıyla üretilmedi). İstenirse sıradaki üretim turu bunlar olabilir. |
| 3 | **60 üslup uyarısı** | Doğru şık, diğer şıklardan belirgin uzun (> ortalama × 1,7 ve > 12 karakter fark); cevap metinden okunabiliyor. İstenirse en yüksek farklılar kısaltılır. |
| 4 | **`kim_10_t02_c08` hedef 10, soru 11** | Fazla soru hata değil (`≥ hedef`), bilgi amaçlı kaydedildi. |

## 5. Yeni / güncellenen araçlar

- `docs/uretim/araclar/havuz-son-kontrol.js` — 313 dosyayı tek geçişte denetler
  (yapı, soru/kart, mükerrer kayıt, kart önü–kök, şık dengesi, `topic_key` ↔
  ağaç, ağaç kapsamı). `--ayrinti` tüm listeyi yazdırır.
- `docs/uretim/uretim/yama-eski-havuzlar.js` — üreticisi olmayan eski şemalı
  havuzların kalıcı yaması (`--kontrol` ile yalnız bakar).
- `scripts/havuz-index-uret.js` — `topic_key` çakışması çözümü + havuz
  dosyasını kaynak alma.
- `docs/uretim/araclar/durum.js` — kapı komutları listesine yeni araç eklendi.
