# Analiz Merkezi PWA Projesi

Bu proje `analiz-merkezi-pwa (3).zip` dosyasından çıkarılan PWA uygulamasıdır.

## Proje Yapısı

### Kök Dosyalar
- **app-pwa.js** - PWA uygulaması ve Service Worker
- **firebase-config.js** - Firebase bağlantı ayarları
- **build_pwa.py** - PWA derleme script'i
- **firebase.json** - Firebase hosting konfigürasyonu
- **.firebaserc** - Firebase project konfigürasyonu

### Cloud Functions (`functions/`)
- **index.js** - Cloud Functions entry point
- **bildirim-gonder.js** - Bildirim gönderme işlemleri
- **bildirim-logic.js** - Bildirim kuralları ve lojik
- **degisiklik-kontrol.js** - Veri değişikliklerini izleme
- **okul-sitesi.js** - Okul web sitesi işlemleri
- **okulizyon-cek.js** - Okulizyon veri çekimi
- **konular.js** - Konu yönetimi
- **package.json** - Node.js bağımlılıkları

### GitHub Actions
- **.github/workflows/bildirim.yml** - Bildirim otomasyonu

### Ikon Dosyaları
- **icons/icon-192.png** - PWA ikon (192x192)
- **icons/icon-512.png** - PWA ikon (512x512)

## 10. Sınıf Deneme Formatı

10. sınıf denemesi sınıf seçimine göre 120 soru ve 135 dakika olarak açılır:
TDE 30; Tarih 10; Coğrafya 10; Felsefe 5; Din Kültürü 5; Matematik 30;
Fizik, Kimya ve Biyoloji 10'ar soru. Yayınlar arasında küçük alt dağılım farkları olabilir.
MEB ortak yazılısı bu genel deneme formatından ayrıdır.

## Soru Havuzlarının Eklenmesi

Soru havuzları `content/soru_havuzlari/{konu_id}.json` altında tutulur. Konu başına en az 10 soru,
alt beceri başına en az 2 soru, dört seçenek ve zorunlu `cozum` alanı gerekir.
Yeni havuz ekledikten sonra kök dizinde `npm run validate:pools` çalıştırılmalıdır.
Havuz bulunmayan konular bozulmuş modda mevcut deneme verisiyle çalışmaya devam eder.
İlişki grafı `content/iliski_grafi.json` olarak açılışta doğrulanır.

## Kurulum

```bash
npm install
npm run validate:pools
firebase deploy
```

## Kullanım

PWA uygulaması Firebase Hosting üzerinde çalışmakta olup:
- Offline mod desteği
- Push bildirimleri
- Otomatik güncelleme

---
*Bu dosyalar zip arşivinden tek tek çıkarılıp yüklenmiştir.*