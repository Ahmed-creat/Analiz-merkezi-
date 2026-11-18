# DEVİR NOTU — `arena/4cc1805b-analiz-merkezi` → `arena/cc4de070-analiz-merkezi`

**Tarih:** 2026‑11‑17 · **Kaynak dal:** `arena/4cc1805b-analiz-merkezi` @ `483b781` · **Hedef dal:** `arena/cc4de070-analiz-merkezi` @ `30c5c03`
**Ortak ata:** `ab28a4a` (iki dal bu noktadan sonra ayrı ayrı ilerlemiş)

Bu not, hedef daldaki ajanın **tek başına, soru sormadan** uygulayabileceği şekilde yazıldı. Tüm sayılar bu tarihte ölçüldü.

---

## 0. Tek cümlelik özet

**Merge etmeyin.** Hedef dalda 153 eski havuzu `arsiv/` altına **taşıyın**, sonra kaynak daldan **yalnız iki içerik klasörünü** `git checkout` ile alın; ardından 3 yenileme adımı (konu eşlemesi, SW önbellek listesi, kapılar). Sonuç: canlıda **yalnız ders kitabından üretilmiş 192 havuz**, çakışma sıfır.

---

## 1. Neden merge değil? (ölçüldü)

Hedef dalın ucuna kaynak dalı merge etme denemesi (geçici worktree; hiçbir dala yazılmadı):

| Çakışma türü | Adet |
|---|---|
| `CONFLICT (modify/delete)` | 19 |
| `CONFLICT (rename/delete)` | 3 |
| `CONFLICT (content)` | 12 |
| **Toplam CONFLICT satırı** | **34** |
| **Etkilenen tekil dosya** | **32** |
| Bunlardan soru havuzu dosyası | 21 |

Sebep basit: iki dal aynı havuz dosyalarını farklı yönlerde ele almış (hedef dal sildi/taşıdı, kaynak dal düzenledi), ayrıca uygulama tarafındaki 12 dosya iki tarafta da değişmiş.

**`CONFLICT (content)` olan 12 dosya (hepsi hedef dalın app işi — bizden ALINMAMALI):**

```
site/app-pwa.js
site/content/konu_esleme.json
site/content/mufredat/kazanim_konu_10.json
site/content/soru_havuzlari/index.json
site/konu-anahtar.js
site/okz-meb.js
site/sw.js
tests/kisa-kontrol.test.js
tests/konu-bulma.test.js
tests/meb-kazanim.test.js
tests/okz-konu-entegrasyon.test.js
tests/okz-konu.test.js
```

> `index.json` ve `sw.js` yukarıda "alınmamalı" listesinde görünüyor ama **içerikleri** bizden alınacak; sadece *merge* edilmemeli. Doğrusu 4. adımda bizim kopyayı almak (bkz. §4).

---

## 2. İki dalın havuz envanteri

| | Kaynak dal (`483b781`) | Hedef dal (`30c5c03`) |
|---|---|---|
| `site/content/soru_havuzlari/*.json` | **192 havuz + index.json** | 153 havuz |
| Ortak dosya | 140 — **hepsinin içeriği kaynak dalda düzeltilmiş** | |
| Yalnız kaynak dalda | **53** (bkz. Ek A) | |
| Yalnız hedef dalda | **13** (bkz. Ek B) — hepsi eski havuz | |
| `arsiv/` klasörü | var (fizik 43, tarih 26, …) | **yok** |
| `docs/uretim/araclar/` (denetim araçları) | 16 araç | **yok** |

**Kritik:** "Hedef dalda olup kaynak dalda olmayan" 13 havuz eksiklik değil; kaynak dalda **bilinçli olarak arşive** taşınmış eski havuzlardır (Ek B'de arşiv yolları verildi).

---

## 3. Kararlar (kullanıcı talimatı — bunlara uyulacak)

1. **Eski hiçbir havuz canlıda kullanılmayacak.** Canlı set = yalnızca ders kitabından üretilen havuzlar. Bu yüzden hedef dalın 153 havuzu **silinmeyecek, arşive taşınacak**; eski 13 havuz da (fizik `u01_k02-04`, tarih `tarih_10_*`) canlıya geri getirilmeyecek.
2. **Türk Dili ve Edebiyatı'nda "Yazım Kuralları" ve "Noktalama İşaretleri" havuzları olduğu gibi kalacak.** Bu 2 havuz ders kitabından değil hazır paketten geliyor; kullanıcı bilinçli istisna olarak kabul etti. **Yeniden yazılmayacak, dokunulmayacak.**
3. **Hedef dalın uygulama işi korunacak:** `app-pwa.js`, `konu_esleme.json` (MEB kodu eşlemesi), `kazanim_konu_10.json`, `sw.js` içeriği, `package.json`, `tests/` — bunlar hedef dalda kalır. Kaynak daldan **alınmaz**.
4. Kaynak daldan alınacak tek şey **havuz içeriği** (+ istenirse denetim araçları ve spec arşivi).

---

## 4. Uygulama — 5 adım (kopyala‑yapıştır)

Hedef dalda, depo kökünde:

### Adım 1 — Mevcut 153 havuzu arşive **taşı** (silme!)

```bash
mkdir -p arsiv/soru_havuzlari/eski-site arsiv/soru_havuzlari/eski-pwa
git mv site/content/soru_havuzlari/*.json      arsiv/soru_havuzlari/eski-site/
git mv pwa-files/content/soru_havuzlari/*.json arsiv/soru_havuzlari/eski-pwa/
```

`index.json` da bu komutla arşive gider; sorun değil — Adım 2 onu geri getiriyor.

### Adım 2 — Yeni havuzları al (192 havuz + `index.json`)

```bash
git fetch origin arena/4cc1805b-analiz-merkezi
git checkout origin/arena/4cc1805b-analiz-merkezi -- \
  site/content/soru_havuzlari pwa-files/content/soru_havuzlari
```

`index.json` kaynak dalda **192 kayıtlı ve tutarlı** (`havuz_sayisi: 192`). Elle indeks kurcalamaya gerek yok; istersen `npm run havuz:index` ile yeniden üretip aynı sonucu doğrulayabilirsin.

### Adım 3 — MEB ↔ konu eşlemesini 192'ye çıkar

```bash
npm run esleme:uret     # scripts/konu-esleme-uret.js
```

**Neden zorunlu:** `tests/meb-kazanim.test.js` içinde `esleme kaydı = havuz sayısı` kontrolü var. Hedef dalın eşlemesi 153 havuz için; havuzlar 192 olunca test kırmızıya döner.

### Adım 4 — Service worker önbellek listesini eşitle

```bash
git checkout origin/arena/4cc1805b-analiz-merkezi -- docs/uretim/araclar/
node docs/uretim/araclar/sw-precache-esitle.js
```

Bu araç `site/sw.js` içindeki `./content/soru_havuzlari/...` satırlarını canlı havuzlarla birebir eşitler (kaynak dalda 193 satır = 192 havuz + index). **`CACHE` adına dokunmaz** — v72b'de düzelttiğiniz "eski sürümde kalma" bandı korunur.

Alternatif (araç almak istemiyorsan): `site/sw.js` dosyasını da `git checkout origin/... -- site/sw.js` ile al; ancak o zaman SW'ye ait diğer değişiklikleriniz de kaynak sürümle değişir — önerilmez.

### Adım 5 — Kapılar

```bash
npm run validate:pools           # beklenen: çıkış 0
npm run test:hepsi               # beklenen: 67/67 geçti
diff -rq site/content/soru_havuzlari pwa-files/content/soru_havuzlari   # beklenen: ÇIKTI YOK
node docs/uretim/araclar/havuz-denetle.js --tumu   # beklenen: hata 0 · uyarı 0
```

Son komut Adım 4'te `docs/uretim/araclar/` alındıysa çalışır.

**Hâlâ kırmızı varsa bakılacak tek yer:** kendi testlerinizin havuz sayısı iddiaları (`konu-bulma`, `okz-konu`, `meb-kazanim`) — hepsi "dosya sayısı = eşleme sayısı = indeks sayısı" üçlüsünü kontrol eder. Üçü de 192'ye çekilmeden yeşile dönmez.

---

## 5. Kaynak dalın doğrulanmış durumu (referans)

| Kapı | Sonuç |
|---|---|
| `havuz-denetle.js --tumu` | 192 dosya · **hata 0 · uyarı 0** |
| `validate:pools` | çıkış 0 |
| `test:hepsi` | **67/67 geçti** (158 çıktı · 612 süreç · 1.686 hedef soru) |
| `site ↔ pwa` havuz eşitliği | birebir |
| `durum.js` | havuz 171/171 · soru 1832/1788 · kart 1832 · görselli 61 |
| `kaynak-denetle.js` | 192 havuz: **190 ders kitabı**, 2 hazır paket (TDE Yazım Kuralları, Noktalama İşaretleri — kabul edilen istisna) |

Ders dağılımı (canlı havuz / kitap kaynaklı): Fizik 25/25 · Din 24/24 · Felsefe 23/23 · Matematik 21/21 · Biyoloji 19/19 · Kimya 19/19 · Coğrafya 18/18 · Tarih 14/14 · TDE 29 (27 kitap + 2 istisna).

Bu turda kapatılan uyarılar: **Kimya 243, Fizik 270, Matematik 298** → üçü de 0 (kart önü kalıbı, soruya benzerlik, uzun doğru şık, tanım sorusu, şık dağılımı).

---

## 6. Opsiyonel: alınabilecek araçlar ve arşiv

Dosya içeriğine dokunmadıkları için çakışma riski yok; kalite kapılarını hedef dalda da çalıştırmak isterseniz:

```bash
git checkout origin/arena/4cc1805b-analiz-merkezi -- docs/uretim/araclar docs/uretim/uretim
```

- `docs/uretim/araclar/havuz-denetle.js` — **tek gerçek denetim kaynağı** (kart kalıbı, benzerlik, şık dengesi, tanım düzeyi, görsel atfı, havuzlar arası kopya, şık dağılımı).
- `havuz-ekle.js` — spec (`onlar`, `duzeltmeler`) ile site + pwa'ya birlikte yazar; havuz JSON'larını elle düzenlemek yasak.
- `sw-precache-esitle.js`, `kaynak-denetle.js`, `durum.js`, `havuz-kunye.js`, `beceri-dagit.js`.
- `docs/uretim/uretim/*-tamlik*.js` — bu üç dersin düzeltme spec'lerinin arşivi (yeniden üretilebilirlik için).

---

## 7. Bilinen tuzaklar

1. **PWA kopyası ayrı klasör:** `pwa-files/content/soru_havuzlari/` her zaman `site/...` ile birebir olmalı. Sadece birini kopyalamak, PWA'da eski soruları gösterir.
2. **`index.json` elle düzenlenmez** — `scripts/havuz-index-uret.js` üretir; uygulama havuzu bu manifestten bulur.
3. **`site/sw.js` önbellek listesi** güncellenmezse eski havuzlar önbellekten servis edilir (v72b'de yaşanan sorun).
4. **`konu_esleme.json` sayısı** havuz sayısıyla eşit olmalı; MEB kodu ↔ konu kararlarınız korunur, sadece kayıt sayısı 192'ye çıkar.
5. **Depo kökündeki eski uygulama artıkları:** `content/soru_havuzlari/` (153 eski havuz), `sw.js`, `bkt-engine.js`, `app-pwa.js` kökte duruyor ve `/content/soru_havuzlari/...` yoluna bakıyor. Canlı uygulama `site/` (kökte `index.html` yok). Bunlar servis edilmiyor ama karışıklık yaratıyor; istenirse `arsiv/` altına taşınabilir.
6. **`docs/uretim/DURUM.md`** üretim panosudur ve dal başına farklıdır; içeriği tartışma konusu yapılmamalı, kendi dalınızda `node docs/uretim/araclar/durum.js` ile yeniden üretin.

---

## Ek A — Yalnız kaynak dalda olan 53 havuz (canlıya alınacak)

- **Tarih (14):** `tar_10_u01_k01..k04`, `tar_10_u02_k05..k09`, `tar_10_u03_k10..k14` *(yeni id'ler; eski `tarih_10_*` havuzlarının yerine kitaptan yazıldı)*
- **Din (11):** `din_10_u01_k04`, `u02_k03..k07`, `u03_k04`, `u04_k04`, `u05_k03..k05`
- **Biyoloji (8):** `biyo_10_u01_k08..k10`, `u02_k05..k09`
- **Fizik (7):** `fizik_10_u01_k05..k09`, `u02_k05`, `u04_k07`
- **Coğrafya (7):** `cogr_10_u04_k02`, `u05_k02`, `u05_k03`, `u06_k02..k04`, `u07_k01`
- **Kimya (5):** `kimya_10_u01_k09`, `u02_k06..k08`, `u03_k02`
- **Edebiyat (1):** `edebiyat_10_u03_k06`

## Ek B — Yalnız hedef dalda olan 13 havuz (canlıya DÖNMEYECEK)

Hepsi eski / kitap dışı havuzlar; kaynak dalda arşivdeler:

| Dosya | Kaynak daldaki arşiv yolu |
|---|---|
| `fizik_10_u01_k02.json`, `fizik_10_u01_k03.json`, `fizik_10_u01_k04.json` | `arsiv/soru_havuzlari/fizik/` |
| `tarih_10_u01_k01..k03`, `tarih_10_u02_k01..k02`, `tarih_10_u03_k01..k05` (10 dosya) | `arsiv/soru_havuzlari/tarih/eski-tarih_10_*.json` |

Arşivleme gerekçeleri: `d06e7b0` (Fizik 1. ünite kitabın alt konularına bölündü, 5 havuz sıfırdan yazıldı) ve `897ff0b` (Tarih tur‑2: 14 havuz kitaptan, 24 eski havuz arşivde).

## Ek C — Hedef dalın sildiği 20 havuz

Bu 20 dosyanın **17'si** kaynak dalda canlı ve düzeltilmiş durumda (Adım 2 ile gelir). Kaynak dalda canlı olmayan 3 tanesi:

```
edebiyat_10_u04_k06.json   → arsiv/soru_havuzlari/edebiyat/
tarih_10_u01_k04.json      → arsiv/soru_havuzlari/tarih/
tarih_10_u02_k05.json      → arsiv/soru_havuzlari/tarih/
```

Karar: bu 3 dosya da canlıya alınmaz (arşivdeki hâlleri yeterli).

---

## Ek D — Doğrulama kontrol listesi (hepsi yeşilse iş bitti)

- [ ] `site/content/soru_havuzlari/*.json` = **192 + index.json**
- [ ] `pwa-files/content/soru_havuzlari/` ile `diff -rq` → **çıktı yok**
- [ ] `arsiv/soru_havuzlari/eski-site/` = 153 dosya (hiçbiri silinmedi)
- [ ] `npm run validate:pools` → 0
- [ ] `npm run test:hepsi` → 67/67
- [ ] `node docs/uretim/araclar/havuz-denetle.js --tumu` → hata 0 · uyarı 0
- [ ] `site/sw.js` önbellek satırı = 193
- [ ] `site/content/konu_esleme.json` `havuzlar` dizisi = 192
