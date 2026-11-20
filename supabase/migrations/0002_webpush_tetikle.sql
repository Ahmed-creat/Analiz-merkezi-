-- ============================================================
-- 0002 — WEB PUSH HATIRLATICI (v59)
-- ------------------------------------------------------------
-- NEDEN VAR (16 Kasım 2026, kök neden ölçümü):
--   Canlı `bildirim-gonder` fonksiyonunun içine gömülü şifreleme kodu
--   ESKİ sürümden geliyordu. Ölçüm:
--     • boş gövdeli push (şifresiz)      → cihaz ALDI, gösterdi
--     • web-push kütüphanesiyle şifreli  → cihaz ALDI, gösterdi
--     • `bildirim-gonder` ile şifreli    → FCM 201 dedi, cihaza HİÇ ulaşmadı
--   Yani Google mesajı kabul ediyor, Chrome gövdeyi çözemediği için push
--   OLAYINI komple düşürüyordu. Ne hata ne kayıt; tam olarak "gönderildi
--   ama gelmedi" tablosu.
--
-- ÇÖZÜM: gönderim, kanıtlanmış çalışan yola (push-tani → web-push) bağlandı.
--   `bildirim-gonder` bozuk fonksiyonuna bağımlılık kalktı; cron doğrudan
--   buradaki fonksiyonu çağırıyor.
--
-- SATIR SATIR DAVRANIŞ:
--   • Aktif aboneliği olan her kullanıcı için memory.schedule içinde tarihi
--     gelmiş konular toplanır (en fazla 5 ad).
--   • Günde İKİ vardiya: TR 14:00'ten önce 's' (sabah), sonra 'a' (akşam).
--     Aynı vardiyada ikinci kez gönderilmez (bildirim_log anahtarı).
--   • Mesaj JSON olarak web-push'a verilir; service worker başlığı/gövdeyi
--     bu JSON'dan okur (sw.js → bildirimSecenekleri).
--   • Gönderim net.http_post ile push-tani'ye yapılır; x-bildirim-secret
--     vault'tan okunur (sır istemciye hiç gitmez).
--
-- CRON: 3 (07:35) · 8 (13:05) · 4 (19:30) · 9 (21:35) TR
--       select public.webpush_tetikle();
-- ============================================================

create or replace function public.webpush_tetikle()
returns jsonb
language plpgsql
security definer
as $fn$
declare
  r record;
  a record;
  k record;
  liste text;
  adet int;
  baslik text;
  govde text;
  yuk text;
  bugun date := (now() at time zone 'Europe/Istanbul')::date;
  vardiya text := case
    when extract(hour from (now() at time zone 'Europe/Istanbul')) < 14 then 's'
    else 'a'
  end;
  sirket text := (select decrypted_secret from vault.decrypted_secrets where name = 'bildirim_secret');
  yeni int;
  gonderilen int := 0;
  atlanan int := 0;
begin
  for r in select distinct user_id from public.push_abonelikleri where aktif is true loop
    liste := ''; adet := 0;

    -- Bugünü (veya geçmişi) gelmiş tekrar konuları: memory.<Ders > Konu>.schedule.*
    for k in
      select m.key as konu
      from public.app_states s,
           lateral jsonb_each(coalesce(s.state->'memory','{}'::jsonb)) m
      where s.user_id = r.user_id
        and exists (
          select 1
          from jsonb_each_text(coalesce(m.value->'schedule','{}'::jsonb)) sch
          where sch.value ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
            and left(sch.value, 10)::date <= bugun
        )
      order by m.key
      limit 5
    loop
      adet := adet + 1;
      liste := liste || case when adet > 1 then ', ' else '' end ||
               coalesce(nullif(split_part(k.konu, ' > ', 2), ''), k.konu);
    end loop;

    if adet = 0 then continue; end if;

    -- Aynı vardiyada tekrar gönderme
    insert into public.bildirim_log (user_id, anahtar, gun)
    values (r.user_id, bugun::text || ':' || vardiya || ':reviews', bugun)
    on conflict do nothing;
    get diagnostics yeni = row_count;
    if yeni = 0 then atlanan := atlanan + 1; continue; end if;

    baslik := case when vardiya = 's'
                then 'Günaydın! Tekrar Zamanı'
                else 'Akşam tekrarı seni bekliyor' end;
    govde := adet || ' konunun tekrarı bugün: ' || liste ||
             '. Her biri 10 dakikalık müdahale yeter.';
    yuk := jsonb_build_object(
      'title', baslik, 'body', govde, 'url', './', 'kind', 'reviews'
    )::text;

    for a in
      select id from public.push_abonelikleri
      where aktif is true and user_id = r.user_id
    loop
      perform net.http_post(
        url := 'https://ztgzmhfklsdlngrtennp.supabase.co/functions/v1/push-tani',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'x-bildirim-secret', sirket
        ),
        body := jsonb_build_object(
          'abonelik_id', a.id,
          'ttl', '86400',
          'sifreli', 'webpush',
          'mesaj', yuk
        )
      );
      gonderilen := gonderilen + 1;
    end loop;
  end loop;

  return jsonb_build_object(
    'gonderilen', gonderilen, 'atlanan', atlanan,
    'vardiya', vardiya, 'gun', bugun
  );
end;
$fn$;

comment on function public.webpush_tetikle() is
  'Hatırlatma gönderimi: web-push ile şifreleyen push-tani fonksiyonunu çağırır. Günde 2 vardiya (sabah/akşam), vardiya başına tekrar yok.';
