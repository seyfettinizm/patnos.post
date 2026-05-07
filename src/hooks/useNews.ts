import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { NewsItem, NEWS_DATA } from '../constants';

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetchNews();

    // Real-time subscription
    try {
      if (supabase) {
        const channel = supabase
          .channel('news_changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, () => {
            fetchNews();
          })
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    } catch (e) {
      console.warn('Real-time subscription failed:', e);
    }
  }, []);

  const fetchNews = async () => {
    try {
      if (!supabase || !supabase.auth) {
        setNews(NEWS_DATA);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setNews(data as NewsItem[]);
      } else {
        // Eğer veri tabanı tamamen boşsa ama başarılı çekildiyse boş dizi set et
        // Sadece hata durumunda veya ilk kurulumda NEWS_DATA gösterilmeli
        setNews([]);
      }
    } catch (error) {
      console.error('Supabase fetch error:', error);
      setNews(NEWS_DATA);
    } finally {
      setLoading(false);
    }
  };

  const addNews = async (item: Omit<NewsItem, 'id'>) => {
    try {
      if (!supabase) throw new Error('Supabase not configured');
      
      const payload: any = { ...item, createdAt: new Date().toISOString() };
      
      const { data, error } = await supabase
        .from('news')
        .insert([payload])
        .select();
      
      if (error) {
        // Eğer sütun bulunamadı hatasıysa (42703 veya schema cache hatası)
        if (error.message?.includes('column') || error.code === '42703') {
          console.warn("Detected missing column in DB, retrying without status/isBreaking");
          delete payload.status;
          delete payload.isBreaking;
          delete payload.updatedAt;
          
          const retry = await supabase.from('news').insert([payload]).select();
          if (retry.error) throw retry.error;
          if (retry.data) fetchNews();
          return;
        }
        throw error;
      }
      if (data) fetchNews();
    } catch (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
  };

  const editNews = async (id: string, item: Partial<NewsItem>) => {
    try {
      if (!supabase) throw new Error('Supabase not configured');

      const payload: any = { ...item, updatedAt: new Date().toISOString() };

      const { error } = await supabase
        .from('news')
        .update(payload)
        .eq('id', id);

      if (error) {
        if (error.message?.includes('column') || error.code === '42703') {
          console.warn("Detected missing column in DB update, retrying without optional fields");
          delete payload.status;
          delete payload.isBreaking;
          
          const retry = await supabase.from('news').update(payload).eq('id', id);
          if (retry.error) throw retry.error;
          fetchNews();
          return;
        }
        throw error;
      }
      fetchNews();
    } catch (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
  };

  const removeNews = async (id: string) => {
    // Optimistik güncelleme: Önce arayüzden kaldır
    const previousNews = [...news];
    setNews(current => current.filter(item => item.id !== id));
    
    try {
      if (!supabase) return; // Supabase yoksa sadece yerel silme yeterli

      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) {
        setNews(previousNews); // Hata olursa geri al
        throw error;
      }
    } catch (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }
  };

  return { news, loading, addNews, editNews, removeNews };
};
