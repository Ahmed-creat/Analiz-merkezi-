# Soru Üretim Talimatı — 10. Sınıf (MEB TYMM 2026)

> Bu dosya **soru üretecek ajan/kişi** içindir.
> Tek kaynak: `docs/uretim/uretim-plani.json` (158 iş emri, makine tarafı).
> Plan yeniden üretimi: `node scripts/soru-uretim-plani.js`
> Kabul testi: `node scripts/soru-uret-dogrula.js <dizin>`

---

## 1. İşin tanımı

10. sınıfın **dokuz dersinde**, MEB'in resmî 2026 öğretim programındaki **158 öğrenme
çıktısının her biri** için bir soru havuzu üret.

- Her çıktı = **tek bir JSON dosyası** (`konu_id.json`).
- Toplam **1.686 soru** (aşağıdaki sabit kuraldan hesaplanır, elle verilmez).
- Sorular **ders kitaplarından** üretilir; kazanım cümlesi ve süreç bileşenleri resmî
  programdan gelir ve **değiştirilmez**.

---

## 2. Girdi dosyaları (neyi kullanacaksın)

| Dosya | Ne içerir | Kullanım |
| --- | --- | --- |
| `docs/uretim/uretim-plani.json` | 158 çıktı: kod, ders, tema, kazanım, süreç bileşenleri, hedef soru, konu_id | **İş emri — tek doğru kaynak** |
| `site/content/mufredat/meb_kazanim_10.json` | 158 çıktı × 612 süreç bileşeni (resmî metin) | Kazanım/süreç doğrulaması |
| `tests/fixtures/tymm-2026-10sinif.json` | Aynı veri, sha256 damgalı resmî TYMM kopyası | Çapraz doğrulama |
| `docs/TYMM-DENETIM-2026.md` | Hangi çıktının sorusu var/yok raporu | Öncelik sırası |
| `docs/uretim/ornekler/din_10_t01_c01.json` | **Altın örnek havuz** (10 soru, birebir şema) | Şablon |
| Ders kitapları (PDF) | Konu anlatımı, örnekler, etkinlikler | Soru içeriğinin kaynağı |

### Ders kitapları nerede?

MEB 2025-2026 ders kitapları **OGM Materyal** üzerinden yayımlanır:

- `https://ogmmateryal.eba.gov.tr/ders-kitaplari` — sınıf seçilir, sol menüden ders seçilir.
- Alternatif ayna: `https://www.mebders.com/kategori/368-2021-2022-yili-10sinif-pdf-ders-kitaplari/`
  (10. sınıf kitapları 07.10.2025'te yayımlandı: TDE, Kimya, Tarih, Fizik, Felsefe,
  Matematik, Coğrafya…)

**Kritik:** 10. sınıf kitapları **yeni müfredata** göre yazılmıştır. Eski (2018) baskı
kullanılmaz — konu sırası ve terminoloji farklıdır.

> **Din Kültürü kitabı:** TYMM sitesi bu dersi listelemez; program
> `mufredat.meb.gov.tr/Dosyalar/2026313101155916-dkab912.pdf` adresindedir (sha256
> `c48c7083…`). Kitap da aynı şekilde OGM/EBA üzerinden 10. sınıf olarak aranır.

---

## 3. Kaç soru üretilecek — tek kural

```
hedef soru = max(10, 2 × süreç bileşeni sayısı)
her süreç bileşeni = bir alt_beceri → her birine EN AZ 2 soru
```

Örnek: `DKAB.10.1.1` → 2 süreç bileşeni → `max(10, 4) = 10` soru, her süreç için 5.

### Ders bazlı hedefler

| Ders | Çıktı | Süreç bileşeni | Hedef soru | Bugün havuzda | Boş çıktı |
| --- | --- | --- | --- | --- | --- |
| Biyoloji | 19 | 61 | 190 | var (240) | 0 |
| Coğrafya | 18 | 73 | 190 | var (229) | 1 |
| Din Kültürü | 17 | 65 | 170 | **0** | **17** |
| Felsefe | 10 | 38 | 100 | var (277) | 0 |
| Fizik | 22 | 70 | 220 | var (214) | 2 |
| Kimya | 21 | 69 | 214 | var (214) | 2 |
| Matematik | 21 | 123 | 274 | var (252) | 0 |
| Tarih | 14 | 49 | 140 | var (184) | 0 |
| Türk Dili ve Edebiyatı | 16 | 64 | 188 | **0** | **16** |
| **Toplam** | **158** | **612** | **1.686** | 1.610 | **38** |

> "Bugün havuzda" sayıları **eski (2018) programa** göre kurulmuş havuzlardır ve yeni
> şemayla eşleşmez. Hedef, 2026 programına göre **yeni havuzlardır**; eski havuzlar
> olduğu gibi bırakılır (geçiş döneminde ikisi bir arada durur).

---

## 4. Dosya ve kimlik sözleşmesi

```
konu_id = <ders_kisa>_10_t<tema:2 hane>_c<çıktı sırası:2 hane>
dosya   = <konu_id>.json
```

| Ders | kısa | Örnek |
| --- | --- | --- |
| Biyoloji | `biyo` | `BİY.10.2.3` → `biyo_10_t02_c03` |
| Coğrafya | `cogr` | `COĞ.10.6.1` → `cogr_10_t06_c01` |
| Din Kültürü | `din` | `DKAB.10.1.1` → `din_10_t01_c01` |
| Felsefe | `fel` | `FEL.10.1.1` → `fel_10_t01_c01` |
| Fizik | `fiz` | `FİZ.10.1.2` → `fiz_10_t01_c02` |
| Kimya | `kim` | `KİM.10.2.7` → `kim_10_t02_c07` |
| Matematik | `mat` | `MAT.10.3.2` → `mat_10_t03_c02` |
| Tarih | `tar` | `TAR.10.1.4` → `tar_10_t01_c04` |
| Türk Dili ve Edebiyatı | `edebiyat` | `TDE2.3` → `edebiyat_10_t02_c03` |

TDE kodlarında sınıf gömülü değildir: `TDE<tema>.<sıra>`.

`topic_key` (uygulama havuzu bununla bulur):
```
"<Ders> > <tema>.<sıra> <resmî kazanım başlığı>"
ör. "Din Kültürü > 1.1 İslam’da bilginin yerini ve kaynaklarını çözümleyebilme"
```
Bu değer `scripts/havuz-index-uret.js` tarafından otomatik yazılır — **havuz dosyasına
elle `topic_key` yazma**, manifest üretilirken eklenir.

---

## 5. JSON şeması

### 5.1 Havuz dosyası

```json
{
  "konu_id": "din_10_t01_c01",
  "kod": "DKAB.10.1.1",
  "sinif": 10,
  "ders": "Din Kültürü",
  "tema": 1,
  "kazanim": "İslam’da bilginin yerini ve kaynaklarını çözümleyebilme",
  "kaynak": "dkab912.pdf (MEB TYMM 2026, s.36-37)",
  "sorular": [ ... ],
  "flashcards": [ ... ]
}
```

| Alan | Zorunlu | Kural |
| --- | --- | --- |
| `konu_id` | ✅ | Plandaki değerle **birebir**; dosya adıyla aynı |
| `kod` | ✅ | Plandaki MEB kodu; **değiştirilemez** |
| `sinif` | ✅ | `10` |
| `ders` | ✅ | Plandaki ders adı |
| `tema` | ✅ | Plandaki tema numarası |
| `kazanim` | ✅ | Resmî çıktı cümlesi, **birebir** (noktalama dışında değişmez) |
| `kaynak` | ➖ | Kitap/program sayfası — izlenebilirlik için önerilir |
| `sorular` | ✅ | ≥ `hedef_soru` |
| `flashcards` | ➖ | Varsa her soru için bir kart, `id = <soru_id>:flashcard` |

### 5.2 Soru nesnesi

```json
{
  "soru_id": "din_10_t01_c01_o01",
  "alt_beceri": "İslam düşüncesinde bilginin yerini ve kaynaklarını inceler.",
  "metin": "İslam düşüncesinde bilginin elde edilmesinde başvurulan temel kaynaklar aşağıdakilerin hangisinde birlikte verilmiştir?",
  "secenekler": [
    "Vahiy, akıl ve duyu organları",
    "Yalnızca akıl ve sezgi",
    "Yalnızca duyu organları ve deney",
    "Gelenek, alışkanlık ve kulaktan dolma bilgiler"
  ],
  "dogru_index": 0,
  "cozum": "İslam düşüncesinde bilgi; vahiy, akıl ve duyu organları olmak üzere üç temel kaynaktan elde edilir. Gelenek ve alışkanlık bilgi kaynağı sayılmaz; bunlar doğrulanmaya muhtaçtır.",
  "zorluk": "deneme",
  "flashcard": { "front": "…", "back": "…" },
  "kazanim": "İslam’da bilginin yerini ve kaynaklarını çözümleyebilme"
}
```

| Alan | Kural |
| --- | --- |
| `soru_id` | `<konu_id>_o<iki hane>` — havuz içinde tekil |
| `alt_beceri` | **Resmî süreç bileşeninin metni** (`a)`/`b)` etiketi olmadan). Başka bir ifade yazılamaz. |
| `metin` | Soru kökü. 30–600 karakter. Tek doğru cevap. |
| `secenekler` | **Tam 4** seçenek. Birbirinin aynısı olamaz, boş olamaz. |
| `dogru_index` | `0..3` **tam sayı**. Doğru şık. |
| `cozum` | Zorunlu, ≥ 25 karakter. Neden doğru olduğunu **açıklar** (sadece "A" yazılmaz). |
| `zorluk` | Her soruda `"deneme"` (uygulamanın kabul ettiği tek değer). |
| `flashcard` | `{front, back}` — isteğe bağlı; yoksa uygulama `metin`/`cozum` ile üretir. |
| `gorsel` | İsteğe bağlı SVG tanımı (bkz. §7). |
| `kazanim` | Havuzdaki `kazanim` ile aynı. |

### 5.3 Flashcard dizisi

```json
"flashcards": [
  { "id": "din_10_t01_c01_o01:flashcard", "front": "…", "back": "…" }
]
```

---

## 6. Kalite kuralları (kabul şartı)

1. **Sadakat:** Soru, yalnızca o çıktının **kazanımı ve süreç bileşenleri** kapsamında
   olmalı. Başka çıktının konusundan soru yazılmaz.
2. **Süreç kapsaması:** Her süreç bileşenine **en az 2 soru**. Bir madde atlanırsa havuz
   reddedilir.
3. **Cevap dengesi:** Doğru şık dağılımı dengeli olmalı; **hiçbir şık %40'ı geçmez**.
   (Mevcut havuzlarda bu oran %34,8 ile A lehine bozuktu — tekrarlanmayacak.)
4. **Çeldiriciler:** Yanlış şıklar "saçma" olmaz; konuyla ilgili, yaygın kavram
   yanılgılarından üretilir. "Hepsi"/"Hiçbiri" gibi şıklar kullanılmaz.
5. **Tekrar yok:** Aynı soru metni ne havuz içinde ne de başka havuzda bulunur.
   (Denetim: `soru-uret-dogrula.js` tüm dosyaları tarar.)
6. **Dil:** Türkçe, açık ve öğrenci seviyesine uygun. Yazım/noktalama kurallarına uyulur.
   Cinsiyet/kişi adı yerine nötr ifadeler; hassas konularda (din, tarih) resmî anlatım.
7. **Kaynak sadakati:** Sayısal veri, tarih, ayet/hadis meali **ders kitabındaki**
   biçimiyle verilir; uydurulmaz. Emin olunmayan bilgi soruya girmez.
8. **Kopya yok:** Başka yayınevinin/kitabın sorusu birebir alınmaz; kitaptaki bilgi
   kullanılarak **özgün** soru yazılır (telif).
9. **Görsel:** Yalnızca gerçekten gerekliyse (grafik, geometri, vektör) ve §7'deki
   tanıma uygun.

---

## 7. Görsel (isteğe bağlı)

`site/gorsel.js` yedi tip destekler; tanım geçersizse **soru reddedilir** (sessiz kayıp
olmaz). Tipler: `ucgen`, `grafik`, `vektor`, `sema`, `tablo`, `geometri`, `cember`.

```json
"gorsel": {
  "tip": "grafik",
  "xEkseni": "t (s)",
  "yEkseni": "v (m/s)",
  "seriler": [{ "ad": "v", "noktalar": [[0, 0], [2, 10], [4, 10]] }],
  "izgara": true
}
```

Doğrulama: `require("./site/gorsel.js").dogrula(gorsel)`

---

## 8. Nereye yazılacak

```
site/content/soru_havuzlari/<konu_id>.json
```

> **Yayınlanan dizin burasıdır.** Vercel `site/` klasörünü yayımlar
> (`deploy/build.sh`). Kök `content/soru_havuzlari/` eski bir kopyadır — **oraya
> yazma**.

Dosyalar eklendikten sonra manifest üretilir:

```bash
node scripts/havuz-index-uret.js --plan
```

Bu komut `index.json`'u yeniden yazar (uygulama havuzları buradan bulur) ve planla
çapraz kontrol yapar.

---

## 9. Doğrulama ve kabul kriterleri

```bash
# 1) Tek tek dosyaların kural kontrolü (geliştirme sırasında)
node scripts/soru-uret-dogrula.js site/content/soru_havuzlari

# 2) Manifest + plan çapraz kontrolü
node scripts/havuz-index-uret.js --plan --kontrol

# 3) Uygulama kuralları (bkt-engine validatePool ile aynı)
npm run -s validate:pools

# 4) Testler
node tests/question-pools.test.js
npm run -s test:hepsi
```

**Teslim kabul şartları**

| # | Şart |
| --- | --- |
| 1 | 158 dosya, adları `konu_id.json` ile aynı |
| 2 | Her dosyada `sorular.length ≥ hedef_soru` (toplam ≥ 1.686) |
| 3 | Her süreç bileşeni `alt_beceri` olarak var ve ≥ 2 soru |
| 4 | `soru-uret-dogrula.js` → **0 hata** |
| 5 | `havuz-index-uret.js --plan --kontrol` → **0 hata** |
| 6 | `npm run -s validate:pools` → hepsi geçerli |
| 7 | Metin tekrarı 0, cevap dağılımı hiçbir şıkta > %40 değil |
| 8 | Uygulama kodu **değiştirilmedi** (yalnız veri eklendi) |

---

## 10. Neden bu iş gerekli — ölçüm

Mevcut 172 havuz / 1.956 soru üzerinde yapılan denetim:

| Bulgu | Sayı |
| --- | --- |
| `kazanim` alanı boş | **964 / 1.956 (%49)** |
| Doğru cevap A'da toplanmış | 680 (%34,8) — B %24,6 · C %21,0 · D %19,6 |
| Seçenekleri birbirinin aynısı olan soru | 12 |
| Cevap dağılımı bozuk havuz (> %40 tek şık) | 20 |
| Çok kısa soru kökü (< 30 karakter) | 14 |
| Havuzu **hiç olmayan** çıktı | 38 (Din 17, TDE 16, Coğrafya 1, Fizik 2, Kimya 2) |

Ayrıca eski havuzlar **2018 programına** göre kurulmuştur: Din'de 16 konu
(`1.1 Kur'an-ı Kerim…`, `2.1 İslam'ın İbadet Boyutu`…) 2026'nın 5 temasıyla
(`İslam'da Varlık ve Bilgi`, `Allah'ı Tanımak`…) eşleşmiyor. Bu yüzden yeni havuzlar
2026 kodlarıyla **sıfırdan** kurulur.

---

## 11. Yapılmayacaklar

- ❌ Kazanım cümlesini veya süreç bileşenini **yeniden yazmak** (resmî metindir).
- ❌ Planda olmayan bir `kod`/`konu_id` uydurmak.
- ❌ Bir çıktıya, kapsamı dışındaki konudan soru eklemek.
- ❌ Eski `*_10_uNN_kNN` dosyalarını silmek/değiştirmek (geçiş döneminde korunur).
- ❌ `app-pwa.js`, `bkt-engine.js`, `okz-meb.js` gibi uygulama dosyalarını değiştirmek.
- ❌ `site/content/soru_havuzlari/index.json`'u **elle** düzenlemek (üretici betik var).

---

## 12. Özet akış

```
1. docs/uretim/uretim-plani.json oku        → hangi kod, kaç soru
2. Ders kitabından o çıktının bölümünü oku  → içerik
3. Her süreç bileşeni için ≥ 2 soru yaz     → alt_beceri = süreç metni
4. site/content/soru_havuzlari/<konu_id>.json
5. node scripts/soru-uret-dogrula.js <dizin>       → 0 hata
6. node scripts/havuz-index-uret.js --plan         → manifest
7. npm run -s validate:pools && npm run -s test:hepsi
```
