import { motion } from 'motion/react';
import { X, Calendar, User, Clock, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { NewsItem, CATEGORIES, Language, UI_STRINGS } from '../constants';

interface NewsDetailProps {
  item: NewsItem;
  lang: Language;
  onClose: () => void;
}

export const NewsDetail = ({ item, lang, onClose }: NewsDetailProps) => {
  const sourceLang = lang === 'tr' ? 'ku' : 'tr';
  
  // Safety checks for nested objects
  const title = item.title || { tr: '', ku: '' };
  const excerpt = item.excerpt || { tr: '', ku: '' };
  const content = item.content || { tr: '', ku: '' };

  const displayTitle = title[lang] || title[sourceLang] || '';
  const displayExcerpt = excerpt[lang] || excerpt[sourceLang] || '';
  const displayContent = content[lang] || content[sourceLang] || '';

  const t = UI_STRINGS[lang];
  const category = (Array.isArray(CATEGORIES) ? (CATEGORIES.find(c => c && c.id === item.category)?.[lang] || item.category) : item.category);

  const getShareUrl = () => {
    // Facebook ve diğer platformlar için dil parametresini ekliyoruz.
    // Bu sayede sunucu (api/index.ts) hangi dildeki meta etiketlerini (başlık, açıklama) 
    // göndereceğini bilir.
    return `${window.location.origin}/news/${item.id}?lang=${lang}`;
  };

  const shareUrl = getShareUrl();
  const shareTitle = displayTitle;

  const handleFacebookShare = () => {
    const width = 600;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    // Canonical URL for Facebook - absolute, clean, and includes the lang for the crawler
    const shareLink = `${window.location.origin}${window.location.pathname}?lang=${lang}`;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}&display=popup`;

    try {
      // For mobile devices, try native sharing first if available (works better with apps)
      if (typeof navigator.share !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        navigator.share({
          title: displayTitle,
          text: displayTitle,
          url: shareLink
        }).catch(() => {
          // Fallback to pop-up
          window.open(fbUrl, 'fbShare', `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`);
        });
      } else {
        const win = window.open(
          fbUrl, 
          'fbShare', 
          `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
        );
        if (!win || win.closed || typeof win.closed === 'undefined') {
          window.open(fbUrl, '_blank');
        }
      }
    } catch (e) {
      window.location.href = fbUrl;
    }
  };

  const handleWhatsAppShare = () => {
    const text = `${displayTitle}\n\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleTwitterShare = () => {
    const twUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(twUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert(lang === 'tr' ? 'Bağlantı kopyalandı!' : 'Lînk hat kopîkirin!');
    });
  };

  const handleWebShare = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: displayExcerpt,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleFacebookShare();
    }
  };

  const renderContent = (content: string) => {
    const parts = content.split(/(\[(?:IMAGE|VIDEO):.*?\])/);
    return parts.map((part, index) => {
      const imgMatch = part.match(/\[IMAGE:(.*?)\]/);
      const videoMatch = part.match(/\[VIDEO:(.*?)\]/);

      if (imgMatch) {
        const url = imgMatch[1];
        return (
          <div key={index} className="my-8">
            <img 
              src={url} 
              alt="Haber görseli" 
              className="w-full rounded-2xl shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>
        );
      }

      if (videoMatch) {
        const url = videoMatch[1];
        const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
        
        if (isYouTube) {
          let embedUrl = url;
          if (url.includes('watch?v=')) {
            embedUrl = url.replace('watch?v=', 'embed/');
          } else if (url.includes('youtu.be/')) {
            embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
          }
          
          return (
            <div key={index} className="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        }

        return (
          <div key={index} className="my-8 w-full rounded-2xl overflow-hidden shadow-lg">
            <video 
              src={url} 
              controls 
              className="w-full"
            />
          </div>
        );
      }

      return (
        <p key={index} className="mb-6 whitespace-pre-wrap leading-relaxed text-gray-700">
          {part}
        </p>
      );
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-0 md:p-4"
    >
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-white w-full max-w-4xl h-full md:h-[95vh] md:rounded-3xl overflow-hidden flex flex-col relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all"
        >
          <X size={24} />
        </button>

        <div className="flex-grow overflow-y-auto scroll-smooth">
          <div className="relative h-[40vh] md:h-[50vh] w-full">
            <img 
              src={item.imageUrl} 
              alt={displayTitle} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
              <span className="inline-block px-3 py-1 bg-brand-accent text-white text-[10px] font-bold uppercase tracking-widest rounded mb-4">
                {category}
              </span>
              <h1 className="text-2xl md:text-5xl font-anton leading-[1.2] mb-6 tracking-normal">
                {displayTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-xs text-gray-300 font-medium uppercase tracking-widest">
                <span className="flex items-center gap-2"><User size={14} className="text-brand-accent" /> {item.author}</span>
                <span className="flex items-center gap-2"><Calendar size={14} className="text-brand-accent" /> {item.date}</span>
                <span className="flex items-center gap-2"><Clock size={14} className="text-brand-accent" /> {item.readTime}</span>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
            <div className="text-xl font-medium italic text-gray-500 border-l-4 border-brand-accent pl-6 mb-10 leading-relaxed">
              {displayExcerpt}
            </div>

            <div className="prose prose-lg max-w-none font-sans text-gray-800">
              {renderContent(displayContent)}
            </div>

            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t.share}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={handleFacebookShare}
                    className="p-3 bg-gray-50 hover:bg-[#1877F2] hover:text-white rounded-full transition-all shadow-sm border border-gray-100"
                    title="Facebook"
                  >
                    <Facebook size={20} />
                  </button>
                  <button 
                    onClick={handleWhatsAppShare}
                    className="p-3 bg-gray-50 hover:bg-[#25D366] hover:text-white rounded-full transition-all shadow-sm border border-gray-100"
                    title="WhatsApp"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.319 1.592 5.548 0 10.058-4.51 10.06-10.059.002-2.689-1.047-5.215-2.951-7.121-1.905-1.904-4.432-2.951-7.125-2.952-5.548 0-10.06 4.51-10.063 10.06-.001 2.128.569 4.14 1.645 5.86l-.997 3.635 3.712-.974zm11.455-7.79c-.27-.136-1.597-.788-1.845-.878-.247-.09-.427-.136-.607.136-.18.271-.697.878-.855 1.058-.158.179-.315.203-.585.068-.27-.136-1.14-.42-2.171-1.338-.803-.715-1.344-1.598-1.502-1.868-.158-.271-.017-.417.118-.552.122-.122.27-.315.405-.473.136-.158.18-.271.271-.451.09-.179.044-.339-.022-.472-.067-.136-.607-1.463-.831-2.004-.218-.528-.439-.456-.607-.464-.158-.008-.338-.01-.518-.01-.18 0-.473.067-.72.339-.248.271-.944.924-.944 2.256 0 1.331.968 2.615 1.103 2.801.136.18 1.907 2.911 4.62 4.085.645.278 1.149.444 1.542.569.648.206 1.238.177 1.704.108.519-.077 1.597-.653 1.822-1.284.225-.631.225-1.172.158-1.284-.067-.113-.247-.203-.517-.34z"/>
                    </svg>
                  </button>
                  <button 
                    onClick={handleTwitterShare}
                    className="p-3 bg-gray-50 hover:bg-[#1DA1F2] hover:text-white rounded-full transition-all shadow-sm border border-gray-100"
                    title="X (Twitter)"
                  >
                    <Twitter size={20} />
                  </button>
                  <button 
                    onClick={handleCopyLink}
                    className="p-3 bg-gray-50 hover:bg-brand-accent hover:text-white rounded-full transition-all shadow-sm border border-gray-100"
                    title={lang === 'tr' ? 'Bağlantıyı Kopyala' : 'Lînkê Kopî Bike'}
                  >
                    <LinkIcon size={20} />
                  </button>
                </div>
              </div>
              <button 
                onClick={handleWebShare}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-brand-primary transition-colors"
              >
                <Share2 size={16} /> {t.shareNews}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
