# Konu Adları Nereden Gelir?

> Soru: "TYMM'de direkt konu ismi yok. Başka yerde olabilir mi?"
> Kısa cevap: **Var — ama TYMM'nin tema sayfasında değil, ODSGM'nin
> "Konu-Soru Dağılım Tablolarında".** Bu depoda 10. sınıf için zaten işlenmiş.

---

## 1. Üç kaynak, üç ayrı şey veriyor

| # | Kaynak | Ne veriyor | Konu adı? |
|---|---|---|---|
| 1 | **TYMM** — `tymm.meb.gov.tr` | Tema → Öğrenme Çıktıları (TDE1.1 …) | ❌ "İçerik Çerçevesi" yalnız **Okuma / Yazma / Dinleme / Konuşma** |
| 2 | **ODSGM** — `odsgm.meb.gov.tr` | Tema → **konu** → çıktı kodu | ✅ **Evet, tam olarak bu** |
| 3 | **MEB ders kitabı** — `ogmmateryal.eba.gov.tr` | Ünite / konu başlıkları | ✅ Evet, ama kitap kitap değişir |

### Neden TYMM'de "konu" bulamıyorsunuz

TYMM tema sayfasında **"İçerik Çerçevesi"** başlığı **var**, ama içeriği
konu adları değil, beceri başlıkları:

```
1. Tema: Sözün İnceliği (9. sınıf)   →  İçerik Çerçevesi
   • Okuma   • Yazma   • Dinleme/İzleme   • Konuşma
```

Konu adları TYMM sayfasında **düz metin** içinde geçer:

> "Okumada **şiir** ve **deneme** türlerinden birer metin tahlil edilir.
> Dinleme/izleme metni olarak bir **mülakat** incelenir." *(9. sınıf, Tema 1)*

> "**koşuk** ve **türkü** türünde metinler seçilir. Bu metinlere ilaveten ara
> metin olarak belirlenen **koşma** ve **ninni** türündeki metinler…"
> *(10. sınıf, Tema 1)*

Yani metin türleri (konu) **düz metinde** ve **Anahtar Kavramlar** listesinde
var; tabloya dökülmüş hâli **ODSGM'de**.

---

## 2. ODSGM tablosu — aranan yapı tam olarak bu

`data/` altındaki resmî tablodan üretilmiş dosya:
`site/content/mufredat/odsgm_konu_kazanim_10.json`

```json
{
  "ders": "Türk Dili ve Edebiyatı",
  "unite": "1. TEMA: SÖZÜN EZGİSİ",
  "konu": "OKUMA • Tema içeriğine uygun bir koşuk • Ara Metin: … bir koşma • … bir türkü • Ara Metin: … bir ninni",
  "ciktilar": [{ "kod": "TDE2.1", "kazanim": "… okumayı yönetebilme" }, …]
}
```

**`konu` alanı** = aradığınız konu adı. TYMM'nin düz metnindeki türler
(koşuk, koşma, türkü, ninni) burada tablolaşmış.

Depoda hâlihazırda işlenmiş: **10. sınıf, 10 ders, 64 konu, 107 çıktı**.
9. sınıf tablosu henüz yok.

---

## 3. Örnek: paylaşılan 9 kazanım hangi temaya ait?

Paylaşılan kazanımlar **9. sınıf değil, 10. sınıf 1. Tema: Sözün Ezgisi**
içeriğine ait. Kanıt — TYMM 10. sınıf Tema 1 metni ile birebir örtüşüyor:

| # | Kazanım (Okulizyon) | TYMM 10. sınıf Tema 1 karşılığı |
|---|---|---|
| 1 | Destan Dönemi Türk şiiri, **koşuk** türü | "**koşuk** ve türkü türünde metinler seçilir" |
| 2 | **Şiirde ahenk** (uyak, redif, aliterasyon, asonans) | Anahtar kavram: **ahenk, ritim, ezgi** |
| 3 | **Söz varlığının anlamı** (bağlamdan) | Çıktı TDE2.2 "anlam oluşturabilme" |
| 4 | **Halk şiiri** → **koşma** türü | "ara metin olarak belirlenen **koşma** ve ninni" |
| 5–6 | Şiirde ahenk (tekrar) | aynı |
| 7 | **Türkü** türü | "**koşuk** ve **türkü** türünde metinler" |
| 8–9 | **Metinlerden çıkarım** | Çıktı TDE2.3 "çözümleyebilme" |

9. sınıfın temaları farklı: *Sözün İnceliği · Anlam Arayışı · Anlamın Yapı
Taşları · Dilin Zenginliği*. "Koşuk/koşma/türkü" **yalnız 10. sınıf Tema 1'de**
geçiyor.

> Not: "Halk şiiri" ve "Destan Dönemi" ifadeleri TYMM metninde birebir geçmiyor;
> bunlar Okulizyon'un kendi ifadesi. TYMM karşılığı **koşuk** (destan dönemi
> ürünü) ve **koşma** (halk şiiri nazım biçimi).

---

## 4. Eksik olan tek şey

**9. sınıf ODSGM tablosu.** Depoda `data/odsgm-2026-1donem-10sinif.pdf` var,
9. sınıf sürümü yok. `odsgm.meb.gov.tr` → *Konu-Soru Dağılım Tabloları* →
9. sınıf sekmesi.

PDF verildiğinde:

```bash
node scripts/konu-kaynagi-denetle.js "<9-sinif-odsgm>.pdf"
```

ile ünite/konu/çıktı tablosu çıkarılır ve
`site/content/mufredat/odsgm_konu_kazanim_9.json` üretilir.

---

## 5. Okulizyon uyumu: 9 dersin 8'i tutuyor, TDE tutmuyor

| Ders | TYMM çıktısı | Okulizyon ile |
|---|---|---|
| Biyoloji, Coğrafya, Din, Felsefe, Fizik, Kimya, Matematik, Tarih | konu içerikli | ✅ **eşleşir** |
| **Türk Dili ve Edebiyatı** | çıplak beceri adı | ❌ **eşleşmez** |

### Neden sadece TDE?

TYMM'de TDE programı **beceri eksenli** yazılmış. Çıktı yalnız beceri adıdır:

```
TDE1.1 — Dinlemeyi/İzlemeyi Yönetebilme       ← tema yok, içerik yok
TDE2.2 — Anlam Oluşturabilme                  ← tema yok, içerik yok
```

`TDE1.x / 2.x / 3.x / 4.x` numaraları **tema değil beceri ekseni**:
1 = Dinleme/İzleme · 2 = Okuma · 3 = Konuşma · 4 = Yazma.

Öteki 8 derste TYMM zaten konuyu veriyor:

```
BİY.10.1.1 — Canlıların yaşamına devam edebilmesi için enerjinin
             gerekliliğini sorgulayabilme                        ✔
```

### Çözüm

TDE'nin konu kazanımı **Okulizyon'dan** alınır:

```
site/content/mufredat/okulizyon_kazanim_10.json
```

Okulizyon ne verir:

| Sıra | Okulizyon kazanımı |
|---|---|
| 1 | Destan Dönemi Türk şiirini ve koşuk türünün genel özelliklerini açıklar. |
| 2 | Şiirde ahengi sağlayan özellikleri (uyak düzeni, uyak, redif, aliterasyon, asonans) ile ilgili çalışma yapar. |
| 3 | Metindeki söz varlığının anlamını bağlamdan hareketle belirler. |
| 4 | Halk şiirini tanımlar, halk şiiri altında koşma türünün genel özelliklerini kavrar. |
| 7 | Türkü türünün genel özelliklerini belirler. |
| 8–9 | Metinlerden hareketle çıkarımlar yapar. |

**Kural:** deneme kayıtlarının konu metni Okulizyon'dan gelir; TYMM metniyle
**değiştirilmez**. TYMM çıktısı yalnız hangi beceriye/temaya bağlı olduğunu
göstermek için eşlenir.

`docs/uretim/TUM-KAZANIMLAR-10SINIF.md` TYMM çıktılarını listeler. Başındaki
uyarı 9 dersin 8'inde eşleştiğini, yalnız TDE'de eşleşmediğini söyler.

---

## 6. Uygulamadaki eski konu listesi

`site/index.html` içinde `LESSON` konu başlıkları var (TDE için 29 başlık:
"Şiir Bilgisi (Şekil Unsurları)", "Şiirde Ahenk (Ölçü, Uyak, Redif,
Aliterasyon, Asonans)", "Konularına Göre Şiir Türleri", …).

Bu liste **2018 programına** ait, TYMM ile hizalı değil. TYMM uyumlu konu
gruplaması için ODSGM tablosu esas alınmalı.
