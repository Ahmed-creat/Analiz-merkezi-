# Soru Üretim Talimatı — 10. Sınıf (MEB TYMM 2026)

> ## SÜRÜM 3
> **Flashcard 1:1 zorunlu · Görsel soru bazında, kota yok**
>
> Bu blok güncellik damgasıdır. Dosyanın başında **SÜRÜM 3** yazmıyorsa
> elindeki kopya eskidir — yeniden indir.
>
> Hızlı kontrol: §3'te `flashcard sayısı = soru sayısı` satırı **varsa** güncel,
> §8 başlığı **"Görsel — isteğe bağlı değil, soru başına karar"** ise güncel.
> Bu satırlar yoksa eski sürümdesin (2 dosyalık ilk paket 480 satırdı, bu sürüm 610+).

> ## v72 DURUM — 17 Kasım 2026 (önce bunu oku)
>
> **Kullanıcı:** *"Soru üretimini başka ajan yapacak. Sen edebiyat için soru mu
> hazırladın? Kendin hangi derslerden soru ürettin, onları sil."*
>
> Uygulama ajanının kendi yazdığı **20 havuz / 200 soru** silindi
> (`kaynak_dosya: "elle yazıldı (v35.2/v35.3)"` damgalı olanlar).
> Havuz sayısı **172 → 152**, soru **1.956 → 1.756**.
>
> **Havuzu boş kalan 20 konu** (öncelikli iş emri — bunlar için havuz YOK):
>
> | Ders | Konu |
> |---|---|
> | Biyoloji | 1.8 Besinlerin Solunuma Katılma Yolları · 2.2 Komünitelerde ve Popülasyonlarda Görülen Etkileşimler · 2.6 Ekolojik Sürdürülebilirliği Kısıtlayan Durumlar |
> | Coğrafya | 4.2 Yerleşmelerin Fonksiyonları · 5.2 Ekonomik Sektörler ve Gelişmişlik · 5.3 Türkiye Ekonomisinin Sektörel Dağılımı · 6.2 Afetlere Dirençli Yaşam Alanları · 6.3 Afetlerden Korunma · 6.4 Afet Bilinci · 7.1 Türk Kültürünün Mekânsal Özellikleri |
> | Din Kültürü | 2.3 Hac ve Zekât · 2.4 Kur'an'dan Mesajlar (Ünite 2) · 3.4 Kur'an'dan Mesajlar (Ünite 3) |
> | Kimya | 2.1.6 Çözünürlüğe Etki Eden Faktörler · 2.1.7 Çözeltilerin Sınıflandırılması · 2.1.8 Koligatif Özellikler |
> | Tarih | 1.4 Türk-İslam Medeniyetinde Bilim, Kültür, Eğitim ve Sanat · 2.5 Osmanlı Devleti'nin İlim ve İrfan Geleneği |
> | **TDE** | **Şiirde Ahenk (Ölçü, Uyak, Redif, Aliterasyon, Asonans)** · **Paragraf** |
>
> TDE'nin kalan 28 konusunun havuzu **kullanıcının kendi zip'lerinden** gelir;
> bunlar silinmedi. Kullanıcı "sadece edebiyat kaldı" dediyse öncelik **TDE'nin
> 2 konusu**dur (Şiirde Ahenk, Paragraf).
>
> Ölçüm notu: aşağıdaki "172 havuz / 1.956 soru" satırları **v72 öncesi**
> ölçümdür; güncel sayı **152 havuz / 1.756 soru**dur.

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

## 2. Dal (branch) ve devir — bu iş nerede yapılacak

Bu iş, açık **PR #4**'ün hattının devamıdır ama **aynı dala yazılmaz** ve
**merge edilmez**. Devir **dosya teslimiyle** olur: soru üreten taraf dosyaları
kendi dalına koyar, uygulama hattına dosyalar tek tek alınır.

- Açık PR: **#4** — `arena/cc4de070-analiz-merkezi` → `main`
- O dal aktif olarak başka bir ajan tarafından kullanılıyor (uygulama düzeltmeleri)
- Doğrudan oraya push etmek çakışma üretir
- **PR açma / merge etme yok.** PR #4'ün kaderi kullanıcı kararıdır.

### Komutlar — soru üreten taraf

```bash
# 1) Hattı al
git fetch origin
git checkout -b soru-uretim origin/arena/cc4de070-analiz-merkezi

# 2) Üret, kabul kapısından geçir
node scripts/soru-uret-dogrula.js site/content/soru_havuzlari

# 3) Kendi dalına koy
git add site/content/soru_havuzlari/*.json
git commit -m "10. sınıf soru havuzları (158 çıktı)"
git push -u origin soru-uretim
```

Teslim = dosyaların `origin/soru-uretim` dalında durması. Bitince "dosyalar
hazır" demen yeterli; **PR açmıyorsun.**

### Alma — uygulama tarafı (merge YOK)

```bash
git fetch origin
git restore --source=origin/soru-uretim -- site/content/soru_havuzlari/
node scripts/havuz-index-uret.js     # index.json
node scripts/konu-esleme-uret.js     # konu_esleme.json
node scripts/meb-kazanim-uret.js     # okz-meb.js + kazanim_konu_10.json
npm run test:hepsi
```

`git restore --source=...` yalnız **dosyayı** getirir; geçmiş birleştirmez,
`git merge` değildir. `index.json` / `konu_esleme.json` / `okz-meb.js`
**elle düzenlenmez** — yukarıdaki betikler üretir.

### Yasaklar

- ❌ `arena/cc4de070-analiz-merkezi` dalına **doğrudan** push
- ❌ **PR merge / `git merge`** (birleştirme kararı kullanıcının)
- ❌ `main`e doğrudan push
- ❌ `index.json`, `konu_esleme.json`, `site/okz-meb.js` elle düzenleme

### Açık karar — mevcut havuzlarla çakışma (son ölçüm)

Plandaki 158 çıktının **128'i**, bugün havuzu olan bir kodla aynı
(`kazanim_konu_10.json` → `kodlar`). Yalnız **30** kod tamamen yeni.
Uygulama bir konuya **tek** havuz bağlar (`bkt-engine.js` → `resolvePoolId`,
birebir `topic_key`). Bu yüzden aynı içerik iki ayrı konu olarak listelenmesin
diye şu kural kullanıcı onayı bekliyor:

- **A (önerilen):** aynı koda düşen yeni sorular mevcut havuz dosyasına
  **eklenir** (tek konu, iki kaynak; 10'luk eski havuz korunur).
- **B:** yeni havuz ayrı konu olarak eklenir (aynı içerik iki başlıkta).
- **C:** eski havuz arşivlenir, yalnız yenisi kalır (1.756 soru kaybolur — önerilmez).

Karar verilene kadar yeni dosyalar **alınmaz**.

---

## 3. Kaç soru üretilecek — tek kural

```
hedef soru = max(10, 2 × süreç bileşeni sayısı)
her süreç bileşeni = bir alt_beceri → her birine EN AZ 2 soru

flashcard sayısı = soru sayısı       → HER SORU İÇİN TAM 1 KART
```

İki sayı vardır, ikisi de zorunludur:

- **Soru:** taban 10. Yalnızca "her süreç bileşenine en az 2 soru" şartı
  10'u aşmayı gerektiriyorsa artar (`max(10, 2 × süreç)`).
  158 çıktının 139'u tam 10, 19'u daha fazla.
- **Flashcard:** istisnasız soru sayısı kadar. 1:1'dir, "isteğe bağlı" değildir.
  Mevcut 172 havuzun tamamı böyledir (1956 soru / 1956 kart).

Örnek: `DKAB.10.1.1` → 2 süreç bileşeni → `max(10, 4) = 10` soru,
her süreç için 5 → **10 soru + 10 flashcard**.

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

`flashcards` dizisi boş bırakılırsa dosya **reddedilir**. Sorular yazıldıktan
sonra aynı sayıda kart eklenir (§6.3).

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
| `flashcards` | ✅ | `sorular` ile **birebir**: 10 soru → 10 kart |

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
| `flashcard` | `{front, back}` — **zorunlu**, her soruda. Soru başına 1 kart. |
| `gorsel` | Soruya göre karar verilir — bkz. §8. Şekle gönderme varsa zorunlu. |
| `kazanim` | Havuzdaki `kazanim` ile aynı. |

### 6.3 Flashcard dizisi

Havuz düzeyinde `flashcards` dizisi **sorularla birebir** olmalıdır:
10 soru → 10 kart. `id` daima `<soru_id>:flashcard` biçimindedir.

```json
"flashcards": [
  { "id": "din_10_t01_c01_o01:flashcard", "front": "…", "back": "…" },
  { "id": "din_10_t01_c01_o02:flashcard", "front": "…", "back": "…" }
]
```

Kart, o sorunun öğrettiği **tek** şeyi sorar. `front` ile `back` aynı olamaz.
Kart metni sorunun kopyası değildir; soru çözüldükten sonra akılda kalması
gereken bilgiyi hedefler.

```json
{ "id": "mat_10_t01_c01_o01:flashcard",
  "front": "Dik üçgende dar açı α için tanjant oranını karşı ve komşu dik kenarlarla yaz.",
  "back": "tan α = karşı dik kenar / komşu dik kenar." }
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
9. **Flashcard:** Her soru için **tam 1 kart**. Havuz düzeyindeki `flashcards`
   dizisi sorularla birebir (10 soru → 10 kart). `id` = `<soru_id>:flashcard`.
   `front` ≠ `back`. Kart, sorunun kopyası değil; sorunun öğrettiği tek şeyi sorar.
10. **Görsel:** Kota yok. Soru bazında karar verilir (§8). Metin bir şekle
    gönderme yapıyorsa (`şekilde`, `grafikte`, `tabloda`, `düzenekte`,
    `devredeki`, `haritada`, `şemada`, `kesitte`, `görselde` …) `gorsel`
    **zorunludur**; yoksa doğrulayıcı hata verir. Tanım §8.1 tiplerine uyar.
11. **Görselle metin tutarlı:** Görseldeki etiket/sayı ile metindeki veri aynı
    olur. Görsel süs değildir; sorunun çözümü için gereken bilgiyi taşır.

---

## 8. Görsel — isteğe bağlı değil, soru başına karar

**Kazanım başına görsel sayısı yoktur.** Aynı çıktının soruları farklı
ihtiyaç taşır:

| Soru | Görsel |
| --- | --- |
| "Dik kenarları 7 ve 24 birim olan dik üçgende tan α kaçtır?" | **gerekir** — kenar değerleri bir şekle bağlı |
| "1 − cos²x ifadesinin eşiti nedir?" | **gerekmez** — saf cebirsel özdeşlik |
| "Şekildeki düzenekte X maddesi hangi kaba eklenmiştir?" | **gerekir** — "şekildeki" diyor |
| "Ohm yasasına göre direnç sabitken akım ile gerilim ilişkisi nedir?" | gerekmez |
| "Aşağıdaki devrede eşdeğer direnç kaç Ω'dur?" | **gerekir** — "aşağıdaki devre" diyor |

Karar **sorular yazıldıktan sonra, tek tek** verilir. Sıra:

1. **Soruyu yaz.** Görseli önce tasarlama; soru metni neyi gerektiriyorsa onu çiz.
2. **Kendine sor:** bu soru görsel olmadan çözülebilir mi?
   - Hayır → `gorsel` alanını yaz (§8.1 tipleriyle).
   - Evet ama görsel anlamayı kolaylaştırıyor → yine de ekleyebilirsin.
   - Evet ve gereksiz → alanı **hiç yazma**.
3. **Metin ile görseli eşleştir.** Metin "şekilde", "grafikte", "tabloda",
   "düzenekte", "devredeki", "haritada", "şemada", "kesitte", "görselde"
   gibi bir ifadeyle bir şekle gönderme yapıyorsa `gorsel` **zorunludur** —
   doğrulayıcı bunu arar ve yoksa **hata verir**.

> Bu kural tek yönlüdür: şekle gönderme varsa görsel şart. Şekle gönderme
> yoksa görsel yasak değildir, ama zorunlu da değildir. "Şu kazanımda şu
> kadar görsel olacak" diye bir kota **yoktur**.

### 8.1 Görsel tipleri

`site/gorsel.js` yedi tip destekler. Tanım geçersizse **soru reddedilir**
(`require("./site/gorsel.js").dogrula(gorsel)`).

| Tip | Ne için | Zorunlu alan |
| --- | --- | --- |
| `ucgen` | dik üçgen, trigonometrik oranlar | `kenarlar` |
| `geometri` | serbest üçgen/çokgen, açıortay, kenarortay | `noktalar` |
| `grafik` | hız-zaman, kuvvet-yol, ohm, çözünürlük eğrisi | `seriler` |
| `tablo` | ölçüm tablosu, veri tablosu | `satirlar` |
| `cember` | birim çember, açı | `aci` |
| `vektor` | kuvvet, hız vektörleri | `vektorler` |
| `sema` | akış, döngü, sınıflandırma | `kutular` |

```json
"gorsel": {
  "tip": "grafik",
  "xEkseni": "t (s)",
  "yEkseni": "v (m/s)",
  "seriler": [{ "ad": "v", "noktalar": [[0, 0], [2, 10], [4, 10]] }],
  "izgara": true
}
```

### 8.2 Hangi içerik görsel ister

Bunlar **tipik** durumlardır, kural değil — yine soru bazında karar verilir:

| Ders | Görsel gerektiren soru tipi | Uygun tip |
| --- | --- | --- |
| Matematik | dik üçgende oran, sinüs/kosinüs teoremi, üçgen alanı | `ucgen`, `geometri` |
| Matematik | referans fonksiyon grafikleri, dönüşümler | `grafik` |
| Matematik | koordinat düzlemi, iki nokta arası uzaklık | `geometri` |
| Matematik | iki kategorik değişkenli veri, koşullu olasılık | `tablo`, `sema` |
| Fizik | hız-zaman, ivme-zaman, kuvvet-yol grafikleri | `grafik` |
| Fizik | elektrik devresi, direnç/üreteç bağlama | `sema` |
| Fizik | dalga biçimi, periyot, dalga boyu | `grafik` |
| Fizik | yansıma/kırılma ışın çizimi | `geometri` |
| Kimya | tanecik modeli, tepkime öncesi/sonrası | `sema` |
| Kimya | gaz yasaları, çözünürlük-sıcaklık eğrisi | `grafik` |
| Kimya | deney düzeneği | `sema` |
| Biyoloji | fotosentez/solunum evreleri, madde döngüsü | `sema` |
| Biyoloji | enerji piramidi, popülasyon değişimi | `grafik`, `sema` |
| Coğrafya | harita, levha hareketi, yer şekli kesiti | `sema`, `geometri` |
| Coğrafya | sektör dağılımı | `grafik`, `tablo` |

Sayısal değer verilmemiş, tamamen sözel bir soruda görsel eklemek
zorunlu değildir — ama **"şekildeki" deyip görsel koymamak hatadır**.

### 8.3 İnceleme listesi

Doğrulayıcı, görselsiz **ve** şekle gönderme yapmayan soruları bir listeye
yazar. Bu liste "bunlara görsel gerekmez" demek değildir; "bunlara tek tek
bakılmalı" demektir:

```bash
INCELEME=1 node scripts/soru-uret-dogrula.js <dizin>
```

Listedeki her soru için kendine sor: *görsel olmadan anlaşılıyor mu?*
Anlaşılmıyorsa görseli ekle. Bu adım atlanmaz.

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

# 5) Görsel incelemesi — görselsiz soruların listesi (tek tek bakılır)
INCELEME=1 node scripts/soru-uret-dogrula.js site/content/soru_havuzlari
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
| 8 | Her soruda `flashcard` var; `flashcards.length == sorular.length`; toplam ≥ 1.686 kart |
| 9 | Şekle gönderme yapan her soruda `gorsel` var ve §8.1 tipine uyuyor |
| 10 | `INCELEME=1` listesindeki her soru tek tek gözden geçirildi |
| 11 | Uygulama kodu **değiştirilmedi** (yalnız veri eklendi) |

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
her soru için 1 flashcard                 → front/back
        ↓
soruları bitirdikten sonra TEK TEK        → bu soru görsel ister mi?
  evet → gorsel alanı (§8.1 tipleri)      → hayır → alanı yazma
        ↓
site/content/soru_havuzlari/<konu_id>.json
        ↓
soru-uret-dogrula.js → havuz-index-uret.js --plan → validate:pools → test:hepsi
        ↓
INCELEME=1 ... → görselsiz listeyi gözden geçir
        ↓
dal soru-uretim → PR #4'ün hattına
```
