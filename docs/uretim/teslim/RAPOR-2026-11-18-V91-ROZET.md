# v91 — Rozet gerçek uygulama ikonu · büyük görsel alanı boş

**Tarih:** 18 Kasım 2026 · **Sürüm:** `v91-bildirim-gercek-ikon` · **Kod:** `eac9fe4`

---

## 1. Kullanıcının cümleleri

> "Rozet gerçek ikon değil ki. Uygulamanın ikonu bu." *(uygulama logosunun görselini ekledi)*
> "Ayrıca büyük görsel kalkmış yerine **gri daire içinde A harfi** var. Orda bir şey olmasın."

---

## 2. Ne yanlıştı

| Şikâyet | Kök neden |
|---|---|
| "Rozet gerçek ikon değil" | v90'da rozeti kendim çizdim (üç yükselen çubuk). Uygulamanın gerçek logosu **açık kitap + yükselen çubuklar** — rozet o değildi. |
| "Gri daire içinde A harfi" | Büyük görsel için `icon` alanı **hiç verilmedi**. Chrome bu durumda sayfanın favicon'una düşüyor; favicon tanımlı olmadığı için **adres çubuğundaki harf rozeti** (gri daire + sayfa baş harfi) çiziliyordu. |

---

## 3. Düzeltme

### 3.1 Rozet = uygulamanın gerçek logosu

`site/icons/icon-512.png` (uygulamanın kendi logosu) alındı; beyaz zemin ve gölge atıldı, yalnız logo şekli **şeffaf zeminli beyaza** çevrildi, üst barda kırpılmasın diye pay bırakıldı ve kenarları kalınlaştırıldı (24 pikselde bile seçilebilsin).

- Dosya: `site/icons/bildirim-rozet.png` · **96×96 · RGBA (şeffaf) · 1.5 KB**
- Şekil: açık kitap + üç yükselen çubuk (uygulama logosunun aynısı)

### 3.2 Büyük görsel alanı artık boş

`site/icons/bildirim-bos.png` — **tamamen şeffaf 96×96 PNG**. Bildirimde `icon` olarak bu verilir; alan boş kalır, ne gri daire ne harf çıkar.

Ayrıca `index.html`'e **favicon + apple-touch-icon** eklendi (gri daire + harf sorununun kaynağı).

### 3.3 Aynı ikonlar uygulama içi bildirimlerde de

Bildirim geldiğinde uygulama içinde gösterilen sistem bildirimi ve "bildirimler açıldı" testi de renkli 192'lik ikonu badge olarak kullanmayı bıraktı; artık **rozet + boş görsel** kullanıyor. Yani siyah kare sorunu her yolda kapandı.

---

## 4. Ölçüm

Üst bar simülasyonu (24 piksel): rozet beyaz zeminde açık kitap + çubuklar olarak net seçiliyor.

| Kontrol | Sonuç |
|---|---|
| `bildirim-rozet.png` | 96×96 · RGBA · 1.518 bayt |
| `bildirim-bos.png` | 96×96 · RGBA · tamamen şeffaf · 116 bayt |
| `sw.js` ASSETS | iki dosya da listede (çevrimdışı da çalışır) |
| Sürüm | alt bilgi **v91-bildirim-gercek-ikon** · CACHE **v91** |

---

## 5. Test ve yayın

| | |
|---|---|
| Bildirim testi | **48/48 ✓** (rozet gerçek logodan mı, büyük görsel boş mu, 192'lik ikon badge olarak kalmadı mı) |
| `npm run test:hepsi` | **EXIT 0 · 0 hata** |
| Vercel | `dpl_Cp85LKup23R897f5FLU3qH4dYmaa` — **READY / PROMOTED** |
| Commit | `eac9fe4` |

---

## 6. Sıradaki bildirimde ne göreceksin

- **Üst barda:** uygulamanın gerçek logosu (açık kitap + çubuklar), tek renkli rozet olarak
- **Sağda:** büyük görsel alanı **tamamen boş**
- **Başlık:** "Tekrar zamanı" / "Acil konular" / "Yeni deneme sonucun var" (Günaydın yok)

> Uygulamayı bir kez kapat-aç: yeni service worker (v91) yüklensin. Bildirim görünümü tarayıcı önbelleğinden değil, service worker'ın yeni sürümünden geliyor.
