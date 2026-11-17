#!/usr/bin/env node
/* ============================================================
   TDE MÜFREDAT İLİŞKİ ÜRETİCİ  (scripts/tde-icerik-uret.js)
   ------------------------------------------------------------
   NE YAPAR
   Uygulamanın Bilgi Bankası müfredat ağacındaki 10. sınıf TDE
   konularının (30 konu) "neyle ilişkili" olduğunu çıkarır ve
   site/content/mufredat/tde_kazanim_10.json içine yazar:

     konu.pdf_sayfa        → ders notundaki sayfa aralığı
     konu.bolum            → bölüm başlığı
     konu.anahtar_kavramlar→ kavram listesi
     konu.icerik.ozellikler→ maddeler (kaynak metinden, birebir)
     konu.icerik.tanim     → tanım cümlesi
     konu.iliskili_konular → {konu, tur, neden} ilişkileri

   KAYNAK
   "10 Edebiyat Ders notları Yeni Müfredat.pdf" (149 sayfa,
   Mustafa Çiftçi, 2026). PDF metni bir kez dökülür:
       node scripts/pdf-metin.js "<pdf>" /tmp/tde-temiz.txt
   Sonra:
       node scripts/tde-icerik-uret.js /tmp/tde-temiz.txt
   Metin verilmezse yalnız elle yazılmış ilişki tablosu işlenir
   (maddeler korunur, uydurulmaz).

   SIRA: önce tde-kazanim-uret.js, sonra bu betik.
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const KOK = path.join(__dirname, "..");
const DOSYA = path.join(KOK, "site/content/mufredat/tde_kazanim_10.json");
const VERI_MODUL = path.join(KOK, "site/okz-tde-veri.js");
const RAPOR = path.join(KOK, "docs/uretim/TDE-MUFREDAT-ILISKILERI.md");

/* ------------------------------------------------------------
   KONU TABLOSU — müfredat ağacındaki 30 konu
   pdf     : ders notundaki sayfa aralıkları (1 tabanlı, "-- n of 149 --")
   bolum   : PDF'teki bölüm başlığı
   kavram  : anahtar kavramlar (PDF tema kavram sayfaları + bölüm başlıkları)
   iliski  : {k, tur, neden}  k = konu_id son eki (u01k01 gibi kısa yazım)
   ------------------------------------------------------------ */
const K = (u, k) => "edebiyat_10_u" + String(u).padStart(2, "0") + "_k" + String(k).padStart(2, "0");

const KONU = [
  /* ---------------- 1. TEMA: SÖZÜN EZGİSİ ---------------- */
  {
    id: K(1, 1), pdf: [[10, 11]], bolum: "İslamiyet Öncesi Türk Şiiri — Koşuk",
    kavram: ["koşuk", "sagu", "destan", "sav", "kopuz", "ozan", "kam", "baksı", "şaman", "sığır", "şölen", "yuğ", "hece ölçüsü", "dörtlük", "yarım uyak", "Divanü Lügati't-Türk"],
    iliski: [
      { k: "u01k02", tur: "ayni-donem", neden: "Sav da İslamiyet öncesi sözlü dönemin ürünüdür; koşukla aynı törenlerde (sığır, şölen, yuğ) yaşar." },
      { k: "u01k04", tur: "devam", neden: "Koşuk, halk edebiyatındaki koşmanın kaynağıdır; ikisi de dörtlük ve hece ölçüsüyle söylenir." },
      { k: "u01k03", tur: "ayni-gelenek", neden: "Türkü ile birlikte ezgiyle söylenen anonim sözlü ürünlerdir." },
      { k: "u03k01", tur: "onkosul", neden: "Destan dönemi şiirinin nazım birimi koşuktur; destan konusu bu temelden beslenir." },
      { k: "u03k06", tur: "karistirilir", neden: "Koşukta ahenk ögeleri (hece ölçüsü, yarım uyak, redif) doğrudan işlenir." }
    ]
  },
  {
    id: K(1, 2), pdf: [[11, 11]], bolum: "Sav",
    kavram: ["sav", "atasözü", "sözlü dönem", "kısa ve özlü söz", "yaşam deneyimi"],
    iliski: [
      { k: "u01k01", tur: "ayni-donem", neden: "Koşukla aynı dönemin (İslamiyet öncesi sözlü dönem) ürünüdür." },
      { k: "u01k05", tur: "ayni-gelenek", neden: "İkisi de anonim halk ürünüdür; masal gibi sözlü gelenekte yaşar." },
      { k: "u04k06", tur: "karistirilir", neden: "Sav bugünün atasözü, vecize ve özlü sözleriyle karıştırılır; paragrafta özlü anlatım konusuyla ilişkilidir." }
    ]
  },
  {
    id: K(1, 3), pdf: [[13, 15]], bolum: "Anonim Halk Edebiyatı — Türkü",
    kavram: ["türkü", "anonim halk edebiyatı", "kavuştak (nakarat)", "bent", "ezgi", "ağıt", "ninni", "mani", "varyant", "hece ölçüsü"],
    iliski: [
      { k: "u01k04", tur: "ayni-gelenek", neden: "Türkü anonim, koşma âşık tarzı halk şiiridir; ikisi de dörtlük ve ezgiyle söylenir." },
      { k: "u01k05", tur: "ayni-gelenek", neden: "Masal gibi anonim halk edebiyatı ürünüdür; ikisi de varyantlaşır." },
      { k: "u03k06", tur: "onkosul", neden: "Türkünün ezgisi ve ölçüsü ahenk konusunun somut örneğidir." },
      { k: "u01k01", tur: "ayni-gelenek", neden: "Koşukla birlikte ezgi eşliğinde söylenen en eski şiir türlerindendir." }
    ]
  },
  {
    id: K(1, 4), pdf: [[15, 18]], bolum: "Âşık Tarzı Halk Şiiri — Koşma",
    kavram: ["koşma", "âşık tarzı halk şiiri", "saz şairi", "mahlas (tapşırma)", "güzelleme", "koçaklama", "taşlama", "ağıt", "cönk", "hece ölçüsü", "dörtlük", "kafiye"],
    iliski: [
      { k: "u01k01", tur: "koken", neden: "Koşma, İslamiyet öncesi koşuğun devamıdır." },
      { k: "u01k03", tur: "ayni-gelenek", neden: "Türkü ile aynı sözlü gelenekten beslenir; koşma âşık, türkü anonim kaynaklıdır." },
      { k: "u03k06", tur: "karistirilir", neden: "Koşmanın kafiye örgüsü ve hece kalıbı ahenk konusunun uygulama alanıdır." },
      { k: "u03k01", tur: "karistirilir", neden: "Halk şiirinde 'destan' da bir koşma türüdür; edebî destanla karıştırılmamalı." }
    ]
  },
  {
    id: K(1, 5), pdf: [[18, 20]], bolum: "Masal",
    kavram: ["masal", "olağanüstülük", "tekerleme", "döşeme", "serim", "düğüm", "çözüm", "dilek", "varyant", "anonim", "kurmaca", "Kelile ve Dimne"],
    iliski: [
      { k: "u03k04", tur: "karistirilir", neden: "Fabl da masal gibi hayvan kahramanlar kullanır; fabl ders verir, masal olağanüstüdür." },
      { k: "u03k03", tur: "karistirilir", neden: "Halk hikâyesi ile masal aynı anonim gelenektedir; masal olağanüstü, halk hikâyesi gerçeğe yakındır." },
      { k: "u01k03", tur: "ayni-gelenek", neden: "İkisi de anonim halk edebiyatı ürünüdür; masal nesir, türkü manzumdur." },
      { k: "u03k06", tur: "icerik", neden: "Masalın tekerlemesi ve nakaratı ahenk unsurlarıyla (ritim, tekrar) ilişkilidir." }
    ]
  },
  {
    id: K(1, 6), pdf: [[39, 48]], bolum: "Dil Bilgisi — İsimler (Adlar)",
    kavram: ["isim", "ad", "özel isim", "cins isim", "somut", "soyut", "tekil", "çoğul", "topluluk ismi", "isim hâl ekleri", "iyelik eki", "tamlayan eki", "ekfiil"],
    iliski: [
      { k: "u01k07", tur: "onkosul", neden: "İsim tamlaması isim + tamlayan/tamlanan ilişkisidir; isim konusu bilinmeden kurulamaz." },
      { k: "u01k08", tur: "onkosul", neden: "Sıfat, ismi niteler; sıfatı bulmak için ismi tanımak gerekir." },
      { k: "u04k03", tur: "karsit", neden: "İsim ile fiil, sözcük türlerinin iki ana kolu; ekfiil ikisini birleştirir." }
    ]
  },
  {
    id: K(1, 7), pdf: [[60, 64]], bolum: "Dil Bilgisi — İsim Tamlamaları",
    kavram: ["isim tamlaması", "tamlayan", "tamlanan", "belirtili", "belirtisiz", "takısız zincirleme", "ilgi eki", "iyelik eki"],
    iliski: [
      { k: "u01k06", tur: "onkosul", neden: "Tamlamanın kurucuları isimdir; hâl ve iyelik ekleri burada kullanılır." },
      { k: "u01k09", tur: "karistirilir", neden: "İsim tamlaması ile sıfat tamlaması en çok karıştırılan iki tamlama türüdür." },
      { k: "u02k05", tur: "karistirilir", neden: "İlgi eki (-ın/-in) ile iyelik eki, zamir konusunda da ayrım gerektirir." }
    ]
  },
  {
    id: K(1, 8), pdf: [[49, 59]], bolum: "Dil Bilgisi — Sıfatlar (Ön Adlar)",
    kavram: ["sıfat", "ön ad", "niteleme sıfatı", "belirtme sıfatı", "işaret sıfatı", "sayı sıfatı", "soru sıfatı", "belgisiz sıfat", "basit sıfat", "türemiş sıfat", "birleşik sıfat"],
    iliski: [
      { k: "u01k06", tur: "onkosul", neden: "Sıfat ismi niteler; isim konusu olmadan sıfatın görevi anlaşılmaz." },
      { k: "u01k09", tur: "onkosul", neden: "Sıfat tamlaması sıfat + isim kuruluşudur." },
      { k: "u02k05", tur: "karistirilir", neden: "Soru sıfatı (hangi, kaç) ile soru zamiri (hangisi, kaçı) karıştırılır." },
      { k: "u03k05", tur: "karistirilir", neden: "Niteleme sıfatı zarf ile sık sık karıştırılır: ismi nitelerse sıfat, fiili nitelerse zarftır." }
    ]
  },
  {
    id: K(1, 9), pdf: [[64, 67]], bolum: "Dil Bilgisi — Sıfat Tamlamaları",
    kavram: ["sıfat tamlaması", "sıfat", "isim", "belirtisiz sıfat tamlaması", "takısız", "sıfatın isimden önce gelmesi"],
    iliski: [
      { k: "u01k08", tur: "onkosul", neden: "Sıfat tamlamasının kurucusu sıfattır." },
      { k: "u01k07", tur: "karistirilir", neden: "İsim tamlaması ile arasındaki ayrım (tamlananın türü) sınavda sık sorulur." }
    ]
  },

  /* ---------------- 2. TEMA: KELİMELERİN RİTMİ ---------------- */
  {
    id: K(2, 1), pdf: [[73, 75]], bolum: "Divan Şiiri — Gazel",
    kavram: ["gazel", "divan edebiyatı", "beyit", "matla", "makta", "mahlas", "redif", "kafiye", "aruz", "aa ba ca"],
    iliski: [
      { k: "u02k02", tur: "ayni-gelenek", neden: "Kaside ile aynı nazım birimini (beyit) ve ölçüyü (aruz) kullanır; kasidenin ilk bölümü gazel biçimindedir." },
      { k: "u02k03", tur: "ayni-gelenek", neden: "Mersiye divan şiirinin konuya göre adlandırılan türlerindendir; aynı biçim dünyasında yaşar." },
      { k: "u02k04", tur: "karsit", neden: "Saf şiir, gazelin kalıplaşmış mazmun dünyasına tepki olarak doğar." },
      { k: "u03k06", tur: "icerik", neden: "Gazelin aruz kalıbı, kafiyesi ve redifi doğrudan ahenk konusudur." },
      { k: "u03k02", tur: "ayni-gelenek", neden: "Mesnevi de divan şiiri nazım biçimidir; gazelden beyit sayısı ve konusuyla ayrılır." }
    ]
  },
  {
    id: K(2, 2), pdf: [[75, 77]], bolum: "Divan Şiiri — Kaside",
    kavram: ["kaside", "nesip (teşbib)", "girizgâh", "methiye", "fahriye", "tegazzül", "dua", "tevhit", "münacat", "naat", "hicviye"],
    iliski: [
      { k: "u02k01", tur: "ayni-gelenek", neden: "Gazel ile aynı beyit/aruz düzenindedir." },
      { k: "u02k03", tur: "ayni-gelenek", neden: "Kasidenin konuya göre türleri arasında mersiye de sayılır." },
      { k: "u03k02", tur: "ayni-gelenek", neden: "İkisi de divan edebiyatı nazım biçimidir; kaside tek konulu, mesnevi anlatıya dayalıdır." }
    ]
  },
  {
    id: K(2, 3), pdf: [[77, 79]], bolum: "Divan Şiiri — Mersiye",
    kavram: ["mersiye", "ağıt", "divan edebiyatı", "nazım türü", "ölen kişinin ardından"],
    iliski: [
      { k: "u02k01", tur: "ayni-gelenek", neden: "Divan şiiri biçim dünyasında (beyit, aruz) yazılır." },
      { k: "u02k02", tur: "ayni-gelenek", neden: "Kasidenin konuya göre türlerinden biri olarak da ele alınır." },
      { k: "u01k04", tur: "karistirilir", neden: "Halk şiirindeki ağıt ile divan şiirindeki mersiye karşılıklıdır; biri âşık, diğeri divan geleneğindedir." }
    ]
  },
  {
    id: K(2, 4), pdf: [[79, 91]], bolum: "Yeni Türk Şiiri — Saf Şiir",
    kavram: ["saf şiir", "imge", "çağrışım", "simge (sembol)", "şiir dili", "şiirde gerçeklik", "şiirde tema", "şair-metin ilişkisi", "metin-dönem ilişkisi", "anlatım biçimleri", "edebî metin", "kurmaca"],
    iliski: [
      { k: "u02k01", tur: "karsit", neden: "Saf şiir, divan şiirinin mazmunlu, kalıplaşmış diline tepkidir; şiir dili ve imge öne çıkar." },
      { k: "u03k06", tur: "onkosul", neden: "İmge ve çağrışım ahengin yanında şiirin ses/anlam örgüsünü kurar." },
      { k: "u04k06", tur: "ayni-beceri", neden: "Şiirde imge çözümleme ile paragrafta anlam/çıkarım aynı okuma becerisini kullanır." },
      { k: "u04k02", tur: "donem", neden: "Tanzimat şiiri ile yeni Türk şiiri arasındaki değişim, metin-dönem ilişkisinin somut örneğidir." }
    ]
  },
  {
    id: K(2, 5), pdf: [[91, 98]], bolum: "Dil Bilgisi — Zamir (Adıl)",
    kavram: ["zamir", "adıl", "kişi zamiri", "işaret zamiri", "belgisiz zamir", "soru zamiri", "dönüşlülük zamiri", "iyelik zamiri", "ilgi zamiri", "ek hâlinde zamir"],
    iliski: [
      { k: "u01k06", tur: "onkosul", neden: "Zamir, ismin yerini tutar; isim konusu bilinmeden anlaşılmaz." },
      { k: "u01k08", tur: "karistirilir", neden: "Soru zamiri ile soru sıfatı, işaret zamiri ile işaret sıfatı karıştırılır." },
      { k: "u02k06", tur: "ayni-grup", neden: "Edatlar zamirlerle öbek kurar (edat grubu)." }
    ]
  },
  {
    id: K(2, 6), pdf: [[98, 103]], bolum: "Dil Bilgisi — Edat (İlgeç)",
    kavram: ["edat", "ilgeç", "edat grubu", "gibi", "göre", "kadar", "için", "sadece", "ancak", "karşı", "başka"],
    iliski: [
      { k: "u02k07", tur: "karistirilir", neden: "Bazı sözcükler hem edat hem bağlaç olarak kullanılır (ancak, yalnız, sadece)." },
      { k: "u02k05", tur: "onkosul", neden: "Edatlar isim ve zamirlerle öbek kurar; zamir bilgisi gerekir." },
      { k: "u03k05", tur: "karistirilir", neden: "Edat öbeği ile zarf öbeği karıştırılır." }
    ]
  },
  {
    id: K(2, 7), pdf: [[103, 107]], bolum: "Dil Bilgisi — Bağlaçlar",
    kavram: ["bağlaç", "ama", "fakat", "lakin", "ne…ne", "bile", "dahi", "meğer", "eğer", "zira", "oysa", "hem…hem"],
    iliski: [
      { k: "u02k06", tur: "karistirilir", neden: "Hem edat hem bağlaç olan sözcükler bu iki konunun ortak sorusudur." },
      { k: "u02k09", tur: "onkosul", neden: "Bağlaçlar cümleler arasında anlam ilgisi kurar; cümlede anlam konusunun temelidir." },
      { k: "u02k08", tur: "ayni-grup", neden: "Ünlem ve bağlaç, edatla birlikte 'edat-bağlaç-ünlem' grubunda işlenir." }
    ]
  },
  {
    id: K(2, 8), pdf: [[107, 108]], bolum: "Dil Bilgisi — Ünlem",
    kavram: ["ünlem", "asıl ünlem", "ünlem gibi kullanılan sözcükler", "duygu bildirme", "seslenme"],
    iliski: [
      { k: "u02k07", tur: "ayni-grup", neden: "Edat-bağlaç-ünlem birlikte işlenir; ünlem bağlaçla karıştırılır." },
      { k: "u02k09", tur: "icerik", neden: "Ünlem cümleye duygu/abartı anlamı katar; cümlede anlam konusunu besler." },
      { k: "u01k04", tur: "icerik", neden: "Koşmalarda 'bre, behey, hey' gibi ünlemler varsağı türünü ayırt ettirir." }
    ]
  },
  {
    id: K(2, 9), pdf: [[67, 70]], bolum: "Cümlede Anlam — Anlamına Göre Cümleler",
    kavram: ["neden-sonuç", "amaç-sonuç", "koşul", "açıklama", "karşılaştırma", "olumlu cümle", "olumsuz cümle", "soru cümlesi", "üslup", "kesinlik", "olasılık"],
    iliski: [
      { k: "u04k06", tur: "onkosul", neden: "Paragraf, anlamına göre cümlelerin birleşmesinden kurulur." },
      { k: "u02k07", tur: "onkosul", neden: "Neden-sonuç, amaç-sonuç ilgileri bağlaçlarla kurulur." },
      { k: "u04k05", tur: "icerik", neden: "Noktalama, cümlenin anlamını ve tonunu belirler (soru işareti, ünlem, virgül)." }
    ]
  },

  /* ---------------- 3. TEMA: DÜNDEN BUGÜNE ---------------- */
  {
    id: K(3, 1), pdf: [[109, 116]], bolum: "Destan",
    kavram: ["destan", "doğal destan", "yapma destan", "mit", "motif", "kurt (gökbörü)", "mağara", "bilge tipi", "alp tipi", "Altay-Yakut", "Uygur", "Göktürk", "Oğuz Kağan", "Manas", "şu"],
    iliski: [
      { k: "u01k01", tur: "onkosul", neden: "Destan dönemi şiirinin nazım birimi koşuktur; destan bu temelden doğar." },
      { k: "u03k03", tur: "devam", neden: "Halk hikâyesi, destan geleneğinin yerini tutan daha geç dönem anlatısıdır." },
      { k: "u04k01", tur: "devam", neden: "Dede Korkut, destansı Oğuz hikâyelerinin yazıya geçmiş hâlidir." },
      { k: "u03k04", tur: "karistirilir", neden: "Halk şiirindeki 'destan' (koşma türü) ile edebî destan karıştırılmamalı." },
      { k: "u03k02", tur: "karsit", neden: "Mesnevi yazılı/divan geleneğinin anlatısı, destan ise sözlü geleneğin ürünüdür." }
    ]
  },
  {
    id: K(3, 2), pdf: [[116, 118]], bolum: "Divan Şiiri — Mesnevi",
    kavram: ["mesnevi", "beyit", "aruz", "hamse", "divan edebiyatı", "anlatı", "aa bb cc"],
    iliski: [
      { k: "u02k01", tur: "ayni-gelenek", neden: "Gazelle aynı divan şiiri dünyasında; beyit birimi ortak." },
      { k: "u02k02", tur: "ayni-gelenek", neden: "Kaside gibi divan şiiri nazım biçimidir; kaside tek konulu, mesnevi anlatıdır." },
      { k: "u03k03", tur: "karistirilir", neden: "Mesnevi (divan, yazılı) ile halk hikâyesi (anonim, sözlü) karıştırılır." },
      { k: "u03k01", tur: "karsit", neden: "Destan sözlü, mesnevi yazılı geleneğin anlatı biçimidir." }
    ]
  },
  {
    id: K(3, 3), pdf: [[118, 120]], bolum: "Halk Hikâyesi",
    kavram: ["halk hikâyesi", "anonim", "âşık", "fasıl", "döşeme", "saz", "kurmaca", "Kerem ile Aslı", "Âşık Garip", "cönk"],
    iliski: [
      { k: "u03k01", tur: "koken", neden: "Halk hikâyesi destan geleneğinin devamıdır." },
      { k: "u01k05", tur: "karistirilir", neden: "Masal olağanüstü, halk hikâyesi gerçeğe yakın anlatıdır; ikisi de anonimdir." },
      { k: "u04k01", tur: "devam", neden: "Dede Korkut hikâyeleri halk hikâyesi geleneğinin en eski örnekleridir." },
      { k: "u03k02", tur: "karistirilir", neden: "Mesnevi yazılı divan, halk hikâyesi sözlü halk geleneğidir." }
    ]
  },
  {
    id: K(3, 4), pdf: [[120, 122]], bolum: "Fabl",
    kavram: ["fabl", "hayvan kahraman", "ders verme", "kıssadan hisse", "Kelile ve Dimne", "La Fontaine", "kişileştirme", "teşhis"],
    iliski: [
      { k: "u01k05", tur: "karistirilir", neden: "Masal ile fabl karıştırılır: fabl kısa ve ders verir, masal uzun ve olağanüstüdür." },
      { k: "u03k03", tur: "ayni-gelenek", neden: "İkisi de sözlü halk anlatısıdır; fabl didaktik, halk hikâyesi epik-liriktir." },
      { k: "u03k01", tur: "icerik", neden: "Fabl da destan gibi kahraman/motif üzerinden anlatır; ancak ders amaçlıdır." }
    ]
  },
  {
    id: K(3, 5), pdf: [[122, 129]], bolum: "Dil Bilgisi — Zarflar (Belirteçler)",
    kavram: ["zarf", "belirteç", "durum zarfı", "zaman zarfı", "yer-yön zarfı", "azlık-çokluk zarfı", "soru zarfı", "basit zarf", "türemiş zarf", "birleşik zarf", "zarf-fiil"],
    iliski: [
      { k: "u01k08", tur: "karistirilir", neden: "Sıfat ismi niteler, zarf fiili niteler; 'güzel' sözcüğü iki görevde de kullanılır." },
      { k: "u04k03", tur: "onkosul", neden: "Zarf, fiilin anlamını belirler; fiil konusu bilinmeden zarfın görevi anlaşılmaz." },
      { k: "u02k06", tur: "karistirilir", neden: "Zaman bildiren sözcükler edatlarla zarf görevi kazanır." }
    ]
  },
  {
    id: K(3, 6), pdf: [[22, 35]], bolum: "Şiir Bilgisi — Şiirde Ahenk",
    kavram: ["ahenk", "armoni", "ölçü", "hece ölçüsü", "hece", "aruz", "serbest ölçü", "durak", "kafiye", "redif", "aliterasyon", "asonans", "cinaslı kafiye", "zengin kafiye", "düz kafiye", "çapraz kafiye", "sarmal kafiye", "nakarat", "ritim", "ses", "ses akışı", "söyleyiş", "vurgu", "tonlama", "nazım birimi", "nazım biçimi", "nazım türü"],
    iliski: [
      { k: "u01k01", tur: "icerik", neden: "Koşuğun hece ölçüsü ve yarım uyağı ahenk konusunun ilk örneğidir." },
      { k: "u01k04", tur: "icerik", neden: "Koşmanın kafiye örgüsü ve hece kalıbı ahenkle çözülür." },
      { k: "u01k03", tur: "icerik", neden: "Türkünün ezgisi, nakaratı ve ölçüsü ahenk unsurlarıdır." },
      { k: "u02k01", tur: "icerik", neden: "Gazelin aruz kalıbı, kafiyesi ve redifi ahenk bilgisiyle çözümlenir." },
      { k: "u02k04", tur: "icerik", neden: "Saf şiirde ahenk, anlamı taşıyan kurucu ögedir." }
    ]
  },

  /* ---------------- 4. TEMA: NESİLLERİN MİRASI ---------------- */
  {
    id: K(4, 1), pdf: [[130, 132]], bolum: "Dede Korkut Hikâyeleri",
    kavram: ["Dede Korkut", "Oğuz", "boy", "destansı hikâye", "millî bilinç", "sözlü kültür", "kurmaca", "olağanüstülük", "Bamsı Beyrek", "Boğaç Han"],
    iliski: [
      { k: "u03k01", tur: "koken", neden: "Dede Korkut, destansı Oğuz hikâyelerinin yazıya geçmiş hâlidir." },
      { k: "u03k03", tur: "devam", neden: "Halk hikâyesi geleneğinin en eski ve en güçlü örneğidir." },
      { k: "u01k05", tur: "karistirilir", neden: "Olağanüstü unsurlar taşısa da masal değil, destansı hikâyedir." },
      { k: "u04k02", tur: "donem", neden: "Millî bilinç ve sözlü kültür, Tanzimat sonrası edebiyatın beslendiği kaynaktır." }
    ]
  },
  {
    id: K(4, 2), pdf: [[132, 133]], bolum: "Tanzimat Dönemi Şiiri",
    kavram: ["Tanzimat", "I. dönem", "II. dönem", "Batılılaşma", "Fransız edebiyatı", "vatan", "hürriyet", "Namık Kemal", "Ziya Paşa", "Şinasi", "Abdülhak Hamit", "divan şiiri eleştirisi"],
    iliski: [
      { k: "u02k01", tur: "karsit", neden: "Tanzimat şiiri divan şiirinin (gazel) biçim ve mazmun dünyasını eleştirerek yeni konulara yönelir." },
      { k: "u02k04", tur: "donem", neden: "Saf şiir, Tanzimat'la başlayan yenileşmenin daha ileri aşamasıdır." },
      { k: "u03k06", tur: "icerik", neden: "Yeni biçim arayışları ölçü, kafiye ve ahenk tartışmalarıyla görünür olur." },
      { k: "u04k01", tur: "donem", neden: "Millî kaynaklara yönelme, Dede Korkut'un yeniden keşfiyle ilişkilidir." }
    ]
  },
  {
    id: K(4, 3), pdf: [[133, 147]], bolum: "Dil Bilgisi — Fiiller (Eylemler)",
    kavram: ["fiil", "eylem", "kip", "kişi", "haber kipleri", "dilek kipleri", "birleşik zaman", "ekfiil", "basit fiil", "türemiş fiil", "birleşik fiil", "yardımcı fiil", "anlam kayması", "çatı", "fiil çatısı", "geçişli fiil", "geçişsiz fiil", "ettirgen", "edilgen", "dönüşlü", "işteş"],
    iliski: [
      { k: "u03k05", tur: "onkosul", neden: "Zarf, fiilin anlamını belirler; fiil bilgisi zarfın görevini açıklar." },
      { k: "u01k06", tur: "karsit", neden: "İsim ve fiil sözcük türlerinin iki ana kolu; ekfiil ikisini birleştirir." },
      { k: "u02k09", tur: "icerik", neden: "Kip kayması cümlenin anlamını değiştirir; cümlede anlam konusunu besler." },
      { k: "u02k05", tur: "karistirilir", neden: "İyelik eki ile kişi eki, isim ve fiil çekiminde karıştırılır." }
    ]
  },
  {
    id: K(4, 4), pdf: [], bolum: "Destekleyici Dil Bilgisi — Yazım Kuralları",
    kavram: ["yazım", "imla", "büyük harf", "birleşik sözcük", "de/da", "ki", "mi", "sayıların yazımı", "kısaltmalar"],
    iliski: [
      { k: "u04k05", tur: "ayni-grup", neden: "Yazım ve noktalama birlikte 'destekleyici dil bilgisi' başlığında verilir." },
      { k: "u04k06", tur: "icerik", neden: "Yazım yanlışı paragrafın anlaşılırlığını bozar; paragraf sorularında ölçüt olur." },
      { k: "u02k07", tur: "karistirilir", neden: "'de/da' ve 'ki' hem bağlaç hem ek olarak yazım kuralıyla ayrılır." }
    ],
    not: "PDF'te 'Ek 1' olarak anılıyor; bu kopyada ek sayfaları yok. İlişkiler müfredat ağacı + PDF içindekilerden."
  },
  {
    id: K(4, 5), pdf: [], bolum: "Destekleyici Dil Bilgisi — Noktalama İşaretleri",
    kavram: ["noktalama", "nokta", "virgül", "noktalı virgül", "iki nokta", "soru işareti", "ünlem", "kesme işareti", "tırnak", "yay ayraç"],
    iliski: [
      { k: "u04k04", tur: "ayni-grup", neden: "Yazım ve noktalama birlikte destekleyici dil bilgisi başlığındadır." },
      { k: "u02k09", tur: "icerik", neden: "Noktalama cümlenin anlamını ve tonunu belirler (soru, ünlem, kesme)." },
      { k: "u02k08", tur: "karistirilir", neden: "Ünlem işareti ile ünlem türü sözcük karıştırılır." }
    ],
    not: "PDF'te 'Ek 2' olarak anılıyor; bu kopyada ek sayfaları yok."
  },
  {
    id: K(4, 6), pdf: [[85, 91]], bolum: "Paragraf — Anlatım Biçimleri ve Anlatım Özellikleri",
    kavram: ["paragraf", "ana düşünce", "konu", "yardımcı düşünce", "anlatım biçimleri", "açıklayıcı", "tartışmacı", "betimleyici", "öyküleyici", "düşünceyi geliştirme yolları", "açıklık", "duruluk", "akıcılık"],
    iliski: [
      { k: "u02k09", tur: "onkosul", neden: "Paragraf, anlamına göre cümlelerin birleşmesinden kurulur." },
      { k: "u02k04", tur: "ayni-beceri", neden: "Şiirde imge/çağrışım çözümleme ile paragrafta anlam aynı okuma becerisini kullanır." },
      { k: "u04k05", tur: "icerik", neden: "Noktalama paragrafın anlam sınırlarını belirler." },
      { k: "u04k04", tur: "icerik", neden: "Yazım kuralları paragrafın biçimsel doğruluğunu sağlar." }
    ]
  }
];

/* ------------------------------------------------------------
   PDF metninden madde çıkarma
   Başlık, madde imi (•, *, », ―, -) ve numaralı satırlar alınır;
   satır ortasında kalan cümleler bir sonraki satırla birleştirilir.
   ------------------------------------------------------------ */
const BASLIK_GURULTU = /Mustafa ÇİFTÇİ|TÜRK DİLİ VE EDEBİYATI ÖĞRETMENİ|^\d{1,3}$/i;

function sayfalariAyir(metin) {
  const p = {};
  const parca = metin.split(/--\s*(\d+)\s*of\s*\d+\s*--/);
  for (let i = 1; i < parca.length; i += 2) p[Number(parca[i])] = parca[i + 1] || "";
  return p;
}

/* PDF'in font eşlemesi ş/Ş harflerini yer yer ters yazıyor:
     "kiŞilerin baŞından" → "kişilerin başından"
     "şİİRİ"             → "ŞİİRİ"
   Kural: sözcük başında değilse Ş → ş; sözcük başındaki ş + büyük harf → Ş. */
function turkceDuzelt(s) {
  return String(s)
    .split(/\s+/)
    .map((w) => {
      if (!w) return w;
      let x = w.replace(/(?<=.)Ş/g, "ş");
      if (/^ş[İIÇĞÖÜA-Z]/.test(x)) x = "Ş" + x.slice(1);
      // "SÖYLEYİş", "ŞİİRİ" gibi büyük yazılmış sözcüklerde kalan küçük ş
      if (/[A-ZÇĞİÖÜ]{2}ş/.test(x)) x = x.replace(/ş/g, "Ş");
      return x;
    })
    .join(" ");
}

function temizle(s) {
  const t = String(s)
    .replace(/\u00ad/g, "")
    .replace(/\s+/g, " ")
    .replace(/^[•*»―\-–]\s*/, "")
    .replace(/^\d+[.)]\s*/, "")
    .replace(/\s+([,.;:])/g, "$1")
    .trim();
  return turkceDuzelt(t);
}

/* Madde sayısı az olan bölümlerde (masal, ünlem, fabl gibi paragraf
   hâlinde yazılmış konular) cümle tabanlı çıkarım devreye girer. */
function cumleler(pages, araliklar) {
  const metin = [];
  for (const [a, b] of araliklar) {
    for (let n = a; n <= b; n++) {
      String(pages[n] || "")
        .split("\n")
        .map((x) => x.replace(/\s+/g, " ").trim())
        .filter((x) => x && !BASLIK_GURULTU.test(x))
        .forEach((x) => metin.push(x));
    }
  }
  const birlesik = metin.join(" ").replace(/\s+/g, " ");
  return birlesik
    .split(/(?<=[.!?])\s+/)
    .map((x) => temizle(x))
    .filter((x) => x.length >= 40 && x.length <= 300)
    .filter((x) => /[a-zçğıöşü]/.test(x.slice(0, 40)));
}

function maddeler(pages, araliklar) {
  const out = [];
  for (const [a, b] of araliklar) {
    for (let n = a; n <= b; n++) {
      const satirlar = String(pages[n] || "")
        .split("\n")
        .map((x) => x.replace(/\s+/g, " ").trim())
        .filter((x) => x && !BASLIK_GURULTU.test(x));
      for (const l of satirlar) {
        const yeniMadde = /^[•*»―\-–]\s+/.test(l) || /^\d+[.)]\s+/.test(l);
        if (yeniMadde) {
          out.push(temizle(l));
        } else if (out.length) {
          const son = out[out.length - 1];
          // Yarım kalan cümleyi tamamla (nokta/iki nokta ile bitmiyorsa)
          if (!/[.:;!?]$/.test(son) && son.length < 220 && !/^[A-ZÇĞİÖŞÜ]{4,}$/.test(l)) {
            out[out.length - 1] = temizle(son + " " + l);
          }
        }
      }
    }
  }
  // Kısa/başlık artıklarını at, tekrarları kaldır
  const gorulen = new Set();
  const maddelerTemiz = out
    .filter((x) => x.length >= 25 && x.length <= 400)
    .filter((x) => !/^[A-ZÇĞİÖŞÜ\s]+$/.test(x))
    .filter((x) => !/^\d*\.?\s*TEMA\s*\(/i.test(x))
    .filter((x) => {
      const k = x.toLocaleLowerCase("tr-TR");
      if (gorulen.has(k)) return false;
      gorulen.add(k);
      return true;
    });

  /* Madde azsa (paragraf hâlinde yazılmış konu) cümle tabanlı çıkarımla
     tamamla. Böylece masal/ünlem/fabl gibi bölümler boş kalmıyor. */
  if (maddelerTemiz.length >= 24) return maddelerTemiz;
  const ek = cumleler(pages, araliklar).filter((c) => {
    const k = c.toLocaleLowerCase("tr-TR");
    if (gorulen.has(k)) return false;
    gorulen.add(k);
    return true;
  });
  return maddelerTemiz.concat(ek);
}

function iliskiCoz(kisa) {
  const m = /^u(\d{2})k(\d{2})$/.exec(kisa);
  return m ? "edebiyat_10_u" + m[1] + "_k" + m[2] : kisa;
}

function uret(metinYolu) {
  const d = JSON.parse(fs.readFileSync(DOSYA, "utf8"));
  const adlar = Object.fromEntries(d.konular.map((k) => [k.konu_id, k.konu]));
  const pages = metinYolu && fs.existsSync(metinYolu)
    ? sayfalariAyir(fs.readFileSync(metinYolu, "utf8").replace(/Ġ/g, "İ").replace(/ġ/g, "ş").replace(/Ģ/g, "Ş"))
    : null;

  let maddeSayisi = 0;
  for (const k of d.konular) {
    const t = KONU.find((x) => x.id === k.konu_id);
    if (!t) continue;
    const icerik = pages ? maddeler(pages, t.pdf) : [];
    k.pdf_sayfa = t.pdf.map(([a, b]) => (a === b ? String(a) : a + "-" + b));
    k.bolum = t.bolum;
    k.anahtar_kavramlar = t.kavram;
    k.icerik = {
      kaynak: pages ? "ders-notu" : "iliski-tablosu",
      madde: icerik.length,
      ozellikler: icerik
    };
    k.iliskili_konular = (t.iliski || []).map((x) => ({
      konu_id: iliskiCoz(x.k),
      konu: adlar[iliskiCoz(x.k)] || iliskiCoz(x.k),
      tur: x.tur,
      neden: x.neden
    }));
    if (t.not) k.not_ = t.not;
    maddeSayisi += icerik.length;
  }

  d.kaynak_pdf = {
    dosya: "10 Edebiyat Ders notları Yeni Müfredat.pdf",
    sayfa: 149,
    hazirlayan: "Mustafa Çiftçi",
    yil: 2026,
    tema_sayisi: 4,
    aciklama:
      "10. sınıf TDE ders notu (yeni müfredat). Konu → tema, sayfa aralığı, " +
      "anahtar kavram ve ilişkili konu bilgisi bu dosyadan çıkarıldı. " +
      "Maddeler metinden birebir alınır; ilişkiler müfredat ağacına göre kurulur."
  };
  d.iliski_ozet = {
    konu: d.konular.filter((k) => k.iliskili_konular && k.iliskili_konular.length).length,
    iliski: d.konular.reduce((n, k) => n + ((k.iliskili_konular || []).length), 0),
    pdf_sayfasi_olan: d.konular.filter((k) => (k.pdf_sayfa || []).length).length,
    madde: maddeSayisi,
    tur: [...new Set(d.konular.flatMap((k) => (k.iliskili_konular || []).map((x) => x.tur)))]
  };

  fs.writeFileSync(DOSYA, JSON.stringify(d, null, 1));
  fs.writeFileSync(VERI_MODUL, modulUret(d));
  fs.writeFileSync(RAPOR, raporUret(d));
  return d;
}

/* ------------------------------------------------------------
   TARAYICI VERİ MODÜLÜ (site/okz-tde-veri.js)
   ------------------------------------------------------------
   Uygulama 208 KB'lik kazanım dosyasını indirmesin diye yalnız
   eşleştirmede kullanılan alanlar ayrı bir modüle yazılır:
     konular[] : konu adı + konu_id + ayırt edici kavramlar (3. aşama vektör)
     sozluk{}  : terim → konu (1. aşama)
     genel     : genel beceri kuralları (2. aşama)
     iliski{}  : konu → ilişkili konular (uygulamada "neyle ilişkili" paneli)
   ------------------------------------------------------------ */
function modulUret(d) {
  const veri = {
    surum: "2026-10-27",
    ders: d.ders,
    sinif: d.sinif,
    kaynak: "tde_kazanim_10.json (PDF: " + d.kaynak_pdf.dosya + ")",
    konular: d.konular.map((k) => ({
      konu_id: k.konu_id,
      konu: k.konu,
      tema: k.tema,
      tema_ad: k.tema_ad,
      bolum: k.bolum || "",
      kavram: k.anahtar_kavramlar || []
    })),
    sozluk: d.sozluk,
    genel: {
      hedef_konu: d.genel_beceri.hedef_konu,
      aciklama: d.genel_beceri.aciklama,
      kurallar: d.genel_beceri.kurallar.map((r) => ({
        ad: r.ad, hedef: r.hedef, ornekler: r.ornekler, gerekce: r.gerekce
      }))
    },
    iliski: Object.fromEntries(d.konular.map((k) => [k.konu, k.iliskili_konular.map((x) => ({
      konu: x.konu, tur: x.tur, neden: x.neden
    }))])),
    ozet: d.iliski_ozet
  };
  return [
    "/* ============================================================",
    "   TDE EŞLEME VERİSİ (site/okz-tde-veri.js)",
    "   ------------------------------------------------------------",
    "   OTOMATİK ÜRETİLDİ — ELLE DÜZENLEMEYİN.",
    "   Üretici : scripts/tde-icerik-uret.js",
    "   Kaynak  : site/content/mufredat/tde_kazanim_10.json",
    "             (" + d.kaynak_pdf.dosya + ", " + d.kaynak_pdf.sayfa + " sayfa)",
    "   İçerik  : 30 konu · " + Object.keys(d.sozluk).length + " terim sözlüğü · " +
      d.genel_beceri.kurallar.length + " genel beceri kuralı · " + d.iliski_ozet.iliski + " ilişki",
    "   Kullanan: site/okz-tde.js (1./2./3. aşama eşleştirme motoru)",
    "   ============================================================ */",
    "(function (kok) {",
    "  \"use strict\";",
    "  var VERI = " + JSON.stringify(veri) + ";",
    "  if (typeof module !== \"undefined\" && module.exports) module.exports = VERI;",
    "  kok.OKZTDE_VERI = VERI;",
    "})(typeof globalThis !== \"undefined\" ? globalThis : this);",
    ""
  ].join("\n");
}

if (require.main === module) {
  const yol = process.argv[2] || "/tmp/tde-temiz.txt";
  const d = uret(yol);
  console.log("\n== TDE MÜFREDAT İLİŞKİLERİ ==");
  console.log("PDF:", d.kaynak_pdf.dosya, "·", d.kaynak_pdf.sayfa, "sayfa");
  console.log("konu:", d.konular.length, "· ilişki:", d.iliski_ozet.iliski, "· madde:", d.iliski_ozet.madde);
  console.log("ilişki türleri:", d.iliski_ozet.tur.join(", "));
  console.log("\n" + d.konular.map((k) =>
    "T" + k.tema + " " + String(k.konu).padEnd(42) +
    String((k.pdf_sayfa || []).join(",") || "ek").padEnd(8) +
    "madde:" + String(k.icerik.madde).padEnd(4) +
    "ilişki:" + k.iliskili_konular.length
  ).join("\n"));
}

/* ------------------------------------------------------------
   İNSAN İÇİN RAPOR (docs/uretim/TDE-MUFREDAT-ILISKILERI.md)
   ------------------------------------------------------------ */
function raporUret(d) {
  const TUR = {
    "ayni-donem": "Aynı dönem", "devam": "Devamı", "koken": "Kökü",
    "onkosul": "Ön koşul", "karistirilir": "Karıştırılır", "karsit": "Karşıtı",
    "ayni-gelenek": "Aynı gelenek", "ayni-grup": "Aynı grup", "icerik": "İçerik bağı",
    "donem": "Dönem", "ayni-beceri": "Aynı beceri"
  };
  const L = [];
  L.push("# 10. Sınıf TDE — Müfredat İlişkileri ve 3 Aşamalı Kazanım Eşleştirme");
  L.push("");
  L.push("**Kaynak:** `" + d.kaynak_pdf.dosya + "` (" + d.kaynak_pdf.hazirlayan + ", " +
    d.kaynak_pdf.sayfa + " sayfa, " + d.kaynak_pdf.yil + ") + TYMM/ODSGM müfredat ağacı");
  L.push("");
  L.push("Bu dosya `scripts/tde-icerik-uret.js` tarafından **otomatik** üretilir — elle düzenlemeyin.");
  L.push("");
  L.push("| Ölçü | Değer |");
  L.push("|---|---|");
  L.push("| Konu | " + d.iliski_ozet.konu + " |");
  L.push("| İlişki | " + d.iliski_ozet.iliski + " |");
  L.push("| PDF'ten çıkarılan madde | " + d.iliski_ozet.madde + " |");
  L.push("| Sayfa aralığı olan konu | " + d.iliski_ozet.pdf_sayfasi_olan + " / 30 |");
  L.push("| Sözlük terimi (1. aşama) | " + Object.keys(d.sozluk).length + " |");
  L.push("| Genel beceri kuralı (2. aşama) | " + d.genel_beceri.kurallar.length + " |");
  L.push("");
  L.push("## Konu haritası");
  L.push("");
  L.push("| # | Tema | Konu | PDF sayfası | Madde | Kavram | İlişki |");
  L.push("|---|---|---|---|---|---|---|");
  d.konular.forEach((k, i) => {
    L.push("| " + (i + 1) + " | " + k.tema + " · " + k.tema_ad + " | " + k.konu + " | " +
      ((k.pdf_sayfa || []).join(", ") || "Ek (bu kopyada yok)") + " | " + k.icerik.madde + " | " +
      (k.anahtar_kavramlar || []).length + " | " + k.iliskili_konular.length + " |");
  });
  L.push("");
  L.push("## İlişki haritası");
  d.konular.forEach((k) => {
    L.push("");
    L.push("### " + k.konu);
    L.push("");
    if (!k.iliskili_konular.length) { L.push("_İlişki tanımlı değil._"); return; }
    k.iliskili_konular.forEach((r) => {
      L.push("- **" + r.konu + "** · _" + (TUR[r.tur] || r.tur) + "_ — " + r.neden);
    });
  });
  L.push("");
  L.push("## 3 aşamalı eşleştirme (Okulizyon serbest metni)");
  L.push("");
  L.push("| Aşama | Ne yapar | Kaynak etiketi | Nereye yazar |");
  L.push("|---|---|---|---|");
  L.push("| 1 | Konu adı / anahtar kelime sözlüğü (Türkçe ek tanıma) | `kural` | `kazanim_konu_cache` |");
  L.push("| 2 | Genel beceri → **Paragraf** (çıkarım, ana düşünce, söz varlığı, anlatım) | `genel` | `kazanim_konu_cache` |");
  L.push("| 3 | Vektör benzerliği (TF-IDF kapsam, eşikli) | `vektor` | `kazanim_konu_cache` |");
  L.push("");
  L.push("Hiçbir aşama tutmazsa **konu yazılmaz** (uydurma eşleşme yok). Çözülen cümle");
  L.push("`kazanim_konu_cache` tablosuna yazılır; aynı cümle ikinci kez geldiğinde hiçbir");
  L.push("aşama çalışmadan cevap buradan gelir.");
  L.push("");
  L.push("## Genel beceri kuralları (2. aşama)");
  L.push("");
  d.genel_beceri.kurallar.forEach((r) => {
    L.push("- **" + r.ad + "** → " + r.hedef + " — " + r.gerekce);
  });
  L.push("");
  return L.join("\n");
}

module.exports = { uret, modulUret, raporUret, KONU };
