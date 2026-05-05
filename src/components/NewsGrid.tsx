import React from 'react';
import { MOCK_NEWS } from '../data/news';
import { NewsCard } from './NewsCard';
import { ChevronRight } from 'lucide-react';

export function NewsGrid() {
  const localNews = MOCK_NEWS.filter(n => n.category === 'Yerel').slice(0, 3);
  const sportsNews = MOCK_NEWS.filter(n => n.category === 'Spor').slice(0, 3);
  const economyNews = MOCK_NEWS.filter(n => n.category === 'Ekonomi').slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-24">
      {/* Local News Section */}
      <section className="flex flex-col gap-10">
        <div className="flex justify-between items-end border-b-2 border-brand-accent pb-2">
          <h2 className="text-3xl font-serif">Yerel Gündem</h2>
          <button className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:text-brand-primary">
            Tümünü Gör <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {localNews.map(news => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </section>

      {/* Row with two sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <section className="flex flex-col gap-8">
          <div className="flex justify-between items-end border-b border-brand-accent/20 pb-2">
            <h2 className="text-2xl font-serif">Ağrı Spor Haberleri</h2>
            <button className="text-[9px] font-bold uppercase tracking-widest text-brand-primary">Daha Fazla</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sportsNews.map(news => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div className="flex justify-between items-end border-b border-brand-accent/20 pb-2">
            <h2 className="text-2xl font-serif">Bölge Ekonomisi</h2>
            <button className="text-[9px] font-bold uppercase tracking-widest text-brand-primary">Daha Fazla</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {economyNews.map(news => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
