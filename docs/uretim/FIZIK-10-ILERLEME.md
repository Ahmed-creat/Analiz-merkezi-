# Fizik 10 — ilerleme ve kanıt defteri

Tarih: 2026-11-16 · Dal: `arena/4cc1805b-analiz-merkezi`
Kural: her cümle ders kitabının kendi metnine ve sayfasına bağlıdır (NotebookLM kuralı).
Kaynak metin: `kitap-kaynak` dalındaki `fizik.json` (353 sayfa; `s` = PDF sayfası = basılı sayfa + 1).

---

## 0) Durum özeti

| Ölçü | Önce | Şimdi |
|---|---|---|
| 10. sınıf Fizik konusu (ağaç) | 21 | **25** |
| Fizik havuzu (canlı) | 23 (5 kitap + 18 zip) | **25 — 25'i de kitap kaynaklı** |
| Fizik sorusu | 230 | **250** |
| Kitap künyesi olmayan fizik havuzu | 18 | **0** |
| Arşive taşınan eski fizik havuzu | 3 | **25** |

**Fizik bitti.** Kalan 8 derste aynı yöntem sırayla uygulanacak.

---

## 1) 1. tur — 1. Ünite (bitti, `d06e7b0`)

| Havuz | Başlık | Kitap sayfası | Soru |
|---|---|---|---|
| `fizik_10_u01_k05` | 1.2.1 İvme ve Hız Değişimi Arasındaki İlişki | s.33-42 | 10 |
| `fizik_10_u01_k06` | 1.2.2 Yatay Doğrultuda Sabit İvmeyle Hareket Eden Cisimlerin Hareketi | s.43-59 | 10 |
| `fizik_10_u01_k07` | 1.3.1 Düşey Doğrultuda Cisimlerin Sahip Olduğu İvme | s.60-66 | 10 |
| `fizik_10_u01_k08` | 1.3.2 Serbest Düşme Hareketi | s.67-77 | 10 |
| `fizik_10_u01_k09` | 1.4 İki Boyutta Sabit İvmeli Hareket | s.78-94 | 10 |

Arşive gidenler: `fizik_10_u01_k02`, `_k03`, `_k04`.

---

## 2) 2. tur — 1.1 ve 2-4. üniteler (bu tur)

### 2.1 Havuzlar (20 havuz, 200 soru — hepsi kitaptan)

| Havuz | Başlık | Kitap sayfası | Soru |
|---|---|---|---|
| `fizik_10_u01_k01` | 1.1 Sabit Hızlı Hareket | s.16-32 | 10 |
| `fizik_10_u02_k01` | 2.1.1 Kuvvet-Yer Değiştirme Grafiği Kullanılarak İş Kavramının Tanımlanması | s.110-126 | 10 |
| `fizik_10_u02_k05` | 2.1.2 İş, Enerji ve Güç Kavramları Arasındaki İlişki | s.127-142 | 10 |
| `fizik_10_u02_k02` | 2.2 Enerji Biçimleri | s.143-153 | 10 |
| `fizik_10_u02_k03` | 2.3 Mekanik Enerji | s.154-170 | 10 |
| `fizik_10_u02_k04` | 2.4 Enerji Kaynakları | s.171-186 | 10 |
| `fizik_10_u03_k01` | 3.1 Basit Elektrik Devreleri | s.200-208 | 10 |
| `fizik_10_u03_k02` | 3.2 Elektrik Akımı | s.209-214 | 10 |
| `fizik_10_u03_k03` | 3.3 Ohm Yasası | s.215-222 | 10 |
| `fizik_10_u03_k04` | 3.4 Dirençlerin Bağlanması | s.223-241 | 10 |
| `fizik_10_u03_k05` | 3.5 Üreteçlerin Bağlanması | s.242-249 | 10 |
| `fizik_10_u03_k06` | 3.6 Akımın Tehlikeleri ve Önlemler | s.250-253 | 10 |
| `fizik_10_u03_k07` | 3.7 Topraklamanın Önemi | s.254-258 | 10 |
| `fizik_10_u04_k01` | 4.1 Dalgaların Temel Kavramları | s.274-282 | 10 |
| `fizik_10_u04_k02` | 4.2 Dalgaların Sınıflandırılması | s.283-290 | 10 |
| `fizik_10_u04_k03` | 4.3 Yayılma Süratini Etkileyen Etmenler | s.291-299 | 10 |
| `fizik_10_u04_k04` | 4.4 Periyodik Hareketler | s.300-308 | 10 |
| `fizik_10_u04_k05` | 4.5 Su Dalgalarında Yansıma ve Kırılma | s.309-322 | 10 |
| `fizik_10_u04_k06` | 4.6.1 Rezonans ve Depremle İlgili Kavramlar | s.323-331 | 10 |
| `fizik_10_u04_k07` | 4.6.2 Depremle İlgili Bilimsel Model Oluşturabilme | s.332-338 | 10 |

Paket dosyaları (silinmedi, `arsiv/soru_havuzlari/fizik/` altında):
`eski-fizik_10_u01_k01`, `eski-fizik_10_u02_k01..k04`, `eski-fizik_10_u03_k01..k07`,
`eski-fizik_10_u04_k01..k06` (18 dosya) + 1. turun 3 dosyası + eski `fiz_10_t01_c01`
… `fiz_10_t04_c07` (22 dosya, eski "zip" kimlik şeması). Toplam **43 arşiv dosyası**.

### 2.2 Ağaç (25 konu — kitabın içindekiler düzeyi)

```
1.1 Sabit Hızlı Hareket
1.2.1 İvme ve Hız Değişimi Arasındaki İlişki
1.2.2 Yatay Doğrultuda Sabit İvmeyle Hareket Eden Cisimlerin Hareketi
1.3.1 Düşey Doğrultuda Cisimlerin Sahip Olduğu İvme
1.3.2 Serbest Düşme Hareketi
1.4 İki Boyutta Sabit İvmeli Hareket
2.1.1 Kuvvet-Yer Değiştirme Grafiği Kullanılarak İş Kavramının Tanımlanması
2.1.2 İş, Enerji ve Güç Kavramları Arasındaki İlişki
2.2 Enerji Biçimleri
2.3 Mekanik Enerji
2.4 Enerji Kaynakları
3.1 Basit Elektrik Devreleri
3.2 Elektrik Akımı
3.3 Ohm Yasası
3.4 Dirençlerin Bağlanması
3.5 Üreteçlerin Bağlanması
3.6 Elektrik Akımının Oluşturabileceği Tehlikelere Karşı Alınması Gereken Önlemler
3.7 Topraklamanın Önemi
4.1 Dalgaların Temel Kavramları
4.2 Dalgaların Sınıflandırılması
4.3 Dalgaların Yayılma Süratini Etkileyen Etmenler
4.4 Periyodik Hareketler
4.5 Su Dalgalarında Yansıma ve Kırılma
4.6.1 Rezonans ve Depremle İlgili Kavramlar
4.6.2 Depremle İlgili Bilimsel Model Oluşturabilme
```

Alt konuya ayrılan iki başlık: **2.1** (A: s.110-126, B: s.127-142) ve **4.6** (A: s.323-331, B: s.332-338).

### 2.3 Soruların dayandığı kitap sayfaları (örnek künyeler)

| Soru | Dayandığı sayfa |
|---|---|
| 1.1 · 12 m / 4 s bant sorusu | s.21 |
| 1.1 · 480 m, 5 ve 7 m/s karşılaşma | s.29 (kitabın 1.4. sorusu) |
| 2.1.1 · 20 N ve 3 m iş | s.116 |
| 2.1.2 · 62,5 kW ruhsat | s.134 |
| 2.1.2 · 5 ton / 3 m / 20 s → 7,5 kW | s.135 (kitabın 2.4. sorusu) |
| 2.2 · 300-700 nm görünür ışık | s.147 |
| 2.3 · 4 kg, 5 m → v = 10 m/s | s.168 |
| 2.4 · 1 kg uranyum 50.000 kWh | s.174 |
| 3.2 · 2 s'de 10·10¹⁹ elektron → 8 A | s.213 |
| 3.4 · 3-4-5 Ω seri, 6 A → 72 V | s.232 (kitabın 3.6. sorusu) |
| 3.4 · 12 V paralel kollar → 2 A + 4 A | s.235 |
| 3.5 · 10+15+20 = 45 V | s.245 |
| 3.7 · 220 V / 2000 Ω → 0,11 A | s.256 |
| 4.1 · 340 m/s ve 440 Hz → 0,77 m | s.281 |
| 4.3 · 4 cm ve 6 cm leğen sorusu | s.315 (kitabın 4.15. sorusu) |
| 4.4 · 10 cm → 0,6 s, 40 cm → 1,2 s | s.306 |
| 4.5 · yankı için en az 17 m | s.316 |
| 4.6.1 · Mercalli I-XII | s.327 |
| 4.6.2 · sismograf = yay + ağırlıklı çubuk + kalem | s.332 |

---

## 3) Bu turda düzeltilen iki hata (kanıt)

1. **Ağaç güncelleyici yanlış blok yazdı.** `konular.js` içinde 9. ve 10. sınıf için iki
   `"Fizik": [` bloğu var; betik ilkini (9. sınıf) değiştirdi. Düzeltildi: 9. sınıf
   20 konu, 10. sınıf 25 konu. Kanıt: `node -e` çıktısı — `9. sınıf fizik: 20 · 1.1 Fizik Bilimi`,
   `10. sınıf fizik: 25 · 2.1.1 …`. Betik artık yalnız `"10": {` sonrasındaki bloğu hedefliyor.
2. **Eski `fiz_10_t*` havuzları (22 dosya) hâlâ canlıydı.** Kimlik defterinde karşılıkları
   yoktu (`validate-ids`: “havuz konu_id defterde yok: fiz_10_t02_c01 …”). Arşive taşındı,
   PWA kopyaları ve `sw.js` listesi temizlendi, indeks 305 → 283 havuz oldu.

---

## 4) Kapılar — bu turun çalıştırılmış çıktıları

| Kapı | Sonuç |
|---|---|
| `npm run test:pools` | question-pools: 283 havuz / 3119 soru kontrolü başarılı |
| `npm run test:curriculum` | curriculum: 10. sınıf TDE ve Felsefe kontrolleri başarılı |
| `npm run test:bkt` | Öğrenme Durumu paneli 11/11 ✓ |
| `npm run test:konubulma` | Konu bulma / kısa kontrol / video — 76/76 ✓ |
| `npm run test:meb` | TÜM TESTLER GEÇTİ (86/86) |
| `npm run test:ders` | Okulizyon konu eşleme — 91/91 ✓ |
| `npm run test:uretim` | geçti |
| `npm run test:tymm` | geçti |
| `npm run test:davranis` | Şekil tutarlılık 360/360 · tüm davranış testleri ✓ |
| `npm run test:hepsi` | **TÜM TESTLER GEÇTİ**, çıkış kodu 0 |
| `node docs/uretim/araclar/kaynak-denetle.js …` | **HATALAR (0)** · Fizik 25/25 “kitap” |
| `npm run validate:pools` | tüm havuzlar geçerli |
| `node scripts/havuz-index-uret.js` | havuz 283 · soru 3119 · flashcard 3119 |

`validate:ids` çıktısı: fizik uyarısı **0** (25 havuzun 25'i defterde). Kalan 149 uyarı
başka derslerin `t*_c*` kimliklerine ait; bu turun kapsamı dışında ve bir sonraki
ders turlarında aynı yöntemle kapatılacak.

---

## 5) Sırada ne var

1. **Matematik** (21 konu, 10 havuzu zip kaynaklı) → kitaptan yeniden yazım.
2. **Kimya** (14 konu) → aynı yöntem.
3. Biyoloji + Coğrafya + Tarih → Din → Felsefe → TDE.
4. Tüm ağaç/kayıt defteri/arşiv/kapılar/rapor turu.

Her derste aynı üç betik kullanılacak: `xxx-tNN.js` (havuz yazıcı), `xxx-tur2-guncelle.js`
(ağaç + kayıt defteri + graf + PWA + `sw.js`), `xxx-tur2-veri-esle.js` (kazanım/konu indeksleri).
