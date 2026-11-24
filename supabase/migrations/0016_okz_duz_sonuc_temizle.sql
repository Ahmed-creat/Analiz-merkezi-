-- ============================================================
-- 0016 — v107: Okulizyon kuyruğunda DÜZ METİN SONUÇ BIRAKILMAZ
-- ============================================================
-- NEDEN (ölçüm, 21 Kasım 2026):
--   public.okulizyon_kuyrugu tablosunda 5 satırın 5'inde de "exams" (tam sınav
--   sonucu: doğru/yanlış/net, ders, konu) ve "ham_ozet" (sınav adları) DÜZ
--   metin duruyordu. app_states artık kasayla şifreleniyor (v106) ama bu
--   tablo kasadan ÖNCE yazıldığı için kullanıcının tüm sınav sonuçları
--   veritabanında okunabilir hâlde kalıyordu.
--
-- KARAR:
--   • Sınav sonuçları artık BURADA saklanmaz. Sunucu çekimi kullanıcının
--     kendi cihazına döndürür; kalıcı kayıt uçtan uca şifreli app_states
--     içinde tutulur (v106 kasa).
--   • Bu tablo yalnız DURUM (durum, durum_mesaji, pulled_at) taşır.
--   • "ham_ozet" tamamen kaldırılır.
--   • İstemci artık bu tabloya YAZAMAZ (INSERT/UPDATE/DELETE yetkisi alınır);
--     yalnız service_role (sunucu) yazar. İstemci yalnız okur.
--
-- IDEMPOTENT: tekrar çalıştırılabilir. Canlıya uygulanmıştır.
-- ============================================================

begin;

-- 1) Düz metin sınav sonuçlarını SİL (veri zaten cihazda + şifreli kasada).
--    Önce ölç: kaç satırda düz sonuç var?
do $$
declare
  n_exams int;
  n_ozet  int;
begin
  select count(*) into n_exams from public.okulizyon_kuyrugu where exams is not null;
  select count(*) into n_ozet  from public.okulizyon_kuyrugu where coalesce(ham_ozet, '') <> '';
  raise notice 'v107: temizlenecek düz metin — exams:% ham_ozet:%', n_exams, n_ozet;
end $$;

-- exams kolonunu boşalt (kolon kalır: eski istemciler "exams" bekleyebilir;
-- null görünce "sonuç yok" der, çökmez).
-- ÖNEMLİ (canlıda bir kez 23502 ile düştü): kolon NOT NULL ise null yazılamaz.
-- Önce varsayılan ve zorunluluk kaldırılır. Sıra korunmalıdır.
alter table public.okulizyon_kuyrugu alter column exams drop default;
alter table public.okulizyon_kuyrugu alter column exams drop not null;
update public.okulizyon_kuyrugu set exams = null where exams is not null;

-- ham_ozet kolonunu tamamen kaldır
alter table public.okulizyon_kuyrugu drop column if exists ham_ozet;

-- 2) İstemci yazma yetkilerini al: bu tabloya yalnız SUNUCU yazar.
revoke insert, update, delete, truncate, references, trigger
  on public.okulizyon_kuyrugu from anon, authenticated;
grant select on public.okulizyon_kuyrugu to authenticated;

-- 3) Politikaları sadeleştir: yalnız "kendi satırını oku".
drop policy if exists okulizyon_kuyrugu_insert_own on public.okulizyon_kuyrugu;
drop policy if exists okulizyon_kuyrugu_update_own on public.okulizyon_kuyrugu;
drop policy if exists okulizyon_kuyrugu_delete_own on public.okulizyon_kuyrugu;

drop policy if exists okulizyon_kuyrugu_select_own on public.okulizyon_kuyrugu;
create policy okulizyon_kuyrugu_select_own
  on public.okulizyon_kuyrugu for select to authenticated
  using (auth.uid() = user_id);

-- 4) Yorum: ne olduğunu tabloya yaz (sonraki okuyan yanılmasın).
comment on table public.okulizyon_kuyrugu is
  'v107 — yalnız ÇEKİM DURUMU. Sınav sonuçları burada SAKLANMAZ: app_states içinde uçtan uca şifreli (kasa). İstemci yalnız okur.';
comment on column public.okulizyon_kuyrugu.exams is
  'KALDIRILDI (v107) — düz metin sınav sonucu burada tutulmaz; her zaman NULL.';

-- 5) KENDİ KENDİNİ DENETLEYEN BLOK
do $$
declare
  rls        boolean;
  yazar      int;
  reader     boolean;
  kalan_exam int;
  ozet_var   boolean;
  politika   int;
begin
  select relrowsecurity into rls from pg_class
   where oid = 'public.okulizyon_kuyrugu'::regclass;
  if not rls then raise exception 'v107: RLS kapalı!'; end if;

  select count(*) into politika from pg_policy
   where polrelid = 'public.okulizyon_kuyrugu'::regclass;
  if politika <> 1 then
    raise exception 'v107: politika sayısı 1 olmalı, bulunan %', politika;
  end if;

  if has_table_privilege('authenticated', 'public.okulizyon_kuyrugu', 'INSERT')
     or has_table_privilege('authenticated', 'public.okulizyon_kuyrugu', 'UPDATE')
     or has_table_privilege('authenticated', 'public.okulizyon_kuyrugu', 'DELETE') then
    raise exception 'v107: girişli kullanıcı hâlâ yazabiliyor!';
  end if;

  if has_table_privilege('anon', 'public.okulizyon_kuyrugu', 'SELECT') then
    raise exception 'v107: anon okuyabiliyor!';
  end if;

  select count(*) into yazar from pg_roles where rolname = 'service_role';
  if yazar = 0 then raise exception 'v107: service_role yok?'; end if;

  select has_table_privilege('authenticated', 'public.okulizyon_kuyrugu', 'SELECT') into reader;
  if not reader then raise exception 'v107: girişli kullanıcı kendi durumunu okuyamıyor!'; end if;

  select count(*) into kalan_exam
    from public.okulizyon_kuyrugu where exams is not null;
  if kalan_exam > 0 then
    raise exception 'v107: % satırda hâlâ düz sınav sonucu var!', kalan_exam;
  end if;

  select exists (
    select 1 from information_schema.columns
     where table_schema = 'public' and table_name = 'okulizyon_kuyrugu'
       and column_name = 'ham_ozet'
  ) into ozet_var;
  if ozet_var then raise exception 'v107: ham_ozet kolonu hâlâ duruyor!'; end if;

  raise notice 'v107 DOĞRULANDI ✓ rls=% politika=% düz_sonuç=%', rls, politika, kalan_exam;
end $$;

commit;
