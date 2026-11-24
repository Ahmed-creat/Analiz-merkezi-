-- ============================================================
-- 0015 — OKULİZYON KİMLİK BAĞI (v104)
-- ------------------------------------------------------------
-- KULLANICI (31 Ekim 2026): "Her öğrencinin Okulizyon hesabını bir e-postaya
-- bağlayalım ki bir hesaba bilgileri bilse bile başkası giremesin."
-- Seçim: "Bir okul no = tek hesap" (bir numara yalnız BİR hesaba bağlanır).
--
-- SORUN (ölçüldü): `okulizyon-cek` fonksiyonu "ben" modunda, giriş yapan
-- kullanıcının KENDİ state'inde yazan ad + okul no ile Okulizyon'a giriyordu.
-- Yani birinin adını, okulunu ve okul numarasını bilen biri bunları kendi
-- hesabına yazıp O ÖĞRENCİNİN sınav sonuçlarını kendi uygulamasına çekebilirdi.
-- Hiçbir sahiplik kaydı yoktu.
--
-- ÇÖZÜM: sahiplik kaydı + tekillik kısıtı.
--   • (kurumkodu, okul_no) çifti TABLODA TEK satırdır → ikinci hesap bağlanamaz.
--   • Bağlama yalnız sunucu tarafında (edge function, service_role) yapılır;
--     istemci bu tabloya YAZAMAZ. Okuma: yalnız kendi satırı.
--   • Düz AD saklanmaz — yalnız tuzlu SHA-256 özeti (KVKK veri minimizasyonu).
--   • E-posta doğrulanmış olmalı (0014 + auth ayarı).
--
-- Devir (v105): öğrenci bağı kaldırırsa kod üretilir, yeni hesap kodla bağlanır.
-- Bu göç yalnız ZEMİNİ kurar; devir akışı ayrı adımda eklenir.
-- Tekrar çalıştırmak zararsızdır (idempotent).
-- ============================================================

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.okulizyon_kimlik (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  kurumkodu    text not null,
  okul_no      text not null,
  ad_ozet      text,                       -- sha256(ad) — düz ad SAKLANMAZ
  durum        text not null default 'aktif',  -- aktif | birakildi
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint okulizyon_kimlik_durum_ck check (durum in ('aktif', 'birakildi'))
);

-- TEKİLLİK: aynı okul + okul no yalnız BİR aktif hesaba bağlı olabilir.
-- Kısmi indeks: bırakılmış kayıt yeni sahibine yer açar.
create unique index if not exists okulizyon_kimlik_tek
  on public.okulizyon_kimlik (kurumkodu, okul_no)
  where durum = 'aktif';

create index if not exists okulizyon_kimlik_user
  on public.okulizyon_kimlik (user_id);

-- ------------------------------------------------------------
-- RLS: kullanıcı yalnız KENDİ satırını okur. Yazma yolu YOK —
-- tabloya yalnız service_role (edge function) yazar.
-- ------------------------------------------------------------
alter table public.okulizyon_kimlik enable row level security;

drop policy if exists "okulizyon_kimlik_kendi" on public.okulizyon_kimlik;
create policy "okulizyon_kimlik_kendi" on public.okulizyon_kimlik
  for select to authenticated using (auth.uid() = user_id);

revoke all on public.okulizyon_kimlik from anon, authenticated;
grant select on public.okulizyon_kimlik to authenticated;
grant all on public.okulizyon_kimlik to service_role;

-- ------------------------------------------------------------
-- updated_at bakımı
-- ------------------------------------------------------------
create or replace function public.okulizyon_kimlik_dokun()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists okulizyon_kimlik_dokun_trg on public.okulizyon_kimlik;
create trigger okulizyon_kimlik_dokun_trg
  before update on public.okulizyon_kimlik
  for each row execute function public.okulizyon_kimlik_dokun();

revoke all on function public.okulizyon_kimlik_dokun() from public, anon, authenticated;

-- ------------------------------------------------------------
-- DENETİM
-- ------------------------------------------------------------
do $$
declare
  n_rls boolean;
  n_pol int;
  n_tekillik int;
begin
  select c.relrowsecurity into n_rls
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relname = 'okulizyon_kimlik';

  select count(*) into n_pol from pg_policies
  where schemaname = 'public' and tablename = 'okulizyon_kimlik';

  select count(*) into n_tekillik from pg_indexes
  where schemaname = 'public' and tablename = 'okulizyon_kimlik'
    and indexname = 'okulizyon_kimlik_tek';

  if n_rls is not true then raise exception 'v104: okulizyon_kimlik RLS kapalı'; end if;
  if n_pol < 1 then raise exception 'v104: okulizyon_kimlik politikası yok'; end if;
  if n_tekillik < 1 then raise exception 'v104: tekil indeks yok (bir no = tek hesap kuralı)'; end if;
  if has_table_privilege('anon', 'public.okulizyon_kimlik', 'SELECT') then
    raise exception 'v104: anon okulizyon_kimlik okuyabiliyor';
  end if;
  raise notice 'v104: okulizyon kimlik bağı hazır ✓ (RLS açık, tek no = tek hesap)';
end $$;
