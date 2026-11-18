# RAPOR — 18 Kasım · 40. tur · "Analiz Bekliyor" düzeltmeleri · TOPLU YAYIN (v80)

**Tarih:** 2026-11-18 · **Dal:** `arena/cc4de070-analiz-merkezi` · **Bitiş commit'i:** `1903621`
**Yayın:** `dpl_HxmTHfspQzzddyMY8kVR4Udp7bQf` → **PROMOTED** (önceki: `dpl_EPQJuYvSVN3gLgB6nCGZDHBV6BDu`) · https://analiz-merkezi.vercel.app
**Sürüm damgası:** `v81-surum-guncel` (PWA_SURUM ↔ SW CACHE `analiz-merkezi-v-20261118-v81-surum-guncel`)

Kullanıcı (18 Kasım, 4 madde):
1. *"Profilden analiz bekliyor'u kaldırmamışsın."*
2. *"Denemelerimde analiz bekleyen deneme tuşa basılınca açılacaktı."*
3. *"Neden yanlış ve boş için aynı neden listesi kullanılıyor?"*
4. *"Analiz bekleyen bölümünün rengi normal deneme kartı gibi olmalı."*
5. *"Herşeyin güncel olduğundan emin olun."*

Dördü de bu turda kapatıldı, sürüm damgası `v80`e çekildi, yayın yapıldı ve canlıdan doğrulandı.

---

## 1) Madde madde ne değişti

| # | Kullanıcının gördüğü | Kök neden (ölçüldü) | Yapılan |
|---|---|---|---|
| **1** | Profilde hâlâ "Analiz Bekliyor" | v78'de yalnız *kuyruk listesi* kaldırılmıştı; geriye **ad + sayaç + "Denemelerim'de aç" düğmesi** ve okz penceresinde "⏳ Analiz Bekliyor (N soru)" bloğu kalmıştı. Ayrıca profilde **"N soru bekliyor"** kırmızı sayacı duruyordu. | Hepsi silindi. Profilde tek nötr düğme: **"Okulizyon sonuçları"** (yalnız çekim sonucu/duyurular). Profilde sayaç yok. Düğmesi kalmayan `okzGitDenemeler` eylemi **ölü kod bırakılmadı**, silindi. |
| **2** | Karta basınca liste açılmıyor | `examDetailSelect` yalnız yeniden çiziyordu; detay **sayfanın altında** açıldığı için ekranda hiçbir şey değişmiyordu. | Satırdaki "analiz bekliyor (N) →" artık **düğme** (`examAnaliz`): o denemeyi seçip **doğrudan karta kaydırıyor** + 2,2 sn vurgu. Satıra basmak da bekleyen varsa karta, yoksa ders detayına iniyor (boşa kaydırma yok). |
| **3** | Yanlış ve boş aynı neden listesi | `WRONG_REASONS.concat(EMPTY_REASONS)` ile **tek havuz** kuruluyordu; "tümü" düğmeleri de tüm satırlara yazıyordu. | YANLIŞ satırı → `WRONG_REASONS` (4), BOŞ satırı → `EMPTY_REASONS` (3) — deneme formundaki aynı kural. "tümü" iki gruba ayrıldı (`Yanlışların tümüne (N)` / `Boşların tümüne (N)`) ve **yalnız kendi türüne** yazar (`data-bos` filtresi). |
| **4** | Kart rengi turuncu | Kart elle amber kenar/zemin + `alert-circle`/`#B45309` ile yazılmıştı. | Normal **`bento-card`**; başlık ikonu `clipboard-list` + `var(--brand-blue)`. Satır içi "analiz bekliyor" yazısı da marka rengine çekildi. |

**Ek (aynı şikâyetin parçası):** tarayıcı DOM testi yazılırken profildeki **"N soru bekliyor"** sayacı ortaya çıktı; kullanıcı "ad + sayaç" istemiyordu, o da kaldırıldı.

---

## 2) Testler (testsiz düzeltme yok)

**Yeni test:** `tests/v79-analiz-bekliyor.test.js` — **30/30** (zincire `test:okzbekle` olarak eklendi).
Metin aramıyor; davranışı koşturuyor:

- `examDetailSelect` gerçekten çalıştırılıyor: neden bekleyen denemede `analiz-bekliyor`, bekleyen yokken `ders-detay` kaydırılıyor; açık istek varsa ona uyuluyor.
- `okzNedenHepsi` gerçekten çalıştırılıyor: `hedef=bos` iken **yalnız** `[data-bos="1"]` satırlarına yazıyor, yanlış satırına dokunmuyor.
- Profilde "Analiz Bekliyor" adı/sayacı/götürücüsü **kodda** yok (yorumlar ayıklanarak ölçülüyor).
- Kart `bento-card`, amber stil ve `#B45309` yok.

**Güncellenen testler (eski davranışı ölçüyorlardı):**

| Dosya | Eski beklenti | Yeni beklenti |
|---|---|---|
| `tests/v78-okulizyon-denemelerim.test.js` | "modalda 'Denemelerim'de aç' düğmesi var" | düğme **yok**, profilde ad/sayaç yok → **27/27** |
| `tests/okz-yuk.test.js` | `nedenler.slice(0,4)` + `WRONG_REASONS.concat(EMPTY_REASONS)` | yanlış/boş **ayrı** listeler, ikisi de ≥3, tek havuz geri dönmesin → **23/23** |
| `tests/profil-merge/profil-merge.test.js` (jsdom) | profilde "1 soru bekliyor", okz modalında kuyruk, `v34.` sabit sürüm | sayaç yok, "Analiz Bekliyor" yok, sürüm `PWA_SURUM`dan (`vNN`), badge **deneme** satırını sayıyor → **46/46** |

> profil-merge testi ilk kez tam yeşil: 2 eski kırığı (elle yazılmış `v34.` damgası, kuyruk sayan badge) bu turda gerçek davranışa çevrildi.

**Kapılar**

| Kapı | Sonuç |
|---|---|
| `npm run -s test:hepsi` | **EXIT 0** · 33 adım |
| `node --check` | bkt-engine · kart · app-pwa · sw · okz-tde **5/5** |
| `index.html` gömülü JS (2 blok, 5.693 satır) | **✓** |
| `npm run -s validate:pools` | **192/192** havuz geçerli |
| `npm run -s test:pools` | **192 havuz / 2.110 soru** |
| `npm run -s okz:kapsam` | 192 + 1 istisna (paragraf havuzu — kalıcı istisna) |

### 4. madde sonrası ek düzeltme — alt bilgi sürümü (v81)

Kullanıcı *"Herşeyin güncel olduğundan emin olun"* dediği için canlı sayfa kontrol edildi: sayfa alt bilgisi hâlâ **"Analiz Merkezi v5.1"** yazıyordu (G-12'de yalnız Ayarlar altındaki etiket damgaya bağlanmıştı).
- `index.html` alt bilgisi: `Analiz Merkezi <span id="am-surum-alt" data-am-surum="1">v5.1</span> · …`
- `surumEtiketiYaz()` artık `#am-surum` **ve** tüm `[data-am-surum]` öğelerini `PWA_SURUM` ile dolduruyor.
- Test: "alt bilgi sürüm damgasına bağlı", "elle yazılmış 'Analiz Merkezi v5.1' kalmadı" (`v78-kalan-duzeltmeler` → **34/34**), jsdom'da alt bilgi damgası (`profil-merge` → **48/48**).

---

## 3) Yayın ve canlı doğrulama

- Commitler `72b1361` (4 madde) ve `1903621` (alt bilgi sürümü) → GitHub dalına push edildi.
- Vercel **production** deployment: `dpl_EPQJuYvSVN3gLgB6nCGZDHBV6BDu` (v80) ve son olarak `dpl_HxmTHfspQzzddyMY8kVR4Udp7bQf` (v81) · `READY` · `readySubstate: PROMOTED` · alias `analiz-merkezi.vercel.app` atandı.
- Canlı kontroller (`fetch_page`):

| URL | Beklenen | Görülen |
|---|---|---|
| `/sw.js` | `CACHE = analiz-merkezi-v-…-v81-surum-guncel` | ✅ |
| `/app-pwa.js` satır 1 | `const PWA_SURUM = "v81-surum-guncel"` | ✅ |
| `/app-pwa.js` sürüm işlevi | `querySelectorAll("[data-am-surum]")` ile alt bilgi de dolduruluyor | ✅ |
| `/app-pwa.js` profil bölümü | "Okulizyon sonuçları" düğmesi var; "Analiz Bekliyor"/"soru bekliyor" **yok** | ✅ |
| `/app-pwa.js` okz penceresi | bekleyen bloğu ve götürücü **yok** (yalnız duyurular + defter sıfırlama) | ✅ |

---

## 4) Bilinçli olarak YAPILMAYANLAR

- **Paragraf havuzu üretilmedi** (kalıcı istisna).
- **PR #4 birleştirilmedi** (dal `pr_open`; kullanıcı "merge etme" demişti).
- Eşikler, `AYT_WEIGHT`, `REVIEW_LADDER`, `MEMORY_CRITICAL`, 5. adım kuralı — **dokunulmadı**.

---

## 5) Kullanıcıya tek cümlelik özet

Profilde "Analiz Bekliyor" adı, sayacı ve "N soru bekliyor" yazısı tamamen kalktı; Denemelerim'de satırdaki "analiz bekliyor (N) →" düğmesi o denemenin listesini açıp ekrana getiriyor; yanlış ve boş artık ayrı neden listeleri kullanıyor ve "tümü" karşı türe yazmıyor; kart normal deneme kartı görünümünde; alt bilgideki elle yazılmış "v5.1" de kalktı. Sürüm `v81-surum-guncel`, canlıda doğrulandı.
