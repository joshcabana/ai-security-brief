import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSiteUrl, siteDescription, siteName, siteUrl } from '@/lib/site';

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
    default: `${siteName} — AI Threats, Privacy Tools & Cybersecurity Intelligence`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
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
  authors: [{ name: siteName }],
  creator: siteName,
  metadataBase: getSiteUrl(),
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    siteName,
    title: `${siteName} — AI Threats, Privacy Tools & Cybersecurity Intelligence`,
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
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
              name: siteName,
              url: siteUrl,
              description: siteDescription,
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
