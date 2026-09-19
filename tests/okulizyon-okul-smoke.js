// Okulizyon + okul sitesi parser smoke testleri (mock HTML)
// Amaç: gerçek sitenin temel tablo/link biçimleri değişse bile deterministik parserların
// doğru kayıt ürettiğini ve doğru satırları yanlış saymadığını hızlı doğrulamak.
const assert = require("assert");
const { parseSinavListesi, parseSonuclar } = require("../okulizyon-parser");
const { parseDuyurular, tarihBul, dersBul } = require("../okul-sitesi");

let pass = 0;
function ok(ad, kosul, detay = "") {
  assert.ok(kosul, ad + (detay ? " — " + detay : ""));
  pass++;
  console.log("  ✓ " + ad);
}

// 1) Okulizyon liste: link metni sadece "Sonuç" olsa bile satır bağlamından sınavı bulmalı.
const okulizyonListeHtml = `
<html><body>
  <table id="sinavlar">
    <tr><th>Tarih</th><th>Sınav</th><th>İşlem</th></tr>
    <tr><td>12.09.2026</td><td>9. Sınıf Türkiye Geneli Deneme Sınavı</td><td><a href="/app2/sonuc/123">Sonuç Detayı</a></td></tr>
    <tr><td>18.09.2026</td><td>Matematik 1. Yazılı</td><td><a href="/app2/sonuc/456">Görüntüle</a></td></tr>
  </table>
  <a href="/app2/sonuc/789">Türkçe Deneme Sonucu</a>
</body></html>`;
const sinavlar = parseSinavListesi(okulizyonListeHtml);
ok("Okulizyon liste: satır bağlamından en az 2 sınav linki", sinavlar.length >= 2, JSON.stringify(sinavlar));
ok("Okulizyon liste: 'Sonuç Detayı' linki deneme adıyla yakalandı", sinavlar.some(s => /Türkiye Geneli Deneme/.test(s.name) && /123/.test(s.href)));

// 2) Okulizyon sonuç: doğru satır hata kuyruğuna girmemeli; yanlış/boş girmeli; kazanım konuya indirgenmeli.
const okulizyonSonucHtml = `
<html><body>
  <table id="ozet">
    <tr><th>Ders</th><th>Doğru</th><th>Yanlış</th><th>Boş</th><th>Net</th></tr>
    <tr><td>Matematik</td><td>12</td><td>2</td><td>1</td><td>11,5</td></tr>
    <tr><td>Türk Dili ve Edebiyatı</td><td>20</td><td>1</td><td>0</td><td>19,75</td></tr>
  </table>
  <table id="detay">
    <tr><th>Soru No</th><th>Ders</th><th>Kazanım</th><th>Durum</th></tr>
    <tr><td>1</td><td>Matematik</td><td>M.9.1.1 Üslü ve köklü ifadelerle işlemler yapar.</td><td>Doğru</td></tr>
    <tr><td>2</td><td>Matematik</td><td>M.9.1.1 Üslü ve köklü ifadelerle işlemler yapar.</td><td>Yanlış</td></tr>
    <tr><td>3</td><td>Matematik</td><td>2.4 Oran-Orantı</td><td>Boş</td></tr>
    <tr><td>4</td><td>Türk Dili ve Edebiyatı</td><td>Sözcükte Anlam</td><td>Yanlış</td></tr>
  </table>
</body></html>`;
const sonuc = parseSonuclar(okulizyonSonucHtml, { name: "Mock Deneme", date: "2026-09-12", grade: "9" }).exams[0];
ok("Okulizyon sonuç: ders toplamları okundu", sonuc.lessons.Matematik.d === 12 && sonuc.lessons.Matematik.w === 2 && sonuc.lessons.Matematik.e === 1);
ok("Okulizyon sonuç: yalnız yanlış/boş 3 hata satırı", sonuc.rows.length === 3, JSON.stringify(sonuc.rows));
ok("Okulizyon sonuç: doğru satır hata sayılmadı", !sonuc.rows.some(r => r.qno === 1));
ok("Okulizyon sonuç: boş satır status=e", sonuc.rows.some(r => r.qno === 3 && r.status === "e"));
ok("Okulizyon sonuç: kazanım deterministik konuya indirildi", sonuc.rows.some(r => r.qno === 2 && /Üslü|Köklü/i.test(r.topic)), JSON.stringify(sonuc.rows));

// 3) Okul sitesi: MEB tablo satırı, Türkçe ay tarihi, duplicate linkler, ders etiketleme.
const okulHtml = `
<html><body>
  <table>
    <tr><th>Tarih</th><th>Manşet</th><th>Başlık</th></tr>
    <tr>
      <td>17<br>Eyl<br>2026</td>
      <td><a title="9. Sınıf Matematik 1. Yazılı Sınavı" href="/icerikler/9-sinif-matematik-1-yazili-sinavi_1.html"><img src="x.jpg"></a></td>
      <td><a href="/icerikler/9-sinif-matematik-1-yazili-sinavi_1.html">9. Sınıf Matematik 1. Yazılı Sınavı</a><br><a href="/icerikler/9-sinif-matematik-1-yazili-sinavi_1.html">Devamı</a></td>
    </tr>
    <tr>
      <td>20.09.2026</td>
      <td></td>
      <td><a href="/icerikler/haftalik-ders-programi_2.html">Haftalık Ders Programı yayınlandı</a></td>
    </tr>
    <tr>
      <td>21<br>Eyl<br>2026</td>
      <td></td>
      <td><a href="/icerikler/rehberlik-toplantisi_3.html">Rehberlik Toplantısı</a></td>
    </tr>
  </table>
</body></html>`;
const okul = parseDuyurular(okulHtml, "https://akkentanadolulisesi.meb.k12.tr/icerikler/icerikler/listele_775116_Duyurular");
ok("Okul sitesi: duplicate linkler tek duyuru oldu", okul.duyurular.filter(d => /Matematik/.test(d.baslik)).length === 1, JSON.stringify(okul.duyurular));
const mat = okul.duyurular.find(d => /Matematik/.test(d.baslik));
ok("Okul sitesi: Türkçe ay tarihi ISO'ya çevrildi", mat && mat.tarih === "2026-09-17", JSON.stringify(mat));
ok("Okul sitesi: sınav ders etiketi Matematik", mat && mat.lesson === "Matematik", JSON.stringify(mat));
ok("Okul sitesi: ders programı ayrıca yakalandı", okul.programlar.length === 1 && /Program/.test(okul.programlar[0].baslik));
ok("Okul sitesi: genel okul içeriği de duyuru listesine girer", okul.duyurular.some(d => /Rehberlik/.test(d.baslik)));
ok("tarihBul yardımcı: 07 Ağu 2026", tarihBul("07 Ağu 2026") === "2026-08-07");
ok("dersBul yardımcı: Türk Dili", dersBul("Türk Dili ve Edebiyatı 1. Yazılı") === "Türk Dili ve Edebiyatı");

console.log(`\nSONUÇ okulizyon-okul-smoke: ${pass} ✓ / 0 ✗`);
