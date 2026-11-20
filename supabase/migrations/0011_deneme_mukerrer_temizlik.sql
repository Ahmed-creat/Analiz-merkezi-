-- ============================================================
-- 0011 — MÜKERRER DENEME TEMİZLİĞİ (v93)
-- ------------------------------------------------------------
-- NEDEN: Okulizyon sonuç bağlantısındaki `sid` OTURUM jetonu (her çekimde
-- değişir). v46c/v86 kimliği sid'e bağladığı için aynı sınav iki kez
-- Denemelerim'e yazıldı. Canlı kanıt (19 Kas, kullanıcı 7490b2fb):
--   • "Okulizyon: 10.SINIF MAARİF İZLEME SINAVI 1" · 2026-10-27 · net 77,5
--   • 1. kopya: 39 hata satırı, 39'unun NEDENİ işlenmiş
--   • 2. kopya: 39 hata satırı, hiçbirinin nedeni yok
--   → Öğrenci nedenleri tek kopyada işlemiş; diğer kopya sayıları ikiye
--     katlıyordu (acil konu puanları şişiyor, "nedeni eksik" sayısı yanlış).
--
-- NE YAPAR:
--   Aynı ad + tarih + içerik (D/Y/B) taşıyan denemeler TEK kayda indirilir.
--   • Korunan kayıt: nedeni işlenmiş satırı EN ÇOK olan (öğrencinin emeği).
--   • Boş nedenli satırlar, aynı soru no + ders + konu eşleşmesiyle diğer
--     kopyadan gelen nedenle doldurulur (veri kaybı yok).
--   • Uygulama da açılışta aynı işi yapar (`okzTekrarlariBirlestir`); bu
--     migration açmayan cihazlar için bulutu onarır.
-- ============================================================

-- 0) GÜVENLİK: daha önce yanlış yazılmış sarmalayıcıyı çöz
--    (bir eleman {ord, user_id, jsonb_set:{...}} biçiminde kalmışsa gerçek
--    deneme nesnesi jsonb_set alanındadır → geri açılır).
update public.app_states s
   set state = jsonb_set(s.state, '{exams}', (
     select jsonb_agg(elem->'jsonb_set' order by (elem->>'ord')::int)
       from jsonb_array_elements(s.state->'exams') elem
   ))
 where exists (
   select 1 from jsonb_array_elements(s.state->'exams') e where e ? 'jsonb_set'
 );

with patlat as (
  select s.user_id,
         t.ord,
         t.e as ex,
         (coalesce(t.e->>'name', '') || '|' || coalesce(t.e->>'date', '') || '|' ||
          md5(coalesce(t.e->'lessons', '{}'::jsonb)::text)) as kimlik,
         (select count(*)
            from jsonb_array_elements(coalesce(t.e->'errorLogs', '[]'::jsonb)) l
           where coalesce(l->>'type', '') <> '') as islenmis
    from public.app_states s,
         lateral jsonb_array_elements(coalesce(s.state->'exams', '[]'::jsonb)) with ordinality as t(e, ord)
), tutulan as (
  select distinct on (user_id, kimlik) user_id, kimlik, ex, ord
    from patlat
   order by user_id, kimlik, islenmis desc, ord
), tip as (
  select distinct on (user_id, anahtar) user_id, anahtar, tur
    from (
      select p.user_id,
             (l->>'qno') || '|' || coalesce(l->>'lesson', '') || '|' || coalesce(l->>'topic', '') as anahtar,
             l->>'type' as tur
        from patlat p,
             lateral jsonb_array_elements(coalesce(p.ex->'errorLogs', '[]'::jsonb)) l
       where coalesce(l->>'type', '') <> ''
    ) q
   order by user_id, anahtar
), harita as (
  select user_id, jsonb_object_agg(anahtar, tur) as m from tip group by user_id
), duzeltilmis as (
  -- DİKKAT: kolon adı (ex2) ile CTE adı (duzeltilmis) KARIŞMAMALI; aksi hâlde
  -- jsonb_agg(duzeltilmis) tüm satırı toplar (v93'te bu hata yakalandı).
  select t.user_id, t.ord,
         jsonb_set(t.ex, '{errorLogs}', coalesce((
           select jsonb_agg(
                    case
                      when coalesce(l->>'type', '') = ''
                       and jsonb_exists(coalesce(h.m, '{}'::jsonb),
                             (l->>'qno') || '|' || coalesce(l->>'lesson', '') || '|' || coalesce(l->>'topic', ''))
                        then l || jsonb_build_object('type', coalesce(h.m, '{}'::jsonb)->>
                             ((l->>'qno') || '|' || coalesce(l->>'lesson', '') || '|' || coalesce(l->>'topic', '')))
                      else l
                    end order by lo)
             from jsonb_array_elements(coalesce(t.ex->'errorLogs', '[]'::jsonb)) with ordinality as x(l, lo)
         ), '[]'::jsonb)) as ex2
    from tutulan t
    left join harita h on h.user_id = t.user_id
), topla as (
  select user_id, jsonb_agg(ex2 order by ord) as exams
    from duzeltilmis
   group by user_id
)
update public.app_states s
   set state = jsonb_set(s.state, '{exams}', topla.exams)
  from topla
 where s.user_id = topla.user_id
   and jsonb_array_length(coalesce(s.state->'exams', '[]'::jsonb)) > 1;

-- Doğrulama: aynı ad+tarih+içerikli deneme kalmadı mı?
do $$
declare kalan int;
begin
  select count(*) into kalan
  from (
    select s.user_id,
           (coalesce(e->>'name', '') || '|' || coalesce(e->>'date', '') || '|' ||
            md5(coalesce(e->'lessons', '{}'::jsonb)::text)) as kimlik,
           count(*) as adet
      from public.app_states s,
           lateral jsonb_array_elements(coalesce(s.state->'exams', '[]'::jsonb)) e
     group by 1, 2
    having count(*) > 1
  ) d;
  if kalan > 0 then
    raise warning 'v93: % mükerrer deneme grubu hâlâ var (elle bakılmalı)', kalan;
  end if;
end $$;
