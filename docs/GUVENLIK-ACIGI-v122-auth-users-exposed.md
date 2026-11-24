# 🔴 v122 — KRİTİK GÜVENLİK: `auth_users_exposed` (çözüldü)

> **Durum:** ✅ Kapatıldı — 27 Ekim 2026, canlı veritabanında doğrulandı.
> **Kaynak:** Supabase güvenlik e-postası, proje `analiz-merkezi`
> (`ztgzmhfklsdlngrtennp`), uyarı adı **`auth_users_exposed`**.
> **Supabase uyarısının metni:** *"Kullanıcı verileri bir görünüm aracılığıyla
> ortaya çıkarılıyor. Bir görüntüleme işlemi, kullanıcılarınızın kişisel
> bilgilerini API'nize erişebilen herkese ifşa eder."*

---

## 1) Ne bulundu — Supabase'in gösterdiği

`public.hesap_hareket` adlı bir **görünüm (view)** vardı ve doğrudan
`auth.users` tablosuna bağlıydı:

```sql
create or replace view public.hesap_hareket as
select u.id as user_id,
       u.email,                    -- ← e-posta
       u.created_at as hesap_acildi,
       a.updated_at as son_veri_yazimi,
       ...
from auth.users u
left join public.app_states a on a.user_id = u.id;
```

Sorun **erişim izniydi** (ACL):

```
postgres=arwdDxtm | anon=arwdm | authenticated=arwdm | service_role=...
                     ^^^^^^^^^^^   ^^^^^^^^^^^^^^^^^
```

`anon` = **siteye giren, giriş yapmamış herkes.** Yalnız herkese açık
`anon` anahtarını kullanarak:

```js
fetch("https://ztgzmhfklsdlngrtennp.supabase.co/rest/v1/hesap_hareket", {
  headers: { apikey: ANON_KEY }
})
// → 6 kullanıcının e-postası + hesap açılış + son yazma tarihleri
```

**Neden RLS kurtarmadı:** PostgreSQL'de `security_invoker` varsayılan
olarak `false`'tur. Görünüm, **sahibinin (postgres) haklarıyla** çalışır.
RLS görünümün altındaki `auth.users`'a uygulanmaz → tam açık.

---

## 2) DAHA AĞIR İKİNCİ BULGU — Supabase bunu uyarı olarak göndermedi

Görünümü incelerken aynı migration'dan (`0018_hesap_silme_ve_saklama.sql`)
gelen iki fonksiyon dikkat çekti:

```
hesap_saklama_temizle(kuru boolean)   SECURITY DEFINER
hesap_saklama_uyar(kuru boolean)      SECURITY DEFINER
```

ACL'leri:

```
= X/postgres          ← PUBLIC (herkes)
anon = X              ← giriş yapmamış ziyaretçi
authenticated = X
```

`hesap_saklama_temizle` **`auth.users`'tan kayıt siliyor**:

```sql
delete from auth.users where id = r.user_id;  -- CASCADE
```

Ve `postgres` rolünün bu tabloya **DELETE** yetkisi var (ölçüldü:
`has_table_privilege('postgres','auth.users','DELETE') = true`).
Fonksiyonun sahibi de `postgres`.

> **Yani:** `anon` anahtarını bilen herhangi biri şunu çağırabilirdi:
> ```js
> supabase.rpc("hesap_saklama_temizle", { kuru: false })
> ```
> **ve saklama süresi dolmuş tüm hesapları silerdi.**
> Bugün `suresi_doldu = 0` olduğu için **henüz kimse silinmedi** —
> ama 2028'de ilk hesaplar 24 ayı doldurduğunda bu kapı açık olacaktı.

Uygulama bu fonksiyonları **hiç çağırmıyor** (grep: `rpc(`, `hesap_saklama`
→ yalnız `bildirim_deneme_kuyruk` var). Yani erişim tamamen gereksizdi.

---

## 3) Ne yapıldı — `v122_kritik_guvenlik_hesap_hareket`

```sql
-- 1) Görünümü halka kapat (silmedik: bakım işi kullanıyor)
revoke all on public.hesap_hareket from public, anon, authenticated;
grant select on public.hesap_hareket to service_role;

-- 2) Hesap silme/uyarı fonksiyonlarını yalnız sunucuya bırak
revoke all on function public.hesap_saklama_temizle(boolean)
  from public, anon, authenticated;
grant execute on function public.hesap_saklama_temizle(boolean) to service_role;

revoke all on function public.hesap_saklama_uyar(boolean)
  from public, anon, authenticated;
grant execute on function public.hesap_saklama_uyar(boolean) to service_role;
```

**Görünümü silmedik.** `hesap_saklama_temizle` / `hesap_saklama_uyar`
(bakım işleri) ona bağlı; ileride `pg_cron` ile kurulacak. Erişimi
kapatmak yeterliydi, silmek gereksiz risk olurdu.

---

## 4) Doğrulama — gerçekten kapandı mı (canlı ölçüm)

```
relacl: postgres=arwdDxtm | service_role=arwdDxtm
has_table_privilege('anon',          'public.hesap_hareket','SELECT') → false
has_table_privilege('authenticated', 'public.hesap_hareket','SELECT') → false
has_table_privilege('service_role',  'public.hesap_hareket','SELECT') → true
```

```
hesap_saklama_temizle → anon: false · authenticated: false · service_role: true
hesap_saklama_uyar    → anon: false · authenticated: false · service_role: true
```

### Geniş tarama (aynı delik başka yerde var mı?)

| Tür | Toplam | `anon` erişen |
|---|---|---|
| Görünümler (view) | 1 | **0** |
| `SECURITY DEFINER` fonksiyonlar | 11 | **0** |

`anon` rolüne açık kalan tek şey (meşru):
- `geri_bildirim` → **INSERT** (giriş yapmadan geri bildirim gönderilebilsin)
- `push_teslim` → INSERT + son 10 dk SELECT (service worker teslim izi)

---

## 5) Etki — kim ne gördü?

| Soru | Cevap |
|---|---|
| Kaç kullanıcı etkilendi | **6** (hepsi senin/test hesapları) |
| Ne açığa çıktı | **e-posta adresleri**, hesap açılış tarihi, son veri yazma tarihi |
| Şifre / oturum jetonu | ❌ çıkmadı (`auth.users`'ın hassas kolonları görünümde yok) |
| Şifreli kişisel veri (ad soyad, sınav sonuçları) | ❌ çıkmadı — `app_states` şifreli zarf, RLS'li |
| Gerçekten biri okudu mu | Bilinmiyor. **Log tutulmuyor.** 6 kullanıcı + index yok → pratikte olası değil. |
| Hesap silindi mi | **Hayır** — `suresi_doldu = 0`, `hesap_saklama_aylik` cron'u **hiç kurulmamış** (`cron_var = 0`) |

> **Dürüst not:** "kimse okumadı" diyemem, "okunduğuna dair kanıt yok" diyebilirim.
> Supabase REST erişim logu tutmuyor; 6 kullanıcılı, arama motorlarına kapalı
> (v121 `noindex`) bir sitede bu açığın bulunma olasılığı çok düşüktü.

---

## 6) 72 saat bildirimi gerekir mi?

**Hayır — gerekmiyor.** KVKK m.12/5 "kişisel verilerin **kanun dışı yollarla**
başkaları tarafından elde edilmesi" durumunda bildirim ister. Burada:

- Veriler **kanun dışı yolla elde edilmedi** — teknik bir yapılandırma hatası,
  erişim **kimse tarafından kullanılmadı** (kanıt yok)
- Açığa çıkan veri: **6 e-posta adresi** (senin + test hesapların)
- Kimlik/şifre/finansal veri yok

**Ama yine de belgeleyin.** Bu dosya o belgedir. İleride bir şey sorulursa
"şu tarihte bulduk, şu tarihte kapattık, ölçüm burada" diyebilirsin.

> **Kural:** 6 kullanıcı + e-posta + kullanım kanıtı yok → bildirim eşiğinin
> altında. Kullanıcı sayısı 100'ü geçerse veya log'da erişim görülürse
> **o gün** bildir.

---

## 7) Tekrar olmasın diye

1. **Kural:** `auth.*` şemasına bağlı **hiçbir** görünüm `public`'e açılmaz.
   Gerekirse `security_invoker = true` + RLS ile.
2. **Kural:** `SECURITY DEFINER` fonksiyonlar `PUBLIC`'e **asla** açılmaz —
   varsayılan zaten budur; `grant` yazarken `anon`/`authenticated` eklemeyin.
3. Supabase → **Advisors → Security** sekmesini ayda bir aç; yeni uyarı var mı bak.
4. Migration `0018`'e yorum eklendi; gelecekteki migration'lar bu kurala uymalı.

---

## 8) Hâlâ açık olan (bu migration'ın kapsamı dışı)

| Konu | Durum |
|---|---|
| `hesap_saklama_aylik` cron | **Hiç kurulmamış.** 24 ay saklama sözü *uygulanmıyor* (silme kodu var, tetikleyici yok). Kullanıcıya "24 ay sonra silinir" dendi. |
| Supabase 2FA | Hâlâ açılmadı (3 dakikalık iş, panel şifresi sızarsa asıl risk burada) |

> Bir sonraki iş: cron'u kur **veya** gizlilik metnindeki 24 ay ifadesini
> kaldır. İkisinden biri yapılmalı — şu an söz verilip yerine getirilmiyor.
