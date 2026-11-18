-- ============================================================
-- 0006 — GÖREV HATIRLATMASI TELAFİSİ (v87)
-- ------------------------------------------------------------
-- KULLANICI (18 Kas): "Bugün hiç bildirim gelmedi."
--
-- ÖLÇÜM: 18 Kas 07:40 koşusu (gorev_cron_tetikle → gorev-hatirlat)
-- `bildirim-gonder`e mod=tekil diyordu; o fonksiyon v59'dan beri
-- yalnız saglik|test kabul ettiği için HTTP 400 dönüyordu
-- (net._http_response id 210: "http": 400, "kalan": 2).
-- Yani SABAH GÖREV HATIRLATMASI hiç gönderilmiyordu.
--
-- DÜZELTME: gorev-hatirlat artık push-tani (web-push) kanalını
-- kullanıyor; cihaz "gösterdim" yazana kadar günde en fazla 3 deneme.
--
-- Bu migration yalnız DENEME SAATLERİNİ ekler:
--   07:40 (vardı) · 09:40 · 11:40 TR
-- Fonksiyon aynı gün aynı başlığı cihaz gösterdiyse tekrar göndermez;
-- TTL 90 dk olduğu için denemeler arasında mesaj birikmez.
-- ============================================================

select cron.unschedule(jobid)
from cron.job
where jobname in ('gorev-telafi-1', 'gorev-telafi-2');

select cron.schedule('gorev-telafi-1', '40 6 * * *', $$select public.gorev_cron_tetikle();$$);
select cron.schedule('gorev-telafi-2', '40 8 * * *', $$select public.gorev_cron_tetikle();$$);

comment on function public.gorev_cron_tetikle() is
  'Sabah görev hatırlatması: gorev-hatirlat edge fonksiyonunu çağırır (07:40 / 09:40 / 11:40 TR). Gönderim push-tani (web-push) üzerinden; cihaz gosterildi=true yazana kadar en fazla 3 deneme.';
