-- Analiz Merkezi — 0005: kazanım → konu ÖĞRENEN SÖZLÜK (kazanim_konu_cache)
-- ---------------------------------------------------------------------------
-- NEDEN
--   Okulizyon'un kazanım havuzu yayınevi serbest metnidir; MEB resmî çıktısıyla
--   birebir örtüşmez. Uygulama 3 aşamada çözer (bkz. site/okz-tde.js):
--     1) konu adı / anahtar kelime sözlüğü  (kaynak = 'kural')
--     2) genel beceri → Paragraf            (kaynak = 'genel')
--     3) vektör benzerliği                  (kaynak = 'vektor')
--   Aynı cümle her denemede tekrar geldiği için çözülen eşleşme buraya yazılır;
--   sonraki çözümde hiçbir aşama çalışmadan cevap bu tablodan gelir.
--
-- ANAHTAR
--   (ders, metin_norm) — metin_norm: küçük harf, Türkçe harfler ASCII'ye
--   indirgenmiş, noktalama atılmış, boşlukları sadeleştirilmiş cümle.
--   Aynı cümle iki farklı derste ayrı satır olur.
--
-- RLS
--   Okuma: tüm giriş yapmış kullanıcılar (ortak sözlük — herkes öğrenir).
--   Ekleme: olusturan = auth.uid() olmak zorunda.
--   Güncelleme: giriş yapmış herkes (ortak sözlük — upsert RLS'e takılmasın).
--   Silme: yalnız kendi satırı.
-- ---------------------------------------------------------------------------

create table if not exists public.kazanim_konu_cache (
  ders        text        not null default 'Türk Dili ve Edebiyatı',
  metin_norm  text        not null,
  konu        text        not null,
  topic_key   text,
  kaynak      text        not null default 'kural',
  guven       numeric(4,3) not null default 0.9,
  olusturan   uuid        references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint kazanim_konu_cache_pkey primary key (ders, metin_norm),
  constraint kazanim_konu_cache_kaynak_chk check (kaynak in ('kural', 'genel', 'vektor', 'elle', 'llm')),
  constraint kazanim_konu_cache_guven_chk check (guven >= 0 and guven <= 1)
);

comment on table public.kazanim_konu_cache is
  'Okulizyon kazanım cümlesi → uygulama konusu öğrenen sözlüğü (3 aşamalı eşleştirmenin kalıcı belleği)';
comment on column public.kazanim_konu_cache.metin_norm is
  'Normalize edilmiş kazanım cümlesi (küçük harf, ASCII, noktalama yok)';
comment on column public.kazanim_konu_cache.kaynak is
  'kural = sözlük/kural tablosu, genel = genel beceri (Paragraf), vektor = benzerlik, elle/llm = elle veya model';

-- Güncelleme zamanı
create or replace function public.kazanim_konu_cache_dokun()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists kazanim_konu_cache_dokun_trg on public.kazanim_konu_cache;
create trigger kazanim_konu_cache_dokun_trg
  before update on public.kazanim_konu_cache
  for each row execute function public.kazanim_konu_cache_dokun();

-- RLS
alter table public.kazanim_konu_cache enable row level security;

drop policy if exists kazanim_konu_cache_select_all on public.kazanim_konu_cache;
create policy kazanim_konu_cache_select_all
  on public.kazanim_konu_cache for select
  to authenticated
  using (true);

drop policy if exists kazanim_konu_cache_insert_own on public.kazanim_konu_cache;
create policy kazanim_konu_cache_insert_own
  on public.kazanim_konu_cache for insert
  to authenticated
  with check (auth.uid() = olusturan);

-- Sözlük ORTAKTIR: bir kullanıcının çözdüğü cümleyi diğer kullanıcı da
-- güncelleyebilmelidir (upsert, satır başkasına aitse RLS'e takılıyordu).
-- Bu yüzden güncelleme giriş yapmış herkese açık; silme yalnız kendi satırı.
drop policy if exists kazanim_konu_cache_update_own on public.kazanim_konu_cache;
drop policy if exists kazanim_konu_cache_update_ortak on public.kazanim_konu_cache;
create policy kazanim_konu_cache_update_ortak
  on public.kazanim_konu_cache for update
  to authenticated
  using (true)
  with check (guven >= 0 and guven <= 1);

drop policy if exists kazanim_konu_cache_delete_own on public.kazanim_konu_cache;
create policy kazanim_konu_cache_delete_own
  on public.kazanim_konu_cache for delete
  to authenticated
  using (auth.uid() = olusturan);

-- Yetkiler (Supabase varsayılanlarına ek olarak açıkça verilir)
grant select, insert, update, delete on public.kazanim_konu_cache to authenticated;
grant select on public.kazanim_konu_cache to anon;

-- Sorgu indeksleri
create index if not exists kazanim_konu_cache_ders_idx on public.kazanim_konu_cache (ders);
create index if not exists kazanim_konu_cache_konu_idx on public.kazanim_konu_cache (ders, konu);
create index if not exists kazanim_konu_cache_kaynak_idx on public.kazanim_konu_cache (kaynak);
