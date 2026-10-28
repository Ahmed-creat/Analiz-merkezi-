# v35.7 — Değişiklik Raporu (2026-10-28)

Bu rapor, kullanıcı bildirimlerinin **kök nedenini**, yapılan **her kod değişikliğini** ve
testlerin **neyi gerçekten kanıtladığını** yazar. Süsleme yok; yapılmayanlar da burada.

---

## 1) Bulunan asıl kök neden: v35.6'daki blok hiç çalışmadı

`site/index.html` içine konan BKT motoru kopyasında **fazladan bir `)`** vardı.
Tarayıcı bir `<script>` bloğunda sözdizimi hatası görürse **o bloğun tamamını atar**.
Sonuç: v35.6'da eklenen "5 soru / tek tek gösterim / sonuç ekranı" kodunun **hiçbiri
çalışmadı**. Sayfada yalnız eski motor (`site/bkt-engine.js`, 3 soru, tüm sorular tek
ekranda) çalıştı ve yeni API'nin üzerine yazdı.

Kanıt (düzeltmeden önce):

```
$ node -e 'new (require("vm").Script)(index.html içindeki 3. inline blok)'
SyntaxError: Unexpected token ')'   (~satır 5998)
```

Neden testler yakalamadı: o testler `index.html` içinde **metin arıyordu** ("5 soru"
geçiyor mu). Metin vardı — kod çalışmıyordu. Bu yüzden "40/40 geçti" yanıltıcıydı.

**Düzeltme:** motor artık tek yerde: `site/bkt-engine.js`. `index.html`'deki 1.099
satırlık kopya silindi. `tests/kaynak-sozdizimi.test.js` bundan sonra sayfadaki **her
inline script'i ve yüklenen her .js dosyasını gerçekten derliyor** — bu hata bir daha
sessizce geçemez.

---

## 2) Kullanıcı bildirimleri → yapılanlar

### a) "Sadece 5 soru yazmışsın ama hâlâ 3 ve tek tek gösterilmiyor"
- Kısa Kontrol **her modda 5 soru** (`MINI_SORU = 5`, `precheck` için ayrı sayı yok).
- Sorular **tek tek**: modalda aynı anda tek soru, "Soru 1 / 5" sayacı, Geri / İleri /
  Testi Bitir. (Eski hâli: 5 soru alt alta tek sayfada.)
- Sonuç ekranı **kendiliğinden kapanmıyor**; "Kapat" ile çıkılıyor. (Eski hâli:
  1,3 saniye sonra kapanıyordu, öğrenci skoru göremiyordu.)

### b) "Neden bir konuda diğer konulardan da 5 soru var"
Kök neden: havuz eşleme **tahminle** yapılıyordu.
- Eski `resolvePoolId`: `topic_key` tutmazsa **aynı dersteki** herhangi bir havuzu başlık
  benzerliğiyle bağlıyor, sonra `__okzKonuPoolEsle` tahminine düşüyordu.
- `havuz-bul.js` (HB.bul) 4. ve 5. adımları **kelime kapsama** ve **etiket kesişimi** ile
  başka konunun havuzunu seçebiliyordu.
- Ayrıca kayıtta eski sürümden kalmış **yanlış `pool_id`** hiç doğrulanmıyordu.

Yeni davranış (`havuzEsle` + `havuzDogrula`):
1. `topic_key` **birebir** aynı → kabul.
2. Aynı ders + konu **başlığı birebir** aynı → kabul.
3. Başka hiçbir durum → **havuz yok**. Test açılmaz, uyarı yazılır, **başka konunun
   sorusu gösterilmez**.
4. Kayıtlı `pool_id` manifestten doğrulanır; bu konuya ait değilse **yok sayılır**.
5. `openMiniTest` içinde son kapı: yüklenen havuzun `konu_id`'si bu konunun birebir
   havuzu değilse modal **açılmaz**.

Gerçek veriyle doğrulama (`tests/kisa-kontrol.test.js §7`): müfredattaki **339 konu**
tarandı; eşleşen **178** havuzun tamamı birebir. Tek "numara farkı" eşleşmesi (9. sınıf
"Din Kültürü > 1.4 ..." → 10. sınıf "1.3 ..." havuzu) bu yüzden **kaldırıldı**; o konu
artık "havuz yok" diyor.

### c) "3. aşamada yapamadığın soruların çözümünü izle adımını KALDIR"
- `ROADMAP_STEPS` içindeki adım **silindi** (5 adım → 4 adım).
- Ona bağlı `videoAdimHtml()` üreteci ve `if (st.video)` çizimi **silindi**.
- Dersin tüm yanlış konularını listeleyen bölüm artık **hiç basılmıyor**.
- Uygulamanın geri kalan akışı değişmedi (adımlar sıralı kilit, "Tamamla", "Konuyu
  Tamamlandı Olarak İşaretle" aynı).

### d) "Test bildirimi gelmiyor"
- Ayarlar'daki **"Test bildirimi gönder" düğmesi kaldırıldı**.
- v35.6'da eklenen **tanılama paneli (✓/✗ listesi) kaldırıldı**; yerine tek cümlelik
  durum satırı var.
- **İzin verildiği anda** `push-bildirim.js` içinde **bir kez** deneme bildirimi
  gönderiliyor (`testBirKez`); cihazda `am_push_test_gonderildi` işareti tutulur, ikinci
  kez gönderilmez. İzin daha önce verilmişse `otomatik()` bir kez gönderir.
- İzin reddedilirse **gönderilmez**.

### e) "Konuyu çalıştıktan sonra sadece o konudan 5 soru çözülsün"
- Konu tamamlanınca `miniKontrolBaslat(key)` 5 soruluk kontrolü **kendiliğinden** açar
  (havuz o konuya birebir bağlıysa).
- Havuz yoksa artık **sessiz kalmıyor**: "Bu konu için soru havuzu yok — başka konunun
  soruları gösterilmez" kartı basılıyor (Konu Takibi ve Öğrenme Durumu paneli).

---

## 3) Değişen dosyalar

| Dosya | Ne değişti |
|---|---|
| `site/bkt-engine.js` | Tek motor hâline geldi (index.html'deki yeni kopya buraya taşındı ve parantez hatası düzeltildi). 5 soru, tek tek sihirbaz, kapanmayan sonuç, `havuzEsle`/`havuzDogrula`/`havuzIdCoz`, sonuç ekranında görsel, havuz doğrulamasında görsel denetimi, aciliyet sıralaması, `window.__bktUiTazele` köprüsü. |
| `site/index.html` | 1.099 satırlık bozuk motor kopyası **silindi**; video çözüm adımı ve `videoAdimHtml` **silindi**; `havuzIdCoz(topicKey, kayitli)` doğrulamalı köprü; "soru havuzu yok" açıklama kartı; bildirim test düğmesi + tanılama paneli **silindi**. |
| `site/push-bildirim.js` | `testBirKez()`: izin verildiği an tek seferlik deneme bildirimi; `izinIste` ve `otomatik` buna bağlandı. |
| `site/app-pwa.js` | Sürüm damgası `v35.7-kisa-kontrol-tek-motor`. |
| `site/sw.js` | Önbellek adı `analiz-merkezi-v-20261028-v35-7-kisa-kontrol-tek-motor`. |
| `package.json` | `test:davranis` eklendi, `test:hepsi` içine alındı. |
| `tests/*` | Eski davranışı doğrulayan iddialar düzeltildi; 3 yeni davranış testi eklendi (aşağıda). |

---

## 4) Testler: ne kanıtlıyor?

Toplam **17 test dosyası**, ~**720 tek tek kontrol**; hepsi `npm run test:hepsi` içinde.

Yeni testler:

1. **`tests/kisa-kontrol.test.js` (44 kontrol)** — motoru sahte DOM'da **çalıştırır**:
   - Kısa Kontrol **5 soru** (3 değil), hepsi tıklanan konunun havuzundan.
   - Ekranda **aynı anda tek soru** (4 seçenek = 1 soru; 5 soru olsa 20 olurdu).
   - Cevapsız "İleri" engellenir; cevap verince 2/5'e geçer.
   - Bitişte neden ekranı → sonuç ekranı; **1,5 saniye sonra hâlâ açık**.
   - Kayıtta **yanlış `pool_id`** varsa doğrusu kullanılır.
   - Havuzu olmayan konuda **modal açılmaz** (başka konunun sorusu gelmez).
   - Gerçek `index.json` + gerçek müfredat: **339 konu, 0 yanlış eşleşme**.
2. **`tests/kaynak-sozdizimi.test.js` (35 kontrol)** — sayfadaki **her inline script** ve
   yüklenen **her .js** gerçekten derleniyor; index.html'de **ikinci motor yok**;
   "3 soru" kalıntısı yok; sonuç otomatik kapanmıyor.
3. **`tests/bildirim-otomatik.test.js` (20 kontrol)** — izin verilince **1** deneme
   bildirimi, ikinci kez **0**, izin reddinde **0**; Ayarlar'da test düğmesi/paneli yok.

Güncellenen testler: `bkt-panel` (23), `gorsel-video` (57), `konu-bulma` (72),
`kok-eksik` (46) — artık motoru `site/bkt-engine.js` üzerinden okuyor.

---

## 5) Google ile giriş — dürüst durum

Kod tarafı tamam: giriş modalında **görünür** "Google ile devam et" düğmesi
(`data-act="pwaAuthGoogle"`), `signInWithOAuth({provider:"google"})`, sağlayıcı
kapalıysa **ham hata yerine** Türkçe açıklama, `redirectTo` alanı.

Eksik olan tek şey **sunucu tarafı** ve bu adımı yalnız proje sahibi yapabilir:
Supabase → Authentication → Providers → Google: **Client ID + Secret**.

Kanıt (bu turda canlıdan alındı):
`https://ztgzmhfklsdlngrtennp.supabase.co/auth/v1/settings`
→ `"external": { ... "google": false ... }`

Yani Google girişi **şu anda çalışmıyor**; düğme "bu projede açık değil" diyor.
Açmak için: Google Cloud → OAuth client (Web) → yetkili yönlendirme
`https://ztgzmhfklsdlngrtennp.supabase.co/auth/v1/callback` → Supabase'e ID/Secret.

---

## 6) Bilinen sınırlar (gizlenmiyor)

- **178/339** müfredat konusunun birebir havuzu var. Kalanında uygulama "havuz yok"
  diyor; **başka konunun sorusunu göstermiyor** (kullanıcı isteği böyleydi).
- Manifestte bir konu iki havuzda geçiyor: `Din Kültürü > 4.3 Medine Dönemi`
  (`din_10_u04_k03`, `din_10_u05_k01`). İlk kayıt kullanılır; ikisi de aynı konu.
- Bildirim: izin + abonelik + VAPID olmadan uygulama kapalıyken bildirim **gelmez**;
  iPhone'da yalnız "Ana Ekrana Ekle" ile kuruluysa çalışır (Apple kuralı).
- `soruCozumDetay()` fonksiyonu kodda duruyor ama artık **hiçbir düğme onu açmıyor**
  (video adımıyla birlikte girişi kaldı).

---

## 7) Yayın

- Commit: `2b9e3da` (branch `arena/cc4de070-analiz-merkezi`)
- Vercel: `dpl_8WnSP6JY3DqYhx4zEQxmjDNJrLNy` → **READY / PROMOTED**, alias
  `analiz-merkezi.vercel.app`, build 4,7 sn.
- Canlıdan doğrulandı: `bkt-engine.js` (v35.7 başlığı, `MINI_SORU`, `havuzEsle`),
  `sw.js` önbellek adı `analiz-merkezi-v-20261028-v35-7-kisa-kontrol-tek-motor`,
  `push-bildirim.js` (`testBirKez`, izin sonrası otomatik deneme bildirimi).
- Telefonda eski sürüm görünürse: uygulamayı kapat-aç ya da Ayarlar → site verilerini
  yenile. Service worker ağ-öncelikli olduğu için çevrimiçiyken güncel dosya gelir.
