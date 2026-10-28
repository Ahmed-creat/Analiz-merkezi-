const assert = require("assert");
const { KONULAR } = require("../konular.js");

const tde = KONULAR["10"]["Türk Dili ve Edebiyatı"];
const philosophy = KONULAR["10"].Felsefe;

assert.strictEqual(tde.length, 30, "10. sınıf TDE 30 konu içermeli");
assert.deepStrictEqual(tde, [
  "Koşuk", "Sav", "Türkü", "Koşma", "Masal", "İsimler (Adlar)",
  "İsim Tamlamaları", "Sıfatlar (Ön Adlar)", "Sıfat Tamlamaları", "Gazel",
  "Kaside", "Mersiye", "Saf Şiir",
  "Şiirde Ahenk (Ölçü, Uyak, Redif, Aliterasyon, Asonans)", "Zamir (Adıl)", "Edat (İlgeç)",
  "Bağlaç", "Ünlem", "Anlamına Göre Cümleler", "Destan", "Mesnevi",
  "Halk Hikâyesi", "Fabl", "Zarflar (Belirteçler)", "Dede Korkut Hikâyeleri",
  "Tanzimat Dönemi Şiiri", "Fiiller (Eylemler)", "Yazım Kuralları",
  "Noktalama İşaretleri", "Paragraf"
]);
assert.strictEqual(philosophy.length, 23, "10. sınıf Felsefe 23 konu içermeli");
assert.strictEqual(philosophy[0], "1.1 Felsefenin Anlamı");
// Ahenk ve paragraf her iki sınıfta da olmalı (Türkçe/TDE müfredatı)
["9", "10"].forEach(g => {
  const list = KONULAR[g]["Türk Dili ve Edebiyatı"];
  assert(list.some(t => t.startsWith("Şiirde Ahenk")), g + ". sınıf TDE'de 'Şiirde Ahenk' olmalı");
  assert(list.includes("Paragraf"), g + ". sınıf TDE'de 'Paragraf' olmalı");
});
assert(philosophy.some(topic => topic.startsWith("9.2 Bilim Felsefesinin Temel Problemleri")));
console.log("curriculum: 10. sınıf TDE ve Felsefe kontrolleri başarılı");
