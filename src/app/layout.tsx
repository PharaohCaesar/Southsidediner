import type { Metadata, Viewport } from 'next';
import { Anton, Barlow, Kalam, Pacifico, Special_Elite } from 'next/font/google';
import './globals.css';
import { SITE } from '@/lib/site';
import { SmoothScroll } from '@/components/fx/smooth-scroll';
import { Spatula } from '@/components/fx/spatula';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { AkeltWidget } from '@/components/akelt-widget';
import { Milkshake } from '@/components/fx/milkshake';

const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton' });
const barlow = Barlow({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-barlow' });
const pacifico = Pacifico({ weight: '400', subsets: ['latin'], variable: '--font-pacifico' });
const ticket = Special_Elite({ weight: '400', subsets: ['latin'], variable: '--font-ticket' });
// Ballpoint handwriting for anything written on a guest check.
const ink = Kalam({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-ink' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Breakfast & Lunch in Parma, OH`,
    template: `%s | ${SITE.name}`,
  },
  description:
    'Family-owned 1950s-style diner in Parma, Ohio since 2008. Made-from-scratch breakfast and lunch, ground-in-house coffee, open every day 8 AM to 2 PM. Order online for pickup.',
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'en_US',
    images: [{ url: '/photos/spread.jpg', width: 1800, height: 1200, alt: 'A table full of Southside Diner breakfast' }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/icon.png', apple: '/apple-icon.png' },
};

export const viewport: Viewport = { themeColor: '#c8102e' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${barlow.variable} ${pacifico.variable} ${ticket.variable} ${ink.variable}`}>
      <body className="min-h-screen flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Nav />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <Milkshake />
        <Spatula />
        <AkeltWidget />
      </body>
    </html>
  );
}
