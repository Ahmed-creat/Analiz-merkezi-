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

### Modlar (güncel)
`probe` · `parse {html,ad,tarih}` · `test {kimlik}` · `canli {kimlik}` (kuru
çalışma) · **`ben`** (tarayıcıdaki "Şimdi dene": JWT sahibinin kaydını çeker) ·
`run` (cron: tüm `app_states` taraması, DB'ye yazar).

### Testler
`npm run test:okz` → **39/39** (kart ayrıştırma + detay + kaçış çözme dahil).
