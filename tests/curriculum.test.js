const assert = require("assert");
const { KONULAR } = require("../konular.js");

const tde = KONULAR["10"]["Türk Dili ve Edebiyatı"];
const philosophy = KONULAR["10"].Felsefe;

assert.strictEqual(tde.length, 29, "10. sınıf TDE 29 konu içermeli");
assert.deepStrictEqual(tde, [
  "Koşuk", "Sav", "Türkü", "Koşma", "Masal", "İsimler (Adlar)",
  "İsim Tamlamaları", "Sıfatlar (Ön Adlar)", "Sıfat Tamlamaları", "Gazel",
  "Kaside", "Mersiye", "Saf Şiir", "Zamir (Adıl)", "Edat (İlgeç)",
  "Bağlaç", "Ünlem", "Anlamına Göre Cümleler", "Destan", "Mesnevi",
  "Halk Hikâyesi", "Fabl", "Zarflar (Belirteçler)", "Dede Korkut Hikâyeleri",
  "Tanzimat Dönemi Şiiri", "Fiiller (Eylemler)", "Yazım Kuralları",
  "Noktalama İşaretleri", "Paragraf"
]);
assert.strictEqual(philosophy.length, 23, "10. sınıf Felsefe 23 konu içermeli");
assert.strictEqual(philosophy[0], "1.1 Felsefenin Anlamı");
assert(philosophy.some(topic => topic.startsWith("9.2 Bilim Felsefesinin Temel Problemleri")));
console.log("curriculum: 10. sınıf TDE ve Felsefe kontrolleri başarılı");
