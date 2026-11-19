-- ============================================================
-- 0012 — MAZMUN: GAZEL DEĞİL, SÖZ SANATLARI → ŞİİRDE AHENK (v94)
-- ------------------------------------------------------------
-- KULLANICI (19 Kasım):
--   "O gazele bağladığın mazmun içeren kazanım varya aslında söz
--    sanatları ile ilgiliymiş. Sen bu kazanımı şiirde ahenk e bağla."
--
-- SORUN
--   Okulizyon'un "Şiirdeki mazmun, imge ve edebî sanatları belirleyerek
--   bunların anlama katkısını değerlendirir." kazanımı v92'de Gazel'e
--   bağlanmıştı (mazmun = divan şiirinin kalıplaşmış imge dünyası diye).
--   Kullanıcı düzeltmesi: kazanım gazelin BİÇİM bilgisi (matla/makta/
--   aruz) değil, SÖZ SANATLARI bilgisidir → doğru konu Şiirde Ahenk.
--
-- DÜZELTME (v94, kod tarafı)
--   • "mazmun" Gazel'in ayırt edici terimlerinden ÇIKARILDI,
--     Şiirde Ahenk'in terimlerine eklendi (terim sayısı 92 → 92).
--   • konu-anahtar.js: Gazel deseninden mazmun çıktı; Şiirde Ahenk
--     desenine mazmun | edebî sanat | söz sanatı eklendi.
--   • Uygulama, "kural" kaynaklı bayat önbellek satırını yerel kuralla
--     çeliştiğinde yok sayar (okzOnbellekEskidi) ve tazeler.
--
-- BU DOSYA
--   Yalnızca OTOMATİK ("kural") ve mazmun içeren bayat önbellek satırını
--   siler. Elle/LLM kayıtları (öğrenci kararı) KORUNUR; app_states'e
--   dokunulmaz — uygulama açılışta okzKonulariOnar ile eski deneme
--   kayıtlarının konusunu kendisi düzeltir.
--   Tekrar çalıştırmak zararsızdır (idempotent).
-- ============================================================

delete from public.kazanim_konu_cache
where metin_norm like '%mazmun%'
  and kaynak = 'kural'
  and konu <> 'Şiirde Ahenk (Ölçü, Uyak, Redif, Aliterasyon, Asonans)';

-- Kontrol: mazmun geçen satırlar ya yok ya da doğru konuda olmalı.
do $$
declare
  kalan int;
begin
  select count(*) into kalan
  from public.kazanim_konu_cache
  where metin_norm like '%mazmun%'
    and kaynak = 'kural'
    and konu <> 'Şiirde Ahenk (Ölçü, Uyak, Redif, Aliterasyon, Asonans)';

  if kalan > 0 then
    raise exception 'mazmun önbelleğinde % bayat satır kaldı', kalan;
  end if;
end $$;
