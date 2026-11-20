# v102 — Koçluk Hattı (veri doğrulama · analiz · gerekçeli öneri · eksik veri)

**Tarih:** 20 Kasım 2026 · **Sürüm:** `v102-kocluk-motoru` · **Dal:** `arena/cc4de070-analiz-merkezi`

## Kullanıcının geri bildirimi (birebir)

> "Koçluk hattını çok daha iyi programla."

Dört zorunlu eksen:

1. **Veri doğrulama** — sınav tarihi, hedef net ve deneme sonuçları **gerçekten
   uygulama kayıtlarından** alınmalı (uydurma/varsayılan yok).
2. **Analiz** — salt veri gösterimi değil: **net değişimi, hata nedenleri ve konu
   öncelikleri yorumlanır.**
3. **Öneri** — öğrencinin kendi verisine dayalı, **gerekçeli** çalışma önerileri.
4. **Hata yönetimi** — veri yoksa **sayı uydurulmaz**; eksik veri **adıyla** ve
   nereden girileceğiyle söylenir.

## Kök neden: iki ayrı hesap

Panel (`index.html → coachMessages()`) kendi metinlerini, sohbet
(`mesaj.js → kocYanit()`) kendi hesabını üretiyordu. Aynı öğrenci için iki ekran
farklı sayı söyleyebiliyordu (v99'da ivme için yaşanan çelişkinin aynısı).
Ayrıca sohbet, hata **nedenini** (`type`) hiç okumuyor; `baglam()` hedef tarihini
(`plan.targetDate`) taşımıyordu.

## Ne değişti

### 1) Tek kaynak: `site/koc.js` (KOC_MOTOR)

Yeni, **saf** motor: `state` parametre alır; DOM/localStorage/ağ yok → node
testinde birebir koşar. Klasik script olarak yüklenir (`window.KOC_MOTOR`),
`mesaj.js`'den **önce** gelir.

| Fonksiyon | İş |
|---|---|
| `snapshot(state, bugun, ek)` | gerçek kayıtlardan tek veri paketi |
| `snapshotCtx(ctx, bugun, ek)` | sohbet bağlamı → aynı paket |
| `netCoz(deneme)` | net: **kayıt → D/Y hesabı → null** |
| `veriKontrol` / `eksikler` | alan, durum (var/kısmi/eksik), **nerede**, **etki** |
| `netAnalizi` | son/önceki, fark, gün, haftalık tempo, son 3 ortalama, ders değişimi, yorum |
| `hataAnalizi` | neden dağılımı + yüzde + baskın neden yorumu ve aksiyonu |
| `oncelikler` | uygulamanın formülü (**1,5/1,0/0,5 × (1+AYT)**) + gerekçe |
| `hedefAnalizi` | kalan gün/hafta, gereken ve ölçülen ivme, durum |
| `hafizaAnalizi` | kritik konu sayısı, bekleyen tekrar, ortalama güç |
| `oneriler` | 14 kural, her biri **gerekçe + aksiyon + öncelik** |
| `rapor` | bölümlere ayrılmış tam rapor (panel + sohbet aynı metni kullanır) |
| `kartlar` | paneldeki sistem mesajları (HTML kaçışlı) |

Panel artık `KOC_MOTOR.kartlar(...)`, sohbet `KOC_MOTOR.snapshotCtx + rapor`
kullanır → **tek hesap**.

### 2) Veri doğrulama

- Net üç hâlli okunur: kayıtta `net` → **kayıt**; yoksa `lessons` D/Y'sinden
  `D − Y/4` → **hesap**; ikisi de yoksa **null** (0 değil). `netCoz` bunu
  `kaynak` alanıyla söyler; arayüzde "kayıttan" / "D/Y'den hesaplandı" olarak
  görünür.
- Neti okunamayan deneme **trend/seri/ortalamaya katılmaz**; adıyla "atlanan"
  listesine girer.
- `examStats()` içindeki **`e.net || 0`** uydurma sıfırı kaldırıldı → yeni
  `examNetDeger()`: kayıt → D/Y → yok. Böylece ev/analiz ekranlarındaki seri ile
  koç aynı sayıyı görür.
- `denemeIvmesi()` ve `weeklyMomentum()` da aynı doğrulamayı kullanır (netsiz
  deneme 0 net sayılıp "0'dan 95'e" gibi sahte ivme üretmiyordu).
- Türkçe ondalık (`"77,5"`) ve `DD.MM.YYYY` tarihleri de doğru okunur.

### 3) Analiz yorumlanır

Net kartı: `77,5 → 81,5 (+4 net), 19 günde · haftada +1,47 net · en zayıf ders
Matematik (11,25 net, %70)`.

Hata nedenleri: `10 hatanın Konu eksiği 3 (%30), Konuyu bilmiyordum 2 (%20),
İşlem hatası/dikkatsizlik 2 (%20), Çözüm yolunu bulamadım 1 (%10), +2 neden daha`
+ **baskın nedenin yorumu ve aksiyonu** (bilgi eksiği → konu çalışması; işlem →
kontrol/süre; süre → turlu çözüm; kodlama → optik kontrol).

Konu önceliği: sıra + puan + **gerekçe** (`6 hatanın 3'ü konu eksiği, 2'si konuyu
bilmiyordum · son hata 15.11.2026`). Konu "öğrenildi" işaretlendikten önceki
hatalar `topicLearnedAfter` kuralıyla düşülür ve **kaç kaydın düştüğü yazılır**.

### 4) Gerekçeli öneri

Sıra: veri eksiği → en zayıf konu → baskın neden (aynı neden tekrar edilmez) →
net düşüşü → ivme geride → hafıza kritik/tekrar → yaklaşan okul sınavı →
sıradaki hazırlık oturumu. Her öneri `{başlık, gerekçe, aksiyon, öncelik}` taşır;
gerekçe daima **sayıyla** konuşur.

### 5) Veri yoksa sayı yok

- `snapshot` boşken `netAnalizi().son === null`, `hedefAnalizi().gerekenIvme === null`
  (0 değil).
- Panel: "Koç: Yorum için önce sınav tarihi ve deneme sonucu gerekiyor."
- Eksik veri kartı + sohbette "eksik veri ne?" → **alan adı + nereden girilir +
  etkisi** ("Sınav tarihi · Planlama → Hedefler · Kalan gün ve tempo hesaplanamaz").
- Yeni sohbet niyeti **"bugün ne çalışayım?"**: hazırlık planında bugün oturum
  varsa onu, yoksa en öncelikli konuyu gerekçesiyle söyler.

## Test

```
npm run test:koc         # 116 kontrol (yeni)
npm run test:mesaj       # 58 + 23 (motor köprüsü eklendi)
npm run test:kalduz      # 41 (netsiz deneme seriye girmez)
npm run test:v96         # 169 (ivme/plan aynı sayı)
npm run test:hepsi       # tamamı: EXIT 0
```

Yeni test dosyası `tests/koc.test.js` dört ekseni ayrı ayrı ölçer:
veri doğrulama (kayıt/hesap/null), yorum metinleri, öneri gerekçeleri, eksik veri
raporu; ayrıca `NEDEN_TABLO` anahtarlarının `index.html`
`WRONG_REASONS`/`EMPTY_REASONS`/`canonicalReason` ile birebir uyumunu ve
**panel ↔ sohbet aynı sayı** kuralını doğrular.

## Dosyalar

- `site/koc.js` (yeni)
- `site/index.html` — koc.js script sırası, `coachMessages()` → motor,
  `examStats`/`denemeIvmesi`/`weeklyMomentum`/`cognitiveTrend` net doğrulama
- `site/mesaj.js` — `baglam()` gerçek kayıtlar + motor snapshot/rapor,
  `hata nedenlerim`, `öneri`, `eksik veri`, `bugün ne çalışayım` niyetleri
- `site/sw.js` — `./koc.js` önbelleğe, `CACHE` v102
- `site/app-pwa.js` — `PWA_SURUM = "v102-kocluk-motoru"`
- `tests/koc.test.js` (yeni), `tests/mesaj.test.js`, `tests/mesaj-ui.test.js`,
  `tests/v78-kalan-duzeltmeler.test.js`, `tests/v96-tekrar-takvim.test.js`
- `onizleme-koc-v102.html` — gerçek modüllerle üretilmiş önizleme
