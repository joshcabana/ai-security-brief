import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'AI Security Brief — AI Threats, Privacy Tools & Cybersecurity Intelligence',
    template: '%s | AI Security Brief',
  },
  description:
    'Authoritative intelligence on AI-powered cyber threats, privacy defence strategies, and security tools. Stay ahead of the threat curve with expert analysis for technology professionals.',
  keywords: [
    'AI security',
    'cybersecurity',
    'AI threats',
    'privacy tools',
    'endpoint protection',
    'threat intelligence',
    'AI privacy',
    'security brief',
    'VPN',
    'zero trust',
  ],
  authors: [{ name: 'AI Security Brief' }],
  creator: 'AI Security Brief',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aisecuritybrief.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'AI Security Brief',
    title: 'AI Security Brief — AI Threats, Privacy Tools & Cybersecurity Intelligence',
    description:
      'Authoritative intelligence on AI-powered cyber threats, privacy defence strategies, and security tools.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Security Brief',
    description:
      'Intelligence on AI-powered cyber threats, privacy defence, and security tools for tech professionals.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'AI Security Brief',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://aisecuritybrief.com',
              description:
                'Authoritative intelligence on AI-powered threats, privacy tools, and cybersecurity.',
              creator: {
                '@type': 'SoftwareApplication',
                name: 'Perplexity Computer',
                url: 'https://www.perplexity.ai/computer',
              },
            }),
          }}
        />
      </head>
      <body
        className="min-h-screen flex flex-col"
        style={{ background: '#0d1117', color: '#e6edf3' }}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
