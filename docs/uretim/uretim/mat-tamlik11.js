#!/usr/bin/env node
/* ============================================================
   MATEMATİK 10 — TAMAMLIK · 11. DEMET (u02_k01, u02_k02 kalan)
   Şık düzeni, tanım soruları ve kart önleri.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/mat-tamlik11.js
   ============================================================ */
"use strict";

const K = "mat_10_";

module.exports = [
  {
    konu_id: K + "u02_k01",
    onlar: [
      { soru_id: K + "u02_k01_o02", on: "İki yönlü sıklık tablosunun amacı nedir?" }
    ],
    duzeltmeler: [
      {
        soru_id: K + "u02_k01_o02",
        secenekler: ["Kutu grafiği çizimi", "İki yönlü sıklık tablosu", "Saçılım grafiği", "Histogram grafiği"],
        dogru_index: 1
      },
      {
        soru_id: K + "u02_k01_o05",
        metin: "Bir araştırmada 40 kişiye aynı soru sorulmalı ve yanıtlar veriyle desteklenmelidir. İyi bir istatistiksel araştırma sorusunun özelliği nedir?",
        secenekler: ["Yalnızca tek bir sayı sorması", "İki değişkenli olup veriyle yanıtlanabilmesi", "Yanıtının önceden bilinmesi", "Yalnızca görüş bildirmesi"],
        dogru_index: 1
      },
      {
        soru_id: K + "u02_k01_o08",
        metin: "Araştırmacı yalnızca kendi okulundaki 60 öğrenciye anket uygulayıp tüm Türkiye için sonuç çıkarmıştır. Bu durumda ortaya çıkan sorun nedir?"
      },
      {
        soru_id: K + "u02_k01_o10",
        secenekler: ["Değişkenler kesinlikle bağımlıdır", "Değişkenler arasında ilişki görünmemektedir", "Hiç veri toplanmamıştır", "Örneklem büyüklüğü sıfırdır"],
        dogru_index: 1
      }
    ]
  },
  {
    konu_id: K + "u02_k02",
    duzeltmeler: [
      {
        soru_id: K + "u02_k02_o01",
        secenekler: ["Sonucun toplam uzunluğuna", "Verinin kimlerden toplandığına", "Grafikte kullanılan renge", "Araştırmanın başlığına"],
        dogru_index: 1
      },
      {
        soru_id: K + "u02_k02_o02",
        secenekler: ["Sonuç kesinlikle yanlış sayılmalıdır", "İlişki nedensellik göstermez, başka etkenler de vardır", "Örneklem gereğinden çok büyüktür", "Değişkenler mutlaka sayısal olmalıdır"],
        dogru_index: 1
      },
      {
        soru_id: K + "u02_k02_o03",
        secenekler: ["Evrene genellenmesi güvenilmez", "Kesin ve doğru sonuçtur", "Hiç yanlılık içermez", "Diğerlerinden daha doğrudur"],
        dogru_index: 0
      },
      {
        soru_id: K + "u02_k02_o07",
        secenekler: ["Veri toplama yöntemini açıklaması", "Yalnızca sonucu vermesi", "Hiç grafik kullanmaması", "Yüzdeleri yuvarlamaması"],
        dogru_index: 0
      },
      {
        soru_id: K + "u02_k02_o08",
        metin: "Aynı 200 yanıt iki ayrı analist tarafından incelenmiş ve farklı sonuçlar çıkmıştır. Aynı veri kümesinden iki farklı yorum yapılabilmesinin nedeni nedir?",
        secenekler: ["Verinin iki kez ayrı ayrı toplanması", "Kullanılan matematiğin değişmesi", "Yorumcuların farklı varsayımlar kullanması", "Tabloların farklı olması"],
        dogru_index: 2
      },
      {
        soru_id: K + "u02_k02_o10",
        secenekler: ["Yorumu tümüyle yok saymak", "Grafiği büyük çizmek", "Örneklemi daha da küçültmek", "Daha temsili veriyle analizi yinelemek"],
        dogru_index: 3
      }
    ]
  }
];
