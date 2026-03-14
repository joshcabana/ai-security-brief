import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleCard, { Article } from '@/components/ArticleCard';
import NewsletterForm from '@/components/NewsletterForm';

const articleData: Record<string, Article & { content: string }> = {
  'llm-prompt-injection-enterprise-risks': {
    slug: 'llm-prompt-injection-enterprise-risks',
    title: 'LLM Prompt Injection: The Silent Threat Inside Your Enterprise AI Stack',
    excerpt: 'As organisations rush to embed large language models into internal tooling, attackers are discovering that the same natural language interface that makes AI useful also makes it exploitable.',
    date: '2026-03-12',
    readTime: '7 min read',
    category: 'AI Threats',
    featured: true,
    author: 'Editorial Team',
    content: `
## The Attack Surface No One Is Patching

When your engineering team wired GPT-4 into your internal helpdesk tool, they created more than a productivity feature. They created a new attack vector that doesn't respond to traditional security controls.

Prompt injection — the manipulation of an LLM's instruction set through crafted inputs — has moved from academic curiosity to active exploitation.

## How Prompt Injection Works

At its core, a prompt injection attack exploits the fundamental architecture of transformer-based language models: **the model cannot reliably distinguish between instructions from the operator and content from the user**.

## Enterprise Attack Vectors

### 1. Indirect Injection via Retrieved Documents
The most insidious variant doesn't come from direct user input at all. When your AI system retrieves documents from an internal knowledge base or the web, those documents can contain injected instructions.

### 2. Multi-Agent Poisoning
Modern agentic pipelines chain multiple AI calls. A compromised upstream model can inject malicious instructions that propagate through the entire pipeline.

### 3. Context Window Saturation
By flooding the context window with misleading data, attackers can suppress system instructions that appear earlier in the context.

## Mitigation Strategies

**Architectural controls:**
- Implement strict input/output filtering at the API gateway layer
- Use separate model instances for user-facing and privileged operations
- Apply principle of least privilege to tool access in agentic systems

The uncomfortable truth: **there is no patch for prompt injection**. It is an inherent property of how language models process text.
    `,
  },
  'deepfake-voice-ceo-fraud': {
    slug: 'deepfake-voice-ceo-fraud',
    title: 'Deepfake Voice Cloning Fuels $2.1M CEO Fraud Wave Across APAC',
    excerpt: 'A new wave of business email compromise attacks leverages real-time voice synthesis to impersonate executives, bypassing traditional phishing filters entirely.',
    date: '2026-03-10',
    readTime: '5 min read',
    category: 'Deepfakes',
    featured: false,
    author: 'Editorial Team',
    content: `
## When the Voice on the Phone Isn't Who You Think

In February 2026, a finance manager at a mid-sized logistics company in Singapore authorised a $2.1M wire transfer following a WhatsApp voice call from what sounded exactly like the company's CFO.

## The Technology Has Outpaced Awareness

Real-time voice cloning technology has crossed the threshold of plausibility. Tools available for under $100/month can clone a voice from as little as 3 seconds of audio.

## Detection and Defence

**Organisational controls:**
- Establish out-of-band verification protocols for all wire transfers above a threshold
- Train finance teams that voice alone is not authentication
- Implement mandatory dual-authorisation for high-value transfers
    `,
  },
};

const allSlugs = Object.keys(articleData);

const relatedArticles: Article[] = [
  {
    slug: 'zero-trust-ai-access-controls',
    title: 'Zero Trust in the Age of AI: Why Identity Alone Is No Longer Enough',
    excerpt: 'Traditional zero-trust architecture assumes humans at both ends. AI agents demand a new threat model.',
    date: '2026-03-08',
    readTime: '9 min read',
    category: 'Zero Trust',
  },
  {
    slug: 'privacy-first-os-2026-comparison',
    title: 'Privacy-First Operating Systems in 2026: A Practical Comparison',
    excerpt: 'Qubes OS, Tails, and GrapheneOS — which one belongs on your security stack?',
    date: '2026-03-05',
    readTime: '11 min read',
    category: 'Privacy',
  },
  {
    slug: 'ai-powered-ransomware-2026',
    title: 'AI-Powered Ransomware: How ML Is Accelerating Encryption Attacks',
    excerpt: 'Next-gen ransomware uses ML to identify valuable files faster and evade signature detection.',
    date: '2026-03-02',
    readTime: '8 min read',
    category: 'Ransomware',
  },
];

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articleData[slug];
  if (!article) return { title: 'Article Not Found' };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, type: 'article', publishedTime: article.date, authors: [article.author || 'AI Security Brief'] },
    twitter: { card: 'summary_large_image', title: article.title, description: article.excerpt },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' });
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'AI Threats': { bg: 'rgba(248,81,73,0.08)', text: '#f85149', border: 'rgba(248,81,73,0.2)' },
  'Privacy': { bg: 'rgba(0,180,255,0.08)', text: '#00b4ff', border: 'rgba(0,180,255,0.2)' },
  'Endpoint Security': { bg: 'rgba(63,185,80,0.08)', text: '#3fb950', border: 'rgba(63,185,80,0.2)' },
  'Zero Trust': { bg: 'rgba(210,153,34,0.08)', text: '#d29922', border: 'rgba(210,153,34,0.2)' },
  'Deepfakes': { bg: 'rgba(188,140,255,0.08)', text: '#bc8cff', border: 'rgba(188,140,255,0.2)' },
  'Ransomware': { bg: 'rgba(248,81,73,0.08)', text: '#f85149', border: 'rgba(248,81,73,0.2)' },
  'Vulnerability': { bg: 'rgba(210,153,34,0.08)', text: '#d29922', border: 'rgba(210,153,34,0.2)' },
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articleData[slug];
  if (!article) notFound();
  const colors = categoryColors[article.category] || categoryColors['Privacy'];

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh' }}>
      <header className="relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #080c11, #0d1117)', borderBottom: '1px solid #21262d', paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-mono mb-6" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors" style={{ color: '#484f58' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#00b4ff'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#484f58'; }}>Home</Link>
            <span style={{ color: '#30363d' }} aria-hidden="true">/</span>
            <Link href="/blog" className="transition-colors" style={{ color: '#484f58' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#00b4ff'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#484f58'; }}>Blog</Link>
            <span style={{ color: '#30363d' }} aria-hidden="true">/</span>
            <span style={{ color: '#8b949e' }} className="truncate max-w-40">{article.title.substring(0, 40)}…</span>
          </nav>
          <div className="mb-5">
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded" style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>{article.category}</span>
          </div>
          <h1 className="text-white font-black leading-tight mb-6" style={{ letterSpacing: '-0.025em' }}>{article.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: '#484f58' }}>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 1a.5.5 0 01.5.5v.793l.646-.647a.5.5 0 01.708.708L9 3.207V3.5a.5.5 0 01-1 0v-.293L7.146 4.06a.5.5 0 01-.708-.708L7 2.793V1.5A.5.5 0 018 1zm0 2a5 5 0 100 10A5 5 0 008 3zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" /></svg>
              <time dateTime={article.date}>{formatDate(article.date)}</time>
            </div>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{article.readTime}</span>
            {article.author && (<><span aria-hidden="true">·</span><span>{article.author}</span></>)}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
          <article>
            <p className="text-lg leading-relaxed mb-8 pb-8" style={{ color: '#c9d1d9', borderBottom: '1px solid #21262d', fontStyle: 'italic' }}>{article.excerpt}</p>
            <div
              className="prose-dark"
              style={{ color: '#e6edf3' }}
              dangerouslySetInnerHTML={{
                __html: article.content
                  .trim()
                  .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                  .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  .replace(/`([^`]+)`/g, '<code>$1</code>')
                  .replace(/^(\d+\. .+)$/gm, '<li>$1</li>')
                  .replace(/^- (.+)$/gm, '<li>$1</li>')
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/^(?!<[h|l|p|u|o|b|c|p])(.+)$/gm, '<p>$1</p>')
                  .replace(/<p><\/p>/g, '')
                  .replace(/<p>(<[h|l|u|o|b|c])/g, '$1')
                  .replace(/(<\/[h|l|u|o|b|p][^>]*>)<\/p>/g, '$1'),
              }}
            />
            <div className="flex flex-wrap gap-2 mt-12 pt-8" style={{ borderTop: '1px solid #21262d' }}>
              <span className="text-xs" style={{ color: '#484f58', alignSelf: 'center' }}>Filed under:</span>
              {[article.category, 'Cybersecurity', 'Intelligence'].map((tag) => (<span key={tag} className="tag">{tag}</span>))}
            </div>
            <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid #21262d' }}>
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm transition-colors" style={{ color: '#8b949e' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#00b4ff'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#8b949e'; }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M15 8a.5.5 0 00-.5-.5H2.707l3.147-3.146a.5.5 0 10-.708-.708l-4 4a.5.5 0 000 .708l4 4a.5.5 0 00.708-.708L2.707 8.5H14.5A.5.5 0 0015 8z" /></svg>
                Back to all articles
              </Link>
            </div>
          </article>

          <aside className="space-y-6" aria-label="Article sidebar">
            <div className="p-6 rounded-xl" style={{ background: '#161b22', border: '1px solid #30363d' }}>
              <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: '#00b4ff', letterSpacing: '0.12em' }}>Stay Briefed</div>
              <h3 className="text-base font-bold text-white mb-2">Get the Weekly Brief</h3>
              <p className="text-sm mb-5" style={{ color: '#8b949e' }}>AI threat analysis delivered every Tuesday. No noise.</p>
              <NewsletterForm variant="default" buttonText="Subscribe" />
            </div>
            <div className="p-6 rounded-xl" style={{ background: '#161b22', border: '1px solid #30363d' }}>
              <div className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: '#8b949e', letterSpacing: '0.12em' }}>Article Stats</div>
              <div className="space-y-3">
                {[
                  { label: 'Read time', value: article.readTime },
                  { label: 'Published', value: formatDate(article.date) },
                  { label: 'Category', value: article.category },
                  { label: 'Author', value: article.author || 'Editorial' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: '#484f58' }}>{item.label}</span>
                    <span className="text-xs font-mono font-medium" style={{ color: '#8b949e' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(0,180,255,0.05) 0%, rgba(0,180,255,0.02) 100%)', border: '1px solid rgba(0,180,255,0.2)' }}>
              <div className="text-xs font-mono uppercase mb-3" style={{ color: '#00b4ff' }}>Recommended</div>
              <h3 className="text-sm font-bold text-white mb-2">Security Tools</h3>
              <p className="text-xs mb-4" style={{ color: '#8b949e' }}>Vetted VPNs, password managers, and endpoint protection tools.</p>
              <Link href="/tools" className="text-xs font-semibold flex items-center gap-1 transition-colors" style={{ color: '#00b4ff' }}>
                Browse tools
                <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M1 8a.5.5 0 01.5-.5h11.793l-3.147-3.146a.5.5 0 01.708-.708l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708L13.293 8.5H1.5A.5.5 0 011 8z" /></svg>
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-16 pt-12" style={{ borderTop: '1px solid #21262d' }}>
          <div className="section-label mb-6">Related Intelligence</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedArticles.filter((a) => a.slug !== slug).slice(0, 3).map((article, i) => (
              <ArticleCard key={article.slug} article={article} variant="default" index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
