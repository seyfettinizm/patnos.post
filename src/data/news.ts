import { NewsItem } from '../types';

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Patnos\'ta Modern Şehirleşme Hamlesi: Yeni Projeler Yolda',
    excerpt: 'Belediye tarafından açıklanan yeni imar planı ile Patnos çehresini değiştirecek modern yapılar ve yeşil alanlar inşa edilecek.',
    content: 'Patnos Belediyesi, ilçeyi modern bir görünüme kavuşturmak için hazırlanan "Patnos 2030" vizyon projesini kamuoyuna tanıttı. Proje kapsamında caddelerin genişletilmesi, yeni parkların yapımı ve akıllı şehir teknolojilerinin entegrasyonu hedefleniyor...',
    category: 'Yerel',
    author: 'Serhat Demir',
    date: '2026-05-04',
    imageUrl: 'https://picsum.photos/seed/patnos1/1200/800',
    isBreaking: true
  },
  {
    id: '2',
    title: 'Bölgesel Ekonomi Zirvesi Patnos\'ta Gerçekleşti',
    excerpt: 'Doğu Anadolu ekonomisinin canlandırılması adına düzenlenen zirvede tarım ve hayvancılık alanındaki teşvikler masaya yatırıldı.',
    content: 'İlçemizde düzenlenen ekonomi zirvesine çok sayıda iş insanı ve bürokrat katıldı. Tarım ve Orman Bakanlığı temsilcileri, bölgedeki çiftçilere yönelik yeni hibe programlarını açıkladı...',
    category: 'Ekonomi',
    author: 'Elif Yılmaz',
    date: '2026-05-05',
    imageUrl: 'https://picsum.photos/seed/economy1/800/600'
  },
  {
    id: '3',
    title: 'Patnos Spor, Grubunda Liderliğe Yükseldi',
    excerpt: 'Hafta sonu oynanan kritik derbi maçında rakibini 3-1 yenen Patnos Spor, ligde yeniden zirvenin sahibi oldu.',
    content: 'Taraftarın yoğun desteğiyle sahaya çıkan Patnos Spor, etkili oyunuyla sahadan üç puanla ayrıldı. Maç sonu teknik direktör yaptığı açıklamada: "Bu galibiyet bizim için bir dönüm noktasıydı" dedi.',
    category: 'Spor',
    author: 'Mert Aksoy',
    date: '2026-05-05',
    imageUrl: 'https://picsum.photos/seed/sports1/800/600'
  },
  {
    id: '4',
    title: 'Tarihi İshak Paşa Sarayı Ziyaretçilerini Bekliyor',
    excerpt: 'Bölgenin en önemli tarihi yapılarından biri olan saray, yaz sezonu öncesi restorasyon çalışmalarının ardından kapılarını açtı.',
    content: 'Kültür ve Turizm Bakanlığı koordinasyonunda yürütülen çalışmalar sonucu sarayın pek çok bölümü aslına uygun olarak yenilendi. Turizmciler bu yıl rekor sayıda turist bekliyor.',
    category: 'Kültür',
    author: 'Ayşe Karaca',
    date: '2026-05-03',
    imageUrl: 'https://picsum.photos/seed/culture1/800/600'
  },
  {
    id: '5',
    title: 'Patnos Gençlik Festivali İçin Hazırlıklar Tamam',
    excerpt: 'Önümüzdeki ay düzenlenecek olan festivalde yerel sanatçıların yanı sıra ünlü isimler de sahne alacak.',
    content: 'İlçe stadyumunda gerçekleşecek olan festival, gençlerin sosyal ve kültürel faaliyetlerini desteklemeyi amaçlıyor. Üç gün sürecek olan etkinlikler boyunca konserler, sergiler ve atölye çalışmaları düzenlenecek.',
    category: 'Yerel',
    author: 'Caner Aydın',
    date: '2026-05-02',
    imageUrl: 'https://picsum.photos/seed/festival1/800/600'
  },
  {
    id: '6',
    title: 'Yeni Siyasi Gelişmeler: Yerel Yönetimde Değişim Rüzgarları',
    excerpt: 'İlçe meclisinde yapılan son oylamalar, yerel siyasette yeni bir dönemin kapısını araladı.',
    content: 'Meclis üyeleri arasında varılan mutabakat çerçevesinde sosyal hizmetler bütçesinin artırılması kararlaştırıldı. Bu adımın ilçedeki yardımlaşma faaliyetlerini hızlandırması bekleniyor.',
    category: 'Siyaset',
    author: 'Selin Yıldız',
    date: '2026-05-01',
    imageUrl: 'https://picsum.photos/seed/politics1/800/600'
  }
];
