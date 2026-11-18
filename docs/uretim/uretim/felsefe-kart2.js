#!/usr/bin/env node
/* ============================================================
   FELSEFE 10 — KART ÖNLERİ · 2. DEMET (75 kart)
   Mantık, varlık ve bilgi felsefesi havuzları.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/felsefe-kart2.js
   ============================================================ */
"use strict";

const K = "fel_10_";
const onlar = (konu_id, liste) => ({ konu_id, onlar: liste });

module.exports = [
  onlar(K + "u02_k02", [
    { soru_id: K + "u02_k02_o04", on: "Özdeşlik ilkesinin tanımı nedir?" },
    { soru_id: K + "u02_k02_o05", on: "Çelişmezlik ilkesinin tanımı nedir?" },
    { soru_id: K + "u02_k02_o06", on: "Üçüncü hâlin imkânsızlığı ilkesinin tanımı nedir?" },
    { soru_id: K + "u02_k02_o08", on: "Tutarlılığı geçerlilikten ayıran ölçüt nedir?" },
    { soru_id: K + "u02_k02_o09", on: "Argüman, öncül ve sonuç kavramları arasındaki ilişki nedir?" },
    { soru_id: K + "u02_k02_o10", on: "Tümdengelimin tanımı nedir?" },
    { soru_id: K + "u02_k02_o11", on: "Tümevarımın tanımı nedir?" },
    { soru_id: K + "u02_k02_o12", on: "Analoji yoluyla akıl yürütmenin tanımı nedir?" },
    { soru_id: K + "u02_k02_o13", on: "Safsatının tanımı ve başlıca türleri nedir?" },
    { soru_id: K + "u02_k02_o15", on: "İspatlama mecburiyeti, ortak tutum ve otorite safsatalarının ortak yönü nedir?" }
  ]),
  onlar(K + "u02_k03", [
    { soru_id: K + "u02_k03_o02", on: "Günlük dildeki bir argümanı standart biçime dönüştürmenin ilk adımı nedir?" },
    { soru_id: K + "u02_k03_o04", on: "Argümanda sonucun ifade ettiği nedir?" },
    { soru_id: K + "u02_k03_o05", on: "Argümanın standart biçimde gösterimi nedir?" },
    { soru_id: K + "u02_k03_o06", on: "Argümanları standart forma dönüştürmenin yararı nedir?" },
    { soru_id: K + "u02_k03_o07", on: "Argüman çözümlerken elenmesi gereken ifadeler nedir?" },
    { soru_id: K + "u02_k03_o08", on: "Sözlü anlatımdaki bir gerekçenin öncül mü sonuç mu olduğu nasıl bulunur?" },
    { soru_id: K + "u02_k03_o09", on: "Argümanın birden fazla öncül taşıması ne demektir?" },
    { soru_id: K + "u02_k03_o10", on: "Standart formda öncül-sonuç düzeninin biçimi nasıldır?" }
  ]),
  onlar(K + "u03_k01", [
    { soru_id: K + "u03_k01_o01", on: "Ontolojinin (varlık felsefesinin) inceleme konusu nedir?" },
    { soru_id: K + "u03_k01_o02", on: "Varlık kavramının kapsamı nedir?" },
    { soru_id: K + "u03_k01_o03", on: "Fenomenin tanımı nedir?" },
    { soru_id: K + "u03_k01_o06", on: "Töz kavramının anlamı nedir?" },
    { soru_id: K + "u03_k01_o08", on: "Oluş kavramının anlamı nedir?" },
    { soru_id: K + "u03_k01_o09", on: "Varoluş kavramının tanımı nedir?" },
    { soru_id: K + "u03_k01_o10", on: "Bilim ile felsefenin varlığa yaklaşımındaki temel ayrım nedir?" },
    { soru_id: K + "u03_k01_o11", on: "Metafiziğin incelediği sorunlar nedir?" }
  ]),
  onlar(K + "u03_k02", [
    { soru_id: K + "u03_k02_o01", on: "Varlık felsefesinin iki temel problemi nedir?" },
    { soru_id: K + "u03_k02_o02", on: "Parmenides'in varlık anlayışının temel iddiası nedir?" },
    { soru_id: K + "u03_k02_o03", on: "Gorgias'ın varlık, bilgi ve dil hakkındaki üç iddiası nedir?" },
    { soru_id: K + "u03_k02_o04", on: "Nihilizmin temel savı ve temsilcileri nedir?" },
    { soru_id: K + "u03_k02_o05", on: "Realizmin temel iddiası ve Aristoteles'in madde-form açıklaması nedir?" },
    { soru_id: K + "u03_k02_o06", on: "İdealizmin genel varlık görüşü nedir?" },
    { soru_id: K + "u03_k02_o07", on: "Platon'un duyular ve idealar dünyası ayrımı nasıl tanımlanır?" },
    { soru_id: K + "u03_k02_o08", on: "İbn Sina'nın mümkün ve zorunlu varlık ayrımı nasıl tanımlanır?" },
    { soru_id: K + "u03_k02_o09", on: "Hegel'in diyalektik idealizminde değişim süreci nedir?" },
    { soru_id: K + "u03_k02_o10", on: "Materyalizmin temel varlık iddiası nedir?" },
    { soru_id: K + "u03_k02_o11", on: "Demokritos'un atomcu materyalizmi nasıl tanımlanır?" },
    { soru_id: K + "u03_k02_o13", on: "Oluş felsefesinde Herakleitos ile Whitehead'in yaklaşımı nedir?" },
    { soru_id: K + "u03_k02_o14", on: "Husserl'in fenomenolojisinde öze ulaşmanın yöntemi nedir?" },
    { soru_id: K + "u03_k02_o15", on: "Sartre'da öz ile varoluş arasındaki ilişki nedir?" }
  ]),
  onlar(K + "u04_k01", [
    { soru_id: K + "u04_k01_o01", on: "Bilgi felsefesinin odaklandığı soru nedir?" },
    { soru_id: K + "u04_k01_o03", on: "Bilgide özne ve nesnenin ifade ettiği nedir?" },
    { soru_id: K + "u04_k01_o04", on: "Doğruluk ile gerçeklik arasındaki ilişki nedir?" },
    { soru_id: K + "u04_k01_o06", on: "Episteme ile doksa arasındaki ilişki nasıl tanımlanır?" },
    { soru_id: K + "u04_k01_o09", on: "Aristoteles'e göre inancın bilgiye dönüşme koşulu nedir?" },
    { soru_id: K + "u04_k01_o10", on: "Descartes'a göre bilginin taşıması gereken koşul nedir?" },
    { soru_id: K + "u04_k01_o12", on: "Kant'a göre bilgiyi oluşturan iki unsur nedir?" },
    { soru_id: K + "u04_k01_o13", on: "Hume'a göre bilginin dayandığı ilişkiler nedir?" },
    { soru_id: K + "u04_k01_o14", on: "Bertrand Russell'e göre bilgi yolları nedir?" },
    { soru_id: K + "u04_k01_o15", on: "John Dewey'e göre bilgiye ulaşma süreci nasıl tanımlanır?" }
  ]),
  onlar(K + "u04_k02", [
    { soru_id: K + "u04_k02_o01", on: "Bilgi felsefesinin üç temel problemi nedir?" },
    { soru_id: K + "u04_k02_o02", on: "Septisizmin bilginin imkânı konusundaki savı nedir?" },
    { soru_id: K + "u04_k02_o03", on: "Dogmatizmin bilginin imkânı hakkındaki savı nedir?" },
    { soru_id: K + "u04_k02_o04", on: "Pyrrhon'un şüpheci tutumunda yargıdan kaçınma ne demektir?" },
    { soru_id: K + "u04_k02_o05", on: "Descartes'ın şüphe yöntemini septiklerden ayıran nedir?" },
    { soru_id: K + "u04_k02_o06", on: "Descartes'ın “Düşünüyorum, öyleyse varım” çıkarımının temellendirdiği bilgi nedir?" },
    { soru_id: K + "u04_k02_o07", on: "Rasyonalizmin bilginin kaynağı olarak öne çıkardığı nedir?" },
    { soru_id: K + "u04_k02_o08", on: "Empirizmin bilginin kaynağını açıklaması nasıl tanımlanır?" },
    { soru_id: K + "u04_k02_o09", on: "Kant'ın kritisizminde akıl ve deneyimin görevi nedir?" },
    { soru_id: K + "u04_k02_o10", on: "Entüisyonizmin bilginin kaynağını gördüğü yer nedir?" },
    { soru_id: K + "u04_k02_o11", on: "Gazali ile Bergson'un sezgi anlayışları arasındaki ortaklık nedir?" },
    { soru_id: K + "u04_k02_o12", on: "Bilginin doğruluk ölçütleri ve uygunluk ölçütü nedir?" },
    { soru_id: K + "u04_k02_o13", on: "Tutarlılık ölçütünün araştırdığı nedir?" },
    { soru_id: K + "u04_k02_o14", on: "Tümel uzlaşım ölçütünün değerlendirme biçimi nasıldır?" },
    { soru_id: K + "u04_k02_o15", on: "Yarar doğruluk ölçütünün sorguladığı nedir?" }
  ]),
  onlar(K + "u05_k01", [
    { soru_id: K + "u05_k01_o02", on: "Etiğin (ahlak felsefesinin) inceleme konusu nedir?" },
    { soru_id: K + "u05_k01_o03", on: "Etik ile ahlak arasındaki ilişki nasıl tanımlanır?" },
    { soru_id: K + "u05_k01_o04", on: "İyi ve kötü kavramlarının ahlak felsefesindeki kullanımı nedir?" },
    { soru_id: K + "u05_k01_o05", on: "Vicdanın ahlak felsefesindeki yeri nedir?" },
    { soru_id: K + "u05_k01_o06", on: "Sorumluluk kavramının tanımı nedir?" },
    { soru_id: K + "u05_k01_o07", on: "Ahlak felsefesinde özgürlüğün ifade ettiği nedir?" },
    { soru_id: K + "u05_k01_o08", on: "Erdem kavramının ahlak felsefesi açısından tanımı nedir?" },
    { soru_id: K + "u05_k01_o09", on: "İnsan eylemlerinin olgusal ve değer yönleri nasıl tanımlanır?" },
    { soru_id: K + "u05_k01_o11", on: "Ahlaki değerlerin toplumlar arasındaki kapsamı nedir?" },
    { soru_id: K + "u05_k01_o12", on: "Ahlak felsefesinin temel kavramları nedir?" }
  ])
];
