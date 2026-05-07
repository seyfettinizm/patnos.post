export type Language = 'tr' | 'ku';

export interface NewsItem {
  id: string;
  title: {
    tr: string;
    ku: string;
  };
  excerpt: {
    tr: string;
    ku: string;
  };
  content: {
    tr: string;
    ku: string;
  };
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  readTime: string;
  updatedAt?: string;
}

export interface HeaderSettings {
  leftImageUrl: string;
  rightImageUrl: string;
}

export const MENU_LINKS = [
  { label: 'ANASAYFA', url: 'https://www.patnosum.com/' },
  { label: 'DERNEĞİMİZ', url: 'https://www.patnosum.com/derne%C4%9Fi-mi-z' },
  { label: 'DERGİLERİMİZ', url: 'https://www.patnosum.com/dergi-leri-mi-z' },
  { label: 'PROJELERİMİZ', url: 'https://www.patnosum.com/projeleri%CC%87mi%CC%87z' },
  { label: 'SÜPHAN TV', url: 'https://www.patnosum.com/s%C3%BCphan-tv' },
];

export const CATEGORIES = [
  { id: 'all', tr: 'Tüm Haberler', ku: 'Hemû Nûçe' },
  { id: 'dernek', tr: 'Dernek Haberleri', ku: 'Nûçeyên Komeleyê' },
  { id: 'patnos', tr: 'Patnos Haberleri', ku: 'Nûçeyên Panosê' },
  { id: 'general', tr: 'Genel Haberler', ku: 'Nûçeyên Giştî' },
  { id: 'culture', tr: 'Yaşam ve Kültür', ku: 'Jiyan û Çand' }
];

export interface UIStrings {
  editorLogin: string;
  panel: string;
  logout: string;
  loading: string;
  popularNews: string;
  latestNews: string;
  seeAll: string;
  newsletterTitle: string;
  newsletterDesc: string;
  newsletterPlaceholder: string;
  subscribe: string;
  aboutUs: string;
  aboutUsDesc: string;
  corporate: string;
  imprint: string;
  contact: string;
  ads: string;
  socialMedia: string;
  rights: string;
  adminPanel: string;
  mainImage: string;
  newsList: string;
  privacy: string;
  terms: string;
  editorPassword: string;
  login: string;
  onlyEditors: string;
  addNews: string;
  editNews: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  author: string;
  readTime: string;
  save: string;
  cancel: string;
  deleteConfirm: string;
  status: string;
  published: string;
  draft: string;
  turkish: string;
  kurdish: string;
  translating: string;
  breakingNews: string;
  share: string;
  shareNews: string;
  pages: string;
  all: string;
  dernek: string;
  patnos: string;
  general: string;
  culture: string;
}

export const UI_STRINGS: Record<Language, UIStrings> = {
  tr: {
    editorLogin: 'EDİTÖR GİRİŞİ',
    panel: 'PANEL',
    logout: 'ÇIKIŞ',
    loading: 'Yükleniyor...',
    popularNews: 'Popüler Haberler',
    latestNews: 'Son Haberler',
    seeAll: 'Tümünü Gör',
    newsletterTitle: 'Gündemi Kaçırmayın',
    newsletterDesc: 'En önemli haberler ve özel analizler her sabah e-posta kutunuza gelsin.',
    newsletterPlaceholder: 'E-posta adresiniz',
    subscribe: 'ABONE OL',
    aboutUs: 'Hakkımızda',
    aboutUsDesc: '2026 yılından beri bağımsız gazetecilik ilkeleriyle, dünyadaki gelişmeleri en doğru ve tarafsız şekilde okuyucularımıza ulaştırıyoruz.',
    corporate: 'Kurumsal',
    imprint: 'Künye',
    contact: 'İletişim',
    ads: 'Reklam',
    socialMedia: 'Sosyal Medya',
    rights: '© 2026 THE PATNOS POST. TÜM HAKLARI SAKLIDIR.',
    adminPanel: "Yönetim Paneli",
    mainImage: "Ana Görsel",
    newsList: "Haber Listesi",
    privacy: 'GİZLİLİK POLİTİKASI',
    terms: 'KULLANIM ŞARTLARI',
    editorPassword: 'Editör Şifresi',
    login: 'Giriş Yap',
    onlyEditors: 'Sadece yetkili editörler erişebilir',
    addNews: 'Yeni Haber Ekle',
    editNews: 'Haberi Düzenle',
    title: 'Başlık',
    excerpt: 'Özet',
    content: 'İçerik',
    category: 'Kategori',
    imageUrl: 'Görsel URL',
    author: 'Yazar',
    readTime: 'Okuma Süresi',
    save: 'Kaydet',
    cancel: 'İptal',
    deleteConfirm: 'Bu haberi silmek istediğinize emin misiniz?',
    status: 'Durum',
    published: 'Yayında',
    draft: 'Taslak',
    turkish: 'Türkçe',
    kurdish: 'Kurdî',
    translating: 'Çevriliyor...',
    breakingNews: 'SON DAKİKA',
    share: 'Paylaş:',
    shareNews: 'Haberi Paylaş',
    pages: 'Sayfalar',
    all: 'Tüm Haberler',
    dernek: 'Dernek Haberleri',
    patnos: 'Patnos Haberleri',
    general: 'Genel Haberler',
    culture: 'Yaşam ve Kültür'
  },
  ku: {
    editorLogin: 'KETINA EDÎTOR',
    panel: 'PANEL',
    logout: 'DERKETIN',
    loading: 'Tê barkirin...',
    popularNews: 'Nûçeyên Populer',
    latestNews: 'Nûçeyên Dawî',
    seeAll: 'Hemûyan Bibîne',
    newsletterTitle: 'Rojevê Ji Dest Nedin',
    newsletterDesc: 'Bila nûçeyên herî girîng û analîzên taybet her sibê werin qutiya e-postaya we.',
    newsletterPlaceholder: 'Navnîşana e-postaya we',
    subscribe: 'BIBE ABONE',
    aboutUs: 'Derbarê Me De',
    aboutUsDesc: 'Ji sala 2026-an vir ve bi prensîbên rojnamegeriya serbixwe, em geşedanên li cîhanê bi awayê herî rast û bêalî digihînin xwendevanên xwe.',
    corporate: 'Sazî',
    imprint: 'Kunya',
    contact: 'Têkilî',
    ads: 'Reklam',
    socialMedia: 'Medyaya Civakî',
    rights: '© 2026 THE PATNOS POST. HEMÛ MAF PARASTÎ NE.',
    adminPanel: "Panela Rêveberiyê",
    mainImage: "Wêneya Sereke",
    newsList: "Lîsteya Nûçeyan",
    privacy: 'POLÎTÎKAYA VEŞARTÎBÛNÊ',
    terms: 'ŞERTÊN KARANÎNÊ',
    editorPassword: 'Şîfreya Edîtor',
    login: 'Têkeve',
    onlyEditors: 'Tenê edîtorên rayedar dikarin bigihîjinê',
    addNews: 'Nûçeya Nû Zêde Bike',
    editNews: 'Nûçeyê Sererast Bike',
    title: 'Sernav',
    excerpt: 'Kurtasî',
    content: 'Naverok',
    category: 'Kategorî',
    imageUrl: 'URL-ya Wêne',
    author: 'Nivîskar',
    readTime: 'Dema Xwendinê',
    save: 'Tomar Bike',
    cancel: 'Betal Bike',
    deleteConfirm: 'Ma hûn bawer in ku hûn dixwazin vê nûçeyê jê bibin?',
    status: 'Rewş',
    published: 'Hat Weşandin',
    draft: 'Pêşnivîs',
    turkish: 'Tirkî',
    kurdish: 'Kurdî',
    translating: 'Tê wergerandin...',
    breakingNews: 'NÛÇEYA DAWÎ',
    share: 'Parve bike:',
    shareNews: 'Nûçeyê Parve Bike',
    pages: 'Rûpel',
    all: 'Hemû Nûçe',
    dernek: 'Nûçeyên Komeleyê',
    patnos: 'Nûçeyên Panosê',
    general: 'Nûçeyên Giştî',
    culture: 'Jiyan û Çand'
  }
};

export const NEWS_DATA: NewsItem[] = [
  {
    id: '1',
    title: {
      tr: 'Patnos Derneği Yeni Projesini Açıkladı',
      ku: 'Komeleya Panosê Projeya Xwe Ya Nû Eşkere Kir'
    },
    excerpt: {
      tr: 'Patnos Yardımlaşma ve Dayanışma Derneği, eğitim alanında büyük bir burs seferberliği başlatıyor.',
      ku: 'Komeleya Alîkarî û Piştevaniya Panosê, di warê perwerdehiyê de seferberiyeke mezin a bûrsê dide destpêkirin.'
    },
    content: {
      tr: 'Dernek binasında yapılan basın açıklamasında, bu yıl 500 öğrenciye burs verileceği duyuruldu...',
      ku: 'Di daxuyaniya çapemeniyê ya ku li avahiya komeleyê hat dayîn de, hat ragihandin ku îsal dê ji bo 500 xwendekaran bûrs were dayîn...'
    },
    category: 'association',
    author: 'Ahmet Yılmaz',
    date: '14 Mart 2026',
    imageUrl: 'https://picsum.photos/seed/patnos1/800/600',
    readTime: '5 dk'
  },
  {
    id: '2',
    title: {
      tr: 'Patnos\'ta Bahar Hazırlıkları Başladı',
      ku: 'Li Panosê Amadekariyên Biharê Dest Pê Kirin'
    },
    excerpt: {
      tr: 'Patnos Belediyesi, bahar aylarının gelmesiyle birlikte çevre düzenleme çalışmalarına hız verdi.',
      ku: 'Şaredariya Panosê, bi hatina mehên biharê re xebatên sererastkirina hawirdorê lezand.'
    },
    content: {
      tr: 'Şehrin dört bir yanında çiçeklendirme ve park yenileme çalışmaları devam ediyor...',
      ku: 'Li her çar aliyên bajêr xebatên kulîlkandin û nûkirina parkan berdewam dikin...'
    },
    category: 'patnos',
    author: 'Elif Kaya',
    date: '13 Mart 2026',
    imageUrl: 'https://picsum.photos/seed/patnos2/800/600',
    readTime: '4 dk'
  },
  {
    id: '3',
    title: {
      tr: 'Patnos Gençlik Festivali Başlıyor',
      ku: 'Festîvala Ciwanan a Panosê Dest Pê Dike'
    },
    excerpt: {
      tr: 'Şehirdeki gençler için düzenlenen en büyük etkinlik olan Gençlik Festivali bu hafta sonu başlıyor.',
      ku: 'Festîvala Ciwanan a ku ji bo ciwanên bajêr tê lidarxistin, vê dawiya hefteyê dest pê dike.'
    },
    content: {
      tr: 'Festival kapsamında konserler, spor etkinlikleri ve atölyeler yer alacak. Patnos Belediyesi tarafından organize edilen etkinlik 3 gün sürecek.',
      ku: 'Di çarçoveya festîvalê de konser, çalakiyên werzîşê û atolyeyên cuda dê bên lidarxistin. Çalakiya ku ji aliyê Şaredariya Panosê ve tê birêvebirin dê 3 rojan berdewam bike.'
    },
    category: 'life-culture',
    author: 'Serkan Demir',
    date: '12 Mart 2026',
    imageUrl: 'https://picsum.photos/seed/patnos3/800/600',
    readTime: '6 dk'
  },
  {
    id: '4',
    title: {
      tr: 'Yeni Patnos Devlet Hastanesi İnşaatı Tamamlanıyor',
      ku: 'Avakirina Nexweşxaneya Dewletê ya Nû ya Panosê bi dawî dibe'
    },
    excerpt: {
      tr: 'Patnos halkının merakla beklediği yeni modern hastane inşaatı önümüzdeki ay tamamlanıyor.',
      ku: 'Avakirina nexweşxaneya nû ya nûjen ku xelkê Panosê bi kelecan li benda wê bû, meha bê bi dawî dibe.'
    },
    content: {
      tr: 'En son teknoloji ile donatılan hastane bölgesel bir merkez olacak...',
      ku: 'Nexweşxaneya ku bi teknolojiya herî dawî hatiye stajkirin dê bibe navendeke herêmî...'
    },
    category: 'general',
    author: 'Derya Yılmaz',
    date: '11 Mart 2026',
    imageUrl: 'https://picsum.photos/seed/patnos4/800/600',
    readTime: '5 dk'
  },
  {
    id: '5',
    title: {
      tr: 'Patnosspor Şampiyonluk Yolunda İlerliyor',
      ku: 'Patnosspor di Riya Şampiyoniyê de bi Pêş De Diçe'
    },
    excerpt: {
      tr: 'Yerel ligde mücadele eden takımımız bu hafta da galip gelerek liderliğini korudu.',
      ku: 'Tîma me ya ku di lîga herêmî de têdikoşe, vê hefteyê jî bi ser ket û lîderiya xwe parast.'
    },
    content: {
      tr: 'Taraftarın büyük desteği ile maça çıkan Patnosspor 3-0 galip geldi...',
      ku: 'Patnosspor a ku bi piştgiriya mezin a alîgiran derketibû maçê 3-0 bi ser ket...'
    },
    category: 'sports',
    author: 'Mehmet Eren',
    date: '10 Mart 2026',
    imageUrl: 'https://picsum.photos/seed/patnos5/800/600',
    readTime: '4 dk'
  },
  {
    id: '6',
    title: {
      tr: 'Patnos’ta Bahar Temizliği Seferberliği',
      ku: 'Li Panosê Seferberiya Paqijiya Biharê'
    },
    excerpt: {
      tr: 'Belediye ekipleri baharın gelmesiyle birlikte tüm mahallelerde geniş kapsamlı temizlik başlattı.',
      ku: 'Ekîbên şaredariyê bi hatina biharê re li hemû taxan paqijiyeke berfireh dan destpêkirin.'
    },
    content: {
      tr: 'Patnos Belediye Başkanı, daha temiz bir Patnos için çalışmaların süreceğini belirtti...',
      ku: 'Şaredarê Panosê diyar kir ku xebatên ji bo Panoseke paqijtir dê berdewam bikin...'
    },
    category: 'general',
    author: 'Admin',
    date: '09 Mart 2026',
    imageUrl: 'https://picsum.photos/seed/patnos6/800/600',
    readTime: '3 dk'
  },
  {
    id: '7',
    title: {
      tr: 'Patnos Kültür Merkezi Yeni Sezona Hazır',
      ku: 'Navenda Çanda Panosê ji bo Demsala Nû Amade ye'
    },
    excerpt: {
      tr: 'Kültür merkezi bu yıl birçok tiyatro ve sergiye ev sahipliği yapacak.',
      ku: 'Navenda çandê dê îsal mêvandariya gelek şano û pêşangehan bike.'
    },
    content: {
      tr: 'Kültür ve sanat faaliyetlerinin artırılması hedefleniyor...',
      ku: 'Tê armanc kirin ku çalakiyên çandî û hunerî bên zêdekirin...'
    },
    category: 'life-culture',
    author: 'Zeynep Ak',
    date: '08 Mart 2026',
    imageUrl: 'https://picsum.photos/seed/patnos7/800/600',
    readTime: '7 dk'
  },
  {
    id: '8',
    title: {
      tr: 'Yerel Esnafa Destek Paketi Açıklandı',
      ku: 'Pakêta Piştgiriya ji bo Esnafên Herêmî hat ragihandin'
    },
    excerpt: {
      tr: 'Patnos Ticaret Odası, yerel esnafı kalkındırmak için yeni bir kredi paketi sunduğunu duyurdu.',
      ku: 'Odeya Bazirganiyê ya Panosê ragihand ku ji bo pêşxistina esnafên herêmî pakêteke nû ya krediyê pêşkêş kiriye.'
    },
    content: {
      tr: 'Ekonomik canlanma beklenen bölgede esnaf karardan memnun...',
      ku: 'Esnafên li herêma ku tê payîn vejîna aborî lê pêk were, ji biryarê memnûn in...'
    },
    category: 'general',
    author: 'Caner Işık',
    date: '07 Mart 2026',
    imageUrl: 'https://picsum.photos/seed/patnos8/800/600',
    readTime: '5 dk'
  },
  {
    id: '9',
    title: {
      tr: 'Patnos’ta Tarımsal Verimlilik Artıyor',
      ku: 'Li Panosê Berhemdariya Çandiniyê Zêde Dibe'
    },
    excerpt: {
      tr: 'Yeni sulama sistemleri sayesinde Patnos ovasında verim geçen yıla oranla arttı.',
      ku: 'Bi saya pergalên nû yên avdanê, berhemdariya li deşta Panosê li gorî par zêde bû.'
    },
    content: {
      tr: 'Çiftçiler yeni teknolojilerle daha kaliteli ürünler elde ediyor...',
      ku: 'Cotkar bi teknolojiyên nû berhemên bi kalîteyê çêtir bi dest dixin...'
    },
    category: 'general',
    author: 'Hasan Demir',
    date: '06 Mart 2026',
    imageUrl: 'https://picsum.photos/seed/patnos9/800/600',
    readTime: '4 dk'
  },
  {
    id: '10',
    title: {
      tr: 'Patnos Kalesi Restorasyon Çalışmaları Başladı',
      ku: 'Xebatên Restorasyona Kela Panosê Dest Pê Kirin'
    },
    excerpt: {
      tr: 'Tarihi kalenin turizme kazandırılması için kapsamlı bir restorasyon süreci başlatıldı.',
      ku: 'Ji bo qezenckirina kela dîrokî di turîzmê de, pêvajoyek restorasyona berfireh hat destpêkirin.'
    },
    content: {
      tr: 'Tarihi dokuya sadık kalınarak yapılan çalışmalar 2 yıl sürecek...',
      ku: 'Xebatên ku li gorî tevnên dîrokî tên kirin dê 2 salan berdewam bikin...'
    },
    category: 'life-culture',
    author: 'Selin Yıldız',
    date: '05 Mart 2026',
    imageUrl: 'https://picsum.photos/seed/patnos10/800/600',
    readTime: '10 dk'
  }
];
