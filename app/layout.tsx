import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Mono, Syne } from 'next/font/google';
import './globals.css';

// ── Font Optimization (Next.js) ──────────────────────────────
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-syne',
  display: 'swap',
});

// ── Viewport ─────────────────────────────────────────────────
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // optional: prevent zoom on mobile
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F0E8' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1714' },
  ],
};

// ── Root Layout Component ────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${cormorant.variable} ${dmMono.variable} ${syne.variable}`}
    suppressHydrationWarning>
      <body>
        {/* Optional: Add a background wrapper if needed */}
        <div className="layout-root">
          {children}
        </div>
        
        {/* Optional: Global scripts or analytics */}
        {/* <Script src="/analytics.js" strategy="afterInteractive" /> */}
      </body>
    </html>
  );
}