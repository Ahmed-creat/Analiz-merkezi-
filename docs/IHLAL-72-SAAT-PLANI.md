# 72 saatlik veri ihlali bildirimi — NE / NİYE / NASIL

**Senin için doldurulmuş plan.** Kriz anında bu dosyayı aç, sırayla uygula.
Yazdır ve bir yere koy — internet kesikse de lazım olur.

---

## 1. NE?

**Veri ihlali** = kişisel verilerin başkasının eline geçmesi veya bozulması.
Senin uygulamanda ihlal sayılan 6 somut olay:

| # | Olay | Neden ihlal |
|---|---|---|
| 1 | Supabase anahtarı/şifresi sızarsa → `app_states` dökümü alınırsa | E-postalar açığa çıkar |
| 2 | Vercel/GitHub hesabına izinsiz giriş → siteye zararlı kod konursa | Kullanıcı girdileri çalınır |
| 3 | RLS politikası yanlış yazılır → bir kullanıcı **başkasının** satırını görürse | Yetkisiz erişim |
| 4 | `geri_bildirim` tablosu herkese açık kalırsa | KVKK m.13 başvuruları sızar |
| 5 | Bir kullanıcının verisi yanlış hesaba yazılırsa (eşitleme hatası) | Yanlış alıcıya aktarım |
| 6 | Telefon/bilgisayar çalınırsa ve oturum açık kalırsa | Cihaz kaybı |

### İhlal SAYILMAYAN şeyler (panikleme)

- Site bir süre kapalı kaldı ama **kimse veriye erişemedi** → ihlal değil
- Şifreli kayıt çalındı ama **anahtar sende** → teknik olarak okunamaz (yine de değerlendir)
- Bir kullanıcı kendi verisini gördü → ihlal değil

---

## 2. NİYE?

**Kanun:** KVKK m.12/5 — veri ihlalini öğrenen veri sorumlusu, **en kısa sürede**
ilgili kişiye ve Kurul'a bildirir.

**Süre:** Kurul'un **24.01.2019 / 2019/10** kararı "en kısa süre"yi
**72 saat** olarak belirledi. Kanunda sayı yazmıyor — Kurul kararı bağlayıcı.

**Cezası:** Bildirmemek KVKK m.18/1 kapsamında idari para cezası.
2026 için milyon TL mertebesinde. Ama asıl mesele ceza değil:
**bildirmeyen, sorumluluğu üstlenmiş sayılmaz** — sonraki her şey aleyhine delil olur.

### Kritik yanlış anlama

> "Önce çözeyim, sonra bildiririm."

**Yanlış.** 72 saat *çözmek* için değil, *haber vermek* için.
Eksik bilgiyle bildir, sonra **"takip bildirimi"** ile tamamla.
Formda bunun için ayrı bir alan var.

---

## 3. NASIL? (5 adım — kriz anında sırayla)

### Adım 0 — Saati yaz (2 dakika)

Bir yere yaz: **ihlali öğrendiğin tarih + saat**. 72 saat buradan başlar.
Son tarih = öğrenme + 72 saat (hafta sonu sayılmaz, saat işler).

### Adım 1 — Sızıntıyı durdur (ilk 1 saat)

| Durum | Yapılacak |
|---|---|
| Supabase anahtarı sızdı | Supabase paneli → Settings → API → anahtarları **rotate et** |
| Vercel/GitHub hesabı ele geçti | Şifre değiştir + **2FA aç** + tüm oturumları kapat |
| RLS hatası | Supabase'de politikayı derhal kapat (`apply` yerine `drop policy`) |
| Cihaz çalındı | Supabase → kullanıcıyı sil (tüm oturumlar düşer) + `hesap-sil` |

### Adım 2 — Ne gitti, kaç kişi? (30 dakika)

Şu 3 soruyu cevapla — formda bunlar isteniyor:

1. **Hangi veri kategorisi?** (e-posta / ad-soyad / okul no / şifreli kayıt / bildirim jetonu)
2. **Kaç kişi?** (Supabase'de `select count(*) from app_states` → tahmini sayı)
3. **Şifreli içerik okunabilir mi?** (kasa anahtarı sende değilse **hayır** — bu büyük avantaj)

> ⚠️ **Forma kişisel veri YAZMA.** Formun başında açıkça yazıyor:
> *"Formu doldururken ihlale konu olan herhangi bir kişisel veriyi bu forma
> dahil etmeyiniz."* Yani "Ahmet Yılmaz'ın verisi gitti" değil,
> "12 kullanıcının e-posta adresi" yaz.

### Adım 3 — Kurul'a bildir (72 saat içinde)

**En hızlı yol — çevrimiçi form:**

```
https://ihlalbildirim.kvkk.gov.tr     → "Bildirim Oluştur"
```

e-Devlet girişi **gerekmiyor**. Yurt içi veri sorumlusu için
**T.C. kimlik numarası zorunlu**.

**Alternatif kanallar:**
- E-posta: `ihlalbildirimi@kvkk.gov.tr` — konu: *"Kişisel veri ihlali bildirimi"*
- Posta: Kişisel Verileri Koruma Kurumu, Nasuh Akar Mah. 1407. Sok. No:4,
  06520 Balgat-Çankaya / Ankara
- Yardım hattı: **ALO 198**

**Form gönderilince e-postana bir GÜVENLİK KODU gelir — onu kaydet.**
Sonraki takip bildirimleri ve sorgulama bu kodla yapılır.

#### Senin formuna yazılacak sabit bilgiler

| Alan | Değer |
|---|---|
| Veri sorumlusunun adı | Ahmed İbrahim (gerçek kişi) |
| Adres | Gaziantep, Türkiye |
| E-posta | hnekfamy8@gmail.com |
| Web sitesi | https://analiz-merkezi.vercel.app |
| Bildirimi hazırlayan | Ahmed İbrahim — veri sorumlusu |

#### İhlal açıklaması için hazır iskelet

```
[GG/AA/YYYY SS:DD] tarihinde [OLAY] tespit edilmiştir.
İhlalin kaynağı: [yanlış yapılandırılmış RLS politikası / yetkisiz erişim /
cihaz kaybı / ...].
Etkilenen veri kategorileri: [e-posta adresi, ad-soyad, okul numarası].
Etkilenen tahmini kişi sayısı: [N].
Uygulama verileri cihazda PBKDF2-SHA256 (310.000 tur) ile şifrelendiğinden
deneme ve sınav içerikleri okunamamaktadır; yalnız [X] alanı etkilenmiştir.
İhlal tespit edilir edilmez [alınan tedbir] uygulanmış ve erişim kapatılmıştır.
Olası sonuç: [spam/phishing riski / kimlik ifşası].
İlgili kişilere [tarih] tarihinde e-posta ile bildirim yapılacaktır.
```

### Adım 4 — Kullanıcılara haber ver (makul süre içinde)

Kurul "makul olan en kısa süre" diyor. 72 saat **Kurul** içindir;
kullanıcıya da geciktirmeden yaz.

Hazır metin:

```
Konu: Analiz Merkezi — güvenlik bildirimi

Merhaba,

[GG/AA/YYYY] tarihinde bir güvenlik olayı tespit ettik.
Etkilenen bilgi: [e-posta adresin].
Etkilenmeyen: deneme ve sınav kayıtların — bunlar cihazında şifreli
olduğu için okunamaz.

Ne yaptık: [tedbir] aynı gün uygulandı, erişim kapatıldı.

Ne yapmanı öneririz: şifreni değiştir ve şüpheli e-postalara tıklama.

Özür dilerim. Soruların için: hnekfamy8@gmail.com

Ahmed İbrahim
```

### Adım 5 — Takip bildirimi (eksikler tamamlanınca)

Aynı form, "**Takip bildirimi**" seçeneği + **güvenlik kodu**.
Konu satırını değiştirme — sistem bildirimi oradan eşleştiriyor.

---

## 4. Panik anında tek sayfa kontrol listesi

```
[ ] Öğrenme saati yazıldı:  ___/___/______  __:__
[ ] Son bildirim: +72 saat =  ___/___/______  __:__
[ ] Sızıntı durduruldu (anahtar rotate / politika kapalı / oturumlar kesildi)
[ ] Etkilenen veri kategorileri listelendi
[ ] Etkilenen kişi sayısı sayıldı
[ ] ihlalbildirim.kvkk.gov.tr → form gönderildi
[ ] GÜVENLİK KODU kaydedildi:  ______________
[ ] Kullanıcılara e-posta gönderildi
[ ] Bu dosyaya tarih + ne yapıldığı not edildi
```

---

## 5. Şimdiden yapılacak 3 hazırlık (30 dakika)

| # | İş | Süre |
|---|---|---|
| 1 | `ihlalbildirim.kvkk.gov.tr` adresini tarayıcıya kaydet | 1 dk |
| 2 | Supabase + GitHub + Vercel'de **2FA açık mı** kontrol et | 10 dk |
| 3 | Bu dosyayı yazdır, masaya koy | 2 dk |

> **2FA en ucuz sigortadır.** 6 olayın 3'ü (1, 2, 4) 2FA ile baştan engellenir.

---

## 6. Dayanaklar

- KVKK m.12/5 — ihlal bildirimi
- Kurul 24.01.2019 / 2019/10 — "en kısa süre" = 72 saat
- KVKK m.18/1 — idari para cezası
- Form: `ihlalbildirim.kvkk.gov.tr` · `ihlalbildirimi@kvkk.gov.tr` · ALO 198
- Form uyarısı: ihlale konu kişisel veri forma yazılmaz

> Bu dosya hukuki görüş değildir. Bildirimden önce bir avukata danışmak
> her zaman daha güvenlidir — ama **danışmak 72 saati durdurmaz.**
