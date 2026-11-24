# v86 — Okulizyon: defter kalktı, ölçü Denemelerim · "tümüne" gerçekten tümüne

**Yayın:** `v86-denemelerim-karsilastir` · **Kod commit:** `4f68ae1`
**Vercel:** `dpl_ERL9wr9a6gZQTmvuwjJDTHJKP3WL` — READY / **PROMOTED** (production) · https://analiz-merkezi.vercel.app
**Test:** `test:hepsi` **EXIT 0 / 0 ✗** (v86 yeni testi 28/28 · kuyruk 42/42 · olukod 17/17 · v79 36/36 · dom-v84 39/39)

---

## 1) "Tüm verileri silsem de yeni denemeyi hâlâ 'aynı' diyor"

**Sen haklıydın.** Uygulamada *çekme defteri* denen kalıcı bir liste vardı: Okulizyon'dan bir kez
içe alınan sınavın "işlendi" parmak izi hem `state` içine hem **localStorage'a** yazılıyordu.
"Tüm verileri sil" `state`'i sıfırlıyor ama **diskteki defter kalıyordu**. Sonuç: Denemelerim
bomboş olduğu hâlde sınav "zaten işlendi" sayılıyor, içe alınmıyor ve ekran
"Her şey güncel: 1 sınav okundu, Denemelerim'dekilerle aynı." diyordu.

**Yeni kural — tek cümle:**

> Sınav **Denemelerim'de duruyorsa aynı**, durmuyorsa çekilir.

- "İşlendi / yoksayıldı" defteri **tamamen kaldırıldı** (kod, localStorage anahtarı, profildeki
  "İçe aktarma defterini sıfırla" düğmesi).
- Eski defter cihazlarda bir kez otomatik silinir (`am_okz_islenen_v1` → çöp).
- Karşılaştırma **sid** (Okulizyon sınav kimliği) ile yapılır; sid yoksa ad + tarih.
- **Tek istisna:** bir denemeyi *tek tek* silersen 5 dakika sonra geri gelmesin diye küçük bir
  "silindi" notu tutulur. **"Tüm verileri sil" bu notu da temizler** → sıfırlama sonrası ilk
  çekim her şeyi yeniden getirir. (Senin testin tam olarak bu yolu kullanıyor.)

Ek düzeltme: aynı ad + tarihli **farklı** Okulizyon sınavı artık birbirinin üstüne yazılmıyor
(önce sid eşleşmesi aranıyor) — bu da "yeni deneme geldi" deyip ekranda hiçbir şeyin
değişmemesi hatasını kapatıyor.

## 2) "Tüm yanlışlara konu eksiği → hepsine değil, listede görünene işaretliyor"

Pencere ilk **25 satırı** çiziyor (öğrenci yükü kuralı). Eski "tümüne" düğmesi yalnız ekrandaki
`<select>`'leri doldurup onları okuyordu → 25'ten sonraki sorular boş kalıyordu.

Artık neden **doğrudan kayda** yazılıyor: ekranda 25 satır görünse de **bütün bekleyen
yanlışlar** (ya da **bütün boşlar**) tek dokunuşta işaretlenir. Kural korunuyor:

- yanlış listesindeki neden **boş** satıra, boş listesindeki neden **yanlışa** yazılmaz,
- nedeni zaten yazılmış satıra dokunulmaz (senin seçimin ezilmez),
- iş bitince pencere kendiliğinden kapanır.

## 3) Neden böyle yapıldı (senin cümlenle)

> "Uygulama eğer Denemelerim bölümünde deneme varsa onunla karşılaştırsın."

Aynen bu: **Denemelerim zaten doğrunun kendisi.** İkinci bir "işlendi" listesi tutmak, iki
listenin çelişmesi demekti — bu hatanın kaynağı buydu. Artık tek ölçü var.

## Yayın sonrası canlı doğrulama

| Ne | Beklenen | Canlıda |
|---|---|---|
| Ana sayfa alt bilgi | "Analiz Merkezi v86-denemelerim-karsilastir" | ✓ |
| `sw.js` | `CACHE = "analiz-merkezi-v-20261027-v86-denemelerim-karsilastir"` | ✓ |

> Not: tarayıcıda **bir kez kapat-aç** (ya da sayfayı yenile). Service worker ağ-öncelikli
> çalıştığı için çevrimiçiyken yeni dosyayı hemen alır.

### Sınamak için (senin adımların)

1. Ayarlar → **Tüm verileri sil**.
2. Profil → Okulizyon → **Şimdi dene** (ya da denemelerim sayfasını aç; çekim kendiliğinden).
3. Artık "aynı" demez: denemeler **Denemelerim'e yeniden yazılır** ve yeşil şeritte
   "Okulizyon'dan N deneme eklendi" görünür.
4. Denemelerim → **Nedenleri seç** → "Yanlışların tümüne → Konu eksiği" de. 25'ten fazla
   bekleyen olsa da **hepsi** işaretlenir; boşlar için "Boşların tümüne" ayrı çalışır.

## Dokunulmayanlar

Eşikler (P_L0 0.12 / P_G 0.25 / P_S 0.10 · onay L≥0.85 & oran≥0.80), `KISA_ARALIK_GUN=3`, 28 gün
kuralı, `state` anahtarı "Ders > Konu", AYT_WEIGHT, `MEMORY_CRITICAL`, `REVIEW_LADDER`, tek tekrar
düğmesi, soru puanlaması, `hata_gecmisi` 40 tavanı, soru havuzları — **hiçbiri değişmedi.**

## Testler (yeni davranış, gevşetilmiş ölçüt yok)

| Test | Ne ölçüyor |
|---|---|
| `tests/v86-okz-karsilastir.test.js` (yeni) | 40 satırlık denemede "tümüne" 30 yanlışın **tamamını** yazar; boş/yanlış ayrımı; işlenmiş satır korunur; karar yalnız Denemelerim |
| `tests/okz-kuyruk.test.js` (yeniden yazıldı) | sıfırlama sonrası sınav **yeni** sayılır; eski defter diskten silinir; tek silme geri gelmez; içerik değişirse gelir |
| `tests/v78-olukod.test.js` | defter fonksiyonu/düğmesi/işleyicisi **yok**; karşılaştırma Denemelerim'e göre |
| `tests/v79-analiz-bekliyor.test.js` | işleyici köprüyü doğru argümanlarla çağırıyor |
| `tests/dom/dom-v84-neden-listesi.test.js` | "tümüne" → köprü + pencere tazeleme |
