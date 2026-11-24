-- ============================================================
-- 0017 — OKUL SİTESİ ÇEKİMİ KALDIRILDI (v111)
-- ------------------------------------------------------------
-- KULLANICI (2 Kasım 2026): "Sınav tarihleri için okul çekimi çalışmıyor ya
-- bunu kaldırabiliriz ve bununla ilgili çöp kod kalmasın."
--
-- ÖLÇÜM (canlı): çekici `okul-sitesi.js` sonucu Firestore'a yazıyordu;
-- uygulama ise bu tablodan okuyordu. Tabloya yazan HİÇBİR betik yoktu —
-- tabloda 0 satır vardı. GitHub'da `okul-cekim.yml` iş akışı depoda hiç
-- bulunmuyordu (README yanlış dosyaya atıf yapıyordu).
--
-- Bu yüzden çekim tamamen kaldırıldı:
--   • istemci: okul_duyurulari okuması + duyuru → takvim otomatik ekleme
--   • betik  : okul-sitesi.js, degisiklik-kontrol.js
--   • iş akışı: 30 dk gözcü + okul sitesi adımları
-- Okul sınav tarihi artık Planlama → Takvim → "Sınav ekle" ile elle girilir.
--
-- Tablo BOŞ olduğu için veri kaybı yok. Tekrar çalıştırmak zararsızdır.
-- ============================================================

drop table if exists public.okul_duyurulari;

-- Veri haritasını tablo açıklamasına yaz: tabloya bakan kişi "boş" sanmasın.
comment on table public.app_states is
  'Kullanıcı başına TEK satır bulut yedeği: tüm uygulama verisi state jsonb içinde '
  '(exams=denemeler/sınav sonuçları, settings.okulizyon=öğrenci bilgileri, '
  'topics=konu takibi, plan, bkt_state, flashcards, ...). Kilit (uçtan uca şifreleme) '
  'açıksa state şifreli zarftır. Harita: docs/VERILER-NEREDE.md';
