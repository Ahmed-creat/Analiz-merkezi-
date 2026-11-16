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

## Kurulum

```bash
npm install
firebase deploy
```

## Kullanım

PWA uygulaması Firebase Hosting üzerinde çalışmakta olup:
- Offline mod desteği
- Push bildirimleri
- Otomatik güncelleme

---
*Bu dosyalar zip arşivinden tek tek çıkarılıp yüklenmiştir.*