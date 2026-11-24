# Veriler nerede duruyor? — tek sayfalık harita

**KULLANICI SORUSU (2 Kasım 2026):** *"Sen verileri nerden görüyorsun? Ben
tablolarda Okulizyon sonuçları, bilgiler, konu takibi vb. göremedim."*

Kısa cevap: **hepsi var — ama tablolarda ayrı ayrı sütun olarak değil.**
Uygulama tek bir JSON kaydında tutuyor; o yüzden tabloya bakan kişi
"boş" sanıyor. Aşağıda hem nerede durduğu hem nasıl bakılacağı yazıyor.

---

## 1) Tek satır, tek JSON: `public.app_states`

Her kullanıcı için **bir satır** var. `state` (jsonb) sütunu uygulamanın tüm
verisini taşır. Okulizyon sonuçları, öğrenci bilgileri, konu takibi, denemeler,
plan, rozetler, seri (streak), kartlar, bildirimler… hepsi bu tek sütunun içinde.

| `state` anahtarı | İçinde ne var |
| --- | --- |
| `user` | `name`, `grade` (sınıf), `joined` |
| `settings.okulizyon` | **Öğrenci bilgileri**: `ad`, `okulNo`, `sinif`, `il`, `ilce`, `ilkodu`, `ilcekodu`, `okulAdi`, `kurumkodu` |
| `okulizyon` | Çekim durumu: `pending` (neden bekleyen sorular), `pulledAt` (son çekim), `importedKeys`, `durum` |
| `exams` | **Denemeler / Okulizyon sınav sonuçları** — her kayıt: `id`, `name`, `date`, `net`, `total`, `lessons[]`, `errorLogs[]`, `okzKaynak`, `okulizyonUrl` |
| `topics` | **Konu takibi** (konu → hafıza gücü, tekrar tarihleri) |
| `questions` | Soru bazlı hata kayıtları (neden seçimleri) |
| `plan` | Sınav tarihi, hedef net, `schoolExams` (okul sınavları), görevler |
| `bkt_state`, `memory` | BKT (bilgi durumu) motoru ve hafıza modeli |
| `flashcards`, `mini_test_sessions` | Kartlar ve mini testler |
| `badges`, `streak` | Rozetler ve günlük seri |
| `settings`, `dailyTasks`, `notifications` | Ayarlar, günlük görevler, bildirim geçmişi |

### Neden ayrı sütun değil?

Tek JSON kaydı, şema değişikliği gerektirmeden yeni alan eklemeyi ve tüm
cihazların aynı kopyayı görmesini sağlıyor (çevrimdışı → bağlanınca birleştirme).
Bedeli: tablo görünümünde tek sütun gibi durur, içini açmadan "boş" sanılır.

### Kilit (uçtan uca şifreleme) AÇIKSA

`state` düz JSON değil, **şifreli zarf** olur: `{ "__kasa": true, "t": "<tuz>", ... }`.
Sunucu da, tabloya bakan kişi de içeriği okuyamaz. Bu bir hata değil, tasarım:
anahtar yalnız cihazda. Kapalıyken (varsayılan) düz JSON'dur.

---

## 2) Diğer tablolar

| Tablo | Ne tutar | Not |
| --- | --- | --- |
| `public.app_states` | Yukarıdaki her şey (kullanıcı başına 1 satır) | Asıl veri |
| `public.okulizyon_kuyrugu` | **Yalnız çekim durumu** (`pulled_at`, `durum`, `durum_mesaji`) | v107'den beri sınav sonucu **saklanmaz**: sonuç çekim yanıtıyla gelip doğrudan `app_states.exams`'e yazılır. `exams` sütunu hep boş. |
| `public.okulizyon_kimlik` | Okul no ↔ hesap sahipliği (tuzlu özet, düz ad yok) | v104 güvenlik; istemci yazamaz |
| `public.fcm_tokens` | Bildirim cihaz tokenları | |
| `public.kazanım_konu_cache` | MEB kazanım → konu eşleme önbelleği (ortak) | 28 satır |
| `public.okul_duyuruları` | **KALDIRILDI (v111)** — tablo şemada duruyor ama artık **hiç okunmuyor/yazılmıyor** | 0 satır; okul sitesi çekimi çalışmıyordu, tamamen kaldırıldı |

---

## 3) Bir kullanıcının verisini görmek için (SQL)

```sql
-- Tek bakışta özet
select s.user_id,
       s.state->'settings'->'okulizyon'->>'ad'      as ad,
       s.state->'settings'->'okulizyon'->>'okulNo'  as okul_no,
       s.state->'settings'->'okulizyon'->>'okulAdi' as okul,
       jsonb_array_length(s.state->'exams')         as deneme_sayisi,
       (select count(*) from jsonb_object_keys(s.state->'topics')) as konu_sayisi,
       s.updated_at
from public.app_states s
order by s.updated_at desc;

-- Sınav sonuçlarının içi
select s.state->'exams'
from public.app_states s
where s.user_id = '<uuid>';
```

Arayüzde: **Supabase → Table Editor → app_states → state** hücresine tıkla;
JSON görüntüleyici açılır. `exams`, `topics`, `settings.okulizyon` anahtarlarını
orada görebilirsin.

> ⚠️ Kilit (uçtan uca şifreleme) açık hesaplarda `state` şifreli zarftır;
> panelde içerik okunamaz. Bu beklenen davranıştır.

---

## 4) Ölçüm (2 Kasım 2026, canlı)

| Ölçüm | Değer |
| --- | --- |
| `auth.users` | 5 kullanıcı |
| `app_states` | 5 satır |
| `kazanım_konu_cache` | 28 |
| `okul_duyuruları` | **0** (hiç dolmamıştı — v111'de kaldırıldı) |
| `okulizyon_kuyrugu` | 0 |

Örnek satır (en güncel kullanıcı): 1 deneme (`net: 77.5`, `okzKaynak` dolu),
5 konu takibi, `settings.okulizyon` içinde ad/il/ilçe/okul bilgileri dolu.
Yani veriler **var**; tabloda tek sütunda duruyor.
