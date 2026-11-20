# Rapor — v92 · Saf Şiir ayrı bir konu

**Tarih:** 18 Kasım 2026 · **Sürüm:** v92-saf-siir-ayri-konu
**Kullanıcı isteği:** "Uygulama normal şiir ile saf şiir karıştırıyor. Okulizyondan
gelen kazanımı saf şiire bağlamış ama saf şiir değil. Ders notuna bakıp saf şiirin
neyle bağlantılı olduğunu bul, ona göre düzenle. Çünkü saf şiir ayrı bir konu."

---

## 1) Sorun neydi?

Okulizyon'un şu kazanımı üç ayrı öğrencide de **"Saf Şiir"** konusuna yazılmıştı:

> "Şiirdeki mazmun, imge ve edebî sanatları belirleyerek bunların anlama katkısını
> değerlendirir."

Bu bir **genel şiir bilgisi** kazanımı. Saf şiir ise kendi başına bir konu
(öz şiir / simgecilik akımı). Uygulama ikisini karıştırıyordu.

## 2) Ders notu ne diyor?

Tek kaynak: `10 Edebiyat Ders notları Yeni Müfredat.pdf` (Mustafa Çiftçi) ve ondan
üretilen `docs/uretim/TDE-MUFREDAT-ILISKILERI.md`.

Saf Şiir'in ders notundaki bağlantıları:

| Konu | Bağ türü | Ders notundaki gerekçe |
|---|---|---|
| **Gazel** | karşıtı | "Saf şiir, gazelin kalıplaşmış **mazmun** dünyasına tepki olarak doğar." |
| Şiirde Ahenk | ön koşul | İmge ve çağrışım ahengin yanında ses/anlam örgüsünü kurar. |
| Paragraf | aynı beceri | Şiirde imge çözümleme ile paragrafta anlam aynı okuma becerisi. |
| Tanzimat Dönemi Şiiri | dönem | Tanzimat şiiri ile yeni Türk şiiri arasındaki değişim. |

Yani **"mazmun"** Saf Şiir'in değil, divan şiirinin (gazelin) terimi. Ders notu bunu
açıkça yazıyor: saf şiir, gazelin mazmun dünyasına **tepki** olarak doğmuştur.

## 3) Ne yapıldı?

### A. Eşleme kuralları düzeltildi

**Saf Şiir artık yalnızca adı/akımı geçen cümleye bağlanır:**

| Önce | Sonra |
|---|---|
| saf şiir · **imge** · **mazmun** · **edebî sanat** | saf şiir · öz şiir · simgecilik · sembolizm |

**Gazel** konusuna `mazmun` eklendi (divan şiirinin terimi).

Düzeltilen dosyalar:
- `site/konu-anahtar.js` — kural tablosu (Saf Şiir kuralı Gazel'den önce çalışır:
  cümlede hem "saf şiir" hem "mazmun" geçerse doğru cevap Saf Şiir'dir).
- `scripts/tde-kazanim-uret.js` — ayırt edici terim tablosu (üretici).
- `site/content/mufredat/tde_kazanim_10.json` — 92 terim; "imge" ve "edebî sanat"
  artık hiçbir konuya zorlanmıyor.
- `site/content/konu_esleme.json` — arama metinleri.
- `site/okz-tde-veri.js` — tarayıcı sözlüğü (`node scripts/tde-icerik-uret.js --sozluk`
  ile üretildi; PDF metni olmadan yalnız sözlük tazelenir).

### B. Eski önbellek yeni kuralı gölgeleyemiyor

Öğrenen sözlük (`kazanim_konu_cache`) bir cümleyi **yazıldığı günkü kuralla**
hatırlıyordu. Kural düzeltilse bile eski satır kazanıyordu. Artık:

- kaynak **"kural"** olan satır yerel kuralla çelişiyorsa **yerel kural kazanır**,
  önbellek tazelenir (`okzOnbellekEskidi`);
- **"elle" / "llm"** kayıtlarına dokunulmaz — onlar öğrenci kararı.

Canlı verideki bayat satır ayrıca silindi
(`supabase/migrations/0009_saf_siir_kazanim_onarim.sql`, canlıda uygulandı).

### C. Eski kayıtlar kendiliğinden düzeliyor

Uygulama açılışta `okzKonulariOnar` çalıştırıyor; Denemelerim'de daha önce
"Saf Şiir" yazılmış hata kayıtları yeni kuralla yeniden çözülüp düzeltiliyor.
Öğrenci verisine ayrıca dokunulmadı.

### D. Saf Şiir konusu silinmedi

30 konu duruyor; Saf Şiir kendi kartı, 10 soruluk havuzu ve 4 kazanım koduyla
(TDE2.1–TDE2.4, tema 2) yerinde. Yalnızca **yanlış gelen kazanım** artık oraya
düşmüyor.

## 4) Sonuç (canlı veriyle)

| Cümle | Önce | Sonra |
|---|---|---|
| "Şiirdeki mazmun, imge ve edebî sanatları belirleyerek…" | Saf Şiir | **Gazel** |
| "Saf şiirde imge ve mazmunu çözümler." | Saf Şiir | Saf Şiir |
| "Öz şiir anlayışını sürdüren şairleri sıralar." | — | Saf Şiir |
| "Sembolizmin şiir diline etkisini açıklar." | — | Saf Şiir |
| "Şiirde imgeleri belirler." | Saf Şiir | (tek konuya zorlanmaz) |

## 5) Test

- Yeni: `tests/v92-saf-siir-ayri-konu.test.js` — **46/46**
- Bütün takım: `NODE_PATH=/tmp/jsdom-deps/node_modules npm run -s test:hepsi` → **EXIT 0**
- Güncellenen testler: v64 (92 terim + vaka kontrolü), v70 (92 terim),
  v78 (tarihe bağlı bildirim testi saate duyarsız hâle getirildi),
  v90 (sürüm damgası "v91+")

## 6) Dosyalar

```
site/konu-anahtar.js
site/app-pwa.js
site/okz-tde-veri.js
site/sw.js                                  (CACHE v92)
site/content/konu_esleme.json
site/content/mufredat/tde_kazanim_10.json
scripts/tde-kazanim-uret.js
scripts/tde-icerik-uret.js                  (--sozluk kipi)
supabase/migrations/0009_saf_siir_kazanim_onarim.sql
tests/v92-saf-siir-ayri-konu.test.js
tests/dom/dom-v64-tde-kazanim.test.js
tests/dom/dom-v70-uc-asama.test.js
tests/v78-kalan-duzeltmeler.test.js
tests/v90-bildirim-ikon-baslik.test.js
docs/uretim/TDE-MUFREDAT-ILISKILERI.md
docs/uretim/TUM-KAZANIMLAR-10SINIF.md
package.json
```

Commit: `17e7d60` · Yayın: bu raporun eklendiği sürümde `dpl_91LXE6Hwy5x7T9mdtqHLbcnC2rfH`
(Vercel production, `analiz-merkezi.vercel.app`).
