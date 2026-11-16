#!/usr/bin/env node
/* KULLANIMDAN KALDIRILDI — yerini scripts/deneme-pdf-ayikla.js aldı.

   Eski betik JSON'u PDF'ten değil, elle tutulan bir listeye dayanarak
   hazırlıyordu ve PDF'te blok başlığı olmayan dersleri (Kimya, Din, ...)
   tamamen atlıyordu. Sonuç: ders netleri toplamı Genel Net'i tutmuyordu.

   Yenisini kullan:
       node scripts/deneme-pdf-ayikla.js "<dosya>.pdf" --yaz
   Doğrulama (aritmetik dahil):
       node scripts/deneme-pdf-ayikla.js "<dosya>.pdf"

   Belge: docs/veri/DENEME-ICE-AKTARMA.md
*/
"use strict";
console.error(
  "deneme-ice-aktarma-hazirla.js kullanımdan kaldırıldı.\n" +
  "  Yeni hat: node scripts/deneme-pdf-ayikla.js \"<dosya>.pdf\" --yaz\n" +
  "  Doğrula : node scripts/deneme-pdf-ayikla.js \"<dosya>.pdf\"\n" +
  "  Belge   : docs/veri/DENEME-ICE-AKTARMA.md"
);
process.exit(1);
