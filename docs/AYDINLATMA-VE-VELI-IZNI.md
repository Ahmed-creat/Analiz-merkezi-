# Aydınlatma Metni ve Veli İzni — Uygulama Planı

> **Sürüm:** 1.0 · 2026-10-27
> **Durum:** METİN HAZIR — uygulama kodu henüz eklenmedi (bkz. §4 iş listesi)
> **İlgili:** `docs/KVKK-DURUM.md` (K2 maddesi), `docs/GUVENLIK-VE-KVKK.md`

---

## 1. Neden "veri göremiyoruz" yükümlülüğü kaldırmıyor?

Kullanıcının sorusu: *"artık veri göremiyoruz ya, yine de gerekli mi?"*

Cevap: **Evet, gerekli.** Uçtan uca şifreleme (E2EE) verinin *içeriğini* okunamaz
yapar ama KVKK anlamında "kişisel veri işleme" fiili devam eder. Sunucuda hâlâ
şunlar duruyor ve işleniyor:

| Sunucuda duran veri | Okunabilir mi? | Niteliği |
|---|---|---|
| E-posta adresi | **Evet, açık** | Kimlik verisi — doğrudan kişiyi belirler |
| Okul no / sınıf / il-ilçe-okul | Kimlik özeti (hash) + şifreli | Dolaylı kimlik verisi |
| Oturum jetonları (JWT), IP, cihaz bilgisi | **Evet** | İşlem güvenliği verisi |
| Şifrelenmiş deneme/plan içeriği | Hayır | Yine de "kişisel veri" sayılır — anahtar sende olsa bile |
| Push aboneliği (endpoint), bildirim kayıtları | **Evet** | İletişim verisi |
| Hesap açılış / son hareket zamanı | **Evet** | Kullanım verisi |

KVKK m.10 **aydınlatma yükümlülüğü** ile m.5 **hukuki sebep** ve (18 yaş altı için)
m.6 veli izni, verinin *okunabilirliğine* değil **işlenip işlenmediğine** bağlıdır.
Şifreleme bir *güvenlik tedbiridir* (m.12), yükümlülüğü **azaltır ama kaldırmaz**.
Ayrıca: e-posta açık olduğu için hesap sahibi her durumda kimliklendirilebilir.

**Sonuç:** Aydınlatma + 18 yaş altı için veli izni **zorunlu**. Şifreleme bunu
"gereksiz" yapmaz; sadece riski düşürür.

---

## 2. Aydınlatma metni (uygulama içi, kısa)

> **Verilerin nasıl işleniyor?**
>
> Bu uygulama; ad soyad, sınıf, okul, okul numarası ve e-posta adresini
> **yalnızca sana çalışma planı hazırlamak, ilerlemeni göstermek ve girişini
> sağlamak** için işler. Denemelerin, sonuçların ve notların cihazında
> **şifrelenir**; sunucu bu içeriği okuyamaz.
>
> - **Kimler görür:** Yalnız sen (anahtar sende). Sunucuda e-posta ve okul no
>   özeti tutulur; içerik okunamaz.
> - **Saklama süresi:** Hesabın **24 ay** kullanılmazsa silinir. Silmeden ~30 gün
>   önce bildirim gönderilir.
> - **Hakların (KVKK m.11):** Verilerini indirebilir, düzelttirebilir ve
>   **hesabını tüm verilerle birlikte kalıcı olarak silebilirsin** →
>   Profil › *Hesabımı ve tüm verilerimi kalıcı sil*.
> - **Aktarım:** Verilerin yurt dışındaki sunucularda (Supabase, AB/ABD) saklanır.
> - **İletişim:** [destek e-postası]
>
> Tam metin: `docs/GIZLILIK-POLITIKASI.md` (yayına hazırlanıyor)

---

## 3. Veli izni (18 yaş altı) — nasıl eklenir

Uygulamanın kullanıcı kitlesi lise öğrencisi → **büyük çoğunluğu 18 yaş altı**.
KVKK m.6 ve pratikte KVKK Kurulu kararları, veli/vasi izni gerektirir.

### 3.1 Akış (kurulum paneli, zorunlu adım)

Mevcut kurulum akışı 3 adımlı: `kur-adim1` (kimlik) → `kur-adim2` (giriş şifresi)
→ `kur-adim3` (12 kelime). **Araya yeni bir adım girmeyecek**; adım 1'in altına
tek bir onay kutusu eklenecek:

```
[ ] 18 yaşından küçüksem velimin/vâsîmin bu bilgileri paylaşmama izin verdiğini
    onaylıyorum. Aydınlatma metnini okudum.  [Metni oku]
```

Davranış:
- Kutu işaretlenmeden **"Devam"** düğmesi pasif.
- "Metni oku" → `docs/AYDINLATMA-VE-VELI-IZNI.md` §2'deki metin modal olarak açılır.
- Onay verisi **şifrelenmez** (sunucunun doğrulayabilmesi gerekir), yalnız sürüm +
  tarih tutulur:

```js
state.settings.veliIzin = {
  surum: "2026-10-27",   // metin sürümü — metin değişirse yeniden sorulur
  tarih: new Date().toISOString(),
  yasBeyani: "18alti"    // "18ustu" seçilirse izin kutusu istenmez
};
```

- Profil › **"Gizlilik ve verilerim"** bölümünde: onay tarihi + sürümü görünür,
  metni tekrar açma bağlantısı, **onayı geri çekme** düğmesi (geri çekilirse hesap
  silme akışına yönlendirilir).

### 3.2 Neden "18 üstü isem" seçeneği?

Tüm kullanıcılara veli izni sormak, 18 yaş üstü kullanıcı için gereksiz veri
toplamak olur. İki seçenekli beyan + tek onay kutusu hem doğru hem az veri.
(Beyan doğrulanamaz; bu bilinen ve kabul edilebilir bir sınırdır — yaş
doğrulama için kimlik belgesi istemek **orantısız** olur.)

### 3.3 Velinin kendisi onaylayamıyorsa

Veli hesabı açma zorunluluğu getirmiyoruz (orantısız). Onay kutusu + beyan
yeterli kabul edilir; riski azaltmak için aydınlatma metni velinin okuyabileceği
sade dille yazılır ve **indirilebilir PDF** olarak sunulur.

---

## 4. İş listesi (kod)

| # | İş | Dosya | Durum |
|---|---|---|---|
| 1 | Aydınlatma metni (kısa) modal | `site/app-pwa.js` | ☐ |
| 2 | `kur-adim1` içine onay kutusu + "Devam" kilidi | `site/app-pwa.js` | ☐ |
| 3 | `state.settings.veliIzin` yazımı (sürüm + tarih) | `site/app-pwa.js` | ☐ |
| 4 | Profil › "Gizlilik ve verilerim" (onay tarihi, geri çekme) | `site/app-pwa.js` | ☐ |
| 5 | `docs/GIZLILIK-POLITIKASI.md` tam metin | `docs/` | ☐ |
| 6 | Test: onay kutusu olmadan devam edilemiyor | `tests/` | ☐ |

> Metin sürümü `2026-10-27`. Metin değişirse **sürüm artırılır** ve onay tarihi
> eski sürümde olan kullanıcılara yeniden sorulur.

---

## 5. "Veri sorumlusu 18 yaşından büyük olmak zorunda mı?"

Kullanıcının sorusu: *"Ama sıkıntı şu ki veri sorumlusu 18 yaşından büyük olmak
zorunda mı"*

### 5.1 Kısa cevap

**Hukuken: evet, pratikte sınır.** KVKK "veri sorumlusu 18 yaşından büyük olmalı"
diye açık bir hüküm içermez. Ama iki ayrı katman var ve ikisi de 18 yaş sınırına
çıkar:

| Katman | Ne oluyor? | 18 yaş altı |
|---|---|---|
| **Yükümlülük** (m.10 aydınlatma, m.12 güvenlik, m.13 başvuru yanıtı, m.16 VERBİS, m.9 aktarım) | Doğrudan veri sorumlusuna bağlı, **yaş şartı yok** | Yükümlülük **doğar** |
| **Sorumluluk** (m.18 idari para cezası, tazminat) | Cezanın muhatabı fiil ehliyeti aranan kişi | Küçük hakkında **idari para cezası uygulanamaz** (Kabahatler K. m.11) |
| **Fiil ehliyeti** (TMK m.14) | 18 yaşını doldurmamış kişi küçüktür | Sözleşme, VERBİS, temsil **veli/vâsî** üzerinden |

Yani küçük, yükümlülükleri **yerine getiremez** (sözleşme kuramaz, VERBİS'e
kaydolamaz, Kurul kararına muhatap olamaz) ama veri işlemeye başladığı anda
yükümlülükler **doğar**. Bu boşluk, hukuken "veli/vâsî temsil eder" ile kapatılır.

### 5.2 Arkadaşının durumu: hangi risk gerçek?

Uygulama ölçüldü (bu depo):

- **Reklam yok** (`adsbygoogle/adsense` yok)
- **Ödeme yok** (iyzico/stripe/abonelik ücreti yok)
- **Veri satışı yok** — ticari amaç yok
- Yalnızca eğitim amaçlı, ücretsiz, kişisel kullanım

Bu tablo riski **çok** düşürür:

| Risk | Durum |
|---|---|
| Veli şikâyeti → Kurul → idari para cezası | Ceza küçüğe verilemez; **reklam/ödeme/satış olmadığı için ticari saik yok** → pratikte çok düşük |
| Veli "çocuğumun verisini sil" der → silinmezse | **Gerçek risk bu.** Çözüm hazır: Profil › kalıcı sil (v113) + 30 gün yanıt |
| Yurt dışına aktarım (Supabase AB/ABD, Vercel ABD, Google) | KVKK m.9. Yükümlülük var; standart sözleşme yükü zor |
| VERBİS | 50 çalışan / 100 M TL eşiğinin **altında** → kayıttan muaf |
| TCK 135-140 (hukuka aykırı kaydetme/yayma) | Kasıt yok, veri satışı yok → uzak |
| Tazminat (m.11 zararın giderilmesi) | Zarar doğarsa **küçüğün kendisi** ve velisi sorumlu olabilir → aile riski |

**En büyük risk ceza değil:** veri ihlali olursa küçüğün ve ailesinin tazminat
sorumluluğu + veliyle yaşanan anlaşmazlık. Ceza alınmaz ama aile uğraşır.

### 5.3 Üç çıkış yolu

| # | Yol | Ne yapar | Artı / Eksi |
|---|---|---|---|
| **A** | **Veli/vâsî veri sorumlusu olur** | Aydınlatma metnine velinin adı yazılır; VERBİS/temsil velide | ✅ En temiz hukuki zemin · ➖ Veli rıza göstermeli |
| **B** | **18 yaşını bekle** | Uygulama kapalı kalır (dışarıya açılmaz), kendisi kullanır | ✅ Risk sıfır · ➖ Beklemek gerekir |
| **C** | **Şu anki hâl** | Ücretsiz, reklamsız, kişisel/okul içi; metinde veri sorumlusu alanı boş | ✅ Hemen çalışır · ➖ Alan boş kaldıkça m.10 eksik |

> **Dürüst uyarı:** Hiçbir yol "hukuki danışmanlık" değildir. Bu bir mühendislik
> risk değerlendirmesidir; nihai karar için avukat gerekir.

### 5.4 Karar verilene kadar yapılacak (kod tarafı — bende)

1. `gizlilik.html` §1'deki üç `[...]` alanı **boş bırakılamaz**; doldurulmadan
   yayına çıkılmamalı. Alan doldurulmamışsa sayfa uyarı göstersin.
2. Reklam/ödeme eklenirse risk tablosu **tamamen değişir** → bu belge güncellenmeli.
3. Veli talebi akışı: "çocuğumun verisi silinsin" → mevcut hesap silme yolu
   yeterli, ama **veli olduğunu doğrulama** yok. İleride not edilmeli.

## 6. Hukuki uyarı

Bu dosya bir **teknik uygulama planıdır**, hukuki görüş değildir. Yayına
geçmeden önce aydınlatma metni ve veli izni metninin bir hukukçu tarafından
gözden geçirilmesi önerilir. Metinde yer alan `[destek e-postası]` alanı
doldurulmalıdır.
