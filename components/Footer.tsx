import Link from 'next/link';
import NewsletterForm from './NewsletterForm';

const footerLinks = {
  Intelligence: [
    { label: 'Latest Articles', href: '/blog' },
    { label: 'Threat Analysis', href: '/blog?category=threats' },
    { label: 'Privacy Defence', href: '/blog?category=privacy' },
    { label: 'AI Security', href: '/blog?category=ai-security' },
  ],
  Resources: [
    { label: 'Security Tools', href: '/tools' },
    { label: 'VPN Reviews', href: '/tools#vpns' },
    { label: 'Password Managers', href: '/tools#password-managers' },
    { label: 'Email Security', href: '/tools#email-security' },
  ],
  Publication: [
    { label: 'Newsletter', href: '/newsletter' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: '#080c11', borderTop: '1px solid #21262d' }} aria-label="Site footer">
      <div style={{ background: 'rgba(0,180,255,0.04)', borderBottom: '1px solid #21262d' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-widest font-mono mb-2" style={{ color: '#00b4ff', letterSpacing: '0.15em' }}>Stay Briefed</p>
              <h3 className="text-xl font-bold text-white mb-1">Weekly Threat Intelligence</h3>
              <p className="text-sm" style={{ color: '#8b949e' }}>AI-powered threat analysis, privacy tools, and security insights. No noise. No spam. Unsubscribe anytime.</p>
            </div>
            <div className="w-full md:w-auto md:min-w-80">
              <NewsletterForm variant="footer" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group" aria-label="AI Security Brief home">
              <svg width="26" height="30" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300 group-hover:drop-shadow-[0_0_6px_rgba(0,180,255,0.5)]">
                <path d="M16 1.5L2 7v9c0 8.5 6 16 14 18 8-2 14-9.5 14-18V7L16 1.5z" stroke="#00b4ff" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(0,180,255,0.06)" />
                <circle cx="16" cy="16" r="2.5" fill="#00b4ff" opacity="0.9" />
                <path d="M9 16h4M19 16h4M16 12v4M16 16v4" stroke="#00b4ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              </svg>
              <span className="font-bold text-white text-sm tracking-tight">AI Security Brief</span>
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#8b949e' }}>Independent intelligence on AI-powered cyber threats, privacy defence, and security tools for technology professionals.</p>
            <div className="flex items-center gap-3">
              {[
                { label: 'Twitter/X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M2 6.5a2 2 0 114 0 2 2 0 01-4 0z' },
                { label: 'RSS', path: 'M6.18 15.64a2.18 2.18 0 012.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 012.18-2.18M4 4.44A15.56 15.56 0 0119.56 20h-2.83A12.73 12.73 0 004 7.27V4.44m0 5.66a9.9 9.9 0 019.9 9.9h-2.83A7.07 7.07 0 004 12.93V10.1z' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="p-2 rounded-md transition-all duration-200"
                  style={{ color: '#484f58', border: '1px solid #21262d' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#00b4ff';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,180,255,0.3)';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,180,255,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#484f58';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#21262d';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: '#8b949e', letterSpacing: '0.12em' }}>{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: '#484f58' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#00b4ff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#484f58'; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid #21262d' }}>
          <p className="text-xs" style={{ color: '#484f58' }}>
            © {currentYear} AI Security Brief. All rights reserved.
            <span className="mx-2">·</span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', color: '#30363d' }}>THREAT LEVEL: HIGH</span>
          </p>
          <a
            href="https://www.perplexity.ai/computer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs transition-colors duration-200"
            style={{ color: '#484f58' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#00b4ff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#484f58'; }}
          >
            Created with Perplexity Computer
          </a>
        </div>
      </div>
    </footer>
  );
}
