# TYMM Tamlık Denetimi — 2026 10. Sınıf

> `node scripts/tymm-denetim.js` üretir · elle düzenlenmez.
> Doğrulama testi: `npm run test:tymm`

## Yönetici özeti

- **158 öğrenme çıktısı ve 612 süreç bileşeni**, resmî TYMM 2026 verisiyle **birebir aynı** (fark: 0).
- **Din Kültürü tamdır**: 17 çıktı / 65 süreç bileşeni, tema dağılımı 3-3-4-4-3. Eksik madde yok.
- **Sorular**: 158 çıktının 38 tanesine havuzdan **hiç soru ulaşmıyor**; havuzda bu çıktılara bağlı toplam 1610 soru diğerlerine bağlı.

## Kaynak ve yöntem

Her dersin resmî programı MEB Talim ve Terbiye Kurulu yayınıdır. Fikstür, program PDF'inden
çıkarılan çıktı/süreç metinlerini **sha256 damgasıyla** taşır; yerel veri bu metinlerle
noktalama dışında karakter karakter karşılaştırılır (harf farkı affedilmez).

| Ders | Kaynak (PID) | sha256 |
| --- | --- | --- |
| Biyoloji | 2250 | `758809eb508d40e0…` |
| Coğrafya | 2251 | `39aee8c83fb67752…` |
| Din Kültürü | 2153 | `c48c7083d24b1063…` |
| Felsefe | 2253 | `26ada7a42aea65c5…` |
| Fizik | 2254 | `119b158574ebc2a4…` |
| Kimya | 2255 | `8ebbc113d520eb11…` |
| Matematik | 2256 | `8e1b0c98f0e42b08…` |
| Tarih | 2271 | `19340c05d40256af…` |
| Türk Dili ve Edebiyatı | 2252 | `a04e1444eae5495a…` |

Din Kültürü'nün kaynağı doğrudan kullanıcının verdiği PDF'in resmî adresidir:
`https://mufredat.meb.gov.tr/Dosyalar/2026313101155916-dkab912.pdf`
(sha256 `c48c7083d24b106321ee5ba403ce05b54d9fc9b3a68ed1242bbf5989d5faa8c3`).

**Not:** TYMM web sitesi (tymm.meb.gov.tr) Din Kültürü'nü listelemez; program yalnız
mufredat.meb.gov.tr'de yayımlanmıştır. "TYMM'de Din yok" gözlemi doğrudur, **veri yok**
anlamına gelmez.

## 1) Ders bazlı tamlık ve soru kapsamı

| Ders | Çıktı (yerel/resmî) | Süreç (yerel/resmî) | Metin farkı | Bağlı konu | Erişilebilir soru | Sorusuz çıktı |
| --- | --- | --- | --- | --- | --- | --- |
| Biyoloji | 19/19 ✅ | 61/61 | 0 | 13 | 240 | 0 |
| Coğrafya | 18/18 ✅ | 73/73 | 0 | 18 | 229 | 1 |
| Din Kültürü | 17/17 ✅ | 65/65 | 0 | 0 | 0 | 17 |
| Felsefe | 10/10 ✅ | 38/38 | 0 | 22 | 277 | 0 |
| Fizik | 22/22 ✅ | 70/70 | 0 | 20 | 214 | 2 |
| Kimya | 21/21 ✅ | 69/69 | 0 | 16 | 214 | 2 |
| Matematik | 21/21 ✅ | 123/123 | 0 | 21 | 252 | 0 |
| Tarih | 14/14 ✅ | 49/49 | 0 | 12 | 184 | 0 |
| Türk Dili ve Edebiyatı | 16/16 ✅ | 64/64 | 0 | 0 | 0 | 16 |
| **Toplam** | **158/158** | **612/612** | **0** | — | **1610** | **38** |

## 2) Din Kültürü: resmî programla tam karşılaştırma

### 2.1 Çıktı ve süreç bileşenleri

| # | Kod | Süreç bileşeni sayısı |
| --- | --- | --- |
| 1.1 | `DKAB.10.1.1` | 2 |
| 1.2 | `DKAB.10.1.2` | 4 |
| 1.3 | `DKAB.10.1.3` | 5 |
| 2.1 | `DKAB.10.2.1` | 4 |
| 2.2 | `DKAB.10.2.2` | 4 |
| 2.3 | `DKAB.10.2.3` | 5 |
| 3.1 | `DKAB.10.3.1` | 4 |
| 3.2 | `DKAB.10.3.2` | 4 |
| 3.3 | `DKAB.10.3.3` | 3 |
| 3.4 | `DKAB.10.3.4` | 5 |
| 4.1 | `DKAB.10.4.1` | 3 |
| 4.2 | `DKAB.10.4.2` | 2 |
| 4.3 | `DKAB.10.4.3` | 3 |
| 4.4 | `DKAB.10.4.4` | 5 |
| 5.1 | `DKAB.10.5.1` | 3 |
| 5.2 | `DKAB.10.5.2` | 4 |
| 5.3 | `DKAB.10.5.3` | 5 |
| | **17 çıktı** | **65 süreç bileşeni** |

Tema dağılımı 3 / 3 / 4 / 4 / 3 = **17**, resmî 1.3 tablosuyla
(s. 36-37: 3 + 3 + 4 + 4 + 3 = 17) birebir aynı.

### 2.2 ODSGM'nin 7 konusu TYMM'de var mı?

| ODSGM kodu | ODSGM konusu | TYMM'de |
| --- | --- | --- |
| `DKAB.10.1.1` | İslam’da Bilgi ve Bilginin Kaynakları | ✅ var |
| `DKAB.10.1.2` | Allah-Âlem İlişkisi | ✅ var |
| `DKAB.10.1.3` | Kur’an’dan Mesajlar | ✅ var |
| `DKAB.10.2.1` | Allah’ın Varlığının Delilleri | ✅ var |
| `DKAB.10.2.2` | Allah’ı İsim ve Sıfatlarıyla Tanımak | ✅ var |
| `DKAB.10.2.3` | Kur’an’dan Mesajlar | ✅ var |
| `DKAB.10.3.1` | İslam’ın Tevhit İlkesi | ✅ var |

ODSGM 10. sınıf Din tablosunda **7 konu** var; hepsi TYMM'de bulunuyor.
ODSGM yalnız 1. dönemi (tema 1-3) kapsadığı için 17 çıktının 7'sini listeler;
tam liste resmî programdan alınmıştır (17/17).

### 2.3 Okulizyon'un gönderdiği satırlar (27-30)

| Okulizyon metni | Bağlandığı kod | Yöntem |
| --- | --- | --- |
| İslam düşüncesinde bilginin yerini ve kaynaklarını inceler. | `DKAB.10.1.1` | surec |
| İslam düşüncesinde bilginin yeri ve kaynakları arasındaki ilişkiyi belirler. | `DKAB.10.1.1` | surec |
| Allah-âlem ilişkisi hakkında İslam’ın temel kaynaklarından bilgi toplar. | `DKAB.10.1.2` | ayirt-edici-ifade |

Üçüncü satır ("Allah-âlem ilişkisi hakkında … bilgi toplar.") resmî süreç listesinde
**birebir geçmez**; Okulizyon'un yeniden ifadesidir. "Allah-âlem ilişkisi" ifadesi
DKAB.10.1.2 çıktısının başlığıdır, bu yüzden ayırt edici ifade katmanı doğru kodu bulur.
Bu satır bir **veri eksiği değildir** — resmî metin farklı yazılmıştır.

### 2.4 Din'de sorular neden yok?

Havuzdaki 202 Din sorusu **2018 programının** 16 konusuna aittir:

`1.1 Kur'an-ı Kerim ve Özellikleri`, `2.1 İslam'ın İbadet Boyutu`, `3.1 İslam'ın Ahlak Boyutu`, `4.1 Hz. Muhammed'in Hayatı` …

2026 programının tema başlıkları bunlardan tamamen farklıdır:

`İslam'da Varlık ve Bilgi`, `Allah'ı Tanımak`, `İslam'ın Evrensel Mesajları`, `Din, Çevre ve Teknoloji`, `İslam Düşüncesinde İtikadi-Siyasi ve Fıkhi Yorumlar`

Bu yüzden `scripts/meb-kazanim-uret.js` Din için **kod yazmaz** (`yapi-farkli` katmanı):
aynı numaralı ünite aynı içerik değildir. Sonuç: **eşleme doğru, soru yok** — kullanıcının
tespiti bu noktada doğrudur. Eksik olan haritalama değil, **2026 konularına ait soru içeriğidir**.

## 3) Sorusuz çıktıların tam listesi

### Coğrafya — 1 çıktı

`COĞ.10.6.1`

### Din Kültürü — 17 çıktı

`DKAB.10.1.1`, `DKAB.10.1.2`, `DKAB.10.1.3`, `DKAB.10.2.1`, `DKAB.10.2.2`, `DKAB.10.2.3`, `DKAB.10.3.1`, `DKAB.10.3.2`, `DKAB.10.3.3`, `DKAB.10.3.4`, `DKAB.10.4.1`, `DKAB.10.4.2`, `DKAB.10.4.3`, `DKAB.10.4.4`, `DKAB.10.5.1`, `DKAB.10.5.2`, `DKAB.10.5.3`

### Fizik — 2 çıktı

`FİZ.10.3.7`, `FİZ.10.4.7`

### Kimya — 2 çıktı

`KİM.10.2.7`, `KİM.10.2.8`

### Türk Dili ve Edebiyatı — 16 çıktı

`TDE1.1`, `TDE1.2`, `TDE1.3`, `TDE1.4`, `TDE2.1`, `TDE2.2`, `TDE2.3`, `TDE2.4`, `TDE3.1`, `TDE3.2`, `TDE3.3`, `TDE3.4`, `TDE4.1`, `TDE4.2`, `TDE4.3`, `TDE4.4`

Nedenleri:

- **Din Kültürü**: 2026-11-17'de havuzlar ders kitabının içindekilerine göre yenilendi (17 ana konu + 7 alt konu = 24 konu; ağaç `konular.js`). Kalan fark, programın 17 öğrenme çıktısı ile kitabın alt başlıkları arasındaki ayrım: çıktılar "1.1 İslam'da bilgi ve bilginin kaynaklarını çözümler" gibi bütüncül cümleler, kitap ise 1.1.1 / 1.1.2 alt başlıklarına iniyor. Ağaç kitabı izler; çıktı-konu kodu eşlemesi bu yüzden birebir değil.
- **Türk Dili ve Edebiyatı**: program dil becerisi eksenli (TDE1.1-TDE4.4). Havuz konuları tür/gramer
  başlığı (Koşuk, Gazel, İsimler…); resmî çıktılar beceri bildirir. Kod yazmak uydurma olurdu.
- **Coğrafya COĞ.10.6.1 / Fizik FİZ.10.3.7, FİZ.10.4.7 / Kimya KİM.10.2.7, KİM.10.2.8**: 2026'da
  eklenen çıktı; havuzda karşılık gelen konu yok.

## 4) Yöntem sınırları (dürüstlük notu)

- Süreç bileşenleri **resmî metinden** alınır; hiçbir madde elle yazılmaz veya tamamlanmaz.
- Bir kazanım hiçbir konuya bağlanamıyorsa kod **boş bırakılır**; tahmin yazılmaz.
- Okulizyon metni resmî süreç cümlesi değilse "ayırt edici ifade" katmanı devreye girer ve
  katman adı `yontem` alanında saklanır (izlenebilirlik).

_Üretim: 2026-11-16_
