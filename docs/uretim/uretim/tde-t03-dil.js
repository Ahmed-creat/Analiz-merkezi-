#!/usr/bin/env node
/* ============================================================
   TDE · 3. TEMA — DİL BİLGİSİ konu havuzları
   ------------------------------------------------------------
   Kaynak: 10. sınıf TDE ders notları (Mustafa Çiftçi)
     edebiyat_10_u03_k05  Zarflar (Belirteçler)   s.123-129
     edebiyat_10_u03_k06  Şiirde Ahenk         s.24-33
   Kullanım: node docs/uretim/uretim/tde-t03-dil.js
   ============================================================ */
"use strict";

const { yazKonu } = require("../yazicilar/yaz.js");

const DERS = "Türk Dili ve Edebiyatı";
const DOSYA = "10.Edebiyat.Ders.notlari.Yeni.Mufredat.pdf";
const TEMA = 3;
const TEMA_ADI = "Dünden Bugüne";

function kaynak(s) {
  return "10. sınıf TDE ders notları (Mustafa Çiftçi), s." + s;
}

/* ---------------- 5) ZARFLAR (BELİRTEÇ) ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u03_k05",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Zarflar (Belirteçler)",
  kazanim:
    "Zarfları tür, işlev ve yapı bakımından çözümleyebilme.",
  kaynak: kaynak("123-129"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Zarfları türlerine göre sınıflandırır.",
    "Zarfı sıfat ve edat gibi benzer türlerden ayırt eder.",
    "Zarfları yapı bakımından çözümler."
  ],
  items: [
    {
      bi: 0,
      metin:
        "\"Arkadaşım İngilizceyi hızlı öğrendi.\" cümlesinde \"hızlı\" sözcüğü eylemin nasıl gerçekleştiğini belirtmiştir. Bu sözcük hangi görevdedir?",
      secenekler: ["Zarf", "Sıfat", "Edat", "Zamir"],
      cozum:
        "Fiilleri, fiilimsileri, sıfatları ya da kendi türünden sözcükleri değişik yönlerden belirten sözcükler zarftır; \"nasıl öğrendi?\" sorusunun cevabı niteleme zarfıdır.",
      fc: [
        "Zarf nedir?",
        "Fiil, fiilimsi, sıfat ya da zarfların anlamını belirten sözcüktür."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Güzel bakan güzel görür.\" cümlesinde \"güzel\" sözcüğü eylemin nasıl yapıldığını bildirirken, \"Güzel günler göreceğiz çocuklar.\" cümlesinde bir adı nitelemektedir. İlk cümledeki görev hangisidir?",
      secenekler: ["Niteleme zarfı", "Sıfat görevi", "Edat görevi", "İsim görevi"],
      cozum:
        "Fiile sorulan \"nasıl\" sorusunun cevabı niteleme zarfıdır; isme sorulan \"nasıl\" sorusunun cevabı ise sıfattır.",
      fc: [
        "Niteleme zarfı nedir?",
        "Fiile sorulan \"nasıl\" sorusunun cevabı olan zarftır: hızlı öğrendi, güzel bakan."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir öğrenci \"Kendimi henüz sınav için hazır hissetmiyorum.\" cümlesindeki \"henüz\" sözcüğünü incelemiştir. Bu sözcük eylemi hangi bakımdan sınırlandırmıştır?",
      secenekler: ["Zaman", "Miktar", "Yer", "Durum"],
      cozum:
        "Eylem ve eylemsileri zaman bakımından sınırlayan zarflar zaman zarfıdır; \"henüz, yarın, dün, şimdi\" gibi sözcükler zaman zarfıdır.",
      fc: [
        "Zaman zarfı nedir?",
        "Eylem ve eylemsileri zaman bakımından sınırlayan zarftır: yarın, dün, henüz, şimdi."
      ]
    },
    {
      bi: 1,
      metin:
        "Zaman bildiren bazı sözcükler \"-in\" eki alarak zarf görevi kazanır: yazın, kışın, güzün. \"Yazın yaylaya çıkarız.\" cümlesinde bu ek hangi görevi üstlenmiştir?",
      secenekler: [
        "Zaman zarfı yapmıştır",
        "Sıfat yapmıştır",
        "İsim tamlaması kurmuştur",
        "Edat grubu oluşturmuştur"
      ],
      cozum:
        "\"-in\" eki zaman isimlerine gelerek zaman zarfı yapar: yazın, kışın, ilkin, güzün.",
      fc: [
        "\"-in\" ekinin zarf yapma görevi nedir?",
        "Zaman isimlerine gelerek zaman zarfı yapar: yazın, kışın, güzün."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Başarılı olabilmek için çok çalışmalıyım.\" cümlesinde \"çok\" sözcüğü eylemin derecesini belirtir ve \"ne kadar\" sorusuna cevap verir. Bu sözcük hangi zarftır?",
      secenekler: ["Miktar zarfı", "Zaman zarfı", "Durum zarfı", "Soru zarfı"],
      cozum:
        "Eylemleri, sıfatları ya da zarfları azlık-çokluk bakımından sınırlayan zarflar miktar zarfıdır; çok, pek, en, daha, biraz, fazla gibi.",
      fc: [
        "Miktar zarfı nedir?",
        "Eylem, sıfat ya da zarfları azlık-çokluk bakımından belirleyen zarftır: çok, pek, en, daha."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Bana neden soğuk davranıyorsun?\" cümlesinde \"neden\" sözcüğü eylemi soru yoluyla belirtmiştir. Bu sözcüğün görevi hangisidir?",
      secenekler: ["Soru zarfı", "Soru zamiri", "Soru sıfatı", "Miktar zarfı"],
      cozum:
        "Eylem ve eylemsileri soru yoluyla belirten zarflar soru zarfıdır: nasıl, niçin, neden, ne zaman, ne kadar.",
      fc: [
        "Soru zarfı nedir?",
        "Eylem ve eylemsileri soru yoluyla belirten zarftır: nasıl, niçin, ne zaman."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Elbet bir gün buluşacağız.\" ve \"Seni asla unutmayacağım.\" cümlelerinde kullanılan sözcükler eylemin gerçekleşeceğine dair kesinlik bildirir. Bu sözcükler hangi zarf türüdür?",
      secenekler: ["Kesinlik zarfı", "Dilek zarfı", "Yineleme zarfı", "Sınırlama zarfı"],
      cozum:
        "Elbet, elbette, asla, şüphesiz, mutlaka gibi sözcükler kesinlik zarfıdır.",
      fc: [
        "Kesinlik zarfı nedir?",
        "Eylemin kesin olarak gerçekleşeceğini bildiren zarftır: elbet, asla, mutlaka."
      ]
    },
    {
      bi: 1,
      metin:
        "\"Askerler teker teker nöbet yerlerine dağıldılar.\" cümlesinde eylem dağılım bildiren bir sözcükle belirtilmiştir. Bu sözcük hangi zarf türüdür?",
      secenekler: ["Üleştirme zarfı", "Miktar zarfı", "Yineleme zarfı", "Durum zarfı"],
      cozum:
        "\"Beşer beşer, ikişer ikişer, teker teker\" gibi dağılım bildiren sözcükler üleştirme zarfıdır.",
      fc: [
        "Üleştirme zarfı nedir?",
        "Eylemin dağılımını bildiren zarftır: beşer beşer, ikişer ikişer, teker teker."
      ]
    },
    {
      bi: 2,
      metin:
        "Zarflar yapı bakımından basit, türemiş, birleşik ve öbekleşmiş olarak ayrılır. \"Akşama doğru, ikide bir, arada sırada\" gibi zarflar hangi yapıdadır?",
      secenekler: ["Öbekleşmiş zarf", "Birleşik zarf", "Türemiş zarf", "Basit zarf"],
      cozum:
        "Birden fazla kelimenin ikileme, edat grubu ya da zarf-fiil grubu yoluyla bir araya gelmesiyle oluşan zarflar öbekleşmiştir; \"bugün, biraz, birdenbire\" ise birleşiktir.",
      fc: [
        "Öbekleşmiş zarf nedir?",
        "Birden fazla kelimenin öbekleşmesiyle oluşan zarftır: akşama doğru, ikide bir."
      ]
    },
    {
      bi: 2,
      metin:
        "\"Keşke bu günleri o da görebilseydi.\" ve \"Umarım güzel bir haber alırsın.\" cümlelerinde kullanılan sözcükler bir dileği anlatır. Bu sözcükler hangi zarf türüdür?",
      secenekler: ["Dilek zarfı", "Kesinlik zarfı", "Varsayım zarfı", "Yanıt zarfı"],
      cozum:
        "Keşke, inşallah, umarım, yeter ki, bari gibi sözcükler dilek ve beklenti zarfıdır; varsayım zarfı ise \"diyelim ki, tut ki\" ile kurulur.",
      fc: [
        "Dilek zarfı nedir?",
        "Bir dilek ya da beklenti anlatan zarftır: keşke, inşallah, umarım."
      ]
    }
  ]
});

/* ---------------- 6) ŞİİRDE AHENK ---------------- */
yazKonu({
  konu_id: "edebiyat_10_u03_k06",
  ders: DERS,
  tema: TEMA,
  tema_adi: TEMA_ADI,
  baslik: "Şiirde Ahenk (Ölçü, Uyak, Redif, Aliterasyon, Asonans)",
  kazanim:
    "Şiirde ahengi sağlayan ögeleri (ölçü, uyak, redif, aliterasyon, asonans) çözümleyebilme.",
  kaynak: kaynak("24-33"),
  kaynak_dosya: DOSYA,
  beceriler: [
    "Ahengi sağlayan ses ögelerini (aliterasyon, asonans, vurgu) belirler.",
    "Hece, aruz ve serbest ölçünün kurallarını ayırt eder.",
    "Uyak türlerini ve kafiye şemalarını çözümler."
  ],
  items: [
    {
      bi: 0,
      metin:
        "Bir şiirde sözcüklerin sıralanışından ve birbirleriyle ilişkisinden doğan, kulağa hoş gelen ses düzenine ne ad verilir?",
      secenekler: ["Ahenk", "İmge", "Tema", "Ölçü"],
      cozum:
        "Ahenk, edebî metinlerde kelimelerin sıralanışından veya birbirleriyle ilişkisinden doğan ve kulağa hoş gelen ses düzenidir; uyum anlamına gelir.",
      fc: [
        "Ahenk nedir?",
        "Sözcüklerin sıralanışından doğan, kulağa hoş gelen ses düzenidir."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Eylülde melül olduğu gönül soldu da lale\" dizesinde \"l\" sesi art arda yinelenerek ses uyumu sağlanmıştır. Bu uyum hangi kavramla adlandırılır?",
      secenekler: ["Aliterasyon", "Asonans", "Redif", "Durak"],
      cozum:
        "Dizelerde ünsüz seslerin art arda tekrar edilmesiyle elde edilen uyum aliterasyondur; ünlülerin tekrarı ise asonanstır.",
      fc: [
        "Aliterasyon nedir?",
        "Dizelerde ünsüz seslerin art arda tekrar edilmesiyle sağlanan uyumdur."
      ]
    },
    {
      bi: 0,
      metin:
        "\"Neysen sen, nefes sen, neylersin neyi\" dizesinde \"e\" ünlüsü belirgin biçimde yinelenmiştir. Bu ses uyumu hangisidir?",
      secenekler: ["Asonans", "Aliterasyon", "Cinas", "Nakarat"],
      cozum:
        "Ünlü seslerin art arda tekrar edilmesiyle elde edilen uyum asonanstır; ünsüz tekrarı aliterasyondur.",
      fc: [
        "Asonans nedir?",
        "Dizelerde ünlü seslerin art arda tekrar edilmesiyle sağlanan uyumdur."
      ]
    },
    {
      bi: 1,
      metin:
        "Bir şiirin dizelerindeki hece sayıları eşitlenerek ölçü kurulmuştur; her ünlü bir hece sayılmıştır. Bu ölçü hangisidir?",
      secenekler: ["Hece ölçüsü", "Aruz ölçüsü", "Serbest ölçü", "Durak ölçüsü"],
      cozum:
        "Dizelerdeki hece sayılarının eşit olması kuralına dayanan ölçü hece ölçüsüdür; millî ölçümüz kabul edilir ve daha çok 7'li, 8'li, 11'li kalıplar kullanılır.",
      fc: [
        "Hece ölçüsü nedir?",
        "Dizelerdeki hece sayılarının eşit olmasına dayanan, millî sayılan ölçüdür."
      ]
    },
    {
      bi: 1,
      metin:
        "Hece ölçüsüyle yazılan şiirlerde dizeler 4+4, 6+5 gibi bölümlere ayrılarak ahenk artırılır ve bu bölümlerde sözcükler ortasından bölünmez. Bu ayrım yerlerine ne ad verilir?",
      secenekler: ["Durak", "Redif", "Nakarat", "Kalıp"],
      cozum:
        "Dizelerin ahengi artırmak için ayrıldığı yerlere durak denir; duraklarda kelimeler ortalarından bölünemez.",
      fc: [
        "Durak nedir?",
        "Hece ölçüsünde dizelerin ahenk için ayrıldığı yerlerdir; kelime ortadan bölünmez."
      ]
    },
    {
      bi: 1,
      metin:
        "Hecelerin kısalık ve uzunluğuna göre düzenlenmiş kalıplarla yazılan, İslamiyet'in kabulünden sonra divan şiirinde daima kullanılan ölçü hangisidir?",
      secenekler: ["Aruz ölçüsü", "Hece ölçüsü", "Serbest ölçü", "Durak ölçüsü"],
      cozum:
        "Hecelerin açık-kapalı değerlerine dayanan ve Arap edebiyatından geçen ölçü aruz ölçüsüdür; ilk kullanıldığı eser Kutadgu Bilig'dir.",
      fc: [
        "Aruz ölçüsü nedir?",
        "Hecelerin kısalık-uzunluğuna göre düzenlenmiş kalıplarla kurulan ölçüdür."
      ]
    },
    {
      bi: 2,
      metin:
        "1940'lardan sonra Orhan Veli Kanık ve Garip Akımı ile yaygınlaşan, hecelerin sayısına ve açık-kapalı olmasına bakılmayan ölçü hangisidir?",
      secenekler: ["Serbest ölçü", "Hece ölçüsü", "Aruz ölçüsü", "Durak ölçüsü"],
      cozum:
        "Herhangi bir ölçüye bağlı kalınmayan serbest ölçü, 1940'lardan sonra Orhan Veli ve Garip Akımı ile yaygınlaşmıştır; ahengi söyleyiş ve sözcük seçimi sağlar.",
      fc: [
        "Serbest ölçü nedir?",
        "Hece ve aruz gibi bir ölçüye bağlı kalınmayan, şairin kendi üslubuna dayanan ölçüdür."
      ]
    },
    {
      bi: 2,
      metin:
        "Mısra sonlarında yazılışları, okunuşları, anlamları ve görevleri aynı olan ek, kelime ya da kelime gruplarının tekrarlanmasına ne ad verilir?",
      secenekler: ["Redif", "Uyak", "Nakarat", "Durak"],
      cozum:
        "Mısra sonlarında yazılış, okunuş, anlam ve görev bakımından aynı olan eklerin ve kelimelerin tekrarlanması rediftir; yalnızca ses benzerliği ise uyaktır.",
      fc: [
        "Redif nedir?",
        "Mısra sonlarında yazılışı, okunuşu, anlamı ve görevi aynı olan ek ve kelimelerin tekrarıdır."
      ]
    },
    {
      bi: 2,
      metin:
        "Bir dörtlükte ses benzeşmesi üçten fazladır ve sözcüklerden biri genellikle diğerini içine almaktadır (\u201cAnkara – kara\u201d). Bu uyak türü hangisidir?",
      secenekler: ["Tunç kafiye", "Yarım kafiye", "Tam kafiye", "Cinaslı kafiye"],
      cozum:
        "Üç ya da daha çok ses benzerliğine dayanan uyak zengin kafiyedir; kelimelerden biri diğerini içine alıyorsa buna tunç kafiye denir. Tek ses yarım, iki ses tam kafiyedir.",
      fc: [
        "Tunç kafiye nedir?",
        "Ses benzeşmesi üçten fazla olan ve kelimelerden birinin diğerini içine aldığı zengin kafiyedir."
      ]
    },
    {
      bi: 0,
      metin:
        "Bir dörtlükte dizelerin son sesleri incelendiğinde \"a b b a\" düzeni görülmüştür. Bu kafiye şeması hangisidir?",
      secenekler: ["Sarmal kafiye", "Düz kafiye", "Çapraz kafiye", "Mani tipi kafiye"],
      cozum:
        "\"a b b a\" sarmal, \"a b a b\" çapraz, \"a a b b\" düz, \"a a b a\" mani tipi kafiye şemasıdır.",
      fc: [
        "Kafiye şeması nedir?",
        "Mısra son seslerine göre çıkarılan düzendir: düz aabb, çapraz abab, sarmal abba."
      ]
    }
  ]
});
