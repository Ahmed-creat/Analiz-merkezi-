# Analiz Merkezi / Bilge — BKT + Doğrulama Katmanı + Flashcard Entegrasyonu: Uygulama Şartnamesi

> **Bu dokümanın muhatabı kodlama agent'ıdır.** İçindeki tüm terimler (mühür, mastery, BKT, kök neden, SERT_ONKOSUL, latch vb.) İÇ TERMİNOLOJİDİR ve kullanıcı arayüzünde HİÇBİRİ görünmemelidir. Kullanıcıya gösterilecek metinler için Bölüm 9'daki eşleme tablosu zorunludur.
>
> Çapraz ilişkilendirme grafının VERİSİ bu raporda yoktur; içerik sahibi tarafından depoya `content/iliski_grafi.json` yoluyla sağlanır. Bu rapor yalnızca motorun o dosyayı nasıl işleyeceğinin kurallarını tanımlar. Soru havuzu üretim kapsamı (hangi konulara soru hazırlanacağı) da bu raporda yoktur; içerik sahibinin kendi listesindedir.

---

## 0. Uygulama İlkesi: Agent Sıfır Serbestlik

Bu şartnamedeki her değer, eşik, formül, akış ve ekran davranışı KESİNDİR. Agent:
- Şartnamede olmayan hiçbir özellik, modül, parametre, ekran veya öneri EKLEMEZ
- Hiçbir sayısal değeri (eşik, ağırlık, süre, soru sayısı, yüzde) değiştirmez
- Şartnamede tanımsız bir davranış gerekirse KENDİ KARAR VERMEZ; o maddeyi atlar ve raporlar
- Mevcut ekran bileşenlerini, tasarım tokenlarını ve renk paletini kullanır; yeni tasarım dili icat etmez
- Tek istisna: davranışı etkilemeyen teknik uygulama tercihleri (değişken adları, dosya organizasyonu, framework içi kalıplar)

---

## 1. Ne Ekleniyor (Özet)

Mevcut uygulamaya (manuel deneme girişi + hata/boş nedeni taksonomisi + öncelik motoru + 4 adımlı çalışma + Ebbinghaus tekrar takvimi) dört yeni bileşen eklenir:

1. **BKT Motoru** — her konu için öğrenci bazlı "öğrenme olasılığı" (mastery) hesaplar. Deneme, soru girişi ve mini test gözlemlerinden beslenir.
2. **Doğrulama Katmanı (mini testler + öğrenme onayı)** — "konuyu çalıştım" beyanını objektif teste bağlar. Konu başına 10 soruluk havuz.
3. **Flashcard modülü + hafıza entegrasyonu** — öğrenmesi onaylanan konunun hatırlanmasını izler; mevcut Ebbinghaus motoruyla birleşir.
4. **İlişki grafı motoru** — depodaki `content/iliski_grafi.json` dosyasını yükler, doğrular ve kök-neden teşhisi + başlangıç kredisi üretir (kurallar: Bölüm 6).

Mevcut hiçbir modül kaldırılmaz. Hata/boş nedeni taksonomisi (Konuyu Bilmiyordum, ANLAMADIM, İşlem Hatası/Dikkatsizlik, Kodlama/Kitapçık Hatası, KONUEKSİKLİĞİ, SÜREYETMEDİ, ÇÖZÜMYOLUNUBULAMADIM) aynen korunur ve BKT'nin ana girdisidir.

---

## 2. Mimari ve Veri Akışı

```text
KATMAN 1 — VERİ GİRİŞİ
  Deneme girişi (manuel, hata/boş nedenli)   ─┐
  Soru bankası girişi (15'li karışık setler)  ─┼→ her soru = 1 gözlem {konu_id, dogru_mu, neden, kaynak, tarih}
  Mini testler (ön-kontrol + öğrenme testi)   ─┤
  Flashcard tekrarları (Bildi/Bilemedi)       ─┘ (yalnızca hafıza motoruna gider, BKT'ye tam gözlem OLMAZ)

KATMAN 2 — MOTORLAR (arka plan, kullanıcıya görünmez)
  BKT Motoru        → mastery L ∈ [0,1]   "öğrendi mi?"
  Hafıza Motoru     → R = e^(-t/S)        "hatırlıyor mu?"   (mevcut Ebbinghaus, değişmez)
  İlişki Grafı      → kök-neden + kredi   "sorunun kaynağı nerede?" (veri: content/iliski_grafi.json)

KATMAN 3 — KARARLAR (kullanıcının gördüğü)
  Konu durumu rozeti · Acil Çalışılacaklar sırası · Tekrar takvimi · "Önce şu konuyu sağlamlaştır" önerisi
```

Kalıcı depolama: mevcut LocalStorage/IndexedDB şemasına iki koleksiyon eklenir:
- `bkt_state`: öğrenci bazlı `{ konu_id: { L, gozlem_sayisi, son_gozlem_tarihi, tetiklenen_krediler[], onay_durumu } }`
- `soru_havuzu_gosterim_logu`: `{ konu_id, soru_id, son_gosterim_tarihi }` (rotasyon için)

Soru havuzları STATİK JSON dosyalarıdır (içerik, kod değil): `content/soru_havuzlari/{konu_id}.json`.

`kaynak` alanı kapalı enum'dur; alabileceği tek değerler: `deneme` | `soru_girisi` | `mini_test`. Başka hiçbir değer yazılamaz; flashcard verisi gözlem ÜRETMEZ.

**Tek seferlik migrasyon (Faz A):** Uygulama ilk açıldığında, kullanıcının mevcut deneme ve soru girişi kayıtları kronolojik sırayla BKT'den bir kez geçirilir (aynı ağırlıklar, aynı formül). Kaydı olmayan konular P_L0'da kalır. Migrasyon tekrar çalıştırılamaz (bayrak: `bkt_migration_done`).

---

## 3. BKT Motoru — Teknik Şartlar

### 3.1 Parametreler (sabit, elle ayarlı — EM/parametre öğrenme YOK)

| Parametre | Değer | Not |
|---|---|---|
| P_L0 | 0.12 | varsayılan başlangıç; ilişki kredisiyle en fazla 0.40'a çıkar |
| P_G | 0.25 | 4 seçenekli çoktan seçmeli şans oranı |
| P_S | 0.10 | düşüktür çünkü dikkatsizlik zaten neden girişiyle yakalanır |
| P_T | kaynağa göre: deneme 0.05 · soru girişi 0.15 · mini test 0.10 | deneme ölçer-öğretmez; soru girişi öğrenme fırsatıdır |

Kısıt (Baker 2008): `P_G + P_S < 1` — açılışta doğrulanır, ihlalde motor başlamaz.

### 3.2 Gözlem ağırlıkları (hata/boş nedenine göre)

| Neden | Ağırlık w | Davranış |
|---|---|---|
| (doğru cevap, nedensiz) | — | tam güncelleme |
| Konuyu Bilmiyordum | 1.0 | tam yanlış güncellemesi |
| KONUEKSİKLİĞİ | 1.0 | tam yanlış güncellemesi |
| ANLAMADIM | 0.5 | yarı yanlış: `L_new = L + (L_yanlis - L) * w` |
| ÇÖZÜMYOLUNUBULAMADIM | 0.5 | yarı yanlış |
| İşlem Hatası/Dikkatsizlik | 0.2 | hafif negatif (slip) |
| Kodlama/Kitapçık Hatası | null | GÖZLEM SAYILMAZ, hiçbir güncelleme yok |
| SÜREYETMEDİ | null | GÖZLEM SAYILMAZ |

### 3.3 Güncelleme formülü (standart BKT)

```text
Doğru:  L_obs = L*(1-P_S) / (L*(1-P_S) + (1-L)*P_G)
Yanlış: L_obs = L*P_S     / (L*P_S     + (1-L)*(1-P_G))
Sonra:  L_new = L_obs + (1 - L_obs) * P_T
Ağırlıklı yanlış: L_new = L + (L_new(w=1) - L) * w
```

### 3.4 Durum kuralları (ZORUNLU)

1. **Öğrenci izolasyonu:** Tüm mastery değerleri öğrenci bazlıdır (`bkt_state`). Konu parametreleri (P_L0, P_T, P_G, P_S) GLOBAL SABİTTİR; hiçbir öğrenci eylemi bunları değiştiremez.
2. **Latch:** Kredi tetiklemesi konu başına öğrenci başına BİR KEZ olur (`tetiklenen_krediler` listesine yazılır).
3. **Minimum veri:** `gozlem_sayisi < 5` olan konuda mastery kullanıcıya GÖSTERİLMEZ; durum rozeti "veri yetersiz" karşılığıdır (Bölüm 9).
4. **Unutma:** Mastery kendiliğinden düşmez. Düşüş yalnızca iki yoldan: (a) yeni negatif gözlem, (b) hafıza sinyali — hafıza barı %20'nin altına düşerse VEYA üst üste 2 flashcard "Bilemedi" gelirse `L = L * 0.8` (yumuşak düşüş, günde en fazla 1 kez).
5. **Deneme denetimi:** Onaylı (mühürlü) bir konudan bir denemede 2+ soru "Konuyu Bilmiyordum/KONUEKSİKLİĞİ" ile yanlış çıkarsa onay durumu `RISKLI`'ya düşer ve konu yeniden test kuyruğuna girer.
6. **Aralık kısıtı:** L her güncellemeden sonra [0.01, 0.99] aralığına kıstırılır (clamp); hiçbir işlem L'yi tam 0 veya tam 1 yapamaz.
7. **Geriye dönük işlem yok:** Gözlemler yalnızca oluştukları anda işlenir; geçmiş gözlemler hiçbir durumda yeniden hesaplanmaz.

### 3.5 Konu durumu makinesi

```text
VERI_YETERSIZ → OGRENIYOR → ONAYLANDI ⇄ RISKLI → ONARIM
Geçişler:
  gozlem ≥ 5                       → OGRENIYOR
  L ≥ 0.85 + öğrenme testi ≥ %80   → ONAYLANDI
  deneme denetimi başarısız / hafıza alarmı → RISKLI
  RISKLI + öğrenme testi < %80     → ONARIM (4 adımlı çalışma yeniden)
  RISKLI veya ONARIM + yeni öğrenme testi ≥ %80 ve L ≥ 0.85 → ONAYLANDI (döngü kapanır)
```

### 3.6 Mastery gösterim yerleri

- "Yeterlilik" adıyla, her zaman TAM SAYI yüzde olarak gösterilir.
- Gösterileceği yerler: Bilgi Bankası konu detayı (mevcut hafıza barının yanında, ayrı bir gösterge) ve Konu Takibi listelerindeki konu rozetleri.
- 5 gözlemin altında yüzde yerine durum rozeti gösterilir (Bölüm 9 eşlemesi).
- Yeterlilik ile Hafıza göstergeleri YAN YANA iki ayrı göstergedir; asla tek çubukta birleştirilmez, asla birbirine çevrilmez.
- 4 adımlı çalışma döngüsü mevcut sistem şartnamesindeki haliyle korunur (0. ön test/tahmin → 1. aktif konu çalışması → 2. çözümlü örnek inceleme → 3. karışık pratik ve hata girişi); bu rapor o döngüye yalnızca bitişindeki ön-kontrol testini ve 3. gün öğrenme testini ekler.

---

## 4. Doğrulama Katmanı — Mini Testler ve Soru Havuzları

### 4.1 Akış (zamanlama bilimsel gerekçeye dayanır: Roediger & Karpicke 2006 — aynı günkü test öğrenmeyi ölçmez, gecikmiş test ölçer)

| An | Test | Soru | Etki |
|---|---|---|---|
| Gün 0 — 4 adımlı çalışma bitimi | Ön-kontrol | 3 soru | Onay VERMEZ. 3'te ≤1 doğru → "1. adıma dön" önerisi. Sonuç BKT'ye normal gözlem olarak girer. |
| Gün 3 — ilk tekrar günü | Öğrenme testi | 5 soru | ONAY koşulu: test ≥ %80 (5'te 4) VE BKT L ≥ 0.85. Geçerse ONAYLANDI + tekrar kuyruğuna giriş. Geçemezse ONARIM, yeni test 2 gün sonra. |
| Gün 7 | Flashcard + kritik konularda 2 çoktan seçmeli | — | Bölüm 5 |
| Gün 14, 28 | Yalnızca flashcard | — | Bölüm 5 |
| Denemeler | — | tüm sorular | BKT'ye akar, onay denetimi yapar |

Günlük yük sınırı: bir konu için günde en fazla 1 mini test; toplam doğrulama yükü (test+kart) günde ~15 dakikayı aşmayacak şekilde kuyruk sınırlanır.

### 4.2 Soru havuzu şeması

Konu başına **10 soru** (alt beceri sayısı > 5 ise 12–15). Her soru bir alt beceriye etiketli; alt beceri başına en az 2 soru. Hangi konulara havuz üretileceği bu raporun konusu değildir; içerik sahibi kendi listesiyle `content/soru_havuzlari/` altına dosya ekledikçe sistem otomatik devralır.

```json
{
  "konu_id": "<müfredat JSON'undaki konu_id>",
  "sorular": [
    {
      "soru_id": "<konu_id>_s01",
      "alt_beceri": "<alt beceri adı>",
      "metin": "...",
      "secenekler": ["...", "...", "...", "..."],
      "dogru_index": 2,
      "cozum": "...",
      "zorluk": "deneme"
    }
  ]
}
```

Rotasyon kuralları:
- Test, havuzdan en eski gösterilmiş soruları çeker; bir soru 28 gün içinde aynı öğrenciye iki kez gösterilmez.
- Havuz biterse en az yakın zamanda gösterilenlerden devir edilir; devir gözlemleri normal sayılır.

Soru yazım kuralları (içerik doğrulamasında da denetlenir):
- 4 seçenekli çoktan seçmeli, deneme zorluğunda ("zorluk": "kolay" yasak).
- Tuzak/şaka soru yok; uzun paragraflı sözel soru yok.
- Her soru yalnızca etiketlendiği alt beceriyi yoklar.
- Test sonunda her yanlış/boş için mevcut neden taksonomisi sorulur (aynı ekran bileşeni yeniden kullanılır).

### 4.3 Havuz yokken: Bozulmuş mod (degraded mode)

Soru havuzu eklenmemiş konularda mini test UI'ı hiç render edilmez. Motor çalışmaya devam eder:
- Onay koşulu geçici olarak: `L ≥ 0.85 + gozlem_sayisi ≥ 5 + son denemede o konudan ≥ %60 doğru`.
- Kök-neden önerisi yalnızca deneme verisiyle çalışır.
Bu sayede **sistem, sorular hazırlanmadan ÖNCE de kurulur ve çalışır** (Bölüm 7'nin gerekçesi).

### 4.4 Test uygulama kuralları (KESİN — agent serbestliği yok)

1. **Tüm sorular işaretlenmek zorunda:** test boş bırakılarak teslim edilemez. Öğrenci cevabı bilmiyorsa da bir seçenek işaretler; test bitiminde her yanlış/boş için mevcut neden taksonomisi ekranı açılır.
2. **Süre yok:** mini testlerde zamanlayıcı çalışmaz; süre baskısı denemenin işidir.
3. **Anlık geri bildirim yok:** test sırasında doğru/yanlış gösterilmez; doğru cevaplar ve çözümler test bitiminde topluca gösterilir.
4. **Öğrenme testi zamanlaması:** 3. gün uygulama açılmamışsa test, 3. günden sonraki İLK açılışta kuyruğa girer. Test yapılana kadar konu OGRENIYOR durumunda kalır; diğer tekrarlar bloklanmaz.
5. **2 gün kuralı:** başarısız öğrenme testinden sonra bir sonraki test en erken 2 gün sonraya kuyruklanır; aynı gün tekrar test açılamaz.
6. **"Kritik konu" tanımı (Gün 7'deki 2 çoktan seçmeli için):** mevcut öncelik motorunun KRİTİK işareti taşıdığı konular (Acil Çalışılacaklar'da yüksek öncelik puanlı konular). YENİ bir kritiklik hesabı icat edilmez.
7. **Kart seansı büyüklükleri:** Gün 7'de 5–10 kart; Gün 14 ve 28'de 3–8 kart.
8. **Günlük yük tavanı:** toplam doğrulama yükü (test + kart) günde ~15 dakikayı aşmaz; tavan aşılırsa kuyruk kesilir, artan görevler ertesi güne devreder. Testler kartlardan önce gelir.

---

## 5. Flashcard Modülü + Hafıza Entegrasyonu

### 5.1 Kart üretimi
- Kaynak 1: Bilgi Bankası'ndaki konunun formül/tanım/kural maddeleri (boşluk doldurma biçimi).
- Kaynak 2 (öncelikli): öğrencinin o konudaki yanlış yaptığı sorunun çözümündeki kritik adım → "kendi hatasından kart".
- Kart biçimi: ÜRETİM kartı (önce zihinden üret, sonra çevir). Tanıma kartı (4 seçenekli "hangisi?") flashcard olarak kullanılmaz.
- Değerlendirme: iki düğme — **Bildi / Bilemedi**. Karmaşık öz-değerlendirme skalası yok.
- Kart sayısı tavanları: konu başına en fazla 8 standart kart (Bilgi Bankası'nın formül/tanım/kural maddelerinden seçilir); konu başına en fazla 5 hata kartı ("Konuyu Bilmiyordum", "KONUEKSİKLİĞİ" veya "ÇÖZÜMYOLUNUBULAMADIM" nedeni girilen her yanlış soru için 1 kart). "İşlem Hatası/Dikkatsizlik" ve "Kodlama/Kitapçık Hatası" yanlışlarından kart ÜRETİLMEZ.
- Kart üretimi yalnızca ONAYLANDI durumuna geçiş anında bir kez yapılır; sonradan otomatik kart eklenmez (hata kartları hariç: yeni qualifying yanlış geldikçe, tavan içinde eklenir).

### 5.2 Üç bağlantı kuralı (fazlası yasak)
1. **BKT → tekrar kuyruğu:** Yalnızca ONAYLANDI durumundaki konu flashcard kuyruğuna girer.
2. **Tekrar → BKT yumuşak sinyal:** hafıza barı < %20 VEYA üst üste 2 "Bilemedi" → `L = L * 0.8` + konu Acil Çalışılacaklar'a döner.
3. **Öz-değerlendirme izolasyonu:** "Bildi/Bilemedi" verisi BKT'ye ASLA doğrudan gözlem olarak girmez (yalnızca kural 2 üzerinden dolaylı etki).

### 5.3 Zamanlayıcı tekilliği
Mevcut sabit takvim (3/7/14/28) KORUNUR ve tek zamanlayıcıdır. Dinamik S-bazlı aralık (`aralık = -S * ln(0.90)`, Cepeda tavanı: `min(S-aralığı, KalanGün * 0.15)`) yalnızca ileride opsiyonel bir faz olarak ele alınır; iki zamanlayıcı aynı anda çalıştırılamaz.

### 5.4 Bildi/Bilemedi değerlendirmesinin hafıza barına etkisi (KESİN)

| Değerlendirme | Etki |
|---|---|
| Bildi | Mevcut "tekrar tamamlandı" davranışı AYNEN uygulanır: bar %100'e çıkar, S = S × 1.6, o günün tekrarı tamamlanmış sayılır |
| Bilemedi | Bar %100'e ÇIKMAZ (mevcut değerinde kalır), S çarpılmaz, o günün tekrarı tamamlanmış SAYILMAZ; aynı kartlar ertesi gün yeniden gösterilir; konunun ardışık "Bilemedi" sayacı +1 |

Ardışık 2 "Bilemedi" → Bölüm 5.2 kural 2 tetiklenir (L = L × 0.8, günde en fazla 1 kez + Acil Çalışılacaklar'a dönüş). Bir "Bildi" gelince sayaç sıfırlanır. Kart oturumunda kartların bir kısmı Bilindi, bir kısmı Bilemedi ise: günün tekrarı tamamlanmış sayılması için kartların ≥ %70'i Bilinmiş olmalıdır; aksi halde Bilemedi muamelesi (ertesi gün yalnızca Bilemedi denen kartlar yeniden gösterilir).

---

## 6. İlişki Grafı Motoru — Kurallar (veri depodan gelir)

Graf verisi (`dugumler` + `kenarlar`) içerik sahibi tarafından `content/iliski_grafi.json` olarak depoya konur. Bu rapor veriyi yeniden üretmez; motorun dosyayı nasıl işleyeceğini tanımlar.

### 6.1 Beklenen şema biçimi
- `dugumler[]`: `konu_id`, `konu_adi`, `sinif`, `ders`
- `kenarlar[]`: `kaynak_konu_id`, `hedef_konu_id`, `iliski_tipi` (`SERT_ONKOSUL` | `YUMUSAK_TRANSFER`), `agirlik`, `gerekce`
- Yön kuralı: **kaynak = temel (önce öğrenilen), hedef = bağımlı.**

### 6.2 Ağırlık kullanımı
- SERT_ONKOSUL: başlangıç kredisi = `+0.15 * agirlik` (kaynak ONAYLANDI ise, latch'le bir kez); kök-neden alarmının öncelik çarpanı = `agirlik`.
- YUMUSAK_TRANSFER: başlangıç kredisi = `+0.10 * agirlik` (bir kez). Başka hiçbir etkisi yok — tekrar sayısı, test, öneri üretmez.
- Her konuda toplam başlangıç kredisi tavanı: P_L0 + krediler ≤ 0.40.

### 6.3 Yükleme doğrulamaları (açılışta çalışır; ihlalde kenar devre dışı + log, uygulama çökmez)
1. **Döngü yasağı:** SERT kenarlar DAG oluşturmalı (topolojik sıralama kontrolü).
2. **Varlık:** her kenarın iki ucu `dugumler`'de ve müfredat JSON'unda olmalı.
3. **Yoğunluk:** bir konuya giren SERT kenar sayısı ≤ 4.
4. **Sınıf yönü kuralı (İLERİ BAĞIMLILIK):** SERT kenarda `kaynak.sinif > hedef.sinif` ise kenar otomatik `ILERI_BAGIMLILIK` bayrağı alır: kök-neden önerisi ve kredi ÜRETMEZ (alt sınıf öğrencisine üst sınıf konusu "onar" diye önerilemez). Motor bayraklar; içeriğe müdahale etmez.
5. **Ağırlık sınırları:** SERT ∈ [0.70, 1.00], YUMUSAK ∈ [0.20, 0.50].

### 6.4 Kök-neden algoritması (mevcut mekanizmanın ÜSTÜNE eklenir, yerine geçmez)

Mevcut kural korunur: hedef konuda ANLAMADIM/KONUEKSİKLİĞİ biriktiyse ve ön koşul konusunda da konu eksikliği hataları varsa sistem ön koşulu çalıştırır. Graf bunu YALNIZCA şu kör noktada tamamlar: kök-neden konusu denemede hiç sorulmadığında (veri yok).

```text
Tetik: hedef konu X'te son 14 günde ≥ 3 adet (ANLAMADIM | KONUEKSİKLİĞİ)
       VEYA bu nedenler X'in hatalarının ≥ %40'ı (min 3 gözlem)
Adım 1: X'in kendi deneme verisi yeterliyse → mevcut mekanizma çalışır (graf karışmaz)
Adım 2: X'in SERT kaynaklarını dolaş (ILERI_BAGIMLILIK bayraklılar hariç):
        kaynak L < 0.60 veya kaynakta hiç veri yok → öneri: "Önce [kaynak konu] konusunu
        sağlamlaştır" + kaynak konu Acil Çalışılacaklar'a kök neden olarak eklenir
Adım 3: tüm kaynaklar L ≥ 0.85 → öneri X'te kalır (bugünkü davranış)
```

Önceliklendirme ve seçim kuralları (KESİN):
- Kök neden olarak listeye eklenen kaynak konunun öncelik puanı = `max(kendi puanı, hedef konu puanı × kenar agirlik)`.
- Birden fazla SERT kaynak koşulu sağlıyorsa öneride YALNIZCA L değeri en düşük kaynak gösterilir; L eşitse agirlik'i yüksek olan öne alınır. Diğerleri loglanır, kullanıcıya gösterilmez.
- Tetik koşulu ortadan kalktığında (son 14 gündeki ANLAMADIM/KONUEKSİKLİĞİ yoğunluğu eşiklerin altına düştüğünde) öncelik yükseltmesi ve öneri otomatik geri alınır.
- Kaynak konu ONAYLANDI olduğunda kök-neden önerisi üretilmez (Adım 3).

---

## 7. Kurulum Kararı: Sistem Önce, Sorular Sonra

**Sistem kodu soru havuzları beklenmeden eklenir.** Gerekçe: Bölüm 4.3'teki bozulmuş mod sayesinde motor deneme + soru girişi verisiyle ilk günden çalışır; soru havuzları saf İÇERİK güncellemesidir (JSON dosyası), kod değişikliği gerektirmez. Ters sıralama (önce sorular) haftalarca ölü içerik üretimi demektir.

Kurulum sırası:
1. Faz A: BKT motoru + gözlem ağırlıkları + durum makinesi + bozulmuş mod (yalnızca mevcut deneme/soru girişi verisiyle çalışır)
2. Faz B: havuz şeması + rotasyon + mini test UI + onay akışı (Gün 0 / Gün 3) + `validate:pools` betiği
3. Faz C: ilişki grafı yükleme-doğrulama + kök-neden algoritması + krediler (veri: depodaki `content/iliski_grafi.json`)
4. Faz D: flashcard modülü + 3 bağlantı kuralı + onay denetimi

---

## 8. Faz Kabul Kriterleri

| Faz | Bitti sayılma koşulu |
|---|---|
| A | Deneme girişinde her soru BKT'ye akıyor; 5 gözlem altı konuda yüzde gizli; neden ağırlıkları tabloyla birebir; global parametre mutasyonu yok (testle kanıtlı) |
| B | Havuzu olan konuda Gün 0'da 3, Gün 3'te 5 soru çıkıyor; rotasyon 28 gün kuralına uyuyor; onay koşulu (≥%80 + L≥0.85) çalışıyor; havuzsuz konu bozulmuş modda |
| C | 5 doğrulama kuralı açılışta çalışıyor; döngülü/yetim/ileri-bağımlılık kenarlar loglanıp devre dışı kalıyor; kök-neden önerisi yalnızca Bölüm 6.4 tetiğinde görünüyor |
| D | Yalnızca ONAYLANDI konular kart kuyruğunda; "Bildi/Bilemedi" BKT'ye doğrudan girmiyor (testle kanıtlı); bar <%20 → L*0.8 günde 1 kez |

---

## 9. UI Terminoloji Kuralları (ZORUNLU)

İç terimler kullanıcıya asla gösterilmez. Eşleme:

| İç terim (kod/doküman) | Kullanıcının göreceği metin |
|---|---|
| mühür / ONAYLANDI | "Öğrenme Onaylandı" |
| VERI_YETERSIZ | "Birkaç soru daha çöz, seviyen netleşsin" |
| OGRENIYOR | "Gelişiyor" |
| RISKLI | "Tekrar Gerekiyor" |
| ONARIM | "Bu konuyu yeniden çalışalım" |
| mastery / L | "Yeterlilik" (% olarak, her zaman tam sayı) |
| ön-kontrol testi | "Kısa Kontrol" |
| öğrenme testi / mühür testi | "Öğrenme Testi" |
| kök-neden önerisi | "Önce şunu sağlamlaştır: [Konu Adı]" |
| başlangıç kredisi / YUMUSAK_TRANSFER / ILERI_BAGIMLILIK | GÖRÜNMEZ (sessiz çalışır) |
| BKT, Bayes, Ebbinghaus, FSRS, SERT_ONKOSUL, latch, gözlem | ARAYÜZDE YASAK |

Genel kurallar: emoji yok; ikonlar Lucide (stroke 1.75, currentColor); mevcut renk paleti ve tasarım tokenları değişmez; sayılar `tabular-nums`.

---

## 10. README Talimatı (agent, Faz A–D'yi GitHub'da tamamladıktan sonra)

README.md dosyasına, kurulum bölümünden sonra şu başlık EKLENMELİDİR:

```markdown
## Soru Havuzlarının Eklenmesi (İçerik Aşaması)

Uygulama motoru (BKT, mini testler, ilişki grafı) soru havuzları olmadan da çalışır
(bozulmuş mod: onay yalnızca deneme verisiyle doğrulanır). Bu aşamadan sonra
soru havuzları içerik güncellemesi olarak eklenir; kod değişikliği gerektirmez:

- Konum: `content/soru_havuzlari/{konu_id}.json` (şema: şartname bölüm 4.2)
- Konu başına 10 soru; her soru `alt_beceri` etiketli; alt beceri başına ≥ 2 soru
- Sorular 4 seçenekli, deneme zorluğunda, tuzaksız; `cozum` alanı zorunlu
- Üretim sırası ve kapsam: içerik sahibinin konu listesi (depo dışı doküman)
- Her havuz dosyası eklendiğinde `npm run validate:pools` çalıştırılmalı
  (şema + etiket + seçenek/çözüm zorunluluğu kontrolü); geçerli dosya merge
  edilince ilgili konu otomatik olarak mini test akışına geçer
- Çapraz ilişkilendirme grafı `content/iliski_grafi.json` konumundadır;
  açılışta şema ve tutarlılık doğrulamasından geçer (şartname bölüm 6.3)
```

Agent ayrıca `validate:pools` betiğini Faz B'de teslim eder.

---

## 11. Bilimsel Dayanak Özeti (kod yorumlarında kaynak gösterilebilir)

- BKT dört parametre modeli: Corbett & Anderson (1994); parametre kısıtları ve dejenerasyon: Baker vd. (2008); beceri başına min. ~4 pratik fırsatı: Springer IJ-STEM (2018)
- Gecikmiş testin üstünlüğü (Gün 3 onayı): Roediger & Karpicke (2006), Psychological Science
- Aralıklı tekrar: Cepeda vd. (2006) meta-analiz; sınav-kalan-süre oranı kuralı: Cepeda (2008)
- Ön bilginin sonraki bilgiyi yordadığı ama öğrenme hızını garanti etmediği (kredi tasarımının gerekçesi): Educational Psychologist meta-analizi (2022)
- Ön koşul grafları ve kök-neden teşhisi: Doignon & Falmagne (1985); Vuong vd. (2011)
- Unutma farkındalıklı bilgi izleme (BKT + hafıza birleşimi): FAM (Khajah vd.), MemoryKT (2025), MLEKT (2026)
- FSRS/DSR hafıza modeli R = e^(-t/S): mevcut Ebbinghaus motoruyla aynı formül ailesi
- Flashcard/sınav hazırlığı kanıtı: tıp eğitimi meta-analizi SMD 0.78 (2025); Anki–USMLE Step 1 ilişkisi
