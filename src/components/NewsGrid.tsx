import React from 'react';
import { NEWS_DATA } from '../constants';
import { NewsCard } from './NewsCard';
import { ChevronRight } from 'lucide-react';

export function NewsGrid() {
  const localNews = NEWS_DATA.filter(n => n.category === 'patnos').slice(0, 3);
  const generalNews = NEWS_DATA.filter(n => n.category === 'general').slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-24">
      {/* Local News Section */}
      <section className="flex flex-col gap-10">
        <div className="flex justify-between items-end border-b-2 border-brand-accent pb-2">
          <h2 className="text-3xl font-anton uppercase tracking-tight text-brand-primary">Haftanın Panoraması</h2>
          <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:text-brand-accent transition-colors">
            TÜMÜ <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {localNews.map(news => (
            <NewsCard key={news.id} item={news} lang="tr" />
          ))}
        </div>
      </section>

      {/* Row with two sections */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-16">
        <section className="flex flex-col gap-8">
          <div className="flex justify-between items-end border-b border-brand-accent/20 pb-2">
            <h2 className="text-2xl font-anton uppercase tracking-tight">Gündemden Başlıklar</h2>
            <button className="text-[9px] font-black uppercase tracking-widest text-brand-accent">Daha Fazla</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {generalNews.map(news => (
              <NewsCard key={news.id} item={news} lang="tr" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
