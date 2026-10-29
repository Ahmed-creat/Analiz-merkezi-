# v36 — Rapor (depolama hatası · flashcard · bildirim · takvim)

Tarih: 29.10.2026 · Sürüm: `PWA_SURUM = "v36-ajanda-kart"`,
`sw.js` önbellek `analiz-merkezi-v-20261029-v36-ajanda-kart`.

Bu raporda her iddianın yanında onu üreten ölçüm vardır.

---

## 1) "Veri kaydedilmedi, depolama dolu olabilir" — KÖK NEDEN BULUNDU

### Ölçüm (Supabase `app_states`, 29.10.2026 — sizin hesabınız)

| Ölçüm | Değer |
|---|---|
| Toplam kayıt | **5.868.448 bayt** (5,6 MB) |
| `bkt_state` | 5.820.607 bayt (%99) |
| `Matematik > 1.3 Üçgende Alan` | 668.497 bayt |
| ↳ `hata_gecmisi` | **7.680 kayıt / 668.160 bayt** |

### Neden oldu

Motorda sınır var (`hata_gecmisi` 100'de kesilir). Şişme motorda değil,
**bulut birleştirmede** oldu:

```js
// ÖNCE (veri-birlestir.js ve app-pwa.js — iki ayrı yerde aynı hata)
cikti.hata_gecmisi = dizi(a.hata_gecmisi).concat(dizi(b.hata_gecmisi));
```

Her girişte iki tarafın dizileri **koşulsuz** birleşiyordu: 100 → 200 → 400 …
→ **7.680**. Chrome'un `localStorage` kotası ~5 MB olduğu için yazma
`QuotaExceededError` atıyor, uygulama da "depolama dolu olabilir" diyordu.
Yani hata mesajı doğruydu; suçlu depolama değil, büyüyen veriydi.

### Düzeltmeler

| Dosya | Değişiklik |
|---|---|
| `site/veri-sikistir.js` (YENİ) | mükerrer kayıtları tekilleştirir, sınırsız dizileri sınırlar; açılışta + kota dolunca çalışır |
| `site/veri-birlestir.js` | `bktBirlestir` artık `tekilKirp(…, 40)` kullanıyor |
| `site/app-pwa.js` | `okzbktBirlestir` aynı kuralı kullanıyor; bulut birleştirmesinden hemen sonra sıkıştırma |
| `site/bkt-engine.js` | `hata_gecmisi` sınırı 100 → **40**; onayda üretilen kart 10 → **8** (rapor §5.1) |
| `site/index.html` | `saveState()` kota dolarsa otomatik acil sıkıştırıp yeniden dener; olmazsa gerçek boyutu söyler |

### Canlı veri de temizlendi (yedek alınarak)

- Yedek: `public.app_states_yedek_20261029` (3 satır, 5.799 KB).
- Sıkıştırma: konu başına `hata_gecmisi` son 40 kayda indirildi.
- Sonuç: **5.868.448 → 126.056 bayt (46× küçük)**. `L`, `gözlem_sayisi`,
  `onay_durumu`, `pool_id` **değişmedi** (kontrol edildi).

### Kanıt testi — `tests/veri-sikistir.test.js` 23/23

Aynı vaka yeniden üretildi (40 konu × 7.680 kayıt): **25,31 MB → 212 KB
(122× küçük)**, hiçbir gerçek kayıt kaybolmadı, ikinci çalıştırma idempotent,
sıkıştırılmış kayıt 5 MB `localStorage` kotasına sığdı.

---

## 2) "Flashcard ile testin görevleri farklıydı, ikisi aynı yerde olamaz"

Ayrıldı. Artık iki ayrı bölüm ve iki ayrı giriş:

| | Kısa Kontrol | Tekrar Kartları (flashcard) |
|---|---|---|
| Ne | 5 soruluk test | Üretim kartı: ön yüz → **çevir** → arka yüz |
| Nerede | Konu Takibi → konu satırı → **Kısa Kontrol** düğmesi | Konu Takibi → **Kartları Bitir** · Günlük Görevler · Bilgi Bankası |
| Zamanlama | Motor: `precheck_due`, `KISA_ARALIK_GUN = 3` | Hafıza takvimi (1/3/7/14/28) + hata kartları |
| Veri | BKT gözlemi üretir (`kaynak: mini_test`) | BKT'ye **doğrudan gözlem olmaz** (rapor §5.2 kural 3) |

Kart ekranı Kısa Kontrol açmaz; test ekranı kart açmaz. (`kart.js` içinde
`openMiniTest`/`data-bkt-test` **yok** — testle denetleniyor.)

## 3) "Kartlar gerçekten arkasına dönsün"

Eski ekranda arka yüz baştan açıktı (`esc(acik ? k.front : k.front)` — iki dal
aynıydı, yani çevirme hiç yoktu). Yeni ekran:

- Ön yüz: üretim sorusu, **arka yüz gizli**, tek düğme **"Kartı çevir"**.
- Çevirince "ARKA YÜZ" kutusu + iki düğme: **Bildim / Bilemedim**
  (rapor §5.1: "karmaşık öz-değerlendirme skalası yok"; "Zorlandım" kaldırıldı).
- Bittiğinde: Bildim/Bilemedim sayısı + eşik sonucu.

## 4) "Konunun tekrar edilmesi için flashcardı tamamlamak zorunlu"

- Kart turu **≥ %70** bilgiyle biterse günün tekrarı tamamlanır
  (`tekrarKartlari[key].tamamlandi = bugün`), hafıza barı %100'e çekilir,
  sıradaki tekrar yeniden kurulur (rapor §5.4).
- Aksi hâlde `tamamlandi = null`: **tekrar günü kapanmaz**, bilemediklerin
  yarın yeniden sorulur.
- `reviewTopic()` artık kartı olan konuda doğrudan tekrar kapatmıyor:
  önce kart turunu açıyor ("Bu konunun tekrarı için önce N kartı bitirmen
  gerekiyor"). Konu satırındaki birincil düğme de **Kartları Bitir (N)** oluyor.

## 5) "Flashcard sayısı raporlarda var"

Rapor §5.1 tavanları uygulandı: **konu başına en fazla 8 standart + 5 hata
kartı** (`kart.js` `TAVAN`, motor `createCardsOnApproval` 8, `veri-sikistir`
kırpma). Sayı satırda görünüyor: "Kart · 3 ✓" / "kart zorunlu (3)".

## 6) "Konuların alanı birbirinden ayrılmıyor, hâlâ karışık"

Öğrenme Durumu · Hafıza Gücü kartı artık **ders ders** gruplanıyor:
her dersin başında `ders-ayrac` şeridi (ders adı + kaç konu), altında o dersin
konuları. Sıralama: ders → en zayıf konu.

## 7) "Ana sayfada günlük görevler hâlâ eski formda"

Ana sayfadaki sabit "Konu Çalış / Soru Çöz / Okuma" rozetleri kaldırıldı.
Artık **Günlük Görevler sayfasıyla aynı** dinamik satırlar basılıyor
(`gorevSatirHTML`): o gün tekrarı gelen konular, kısa kontrol, okul sınavı,
eksik nedenler, kart turu, okuma/soru/çalışma. İlk 4 görev + "N görev daha".

## 8) "Takvim Google Takvim gibi olsun, görevler renkli satırlar olsun"

- Takvimin altına **AJANDA** eklendi: bugünden 45 gün ileriye bakan, güne göre
  gruplanmış renkli satırlar (Google Takvim'in ajanda listesi gibi).
- Görev satırları renk kodlu: tekrar (mor), kısa kontrol (mavi),
  sınav (kırmızı), hazırlık (turuncu), kart (mor), okuma/çalışma (yeşil),
  soru (mavi). Aynı satırlar ana sayfa, Günlük Görevler ve Ajanda'da kullanılıyor.

## 9) "Sadece tekrar günleri açılmalı" + "sadece deneme bildirimi gönderildi diyor"

**İkincisi bir yanlış anlaşılma:** uygulamanın dediği cümle "deneme bildirimi"
değil **"DENEME bildirimi"** (trial = deneme çekimi) idi; sınavla ilgisi yok.
Metin netleştirildi: *"Bildirimler açıldı ve bu cihaza bir DENEME bildirimi
gönderildi (sınav bildirimi değil)."*

**Birincisi artık kodda:** `sablon.ts` içine beyaz liste eklendi —
push yalnız `:reviews` (tekrar günleri), `:memcrit` (hafıza %20 altı),
`:forget` (unutma indeksi) ve `schooltoday@`/`schooleve@` (okul sınavı
günü/yarını) için gönderiliyor. Selamlama (`coach`), öncelik listesi
(`urgent`), gün özeti (`daily`) ve sınav geri sayımı (`exam@`) push olarak
**gitmiyor**; uygulama içi bildirim olarak kalıyor.

> **DÜRÜST DURUM:** bu değişiklik `supabase/functions/bildirim-gonder/index.ts`
> içine derlendi ama **edge fonksiyonu bu turda yayınlanmadı** (yayındaki sürüm
> hâlâ v4). Yayınlanmadan canlıda etkisi olmaz. Yayınlamak için:
> `supabase functions deploy bildirim-gonder --project-ref ztgzmhfklsdlngrtennp`

## 10) "Bu yöntem işe yarıyor mu?" — kanıtla cevap

**Evet, sunucu tarafı çalışıyor** (bugün 07:35 TR):

| Kullanıcı | Anahtar | Saat |
|---|---|---|
| f0031e60 | coach · urgent | 07:35:01 |
| 7490b2fb | coach · reviews · urgent · daily | 07:35:02 |

`bildirim_log` yalnız push servisi **201** döndüğünde yazılır → VAPID imzası
kabul edildi, FCM mesajı aldı. Bu satırlar "gönderim çalışıyor" demektir.

**Cihaz tarafı ölçülemiyordu, artık ölçülüyor:** `sw.js` her push'ta önce
`am-push-iz` önbelleğine zaman+başlık yazıyor. Profil → Bildirim durumu:
- `Bu cihaza son push: ✓ tarih` → push cihaza ulaştı (sorun gösterimde).
- `Bu cihaza son push: ✗ hiç ulaşmadı` → cihaz almıyor (aboneliği yenile).

**Sınırlar (actions benzetmesi):** Web Push bildirimi düğme taşıyabilir ama
düğme yalnız **dokunulunca** çalışır; arka planda iş yapamaz, kullanıcı
bildirimi kaydırmazsa hiçbir şey tetiklenmez. Otomatik "sabah tarama + her
öğrenciye kendi tekrarları" **çalışıyor** (edge fonksiyon her kullanıcının
`app_states`'ini okuyup kendi mesajını üretiyor).

## 11) "Google ile giriş yapıyorum ama veri kaydedilmiyor"

Google girişi çalışıyor; asıl hata **madde 1**'deki kota taşmasıydı: oturum
açılıyor, bulut okunuyor, ama 5,8 MB'lık kayıt `localStorage`'a yazılamıyordu.
madde 1'in düzeltmesi + canlı veri temizliği ile bu hata kalktı.

## Test durumu

`npm run -s test:hepsi` → **EXIT=0**, tüm dosyalar geçti. Yeni:
`veri-sikistir` 23/23, `kart-flashcard` 28/28, `birlesik-kart` 26/26 (ders
ayracı + kart zorunluluğu bölümleri eklendi).

**Testlerin gerçekten yakaladığı kanıtlandı** (enjeksiyon):
- `kart.js`'te arka yüzü hep açık yaptım → `✗ arka yüz GİZLİ`, `✗ 'Kartı çevir' düğmesi var`
- eşiği %70 → %50 yaptım → `✗ 3/5 (%60) → gün TAMAMLANMADI`
- ikisi de geri alınınca 28/28.

## Değişen dosyalar

`site/veri-sikistir.js` (yeni), `site/veri-birlestir.js`, `site/app-pwa.js`,
`site/bkt-engine.js`, `site/kart.js`, `site/index.html`, `site/sw.js`,
`supabase/functions/bildirim-gonder/sablon.ts` + `index.ts` (derlendi),
`tests/veri-sikistir.test.js` (yeni), `tests/kart-flashcard.test.js` (yeni),
`tests/birlesik-kart.test.js`, `tests/konu-bulma.test.js`, `package.json`.
