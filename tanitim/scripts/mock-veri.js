// Video için gerçekçi "çalışmış öğrenci" verisi.
// UYGULAMA KODU DEĞİŞTİRİLMEZ; yalnızca uygulamanın kendi deposuna
// (localStorage: analizmerkezi_v6) şema uyumlu veri yazılır.
//
// Renk/etiketler uygulamanın kendi hesaplarından çıkar (net = d - w/4,
// hafıza gücü = üstel azalma, öncelik = hata nedeni ağırlığı).

function tohumKodu() {
  try {
    const K = 'analizmerkezi_v6';
    const gun = (o) => {
      const d = new Date();
      d.setDate(d.getDate() + o);
      return d.toISOString().slice(0, 10);
    };
    const dwb = (d, w, max) => ({d, w, e: Math.max(0, max - d - w)});
    const MAX = {TDE: 30, Tarih: 10, Coğrafya: 10, Felsefe: 5, 'Din Kültürü': 5, Matematik: 30, Fizik: 10, Kimya: 10, Biyoloji: 10};

    const dersler = (tde, tar, cog, fel, din, mat, fiz, kim, biyo) => ({
      'Türk Dili ve Edebiyatı': dwb(tde[0], tde[1], MAX.TDE),
      Tarih: dwb(tar[0], tar[1], MAX.Tarih),
      Coğrafya: dwb(cog[0], cog[1], MAX.Coğrafya),
      Felsefe: dwb(fel[0], fel[1], MAX.Felsefe),
      'Din Kültürü': dwb(din[0], din[1], MAX['Din Kültürü']),
      Matematik: dwb(mat[0], mat[1], MAX.Matematik),
      Fizik: dwb(fiz[0], fiz[1], MAX.Fizik),
      Kimya: dwb(kim[0], kim[1], MAX.Kimya),
      Biyoloji: dwb(biyo[0], biyo[1], MAX.Biyoloji),
    });

    const net = (ls) => {
      let t = 0;
      Object.values(ls).forEach((l) => {
        t += (l.d || 0) - (l.w || 0) / 4;
      });
      return Math.round(t * 100) / 100;
    };
    const toplam = (ls) => Object.values(ls).reduce((a, l) => a + l.d + l.w + l.e, 0);

    const denemeler = [
      {id: 'e1', name: 'Okulizyon: 10.SINIF MAARİF İZLEME SINAVI 1', date: gun(-28), okulizyonUrl: 'https://okulizyon.com/sinav/1',
       lessons: dersler([18, 8], [5, 3], [5, 3], [2, 2], [3, 1], [8, 12], [4, 4], [4, 4], [4, 4]), errorLogs: []},
      {id: 'e2', name: 'Deneme 2 · TYT Genel', date: gun(-21),
       lessons: dersler([20, 6], [6, 2], [6, 2], [3, 1], [3, 1], [11, 10], [5, 3], [5, 3], [5, 3]), errorLogs: []},
      {id: 'e3', name: 'Deneme 3 · TYT Genel', date: gun(-14),
       lessons: dersler([22, 5], [7, 2], [7, 2], [3, 1], [4, 1], [14, 9], [6, 2], [6, 2], [6, 2]),
       errorLogs: [
         {qno: '5', lesson: 'Tarih', topic: '1.2 Türkistan\'dan Türkiye\'ye Türklerde Devlet ve Ordu Teşkilatları', type: 'ANLAMADIM', date: gun(-14)},
         {qno: '3', lesson: 'Coğrafya', topic: '2.1 CBS ve Uzaktan Algılamanın Uygulama Alanları', type: 'KONUEKSİKLİĞİ', date: gun(-14)},
       ]},
      {id: 'e4', name: 'Okulizyon: 10.SINIF MAARİF İZLEME SINAVI 2', date: gun(-7), okulizyonUrl: 'https://okulizyon.com/sinav/2',
       lessons: dersler([24, 4], [8, 1], [7, 2], [4, 1], [4, 1], [17, 7], [7, 2], [7, 2], [7, 2]),
       errorLogs: [
         {qno: '12', lesson: 'Matematik', topic: '1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler', type: 'KONUEKSİKLİĞİ', date: gun(-7)},
         {qno: '4', lesson: 'Fizik', topic: '1.2.1 İvme ve Hız Değişimi Arasındaki İlişki', type: 'ANLAMADIM', date: gun(-7)},
         {qno: '6', lesson: 'Biyoloji', topic: '1.2 Işık Enerjisi Kullanılarak Besin Sentezi (Fotosentez)', type: 'KONUEKSİKLİĞİ', date: gun(-7)},
       ]},
      {id: 'e5', name: 'Deneme 5 · TYT Genel', date: gun(-3),
       lessons: dersler([26, 3], [8, 1], [8, 1], [4, 1], [4, 1], [20, 5], [8, 1], [8, 1], [8, 1]),
       errorLogs: [
         {qno: '7', lesson: 'Biyoloji', topic: '1.2 Işık Enerjisi Kullanılarak Besin Sentezi (Fotosentez)', type: 'ANLAMADIM', date: gun(-3)},
         {qno: '8', lesson: 'Biyoloji', topic: '1.2 Işık Enerjisi Kullanılarak Besin Sentezi (Fotosentez)', type: 'KONUEKSİKLİĞİ', date: gun(-3)},
         {qno: '15', lesson: 'Matematik', topic: '1.1 Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler', type: 'ANLAMADIM', date: gun(-3)},
         {qno: '6', lesson: 'Kimya', topic: '1.1.2 Kimyasal Tepkime Türleri', type: 'KONUEKSİKLİĞİ', date: gun(-3)},
         {qno: '2', lesson: 'Felsefe', topic: '1.2 Felsefi Düşüncenin Gelişimi', type: 'İşlem Hatası/Dikkatsizlik', date: gun(-3)},
         {qno: '4', lesson: 'Din Kültürü', topic: "1.2 Kur'an'ın Anlaşılması ve Yorumlanması", type: 'ANLAMADIM', date: gun(-3)},
       ]},
    ].map((e) => ({...e, total: toplam(e.lessons), net: net(e.lessons)}));

    const sorular = [
      {id: 'q1', lesson: 'Matematik', date: gun(-13), total: 20, d: 14, w: 5, e: 1, errorLogs: []},
      {id: 'q2', lesson: 'Fizik', date: gun(-12), total: 15, d: 10, w: 4, e: 1,
       errorLogs: [{qno: '6', lesson: 'Fizik', topic: '1.2.1 İvme ve Hız Değişimi Arasındaki İlişki', type: 'ANLAMADIM', date: gun(-12)}]},
      {id: 'q3', lesson: 'Biyoloji', date: gun(-11), total: 10, d: 6, w: 3, e: 1,
       errorLogs: [{qno: '4', lesson: 'Biyoloji', topic: '1.2 Işık Enerjisi Kullanılarak Besin Sentezi (Fotosentez)', type: 'ANLAMADIM', date: gun(-11)}]},
      {id: 'q4', lesson: 'Kimya', date: gun(-9), total: 12, d: 8, w: 3, e: 1,
       errorLogs: [{qno: '9', lesson: 'Kimya', topic: '1.1.2 Kimyasal Tepkime Türleri', type: 'KONUEKSİKLİĞİ', date: gun(-9)}]},
      {id: 'q5', lesson: 'Türk Dili ve Edebiyatı', date: gun(-8), total: 25, d: 20, w: 4, e: 1, errorLogs: []},
      {id: 'q6', lesson: 'Tarih', date: gun(-6), total: 15, d: 11, w: 3, e: 1, errorLogs: []},
      {id: 'q7', lesson: 'Matematik', date: gun(-5), total: 20, d: 16, w: 3, e: 1, errorLogs: []},
      {id: 'q8', lesson: 'Biyoloji', date: gun(-4), total: 10, d: 7, w: 2, e: 1, errorLogs: []},
      {id: 'q9', lesson: 'Coğrafya', date: gun(-3), total: 12, d: 10, w: 2, e: 0, errorLogs: []},
      {id: 'q10', lesson: 'Felsefe', date: gun(-2), total: 10, d: 8, w: 2, e: 0, errorLogs: []},
      {id: 'q11', lesson: 'Matematik', date: gun(-1), total: 15, d: 12, w: 2, e: 1, errorLogs: []},
      {id: 'q12', lesson: 'Biyoloji', date: gun(0), total: 10, d: 7, w: 2, e: 1, errorLogs: []},
    ];

    const kitaplar = [
      {id: 'k1', title: '10. Sınıf Biyoloji Soru Bankası', author: 'Palme', pages: 320, read: 214, done: false,
       history: [{date: gun(-9), pages: 18, minutes: 40}, {date: gun(-5), pages: 24, minutes: 50}, {date: gun(-2), pages: 16, minutes: 35}]},
      {id: 'k2', title: 'TYT Matematik Konu Anlatımı', author: 'Karekök', pages: 480, read: 296, done: false,
       history: [{date: gun(-7), pages: 22, minutes: 55}, {date: gun(-1), pages: 18, minutes: 45}]},
      {id: 'k3', title: 'Nutuk', author: 'Mustafa Kemal Atatürk', pages: 640, read: 640, done: true,
       history: [{date: gun(-20), pages: 40, minutes: 60}]},
    ];

    const hafiza = {
      'Biyoloji > 1.1 Canlılık İçin Enerjinin Önemi': {lastReview: gun(-35), reviewCount: 2, completedAt: gun(-46), schedule: {'3': gun(-43), '7': gun(-39), '14': gun(-32), '21': gun(-25), '28': gun(-18)}},
      'Fizik > 1.1 Sabit Hızlı Hareket': {lastReview: gun(-4), reviewCount: 3, completedAt: gun(-25), schedule: {'3': gun(-22), '7': gun(-18), '14': gun(-11), '21': gun(-4), '28': gun(3)}},
      'Matematik > 1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler': {lastReview: gun(-8), reviewCount: 3, completedAt: gun(-29), schedule: {'3': gun(-26), '7': gun(-22), '14': gun(-15), '21': gun(-8), '28': gun(-1)}},
      'Kimya > 1.1.1 Kimyasal Tepkimelerin Oluşumu': {lastReview: gun(-2), reviewCount: 4, completedAt: gun(-31), schedule: {'3': gun(-28), '7': gun(-24), '14': gun(-17), '21': gun(-10), '28': gun(-2)}},
      'Coğrafya > 1.1 Coğrafi Bakış': {lastReview: gun(-6), reviewCount: 3, completedAt: gun(-27), schedule: {'3': gun(-24), '7': gun(-20), '14': gun(-13), '21': gun(-6), '28': gun(1)}},
      "Tarih > 1.1 Önemli Askerî Mücadelelerin Türk Tarihinin Seyrine Etkileri": {lastReview: gun(-11), reviewCount: 2, completedAt: gun(-33), schedule: {'3': gun(-30), '7': gun(-26), '14': gun(-19), '21': gun(-12), '28': gun(-5)}},
    };

    const konular = {};
    Object.keys(hafiza).forEach((k) => {
      konular[k] = {step: 4, completedAt: hafiza[k].completedAt, preTest: true};
    });

    const durum = {
      user: {name: 'Elif', grade: '10', joined: gun(-60)},
      streak: {count: 12, lastCheck: gun(0), freezeWeek: null, freezeUsed: false},
      exams: denemeler,
      questions: sorular,
      books: kitaplar,
      topics: konular,
      memory: hafiza,
      notifications: [
        {id: 'n1', title: 'Tekrar zamanı: Biyoloji · 1.1', body: 'Hafıza gücü %21’e indi. Kart turuyla tekrar et, bari yenile.', date: gun(0), read: false, kind: 'review', topicKey: 'Biyoloji > 1.1 Canlılık İçin Enerjinin Önemi'},
        {id: 'n2', title: 'Matematik > 1.2 tekrarı yaklaştı', body: 'Sıradaki tekrar yarın. Bugün 10 dakika ayırırsan hafıza gücü yükselir.', date: gun(-1), read: false, kind: 'memory', topicKey: 'Matematik > 1.2 Üçgende Yardımcı Elemanlar ve Bunlar Arasındaki İlişkiler'},
        {id: 'n3', title: 'Seri: 12 gün', body: 'Bugün de kitap okuma ve soru çözümü görevini tamamladın.', date: gun(0), read: true, kind: 'badge'},
        {id: 'n4', title: 'Okulizyon denemesi düştü', body: '10.SINIF MAARİF İZLEME SINAVI 2 listeye eklendi — yanlışların nedenlerini işaretleyebilirsin.', date: gun(-7), read: true, kind: 'exam'},
      ],
      badges: {},
      plan: {targetDate: '2027-06-20', examTime: '10:15', schoolExams: [], targetNet: 65, dailyHours: 3, dailyReading: 40, readingMinutes: 45, rhythm: 'Sabah'},
      settings: {notifPermission: 'granted', lastCoachDay: gun(0), greetedToday: gun(0)},
      bkt_state: {},
      bkt_processed_records: {},
      soru_havuzu_gosterim_logu: [],
      mini_test_kuyrugu: [],
      mini_test_sessions: {},
      taxonomy_migration_done: true,
      dailyTasks: {study: true, read: true, solve: false, date: gun(0)},
    };

    localStorage.setItem(K, JSON.stringify(durum));
    localStorage.setItem('am_karsilama_goruldu', '1');
    ['am_theme', 'am_bkt_panel_acik'].forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.error('tohum hatası', e);
  }
}

module.exports = {tohumKodu};
