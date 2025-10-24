import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Base Box - Time Capsules on Base',
  description: 'Lock messages for your future self on Base blockchain',
  metadataBase: new URL('https://basebox.vercel.app'),
  openGraph: {
    title: 'Base Box - Time Capsules on Base',
    description: 'Lock messages for your future self on Base blockchain',
    url: 'https://basebox.vercel.app',
    siteName: 'Base Box',
    images: [
      {
        url: '/og-image-FIXED.png',
        width: 1200,
        height: 630,
        alt: 'Base Box',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base Box - Time Capsules on Base',
    description: 'Lock messages for your future self on Base blockchain',
    images: ['/og-image-FIXED.png'],
  },
  other: {
    // Single JSON meta tag for Farcaster Mini App
    'fc:miniapp': JSON.stringify({
      name: 'Base Box',
      description: 'Lock messages for your future self on Base blockchain',
      icon: 'https://basebox.vercel.app/icon.png',
      homeUrl: 'https://basebox.vercel.app',
      imageUrl: 'https://basebox.vercel.app/og-image-FIXED.png',
      splashImageUrl: 'https://basebox.vercel.app/splash-screen.png',
      splashBackgroundColor: '#000000',
    }),
    // Alternative: fc:frame format (some clients prefer this)
    'fc:frame': JSON.stringify({
      version: '1',
      name: 'Base Box',
      homeUrl: 'https://basebox.vercel.app',
      iconUrl: 'https://basebox.vercel.app/icon.png',
      splashImageUrl: 'https://basebox.vercel.app/splash-screen.png',
      splashBackgroundColor: '#000000',
      imageUrl: 'https://basebox.vercel.app/og-image-FIXED.png',
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Additional frame-specific meta tags for maximum compatibility */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://basebox.vercel.app/og-image-FIXED.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}