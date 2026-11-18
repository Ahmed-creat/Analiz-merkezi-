-- v62 — UYGULAMA KAPALIYKEN BİLDİRİM: cihaz uykudayken KAYBOLMASIN
-- ------------------------------------------------------------------
-- KULLANICI: "Mesaj için uygulamayı açmam mı gerekiyor? Ben sana en başta
-- uygulama kapalıyken bildirim atacak demedim mi?"
-- DOĞRU: Android'de Web Push, uygulama kapalıyken Chrome'u kendisi uyandırır.
-- SORUN: mesaj cihaz uykudayken FCM kuyruğunda bekler; TTL dolunca DÜŞER.
-- ÖLÇÜM (16 Kas 2026, canlı):
--   07:35  webpush_tetikle -> push-tani -> FCM **201** (kabul edildi)
--   07:35  push_teslim'de "push" satırı YOK  -> cihaza hiç inmedi
--   09:05  TTL 5400 (90 dk) doldu             -> mesaj çöpe
--   13:05  aynı kullanıcı, yeni abonelik       -> push 3 saniyede düştü
-- ÇÖZÜM:
--   1) TTL 9000 -> 21600 (6 saat): tablet öğlene kadar uyanırsa mesaj yaşar.
--   2) Topic: "am-<gün>-<vardiya>" -> vardiya içindeki 4 tekrar denemesi
--      YIĞILMAZ; son mesaj eskisinin yerine geçer (tek bildirim).
--   3) Urgency: high (push-tani v9) -> FCM yüksek öncelik, uyuyan cihaz uyanır.
create or replace function public.webpush_tetikle()
returns jsonb
language plpgsql
security definer
as $function$
declare
  r record;
  a record;
  k record;
  liste text;
  adet int;
  deneme int;
  hat_baslik text;
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

    hat_baslik := case when vardiya = 's'
                then 'Günaydın! Tekrar Zamanı'
                else 'Akşam tekrarı seni bekliyor' end;

    if exists (
      select 1
      from public.push_teslim t
      where t.gosterildi is true
        and t.baslik = hat_baslik
        and t.asama = 'gosterim'
        and (t.created_at at time zone 'Europe/Istanbul')::date = bugun
        and exists (
          select 1 from public.push_abonelikleri p
          where p.user_id = r.user_id and p.aktif is true
            and right(p.endpoint, 4) = t.abonelik
        )
    ) then
      atlanan := atlanan + 1;
      continue;
    end if;

    select count(*) into deneme
    from public.bildirim_log
    where user_id = r.user_id
      and anahtar like bugun::text || ':' || vardiya || ':try:%';
    if deneme >= 4 then atlanan := atlanan + 1; continue; end if;

    insert into public.bildirim_log (user_id, anahtar, gun)
    values (r.user_id, bugun::text || ':' || vardiya || ':try:' || (deneme + 1), bugun)
    on conflict do nothing;
    get diagnostics yeni = row_count;
    if yeni = 0 then atlanan := atlanan + 1; continue; end if;

    govde := adet || ' konunun tekrarı bugün: ' || liste ||
             '. Her biri 10 dakikalık müdahale yeter.';
    yuk := jsonb_build_object(
      'title', hat_baslik, 'body', govde, 'url', './', 'kind', 'reviews'
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
          'ttl', '21600',
          'urgency', 'high',
          'topic', 'am-' || to_char(bugun, 'YYYYMMDD') || '-' || vardiya,
          'sifreli', 'webpush',
          'mesaj', yuk
        )
      );
      gonderilen := gonderilen + 1;
    end loop;
  end loop;

  return jsonb_build_object(
    'gonderilen', gonderilen, 'atlanan', atlanan,
    'vardiya', vardiya, 'gun', bugun, 'ttl', '21600'
  );
end;
$function$;
