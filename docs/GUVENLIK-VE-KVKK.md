# Güvenlik ve KVKK — ne yapıldı, ne kaldı (v105 · 21 Kasım 2026)

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

Veritabanının sahibi olarak **teknik olarak her zaman görebilirsin**. Bunu "kapatmak" mümkün değil.

Yapılabilecek şey **görecek bir şey bırakmamak**:

- ✅ Okulizyon şifresi **hiç istenmiyor/saklanmıyor** (yapıldı)
- ✅ Öğrencinin **adı** artık bağ tablosunda düz yazılmıyor; yalnız **özeti** (geri çevrilemez) tutuluyor (yapıldı)
- ⏳ Okul no / il / ilçe bilgisini kayıttan çıkarmak → **sonraki adım** (Okulizyon çekimi bunlara ihtiyaç duyuyor; ayrı tasarım gerekir)
- ⏳ Ad-soyad yerine takma ad kullanma → sonraki adım

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
| **P0** | `okulizyon-cek` sunucu fonksiyonunu yayına almaya **açık onay** | Aşağıdaki kutuya bak — bu yapılmadan e-posta/sahiplik korumaları sunucuda çalışmıyor |
| **P1** | KVKK paketi: veli bilgilendirme + izin adımı + "verilerimi sil" düğmesi + otomatik silme süresi | Şu an hiç yok; hukuki yükümlülük |
| **P1** | Okulizyon **devir** akışı (kod ile) | Numara el değiştirince çıkmaz sokak |
| **P2** | Sunucu ayarları panelden: şifre politikası (en az 8 karakter + sızmış şifre denetimi + robot koruması) | Benim araçlarım bu üç alanı değiştiremiyor; panelden yapılmalı |
| **P2** | Ad-soyad / okul no / il / ilçe bilgisini kayıttan çıkarma | "Ben görmeyeyim" hedefi |
| **P3** | Erişim günlüğü (kim, ne zaman veriye baktı) | Denetim izi |

---

## 6b. ⚠️ ÖNEMLİ — sunucu tarafı henüz yayında DEĞİL

Ölçüm (canlı): `okulizyon-cek` sunucu fonksiyonu **sürüm 15 · 28 Ekim** tarihli.
Yani şu an canlıda çalışan sunucu kodu **e-posta doğrulaması** ve **sahiplik bağı** denetimlerini
**içermiyor**. Web sitesindeki (tarayıcıdaki) sürüm güncel; sunucu tarafı eski.

Bunun anlamı, sade dilde:

- Okulizyon bağı tablosu **kurulu ve tekillik kuralı çalışıyor** ✅
- Ama "bir okul no = tek hesap" kuralını **uygulayan sunucu kodu yayında değil** ⏳
- Yani şu an bir kişi, başkasının adı + okul nosunu bilirse **onun sonuçlarını çekebilir** ⚠️
- Bu fonksiyonun yayına alınması için **senin açık onayın** gerekiyor (senin adına canlıya kod çıkarmıyorum).

Onay verdiğinde: `okulizyon-cek` v16 olarak yayına alınır, sonra canlıda tekrar ölçülür.

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
- `supabase/functions/okulizyon-cek/index.ts` — e-posta doğrulama + sahiplik denetimi
- `tests/guvenlik-v103.test.js` — **68 kontrol**; düzeltmeler geri gelirse test kırmızı olur
- `tests/v78-kalan-duzeltmeler.test.js` — kaldırılan "Kondisyon Eğilimi" geri gelirse kırmızı olur
- `npm run test:guvenlik` · tamamı: `npm run test:hepsi` (EXIT 0)
