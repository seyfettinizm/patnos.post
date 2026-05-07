import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Search, Menu, X, User, TrendingUp, 
  ChevronRight, Facebook, Instagram, Twitter, 
  ArrowUp, Clock, CloudSun
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
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
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
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = !searchQuery || 
      (item.title?.[lang] || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.title?.[lang === 'tr' ? 'ku' : 'tr'] || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularNews = [...news]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 5);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-brand-bg selection:bg-brand-accent selection:text-white">
        
        {!isSupabaseConfigured() && <SupabaseSetup onComplete={() => {}} />}

        {/* HEADER */}
        <header className="bg-white border-b-4 border-black pt-4">
          <div className="news-container">
            <div className="flex flex-col items-center">
              {/* Top Bar: Weather, Date, Auth */}
              <div className="w-full flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 border-b border-gray-50 pb-3">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm text-brand-accent transition-all hover:bg-white hover:shadow-md">
                    <CloudSun size={14} className="animate-pulse" />
                    <span className="tracking-widest">PATNOS 22°C</span>
                  </div>
                  <span className="hidden md:inline text-gray-300">|</span>
                  <span className="hidden sm:inline font-medium opacity-80">{new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'ku-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                
                <div className="flex items-center gap-6">
                  {isAdmin ? (
                    <button onClick={() => setShowAdmin(true)} className="hover:text-black transition-colors flex items-center gap-1.5 group">
                      <User size={12} className="group-hover:scale-110 transition-transform" /> {lang === 'tr' ? 'YÖNETİM' : 'RÊVEBERÎ'}
                    </button>
                  ) : (
                    <button onClick={() => setShowLogin(true)} className="hover:text-black transition-colors flex items-center gap-1.5 group">
                      <User size={12} className="group-hover:scale-110 transition-transform" /> {lang === 'tr' ? 'EDİTÖR' : 'EDÎTOR'}
                    </button>
                  )}
                </div>
              </div>

              {/* Logo Row */}
              <div className="w-full flex flex-col items-center py-2 md:py-4 relative">
                <img 
                  src="https://static.wixstatic.com/media/7e2174_e230755889444a418254ba8ec11e24f7~mv2.png" 
                  alt="The Patnos Post Logo" 
                  className="max-h-[70px] md:max-h-[160px] w-auto object-contain cursor-pointer transition-all duration-700 hover:scale-[1.02] drop-shadow-sm"
                  onClick={() => navigate(`/?lang=${lang}`)}
                  referrerPolicy="no-referrer"
                />

                <div className="mt-1 md:mt-2 text-[10px] sm:text-2xl md:text-4xl font-yesteryear text-gray-800 border-t border-b border-black/5 py-1 md:py-3 px-2 md:px-20 tracking-wider text-center bg-gradient-to-r from-transparent via-gray-50 to-transparent whitespace-nowrap overflow-hidden text-ellipsis w-full">
                  {lang === 'tr' ? 'Gerçeğin Peşinde, Geleceğin İzinde' : 'Di Şopa Rastiyê de, Li Ser Şopa Pêşerojê'}
                </div>
              </div>

              {/* Language & External Links Toolbar */}
              <div className="w-full flex items-center justify-center gap-2 py-2 md:py-4">
                <div className="flex bg-black p-0.5 md:p-1 rounded-full shadow-lg border border-white/10 scale-90 md:scale-100">
                  <button 
                    onClick={() => { setLang('tr'); setSearchParams({ lang: 'tr' }); }}
                    className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black tracking-widest transition-all ${lang === 'tr' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    TR
                  </button>
                  <button 
                    onClick={() => { setLang('ku'); setSearchParams({ lang: 'ku' }); }}
                    className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black tracking-widest transition-all ${lang === 'ku' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    KU
                  </button>
                </div>

                <a 
                  href="https://www.patnosum.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-1.5 md:px-6 md:py-2 bg-brand-primary text-white hover:bg-black rounded-full shadow-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 active:scale-95 scale-90 md:scale-100"
                >
                  <Globe size={12} className="text-brand-accent md:w-3.5 md:h-3.5" />
                  <span className="hidden sm:inline">Site Anasayfa</span>
                  <span className="sm:hidden">SİTE</span>
                </a>
              </div>
            </div>
          </div>

          {/* Scrolling Ticker (Breaking News) */}
          <div className="bg-black text-white py-1.5 md:py-2.5 overflow-hidden relative border-y border-white/10 shadow-inner group">
            <div className="w-full flex items-center">
              <div className="bg-red-700 text-[9px] md:text-[10px] font-black px-4 py-1 md:px-5 md:py-1.5 mr-4 md:mr-6 whitespace-nowrap shadow-[10px_0_20px_black] relative z-20 scale-x-110 -skew-x-12">
                <span className="inline-block skew-x-12">{lang === 'tr' ? 'SON DAKİKA' : 'NÛÇEYA DAWÎ'}</span>
              </div>
              <div className="relative flex-1 h-4 md:h-5 overflow-hidden">
                <div className="absolute flex whitespace-nowrap animate-ticker group-hover:pause-ticker">
                  {news.slice(0, 8).map((item, idx) => (
                    <span 
                      key={idx} 
                      onClick={() => navigate(`/news/${item.id}?lang=${lang}`)}
                      className="mx-6 md:mx-8 text-[10px] md:text-[11px] font-black tracking-widest hover:text-red-500 cursor-pointer transition-colors flex items-center gap-2 md:gap-3 uppercase"
                    >
                      <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-red-700 rounded-full"></span>
                      {item.title?.[lang] || item.title?.tr || '...'}
                    </span>
                  ))}
                  {/* Duplicate for seamless loop */}
                  {news.slice(0, 8).map((item, idx) => (
                    <span 
                      key={`dup-${idx}`} 
                      className="mx-6 md:mx-8 text-[10px] md:text-[11px] font-black tracking-widest flex items-center gap-2 md:gap-3 uppercase"
                    >
                      <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-red-700 rounded-full"></span>
                      {item.title?.[lang] || item.title?.tr || '...'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation / Categories & Search Toggle */}
          <nav className="bg-white border-b border-black/5 sticky top-0 md:relative z-40 shadow-sm md:shadow-none">
            <div className="news-container">
              <div className="flex items-center justify-between">
                {/* Desktop Menu */}
                <div className="hidden md:flex flex-1 overflow-x-auto overflow-y-hidden no-scrollbar py-3">
                  <ul className="flex items-center gap-14">
                    {CATEGORIES.map((cat) => (
                      <li key={cat.id} className="shrink-0">
                        <button
                          onClick={() => {
                            setActiveCategory(cat.id);
                            navigate(`/?lang=${lang}`);
                          }}
                          className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative pb-1 group whitespace-nowrap
                            ${activeCategory === cat.id 
                              ? 'text-red-700' 
                              : 'text-gray-400 hover:text-black'}`}
                        >
                          {cat[lang].toUpperCase()}
                          <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-700 transition-transform duration-300 ${activeCategory === cat.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`}></span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex-1 py-3 flex items-center gap-4">
                  <button 
                    onClick={() => setShowCategories(!showCategories)}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-[10px] font-black tracking-widest uppercase active:scale-95 transition-all shadow-lg"
                  >
                    <Menu size={14} className={showCategories ? 'rotate-90 transition-transform' : 'transition-transform'} />
                    {lang === 'tr' ? 'KATEGORİLER' : 'KATEGORÎ'}
                    {activeCategory !== 'all' && (
                      <span className="ml-2 pl-2 border-l border-white/20 text-red-500">
                        {CATEGORIES.find(c => c.id === activeCategory)?.[lang].toUpperCase()}
                      </span>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 md:gap-4 pl-4 border-l border-gray-100 py-2 md:py-3 shrink-0">
                  <AnimatePresence>
                    {showSearch && (
                      <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 160, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <input 
                          autoFocus
                          type="text" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={lang === 'tr' ? 'Ara...' : 'Bigere...'}
                          className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-1 text-[9px] font-medium outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button 
                    onClick={() => setShowSearch(!showSearch)}
                    className={`p-1.5 md:p-2 rounded-full transition-all ${showSearch ? 'bg-red-700 text-white shadow-lg' : 'bg-white text-gray-400 hover:text-black hover:bg-gray-50 border border-gray-100'}`}
                  >
                    <Search size={16} />
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </header>

        {/* Mobile Categories Dropdown */}
        <AnimatePresence>
          {showCategories && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden fixed inset-x-0 top-[header-height] bg-white z-30 shadow-2xl border-b border-gray-100 py-6 px-4"
              style={{ top: 'auto' }}
            >
              <div className="news-container">
                <div className="grid grid-cols-2 gap-3 pb-8">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setShowCategories(false);
                        navigate(`/?lang=${lang}`);
                      }}
                      className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-left transition-all flex items-center justify-between
                        ${activeCategory === cat.id 
                          ? 'bg-red-700 text-white shadow-lg scale-95' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    >
                      {cat[lang]}
                      {activeCategory === cat.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setShowCategories(false)}
                  className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-t border-gray-100"
                >
                  {lang === 'tr' ? 'KAPAT' : 'BIGIRE'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="py-8">
          {/* Slider moved here to be immediately below categories */}
          {activeCategory === 'all' && !searchQuery && (
            <div className="news-container mb-12">
              <NewsSlider items={news.slice(0, 5)} lang={lang} />
            </div>
          )}

          <Routes>
            <Route path="/" element={
              <div className="news-container">
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="lg:w-[70%]">
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
