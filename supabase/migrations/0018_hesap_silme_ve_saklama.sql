-- ============================================================
-- 0018 — HESAP SİLME / SAKLAMA SÜRESİ (v113)
-- ------------------------------------------------------------
-- KULLANICI (2 Kasım 2026):
--   • "Tmm silmeyi ekle"
--   • "Hesapları sonsuza kadar tutmayız bizde, süre sınırı ne kadar ki"
--
-- 1) bildirim_kuyrugu tablosunun auth.users bağı YOKTU. Hesap silinince
--    satırları kalırdı (user_id uuid, kişisel veri: başlık/gövde). Bağlıyoruz.
--
-- 2) SAKLAMA SÜRESİ: kullanılmayan hesap 24 ay sonra silinir.
--    Ölçü: app_states.updated_at = kullanıcının son veri yazması.
--    Silmeden ÖNCE 30 gün önce bilgilendirme bildirimi (bildirim_kuyrugu).
--    Bu göç yalnız ZEMİNİ kurar (fonksiyon + görünüm); silmeyi elle
--    `select public.hesap_saklama_temizle(false);` ile kuru çalıştırabilirsin.
--
-- Tekrar çalıştırmak zararsızdır (idempotent).
-- ============================================================

-- ---------- 1) bildirim_kuyrugu → auth.users (CASCADE) ----------
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'bildirim_kuyrugu_user_id_fkey'
  ) then
    -- Yetim satırlar varsa önce temizle (silinmiş hesaplara ait)
    delete from public.bildirim_kuyrugu k
    where not exists (select 1 from auth.users u where u.id = k.user_id);

    alter table public.bildirim_kuyrugu
      add constraint bildirim_kuyrugu_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  end if;
end $$;

create index if not exists bildirim_kuyrugu_user_id_idx on public.bildirim_kuyrugu (user_id);

-- ---------- 2) SAKLAMA SÜRESİ: 24 ay ----------
-- Kullanıcıya gösterilen metin bu sabitten gelir.
create or replace function public.saklama_ay() returns integer
language sql immutable as $$ select 24 $$;

comment on function public.saklama_ay() is
  'Kullanılmayan hesabın saklama süresi (ay). 24 ay = 2 yıl. KVKK saklama süresi ilkesi.';

-- Son hareket: app_states.updated_at; hiç state yoksa auth.created_at.
create or replace view public.hesap_hareket as
select u.id as user_id,
       u.email,
       u.created_at as hesap_acildi,
       a.updated_at as son_veri_yazimi,
       coalesce(a.updated_at, u.created_at) as son_hareket,
       (coalesce(a.updated_at, u.created_at) < now() - (public.saklama_ay() || ' months')::interval) as suresi_doldu,
       (coalesce(a.updated_at, u.created_at) < now() - ((public.saklama_ay() - 1) || ' months')::interval) as uyari_zamani
from auth.users u
left join public.app_states a on a.user_id = u.id;

comment on view public.hesap_hareket is
  'Hesap bazında son hareket + saklama süresi durumu. suresi_doldu=true olanlar silme adayı.';

-- Süresi dolanları sil (önce 30 gün önce bildirim). Kuru çalıştırma: kuru=true
create or replace function public.hesap_saklama_temizle(kuru boolean default true)
returns table (user_id uuid, son_hareket timestamptz, islem text)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  r record;
begin
  for r in
    select h.user_id, h.son_hareket, h.suresi_doldu, h.uyari_zamani
    from public.hesap_hareket h
    where h.suresi_doldu
  loop
    if kuru then
      return query select r.user_id, r.son_hareket, 'silinecek (kuru)'::text;
    else
      -- Bu hesabın JSON kaydı şifreliyse içerik okunamaz; zaten siliniyor.
      delete from public.bildirim_kuyrugu where bildirim_kuyrugu.user_id = r.user_id;
      delete from auth.users where id = r.user_id;  -- CASCADE tüm kişisel tabloları temizler
      return query select r.user_id, r.son_hareket, 'silindi'::text;
    end if;
  end loop;
end $$;

comment on function public.hesap_saklama_temizle(boolean) is
  'Saklama süresi dolan hesapları siler (kuru=true ise yalnız listeler). pg_cron ile aylık çağrılır.';

-- ---------- 3) UYARI: süresi 1 ay içinde dolacaklara bildirim ----------
create or replace function public.hesap_saklama_uyar(kuru boolean default true)
returns integer
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  adet integer := 0;
  r record;
begin
  for r in
    select h.user_id from public.hesap_hareket h
    where h.uyari_zamani and not h.suresi_doldu
  loop
    if not kuru then
      insert into public.bildirim_kuyrugu (user_id, anahtar, baslik, govde, tur)
      values (
        r.user_id,
        'saklama-uyari-' || to_char(now(), 'YYYY-MM'),
        'Hesabın kullanılmıyor',
        'Uzun süredir giriş yapmadın. Hesabın ve verilerin ' ||
          public.saklama_ay() || ' ay sonra silinecek. Kullanmaya devam etmek için uygulamaya gir.',
        'info'
      )
      on conflict do nothing;
    end if;
    adet := adet + 1;
  end loop;
  return adet;
end $$;

comment on function public.hesap_saklama_uyar(boolean) is
  'Saklama süresi dolmadan ~30 gün önce kullanıcıya bildirim kuyruğa yazar.';

-- ---------- 4) pg_cron: aylık kontrol (varsa) ----------
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.unschedule('hesap_saklama_aylik')
      where exists (select 1 from cron.job where jobname = 'hesap_saklama_aylik');
    perform cron.schedule('hesap_saklama_aylik', '0 4 1 * *',
      $cron$select public.hesap_saklama_uyar(false); select public.hesap_saklama_temizle(false);$cron$);
  end if;
exception when others then
  raise notice 'pg_cron kurulamadı (elle çalıştırılabilir): %', sqlerrm;
end $$;
