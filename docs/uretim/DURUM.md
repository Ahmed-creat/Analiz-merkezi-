# Üretim Durumu (otomatik)

> Bu dosya `node docs/uretim/araclar/durum.js` ile üretilir — **elle düzenlenmez**.
> Güncelleme: 2026-11-17 11:58 (UTC)

## Ders bazında

| Ders | Havuz (tamam/toplam) | Soru | Hedef | Kart | Görselli soru |
| --- | --- | --- | --- | --- | --- |
| Türk Dili ve Edebiyatı | 0/16 | 0 | 188 | 0 | 0 |
| Matematik | 21/21 | 274 | 274 | 274 | 22 |
| Fizik | 22/22 | 220 | 220 | 220 | 27 |
| Kimya | 21/21 | 215 | 214 | 215 | 46 |
| Biyoloji | 19/19 | 190 | 190 | 190 | 38 |
| Tarih | 14/14 | 140 | 140 | 140 | 5 |
| Coğrafya | 18/18 | 190 | 190 | 190 | 8 |
| Felsefe | 10/10 | 100 | 100 | 100 | 0 |
| Din Kültürü | 17/17 | 170 | 170 | 170 | 0 |
| **TOPLAM** | **142/158** | **1499** | **1686** | **1499** | **146** |

İlerleme: **%89** (1499/1686 soru) · kart 1:1 ✔

## Eksik havuzlar


### Türk Dili ve Edebiyatı

| konu_id | kod | hedef soru | durum |
| --- | --- | --- | --- |
| `edebiyat_10_t01_c01` | TDE1.1 | 10 | yok |
| `edebiyat_10_t01_c02` | TDE1.2 | 12 | yok |
| `edebiyat_10_t01_c03` | TDE1.3 | 10 | yok |
| `edebiyat_10_t01_c04` | TDE1.4 | 10 | yok |
| `edebiyat_10_t02_c01` | TDE2.1 | 10 | yok |
| `edebiyat_10_t02_c02` | TDE2.2 | 12 | yok |
| `edebiyat_10_t02_c03` | TDE2.3 | 10 | yok |
| `edebiyat_10_t02_c04` | TDE2.4 | 10 | yok |
| `edebiyat_10_t03_c01` | TDE3.1 | 10 | yok |
| `edebiyat_10_t03_c02` | TDE3.2 | 18 | yok |
| `edebiyat_10_t03_c03` | TDE3.3 | 14 | yok |
| `edebiyat_10_t03_c04` | TDE3.4 | 10 | yok |
| `edebiyat_10_t04_c01` | TDE4.1 | 10 | yok |
| `edebiyat_10_t04_c02` | TDE4.2 | 16 | yok |
| `edebiyat_10_t04_c03` | TDE4.3 | 16 | yok |
| `edebiyat_10_t04_c04` | TDE4.4 | 10 | yok |

## Kapı komutları

```bash
node docs/uretim/araclar/havuz-denetle.js --tumu      # hızlı kapı
node scripts/soru-uret-dogrula.js site/content/soru_havuzlari
node scripts/havuz-index-uret.js --plan --kontrol
npm run -s validate:pools && npm run -s test:hepsi
```
