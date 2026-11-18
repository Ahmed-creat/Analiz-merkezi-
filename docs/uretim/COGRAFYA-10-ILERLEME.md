# Coğrafya 10 — ilerleme ve kanıt defteri

Tarih: 2026-11-17 · Dal: `arena/4cc1805b-analiz-merkezi`
Kural: her cümle ders kitabının kendi metnine ve sayfasına bağlıdır (NotebookLM kuralı).
Kaynak metin: `docs/uretim/.kitap-metin/cografya.json` (MEB Coğrafya 10, 2025; `s` = PDF sayfası, basılı sayfa = PDF − 1).
Metin OCR gürültülü olduğu için cümleler kitabın anlamına bağlı kalınarak yeniden yazıldı; ham metin kopyalanmadı.

---

## 0) Durum özeti

| Ölçü | Önce | Şimdi |
|---|---|---|
| 10. sınıf Coğrafya konusu (ağaç) | 18 (kitabın içindekileriyle uyumlu, 11'i havuzlu) | **18 — 18'i de havuzlu** |
| Coğrafya havuzu (canlı) | 11 `cogr_10_u*` (elle, v35.3) + 18 `cogr_10_t*` (2018 şeması) | **18 — 18'i de kitap kaynaklı** |
| Coğrafya sorusu | 135 (u*) + 190 (t*) = 325 | **191** |
| Kitap künyesi olmayan coğrafya havuzu | 18 (`kaynak_dosya` yok, `kaynak` elle yazılmış) | **0** |
| Kazanım künyesi "kesin" | 5 / 11 | **18 / 18** |
| Arşive taşınan coğrafya havuzu | 7 (v35.3 elle yazılan) | **25** (7 + 18 `eski-*`) |

**Coğrafya bitti.** Kalan dersler: Tarih → Din → Felsefe → TDE → son tur.

---

## 1) Havuzlar (18 havuz · 191 soru · hepsi kitaptan)

| Havuz | Kitap başlığı (içindekiler) | Sayfa | Soru |
|---|---|---|---|
| `cogr_10_u01_k01` | 1.1 Coğrafi Bakış | s.15-24 | 10 |
| `cogr_10_u02_k01` | 2.1 CBS ve Uzaktan Algılamanın Uygulama Alanları | s.31-36 | 10 |
| `cogr_10_u02_k02` | 2.2 Mekânsal Verilerin Haritalara Aktarılması | s.37-40 | 10 |
| `cogr_10_u03_k01` | 3.1 Tektonik Süreçler | s.49-69 | 12 |
| `cogr_10_u03_k02` | 3.2 İklim ve Kayaç Yapısının Aşınma ve Çözünme Süreçlerine Etkisi | s.70-75 | 10 |
| `cogr_10_u03_k03` | 3.3 Aşınma, Taşınma ve Biriktirme Süreçlerinin Yeryüzünün Şekillenmesine Etkisi | s.76-96 | 12 |
| `cogr_10_u03_k04` | 3.4 Yeryüzü Şekilleri ile İlgili Gözlem ve Saha Çalışması | s.97-98 | 10 |
| `cogr_10_u03_k05` | 3.5 Yeryüzü Şekilleri ile Beşerî Faaliyetler Arasındaki Etkileşim | s.99-107 | 10 |
| `cogr_10_u04_k01` | 4.1 Yerleşmelerin Kuruluşu ve Gelişimi | s.121-129 | 13 |
| `cogr_10_u04_k02` | 4.2 Yerleşmelerin Fonksiyonları | s.130-135 | 11 |
| `cogr_10_u05_k01` | 5.1 Ekonomik Faaliyetlerin Özellikleri | s.145-152 | 11 |
| `cogr_10_u05_k02` | 5.2 Ekonomik Sektörler ve Gelişmişlik | s.153-156 | 10 |
| `cogr_10_u05_k03` | 5.3 Türkiye Ekonomisinin Sektörel Dağılımı | s.157-159 | 10 |
| `cogr_10_u06_k01` | 6.1 Afetlerle Mücadelede İyi Uygulama Örnekleri | s.171-179 | 10 |
| `cogr_10_u06_k02` | 6.2 Afetlere Karşı Dirençli Yaşam Alanları | s.180-184 | 10 |
| `cogr_10_u06_k03` | 6.3 Afetlerden Korunma | s.185-189 | 10 |
| `cogr_10_u06_k04` | 6.4 Afet Bilinci | s.190-192 | 10 |
| `cogr_10_u07_k01` | 7.1 Türk Kültürünün Mekânsal Özellikleri | s.203-221 | 12 |

Kural (plan §5): hedef soru = `max(10, 2 × süreç)`. 10 sayfa ve üzeri bölümler 12-13 soruyla yazıldı
(3.1 → 12, 3.3 → 12, 4.1 → 13, 4.2 → 11, 5.1 → 11, 7.1 → 12); tek soru kırpılmadı.

Üretici betikler (hepsi `yazKonu()`, her beceriye ≥ 5 soru, 1:1 flashcard):

```
docs/uretim/uretim/cografya-t1.js            → 1.1, 2.1, 2.2            (u01_k01, u02_k01, u02_k02)
docs/uretim/uretim/cografya-t2.js            → 3.1, 3.2                 (u03_k01, u03_k02)
docs/uretim/uretim/cografya-t3.js            → 3.3, 3.4, 3.5            (u03_k03…k05)
docs/uretim/uretim/cografya-t4.js            → 4.1, 4.2                 (u04_k01, u04_k02)
docs/uretim/uretim/cografya-t5.js            → 5.1, 5.2, 5.3            (u05_k01…k03)
docs/uretim/uretim/cografya-t6.js            → 6.1, 6.2, 6.3, 6.4       (u06_k01…k04)
docs/uretim/uretim/cografya-t7.js            → 7.1                      (u07_k01)
docs/uretim/uretim/cografya-tur2-guncelle.js → ağaç, kayıt defteri, grafik, PWA, sw.js
docs/uretim/uretim/cografya-tur2-veri-esle.js → kazanım/konu indeksleri, anahtar sözcükler
```

Arşive giden dosyalar (`arsiv/soru_havuzlari/cografya/`):

- `eski-cogr_10_t01_c01.json` … `eski-cogr_10_t07_c01.json` — 18 dosya / 190 soru (2018 şeması, kitap künyesi yok)
- `cogr_10_u04_k02.json`, `cogr_10_u05_k02.json`, `cogr_10_u05_k03.json`, `cogr_10_u06_k02.json`,
  `cogr_10_u06_k03.json`, `cogr_10_u06_k04.json`, `cogr_10_u07_k01.json` — v35.3 elle yazılan 7 havuz
  (2026-11-17'de `733a896` ile taşınmıştı). Yerlerine kitaptan yazılan havuzlar aynı `konu_id` ile döndü;
  arşiv kopyaları `eski-*` adıyla ayrıca saklanmadı, çünkü içerikleri yeni havuzlarla değiştirildi.

Yeni havuzlar arşivdeki `t*` dosyalarıyla aynı `konu_id` taşımadığı için dosya adı çakışması olmadı;
yine de plan §9 gereği hiçbir dosya silinmedi (`arsiv/README.md` tablosuna işlendi).

---

## 2) Ağaç (18 konu — kitabın içindekiler düzeyi)

```
1. Ünite: Coğrafya ve Mekân
  1.1  Coğrafi Bakış                                                   s.15
2. Ünite: Mekânsal Bilgi Teknolojileri
  2.1  CBS ve Uzaktan Algılamanın Uygulama Alanları                    s.31
  2.2  Mekânsal Verilerin Haritalara Aktarılması                       s.37
3. Ünite: Yeryüzünün Şekillenmesi
  3.1  Tektonik Süreçler                                               s.49
  3.2  İklim ve Kayaç Yapısının Aşınma ve Çözünme Süreçlerine Etkisi   s.70
  3.3  Aşınma, Taşınma ve Biriktirme Süreçlerinin Yeryüzünün Şekillenmesine Etkisi  s.76
  3.4  Yeryüzü Şekilleri ile İlgili Gözlem ve Saha Çalışması           s.97
  3.5  Yeryüzü Şekilleri ile Beşerî Faaliyetler Arasındaki Etkileşim   s.99
4. Ünite: Yerleşmeler
  4.1  Yerleşmelerin Kuruluşu ve Gelişimi                              s.121
  4.2  Yerleşmelerin Fonksiyonları                                     s.130
5. Ünite: Ekonomik Faaliyetler
  5.1  Ekonomik Faaliyetlerin Özellikleri                              s.145
  5.2  Ekonomik Sektörler ve Gelişmişlik                               s.153
  5.3  Türkiye Ekonomisinin Sektörel Dağılımı                           s.157
6. Ünite: Afetler ve Sürdürülebilir Çevre
  6.1  Afetlerle Mücadelede İyi Uygulama Örnekleri                     s.171
  6.2  Afetlere Karşı Dirençli Yaşam Alanları                          s.180
  6.3  Afetlerden Korunma                                              s.185
  6.4  Afet Bilinci                                                    s.190
7. Ünite: Bölgeler, Ülkeler ve Küresel Bağlantılar
  7.1  Türk Kültürünün Mekânsal Özellikleri                            s.203
```

`konular.js` iki kopyada da (`konular.js`, `pwa-files/functions/konular.js`) yalnız `"10": {` sonrasındaki
Coğrafya bloğu 18 satırla eşleşiyor; 9. sınıf bloğu ve diğer dersler dokunulmadı.

**Kazanım eşlemesi 18/18 kesin, 1:1** (`cogr_10_u01_k01` → `COĞ.10.1.1` … `cogr_10_u07_k01` → `COĞ.10.7.1`).
`kazanim_konu_10.json` kayıtları `yontem: "kitap-bolumu"`, her kayıtta kitap sayfası gerekçesi var.

---

## 3) Soruların dayandığı kitap sayfaları (örnek künyeler)

| Havuz | Kitaptaki kanıt | Soruya nasıl girdi |
|---|---|---|
| `u01_k01` | s.15-24 coğrafyanın konusu, bölümleri, ilkeleri; Marmara Gölü örneği | coğrafi bakış bileşeni; ölçek yorumu |
| `u02_k01` | s.31-36 CBS uygulamaları, AYDES, uzaktan algılama | AYDES bileşeni; afet yönetiminde CBS |
| `u02_k02` | s.37-40 vektör veri, katman, altlık harita | nokta/çizgi/alan sembolü; veri türü ayrımı |
| `u03_k01` | s.49-69 levha hareketleri, orojenez, epirojenez, fay, volkanizma, Türkiye'nin tektonik yapısı | fay hattı; jeotermal alan; deprem |
| `u03_k02` | s.70-75 fiziksel/kimyasal ayrışma, iklim-kayaç ilişkisi, karstlaşma | kireç taşı; sıcaklık-nem etkisi |
| `u03_k03` | s.76-96 akarsu, rüzgâr, buzul, karst, dalga şekilleri | vadi, delta, barkan, moren, dolin |
| `u03_k04` | s.97-98 saha çalışması aşamaları, ürün dosyası | hazırlık adımı; gözlem kaydı |
| `u03_k05` | s.99-107 yer şekillerinin yerleşme, nüfus, ulaşım, ekonomiye etkisi | vadi boyu yerleşme; tünel/köprü |
| `u04_k01` | s.121-129 yerleşmenin kuruluşu, kır/kasaba/şehir ölçütleri, Türkiye'de dağılış | nüfus eşikleri; Salda Gölü |
| `u04_k02` | s.130-135 yerleşme fonksiyonları, idari yapı, Adana-Eskişehir | fonksiyon sınıflandırma; il/köy yönetimi |
| `u05_k01` | s.145-152 beş sektör, dördüncül-beşincil, sektörel dönüşüm | sektör kapsamı; İzmir İktisat Kongresi |
| `u05_k02` | s.153-156 İtalya/Zambiya/Kanada/Çad sektörel payları | %3,8/26,9/69,3; GSYİH yorumu |
| `u05_k03` | s.157-159 Türkiye'de 1990→2018→2024 sektörel değişim (TÜİK) | %46,8 → %54,9 hizmet; 1980 ihracat modeli |
| `u06_k01` | s.171-179 Katie, Rio Grande do Sul, Petropolis, Tōhoku, Muğla, Gaziantep CBS | afet türü-direnç; iyi uygulama |
| `u06_k02` | s.180-184 direnç, 6 direnç özelliği, OECD Dirençli Şehirler, tsunami | sağlamlık/yedeklilik; Sisam 2020 |
| `u06_k03` | s.185-189 afet yönetimi döngüsü, fiziksel-yapısal önlemler, yapısal olmayan risk | dere ıslahı; eşya sabitleme |
| `u06_k04` | s.190-192 afet bilinci, UNISDR hazırlık tanımı, eğitim/çanta/tatbikat | bilinç-zarar ilişkisi |
| `u07_k01` | s.203-221 TÜRKSOY, kültür ocağı, arkeolojik kültürler, göçler, Türk-İslam kültürü, dil, gelenekler, miras | Anav; Kavimler Göçü; 2024 ortak alfabe; Dede Korkut |

---

## 4) Bu turda düzeltilen hatalar (kanıt)

1. **Kazanım = havuz kayması.** Eski canlı dosyalarda `u04_k01` "Ekonomik Faaliyetler", `u05_k01` "Doğal Afetler",
   `u06_k01` "Türk Kültürü" konusunu taşıyordu; kazanım künyesi 5/11 kesindi, `u04_k02`, `u05_k02`, `u05_k03`,
   `u06_k02`-`u06_k04`, `u07_k01` hiç kayıtlı değildi. Havuz kimlikleri kitabın sırasına göre yeniden yazıldı,
   eşleme **18/18 kesin** oldu.
2. **`konu_esleme.json` bayat kayıt.** 11 coğrafya kaydı eski başlıklarla duruyordu; 18 kayıt canlı havuzlardan
   yeniden üretildi (`metin` alanı kısaltılmadı: başlık + 2 beceri cümlesi). Havuz sayısı 169 → **176**.
3. **`kazanim_konu_10.json` eksik konu.** Coğrafya için yalnız 11 konu kaydı vardı ve `u06_k01` dört çıktıyı
   (6.1-6.4) tek kayıtta birleştiriyordu; 18 kayda çıkarıldı, her kayıt tam bir MEB çıktısı taşıyor.
4. **`okz-meb.js` METIN.** 17 kayıt 11 konuya dağılmıştı (4.1 iki, 5.1 üç, 6.1 dört kazanım taşıyordu);
   18 kayda indirildi, `norm` alanı `sadeKok()` (son kelimeden ek atma) ile üretildi.
5. **`konu-anahtar.js`.** 4 eski coğrafya kuralı (1.1, 2.1, 2.2, 3.1) yerine 18 kural yazıldı, sıra
   "özel → genel" (7.1 → 1.1). Kural sayısı 89 → **103**; test sınırı (20 … 130) korunuyor.
6. **`bkt-engine.js` EK_ESLEME.** 6.2 ve 6.3 konuları, havuzları olmadığı için 6.1 havuzuna yönlendiriliyordu.
   Her iki konunun kendi havuzu artık olduğundan bu iki satır kaldırıldı (birebir `topic_key` eşleşmesi yeterli).
7. **`Karşİ` yazım hatası.** `konular.js`, `pwa-files/functions/konular.js`, `konu-basligi-esle.js`,
   `bkt-engine.js` ve iki rapor dosyasında "6.2 Afetlere Karşİ …" → "Karşı" düzeltildi.
8. **`havuz-denetle` bulguları kaynak metinde kapatıldı** (`cografya-t*.js`; JSON elle düzenlenmedi).
   Tekrarlayan üç bulgu: (a) doğru şıkkın uzunlukla ele vermesi, (b) kart önünün soruya çok benzemesi
   (%35-49), (c) kart önünün tanım kalıbı dışında kalması ("… kimdir?"). İlk yazımda 18 havuzun 6'sında
   en az bir bulgu vardı; her düzeltme üreticide yapılıp havuz yeniden üretildi.
   **18/18 havuz ✅ (0 hata, 0 uyarı)**
9. **Grafik ve PWA.** `iliski_grafi.json` üç kopyada eski coğrafya düğümlerini (`u02_k03`, `u02_k04` — kitapta
   karşılığı yok) taşıyordu; düğümler atıldı, coğrafya kenarları temizlenip **17 sert ön koşul** kuruldu.
   `sw.js` (kök + `site/`) önbellek listesi 18 havuzun tamamını taşıyor, `CACHE` damgası
   `analiz-merkezi-v-20261031-v69-cogr10-tur2` (uygulama `PWA_SURUM` ile aynı).

---

## 5) Kapılar — bu turun çalıştırılmış çıktıları

```
$ node docs/uretim/uretim/cografya-t1.js … cografya-t7.js
cogr_10_u01_k01 … u07_k01 → 18 havuz = 191 soru, 191 flashcard, 36 beceri

$ node docs/uretim/araclar/havuz-denetle.js site/content/soru_havuzlari/cogr_10_u*.json
== ÖZET ==  dosya: 18 · hata: 0 · uyarı: 0

$ node scripts/havuz-index-uret.js
havuz: 224 · soru: 2384 · flashcard: 2384      (önce 235 / 2518 / 2518)
  ↑ 18 eski coğrafya havuzu (190 soru) arşive çıktı, kitaptan yazılanlar (191 soru) indekse girdi.

$ npm run -s test:hepsi
Okulizyon konu eşleme testleri — 91/91 geçti ✓
Konu eşleme entegrasyon testi — 45/45 geçti ✓
Konu bulma / kısa kontrol / video — 76/76 geçti ✓
Şekil tutarlılık testi — 388/388 geçti ✓
TYMM ÇAPRAZ DOĞRULAMA: 66/66 geçti ✅
SORU ÜRETİM PLANI: 67/67 geçti ✅
TÜM TESTLER GEÇTİ (86/86)

$ node docs/uretim/araclar/kaynak-denetle.js | grep cogr
(çıktı yok — 18/18 coğrafya havuzu kitap kaynaklı)

$ npm run -s validate:pools | grep cogr
cogr_10_u01_k01.json … cogr_10_u07_k01.json: geçerli

$ npm run -s validate:ids
(çıktıda cogr_10 satırı yok — defter/grafik çakışması kapandı)

$ node docs/uretim/uretim/cografya-tur2-veri-esle.js
✔ konu_esleme.json: 18 coğrafya havuzu · toplam 176
✔ kazanim_konu_10.json: 18 coğrafya konusu · 18 metin kaydı · konu toplam 176
✔ okz-meb.js: METIN 18 coğrafya kaydı · konu-anahtar.js: 18 coğrafya kuralı

$ node docs/uretim/uretim/cografya-tur2-guncelle.js
= zaten güncel: konular.js / pwa-files/functions/konular.js (18 konu)
✔ konu_kayit_defteri.json (iki kopya): 18 coğrafya kaydı
✔ iliski_grafi.json (üç kopya): 18 coğrafya düğümü · 17 sert ön koşul
✔ PWA kopyası: 18 havuz · sw.js + site/sw.js: 18/18 önbellek satırı
```

---

## 6) Bilinçli kararlar

- **Görsel yok (18/18 havuz metin tabanlı).** Kural: soru kökü bir şekle/grafiğe/tabloya gönderme yapıyorsa
  `gorsel` zorunludur. Kitaptaki görsel etiketleme alıştırmaları (kıyı tipi, vadi tipi eşleştirme) metne
  çevrilemediği için bu soru tipleri havuza alınmadı; bunun yerine aynı kavramlar düz metinden soruluyor.
- **Beceri dağılımı.** Her havuzda 2 beceri, beceri başına 5-7 soru (kapı: ≥ 2). Beceriler kitabın bölüm içi
  alt başlıklarından türetildi, uydurulmadı.
- **Flashcard 1:1.** 191 soru ↔ 191 kart; kart önleri "X nedir?" kalıbında, arkaları en çok 2 cümle.
- **Süreç sayısı.** Kitabın 3.1 ve 3.3 bölümleri 20-21 sayfa ve ikişer alt başlık taşıdığı için 12 soru;
  4.1 (9 sayfa) 13, 4.2 (6 sayfa) 11, 5.1 (8 sayfa) 11, 7.1 (19 sayfa) 12 soru. 10'a indirmek için nitelikli
  soru silmek gerekiyordu; havuzlar `max(10, 2 × süreç)` kuralına uygun tutuldu.
- **Sosyal medya / güncel olay atıfları.** Sayısal veriler (Katie 200-210 km/sa, Petropolis 223 ölü,
  Muğla 9.052 ha, Gaziantep ~30.000 olay, sektör yüzdeleri) yalnız kitabın verdiği biçimde kullanıldı.

---

## 7) Sırada ne var

1. **Tarih → Din → Felsefe → TDE** — aynı iki betik yöntemi (`<ders>-t*.js` + `tur2-guncelle` + `tur2-veri-esle`).
2. Son tur: ağaç/kayıt defteri/arşiv/kapılar/rapor + `main` ile birleştirme kararı (kullanıcıya).

**Pano (`DURUM.md`) düzeltildi.** `docs/uretim/araclar/durum.js` havuzları hâlâ plan şemasındaki eski
dosya adlarıyla (`cogr_10_t06_c02.json`) arıyordu; ders kitabından yazılan havuzlar `uNN_kNN` adına geçtiği
için pano Matematik/Fizik/Kimya/Biyoloji/Coğrafya satırlarını 0 gösteriyordu. Araç artık sırayla plan adını,
sonra `kazanim_konu_10.json` üzerinden kazanım kodu → canlı havuz dosyasını çözüyor ve soru/kart toplamını
dosya bazında tekilleştiriyor (aynı havuz birden çok plan kaydını karşılayabiliyor). Pano yeniden üretildi:
224 canlı havuzun 18'i Coğrafya, toplam **1673/1788** soru · kart 1:1.

Pano bu düzeltmeyle bir de şunu görünür kıldı (bilinçli karar, kapatılmadı): plan hedefi
`max(10, 2 × süreç)` olduğu için bazı konularda hedef 12-16'ya çıkıyor; Coğrafya'da dört havuz plan hedefinin
2-4 soru altında (`u02_k02` 10/14, `u03_k04` 10/12, `u05_k03` 10/12, `u06_k03` 10/12). Bu havuzlara sayı
tutturmak için dolgu soru eklenmedi; kitap bölümü kısa olduğu için nitelikli soru sayısı 10'da kaldı.

