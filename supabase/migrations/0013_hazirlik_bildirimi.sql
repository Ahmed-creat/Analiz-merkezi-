-- ============================================================
-- 0013 — HAZIRLIK GÜNLERİ BİLDİRİMİ (v95)
-- ------------------------------------------------------------
-- KULLANICI (20 Kas 2026, geri bildirim):
--   "Bu hazırlıkları bildirimle bildirmeli."
--
-- SORUN
--   Uygulama sınava hazırlık oturumlarını takvime işliyordu ama PUSH
--   bildirimi bu günleri HİÇ bilmiyordu: uygulama kapalıyken hazırlık
--   günü sessizce geçiyordu. Ayrıca eski günler sabitti (−7/−3/−1) ve
--   metinler "Genel tekrar / Eksik kapatma / Formül turu" idi.
--
-- DÜZELTME
--   • v95'te hazırlık günleri KONU SAYISINDAN üretilir (oturum başına 3
--     konu, günde en çok 2 oturum) ve uygulama planı hem state'e yazar
--     (state.plan.hazirlikPlani) hem de her oturum için hazır bildirim
--     metni üretir: "TDE (sınavdan 3 gün): Şiirde Ahenk, Koşuk".
--   • Bu migration `webpush_tetikle()` fonksiyonuna DÖRDÜNCÜ kaynağı
--     ekler: bugünün hazırlık oturumları. Mesaj yine TEK satırdır ve
--     içerik imzasına girer (aynı içerik gün içinde tekrar gönderilmez).
--   • Uygulama hiç açılmamışsa plan da yoktur → uydurma hazırlık
--     bildirimi GİTMEZ (kazanım/plan uydurulmaz kuralı).
--   • `webpush_tetikle` tamamen yeniden tanımlanır (create or replace):
--     0010'daki gövdenin üzerine yalnız hazırlık kaynağı eklenmiştir.
--   Tekrar çalıştırmak zararsızdır (idempotent).
-- ============================================================

create or replace function public.webpush_tetikle()
returns jsonb
language plpgsql
security definer
as $function$
declare
  r record; a record;
  v_state jsonb; dt jsonb;
  bugun date := (now() at time zone 'Europe/Istanbul')::date;
  saat int := extract(hour from (now() at time zone 'Europe/Istanbul'));
  vardiya text := case when extract(hour from (now() at time zone 'Europe/Istanbul')) < 14 then 's' else 'a' end;
  sirket text := (select decrypted_secret from vault.decrypted_secrets where name = 'bildirim_secret');
  gorev_sayi int := 0; tekrar_sayi int := 0; acil_sayi int := 0; nedensiz_sayi int := 0;
  hazirlik_sayi int := 0;
  tekrar_liste text := ''; acil_liste text := ''; hazirlik_liste text := '';
  parcalar text; baslik text; govde text; yuk text;
  imza text; deneme int; yeni int; gonderilen int := 0; atlanan int := 0;
begin
  -- Sessiz saat: TR 06:00–20:59 dışında gönderim yok.
  if saat < 6 or saat >= 21 then
    return jsonb_build_object('atlandi', 'sessiz saat', 'saat', saat);
  end if;

  for r in select distinct user_id from public.push_abonelikleri where aktif is true loop
    v_state := null;
    select s.state into v_state from public.app_states s where s.user_id = r.user_id limit 1;
    if v_state is null then atlanan := atlanan + 1; continue; end if;

    gorev_sayi := 0; tekrar_sayi := 0; acil_sayi := 0; nedensiz_sayi := 0; hazirlik_sayi := 0;
    tekrar_liste := ''; acil_liste := ''; hazirlik_liste := '';

    -- ---------------------------------------------------------
    -- 1) GÖREV — bugün yapılmayanlar
    -- ---------------------------------------------------------
    dt := coalesce(v_state->'dailyTasks', '{}'::jsonb);
    if coalesce(dt->>'date', '') <> bugun::text then
      -- Gün dönmüş: uygulama açılışta üç görevi sıfırlar (checkDailyStreak),
      -- yani üçü de yeniden bekliyordur.
      gorev_sayi := 3;
    else
      if lower(coalesce(dt->>'read', '')) not in ('true', 't', '1') then
        gorev_sayi := gorev_sayi + 1;
      end if;
      if lower(coalesce(dt->>'solve', '')) not in ('true', 't', '1') then
        gorev_sayi := gorev_sayi + 1;
      end if;
      -- "Konu çalış" görevi: bayrak YA DA bugün yapılmış bir çalışma kaydı
      -- (uygulamadaki `bugunCalismaVarMi()` kuralı)
      if lower(coalesce(dt->>'study', '')) not in ('true', 't', '1')
         and not exists (
           select 1 from jsonb_each(coalesce(v_state->'bkt_state', '{}'::jsonb)) b
           where left(coalesce(b.value->>'study_completed_at', ''), 10) = bugun::text
         )
      then
        gorev_sayi := gorev_sayi + 1;
      end if;
    end if;

    -- Nedeni işlenmemiş hata satırları uygulamada AYRI bir görevdir.
    select count(*) into nedensiz_sayi from (
      select e.value as e
      from jsonb_array_elements(coalesce(v_state->'exams', '[]'::jsonb)) kayit,
           lateral jsonb_array_elements(coalesce(kayit->'errorLogs', '[]'::jsonb)) e
      union all
      select e.value as e
      from jsonb_array_elements(coalesce(v_state->'questions', '[]'::jsonb)) kayit,
           lateral jsonb_array_elements(coalesce(kayit->'errorLogs', '[]'::jsonb)) e
    ) q
    where coalesce(q.e->>'type', '') = '';
    if nedensiz_sayi > 0 then gorev_sayi := gorev_sayi + 1; end if;

    -- ---------------------------------------------------------
    -- 2) TEKRAR — hafıza planında günü gelmiş konular
    -- ---------------------------------------------------------
    select coalesce(count(*), 0), coalesce(string_agg(konu, ', ' order by konu), '')
      into tekrar_sayi, tekrar_liste
    from (
      select distinct coalesce(nullif(split_part(m.key, ' > ', 2), ''), m.key) as konu
      from jsonb_each(coalesce(v_state->'memory', '{}'::jsonb)) m
      where exists (
        select 1 from jsonb_each_text(coalesce(m.value->'schedule', '{}'::jsonb)) sch
        where sch.value ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
          and left(sch.value, 10)::date <= bugun
      )
      order by konu
      limit 5
    ) t;

    -- ---------------------------------------------------------
    -- 3) ACİL KONU — nedeni SEÇİLMİŞ hata kayıtları (uygulama puanlaması)
    --    Nedeni boş satır puan 0 alır → acil sayılmaz.
    -- ---------------------------------------------------------
    with hatalar as (
      select 'deneme'::text as kaynak, e.value as e
      from jsonb_array_elements(coalesce(v_state->'exams', '[]'::jsonb)) kayit,
           lateral jsonb_array_elements(coalesce(kayit->'errorLogs', '[]'::jsonb)) e
      union all
      select 'test'::text as kaynak, e.value as e
      from jsonb_array_elements(coalesce(v_state->'questions', '[]'::jsonb)) kayit,
           lateral jsonb_array_elements(coalesce(kayit->'errorLogs', '[]'::jsonb)) e
    ), puanli as (
      select coalesce(nullif(split_part((e->>'lesson') || ' > ' || (e->>'topic'), ' > ', 2), ''), (e->>'topic')) as konu,
             case
               when (e->>'type') in ('Konuyu Bilmiyordum', 'KONUEKSİKLİĞİ', 'KONU EKSİKLİĞİ')
                 then case when kaynak = 'deneme' then 1.5 else 1.0 end
               when (e->>'type') = 'ÇÖZÜMYOLUNUBULAMADIM' then 0.8
               when (e->>'type') in ('ANLAMADIM', 'İşlem Hatası/Dikkatsizlik') then 0.5
               when (e->>'type') = 'Kodlama/Kitapçık Hatası' then 0.1
               else 0
             end as puan
      from hatalar
      where (e->>'topic') is not null and (e->>'lesson') is not null
        and (e->>'date') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
        and not exists (
          select 1 from jsonb_each(coalesce(v_state->'memory', '{}'::jsonb)) m
          where m.key = (e->>'lesson') || ' > ' || (e->>'topic')
            and (m.value->>'completedAt') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
            and left(m.value->>'completedAt', 10)::date > left(e->>'date', 10)::date
        )
    ), toplam as (
      select konu, sum(puan) as puan from puanli where puan > 0 group by konu
    ), sirali as (
      select konu, puan, row_number() over (order by puan desc, konu) as sira from toplam
    )
    select coalesce(count(*), 0),
           coalesce((select string_agg(
               case when length(konu) > 45 then left(konu, 45) || '…' else konu end,
               ', ' order by puan desc, konu)
             from sirali where sira <= 3), '')
      into acil_sayi, acil_liste
    from sirali;

    -- ---------------------------------------------------------
    -- 4) HAZIRLIK — uygulamanın ürettiği plan (state.plan.hazirlikPlani)
    --    v95: günler sabit değil, konu sayısından üretilir. Uygulama her
    --    oturum için hazır metin yazar; burada yalnız BUGÜNÜ seçilir.
    --    Plan yoksa (uygulama hiç açılmamış) sessiz kalınır.
    -- ---------------------------------------------------------
    select coalesce(count(*), 0), coalesce(string_agg(b, ' | ' order by b), '')
      into hazirlik_sayi, hazirlik_liste
    from (
      select case when length(hp->>'bildirim') > 70
                  then left(hp->>'bildirim', 70) || '…'
                  else hp->>'bildirim' end as b
      from jsonb_array_elements(coalesce(v_state->'plan'->'hazirlikPlani', '[]'::jsonb)) hp
      where (hp->>'date') = bugun::text
        and coalesce(hp->>'bildirim', '') <> ''
      order by hp->>'ders'
      limit 2
    ) z;

    -- Hiçbir iş yoksa sessiz: uydurma bildirim gönderilmez.
    if gorev_sayi + tekrar_sayi + acil_sayi + hazirlik_sayi = 0 then
      atlanan := atlanan + 1; continue;
    end if;

    -- İçerik imzası: aynı içerik aynı gün ikinci kez gönderilmez,
    -- içerik değişirse (görev bitti / yeni acil konu doğdu) yeniden gönderilir.
    imza := md5(
      coalesce(gorev_sayi, 0)::text || '|' || coalesce(tekrar_sayi, 0)::text || '|' ||
      coalesce(acil_sayi, 0)::text || '|' || coalesce(hazirlik_sayi, 0)::text || '|' ||
      coalesce(tekrar_liste, '') || '|' || coalesce(acil_liste, '') || '|' || coalesce(hazirlik_liste, '')
    );
    if exists (
      select 1 from public.bildirim_log
      where user_id = r.user_id and anahtar = bugun::text || ':' || vardiya || ':sig:' || imza
    ) then
      atlanan := atlanan + 1; continue;
    end if;

    -- Günlük tavan (spam yok)
    select count(*) into deneme from public.bildirim_log
    where user_id = r.user_id and anahtar like bugun::text || ':%:try:%';
    if deneme >= 6 then atlanan := atlanan + 1; continue; end if;

    insert into public.bildirim_log (user_id, anahtar, gun)
    values (r.user_id, bugun::text || ':' || vardiya || ':try:' || (deneme + 1), bugun)
    on conflict do nothing;
    get diagnostics yeni = row_count;
    if yeni = 0 then atlanan := atlanan + 1; continue; end if;

    insert into public.bildirim_log (user_id, anahtar, gun)
    values (r.user_id, bugun::text || ':' || vardiya || ':sig:' || imza, bugun)
    on conflict do nothing;

    -- ---------------------------------------------------------
    -- MESAJ — dört kaynak TEK satırda
    -- ---------------------------------------------------------
    parcalar := '';
    if gorev_sayi > 0 then
      parcalar := parcalar || case when parcalar <> '' then ' · ' else '' end || gorev_sayi || ' görev';
    end if;
    if tekrar_sayi > 0 then
      parcalar := parcalar || case when parcalar <> '' then ' · ' else '' end || tekrar_sayi || ' tekrar';
    end if;
    if acil_sayi > 0 then
      parcalar := parcalar || case when parcalar <> '' then ' · ' else '' end || acil_sayi || ' acil konu';
    end if;
    if hazirlik_sayi > 0 then
      parcalar := parcalar || case when parcalar <> '' then ' · ' else '' end || hazirlik_sayi || ' hazırlık';
    end if;

    baslik := case when vardiya = 's' then 'Bugün seni bekleyenler' else 'Akşam: bugün seni bekleyenler' end;
    govde := 'Bugün: ' || parcalar || '.';
    if acil_liste <> '' then
      govde := govde || ' En önce: ' || acil_liste || '.';
    elsif tekrar_liste <> '' then
      govde := govde || ' Tekrar: ' || tekrar_liste || '.';
    end if;
    -- HAZIRLIK her zaman yazılır (kullanıcı: "bu hazırlıkları bildirimle
    -- bildirmeli") — hangi konu, kaç gün kaldı bilgisi metnin içindedir.
    if hazirlik_liste <> '' then
      govde := govde || ' Hazırlık: ' || hazirlik_liste || '.';
    end if;
    govde := govde || ' Uygulamayı aç → Bugün Yapılacaklar.';

    yuk := jsonb_build_object('title', baslik, 'body', govde, 'url', './', 'kind', 'gunluk')::text;

    for a in select id from public.push_abonelikleri where aktif is true and user_id = r.user_id loop
      perform net.http_post(
        url := 'https://ztgzmhfklsdlngrtennp.supabase.co/functions/v1/push-tani',
        headers := jsonb_build_object('Content-Type', 'application/json', 'x-bildirim-secret', sirket),
        body := jsonb_build_object(
          'abonelik_id', a.id, 'ttl', '5400', 'urgency', 'high',
          'topic', 'am-' || to_char(bugun, 'YYYYMMDD') || '-' || vardiya,
          'sifreli', 'webpush', 'mesaj', yuk
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
$function$;

comment on function public.webpush_tetikle() is
  'v95 — görev + tekrar + acil konu + hazırlık oturumları TEK mesajda; hazırlık metni uygulamanın planından (state.plan.hazirlikPlani); içerik imzasıyla gün içi tekilleştirme; günlük tavan 6; sessiz saat TR 21–06.';

-- Kontrol: fonksiyon dört kaynağı da biliyor mu?
do $$
declare g text := pg_get_functiondef('public.webpush_tetikle()'::regprocedure);
begin
  if g not like '%hazirlikPlani%' then
    raise exception 'v95: hazırlık kaynağı fonksiyona eklenmedi';
  end if;
  if g not like '%hazirlik_liste%' then
    raise exception 'v95: hazırlık metni mesaja eklenmedi';
  end if;
  raise notice 'v95: hazırlık bildirimi webpush_tetikle içinde ✓';
end $$;
