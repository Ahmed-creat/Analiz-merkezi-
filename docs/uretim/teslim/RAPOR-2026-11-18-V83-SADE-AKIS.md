# v83 — Okulizyon akışı sadeleşti (sessiz çekim + yeşil nokta)

**Yayın:** `v83-sade-bildirim` · deploy `dpl_8uCjAJgASi3yKDAr1itobrUWKJR4` (READY / PROMOTED)
**Alias:** `analiz-merkezi.vercel.app` · **Kod commit:** `e97237c`
**Test:** `tests/dom/dom-v83-sade-okz.test.js` 43/43 · `test:hepsi` tamamı yeşil

---

## 1) "Okulizyon bilgilerini ilk girdiğimizde çekmiyor, şimdi deneye tıklayınca çekiyor"

**Ne oluyordu:** Bilgiler kaydediliyor, ekranda "Kaydedildi" yazıyor, ama sonuç gelmiyordu.
Ancak sonradan "Şimdi dene"ye basınca çekim oluyordu.

**Sebep (ölçüldü):** Okulizyon'u çeken sunucu fonksiyonu (`okulizyon-cek`) öğrenci
bilgilerini **buluttaki** kayıttan (`app_states`) okuyor. Uygulama buluta **1,5 saniye
gecikmeyle** yazıyor; eski kod ise kaydettikten **500 ms sonra** çekimi başlatıyordu.
Yani sunucu, daha yazılmamış (ya da eski) bilgiyi görüp "bilgi yok" diyordu. Kullanıcı
"Şimdi dene"ye bastığında yazma çoktan bitmiş olduğu için çekim çalışıyordu.

**Düzeltme:**
- Kaydet → **bulut yazımı beklenir** → çekim başlar. (Süren bir yazma varsa önce o biter,
  sonra yeni durum yazılır; eski durumun yazılması imkânsız.)
- Yazma başarısızsa "kaydedildi" denmez; "Bilgiler buluta yazılamadı (bağlantı?)" yazılır.
- İl/ilçe/okul **kodu** yoksa Okulizyon'a girilemez. Bu durumda sessizce çekim denenmez:
  "İl/ilçe/okulu listeden seç" uyarısı verilir, liste kendiliğinden tazelenir.
- Liste yüklenmediği için kod boş geldiyse, **aynı ad** daha önce kodla kaydedilmişse
  **eski kod korunur** (bir kez "kaydet"e basmak çalışan bağlantıyı bozmaz).

## 2) "Denemelerim'e eklendi" uyarısı saçmaydı — "Sil"e basınca açılıyordu

**Ne oluyordu:** Ekranda `Dikkat!` başlıklı, `İptal` / **`Sil`** düğmeli bir pencere
çıkıyor, metni "…Şimdi açayım mı?" diyordu. `Sil`e basınca Denemelerim **açılıyordu**
(çünkü o pencere aslında silme penceresiydi, düğmesi geri çağrıyı çalıştırıyor).

**Düzeltme:** O pencere **tamamen kaldırıldı**. Yerine:
- **Denemelerim** sekmesinde (yan menü + mobil alt menü) **🟢 yeşil nokta** — yeni deneme geldi.
  Denemelerim bir kez açılınca nokta kendiliğinden söner.
- Denemelerim sayfasının üstünde **yeşil bilgi şeridi**:
  "Okulizyon'dan 1 deneme eklendi · 20 soru neden bekliyor. Aşağıdaki **Analiz bekliyor**
  bölümünde her sorunun nedenini seç → konu analizi o anda oluşur." + **Nedenleri seç** düğmesi
  (neden bekleyen en yeni denemeyi açar ve kutuyu ekrana getirir).
- Kısa bir bildirim (toast) ve zil kaydı kalır; hiçbiri kullanıcıyı durdurmaz.

## 3) Mobil üst bar: uygulama simgesi → profil simgesi

Üstte, öğrencinin adının solundaki **uygulama logosu** kaldırıldı. Yerine **profil avatarı**
geldi: öğrencinin adının baş harfleri (ör. **AY**), yuvarlak, mavi; basınca **Profil** açılır.
Logo yan menüde (uygulama başlığında) durmaya devam ediyor.

## 4) Ayarlar → Geri bildirim: kutu artık açık durmuyor

Ayarlar açıldığında boş bir yazı alanı + "Geri Bildirimi Gönder" düğmesi sürekli duruyordu
(form ekranı gibi). Artık tek satır: **"Geri bildirim yaz"**. Basınca kutu açılır, gönderim
başarılıysa kendiliğinden kapanır ve "Geri bildirimin gönderildi — teşekkürler" bildirimi çıkar.
Gönderim yolu değişmedi (aynı yerel kuyruk + bulut).

## 5) "Tablet" → "Cihaz"

Bildirim uyarısı: **"Cihaz bildirimleri gecikiyorsa: …"**. Cihaz adı geçen her yerde
tek tip sözcük kullanılıyor.

---

## Canlı doğrulama

| Ne | Nerede | Sonuç |
|---|---|---|
| Sürüm damgası | `app-pwa.js?v=83` | `const PWA_SURUM = "v83-sade-bildirim";` |
| Önbellek damgası | `sw.js?v=83` | `analiz-merkezi-v-20261027-v83-sade-bildirim` |
| Alt bilgi | `analiz-merkezi.vercel.app` | "Analiz Merkezi v83-sade-bildirim · Geliştirici: Ahmed İbrahim" |
| Deploy | Vercel | `dpl_8uCjAJgASi3yKDAr1itobrUWKJR4` READY / PROMOTED, alias atandı |

## Dokunulmayanlar

Eşikler (P_L0 0.12 / P_G 0.25 / P_S 0.10 · onay L≥0.85 & oran≥0.80), `KISA_ARALIK_GUN=3`,
28 günlük kart kuralı, `state` anahtarı "Ders > Konu", AYT_WEIGHT, `MEMORY_CRITICAL`,
`REVIEW_LADDER`, tek tekrar düğmesi, soru puanlaması, `hata_gecmisi` 40 tavanı — hiçbiri
değişmedi. Soru havuzlarına ve içeriğe dokunulmadı (192 havuz / 2110 soru aynı).
