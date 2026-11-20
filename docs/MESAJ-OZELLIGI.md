# Mesaj özelliği — Koçluk Hattı (site/mesaj.js + site/koc.js)

## Neydi, ne oldu

| Önce | Sonra |
|---|---|
| `#coach-panel` açılıyordu ama **içi boştu**: `toggleCoachPanel()` yalnız gizle/göster yapıyor, `renderCoachPanel()` çağırmıyordu; üstelik mesajlar sadece sayfa ilk açılırken bir kez üretiliyordu. | Panel her açılışta tazelenir (`renderCoachPanel()` + `window.__kocSohbetTazele()`), `aria-expanded` güncellenir. |
| Kullanıcı **mesaj yazamıyordu** — giriş alanı yoktu, panel tek yönlü sistem metni gösteriyordu. | Panelde gerçek sohbet: metin girişi + gönder düğmesi (Enter ile de), balonlar, "Temizle". |
| Sohbet geçmişi yoktu. | Son 60 mesaj `localStorage` (`am_koc_sohbet_v1`) içinde saklanır; sayfa yenilenince korunur. |
| Panel ve sohbet **iki ayrı hesap** yapıyordu (farklı net/ivme). | v102: ikisi de `site/koc.js` → **`KOC_MOTOR`** kullanır. Tek hesap, tek metin. |

## Veri nereden geliyor (v102)

| Alan | Kaynak | Okunamazsa |
|---|---|---|
| Sınav tarihi | `state.plan.targetDate` | "Sınav tarihi kayıtlı değil" + Planlama → Hedefler |
| Hedef net | `state.plan.targetNet` | aynı şekilde adıyla söylenir |
| Deneme neti | `exams[].net` → yoksa `exams[].lessons` D/Y'sinden `D − Y/4` | **null** (0 değil) → deneme seriye girmez, adıyla "atlanan"da |
| Hata nedeni | `exams[].errorLogs[].type` (deneme) + `questions[].errorLogs[].type` (test) | "neden seçilmemiş N" olarak sayılır |
| Konu | `errorLogs[].topic` + `lesson` → `"Ders > Konu"` | konu önceliğine yazılmaz, sayısı söylenir |
| Hafıza / tekrar | `state.memory` (completedAt, lastReview, reviewCount, schedule) | "Konu Takibi'nde konu yok" |
| Okul sınavı / hazırlık | `plan.schoolExams`, `plan.hazirlikPlani` (+ canlı `hazirlikPlani()`) | öneri üretilmez |

**Kural:** hiçbir alan varsayılan sayı ile doldurulmaz. Eksikse `null` döner ve
`veriKontrol()` kaydı **alan adı + nereden girileceği + etkisi** ile raporlar.

## Yanıtlar neyi yorumlar

- **net** → son/önceki deneme, fark, kaç günde, **haftalık tempo**, son 3 ortalama,
  en zayıf ders (D/Y/B + başarı %), hedefe kalan ve gereken ivme.
- **konu** → hata sayısı + baskın neden + son hata tarihi ile sıralı öncelik
  (formül: `1,5·deneme konu eksiği + 1,0·test konu eksiği + 0,5·(işlem+anlamadım)`,
  AYT ağırlığıyla çarpılır).
- **hata nedenlerim** → neden dağılımı (%), baskın nedenin yorumu ve
  `NEDEN_TABLO` aksiyonu.
- **öneri / bu hafta ne yapmalıyım** → 14 kuraldan süzülen, gerekçeli öneriler.
- **eksik veri** → koçun okuyamadığı alanlar, adlarıyla ve nereden girileceğiyle.
- **bugün ne çalışayım** → hazırlık planındaki bugünün oturumu, yoksa en öncelikli konu.
- **sınav** → tarih, kalan gün/hafta, hedef, gereken ve ölçülen ivme.
- okulizyon, kitap/okuma, motivasyon, yardım, selamlama, teşekkür.

## Güvenlik / dayanıklılık

- Balonlar `textContent` ile yazılır → **HTML enjeksiyonu yok** (test edilir).
- Panel kartları motor tarafından **HTML kaçışı** yapılarak üretilir.
- `ctx` eksik/bozuk olsa da çökmez; her soruya metin döner. Motor yoksa
  (ör. eski önbellek) eski saf yollar devreye girer.
- Panel ikinci kez kurulmaz (çift yükleme koruması).
- Mobilde panel `min(62vh, 100vh - 190px)` ile sınırlanır, mesaj alanı kaydırılır.

## Test

```
npm run test:koc      # 116 — motor: doğrulama, yorum, öneri, eksik veri
npm run test:mesaj    # 58 — yanıt motoru (motor köprüsü dahil)
npm run test:mesaj-ui # 23 — arayüz (motor bağlıyken uçtan uca)
```
