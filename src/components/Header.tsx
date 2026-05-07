import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Clock, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MOCK_NEWS } from '../data/news';

const CATEGORIES = ['Gündem', 'Yerel', 'Siyaset', 'Spor', 'Ekonomi', 'Kültür'];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="border-b-2 border-brand-accent sticky top-0 bg-brand-paper z-50">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-2 flex justify-between items-center text-[11px] font-medium uppercase tracking-wider border-b border-brand-accent/5">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {today}</span>
          <span className="hidden sm:inline text-brand-primary font-bold">Patnos Basın İlan Kurumu Üyesidir</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="hover:text-brand-primary transition-colors">E-Gazete</button>
          <button className="hover:text-brand-primary transition-colors">Künye</button>
          <button className="hover:text-brand-primary transition-colors">İletişim</button>
        </div>
      </div>

      {/* Main Logo Section */}
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <Link to="/" className="flex flex-col items-center group">
          <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tighter uppercase leading-none group-hover:scale-[1.02] transition-transform">
            Gazete<span className="text-brand-primary">Patnos</span>
          </h1>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase mt-1 opacity-60">Doğru, Tarafsız, İlkeli Habercilik</p>
        </Link>
        
        <div className="hidden lg:block w-1/2 h-20 bg-brand-accent/5 border border-brand-accent/10 flex items-center justify-center relative overflow-hidden group">
           <div className="text-[10px] font-bold uppercase tracking-widest opacity-30 group-hover:opacity-100 transition-opacity">Reklam Alanı - 728x90</div>
        </div>

        <button className="p-2 hover:bg-brand-accent hover:text-white transition-colors border border-brand-accent/10">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Breaking Ticker */}
      {/* (Ticker logic removed to fix lint as this component is not actively used)
        <div className="bg-brand-accent text-white py-1.5 overflow-hidden whitespace-nowrap">
          <div className="container mx-auto px-4 flex items-center gap-4">
            <span className="text-[10px] bg-brand-primary px-2 py-0.5 font-bold uppercase">Son Dakika</span>
            <div className="flex animate-marquee group">
              {breakingNews.concat(breakingNews).map((news, i) => (
                <Link key={i} to={`/news/${news.id}`} className="hover:underline mr-12 text-sm font-medium">
                  {news.title.tr}
                </Link>
              ))}
            </div>
          </div>
        </div>
      */}
 
       {/* Navigation */}
      <nav className="border-t border-brand-accent/10 relative">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="hidden md:flex items-center grow">
            <Link 
              to="/" 
              className={cn(
                "px-4 py-4 text-sm font-bold uppercase tracking-tight border-r border-brand-accent/10 hover-invert",
                location.pathname === '/' && "bg-brand-accent text-white"
              )}
            >
              Anasayfa
            </Link>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                className="px-4 py-4 text-sm font-bold uppercase tracking-tight border-r border-brand-accent/10 hover-invert"
              >
                {cat}
              </button>
            ))}
          </div>

          <button 
            className="md:hidden p-4 text-brand-accent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-full left-0 w-full bg-brand-paper border-b-2 border-brand-accent z-40 md:hidden overflow-hidden"
            >
              <div className="flex flex-col">
                <Link to="/" className="p-4 border-b border-brand-accent/5 font-bold uppercase" onClick={() => setIsMenuOpen(false)}>Anasayfa</Link>
                {CATEGORIES.map(cat => (
                  <button key={cat} className="p-4 border-b border-brand-accent/5 font-bold uppercase text-left">{cat}</button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
