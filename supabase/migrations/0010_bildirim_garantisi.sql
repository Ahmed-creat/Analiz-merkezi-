-- ============================================================
-- 0010 — BİLDİRİM GARANTİSİ (v93)
-- ------------------------------------------------------------
-- KULLANICI (19 Kas): "Ayrıca bildirimler gelmiyor. Şunu anla kullanıcının
-- görevi, acil konusu, tekrarı varsa kesin bildirim gelmeli."
--
-- ÖLÇÜM (19 Kas, canlı):
--   • `bildirim-sabah / -telafi / -aksam / tekrar-ogle / tekrar-gece` cron'ları
--     aynı `webpush_tetikle()` fonksiyonunu çağırıyordu; o fonksiyon
--     SIRA ile çalışıyordu: "tekrar varsa acil konu HİÇ duyurulmaz"
--     (0007'deki `if adet = 0 then ... acil ...`). Yani üç kaynaktan biri
--     dolduğunda diğer ikisi sessizce düşüyordu.
--   • GÖREV hiç girmiyordu: görevler ayrı `gorev-hatirlat` fonksiyonundaydı;
--     iki kanal birbirinden habersizdi (biri 07:40, öteki 07:35).
--   • `else 1.0` yüzünden NEDENİ BOŞ satırlar da "acil konu" sayılıyordu;
--     uygulamanın kendi hesabı (calculatePriority) nedensiz satırı SAYMAZ.
--     Sonuç: kullanıcıya "39 acil konu" gibi şişmiş bir mesaj gidebiliyordu.
--   • Tekrar vardiya başına 4 deneme sınırı vardı ve aynı başlık cihazda
--     gösterildiyse o gün ikinci kez HİÇ gönderilmiyordu (push_teslim kapısı).
--
-- DÜZELTME (tek kanal, tek mesaj, üç kaynak):
--   1) GÖREV  : bugünün çekirdek üç görevi + bugün yapılmış çalışma + nedeni
--               işlenmemiş hata satırı (uygulamadaki `gunlukGorevler()` ile aynı).
--   2) TEKRAR : hafıza planında günü gelmiş konular (en çok 5).
--   3) ACİL   : nedeni SEÇİLMİŞ hata kayıtları, uygulamanın puanlamasıyla
--               (Konuyu Bilmiyordum/KONUEKSİKLİĞİ 1.5 deneme · 1.0 test,
--                ÇÖZÜMYOLUNUBULAMADIM 0.8, ANLAMADIM/İşlem 0.5, Kodlama 0.1).
--               Nedeni boş satır acil SAYILMAZ (puan 0).
--   Üçü TEK mesajda toplanır: "Bugün: 3 görev · 2 acil konu · 1 tekrar.
--   En önce: X, Y." Üçü de boşsa sessiz (uydurma bildirim yok).
--
--   TEKİLLEŞTİRME içerik imzasıyladır (md5). Aynı içerik aynı vardiyada
--   ikinci kez gönderilmez; görev tamamlanıp acil konu değişince YENİ mesaj
--   gider (eskiden başlık kapısı yüzünden gün boyu susuyordu).
--   Günlük tavan 6, sessiz saat TR 21–06.
--
--   Ayrıca ayrı GÖREV cron'ları kapatılır: aynı işi iki kanal duyurmasın
--   (5 dakika arayla iki bildirim = kullanıcının "gelmiyor" dediği yerde
--   gürültü olurdu).
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
  tekrar_liste text := ''; acil_liste text := '';
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

    gorev_sayi := 0; tekrar_sayi := 0; acil_sayi := 0; nedensiz_sayi := 0;
    tekrar_liste := ''; acil_liste := '';

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

    -- Hiçbir iş yoksa sessiz: uydurma bildirim gönderilmez.
    if gorev_sayi + tekrar_sayi + acil_sayi = 0 then
      atlanan := atlanan + 1; continue;
    end if;

    -- İçerik imzası: aynı içerik aynı gün ikinci kez gönderilmez,
    -- içerik değişirse (görev bitti / yeni acil konu doğdu) yeniden gönderilir.
    imza := md5(
      coalesce(gorev_sayi, 0)::text || '|' || coalesce(tekrar_sayi, 0)::text || '|' ||
      coalesce(acil_sayi, 0)::text || '|' || coalesce(tekrar_liste, '') || '|' || coalesce(acil_liste, '')
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
    -- MESAJ — üç kaynak TEK satırda
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

    baslik := case when vardiya = 's' then 'Bugün seni bekleyenler' else 'Akşam: bugün seni bekleyenler' end;
    govde := 'Bugün: ' || parcalar || '.';
    if acil_liste <> '' then
      govde := govde || ' En önce: ' || acil_liste || '.';
    elsif tekrar_liste <> '' then
      govde := govde || ' Tekrar: ' || tekrar_liste || '.';
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

-- ------------------------------------------------------------
-- AYRI GÖREV CRON'LARINI KAPAT
-- Bu kanal artık yukarıdaki birleşik fonksiyonda. İki kanal birlikte
-- çalışırsa aynı iş için 5 dakara arayla iki bildirim gider.
-- ------------------------------------------------------------
do $blok$
declare j record;
begin
  for j in select jobid, jobname from cron.job where jobname like 'gorev-%' loop
    begin
      perform cron.unschedule(j.jobid);
      raise notice 'gorev cron kapatildi: % (%)', j.jobname, j.jobid;
    exception when others then
      raise notice 'gorev cron kapatilamadi: % (%) — %', j.jobname, j.jobid, sqlerrm;
    end;
  end loop;
end;
$blok$;

comment on function public.webpush_tetikle() is
  'v93 — görev + tekrar + acil konu TEK mesajda; içerik imzasıyla gün içi tekilleştirme; günlük tavan 6; sessiz saat TR 21–06.';
