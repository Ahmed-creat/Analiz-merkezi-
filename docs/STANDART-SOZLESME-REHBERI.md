# Standart sözleşme — NE / NİYE / NASIL

> ## ⚠️ Bunu ne zaman okuyacaksın?
>
> **Bugün yapılacaklar listesinde DEĞİL.** Canlı ölçüm: **6 kullanıcı**,
> site arama motorlarında yok, para kazanmıyor. Bu ölçekte bu dosya
> **referanstır, görev değil**.
>
> **Aç** — şu üçünden biri olunca:
> kullanıcı ~100'ü geçerse · uygulama herkese duyurulursa · para kazanırsa.
>
> **Sebep:** Kural kişi sayısına bakmaz — m.9 her ölçekte geçerli. Ama
> denetim ölçek ve şikâyetle gelir. 6 kullanıcılı ücretsiz bir uygulamada
> sözleşme kovalamak, 1 gün harcayıp büyük ihtimalle **cevap almamak**
> demek (sağlayıcılar küçük gerçek kişilere bu metni imzalamıyor).
> En doğru harcama: 2FA aç, adresi kaydet, işi büyüyünce yap.

**En önemli gerçek:** Bu, **yurt dışındaki şirkete değil, KVK Kurumu'na**
gönderilir. Supabase ve Vercel sana "DPA imzalarız" der ama **standart
sözleşme Türkçe metindir ve Kurum'a bildirilir.** İkisi ayrı şeydir.

---

## 1. NE?

Kişisel veri yurt dışına gidiyorsa, Kanun **üç kademe** öngörüyor (KVKK m.9).
Sırayla bakılır — biri olursa sonrakine geçilmez:

```
1. YETERLİLİK KARARI  →  Kurul "şu ülke güvenli" derse, serbest
   ❌ Sende yok — Kurul bugüne kadar HİÇBİR ülke için vermedi

2. UYGUN GÜVENCE      →  standart sözleşme / bağlayıcı şirket kuralları
   ✅ SENİN YOLUN BURASI

3. ARIZİ AKTARIM      →  açık rıza vb.
   ❌ Yalnız TEK SEFERLİK aktarım için. Seninki her gün çalışıyor → olmaz
```

**Standart sözleşme** = Kurul'un yayımladığı, **üzerinde değişiklik
yapılamayan**, 4 hazır metinden birini doldurup imzalıyorsun.

### 4 tip var — sen hangisisin?

| Tip | Kim → kime | Senin durumun |
|---|---|---|
| 1 | Veri sorumlusu → veri sorumlusu | ❌ Supabase/Vercel bağımsız amaçla işlemiyor |
| **2** | **Veri sorumlusu → veri işleyen** | ✅ **SEN BUNU SEÇECEKSİN** |
| 3 | Veri işleyen → veri işleyen | ❌ |
| 4 | Veri işleyen → veri sorumlusu | ❌ |

**Neden tip 2?** Sen veri sorumlususun (amacı belirleyen). Supabase ve Vercel
senin talimatınla veri tutuyor → **veri işleyen**. Klasik "şirket → bulut
altyapısı" tablosu.

### Kaç sözleşme? Kaç bildirim?

| Alıcı | Nerede | Sözleşme | Bildirim |
|---|---|---|---|
| Supabase | Frankfurt (AB) | 1 adet | 1 adet |
| Vercel | ABD | 1 adet | 1 adet |
| Google Firebase (FCM) | ABD | 1 adet | 1 adet |

**3 ayrı sözleşme = 3 ayrı bildirim.** Her sağlayıcı ayrı taraftır.

> **Pratik not:** FCM yalnız bildirim jetonu taşıyor ve kullanıcı bildirime
> **izin verdiyse** çalışıyor. Yine de aktarımdır. En azından Supabase +
> Vercel ile başla — asıl kişisel veri onlarda.

---

## 2. NİYE?

### Neden "DPA var, yeter" değil?

Supabase ve Vercel'in **GDPR** için hazırladığı DPA'ları var. Ama:

| GDPR DPA | KVKK standart sözleşme |
|---|---|
| İngilizce, serbest metin | **Türkçe**, Kurul'un metni, **değiştirilemez** |
| Şirketle imzalanır, kimseye bildirilmez | Kurum'a **bildirilir** |
| AB hukukuna göre | 6698 sayılı Kanun'a göre |

Bir KVKK denetiminde **"Supabase şirket merkezi ABD'de, sözleşme nerede?"**
sorusuna İngilizce DPA göstermek **cevap sayılmaz.**

### Süre: 5 iş günü — ne zamandan başlar?

**İmzaların tamamlandığı tarihten.** Metni indirdiğin günden değil.

- Kurum'a **fiziki**, **KEP** veya **Standart Sözleşme Bildirim Modülü**
  (`standartsozlesme.kvkk.gov.tr`) ile bildirilir
- Elektronik imza geçerli; ıslak imza da olur
- **Esaslı değişiklik** veya **sözleşmenin sona ermesi** de bildirilir

### Cezası

KVKK m.18/1-(e) — bildirimin süresinde yapılmaması **doğrudan** idari para
cezası. Yıllık yeniden değerleme ile güncelleniyor; 2026 için yüz binlerle
milyon TL aralığında. **Ama sözleşme geçersiz olmuyor** — yani asıl risk
bildirim eksikliği, veri akışı değil.

---

## 3. NASIL? (adım adım)

### Adım 1 — Metni indir

```
https://www.kvkk.gov.tr  →  "Standart Sözleşmeler"
veya doğrudan:  standartsozlesme.kvkk.gov.tr
```

**"Veri sorumlusundan veri işleyene"** başlıklı olanı indir (Tip 2).
Word olarak iner.

### Adım 2 — Taraf bilgilerini doldur

#### Senin tarafın (1. Taraf — Veri Sorumlusu)

| Alan | Değer |
|---|---|
| Unvan / ad | **Ahmed İbrahim** (gerçek kişi) |
| Adres | Gaziantep, Türkiye |
| E-posta | hnekfamy8@gmail.com |
| Telefon | *(kendi numaran)* |
| Yetkili | Ahmed İbrahim — veri sorumlusu |

#### Karşı taraf (2. Taraf — Veri İşleyen)

| Sağlayıcı | Unvan | Adres |
|---|---|---|
| Supabase | Supabase Inc. | 970 Toa Payoh North, #07-04, Singapore 318992 |
| Vercel | Vercel Inc. | 340 S Lemon Ave #4133, Walnut, CA 91789, ABD |
| Google (FCM) | Google LLC | 1600 Amphitheatre Pkwy, Mountain View, CA 94043, ABD |

> Bu adresleri **imzadan önce sağlayıcının kendi sitesinden teyit et.**
> Şirket adresi değişebilir; yanlış adres bildirimi sakatlar.

### Adım 3 — Aktarım bilgilerini doldur

#### Supabase için

| Alan | Yazılacak |
|---|---|
| Aktarımın konusu | Bulut veritabanı barındırma (Postgres) |
| Veri kategorisi | E-posta adresi, kimlik özeti, şifrelenmiş uygulama kaydı, bildirim kaydı |
| İlgili kişi grupları | Uygulama kullanıcıları (lise öğrencileri) |
| Aktarım amacı | Hesap yönetimi, cihazlar arası eşitleme, yedek |
| Alıcı ülke | Almanya (Frankfurt, eu-central-1) |
| Saklama süresi | 24 ay kullanılmazsa silinir |
| Teknik tedbir | TLS 1.3, AES-GCM, PBKDF2-SHA256 310.000 tur, RLS |
| Alt işleyen | Supabase'in alt işleyen listesi (sözleşmede talep et) |

#### Vercel için

| Alan | Yazılacak |
|---|---|
| Aktarımın konusu | Statik dosya barındırma / CDN |
| Veri kategorisi | IP adresi, istek bilgisi, tarayıcı bilgisi (teknik log) |
| Aktarım amacı | Uygulamanın sunulması |
| Alıcı ülke | ABD |
| Saklama süresi | Sağlayıcının log saklama süresi |

#### Google FCM için

| Alan | Yazılacak |
|---|---|
| Aktarımın konusu | Push bildirim gönderimi |
| Veri kategorisi | Bildirim jetonu (push endpoint) |
| Aktarım amacı | Talep edilen bildirimleri iletmek |
| Alıcı ülke | ABD |
| Not | Yalnız kullanıcı bildirime izin verirse |

### Adım 4 — İmzala

- Gerçek kişi olduğun için **kendi imzan** yeterli (imza sirküleri gerekmez)
- Tüm sayfaları **parafla** — Kurum duyurusu bunu özellikle istiyor
- Tarih at: **imza tarihi = 5 iş gününün başlangıcı**

### Adım 5 — Kurum'a bildir (5 iş günü)

**En kolay yol — çevrimiçi modül:**

```
https://standartsozlesme.kvkk.gov.tr
```

- Hesap aç (e-posta doğrulama + 2FA)
- Yetkili kişi ekle (Ahmed İbrahim)
- Tarafları ekle
- Sözleşmeyi ekle + **tüm sayfaların taranmış hâli**
- Gönder

**Alternatif:** KEP iletisi veya fiziki posta.
KEP yoksa **modül en pratik** — kargo/noter derdi yok.

### Adım 6 — Dosyala

Saklanacaklar (denetimde istenecek):

```
[ ] İmzalı sözleşme (her sayfası paraflı)
[ ] Bildirim ekran görüntüsü / başvuru numarası
[ ] Sağlayıcının onay yazısı (varsa)
[ ] Alt işleyen listesi
[ ] Teknik tedbirler listesi
```

---

## 4. Zor kısım: sağlayıcı imzalar mı?

Bu işin gerçekten zor tarafı burası. Üç senaryo:

| Senaryo | Ne olur | Ne yap |
|---|---|---|
| **A** — Sağlayıcı imzalar | En temiz yol | Metni gönder, imzalı nüsha al, bildir |
| **B** — "Kendi DPA'mızı kullanın" der | Yaygın | Kurum metnini **yine de** imzalatmaya çalış; olmuyorsa DPA'yı ek olarak sun ve durumu yaz |
| **C** — Hiç cevap vermez | En kötü | **Aktarımı durdurmayı düşün** veya yurt içi alternatife geç |

> **Dürüst uyarı:** Küçük bir gerçek kişiyle standart sözleşme imzalamak
> Supabase/Vercel için olağan bir talep değil. Cevap gelmeyebilir.
> Bu durumda iki gerçek seçenek kalır:
> **(1)** durumu dosyala ve riski kabul et, **(2)** yurt içi barındırmaya geç
> (o zaman m.9 hiç doğmaz).

### En pratik kısa yol (istersen)

Bazı sağlayıcılar Türkiye'de yerel veri merkezi sunmuyor. **Ama** Supabase'i
**self-host** edip Türkiye'deki bir VPS'e kurarsan yurt dışı aktarım **hiç
doğmaz** — m.9 tamamen devre dışı kalır. Maliyet: ~5$/ay + kurulum zahmeti.

Bu, "standart sözleşme kovalamak" ile "sunucuyu taşımak" arasında bir tercih.
İlk iş çok daha az emek; ikincisi sorunu kökten bitirir.

---

## 5. Kontrol listesi

```
[ ] KVKK sitesinden Tip 2 metni indirildi
[ ] 1. Taraf (Ahmed İbrahim) dolduruldu
[ ] 2. Taraf (Supabase Inc.) adresi teyit edildi
[ ] Aktarım bilgileri dolduruldu (konu/kategori/amaç/ülke)
[ ] Tüm sayfalar paraflandı + imzalandı  → TARİH: ___/___/______
[ ] 5 iş günü son tarih: ___/___/______
[ ] standartsozlesme.kvkk.gov.tr → bildirim gönderildi
[ ] Başvuru numarası kaydedildi: ______________
[ ] Aynısı Vercel için tekrarlandı
[ ] Aynısı FCM için tekrarlandı
[ ] Dosya arşivlendi
```

---

## 6. "Ben bunu globale sürmeyeceğim" — bu ne değiştirir?

### Değiştirmediği şey

KVKK m.9 **kişi sayısına bakmaz.** Yurt dışı sunucu kullanıyorsan,
1 kullanıcıda da teknik olarak standart sözleşme konusudur.
"Globale sürmüyorum" bir **muafiyet değil**, sadece **denetim olasılığını**
düşüren bir gerçektir.

### Değiştirdiği şey — pratikte çok şey

| Soru | Cevap |
|---|---|
| Kim denetler? | Şikâyet, ihlal veya büyük veri hacmi olan yere gider |
| Ben kimim? | 6 kullanıcılı, reklamsız, para kazanmayan, arama motorunda adı geçmeyen bir uygulama |
| Kimse bana neden sorsun? | **Neredeyse kimse** |
| Yine de yapılması gereken | Aydınlatma + güvenlik + olay olursa bildirim |

### "Globale sürmemek" nasıl korunur (istersen)

- Mağazaya (App Store / Play) **koymamak** — koyarsan küresel dağıtım olur
- Bağlantıyı **yalnız tanıdıklarına** göndermek
- Arama motorlarına **kapalı** tutmak: `<meta name="robots" content="noindex">`
  eklemek (şu an ana sayfada yok — istersen ekleyebilirim, söyle)
- Okul/öğretmen duyurusu yapmamak

> **Dürüst not:** Teknik olarak site herkese açık bir URL'de duruyor.
> "Yayınlamıyorum" ile "kimse bilmiyor" aynı şey değil. Ama bu ölçekte
> ikisi arasındaki fark, pratikte kimsenin kapını çalmamasıdır.

---

## 7. Dayanaklar

- KVKK m.9 (7499 s. Kanun ile değişik — yürürlük 1.6.2024)
- KVKK m.9/4-c — standart sözleşme bir uygun güvencedir
- KVKK m.9/5 — imzadan itibaren **5 iş günü** içinde bildirim
- KVKK m.18/1-(e) — bildirim yükümlülüğüne aykırılık cezası
- **Yönetmelik** (Kişisel Verilerin Yurt Dışına Aktarılmasına İlişkin Usul ve
  Esaslar Hakkında Yönetmelik, 10.7.2024) m.14/5 — bildirim usulü
- Kurul **4.6.2024 / 2024/959** — 4 standart sözleşme tipi kabul edildi
- Kurum duyurusu **5.2.2025** — metin değiştirilemez, sayfalar paraflanır,
  imza yetkisi belgelenir
- `standartsozlesme.kvkk.gov.tr` — bildirim modülü

> Bu dosya hukuki görüş değildir. İmzadan önce bir avukata danışmak
> tavsiye edilir — özellikle 2. Taraf imzalamıyorsa.
