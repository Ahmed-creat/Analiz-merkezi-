-- ============================================================
-- 0003 — HATIRLATICI TELAFİSİ (v60)
-- ------------------------------------------------------------
-- ÖLÇÜM (16 Kasım 2026, canlı kanıt):
--   07:35 cron çalıştı, push-tani'ye gitti, FCM 201 döndü
--   (net._http_response id 198: "web-push 483 bayt", endpointSon4 "_ulI").
--   Ama cihazda `push` OLAYI hiç oluşmadı: push_teslim'de 01:42–11:06
--   arasında tek satır yok. Tablet kapalıyken gönderilen mesaj kayboldu.
--   Aynı abonelik 11:06'da açılınca push'lar anında geldi (gösterildi:true).
--
--   Yani sorun "gönderim" değil "TEK DENEME": cihaz o dakikada kapalıysa
--   hatırlatma sessizce kayboluyordu. Kullanıcı: "bildirim gelmedi."
--
-- ÇÖZÜM — CİHAZ BEYANINA KADAR TEKRAR:
--   • Vardiya hatırlatması, cihaz `push_teslim`'e gosterildi=true yazana
--     kadar tekrar denenir (vardiya başına en fazla 4 deneme).
--   • Deneme sayacı bildirim_log'da `YYYY-MM-DD:<v>:try:N` olarak tutulur;
--     eski "vardiyada tek gönderim" anahtarı (…:reviews) artık KULLANILMAZ.
--   • TTL 86400 → 5400 (90 dk): cihaz açıldığında biriken ESKİ mesajlar
--     topluca patlamasın; sıradaki deneme zaten en geç 2 saat sonra.
--   • Onay eşleşmesi: başlık + gün + abonelik son 4 hanesi.
--
-- CRON: 07:35 · 09:35 · 11:35 · 13:05 (sabah) · 19:30 · 21:35 (akşam) TR
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
  deneme int;
  hat_baslik text;   -- 'baslik' push_teslim kolonuyla çakışıyordu (42702)
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

    -- Bugünü (veya geçmişi) gelmiş tekrar konuları
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

    -- 1) CİHAZ BU HATIRLATMAYI GÖSTERDİ Mİ? (en güçlü kanıt: cihazın kendi beyanı)
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
      atlanan := atlanan + 1;   -- gösterildi → bir daha gönderme
      continue;
    end if;

    -- 2) DENEME SINIRI (vardiya başına 4)
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
          -- 90 dk: cihaz kapalıysa mesaj birikmesin, sıradaki deneme zaten gelir.
          'ttl', '5400',
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
  'Hatırlatma: cihaz gosterildi=true yazana kadar vardiya başına en fazla 4 deneme. TTL 90 dk. Tek kanal: push-tani (web-push).';
