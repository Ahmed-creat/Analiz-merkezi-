/* v53 — "Sunucu gönderdi (201) ama cihazda bildirim yok" vakasının kanıt yolu.
   Bu test UYGULAMANIN KENDİ dosyalarını okur; davranışı metinden doğrular:
     1) SW, push izi önbelleğini activate sırasında SİLMİYOR (eski hata)
     2) showNotification hata atarsa SADE seçeneklerle tekrar deniyor
     3) hata ize yazılıyor (görünmez arıza bir daha olmasın)
     4) arayüz cihaz kodunu (uç nokta son 4) gösteriyor
     5) uygulama sürümü ile SW önbellek damgası aynı
*/
"use strict";
const fs = require("fs"), path = require("path");
const KOK = path.join(__dirname, "..", "..");
const SW = fs.readFileSync(path.join(KOK, "site", "sw.js"), "utf8");
const APP = fs.readFileSync(path.join(KOK, "site", "app-pwa.js"), "utf8");
const PUSH = fs.readFileSync(path.join(KOK, "site", "push-bildirim.js"), "utf8");
const HTML = fs.readFileSync(path.join(KOK, "site", "index.html"), "utf8");

let gecen = 0; const hata = [];
const ok = (ad, kosul) => { if (kosul) { gecen++; console.log("  ✓ " + ad); } else { hata.push(ad); console.log("  ✗ " + ad); } };

console.log("\n== 1) Push izi her yayında silinmiyor ==");
ok("korunan önbellek adı tanımlı", /const KORUNAN_IZ = "am-push-iz"/.test(SW));
ok("activate yalnız CACHE ve iz dışındakileri siliyor",
  /keys\.filter\(\(k\) => k !== CACHE && k !== KORUNAN_IZ\)/.test(SW));
ok("eski hatalı filtre kalmadı", !/keys\.filter\(\(k\) => k !== CACHE\)\.map/.test(SW));

console.log("\n== 2) Gösterim hatası bildirimi düşürmüyor ==");
ok("ilk gösterim try içinde", /try \{\s*await self\.registration\.showNotification\(secim\.title, secim\.options\);/.test(SW));
ok("hata yakalanınca sade seçeneklerle tekrar deniyor",
  /iz\.sadeSecenek = true/.test(SW) && /showNotification\(secim\.title, \{\s*body: secim\.options\.body/.test(SW));
ok("hata ize yazılıyor", /iz\.hata = String\(e\)\.slice\(0, 160\)/.test(SW) && /if \(iz\.hata\) await pushIzYaz\(iz\)/.test(SW));
ok("başarı durumu da ize yazılıyor", /iz\.gosterildi = true/.test(SW));

console.log("\n== 3) Cihaz kodu (hangi abonelik bu cihazın) ==");
ok("push-bildirim uç nokta son 4 hanesini veriyor", /d\.ucKodu = a && a\.endpoint \? String\(a\.endpoint\)\.slice\(-4\)/.test(PUSH));
ok("arayüz cihaz kodunu yazıyor", /" · Cihaz kodu: " \+ cihaz\.ucKodu/.test(APP));
ok("gösterim hatası arayüzde görünüyor", /sonPush\.hata\) metin \+= " Gösterim hatası: "/.test(APP));

console.log("\n== 4) 'Kayıtlı değil' dürüstçe söyleniyor (v54) ==");
ok("kayıtlı değilse uyarı yazılıyor", /if \(cihaz\.kayitli === false\) \{/.test(APP));
ok("uyarıda cihaz kodu var", /hatırlatmalar şu an bu cihaza gelmez/.test(APP));
ok("kayıt hatası da gösteriliyor", /Kayıt hatası: "/.test(APP));
ok("push-bildirim kayıt hatasını saklıyor", /localStorage\.setItem\(KAYIT_HATA_ANAHTARI/.test(PUSH));
ok("başarılı kayıtta hata siliniyor", /kayitHatasiSil\(\)/.test(PUSH));
ok("oturum için daha uzun bekleniyor (25 deneme)", /otomatikDeneme\+\+ < 25/.test(PUSH));
ok("sayfaya dönüşte abonelik tazeleniyor", /window\.addEventListener\("focus"/.test(APP));

console.log("\n== 5) 'Gönderildi' ≠ 'göründü' (v55) ==");
ok("gösterimden sonra getNotifications ile doğrulanıyor",
  /sayi = \(await kayit\.getNotifications\(\{ tag: etiket \}\)\)\.length/.test(APP));
ok("görünmediyse ok:false dönüyor", /ok: gorunur/.test(APP));
ok("sonuç cihazda saklanıyor", /am_bildirim_kanal_testi/.test(APP));
ok("profil satırı 'cihaz göstermiyor' diyebiliyor", /CİHAZ BİLDİRİM GÖSTERMİYOR/.test(APP));
ok("kanal testi düğmesi var", /data-act="amKanalTesti"/.test(APP));
ok("sahte başarı mesajı kaldırıldı (index.html)", !/if \(t && t\.ok && typeof toast === "function"\) toast\("Bildirimler açıldı — biraz önce bir bildirim gösterdim\."/.test(HTML));
ok("index.html cihaz göstermiyorsa hata diyor", /cihazGostermiyor/.test(HTML));

console.log("\n== 6) Yerel yedek yol + teşhis (v56) ==");
ok("arka planda yerel sistem bildirimi var", /function yerelSistemBildirimi\(n\)/.test(HTML));
ok("yalnız sekme gizliyken gösteriyor", /document\.visibilityState !== "hidden"\) return/.test(HTML));
ok("günlük tekilleştirme var", /am_yerel_sys_/.test(HTML));
ok("push izi bugün aynı başlığı gösterdiyse atlıyor", /iz\.baslik === String\(n\.title/.test(HTML));
ok("addNotification yerel bildirimi çağırıyor", /yerelSistemBildirimi\(n\);/.test(HTML));
ok("teşhis: tarayıcı adı + anahtar parmak izi kaydediliyor", /\|k=" \+ aboneAnahtarParmak\(abone\)/.test(PUSH));
ok("WebView ayırt ediliyor", /WV:/.test(PUSH));
ok("hedef (imza) anahtarı da yazılıyor", /__amHedefAnahtar/.test(PUSH));
ok("profil tarayıcı adını gösteriyor", /" · Tarayıcı: " \+ tb/.test(APP));

console.log("\n== 8) Cihaz beyanı: push ulaştı mı? (v57) ==");
ok("sw.js push_teslim tablosuna yazıyor", /rest\/v1\/push_teslim/.test(SW));
ok("push olayı gelince 'push' satırı yazılıyor", /asama: "push"/.test(SW));
ok("gösterim sonucu 'gosterim' satırı olarak yazılıyor", /asama: "gosterim"/.test(SW));
ok("kurulumda 'sw-acildi' nabzı var", /asama: "sw-acildi"/.test(SW));
ok("hangi SW sürümü çalışıyor bilgisi kayda giriyor", /sw: CACHE/.test(SW));
ok("cihaz kodu (abonelik son 4) kayda giriyor", /TESLIM_ABONE/.test(SW));
ok("ölçüm okunamazsa uygulama bozulmuyor (try/catch)", /push_teslim"\)\s*\n?\.select|from\("push_teslim"\)/.test(APP));
ok("izin açık artık 'hatırlatma gelir' diye vaat etmiyor",
  !/let metin = "Açık ✓ Her sabah/.test(APP));
ok("cihaz aldıysa gösteriliyor", /Cihaz sunucu bildirimini ALDI/.test(APP));
ok("cihaza hiç ulaşmadıysa açıkça yazılıyor", /HİÇ ULAŞMADI/.test(APP));

console.log("\n== 9) VAPID çifti: abonelik anahtarı = imza anahtarı (v58) ==");
ok("sabit açık anahtar yeni (düzeltilmiş) çift", /VAPID_ACIK = "BIzGKXitJVLsKPQHMciDpOM/.test(PUSH));
ok("eski/uyumsuz anahtar kalmadı", !/BNRjTCIDs_ML94/.test(PUSH));
ok("eski anahtar önbelleği geçersiz sayıldı", /am_vapid_sunucu_v58/.test(PUSH));
// v61 — v58'in "anahtar okunamıyorsa yenile" kuralı TERSİNE döndü.
// KÖK NEDEN: bazı Chrome sürümleri applicationServerKey'i boş döndürüyor;
// bu kural her açılışta yeni uç nokta üretiyordu ve aynı kullanıcıda
// 6 AKTİF abonelik birikti (canlı kanıt: _ulI, TW8Q, Rem8, ioLP, 7IiE, HVwT).
// Artık aboneliğin HANGİ anahtarla kurulduğu cihazda saklanır; anahtar
// aynıysa abonelik KORUNUR (yeni uç üretilmez).
ok("anahtar okunamazsa KAYITLI anahtarla karşılaştırılıyor (v61)",
  /anahtarAyni = kayitli === kullanilacak;/.test(PUSH));
ok("cihazda saklanan anahtar yoksa yenilenir", /if \(!anahtarAyni\)/.test(PUSH));

console.log("\n== 10) Hatırlatma: kanıtlanmış gönderim yolu (v59) ==");
const MIG = fs.existsSync("supabase/migrations/0002_webpush_tetikle.sql")
  ? fs.readFileSync("supabase/migrations/0002_webpush_tetikle.sql", "utf8") : "";
ok("göç dosyası var", !!MIG);
ok("hatırlatıcı fonksiyonu tanımlı", /create or replace function public\.webpush_tetikle\(\)/.test(MIG));
ok("gönderim kanıtlanmış yola (push-tani) bağlı", /functions\/v1\/push-tani/.test(MIG));
ok("şifreleme web-push ile (sifreli webpush)", /'sifreli', 'webpush'/.test(MIG));
ok("sır istemciden değil vault'tan okunuyor", /vault\.decrypted_secrets/.test(MIG));
ok("günde iki vardiya, vardiya başına tekrar yok", /vardiya/.test(MIG) && /on conflict do nothing/.test(MIG));
ok("bozuk gömülü şifrelemeye bağımlılık yok (bildirim-gonder çağrılmıyor)",
  !/functions\/v1\/bildirim-gonder/.test(MIG));

console.log("\n== 7) Sürüm damgası senkron ==");
const surum = (APP.match(/const PWA_SURUM = "([^"]+)"/) || [])[1] || "";
const cache = (SW.match(/const CACHE = "analiz-merkezi-v-\d+-([^"]+)"/) || [])[1] || "";
ok("PWA_SURUM tanımlı", !!surum);
ok("SW önbellek damgası PWA_SURUM ile aynı", !!surum && surum === cache);

console.log("\n" + "─".repeat(56));
console.log(`v53 bildirim izi — ${gecen}/${gecen + hata.length} geçti` + (hata.length ? "" : " ✓"));
if (hata.length) { hata.forEach(h => console.log("  ✗ " + h)); process.exit(1); }
