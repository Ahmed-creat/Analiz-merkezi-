# Analiz Merkezi

Analiz Merkezi, deneme ve soru çözüm kayıtlarını, konu çalışma akışını, mini doğrulama testlerini ve tekrar kartlarını cihaz üzerinde saklayan çevrimdışı öncelikli PWA'dır. Supabase erişilemediğinde çekirdek deneme, konu, doğrulama ve yedekleme akışları çalışmaya devam eder.

## Canlı yayın

- Uygulama: <https://analiz-merkezi.vercel.app>
- Bulut: Supabase projesi `analiz-merkezi` (ref `ztgzmhfklsdlngrtennp`, eu-central-1) — Auth + Postgres (`app_states`, `fcm_tokens`, `okulizyon_kuyrugu`, `okul_duyurulari`, hepsi RLS korumalı)
- Yayın kaynağı: bu depodaki `site/` klasörü; Vercel build'i `deploy/build.sh` ile üretilir
- Ayrıntılar: `docs/SUPABASE-VERCEL.md`

## Soru Havuzlarının Eklenmesi (İçerik Aşaması)

Uygulama motoru (mini testler, ilişki grafı ve tekrar kartları) soru havuzları olmadan da çalışır (bozulmuş mod: onay yalnızca deneme verisiyle doğrulanır). Soru havuzları içerik güncellemesi olarak eklenir; kod değişikliği gerektirmez:

- Konum: `content/soru_havuzlari/{konu_id}.json`
- Canonical yapı: `konu_id` + `sorular[]` + `flashcards[]`/öğe içi `flashcard`; soru alanları `soru_id`, `alt_beceri`, `metin`, dört `secenekler`, `dogru_index`, `cozum`, `zorluk: "deneme"`
- Konu başına en az 10 soru; alt beceri sözlüğü tanımlıysa alt beceri başına en az 2 soru
- Sorular dört seçenekli, deneme zorluğunda ve `cozum` alanı zorunludur; görsel dosyası eklenmez
- `alt_beceri`/`kazanim` alanları resmî müfredat veya kaynakta yoksa üretilmez; sözlük yoksa boş bırakılır
- Her havuz dosyası eklendiğinde `npm run validate:pools` çalıştırılmalı
- Konu ve grafik kimlikleri için `npm run validate:ids` çalıştırılmalı; kimlik çakışmaları owner onayına devredilir
- Çapraz ilişkilendirme grafı `content/iliski_grafi.json` konumundadır; açılışta şema, varlık, yoğunluk, döngü ve ağırlık doğrulamasından geçer
- Konu kayıt defteri: `content/mufredat/konu_kayit_defteri.json`

## Çalıştırma

```bash
npm run validate:pools
npm run validate:ids
npm run test:bkt
npm run test:curriculum
npm run test:pools
```

PWA yayın talimatı: `docs/SUPABASE-VERCEL.md` (Vercel + Supabase). Netlify alternatifi: `docs/NETLIFY-YAYIN.md`.
