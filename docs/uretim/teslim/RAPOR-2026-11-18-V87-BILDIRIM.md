# v87 — Bildirim: ne oldu, ne düzeltildi

**Tarih:** 18 Kasım 2026 · **Site sürümü:** değişmedi (`v86-denemelerim-karsilastir`)
**Sunucu tarafı:** `gorev-hatirlat` edge fonksiyonu **sürüm 6** · 2 yeni cron (09:40 / 11:40 TR)
**Test:** `test:hepsi` **EXIT 0 / 0 ✗** (yeni `tests/v87-gorev-bildirim.test.js` 26/26)

---

## 1) "Son düzeltmeler neyi değiştirdi?" — Bildirim koduna dokunulmadı

v85 ("neden listesi tek yerde") ve v86 ("Okulizyon karşılaştırması Denemelerim'e göre")
commit'lerinde **tek satır bildirim kodu değişmedi**. Kanıt (depo):

```
git diff 30f549c..HEAD -- site/ index.js bildirim-gonder.js bildirim-logic.js .github/workflows/
  → bildirim/notif/fcm/push/firebase/token içeren DEĞİŞEN SATIR: 0
```

Değişen dosyalar: `site/index.html`, `site/app-pwa.js`, `site/sw.js` (yalnız `CACHE` adı),
testler, `package.json`, raporlar. Yani sorun bu iki sürümden gelmiyor.

## 2) Bugünün kayıtları ne diyor (Supabase, canlı)

| Saat (TR) | Ne oldu |
|---|---|
| 07:30 | Okulizyon günlük çekimi çalıştı ✓ |
| **07:35** | Tekrar hatırlatması gönderildi → push servisi **201** kabul etti, **cihaz kapalıydı** (kayıp) |
| **07:40** | **Görev hatırlatması çalıştı ama HTTP 400 aldı → hiç gönderilmedi** (aşağıdaki hata) |
| 09:35 | Tekrar hatırlatması 2. deneme → 201 |
| **09:55** | Cihaz açıldı → "Günaydın! Tekrar Zamanı" **gösterildi** (`push_teslim`, gosterildi=true) |
| 13:05 | Tekrar denemesi — cihaz gösterdiği için atlandı ✓ |
| 14:42 | Cihaz bildirim testi ("Analiz Merkezi") gösterildi ✓ |
| 16:54 | **Düzeltmeden sonra görev hatırlatması gönderildi ve gösterildi** ("Bugünün görevleri") ✓ |

> Özet: tekrar hatırlatması bugün **09:55'te** cihaza ulaştı ve gösterildi. Sabah 07:35'te
> gelmemesinin sebebi hata değil, cihazın o saatte kapalı olması; sistem 2 saat arayla
> yeniden deniyor ve cihaz açılınca bırakıyor.

## 3) Bulunan GERÇEK hata: görev hatırlatması hiç çalışmıyordu

`gorev-hatirlat` fonksiyonu, bildirimi `bildirim-gonder` fonksiyonuna `mod: "tekil"`
diyerek gönderiyordu. O fonksiyon v59'dan beri yalnız `saglik | test` kabul ediyor →
**HTTP 400**. Canlı kanıt: `net._http_response` kayıt **210**:
`{"gun":"2026-11-18","abonelik":1,"gonderilen":0,"sonuc":[{"http":400,"kalan":2}]}`.
Yani **sabah görev hatırlatması hiçbir gün cihaza gitmedi.**

### Düzeltme

- Görev hatırlatması artık **tek kanaldan** gidiyor: `push-tani` (web-push) — tekrar
  hatırlatmasının kullandığı, kanıtlanmış yol.
- **"Cihaz gösterdim" kuralı:** cihaz `push_teslim`'e `gosterildi=true` yazana kadar
  günde en fazla **3 deneme** (07:40 · 09:40 · 11:40 TR). Gösterildiyse tekrar yok.
- Mesaj birikmesin diye TTL **90 dk**; denemeler 2 saat arayla (en fazla bir mesaj canlı).
- Sessiz saat korundu (TR 06:00–21:00).

### Canlı doğrulama (düzeltmeden hemen sonra)

| Koşu | Sonuç |
|---|---|
| 16:54 | `{"kanal":"push-tani","gonderilen":2}` → cihazda **gösterildi** (`push_teslim`, "Bugünün görevleri") |
| 16:55 | Aynı gün ikinci koşu → `"atlandi":"cihaz gösterdi"` (mükerrer bildirim YOK) |

## 4) Sana düşen tek şey

Tarayıcı/telefon bildirim izni açık kalsın; uygulama kapalıyken de bildirim gelir
(service worker). Cihaz kapalıysa hatırlatma sıradaki denemede bırakılır.

## Dokunulmayanlar

Eşikler, tekrar merdiveni, 28 gün kuralı, havuzlar, `state` anahtarı, AYT_WEIGHT,
`MEMORY_CRITICAL`, `REVIEW_LADDER`, soru puanlaması, `hata_gecmisi` — hiçbiri değişmedi.
Tekrar hatırlatmasının saatleri (07:35 / 09:35 / 11:35 / 13:05 / 19:30 / 21:35) aynen duruyor.
