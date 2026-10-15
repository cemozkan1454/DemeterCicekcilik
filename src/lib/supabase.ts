import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const rememberKey = 'demeter-remember-session';
export function rememberSession(remember: boolean) {
  if (remember) localStorage.setItem(rememberKey, 'yes');
  else localStorage.removeItem(rememberKey);
}
const sessionStorageAdapter = {
  getItem(key: string) {
    if (localStorage.getItem(rememberKey) === 'yes') return localStorage.getItem(key);
    localStorage.removeItem(key);
    return sessionStorage.getItem(key);
  },
  setItem(key: string, value: string) {
    sessionStorage.setItem(key, value);
    if (localStorage.getItem(rememberKey) === 'yes') localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  },
  removeItem(key: string) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
};

function createSupabaseClient() {
  if (!url || !publishableKey) return null;
  try {
    new URL(url);
    return createClient(url.trim(), publishableKey.trim(), {
      auth: { persistSession: true, storage: sessionStorageAdapter, autoRefreshToken: true, detectSessionInUrl: true },
    });
  } catch (error) {
    console.error('Supabase bağlantısı başlatılamadı:', error);
    return null;
  }
}

export const supabase = createSupabaseClient();
export const supabaseConfigured = Boolean(supabase);
