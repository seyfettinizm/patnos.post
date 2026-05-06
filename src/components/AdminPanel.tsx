import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Plus, Edit2, Trash2, Save, Image as ImageIcon, 
  Video, Upload, Loader2, Languages, Import, 
  FileText, LogOut, Settings, Key, ArrowLeft,
  Search, Globe, Trash, Check
} from 'lucide-react';
import { NewsItem, CATEGORIES, Language, UI_STRINGS, HeaderSettings } from '../constants';
import { useNews } from '../hooks/useNews';
import { useSettings } from '../hooks/useSettings';
import { translateContent } from '../services/geminiService';

interface AdminPanelProps {
  onClose: () => void;
  onLogout: () => void;
  lang: Language;
}

export const AdminPanel = ({ onClose, onLogout, lang }: AdminPanelProps) => {
  const { news, addNews, editNews, removeNews } = useNews();
  const { settings, updateSettings } = useSettings();
  
  const [activeTab, setActiveTab] = useState<'news' | 'settings'>('news');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Initialize formData with correct structure to prevent spread errors
  const [formData, setFormData] = useState<Partial<NewsItem>>({
    title: { tr: '', ku: '' },
    excerpt: { tr: '', ku: '' },
    content: { tr: '', ku: '' },
    category: 'general',
    imageUrl: '',
    status: 'published'
  });
  
  const [activeLangTab, setActiveLangTab] = useState<Language>('tr');
  const [isUploading, setIsUploading] = useState(false);
  const [isTranslatingAll, setIsTranslatingAll] = useState(false);
  const [isAutoTranslating, setIsAutoTranslating] = useState<string | null>(null);
  
  const [showKeySettings, setShowKeySettings] = useState(false);
  const [manualApiKey, setManualApiKey] = useState(localStorage.getItem('GEMINI_API_KEY_OVERRIDE') || '');
  
  const [importMode, setImportMode] = useState(false);
  const [importXml, setImportXml] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const contentFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const leftHeaderInputRef = useRef<HTMLInputElement>(null);
  const rightHeaderInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);

  const t = UI_STRINGS[lang];

  // Helper safely getting toUpperCase
  const safeLang = (activeLangTab || 'tr').toUpperCase();
  const displayLang = safeLang;

  const resetForm = () => {
    setFormData({
      title: { tr: '', ku: '' },
      excerpt: { tr: '', ku: '' },
      content: { tr: '', ku: '' },
      category: 'general',
      imageUrl: '',
      status: 'published'
    });
    setEditingId(null);
    setIsAdding(false);
    setActiveLangTab('tr');
  };

  const startEditing = (item: NewsItem) => {
    setFormData({
      ...item,
      title: item.title || { tr: '', ku: '' },
      excerpt: item.excerpt || { tr: '', ku: '' },
      content: item.content || { tr: '', ku: '' },
      status: item.status || 'published'
    });
    setEditingId(item.id);
    setIsAdding(true);
  };

  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = (text || '').trim().split(/\s+/).length || 0;
    const minutes = Math.ceil(words / wordsPerMinute) || 1;
    return `${minutes} ${lang === 'tr' ? 'DK' : 'DEQ'}`;
  };

  const handleSave = async () => {
    if (!formData.title?.tr || !formData.category || !formData.imageUrl) {
      alert(lang === 'tr' ? 'Lütfen zorunlu alanları doldurun (Başlık TR, Kategori, Görsel)' : 'Ji kerema xwe qadên mecbûrî dagirin');
      return;
    }

    try {
      const itemToSave = {
        ...formData,
        status: formData.status || 'published',
        readTime: calculateReadTime(formData.content?.[activeLangTab] || ''),
        updatedAt: new Date().toISOString(),
        date: formData.date || new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
      } as NewsItem;

      if (editingId) {
        await editNews(editingId, itemToSave);
      } else {
        await addNews(itemToSave as Omit<NewsItem, 'id'>);
      }
      resetForm();
    } catch (error) {
      alert(lang === 'tr' ? 'Kaydetme hatası' : 'Çewtiya tomarkirinê');
    }
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await removeNews(id);
      setDeleteConfirmId(null);
    } catch (error) {
      alert(lang === 'tr' ? 'Silme hatası' : 'Çewtiya jêbirinê');
    }
  };

  const autoTranslateField = async (field: 'title' | 'excerpt' | 'content') => {
    const sourceLang: Language = activeLangTab === 'tr' ? 'ku' : 'tr';
    const targetLang: Language = activeLangTab;
    const sourceText = (formData[field] as any)?.[sourceLang];

    if (!sourceText) {
      alert(lang === 'tr' ? `Önce ${sourceLang === 'tr' ? 'Kürtçe' : 'Türkçe'} içeriği doldurmalısınız.` : `Berê divê hûn naveroka ${sourceLang === 'tr' ? 'Kurdî' : 'Tirkî'} dagirin.`);
      return;
    }

    setIsAutoTranslating(field);
    try {
      const translated = await translateContent(sourceText, targetLang);
      setFormData(prev => ({
        ...prev,
        [field]: { ...(prev[field] || {}), [targetLang]: translated } as any
      }));
    } catch (error: any) {
      alert(lang === 'tr' ? 'Çeviri hatası. Lütfen API anahtarını kontrol edin.' : 'Çewtiya wergerê. Ji kerema xwe mifteya API kontrol bikin.');
    } finally {
      setIsAutoTranslating(null);
    }
  };

  const translateAll = async () => {
    const sourceLang: Language = activeLangTab;
    const targetLang: Language = activeLangTab === 'tr' ? 'ku' : 'tr';
    
    if (!formData.title?.[sourceLang]) {
      alert(lang === 'tr' ? "Lütfen en azından başlığı doldurun." : "Ji kerema xwe bi kêmanî sernavê dagirin.");
      return;
    }

    setIsTranslatingAll(true);
    try {
      const fields: ('title' | 'excerpt' | 'content')[] = ['title', 'excerpt', 'content'];
      for (const field of fields) {
        const text = (formData[field] as any)?.[sourceLang];
        if (text) {
          const translated = await translateContent(text, targetLang);
          setFormData(prev => ({
            ...prev,
            [field]: { ...(prev[field] || {}), [targetLang]: translated } as any
          }));
        }
      }
      setActiveLangTab(targetLang);
    } catch (error) {
      alert(lang === 'tr' ? 'Otomatik çeviri hatası' : 'Çewtiya wergera bixweber');
    } finally {
      setIsTranslatingAll(false);
    }
  };

  const handleVideoAdd = () => {
    const url = prompt(lang === 'tr' ? 'Video URL (YouTube veya direkt link):' : 'URL-ya Vîdyoyê (YouTube an lînka rasterast):');
    if (!url) return;

    const videoTag = `\n\n[VIDEO:${url}]\n\n`;
    const currentContent = formData.content?.[activeLangTab] || '';

    if (contentInputRef.current) {
      const start = contentInputRef.current.selectionStart;
      const end = contentInputRef.current.selectionEnd;
      const newContent = currentContent.substring(0, start) + videoTag + currentContent.substring(end);
      setFormData(prev => ({
        ...prev,
        content: { ...prev.content, [activeLangTab]: newContent } as any
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        content: { ...prev.content, [activeLangTab]: currentContent + videoTag } as any
      }));
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, target: 'main' | 'content' | 'video' | 'header-left' | 'header-right') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const url = data.url;

      if (target === 'header-left' || target === 'header-right') {
        const field = target === 'header-left' ? 'leftImageUrl' : 'rightImageUrl';
        await updateSettings({ ...settings, [field]: url });
      } else if (target === 'main') {
        setFormData(prev => ({ ...prev, imageUrl: url }));
      } else if (target === 'video') {
        const tag = `\n\n[VIDEO:${url}]\n\n`;
        const currentContent = formData.content?.[activeLangTab] || '';
        
        if (contentInputRef.current) {
          const start = contentInputRef.current.selectionStart;
          const end = contentInputRef.current.selectionEnd;
          const newContent = currentContent.substring(0, start) + tag + currentContent.substring(end);
          setFormData(prev => ({
            ...prev,
            content: { ...prev.content, [activeLangTab]: newContent } as any
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            content: { ...prev.content, [activeLangTab]: currentContent + tag } as any
          }));
        }
      } else {
        const tag = `\n\n[IMAGE:${url}]\n\n`;
        const currentContent = formData.content?.[activeLangTab] || '';
        
        if (contentInputRef.current) {
          const start = contentInputRef.current.selectionStart;
          const end = contentInputRef.current.selectionEnd;
          const newContent = currentContent.substring(0, start) + tag + currentContent.substring(end);
          setFormData(prev => ({
            ...prev,
            content: { ...prev.content, [activeLangTab]: newContent } as any
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            content: { ...prev.content, [activeLangTab]: currentContent + tag } as any
          }));
        }
      }
    } catch (error) {
      alert(lang === 'tr' ? 'Yükleme hatası' : 'Çewtiya barkirinê');
    } finally {
      setIsUploading(false);
    }
  };

  const handleWixImport = async () => {
    if (!importXml.trim()) return;
    setIsImporting(true);
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(importXml, "text/xml");
      const items = Array.from(xmlDoc.querySelectorAll("item"));
      
      for (const item of items) {
        const titleTr = item.querySelector("title")?.textContent || "";
        const contentTr = item.querySelector("description")?.textContent || "";
        const imageUrl = item.querySelector("enclosure")?.getAttribute("url") || "https://picsum.photos/800/600";
        
        const titleKu = await translateContent(titleTr, 'ku');
        const contentKu = await translateContent(contentTr, 'ku');
        
        await addNews({
          title: { tr: titleTr, ku: titleKu },
          content: { tr: contentTr, ku: contentKu },
          excerpt: { tr: contentTr.substring(0, 150), ku: contentKu.substring(0, 150) },
          imageUrl,
          category: 'general',
          date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
          author: 'Wix Import',
          readTime: calculateReadTime(contentTr),
          status: 'published'
        });
        
        await new Promise(r => setTimeout(r, 1000));
      }
      alert(lang === 'tr' ? 'Aktarma tamamlandı' : 'Import qediya');
      setImportMode(false);
      setImportXml('');
    } catch (error) {
      alert('Import error');
    } finally {
      setIsImporting(false);
    }
  };

  const saveApiKey = () => {
    localStorage.setItem('GEMINI_API_KEY_OVERRIDE', manualApiKey);
    setShowKeySettings(false);
    alert('API Anahtarı kaydedildi.');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-0 md:p-6 overflow-hidden">
      <div className="bg-white w-full max-w-7xl h-full md:h-[95vh] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        
        {/* PANEL HEADER */}
        <div className="bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                <Settings className="text-brand-accent" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {t.adminPanel}
              </h2>
            </div>
            
            <div className="hidden md:flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
              <button 
                onClick={() => { setActiveTab('news'); setImportMode(false); setIsAdding(false); }}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'news' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                HABERLER
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'settings' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                AYARLAR
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowKeySettings(!showKeySettings)}
              className="p-3 text-gray-400 hover:text-brand-accent hover:bg-gray-50 rounded-xl transition-all"
              title="API Anahtarı"
            >
              <Key size={20} />
            </button>
            <div className="w-px h-8 bg-gray-100" />
            <button 
              onClick={onLogout}
              className="group flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-xs"
            >
              <LogOut size={18} className="group-hover:rotate-12 transition-transform" /> 
              <span>ÇIKIŞ YAP</span>
            </button>
            <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-all">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* MAIN SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 relative">
          
          {/* API Key Modal Overlay */}
          <AnimatePresence>
            {showKeySettings && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-start justify-center p-8"
              >
                <motion.div 
                  initial={{ y: -20 }} animate={{ y: 0 }} exit={{ y: -20 }}
                  className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xl border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                      <Key className="text-amber-500" /> Gemini AI API Key
                    </h3>
                    <button onClick={() => setShowKeySettings(false)}><X size={20} /></button>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Otomatik çeviri özelliği için Gemini API anahtarınızı buraya girin.</p>
                  <div className="flex gap-3">
                    <input 
                      type="password"
                      value={manualApiKey}
                      onChange={e => setManualApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent font-mono"
                    />
                    <button onClick={saveApiKey} className="px-6 py-3 bg-brand-accent text-white rounded-xl font-bold hover:brightness-110 shadow-lg shadow-brand-accent/20">
                      Kaydet
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-4 md:p-8">
            {activeTab === 'news' ? (
              <>
                {isAdding ? (
                  /* --- FORM GÖRÜNÜMÜ --- */
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
                    {/* Form Header / Toolbar */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-0 z-10">
                      <div className="flex items-center gap-4">
                        <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500">
                          <ArrowLeft size={24} />
                        </button>
                        <h3 className="text-xl font-bold text-gray-900">
                          {editingId ? "Haberi Düzenle" : "Yeni Haber"}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                          <button 
                            onClick={() => setActiveLangTab('tr')}
                            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeLangTab === 'tr' ? 'bg-white text-brand-primary shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                          >
                            TÜRKÇE
                          </button>
                          <button 
                            onClick={() => setActiveLangTab('ku')}
                            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeLangTab === 'ku' ? 'bg-white text-brand-primary shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                          >
                            KURDÎ
                          </button>
                        </div>
                        
                        <button 
                          onClick={translateAll}
                          disabled={isTranslatingAll}
                          className="flex items-center gap-2 px-6 py-2.5 bg-brand-accent text-white rounded-xl text-xs font-bold hover:brightness-110 disabled:opacity-50 shadow-lg shadow-brand-accent/30"
                        >
                          {isTranslatingAll ? <Loader2 className="animate-spin" size={16} /> : <Languages size={16} />}
                          TÜMÜNÜ ÇEVİR
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Sol Taraf: İçerik */}
                      <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
                          <div className="space-y-8">
                            {/* Başlık */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                  {t.title} ({displayLang})
                                </label>
                                <button onClick={() => autoTranslateField('title')} className="text-xs text-brand-accent font-bold flex items-center gap-1 hover:underline">
                                  {isAutoTranslating === 'title' ? <Loader2 className="animate-spin" size={12}/> : <Languages size={12}/>} AI Çevir
                                </button>
                              </div>
                              <input 
                                type="text"
                                value={formData.title?.[activeLangTab] || ''}
                                onChange={e => setFormData({ ...formData, title: { ...(formData.title || {}), [activeLangTab]: e.target.value } as any })}
                                className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-brand-accent focus:bg-white outline-none transition-all text-xl font-bold"
                                placeholder="Manşet başlığını yazın..."
                              />
                            </div>

                            {/* Özet */}
                            <div>
                               <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.excerpt}</label>
                                <button onClick={() => autoTranslateField('excerpt')} className="text-xs text-brand-accent font-bold flex items-center gap-1 hover:underline">
                                  {isAutoTranslating === 'excerpt' ? <Loader2 className="animate-spin" size={12}/> : <Languages size={12}/>} AI Çevir
                                </button>
                              </div>
                              <textarea 
                                value={formData.excerpt?.[activeLangTab] || ''}
                                onChange={e => setFormData({ ...formData, excerpt: { ...(formData.excerpt || {}), [activeLangTab]: e.target.value } as any })}
                                className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-brand-accent focus:bg-white outline-none h-24 resize-none text-sm"
                                placeholder="Haberin kısa özeti..."
                              />
                            </div>

                            {/* İçerik */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.content}</label>
                                <div className="flex gap-4">
                                  <button onClick={() => autoTranslateField('content')} className="text-xs text-brand-accent font-bold flex items-center gap-1 hover:underline">
                                    {isAutoTranslating === 'content' ? <Loader2 className="animate-spin" size={12}/> : <Languages size={12}/>} AI Çevir
                                  </button>
                                  <button onClick={() => contentFileInputRef.current?.click()} className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline">
                                    <ImageIcon size={12}/> Resim Ekle
                                  </button>
                                  <input 
                                    type="file" 
                                    ref={contentFileInputRef} 
                                    onChange={e => handleImageUpload(e, 'content')} 
                                    className="hidden" 
                                    accept="image/*" 
                                  />
                                  <button onClick={handleVideoAdd} className="text-xs text-orange-600 font-bold flex items-center gap-1 hover:underline">
                                    <Video size={12}/> Video URL
                                  </button>
                                  <button onClick={() => videoFileInputRef.current?.click()} className="text-xs text-purple-600 font-bold flex items-center gap-1 hover:underline">
                                    <Upload size={12}/> Video Yükle
                                  </button>
                                  <input 
                                    type="file" 
                                    ref={videoFileInputRef} 
                                    onChange={e => handleImageUpload(e, 'video')} 
                                    className="hidden" 
                                    accept="video/*" 
                                  />
                                </div>
                              </div>
                              <textarea 
                                ref={contentInputRef}
                                value={formData.content?.[activeLangTab] || ''}
                                onChange={e => setFormData({ ...formData, content: { ...(formData.content || {}), [activeLangTab]: e.target.value } as any })}
                                className="w-full px-8 py-8 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-brand-accent focus:bg-white outline-none h-[600px] font-serif text-lg leading-relaxed"
                                placeholder="Haberi buraya yazın..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sağ Taraf: Ayarlar */}
                      <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                          {/* Ana Görsel */}
                          <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">GÖRSEL</label>
                            <div 
                              onClick={() => mainFileInputRef.current?.click()}
                              className="aspect-video w-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-brand-accent cursor-pointer transition-all overflow-hidden relative group"
                            >
                              {formData.imageUrl ? (
                                <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                                  <Upload size={32} />
                                  <span className="text-[10px] font-bold mt-2">RESİM YÜKLE</span>
                                </div>
                              )}
                              {isUploading && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                  <Loader2 className="animate-spin text-brand-primary" />
                                </div>
                              )}
                            </div>
                            <input type="file" ref={mainFileInputRef} onChange={e => handleImageUpload(e, 'main')} className="hidden" accept="image/*" />
                            <input 
                              type="text" 
                              value={formData.imageUrl || ''}
                              onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                              placeholder="Veya URL yapıştırın..."
                              className="w-full mt-2 px-4 py-2 text-xs rounded-lg bg-gray-50 border border-gray-100 outline-none"
                            />
                          </div>

                          {/* Kategori */}
                          <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 font-anton">{t.category}</label>
                            <select 
                              value={formData.category || 'general'}
                              onChange={e => setFormData({...formData, category: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-brand-accent font-bold text-gray-700"
                            >
                              {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat[lang]}</option>
                              ))}
                            </select>
                          </div>

                          {/* Durum */}
                          <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 font-anton">YAYIN DURUMU</label>
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                              <button 
                                onClick={() => setFormData({...formData, status: 'published'})}
                                className={`flex-1 py-3 rounded-lg text-[10px] font-bold transition-all ${formData.status !== 'draft' ? 'bg-green-600 text-white shadow-md' : 'text-gray-400'}`}
                              >
                                {t.published.toUpperCase()}
                              </button>
                              <button 
                                onClick={() => setFormData({...formData, status: 'draft'})}
                                className={`flex-1 py-3 rounded-lg text-[10px] font-bold transition-all ${formData.status === 'draft' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-400'}`}
                              >
                                {t.draft.toUpperCase()}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Kaydet Butonu */}
                        <div className="sticky bottom-4">
                          <button 
                            onClick={handleSave}
                            className="w-full bg-brand-primary text-white py-6 rounded-2xl font-black text-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-brand-primary/40 group overflow-hidden"
                          >
                            <Save size={24} className="group-hover:scale-125 transition-transform" />
                            KAYDET VE YAYINLA
                          </button>
                          <p className="text-center text-[10px] text-gray-400 font-bold mt-4 uppercase tracking-widest">Tüm değişiklikler anında kaydedilir</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : importMode ? (
                  /* --- İÇE AKTARIM --- */
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto py-12">
                     <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center">
                        <Import className="mx-auto text-brand-accent mb-6" size={48} />
                        <h3 className="text-2xl font-bold mb-4">Wix RSS İçe Aktar</h3>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                          Wix sitenizdeki XML içeriğini buraya yapıştırın. <br/>Tüm haberleriniz AI tarafından otomatik olarak Kürtçeye çevrilip sisteme eklenecektir.
                        </p>
                        <textarea 
                          value={importXml}
                          onChange={e => setImportXml(e.target.value)}
                          className="w-full h-64 p-4 rounded-xl border border-gray-200 bg-gray-50 font-mono text-xs mb-6 outline-none focus:ring-2 focus:ring-brand-accent/20"
                          placeholder="XML kodunu buraya yapıştırın..."
                        />
                        <div className="flex gap-4">
                          <button 
                            onClick={() => setImportMode(false)}
                            className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-all"
                          >
                            VAZGEÇ
                          </button>
                          <button 
                            onClick={handleWixImport}
                            disabled={isImporting || !importXml}
                            className="flex-[2] py-4 bg-brand-accent text-white rounded-xl font-bold hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                          >
                            {isImporting ? <Loader2 className="animate-spin" /> : <Check />}
                            AKTARMALI BAŞLAT
                          </button>
                        </div>
                     </div>
                  </motion.div>
                ) : (
                  /* --- LİSTE GÖRÜNÜMÜ --- */
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-0 z-10">
                      <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-bold text-gray-900 leading-none">Haberler</h3>
                        <span className="px-3 py-1 bg-brand-accent/10 text-brand-accent rounded-full text-xs font-black uppercase tracking-widest">{news.length}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <button 
                          onClick={() => setImportMode(true)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold text-xs hover:bg-gray-50 transition-all shadow-sm"
                        >
                          <Import size={16} /> Wix'ten Aktar
                        </button>
                        <button 
                          onClick={() => setIsAdding(true)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-brand-accent text-white rounded-xl font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand-accent/20"
                        >
                          <Plus size={20} /> YENİ EKLE
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {news.map(item => (
                        <motion.div 
                          layout
                          key={item.id} 
                          className="bg-white p-4 md:rounded-2xl rounded-xl flex items-center gap-4 md:gap-6 hover:shadow-lg transition-all border border-gray-100 group"
                        >
                          <div className="relative w-20 h-20 md:w-28 md:h-28 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                            <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt="" />
                            {item.status === 'draft' && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-white px-2 py-0.5 border border-white/30 rounded uppercase tracking-tighter">TASLAK</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">
                                {(CATEGORIES.find(c => c.id === item.category)?.[lang] || item.category)}
                              </span>
                              <div className="w-1 h-1 bg-gray-300 rounded-full" />
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.date}</span>
                            </div>
                            <h4 className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors md:text-lg text-sm line-clamp-2">
                              {item.title?.[lang] || item.title?.['tr'] || 'Başlıksız'}
                            </h4>
                          </div>

                          <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100 relative z-[100]">
                            <button 
                              type="button"
                              onClick={(e) => { 
                                e.preventDefault();
                                e.stopPropagation(); 
                                startEditing(item); 
                              }} 
                              className="p-3 md:p-4 text-blue-600 hover:bg-white hover:shadow-sm rounded-lg transition-all active:scale-95 cursor-pointer"
                              title="Düzenle"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              type="button"
                              onClick={(e) => { 
                                e.preventDefault();
                                e.stopPropagation(); 
                                setDeleteConfirmId(item.id); 
                              }} 
                              className="p-3 md:p-4 text-red-600 hover:bg-white hover:shadow-sm rounded-lg transition-all active:scale-95 cursor-pointer"
                              title="Sil"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <AnimatePresence>
                            {deleteConfirmId === item.id && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 rounded-3xl z-[150] border-2 border-red-100"
                              >
                                <p className="text-xs font-black uppercase tracking-widest text-red-600 mb-4 text-center">
                                  {t.deleteConfirm}
                                </p>
                                <div className="flex gap-4">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                    className="px-6 py-2 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95"
                                  >
                                    {lang === 'tr' ? 'EVET, SİL' : 'ERÊ, JÊBIBE'}
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                                    className="px-6 py-2 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 active:scale-95"
                                  >
                                    {lang === 'tr' ? 'İPTAL' : 'BETAL KE'}
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                      
                      {news.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                          <ImageIcon size={48} className="mx-auto text-gray-200 mb-4" />
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Kayıtlı haber bulunamadı</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* --- AYARLAR GÖRÜNÜMÜ --- */
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 space-y-12">
                  <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                    <div className="w-12 h-12 bg-brand-primary text-white rounded-2xl flex items-center justify-center">
                      <ImageIcon size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Header Logoları</h3>
                      <p className="text-sm text-gray-500">Sitenin en üstündeki sol ve sağ logoları buradan değiştirin.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Sol Logo */}
                    <div className="space-y-4">
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">SOL LOGO</label>
                      <div 
                        onClick={() => leftHeaderInputRef.current?.click()}
                        className="aspect-video w-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-brand-accent hover:bg-white transition-all overflow-hidden relative group"
                      >
                        {settings.leftImageUrl ? (
                          <img src={settings.leftImageUrl} className="w-full h-full object-contain p-6" alt="Left" />
                        ) : (
                          <div className="text-center text-gray-300">
                            <Plus size={32} className="mx-auto mb-2" />
                            <span className="text-[10px] font-bold">LOGO EKLE</span>
                          </div>
                        )}
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <Upload className="text-white" size={32} />
                         </div>
                        {isUploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-brand-primary" /></div>}
                      </div>
                      <input type="file" ref={leftHeaderInputRef} onChange={e => handleImageUpload(e, 'header-left')} className="hidden" accept="image/*" />
                    </div>

                    {/* Sağ Logo */}
                    <div className="space-y-4">
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">SAĞ LOGO</label>
                      <div 
                        onClick={() => rightHeaderInputRef.current?.click()}
                        className="aspect-video w-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-brand-accent hover:bg-white transition-all overflow-hidden relative group"
                      >
                        {settings.rightImageUrl ? (
                          <img src={settings.rightImageUrl} className="w-full h-full object-contain p-6" alt="Right" />
                        ) : (
                          <div className="text-center text-gray-300">
                            <Plus size={32} className="mx-auto mb-2" />
                            <span className="text-[10px] font-bold">LOGO EKLE</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <Upload className="text-white" size={32} />
                         </div>
                        {isUploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-brand-primary" /></div>}
                      </div>
                      <input type="file" ref={rightHeaderInputRef} onChange={e => handleImageUpload(e, 'header-right')} className="hidden" accept="image/*" />
                    </div>
                  </div>
                  
                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                    <div className="bg-blue-600 text-white p-3 rounded-xl h-fit">
                      <Globe size={20} />
                    </div>
                    <div className="text-sm text-blue-900 leading-relaxed">
                      <strong>İpucu:</strong> Header logoları için şeffaf arka planlı (PNG) görseller kullanmanız önerilir. Bu sayede logolar menü ile daha uyumlu görünür.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
