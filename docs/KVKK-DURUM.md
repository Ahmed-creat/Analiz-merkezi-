# KVKK DURUM RAPORU — 2 Kasım 2026

**SORU:** *"KVKK konusunda ne kaldı?"*

**Kısa cevap:** Veri güvenliği tarafı büyük ölçüde **bitti** (şifreleme,
RLS, veri minimizasyonu). Eksik olan **hukuki/idari taraf**: aydınlatma metni
ve veli izni, hesap silme (hakkı), saklama süresi, sunucu şifre politikası.
Bunların 4'ü **benim yapabileceğim** işler, 2'si **panelden senin** yapman
gereken işler.

---

## 1) BİTMİŞ OLANLAR (ölçüldü — canlı)

| Konu | Durum | Kanıt |
| --- | --- | --- |
| Verinin cihazda şifrelenmesi (uçtan uca) | ✅ | `site/kasa.js` — PBKDF2 + AES-GCM; sunucu zarflı kaydı açamaz |
| Kilit kurulumu zorunlu | ✅ | v108: panel kapatılamaz, atlama yok |
| Şifrelerin saklanmaması | ✅ | Okulizyon şifresi hiç yazılmaz; giriş şifresi yalnız anahtar türetir |
| Okulizyon sınav sonuçlarının sunucuda saklanmaması | ✅ | v107: sonuç yanıtla gelir, `app_states`'e yazılır; `okulizyon_kuyrugu.exams` hep NULL |
| Okul no → hesap sahipliği (tek hesap) | ✅ | `okulizyon_kimlik`: tuzlu SHA-256 özet, **düz ad yok** |
| Satır düzeyi güvenlik (RLS) | ✅ | 12 tablo, **hepsinde RLS açık**, kişisel veri tablolarında `true` politikası yok |
| E-posta doğrulaması zorunlu | ✅ | `mailer_autoconfirm=false`, `mailer_allow_unverified_email_sign_ins=false`, Google OAuth ayrıca doğrulanmış |
| Amaçsız yedek tablolar | ✅ | v103'te silindi (3 öğrencinin tam kopyası) |
| Gereksiz veri toplamama | ✅ | v111: okul sitesi duyuru çekimi + `okul_duyurulari` tablosu kaldırıldı (0 satırdı) |
| Çıkışta cihazdaki kişisel kayıtların silinmesi | ✅ | v51 |
| Veri taşınabilirliği (indirme) | ✅ | `exportData()` — tüm state JSON olarak indirilir |
| Çerez/izleme | ✅ | Yok — izleme çerezi, reklam SDK'sı, analytics yok |

> **Not:** "Uygulama sadece kendi verisini görür" iddiası RLS ile doğrulandı:
> kişisel tablolarda `using (true)` **0 adet**. Yalnız iki ortak/kişisel-olmayan
> tabloda (`kazanim_konu_cache`, `push_teslim`) herkese açık okuma var.

---

## 2) KALANLAR — BEN YAPABİLİRİM (4 iş)

| # | İş | Neden gerekli | Büyüklük |
| --- | --- | --- | --- |
| **K1** | **Hesap silme** ("Hesabımı ve tüm verilerimi kalıcı sil") | KVKK m.7 silme hakkı. Şu an "Tüm verileri sil" **yalnız cihazı** ve bulut state'ini sıfırlıyor; **e-posta + hesap + kimlik bağı kalıyor** | Orta — edge function + onay penceresi |
| **K2** | **Aydınlatma metni + veli izni adımı** (18 yaş altı) | Aydınlatma yükümlülüğü; 18 yaş altı için veli izni | Orta — metin + kurulumda onay kutusu |
| **K3** | **Saklama süresi + otomatik silme** (örn. 12 ay pasif hesap) | "Saklama süresi" ilkesi | Orta — pg_cron + bildirim |
| **K4** | **Veri işleme envanteri** (hangi veri, nerede, ne kadar) | Denetimde ilk istenen belge | Küçük — `docs/` (veri haritası zaten var: `VERILER-NEREDE.md`) |

---

## 3) KALANLAR — PANELDEN SEN YAPMALISIN (2 iş)

Bunları benim araçlarım değiştiremiyor; Supabase panelinden yapılmalı:

| # | Ayar | Şu an | Olması gereken |
| --- | --- | --- | --- |
| **P1** | `Authentication → Policies → Password strength` | **en az 6 karakter** | **en az 8** + "harf ve rakam zorunlu" |
| **P2** | `Password strength → Check against leaked passwords` (HIBP) | **kapalı** | **açık** |

> Not: İstemci zaten 8 karakter + harf + rakam istiyor (`sifreKurali`), ama
> sunucu 6'ya izin verdiği için API'ye doğrudan gidilirse zayıf şifre kabul
> edilir. **Bu yüzden P1 gerçek bir açık.**

Diğer isteğe bağlı sıkılaştırmalar (panelden): oturum hareketsizlik süresi,
bot koruması (captcha).

---

## 4) AYRICA AÇIK (güvenlik, KVKK dışı ama ilgili)

| Konu | Durum |
| --- | --- |
| Okulizyon **devir** akışı (numara el değiştirince) | ❌ Yok — kullanıcı çıkmaz sokağa düşer |
| Erişim günlüğü (kim, ne zaman baktı) | ❌ Yok (`audit_log_disable_postgres = true`) |
| `bildirim_log`, `okulizyon_liste` tabloları | RLS açık ama **0 politika** → istemci okuyamaz/yazamaz (güvenli, ama ölü tablo) |

---

## 5) SIRA ÖNERİSİ

1. **P1 + P2** (panelden, 2 dakika) — en ucuz ve en etkili.
2. **K1 hesap silme** — hukuken en görünür eksik; kullanıcı "verilerimi sil" diyemiyor.
3. **K2 aydınlatma + veli izni** — 18 yaş altı kullanıcı kitlesi için zorunlu.
4. **K3 saklama süresi** — pasif hesapların temizliği.
5. **K4 envanter** — `VERILER-NEREDE.md` temel alınarak tamamlanır.

---

## 6) DÜRÜST UYARI

Bu rapor **teknik ölçüm**dur; hukuki görüş değildir. Aydınlatma metni ve
veli izni metinlerinin son hâli için bir KVKK danışmanına danışman doğru olur.
Ben kodda ve veritabanında ne olduğunu ölçüp yazdım; metinlerin hukuki
uygunluğunu garanti edemem.
