-- ============================================================
-- 0008 — BİLDİRİM BAŞLIKLARI + "YENİ DENEME SONUCUN VAR" (v90)
-- ------------------------------------------------------------
-- KULLANICI (18 Kas, ekran görüntüsüyle):
--   1) "Günaydın yazmasın yeter."   → sabah başlıkları saatten bağımsız,
--      nötr ifadeye çevrildi. Öğlen telafisi (13:05) sabah penceresinde
--      sayıldığı için öğleden sonra "Günaydın" yazabiliyordu; bu da bitti.
--   2) "Yeni deneme çekerse 'yeni deneme sonucun var' deyip onu analiz
--      etmesini söylesin."           → yeni deneme kuyruğu aşağıda.
--
-- BAŞLIKLAR (yeni):
--   tekrar · sabah/öğle : "Tekrar zamanı"
--   tekrar · akşam       : "Akşam tekrarı"
--   acil   · sabah/öğle : "Acil konular"
--   acil   · akşam       : "Akşam: acil konular"
--   yeni deneme          : "Yeni deneme sonucun var"
--
-- YENİ DENEME BİLDİRİMİNİN YOLU
--   Uygulama Okulizyon'dan yeni bir deneme yazdığında tarayıcıdan değil,
--   güvenli bir RPC ile KUYRUĞA bir satır bırakır (anahtar = sınav kimliği;
--   aynı sınav iki kez bildirilmez). 5 dakikada bir çalışan iş kuyruğu
--   boşaltır ve `push-tani` kanalıyla gönderir. Böylece:
--     • tarayıcıda gizli anahtar YOK (RPC security definer, auth.uid() kontrolü)
--     • uygulama kapalıyken de bildirim düşer
--     • sessiz saat (TR 06–21 dışı) kuyrukta bekler, ertesi sabah gider
-- ============================================================

-- ---------- 1) Vardiya/başlık düzeltmesi ----------
create or replace function public.webpush_tetikle()
returns jsonb
language plpgsql
security definer
as $function$
declare
  r record; k record; a record;
  liste text; adet int; deneme int; hat_baslik text; govde text; yuk text;
  bugun date := (now() at time zone 'Europe/Istanbul')::date;
  vardiya text := case when extract(hour from (now() at time zone 'Europe/Istanbul')) < 14 then 's' else 'a' end;
  sirket text := (select decrypted_secret from vault.decrypted_secrets where name = 'bildirim_secret');
  yeni int; gonderilen int := 0; atlanan int := 0;
  tur text; acil_sayi int := 0;
begin
  for r in select distinct user_id from public.push_abonelikleri where aktif is true loop
    liste := ''; adet := 0; acil_sayi := 0; tur := 'tekrar';

    for k in
      select m.key as konu from public.app_states s, lateral jsonb_each(coalesce(s.state->'memory','{}'::jsonb)) m
      where s.user_id = r.user_id and exists (select 1 from jsonb_each_text(coalesce(m.value->'schedule','{}'::jsonb)) sch
        where sch.value ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' and left(sch.value, 10)::date <= bugun)
      order by m.key limit 5
    loop
      adet := adet + 1;
      liste := liste || case when adet > 1 then ', ' else '' end || coalesce(nullif(split_part(k.konu, ' > ', 2), ''), k.konu);
    end loop;

    if adet = 0 then
      tur := 'acil';
      with konular as (
        select x.konu, sum(x.puan) as puan
        from (
          select coalesce(nullif(split_part((e->>'lesson') || ' > ' || (e->>'topic'), ' > ', 2), ''), (e->>'topic')) as konu,
                 case
                   when (e->>'type') in ('Konuyu Bilmiyordum','KONU EKSİKLİĞİ','KONUEKSİKLİĞİ')
                     then case when kay.kaynak = 'deneme' then 1.5 else 1.0 end
                   when (e->>'type') = 'ÇÖZÜMYOLUNUBULAMADIM' then 0.8
                   when (e->>'type') in ('ANLAMADIM','İşlem Hatası/Dikkatsizlik') then 0.5
                   when (e->>'type') = 'Kodlama/Kitapçık Hatası' then 0.1
                   else 1.0
                 end as puan
          from public.app_states s
          cross join lateral (
            select 'deneme'::text as kaynak, jsonb_array_elements(coalesce(s.state->'exams','[]'::jsonb)) as kayit
            union all
            select 'test'::text as kaynak, jsonb_array_elements(coalesce(s.state->'questions','[]'::jsonb)) as kayit
          ) kay
          cross join lateral jsonb_array_elements(coalesce(kay.kayit->'errorLogs','[]'::jsonb)) e
          where s.user_id = r.user_id
            and (e->>'topic') is not null and (e->>'lesson') is not null
            and (e->>'date') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
            and not exists (
              select 1 from jsonb_each(coalesce(s.state->'memory','{}'::jsonb)) m
              where m.key = (e->>'lesson') || ' > ' || (e->>'topic')
                and (m.value->>'completedAt') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
                and left(m.value->>'completedAt', 10)::date > left(e->>'date', 10)::date
            )
        ) x
        group by x.konu
      ), sirali as (
        select konu, puan, row_number() over (order by puan desc, konu) as sira
        from konular where puan > 0
      )
      select (select count(*) from sirali),
             coalesce((select string_agg(
                 case when length(konu) > 45 then left(konu, 45) || '…' else konu end,
                 ', ' order by puan desc, konu)
               from sirali where sira <= 3), '')
        into acil_sayi, liste;
      adet := acil_sayi;
    end if;

    if adet = 0 then continue; end if;

    -- GÜNAYDIN YOK: başlık saate göre, selamlaşma olmadan
    hat_baslik := case
      when tur = 'acil' then case when vardiya = 's' then 'Acil konular' else 'Akşam: acil konular' end
      else case when vardiya = 's' then 'Tekrar zamanı' else 'Akşam tekrarı' end end;

    if exists (select 1 from public.push_teslim t where t.gosterildi is true and t.baslik = hat_baslik and t.asama = 'gosterim'
      and (t.created_at at time zone 'Europe/Istanbul')::date = bugun
      and exists (select 1 from public.push_abonelikleri p where p.user_id = r.user_id and p.aktif is true and right(p.endpoint,4) = t.abonelik)) then
      atlanan := atlanan + 1; continue;
    end if;

    select count(*) into deneme from public.bildirim_log where user_id = r.user_id and anahtar like bugun::text || ':' || vardiya || ':try:%';
    if deneme >= 4 then atlanan := atlanan + 1; continue; end if;

    insert into public.bildirim_log (user_id, anahtar, gun) values (r.user_id, bugun::text || ':' || vardiya || ':try:' || (deneme + 1), bugun) on conflict do nothing;
    get diagnostics yeni = row_count;
    if yeni = 0 then atlanan := atlanan + 1; continue; end if;

    govde := case when tur = 'acil'
      then adet || ' acil konun var. En önce: ' || liste || '. Birini 10 dakikada kapat — Denemelerim > konu takibi.'
      else adet || ' konunun tekrarı bugün: ' || liste || '. Her biri 10 dakikalık müdahale yeter.' end;
    yuk := jsonb_build_object('title', hat_baslik, 'body', govde, 'url', './',
      'kind', case when tur = 'acil' then 'acil-konu' else 'reviews' end)::text;

    for a in select id from public.push_abonelikleri where aktif is true and user_id = r.user_id loop
      perform net.http_post(
        url := 'https://ztgzmhfklsdlngrtennp.supabase.co/functions/v1/push-tani',
        headers := jsonb_build_object('Content-Type','application/json','x-bildirim-secret', sirket),
        body := jsonb_build_object('abonelik_id', a.id, 'ttl', '5400', 'urgency', 'high',
          'topic', 'am-' || to_char(bugun,'YYYYMMDD') || '-' || vardiya, 'sifreli', 'webpush', 'mesaj', yuk)
      );
      gonderilen := gonderilen + 1;
    end loop;
  end loop;
  return jsonb_build_object('gonderilen', gonderilen, 'atlanan', atlanan, 'vardiya', vardiya, 'gun', bugun, 'ttl', '5400');
end;
$function$;

-- ---------- 2) Yeni deneme bildirim kuyruğu ----------
create table if not exists public.bildirim_kuyrugu (
  id bigserial primary key,
  user_id uuid not null,
  anahtar text not null,             -- tekilleştirme: 'deneme:<sınav>|<tarih>'
  baslik text not null,
  govde text not null,
  tur text not null default 'deneme',
  olustur timestamptz not null default now(),
  gonderildi timestamptz,
  sonuc text,
  unique (user_id, anahtar)
);

alter table public.bildirim_kuyrugu enable row level security;

drop policy if exists "kuyruk kendi satirini gorur" on public.bildirim_kuyrugu;
create policy "kuyruk kendi satirini gorur" on public.bildirim_kuyrugu
  for select using (auth.uid() = user_id);

-- İstemci yalnız RPC ile yazar; doğrudan insert kapalı.

/* İstemci (uygulama) yeni deneme yazdığında çağırır.
   Aynı anahtar ikinci kez gelirse satır eklenmez (mükerrer bildirim yok). */
create or replace function public.bildirim_deneme_kuyruk(
  p_anahtar text,
  p_baslik text default 'Yeni deneme sonucun var',
  p_govde text default ''
) returns jsonb
language plpgsql
security definer
set search_path = public
as $function$
declare
  ben uuid := auth.uid();
  eklendi int := 0;
  var_mi int := 0;
begin
  if ben is null then return jsonb_build_object('ok', false, 'sebep', 'giris-yok'); end if;
  if coalesce(btrim(p_anahtar), '') = '' then return jsonb_build_object('ok', false, 'sebep', 'anahtar-yok'); end if;

  select count(*) into var_mi from public.bildirim_kuyrugu
   where user_id = ben and anahtar = p_anahtar;
  if var_mi > 0 then return jsonb_build_object('ok', true, 'atlandi', 'zaten-var'); end if;

  insert into public.bildirim_kuyrugu (user_id, anahtar, baslik, govde, tur)
  values (ben, p_anahtar,
          coalesce(nullif(btrim(p_baslik), ''), 'Yeni deneme sonucun var'),
          coalesce(p_govde, ''), 'deneme')
  on conflict (user_id, anahtar) do nothing;
  get diagnostics eklendi = row_count;
  return jsonb_build_object('ok', true, 'eklendi', eklendi);
end;
$function$;

revoke all on function public.bildirim_deneme_kuyruk(text, text, text) from public;
grant execute on function public.bildirim_deneme_kuyruk(text, text, text) to authenticated;

/* Kuyruğu boşaltır: sessiz saat dışında her satırı push-tani ile gönderir. */
create or replace function public.bildirim_kuyruk_tetikle()
returns jsonb
language plpgsql
security definer
as $function$
declare
  r record; a record;
  sirket text := (select decrypted_secret from vault.decrypted_secrets where name = 'bildirim_secret');
  saat int := extract(hour from (now() at time zone 'Europe/Istanbul'));
  yuk text; gonderilen int := 0; atlanan int := 0; abone int;
begin
  if saat < 6 or saat >= 21 then
    return jsonb_build_object('atlandi', 'sessiz saat', 'saat', saat);
  end if;

  for r in
    select * from public.bildirim_kuyrugu
     where gonderildi is null
       and olustur > now() - interval '2 days'   -- 2 günden eski istek gönderilmez
     order by id limit 50
  loop
    abone := 0;
    for a in select id from public.push_abonelikleri where aktif is true and user_id = r.user_id loop
      yuk := jsonb_build_object('title', r.baslik, 'body', r.govde, 'url', './', 'kind', r.tur)::text;
      perform net.http_post(
        url := 'https://ztgzmhfklsdlngrtennp.supabase.co/functions/v1/push-tani',
        headers := jsonb_build_object('Content-Type','application/json','x-bildirim-secret', sirket),
        body := jsonb_build_object('abonelik_id', a.id, 'ttl', '86400', 'urgency', 'high',
          'sifreli', 'webpush', 'mesaj', yuk)
      );
      abone := abone + 1;
      gonderilen := gonderilen + 1;
    end loop;
    update public.bildirim_kuyrugu
       set gonderildi = now(),
           sonuc = case when abone = 0 then 'abonelik-yok' else abone || ' push' end
     where id = r.id;
    if abone = 0 then atlanan := atlanan + 1; end if;
  end loop;

  return jsonb_build_object('gonderilen', gonderilen, 'atlanan', atlanan);
end;
$function$;

-- 5 dakikada bir kuyruk boşaltılır (yeni deneme bildirimi ~5 dk içinde düşer)
select cron.unschedule('deneme-bildirim-kuyrugu')
 where exists (select 1 from cron.job where jobname = 'deneme-bildirim-kuyrugu');
select cron.schedule('deneme-bildirim-kuyrugu', '*/5 * * * *', 'select public.bildirim_kuyruk_tetikle();');
