# v90 — Bildirim: "Günaydın" kalktı · siyah kare yerine rozet · yeni deneme bildirimi

**Tarih:** 18 Kasım 2026 · **Sürüm:** `v90-bildirim-ikon-baslik` · **Kod:** `6adc932`

---

## 1. Kullanıcının cümleleri

> "Günaydın yazmasın yeter."
> "Bir de yeni deneme çekerse 'yeni deneme sonucun var' deyip onu analiz etmesini söylesin."
> "Uygulamanın bildiriminde ikonu siyah kare olarak geliyor. Ve o büyük ikon resmi olmasın. Öyle bir şey profesyonel değil. O siyah kare yerine uygulama ikonu olmalı… cihazın üst barında (saat, pil, wi-fi) oradaki bildirim ikonlarından."

---

## 2. "Günaydın" neden çıkıyordu

Başlık **saate göre değil, "vardiya"ya göre** yazılıyordu ve sabah vardiyası 14:00'e kadar sayılıyordu. 13:05'teki telafi koşusu da sabah vardiyasına düştüğü için öğleden sonra "Günaydın" yazabiliyordu; sabahki bildirim gösterilmediyse telafi devreye giriyordu.

**Yeni başlıklar (selamlaşma yok):**

| Durum | Sabah / öğle | Akşam |
|---|---|---|
| Tekrar | **Tekrar zamanı** | **Akşam tekrarı** |
| Acil konu | **Acil konular** | **Akşam: acil konular** |

---

## 3. Siyah kare → uygulama rozeti

Android'de iki ayrı görsel var:

| Alan | Ne işe yarar | Eski hâli | Yeni hâli |
|---|---|---|---|
| **badge** | Üst durum çubuğundaki **küçük ikon** (saat/pil yanındaki) | Renkli 192'lik logo → tek renge zorlanınca **siyah kare** | `icons/bildirim-rozet.png` — 96×96, **şeffaf zeminli**, beyaz "yükselen üç çubuk" rozeti |
| **icon** | Bildirimin sağındaki **büyük görsel** | Renkli logo (istenmiyor) | **Gönderilmiyor** |

Rozet uygulamanın logosundaki grafik motifi taşır (üç yükselen çubuk) ve küçüldüğünde bile seçilir. Android onu kendi temasına göre boyar — siyah kare sorunu biter.

**Ölçüm:** dosya 96×96, RGBA (şeffaf), 915 bayt. Test bunu kilitliyor (boyut + renk türü + PNG imzası).

---

## 4. Yeni deneme bildirimi

Okulizyon'dan yeni bir deneme yazıldığında:

> **Yeni deneme sonucun var**
> 10.SINIF MAARİF İZLEME SINAVI 1 · 77,5 net. Sonucu senin için analiz edeyim mi? Aç, birlikte bakalım.

Nasıl çalışıyor (güvenli yol):

1. Uygulama çekimi bitirince veritabanındaki **`bildirim_deneme_kuyruk`** fonksiyonunu çağırır — tarayıcıya gizli anahtar **inmez**, `auth.uid()` ile yalnız kendi hesabına yazabilir.
2. **5 dakikada bir** çalışan iş (cron `deneme-bildirim-kuyrugu`, jobid **17**) kuyruğu boşaltır ve `push-tani` kanalıyla gönderir.
3. Sessiz saatte (TR 21:00–06:00) bekler, ertesi sabah gider. 2 günden eski istek gönderilmez.
4. Aynı sınav **iki kez bildirilmez** (`unique (user_id, anahtar)`), giriş yapılmamışsa sessizce atlanır.

---

## 5. Canlı kanıt

| Adım | Zaman (TR) | Sonuç |
|---|---|---|
| Girişsiz RPC çağrısı | — | `{ ok: false, sebep: "giris-yok" }` (kilit çalışıyor) |
| Kuyruğa test satırı | — | `id 1`, kullanıcı `7490b2fb` |
| `bildirim_kuyruk_tetikle()` | — | `{ gonderilen: 1, atlanan: 0 }` |
| `push_teslim` id 104 · push | 20:28:16 | "Yeni deneme sonucun var" |
| `push_teslim` id 105 · **gosterim** | **20:28:17** | **gösterildi = true** (cihaz X5Hk) |
| Cron job 17 ilk koşu | 20:30:00 | `succeeded` |

---

## 6. Test ve yayın

| | |
|---|---|
| `npm run test:v90` (yeni) | **43/43 ✓** |
| `npm run test:hepsi` | **EXIT 0 · 0 hata** |
| Vercel | `dpl_FVef6Wzd5jBj6oanKa52jKsn4Dga` — **READY / PROMOTED** |
| Canlı teyit | alt bilgi **v90-bildirim-ikon-baslik** · `sw.js` CACHE **v90** · ASSETS'te rozet |

---

## 7. Ne göreceksin

- Sabah 07:35: **"Tekrar zamanı"** ya da **"Acil konular"** (selamlaşma yok)
- 07:40: **"Bugünün görevleri"** (sadece kalanlar)
- Yeni deneme gelince ~5 dk içinde: **"Yeni deneme sonucun var"**
- 19:30: **"Akşam tekrarı"** / **"Akşam: acil konular"**
- Üst barda küçük **uygulama rozeti**, sağda büyük görsel **yok**

> Not: Yeni ikon ve başlıklar bir sonraki bildirimde görünür. Cihazdaki service worker'ı yenilemek için uygulamayı bir kez kapat-aç.
