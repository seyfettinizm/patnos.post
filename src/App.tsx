import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Search, Menu, X, User, TrendingUp, 
  ChevronRight, Facebook, Instagram, Twitter, 
  ArrowUp, Clock
} from 'lucide-react';

import { 
  Language, 
  UI_STRINGS, 
  MENU_LINKS, 
  CATEGORIES 
} from './constants';

import { useNews } from './hooks/useNews';
import { useSettings } from './hooks/useSettings';
import { usePages } from './hooks/usePages';
import { isSupabaseConfigured } from './supabase';

// Bileşenlerin içe aktarılması
import { NewsCard } from './components/NewsCard';
import { NewsSlider } from './components/NewsSlider';
import { PopularNewsItem } from './components/PopularNewsItem';
import { NewsDetail } from './components/NewsDetail';
import { AdminPanel } from './components/AdminPanel';
import { LoginModal } from './components/LoginModal';
import { SupabaseSetup } from './components/SupabaseSetup';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageDetail } from './components/PageDetail';

export default function App() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [lang, setLang] = useState<Language>((searchParams.get('lang') as Language) || 'tr');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [showAdmin, setShowAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const { news } = useNews();
  const { settings } = useSettings();
  const { pages } = usePages();

  const t = UI_STRINGS[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const langParam = searchParams.get('lang');
    if (langParam && (langParam === 'tr' || langParam === 'ku')) {
      setLang(langParam as Language);
    }
  }, [searchParams]);

  const toggleLang = () => {
    const newLang = lang === 'tr' ? 'ku' : 'tr';
    setLang(newLang);
    setSearchParams({ lang: newLang });
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    setShowAdmin(false);
  };

  const filteredNews = news.filter(item => {
    if (item.status === 'draft' && !isAdmin) return false;
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = !searchQuery || 
      item.title[lang]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title[lang === 'tr' ? 'ku' : 'tr']?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const breakingNews = news.filter(item => item.isBreaking && item.status !== 'draft');
  const popularNews = [...news]
    .filter(item => item.status !== 'draft')
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 5);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-brand-bg selection:bg-brand-accent selection:text-white">
        
        {!isSupabaseConfigured() && <SupabaseSetup onComplete={() => {}} />}

        {/* HEADER */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' : 'bg-white py-4'}`}>
          <div className="news-container">
            <div className="flex flex-col items-center gap-6">
              {/* Logo Section */}
              <div className="w-full flex justify-center">
                <img 
                  src="https://static.wixstatic.com/media/7e2174_e230755889444a418254ba8ec11e24f7~mv2.png" 
                  alt="The Patnos Post Logo" 
                  className="max-h-[80px] md:max-h-[120px] w-auto object-contain cursor-pointer"
                  onClick={() => navigate(`/?lang=${lang}`)}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Navigation and Language Section */}
              <div className="w-full flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setLang('tr'); setSearchParams({ lang: 'tr' }); }}
                    className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${lang === 'tr' ? 'bg-brand-accent text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    TÜRKÇE
                  </button>
                  <button 
                    onClick={() => { setLang('ku'); setSearchParams({ lang: 'ku' }); }}
                    className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${lang === 'ku' ? 'bg-brand-accent text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    KURDÎ
                  </button>
                </div>

                <div className="h-4 w-px bg-gray-200 hidden md:block" />

                <a 
                  href="https://www.patnosum.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white hover:bg-black rounded-full shadow-sm text-[11px] font-bold uppercase tracking-widest transition-all"
                >
                  <Globe size={14} className="text-brand-accent" />
                  SİTE ANASAYFA
                </a>

                {isAdmin ? (
                  <button onClick={() => setShowAdmin(true)} className="p-2 bg-brand-accent text-white rounded-full shadow-lg hover:scale-110 transition-all">
                    <User size={18} />
                  </button>
                ) : (
                  <button onClick={() => setShowLogin(true)} className="p-2 text-gray-400 hover:text-brand-accent transition-all">
                    <User size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Adjusting padding-top to account for header */}
        <div className={scrolled ? "pt-[180px]" : "pt-[220px]"} />

        {/* TICKER - Moved to prominent position */}
        {breakingNews.length > 0 && (
          <div className="bg-brand-primary text-white py-3 overflow-hidden border-b border-brand-accent/30 mt-4">
            <div className="news-container flex items-center">
              <div className="bg-brand-accent text-[10px] font-bold px-3 py-1 mr-6 rounded-sm whitespace-nowrap animate-pulse">
                {t.breakingNews}
              </div>
              <div className="flex animate-[ticker_40s_linear_infinite] whitespace-nowrap gap-16 font-medium text-sm">
                {breakingNews.map((item) => (
                  <span key={item.id} className="cursor-pointer hover:text-brand-accent" onClick={() => navigate(`/news/${item.id}?lang=${lang}`)}>
                    {item.title[lang] || item.title.tr}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEARCH & FILTERS */}
        <div className="bg-gray-50 border-b border-gray-100">
           <div className="news-container py-4 flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 flex-1 w-full">
                <Search className="text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder={lang === 'tr' ? 'Haberlerde ara...' : 'Di nûçeyan de bigere...'} 
                  className="bg-transparent flex-1 outline-none text-sm font-medium" 
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
                 {CATEGORIES.map(cat => (
                   <button 
                    key={cat.id} 
                    onClick={() => { setActiveCategory(cat.id); navigate(`/?lang=${lang}`); }}
                    className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-brand-primary text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
                   >
                     {cat[lang]}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        <main className="py-12">
          <Routes>
            <Route path="/" element={
              <div className="news-container">
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="lg:w-[70%]">
                    {activeCategory === 'all' && !searchQuery && (
                      <div className="mb-16">
                        <NewsSlider items={news.filter(n => n.status !== 'draft').slice(0, 5)} lang={lang} />
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-16">
                      {filteredNews.length > 0 ? (
                        filteredNews.slice(0, 10).map(item => <NewsCard key={item.id} item={item} lang={lang} />)
                      ) : (
                        <div className="col-span-full py-20 text-center text-gray-400 uppercase font-bold text-xs">Haber Bulunamadı</div>
                      )}
                    </div>

                    {/* Categories under news module */}
                    <div className="mt-20 pt-10 border-t border-gray-100">
                      <div className="flex flex-wrap items-center justify-center gap-4">
                        {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                          <button 
                            key={cat.id} 
                            onClick={() => { setActiveCategory(cat.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="px-6 py-2 border border-gray-200 hover:border-brand-accent hover:text-brand-accent rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                          >
                            {cat[lang]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <aside className="lg:w-[30%] space-y-12">
                     <div className="bg-brand-primary text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-accent/40 transition-all duration-700" />
                        <h3 className="text-xl font-anton mb-2">{t.newsletterTitle}</h3>
                        <p className="text-[11px] text-gray-400 mb-6 italic">{t.newsletterDesc}</p>
                        <div className="flex border-b border-white/20 pb-2">
                           <input type="email" placeholder={t.newsletterPlaceholder} className="bg-transparent border-none outline-none text-xs flex-1" />
                           <button className="text-brand-accent font-black text-[10px] uppercase">{t.subscribe}</button>
                        </div>
                     </div>

                     <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                           <TrendingUp className="text-brand-accent" size={20} />
                           <h3 className="font-anton text-xl">{t.popularNews}</h3>
                        </div>
                        <div className="space-y-8">
                           {popularNews.map((item, idx) => (
                             <PopularNewsItem key={item.id} item={item} idx={idx} lang={lang} />
                           ))}
                        </div>
                     </div>
                  </aside>
                </div>
              </div>
            } />
            <Route path="/news/:id" element={<NewsDetailWrapper news={news} lang={lang} onClose={() => navigate(`/?lang=${lang}`)} />} />
            <Route path="/page/:pageId" element={<PageDetailWrapper lang={lang} onClose={() => navigate(`/?lang=${lang}`)} />} />
          </Routes>
        </main>

        <footer className="bg-brand-primary text-white py-24 mt-20">
          <div className="news-container">
            <div className="grid md:grid-cols-4 gap-16">
              <div className="md:col-span-2">
                <h2 className="font-anton text-4xl mb-8">THE PATNOS POST</h2>
                <p className="text-gray-500 max-w-md text-sm italic mb-8">{t.aboutUsDesc}</p>
                <div className="flex gap-4">
                  {[Facebook, Instagram, Twitter].map((Icon, i) => (
                    <button key={i} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-accent transition-all"><Icon size={20} /></button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-brand-accent mb-10">{t.corporate}</h4>
                <ul className="space-y-4 text-[11px] font-black uppercase text-gray-500">
                  {pages.map(page => (
                    <li key={page.id}><button onClick={() => navigate(`/page/${page.id}?lang=${lang}`)} className="hover:text-white transition-colors">{page.title[lang]}</button></li>
                  ))}
                  <li><a href="#" className="hover:text-white transition-colors">{t.contact}</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-brand-accent mb-10">BİZE ULAŞIN</h4>
                <p className="text-gray-500 text-sm italic leading-relaxed">Projelerimiz ve çalışmalarımız hakkında bilgi almak için bizimle iletişime geçebilirsiniz.</p>
              </div>
            </div>
            
            <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase text-gray-600">
              <p>{t.rights}</p>
              <div className="flex gap-10">
                <a href="#" className="hover:text-white transition-colors">{t.privacy}</a>
                <a href="#" className="hover:text-white transition-colors">{t.terms}</a>
              </div>
            </div>
          </div>
        </footer>

        {scrolled && (
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-8 right-8 p-4 bg-brand-accent text-white rounded-full shadow-2xl z-50 hover:scale-110 transition-all">
            <ArrowUp size={24} />
          </button>
        )}

        <AnimatePresence>
          {showLogin && (
            <LoginModal 
              key="login" 
              onClose={() => setShowLogin(false)} 
              onSuccess={() => { setIsAdmin(true); localStorage.setItem('isAdmin', 'true'); setShowLogin(false); setShowAdmin(true); }} 
              lang={lang} 
            />
          )}
          {showAdmin && isAdmin && (
            <AdminPanel 
              key="admin" 
              onClose={() => setShowAdmin(false)} 
              onLogout={handleLogout} 
              lang={lang} 
            />
          )}
        </AnimatePresence>

        <style>{`
          @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </ErrorBoundary>
  );
}

function NewsDetailWrapper({ news, lang, onClose }: any) {
  const { id } = useParams();
  const item = news.find((n: any) => n.id === id);
  if (!item) return null;
  return <NewsDetail item={item} lang={lang} onClose={onClose} />;
}

function PageDetailWrapper({ lang, onClose }: any) {
  const { pageId } = useParams();
  if (!pageId) return null;
  return <PageDetail pageId={pageId} lang={lang} onClose={onClose} />;
}
