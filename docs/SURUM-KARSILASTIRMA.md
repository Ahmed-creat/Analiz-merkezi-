# Sürüm karşılaştırması — hangi sürümde ne var?

Üç ayrı "güncel" paket dolaşımda olduğu için özellikler tek tek karşılaştırıldı.

| Sürüm | Kaynak | Soru havuzlarından soru soran mini test | Okulizyon bilgileri Profil'de | Bulut |
| --- | --- | --- | --- | --- |
| **v30.1** (PR #3 / `analiz-merkezi-netlify-20261012.zip` = paylaşılan Drive dosyası) | depo `site/` klasörü | ✅ var (BKT mini test, `content/soru_havuzlari/*.json`) | ❌ yan menüde ayrı buton | Firebase (bu depoda Supabase'e taşındı) |
| **v33.1** (canlı Netlify: analizmerkezii.netlify.app) | Netlify'daki yayın | ❌ yok (`soru_havuzlari`, `secenekler`, `dogru_index` hiç geçmiyor) | ✅ var (avatar → Profil penceresi) | Firebase |
| **v34.0** (bu depo, Vercel yayını) | `site/` | ✅ var | ✅ var | Supabase |

## v34.0 — birleşik sürüm

- Taban: PR #3 paketi (soru havuzları + BKT doğrulama motoru + 152 havuz / 1756 soru)
- Eklenen: v33.1'deki **Profil** yaklaşımı — giriş/çıkış ve **Okulizyon bağlantı formu** (ad soyad, okul no, sınıf, il/ilçe, okul) artık Profil penceresinde
- Profil'e erişim: yan menüdeki avatar, kullanıcı adı, **Profil & Okulizyon** sekmesi ve mobil **DAHA** sayfası
- Yan menüdeki eski "Giriş Yap" ve "Okulizyon Bağlantısı" butonları kaldırıldı (DAHA sayfası sade)
- Okulizyon penceresi artık yalnız **Analiz Bekliyor** kuyruğunu işler; bilgi girişi Profile taşındı
- Profilde ayrıca: bulut yedeği durumu, "Şimdi Yedekle", soru havuzu özeti (havuz/soru sayısı), okul duyuruları
- Bulut katmanı: Supabase (Auth + `app_states` vb.), RLS korumalı
- Test: `tests/profil-merge/` (jsdom DOM smoke testi — 18 kontrol) + `npm run test:bkt`, `validate:pools`, `test:curriculum`

## Not

Paylaşılan Drive bağlantısı (`13v1VpRl_AYJLrC6M8JgGt143XMdcaTpG`) **analiz-merkezi-netlify-20261012.zip** dosyasını veriyor
(872.142 bayt, repodaki kopyayla birebir aynı) → yani v30.1. Soru havuzları olan sürüm bu; ancak Okulizyon Profil'de değil.
Okulizyon'u Profil'e taşıyan sürüm (v33.1) ise Netlify'da yayında ve soru havuzlarını içermiyor. İki özelliği birlikte
içeren bir paket daha önce üretilmemişti; v34.0 bu iki özelliği birleştirir.
