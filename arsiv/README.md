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
| Din Kültürü | `din/din_10_u02_k03.json` (Hac ve Zekât), `din_10_u02_k04.json` (Kur'an'ın ana konuları), `din_10_u03_k04.json` (Ahlakın temel kaynağı) | 2025-2026 MEB ders kitabının (TYMM) içindekilerinde karşılığı yok. Ağaç ders kitabına göre yenilenirken havuzlar yayımdan çıkarıldı, dosyalar silinmedi. |
