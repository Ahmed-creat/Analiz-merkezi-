# Arşiv — değiştirilen eski soru havuzları

> Kural: **eski havuz dosyaları silinmez.** Bir dersin konuları yeni sorularla
> değiştirildiğinde, eski dosya buraya taşınır
> (`docs/uretim/URETIM-YURUTME-PLANI.md` §9 — "Ders bazında `arsiv/` altına taşınacak,
> silinmez. Yeni havuzlar kapıları geçtikten sonra taşınır; taşıma ayrı commit").

## Neden `site/` dışında?

`site/content/soru_havuzlari/` yayımlanan dizindir (`deploy/build.sh`, Vercel `site/` klasörünü yayımlar).
Buradaki dosyalar uygulama tarafından yüklenir; `index.json` manifestine girer ve Bilgi Bankası
havuz bulucu (`site/havuz-bul.js`) tarafından eşlenir. Arşiv dosyaları **uygulamaya yüklenmez**,
yalnızca izlenebilirlik ve geri dönüş için saklanır.

## Dizin yapısı

```
arsiv/soru_havuzlari/<ders>/<konu_id>.json
```

## Kayıtlar

| Ders | Dosya | Neden arşivde |
| --- | --- | --- |
| TDE | `edebiyat/edebiyat_10_u01_k01.json` … `u01_k05.json` | 2026-11-17'de ders notlarından yeni 10+10 soruyla değiştirildi (eski metin 2018 ünite şeması, `kaynak_dosya: "10. Sınıf edebiyat json.zip"`). |
| TDE | `edebiyat/edebiyat_10_u04_k06.json` (Paragraf) | **Paragraf konusundan soru havuzu üretilmeyecek.** Uygulamada paragraf sorusu sorulamıyor; havuz kaldırıldı, dosya silinmedi. |
| Din Kültürü | `din/din_10_u01_k02.json` | Bu dosya **2026-11-17'de yeniden yayına alındı**: ders kitabı 1.1'i "Bilginin Yeri" ve "Bilgi Kaynakları" alt başlıklarına ayırdığı için havuz `site/content/soru_havuzlari/din_10_u01_k02.json` olarak geri döndü (15 soru). Arşiv kopyası tutulmaz. |
| Biyoloji · Coğrafya · Kimya · Tarih | `biyoloji/biyo_10_u01_k08.json`, `biyo_10_u02_k05.json`, `biyo_10_u02_k06.json` · `cografya/cogr_10_u04_k02.json`, `cogr_10_u05_k02.json`, `cogr_10_u05_k03.json`, `cogr_10_u06_k02.json`, `cogr_10_u06_k03.json`, `cogr_10_u06_k04.json`, `cogr_10_u07_k01.json` · `kimya/kimya_10_u02_k06.json`, `kimya_10_u02_k07.json`, `kimya_10_u02_k08.json` · `tarih/tarih_10_u01_k04.json`, `tarih_10_u02_k05.json` | **Kaynağı ders kitabı değil:** `kaynak_dosya` alanları "elle yazıldı (v35.3)", üretici betikleri yok, `kaynak` alanı boş. Plan (§9) gereği silinmedi, arşive taşındı (2026-11-17). Konular ağaçta duruyor; havuzları ders kitabından yeniden üretilecek. |
| Din Kültürü | `din/din_10_u02_k03.json` (Hac ve Zekât), `din_10_u02_k04.json` (Kur'an'ın ana konuları), `din_10_u03_k04.json` (Ahlakın temel kaynağı) | 2025-2026 MEB ders kitabının (TYMM) içindekilerinde karşılığı yok. Ağaç ders kitabına göre yenilenirken havuzlar yayımdan çıkarıldı, dosyalar silinmedi. |
| Kimya | `kimya/kimya_10_u01_k01.json` … `u03_k01.json` (14 dosya, 142 soru) + `kimya/kim_10_t01_c01.json` … `kim_10_t03_c02.json` (21 dosya, 213 soru) | 2026-11-16'da Kimya 10 havuzları ders kitabından (MEB 2025) sıfırdan yazıldı; 19 havuz / 190 soru yayımda. Eski iki küme arşive taşındı: `zip-*` ön eki eski `kaynak_dosya: "10. Sınıf kimya json.zip"` havuzları, `eski-*` ön eki 2018 şemalı `kim_10_t*` havuzları. Yeni havuzlar aynı `konu_id` ile yayımda olduğu için eski dosyalar ad değiştirilerek saklandı. |
| Biyoloji | `biyoloji/eski-biyo_10_t01_c01.json` … `eski-biyo_10_t02_c09.json` (19 dosya, 190 soru) + `biyoloji/zip-biyo_10_u01_k01.json` … `zip-biyo_10_u02_k04.json` (11 dosya, 110 soru) + `biyoloji/biyo_10_u01_k08.json`, `biyo_10_u02_k05.json`, `biyo_10_u02_k06.json` (3 dosya, v35.3 elle yazılmış) | 2026-11-16'da Biyoloji 10 havuzları ders kitabından (MEB 2025) sıfırdan yazıldı: 19 havuz / 190 soru yayımda (1. Tema `5cf5215`, 2. Tema bu commit). Eski üç küme arşive taşındı; `zip-*` ön eki eski `kaynak_dosya: "10. Sınıf biyoloji json.zip"` havuzları, `eski-*` ön eki 2018 şemalı `biyo_10_t*` havuzları. Yeni havuzlar aynı `konu_id` ile yayımda olduğu için eski dosyalar silinmedi, ad değiştirilerek saklandı. |
