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
| Fizik | `fizik` | _(bekleniyor)_ | | | ⬜ | | ⬜ |
| Kimya | `kimya` | | | | ⬜ | | ⬜ |
| Biyoloji | `biyoloji` | | | | ⬜ | | ⬜ |
| Matematik | `matematik` | | | | ⬜ | | ⬜ |
| Coğrafya | `cografya` | | | | ⬜ | | ⬜ |
| Tarih | `tarih` | | | | ⬜ | | ⬜ |
| Felsefe | `felsefe` | | | | ⬜ | | ⬜ |
| Din Kültürü | `din` | | | | ⬜ | | ⬜ |
| Türk Dili ve Edebiyatı | `edebiyat` | | | | ⬜ | | ⬜ |

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

| Tema | Ad | konu_id aralığı | Sayfa |
| --- | --- | --- | --- |
| 1 | Kuvvet ve Hareket | `fiz_10_t01_c01` … `c03` | |
| 2 | Enerji | `fiz_10_t02_c01` … `c03` | |
| 3 | Elektrik ve Manyetizma | | |
| 4 | Dalgalar | | |

> Sayfa aralıkları **kitabın kendi baskısına** göredir; PDF sayfa numarası ile kitabın
> basılı sayfa numarası farklıysa `kaynak` alanında **basılı sayfa** yazılır, defterde
> ikisi birlikte kaydedilir.
