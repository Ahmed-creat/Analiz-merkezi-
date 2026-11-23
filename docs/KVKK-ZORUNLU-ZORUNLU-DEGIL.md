# KVKK — Ne zorunlu, ne değil? (bu uygulama için)

**Sürüm:** 2026-10-27 · **Durum:** ölçülmüş — her satır ya kodda ya canlıda doğrulandı.

> Bu dosya **hukuki görüş değildir**. Teknik bir kontrol listesidir.
> Emin olmadığın bir maddede avukata sor.

---

## 0. Tek cümlelik özet

**Zorunlu olan 5 şey var: aydınlatma, veri güvenliği, ihlal bildirimi,
başvuruya 30 günde yanıt, yurt dışı aktarım için standart sözleşme.**
Bunlardan **dördü yapıldı**, **biri (standart sözleşme) eksik**.
Geri kalan her şey — VERBİS, açık rıza, açık rıza kutusu, veli izni kutusu —
**bu uygulama için zorunlu değil.**

---

## 1. ZORUNLU (5 madde)

| # | Yükümlülük | Dayanak | Durum |
|---|---|---|---|
| 1 | **Aydınlatma metni** yayınlamak | m.10 | ✅ `site/gizlilik.html` |
| 2 | **Veri güvenliği** tedbirleri almak | m.12/1 | ✅ RLS, AES, PBKDF2 310k, TLS |
| 3 | **İhlal bildirimi** — Kurul'a 72 saat | m.12/5 + Kurul 2019/10 | ⚠️ Kanal var, **prosedür yazılı değil** |
| 4 | **Başvuruya 30 gün içinde yanıt** | m.13/2 | ✅ `hnekfamy8@gmail.com` + uygulama içi form |
| 5 | **Yurt dışı aktarım** için standart sözleşme + 5 iş günü bildirim | m.9/4-c, 9/5 | ❌ **EKSİK** |

### 5 numaralı madde neden eksik?

Supabase (Frankfurt) ve Vercel (ABD) yurt dışında. 7499 sayılı Kanun'la
1 Haziran 2024'te değişen m.9 şöyle diyor:

- **Yeterlilik kararı** yok (Kurul bugüne kadar hiçbir ülke için vermedi)
- **Açık rıza** artık yalnız *arızi* (tek seferlik) aktarımlar için geçerli
- Düzenli aktarım → **standart sözleşme** + Kurul'a **5 iş günü** içinde bildirim

Bu bir güvenlik açığı değil, **eksik belgedir**. Yapılacak: Kurul'un ilan
ettiği 4 standart sözleşmeden biri (yurt dışına aktarım — veri sorumlusundan
veri işleyene) Supabase ve Vercel ile imzalanır, 5 iş günü içinde Kurum'a
bildirilir.

---

## 2. ZORUNLU DEĞİL (7 madde)

### 2.1 VERBİS kaydı — **hayır**

| İstisna | Eşik | Bu uygulama |
|---|---|---|
| Ana faaliyeti özel nitelikli veri işleme **olmayanlar** | < 50 çalışan **ve** < 100 M TL bilanço | 1 kişi, bilanço yok → **muaf** (2018/87, 2023/1154) |
| Ana faaliyeti özel nitelikli veri işleme **olanlar** | < 10 çalışan **ve** < 10 M TL bilanço | Uygulanmaz — özel nitelikli veri işlenmiyor |

**Özel nitelikli veri işlenmiyor.** Metinde de yazıyor: sağlık, din, siyasi
görüş, biyometri toplanmaz. Bu yüzden 10/10 kuralı devreye girmiyor.

> **Not:** İşletme hesabı esasına göre defter tutanlarda yalnız çalışan
> sayısına bakılır (Kurul 2025/2393) — yani sende bilanço şartı hiç aranmaz.

### 2.2 Açık rıza (genel) — **hayır**

Veri işleme m.5/2-c (sözleşmenin ifası) ve m.5/2-f (meşru menfaat) ile
yapılıyor. Bunlar açık rıza **gerektirmez**.

**İstisna:** bildirim göndermek m.5/1 kapsamında. Ama bildirim için zaten
işletim sistemi izni alınıyor — ayrı bir "açık rıza" kutusu gerekmiyor.

### 2.3 Zorunlu onay kutusu — **hayır**

v114'te kaldırıldı. Sebep: kutuyu reşit olmayan kişi kendi işaretliyor,
yani "izin alındı" **kanıtı üretmiyordu**. Sahte güvence, güvenceden kötüdür.

### 2.4 Zorunlu veli izni kutusu — **hayır**

Aynı sebep. Yerine **opsiyonel** bir beyan var (`kur-veli-beyan`); işaretlenirse
yalnız bilgi notu açılır, akışı **engellemez**.

Gerçek (doğrulamalı) veli izni ayrı bir iştir: veliye e-posta bağlantısı.
Yapılmadı — bkz. `docs/AYDINLATMA-VE-VELI-IZNI.md` §3.3.

### 2.5 Veri işleme sözleşmesi (DPA) — **hayır**

Veri sorumlusu **sen** olduğun için ayrı DPA tarafı yok. Supabase/Vercel
senin **veri işleyenin**; onlarla standart sözleşme imzalanır (madde 1.5),
ayrıca DPA gerekmez.

> Kendi adına çalışan biri veri girerse iş değişir — o zaman DPA gerekir.

### 2.6 Veri envanteri / işleme kayıt defteri — **hayır**

m.16'daki "veri işleme faaliyetlerinin kaydı" yükümlülüğü VERBİS'e kayıtlı
olanlar için düzenlenmiştir. Muaf olduğun için zorunlu değil.

> Yine de faydalı: `site/gizlilik.html` §2 zaten bir envanter gibi çalışıyor.

### 2.7 Yerli sunucu / veri yerelleştirme — **hayır**

KVKK yerelleştirme zorunluluğu getirmiyor. Yurt dışı sunucu **yasak değil** —
yalnız m.9'daki **mekanizma** (standart sözleşme) gerekiyor.

---

## 3. Sınırda olan 2 madde

### 3.1 İhlal bildirimi — zorunlu ama prosedür yok

m.12/5: veri ihlalini öğrenince **en kısa sürede** ilgili kişiye ve Kurul'a
bildirim. Kurul'un 2019/10 kararı "en kısa süre"yi **72 saat** olarak
belirledi.

**Şu an:** ihlali bildirecek bir kanal var (e-posta + uygulama içi form) ama
**yazılı bir müdahale planı yok**. Bu bir eksikliktir.

**Yapılacak (küçük iş):** 1 sayfalık plan — kim, kime, hangi form, hangi
sırayla. 72 saat, "sorunu çözme" değil "haber verme" süresidir; eksik
bilgiyle de bildirilir, sonra tamamlanır.

### 3.2 Çerez / izleme — zorunlu değil ama **temiz**

Reklam ve analitik çerezi yok. Vercel'in kendi altyapı ölçümü var; kişisel
veri işlemediği için ayrı çerez onayı gerekmiyor. **Bunu böyle tutmak
en kolayı** — analitik eklersen tablo değişir.

---

## 4. "Okulizyon yapmıyor, ben niye yapayım?" — cevap

Okulizyon bir **OrbimSoft** ürünüdür (özel şirket, Ankara). Yani **aynı
kanuna** tabi. Fark dayanakta değil, işin niteliğinde:

| | Okulizyon | Bu uygulama |
|---|---|---|
| Statü | Özel şirket (B2B — okula satar) | Gerçek kişi (B2C) |
| Aydınlatma | Zorunlu ✓ | Zorunlu ✓ |
| Standart sözleşme | Zorunlu ✓ | Zorunlu ✓ |
| VERBİS | Muhtemelen muaf (50/100) | Muaf |
| **İstediği veri** | Ad, cinsiyet, **doğum tarihi**, **telefon**, şifre | Ad, e-posta, okul no |
| Zorunlu veli kutusu | Yok | Yok |

**Sonuç:** Okulizyon senden daha az değil, **daha çok** veri istiyor.
Veli izni konusunda ikisi de aynı noktada — kutu yok.

---

## 5. Yapılacaklar (öncelik sırasıyla)

| # | İş | Süre | Zorunlu mu? |
|---|---|---|---|
| 1 | Standart sözleşme (Supabase + Vercel) + 5 iş günü bildirim | ~1 gün | **EVET** |
| 2 | 72 saatlik ihlal müdahale planı (1 sayfa) | 30 dk | **EVET** |
| 3 | Gizlilik metninde §6'yı güncel tut | 5 dk | EVET |
| 4 | Gerçek veli izni (veliye e-posta doğrulaması) | ~1 hafta | Hayır |
| 5 | VERBİS | — | **Hayır — yapma** |

---

## 6. Bu belgenin dayanakları

- KVKK m.9 (7499 s. Kanun ile değişik, 1 Haziran 2024) — yurt dışı aktarım
- KVKK m.10 — aydınlatma
- KVKK m.12/1, 12/5 — güvenlik ve ihlal bildirimi
- KVKK m.13/2 — 30 günlük yanıt süresi
- KVKK m.16 — VERBİS
- Kurul 2018/87, 2023/1154 — VERBİS istisnası (50/100)
- Kurul 2025/1572 — özel nitelikli veri istisnası (10/10)
- Kurul 2025/2393 — işletme hesabı defteri
- Kurul 2019/10 — ihlal bildiriminde 72 saat
- TMK m.14, m.16 — küçük ve temsil
