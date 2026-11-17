# Son Kontrol Raporu — 10. Sınıf Soru Havuzları

> Tarih: 2026-11-16 · Güncelleme: 2026-11-17 · Dal: `arena/4cc1805b-analiz-merkezi`
> Kapsam: **316 havuz dosyası · 3.453 soru · 3.453 flashcard**
> (142 plan şemalı `_tNN_cNN` + 174 konu havuzu `_uNN_kNN`)
> Din Kültürü 10 ağacı ders kitabına göre yenilendi; 4 eski din havuzu arşivde.

## 1. Kapılar — hepsi geçti

| Kapı | Sonuç |
| --- | --- |
| `havuz-son-kontrol.js` (tüm dosyalar) | 316 dosya · **0 hata** · **0 üslup uyarısı** · başlık eşleşmesi 188/189 |
| `havuz-denetle.js --tumu` (plan şeması) | 142 dosya · **0 hata · 0 uyarı** |
| `soru-uret-dogrula.js` | 316 dosya (142 geçerli · 174 konu havuzu) · soru/kart eşi tam · görselli 146 · plan dışı 0 · **TÜM KURALLAR GEÇTİ** |
| `havuz-index-uret.js --plan --kontrol` | 316 havuz · 3.453 soru · kapsanan **142/158** |
| `npm run -s validate:pools` | hepsi geçerli |
| `npm run -s test:hepsi` | **67/67** + konu bulma 76/76 |
| `durum.js` | TDE 29/29 konu · 290 soru · toplam 171/171 havuz · 1.789/1.788 soru · kart 1:1 |
| `npm run -s test:konubulma` | **76/76** — 189 konunun tamamında Kısa Kontrol havuzu bulunuyor |

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
| Din Kültürü | 36 | 402 | 402 | 0 |
| Biyoloji | 33 | 340 | 340 | 39 |
| Tarih | 26 | 292 | 292 | 5 |
| Türk Dili ve Edebiyatı | 29 | 290 | 290 | 0 |
| **TOPLAM** | **316** | **3.453** | **3.453** | **222** |

Kontrol edilen ortak ölçütler: soru = kart eşliği, boş şık, `dogru_index`
aralığı, kök ve çözüm uzunluğu, mükerrer `soru_id` / soru metni / `topic_key`,
kart önünün soru kökünü tekrar etmemesi, `topic_key` ile `konular.js` ağacının
uyuşması. Doğru şık dağılımı dengeli: `{0: 926, 1: 942, 2: 725, 3: 860}`.

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

## 4. Din Kültürü 10 — ağaç ders kitabındaki alt konularla yenilendi (2026-11-17)

Din Kültürü 10 ağacı iki aşamada düzeltildi. İlk aşamada 2018 müfredatının
ünite yapısı (Kur'an-ı Kerim, İbadet, Ahlak, Hz. Muhammed, Yorumlar) terk
edilip 2025-2026 MEB kitabının üniteleri alındı. İkinci aşamada ise **ünite/ana
konu düzeyinde kalmanın eksik olduğu** görüldü: diğer derslerde konular 1.1,
1.1.1, 2.1.2 düzeyinde alt başlıklara iniyor, Din'de yalnız 1.1 / 1.2 düzeyi
vardı. Ağaç, ders kitabının içindekilerindeki **alt konu numaralarıyla**
yeniden kuruldu.

Kaynak: MEB Din Kültürü ve Ahlak Bilgisi 10 ders kitabı (2025, ISBN
978-975-11-8633-1) içindekiler bölümü.

**Yeni ağaç — 17 ana konu + 7 alt konu = 24 konu**

| Ünite | Konular |
| --- | --- |
| 1. İslam'da Varlık ve Bilgi | 1.1.1 İslam'da Bilginin Yeri · 1.1.2 İslam'da Bilgi Kaynakları (1.1'in alt başlıkları) · 1.2 Allah-Âlem İlişkisi · 1.3 Kur'an'dan Mesajlar |
| 2. Allah'ı Tanımak | 2.1 Allah'ın Varlığının Delilleri · 2.1.1 Kozmolojik · 2.1.2 Teleolojik · 2.1.3 Ontolojik · 2.1.4 Dinî Tecrübe Delili · 2.2 Allah'ı İsim ve Sıfatlarıyla Tanımak · 2.3 Kur'an'dan Mesajlar |
| 3. İslam'ın Evrensel Mesajları | 3.1 Tevhit İlkesi · 3.2 Adalet ve Eşitlik · 3.3 İslam ve Barış · 3.4 Kur'an'dan Mesajlar |
| 4. Din, Çevre ve Teknoloji | 4.1 İnsan, Çevre ve Ahlak · 4.2 Teknoloji ve Ahlak · 4.3 Çevre ve Teknoloji · 4.4 Kur'an'dan Mesajlar |
| 5. İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar | 5.1 Dinî Yorum Farklılıklarının Sebepleri · 5.2 İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar · 5.2.1 Ehlisünnet · 5.2.2 Şia · 5.3 Kur'an'dan Mesajlar |

1.1'in alt başlıkları (1.1.1, 1.1.2) ağaca doğrudan alındı; 1.1 üst başlığı
kendi başına konu olarak **tutulmadı**, çünkü elimizdeki 27 sorunun tamamı bu
iki alt başlığa dağılıyor ve genel bir "1.1" havuzu için artık soru kalmıyor.
2.1 ve 5.2'de ise hem üst başlığın hem alt başlıkların ayrı havuzu var.

**Havuzlar**

| Havuz | Konu | Soru |
| --- | --- | --- |
| `din_10_u01_k01` | 1.1.1 İslam'da Bilginin Yeri | 12 |
| `din_10_u01_k02` | 1.1.2 İslam'da Bilgi Kaynakları | 15 |
| `din_10_u01_k03` | 1.2 Allah-Âlem İlişkisi | 10 |
| `din_10_u02_k01` | 2.1 Allah'ın Varlığının Delilleri | 12 |
| `din_10_u02_k05` | 2.1.1 Kozmolojik Delil | 10 |
| `din_10_u02_k06` | 2.1.2 Teleolojik Delil | 10 |
| `din_10_u02_k07` | 2.1.3 Ontolojik Delil | 10 |
| `din_10_u02_k08` | 2.1.4 Dinî Tecrübe Delili | 10 |
| `din_10_u02_k02` | 2.2 Allah'ı İsim ve Sıfatlarıyla Tanımak | 10 |
| `din_10_u03_k01..k03` | 3.1 · 3.2 · 3.3 | 10+10+10 |
| `din_10_u04_k01..k03` | 4.1 · 4.2 · 4.3 | 10+10+10 |
| `din_10_u05_k01` | 5.1 Dinî Yorum Farklılıklarının Sebepleri | 10 |
| `din_10_u05_k02` | 5.2 İtikadi-Siyasi ve Fıkhi Yorumlar | 15 |
| `din_10_u05_k03` | 5.2.1 Ehlisünnet | 10 |
| `din_10_u05_k04` | 5.2.2 Şia | 10 |

Plan şemalı 12 havuz (`din_10_tNN_cNN`) kazanım bazlı kalır; ünite sonundaki
"Kur'an'dan Mesajlar" konularının başlıkları bu dosyalara yazıldı
(`konuBasligiYaz`). Toplam Din Kültürü 10: **36 havuz · 402 soru**.

**Yapılanlar**

1. `konular.js` ve `pwa-files/functions/konular.js` 10. sınıf Din Kültürü
   listesi **17 → 24 konu** olarak ders kitabına göre yeniden yazıldı.
2. Bilgi Bankası kayıt defterindeki `muf_10_din_kulturu_*` kayıtları (iki kopya)
   aynı 24 konuyla üretildi.
3. `din_10_u01_k01` (27 soru) ikiye bölündü: 1.1.1 → 12 soru, 1.1.2 → 15 soru
   (`din_10_u01_k02` yeniden yayına alındı; soru kimlikleri yeniden numaralandı).
4. Dört delil için yeni havuzlar yazıldı (`din_10_u02_k05..k08`), 5.2'nin iki alt
   başlığı için iki havuz (`din_10_u05_k03`, `din_10_u05_k04`). Her biri 10 soru,
   2 beceri, çözüm + flashcard.
5. 13 havuzun `topic_key`'i yeni ağaç başlıklarıyla eşitlendi; 5 plan havuzunun
   başlığından ayet parantezleri kaldırıldı (kitapta başlık sade).
6. Yeni müfredatta karşılığı olmayan 3 havuz arşivde: `din_10_u02_k03`,
   `din_10_u02_k04`, `din_10_u03_k04`.

Sonuç: `npm run -s test:konubulma` → **76/76**, 10. sınıf **189** konunun
tamamında Kısa Kontrol havuzu var; Din Kültürü 24/24 başlık eşleşti.

## 5. Açık konular

| # | Konu | Durum |
| --- | --- | --- |
| 1 | **Başlık eşleşmesi (kapandı)** | 9 konuda (Biyoloji 1.3, 1.6, 2.5, 2.7, 2.8 · Kimya 1.2.2, 3.1.1 · Tarih 2.2, 2.4) plan havuzunun `topic_key`'i kazanım cümlesiydi. Konu adları zaten ağaçta olduğu için havuz başlıkları bu adlarla eşitlendi (`docs/uretim/uretim/konu-basligi-esle.js`; Tarih 2.2/2.4 için `tarih-t02.js`). Ağaç kapsamı **188/189**; kalan tek konu Paragraf (bilinçli). |
| 2 | **TDE Paragraf** | Ağaçta konu var, havuz **bilinçli olarak üretilmedi** (kullanıcı talimatı: "uygulamada paragraf sorusu soramayız"). Dosya `arsiv/soru_havuzlari/edebiyat/edebiyat_10_u04_k06.json`. |
| 3 | **Üslup uyarıları (kapandı)** | Doğru şıkkın belirgin uzun olması 54 soruda düzeltildi (`docs/uretim/uretim/yama-sik-uzunluk.js`): doğru şık kısaltıldı veya çeldiriciler aynı ayrıntı düzeyine getirildi. `havuz-son-kontrol` artık **0 uyarı**. |
| 4 | **`kim_10_t02_c08` hedef 10, soru 11** | Fazla soru hata değil (`≥ hedef`). |
| 5 | **`kazanim_konu_10.json` ve `konu_esleme.json` bayat** | Üreticileri yeniden çalıştırıldığında 10 bin satırlık fark ve eşleme kalitesi değişimi doğuyor; ayrı bir iş olarak ele alınmalı. Şimdilik yalnız arşiv izleri temizlendi. |

---

## 6. Yeni / güncellenen araçlar

- `docs/uretim/araclar/havuz-son-kontrol.js` — 316 dosyayı tek geçişte denetler
  (yapı, soru/kart, mükerrer kayıt, kart önü–kök, şık dengesi, `topic_key` ↔
  ağaç, ağaç kapsamı). `--ayrinti` tüm listeyi yazdırır.
- `docs/uretim/uretim/yama-eski-havuzlar.js` — üreticisi olmayan eski şemalı
  havuzların kalıcı yaması (`--kontrol` ile yalnız bakar).
- `scripts/havuz-index-uret.js` — `topic_key` çakışması çözümü + havuz
  dosyasını kaynak alma.
- `docs/uretim/araclar/durum.js` — kapı komutları listesine yeni araç eklendi.
- `docs/uretim/uretim/din-konulari-guncelle.js` — Din Kültürü 10 ağacını,
  kayıt defterini ve havuz başlıklarını ders kitabına göre yeniler; 1.1 havuzunu
  alt başlıklara böler (idempotent).
- `docs/uretim/uretim/din-t06-deliller.js` — 2.1.1–2.1.4 delil havuzları.
- `docs/uretim/uretim/din-t07-yorumlar.js` — 5.2.1 Ehlisünnet · 5.2.2 Şia.
- `docs/uretim/uretim/konu-basligi-esle.js` — plan havuzlarının `topic_key`'ini
  ağaç başlığıyla eşitler; başlık ağaçta yoksa yazmaz, hata verir.
- `docs/uretim/uretim/yama-sik-uzunluk.js` — doğru şıkkı uzunlukla ele veren
  54 sorunun şıklarını yeniler (`--kontrol` yalnız bakar, kuralı kendisi de
  doğrular; `dogru_index` değişmez).
- `docs/uretim/yazicilar/yaz.js` → `konuBasligiYaz()` — plan şemalı bir havuza
  Bilgi Bankası konu başlığı yazar.
- `scripts/arsiv-kayit-temizle.js` — arşive taşınan havuzların üretilen
  indekslerdeki izlerini temizler.
