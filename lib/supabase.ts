/**
 * lib/supabase.ts
 *
 * The @supabase/supabase-js dependency has been removed from this project.
 * This file is retained as a stub so that any lingering imports compile
 * cleanly while the migration to pure Beehiiv + static MD is completed.
 *
 * If you re-add Supabase later, restore the real client here.
 */

export const supabase = null;

export async function getArticles() {
  return { data: null, error: new Error('Supabase client removed — use lib/content.ts instead') };
}

export async function getArticleBySlug(_slug: string) {
  return { data: null, error: new Error('Supabase client removed — use lib/content.ts instead') };
}

export async function addSubscriber(_email: string) {
  return { data: null, error: new Error('Supabase client removed — use /api/subscribe instead') };
}
