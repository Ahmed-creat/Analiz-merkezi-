# RAPOR — 18 Kasım · 41. tur · "Profilde konu eşleşmesi ne arıyor?" → panel kaldırıldı, eşleme otomatik (v82)

**Tarih:** 2026-11-18 · **Dal:** `arena/cc4de070-analiz-merkezi` · **Commit:** `541260c`
**Yayın:** `dpl_HFhQWzxXg1SGATt1CdQe7WfJuoZw` → **READY / PROMOTED** · https://analiz-merkezi.vercel.app
**Sürüm damgası:** `v82-oto-esleme` (PWA_SURUM ↔ SW CACHE `analiz-merkezi-v-20261118-v82-oto-esleme`)

Kullanıcı: *"Neden hâlâ okulizyon konu eşleşmesi var profilde? HANİ otomatik sorunsuzdu?"*

---

## 1) Kullanıcı haklı — ne bulundu

Profil penceresinde **"Okulizyon konu eşlemesi"** adlı katlanır bir bölüm vardı:
`Okulizyon konu eşlemesi · N bekliyor` başlığı, "N kazanım bekliyor" yazısı, her kazanım için bir **konu seçme kutusu** ve **"Önerileri kabul et ve eşle"** düğmesi.

Bu bölüm v78'den beri profilin içinde duruyordu ve "eşleme senin işin" izlenimi veriyordu. Oysa eşleme **zaten otomatik**:

| Katman | Ne yapar | Yer |
|---|---|---|
| 1 | **MEB resmî öğrenme çıktısı KODU** (ör. `COĞ.10.1.1`, `MAT.10.1.1`) → uygulamanın konusu. Ad benzerliğine güvenmez. | `site/okz-meb.js` |
| 2 | Konu başlığı kazanım cümlesinin içinde **aynen** geçiyorsa kesin eşleşme | `site/okz-konu.js` |
| 3 | Türk Dili ve Edebiyatı için 91 terimlik sözlük ("kavuştak" → Türkü) | `site/okz-tde.js` |
| 4 | Öğrenen önbellek: bir kez çözülen cümle Supabase'de saklanır | `kazanim_konu_cache` |

Bu katmanlar **açılışta** ve **her Okulizyon çekiminde** kendiliğinden çalışıyor (`okzKonulariOnar` → `okzKayitKonu`). Yani profildeki panel gerçek bir iş yapmıyordu; yalnız "elle düzelt" hissi veriyordu.

## 2) Yapılan

- **Profildeki panel tamamen kaldırıldı.** Artık profilde ne "konu eşlemesi" başlığı, ne bekleyen sayısı, ne konu seçme kutusu, ne de "Önerileri kabul et ve eşle" düğmesi var.
- Panelin kodunu oluşturan üç fonksiyon (`okzKonuEslenmemisKonular`, `okzKonuEsleKaydet`, `okzKonuEslemeHtml`) ve `okzKonuEsle` eylemi **silindi** — düğmesi kalmayan eylem ölü kod olarak bırakılmadı.
- **Eşleme motoruna dokunulmadı**: MEB kodu, kesin başlık, TDE sözlüğü, öğrenen önbellek aynen çalışıyor.
- **Veri kaybı yok:** eski sürümlerde elle kaydedilmiş eşlemeler (`konuHaritasi`) okunmaya devam ediyor.

## 3) "Otomatik sorunsuz" iddiası ölçüldü (testsiz iddia yok)

`tests/okz-konu-entegrasyon.test.js` içine **7b** bölümü eklendi: uygulamanın **gerçek** eşleme bloğu, `window.OKZM` (MEB katmanı) ile birlikte çalıştırılıyor ve kullanıcının 16 Kasım'da gönderdiği **36 gerçek Okulizyon kazanım cümlesi** tek tek deneniyor:

| Ölçüm | Sonuç |
|---|---|
| Kazanımı eşleşen | **36 / 36** |
| Soru havuzuna bağlanan | **34 / 36** |
| Havuzsuz kalan | 2 — Din Kültürü "İslam'da Bilgi ve Bilginin Kaynakları" (Din havuzu 2018 programına göre; veri boşluğu, arayüz değil) |
| Yanlış adaya kayma | Yok — Coğrafya'da bulanık eşleştirme "6.2 Afetlere Karşı Dirençli Yaşam Alanları" diyordu; **MEB kodu kazandı: "1.1 Coğrafi Bakış"** |

Bu davranış teste bağlandı: "gerçek kazanımların TAMAMI otomatik eşleşiyor", "en az 34 kazanım soru havuzuna bağlı", "hiçbir kayıt ham kazanım metninde kalmıyor (panel gerekmez)", "yanlış aday değil, MEB kodu kazanır".

Ayrıca **tarayıcı DOM testinde** (profil-merge) profilin gerçekten açıldığı doğrulandı: "profilde 'Konu Eşlemesi' paneli YOK", "konu seçim kutuları YOK".

## 4) Testler ve kapılar

| Kapı | Sonuç |
|---|---|
| `tests/okz-konu-entegrasyon.test.js` | **50/50** (7 yeni: 6'sı panelin kalktığını, 4'ü otomatik kapsamı ölçer) |
| `tests/okz-yuk.test.js` | **25/25** (panel beklentileri tersine çevrildi) |
| `tests/profil-merge` (jsdom) | **51/51** |
| `npm run -s test:hepsi` | **EXIT 0** · 33 adım |
| `node --check` | app-pwa · sw · bkt-engine · kart · okz-tde 5/5 + index gömülü JS ✓ |
| `validate:pools` / `test:pools` | 192/192 geçerli · **192 havuz / 2.110 soru** |
| `okz:kapsam` | 192 + 1 istisna (paragraf havuzu) |

## 5) Canlı doğrulama (fetch_page)

| URL | Beklenen | Görülen |
|---|---|---|
| `/app-pwa.js` satır 1 | `const PWA_SURUM = "v82-oto-esleme"` | ✅ |
| `/app-pwa.js` profil bölümü | "Okulizyon konu eşlemesi" paneli yok; giriş alanları + "Okulizyon sonuçları" var | ✅ |
| `/sw.js` | `CACHE = analiz-merkezi-v-20261118-v82-oto-esleme` | ✅ |

## 6) Bilinçli olarak YAPILMAYANLAR

- **Din Kültürü 2 kazanımın havuzu yok** — havuz üretmek ayrı bir iş (soru üretimi başka agent); uydurma havuz yazılmadı, kazanım MEB başlığına yazılıyor.
- Paragraf havuzu üretilmedi (kalıcı istisna) · PR #4 birleştirilmedi · eşikler/`AYT_WEIGHT`/`REVIEW_LADDER` dokunulmadı.
