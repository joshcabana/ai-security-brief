import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables — set these in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    );
  }
  console.warn(
    '[Supabase] Missing environment variables. Database features will not work.\n' +
    'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
}

// Singleton client for browser/client components
let _supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables not configured.');
  }

  _supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return _supabase;
}

// Default export for convenience
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// =========================================
// DATABASE TYPES (extend as your schema grows)
// =========================================
export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          category: string;
          published_at: string;
          read_time: string | null;
          author: string | null;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['articles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['articles']['Insert']>;
      };
      subscribers: {
        Row: {
          id: string;
          email: string;
          subscribed_at: string;
          status: 'active' | 'unsubscribed';
          source: string | null;
        };
        Insert: Omit<Database['public']['Tables']['subscribers']['Row'], 'id' | 'subscribed_at'>;
        Update: Partial<Database['public']['Tables']['subscribers']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// =========================================
// HELPER QUERIES
// =========================================

export async function getArticles(limit = 20) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  return supabase
    .from('articles')
    .select('id, title, slug, excerpt, category, published_at, read_time, author, featured')
    .order('published_at', { ascending: false })
    .limit(limit);
}

export async function getArticleBySlug(slug: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  return supabase.from('articles').select('*').eq('slug', slug).single();
}

export async function getFeaturedArticles(limit = 4) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  return supabase
    .from('articles')
    .select('id, title, slug, excerpt, category, published_at, read_time, author, featured')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(limit);
}

export async function addSubscriber(email: string, source = 'website') {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  return supabase
    .from('subscribers')
    .upsert({ email, status: 'active', source }, { onConflict: 'email' })
    .select()
    .single();
}
