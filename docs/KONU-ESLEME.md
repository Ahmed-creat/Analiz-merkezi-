# Okulizyon Kazanım → Konu Başlığı Eşlemesi

> v34.8-konu · 28.10.2026

## Sorun

Okulizyon, yanlış/boş sorunun konusunu **kazanım cümlesi** olarak verir:

```
Dik üçgende trigonometrik oranlar ve trigonometrik özdeşliklerle
ilgili varsayımlarda bulunur.
```

Uygulama ise **konu başlığı** kullanır:

```
1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler
```

İki metin birebir uyuşmadığı için iki ayrı sorun doğuyordu:

| Belirti | Kök neden |
|---|---|
| Aynı konu iki ayrı kayıt gibi görünüyor | BKT anahtarı `Ders > kazanım cümlesi` oluyordu; müfredat başlığıyla eşleşmiyordu |
| "Dersi çalıştım, soru havuzundan soru gelmiyor" | Soru havuzu `Ders > Konu başlığı` ile aranıyor (`resolvePoolId`), kazanım anahtarıyla **hiç** bulunamıyordu |
| Ders adları tutmuyor | Okulizyon `Türkçe`, `Matematik-1`, `Tarih-1`, `Coğrafya-1` gönderiyor; uygulama `Türk Dili ve Edebiyatı`, `Matematik`, `Tarih`, `Coğrafya` bekliyor |

Kanıt (gerçek kullanıcı verisi): `bkt_state` içinde **26 kayıt** vardı, **25'i** kazanım cümlesiydi,
yalnız 1'i gerçek konu başlığıydı. Hiçbiri soru havuzuna bağlı değildi.

## Çözüm

### 1. Arama indeksi — `site/content/konu_esleme.json`

`scripts/konu-esleme-uret.js` soru havuzlarından 152 havuzluk bir indeks üretir (≈55 KB).
Her havuzun arama metni = konu başlığı + `baslik` + `etiketler` + **`alt_beceri` metinleri**.

`alt_beceri` alanları da kazanım cümlesidir → **kazanım ↔ kazanım** karşılaştırması yapılır,
bu da en güçlü sinyaldir.

```bash
npm run esleme:uret      # soru havuzları değişince yeniden üret
```

### 2. Eşleyici — `site/okz-konu.js`

```js
OKZK.indeksKur(veri)
OKZK.esle(kazanim, ders, indeks)   // → { konu, topicKey, konuId, skor, guven }
OKZK.adaylar(kazanim, ders, indeks, 3)
OKZK.konular(ders, indeks)
```

**İki seviye vardır ve karıştırılmaz:**

| `guven` | Anlamı | Davranış |
|---|---|---|
| `kesin` | Konu başlığı kazanım cümlesinin içinde **aynen** geçiyor (`Türkü`, `Noktalama İşaretleri`, `Sabit Hızlı Hareket`) | **Otomatik** uygulanır |
| `oneri` | Yalnız kelime/ikili-kelime örtüşmesi var, **yanlış olabilir** | **Otomatik uygulanmaz**, öğrenci onaylar |
| `yok` | Anlamlı örtüşme yok | Eşlenmez, arayüzde listelenir |

> Dürüstlük kuralı: yanlış konuya yazmak, eşlememekten daha kötüdür.
> Bu yüzden `oneri` seviyesi asla sessizce kaydedilmez.

### 3. Uygulama tarafı — `site/app-pwa.js`

- `okzKayitKonu(ders, kazanim)` → ders adını kanonikleştirir, konuyu eşler.
  Okulizyon'dan içe aktarım artık bu fonksiyondan geçer.
- Her hata kaydında `kazanim` alanı **saklanır** (özgün Okulizyon metni) — eşleme sonradan
  değiştirilebilsin diye.
- `okzKonulariOnar()` → açılışta eski kayıtları onarır:
  - ders adları kanonikleşir (eşleşme olmasa bile),
  - eşlenen konular başlığa çevrilir,
  - aynı konuya düşen BKT kayıtları **birleştirilir** (gözlem sayısı toplanır, `L` ağırlıklı ortalama,
    hata geçmişi birleşir, ileri onay durumu korunur),
  - flashcard'lar, mini test kuyruğu ve oturumları yeni anahtara taşınır.
  - **İdempotent**: ikinci çalıştırmada hiçbir şey değişmez.
- `window.__okzKonuPoolEsle(ders, konu)` → `bkt-engine.js`'in `resolvePoolId` fonksiyonuna köprü.
  Kazanım anahtarı kalmış olsa bile soru havuzu bulunur (yalnız `kesin` eşleşmede).

### 4. Arayüz — Profil → Okulizyon → Konu Eşlemesi

- Eşlenmemiş kazanımlar ders ders listelenir.
- Her satırda o dersin konu başlıklarından bir açılır liste var.
- Öneri **yalnız güçlüyse** (≥ %35) hazır seçili gelir; zayıf öneri metin olarak gösterilir
  ama kutuya yazılmaz.
- "Seçilenleri eşle ve birleştir" → `state.okulizyon.konuHaritasi` içine yazılır,
  kayıtlar anında onarılır. **Bir kez** yapılır, sonraki çekimlerde otomatik uygulanır.

### 5. Öğrenme Durumu paneli

- Artık **yalnız Konu Takibi** sayfasında görünür (her sayfanın altında çıkmıyordu).
- Panelin ne gösterdiğini kendisi açıklar (Yeterlilik / Hafıza / Durum / Test).
- Soru havuzu bulunamazsa **sebebini** yazar: "Soru havuzu eşlenmedi — Profil → Okulizyon → Konu Eşlemesi".
- Öğrenme testi ileri tarihliyse tarihini yazar.
- Sıralama: **eylem bekleyen** konular (kısa kontrol zamanı gelmiş / test kuyrukta) en üstte.
- Uzun kazanım başlıkları 54 karakterde kısalır, tamamı `title` (tooltip) içinde.

## Panel neyi gösteriyor?

| Alan | Anlamı |
|---|---|
| **Yeterlilik (%)** | BKT motorunun "bu konuyu biliyor" olasılığı (`L`), 0–100 |
| **Hafıza (%)** | O konunun tekrar kartlarının ortalama hatırlama gücü (`memory_bar`) |
| **Durum** | Veri yetersiz → Gelişiyor → Pekişiyor → Önek Onaylandı → Riskli |
| **Kısa Kontrol — 3 soru** | Konu tamamlanınca hemen açılan kontrol testi (`precheck`) |
| **Öğrenme Testi — 5 soru** | Aralıklı tekrar takvimine göre (3 gün, sınav < 7 gün ise 2 gün) açılır |
| **Hataların şurada yoğunlaşıyor** | Son 30 günde 2+ kez tekrarlanan alt beceri |
| **Önce şunu sağlamlaştır** | İlişki grafındaki kök eksik |

## Testler

```bash
npm run test:konu   # 91 birim + 42 entegrasyon
npm run test:bkt    # 17 panel duman testi dahil
npm run test:ders   # 61 + 91 + 42
```

- `tests/okz-konu.test.js` — 91 test: Türkçe sadeleştirme, kesin/öneri ayrımı,
  yanlış eşleşme yapmama, gerçek 26 anahtar, idempotentlik.
- `tests/okz-konu-entegrasyon.test.js` — 42 test: **app-pwa.js'deki gerçek kod** sahte bir
  ortamda çalıştırılır; 26 bozuk kayıt onarılır, kayıp olmadığı ve tekrar çalıştırmanın
  zararsız olduğu doğrulanır.
- `tests/bkt-panel.test.js` — 17 test: panel yalnız Konu Takibi'nde mi, açıklama metni var mı,
  eşlenmeyen konu için sebep yazıyor mu, çalışılan konu en üstte mi.

## Bilinen sınır

Otomatik eşleşme 26 gerçek kazanımın **6'sını** kesin olarak çözdü. Kalan 19'u öğrenci onayı
bekliyor — çünkü Türk Dili ve Edebiyatı'nda uygulama konuları tür adlarıdır ("Koşma", "Türkü")
ve "metinlerden çıkarım yapar" gibi kazanımların hangi türe ait olduğu **metinden çıkarılamaz**.
Tahmin edip yanlış konuya yazmak yerine öğrenciye sorulur.
