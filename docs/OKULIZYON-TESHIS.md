# Okulizyon sınav sonucu çekimi — teşhis raporu (28.10.2026)

## Kısa cevap

Çekim çalışmıyor, çünkü **çekim servisi ile uygulama birbirine hiç bağlı değil**:

- Kazıyıcı (`okulizyon-cek.js`) sonuçları **Firebase/Firestore**'a yazıyor.
- Uygulama (`site/app-pwa.js`) sonuçları **Supabase**'den okuyor.
- Üstelik kazıyıcı, kullanıcının girdiği Okulizyon bilgilerini (ad, okul no, sınıf, il/ilçe, okul) **Firestore**'dan okuyor; uygulama ise bu bilgileri **Supabase `app_states`** tablosuna yazıyor.

Yani iki taraf hiçbir zaman aynı veriyi görmedi. Ek olarak uygulama tarafında kuyruğu okuyan fonksiyon girişten sonra hiç çağrılmıyordu.

## Kanıtlar

| # | Kanıt | Yer |
| --- | --- | --- |
| 1 | Uygulama yalnızca Supabase'den okuyor: `sb.from("okulizyon_kuyrugu")`, `sb.from("okul_duyurulari")` | `site/app-pwa.js` → `okzKuyrukCek()` |
| 2 | Tek kazıyıcı Firestore'a yazıyor: `userRef.collection("okulizyon").doc("queue").set(queue)` | `okulizyon-cek.js` satır ~96 |
| 3 | Kazıyıcı girdiyi Firestore'dan okuyor: `userRef.collection("state").doc("main")` | `okulizyon-cek.js` satır ~55 |
| 4 | Okul duyuruları da Firestore'a yazılıyor (`okul/duyurular`), Supabase'e yazan betik **yok** | `okul-sitesi.js` |
| 5 | Supabase durumu: `okulizyon_kuyrugu` **0**, `okul_duyurulari` **0**, `app_states` **0**, `auth.users` **0** | canlı sorgu, 28.10.2026 |
| 6 | `okzKuyrukCek()` yalnızca `window.addEventListener("online", …)` ile bağlıydı — giriş sonrası / sayfa açılışında çağrılmıyordu | `site/app-pwa.js` |
| 7 | Hatalar `console.warn` ile yutuluyordu; kullanıcı hiçbir şey görmüyordu | `site/app-pwa.js` |

## Bozuk zincir (özet)

```
kullanıcı bilgi girer
      → Supabase app_states        (uygulama buraya yazıyor)
      → kazıyıcı Firestore'da arar  (bilgi-yok)
      → sonuç Firestore'a yazılır   (uygulama orayı hiç okumuyor)
      → uygulama Supabase'de okur   (0 satır)
      → sessiz başarısızlık
```

Ayrıca kimse Supabase'e giriş yapmadığı için (`auth.users` = 0) uygulama tarafındaki okuma yolu RLS gereği zaten `giris-yok` durumunda kalıyor.

## Bu yöntem gerçekten işe yarıyor mu?

**Fikir doğru, kurulum eksik.**

- Okulizyon'un herkese açık bir API'si yok. Sonuçlar öğrenci no + ad soyad + sınıf + il/ilçe/kurum ile girilen bir panelde duruyor. Bu yüzden **tek teknik yol tarayıcı otomasyonu** (Playwright + gerçek tarayıcı). `okulizyon-cek.js` bunu doğru kurguluyor: giriş yap → sınav listesini indir → her sınav sayfasını ayrıştır (`okulizyon-parser.js`, deterministik Cheerio).
- Ancak yöntem **kırılgan**: site HTML'i/id'leri değişince durur, okul sonuçları yayınlamadıysa boş döner, her kullanıcı için ~10–60 sn tarayıcı gerekir, günde 1 kez çalışır ve resmî API/izin olmadığı için kullanım şartları açısından risk taşır.
- **Bugünkü haliyle çalışması imkânsız** (madde 1–7). Çalışması için üç şey şart:
  1. Kazıyıcı bilgiyi **Supabase `app_states`**'ten okumalı (Firestore değil).
  2. Kazıyıcı sonucu **Supabase `okulizyon_kuyrugu`**'ya yazmalı — bu yazma `service_role` anahtarıyla, GitHub Actions'ta **`SUPABASE_SERVICE_ROLE_KEY`** secret'ı olarak yapılmalı (RLS `authenticated` istiyor).
  3. Uygulama girişten sonra kuyruğu çekmeli (v34.3'te eklendi) ve durumu göstermeli (v34.3'te eklendi).

## Alternatif (daha güvenilir)

Kazıyıcı yerine **elle/CSV içe aktarma**: öğrenci Okulizyon ekranından sonuç tablosunu kopyalayıp yapıştırır, uygulama aynı `okulizyon_kuyrugu` biçimine dönüştürüp "Analiz Bekliyor" kuyruğuna atar. Kırılganlık ve üçüncü taraf bağımlılığı sıfırlanır; otomasyon istenirse sonradan eklenir.

## v34.3 ile gelenler (bugünkü değişiklik)

- Profil etiketi sadeleşti: yalnız **Profil** (yan menü + mobil alt menü; başka giriş noktası yok).
- Profil → Okulizyon bölümünde **"Son çekim"** satırı: zaman + sebep (giriş yok / tablo boş / sunucu hatası / başarılı).
- **"Şimdi dene"** butonu: elle dener ve sonucu yazar.
- Giriş yapıldığı anda ve Profil her açıldığında (5 dk sınırıyla) kuyruk otomatik sorgulanır — eskiden yalnız "internet geri geldi" olayında deneniyordu.
