# MEB Resmî Kazanım (Öğrenme Çıktısı) Tabloları → Uygulama Konuları

**Tarih:** 27 Ekim 2026 · **Sürüm:** `2026-10-27`
**Sorun:** Okulizyon yanlış/boş soruların konusunu **kazanım metni** olarak veriyor; uygulama
**konu başlığı** kullanıyor. İkisi birebir eşleşmediği için aynı konu iki kayıt gibi görünüyordu.
**İstenen:** "MEB hangi dersin hangi konusunda hangi kazanım var paylaşıyor" → kazanımı **resmî
tabloya** bağlamak, tahminle değil kanıtla.

---

## 1. Bulunan resmî kaynaklar

Türkiye Yüzyılı Maarif Modeli (TYMM) **2026** ortaöğretim programları, MEB Talim ve Terbiye
Kurulu Başkanlığı:

| Ders | Program (PID) | Resmî PDF |
|---|---|---|
| Biyoloji (9-12) | 2250 | `Dosyalar/202651815105221-biyolojidöp.pdf` |
| Coğrafya (9-12) | 2251 | `Dosyalar/2026518151120283-cogdöp.pdf` |
| Fizik (9-12) | 2254 | `Dosyalar/2026518151437471-fizikdöp.pdf` |
| Kimya (9-12) | 2255 | `Dosyalar/2026518151539674-kimya.pdf` |
| Matematik (Hazırlık, 9-12) | 2256 | `Dosyalar/2026518151640408-matedöp.pdf` |
| Tarih (9-11) | 2271 | `Dosyalar/2026691344767-tarihdöp.pdf` |
| Türk Dili ve Edebiyatı (Hazırlık, 9-12) | 2252 | `Dosyalar/2026518151228236-edebiyatdöp.pdf` |
| Din Kültürü ve Ahlak Bilgisi (9-12) | 2153 | `Dosyalar/2026313101155916-dkab912.pdf` |
| Felsefe (10-11) | 2253 | `Dosyalar/2026518151339111-felsefedöp.pdf` |

Kaynak adresi: `https://mufredat.meb.gov.tr/ProgramDetay.aspx?PID=<PID>`

**İkinci resmî kaynak (doğrulama):** `https://tymm.meb.gov.tr/<ders>-dersi/unite/<tema>` — her
tema için aynı tabloyu HTML olarak yayımlıyor (öğrenme çıktıları + süreç bileşenleri + içerik
çerçevesi + anahtar kavramlar). Biyoloji 10.2 sayfası, PDF'in 30 sayfalık okuma sınırının
ötesinde kalan 9 çıktıyı doğrulamak için kullanıldı.

### Doğrulama (birebir karşılaştırma)

- **Biyoloji:** Resmî PDF s.16-30 (9. sınıf 1-2. tema + `BİY.10.1.1`–`BİY.10.1.8`) ve
  `tymm.meb.gov.tr/biyoloji-dersi/unite/10` (`BİY.10.2.1`–`BİY.10.2.9`) ile **19/19 kod ve
  cümle birebir uyuştu**.
- **Çıktı sayıları** her ders için resmî programla tutarlı: Biyoloji 19, Coğrafya 18,
  Din Kültürü 17, Felsefe 10, Fizik 22, Kimya 21, Matematik 21, Tarih 14, TDE 16.
- Kod biçimi: `DERS.SINIF.TEMA.ÇIKTI` (ör. `BİY.10.1.1`). TDE programı beceri eksenli olduğu
  için `TDE1.1`–`TDE4.4` düzenini kullanır.

> Not: `mufredat.meb.gov.tr` PDF'leri 30+ sayfa; PDF aracı ilk 30 sayfayı okuyor. 10. sınıf
> Biyoloji s.28'de başladığı için 10.1.9 ve sonrası **ikinci resmî kaynaktan** (tymm.meb.gov.tr)
> ve havuzun kendi kazanım cümlelerinden çapraz doğrulandı.

---

## 2. Ne üretildi

| Dosya | İçerik |
|---|---|
| `site/content/mufredat/meb_kazanim_10.json` | 9 ders / **158** resmî 10. sınıf öğrenme çıktısı: kod, tema, kazanım cümlesi, süreç bileşenleri, kaynak (PID, PDF, sha256) |
| `site/content/mufredat/kazanim_konu_10.json` | Konu ↔ kazanım eşlemesi + kazanım metni → konu tablosu + eşleşmeyenler + özet |
| `site/okz-meb.js` | Tarayıcı katmanı (`window.OKZM`): `ciktiBul`, `konuBul`, `konuKazanimlari`, `tablo` |
| `scripts/meb-kazanim-uret.js` | Üretici (ağ gerekmez): havuzlar + resmî tablo → iki çıktı dosyası |
| `tests/meb-kazanim.test.js` | 52 kontrol: tablo bütünlüğü, eşleme tutarlılığı, uydurmama, entegrasyon izleri |

### Eşleme katmanları

| Katman | Kural | Otomatik? |
|---|---|---|
| **kesin** | Kazanım metni resmî çıktı cümlesine indirgendi (Dice ≥ 0,80) | ✅ |
| **yapısal** | Konu başlığı resmî çıktıda aynen geçiyor / temada tek çıktı var / konu sırası = çıktı sırası | ✅ |
| **orta** | Yalnız başlık benzerliği (≥ 0,32 ve ikinci adaydan belirgin fark) | ❌ onay ister |
| **yok** | Kanıt yetersiz → **hiçbir kod yazılmaz** | — |

Dürüstlük kuralları: tema numarası tutmayan eşleşme "kesin" sayılmaz; aynı kazanım cümlesi
birden çok konuda geçiyorsa konu otomatik yazılmaz (`coklu`); aynı numaralı tema aynı içerik
değilse (Din Kültürü) hiç eşleme yapılmaz.

---

## 3. Kapsam

| Ders | Resmî çıktı | Havuz konu | kesin | yapısal | yok | Kodu bulunan çıktı |
|---|---|---|---|---|---|---|
| Biyoloji | 19 | 14 | 11 | 2 | 1 | 19/19 |
| Coğrafya | 18 | 18 | 5 | 13 | 0 | 17/18 |
| Din Kültürü | 17 | 16 | 0 | 0 | 16 | 0/17 |
| Felsefe | 10 | 23 | 0 | 22 | 1 | 10/10 |
| Fizik | 22 | 21 | 9 | 11 | 1 | 20/22 |
| Kimya | 21 | 17 | 14 | 2 | 1 | 19/21 |
| Matematik | 21 | 21 | 18 | 3 | 0 | 21/21 |
| Tarih | 14 | 12 | 10 | 2 | 0 | 14/14 |
| Türk Dili ve Edebiyatı | 16 | 30 | 0 | 0 | 30 | 0/16 |
| **Toplam** | **158** | **172** | **67** | **55** | **50** | **120/158** |

- **122/172 konu** resmî bir kazanıma bağlandı (67 kesin + 55 yapısal), **0 tema uyumsuzluğu**.
- Havuzlardaki **113 kazanım metninin 107'si** tek konuya, 6'sı birden çok konuya ait.
- Tablodaki **120/158 çıktı** en az bir konuya bağlı.

### Örnek — Biyoloji 10

| Konu | MEB kodu | Resmî kazanım |
|---|---|---|
| 1.1 Canlılık İçin Enerjinin Önemi | BİY.10.1.1 | Canlıların yaşamına devam edebilmesi için enerjinin gerekliliğini sorgulayabilme |
| 1.2 Işık Enerjisi Kullanılarak Besin Sentezi | BİY.10.1.2 · BİY.10.1.3 | Fotosentez reaksiyonlarıyla ilgili bilimsel model oluşturabilme · Fotosentezde kullanılan ve üretilen maddelerle ilgili deney yapabilme |
| 1.4 Kemosentez | BİY.10.1.4 | Kemosentez hakkında bilgi toplayabilme |
| 1.5 Sindirim | BİY.10.1.5 · BİY.10.1.6 | Sindirim çeşitlerini sınıflandırabilme · Sindirim-emilim-taşıma ile bilimsel çıkarım |
| 1.7 Hücresel Solunum | BİY.10.1.7 | Hücresel solunum reaksiyonlarıyla ilgili bilimsel model oluşturabilme |
| 1.9 Fermantasyon | BİY.10.1.9 | Fermantasyon ile ilgili deney yapabilme |
| 1.10 Enerji-Metabolizma İlişkisi | BİY.10.1.10 | Besinlerden elde edilen enerjinin metabolik süreçlere katkısı |
| 2.1 Ekosistemin Bileşenleri | BİY.10.2.1 | Ekosistemin cansız ve canlı bileşenleri arasındaki ilişkileri çözümleyebilme |
| 2.3 Ekosistemdeki Madde ve Enerji Akışı | BİY.10.2.2 · BİY.10.2.3 | Etkileşimleri sorgulayabilme · Enerji akışıyla tümevarımsal akıl yürütebilme |
| 2.4 Madde Döngüleri | BİY.10.2.4 | Madde döngüleri ile ilgili bilimsel model oluşturabilme |

---

## 4. Bulgular (veri kalitesi)

1. **Havuzdaki `kazanim` metinleri resmî cümlenin aynısı değil.** Çoğu, resmî çıktının
   2. kişiye çevrilmiş hâli (`…sorgulayabilme` → `…sorgulamanız`). Kök bazında eşleştirildi.
2. **Dört derste metinler resmî cümleye çok yakın** (Biyoloji 20/20 metin kodlu, Kimya 19/19,
   Tarih 12/12, Matematik 21/21). **Coğrafya (7/17) ve Fizik (9/24)** havuzlarında metinler
   serbest yeniden yazım; bu yüzden kod, metinden değil **tema + konu yapısından** verildi
   (Coğrafya'da 7/7 tema, konu sayısı = çıktı sayısı).
3. **Din Kültürü havuzu 2018 programına göre kurulmuş** (Kur'an, ibadet, ahlak, Hz. Muhammed,
   yorumlar). 2026 TYMM üniteleri farklı (bilgi/Allah, tevhit-adalet-barış, insan-çevre-ahlak,
   yorum farklılıkları). Aynı numaralı tema **aynı içerik değil** → bilerek **hiç eşleme
   yapılmadı**; yanlış kod yazmak eşlememekten kötüdür.
4. **TDE programı beceri eksenli** (dinleme/okuma/konuşma/yazma × 4 süreç). "Koşuk", "Gazel",
   "İsimler" gibi tür/gramer konuları resmî çıktıyla birebir eşlenemez → eşleme yok.
5. **2026 programı bazı konuları kaydırmış:** Fizikte *serbest düşme* 11. sınıfa taşınmış
   (`FİZ.11.1.1`, `FİZ.11.1.2`). Havuzdaki 10. sınıf "1.3 Serbest Düşme" konusunun 2026 10.
   sınıf karşılığı yok; konu kapatılmadı, yalnız kod yazılmadı (gerekçe veri dosyasında).
6. **Uygulamanın ünite numarası = MEB tema numarası.** 122 eşleşmenin tamamında tema
   uyuşmazlığı çıkmadı; Coğrafya 7/7, Matematik 7/7, Fizik 4/4, Kimya 3/3, Biyoloji 2/2,
   Tarih 3/3 temada konu sayısı resmî çıktı sayısıyla aynı.
7. **Havuz etiketlerinde hata var:** ör. `cogr_10_u04_k01` içindeki
   "yerleşmeleri fonksiyonlarına göre sınıflandırabilmeniz" cümlesi resmî `COĞ.10.4.2`'ye ait,
   konu başlığı ise 4.1. Eşleme havuzun kendi etiketini izler (metin→konu doğrudan kanıttır),
   kod ise resmî tablodan gelir; ikisi çelişirse `kod_guven` düşer.

---

## 5. Çalışma zamanı davranışı

`site/app-pwa.js` → `okzKonuBul()` sırası:

1. elle kaydedilmiş eşleme (`konuHaritasi`)
2. **MEB katmanı** (`window.OKZM.konuBul`) — kazanım cümlesi havuzdaki bir kazanım metniyle
   birebir eşleşiyorsa konu **deterministik** bağlanır, resmî kod da döner (`kaynak: "meb"`).
   Cümle tanınmıyorsa **hiçbir şey yazılmaz**.
3. elle bakılmış kural tablosu (`konu-anahtar.js`)
4. kelime skoru (`okz-konu.js`) — KESİN / ÖNERİ

`OKZM` yüklenmezse (çevrimdışı, eski önbellek) katman sessizce atlanır; uygulama bozulmaz.

---

## 6. Sınırlar

- Yalnız **10. sınıf** ve yalnız **9 ders** (havuzların tamamı 10. sınıf).
- **Tema adları yok** (yalnız tema numarası): adlar için her dersin tema sayfası ayrıca
  çekilmeli; eşleme için gerekmiyor.
- Süreç bileşenleri (`a) … b) …`) veri dosyasında var ama eşlemede kullanılmıyor.
- 9/11/12. sınıf tabloları eklenmedi (havuz yok).
- Din Kültürü ve TDE için konu bazlı eşleme **yok**; bu derslerin havuzları 2026 programıyla
  uyumlu değil (yukarıda 3 ve 4).

## 7. Yenileme

```bash
node scripts/meb-kazanim-uret.js     # eşleme + tarayıcı modülünü yeniden üretir
node tests/meb-kazanim.test.js       # 52 kontrol
node tests/konu-bulma.test.js        # entegrasyon (75/75)
```

`meb_kazanim_10.json` elle düzenlenmez; yeni program sürümü geldiğinde resmî PDF'ten
yeniden çıkarılır (kaynak PID + sha256 dosyada saklı).
