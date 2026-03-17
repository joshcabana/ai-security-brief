import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import NewsletterForm from '@/components/NewsletterForm';
import { getAllArticles, getArticleCategories } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Newsletter — Weekly AI Threat Intelligence & Security Briefings',
  description:
    'Subscribe to the AI Security Brief newsletter for launch updates, weekly threat intelligence, privacy tool reviews, and cybersecurity analysis.',
};

const benefits = [
  {
    icon: '🎯',
    title: 'Curated Threat Intelligence',
    description:
      'Each issue is built from the same markdown-backed research archive that powers the site, not from a separate demo dataset.',
  },
  {
    icon: '🔧',
    title: 'Tool Reviews & Comparisons',
    description:
      'VPN, password manager, email, and endpoint tooling is reviewed with affiliate disclosures where applicable and clean vendor fallbacks where no approved program exists.',
  },
  {
    icon: '🧠',
    title: 'Threat Actor Analysis',
    description:
      'Agentic AI abuse, prompt injection, and privacy reform stay at the centre of the editorial mix.',
  },
  {
    icon: '⚡',
    title: 'Honest Signup Flow',
    description:
      'The site now reports real Beehiiv success and failure states, so configuration gaps surface immediately.',
  },
  {
    icon: '📊',
    title: 'Manifest-backed Publishing',
    description:
      'Every published article is checked against a content manifest before the build and deploy pipeline passes.',
  },
  {
    icon: '🔒',
    title: 'Human Review Before Publish',
    description:
      'Newsletter drafts land in `/drafts/` first so a person can approve the issue before it reaches Beehiiv readers.',
  },
];

export default async function NewsletterPage() {
  const articles = await getAllArticles();
  const categories = await getArticleCategories();
  const launchArticles = articles.slice(0, 4);

  const stats = [
    { value: String(articles.length), label: 'Launch briefings' },
    { value: String(categories.length), label: 'Editorial tracks' },
    { value: '5', label: 'Automation skills' },
    { value: 'Manual', label: 'Publish approval' },
  ];

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh' }}>
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #080c11, #0d1117)',
          borderBottom: '1px solid #21262d',
          paddingTop: '5rem',
          paddingBottom: '5rem',
        }}
        aria-label="Newsletter hero"
      >
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" aria-hidden="true" />
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,180,255,0.06) 0%, transparent 60%)' }}
          aria-hidden="true"
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono"
              style={{
                background: 'rgba(63,185,80,0.08)',
                border: '1px solid rgba(63,185,80,0.25)',
                color: '#3fb950',
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3fb950' }} aria-hidden="true" />
              <span className="tracking-wider uppercase" style={{ letterSpacing: '0.1em' }}>
                Launch-ready weekly briefings
              </span>
            </div>
          </div>

          <div className="section-label mb-5 justify-center">
            <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest" style={{ color: '#00b4ff' }}>
              Weekly Intelligence
            </span>
          </div>

          <h1 className="text-white mb-6" style={{ letterSpacing: '-0.03em' }}>
            The launch list for <span style={{ color: '#00b4ff' }}>AI-era defenders</span>
          </h1>

          <p className="text-xl leading-relaxed mb-10" style={{ color: '#8b949e' }}>
            Subscribe for launch updates now, then weekly briefings once Beehiiv is connected and the publishing schedule is live.
          </p>

          <div
            className="p-8 rounded-2xl"
            style={{
              background: '#161b22',
              border: '1px solid #30363d',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <h2 className="text-xl font-bold text-white mb-2 text-left">Subscribe free</h2>
            <p className="text-sm text-left mb-6" style={{ color: '#8b949e' }}>
              The form calls the server-side Beehiiv route and shows a real status message either way.
            </p>
            <NewsletterForm
              variant="page"
              placeholder="your@work-email.com"
              buttonText="Subscribe for launch updates"
              source="newsletter-hero"
            />

            <div className="mt-6 pt-5 flex flex-wrap justify-center gap-6" style={{ borderTop: '1px solid #21262d' }}>
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-lg font-black font-mono" style={{ color: '#00b4ff' }}>
                    {stat.value}
                  </div>
                  <div className="text-xs" style={{ color: '#484f58' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-xs" style={{ color: '#484f58' }}>
            Beehiiv credentials live in runtime environment variables. They do not belong in the repository.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ borderBottom: '1px solid #21262d' }} aria-label="Newsletter benefits">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-label mb-3 justify-center">
              <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest" style={{ color: '#00b4ff' }}>
                What you get
              </span>
            </div>
            <h2 className="text-white">Intelligence that earns your inbox</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 rounded-xl"
                style={{ background: '#161b22', border: '1px solid #30363d' }}
              >
                <span className="text-3xl mb-4 block" aria-hidden="true">
                  {benefit.icon}
                </span>
                <h3 className="text-base font-bold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#8b949e' }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" aria-label="Launch article archive">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="section-label mb-3">Launch archive</div>
              <h2 className="text-white">Current briefings</h2>
            </div>
            <Link href="/blog" className="text-sm hidden sm:block" style={{ color: '#484f58' }}>
              See the full archive
            </Link>
          </div>

          <div className="space-y-4">
            {launchArticles.map((article, index) => (
              <ArticleCard key={article.slug} article={article} variant="compact" index={index} />
            ))}
          </div>

          <div
            className="mt-12 p-8 rounded-2xl text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(0,180,255,0.05) 0%, rgba(0,180,255,0.02) 100%)',
              border: '1px solid rgba(0,180,255,0.2)',
            }}
          >
            <h3 className="text-xl font-bold text-white mb-3">Ready for the first approved issue</h3>
            <p className="text-sm mb-6" style={{ color: '#8b949e' }}>
              Newsletter drafts will be assembled from the latest harvest plus the freshest repo-backed articles, then saved in `/drafts/` for review.
            </p>
            <NewsletterForm
              variant="default"
              placeholder="your@email.com"
              buttonText="Subscribe & follow the launch"
              source="newsletter-cta"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
