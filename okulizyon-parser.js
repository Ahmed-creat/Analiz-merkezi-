const { kazanimToTopic } = require("./konular.js"); // kazanım → konu sözlüğü
// ============================================================
// OKULIZYON AYRIŞTIRICI — DETERMİNİSTİK (yapay zekâ YOK)
// Cheerio ile HTML DOM tarama; başlık-isimli sütun eşleme yöntemi:
// tablonun başlık satırına bakarak Ders/Konu/Doğru/Yanlış/Boş sütunlarını
// otomatik eşler → şablon değişse bile dayanıklı.
// KESİN seçiciler (okulunuzun HTML örneği gelince) cfg.selectors ile sabitlenir.
// ============================================================
function dom(html) { return require("cheerio").load(html); }
function temiz(x) { return String(x || "").replace(/\s+/g, " ").trim(); }
function kucuk(x) { return temiz(x).toLocaleLowerCase("tr-TR"); }

// Sınav satırı tespiti: link metni bazen sadece "Sonuç" olur; bu yüzden
// bulunduğu tablo satırı/list item bağlamında deneme/sınav/yazılı aranır.
function parseSinavListesi(html) {
  const $ = dom(html);
  const out = [];
  const seen = new Set();
  $("a[href]").each((i, a) => {
    const href = $(a).attr("href") || "";
    if (!href || /^javascript:/i.test(href) || href === "#") return;
    const own = temiz($(a).text() || $(a).attr("title") || $(a).attr("aria-label"));
    const ctx = temiz($(a).closest("tr, li, .card, .list-group-item, .exam, .sinav").text());
    const aday = own || ctx;
    const baglam = kucuk((own + " " + ctx).slice(0, 1000));
    if (!/(deneme|sınav|sinav|yazılı|yazili|sonuç|sonuc)/i.test(baglam)) return;
    const name = (/(deneme|sınav|sinav|yazılı|yazili)/i.test(aday) ? aday : (ctx || own)).slice(0, 220);
    if (!name) return;
    const key = href + "|" + name;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ name, href });
  });
  return out;
}

// Başlıklardan sütun indeksleri çıkar: {Ders:2, Konu:3, Doğru:4, ...}
function sutunEsle($, table) {
  const ths = $(table).find("tr").first().find("th,td");
  const map = {};
  ths.each((i, th) => {
    const h = kucuk($(th).text());
    if (h.includes("ders") && map.Ders === undefined) map.Ders = i;
    else if ((h.includes("konu") || h.includes("kazan")) && map.Konu === undefined) map.Konu = i; // "Konu" VE "Kazanım" sütunları
    else if ((h.includes("doğru") || h.includes("dogru")) && map.Doğru === undefined) map.Doğru = i;
    else if ((h.includes("yanlış") || h.includes("yanlis")) && map.Yanlış === undefined) map.Yanlış = i;
    else if ((h === "boş" || h === "bos" || h.includes("boş") || h.includes("bos")) && map.Boş === undefined) map.Boş = i;
    else if (h.includes("net") && map.Net === undefined && !h.includes("netten")) map.Net = i;
    else if (h.includes("soru") && map.Soru === undefined) map.Soru = i;
    else if (h.includes("durum") && map.Durum === undefined) map.Durum = i;
  });
  return map;
}
function sayi(x) { const n = parseInt(String(x).replace(/[^\d-]/g, ""), 10); return isNaN(n) ? 0 : n; }
function lessonKey(x) { return temiz(x) || "Genel"; }

function satirEkle(rows, seenRows, row) {
  if (!row.topic || !row.lesson) return;
  const key = [row.qno || "", row.lesson, row.topic, row.status].join("|");
  if (seenRows.has(key)) return;
  seenRows.add(key);
  rows.push(row);
}

// ANA FONKSİYON: sonuç sayfası(ları) → kanonik JSON
// Çıktı: { exams: [{ name, date, lessons: {Ders:{d,w,e}}, rows: [{qno, lesson, topic, status:"w"|"e"}] }] }
function parseSonuclar(html, meta) {
  const m = meta || {};
  const $ = dom(html);
  const exams = [];

  // A) DERS TOPLAMLARI tablosu: başlıkta Ders+Doğru+Yanlış(+Boş) olan, Konu/Kazanım içermeyen ilk tablo.
  // Detay tablosunda da Doğru/Yanlış sütunları olabildiği için Konu şartıyla ayırıyoruz.
  let lessons = {};
  $("table").each((ti, table) => {
    if (Object.keys(lessons).length) return;
    const map = sutunEsle($, table);
    if (map.Ders === undefined || map.Doğru === undefined || map.Yanlış === undefined || map.Konu !== undefined) return;
    $(table).find("tr").slice(1).each((ri, tr) => {
      const td = $(tr).find("td");
      const ders = lessonKey(td.eq(map.Ders).text());
      if (!ders) return;
      lessons[ders] = {
        d: sayi(td.eq(map.Doğru).text()),
        w: sayi(map.Yanlış !== undefined ? td.eq(map.Yanlış).text() : 0),
        e: sayi(map.Boş !== undefined ? td.eq(map.Boş).text() : 0)
      };
    });
  });

  // B) SORU DETAY tablosu: başlıkta Ders+Konu/Kazanım (veya Soru+Konu/Kazanım) olan tablolar.
  // Sadece yanlış/boş satırlar kuyruğa alınır; "Doğru" satırlar artık yanlış sayılmaz.
  const rows = [];
  const seenRows = new Set();
  $("table").each((ti, table) => {
    const map = sutunEsle($, table);
    if (map.Konu === undefined) return;
    if (map.Ders === undefined && map.Soru === undefined) return;
    $(table).find("tr").slice(1).each((ri, tr) => {
      const td = $(tr).find("td");
      let konu = temiz(map.Konu !== undefined ? td.eq(map.Konu).text() : "");
      if (!konu) return;
      // Kazanım metni geldiyse KONU ADINA indir (uygulama konu sözlüğüyle, AI yok)
      if (m.grade) konu = kazanimToTopic(konu, m.grade);
      const ders = lessonKey(map.Ders !== undefined ? td.eq(map.Ders).text() : (m.defaultLesson || ""));
      const qno = map.Soru !== undefined ? sayi(td.eq(map.Soru).text()) : 0;
      const durum = kucuk(map.Durum !== undefined ? td.eq(map.Durum).text() : "");
      const trText = kucuk($(tr).text());
      const wrongCount = map.Yanlış !== undefined ? sayi(td.eq(map.Yanlış).text()) : 0;
      const emptyCount = map.Boş !== undefined ? sayi(td.eq(map.Boş).text()) : 0;

      if (wrongCount || emptyCount) {
        for (let n = 0; n < wrongCount; n++) satirEkle(rows, seenRows, { qno: qno || rows.length + 1, lesson: ders, topic: konu, status: "w" });
        for (let n = 0; n < emptyCount; n++) satirEkle(rows, seenRows, { qno: qno || rows.length + 1, lesson: ders, topic: konu, status: "e" });
        return;
      }
      if (/boş|bos|empty/.test(durum) || (!durum && /boş|bos/.test(trText))) {
        satirEkle(rows, seenRows, { qno: qno || rows.length + 1, lesson: ders, topic: konu, status: "e" });
        return;
      }
      if (/yanlış|yanlis|hatalı|hatali|incorrect|wrong/.test(durum) || (!durum && /yanlış|yanlis|hatalı|hatali/.test(trText))) {
        satirEkle(rows, seenRows, { qno: qno || rows.length + 1, lesson: ders, topic: konu, status: "w" });
        return;
      }
      // Durum "Doğru" veya belirsiz ise hata kuyruğuna ekleme.
    });
  });

  // Totaller yoksa en azından hata sayıları derslere işlensin; net doğru hesaplanamaz ama kayıt boş kalmaz.
  if (!Object.keys(lessons).length && rows.length) {
    for (const r of rows) {
      lessons[r.lesson] = lessons[r.lesson] || { d: 0, w: 0, e: 0 };
      if (r.status === "e") lessons[r.lesson].e++; else lessons[r.lesson].w++;
    }
  }

  exams.push({ name: m.name || "Okulizyon Sınavı", date: m.date || "", lessons: lessons, rows: rows });
  return { exams: exams };
}

module.exports = { parseSinavListesi, parseSonuclar, sutunEsle };
