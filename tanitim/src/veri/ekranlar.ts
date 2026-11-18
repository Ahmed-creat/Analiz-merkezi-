// Gerçek arayüz yakalamaları (tanitim/public/ekran) + yakalama kaydındaki
// CSS piksel koordinatları (1920×1080 taban, görüntüler 2× ölçekli).

export type Ekran = {
  dosya: string;
  ad: string;
};

export const EKRANLAR: Record<string, Ekran> = {
  anaSayfa: {dosya: 'ekran/01-ana-sayfa.png', ad: 'Ana Sayfa (ilk açılış)'},
  bilgiBankasi: {dosya: 'ekran/02-bilgi-bankasi.png', ad: 'Bilgi Bankası — müfredat ağacı'},
  agacAcik: {dosya: 'ekran/03-agac-acik.png', ad: 'Bilgi Bankası — Biyoloji açık'},
  konuPanel: {dosya: 'ekran/04-konu-panel.png', ad: 'Konu paneli — çalışma yol haritası'},
  dortAdim: {dosya: 'ekran/05-dort-adim.png', ad: 'Dört adım tamam, beşinci adım bekliyor'},
  kisaKontrol: {dosya: 'ekran/06-kisa-kontrol-soru.png', ad: 'Kısa Kontrol — gerçek soru'},
  nedenSec: {dosya: 'ekran/07-neden-sec.png', ad: 'Sonuç — yanlışın nedeni seçilir'},
  nedenSecildi: {dosya: 'ekran/08-neden-secildi.png', ad: 'Neden seçildi'},
  sonuc: {dosya: 'ekran/09-sonuc.png', ad: 'Kısa Kontrol sonucu'},
  adimBitti: {dosya: 'ekran/10-adim5-bitti.png', ad: 'Beş adım bitti'},
  konuTamam: {dosya: 'ekran/11-konu-tamamlandi.png', ad: 'Konu tamamlandı — hafıza takibinde'},
  konuTakibi: {dosya: 'ekran/12-konu-takibi.png', ad: 'Konu Takibi — hafıza gücü'},
  gorevler: {dosya: 'ekran/13-gunluk-gorevler.png', ad: 'Günlük Görevler'},
  denemelerim: {dosya: 'ekran/14-denemelerim.png', ad: 'Denemelerim'},
  denemeFormu: {dosya: 'ekran/15-deneme-formu.png', ad: 'Yeni deneme girişi'},
  soruBankasi: {dosya: 'ekran/16-soru-bankasi.png', ad: 'Soru Bankası'},
  kitaplik: {dosya: 'ekran/17-kitaplik.png', ad: 'Kitaplık'},
  planlama: {dosya: 'ekran/18-planlama.png', ad: 'Planlama'},
  anaSayfaSonra: {dosya: 'ekran/19-ana-sayfa-sonra.png', ad: 'Ana Sayfa — çalışmadan sonra'},
};

// yakalama-kaydi.json → rects (x, y, w, h; CSS px)
export const KUTULAR = {
  navAnaSayfa: {x: 14, y: 179, w: 233, h: 48},
  navGorevler: {x: 14, y: 231, w: 233, h: 48},
  navDenemeler: {x: 14, y: 283, w: 233, h: 48},
  navTakip: {x: 14, y: 335, w: 233, h: 48},
  navKitaplik: {x: 14, y: 387, w: 233, h: 48},
  navBilgi: {x: 14, y: 525, w: 233, h: 48},
  navSoruBankasi: {x: 14, y: 577, w: 233, h: 48},
  dersBiyoloji: {x: 307, y: 181, w: 294, h: 44},
  adimTamamla0: {x: 730, y: 365, w: 111, h: 36},
  adimTamamla1: {x: 730, y: 481, w: 111, h: 36},
  adimTamamla2: {x: 730, y: 597, w: 111, h: 36},
  adimTamamla3: {x: 730, y: 714, w: 111, h: 36},
  kisaKontrolBaslat: {x: 730, y: 847, w: 215, h: 36},
  konuyuTamamla: {x: 663, y: 904, w: 834, h: 48},
  takipKart: {x: 286, y: 150, w: 1232, h: 173},
  denemeFormuAc: {x: 286, y: 112, w: 174, h: 36},
};

export type Kutu = {x: number; y: number; w: number; h: number};
export const merkez = (k: Kutu) => ({x: k.x + k.w / 2, y: k.y + k.h / 2});
