import { Metadata } from 'next';
import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import { siteName } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Blog',
  description: `All articles from ${siteName} — independent intelligence on AI-powered cyber threats, privacy defence, and security tooling.`,
};

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <main className="flex-1">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 text-sm mb-4 inline-block">
            ← Home
          </Link>
          <h1 className="text-3xl font-bold text-white">All Articles</h1>
          <p className="mt-2 text-slate-400">{articles.length} articles published</p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {articles.length === 0 ? (
          <p className="text-slate-400">No articles published yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
