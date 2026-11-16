/* ============================================================
   WEB PUSH — UYGULAMA KAPALIYKEN BİLDİRİM  (site/push-bildirim.js)
   ------------------------------------------------------------
   Neden ayrı dosya: app-pwa.js Supabase/Firebase'e bağlı; bu dosya
   ise hiçbir kütüphaneye bağlı DEĞİL. Tek işi var:
     abone ol → uç noktayı public.push_abonelikleri'ne yaz
   Sunucu tarafı: supabase/functions/bildirim-gonder (VAPID + aes128gcm)
   Servis çalışanı: sw.js "push" olayı → showNotification (uygulama kapalı).

   Tarayıcı sınırları (dürüst):
     • Android / masaüstü Chrome-Edge-Firefox : uygulama kapalıyken ✅
     • iPhone/iPad Safari                       : yalnız "Ana Ekrana Ekle"
                                                  ile kuruluysa ✅ (iOS 16.4+)
     • Gizli sekme / izin reddi                 : ❌ (izin gerekir)

   Genel API: window.AmPush
     hazir()        → bu cihaz/tarayıcı destekliyor mu
     izinIste()     → bildirim izni + abonelik + kayıt
     abone()        → yalnız abonelik + kayıt (izin zaten verildiyse)
     testEt()       → sunucudan kendine test bildirimi
     izinIste()     → izin verildiği ANDA bir kez otomatik test bildirimi atar
                      (v35.7; Ayarlar'daki "test bildirimi" düğmesi kaldırıldı)
     birak()        → aboneliği sil
     durum()        → { destek, izin, abone, kayitli }
   ============================================================ */
(function () {
  "use strict";

  // Supabase projesi (supabase-config.js zaten yüklü; yoksa buradan okunur)
  const VARSAYILAN_URL = "https://ztgzmhfklsdlngrtennp.supabase.co";
  // VAPID AÇIK anahtarı — gizli değil, tarayıcıya gömülmek üzere tasarlanmıştır.
  // v38 — ANAHTAR YENİLENDİ (sunucu + tarayıcı AYNI çifti kullanır).
  // Kök neden: sunucunun imzaladığı anahtar ile cihazdaki aboneliğin
  // applicationServerKey'i ayrışırsa push servisi 201 döner ama TARAYICI
  // bildirimi sessizce düşürür ("hiç ulaşmadı" belirtisi tam olarak bu).
  // Bu yüzden hem sunucu sırrı (VAPID_PRIVATE_JWK / VAPID_PUBLIC_KEY) hem
  // bu satır tek bir üretilmiş çiftten yazıldı; ikisi artık ayrışamaz.
  const VAPID_ACIK = "BIzGKXitJVLsKPQHMciDpOM7D1RDBKEVwim7Z4mmkpiT8QsF1HmoUmAM5FuCWCEe26zh6ca2uoaR_SUryMvAhUE";
  // v61 — bu cihazda aboneliğin hangi VAPID anahtarıyla kurulduğu
  const VAPID_KURULAN_ANAHTAR = "am_vapid_kurulan";

  // ============================================================
  // v44 — SUNUCU ↔ TARAYICI ANAHTAR ANLAŞMASI (bildirim neden gelmiyor)
  // KULLANICI: "Bildirim falan çalışmıyor, sadece ayarlardan tıklayınca
  // test bildirimi geliyor."
  // Ayarlardaki test YEREL gösterimdir (kayit.showNotification) — sunucuya
  // hiç gitmez, bu yüzden her zaman görünür. Gerçek hatırlatmalar ise Web
  // Push ile gider. Abonelik A anahtarıyla kurulup sunucu B anahtarıyla
  // imzalarsa push servisi 201 döner ama TARAYICI bildirimi sessizce
  // DÜŞÜRÜR: ne hata, ne kayıt... tam olarak "hiç gelmiyor" belirtisi.
  // Artık anahtar sunucudan alınır ve abonelik ONA göre kurulur.
  // ============================================================
  const VAPID_ANAHTAR_DEPO = "am_vapid_sunucu_v58"; // v58: eski/uyumsuz anahtar önbelleği geçersiz
  function yerelVapid() {
    try { return localStorage.getItem(VAPID_ANAHTAR_DEPO) || ""; } catch (e) { return ""; }
  }
  function yerelVapidYaz(k) {
    try { if (k) localStorage.setItem(VAPID_ANAHTAR_DEPO, k); } catch (e) { /* */ }
  }
  /** Sunucunun imzayı attığı GERÇEK açık anahtar. Ulaşılamazsa son bilinen. */
  let vapidSozu = null; // oturum boyunca tek istek
  async function sunucuVapid() {
    if (vapidSozu) return vapidSozu;
    vapidSozu = sunucuVapidIc();
    const k = await vapidSozu;
    if (!k) vapidSozu = null; // başarısızsa sonraki denemede yeniden sor
    return k;
  }
  async function sunucuVapidIc() {
    try {
      const y = await fetch(url() + "/functions/v1/bildirim-gonder", {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: anahtar() },
        body: JSON.stringify({ mod: "saglik" })
      });
      const g = await y.json().catch(() => ({}));
      const k = (g && (g.acikAnahtar || (g.vapid && g.vapid.turetilenAnahtar))) || "";
      if (k) { yerelVapidYaz(k); return k; }
    } catch (e) { /* çevrimdışı: son bilinen kullanılır */ }
    return yerelVapid();
  }

  // v54 — KAYIT HATASI GÖRÜNÜR OLSUN.
  // "Abonelik var" ≠ "sunucu bu cihazı biliyor". Kayıt başarısız olursa
  // (oturum henüz yok, RLS, ağ) sunucu bu cihaza HİÇ göndermez ama arayüz
  // "Açık ✓ hatırlatma gelir" diyordu. Artık hata saklanır ve gösterilir.
  const KAYIT_HATA_ANAHTARI = "am_push_kayit_hata";
  function kayitHatasiYaz(neden) {
    try { localStorage.setItem(KAYIT_HATA_ANAHTARI, JSON.stringify({ zaman: Date.now(), neden: String(neden || "").slice(0, 160) })); } catch (e) { /* */ }
  }
  function kayitHatasiSil() { try { localStorage.removeItem(KAYIT_HATA_ANAHTARI); } catch (e) { /* */ } }
  function sonKayitHatasi() {
    try { const j = JSON.parse(localStorage.getItem(KAYIT_HATA_ANAHTARI) || "null"); return j && j.zaman ? j : null; } catch (e) { return null; }
  }

  function app() {
    if (window.__amSupabase) return window.__amSupabase;
    return null;
  }
  function url() {
    const c = window.SUPABASE_CONFIG || window.__supabaseConfig || {};
    return c.url || c.projectUrl || VARSAYILAN_URL;
  }
  function anahtar() {
    const c = window.SUPABASE_CONFIG || window.__supabaseConfig || {};
    return c.key || c.anonKey || c.anon_key || "";
  }
  function kullanici() {
    const u = window.currentUser || (window.state && null);
    return u && u.id ? u : null;
  }

  function destekVarMi() {
    return typeof navigator !== "undefined" && "serviceWorker" in navigator &&
      typeof window !== "undefined" && "PushManager" in window && typeof Notification !== "undefined";
  }

  function b64Coz(s) {
    const t = String(s || "").replace(/-/g, "+").replace(/_/g, "/");
    const pad = t.length % 4 === 0 ? "" : "=".repeat(4 - (t.length % 4));
    const bin = atob(t + pad);
    const u = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return u;
  }
  function b64Yaz(bytes) {
    let s = "";
    const b = new Uint8Array(bytes);
    for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  // v56 — TEŞHİS: hangi tarayıcı, abonelik hangi VAPID anahtarıyla kurulmuş?
  // "201 döndü ama cihaza inmedi" tablosunda iki şeyi ayırmak için:
  //   • anahtar uyuşmazlığı  → subscription'ın applicationServerKey'i ≠ imza anahtarı
  //   • tarayıcı sorunu      → WebView / Chrome dışı tarayıcı / eski sürüm
  // Bu iki bilgi abonelik satırının `ua` alanına yazılır (şema değişmez).
  function kisaTarayici() {
    try {
      const ua = navigator.userAgent || "";
      const webview = /; wv\)/.test(ua) || (/Chrome\//.test(ua) && !/Safari\//.test(ua));
      const m = ua.match(/(SamsungBrowser|EdgA|YaBrowser|Firefox|FxiOS|CriOS|Chrome)\/(\d+)/);
      const ad = m ? m[1] + "/" + m[2] : "bilinmeyen";
      return (webview ? "WV:" : "") + ad;
    } catch (e) { return "?"; }
  }
  function aboneAnahtarParmak(a) {
    try {
      const k = a && a.options && a.options.applicationServerKey;
      if (!k) return "yok";
      return b64Yaz(new Uint8Array(k)).slice(0, 12);
    } catch (e) { return "hata"; }
  }

  /** Depoya (push_abonelikleri) yaz — supabase-js varsa onu, yoksa REST kullanır. */
  async function kaydet(abone) {
    const u = kullanici();
    if (!u) return { ok: false, neden: "oturum yok" };
    const j = abone.toJSON ? abone.toJSON() : abone;
    const satir = {
      user_id: u.id,
      endpoint: j.endpoint,
      p256dh: (j.keys && j.keys.p256dh) || "",
      auth: (j.keys && j.keys.auth) || "",
      // v56 — teşhis: tarayıcı | abonelik anahtarı | hedef (imza) anahtarı
      ua: kisaTarayici() + "|k=" + aboneAnahtarParmak(abone) +
          "|h=" + String(window.__amHedefAnahtar || "").slice(0, 12),
      aktif: true,
      updated_at: new Date().toISOString()
    };
    const sb = app();
    if (sb && sb.from) {
      const { error } = await sb.from("push_abonelikleri").upsert(satir, { onConflict: "user_id,endpoint" });
      if (error) return { ok: false, neden: error.message };
      return { ok: true };
    }
    // Yedek yol: REST + kullanıcının erişim anahtarı
    try {
      const oturum = await (window.__amSession ? window.__amSession() : null);
      const anahtarDegeri = anahtar();
      const y = await fetch(url() + "/rest/v1/push_abonelikleri?on_conflict=user_id,endpoint", {
        method: "POST",
        headers: {
          apikey: anahtarDegeri,
          Authorization: "Bearer " + ((oturum && oturum.access_token) || anahtarDegeri),
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=minimal"
        },
        body: JSON.stringify(satir)
      });
      if (!y.ok) return { ok: false, neden: "HTTP " + y.status };
      return { ok: true };
    } catch (e) { return { ok: false, neden: String(e) }; }
  }

  // v38 — TEK UÇUŞ: aynı anda birden çok çağrı olunca her biri ayrı
  // subscribe() yapıyor, her seferinde YENİ bir endpoint doğuyordu
  // (veritabanında aynı kullanıcı için 4 ayrı abonelik). Eski uçlar ölü
  // kalıp bildirimleri yutuyordu. Artık eşzamanlı çağrılar aynı işlemi bekler.
  let aboneIslem = null;
  function abonelikAl(izinZorla) {
    if (!aboneIslem) {
      aboneIslem = abonelikAlIc(izinZorla).then(
        function (r) { aboneIslem = null; return r; },
        function (e) { aboneIslem = null; throw e; }
      );
    }
    return aboneIslem;
  }

  async function abonelikAlIc(izinZorla) {
    if (!destekVarMi()) throw new Error("Bu tarayıcı arka plan bildirimini desteklemiyor");
    if (Notification.permission !== "granted") {
      if (!izinZorla) throw new Error("Bildirim izni verilmemiş");
      const p = await Notification.requestPermission();
      if (p !== "granted") throw new Error("Bildirim izni reddedildi");
    }
    const kayit = await navigator.serviceWorker.ready;
    // v44 — anahtar SUNUCUDAN: imzayı atan anahtarla abonelik birebir aynı olur.
    const sunucuAnahtar = await sunucuVapid();
    const kullanilacak = sunucuAnahtar || VAPID_ACIK;
    const istenen = b64Coz(kullanilacak);
    window.__amHedefAnahtar = kullanilacak; // v56 — teşhis kaydı için
    let abone = await kayit.pushManager.getSubscription();
    if (abone) {
      // Farklı bir anahtarla kurulmuşsa (eski FCM / eski sürüm) DEĞİŞTİR.
      // v58 — KÖK NEDEN: VAPID çifti tutmuyordu (açık anahtar A, imza anahtarı B).
      // Google mesajı 201 ile kabul edip Chrome'a hiç vermiyordu. Ayrıca mevcut
      // anahtar OKUNAMIYORSA (mevcut boş) eski abonelik korunuyordu; o abonelik
      // hangi anahtarla kurulduğu bilinmediği için DOĞRULANAMAZ. Artık anahtar
      // yoksa da yenilenir: abonelik her zaman güncel sunucu anahtarına bağlanır.
      // v61 — KÖK NEDEN (canlı kanıt): aynı kullanıcı için 6 AKTİF abonelik
      // oluşmuştu (_ulI, TW8Q, Rem8, ioLP, 7IiE, HVwT); her uygulama açılışında
      // 1-2 YENİ uç nokta doğuyordu. Sebep: bazı Chrome sürümleri
      // getSubscription().options.applicationServerKey değerini BOŞ döndürüyor;
      // v58 kuralı "anahtar okunamıyorsa aboneliği yenile" olduğu için her
      // açılışta unsubscribe + subscribe çalışıyordu. Sonuç: eski uçlar ölü
      // kalıyor ama veritabanında aktif görünüyor → cron aynı anda 6 push
      // gönderiyor, cihaz yalnız birini alıyor, gerisi 410/404 oluyor.
      // ÇÖZÜM: aboneliği HANGİ VAPID anahtarıyla kurduğumuzu cihazda sakla.
      // Anahtar aynıysa mevcut abonelik KORUNUR (yeni uç üretilmez).
      const mevcut = abone.options && abone.options.applicationServerKey;
      let anahtarAyni;
      if (mevcut) {
        anahtarAyni = b64Yaz(mevcut) === kullanilacak;
      } else {
        let kayitli = null;
        try { kayitli = localStorage.getItem(VAPID_KURULAN_ANAHTAR); } catch (_) { /* */ }
        anahtarAyni = kayitli === kullanilacak;
      }
      if (!anahtarAyni) {
        try { await abone.unsubscribe(); } catch (_) {}
        abone = null;
      }
    }
    if (!abone) {
      try {
        abone = await kayit.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: istenen
        });
      } catch (e) {
        // Anahtar değişmişse tarayıcı eski aboneliği bırakmak istemeyebilir:
        // bir kez zorla sıfırlayıp yeniden dene.
        const eski = await kayit.pushManager.getSubscription().catch(() => null);
        if (eski) { try { await eski.unsubscribe(); } catch (_) {} }
        abone = await kayit.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: istenen });
      }
    }
    // Hangi anahtarla kurulduğunu damgala: sonraki açılışlarda anahtar
    // okunamasa bile abonelik YENİLENMEZ (yeni uç nokta üretilmez).
    try { localStorage.setItem(VAPID_KURULAN_ANAHTAR, kullanilacak); } catch (_) { /* */ }
    return abone;
  }

  async function abone(izinZorla) {
    const a = await abonelikAl(izinZorla);
    const r = await kaydet(a);
    if (r.ok) { window.__amPushAbone = true; kayitHatasiSil(); }
    else kayitHatasiYaz(r && r.neden);
    return r;
  }

  async function izinIste() {
    try {
      if (!kullanici()) return { ok: false, neden: "Önce giriş yapmalısın (bildirim hesabına bağlanır)" };
      const r = await abone(true);
      // İzin + abonelik tamam → deneme bildirimi (tek sefer)
      if (r && r.ok) {
        const t = await testBirKez();
        return Object.assign({}, r, { test: t });
      }
      return r;
    } catch (e) {
      // Kullanıcıya teknik hata metni değil, anlaşılır cümle gösterilir
      return { ok: false, neden: anlasilirHata(e) };
    }
  }

  function anlasilirHata(e) {
    const m = String((e && e.message) || e || "");
    if (/denied|reddedildi/i.test(m)) return "Bildirim izni verilmedi. Tarayıcı ayarlarından izin verebilirsin.";
    if (/permission/i.test(m)) return "Bildirim izni gerekiyor.";
    if (/Android|iPhone|iPad/.test(m)) return m;
    if (/desteklemiyor/i.test(m)) return m;
    return "Bildirim kurulamadı: " + m.slice(0, 120);
  }

  async function birak() {
    try {
      const kayit = await navigator.serviceWorker.ready;
      const a = await kayit.pushManager.getSubscription();
      if (!a) return { ok: true, zatenYok: true };
      const u = kullanici();
      const j = a.toJSON ? a.toJSON() : a;
      const sb = app();
      if (sb && sb.from && u) await sb.from("push_abonelikleri").delete().eq("user_id", u.id).eq("endpoint", j.endpoint);
      await a.unsubscribe();
      window.__amPushAbone = false;
      return { ok: true };
    } catch (e) { return { ok: false, neden: String(e) }; }
  }

  async function testEt() {
    try {
      const oturum = await (window.__amSession ? window.__amSession() : null);
      const anahtarDegeri = anahtar();
      if (!oturum || !oturum.access_token) return { ok: false, neden: "Önce giriş yap" };
      const y = await fetch(url() + "/functions/v1/bildirim-gonder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anahtarDegeri,
          Authorization: "Bearer " + oturum.access_token
        },
        body: JSON.stringify({ mod: "test" })
      });
      let g = {};
      try { g = await y.json(); } catch (_) {}
      if (y.status === 404) return { ok: false, neden: "Bu cihaz kayıtlı değil — önce bildirimleri aç." };
      if (!y.ok) return { ok: false, neden: (g && g.hata) || ("HTTP " + y.status) };
      return { ok: (g.gonderilen || 0) > 0, gonderilen: g.gonderilen || 0, neden: (g.sonuc && g.sonuc[0] && g.sonuc[0].metin) || "" };
    } catch (e) { return { ok: false, neden: String(e) }; }
  }

  // ---- v35.7: İZİN VERİLDİĞİ AN OTOMATİK TEST BİLDİRİMİ ----------
  // Kullanıcı şikâyeti: "test bildirimi gelmiyor". Artık izin verilir
  // verilmez tek seferlik deneme bildirimi gönderilir; düğme yok.
  // Aynı cihazda bir kez gönderilir (localStorage işareti).
  // v35.9 — işaret artık CİHAZ + UÇ NOKTA'ya bağlı. Eskiden tek bir
  // localStorage bayrağıydı: bir kez başarılı olunca (ya da yeni cihazda
  // farklı davranınca) bir daha asla denenmiyordu. Şimdi her yeni abonelik
  // kendi deneme bildirimini alır; başarısız deneme işaretlenmez.
  const TEST_ANAHTARI = "am_push_test_gonderildi:";
  function testGonderildiMi(ucNokta) {
    try { return localStorage.getItem(TEST_ANAHTARI + (ucNokta || "")) === "1"; } catch (e) { return false; }
  }
  function testIsaretle(ucNokta) {
    try { localStorage.setItem(TEST_ANAHTARI + (ucNokta || ""), "1"); } catch (e) { /* */ }
  }
  async function testBirKez() {
    let ucNokta = "";
    try {
      const kayit = await navigator.serviceWorker.ready;
      const a = await kayit.pushManager.getSubscription();
      ucNokta = (a && a.endpoint) ? a.endpoint.slice(-24) : "";
    } catch (e) { /* */ }
    if (testGonderildiMi(ucNokta)) return { ok: true, atlandi: true };
    const r = await testEt();
    if (r && r.ok) testIsaretle(ucNokta);
    return r;
  }

  /** Tanılama: cihazda ne var, sunucu ne diyor? (Ayarlar'da görünür) */
  // v35.9 — Üç ayrı gerçek yan yana konur:
  //   1) cihaz: izin + abonelik + hesaba kayıt + "bu cihaza son push ulaştı mı" (sw.js izi)
  //   2) sunucu: bu cihaza en son hangi gün bildirim gönderdi (push_abonelikleri.son_gonderim)
  //   3) sunucu sürümü: mod:"saglik" yanıtı (yayınlanmamışsa "eski sürüm" denir, hata değil)
  async function cihazSonPush() {
    try {
      if (typeof caches === "undefined") return null;
      const c = await caches.open("am-push-iz");
      const r = await c.match("/__am-push-son");
      if (!r) return null;
      const j = await r.json();
      return j && j.zaman ? j : null;
    } catch (e) { return null; }
  }
  async function teshis() {
    const d = await durum();
    const out = { cihaz: d, sunucu: null };
    try {
      d.sonPush = await cihazSonPush();
    } catch (e) { d.sonPush = null; }
    try {
      const kayit = await navigator.serviceWorker.ready;
      const a = await kayit.pushManager.getSubscription();
      // v53 — CİHAZ KODU: uç noktanın son 4 karakteri. Kullanıcı bunu söyleyince
      // "hangi abonelik gerçekten bu cihazın" sorusu veritabanından tek bakışta
      // yanıtlanır (3 abonelik vakası).
      d.ucKodu = a && a.endpoint ? String(a.endpoint).slice(-4) : "";
      const sb = app();
      if (a && sb && sb.from) {
        const { data } = await sb.from("push_abonelikleri")
          .select("son_gonderim").eq("endpoint", a.endpoint).maybeSingle();
        d.sunucuSonGonderim = (data && data.son_gonderim) || null;
      }
    } catch (e) { /* alan boş kalır */ }
    try {
      const y = await fetch(url() + "/functions/v1/bildirim-gonder", {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: anahtar(), Authorization: "Bearer " + anahtar() },
        body: JSON.stringify({ mod: "saglik" })
      });
      const g = await y.json().catch(() => ({ http: y.status }));
      // Yayınlanmış sürüm bu ucu tanımıyorsa hata değil, sürüm bilgisidir.
      if (g && typeof g.hata === "string" && /geçersiz mod/i.test(g.hata)) out.sunucu = { surumEski: true };
      else out.sunucu = g;
    } catch (e) { out.sunucu = { hata: String(e).slice(0, 120) }; }
    return out;
  }

  async function durum() {
    const d = { destek: destekVarMi(), izin: destekVarMi() ? Notification.permission : "yok", abone: false, kayitli: false };
    if (!d.destek) return d;
    try {
      const kayit = await navigator.serviceWorker.ready;
      const a = await kayit.pushManager.getSubscription();
      d.abone = !!a;
      const u = kullanici(); const sb = app();
      if (a && u && sb && sb.from) {
        const { data } = await sb.from("push_abonelikleri").select("id").eq("user_id", u.id).eq("endpoint", a.endpoint).maybeSingle();
        d.kayitli = !!data;
      }
    } catch (_) {}
    return d;
  }

  /** Girişten sonra sessizce: izin zaten verilmişse aboneliği tazele. */
  let otomatikDeneme = 0;
  async function otomatik() {
    try {
      if (!destekVarMi()) return;
      if (Notification.permission !== "granted") return;
      // v44 — Oturum Supabase'ten birkaç saniyede gelir; eskiden tek deneme
      // 6. saniyede yapılıp vazgeçiliyordu (yavaş ağda abonelik hiç tazelenmiyor).
      if (!kullanici()) {
        // v54 — 8×4 sn = 32 sn yetmiyordu (yavaş açılışta abonelik hiç
        // kaydedilmiyordu). 25×3,5 sn ≈ 87 sn; ayrıca sekme görünür oldukça
        // oturum gelince otomatik() yine çağrılır.
        if (otomatikDeneme++ < 25) setTimeout(otomatik, 3500);
        return;
      }
      otomatikDeneme = 0;
      // v60 — KULLANICI: "Uygulamaya her girildiğinde test bildirimi geliyor."
      // OTOMATİK TEST BİLDİRİMİ KALDIRILDI. Her açılışta (ve her öne gelişte)
      // bir test push'u atmak gürültüdür; kanal zaten cihaz beyanıyla kanıtlandı
      // (push_teslim: asama=push + gosterim{gosterildi:true}). Test yalnız izin
      // İLK verildiğinde (izinIste) ve "kanalı test et" düğmesiyle çalışır.
      await abone(false);
    } catch (e) { /* sessiz */ }
  }

  /** Tek dokunuşluk onarım: aboneliği sunucu anahtarıyla YENİDEN kur. */
  async function yenile() {
    try {
      const kayit = await navigator.serviceWorker.ready;
      const eski = await kayit.pushManager.getSubscription().catch(() => null);
      if (eski) { try { await eski.unsubscribe(); } catch (_) {} }
      try { localStorage.removeItem(VAPID_ANAHTAR_DEPO); } catch (_) { /* */ }
      vapidSozu = null;
      const r = await abone(true);
      return r;
    } catch (e) { return { ok: false, neden: anlasilirHata(e) }; }
  }

  window.AmPush = { hazir: destekVarMi, izinIste, abone: () => abone(false), testEt, testBirKez, birak, durum, otomatik, teshis, yenile, sunucuVapid, buYuzdenKapali: anlasilirHata, testGonderildiMi, sonKayitHatasi, kisaTarayici };
  // Oturum açıldığında app-pwa.js çağırır; gecikmeli de bir kez dene.
  // v43 — HER açılışta ve uygulama öne geldiğinde abonelik tazelenir: eski
  // uç nokta ölmüşse zamanlanmış hatırlatmalar sessizce kayboluyordu.
  setTimeout(otomatik, 6000);
  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") setTimeout(otomatik, 1500);
    });
  }
})();
