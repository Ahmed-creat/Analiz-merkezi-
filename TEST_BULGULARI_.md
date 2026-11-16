# Test Bulguları — Analiz Merkezi — 2026-10-12

## Kapsam ve yöntem

- İncelenen çalışma dalı: `arena/01a0dc3f-analiz-merkezi`.
- İnceleme, Google Drive üzerinden verilen **Analiz Merkezi / Bilge — KAPSAMLI TEST VE DOĞRULAMA ŞARTNAMESİ** ile depodaki R1 raporuna göre yapıldı.
- Bu turda uygulama kodu, veri dosyaları ve ZIP içerikleri değiştirilmedi. Yalnızca geçici `/tmp` test betikleri ve geçici bir bozuk havuz dosyası kullanıldı; geçici dosya testten sonra silindi.
- R1 içerik olarak depoda mevcut: `Analiz_Merkezi_BKT_Dogrulama_Iliski_Grafi_Ajan_Raporu (1).md`. Dosya adı, şartnamedeki referans adına `(1)` eklenmiş biçimdedir.
- R2 (orijinal sistem dokümanı) ve R3 (UI/UX tema dokümanı) ayrı referans dosyaları olarak depoda bulunamadı. R2/R3'e özel ve test şartnamesinde ayrıca sayısal karşılığı verilmeyen kontroller `MISSING_DOC` olarak işaretlendi.
- Rapor, şartnamenin istediği gibi sapmayı ve kanıtı bildirir; çözüm kodu veya mimari öneri içermez.

## Özet

| Grup | Karar | K1 | K2 | K3 | SPEC_GAP | MANUAL |
|---|---|---:|---:|---:|---:|---:|
| A — Depo/yapı | PARTIAL | 0 | 1 | 1 | 1 | 0 |
| B — Deneme/sayısal | FAIL | 0 | 3 | 1 | 0 | 0 |
| C — Taksonomi | FAIL | 2 | 0 | 0 | 0 | 0 |
| D — BKT | FAIL | 1 | 2 | 0 | 0 | 0 |
| E — Mini test | FAIL | 1 | 9 | 1 | 0 | 0 |
| F — Flashcard/hafıza | FAIL | 0 | 5 | 0 | 0 | 1 |
| G — İlişki grafı | FAIL | 1 | 5 | 0 | 0 | 0 |
| H — Havuz içeriği | FAIL | 3 | 0 | 0 | 0 | 4 |
| I — Mevcut motorlar | FAIL | 0 | 4 | 0 | 0 | 0 |
| J — UI/UX | FAIL | 3 | 5 | 3 | 0 | 0 |
| K — Kalıcılık/PWA | FAIL | 1 | 2 | 0 | 0 | 0 |
| **TOPLAM** | **FAIL** | **12** | **36** | **6** | **1** | **5** |

## Çalıştırılan mevcut testler

| Komut | Sonuç |
|---|---|
| `npm run test:bkt` | PASS — mevcut BKT smoke testleri |
| `npm run test:curriculum` | PASS — 10. sınıf TDE/Felsefe kontrolleri |
| `npm run test:pools` | PASS — 152 havuz / 1.756 soru |
| `npm run validate:pools` | PASS — mevcut canonical havuz dosyaları |
| `node --check bkt-engine.js` | PASS |
| `node --check pwa-files/bkt-engine.js` | PASS |

Bu mevcut testlerin PASS olması, aşağıdaki kapsamlı şartname testlerinin tamamının PASS olduğu anlamına gelmez; mevcut testler özellikle mini test zamanlaması, rotasyon, UI izolasyonu, flashcard düğmeleri ve grafik kenar devre dışı bırakma davranışlarını kapsamamaktadır.

## Bulgular

### Grup A — Depo, yapı dokümanları, altyapı

| ID | Sonuç | Önem | Kanıt | Açıklama |
|---|---|---|---|---|
| A1 | `FAIL` | K2 | `README.md` yok; `README-PWA.md:108-119` içinde ilgili bölüm var | Şartname `README.md` ister. Bölüm yalnızca `README-PWA.md` içinde mevcut. |
| A2 | `PASS` | — | `content/iliski_grafi.json`; JSON parse başarılı | Graf dosyası mevcut ve geçerli JSON. |
| A3 | `PASS` | — | `content/soru_havuzlari/`; 152 konu JSON dosyası + `index.json` | Geçerli havuz dosyaları mevcut. |
| A4 | `PASS` | — | `package.json:16`; `scripts/validate-pools.js:17-38` | Script tanımlı; geçerli havuzları geçiriyor. Geçici `__spec_bad__.json` ile çalıştırmada exit code `1` ve `en az 10 soru gerekli` çıktısı alındı. |
| A5 | `PASS` | — | `analiz-merkezi-pwa (3).zip` içindeki `analiz-merkezi-pwa/manifest.json` | `name`, `icons`, `display: standalone` mevcut. Manifest ZIP içinde bulunuyor; kaynak kökte ayrı HTML/manifest seti yok. |
| A6 | `PASS` | — | ZIP içindeki `firebase-messaging-sw.js`; `app-pwa.js:18-20,49-67` | FCM dosyası mevcut. Konfigürasyon eksikken `fbReady()` akışı Firebase'i devre dışı bırakıyor; çekirdek uygulama kodu ayrı çalışıyor. |
| A7 | `PARTIAL` | K3 | `Analiz_Merkezi_BKT_Dogrulama_Iliski_Grafi_Ajan_Raporu (1).md` | R1 içerik olarak mevcut, ancak referans dosya adı birebir değil ve `docs/` altında değil. |
| A8 | `SPEC_GAP` | K2 bağlamı | R2/R3 ve tam ürün envanteri depoda yok | Şartnamede karşılığı olmayan dosyayı kesin olarak ayıracak referans listesi bulunmadığı için PASS/FAIL verilmedi. |

### Grup B — Deneme girişi ve sayısal doğrulama

| ID | Sonuç | Önem | Kanıt | Açıklama |
|---|---|---|---|---|
| B1 | `PASS` | — | ZIP `index.html:3195-3203` | Ders üst sınırları ve toplam `120` kontrolü kayıt öncesi reddediyor. |
| B2 | `PASS` | — | ZIP `index.html:3045-3049` | Ders bazında `max - doğru - yanlış` boş değeri otomatik hesaplanıyor. |
| B3 | `PASS` | — | ZIP `index.html:1406` | `netOf(d,w) = d - w / 4`; 80/20 sonucu 75.0. |
| B4 | `FAIL` | K2 | ZIP `index.html:3034-3043` | Negatif ve üst sınır aşımı kırpılıyor; ancak ondalık değer reddedilmiyor veya tam sayıya yuvarlanmıyor. |
| B5 | `PARTIAL` | K3 | ZIP `index.html` sayı input taraması | Deneme/soru alanları numeric; `plan-net` ve `plan-hours` alanları `inputmode="decimal"`, şartname tüm sayı alanları için numeric bekliyor. |
| B6 | `PASS` | — | ZIP `index.html:3055-3061` | Enter sonrası sonraki alana odaklanma mevcut. |
| B7 | `FAIL` | K2 | ZIP `index.html:3186-3203` | `exam-date` okunuyor ancak gelecek tarih için kayıt öncesi engelleme/uyarı yok. |
| B8 | `PARTIAL` | K2 | ZIP `index.html:3186-3225`; `bkt-engine.js:206-214` | Düzenleme akışı yok. Mevcut ID tabanlı işleme bayrakları aynı kaydı tekrar BKT'ye almamaya çalışıyor; düzenleme senaryosu ayrıca doğrulanamıyor. |

### Grup C — Hata/boş taksonomisi

| ID | Sonuç | Önem | Kanıt | Açıklama |
|---|---|---|---|---|
| C1 | `PASS` | — | ZIP `index.html:1255` | Yanlış listesi dört beklenen değeri içeriyor. |
| C2 | `FAIL` | K1 | ZIP `index.html:1256`; `bkt-engine.js:15-20` | Şartname C2'deki ham değerler `KONUEKSİKLİĞİ`, `SÜREYETMEDİ`, `ÇÖZÜMYOLUNUBULAMADIM`; UI/depolama tarafında boş değerler boşluklu yazılıyor (`KONU EKSİKLİĞİ`, `SÜRE YETMEDİ`, `ÇÖZÜM YOLUNU BULAMADIM`). |
| C3 | `FAIL` | K1 | ZIP içindeki `index.html:1840-1865` | Yasak eski kodlar kullanıcıya giden derlenmiş PWA kaynağında `KAE`, `İH`, `SKYA`, `KH` olarak hâlâ bulunuyor. |
| C4 | `PASS` | — | ZIP `index.html:3171-3183,4274-4291` | Seçilen nedenler doğrudan `type` alanı olarak loglara yazılıyor; ayrı kod→string dönüşüm tablosu kullanılmıyor. |
| C5 | `PASS` | — | ZIP `index.html:3205-3214,4285-4289` | Her yanlış/boş için konu+neden satırı tamamlanmadan kayıt reddediliyor. |

### Grup D — BKT motoru

| ID | Sonuç | Önem | Kanıt | Açıklama |
|---|---|---|---|---|
| D1 | `PASS` | — | `bkt-engine.js:10-27` | P_L0, P_G, P_S ve kaynak P_T değerleri şartnameyle eşleşiyor. |
| D2 | `FAIL` | K1 | `bkt-engine.js:10-11,584-587` | `P_G + P_S < 1` açılış doğrulaması yok; motor yalnızca sabitleri kullanarak çalışıyor. |
| D3 | `PASS` | — | `bkt-engine.js:88-106` | Standart doğru/yanlış BKT formülleri ve P_T güncellemesi mevcut. |
| D4 | `PASS` | — | Uygulamanın `observe()` fonksiyonuyla çalıştırılan vektör | `0.396341`, `0.732432`, `0.917085`; beklenen değerlerle ±0.001 içinde. |
| D5 | `PASS` | — | Uygulamanın `observe()` fonksiyonuyla çalıştırılan vektör | Gerçek: `0.616121`, `0.766603`, `0.856892`; beklenen: `0.616106`, `0.766593`, `0.856885`. |
| D6 | `PASS` | — | Uygulamanın `observe()` fonksiyonuyla çalıştırılan vektör | `0.250000`. |
| D7 | `PASS` | — | `bkt-engine.js:129`; uygulama vektörü | Üst clamp sonucu `0.99`. |
| D8 | `PASS` | — | `bkt-engine.js:13-21,117-120` | Ağırlık tablosu eşleşiyor; null ağırlıklı nedenler güncelleme ve sayaç artışı yapmıyor. |
| D9 | `PASS` | — | `bkt-engine.js:103-108,476-492` | Kaynak enum'u kapalı; flashcard değerlendirmesi `observe()` çağırmıyor. |
| D10 | `PASS` | — | `bkt-engine.js:10,88-106` | Parametreler `Object.freeze` ile sabit ve öğrenci eylemiyle mutasyona uğramıyor. |
| D11 | `PASS` | — | `bkt-engine.js:282-293` | Kredi anahtarı `kaynak->hedef` olarak latch listesine yazılıyor. |
| D12 | `PASS` | — | `bkt-engine.js:532-538` | `gozlem_sayisi < 5` iken yüzde yerine beklenen kullanıcı metni render ediliyor. |
| D13 | `PASS` | — | `bkt-engine.js:198-214` | Kronolojik migrasyon, `bkt_migration_done` ve işlenmiş kayıt ID'leri mevcut. |
| D14 | `PARTIAL` | K2 | `bkt-engine.js:118-130,441-449` | Temel durumlar mevcut; ancak her negatif gözlemde otomatik `RISKLI` düşüşü ve test başarısızlığında genel geçiş kullanılıyor. §3.5'teki test zamanlaması/kuyruk koşulları yok. |
| D15 | `PARTIAL` | K2 | `bkt-engine.js:173-195` | 2+ bilgi hatasıyla `RISKLI` atanıyor; ancak yeniden test kuyruğuna tarihli dönüş davranışı ayrıca yok. |
| D16 | `PASS` | — | `bkt-engine.js:317-324,476-492` | Hafıza <%20 veya aynı gün içinde ardışık iki Bilemedi yumuşak düşüşü var; aynı gün ikinci düşüş engelleniyor. |

### Grup E — Mini testler ve doğrulama

| ID | Sonuç | Önem | Kanıt | Açıklama |
|---|---|---|---|---|
| E1 | `FAIL` | K2 | `bkt-engine.js:379-407` | Gün 0 için 3 soruluk `Kısa Kontrol`, 4. adım bitişi ve ≤1 doğru önerisi yok. |
| E2 | `FAIL` | K2 | `bkt-engine.js:379-407,521-542` | Gün 3 görev kuyruğu/ilk açılış planlaması yok; yalnızca paneldeki butonla 5 soru açılıyor. |
| E3 | `PARTIAL` | K2 | `bkt-engine.js:407-414` | Tüm sorular işaretlenmeden sonuç reddediliyor; ancak Bitir düğmesi disabled değil. |
| E4 | `PASS` | — | `bkt-engine.js:385-392` | Mini test modalında zamanlayıcı/süre göstergesi yok. |
| E5 | `FAIL` | K2 | `bkt-engine.js:385-414` | Test sırasında doğru cevap gösterilmiyor; fakat bitişte toplu çözüm gösterimi yok ve neden seçimi sonuçtan sonra açılmıyor. |
| E6 | `FAIL` | K2 | `bkt-engine.js:343-376` | `soru_havuzu_gosterim_logu` ve 28 günlük en eski gösterim rotasyonu yok; her açılışta `slice(0,5)` kullanılıyor. |
| E7 | `FAIL` | K2 | `bkt-engine.js:441-449` | Başarısız testte `ONARIM` atanıyor; fakat iki gün sonrası kuyruğu ve aynı gün açılma kilidi yok. |
| E8 | `FAIL` | K2 | `bkt-engine.js:416-449` | Havuzsuz konu için şartnamedeki bozulmuş-mod onay koşulu ve son deneme ≥%60 ek koşulu uygulanmıyor. |
| E9 | `FAIL` | K2 | `bkt-engine.js:379-407,521-550` | Günlük mini test/kart tavanı ve yaklaşık 15 dakika kuyruk kesme mantığı yok. |
| E10 | `FAIL` | K1 | `bkt-engine.js:343-376` | `soru_havuzu_gosterim_logu` veya eşdeğer kalıcı öğe gösterim kaydı oluşturulmuyor. |
| E11 | `FAIL` | K2 | `bkt-engine.js:389,407-434` | Mini test neden listesinde tüm boş nedenleri yok; nedenler sonuçtan sonra topluca istenmiyor. |
| E12 | `PARTIAL` | K3 | `bkt-engine.js:346-351,541-542,584` | Manifest sonradan yüklenince eşleşen konuya buton eklenebiliyor; ancak tarihli otomatik görev/kuyruk geçişi yok. |

### Grup F — Flashcard ve hafıza

| ID | Sonuç | Önem | Kanıt | Açıklama |
|---|---|---|---|---|
| F1 | `FAIL` | K2 | `bkt-engine.js:546-550` | UI yalnızca `Bildi` ve `Bilemedi` düğmelerini render ediyor; `Zorlandım` yok. Düğmeler `.btn-sm` ve 48×48 garantisi yok. |
| F2 | `FAIL` | K2 | `bkt-engine.js:476-492` | Kart değerlendirmesinde S değişkeni, 1.6/1.2 çarpanları, bar %100 ve oturum tamamlanma kuralları uygulanmıyor. |
| F3 | `FAIL` | K2 | `bkt-engine.js:476-492`; ZIP `index.html:1563-1575` | Uygulamanın kart motorunda S zinciri bulunmuyor; mevcut hafıza motoru decay/reviewCount kullanıyor. |
| F4 | `FAIL` | K2 | `bkt-engine.js:476-492` | Kart oturumu için ≥%70 Bildi+Zorlandım hesabı yok. |
| F5 | `PASS` | — | `bkt-engine.js:482-491` | Bilemedi ardışık sayacı Bildi ile sıfırlanıyor; 2 ardışıkta yumuşak düşüş yolu var. |
| F6 | `FAIL` | K2 | `bkt-engine.js:546-550` | Panel due olan tüm kartları, konu ONAYLANDI durumunu kontrol etmeden gösteriyor. |
| F7 | `PASS` | — | `bkt-engine.js:457-472` | Standart kartlar en fazla 8; hata kartları 5 ile sınırlı ve yalnız mini test yanlışında üretiliyor. |
| F8 | `PASS` | — | `bkt-engine.js:466-472` | Hata kartı neden filtresi beklenen dört qualifying nedeni kullanıyor; işlem/kodlama kartı üretmiyor. |
| F9 | `PARTIAL` | K2 | `bkt-engine.js:441-464` | Aynı ID ile tekrar üretim engelleniyor; ancak ONAYLI konuya havuz sonradan geldiğinde ayrı otomatik tek-seferlik üretim akışı yok. |
| F10 | `PASS` | — | `bkt-engine.js:476-492` | Kart değerlendirmesi doğrudan BKT gözlemi üretmiyor. |
| F11 | `PASS` | — | `bkt-engine.js:476-492`; ZIP `index.html:1607-1612` | `-S·ln(0.90)` hesabı aktif kodda yok. |
| F12 | `MANUAL` | — | `content/soru_havuzlari/*` örneklemi | Canonical kart alanları `front/back`; 15 öğede istem/cevap biçimi ve tanıma kartı benzerliği insan örneklemiyle değerlendirilmelidir. Dört uzun/çok cümleli kart ve tanıma biçimine benzeyen örnekler otomatik taramada görüldü. |

### Grup G — İlişki grafı

| ID | Sonuç | Önem | Kanıt | Açıklama |
|---|---|---|---|---|
| G1 | `PASS` | — | `content/iliski_grafi.json` | 161 düğüm, 152 kenar; 128 `SERT_ONKOSUL`, 24 `YUMUSAK_TRANSFER`; JSON alanları geçerli. |
| G2 | `FAIL` | K1 | `bkt-engine.js:253-260`; geçici cycle testi | Döngü `sert döngü` hatasıyla raporlanıyor, ancak döngülü kenarlar `edges` listesinden çıkarılmıyor; sonuçta `edges` içinde kalıyor. |
| G3 | `PASS` | — | `bkt-engine.js:239-244`; geçici yetim kenar testi | Yetim kenar `valid` listesine alınmıyor ve hata loglanıyor. |
| G4 | `FAIL` | K2 | `bkt-engine.js:250-260`; geçici 5 kenar testi | Hedef başına 5 SERT kenar hatası üretiliyor, fakat beş kenarın tamamı `edges` içinde bırakılıyor; fazlası devre dışı değil. Gerçek dosyada maksimum giriş 4. |
| G5 | `PASS` | — | `bkt-engine.js:245-249,285-286,304` | Gerçek dosyada tek ters sınıf adayı `mat_10_u01_k01 → fizik_09_u02_k03`; bayraklı kenar kredi/kök neden filtrelerinden dışlanıyor. |
| G6 | `PASS` | — | `bkt-engine.js:240-244`; gerçek graf taraması | Gerçek ağırlık aralıkları geçerli; aralık dışı kenar `valid` listesine alınmıyor. |
| G7 | `PARTIAL` | K2 | `bkt-engine.js:282-293` | Kredi formülü ve latch var; ancak kaynak ONAYLANDI durumu `applyGraphCredits` içinde doğrulanmıyor, yalnızca çağıran akışa bırakılıyor. |
| G8 | `PASS` | — | `bkt-engine.js:297-304` | Son 14 gün/≥3 ve oran/minimum 3 tetiği kodda bulunuyor; tetik yokken aday taraması başlamıyor. |
| G9 | `FAIL` | K2 | `bkt-engine.js:304-314` | Tüm kaynaklar `L≥0.85` olduğunda şartnamedeki “öneri X'te kalır” davranışı yerine `null` dönüyor. |
| G10 | `FAIL` | K2 | `bkt-engine.js:314`; root priority entegrasyonu yok | `priorityWeight` döndürülüyor ancak `max(kendi puanı, hedef puanı × ağırlık)` hesabı ve tetik kalkınca geri alma mekanizması yok. |
| G11 | `PARTIAL` | K2 | `bkt-engine.js:297-315` | Ayrı grafik kök-neden fonksiyonu var; mevcut eski mekanizmanın yeterli veri durumunda grafı kesin olarak bypass ettiğini kanıtlayan birleşik akış yok. |
| G12 | `PASS` | — | `bkt-engine.js:536-542` | Kullanıcı panelinde grafik tip/ağırlık/ileri bağımlılık terimleri render edilmiyor. |

### Grup H — Soru havuzları içerik doğrulaması

| ID | Sonuç | Önem | Kanıt | Açıklama |
|---|---|---|---|---|
| H1 | `FAIL` | K1 | `content/soru_havuzlari/*.json`; `scripts/validate-pools.js:23-34` | Şartname H1'in beklediği `ogeler[]`, `oge_id`, `alt_baslik`, `coktan_secmeli` şeması yerine canonical `sorular[]`, `soru_id`, `alt_beceri`, `secenekler` ve ayrı `flashcards[]` kullanılıyor. |
| H2 | `PASS` | — | `tests/question-pools.test.js`; tüm 152 dosya | Her havuzda en az 10 soru; alt beceri sayısı 5'i aşan havuzlarda 12+ soru taraması başarılı. |
| H3 | `PASS` | — | `scripts/validate-pools.js:26-34` | Mevcut canonical alt beceri sözlüklerinde her etiket en az 2 kez geçiyor. |
| H4 | `MISSING_DOC` | — | `konular.js`; ayrı `alt_basliklar` sözlüğü yok | Müfredatta karşılaştırılacak ayrı alt başlık listesi bulunmadığından birebir uyum testi yapılamadı. |
| H5 | `MANUAL` | — | 152 havuzda 111 farklı `kazanim` değeri; 764 öğede alan yok | Kazanımların kitaptan birebirliği ve AI cümlesi olup olmadığı metin kaynağıyla insan örneklemi gerektiriyor. |
| H6 | `PASS` | — | `scripts/validate-pools.js:28-31`; tüm dosyalar | Tam 4 seçenek, `dogru_index` 0–3 ve boş olmayan çözüm kontrolleri başarılı. |
| H7 | `PASS` | — | Tüm 1.756 soru taraması | Doğru indeksleri 0:480, 1:482, 2:410, 3:384; tek indekste toplanma yok. |
| H8 | `MANUAL` | — | `content/soru_havuzlari/*/flashcards` örneklemi | `front/back` alanlarının istem/cevap niteliği ve iki cümle sınırı insan örneklemiyle karar verilmelidir; otomatik taramada 4 uzun kart görüldü. |
| H9 | `MANUAL` | — | Havuz metin taraması | “aşağıdaki” 18, “görsel” 4, “tabloda” 2, “şekil” 6 örnek bulundu; bunların görsel referansı mı yoksa normal dil mi olduğu insan incelemesi gerektiriyor. |
| H10 | `MANUAL` | — | 15 rastgele öğe ile yapılacak eşleştirme | MCQ ile kendi kartının tanımaya dönüşüp dönüşmediği semantik örnekleme gerektiriyor. |
| H11 | `FAIL` | K1 | `content/soru_havuzlari/*` | Canonical dosyalarda `oge_id` alanı yok; dosya başına soru kimlikleri `soru_id` olarak tutuluyor. |
| H12 | `FAIL` | K1 | `content/iliski_grafi.json` + havuz taraması | Havuzların 53 `konu_id` değeri graf düğümlerinde de bulunmuyor; ayrıca `konular.js` müfredatı isim dizileri kullanıyor ve `konu_id` alanı taşımıyor. |

### Grup I — Mevcut sistem motorları

| ID | Sonuç | Önem | Kanıt | Açıklama |
|---|---|---|---|---|
| I1 | `FAIL` | K2 | `bildirim-logic.js:92-118`; uygulama çıktısı `[["Matematik > T",30.7]]` | Şartname vektörü 10.5/13.65 bekliyor; mevcut motor kaynak ağırlığı ve Laplace terimiyle farklı bir puan üretiyor. |
| I2 | `MISSING_DOC` | — | R2 depoda yok; `index.html:1260-1270` mevcut ağırlık tablosu taşıyor | R2'nin ANLAMADIM rolü ve katsayıların tam otoritatif tanımı bulunmadan referans uyumu kesinleştirilemedi. |
| I3 | `FAIL` | K2 | ZIP `index.html:1794-1805,3401-3411` | ANLAMADIM oranı hesaplanıyor; okuma süresi 30 dk altı/üstü ayrımı ve +5/+10 tavan davranışı uygulanmıyor. |
| I4 | `PASS` | — | ZIP `index.html:1585-1590` | 200,100,45,20,10,5,1 için beklenen `30,15,7,3,2,1,1` değerleri üretiliyor. |
| I5 | `FAIL` | K2 | ZIP `index.html:1281-1290,1592-1597,3925` | `EXAM_REGIMES` sırasındaki ilk `Infinity` kaydı nedeniyle `find()` her pozitif gün sayısında ilk rejimi döndürüyor; ayrıca yeni konu kilidi yalnızca uyarı metni. |
| I6 | `FAIL` | K2 | ZIP `index.html:1271,1599-1613` | Takvim `[3,7,14,21,28]`; şartname `[1,3,7,14,28]` bekliyor. Ayrıca sınav tarihine göre günler dinamik biçimde değişiyor. |
| I7 | `PASS` | — | ZIP `index.html:1924-1940` | `N>=5` olmadan korelasyon üretmiyor ve çıktı metninde “Bilişsel Kondisyon Eğilimi” kullanılıyor. |
| I8 | `PASS` | — | ZIP `index.html:1944-1949,3572-3577` | Öncelik konuları kullanıcı seçtiği ritim penceresine atanıyor; sabit 09:00–11:00 dayatması görülmedi. |
| I9 | `PASS` | — | Depo grep taraması | Kahve/mola/technical-38 türü yapay bildirim metni bulunmadı. |
| I10 | `PASS` | — | ZIP `index.html:3909-3912,3991-4005` | 0 ön test, 1 aktif çalışma, 2 en az 3 çözümlü örnek, 3 15 soruluk karışık pratik adımları mevcut. |
| I11 | `PASS` | — | ZIP `index.html:2618-2637` | Günlük görev tamamlanması ve seri artışı mevcut; ayrıca streak freeze alanları mevcut. |
| I12 | `PASS` | — | ZIP `index.html:1577-1597,3544-3555` | Planlama sınav tarihi `daysLeftToExam()`/rejim motoruna bağlanıyor. |

### Grup J — UI/UX, tasarım ve terminoloji

| ID | Sonuç | Önem | Kanıt | Açıklama |
|---|---|---|---|---|
| J1 | `FAIL` | K3 | ZIP `index.html:23-31` | Beklenen `--bg-canvas: #F5F8FF`; uygulama `#F3F7FE` kullanıyor. |
| J2 | `PARTIAL` | K3 | ZIP `index.html:40,381,456` | Radius değerleri mevcut; R3 ayrı dosya olarak bulunmadığı için beklenen bento gölgesiyle birebir karşılaştırma yapılamadı. |
| J3 | `FAIL` | K1 | ZIP `index.html:61-67,85-91` | Koyu temada `--bg-canvas: #000000` ve `--splash-bg: #000000`; şartname saf siyah zemin/kartı yasaklıyor. |
| J4 | `PASS` | — | ZIP `index.html:50,133,483` | Font yığını ve `tabular-nums` mevcut. |
| J5 | `FAIL` | K2 | ZIP `index.html:403,549`, `bkt-engine.js:385,542,549` | `.btn-sm` 36px; mini test/kart düğmelerinde 48×48 minimum garanti edilmiyor. |
| J6 | `FAIL` | K1 | `app-pwa.js:129,170,177,221`; depo emoji taraması | UI ve bildirim stringlerinde emoji kullanımı var (`🎉`, `☁️`, `📬`, vb.). |
| J7 | `PARTIAL` | K3 | ZIP `index.html:124,1418-1422`; `app-pwa.js:141` | Lucide/currentColor/stroke 1.75 kullanılıyor; Google girişindeki inline SVG ayrı marka ikonudur ve tam “yalnız Lucide” kriteriyle birebir eşleşmiyor. |
| J8 | `FAIL` | K1 | ZIP `index.html:974,1270,1840,3404,4459+`; PWA kullanıcı metinleri | Kullanıcıya görünen splash/help/öneri metinlerinde `Ebbinghaus`, `SKYA` ve benzeri iç terimler mevcut. |
| J9 | `PASS` | — | `bkt-engine.js:22-28,536-538` | Durum eşleme metinleri ve `Yeterlilik` yüzde gösterimi mevcut. |
| J10 | `FAIL` | K2 | `bkt-engine.js:521-550` | Havuz akışı yalnız BKT panelindeki genel butonla render ediliyor; Konu Detayı Kısa Kontrolü ve Günlük Görevler kuyruğu ayrı giriş noktaları olarak yok. |
| J11 | `FAIL` | K2 | `bkt-engine.js:521-550,568-587` | BKT paneli `main-content` içine genel olarak ekleniyor; havuz/kart render'ı yalnızca belirtilen üç konumla sınırlandırılmamış. |
| J12 | `FAIL` | K2 | `bkt-engine.js:530-549` | Panelde yeterlilik gösteriliyor; hafıza göstergesiyle yan yana iki ayrı gösterge kurulmuş değil. |
| J13 | `FAIL` | K2 | `app-pwa.js:1840-1865`; grep sonucu | “Hataların şurada yoğunlaşıyor: [alt başlık]” tetik ve sözlüksüz konu kuralı uygulanmıyor. |
| J14 | `PASS` | — | `bkt-engine.js:539-540`; `bkt-engine.js:314` | Kullanıcı metni “Önce şunu sağlamlaştır: [Konu]” biçimine dönüşüyor; grafik iç terimleri render edilmiyor. |

### Grup K — Kalıcılık, yedekleme, bildirim, PWA

| ID | Sonuç | Önem | Kanıt | Açıklama |
|---|---|---|---|---|
| K1 | `FAIL` | K1 | ZIP `index.html:1460-1474`; `bkt-engine.js:73-82` | `bkt_state` ve migrasyon alanı dinamik ekleniyor; ancak `soru_havuzu_gosterim_logu` state şemasında ve motor akışında yok. |
| K2 | `PASS` | — | ZIP `index.html:1528-1555` | Dışa/içe aktarma tüm state nesnesini taşıyor; BKT alanları state içine dahil olduğundan yedek kapsamına giriyor. |
| K3 | `FAIL` | K2 | `bkt-engine.js:379-407` | Mini test cevapları/oturumu local state'e yazılmıyor; sayfa yenilemesinde modal cevapları kayboluyor. |
| K4 | `PASS` | — | `app-pwa.js:94-105,321-347`; ZIP `index.html:3221` | Bildirim izni kullanıcı aksiyonuna bağlanmış; reddedilme/konfigürasyon yokluğu çekirdek akışı durdurmuyor. |
| K5 | `PARTIAL` | K2 | `sw.js:5-10,20-33` | Offline servis worker'ı mevcut; ancak havuz JSON'ları/BKT motoru ilk kurulum önbelleğine alınmıyor. Daha önce ağdan çekilmemiş içerikle ilk offline test garanti edilmiyor. |

## Sayısal vektör sonuçları

| Vektör | Beklenen | Uygulamanın ürettiği | Sonuç |
|---|---:|---:|---|
| D4 / mini_test doğru 1 | 0.396341 → 0.732432 → 0.917085 | 0.396341 → 0.732432 → 0.917085 | PASS |
| D5 / deneme yanlış ağırlıkları | 0.616106 / 0.766593 / 0.856885 | 0.616121 / 0.766603 / 0.856892 | PASS |
| D6 / L=.50 soru_girisi yanlış | 0.250000 | 0.250000 | PASS |
| D7 / clamp üst | 0.990000 | 0.990000 | PASS |
| I1 / öncelik | 10.5; AYT=.3 → 13.65 | aynı test girdisiyle 30.7 | FAIL(k2) |
| I4 / Cepeda | 30 / 15 / 7 / 3 / 2 / 1 / 1 | 30 / 15 / 7 / 3 / 2 / 1 / 1 | PASS |

## MANUAL listesi

Aşağıdaki testler statik tarama ile nihai olarak PASS/FAIL verilemeyecek insan örneklemi veya gerçek tarayıcı oturumu gerektirir:

- `F12`: 15 kartta üretim istemi/cevap ve tanıma kartı ayrımı.
- `H5`: 10 dosyada üçer `kazanim` değerinin kitap kaynağıyla karşılaştırılması; AI cümlesi şüphesi.
- `H8`: 15 flashcard için istem/arka biçimi, cümle ve formül sınırı.
- `H9`: “aşağıdaki/görsel/şekil/tabloda” bulunan MCQ'ların görsel bağımlılığı ve çok adımlı hesap niteliği.
- `H10`: 15 MCQ–flashcard çiftinde tanıma kartına dönüşüm kontrolü.
- `E1`, `E2`, `E5`, `E7`, `E9`, `E12`: gerçek tarayıcıda konu tamamlama, gün geçişi ve görev sırası senaryoları; statik eksik akış bulguları ayrıca FAIL olarak yazılmıştır.
- `F1`, `F6`, `J5`, `J10`, `J11`, `J12`, `K3`, `K5`: gerçek responsive/touch/offline oturumlarında insan doğrulaması.

## SPEC_GAP listesi

- `A8`: R2/R3 ve tam özellik envanteri depoda olmadığı için şartnamede karşılığı olmayan dosyalar kesin biçimde sınıflandırılamadı.
- `H4`: R5 içindeki mevcut `konular.js` konu isimleri sağlıyor; ayrı bir `alt_basliklar` sözlüğü sağlanmadığı için alt beceri değerleriyle birebir sözlük uyumu testi tanımsız kaldı.

## Genel karar

Kapsamlı şartnameye göre depo **FAIL** durumundadır. Mevcut BKT sayısal vektörleri, temel havuz JSON doğrulaması, graf dosyası bütünlüğü ve bazı mevcut motorlar başarılıdır; ancak mini test zamanlaması/rotasyonu, flashcard davranışı, grafik kenarlarını gerçekten devre dışı bırakma, UI terminoloji/emoji yasakları, kalıcı gösterim logu ve canonical havuz şemasıyla şartnamedeki H1/H11 beklentisi arasında kritik sapmalar bulunmaktadır.
