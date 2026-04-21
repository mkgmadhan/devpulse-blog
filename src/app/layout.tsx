import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdSenseScript } from '@/components/ads/AdSenseScript';

const geistSans = Geist({ variable: '--font-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://devpulse.blog'),
  title: {
    default: 'DevPulse — Deep-dive tech articles',
    template: '%s | DevPulse',
  },
  description: 'Deep-dive technical articles on AI, full-stack development, cloud infrastructure, and emerging technology.',
  openGraph: {
    type: 'website',
    siteName: 'DevPulse',
    title: 'DevPulse — Deep-dive tech articles',
    description: 'Deep-dive technical articles on AI, full-stack development, cloud, and emerging tech.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col`}>
        <ThemeProvider>
          <AdSenseScript />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
