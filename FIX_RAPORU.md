# FIX_RAPORU — Analiz Merkezi

**Tarih:** 2026-10-12  
**Dal:** `arena/01a0dc3f-analiz-merkezi`  
**Kapsam:** TEST_BULGULARI_.md bulguları, BKT/doğrulama/ilişki grafi şartları, kapsamlı test şartnamesi ve düzeltme talimatı.

## Sonuç özeti

Kod ve dağıtım kopyası için otomatik retest tamamlandı. Önceki retestte kalan flashcard beklentisi düzeltildi: kart oluşturma başlangıcı `S=1` kabulüyle dört ardışık `Bildi` sonucu `6.553600` verir; `Bilemedi`/`Zorlandım`, oturum oranı ve gün merdiveni ayrıca doğrulandı.

- **PASS:** Düzeltme maddelerinin otomatik doğrulanabilen kısmı
- **PARTIAL:** İçerik sahibi onayı veya görsel/etkileşimli insan kontrolü bekleyen maddeler
- **MISSING:** Depoda bulunmayan R2/R3 referansları
- **SPEC_GAP:** Canonical depo şeması ile eski şartname terimi arasında doğrudan uyumsuzluk
- **MANUAL:** Metin/şekil/MCQ–flashcard semantiğinin insan örneklemiyle kontrol edilmesi gereken maddeler
- **FAIL(k1/k2/k3):** Bu retestte kod için açık kalan doğrulanmış bir FAIL bırakılmadı. Owner onayı bekleyen kimlik çakışmaları FAIL'e dönüştürülmedi; karar otomatik verilmedi.

## Otomatik kanıt

| Kontrol | Sonuç |
|---|---|
| `npm run test:bkt` | PASS — BKT vektörleri ve mevcut motor kontrolleri |
| `npm run test:curriculum` | PASS — 10. sınıf TDE/Felsefe |
| `npm run test:pools` | PASS — 152 havuz / 1.756 soru |
| `npm run validate:pools` | PASS — canonical `sorular[]` + `flashcards[]` havuzları |
| `npm run validate:ids` | PASS + owner uyarısı — 551 kayıt uyumlu, 99 aynı `konu_id` metaveri çakışması |
| `node tests/fixes-retest.js` | PASS — C2, D2, F2/F3/F4, G2/G4/G7/G9, E6/E10, I1 |
| `node --check` | PASS — kök motor, uygulama, bildirim mantığı, service worker ve ZIP scriptleri |
| PWA ZIP `unzip -t` | PASS — `analiz-merkezi-pwa (3).zip` |
| ZIP HTTP smoke | PASS — `/`, grafik JSON, havuz index JSON, service worker 200; JSON parse başarılı |

Geçici havuz/test verisi depoya eklenmedi. Retest betiği (`tests/fixes-retest.js`) yalnızca deterministik motor doğrulaması içindir; kullanıcı verisi içermez.

> **Flashcard vektör notu:** `S=1` ve dört `Bildi` eylemi, `1 × 1.6^4 = 6.553600` eder. `10.485760`, aynı zincirin beşinci çarpan sonrasındaki değeridir. Motor şartname formülünü değiştirmemek için dört eyleme yapay bir beşinci tekrar eklenmedi.

## Düzeltme matrisi

| Madde | Sonuç | Kanıt / açıklama |
|---|---|---|
| A1 README ve yayın komutları | PASS | `README.md`, `docs/NETLIFY-YAYIN.md`, `package.json` komutları eklendi. |
| A2–A6 depo, grafik, havuz, manifest, FCM | PASS | Canonical içerik ve PWA varlıkları mevcut; offline/bozulmuş mod korunuyor. |
| A7 R1 rapor kopyası | PASS | `docs/Analiz_Merkezi_BKT_Dogrulama_Iliski_Grafi_Ajan_Raporu.md`. |
| A8 / R2–R3 | MISSING | R2 ve R3 workspace'te yok; bu belgelere bağlı yeni sayı/özellik uydurulmadı. `docs/Analiz_Merkezi_Kapsamli_Test_Sartnamesi.md` yalnız Drive kaynağına referanstır. |
| B1–B3 deneme sınır/net hesabı | PASS | Mevcut üst sınır, D/Y/B ve net akışı korunarak doğrulandı. |
| B4 tam sayı zorunluluğu | PASS | D/Y/B değerleri `numericWholeValue` ile ondalık/negatif/boşluk dışı girdiyi reddeder veya güvenli biçimde boş kabul eder. |
| B5 numeric/inputmode | PARTIAL | D/Y/B tam sayı; plan alanlarının ondalık kullanımının R2/R3 ile birebir karşılaştırması yok. |
| B6 Enter akışı | PASS | Sonraki alana odaklanma korunuyor. |
| B7 gelecek tarih | PASS | Deneme ve soru kayıtları `isFutureDay` ile kayıt öncesi reddediliyor. |
| B8 düzenleme/yeniden işleme | PASS | Kayıt kimlikleri ve `bkt_processed_records` ile yeniden işleme engelleniyor; yeni kayıtlar kronolojik işleniyor. |
| C1/C4/C5 taksonomi ve zorunlu neden | PASS | Dört yanlış nedeni, canonical yazım ve her yanlış/boş için konu+neden zorunluluğu korunuyor. |
| C2 bitişik canonical nedenler | PASS | `KONUEKSİKLİĞİ`, `SÜREYETMEDİ`, `ÇÖZÜMYOLUNUBULAMADIM`; alias normalizasyonu `normalizeReason` ile yapılıyor. |
| C3 eski kodlar | PASS | Kullanıcıya giden güncel HTML/JS/PWA ZIP içinde `KAE`, `İH`, `SKYA`, `BN-1`, `BN-4`, `RisksizBoş` bulunmuyor. Eski bulgu raporu tarihsel kanıt olarak korunmuştur. |
| D1/D3–D13 BKT parametre/formül/migrasyon | PASS | ±0.001 vektörleri, `P_G+P_S<1`, clamp, kaynak enum'u, kredi latch'i, kronolojik migration doğrulandı. |
| D14 durum geçişleri | PASS | Tek negatif gözlem otomatik `RISKLI` yapmıyor; mini test başarısızlığı `ONARIM`, iki bilgi hatası deneme kuralına göre `RISKLI`, flashcard yumuşak düşüşü ayrı. |
| D15 riskli yeniden test | PASS | Tarihli öğrenme testi kuyruğu, iki günlük kilit ve onay koşulu tanımlı. |
| E1 gün 0 kısa kontrol | PASS | 3 soru; `≤1` doğruysa ilk adıma dönüş bilgisi ve tekrar çalışma durumu. |
| E2 gün 3 / öğrenme kuyruğu | PASS | Çalışma tamamlanınca tarihli görev ve günlük kuyruk üretiliyor; ilk açılışta otomatik görev üretimi korunuyor. |
| E3/E5 test tamamlama/sonuç | PASS | Tüm seçenekler işaretlenmeden Bitir disabled; sonuçta doğru/yanlış ve çözüm gösteriliyor; yanlış nedenleri sonuçtan sonra isteniyor. |
| E4 zamanlayıcı | PASS | Şartname gereği test sırasında süre sayacı eklenmedi. |
| E6/E10 havuz LRU | PASS | `soru_havuzu_gosterim_logu` kalıcı state alanı; 28 günlük en eski gösterim rotasyonu ve aynı gün tekrar engeli. |
| E7 başarısız test | PASS | `ONARIM`, iki gün sonrası görev ve aynı gün kilidi. |
| E8 havuzsuz bozulmuş mod | PASS | `gozlem_sayisi>=5`, `L>=0.85`, son deneme koşulu ve havuz gelince tek-seferlik kart üretimi. |
| E9 günlük tavan | PASS | Test 5 dk, kart 30 sn bütçesiyle 15 dk kuyruğu; taşanlar sonraki güne kalır. |
| E11 neden listesi | PASS | Yanlış sonuç sonrası canonical neden seçimi ve eksik neden reddi. |
| E12 havuz sonradan yüklenmesi | PASS | Manifest yüklenince eşleşen konu `pool_id` alır, onaylı konuya kart/test akışı açılır. |
| F1/F2/F3/F4 flashcard | PASS | `Bildi`, `Zorlandım`, `Bilemedi`; `S×1.6`, `S×1.2`, başlangıç `S=1`, `6.553600` dört-Bildi zinciri, `%70` oturum eşiği. |
| F5/F6/F7/F8/F9/F10/F11 | PASS | Bilemedi ardışığı, yalnız onaylı konu kartları, standart/hata kartı tavanları, neden filtresi, sonradan havuz kart senkronu ve BKT'den bağımsız kart değerlendirmesi. |
| F12 kart biçimi | MANUAL | `MANUAL_INCELEME.md` içindeki uzun kart, görsel/şekil ve tanıma kartı örneklemi insan onayı bekliyor. |
| G1/G3/G5/G6/G8 | PASS | Grafik şeması, yetim/döngü, ağırlık aralığı, ters sınıf ve 14 gün/3 hata tetikleri. |
| G2/G4 | PASS | Sert döngü kenarı valid listeden çıkarılıyor; hedef başına 4 sert kenar tutuluyor, fazlası `disabled_edges` listesine gidiyor. |
| G7 | PASS | Kredi yalnız kaynak konu `ONAYLANDI` ise ve latch yoksa uygulanıyor. |
| G9 | PASS | Tüm kaynaklar yeterliyse öneri `stay` ile hedefte kalıyor. |
| G10 | PASS | `max(kendi puanı, hedef puanı × kenar ağırlığı)` override'ı ve tetik kalkınca otomatik temizleme API'si mevcut; eski öncelik formülü değişmedi. |
| G11 | PASS | Yerel hata verisi yeterliyse graph benchmark nedeni bastırılıyor; yetersiz veride graph kök nedeni devreye giriyor. |
| G12 | PASS | Grafik iç motor terimleri kullanıcı metnine render edilmiyor. |
| H1/H11 canonical şema | SPEC_GAP | Kabul edilen kanonik şema `sorular[]` + `flashcards[]` olduğundan eski `ogeler[]`/`oge_id` beklentisi uygulanmadı; havuz içeriği dönüştürülmedi. |
| H2/H3/H6/H7 | PASS | 152 havuz / 1.756 soru; seçenek, çözüm, zorluk ve alt beceri kontrolleri. |
| H4/H5/H8/H9/H10 | MANUAL | Müfredat kaynağıyla kazanım birebirliği, görsel/şekil referansları ve MCQ–flashcard anlam farkı insan örneklemi gerektiriyor. |
| H12 kimlik mutabakatı | PARTIAL | 551 kayıt oluşturuldu; graph/pool kimlikleri kayıt defterinde. 99 aynı `konu_id` için farklı isim/metaveri owner onayı bekliyor; otomatik seçim yapılmadı. |
| I1 öncelik formülü | PASS | Tek formül: `[1.5×Deneme Bilgi Hatası + 1.0×Test Bilgi Hatası + 0.5×(İşlem + Anlamadım)] × (1 + AYT Ağırlığı)`; 0→10.5, 0.3→13.65 vektörleri. |
| I2 R2 kaynaklı katsayılar | MISSING | R2 yok; R2'ye bağlı yeni katsayı/rol icat edilmedi. |
| I3 okuma süresi | PASS | 30 dakika eşiği ve `+5/+10`, 35 dakika tavanı. |
| I4–I12 mevcut motorlar | PASS | Cepeda tekrarları, korelasyon eşiği, ritim penceresi, görev/seri, sınav tarihi bağlantısı korunuyor. |
| J1/J3 renk zemini | PASS | Açık `#F5F8FF`; koyu zemin/kart `#0F172A`, saf siyah yok. |
| J2 gölge/radius | PARTIAL | R3 bulunmadığından birebir tema karşılaştırması yapılamadı; mevcut tasarım yapısı korunmuştur. |
| J4/J5 erişilebilir kontroller | PASS | Tabular sayı/font korunuyor; BKT test/kart/aksiyon kontrolleri en az 48×48. |
| J6 emoji | PASS | Kullanıcıya giden güncel UI/notification metinlerinden emoji kaldırıldı. |
| J7 ikon | PARTIAL | Uygulama ikonları Lucide/currentColor; marka giriş SVG'si R3 kapsamı belirsiz olduğu için insan/owner kararı bekliyor. |
| J8 iç terimler | PASS | Ebbinghaus, SKYA ve benzeri motor terimleri kullanıcı metninden çıkarıldı. |
| J9/J13/J14 terminoloji/focus/root | PASS | `Yeterlilik`, alt beceri yoğunluk etiketi ve kullanıcı dilinde kök neden önerisi. Sözlük yoksa alt beceri etiketi üretilmiyor. |
| J10/J11/J12 giriş noktaları/göstergeler | PARTIAL | Kodda konu detayı kısa kontrolü, günlük kuyruk ve iki yan yana bar var; canlı tarayıcıda tıklama/visual regresyon MANUAL aşamasında. |
| K1 state/log kalıcılığı | PASS | `bkt_state`, migration alanı, mini-test session/cevapları ve havuz gösterim logu state/export kapsamına alındı. |
| K2 dışa/içe aktarma | PASS | Tüm state alanları yedek kapsamındadır. |
| K3 yeniden açılış | PASS | Mini-test `questionIds` ve cevapları state'e yazar; yeniden açılışta aynı oturum devam eder. |
| K4 bildirim dayanıklılığı | PASS | İzin kullanıcı aksiyonuna bağlı; FCM yokluğu çekirdek akışı durdurmaz. |
| K5 PWA cache | PASS | `analiz-merkezi-v-20261012-fix1`; BKT, grafik, havuz index ve 152 havuz JSON'u precache listesinde. |

## Dağıtım çıktıları

1. **PWA arşivi:** `analiz-merkezi-pwa (3).zip` — `unzip -t` başarılı; güncel inline BKT motoru kök `bkt-engine.js` ile eşit.
2. **Netlify statik paketi:** `analiz-merkezi-netlify-20261012.zip` — yalnız dağıtılabilir HTML/JS/CSS/manifest/icon/content/service-worker/netlify varlıkları.
3. **Devir teslim paketi:** `analiz-merkezi-devir-teslim.zip` — raporlar, güncel PWA ZIP'i, Netlify ZIP'i ve kurulum yardımcıları.

R2/R3 ve 99 kimlik çakışması içerik sahibi/owner onayı bekleyen maddelerdir. Bu maddeler için otomatik karar verilmedi. **Merge yapılmadı; kullanıcı onayı bekleniyor.**
