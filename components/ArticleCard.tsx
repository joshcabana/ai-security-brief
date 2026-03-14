'use client';

import Link from 'next/link';

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  categoryColor?: string;
  featured?: boolean;
  author?: string;
}

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
  index?: number;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'AI Threats': { bg: 'rgba(248, 81, 73, 0.08)', text: '#f85149', border: 'rgba(248, 81, 73, 0.2)' },
  'Privacy': { bg: 'rgba(0, 180, 255, 0.08)', text: '#00b4ff', border: 'rgba(0, 180, 255, 0.2)' },
  'Endpoint Security': { bg: 'rgba(63, 185, 80, 0.08)', text: '#3fb950', border: 'rgba(63, 185, 80, 0.2)' },
  'Zero Trust': { bg: 'rgba(210, 153, 34, 0.08)', text: '#d29922', border: 'rgba(210, 153, 34, 0.2)' },
  'Deepfakes': { bg: 'rgba(188, 140, 255, 0.08)', text: '#bc8cff', border: 'rgba(188, 140, 255, 0.2)' },
  'Ransomware': { bg: 'rgba(248, 81, 73, 0.08)', text: '#f85149', border: 'rgba(248, 81, 73, 0.2)' },
  'Vulnerability': { bg: 'rgba(210, 153, 34, 0.08)', text: '#d29922', border: 'rgba(210, 153, 34, 0.2)' },
};

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function ArticleCard({ article, variant = 'default', index = 0 }: ArticleCardProps) {
  const colors = categoryColors[article.category] || categoryColors['Privacy'];

  if (variant === 'compact') {
    return (
      <Link href={`/blog/${article.slug}`} className="block group" aria-label={article.title}>
        <article className="flex gap-4 py-4 transition-all duration-200" style={{ borderBottom: '1px solid #21262d' }}>
          <span className="flex-shrink-0 text-2xl font-mono font-bold" style={{ color: '#21262d' }} aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold leading-snug mb-1 transition-colors duration-200" style={{ color: '#e6edf3' }}>
              <span className="group-hover:text-[#00b4ff] transition-colors duration-200">{article.title}</span>
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: '#484f58' }}>{formatDate(article.date)}</span>
              <span className="text-xs" style={{ color: '#484f58' }}>{article.readTime}</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/blog/${article.slug}`} className="block group h-full" aria-label={article.title}>
        <article
          className="relative h-full p-8 rounded-xl transition-all duration-300 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #161b22 0%, #1a2030 100%)', border: '1px solid #30363d' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,180,255,0.4)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,180,255,0.15)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = '#30363d';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10" style={{ background: 'radial-gradient(circle at top right, #00b4ff, transparent)', pointerEvents: 'none' }} aria-hidden="true" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded" style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>{article.category}</span>
              {article.featured && (
                <span className="text-xs font-mono font-semibold px-2 py-1 rounded" style={{ background: 'rgba(0,180,255,0.1)', color: '#00b4ff', border: '1px solid rgba(0,180,255,0.2)' }}>FEATURED</span>
              )}
            </div>
            <h3 className="text-xl font-bold mb-3 leading-snug transition-colors duration-200" style={{ color: '#e6edf3' }}>
              <span className="group-hover:text-[#00b4ff] transition-colors duration-200">{article.title}</span>
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#8b949e' }}>{article.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: '#484f58' }}>{formatDate(article.date)}</span>
                <span className="text-xs" style={{ color: '#484f58' }}>{article.readTime}</span>
              </div>
              <span className="text-xs font-medium" style={{ color: '#00b4ff' }}>Read article →</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${article.slug}`} className="block group h-full" aria-label={article.title}>
      <article
        className="h-full p-6 rounded-xl transition-all duration-300"
        style={{ background: '#161b22', border: '1px solid #21262d' }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,180,255,0.3)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = '#21262d';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded" style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>{article.category}</span>
        </div>
        <h3 className="font-bold mb-2 leading-snug" style={{ color: '#e6edf3', fontSize: '0.9375rem' }}>
          <span className="group-hover:text-[#00b4ff] transition-colors duration-200">{article.title}</span>
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#8b949e', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.excerpt}</p>
        <div className="flex items-center gap-3 mt-auto">
          <span className="text-xs" style={{ color: '#484f58' }}>{formatDate(article.date)}</span>
          <span className="text-xs" style={{ color: '#484f58' }}>{article.readTime}</span>
        </div>
      </article>
    </Link>
  );
}
