# v84 — "Nedenleri seç" listesi pencere olarak açılıyor + güncel site adresi

**Yayın:** `v84-neden-penceresi` · deploy `dpl_EJ5DnZShfyELEDumYZCsC7Dfj6n3` (READY / PROMOTED)
**Alias:** `analiz-merkezi.vercel.app` · **Kod commit:** `32aa078`
**Test:** `tests/dom/dom-v84-neden-listesi.test.js` 39/39 · `test:hepsi` tamamı yeşil

---

## 1) "Denemede nedenleri seç diyince liste açılsın"

**Önce:** Denemelerim'de "Nedenleri seç" düğmesi sayfayı aşağı kaydırıp "Analiz bekliyor"
kartına götürüyordu. Kullanıcı ekranda belirgin bir şey olmadığı için listenin
açılmadığını görüyordu.

**Şimdi:** Düğme **pencere** açıyor.

- **Nedenleri seç** (yeşil şerit) → pencere: başlıkta "Nedenleri seç · N soru", her satırda
  soru no, konu, ders ve YANLIŞ/BOŞ etiketi, satır başına neden listesi.
- Satırdaki **"analiz bekliyor (N) →"** düğmesi de aynı pencereyi açıyor.
- Yanlış satırında yanlış nedenleri, **boş** satırında boş nedenleri listelenir (v79 kuralı).
- **"Yanlışların tümüne / Boşların tümüne"** kısayolları hem sayfada hem pencerede.
- **Nedenleri kaydet** → analiz oluşur. Kalan soru varsa pencere tazelenir ve açık kalır;
  iş bittiyse **kendiliğinden kapanır**.
- Liste **tek kaynaktan** üretiliyor (`okzNedenListesiHtml`): sayfadaki kartla pencere aynı
  HTML'i kullanır, ayrışamaz. Satır sınırı yine 25 (öğrenci yükü kuralı korundu).
- Sayfadaki kartta da **"Listeyi pencerede aç"** düğmesi var.

Not: aynı satır hem kartta hem pencerede olabildiği için neden toplama kuralı
güçlendirildi — **boş seçim dolu seçimi ezmez**.

## 2) "Depoda eski Netlify bağlantısı yazıyor — güncelini yaz"

| Yer | Önce | Şimdi |
|---|---|---|
| `sw.js` (kök `APP_URL`) | `https://analizmerkezii.netlify.app/` | `https://analiz-merkezi.vercel.app/` |
| `BILDIRIM-DUZELTME-NOTU.md` | Netlify adresi | güncel Vercel adresi |
| `docs/SURUM-KARSILASTIRMA.md` | "canlı Netlify: …" | "ESKİ yayın … artık kullanılmıyor" + üstte güncel adres |
| `docs/NETLIFY-YAYIN.md` | eski yolu anlatıyordu | başa **arşiv** uyarısı + güncel adres + güncel belge bağlantısı |

Yayınlanan service worker (`site/sw.js`) zaten `self.location.origin` kullanıyor;
depodaki eş kopya (kök `sw.js`) artık güncel adresi taşıyor.
`netlify.toml` dosyası depoda duruyor (yayına girmiyor, Vercel derlemesi `deploy/build.sh`
ile yalnız `site/` klasörünü kopyalıyor) — istenirse ayrıca silinebilir.

---

## Canlı doğrulama

| Ne | Nerede | Sonuç |
|---|---|---|
| Sürüm damgası | `app-pwa.js?v=84` | `const PWA_SURUM = "v84-neden-penceresi";` |
| Önbellek damgası | `sw.js?v=84` | `analiz-merkezi-v-20261027-v84-neden-penceresi` |
| Sayfa | `analiz-merkezi.vercel.app` | alt bilgi: "Analiz Merkezi v84-neden-penceresi" |
| Deploy | Vercel | `dpl_EJ5DnZShfyELEDumYZCsC7Dfj6n3` READY / PROMOTED, alias atandı |
| Pencere davranışı | `tests/dom/dom-v84-neden-listesi.test.js` | açılıyor, 2 satır listeleniyor, kaydet → tazeleniyor, iş bitince kapanıyor (39/39) |

## Dokunulmayanlar

Eşikler (P_L0 0.12 / P_G 0.25 / P_S 0.10 · onay L≥0.85 & oran≥0.80), `KISA_ARALIK_GUN=3`,
28 gün kuralı, `state` anahtarı "Ders > Konu", AYT_WEIGHT, `MEMORY_CRITICAL`, `REVIEW_LADDER`,
tek tekrar düğmesi, soru puanlaması, `hata_gecmisi` 40 tavanı, soru havuzları (192 havuz /
2110 soru) — hiçbiri değişmedi.
