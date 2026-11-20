# RAPOR — 2026-11-19 · v94 · MAZMUN KAZANIMI: GAZEL → ŞİİRDE AHENK

## 1) Kullanıcının bildirimi

> "O gazele bagladigin mazmun içeren kazanım varya aslında söz sanatları ile
> ilgiliymiş. Sen bu kazanımı şiirde ahenk e bağla"

Canlı kazanım (Okulizyon):

> **"Şiirdeki mazmun, imge ve edebî sanatları belirleyerek bunların anlama
> katkısını değerlendirir."**

## 2) Ne yanlıştı

v92'de bu kazanım Saf Şiir'den kurtarılmış, "mazmun divan şiirinin kalıplaşmış
imge dünyasıdır" gerekçesiyle **Gazel**'e bağlanmıştı. Kullanıcının düzeltmesi:
kazanım gazelin **biçim** bilgisi (matla / makta / aruz) değil, **söz sanatları**
bilgisidir. 10. sınıf konu listesinde bunu karşılayan konu **Şiirde Ahenk
(Ölçü, Uyak, Redif, Aliterasyon, Asonans)**.

## 3) Yapılan değişiklik

| Katman | Dosya | Değişiklik |
|---|---|---|
| Veri (üretici tablo) | `scripts/tde-kazanim-uret.js` | `mazmun` Gazel `ayirt` listesinden çıktı, Ahenk listesine girdi |
| Veri (kazanım seti) | `site/content/mufredat/tde_kazanim_10.json` | Gazel `ayirt_edici_terimler: [gazel, matla, makta]` · Ahenk `… + mazmun` · `sozluk.mazmun = "Şiirde Ahenk (…)"` |
| Arama indeksi | `site/content/konu_esleme.json` | Gazel metninden `mazmun` çıktı, Ahenk metnine girdi |
| Tarayıcı sözlüğü | `site/okz-tde-veri.js` | `--sozluk` ile tazelendi (92 terim) |
| Kural tablosu | `site/konu-anahtar.js` | Gazel deseninden `mazmun` çıktı; Ahenk desenine `mazmun / edebî sanat / söz sanatı` eklendi |
| Uygulama yorumu | `site/app-pwa.js` | Bayat önbellek notu v94 ile güncellendi |
| Sunucu | `supabase/migrations/0012_mazmun_siirde_ahenk.sql` | Bayat **"kural"** önbellek satırını siler (elle/LLM korunur) |

**Değişmeyenler (kullanıcı kazanımları korunur):**

- **Saf Şiir ayrı konu** (v92): `saf şiir · öz şiir · simgecilik · sembolizm`
  kuralı ve Saf Şiir'e bağlanmama davranışı aynen duruyor.
- **Gazel** kendi terimleriyle ayrışmaya devam ediyor: `gazel · matla · makta`.
- **"imge"** hiçbir konuya zorlanmıyor (genel şiir terimi).
- Ayırt edici **terim sayısı 92 → 92** (terim taşındı, uydurulmadı).
- 30 konu, çıktı kodları, `LESSON_CONFIG` (120) dokunulmadı.

## 4) Canlı veri doğrulaması (Supabase)

Migration kaydı: **`20261119190920 · mazmun_siirde_ahenk_v94`**

| Ölçüm | Önce | Sonra |
|---|---|---|
| `kazanim_konu_cache` mazmun satırı | 1 (konu = Gazel, kaynak = kural) | **0** |
| Önbellek toplam satır | 28 | 27 |
| `app_states` mazmun kaydı | 3 kullanıcıda 3 kayıt (2'si "Gazel") | değişmedi — uygulama açılışta onarır |

`app_states` **bilerek** değiştirilmedi: kullanıcı verisi silinmez/yeniden
yazılmaz. `okzKonulariOnar` açılışta her kaydın `topic` alanını `kazanim`
metninden yeniden hesaplar (v92'de aynı yol kullanıldı).

## 5) Test

Yeni dosya: `tests/v94-mazmun-soz-sanatlari.test.js` — **42/42**

1. Veri: mazmun Gazel'de yok, Ahenk'te var; sözlük 92 terim; Saf Şiir terimleri
   değişmedi; "imge" bağlanmıyor.
2. `okz-tde-veri.js` sözlüğü JSON ile birebir; `konu_esleme` Gazel'de mazmun yok,
   Ahenk'te var.
3. Eşleme: vaka kazanımı → **Şiirde Ahenk** (saf şiir değil, gazel değil);
   "gazel/matla" hâlâ Gazel; "saf şiir + mazmun" hâlâ Saf Şiir;
   "söz sanatı"/"edebî sanat" → Ahenk; yalnız "imge" hiçbir konuya zorlanmıyor.
4. Uygulama: eski **"Gazel"** önbellek satırı yeni kuralca tazeleniyor;
   elle/LLM kararı ezilmiyor.
5. Migration 0012: yalnız `kaynak='kural'` + mazmun satırını siler,
   `app_states`'e dokunmaz.
6. Sürüm damgası: `v94-mazmun-soz-sanatlari` (PWA_SURUM = SW CACHE).

Güncellenen testler:
- `tests/dom/dom-v64-tde-kazanim.test.js` — vaka artık Ahenk (46/46)
- `tests/v92-saf-siir-ayri-konu.test.js` — mazmun beklentileri v94'e göre (49/49)
- `tests/v93-uc-saha-hatasi.test.js`, `tests/v93b-yerel-bildirim-ikoni.test.js` —
  sürüm kapıları `v9[3-9]` (yeni sürümde kırılmasın)

`npm run -s test:hepsi` → **EXIT 0**

## 6) Sürüm

`v94-mazmun-soz-sanatlari` (app-pwa.js `PWA_SURUM`, sw.js `CACHE`).
Uygulamayı kapat-aç: yeni service worker devralır, eski "Gazel" kayıtları
açılışta kendiliğinden Şiirde Ahenk'e taşınır.
