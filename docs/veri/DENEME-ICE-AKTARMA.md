# Deneme Verisi — Uygulamanın İçe Aktarma JSON Yapısı

Bu belge iki şeyi verir:

1. Uygulamanın **kendi** içe aktarma biçimi (koddan çıkarıldı, uydurma yok).
2. Bu biçime dönüştürülmüş **9. sınıf deneme verisi**: `site/veri/9-sinif-denemeler.json`

Kaynak: 9. sınıf deneme dökümü PDF'i (7 sınav, 22.10.2025 – 22.05.2026).

---

## 1. Uygulama nasıl içe aktarıyor

`site/index.html` → `importData(input)` (satır ~1803):

```js
const parsed = JSON.parse(reader.result);
const data = parsed.user ? parsed : (parsed.state && parsed.state.user ? parsed.state : null);
state = mergeDeep(freshState(), data);   // ← TAM DURUM DEĞİŞİMİ
saveState();
```

Kabul edilen iki biçim:

| Biçim | Örnek |
| --- | --- |
| Doğrudan durum | `{ "user": {...}, "exams": [...] }` |
| Sarmalayıcı | `{ "_okumaNotu": "...", "state": { "user": {...}, "exams": [...] } }` |

> ### Bu düğme iki modda çalışır (v70)
>
> | Dosyada `_mod` | Davranış |
> | --- | --- |
> | `"deneme-birlestir"` | **Yalnız sınav ekler.** Konu takibi, hafıza, BKT, profil, görevler **korunur** |
> | yok | Tam durum değişimi — `mergeDeep(freshState(), data)`, dosyada olmayan her alan sıfırlanır |
>
> `site/veri/9-sinif-denemeler.json` **`_mod = "deneme-birlestir"`** taşır.
> Yani bu dosyayı **doğrudan düğmeyle yükleyebilirsin**, hiçbir verin silinmez.
> Aynı sınav (ad + tarih) ikinci kez eklenmez.

`state.user` zorunludur; yoksa dosya reddedilir ("Dosya okunamadı").

---

## 2. `state.exams[]` şeması

Koddaki tek doğru kaynak: `freshState()` yorumu + `saveExam` + `processRecord`.

```json
{
  "id": "pdf9-01",
  "name": "1. Deneme: 9. Sınıf Süreç İzleme 1",
  "date": "2025-10-22",
  "lessons": {
    "Türk Dili ve Edebiyatı": { "d": 27, "w": 3, "e": 0 }
  },
  "errorLogs": [
    {
      "qno": 1,
      "lesson": "Türk Dili ve Edebiyatı",
      "topic": "Ses Olayları",
      "kazanim": "Ses olayları",
      "type": "Konuyu Bilmiyordum",
      "date": "2025-10-22"
    }
  ],
  "total": 120,
  "net": 85.5
}
```

| Alan | Zorunlu | Kural |
| --- | --- | --- |
| `id` | ✅ | Tekil. BKT işleme anahtarı `record:deneme:<id>` buna bağlı |
| `name` | ✅ | Liste ve grafiklerde görünen ad |
| `date` | ✅ | `YYYY-MM-DD` |
| `lessons` | ✅ | `{ "<Ders>": { d, w, e } }` — d doğru, w yanlış, e boş |
| `errorLogs` | ✅ | Soru başına bir kayıt; boş dizi olabilir |
| `total` | ✅ | Toplam soru (liste satırında "N soru") |
| `net` | ✅ | **Doğrudan gösterilir.** Ders neti `d − w/4` ile hesaplanır |

### 2.1 Ders adları

`LESSON_CONFIG` (9. sınıf) dışında anahtar kullanılamaz, yoksa
"Ders Detayları" tablosunda görünmez:

```
Türk Dili ve Edebiyatı · Matematik · Fizik · Kimya · Biyoloji · Tarih · Coğrafya · Din Kültürü
```

Azami soru: TDE 30 · Matematik 30 · Fizik 10 · Kimya 10 · Biyoloji 10 · Tarih 12 · Coğrafya 12 · Din 6 = **120**

### 2.2 Net kuralı

```js
NET_RULE = { wrongDivisor: 4 }        // net = d − w/4
```

### 2.3 `errorLogs[].type` — geçerli değerler

Yanlış için: `Konuyu Bilmiyordum` · `ANLAMADIM` · `İşlem Hatası/Dikkatsizlik` · `Kodlama/Kitapçık Hatası`

Boş için: `KONUEKSİKLİĞİ` · `ÇÖZÜMYOLUNUBULAMADIM` · `SÜREYETMEDİ`

BKT motoru her kaydı gözlem sayar (`bkt-engine.js` → `processRecord`). Ağırlıklar:
`Konuyu Bilmiyordum` 1.5 · `KONUEKSİKLİĞİ` 1.5 · `ÇÖZÜMYOLUNUBULAMADIM` 0.8 · `ANLAMADIM` 0.5.

> **Yazım tuzağı:** doğru kod `KONUEKSİKLİĞİ` (**eksik**). `KONUEKSİZLİĞİ` (**eksiz**)
> yazılırsa `REASON_WEIGHTS`'ta karşılığı olmaz: ağırlık uygulanmaz, kayıt
> "büyük hata" sayılmaz — sessiz bozulma. `scripts/deneme-ice-aktarma-hazirla.js`
> bu değeri uygulama kaynağından okur, elle yazmaz.

### 2.3.1 Bu dosyada neden türü

Kullanıcı isteğiyle **tüm kayıtlar** `KONUEKSİKLİĞİ` (ağırlık 1.5):

```
KONUEKSİKLİĞİ: 209 / 209
```

Yanlış ve boş ayrımı `lessons[ders].w` / `lessons[ders].e` alanlarında korunur;
`errorLogs` içinde ikisi de aynı nedenle yazılır.

### 2.4 `topic` nasıl doldurulur

Uygulama `topicKey(topic, lesson)` ile `"Ders > Konu"` üretir; Konu Takibi ve
soru havuzu bu anahtarla çalışır. İki durum:

- Konu başlığı **kesin** eşleşiyorsa (kazanım metni başlığı içeriyorsa) başlık yazılır.
- Eşleşme yoksa **kazanım metni** yazılır (uygulamanın kendi davranışı da budur:
  `okzKayitKonu` → `topic: e ? e.konu : kazanim`). Uydurma başlık yazılmaz.

---

## 3. Üretilen dosya

`site/veri/9-sinif-denemeler.json` — 58 KB, 7 sınav, **209 hata kaydı**.

```
sınav   tarih        net     kayıt
1       2025-10-22   85,50   26
2       2025-11-24   78,50   30
3       2025-12-23   65,25   26
4       2026-02-07   77,75   32
5       2026-03-14   82,25   31
6       2026-03-26   67,50   32
7       2026-05-22   78,50   32
```

### 3.1 PDF'ten **aynen** alınanlar

- Sınav adı ve tarihi
- Genel net → `net`
- Her dersin beyan neti → `lessons[ders].net_beyan`
- Yanlış ve boş kazanım listeleri + adetleri → `errorLogs` (her soru ayrı kayıt)

### 3.2 Türetilenler (PDF'te yok)

| Alan | Nasıl | Neden |
| --- | --- | --- |
| `lessons[ders].d` | `round(beyan_net + w/4)` | PDF doğru sayısını vermiyor; net tutsun diye |
| `total` | `120` | 9. sınıf deneme formatı (`LESSON_CONFIG` toplamı) |
| `type` | yanlış → `Konuyu Bilmiyordum`, boş → `KONUEKSİKLİĞİ` | PDF nedeni yazmıyor; ikisi de 1.5 ağırlıklı |
| `topic` | kazanım → konu başlığı eşlemesi | Eşleşmezse kazanım metni kalır |

**Yuvarlama payı:** türetilen `d` yüzünden bazı derslerde hesaplanan net
beyandan ±0,25 sapar. Sapmalar dosyada `uyarilar` alanında tek tek yazılı.

### 3.3 Bileşik ders satırları

PDF'te 4. sınavda `Tarih & Coğrafya & Din (27,50)`, 7. sınavda
`Tarih & Din (15,50)` tek satır. Netleri derslere bölmek mümkün değil
(bölününce tam sayı çıkmıyor), bu yüzden **tek anahtar** olarak duruyor.
Hata kayıtları ise doğru derse yazıldı (Tarih / Coğrafya / Din Kültürü).

### 3.4 Kaynak içi tutarsızlık

`_tutarsizliklar` alanında beyan edildi. Tek vaka:

> `pdf9-01 · Biyoloji` → `d+w+e = 11 > azami 10`.
> PDF hem neti (8,75) hem 1 yanlış + 1 boş yazıyor; 10 soruluk derste
> üçü birden doğru olamaz (8 doğru − 0,25 = 7,75). **Beyan net korundu.**

---

## 4. Nasıl yüklenir

### 4.1 İçe aktar düğmesi (artık güvenli)

1. Uygulamayı aç
2. **Ayarlar → Verileri İçe Aktar** (veya profil menüsündeki aynı düğme)
3. `9-sinif-denemeler.json` dosyasını seç

Dosya `_mod: "deneme-birlestir"` taşıdığı için:

- Konu takibi, hafıza, BKT durumu, profil adı, seri, plan, görevler **korunur**
- 7 sınav `exams` listesine eklenir, tarihe göre sıralanır
- BKT motoru çalışır, 209 kayıt konu durumlarına işlenir
- Bildirim: `7 deneme eklendi.`

Aynı dosyayı tekrar yüklersen: `Yeni deneme yok — hepsi zaten kayıtlı.`

### 4.2 Konsol yöntemi (isteğe bağlı)

```js
(async () => {
  const r = await fetch('/veri/9-sinif-denemeler.json', { cache: 'no-store' });
  const { state: gelen } = await r.json();
  let eklenen = 0, atlanan = 0;
  for (const ex of gelen.exams) {
    if (state.exams.find(e => e.name === ex.name && e.date === ex.date)) { atlanan++; continue; }
    state.exams.push(ex); eklenen++;
  }
  state.exams.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  saveState();
  if (window.AnalizBKT?.processNewRecords) window.AnalizBKT.processNewRecords();
  navigate('exams');
  console.log(`eklendi ${eklenen} · atlandı ${atlanan}`);
})();
```

### 4.3 Tam yedek geri yükleme

`_mod` alanı **olmayan** bir dosya seçersen eski davranış sürer: tüm durum
değişir. Bunu yalnızca yedekten geri dönerken kullan ve önce **Dışa Aktar**
ile mevcut veriyi sakla.

---

## 4.4 PDF'ten yeniden üretme (tek komut)

JSON elle yazılmaz; PDF'ten üretilir:

```bash
node scripts/deneme-pdf-ayikla.js "9-sinif-denemeler.pdf"          # sadece doğrula
node scripts/deneme-pdf-ayikla.js "9-sinif-denemeler.pdf" --yaz    # JSON'u yaz
```

Çıktı, her sınav için **aritmetik kontrolü** basar:

```
✓ tam   ◆ fark = kapasite (eksik dersler tümüyle doğru)
! fark kapasiteye sığıyor   ✗ sığıyor mu (sığmıyorsa exit 1)
```

### Eksik ders ne demek?

PDF bazı sınavlarda bazı derslerin **blok başlığını hiç yazmıyor** (ders o
sınavda raporlanmamış). O dersler yine de JSON'a **girer**, çünkü:

```
Σ(ders neti) = Genel Net   →   eksik derslerin neti = Genel Net − ders toplamı
```

Bu bir tahmin değil, **aritmetik zorunluluk**. Net derslere kapasite oranıyla
dağıtılır; `d`, `w`, `e` tam sayı ve `d+w+e ≤ azami` olacak şekilde en az
yanlışlı çözüm seçilir (dinamik programlama).

Bu dersler `"kaynak": "aritmetik-turetme"` ile **açıkça işaretlenir** ve
`uyarilar[]`'a gerekçesi yazılır. PDF'te o dersin kazanımı olmadığı için
`errorLogs`'a **kayıt eklenmez** (`w`/`e` yalnız neti tutmak için vardır).

### Elle düzeltme

PDF'te olmayan bir dersin gerçek dağılımını biliyorsan
`docs/veri/eksik-dersler.json` dosyasını doldur — betik onu türetme yerine
kullanır ve `"kaynak": "elle"` yazar.

### Sınav bazlı ders dağılımı (`ders_azami`)

Yayın kurulu bir sınavda soru dağılımını genel azamiden farklı tasarlayabilir.
Örnek: **Gis-3** — Tarih 14, Din Kültürü 4 (genel azami 12 ve 6). Orijinal karne
de Tarih'i 14 soru üzerinden hesaplamıştır.

Bu bir hata **değildir** ve soru **taşınmaz**. Sınav kendi azamisini bildirir:

```json
"ders_azami": { "Tarih": 14, "Din Kültürü": 4 }
```

Test, azami kontrolünü önce `ders_azami` ile yapar; yoksa `LESSON_CONFIG`.
Sınav bazlı dağılım varsa `_tutarsizliklar` içinde `tur: "sinav-bazli-dagilim"`
kaydı **zorunludur**. Sınavın toplam soru sayısı yine 120 olmalıdır.

### Beyanlı tutarsızlıklar

PDF kendi içinde çelişebilir (örn. `27,50 net` + `3 yanlış` → 31,25 soru, azami 30).
Bu durumda **veri kırpılmaz**; çelişki kök düzeyindeki `_tutarsizliklar`
dizisine ve sınavın `uyarilar[]` alanına yazılır. Test, beyanlı sınavlarda
aritmetik toleransını gevşetir — beyansız bir sapma **testi düşürür**.

### GENEL satır ⇔ ders dökümü çelişkisi (v2 kuralı)

Belgenin GENEL satırı ile ders dökümü aynı sınavı farklı gösteriyorsa
**GENEL satır esastır** (kullanıcı talimatı, 17 Kas 2026: *"genel satırı baz al
ve jsonu ona göre hazırla"*).

Uygulama yolu:

1. Genel satırın D/Y/B ve neti alınır.
2. Ders dökümü ile genel satır arasındaki fark `Δd + Δy + Δb = 0` olacak şekilde
   hesaplanır; net farkı **0** olmalıdır (`Δd − Δy/4 = 0`). Değilse veri yazılmaz,
   kullanıcıya sorulur.
3. Fark, **en çok boşu (B) olan ders satırına** uygulanır — okuma sapması en çok
   orada birikir. Dersin toplam soru sayısı ve neti değişmez.
4. `kazanim_farki[ders].baslik` yeni D/Y/B ile güncellenir; `liste` (belgede yazılı
   kazanımlar) **aynen kalır** — kayıt uydurulmaz.
5. Sınavın `uyarilar[]` alanına ve `_tutarsizliklar` kaydına `cozum` bloğu yazılır:
   `{esas:"genel", genel, ders_toplami_once, uygulanan_ders, once, sonra, net_degisti:false}`.

Uygulanmış hâli: `pdf9-02` (82/14/24 · Matematik 8/2/20 → 9/6/15) ve
`pdf9-06` (73/22/25 · Matematik 13/5/12 → 12/1/17). İkisinde de sınav neti ve
toplam soru sayısı değişmedi.

---

## 5. Kontrol

```bash
node tests/deneme-ice-aktarma.test.js     # 564 doğrulama
node tests/deneme-import-butonu.test.js   # 35 doğrulama
# veya ikisi birden:
npm run -s test:deneme
```

**`deneme-ice-aktarma`:** alan bütünlüğü, tarih biçimi, ders adları, azami soru,
net−beyan farkı ≤ 0,25, kayıt sayısı = w + e (türetilmiş dersler hariç),
tek neden türü + kanonik yazım, Türkçe karakterler, uçtan uca BKT (209/209
gözlem) **ve aritmetik**:

| Kontrol | Kural |
|---|---|
| Σ `net_beyan` = sınavın `net`'i | **tolerans 0** — PDF'teki her ders eksiksiz |
| Σ`(d − w/4)` = sınavın `net`'i | ≤ 0,25 (beyanlı sınavda beyan edilen sapma) |
| Ders kapsamı | 8 dersin tamamı (birleşik satır kendi derslerini kapsar) |
| Ders azamisi | `ders_azami` varsa o, yoksa `LESSON_CONFIG` |
| Sınav bazlı dağılım | `ders_azami` varsa gerekçe kaydı zorunlu |

**`deneme-import-butonu`:** `importData`yı `index.html`'den çıkarıp sahte DOM'da
çalıştırır — birleştirme modunda profil/konu/hafıza/BKT/plan korunuyor mu,
sınavlar ekleniyor mu, tekrar yükleme mükerrer üretiyor mu, `_mod`suz dosya
eski davranışta mı.
