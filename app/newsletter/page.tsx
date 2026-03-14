import type { Metadata } from 'next';
import NewsletterForm from '@/components/NewsletterForm';

export const metadata: Metadata = {
  title: 'Newsletter — Weekly AI Threat Intelligence & Security Briefings',
  description:
    'Subscribe to the AI Security Brief newsletter. Weekly threat intelligence, privacy tool reviews, and cybersecurity analysis for technology professionals.',
};

const benefits = [
  {
    icon: '🎯',
    title: 'Curated Threat Intelligence',
    description:
      'Every Tuesday: the most significant AI-powered attacks, vulnerability disclosures, and breach reports — filtered for signal, stripped of noise.',
  },
  {
    icon: '🔧',
    title: 'Tool Reviews & Comparisons',
    description:
      'In-depth reviews of VPNs, password managers, EDR platforms, and privacy tools. Honest assessments with no vendor influence.',
  },
  {
    icon: '🧠',
    title: 'Threat Actor Analysis',
    description:
      'Profiles of emerging APT groups, their TTPs, infrastructure, and targeting — written for defenders who need to understand adversary behaviour.',
  },
  {
    icon: '⚡',
    title: 'Fast-Track Alerts',
    description:
      'Critical CVEs, zero-days, and active exploitation alerts delivered within hours of disclosure. Know before your CISO asks.',
  },
  {
    icon: '📊',
    title: 'Data-Driven Reporting',
    description:
      'Statistics, charts, and trend analysis on the AI security landscape. Not opinion — evidence.',
  },
  {
    icon: '🔒',
    title: 'Privacy-First Publishing',
    description:
      'No tracking pixels. No ad networks. No surveillance capitalism. Just a clean, fast email with the intelligence you need.',
  },
];

const pastIssues = [
  {
    issue: '#47',
    date: '11 Mar 2026',
    title: 'LLM Prompt Injection: Enterprise Risk Mapping',
    teaser:
      'A comprehensive mapping of prompt injection attack surfaces across common enterprise AI deployments, plus mitigation architectures that actually work.',
    readTime: '8 min read',
  },
  {
    issue: '#46',
    date: '4 Mar 2026',
    title: 'Deepfakes & CEO Fraud: The APAC Incident Dossier',
    teaser:
      'Detailed analysis of five real-world voice cloning fraud incidents in the APAC region, with attack chain breakdowns and defence playbooks.',
    readTime: '6 min read',
  },
  {
    issue: '#45',
    date: '25 Feb 2026',
    title: 'Zero Trust Under Stress: When AI Agents Break Your IAM',
    teaser:
      'Non-human identities are now the fastest-growing segment of enterprise IAM. Zero-trust frameworks weren\'t designed for them — here\'s what to do.',
    readTime: '10 min read',
  },
  {
    issue: '#44',
    date: '18 Feb 2026',
    title: 'Privacy OS Showdown: Qubes vs Tails vs GrapheneOS',
    teaser:
      'Side-by-side threat model comparison of the three leading privacy-first operating systems. Which one belongs in your security stack?',
    readTime: '12 min read',
  },
  {
    issue: '#43',
    date: '11 Feb 2026',
    title: 'Ransomware 2026: ML-Accelerated Encryption Attacks',
    teaser:
      'New ransomware variants use machine learning to identify high-value targets, evade detection, and negotiate ransoms autonomously. Here\'s the threat model.',
    readTime: '9 min read',
  },
  {
    issue: '#42',
    date: '4 Feb 2026',
    title: 'Supply Chain Poisoning: The AI Model Integrity Crisis',
    teaser:
      'Open-source model repositories are the new npm. How model backdooring works, what\'s been found in the wild, and how to verify your AI dependencies.',
    readTime: '11 min read',
  },
];

export default function NewsletterPage() {
  return (
    <div style={{ background: '#0d1117', minHeight: '100vh' }}>
      {/* Hero section */}
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
        <div
          className="absolute inset-0 bg-grid opacity-40 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(0,180,255,0.06) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Live indicator */}
          <div className="flex justify-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono"
              style={{
                background: 'rgba(63,185,80,0.08)',
                border: '1px solid rgba(63,185,80,0.25)',
                color: '#3fb950',
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: '#3fb950' }}
                aria-hidden="true"
              />
              <span className="tracking-wider uppercase" style={{ letterSpacing: '0.1em' }}>
                Publishing Every Tuesday
              </span>
            </div>
          </div>

          <div className="section-label mb-5 justify-center">
            <span
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest"
              style={{ color: '#00b4ff' }}
            >
              Weekly Intelligence
            </span>
          </div>

          <h1 className="text-white mb-6" style={{ letterSpacing: '-0.03em' }}>
            The Security Brief for
            <br />
            <span style={{ color: '#00b4ff' }}>AI-Era Defenders</span>
          </h1>

          <p className="text-xl leading-relaxed mb-10" style={{ color: '#8b949e' }}>
            Every Tuesday, a focused intelligence briefing on AI-powered threats,
            privacy tools, and defence strategies — written for engineers, security architects,
            and CTOs who need answers, not articles.
          </p>

          {/* Signup form */}
          <div
            className="p-8 rounded-2xl"
            style={{
              background: '#161b22',
              border: '1px solid #30363d',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <h2
              className="text-xl font-bold text-white mb-2 text-left"
            >
              Subscribe Free
            </h2>
            <p className="text-sm text-left mb-6" style={{ color: '#8b949e' }}>
              Join 47,000+ security professionals. Cancel anytime.
            </p>
            <NewsletterForm
              variant="page"
              placeholder="your@work-email.com"
              buttonText="Subscribe Free"
            />

            <div
              className="mt-6 pt-5 flex flex-wrap justify-center gap-6"
              style={{ borderTop: '1px solid #21262d' }}
            >
              {[
                { value: '47K+', label: 'Subscribers' },
                { value: '98%', label: 'Delivery Rate' },
                { value: '4.9/5', label: 'Reader Rating' },
                { value: '0', label: 'Tracking Pixels' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="text-lg font-black font-mono"
                    style={{ color: '#00b4ff' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs" style={{ color: '#484f58' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Beehiiv embed notice */}
          <p className="mt-6 text-xs" style={{ color: '#484f58' }}>
            Powered by{' '}
            <a
              href="https://beehiiv.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#30363d' }}
              className="hover:underline"
            >
              Beehiiv
            </a>
            . Replace the form above with your Beehiiv embed code from{' '}
            <code className="text-xs" style={{ color: '#484f58' }}>
              Settings → Embed
            </code>{' '}
            in your publication dashboard.
          </p>
        </div>
      </section>

      {/* Benefits grid */}
      <section
        className="py-20"
        style={{ borderBottom: '1px solid #21262d' }}
        aria-label="Newsletter benefits"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-label mb-3 justify-center">
              <span
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest"
                style={{ color: '#00b4ff' }}
              >
                What You Get
              </span>
            </div>
            <h2 className="text-white">Intelligence That Earns Your Inbox</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 rounded-xl"
                style={{
                  background: '#161b22',
                  border: '1px solid #30363d',
                }}
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

      {/* Past issues */}
      <section
        className="py-20"
        aria-label="Past newsletter issues"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="section-label mb-3">Archive</div>
              <h2 className="text-white">Recent Issues</h2>
            </div>
            <p className="text-sm hidden sm:block" style={{ color: '#484f58' }}>
              47 issues published
            </p>
          </div>

          <div className="space-y-4">
            {pastIssues.map((issue) => (
              <div
                key={issue.issue}
                className="group p-6 rounded-xl transition-all duration-200"
                style={{
                  background: '#161b22',
                  border: '1px solid #30363d',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,180,255,0.3)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#30363d';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-xs font-mono font-bold"
                      style={{
                        background: 'rgba(0,180,255,0.08)',
                        border: '1px solid rgba(0,180,255,0.2)',
                        color: '#00b4ff',
                      }}
                      aria-label={`Issue ${issue.issue}`}
                    >
                      {issue.issue}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <time
                          dateTime={issue.date}
                          className="text-xs font-mono"
                          style={{ color: '#484f58' }}
                        >
                          {issue.date}
                        </time>
                        <span style={{ color: '#30363d' }} aria-hidden="true">·</span>
                        <span className="text-xs font-mono" style={{ color: '#484f58' }}>
                          {issue.readTime}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#00b4ff] transition-colors duration-200">
                        {issue.title}
                      </h3>
                      <p className="text-sm" style={{ color: '#8b949e' }}>
                        {issue.teaser}
                      </p>
                    </div>
                  </div>
                  <div className="sm:flex-shrink-0">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold transition-colors duration-200"
                      style={{ color: '#484f58' }}
                    >
                      Subscribers only
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 12 12"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M8.5 3.5h-5a.5.5 0 000 1H7.293l-4.147 4.146a.5.5 0 00.708.708L8 5.207V8.5a.5.5 0 001 0v-5a.5.5 0 00-.5-.5z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div
            className="mt-12 p-8 rounded-2xl text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(0,180,255,0.05) 0%, rgba(0,180,255,0.02) 100%)',
              border: '1px solid rgba(0,180,255,0.2)',
            }}
          >
            <h3 className="text-xl font-bold text-white mb-3">
              Read the Full Archive
            </h3>
            <p className="text-sm mb-6" style={{ color: '#8b949e' }}>
              Subscribe to access all 47 issues, plus every future brief.
            </p>
            <NewsletterForm
              variant="default"
              placeholder="your@email.com"
              buttonText="Subscribe & Access Archive"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
