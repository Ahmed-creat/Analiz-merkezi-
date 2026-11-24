-- Analiz Merkezi PWA — Supabase şeması (Vercel yayını ile birlikte)
grant usage on schema public to anon, authenticated;

create table if not exists public.app_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  grade text,
  deneme_sayisi integer not null default 0,
  updated_at timestamptz not null default now()
);
comment on table public.app_states is 'Kullanıcı başına tek satır bulut yedeği (localStorage state JSON)';

alter table public.app_states enable row level security;

create policy app_states_select_own on public.app_states for select to authenticated using (auth.uid() = user_id);
create policy app_states_insert_own on public.app_states for insert to authenticated with check (auth.uid() = user_id);
create policy app_states_update_own on public.app_states for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy app_states_delete_own on public.app_states for delete to authenticated using (auth.uid() = user_id);

create table if not exists public.fcm_tokens (
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null,
  platform text,
  updated_at timestamptz not null default now(),
  primary key (user_id, token)
);
comment on table public.fcm_tokens is 'Bildirim göndermek için kullanıcıya bağlı FCM cihaz tokenları';

alter table public.fcm_tokens enable row level security;

create policy fcm_tokens_select_own on public.fcm_tokens for select to authenticated using (auth.uid() = user_id);
create policy fcm_tokens_insert_own on public.fcm_tokens for insert to authenticated with check (auth.uid() = user_id);
create policy fcm_tokens_update_own on public.fcm_tokens for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy fcm_tokens_delete_own on public.fcm_tokens for delete to authenticated using (auth.uid() = user_id);

create table if not exists public.okulizyon_kuyrugu (
  user_id uuid primary key references auth.users(id) on delete cascade,
  exams jsonb not null default '[]'::jsonb,
  pulled_at timestamptz not null default now()
);
comment on table public.okulizyon_kuyrugu is 'Okulizyon çekim servisinin kullanıcıya bıraktığı sınav kuyruğu';

alter table public.okulizyon_kuyrugu enable row level security;

create policy okulizyon_kuyrugu_select_own on public.okulizyon_kuyrugu for select to authenticated using (auth.uid() = user_id);
create policy okulizyon_kuyrugu_insert_own on public.okulizyon_kuyrugu for insert to authenticated with check (auth.uid() = user_id);
create policy okulizyon_kuyrugu_update_own on public.okulizyon_kuyrugu for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.okul_duyurulari (
  id bigint generated always as identity primary key,
  baslik text not null,
  tarih date,
  url text,
  lesson text,
  created_at timestamptz not null default now()
);
comment on table public.okul_duyurulari is 'Okul sitesinden çekilen sınav duyuruları (herkese açık okuma)';

alter table public.okul_duyurulari enable row level security;

create policy okul_duyurulari_select_all on public.okul_duyurulari for select to authenticated using (true);

create index if not exists app_states_updated_at_idx on public.app_states (updated_at desc);
create index if not exists okul_duyurulari_created_at_idx on public.okul_duyurulari (created_at desc);
