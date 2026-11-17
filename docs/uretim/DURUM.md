# Üretim Durumu (otomatik)

> Bu dosya `node docs/uretim/araclar/durum.js` ile üretilir — **elle düzenlenmez**.
> Güncelleme: 2026-11-17 12:14 (UTC)

## Ders bazında

| Ders | Havuz (tamam/toplam) | Soru | Hedef | Kart | Görselli soru |
| --- | --- | --- | --- | --- | --- |
| Türk Dili ve Edebiyatı | 29/29 (konu) | 290 | 290 | 290 | 0 |
| Matematik | 21/21 | 274 | 274 | 274 | 22 |
| Fizik | 22/22 | 220 | 220 | 220 | 27 |
| Kimya | 21/21 | 215 | 214 | 215 | 46 |
| Biyoloji | 19/19 | 190 | 190 | 190 | 38 |
| Tarih | 14/14 | 140 | 140 | 140 | 5 |
| Coğrafya | 18/18 | 190 | 190 | 190 | 8 |
| Felsefe | 10/10 | 100 | 100 | 100 | 0 |
| Din Kültürü | 17/17 | 170 | 170 | 170 | 0 |
| **TOPLAM** | **171/171** | **1789** | **1788** | **1789** | **146** |

İlerleme: **%100** (1789/1788 soru) · kart 1:1 ✔

## Eksik havuzlar

Yok — plan çıktılarının tamamı tamam 🎉 (TDE konu havuzlarıyla karşılandı)

## Kapı komutları

```bash
node docs/uretim/araclar/havuz-denetle.js --tumu      # hızlı kapı
node scripts/soru-uret-dogrula.js site/content/soru_havuzlari
node scripts/havuz-index-uret.js --plan --kontrol
npm run -s validate:pools && npm run -s test:hepsi
```
