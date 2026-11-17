#!/usr/bin/env node
/* ============================================================
   FELSEFE 10 — KART ÖNLERİ · 1. DEMET (55 kart)
   ------------------------------------------------------------
   Denetim kuralı: kart önü tanım/kural sorusu olmalı. Emir kipiyle
   yazılmış ("… açıklayın", "… yazın", "… belirtin") veya serbest
   soru kalıbındaki ("… hangi işlevi görür?") önler, anlamı
   korunarak tanım sorusuna çevrildi. Arka yüzler değişmiyor.

   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/felsefe-kart1.js
   ============================================================ */
"use strict";

const K = "fel_10_";
const onlar = (konu_id, liste) => ({ konu_id, onlar: liste });

module.exports = [
  onlar(K + "u01_k01", [
    { soru_id: K + "u01_k01_o01", on: "Felsefenin insanın evren, hayat ve varoluş karşısındaki çabası olarak tanımı nedir?" },
    { soru_id: K + "u01_k01_o02", on: "philia ve sophia sözcüklerinin anlamları nedir?" },
    { soru_id: K + "u01_k01_o04", on: "Philosophia terimini ilk kullanan kişinin adı nedir?" },
    { soru_id: K + "u01_k01_o06", on: "Hikmet kavramının anlamı nedir?" },
    { soru_id: K + "u01_k01_o07", on: "Felsefenin hikmet iddiasından ayrıldığı nokta nedir?" },
    { soru_id: K + "u01_k01_o08", on: "Felsefenin temelindeki zihinsel tutum nedir?" },
    { soru_id: K + "u01_k01_o09", on: "Düşünce ile felsefi bilgi arasındaki ilişki nedir?" }
  ]),
  onlar(K + "u01_k02", [
    { soru_id: K + "u01_k02_o02", on: "Felsefi düşüncenin temellerinin dayandığı uygarlıklar nedir?" },
    { soru_id: K + "u01_k02_o03", on: "Uygarlıkların din, mitoloji ve toplumsal yapısının felsefeye etkisi nasıl tanımlanır?" },
    { soru_id: K + "u01_k02_o04", on: "Çin ve Hint felsefelerinin öne çıkan ortak yönleri nedir?" },
    { soru_id: K + "u01_k02_o07", on: "Türk-İslam felsefesinin etkili olduğu dönem ve genel yönelimi nedir?" },
    { soru_id: K + "u01_k02_o08", on: "15–17. yüzyıl felsefesindeki öne çıkan dönüşümler nedir?" },
    { soru_id: K + "u01_k02_o09", on: "18–19. yüzyıl felsefesinin toplumsal ve düşünsel yönelimi nedir?" },
    { soru_id: K + "u01_k02_o10", on: "Amerikan felsefesini Anglosakson felsefesinden ayıran yön nedir?" },
    { soru_id: K + "u01_k02_o11", on: "20. yüzyıl felsefesinin öne çıkan gelişmeleri nedir?" },
    { soru_id: K + "u01_k02_o12", on: "Fransız ve Alman felsefelerinin öne çıkan yönleri nedir?" }
  ]),
  onlar(K + "u01_k03", [
    { soru_id: K + "u01_k03_o03", on: "Şüphe etmenin felsefi düşüncedeki işlevi nedir?" },
    { soru_id: K + "u01_k03_o04", on: "Sorgulamanın felsefi düşünmedeki işlevi nedir?" },
    { soru_id: K + "u01_k03_o05", on: "Felsefi düşüncenin yığılımlı ilerlemesi ne demektir?" },
    { soru_id: K + "u01_k03_o06", on: "Felsefi düşüncenin rasyonel olmasının dayanağı nedir?" },
    { soru_id: K + "u01_k03_o07", on: "Felsefi düşüncede tutarlılığın güvence altına aldığı nedir?" },
    { soru_id: K + "u01_k03_o09", on: "Eleştirel olmanın felsefi düşüncede gerektirdiği tutum nedir?" },
    { soru_id: K + "u01_k03_o10", on: "Felsefi düşüncenin sistemli olması ne demektir?" },
    { soru_id: K + "u01_k03_o11", on: "Felsefi düşüncenin evrensel olmasının kapsamı nedir?" }
  ]),
  onlar(K + "u01_k04", [
    { soru_id: K + "u01_k04_o03", on: "Felsefi sorularda kavramların anlamı nasıl bulunur?" },
    { soru_id: K + "u01_k04_o05", on: "Felsefi soruların yeni soru dizileri doğurması ne demektir?" },
    { soru_id: K + "u01_k04_o06", on: "Felsefi soruların cevaplarının yalnız gözlemle bulunmamasının nedeni nedir?" },
    { soru_id: K + "u01_k04_o07", on: "Gündelik bilgi sorusu ile felsefi sorunun cevap biçimi nasıldır?" },
    { soru_id: K + "u01_k04_o08", on: "Felsefi sorularda şaşma ile araştırma isteği arasındaki ilişki nedir?" },
    { soru_id: K + "u01_k04_o10", on: "Felsefi soruların kavramı anlamaya yönelmesi ne demektir?" }
  ]),
  onlar(K + "u01_k05", [
    { soru_id: K + "u01_k05_o01", on: "Bilim ile felsefenin bilgiye ulaşırken paylaştığı yönler nedir?" },
    { soru_id: K + "u01_k05_o03", on: "Bilimsel önermeler ile felsefi düşüncelerin doğrulanabilirliği arasındaki ilişki nedir?" },
    { soru_id: K + "u01_k05_o04", on: "Felsefe ile dinin ortak ilgi alanları nedir?" },
    { soru_id: K + "u01_k05_o05", on: "Din ile felsefenin doğruluk temellendirmesi bakımından ayrıldığı nokta nedir?" },
    { soru_id: K + "u01_k05_o06", on: "Felsefenin bilim tarihindeki yerinin değişimi nedir?" },
    { soru_id: K + "u01_k05_o08", on: "Sanatı felsefeden ayıran amaç ve araç nedir?" },
    { soru_id: K + "u01_k05_o10", on: "Felsefenin diğer alanlara katkı yolu nedir?" }
  ]),
  onlar(K + "u01_k06", [
    { soru_id: K + "u01_k06_o01", on: "Felsefenin bireye sağladığı düşünsel beceriler nedir?" },
    { soru_id: K + "u01_k06_o02", on: "Felsefenin bireyin sonuca ulaşmasına katkısı nedir?" },
    { soru_id: K + "u01_k06_o03", on: "Felsefenin kişinin kendi düşüncelerine etkisi nedir?" },
    { soru_id: K + "u01_k06_o04", on: "Felsefi tartışmaların toplumsal yaşamdaki rolü nedir?" },
    { soru_id: K + "u01_k06_o05", on: "Felsefenin bireysel gelişime katkısı ile kendini anlama arasındaki ilişki nedir?" },
    { soru_id: K + "u01_k06_o06", on: "Felsefi düşünmenin karar verme sürecine katkısı nedir?" },
    { soru_id: K + "u01_k06_o07", on: "Felsefenin toplumsal sorunlara rehberlik etmesinin nedeni nedir?" },
    { soru_id: K + "u01_k06_o09", on: "Felsefenin eleştirel düşünme becerisine katkısı nasıl tanımlanır?" },
    { soru_id: K + "u01_k06_o10", on: "Felsefenin bireysel ve toplumsal gelişimdeki yeri nedir?" }
  ]),
  onlar(K + "u02_k01", [
    { soru_id: K + "u02_k01_o01", on: "Düşünme ve dil arasındaki temel ilişki nedir?" },
    { soru_id: K + "u02_k01_o04", on: "İmgelerden kavramlara geçişin biçimi nasıldır?" },
    { soru_id: K + "u02_k01_o05", on: "Düşünmenin üç önemli yapı taşı nedir?" },
    { soru_id: K + "u02_k01_o08", on: "Dil yapısının düşünce üzerindeki etkisi nedir?" },
    { soru_id: K + "u02_k01_o09", on: "Düşünme ile dili özdeş kabul eden görüşün savunduğu nedir?" },
    { soru_id: K + "u02_k01_o11", on: "Dilin yapısal üç temel ögesi ve inceleme alanları nedir?" },
    { soru_id: K + "u02_k01_o12", on: "Düşünme ile dil ilişkisinin tek yönlü açıklanamamasının nedeni nedir?" }
  ]),
  onlar(K + "u02_k02", [
    { soru_id: K + "u02_k02_o02", on: "Önermenin tanımı nedir?" },
    { soru_id: K + "u02_k02_o03", on: "Doğruluk, görüş ve çelişiklik kavramları arasındaki ilişki nedir?" }
  ])
];
