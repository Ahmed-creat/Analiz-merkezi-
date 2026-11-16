# 10. Sınıf Soru Üretim Planı

> `node scripts/soru-uretim-plani.js` üretir · elle düzenlenmez.
> Makine tarafı: `docs/uretim/uretim-plani.json` · Talimat: `docs/uretim/SORU-URETIM-TALIMATI.md`

## Kural

```
hedef soru = max(10, 2 × süreç bileşeni sayısı)
her süreç bileşeni = bir alt_beceri → her birine en az 2 soru
```

Bu kural 158 çıktının tamamına uygulanır: 158 çıktı · 612 süreç bileşeni → **1686 soru**.

## Ders bazlı hedefler

| Ders | Çıktı | Süreç | Hedef soru | Havuzu boş | Kısmi | Tam |
| --- | --- | --- | --- | --- | --- | --- |
| Biyoloji | 19 | 61 | **190** | 0 | 0 | 19 |
| Coğrafya | 18 | 73 | **190** | 1 | 3 | 14 |
| Din Kültürü | 17 | 65 | **170** | 17 | 0 | 0 |
| Felsefe | 10 | 38 | **100** | 0 | 0 | 10 |
| Fizik | 22 | 70 | **220** | 2 | 0 | 20 |
| Kimya | 21 | 69 | **214** | 2 | 1 | 18 |
| Matematik | 21 | 123 | **274** | 0 | 7 | 14 |
| Tarih | 14 | 49 | **140** | 0 | 0 | 14 |
| Türk Dili ve Edebiyatı | 16 | 64 | **188** | 16 | 0 | 0 |
| **Toplam** | **158** | **612** | **1686** | **38** | **11** | **109** |

## Mevcut durum

Havuzda bugün bu çıktılara bağlı **1610 soru** var. Hedefe ulaşmak için gereken
**en az 466 soru** (havuzu boş 38 çıktı dahil).

Havuzu tamamen boş olan çıktılar:

- **Coğrafya** (1): `COĞ.10.6.1`
- **Din Kültürü** (17): `DKAB.10.1.1`, `DKAB.10.1.2`, `DKAB.10.1.3`, `DKAB.10.2.1`, `DKAB.10.2.2`, `DKAB.10.2.3`, `DKAB.10.3.1`, `DKAB.10.3.2`, `DKAB.10.3.3`, `DKAB.10.3.4`, `DKAB.10.4.1`, `DKAB.10.4.2`, `DKAB.10.4.3`, `DKAB.10.4.4`, `DKAB.10.5.1`, `DKAB.10.5.2`, `DKAB.10.5.3`
- **Fizik** (2): `FİZ.10.3.7`, `FİZ.10.4.7`
- **Kimya** (2): `KİM.10.2.7`, `KİM.10.2.8`
- **Türk Dili ve Edebiyatı** (16): `TDE1.1`, `TDE1.2`, `TDE1.3`, `TDE1.4`, `TDE2.1`, `TDE2.2`, `TDE2.3`, `TDE2.4`, `TDE3.1`, `TDE3.2`, `TDE3.3`, `TDE3.4`, `TDE4.1`, `TDE4.2`, `TDE4.3`, `TDE4.4`

## Çıktı listesi (158)

| # | Kod | Ders | Tema | Hedef | Konu id |
| --- | --- | --- | --- | --- | --- |
| 1 | `BİY.10.1.1` | Biyoloji | 1 | 10 | `biyo_10_t01_c01` |
| 2 | `BİY.10.1.10` | Biyoloji | 1 | 10 | `biyo_10_t01_c10` |
| 3 | `BİY.10.1.2` | Biyoloji | 1 | 10 | `biyo_10_t01_c02` |
| 4 | `BİY.10.1.3` | Biyoloji | 1 | 10 | `biyo_10_t01_c03` |
| 5 | `BİY.10.1.4` | Biyoloji | 1 | 10 | `biyo_10_t01_c04` |
| 6 | `BİY.10.1.5` | Biyoloji | 1 | 10 | `biyo_10_t01_c05` |
| 7 | `BİY.10.1.6` | Biyoloji | 1 | 10 | `biyo_10_t01_c06` |
| 8 | `BİY.10.1.7` | Biyoloji | 1 | 10 | `biyo_10_t01_c07` |
| 9 | `BİY.10.1.8` | Biyoloji | 1 | 10 | `biyo_10_t01_c08` |
| 10 | `BİY.10.1.9` | Biyoloji | 1 | 10 | `biyo_10_t01_c09` |
| 11 | `BİY.10.2.1` | Biyoloji | 2 | 10 | `biyo_10_t02_c01` |
| 12 | `BİY.10.2.2` | Biyoloji | 2 | 10 | `biyo_10_t02_c02` |
| 13 | `BİY.10.2.3` | Biyoloji | 2 | 10 | `biyo_10_t02_c03` |
| 14 | `BİY.10.2.4` | Biyoloji | 2 | 10 | `biyo_10_t02_c04` |
| 15 | `BİY.10.2.5` | Biyoloji | 2 | 10 | `biyo_10_t02_c05` |
| 16 | `BİY.10.2.6` | Biyoloji | 2 | 10 | `biyo_10_t02_c06` |
| 17 | `BİY.10.2.7` | Biyoloji | 2 | 10 | `biyo_10_t02_c07` |
| 18 | `BİY.10.2.8` | Biyoloji | 2 | 10 | `biyo_10_t02_c08` |
| 19 | `BİY.10.2.9` | Biyoloji | 2 | 10 | `biyo_10_t02_c09` |
| 20 | `COĞ.10.1.1` | Coğrafya | 1 | 10 | `cogr_10_t01_c01` |
| 21 | `COĞ.10.2.1` | Coğrafya | 2 | 10 | `cogr_10_t02_c01` |
| 22 | `COĞ.10.2.2` | Coğrafya | 2 | 14 | `cogr_10_t02_c02` |
| 23 | `COĞ.10.3.1` | Coğrafya | 3 | 10 | `cogr_10_t03_c01` |
| 24 | `COĞ.10.3.2` | Coğrafya | 3 | 10 | `cogr_10_t03_c02` |
| 25 | `COĞ.10.3.3` | Coğrafya | 3 | 10 | `cogr_10_t03_c03` |
| 26 | `COĞ.10.3.4` | Coğrafya | 3 | 12 | `cogr_10_t03_c04` |
| 27 | `COĞ.10.3.5` | Coğrafya | 3 | 10 | `cogr_10_t03_c05` |
| 28 | `COĞ.10.4.1` | Coğrafya | 4 | 10 | `cogr_10_t04_c01` |
| 29 | `COĞ.10.4.2` | Coğrafya | 4 | 10 | `cogr_10_t04_c02` |
| 30 | `COĞ.10.5.1` | Coğrafya | 5 | 10 | `cogr_10_t05_c01` |
| 31 | `COĞ.10.5.2` | Coğrafya | 5 | 10 | `cogr_10_t05_c02` |
| 32 | `COĞ.10.5.3` | Coğrafya | 5 | 12 | `cogr_10_t05_c03` |
| 33 | `COĞ.10.6.1` | Coğrafya | 6 | 10 | `cogr_10_t06_c01` |
| 34 | `COĞ.10.6.2` | Coğrafya | 6 | 10 | `cogr_10_t06_c02` |
| 35 | `COĞ.10.6.3` | Coğrafya | 6 | 12 | `cogr_10_t06_c03` |
| 36 | `COĞ.10.6.4` | Coğrafya | 6 | 10 | `cogr_10_t06_c04` |
| 37 | `COĞ.10.7.1` | Coğrafya | 7 | 10 | `cogr_10_t07_c01` |
| 38 | `DKAB.10.1.1` | Din Kültürü | 1 · İslam’da Varlık ve Bilgi | 10 | `din_10_t01_c01` |
| 39 | `DKAB.10.1.2` | Din Kültürü | 1 · İslam’da Varlık ve Bilgi | 10 | `din_10_t01_c02` |
| 40 | `DKAB.10.1.3` | Din Kültürü | 1 · İslam’da Varlık ve Bilgi | 10 | `din_10_t01_c03` |
| 41 | `DKAB.10.2.1` | Din Kültürü | 2 · Allah’ı Tanımak | 10 | `din_10_t02_c01` |
| 42 | `DKAB.10.2.2` | Din Kültürü | 2 · Allah’ı Tanımak | 10 | `din_10_t02_c02` |
| 43 | `DKAB.10.2.3` | Din Kültürü | 2 · Allah’ı Tanımak | 10 | `din_10_t02_c03` |
| 44 | `DKAB.10.3.1` | Din Kültürü | 3 · İslam’ın Evrensel Mesajları | 10 | `din_10_t03_c01` |
| 45 | `DKAB.10.3.2` | Din Kültürü | 3 · İslam’ın Evrensel Mesajları | 10 | `din_10_t03_c02` |
| 46 | `DKAB.10.3.3` | Din Kültürü | 3 · İslam’ın Evrensel Mesajları | 10 | `din_10_t03_c03` |
| 47 | `DKAB.10.3.4` | Din Kültürü | 3 · İslam’ın Evrensel Mesajları | 10 | `din_10_t03_c04` |
| 48 | `DKAB.10.4.1` | Din Kültürü | 4 · Din, Çevre ve Teknoloji | 10 | `din_10_t04_c01` |
| 49 | `DKAB.10.4.2` | Din Kültürü | 4 · Din, Çevre ve Teknoloji | 10 | `din_10_t04_c02` |
| 50 | `DKAB.10.4.3` | Din Kültürü | 4 · Din, Çevre ve Teknoloji | 10 | `din_10_t04_c03` |
| 51 | `DKAB.10.4.4` | Din Kültürü | 4 · Din, Çevre ve Teknoloji | 10 | `din_10_t04_c04` |
| 52 | `DKAB.10.5.1` | Din Kültürü | 5 · İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar | 10 | `din_10_t05_c01` |
| 53 | `DKAB.10.5.2` | Din Kültürü | 5 · İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar | 10 | `din_10_t05_c02` |
| 54 | `DKAB.10.5.3` | Din Kültürü | 5 · İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar | 10 | `din_10_t05_c03` |
| 55 | `FEL.10.1.1` | Felsefe | 1 | 10 | `fel_10_t01_c01` |
| 56 | `FEL.10.2.1` | Felsefe | 2 | 10 | `fel_10_t02_c01` |
| 57 | `FEL.10.2.2` | Felsefe | 2 | 10 | `fel_10_t02_c02` |
| 58 | `FEL.10.3.1` | Felsefe | 3 | 10 | `fel_10_t03_c01` |
| 59 | `FEL.10.4.1` | Felsefe | 4 | 10 | `fel_10_t04_c01` |
| 60 | `FEL.10.5.1` | Felsefe | 5 | 10 | `fel_10_t05_c01` |
| 61 | `FEL.10.6.1` | Felsefe | 6 | 10 | `fel_10_t06_c01` |
| 62 | `FEL.10.7.1` | Felsefe | 7 | 10 | `fel_10_t07_c01` |
| 63 | `FEL.10.8.1` | Felsefe | 8 | 10 | `fel_10_t08_c01` |
| 64 | `FEL.10.9.1` | Felsefe | 9 | 10 | `fel_10_t09_c01` |
| 65 | `FİZ.10.1.1` | Fizik | 1 | 10 | `fiz_10_t01_c01` |
| 66 | `FİZ.10.1.2` | Fizik | 1 | 10 | `fiz_10_t01_c02` |
| 67 | `FİZ.10.1.3` | Fizik | 1 | 10 | `fiz_10_t01_c03` |
| 68 | `FİZ.10.2.1` | Fizik | 2 | 10 | `fiz_10_t02_c01` |
| 69 | `FİZ.10.2.2` | Fizik | 2 | 10 | `fiz_10_t02_c02` |
| 70 | `FİZ.10.2.3` | Fizik | 2 | 10 | `fiz_10_t02_c03` |
| 71 | `FİZ.10.2.4` | Fizik | 2 | 10 | `fiz_10_t02_c04` |
| 72 | `FİZ.10.2.5` | Fizik | 2 | 10 | `fiz_10_t02_c05` |
| 73 | `FİZ.10.3.1` | Fizik | 3 | 10 | `fiz_10_t03_c01` |
| 74 | `FİZ.10.3.2` | Fizik | 3 | 10 | `fiz_10_t03_c02` |
| 75 | `FİZ.10.3.3` | Fizik | 3 | 10 | `fiz_10_t03_c03` |
| 76 | `FİZ.10.3.4` | Fizik | 3 | 10 | `fiz_10_t03_c04` |
| 77 | `FİZ.10.3.5` | Fizik | 3 | 10 | `fiz_10_t03_c05` |
| 78 | `FİZ.10.3.6` | Fizik | 3 | 10 | `fiz_10_t03_c06` |
| 79 | `FİZ.10.3.7` | Fizik | 3 | 10 | `fiz_10_t03_c07` |
| 80 | `FİZ.10.4.1` | Fizik | 4 | 10 | `fiz_10_t04_c01` |
| 81 | `FİZ.10.4.2` | Fizik | 4 | 10 | `fiz_10_t04_c02` |
| 82 | `FİZ.10.4.3` | Fizik | 4 | 10 | `fiz_10_t04_c03` |
| 83 | `FİZ.10.4.4` | Fizik | 4 | 10 | `fiz_10_t04_c04` |
| 84 | `FİZ.10.4.5` | Fizik | 4 | 10 | `fiz_10_t04_c05` |
| 85 | `FİZ.10.4.6` | Fizik | 4 | 10 | `fiz_10_t04_c06` |
| 86 | `FİZ.10.4.7` | Fizik | 4 | 10 | `fiz_10_t04_c07` |
| 87 | `KİM.10.1.1` | Kimya | 1 | 10 | `kim_10_t01_c01` |
| 88 | `KİM.10.1.10` | Kimya | 1 | 10 | `kim_10_t01_c10` |
| 89 | `KİM.10.1.11` | Kimya | 1 | 10 | `kim_10_t01_c11` |
| 90 | `KİM.10.1.2` | Kimya | 1 | 10 | `kim_10_t01_c02` |
| 91 | `KİM.10.1.3` | Kimya | 1 | 10 | `kim_10_t01_c03` |
| 92 | `KİM.10.1.4` | Kimya | 1 | 10 | `kim_10_t01_c04` |
| 93 | `KİM.10.1.5` | Kimya | 1 | 10 | `kim_10_t01_c05` |
| 94 | `KİM.10.1.6` | Kimya | 1 | 10 | `kim_10_t01_c06` |
| 95 | `KİM.10.1.7` | Kimya | 1 | 10 | `kim_10_t01_c07` |
| 96 | `KİM.10.1.8` | Kimya | 1 | 10 | `kim_10_t01_c08` |
| 97 | `KİM.10.1.9` | Kimya | 1 | 14 | `kim_10_t01_c09` |
| 98 | `KİM.10.2.1` | Kimya | 2 | 10 | `kim_10_t02_c01` |
| 99 | `KİM.10.2.2` | Kimya | 2 | 10 | `kim_10_t02_c02` |
| 100 | `KİM.10.2.3` | Kimya | 2 | 10 | `kim_10_t02_c03` |
| 101 | `KİM.10.2.4` | Kimya | 2 | 10 | `kim_10_t02_c04` |
| 102 | `KİM.10.2.5` | Kimya | 2 | 10 | `kim_10_t02_c05` |
| 103 | `KİM.10.2.6` | Kimya | 2 | 10 | `kim_10_t02_c06` |
| 104 | `KİM.10.2.7` | Kimya | 2 | 10 | `kim_10_t02_c07` |
| 105 | `KİM.10.2.8` | Kimya | 2 | 10 | `kim_10_t02_c08` |
| 106 | `KİM.10.3.1` | Kimya | 3 | 10 | `kim_10_t03_c01` |
| 107 | `KİM.10.3.2` | Kimya | 3 | 10 | `kim_10_t03_c02` |
| 108 | `MAT.10.1.1` | Matematik | 1 · Geometrik Şekiller | 10 | `mat_10_t01_c01` |
| 109 | `MAT.10.1.2` | Matematik | 1 · Geometrik Şekiller | 10 | `mat_10_t01_c02` |
| 110 | `MAT.10.1.3` | Matematik | 1 · Geometrik Şekiller | 10 | `mat_10_t01_c03` |
| 111 | `MAT.10.1.4` | Matematik | 1 · Geometrik Şekiller | 10 | `mat_10_t01_c04` |
| 112 | `MAT.10.2.1` | Matematik | 2 · İstatistiksel Araştırma Süreci | 16 | `mat_10_t02_c01` |
| 113 | `MAT.10.2.2` | Matematik | 2 · İstatistiksel Araştırma Süreci | 10 | `mat_10_t02_c02` |
| 114 | `MAT.10.3.1` | Matematik | 3 · Sayılar | 10 | `mat_10_t03_c01` |
| 115 | `MAT.10.3.2` | Matematik | 3 · Sayılar | 14 | `mat_10_t03_c02` |
| 116 | `MAT.10.3.3` | Matematik | 3 · Sayılar | 14 | `mat_10_t03_c03` |
| 117 | `MAT.10.4.1` | Matematik | 4 · Nicelikler ve Değişimler | 10 | `mat_10_t04_c01` |
| 118 | `MAT.10.4.2` | Matematik | 4 · Nicelikler ve Değişimler | 24 | `mat_10_t04_c02` |
| 119 | `MAT.10.4.3` | Matematik | 4 · Nicelikler ve Değişimler | 12 | `mat_10_t04_c03` |
| 120 | `MAT.10.4.4` | Matematik | 4 · Nicelikler ve Değişimler | 24 | `mat_10_t04_c04` |
| 121 | `MAT.10.4.5` | Matematik | 4 · Nicelikler ve Değişimler | 10 | `mat_10_t04_c05` |
| 122 | `MAT.10.4.6` | Matematik | 4 · Nicelikler ve Değişimler | 20 | `mat_10_t04_c06` |
| 123 | `MAT.10.5.1` | Matematik | 5 · Sayma, Algoritma ve Bilişim | 20 | `mat_10_t05_c01` |
| 124 | `MAT.10.5.2` | Matematik | 5 · Sayma, Algoritma ve Bilişim | 10 | `mat_10_t05_c02` |
| 125 | `MAT.10.6.1` | Matematik | 6 · Analitik İnceleme | 10 | `mat_10_t06_c01` |
| 126 | `MAT.10.6.2` | Matematik | 6 · Analitik İnceleme | 10 | `mat_10_t06_c02` |
| 127 | `MAT.10.7.1` | Matematik | 7 · Veriden Olasılığa | 10 | `mat_10_t07_c01` |
| 128 | `MAT.10.7.2` | Matematik | 7 · Veriden Olasılığa | 10 | `mat_10_t07_c02` |
| 129 | `TAR.10.1.1` | Tarih | 1 | 10 | `tar_10_t01_c01` |
| 130 | `TAR.10.1.2` | Tarih | 1 | 10 | `tar_10_t01_c02` |
| 131 | `TAR.10.1.3` | Tarih | 1 | 10 | `tar_10_t01_c03` |
| 132 | `TAR.10.1.4` | Tarih | 1 | 10 | `tar_10_t01_c04` |
| 133 | `TAR.10.2.1` | Tarih | 2 | 10 | `tar_10_t02_c01` |
| 134 | `TAR.10.2.2` | Tarih | 2 | 10 | `tar_10_t02_c02` |
| 135 | `TAR.10.2.3` | Tarih | 2 | 10 | `tar_10_t02_c03` |
| 136 | `TAR.10.2.4` | Tarih | 2 | 10 | `tar_10_t02_c04` |
| 137 | `TAR.10.2.5` | Tarih | 2 | 10 | `tar_10_t02_c05` |
| 138 | `TAR.10.3.1` | Tarih | 3 | 10 | `tar_10_t03_c01` |
| 139 | `TAR.10.3.2` | Tarih | 3 | 10 | `tar_10_t03_c02` |
| 140 | `TAR.10.3.3` | Tarih | 3 | 10 | `tar_10_t03_c03` |
| 141 | `TAR.10.3.4` | Tarih | 3 | 10 | `tar_10_t03_c04` |
| 142 | `TAR.10.3.5` | Tarih | 3 | 10 | `tar_10_t03_c05` |
| 143 | `TDE1.1` | Türk Dili ve Edebiyatı | 1 | 10 | `edebiyat_10_t01_c01` |
| 144 | `TDE1.2` | Türk Dili ve Edebiyatı | 1 | 12 | `edebiyat_10_t01_c02` |
| 145 | `TDE1.3` | Türk Dili ve Edebiyatı | 1 | 10 | `edebiyat_10_t01_c03` |
| 146 | `TDE1.4` | Türk Dili ve Edebiyatı | 1 | 10 | `edebiyat_10_t01_c04` |
| 147 | `TDE2.1` | Türk Dili ve Edebiyatı | 2 | 10 | `edebiyat_10_t02_c01` |
| 148 | `TDE2.2` | Türk Dili ve Edebiyatı | 2 | 12 | `edebiyat_10_t02_c02` |
| 149 | `TDE2.3` | Türk Dili ve Edebiyatı | 2 | 10 | `edebiyat_10_t02_c03` |
| 150 | `TDE2.4` | Türk Dili ve Edebiyatı | 2 | 10 | `edebiyat_10_t02_c04` |
| 151 | `TDE3.1` | Türk Dili ve Edebiyatı | 3 | 10 | `edebiyat_10_t03_c01` |
| 152 | `TDE3.2` | Türk Dili ve Edebiyatı | 3 | 18 | `edebiyat_10_t03_c02` |
| 153 | `TDE3.3` | Türk Dili ve Edebiyatı | 3 | 14 | `edebiyat_10_t03_c03` |
| 154 | `TDE3.4` | Türk Dili ve Edebiyatı | 3 | 10 | `edebiyat_10_t03_c04` |
| 155 | `TDE4.1` | Türk Dili ve Edebiyatı | 4 | 10 | `edebiyat_10_t04_c01` |
| 156 | `TDE4.2` | Türk Dili ve Edebiyatı | 4 | 16 | `edebiyat_10_t04_c02` |
| 157 | `TDE4.3` | Türk Dili ve Edebiyatı | 4 | 16 | `edebiyat_10_t04_c03` |
| 158 | `TDE4.4` | Türk Dili ve Edebiyatı | 4 | 10 | `edebiyat_10_t04_c04` |

## Tema adı notu

Tema adı yalnız doğrulanmış kaynaktan yazılır. Din için `dkab912.pdf` s.36-37 (1.3 tablosu),
Matematik için TYMM 2026 kataloğu kullanıldı. Diğer derslerde tema adı **boş bırakıldı**
(uydurulmadı); soru üretimi için tema numarası ve MEB kodu yeterlidir.
