-- ============================================================
-- 0009 — SAF ŞİİR AYRI BİR KONUDUR (v92)
-- ------------------------------------------------------------
-- KULLANICI (18 Kas): "Uygulama normal şiir ile saf şiir
-- karıştırıyor. Okulizyondan gelen kazanımı saf şiire bağlamış
-- ama saf şiir değil. … Çünkü saf şiir ayrı bir konu."
--
-- SORUN
--   Okulizyon'un "Şiirdeki mazmun, imge ve edebî sanatları
--   belirleyerek bunların anlama katkısını değerlendirir."
--   kazanımı, ayırt edici terim listesinde "imge / mazmun /
--   edebî sanat" Saf Şiir'e yazıldığı için 3 kullanıcıda da
--   "Saf Şiir" konusuna düşmüştü.
--
-- DÜZELTME (v92, kod tarafı)
--   • Saf Şiir yalnızca adı/akımı geçen cümleye bağlanır:
--     saf şiir · öz şiir · simgecilik · sembolizm
--   • "mazmun" divan şiirinin terimidir (ders notu: "saf şiir,
--     gazelin kalıplaşmış mazmun dünyasına tepki olarak doğar")
--     → Gazel konusuna bağlandı.
--   • Uygulama, "kural" kaynaklı bayat önbellek satırını yerel
--     kuralla çeliştiğinde yok sayar (okzOnbellekEskidi).
--
-- BU DOSYA
--   Eski sürümün yazdığı ve artık yanlış olan Saf Şiir satırlarını
--   siler. Öğrenci verisine (app_states) DOKUNMAZ; uygulama
--   açılışta okzKonulariOnar ile eski kayıtları kendisi düzeltir.
--   Tekrar çalıştırmak zararsızdır (idempotent).
-- ============================================================

delete from public.kazanim_konu_cache
where konu = 'Saf Şiir'
  and metin_norm not like '%saf siir%'
  and metin_norm not like '%oz siir%'
  and metin_norm not like '%simgeci%'
  and metin_norm not like '%semboliz%';

-- Kontrol: Saf Şiir'de kalan satırların hepsi gerçekten Saf Şiir olmalı.
do $$
declare
  kalan int;
begin
  select count(*) into kalan
  from public.kazanim_konu_cache
  where konu = 'Saf Şiir'
    and metin_norm not like '%saf siir%'
    and metin_norm not like '%oz siir%'
    and metin_norm not like '%simgeci%'
    and metin_norm not like '%semboliz%';

  if kalan > 0 then
    raise exception 'Saf Şiir önbelleğinde % bayat satır kaldı', kalan;
  end if;
end $$;
