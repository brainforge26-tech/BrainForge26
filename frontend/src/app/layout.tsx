import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/providers';
import './globals.css';

// ─── Font ─────────────────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'BrainForceIT — Premium IT Agency',
    template: '%s | BrainForceIT',
  },
  description:
    'BrainForceIT is a premium IT agency delivering world-class software solutions, project management, and developer hiring services.',
  keywords: [
    'IT agency',
    'software development',
    'project management',
    'developer hiring',
    'web development',
    'BrainForceIT',
  ],
  authors: [{ name: 'BrainForceIT' }],
  creator: 'BrainForceIT',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://brainforceit.com',
    siteName: 'BrainForceIT',
    title: 'BrainForceIT — Premium IT Agency',
    description:
      'BrainForceIT is a premium IT agency delivering world-class software solutions.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrainForceIT — Premium IT Agency',
    description:
      'BrainForceIT is a premium IT agency delivering world-class software solutions.',
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

export const viewport: Viewport = {
  themeColor: '#050816',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-[#050816] text-white antialiased min-h-screen overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
