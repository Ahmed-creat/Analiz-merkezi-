# Matematik 10 — ilerleme ve kanıt defteri

Tarih: 2026-11-16 · Dal: `arena/4cc1805b-analiz-merkezi`
Kural: her cümle ders kitabının kendi metnine ve sayfasına bağlıdır (NotebookLM kuralı).
Kaynak metin: `kitap-kaynak` dalındaki `matematik.json` (417 sayfa; `s` = PDF sayfası = basılı sayfa + 1).
Metin OCR gürültülü olduğu için cümleler kitabın anlamına bağlı kalınarak yeniden yazıldı; ham metin kopyalanmadı.

---

## 0) Durum özeti

| Ölçü | Önce | Şimdi |
|---|---|---|
| 10. sınıf Matematik konusu (ağaç) | 21 (kısaltılmış başlıklar) | **21 — kitabın içindekiler başlıklarıyla** |
| Matematik havuzu (canlı) | 21 (12 soru, **zip** kaynaklı) | **21 — 21'i de kitap kaynaklı** |
| Matematik sorusu | 252 | **210** |
| Kitap künyesi olmayan matematik havuzu | 21 | **0** |
| Arşive taşınan eski matematik havuzu | 0 | **21** (`mat_10_t*`) |
| Kazanım künyesi "kesin" | 18 / 21 | **21 / 21** |

**Matematik bitti.** Kalan dersler: Kimya → Biyoloji + Coğrafya + Tarih → Din → Felsefe → TDE → son tur.

---

## 1) Havuzlar (21 havuz · 210 soru · hepsi kitaptan)

| Havuz | Kitap başlığı (içindekiler) | Sayfa | Soru |
|---|---|---|---|
| `mat_10_u01_k01` | 1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler | s.15-31 | 10 |
| `mat_10_u01_k02` | 1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler | s.32-58 | 10 |
| `mat_10_u01_k03` | 1.3 Üçgende Alan | s.59-75 | 10 |
| `mat_10_u01_k04` | 1.4 Sinüs ve Kosinüs Teoremleri | s.76-88 | 10 |
| `mat_10_u02_k01` | 2.1 İki Kategorik Değişkenin İlişkililiğini İçeren İstatistiksel Problemi Oluşturma, Veri Toplama, Analiz Etme ve Yorumlama | s.98-127 | 10 |
| `mat_10_u02_k02` | 2.2 Başkaları Tarafından Oluşturulan İki Kategorik Değişkenli Verilerin İlişkililiğine Dayalı İstatistiksel Sonuç veya Yorumları Tartışma | s.128-132 | 10 |
| `mat_10_u03_k01` | 3.1 Bir Doğal Sayı ile Asal Çarpanları ve Bölenleri Arasındaki İlişkiler | s.143-148 | 10 |
| `mat_10_u03_k02` | 3.2 En Büyük Ortak Bölen-En Küçük Ortak Kat | s.149-160 | 10 |
| `mat_10_u03_k03` | 3.3 Bölünebilme Özelliklerini Kullanarak Kalan Bulma | s.161-173 | 10 |
| `mat_10_u04_k01` | 4.1 Gerçek Sayılarda Tanımlı Fonksiyonların Nitel Özellikleri | s.182-196 | 10 |
| `mat_10_u04_k02` | 4.2 Gerçek Sayılarda Tanımlı Karesel Fonksiyonlar ve Nitel Özellikleri | s.197-223 | 10 |
| `mat_10_u04_k03` | 4.3 Gerçek Sayılarda Tanımlı Karekök Fonksiyonlar ve Nitel Özellikleri | s.224-242 | 10 |
| `mat_10_u04_k04` | 4.4 Gerçek Sayılarda Tanımlı Rasyonel Fonksiyonlar ve Nitel Özellikleri | s.243-263 | 10 |
| `mat_10_u04_k05` | 4.5 Doğrusal, Karesel, Karekök ve Rasyonel Referans Fonksiyonlar ile Bu Fonksiyonlardan Türetilebilen Fonksiyonların Ters Fonksiyonları | s.264-283 | 10 |
| `mat_10_u04_k06` | 4.6 Doğrusal, Karesel, Karekök, Rasyonel Referans Fonksiyonlar ve Bunlardan Türetilen Fonksiyonlarla İfade Edilebilen Denklem ve Eşitsizlikler İçeren Problemlerin Çözümü | s.284-305 | 10 |
| `mat_10_u05_k01` | 5.1 Sayma Stratejileri | s.313-338 | 10 |
| `mat_10_u05_k02` | 5.2 Cebirsel ve Fonksiyonel İşlemlerin Algoritmik Yapısı | s.339-351 | 10 |
| `mat_10_u06_k01` | 6.1 Dik Koordinat Sisteminde İki Nokta Arasındaki Uzaklık ve Bir Doğru Parçasını Belli Oranda Bölme | s.359-371 | 10 |
| `mat_10_u06_k02` | 6.2 Dik Koordinat Sisteminde Doğrunun Özellikleri ve Analitik İncelenmesi | s.372-384 | 10 |
| `mat_10_u07_k01` | 7.1 Koşullu Olasılık, Bağımlı ve Bağımsız Olaylar | s.393-403 | 10 |
| `mat_10_u07_k02` | 7.2 Bayes Teoremi | s.404-408 | 10 |

Arşive giden 21 dosya: `arsiv/soru_havuzlari/matematik/eski-mat_10_t01_c01.json` … `eski-mat_10_t07_c02.json` (`git mv`).

---

## 2) Ağaç (21 konu — kitabın içindekiler düzeyi)

```
1. Tema: Geometrik Şekiller            (s.12)
  1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler   s.15
  1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler        s.32
  1.3 Üçgende Alan                                                     s.59
  1.4 Sinüs ve Kosinüs Teoremleri                                      s.76
2. Tema: İstatistiksel Araştırma Süreci (s.94)
  2.1 İki Kategorik Değişkenin İlişkililiğini İçeren İstatistiksel Problemi
      Oluşturma, Veri Toplama, Analiz Etme ve Yorumlama                s.98
  2.2 Başkaları Tarafından Oluşturulan İki Kategorik Değişkenli Verilerin
      İlişkililiğine Dayalı İstatistiksel Sonuç veya Yorumları Tartışma s.128
3. Tema: Sayılar                       (s.140)
  3.1 Bir Doğal Sayı ile Asal Çarpanları ve Bölenleri Arasındaki İlişkiler s.143
  3.2 En Büyük Ortak Bölen-En Küçük Ortak Kat                          s.149
  3.3 Bölünebilme Özelliklerini Kullanarak Kalan Bulma                 s.161
4. Tema: Nicelikler ve Değişimler      (s.178)
  4.1 Gerçek Sayılarda Tanımlı Fonksiyonların Nitel Özellikleri        s.182
  4.2 Gerçek Sayılarda Tanımlı Karesel Fonksiyonlar ve Nitel Özellikleri s.197
  4.3 Gerçek Sayılarda Tanımlı Karekök Fonksiyonlar ve Nitel Özellikleri s.224
  4.4 Gerçek Sayılarda Tanımlı Rasyonel Fonksiyonlar ve Nitel Özellikleri s.243
  4.5 ... Fonksiyonların Ters Fonksiyonları                             s.264
  4.6 ... Denklem ve Eşitsizlikler İçeren Problemlerin Çözümü          s.284
5. Tema: Sayma, Algoritma ve Bilişim   (s.310)
  5.1 Sayma Stratejileri                                               s.313
  5.2 Cebirsel ve Fonksiyonel İşlemlerin Algoritmik Yapısı             s.339
6. Tema: Analitik İnceleme             (s.356)
  6.1 ... İki Nokta Arasındaki Uzaklık ve Bir Doğru Parçasını Belli
      Oranda Bölme                                                     s.359
  6.2 ... Doğrunun Özellikleri ve Analitik İncelenmesi                 s.372
7. Tema: Veriden Olasılığa             (s.390)
  7.1 Koşullu Olasılık, Bağımlı ve Bağımsız Olaylar                    s.393
  7.2 Bayes Teoremi                                                    s.404
```

`konular.js` güncellemesi yalnız `"10": {` sonrasındaki Matematik bloğunu değiştirdi; 9. sınıf bloğu ve diğer dersler dokunulmadan kaldı (iki dosya: `konular.js`, `pwa-files/functions/konular.js`).

---

## 3) Soruların dayandığı kitap sayfaları (örnek künyeler)

| Havuz | Kitaptaki kanıt | Soruya nasıl girdi |
|---|---|---|
| `u01_k01` | s.18-23: trigonometrik oran tablosu, 3. örnek, eğim % | sin/cos/tan 7-24-25 üçgeninde; kırık direk 1,2 m / 30° → 3,6 m; tan17°·100 ≈ %29,24 |
| `u01_k02` | s.34-48: iç açıortay teoremi, ağırlık merkezi 2:1 | 6/9 ve 4 → \|DC\| = 6; \|AG\| = 8 → \|GD\| = 4 |
| `u01_k03` | s.65-71: ortak tabanlı üçgenler, benzer üçgende alan oranı | paralel doğrular arası eşit alan; (2/3)² = 4/9; ½·6·8·sin30° = 12 |
| `u01_k04` | s.78-84: sinüs/kosinüs teoremi, Kuba-Tobise-Taisho | b = 6√3; 5-7-60° → a² = 39; 60, 50√3, 30° → 10√21 |
| `u02_k01` | s.98-104: iki yönlü sıklık tablosu, satır yüzdesi | kategorik değişken sorusu; 24/40 = %60 |
| `u02_k02` | s.128-131: yorum tartışma, eksen kırpma | nedensellik eleştirisi; örneklem yanlılığı |
| `u03_k01` | s.144: bölen sayısı tablosu (18, 36, 48…) | 18 → 6, 36 → 9, 72 → 12 |
| `u03_k02` | s.151-156: EBOB-EKOK, 6-8 örneği, tomruk | EBOB(24,36) = 12; EKOK(6,8) = 24 |
| `u03_k03` | s.163-169: 3/4/5/8/9 kuralları, 175 örneği | 1472 → 2; 175'in 12'ye kalanı 7 → 4'e kalanı 3 |
| `u04_k01` | s.183-190: tanker 600 L / 20 L/dk | tanım kümesi [0,30], görüntü [0,600] |
| `u04_k02` | s.199-210: f(x)=x², [−3,2]; Δ işaretleri | görüntü [0,9]; tepe (2,−1) |
| `u04_k03` | s.224-228: √x tanım/görüntü, 11. örnek | [0,∞); [0,20] aralığında en büyük değer √20 |
| `u04_k04` | s.245-252: 1/x referans fonksiyonu | tanım R−{0}; iki aralıkta azalan; asimptotlar |
| `u04_k05` | s.264-278: ters fonksiyon tablosu | g(x)=4x → x/4; h(x)=x−2 → x+2 |
| `u04_k06` | s.287-300: −x²+20x−96 örneği | kökler 8, 12; f<0: (−∞,8)∪(12,∞); tepe (10,4) |
| `u05_k01` | s.315-322: toplama/çarpma yoluyla sayma, ASCII | 4·3·2 = 24; 2⁷ = 128, 2⁸ = 256 |
| `u05_k02` | s.339-346: akış şeması, mantık bağlaçları, Babil metodu | "ve/veya/ise", teşekkür koşulu 70-84,99; √70 → x₁ = 8,375 |
| `u06_k01` | s.362-369: harita ölçeği, içten/dıştan bölme | 13 birim → 52 km; C(1,2); C(8,−6) |
| `u06_k02` | s.372-382: eğim, paralel/dik | eğim 2; dik eğim −1/2 |
| `u07_k01` | s.394-399: koşullu olasılık, fırıncı örneği | 4/7; 1/3; P(buğday\|B) = 5/17 |
| `u07_k02` | s.405-408: çilek alerjisi, ambalaj, böbrek taşı | 1/3; 1/5 ve 26/75; 6/11 |

---

## 4) Bu turda düzeltilen dört hata (kanıt)

1. **5.2 yanlış konu sanıldı.** 5.2'nin "olasılık hesaplamaları" değil **"Cebirsel ve Fonksiyonel İşlemlerin Algoritmik Yapısı"** olduğu içindekilerden (s.8) doğrulandı; havuz s.339-351'e göre yeniden yazıldı (akış şeması, mantık bağlaçları, Babil metodu).
2. **Ambalaj sorusunun cevabı yanlış hatırlanıyordu.** Kitabın 6. örneğinde hatalı sayılar 10 + 15 + 24 + 26 = **75**'tir; P(kırmızı|hatalı) = 15/75 = **1/5** (s.405). Önceki notta geçen "15/65 = 3/13" kitap metniyle uyuşmuyor.
3. **Geometri şeklinde açı yeri.** 7-24-25 üçgeninde sinüs sorusunun açısı yanlış köşeye konmuştu; α, karşısındaki kenar 7 olan **C köşesine** taşındı (şekil–metin tutarlılığı).
4. **`konu_esleme.json` metin alanı.** Yeniden yazımda kazanım cümlesi düşürülünce otomatik konu önerisi zayıfladı (2 test kırıldı); metin alanı `konu · konu · kazanım cümlesi` biçiminde korunarak düzeltildi.

---

## 5) Kapılar — bu turun çalıştırılmış çıktıları

```
$ node scripts/havuz-index-uret.js
havuz: 262 · soru: 2803 · flashcard: 2803

$ npm run -s test:hepsi          # çıkış 0
TÜM TESTLER GEÇTİ (86/86)
SORU ÜRETİM PLANI: 67/67 geçti ✅
Şekil tutarlılık testi — 388/388 geçti ✓
Okulizyon konu eşleme testleri — 91/91 geçti ✓

$ node docs/uretim/araclar/kaynak-denetle.js docs/uretim/.kitap-metin
== HATALAR (0)
Matematik    21    21    0    0    0        0     (havuz · kitap · zip)
Matematik    21          21         0          0  (ağaç · kitap havuzu · zip havuzu)

$ node docs/uretim/uretim/matematik-tur2-guncelle.js
✔ konular.js / pwa-files/functions/konular.js: 21 konu (yalnız "10" bloğu)
✔ konu_kayit_defteri.json (iki kopya): 21 matematik kaydı
✔ iliski_grafi.json (iki kopya): 165 düğüm · 167 kenar (+6 sert ön koşul)
✔ PWA kopyası: 21 havuz · sw.js: 21/21 önbellek satırı
```

Ağaçta `kaynak-denetle` "kitap havuzu 21 / zip havuzu 0" diyor: Matematik'te zip kaynaklı tek havuz kalmadı.

---

## 6) Sırada ne var

1. **Kimya** — 19 konu / 35 havuz; aynı üç betik yöntemi.
2. Biyoloji + Coğrafya + Tarih, sonra Din, Felsefe, TDE.
3. Son tur: ağaç/kayıt defteri/arşiv/kapılar/rapor.
