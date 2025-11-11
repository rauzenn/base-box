import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MiniAppProvider } from '@/components/miniapp-provider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Base Box - Time Capsules on Base',
  description: 'Lock messages for your future self on Base blockchain',
  openGraph: {
    title: 'Base Box',
    description: 'Lock messages for your future self on Base blockchain',
    images: [{
      url: 'https://basebox.vercel.app/og-image.png',
      width: 1200,
      height: 800,
    }],
  },
  other: {
    // Farcaster Mini App metadata
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://basebox.vercel.app/og-image.png',
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
        {/* Farcaster Mini App Metadata */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://basebox.vercel.app/og-image.png" />
        <meta property="fc:frame:button:1" content="Launch Base Box" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="https://basebox.vercel.app" />
        
        {/* Additional OG tags */}
        <meta property="og:title" content="Base Box - Time Capsules on Base" />
        <meta property="og:description" content="Lock messages for your future self on Base blockchain" />
        <meta property="og:image" content="https://basebox.vercel.app/og-image.png" />
      </head>
      <body className={inter.className}>
        <MiniAppProvider>
          {children}
        </MiniAppProvider>
      </body>
    </html>
  );
}