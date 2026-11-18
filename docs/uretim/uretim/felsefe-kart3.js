#!/usr/bin/env node
/* ============================================================
   FELSEFE 10 — KART ÖNLERİ · 3. DEMET (86 kart)
   Ahlak, estetik, siyaset, din ve bilim felsefesi havuzları.
   Kullanım:
     node docs/uretim/araclar/havuz-ekle.js docs/uretim/uretim/felsefe-kart3.js
   ============================================================ */
"use strict";

const K = "fel_10_";
const onlar = (konu_id, liste) => ({ konu_id, onlar: liste });

module.exports = [
  onlar(K + "u05_k02", [
    { soru_id: K + "u05_k02_o01", on: "Evrensel ahlak yasasının imkânı probleminin odaklandığı soru nedir?" },
    { soru_id: K + "u05_k02_o02", on: "Sokrates, Platon ve Aristoteles'in iyi anlayışındaki ortak bağ nedir?" },
    { soru_id: K + "u05_k02_o07", on: "Mill'in fayda anlayışında ahlaki iyinin ölçütü nedir?" },
    { soru_id: K + "u05_k02_o08", on: "Epiküros'un haz anlayışı ve evrensel yasa konusundaki görüşü nedir?" },
    { soru_id: K + "u05_k02_o09", on: "Hobbes'a göre iyi ve kötü yargılarının bağlı olduğu nedir?" },
    { soru_id: K + "u05_k02_o12", on: "Determinizm ile fatalizmin özgürlük anlayışları arasındaki ilişki nasıl tanımlanır?" },
    { soru_id: K + "u05_k02_o13", on: "İndeterminizmin insan özgürlüğünü temellendirme biçimi nasıldır?" },
    { soru_id: K + "u05_k02_o14", on: "Otodeterminizmin özgürlük açıklaması nedir?" },
    { soru_id: K + "u05_k02_o15", on: "Kant, Anselmus, Sartre ve Spinoza'da özgürlük-sorumluluk ilişkisi nedir?" }
  ]),
  onlar(K + "u06_k01", [
    { soru_id: K + "u06_k01_o01", on: "Estetiğin inceleme konusu nedir?" },
    { soru_id: K + "u06_k01_o02", on: "Sanat felsefesinin araştırdığı nedir?" },
    { soru_id: K + "u06_k01_o03", on: "Estetiği sanat felsefesinden ayıran temel ölçüt nedir?" },
    { soru_id: K + "u06_k01_o04", on: "Güzellik, hoş ve çirkin kavramlarının ayrımı nasıl tanımlanır?" },
    { soru_id: K + "u06_k01_o07", on: "Estetik özne ile estetik nesne arasındaki ilişki nedir?" },
    { soru_id: K + "u06_k01_o08", on: "Estetik tavır ne demektir?" },
    { soru_id: K + "u06_k01_o10", on: "Estetik değerin ifade ettiği nedir?" },
    { soru_id: K + "u06_k01_o12", on: "Taklit olarak sanat kuramının temel iddiası nedir?" },
    { soru_id: K + "u06_k01_o13", on: "Yaratım olarak sanat kuramının öne çıkardığı yön nedir?" },
    { soru_id: K + "u06_k01_o14", on: "Oyun olarak sanat kuramında sanatın görünümü nedir?" }
  ]),
  onlar(K + "u06_k02", [
    { soru_id: K + "u06_k02_o01", on: "Estetikte güzellik probleminin incelediği sorular nedir?" },
    { soru_id: K + "u06_k02_o02", on: "Aristoteles'in güzellik ölçütleri nedir?" },
    { soru_id: K + "u06_k02_o03", on: "Kant'ın hoş ile güzel ayrımı nasıl tanımlanır?" },
    { soru_id: K + "u06_k02_o05", on: "Güzelliğin kaynağı konusundaki iki yaklaşım nedir?" },
    { soru_id: K + "u06_k02_o06", on: "Ortak estetik yargıların imkânı probleminin ele aldığı soru nedir?" },
    { soru_id: K + "u06_k02_o07", on: "Estetik yargıların nesnelliğini savunan yaklaşımın dayanağı nedir?" },
    { soru_id: K + "u06_k02_o08", on: "Estetik yargıların öznelliğini savunan yaklaşımın vurgusu nedir?" },
    { soru_id: K + "u06_k02_o09", on: "Platon'un güzellik ideası açıklaması nedir?" },
    { soru_id: K + "u06_k02_o10", on: "Kant'ın ortak estetik yargıların imkânı açıklaması nedir?" },
    { soru_id: K + "u06_k02_o11", on: "Baumgarten'ın estetik yargı anlayışı nedir?" },
    { soru_id: K + "u06_k02_o12", on: "Croce'ye göre estetik yargıların tamamen öznel olmasının nedeni nedir?" },
    { soru_id: K + "u06_k02_o13", on: "Yüce ile güzel arasındaki temel ölçüt nedir?" }
  ]),
  onlar(K + "u07_k01", [
    { soru_id: K + "u07_k01_o01", on: "Siyasetin genel anlamı nedir?" },
    { soru_id: K + "u07_k01_o02", on: "Politika sözcüğünün Antik Çağ'daki kökeni nedir?" },
    { soru_id: K + "u07_k01_o03", on: "Siyaset felsefesinin sorguladığı nedir?" },
    { soru_id: K + "u07_k01_o05", on: "Siyaset felsefesinde hak kavramının ifade ettiği nedir?" },
    { soru_id: K + "u07_k01_o06", on: "Siyaset felsefesinde adaletin tanımı nedir?" },
    { soru_id: K + "u07_k01_o07", on: "Eşitliğin siyaset felsefesindeki anlamı nedir?" },
    { soru_id: K + "u07_k01_o08", on: "Siyasal yaşamda özgürlüğün ifade ettiği nedir?" },
    { soru_id: K + "u07_k01_o10", on: "Birey-devlet ilişkisinin siyaset felsefesinde temel konu olmasının nedeni nedir?" }
  ]),
  onlar(K + "u07_k02", [
    { soru_id: K + "u07_k02_o01", on: "Devletin kökeni problemindeki temel soru nedir?" },
    { soru_id: K + "u07_k02_o02", on: "Hobbes'a göre insanların Leviathan niteliğindeki devleti kurma nedeni nedir?" },
    { soru_id: K + "u07_k02_o05", on: "Epiküros'a göre devletin kurulma amaçları nedir?" },
    { soru_id: K + "u07_k02_o06", on: "Platon ve Farabi'nin devleti doğal kurum saymasının nedeni nedir?" },
    { soru_id: K + "u07_k02_o08", on: "Siyaset felsefesinde meşruiyet ne demektir?" },
    { soru_id: K + "u07_k02_o10", on: "Monarşi ile aristokrasiyi ayıran ölçüt nedir?" },
    { soru_id: K + "u07_k02_o11", on: "Demokraside iktidarın meşruiyetinin sağlanma biçimi nasıldır?" },
    { soru_id: K + "u07_k02_o12", on: "Anarşizmin ideal düzen tartışmasındaki savı nedir?" },
    { soru_id: K + "u07_k02_o13", on: "Ütopya ile distopya arasındaki ilişki nasıl tanımlanır?" },
    { soru_id: K + "u07_k02_o14", on: "Liberalizmin ideal düzenin temeli olarak gördüğü değer nedir?" },
    { soru_id: K + "u07_k02_o15", on: "Sosyalizm ile sosyal devlet yaklaşımının ideal düzen ölçütleri nedir?" }
  ]),
  onlar(K + "u08_k01", [
    { soru_id: K + "u08_k01_o03", on: "Din sisteminde kutsal güç ve ibadetin yeri nedir?" },
    { soru_id: K + "u08_k01_o04", on: "Dinde mutlak iman ne demektir?" },
    { soru_id: K + "u08_k01_o05", on: "Din felsefesinin araştırdığı konular nedir?" },
    { soru_id: K + "u08_k01_o06", on: "Din felsefesinin yaklaşımının nitelikleri nedir?" },
    { soru_id: K + "u08_k01_o07", on: "Din felsefesinin inançların insan yaşamındaki etkileri bakımından araştırdığı nedir?" }
  ]),
  onlar(K + "u08_k02", [
    { soru_id: K + "u08_k02_o01", on: "Din felsefesinin dört temel problemi nedir?" },
    { soru_id: K + "u08_k02_o02", on: "Teizm ile deizmin Tanrı-evren ilişkisi açıklaması nasıl tanımlanır?" },
    { soru_id: K + "u08_k02_o03", on: "Panteizm ile panenteizmin Tanrı-evren ilişkisi ayrımı nedir?" },
    { soru_id: K + "u08_k02_o04", on: "Ateizmin Tanrı'nın varlığı konusundaki savı nedir?" },
    { soru_id: K + "u08_k02_o05", on: "Teleolojik argümanın temel çıkarımı nedir?" },
    { soru_id: K + "u08_k02_o06", on: "Kozmolojik argümanın temel çıkarımı nedir?" },
    { soru_id: K + "u08_k02_o07", on: "Ontolojik argümanın Tanrı'nın varlığını savunma biçimi nasıldır?" },
    { soru_id: K + "u08_k02_o08", on: "Kötülük argümanının Tanrı'nın varlığına itiraz biçimi nasıldır?" },
    { soru_id: K + "u08_k02_o09", on: "Evrenin sonluluğu ve sonsuzluğu görüşlerinin kaynaktaki örnekleri nedir?" },
    { soru_id: K + "u08_k02_o10", on: "Platon'a göre ruhun ölümsüzlük nedeni nedir?" },
    { soru_id: K + "u08_k02_o11", on: "İbn Sina'nın ruhun ölümsüzlüğü açıklaması nedir?" },
    { soru_id: K + "u08_k02_o12", on: "Farabi'nin ruhun ölümsüzlüğü açıklaması nedir?" },
    { soru_id: K + "u08_k02_o13", on: "Epiküros'un ruhun ölümlülüğünü temellendirme biçimi nasıldır?" },
    { soru_id: K + "u08_k02_o14", on: "Paul Tillich'in ölümden sonra ruhun varlığı yorumu nedir?" },
    { soru_id: K + "u08_k02_o15", on: "John Locke'un ruhun ölümsüzlüğünü temellendirme biçimi nasıldır?" }
  ]),
  onlar(K + "u09_k01", [
    { soru_id: K + "u09_k01_o02", on: "Bilim ile bilim felsefesinin uğraşları arasındaki ilişki nasıl tanımlanır?" },
    { soru_id: K + "u09_k01_o04", on: "İbnülheysem'in karanlık oda çalışmasında gözlem ile deney ayrımı nedir?" },
    { soru_id: K + "u09_k01_o06", on: "Michelson–Morley deneyinin amacı ve sonucu nedir?" },
    { soru_id: K + "u09_k01_o07", on: "Bilimsel yasanın oluşum biçimi nasıldır?" },
    { soru_id: K + "u09_k01_o09", on: "Bilimsel yöntemin temel aşamaları nedir?" },
    { soru_id: K + "u09_k01_o10", on: "Bilimsel bilgi üretiminin sistemli ve yöntemli sayılma nedeni nedir?" }
  ]),
  onlar(K + "u09_k02", [
    { soru_id: K + "u09_k02_o01", on: "Klasik ve çağdaş bilim anlayışları arasındaki ilişki nasıl tanımlanır?" },
    { soru_id: K + "u09_k02_o02", on: "Klasik bilim anlayışının öne çıkardığı bilgi alanları ve yöntem nedir?" },
    { soru_id: K + "u09_k02_o03", on: "Klasik bilim anlayışına göre bilimsel ilerleme ve bilimin amacı nedir?" },
    { soru_id: K + "u09_k02_o04", on: "Çağdaş bilim anlayışına göre bilimsel ilerlemenin biçimi nasıldır?" },
    { soru_id: K + "u09_k02_o05", on: "Bilimin yöntemi probleminin cevap aradığı sorular nedir?" },
    { soru_id: K + "u09_k02_o07", on: "Carnap'a göre bilimsel önermenin temel koşulları nedir?" },
    { soru_id: K + "u09_k02_o08", on: "Carnap'ın doğrudan ve dolaylı doğrulama ayrımı nasıl tanımlanır?" },
    { soru_id: K + "u09_k02_o09", on: "Popper'ın bilim ölçütü olarak öne çıkardığı nedir?" },
    { soru_id: K + "u09_k02_o10", on: "Kuhn'un paradigma kavramı ne demektir?" },
    { soru_id: K + "u09_k02_o12", on: "Popper ile Kuhn'un bilimsel değişim açıklamaları arasındaki ilişki nasıl tanımlanır?" }
  ])
];
