import React from 'react';
import { NEWS_DATA } from '../constants';
import { NewsCard } from './NewsCard';

export function Hero() {
  const featuredNews = NEWS_DATA[0];
  const sidebarNews = NEWS_DATA.slice(1, 4);

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <NewsCard item={featuredNews} lang="tr" featured={true} />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 flex flex-col">
          <div className="border-t-4 border-brand-accent pt-2 mb-4 flex justify-between items-end">
            <h2 className="text-base font-bold uppercase tracking-tight">Günün Özeti</h2>
            <span className="text-[10px] font-bold opacity-40 uppercase">Son Güncelleme: 14:32</span>
          </div>
          <div className="flex flex-col gap-6">
            {sidebarNews.map(news => (
               <NewsCard key={news.id} item={news} lang="tr" />
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-brand-primary text-white flex flex-col gap-4 rounded-xl">
            <h3 className="text-lg font-anton uppercase border-b border-white/20 pb-2">Patnos Gündemi</h3>
            <p className="text-xs opacity-60 italic">Bültenimize abone olun, en önemli gelişmeler e-posta kutunuza gelsin.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="E-posta adresi" className="bg-white/10 border border-white/20 px-3 py-2 text-sm grow focus:outline-none focus:bg-white/20 rounded-lg" />
              <button className="bg-brand-accent px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all rounded-lg">Kayıt Ol</button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
