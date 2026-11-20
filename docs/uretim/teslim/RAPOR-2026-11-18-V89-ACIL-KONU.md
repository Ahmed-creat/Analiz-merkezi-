# v89 — "Saat 19:43, bildirim hâlâ gelmedi"

**Tarih:** 18 Kasım 2026 · **Kod:** `2dc3c7a` · **Kapsam:** yalnız sunucu (site dosyaları değişmedi)

---

## 1. Kullanıcının cümlesi

> "Ya bildirimin çalıştığından emin misin, şu an saat 19.43 hâlâ gelmedi."
> "Tekrar yok ama konu takibinde acil konu var. Bunun içinde bildirim vardı. Bu gelmezse öğrenci çalışmaz ve tekrar da etmez."

---

## 2. Kanal sağlam mı? EVET — kanıt

Elle test bildirimi gönderildi (abonelik `789bdf7c…`, cihaz **X5Hk**):

| Aşama | Zaman (TR) | Sonuç |
|---|---|---|
| `push-tani` yanıtı (istek 214) | 19:45:54 | **HTTP 200**, `kod: 201`, "web-push 228 bayt" |
| `push_teslim` id 98 | 19:45:54 | `push` |
| `push_teslim` id 99 | 19:45:55 | **`gosterim` · gosterildi = true** |

Yani telefon bildirimi **aldı ve gösterdi**. Sorun kanalda değil.

---

## 3. Peki 19:30 bildirimi neden gelmedi? — Kör nokta

| Ölçüm | Değer |
|---|---|
| Cron `bildirim-aksam` (jobid 4) | 19:30:00.171 TR → **succeeded** |
| `app_states` · hafıza (memory) konusu | **0** (üç hesapta da) |
| `app_states` · `exams[].errorLogs` | **39 kayıt**, hepsinin dersi+konusu var |
| `bildirim_log` · `2026-11-18:a:*` | **yok** (yani hiç denenmemiş) |

Eski `webpush_tetikle()` fonksiyonu **yalnız** hafıza planına (`state->'memory'`) bakıyordu:

```
if adet = 0 then continue;   -- tekrar yoksa sessizce atla
```

Hafıza boş olduğu için tekrar listesi 0 çıkıyor, fonksiyon kullanıcıyı atlıyordu. Uygulamanın ana sayfada **"Acil Konu"** diye gösterdiği hata kayıtları bildirim motoruna hiç girmiyordu. Yani bildirim "bozulmuş" değil, **eksik hesaplanmıştı**.

Bugün o hesapta acil konu sayısı: **19** (en yüksek: Matematik 1.2 Üçgende Yardımcı Elemanlar, 1.1 Trigonometrik Oranlar, 1.3 Üçgende Alan).

---

## 4. Düzeltme

`supabase/migrations/0007_bildirim_acil_konu.sql` — `webpush_tetikle()` yeniden yazıldı:

1. **Önce tekrar:** günü gelmiş konu varsa eski metin aynen gider (davranış korunur).
2. **Tekrar yoksa acil konu:** `exams` + `questions` hata kayıtları puanlanır ve bildirim üretilir.
   - Puanlama uygulamanın kendi ağırlıkları (`REASON_WEIGHTS`) ile aynı:
     Konuyu Bilmiyordum / KONUEKSİKLİĞİ → denemede 1.5, testte 1.0 · Çözüm yolunu bulamadım 0.8 · Anlamadım / İşlem hatası 0.5 · Kodlama 0.1
   - Uygulamadaki `topicLearnedAfter` kuralı aynen: konu sonradan "öğrendim" işaretlendiyse **ondan önceki** hatalar düşer.
   - Tarihi okunamayan kayıt sayılmaz (uydurma konu çıkmaz).
3. **İkisi de yoksa sessiz** — boş yere bildirim gitmez.
4. Başlıklar: sabah **"Günaydın! Acil konular"**, akşam **"Akşam: acil konular açık"**. Gövdede acil konu sayısı + en önce bakılacak 3 konu + "birini 10 dakikada kapat".
5. TTL 6 saat → **90 dakika** (v87 kuralı), vardiya başına en çok 4 deneme, cihaz gösterdiyse mükerrer yok — hepsi korundu.

---

## 5. Canlı kanıt (yayına alındıktan sonra)

`select public.webpush_tetikle();` → `{ gonderilen: 2, atlanan: 0, vardiya: "a" }`

| İstek | Cihaz | Sonuç |
|---|---|---|
| 215 | X5Hk | 200 · `kod: 201` · "web-push **399 bayt**" · ttl 5400 |
| 216 | d6Ni | 200 · `kod: 201` · "web-push 399 bayt" · ttl 5400 |

| `push_teslim` | Zaman (TR) | Durum |
|---|---|---|
| id 100 · push | 20:15:09 | "Akşam: acil konular açık" |
| id 101 · gosterim | **20:15:10** | **gösterildi = true (X5Hk)** |

Yani ekran görüntüsü alınacak cihazda bildirim **gerçekten göründü**.

---

## 6. Test

| Test | Sonuç |
|---|---|
| `npm run test:v89` (yeni) | **37/37 ✓** |
| `npm run test:hepsi` | **EXIT 0 · 0 hata** |

Test şunları kilitler: eski fonksiyonun kör noktası, acil konu yolunun varlığı, ağırlıkların uygulamayla birebir aynı olması, "öğrendim" kuralı, tarih koruması, tekrar yolunun bozulmaması, TTL 5400, mükerrer koruması ve vardiya başına 4 deneme.

---

## 7. Bundan sonra ne olacak

- Her sabah (07:35, gerekirse 09:35 / 11:35) ve her akşam (19:30, gerekirse 21:35) bildirim gidecek.
- Tekrar konusu varsa "tekrar" metni, yoksa "acil konu" metni kullanılacak.
- Cihaz bildirimi gösterdiyse aynı vardiyada tekrar gönderilmez.
- Hafıza ve görev de boşsa (yepyeni hesap) sessiz kalır — uydurma bildirim yok.

**Not:** uygulama sürümü `v88` olarak kalıyor; düzeltme sitenin kodunda değil **veritabanındaki bildirim fonksiyonunda** olduğu için yeni bir site yayını gerekmedi.
