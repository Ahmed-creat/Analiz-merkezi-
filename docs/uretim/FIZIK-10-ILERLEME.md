# Fizik 10 — ilerleme ve kanıt defteri

Tarih: 2026-11-16 · Dal: `arena/4cc1805b-analiz-merkezi`
Kural: her cümle ders kitabının kendi metnine ve sayfasına bağlıdır (NotebookLM kuralı).
Kaynak metin: `kitap-kaynak` dalındaki `fizik.json` (353 sayfa, kitabın basılı sayfa numaraları).

---

## 1) Bu turda BİTEN iş — 1. Ünite (Kuvvet ve Hareket)

Kitabın içindekiler (s.7-8) 1. üniteyi şöyle bölüyor:

| Kitap başlığı | Basılı sayfa |
|---|---|
| 1.1. Sabit Hızlı Hareket | 16 |
| 1.2. Bir Boyutta Sabit İvmeli Hareket | 33 |
| A) İvme ve Hız Değişimi Arasındaki İlişki | 33 |
| B) Yatay Doğrultuda Sabit İvmeyle Hareket Eden Cisimlerin Hareketi | 43 |
| 1.3. Serbest Düşme | 60 |
| A) Düşey Doğrultuda Cisimlerin Sahip Olduğu İvme | 60 |
| B) Serbest Düşme Hareketi | 67 |
| 1.4. İki Boyutta Sabit İvmeli Hareket | 78 |

Bu yapıya göre **müfredat ağacı alt konulara ayrıldı** (21 konu → 23 konu):

```
1.1 Sabit Hızlı Hareket
1.2.1 İvme ve Hız Değişimi Arasındaki İlişki
1.2.2 Yatay Doğrultuda Sabit İvmeyle Hareket Eden Cisimlerin Hareketi
1.3.1 Düşey Doğrultuda Cisimlerin Sahip Olduğu İvme
1.3.2 Serbest Düşme Hareketi
1.4 İki Boyutta Sabit İvmeli Hareket
```

### Sıfırdan yazılan 5 yeni havuz (50 soru)

| Havuz | Başlık | Kitap sayfası | Soru |
|---|---|---|---|
| `fizik_10_u01_k05` | 1.2.1 İvme ve Hız Değişimi Arasındaki İlişki | s.33-42 | 10 |
| `fizik_10_u01_k06` | 1.2.2 Yatay Doğrultuda Sabit İvmeyle Hareket Eden Cisimlerin Hareketi | s.43-59 | 10 |
| `fizik_10_u01_k07` | 1.3.1 Düşey Doğrultuda Cisimlerin Sahip Olduğu İvme | s.60-66 | 10 |
| `fizik_10_u01_k08` | 1.3.2 Serbest Düşme Hareketi | s.67-77 | 10 |
| `fizik_10_u01_k09` | 1.4 İki Boyutta Sabit İvmeli Hareket | s.78-94 | 10 |

Soruların dayandığı kitap içeriği (her soru `cozum` alanında sayfa veriyor):

- **s.34-37:** hız değişimi `Δv = v₂ − v₁`, ivme `a = Δv/Δt`, metro örneği (4 m/s² → 6. s'de 24 m/s),
  teslimat motosikleti tablosu (0-6-12-18-18-12 m/s → ivmeler 6,6,6,0,−6).
- **s.40:** 1.9. soru (K, L, M, N araçları; L için son hız 10 + (−2)·3 = 4 m/s).
- **s.49-52:** `v = v₀ + a·t`, `x = v₀·t + ½a·t²`, `Δx = (v+v₀)/2 · t`; koşucu örneği (12+36+60 = 108 m);
  değerlendirme sorusu v₀ = 2 m/s, a = 4 m/s² → 5. s'de v = 22 m/s, x = 60 m.
- **s.62-65:** yer çekimi ivmesi `g`, birimi m/s², yönü Dünya'nın merkezine, yeryüzüne yakın sabit;
  havasız ortamda pinpon/tenis/demir bilye aynı anda düşer; ardışık eşit sürelerde yollar h, 3h, 5h;
  Ay'da tüy ve çekiç deneyi.
- **s.66, 70-72:** kuyu sorusu (2,3 s → ≈26,5 m, ≈23 m/s), Feryal'in topu (20 m → 2 s, 20 m/s),
  Grafik 1.6 ve 1.8, tepe noktasında hız sıfır / ivme g.
- **s.81-82, 87:** yatay atışta `h = ½gt²` (süre yüksekliğe bağlı), menzil `x = v₀·t`,
  bileşenler `Aₓ = A·cosθ`, `A_y = A·sinθ`, `t_çıkış = v₀y/g`, `t_uçuş = 2v₀y/g`.

### Arşive taşınan eski havuzlar (silinmedi)

| Havuz | Neden |
|---|---|
| `fizik_10_u01_k02` (1.2 tek konu) | iki alt başlık tek havuzdaydı, yerine 1.2.1 + 1.2.2 yazıldı |
| `fizik_10_u01_k03` (1.3 tek konu) | yerine 1.3.1 + 1.3.2 yazıldı |
| `fizik_10_u01_k04` (1.4) | kitap sayfası künyesi yoktu, yerine s.78-94 havuzu yazıldı |

Konum: `arsiv/soru_havuzlari/fizik/`.

### Birlikte güncellenen yerler

1. `konular.js` + `pwa-files/functions/konular.js` — ağaç blokları birebir aynı.
2. `content/mufredat/konu_kayit_defteri.json` + `site/.../konu_kayit_defteri.json` — 21 → 23 fizik kaydı.
3. `content/iliski_grafi.json` + `pwa-files/content/iliski_grafi.json` — 163 düğüm / 156 kenar;
   alt konular arasına sıra bağı eklendi.
4. `site/content/konu_esleme.json` (154 havuz), `site/content/mufredat/kazanim_konu_10.json`,
   `site/okz-meb.js` (4 kazanım metni yeni konuya bağlandı), `site/konu-anahtar.js` (fizik kuralları).
5. `site/content/soru_havuzlari/index.json` (303 havuz / 3321 soru), `sw.js` önbellek listesi,
   `pwa-files/content/soru_havuzlari` kopyaları.
6. `scripts/meb-kazanim-uret.js` içindeki `ELLE` tablosu 5 yeni kimliğe göre yenilendi
   (yeniden üretim aynı sonucu versin).

### Betikler

```
node docs/uretim/uretim/fizik-t01b.js              # 5 havuzu yazar
node docs/uretim/uretim/fizik-konulari-guncelle.js # ağaç + defter + graf + PWA + sw.js
node docs/uretim/uretim/fizik-veri-esle.js         # kazanım/konu indeksleri + üretici ELLE tablosu
node scripts/havuz-index-uret.js --plan            # manşet
```

---

## 2) Kanıt (bu turda çalıştırıldı)

| Kapı | Komut | Sonuç |
|---|---|---|
| Havuz yapısı | `npm run -s test:pools` | 303 havuz / 3321 soru — geçti |
| Müfredat | `npm run -s test:curriculum` | geçti |
| BKT + panel | `npm run -s test:bkt` | panel 11/11 |
| Konu bulma | `npm run -s test:konubulma` | 76/76 (ağaç 191 konu) |
| Davranış paketi | `npm run -s test:davranis` | geçti |
| Okulizyon/kazanım | `npm run -s test:meb`, `test:ders` | 86/86 · 45/45 |
| Üretim planı | `npm run -s test:uretim` | 67/67 (158 çıktı) |
| TYMM çapraz | `npm run -s test:tymm` | 66/66 |
| Tüm paket | `npm run -s test:hepsi` | çıkış kodu 0 |
| Kimlik denetimi | `node scripts/validate-ids.js` | fizik 1-4. ünite havuzlarının hepsi defterde |
| Kaynak denetimi | `node docs/uretim/araclar/kaynak-denetle.js docs/uretim/.kitap-metin` | Fizik: kitap 27 · zip 18 · ağaçta havuzsuz konu 0 |

Kaynak denetiminin toplam görünümü (tüm dersler): **303 havuz** = kitap 180 · zip 121 · pdf 2.
Ağaç: 191 konu, havuzsuz konu yalnız 1 (TDE "Paragraf").

Bilinen, bu turda dokunulmayan kalem: `validate-ids` çıktısında `fiz_10_t*`, `mat_10_t0[5-7]*`,
`tar_10_t*` gibi **plan serisi** havuzlar kayıt defterinde yok (149 satır, önceden de vardı).

---

## 3) Fizikte ÜRETİLMEDİ listesi (18 havuz — sıradaki iş)

Bunlar hâlâ hazır paketten (`10. Sınıf fizik json.zip`) geliyor; kitaptan yeniden yazılacak.
Arşive ancak yerine kitap kaynaklı havuz yazıldıktan sonra taşınır.

| # | Havuz | Başlık | Kitapta sayfa |
|---|---|---|---|
| 1 | `fizik_10_u01_k01` | 1.1 Sabit Hızlı Hareket | 16-32 |
| 2 | `fizik_10_u02_k01` | 2.1 İş, Enerji ve Güç → **2.1.1 + 2.1.2** | 110 / 127 |
| 3 | `fizik_10_u02_k02` | 2.2 Enerji Biçimleri | 143-153 |
| 4 | `fizik_10_u02_k03` | 2.3 Mekanik Enerji | 154-170 |
| 5 | `fizik_10_u02_k04` | 2.4 Enerji Kaynakları | 171-186 |
| 6 | `fizik_10_u03_k01` | 3.1 Basit Elektrik Devreleri | 200-208 |
| 7 | `fizik_10_u03_k02` | 3.2 Elektrik Akımı | 209-214 |
| 8 | `fizik_10_u03_k03` | 3.3 Ohm Yasası | 215-222 |
| 9 | `fizik_10_u03_k04` | 3.4 Dirençlerin Bağlanması | 223-241 |
| 10 | `fizik_10_u03_k05` | 3.5 Üreteçlerin Bağlanması | 242-249 |
| 11 | `fizik_10_u03_k06` | 3.6 Elektrik Akımının Tehlikeleri | 250-253 |
| 12 | `fizik_10_u03_k07` | 3.7 Topraklamanın Önemi | 254-258 |
| 13 | `fizik_10_u04_k01` | 4.1 Dalgaların Temel Kavramları | 274-282 |
| 14 | `fizik_10_u04_k02` | 4.2 Dalgaların Sınıflandırılması | 283-290 |
| 15 | `fizik_10_u04_k03` | 4.3 Dalgaların Yayılma Süratini Etkileyen Etmenler | 291-299 |
| 16 | `fizik_10_u04_k04` | 4.4 Periyodik Hareketler | 300-308 |
| 17 | `fizik_10_u04_k05` | 4.5 Su Dalgalarında Yansıma ve Kırılma | 309-322 |
| 18 | `fizik_10_u04_k06` | 4.6 Rezonans ve Deprem → **4.6.1 + 4.6.2** | 323 / 332 |

Sıradaki adım: 1.1 + 2. ünite (1.1, 2.1.1, 2.1.2, 2.2, 2.3, 2.4 = 6 havuz, 60 soru),
sonra 3. ünite (7 havuz), sonra 4. ünite (7 havuz). Her ünitede aynı üç betik sırayla çalıştırılır.
