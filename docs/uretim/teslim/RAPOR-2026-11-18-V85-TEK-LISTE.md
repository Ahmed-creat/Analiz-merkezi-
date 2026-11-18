# v85 — Neden listesi tek yerde: pencere

**Yayın:** `v85-tek-liste` · **Kod commit:** bu sürümün commit'i
**Test:** `dom-v84-neden-listesi` 39/39 · `v79-analiz-bekliyor` 35/35 · `dom-v83-sade-okz` 44/44 · `test:hepsi` tamamı yeşil

---

## Kullanıcı bildirimi

> "Tmm düğmeye basılınca açılıyor ama hala altta da duruyor."

Haklı. v84'te liste **iki yerde** çiziliyordu: "Nedenleri seç" düğmesinin açtığı **pencere**
ve Denemelerim sayfasının altındaki **"Analiz bekliyor" kartı**. Kullanıcı düğmeye basınca
liste açılıyordu ama aynı satırlar sayfada da duruyordu.

## Düzeltme

- Denemelerim sayfasındaki **satır listesi tamamen kaldırıldı** (kart, seçim kutuları,
  "tümüne" düğmeleri, kaydet düğmesi). Neden seçimi artık **yalnız pencerede**.
- Sayfada kalan: **yeşil özet şeridi** — "N soru neden bekliyor" + **Nedenleri seç** düğmesi.
  Bu bir liste değil, bilgi + giriş noktası. Neden bekleyen soru kaldıkça görünür.
- **Satırdaki "analiz bekliyor (N) →"** düğmesi ve satırın kendisi: neden bekleyen denemede
  doğrudan **pencereyi** açar (v79'daki "tuşa basılınca açılsın" isteği korunuyor).
  Artık aşağı kaydırma yok — çünkü kaydırılacak kart yok.
- Pencere: kaydet → kalan varsa tazelenir ve açık kalır, iş bittiyse kendiliğinden kapanır.
  Satır sınırı 25 (öğrenci yükü kuralı) aynen duruyor.

## Testler (davranış değiştiği için ölçüt de değişti, gevşetilmedi)

| Test | Ne ölçüyor |
|---|---|
| `dom-v84-neden-listesi` | sayfada liste kartı **YOK**; pencere açılıyor, satırlar doğru, kaydet → tazele/kapat |
| `v79-analiz-bekliyor` | tuşa basınca **pencere** açılıyor; bekleyen yoksa ders detayına iniyor; yanlış/boş listeleri ayrı |
| `dom-v83-sade-okz` | şerit bilgi veriyor + **sayfada tek bir `okz-reason` seçimi yok** |

## Dokunulmayanlar

Eşikler (P_L0 0.12 / P_G 0.25 / P_S 0.10 · onay L≥0.85 & oran≥0.80), `KISA_ARALIK_GUN=3`,
28 gün kuralı, `state` anahtarı "Ders > Konu", AYT_WEIGHT, `MEMORY_CRITICAL`, `REVIEW_LADDER`,
tek tekrar düğmesi, soru puanlaması, `hata_gecmisi` 40 tavanı, soru havuzları (192 havuz /
2110 soru) — hiçbiri değişmedi.
