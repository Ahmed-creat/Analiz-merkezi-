# Üretim Durumu (otomatik)

> Bu dosya `node docs/uretim/araclar/durum.js` ile üretilir — **elle düzenlenmez**.
> Güncelleme: 2026-11-17 21:10 (UTC)

## Ders bazında

| Ders | Havuz (tamam/toplam) | Soru | Hedef | Kart | Görselli soru |
| --- | --- | --- | --- | --- | --- |
| Türk Dili ve Edebiyatı | 29/29 (konu) | 290 | 290 | 290 | 0 |
| Matematik | 21/21 | 274 | 274 | 274 | 46 |
| Fizik | 22/22 | 220 | 220 | 220 | 10 |
| Kimya | 21/21 | 184 | 214 | 184 | 0 |
| Biyoloji | 19/19 | 192 | 190 | 192 | 0 |
| Tarih | 14/14 | 140 | 140 | 140 | 3 |
| Coğrafya | 18/18 | 201 | 190 | 201 | 2 |
| Felsefe | 10/10 | 122 | 100 | 122 | 0 |
| Din Kültürü | 17/17 | 209 | 170 | 209 | 0 |
| **TOPLAM** | **171/171** | **1832** | **1788** | **1832** | **61** |

İlerleme: **%102** (1832/1788 soru) · kart 1:1 ✔

## Eksik havuzlar

Yok — plan çıktılarının tamamı tamam 🎉 (TDE konu havuzlarıyla karşılandı)

## Kapı komutları

```bash
node docs/uretim/araclar/havuz-son-kontrol.js         # 313 dosya, tüm dersler
node docs/uretim/araclar/havuz-denetle.js --tumu      # plan şemalı 142 dosya
node scripts/soru-uret-dogrula.js site/content/soru_havuzlari
node scripts/havuz-index-uret.js --plan --kontrol
npm run -s validate:pools && npm run -s test:hepsi
```
