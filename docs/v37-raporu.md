# v37 — Düzeltme Raporu (güvenlik · kısa kontrol · flashcard · ajanda · mobil)

Tarih: 29.10.2026 · Sürüm: `PWA_SURUM = "v37-takvim-kart"`,
service worker önbelleği `analiz-merkezi-v-20261029-v37-takvim-kart`.

Her madde: **şikâyet → kök neden → yapılan → kanıt**. Kanıtlar ya test
sayısıdır ya da veritabanı/sunucu ölçümüdür; "çalışıyor" ifadesi ölçüm
olmadan kullanılmadı.

---

## A) GÜVENLİK — iki açık kapatıldı (bu turda, canlı veritabanında)

### A1. `app_states_yedek_20261029` — RLS kapalı, anon tam yetkili

**Ölçüm (önce):**

```
tablo                        rls    izinler
app_states_yedek_20261029    false  postgres=arwdDxtm | anon=arwdDxtm | authenticated=arwdDxtm | service_role=arwdDxtm
```

`arwdDxtm` = okuma + ekleme + güncelleme + silme. Yani **anon anahtarı olan
herkes** 5,8 MB'lık yedek tabloyu okuyabilir, değiştirebilir, silebilirdi.
Haklı bir uyarıydı.

**Yapılan (tek işlemde):**

```sql
alter table public.app_states_yedek_20261029 enable row level security;
revoke all on public.app_states_yedek_20261029 from anon;
revoke all on public.app_states_yedek_20261029 from authenticated;
grant select on public.app_states_yedek_20261029 to service_role;
```

**Ölçüm (sonra):**

```
tablo                        rls   izinler
app_states_yedek_20261029    true  postgres=arwdDxtm | service_role=arwdDxtm
```

**Gerçek saldırı denemesi:** uygulamanın **anon anahtarıyla** REST çağrısı:

```
GET /rest/v1/app_states_yedek_20261029?select=user_id&limit=1&apikey=<anon>
→ HTTP 42501  "permission denied for table app_states_yedek_20261029"
```

Yani tablo artık anon rolüne **kapalı**; yalnız sunucu (service_role) okuyor.
Tablo silinmedi (veri kaybı olmasın diye); istenirse silinebilir — o zaman
tamamen ortadan kalkar.

### A2. `bildirim_cron_tetikle()` — herkese açık EXECUTE

**Ölçüm (önce):**

```
fonksiyon                security definer  izinler
bildirim_cron_tetikle    true              =X/postgres | postgres=X | service_role=X
```

Baştaki boş `=X` **PUBLIC** demektir: anon anahtarıyla `/rest/v1/rpc/bildirim_cron_tetikle`
çağrılabilir ve SECURITY DEFINER olduğu için fonksiyon sahibinin yetkisiyle
çalışıp **bildirim gönderme zincirini tetikleyebilirdi**.

**Yapılan:**

```sql
revoke execute on function public.bildirim_cron_tetikle() from public, anon, authenticated;
grant  execute on function public.bildirim_cron_tetikle() to service_role;
```

**Ölçüm (sonra):**

```
bildirim_cron_tetikle    postgres=X/postgres | service_role=X/postgres
```

pg_cron bu fonksiyonu `postgres` rolüyle çağırdığı için zamanlanmış gönderim
**bozulmadı**; dışarıdan çağrı imkânı kalmadı.

> Kalan tablolar kontrol edildi: `app_states`, `fcm_tokens`, `okulizyon_kuyrugu`
> RLS açık ve politikaları `auth.uid() = user_id`; `bildirim_log` yalnız
> service_role; `okul_duyurulari` oturum açmış kullanıcıya okuma.

---

## B) "5 soru 4. adımı bitirir bitirmez açılıyor, sonra kalkmıyor"

**Kök neden iki taneydi:**

1. `completeTopic()` sonunda `miniKontrolBaslat(key)` çağrılıyordu → 420 ms
   sonra test penceresi kendiliğinden açılıyordu (v35.6'da benim eklediğim
   davranış; kullanıcı artık istemiyor).
2. Bilgi Bankası'ndaki "5 soruluk kısa kontrol seni bekliyor" kartı
   **onaylanmadıysa her zaman** çiziliyordu. Motorda `precheck_due` ileri
   alınsa bile bu kart kalkmıyordu → "ne kadar çözülse de kalkmıyor".

**Yapılan:**

- `miniKontrolBaslat()` tamamen **silindi**; konu bitince yalnız bilgi
  bildirimi çıkıyor: *"Kısa Kontrol hazır: Konu Takibi → Kısa Kontrol · 5.
  Kendiliğinden açılmaz."*
- Kart artık `kisaDue = (precheck_due ≤ bugün)` **ve** dinlenme süresi
  bitmişse çiziliyor. Zamanı gelmediyse yerine sakin bir bilgi satırı
  ("Sıradaki kontrol: 1 Kasım") var, düğme yok.
- Konu Takibi satırındaki **Kısa Kontrol** düğmesi de yalnız
  `precheck && !kisaKapali` iken çiziliyor.

**Kanıt:** `tests/v37-davranis.test.js` 1. bölüm (4 kontrol) +
`tests/birlesik-kart.test.js` 3b bölümü (3 kontrol): zamanı gelmeyince /
dinlenme sürerken düğme **hiç** yok, zamanı gelince var. Toplam paket yeşil.

---

## C) "Flashcard arkasını dönmüyor, klasik flashcard yap"

**Kök neden:** v36'da "çevir" bir düğmeydi ve sadece HTML'i yeniden
basıyordu; **dönme animasyonu yoktu**. Ayrıca arka yüz DOM'da hiç
duruyordu.

**Yapılan — gerçek 3B çevirme:**

- Kart artık `perspective: 1200px` bir sahne; içinde `transform-style:
  preserve-3d` bir katman; ön ve arka yüz üst üste, `backface-visibility:
  hidden`.
- Karta **dokununca** `rotateY(180deg)` ile 0,45 sn'de dönüyor; tekrar
  dokununca geri dönüyor. "Kartı çevir" düğmesi de duruyor (erişilebilirlik).
- Kartın altında ilerleme noktaları (`● ● ○`), "Kart 3 / 8" sayacı,
  bilemediklerini tekrar sorma.
- Değerlendirme düğmeleri **yalnız kart çevrildikten sonra** çıkıyor.

**Kanıt:** `tests/kart-flashcard.test.js` **34/34**. Testte artık "cevap
DOM'da yok" değil, **gerçek mekanizma** ölçülüyor: `rotateY(0deg)` →
tıklama → `rotateY(180deg)`, `backface-visibility:hidden`, geri dönüş.

> **"Neden sadece Bildim/Bilemedim?"** — Bağlayıcı şartname
> (`docs/Analiz_Merkezi_BKT_Dogrulama_Iliski_Grafi_Ajan_Raporu.md` §5.1):
> *"Değerlendirme: iki düğme — Bildi / Bilemedi. Karmaşık öz-değerlendirme
> skalası yok."* Eski bir denetim raporunda (`TEST_BULGULARI_.md`, F1)
> "Zorlandım yok" diye FAIL yazıyor; o rapor **eski** ve §5.1 onu geçersiz
> kılıyor. İstersen "Zorlandım"ı üçüncü düğme olarak eklerim; şartnameden
> sapma olur, tek satırlık iş.

---

## D) "Acil çalışılacaklar ilk 5'i göstersin"

`urgentLimit` 10 → **5**; "Daha Fazla Göster (N konu daha)" her basışta +5
açıyor, tamamı açıkken "Daha Az Göster" 5'e dönüyor.

**Kanıt:** `tests/v37-davranis.test.js` bölüm 2.

---

## E) "Hafıza gücü / öğrenme durumu hâlâ çok karışık, mobilde yüzdeler sığmıyor"

**Yapılan:**

- **Ders ayracı kaldırıldı.** Her konu **kendi kartı** (`.konu-kart`):
  üstte konu adı + durum rozeti, altında iki ince çubuk, altta aksiyonlar.
  Sıralama tek ölçüt: en zayıf hafıza önce.
- **Taşma kökü:** satır `flex` + `flex-wrap` idi; yüzde, bar ve etiket aynı
  satırda sıkışıp kelime kelime kırılıyordu. Yeni ölçü **ızgara**:
  `grid-template-columns: 58px minmax(0,1fr) 46px` → etiket | bar | değer.
  Değer `white-space: nowrap` ve `tabular-nums`; bar kalan alanı alır,
  daralır ama taşmaz.
- `@media (max-width: 480px)`: düğmeler tam genişlik, ölçü sütunları
  daraltılmış (54/42 px).

**Kanıt:** `tests/birlesik-kart.test.js` **31/31** (ders ayracı yok, 3 konu =
3 kart, ızgara/nowrap medya kuralları) + `tests/v37-davranis.test.js` bölüm 5.

---

## F) "Ana sayfada konuyu çalışsak bile hâlâ görevde gösteriyor"

**Kök neden:** görev yalnız `dailyTasks.study` bayrağına bakıyordu. Konu
adımı, kısa kontrol, kart turu, tekrar... bunların bir kısmı bayrağı
yazmıyordu (ör. test çözmek, kart turu bitirmek).

**Yapılan:** `bugunCalismaVarMi()` eklendi. Bugün **herhangi** bir çalışma
eylemi varsa "Konu çalış" görevi listeden düşer:

| Sinyal | Örnek |
|---|---|
| `dailyTasks.study` | adım/konu tamamlama |
| `topics[k].son_adim_tarihi = bugün` | adım tamamlandı (yeni alan) |
| `topics[k].completedAt` bugün | konu bitti |
| `mini_test_sessions[k].started` bugün | Kısa Kontrol |
| `tekrarKartlari[k].tamamlandi` bugün | kart turu |
| `memory[k].lastReview` bugün | tekrar |
| bugün deneme/soru kaydı | deneme, soru bankası |

Dünkü çalışma bugünü kapatmıyor (yanlış pozitif yok).

**Kanıt:** `tests/v37-davranis.test.js` bölüm 4 — 9 kontrol, hepsi geçti.

---

## G) "Ajanda görseldeki gibi olsun, her olay ayrı renk"

Gönderdiğin ekran (Google Takvim ajandası): gün başlığı + tam genişlik
renkli çubuklar. Uygulama artık aynı yapıda:

- **Gün başlığı:** `5 Kasım Per` (bugün → "Bugün · 29 Ekim", yarın → "Yarın · …").
- **Olay çubuğu:** tam genişlik, yuvarlak köşeli, **dolu renk**, beyaz yazı;
  solda saat (varsa), ortada etiket, sağda tür.
- **Renkler türe göre:**

| Tür | Renk |
|---|---|
| Konu tekrarı | mor `#6D28D9` |
| Sınav (okul) | ders bazlı 6 renk paleti (aynı gün iki sınav aynı renk olmaz) |
| Sınava hazırlık | turuncu `#D97706` |
| Deneme sınavı | lacivert `#1E293B` |
| Kısa kontrol | mavi `#2563EB` |
| Tekrar kartları | turkuaz `#0E7490` |

- Etiketler senin örneğindeki gibi: **"Sınav: Matematik"**, **"Sınav: S.
  Peygamberimizin Hayatı"**, **"Sınava hazırlık: Matematik · Eksik kapatma"**.
- Okul sınavının **saati** (ör. `08:10-09:50`) çubukta görünüyor.
- Aynı günün konu tekrarları tek satırda toplanıyor: "Konu tekrarı ·
  Trigonometri · Kuvvet +2".

**Kanıt:** `tests/v37-davranis.test.js` bölüm 3 — gün başlığı biçimi, saat,
"tekrar/hazırlık/deneme/sınav" ayrımı ve **aynı gün iki sınavın farklı
renkte** olması ölçülüyor (10 kontrol).

---

## H) Raporların gözden geçirilmesi — ne diyorlar, uygulama nerede?

`docs/` ve kökteki bütün raporlar tarandı. Zamanlama ve flashcard ile ilgili
bağlayıcı satırlar:

| Kaynak | Ne diyor | Uygulama (v37) |
|---|---|---|
| BKT Şartnamesi §4.1 | Gün 0 — 4 adım bitimi **ön-kontrol 3 soru**, onay vermez, ≤1 doğru → 1. adıma dön | **5 soru** (kullanıcı talimatı: "sadece 5 soru") · onay vermiyor ✔ · pencerede "1. adıma dön" önerisi var ✔ |
| §4.1 | Gün 3 — **öğrenme testi 5 soru**, ≥%80 **ve** L≥0,85 → ONAYLANDI | ✔ `validateLearningTest` (0.80 + 0.85) |
| §4.1 | Gün 7 — **flashcard + kritik 2 çoktan seçmeli**; Gün 14/28 — yalnız flashcard | ✔ 3/7/14/21/28 takvimi; kart turu gün 7/14/28'de |
| §4.1 | Günde en fazla 1 mini test; toplam yük ~15 dk | ✔ `KISA_ARALIK_GUN`, `son_kisa_kontrol` kilidi |
| §5.1 | Üretim kartı, **iki düğme**, ≤8 standart + ≤5 hata | ✔ (v36) + v37'de gerçek 3B çevirme |
| §5.1 | Kart üretimi yalnız ONAYLANDI'ya geçişte; "İşlem Hatası"/"Kodlama" kartı üretmez | ✔ `createCardsOnApproval` |
| §5.2 | "Bildi/Bilemedi" BKT'ye **doğrudan gözlem olmaz** | ✔ `flashcardReview` → `observe()` yok |
| §5.2 | Hafıza barı <%20 veya 2 ardışık "Bilemedi" → `L = L×0.8` (günde 1) | ✔ `softDrop` |
| §5.4 | Bildi → bar %100, S×1.6, gün tamam · Bilemedi → bar sabit, S yok, gün tamam değil, yarın aynı kart | ✔ v36 `sonucuIsle` |
| §5.4 | Oturumun ≥**%70**'i bilinirse gün tamamlanır | ✔ `OTURUM_ESIGI = 0.70` |
| §5.3 | Tek zamanlayıcı (3/7/14/28); dinamik S-aralığı yok | ✔ (`-S·ln0.90` kodda yok) |
| `TEST_BULGULARI_.md` (eski denetim) | E1 FAIL: "Gün 0 için 3 soru / 4. adım bitişi yok", F1 FAIL: "Zorlandım yok" | Kullanıcı 3 yerine **5** soru istedi; §5.1 ise **Zorlandım'ı yasaklıyor** → eski denetim geçersiz, güncel şartname uygulandı |
| `FIX_RAPORU.md` | `S` zinciri: 4×"Bildi" → `1.6⁴ = 6.5536` | ✔ aynı denklem |
| `docs/BILDIRIM-KURULUM.md` | `index.ts` **üretilmiş** dosya; `sablon.ts` elle düzenlenir | ✔ `node scripts/bildirim-derle.js` |

**Sapma olan tek madde bilinçli:** Gün 0 ön-kontrol **3 → 5 soru**. Şartname
3 diyor, kullanıcı talimatı 5 diyor; kullanıcı talimatı üstün tutuldu ve her
yerde tek sayı (5) kullanılıyor.

---

## I) Test durumu (bu tur)

`npm run -s test:hepsi` → **EXIT=0**

| Paket | Sonuç |
|---|---|
| `kart-flashcard` | **34/34** (v36: 28 → 3B çevirme testleri eklendi) |
| `birlesik-kart` | **31/31** (v36: 26 → konu kartı + kısa kontrol kapısı) |
| `v37-davranis` (YENİ) | **45/45** |
| `kok-eksik` | 48/48 (otomatik açma beklentisi tersine çevrildi) |
| `veri-sikistir` | 23/23 |
| `bkt-davranis` | 35/35 |
| `şekil-tutarlılık` | 482/482 |
| diğerleri (ders, okz, mesaj, kuyruk, birleştir, görsel, yük, konu bulma, bildirim…) | hepsi yeşil |

Sözdizimi: `index.html` içindeki 2 script bloğu (251.595 karakter) ve
`kart.js`, `bkt-engine.js`, `veri-sikistir.js`, `veri-birlestir.js`
`new vm.Script` ile derlendi → hata yok (v35.7'deki "tek parantez tüm bloğu
düşürür" kazasını tekrar etmemek için).

---

## I.1) Yayın doğrulaması

| Kontrol | Sonuç |
|---|---|
| Commit | `76b3f29` (branch `arena/cc4de070-analiz-merkezi`) |
| Vercel | `dpl_5mNXK6aEipYNbVfBrk8xczHwoZA3` — **READY**, alias `analiz-merkezi.vercel.app` |
| Canlı `sw.js` | `analiz-merkezi-v-20261029-v37-takvim-kart` ✓ |
| Canlı `kart.js` | v37 3B çevirme kodu yayında (`data-kart-cevir`, `rotateY`) ✓ |
| pg_cron | 3 iş **postgres** rolünde, `active=true` (yetki kaldırması zamanlamayı bozmadı) ✓ |
| Yedek tablo | RLS açık, yalnız postgres + service_role ✓ |
| `bildirim_cron_tetikle` | yalnız postgres + service_role ✓ |

## J) Dürüst sınırlar

- **Ekran görüntüsü alamıyorum:** bu ortamda tarayıcı yok (Chromium/
  Playwright indirilemiyor). Bu yüzden "görsel olarak doğruladım" demiyorum;
  yukarıdaki yerleşim iddiaları **DOM çıktısı + CSS kuralları** üzerinden
  testle ölçüldü. Telefonda bakıp ekran görüntüsü gönderirsen, kalan
  hizalamaları ona göre düzeltirim.
- **Edge fonksiyonu hâlâ v4:** push filtresi (yalnız tekrar günleri) kodda
  ve derlendi ama yayınlanmadı. Yayınlamak için:
  `supabase functions deploy bildirim-gonder --project-ref ztgzmhfklsdlngrtennp`
- **Yedek tablo silinmedi:** RLS ile kapatıldı; silmek istersen tek komut.
