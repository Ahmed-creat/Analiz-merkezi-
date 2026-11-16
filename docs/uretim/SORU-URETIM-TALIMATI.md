# Soru Üretim Talimatı — 10. Sınıf (MEB TYMM 2026)

> Bu **tek** talimat dosyasıdır: yöntem, kurallar, JSON şeması, dal/PR akışı,
> kabul testleri — hepsi burada. Kazanım verisi ayrı dosyada:
> **`docs/uretim/TUM-KAZANIMLAR-10SINIF.md`**
>
> Bu iki dosya dışında okuman gereken bir şey yok.

---

## 1. Görev

10. sınıfın dokuz dersinde, MEB'in resmî 2026 programındaki **158 öğrenme çıktısının
her biri için bir soru havuzu** yaz.

- Her çıktı = **tek bir JSON dosyası**
- Toplam **1.686 soru** (kuraldan hesaplanır)
- Sorular **ders kitaplarından** üretilir; kazanım ve süreç bileşenleri resmî
  programdan gelir ve **değiştirilmez**

---

## 2. Dal (branch) ve PR — bu iş nerede yapılacak

Bu iş, açık **PR #4**'ün hattının devamıdır ama **aynı dala yazılmaz**.

- Açık PR: **#4** — `arena/cc4de070-analiz-merkezi` → `main`
- O dal aktif olarak başka bir ajan tarafından kullanılıyor (uygulama düzeltmeleri)
- Doğrudan oraya push etmek çakışma üretir

### Komutlar

```bash
# 1) Hattı al
git fetch origin
git checkout -b soru-uretim origin/arena/cc4de070-analiz-merkezi

# 2) Çalış, sonra ekle
git add site/content/soru_havuzlari/
git commit -m "10. sınıf soru havuzları (158 çıktı)"
git push -u origin soru-uretim

# 3) PR'ı ANA DALA DEĞİL, bu hatta aç
gh pr create \
  --base arena/cc4de070-analiz-merkezi \
  --head soru-uretim \
  --title "10. sınıf soru havuzları (158 çıktı)" \
  --body "docs/uretim/SORU-URETIM-TALIMATI.md kurallarına göre üretildi."
```

### Yasaklar

- ❌ `arena/cc4de070-analiz-merkezi` dalına **doğrudan** push
- ❌ **PR #4'ü merge etme** (birleştirme kararı kullanıcının)
- ❌ `main`e doğrudan push

---

## 3. Kaç soru üretilecek — tek kural

```
hedef soru = max(10, 2 × süreç bileşeni sayısı)
her süreç bileşeni = bir alt_beceri → her birine EN AZ 2 soru
```

Örnek: `DKAB.10.1.1` → 2 süreç bileşeni → `max(10, 4) = 10` soru, her süreç için 5.

| Ders | Çıktı | Süreç | Hedef soru | Tema |
| --- | --- | --- | --- | --- |
| Türk Dili ve Edebiyatı | 16 | 64 | 188 | 4 |
| Matematik | 21 | 123 | 274 | 7 |
| Fizik | 22 | 70 | 220 | 4 |
| Kimya | 21 | 69 | 214 | 3 |
| Biyoloji | 19 | 61 | 190 | 2 |
| Tarih | 14 | 49 | 140 | 3 |
| Coğrafya | 18 | 73 | 190 | 7 |
| Felsefe | 10 | 38 | 100 | 9 |
| Din Kültürü | 17 | 65 | 170 | 5 |
| **Toplam** | **158** | **612** | **1.686** | **44** |

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

Bu değeri **havuz dosyasına elle yazma** — manifest üretilirken eklenir.

---

## 5. Nereye yazılacak

```
site/content/soru_havuzlari/<konu_id>.json
```

> **Yayınlanan dizin burasıdır.** Vercel `site/` klasörünü yayımlar
> (`deploy/build.sh`). Kök `content/soru_havuzlari/` **eski bir kopyadır** (153 dosya,
> bayat) — oraya yazarsan uygulamaya hiç ulaşmaz.

Dosyalar bitince manifest üret (uygulama havuzları buradan bulur):

```bash
node scripts/havuz-index-uret.js --plan
```

---

## 6. JSON şeması

### 6.1 Havuz dosyası

```json
{
  "konu_id": "din_10_t01_c01",
  "kod": "DKAB.10.1.1",
  "sinif": 10,
  "ders": "Din Kültürü",
  "tema": 1,
  "tema_adi": "İslam’da Varlık ve Bilgi",
  "kazanim": "İslam’da bilginin yerini ve kaynaklarını çözümleyebilme",
  "kaynak": "DKAB 10 ders kitabı, s.12-18",
  "sorular": [],
  "flashcards": []
}
```

| Alan | Zorunlu | Kural |
| --- | --- | --- |
| `konu_id` | ✅ | Plandaki değerle birebir; dosya adıyla aynı |
| `kod` | ✅ | MEB kodu; **değiştirilemez** |
| `sinif` | ✅ | `10` |
| `ders` | ✅ | Resmî ders adı |
| `tema` | ✅ | Tema numarası |
| `tema_adi` | ➖ | Resmî tema adı (veri dosyasında yazılı) |
| `kazanim` | ✅ | Resmî çıktı cümlesi, **birebir** |
| `kaynak` | ➖ | Kitap adı + sayfa (izlenebilirlik) |
| `sorular` | ✅ | ≥ `hedef_soru` |
| `flashcards` | ➖ | Varsa her soru için bir kart |

### 6.2 Soru nesnesi

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
  "flashcard": { "front": "Bilginin temel kaynakları hangileridir?", "back": "Vahiy, akıl ve duyu organları." },
  "kazanim": "İslam’da bilginin yerini ve kaynaklarını çözümleyebilme"
}
```

| Alan | Kural |
| --- | --- |
| `soru_id` | `<konu_id>_o<iki hane>` — havuz içinde tekil |
| `alt_beceri` | **Resmî süreç bileşeninin metni** (`a)`/`b)` etiketi olmadan). Başka ifade yazılamaz. |
| `metin` | Soru kökü. 30–600 karakter. Tek doğru cevap. |
| `secenekler` | **Tam 4**. Birbirinin aynısı olamaz, boş olamaz. |
| `dogru_index` | `0..3` tam sayı. |
| `cozum` | Zorunlu, ≥ 25 karakter, nedeni açıklar ("A" yazılmaz). |
| `zorluk` | Her soruda `"deneme"`. |
| `flashcard` | `{front, back}` — isteğe bağlı. |
| `gorsel` | İsteğe bağlı SVG tanımı (bkz. §8). |
| `kazanim` | Havuzdaki `kazanim` ile aynı. |

### 6.3 Flashcard dizisi

```json
"flashcards": [
  { "id": "din_10_t01_c01_o01:flashcard", "front": "…", "back": "…" }
]
```

### 6.4 Tam dolu örnek havuz

Aşağıdaki dosya **birebir şablon** olarak kullanılabilir — doğrulayıcıdan geçmiştir
(`din_10_t01_c01`, `DKAB.10.1.1`, 2 süreç × 5 soru = 10 soru):

```json
{
  "konu_id": "din_10_t01_c01",
  "kod": "DKAB.10.1.1",
  "sinif": 10,
  "ders": "Din Kültürü",
  "tema": 1,
  "tema_adi": "İslam’da Varlık ve Bilgi",
  "kazanim": "İslam’da bilginin yerini ve kaynaklarını çözümleyebilme",
  "sorular": [
    {
      "soru_id": "din_10_t01_c01_o01",
      "alt_beceri": "İslam düşüncesinde bilginin yerini ve kaynaklarını inceler.",
      "metin": "İslam düşüncesinde bilginin elde edilmesinde başvurulan temel kaynaklar aşağıdakilerin hangisinde birlikte verilmiştir?",
      "secenekler": ["Vahiy, akıl ve duyu organları", "Yalnızca akıl ve sezgi", "Yalnızca duyu organları ve deney", "Gelenek, alışkanlık ve kulaktan dolma bilgiler"],
      "dogru_index": 0,
      "cozum": "İslam düşüncesinde bilgi; vahiy, akıl ve duyu organları olmak üzere üç temel kaynaktan elde edilir. Gelenek ve alışkanlık bilgi kaynağı sayılmaz; bunlar doğrulanmaya muhtaçtır.",
      "zorluk": "deneme",
      "flashcard": { "front": "Bilginin temel kaynakları hangileridir?", "back": "Vahiy, akıl ve duyu organları." },
      "kazanim": "İslam’da bilginin yerini ve kaynaklarını çözümleyebilme"
    },
    {
      "soru_id": "din_10_t01_c01_o02",
      "alt_beceri": "İslam düşüncesinde bilginin yerini ve kaynaklarını inceler.",
      "metin": "Kur'an'ın bilgi kaynağı olarak diğer kaynaklardan ayrılan yönü aşağıdakilerden hangisidir?",
      "secenekler": ["Yalnızca geçmiş toplumların aktardığı rivayetlere dayanması", "İnsanın duyularıyla sınırlı konularda hüküm vermesi", "Allah tarafından bildirildiği için kesin bilgi içermesi", "Kişiden kişiye değişen yorumlara açık olması"],
      "dogru_index": 2,
      "cozum": "Vahiy, Allah tarafından bildirildiği için kesin bilgi taşır. Rivayet ve duyu ise doğrulanmaya ihtiyaç duyar; bu yönüyle vahiy diğer kaynaklardan ayrılır.",
      "zorluk": "deneme",
      "flashcard": { "front": "Vahyi diğer kaynaklardan ayıran özellik nedir?", "back": "Allah tarafından bildirilmesi ve kesin bilgi içermesi." },
      "kazanim": "İslam’da bilginin yerini ve kaynaklarını çözümleyebilme"
    },
    {
      "soru_id": "din_10_t01_c01_o03",
      "alt_beceri": "İslam düşüncesinde bilginin yerini ve kaynaklarını inceler.",
      "metin": "İslam âlimlerinin bilgiyi \"zarûrî\" ve \"kazanılmış\" olarak ayırmasının nedeni aşağıdakilerden hangisidir?",
      "secenekler": ["Bilginin kaynağını ve elde ediliş biçimini sınıflandırmak", "Bilgiyi yalnızca din âlimlerine özgü kılmak", "Akıl yürütmeyi gereksiz saymak", "Duyu organlarıyla edinilen bilgiyi reddetmek"],
      "dogru_index": 0,
      "cozum": "Zarûrî bilgi, çaba harcamadan doğrudan elde edilen bilgidir; kazanılmış bilgi ise akıl yürütme ve araştırma sonucu oluşur. Ayrım, bilginin kaynağını ve elde ediliş biçimini sınıflandırmaya yarar.",
      "zorluk": "deneme",
      "flashcard": { "front": "Zarûrî ve kazanılmış bilgi arasındaki fark nedir?", "back": "Zarûrî bilgi doğrudan ve çabasız edinilir; kazanılmış bilgi akıl yürütme ve araştırmayla." },
      "kazanim": "İslam’da bilginin yerini ve kaynaklarını çözümleyebilme"
    },
    {
      "soru_id": "din_10_t01_c01_o04",
      "alt_beceri": "İslam düşüncesinde bilginin yerini ve kaynaklarını inceler.",
      "metin": "Bir öğrencinin gördüğü olayı arkadaşına anlatırken ayrıntıları yanlış hatırlaması, hangi bilgi kaynağının güvenilirliğinin sınanması gerektiğini gösterir?",
      "secenekler": ["Vahyin", "Duyu organlarının ve hafızanın", "Kur'an'ın", "Peygamber sünnetinin"],
      "dogru_index": 1,
      "cozum": "Duyu organlarıyla edinilen bilgi hafıza, dikkat ve yorumla birleşir; bu nedenle yanılgıya açıktır. Vahiy ve sünnet ise kesin bilgi kaynaklarıdır, hatırlama hatası bunlarla ilgili değildir.",
      "zorluk": "deneme",
      "flashcard": { "front": "Duyu bilgisi neden sınanmalıdır?", "back": "Dikkat, hafıza ve yorum hataları sebebiyle yanılgıya açık olduğu için." },
      "kazanim": "İslam’da bilginin yerini ve kaynaklarını çözümleyebilme"
    },
    {
      "soru_id": "din_10_t01_c01_o05",
      "alt_beceri": "İslam düşüncesinde bilginin yerini ve kaynaklarını inceler.",
      "metin": "Kur'an'da ilk inen ayetin \"Oku!\" emriyle başlaması, İslam düşüncesinde bilgiye verilen değer bakımından neyi gösterir?",
      "secenekler": ["Okumanın yalnızca din âlimlerine emredildiğini", "Bilgi edinmenin sadece aklî ilimlerle sınırlı olduğunu", "Bilginin ibadetlerden sonra geldiğini", "Bilgi edinmenin ve öğrenmenin temel bir sorumluluk olduğunu"],
      "dogru_index": 3,
      "cozum": "İlk vahyin \"Oku!\" emriyle başlaması, bilgi edinmenin tüm insanlar için temel bir sorumluluk olduğunu gösterir. Bu emir belirli bir gruba veya alana hasredilmemiştir.",
      "zorluk": "deneme",
      "flashcard": { "front": "Kur'an'ın \"Oku!\" emriyle başlaması neyi gösterir?", "back": "Bilgi edinmenin temel bir sorumluluk olduğunu." },
      "kazanim": "İslam’da bilginin yerini ve kaynaklarını çözümleyebilme"
    },
    {
      "soru_id": "din_10_t01_c01_o06",
      "alt_beceri": "İslam düşüncesinde bilginin yeri ve kaynakları arasındaki ilişkiyi belirler.",
      "metin": "Vahiy ile akıl arasındaki ilişki aşağıdakilerin hangisinde doğru ifade edilmiştir?",
      "secenekler": ["Vahiy, aklın ulaşamadığı alanlarda insanı bilgilendirir; akıl da vahyin anlaşılmasında kullanılır", "Akıl, vahyin bildirdiklerini her durumda reddeder", "Vahiy, aklın bütün işlevlerini ortadan kaldırır", "İkisi arasında hiçbir ilişki yoktur"],
      "dogru_index": 0,
      "cozum": "Vahiy ve akıl birbirini dışlamaz. Akıl, vahyin anlaşılması ve yorumlanmasında araçtır; vahiy de aklın sınırlı kaldığı metafizik konularda insanı bilgilendirir.",
      "zorluk": "deneme",
      "flashcard": { "front": "Vahiy ile akıl nasıl bir ilişki içindedir?", "back": "Birbirini dışlamazlar; akıl vahyin anlaşılmasında, vahiy aklın sınırlı kaldığı konularda yol gösterir." },
      "kazanim": "İslam’da bilginin yerini ve kaynaklarını çözümleyebilme"
    },
    {
      "soru_id": "din_10_t01_c01_o07",
      "alt_beceri": "İslam düşüncesinde bilginin yeri ve kaynakları arasındaki ilişkiyi belirler.",
      "metin": "Bir kimyagerin bir maddeyi gözlemleyerek, deney yaparak ve önceki çalışmaları okuyarak sonuca ulaşması hangi bilgi kaynaklarının birlikte kullanılmasına örnektir?",
      "secenekler": ["Yalnızca vahyin", "Yalnızca geleneğin", "Duyu organları ile aklın", "Yalnızca sezginin"],
      "dogru_index": 2,
      "cozum": "Gözlem ve deney duyu organlarına, yorumlama ve sonuç çıkarma akla dayanır. Bilgi, birden çok kaynağın birlikte kullanılmasıyla oluşur.",
      "zorluk": "deneme",
      "flashcard": { "front": "Gözlem ve deney hangi kaynağa dayanır?", "back": "Duyu organlarına; yorumlama ise akla." },
      "kazanim": "İslam’da bilginin yerini ve kaynaklarını çözümleyebilme"
    },
    {
      "soru_id": "din_10_t01_c01_o08",
      "alt_beceri": "İslam düşüncesinde bilginin yeri ve kaynakları arasındaki ilişkiyi belirler.",
      "metin": "Aklın tek başına kesin bilgi üretmekte yetersiz kaldığı konularda vahyin devreye girmesi, bilgi kaynakları arasındaki ilişki bakımından neyi gösterir?",
      "secenekler": ["Kaynakların birbirini tamamladığını", "Aklın tamamen gereksiz olduğunu", "Vahyin duyu organlarının yerini aldığını", "Bilgi kaynaklarının birbiriyle çeliştiğini"],
      "dogru_index": 0,
      "cozum": "Bilgi kaynakları birbirinin rakibi değil tamamlayıcısıdır. Akıl duyuların verilerini işler, vahiy ise aklın ulaşamadığı alanlarda bilgi verir.",
      "zorluk": "deneme",
      "flashcard": { "front": "Bilgi kaynakları birbiriyle nasıl bir ilişki içindedir?", "back": "Birbirini dışlamaz, tamamlar; her biri farklı alanda işlev görür." },
      "kazanim": "İslam’da bilginin yerini ve kaynaklarını çözümleyebilme"
    },
    {
      "soru_id": "din_10_t01_c01_o09",
      "alt_beceri": "İslam düşüncesinde bilginin yeri ve kaynakları arasındaki ilişkiyi belirler.",
      "metin": "Bir haberi doğrulamadan aktarmanın sakıncası, İslam düşüncesindeki bilgi anlayışıyla nasıl açıklanır?",
      "secenekler": ["Haber aktarmanın dinen yasak olmasıyla", "Doğrulanmamış bilginin yanlış inanç ve davranışlara yol açabilmesiyle", "Yalnızca yazılı bilginin geçerli sayılmasıyla", "Haberin her zaman vahiy kaynaklı olmasıyla"],
      "dogru_index": 1,
      "cozum": "İslam düşüncesi bilginin doğrulanmasına önem verir. Doğrulanmamış haber yanlış inanç ve davranışlara yol açabileceği için kaynağı ve güvenilirliği araştırılmalıdır.",
      "zorluk": "deneme",
      "flashcard": { "front": "Haberi doğrulamadan aktarmak neden sakıncalıdır?", "back": "Yanlış inanç ve davranışlara yol açabileceği için." },
      "kazanim": "İslam’da bilginin yerini ve kaynaklarını çözümleyebilme"
    },
    {
      "soru_id": "din_10_t01_c01_o10",
      "alt_beceri": "İslam düşüncesinde bilginin yeri ve kaynakları arasındaki ilişkiyi belirler.",
      "metin": "İslam düşüncesinde bilgi kaynaklarının birlikte değerlendirilmesinin sağladığı yarar aşağıdakilerden hangisidir?",
      "secenekler": ["Tek bir kaynağa bağlı kalarak kesin sonuca ulaşmak", "Duyu organlarını devre dışı bırakmak", "Bilgiyi yalnızca rivayetlere dayandırmak", "Bilginin daha güvenilir ve tutarlı olmasını sağlamak"],
      "dogru_index": 3,
      "cozum": "Kaynakların birlikte değerlendirilmesi, bilginin sınanmasını ve tutarlılığını artırır. Tek kaynağa bağlı kalmak yanılgı riskini büyütür.",
      "zorluk": "deneme",
      "flashcard": { "front": "Kaynakları birlikte değerlendirmenin yararı nedir?", "back": "Bilginin daha güvenilir ve tutarlı olmasını sağlar." },
      "kazanim": "İslam’da bilginin yerini ve kaynaklarını çözümleyebilme"
    }
  ],
  "flashcards": [
    { "id": "din_10_t01_c01_o01:flashcard", "front": "Bilginin temel kaynakları hangileridir?", "back": "Vahiy, akıl ve duyu organları." },
    { "id": "din_10_t01_c01_o02:flashcard", "front": "Vahyi diğer kaynaklardan ayıran özellik nedir?", "back": "Allah tarafından bildirilmesi ve kesin bilgi içermesi." },
    { "id": "din_10_t01_c01_o03:flashcard", "front": "Zarûrî ve kazanılmış bilgi arasındaki fark nedir?", "back": "Zarûrî bilgi çabasız edinilir; kazanılmış bilgi akıl yürütmeyle." },
    { "id": "din_10_t01_c01_o04:flashcard", "front": "Duyu bilgisi neden sınanmalıdır?", "back": "Yanılgıya açık olduğu için." },
    { "id": "din_10_t01_c01_o05:flashcard", "front": "Kur'an'ın \"Oku!\" ile başlaması neyi gösterir?", "back": "Bilgi edinmenin temel sorumluluk olduğunu." },
    { "id": "din_10_t01_c01_o06:flashcard", "front": "Vahiy ile akıl nasıl bir ilişki içindedir?", "back": "Birbirini tamamlar." },
    { "id": "din_10_t01_c01_o07:flashcard", "front": "Gözlem ve deney hangi kaynağa dayanır?", "back": "Duyu organlarına." },
    { "id": "din_10_t01_c01_o08:flashcard", "front": "Bilgi kaynakları nasıl bir ilişki içindedir?", "back": "Birbirini tamamlar." },
    { "id": "din_10_t01_c01_o09:flashcard", "front": "Haberi doğrulamadan aktarmak neden sakıncalıdır?", "back": "Yanlış inançlara yol açabileceği için." },
    { "id": "din_10_t01_c01_o10:flashcard", "front": "Kaynakları birlikte değerlendirmenin yararı nedir?", "back": "Bilgi daha güvenilir ve tutarlı olur." }
  ]
}
```

---

## 7. Kalite kuralları (kabul şartı)

1. **Sadakat:** Soru yalnızca o çıktının kazanımı ve süreç bileşenleri kapsamında olur.
   Başka çıktının konusundan soru yazılmaz.
2. **Süreç kapsaması:** Her süreç bileşenine **en az 2 soru**. Bir madde atlanırsa havuz
   reddedilir.
3. **Cevap dengesi:** Hiçbir şık %40'ı geçmez. (Mevcut havuzlarda A %34,8 ile bozuktu —
   tekrarlanmayacak.)
4. **Çeldiriciler:** Yanlış şıklar saçma olmaz; konuyla ilgili yaygın kavram yanılgılarından
   üretilir. "Hepsi"/"Hiçbiri" kullanılmaz.
5. **Tekrar yok:** Aynı soru metni ne havuz içinde ne başka havuzda bulunur.
6. **Dil:** Türkçe, açık, öğrenci seviyesine uygun. Din ve tarih gibi hassas konularda
   resmî anlatım korunur.
7. **Kaynak sadakati:** Sayısal veri, tarih, ayet/hadis meali **ders kitabındaki** biçimiyle
   verilir; uydurulmaz.
8. **Kopya yok:** Başka yayınevinin sorusu birebir alınmaz; kitaptaki bilgiyle **özgün**
   soru yazılır (telif).
9. **Görsel:** Yalnızca gerekliyse (grafik, geometri, vektör) ve §8'e uygun.

---

## 8. Görsel (isteğe bağlı)

`site/gorsel.js` yedi tip destekler; tanım geçersizse **soru reddedilir**.
Tipler: `ucgen`, `grafik`, `vektor`, `sema`, `tablo`, `geometri`, `cember`.

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

## 9. Ders kitapları

Kitap PDF'lerini **kullanıcı ayrıca verecek**. Kitap elinde yoksa MEB kaynakları:

- `https://tymm.meb.gov.tr/ogretim-programlari/ders/<ders>-dersi` → sayfadaki
  **Ders Kitapları** bölümü (10. Sınıf)
- Alternatif: `https://ogmmateryal.eba.gov.tr/ders-kitaplari` → 10. sınıf → ders

10. sınıf kitapları **yeni müfredata** göredir; eski (2018) baskı kullanılmaz.

---

## 10. Doğrulama ve kabul

```bash
# 1) Havuzları tek tek denetle
node scripts/soru-uret-dogrula.js site/content/soru_havuzlari

# 2) Manifest üret + planla çapraz kontrol
node scripts/havuz-index-uret.js --plan

# 3) Uygulama kuralları (bkt-engine validatePool ile aynı)
npm run -s validate:pools

# 4) Testler
node tests/question-pools.test.js
npm run -s test:hepsi
```

### Teslim kabul şartları

| # | Şart |
| --- | --- |
| 1 | 158 dosya, adları `konu_id.json` ile aynı |
| 2 | Her dosyada `sorular.length ≥ hedef_soru` (toplam ≥ 1.686) |
| 3 | Her süreç bileşeni `alt_beceri` olarak var ve ≥ 2 soru |
| 4 | `soru-uret-dogrula.js` → **0 hata** |
| 5 | `havuz-index-uret.js --plan` → **0 hata** |
| 6 | `npm run -s validate:pools` → hepsi geçerli |
| 7 | Metin tekrarı 0, hiçbir şık > %40 |
| 8 | Uygulama kodu **değiştirilmedi** (yalnız veri eklendi) |

---

## 11. Neden bu iş gerekli — ölçüm

Mevcut 172 havuz / 1.956 soru üzerinde yapılan denetim:

| Bulgu | Sayı |
| --- | --- |
| `kazanim` alanı boş | **964 / 1.956 (%49)** |
| Doğru cevap A'da toplanmış | 680 (%34,8) — B %24,6 · C %21,0 · D %19,6 |
| Seçenekleri birbirinin aynısı | 12 |
| Cevap dağılımı bozuk havuz (> %40 tek şık) | 20 |
| Çok kısa soru kökü (< 30 karakter) | 14 |
| Havuzu **hiç olmayan** çıktı | 38 (Din 17, TDE 16, Coğrafya 1, Fizik 2, Kimya 2) |

Eski havuzlar **2018 programına** göre kurulmuştur: Din'de 16 konu
(`1.1 Kur'an-ı Kerim…`, `2.1 İslam'ın İbadet Boyutu`…) 2026'nın 5 temasıyla
(`İslam'da Varlık ve Bilgi`, `Allah'ı Tanımak`…) eşleşmiyor. Bu yüzden yeni havuzlar
2026 kodlarıyla **sıfırdan** kurulur.

---

## 12. Yazma izinleri

| Yol | İzin |
| --- | --- |
| `site/content/soru_havuzlari/<konu_id>.json` | ✅ yeni dosya |
| `site/content/soru_havuzlari/index.json` | ⚠️ elle yazma — `havuz-index-uret.js` üretir |
| `docs/uretim/` | ✅ rapor/not |
| `site/app-pwa.js`, `bkt-engine.js`, `okz-meb.js`, `sw.js` | ❌ dokunma |
| Mevcut `*_10_uNN_kNN.json` havuzları | ❌ silme/değiştirme |

---

## 13. Akış

```
docs/uretim/TUM-KAZANIMLAR-10SINIF.md   → hangi çıktı, hangi süreç bileşenleri
        ↓
her çıktının altındaki iş emri satırı    → konu_id, dosya adı, hedef soru
        ↓
ders kitabı                              → içerik
        ↓
her süreç bileşeni için ≥2 soru           → alt_beceri = süreç metni
        ↓
site/content/soru_havuzlari/<konu_id>.json
        ↓
soru-uret-dogrula.js → havuz-index-uret.js --plan → validate:pools → test:hepsi
        ↓
dal soru-uretim → PR #4'ün hattına
```
