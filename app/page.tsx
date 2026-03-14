import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleCard, { Article } from '@/components/ArticleCard';
import NewsletterForm from '@/components/NewsletterForm';

export const metadata: Metadata = {
  title: 'AI Security Brief — AI Threats, Privacy Tools & Cybersecurity Intelligence',
  description:
    'Independent intelligence on AI-powered cyber threats, privacy defence strategies, and security tools for technology professionals.',
};

// Static sample articles — replace with Supabase query in production
const latestArticles: Article[] = [
  {
    slug: 'llm-prompt-injection-enterprise-risks',
    title: 'LLM Prompt Injection: The Silent Threat Inside Your Enterprise AI Stack',
    excerpt:
      'As organisations rush to embed large language models into internal tooling, attackers are discovering that the same natural language interface that makes AI useful also makes it exploitable.',
    date: '2026-03-12',
    readTime: '7 min read',
    category: 'AI Threats',
    featured: true,
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
  },
];

const stats = [
  { value: '47K+', label: 'Subscribers', mono: true },
  { value: '380+', label: 'Articles Published', mono: true },
  { value: '98%', label: 'Threat Detection Coverage', mono: true },
  { value: '<24h', label: 'Breach-to-Brief Latency', mono: true },
];

const toolCategories = [
  {
    icon: '🛡️',
    name: 'VPN & Network',
    description: 'Encrypt your traffic, hide your IP, bypass surveillance',
    href: '/tools#vpns',
  },
  {
    icon: '🔑',
    name: 'Password Managers',
    description: 'Zero-knowledge vaults for credentials and secrets',
    href: '/tools#password-managers',
  },
  {
    icon: '✉️',
    name: 'Email Security',
    description: 'Encrypted email, alias management, phishing defence',
    href: '/tools#email-security',
  },
  {
    icon: '💻',
    name: 'Endpoint Protection',
    description: 'EDR, threat detection, and device hardening',
    href: '/tools#endpoint-protection',
  },
];

export default function HomePage() {
  return (
    <>
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #0d1117 0%, #0d1117 85%, transparent 100%)',
          paddingTop: '5rem',
          paddingBottom: '5rem',
        }}
        aria-label="Hero"
      >
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" aria-hidden="true" />
        <div
          className="absolute top-0 right-0 w-2/3 h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 0%, rgba(0,180,255,0.07) 0%, transparent 60%)' }}
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-start mb-10">
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-mono"
              style={{ background: 'rgba(248, 81, 73, 0.08)', border: '1px solid rgba(248, 81, 73, 0.25)', color: '#f85149' }}
              role="status"
              aria-label="Current threat level"
            >
              <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: '#f85149' }} aria-hidden="true" />
              <span className="tracking-wider uppercase" style={{ letterSpacing: '0.1em' }}>
                THREAT LEVEL: HIGH — LLM Injection Attacks +340% YoY
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="stagger">
              <div className="section-label mb-6">AI Security Intelligence</div>
              <h1 className="font-black text-white leading-tight mb-6" style={{ letterSpacing: '-0.03em' }}>
                Intelligence on{' '}
                <span style={{ color: '#00b4ff' }}>AI-Powered Threats</span>
                {' '}&amp; Privacy Defence
              </h1>
              <p className="text-lg leading-relaxed mb-10 max-w-xl" style={{ color: '#8b949e' }}>
                The security brief for professionals who need to stay ahead of adversarial AI,
                state-sponsored intrusions, and the privacy erosion that comes with them.
                Weekly intelligence. No noise.
              </p>
              <div className="max-w-xl">
                <NewsletterForm variant="hero" placeholder="your@email.com" buttonText="Get Briefed Free" />
              </div>
              <div className="flex items-center gap-3 mt-6">
                <div className="flex -space-x-2" aria-hidden="true">
                  {['#00b4ff', '#3fb950', '#d29922', '#f85149', '#bc8cff'].map((color, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                      style={{ background: color + '22', borderColor: color, color }}
                    >
                      {['A', 'S', 'T', 'R', 'E'][i]}
                    </div>
                  ))}
                </div>
                <p className="text-sm" style={{ color: '#484f58' }}>
                  <strong style={{ color: '#8b949e' }}>47,000+ security professionals</strong> already subscribed
                </p>
              </div>
            </div>
            <div className="lg:flex justify-end hidden" aria-hidden="true">
              <div className="w-full max-w-sm rounded-xl overflow-hidden" style={{ background: '#161b22', border: '1px solid #30363d', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
                <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid #21262d', background: '#0d1117' }}>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#f85149' }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#d29922' }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#3fb950' }} />
                  </div>
                  <span className="text-xs font-mono ml-2" style={{ color: '#484f58' }}>threat-dashboard.sh</span>
                </div>
                <div className="p-5 font-mono text-xs" style={{ lineHeight: '1.8' }}>
                  <p style={{ color: '#3fb950' }}>$ ./threat-monitor --live</p>
                  <p className="mt-2" style={{ color: '#484f58' }}>Connecting to threat intelligence feeds...</p>
                  <p style={{ color: '#00b4ff' }}>✓ Connected. {new Date().toISOString().split('T')[0]}</p>
                  <div className="mt-4 space-y-1.5">
                    {[
                      { label: 'Active CVEs (critical)', value: '1,284', color: '#f85149' },
                      { label: 'AI attack vectors', value: '89', color: '#d29922' },
                      { label: 'Data breach alerts', value: '23 today', color: '#f85149' },
                      { label: 'Patch compliance', value: '67.3%', color: '#d29922' },
                      { label: 'Zero-days (unpatched)', value: '7', color: '#f85149' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span style={{ color: '#8b949e' }}>{item.label}</span>
                        <span style={{ color: item.color }} className="font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4" style={{ color: '#484f58' }}>
                    <span className="animate-blink" style={{ color: '#00b4ff' }}>█</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-12" style={{ borderTop: '1px solid #21262d' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black mb-1 font-mono" style={{ color: '#00b4ff' }}>{stat.value}</div>
                <div className="text-xs uppercase tracking-wider" style={{ color: '#484f58', letterSpacing: '0.1em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-accent" aria-hidden="true" />

      <section className="py-20" style={{ background: '#0d1117' }} aria-label="Latest Intelligence articles">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="section-label mb-3">Latest Intelligence</div>
              <h2 className="text-white">Recent Threat Briefings</h2>
            </div>
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200"
              style={{ color: '#8b949e' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#00b4ff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#8b949e'; }}
              aria-label="View all articles"
            >
              View all
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M1 8a.5.5 0 01.5-.5h11.793l-3.147-3.146a.5.5 0 01.708-.708l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708L13.293 8.5H1.5A.5.5 0 011 8z" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
            {latestArticles.map((article, i) => (
              <ArticleCard key={article.slug} article={article} variant={i === 0 ? 'featured' : 'default'} index={i} />
            ))}
          </div>
          <div className="mt-8 sm:hidden text-center">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: '#00b4ff' }}>
              View all articles
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M1 8a.5.5 0 01.5-.5h11.793l-3.147-3.146a.5.5 0 01.708-.708l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708L13.293 8.5H1.5A.5.5 0 011 8z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section
        className="py-20"
        style={{ background: 'linear-gradient(to bottom, #0d1117, #0d1117)', borderTop: '1px solid #21262d' }}
        aria-label="Security tools and resources"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-label mb-3 justify-center">
              <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest" style={{ color: '#00b4ff' }}>
                <span className="inline-block w-4 h-px" style={{ background: '#00b4ff' }} aria-hidden="true" />
                Curated Arsenal
                <span className="inline-block w-4 h-px" style={{ background: '#00b4ff' }} aria-hidden="true" />
              </span>
            </div>
            <h2 className="text-white mb-4">Security Tools &amp; Resources</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#8b949e' }}>
              Independently evaluated tools trusted by security professionals. No vendor kickbacks — just honest assessments.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 stagger">
            {toolCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group block p-6 rounded-xl transition-all duration-300"
                style={{ background: '#161b22', border: '1px solid #30363d' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,180,255,0.35)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#30363d';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                aria-label={`Browse ${cat.name} tools`}
              >
                <div className="text-3xl mb-4" aria-hidden="true">{cat.icon}</div>
                <h3 className="text-base font-bold mb-2 transition-colors duration-200 group-hover:text-[#00b4ff]" style={{ color: '#ffffff' }}>{cat.name}</h3>
                <p className="text-sm" style={{ color: '#8b949e' }}>{cat.description}</p>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-md font-bold text-sm transition-all duration-200"
              style={{ background: 'transparent', border: '1px solid #00b4ff', color: '#00b4ff' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,180,255,0.08)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,180,255,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Browse All Tools
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M1 8a.5.5 0 01.5-.5h11.793l-3.147-3.146a.5.5 0 01.708-.708l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708L13.293 8.5H1.5A.5.5 0 011 8z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section
        className="py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d1117 50%, #0a1628 100%)', borderTop: '1px solid #21262d', borderBottom: '1px solid #21262d' }}
        aria-label="Newsletter signup"
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,180,255,0.06) 0%, transparent 65%)' }} aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="section-label mb-5 justify-center">
            <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest" style={{ color: '#00b4ff' }}>Weekly Intelligence Drop</span>
          </div>
          <h2 className="text-white mb-5">Don&apos;t Wait for the Breach Report</h2>
          <p className="text-lg mb-10" style={{ color: '#8b949e' }}>
            Get the AI Security Brief delivered every Tuesday. Threat analysis, tool reviews, and actionable defence strategies — before your CISO asks about it.
          </p>
          <NewsletterForm variant="page" placeholder="your@work-email.com" buttonText="Subscribe Free" />
        </div>
      </section>
    </>
  );
}
