import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function createSupabaseClient() {
  if (!url || !publishableKey) return null;
  try {
    new URL(url);
    return createClient(url.trim(), publishableKey.trim(), {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  } catch (error) {
    console.error('Supabase bağlantısı başlatılamadı:', error);
    return null;
  }
}

export const supabase = createSupabaseClient();
export const supabaseConfigured = Boolean(supabase);
