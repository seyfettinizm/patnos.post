import { createClient } from '@supabase/supabase-js';

const getRuntimeConfig = () => {
  // AI Studio Secrets (Environment Variables) prioritize over localStorage
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envUrl.length > 10 && !envUrl.includes('placeholder')) {
    return { url: envUrl, anonKey: envAnonKey || '' };
  }

  const localUrl = localStorage.getItem('VITE_SUPABASE_URL');
  const localAnonKey = localStorage.getItem('VITE_SUPABASE_ANON_KEY');
  
  return {
    url: localUrl || envUrl || '',
    anonKey: localAnonKey || envAnonKey || ''
  };
};

const config = getRuntimeConfig();

export const supabase = createClient(config.url || 'https://placeholder.supabase.co', config.anonKey || 'placeholder');

export const isSupabaseConfigured = () => {
  const conf = getRuntimeConfig();
  return !!(conf.url && conf.anonKey);
};

export const getSupabaseConfig = () => getRuntimeConfig();
