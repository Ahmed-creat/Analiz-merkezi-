/* ============================================================
   ANALİZ MERKEZİ — KOÇLUK MOTORU (site/koc.js)

   KULLANICI (69): "Koçluk hattını çok daha iyi programla."
     1) Veri doğrulama : sınav tarihi, hedef net ve deneme sonuçları
        GERÇEKTEN uygulama kayıtlarından alınmalı.
     2) Analiz         : veri göstermekle kalma; net değişimini, hata
        nedenlerini ve konu önceliğini YORUMLA.
     3) Öneri          : öğrencinin verisine dayalı, GEREKÇELİ çalışma önerisi.
     4) Hata yönetimi  : veri yoksa sayı UYDURMA; hangi verinin eksik
        olduğunu ve nereden girileceğini söyle.

   NEDEN AYRI DOSYA?
     Koç paneli (index.html → coachMessages) ile sohbet (mesaj.js →
     kocYanit) ayrı hesaplar yapıyordu; aynı öğrenci için iki farklı
     sayı çıkabiliyordu (v99'da ivme için yaşanan çelişkinin aynısı).
     Artık ikisi de bu motoru kullanır: TEK hesap, TEK metin.

   KURAL: bu dosya SAF çalışır. state'i parametre olarak alır; DOM'a,
   localStorage'a, ağa dokunmaz. Böylece node testinde birebir denenir.
   ============================================================ */
(function (kok) {
  "use strict";

  const SURUM = "koc-1";

  /* ---- 1) Hata nedeni sözlüğü -------------------------------------
     Anahtarlar uygulamanın kendi taksonomisiyle AYNI olmalı
     (index.html: canonicalReason / reasonLabel / REASON_GROUP).
     Test bunu ayrıca doğrular: sözlük kayarsa iki ekran çelişir. */
  const NEDEN_TABLO = {
    "Konuyu Bilmiyordum": {
      kod: "konu-bilmiyordum", ad: "Konuyu bilmiyordum", grup: "Konu Bilgisi Eksiği",
      yorum: "konu hiç öğrenilmemiş",
      aksiyon: "Konuyu baştan çalış (özet + çözümlü örnek), ardından 10 soru çöz"
    },
    "KONUEKSİKLİĞİ": {
      kod: "konu-eksigi", ad: "Konu eksiği", grup: "Konu Bilgisi Eksiği",
      yorum: "konuda boşluk var",
      aksiyon: "Eksik başlığı belirleyip konu anlatımını tamamla, sonra 10 soru çöz"
    },
    "ANLAMADIM": {
      kod: "anlamadim", ad: "Anlamadım", grup: "Anlama Güçlüğü",
      yorum: "konu anlatımı oturmamış",
      aksiyon: "Çözümlü örneği adım adım incele; aynı tipten 5 soru (çözümüne bakarak) çöz"
    },
    "ÇÖZÜMYOLUNUBULAMADIM": {
      kod: "cozum-yolu", ad: "Çözüm yolunu bulamadım", grup: "Çözüm Yolu",
      yorum: "soru tipini tanıyamıyor",
      aksiyon: "Soru tipini tanıma çalış: 5 çözümlü örnek + tip listesi çıkar"
    },
    "İşlem Hatası/Dikkatsizlik": {
      kod: "islem", ad: "İşlem hatası / dikkatsizlik", grup: "İşlem Hatası",
      yorum: "bilgi var, uygulama hatası",
      aksiyon: "Süreli 20 soru çöz; son 2 dakikayı yalnız işlem kontrolüne ayır"
    },
    "Kodlama/Kitapçık Hatası": {
      kod: "kodlama", ad: "Kodlama / kitapçık hatası", grup: "Kitapçık Hatası",
      yorum: "aktarma hatası",
      aksiyon: "Cevap kâğıdına aktarırken 5 soruda bir kodlama kontrolü yap"
    },
    "SUREYETMEDI": {
      kod: "sure", ad: "Süre yetmedi", grup: "Süre Yönetimi",
      yorum: "hız değil, süre planı sorunu",
      aksiyon: "Turlu çözüm uygula: 1. tur kolaylar, 2. tur orta, 3. tur zor"
    }
  };

  // Uygulamanın canonicalReason haritası (birebir aynı eşleme).
  const NEDEN_ESLEME = {
    "KONU EKSİKLİĞİ": "KONUEKSİKLİĞİ",
    "KONUEKSİKLİĞİ": "KONUEKSİKLİĞİ",
    "ÇÖZÜM YOLUNU BULAMADIM": "ÇÖZÜMYOLUNUBULAMADIM",
    "Konuyu Bilmiyordum": "Konuyu Bilmiyordum",
    "SÜRE YETMEDİ": "SUREYETMEDI",
    "SÜREYETMEDİ": "SUREYETMEDI"
  };

  // Koçun "veri kaynağı" etiketleri (öğrenciye nereden okunduğu yazılır).
  const KAYNAK = {
    plan: "Planlama kaydı",
    deneme: "Denemelerim kaydı",
    hata: "hata günlüğü",
    okulizyon: "Okulizyon aktarımı",
    hafiza: "Konu Takibi kaydı",
    yok: "kayıt yok"
  };

  /* ---- 2) Küçük yardımcılar (saf) -------------------------------- */
  function sayi(v) {
    if (v === null || v === undefined || v === "") return null;
    // Türkçe ondalık ("77,5") ve boşluklu değerler de doğru okunur.
    const t = (typeof v === "string") ? v.trim().replace(/\s/g, "").replace(",", ".") : v;
    const n = Number(t);
    return isFinite(n) ? n : null;
  }
  function yuvarla(n, b) {
    const k = Math.pow(10, b == null ? 2 : b);
    return Math.round((Number(n) || 0) * k) / k;
  }
  function tr(n, b) {
    const v = sayi(n);
    if (v === null) return "-";
    return String(yuvarla(v, b == null ? 2 : b)).replace(".", ",");
  }
  function yuzde(adet, toplam) {
    if (!toplam) return 0;
    return Math.round((adet / toplam) * 100);
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  // "YYYY-MM-DD" → UTC gün damgası (saat dilimi kaymasın)
  function gunParca(v) {
    const t = String(v == null ? "" : v).trim();
    // ISO (2026-11-20) ve Türkçe (20.11.2026) biçimleri kabul edilir.
    let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(t);
    if (m) return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    m = /^(\d{2})\.(\d{2})\.(\d{4})/.exec(t);
    if (!m) return null;
    return Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  }
  function gunStr(v) {
    const p = gunParca(v);
    if (p === null) return null;
    return new Date(p).toISOString().slice(0, 10);
  }
  function gunFarki(a, b) {
    const A = gunParca(a), B = gunParca(b);
    if (A === null || B === null) return null;
    return Math.round((A - B) / 86400000);
  }
  function fmtTR(v) {
    const p = gunParca(v);
    if (p === null) return "";
    const d = new Date(p);
    return String(d.getUTCDate()).padStart(2, "0") + "." +
      String(d.getUTCMonth() + 1).padStart(2, "0") + "." + d.getUTCFullYear();
  }
  // Türkçe'ye duyarlı küçük harf: "İ".toLowerCase() birleşik nokta üretiyor
  // ("i̇şlem") — ekranda bozuk görünüyordu.
  // Sayı + iyelik eki: "2'si", "3'ü", "4'ü", "5'i" (Türkçe ses uyumu).
  const IYELIK = { 0: "ı", 1: "i", 2: "si", 3: "ü", 4: "ü", 5: "i", 6: "sı", 7: "si", 8: "i", 9: "u", 10: "u" };
  function iyelik(n) {
    const v = Math.abs(Number(n) || 0);
    if (IYELIK[v] != null) return IYELIK[v];
    const son = v % 10;
    return IYELIK[son] != null ? IYELIK[son] : "i";
  }
  function kucuk(v) {
    return String(v == null ? "" : v)
      .replace(/İ/g, "i").replace(/I/g, "ı")
      .toLowerCase();
  }
  function dersKonu(key) {
    const i = String(key == null ? "" : key).indexOf(" > ");
    if (i < 0) return { ders: "", konu: String(key || "") };
    return { ders: String(key).slice(0, i), konu: String(key).slice(i + 3) };
  }

  /* ---- 3) Nedeni normalize et ---- */
  function nedenCoz(v) {
    const ham = String(v == null ? "" : v).trim();
    if (!ham) return "";
    return NEDEN_ESLEME[ham] || ham;
  }
  function nedenBilgi(v) {
    const k = nedenCoz(v);
    if (!k) return null;
    /* Bilinmeyen değer UYDURULMAZ: tanınmayan neden "neden seçilmemiş"
       sayılır ve sayıyla raporlanır (index.html REASON_WEIGHTS da 0 verir). */
    return NEDEN_TABLO[k] || null;
  }
  function nedenAd(v) {
    const b = nedenBilgi(v);
    return b ? b.ad : "";
  }

  /* ---- 4) Net doğrulama ------------------------------------------
     KURAL: net yoksa UYDURULMAZ.
       • kayıtta net varsa onu kullan (kaynak "kayit"),
       • net yok ama D/Y girilmişse hesapla (kaynak "hesap") ve bunu söyle,
       • ikisi de yoksa net = null (0 DEĞİL). */
  function soruSayisi(exam) {
    const l = (exam && exam.lessons) || {};
    let t = 0;
    Object.keys(l).forEach(function (k) {
      const v = l[k] || {};
      t += (sayi(v.d) || 0) + (sayi(v.w) || 0) + (sayi(v.e) || 0);
    });
    return t;
  }
  function netCoz(exam) {
    const e = exam || {};
    const kayitli = sayi(e.net);
    const soru = soruSayisi(e);
    if (kayitli !== null) return { net: yuvarla(kayitli, 2), kaynak: "kayit", soru: soru };
    const l = e.lessons || {};
    let d = 0, w = 0;
    Object.keys(l).forEach(function (k) {
      d += sayi(l[k] && l[k].d) || 0;
      w += sayi(l[k] && l[k].w) || 0;
    });
    if ((d + w) > 0) return { net: yuvarla(d - w / 4, 2), kaynak: "hesap", soru: soru };
    return { net: null, kaynak: null, soru: soru };
  }

  /* ---- 5) Snapshot: GERÇEK kayıtlardan okur -----------------------
     Uygulama durumu (state) → koçun gördüğü doğrulanmış özet.
     Hiçbir alan varsayılmaz; olmayan alan null kalır. */
  function snapshot(state, bugun, ek) {
    const s = state || {};
    const p = s.plan || {};
    const e0 = ek || {};
    const b = gunStr(bugun) || gunStr(new Date().toISOString());

    const plan = {
      targetDate: gunStr(p.targetDate),
      targetNet: sayi(p.targetNet),
      examTime: p.examTime ? String(p.examTime) : "",
      schoolExams: (Array.isArray(p.schoolExams) ? p.schoolExams : [])
        .filter(function (x) { return x && gunStr(x.date) && x.lesson; })
        .map(function (x) {
          return {
            id: x.id || "", lesson: String(x.lesson), date: gunStr(x.date),
            time: x.time || "",
            topics: Array.isArray(x.topics) ? x.topics.filter(function (t) { return typeof t === "string" && t; }) : []
          };
        })
    };

    const exams = (Array.isArray(s.exams) ? s.exams : [])
      .filter(function (e) { return e && typeof e === "object"; })
      .map(function (e, i) {
        return {
          id: e.id || ("x" + i),
          name: String(e.name || "Deneme " + (i + 1)),
          date: gunStr(e.date),
          net: sayi(e.net),
          lessons: e.lessons && typeof e.lessons === "object" ? e.lessons : {},
          errorLogs: Array.isArray(e.errorLogs) ? e.errorLogs : []
        };
      });

    // Hata günlüğü: deneme hataları + soru bankası hataları (kaynak etiketiyle)
    const hatalar = [];
    exams.forEach(function (e) {
      e.errorLogs.forEach(function (l) {
        if (!l || typeof l !== "object") return;
        hatalar.push({
          kaynak: "deneme", sinav: e.name, date: gunStr(l.date) || e.date,
          lesson: String(l.lesson || (l.ders || "")).trim(),
          topic: String(l.topic || (l.konu || "")).trim(),
          type: nedenCoz(l.type)
        });
      });
    });
    (Array.isArray(s.questions) ? s.questions : []).forEach(function (q) {
      if (!q || !Array.isArray(q.errorLogs)) return;
      q.errorLogs.forEach(function (l) {
        if (!l || typeof l !== "object") return;
        hatalar.push({
          kaynak: "test", sinav: String(q.name || q.source || "Soru çözümü"), date: gunStr(l.date) || gunStr(q.date),
          lesson: String(l.lesson || (l.ders || "")).trim(),
          topic: String(l.topic || (l.konu || "")).trim(),
          type: nedenCoz(l.type)
        });
      });
    });
    // Okulizyon kuyruğu: neden seçilmemiş sorular (öncelik hesabına GİRMEZ,
    // ayrıca "analiz bekliyor" olarak raporlanır — v79 kuralı).
    (e0.okulizyon && Array.isArray(e0.okulizyon.sorular) ? e0.okulizyon.sorular : []).forEach(function (r) {
      if (!r) return;
      hatalar.push({
        kaynak: "okulizyon", sinav: "Okulizyon", date: gunStr(r.date),
        lesson: String(r.lesson || "").trim(), topic: String(r.topic || "").trim(),
        type: nedenCoz(r.type), nedenBekliyor: true
      });
    });

    // Hafıza: konu → {completedAt, lastReview, reviewCount, schedule}
    const memory = (s.memory && typeof s.memory === "object") ? s.memory : {};

    const hazKaynak = Array.isArray(e0.hazirlik) ? e0.hazirlik
      : (Array.isArray(p.hazirlikPlani) ? p.hazirlikPlani : []);
    const hazirlik = hazKaynak
      .filter(function (k) { return k && gunStr(k.date); })
      .map(function (k) {
        return {
          date: gunStr(k.date), kaynak: k.kaynak || "", ders: k.ders || "",
          konular: Array.isArray(k.konular) ? k.konular.slice() : [],
          tekrar: !!k.tekrar, son: !!k.son, gunOnce: sayi(k.gunOnce),
          etiket: k.etiket || "", oturumSira: sayi(k.oturumSira), oturumToplam: sayi(k.oturumToplam)
        };
      })
      .sort(function (a, b2) { return a.date < b2.date ? -1 : a.date > b2.date ? 1 : 0; });

    return {
      surum: SURUM,
      bugun: b,
      ad: String(e0.ad || (s.user && s.user.name) || "").trim(),
      sinif: String(e0.sinif || (s.user && s.user.grade) || "").trim(),
      plan: plan,
      exams: exams,
      hatalar: hatalar,
      memory: memory,
      hazirlik: hazirlik,
      okulizyon: {
        bekleyen: sayi(e0.okulizyon && e0.okulizyon.bekleyen),
        sinav: (e0.okulizyon && Array.isArray(e0.okulizyon.sinav)) ? e0.okulizyon.sinav.slice() : [],
        durum: (e0.okulizyon && e0.okulizyon.durum) || null
      },
      okuma: {
        sayfa: sayi(e0.okuma && e0.okuma.sayfa),
        dakika: sayi(e0.okuma && e0.okuma.dakika)
      },
      kalanGunElle: sayi(e0.kalanGun),
      ayt: typeof e0.ayt === "function" ? e0.ayt : null,
      memCritical: sayi(e0.memCritical) == null ? 20 : sayi(e0.memCritical)
    };
  }

  /* Sohbet katmanının bağlamı (mesaj.js) → aynı snapshot.
     Eski ctx biçimi de desteklenir: {exams, errorLogs, hedefNet, kalanGun}. */
  function snapshotCtx(ctx, bugun, ek) {
    const c = ctx || {};
    const planC = c.plan || {};
    const sahte = {
      user: { name: c.ad, grade: c.sinif },
      plan: {
        targetDate: planC.targetDate || c.targetDate || null,
        targetNet: (planC.targetNet != null ? planC.targetNet : c.hedefNet),
        schoolExams: planC.schoolExams || c.schoolExams || []
      },
      exams: (Array.isArray(c.exams) ? c.exams : []).map(function (e) {
        return {
          id: e && e.id, name: e && e.name, date: e && e.date, net: e && e.net,
          lessons: (e && e.lessons) || {},
          errorLogs: (e && Array.isArray(e.errorLogs)) ? e.errorLogs.slice()
            : (e && e.errorLogs ? [] : [])
        };
      }),
      questions: c.questions || [],
      memory: c.memory || {}
    };
    // ctx.errorLogs: deneme kayıtlarında gömülü olmayan GLOBAL hata listesi.
    // (Gömülü kayıt varsa ikinci kez saymamak için eklenmez.)
    let gomulu = 0;
    sahte.exams.forEach(function (e) { if (e.errorLogs && e.errorLogs.length) gomulu += 1; });
    if (!gomulu && Array.isArray(c.errorLogs) && c.errorLogs.length) {
      sahte.exams.push({
        id: "ctx-hatalar", name: "Hata kaydı", date: null, net: null, lessons: {},
        errorLogs: c.errorLogs.slice()
      });
    }
    const ek2 = Object.assign({}, ek || {}, {
      ad: c.ad, sinif: c.sinif,
      kalanGun: c.kalanGun,
      okulizyon: c.okulizyon,
      okuma: c.okuma,
      hazirlik: c.hazirlik
    });
    return snapshot(sahte, bugun, ek2);
  }

  /* ---- 6) Veri doğrulama: ne var, ne yok, nereden girilir --------- */
  function veriKontrol(snap) {
    const s = snap || {};
    const plan = s.plan || {};
    const exams = Array.isArray(s.exams) ? s.exams : [];
    const ayir = hataAyir(s);
    const hatalar = ayir.aktif;
    const list = [];

    function ekle(alan, durum, deger, mesaj, nerede, etki) {
      list.push({ alan: alan, durum: durum, deger: deger == null ? null : deger, mesaj: mesaj, nerede: nerede, etki: etki });
    }

    // 1) Sınav tarihi — kalan gün ve ivme buna bağlı
    if (plan.targetDate) {
      const kalan = gunFarki(plan.targetDate, s.bugun);
      ekle("Sınav tarihi", "var", plan.targetDate,
        "Sınav tarihi " + fmtTR(plan.targetDate) + (kalan != null ? " (" + kalan + " gün kaldı)" : "") + ".", KAYNAK.plan, "");
    } else {
      ekle("Sınav tarihi", "eksik", null,
        "Sınav tarihi kayıtlı değil.", "Planlama → Hedefler",
        "Kalan gün, haftalık tempo ve hazırlık takvimi hesaplanamaz.");
    }

    // 2) Hedef net
    if (plan.targetNet != null && plan.targetNet > 0) {
      ekle("Hedef net", "var", plan.targetNet, "Hedef net " + tr(plan.targetNet) + ".", KAYNAK.plan, "");
    } else {
      ekle("Hedef net", "eksik", null,
        "Hedef net kayıtlı değil.", "Planlama → Hedefler",
        "Gereken haftalık net artışı ve 'ivme geride mi' yorumu yapılamaz.");
    }

    // 3) Deneme kaydı + netleri
    if (!exams.length) {
      ekle("Deneme sonucu", "eksik", 0,
        "Hiç deneme kaydı yok.", "Denemelerim → Yeni Deneme",
        "Net trendi, ders kırılımı ve hata nedeni analizi yapılamaz.");
    } else {
      const netsiz = exams.filter(function (e) { return netCoz(e).net === null; });
      if (netsiz.length) {
        ekle("Deneme sonucu", "kısmi", exams.length - netsiz.length,
          netsiz.length + " denemede net ve D/Y/B yok (" +
          netsiz.slice(0, 3).map(function (e) { return e.name; }).join(", ") +
          (netsiz.length > 3 ? " …" : "") + ").", "Denemelerim → ilgili deneme",
          "Bu kayıtlar trend hesabına katılmaz (0 sayılmaz).");
      } else {
        ekle("Deneme sonucu", "var", exams.length,
          exams.length + " deneme kaydı okundu (netler kayıtlı).", KAYNAK.deneme, "");
      }
      const tarihsiz = exams.filter(function (e) { return !e.date; });
      if (tarihsiz.length) {
        ekle("Deneme tarihi", "kısmi", exams.length - tarihsiz.length,
          tarihsiz.length + " denemenin tarihi yok.", "Denemelerim → ilgili deneme",
          "Tarihsiz deneme sıralamada en sona alınır; net değişimi yanıltıcı olabilir.");
      }
    }

    // 4) Hata kaydı ve nedenleri
    const gercekHatalar = hatalar;
    if (!gercekHatalar.length) {
      ekle("Hata kaydı", "eksik", 0,
        ayir.arsiv.length
          ? "Aktif hata yok: " + ayir.arsiv.length + " hata, konu öğrenildi işaretlendiği için düştü."
          : "Yanlış/boş soru için hata kaydı yok.", "Denemelerim → Konu + Neden gir",
        "Konu önceliği ve hata nedeni yorumu yapılamaz.");
    } else {
      const nedensiz = gercekHatalar.filter(function (h) { return !h.type; });
      const konusuz = gercekHatalar.filter(function (h) { return !h.topic; });
      if (nedensiz.length) {
        ekle("Hata nedeni", "kısmi", gercekHatalar.length - nedensiz.length,
          gercekHatalar.length + " hatanın " + nedensiz.length + " tanesinde neden seçilmemiş.",
          "Denemelerim → hatanın yanındaki Neden alanı",
          "Nedensiz hatalar öncelik hesabına girmiyor; nedeni seçince sıralama değişir.");
      } else {
        ekle("Hata nedeni", "var", gercekHatalar.length,
          gercekHatalar.length + " hatanın tamamında neden kayıtlı.", KAYNAK.hata, "");
      }
      if (konusuz.length) {
        ekle("Hata konusu", "kısmi", gercekHatalar.length - konusuz.length,
          konusuz.length + " hatada konu adı yok.", "Denemelerim → Konu alanı",
          "Konu adı olmayan kayıt konu önceliğine yazılamaz.");
      }
    }

    // 5) Okulizyon kuyruğu (varsa bilgi)
    if (s.okulizyon && s.okulizyon.bekleyen > 0) {
      ekle("Okulizyon", "kısmi", s.okulizyon.bekleyen,
        "Okulizyon'da " + s.okulizyon.bekleyen + " soru analiz bekliyor.",
        "Profil → Okulizyon → Nedenleri seç",
        "Neden seçilene kadar bu sorular konu önceliğine girmiyor.");
    }

    return list;
  }
  function eksikler(snap) {
    return veriKontrol(snap).filter(function (x) { return x.durum === "eksik" || x.durum === "kısmi"; });
  }

  /* ---- 7) Net analizi -------------------------------------------- */
  function sinavSerisi(snap) {
    const exams = Array.isArray(snap && snap.exams) ? snap.exams : [];
    const liste = [], atlanan = [];
    exams.forEach(function (e) {
      const n = netCoz(e);
      if (n.net === null) {
        atlanan.push({ name: e.name, date: e.date, neden: "net ve D/Y/B yok" });
        return;
      }
      liste.push({ id: e.id, name: e.name, date: e.date, net: n.net, kaynak: n.kaynak, soru: n.soru, lessons: e.lessons });
    });
    liste.sort(function (a, b) {
      const A = gunParca(a.date), B = gunParca(b.date);
      if (A === null && B === null) return 0;
      if (A === null) return 1;
      if (B === null) return -1;
      return A - B;
    });
    return { liste: liste, atlanan: atlanan };
  }

  function dersNetleri(exam) {
    const l = (exam && exam.lessons) || {};
    const out = {};
    Object.keys(l).forEach(function (d) {
      const v = l[d] || {};
      const dSay = sayi(v.d) || 0, wSay = sayi(v.w) || 0, eSay = sayi(v.e) || 0;
      const toplam = dSay + wSay + eSay;
      if (!toplam) return;
      out[d] = { d: dSay, w: wSay, e: eSay, toplam: toplam, net: yuvarla(dSay - wSay / 4, 2), oran: (dSay - wSay / 4) / toplam };
    });
    return out;
  }

  function netAnalizi(snap) {
    const seri = sinavSerisi(snap);
    const liste = seri.liste;
    const yorum = [];
    const cikti = {
      sayi: liste.length, seri: liste, atlanan: seri.atlanan,
      son: null, onceki: null, fark: null, farkGun: null, haftalik: null,
      ortalamaSon3: null, enIyi: null, enKotu: null,
      dersler: { yukselen: [], dusen: [] },
      enZayifDers: null, enGucluDers: null,
      yorum: yorum
    };

    if (!liste.length) {
      yorum.push("Karşılaştırılacak deneme neti yok" +
        (seri.atlanan.length ? " (" + seri.atlanan.length + " kayıtta net/D-Y-B boş)." : "."));
      return cikti;
    }

    const son = liste[liste.length - 1];
    const onceki = liste.length > 1 ? liste[liste.length - 2] : null;
    cikti.son = son;
    cikti.onceki = onceki;
    yorum.push("Son deneme «" + son.name + "»" + (son.date ? " (" + fmtTR(son.date) + ")" : "") +
      ": " + tr(son.net) + " net" + (son.kaynak === "hesap" ? " — D/Y'den hesaplandı" : "") + ".");

    if (onceki) {
      cikti.fark = yuvarla(son.net - onceki.net, 2);
      cikti.farkGun = son.date && onceki.date ? gunFarki(son.date, onceki.date) : null;
      if (cikti.farkGun && cikti.farkGun > 0) cikti.haftalik = yuvarla(cikti.fark * 7 / cikti.farkGun, 2);
      yorum.push("Önceki denemeye («" + onceki.name + "», " + tr(onceki.net) + ") göre " +
        (cikti.fark >= 0 ? "+" : "") + tr(cikti.fark) + " net" +
        (cikti.farkGun ? " — " + cikti.farkGun + " günde" : "") +
        (cikti.haftalik != null ? " (haftada " + (cikti.haftalik >= 0 ? "+" : "") + tr(cikti.haftalik) + " net)" : "") + ".");
    }

    if (liste.length >= 3) {
      const son3 = liste.slice(-3);
      cikti.ortalamaSon3 = yuvarla(son3.reduce(function (a, x) { return a + x.net; }, 0) / son3.length, 2);
      yorum.push("Son 3 denemenin ortalaması " + tr(cikti.ortalamaSon3) + " net (" +
        son3.map(function (x) { return tr(x.net); }).join(" · ") + ").");
    }

    let enIyi = liste[0], enKotu = liste[0];
    liste.forEach(function (x) {
      if (x.net > enIyi.net) enIyi = x;
      if (x.net < enKotu.net) enKotu = x;
    });
    cikti.enIyi = enIyi;
    cikti.enKotu = enKotu;
    if (liste.length >= 2) {
      yorum.push("En yüksek " + tr(enIyi.net) + " («" + enIyi.name + "»), en düşük " + tr(enKotu.net) +
        " («" + enKotu.name + "»); fark " + tr(yuvarla(enIyi.net - enKotu.net, 2)) + " net.");
    }

    // Ders bazlı değişim (son iki deneme) + son denemenin en zayıf/güçlü dersi
    const sonDers = dersNetleri(son);
    const oncekiDers = onceki ? dersNetleri(onceki) : {};
    const degisim = [];
    Object.keys(sonDers).forEach(function (d) {
      if (!oncekiDers[d]) return;
      degisim.push({ ders: d, son: sonDers[d].net, onceki: oncekiDers[d].net, fark: yuvarla(sonDers[d].net - oncekiDers[d].net, 2) });
    });
    degisim.sort(function (a, b) { return b.fark - a.fark; });
    if (degisim.length) {
      cikti.dersler.yukselen = degisim.filter(function (x) { return x.fark > 0; });
      cikti.dersler.dusen = degisim.filter(function (x) { return x.fark < 0; }).reverse();
      const parcalar = [];
      if (cikti.dersler.yukselen.length) {
        const y = cikti.dersler.yukselen[0];
        parcalar.push("En çok artan ders " + y.ders + " (+" + tr(y.fark) + ")");
      }
      if (cikti.dersler.dusen.length) {
        const d0 = cikti.dersler.dusen[0];
        parcalar.push("en çok düşen ders " + d0.ders + " (" + tr(d0.fark) + ")");
      }
      if (parcalar.length) yorum.push(parcalar.join("; ") + ".");
    }

    const dersAdlari = Object.keys(sonDers);
    if (dersAdlari.length) {
      let zayif = null, guclu = null;
      dersAdlari.forEach(function (d) {
        const x = sonDers[d];
        if (!zayif || x.oran < zayif.oran) zayif = { ders: d, oran: x.oran, veri: x };
        if (!guclu || x.oran > guclu.oran) guclu = { ders: d, oran: x.oran, veri: x };
      });
      cikti.enZayifDers = zayif ? { ders: zayif.ders, net: zayif.veri.net, d: zayif.veri.d, w: zayif.veri.w, e: zayif.veri.e, oran: yuvarla(zayif.oran * 100, 0) } : null;
      cikti.enGucluDers = guclu ? { ders: guclu.ders, net: guclu.veri.net, d: guclu.veri.d, w: guclu.veri.w, e: guclu.veri.e, oran: yuvarla(guclu.oran * 100, 0) } : null;
      if (zayif) {
        yorum.push("En zayıf dersin " + zayif.ders + ": " + zayif.veri.d + "D / " + zayif.veri.w + "Y / " +
          zayif.veri.e + "B → " + tr(zayif.veri.net) + " net (başarı %" + Math.round(zayif.oran * 100) + "). " +
          "Bu ders, aynı emekle en çok net kazandıracak yer.");
      }
    }

    if (seri.atlanan.length) {
      yorum.push(seri.atlanan.length + " deneme neti olmadığı için karşılaştırmaya katılmadı (0 sayılmadı): " +
        seri.atlanan.slice(0, 3).map(function (x) { return "«" + x.name + "»"; }).join(", ") +
        (seri.atlanan.length > 3 ? " …" : "") + ".");
    }

    return cikti;
  }

  /* ---- 8) Hata nedeni analizi ------------------------------------
     Konu "öğrenildi" işaretlendikten ÖNCEKİ hatalar Konu Takibi'nde de
     listeden düşer (index.html: topicLearnedAfter). Koç aynı kuralı uygular;
     yoksa "4 hata" derken öncelik listesi "1 hata" gösterip çelişiyordu.
     Düşen kayıtlar ayrıca SAYIYLA bildirilir (sessizce yutulmaz). */
  function hataAyir(snap) {
    const s = snap || {};
    const memory = s.memory || {};
    const hepsi = (Array.isArray(s.hatalar) ? s.hatalar : []);
    const bekleyen = hepsi.filter(function (h) { return h.nedenBekliyor; });
    const ham = hepsi.filter(function (h) { return !h.nedenBekliyor; });
    const aktif = [], arsiv = [];
    ham.forEach(function (h) {
      const key = (h.lesson ? h.lesson + " > " : "") + h.topic;
      const mem = memory[key];
      let dusuk = false;
      if (mem && mem.completedAt) {
        const bitis = gunStr(String(mem.completedAt).split("T")[0]);
        const ld = gunStr(h.date);
        dusuk = (!ld) ? true : (bitis ? (gunFarki(ld, bitis) < 0) : false);
      }
      (dusuk ? arsiv : aktif).push(h);
    });
    return { hepsi: hepsi, ham: ham, aktif: aktif, arsiv: arsiv, bekleyen: bekleyen };
  }


  function hataAnalizi(snap) {
    const ayir = hataAyir(snap);
    const hepsi = ayir.hepsi, ham = ayir.ham;
    const hatalar = ayir.aktif, arsiv = ayir.arsiv;
    const nedenSayac = {}, dersSayac = {};
    let nedensiz = 0, konusuz = 0;

    hatalar.forEach(function (h) {
      const b = nedenBilgi(h.type);
      if (!b) nedensiz += 1;
      else nedenSayac[b.kod] = (nedenSayac[b.kod] || 0) + 1;
      if (h.lesson) dersSayac[h.lesson] = (dersSayac[h.lesson] || 0) + 1;
      if (!h.topic) konusuz += 1;
    });

    const toplam = hatalar.length;
    const nedenler = Object.keys(nedenSayac).map(function (kod) {
      let bilgi = null;
      Object.keys(NEDEN_TABLO).forEach(function (k) { if (NEDEN_TABLO[k].kod === kod && !bilgi) bilgi = NEDEN_TABLO[k]; });
      return { kod: kod, ad: bilgi ? bilgi.ad : kod, grup: bilgi ? bilgi.grup : "Diğer", adet: nedenSayac[kod], yuzde: yuzde(nedenSayac[kod], toplam), aksiyon: bilgi ? bilgi.aksiyon : "" };
    }).sort(function (a, b) { return b.adet - a.adet; });

    const dersler = Object.keys(dersSayac).map(function (d) { return { ders: d, adet: dersSayac[d], yuzde: yuzde(dersSayac[d], toplam) }; })
      .sort(function (a, b) { return b.adet - a.adet || a.ders.localeCompare(b.ders, "tr"); });

    const yorum = [];
    if (!toplam) {
      yorum.push(arsiv.length
        ? "Aktif hata yok: " + arsiv.length + " hata, konu öğrenildi olarak işaretlendiği için listeden düştü."
        : "Hata kaydı yok; neden dağılımı çıkarılamaz.");
    } else {
      const ilkDort = nedenler.slice(0, 4).map(function (n) { return n.ad + " " + n.adet + " (%" + n.yuzde + ")"; });
      if (nedenler.length > 4) {
        ilkDort.push("+" + (nedenler.length - 4) + " neden daha (" +
          nedenler.slice(4).reduce(function (a, n) { return a + n.adet; }, 0) + " hata)");
      }
      yorum.push(toplam + " hatanın nedeni: " + ilkDort.join(", ") + (nedensiz ? ", neden seçilmemiş " + nedensiz : "") + ".");
      const ilk = nedenler[0];
      if (ilk) {
        if (ilk.kod === "konu-bilmiyordum" || ilk.kod === "konu-eksigi" || ilk.kod === "anlamadim") {
          yorum.push("Baskın neden bilgi eksiği → önce konu çalışması, sonra soru. Sadece soru çözmek bu hatayı kapatmaz.");
        } else if (ilk.kod === "islem") {
          yorum.push("Baskın neden işlem/dikkat → bilgin var, uygulamada kaybediyorsun; kontrollü çözüm ve süre disiplini gerek.");
        } else if (ilk.kod === "sure") {
          yorum.push("Baskın neden süre → bilgi değil hız sorunu; turlu çözüm ve süreli prova gerek.");
        } else if (ilk.kod === "cozum-yolu") {
          yorum.push("Baskın neden çözüm yolu → soru tipini tanımada eksik; tip çalışması gerek.");
        } else if (ilk.kod === "kodlama") {
          yorum.push("Baskın neden kodlama → bilgi var, aktarımda kaybediyorsun; optik kontrolü gerek.");
        }
      }
      if (dersler.length) {
        yorum.push("Hataların dağılımı: " + dersler.slice(0, 4).map(function (d) { return d.ders + " " + d.adet; }).join(" · ") + ".");
      }
      if (nedensiz) yorum.push(nedensiz + " kayıtta neden seçilmemiş; bu hatalar öncelik sıralamasına girmiyor.");
      if (konusuz) yorum.push(konusuz + " kayıtta konu adı yok; konu önceliğine yazılamıyor.");
    }
    if (arsiv.length && toplam) {
      yorum.push(arsiv.length + " hata, konu öğrenildi olarak işaretlendiği için listeden düştü (Konu Takibi'ndeki tamamlanma tarihinden önce).");
    }

    return {
      toplam: toplam, nedensiz: nedensiz, konusuz: konusuz,
      nedeniBekleyen: hepsi.length - ham.length,
      arsiv: arsiv.length,
      nedenler: nedenler, dersler: dersler, yorum: yorum
    };
  }

  /* ---- 9) Konu önceliği (uygulamanın formülüyle AYNI) -------------
     Puan = (1,5·deneme konu eksiği + 1,0·test konu eksiği
             + 0,5·(işlem + anlamadım)) × (1 + AYT ağırlığı)
     Konu "öğrenildi" işaretlendikten ÖNCEKİ hatalar düşülür
     (index.html: topicLearnedAfter — aynı kural). */
  function oncelikler(snap, adet, secenek) {
    const s = snap || {};
    const hatalar = hataAyir(s).aktif;
    const memory = s.memory || {};
    const aytFn = (secenek && typeof secenek.ayt === "function") ? secenek.ayt : (s.ayt || function () { return 0; });
    const sayac = {};

    function ogrenildiSonra(key, logDate) {
      const mem = memory[key];
      if (!mem || !mem.completedAt) return false;
      const bitis = gunStr(String(mem.completedAt).split("T")[0]);
      const ld = gunStr(logDate);
      if (!ld) return true;
      return bitis ? (gunFarki(ld, bitis) < 0) : false;
    }

    hatalar.forEach(function (h) {
      if (!h.topic) return;
      const key = (h.lesson ? h.lesson + " > " : "") + h.topic;
      if (ogrenildiSonra(key, h.date)) return;
      const row = sayac[key] || (sayac[key] = {
        key: key, ders: h.lesson || "", konu: h.topic,
        adet: 0, deneme: 0, test: 0, konuEksigiDeneme: 0, konuEksigiTest: 0, islem: 0, anlamadim: 0,
        nedenler: {}, sonTarih: null, sinavlar: {}
      });
      row.adet += 1;
      if (h.kaynak === "test") row.test += 1; else row.deneme += 1;
      if (h.sinav) row.sinavlar[h.sinav] = (row.sinavlar[h.sinav] || 0) + 1;
      const bilgi = nedenBilgi(h.type);
      if (bilgi) {
        row.nedenler[bilgi.kod] = (row.nedenler[bilgi.kod] || 0) + 1;
        if (bilgi.kod === "konu-bilmiyordum" || bilgi.kod === "konu-eksigi") {
          if (h.kaynak === "test") row.konuEksigiTest += 1; else row.konuEksigiDeneme += 1;
        }
        if (bilgi.kod === "islem") row.islem += 1;
        if (bilgi.kod === "anlamadim") row.anlamadim += 1;
      }
      if (h.date && (!row.sonTarih || h.date > row.sonTarih)) row.sonTarih = h.date;
    });

    const liste = Object.keys(sayac).map(function (k) {
      const r = sayac[k];
      const ayt = Number(aytFn(r.ders)) || 0;
      const puan = yuvarla((1.5 * r.konuEksigiDeneme + 1.0 * r.konuEksigiTest + 0.5 * (r.islem + r.anlamadim)) * (1 + ayt), 2);
      // Baskın neden
      let baskin = null;
      Object.keys(r.nedenler).forEach(function (kod) {
        if (!baskin || r.nedenler[kod] > baskin.adet) {
          let bilgi = null;
          Object.keys(NEDEN_TABLO).forEach(function (x) { if (NEDEN_TABLO[x].kod === kod && !bilgi) bilgi = NEDEN_TABLO[x]; });
          baskin = { kod: kod, ad: bilgi ? bilgi.ad : kod, grup: bilgi ? bilgi.grup : "Diğer", adet: r.nedenler[kod], aksiyon: bilgi ? bilgi.aksiyon : "" };
        }
      });
      const gerekceParca = [];
      if (baskin && r.adet === 1) gerekceParca.push("1 hata: " + kucuk(baskin.ad));
      else if (baskin) gerekceParca.push(r.adet + " hatanın " + baskin.adet + "'" + iyelik(baskin.adet) + " " + kucuk(baskin.ad));
      Object.keys(r.nedenler).forEach(function (kod) {
        if (baskin && kod === baskin.kod) return;
        let bilgi = null;
        Object.keys(NEDEN_TABLO).forEach(function (x) { if (NEDEN_TABLO[x].kod === kod && !bilgi) bilgi = NEDEN_TABLO[x]; });
        if (bilgi) gerekceParca.push(r.nedenler[kod] + "'" + iyelik(r.nedenler[kod]) + " " + kucuk(bilgi.ad));
      });
      if (r.kaynakOzet) { /* yok */ }
      return {
        key: k, ders: r.ders, konu: r.konu, puan: puan, adet: r.adet,
        deneme: r.deneme, test: r.test, nedenler: r.nedenler, baskin: baskin,
        sonTarih: r.sonTarih, sinavlar: r.sinavlar,
        gerekce: gerekceParca.join(", ") + (r.sonTarih ? " · son hata " + fmtTR(r.sonTarih) : "")
      };
    }).filter(function (r) { return r.puan > 0; })
      .sort(function (a, b) { return b.puan - a.puan || b.adet - a.adet || a.key.localeCompare(b.key, "tr"); });

    const istenen = Math.max(1, Number(adet) || 3);
    return { liste: liste.slice(0, istenen), tumu: liste, toplamKonu: liste.length };
  }

  /* ---- 10) Hedef / ivme analizi (denemeIvmesi ile AYNI sayı) ------ */
  function hedefAnalizi(snap) {
    const s = snap || {};
    const plan = s.plan || {};
    const seri = sinavSerisi(s).liste;
    const son = seri.length ? seri[seri.length - 1] : null;
    const onceki = seri.length > 1 ? seri[seri.length - 2] : null;
    const hedef = plan.targetNet != null && plan.targetNet > 0 ? plan.targetNet : null;
    const tarih = plan.targetDate || null;

    const kalanGun = tarih ? gunFarki(tarih, s.bugun) : (s.kalanGunElle != null ? s.kalanGunElle : null);
    // v99 kuralı: yukarı yuvarlama YOK. denemeIvmesi() ile birebir aynı hesap.
    const haftaTam = (kalanGun != null && kalanGun > 0) ? Math.max(1, kalanGun / 7) : null;
    const kalanHafta = haftaTam ? Math.round(haftaTam * 10) / 10 : null;

    const sonNet = son ? son.net : null;
    const gerekenNet = (hedef != null && sonNet != null) ? yuvarla(hedef - sonNet, 2) : null;
    const gerekenIvme = (gerekenNet != null && haftaTam) ? yuvarla(gerekenNet / haftaTam, 2) : null;
    let olculenIvme = null, olcumGun = null;
    if (son && onceki && son.date && onceki.date) {
      const gun = gunFarki(son.date, onceki.date);
      if (gun > 0) { olcumGun = gun; olculenIvme = yuvarla((sonNet - onceki.net) * 7 / gun, 2); }
    }
    let durum = "veri-yok";
    if (!tarih && kalanGun == null) durum = "tarih-yok";
    else if (hedef == null) durum = "hedef-yok";
    else if (sonNet == null) durum = "deneme-yok";
    else if (gerekenIvme == null) durum = "sure-yok";
    else if (olculenIvme == null) durum = "ivme-bilinmiyor";
    else durum = (olculenIvme >= gerekenIvme) ? "yolunda" : "geride";

    const yorum = [];
    if (tarih) yorum.push("Sınav " + fmtTR(tarih) + (kalanGun != null ? " (" + kalanGun + " gün, " + tr(kalanHafta, 1) + " hafta)" : "") + ".");
    if (hedef != null) yorum.push("Hedef " + tr(hedef) + " net.");
    if (sonNet != null) yorum.push("Son net " + tr(sonNet) + " → hedefe " + (gerekenNet >= 0 ? tr(gerekenNet) + " net kaldı" : "hedef aşıldı (" + tr(Math.abs(gerekenNet)) + " net üstünde)") + ".");
    if (gerekenIvme != null) {
      yorum.push("Haftada " + (gerekenIvme >= 0 ? "+" : "") + tr(gerekenIvme) + " net gerekiyor" +
        (olculenIvme != null ? "; ölçülen tempo " + (olculenIvme >= 0 ? "+" : "") + tr(olculenIvme) + " net/hafta (" + olcumGun + " günlük iki denemeden)." : "; henüz iki deneme olmadığı için ölçülen tempo yok."));
      if (durum === "geride") yorum.push("Tempo gerekenin altında: aradaki fark " + tr(yuvarla(gerekenIvme - olculenIvme, 2)) + " net/hafta. Aynı tempoyla devam ederse hedefe ulaşmaz.");
      if (durum === "yolunda") yorum.push("Tempo yeterli; bu düzeni koru.");
    }
    if (durum === "hedef-yok") yorum.push("Hedef net girilmediği için gereken tempo hesaplanamadı — sayı uydurulmaz.");
    if (durum === "tarih-yok") yorum.push("Sınav tarihi girilmediği için kalan gün ve tempo hesaplanamadı — sayı uydurulmaz.");

    return {
      tarih: tarih, hedef: hedef, sonNet: sonNet,
      kalanGun: kalanGun, kalanHafta: kalanHafta,
      gerekenNet: gerekenNet, gerekenIvme: gerekenIvme,
      olculenIvme: olculenIvme, olcumGun: olcumGun,
      durum: durum, yorum: yorum
    };
  }

  /* ---- 11) Hafıza (Konu Takibi) analizi -------------------------- */
  function hafizaAnalizi(snap) {
    const s = snap || {};
    const mem = s.memory || {};
    const bugun = s.bugun;
    const kritikEsik = s.memCritical == null ? 20 : s.memCritical;
    const BASE = 0.16, SLOW = 0.90, FLOOR = 0.03;
    const rows = [], dueList = [];
    Object.keys(mem).forEach(function (key) {
      const m = mem[key];
      if (!m || !m.completedAt) return;
      let pct = 0;
      if (m.lastReview) {
        const d = gunFarki(bugun, String(m.lastReview).slice(0, 10)) || 0;
        const rate = Math.max(FLOOR, BASE * Math.pow(SLOW, Number(m.reviewCount) || 0));
        pct = Math.max(0, Math.min(100, Math.round(100 * Math.exp(-rate * Math.max(0, d)))));
      }
      const p = dersKonu(key);
      rows.push({ key: key, ders: p.ders, konu: p.konu, pct: pct, reviews: Number(m.reviewCount) || 0 });
      Object.keys(m.schedule || {}).forEach(function (g) {
        const d = gunStr(m.schedule[g]);
        if (d && gunFarki(d, bugun) <= 0) dueList.push({ key: key, gun: Number(g), date: d });
      });
    });
    const kritik = rows.filter(function (r) { return r.pct < kritikEsik; })
      .sort(function (a, b) { return a.pct - b.pct; });
    const takip = rows.length;
    const ortalama = takip ? Math.round(rows.reduce(function (a, r) { return a + r.pct; }, 0) / takip) : null;
    // Aynı konu birden çok basamakta gecikmiş olabilir → tekilleştir.
    const dueMap = {};
    dueList.forEach(function (d) { if (!dueMap[d.key]) dueMap[d.key] = d; });
    const due = Object.keys(dueMap).map(function (k) { return dueMap[k]; });

    const yorum = [];
    if (!takip) yorum.push("Konu Takibi'nde tamamlanmış konu yok; hafıza yorumu için veri yok.");
    else {
      yorum.push(takip + " konu takipte, ortalama hafıza gücü %" + ortalama + ".");
      if (kritik.length) yorum.push(kritik.length + " konu %" + kritikEsik + " eşiğinin altında: " + kritik.slice(0, 3).map(function (r) { return r.konu + " (%" + r.pct + ")"; }).join(", ") + (kritik.length > 3 ? " …" : "") + ". Bunlar bugün tekrar edilmeli.");
      if (due.length) yorum.push(due.length + " konunun tekrar günü gelmiş.");
    }
    return { takip: takip, kritik: kritik.length, kritikListe: kritik.slice(0, 5), bekleyen: due.length, ortalama: ortalama, yorum: yorum };
  }

  /* ---- 12) Öneriler (GEREKÇELİ) ---------------------------------- */
  function oneriler(snap, adet) {
    const s = snap || {};
    const list = [];
    const ekle = function (id, baslik, gerekce, aksiyon, oncelik) {
      list.push({ id: id, baslik: baslik, gerekce: gerekce, aksiyon: aksiyon, oncelik: oncelik });
    };

    const vk = veriKontrol(s);
    const eksik = vk.filter(function (x) { return x.durum === "eksik"; });
    const net = netAnalizi(s);
    const hata = hataAnalizi(s);
    const hedef = hedefAnalizi(s);
    const onc = oncelikler(s, 3, { ayt: s.ayt });
    const haf = hafizaAnalizi(s);

    // 0) Veri yoksa öneri değil, VERİ İSTEĞİ (sayı uydurulmaz)
    const denemeYok = !net.sayi;
    if (denemeYok) {
      ekle("veri-deneme", "Önce deneme sonucu gir",
        "Net trendi ve ders kırılımı için en az bir deneme kaydı gerekiyor; şu an " +
        (net.atlanan.length ? net.atlanan.length + " kayıt var ama net/D-Y-B boş" : "hiç deneme kaydı yok") + ".",
        "Denemelerim → Yeni Deneme: D/Y/B gir (her yanlışa konu + neden seç).", 1);
    }
    eksik.forEach(function (x) {
      if (x.alan === "Sınav tarihi") ekle("veri-tarih", "Sınav tarihini gir", x.mesaj + " " + x.etki, "Planlama → Hedefler → sınav tarihi.", 1);
      if (x.alan === "Hedef net") ekle("veri-hedef", "Hedef neti gir", x.mesaj + " " + x.etki, "Planlama → Hedefler → hedef net.", 1);
    });
    if (s.okulizyon && s.okulizyon.bekleyen > 0) {
      ekle("veri-okulizyon", s.okulizyon.bekleyen + " Okulizyon sorusuna neden seç",
        "Okulizyon'dan " + s.okulizyon.bekleyen + " soru analiz bekliyor; neden seçilmeden bu sorular konu önceliğine girmiyor.",
        "Profil → Okulizyon → «Nedenleri seç»: her soruya neden ver.", 2);
    }
    if (hata.nedensiz > 0) {
      ekle("veri-neden", hata.nedensiz + " hataya neden seç",
        hata.nedensiz + " hata nedensiz kaldığı için konu önceliğine girmiyor; sıralama eksik hesaplanıyor.",
        "Denemelerim → ilgili deneme → hatanın yanındaki Neden alanı.", 2);
    }

    // 1) En zayıf konu: gerekçesiyle
    const ilk = onc.liste[0];
    if (ilk) {
      ekle("konu-" + ilk.key, ilk.ders ? ilk.ders + ": " + ilk.konu : ilk.konu,
        "Bu konuda " + ilk.gerekce + ".",
        ilk.baskin && ilk.baskin.aksiyon ? ilk.baskin.aksiyon + "." : "Konuyu tekrar edip 10 soru çöz.", 2);
    }

    // 2) Baskın hata nedeni → davranış önerisi
    // (En zayıf konunun baskın nedeni aynıysa tekrar etme: aynı aksiyon iki kez.)
    const enBuyuk = hata.nedenler[0];
    const ayniNeden = !!(ilk && ilk.baskin && enBuyuk && ilk.baskin.kod === enBuyuk.kod);
    if (enBuyuk && !ayniNeden && hata.toplam >= 4 && enBuyuk.yuzde >= 25) {
      ekle("neden-" + enBuyuk.kod, enBuyuk.grup + " için çalışma düzeni",
        "Hataların %" + enBuyuk.yuzde + "'" + iyelik(enBuyuk.yuzde) + " (" + enBuyuk.adet + "/" + hata.toplam + ") «" + kucuk(enBuyuk.ad) + "» kaynaklı; " +
          (enBuyuk.kod === "islem" || enBuyuk.kod === "kodlama" || enBuyuk.kod === "sure"
            ? "bilgin var, uygulamada kaybediyorsun; kontrollü çözüm ve süre disiplini gerek."
            : "konu bilgisi tamamlanmadan soru sayısını artırmak bu açığı kapatmaz."),
        enBuyuk.aksiyon + ".", 2);
    }

    // 3) Net düşüşü
    if (net.fark != null && net.fark < 0) {
      const dusen = net.dersler.dusen[0];
      ekle("net-dusus", "Net düşüşünü kapat",
        "Son iki denemede net " + tr(net.onceki.net) + " → " + tr(net.son.net) + " (" + tr(net.fark) + ")" +
        (dusen ? "; en çok düşen ders " + dusen.ders + " (" + tr(dusen.fark) + " net)" : "") + ".",
        (dusen ? dusen.ders + " dersine" : "Düşen derse") + " haftada 2 ekstra soru seti ekle; yanlışları aynı gün nedenleriyle kaydet.", 2);
    }

    // 4) İvme geride
    if (hedef.durum === "geride") {
      ekle("ivme", "Tempi yükselt",
        "Hedef " + tr(hedef.hedef) + " net; haftada " + tr(hedef.gerekenIvme) + " net gerekiyor, ölçülen " + tr(hedef.olculenIvme) +
        " net/hafta. Fark " + tr(yuvarla(hedef.gerekenIvme - hedef.olculenIvme, 2)) + " net/hafta.",
        "Haftada bir deneme + her denemeden sonra hatalı konuların tekrarı; eksik kalan " +
        tr(yuvarla(hedef.gerekenIvme - hedef.olculenIvme, 2)) + " neti konu tekrarından kapat.", 2);
    }

    // 5) Hafıza kritik
    if (haf.kritik > 0) {
      ekle("hafiza", haf.kritik + " konu kritik hafızada",
        "Konu Takibi'nde " + haf.kritik + " konu %20'nin altında; bunlar bugün tekrar edilmezse öğrenilen konu kaybediliyor.",
        "Konu Takibi → ACİL TEKRAR: " + haf.kritikListe.slice(0, 3).map(function (r) { return r.konu; }).join(", ") + ".", 2);
    } else if (haf.bekleyen > 0 && !denemeYok) {
      ekle("hafiza-bekleyen", haf.bekleyen + " konunun tekrar günü geldi",
        "Tekrar takviminde " + haf.bekleyen + " konu bugün/geçmişte bekliyor; tekrar ertelenirse hafıza gücü düşer.",
        "Konu Takibi → Tekrar Ettim ile bugün kapat.", 3);
    }

    // 6) Yaklaşan okul sınavı
    const okul = (s.plan && s.plan.schoolExams) || [];
    const yakin = okul.map(function (se) {
      return { se: se, kalan: gunFarki(se.date, s.bugun) };
    }).filter(function (x) { return x.kalan != null && x.kalan >= 0 && x.kalan <= 14; })
      .sort(function (a, b) { return a.kalan - b.kalan; })[0];
    if (yakin) {
      ekle("okul", yakin.se.lesson + " sınavı " + yakin.kalan + " gün sonra",
        "Planlamada " + fmtTR(yakin.se.date) + " tarihli " + yakin.se.lesson + " sınavı var" +
        (yakin.se.topics.length ? " (" + yakin.se.topics.length + " konu)" : "") + "; son 3 gün yeni konu açmak yerine tekrar gerekir.",
        yakin.se.topics.length ? "İlk 3 konudan başla: " + yakin.se.topics.slice(0, 3).join(", ") + "." : "Sınav kapsamını Planlama'da seç, hazırlık takvimi kendiliğinden kurulur.", 3);
    }

    // 7) Sıradaki hazırlık oturumu (varsa gerçek plan)
    const hazir = (s.hazirlik || []).filter(function (k) { return k.date >= s.bugun; })[0];
    if (hazir) {
      const adlar = hazir.konular.slice(0, 2).map(function (k) { return dersKonu(k).konu; }).join(", ");
      ekle("hazirlik", (hazir.date === s.bugun ? "Bugün" : fmtTR(hazir.date)) + " planı: " + (adlar || hazir.ders || "hazırlık oturumu"),
        "Takvimde bu oturum var (" + (hazir.son ? "son tekrar" : hazir.tekrar ? "tekrar" : "çalışma") + ")" +
        (hazir.konular.length ? ", " + hazir.konular.length + " konu" : "") + "; plan dışına çıkmak konu tekrarını aksatır.",
        hazir.konular.length ? "Bu oturumu bitir, sonra günün kalanını soru çözümüne ayır." : "Takvimdeki oturumu uygula.", 3);
    }

    list.sort(function (a, b) { return a.oncelik - b.oncelik; });
    const istenen = Math.max(1, Number(adet) || 5);
    return list.slice(0, istenen);
  }

  /* ---- 13) Rapor + panel kartları -------------------------------- */
  function rapor(snap) {
    const s = snap || {};
    const vk = veriKontrol(s);
    const eksik = vk.filter(function (x) { return x.durum === "eksik" || x.durum === "kısmi"; });
    const net = netAnalizi(s);
    const hata = hataAnalizi(s);
    const hedef = hedefAnalizi(s);
    const onc = oncelikler(s, 3, { ayt: s.ayt });
    const haf = hafizaAnalizi(s);
    const oneri = oneriler(s, 4);

    const bolumler = [];
    bolumler.push({ id: "durum", baslik: "Durum", satirlar: hedef.yorum.concat(haf.yorum) });
    bolumler.push({ id: "net", baslik: "Net analizi", satirlar: net.yorum });
    bolumler.push({ id: "neden", baslik: "Hata nedenleri", satirlar: hata.yorum });
    bolumler.push({
      id: "oncelik", baslik: "Konu önceliği",
      satirlar: onc.liste.length ? onc.liste.map(function (o, i) {
        return (i + 1) + ") " + (o.ders ? o.ders + ": " : "") + o.konu + " — " + o.adet + " hata (" + o.gerekce + ")";
      }) : ["Konu önceliği için hata kaydı yok."]
    });
    bolumler.push({
      id: "oneri", baslik: "Öneriler",
      satirlar: oneri.length ? oneri.map(function (o) { return o.baslik + " — " + o.gerekce + " → " + o.aksiyon; }) : ["Öneri üretmek için veri yok."]
    });
    bolumler.push({
      id: "eksik", baslik: "Eksik veri",
      satirlar: eksik.length ? eksik.map(function (x) { return x.mesaj + " (" + x.nerede + ")" + (x.etki ? " — " + x.etki : ""); })
        : ["Tüm veriler tam: sınav tarihi, hedef net, deneme netleri ve hata nedenleri kayıtlı."]
    });

    return {
      surum: SURUM, bugun: s.bugun, ad: s.ad,
      veri: vk, eksik: eksik,
      net: net, hata: hata, hedef: hedef, oncelik: onc, hafiza: haf, oneriler: oneri,
      bolumler: bolumler
    };
  }

  // Panelde gösterilecek kısa kartlar (HTML; kullanıcı verisi kaçırılır)
  function kartlar(snap, ayar) {
    const s = snap || {};
    const a = ayar || {};
    const r = rapor(s);
    const out = [];

    // 1) Durum
    const d = [];
    if (r.hedef.tarih) d.push("Sınav " + fmtTR(r.hedef.tarih) + (r.hedef.kalanGun != null ? " (" + r.hedef.kalanGun + " gün)" : ""));
    if (r.hedef.hedef != null) d.push("hedef " + tr(r.hedef.hedef) + " net");
    if (r.hedef.sonNet != null) d.push("son net " + tr(r.hedef.sonNet));
    if (r.net.sayi) d.push(r.net.sayi + " deneme kaydı");
    if (!d.length) {
      out.push("<b>Koç:</b> Yorum için önce sınav tarihi ve deneme sonucu gerekiyor. Planlama → Hedefler ve Denemelerim → Yeni Deneme.");
    } else {
      out.push("<b>Durum:</b> " + esc(d.join(" · ")) + ".");
    }

    // 2) Net analizi
    if (r.net.sayi) {
      const p = [];
      if (r.net.onceki) p.push(tr(r.net.onceki.net) + " → " + tr(r.net.son.net) + " (" + (r.net.fark >= 0 ? "+" : "") + tr(r.net.fark) + " net)" + (r.net.farkGun ? ", " + r.net.farkGun + " günde" : ""));
      if (r.net.haftalik != null) p.push("haftada " + (r.net.haftalik >= 0 ? "+" : "") + tr(r.net.haftalik) + " net");
      if (r.net.ortalamaSon3 != null) p.push("son 3 ortalama " + tr(r.net.ortalamaSon3));
      if (r.net.enZayifDers) p.push("en zayıf ders " + r.net.enZayifDers.ders + " (" + tr(r.net.enZayifDers.net) + " net, %" + r.net.enZayifDers.oran + ")");
      out.push("<b>Net:</b> " + esc(r.net.son.name) + " " + tr(r.net.son.net) + " net" + (p.length ? " — " + esc(p.join(" · ")) : "") + ".");
    }

    // 3) Hata nedenleri (dağılımın TAMAMI; kalanı sayıyla söylenir)
    if (r.hata.toplam && !r.hata.nedenler.length && r.hata.nedensiz) {
      out.push("<b>Hata nedenleri:</b> " + esc(r.hata.toplam + " hatanın " + r.hata.toplam + "'" + iyelik(r.hata.toplam) +
        "nde de neden seçilmemiş; dağılım için her yanlışa neden gir (Denemelerim)."));
    } else if (r.hata.toplam) {
      const parca = r.hata.nedenler.slice(0, 4).map(function (n) { return n.ad + " " + n.adet + " (%" + n.yuzde + ")"; });
      if (r.hata.nedenler.length > 4) parca.push("+" + (r.hata.nedenler.length - 4) + " neden daha");
      if (r.hata.nedensiz) parca.push("neden seçilmemiş " + r.hata.nedensiz);
      out.push("<b>Hata nedenleri:</b> " + esc(r.hata.toplam + " hatanın " + parca.join(", ")) + ".");
    } else if (r.hata.arsiv) {
      out.push("<b>Hata nedenleri:</b> Aktif hata yok — " + r.hata.arsiv + " hata, konu öğrenildi işaretlendiği için düştü.");
    }

    // 4) Konu önceliği
    if (!r.oncelik.liste.length && r.hata.toplam) {
      out.push("<b>Öncelik:</b> " + esc(r.hata.toplam + " hatanın nedenini seçmeden konu önceliği hesaplanmaz — Denemelerim → hatanın yanındaki Neden."));
    } else if (r.oncelik.liste.length) {
      const t = r.oncelik.liste.slice(0, 2).map(function (o, i) {
        return (i + 1) + ") " + (o.ders ? o.ders + ": " : "") + o.konu + " — " + o.adet + " hata (" + (o.baskin ? kucuk(o.baskin.ad) : "neden yok") + ")";
      });
      if (r.oncelik.liste.length > 2) t.push("+" + (r.oncelik.liste.length - 2) + " konu daha (Konu Takibi)");
      out.push("<b>Öncelik:</b> " + esc(t.join(" · ")) + ".");
    }

    // 5) Öneri (gerekçesiyle)
    if (r.oneriler.length) {
      const o = r.oneriler[0];
      out.push("<b>Öneri:</b> " + esc(o.baslik) + " — " + esc(o.gerekce) + " → " + esc(o.aksiyon));
    }

    // 6) Eksik veri (varsa)
    if (r.eksik.length) {
      const e = r.eksik.slice(0, 3).map(function (x) { return x.mesaj + " (" + x.nerede + ")"; });
      out.push("<b>Eksik veri:</b> " + esc(e.join(" ")));
    }

    const adet = Math.max(1, Number(a.adet) || 6);
    return out.slice(0, adet);
  }

  /* ---- 14) Dışa açılım ------------------------------------------- */
  const api = {
    SURUM: SURUM,
    NEDEN_TABLO: NEDEN_TABLO,
    KAYNAK: KAYNAK,
    kucuk: kucuk, iyelik: iyelik, tr: tr, esc: esc, yuvarla: yuvarla, fmtTR: fmtTR, gunFarki: gunFarki, gunStr: gunStr, dersKonu: dersKonu,
    nedenCoz: nedenCoz, nedenAd: nedenAd, nedenBilgi: nedenBilgi,
    netCoz: netCoz, soruSayisi: soruSayisi, sinavSerisi: sinavSerisi, dersNetleri: dersNetleri,
    snapshot: snapshot, snapshotCtx: snapshotCtx,
    veriKontrol: veriKontrol, eksikler: eksikler, hataAyir: hataAyir,
    netAnalizi: netAnalizi, hataAnalizi: hataAnalizi, oncelikler: oncelikler,
    hedefAnalizi: hedefAnalizi, hafizaAnalizi: hafizaAnalizi,
    oneriler: oneriler, rapor: rapor, kartlar: kartlar
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (kok) kok.KOC_MOTOR = api;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));
