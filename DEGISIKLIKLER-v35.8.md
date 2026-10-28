# v35.8 — Değişiklik Raporu (2026-10-29)

Bu rapor kullanıcının **6 maddesini** tek tek ele alır: her madde için **ne yapıldı**,
**hangi dosya/satır**, ve **hangi testin bunu kanıtladığı** yazar. Yapılmayan ya da
eksik kalan bir şey varsa burada açıkça yazılıdır.

---

## 1) "Deneme kısmında yapamadığın sorular gereksiz, zaten konu takibinde var"

**Yapıldı — bölüm tamamen silindi.**

- `site/index.html` → `renderExams()` içindeki *Yapamadığın Sorular* bloğu (V.C.
  `izlenecekler` listesi, "Konuyu aç" düğmeleri, video bağlantıları) **tamamen kaldırıldı**.
  Denemelerim'de artık: deneme kartı → **Ders Detayları** tablosu, o kadar.
- `videoGit()` içindeki `[data-exam-soru]` araması kaldırıldı (o satırlar artık yok);
  derin bağlantı (**bildirim → #deneme=…&ders=…**) hâlâ çalışıyor, doğrudan **ders
  satırına** iniyor ve satırı vurguluyor.
- Bu değişiklik sırasında ortaya çıkan **gizli kopya** temizlendi: `index.html` içinde
  `renderTracking`, `konuGit`, `videoGit`, `examDetailSelect` fonksiyonlarının **ikinci
  birer kopyası** vardı. "Konu Takibi" bölümü elle düzenlenirken bu kopyalar `urgentLimit`
  değişkenini iki kez tanımlıyordu → **tüm o `<script>` bloğu sözdizimi hatasıyla
  düşerdi**. Sözdizimi nöbetçisi testi bunu yakaladı; 15.443 karakterlik ölü kopya silindi.
  Artık her fonksiyonun **tek** tanımı var (test bunu kontrol ediyor).

**Kanıt:** `tests/gorsel-video.test.js` → "Denemelerim'de 'Yapamadığın Sorular' bölümü
KALDIRILDI", `tests/konu-bulma.test.js` → "Denemelerim'deki 'Konuyu aç' satırı kaldırıldı"
+ "konuya gitme işlevi korundu". Ayrıca jsdom ile **gerçek sayfa çizdirildi**: Denemelerim
sayfası 11.539 bayt üretildi, bölüm yok, Ders Detayları var.

---

## 2) "Konu takibindeki öğrenme durumu ile hafıza gücünü birleştir"

**Yapıldı — artık TEK kart: “Öğrenme Durumu · Hafıza Gücü”.**

Eskiden aynı bilgi iki yerdeydi:
1. Konu Takibi → **Hafıza Gücü** kartı (tekrar barları),
2. Konu Takibi'nin altında **ayrı BKT paneli** ("Öğrenme Durumu", yeterlilik + hafıza).

Şimdi `site/index.html` → `renderTracking()` içinde **tek kart** (`id="bkt-birlesik-kart"`)
var. Her konu **tek satır**:

| Satırda ne var | Kaynak |
|---|---|
| Konu adı + **durum** (Veri yetersiz / Gelişiyor / Pekişiyor / ONAYLANDI) | `AnalizBKT.konuDurum()` |
| **Hafıza barı** (%, renk) | hafıza motoru |
| **Yeterlilik barı** (%, BKT) | `konuDurum().yeterlilik` |
| Tekrar aksiyonları (Tekrar Ettim / Erken Tekrar / ACİL TEKRAR / Sıfırla) | korundu |
| **Kısa Kontrol — 5 soru** düğmesi (o konunun havuzuyla) | korundu |
| "Hataların şurada yoğunlaşıyor", "Önce şunu sağlamlaştır" | korundu |
| Havuz eşlenmediyse **dürüst uyarı** | korundu |

- `site/bkt-engine.js`: yeni `konuDurum(key)` / `konuDurumlari()` API'si; ayrı panel
  (`renderBktPanel`) artık **birleşik kart varsa hiç çizilmiyor**, kalıntısı da siliniyor.
- Yalnız BKT kaydı olan (hafıza kaydı olmayan) konular da aynı kartta listeleniyor.
- KPI'lar: Tekrar Bekleyen · Ort. Hafıza · Kritik (<%20) · **Onaylı Konu**.

**Kanıt:** `tests/birlesik-kart.test.js` (yeni, 17 kontrol) kartı **gerçek kodla üretip**
inceliyor: tek kart, aynı konu iki kez basılmıyor, iki bar da var, aksiyonlar duruyor.
jsdom akış testinde ayrıca sayfada `bkt-learning-panel` **olmadığı** doğrulandı.

---

## 3) "Kısa tekrar sorusunda boş bırakamıyoruz"

**Yapıldı — boş bırakmak serbest.**

- `site/bkt-engine.js` → `cizMiniSoru()`: "İleri" düğmesi artık **kilitlenmiyor**;
  boşken açıklama çıkıyor: *"İstersen boş bırakıp geçebilirsin — sonuçta 'boş' olarak
  sayılır ve boş için ayrı neden sorulur."*
- `miniSonraki()`: cevapsız ilerleme engeli kaldırıldı (`""` = boş cevap).
- `finishMiniTest()`: "Bitirmeden önce X. soruyu işaretle" engeli kaldırıldı.
- `submitMiniTest()`: boş cevap **kabul**; boş sorular `bosIndexes` olarak ayrı döner,
  doğru sayılmaz, **boş nedeni** istenir.
- `updateMiniSubmitState()`: düğme hiç kilitlenmiyor.

**Kanıt:** `tests/kisa-kontrol.test.js` (57 kontrol) içinde **hiçbir şık seçmeden** 5 soru
geçiliyor, 1. soruya dönüldüğünde cevabın **boş kaldığı** doğrulanıyor. jsdom akış
testinde de 5 soru boş geçilip sonuç ekranına ulaşıldı.

---

## 4) "Hata nedenlerini ayır. Süre yetmedi seçeneğini kaldır. Yanlış/boşa göre hata nedeni olsun"

**Yapıldı — iki ayrı liste, "süre yetmedi" yok.**

`site/index.html`:

```
YANLIŞ → Konu eksiği · Anlamadım · Çözüm yolunu bulamadım · İşlem hatası/dikkatsizlik · Kodlama/kitapçık hatası
BOŞ    → Konu eksiği · Anlamadım · Çözüm yolunu bulamadım
```

- `SÜREYETMEDİ` **tüm listelerden ve ağırlık tablolarından çıkarıldı**
  (`WRONG_REASONS`, `EMPTY_REASONS`, `REASON_WEIGHTS`, `REASON_GROUP`,
  `bkt-engine.js` `WRONG_WEIGHT`, `app-pwa.js` `OKZ_NEDENLER` + hızlı neden çubuğu).
- Eski kayıtlarda kalmış "Süre yetmedi" değeri **okunur kalıyor** ama artık **puan
  düşürmüyor** (`SUREYETMEDI` ağırlığı yok → motor bu nedeni gözlem saymıyor).
- **Neden ayırma** Kısa Kontrol sonuç ekranında da uygulanıyor: yanlışta *"Neden yanlış
  yaptın?"* (5 seçenek), boşta *"Neden boş bıraktın?"* (3 seçenek).
- Bu değişikliğin yan etkileri de düzeltildi: "Süre Yetersizliği" hata grubu, Kitaplık'taki
  "Çözüm Süresi Önerisi" ve koç mesajı artık **çözüm yolu** üzerinden konuşuyor (uydurma
  "süren yetmiyor" yorumu kalmadı).
- Neden seçenekleri artık **kod değil Türkçe etiket** gösteriyor (`reasonLabel`).

**Kanıt:** `tests/kisa-kontrol.test.js` → "SÜREYETMEDİ hiçbir listede YOK", "boşta
işlem/kitapçık nedeni yok", "boş cevapla test GÖNDERİLEBİLİR", "boş + yanlış için ayrı
nedenlerle kayıt tamam". `tests/okz-yuk.test.js` → "'süre yetmedi' YOK". jsdom form
testinde **gerçek form çizdirildi**: yanlış satırında 5, boş satırında 3 seçenek.

---

## 5) "Sonuç kısmında sadece cevap yer alıyor; soruları da göstersin"

**Yapıldı — sonuç ekranı sorunun TAMAMINI gösteriyor.**

`site/bkt-engine.js` → yeni `miniSoruTam(q, cevap)`:

- soru **metni**,
- varsa **şekil** (`GV.html` — aynı SVG motoru),
- **tüm şıklar** A/B/C/D olarak; doğru şık yeşil **"✓ doğru cevap"**, öğrencinin
  işaretlediği şık kırmızı **"← senin cevabın"**,
- boş bırakıldıysa **"Bu soruyu boş bıraktın."**,
- altında **çözüm**.

Bu görünüm hem neden seçme ekranında (`showMiniResult`) hem de nihai sonuç ekranında
(`completeMiniTestView`) kullanılıyor. Denemelerim'deki soru çözüm penceresi
(`soruCozumDetay`) da kayıtta metin/şık/şekil varsa **soruyu gösteriyor** (Okulizyon
kaydında bu alanlar yoksa yalnız kazanım gösterilir — olmayan veri uydurulmuyor).

**Kanıt:** jsdom akış testi → "sonuç ekranı SORU METNİNİ gösteriyor", "sonuç ekranı
ŞIKLARI gösteriyor", "sonuç ekranı 'boş' etiketli", "sonuç ekranında doğru cevap işaretli",
"sonuç 1.5 sn sonra hâlâ açık".

---

## 6) "Trigonometri/üçgen ve sabit hız–ivme grafiği sorularının neredeyse hepsinde şekil olsun"

**Yapıldı — 6 havuzun 72 sorusunun 72'sinde şekil var (önce 8 idi).**

| Havuz | Konu | Görselli |
|---|---|---|
| `mat_10_u01_k01` | Dik üçgende trigonometrik oranlar | **12/12** (önce 5) |
| `mat_10_u01_k02` | Üçgende yardımcı elemanlar | **12/12** (önce 0) |
| `mat_10_u01_k03` | Üçgende alan | **12/12** (önce 0) |
| `mat_10_u01_k04` | Sinüs / kosinüs teoremleri | **12/12** (önce 0) |
| `fizik_10_u01_k01` | Sabit hızlı hareket | **12/12** (önce 1) |
| `fizik_10_u01_k02` | Bir boyutta sabit ivmeli hareket | **12/12** (önce 2) |

`site/gorsel.js` (görsel motoru) bu iş için genişletildi:

- **`geometri`** tipi: serbest üçgen/çokgen, kenar–açı–dik işaretleri, yardımcı çizgiler
  (açıortay, kenarortay, yükseklik, çevrel çember), çoklu şekil (`sekiller`), kesikli
  ikinci üçgen, açıklama satırı (otomatik satır bölme).
- **`cember`** tipi: birim çember, **yönlü** açı yayı (saat yönü / tersi), cos–sin
  etiketleri, izdüşümler.
- **`grafik`** tipi yenilendi: eksen adımları **okunur sayılarla** (0–10–20, 0–2,5–5),
  x ekseni **sıfır çizgisinde** (negatif hızlar doğru görünüyor), eksen, verinin bittiği
  yerde bitiyor, taralı alan (`alan:true` = yer değiştirme).
- **`vektor`** tipi: uzun etiket taşmıyor, y ekseni adı okla çakışmıyor.

`scripts/gorsel-ekle.js` (yeni betik): her soru için şekli **sorunun kendi sayılarıyla**
tanımlar (7–24 üçgeni ile 9–40 üçgeni aynı görünmesin diye kenar oranı ölçekleniyor).
`--kontrol` modu ve yazma modu var.

**Şekiller gerçekten görünüyor mu?** Bu kez **gözle de doğrulandı**: sandbox'a
`resvg` kuruldu, 72 SVG PNG'ye çevrilip **görsel olarak** incelendi; etiket çakışmaları,
çerçeve dışına taşan köşeler ve yanlış açı yayları tek tek düzeltildi (aşağıdaki liste).
(Önceki sürümde bu mümkün değildi ve yalnız kod düzeyinde denetim vardı.)

Görsel doğrulama sırasında bulunup düzeltilen gerçek hatalar:
- `cember`: `sweep-flag` ters → **saat yönündeki açı yayı ters yöne** çiziliyordu.
- `grafik`: y ekseni etiketleri 3,75 / 7,5 / 11,25 gibi okunmaz sayılar; negatif değerli
  grafikte x ekseni tabana yapışıyordu.
- `geometri`: uzun açıklama satırları çerçeveden taşıyordu; 285 yükseklik 2 satıra
  yetmiyordu (300'e çıkarıldı, notlar otomatik bölünüyor).
- Yardımcı nokta adları (G1, G2) köşe gibi basılıyordu.
- 9–40–41 üçgeni tek çizgi gibi görünüyordu (oran 1:3'e yumuşatıldı).

---

## Testler

`npm run -s test:hepsi` → **EXIT=0**, 23 paket, **0 başarısız**. Yeni test:
`tests/birlesik-kart.test.js` (17 kontrol) — `test:davranis` ve `test:kart` içinde.

Ayrıca (depoya girmeyen, oturumda koşulan) **jsdom uçtan uca testleri**:
8 sayfa çizildi (dashboard, exams, tracking, knowledge, library, planning, tasks,
questionbank) — hata yok; Kısa Kontrol akışı 5 soru boş geçilerek baştan sona koşuldu
(27/27); deneme formunda yanlış/boş neden listeleri ayrı ayrı okundu.

## Bilinen sınırlar (dürüstçe)

- Okulizyon'dan gelen kayıtlarda **soru metni/şıkları yok**; bu yüzden "sonuç ekranında
  soru" özelliği o kayıtlarda yalnız kazanımı gösterir. Yeni Kısa Kontrol sonuçlarında
  soru tam görünür.
- Kullanıcının cihazında görsel doğrulama (ekran görüntüsü) bu ortamda alınamıyor;
  doğrulama SVG'nin gerçek render'ı üzerinden yapıldı.

## Sürüm damgaları

- `site/app-pwa.js` → `PWA_SURUM = "v35.8-birlesik-kart-sekilli-sorular"`
- `site/sw.js` → `CACHE = "analiz-merkezi-v-20261029-v35-8-birlesik-kart-sekilli-sorular"`
