const { kazanimToTopic } = require("./konular.js"); // kazanım → konu sözlüğü
// ============================================================
// OKULIZYON AYRIŞTIRICI — DETERMİNİSTİK (yapay zekâ YOK)
// Cheerio ile HTML DOM tarama; başlık-isimli sütun eşleme yöntemi:
// tablonun başlık satırına bakarak Ders/Konu/Doğru/Yanlış/Boş sütunlarını
// otomatik eşler → şablon değişse bile dayanıklı.
// KESİN seçiciler (okulunuzun HTML örneği gelince) cfg.selectors ile sabitlenir.
// ============================================================
function dom(html) { return require("cheerio").load(html); }

// Sınav satırı tespiti: bağlamda "sınav/deneme/yazılı" + tarih geçen tablolar
function parseSinavListesi(html) {
  const $ = dom(html);
  const out = [];
  $("a").each((i, a) => {
    const text = $(a).text().replace(/\s+/g, " ").trim();
    const href = $(a).attr("href") || "";
    if (/(deneme|sınav|yazılı)/i.test(text) && href) out.push({ name: text, href: href });
  });
  return out;
}

// Başlıklardan sütun indeksleri çıkar: {Ders:2, Konu:3, Doğru:4, ...}
function sutunEsle($, table) {
  const ths = $(table).find("tr").first().find("th,td");
  const map = {};
  ths.each((i, th) => {
    const h = $(th).text().replace(/\s+/g, " ").trim().toLowerCase();
    if (h.includes("ders") && map.Ders === undefined) map.Ders = i;
    else if ((h.includes("konu") || h.includes("kazan")) && map.Konu === undefined) map.Konu = i; // "Konu" VE "Kazanım" sütunları
    else if (h.includes("doğru") && map.Ders !== undefined && map.Doğru === undefined) map.Doğru = i;
    else if (h.includes("yanlış") && map.Yanlış === undefined) map.Yanlış = i;
    else if ((h === "boş" || h.includes("boş")) && map.Boş === undefined) map.Boş = i;
    else if (h.includes("net") && map.Net === undefined && !h.includes("netten")) map.Net = i;
    else if (h.includes("soru") && map.Soru === undefined) map.Soru = i;
    else if (h.includes("durum") && map.Durum === undefined) map.Durum = i;
  });
  return map;
}
function sayi(x) { const n = parseInt(String(x).replace(/[^\d-]/g, ""), 10); return isNaN(n) ? 0 : n; }

// ANA FONKSİYON: sonuç sayfası(ları) → kanonik JSON
// Çıktı: { exams: [{ name, date, lessons: {Ders:{d,w,e}}, rows: [{qno, lesson, topic, status:"w"|"e"}] }] }
function parseSonuclar(html, meta) {
  const m = meta || {};
  const $ = dom(html);
  const exams = [];

  // A) DERS TOPLAMLARI tablosu: başlıkta Ders+Doğru+Yanlış(+Boş) olan ilk tablo
  let lessons = {};
  $("table").each((ti, table) => {
    if (Object.keys(lessons).length) return;
    const map = sutunEsle($, table);
    if (map.Ders === undefined || map.Doğru === undefined || map.Yanlış === undefined) return;
    $(table).find("tr").slice(1).each((ri, tr) => {
      const td = $(tr).find("td");
      const ders = td.eq(map.Ders).text().replace(/\s+/g, " ").trim();
      if (!ders) return;
      lessons[ders] = {
        d: sayi(td.eq(map.Doğru).text()),
        w: sayi(map.Yanlış !== undefined ? td.eq(map.Yanlış).text() : 0),
        e: sayi(map.Boş !== undefined ? td.eq(map.Boş).text() : 0)
      };
    });
  });

  // B) SORU DETAY tablosu: başlıkta Ders+Konu (veya Soru+Konu) olan tablo
  const rows = [];
  $("table").each((ti, table) => {
    if (rows.length) return;
    const map = sutunEsle($, table);
    if (map.Konu === undefined) return;
    if (map.Ders === undefined && map.Soru === undefined) return;
    $(table).find("tr").slice(1).each((ri, tr) => {
      const td = $(tr).find("td");
      let konu = map.Konu !== undefined ? td.eq(map.Konu).text().replace(/\s+/g, " ").trim() : "";
      if (!konu) return;
      // Kazanım metni geldiyse KONU ADINA indir (uygulama konu sözlüğüyle, AI yok)
      if (m.grade) konu = kazanimToTopic(konu, m.grade);
      const ders = map.Ders !== undefined ? td.eq(map.Ders).text().replace(/\s+/g, " ").trim() : (m.defaultLesson || "");
      // durum: ayrı Durum sütunu varsa kullan, yoksa Yanlış/Boş sütunlarından çıkar
      let durum = "";
      if (map.Durum !== undefined) durum = td.eq(map.Durum).text().trim().toLowerCase();
      const yanlisBos = (map.Yanlış !== undefined ? sayi(td.eq(map.Yanlış).text()) : 0) + (map.Boş !== undefined ? sayi(td.eq(map.Boş).text()) : 0);
      const status = /boş/.test(durum) || (yanlisBos === 0 && /boş/.test($(tr).text())) ? "e" : "w";
      rows.push({ qno: map.Soru !== undefined ? sayi(td.eq(map.Soru).text()) : rows.length + 1, lesson: ders, topic: konu, status });
    });
  });

  exams.push({ name: m.name || "Okulizyon Sınavı", date: m.date || "", lessons: lessons, rows: rows });
  return { exams: exams };
}

module.exports = { parseSinavListesi, parseSonuclar };
