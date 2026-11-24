/* ============================================================
   ANALİZ MERKEZİ — KOÇLUK HATTI MESAJ KATMANI (site/mesaj.js)
   Amaç: "mesaj özelliği" gerçekten çalışsın.
     • Panel her açılışta tazelenir (eskiden bayat/boş kalıyordu).
     • Öğrenci mesaj YAZABİLİR (önceden hiç giriş alanı yoktu).
     • Yanıtlar öğrencinin KENDİ verisinden üretilir (deneme netleri,
       hatalı konular, Okulizyon'dan gelen sorular, kalan gün).
       Bu bir yapay zekâ sohbeti ya da insan koç değildir: veriye
       dayalı otomatik koçtur. Sohbet cihazda (localStorage) saklanır.
   Klasik script olarak yüklenir; kocYanit() saf fonksiyondur ve
   tests/mesaj.test.js tarafından doğrudan test edilir.
   ============================================================ */
(function (kok) {
  "use strict";

  const ANAHTAR = "am_koc_sohbet_v1";
  const EN_FAZLA = 60;
  const HAVUZ = [
    "netlerim nasıl?",
    "hangi konuya çalışmalıyım?",
    "hata nedenlerim ne?",
    "sınava kaç gün kaldı?",
    "bugün ne çalışayım?",
    "eksik veri ne?"
  ];

  // ---- 1) Metin yardımcıları (saf) ----
  function sade(s) {
    return String(s == null ? "" : s)
      .replace(/ı/g, "i").replace(/I/g, "i").replace(/İ/g, "i")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function ic(metin) {
    for (let i = 1; i < arguments.length; i++) if (metin.indexOf(arguments[i]) >= 0) return true;
    return false;
  }
  function yuvarla(n, b) {
    const k = Math.pow(10, b == null ? 2 : b);
    return Math.round((Number(n) || 0) * k) / k;
  }
  function tr(n) { return String(yuvarla(n, 2)).replace(".", ","); }
  function egitim(ad) { return ad ? ad : "dostum"; }
  // "YYYY-MM-DD" → "21.11.2026" (saat dilimi kaydırmadan)
  function fmtGun(g) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(g || ""));
    return m ? (m[3] + "." + m[2] + "." + m[1]) : String(g || "");
  }

  // ---- 2) Veri yardımcıları (saf) ----
  function netHesap(lessons) {
    let d = 0, w = 0;
    const l = lessons || {};
    Object.keys(l).forEach(function (k) {
      d += Number(l[k] && l[k].d) || 0;
      w += Number(l[k] && l[k].w) || 0;
    });
    return { d: d, w: w, net: yuvarla(d - w / 4, 2) };
  }
  function sinavNet(ex) {
    if (!ex) return 0;
    if (typeof ex.net === "number" && isFinite(ex.net)) return ex.net;
    return netHesap(ex.lessons).net;
  }
  function zayifKonular(ctx, adet) {
    const sayac = {}, dersSayac = {};
    ((ctx && ctx.errorLogs) || []).forEach(function (l) {
      const t = String((l && (l.topic || l.konu)) || "").trim();
      const d = String((l && (l.lesson || l.ders)) || "").trim();
      if (t) sayac[t] = (sayac[t] || 0) + 1;
      if (d) dersSayac[d] = (dersSayac[d] || 0) + 1;
    });
    ((ctx && ctx.okulizyon && ctx.okulizyon.sorular) || []).forEach(function (r) {
      const t = String((r && r.topic) || "").trim();
      const d = String((r && r.lesson) || "").trim();
      if (t) sayac[t] = (sayac[t] || 0) + 1;
      if (d) dersSayac[d] = (dersSayac[d] || 0) + 1;
    });
    const konular = Object.keys(sayac).map(function (k) { return { ad: k, adet: sayac[k] }; })
      .sort(function (a, b) { return b.adet - a.adet || a.ad.localeCompare(b.ad, "tr"); })
      .slice(0, adet || 3);
    const dersler = Object.keys(dersSayac).map(function (k) { return { ad: k, adet: dersSayac[k] }; })
      .sort(function (a, b) { return b.adet - a.adet || a.ad.localeCompare(b.ad, "tr"); });
    return { konular: konular, dersler: dersler };
  }

  // ---- 2b) KOÇLUK MOTORU KÖPRÜSÜ (v102) ----
  // Tek kaynak site/koc.js. Sohbet, veri varsa YORUM satırlarını oradan alır
  // (net değişimi, hata nedenleri, konu önceliği). Motor yoksa eski saf
  // yollar çalışmaya devam eder → testler ve çevrimdışı durum bozulmaz.
  function motor() {
    const m = kok && kok.KOC_MOTOR;
    return (m && typeof m.rapor === "function") ? m : null;
  }
  function bolum(rap, ad) {
    const liste = (rap && Array.isArray(rap.bolumler)) ? rap.bolumler : [];
    const h = sade(ad);
    for (let i = 0; i < liste.length; i++) {
      if (liste[i] && sade(liste[i].baslik) === h) return Array.isArray(liste[i].satirlar) ? liste[i].satirlar : [];
    }
    return [];
  }
  function maddeli(baslik, satirlar, sinir) {
    const d = satirlar.slice(0, sinir || 6);
    return [baslik].concat(d.map(function (x) { return "• " + x; })).join("\n");
  }

  // ---- 3) Yanıt motoru (saf; test edilebilir) ----
  // ctx: { ad, sinif, exams:[{name,date,net,lessons}], errorLogs:[{lesson,topic}],
  //        okulizyon:{bekleyen, sinav, sorular:[{lesson,topic,status}]},
  //        okuma:{sayfa,dakika}, kalanGun }
  function kocYanit(metin, ctx) {
    const c = ctx || {};
    const m = sade(metin);
    const ad = egitim(c.ad);
    const sinavlar = Array.isArray(c.exams) ? c.exams.filter(Boolean) : [];
    const okz = c.okulizyon || {};
    const sorular = Array.isArray(okz.sorular) ? okz.sorular : [];

    if (!m) {
      return "Bir şey yazmadan yanıt veremem. Örneğin: " + HAVUZ.map(function (q) { return "«" + q + "»"; }).join(", ");
    }

    // Yardım / yetenek listesi
    if (ic(m, "yardim", "ne yapabilirsin", "komut", "nasil kullan", "sen kimsin", "kimsin")) {
      return [
        "Ben verilerinden konuşan otomatik koçum. Şunları sorabilirsin:",
        "• netlerim nasıl? → net değişimi, ders kırılımı, hedefe kalan",
        "• hangi konuya çalışmalıyım? → hatalardan çıkan öncelik sırası (gerekçeli)",
        "• hata nedenlerim ne? → neden dağılımı + baskın nedenin aksiyonu",
        "• bugün ne çalışayım? → bugünün maddesi (plan varsa plan)",
        "• bu hafta ne yapmalıyım? → gerekçeli çalışma önerileri",
        "• sınava kaç gün kaldı? → tarih, hedef, gereken/ölçülen tempo",
        "• okulizyon → bekleyen sorular ve neden seçme adımı",
        "• eksik veri ne? → koçun okuyamadığı kayıtlar, adlarıyla",
        "Not: insan koç değilim; yanıtlarım uygulamadaki kayıtlarından üretilir."
      ].join("\n");
    }

    // Selamlama
    if (ic(m, "merhaba", "selam", "gunaydin", "iyi aksam", "iyi geceler", "hey", "naber", "nasilsin")) {
      const satirlar = ["Merhaba " + ad + "! Buradayım."];
      if (c.rapor && c.rapor.hedef) {
        const h = c.rapor.hedef;
        if (h.sonNet != null) satirlar.push("Son netin " + tr(h.sonNet) + (h.tarih ? " · sınava " + h.kalanGun + " gün" : "") + ".");
        else satirlar.push("Henüz deneme kaydın yok; Denemelerim'e bir deneme girince netlerini yorumlayabilirim.");
      } else if (sinavlar.length) {
        const son = sinavlar[sinavlar.length - 1];
        satirlar.push("Son denemen «" + (son.name || "deneme") + "» neti: " + tr(sinavNet(son)) + ".");
      } else {
        satirlar.push("Henüz deneme kaydın yok; Denemelerim'e bir deneme girince netlerini yorumlayabilirim.");
      }
      if (okz.bekleyen) satirlar.push("Analiz bekleyen " + okz.bekleyen + " soru var — Profil → Okulizyon ile nedenlerini seçebilirsin.");
      satirlar.push("Ne öğrenmek istersin? Ör. «" + HAVUZ[0] + "»");
      return satirlar.join("\n");
    }

    // Net / deneme analizi
    if (ic(m, "net", "puan", "deneme", "sonuc", "ortalam", "trend", "gelis")) {
      if (c.rapor) {
        const netB = bolum(c.rapor, "Net analizi").filter(function (x) { return !/Karşılaştırılacak deneme neti yok/.test(x); });
        if (!netB.length) {
          const ek = bolum(c.rapor, "Eksik veri");
          const d = ek.filter(function (x) { return /deneme/i.test(x); });
          return ["Net yorumu için veri yok.", maddeli("Eksik olan:", d.length ? d : ["Deneme sonucu (Denemelerim → Yeni Deneme)"], 3)].join("\n");
        }
        const satirlar = [maddeli("Net analizin (kendi kayıtlarından):", netB, 8)];
        const durum = bolum(c.rapor, "Durum").filter(function (x) { return /net|hedef|tempo|ivme/i.test(x); });
        if (durum.length) satirlar.push(maddeli("Hedefe göre:", durum, 4));
        satirlar.push("Konu bazlı öncelik için «hangi konuya çalışmalıyım?» yaz.");
        return satirlar.join("\n");
      }
      if (!sinavlar.length) {
        return "Henüz deneme sonucu yok. Denemelerim → Yeni Deneme ile D/Y/B gir; ilk kayıttan sonra net trendini, en güçlü ve en zayıf derslerini yorumlayabilirim.";
      }
      const son = sinavlar[sinavlar.length - 1];
      const onceki = sinavlar.length > 1 ? sinavlar[sinavlar.length - 2] : null;
      const net = sinavNet(son);
      const satirlar = [];
      satirlar.push("Son denemen: «" + (son.name || "deneme") + "»" + (son.date ? " (" + son.date + ")" : "") + " → net " + tr(net) + ".");
      if (onceki) {
        const fark = yuvarla(net - sinavNet(onceki), 2);
        satirlar.push("Önceki denemeye göre " + (fark >= 0 ? "+" : "") + tr(fark) + " net " + (fark >= 0 ? "yükselmiş." : "düşmüş."));
      }
      if (sinavlar.length >= 3) {
        const sonUc = sinavlar.slice(-3).map(sinavNet);
        const ort = sonUc.reduce(function (a, b) { return a + b; }, 0) / sonUc.length;
        satirlar.push("Son 3 denemenin ortalaması: " + tr(ort) + " net.");
      }
      // En zayıf ders (net oranı en düşük)
      const dersler = Object.keys(son.lessons || {});
      if (dersler.length) {
        let en = null;
        dersler.forEach(function (d) {
          const v = son.lessons[d] || {};
          const toplam = (Number(v.d) || 0) + (Number(v.w) || 0) + (Number(v.e) || 0);
          if (!toplam) return;
          const oran = ((Number(v.d) || 0) - (Number(v.w) || 0) / 4) / toplam;
          if (!en || oran < en.oran) en = { ad: d, oran: oran, v: v };
        });
        if (en) {
          satirlar.push("En zayıf dersin " + en.ad + ": " + (Number(en.v.d) || 0) + "D / " + (Number(en.v.w) || 0) + "Y / " + (Number(en.v.e) || 0) + "B. Bu dersten başlamak en hızlı net artışını verir.");
        }
      }
      satirlar.push("Konu bazlı önceliği görmek için «hangi konuya çalışmalıyım?» yaz.");
      return satirlar.join("\n");
    }

    // Hata nedenleri (v102): "neden yanlış yapıyorum?", "hata nedenlerim"
    if (ic(m, "neden", "niye", "hata neden", "yanlis neden", "dikkatsiz")) {
      if (c.rapor) {
        const h = bolum(c.rapor, "Hata nedenleri");
        const satirlar = [maddeli("Hata nedenlerin (kayıtlardan):", h.length ? h : ["Hata kaydı yok; neden dağılımı çıkarılamaz."], 8)];
        const nedenler = (c.rapor.hata && Array.isArray(c.rapor.hata.nedenler)) ? c.rapor.hata.nedenler : [];
        if (nedenler.length && nedenler[0].aksiyon) {
          satirlar.push("Baskın nedenin («" + nedenler[0].ad + "») aksiyonu: " + nedenler[0].aksiyon + ".");
        }
        if (nedenler.length > 1) {
          satirlar.push("Diğer nedenler: " + nedenler.slice(1, 4).map(function (n) { return n.ad + " (" + n.adet + ") → " + n.aksiyon; }).join(" · "));
        }
        return satirlar.join("\n");
      }
      const z0 = zayifKonular(c, 3);
      if (!z0.konular.length) return "Kayıtlı hatalı soru yok. Denemelerim'de yanlış/boş sorulara konu ve NEDEN girersen hangi tip hatayı sık yaptığını yorumlayabilirim.";
      return "Hata nedenleri seçilmemiş olabilir. Şu an yalnız konuları görebiliyorum: " +
        z0.konular.map(function (k) { return k.ad + " (" + k.adet + ")"; }).join(", ") +
        ". Denemelerim'de «Nedenleri seç» ile her soruya neden ver.";
    }

    // Eksik veri (v102): veri yoksa sayı uydurulmaz, adıyla söylenir.
    // DİKKAT: konu dalındaki "eksik" burayı yutmamalı → "veri" şartı aranıyor.
    if (ic(m, "eksik veri", "veri eksik", "veri yok", "hangi veri", "hangi bilgi", "ne gir", "kayit yok", "hangi kayit")) {
      if (c.rapor) {
        const ek = bolum(c.rapor, "Eksik veri");
        return maddeli("Koçun kullandığı kayıtlar:", ek.length ? ek : ["Tüm veriler tam: sınav tarihi, hedef net, deneme netleri ve hata nedenleri kayıtlı."], 6);
      }
      return "Koç sınav tarihi, hedef net, deneme sonuçları ve hata nedenleriyle çalışır. Bunlar Planlama → Hedefler ve Denemelerim bölümlerinden girilir.";
    }

    // Öneri (v102): "bu hafta ne yapmalıyım?", "nasıl çalışsam?", "öneri ver"
    if (ic(m, "oner", "tavsiye", "ne yapmaliyim", "bu hafta", "haftalik plan", "nasil calis", "calisma plan")) {
      if (c.rapor) {
        const liste = Array.isArray(c.rapor.oneriler) ? c.rapor.oneriler : [];
        if (!liste.length) {
          return ["Önerecek veri yok.", maddeli("Eksik olan:", bolum(c.rapor, "Eksik veri").slice(0, 3), 3)].join("\n");
        }
        const satirlar = ["Verilerine göre bu hafta (" + liste.length + " madde):"];
        liste.forEach(function (o, i) {
          satirlar.push((i + 1) + ") " + o.baslik);
          satirlar.push("   Gerekçe: " + o.gerekce);
          satirlar.push("   → " + o.aksiyon);
        });
        return satirlar.join("\n");
      }
      const z = zayifKonular(c, 2);
      if (!z.konular.length) return "Öneri için veri yok. Denemelerim'e bir deneme gir (yanlışlara konu + neden), plan ve öneri otomatik çıkar.";
      return "Öncelikli konular: " + z.konular.map(function (k, i) { return (i + 1) + ") " + k.ad + " (" + k.adet + " hata)"; }).join(", ") +
        ". Her konu için 20 dk konu + 10 soru; yanlışları aynı gün nedenleriyle kaydet.";
    }

    // Bugün ne çalışayım? (v102) — hazırlık planı varsa plan, yoksa en öncelikli konu
    if (ic(m, "bugun", "ne calisayim", "bugunku", "gunluk plan", "simdi ne", "ne yapayim")) {
      const s = c.snap;
      const bugun = s ? s.bugun : null;
      const oturumlar = (s && Array.isArray(s.hazirlik)) ? s.hazirlik.filter(function (k) { return k.date === bugun; }) : [];
      if (oturumlar.length) {
        const satirlar = ["Bugünün planı (" + fmtGun(bugun) + "):"];
        oturumlar.forEach(function (k) {
          const tur = k.son ? "son tekrar" : (k.tekrar ? "tekrar" : "yeni konu");
          const icerik = (k.konular && k.konular.length)
            ? k.konular.map(function (x) { return String(x).replace(" > ", ": "); }).join(" · ")
            : (k.etiket || k.ders || "plan maddesi");
          const onek = (k.ders && !new RegExp("^" + k.ders + "\\s*:").test(icerik)) ? k.ders + " — " : "";
          satirlar.push("• " + onek + tur + (k.gunOnce != null ? " (sınava " + k.gunOnce + " gün)" : "") + ": " + icerik);
        });
        satirlar.push("Bitirince Konu Takibi'nde işaretle; yarınki tekrar otomatik planlanır.");
        return satirlar.join("\n");
      }
      const oncelik = (c.rapor && c.rapor.oncelik && Array.isArray(c.rapor.oncelik.liste)) ? c.rapor.oncelik.liste[0] : null;
      if (oncelik) {
        return [
          "Bugün için plan kaydı yok; verilerine göre en öncelikli iş:",
          "• " + (oncelik.ders ? oncelik.ders + ": " : "") + oncelik.konu + " — " + oncelik.gerekce + ".",
          "→ " + (oncelik.baskin && oncelik.baskin.aksiyon ? oncelik.baskin.aksiyon : "Konuyu tekrar edip 10 soru çöz") + ".",
          (c.rapor && c.rapor.hedef && c.rapor.hedef.tarih)
            ? "Yarın: aynı konudan 10 soru + 15 dk tekrar (Konu Takibi'nde işaretle)."
            : "Planlama sayfasında sınav tarihini girersen günlük plan da buradan gelir."
        ].join("\n");
      }
      return "Bugün için öneri üretemedim: hata kaydı ya da plan yok. Denemelerim'e bir deneme girersen (yanlışlara konu + neden) yarın ne çalışacağını buradan söylerim.";
    }

    // Konu / öncelik
    if (ic(m, "konu", "zayif", "eksik", "calis", "oncelik", "nereden basla", "takildigim", "hata")) {
      if (c.rapor) {
        const oncelik = bolum(c.rapor, "Konu önceliği").filter(function (x) { return !/Konu önceliği için hata kaydı yok/.test(x); });
        if (!oncelik.length) {
          const d = bolum(c.rapor, "Eksik veri").filter(function (x) { return /Hata kaydı|deneme/i.test(x); });
          return ["Konu önceliği için veri yok.", maddeli("Eksik olan:", d.length ? d : ["Hata kaydı (Denemelerim → Konu + Neden)"], 3)].join("\n");
        }
        const satirlar = [maddeli("Öncelik sıran (hataların ve AYT ağırlığına göre):", oncelik, 6)];
        const oner = bolum(c.rapor, "Öneriler").slice(0, 2);
        if (oner.length) satirlar.push(maddeli("Ne yapmalı:", oner, 2));
        return satirlar.join("\n");
      }
      const z = zayifKonular(c, 3);
      if (!z.konular.length) {
        return "Kayıtlı hatalı soru konusu yok. Denemelerim'de yanlış/boş sorulara konu + neden girersen (veya Okulizyon'dan çekim yaparsan) burada en çok tekrar eden konuları sıralarım.";
      }
      const satirlar = ["Hatalı sorularına göre öncelikli konular:"];
      z.konular.forEach(function (k, i) { satirlar.push((i + 1) + ") " + k.ad + " — " + k.adet + " soru"); });
      if (z.dersler.length) satirlar.push("Ders kırılımı: " + z.dersler.slice(0, 3).map(function (d) { return d.ad + " (" + d.adet + ")"; }).join(", ") + ".");
      satirlar.push("Konu Takibi sayfasında bu konuların hafıza gücünü ve ACİL TEKRAR butonlarını görebilirsin.");
      return satirlar.join("\n");
    }

    // Okulizyon
    if (ic(m, "okulizyon", "okul sitesi", "okuldan gelen", "aktarilan soru", "yanlis soru", "bos soru")) {
      const satirlar = [];
      if (okz.durum && okz.durum.kod && okz.durum.kod !== "ok") {
        satirlar.push("Son çekim durumu: " + (okz.durum.mesaj || okz.durum.kod) + ".");
      }
      if (okz.bekleyen) {
        satirlar.push("Analiz bekleyen " + okz.bekleyen + " soru var" + (okz.sinav && okz.sinav.length ? " (" + okz.sinav.join(", ") + ")" : "") + ".");
        const dersler = {};
        sorular.forEach(function (r) { const d = r.lesson || "?"; dersler[d] = (dersler[d] || 0) + 1; });
        const liste = Object.keys(dersler).map(function (d) { return d + " " + dersler[d]; });
        if (liste.length) satirlar.push("Ders dağılımı: " + liste.join(" · "));
        satirlar.push("Şimdi yapılacak: Profil → Okulizyon → «Nedenleri seç» ile her soruya hata nedeni ver; Konu Takibi ve öncelik listesi otomatik güncellenir.");
      } else {
        satirlar.push("Analiz bekleyen Okulizyon sorusu yok.");
        satirlar.push("Yeni sonuç geldiyse Profil → Okulizyon bölümünden «Şimdi dene» ile çekebilirsin.");
      }
      return satirlar.join("\n");
    }

    // Sınav / kalan gün
    if (ic(m, "sinav", "kac gun", "kalan", "takvim", "hedef")) {
      if (c.rapor) {
        const durum = bolum(c.rapor, "Durum").filter(function (x) { return !/Konu Takibi|hafıza|tekrar günü/i.test(x); });
        const hedef = c.rapor.hedef || {};
        if (hedef.tarih) {
          const satirlar = [maddeli("Sınav ve hedef (kayıtlardan):", durum, 5)];
          const oner = bolum(c.rapor, "Öneriler").filter(function (x) { return /tempo|ivme|deneme/i.test(x); });
          if (oner.length) satirlar.push(maddeli("Tempo için:", oner, 2));
          return satirlar.join("\n");
        }
        const ek = bolum(c.rapor, "Eksik veri").filter(function (x) { return /Sınav tarihi|Hedef net/i.test(x); });
        return ["Sınav tarihi ve/veya hedef net kayıtlı değil; kalan gün ve ivme hesaplanmaz.",
          maddeli("Eksik olan:", ek.length ? ek : ["Sınav tarihi ve hedef net (Planlama → Hedefler)"], 2)].join("\n");
      }
      if (typeof c.kalanGun === "number" && isFinite(c.kalanGun)) {
        const satirlar = ["Sınava " + c.kalanGun + " gün kaldı."];
        if (c.hedefNet) satirlar.push("Hedef netin: " + tr(c.hedefNet) + ".");
        const hafta = Math.max(1, Math.round(c.kalanGun / 7));
        satirlar.push("Kalan süre yaklaşık " + hafta + " hafta. Planlama sayfasında haftalık ivme hedefini bu süreye göre kurabilirsin.");
        return satirlar.join("\n");
      }
      return "Sınav tarihi kayıtlı değil. Planlama sayfasına sınav tarihini ve hedef neti gir; kalan gün ve haftalık ivme hedefini hesaplayıp buradan söyleyeyim.";
    }

    // Kitap / okuma
    if (ic(m, "kitap", "okuma", "sayfa", "odak", "disiplin")) {
      const okuma = c.okuma || {};
      const sayfa = Number(okuma.sayfa || okuma.toplamSayfa || 0);
      if (sayfa > 0) return "Toplam " + sayfa + " sayfa okumuşsun" + (okuma.dakika ? " (" + okuma.dakika + " dakika)" : "") + ". Okuma disiplini süre/çözüm hatalarını azalttığı için Kitaplık sayfasında hedefini sabit tut; günde 15 dakika bile fark yaratır.";
      return "Henüz okuma kaydın yok. Kitaplık sayfasından günlük sayfa girişi yap; okuma artışı süre hatalarını (S/K) düşürür, bunu sana buradan raporlarım.";
    }

    // Motivasyon
    if (ic(m, "motivasyon", "moral", "yorgun", "stres", "korku", "biktim", "zorlaniyorum", "kaygi")) {
      const satirlar = ["Bunu söylemen normal " + ad + ". Verilerine bakalım:"];
      if (sinavlar.length) satirlar.push("Bugüne kadar " + sinavlar.length + " deneme işlemişsin — bu emek görünür durumda.");
      // v102 — moral önerisi de TEK kaynaktan: motorun öncelik listesi.
      const oncelik = (c.rapor && c.rapor.oncelik && Array.isArray(c.rapor.oncelik.liste)) ? c.rapor.oncelik.liste[0] : null;
      const z = oncelik ? { konular: [{ ad: (oncelik.ders ? oncelik.ders + ": " : "") + oncelik.konu }] } : zayifKonular(c, 1);
      if (z.konular.length) satirlar.push("Tek seferde her şeyi değil, sadece «" + z.konular[0].ad + "» konusunu 20 dakika çalış. Küçük ve biten iş, motivasyonu geri getirir.");
      else satirlar.push("Bugün için tek bir küçük hedef seç (10 soru ya da 10 sayfa). Tamamlanan iş moral getirir.");
      satirlar.push("Günlük Görevler'de serini korumak da burada işe yarar.");
      return satirlar.join("\n");
    }

    // Teşekkür / kapanış
    if (ic(m, "tesekkur", "sagol", "eyvallah", "tamam", "gorusuruz")) {
      return "Rica ederim " + ad + ". Bir şey takılırsa yine yaz; verilerin burada.";
    }

    // Anlaşılmayan mesaj
    return [
      "Bunu tam çözemedim. Verilerinden yanıt verebildiğim konular:",
      "• " + HAVUZ[0],
      "• " + HAVUZ[1],
      "• " + HAVUZ[2],
      "• " + HAVUZ[3],
      "«yardım» yazarak tüm listeyi görebilirsin."
    ].join("\n");
  }

  // ---- 4) Tarayıcı katmanı ----
  const api = { kocYanit: kocYanit, sade: sade, netHesap: netHesap, zayifKonular: zayifKonular, bolum: bolum, HAVUZ: HAVUZ };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (kok) kok.KOC = api;

  if (typeof document === "undefined") return; // node testinde burada durur

  function uygulamaDurumu() {
    try { return typeof state !== "undefined" ? state : (kok && kok.state) || null; } catch (e) { return (kok && kok.state) || null; }
  }
  function guvenli(fn, varsayilan) { try { const v = fn(); return v == null ? varsayilan : v; } catch (e) { return varsayilan; } }

  function baglam() {
    const st = uygulamaDurumu() || {};
    const sinavlar = Array.isArray(st.exams) ? st.exams : [];
    const sorular = Array.isArray(st.questions) ? st.questions : [];
    const okz = st.okulizyon || {};
    const bekleyen = Array.isArray(okz.pending) ? okz.pending : [];
    const hatalar = [];
    let bekleyenSayi = 0;
    const sinavAdlari = [];
    bekleyen.forEach(function (ex) {
      if (ex && ex.name) sinavAdlari.push(ex.name);
      (ex && ex.rows ? ex.rows : []).forEach(function (r) {
        bekleyenSayi += 1;
        hatalar.push({ lesson: r.lesson, topic: r.topic, status: r.status, date: (ex && ex.date) || null });
      });
    });
    const okuma = st.reading || st.readingStats || {};
    const plan = st.plan || {};

    /* v102 — GERÇEK KAYITLAR: denemeler errorLogs'uyla birlikte geçer
       (konu/neden analizi aynı kayıttan), soru bankası hataları ayrı kaynak,
       hafıza/plan/hedef doğrudan state'ten okunur. */
    const c = {
      ad: guvenli(function () { return st.user && st.user.name; }, ""),
      sinif: guvenli(function () { return st.user && st.user.grade; }, ""),
      exams: sinavlar.map(function (e) {
        return {
          id: e && e.id, name: e && e.name, date: e && e.date, net: e && e.net,
          lessons: (e && e.lessons) || {},
          errorLogs: (e && Array.isArray(e.errorLogs)) ? e.errorLogs : []
        };
      }),
      questions: sorular,
      plan: { targetDate: plan.targetDate || null, targetNet: plan.targetNet != null ? plan.targetNet : null },
      memory: st.memory || {},
      okulizyon: {
        durum: okz.durum || null,
        bekleyen: bekleyenSayi,
        sinav: sinavAdlari,
        sorular: hatalar
      },
      okuma: { sayfa: Number(okuma.sayfa || okuma.pages || 0), dakika: Number(okuma.dakika || okuma.minutes || 0) },
      kalanGun: guvenli(function () { return typeof daysLeftToExam === "function" ? daysLeftToExam() : null; }, null),
      hedefNet: plan.targetNet != null ? plan.targetNet : null,
      hedefTarih: plan.targetDate || null,
      hazirlik: guvenli(function () {
        if (typeof hazirlikPlani === "function") return hazirlikPlani();
        if (Array.isArray(plan.hazirlikPlani)) return plan.hazirlikPlani;
        return [];
      }, [])
    };

    /* v102 — TEK HESAP: sohbet de panel gibi KOC_MOTOR snapshot + raporundan
       konuşur. Böylece panelde "haftada +3,15 net" yazarken sohbette başka bir
       sayı çıkmaz. Motor yoksa yukarıdaki ham ctx kullanılır (eski davranış). */
    const mot = motor();
    if (mot && typeof mot.snapshotCtx === "function") {
      try {
        const bugun = guvenli(function () { return typeof todayStr === "function" ? todayStr() : new Date().toISOString().slice(0, 10); }, new Date().toISOString().slice(0, 10));
        const snap = mot.snapshotCtx(c, bugun, { hazirlik: c.hazirlik, okuma: c.okuma, kalanGun: c.kalanGun });
        c.snap = snap;
        c.rapor = mot.rapor(snap);
        if (c.rapor && c.rapor.hedef) {
          if (typeof c.rapor.hedef.kalanGun === "number") c.kalanGun = c.rapor.hedef.kalanGun;
          if (c.rapor.hedef.hedef != null) c.hedefNet = c.rapor.hedef.hedef;
          if (c.rapor.hedef.tarih) c.hedefTarih = c.rapor.hedef.tarih;
        }
      } catch (e) { /* motor hatası sohbeti düşürmesin */ }
    }
    return c;
  }


  function oku() {
    try {
      const ham = kok.localStorage && kok.localStorage.getItem(ANAHTAR);
      const v = ham ? JSON.parse(ham) : null;
      return Array.isArray(v) ? v.slice(-EN_FAZLA) : [];
    } catch (e) { return []; }
  }
  function yaz(liste) {
    try { kok.localStorage && kok.localStorage.setItem(ANAHTAR, JSON.stringify(liste.slice(-EN_FAZLA))); } catch (e) { /* kota dolu → sessiz */ }
  }

  let sohbet = [];
  let kutu = null, girdi = null, govde = null;

  function balon(kim, metin, zaman) {
    const d = document.createElement("div");
    d.className = "koc-baloncuk " + (kim === "ben" ? "koc-ben" : "koc-robot");
    d.textContent = metin;
    if (zaman) d.title = new Date(zaman).toLocaleString("tr-TR");
    return d;
  }

  function ciz() {
    if (!govde) return;
    govde.textContent = "";
    if (!sohbet.length) {
      sohbet.push({ kim: "koc", metin: "Merhaba! Ben senin verilerinden yanıt üreten koçunum. Deneme netlerin, hatalı konuların ve Okulizyon'dan gelen sorular üzerinden konuşurum. Başlamak için: «" + HAVUZ[0] + "»", zaman: Date.now() });
      yaz(sohbet);
    }
    sohbet.forEach(function (x) { govde.appendChild(balon(x.kim, x.metin, x.zaman)); });
    govde.scrollTop = govde.scrollHeight;
  }

  function gonder() {
    if (!girdi) return;
    const metin = String(girdi.value || "").trim();
    if (!metin) return;
    girdi.value = "";
    sohbet.push({ kim: "ben", metin: metin, zaman: Date.now() });
    yaz(sohbet);
    ciz();
    const yanit = kocYanit(metin, baglam());
    setTimeout(function () {
      sohbet.push({ kim: "koc", metin: yanit, zaman: Date.now() });
      yaz(sohbet);
      ciz();
      if (typeof kok.__kocYeniMesaj === "function") { try { kok.__kocYeniMesaj(); } catch (e) { /* yok say */ } }
    }, 320);
  }

  function etiket(ad, stil, metin) {
    const e = document.createElement(ad);
    if (stil) e.style.cssText = stil;
    if (metin != null) e.textContent = metin;
    return e;
  }

  function kur() {
    const panel = document.getElementById("coach-panel");
    if (!panel) return false;
    if (document.getElementById("koc-sohbet")) return true;

    // Panel başlığı + sistem mesajları korunur; altına mesaj bölümü eklenir.
    panel.setAttribute("aria-label", "Koçluk Hattı — mesajlar");
    panel.style.display = "flex";
    panel.style.flexDirection = "column";
    panel.style.gap = "10px";
    panel.style.maxHeight = "min(62vh, calc(100vh - 190px))";

    const baslik = etiket("div", "color:var(--text-muted);letter-spacing:0.04em;margin-top:2px;font-size:11px;font-weight:600;", "MESAJLAR");

    govde = document.createElement("div");
    govde.id = "koc-sohbet";
    govde.setAttribute("role", "log");
    govde.setAttribute("aria-live", "polite");
    govde.style.cssText = "display:flex;flex-direction:column;gap:8px;overflow-y:auto;min-height:120px;max-height:38vh;padding-right:2px;";

    const form = document.createElement("form");
    form.id = "koc-form";
    form.style.cssText = "display:flex;gap:8px;align-items:flex-end;margin-top:2px;";

    girdi = document.createElement("input");
    girdi.id = "koc-girdi";
    girdi.type = "text";
    girdi.autocomplete = "off";
    girdi.maxLength = 400;
    girdi.placeholder = "Koça yaz… (ör. netlerim nasıl?)";
    girdi.setAttribute("aria-label", "Koça mesaj yaz");
    girdi.style.cssText = "flex:1;min-width:0;min-height:40px;padding:10px 12px;border-radius:12px;border:1px solid var(--border-card);background:var(--bg-canvas);color:var(--text-main);font-size:13px;";

    const gonderD = etiket("button", "min-height:40px;min-width:44px;border:none;border-radius:12px;background:var(--brand-gradient);color:#fff;font-weight:700;cursor:pointer;", "➤");
    gonderD.type = "submit";
    gonderD.id = "koc-gonder";
    gonderD.setAttribute("aria-label", "Mesajı gönder");

    form.appendChild(girdi);
    form.appendChild(gonderD);

    const alt = etiket("div", "display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:10.5px;color:var(--text-muted);");
    const not = etiket("span", null, "Yanıtlar kendi kayıtlarından üretilir · cihazda saklanır");
    const temizle = etiket("button", "background:none;border:none;color:var(--text-muted);text-decoration:underline;cursor:pointer;font-size:10.5px;", "Temizle");
    temizle.type = "button";
    temizle.id = "koc-temizle";
    alt.appendChild(not);
    alt.appendChild(temizle);

    if (!document.getElementById("koc-stil")) {
      const st = document.createElement("style");
      st.id = "koc-stil";
      st.textContent =
        ".koc-baloncuk{font-size:12.5px;line-height:1.45;border-radius:12px;padding:9px 11px;white-space:pre-wrap;word-break:break-word;max-width:92%;}" +
        ".koc-robot{background:var(--bg-canvas);color:var(--text-main);border:1px solid var(--border-card);align-self:flex-start;}" +
        ".koc-ben{background:var(--brand-gradient);color:#fff;align-self:flex-end;}";
      (document.head || document.body).appendChild(st);
    }

    panel.appendChild(baslik);
    panel.appendChild(govde);
    panel.appendChild(form);
    panel.appendChild(alt);

    sohbet = oku();
    ciz();

    form.addEventListener("submit", function (e) { if (e && e.preventDefault) e.preventDefault(); gonder(); });
    temizle.addEventListener("click", function () {
      sohbet = []; try { kok.localStorage.removeItem(ANAHTAR); } catch (e) { /* yok say */ } ciz();
    });
    kok.__kocSohbetTazele = ciz;
    kok.__kocHazir = true;
    return true;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", kur);
  else kur();
  // Panel sonradan eklenirse diye kısa süre dene
  let deneme = 0;
  const zamanlayici = setInterval(function () {
    deneme++;
    if (kur() || deneme > 20) clearInterval(zamanlayici);
  }, 500);

})(typeof window !== "undefined" ? window : globalThis);
