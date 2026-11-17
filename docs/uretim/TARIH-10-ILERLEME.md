# Tarih 10 — ilerleme ve kanıt defteri (2. tur)

Tarih: 2026-11-16 · Dal: `arena/4cc1805b-analiz-merkezi`
Kural: her cümle ders kitabının kendi metnine ve sayfasına bağlıdır (NotebookLM kuralı).
Kaynak metin: `docs/uretim/.kitap-metin/tarih.json` (MEB Tarih 10, 2025), bölüm parçaları
`docs/uretim/.kitap-metin/t-1-1.txt` … `t-3-5.txt`; `s` = PDF sayfası, basılı sayfa = PDF − 1.
OCR gürültülü olduğu için cümleler kitabın anlamına bağlı kalınarak yeniden yazıldı; ham metin kopyalanmadı.

---

## 0) Durum özeti

| Ölçü | Önce | Şimdi |
|---|---|---|
| 10. sınıf Tarih konusu (ağaç) | 14 | **14 (değişmedi)** |
| Tarih havuzu (canlı) | 24 (`14 tar_10_t*` + `10 tarih_10_*`) | **14 — 14'ü de kitap kaynaklı** |
| Tarih sorusu | 272 (arşivlenen 24 havuz) | **140 (14 × 10)** |
| `kaynak_dosya` künyesi olan Tarih havuzu | 0 | **14** |
| Kazanım kodu eşlenen konu | 10 / 24 (eski kimlikler) | **14 / 14** |
| Görselli Tarih sorusu | 5 (arşive gitti) | **3** (`tablo`) — plan hedefi ≥ 14, bkz. §6 |
| Arşive taşınan Tarih havuzu | 2 | **26** (24 yeni `eski-*` + 2 önceden arşivde) |

**Tarih bitti.** Canlı havuz 233 → **214**, soru 2474 → **2252** (24 havuz / 272 soru arşive, 14 havuz / 140 soru canlıya).

---

## 1) Havuzlar (14 havuz · 140 soru · hepsi kitaptan)

| Havuz | Kitap başlığı (içindekiler) | Sayfa (basılı) | Soru | Görsel |
|---|---|---|---|---|
| `tar_10_u01_k01` | 1.1 Önemli Askerî Mücadelelerin Türk Tarihinin Seyrine Etkileri | s.12-33 | 10 | — |
| `tar_10_u01_k02` | 1.2 Türkistan'dan Türkiye'ye Türklerde Devlet ve Ordu Teşkilatları | s.34-49 | 10 | — |
| `tar_10_u01_k03` | 1.3 Türklerde Sosyoekonomik Hayat ve Şehirleşme | s.50-65 | 10 | — |
| `tar_10_u01_k04` | 1.4 Türk-İslam Medeniyetinde Bilim, Kültür, Eğitim ve Sanat | s.66-107 | 10 | — |
| `tar_10_u02_k05` | 2.1 Osmanlı Devleti'nin Kuruluşuna Dair Görüşler | s.110-121 | 10 | — |
| `tar_10_u02_k06` | 2.2 Beylikten Devlete Siyasi ve Askerî Gelişmeler | s.122-139 | 10 | — |
| `tar_10_u02_k07` | 2.3 Osmanlı Devleti'nde Ordu, Hukuk ve Toprak Sistemi | s.140-155 | 10 | — |
| `tar_10_u02_k08` | 2.4 Osmanlı Devleti'nin İskân ve İstimalet Politikası | s.156-171 | 10 | — |
| `tar_10_u02_k09` | 2.5 Osmanlı Devleti'nin İlim ve İrfan Geleneği | s.172-205 | 10 | — |
| `tar_10_u03_k10` | 3.1 Osmanlı Devleti'nin Cihan Devleti Hâline Gelmesi | s.208-234 | 10 | 1 tablo (antlaşmalar) |
| `tar_10_u03_k11` | 3.2 Osmanlı Devleti'nin Yönetim ve Ordu Yapısında Değişim | s.235-256 | 10 | — |
| `tar_10_u03_k12` | 3.3 Avrupalıların Sömürgeci Politikaları | s.257-269 | 10 | — |
| `tar_10_u03_k13` | 3.4 Osmanlı Devleti'nde İsyanlar | s.270-283 | 10 | 1 tablo (Tağşiş, Tablo 3.6) |
| `tar_10_u03_k14` | 3.5 Osmanlı Devleti'nde Bilim, Kültür, Eğitim ve Sanat | s.284-317 | 10 | 1 tablo (eser-kişi-alan) |

Havuz başına: 10 soru · 10 flashcard (1:1) · 2 beceri × 5 soru · şık dağılımı 2/3/2/3.

Üretici betikler:

```
docs/uretim/uretim/tarih-t1.js              → 14 yazKonu() çağrısı (k01…k14)
docs/uretim/uretim/tarih-tur2-guncelle.js   → ağaç, kayıt defteri, topic_key, ilişki grafiği, PWA, sw.js
scripts/havuz-index-uret.js                 → index.json (214 havuz)
scripts/konu-esleme-uret.js                 → konu_esleme.json (214 havuz)
```

`tarih-tur2-guncelle.js` idempotent: ikinci çalıştırmada `+0 düğüm / +0 kenar / +0 satır` verir.

Arşive giden dosyalar (`arsiv/soru_havuzlari/tarih/`):

- `eski-tar_10_t01_c01.json` … `eski-tar_10_t03_c05.json` — 14 dosya / 140 soru (2018 şeması, kitap künyesi yok)
- `eski-tarih_10_u01_k01.json` … `eski-tarih_10_u03_k05.json` — 10 dosya / 132 soru (elle yazılmış, kitapsız)
- Önceden arşivde duran `tarih_10_u01_k04.json` (10) ve `tarih_10_u02_k05.json` (10) olduğu gibi kaldı.
- Hiçbir dosya silinmedi (plan §9); canlı dizinden `git mv` ile taşındı, `eski-` öneki verildi.

---

## 2) Ağaç (14 konu — kitabın içindekiler düzeyi)

```
1. Ünite: Türkistan'dan Türkiye'ye (1040-1299)
  1.1  Önemli Askerî Mücadelelerin Türk Tarihinin Seyrine Etkileri   s.12
  1.2  Türkistan'dan Türkiye'ye Türklerde Devlet ve Ordu Teşkilatları s.34
  1.3  Türklerde Sosyoekonomik Hayat ve Şehirleşme                    s.50
  1.4  Türk-İslam Medeniyetinde Bilim, Kültür, Eğitim ve Sanat        s.66
2. Ünite: Beylikten Devlete
  2.1  Osmanlı Devleti'nin Kuruluşuna Dair Görüşler                   s.110
  2.2  Beylikten Devlete Siyasi ve Askerî Gelişmeler                  s.122
  2.3  Osmanlı Devleti'nde Ordu, Hukuk ve Toprak Sistemi              s.140
  2.4  Osmanlı Devleti'nin İskân ve İstimalet Politikası              s.156
  2.5  Osmanlı Devleti'nin İlim ve İrfan Geleneği                     s.172
3. Ünite: Cihan Devleti (1453-1683)
  3.1  Osmanlı Devleti'nin Cihan Devleti Hâline Gelmesi               s.208
  3.2  Osmanlı Devleti'nin Yönetim ve Ordu Yapısında Değişim          s.235
  3.3  Avrupalıların Sömürgeci Politikaları                           s.257
  3.4  Osmanlı Devleti'nde İsyanlar                                   s.270
  3.5  Osmanlı Devleti'nde Bilim, Kültür, Eğitim ve Sanat             s.284
```

`konular.js` ve `pwa-files/functions/konular.js` içinde yalnız `"10": {` sonrasındaki Tarih bloğu
14 satırla eşleşiyor; 9. sınıf bloğu ve diğer dersler dokunulmadı. 14 havuzun 3'ü (2.3, 3.2, 3.4)
bu turda ağaç başlığına göre yeniden adlandırıldı (`baslik` ve `topic_key` = `Tarih > <ağaç başlığı>`).

---

## 3) Kazanım eşlemesi

`site/content/mufredat/kazanim_konu_10.json` içinde Tarih: **14 konu ↔ 14 resmî çıktı**, `yok: 0`.

| Kod | Havuz | Güven |
|---|---|---|
| TAR.10.1.1 → TAR.10.1.4 | `tar_10_u01_k01` … `k04` | 1.1-1.3 kesin (arşivden devralınan kazanım-metni kanıtı), 1.4 kesin |
| TAR.10.2.1 → TAR.10.2.5 | `tar_10_u02_k05` … `k09` | 2.1 ve 2.3 kesin; 2.2, 2.4, 2.5 yapısal |
| TAR.10.3.1 → TAR.10.3.5 | `tar_10_u03_k10` … `k14` | 3.1-3.5 kesin |

Toplam 11 kesin + 3 yapısal. 10 konunun kesin kanıtı eski `tarih_10_*` kayıtlarından yeni `konu_id`'lere
taşındı (aynı başlık, aynı çıktı); kodlar 1:1 dağıtıldı, ortak kod bırakılmadı.

`scripts/konu-esleme-uret.js` bu turda **resmî MEB kazanım cümlelerini arama metnine** katacak şekilde
genişletildi (`kazanim_konu_10.json` + `meb_kazanim_10.json`). Gerekçe: havuzlar tur-2'de yeniden
yazıldığı için `konu_esleme.json` 176 havuzda kalmıştı ve yalnız başlık sözcükleriyle eşleşiyordu;
Okulizyon kazanım metniyle eşleşme güveni düşüyordu (`tests/okz-konu.test.js` 2 test kırılıyordu).
Artık 214 havuzun tamamı hem havuz verisini hem resmî çıktı cümlesini taşıyor.

---

## 4) Doğrulama (bu turda çalıştırılan kapılar)

| Kapı | Komut | Sonuç |
|---|---|---|
| Havuz denetimi | `node docs/uretim/araclar/havuz-denetle.js site/content/soru_havuzlari/tar_10_u0*_k*.json` | 14 dosya · **0 hata · 0 uyarı** |
| Şema | `npm run -s validate:pools` | **çıkış 0** (214 havuz geçerli) |
| Kimlik | `npm run -s validate:ids` | Tarih satırı **yok**; 77 kimlik çakışması owner onayında (Din/Felsefe/TDE — bu turun dışı) |
| Kaynak | `node docs/uretim/araclar/kaynak-denetle.js` | `Tarih 14 · 14 kitap kaynaklı · 0 kitapsız · 0 eksik` |
| Testler | `npm run -s test:hepsi` | **TÜM TESTLER GEÇTİ** (86/86 meb-kazanim, 91/91 okz-konu dahil) |

Denetim notları: dört havuzun başlığı ağaçla birebir eşleşmiyordu — 2.4 (`İstimâlet` yazımı),
3.4 (`… ve Merkezî Otoritenin Sarsılması` eki), 2.3 ve 3.2 (sözcük sırası) → üreticide ağaç
başlığına çevrildi, `topic_key` eşitlendi. Kopya/şık dengesi uyarıları üretim sırasında üreticide giderildi; JSON elle düzenlenmedi.

---

## 5) Tur kapanışında güncellenen dosyalar

| Dosya | Değişiklik |
|---|---|
| `site/content/soru_havuzlari/index.json` | 233/2474 → **214 havuz / 2252 soru / 2252 kart** |
| `site/content/konu_esleme.json` | 176 → **214 havuz**, resmî kazanım cümleleri eklendi (134,5 KB) |
| `site/content/mufredat/kazanim_konu_10.json` | Tarih 10 eski kimlik → **14 yeni kimlik**, ozet 180 konu |
| `content|site/content/mufredat/konu_kayit_defteri.json` | `tar_10_*`/`tarih_10_*` kayıtları atıldı, 14 `tar_10_u*` kaydı yazıldı |
| `content|site/content|pwa-files/content/iliski_grafi.json` | +14 düğüm, −10 eski düğüm, +13 `SERT_ONKOSUL` kenarı (1.1→…→3.5 zinciri) |
| `pwa-files/content/soru_havuzlari/*` | 10 arşiv kopyası silindi, 14 yeni havuz + `index.json` kopyalandı |
| `sw.js`, `site/sw.js` | Önbellek listesi 214 havuzla **1:1**; sürüm `v69-tarih10-tur2` |
| `site/app-pwa.js` | `PWA_SURUM = "v69-tarih10-tur2"` |
| `tests/meb-kazanim.test.js` | havuz/konu sayacı **180** |
| `tests/okz-konu.test.js`, `tests/okz-konu-entegrasyon.test.js` | indeks sayacı **214** |

Pano (`docs/uretim/DURUM.md`, `node docs/uretim/araclar/durum.js`):
TDE 29/29 · Mat 13/21 · Fiz 20/22 · Kim 20/21 · Biyo 19/19 · **Tarih 14/14** · Coğ 14/18 ·
Fel 10/10 · Din 17/17 → **156/171 · 1673/1788 · görselli 59**.

---

## 6) Bilinen eksik / sonraki tur

1. **Görselli oran:** Tarih 3/140 = %2; plan §"Oran hedefi" ders genelinde ≥ %10 istiyor.
   Kitapta hazır veri var (Harita 3.1-3.6, Grafik 3.1 gelir-gider, Tablo 3.5 köle ticareti,
   Tablo 3.6 tağşiş, s.286-298 bilgi görselleri) → 11 tablo/harita/grafik sorusu eklenmeli.
   Uydurma görsel konmadı; yalnız metne dayanan 3 tablo eklendi.
2. **Coğrafya 14/18:** plan 18 konu, panoda 4 havuz eşleşmiyor (bu turun dışı, ayrı iş).
3. **`validate:ids` 77 kimlik çakışması:** Din/Felsefe/TDE eski kimlikleri owner onayı bekliyor.
