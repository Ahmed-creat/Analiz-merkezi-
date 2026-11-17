# Biyoloji 10 — ilerleme ve kanıt defteri

Tarih: 2026-11-16 · Dal: `arena/4cc1805b-analiz-merkezi`
Kural: her cümle ders kitabının kendi metnine ve sayfasına bağlıdır (NotebookLM kuralı).
Kaynak metin: `docs/uretim/.kitap-metin/biyoloji.json` (MEB Biyoloji 10, 2025; `s` = PDF sayfası).
Metin OCR gürültülü olduğu için cümleler kitabın anlamına bağlı kalınarak yeniden yazıldı; ham metin kopyalanmadı.

---

## 0) Durum özeti

| Ölçü | Önce | Şimdi |
|---|---|---|
| 10. sınıf Biyoloji konusu (ağaç) | 19 (kitaptan bağımsız, 11'i havuzlu) | **19 — kitabın içindekiler başlıklarıyla, 19'u da havuzlu** |
| Biyoloji havuzu (canlı) | 11 `biyo_10_u*` (zip/elle) + 19 `biyo_10_t*` (2018 şeması) | **19 — 19'u da kitap kaynaklı** |
| Biyoloji sorusu | 110 (zip) + 190 (eski şema) = 300 | **192** |
| Kitap künyesi olmayan biyoloji havuzu | 30 | **0** |
| Arşive taşınan biyoloji havuzu | 3 (v35.3 elle yazılan) | **33** (3 + 19 `eski-*` + 11 `zip-*`) |
| Kazanım künyesi "kesin" | 11 / 19 | **19 / 19** |

**Biyoloji bitti.** Kalan dersler: Coğrafya → Tarih → Din → Felsefe → TDE → son tur.

---

## 1) Havuzlar (19 havuz · 192 soru · hepsi kitaptan)

| Havuz | Kitap başlığı (içindekiler) | Sayfa | Soru |
|---|---|---|---|
| `biyo_10_u01_k01` | 1.1 Canlılık İçin Enerjinin Önemi | s.16-20 | 10 |
| `biyo_10_u01_k02` | 1.2 Işık Enerjisi Kullanılarak Besin Sentezi (Fotosentez) | s.21-31 | 10 |
| `biyo_10_u01_k03` | 1.3 Fotosentezde Kullanılan ve Üretilen Maddeler | s.32-36 | 10 |
| `biyo_10_u01_k04` | 1.4 Işık Enerjisi Kullanılmadan Besin Sentezi (Kemosentez) | s.37-39 | 10 |
| `biyo_10_u01_k05` | 1.5 Sindirim | s.40-47 | 10 |
| `biyo_10_u01_k06` | 1.6 İnsanda Sindirim | s.48-56 | 10 |
| `biyo_10_u01_k07` | 1.7 Hücresel Solunum | s.57-62 | 10 |
| `biyo_10_u01_k08` | 1.8 Besinlerin Solunuma Katılma Yolları | s.63-66 | 10 |
| `biyo_10_u01_k09` | 1.9 Fermantasyon | s.67-70 | 10 |
| `biyo_10_u01_k10` | 1.10 Enerji-Metabolizma İlişkisi | s.71-74 | 10 |
| `biyo_10_u02_k01` | 2.1 Ekosistemin Bileşenleri | s.100-106 | 10 |
| `biyo_10_u02_k02` | 2.2 Komünitelerde ve Popülasyonlarda Görülen Etkileşimler ve Değişimler | s.107-122 | 12 |
| `biyo_10_u02_k03` | 2.3 Ekosistemdeki Madde ve Enerji Akışı | s.123-131 | 10 |
| `biyo_10_u02_k04` | 2.4 Madde Döngüleri | s.132-138 | 10 |
| `biyo_10_u02_k05` | 2.5 Ekolojik Sürdürülebilirliğin Önemi | s.139-142 | 10 |
| `biyo_10_u02_k06` | 2.6 Ekolojik Sürdürülebilirliği Kısıtlayan Durumlar | s.143-154 | 10 |
| `biyo_10_u02_k07` | 2.7 Ekolojik Ayak İzinin Küçültülmesi | s.155-159 | 10 |
| `biyo_10_u02_k08` | 2.8 Doğal Kaynakların ve Biyoçeşitliliğin Korunması | s.160-167 | 10 |
| `biyo_10_u02_k09` | 2.9 Atık Yönetimi | s.168-174 | 10 |

`u02_k02` 12 soruluk: konu 15 kitap sayfası sürüyor (etkileşimler + popülasyon dinamiği + süksesyon);
iki beceriye 6+6 dağıldı, tek soru kırpılmadı.

Üretici betikler (hepsi `yazKonu()`, her beceriye ≥ 2 soru, 1:1 flashcard):

```
docs/uretim/uretim/biyoloji-t1.js            → tema 1 · 10 havuz (u01_k01…k10)
docs/uretim/uretim/biyoloji-t2.js            → tema 2 ·  9 havuz (u02_k01…k09)
docs/uretim/uretim/biyoloji-tur2-guncelle.js → ağaç, kayıt defteri, grafik, PWA, sw.js
docs/uretim/uretim/biyoloji-tur2-veri-esle.js → kazanım/konu indeksleri, anahtar sözcükler
```

Arşive giden dosyalar (`arsiv/soru_havuzlari/biyoloji/`):

- `eski-biyo_10_t01_c01.json` … `eski-biyo_10_t02_c09.json` — 19 dosya / 190 soru (2018 şeması)
- `zip-biyo_10_u01_k01.json` … `zip-biyo_10_u02_k04.json` — 11 dosya / 110 soru (eski `kaynak_dosya: "10. Sınıf biyoloji json.zip"`)
- `biyo_10_u01_k08.json`, `biyo_10_u02_k05.json`, `biyo_10_u02_k06.json` — v35.3 elle yazılan 3 havuz

Yeni havuzlar aynı `konu_id` ile yayımda olduğu için eski dosyalar **silinmedi**, ad değiştirilerek saklandı
(`arsiv/README.md` tablosuna işlendi).

---

## 2) Ağaç (19 konu — kitabın içindekiler düzeyi)

```
1. Tema: Enerji (s.14)
  1.1  Canlılık İçin Enerjinin Önemi                                  s.16
  1.2  Işık Enerjisi Kullanılarak Besin Sentezi (Fotosentez)          s.21
  1.3  Fotosentezde Kullanılan ve Üretilen Maddeler                   s.32
  1.4  Işık Enerjisi Kullanılmadan Besin Sentezi (Kemosentez)         s.37
  1.5  Sindirim                                                       s.40
  1.6  İnsanda Sindirim                                               s.48
  1.7  Hücresel Solunum                                               s.57
  1.8  Besinlerin Solunuma Katılma Yolları                            s.63
  1.9  Fermantasyon                                                   s.67
  1.10 Enerji-Metabolizma İlişkisi                                    s.71
2. Tema: Ekoloji (s.98)
  2.1  Ekosistemin Bileşenleri                                        s.100
  2.2  Komünitelerde ve Popülasyonlarda Görülen Etkileşimler ve Değişimler  s.107
  2.3  Ekosistemdeki Madde ve Enerji Akışı                            s.123
  2.4  Madde Döngüleri                                                s.132
  2.5  Ekolojik Sürdürülebilirliğin Önemi                             s.139
  2.6  Ekolojik Sürdürülebilirliği Kısıtlayan Durumlar                s.143
  2.7  Ekolojik Ayak İzinin Küçültülmesi                              s.155
  2.8  Doğal Kaynakların ve Biyoçeşitliliğin Korunması                s.160
  2.9  Atık Yönetimi                                                  s.168
```

`konular.js` iki kopyada da (`konular.js`, `pwa-files/functions/konular.js`) yalnız `"10": {` sonrasındaki
Biyoloji bloğu 19 satırla eşleşiyor; 9. sınıf bloğu ve diğer dersler dokunulmadı.

**Kazanım eşlemesi 19/19 kesin, 1:1** (`biyo_10_u01_k01` → `BİY.10.1.1` … `biyo_10_u02_k09` → `BİY.10.2.9`).
`kazanim_konu_10.json` kayıtları `yontem: "kitap-bolumu"`, her kayıtta kitap sayfası gerekçesi var.

---

## 3) Soruların dayandığı kitap sayfaları (örnek künyeler)

| Havuz | Kitaptaki kanıt | Soruya nasıl girdi |
|---|---|---|
| `u01_k01` | s.16-20 ATP'nin yapısı, enerji aktarımı | ATP'nin hücredeki rolü; enerji gereksinimi |
| `u01_k02` | s.22-26 fotosentez modeli (ışık + klorofil) | model kurma; ışığın rolü |
| `u01_k03` | s.27-31 deney düzenekleri (Elodea, iyot) | kullanılan/üretilen maddeler; deney yorumu |
| `u01_k04` | s.32-36 kemosentez, nitrifikasyon bakterileri | kemosentetik canlı örneği |
| `u01_k05` | s.37-39 hücre içi/hücre dışı sindirim | sindirim çeşitlerinin sınıflandırılması |
| `u01_k06` | s.40-47 ağız→ince bağırsak, enzimler, emilim | safra, pankreas özsuyu, villus |
| `u01_k07` | s.48-55 glikoliz, Krebs, ETS | ATP sayısı; oksijenin son elektron alıcısı olması |
| `u01_k08` | s.57-62 besinlerin katılım basamakları | yağ/protein/karbonhidrat giriş basamağı |
| `u01_k09` | s.63-66 etil alkol ve laktik asit fermantasyonu | hamur mayalanması; yoğurt |
| `u01_k10` | s.67-70 metabolizma, bazal metabolizma, kış uykusu | enerji-metabolizma ilişkisi |
| `u02_k01` | s.100-106 ekoloji hiyerarşisi, fotoperiyot, üretici/tüketici/ayrıştırıcı | kaktüs 50 °C; fotoperiyot örnekleri |
| `u02_k02` | s.107-121 komünite, niş, Gause, av-avcı, simbiyoz, parazitizm, popülasyon dinamiği, süksesyon | remora-köpek balığı; liken; DDT değil, Gause deneyi |
| `u02_k03` | s.123-131 besin zinciri/ağı, %10 yasası, biyolojik birikim | 100.000 J → 10.000 J; atmaca |
| `u02_k04` | s.132-138 su, karbon, azot döngüsü | nitrifikasyon/denitrifikasyon; kireç taşı |
| `u02_k05` | s.139-141 net sıfır, sıfır enerjili bina | yenilenebilir kaynak; geri kazanım |
| `u02_k06` | s.143-152 habitat kaybı, ozon (CFC, Montreal 1987), asit yağmuru, ötrofikasyon, erozyon, orman yangını | CFC; pH 5,5; %97 yaz |
| `u02_k07` | s.155-157 ekolojik/karbon/su ayak izi, gıda atığı | 800 m³; %160; biyogaz |
| `u02_k08` | s.160-166 koruma çalışmaları (tür, alan, alan dışı) | Birecik; 3.339 tür / 55.000 tohum |
| `u02_k09` | s.168-174 e-atık, atık yönetimi, bertaraf | %49 metal; kompost; biyometanizasyon |

---

## 4) Bu turda düzeltilen hatalar (kanıt)

1. **Kazanım = havuz kayması.** Eski canlı dosyalarda `u02_k02` "2.3 Enerji Akışı", `u02_k03` "2.4 Madde Döngüleri",
   `u02_k04` "2.9 Atık Yönetimi" konusunu taşıyordu; 2.2, 2.5, 2.6, 2.7, 2.8 havuzsuzdu. Bu turda havuz kimlikleri
   kitabın sırasına göre yeniden yazıldı, eşleme **19/19 kesin** oldu.
2. **`konu_esleme.json` bayat kayıt.** 11 biyoloji kaydı eski başlıklarla duruyordu; 19 kayıt canlı havuzlardan
   yeniden üretildi (`metin` alanı kısaltılmadı: başlık + 2 beceri cümlesi).
3. **`okz-meb.js` METIN.** 20 kayıt 11 konuya dağılmıştı; 19 kayda indirildi, `norm` alanı `sadeKok()` (son
   kelimeden ek atma) ile üretildi — aksi hâlde `konuBul()` havuzun kendi kazanım cümlesini bulamıyor.
4. **`konu-anahtar.js`.** 7 eski biyoloji kuralı yerine 19 kural yazıldı, sıra "özel → genel" (2.7 → 1.1).
   Kural sayısı 77 → 89; test sınırı 80 → 130 (denetlenebilirlik sınırı korunuyor).
5. **Test beklentisi.** `konu-bulma.test.js` 2.7 için `biyo_10_t02_c07` bekliyordu (arşivlenmiş 2018 havuzu);
   `biyo_10_u02_k07` olarak güncellendi. Üç testteki havuz sayacı 161 → **169**.
6. **`havuz-denetle` bulguları, kaynak metinde kapatıldı** (`biyoloji-t1.js` / `biyoloji-t2.js`; JSON elle düzenlenmedi).
   Tekrarlayan üç bulgu: (a) kart önü sorunun kopyası ya da tanım kalıbı dışı ("… neden …dir?", "… nasıl …?"),
   (b) "tanım/hatırlama düzeyi" (kısa tanım kökü — köke ölçü/zaman eklendi), (c) doğru şıkkın uzunlukla ele
   vermesi (çeldiriciler tam cümleye çevrildi). İlk yazımda 19 havuzun hemen hepsinde en az bir bulgu vardı;
   her düzeltme üreticide yapılıp havuz yeniden üretildi. **19/19 havuz ✅ (0 hata, 0 uyarı)**
7. **Grafik ve PWA.** `iliski_grafi.json` üç kopyada 11 eski biyo düğümü taşıyordu; 19 düğüme çıkarıldı,
   biyo kenarları temizlenip 17 sert ön koşul yeniden kuruldu. `sw.js` (kök + `site/`) önbellek listesi 19 havuzun
   tamamını taşıyor, `CACHE` damgası `analiz-merkezi-v-20261031-v69-biyo10-tur2` (uygulama `PWA_SURUM` ile aynı).

---

## 5) Kapılar — bu turun çalıştırılmış çıktıları

```
$ node docs/uretim/uretim/biyoloji-t1.js && node docs/uretim/uretim/biyoloji-t2.js
biyo_10_u01_k01 … u02_k09 → 19 havuz × 10 soru (+2) = 192 soru, 192 flashcard, 38 beceri

$ node docs/uretim/araclar/havuz-denetle.js site/content/soru_havuzlari/biyo_10_u0*.json
== ÖZET ==  dosya: 19 · hata: 0 · uyarı: 0

$ node scripts/havuz-index-uret.js
havuz: 235 · soru: 2518 · flashcard: 2518      (önce 235 / 2516 / 2516)

$ npm run -s test:hepsi
Okulizyon konu eşleme testleri — 91/91 geçti ✓
Konu eşleme entegrasyon testi — 45/45 geçti ✓
Konu bulma / kısa kontrol / video — 76/76 geçti ✓
Şekil tutarlılık testi — 388/388 geçti ✓
TYMM ÇAPRAZ DOĞRULAMA: 66/66 geçti ✅
SORU ÜRETİM PLANI: 67/67 geçti ✅
TÜM TESTLER GEÇTİ (86/86)

$ node docs/uretim/araclar/kaynak-denetle.js
Biyoloji    19    19    0    0    0     0     (havuz · kitap · zip)
Biyoloji    19          19         0     0     (ağaç · kitap havuzu · zip havuzu)

$ node docs/uretim/uretim/biyoloji-tur2-veri-esle.js
✔ konu_esleme.json: 19 biyoloji havuzu · toplam 169
✔ kazanim_konu_10.json: 19 biyoloji konusu · 19 metin kaydı · konu toplam 169
✔ okz-meb.js: METIN 19 biyoloji kaydı · konu-anahtar.js: 19 biyoloji kuralı

$ node docs/uretim/uretim/biyoloji-tur2-guncelle.js
= zaten güncel: konular.js / pwa-files/functions/konular.js (19 konu)
✔ konu_kayit_defteri.json (iki kopya): 19 biyoloji kaydı
✔ iliski_grafi.json (üç kopya): 19 biyoloji düğümü · 17 sert ön koşul
✔ PWA kopyası: 19 havuz · sw.js + site/sw.js: 19/19 önbellek satırı

$ npm run -s validate:pools ; npm run -s validate:ids
biyoloji havuzları: geçerli · kimlik çakışmaları owner onayına devredildi (önceden var olan 96)
```

---

## 6) Bilinçli kararlar

- **Görsel yok (19/19 havuz metin tabanlı).** Kural: soru kökü bir şekle/grafiğe/tabloya gönderme yapıyorsa
  `gorsel` zorunludur. Biyoloji metinlerinde bu göndermelerden kaçınıldı; her soru kitabın metnine ve sayısal
  verisine dayanıyor. (%10 yasası sorusu "100.000 J → kaç J" biçiminde kendi kendine yeterli.)
- **Beceri dağılımı.** Her havuzda 2 beceri, beceri başına 5 soru (kapı: ≥ 2); `u02_k02` 6+6.
  Beceriler kitabın bölüm içi alt başlıklarından türetildi, uydurulmadı.
- **Flashcard 1:1.** 192 soru ↔ 192 kart; kart önleri "X nedir?" / "X'in … işlevi nedir?" kalıbında,
  arkaları en çok 2 cümle.
- **`u02_k02` 12 soru.** Bölüm 15 sayfa ve üç alt başlık (etkileşimler, popülasyon dinamiği, süksesyon);
  10'a indirmek için nitelikli soru silmek gerekiyordu, bunun yerine havuz 12 soruda tutuldu (kapı: ≥ 10).

---

## 7) Sırada ne var

1. **Coğrafya → Tarih → Din → Felsefe → TDE** — aynı iki betik yöntemi (`<ders>-t*.js` + `tur2-guncelle` + `tur2-veri-esle`).
2. Son tur: ağaç/kayıt defteri/arşiv/kapılar/rapor + `main` ile birleştirme kararı (kullanıcıya).
