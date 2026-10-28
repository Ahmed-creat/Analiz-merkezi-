# Okulizyon çekici — çalışan yöntem (v34.4, 28.10.2026)

Bu belge, Okulizyon sınav sonuçlarının **tarayıcı otomasyonu olmadan**, doğrudan
Supabase üzerinden çekildiği kurulumu ve **canlı doğrulama kanıtlarını** içerir.

---

## 1. Neden Playwright/Firestore yolu bırakıldı

Okulizyon giriş sayfası normal bir HTML formu gibi görünür ama aslında **gizli bir
AJAX API'si** kullanır. Sayfanın kendi betiği
(`/app2/ogrgiris/orbimassets/js/orbimogrgiris.js?v=257`) şu uçları çağırır:

| Uç | Yöntem | Gövde / parametre |
| --- | --- | --- |
| `/ajax/ogrencigirisarama.php` | POST (form) | `giristuru, adsoyad, ogrno, sinif, ilkodu, ilcekodu, kurumkodu` |
| `/ajax/ilceler.php?ilkodu=27` | GET | → `[{ilcekodu, ilceadi}]` |
| `/ajax/kurumlar.php?ilcekodu=1841` | GET | → `[{kurumkodu, kurum}]` |
| `/ajax/ogrencigiris.php` | POST (form) | `ogrid, sifre` (yalnız şifre gerekiyorsa) |
| `/app2/ogrenci/?pg=sinavsonuclari` | GET | oturum çereziyle sonuç HTML'i |

Arama yanıtı: `{tamam, ogrid, sifrevar, yksid, lgsid, kdsid, kpssid, mesaj}`

- `tamam && ogrid>0 && !sifrevar` → **oturum açıldı** (çoğu okulda durum bu)
- `tamam && ogrid>0 && sifrevar` → şifre gerekli
- `tamam && ogrid==0 && (yksid|lgsid|kdsid|kpssid)>0` → doğrudan oturum
- aksi hâlde `mesaj` = hata sebebi

Bu API doğrudan `fetch` ile çağrılabildiği için tarayıcı (Playwright), Firestore,
GitHub Actions ve `service_role` anahtarının GitHub secret'ı olarak eklenmesi
**gereksiz**dir.

## 2. Mimari

```
Profil (tarayıcı)  ──"Şimdi dene"──►  Edge Function  okulizyon-cek  (mod: ben)
                                            │  JWT → kullanıcı
                                            │  app_states.state.settings.okulizyon
                                            ▼
                                     okulizyon.com AJAX API
                                            │
                                            ▼
                     public.okulizyon_kuyrugu  (user_id, exams, durum, durum_mesaji, …)
                                            │
Profil (tarayıcı)  ◄──kuyruğu okur──────────┘
```

- **Edge Function içinde `service_role` hazır gelir** (`SUPABASE_SERVICE_ROLE_KEY`),
  yani RLS'i aşan yazma için ek anahtar/secret gerekmez.
- `pg_cron` günde bir kez `public.okulizyon_cron_tetikle()` çağırır; o da `pg_net`
  ile aynı fonksiyonu `mod: "run"` (tüm kullanıcılar) olarak tetikler.
- `vault` secret'ları: `okulizyon_fonksiyon_url`, `okulizyon_anon_key`.

## 3. Durum kodları (`okulizyon_kuyrugu.durum`)

| Kod | Anlamı | Kullanıcıya söylenen |
| --- | --- | --- |
| `ok` | Sonuçlar alındı ve ayrıştırıldı | "N sınav, M hata satırı aktarıldı" |
| `sifre-gerekli` | Okulizyon bu kayıt için şifre istiyor | Profil'deki şifre alanını doldur |
| `eslesme-yok` | İl/ilçe/okul Okulizyon listesinde yok | İl, ilçe, okul adını kontrol et |
| `red` | Kayıt bulunamadı / şifre reddedildi | Ad-soyad + okul no'yu birebir yaz |
| `bilgi-yok` | Profil'de ad/okul no yok | Alanları doldur |
| `sonuc-yok` | Giriş oldu, tablo okunamadı | Sonuçlar yayınlanmamış olabilir |
| `hata` | Ağ/sunucu hatası | Tekrar dene |

Hatalar artık **sessizce yutulmuyor**: her durum `durum_mesaji` ile birlikte
Supabase'e yazılır ve Profil ekranında sebebiyle birlikte görünür.

## 4. Kod eşleştirme (canlı veriyle doğrulandı)

`{il, ilçe, okul adı}` → `{ilkodu, ilcekodu, kurumkodu}` dönüşümü Türkçe karakter
farkı gözetmeyen bir normalizasyonla yapılır (`Şahinbey` = `SAHINBEY`).
Eşleşme bulunamazsa **yanlış okula giriş yapmak yerine durur** (`eslesme-yok`).
Eski uygulamadaki `"Akken"` yazımı `AKKENT` olarak eşlenir.

Canlı çıktı (Gaziantep / Şahinbey):

```
ilkodu 27 · ilcekodu 1841 · kurumkodu 751187 (AKKENT ANADOLU LİSESİ)
Gaziantep ilçeleri: ARABAN 1139 · GAZIANTEP MERKEZ 1335 · İSLAHİYE 1415 ·
KARKAMIŞ 1956 · NİZİP 1546 · NURDAĞI 1974 · OĞUZELİ 1549 · ŞAHİNBEY 1841 ·
ŞEHİTKAMİL 1844 · YAVUZELİ 1720
```

## 5. Ayrıştırıcı

- **Özet tablosu** (`Ders | Doğru | Yanlış | Boş`) → `lessons = {ders: {d, w, e}}`
- **Detay tablosu** (`Soru | Ders | Konu/Kazanım | Durum`) → `rows = [{qno, lesson, topic, status}]`,
  `status`: `w` (yanlış) / `e` (boş). Doğru sorular kuyruğa girmez.
- Sınav bağlantıları **link metninden** bulunur (`Profilim` gibi komşu metinler
  sınav sanılmaz), tarih `DD.MM.YYYY` → `YYYY-MM-DD`.

## 6. Canlı doğrulama kanıtları (28.10.2026)

| # | Çağrı | Sonuç |
| --- | --- | --- |
| 1 | `POST /functions/v1/okulizyon-cek` `{mod:"probe"}` | `sayfaKod 200`, `sayfaBoyut 23292`, `ilSayisi 82`, `gaziantepKodu "27"`, `ilceler/kurumlar` dolu, `297 ms` |
| 2 | `{mod:"test", kimlik:{… Şahinbey / AKKENT ANADOLU LİSESİ}}` | kodlar `27 / 1841 / 751187`; okulizyon.com gerçek JSON döndü: `{"tamam":false,"mesaj":"Herhangi bir kayıt bulunamadı...","ogrid":0,"dogrulandi":false}` |
| 3 | `{mod:"parse", html:<örnek tablolar>}` | `lessons.MATEMATİK = {d:12,w:3,e:5}`, `rows = [7/Üslü Sayılar/w, 11/Köklü Sayılar/e]`, `TOPLAM` atlandı, `baglanti = 1. DENEME SINAVI · 2026-10-12`, `Profilim` atlandı |
| 4 | `select public.okulizyon_cron_tetikle()` (vault → pg_net) | `{"mod":"run","kullanici":0}` — cron zinciri uçtan uca çalışıyor |
| 5 | `node tests/okulizyon-cekici.test.js` | **25/25** (testler yayınlanan `index.ts` dosyasını doğrudan okur) |

> 2 numaralı çağrı, "kayıt bulunamadı" döndürdü çünkü kullanılan kimlik **gerçek
> değil** (var olmayan bir öğrenci). Bu, giriş ucunun uçtan uca çalıştığını ve
> hatayı düzgün raporladığını kanıtlar; **gerçek sonuç çekiminin** kanıtı için
> gerçek öğrenci bilgileri gerekir (bkz. §8).

## 7. Test iki gerçek hata buldu (ve düzeltildi)

1. Detay tablosunda `Doğru/Yanlış` sütunu olmadığı için ayrıştırıcı o tabloyu
   **tamamen atlıyordu** → hatalı sorular hiç çıkmıyordu.
2. Sınav bağlantıları çevre metnine göre seçildiği için `Profilim` gibi linkler
   sınav sanılıyor ve uydurma sınav kayıtları oluşuyordu.

## 8. Kalan tek risk / açık iş

Gerçek bir öğrencinin **ad-soyad + okul no**'su ile `mod:"test"` çalıştırılmadı;
yani sonuç tablosunun Okulizyon'daki **gerçek HTML'i** henüz görülmedi.
Yapılması gereken: Profil → Okulizyon bölümüne gerçek bilgileri girip
**"Şimdi dene"** demek. Sonuç:

- `durum:"ok"` → uçtan uca çalışıyor, "Analiz Bekliyor" kuyruğu dolar.
- `durum:"sonuc-yok"` → giriş çalışıyor, tablo biçimi farklı; `ham_ozet` alanındaki
  metne göre sütun eşlemesi güncellenir (10 dakikalık iş).
- `durum:"sifre-gerekli"` → şifre alanı doldurulup tekrar denenir.

Bu üç durumun hangisi olursa olsun **sebep görünür**; sessiz başarısızlık yok.

## 9. GERÇEK VERİYLE UÇTAN UCA DOĞRULAMA (v6 · 28.10.2026)

§8'deki açık iş **kapandı**. Gerçek öğrenci kimliğiyle (10. sınıf, Gaziantep /
Şahinbey, AKKENT ANADOLU LİSESİ) çalıştırıldı:

| Adım | Çağrı | Sonuç |
|---|---|---|
| 1 | `{mod:"canli", kimlik:{…}}` | `giris.kodlar = 27 / 1841 / 751187`, `kartSayisi = 1`, `hatalar = []` |
| 2 | `{mod:"run"}` (cron zinciri) | `durum:"ok"`, 1 sınav, `satir: 20` |
| 3 | `okulizyon_kuyrugu` okuması | `10.SINIF MAARİF İZLEME SINAVI 1 · 2026-10-27`, 20 hatalı/boş soru |

Gerçek çıktı (özet):

```
toplam        100 D · 11 Y · 97,25 net            (120 soru)
dersler       Türkçe 27/2/1 · Tarih-1 7/2/1 · Coğrafya-1 9/1/0 · Felsefe 3/2/0
              Din Kül. 5/0/0 · Matematik-1 24/2/4 · Fizik 10/0/0 · Kimya 7/0/3 · Biyoloji 8/2/0
ornek satır   qno 7  Türkçe  "Metni millî, manevi…"   w
              qno 13 Türkçe  "Tamlamalar - Karma"      e
```

### v6'da düzeltilen hata (v5 → v6)
Okulizyon, `data-testler` içinde ders adlarını **JSON kaçışlı** gömüyor
(`T\u00fcrk\u00e7e`). v5 bu adları ham gösteriyordu; v6'da `coz()` yardımcısı
eklendi ve ders adları `Türkçe`, `Tarih-1`… olarak okunuyor. Fikstür
(`tests/fixtures/okulizyon-sinav-detay.html`) bilinçli olarak kaçışlı hâli korur,
böylece gerileme testte yakalanır.

### Modlar (güncel · v7)
**`ben`** (tarayıcıdaki "Şimdi dene": JWT sahibinin kaydını çeker) ·
**`run`** (cron: tüm `app_states` taraması, DB'ye yazar). Başka mod → `400`.

> **Güvenlik düzeltmesi (v7):** Geliştirme modları (`probe`, `parse`, `test`,
> `canli`) kaldırıldı. Sebep: `anon` anahtarı site kaynağında herkese açık
> olduğu için bu modlar **rastgele bir ad-soyad + okul no ile başka bir
> öğrencinin sınav sonuçlarını** döndürüyordu. Doğrulama tamamlandığı için
> modlar üretimden çıkarıldı; git geçmişinden geri alınabilir.
> `okulizyon-teshis` fonksiyonu, `kaynak_*` SQL yardımcıları ve `gecici_kaynak`
> tablosu da silindi. `okulizyon_kuyrugu` RLS ile korunuyor (herkes yalnız
> kendi satırını okur).

### Tarayıcı yolu da doğrulandı (v7, `ben` modu)
Geçici bir hesap açılıp gerçek JWT ile çağrıldı (hesap test sonunda silindi):

```
POST /functions/v1/okulizyon-cek   {"mod":"ben"}   Authorization: Bearer <kullanıcı JWT'si>
→ 200 · durum:"ok" · 1 sınav · 20 satır · kodlar {27, 1841, 751187} · 883 ms
→ okulizyon_kuyrugu satırı yazıldı (durum:"ok")
```

Yani sitedeki **"Şimdi dene"** düğmesi gerçekten çekim yapıp sonucu veritabanına
yazıyor; öğrenci Profil → Okulizyon ekranında "Analiz Bekliyor" kuyruğunu görür.

### Testler
`npm run test:okz` → **39/39** (kart ayrıştırma + detay + kaçış çözme dahil).
`npm run test:mesaj` → **63/63** (mesaj/Koçluk Hattı motoru + arayüz).

## 10. GERÇEK KULLANICI GERİ BİLDİRİMİ SONRASI DÜZELTMELER (v34.6)

Öğrenci gerçek hesabıyla çekti ve şunları bildirdi: *"eksik geliyor, bazı
derslerin netleri gelmiyor, doğru/yanlış/boş olarak almalı"*.

### Kök neden
Okulizyon ders adları uygulamanın beklediği adlarla **birebir uyuşmuyordu**:

| Okulizyon | Uygulama (10. sınıf) | Eşleşiyor muydu? |
|---|---|---|
| `Türkçe` | `Türk Dili ve Edebiyatı` | ❌ |
| `Tarih-1` | `Tarih` | ❌ |
| `Coğrafya-1` | `Coğrafya` | ❌ |
| `Matematik-1` | `Matematik` | ❌ |
| `Din Kül. ve Ahl. Bil.` | `Din Kültürü` | ❌ |
| Felsefe · Fizik · Kimya · Biyoloji | aynı | ✅ |

Yani **9 dersin yalnız 4'ü** Denemelerim / Konu Takibi / grafikte görünüyordu.
Ayrıştırıcı doğru çalışıyordu; veri doğru çekilip **yanlış anahtarla** saklanıyordu.

### Düzeltme
- `site/okz-normalize.js`: adları gruplar (`matematik`, `tarih`, …) ve
  uygulamanın bildiği ada çevirir; `Matematik-1` + `Matematik-2` gibi aynı
  derse düşenleri **toplar**. Tanınmayan ders olduğu gibi kalır (veri kaybı yok).
- Okulizyon penceresinde her sınav için **Ders | D | Y | B | Net** tablosu +
  TOPLAM satırı gösterilir.
- Daha önce yanlış adlarla aktarılmış kayıtlar açılışta **tek seferlik onarılır**
  (`OKZ.duzelt`), hata kayıtlarının ders adları da düzeltilir.
- Okulizyon cevap anahtarını değiştirirse ("verisi güncellenen sınav") uygulama
  bunu yakalar ve **"Kaydı güncelle"** düğmesi çıkarır.

### Doğrulama (gerçek 28.10 verisi)
```
9 ders · 91 D · 12 Y · 17 B · 120 soru · net 88   (kart: 91/12/88 ✓)
Türkçe→TDE 27/3/0 · Matematik-1→Matematik 13/3/14 · Din→Din Kültürü 5/0/0 …
```
`npm run test:ders` → **45/45**.

> Not: 28.10 sabahı çekilen veri (100 D / 11 Y) ile öğleden sonraki (91 D / 12 Y)
> birbirinden farklı. İki çekim de kendi içinde tutarlı (dersler ↔ kart toplamı
> birebir), yani ayrıştırıcı hatası değil — **Okulizyon tarafındaki sonuç
> değişmiş**. Artık bu değişim yakalanıp kullanıcıya bildiriliyor.

## 11. "Hep yeni soru yok diyor" — kök neden ve düzeltme (v34.7)

Kullanıcı: *"Çekim çalışmıyor. Hep yeni soru yok diyor."*

### Gerçek durum (veritabanından)
```
okulizyon_kuyrugu.pulled_at = 13:14:36 UTC   (kullanıcı tıkladığı an)
durum = "ok" · 33 hatalı/boş soru · ilkodu 27 / ilcekodu 1841 / kurumkodu 751187
```
Yani **sunucu her tıklamada gerçekten okulizyon.com'a gidiyordu**. Sorun istemcideydi:

```
app_states.okulizyon = {
  importedKeys: ["10.SINIF MAARİF İZLEME SINAVI 1|2026-10-27"],  ← "aktarıldı" damgası
  pending: [],
  aktarilan: {},                                                  ← hiç yazılmamış
}
state.exams = []                                                  ← Denemelerim BOŞ
```

Sınav bir kez aktarılmış (ya da aktarım yarıda kalmış), sonra Denemelerim'den
silinmiş. `importedKeys` **tek yönlü bir defter** olduğu için damga hiç
temizlenmedi → uygulama her çekimde "bunu zaten aldım" deyip sonucu attı.

### Düzeltme
1. **Karar artık gerçek duruma bakar**, kayıt defterine değil
   (`OKZ.karar(gelen, state.exams)`): Denemelerim'de o sınav yoksa YENİ sayılır.
   Defter (`importedKeys`) her çekimde gerçekle hizalanır (kendi kendini onarır).
2. **Son çekilen sonuç her zaman görünür**: Okulizyon penceresinde
   "📥 Okulizyon'dan Son Çekilen Sonuç" bölümü — sınav adı, tarih, çekim saati,
   Ders/D/Y/B/Net tablosu, ve "Denemelerim'de kayıtlı mı?" bilgisi.
3. **Değişiklik tespiti hash ile**: kayıtlı denemenin dersleri ile yeni çekilen
   veri karşılaştırılır; farklıysa "Kaydı bu sonuçla güncelle" düğmesi çıkar.
   (Eski sürümde bu, hiç yazılmamış `aktarilan` alanına bağlıydı → hiç çalışmıyordu.)
4. Mesajlar artık ne olduğunu söylüyor: "N sınav okundu · M soru Analiz Bekliyor",
   "N sınavın sonucu DEĞİŞMİŞ", "Her şey güncel: …" .
5. Okulizyon penceresi açıkken sonuç **anında** tazelenir.

### Doğrulama
Kullanıcının birebir bozuk durumu (Denemelerim boş + importedKeys dolu) simüle
edildi: sonuç **1 yeni sınav · 33 bekleyen satır · 9 ders · net 81,25**.
`npm run test:ders` → **61/61** (karar/silinen deneme/değişen veri/tarih
toleransı senaryoları dahil).

## 12. v34.7b — açılışta kendiliğinden tazeleme

Kullanıcı "Şimdi dene"ye basmadan da doğru durumu görsün diye `pwaArayuzKur()` içine
2,5 saniyelik bir tazeleme eklendi:

```js
setTimeout(function () {
  if (typeof state === "undefined" || !sb || !currentUser) return;
  okzDersleriDuzelt();      // eski hatalı ders adlarını onarır
  okzKuyrukCek(false);      // 5 dk'lık otomatik kilit sayesinde sunucuyu yormaz
}, 2500);
```

- Oturum yoksa hiç çalışmaz (gereksiz ağ isteği yok).
- `okzKuyrukCek(false)` → son denemeden 5 dakika geçmediyse çıkar; "Şimdi dene"
  `true` ile çağırır ve her zaman çalışır.
- Sürüm damgaları: `PWA_SURUM = "v34.7b-cekim"`, SW `CACHE = "analiz-merkezi-v-20261028-v34-7b-cekim"`.
  Cache adı değiştiği için eski önbellek (bozuk `okz-normalize.js`) tarayıcıdan silinir.
