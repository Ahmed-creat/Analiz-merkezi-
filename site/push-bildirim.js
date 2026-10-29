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
  const VAPID_ACIK = "BNRjTCIDs_ML94GereBzsi08_jNu0qXDQt8GNZPepDplBaIvW3HJuq7GtYOy-lKkNnPPCdMm6YJSFzJIQR46aU8";

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
      ua: navigator.platform || "",
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
    const istenen = b64Coz(VAPID_ACIK);
    let abone = await kayit.pushManager.getSubscription();
    if (abone) {
      // Farklı bir anahtarla (ör. eski FCM) kurulmuşsa bizimkiyle değiştir
      const mevcut = abone.options && abone.options.applicationServerKey;
      if (mevcut && b64Yaz(mevcut) !== VAPID_ACIK) {
        try { await abone.unsubscribe(); } catch (_) {}
        abone = null;
      }
    }
    if (!abone) {
      abone = await kayit.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: istenen
      });
    }
    return abone;
  }

  async function abone(izinZorla) {
    const a = await abonelikAl(izinZorla);
    const r = await kaydet(a);
    if (r.ok) window.__amPushAbone = true;
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
  async function otomatik() {
    try {
      if (!kullanici() || !destekVarMi()) return;
      if (Notification.permission !== "granted") return;
      const r = await abone(false);
      // İzin önceden verilmiş ama test bildirimi hiç gitmemişse bir kez gönder
      if (r && r.ok) await testBirKez();
    } catch (e) { /* sessiz */ }
  }

  window.AmPush = { hazir: destekVarMi, izinIste, abone: () => abone(false), testEt, testBirKez, birak, durum, otomatik, teshis, buYuzdenKapali: anlasilirHata, testGonderildiMi };
  // Oturum açıldığında app-pwa.js çağırır; gecikmeli de bir kez dene
  setTimeout(otomatik, 6000);
})();
