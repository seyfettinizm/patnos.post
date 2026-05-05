import React from 'react';
import { MOCK_NEWS } from '../data/news';
import { NewsCard } from './NewsCard';

export function Hero() {
  const featuredNews = MOCK_NEWS[0];
  const sidebarNews = MOCK_NEWS.slice(1, 5);

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <NewsCard news={featuredNews} variant="large" />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 flex flex-col">
          <div className="border-t-4 border-brand-accent pt-2 mb-4 flex justify-between items-end">
            <h2 className="text-base font-bold uppercase tracking-tight">Günün Özeti</h2>
            <span className="text-[10px] font-bold opacity-40 uppercase">Son Güncelleme: 14:32</span>
          </div>
          <div className="flex flex-col">
            {sidebarNews.map(news => (
               <NewsCard key={news.id} news={news} variant="mini" />
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-brand-accent text-white flex flex-col gap-4">
            <h3 className="text-lg font-serif italic border-b border-white/20 pb-2">Patnos Gündemi</h3>
            <p className="text-xs opacity-80 italic">Haftalık e-posta bültenimize abone olun, en önemli gelişmeler cebinize gelsin.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="E-posta adresi" className="bg-white/10 border border-white/20 px-3 py-2 text-sm grow focus:outline-none focus:bg-white/20" />
              <button className="bg-brand-primary px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:brightness-125 transition-all">Abone Ol</button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
