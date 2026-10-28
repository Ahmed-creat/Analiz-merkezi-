# Mesaj özelliği — Koçluk Hattı (site/mesaj.js)

## Neydi, ne oldu

| Önce | Sonra |
|---|---|
| `#coach-panel` açılıyordu ama **içi boştu**: `toggleCoachPanel()` yalnız gizle/göster yapıyor, `renderCoachPanel()` çağırmıyordu; üstelik mesajlar sadece sayfa ilk açılırken bir kez üretiliyordu. | Panel her açılışta tazelenir (`renderCoachPanel()` + `window.__kocSohbetTazele()`), `aria-expanded` güncellenir. |
| Kullanıcı **mesaj yazamıyordu** — giriş alanı yoktu, panel tek yönlü sistem metni gösteriyordu. | Panelde gerçek sohbet: metin girişi + gönder düğmesi (Enter ile de), balonlar, "Temizle". |
| Sohbet geçmişi yoktu. | Son 60 mesaj `localStorage` (`am_koc_sohbet_v1`) içinde saklanır; sayfa yenilenince korunur. |

## Yanıtlar nereden geliyor

`site/mesaj.js` içindeki **`kocYanit(metin, ctx)`** saf fonksiyonu öğrencinin
kendi kayıtlarından yanıt üretir:

- **net/deneme** → son deneme neti, önceki denemeye göre fark, son 3 ortalama,
  orana göre en zayıf ders
- **konu/öncelik** → hatalı sorulardan (deneme `errorLogs` + Okulizyon satırları)
  en çok tekrar eden konular ve ders kırılımı
- **okulizyon** → bekleyen soru sayısı, sınav adı, ders dağılımı, son çekim hatası
- **sınav** → kalan gün, hedef net, kalan hafta
- **kitap/okuma**, **motivasyon**, **yardım**, **selamlama**, **teşekkür**

Veri yoksa **dürüst** davranır ("Henüz okuma kaydın yok", "Sınav tarihi kayıtlı
değil") — uydurmaz. Bu bir yapay zekâ sohbeti ya da insan koç değildir; arayüzde
"Yanıtlar kendi kayıtlarından üretilir · cihazda saklanır" notu görünür.

## Güvenlik / dayanıklılık

- Balonlar `textContent` ile yazılır → **HTML enjeksiyonu yok** (test edilir).
- `ctx` eksik/bozuk olsa da çökmez; her soruya metin döner.
- Panel ikinci kez kurulmaz (çift yükleme koruması).
- Mobilde panel `min(62vh, 100vh - 190px)` ile sınırlanır, mesaj alanı kaydırılır.

## Test

```
npm run test:mesaj      # 41 (motor) + 22 (arayüz) = 63 kontrol
```

- `tests/mesaj.test.js` — yanıt motoru (gerçek Okulizyon verisiyle bağlam).
- `tests/mesaj-ui.test.js` — tarayıcısız DOM taklidiyle panel kurulumu, mesaj
  gönderme, yanıt, kalıcılık, XSS ve temizleme davranışı.

Her iki test de **yayınlanan dosyayı** (`site/mesaj.js`) okur, kopyasını değil.
