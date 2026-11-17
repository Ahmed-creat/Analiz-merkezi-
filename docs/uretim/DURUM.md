# Üretim Durumu (otomatik)

> Bu dosya `node docs/uretim/araclar/durum.js` ile üretilir — **elle düzenlenmez**.
> Güncelleme: 2026-11-17 19:59 (UTC)

## Ders bazında

| Ders | Havuz (tamam/toplam) | Soru | Hedef | Kart | Görselli soru |
| --- | --- | --- | --- | --- | --- |
| Türk Dili ve Edebiyatı | 29/29 (konu) | 290 | 290 | 290 | 0 |
| Matematik | 13/21 | 210 | 274 | 210 | 46 |
| Fizik | 20/22 | 200 | 220 | 200 | 10 |
| Kimya | 20/21 | 180 | 214 | 180 | 0 |
| Biyoloji | 19/19 | 192 | 190 | 192 | 0 |
| Tarih | 14/14 | 140 | 140 | 140 | 3 |
| Coğrafya | 18/18 | 201 | 190 | 201 | 2 |
| Felsefe | 10/10 | 100 | 100 | 100 | 0 |
| Din Kültürü | 17/17 | 170 | 170 | 170 | 0 |
| **TOPLAM** | **160/171** | **1683** | **1788** | **1683** | **61** |

İlerleme: **%94** (1683/1788 soru) · kart 1:1 ✔

## Eksik havuzlar


### Matematik

| konu_id | kod | hedef soru | durum |
| --- | --- | --- | --- |
| `mat_10_t02_c01` | MAT.10.2.1 | 16 | eksik (10 soru, 10 kart · `mat_10_u02_k01.json`) |
| `mat_10_t03_c02` | MAT.10.3.2 | 14 | eksik (10 soru, 10 kart · `mat_10_u03_k02.json`) |
| `mat_10_t03_c03` | MAT.10.3.3 | 14 | eksik (10 soru, 10 kart · `mat_10_u03_k03.json`) |
| `mat_10_t04_c02` | MAT.10.4.2 | 24 | eksik (10 soru, 10 kart · `mat_10_u04_k02.json`) |
| `mat_10_t04_c03` | MAT.10.4.3 | 12 | eksik (10 soru, 10 kart · `mat_10_u04_k03.json`) |
| `mat_10_t04_c04` | MAT.10.4.4 | 24 | eksik (10 soru, 10 kart · `mat_10_u04_k04.json`) |
| `mat_10_t04_c06` | MAT.10.4.6 | 20 | eksik (10 soru, 10 kart · `mat_10_u04_k06.json`) |
| `mat_10_t05_c01` | MAT.10.5.1 | 20 | eksik (10 soru, 10 kart · `mat_10_u05_k01.json`) |

### Fizik

| konu_id | kod | hedef soru | durum |
| --- | --- | --- | --- |
| `fiz_10_t03_c07` | FİZ.10.3.7 | 10 | havuz yok |
| `fiz_10_t04_c07` | FİZ.10.4.7 | 10 | havuz yok |

### Kimya

| konu_id | kod | hedef soru | durum |
| --- | --- | --- | --- |
| `kim_10_t01_c09` | KİM.10.1.9 | 14 | eksik (10 soru, 10 kart · `kimya_10_u01_k06.json`) |

## Kapı komutları

```bash
node docs/uretim/araclar/havuz-son-kontrol.js         # 313 dosya, tüm dersler
node docs/uretim/araclar/havuz-denetle.js --tumu      # plan şemalı 142 dosya
node scripts/soru-uret-dogrula.js site/content/soru_havuzlari
node scripts/havuz-index-uret.js --plan --kontrol
npm run -s validate:pools && npm run -s test:hepsi
```
