# Güvenlik ve KVKK — ne yapıldı, ne kaldı (v107 · 21 Kasım 2026)

Bu belge **teknik bilmeyen** biri için yazıldı. Kısa cümleler, benzetmeler.

---

## 1. Sorduğun soru: "18 yaş altı olduğu için veri saklamamalı mıyız?"

**Hayır. Böyle bir kural yok.**

- KVKK'da çocuklar için ayrı madde ya da "18 yaş altının verisi saklanamaz" hükmü **bulunmuyor**.
- Veriyi, hizmeti çalıştırmak için **gerekeni** saklamak serbest.
- Ama öğrenci 18 yaşından küçük olduğu için:
  - **izni veli (anne/baba) verir**, öğrenci değil,
  - veliye **yazılı bilgilendirme** yapılır (hangi veri, neden, ne kadar süre),
  - reklam / fotoğraf / üçüncü kişiyle paylaşım gibi **hizmet için şart olmayan** şeyler için **veliden açık izin** gerekir.
- Veri **sonsuza kadar** tutulamaz → süresi dolunca silinir.
- Bir sızıntı olursa **72 saat içinde** hem Kurul'a hem velilere haber verilir.

✅ ~~Sana özel: uygulamadaki "Bilişsel Kondisyon Eğilimi"…~~ **v105 — KALDIRILDI.**
Bu blok okuma verisiyle deneme netini birleştirip öğrenciye "kondisyon" yorumu yapıyordu
(KVKK Kurulu 2020'de benzer bir "izin alınmadan test uygulama" kararı vermişti).
Artık böyle bir yorum üretilmiyor; okuma ve deneme verileri ayrı bölümlerde kalıyor.

> Bu belge hukuki danışmanlık değildir. Metinleri hukukçuya/okula göstermeden yayına almamak daha doğru.

---

## 2. Açık olan 4 kapı — HEPSİ KAPATILDI

Eşleştirme tablosu: her satır **kapatıldı** ve canlı veritabanında **ölçülerek** doğrulandı.

| # | Açık (sade dil) | Ne olabilirdi | Durum |
|---|---|---|---|
| 1 | Uygulamanın herkese açık kimlik kartıyla "tabloyu boşalt" komutu çalıştırılabiliyordu | **Tüm öğrencilerin verisi** tek istekte silinirdi | ✅ Kapatıldı (yetki kaldırıldı) |
| 2 | Uygulamanın arka plan işleri (bildirim gönderme) dışarıdan çalıştırılabiliyordu | Biri **tüm sınıfa** sahte bildirim yağdırabilirdi | ✅ Kapatıldı (yalnız sunucu) |
| 3 | Birinin adı + okul no'sunu bilen, onun sonuçlarını **kendi hesabına** çekebiliyordu | Başkasının sınav sonuçları görülebilirdi | ✅ Kapatıldı (sahiplik bağı) — **v105: bağ ancak Okulizyon girişi açıldıktan sonra yazılıyor** |
| 4 | Okulizyon şifresi **düz metin** olarak (hem telefonda hem bulutta) saklanacaktı | Veritabanını gören şifreyi okurdu | ✅ Şifre artık **hiç saklanmıyor** |

Yanında bulunan 2 sorun daha:

- **Cihaz bildirimi ölçümü çalışmıyordu** (sızıntı + işlev hatası aynı tabloda). Düzeltildi.
- **Amaçsız yedek tablo** (3 öğrencinin tam kopyası) silindi — KVKK "saklama süresi" kuralı.

### Doğrulama (canlı, ölçüm)

| Kontrol | Önce | Sonra |
|---|---|---|
| Herkesin çalıştırabildiği "boşalt" yetkisi | 13 tablo | **0** |
| Dışarıdan çalıştırılabilen arka plan işi | 2 | **0** |
| Kimliksiz kişinin gördüğü cihaz kaydı | 147 satır | **0** |
| Giriş yapanın gördüğü cihaz kaydı | 0 satır (bozuk) | **çalışıyor** |
| Amaçsız yedek tablo | 3 kullanıcının kopyası | **silindi** |
| Okulizyon şifresi | düz metin (yazılmaya hazır) | **saklanmıyor** |

---

## 3. "Kullanıcı bilgilerini ben görmemeliyim" — dürüst cevap

**v106 öncesi doğru cevap "teknik olarak her zaman görebilirsin" idi. Artık değil.**
Kasa (uçtan uca şifreleme) açıkken veri cihazda şifrelenir; sunucudaki kayıt **anlamsız
harf yığınıdır** ve anahtar sende değil, kullanıcının kasa şifresinde. Yani sen de açamazsın.
Ayrıntı: **6a**.

Yapılabilecek şey **görecek bir şey bırakmamak**:

- ✅ Okulizyon şifresi **hiç istenmiyor/saklanmıyor** (yapıldı)
- ✅ Öğrencinin **adı** artık bağ tablosunda düz yazılmıyor; yalnız **özeti** (geri çevrilemez) tutuluyor (yapıldı)
- ✅ Okul no / il / ilçe / ad soyad / sınav sonuçları / plan / kitaplar → **kasa açıkken sunucuda şifreli** (v106)
- ✅ Okulizyon **sınav sonuçları** artık kuyruk tablosunda **hiç saklanmıyor** (v107) — kasa kurulu olsun olmasın

> Not: Şu an uygulamada **tek satır KVKK metni / veli izni yok**. Bu, sonraki adımın (KVKK paketi) konusu.

---

## 4. Okulizyon → e-posta bağı (seçtiğin: "bir okul no = tek hesap")

Kuruldu ve canlıda denendi.

**Nasıl çalışıyor:**

1. Öğrenci e-posta ile kayıt olur → **e-postasına gelen bağlantıya tıklamadan** uygulamaya giremez.
2. Okulizyon bilgilerini (ad, okul no, il/ilçe/okul) girer. Sistem Okulizyon'a **giriş yapmayı dener**;
   giriş **açılırsa** o numara bu hesaba bağlanır. Giriş açılmazsa **bağ oluşmaz** — yani yanlış
   numara yazan biri o numarayı "kapamaz".
3. Başka biri **aynı numarayı** girerse: **"Bu okul numarası başka bir hesaba bağlı — kendi numaranı kullan."** → çekim yapılmaz.
4. Bir hesap bağlı olduğu numarayı değiştirmek isterse önce bağı kaldırması gerekir.

> **v105 düzeltmesi:** Bağ eskiden çekimden **önce** yazılıyordu; yanlış ad/okul giren biri numarayı kilitleyebiliyordu.
> Artık sıra: sahiplik kontrolü → **Okulizyon girişi** → başarılıysa bağ yazılır.

**Koruma katmanları:**

| Katman | Ne yapıyor |
|---|---|
| E-posta doğrulaması | Sahte e-postayla hesap açıp başkasının numarasını yazmak işe yaramaz |
| Tekillik kuralı (veritabanı) | Aynı okul + no **iki hesaba** bağlanamaz (canlıda test edildi) |
| Sahiplik kanıtı | Numara, ancak **Okulizyon girişi açıldıktan** sonra bu hesaba bağlanır |
| İstemci yazamaz | Bu tabloya yalnız sunucu yazar; öğrenci kendi satırını görür |
| Ad gizliliği | Düz ad değil, **geri çevrilemez özet** saklanır |

**Devir (henüz yok):** numara gerçekten onunsa ama eski hesaba bağlıysa → şimdilik okuldan/veliden onay gerekiyor. Kod üretip devretme akışı **sonraki adım**.

---

## 5. Diğer sıkılaştırmalar

- **Şifre kuralı:** 6 karakter → **8 karakter + harf + rakam**. Tek yerden uygulanıyor.
- **Hata mesajları:** "E-postanı doğrulamadan giriş yapılamaz", "Bu şifre bir sızıntıda görülmüş" gibi **Türkçe ve ne yapılacağını söyleyen** metinler.
- **Çıkışta temizlik:** bellekteki Okulizyon şifresi, çıkışta silinir.
- **Süre sınırı:** cihaz teşhis kayıtları **30 günden** eskiyse silinir.

---

## 6. Hâlâ yapılması gerekenler (öncelik sırasıyla)

| Öncelik | İş | Neden |
|---|---|---|
| **P1** | KVKK paketi: veli bilgilendirme + izin adımı + "verilerimi sil" düğmesi + otomatik silme süresi | Şu an hiç yok; hukuki yükümlülük |
| **P1** | Okulizyon **devir** akışı (kod ile) | Numara el değiştirince çıkmaz sokak |
| **P2** | Sunucu ayarları panelden: şifre politikası (en az 8 karakter + sızmış şifre denetimi + robot koruması) | Benim araçlarım bu üç alanı değiştiremiyor; panelden yapılmalı |
| ✅ | ~~Kullanıcıyı kasayı açmaya yönlendirme~~ → **v108'de ZORUNLU yapıldı** (§6d) | Kilit kurulmadan uygulama açılmıyor |
| **P3** | Erişim günlüğü (kim, ne zaman veriye baktı) | Denetim izi |

---

## 6a. VERİ KİLİDİ (v106 → v108) — "benim görmemem" gerçekten nasıl sağlanır

> **Adlandırma (v108):** Kullanıcı *"kasa ne demek? Öğrenciye anlaşılır bir terim
> kullan"* dedi. Kod içindeki adlar (`kasa.js`, `kasaKur`) değişmedi; **kullanıcıya
> görünen her metin** artık şöyle: **"giriş şifresi"**, **"verilerini kilitle"**,
> **"12 kelimelik anahtar"**. "Kasa" kelimesi arayüzde geçmiyor — `tests/kurulum-v108`
> ve `tests/v107-*` bunu otomatik denetliyor.

**Soru:** "Ad soyad, sınav sonuçları, hedef, plan takibi, kitaplar bunları neden
şifrelenmiyor?"

**Cevap:** artık şifreleniyor. Bu, "görmemem" hedefinin **tek teknik karşılığıdır**.

### Güncel sistemlerde nasıl yapılıyor?
"Uygulamanın sahibi göremez" iddiasının adı **sıfır bilgi (zero-knowledge)** mimaridir.
Deseni aynıdır: veri **cihazda** şifrelenir, sunucu yalnız **şifreli kutuyu** saklar,
anahtar sunucuya hiç gitmez. (Aynı yöntem: Mega, Tresorit, Proton, Cryptomator,
1Password/Bitwarden'ın sıfır bilgi modu, Apple'ın "Gelişmiş Veri Koruma"sı.)

Sektörde yerleşmiş kurallar ve bizim uyguladığımız:
| Kural | Bizde |
|---|---|
| Anahtar kullanıcı sırrından türetilir (PBKDF2/Argon2) | PBKDF2-SHA256, 310.000 tur |
| Veri AES-256-GCM ile şifrelenir (her yazmada yeni IV) | ✅ |
| Tuz kayda eklenir (cihazlar arası aynı anahtar) | ✅ (`t` alanı) |
| Kurtarma anahtarı (12 kelime) — çünkü şifre kaybı = veri kaybı | ✅ |
| Şifre/anahtar asla sunucuya gitmez | ✅ |
| "Şifremi unuttum" veriyi açmaz; açıkça söylenir | ✅ profilde yazıyor |

### Neden "öğretmen paneli açmamak" değil?
Önceki cümlem kötüydü: "panel açmayız" bir **güvenlik önlemi değil**, sadece bir söz.
Panel açılmasa da veritabanına giren herkes veriyi okuyabiliyordu. Bu yüzden doğru cevap
söz vermek değil, **matematik**: kasa açıkken veriyi sen de okuyamazsın.

### Kapsam — ne şifreleniyor, ne şifrelenmiyor
| Veri | Durum |
|---|---|
| Ad soyad, sınıf | ✅ kasa içinde (sınıf ayrıca `grade` kolonuna **yazılmıyor**) |
| Sınav sonuçları / denemeler | ✅ kasa içinde (`deneme_sayisi` kolonuna **yazılmıyor**) |
| Hedef, plan, konu takibi, hafıza | ✅ |
| Kitaplar / okuma geçmişi | ✅ |
| Okulizyon kimliği (okul no, il/ilçe) | ✅ kasa içinde |
| **Bildirimler** (banner başlık/metin) | ❌ kasaya girmez — gösterilmek için üretilir (**senin isteğin**) |
| **Geri bildirim** | ❌ kasaya girmez — **senin isteğin** |
| E-posta adresi | ❌ giriş için Supabase Auth'ta (kasa dışı); gereken tek kimlik |

### Dürüst bedeller
1. **Şifre unutulursa veri gider** — kurtarma anahtarı yoksa. Bu, sıfır bilginin tanımıdır.
2. **Kasa kapalıysa veri düz durur.** Uygulama bunu profilde **kırmızı** yazıyor:
   "KAPALI — veri sunucuda DÜZ duruyor". Gizlenmiyor.
3. Kasa **kilitliyken** bulut yazımı ve Okulizyon çekimi **durur** (şifreli kaydın üzerine
   düz metin yazıp kilidi boşa çıkarmamak için).
4. Eski (şifresiz) kayıtlar okunabilir; **ilk yazmada** şifreliye döner.

### Ölçüm
`tests/kasa-v106.test.js` — **42 kontrol**, kripto gerçekten koşturulur:
şifrele→çöz, şifreli metinde ad/okul no/kitap adı **geçmiyor**, yanlış şifre reddi,
anahtar yokken veri gösterilmemesi, başka cihazda açılması, kurtarma anahtarı,
yanlış kurtarma reddi, kilitliyken düz yazma engeli.

---

## 6b. ✅ Sunucu tarafı yayında (v20) — sonuçlar artık SAKLANMIYOR (v107)

Ölçüm (canlı, 21 Kasım): `okulizyon-cek` **sürüm 20**. Önceki sürümde
(`v15 · 28 Ekim`) e-posta doğrulaması ve sahiplik bağı **yoktu**; v16'da eklendi.
**v17/v18 (v107) ile bir sızıntı daha kapatıldı:** çekilen sınav sonuçları
`public.okulizyon_kuyrugu` tablosuna **düz metin** yazılıyordu (ölçüm: 5/5 satırda
tam sınav sonucu + sınav adları). Artık:

- Sınav sonuçları bu tabloya **hiç yazılmaz**; yalnız çekim **durumu** (ok /
  sonuç yok / hata / şifre gerekli) saklanır.
- Sonuçlar çekim **yanıtıyla cihaza** döner; kalıcı kayıt Denemelerim + (kasa
  açıksa) uçtan uca **şifreli** `app_states` içindedir.
- İstemcinin bu tabloya **yazma yetkisi alındı** (INSERT/UPDATE/DELETE yok,
  yalnız kendi satırını SELECT). `anon` rolü tamamen kapatıldı.
- Eski düz metin kayıtlar **silindi** (migration `okz_duz_sonuc_temizle_v107b`).
- **Kasa açıkken** sunucu şifreli kaydı okuyamadığı için Okulizyon kimliği
  (ad, okul no, kodlar) **istekte** gelir; yalnız istek süresince kullanılır,
  **saklanmaz**. Kimlik yoksa çekim yapılmaz (yanlış "bilgi yok" yazılmaz).
- Zamanlanmış (cron) çekim, kasa açık hesapları **atlar** (`kasa-sifreli`):
  o hesaplar için çekim, kasa açıkken "Şimdi dene" ile cihazdan yapılır.

### v16'dan beri geçerli olan kapılar
Önceki sürüm **15 · 28 Ekim** tarihliydi ve e-posta doğrulaması ile sahiplik
bağını **içermiyordu**. Artık içeriyor:

- Doğrulanmamış e-posta ile Okulizyon çekimi **403** döner.
- Aynı okul no ikinci hesaba **bağlanmaz** (409 `kimlik-cakisma`), çekim yapılmaz.
- Bağ, ancak Okulizyon girişi **açıldıktan sonra** yazılır (yanlış numara kilitleyemez).
- `run` (cron) modu yalnız `CRON_SECRET` ile; anon anahtarla tüm öğrencileri gezme yolu kapalı.

Not: `app_states` tablosundaki **eski, şifresiz** kayıtlar (kasa kurmamış
kullanıcılar) hâlâ düz metindir; kasa kuruldukça bu yol kendiliğinden kapanır.
Ölçüm (21 Kasım): **5 hesabın 5'i kasa kurmamış** → verileri düz duruyor.
Bu yüzden v107'de kullanıcıya **zorunlu kurulum yönlendirmesi** eklendi (§6d).

---

## 6c. Okulizyon'dan otomatik sonuç çekmek yasal mı?

Ayrımı net yapmak gerekiyor; ikisi ayrı hukuk alanı:

**1) KVKK (kişisel veri) tarafı**
- Öğrenci **kendi** sonucunu kendi kimliğiyle çekiyorsa: amaç hizmeti sağlamak → **hukuka uygun**.
- **Herkesin** sonuçlarını toplayıp işlemek: veli izni + aydınlatma olmadan **hukuka aykırı**.
  KVKK Kurulu'nun **02.04.2020 / 2020/255** kararı okula, veli izni olmadan öğrencilere
  bilişsel test uyguladığı için ihlal cezası verdi.
- Şu anki tasarım: her kullanıcı **yalnız kendi** kaydını çeker → doğru tarafta.

**2) Sözleşme (okulizyon.com) tarafı**
- Okulizyon, **MEB/e-Okul değil**, özel bir platform ("okul, öğrenci ve yayınevini
  ölçme değerlendirme ekseninde buluşturan dijital platform" — okulizyon.com).
- Hizmet şartları sayfası arama motorlarına açık değil (bulunamadı). **Otomatik veri
  çekme (bot/kazıma) yasakları** bu tür platformların standart maddesidir; okumadan
  "serbest" denemez.
- **Sonuç:** kendi sonucunu, kendi bilgileriyle, kendi cihazın için çekmek makul;
  **toplu/zamanlanmış çekimi artırmak** için okulun/yayınevinin **yazılı izni** gerekir.
  Bu bir veri koruma değil **sözleşme** riskidir.

**Pratik öneri:** Okulizyon'dan/okuldan yazılı izin alınana kadar otomatik çekimi
**kullanıcının kendi «Şimdi dene» düğmesine** bağlı tutmak (zaten böyle) en güvenli yol.

---

## 6d. ZORUNLU İLK KURULUM (v108)

**Sorun (v107):** kasa vardı ama kurulum **isteğe bağlıydı** — «Sonra» deyip
3 gün susturulabiliyordu. Ölçüm: **5 hesabın 5'i kasasız**, yani veriler düz metin.

**Kullanıcı isteği (v108):** *"Yeni kayıtta zorunlu değil mi? Uygulamaya ilk
girişte direk kayıt/giriş ekranı açılmalı. Öğrenci e-posta/şifreyle kaydolsun,
sonra direk bilgi paneli gelsin: ad soyad, sınıf, il, ilçe, okul, okul no —
ve o kurtarma anahtarını seçer."*

**Çözüm (canlı, v108):** üç kapı, hepsi **zorunlu**:

1. **İlk açılış:** oturum yoksa giriş/kayıt ekranı **kendiliğinden** açılır.
   Çarpı gizlenir, arka plana tıklama kapatmaz. (Hesabı olmayan kaydolur;
   e-posta onayı açıksa Supabase onay bağlantısı gönderir.)
2. **Kayıttan hemen sonra** tek panel açılır — **çarpısı yok**:
   - **Adım 1 — Bilgiler:** ad soyad, okul no, sınıf, il, ilçe, okul.
     İl/ilçe/okul **Okulizyon listelerinden** yazarak seçilir (liste gelmezse
     ad elle yazılır). Eksik alanla «Devam» geçmez.
   - **Adım 2 — Giriş şifresi:** en az 8 karakter, iki kez. Kilit **burada**
     kurulur (`kasaKurVeAnahtar` → PBKDF2 310.000 + AES-256-GCM). Şifre
     sunucuya gitmez.
   - **Adım 3 — 12 kelimelik anahtar:** ekranda gösterilir, indirilebilir.
     «Kâğıda yazdım» işaretlenmeden «Bitir» **çalışmaz**.
3. **Sonraki açılışlarda** kilit yoksa aynı panel (önceden erteleme yok).

- Kurulum tek yoldan yürür (`kasaKurVeAnahtar`): panel ve profildeki düğme
  **aynı** kodu kullanır — iki farklı davranış olamaz.
- Okulizyon çekimi başlarken de bir kez uyarı verilir (kilit yoksa).
- Kilit **kapalı/kilitli** ise uyarı gizlenmez, kırmızı yazılır (v106).
- Çıkışta cihazdaki `am_kurulum_tam_v1` işareti de silinir (başka hesap
  "kurulum tamam" sanıp paneli atlamasın).

**Kurmazsa ne olur (dürüst):** v108'den sonra bu yol **kapalı** — giriş yapan
kullanıcı paneli tamamlamadan uygulamanın içine geçemez. Çevrimdışıysa (Supabase
SDK yok) uygulama yerel çalışmaya devam eder, giriş ekranı zorlanmaz.

**Kurarsa bedeli:** kasa şifresi **ve** kurtarma anahtarı kaybolursa veri
kurtarılamaz (sunucu açamaz). Bildirim ve geri bildirim metinleri kasaya girmez
(senin isteğin).

---

## 7. Sana bir kez daha hatırlatma

**E-posta doğrulaması artık zorunlu.** Veli/öğrenciler "kayıt oldum ama giremiyorum" derse
sebep budur: e-postadaki onay bağlantısına tıklamaları gerekir. Kayıt ekranı bunu **Türkçe**
yazıyor ("… adresine onay bağlantısı gönderdik — bağlantıya tıklamadan giriş yapılamaz").

---

## 8. Teknik ek (merak eden için)

- `supabase/migrations/0014_guvenlik_sertlestirme.sql` — yetki kaldırma + `push_teslim` + yedek tablo
- `supabase/migrations/0015_okulizyon_kimlik.sql` — sahiplik tablosu + tekillik
- `site/app-pwa.js` — şifre saklamama, şifre kuralı, Türkçe mesajlar
- `supabase/migrations/0016_okz_duz_sonuc_temizle.sql` — **v107**: kuyruk tablosundan düz sonuç silme + yazma yetkisi kaldırma
- `supabase/functions/okulizyon-cek/index.ts` — e-posta doğrulama + sahiplik denetimi; **v107: sonuç yazmaz, yalnız yanıtta döner**
- `site/kasa.js` — **v106 kasa**: AES-256-GCM + PBKDF2(310.000) + 12 kelimelik kurtarma
- `tests/guvenlik-v103.test.js` — **68 kontrol**; düzeltmeler geri gelirse test kırmızı olur
- `tests/kasa-v106.test.js` — **42 kontrol** (kripto gerçekten koşturulur)
- `tests/kurulum-v108.test.js` — **20 kontrol**; zorunlu panel GERÇEKTEN koşturulur
  (eksik bilgiyle geçiş yok, kısa/uyuşmayan şifre reddi, onaysız bitmez)
- `site/app-pwa.js` — **v108**: “kasa” jargonu arayüzden kaldırıldı (giriş şifresi /
  verilerini kilitle / 12 kelimelik anahtar); ilk açılışta zorunlu giriş/kayıt ekranı
- `tests/v107-sonuc-saklanmaz.test.js` — **43 kontrol** (sunucu yazmıyor · istemci yanıttan alıyor · kurulum yönlendirmesi)
- `tests/v78-kalan-duzeltmeler.test.js` — kaldırılan "Kondisyon Eğilimi" geri gelirse kırmızı olur
- `npm run test:guvenlik` · `npm run test:kasa` · `npm run test:v107` · tamamı: `npm run test:hepsi` (EXIT 0)
