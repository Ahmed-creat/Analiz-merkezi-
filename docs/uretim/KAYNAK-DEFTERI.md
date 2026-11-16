# Kaynak Defteri — 10. Sınıf Ders Kitapları

> Soru üretiminde **tek referans ders kitabıdır** (talimat §9). Bu defter hangi kitabın,
> hangi baskının, hangi sayfalarının kullanıldığını izler. Her havuzun `kaynak` alanı
> buradaki sayfa aralığıyla tutarlı olmak zorundadır.
>
> Kitap PDF'leri repoya **girmez**; metin `docs/uretim/.kitap-metin/<slug>.json`
> (gitignore) altında sayfa numaralı olarak tutulur.

## Durum

| Ders | slug | Kitap | Baskı/yıl | Sayfa | Metin çıkarıldı | sha256 (ilk 12) | Tema→sayfa haritası |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Fizik | `fizik` | `fizik-10.pdf` (MEB, ISBN 978-975-11-8918-9) | 2025 onaylı / 2026 baskı | 353 | ✅ | `32ffe6412cea` | ✅ §Fizik |
| Kimya | `kimya` | _(bekleniyor)_ | | | ⬜ | | ⬜ |
| Biyoloji | `biyoloji` | `biyoloji-10.pdf` | | 199 | ✅ | — | ⬜ |
| Matematik | `matematik` | _(bekleniyor)_ | | | ⬜ | | ⬜ |
| Coğrafya | `cografya` | `cografya-10.pdf` | | 241 | ✅ | — | ⬜ |
| Tarih | `tarih` | _(bekleniyor)_ | | | ⬜ | | ⬜ |
| Felsefe | `felsefe` | `felsefe-10.pdf` | | 217 | ✅ | — | ⬜ |
| Din Kültürü | `din` | `2025-2026.10.Sinif.Din.Kulturu.Ve.Ahlak.Bigisi.Ders.Kitabi.-MEB.pdf` | 2025-2026 | 183 | ✅ | — | ⬜ |
| Türk Dili ve Edebiyatı | `edebiyat` | `10.Edebiyat.Ders.notlari.Yeni.Mufredat.pdf` (ders notu) | yeni müfredat | 149 | ✅ | — | ⬜ |

> **Kitap ulaşımı:** PDF'ler GitHub *release* asset olarak yüklendi (`derskitaplari` etiketi),
> runner üzerinde `pdftotext` ile metne çevrildi ve geçici `kitap-kaynak` dalından alındı
> (`.github/workflows/kitap-cek.yml`). PDF'ler repoya **commit edilmedi**, geçici dal silindi.
> Kitap metni `docs/uretim/.kitap-metin/` altında (gitignore).

## Ölçüm komutları

```bash
bash docs/uretim/araclar/kur.sh                                        # pypdf
python3 docs/uretim/araclar/kitap-metin.py --slug fizik --ekle /yol/part1.pdf
python3 docs/uretim/araclar/kitap-metin.py --slug fizik --rapor        # sayfa × karakter tablosu
python3 docs/uretim/araclar/kitap-metin.py --slug fizik --ara "ivme"   # sayfa bul
python3 docs/uretim/araclar/kitap-metin.py --slug fizik --sayfa 42-47  # metni oku
```

## Tema → sayfa haritası (kitap geldikçe doldurulur)

### Fizik (`fizik`)

Kitap: 353 sayfa · 4 ünite · Ünite açılış sayfaları ölçüldü.

| Tema | Ad | konu_id aralığı | Sayfa |
| --- | --- | --- | --- |
| 1 | Kuvvet ve Hareket | `fiz_10_t01_c01` … `c03` | 13–106 |
| 2 | Enerji | `fiz_10_t02_c01` … `c05` | 107–196 |
| 3 | Elektrik | `fiz_10_t03_c01` … `c07` | 197–270 |
| 4 | Dalgalar | `fiz_10_t04_c01` … `c07` | 271–353 |

Tema 1 alt bölümleri (üretimde kullanıldı):

| Bölüm | konu_id | Sayfa |
| --- | --- | --- |
| 1.1 Sabit Hızlı Hareket | `fiz_10_t01_c01` | 17–33 |
| 1.2 Bir Boyutta Sabit İvmeli Hareket (ivme–hız değişimi) | `fiz_10_t01_c02` | 34–41 |
| 1.2 devamı: grafikler, matematiksel modeller | `fiz_10_t01_c03` | 42–60 |

> Sayfa aralıkları **kitabın kendi baskısına** göredir; PDF sayfa numarası ile kitabın
> basılı sayfa numarası farklıysa `kaynak` alanında **basılı sayfa** yazılır, defterde
> ikisi birlikte kaydedilir.
