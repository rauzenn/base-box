import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { FarcasterProvider } from './providers/farcaster-provider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Base Box - Onchain Time Capsules',
  description: 'Lock your memories onchain. Set unlock dates in the future. Built on Base blockchain.',
  metadataBase: new URL('https://basebox.vercel.app'),
  openGraph: {
    title: 'Base Box - Time Capsules',
    description: 'Lock your memories onchain. Set unlock dates in the future. Built on Base blockchain.',
    url: 'https://basebox.vercel.app',
    siteName: 'Base Box',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Base Box - Onchain Time Capsules',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base Box - Time Capsules',
    description: 'Lock your memories onchain. Set unlock dates in the future. Built on Base blockchain.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://basebox.vercel.app/embed-image.png',
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': 'Launch Base Box',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://basebox.vercel.app',
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
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://basebox.vercel.app/embed-image.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="Launch Base Box" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="https://basebox.vercel.app" />
        <meta property="og:image" content="https://basebox.vercel.app/og-image.png" />
      </head>
      <body className={inter.className}>
        <FarcasterProvider>
          {children}
        </FarcasterProvider>
      </body>
    </html>
  );
}