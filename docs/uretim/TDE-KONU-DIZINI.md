# TDE 10 — Konu Dizini (uygulama ağacı → kaynak sayfa)

> Bu dosya **elle** yazılır ve TDE soru üretiminin iş listesidir.
> Konu listesi uygulamanın kendi ağacından gelir: `konular.js` → `KONULAR["10"]["Türk Dili ve Edebiyatı"]` (30 konu).
> Uygulamadaki 30 havuz kimliği (`edebiyat_10_uNN_kNN`) bu sıraya birebir oturur; havuz kimlikleri **değiştirilmez**
> (Bilgi Bankası havuzu `topic_key`/başlıkla bulur, kimlik değişirse eski kayıtlar kopar).
> Hedef: her konu için **10 soru + 10 kart**, içerik ders notlarından.
> **Paragraf konusundan havuz üretilmez** (kullanıcı kararı: uygulamada paragraf sorusu sorulamıyor).
> Değiştirilen eski havuzlar silinmez, `arsiv/soru_havuzlari/edebiyat/` altına taşınır (bkz. `arsiv/README.md`).

## Kaynaklar

| Kısaltma | Kaynak | Not |
| --- | --- | --- |
| **DN** | `10.Edebiyat.Ders.notlari.Yeni.Mufredat.pdf` — 149 s., Mustafa Çiftçi | Ders kitabında doğrudan konu anlatımı yok; anlatım bu notlardan gelir. `kaynak` alanı: "10. sınıf TDE ders notları (Mustafa Çiftçi), s.X-Y". |
| **YK** | `828290274-Yazım-Kuralları-Konu-1.pdf` — 31 s., Mustafa Çiftçi (kullanıcı eki) | DN'de "Ek 1" yalnızca ad olarak geçiyor, içerik yok. |
| **Nİ** | `927924574-noktalama-işaretleri-konu.pdf` — 12 s., Mustafa Çiftçi (kullanıcı eki) | DN'de "Ek 2" yalnızca ad olarak geçiyor, içerik yok. |

PDF metinleri `docs/uretim/.kitap-metin/` altında (`edebiyat.json`, `yazim.json`, `noktalama.json`) — klasör `.gitignore`'da.
DN metninde font eşlemesi bozuk geldiği için şu dönüşüm uygulanır: `Ġ → İ`, `Ģ → ş`, `ġ → ş`, `\uf0b7 → •`.
Aksi hâlde "KoĢuk" gibi aramalar tutmaz.

## Konu listesi ve durum (30 havuz)

| # | konu_id | Konu (ağaçtaki ad) | Kaynak | Durum |
| --- | --- | --- | --- | --- |
| 1 | `edebiyat_10_u01_k01` | Koşuk | DN s.11-12 | ✅ 10+10 · `tde-t01.js` |
| 2 | `edebiyat_10_u01_k02` | Sav | DN s.12 | ✅ 10+10 · `tde-t01.js` |
| 3 | `edebiyat_10_u01_k03` | Türkü | DN s.14-15 | ✅ 10+10 · `tde-t01.js` |
| 4 | `edebiyat_10_u01_k04` | Koşma | DN s.17-18 | ✅ 10+10 · `tde-t01.js` |
| 5 | `edebiyat_10_u01_k05` | Masal | DN s.19-21 | ✅ 10+10 · `tde-t01.js` |
| 6 | `edebiyat_10_u01_k06` | İsimler (Adlar) | DN s.40-49 | ✅ 10+10 · `tde-t01-dil.js` |
| 7 | `edebiyat_10_u01_k07` | İsim Tamlamaları | DN s.46-48, 62-65 | ✅ 10+10 · `tde-t01-dil.js` |
| 8 | `edebiyat_10_u01_k08` | Sıfatlar (Ön Adlar) | DN s.50-61 | ✅ 10+10 · `tde-t01-dil.js` |
| 9 | `edebiyat_10_u01_k09` | Sıfat Tamlamaları | DN s.65-67 | ✅ 10+10 · `tde-t01-dil.js` |
| 10 | `edebiyat_10_u02_k01` | Gazel | DN s.74-75 | ✅ 10+10 · `tde-t02.js` |
| 11 | `edebiyat_10_u02_k02` | Kaside | DN s.75-77 | ✅ 10+10 · `tde-t02.js` |
| 12 | `edebiyat_10_u02_k03` | Mersiye | DN s.79 | ✅ 10+10 · `tde-t02.js` |
| 13 | `edebiyat_10_u02_k04` | Saf Şiir | DN s.79-85 | ✅ 10+10 · `tde-t02.js` |
| 14 | `edebiyat_10_u02_k05` | Zamir (Adıl) | DN s.92-98 | ✅ 10+10 · `tde-t02-dil.js` |
| 15 | `edebiyat_10_u02_k06` | Edat (İlgeç) | DN s.99-103 | ✅ 10+10 · `tde-t02-dil.js` |
| 16 | `edebiyat_10_u02_k07` | Bağlaç | DN s.104-107 | ✅ 10+10 · `tde-t02-dil.js` |
| 17 | `edebiyat_10_u02_k08` | Ünlem | DN s.108 | ✅ 10+10 · `tde-t02-dil.js` |
| 18 | `edebiyat_10_u02_k09` | Anlamına Göre Cümleler | DN s.68-70 | ✅ 10+10 · `tde-t02-dil.js` |
| 19 | `edebiyat_10_u03_k01` | Destan | DN s.110-116 | ✅ 10+10 · `tde-t03.js` |
| 20 | `edebiyat_10_u03_k02` | Mesnevi | DN s.117-118 | ✅ 10+10 · `tde-t03.js` |
| 21 | `edebiyat_10_u03_k03` | Halk Hikâyesi | DN s.118-121 | ✅ 10+10 · `tde-t03.js` |
| 22 | `edebiyat_10_u03_k04` | Fabl | DN s.121-122 | ✅ 10+10 · `tde-t03.js` |
| 23 | `edebiyat_10_u03_k05` | Zarflar (Belirteçler) | DN s.123-129 | ✅ 10+10 · `tde-t03-dil.js` |
| 24 | `edebiyat_10_u03_k06` | Şiirde Ahenk (Ölçü, Uyak, Redif, Aliterasyon, Asonans) | DN s.24-33 | ✅ 10+10 · `tde-t03-dil.js` |
| 25 | `edebiyat_10_u04_k01` | Dede Korkut Hikâyeleri | DN s.131-132 | ✅ 10+10 · `tde-t04.js` |
| 26 | `edebiyat_10_u04_k02` | Tanzimat Dönemi Şiiri | DN s.133 | ✅ 10+10 · `tde-t04.js` |
| 27 | `edebiyat_10_u04_k03` | Fiiller (Eylemler) | DN s.134-147 | ✅ 10+10 · `tde-t04.js` |
| 28 | `edebiyat_10_u04_k04` | Yazım Kuralları | **YK** s.1-31 | ✅ 10+10 · `tde-t04-yazim.js` |
| 29 | `edebiyat_10_u04_k05` | Noktalama İşaretleri | **Nİ** s.1-12 | ✅ 10+10 · `tde-t04-yazim.js` |
| 30 | `edebiyat_10_u04_k06` | Paragraf | — | ⛔ **havuz üretilmeyecek** (uygulamada paragraf sorusu sorulamıyor; eski havuz `arsiv/soru_havuzlari/edebiyat/` altında) |

Not: `konu_kayit_defteri.json` içinde ayrıca `muf_10_turk_dili_ve_edebiyat_01..29` kayıtları var; bunlar
aynı konuların müfredat kopyasıdır ve **havuz dosyası yoktur**. Havuzlar `edebiyat_10_uNN_kNN` kimliğiyle üretilir.

## Üretim kalıbı

```bash
node docs/uretim/uretim/tde-t0X.js                      # havuzları yazar
node docs/uretim/araclar/havuz-denetle.js --konu         # konu havuzu denetimi (yeni şemalılar)
node docs/uretim/araclar/kapsam-denetle.js --ders "Türk Dili ve Edebiyatı"
npm run -s validate:pools && npm run -s test:hepsi
node scripts/havuz-index-uret.js --plan
```

Her havuzda:
- `konu_id` = ağaçtaki kimlik; `baslik` + `topic_key` = ağaçtaki konu adı,
- `kazanim` = konu kazanımı (tek cümle), her soruda da aynı alan,
- 3 alt beceri, her beceriye en az 2 soru (4+3+3),
- 10 soru + 10 kart (1:1), kart önü "… nedir?" kalıbında, kart sorunun kopyası değil,
- `kaynak` = yukarıdaki tablodaki dosya + sayfa aralığı; `kaynak_dosya` = PDF adı.

Üretici: `docs/uretim/yazicilar/yaz.js` → `yazKonu()` (plan dışı konu havuzu yazar; `yaz()` plandaki 158 çıktı içindir).
