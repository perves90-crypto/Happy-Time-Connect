import { createClient } from '@supabase/supabase-js';

// These are public client-side Supabase values (publishable key, never service_role).
// Vite environment variables can override them for other deployments.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://deenhamzpocowwwpdvdr.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_S8Fl4btNrVApcRB36W-ebg_sy_';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
