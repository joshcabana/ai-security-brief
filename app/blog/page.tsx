import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleCard, { Article } from '@/components/ArticleCard';

export const metadata: Metadata = {
  title: 'Blog — AI Threats, Privacy & Cybersecurity Analysis',
  description:
    'In-depth analysis of AI-powered cyber threats, privacy defence strategies, vulnerability disclosures, and security tool reviews.',
};

// Static article data — replace with Supabase query in production
const allArticles: Article[] = [
  {
    slug: 'llm-prompt-injection-enterprise-risks',
    title: 'LLM Prompt Injection: The Silent Threat Inside Your Enterprise AI Stack',
    excerpt:
      'As organisations rush to embed large language models into internal tooling, attackers are discovering that the same natural language interface that makes AI useful also makes it exploitable. We map the attack surface.',
    date: '2026-03-12',
    readTime: '7 min read',
    category: 'AI Threats',
    featured: true,
    author: 'Editorial Team',
  },
  {
    slug: 'deepfake-voice-ceo-fraud',
    title: 'Deepfake Voice Cloning Fuels $2.1M CEO Fraud Wave Across APAC',
    excerpt:
      'A new wave of business email compromise attacks leverages real-time voice synthesis to impersonate executives, bypassing traditional phishing filters entirely.',
    date: '2026-03-10',
    readTime: '5 min read',
    category: 'Deepfakes',
    featured: false,
    author: 'Editorial Team',
  },
  {
    slug: 'zero-trust-ai-access-controls',
    title: 'Zero Trust in the Age of AI: Why Identity Alone Is No Longer Enough',
    excerpt:
      'Traditional zero-trust architecture assumes humans at both ends. AI agents, autonomous pipelines, and model-to-model calls demand a new threat model — and fast.',
    date: '2026-03-08',
    readTime: '9 min read',
    category: 'Zero Trust',
    featured: false,
    author: 'Editorial Team',
  },
  {
    slug: 'privacy-first-os-2026-comparison',
    title: 'Privacy-First Operating Systems in 2026: A Practical Comparison for Security Teams',
    excerpt:
      'Qubes OS, Tails, and GrapheneOS each offer distinct threat models. We break down which one belongs on your security stack — and why the choice matters more than ever.',
    date: '2026-03-05',
    readTime: '11 min read',
    category: 'Privacy',
    featured: false,
    author: 'Editorial Team',
  },
  {
    slug: 'ai-powered-ransomware-2026',
    title: 'AI-Powered Ransomware: How Machine Learning Is Accelerating Encryption Attacks',
    excerpt:
      'Next-generation ransomware uses ML to identify the most valuable files faster, evade signature detection, and auto-negotiate ransom via LLM chatbots. Here\'s what defenders need to know.',
    date: '2026-03-02',
    readTime: '8 min read',
    category: 'Ransomware',
    featured: false,
    author: 'Editorial Team',
  },
  {
    slug: 'supply-chain-attacks-ai-models',
    title: 'Poisoned Models: Supply Chain Attacks Are Coming for Your AI Infrastructure',
    excerpt:
      'Model poisoning and backdoor injection attacks against open-source AI repositories represent the next evolution of supply chain risk. Practical mitigation strategies for security architects.',
    date: '2026-02-28',
    readTime: '10 min read',
    category: 'AI Threats',
    featured: false,
    author: 'Editorial Team',
  },
  {
    slug: 'encrypted-dns-enterprise-guide',
    title: 'DNS over HTTPS vs DNS over TLS: The Enterprise Guide to Encrypted DNS',
    excerpt:
      'DNS remains one of the most exposed attack surfaces in enterprise networks. A practical guide to encrypting DNS queries, blocking malware domains, and logging for SIEM.',
    date: '2026-02-25',
    readTime: '6 min read',
    category: 'Privacy',
    featured: false,
    author: 'Editorial Team',
  },
  {
    slug: 'critical-cve-patch-tuesday-march-2026',
    title: 'Critical CVE Roundup: March 2026 Patch Tuesday — 4 Zero-Days Actively Exploited',
    excerpt:
      'Microsoft\'s March Patch Tuesday addresses 87 vulnerabilities including four zero-days in Windows NTLM and Azure Active Directory components actively exploited in the wild.',
    date: '2026-02-22',
    readTime: '4 min read',
    category: 'Vulnerability',
    featured: false,
    author: 'Editorial Team',
  },
];

const categories = [
  'All',
  'AI Threats',
  'Privacy',
  'Zero Trust',
  'Ransomware',
  'Deepfakes',
  'Vulnerability',
  'Endpoint Security',
];

interface BlogPageProps {
  searchParams?: Promise<{ category?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const activeCategory = params?.category || 'All';

  const filteredArticles =
    activeCategory === 'All'
      ? allArticles
      : allArticles.filter((a) => a.category === activeCategory);

  const featuredArticle = allArticles.find((a) => a.featured);
  const regularArticles = filteredArticles.filter((a) => !a.featured || activeCategory !== 'All');

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh' }}>
      {/* Page header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #080c11, #0d1117)',
          borderBottom: '1px solid #21262d',
          paddingTop: '3.5rem',
          paddingBottom: '3.5rem',
        }}
      >
        <div
          className="absolute inset-0 bg-grid opacity-40 pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-label mb-3">Intelligence Archive</div>
          <h1 className="text-white mb-4">Threat Intelligence &amp; Analysis</h1>
          <p className="text-lg max-w-2xl" style={{ color: '#8b949e' }}>
            Deep dives into AI-powered attacks, privacy vulnerabilities, and security
            defence strategies. Curated for technical professionals who need signal, not noise.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category filters */}
        <div
          className="flex items-center gap-2 flex-wrap mb-10 pb-8"
          style={{ borderBottom: '1px solid #21262d' }}
          role="navigation"
          aria-label="Filter articles by category"
        >
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <Link
                key={cat}
                href={cat === 'All' ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`}
                className="px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all duration-200"
                style={{
                  background: isActive ? 'rgba(0,180,255,0.12)' : 'rgba(22,27,34,0.8)',
                  border: isActive ? '1px solid rgba(0,180,255,0.4)' : '1px solid #30363d',
                  color: isActive ? '#00b4ff' : '#8b949e',
                }}
                aria-current={isActive ? 'true' : undefined}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Featured article (only on "All" view) */}
        {activeCategory === 'All' && featuredArticle && (
          <div className="mb-10">
            <div className="section-label mb-4">Featured</div>
            <div className="max-w-3xl">
              <ArticleCard article={featuredArticle} variant="featured" index={0} />
            </div>
          </div>
        )}

        {/* Article grid */}
        {regularArticles.length > 0 ? (
          <>
            <div className="section-label mb-6">
              {activeCategory === 'All' ? 'All Articles' : activeCategory}
              <span className="ml-2 text-xs" style={{ color: '#484f58' }}>
                ({regularArticles.length})
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
              {regularArticles.map((article, i) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  variant="default"
                  index={i}
                />
              ))}
            </div>
          </>
        ) : (
          <div
            className="text-center py-20 rounded-xl"
            style={{ background: '#161b22', border: '1px solid #30363d' }}
          >
            <p className="text-lg font-medium text-white mb-2">No articles in this category yet</p>
            <p className="text-sm" style={{ color: '#8b949e' }}>
              Check back soon or{' '}
              <Link href="/blog" style={{ color: '#00b4ff' }}>
                browse all articles
              </Link>
              .
            </p>
          </div>
        )}

        {/* Load more placeholder */}
        {regularArticles.length >= 6 && (
          <div className="mt-12 text-center">
            <button
              className="inline-flex items-center gap-2 px-8 py-3 rounded-md font-semibold text-sm transition-all duration-200"
              style={{
                background: 'transparent',
                border: '1px solid #30363d',
                color: '#8b949e',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00b4ff';
                e.currentTarget.style.color = '#00b4ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#30363d';
                e.currentTarget.style.color = '#8b949e';
              }}
              type="button"
            >
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
