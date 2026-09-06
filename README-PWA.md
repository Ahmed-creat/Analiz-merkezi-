# ANALİZ MERKEZİ — PWA + Firebase Kurulum Rehberi

Bu klasör, uygulamayı **telefona yüklenebilir PWA** yapan ve **Google girişi + bulut yedek + push bildirim** ekleyen yayınlama paketidir.

## Ne hazırlanmış durumda (bana düşen — tamamlandı)
- `index.html` — uygulamanın tamamı + PWA bağlantıları (build_pwa.py ile üretilir)
- `manifest.json` — uygulama adı, ikonlar, bağımsız pencere (standalone), tema rengi
- `sw.js` — service worker: offline çalışma (uygulama kabuğu önbelleği)
- `app-pwa.js` — Google ile giriş, Firestore bulut yedek (her kayıtta otomatik, 4 sn beklemeyle), FCM bildirimleri, giriş butonları
- `firebase-config.js` — **senin dolduracağın** yapılandırma şablonu
- `firebase-messaging-sw.js` — uygulama kapalıyken bildirim service worker'ı
- `icons/` — 192/512 + maskable ikonlar
- Uygulama, yapılandırma boşken de **tam işlevsel** çalışır (offline-first; her şey isteğe bağlı katman).

## SANA DÜŞENLER (sırayla)

### 1) Firebase projesi aç (ücretsiz)
1. https://console.firebase.google.com → **Proje ekle** (ör. "analiz-merkezi")
2. Google Analytics isteğe bağlı — atlayabilirsin.

### 2) Kimlik doğrulamayı aç (E-posta/Şifre + isteğe bağlı Google)
1. Sol menü → **Build → Authentication** → **Get started**
2. **Sign-in method** sekmesi → **Email/Password** → **Enable** → Save *(asıl yöntemimiz)*
3. (İsteğe bağlı) **Google** → Enable → proje e-postanı seç → Save

> Uygulamadaki giriş ekranı: e-posta + şifre ile **Giriş Yap / Yeni Kayıt Oluştur / Şifremi unuttum** + Google butonu. Kayıt olmak için uygulamada formu doldurman yeterli — Console'dan kullanıcı eklemek gerekmez.

### 3) Firestore veritabanını aç
1. **Build → Firestore Database** → **Create database**
2. Konum: `europe-west` (eur3) → **Production mode** → Enable
3. **Rules** sekmesine geç, şu kuralları yapıştır → **Publish** (yalnızca kendi verini okuyabilirsin):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{doc=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

### 4) Web API Key'i firebase-config.js'e yapıştır
- Config'in büyük kısmı ZATEN dolu (proje: analiz-merkezi-87338, appId: 1:962539397686:web:b69803732167321778ae97)
- ⚙️ **Project settings → General → Web API Key** değerini kopyala → `firebase-config.js` içindeki `apiKey: ""` alanına yapıştır
- (Sıfırdan almak istersen: **Project settings → General → Your apps → </>** → config'i kopyala)

### 5) Push bildirim anahtarı (VAPID)
1. **Build → Cloud Messaging** → **Web Push certificates → Generate key pair**
2. çıkan **ortak anahtarı** `FCM_VAPID_KEY`'e yapıştır
3. `build_pwa.py`'i tekrar çalıştır (messaging service worker'a config işlenir): `python3 build_pwa.py`

### 6) Yayınlama (HTTPS zorunlu — Firebase Hosting)
Klasörde `firebase.json` + `.firebaserc` hazır (proje: analiz-merkezi-87338), `firebase init` GEREKMEZ:
```bash
npm install -g firebase-tools   # CLI aracı (SDK değil — SDK CDN'den otomatik gelir)
firebase login                  # Google hesabıyla gir
firebase deploy                 # klasörün içindeyken çalıştır
```
Yayınlanan adrese telefon Chrome ile gir → **menü → "Uygulamayı yükle"** → Analiz Merkezi artık bir uygulama.
(Alternatif: Netlify / Vercel / GitHub Pages — klasörü sürükle-bırak yeterli.)
Not: deploy'dan sonra `firebase-tools` "aliases" isterse `firebase use --add` ile analiz-merkezi-87338'i seç.

### 7) Test
- Uygulamada yan menüde **"Google ile Giriş Yap"** → hesabını seç
- Veri gir (deneme/konu) → 4 sn içinde buluta yazılır (butonda "✓ bulutta" yazar)
- Başka cihaz/tarayıcıda aynı hesapla gir → bulut kaydın geri yüklenir (yerelde veri varsa sorar)
- Bildirim izni ver → FCM'den test mesajı gönder (Console → Cloud Messaging → Send your first message)

## UYGULAMA KAPALIYKEN BİLDİRİM — ÜCRETSİZ YOL (GitHub Actions) 🔔
**Blaze planı GEREKMEZ.** Bildirimleri saatleyen sunucu yerine, GitHub Actions'ın ücretsiz sunucusu kullanılır (günde 2 kez × ~2 dk ≈ ayda 124 dk; ücretsiz kota 2000 dk/ay). FCM push'un kendisi zaten her zaman ücretsizdir.

**Değişiklik gözcüsü:** iş akışı her **30 dakikada** sayfaları hafifçe kontrol eder (anlamsal karma — dönen tarih/sayaçlar sahte alarm üretmez). Değişiklik yoksa saniyeler içinde biter; **değişiklik olduğu AN**: tam çekim otomatik çalışır + **anında push** gelir ("🎓 Okulizyon'da yeni sonuç!" / "🏫 Okulundan yeni duyuru"). Böylece sabahı beklemeden, sonuç yayımlandığı yarım saat içinde haberdar olursun. (Gerçek "anlık" mümkün değil — site değişimi bildirmez; en yakın ücretsiz çözüm bu. Daha sık kontrol istersen depoyu public yap: Actions sınırsız.)

**Push seti** (07:30 tam set · 19:30 kritikler — mantık uygulamayla birebir, 8/8 test edildi):
koç selamı (ritim + geri sayım) · Tekrar Zamanı Geldi (3-7-14-21-28. gün) · ACİL Çalışılacaklar (öncelik formülü) · ACİL: X unutulmak üzere (hafıza <%20) · Unutma İndeksi · okul sınavı arifesi/günü · deneme 7/3/1 gün · Bugünün Planı özeti. Aynı bildirim aynı gün iki kez gitmez; bildirime tıklayınca uygulama açılır.

**Kurulum (bir kere, ~5 dk):**
1. **VAPID anahtarı** (hâlâ yoksa): Console → Cloud Messaging → Web Push → Generate key pair → `firebase-config.js` → `FCM_VAPID_KEY` → `python3 build_pwa.py`
2. Bu klasörü **özel (private) bir GitHub deposuna** yükle (github.com → New repository → Private → dosyaları yükle)
3. Firebase Console → ⚙️ **Project settings → Service accounts → Generate new private key** → inen `serviceAccountKey.json` dosyasını aç
4. GitHub → depo → **Settings → Secrets and variables → Actions → New repository secret** → Ad: `FIREBASE_SERVICE_ACCOUNT` → Değer: json'un TAM içeriğini yapıştır → Add secret
5. GitHub → **Actions** sekmesi → "Bildirim Motoru"nu etkinleştir → (test) **Run workflow** → loglarda "✓ kullanıcı ← Bildirim" satırlarını gör
6. Siteyi yayıla + telefonda PWA yükle + bildirim izni ver + giriş yap → sabah 07:30'da ilk bildirim gelir

### Alternatifler
- **Cloud Functions (Blaze):** `functions/index.js` de hazır — Blaze'e geçersen `firebase deploy --only functions` ile aynı işi yapar. Gerek yok, sadece seçenek.
- **OneSignal:** ücretsiz (10k aboneye kadar) ama yalnızz DAĞITIM servisi — hangi bildirimin gerektiğine karar veremez, yine bir zamanlayıcı gerekir. Ayrıca uygulamaya ikinci SDK + kendi service worker'ı demek. Aynı zamanlayıcıya ihtiyaç duyduğundan avantajı yok; bu yüzden FCM + GitHub Actions tercih edildi. (Israrla istenirse taşıma yapılabilir.)

## OKULIZYON + OKUL SİTESİ ENTEGRASYONU 🎓
**Akış:** Uygulamada yan menü → "Okulizyon Bağlantısı" → ad/okul no/ilçe/okul yaz → kaydet. Her sabah **07:00** GitHub Actions (`.github/workflows/okul-cekim.yml`) siteye girer, sonuçları **deterministik Cheerio koduyla** (yapay zekâ YOK) ayıklar, Firestore'a kuyruklar. Uygulamayı açınca sorular **"Analiz Bekliyor"** listesine düşer → sen sadece her soruya **neden** seçersin (Dikkat hatası / Bilgi eksikliği…) → "Kaydet" → normal deneme olarak işlenir, öncelik listesine girer. Okul sitesinin duyuruları + sınav tarihleri de aynı turla çekilir; ders programı yalnızca görsel/PDF ise **Gemini Vision** ile JSON'a çevrilir (GEMINI_API_KEY secret'ı).

**Etkinleştirmek için bakan gerekenler (functions/ dosyalarında):**
- `okulizyon-cek.js` → `OKULIZYON_CFG`: okulunuzun Okulizyon **giriş adresi** + form alan adları (+ varsa sonuç sayfası yolu)
- `okul-sitesi.js` → `OKUL_SITESI.url`: okul sitesi adresi
- API anahtarı GEREKMEZ (OCR kütüphanesi kullanılıyor)
- Doğru seçicileri kesinleştirmek için: Okulizyon sonuç sayfası açıkken **Ctrl+S** ile kaydedip o HTML'i geliştiriciye ver (seçiciler birebir oturtulur — ayrıştırma zaten başlık-isimli sütun eşleme yöntemiyle şablon değişimlerine dayanıklı).

## Sık sorulan## OKULIZYON + OKUL SİTESİ ENTEGRASYONU 🎓
**Akış:** Uygulamada yan menü → "Okulizyon Bağlantısı" → ad/okul no/ilçe/okul yaz → kaydet. Her sabah **07:00** GitHub Actions (`.github/workflows/okul-cekim.yml`) siteye girer, sonuçları **deterministik Cheerio koduyla** (yapay zekâ YOK) ayıklar, Firestore'a kuyruklar. Uygulamayı açınca sorular **"Analiz Bekliyor"** listesine düşer → sen sadece her soruya **neden** seçersin (Dikkat hatası / Bilgi eksikliği…) → "Kaydet" → normal deneme olarak işlenir, öncelik listesine girer. Okul sitesinin duyuruları + sınav tarihleri de aynı turla çekilir; ders programı yalnızca görsel/PDF ise **Gemini Vision** ile JSON'a çevrilir (GEMINI_API_KEY secret'ı).

**Etkinleştirmek için bakan gerekenler (functions/ dosyalarında):**
- `okulizyon-cek.js` → `OKULIZYON_CFG`: okulunuzun Okulizyon **giriş adresi** + form alan adları (+ varsa sonuç sayfası yolu)
- `okul-sitesi.js` → `OKUL_SITESI.url`: okul sitesi adresi
- API anahtarı GEREKMEZ (OCR kütüphanesi kullanılıyor)
- Doğru seçicileri kesinleştirmek için: Okulizyon sonuç sayfası açıkken **Ctrl+S** ile kaydedip o HTML'i geliştiriciye ver (seçiciler birebir oturtulur — ayrıştırma zaten başlık-isimli sütun eşleme yöntemiyle şablon değişimlerine dayanıklı).

## Sık sorulan
- **Bildirimler telefon kilideyken geliyor mu?** Evet — FCM + `firebase-messaging-sw.js` arka plan bildirimi işler (config doldurulduysa).
- **İnternet yoksa?** Uygulama tam çalışır; bulut senkronu ve giriş devre dışı kalır, veriler cihazda (localStorage) durur.
- **Verilerim nerede?** Kendi Firebase projende, sadece senin uid'ine kilitli (yukarıdaki kurallar). Kimse başkasının verisini okuyamaz.
- Kaynak kodu değiştirirsen: `analiz-merkezi-gelismui` içinde düzenle → `python3 analiz-merkezi-pwa/build_pwa.py` → yeni `index.html` hazır.
