import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MiniAppProvider } from '@/components/miniapp-provider';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Base Box - Time Capsules on Base',
  description: 'Lock messages & memories onchain. 1 hour to 1 year durations. Built on Base blockchain.',
  
  // Open Graph
  openGraph: {
    title: 'Base Box - Time Capsules on Base',
    description: 'Lock messages & memories onchain. 1 hour to 1 year durations.',
    images: [{
      url: 'https://base-box.vercel.app/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Base Box'
    }],
    type: 'website',
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Base Box - Time Capsules on Base',
    description: 'Lock messages & memories onchain. Built on Base blockchain.',
    images: ['https://base-box.vercel.app/og-image.png'],
  },
  
  // Farcaster Mini App Metadata
  other: {
    'fc:miniapp': 'https://base-box.vercel.app',
    'fc:miniapp:name': 'Base Box',
    'fc:miniapp:image': 'https://base-box.vercel.app/og-image.png',
    'fc:miniapp:button:1': 'Lock Message',
    'fc:miniapp:button:1:action': 'launch_frame',
    'fc:miniapp:button:1:target': 'https://base-box.vercel.app',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Farcaster Mini App Meta Tags */}
        <meta property="fc:miniapp" content="https://base-box.vercel.app" />
        <meta property="fc:miniapp:name" content="Base Box" />
        <meta property="fc:miniapp:image" content="https://base-box.vercel.app/og-image.png" />
        <meta property="fc:miniapp:button:1" content="Lock Message" />
        <meta property="fc:miniapp:button:1:action" content="launch_frame" />
        <meta property="fc:miniapp:button:1:target" content="https://base-box.vercel.app" />
      </head>
      <body className={inter.className}>
        <MiniAppProvider>
          {children}
        </MiniAppProvider>
      </body>
    </html>
  );
}