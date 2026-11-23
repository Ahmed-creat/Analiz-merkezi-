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

## 3. Veli izni (18 yaş altı) — MEVCUT DURUM

> **Bu bölüm v114'te yeniden yazıldı.** Önceki hâli zorunlu bir onay kutusu
> öneriyordu; o tasarım **uygulanmadı ve kaldırıldı**.

### 3.1 Bugün kodda ne var (ölçülmüş)

| Öğe | Durum |
|---|---|
| Zorunlu veli izni kutusu | **YOK** |
| 18 altı beyanı (`kur-veli-beyan`) | Var — **opsiyonel**, engellemiyor |
| Beyan işaretlenince | Yalnız bir bilgi notu açılır ("velinle birlikte kullan") |
| "Devam ederek kabul" satırı | Var — aydınlatma metnine bağlantı |
| Kayıt | `state.settings.veliIzin = {surum, tarih, yasBeyani}` |

### 3.2 Zorunlu kutu neden kaldırıldı

Kullanıcının itirazı haklıydı: *"Veli iznini neden kutucuk olarak ekliyoruz?"*

- Kutuyu **reşit olmayan kişinin kendisi** işaretliyor.
- Bu, "veli izni alındı" **kanıtı üretmiyor** — yalnız üretilmiş gibi görünüyordu.
- Sahte bir güvence, hiç güvence olmamasından daha kötüdür (yanlış emniyet).
- Bu yüzden: engel kaldırıldı, yerine **dürüst bir beyan** kondu.

### 3.3 Gerçek veli izni nasıl olur (yapılmadı — ileride)

Doğrulamalı izin, velinin kendi e-posta adresine onay bağlantısı gönderilerek
alınır:

1. Kullanıcı "18 altıyım" der → **veli e-posta adresi** istenir.
2. Sunucu (`veli-onay` edge function) o adrese tek kullanımlık bağlantı yollar.
3. Veli bağlantıya tıklar → `state.settings.veliIzin.dogrulandi = true`.
4. Doğrulanmamışsa: hesap çalışır ama **veri eşitleme kapalı** kalır.

Bu, gerçek bir izin kanıtı üretir. **Maliyeti:** e-posta gönderimi + yeni tablo +
yeni edge function. Kullanıcı C yolunu (ücretsiz/kişisel) seçtiği ve ihtiyaç
doğmadığı için **şimdilik yapılmadı**.

### 3.4 Neden yine de aydınlatma şart?

Zorunlu kutu kalktı ama **aydınlatma (m.10) kalkmadı**: veri işlendiği sürece
ilgili kişinin (ve 18 altıysa velisinin) bilgilendirilmesi gerekir. Bu,
`site/gizlilik.html` ve kurulumdaki "devam ederek kabul" satırıyla karşılanıyor.

---

## 3b. İlk giriş akışı (v117 — tek katman)

**Sorun (kullanıcı bildirdi):** *"Uygulamaya ilk girildiğinde bilgi formu hemen
üstünde de hesap alanı çıkıyor."*

**Kök neden:** Giriş penceresi (`#pwa-auth-modal`, z-index 9999) açıkken oturum
uygulanınca kurulum paneli (`#am-kurulum`, z-index 9999) de DOM'a ekleniyordu.
İki tam ekran katman üst üste biniyordu.

**Çözüm — tek kapı:**

1. `girisPaneliAcikMi()` eklendi; `kurulumAkisi()` bu pencere açıkken **panel
   açmaz**.
2. `closeAuthModal()` kapanınca `kurulumAkisi()` çağırır → sıra bilgi formuna
   geçer (devir).
3. Bulut beklemesi bittikten **sonra da** yeniden kontrol edilir: bekleme
   sırasında giriş açıldıysa panel yine açılmaz.

Sonuç: aynı anda **yalnız bir** tam ekran katman. Sıra:

```
Hesap penceresi (giriş/kayıt)
        ↓  giriş başarılı / pencere kapandı
Bilgilerini tamamla (ad soyad, sınıf, il/ilçe/okul, okul no)
        ↓
Giriş şifresi (veri kilidi)
        ↓
12 kelimelik anahtar
```

### Hesap penceresi neden yeniden yazıldı

Eski hâlde dört ayrı düğme alt alta duruyordu: *Giriş Yap*, *Yeni Kayıt
Oluştur*, *Şifremi unuttum*, *Google ile devam et*. Öğrenci hangisinin ne
yaptığını ayırt edemiyordu.

Yeni hâl: **iki sekme + tek ana düğme.**

| Sekme | Başlık | Ana düğme | Şifre alanı |
|---|---|---|---|
| Giriş | "Giriş yap" | "Giriş yap" | `current-password` |
| Yeni hesap | "Hesap oluştur" | "Hesabı oluştur" | `new-password` |

Sekme değişince başlık, alt yazı, düğme etiketi ve düğmenin **yaptığı iş**
(`data-act`) birlikte değişir. "Şifremi unuttum" sağa, küçük bağlantı olarak
taşındı; Google düğmesi "VEYA" ayırıcısının altında kaldı.

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

## 6. Okulizyon veli izni istemiyor — biz neden istiyoruz?

Kullanıcının sorusu: *"İyide okulizyonda veli izni falan istemiyor neden bizim
uygulamaya gerek var o zaman?"*

> ### ⚠️ ÖNCEKİ BÖLÜMDEKİ HATA DÜZELTİLDİ
> Bu bölümün ilk hâli Okulizyon'u **MEB'e bağlı bir kamu sistemi** sanıyor ve
> "MEB kamu kurumu, kanuni dayanağı var" diyordu. **Bu yanlıştı.**
> Okulizyon, **OrbimSoft**'un (SETMER Eğitim Bilişim Ltd. Şti., Ankara) özel
> yazılım ürünüdür — `okulizyon.com` künyesi: *"© 2022-2026 Okulizyon bir
> OrbimSoft ürünüdür."* MEB ile bağı yalnız **müşteri** ilişkisidir: okullar
> sistemi satın alıp kullanır. Aşağıdaki karşılaştırma buna göre yazıldı.

### 6.1 Biz de istemiyoruz (v114)

| Ne | Durum |
|---|---|
| Zorunlu veli izni kutusu | **YOK** (v114'te kaldırıldı) |
| 18 altı beyanı (`kur-veli-beyan`) | Var — **opsiyonel**, akışı engellemiyor |
| Kurulumu bloke eden onay | **YOK** |

Yani soru, v114 öncesi tasarımın hatırlanmasından doğuyor.

### 6.2 Asıl mesele: ikisi de aynı kanunu uyguluyor

Okulizyon da bu uygulama da **gerçek kişi/tüzel kişi** veri sorumlusudur.
İkisi de KVKK'ya tabidir. Bu yüzden "onlar istemiyor, biz de istemeyelim"
mantığı **hukuken doğru** — fark dayanakta değil, **işin niteliğinde**:

| | Okulizyon (OrbimSoft) | Bu uygulama |
|---|---|---|
| **Veri sorumlusu** | OrbimSoft — **özel şirket** | Ahmed İbrahim — gerçek kişi |
| **Hukuki sebep** | m.5/2-c **sözleşme** (okul/yayınevi aboneliği) | m.5/2-c sözleşme + m.5/2-f meşru menfaat |
| **İşin niteliği** | **B2B** — okula/yayınevine hizmet | **B2C** — doğrudan öğrenciye |
| **Açık rıza** | Gerekmez (sözleşmenin ifası) | Gerekmez (aynı sebep) |
| **Aydınlatma (m.10)** | **Zorunlu** | **Zorunlu** |
| **Zorunlu veli onay kutusu** | **Yok** | **Yok** |

**Sonuç:** İkisi de veli izni *kutusu* istemiyor. İkisi de aydınlatma metni
yayınlamak zorunda. Okulizyon bunu `orbimsoft.com/gizliliksozlesmeleri` altında
yapıyor; bu uygulama `site/gizlilik.html` ile yapıyor.

### 6.3 Okulizyon'un gizlilik metninde ne var? (ölçülmüş)

OrbimSoft gizlilik politikası (son güncelleme 14.03.2017) şunları istiyor:
ad, soyad, il, ilçe, okul adı, **cinsiyet**, **doğum tarihi**, **cep telefonu**,
e-posta, sınav şifresi. Ve açıkça yazıyor: *"İstenmiş olan bu bilgiler
uygulamanın hazırlanmış olduğu yayınevinin sınav sistemine aktarılır."*

**Yani Okulizyon veli izni istemiyor ama bu uygulamadan çok daha fazla kişisel
veri istiyor.** Kullanıcının sezgisi ("demek ki gerekmiyor") doğru sonuca
götürüyor; yanlış olan tek şey "onlarda hiçbir yükümlülük yok" varsayımı.

### 6.4 Peki bizde pratikte ne gerekiyor? (C yolu)

| Yükümlülük | Gerekli mi? | Nasıl karşılandı |
|---|---|---|
| Aydınlatma metni (m.10) | **Evet** | `site/gizlilik.html` + "devam ederek kabul" |
| Veli bilgilendirmesi (18 altı) | **Evet** | Metin §9 + opsiyonel beyan |
| Zorunlu onay kutusu | **Hayır** | v114'te kaldırıldı — kanıt değeri yoktu |
| VERBİS kaydı | **Hayır** | 50 çalışan / 100 M TL eşiğinin altında |
| Açık rıza | **Hayır** | m.5/2-c ve m.5/2-f yeterli |

### 6.5 Ayrı ve daha büyük risk: otomasyon yasağı

Bu, veli izni tartışmasından **bağımsız** bir konudur ve söylenmesi gerekir:

`supabase/functions/okulizyon-cek` fonksiyonu, kullanıcının Okulizyon
kullanıcı adı/şifresiyle `okulizyon.com/ajax/ogrencigiris.php` adresine
**otomatik istek** atıyor. MEB'in 2026 tarihli yazısı okullara *"yetkisiz
yazılım, otomasyon sistemi, veri çekme araçları ve botlar"* kullanımını
yasaklıyor; yetkisiz erişimde idari ve hukuki süreç başlatılacağı belirtiliyor.

| Risk | Açıklama |
|---|---|
| Hesabın kapatılması | Okulizyon tespit ederse kullanıcının okul hesabını kapatabilir |
| Hizmet şartları | Okulizyon kullanım koşullarında otomatik erişim yasağı olabilir |
| Sorumluluk | Şifreyi **kullanıcı** veriyor; sorumluluk önce ona, sonra geliştiriciye |

**Azaltma:** Çekim yalnız kullanıcı **açıkça isterse** ve kendi şifresiyle
yapılıyor; şifre sunucuda saklanmıyor (v103'ten beri `state`e yazılmıyor).
Yine de bu, "izin var" demek değildir — kullanıcıya **açıkça söylenmeli**.

## 7. Hukuki uyarı

Bu dosya bir **teknik uygulama planıdır**, hukuki görüş değildir. Yayına
geçmeden önce aydınlatma metni ve veli izni metninin bir hukukçu tarafından
gözden geçirilmesi önerilir. Metinde yer alan `[destek e-postası]` alanı
doldurulmalıdır.
