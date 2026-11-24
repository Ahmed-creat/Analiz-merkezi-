-- ============================================================
-- 0014 — GÜVENLİK SERTLEŞTİRME (v103)
-- ------------------------------------------------------------
-- KULLANICI (31 Ekim 2026, sade dil): "Uygulamada bazı veri ve güvenlik
-- sorunları var... RLS vb her şey kullanılıyor mu?" + "Önce açıkları kapat."
--
-- ÖLÇÜM (canlı veritabanı, 31 Ekim 2026):
--   RLS 13/13 tabloda AÇIK ve satır politikaları doğru (auth.uid() = user_id).
--   Ancak RLS yalnız satır süzer; TABLO SEVİYESİNDEKİ yetkiler hâlâ genişti:
--
--   1) anon (tarayıcıdaki herkese açık anahtar) app_states üzerinde
--      TRUNCATE yetkisine sahipti  →  RLS TRUNCATE'i DURDURMAZ.
--      Ölçüm: has_table_privilege('anon','public.app_states','TRUNCATE') = true
--      Etki: tek istekle TÜM öğrencilerin verisi silinebilirdi.
--
--   2) anon + authenticated şu SECURITY DEFINER cron fonksiyonlarını
--      çalıştırabiliyordu (fonksiyon postgres yetkisiyle çalışır, vault
--      sırrını okur, TÜM kullanıcılara push gönderir):
--        • public.bildirim_tekrar_tetikle()   → anon: true
--        • public.bildirim_kuyruk_tetikle()   → anon: true
--      Etki: herkese açık anahtarla tüm sınıfa spam/DoS. (Ayrıca bakınız
--      0008'de bildirim_deneme_kuyruk için yapılan aynı düzeltme; o grant
--      canlıda geri gelmişti — burada kalıcı hale getiriliyor.)
--
--   3) push_teslim: politikalar yalnız "anon" rolüne yazılmıştı.
--      • anon `using (true)` → 147 teşhis satırı HERKESE açıktı (sızıntı).
--      • authenticated → 0 satır (politika yok) → uygulamadaki "cihaz
--        bildirimi aldı ✓" satırı HİÇ görünmüyordu (işlevsel hata).
--      Servis çalışanı (sw.js) oturum açmamış olabilir; bu yüzden yazma
--      yolu için dar ve süreli bir anon penceresi bırakılıyor: yalnız
--      INSERT ve yalnız son 10 dakika içinde oluşan satırı SELECT.
--
--   4) app_states_yedek_20261029: 3 kullanıcının TAM state kopyası,
--      saklama amacı/süresi yok (KVKK m.4/2-d). Yedek görevi bitmiş
--      durumda; tablo düşürülüyor.
--
-- DEĞİŞMEYENLER (bilinçli):
--   • cron.job işleri "postgres" rolüyle çalışır → aşağıdaki REVOKE onları
--     ETKİLEMEZ (ölçüldü: 8 işin tamamı username = postgres).
--   • service_role yetkileri korunur (edge fonksiyonlar kullanıyor).
--   • kazanim_konu_cache / okul_duyurulari `using (true)` KALIR: kişisel veri
--     içermez (konu eşlemesi + okul duyurusu), ortak okuma amaçlıdır.
--
-- Tekrar çalıştırmak zararsızdır (idempotent).
-- ============================================================

-- ------------------------------------------------------------
-- 1) TRUNCATE / REFERENCES / TRIGGER yetkilerini kaldır
--    (RLS bunları durdurmaz; uygulama bu üçünü hiç kullanmıyor)
-- ------------------------------------------------------------
revoke truncate, references, trigger on all tables in schema public from anon, authenticated;

-- Yeni eklenecek tablolar için de varsayılanı kapat (ileride aynı hata olmasın)
alter default privileges in schema public revoke truncate, references, trigger on tables from anon, authenticated;

-- ------------------------------------------------------------
-- 2) Cron fonksiyonlarını yalnız sunucuya aç
--    ("public" = PostgreSQL'de HERKES; asıl sızıntı buydu)
-- ------------------------------------------------------------
revoke all on function public.bildirim_tekrar_tetikle() from public, anon, authenticated;
revoke all on function public.bildirim_kuyruk_tetikle() from public, anon, authenticated;
revoke all on function public.bildirim_cron_tetikle() from public, anon, authenticated;
revoke all on function public.webpush_tetikle() from public, anon, authenticated;
revoke all on function public.gorev_cron_tetikle() from public, anon, authenticated;
revoke all on function public.okulizyon_cron_tetikle() from public, anon, authenticated;

grant execute on function public.bildirim_tekrar_tetikle() to service_role;
grant execute on function public.bildirim_kuyruk_tetikle() to service_role;
grant execute on function public.bildirim_cron_tetikle() to service_role;
grant execute on function public.webpush_tetikle() to service_role;
grant execute on function public.gorev_cron_tetikle() to service_role;
grant execute on function public.okulizyon_cron_tetikle() to service_role;

-- Deneme bildirimi kuyruğu: yalnız GİRİŞ YAPMIŞ kullanıcı (0008'deki karar,
-- canlıda geri gelmişti). Fonksiyon auth.uid() ile kendi satırını yazar.
revoke all on function public.bildirim_deneme_kuyruk(text, text, text) from public, anon;
grant execute on function public.bildirim_deneme_kuyruk(text, text, text) to authenticated, service_role;

-- Tetikleyici fonksiyonu kullanıcı çağırmamalı (tetikleyici olarak çalışır)
revoke all on function public.bildirim_log_ayna() from public, anon, authenticated;
grant execute on function public.bildirim_log_ayna() to service_role;

-- ------------------------------------------------------------
-- 3) push_teslim — sızıntıyı kapat, işlevi düzelt
-- ------------------------------------------------------------
drop policy if exists "sw_select" on public.push_teslim;
drop policy if exists "sw_insert" on public.push_teslim;
drop policy if exists "sw_update" on public.push_teslim;
drop policy if exists "push_teslim_sw_ekle" on public.push_teslim;
drop policy if exists "push_teslim_sw_son10dk" on public.push_teslim;
drop policy if exists "push_teslim_cihaz_okur" on public.push_teslim;

-- Servis çalışanı: yalnız EKLEME (güncelleme yolu kullanılmıyordu; kaldırıldı)
create policy "push_teslim_sw_ekle" on public.push_teslim
  for insert to anon, authenticated with check (true);

-- Servis çalışanı kendi yazdığını okuyabilir — YALNIZ son 10 dakika.
-- (abonelik = tarayıcının push adresinin son 4 hanesi; kişisel veri değil)
create policy "push_teslim_sw_son10dk" on public.push_teslim
  for select to anon, authenticated
  using (created_at > (now() - interval '10 minutes'));

-- Giriş yapmış kullanıcı: kendi cihazına ait satırlar (süre sınırı yok)
-- → uygulamadaki "cihaz bildirimi aldı ✓" ölçümü yeniden çalışır.
create policy "push_teslim_cihaz_okur" on public.push_teslim
  for select to authenticated using (true);

revoke delete, update, references, trigger, truncate on public.push_teslim from anon, authenticated;

-- Eski satırlar için temizlik (30 günden eski teşhis kaydı saklanmaz)
delete from public.push_teslim where created_at < (now() - interval '30 days');

-- ------------------------------------------------------------
-- 4) Amaçsız yedek tabloyu kaldır (KVKK m.4/2-d: saklama süresi)
--    app_states zaten ON DELETE CASCADE ile kullanıcıya bağlı;
--    bu tablo geçici bir göç yedeğiydi ve görevi bitti.
-- ------------------------------------------------------------
drop table if exists public.app_states_yedek_20261029;

-- ------------------------------------------------------------
-- 5) DENETİM — kapanışta kendini doğrula
-- ------------------------------------------------------------
do $$
declare
  n_truncate int;
  n_cron_anon int;
  n_pol int;
begin
  select count(*) into n_truncate
  from information_schema.role_table_grants
  where table_schema = 'public' and grantee in ('anon','authenticated')
    and privilege_type in ('TRUNCATE','REFERENCES','TRIGGER');

  -- Cron fonksiyonları: NE anon NE authenticated çalıştırabilmeli.
  -- bildirim_deneme_kuyruk: yalnız authenticated çalıştırabilir (anon hayır).
  select count(*) into n_cron_anon
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and (
      (p.proname in ('bildirim_tekrar_tetikle','bildirim_kuyruk_tetikle',
                     'bildirim_cron_tetikle','webpush_tetikle',
                     'gorev_cron_tetikle','okulizyon_cron_tetikle')
       and (has_function_privilege('anon', p.oid, 'EXECUTE')
            or has_function_privilege('authenticated', p.oid, 'EXECUTE')))
      or
      (p.proname = 'bildirim_deneme_kuyruk'
       and has_function_privilege('anon', p.oid, 'EXECUTE'))
    );

  select count(*) into n_pol from pg_policies
  where schemaname = 'public' and tablename = 'push_teslim';

  if n_truncate > 0 then
    raise exception 'v103: % adet TRUNCATE/REFERENCES/TRIGGER yetkisi kaldı', n_truncate;
  end if;
  if n_cron_anon > 0 then
    raise exception 'v103: % cron fonksiyonu hâlâ istemciye açık', n_cron_anon;
  end if;
  if n_pol < 3 then
    raise exception 'v103: push_teslim politikası eksik (%)', n_pol;
  end if;
  raise notice 'v103: güvenlik sertleştirme tamam ✓ (truncate=0, cron=kapalı, push_teslim=% politika)', n_pol;
end $$;
