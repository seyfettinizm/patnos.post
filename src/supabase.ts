import { createClient } from '@supabase/supabase-js';

const getRuntimeConfig = () => {
  const localUrl = localStorage.getItem('VITE_SUPABASE_URL');
  const localAnonKey = localStorage.getItem('VITE_SUPABASE_ANON_KEY');
  
  return {
    url: localUrl || import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: localAnonKey || import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  };
};

const config = getRuntimeConfig();

export const supabase = createClient(config.url || 'https://placeholder.supabase.co', config.anonKey || 'placeholder');

export const isSupabaseConfigured = () => {
  const conf = getRuntimeConfig();
  return !!(conf.url && conf.anonKey);
};

export const getSupabaseConfig = () => getRuntimeConfig();
