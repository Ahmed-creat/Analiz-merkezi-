# bildirim-gonder — Yayın Kaydı (v38)

Bu dosya, canlıdaki Supabase Edge fonksiyonunun **ne zaman, hangi gövdeyle**
yayınlandığını ve **hangi ölçümlerle** doğrulandığını kaydeder. Tahmin yok;
aşağıdaki her satır canlıya atılan isteğin gerçek yanıtıdır.

## Canlı durum

| Alan | Değer |
|---|---|
| Fonksiyon | `bildirim-gonder` (`f492b4db-868f-4369-8f51-5d9ebc927ccf`) |
| Sürüm | **8** (ACTIVE) |
| `verify_jwt` | `false` — kron `x-bildirim-secret` ile çağırır, JWT yok |
| Yayın biçimi | **satır içi gövde** (import yok) |
| Kaynak | `index.ts` (üretilmiş dosya, 36 436 bayt) |
| Commit | `d490d23` |

## Neden satır içi gövde?

İki deneme de başarısız oldu, bu yol **terk edildi**:

1. `import "https://raw.githubusercontent.com/.../index.ts"` → HTTP **503 BOOT_ERROR**
   ("Function failed to start").
2. `await import("https://raw.githubusercontent.com/...")` (try/catch içinde)
   → HTTP **500**, `TypeError: Module not found`.

Supabase Edge, uzak URL'den modül yüklemiyor. Bu yüzden gövde, dosyanın
tamamı olarak doğrudan yayınlanır.

## Ölçümler (yayın sonrası, canlıya gerçek istekler)

| # | İstek | HTTP | Yanıt |
|---|---|---|---|
| 56 | `{"mod":"saglik"}` | **200** | `ozelAnahtarVar:true`, `ozelAnahtarCozuluyor:true`, `acikAnahtarVar:true`, `tarayiciIleAyni:true`, **`imzaTarayiciIleAyni:true`**, `bildirimSecretVar:true` |
| 57 | `{"mod":"run"}` (sır ile) | **200** | `vardiya:"aksam"`, `kontrol:["coach","exam@1","daily"]`, `abonelik:0`, `gonderilen:0`, `hatalar:[]` |
| 58 | `{"mod":"tekil","abonelik_id":…}` (sır ile) | **200** | VAPID imzası + AES-128-GCM şifreleme + HTTPS POST çalıştı; örnek uç `405` döndü (`gonderilen:0`) |

58 numaralı ölçüm için veritabanına **geçici** bir satır eklendi
(`endpoint: https://example.com/__am-kripto-testi`, gerçek P-256 p256dh + 16 baytlık auth).
Amaç: canlı Deno'da `crypto.subtle` yolunun (JWT imzası, ECDH, HKDF, AES-GCM)
hata atmadan çalıştığını görmek. `405`, şifrelemenin **başarıyla** tamamlandığını
ve isteğin gerçekten ağa çıktığını kanıtlar (şifreleme patlasaydı yanıt 500 +
`hata` olurdu). Satır sonra silindi; tablo yine **0 satır**.

## Bilinen kozmetik fark

`saglik.surum` alanı hâlâ `"v37"` döner (sablon.ts satır 225). Gövde v38
davranışını içeriyor; yalnız bu metin güncellenmedi, çünkü her metin
değişikliği 36 KB'lık gövdenin **yeniden yayınlanmasını** gerektiriyor.
Bir sonraki zorunlu yayında `"v38"` yapılacak.

## Yeniden üretim

```bash
node scripts/bildirim-derle.js     # sablon.ts + webpush-kripto.mjs + bildirim-logic.js → index.ts
```

Sonuç: 36 436 bayt, `git status` temiz (yani `index.ts` depodaki hâliyle
birebir aynı üretiliyor).

## Kalan tek adım

Gerçek bildirimin cihaza ulaşması **cihazın yeniden abone olmasına** bağlı:
eski abonelikler eski VAPID anahtarıyla kurulmuştu ve silindi (`push_abonelikleri`
= 0 satır). Site v38 yayında; uygulama açıldığında `push-bildirim.js`
anahtar farkını görüp eski aboneliği bırakır, yenisini kurar ve bir kez
deneme bildirimi gönderir (`AmPush.otomatik`, 6 sn sonra).
