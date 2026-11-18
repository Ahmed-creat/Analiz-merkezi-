# v88 — "Sildiğim deneme geri geldi" + "bildirim kartın arkasında kalıyor"

**Tarih:** 18 Kasım 2026 · **Sürüm:** `v88-silinen-geri-gelmez` · **Kod:** `fc3a0af`

---

## 1. Şikâyet (kullanıcının cümleleri)

1. "Okulizyon sorunu devam ediyor. Bir kere çekildi. Sonra **tüm verileri sildim, çıkış yaptım, tekrar girdim ve bir deneme geri geldi.** Şunu çöz."
2. "**Bilgileri kaydet** dedikten sonra **ekran kapanmıyor**; kullanıcı deneme çekildiği o anı göremiyor, **uygulama içi bildirim o kartın arkasında kalıyor.**"

---

## 2. Neden oluyordu (ölçüldü, tahmin değil)

### 2.1 Deneme neden geri geliyordu — iki ayrı kapı açıktı

| # | Kapı | Ne yapıyordu |
|---|---|---|
| A | Girişte **zorla** çekim | Giriş yapılınca `okzKuyrukCek(true)` çağrılıyordu. `true` "elle" demekti: 5 dakikalık bekleme sınırını **ve** silme notlarını yok sayıp sunucudaki `okulizyon_kuyrugu` kaydını yeniden içe alıyordu. Kuyrukta hesap başına **1 kayıt** duruyor ("10.SINIF MAARİF İZLEME SINAVI 1"). |
| B | Buluttan geri yükleme | "Tüm verileri sil" yerel dosyayı boşaltıyor, buluta yazma **1,5 sn gecikmeli**. Kullanıcı hemen çıkış yapınca bulut **eski** kopyayla kalıyor; tekrar girişte bulut yerelden doluysa geri yükleniyor → **silinen deneme geri geliyor.** |

Canlı ölçüm (17:10 TR): `app_states` üç hesapta da **1 deneme**, `okulizyon_kuyrugu` iki hesapta `ok` durumunda 1 kayıt → kapı A doğrulandı.

### 2.2 Bildirim neden görünmüyordu

`#toast-container` katmanı **z-index: 100**; profil penceresi **9997**, Okulizyon penceresi **9998**, giriş penceresi **9999**. Yani bildirim her zaman pencerenin **altında** çiziliyordu. Üstelik "Bilgileri Kaydet" pencereyi kapatmıyordu → kullanıcı hem pencereyi hem kartın arkasındaki yazıyı görüyordu.

---

## 3. Ne değişti

### 3.1 Silinen veri artık kendi kendine gelmiyor (iki kilit)

1. **`otomatikDurdu` bayrağı (durum içinde, buluta da yazılır).**
   "Tüm verileri sil" / "Denemeleri sil" → bayrak **açık**. Açıkken yalnız **otomatik** çekimler (açılış, giriş, sayfa geçişi) durur. Kullanıcı **"Şimdi dene"** / **"Okulizyon'dan çek"** derse bayrak kalkar ve her şey yeniden çekilir.
2. **Cihaz damgası (`am_sifirlandi_<kullanıcı>`).**
   Silme anı cihaza zaman damgası olarak yazılır. Girişte bulut kaydının zamanı bu damgadan **eskiyse** buluttaki denemeler **geri yüklenmez**; boş durum buluta hemen yazılır ve kullanıcıya "buluttaki eski kayıt geri yüklenmedi" bilgisi verilir. Damga yalnız zaman tutar (kişisel veri yok), çıkışta silinmez.

Ek olarak sıfırlama artık buluta **hemen** yazılır (1,5 sn'lik gecikmeye bırakılmaz) — çıkış yapılsa bile bulut boş kalır.

### 3.2 "Bilgileri Kaydet" → pencere kapanır, çekim görünür

- Kaydet → **profil penceresi kapanır** → "Kaydedildi — şimdi Okulizyon'da aranıyor…" bildirimi görünür → çekim başlar.
- İl/ilçe/okul **kodu eksikse** pencere **açık kalır** (kullanıcı listeden seçmek zorunda), sebebi yazılır.
- **"Şimdi dene"** de pencereyi kapatır ve Denemelerim'de kalır.
- Çekim bitince ekran **kendiliğinden tazelenir** (Denemelerim listesi, yeşil şerit, profil durum satırı).

### 3.3 Bildirim her zaman üstte

`#toast-container` → **z-index 10050** (pencereler 9997–9999). Bildirim artık pencerenin **üstünde** çizilir.

### 3.4 Denemelerim'de açık yol

Veriler silinmişse Denemelerim'in üstünde mavi kart: **"Denemelerin silinmiş durumda — uygulama kendi kendine geri getirmez"** + tek düğme **"Okulizyon'dan çek"**. Kullanıcı ne olduğunu görür, isterse tek dokunuşla geri alır.

---

## 4. Ölçüm / test

| Test | Sonuç |
|---|---|
| `npm run test:v88` (yeni) | **39/39 ✓** |
| `npm run test:hepsi` | **EXIT 0**, `✗` sayısı **0** |
| `node --check site/app-pwa.js` · `site/sw.js` | OK |
| `sw-liste` (SW dosya listesi) | OK |

Yeni test `tests/v88-okz-sifirla.test.js` şunları kilitler: damga kararı (yeni/eski/bozuk), sıfırlamada bayrak+damga+anında bulut yazımı, otomatik çekimin durması, "Şimdi dene"nin durdurmayı kaldırması, girişte bulut geri yüklemesinin engellenmesi, Denemelerim kartı, kaydet→kapat→çekim sırası ve bildirim katmanının pencerelerin üstünde olması.

---

## 5. Yayın

- Commit: **`fc3a0af`** → `arena/cc4de070-analiz-merkezi`
- Vercel: **`dpl_HQqhq8Mf8XLWzDi3H5CQ7F9m9Jo9`** (production, sha `fc3a0af`)
- Sürüm damgası: `PWA_SURUM = "v88-silinen-geri-gelmez"` · `CACHE = "analiz-merkezi-v-20261027-v88-silinen-geri-gelmez"`

---

## 6. Kullanıcı nasıl dener

1. Telefonda uygulamayı **kapat-aç** (yeni sürüm insin), alt bilgide **v88-silinen-geri-gelmez** yazdığını gör.
2. Profil → Okulizyon bilgilerini gir → **Bilgileri Kaydet**:
   - pencere **kapanmalı**,
   - üstte "Kaydedildi — şimdi Okulizyon'da aranıyor…" bildirimi **görünmeli**,
   - Denemelerim'e dönünce deneme **kendiliğinden** gelmeli.
3. **Tüm verileri sil** → çıkış yap → tekrar giriş yap:
   - deneme **geri GELMEMELİ**,
   - Denemelerim'de "Denemelerin silinmiş durumda" kartı görünmeli.
4. İstersen **"Okulizyon'dan çek"** → deneme yeniden gelmeli (bu bilinçli izin).

---

## 7. Notlar

- Silme kararı **hesap bazında** tutulur; bir hesabı sıfırlamak diğerini etkilemez.
- "Şimdi dene" eski davranışı korur: sunucudaki tüm sonuçları yeniden içe alır (mükerrer deneme oluşturmaz, aynı sınav anahtarı güncellenir).
- Kapsam dışı bırakılanlar: bildirim zamanlaması (v87'de kapandı), soru üretimi, ölçütler (P_L0 / P_G / P_S) — bunlara dokunulmadı.
