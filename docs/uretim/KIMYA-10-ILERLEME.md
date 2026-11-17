# Kimya 10 — ilerleme ve kanıt defteri

Tarih: 2026-11-16 · Dal: `arena/4cc1805b-analiz-merkezi`
Kural: her cümle ders kitabının kendi metnine ve sayfasına bağlıdır (NotebookLM kuralı).
Kaynak metin: `kitap-kaynak` dalındaki `kimya.json` (293 sayfa; `s` = PDF sayfası = basılı sayfa + 1).
Metin OCR gürültülü olduğu için (alt indisler dağılmış, "Eftizyon", "Çözünürlğe") cümleler kitabın anlamına
bağlı kalınarak yeniden yazıldı; ham metin kopyalanmadı.

---

## 0) Durum özeti

| Ölçü | Önce | Şimdi |
|---|---|---|
| 10. sınıf Kimya konusu (ağaç) | 19 (2 yazım hatası: "Eftizyon", "Çözünürlğe") | **19 — kitabın içindekiler başlıklarıyla, hatalar düzeltildi** |
| Kimya havuzu (canlı) | 35: 14 `kimya_10_u*` (zip) + 21 `kim_10_t*` (2018 şeması) | **19 — 19'u da kitap kaynaklı** |
| Kimya sorusu | 142 (zip) + 213 (eski şema) = 355 | **190** |
| Kitap künyesi olmayan kimya havuzu | 35 | **0** |
| Arşive taşınan kimya havuzu | 3 (v35.3 elle yazılan) | **38** (3 + 21 `eski-*` + 14 `zip-*`) |
| Kazanım künyesi "kesin" | 14 / 19 | **19 / 19** |

**Kimya bitti.** Kalan dersler: Biyoloji + Coğrafya + Tarih → Din → Felsefe → TDE → son tur.

---

## 1) Havuzlar (19 havuz · 190 soru · hepsi kitaptan)

| Havuz | Kitap başlığı (içindekiler) | Sayfa | Soru |
|---|---|---|---|
| `kimya_10_u01_k01` | 1.1.1 Kimyasal Tepkimelerin Oluşumu | s.21-34 | 10 |
| `kimya_10_u01_k02` | 1.1.2 Kimyasal Tepkime Türleri | s.35-46 | 10 |
| `kimya_10_u01_k03` | 1.1.3 Mol Kavramı | s.47-60 | 10 |
| `kimya_10_u01_k04` | 1.1.4 Kimyasal Tepkime Denklemlerinin Denkleştirilmesi | s.61-67 | 10 |
| `kimya_10_u01_k05` | 1.1.5 Kimyasal (Stokiyometrik) Hesaplamalar | s.68-76 | 10 |
| `kimya_10_u01_k06` | 1.2.1 Gazların Özellikleri ve Gaz Yasaları | s.77-93 | 10 |
| `kimya_10_u01_k07` | 1.2.2 Gazların Kinetik Moleküler Teorisi | s.94-97 | 10 |
| `kimya_10_u01_k08` | 1.2.3 İdeal Gaz Yasası | s.98-105 | 10 |
| `kimya_10_u01_k09` | 1.2.4 Graham Difüzyon ve Efüzyon Yasası | s.106-113 | 10 |
| `kimya_10_u02_k01` | 2.1.1 Çözünme Süreci | s.151-155 | 10 |
| `kimya_10_u02_k02` | 2.1.2 Maddelerin Birbiri İçindeki Çözünebilirliği | s.156-163 | 10 |
| `kimya_10_u02_k03` | 2.1.3 Çözünme Olayının Sınıflandırılması | s.164-171 | 10 |
| `kimya_10_u02_k04` | 2.1.4 Derişim Birimleri (Molarite, ppm) | s.172-178 | 10 |
| `kimya_10_u02_k05` | 2.1.5 Çözünürlük | s.179-183 | 10 |
| `kimya_10_u02_k06` | 2.1.6 Çözünürlüğe Etki Eden Faktörler | s.184-191 | 10 |
| `kimya_10_u02_k07` | 2.1.7 Çözeltilerin Sınıflandırılması | s.192-201 | 10 |
| `kimya_10_u02_k08` | 2.1.8 Koligatif Özellikler | s.202-210 | 10 |
| `kimya_10_u03_k01` | 3.1.1 Makro ve Mikro Ölçekli Deneyler | s.238-246 | 10 |
| `kimya_10_u03_k02` | 3.1.2 Atmosferdeki Tepkimeler ve Küresel Sorunlar | s.247-255 | 10 |

Üretici betikler (hepsi `yazKonu()`, her beceriye ≥ 2 soru, 1:1 flashcard):

```
docs/uretim/uretim/kimya-t1.js   → tema 1 · 9 havuz (u01_k01…k09)
docs/uretim/uretim/kimya-t2.js   → tema 2 · 8 havuz (u02_k01…k08) + tema 3 · 2 havuz (u03_k01…k02)
docs/uretim/uretim/kimya-tur2-guncelle.js   → ağaç, kayıt defteri, grafik, PWA, sw.js
docs/uretim/uretim/kimya-tur2-veri-esle.js  → kazanım/konu indeksleri, anahtar sözcükler
docs/uretim/uretim/kimya-tur2-duzelt.js     → `havuz-denetle` bulgularının kaynak metin düzeltmesi
```

Arşive giden dosyalar (`arsiv/soru_havuzlari/kimya/`):

- `eski-kim_10_t01_c01.json` … `eski-kim_10_t03_c02.json` — 21 dosya / 213 soru (2018 şeması, zip kaynaklı)
- `zip-kimya_10_u01_k01.json` … `zip-kimya_10_u03_k01.json` — 14 dosya / 142 soru (eski `kimya_10_u*`, `kaynak_dosya: "10. Sınıf kimya json.zip"`)
- `kimya_10_u02_k06.json`, `u02_k07`, `u02_k08` — v35.3 elle yazılan 3 havuz (daha önce arşivlenmişti)

Yeni havuzlar aynı `konu_id` ile yayımda olduğu için eski dosyalar **silinmedi**, ad değiştirilerek saklandı (`arsiv/README.md` tablosuna işlendi).

---

## 2) Ağaç (19 konu — kitabın içindekiler düzeyi)

```
1. Tema: Kimyasal Türler ve Etkileşimler (s.18)
  1.1.1 Kimyasal Tepkimelerin Oluşumu                                s.21
  1.1.2 Kimyasal Tepkime Türleri                                     s.35
  1.1.3 Mol Kavramı                                                  s.47
  1.1.4 Kimyasal Tepkime Denklemlerinin Denkleştirilmesi             s.61
  1.1.5 Kimyasal (Stokiyometrik) Hesaplamalar                         s.68
  1.2.1 Gazların Özellikleri ve Gaz Yasaları                          s.77
  1.2.2 Gazların Kinetik Moleküler Teorisi                            s.94
  1.2.3 İdeal Gaz Yasası                                              s.98
  1.2.4 Graham Difüzyon ve Efüzyon Yasası                             s.106
2. Tema: Çeşitlilik (s.148)
  2.1.1 Çözünme Süreci                                               s.151
  2.1.2 Maddelerin Birbiri İçindeki Çözünebilirliği                   s.156
  2.1.3 Çözünme Olayının Sınıflandırılması                            s.164
  2.1.4 Derişim Birimleri (Molarite, ppm)                             s.172
  2.1.5 Çözünürlük                                                    s.179
  2.1.6 Çözünürlüğe Etki Eden Faktörler                               s.184
  2.1.7 Çözeltilerin Sınıflandırılması                                s.192
  2.1.8 Koligatif Özellikler                                          s.202
3. Tema: Sürdürülebilirlik (s.235)
  3.1.1 Makro ve Mikro Ölçekli Deneyler                               s.238
  3.1.2 Atmosferdeki Tepkimeler ve Küresel Sorunlar                   s.247
```

`konular.js` güncellemesi yalnız `"10": {` sonrasındaki Kimya bloğunu değiştirdi; 9. sınıf bloğu ve diğer
dersler dokunulmadan kaldı (iki dosya: `konular.js`, `pwa-files/functions/konular.js`). Bu sırada iki yazım
hatası düzeldi: **"Eftizyon" → "Efüzyon"**, **"Çözünürlğe" → "Çözünürlüğe"**.

---

## 3) Soruların dayandığı kitap sayfaları (örnek künyeler)

| Havuz | Kitaptaki kanıt | Soruya nasıl girdi |
|---|---|---|
| `u01_k01` | s.22 alev renkleri (Cu mavi, Ba yeşil, Na sarı, Sr kırmızı); s.26 değişim göstergeleri | Na tuzu → sarı; paslanmada renk değişimi + katı oluşumu |
| `u01_k02` | s.42 AgNO₃ + Cl⁻ → beyaz AgCl; s.45 H⁺ + OH⁻ → H₂O (seyirci iyon) | çökelme denklemi; seyirci iyon seçimi |
| `u01_k03` | s.55 C 12, Cu 63,5, Ag 108; s.58 n = m/MA, 12,04·10²³ CH₄ = 2 mol | 108 g Ag = 1 mol; 36 g su = 2 mol; 0,5 mol CO₂ = 22 g |
| `u01_k04` | s.61-67 denkleştirme sırası (metal → ametal → H → O) | en son O ve H eşitlenir |
| `u01_k05` | s.71 2Al + 3BaO → Al₂O₃ + 3Ba; s.74 2H₂S + SO₂ → 3S + 2H₂O | 4 mol Al = 108 g; 0,2 mol SO₂ → 19,2 g S; %50 verim |
| `u01_k06` | s.82/89 1 atm = 76 cmHg = 760 mmHg; s.90 Boyle 2 atm·4 L → 8 atm; s.91 1 atm/27 °C → 900 K = 627 °C | 1 atm = 760 mmHg; 627 °C; P·V sabit |
| `u01_k07` | s.95 aynı T'de ortalama kinetik enerji eşit, H₂ O₂'den hızlı; s.96 tanecik hareketi | KE eşitliği; basıncın nedeni çepere çarpma |
| `u01_k08` | s.100-101 R = 0,0821 L·atm/(mol·K); tablo 2 atm · 11,2 L · 1 mol · 273 K | R = 0,0821; PV = nRT hesabı |
| `u01_k09` | s.109-110 difüzyon/efüzyon tanımı; Graham bağıntısı | difüzyon-efüzyon ayrımı; hız oranı √(M₂/M₁) |
| `u02_k01` | s.151 Görsel 2.1 üç aşama; s.153 yeni etkileşimlerde enerji | üç aşama; kristalden ayrılma |
| `u02_k02` | s.156 A, D, K yağda / C polar; s.157-158 CCl₄-iyot, su-tuz | benzer benzeri çözer; iyot apolar çözücüde |
| `u02_k03` | s.167 SrCl₂ → Sr²⁺ + 2Cl⁻; s.168 iyonik/moleküler ayrımı | iyonik çözünme; şeker moleküler çözünür |
| `u02_k04` | s.174 M = n/V; s.175-176 ppm (380 mg CO₂/1000 cm³, kahve 40 mg/200 mL); s.177 10 M 100 mL → 0,1 M = 10 L | 0,25 M; 380 ppm; 10 L |
| `u02_k05` | s.179 akide şurubu 1 ölçü su + 3 ölçü şeker; s.181-183 çözünürlük tanımı | 40 g/100 g → 200 g suda 80 g |
| `u02_k06` | s.184 Kuzey denizleri (soğuk suda O₂), gazlı içecek, şeker pancarı, dalgıç | basınç ↓ → CO₂ çözünürlüğü ↓; sıcaklık ↓ → O₂ ↑ |
| `u02_k07` | s.192 akü (H₂SO₄), s.197 elektrolit, s.199 doymuş/aşırı doymuş | şeker çözeltisi iletmez; aşırı doymuş kararsız |
| `u02_k08` | s.202 antifriz, buzlanma, s.205-206 koligatif tanecik sayısı | NaCl > şeker kaynama yükseltmesi; yola tuz |
| `u03_k01` | s.238-241 makro/mikro ölçek, atom ekonomisi, su ayak izi | %100 atom ekonomisi; mikro ölçek avantajı |
| `u03_k02` | s.247-252 orman yangını-ozon gazetesi, CFC, kutup girdabı, asit yağmuru | CFC ve NOₓ; Antarktika'da kışın ozon azalımı |

---

## 4) Bu turda düzeltilen hatalar (kanıt)

1. **Kazanım = havuz kayması.** Eski canlı dosyalarda `u01_k07` Graham, `u01_k08` ideal gaz havuzuydu;
   kitabın sırası `1.2.2 Kinetik Moleküler Teori → 1.2.3 İdeal Gaz Yasası → 1.2.4 Graham`. Yeni sıralama
   yazıldı ve `KİM.10.1.9 / 1.10 / 1.11` kodları buna göre bağlandı.
2. **Tema 2'de 8 konu, 6 çıktı.** `KİM.10.2.7` (molar derişim) ve `KİM.10.2.8` (tanecik sayısı – kaynama/donma
   noktası) hiçbir konuya bağlı değildi; bu turda `u02_k04` ve `u02_k08` konularına bağlandı. 3.1.1 ve 3.1.2
   ayrı havuz oldu (eskiden tek `u03_k01` içinde birleşikti).
3. **Ağaçta iki yazım hatası.** "Graham Difüzyon ve **Eftizyon** Yasası" ve "**Çözünürlğe** Etki Eden Faktörler"
   düzeltildi; başlıklar kitabın içindekilerle birebir eşlendi.
4. **`havuz-denetle` 38 bulgu verdi, hepsi kapatıldı.** Kart önleri sorunun kopyasıydı (34), 5 soru kökü
   30 karakterden kısaydı, 2 soru "grafikte/tabloya göre" deyip görsel taşımıyordu, 1 soruda "Hepsi aynı hızda"
   çeldiricisi vardı. Sorun kaynak metinlerde düzeltildi (`kimya-tur2-duzelt.js`) ve üreticiler yeniden koşuldu;
   **19/19 havuz ✅** (0 hata, 0 uyarı).
5. **`okz-meb.js` arama anahtarı.** METIN kayıtlarının `norm` alanı `sade()` ile değil `kok()` (son kelimeden ek
   atma) ile üretilmeli; aksi hâlde `konuBul()` havuzun kendi kazanım cümlesini bulamıyor (2 test kırıldı).
   Ayrıca `meb_kazanim_10.json` alanı `metin` değil `kazanim` — 2.7/2.8 cümleleri oradan okundu.
6. **Test sayacı.** `konu_esleme.json` havuz sayısı 156 → **161** oldu (19 havuz, 14'ten geliyor); üç testteki
   sabit sayaç güncellendi (`okz-konu`, `okz-konu-entegrasyon`, `meb-kazanim`).

---

## 5) Kapılar — bu turun çalıştırılmış çıktıları

```
$ node docs/uretim/uretim/kimya-t1.js && node docs/uretim/uretim/kimya-t2.js
kimya_10_u01_k01 … u03_k02 → 19 havuz × 10 soru = 190 soru, 190 flashcard, 38 beceri (her biri ≥ 2 soru)

$ node scripts/havuz-index-uret.js
havuz: 246 · soru: 2636 · flashcard: 2636      (önce 262 / 2803 / 2803)

$ npm run -s test:hepsi          # çıkış 0
Okulizyon konu eşleme testleri — 91/91 geçti ✓
Konu eşleme entegrasyon testi — 45/45 geçti ✓
TÜM TESTLER GEÇTİ (86/86)
Konu bulma / kısa kontrol / video — 76/76 geçti ✓
Şekil tutarlılık testi — 388/388 geçti ✓
TYMM ÇAPRAZ DOĞRULAMA: 66/66 geçti ✅
SORU ÜRETİM PLANI: 67/67 geçti ✅

$ node docs/uretim/araclar/kaynak-denetle.js
== HATALAR (0)
Kimya    19    19    0    0    0     0     (havuz · kitap · zip)
Kimya    19          19         0     0     (ağaç · kitap havuzu · zip havuzu)

$ node docs/uretim/araclar/havuz-denetle.js --konu
✅ kimya_10_u01_k01 … u03_k02 — 19/19 havuz temiz (0 hata · 0 uyarı)

$ node docs/uretim/uretim/kimya-tur2-guncelle.js
✔ konular.js / pwa-files/functions/konular.js: 19 konu (yalnız "10" bloğu)
✔ konu_kayit_defteri.json (iki kopya): 19 kimya kaydı
✔ iliski_grafi.json (iki kopya): 170 düğüm · 160 kenar (+16 sert ön koşul)
✔ PWA kopyası: 19 havuz · sw.js: 19/19 önbellek satırı

$ node docs/uretim/uretim/kimya-tur2-veri-esle.js
✔ konu_esleme.json: toplam 161 · kazanim_konu_10.json: 19 kimya konusu, 22 metin kaydı (kesin 19/19)
✔ okz-meb.js: METIN 22 kimya kaydı · konu-anahtar.js: 11 Kimya kuralı

$ node docs/uretim/araclar/havuz-denetle.js --konu ; npm run -s validate:pools ; npm run -s validate:ids
kimya havuzları: geçerli (10 soru) · kimlik çakışmaları owner onayına devredildi (önceden var olan 96)
```

Ağaçta `kaynak-denetle` "kitap havuzu 19 / zip havuzu 0" diyor: Kimya'da zip ya da elle yazılmış havuz kalmadı.

---

## 6) Bilinçli kararlar

- **Görsel yok (19/19 havuz metin tabanlı).** Kural şudur: soru metni bir şekle/grafiğe/tabloya gönderme
  yapıyorsa `gorsel` zorunludur; Kimya sorularının hiçbiri böyle bir gönderme yapmıyor, hepsi kitabın
  metnine ve sayısal verisine dayanıyor. (Grafiğe bağlı tek soru — P·V — bu turda kendi kendine yeterli
  hâle getirildi: "6 atm'de 2 L olan gazın hacmi 12 L olursa basınç kaç atm olur?")
- **Beceri dağılımı.** Her havuzda 2 beceri var, beceri başına 5 soru (kapı: ≥ 2). Beceriler kitabın
  bölüm içi alt başlıklarından türetildi, uydurulmadı.
- **Flashcard 1:1.** 190 soru ↔ 190 kart; kart önleri tanım/neden sorusu, arkaları en çok 2 cümle.

---

## 7) Sırada ne var

1. **Biyoloji + Coğrafya + Tarih** — aynı üç betik yöntemi (`kimya-t1/t2` + `tur2-guncelle` + `tur2-veri-esle`).
2. Sonra Din, Felsefe, TDE.
3. Son tur: ağaç/kayıt defteri/arşiv/kapılar/rapor + `main` ile birleştirme kararı (kullanıcıya).
