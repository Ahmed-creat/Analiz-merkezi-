-- ============================================================
-- 0007 — BİLDİRİMİN KÖR NOKTASI: "ACİL KONU" (v89)
-- ------------------------------------------------------------
-- KULLANICI (18 Kas 19:43): "Ya bildirimin çalıştığından emin misin,
-- şu an saat 19.43 hâlâ gelmedi." · "Tekrar yok ama konu takibinde
-- acil konu var. Bunun içinde bildirim vardı. Bu gelmezse öğrenci
-- çalışmaz ve tekrar da etmez."
--
-- ÖLÇÜM (18 Kas, canlı):
--   • cron `bildirim-aksam` 19:30:00 → succeeded, ama push YOK.
--   • `app_states`: üç hesapta da hafıza (memory) BOŞ → tekrar listesi 0.
--   • Aynı hesaplarda `exams[].errorLogs` = 39 kayıt, hepsinin konusu var
--     (Matematik 1.2 Üçgende Yardımcı Elemanlar 6, 1.3 Üçgende Alan 5, …).
--   • Eski `webpush_tetikle` YALNIZ `state->'memory'` planına bakıyordu:
--     `if adet = 0 then continue;` → tekrar boşsa bildirimi SESSİZCE atlıyordu.
--   Yani kanal sağlam (19:45 testi: push 201 → cihaz gösterdi), eksik olan
--   MOTORUN KAPSAMI: uygulamanın ana sayfada "ACİL KONU" diye gösterdiği
--   hata kayıtları bildirime hiç girmiyordu.
--
-- DÜZELTME: sıra korunur —
--   1) günü gelmiş TEKRAR varsa eski metin (davranış aynı),
--   2) tekrar YOKSA hata kayıtlarından ACİL KONU listesi (en çok 5),
--   3) ikisi de yoksa sessiz (uydurma bildirim yok).
--
-- Puanlama, uygulamanın kendi formülüyle aynı ağırlıkları kullanır
-- (site/index.html · REASON_WEIGHTS):
--   Konuyu Bilmiyordum / KONUEKSİKLİĞİ → denemede 1.5, testte 1.0
--   ÇÖZÜMYOLUNUBULAMADIM → 0.8 · ANLAMADIM / İşlem Hatası → 0.5
--   Kodlama/Kitapçık Hatası → 0.1
-- `completedAt` gününden ÖNCEKİ hatalar düşer (uygulamadaki
-- `topicLearnedAfter` kuralının aynısı). Tarihi okunamayan kayıt sayılmaz.
--
-- Ayrıca TTL 21600 (6 saat) → 5400 (90 dk): v87'deki kuralın aynısı,
-- denemeler arasında mesaj birikmez.
-- ============================================================

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

    -- 1) TEKRAR: hafıza planında günü gelmiş/geçmiş konular (eski davranış)
    for k in
      select m.key as konu from public.app_states s, lateral jsonb_each(coalesce(s.state->'memory','{}'::jsonb)) m
      where s.user_id = r.user_id and exists (select 1 from jsonb_each_text(coalesce(m.value->'schedule','{}'::jsonb)) sch
        where sch.value ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' and left(sch.value, 10)::date <= bugun)
      order by m.key limit 5
    loop
      adet := adet + 1;
      liste := liste || case when adet > 1 then ', ' else '' end || coalesce(nullif(split_part(k.konu, ' > ', 2), ''), k.konu);
    end loop;

    -- 2) TEKRAR YOKSA ACİL KONU: hata kayıtları (exams + questions)
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
            -- tarihi okunamayan kayıt sayılmaz (uygulama da dışlar)
            and (e->>'date') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
            -- o konu sonradan "öğrendim" işaretlendiyse eski hatalar düşer
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

    hat_baslik := case when tur = 'acil'
      then case when vardiya = 's' then 'Günaydın! Acil konular' else 'Akşam: acil konular açık' end
      else case when vardiya = 's' then 'Günaydın! Tekrar Zamanı' else 'Akşam tekrarı seni bekliyor' end end;

    -- Aynı gün aynı başlık cihazda GÖSTERİLDİYSE tekrar gönderme
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
