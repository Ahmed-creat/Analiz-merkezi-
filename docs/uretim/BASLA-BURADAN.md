# BAŞLA BURADAN — Soru Üretim Görevi

> Bu dosya, 10. sınıf soru havuzlarını üretecek **ajana/kişiye** verilecek giriş
> noktasıdır. Önce bunu oku, sonra `SORU-URETIM-TALIMATI.md`'ye geç.

---

## 1. Görev tek cümlede

Dokuz dersin **158 öğrenme çıktısı** için, her çıktıya bir JSON soru havuzu yaz.
Toplam **1.686 soru**. Sorular ders kitaplarından üretilir; kazanım ve süreç
bileşenleri resmî programdan gelir ve **değiştirilmez**.

---

## 2. Okuma sırası

| # | Dosya | Ne için |
| --- | --- | --- |
| 1 | `docs/uretim/TUM-KAZANIMLAR-10SINIF.md` | **158 çıktı + 612 süreç bileşeni**, ders/tema bazında tam döküm |
| 2 | `docs/uretim/SORU-URETIM-TALIMATI.md` | Kurallar, JSON şeması, kalite ölçütleri, kabul testleri |
| 3 | `docs/uretim/uretim-plani.json` | Makine tarafı iş emri (hedef soru, konu_id, dosya adı) |
| 4 | `docs/uretim/ornekler/din_10_t01_c01.json` | **Altın örnek havuz** — şablonu birebir taklit et |
| 5 | `docs/uretim/PLAN-TABLOSU.md` | Tek sayfalık özet tablo |
| 6 | `docs/TYMM-DENETIM-2026.md` | Hangi çıktının sorusu var/yok (öncelik sırası) |

---

## 3. Dal (branch) ve PR — nasıl çalışmalı?

Bu iş **mevcut açık PR ile aynı hattın devamıdır**, ama aynı dala doğrudan
yazılmamalıdır.

### Durum

- Açık PR: **#4** — `arena/cc4de070-analiz-merkezi` → `main`
- Bu dalda plan, talimat ve resmî veri dosyaları var.
- Bu dal **aktif olarak başka bir ajan tarafından** kullanılıyor (uygulama
  düzeltmeleri). Doğrudan buraya push etmek **çakışma** üretir.

### Önerilen akış (güvenli)

```bash
git fetch origin
git checkout -b soru-uretim origin/arena/cc4de070-analiz-merkezi
# … çalış …
git add site/content/soru_havuzlari/ docs/uretim/
git commit -m "10. sınıf soru havuzları (158 çıktı)"
git push -u origin soru-uretim
gh pr create --base arena/cc4de070-analiz-merkezi --head soru-uretim \
  --title "10. sınıf soru havuzları" \
  --body "docs/uretim/uretim-plani.json planına göre üretildi."
```

Böylece:

- Üretim kendi PR'ında görünür (inceleme ve geri alma kolay).
- `arena/cc4de070-analiz-merkezi` dalı bozulmaz.
- O PR birleştiğinde değişiklikler #4'e akar, sonra #4 `main`e gider.

### Alternatif

PR #4 birleştikten sonra doğrudan `main`den dal aç:

```bash
git checkout -b soru-uretim origin/main
```

### Yapılmayacaklar

- ❌ `arena/cc4de070-analiz-merkezi` dalına **doğrudan** push etme.
- ❌ PR #4'ü **merge etme** — birleştirme kararı kullanıcınındır.
- ❌ `main`e doğrudan push etme.

---

## 4. Yazma iznin olan yerler

| Yol | İzin |
| --- | --- |
| `site/content/soru_havuzlari/<konu_id>.json` | ✅ yeni dosya yaz |
| `site/content/soru_havuzlari/index.json` | ⚠️ **elle yazma** — `node scripts/havuz-index-uret.js --plan` üretir |
| `docs/uretim/` | ✅ rapor/not ekleyebilirsin |
| `site/app-pwa.js`, `site/bkt-engine.js`, `site/okz-meb.js`, `site/sw.js` | ❌ **dokunma** |
| Mevcut `*_10_uNN_kNN.json` havuzları | ❌ silme/değiştirme (geçiş döneminde korunur) |

---

## 5. Kritik uyarı: yayınlanan dizin

Vercel **`site/`** klasörünü yayımlar (`deploy/build.sh`).

Yazılacak yer: **`site/content/soru_havuzlari/`**

Kök `content/soru_havuzlari/` eski bir kopyadır (153 dosya, bayat). **Oraya yazma** —
uygulamaya hiç ulaşmaz.

---

## 6. Ders kitapları

Program belgeleri repoda; **ders kitabı PDF'leri repoda DEĞİL.**

- OGM Materyal: `https://ogmmateryal.eba.gov.tr/ders-kitaplari` (sınıf → ders)
- Ayna: `https://www.mebders.com/kategori/368-2021-2022-yili-10sinif-pdf-ders-kitaplari/`

10. sınıf kitapları **2025-10-07**'de yayımlandı ve **yeni müfredata** göredir.
Eski (2018) baskı kullanılmaz.

> Din Kültürü TYMM sitesinde listelenmez; programı
> `mufredat.meb.gov.tr/Dosyalar/2026313101155916-dkab912.pdf`
> (sha256 `c48c7083d24b106321ee5ba403ce05b54d9fc9b3a68ed1242bbf5989d5faa8c3`).

---

## 7. Bitirmeden önce çalıştır

```bash
node scripts/soru-uret-dogrula.js site/content/soru_havuzlari   # 0 hata olmalı
node scripts/havuz-index-uret.js --plan --kontrol               # 0 hata olmalı
npm run -s validate:pools
node tests/question-pools.test.js
npm run -s test:hepsi
```

Hepsi geçmeden PR açma.

---

## 8. Özet akış

```
TUM-KAZANIMLAR-10SINIF.md        → hangi çıktı, hangi süreç bileşenleri
        ↓
uretim-plani.json                → kaç soru, hangi konu_id, hangi dosya
        ↓
ders kitabı                      → içerik
        ↓
her süreç bileşeni için ≥2 soru  → alt_beceri = süreç metni
        ↓
site/content/soru_havuzlari/*.json
        ↓
soru-uret-dogrula.js → havuz-index-uret.js → validate:pools → test:hepsi
```
