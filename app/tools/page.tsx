import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Security Tools & Resources — Vetted VPNs, Password Managers & More',
  description:
    'Independently evaluated security tools: VPNs, password managers, email security, and endpoint protection. Affiliate disclosure: some links may earn commission.',
};

interface Tool {
  name: string;
  description: string;
  highlight: string;
  price: string;
  affiliateUrl: string;
  badge?: string;
  badgeColor?: string;
}

interface ToolCategory {
  id: string;
  icon: string;
  title: string;
  description: string;
  tools: Tool[];
}

const toolCategories: ToolCategory[] = [
  {
    id: 'vpns',
    icon: '🛡️',
    title: 'VPNs & Network Privacy',
    description:
      'Encrypt your network traffic, mask your IP address, and bypass censorship. Essential for remote workers, journalists, and security-conscious professionals.',
    tools: [
      {
        name: 'Mullvad VPN',
        description:
          'Zero-logs VPN operated from Sweden. Accepts cash and crypto. No account email required — just a 16-digit account number. Audited annually by independent firms.',
        highlight: 'No-account privacy, WireGuard, RAM-only servers',
        price: '€5/mo flat',
        affiliateUrl: 'https://mullvad.net',
        badge: 'Editor\'s Pick',
        badgeColor: '#00b4ff',
      },
      {
        name: 'ProtonVPN',
        description:
          'Swiss-based, open-source VPN with free tier. Built by CERN scientists. Integrated with ProtonMail for end-to-end encrypted comms and email.',
        highlight: 'Free tier, open source, Swiss jurisdiction',
        price: 'Free – $9.99/mo',
        affiliateUrl: 'https://protonvpn.com',
        badge: 'Best Free Option',
        badgeColor: '#3fb950',
      },
    ],
  },
  {
    id: 'password-managers',
    icon: '🔑',
    title: 'Password Managers',
    description:
      'Zero-knowledge vaults that generate, store, and autofill strong unique passwords for every site. The single highest-ROI security investment for individuals and teams.',
    tools: [
      {
        name: 'Bitwarden',
        description:
          'Open-source, end-to-end encrypted password manager with free individual tier. Self-hostable for enterprises. SOC2 audited. Supports passkeys.',
        highlight: 'Open source, free tier, self-hostable',
        price: 'Free – $3/mo',
        affiliateUrl: 'https://bitwarden.com',
        badge: 'Open Source',
        badgeColor: '#3fb950',
      },
      {
        name: '1Password',
        description:
          'Enterprise-grade password manager with Travel Mode for border crossings, Watchtower breach monitoring, and deep MFA integration. SIEM-compatible audit logs.',
        highlight: 'Travel Mode, Watchtower, enterprise SCIM',
        price: '$2.99/mo',
        affiliateUrl: 'https://1password.com',
        badge: 'Best for Teams',
        badgeColor: '#00b4ff',
      },
    ],
  },
  {
    id: 'email-security',
    icon: '✉️',
    title: 'Email Security',
    description:
      'Encrypted email, disposable aliases, and phishing defence. Email is the #1 initial access vector — harden it before your adversaries exploit it.',
    tools: [
      {
        name: 'ProtonMail',
        description:
          'End-to-end encrypted email from Switzerland. Zero-access encryption means even Proton cannot read your mail. Supports custom domains and bridge for desktop clients.',
        highlight: 'E2E encryption, zero-access, Swiss law',
        price: 'Free – €9.99/mo',
        affiliateUrl: 'https://proton.me',
        badge: 'Editor\'s Pick',
        badgeColor: '#00b4ff',
      },
      {
        name: 'SimpleLogin',
        description:
          'Email alias service that generates unique addresses per site. Shields your real email from breaches, spam, and correlation attacks. Now part of Proton.',
        highlight: 'Unlimited aliases, reply pseudonymously',
        price: 'Free – $4/mo',
        affiliateUrl: 'https://simplelogin.io',
      },
    ],
  },
  {
    id: 'endpoint-protection',
    icon: '💻',
    title: 'Endpoint Protection',
    description:
      'EDR, threat detection, and device hardening tools for workstations and servers. Move beyond legacy AV to behavioural detection and response.',
    tools: [
      {
        name: 'Malwarebytes',
        description:
          'Industry-standard malware removal and real-time protection. Effective against ransomware, zero-days, and PUPs. Light on system resources, aggressive on threats.',
        highlight: 'Ransomware rollback, real-time protection',
        price: '$3.75/mo',
        affiliateUrl: 'https://malwarebytes.com',
      },
      {
        name: 'CrowdStrike Falcon Go',
        description:
          'Enterprise EDR technology in an SMB-accessible package. Cloud-delivered prevention, detection, and threat intelligence. AI-powered threat hunting.',
        highlight: 'AI-native EDR, threat intelligence, cloud-delivered',
        price: 'From $59.99/device/yr',
        affiliateUrl: 'https://crowdstrike.com',
        badge: 'Enterprise Grade',
        badgeColor: '#d29922',
      },
    ],
  },
];

export default function ToolsPage() {
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
          <div className="section-label mb-3">Curated Arsenal</div>
          <h1 className="text-white mb-4">Security Tools &amp; Resources</h1>
          <p className="text-lg max-w-2xl" style={{ color: '#8b949e' }}>
            Tools independently evaluated by the AI Security Brief team. We only list products
            we&apos;d use ourselves.
          </p>

          {/* Affiliate disclosure */}
          <div
            className="mt-6 inline-flex items-start gap-2 px-4 py-3 rounded-lg text-xs"
            style={{
              background: 'rgba(210,153,34,0.06)',
              border: '1px solid rgba(210,153,34,0.2)',
              color: '#8b949e',
              maxWidth: '42rem',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              style={{ color: '#d29922', flexShrink: 0, marginTop: '1px' }}
              aria-hidden="true"
            >
              <path
                d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z"
                fill="currentColor"
                opacity="0.3"
              />
              <path
                d="M8 4.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4.5zm0 6.5a1 1 0 110-2 1 1 0 010 2z"
                fill="#d29922"
              />
            </svg>
            <span>
              <strong style={{ color: '#d29922' }}>Affiliate Disclosure:</strong> Some links on
              this page are affiliate links. If you make a purchase, we may earn a commission at
              no extra cost to you. This never influences our recommendations.
            </span>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div
        className="sticky top-16 z-40"
        style={{
          background: 'rgba(13,17,23,0.95)',
          borderBottom: '1px solid #21262d',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            className="flex items-center gap-1 overflow-x-auto py-3"
            aria-label="Jump to category"
            style={{ scrollbarWidth: 'none' }}
          >
            {toolCategories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all duration-200"
                style={{
                  color: '#8b949e',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#00b4ff';
                  e.currentTarget.style.borderColor = 'rgba(0,180,255,0.2)';
                  e.currentTarget.style.background = 'rgba(0,180,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#8b949e';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span aria-hidden="true">{cat.icon}</span>
                {cat.title.split(' ')[0]}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Tool categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        {toolCategories.map((category) => (
          <section key={category.id} id={category.id} aria-label={category.title}>
            {/* Category header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div className="flex items-start gap-4">
                <span className="text-4xl" aria-hidden="true">{category.icon}</span>
                <div>
                  <h2 className="text-white mb-2">{category.title}</h2>
                  <p className="text-sm max-w-2xl" style={{ color: '#8b949e' }}>
                    {category.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              className="mb-8"
              style={{ height: '1px', background: '#21262d' }}
              aria-hidden="true"
            />

            {/* Tool cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {category.tools.map((tool) => (
                <div
                  key={tool.name}
                  className="relative p-6 rounded-xl transition-all duration-300"
                  style={{
                    background: '#161b22',
                    border: '1px solid #30363d',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,180,255,0.35)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#30363d';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  {/* Badge */}
                  {tool.badge && (
                    <div className="absolute top-4 right-4">
                      <span
                        className="text-xs font-mono font-semibold px-2 py-0.5 rounded"
                        style={{
                          background: `${tool.badgeColor}18`,
                          color: tool.badgeColor,
                          border: `1px solid ${tool.badgeColor}30`,
                        }}
                      >
                        {tool.badge}
                      </span>
                    </div>
                  )}

                  {/* Tool header */}
                  <div className="mb-3 pr-20">
                    <h3 className="text-lg font-bold text-white">{tool.name}</h3>
                    <p
                      className="text-xs font-mono mt-1"
                      style={{ color: '#00b4ff' }}
                    >
                      {tool.highlight}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed mb-5" style={{ color: '#8b949e' }}>
                    {tool.description}
                  </p>

                  {/* Footer row */}
                  <div
                    className="flex items-center justify-between pt-4"
                    style={{ borderTop: '1px solid #21262d' }}
                  >
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: '#3fb950' }}
                    >
                      {tool.price}
                    </span>
                    <a
                      href={tool.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all duration-200"
                      style={{
                        background: '#00b4ff',
                        color: '#0d1117',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.background = '#33c3ff';
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 14px rgba(0,180,255,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.background = '#00b4ff';
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                      }}
                      aria-label={`Visit ${tool.name} website (opens in new tab)`}
                    >
                      Visit Site
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 12 12"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M3.5 3a.5.5 0 000 1H7.293L1.146 10.146a.5.5 0 00.708.708L8 4.707V8.5a.5.5 0 001 0v-5a.5.5 0 00-.5-.5h-5z" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Bottom CTA */}
        <div
          className="py-16 px-8 rounded-2xl text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #161b22 0%, #1a2030 100%)',
            border: '1px solid #30363d',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(0,180,255,0.08) 0%, transparent 60%)',
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <div className="section-label mb-4 justify-center">
              <span
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest"
                style={{ color: '#00b4ff' }}
              >
                Get Tool Reviews in Your Inbox
              </span>
            </div>
            <h2 className="text-white mb-4">We Review New Tools Every Week</h2>
            <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: '#8b949e' }}>
              Subscribe to the AI Security Brief for in-depth tool reviews,
              comparison guides, and exclusive deals.
            </p>
            <Link
              href="/newsletter"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md font-bold text-sm transition-all duration-200"
              style={{ background: '#00b4ff', color: '#0d1117' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#33c3ff';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,180,255,0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#00b4ff';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Subscribe Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
