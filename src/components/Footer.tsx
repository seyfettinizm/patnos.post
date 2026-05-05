import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-accent text-white mt-16 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16">
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl font-serif font-black uppercase tracking-tighter">
              Gazete<span className="text-brand-primary">Patnos</span>
            </h2>
            <p className="text-sm opacity-60 leading-relaxed italic">
              Patnos'un özgür sesi, doğru tarafsız haberciliğin merkezi. 2024'ten beri bölgenin nabzını tutuyoruz.
            </p>
            <div className="flex gap-4">
              <button className="hover:text-brand-primary transition-colors"><Facebook className="w-5 h-5" /></button>
              <button className="hover:text-brand-primary transition-colors"><Twitter className="w-5 h-5" /></button>
              <button className="hover:text-brand-primary transition-colors"><Instagram className="w-5 h-5" /></button>
              <button className="hover:text-brand-primary transition-colors"><Youtube className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary">Kurumsal</h3>
            <ul className="flex flex-col gap-3 text-sm opacity-80">
              <li><button className="hover:underline">Hakkımızda</button></li>
              <li><button className="hover:underline">Künye</button></li>
              <li><button className="hover:underline">Yayın İlkeleri</button></li>
              <li><button className="hover:underline">Reklam Rezervasyon</button></li>
              <li><button className="hover:underline">KVKK Aydınlatma Metni</button></li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary">Kategoriler</h3>
            <ul className="flex flex-col gap-3 text-sm opacity-80">
              <li><button className="hover:underline">Patnos Yerel</button></li>
              <li><button className="hover:underline">Son Dakika</button></li>
              <li><button className="hover:underline">Spor Haberleri</button></li>
              <li><button className="hover:underline">Siyaset</button></li>
              <li><button className="hover:underline">Ekonomi</button></li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary">İletişim</h3>
            <div className="flex flex-col gap-4 text-sm opacity-80 italic">
              <p>Atatürk Caddesi, No:45, Kat:2</p>
              <p>Patnos, Ağrı</p>
              <p>0 (472) 616 XX XX</p>
              <p>info@gazetepatnos.com</p>
            </div>
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary group">
              WhatsApp İhbar Hattı <Send className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium uppercase tracking-widest opacity-40">
          <p>© 2026 Gazete Patnos. Tüm Hakları Saklıdır.</p>
          <p>Yazılım: AIS Build</p>
        </div>
      </div>
    </footer>
  );
}
